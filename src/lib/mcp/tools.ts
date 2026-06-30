// Tool implementations for the VR.org remote MCP endpoint (/mcp).
//
// These mirror the published npm server (vr-org-mcp) but run INSIDE the Next
// app, so they read the live data layer directly (the in-memory RSS engine,
// the editorial store, and the data/*.json files) instead of round-tripping
// through /api. One bonus over the npm version: get_vr_article returns the
// full article body, not just metadata.
//
// Every tool is read-only. Output is sanitized (control / direction-override
// characters stripped) and capped at 50 KB so a malicious third-party RSS
// headline cannot inject content into, or flood, the calling agent.

import fs from "fs";
import path from "path";
import { getCache } from "@/lib/rss/engine";
import { getAllArticles, getArticleBySlug } from "@/lib/articles";

const BASE = "https://vr.org";

export const MCP_CATEGORIES = [
  "hardware",
  "gaming",
  "software",
  "enterprise",
  "ar",
  "xr",
] as const;

// ---------- safety ----------

const CONTROL_CHARS = new RegExp(
  "[\\u0000-\\u0008\\u000B\\u000C\\u000E-\\u001F\\u007F-\\u009F]",
  "g",
);
const ZERO_WIDTH = new RegExp(
  "[\\u200B-\\u200F\\u202A-\\u202E\\u2060-\\u2064\\uFEFF]",
  "g",
);
const MAX_STRING = 8192;
const MAX_RESPONSE_BYTES = 50_000;

function sanitizeString(input: string, max = MAX_STRING): string {
  let out = input.replace(CONTROL_CHARS, "").replace(ZERO_WIDTH, "");
  if (out.length > max) out = out.slice(0, max - 14) + "...[truncated]";
  return out;
}

function sanitizeValue(input: unknown, depth = 0): unknown {
  if (depth > 32) return "[max-depth-exceeded]";
  if (input === null || input === undefined) return null;
  if (typeof input === "string") return sanitizeString(input);
  if (typeof input === "number" || typeof input === "boolean") return input;
  if (typeof input === "bigint") return input.toString();
  if (Array.isArray(input)) return input.slice(0, 1000).map((v) => sanitizeValue(v, depth + 1));
  if (typeof input === "object") {
    const out: Record<string, unknown> = {};
    let count = 0;
    for (const [k, v] of Object.entries(input)) {
      if (count >= 200) break;
      out[sanitizeString(k, 128)] = sanitizeValue(v, depth + 1);
      count++;
    }
    return out;
  }
  return "[unsupported-type]";
}

/** Sanitize, cap, and wrap a result object as an MCP text-content response. */
export function formatResult(value: unknown) {
  const sanitized = sanitizeValue(value);
  let serialized = JSON.stringify(sanitized);
  if (serialized.length > MAX_RESPONSE_BYTES) {
    serialized = JSON.stringify({
      ok: false,
      error: "response_too_large",
      limit_bytes: MAX_RESPONSE_BYTES,
      actual_bytes: serialized.length,
      hint: "Narrow the request (smaller limit, a single category, or a more specific query).",
    });
  }
  return { content: [{ type: "text" as const, text: serialized }] };
}

// ---------- helpers ----------

