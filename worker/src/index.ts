import type { Env, Article, SourceMeta, FeedMeta } from "./types";
import { RSS_SOURCES } from "./sources";
import { fetchSource } from "./fetcher";
import { deduplicateArticles } from "./deduplicator";
import { computeTrending } from "./trending";

const CORS_ORIGINS = [
  "https://vr.org",
  "https://www.vr.org",
  "http://localhost:3000",
];

function corsHeaders(request: Request): Record<string, string> {
  const origin = request.headers.get("Origin") || "";
  const allowed = CORS_ORIGINS.includes(origin) ? origin : CORS_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
  };
}

function jsonResponse(data: unknown, request: Request, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders(request),
    },
  });
}

// ========== Cron: Fetch & Process All Feeds ==========

async function processFeed(env: Env): Promise<void> {
  console.log("Starting feed processing...");

  const sourceStatuses: Record<string, SourceMeta> = {};
  const allArticles: Article[] = [];

  // Fetch all sources in parallel
  const results = await Promise.allSettled(
    RSS_SOURCES.map(async (source) => {
      const start = Date.now();
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
        console.error(`Failed: ${source.name}`, err);
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

  // Collect all articles
  for (const result of results) {
    if (result.status === "fulfilled") {
      allArticles.push(...result.value);
    }
  }

  // Deduplicate
  const unique = deduplicateArticles(allArticles);

  // Sort by pubDate descending
  unique.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

  // Keep last 200
  const trimmed = unique.slice(0, 200);

  // Compute trending
  const trending = computeTrending(trimmed);

  // Compute meta
  const meta: FeedMeta = {
    lastUpdated: new Date().toISOString(),
    totalArticles: trimmed.length,
    activeSources: Object.values(sourceStatuses).filter((s) => s.status === "ok").length,
  };

  // Write to KV
  await Promise.all([
    env.FEED_KV.put("feed:articles", JSON.stringify(trimmed)),
    env.FEED_KV.put("feed:trending", JSON.stringify(trending)),
    env.FEED_KV.put("feed:sources", JSON.stringify(sourceStatuses)),
    env.FEED_KV.put("feed:meta", JSON.stringify(meta)),
  ]);

  console.log(
    `Feed processed: ${trimmed.length} articles from ${meta.activeSources} sources, ${trending.length} trending topics`
  );
}

// ========== API Route Handler ==========

async function handleRequest(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);

  // Handle CORS preflight
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders(request) });
  }

  // GET /api/feed
  if (url.pathname === "/api/feed") {
    const category = url.searchParams.get("category");
    const tag = url.searchParams.get("tag");
    const limit = parseInt(url.searchParams.get("limit") || "50", 10);
    const offset = parseInt(url.searchParams.get("offset") || "0", 10);

    const raw = await env.FEED_KV.get("feed:articles");
    const metaRaw = await env.FEED_KV.get("feed:meta");

    if (!raw) {
      return jsonResponse({ articles: [], meta: { total: 0, lastUpdated: "" } }, request);
    }

    let articles: Article[] = JSON.parse(raw);

    // Filter by category
    if (category && category !== "all") {
      articles = articles.filter((a) => a.category === category);
    }

    // Filter by tag
    if (tag) {
      articles = articles.filter((a) => a.tags.includes(tag));
    }

    const total = articles.length;
    const paginated = articles.slice(offset, offset + limit);
    const meta = metaRaw ? JSON.parse(metaRaw) : { lastUpdated: "" };

    return jsonResponse({ articles: paginated, meta: { total, lastUpdated: meta.lastUpdated } }, request);
  }

  // GET /api/trending
  if (url.pathname === "/api/trending") {
    const raw = await env.FEED_KV.get("feed:trending");
    const metaRaw = await env.FEED_KV.get("feed:meta");
    const meta = metaRaw ? JSON.parse(metaRaw) : {};

    return jsonResponse({
      topics: raw ? JSON.parse(raw) : [],
      updatedAt: meta.lastUpdated || "",
    }, request);
  }

  // GET /api/sources
  if (url.pathname === "/api/sources") {
    const raw = await env.FEED_KV.get("feed:sources");
    const metaRaw = await env.FEED_KV.get("feed:meta");
    const meta = metaRaw ? JSON.parse(metaRaw) : {};

    return jsonResponse({
      sources: raw ? JSON.parse(raw) : {},
      meta: {
        activeSources: meta.activeSources || 0,
        totalArticles: meta.totalArticles || 0,
      },
    }, request);
  }

  // GET /api/health
  if (url.pathname === "/api/health") {
    const metaRaw = await env.FEED_KV.get("feed:meta");
    const meta = metaRaw ? JSON.parse(metaRaw) : {};

    return jsonResponse({
      status: "ok",
      lastFetch: meta.lastUpdated || null,
      articleCount: meta.totalArticles || 0,
    }, request);
  }

  return jsonResponse({ error: "Not found" }, request, 404);
}

// ========== Worker Export ==========

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    return handleRequest(request, env);
  },

  async scheduled(_event: ScheduledEvent, env: Env, _ctx: ExecutionContext): Promise<void> {
    await processFeed(env);
  },
};
