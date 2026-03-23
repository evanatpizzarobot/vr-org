"use client";

import { useState, useCallback, useMemo } from "react";
import type { Article } from "@/types";

export function useFilters(articles: Article[]) {
  const [activeFilter, setActiveFilter] = useState("all");

  const filtered = useMemo(() => {
    if (activeFilter === "all") return articles;
    return articles.filter(
      (a) => a.category === activeFilter || a.tags.includes(activeFilter)
    );
  }, [articles, activeFilter]);

  const setFilter = useCallback((filter: string) => {
    setActiveFilter(filter);
  }, []);

  return { activeFilter, filtered, setFilter };
}
