export const SOURCES: Record<
  string,
  { name: string; color: string; lightColor: string; cssClass: string }
> = {
  roadtovr: {
    name: "Road to VR",
    color: "#00e5ff",
    lightColor: "#0891B2",
    cssClass: "source-roadtovr",
  },
  uploadvr: {
    name: "UploadVR",
    color: "#e040fb",
    lightColor: "#C026D3",
    cssClass: "source-uploadvr",
  },
  auganix: {
    name: "Auganix",
    color: "#00e676",
    lightColor: "#059669",
    cssClass: "source-auganix",
  },
  uctodayxr: {
    name: "UC Today XR",
    color: "#ff9100",
    lightColor: "#EA580C",
    cssClass: "source-uctodayxr",
  },
  virtualrealitynews: {
    name: "Virtual Reality News",
    color: "#2dd4bf",
    lightColor: "#0D9488",
    cssClass: "source-virtualrealitynews",
  },
  vrorg: {
    name: "VR.org",
    color: "#00e5ff",
    lightColor: "#0891B2",
    cssClass: "source-vrorg",
  },
};

export const CATEGORIES = [
  { key: "all", label: "All" },
  { key: "hardware", label: "Hardware" },
  { key: "gaming", label: "Gaming" },
  { key: "software", label: "Software" },
  { key: "enterprise", label: "Enterprise" },
  { key: "ar", label: "AR / Spatial" },
  { key: "xr", label: "XR" },
] as const;

export const COMPANY_FILTERS = [
  { key: "meta", label: "Meta" },
  { key: "apple", label: "Apple" },
  { key: "valve", label: "Valve / Steam" },
  { key: "sony", label: "Sony / PSVR" },
] as const;

export const MOCK_ARTICLES = [
  {
    id: "1",
    source: "roadtovr",
    sourceName: "Road to VR",
    title: "Loading latest VR news...",
    snippet: "Fetching the latest headlines from our sources. This usually takes a few seconds.",
    link: "https://www.roadtovr.com",
    author: null,
    pubDate: new Date(Date.now() - 1 * 3600000).toISOString(),
    category: "hardware",
    tags: ["hardware"],
    imageUrl: null,
  },
];

export const MOCK_TRENDING = [
  { topic: "Steam Frame", count: 24, sources: 6 },
  { topic: "Apple Vision Pro 2", count: 19, sources: 5 },
  { topic: "Horizon Worlds", count: 15, sources: 4 },
  { topic: "PSVR 2 Jailbreak", count: 12, sources: 3 },
  { topic: "Quest Usage Record", count: 11, sources: 4 },
  { topic: "AWE 2026", count: 8, sources: 3 },
  { topic: "Little Nightmares VR", count: 7, sources: 2 },
  { topic: "Lynx Liquidation", count: 6, sources: 3 },
];
