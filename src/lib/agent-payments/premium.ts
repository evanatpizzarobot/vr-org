// Premium endpoint wrapper. Single exit point for any /api/premium/* handler.
// Order: extract token, validate against TF (no charge), run handler,
// staleness check, commit (with no_charge_reason if applicable), sign Ed25519
// receipt, return response.

import { NextRequest, NextResponse } from "next/server";
import { commitInternal, validateOnly } from "./federation";
import { checkStaleness, resolveSLA } from "./freshness";
import { logNoChargeEvent } from "./no-charge-ledger";
import {
  generateReceiptId,
  hashRequest,
  hashResponse,
  signReceipt,
  tokenShort,
} from "./receipts";
import type { NoChargeReason, ReceiptCore } from "./types";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Max-Age": "86400",
} as const;

function extractToken(req: NextRequest): string {
  const auth = req.headers.get("authorization") || "";
  const m = auth.match(/^Bearer\s+(\S+)$/i);
  return m ? m[1] : "";
}

function paymentRequiredResponse(reason: string, endpoint: string): NextResponse {
  return NextResponse.json(
    {
      error: "payment_required",
      reason,
      endpoint,
      docs: "https://vr.org/agent-fair-trade",
      mint_token_at: "https://tensorfeed.ai/api/payment/buy-credits",
    },
    {
      status: 402,
      headers: {
        ...CORS_HEADERS,
        "WWW-Authenticate": 'Bearer realm="vr.org-premium"',
      },
    },
  );
}

interface PremiumOptions<T> {
  endpoint: string;
  cost: number;
  request: NextRequest;
  // Handler returns the body to return AND signs over. May throw; thrown
  // errors map to no_charge_reason: "5xx".
  handler: () => Promise<T & { captured_at?: string; generated_at?: string }>;
}

export async function premiumResponse<T extends Record<string, unknown>>(
  opts: PremiumOptions<T>,
): Promise<NextResponse> {
  const { endpoint, cost, request, handler } = opts;
  const url = new URL(request.url);
  const token = extractToken(request);
  if (!token) {
    return paymentRequiredResponse("missing_bearer", endpoint);
  }

  // Validate against the TF ledger (read-only).
  const validate = await validateOnly(token, cost);
  if (!validate.ok) {
    return paymentRequiredResponse(
      validate.reason || "validate_failed",
      endpoint,
    );
  }
  if (!validate.sufficient) {
    return paymentRequiredResponse("insufficient_credits", endpoint);
  }

  const currentBalance =
    typeof validate.credits_remaining === "number"
      ? validate.credits_remaining
      : 0;

  // Run handler.
  let bodyResult: Record<string, unknown>;
  let noChargeReason: NoChargeReason = null;
  let httpStatus = 200;
  try {
    const result = await handler();
    bodyResult = { ...result };
    // Staleness check.
    let capturedAt: string | null = null;
    if (typeof bodyResult.captured_at === "string") {
      capturedAt = bodyResult.captured_at;
    } else if (typeof bodyResult.generated_at === "string") {
      capturedAt = bodyResult.generated_at;
    }
    const staleness = checkStaleness(endpoint, capturedAt, new Date());
    if (staleness.applies && staleness.stale) {
      noChargeReason = "stale_data";
      bodyResult.stale = true;
      bodyResult.stale_age_seconds = staleness.ageSeconds;
      bodyResult.stale_sla_seconds = staleness.slaSeconds;
    }
  } catch (err) {
    console.error(`premium ${endpoint}: handler threw`, err);
    noChargeReason = "5xx";
    httpStatus = 500;
    bodyResult = {
      source: "vrorg-premium",
      endpoint,
      generated_at: new Date().toISOString(),
      error: "upstream_error",
      message:
        "Handler caught an exception. No credit was charged for this call. Retry shortly.",
    };
  }

  // Commit (writes the network ledger entry on TF).
  const commit = await commitInternal(
    token,
    cost,
    "vrorg:" + endpoint,
    noChargeReason,
  );
  let creditsCharged: number;
  let creditsRemaining: number;
  if (commit.ok) {
    creditsCharged =
      typeof commit.credits_charged === "number"
        ? commit.credits_charged
        : noChargeReason
          ? 0
          : cost;
    creditsRemaining =
      typeof commit.balance_after === "number"
        ? commit.balance_after
        : currentBalance - (noChargeReason ? 0 : cost);
  } else {
    // Commit handshake failed AFTER handler ran. Treat as no-charge so the
    // agent is not billed for an event we cannot commit cleanly.
    noChargeReason = noChargeReason || "circuit_breaker";
    creditsCharged = 0;
    creditsRemaining = currentBalance;
  }

  if (noChargeReason) {
    logNoChargeEvent(noChargeReason, endpoint, cost, token);
  }

  // Sign receipt.
  const requestHash = await hashRequest(request.method, url);
  const responseHash = await hashResponse(bodyResult);
  let receiptCapturedAt: string | null = null;
  if (typeof bodyResult.captured_at === "string") {
    receiptCapturedAt = bodyResult.captured_at;
  } else if (typeof bodyResult.generated_at === "string") {
    receiptCapturedAt = bodyResult.generated_at;
  }
  const sla = resolveSLA(endpoint);
  const core: ReceiptCore = {
    v: 1,
    id: generateReceiptId(),
    endpoint,
    method: request.method,
    token_short: tokenShort(token),
    credits_charged: creditsCharged,
    credits_remaining: creditsRemaining,
    request_hash: requestHash,
    response_hash: responseHash,
    captured_at: receiptCapturedAt,
    server_time: new Date().toISOString(),
    no_charge_reason: noChargeReason,
    freshness_sla_seconds: sla?.maxAgeSeconds ?? null,
  };
  const signed = await signReceipt(core);

  const payload = {
    ...bodyResult,
    receipt: signed,
    billing: {
      credits_charged: creditsCharged,
      credits_remaining: creditsRemaining,
      no_charge_reason: noChargeReason,
    },
  };

  return NextResponse.json(payload, {
    status: httpStatus,
    headers: { ...CORS_HEADERS },
  });
}

