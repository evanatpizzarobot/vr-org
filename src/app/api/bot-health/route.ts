import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Never serve a cached health response: UptimeRobot polls this and a stale 200
// would defeat the monitor entirely.
export const dynamic = "force-dynamic";

// Written by the X bot (bot/health.js) into the volume-mounted data dir.
const HEALTH_PATH = path.join(process.cwd(), "data", "bot-health.json");

// The bot wakes hourly; allow margin for one missed cycle before calling it down.
const HEARTBEAT_STALE_MIN = 90;
const FAILURE_THRESHOLD = 2;

interface BotHealth {
  lastCheckAt: string | null;
  lastSuccessAt: string | null;
  lastErrorAt: string | null;
  lastErrorCode: number | string | null;
  lastErrorMessage: string | null;
  consecutiveFailures: number;
}

export async function GET() {
  let health: BotHealth | null = null;
  try {
    if (fs.existsSync(HEALTH_PATH)) {
      health = JSON.parse(fs.readFileSync(HEALTH_PATH, "utf-8")) as BotHealth;
    }
  } catch {
    health = null;
  }

  if (!health || !health.lastCheckAt) {
    // No record yet (fresh boot, or bot never ran). Warn, but do not page.
    return NextResponse.json(
      { status: "warning", reason: "no bot health record yet" },
      { status: 200 }
    );
  }

  const now = Date.now();
  const minsSinceCheck = (now - new Date(health.lastCheckAt).getTime()) / 60000;
  const failures = health.consecutiveFailures || 0;
  const code = health.lastErrorCode;

  let status: "ok" | "warning" | "critical" = "ok";
  let httpStatus = 200;
  let reason = "posting normally";

  if (minsSinceCheck > HEARTBEAT_STALE_MIN) {
    status = "critical";
    httpStatus = 503;
    reason = `bot process not reporting (last cycle ${Math.round(minsSinceCheck)} min ago)`;
  } else if (code === 402) {
    status = "critical";
    httpStatus = 503;
    reason = "X API returned 402 Payment Required (out of credit or plan issue)";
  } else if (failures >= FAILURE_THRESHOLD) {
    status = "critical";
    httpStatus = 503;
    reason = `${failures} consecutive post failures (last error code ${code})`;
  }

  return NextResponse.json(
    {
      status,
      reason,
      lastCheckAt: health.lastCheckAt,
      lastSuccessAt: health.lastSuccessAt ?? null,
      lastErrorAt: health.lastErrorAt ?? null,
      lastErrorCode: code ?? null,
      consecutiveFailures: failures,
      minutesSinceLastCheck: Number(minsSinceCheck.toFixed(1)),
    },
    { status: httpStatus }
  );
}
