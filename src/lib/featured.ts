import fs from "fs";
import path from "path";
import type { Article } from "@/types";

export interface FeaturedArticle {
  id: string;
  source: string;
  sourceName: string;
  title: string;
  snippet: string;
  link: string;
  author: string | null;
  pubDate: string;
  category: string;
  tags: string[];
  imageUrl: string | null;
  pinnedAt: string;      // ISO date when pinned
  expiresAt: string;     // ISO date when it should be auto-replaced
}

export interface FeaturedData {
  [category: string]: FeaturedArticle[];
}

const FEATURED_PATH = path.join(process.cwd(), "data", "featured.json");
const PIN_DURATION_DAYS = 30;
const ARTICLES_PER_CATEGORY = 5;

function ensureDataDir(): void {
  const dir = path.dirname(FEATURED_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

export function readFeatured(): FeaturedData {
  try {
    ensureDataDir();
    if (!fs.existsSync(FEATURED_PATH)) {
      return { hardware: [], gaming: [], software: [], enterprise: [], ar: [] };
    }
    const raw = fs.readFileSync(FEATURED_PATH, "utf-8");
    return JSON.parse(raw);
  } catch {
    return { hardware: [], gaming: [], software: [], enterprise: [], ar: [] };
  }
}

export function writeFeatured(data: FeaturedData): void {
  ensureDataDir();
  fs.writeFileSync(FEATURED_PATH, JSON.stringify(data, null, 2), "utf-8");
}

/**
 * Remove expired articles and auto-fill categories that need more
 * featured articles. Picks from diverse sources for variety.
 */
export function refreshFeatured(allArticles: Article[]): FeaturedData {
  const data = readFeatured();
  const now = new Date();
  const categories = ["hardware", "gaming", "software", "enterprise", "ar"];

  for (const category of categories) {
    // Remove expired articles
    data[category] = (data[category] || []).filter((a) => {
      return new Date(a.expiresAt) > now;
    });

    // Check if we need more
    const needed = ARTICLES_PER_CATEGORY - data[category].length;
    if (needed <= 0) continue;

    // Get candidate articles for this category
    const existingIds = new Set(data[category].map((a) => a.id));
    const existingSources = new Set(data[category].map((a) => a.source));
    const candidates = allArticles.filter(
      (a) =>
        (a.category === category || a.tags.includes(category)) &&
        !existingIds.has(a.id)
    );

    // Prioritize diverse sources
    const picked: Article[] = [];

    // First pass: pick from sources we don't already have
    for (const a of candidates) {
      if (picked.length >= needed) break;
      if (!existingSources.has(a.source) && !picked.some((p) => p.source === a.source)) {
        picked.push(a);
      }
    }

    // Second pass: fill remaining slots with best available
    for (const a of candidates) {
      if (picked.length >= needed) break;
      if (!picked.some((p) => p.id === a.id)) {
        picked.push(a);
      }
    }

    // Convert to featured articles with pin dates
    const expiresAt = new Date(now);
    expiresAt.setDate(expiresAt.getDate() + PIN_DURATION_DAYS);

    for (const article of picked) {
      data[category].push({
        ...article,
        pinnedAt: now.toISOString(),
        expiresAt: expiresAt.toISOString(),
      });
    }

    if (picked.length > 0) {
      console.log(
        `[VR.org] Pinned ${picked.length} featured articles to /${category} (expires ${expiresAt.toISOString().slice(0, 10)})`
      );
    }
  }

  writeFeatured(data);
  return data;
}

/**
 * Get featured articles for a specific category
 */
export function getFeaturedForCategory(category: string): FeaturedArticle[] {
  const data = readFeatured();
  const now = new Date();
  // Filter out expired on read too
  return (data[category] || []).filter((a) => new Date(a.expiresAt) > now);
}
