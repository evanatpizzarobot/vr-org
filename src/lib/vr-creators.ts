import fs from "fs";
import path from "path";

// "active" renders in the main roster grouped by beat. "dormant" is the
// separate section for channels with enormous reach and no recent uploads;
// they keep their last-upload date stated plainly rather than being quietly
// dropped. "offsite" is for people whose real work has moved off YouTube.
export type CreatorGroup = "active" | "dormant" | "offsite";

export type CreatorBeat =
  | "news"
  | "games"
  | "hardware"
  | "howto"
  | "fitness"
  | "developer"
  | "international"
  | "culture"
  | "leaks";

export interface Creator {
  id: string;
  name: string;
  handle: string;
  url: string;
  channelId: string;
  // subs is the exact display string YouTube shows ("809K"). subsText is the
  // rounded prose form used in the page body, because an exact count rots
  // between refreshes and a rounded one stays true for longer.
  subs: string;
  subsText: string;
  videos: string;
  lastUpload: string;
  group: CreatorGroup;
  beat: CreatorBeat;
  language: string;
  note: string;
  link: string | null;
}

export interface CreatorsData {
  lastUpdated: string;
  lastVerified: string;
  creators: Creator[];
}

const CREATORS_PATH = path.join(process.cwd(), "data", "vr-creators.json");

const EMPTY: CreatorsData = {
  lastUpdated: "",
  lastVerified: "",
  creators: [],
};

export function getCreators(): CreatorsData {
  try {
    if (!fs.existsSync(CREATORS_PATH)) return EMPTY;
    return JSON.parse(fs.readFileSync(CREATORS_PATH, "utf-8")) as CreatorsData;
  } catch {
    return EMPTY;
  }
}

export function creatorsInGroup(
  data: CreatorsData,
  group: CreatorGroup
): Creator[] {
  return data.creators.filter((c) => c.group === group);
}

// Within a beat the order is the file's order, which is deliberate: the page
// is unranked, so nothing here re-sorts by subscriber count.
export function creatorsInBeat(data: CreatorsData, beat: CreatorBeat): Creator[] {
  return data.creators.filter((c) => c.group === "active" && c.beat === beat);
}

// Dormant channels sort by how recently they last posted, so the section reads
// from "went quiet most recently" downward.
export function sortByLastUpload(creators: Creator[]): Creator[] {
  return [...creators].sort((a, b) => b.lastUpload.localeCompare(a.lastUpload));
}
