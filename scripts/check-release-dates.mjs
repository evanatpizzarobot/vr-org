#!/usr/bin/env node
// Item-level staleness check for data/release-dates.json.
//
// The page-maintenance audit tracks whether a PAGE was refreshed. It cannot see
// that one item inside the page went stale. On 2026-07-28 the tracker was
// refreshed and several items got a fresh lastVerified, but Amelia's Escape was
// missed: it had shipped on July 23 and was still marked "expected", so it kept
// showing in the /deals Coming Soon strip as an upcoming release. This script
// catches that class of drift.
//
// Hard failures (exit 1) are limited to data that is objectively wrong and
// always actionable, so the weekly report stays worth reading. Everything else
// is reported as a warning and does not fail.
//
// Usage:
//   npm run check:release-dates

import fs from "node:fs";
import path from "node:path";

const DATA_PATH = path.join(process.cwd(), "data", "release-dates.json");
// Mirrors the /deals Coming Soon strip: getComingSoon(5) in src/lib/release-dates.ts.
const STRIP_SIZE = 5;
// Warn-only thresholds. Deliberately loose: a noisy audit gets ignored, and this
// repo has already had to loosen cadences once to stop weekly false alarms.
const STALE_VERIFY_DAYS = 30;
const PRUNE_RELEASED_DAYS = 60;
const STALE_LASTUPDATED_DAYS = 14;

const today = new Date();
today.setUTCHours(0, 0, 0, 0);
const todayStr = today.toISOString().slice(0, 10);

function daysSince(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr + "T00:00:00Z");
  if (Number.isNaN(d.getTime())) return null;
  return Math.round((today - d) / 86400000);
}

if (!fs.existsSync(DATA_PATH)) {
  console.error("release-dates.json not found at " + DATA_PATH);
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(DATA_PATH, "utf-8"));
const items = Array.isArray(data.items) ? data.items : [];

// Same ordering as sortReleaseItems(): released last, then by isoDate || sortDate,
// undated windows after dated ones, ties broken by name.
const dateKey = (i) => i.isoDate || i.sortDate || null;
function sortReleaseItems(list) {
  return [...list].sort((a, b) => {
    const ar = a.status === "released" ? 1 : 0;
    const br = b.status === "released" ? 1 : 0;
    if (ar !== br) return ar - br;
    const ka = dateKey(a);
    const kb = dateKey(b);
    if (ka && kb) return ka.localeCompare(kb);
    if (ka) return -1;
    if (kb) return 1;
    return a.name.localeCompare(b.name);
  });
}

const upcoming = sortReleaseItems(items.filter((i) => i.status !== "released"));
const strip = upcoming.slice(0, STRIP_SIZE);
const stripIds = new Set(strip.map((i) => i.id));

// HARD: shipped but still marked upcoming. This is what leaks into /deals.
const shipped = upcoming.filter((i) => {
  const k = dateKey(i);
  return k && k < todayStr;
});

// WARN: visible in the strip and not verified recently.
const stripStale = strip.filter((i) => {
  const age = daysSince(i.lastVerified);
  return age !== null && age > STALE_VERIFY_DAYS;
});

// WARN: any upcoming item left unverified for a long stretch.
const stale = upcoming.filter((i) => {
  const age = daysSince(i.lastVerified);
  return age !== null && age > STALE_VERIFY_DAYS && !stripIds.has(i.id);
});

// WARN: released items linger ~60 days per the tracker checklist, then get pruned.
const prunable = items
  .filter((i) => i.status === "released")
  .filter((i) => {
    const age = daysSince(dateKey(i));
    return age !== null && age > PRUNE_RELEASED_DAYS;
  });

const lastUpdatedAge = daysSince(data.lastUpdated);

console.log("VR.org release-dates item check  " + todayStr);
console.log("=".repeat(70));
console.log(
  items.length +
    " items  |  " +
    upcoming.length +
    " upcoming  |  " +
    (items.length - upcoming.length) +
    " released  |  lastUpdated " +
    (data.lastUpdated || "unset") +
    (lastUpdatedAge === null ? "" : " (" + lastUpdatedAge + "d ago)")
);
console.log("");

console.log("Currently in the /deals Coming Soon strip (top " + STRIP_SIZE + "):");
for (const i of strip) {
  const age = daysSince(i.lastVerified);
  console.log(
    "  - " +
      i.name +
      "  [" +
      i.status +
      "] " +
      i.dateText +
      (age === null ? "" : "  (verified " + age + "d ago)")
  );
}
console.log("");

if (shipped.length > 0) {
  console.log("SHIPPED BUT STILL LISTED AS UPCOMING  (fix required)");
  console.log("-".repeat(70));
  for (const i of shipped) {
    console.log(
      "  " +
        i.name +
        "\n      status=" +
        i.status +
        "  date=" +
        dateKey(i) +
        " (passed)  dateText=\"" +
        i.dateText +
        "\"" +
        (stripIds.has(i.id) ? "\n      VISIBLE in the /deals Coming Soon strip" : "")
    );
  }
  console.log("");
  console.log(
    "  Fix: set status to \"released\", update dateText to the real ship date,\n" +
      "  move the date to sortDate, clear isoDate, and bump lastVerified."
  );
  console.log("");
}

if (stripStale.length > 0) {
  console.log(
    "WARN: in the strip and unverified for over " + STALE_VERIFY_DAYS + " days"
  );
  console.log("-".repeat(70));
  for (const i of stripStale) {
    console.log("  " + i.name + "  (verified " + daysSince(i.lastVerified) + "d ago)");
  }
  console.log("");
}

if (stale.length > 0) {
  console.log(
    "WARN: unverified for over " + STALE_VERIFY_DAYS + " days (not yet visible)"
  );
  console.log("-".repeat(70));
  for (const i of stale) {
    console.log("  " + i.name + "  (verified " + daysSince(i.lastVerified) + "d ago)");
  }
  console.log("");
}

if (prunable.length > 0) {
  console.log(
    "WARN: released over " + PRUNE_RELEASED_DAYS + " days ago, consider pruning"
  );
  console.log("-".repeat(70));
  for (const i of prunable) {
    console.log("  " + i.name + "  (" + daysSince(dateKey(i)) + "d ago)");
  }
  console.log("");
}

if (lastUpdatedAge !== null && lastUpdatedAge > STALE_LASTUPDATED_DAYS) {
  console.log(
    "WARN: lastUpdated is " + lastUpdatedAge + " days old (" + data.lastUpdated + ")"
  );
  console.log("");
}

if (shipped.length > 0) {
  console.log(
    "Action required: " + shipped.length + " item(s) shipped but still listed as upcoming."
  );
  process.exit(1);
}

console.log("No shipped-but-upcoming items. Tracker is internally consistent.");
process.exit(0);
