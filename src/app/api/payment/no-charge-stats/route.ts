import { NextRequest, NextResponse } from "next/server";
import { getRollup, listDates } from "@/lib/agent-payments/no-charge-ledger";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const date = searchParams.get("date") || undefined;
  const rollup = getRollup(date);
  const dates = listDates();

  return NextResponse.json(
    {
      site: "vr.org",
      view: "local",
      note: "VR.org maintains a local in-memory mirror of no-charge events for fast reads. The canonical network-wide ledger lives at https://tensorfeed.ai/api/payment/no-charge-stats. Local data resets on container restart.",
      authoritative_network_record:
        "https://tensorfeed.ai/api/payment/no-charge-stats",
      date: rollup?.date || date || new Date().toISOString().slice(0, 10),
      rollup,
      dates_available: dates,
      generated_at: new Date().toISOString(),
    },
    {
      headers: {
        "Cache-Control": "no-store",
        "Access-Control-Allow-Origin": "*",
      },
    },
  );
}
