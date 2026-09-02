#!/usr/bin/env node
/**
 * Correction-pairing gate for VR.org originals.
 *
 * Rule: when a piece says VR.org got something wrong, the piece that carried
 * the error gets the dated correction. Saying so in a new article is not the
 * same as fixing the old one, because nobody reading the old one ever sees
 * the new one.
 *
 * This is the gap the 2026-09-02 Bigscreen article opened. Travel mode
 * published a follow-up on the Beyond 2 price cut with a section headed "A
 * number this site got wrong", correctly explaining that the August 28 piece
 * had reported $899 (a store line item for the headset body) as the starting
 * price when Bigscreen's own announcement puts it at $1,019. Every gate
 * passed. The follow-up was accurate, sourced and linked. And the August 28
 * article sat live and unchanged with the wrong number in it, because a
 * correction written inside a different article corrects nothing: a reader
 * who lands on the Dorsey piece from search sees $899 and no note, which is
 * the exact outcome the bottom-of-article correction rule exists to prevent.
 *
 * Two findings, both blocking:
 *
 *   UNPAIRED CORRECTION   The body says VR.org reported something and that
 *                         it was wrong, and no VR.org article it links to
 *                         carries a correction of its own.
 *
 *   CORRECTION NO DATE    The body carries a house correction blockquote and
 *                         updatedDate is unset, so the article renders a
 *                         correction while still claiming it was never
 *                         touched since publication.
 *
 * Deliberately narrow, because this gate blocks an unattended run and a
 * false positive costs a redraft. A self-reference only counts when a
 * reporting verb sits beside it, so "VR.org is a news site" is not a claim
 * we are walking back. The wrongness cue has to follow the self-reference
 * rather than merely share a paragraph with it, because "UploadVR reported
 * X" and "Meta's earlier figure was wrong" are two ordinary sentences that
 * happen to sit near each other in a lot of hardware coverage. Figure
 * captions are stripped first: an image credit never corrects anything.
 *
 * The lookup runs against the whole archive even when --recent narrows what
 * is scanned, since the article being corrected is by definition older than
 * the one correcting it and is usually well outside the recent window.
 *
 * Exit 1 if any finding, else exit 0.
 *
 * Usage:
 *   node scripts/check-corrections.mjs              # whole archive
 *   node scripts/check-corrections.mjs --recent 5   # newest N only
 *   node scripts/check-corrections.mjs --file=path  # alternate articles.json
 *   npm run check:corrections
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const DEFAULT_ARTICLES = resolve(here, "..", "data", "articles.json");

/**
 * Ways an article refers to VR.org's own past reporting. Each needs a
 * reporting verb attached (below) before it counts, so a piece that merely
 * mentions the site is not read as walking something back.
 */
const SELF_REFERENCE =
  /\b(VR\.org|this site|this article|we|our (?:earlier|previous|original|april|may|june|july|august|september|october|november|december)\b[^.]{0,40})\b/gi;

/**
 * Reporting verbs that turn a self-reference into a claim we made. "This
 * site reported" is ours to correct; "this site is dark by default" is not.
 */
const REPORTING =
  /\b(report(?:ed|s)?|said|says|wrote|writes|quoted|quotes|called|describ(?:ed|es)|put|claimed|stated|noted|covered|published|ran)\b/i;

/** How far past the self-reference a reporting verb still counts as attached. */
const REPORTING_WINDOW = 40;

/**
 * Ways an article admits the claim was wrong. Kept tight on purpose: these
 * are the phrasings a correction actually uses, not every word that can
 * express doubt.
 */
const WRONGNESS =
  /\b(was wrong|were wrong|got (?:that |this |it )?wrong|had that wrong|was incorrect|were incorrect|was in error|misstated|misread|misreported|we erred|an error (?:in|on) (?:our|this)|not correct|should have (?:said|read)|overstated|understated|corrects an earlier|correcting an earlier)\b/i;

/**
 * How far past the self-reference an admission of error still counts as
 * attached to it. Long enough to clear the sentence carrying the original
 * claim (the 2026-09-02 case ran 230 characters from "VR.org reported" to
 * "That was wrong"), short enough that two unrelated paragraphs do not pair.
 */
const WRONGNESS_WINDOW = 400;

/** The house correction block, as apply-correction.mjs writes it. */
const CORRECTION_BLOCK = /<blockquote>\s*<strong>\s*Correction,/i;

/** Internal article links, which is how a correcting piece names its target. */
const INTERNAL_ARTICLE_LINK = /href="\/articles\/([a-z0-9-]+)"/gi;

/**
 * Body HTML to readable prose. Figures come out whole rather than being
 * unwrapped, since a caption is not part of the argument the piece is
 * making and an "Image: ..." credit has never corrected anything.
 *
 * @param {string} html
 * @returns {string}
 */
