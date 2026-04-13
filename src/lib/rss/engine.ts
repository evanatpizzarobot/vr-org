import fs from "fs";
import path from "path";
import type { Article, FeedCache, SourceMeta } from "./types";
import { RSS_SOURCES } from "./sources";
import { fetchSource } from "./fetcher";
import { computeTrending } from "./trending";
import { refreshFeatured } from "@/lib/featured";

const REFRESH_INTERVAL = 15 * 60 * 1000; // 15 minutes
const REFRESH_LOCK_TIMEOUT = 5 * 60 * 1000; // 5 minutes
const STALE_ALERT_THRESHOLD = 2 * 60 * 60 * 1000; // 2 hours
const ALERT_COOLDOWN = 60 * 60 * 1000; // 1 hour between alerts
const CIRCUIT_BREAKER_THRESHOLD = 5;
const CIRCUIT_BREAKER_COOLDOWN = 24 * 60 * 60 * 1000; // 24 hours

const FEED_CACHE_PATH = path.join(process.cwd(), "data", "feed-cache.json");

// ===== In-Memory Cache =====
let cache: FeedCache = {
  articles: [],
  trending: [],
  sources: {},
  lastUpdated: "",
};

let refreshTimer: ReturnType<typeof setInterval> | null = null;
let isRefreshing = false;
let refreshStartedAt = 0;
let initialFetchDone = false;
let lastSuccessfulFetch = 0;
let lastAlertSentAt = 0;

// Per-source circuit breaker state
const sourceFailures: Record<string, number> = {};
const sourceDisabledUntil: Record<string, number> = {};
const sourceLastError: Record<string, string | null> = {};

export function getCache(): FeedCache {
  return cache;
}

export function isReady(): boolean {
  return initialFetchDone;
}

export function getLastSuccessfulFetch(): number {
  return lastSuccessfulFetch;
}

function deduplicateArticles(articles: Article[]): Article[] {
  const seen = new Map<string, Article>();
  for (const article of articles) {
    if (!seen.has(article.id)) {
      seen.set(article.id, article);
    }
  }
  return Array.from(seen.values());
}

function loadCacheFromDisk(): boolean {
  try {
    if (!fs.existsSync(FEED_CACHE_PATH)) return false;
    const raw = fs.readFileSync(FEED_CACHE_PATH, "utf-8");
    const parsed = JSON.parse(raw) as FeedCache & { savedAt?: string };
    if (!parsed.articles || !Array.isArray(parsed.articles)) return false;
    cache = {
      articles: parsed.articles,
      trending: parsed.trending || [],
      sources: parsed.sources || {},
      lastUpdated: parsed.lastUpdated || "",
    };
    initialFetchDone = true;
    console.log(
      `[VR.org] Warm-started from feed-cache.json: ${cache.articles.length} articles (saved ${parsed.savedAt || "unknown"})`
    );
    return true;
  } catch (err) {
    console.error("[VR.org] Failed to load feed-cache.json:", err);
    return false;
  }
}

function persistCacheToDisk(): void {
  try {
    const payload = { ...cache, savedAt: new Date().toISOString() };
    const tmp = `${FEED_CACHE_PATH}.tmp`;
    fs.writeFileSync(tmp, JSON.stringify(payload), "utf-8");
    fs.renameSync(tmp, FEED_CACHE_PATH);
  } catch (err) {
    console.error("[VR.org] Failed to persist feed-cache.json:", err);
  }
}

async function maybeFireStaleAlert(hoursStale: number): Promise<void> {
  const now = Date.now();
  if (hoursStale < STALE_ALERT_THRESHOLD / (60 * 60 * 1000)) return;
  if (now - lastAlertSentAt < ALERT_COOLDOWN) return;

  const webhookUrl = process.env.ALERT_WEBHOOK_URL;
  const resendKey = process.env.RESEND_API_KEY;
  const alertEmail = process.env.ALERT_EMAIL || "evan@pizzarobotstudios.com";
  const fromEmail = process.env.ALERT_FROM_EMAIL || "alerts@vr.org";

  const subject = `VR.org feed stale: ${hoursStale.toFixed(1)}h`;
  const message = `VR.org feed stale: ${hoursStale.toFixed(1)}h since last successful fetch. Sources: ${Object.entries(
    cache.sources
  )
    .map(([k, v]) => `${k}=${v.status}`)
    .join(", ")}`;

  console.error(`[VR.org ALERT] ${message}`);
  lastAlertSentAt = now;

  if (webhookUrl) {
    try {
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: message,
          content: message,
          hoursStale,
          sources: cache.sources,
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (err) {
      console.error("[VR.org] Failed to POST alert webhook:", err);
    }
  }

  if (resendKey) {
    try {
      const html = `<h2>${subject}</h2><p>${message}</p><pre>${JSON.stringify(cache.sources, null, 2)}</pre><p><a href="https://vr.org/api/feed-health">Check /api/feed-health</a></p>`;
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [alertEmail],
          subject,
          html,
          text: message,
        }),
      });
      if (!res.ok) {
        const body = await res.text();
        console.error(`[VR.org] Resend alert failed: ${res.status} ${body}`);
      }
    } catch (err) {
      console.error("[VR.org] Failed to send Resend alert:", err);
    }
  }
}

