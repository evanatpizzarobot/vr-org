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
  status: "ok" | "error" | "disabled";
  consecutiveFailures?: number;
  disabledUntil?: string | null;
  lastError?: string | null;
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
  relevanceFilter?: boolean;
  /**
   * How much of an item counts toward the relevance decision.
   * "summary" (the default) reads the headline plus the opening of the body,
   * which keeps general-tech feeds from sneaking phone deals in on a stray
   * sidebar keyword. "full" reads the whole body, for first-party platform
   * blogs where VR coverage legitimately lives in a section partway down a
   * broader post rather than in the headline.
   */
  relevanceScope?: "summary" | "full";
}
