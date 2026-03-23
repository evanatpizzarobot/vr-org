export interface Article {
  id: string;
  source: string;
  sourceName: string;
  title: string;
  snippet: string;
  link: string;
  author: string | null;
  pubDate: string;
  category: string;
  tags: string[];
  imageUrl: string | null;
}

export interface TrendingTopic {
  topic: string;
  count: number;
  sources: number;
}

export interface SourceMeta {
  name: string;
  count: number;
  lastFetched: string;
  status: "ok" | "error" | "pending";
}

export interface FeedMeta {
  lastUpdated: string;
  totalArticles: number;
  activeSources: number;
}

export interface Env {
  FEED_KV: KVNamespace;
}

export interface RSSSource {
  key: string;
  name: string;
  url: string;
  priority: "primary" | "secondary";
}
