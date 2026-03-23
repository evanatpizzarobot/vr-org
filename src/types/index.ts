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

export interface SourceStat {
  name: string;
  count: number;
  lastFetched: string;
  status: "ok" | "error" | "pending";
}

export interface FeedResponse {
  articles: Article[];
  meta: {
    total: number;
    lastUpdated: string;
  };
}

export interface TrendingResponse {
  topics: TrendingTopic[];
  updatedAt: string;
}

export interface SourcesResponse {
  sources: Record<string, SourceStat>;
  meta: {
    activeSources: number;
    totalArticles: number;
  };
}
