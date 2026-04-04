"use client";

import type { TrendingTopic } from "@/types";

interface TrendingTopicsProps {
  topics: TrendingTopic[];
}

export function TrendingTopics({ topics }: TrendingTopicsProps) {
  const maxCount = Math.max(...topics.map((t) => t.count), 1);

  return (
    <div
      className="rounded-[10px] border p-5"
      style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
    >
      <div
        className="font-display text-xs font-semibold uppercase tracking-[2px] mb-4 flex items-center gap-2"
        style={{ color: "var(--text-secondary)" }}
      >
        <span className="text-sm">🔥</span> Trending Topics
      </div>

      {topics.map((t, i) => {
        const barWidth = Math.round((t.count / maxCount) * 100);
        const isTop = i === 0;
        return (
          <div
            key={t.topic}
            className="trending-item flex items-baseline gap-2.5 py-2 relative"
            style={{ borderBottom: "1px solid color-mix(in srgb, var(--border) 50%, transparent)" }}
          >
            {/* Mini popularity bar */}
            <div
              className="trending-bar"
              style={{
                width: `${barWidth}%`,
                background: isTop ? "var(--cat-enterprise)" : "var(--accent-cyan)",
              }}
            />
            <span
              className={`font-mono text-[11px] w-[18px] flex-shrink-0 relative ${isTop ? "trending-rank-gold" : ""}`}
              style={isTop ? undefined : { color: "var(--text-muted)" }}
            >
              {i + 1}.
            </span>
            <span
              className="text-[13px] font-medium relative"
              style={{ color: "var(--text-primary)" }}
            >
              {isTop && (
                <span style={{ color: "var(--cat-enterprise)", marginRight: 4, fontSize: 10 }}>&#9650;</span>
              )}
              {t.topic}
            </span>
            <span
              className="font-mono text-[10px] ml-auto flex-shrink-0 relative"
              style={{ color: "var(--accent-cyan)" }}
            >
              {t.count} mentions
            </span>
          </div>
        );
      })}
    </div>
  );
}
