#!/usr/bin/env node
// Ad-coverage audit: cross-reference the highest-traffic pages against the ad
// units each one actually renders in production.
//
// Why this exists: on 2026-08-01 an audit found /originals (336 human
// pageviews/day) and /what-is-vr (307/day) rendering zero ad units, and
// /steam-frame carrying a single unit despite being the site's #2 page at
// 1,792/day. None of that was visible from the code alone: /what-is-vr had an
// AdZone, but AdZone renders nothing while its direct placement is inactive, so
// the page looked monetized in source and earned nothing in production. The
// only reliable check is fetching the live page and counting what renders.
//
// Report-only. Never fails the build and never touches ad code: ad density is
// an editorial judgment (house policy is aesthetics over squeezing the last
// cent), so this surfaces the gap and a human decides.
//
// Usage:
//   npm run check:ad-coverage
//   npm run check:ad-coverage -- --json

import process from "node:process";
import fs from "node:fs";
import path from "node:path";

const BASE = process.env.VR_BASE_URL || "https://vr.org";
const asJson = process.argv.includes("--json");

// Pages worth checking even when they miss the live top-15 traffic list.
const ALWAYS_CHECK = [
  "/", "/originals", "/deals", "/events", "/what-is-vr", "/steam-frame",
  "/best-of", "/vr-for-beginners", "/state-of-vr-2026", "/vr-release-dates",
  "/ar-glasses", "/hardware", "/gaming", "/software", "/enterprise", "/ar", "/xr",
];

// A page with real traffic and no ads at all is the finding worth surfacing.
const TRAFFIC_FLOOR = 100;

// Pages that are ad-free on purpose. Without this the audit would flag them
// every Monday forever and the report would train you to ignore it. Policy set
// by Evan on 2026-08-01: educational pages carry no ads, regardless of traffic.
const INTENTIONALLY_AD_FREE = new Map([
  ["/what-is-vr", "educational explainer, ad-free by policy"],
  ["/vr-for-beginners", "educational explainer, ad-free by policy"],
  ["/deals", "affiliate page; AdSense would compete with the affiliate links"],
]);

