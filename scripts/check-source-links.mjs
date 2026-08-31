#!/usr/bin/env node
/**
 * Source-attribution gate for VR.org originals.
 *
 * Rule: if a piece leans on somebody else's reporting or quotes a document,
 * the reader has to be one click from the thing itself.
 *
 * This is the gap check:links does not cover. That script asks whether the
 * links we DID write are safe to follow. This one asks whether the links we
 * OWED the reader are there at all, which is the failure that actually
 * shipped. On 2026-08-31 a travel-mode article quoted Meta's display refresh
 * rate documentation five times, verbatim and accurately, and named Road to
 * VR's report of the same news by outlet and date. It linked neither. Three
 * internal archive links were present, so nothing downstream noticed: the
 * piece had links, just not to anything it was citing. A reader who wanted to
 * check the 207 Hz figure against Meta's own page had no way to get there
 * from ours.
 *
 * Two findings, both blocking:
 *
 *   UNLINKED OUTLET   The body credits a named outlet for reporting
 *                     ("Bloomberg reported", "according to UploadVR") and no
 *                     link in the body goes to that outlet.
 *
 *   UNSOURCED QUOTES  The body carries two or more substantial direct quotes
 *                     and links nowhere outside vr.org. Quoting at length
 *                     while citing nothing is the shape of the 2026-08-31
 *                     miss, and it does not depend on the source being an
 *                     outlet we can name in advance.
 *
 * Deliberately narrow, because this gate blocks an unattended run and a false
 * positive costs a redraft. An outlet only counts when an attribution verb
 * sits beside the name, so "the Bloomberg terminal" is not a citation. Quotes
 * are paired in reading order rather than by regex span, because pairing any
 * two quote marks 20 characters apart matches the prose BETWEEN two short
 * quotations and reads it as one long one. Figure captions are stripped
 * first: an image credit is not a citation and a trailer link is not a source.
 *
 * Exit 1 if any finding, else exit 0.
 *
 * Usage:
 *   node scripts/check-source-links.mjs              # whole archive
 *   node scripts/check-source-links.mjs --recent 5   # newest N only
 *   node scripts/check-source-links.mjs --file=path  # alternate articles.json
 *   npm run check:sources
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const DEFAULT_ARTICLES = resolve(here, "..", "data", "articles.json");

/**
 * Outlets whose reporting we credit by name, mapped to the domains that
 * count as linking them. Add an entry only for a publication we would
 * actually cite; a name that doubles as an ordinary word (Protocol, Wired,
 * Luna, Mixed) produces false citations out of plain prose and must not go
 * in this list. "Bloomberg's Mark Gurman" and "Nikkei Asia" match on the
 * outlet stem, so the bylined and regional forms need no separate entries.
 */
const OUTLETS = [
  { name: "Road to VR", domains: ["roadtovr.com"] },
  { name: "UploadVR", domains: ["uploadvr.com"] },
  { name: "Upload VR", domains: ["uploadvr.com"] },
  { name: "The Ghost Howls", domains: ["skarredghost.com"] },
  { name: "Auganix", domains: ["auganix.org"] },
  { name: "AR Insider", domains: ["arinsider.co"] },
  { name: "Bloomberg", domains: ["bloomberg.com"] },
  { name: "Reuters", domains: ["reuters.com"] },
  { name: "The Information", domains: ["theinformation.com"] },
  { name: "Financial Times", domains: ["ft.com"] },
  { name: "Wall Street Journal", domains: ["wsj.com"] },
  { name: "New York Times", domains: ["nytimes.com"] },
  { name: "Nikkei", domains: ["nikkei.com", "asia.nikkei.com"] },
  { name: "CNBC", domains: ["cnbc.com"] },
  { name: "Business Insider", domains: ["businessinsider.com"] },
  { name: "The Verge", domains: ["theverge.com"] },
  { name: "Ars Technica", domains: ["arstechnica.com"] },
  { name: "Engadget", domains: ["engadget.com"] },
  { name: "TechCrunch", domains: ["techcrunch.com"] },
  { name: "Gizmodo", domains: ["gizmodo.com"] },
  { name: "Game Developer", domains: ["gamedeveloper.com"] },
  { name: "PC Gamer", domains: ["pcgamer.com"] },
  { name: "Eurogamer", domains: ["eurogamer.net"] },
  { name: "Rock Paper Shotgun", domains: ["rockpapershotgun.com"] },
  { name: "GameSpot", domains: ["gamespot.com"] },
  { name: "Kotaku", domains: ["kotaku.com"] },
  { name: "Polygon", domains: ["polygon.com"] },
  { name: "PCWorld", domains: ["pcworld.com"] },
  { name: "Digital Trends", domains: ["digitaltrends.com"] },
  { name: "Tom's Hardware", domains: ["tomshardware.com"] },
  { name: "Windows Central", domains: ["windowscentral.com"] },
  { name: "Android Authority", domains: ["androidauthority.com"] },
  { name: "AppleInsider", domains: ["appleinsider.com"] },
  { name: "MacRumors", domains: ["macrumors.com"] },
  { name: "9to5Mac", domains: ["9to5mac.com"] },
  { name: "9to5Google", domains: ["9to5google.com"] },
];

