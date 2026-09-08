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
// TWO THINGS THIS SCRIPT DELIBERATELY DOES NOT DO, both learned on 2026-09-08:
//
// 1. It does not tell you an item shipped. A passed date means the date is
//    wrong, and it cannot see whether the product launched or the launch
//    slipped. That morning five strip items tripped the passed-date check and
//    only three had actually shipped: Transformers: Beyond Reality Redux had
//    moved from September 3 to September 10 and the Meta Store still read
//    "Coming soon", and Pico Space Pro had cancelled its event outright. The
//    check used to print "Fix: set status to released", and following that
//    literally would have published two false "out now" entries on a live page.
//    It now names both outcomes and sends you to the source to pick one.
//
// 2. It cannot catch drift on its own, because the drift that matters most
//    happens while the date is still in the future. The Pico Space Pro entry
//    was wrong for 13 days: we published the delay on August 26 and never
//    edited the tracker, so /deals advertised a cancelled event with a date
//    that had not passed yet and nothing flagged it. findTrackerDrift compares
//    each item against the newest article in the archive about that item, which
//    is the signal that existed the whole time and nothing was reading.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";

const DATA_PATH = path.join(process.cwd(), "data", "release-dates.json");
const ARTICLES_PATH = path.join(process.cwd(), "data", "articles.json");
// Mirrors the /deals Coming Soon strip: getComingSoon(5) in src/lib/release-dates.ts.
const STRIP_SIZE = 5;
// Warn-only thresholds. Deliberately loose: a noisy audit gets ignored, and this
// repo has already had to loosen cadences once to stop weekly false alarms.
const STALE_VERIFY_DAYS = 30;
const PRUNE_RELEASED_DAYS = 60;
const STALE_LASTUPDATED_DAYS = 14;

// Generic product words. Dropping them loosens matching just enough that
// "RayNeo iO Smart Glasses" still finds "rayneo-io-gt-max-two-devices-...".
const GENERIC_TOKENS = new Set([
  "the", "a", "an", "and", "of", "for", "with",
  "vr", "ar", "xr", "smart", "glasses", "headset", "edition", "version",
]);

export function dateKey(item) {
  return item.isoDate || item.sortDate || null;
}

