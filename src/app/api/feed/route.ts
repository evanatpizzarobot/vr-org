import { NextRequest, NextResponse } from "next/server";
import { getCache, startFeedEngine } from "@/lib/rss/engine";

// Ensure the feed engine is running
startFeedEngine();

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const category = searchParams.get("category");
  const tag = searchParams.get("tag");
  const limit = parseInt(searchParams.get("limit") || "50", 10);
  const offset = parseInt(searchParams.get("offset") || "0", 10);

  const cache = getCache();
  let articles = cache.articles;

  if (category && category !== "all") {
    articles = articles.filter((a) => a.category === category);
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
