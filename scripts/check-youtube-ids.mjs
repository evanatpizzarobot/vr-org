#!/usr/bin/env node
/**
 * YouTube reference verifier for VR.org articles.
 *
 * Why this exists: check:images only proves a thumbnail URL returns 200, and a
 * fabricated-but-real video ID does exactly that. The drafting pipeline has
 * shipped IDs that resolve to a real video that is not the one the article
 * names. See CLAUDE.md, "Video Trailers".
 *
 * What it decides mechanically (exit 1):
 *   an ID that does not resolve through the oEmbed endpoint at all.
 *   a --slug given that matches no article at all (the gate never opened
 *     an article, so it cannot certify one; see extractYouTubeRefs usage
 *     below for how a matched article with zero references still reports OK).
 *   a malformed --recent or --slug value, rather than silently falling back
 *     to scanning the whole archive or matching nothing.
 *   a --file value that is missing, or that names a path this process cannot
 *     read, rather than silently falling back to data/articles.json. See
 *     --file below for why a fall back here would be dangerous.
 *
 * What it reports for a human or agent to judge (exit 0, printed as REVIEW):
 *   an ID that resolves to a title sharing no distinctive word with its
 *   enclosing figcaption, image alt text, or anchor text. Auto-failing this
 *   produces false positives on legitimate paraphrased captions, so it is
 *   surfaced, not enforced.
 *
 * Usage:
 *   node scripts/check-youtube-ids.mjs --recent 3
 *   node scripts/check-youtube-ids.mjs --recent=3
 *   node scripts/check-youtube-ids.mjs --slug=some-article-slug
 *   node scripts/check-youtube-ids.mjs --slug some-article-slug
 *   node scripts/check-youtube-ids.mjs --file path/to/draft-articles.json
 *   node scripts/check-youtube-ids.mjs --file=path/to/draft-articles.json
 *
 * --file exists so the travel-mode verification gate can check a draft
 * article's YouTube references before that draft has been added to
 * data/articles.json. Verification has to happen before publishing, and the
 * default path only ever contains articles that are already live, so without
 * --file this gate could not be run on a draft at all. It composes with
 * --slug and --recent, both of which apply within whichever file --file
 * points at.
 *
 * NOT wired into prebuild: it makes third-party network calls, and a YouTube
 * outage must not be able to break a Docker deploy.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const DEFAULT_ARTICLES = resolve(here, "..", "data", "articles.json");

const STOPWORDS = new Set([
  "the", "and", "for", "with", "from", "this", "that", "your", "you",
  "our", "its", "watch", "official", "video", "youtube", "trailer",
  // Ambient VR-copy words that show up in nearly every article on the site
  // and therefore carry no identifying signal between a video title and its
  // surrounding caption. Without these, a wrong-but-real video titled "Meta
  // Quest 3 Official Unboxing" passed silently inside any Quest coverage,
  // because "meta" and "quest" alone counted as a shared distinctive word.
  "meta", "quest", "steam", "valve", "headset", "gameplay",
]);

/**
 * Finds the nearest enclosing figure element around a match position: the
 * last <figure ...> opened at or before the index whose closing </figure>
 * comes after it. Article body markup does not nest figures, so this
 * nearest-open, nearest-close approach is sufficient.
 *
 * @param {string} body
 * @param {number} index
 * @returns {string|null}
 */
function findEnclosingFigure(body, index) {
  const openTag = /<figure[^>]*>/g;
  let lastOpen = -1;
  let m;
  while ((m = openTag.exec(body)) !== null) {
    if (m.index > index) break;
    lastOpen = m.index;
  }
  if (lastOpen === -1) return null;
  const closeIdx = body.indexOf("</figure>", lastOpen);
  if (closeIdx === -1 || closeIdx < index) return null;
  return body.slice(lastOpen, closeIdx + "</figure>".length);
}

/**
 * Same approach as findEnclosingFigure, for a bare anchor not wrapped in a
 * figure (a plain in-text watch link).
 *
 * @param {string} body
 * @param {number} index
 * @returns {string|null}
 */
function findEnclosingAnchor(body, index) {
  const openTag = /<a[\s>][^>]*>?/g;
  let lastOpen = -1;
  let lastOpenEnd = -1;
  let m;
  while ((m = openTag.exec(body)) !== null) {
    if (m.index > index) break;
    lastOpen = m.index;
    lastOpenEnd = openTag.lastIndex;
  }
  if (lastOpen === -1) return null;
  const closeIdx = body.indexOf("</a>", lastOpenEnd);
  if (closeIdx === -1 || closeIdx < index) return null;
  return body.slice(lastOpen, closeIdx + "</a>".length);
}

function stripTags(html) {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

/**
 * Builds the judgment context for one YouTube reference: the enclosing
 * figure's figcaption plus img alt text when the reference sits inside a
 * <figure>, the enclosing anchor's text for a bare watch link, and only as a
 * last resort (no enclosing element found) a fixed 200-character radius.
 *
 * The original design used a fixed 400-character radius unconditionally,
 * which reliably swept in unrelated ambient copy from neighboring paragraphs.
 * That is what let a wrong-but-real video pass the overlap check: the
 * surrounding prose, not just the caption, supplied the shared word. The
 * enclosing element is what an editor would actually read to judge the
 * reference, so it is what this checks against; the radius is a fallback
 * only, and a smaller one than before.
 *
 * @param {string} body
 * @param {number} index
 * @returns {string}
 */
function contextFor(body, index) {
  const figure = findEnclosingFigure(body, index);
  if (figure) {
    const captionMatch = figure.match(/<figcaption[^>]*>([\s\S]*?)<\/figcaption>/);
    const altMatch = figure.match(/<img\s[^>]*\balt="([^"]*)"/);
    const parts = [];
    if (altMatch && altMatch[1]) parts.push(altMatch[1]);
    if (captionMatch) parts.push(stripTags(captionMatch[1]));
    const joined = parts.join(" ").trim();
    if (joined) return joined;
  }

  const anchor = findEnclosingAnchor(body, index);
  if (anchor) {
    const text = stripTags(anchor);
    if (text) return text;
  }

  const start = Math.max(0, index - 200);
  const slice = body.slice(start, index + 200);
  return stripTags(slice);
}