// Same ordering as sortReleaseItems(): released last, then by isoDate || sortDate,
// undated windows after dated ones, ties broken by name.
export function sortReleaseItems(list) {
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

// Items whose date has passed while they are still listed as upcoming. The date
// is wrong; this cannot say whether the cause was a launch or a slip.
export function findPassedDateItems(upcoming, todayStr) {
  return upcoming.filter((i) => {
    const k = dateKey(i);
    return k && k < todayStr;
  });
}

// Distinctive tokens from a product name, for matching against article slugs.
export function itemNameTokens(name) {
  if (!name) return [];
  const raw = String(name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .split(" ")
    .filter(Boolean)
    .filter((t) => !GENERIC_TOKENS.has(t));
  return [...new Set(raw)];
}

// An article is "about" an item when every distinctive token of the item name
// appears as a whole segment of the article slug. Segment matching rather than
// substring keeps "io" from matching "studio". Conservative on purpose: it
// misses items whose articles use a different name for the product, and that is
// the right trade for a warn-only signal nobody should learn to ignore.
export function articleMatchesItem(article, tokens) {
  if (tokens.length < 2) return false;
  const segments = new Set(String(article.slug || "").toLowerCase().split("-"));
  return tokens.every((t) => segments.has(t));
}

function lastPathSegment(link) {
  if (!link) return null;
  const parts = String(link).split("/").filter(Boolean);
  return parts.length ? parts[parts.length - 1] : null;
}

// Tracker entries the archive has already moved past.
export function findTrackerDrift(items, articles) {
  const out = [];
  for (const item of items) {
    const tokens = itemNameTokens(item.name);
    if (tokens.length < 2) continue;

    const matches = articles.filter((a) => articleMatchesItem(a, tokens));
    if (matches.length === 0) continue;

    const newest = [...matches].sort((a, b) =>
      String(b.publishDate || "").localeCompare(String(a.publishDate || ""))
    )[0];
    if (!newest.publishDate) continue;

    const reasons = [];
    if (item.lastVerified && newest.publishDate > item.lastVerified) {
      reasons.push(
        `article "${newest.slug}" (${newest.publishDate}) is newer than lastVerified ${item.lastVerified}`
      );
    }

    const linkSlug = lastPathSegment(item.link);
    if (linkSlug && linkSlug !== newest.slug) {
      const linked = articles.find((a) => a.slug === linkSlug);
      if (linked && linked.publishDate && newest.publishDate > linked.publishDate) {
        reasons.push(
          `link points at "${linkSlug}" (${linked.publishDate}) but "${newest.slug}" (${newest.publishDate}) is newer`
        );
      }
    }

    if (reasons.length) out.push({ item, newest, reasons });
  }
  return out;
}

function daysSince(dateStr, today) {
  if (!dateStr) return null;
  const d = new Date(dateStr + "T00:00:00Z");
  if (Number.isNaN(d.getTime())) return null;
  return Math.round((today - d) / 86400000);
}

function main() {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const todayStr = today.toISOString().slice(0, 10);
  const since = (d) => daysSince(d, today);

  if (!fs.existsSync(DATA_PATH)) {
    console.error("release-dates.json not found at " + DATA_PATH);
    process.exit(1);
  }

  const data = JSON.parse(fs.readFileSync(DATA_PATH, "utf-8"));
  const items = Array.isArray(data.items) ? data.items : [];

  let articles = [];
  if (fs.existsSync(ARTICLES_PATH)) {
    try {
      const parsed = JSON.parse(fs.readFileSync(ARTICLES_PATH, "utf-8"));
      if (Array.isArray(parsed)) articles = parsed;
    } catch {
      // A broken articles.json is validate-articles' problem, not this one.
      articles = [];
    }
  }

  const upcoming = sortReleaseItems(items.filter((i) => i.status !== "released"));
  const strip = upcoming.slice(0, STRIP_SIZE);
  const stripIds = new Set(strip.map((i) => i.id));

  const passed = findPassedDateItems(upcoming, todayStr);
  const drift = findTrackerDrift(items, articles);

  const stripStale = strip.filter((i) => {
    const age = since(i.lastVerified);
    return age !== null && age > STALE_VERIFY_DAYS;
  });

  const stale = upcoming.filter((i) => {
    const age = since(i.lastVerified);
    return age !== null && age > STALE_VERIFY_DAYS && !stripIds.has(i.id);
  });

  const prunable = items
    .filter((i) => i.status === "released")
    .filter((i) => {
      const age = since(dateKey(i));
      return age !== null && age > PRUNE_RELEASED_DAYS;
    });

  const lastUpdatedAge = since(data.lastUpdated);

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
    const age = since(i.lastVerified);
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

  if (passed.length > 0) {
    console.log("DATE PASSED, STILL LISTED AS UPCOMING  (verify at the source, then fix)");
    console.log("-".repeat(70));
    for (const i of passed) {
      const age = since(dateKey(i));
      console.log(
        "  " +
          i.name +
          "\n      status=" +
          i.status +
          "  date=" +
          dateKey(i) +
          " (passed " +
          age +
          "d ago)  dateText=\"" +
          i.dateText +
          "\"" +
          (i.link ? "\n      link=" + i.link : "") +
          (stripIds.has(i.id) ? "\n      VISIBLE in the /deals Coming Soon strip" : "")
      );
    }
    console.log("");
    console.log(
      "  The date is wrong. This check cannot tell you which way, so go and look\n" +
        "  at the product's own store page or the vendor's announcement first:\n" +
        "\n" +
        "    SHIPPED   set status \"released\", dateText to the real ship date,\n" +
        "              move the date to sortDate, clear isoDate, bump lastVerified.\n" +
        "    SLIPPED   keep the status, correct isoDate/sortDate and dateText to\n" +
        "              the new date, bump lastVerified.\n" +
        "    CANCELLED set the status back to \"expected\", clear the dates, and say\n" +
        "              so in dateText and summary.\n" +
        "\n" +
        "  On 2026-09-08 five items tripped this and only three had shipped."
    );
    console.log("");
  }

  if (drift.length > 0) {
    console.log("WARN: the archive has moved past these tracker entries");
    console.log("-".repeat(70));
    for (const d of drift) {
      console.log("  " + d.item.name);
      for (const r of d.reasons) console.log("      " + r);
    }
    console.log("");
    console.log(
      "  When an article reports a date change, the tracker entry needs the same\n" +
        "  edit. Pico Space Pro sat wrong for 13 days this way: the delay shipped on\n" +
        "  2026-08-26 and /deals kept advertising the cancelled event."
    );
    console.log("");
  }

  if (stripStale.length > 0) {
    console.log(
      "WARN: in the strip and unverified for over " + STALE_VERIFY_DAYS + " days"
    );
    console.log("-".repeat(70));
    for (const i of stripStale) {
      console.log("  " + i.name + "  (verified " + since(i.lastVerified) + "d ago)");
    }
    console.log("");
  }

  if (stale.length > 0) {
    console.log(
      "WARN: unverified for over " + STALE_VERIFY_DAYS + " days (not yet visible)"
    );
    console.log("-".repeat(70));
    for (const i of stale) {
      console.log("  " + i.name + "  (verified " + since(i.lastVerified) + "d ago)");
    }
    console.log("");
  }

  if (prunable.length > 0) {
    console.log(
      "WARN: released over " + PRUNE_RELEASED_DAYS + " days ago, consider pruning"
    );
    console.log("-".repeat(70));
    for (const i of prunable) {
      console.log("  " + i.name + "  (" + since(dateKey(i)) + "d ago)");
    }
    console.log("");
  }

  if (lastUpdatedAge !== null && lastUpdatedAge > STALE_LASTUPDATED_DAYS) {
    console.log(
      "WARN: lastUpdated is " + lastUpdatedAge + " days old (" + data.lastUpdated + ")"
    );
    console.log("");
  }

  if (passed.length > 0) {
    console.log(
      "Action required: " +
        passed.length +
        " item(s) carry a date that has passed and are still listed as upcoming."
    );
    process.exit(1);
  }

  console.log("No passed dates on upcoming items. Tracker is internally consistent.");
  process.exit(0);
}

const invokedPath = process.argv[1] ? resolve(process.argv[1]) : "";
if (invokedPath === fileURLToPath(import.meta.url)) main();
