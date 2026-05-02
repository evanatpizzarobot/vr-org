// Generate a fresh Ed25519 keypair for the VR.org AFTA receipt signing rail.
//
// Run from the project root: node scripts/generate-receipt-key.mjs
//
// What it does:
//   1. Mints a fresh Ed25519 keypair
//   2. Writes the PUBLIC JWK to public/.well-known/vr-org-receipt-key.json
//   3. Prints the PRIVATE JWK on stdout for you to paste into the VPS env
//
// After running, finish bootstrap by setting the private JWK as an env var on
// the NetActuate VPS that runs the docker-compose stack:
//
//   ssh -i ~/.ssh/vr-org ubuntu@104.225.12.76
//   cd ~/vr-org
//   echo 'RECEIPT_PRIVATE_KEY_JWK=<paste the printed JSON line>' >> .env
//   docker compose up -d --force-recreate
//
// Then commit + push the public key:
//   git add public/.well-known/vr-org-receipt-key.json
//   git commit -m "feat(afta): provision VR.org receipt signing key"
//   git push
//
// Rotation: re-run this script, update the secret, push the new public key.
// Phase 1 ships single-key only.

import { webcrypto } from "node:crypto";
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

const { publicKey, privateKey } = await webcrypto.subtle.generateKey(
  { name: "Ed25519" },
  true,
  ["sign", "verify"],
);

const pubJwk = await webcrypto.subtle.exportKey("jwk", publicKey);
const privJwk = await webcrypto.subtle.exportKey("jwk", privateKey);

const xBytes = Buffer.from(
  pubJwk.x.replace(/-/g, "+").replace(/_/g, "/") + "==",
  "base64",
);
const digest = await webcrypto.subtle.digest("SHA-256", xBytes);
const hex = Array.from(new Uint8Array(digest))
  .map((b) => b.toString(16).padStart(2, "0"))
  .join("");
const kid = hex.slice(0, 16);

const publicEnriched = {
  ...pubJwk,
  kid,
  use: "sig",
  alg: "EdDSA",
  verify_doc: "https://vr.org/agent-fair-trade#receipts",
};
const privateEnriched = {
  ...privJwk,
  kid,
  use: "sig",
  alg: "EdDSA",
};

const publicKeyPath = resolve(
  process.cwd(),
  "public",
  ".well-known",
  "vr-org-receipt-key.json",
);
writeFileSync(
  publicKeyPath,
  JSON.stringify(publicEnriched, null, 2) + "\n",
  "utf8",
);

console.log("");
console.log("Public key written to:");
console.log("  " + publicKeyPath);
console.log("");
console.log("Key id (kid): " + kid);
console.log("");
console.log("=== PRIVATE JWK (copy the line below, paste into VPS env) ===");
console.log("");
console.log(JSON.stringify(privateEnriched));
console.log("");
console.log("Next steps:");
console.log("  ssh -i ~/.ssh/vr-org ubuntu@104.225.12.76");
console.log("  cd ~/vr-org");
console.log("  Edit .env and add: RECEIPT_PRIVATE_KEY_JWK=<paste private JWK>");
console.log("  docker compose up -d --force-recreate");
console.log("");
console.log("  git add public/.well-known/vr-org-receipt-key.json");
console.log('  git commit -m "feat(afta): provision VR.org receipt signing key"');
console.log("  git push");
console.log("");
