import { NextResponse } from "next/server";
import {
  describeSLAs,
  ENDPOINT_FRESHNESS,
} from "@/lib/agent-payments/freshness";
import { federationConfigured } from "@/lib/agent-payments/federation";
import { receiptStatus } from "@/lib/agent-payments/receipts";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const premiumEndpoints = Object.keys(ENDPOINT_FRESHNESS).map((path) => ({
    path,
    cost_credits: PREMIUM_COSTS[path] ?? 5,
    freshness_sla_seconds: ENDPOINT_FRESHNESS[path]?.maxAgeSeconds ?? null,
  }));

  return NextResponse.json(
    {
      site: "vr.org",
      role: "federation_member",
      federation: {
        host: "tensorfeed.ai",
        members: ["tensorfeed.ai", "terminalfeed.io", "vr.org"],
        established: "2026-04-30",
        rail_configured: federationConfigured(),
      },
      free_endpoints: [
        { path: "/api/feed", description: "VR/AR/XR aggregated news feed" },
        { path: "/api/articles", description: "VR.org Original editorial articles" },
        { path: "/api/trending", description: "Trending topics across the feed" },
        { path: "/api/sources", description: "RSS source list with health" },
        { path: "/api/feed-health", description: "RSS engine health probe" },
        { path: "/api/top-lists", description: "Top VR games + apps" },
        { path: "/api/featured", description: "Featured rotation" },
        { path: "/api/deals", description: "VR/AR hardware deals" },
      ],
      premium_endpoints: premiumEndpoints,
      agent_fair_trade: {
        description:
          "Agent Fair-Trade Agreement (AFTA): code-enforced no-charge guarantees, Ed25519-signed receipts on every paid call, public on-chain payment rail (USDC on Base) hosted on tensorfeed.ai.",
        no_charge_guarantees: [
          "5xx",
          "circuit_breaker",
          "schema_validation_failure",
          "stale_data",
        ],
        receipts: receiptStatus(),
        freshness_slas: describeSLAs(),
        standard_manifest: "/.well-known/agent-fair-trade.json",
        public_record: "/api/payment/no-charge-stats",
        doc: "https://vr.org/agent-fair-trade",
        network: {
          description:
            "TensorFeed, TerminalFeed, and VR.org share a single bearer-token + credit ledger. A token minted on tensorfeed.ai works on all three. Each site signs receipts with its own keypair.",
          host_ledger: "tensorfeed.ai",
          sister_sites: [
            {
              site: "tensorfeed.ai",
              manifest: "https://tensorfeed.ai/.well-known/agent-fair-trade.json",
              manifesto: "https://tensorfeed.ai/agent-fair-trade",
              receipt_key:
                "https://tensorfeed.ai/.well-known/tensorfeed-receipt-key.json",
            },
            {
              site: "terminalfeed.io",
              manifest:
                "https://terminalfeed.io/.well-known/agent-fair-trade.json",
              manifesto: "https://terminalfeed.io/agent-fair-trade",
              receipt_key:
                "https://terminalfeed.io/.well-known/terminalfeed-receipt-key.json",
            },
            {
              site: "vr.org",
              manifest: "https://vr.org/.well-known/agent-fair-trade.json",
              manifesto: "https://vr.org/agent-fair-trade",
              receipt_key: "https://vr.org/.well-known/vr-org-receipt-key.json",
            },
          ],
        },
      },
      generated_at: new Date().toISOString(),
    },
    {
      headers: {
        "Cache-Control": "public, max-age=60",
        "Access-Control-Allow-Origin": "*",
      },
    },
  );
}

const PREMIUM_COSTS: Record<string, number> = {
  "/api/premium/news/search": 5,
};
