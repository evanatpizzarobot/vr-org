#!/usr/bin/env node
// Verify every link and image URL in data/deals.json is reachable.
// Exit 1 if any are definitively broken (404/410 or dead host) so the weekly
// /deals refresh routine (and a local run) can fix them before pushing.
// Run with: npm run check:deals
//
// Classification:
//   ok         - 2xx / 3xx
//   broken     - 404, 410, or dead host (DNS NXDOMAIN / connection refused) -> exit 1
//   unverified - 403 / 429 / 5xx / timeout (bot walls, transient) -> warn only, exit 0
//
// KNOWN LIMITATION, measured 2026-08-01: this check CANNOT detect Amazon ASIN
// rot. Scripted requests to /dp/<ASIN> return 301 for a dead ASIN and 301 for a
// live one alike, so a rotted link reports "ok" here. That matters because on
// 2026-07-28, 20 of 33 Amazon links were converted from search URLs (which
// cannot 404) to /dp/ASIN links (which do rot). The only reliable check is
// fetching the page body and matching the product title, which is what was done
// by hand during that conversion. Do not read a green run as proof the Amazon
// links resolve to the right products. The 404/410 branch below is kept because
// it is correct if Amazon ever does return one, but it will rarely fire.
//
// Amazon bot walls (captcha, 503, 403) are always "unverified", never broken.
//
// Images may be root-relative paths into public/ (self-hosted press art). Those
// cannot be fetched, so they are verified against the filesystem instead. This
// also catches an image referenced in deals.json but never committed, which is a
// live risk because public/ is baked into the Docker image at build time.
//
// Flags:
//   --ci  collapse the unverified list to a one-line summary (keeps the weekly
//         GitHub issue readable when CI IPs get bot-walled by Amazon)

import fs from "node:fs";
import path from "node:path";

const DEALS_PATH = path.join(process.cwd(), "data", "deals.json");
const PUBLIC_DIR = path.join(process.cwd(), "public");
const UA = "VRorgBot/1.0 (https://vr.org; evan@pizzarobotstudios.com)";
const TIMEOUT_MS = 12_000;
const ciMode = process.argv.includes("--ci");

const data = JSON.parse(fs.readFileSync(DEALS_PATH, "utf-8"));

// Collect every URL (item images + every retailer link) with a label.
const tasks = [];
for (const section of data.sections ?? []) {
  for (const item of section.items ?? []) {
    if (item.image) {
      // Root-relative images are self-hosted assets in public/, not fetchable.
      const local = item.image.startsWith("/");
      tasks.push({
        name: item.name,
        kind: local ? "image(local)" : "image",
        url: item.image,
        local,
      });
    }
    for (const [key, link] of Object.entries(item.links ?? {})) {
      if (link?.url) tasks.push({ name: item.name, kind: `link:${key}`, url: link.url });
    }
  }
}

console.log(`Checking ${tasks.length} URLs in data/deals.json...`);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const hostname = (url) => {
  try {
    return new URL(url).hostname;
  } catch {
    return "";
  }
};
const isAmazon = (url) => /(^|\.)amazon\./i.test(hostname(url));

// Distinguish a dead host (broken) from a transient/blocked one (unverified).
function classifyError(err) {
  if (err?.name === "AbortError") return "timeout";
  const code = err?.cause?.code || err?.code || "";
  if (["ENOTFOUND", "ECONNREFUSED", "ENETUNREACH"].includes(code)) return "dead";
  return "timeout";
}

async function fetchOnce(url, method) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    return await fetch(url, {
      method,
      headers: {
        "User-Agent": UA,
        ...(method === "GET" ? { Range: "bytes=0-0" } : {}),
      },
      redirect: "follow",
      signal: ctrl.signal,
    });
  } finally {
    clearTimeout(t);
  }
}

async function probe(url) {
  // Retry on 429 / transient timeouts with backoff. A rate limit or a slow
  // response does not mean the URL is broken.
  const backoff = [0, 1500, 4000];
  for (let attempt = 0; attempt < backoff.length; attempt++) {
    if (backoff[attempt]) await sleep(backoff[attempt]);
    try {
      let res = await fetchOnce(url, "HEAD");
      if (!res.ok && [403, 405, 501].includes(res.status)) {
        res = await fetchOnce(url, "GET");
      }
      if (res.status === 429 && attempt < backoff.length - 1) continue;
      return { status: res.status, ok: res.ok };
    } catch (err) {
      const cls = classifyError(err);
      if (cls === "timeout" && attempt < backoff.length - 1) continue;
      return { status: cls === "dead" ? "DEAD" : "ERR", ok: false, err: err.message || String(err) };
    }
  }
  return { status: "ERR", ok: false };
}

// Bucket a probe result. Amazon bot walls (403/429/5xx) are never "broken", but
// an Amazon 404/410 is a genuinely dead ASIN and must be caught.
function bucket(task, r) {
  if (r.ok) return "ok";
  const gone = r.status === 404 || r.status === 410 || r.status === "DEAD";
  if (isAmazon(task.url)) return gone ? "broken" : "unverified";
  if (gone) return "broken";
  return "unverified"; // 403 / 429 / 5xx / timeout / other
}

const concurrency = 4;
const results = [];
let i = 0;
async function worker() {
  while (i < tasks.length) {
    const idx = i++;
    const task = tasks[idx];
    // Local assets are verified on disk; a missing file is definitively broken.
    const r = task.local
      ? (() => {
          const abs = path.join(PUBLIC_DIR, task.url.replace(/^\/+/, ""));
          return fs.existsSync(abs)
            ? { ok: true, status: "FILE" }
            : { ok: false, status: "DEAD", err: "not found in public/" };
        })()
      : await probe(task.url);
    const b = bucket(task, r);
    results[idx] = { ...task, ...r, bucket: b };
    process.stdout.write(b === "ok" ? "." : b === "broken" ? "x" : "?");
  }
}
await Promise.all(Array.from({ length: concurrency }, worker));
process.stdout.write("\n");

const broken = results.filter((r) => r.bucket === "broken");
const unverified = results.filter((r) => r.bucket === "unverified");

if (unverified.length > 0) {
  const hosts = [...new Set(unverified.map((r) => hostname(r.url) || "local"))];
  if (ciMode) {
    // CI IPs get bot-walled far more than a desktop does; a full list every week
    // would bury the real findings.
    console.log(
      `\n${unverified.length} URL(s) unverified (bot wall / rate limit / transient), not failures. Hosts: ${hosts.join(", ")}`
    );
  } else {
    console.log(`\n${unverified.length} URL(s) could not be verified (bot wall / rate limit / transient). Not treated as failures:`);
    for (const r of unverified) {
      console.log(`  [${r.status}] ${r.name} (${r.kind})`);
      console.log(`        ${r.url}`);
    }
  }
}

if (broken.length === 0) {
  console.log(`\nAll reachable. ${results.length - unverified.length} verified OK, ${unverified.length} unverified.`);
  process.exit(0);
}

console.log(`\nBROKEN links (${broken.length} of ${results.length}) -- fix these before pushing:\n`);
for (const b of broken) {
  console.log(`  ${b.name} (${b.kind})`);
  console.log(`    [${b.status}] ${b.url}${b.err ? ` (${b.err})` : ""}`);
}
process.exit(1);
