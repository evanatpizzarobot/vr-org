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
// Amazon serves bot walls (captcha, 503) to scripted clients, so Amazon non-2xx
// is always treated as "unverified", never broken. The deals file uses Amazon
// search links (/s?k=), which cannot 404, so this is the correct bias.

import fs from "node:fs";
import path from "node:path";

const DEALS_PATH = path.join(process.cwd(), "data", "deals.json");
const UA = "VRorgBot/1.0 (https://vr.org; evan@pizzarobotstudios.com)";
const TIMEOUT_MS = 12_000;

const data = JSON.parse(fs.readFileSync(DEALS_PATH, "utf-8"));

// Collect every URL (item images + every retailer link) with a label.
const tasks = [];
for (const section of data.sections ?? []) {
  for (const item of section.items ?? []) {
    if (item.image) tasks.push({ name: item.name, kind: "image", url: item.image });
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

// Bucket a probe result. Amazon non-2xx is never "broken" (bot walls).
function bucket(task, r) {
  if (r.ok) return "ok";
  if (isAmazon(task.url)) return "unverified";
  if (r.status === 404 || r.status === 410 || r.status === "DEAD") return "broken";
  return "unverified"; // 403 / 429 / 5xx / timeout / other
}

const concurrency = 4;
const results = [];
let i = 0;
async function worker() {
  while (i < tasks.length) {
    const idx = i++;
    const task = tasks[idx];
    const r = await probe(task.url);
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
  console.log(`\n${unverified.length} URL(s) could not be verified (bot wall / rate limit / transient). Not treated as failures:`);
  for (const r of unverified) {
    console.log(`  [${r.status}] ${r.name} (${r.kind})`);
    console.log(`        ${r.url}`);
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
