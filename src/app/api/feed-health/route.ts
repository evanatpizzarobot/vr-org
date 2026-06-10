import { NextResponse } from "next/server";
import {
  getCache,
  getEngineStartedAt,
  getLastSuccessfulFetch,
  startFeedEngine,
} from "@/lib/rss/engine";

startFeedEngine();

// Right after a deploy the staleness clock may be seeded from an old
// feed-cache.json snapshot while the first live fetch is still in flight.
// Hold the 503 for a few minutes of process uptime so a routine restart
// cannot trip the UptimeRobot alert; a genuinely broken boot still goes
// critical once the grace expires.
const BOOT_GRACE_MS = 5 * 60 * 1000;

export async function GET() {
  const cache = getCache();
  const lastSuccessMs = getLastSuccessfulFetch();
  const now = Date.now();
  const hoursStale =
    lastSuccessMs > 0 ? (now - lastSuccessMs) / (60 * 60 * 1000) : null;
  const startedAt = getEngineStartedAt();
  const inBootGrace = startedAt > 0 && now - startedAt < BOOT_GRACE_MS;

  let status: "ok" | "warning" | "critical";
  let httpStatus = 200;

  if (hoursStale === null) {
    // Engine still starting up, no successful fetch yet
    status = "warning";
  } else if (hoursStale > 1) {
    if (inBootGrace) {
      status = "warning";
    } else {
      status = "critical";
      httpStatus = 503;
    }
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
      engineUptimeSeconds:
        startedAt > 0 ? Math.round((now - startedAt) / 1000) : null,
      totalItems: cache.articles.length,
      sourceStatuses: cache.sources,
    },
    { status: httpStatus }
  );
}
