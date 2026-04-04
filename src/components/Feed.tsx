"use client";

import { useState } from "react";
import type { Article } from "@/types";
import { ArticleCard } from "./ArticleCard";
import { AdSlot } from "./AdSlot";
import { LoadingSkeleton } from "./LoadingSkeleton";

interface FeedProps {
  articles: Article[];
  loading?: boolean;
}

export function Feed({ articles, loading }: FeedProps) {
  const [view, setView] = useState<"full" | "compact">("full");
  const compact = view === "compact";

  return (
    <div className="flex flex-col gap-0.5">
      {/* Animated gradient divider */}
      <div className="section-divider-animated mb-2 rounded-full" />
      {/* Feed header */}
      <div className="flex items-center justify-between py-4 pb-3">
        <span
          className="font-display text-[13px] font-semibold uppercase tracking-[2px]"
          style={{ color: "var(--text-secondary)" }}
        >
          Latest Headlines
        </span>
        <div
          className="flex gap-1 rounded-md p-0.5 border"
          style={{ background: "var(--bg-secondary)", borderColor: "var(--border)" }}
        >
          <button
            onClick={() => setView("full")}
            className="text-[11px] font-medium px-3 py-1 rounded transition-all"
            style={{
              background: view === "full" ? "var(--bg-card)" : "transparent",
              color: view === "full" ? "var(--text-primary)" : "var(--text-muted)",
            }}
          >
            Full
          </button>
          <button
            onClick={() => setView("compact")}
            className="text-[11px] font-medium px-3 py-1 rounded transition-all"
            style={{
              background: view === "compact" ? "var(--bg-card)" : "transparent",
              color: view === "compact" ? "var(--text-primary)" : "var(--text-muted)",
            }}
          >
            Compact
          </button>
        </div>
      </div>

      {/* Loading state */}
      {loading && <LoadingSkeleton count={5} />}

      {/* Articles */}
      {!loading &&
        articles.map((article, i) => (
          <div key={article.id}>
            {i > 0 && i % 6 === 0 && <AdSlot inline />}
            <ArticleCard article={article} compact={compact} index={i} />
          </div>
        ))}

      {/* Empty state */}
      {!loading && articles.length === 0 && (
        <div
          className="text-center py-16 text-sm"
          style={{ color: "var(--text-muted)" }}
        >
          No articles match this filter.
        </div>
      )}
    </div>
  );
}