function absoluteUrl(link: unknown): string | null {
  if (typeof link !== "string" || link.length === 0) return null;
  if (/^https?:\/\//i.test(link)) return link;
  return BASE + (link.startsWith("/") ? link : "/" + link);
}

function normalizeCategory(category?: string): string | undefined {
  if (!category || category === "all") return undefined;
  const c = category.toLowerCase();
  return (MCP_CATEGORIES as readonly string[]).includes(c) ? c : undefined;
}

function clampLimit(limit: number | undefined, fallback: number, max: number): number {
  if (typeof limit !== "number" || !Number.isFinite(limit) || limit < 1) return fallback;
  return Math.min(Math.floor(limit), max);
}

function readJson(file: string): unknown {
  try {
    const abs = path.join(process.cwd(), "data", file);
    if (!fs.existsSync(abs)) return null;
    return JSON.parse(fs.readFileSync(abs, "utf-8"));
  } catch {
    return null;
  }
}

// ---------- tools ----------

export function searchVrNews(args: { query?: string; category?: string; limit?: number }) {
  const category = normalizeCategory(args.category);
  const query = typeof args.query === "string" ? args.query.trim().toLowerCase() : "";
  const limit = clampLimit(args.limit, 20, 50);
  const cache = getCache();

  const editorialItems = getAllArticles().map((a) => ({
    title: a.title,
    source: "VR.org",
    url: `${BASE}/articles/${a.slug}`,
    author: a.author,
    published: new Date(a.publishDate).toISOString(),
    category: a.category,
    tags: a.tags,
    snippet: a.snippet,
  }));

  const rssItems = (cache.articles ?? []).map((a) => ({
    title: a.title,
    source: a.sourceName ?? a.source ?? null,
    url: absoluteUrl(a.link),
    author: a.author ?? null,
    published: a.pubDate ?? null,
    category: a.category ?? null,
    tags: Array.isArray(a.tags) ? a.tags : [],
    snippet: a.snippet ?? null,
  }));

  let items = [...editorialItems, ...rssItems];
  if (category) {
    items = items.filter((a) => a.category === category || (a.tags ?? []).includes(category));
  }
  if (query) {
    items = items.filter((a) => `${a.title ?? ""} ${a.snippet ?? ""}`.toLowerCase().includes(query));
  }
  items.sort((a, b) => new Date(b.published ?? 0).getTime() - new Date(a.published ?? 0).getTime());

  return {
    ok: true,
    query: query || null,
    category: category ?? "all",
    count: Math.min(items.length, limit),
    last_updated: cache.lastUpdated ?? null,
    articles: items.slice(0, limit),
    source: BASE,
  };
}

export function getVrTrending() {
  const cache = getCache();
  return {
    ok: true,
    updated_at: cache.lastUpdated ?? null,
    topics: Array.isArray(cache.trending) ? cache.trending : [],
    source: BASE,
  };
}

export function listVrOriginals(args: { category?: string; limit?: number }) {
  const category = normalizeCategory(args.category);
  const limit = clampLimit(args.limit, 15, 50);
  let articles = getAllArticles();
  if (category) {
    articles = articles.filter((a) => a.category === category || a.tags.includes(category));
  }
  const items = articles.slice(0, limit).map((a) => ({
    title: a.title,
    slug: a.slug,
    url: `${BASE}/articles/${a.slug}`,
    author: a.author,
    authorRole: a.authorRole,
    published: a.publishDate,
    category: a.category,
    tags: a.tags,
    snippet: a.snippet,
  }));
  return { ok: true, category: category ?? "all", count: items.length, total: articles.length, articles: items, source: BASE };
}

export function getVrArticle(args: { slug: string }) {
  const slug = typeof args.slug === "string" ? args.slug.trim().toLowerCase() : "";
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    return { ok: false, error: "invalid_slug", hint: "Use a kebab-case slug from list_vr_originals." };
  }
  const a = getArticleBySlug(slug);
  if (!a) {
    return { ok: false, error: "article_not_found", slug, hint: "Call list_vr_originals to see available slugs." };
  }
  return {
    ok: true,
    article: {
      title: a.title,
      slug: a.slug,
      url: `${BASE}/articles/${a.slug}`,
      author: a.author,
      authorRole: a.authorRole,
      published: a.publishDate,
      updated: a.updatedDate,
      category: a.category,
      tags: a.tags,
      snippet: a.snippet,
      body_html: a.body,
    },
    source: BASE,
  };
}

interface DealItem {
  name?: string;
  price?: string;
  description?: string;
  badge?: string;
  links?: Record<string, { url?: string; label?: string }>;
}
interface DealSection {
  id?: string;
  title?: string;
  description?: string;
  items?: DealItem[];
}

function mapDealItem(it: DealItem) {
  const links = it.links
    ? Object.entries(it.links).map(([k, v]) => ({ retailer: v?.label ?? k, url: v?.url ?? null }))
    : [];
  return { name: it.name ?? null, price: it.price ?? null, badge: it.badge ?? null, description: it.description ?? null, links };
}

function dealsData(): { lastUpdated?: string; disclosure?: string; sections: DealSection[] } {
  const raw = readJson("deals.json") as { lastUpdated?: string; disclosure?: string; sections?: DealSection[] } | null;
  return { lastUpdated: raw?.lastUpdated, disclosure: raw?.disclosure, sections: Array.isArray(raw?.sections) ? raw!.sections : [] };
}

export function getVrDeals(args: { section?: string }) {
  const { lastUpdated, disclosure, sections } = dealsData();
  const filter = typeof args.section === "string" ? args.section.trim().toLowerCase() : "";
  let out = sections;
  if (filter) {
    out = sections.filter((s) => (s.id ?? "").toLowerCase() === filter || (s.title ?? "").toLowerCase().includes(filter));
  }
  return {
    ok: true,
    last_updated: lastUpdated ?? null,
    disclosure: disclosure ?? null,
    sections: out.map((s) => ({
      id: s.id ?? null,
      title: s.title ?? null,
      description: s.description ?? null,
      items: Array.isArray(s.items) ? s.items.map(mapDealItem) : [],
    })),
    source: `${BASE}/deals`,
  };
}

