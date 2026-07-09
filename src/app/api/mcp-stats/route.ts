// Aggregate adoption metrics for the remote MCP endpoint (/mcp).
// Read-only, aggregate-only (no IPs, no raw user agents). Separate from
// /api/stats on purpose: that route's contract is load-bearing for the
// WebTraffic Tracker and must not change.

import { NextResponse } from "next/server";
import { getMcpStats } from "@/lib/mcp/stats";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(getMcpStats(), {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=60",
    },
  });
}