/**
 * Verbs that turn a name into a citation. "Bloomberg reported" is a claim we
 * are borrowing; "the Bloomberg terminal" is a noun. The window below keeps
 * these close enough to the name that an unrelated verb further down the
 * sentence cannot manufacture a finding.
 */
const ATTRIBUTION =
  /\b(report(?:ed|s|ing)?|accord(?:ing|ed)|says?|said|note[sd]?|writ(?:es|ing)|wrote|confirm(?:ed|s)|reveal(?:ed|s)|publish(?:ed|es)|cit(?:es|ed|ing)|claim(?:ed|s)|describ(?:es|ed)|call(?:ed|s)|captured|obtained|broke the story|first to report)\b/i;

/** How far past the outlet name an attribution verb still counts as attached. */
const ATTRIBUTION_WINDOW = 90;

/** A quote shorter than this is a phrase, not borrowed reporting. */
const MIN_QUOTE_WORDS = 8;

/** One stray quoted phrase is styling. Two or more is sourcing. */
const MIN_UNSOURCED_QUOTES = 2;

/**
 * Strips markup to readable text. Figures go first and whole: a figcaption
 * credits an image, and neither it nor the trailer link wrapped around the
 * thumbnail is a citation for anything in the prose.
 *
 * @param {string} body
 * @returns {string}
 */
