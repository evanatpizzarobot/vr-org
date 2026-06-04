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
  body: string;
}

const ARTICLES_PATH = path.join(process.cwd(), "data", "articles.json");

export function getAllArticles(): EditorialArticle[] {
  try {
    if (!fs.existsSync(ARTICLES_PATH)) return [];
    const raw = fs.readFileSync(ARTICLES_PATH, "utf-8");
    const articles: EditorialArticle[] = JSON.parse(raw);
    for (const article of articles) {
      article.body = withImageFailsafe(article.body);
    }
    return articles.sort(
      (a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
    );
  } catch {
    return [];
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
