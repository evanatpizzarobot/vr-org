#!/usr/bin/env node
// Flag images that are reused across too many articles.
//
// A handful of stock photos had quietly spread across the archive (one
// Ray-Ban shot appeared in 23 separate articles) which makes the site look
// machine-assembled to anyone browsing a category hub. This catches that
// before it ships rather than after.
//
// Usage:
//   npm run check:image-reuse                 full report, always exit 0
//   npm run check:image-reuse -- --slug=foo   check one article, exit 1 on violation
//   npm run check:image-reuse -- --max=2      change the threshold (default 2)
//
// In --slug mode the article fails if any of its images already appear in
// more than --max OTHER articles.

import fs from "node:fs";
import path from "node:path";

const ARTICLES_PATH = path.join(process.cwd(), "data", "articles.json");
const IMG_RE = /<img\s[^>]*src=["']([^"']+)["']/gi;

const arg = (name, fallback) => {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : fallback;
};

const slugFilter = arg("slug", null);
const max = Number(arg("max", "2"));

const articles = JSON.parse(fs.readFileSync(ARTICLES_PATH, "utf-8"));

// Normalise so the same underlying asset counts once. This has to be
// host-aware: naively taking the last path segment collapses every YouTube
// thumbnail into "maxresdefault.jpg" and every Steam header into "header.jpg",
// which reports hundreds of unrelated images as one wildly overused file.
function keyFor(url) {
  const clean = url.split("?")[0];

  // YouTube: the video ID is the identity, the filename is always the same.
  const yt = clean.match(/img\.youtube\.com\/vi\/([^/]+)\//);
  if (yt) return `youtube:${yt[1]}`;

  // Wikimedia: /thumb/a/ab/File.jpg/1280px-File.jpg and the original both
  // refer to one file, so key on the filename with any size prefix stripped.
  if (clean.includes("upload.wikimedia.org")) {
    let name = clean.split("/").pop() ?? clean;
    try {
      name = decodeURIComponent(name);
    } catch {
      /* leave as-is if it is not valid encoding */
    }
    return `commons:${name.replace(/^\d+px-/, "").replace(/_/g, " ").toLowerCase()}`;
  }

  // Everything else (Steam CDN, self-hosted /article-images, press CDNs) is
  // already unique per asset at the path level.
  return clean.replace(/^https?:\/\//, "").toLowerCase();
}

/** @type {Map<string, {url: string, slugs: string[]}>} */
const usage = new Map();
for (const a of articles) {
  const seenHere = new Set();
  for (const m of a.body.matchAll(IMG_RE)) {
    const k = keyFor(m[1]);
    if (seenHere.has(k)) continue; // same image twice in one article counts once
    seenHere.add(k);
    if (!usage.has(k)) usage.set(k, { url: m[1], slugs: [] });
    usage.get(k).slugs.push(a.slug);
  }
}

if (slugFilter) {
  const target = articles.find((a) => a.slug === slugFilter);
  if (!target) {
    console.error(`No article with slug "${slugFilter}".`);
    process.exit(1);
  }
  const violations = [];
  for (const m of target.body.matchAll(IMG_RE)) {
    const k = keyFor(m[1]);
    const others = (usage.get(k)?.slugs ?? []).filter((s) => s !== slugFilter);
    if (others.length > max) violations.push({ url: m[1], others });
  }
  if (!violations.length) {
    console.log(`check:image-reuse  OK  ${slugFilter} uses no over-reused images.`);
    process.exit(0);
  }
  console.log(`check:image-reuse  FAIL  ${slugFilter} reuses ${violations.length} image(s) already used elsewhere:\n`);
  for (const v of violations) {
    console.log(`  ${v.url}`);
    console.log(`    already in ${v.others.length} other articles: ${v.others.slice(0, 5).join(", ")}${v.others.length > 5 ? ", ..." : ""}`);
  }
  console.log(`\nPick a different image. See vr-org-image-reuse-audit.txt for verified alternatives.`);
  process.exit(1);
}

const offenders = [...usage.entries()]
  .filter(([, v]) => v.slugs.length > max)
  .sort((a, b) => b[1].slugs.length - a[1].slugs.length);

const placements = [...usage.values()].reduce((n, v) => n + v.slugs.length, 0);

console.log(`check:image-reuse  ${articles.length} articles, ${usage.size} distinct images, ${placements} placements.`);

if (!offenders.length) {
  console.log(`No image is used in more than ${max} articles.`);
  process.exit(0);
}

console.log(`\n${offenders.length} image(s) used in more than ${max} articles:\n`);
for (const [, v] of offenders) {
  console.log(`  ${v.slugs.length}x  ${v.url}`);
  console.log(`      ${v.slugs.slice(0, 4).join(", ")}${v.slugs.length > 4 ? `, +${v.slugs.length - 4} more` : ""}`);
}
console.log(`\nInformational only. New articles should avoid these; run with --slug=<slug> to gate one article.`);
process.exit(0);
