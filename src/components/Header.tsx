"use client";

import { ThemeToggle } from "./ThemeToggle";

interface HeaderProps {
  articleCount: number;
  lastUpdated: string;
}

export function Header({ articleCount, lastUpdated }: HeaderProps) {
  const timeStr = lastUpdated
    ? new Date(lastUpdated).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return (
    <header
      className="sticky top-0 z-50 backdrop-blur-xl border-b"
      style={{
        background: "var(--header-bg)",
        borderColor: "var(--border)",
      }}
    >
      <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2.5 no-underline">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center font-display font-extrabold text-sm"
            style={{
              background: "linear-gradient(135deg, var(--accent-cyan), var(--accent-magenta))",
              color: "var(--bg-primary)",
              letterSpacing: "-0.5px",
            }}
          >
            VR
          </div>
          <div
            className="font-display text-[22px] font-bold"
            style={{ color: "var(--text-primary)", letterSpacing: "-0.5px" }}
          >
            VR<span style={{ color: "var(--accent-cyan)" }}>.org</span>
          </div>
        </a>

        <div className="flex items-center gap-4">
          <div
            className="w-2 h-2 rounded-full"
            style={{
              background: "var(--accent-green)",
              boxShadow: "0 0 8px var(--accent-green)",
              animation: "pulse-dot 2s ease-in-out infinite",
            }}
          />
          <span
            className="font-mono text-[11px] uppercase tracking-[1.5px]"
            style={{ color: "var(--accent-green)" }}
          >
            Live Feed
          </span>
          <span
            className="font-mono text-xs hidden sm:inline"
            style={{ color: "var(--text-muted)" }}
          >
            {articleCount} articles
          </span>
          {timeStr && (
            <span
              className="font-mono text-[11px] hidden md:inline"
              style={{ color: "var(--text-muted)" }}
            >
              Updated {timeStr}
            </span>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
