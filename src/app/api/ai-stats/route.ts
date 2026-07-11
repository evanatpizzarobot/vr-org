import * as fs from "fs/promises";
import * as zlib from "zlib";
import { promisify } from "util";

const gunzip = promisify(zlib.gunzip);

// The /var/log/nginx directory is mounted read-only into the container
// (docker-compose.yml). This endpoint is intentionally SEPARATE from
// /api/stats: that one feeds the external WebTraffic Tracker on a fixed
// contract and must stay byte-for-byte stable. All AI-traffic reporting
// lives here so it can grow freely.
export const dynamic = "force-dynamic";

const ACCESS_LOG = "/var/log/nginx/access.log";
const CACHE_TTL = 60 * 1000; // 60s

// Combined log format:
//   IP - - [date] "METHOD path HTTP/x" status bytes "referer" "user-agent"
const LINE_RE =
  /^(\S+) \S+ \S+ \[([^\]]+)\] "(\S+) (\S+)[^"]*" (\d+) \S+ "([^"]*)" "([^"]*)"/;

const NGINX_DATE_RE = /^(\d+)\/(\w+)\/(\d+):(\d+):(\d+):(\d+) ([+-]\d+)$/;
const MONTH: Record<string, string> = {
  Jan: "01", Feb: "02", Mar: "03", Apr: "04", May: "05", Jun: "06",
  Jul: "07", Aug: "08", Sep: "09", Oct: "10", Nov: "11", Dec: "12",
};

function parseNginxDate(s: string): number {
  const m = s.match(NGINX_DATE_RE);
  if (!m) return 0;
  const [, d, mon, y, h, mi, se, tz] = m;
  const iso = `${y}-${MONTH[mon] || "01"}-${d.padStart(2, "0")}T${h}:${mi}:${se}${tz}`;
  return new Date(iso).getTime();
}

// AI-assistant and model crawlers. Matching is case-insensitive substring on
// the user-agent; tokens are distinct product names so each UA maps to exactly
// one bot. Order matters only for the Applebot / Applebot-Extended pair below.
interface BotDef {
  token: string;
  name: string;
  label: string;
  vendor: string;
  // "live" = fetched a page to answer a user's question right now (cited now);
  // "crawl" = indexing or training for later (ingested for later). Only set on
  // AI_BOTS; SEARCH_BOTS omit it.
  mode?: "live" | "crawl";
}

const AI_BOTS: BotDef[] = [
  { token: "chatgpt-user", name: "chatgpt-user", label: "ChatGPT (live answers)", vendor: "OpenAI", mode: "live" },
  { token: "oai-searchbot", name: "oai-searchbot", label: "OpenAI SearchBot", vendor: "OpenAI", mode: "crawl" },
  { token: "gptbot", name: "gptbot", label: "GPTBot (training)", vendor: "OpenAI", mode: "crawl" },
  { token: "claude-user", name: "claude-user", label: "Claude (live answers)", vendor: "Anthropic", mode: "live" },
  { token: "claude-web", name: "claude-web", label: "Claude-Web", vendor: "Anthropic", mode: "live" },
  { token: "claudebot", name: "claudebot", label: "ClaudeBot (crawler)", vendor: "Anthropic", mode: "crawl" },
  { token: "anthropic-ai", name: "anthropic-ai", label: "anthropic-ai", vendor: "Anthropic", mode: "crawl" },
  { token: "perplexitybot", name: "perplexitybot", label: "PerplexityBot", vendor: "Perplexity", mode: "crawl" },
  { token: "perplexity-user", name: "perplexity-user", label: "Perplexity (live)", vendor: "Perplexity", mode: "live" },
  { token: "bytespider", name: "bytespider", label: "Bytespider", vendor: "ByteDance", mode: "crawl" },
  { token: "amazonbot", name: "amazonbot", label: "Amazonbot", vendor: "Amazon", mode: "crawl" },
  { token: "duckassistbot", name: "duckassistbot", label: "DuckAssist", vendor: "DuckDuckGo", mode: "live" },
  { token: "meta-externalagent", name: "meta-ai", label: "Meta AI", vendor: "Meta", mode: "live" },
  { token: "google-extended", name: "google-extended", label: "Google-Extended", vendor: "Google", mode: "crawl" },
  { token: "applebot-extended", name: "applebot-extended", label: "Applebot-Extended", vendor: "Apple", mode: "crawl" },
  { token: "cohere-ai", name: "cohere-ai", label: "cohere-ai", vendor: "Cohere", mode: "crawl" },
  { token: "ccbot", name: "ccbot", label: "CCBot (Common Crawl)", vendor: "Common Crawl", mode: "crawl" },
  { token: "youbot", name: "youbot", label: "YouBot", vendor: "You.com", mode: "crawl" },
];

