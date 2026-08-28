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
 * This script never fails a build over the CONTENT it reports: same-date
 * doubles are informational, not a violation, and reporting them always
 * exits 0. It DOES exit 1 for a malformed invocation, a bad --recent value
 * or a --file flag given with no path, because a script that cannot tell
 * what it was asked to check should say so rather than silently checking the
 * wrong thing (or, for a missing --file value, crashing outright).
 *
 * Usage:
 *   node scripts/check-same-date-byline.mjs               # check the whole file
 *   node scripts/check-same-date-byline.mjs --recent 12    # only the newest 12
 *   node scripts/check-same-date-byline.mjs --recent=12    # equals form, same effect
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
  const byDate = new Map(); // date -> Map(author -> slugs[])
  for (const a of articles) {
    if (!a || !a.author || !a.publishDate) continue;
    if (!byDate.has(a.publishDate)) byDate.set(a.publishDate, new Map());
    const byAuthor = byDate.get(a.publishDate);
    if (!byAuthor.has(a.author)) byAuthor.set(a.author, []);
    byAuthor.get(a.author).push(a.slug || "(no slug)");
  }
  const hits = [];
  for (const [date, byAuthor] of byDate) {
    for (const [author, slugs] of byAuthor) {
      if (slugs.length < 2) continue;
      hits.push({ date, author, slugs });
    }
  }
  hits.sort((x, y) => (x.date < y.date ? 1 : x.date > y.date ? -1 : 0));
  return hits;
}

/**
 * Parses --recent, accepting both "--recent 12" and "--recent=12" forms. The
 * equals form matches the sibling --slug flag on the network gates; the two
 * scripts disagreeing on form was itself part of the original defect, so
 * both forms are accepted everywhere a flag like this appears.
 *
 * @param {string[]} args
 * @returns {{present: boolean, valid: boolean, value: number, raw: string|null}}
 *   present: the flag appeared at all, in either form.
 *   valid: true when absent (whole-archive default is correct) OR present
 *     with a usable positive integer.
 *   value: the parsed positive integer, or 0 when absent.
 *   raw: the offending raw text, for a FAIL message, when invalid.
 */
export function parseRecentFlag(args) {
  const eqArg = args.find((a) => a.startsWith("--recent="));
  if (eqArg !== undefined) {
    const raw = eqArg.slice("--recent=".length);
    const valid = /^[1-9][0-9]*$/.test(raw);
    return { present: true, valid, value: valid ? parseInt(raw, 10) : 0, raw };
  }
  const idx = args.indexOf("--recent");
  if (idx !== -1) {
    const raw = args[idx + 1];
    const valid = raw !== undefined && /^[1-9][0-9]*$/.test(raw);
    return { present: true, valid, value: valid ? parseInt(raw, 10) : 0, raw: raw ?? null };
  }
  return { present: false, valid: true, value: 0, raw: null };
}

/**
 * Parses --file, accepting both "--file path" and "--file=path" forms. A
 * value that is missing entirely, in either form, is invalid rather than
 * silently resolving to resolve(undefined), which throws an uncaught
 * TypeError from a script documented as never crashing a build.
 *
 * @param {string[]} args
 * @returns {{present: boolean, valid: boolean, raw: string|null}}
 */
export function parseFileFlag(args) {
  const eqArg = args.find((a) => a.startsWith("--file="));
  if (eqArg !== undefined) {
    const raw = eqArg.slice("--file=".length);
    return { present: true, valid: raw.length > 0, raw: raw || null };
  }
  const idx = args.indexOf("--file");
  if (idx !== -1) {
    const raw = args[idx + 1];
    const valid = raw !== undefined && raw.length > 0 && !raw.startsWith("--");
    return { present: true, valid, raw: valid ? raw : null };
  }
  return { present: false, valid: true, raw: null };
}

function main() {
  const args = process.argv.slice(2);

  const fileFlag = parseFileFlag(args);
  if (!fileFlag.valid) {
    console.error("check:same-date  FAIL  --file was given with no path");
    process.exitCode = 1;
    return;
  }
  const articlesPath = fileFlag.present ? resolve(fileFlag.raw) : DEFAULT_ARTICLES;

  const recentFlag = parseRecentFlag(args);
  if (!recentFlag.valid) {
    console.error(`check:same-date  FAIL  --recent value "${recentFlag.raw ?? ""}" is not a positive integer`);
    process.exitCode = 1;
    return;
  }
  const recent = recentFlag.value;

  let articles;
  try {
    articles = JSON.parse(readFileSync(articlesPath, "utf8"));
    if (!Array.isArray(articles)) throw new Error("articles.json is not a JSON array");
  } catch (err) {
    console.warn(`check:same-date  WARN  could not read ${articlesPath}: ${err.message}`);
    console.warn("check:same-date  skipping (this is not a byline failure)");
    // process.exitCode (not process.exit()) so main() returns and Node drains
    // the event loop naturally, matching the other four scripts on this
    // branch. This script never fails a build over what it reports, but it
    // still needs to exit 1 for a malformed invocation below, so a plain,
    // consistent exitCode idiom (rather than process.exit() in some branches
    // and not others) is what makes both facts legible in one file.
    process.exitCode = 0;
    return;
  }

  const scope = recent > 0 ? articles.slice(0, recent) : articles;
  const windowLabel = recent > 0 ? `newest ${scope.length}` : `all ${scope.length}`;

  const hits = findSameDateBylineCollisions(scope);
  if (hits.length === 0) {
    console.log(`check:same-date  OK  ${windowLabel} articles, no author repeats a publish date`);
    process.exitCode = 0;
    return;
  }

  console.log(`check:same-date  NOTE  ${hits.length} date(s) carry two or more articles by one author (${windowLabel}, advisory, not a failure):`);
  console.log("");
  for (const hit of hits) {
    console.log(`  ${hit.date}  ${hit.author}  (${hit.slugs.length} articles)`);
    for (const slug of hit.slugs) console.log(`     ${slug}`);
  }
  console.log("");
  console.log("Doubles like this are fine, the site aims for one original per writer per day where practical but does not require it. Rotation is the real constraint: no author three or more times in a row, enforced by check:rotation.");
  process.exitCode = 0;
  return;
}

const invokedPath = process.argv[1] ? resolve(process.argv[1]) : "";
if (invokedPath === fileURLToPath(import.meta.url)) main();
