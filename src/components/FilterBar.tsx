"use client";

import { CATEGORIES, COMPANY_FILTERS } from "@/lib/constants";

interface FilterBarProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  sourceCount: number;
}

export function FilterBar({ activeFilter, onFilterChange, sourceCount }: FilterBarProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap mb-4">
      {CATEGORIES.map((cat) => (
        <button
          key={cat.key}
          onClick={() => onFilterChange(cat.key)}
          className="text-xs font-medium px-3.5 py-1.5 rounded-full border whitespace-nowrap transition-all"
          style={
            activeFilter === cat.key
              ? {
                  background: "var(--accent-cyan)",
                  borderColor: "var(--accent-cyan)",
                  color: "var(--bg-primary)",
                  fontWeight: 600,
                }
              : {
                  background: "transparent",
                  borderColor: "var(--border)",
                  color: "var(--text-secondary)",
                }
          }
        >
          {cat.label}
        </button>
      ))}

      <div
        className="w-px h-5 mx-2"
        style={{ background: "var(--border)" }}
      />

      {COMPANY_FILTERS.map((f) => (
        <button
          key={f.key}
          onClick={() => onFilterChange(f.key)}
          className="text-xs font-medium px-3.5 py-1.5 rounded-full border whitespace-nowrap transition-all"
          style={
            activeFilter === f.key
              ? {
                  background: "var(--accent-cyan)",
                  borderColor: "var(--accent-cyan)",
                  color: "var(--bg-primary)",
                  fontWeight: 600,
                }
              : {
                  background: "transparent",
                  borderColor: "var(--border)",
                  color: "var(--text-secondary)",
                }
          }
        >
          {f.label}
        </button>
      ))}

      <span
        className="font-mono text-[10px] ml-auto hidden md:inline"
        style={{ color: "var(--text-muted)" }}
      >
        {sourceCount} sources tracked
      </span>
    </div>
  );
}
