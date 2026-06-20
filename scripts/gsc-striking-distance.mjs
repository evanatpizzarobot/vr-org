#!/usr/bin/env node
// GSC striking-distance + CTR-gap miner for VR.org.
//
// Reads a Google Search Console performance export (the Pages.csv and
// Queries.csv that come out of the GSC "Export" button) and ranks the highest
// opportunity SEO moves: pages/queries that already earn impressions at a
// climbable position, and pages bleeding clicks to a weak CTR. It does NOT
// predict click counts (rank/CTR moves are not that predictable). It RANKS by a
// transparent, relative opportunity score so a human can pick the next batch of
// title/meta/content fixes. This is the deterministic core a weekly claude.ai
// routine runs on the latest export.
//
// Usage:
//   node scripts/gsc-striking-distance.mjs <export-dir>
//   node scripts/gsc-striking-distance.mjs <Pages.csv> [Queries.csv]
//   npm run gsc:mine -- <export-dir>
//
// Flags:
//   --min-impressions N   minimum impressions to consider (default 1000)
//   --top N               rows to show per section (default 20)

import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const flags = {};
const positionals = [];
for (let i = 0; i < args.length; i++) {
  if (args[i] === "--min-impressions") flags.minImpr = Number(args[++i]);
  else if (args[i] === "--top") flags.top = Number(args[++i]);
  else positionals.push(args[i]);
}
const MIN_IMPR = Number.isFinite(flags.minImpr) ? flags.minImpr : 1000;
const TOP = Number.isFinite(flags.top) ? flags.top : 20;
// Striking distance: ranking on page 1 to early page 2, where a nudge pays off.
const SD_MIN_POS = 4.5;
const SD_MAX_POS = 20.5;
// CTR is "weak" below this for the page's impression weight (head terms on this
// site sit far under generic benchmarks, so this is a low, site-aware floor).
const WEAK_CTR = 0.6; // percent

function resolveInputs(pos) {
  if (pos.length === 0) {
    console.error("Provide a GSC export directory or Pages.csv [Queries.csv].");
    process.exit(1);
  }
  let pagesPath, queriesPath;
  const first = pos[0];
  if (fs.existsSync(first) && fs.statSync(first).isDirectory()) {
    pagesPath = path.join(first, "Pages.csv");
    queriesPath = path.join(first, "Queries.csv");
  } else {
    pagesPath = first;
    queriesPath = pos[1];
  }
  return { pagesPath, queriesPath };
}

// Minimal CSV parser that handles quoted fields and BOM.
function parseCsv(text) {
  const rows = [];
  let row = [], field = "", inQ = false;
  text = text.replace(/^﻿/, "");
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQ) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') inQ = false;
      else field += c;
    } else if (c === '"') inQ = true;
    else if (c === ",") { row.push(field); field = ""; }
    else if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; }
    else if (c === "\r") { /* skip */ }
    else field += c;
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  return rows.filter((r) => r.length && r.some((c) => c !== ""));
}

const num = (s) => Number(String(s ?? "").replace(/[%,$]/g, "").trim()) || 0;

function loadTable(file, keyName) {
  if (!file || !fs.existsSync(file)) return null;
  const rows = parseCsv(fs.readFileSync(file, "utf-8"));
  if (rows.length < 2) return null;
  const header = rows[0].map((h) => h.toLowerCase().trim());
  const idx = (cands) => header.findIndex((h) => cands.some((c) => h.includes(c)));
  const kI = idx(keyName === "page" ? ["page", "url", "landing"] : ["quer", "search term"]);
  const cI = idx(["click"]);
  const iI = idx(["impress"]);
  const tI = idx(["ctr"]);
  const pI = idx(["position"]);
  if (kI < 0 || iI < 0 || pI < 0) return null;
  return rows.slice(1).map((r) => ({
    key: r[kI],
    clicks: num(r[cI]),
    impressions: num(r[iI]),
    ctr: num(r[tI]),
    position: num(r[pI]),
  })).filter((r) => r.key);
}

