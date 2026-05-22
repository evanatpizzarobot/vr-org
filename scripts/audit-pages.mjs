#!/usr/bin/env node
// Audit pillar / best-of pages for staleness against data/page-maintenance.json.
//
// For each page, reads the dateModified from its JSON-LD articleSchema literal
// in the .tsx source, compares to the page's cadenceDays, and reports what is
// overdue, due soon, or fresh. Exits 1 if any page is overdue (so this can
// gate a scheduled refresh task).
//
// Usage:
//   npm run audit:pages           # full report
//   npm run audit:pages -- --due  # only print pages that are overdue or due soon

import fs from "node:fs";
import path from "node:path";

const REGISTRY_PATH = path.join(process.cwd(), "data", "page-maintenance.json");
const DUE_SOON_BUFFER_CAP_DAYS = 7;
const onlyDue = process.argv.includes("--due");

// Warn proportionally to cadence: weekly pages get ~2d notice, monthly+ get 7d.
function dueSoonBuffer(cadenceDays) {
  return Math.min(DUE_SOON_BUFFER_CAP_DAYS, Math.max(1, Math.ceil(cadenceDays / 4)));
}

const registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, "utf-8"));
const today = new Date();
today.setUTCHours(0, 0, 0, 0);

function daysBetween(a, b) {
  return Math.round((a - b) / (1000 * 60 * 60 * 24));
}

function readDateModified(file) {
  const abs = path.join(process.cwd(), file);
  if (!fs.existsSync(abs)) return null;
  const src = fs.readFileSync(abs, "utf-8");
  // Match the first dateModified: "YYYY-MM-DD" in the file (the article schema).
  const m = src.match(/dateModified:\s*"(\d{4}-\d{2}-\d{2})"/);
  return m ? m[1] : null;
}

const rows = [];
for (const page of registry.pages) {
  const fileDate = readDateModified(page.file);
  const sourceDate = fileDate || page.lastRefreshed;
  const refreshed = new Date(sourceDate + "T00:00:00Z");
  const ageDays = daysBetween(today, refreshed);
  const overdueBy = ageDays - page.cadenceDays;
  const buffer = dueSoonBuffer(page.cadenceDays);
  let status;
  if (overdueBy > 0) status = "OVERDUE";
  else if (overdueBy >= -buffer) status = "DUE SOON";
  else status = "fresh";
  rows.push({
    path: page.path,
    file: page.file,
    category: page.category,
    cadenceDays: page.cadenceDays,
    sourceDate,
    sourceWasFile: !!fileDate,
    ageDays,
    overdueBy,
    status,
    checklist: page.checklist,
  });
}

const overdue = rows.filter((r) => r.status === "OVERDUE");
const dueSoon = rows.filter((r) => r.status === "DUE SOON");
const fresh = rows.filter((r) => r.status === "fresh");

function fmt(r) {
  const tag = r.status === "OVERDUE"
    ? `[OVERDUE +${r.overdueBy}d]`
    : r.status === "DUE SOON"
      ? `[DUE in ${-r.overdueBy}d]`
      : `[fresh, ${r.cadenceDays - r.ageDays}d remaining]`;
  return `${tag.padEnd(28)} ${r.path.padEnd(24)} cadence ${r.cadenceDays}d  ` +
         `last ${r.sourceDate}${r.sourceWasFile ? "" : " (registry)"}`;
}

console.log(`VR.org page maintenance audit  ${today.toISOString().slice(0, 10)}`);
console.log("=".repeat(70));
console.log(`${rows.length} pages tracked  |  ${overdue.length} overdue  |  ${dueSoon.length} due soon  |  ${fresh.length} fresh`);
console.log("");

if (overdue.length > 0) {
  console.log("OVERDUE  (refresh required)");
  console.log("-".repeat(70));
  for (const r of overdue) {
    console.log("  " + fmt(r));
    for (const item of r.checklist) console.log("      - " + item);
  }
  console.log("");
}

if (dueSoon.length > 0) {
  console.log("DUE SOON  (warn window scales with cadence)");
  console.log("-".repeat(70));
  for (const r of dueSoon) console.log("  " + fmt(r));
  console.log("");
}

if (!onlyDue && fresh.length > 0) {
  console.log("FRESH");
  console.log("-".repeat(70));
  for (const r of fresh) console.log("  " + fmt(r));
  console.log("");
}

if (overdue.length > 0) {
  console.log("Action required: " + overdue.length + " page(s) need refresh.");
  process.exit(1);
}
console.log("All pages within cadence.");
process.exit(0);
