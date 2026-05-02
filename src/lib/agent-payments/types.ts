// Shared types for VR.org's AFTA premium-API harness.
// VR.org is a federation member: tokens are minted on tensorfeed.ai and
// validated/committed across the cross-Worker AFTA rail. VR.org signs its
// own receipts with its own Ed25519 key.

export type NoChargeReason =
  | "5xx"
  | "circuit_breaker"
  | "schema_validation_failure"
  | "stale_data"
  | null;

export interface ReceiptCore {
  v: 1;
  id: string;
  endpoint: string;
  method: string;
  token_short: string;
  credits_charged: number;
  credits_remaining: number;
  request_hash: string;
  response_hash: string;
  captured_at: string | null;
  server_time: string;
  no_charge_reason: NoChargeReason;
  freshness_sla_seconds: number | null;
}

export interface SignedReceipt extends ReceiptCore {
  signature: string;
  key_id: string;
  signing_alg: "EdDSA";
  signing_curve: "Ed25519";
  canonical_form: "vr-org-canonical-json-v1";
  verify_doc: string;
}

export interface FederationValidateResponse {
  ok: boolean;
  reason?: string;
  credits_remaining?: number;
  sufficient?: boolean;
}

export interface FederationCommitResponse {
  ok: boolean;
  reason?: string;
  credits_charged?: number;
  balance_after?: number;
  no_charge_reason?: NoChargeReason;
}

export interface PremiumPaymentCtx {
  token: string;
  cost: number;
  endpoint: string;
  currentBalance: number;
}