/**
 * @param {string} body article body HTML
 * @returns {Array<{id: string, context: string}>}
 */
export function extractYouTubeRefs(body) {
  const found = new Map();
  const patterns = [
    /img\.youtube\.com\/vi\/([A-Za-z0-9_-]{11})\//g,
    /youtube\.com\/watch\?v=([A-Za-z0-9_-]{11})/g,
    /youtu\.be\/([A-Za-z0-9_-]{11})/g,
  ];
  for (const re of patterns) {
    let m;
    while ((m = re.exec(body)) !== null) {
      const id = m[1];
      if (found.has(id)) continue;
      found.set(id, { id, context: contextFor(body, m.index) });
    }
  }
  return [...found.values()];
}

function distinctiveWords(text) {
  return new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length >= 4 && !STOPWORDS.has(w))
  );
}

/**
 * @param {string} title oEmbed title
 * @param {string} context surrounding article text
 * @returns {boolean} true when they share at least one distinctive word
 */
export function titleOverlapsContext(title, context) {
  const titleWords = distinctiveWords(title);
  if (titleWords.size === 0) return true; // nothing distinctive to test against
  const contextWords = distinctiveWords(context);
  for (const w of titleWords) if (contextWords.has(w)) return true;
  return false;
}

async function resolveTitle(id) {
  const url = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`;
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "VRorgBot/1.0 (https://vr.org; evan@pizzarobotstudios.com)" },
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) return { ok: false, reason: `HTTP ${res.status}` };
    const data = await res.json();
    return { ok: true, title: data.title };
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
    console.error("check:youtube  FAIL  --file was given with no path");
    process.exitCode = 1;
    return;
  }
  const articlesPath = fileFlag.present ? resolve(fileFlag.raw) : DEFAULT_ARTICLES;

  const recentFlag = parseRecentFlag(args);
  if (!recentFlag.valid) {
    console.error(`check:youtube  FAIL  --recent value "${recentFlag.raw ?? ""}" is not a positive integer`);
    process.exitCode = 1;
    return;
  }

  const slugFlag = parseSlugFlag(args);
  if (slugFlag.present && !slugFlag.valid) {
    console.error("check:youtube  FAIL  --slug was given with no value");
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
      console.error(`check:youtube  FAIL  could not read ${articlesPath}: ${err.message}`);
      process.exitCode = 1;
      return;
    }
    console.warn(`check:youtube  WARN  could not read ${articlesPath}: ${err.message}`);
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
      console.error(`check:youtube  FAIL  --slug=${slugFlag.value} matched no article in articles.json`);
      console.error("The gate never opened an article, so it cannot certify one. Check the slug for a typo, or confirm the article has been added yet.");
      process.exitCode = 1;
      return;
    }
  } else if (recentFlag.value > 0) {
    scope = articles.slice(0, recentFlag.value);
  }

  const dead = [];
  const review = [];
  let checked = 0;

  for (const article of scope) {
    for (const ref of extractYouTubeRefs(article.body || "")) {
      checked++;
      const result = await resolveTitle(ref.id);
      if (!result.ok) {
        dead.push({ slug: article.slug, id: ref.id, reason: result.reason });
        continue;
      }
      if (!titleOverlapsContext(result.title, ref.context)) {
        review.push({ slug: article.slug, id: ref.id, title: result.title, context: ref.context.slice(0, 120) });
      }
    }
  }

  for (const r of review) {
    console.log(`check:youtube  REVIEW  ${r.slug}`);
    console.log(`    id ${r.id} resolves to: "${r.title}"`);
    console.log(`    article context:        "${r.context}"`);
    console.log("    Confirm this is the intended video before publishing.");
  }

  if (dead.length > 0) {
    console.error(`check:youtube  FAIL  ${dead.length} of ${checked} video id(s) do not resolve:`);
    for (const d of dead) console.error(`  ${d.slug}  ${d.id}  (${d.reason})`);
    console.error("An unresolvable id means the id was invented. Remove it or find the real video.");
    // process.exitCode (not process.exit()) so Node drains the event loop
    // naturally. process.exit() tears down before pending I/O (an in-flight
    // fetch() using AbortSignal.timeout()) settles, which crashes libuv on
    // Windows. Do not "simplify" this back to process.exit().
    process.exitCode = 1;
    return;
  }

  console.log(`check:youtube  OK  ${checked} video id(s) resolve, ${review.length} flagged for review`);
  // process.exitCode (not process.exit()) so Node drains the event loop
  // naturally. process.exit() tears down before pending I/O (an in-flight
  // fetch() using AbortSignal.timeout()) settles, which crashes libuv on
  // Windows. Returning here resolves main()'s promise and Node exits once
  // nothing else is pending. Do not "simplify" this back to process.exit().
  return;
}

const invokedPath = process.argv[1] ? resolve(process.argv[1]) : "";
if (invokedPath === fileURLToPath(import.meta.url)) main();
