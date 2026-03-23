import { NextResponse } from "next/server";
import { getCache, startFeedEngine } from "@/lib/rss/engine";

startFeedEngine();

export async function GET() {
  const cache = getCache();
  const activeSources = Object.values(cache.sources).filter(
    (s) => s.status === "ok"
  ).length;

  return NextResponse.json({
    sources: cache.sources,
    meta: {
      activeSources,
      totalArticles: cache.articles.length,
    },
  });
}
