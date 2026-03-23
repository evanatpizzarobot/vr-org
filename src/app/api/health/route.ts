import { NextResponse } from "next/server";
import { getCache, startFeedEngine } from "@/lib/rss/engine";

startFeedEngine();

export async function GET() {
  const cache = getCache();
  return NextResponse.json({
    status: "ok",
    lastFetch: cache.lastUpdated || null,
    articleCount: cache.articles.length,
  });
}