export function toText(html) {
  return String(html || "")
    .replace(/<figure[\s\S]*?<\/figure>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * True when the article admits, in its own voice, that VR.org published
 * something wrong. Returns the passage so the failure output can show it.
 *
 * @param {string} text prose from toText
 * @returns {{context: string} | null}
 */
export function selfCorrectionClaim(text) {
  SELF_REFERENCE.lastIndex = 0;
  for (let m = SELF_REFERENCE.exec(text); m; m = SELF_REFERENCE.exec(text)) {
    const after = text.slice(m.index + m[0].length);
    if (!REPORTING.test(after.slice(0, REPORTING_WINDOW))) continue;

    const window = after.slice(0, WRONGNESS_WINDOW);
    const wrong = window.match(WRONGNESS);
    if (!wrong) continue;

    const end = m.index + m[0].length + window.indexOf(wrong[0]) + wrong[0].length;
    return { context: text.slice(m.index, Math.min(end + 30, text.length)).trim() };
  }
  return null;
}

/**
 * Slugs of VR.org articles this body links to, in first-seen order.
 *
 * @param {string} html
 * @returns {string[]}
 */
export function internalArticleLinks(html) {
  const slugs = [];
  INTERNAL_ARTICLE_LINK.lastIndex = 0;
  for (let m = INTERNAL_ARTICLE_LINK.exec(html); m; m = INTERNAL_ARTICLE_LINK.exec(html)) {
    if (!slugs.includes(m[1])) slugs.push(m[1]);
  }
  return slugs;
}

/**
 * True when an article carries a house-format correction at the bottom.
 *
 * @param {{body?: string}} art
 * @returns {boolean}
 */
export function hasCorrection(art) {
  return CORRECTION_BLOCK.test(art?.body || "");
}

/**
 * Every finding in one pass. Pure: no argv, no I/O, no exit. The CLI below
 * turns these into output and an exit code, and the tests drive this
 * directly.
 *
 * @param {object[]} scope articles to check
 * @param {object[]} all every article, for resolving link targets
 * @returns {{art: object, kind: string, detail: string, context: string}[]}
 */
export function findUnpairedCorrections(scope, all) {
  const bySlug = new Map((all || []).map((a) => [a.slug, a]));
  const findings = [];

  for (const art of scope) {
    const body = art.body || "";

    if (hasCorrection(art) && !art.updatedDate) {
      findings.push({
        art,
        kind: "CORRECTION NO DATE",
        detail: "carries a correction blockquote but updatedDate is unset",
        context: "set updatedDate to the date the correction was applied",
      });
    }

    const claim = selfCorrectionClaim(toText(body));
    if (!claim) continue;

    // Its own correction block settles it: a piece that both admits the error
    // and carries the correction is the whole fix in one article.
    if (hasCorrection(art)) continue;

    const linked = internalArticleLinks(body)
      .filter((slug) => slug !== art.slug)
      .map((slug) => bySlug.get(slug))
      .filter(Boolean);

    if (linked.some(hasCorrection)) continue;

    findings.push({
      art,
      kind: "UNPAIRED CORRECTION",
      detail:
        linked.length === 0
          ? "says VR.org got something wrong and links no VR.org article"
          : `says VR.org got something wrong; none of the articles it links carries a correction (${linked
              .map((a) => a.slug)
              .join(", ")})`,
      context: claim.context.slice(0, 180),
    });
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
    console.error(`check:corrections  FAIL  ${err.message}`);
    process.exit(1);
  }

  let articles;
  try {
    articles = JSON.parse(readFileSync(articlesPath, "utf8"));
  } catch (err) {
    console.error(`check:corrections  FAIL  could not read ${articlesPath}: ${err.message}`);
    process.exit(1);
  }
  if (!Array.isArray(articles)) {
    console.error(`check:corrections  FAIL  ${articlesPath} did not contain an array of articles`);
    process.exit(1);
  }

  const scope = recent > 0 ? articles.slice(0, recent) : articles;
  const findings = findUnpairedCorrections(scope, articles);
  const label = recent > 0 ? `newest ${scope.length}` : `all ${scope.length}`;

  if (findings.length === 0) {
    console.log(`check:corrections  OK  ${label} articles, every self-correction is paired`);
    process.exit(0);
  }

  console.error(`\ncheck:corrections  FAIL  ${findings.length} correction(s) not applied where the error is\n`);
  for (const f of findings) {
    console.error(`  ${f.art.publishDate}  ${f.art.slug}`);
    console.error(`     ${f.kind}: ${f.detail}`);
    console.error(`     ...${f.context}...\n`);
  }
  console.error(
    "A correction belongs at the bottom of the article that carried the error,\n" +
      "dated, with updatedDate set and the original text left standing. Saying so\n" +
      "in a follow-up does not reach anyone who lands on the old piece. Apply it:\n" +
      '  npm run correction -- --slug=<article-with-the-error> --text="..."\n' +
      "then link that article from the piece that reports the corrected figure.\n"
  );
  process.exit(1);
}

const invokedPath = process.argv[1] ? resolve(process.argv[1]) : "";
if (invokedPath === fileURLToPath(import.meta.url)) main();
