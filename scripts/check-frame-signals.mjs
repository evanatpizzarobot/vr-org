#!/usr/bin/env node
/**
 * On-demand Steam Frame signal check.
 *
 * The Frame cluster is the highest-traffic thing on this site and its launch
 * signals move on someone else's schedule, so checking them by hand means
 * remembering four separate lookups and the exact query string for each. This
 * runs the machine-readable ones in a single command and says what changed
 * since the tracker pages were last updated.
 *
 * What it checks:
 *
 *   CATALOG   Valve's frame_compatibility=3 and =2 filters, counted and listed,
 *             diffed against the VERIFIED_GAMES and PLAYABLE_GAMES arrays in
 *             src/app/great-on-frame/page.tsx. Titles live but not on the page
 *             are additions to write up; titles on the page but no longer live
 *             mean Valve pulled a rating, which is the rarer and bigger story.
 *
 *   APP       The Steam Frame app record (4165890) via api.steamcmd.net.
 *             releasestate leaving "prerelease", or section_type leaving
 *             "ownersonly", is the launch flip and is flagged loudly.
 *
 *   PACKAGES  Not fetchable. The seven backend packages are not public store
 *             packages (packagedetails returns success:false) and SteamDB
 *             blocks non-browser requests, so this prints the sub URLs and the
 *             last revision this repo knows about. Two of them moved on Sep 3
 *             and again on Sep 10, three minutes apart both times, so a weekly
 *             cadence would put the next one around Sep 17.
 *
 * Deliberately not wired into prebuild. Every check here is a live network call
 * to a third party, and a flaky Steam response must never be able to block a
 * deploy or the unattended travel-mode run.
 *
 * Usage:
 *   npm run check:frame
 *   npm run check:frame -- --runtimes    also scan every certified title's
 *                                        recommended_runtime (130+ calls, slow)
 *
 * Exit 1 if anything drifted from what the pages say, else exit 0.
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const PAGE = resolve(here, "..", "src", "app", "great-on-frame", "page.tsx");

const FRAME_APPID = "4165890";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64)";

// Last known state, updated by hand when a check confirms a change. These are
// the baseline the report compares against.
const KNOWN = {
  appChangeNumber: 35675573,
  releaseState: "prerelease",
  sectionType: "ownersonly",
  subs: [
    { id: 1629484, last: "2026-09-10 19:52:43 UTC", note: "moved Sep 3 and Sep 10" },
    { id: 1629486, last: "2026-09-10 19:55:40 UTC", note: "moved Sep 3 and Sep 10" },
    { id: 1629485, last: "2026-05-05 18:50:54 UTC", note: "" },
    { id: 1629487, last: "2026-05-05 18:50:54 UTC", note: "" },
    { id: 1459458, last: "2026-05-05 18:50:54 UTC", note: "" },
    { id: 1459459, last: "2026-05-05 18:50:54 UTC", note: "" },
    { id: 1459457, last: "2025-11-14 20:00:14 UTC", note: "oldest of the seven" },
  ],
};

/**
 * Titles Valve's filter returns that this site's table deliberately leaves out,
 * each with the condition that justifies it. The condition is re-checked on
 * every run: if it stops holding, the exclusion becomes a finding rather than a
 * note, because that is the moment the row should be added.
 */
const EXCLUDED = [
  {
    name: "We are Eva",
    appid: "1490590",
    tier: "Playable",
    reason: "appears in the filter with no steam_frame_compatibility record in its app data",
  },
];

const label = (kind, name) => `check:frame  ${kind}  ${name}`;

/** Titles currently carrying a given Steam Frame compatibility category. */
async function fetchTier(category) {
  const titles = [];
  let total = null;
  for (let start = 0; start < 500; start += 100) {
    const url =
      `https://store.steampowered.com/search/results/?query&start=${start}` +
      `&count=100&frame_compatibility=${category}&infinite=1&cc=us&l=english`;
    const res = await fetch(url, { headers: { "User-Agent": UA } });
    if (!res.ok) throw new Error(`search returned HTTP ${res.status}`);
    const json = await res.json();
    if (total === null) total = json.total_count;
    const html = json.results_html || "";
    const found = [...html.matchAll(/<span class="title">([^<]+)<\/span>/g)].map((m) =>
      decodeEntities(m[1]),
    );
    titles.push(...found);
    if (titles.length >= total || found.length === 0) break;
  }
  return { total, titles };
}

