#!/usr/bin/env node
/**
 * Steam product identity verifier for VR.org articles.
 *
 * Why this exists: CLAUDE.md requires confirming a Steam link points at the
 * product the article names, citing two real collisions:
 *   "I Am Your Beast" (Strange Scaffold, flat) vs "I AM YOUR BEAST VR" (Impact Inked)
 *   "POSTAL 2" (2012 original) vs "POSTAL 2 Redux"
 * check:links validates safety and shape, not identity. Linking the wrong
 * product is worse than not linking.
 *
 * What it decides mechanically (exit 1):
 *   an app id that does not resolve through the appdetails endpoint.
 *   a --slug given that matches no article at all (the gate never opened
 *     an article, so it cannot certify one; a matched article with no Steam
 *     links at all is a separate, fine case that still reports OK 0).
 *   a malformed --recent or --slug value, rather than silently falling back
 *     to scanning the whole archive or matching nothing.
 *   a --file value that is missing, or that names a path this process cannot
 *     read, rather than silently falling back to data/articles.json. See
 *     --file below for why a fall back here would be dangerous.
 *
 * What it reports for a human or agent to judge (exit 0, printed as REVIEW):
 *   any anchor text that is not an exact normalized match for the real product
 *   name, including a trailing "VR" difference. That case is surfaced, not
 *   auto-accepted: see namesAgree below for why a VR suffix cannot be trusted
 *   as a string-level signal on its own.
 *
 * Usage:
 *   node scripts/check-steam-products.mjs --recent 3
 *   node scripts/check-steam-products.mjs --recent=3
 *   node scripts/check-steam-products.mjs --slug=some-article-slug
 *   node scripts/check-steam-products.mjs --slug some-article-slug
 *   node scripts/check-steam-products.mjs --file path/to/draft-articles.json
 *   node scripts/check-steam-products.mjs --file=path/to/draft-articles.json
 *
 * --file exists so the travel-mode verification gate can check a draft
 * article's Steam links before that draft has been added to
 * data/articles.json. Verification has to happen before publishing, and the
 * default path only ever contains articles that are already live, so without
 * --file this gate could not be run on a draft at all. It composes with
 * --slug and --recent, both of which apply within whichever file --file
 * points at.
 *
 * NOT wired into prebuild: third-party network calls must not gate a deploy.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const DEFAULT_ARTICLES = resolve(here, "..", "data", "articles.json");

/**
 * @param {string} body article body HTML
 * @returns {Array<{appid: string, anchor: string}>}
 */
export function extractSteamLinks(body) {
  const re = /<a\s[^>]*href="https:\/\/store\.steampowered\.com\/app\/(\d+)[^"]*"[^>]*>([\s\S]*?)<\/a>/g;
  const out = [];
  let m;
  while ((m = re.exec(body)) !== null) {
    const anchor = m[2].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
    out.push({ appid: m[1], anchor });
  }
  return out;
}

function normalize(name) {
  return name.toLowerCase().replace(/[^a-z0-9]/g, "");
}

/**
 * Deliberately exact match only. No VR-suffix tolerance.
 *
 * A trailing "VR" difference between the anchor and the real product name is
 * ambiguous by shape alone, and the two ways it resolves are opposites:
 *   "Walkabout Mini Golf" linking to "Walkabout Mini Golf VR" is the SAME
 *   product, correctly linked.
 *   "I Am Your Beast" (Strange Scaffold, flat) linking to "I AM YOUR BEAST VR"
 *   (Impact Inked) is a DIFFERENT product by a different studio, wrongly linked.
 * Both pairs normalize to identical strings plus a trailing "vr". A rule that
 * accepts one accepts the other; there is no string-level test that tells them
 * apart. So neither is auto-accepted. Both are surfaced as REVIEW for a human
 * or an agent with real-world knowledge of the two products to judge. Do not
 * reintroduce a VR-suffix tolerance here; it silently waves through the exact
 * collision this gate exists to catch.
 *
 * @param {string} anchor the article's link text
 * @param {string} appName the real product name from Steam
 * @returns {boolean}
 */
