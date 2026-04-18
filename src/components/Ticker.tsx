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
      className="border-b overflow-hidden h-9 items-center hidden md:flex backdrop-blur-md"
      style={{
        background: "var(--surface-glass)",
        borderColor: "var(--hairline)",
      }}
    >
      <div
        className="ticker-label flex-shrink-0 px-3.5 font-mono text-[10px] font-bold uppercase tracking-[2px] h-full flex items-center"
        style={{
          color: "var(--bg-ink)",
          background: "var(--accent-cyan)",
          boxShadow: "4px 0 12px rgba(var(--bg-0-rgb), 0.9)",
        }}
      >
        Trending
      </div>
      <div className="flex-1 overflow-hidden relative">
        <div className="ticker-content flex gap-8 whitespace-nowrap pl-6">
          {allItems.map((article, i) => {
            const src = SOURCES[article.source];
            return (
              <span
                key={`${article.id}-${i}`}
                className="text-xs flex-shrink-0 flex items-center gap-8"
                style={{ color: "var(--text-secondary)" }}
              >
                <span>
                  <span className="font-semibold" style={{ color: src?.color || "var(--accent-cyan)" }}>
                    {article.sourceName}
                  </span>
                  {" "}
                  {article.title}
                </span>
                <span
                  className="text-[8px] opacity-30"
                  style={{ color: "var(--text-muted)" }}
                >
                  &#9679;
                </span>
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
