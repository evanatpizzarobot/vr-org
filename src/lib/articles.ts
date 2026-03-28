import fs from "fs";
import path from "path";

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

const MAX_FEATURED_PER_CATEGORY = 3;

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
