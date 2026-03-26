"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { OriginalArticleCard } from "@/components/OriginalArticleCard";

interface ArticleSummary {
  id: string;
  slug: string;
  title: string;
  snippet: string;
  category: string;
  author: string;
  publishDate: string;
}

export function OriginalsHub() {
  const [articles, setArticles] = useState<ArticleSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/articles")
      .then((res) => res.json())
      .then((data) => setArticles(data.articles || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Header articleCount={0} lastUpdated="" />

      <main
        className="max-w-[1400px] mx-auto px-6 py-10"
        style={{ color: "var(--text-primary)" }}
      >
        {/* Page header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <span
              className="font-mono text-[9px] font-bold px-2 py-0.5 rounded-[3px] uppercase tracking-[0.5px]"
              style={{
                background: "rgba(8, 145, 178, 0.15)",
                color: "var(--accent-cyan)",
              }}
            >
              VR.org Original
            </span>
          </div>
          <h1
            className="font-display text-[28px] font-bold leading-[1.3] mb-2"
            style={{ letterSpacing: "-0.5px" }}
          >
            Originals
          </h1>
          <p
            className="text-[15px] leading-[1.6] max-w-[600px]"
            style={{ color: "var(--text-secondary)" }}
          >
            In-depth articles, analysis, and opinion written by the VR.org team.
          </p>
        </div>

        {/* Articles list */}
        <div className="flex flex-col gap-3 max-w-[800px]">
          {loading ? (
            <div
              className="font-mono text-[13px] py-8"
              style={{ color: "var(--text-muted)" }}
            >
              Loading articles...
            </div>
          ) : articles.length === 0 ? (
            <div
              className="font-mono text-[13px] py-8"
              style={{ color: "var(--text-muted)" }}
            >
              No articles yet.
            </div>
          ) : (
            articles.map((article) => (
              <OriginalArticleCard
                key={article.id}
                slug={article.slug}
                title={article.title}
                snippet={article.snippet}
                category={article.category}
                author={article.author}
                publishDate={article.publishDate}
              />
            ))
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