export function toText(body) {
  return body
    .replace(/<figure[\s\S]*?<\/figure>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#8220;|&ldquo;/g, "“")
    .replace(/&#8221;|&rdquo;/g, "”")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Every external host the body links to, our own domain excluded. Figures are
 * stripped for the same reason as above, so a Wikimedia image credit never
 * counts as having sourced a quote.
 *
 * @param {string} body
 * @returns {Set<string>}
 */
export function externalHosts(body) {
  const hosts = new Set();
  const prose = body.replace(/<figure[\s\S]*?<\/figure>/gi, " ");
  for (const m of prose.matchAll(/href="(https?:\/\/[^"]+)"/gi)) {
    let host;
    try {
      host = new URL(m[1]).hostname.replace(/^www\./, "").toLowerCase();
    } catch {
      continue;
    }
    if (host === "vr.org") continue;
    hosts.add(host);
  }
  return hosts;
}

/**
 * Pulls direct quotations in reading order.
 *
 * Pairing is sequential and stateful rather than a regex span, because a
 * pattern like /"(.{20,}?)"/ pairs the CLOSING mark of one short quote with
 * the OPENING mark of the next and returns the ordinary prose between them.
 * That misfire is not hypothetical: the 2026-08-24 XREAL piece quotes
 * "exciting signal", "Fall 2026," and "base model", and a span regex read the
 * 700 characters of analysis between them as two long quotations.
 *
 * Curly marks are directional so they pair on their own. Straight marks carry
 * no direction, so they alternate open and close. An unclosed mark at the end
 * of the body yields nothing, which is the safe direction for a blocking gate.
 *
 * @param {string} text output of toText()
 * @returns {string[]}
 */
export function extractQuotes(text) {
  const found = [];
  let openAt = null;
  let straightIsOpen = false;
  const STRAIGHT = '"';

  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    if (ch === "“") {
      openAt = i + 1;
      continue;
    }
    if (ch === "”") {
      if (openAt !== null) found.push(text.slice(openAt, i));
      openAt = null;
      continue;
    }
    if (ch === STRAIGHT) {
      if (!straightIsOpen) {
        openAt = i + 1;
        straightIsOpen = true;
      } else {
        if (openAt !== null) found.push(text.slice(openAt, i));
        openAt = null;
        straightIsOpen = false;
      }
    }
  }

  return found.map((q) => q.trim()).filter(Boolean);
}

/**
 * @param {Set<string>} hosts
 * @param {string[]} domains
 * @returns {boolean}
 */
export function linksAnyOf(hosts, domains) {
  for (const host of hosts) {
    for (const d of domains) {
      if (host === d || host.endsWith(`.${d}`)) return true;
    }
  }
  return false;
}

/**
 * Outlets the body credits for reporting but never links.
 *
 * @param {string} text
 * @param {Set<string>} hosts
 * @returns {{outlet: string, context: string}[]}
 */
export function unlinkedOutlets(text, hosts) {
  const findings = [];
  const seen = new Set();

  for (const { name, domains } of OUTLETS) {
    if (linksAnyOf(hosts, domains)) continue;

    let from = 0;
    for (;;) {
      const at = text.indexOf(name, from);
      if (at === -1) break;
      from = at + name.length;

      const window = text.slice(at + name.length, at + name.length + ATTRIBUTION_WINDOW);
      if (!ATTRIBUTION.test(window)) continue;

      // One finding per outlet: a piece that credits Bloomberg four times has
      // one missing link to add, not four.
      const key = domains.join(",");
      if (seen.has(key)) break;
      seen.add(key);

      findings.push({
        outlet: name,
        context: text.slice(Math.max(0, at - 20), at + name.length + 70).trim(),
      });
      break;
    }
  }

  return findings;
}

/**
 * Every finding in one pass over the given articles. Pure: no argv, no I/O,
 * no exit. The CLI below turns these into output and an exit code, and the
 * tests drive this directly.
 *
 * @param {{slug?: string, publishDate?: string, body?: string}[]} articles
 * @returns {{art: object, kind: string, detail: string, context: string}[]}
 */
export function findUnlinkedSources(articles) {
  const findings = [];

  for (const art of articles) {
    const body = art.body || "";
    const text = toText(body);
    const hosts = externalHosts(body);

    for (const f of unlinkedOutlets(text, hosts)) {
      findings.push({
        art,
        kind: "UNLINKED OUTLET",
        detail: `credits ${f.outlet} for reporting but never links it`,
        context: f.context,
      });
    }

    const quotes = extractQuotes(text).filter((q) => q.split(/\s+/).length >= MIN_QUOTE_WORDS);
    if (quotes.length >= MIN_UNSOURCED_QUOTES && hosts.size === 0) {
      findings.push({
        art,
        kind: "UNSOURCED QUOTES",
        detail: `${quotes.length} direct quotes of ${MIN_QUOTE_WORDS}+ words, no link anywhere outside vr.org`,
        context: `"${quotes[0].slice(0, 90)}${quotes[0].length > 90 ? "..." : ""}"`,
      });
    }
  }

  return findings;
}

/**
 * @param {string[]} args
 * @returns {number} 0 for "whole archive"
 * @throws {Error} on a --recent value that is not a positive whole number
 */
export function parseRecentFlag(args) {
  const idx = args.findIndex((a) => a === "--recent" || a.startsWith("--recent="));
  if (idx === -1) return 0;
  const raw = args[idx].startsWith("--recent=") ? args[idx].slice("--recent=".length) : args[idx + 1];
  const n = Number(raw);
  if (!Number.isInteger(n) || n < 1) {
    throw new Error(`--recent needs a positive whole number, got ${JSON.stringify(raw)}`);
  }
  return n;
}

/**
 * @param {string[]} args
 * @returns {string} absolute path to the articles file to read
 */
export function parseFileFlag(args) {
  const flag = args.find((a) => a.startsWith("--file="));
  return flag ? resolve(flag.slice("--file=".length)) : DEFAULT_ARTICLES;
}

function main() {
  const args = process.argv.slice(2);

  let recent;
  let articlesPath;
  try {
    recent = parseRecentFlag(args);
    articlesPath = parseFileFlag(args);
  } catch (err) {
    console.error(`check:sources  FAIL  ${err.message}`);
    process.exit(1);
  }

  let articles;
  try {
    articles = JSON.parse(readFileSync(articlesPath, "utf8"));
  } catch (err) {
    console.error(`check:sources  FAIL  could not read ${articlesPath}: ${err.message}`);
    process.exit(1);
  }
  if (!Array.isArray(articles)) {
    console.error(`check:sources  FAIL  ${articlesPath} did not contain an array of articles`);
    process.exit(1);
  }

  const scope = recent > 0 ? articles.slice(0, recent) : articles;
  const findings = findUnlinkedSources(scope);
  const label = recent > 0 ? `newest ${scope.length}` : `all ${scope.length}`;

  if (findings.length === 0) {
    console.log(`check:sources  OK  ${label} articles link what they cite`);
    process.exit(0);
  }

  console.error(`\ncheck:sources  FAIL  ${findings.length} article(s) cite a source they do not link\n`);
  for (const f of findings) {
    console.error(`  ${f.art.publishDate}  ${f.art.slug}`);
    console.error(`     ${f.kind}: ${f.detail}`);
    console.error(`     ...${f.context}...\n`);
  }
  console.error(
    "Link the thing being cited, on its first mention in the body. An outlet gets\n" +
      "its own story, not its homepage; a quoted document gets the page carrying the\n" +
      "quote. Verify the URL returns 200 before committing. If a quote genuinely has\n" +
      "no public source, say where it came from in the prose instead.\n"
  );
  process.exit(1);
}

const invokedPath = process.argv[1] ? resolve(process.argv[1]) : "";
if (invokedPath === fileURLToPath(import.meta.url)) main();