function decodeEntities(s) {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

/**
 * Loose match so a table entry and Valve's own string agree despite registered
 * marks, smart quotes and the odd trailing space. Same normalisation the
 * September audit used by hand.
 */
function norm(s) {
  return s
    .normalize("NFKD")
    .replace(/[®™‘’“”]/g, "")
    .replace(/[^a-z0-9]/gi, "")
    .toLowerCase();
}

/**
 * Names out of a `const NAME: Type[] = [...]` block in the page source.
 *
 * Entries carrying status: "Unsupported" are dropped. The Lab and Aperture Hand
 * Lab sit in VERIFIED_GAMES with that status because Valve certified them and
 * then cut them, which is worth keeping visible on the page, but they will never
 * reappear in the certified filter and must not read as drift on every run.
 */
function pageNames(src, arrayName) {
  const start = src.indexOf(`const ${arrayName}`);
  if (start < 0) return null;
  const end = src.indexOf("\n];", start);
  if (end < 0) return null;
  const block = src.slice(start, end);
  const entries = block.split("\n  {\n").slice(1);
  return entries
    .filter((e) => !e.includes('status: "Unsupported"'))
    .map((e) => (e.match(/name: "(.+?)",/) || [])[1])
    .filter(Boolean);
}

/** True when the title still carries no Steam Frame compatibility record. */
async function stillHasNoCompatRecord(appid) {
  const res = await fetch(`https://api.steamcmd.net/v1/info/${appid}`);
  if (!res.ok) throw new Error(`steamcmd returned HTTP ${res.status}`);
  const json = await res.json();
  return !json?.data?.[appid]?.common?.steam_frame_compatibility;
}

async function frameAppRecord() {
  const res = await fetch(`https://api.steamcmd.net/v1/info/${FRAME_APPID}`);
  if (!res.ok) throw new Error(`steamcmd returned HTTP ${res.status}`);
  const json = await res.json();
  const app = json?.data?.[FRAME_APPID];
  if (!app) throw new Error("no app record returned");
  return {
    changeNumber: app._change_number,
    releaseState: app.common?.releasestate,
    sectionType: app.common?.section_type,
    name: app.common?.name,
    type: app.common?.type,
  };
}

async function runtimeMix(appids) {
  const counts = {};
  for (const id of appids) {
    try {
      const res = await fetch(`https://api.steamcmd.net/v1/info/${id}`);
      const json = await res.json();
      const sf = json?.data?.[id]?.common?.steam_frame_compatibility;
      const rt = sf?.configuration?.recommended_runtime || "(none)";
      counts[rt] = (counts[rt] || 0) + 1;
    } catch {
      counts["(error)"] = (counts["(error)"] || 0) + 1;
    }
    await new Promise((r) => setTimeout(r, 120));
  }
  return counts;
}

async function main() {
  const wantRuntimes = process.argv.includes("--runtimes");
  const src = readFileSync(PAGE, "utf8");
  let findings = 0;

  const tiers = [
    { category: 3, name: "Great on Frame", array: "VERIFIED_GAMES" },
    { category: 2, name: "Playable", array: "PLAYABLE_GAMES" },
  ];

  for (const tier of tiers) {
    let live;
    try {
      live = await fetchTier(tier.category);
    } catch (err) {
      console.log(label("ERROR", tier.name));
      console.log(`              ${err.message}`);
      findings++;
      continue;
    }
    const listed = pageNames(src, tier.array);
    if (!listed) {
      console.log(label("ERROR", tier.name));
      console.log(`              could not read ${tier.array} out of the page`);
      findings++;
      continue;
    }
    const excluded = EXCLUDED.filter((x) => x.tier === tier.name);
    const excludedSet = new Set(excluded.map((x) => norm(x.name)));
    const listedSet = new Set(listed.map(norm));
    const liveSet = new Set(live.titles.map(norm));
    const added = live.titles.filter(
      (t) => !listedSet.has(norm(t)) && !excludedSet.has(norm(t)),
    );
    const gone = listed.filter((n) => !liveSet.has(norm(n)));

    // Re-check each exclusion rather than trusting it. An exclusion that no
    // longer holds is the signal to add the row.
    for (const x of excluded) {
      let stillHolds;
      try {
        stillHolds = await stillHasNoCompatRecord(x.appid);
      } catch (err) {
        console.log(label("ERROR", x.name));
        console.log(`              could not re-check exclusion: ${err.message}`);
        findings++;
        continue;
      }
      if (stillHolds) {
        console.log(label("NOTE", `${x.name} still excluded`));
        console.log(`              ${x.reason}`);
      } else {
        findings++;
        console.log(label("DRIFT", `${x.name} now has a record`));
        console.log("              The reason it was left out no longer holds. Add the row.");
      }
    }

    if (added.length === 0 && gone.length === 0) {
      console.log(label("OK", tier.name));
      console.log(`              ${live.total} titles, page is current`);
    } else {
      findings++;
      console.log(label("DRIFT", tier.name));
      console.log(`              Valve reports ${live.total}, page lists ${listed.length}`);
      if (added.length) {
        console.log(`              new since last update (${added.length}):`);
        for (const t of added) console.log(`                + ${t}`);
      }
      if (gone.length) {
        console.log(`              on the page, not in the filter (${gone.length}):`);
        for (const t of gone) console.log(`                - ${t}`);
      }
    }
  }

  try {
    const app = await frameAppRecord();
    const flips = [];
    if (app.releaseState !== KNOWN.releaseState) {
      flips.push(`releasestate ${KNOWN.releaseState} -> ${app.releaseState}`);
    }
    if (app.sectionType !== KNOWN.sectionType) {
      flips.push(`section_type ${KNOWN.sectionType} -> ${app.sectionType}`);
    }
    if (flips.length) {
      findings++;
      console.log(label("LAUNCH SIGNAL", "app 4165890"));
      for (const f of flips) console.log(`              ${f}`);
      console.log("              This is the flip. Check the store page now.");
    } else if (app.changeNumber !== KNOWN.appChangeNumber) {
      findings++;
      console.log(label("CHANGED", "app 4165890"));
      console.log(
        `              changenumber ${KNOWN.appChangeNumber} -> ${app.changeNumber}, ` +
          `still ${app.releaseState}/${app.sectionType}`,
      );
      console.log("              Diff it at https://steamdb.info/app/4165890/history/");
    } else {
      console.log(label("OK", "app 4165890"));
      console.log(
        `              ${app.name} (${app.type}), ${app.releaseState}, ` +
          `changenumber ${app.changeNumber}, unchanged`,
      );
    }
  } catch (err) {
    findings++;
    console.log(label("ERROR", "app 4165890"));
    console.log(`              ${err.message}`);
  }

  console.log(label("MANUAL", "backend packages"));
  console.log("              Not fetchable: no public API, SteamDB needs a browser.");
  for (const s of KNOWN.subs) {
    const note = s.note ? `  (${s.note})` : "";
    console.log(`              sub ${s.id}  last ${s.last}${note}`);
    console.log(`                https://steamdb.info/sub/${s.id}/`);
  }

  if (wantRuntimes) {
    console.log(label("SCAN", "runtimes"));
    const ids = await certifiedAppIds();
    console.log(`              scanning ${ids.length} certified titles, this takes a minute`);
    const mix = await runtimeMix(ids);
    for (const [rt, n] of Object.entries(mix).sort((a, b) => b[1] - a[1])) {
      console.log(`              ${String(n).padStart(4)}  ${rt}`);
    }
  }

  process.exit(findings ? 1 : 0);
}

/** App IDs behind the certified list, for the optional runtime scan. */
async function certifiedAppIds() {
  const ids = [];
  for (let start = 0; start < 500; start += 100) {
    const url =
      `https://store.steampowered.com/search/results/?query&start=${start}` +
      `&count=100&frame_compatibility=3&infinite=1&cc=us&l=english`;
    const res = await fetch(url, { headers: { "User-Agent": UA } });
    const json = await res.json();
    const html = json.results_html || "";
    const found = [...html.matchAll(/data-ds-appid="(\d+)"/g)].map((m) => m[1]);
    ids.push(...found);
    if (found.length === 0 || ids.length >= json.total_count) break;
  }
  return ids;
}

main().catch((err) => {
  console.log(`check:frame  FAIL  ${err.message}`);
  process.exit(1);
});
