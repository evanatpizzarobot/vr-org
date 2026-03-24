import { NextResponse } from "next/server";
import { getCache, startFeedEngine } from "@/lib/rss/engine";
import { getAllArticles } from "@/lib/articles";

startFeedEngine();

export async function GET() {
  const cache = getCache();

  // Include VR.org editorial articles in source stats
  const editorialArticles = getAllArticles();
  const sources = { ...cache.sources };
  if (editorialArticles.length > 0) {
    sources.vrorg = {
      name: "VR.org",
      count: editorialArticles.length,
      lastFetched: new Date().toISOString(),
      status: "ok",
    };
  }

  const activeSources = Object.values(sources).filter(
    (s) => s.status === "ok"
  ).length;

  return NextResponse.json({
    sources,
    meta: {
      activeSources,
      totalArticles: cache.articles.length + editorialArticles.length,
    },
  });
}