// Traditional search crawlers, kept for AI-vs-search context. Checked only
// after the AI list, so "applebot-extended" is classed as AI and plain
// "applebot" as search.
const SEARCH_BOTS: BotDef[] = [
  { token: "googlebot", name: "googlebot", label: "Googlebot", vendor: "Google" },
  { token: "bingbot", name: "bingbot", label: "Bingbot", vendor: "Microsoft" },
  { token: "yandexbot", name: "yandexbot", label: "YandexBot", vendor: "Yandex" },
  { token: "baiduspider", name: "baiduspider", label: "Baiduspider", vendor: "Baidu" },
  { token: "duckduckbot", name: "duckduckbot", label: "DuckDuckBot", vendor: "DuckDuckGo" },
  { token: "applebot", name: "applebot", label: "Applebot", vendor: "Apple" },
];

function classify(uaLower: string, defs: BotDef[]): BotDef | null {
  for (const b of defs) {
    if (uaLower.includes(b.token)) return b;
  }
  return null;
}

function isPageview(pathNoQuery: string): boolean {
  if (
    pathNoQuery.startsWith("/_next") ||
    pathNoQuery.startsWith("/api") ||
    pathNoQuery.startsWith("/space-bg")
  ) {
    return false;
  }
  return !/\.(js|css|png|jpe?g|webp|avif|gif|svg|ico|woff2?|xml|txt|json|map|webmanifest|mp4)$/i.test(
    pathNoQuery,
  );
}

// A 404 worth surfacing on the console: a real page-ish path, not obvious
// scanner noise (/.env, /wp-login.php, /vendor/..., *.php, dotfiles) and not a
// static asset. Keeps the "broken links" report actionable instead of drowning
// it in bot probes.
const SCANNER_404 =
  /\.(php|aspx?|asp|jsp|cgi|env|git|ya?ml|ini|bak|sql|sh)$|(^|\/)\.[^/]|wp-|xmlrpc|phpmyadmin|\/vendor\/|\/admin/i;
function isPageLike404(pathNoQuery: string): boolean {
  return isPageview(pathNoQuery) && !SCANNER_404.test(pathNoQuery);
}

function refererHost(ref: string): string {
  if (!ref || ref === "-") return "";
  const m = ref.match(/^https?:\/\/([^/]+)/i);
  return m ? m[1].toLowerCase() : "";
}

function utmSource(pathWithQuery: string): string {
  const m = pathWithQuery.match(/[?&]utm_source=([^&]+)/i);
  if (!m) return "";
  try {
    return decodeURIComponent(m[1]).toLowerCase();
  } catch {
    return m[1].toLowerCase();
  }
}

// Which AI assistant sent a human here (utm tag or referer host).
function aiReferralSource(host: string, utm: string): string | null {
  if (utm.includes("chatgpt") || host === "chatgpt.com" || host === "chat.openai.com") return "chatgpt";
  if (utm.includes("perplexity") || host.endsWith("perplexity.ai")) return "perplexity";
  if (host === "gemini.google.com" || utm.includes("gemini")) return "gemini";
  if (host === "claude.ai" || utm.includes("claude")) return "claude";
  if (host === "copilot.microsoft.com" || utm.includes("copilot")) return "copilot";
  return null;
}

interface BotStat {
  name: string;
  label: string;
  vendor: string;
  hits: number;
  uniqueIps: number;
}

interface PageStat {
  path: string;
  hits: number;
}

