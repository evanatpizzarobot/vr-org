#!/usr/bin/env node
/**
 * Outbound link safety guard for VR.org originals.
 *
 * Rule (see CLAUDE.md "Link every named game, mod, or app to its official
 * platform page"):
 *   When we point a reader at software, the destination must be a first-party
 *   or verified platform. Never a random mod host, a rehost, an aggregator
 *   mirror, or a file locker. Sending a reader somewhere that hands them a
 *   malware-laden installer is the single worst thing an outbound link can do,
 *   and it is entirely preventable at edit time.
 *
 * Two classes of finding:
 *   ERROR  - a download-shaped link (anchor text says download / install /
 *            sideload / mod / releases / APK ...) pointing at a host that is
 *            not on the allowlist. These block.
 *   WARN   - a link on a host we have never used before. Not necessarily bad,
 *            but it deserves a human look before it ships.
 *
 * Citation links to news outlets, patents, filings and press pages are fine
 * and are not flagged; they are not places a reader downloads anything.
 *
 * Exit 1 if any ERROR, else exit 0.
 *
 * Usage:
 *   node scripts/check-outbound-links.mjs           # whole archive
 *   node scripts/check-outbound-links.mjs --recent 20
 *   npm run check:links
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const ARTICLES_PATH = resolve(here, "..", "data", "articles.json");

const args = process.argv.slice(2);
const recentIdx = args.indexOf("--recent");
const recent = recentIdx !== -1 ? parseInt(args[recentIdx + 1], 10) || 0 : 0;

/** Platforms we are willing to send a reader to for software. */
const TRUSTED_SOFTWARE = new Set([
  "store.steampowered.com",
  "steamcommunity.com",
  "steampowered.com",
  "partner.steamgames.com",
  "meta.com",
  "www.meta.com",
  "oculus.com",
  "www.oculus.com",
  "developers.meta.com",
  "developer.oculus.com",
  "playstation.com",
  "www.playstation.com",
  "store.playstation.com",
  "itch.io",
  "github.com",
  "gitlab.com",
  "sidequestvr.com",
  "viveport.com",
  "www.viveport.com",
  "apps.apple.com",
  "apple.com",
  "www.apple.com",
  "play.google.com",
  "microsoft.com",
  "www.microsoft.com",
  "xbox.com",
  "www.xbox.com",
  "nvidia.com",
  "www.nvidia.com",
  "picoxr.com",
  "www.picoxr.com",
]);

/**
 * First-party project sites we have vetted by hand. A project's OWN site or
 * docs is a legitimate destination; the point of the rule is to exclude
 * third-party rehosts, not to force everything through a storefront.
 * Add here only after confirming the domain belongs to the project itself,
 * ideally cross-checked against the `website` field on its store page.
 */
const TRUSTED_FIRST_PARTY = new Set([
  "winlatorxr.github.io",
  "xrblocks.github.io",
  "halflife2vr.com",
  "cemu.info",
  "pcvrcentral.com",
  "realitysyndromesymphony.com",
  // Quest 1 bootloader unlocker, the WebUSB build of darknight1050's tool.
  // The page links back to github.com/darknight1050/quest1-bootloader-unlocker-web
  // in its own header, and both project READMEs point here. Verified 2026-08-25.
  "quest1-unlock.skystate.ch",
  // Bigscreen's own storefront. bigscreenvr.com is the company's marketing site
  // and store.bigscreenvr.com is its Shopify store on the same domain; the
  // product JSON at /products/bigscreen-beyond-2.js returns real Bigscreen SKUs
  // (Beyond 2 at $899, 2e at $1,099). Verified 2026-08-28.
  "store.bigscreenvr.com",
]);

/**
 * Anchor text meaning "this is where you GO GET the software".
 * Deliberately narrow. Bare word stems produce false positives: "six million
 * installs" is a usage stat, "a maintenance release" is not a releases page.
 * We want download INTENT, not any appearance of the word.
 */
