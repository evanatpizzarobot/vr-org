import fs from "fs";
import path from "path";

export type CreatorBeat =
  | "news"
  | "games"
  | "hardware"
  | "leaks"
  | "culture"
  | "howto"
  | "fitness"
  | "developer"
  | "international";

export interface Creator {
  id: string;
  name: string;
  handle: string;
  url: string;
  channelId: string;
  // subs is the exact display string YouTube shows ("809K"). subsText is the
  // rounded prose form used on the page, because an exact count rots between
  // refreshes and a rounded one stays true for longer.
  subs: string;
  subsText: string;
  videos: string;
  // Maintenance-only. This page is a directory of who covers what; it does not
  // publish or comment on posting activity, so lastUpload exists solely to help
  // the 90-day refresh confirm a channel still resolves. Never render it.
  lastUpload: string;
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

// Within a beat the order is the file's order, which is deliberate: the page is
// unranked, so nothing here re-sorts by subscriber count.
export function creatorsInBeat(data: CreatorsData, beat: CreatorBeat): Creator[] {
  return data.creators.filter((c) => c.beat === beat);
}
