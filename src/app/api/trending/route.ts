import { NextResponse } from "next/server";
import { getCache, startFeedEngine } from "@/lib/rss/engine";

startFeedEngine();

export async function GET() {
  const cache = getCache();
  return NextResponse.json({
    topics: cache.trending,
    updatedAt: cache.lastUpdated,
  });
}