export async function refreshFeed(): Promise<void> {
  // Rescue stuck refresh state: if the previous run set isRefreshing but
  // never cleared it (crash, promise leak), unblock after 5 minutes.
  if (isRefreshing) {
    if (Date.now() - refreshStartedAt > REFRESH_LOCK_TIMEOUT) {
      console.warn(
        "[VR.org] Previous refresh appears stuck, forcibly clearing lock"
      );
      isRefreshing = false;
    } else {
      return;
    }
  }
  isRefreshing = true;
  refreshStartedAt = Date.now();

  console.log(`[VR.org] Refreshing feed from ${RSS_SOURCES.length} sources...`);

  const sourceStatuses: Record<string, SourceMeta> = {};
  const allArticles: Article[] = [];
  const now = Date.now();

  const results = await Promise.allSettled(
    RSS_SOURCES.map(async (source) => {
      // Circuit breaker: skip if currently disabled
      const disabledUntil = sourceDisabledUntil[source.key] || 0;
      if (disabledUntil > now) {
        sourceStatuses[source.key] = {
          name: source.name,
          count: 0,
          lastFetched: new Date(disabledUntil).toISOString(),
          status: "disabled",
          consecutiveFailures: sourceFailures[source.key] || 0,
          disabledUntil: new Date(disabledUntil).toISOString(),
          lastError: sourceLastError[source.key] || null,
        };
        return [];
      }

      try {
        const articles = await fetchSource(source);
        if (articles.length === 0) {
          // Zero articles is suspicious but not a hard failure; count it as
          // a soft error so we don't trip the breaker on a single empty page.
          sourceFailures[source.key] =
            (sourceFailures[source.key] || 0) + 1;
          sourceLastError[source.key] = "empty response";
        } else {
          sourceFailures[source.key] = 0;
          sourceLastError[source.key] = null;
        }
        sourceStatuses[source.key] = {
          name: source.name,
          count: articles.length,
          lastFetched: new Date().toISOString(),
          status: articles.length > 0 ? "ok" : "error",
          consecutiveFailures: sourceFailures[source.key],
          disabledUntil: null,
          lastError: sourceLastError[source.key],
        };
        return articles;
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        sourceFailures[source.key] = (sourceFailures[source.key] || 0) + 1;
        sourceLastError[source.key] = message;

        // Trip the breaker after N consecutive failures
        if (sourceFailures[source.key] >= CIRCUIT_BREAKER_THRESHOLD) {
          sourceDisabledUntil[source.key] = now + CIRCUIT_BREAKER_COOLDOWN;
          console.error(
            `[VR.org] Circuit breaker OPEN for ${source.name}: ${sourceFailures[source.key]} consecutive failures, disabled until ${new Date(sourceDisabledUntil[source.key]).toISOString()}`
          );
        } else {
          console.error(
            `[VR.org] Failed: ${source.name} (${sourceFailures[source.key]}/${CIRCUIT_BREAKER_THRESHOLD})`,
            message
          );
        }

        sourceStatuses[source.key] = {
          name: source.name,
          count: 0,
          lastFetched: new Date().toISOString(),
          status: "error",
          consecutiveFailures: sourceFailures[source.key],
          disabledUntil: sourceDisabledUntil[source.key]
            ? new Date(sourceDisabledUntil[source.key]).toISOString()
            : null,
          lastError: message,
        };
        return [];
      }
    })
  );

  for (const result of results) {
    if (result.status === "fulfilled") {
      allArticles.push(...result.value);
    }
  }

  const unique = deduplicateArticles(allArticles);
  unique.sort(
    (a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
  );
  const trimmed = unique.slice(0, 200);
  const trending = computeTrending(trimmed);

  const okCount = Object.values(sourceStatuses).filter(
    (s) => s.status === "ok"
  ).length;

  // Only replace the cache if we got SOMETHING. If every source failed,
  // keep serving the last known good data rather than blanking the homepage.
  if (trimmed.length > 0) {
    cache = {
      articles: trimmed,
      trending,
      sources: sourceStatuses,
      lastUpdated: new Date().toISOString(),
    };
    lastSuccessfulFetch = now;
    persistCacheToDisk();
  } else {
    // Still refresh source statuses so the health endpoint shows the failures
    cache = { ...cache, sources: sourceStatuses };
  }

  console.log(
    `[VR.org] Feed refreshed: ${trimmed.length} articles from ${okCount}/${RSS_SOURCES.length} sources`
  );

  // Auto-populate featured articles for category pages
  try {
    if (trimmed.length > 0) refreshFeatured(trimmed);
  } catch (err) {
    console.error("[VR.org] Failed to refresh featured articles:", err);
  }

  isRefreshing = false;
  initialFetchDone = true;

  // Fire stale alert if last success was too long ago
  if (lastSuccessfulFetch > 0) {
    const hoursStale = (Date.now() - lastSuccessfulFetch) / (60 * 60 * 1000);
    if (hoursStale >= STALE_ALERT_THRESHOLD / (60 * 60 * 1000)) {
      maybeFireStaleAlert(hoursStale).catch(() => {});
    }
  }
}

export function startFeedEngine(): void {
  if (refreshTimer) return;

  // Warm-start from persistent cache so the homepage isn't empty on boot
  loadCacheFromDisk();

  // Initial fetch
  refreshFeed().catch(console.error);

  // Schedule recurring refresh
  refreshTimer = setInterval(() => {
    refreshFeed().catch(console.error);
  }, REFRESH_INTERVAL);

  console.log(
    `[VR.org] Feed engine started - refreshing every ${REFRESH_INTERVAL / 60000} minutes`
  );
}

export function stopFeedEngine(): void {
  if (refreshTimer) {
    clearInterval(refreshTimer);
    refreshTimer = null;
  }
}
