import fs from "fs";
import path from "path";

export type ReleaseStatus = "confirmed" | "expected" | "rumored" | "released";
export type ReleaseCategory = "headset" | "glasses" | "game" | "accessory";

export interface ReleaseItem {
  id: string;
  name: string;
  category: ReleaseCategory;
  status: ReleaseStatus;
  dateText: string;
  // isoDate is ONLY set when an exact official date exists (safe for schema).
  // sortDate is an ordering anchor for windows like "Summer 2026" and makes
  // no factual claim; it never appears in markup or structured data.
  isoDate: string | null;
  sortDate: string | null;
  platforms: string[];
  price: string | null;
  summary: string;
  link: string | null;
  officialUrl: string | null;
  lastVerified: string;
}

export interface ReleaseDatesData {
  lastUpdated: string;
  items: ReleaseItem[];
}

const RELEASE_DATES_PATH = path.join(
  process.cwd(),
  "data",
  "release-dates.json"
);

const EMPTY: ReleaseDatesData = {
  lastUpdated: "",
  items: [],
};

export function getReleaseDates(): ReleaseDatesData {
  try {
    if (!fs.existsSync(RELEASE_DATES_PATH)) return EMPTY;
    const raw = fs.readFileSync(RELEASE_DATES_PATH, "utf-8");
    return JSON.parse(raw) as ReleaseDatesData;
  } catch {
    return EMPTY;
  }
}

// Sort helper: dated items first (soonest upcoming to furthest), undated
// windows after, released items always last. Used by the tracker page and
// the /deals Coming Soon strip so both surfaces agree on order.
export function sortReleaseItems(items: ReleaseItem[]): ReleaseItem[] {
  const key = (i: ReleaseItem) => i.isoDate || i.sortDate || null;
  return [...items].sort((a, b) => {
    const aReleased = a.status === "released" ? 1 : 0;
    const bReleased = b.status === "released" ? 1 : 0;
    if (aReleased !== bReleased) return aReleased - bReleased;
    const ka = key(a);
    const kb = key(b);
    if (ka && kb) return ka.localeCompare(kb);
    if (ka) return -1;
    if (kb) return 1;
    return a.name.localeCompare(b.name);
  });
}

// The next N upcoming (not yet released) items for the /deals strip.
export function getComingSoon(limit = 5): ReleaseItem[] {
  const { items } = getReleaseDates();
  return sortReleaseItems(items.filter((i) => i.status !== "released")).slice(
    0,
    limit
  );
}
