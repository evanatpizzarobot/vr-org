"use client";

import type { Article } from "@/types";
import { SOURCES } from "@/lib/constants";

interface TickerProps {
  articles: Article[];
}

export function Ticker({ articles }: TickerProps) {
  const items = articles.slice(0, 10);

  if (items.length === 0) return null;

  // Duplicate for seamless loop
  const allItems = [...items, ...items];

  return (
    <div
      className="border-b overflow-hidden h-9 items-center hidden md:flex"
      style={{ background: "var(--ticker-bg)", borderColor: "var(--border)" }}
    >
      <div
        className="flex-shrink-0 px-3.5 font-mono text-[10px] font-medium uppercase tracking-[2px] border-r h-full flex items-center"
        style={{
          color: "var(--accent-cyan)",
          borderColor: "var(--border)",
          background: "var(--accent-cyan-dim)",
        }}
      >
        Trending
      </div>
      <div className="flex-1 overflow-hidden relative">
        <div className="ticker-content flex gap-12 whitespace-nowrap pl-6">
          {allItems.map((article, i) => {
            const src = SOURCES[article.source];
            return (
              <span
                key={`${article.id}-${i}`}
                className="text-xs flex-shrink-0"
                style={{ color: "var(--text-secondary)" }}
              >
                <span className="font-semibold" style={{ color: src?.color || "var(--accent-cyan)" }}>
                  {article.sourceName}:
                </span>{" "}
                {article.title}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
