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
    key: "techcrunch",
    name: "TechCrunch",
    url: "https://techcrunch.com/tag/virtual-reality/feed/",
    priority: "primary",
  },
  {
    key: "xrtoday",
    name: "XR Today",
    url: "https://www.xrtoday.com/feed/",
    priority: "primary",
  },
  {
    key: "mixed",
    name: "Mixed News",
    url: "https://mixed-news.com/en/feed/",
    priority: "secondary",
  },
  {
    key: "ghosthowls",
    name: "The Ghost Howls",
    url: "https://skarredghost.com/feed/",
    priority: "secondary",
  },
  {
    key: "hypergrid",
    name: "Hypergrid Business",
    url: "https://www.hypergridbusiness.com/feed/",
    priority: "secondary",
  },
  {
    key: "xrnews",
    name: "Extended Reality News",
    url: "https://extendedreality.news/feed/",
    priority: "secondary",
  },
];