interface AiStatsResponse {
  version: string;
  fetchedAt: number;
  windowHours: number;
  bots: BotStat[];
  botsTotalHits: number;
  vendorTotals: Record<string, number>;
  chatgptUser: {
    hits: number;
    uniqueIps: number;
    distinctPages: number;
    status2xx: number;
    statusOther: number;
    topPages: PageStat[];
    hourlyUtc: number[];
  };
  referrals: {
    total: number;
    bySource: Record<string, number>;
    chatgptUniqueVisitors: number;
  };
  topReferrers: Array<{ host: string; pageviews: number }>;
  searchReference: Record<string, number>;
  // Top pages by human pageview (non-bot, non-asset), 24h.
  humanTopPages: PageStat[];
  // Page-like paths returning 404 in 24h (scanner noise filtered out).
  notFound: PageStat[];
  // AI reads split by intent: live answers (cited now) vs crawl/training
  // (ingested for later).
  aiModes: {
    live: { hits: number; uniqueIps: number };
    crawl: { hits: number; uniqueIps: number };
  };
  // Instrumentation-ready fields. These stay `available:false` / empty until the
  // nginx log_format carries the trailing `rt=` / `cache=` / `cc=` fields (see the
  // ops note handed to Mark). Parsing auto-activates the moment they appear; no
  // code change needed. Sourced here (not /api/stats) so the frozen stats contract
  // is untouched.
  latency: {
    available: boolean;
    avgMs: number;
    p50Ms: number;
    p95Ms: number;
    samples: number;
  };
  cache: {
    available: boolean;
    hitRatio: number;
    hits: number;
    total: number;
    byStatus: Record<string, number>;
  };
  geo: {
    available: boolean;
    topCountries: Array<{ code: string; visitors: number }>;
  };
}

async function readLast24hContents(): Promise<string[]> {
  // access.log (today) + access.log.1 (yesterday, full) always covers a rolling
  // 24h window regardless of time of day, since rotation runs at 00:00.
  const files = [ACCESS_LOG, ACCESS_LOG + ".1"];
  const out: string[] = [];
  for (const f of files) {
    try {
      out.push(await fs.readFile(f, "utf-8"));
    } catch {
      // File may be missing (e.g. before first rotation) or unreadable.
    }
  }
  return out;
}

