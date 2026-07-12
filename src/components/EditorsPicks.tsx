"use client";

import { useEffect, useMemo, useState } from "react";

interface EditorialSummary {
  id: string;
  slug: string;
  title: string;
  author: string;
  snippet: string;
  category: string;
  tags?: string[];
}

interface EditorsPicksProps {
  // When set, the widget leads with originals from this category and only tops
  // up with site-wide originals if the category cannot fill all four slots.
  category?: string;
}

const PICK_COUNT = 4;

export function EditorsPicks({ category }: EditorsPicksProps) {
  const [allArticles, setAllArticles] = useState<EditorialSummary[]>([]);

  useEffect(() => {
    fetch("/api/articles")
      .then((r) => r.json())
      .then((data) => setAllArticles(data.articles || []))
      .catch(() => {});
  }, []);

  const articles = useMemo(() => {
    if (!category) return allArticles.slice(0, PICK_COUNT);

    // Three tiers, newest-first within each: pieces actually written for this
    // category, then pieces merely tagged with it, then anything else. Without
    // the split, a tag-only match outranks a true category piece and the widget
    // reads as unfiltered.
    const primary = allArticles.filter((a) => a.category === category);
    const tagged = allArticles.filter(
      (a) => a.category !== category && a.tags?.includes(category)
    );
    const rest = allArticles.filter(
      (a) => a.category !== category && !a.tags?.includes(category)
    );

    return [...primary, ...tagged, ...rest].slice(0, PICK_COUNT);
  }, [allArticles, category]);

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
          <h2
            className="font-display text-[12px] font-semibold uppercase tracking-[1.5px] m-0"
            style={{ color: "var(--accent-cyan)" }}
          >
            Editor&apos;s Picks
          </h2>
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
