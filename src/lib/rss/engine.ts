import type { Article, FeedCache, SourceMeta } from "./types";
import { RSS_SOURCES } from "./sources";
import { fetchSource } from "./fetcher";
import { computeTrending } from "./trending";
import { refreshFeatured } from "@/lib/featured";

// ===== In-Memory Cache =====
let cache: FeedCache = {
  articles: [],
  trending: [],
  sources: {},
  lastUpdated: "",
};

let refreshTimer: ReturnType<typeof setInterval> | null = null;
let isRefreshing = false;
let initialFetchDone = false;

const REFRESH_INTERVAL = 15 * 60 * 1000; // 15 minutes

export function getCache(): FeedCache {
  return cache;
}

export function isReady(): boolean {
  return initialFetchDone;
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

export async function refreshFeed(): Promise<void> {
  if (isRefreshing) return;
  isRefreshing = true;

  console.log(`[VR.org] Refreshing feed from ${RSS_SOURCES.length} sources...`);

  const sourceStatuses: Record<string, SourceMeta> = {};
  const allArticles: Article[] = [];

  const results = await Promise.allSettled(
    RSS_SOURCES.map(async (source) => {
      try {
        const articles = await fetchSource(source);
        sourceStatuses[source.key] = {
          name: source.name,
          count: articles.length,
          lastFetched: new Date().toISOString(),
          status: "ok",
        };
        return articles;
      } catch (err) {
        console.error(`[VR.org] Failed: ${source.name}`, err);
        sourceStatuses[source.key] = {
          name: source.name,
          count: 0,
          lastFetched: new Date().toISOString(),
          status: "error",
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

  cache = {
    articles: trimmed,
    trending,
    sources: sourceStatuses,
    lastUpdated: new Date().toISOString(),
  };

  const okCount = Object.values(sourceStatuses).filter(
    (s) => s.status === "ok"
  ).length;
  console.log(
    `[VR.org] Feed refreshed: ${trimmed.length} articles from ${okCount}/${RSS_SOURCES.length} sources`
  );

  // Auto-populate featured articles for category pages
  try {
    refreshFeatured(trimmed);
  } catch (err) {
    console.error("[VR.org] Failed to refresh featured articles:", err);
  }

  isRefreshing = false;
  initialFetchDone = true;
}

export function startFeedEngine(): void {
  if (refreshTimer) return;

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