function generateAiStats(contents: string[]): AiStatsResponse {
  const now = Date.now();
  const cutoff = now - 24 * 60 * 60 * 1000;

  const botHits: Record<string, number> = {};
  const botIps: Record<string, Set<string>> = {};
  const vendorTotals: Record<string, number> = {};
  const searchReference: Record<string, number> = {};

  const cguPages: Record<string, number> = {};
  const cguIps = new Set<string>();
  const cguHourly = new Array<number>(24).fill(0);
  let cguHits = 0;
  let cgu2xx = 0;
  let cguOther = 0;

  const pvHost: Record<string, number> = {};
  const referralBySource: Record<string, number> = {};
  const chatgptRefIps = new Set<string>();
  let referralTotal = 0;

  const pvPath: Record<string, number> = {};
  const notFoundCounts: Record<string, number> = {};
  const modeHits = { live: 0, crawl: 0 };
  const modeIps = { live: new Set<string>(), crawl: new Set<string>() };

  // Instrumentation-ready accumulators (dormant until nginx emits the trailing fields).
  const cacheByStatus: Record<string, number> = {};
  let cacheSeen = false;
  const latSamples: number[] = [];
  let latSum = 0;
  let latSeen = false;
  const countryIps: Record<string, Set<string>> = {};
  let geoSeen = false;

  for (const content of contents) {
    for (const line of content.split("\n")) {
      if (!line) continue;
      const m = line.match(LINE_RE);
      if (!m) continue;

      const ip = m[1];
      const ts = parseNginxDate(m[2]);
      if (!ts || ts < cutoff) continue;

      const rawPath = m[4];
      const status = parseInt(m[5], 10);
      const referer = m[6];
      const ua = m[7];
      const uaLower = ua.toLowerCase();
      const pathNoQuery = rawPath.split("?")[0];

      // Trailing nginx fields, parsed only from the segment AFTER the user-agent's
      // closing quote so referer/UA text (which can contain cache=/rt=/cc=) never
      // false-matches. All optional and independent: any subset can be present.
      let country = "";
      const tailIdx = line.lastIndexOf('"');
      if (tailIdx >= 0) {
        const tail = line.slice(tailIdx + 1);
        const cM = tail.match(/cache=(\S+)/);
        if (cM) {
          cacheSeen = true;
          if (cM[1] !== "-") cacheByStatus[cM[1]] = (cacheByStatus[cM[1]] || 0) + 1;
        }
        const rM = tail.match(/rt=([\d.]+)/);
        if (rM) {
          latSeen = true;
          const ms = parseFloat(rM[1]) * 1000;
          if (isFinite(ms)) {
            latSum += ms;
            if (latSamples.length < 250000) latSamples.push(ms);
          }
        }
        const gM = tail.match(/cc=([A-Za-z-]+)/);
        if (gM) {
          geoSeen = true;
          country = gM[1].toUpperCase();
        }
      }

      // Broken-path report: page-like 404s from anyone (humans or bots).
      if (status === 404 && isPageLike404(pathNoQuery)) {
        notFoundCounts[pathNoQuery] = (notFoundCounts[pathNoQuery] || 0) + 1;
      }

      const bot = classify(uaLower, AI_BOTS);
      if (bot) {
        botHits[bot.name] = (botHits[bot.name] || 0) + 1;
        (botIps[bot.name] ||= new Set<string>()).add(ip);
        vendorTotals[bot.vendor] = (vendorTotals[bot.vendor] || 0) + 1;
        if (bot.mode) {
          modeHits[bot.mode] += 1;
          modeIps[bot.mode].add(ip);
        }

        if (bot.name === "chatgpt-user") {
          cguHits++;
          cguIps.add(ip);
          cguPages[pathNoQuery] = (cguPages[pathNoQuery] || 0) + 1;
          if (status >= 200 && status < 300) cgu2xx++;
          else cguOther++;
          const hour = new Date(ts).getUTCHours();
          if (hour >= 0 && hour < 24) cguHourly[hour]++;
        }
        continue;
      }

      const search = classify(uaLower, SEARCH_BOTS);
      if (search) {
        searchReference[search.label] = (searchReference[search.label] || 0) + 1;
        continue;
      }

      // Human-ish traffic: only count real page navigations.
      if (!isPageview(pathNoQuery)) continue;
      const host = refererHost(referer);
      pvHost[host || "(direct)"] = (pvHost[host || "(direct)"] || 0) + 1;
      // Top pages = successful pageviews only. Without this, a heavily-probed
      // non-existent path (e.g. a scanner hammering /datacenters/hong-kong-vps)
      // would rank as a "top page" while also showing under Broken paths.
      if (status < 400) pvPath[pathNoQuery] = (pvPath[pathNoQuery] || 0) + 1;
      if (country && country !== "-") {
        (countryIps[country] ||= new Set<string>()).add(ip);
      }

      const src = aiReferralSource(host, utmSource(rawPath));
      if (src) {
        referralTotal++;
        referralBySource[src] = (referralBySource[src] || 0) + 1;
        if (src === "chatgpt") chatgptRefIps.add(ip);
      }
    }
  }

  const bots: BotStat[] = AI_BOTS
    .filter((b) => (botHits[b.name] || 0) > 0)
    .map((b) => ({
      name: b.name,
      label: b.label,
      vendor: b.vendor,
      hits: botHits[b.name] || 0,
      uniqueIps: botIps[b.name] ? botIps[b.name].size : 0,
    }))
    .sort((a, b) => b.hits - a.hits);

  const botsTotalHits = bots.reduce((s, b) => s + b.hits, 0);

  const topPages: PageStat[] = Object.entries(cguPages)
    .map(([path, hits]) => ({ path, hits }))
    .sort((a, b) => b.hits - a.hits)
    .slice(0, 20);

  const topReferrers = Object.entries(pvHost)
    .map(([host, pageviews]) => ({ host, pageviews }))
    .sort((a, b) => b.pageviews - a.pageviews)
    .slice(0, 15);

  const humanTopPages: PageStat[] = Object.entries(pvPath)
    .map(([path, hits]) => ({ path, hits }))
    .sort((a, b) => b.hits - a.hits)
    .slice(0, 15);

  const notFound: PageStat[] = Object.entries(notFoundCounts)
    .map(([path, hits]) => ({ path, hits }))
    .sort((a, b) => b.hits - a.hits)
    .slice(0, 12);

  // Latency percentiles from request-time samples (empty until nginx emits rt=).
  const latSorted = latSamples.slice().sort((a, b) => a - b);
  const pctl = (p: number): number =>
    latSorted.length ? latSorted[Math.min(latSorted.length - 1, Math.floor(p * latSorted.length))] : 0;
  const round1 = (n: number): number => Math.round(n * 10) / 10;

  // Cache hit ratio over cacheable outcomes only (BYPASS / "-" excluded).
  const CACHEABLE = ["HIT", "MISS", "EXPIRED", "STALE", "REVALIDATED", "UPDATING"];
  let cacheHits = 0;
  let cacheable = 0;
  for (const [k, v] of Object.entries(cacheByStatus)) {
    if (CACHEABLE.includes(k)) {
      cacheable += v;
      if (k === "HIT") cacheHits += v;
    }
  }

  const topCountries = Object.entries(countryIps)
    .map(([code, ips]) => ({ code, visitors: ips.size }))
    .sort((a, b) => b.visitors - a.visitors)
    .slice(0, 12);

  return {
    version: "1.0",
    fetchedAt: now,
    windowHours: 24,
    bots,
    botsTotalHits,
    vendorTotals,
    chatgptUser: {
      hits: cguHits,
      uniqueIps: cguIps.size,
      distinctPages: Object.keys(cguPages).length,
      status2xx: cgu2xx,
      statusOther: cguOther,
      topPages,
      hourlyUtc: cguHourly,
    },
    referrals: {
      total: referralTotal,
      bySource: referralBySource,
      chatgptUniqueVisitors: chatgptRefIps.size,
    },
    topReferrers,
    searchReference,
    humanTopPages,
    notFound,
    aiModes: {
      live: { hits: modeHits.live, uniqueIps: modeIps.live.size },
      crawl: { hits: modeHits.crawl, uniqueIps: modeIps.crawl.size },
    },
    latency: {
      available: latSeen,
      avgMs: latSamples.length ? round1(latSum / latSamples.length) : 0,
      p50Ms: round1(pctl(0.5)),
      p95Ms: round1(pctl(0.95)),
      samples: latSamples.length,
    },
    cache: {
      available: cacheSeen,
      hitRatio: cacheable ? round1((cacheHits / cacheable) * 100) : 0,
      hits: cacheHits,
      total: cacheable,
      byStatus: cacheByStatus,
    },
    geo: {
      available: geoSeen,
      topCountries,
    },
  };
}

