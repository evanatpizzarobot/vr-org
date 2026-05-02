import { NextResponse } from "next/server";
import { ENDPOINT_FRESHNESS } from "@/lib/agent-payments/freshness";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PREMIUM_COSTS: Record<string, number> = {
  "/api/premium/news/search": 5,
};

export async function GET() {
  const endpoints = Object.keys(ENDPOINT_FRESHNESS).map((path) => ({
    path,
    cost_credits: PREMIUM_COSTS[path] ?? 5,
    freshness_sla_seconds: ENDPOINT_FRESHNESS[path]?.maxAgeSeconds ?? null,
  }));

  return NextResponse.json(
    {
      site: "vr.org",
      currency: "USDC",
      network: "eip155:8453",
      network_name: "Base mainnet",
      ledger_host: "tensorfeed.ai",
      mint_token_at: "https://tensorfeed.ai/api/payment/buy-credits",
      check_balance_at: "https://tensorfeed.ai/api/payment/balance",
      buy_credits_doc: "https://tensorfeed.ai/developers/agent-payments",
      manifesto: "https://vr.org/agent-fair-trade",
      x402_manifest: "https://tensorfeed.ai/.well-known/x402.json",
      premium_endpoints: endpoints,
      note: "VR.org is a federation member, not the credit ledger host. Tokens are minted on tensorfeed.ai and work network-wide (vr.org, tensorfeed.ai, terminalfeed.io).",
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
