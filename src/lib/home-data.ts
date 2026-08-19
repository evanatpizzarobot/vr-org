import { getCache, startFeedEngine, isReady } from "@/lib/rss/engine";
import { getAllArticles } from "@/lib/articles";
import { MOCK_ARTICLES, MOCK_TRENDING } from "@/lib/constants";
import type { Article, TrendingTopic } from "@/types";

// Server-side homepage data. Mirrors what the client currently fetches from
// /api/feed (+ originals merge), /api/trending, /api/sources, and
// /api/articles?mix=true&limit=4, but reads the in-memory engine cache directly
// so the homepage can be server-rendered with content already in the HTML.
// Keep this in lockstep with those route handlers.

export interface EditorialSummary {
  id: string;
  slug: string;
  title: string;
  author: string;
  authorRole: string;
  snippet: string;
  publishDate: string;
  category: string;
  tags: string[];
  breaking?: boolean | string;
}

export interface HomeInitialData {
  feedArticles: Article[];
  trending: TrendingTopic[];
  sourceStats: Record<string, { name: string; count: number }>;
  lastUpdated: string;
  editorials: EditorialSummary[];
}

const FEED_LIMIT = 50;
// Cap the server-rendered homepage feed so the SSR HTML stays lean on the
// 1-CPU VPS. The client still hydrates and polls /api/feed for the full live
// feed afterward, so nothing is lost; this only trims the initial render.
const HOME_FEED_MAX = 70;

// Replica of the /api/articles?mix=true logic: all of today's originals first,
// then one per unused author, then fill by unused category, then newest.
function mixEditorials(limit: number): EditorialSummary[] {
  const all = getAllArticles();
  const todayIso = new Date().toISOString().slice(0, 10);
  const today = all.filter((a) => a.publishDate === todayIso);
  const older = all.filter((a) => a.publishDate !== todayIso);

  const picked = today.slice(0, limit);
  const pickedIds = new Set(picked.map((p) => p.id));
  const usedAuthors = new Set(picked.map((p) => p.author));
  const usedCategories = new Set(picked.map((p) => p.category));

  for (const a of older) {
    if (picked.length >= limit) break;
    if (!usedAuthors.has(a.author)) {
      usedAuthors.add(a.author);
      usedCategories.add(a.category);
      picked.push(a);
      pickedIds.add(a.id);
    }
  }
  if (picked.length < limit) {
    for (const a of older) {
      if (picked.length >= limit) break;
      if (!pickedIds.has(a.id) && !usedCategories.has(a.category)) {
        usedCategories.add(a.category);
        picked.push(a);
        pickedIds.add(a.id);
      }
    }
  }
  if (picked.length < limit) {
    for (const a of older) {
      if (picked.length >= limit) break;
      if (!pickedIds.has(a.id)) {
        picked.push(a);
        pickedIds.add(a.id);
      }
    }
  }

  return picked.map((a) => ({
    id: a.id,
    slug: a.slug,
    title: a.title,
    author: a.author,
    authorRole: a.authorRole,
    snippet: a.snippet,
    publishDate: a.publishDate,
    category: a.category,
    tags: a.tags,
    breaking: a.breaking,
  }));
}

export function getHomeInitialData(): HomeInitialData {
  startFeedEngine();
  const cache = getCache();
  const ready = isReady();

  // RSS articles, with the same not-ready fallback the /api/feed route uses.
  const rss: Article[] = cache.articles.length > 0 ? cache.articles : ready ? [] : MOCK_ARTICLES;

  // Merge VR.org originals into the feed (mirrors /api/feed, no category/tag filter).
  const editorialArticles = getAllArticles();
  const editorialFeedItems: Article[] = editorialArticles.map((ea) => ({
    id: `vrorg-${ea.id}`,
    source: "vrorg",
    sourceName: "VR.org",
    title: ea.title,
    snippet: ea.snippet,
    link: `/articles/${ea.slug}`,
    author: ea.author,
    pubDate: new Date(ea.publishDate).toISOString(),
    category: ea.category,
    tags: ea.tags,
    imageUrl: null,
  }));

  const merged = [...rss.slice(0, FEED_LIMIT), ...editorialFeedItems].sort(
    (a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
  );
  const seen = new Set<string>();
  const feedArticles = merged
    .filter((a) => {
      if (seen.has(a.id)) return false;
      seen.add(a.id);
      return true;
    })
    .slice(0, HOME_FEED_MAX);

  // Trending, with the same not-ready fallback the /api/trending route uses.
  const trending: TrendingTopic[] =
    cache.trending.length > 0 ? cache.trending : ready ? [] : MOCK_TRENDING;

  // Source stats, mirroring /api/sources (adds the VR.org editorial entry).
  const sourceStats: Record<string, { name: string; count: number }> = { ...cache.sources };
  if (editorialArticles.length > 0) {
    sourceStats.vrorg = { name: "VR.org", count: editorialArticles.length };
  }

  return {
    feedArticles,
    trending,
    sourceStats,
    lastUpdated: cache.lastUpdated,
    editorials: mixEditorials(4),
  };
}
