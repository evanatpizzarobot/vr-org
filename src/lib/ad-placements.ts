import fs from "fs";
import path from "path";

// Direct-sold ad placements (distinct from the AdSense units in ads.ts). The
// source of truth is data/ad-placements.json, which is volume-mounted on the
// VPS and read at request time, so a placement can be activated or swapped with
// a JSON edit + push, no Docker rebuild. Every slot ships inactive; an inactive
// slot renders nothing on the site (see components/AdZone.tsx), so this whole
// system is dormant until a real advertiser is wired in.

export interface AdPlacement {
  active: boolean;
  advertiser?: string;
  label?: string; // overrides the "Sponsored" tag
  linkUrl?: string; // click destination
  imageUrl?: string; // creative (default / light)
  imageUrlDark?: string; // optional dark-theme creative
  alt?: string;
  width?: number;
  height?: number;
}

export type AdPlacementMap = Record<string, AdPlacement>;

interface AdPlacementFile {
  placements?: AdPlacementMap;
}

// Reads the placement config. Any failure (missing file, bad JSON) returns an
// empty map, so a broken config can never crash a render, it just means no ads.
export function getAdPlacements(): AdPlacementMap {
  try {
    const file = path.join(process.cwd(), "data", "ad-placements.json");
    const raw = fs.readFileSync(file, "utf-8");
    const parsed = JSON.parse(raw) as AdPlacementFile;
    return parsed.placements ?? {};
  } catch {
    return {};
  }
}
