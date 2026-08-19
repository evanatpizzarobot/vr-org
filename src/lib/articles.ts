import fs from "fs";
import path from "path";
import { withImageFailsafe } from "./article-images";

export interface EditorialArticle {
  id: string;
  slug: string;
  title: string;
  author: string;
  authorRole: string;
  publishDate: string;
  updatedDate: string | null;
  category: string;
  tags: string[];
  snippet: string;
  featured: boolean;
  // Optional big-news flag: true renders a "BREAKING" red-outline card
  // treatment, a string (e.g. "LEAK") becomes the label. Auto-expires 48h
  // after publishDate via src/lib/breaking.ts.
  breaking?: boolean | string;
  body: string;
}

const ARTICLES_PATH = path.join(process.cwd(), "data", "articles.json");

// mtime-keyed cache. articles.json is ~1.8MB and is re-read on every call from
// ~26 call sites, including six per-request XML/txt routes and every page
// render, so an uncached read meant parsing 1.8MB and running the image
// failsafe over every body on each request. The file is volume-mounted and
// changes without a container rebuild, so the cache cannot be a plain module
// constant: it is keyed on the file's mtime and size, both of which come from a
// statSync that costs microseconds against tens of milliseconds for the parse.
// A data-only deploy rewrites the file, mtime moves, and the next call reparses.
let cache: {
  mtimeMs: number;
  size: number;
  articles: EditorialArticle[];
} | null = null;

export function getAllArticles(): EditorialArticle[] {
  try {
    const stat = fs.statSync(ARTICLES_PATH);
    if (cache && cache.mtimeMs === stat.mtimeMs && cache.size === stat.size) {
      // Shallow copy so an in-place sort/reverse by a caller cannot reorder the
      // shared cache. The article objects themselves are intentionally shared;
      // nothing mutates them after the failsafe pass below.
      return cache.articles.slice();
    }

    const raw = fs.readFileSync(ARTICLES_PATH, "utf-8");
    const articles: EditorialArticle[] = JSON.parse(raw);
    for (const article of articles) {
      article.body = withImageFailsafe(article.body);
    }
    articles.sort(
      (a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
    );

    cache = { mtimeMs: stat.mtimeMs, size: stat.size, articles };
    return articles.slice();
  } catch {
    // Serve the last known-good set rather than blanking the site if the file
    // is briefly unreadable or invalid. Writes are atomic (tmp + rename) so a
    // torn read should not happen, but an article-less render is the worst
    // possible failure mode here and this makes it unreachable once warm.
    return cache ? cache.articles.slice() : [];
  }
}

export function getArticleBySlug(slug: string): EditorialArticle | null {
  const articles = getAllArticles();
  return articles.find((a) => a.slug === slug) || null;
}

const MAX_FEATURED_PER_CATEGORY = 1;

export function getFeaturedArticles(category: string): EditorialArticle[] {
  const articles = getAllArticles();
  return articles
    .filter(
      (a) => a.featured && (a.category === category || a.tags.includes(category))
    )
    .slice(0, MAX_FEATURED_PER_CATEGORY);
}

export function getAllSlugs(): string[] {
  return getAllArticles().map((a) => a.slug);
}

export interface OriginalSummary {
  id: string;
  slug: string;
  title: string;
  author: string;
  authorRole: string;
  snippet: string;
  publishDate: string;
  category: string;
  tags: string[];
}

// Recent originals for a category (category match OR tag match), newest first.
// Server-rendered into the category hubs so each hub exposes its topical cluster
// of originals to crawlers and AI agents instead of a single client-fetched pin.
export function getCategoryOriginalSummaries(
  category: string,
  limit: number
): OriginalSummary[] {
  return getAllArticles()
    .filter((a) => a.category === category || a.tags.includes(category))
    .slice(0, limit)
    .map((a) => ({
      id: a.id,
      slug: a.slug,
      title: a.title,
      author: a.author,
      authorRole: a.authorRole,
      snippet: a.snippet,
      publishDate: a.publishDate,
      category: a.category,
      tags: a.tags,
    }));
}
