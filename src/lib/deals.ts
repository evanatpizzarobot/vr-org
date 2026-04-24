import fs from "fs";
import path from "path";

export interface DealLink {
  url: string;
  label: string;
}

export interface DealItem {
  name: string;
  price: string;
  image: string;
  description: string;
  badge?: string;
  links: Record<string, DealLink>;
}

export interface DealSection {
  id: string;
  title: string;
  description: string;
  items: DealItem[];
}

export interface DealsData {
  lastUpdated: string;
  disclosure: string;
  sections: DealSection[];
}

const DEALS_PATH = path.join(process.cwd(), "data", "deals.json");

const EMPTY: DealsData = {
  lastUpdated: "",
  disclosure: "",
  sections: [],
};

export function getDeals(): DealsData {
  try {
    if (!fs.existsSync(DEALS_PATH)) return EMPTY;
    const raw = fs.readFileSync(DEALS_PATH, "utf-8");
    return JSON.parse(raw) as DealsData;
  } catch {
    return EMPTY;
  }
}
