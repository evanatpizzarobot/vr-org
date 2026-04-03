"use client";

import { useEffect, useState } from "react";

interface EditorialSummary {
  id: string;
  slug: string;
  title: string;
  author: string;
  snippet: string;
  category: string;
}

export function EditorsPicks() {
  const [articles, setArticles] = useState<EditorialSummary[]>([]);

  useEffect(() => {
    fetch("/api/articles")
      .then((r) => r.json())
      .then((data) => setArticles((data.articles || []).slice(0, 4)))
      .catch(() => {});
  }, []);

  if (articles.length === 0) return null;

  return (
    <div
      className="rounded-[10px] border overflow-hidden"
      style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
    >
      <div
        className="px-4 py-3 border-b"
        style={{ borderColor: "var(--border)", background: "var(--bg-secondary)" }}
      >
        <div className="flex items-center gap-2">
          <span
            className="font-display text-[12px] font-semibold uppercase tracking-[1.5px]"
            style={{ color: "var(--accent-cyan)" }}
          >
            Editor&apos;s Picks
          </span>
        </div>
      </div>
      <div className="flex flex-col">
        {articles.map((article, i) => (
          <a
            key={article.id}
            href={`/articles/${article.slug}`}
            className="block px-4 py-3 no-underline transition-colors group"
            style={{
              borderBottom: i < articles.length - 1 ? "1px solid var(--border)" : "none",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--bg-card-hover)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
            }}
          >
            <div
              className="font-display text-[13px] font-medium leading-[1.4] transition-colors group-hover:!text-[var(--accent-cyan)] mb-1"
              style={{ color: "var(--text-primary)" }}
            >
              {article.title}
            </div>
            <div className="flex items-center gap-2">
              <span
                className="font-mono text-[9px] font-bold px-1.5 py-0.5 rounded-[3px] uppercase tracking-[0.5px]"
                style={{
                  background: "rgba(8, 145, 178, 0.12)",
                  color: "var(--accent-cyan)",
                }}
              >
                Original
              </span>
              <span
                className="font-mono text-[10px] uppercase tracking-[0.5px]"
                style={{ color: "var(--text-muted)" }}
              >
                {article.category}
              </span>
            </div>
          </a>
        ))}
      </div>
      <a
        href="/originals"
        className="block px-4 py-2.5 text-center no-underline transition-colors border-t font-mono text-[11px]"
        style={{
          borderColor: "var(--border)",
          color: "var(--accent-cyan)",
          background: "var(--bg-secondary)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "var(--bg-card-hover)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "var(--bg-secondary)";
        }}
      >
        View all originals &rarr;
      </a>
    </div>
  );
}
