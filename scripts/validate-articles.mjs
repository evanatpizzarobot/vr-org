#!/usr/bin/env node
/**
 * Build-time integrity gate for data/articles.json.
 *
 * Why this exists: getAllArticles() (src/lib/articles.ts) intentionally swallows
 * a JSON parse error and returns [], and generateStaticParams() then produces
 * zero article pages. So a corrupt or truncated articles.json does NOT fail the
 * build. It deploys "successfully" and silently ships a site with no articles and
 * no alert, which is worse than a loud failure. (check-author-rotation.mjs also
 * only warns on a bad parse, by design, so nothing else catches this.)
 *
 * This gate converts that silent failure into a loud one: if articles.json cannot
 * be parsed, is not an array, is suspiciously short (a truncated write), or has a
 * partial entry missing slug/body, the build fails here. docker compose leaves the
 * running container untouched, so the site keeps serving the last good version.
 *
 * Runtime keeps its lenient try/catch on purpose. This strictness is build-only.
 *
 * Wired into `prebuild` (gates every Docker deploy) and `npm run check:articles`.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const MIN_ARTICLES = 100; // the library is 190+; anything under 100 signals a truncated write

const here = dirname(fileURLToPath(import.meta.url));
const ARTICLES_PATH = resolve(here, "..", "data", "articles.json");

function fail(msg) {
  console.error(`\ncheck:articles  FAIL  ${msg}`);
  console.error("Build blocked so a corrupt data/articles.json cannot deploy an article-less site.");
  console.error("Fix the file or run `git restore data/articles.json`, then rebuild.\n");
  process.exit(1);
}

let raw;
try {
  raw = readFileSync(ARTICLES_PATH, "utf8");
} catch (err) {
  fail(`could not read ${ARTICLES_PATH}: ${err.message}`);
}

let articles;
try {
  articles = JSON.parse(raw);
} catch (err) {
  fail(`data/articles.json is not valid JSON: ${err.message}`);
}

if (!Array.isArray(articles)) fail("data/articles.json is not a JSON array.");
if (articles.length < MIN_ARTICLES) {
  fail(`data/articles.json has only ${articles.length} articles (expected ${MIN_ARTICLES}+). Looks truncated.`);
}

const badIdx = articles.findIndex(
  (a) => !a || typeof a.slug !== "string" || !a.slug || typeof a.body !== "string" || !a.body
);
if (badIdx !== -1) {
  fail(`article at index ${badIdx} is missing a slug or body (partial or corrupt entry).`);
}

console.log(`check:articles  OK  ${articles.length} articles, valid JSON, every entry has slug + body`);
process.exit(0);
