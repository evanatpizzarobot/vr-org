import crypto from "crypto";
import type { Article, RSSSource } from "./types";
import { categorize, getCategoryTags, getCompanyTags } from "./categorizer";

function hashString(str: string): string {
  return crypto.createHash("sha256").update(str).digest("hex").slice(0, 16);
}

function decodeHtmlEntities(text: string): string {
  return text
    // Decode numeric entities (&#8216; &#8217; &#8220; etc.)
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(parseInt(code, 10)))
    // Decode hex entities (&#x2019; etc.)
    .replace(/&#x([0-9a-fA-F]+);/g, (_, code) => String.fromCharCode(parseInt(code, 16)))
    // Decode named entities
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&mdash;/g, "-")
    .replace(/&ndash;/g, "-")
    .replace(/&hellip;/g, "…")
    .replace(/&lsquo;/g, "\u2018")
    .replace(/&rsquo;/g, "\u2019")
    .replace(/&ldquo;/g, "\u201C")
    .replace(/&rdquo;/g, "\u201D");
}

function stripHtml(html: string): string {
  return decodeHtmlEntities(
    html
      .replace(/<[^>]*>/g, "")
      .replace(/\s+/g, " ")
      .trim()
  );
}

function truncate(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen).replace(/\s+\S*$/, "") + "...";
}

const VR_RELEVANCE_REGEX =
  /\b(?:vr|xr|virtual reality|augmented reality|extended reality|mixed reality|spatial computing|meta quest|quest [234]|quest pro|horizon worlds|vision pro|visionos|psvr|psvr2|playstation vr|steamvr|steam vr|steam frame|valve index|android xr|pico [45]|hololens|magic leap|xreal|nreal|rokid|webxr|openxr|oculus|ray-?ban meta|smart glasses|ar glasses|mr headset|vr headset)\b/i;

function isVRRelevant(title: string, snippet: string): boolean {
  return VR_RELEVANCE_REGEX.test(`${title} ${snippet}`);
}

function extractTag(xml: string, tag: string): string {
  const cdataPattern = new RegExp(
    `<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]></${tag}>`,
    "i"
  );
  const cdataMatch = xml.match(cdataPattern);
  if (cdataMatch) return cdataMatch[1].trim();

  const pattern = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i");
  const match = xml.match(pattern);
  return match ? match[1].trim() : "";
}

function extractItems(xml: string): string[] {
  const items: string[] = [];
  const itemPattern = /<item[\s>]([\s\S]*?)<\/item>/gi;
  let match;
  while ((match = itemPattern.exec(xml)) !== null) {
    items.push(match[0]);
  }
  if (items.length === 0) {
    // Atom feeds use <entry> instead of <item>. The Verge and a handful
    // of other publishers ship Atom, so fall back when no RSS items found.
    const entryPattern = /<entry[\s>]([\s\S]*?)<\/entry>/gi;
    while ((match = entryPattern.exec(xml)) !== null) {
      items.push(match[0]);
    }
  }
  return items;
}

function extractAtomLink(itemXml: string): string {
  // Atom links are self-closing: <link href="..." rel="alternate" />
  // Prefer rel="alternate" (the canonical article URL); fall back to
  // the first <link> with an href attribute.
  const altA = itemXml.match(
    /<link[^>]*rel=["']alternate["'][^>]*href=["']([^"']+)["']/i
  );
  if (altA) return altA[1];
  const altB = itemXml.match(
    /<link[^>]*href=["']([^"']+)["'][^>]*rel=["']alternate["']/i
  );
  if (altB) return altB[1];
  const any = itemXml.match(/<link[^>]*href=["']([^"']+)["']/i);
  return any ? any[1] : "";
}

function extractImageUrl(itemXml: string): string | null {
  const mediaMatch = itemXml.match(
    /<media:content[^>]*url=["']([^"']+)["']/i
  );
  if (mediaMatch) return mediaMatch[1];

  const enclosureMatch = itemXml.match(
    /<enclosure[^>]*url=["']([^"']+)["'][^>]*type=["']image/i
  );
  if (enclosureMatch) return enclosureMatch[1];

  const thumbMatch = itemXml.match(
    /<media:thumbnail[^>]*url=["']([^"']+)["']/i
  );
  if (thumbMatch) return thumbMatch[1];

  const imgMatch = itemXml.match(/<img[^>]*src=["']([^"']+)["']/i);
  if (imgMatch) return imgMatch[1];

  return null;
}

export interface FetchResult {
  articles: Article[];
  rawItemCount: number;
}

export async function fetchSource(source: RSSSource): Promise<FetchResult> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(source.url, {
      headers: {
        "User-Agent": "VR.org Feed Aggregator/1.0",
        Accept: "application/rss+xml, application/xml, text/xml",
      },
      signal: controller.signal,
    });

    if (!response.ok) {
      console.error(`Failed to fetch ${source.name}: ${response.status}`);
      return { articles: [], rawItemCount: 0 };
    }

    const xml = await response.text();
    const items = extractItems(xml);
    const articles: Article[] = [];

    for (const itemXml of items) {
      const title = stripHtml(extractTag(itemXml, "title"));
      // Atom uses <link href="..."/>; RSS uses <link>...</link>.
      const link = extractTag(itemXml, "link") || extractAtomLink(itemXml);
      // Atom uses <published> (or <updated> as fallback) instead of <pubDate>.
      const pubDateStr =
        extractTag(itemXml, "pubDate") ||
        extractTag(itemXml, "published") ||
        extractTag(itemXml, "updated");
      const description = extractTag(itemXml, "description");
      const contentEncoded = extractTag(itemXml, "content:encoded");
      // Atom feeds put the body in <content> or <summary>.
      const atomContent =
        extractTag(itemXml, "content") || extractTag(itemXml, "summary");
      const author =
        extractTag(itemXml, "dc:creator") ||
        extractTag(itemXml, "author") ||
        null;

      if (!title || !link) continue;

      const id = hashString(link);
      const rawSnippet = stripHtml(contentEncoded || description || atomContent);

      if (source.relevanceFilter && !isVRRelevant(title, rawSnippet)) {
        continue;
      }

      const snippet = truncate(rawSnippet, 200);
      const category = categorize(title, rawSnippet);
      const categoryTags = getCategoryTags(title, rawSnippet, category);
      const companyTags = getCompanyTags(title, rawSnippet);
      const tags = [...new Set([category, ...categoryTags, ...companyTags])];
      const imageUrl = extractImageUrl(itemXml);

      let pubDate: string;
      try {
        pubDate = new Date(pubDateStr).toISOString();
      } catch {
        pubDate = new Date().toISOString();
      }

      articles.push({
        id,
        source: source.key,
        sourceName: source.name,
        title,
        snippet,
        link,
        author,
        pubDate,
        category,
        tags,
        imageUrl,
      });
    }

    return { articles, rawItemCount: items.length };
  } catch (err) {
    console.error(`Error fetching ${source.name}:`, err);
    return { articles: [], rawItemCount: 0 };
  } finally {
    clearTimeout(timeout);
  }
}
