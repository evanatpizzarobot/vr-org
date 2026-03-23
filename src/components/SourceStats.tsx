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
        const pct = (count / max) * 100;
        return (
          <div
            key={key}
            className="flex items-center justify-between py-2"
            style={{ borderBottom: "1px solid color-mix(in srgb, var(--border) 50%, transparent)" }}
          >
            <span className="text-[13px] font-medium" style={{ color: "var(--text-primary)" }}>
              {name}
            </span>
            <div
              className="flex-1 max-w-[80px] h-[3px] rounded-sm mx-3 overflow-hidden"
              style={{ background: "var(--border)" }}
            >
              <div
                className="h-full rounded-sm transition-all duration-600"
                style={{
                  width: `${pct}%`,
                  background: src?.color || "var(--accent-cyan)",
                }}
              />
            </div>
            <span className="font-mono text-[11px]" style={{ color: "var(--text-muted)" }}>
              {count}
            </span>
          </div>
        );
      })}
    </div>
  );
}
