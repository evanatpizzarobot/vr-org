import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Public events feed: the VR / AR / XR industry calendar (conferences, expos,
// launches) that powers /events. Exposed as JSON so the MCP servers (and any
// other consumer) can serve upcoming events in one call. Read-only.

const EVENTS_PATH = path.join(process.cwd(), "data", "events.json");

export async function GET() {
  try {
    if (!fs.existsSync(EVENTS_PATH)) {
      return NextResponse.json({ events: [], count: 0 });
    }
    const raw = fs.readFileSync(EVENTS_PATH, "utf-8");
    const parsed = JSON.parse(raw);
    const events = Array.isArray(parsed) ? parsed : [];
    // Soonest first by start date.
    const sorted = [...events].sort((a, b) =>
      String(a?.startDate ?? "").localeCompare(String(b?.startDate ?? ""))
    );
    return NextResponse.json({ events: sorted, count: sorted.length });
  } catch (err) {
    console.error("[VR.org] /api/events failed:", err);
    return NextResponse.json({ error: "Failed to load events" }, { status: 500 });
  }
}