export function namesAgree(anchor, appName) {
  const a = normalize(anchor);
  const b = normalize(appName);
  // An empty (or punctuation-only, which normalizes to empty) anchor must
  // never auto-accept, even against an empty-normalizing appName.
  if (a === "") return false;
  return a === b;
}

/**
 * Reduces a flat list of Steam link occurrences to the app ids that actually
 * need a network round trip, in first-seen order. The same game is often
 * linked from more than one article (or more than once in one), and each
 * occurrence used to trigger its own appdetails fetch: 58 link occurrences
 * across the archive resolve to 43 unique app ids as of this writing. This
 * mirrors the YouTube gate's per-body Map dedup, applied here across the
 * whole run instead of within a single article.
 *
 * @param {Array<{slug: string, appid: string, anchor: string}>} occurrences
 * @returns {string[]} unique app ids, first-seen order
 */
export function uniqueAppIds(occurrences) {
  return [...new Map(occurrences.map((o) => [o.appid, true])).keys()];
}

async function resolveApp(appid) {
  const url = `https://store.steampowered.com/api/appdetails?appids=${appid}&l=english`;
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "VRorgBot/1.0 (https://vr.org; evan@pizzarobotstudios.com)" },
      signal: AbortSignal.timeout(20000),
    });
    if (!res.ok) return { ok: false, reason: `HTTP ${res.status}` };
    const data = await res.json();
    const entry = data[appid];
    if (!entry || !entry.success) return { ok: false, reason: "appdetails returned success: false" };
    return {
      ok: true,
      name: entry.data.name,
      developers: entry.data.developers || [],
    };
  } catch (err) {
    return { ok: false, reason: err.message };
  }
}

/**
 * Parses --recent, accepting both "--recent 12" and "--recent=12" forms. The
 * equals form matches the sibling --slug flag; the two forms disagreeing was
 * itself the source of a fail-open bug, so both are accepted here.
 *
 * @param {string[]} args
 * @returns {{present: boolean, valid: boolean, value: number, raw: string|null}}
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
 * Parses --slug, accepting both "--slug=foo" and "--slug foo" forms.
 *
 * @param {string[]} args
 * @returns {{present: boolean, valid: boolean, value: string|null}}
 */
export function parseSlugFlag(args) {
  const eqArg = args.find((a) => a.startsWith("--slug="));
  if (eqArg !== undefined) {
    const raw = eqArg.slice("--slug=".length);
    return { present: true, valid: raw.length > 0, value: raw || null };
  }
  const idx = args.indexOf("--slug");
  if (idx !== -1) {
    const raw = args[idx + 1];
    const valid = raw !== undefined && raw.length > 0 && !raw.startsWith("--");
    return { present: true, valid, value: valid ? raw : null };
  }
  return { present: false, valid: true, value: null };
}

