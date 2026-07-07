import fs from "fs";
import path from "path";
import type { DealItem } from "./deals";

export interface MostPopularItem {
  name: string;
  subtitle: string;
  href: string;
}

export interface CategoryProductGroup {
  heading: string;
  seeAll: { href: string; label: string };
  mostPopular: MostPopularItem[];
  picks: DealItem[];
}

export interface CategoryProductsResult extends CategoryProductGroup {
  disclosure: string;
}

interface CategoryProductsFile {
  disclosure: string;
  categories: Record<string, CategoryProductGroup>;
}

const CP_PATH = path.join(process.cwd(), "data", "category-products.json");

export function getCategoryProducts(category: string): CategoryProductsResult | null {
  try {
    if (!fs.existsSync(CP_PATH)) return null;
    const data = JSON.parse(fs.readFileSync(CP_PATH, "utf-8")) as CategoryProductsFile;
    const group = data.categories?.[category];
    if (!group) return null;
    const hasContent = (group.picks?.length ?? 0) > 0 || (group.mostPopular?.length ?? 0) > 0;
    if (!hasContent) return null;
    return { ...group, disclosure: data.disclosure ?? "" };
  } catch {
    return null;
  }
}