// Relative opportunity score (NOT a click prediction). Rewards big impressions
// at a climbable position and a CTR that lags. Position weight peaks just off
// the top of page 1, where the realistic gain from a nudge is largest.
function strikingScore(r) {
  if (r.position < SD_MIN_POS || r.position > SD_MAX_POS) return 0;
  const posWeight = 1 / Math.pow(r.position - 2, 0.9); // higher as we approach top
  const ctrLag = Math.max(0.2, WEAK_CTR - r.ctr) / WEAK_CTR + 0.5;
  return (r.impressions / 1000) * posWeight * ctrLag;
}

function fmt(r) {
  return `clicks ${String(r.clicks).padStart(5)}  impr ${String(r.impressions).padStart(8)}  CTR ${(r.ctr).toFixed(2).padStart(5)}%  pos ${r.position.toFixed(1).padStart(5)}`;
}

function section(title, rows, label) {
  console.log(`\n=== ${title} ===`);
  if (!rows.length) { console.log("  (none)"); return; }
  rows.forEach((r, i) => {
    console.log(`${String(i + 1).padStart(2)}. ${r.key}`);
    console.log(`    ${fmt(r)}   score ${r._score.toFixed(1)}`);
    if (label) console.log(`    -> ${label(r)}`);
  });
}

const { pagesPath, queriesPath } = resolveInputs(positionals);
const pages = loadTable(pagesPath, "page");
const queries = loadTable(queriesPath, "query");
if (!pages && !queries) {
  console.error(`Could not read GSC tables. Looked for Pages.csv at ${pagesPath}` + (queriesPath ? ` and Queries.csv at ${queriesPath}` : ""));
  process.exit(1);
}

console.log(`VR.org GSC striking-distance miner`);
console.log(`min impressions: ${MIN_IMPR} | striking-distance positions: ${SD_MIN_POS}-${SD_MAX_POS} | weak CTR floor: ${WEAK_CTR}%`);
console.log(`NOTE: scores are a relative prioritization aid, not click predictions.`);

if (pages) {
  const elig = pages.filter((r) => r.impressions >= MIN_IMPR);
  const sd = elig.filter((r) => strikingScore(r) > 0)
    .map((r) => ({ ...r, _score: strikingScore(r) }))
    .sort((a, b) => b._score - a._score).slice(0, TOP);
  section("STRIKING-DISTANCE PAGES (climb these to top 5)", sd,
    (r) => `Rewrite title/meta for the head term + add depth/internal links. Sits at pos ${r.position.toFixed(1)} on ${r.impressions.toLocaleString()} impressions.`);

  const ctrGap = elig.filter((r) => r.ctr < WEAK_CTR && r.impressions >= MIN_IMPR * 3)
    .map((r) => ({ ...r, _score: r.impressions / 1000 }))
    .sort((a, b) => b._score - a._score).slice(0, TOP);
  section("CTR-GAP PAGES (harvest clicks with a better title/meta)", ctrGap,
    (r) => `${r.impressions.toLocaleString()} impressions at only ${r.ctr.toFixed(2)}% CTR. Front-load the query, year, and a concrete pick/price in the title + meta.`);
}

if (queries) {
  const sd = queries.filter((r) => r.impressions >= MIN_IMPR && strikingScore(r) > 0)
    .map((r) => ({ ...r, _score: strikingScore(r) }))
    .sort((a, b) => b._score - a._score).slice(0, TOP);
  section("STRIKING-DISTANCE QUERIES (target with a page or section)", sd,
    (r) => `"${r.key}" ranks pos ${r.position.toFixed(1)} on ${r.impressions.toLocaleString()} impressions. Map to the best-matching page; add an H2/FAQ that answers it directly.`);
}

console.log(`\nDone. Review, pick a batch of 5-8, edit title/meta/content, then request reindexing in GSC.`);
