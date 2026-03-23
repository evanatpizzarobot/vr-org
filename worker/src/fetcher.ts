import type { Article, RSSSource } from "./types";
import { categorize, getCompanyTags } from "./categorizer";

async function hashString(str: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hash = await crypto.subtle.digest("SHA-256", data);
  const array = Array.from(new Uint8Array(hash));
  return array.map((b) => b.toString(16).padStart(2, "0")).join("").slice(0, 16);
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function truncate(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen).replace(/\s+\S*$/, "") + "...";
}

function extractTag(xml: string, tag: string): string {
  // Handle CDATA
  const cdataPattern = new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]></${tag}>`, "i");
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
  // Try media:content
  const mediaMatch = itemXml.match(/<media:content[^>]*url=["']([^"']+)["']/i);
  if (mediaMatch) return mediaMatch[1];

  // Try enclosure
  const enclosureMatch = itemXml.match(/<enclosure[^>]*url=["']([^"']+)["'][^>]*type=["']image/i);
  if (enclosureMatch) return enclosureMatch[1];

  // Try media:thumbnail
  const thumbMatch = itemXml.match(/<media:thumbnail[^>]*url=["']([^"']+)["']/i);
  if (thumbMatch) return thumbMatch[1];

  // Try first image in content
  const imgMatch = itemXml.match(/<img[^>]*src=["']([^"']+)["']/i);
  if (imgMatch) return imgMatch[1];

  return null;
}

export async function fetchSource(source: RSSSource): Promise<Article[]> {
  try {
    const response = await fetch(source.url, {
      headers: {
        "User-Agent": "VR.org Feed Aggregator/1.0",
        Accept: "application/rss+xml, application/xml, text/xml",
      },
      cf: { cacheTtl: 300 },
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
      const author = extractTag(itemXml, "dc:creator") || extractTag(itemXml, "author") || null;

      if (!title || !link) continue;

      const id = await hashString(link);
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
  }
}