// Optional multi-day trend (?trend=N, default off). Cheap whole-line substring
// scan of the rotated daily logs for the headline bots, so the default 24h call
// stays fast on the 1-CPU box.
interface TrendDay {
  date: string;
  chatgptUser: number;
  aiTotal: number;
}

const TREND_TOKENS = AI_BOTS.map((b) => b.token);

async function readRotated(index: number): Promise<string | null> {
  // index 1 = access.log.1 (plain, yesterday); index >= 2 = access.log.N.gz
  const path = `${ACCESS_LOG}.${index}${index >= 2 ? ".gz" : ""}`;
  try {
    if (index >= 2) {
      const buf = await fs.readFile(path);
      return (await gunzip(buf)).toString("utf-8");
    }
    return await fs.readFile(path, "utf-8");
  } catch {
    return null;
  }
}

async function generateTrend(days: number): Promise<TrendDay[]> {
  const out: TrendDay[] = [];
  const oneDay = 24 * 60 * 60 * 1000;
  for (let i = 1; i <= days; i++) {
    const content = await readRotated(i);
    const date = new Date(Date.now() - i * oneDay).toISOString().slice(0, 10);
    if (content === null) {
      out.push({ date, chatgptUser: 0, aiTotal: 0 });
      continue;
    }
    let chatgptUser = 0;
    let aiTotal = 0;
    for (const line of content.split("\n")) {
      if (!line) continue;
      const lower = line.toLowerCase();
      if (lower.includes("chatgpt-user")) chatgptUser++;
      for (const t of TREND_TOKENS) {
        if (lower.includes(t)) {
          aiTotal++;
          break;
        }
      }
    }
    out.push({ date, chatgptUser, aiTotal });
  }
  return out;
}

let cached: AiStatsResponse | null = null;
let cachedAt = 0;

const CORS = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Cache-Control": "public, max-age=60",
};

export async function GET(request: Request) {
  const now = Date.now();
  const url = new URL(request.url);
  const trendParam = parseInt(url.searchParams.get("trend") || "0", 10);
  const trendDays = Number.isFinite(trendParam) ? Math.min(Math.max(trendParam, 0), 14) : 0;

  try {
    let base = cached;
    if (!base || now - cachedAt >= CACHE_TTL) {
      const contents = await readLast24hContents();
      base = generateAiStats(contents);
      cached = base;
      cachedAt = now;
    }

    const payload: AiStatsResponse & { trend?: TrendDay[] } = { ...base };
    if (trendDays > 0) {
      payload.trend = await generateTrend(trendDays);
    }

    return new Response(JSON.stringify(payload), { headers: CORS });
  } catch (err) {
    console.error("Failed to generate AI stats:", err);
    return new Response(JSON.stringify({ error: "Failed to generate AI stats" }), {
      status: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