// Validation-failure helper for 400 schema errors. Logs no-charge,
// signs a receipt with credits_charged: 0, returns 400.
export async function premiumValidationFailure(
  request: NextRequest,
  endpoint: string,
  cost: number,
  message: string,
): Promise<NextResponse> {
  const url = new URL(request.url);
  const token = extractToken(request);
  if (!token) return paymentRequiredResponse("missing_bearer", endpoint);

  const noChargeReason: NoChargeReason = "schema_validation_failure";
  // Attempt commit with no-charge reason so the network ledger sees it.
  const commit = await commitInternal(
    token,
    cost,
    "vrorg:" + endpoint,
    noChargeReason,
  );
  const creditsRemaining =
    commit.ok && typeof commit.balance_after === "number"
      ? commit.balance_after
      : 0;
  logNoChargeEvent(noChargeReason, endpoint, cost, token);

  const bodyResult = {
    source: "vrorg-premium",
    endpoint,
    generated_at: new Date().toISOString(),
    error: "schema_validation_failure",
    message,
  };
  const requestHash = await hashRequest(request.method, url);
  const responseHash = await hashResponse(bodyResult);
  const sla = resolveSLA(endpoint);
  const core: ReceiptCore = {
    v: 1,
    id: generateReceiptId(),
    endpoint,
    method: request.method,
    token_short: tokenShort(token),
    credits_charged: 0,
    credits_remaining: creditsRemaining,
    request_hash: requestHash,
    response_hash: responseHash,
    captured_at: null,
    server_time: new Date().toISOString(),
    no_charge_reason: noChargeReason,
    freshness_sla_seconds: sla?.maxAgeSeconds ?? null,
  };
  const signed = await signReceipt(core);

  return NextResponse.json(
    {
      ...bodyResult,
      receipt: signed,
      billing: {
        credits_charged: 0,
        credits_remaining: creditsRemaining,
        no_charge_reason: noChargeReason,
      },
    },
    { status: 400, headers: { ...CORS_HEADERS } },
  );
}

export function preflight(): NextResponse {
  return new NextResponse(null, {
    status: 204,
    headers: { ...CORS_HEADERS },
  });
}
