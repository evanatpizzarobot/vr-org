import type { Article } from "./types";

export function deduplicateArticles(articles: Article[]): Article[] {
  const seen = new Map<string, Article>();

  for (const article of articles) {
    if (!seen.has(article.id)) {
      seen.set(article.id, article);
    }
  }

  return Array.from(seen.values());
}
