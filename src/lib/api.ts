import type { FeedResponse, TrendingResponse, SourcesResponse } from "@/types";

const API_BASE =
  process.env.NEXT_PUBLIC_WORKER_URL || "https://vr-org-feed-worker.workers.dev";

export async function fetchFeed(params?: {
  category?: string;
  tag?: string;
  limit?: number;
  offset?: number;
}): Promise<FeedResponse> {
  const url = new URL(`${API_BASE}/api/feed`);
  if (params?.category && params.category !== "all")
    url.searchParams.set("category", params.category);
  if (params?.tag) url.searchParams.set("tag", params.tag);
  if (params?.limit) url.searchParams.set("limit", String(params.limit));
  if (params?.offset) url.searchParams.set("offset", String(params.offset));

  const res = await fetch(url.toString(), { next: { revalidate: 300 } });
  if (!res.ok) throw new Error("Failed to fetch feed");
  return res.json();
}

export async function fetchTrending(): Promise<TrendingResponse> {
  const res = await fetch(`${API_BASE}/api/trending`, {
    next: { revalidate: 300 },
  });
  if (!res.ok) throw new Error("Failed to fetch trending");
  return res.json();
}

export async function fetchSources(): Promise<SourcesResponse> {
  const res = await fetch(`${API_BASE}/api/sources`, {
    next: { revalidate: 300 },
  });
  if (!res.ok) throw new Error("Failed to fetch sources");
  return res.json();
}
