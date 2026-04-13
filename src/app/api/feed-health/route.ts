import { NextResponse } from "next/server";
import {
  getCache,
  getLastSuccessfulFetch,
  startFeedEngine,
} from "@/lib/rss/engine";

startFeedEngine();

export async function GET() {
  const cache = getCache();
  const lastSuccessMs = getLastSuccessfulFetch();
  const now = Date.now();
  const hoursStale =
    lastSuccessMs > 0 ? (now - lastSuccessMs) / (60 * 60 * 1000) : null;

  let status: "ok" | "warning" | "critical";
  let httpStatus = 200;

  if (hoursStale === null) {
    // Engine still starting up, no successful fetch yet
    status = "warning";
  } else if (hoursStale > 1) {
    status = "critical";
    httpStatus = 500;
  } else if (hoursStale > 0.5) {
    status = "warning";
  } else {
    status = "ok";
  }

  return NextResponse.json(
    {
      status,
      lastUpdateTimestamp: cache.lastUpdated || null,
      lastSuccessfulFetch:
        lastSuccessMs > 0 ? new Date(lastSuccessMs).toISOString() : null,
      hoursStale: hoursStale !== null ? Number(hoursStale.toFixed(2)) : null,
      totalItems: cache.articles.length,
      sourceStatuses: cache.sources,
    },
    { status: httpStatus }
  );
}
