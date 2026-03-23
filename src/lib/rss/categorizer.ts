const CATEGORY_RULES: Record<string, string[]> = {
  hardware: [
    "headset", "glasses", "hmd", "controller", "haptic", "display", "lens",
    "fov", "resolution", "refresh rate", "passthrough", "tracking", "sensor",
    "chip", "processor", "gpu", "teardown", "specs", "weight", "comfort",
    "strap", "battery", "standalone", "wired", "wireless",
  ],
  gaming: [
    "game", "games", "gaming", "gameplay", "trailer", "launch", "release date",
    "early access", "steam", "quest store", "psvr", "mod", "modding", "esports",
    "multiplayer", "co-op", "singleplayer", "studio", "developer", "publisher",
    "dlc", "update", "patch",
  ],
  software: [
    "app", "application", "platform", "sdk", "api", "framework", "engine",
    "unity", "unreal", "openxr", "webxr", "browser", "os", "firmware",
    "feature", "tool", "creator", "social", "avatar", "workspace",
  ],
  enterprise: [
    "enterprise", "business", "industry", "training", "healthcare", "medical",
    "education", "manufacturing", "retail", "architecture", "simulation",
    "digital twin", "remote", "collaboration", "productivity", "investment",
    "funding", "acquisition", "market", "revenue", "earnings", "report", "analyst",
  ],
  ar: [
    "augmented reality", "ar ", "ar,", "spatial computing", "mixed reality",
    "smart glasses", "hologram", "holographic", "overlay", "pass-through",
    "passthrough", "xr", "vision pro", "hololens", "magic leap", "nreal",
    "xreal", "ray-ban meta",
  ],
};

const COMPANY_TAGS: Record<string, string[]> = {
  meta: ["meta", "quest", "oculus", "horizon", "reality labs", "ray-ban", "bosworth", "zuckerberg"],
  apple: ["apple", "vision pro", "visionos", "spatial computing", "apple glass"],
  valve: ["valve", "steam", "steam vr", "steamvr", "steam frame", "index", "half-life", "gaben"],
  sony: ["sony", "psvr", "playstation vr", "ps vr", "playstation"],
};

export function categorize(title: string, description: string): string {
  const text = `${title} ${description}`.toLowerCase();
  let bestCategory = "software";
  let bestScore = 0;

  for (const [category, keywords] of Object.entries(CATEGORY_RULES)) {
    let score = 0;
    for (const keyword of keywords) {
      if (text.includes(keyword)) score++;
    }
    if (score > bestScore) {
      bestScore = score;
      bestCategory = category;
    }
  }

  return bestCategory;
}

export function getCompanyTags(title: string, description: string): string[] {
  const text = `${title} ${description}`.toLowerCase();
  const tags: string[] = [];

  for (const [company, keywords] of Object.entries(COMPANY_TAGS)) {
    for (const keyword of keywords) {
      if (text.includes(keyword)) {
        tags.push(company);
        break;
      }
    }
  }

  return tags;
}