/**
 * Parses --file, accepting both "--file path" and "--file=path" forms. A
 * value that is missing entirely, in either form, is invalid rather than
 * silently resolving to resolve(undefined), which throws an uncaught
 * TypeError from a script documented as never crashing on a malformed
 * invocation. Same shape as check-same-date-byline.mjs's parseFileFlag; do
 * not invent a different convention here.
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

async function main() {
  const args = process.argv.slice(2);

  const fileFlag = parseFileFlag(args);
  if (!fileFlag.valid) {
    console.error("check:steam  FAIL  --file was given with no path");
    process.exitCode = 1;
    return;
  }
  const articlesPath = fileFlag.present ? resolve(fileFlag.raw) : DEFAULT_ARTICLES;

  const recentFlag = parseRecentFlag(args);
  if (!recentFlag.valid) {
    console.error(`check:steam  FAIL  --recent value "${recentFlag.raw ?? ""}" is not a positive integer`);
    process.exitCode = 1;
    return;
  }

  const slugFlag = parseSlugFlag(args);
  if (slugFlag.present && !slugFlag.valid) {
    console.error("check:steam  FAIL  --slug was given with no value");
    process.exitCode = 1;
    return;
  }

  let articles;
  try {
    articles = JSON.parse(readFileSync(articlesPath, "utf8"));
  } catch (err) {
    if (fileFlag.present) {
      // --file was given explicitly, most likely by the travel-mode
      // verification gate pointing at a draft that has not been added to
      // data/articles.json yet. A gate that cannot read the file it was
      // told to check must say so and fail, not quietly report OK against
      // zero articles: that is the exact fails-open shape a prior review
      // already found in this script's --recent handling.
      console.error(`check:steam  FAIL  could not read ${articlesPath}: ${err.message}`);
      process.exitCode = 1;
      return;
    }
    console.warn(`check:steam  WARN  could not read ${articlesPath}: ${err.message}`);
    // process.exitCode (not process.exit()) so Node drains the event loop
    // naturally. process.exit() tears down before pending I/O (an in-flight
    // fetch() using AbortSignal.timeout()) settles, which crashes libuv on
    // Windows. Do not "simplify" this back to process.exit().
    return;
  }

  let scope = articles;
  if (slugFlag.present) {
    scope = articles.filter((a) => a.slug === slugFlag.value);
    if (scope.length === 0) {
      // Distinguish "matched an article with nothing to check" (fine, OK 0)
      // from "matched nothing at all" (a gate that never opened the article
      // it was asked about, which must never certify it as OK).
      console.error(`check:steam  FAIL  --slug=${slugFlag.value} matched no article in articles.json`);
      console.error("The gate never opened an article, so it cannot certify one. Check the slug for a typo, or confirm the article has been added yet.");
      process.exitCode = 1;
      return;
    }
  } else if (recentFlag.value > 0) {
    scope = articles.slice(0, recentFlag.value);
  }

  const occurrences = [];
  for (const article of scope) {
    for (const link of extractSteamLinks(article.body || "")) {
      occurrences.push({ slug: article.slug, appid: link.appid, anchor: link.anchor });
    }
  }

  const appIds = uniqueAppIds(occurrences);
  const resolved = new Map();
  for (const appid of appIds) {
    resolved.set(appid, await resolveApp(appid));
  }

  const dead = [];
  const review = [];
  const checked = occurrences.length;

  for (const occ of occurrences) {
    const result = resolved.get(occ.appid);
    if (!result.ok) {
      dead.push({ slug: occ.slug, appid: occ.appid, reason: result.reason });
      continue;
    }
    if (!namesAgree(occ.anchor, result.name)) {
      review.push({
        slug: occ.slug,
        appid: occ.appid,
        anchor: occ.anchor,
        name: result.name,
        developers: result.developers.join(", "),
      });
    }
  }

  for (const r of review) {
    console.log(`check:steam  REVIEW  ${r.slug}`);
    console.log(`    link text: "${r.anchor}"`);
    console.log(`    app ${r.appid} is: "${r.name}"  by ${r.developers || "unknown"}`);
    console.log("    Confirm this is the same product before publishing.");
  }

  if (dead.length > 0) {
    console.error(`check:steam  FAIL  ${dead.length} of ${checked} app id(s) do not resolve:`);
    for (const d of dead) console.error(`  ${d.slug}  app/${d.appid}  (${d.reason})`);
    // process.exitCode (not process.exit()) so Node drains the event loop
    // naturally. process.exit() tears down before pending I/O (an in-flight
    // fetch() using AbortSignal.timeout()) settles, which crashes libuv on
    // Windows. Do not "simplify" this back to process.exit().
    process.exitCode = 1;
    return;
  }

  console.log(`check:steam  OK  ${checked} steam link(s) resolve (${appIds.length} unique app id(s)), ${review.length} flagged for review`);
  // process.exitCode (not process.exit()) so Node drains the event loop
  // naturally. process.exit() tears down before pending I/O (an in-flight
  // fetch() using AbortSignal.timeout()) settles, which crashes libuv on
  // Windows. Returning here resolves main()'s promise and Node exits once
  // nothing else is pending. Do not "simplify" this back to process.exit().
  return;
}

const invokedPath = process.argv[1] ? resolve(process.argv[1]) : "";
if (invokedPath === fileURLToPath(import.meta.url)) main();
