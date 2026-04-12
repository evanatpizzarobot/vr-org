import type { RSSSource } from "./types";

export const RSS_SOURCES: RSSSource[] = [
  {
    key: "roadtovr",
    name: "Road to VR",
    url: "https://www.roadtovr.com/feed/",
    priority: "primary",
  },
  {
    key: "uploadvr",
    name: "UploadVR",
    url: "https://uploadvr.com/feed/",
    priority: "primary",
  },
  {
    key: "auganix",
    name: "Auganix",
    url: "https://www.auganix.org/feed/",
    priority: "primary",
  },
  {
    key: "uctodayxr",
    name: "UC Today XR",
    url: "https://www.uctoday.com/tag/extended-reality/feed/",
    priority: "primary",
  },
  {
    key: "virtualrealitynews",
    name: "Virtual Reality News",
    url: "https://virtual.reality.news/rss",
    priority: "secondary",
  },
];