const HEADSET_ALIASES: Array<[RegExp, string]> = [
  [/^ps\s*vr\s*2$|^psvr2$/i, "playstation vr2"],
  [/^avp$|^vision\s*pro$/i, "apple vision pro"],
  [/^galaxy\s*xr$|^moohan$/i, "samsung galaxy xr"],
  [/^beyond\s*2?$/i, "bigscreen beyond"],
  [/^pimax/i, "pimax crystal"],
  [/^vive\s*xr/i, "htc vive xr"],
];

function matchHeadset(names: string[], query: string): number | null {
  let q = query.trim().toLowerCase();
  for (const [re, canonical] of HEADSET_ALIASES) if (re.test(q)) q = canonical;
  let bestIdx = -1, bestScore = 0, bestLen = Infinity;
  for (let i = 0; i < names.length; i++) {
    const name = (names[i] ?? "").toLowerCase();
    let score = 0;
    if (name === q) score = 1000;
    else {
      const at = name.indexOf(q);
      if (at >= 0) {
        const after = name[at + q.length];
        score = after === undefined || !/[a-z0-9]/.test(after) ? 100 : 50;
      } else continue;
    }
    if (score > bestScore || (score === bestScore && name.length < bestLen)) {
      bestIdx = i; bestScore = score; bestLen = name.length;
    }
  }
  return bestIdx >= 0 ? bestIdx : null;
}

export function compareVrHeadsets(args: { a: string; b: string }) {
  const a = typeof args.a === "string" ? args.a.trim() : "";
  const b = typeof args.b === "string" ? args.b.trim() : "";
  if (!a || !b) return { ok: false, error: "two_headsets_required" };
  const { sections } = dealsData();
  const headsetItems = sections
    .filter((s) => (s.id ?? "").toLowerCase().includes("headset") || (s.title ?? "").toLowerCase().includes("headset"))
    .flatMap((s) => (Array.isArray(s.items) ? s.items : []));
  const pool = headsetItems.length > 0 ? headsetItems : sections.flatMap((s) => s.items ?? []);
  const names = pool.map((it) => it.name ?? "");
  const ia = matchHeadset(names, a);
  const ib = matchHeadset(names, b);
  const hitA = ia === null ? null : pool[ia];
  const hitB = ib === null ? null : pool[ib];
  if (!hitA || !hitB) {
    return {
      ok: false,
      error: "headset_not_found",
      missing: [!hitA ? a : null, !hitB ? b : null].filter(Boolean),
      available: names.filter(Boolean),
      hint: "Use one of the available names (partial match is allowed).",
    };
  }
  return {
    ok: true,
    comparison: [mapDealItem(hitA), mapDealItem(hitB)],
    related_guide: `${BASE}/best-vr-headsets`,
    source: `${BASE}/deals`,
  };
}

function topList(key: string) {
  const raw = readJson("top-lists.json") as { lists?: Record<string, unknown> } | Record<string, unknown> | null;
  if (!raw) return null;
  // top-lists.json is a flat object keyed by list id (see data/top-lists.json)
  const lists = (raw as { lists?: Record<string, unknown> }).lists ?? (raw as Record<string, unknown>);
  return (lists as Record<string, unknown>)[key] ?? null;
}

export function getTopVrGames() {
  return { ok: true, list: topList("top-vr-games-2026") ?? { title: "Top VR Games 2026", items: [] }, guide: `${BASE}/best-vr-games-2026`, source: BASE };
}

export function getTopVrApps() {
  return { ok: true, list: topList("top-vr-apps") ?? { title: "Top VR Apps & Utilities", items: [] }, guide: `${BASE}/best-vr-apps`, source: BASE };
}

export function listVrSources() {
  const cache = getCache();
  const sources = { ...(cache.sources ?? {}) };
  const editorialCount = getAllArticles().length;
  if (editorialCount > 0) {
    sources.vrorg = { name: "VR.org", count: editorialCount, lastFetched: new Date().toISOString(), status: "ok" };
  }
  return { ok: true, count: Object.keys(sources).length, sources, source: BASE };
}

