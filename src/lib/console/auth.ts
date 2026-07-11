import { createHmac, scryptSync, timingSafeEqual } from "crypto";

// Auth for the gated /console dashboard (Vantage). Intentionally tiny and
// dependency-free: three shared accounts, a signed session cookie, no database.
//
// Secrets live ONLY in the VPS .env (host-only, gitignored), never in this
// public repo:
//   CONSOLE_USERS           = "email:salt:hash,email:salt:hash,..."  (scrypt, hex)
//   CONSOLE_SESSION_SECRET  = random hex string used to HMAC-sign the cookie
//
// If either is unset the console simply rejects everyone, so a missing secret
// fails closed rather than open.

export const COOKIE_NAME = "vantage_session";
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
export const SESSION_MAX_AGE_SEC = Math.floor(SESSION_TTL_MS / 1000);
const KEYLEN = 32;

interface UserRecord {
  salt: string;
  hash: string;
}

function loadUsers(): Map<string, UserRecord> {
  const users = new Map<string, UserRecord>();
  const raw = process.env.CONSOLE_USERS || "";
  for (const entry of raw.split(",")) {
    const trimmed = entry.trim();
    if (!trimmed) continue;
    const [email, salt, hash] = trimmed.split(":");
    if (email && salt && hash) {
      users.set(email.trim().toLowerCase(), { salt, hash });
    }
  }
  return users;
}

function sessionSecret(): string | null {
  const s = process.env.CONSOLE_SESSION_SECRET;
  return s && s.length >= 16 ? s : null;
}

export function verifyCredentials(email: string, password: string): boolean {
  const record = loadUsers().get(String(email || "").trim().toLowerCase());
  if (!record) return false;
  let derived: Buffer;
  let expected: Buffer;
  try {
    derived = scryptSync(password, Buffer.from(record.salt, "hex"), KEYLEN);
    expected = Buffer.from(record.hash, "hex");
  } catch {
    return false;
  }
  if (derived.length !== expected.length) return false;
  return timingSafeEqual(derived, expected);
}

function signature(payload: string, secret: string): string {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

export function createSession(email: string): string {
  const secret = sessionSecret();
  if (!secret) return "";
  const payload = `${email.trim().toLowerCase()}|${Date.now() + SESSION_TTL_MS}`;
  const encoded = Buffer.from(payload).toString("base64url");
  return `${encoded}.${signature(payload, secret)}`;
}

// Returns the authenticated email if the token is valid and unexpired, else null.
export function verifySession(token: string | undefined | null): string | null {
  const secret = sessionSecret();
  if (!token || !secret) return null;

  const dot = token.lastIndexOf(".");
  if (dot < 1) return null;

  const encoded = token.slice(0, dot);
  const providedSig = token.slice(dot + 1);

  let payload: string;
  try {
    payload = Buffer.from(encoded, "base64url").toString("utf8");
  } catch {
    return null;
  }

  const expectedSig = signature(payload, secret);
  const a = Buffer.from(providedSig);
  const b = Buffer.from(expectedSig);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

  const sep = payload.lastIndexOf("|");
  if (sep < 1) return null;
  const email = payload.slice(0, sep);
  const exp = Number(payload.slice(sep + 1));
  if (!email || !Number.isFinite(exp) || Date.now() > exp) return null;

  return email;
}
