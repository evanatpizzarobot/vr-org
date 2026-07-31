// Helpers for exposing article imagery and full body content in feeds.
//
// Card surfaces (MSN / Windows new tab, Google Discover, feed readers, Slack and
// Discord unfurls) render from the feed, not the page. Without an image element
// they fall back to a text-only card, which is why the feed needs an explicit
// media:thumbnail rather than relying on the article HTML.
//
// Article bodies mix absolute image URLs (Wikimedia, Steam CDN, press kits) with
// root-relative ones for self-hosted press images under /article-images/. Feed
// consumers are off-site, so every URL has to be absolutised before it ships.

const SITE = "https://vr.org";

const MIME_BY_EXT: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
};

/** Escapes a value for use inside a double-quoted XML attribute. */
export function escapeXmlAttr(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Resolves a root-relative URL against the site origin. Absolute URLs pass through. */
export function absoluteUrl(url: string): string {
  const trimmed = (url || "").trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (trimmed.startsWith("//")) return `https:${trimmed}`;
  return `${SITE}${trimmed.startsWith("/") ? "" : "/"}${trimmed}`;
}

/** The first <img src> in an article body, absolutised, or null when there is none. */
export function firstImageUrl(body: string): string | null {
  const match = /<img\s[^>]*src=["']([^"']+)["']/i.exec(body || "");
  if (!match) return null;
  const url = absoluteUrl(match[1]);
  return url || null;
}

/** Content type for an image URL, defaulting to JPEG when the extension is unknown. */
export function imageMimeType(url: string): string {
  const ext = /\.([a-z0-9]+)(?:[?#]|$)/i.exec(url || "");
  return (ext && MIME_BY_EXT[ext[1].toLowerCase()]) || "image/jpeg";
}

/**
 * The image a feed card should display: the article's own lead image when it has
 * one, otherwise the generated per-article Open Graph card, which always exists.
 */
export function feedImageForArticle(article: { body: string; slug: string }): string {
  return firstImageUrl(article.body) ?? `${SITE}/articles/${article.slug}/opengraph-image`;
}

/** Rewrites root-relative img/a URLs in body HTML so off-site readers resolve them. */
export function absolutizeImages(html: string): string {
  return (html || "").replace(
    /(<(?:img|a)\s[^>]*?(?:src|href)=)(["'])(\/[^"']*)\2/gi,
    (_m, prefix: string, quote: string, path: string) =>
      `${prefix}${quote}${SITE}${path}${quote}`
  );
}