interface Explainer { keys: string[]; title: string; path: string; summary: string; }
const EXPLAINERS: Explainer[] = [
  { keys: ["what is vr", "virtual reality", "vr basics", "vr meaning"], title: "What Is Virtual Reality?", path: "/what-is-vr", summary: "Virtual reality is a computer-generated, fully immersive environment experienced through a head-mounted display that tracks your head and hands, replacing your view of the real world with a simulated one. Standalone headsets like the Meta Quest run VR with no PC." },
  { keys: ["best headset", "which headset", "best vr headset", "what headset", "buy a headset"], title: "Best VR Headsets", path: "/best-vr-headsets", summary: "The best all-around VR headset for most people is the Meta Quest 3, with the cheaper Quest 3S as the value pick. The PlayStation VR2 stands out for PS5 owners, and the Apple Vision Pro and Samsung Galaxy XR sit at the premium spatial-computing end." },
  { keys: ["best games", "best vr games", "what to play", "top vr games", "vr games"], title: "Best VR Games", path: "/best-vr-games", summary: "VR's must-play canon includes Half-Life: Alyx, Beat Saber, the Resident Evil titles, Asgard's Wrath 2, and Walkabout Mini Golf. VR.org keeps both an all-time top ten and a current best-of-2026 list." },
  { keys: ["beginner", "beginners", "getting started", "first headset", "new to vr"], title: "VR for Beginners", path: "/vr-for-beginners", summary: "A first-time buyer should start with an affordable standalone headset (the Quest 3S is the usual pick), play comfort-friendly titles to build VR legs, and add a head strap and charging dock only once the basics feel good. No PC or console needed to begin." },
  { keys: ["ar glasses", "smart glasses", "augmented reality glasses", "ray-ban meta", "xreal"], title: "Best AR Glasses", path: "/ar-glasses", summary: "AR and smart glasses range from camera-and-audio frames like Ray-Ban Meta to display glasses like Xreal and Viture that float a large virtual screen in front of you. Everyday consumer AR with world-locked holograms is still emerging." },
  { keys: ["best apps", "vr apps", "utilities", "productivity vr"], title: "Best VR Apps and Utilities", path: "/best-vr-apps", summary: "Beyond games, the most useful VR apps are Virtual Desktop and Steam Link for wireless PC streaming, Immersed and Bigscreen for workspaces and cinema, VRChat for social VR, and Gravity Sketch and ShapesXR for 3D design." },
  { keys: ["fitness", "workout", "exercise", "vr fitness", "supernatural", "fitxr"], title: "Best VR Fitness Apps", path: "/best-vr-fitness", summary: "VR fitness is a credible cardio option, led by Supernatural, FitXR, and Les Mills Bodycombat, plus Beat Saber and Thrill of the Fight for incidental sweat. A sweat-resistant facial interface and a good head strap help with longer sessions." },
  { keys: ["quest 3 vs quest 3s", "quest 3 or 3s", "3s vs 3"], title: "Quest 3 vs Quest 3S", path: "/quest-3-vs-quest-3s", summary: "The Quest 3 has sharper pancake lenses, higher resolution, and more storage; the Quest 3S is cheaper with older Fresnel lenses but the same chip and full game compatibility. Budget buyers are well served by the 3S." },
  { keys: ["quest 3 vs vision pro", "vision pro vs quest", "apple vision pro vs quest"], title: "Quest 3 vs Apple Vision Pro", path: "/quest-3-vs-vision-pro", summary: "The Apple Vision Pro is a far pricier spatial computer with class-leading displays aimed at productivity and media; the Meta Quest 3 is an affordable game-first standalone. They serve different buyers more than they compete." },
  { keys: ["psvr2 vs quest 3", "psvr2 or quest", "playstation vr2 vs quest"], title: "PSVR2 vs Quest 3", path: "/psvr2-vs-quest-3", summary: "The PlayStation VR2 offers OLED HDR, eye tracking, and headset haptics but needs a PS5; the Quest 3 is a self-contained standalone with a bigger library and mixed reality. Your existing console decides this one." },
];

export function vrExplain(args: { topic: string }) {
  const topic = typeof args.topic === "string" ? args.topic.trim() : "";
  if (!topic) return { ok: false, error: "topic_required" };
  const q = topic.toLowerCase();
  let best: { e: Explainer; score: number } | null = null;
  for (const e of EXPLAINERS) {
    for (const k of e.keys) {
      if (q.includes(k) || k.includes(q)) {
        if (!best || k.length > best.score) best = { e, score: k.length };
      }
    }
  }
  if (!best) {
    return { ok: false, error: "no_explainer", topic, available_topics: EXPLAINERS.map((e) => e.title), hint: "Try 'what is vr', 'best headset', or 'ar glasses'." };
  }
  return { ok: true, topic, title: best.e.title, summary: best.e.summary, url: `${BASE}${best.e.path}`, source: BASE };
}
