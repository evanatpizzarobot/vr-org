#!/usr/bin/env node
/**
 * Author rotation guard for VR.org originals.
 *
 * Rule (see CLAUDE.md "Editorial Rotation Schedule" > Rules):
 *   Two articles in a row by the same author is fine once in a while.
 *   Three or more in a row is NEVER acceptable (it reads as bulk-AI-generated).
 *
 * data/articles.json is stored newest-first, which is also the order the
 * homepage "From Our Editors" feed and /originals listing display. So a run of
 * 3+ consecutive same-author entries near the top is exactly what shows up on
 * the main page.
 *
 * Exit 1 if any run of 3+ exists in the checked window, else exit 0.
 *
 * Usage:
 *   node scripts/check-author-rotation.mjs            # check the whole file
 *   node scripts/check-author-rotation.mjs --recent 12 # only the newest 12
 *
 * Wired into `prebuild` (gates every Docker deploy) and `npm run check:rotation`.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const MAX_CONSECUTIVE = 2; // 2 in a row OK, 3+ is a failure

const here = dirname(fileURLToPath(import.meta.url));
const ARTICLES_PATH = resolve(here, "..", "data", "articles.json");

const args = process.argv.slice(2);
const recentIdx = args.indexOf("--recent");
const recent = recentIdx !== -1 ? parseInt(args[recentIdx + 1], 10) || 0 : 0;

const BEATS = [
  ["Evan Marcus", "Co-Founder, VR.org", "gaming, opinion, personal takes, big features"],
  ["Alex Reeves", "Staff Writer, VR.org", "hardware, Meta / platform business, headset news"],
  ["Jordan Kuo", "Staff Writer, VR.org", "AR, XR, spatial computing, Google / Android XR"],
  ["Nina Castillo", "Staff Writer, VR.org", "software, WebXR, developer tools, open source"],
  ["Sam Whitfield", "Contributing Writer, VR.org", "enterprise, training, industry reports, Apple, NASA / institutional"],
];

let articles;
try {
  articles = JSON.parse(readFileSync(ARTICLES_PATH, "utf8"));
  if (!Array.isArray(articles)) throw new Error("articles.json is not a JSON array");
} catch (err) {
  // Never block a build for a reason unrelated to author rotation. A missing or
  // malformed articles.json is a separate problem (and would fail the app anyway).
  console.warn(`check:rotation  WARN  could not read ${ARTICLES_PATH}: ${err.message}`);
  console.warn("check:rotation  skipping (this is not a rotation failure)");
  process.exit(0);
}

const scope = recent > 0 ? articles.slice(0, recent) : articles;
const windowLabel = recent > 0 ? `newest ${scope.length}` : `all ${scope.length}`;

const runs = [];
let i = 0;
while (i < scope.length) {
  let j = i;
  while (j + 1 < scope.length && (scope[j + 1].author || "") === (scope[i].author || "")) j++;
  const len = j - i + 1;
  if (len > MAX_CONSECUTIVE) runs.push({ start: i, end: j, len, author: scope[i].author || "(none)" });
  i = j + 1;
}

if (runs.length === 0) {
  console.log(`check:rotation  OK  no author appears ${MAX_CONSECUTIVE + 1}+ times in a row (${windowLabel} articles)`);
  process.exit(0);
}

console.error(`\ncheck:rotation  FAIL  ${runs.length} run(s) of ${MAX_CONSECUTIVE + 1}+ consecutive articles by one author (${windowLabel}).`);
console.error("Two in a row is fine; three or more reads as bulk-AI-generated. Reassign a byline to break the run.\n");
for (const r of runs) {
  console.error(`  ${r.author} x${r.len}  (positions ${r.start}-${r.end}, newest-first):`);
  for (let k = r.start; k <= r.end; k++) {
    const a = scope[k];
    console.error(`     [${k}] ${a.publishDate || "????-??-??"}  ${(a.title || a.slug || "").slice(0, 72)}`);
  }
  console.error("");
}
console.error("Reassign the newest entry in each run to a different writer by beat (change author + authorRole only):");
for (const [name, role, beat] of BEATS) console.error(`   - ${name} (${role}): ${beat}`);
console.error("");
process.exit(1);
