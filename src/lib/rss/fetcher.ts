import crypto from "crypto";
import type { Article, RSSSource } from "./types";
import { categorize, getCompanyTags } from "./categorizer";

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
    .replace(/&mdash;/g, "—")
    .replace(/&ndash;/g, "–")
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
  const pattern = /<item[\s>]([\s\S]*?)<\/item>/gi;
  let match;
  while ((match = pattern.exec(xml)) !== null) {
    items.push(match[0]);
  }
  return items;
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

export async function fetchSource(source: RSSSource): Promise<Article[]> {
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
      return [];
    }

    const xml = await response.text();
    const items = extractItems(xml);
    const articles: Article[] = [];

    for (const itemXml of items) {
      const title = stripHtml(extractTag(itemXml, "title"));
      const link = extractTag(itemXml, "link");
      const pubDateStr = extractTag(itemXml, "pubDate");
      const description = extractTag(itemXml, "description");
      const contentEncoded = extractTag(itemXml, "content:encoded");
      const author =
        extractTag(itemXml, "dc:creator") ||
        extractTag(itemXml, "author") ||
        null;

      if (!title || !link) continue;

      const id = hashString(link);
      const rawSnippet = stripHtml(contentEncoded || description);
      const snippet = truncate(rawSnippet, 200);
      const category = categorize(title, rawSnippet);
      const companyTags = getCompanyTags(title, rawSnippet);
      const tags = [...new Set([category, ...companyTags])];
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

    return articles;
  } catch (err) {
    console.error(`Error fetching ${source.name}:`, err);
    return [];
  } finally {
    clearTimeout(timeout);
  }
}
