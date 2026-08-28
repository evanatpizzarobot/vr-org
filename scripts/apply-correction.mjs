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
 *
 * --date, when given, must be a real calendar date in strict YYYY-MM-DD
 * form. This script writes to a live published article, so a malformed date
 * (a non-ISO format, or an impossible date like a February 30th) is refused
 * with a FAIL before anything is read or written, rather than silently
 * producing an invalid updatedDate and a broken correction blockquote.
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
 * Validates that a string is a real calendar date in strict YYYY-MM-DD form.
 * Rejects anything that is not exactly that shape (so "08/29/2026" and
 * "2026-8-29" both fail), and rejects a shape-valid but impossible date such
 * as "2026-02-30". A non-ISO string that Date() would still parse is exactly
 * the trap CLAUDE.md's UTC date rule warns about: Date() reads a non-ISO
 * string in local time, which is how a malformed --date could silently write
 * the wrong day into a live article.
 *
 * @param {string} dateStr
 * @returns {boolean}
 */
export function isValidIsoDate(dateStr) {
  if (typeof dateStr !== "string") return false;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return false;
  const [y, m, d] = dateStr.split("-").map((n) => parseInt(n, 10));
  if (m < 1 || m > 12) return false;
  // new Date(year, month, 0) lands on the last day of `month` when `month`
  // is 1-indexed (1 = January ... 12 = December): passing the 1-indexed
  // month straight into Date's 0-indexed month argument names the NEXT
  // month, and day 0 of that month is the last day of the one we want. The
  // UTC form avoids any local-timezone rollover at the year or month edges.
  const daysInMonth = new Date(Date.UTC(y, m, 0)).getUTCDate();
  return d >= 1 && d <= daysInMonth;
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

  // Validated before any read or write. A malformed --date would otherwise
  // write "Correction, undefined NaN, NaN:" into a live published article
  // and set a non-ISO updatedDate, so this is checked first, ahead of even
  // the slug/text presence check below.
  if (!isValidIsoDate(date)) {
    console.error(`apply-correction  FAIL  --date "${date}" is not a valid YYYY-MM-DD calendar date`);
    process.exitCode = 1;
    return;
  }

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

  let corrected;
  try {
    corrected = applyCorrection(articles[idx], text, date);
  } catch (err) {
    // applyCorrection throws on an em dash, en dash or double hyphen in the
    // correction text (VR.org's number one writing rule). Uncaught, that
    // throw would print a raw stack trace instead of the house FAIL format
    // this script uses everywhere else.
    console.error(`apply-correction  FAIL  ${err.message}`);
    process.exitCode = 1;
    return;
  }

  articles[idx] = corrected;
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
