"use client";

import type { TrendingTopic } from "@/types";

interface TrendingTopicsProps {
  topics: TrendingTopic[];
}

export function TrendingTopics({ topics }: TrendingTopicsProps) {
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

      {topics.map((t, i) => (
        <div
          key={t.topic}
          className="flex items-baseline gap-2.5 py-2"
          style={{ borderBottom: "1px solid color-mix(in srgb, var(--border) 50%, transparent)" }}
        >
          <span className="font-mono text-[11px] w-[18px] flex-shrink-0" style={{ color: "var(--text-muted)" }}>
            {i + 1}.
          </span>
          <span className="text-[13px] font-medium" style={{ color: "var(--text-primary)" }}>
            {t.topic}
          </span>
          <span
            className="font-mono text-[10px] ml-auto flex-shrink-0"
            style={{ color: "var(--accent-cyan)" }}
          >
            {t.count} mentions
          </span>
        </div>
      ))}
    </div>
  );
}
