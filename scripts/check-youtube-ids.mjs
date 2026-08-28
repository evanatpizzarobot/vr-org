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
 *
 * What it reports for a human or agent to judge (exit 0, printed as REVIEW):
 *   an ID that resolves to a title sharing no distinctive word with the
 *   surrounding figcaption or anchor text. Auto-failing this produces false
 *   positives on legitimate paraphrased captions, so it is surfaced, not
 *   enforced.
 *
 * Usage:
 *   node scripts/check-youtube-ids.mjs --recent 3
 *   node scripts/check-youtube-ids.mjs --slug=some-article-slug
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
]);

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
      const start = Math.max(0, m.index - 400);
      const slice = body.slice(start, m.index + 400);
      const context = slice.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
      found.set(id, { id, context });
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
    console.warn(`check:youtube  WARN  could not read articles.json: ${err.message}`);
    process.exit(0);
  }

  let scope = articles;
  if (slug) scope = articles.filter((a) => a.slug === slug);
  else if (recent > 0) scope = articles.slice(0, recent);

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
    process.exit(1);
  }

  console.log(`check:youtube  OK  ${checked} video id(s) resolve, ${review.length} flagged for review`);
  process.exit(0);
}

const invokedPath = process.argv[1] ? resolve(process.argv[1]) : "";
if (invokedPath === fileURLToPath(import.meta.url)) main();
