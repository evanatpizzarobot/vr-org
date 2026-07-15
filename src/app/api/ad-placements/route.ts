import { NextResponse } from "next/server";
import { getAdPlacements } from "@/lib/ad-placements";

// Serves the direct-sold ad placement config to the client AdZone component.
// force-dynamic so an edit to data/ad-placements.json on the VPS takes effect
// immediately (the file is volume-mounted), with no rebuild.
export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json({ placements: getAdPlacements() });
}