async function main() {
  let traffic = new Map();
  try {
    const res = await fetch(`${BASE}/api/ai-stats`, {
      headers: { "User-Agent": "VRorgBot/1.0 (https://vr.org)" },
    });
    const ai = await res.json();
    traffic = new Map((ai.humanTopPages || []).map((p) => [p.path, p.hits]));
  } catch {
    console.log("Could not reach /api/ai-stats; checking the fixed page list only.");
  }

  const paths = [...new Set([...traffic.keys(), ...ALWAYS_CHECK])];
  const rows = [];
  for (const path of paths) {
    let ads = 0;
    let ok = false;
    try {
      const res = await fetch(BASE + path, {
        headers: { "User-Agent": "VRorgBot/1.0 (https://vr.org)" },
      });
      ok = res.ok;
      if (ok) {
        const html = await res.text();
        ads = (html.match(/data-ad-slot="\d+"/g) || []).length;
      }
    } catch {
      ok = false;
    }
    rows.push({ path, ads, hits: traffic.get(path) ?? 0, ok });
  }

  rows.sort((a, b) => b.hits - a.hits || a.path.localeCompare(b.path));

  if (asJson) {
    console.log(JSON.stringify({ base: BASE, rows }, null, 2));
    return;
  }

  const reachable = rows.filter((r) => r.ok);
  const unreachable = rows.filter((r) => !r.ok);
  const gaps = reachable.filter((r) => r.ads === 0);
  const notable = gaps.filter(
    (r) => r.hits >= TRAFFIC_FLOOR && !INTENTIONALLY_AD_FREE.has(r.path)
  );
  // Network counts see server-rendered units only. An AdZone fallback is
  // client-rendered, so a policy-protected page can serve an ad while this
  // audit reports 0 -- which is precisely how /what-is-vr slipped through on
  // 2026-08-01. Read the source too, so the policy check actually holds.
  const sourceViolations = [];
  for (const [p] of INTENTIONALLY_AD_FREE) {
    const file = path.join(
      process.cwd(),
      "src/app",
      p === "/" ? "" : p.replace(/^\//, ""),
      "page.tsx"
    );
    try {
      // Strip comments first: a note explaining WHY a page has no fallbackSlot
      // would otherwise match and flag the page it exists to protect.
      const src = fs
        .readFileSync(file, "utf-8")
        .replace(/\{\/\*[\s\S]*?\*\/\}/g, "")
        .replace(/\/\*[\s\S]*?\*\//g, "")
        .replace(/^\s*\/\/.*$/gm, "");
      // Require the assignment, not a bare mention of the word.
      if (/fallbackSlot\s*=/.test(src)) {
        sourceViolations.push(`${p} passes fallbackSlot to an AdZone`);
      }
      if (/<AdSlot\b/.test(src)) sourceViolations.push(`${p} renders an AdSlot directly`);
    } catch {
      // Page may be composed from a shared component; the network count covers it.
    }
  }

  const violations = reachable.filter(
    (r) => r.ads > 0 && INTENTIONALLY_AD_FREE.has(r.path)
  );

  console.log(`VR.org ad coverage  ${BASE}`);
  console.log("=".repeat(78));
  console.log(
    `${reachable.length} pages checked  |  ${reachable.length - gaps.length} carry ads  |  ${gaps.length} carry none`
  );
  console.log("");
  console.log("PATH".padEnd(56) + "ADS".padStart(4) + "   TRAFFIC/day");
  console.log("-".repeat(78));
  for (const r of reachable) {
    const hits = r.hits ? String(r.hits) : "-";
    let flag = "";
    if (r.ads === 0) {
      if (INTENTIONALLY_AD_FREE.has(r.path)) flag = "   (ad-free by policy)";
      else flag = r.hits >= TRAFFIC_FLOOR ? "   <-- NO ADS" : "   (no ads)";
    } else if (INTENTIONALLY_AD_FREE.has(r.path)) {
      // Loud on purpose: an ad appearing on a policy-protected page is a
      // regression, and it is the exact mistake made on /what-is-vr.
      flag = "   <-- POLICY VIOLATION: should be ad-free";
    }
    console.log(r.path.slice(0, 54).padEnd(56) + String(r.ads).padStart(4) + "   " + hits + flag);
  }

  if (unreachable.length > 0) {
    console.log("");
    console.log("Not reachable (not a failure, may be a redirect or gated route):");
    for (const r of unreachable) console.log("  " + r.path);
  }

  console.log("");
  if (violations.length > 0 || sourceViolations.length > 0) {
    console.log("ADS ON PAGES THAT SHOULD BE AD-FREE:");
    for (const r of violations) {
      console.log(`  ${r.path}  (${r.ads} rendered unit(s)) - ${INTENTIONALLY_AD_FREE.get(r.path)}`);
    }
    for (const v of sourceViolations) console.log(`  ${v}  [found in source]`);
    console.log("");
  }
  if (notable.length > 0) {
    console.log(`${notable.length} page(s) with real traffic and no ad units:`);
    for (const r of notable) {
      console.log(`  ${String(r.hits).padStart(6)}/day  ${r.path}`);
    }
    console.log("");
    console.log(
      "Consider whether each is deliberate, and add it to INTENTIONALLY_AD_FREE\n" +
        "if so. A page carrying an AdZone shows 0 here until a direct placement\n" +
        "goes active; pass fallbackSlot to have it serve AdSense while it waits,\n" +
        "but never on an educational page."
    );
  } else {
    console.log("No page above " + TRAFFIC_FLOOR + " pageviews/day is missing ads.");
  }
  // Report-only: ad density is an editorial call, so never fail.
  process.exit(0);
}

await main();
