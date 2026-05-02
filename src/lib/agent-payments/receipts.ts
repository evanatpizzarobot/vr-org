// Cryptographically signed receipts for VR.org premium responses.
//
// Every paid call returns a receipt that an agent can verify against the
// public Ed25519 key at https://vr.org/.well-known/vr-org-receipt-key.json
// with no shared secret. Bootstrap: scripts/generate-receipt-key.mjs mints
// the keypair, the public JWK is committed to the repo, the private JWK is
// set as RECEIPT_PRIVATE_KEY_JWK in the VPS .env file.
//
// If the secret is unset this module degrades gracefully: receipts are not
// emitted (rather than emitting unsigned receipts that imply trust we cannot
// back up). /api/meta surfaces the bootstrap status so agents can detect it.

import { canonicalJSON } from "./canonical";
import type { ReceiptCore, SignedReceipt } from "./types";

const enc = new TextEncoder();

async function sha256Hex(input: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", enc.encode(input));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function hashRequest(
  method: string,
  url: URL,
): Promise<string> {
  const params = Array.from(url.searchParams.entries()).sort((a, b) =>
    a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0,
  );
  const canonicalQuery = params.map(([k, v]) => `${k}=${v}`).join("&");
  const stringForm = `${method.toUpperCase()} ${url.pathname}?${canonicalQuery}`;
  return "sha256:" + (await sha256Hex(stringForm));
}

export async function hashResponse(result: unknown): Promise<string> {
  return "sha256:" + (await sha256Hex(canonicalJSON(result)));
}

// Token short reference: tf_live_ tokens are minted on tensorfeed.ai but
// usable network-wide. Preserve the prefix so receipts identify the token
// class consistently across federation members.
export function tokenShort(token: string): string {
  if (!token || token.length < 16) return token;
  if (!token.startsWith("tf_live_")) {
    return token.slice(0, 8) + "..." + token.slice(-4);
  }
  const body = token.slice(8);
  return `tf_live_${body.slice(0, 8)}...${body.slice(-8)}`;
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function generateReceiptId(): string {
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);
  return `rcpt_${bytesToHex(bytes)}`;
}

interface PrivateJWK {
  kty: "OKP";
  crv: "Ed25519";
  d: string;
  x: string;
  kid?: string;
  use?: string;
}

interface PublicJWK {
  kty: "OKP";
  crv: "Ed25519";
  x: string;
  kid?: string;
}

let cachedKey: { key: CryptoKey; kid: string } | null = null;
let cachedKeyEnv: string | undefined = undefined;

export async function loadSigningKey(): Promise<{
  key: CryptoKey;
  kid: string;
} | null> {
  const secret = process.env.RECEIPT_PRIVATE_KEY_JWK;
  if (!secret) {
    cachedKey = null;
    cachedKeyEnv = undefined;
    return null;
  }
  if (cachedKey && cachedKeyEnv === secret) return cachedKey;

  let parsed: PrivateJWK;
  try {
    parsed = JSON.parse(secret) as PrivateJWK;
  } catch (err) {
    console.error("receipts: RECEIPT_PRIVATE_KEY_JWK is not valid JSON", err);
    return null;
  }
  if (
    parsed.kty !== "OKP" ||
    parsed.crv !== "Ed25519" ||
    !parsed.d ||
    !parsed.x
  ) {
    console.error(
      "receipts: RECEIPT_PRIVATE_KEY_JWK missing required Ed25519 fields",
    );
    return null;
  }

  let key: CryptoKey;
  try {
    key = await crypto.subtle.importKey(
      "jwk",
      parsed as JsonWebKey,
      { name: "Ed25519" },
      false,
      ["sign"],
    );
  } catch (err) {
    console.error("receipts: Ed25519 importKey failed", err);
    return null;
  }
  const kid = parsed.kid || (await sha256Hex(parsed.x)).slice(0, 16);
  cachedKey = { key, kid };
  cachedKeyEnv = secret;
  return cachedKey;
}

function bytesToBase64Url(bytes: Uint8Array): string {
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  const b64 = btoa(bin);
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlToBytes(s: string): Uint8Array {
  const pad = s.length % 4 === 0 ? "" : "=".repeat(4 - (s.length % 4));
  const b64 = (s + pad).replace(/-/g, "+").replace(/_/g, "/");
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

export async function signReceipt(
  core: ReceiptCore,
): Promise<SignedReceipt | null> {
  const loaded = await loadSigningKey();
  if (!loaded) return null;
  const message = enc.encode(canonicalJSON(core));
  let sig: ArrayBuffer;
  try {
    sig = await crypto.subtle.sign(
      { name: "Ed25519" },
      loaded.key,
      message as BufferSource,
    );
  } catch (err) {
    console.error("receipts: sign failed", err);
    return null;
  }
  return {
    ...core,
    signature: bytesToBase64Url(new Uint8Array(sig)),
    key_id: loaded.kid,
    signing_alg: "EdDSA",
    signing_curve: "Ed25519",
    canonical_form: "vr-org-canonical-json-v1",
    verify_doc: "https://vr.org/agent-fair-trade#receipts",
  };
}

export async function verifyReceiptSignature(
  signed: SignedReceipt,
  publicJwk: PublicJWK,
): Promise<boolean> {
  const core: ReceiptCore = {
    v: signed.v,
    id: signed.id,
    endpoint: signed.endpoint,
    method: signed.method,
    token_short: signed.token_short,
    credits_charged: signed.credits_charged,
    credits_remaining: signed.credits_remaining,
    request_hash: signed.request_hash,
    response_hash: signed.response_hash,
    captured_at: signed.captured_at,
    server_time: signed.server_time,
    no_charge_reason: signed.no_charge_reason,
    freshness_sla_seconds: signed.freshness_sla_seconds,
  };
  let key: CryptoKey;
  try {
    key = await crypto.subtle.importKey(
      "jwk",
      publicJwk as JsonWebKey,
      { name: "Ed25519" },
      false,
      ["verify"],
    );
  } catch {
    return false;
  }
  const sigBytes = base64UrlToBytes(signed.signature);
  const message = enc.encode(canonicalJSON(core));
  try {
    return await crypto.subtle.verify(
      { name: "Ed25519" },
      key,
      sigBytes as BufferSource,
      message as BufferSource,
    );
  } catch {
    return false;
  }
}

export function receiptStatus(): {
  configured: boolean;
  algorithm: string;
  public_key_url: string;
} {
  return {
    configured: Boolean(process.env.RECEIPT_PRIVATE_KEY_JWK),
    algorithm: "EdDSA / Ed25519",
    public_key_url: "https://vr.org/.well-known/vr-org-receipt-key.json",
  };
}
