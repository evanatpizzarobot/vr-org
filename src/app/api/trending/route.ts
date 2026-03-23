import { NextResponse } from "next/server";
import { getCache, startFeedEngine, isReady } from "@/lib/rss/engine";
import { MOCK_TRENDING } from "@/lib/constants";

startFeedEngine();

export async function GET() {
  const cache = getCache();
  const topics = cache.trending.length > 0 ? cache.trending : (isReady() ? [] : MOCK_TRENDING);
  return NextResponse.json({
    topics,
    updatedAt: cache.lastUpdated,
  });
}
