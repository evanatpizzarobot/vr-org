// Cross-Worker AFTA rail to TensorFeed.
//
// VR.org is a federation member, not a credit-ledger host. Tokens are minted
// on tensorfeed.ai. Each premium request validates the bearer against TF's
// /api/internal/validate (read-only balance check) and commits the deferred
// debit via /api/internal/commit after the handler runs. Both are guarded by
// the SHARED_INTERNAL_SECRET env var that all federation members hold.

import type {
  FederationCommitResponse,
  FederationValidateResponse,
  NoChargeReason,
} from "./types";

const FETCH_TIMEOUT_MS = 8000;

async function fetchWithTimeout(
  url: string,
  init: RequestInit,
  timeoutMs: number,
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

function tfBaseUrl(): string {
  return process.env.TENSORFEED_AUTH_URL || "https://tensorfeed.ai";
}

function sharedSecret(): string {
  return process.env.SHARED_INTERNAL_SECRET || "";
}

let breakerFailures = 0;
let breakerOpenedAt = 0;
const BREAKER_THRESHOLD = 4;
const BREAKER_COOLDOWN_MS = 30 * 1000;

function breakerOpen(): boolean {
  if (breakerFailures < BREAKER_THRESHOLD) return false;
  if (Date.now() - breakerOpenedAt > BREAKER_COOLDOWN_MS) {
    breakerFailures = 0;
    return false;
  }
  return true;
}

function breakerRecord(success: boolean): void {
  if (success) {
    breakerFailures = 0;
    return;
  }
  breakerFailures++;
  if (breakerFailures === BREAKER_THRESHOLD) breakerOpenedAt = Date.now();
}

export async function validateOnly(
  token: string,
  cost: number,
): Promise<FederationValidateResponse> {
  if (!sharedSecret()) return { ok: false, reason: "billing_unavailable" };
  if (breakerOpen())
    return { ok: false, reason: "billing_temporarily_unavailable" };
  try {
    const res = await fetchWithTimeout(
      tfBaseUrl() + "/api/internal/validate",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Internal-Auth": sharedSecret(),
        },
        body: JSON.stringify({ token, cost }),
      },
      FETCH_TIMEOUT_MS,
    );
    if (!res.ok) {
      if (res.status >= 500) breakerRecord(false);
      return { ok: false, reason: "billing_unavailable" };
    }
    const json = (await res.json()) as FederationValidateResponse;
    if (!json || typeof json.ok !== "boolean") {
      return { ok: false, reason: "billing_unavailable" };
    }
    if (json.ok) breakerRecord(true);
    return json;
  } catch {
    breakerRecord(false);
    return { ok: false, reason: "billing_unavailable" };
  }
}

export async function commitInternal(
  token: string,
  cost: number,
  endpoint: string,
  noChargeReason: NoChargeReason,
): Promise<FederationCommitResponse> {
  if (!sharedSecret()) return { ok: false, reason: "billing_unavailable" };
  try {
    const res = await fetchWithTimeout(
      tfBaseUrl() + "/api/internal/commit",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Internal-Auth": sharedSecret(),
        },
        body: JSON.stringify({
          token,
          cost,
          endpoint,
          no_charge_reason: noChargeReason || null,
        }),
      },
      FETCH_TIMEOUT_MS,
    );
    if (!res.ok) return { ok: false, reason: "billing_unavailable" };
    const json = (await res.json()) as FederationCommitResponse;
    if (!json || typeof json.ok !== "boolean") {
      return { ok: false, reason: "billing_unavailable" };
    }
    return json;
  } catch {
    return { ok: false, reason: "billing_unavailable" };
  }
}

export function federationConfigured(): boolean {
  return Boolean(process.env.SHARED_INTERNAL_SECRET);
}
