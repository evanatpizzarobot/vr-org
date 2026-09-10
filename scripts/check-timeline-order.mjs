#!/usr/bin/env node
/**
 * Chronological-order gate for the hand-maintained timelines on pillar pages.
 *
 * The coverage timelines and signal tables on /steam-frame, /meta-connect-2026,
 * /steam-frame-price and the rest of the cluster are plain arrays in page.tsx,
 * rendered in array order. Nothing sorted them and nothing checked them, so a
 * refresh that appended its new entries newest-first shipped a timeline running
 * backwards. That is how /steam-frame spent two weeks reading Aug 19, Sep 8,
 * Sep 6, Sep 1, Aug 27, Aug 24 until a reader emailed contact@vr.org on
 * 2026-09-10 to point it out. Three more pages in the cluster had the same
 * defect in smaller doses.
 *
 * One finding, blocking:
 *
 *   OUT OF ORDER   An entry sits earlier in the array than an entry it should
 *                  follow, given the direction the rest of the array runs.
 *
 * Direction is read from each array rather than assumed. /great-on-frame lists
 * its changelog newest-first on purpose and says so in its own caption, so a
 * hardcoded oldest-first rule would fail a page that is correct. The direction
 * is taken from the first and last dated entries, which survives a stray run at
 * either end; a tie falls back to whichever direction most neighbouring pairs
 * run, and a genuine tie reports nothing.
 *
 * Coarse labels are skipped, not sorted. PRICE_SIGNALS and DATE_SIGNALS mix
 * full dates with "Nov 2025", "Jul 2026" and "Early 2026". The last of those
 * does not parse at all, and a month-only label collapses to the 1st, which
 * would drag an entry that is sitting exactly where its author put it. The
 * cost is a real gap: a month-only label dropped in the wrong place passes
 * this gate. Narrow is deliberate, because this gate blocks the unattended
 * travel-mode run and a false positive costs a redraft.
 *
 * An array needs three dated entries before it is judged. Two entries carry no
 * evidence of which way they are meant to run.
 *
 * Exit 1 if any finding, else exit 0.
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const MONTHS = {
  Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
  Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
};

const MIN_DATED_ENTRIES = 3;

/**
 * A house date is "Mon D, YYYY". Anything coarser returns null so the caller
 * skips it rather than guessing a day for it.
 */
export function parseTimelineDate(label) {
  const match = /^([A-Z][a-z]{2}) (\d{1,2}), (\d{4})$/.exec(String(label ?? "").trim());
  if (!match) return null;
  const month = MONTHS[match[1]];
  if (month === undefined) return null;
  const day = Number(match[2]);
  const year = Number(match[3]);
  const stamp = Date.UTC(year, month, day);
  const round = new Date(stamp);
  if (round.getUTCMonth() !== month || round.getUTCDate() !== day) return null;
  return stamp;
}

/**
 * Walk forward from an opening bracket to its match, ignoring brackets that sit
 * inside string literals. Article prose is full of stray brackets, so counting
 * them blind desynchronises the scan.
 */
function readArrayBody(source, openIndex) {
  let depth = 0;
  let quote = null;
  for (let i = openIndex; i < source.length; i++) {
    const ch = source[i];
    if (quote) {
      if (ch === "\\") i++;
      else if (ch === quote) quote = null;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === "`") {
      quote = ch;
      continue;
    }
    if (ch === "[") depth++;
    else if (ch === "]") {
      depth--;
      if (depth === 0) return source.slice(openIndex + 1, i);
    }
  }
  return null;
}

/**
 * Every top-level const array in a source file that carries enough `date:`
 * fields to have an order at all.
 */
export function extractDateArrays(source) {
  const found = [];
  const declaration = /const\s+([A-Za-z_$][\w$]*)\s*(?::[^=]*?)?=\s*\[/g;
  let match;
  while ((match = declaration.exec(source)) !== null) {
    const openIndex = source.indexOf("[", match.index + match[0].length - 1);
    const body = readArrayBody(source, openIndex);
    if (body === null) continue;
    declaration.lastIndex = openIndex + body.length;
    const dates = [...body.matchAll(/\bdate:\s*"([^"]*)"/g)].map((m) => m[1]);
    if (dates.length < MIN_DATED_ENTRIES) continue;
    found.push({
      name: match[1],
      dates,
      line: source.slice(0, match.index).split("\n").length,
    });
  }
  return found;
}

/**
 * Entries that break the direction the rest of the array runs in.
 */
export function findOrderViolations(labels) {
  const points = [];
  (labels ?? []).forEach((label, index) => {
    const stamp = parseTimelineDate(label);
    if (stamp !== null) points.push({ index, label, stamp });
  });
  if (points.length < MIN_DATED_ENTRIES) return [];

  let direction = Math.sign(points.at(-1).stamp - points[0].stamp);
  if (direction === 0) {
    let up = 0;
    let down = 0;
    for (let i = 1; i < points.length; i++) {
      if (points[i].stamp > points[i - 1].stamp) up++;
      else if (points[i].stamp < points[i - 1].stamp) down++;
    }
    direction = Math.sign(up - down);
  }
  if (direction === 0) return [];

  const violations = [];
  for (let i = 1; i < points.length; i++) {
    const previous = points[i - 1];
    const current = points[i];
    const backwards =
      direction > 0 ? current.stamp < previous.stamp : current.stamp > previous.stamp;
    if (backwards) {
      violations.push({
        index: current.index,
        previous: previous.label,
        current: current.label,
      });
    }
  }
  return violations;
}

function pageFiles(root) {
  const out = [];
  const walk = (dir) => {
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry);
      if (statSync(full).isDirectory()) walk(full);
      else if (entry === "page.tsx") out.push(full);
    }
  };
  walk(root);
  return out.sort();
}

function main() {
  const repoRoot = resolve(fileURLToPath(new URL("..", import.meta.url)));
  const appRoot = join(repoRoot, "src", "app");
  const findings = [];
  let arraysChecked = 0;

  for (const file of pageFiles(appRoot)) {
    const source = readFileSync(file, "utf8");
    for (const array of extractDateArrays(source)) {
      arraysChecked++;
      const violations = findOrderViolations(array.dates);
      if (violations.length > 0) {
        findings.push({ file: relative(repoRoot, file), array, violations });
      }
    }
  }

  if (findings.length === 0) {
    console.log(
      `check:timelines  OK  ${arraysChecked} dated array(s) across the app, every one in order`
    );
    process.exit(0);
  }

  const total = findings.reduce((n, f) => n + f.violations.length, 0);
  console.error(`\ncheck:timelines  FAIL  ${total} entry/entries out of chronological order\n`);
  for (const finding of findings) {
    console.error(`  ${finding.file}  ${finding.array.name} (line ${finding.array.line})`);
    for (const v of finding.violations) {
      console.error(`     OUT OF ORDER: "${v.current}" follows "${v.previous}"`);
    }
    console.error("");
  }
  console.error(
    "These arrays render in array order, so the page shows what the array says.\n" +
      "Move the entries into position. New entries go at the END of the array in\n" +
      "chronological order, not at the end newest-first.\n"
  );
  process.exit(1);
}

const invokedPath = process.argv[1] ? resolve(process.argv[1]) : "";
if (invokedPath === fileURLToPath(import.meta.url)) main();
