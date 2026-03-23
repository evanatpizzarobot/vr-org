"use client";

import { useState, useEffect, useCallback } from "react";
import type { Article, TrendingTopic } from "@/types";
import { MOCK_ARTICLES, MOCK_TRENDING, SOURCES } from "@/lib/constants";

const API_BASE = process.env.NEXT_PUBLIC_WORKER_URL || "";

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
    // If no worker URL configured, use mock data
    if (!API_BASE) {
      setArticles(MOCK_ARTICLES as Article[]);
      setTrending(MOCK_TRENDING);

      // Compute source stats from mock data
      const counts: Record<string, number> = {};
      MOCK_ARTICLES.forEach((a) => {
        counts[a.source] = (counts[a.source] || 0) + 1;
      });
      const stats: SourceStats = {};
      Object.entries(counts).forEach(([key, count]) => {
        stats[key] = { name: SOURCES[key]?.name || key, count };
      });
      setSourceStats(stats);
      setLastUpdated(new Date().toISOString());
      setLoading(false);
      return;
    }

    try {
      const [feedRes, trendingRes, sourcesRes] = await Promise.all([
        fetch(`${API_BASE}/api/feed`),
        fetch(`${API_BASE}/api/trending`),
        fetch(`${API_BASE}/api/sources`),
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
      // Fall back to mock data on error
      if (articles.length === 0) {
        setArticles(MOCK_ARTICLES as Article[]);
        setTrending(MOCK_TRENDING);
      }
    } finally {
      setLoading(false);
    }
  }, [API_BASE]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchData();
    // Poll every 5 minutes
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchData]);

  return { articles, trending, sourceStats, lastUpdated, loading, error, refetch: fetchData };
}
