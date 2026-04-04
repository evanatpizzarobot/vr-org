import { NextRequest, NextResponse } from "next/server";
import { getCache, startFeedEngine, isReady } from "@/lib/rss/engine";
import { MOCK_ARTICLES } from "@/lib/constants";
import { getAllArticles } from "@/lib/articles";
import type { Article } from "@/types";

// Ensure the feed engine is running
startFeedEngine();

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const category = searchParams.get("category");
  const tag = searchParams.get("tag");
  const limit = parseInt(searchParams.get("limit") || "50", 10);
  const offset = parseInt(searchParams.get("offset") || "0", 10);

  const cache = getCache();

  // If feeds haven't loaded yet, return mock data so the page isn't empty
  let articles: Article[] = cache.articles.length > 0 ? cache.articles : (isReady() ? [] : MOCK_ARTICLES);

  // Merge VR.org Original editorial articles into the feed
  const editorials = getAllArticles();
  const editorialFeedItems: Article[] = editorials.map((ea) => ({
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

  // Filter RSS articles by category/tag first
  if (category && category !== "all") {
    articles = articles.filter((a) => a.category === category || a.tags.includes(category));
  }

  if (tag) {
    articles = articles.filter((a) => a.tags.includes(tag));
  }

  // Filter editorial articles the same way
  let filteredEditorials = editorialFeedItems;
  if (category && category !== "all") {
    filteredEditorials = filteredEditorials.filter((a) => a.category === category || a.tags.includes(category));
  }
  if (tag) {
    filteredEditorials = filteredEditorials.filter((a) => a.tags.includes(tag));
  }

  // Paginate RSS articles, then merge originals so they always appear
  const paginatedRss = articles.slice(offset, offset + limit);
  const merged = [...paginatedRss, ...filteredEditorials].sort(
    (a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
  );

  // Deduplicate in case originals were already within the RSS window
  const seen = new Set<string>();
  const paginated = merged.filter((a) => {
    if (seen.has(a.id)) return false;
    seen.add(a.id);
    return true;
  });

  const total = articles.length + filteredEditorials.length;

  return NextResponse.json({
    articles: paginated,
    meta: { total, lastUpdated: cache.lastUpdated },
  });
}
