import { NextRequest } from "next/server";
import { getCache, startFeedEngine } from "@/lib/rss/engine";
import { getAllArticles } from "@/lib/articles";
import {
  premiumResponse,
  premiumValidationFailure,
  preflight,
} from "@/lib/agent-payments/premium";
import { sanitizeText, clipText } from "@/lib/agent-payments/sanitize";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ENDPOINT = "/api/premium/news/search";
const COST_CREDITS = 5;
const DEFAULT_LIMIT = 25;
const MAX_LIMIT = 100;

startFeedEngine();

interface SearchHit {
  id: string;
  source: string;
  source_name: string;
  origin: "rss" | "original";
  title: string;
  snippet: string;
  link: string;
  pub_date: string;
  category: string;
  tags: string[];
  match_score: number;
}

export function OPTIONS() {
  return preflight();
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const q = (searchParams.get("q") || "").trim();
  const category = (searchParams.get("category") || "").trim().toLowerCase();
  const source = (searchParams.get("source") || "").trim().toLowerCase();
  const sinceRaw = (searchParams.get("since") || "").trim();
  const limitRaw = parseInt(searchParams.get("limit") || "", 10);

  if (!q) {
    return premiumValidationFailure(
      request,
      ENDPOINT,
      COST_CREDITS,
      "Missing required query parameter: q (search keyword, 2-200 chars).",
    );
  }
  if (q.length < 2 || q.length > 200) {
    return premiumValidationFailure(
      request,
      ENDPOINT,
      COST_CREDITS,
      "Query parameter q must be 2-200 chars.",
    );
  }
  if (sinceRaw) {
    const since = Date.parse(sinceRaw);
    if (!Number.isFinite(since)) {
      return premiumValidationFailure(
        request,
        ENDPOINT,
        COST_CREDITS,
        "Invalid since parameter: must be a parseable ISO 8601 date.",
      );
    }
  }
  const limit = Number.isFinite(limitRaw)
    ? Math.min(MAX_LIMIT, Math.max(1, limitRaw))
    : DEFAULT_LIMIT;

  return premiumResponse({
    endpoint: ENDPOINT,
    cost: COST_CREDITS,
    request,
    handler: async () => {
      const cache = getCache();
      const originals = getAllArticles();
      const sinceTime = sinceRaw ? Date.parse(sinceRaw) : null;
      const needle = q.toLowerCase();

      const rssHits: SearchHit[] = [];
      for (const a of cache.articles) {
        if (category && a.category !== category && !a.tags.includes(category))
          continue;
        if (source && a.source.toLowerCase() !== source) continue;
        if (sinceTime !== null) {
          const pub = Date.parse(a.pubDate);
          if (Number.isFinite(pub) && pub < sinceTime) continue;
        }
        const title = (a.title || "").toLowerCase();
        const snip = (a.snippet || "").toLowerCase();
        const titleHit = title.includes(needle);
        const snipHit = snip.includes(needle);
        if (!titleHit && !snipHit) continue;
        rssHits.push({
          id: a.id,
          source: a.source,
          source_name: a.sourceName,
          origin: "rss",
          title: clipText(sanitizeText(a.title), 200),
          snippet: clipText(sanitizeText(a.snippet), 320),
          link: a.link,
          pub_date: a.pubDate,
          category: a.category,
          tags: a.tags,
          match_score: titleHit ? 2 : 1,
        });
      }

      const originalHits: SearchHit[] = [];
      for (const o of originals) {
        if (category && o.category !== category && !o.tags.includes(category))
          continue;
        if (source && "vrorg" !== source) continue;
        if (sinceTime !== null) {
          const pub = Date.parse(o.publishDate);
          if (Number.isFinite(pub) && pub < sinceTime) continue;
        }
        const title = (o.title || "").toLowerCase();
        const snip = (o.snippet || "").toLowerCase();
        const titleHit = title.includes(needle);
        const snipHit = snip.includes(needle);
        if (!titleHit && !snipHit) continue;
        originalHits.push({
          id: `vrorg-${o.id}`,
          source: "vrorg",
          source_name: "VR.org Original",
          origin: "original",
          title: clipText(sanitizeText(o.title), 200),
          snippet: clipText(sanitizeText(o.snippet), 320),
          link: `https://vr.org/articles/${o.slug}`,
          pub_date: new Date(o.publishDate).toISOString(),
          category: o.category,
          tags: o.tags,
          match_score: titleHit ? 3 : 2,
        });
      }

      const all = [...originalHits, ...rssHits].sort((a, b) => {
        if (b.match_score !== a.match_score) {
          return b.match_score - a.match_score;
        }
        return (
          new Date(b.pub_date).getTime() - new Date(a.pub_date).getTime()
        );
      });

      return {
        source: "vrorg-premium",
        endpoint: ENDPOINT,
        query: {
          q,
          category: category || null,
          source: source || null,
          since: sinceRaw || null,
          limit,
        },
        total_matches: all.length,
        returned: Math.min(all.length, limit),
        results: all.slice(0, limit),
        captured_at: cache.lastUpdated || new Date().toISOString(),
        generated_at: new Date().toISOString(),
      };
    },
  });
}