const DOWNLOADY_TEXT =
  /\bdownload (?:it|the|from|here|page)|\bdownloads? page\b|\binstall (?:it|the|from)\b|\bsideload|\bapk\b|\breleases? page\b|\binstaller\b|\bstore page\b|\bwishlist\b|\bgrab it\b|\bthe mod\b|\bmod page\b|\bsetup guide\b/i;

/**
 * URL shape that means the destination hands over a file. This is the more
 * reliable signal, since it does not depend on how the sentence was worded.
 */
const DOWNLOADY_URL =
  /\/releases?(?:\/|$)|\/download|\/dl\/|\.apk(?:\?|$)|\.exe(?:\?|$)|\.zip(?:\?|$)|\.msi(?:\?|$)/i;

/** Hosts seen in the archive that are citations, never software sources. */
const KNOWN_CITATION_HOSTS = new Set([
  "www.youtube.com",
  "youtube.com",
  "youtu.be",
  "roadtovr.com",
  "www.uploadvr.com",
  "uploadvr.com",
  "vr.org",
  "www.vr.org",
  "upload.wikimedia.org",
  "steamdb.info",
  "www.freepatentsonline.com",
  "www.accessdata.fda.gov",
  "api.fda.gov",
  "www.kickstarter.com",
  "www.reddit.com",
  "x.com",
  "io.google",
  "meta.vi.ie",
  "www.bemyeyes.com",
  "discord.gg",
]);

const articles = JSON.parse(readFileSync(ARTICLES_PATH, "utf8"));
const scope = recent > 0 ? articles.slice(0, recent) : articles;

const ANCHOR = /<a\b[^>]*href="(https?:\/\/[^"]+)"[^>]*>([\s\S]*?)<\/a>/gi;

const errors = [];
const warnings = [];
let linkCount = 0;

for (const art of scope) {
  const body = art.body || "";
  for (const m of body.matchAll(ANCHOR)) {
    const url = m[1];
    const text = m[2].replace(/<[^>]+>/g, "").trim();
    let host;
    try {
      host = new URL(url).hostname.toLowerCase();
    } catch {
      errors.push({ art, url, text, why: "unparseable URL" });
      continue;
    }
    linkCount += 1;

    // our own domain is never a third-party risk
    if (host === "vr.org" || host === "www.vr.org") continue;

    const trusted = TRUSTED_SOFTWARE.has(host) || TRUSTED_FIRST_PARTY.has(host);
    const isDownload = DOWNLOADY_URL.test(url) || DOWNLOADY_TEXT.test(text);

    if (isDownload && !trusted) {
      const why = DOWNLOADY_URL.test(url)
        ? `file/release URL on untrusted host "${host}"`
        : `download-shaped link text pointing at untrusted host "${host}"`;
      errors.push({ art, url, text, why });
      continue;
    }

    if (!trusted && !KNOWN_CITATION_HOSTS.has(host)) {
      warnings.push({ art, url, text, why: `first time linking "${host}"` });
    }
  }
}

const label = recent > 0 ? `newest ${scope.length}` : `all ${scope.length}`;

for (const w of warnings) {
  console.warn(
    `check:links  WARN  ${w.art.slug}\n              ${w.why}\n              ${w.text} -> ${w.url}`
  );
}

if (errors.length === 0) {
  console.log(
    `check:links  OK  ${linkCount} outbound links across ${label} articles, ` +
      `no download-shaped links off-platform` +
      (warnings.length ? ` (${warnings.length} new-host warning(s))` : "")
  );
  process.exit(0);
}

console.error(`\ncheck:links  FAIL  ${errors.length} unsafe outbound link(s)\n`);
for (const e of errors) {
  console.error(`  ${e.art.publishDate}  ${e.art.slug}`);
  console.error(`     ${e.why}`);
  console.error(`     "${e.text}" -> ${e.url}\n`);
}
console.error(
  "Point software links at a first-party or verified platform (Steam, Meta,\n" +
    "PlayStation, SideQuest, itch.io, GitHub releases, or the project's own\n" +
    "site). If none exists, leave the name unlinked. Never a rehost.\n"
);
process.exit(1);
