#!/usr/bin/env node
// Verify every <img src> in data/articles.json returns a 200.
// Exit 1 if any are broken so the article pipeline (and CI) can block
// before pushing. Run with: npm run check:images
//
// Optional flag: --slug=<slug> to limit the check to a single article.

import fs from "node:fs";
import path from "node:path";

const ARTICLES_PATH = path.join(process.cwd(), "data", "articles.json");
const UA = "VRorgBot/1.0 (https://vr.org; evan@pizzarobotstudios.com)";
const IMG_RE = /<img\s[^>]*src=["']([^"']+)["']/gi;
const TIMEOUT_MS = 10_000;

const slugFilter = (process.argv.find((a) => a.startsWith("--slug="))
  ?? "").slice("--slug=".length) || null;

const raw = fs.readFileSync(ARTICLES_PATH, "utf-8");
const articles = JSON.parse(raw);

const tasks = [];
for (const article of articles) {
  if (slugFilter && article.slug !== slugFilter) continue;
  for (const m of article.body.matchAll(IMG_RE)) {
    tasks.push({ slug: article.slug, url: m[1] });
  }
}

console.log(
  `Checking ${tasks.length} image URL${tasks.length === 1 ? "" : "s"} ` +
  `across ${slugFilter ? 1 : articles.length} article${slugFilter ? "" : "s"}...`
);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

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
  // Retry on 429 (rate limit) with backoff. Wikimedia rate-limits aggressively
  // and a 429 does not mean the image is broken.
  const backoff = [0, 1500, 4000];
  for (let attempt = 0; attempt < backoff.length; attempt++) {
    if (backoff[attempt]) await sleep(backoff[attempt]);
    try {
      let res = await fetchOnce(url, "HEAD");
      if (!res.ok && (res.status === 405 || res.status === 403)) {
        res = await fetchOnce(url, "GET");
      }
      if (res.status === 429 && attempt < backoff.length - 1) continue;
      return { ok: res.ok, status: res.status };
    } catch (err) {
      if (attempt < backoff.length - 1) continue;
      return { ok: false, status: "ERR", err: err.message || String(err) };
    }
  }
  return { ok: false, status: "ERR" };
}

const concurrency = 4;
const results = [];
let i = 0;
async function worker() {
  while (i < tasks.length) {
    const idx = i++;
    const task = tasks[idx];
    const r = await probe(task.url);
    results[idx] = { ...task, ...r };
    if (!r.ok) {
      process.stdout.write("x");
    } else {
      process.stdout.write(".");
    }
  }
}
await Promise.all(Array.from({ length: concurrency }, worker));
process.stdout.write("\n");

// 429 means the host rate-limited us, not that the image is missing.
// Surface those separately so the pipeline does not treat them as failures.
const broken = results.filter((r) => !r.ok && r.status !== 429);
const rateLimited = results.filter((r) => r.status === 429);

if (rateLimited.length > 0) {
  console.log(`\n${rateLimited.length} image${rateLimited.length === 1 ? "" : "s"} could not be verified (host rate-limited):`);
  for (const r of rateLimited) {
    console.log(`  [429] ${r.slug}`);
    console.log(`        ${r.url}`);
  }
}

if (broken.length === 0) {
  console.log(`\nAll ${tasks.length - rateLimited.length} verified images OK.`);
  process.exit(0);
}

console.log(`\nBroken images (${broken.length} of ${tasks.length}):\n`);
const bySlug = new Map();
for (const b of broken) {
  if (!bySlug.has(b.slug)) bySlug.set(b.slug, []);
  bySlug.get(b.slug).push(b);
}
for (const [slug, list] of bySlug) {
  console.log(`  ${slug}`);
  for (const b of list) {
    console.log(`    [${b.status}] ${b.url}${b.err ? ` (${b.err})` : ""}`);
  }
}
process.exit(1);
