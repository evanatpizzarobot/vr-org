#!/usr/bin/env node
// Validate data/category-products.json: structural shape + reachability of every
// pick image and out-link URL. External mostPopular hrefs are checked too; internal
// hrefs (starting with "/") are skipped. Mirrors scripts/check-deal-links.mjs.
// Run with: npm run check:category-products
//
// Amazon serves bot walls to scripted clients, so Amazon non-2xx is "unverified",
// never "broken". The file uses Amazon search links (/s?k=), which cannot 404.

import fs from "node:fs";
import path from "node:path";

const CP_PATH = path.join(process.cwd(), "data", "category-products.json");
const UA = "VRorgBot/1.0 (https://vr.org; evan@pizzarobotstudios.com)";
const TIMEOUT_MS = 12_000;

const data = JSON.parse(fs.readFileSync(CP_PATH, "utf-8"));

// Structural validation first.
const structErrors = [];
if (!data.categories || typeof data.categories !== "object") {
  structErrors.push("missing top-level 'categories' object");
}
for (const [key, g] of Object.entries(data.categories ?? {})) {
  if (!g.heading) structErrors.push(`${key}: missing heading`);
  if (!g.seeAll?.href || !g.seeAll?.label) structErrors.push(`${key}: missing seeAll.href/label`);
  if (!Array.isArray(g.mostPopular)) structErrors.push(`${key}: mostPopular is not an array`);
  if (!Array.isArray(g.picks) || g.picks.length < 1) structErrors.push(`${key}: picks must have at least 1 item`);
  for (const p of g.picks ?? []) {
    if (!p.name) structErrors.push(`${key}: a pick is missing name`);
    if (!p.price) structErrors.push(`${key}/${p.name}: missing price`);
    if (!p.image) structErrors.push(`${key}/${p.name}: missing image`);
    if (!p.links || Object.keys(p.links).length === 0) structErrors.push(`${key}/${p.name}: no links`);
  }
  for (const m of g.mostPopular ?? []) {
    if (!m.name || !m.href) structErrors.push(`${key}: a mostPopular row is missing name/href`);
  }
}
if (structErrors.length > 0) {
  console.log(`STRUCTURE errors (${structErrors.length}):`);
  for (const e of structErrors) console.log("  " + e);
  process.exit(1);
}
console.log("Structure OK.");

// Collect URLs to probe.
const tasks = [];
for (const [key, g] of Object.entries(data.categories)) {
  for (const p of g.picks) {
    if (p.image) tasks.push({ name: `${key}/${p.name}`, kind: "image", url: p.image });
    for (const [lk, link] of Object.entries(p.links ?? {})) {
      if (link?.url) tasks.push({ name: `${key}/${p.name}`, kind: `link:${lk}`, url: link.url });
    }
  }
  for (const m of g.mostPopular) {
    if (/^https?:\/\//i.test(m.href)) tasks.push({ name: `${key}/${m.name}`, kind: "popular", url: m.href });
  }
}

console.log(`Checking ${tasks.length} URLs in data/category-products.json...`);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const hostname = (url) => { try { return new URL(url).hostname; } catch { return ""; } };
const isAmazon = (url) => /(^|\.)amazon\./i.test(hostname(url));

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
      headers: { "User-Agent": UA, ...(method === "GET" ? { Range: "bytes=0-0" } : {}) },
      redirect: "follow",
      signal: ctrl.signal,
    });
  } finally {
    clearTimeout(t);
  }
}

async function probe(url) {
  const backoff = [0, 1500, 4000];
  for (let attempt = 0; attempt < backoff.length; attempt++) {
    if (backoff[attempt]) await sleep(backoff[attempt]);
    try {
      let res = await fetchOnce(url, "HEAD");
      if (!res.ok && [403, 405, 501].includes(res.status)) res = await fetchOnce(url, "GET");
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

function bucket(task, r) {
  if (r.ok) return "ok";
  if (isAmazon(task.url)) return "unverified";
  if (r.status === 404 || r.status === 410 || r.status === "DEAD") return "broken";
  return "unverified";
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
  console.log(`\n${unverified.length} URL(s) could not be verified (bot wall / rate limit / transient). Not failures:`);
  for (const r of unverified) console.log(`  [${r.status}] ${r.name} (${r.kind})\n        ${r.url}`);
}

if (broken.length === 0) {
  console.log(`\nAll reachable. ${results.length - unverified.length} verified OK, ${unverified.length} unverified.`);
  process.exit(0);
}

console.log(`\nBROKEN (${broken.length} of ${results.length}) -- fix before pushing:\n`);
for (const b of broken) console.log(`  ${b.name} (${b.kind})\n    [${b.status}] ${b.url}${b.err ? ` (${b.err})` : ""}`);
process.exit(1);
