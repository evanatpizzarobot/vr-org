"use client";

import { useState, useEffect, useCallback } from "react";
import type { Article, TrendingTopic } from "@/types";

interface SourceStats {
  [key: string]: { name: string; count: number };
}

export function useFeed() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [trending, setTrending] = useState<TrendingTopic[]>([]);
  const [sourceStats, setSourceStats] = useState<SourceStats>({});
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const [feedRes, trendingRes, sourcesRes] = await Promise.all([
        fetch("/api/feed"),
        fetch("/api/trending"),
        fetch("/api/sources"),
      ]);

      if (feedRes.ok) {
        const feedData = await feedRes.json();
        setArticles(feedData.articles);
        setLastUpdated(feedData.meta.lastUpdated);
      }

      if (trendingRes.ok) {
        const trendingData = await trendingRes.json();
        setTrending(trendingData.topics);
      }

      if (sourcesRes.ok) {
        const sourcesData = await sourcesRes.json();
        setSourceStats(sourcesData.sources);
      }

      setError(null);
    } catch {
      setError("Failed to fetch feed data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();

    // Retry quickly if we got no real data (feeds still loading server-side)
    let retryCount = 0;
    const retryInterval = setInterval(() => {
      retryCount++;
      if (retryCount >= 6) {
        clearInterval(retryInterval);
        return;
      }
      fetchData();
    }, 5000);

    // Poll every 5 minutes for fresh data
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => {
      clearInterval(retryInterval);
      clearInterval(interval);
    };
  }, [fetchData]);

  return { articles, trending, sourceStats, lastUpdated, loading, error, refetch: fetchData };
}
