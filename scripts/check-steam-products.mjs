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
 *
 * What it reports for a human or agent to judge (exit 0, printed as REVIEW):
 *   any anchor text that is not an exact normalized match for the real product
 *   name, including a trailing "VR" difference. That case is surfaced, not
 *   auto-accepted: see namesAgree below for why a VR suffix cannot be trusted
 *   as a string-level signal on its own.
 *
 * Usage:
 *   node scripts/check-steam-products.mjs --recent 3
 *   node scripts/check-steam-products.mjs --slug=some-article-slug
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

async function main() {
  const args = process.argv.slice(2);
  const recentIdx = args.indexOf("--recent");
  const recent = recentIdx !== -1 ? parseInt(args[recentIdx + 1], 10) || 0 : 0;
  const slugArg = args.find((a) => a.startsWith("--slug="));
  const slug = slugArg ? slugArg.split("=")[1] : null;

  let articles;
  try {
    articles = JSON.parse(readFileSync(DEFAULT_ARTICLES, "utf8"));
  } catch (err) {
    console.warn(`check:steam  WARN  could not read articles.json: ${err.message}`);
    // process.exitCode (not process.exit()) so Node drains the event loop
    // naturally. process.exit() tears down before pending I/O (an in-flight
    // fetch() using AbortSignal.timeout()) settles, which crashes libuv on
    // Windows. Do not "simplify" this back to process.exit().
    return;
  }

  let scope = articles;
  if (slug) scope = articles.filter((a) => a.slug === slug);
  else if (recent > 0) scope = articles.slice(0, recent);

  const dead = [];
  const review = [];
  let checked = 0;

  for (const article of scope) {
    for (const link of extractSteamLinks(article.body || "")) {
      checked++;
      const result = await resolveApp(link.appid);
      if (!result.ok) {
        dead.push({ slug: article.slug, appid: link.appid, reason: result.reason });
        continue;
      }
      if (!namesAgree(link.anchor, result.name)) {
        review.push({
          slug: article.slug,
          appid: link.appid,
          anchor: link.anchor,
          name: result.name,
          developers: result.developers.join(", "),
        });
      }
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

  console.log(`check:steam  OK  ${checked} steam link(s) resolve, ${review.length} flagged for review`);
  // process.exitCode (not process.exit()) so Node drains the event loop
  // naturally. process.exit() tears down before pending I/O (an in-flight
  // fetch() using AbortSignal.timeout()) settles, which crashes libuv on
  // Windows. Returning here resolves main()'s promise and Node exits once
  // nothing else is pending. Do not "simplify" this back to process.exit().
  return;
}

const invokedPath = process.argv[1] ? resolve(process.argv[1]) : "";
if (invokedPath === fileURLToPath(import.meta.url)) main();
