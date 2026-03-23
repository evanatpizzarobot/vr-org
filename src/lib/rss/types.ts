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
  status: "ok" | "error";
}

export interface FeedCache {
  articles: Article[];
  trending: TrendingTopic[];
  sources: Record<string, SourceMeta>;
  lastUpdated: string;
}

export interface RSSSource {
  key: string;
  name: string;
  url: string;
  priority: "primary" | "secondary";
}
