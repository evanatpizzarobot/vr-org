"use client";

import type { Article } from "@/types";
import { SOURCES } from "@/lib/constants";

interface ArticleCardProps {
  article: Article;
  compact?: boolean;
  index?: number;
}

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = now - then;
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function ArticleCard({ article, compact, index = 0 }: ArticleCardProps) {
  const src = SOURCES[article.source];
  const accentColor = src?.color || "var(--accent-cyan)";
  const isOriginal = article.source === "vrorg";

  return (
    <a
      href={article.link}
      {...(isOriginal ? {} : { target: "_blank", rel: "noopener noreferrer" })}
      className="block rounded-[10px] border no-underline transition-all group relative overflow-hidden fade-in"
      style={{
        background: "var(--bg-card)",
        borderColor: "var(--border)",
        boxShadow: "var(--shadow-card)",
        padding: compact ? "12px 16px" : "18px 20px",
        animationDelay: `${index * 40}ms`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "var(--bg-card-hover)";
        e.currentTarget.style.borderColor = "var(--border-active)";
        e.currentTarget.style.transform = "translateY(-1px)";
        e.currentTarget.style.boxShadow =
          "0 4px 12px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.04)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "var(--bg-card)";
        e.currentTarget.style.borderColor = "var(--border)";
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "var(--shadow-card)";
      }}
    >
      {/* Left accent border — slides in from bottom on hover */}
      <div
        className="card-accent-bar"
        style={{ background: accentColor }}
      />

      {/* Meta row */}
      <div className="flex items-center gap-2.5 mb-2">
        {isOriginal ? (
          <span
            className="badge-original source-badge-hover font-mono text-[9px] font-bold px-2 py-0.5 rounded-[3px] uppercase tracking-[0.5px] flex items-center gap-1"
          >
            <span style={{ fontSize: 8, lineHeight: 1 }}>&#9998;</span>
            VR.org Original
          </span>
        ) : (
          <span
            className={`source-badge-hover font-mono text-[10px] font-medium px-2 py-0.5 rounded-[3px] uppercase tracking-[0.5px] ${src?.cssClass || ""}`}
          >
            {article.sourceName}
          </span>
        )}
        <span
          className="font-mono text-[10px] uppercase tracking-[0.5px]"
          style={{ color: "var(--text-muted)" }}
        >
          {article.category}
        </span>
        <span
          className="font-mono text-[10px] ml-auto"
          style={{ color: "var(--text-muted)" }}
        >
          {timeAgo(article.pubDate)}
        </span>
      </div>

      {/* Title */}
      <div
        className="font-display font-semibold leading-[1.4] transition-colors group-hover:!text-[var(--accent-cyan)]"
        style={{
          fontSize: compact ? 14 : 16,
          color: "var(--text-primary)",
          marginBottom: compact ? 0 : 6,
        }}
      >
        {article.title}
      </div>

      {/* Snippet (hidden in compact) */}
      {!compact && (
        <div
          className="text-[13px] leading-[1.55] line-clamp-2"
          style={{ color: "var(--text-secondary)" }}
        >
          {article.snippet}
        </div>
      )}

      {/* Footer (hidden in compact) */}
      {!compact && (
        <div className="flex items-center gap-4 mt-2.5">
          <span
            className="font-mono text-[11px] flex items-center gap-1 group-hover:gap-2 transition-all"
            style={{ color: "var(--accent-cyan)" }}
          >
            {isOriginal ? "Read article" : "Read at source"} &rarr;
          </span>
        </div>
      )}
    </a>
  );
}
