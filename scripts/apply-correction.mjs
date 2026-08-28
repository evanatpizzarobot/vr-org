#!/usr/bin/env node
/**
 * Apply a correction to a published VR.org article, in house format.
 *
 * VR.org does not quietly edit published articles. A factual error gets a dated
 * correction appended at the bottom and updatedDate set, so the original text
 * and the fix are both visible. Reference article:
 * steam-frame-verified-90fps-stricter-than-quest-pico
 *
 * This exists because applying that by hand means hand-editing a 300+ entry
 * JSON file, and the constraints (LF endings, indent 2, do not reformat the
 * rest of the file) are easy to violate under time pressure.
 *
 * Note: a correction is for a factual error. News developing on a published
 * story gets a NEW follow-up article, never an edit. See CLAUDE.md.
 *
 * Usage:
 *   node scripts/apply-correction.mjs --slug=some-slug --text="The price is $549, not $649."
 *   node scripts/apply-correction.mjs --slug=some-slug --text="..." --date=2026-08-29
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const DEFAULT_ARTICLES = resolve(here, "..", "data", "articles.json");

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/**
 * @param {string} text correction text
 * @param {string} date ISO date, YYYY-MM-DD
 * @returns {string} house-format correction blockquote
 */
export function buildCorrectionBlock(text, date) {
  const [y, m, d] = date.split("-").map((n) => parseInt(n, 10));
  const pretty = `${MONTHS[m - 1]} ${d}, ${y}`;
  return `<blockquote><strong>Correction, ${pretty}:</strong> ${text}</blockquote>`;
}

/**
 * @param {object} article
 * @param {string} text
 * @param {string} date ISO date, YYYY-MM-DD
 * @returns {object} a new article object, input untouched
 */
export function applyCorrection(article, text, date) {
  if (text.includes("\u2014") || text.includes("\u2013")) {
    throw new Error("Correction text contains an em dash or en dash. VR.org never uses them.");
  }
  if (text.includes("--")) {
    throw new Error("Correction text contains a double hyphen. VR.org never uses them.");
  }
  return {
    ...article,
    body: article.body + buildCorrectionBlock(text, date),
    updatedDate: date,
  };
}

function main() {
  const args = process.argv.slice(2);
  const get = (name) => {
    const hit = args.find((a) => a.startsWith(`--${name}=`));
    return hit ? hit.slice(name.length + 3) : null;
  };

  const slug = get("slug");
  const text = get("text");
  const date = get("date") || new Date().toISOString().slice(0, 10);

  if (!slug || !text) {
    console.error("Usage: node scripts/apply-correction.mjs --slug=SLUG --text=\"...\" [--date=YYYY-MM-DD]");
    process.exitCode = 1;
    return;
  }

  const articles = JSON.parse(readFileSync(DEFAULT_ARTICLES, "utf8"));
  const idx = articles.findIndex((a) => a.slug === slug);
  if (idx === -1) {
    console.error(`apply-correction  FAIL  no article with slug "${slug}"`);
    process.exitCode = 1;
    return;
  }

  articles[idx] = applyCorrection(articles[idx], text, date);
  writeFileSync(DEFAULT_ARTICLES, JSON.stringify(articles, null, 2) + "\n", "utf8");

  console.log(`apply-correction  OK  ${slug}`);
  console.log(`  updatedDate set to ${date}`);
  console.log("  Editing a published article requires a FORCED Docker rebuild, not a data-only deploy.");
  console.log("  After pushing, run the rebuild and confirm the correction renders.");
  process.exitCode = 0;
  return;
}

const invokedPath = process.argv[1] ? resolve(process.argv[1]) : "";
if (invokedPath === fileURLToPath(import.meta.url)) main();
