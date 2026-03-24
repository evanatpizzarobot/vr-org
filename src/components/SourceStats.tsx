"use client";

import { SOURCES } from "@/lib/constants";

interface SourceStatsProps {
  stats: Record<string, { name: string; count: number }>;
}

export function SourceStats({ stats }: SourceStatsProps) {
  const entries = Object.entries(stats).sort((a, b) => b[1].count - a[1].count);
  const max = entries.length > 0 ? entries[0][1].count : 1;

  return (
    <div
      className="rounded-[10px] border p-5"
      style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
    >
      <div
        className="font-display text-xs font-semibold uppercase tracking-[2px] mb-4 flex items-center gap-2"
        style={{ color: "var(--text-secondary)" }}
      >
        <span className="text-sm">📡</span> Sources
      </div>

      {entries.map(([key, { name, count }]) => {
        const src = SOURCES[key];
        const pct = Math.max((count / max) * 100, 2);
        return (
          <div
            key={key}
            className="py-2.5"
            style={{ borderBottom: "1px solid color-mix(in srgb, var(--border) 50%, transparent)" }}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[12px] font-medium" style={{ color: "var(--text-primary)" }}>
                {name}
              </span>
              <span className="font-mono text-[11px]" style={{ color: "var(--text-muted)" }}>
                {count}
              </span>
            </div>
            <div
              className="w-full h-[3px] rounded-full overflow-hidden"
              style={{ background: "var(--border)" }}
            >
              <div
                className="h-full rounded-full transition-all duration-600"
                style={{
                  width: `${pct}%`,
                  background: src?.color || "var(--accent-cyan)",
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
