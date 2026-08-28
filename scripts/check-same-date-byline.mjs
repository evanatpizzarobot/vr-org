#!/usr/bin/env node
/**
 * Same-date byline reporter for VR.org originals (advisory only).
 *
 * Corrected rule, per the site owner: two articles by one writer on one date
 * is acceptable and happens regularly. The site aims for one original per
 * writer per day where practical, but doubling up is not a violation. The
 * hard rule is rotation: an author must never appear three or more times in
 * a row. That rule is enforced (with a real exit-1 failure) by check:rotation,
 * not by this script.
 *
 * This script never fails a build. It exists purely to surface same-date
 * doubles as an informational signal, useful during an unattended publishing
 * run ("you are doubling up on Alex today") without blocking anything.
 *
 * Always exits 0, in every code path.
 *
 * Usage:
 *   node scripts/check-same-date-byline.mjs             # check the whole file
 *   node scripts/check-same-date-byline.mjs --recent 12 # only the newest 12
 *   node scripts/check-same-date-byline.mjs --file path/to/articles.json
 *
 * NOT wired into `prebuild`. Advisory output must not gate a Docker deploy.
 * Available on demand via `npm run check:same-date`.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const DEFAULT_ARTICLES = resolve(here, "..", "data", "articles.json");

/**
 * @param {Array<{slug?: string, author?: string, publishDate?: string}>} articles
 * @returns {Array<{date: string, author: string, slugs: string[]}>}
 */
export function findSameDateBylineCollisions(articles) {
  const buckets = new Map();
  for (const a of articles) {
    if (!a || !a.author || !a.publishDate) continue;
    const key = `${a.publishDate}\u0000${a.author}`;
    if (!buckets.has(key)) buckets.set(key, []);
    buckets.get(key).push(a.slug || "(no slug)");
  }
  const hits = [];
  for (const [key, slugs] of buckets) {
    if (slugs.length < 2) continue;
    const [date, author] = key.split("\u0000");
    hits.push({ date, author, slugs });
  }
  hits.sort((x, y) => (x.date < y.date ? 1 : x.date > y.date ? -1 : 0));
  return hits;
}

function main() {
  const args = process.argv.slice(2);
  const fileIdx = args.indexOf("--file");
  const articlesPath = fileIdx !== -1 ? resolve(args[fileIdx + 1]) : DEFAULT_ARTICLES;
  const recentIdx = args.indexOf("--recent");
  const recent = recentIdx !== -1 ? parseInt(args[recentIdx + 1], 10) || 0 : 0;

  let articles;
  try {
    articles = JSON.parse(readFileSync(articlesPath, "utf8"));
    if (!Array.isArray(articles)) throw new Error("articles.json is not a JSON array");
  } catch (err) {
    console.warn(`check:same-date  WARN  could not read ${articlesPath}: ${err.message}`);
    console.warn("check:same-date  skipping (this is not a byline failure)");
    process.exit(0);
  }

  const scope = recent > 0 ? articles.slice(0, recent) : articles;
  const windowLabel = recent > 0 ? `newest ${scope.length}` : `all ${scope.length}`;

  const hits = findSameDateBylineCollisions(scope);
  if (hits.length === 0) {
    console.log(`check:same-date  OK  ${windowLabel} articles, no author repeats a publish date`);
    process.exit(0);
  }

  console.log(`check:same-date  NOTE  ${hits.length} date(s) carry two or more articles by one author (${windowLabel}, advisory, not a failure):`);
  console.log("");
  for (const hit of hits) {
    console.log(`  ${hit.date}  ${hit.author}  (${hit.slugs.length} articles)`);
    for (const slug of hit.slugs) console.log(`     ${slug}`);
  }
  console.log("");
  console.log("Doubles like this are fine, the site aims for one original per writer per day where practical but does not require it. Rotation is the real constraint: no author three or more times in a row, enforced by check:rotation.");
  process.exit(0);
}

const invokedPath = process.argv[1] ? resolve(process.argv[1]) : "";
if (invokedPath === fileURLToPath(import.meta.url)) main();
