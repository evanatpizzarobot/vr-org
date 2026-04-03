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

  articles = [...articles, ...editorialFeedItems].sort(
    (a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
  );

  if (category && category !== "all") {
    articles = articles.filter((a) => a.category === category || a.tags.includes(category));
  }

  if (tag) {
    articles = articles.filter((a) => a.tags.includes(tag));
  }

  const total = articles.length;
  const paginated = articles.slice(offset, offset + limit);

  return NextResponse.json({
    articles: paginated,
    meta: { total, lastUpdated: cache.lastUpdated },
  });
}
