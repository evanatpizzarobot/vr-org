"use client";

import { useState, useMemo, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ArticleCard } from "@/components/ArticleCard";
import { Sidebar } from "@/components/Sidebar";

import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { useFeed } from "@/hooks/useFeed";
import type { Article } from "@/types";
import {
  StructuredData,
  breadcrumbSchema,
  categoryPageSchema,
} from "@/components/StructuredData";

interface CategoryHubProps {
  category: string;
  title: string;
  description: string;
}

const CATEGORY_GUIDES: Record<string, { label: string; href: string; description: string }[]> = {
  gaming: [
    { label: "Top 10 VR Games of All Time", href: "/best-vr-games", description: "The definitive ranking of the greatest VR games ever made." },
    { label: "Best VR Games 2026", href: "/best-vr-games-2026", description: "The top VR games to play right now in 2026." },
  ],
  hardware: [
    { label: "Best VR Headsets 2026", href: "/best-vr-headsets", description: "Our picks for the best VR headsets you can buy today." },
  ],
  software: [
    { label: "Best VR Apps & Utilities", href: "/best-vr-apps", description: "The top VR apps for productivity, social, fitness, and more." },
  ],
};

export function CategoryHub({ category, title, description }: CategoryHubProps) {
  const { articles, trending, sourceStats, lastUpdated, loading } = useFeed();
  const [view, setView] = useState<"full" | "compact">("full");
  const [featured, setFeatured] = useState<Article[]>([]);
  const [editorialArticles, setEditorialArticles] = useState<
    { id: string; slug: string; title: string; author: string; authorRole: string; snippet: string; publishDate: string; category: string; tags: string[] }[]
  >([]);
  const [featuredLoading, setFeaturedLoading] = useState(true);
  const compact = view === "compact";

  // Fetch pinned/featured articles and editorial articles
  useEffect(() => {
    async function fetchFeatured() {
      try {
        const [featuredRes, editorialRes] = await Promise.all([
          fetch(`/api/featured?category=${category}`),
          fetch(`/api/articles?category=${category}&featured=true`),
        ]);
        if (featuredRes.ok) {
          const data = await featuredRes.json();
          setFeatured(data.featured);
        }
        if (editorialRes.ok) {
          const data = await editorialRes.json();
          setEditorialArticles(data.articles);
        }
      } catch {
        // Featured section is optional, fail silently
      } finally {
        setFeaturedLoading(false);
      }
    }
    fetchFeatured();
  }, [category]);

  const categoryArticles = useMemo(() => {
    return articles.filter(
      (a) => a.category === category || a.tags.includes(category)
    );
  }, [articles, category]);

  // Live feed excludes any articles already shown in featured
  const liveFeed = useMemo(() => {
    const featuredIds = new Set(featured.map((a) => a.id));
    return categoryArticles.filter((a) => !featuredIds.has(a.id));
  }, [categoryArticles, featured]);

  return (
    <>
      <StructuredData
        data={breadcrumbSchema([
          { name: "VR.org", url: "https://vr.org" },
          { name: title, url: `https://vr.org/${category}` },
        ])}
      />
      <StructuredData
        data={categoryPageSchema(
          `${title} | VR & AR News`,
          description,
          `https://vr.org/${category}`
        )}
      />
      <Header articleCount={categoryArticles.length} lastUpdated={lastUpdated} />

      <div
        className="border-b category-header-wash"
        style={{
          borderColor: "var(--border)",
          background: "var(--bg-secondary)",
          ["--wash-color" as string]: `color-mix(in srgb, var(--cat-${category}, var(--accent-cyan)) 5%, transparent)`,
        }}
      >
        <div className="max-w-[1400px] mx-auto px-6 py-10 relative z-10">
          <h1
            className="font-display text-3xl font-bold mb-3"
            style={{ letterSpacing: "-0.5px" }}
          >
            {title}
          </h1>
          {/* Category accent line */}
          <div
            className="w-12 h-[3px] rounded-full mb-4"
            style={{ background: `var(--cat-${category}, var(--accent-cyan))` }}
          />
          <p className="text-[15px] leading-[1.7] max-w-[700px]" style={{ color: "var(--text-secondary)" }}>
            {description}
          </p>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 pb-16 pt-6 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 relative z-10">
        <div>
          {/* Featured / Pinned section */}
          {featuredLoading && <LoadingSkeleton count={3} />}
          {!featuredLoading && (featured.length > 0 || editorialArticles.length > 0) && (
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <span
                  className="font-display text-[13px] font-semibold uppercase tracking-[2px]"
                  style={{ color: "var(--accent-cyan)" }}
                >
                  Featured
                </span>
                <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
                <span
                  className="font-mono text-[10px]"
                  style={{ color: "var(--text-muted)" }}
                >
                  Pinned articles
                </span>
              </div>
              <div className="flex flex-col gap-0.5">
                {/* Editorial / Original articles */}
                {editorialArticles.map((ea) => (
                  <a
                    key={ea.id}
                    href={`/articles/${ea.slug}`}
                    className="block rounded-[10px] border no-underline transition-all group relative overflow-hidden fade-in hover:translate-y-[-1px]"
                    style={{
                      background: "var(--bg-card)",
                      borderColor: "var(--border)",
                      padding: "18px 20px",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "var(--bg-card-hover)";
                      e.currentTarget.style.borderColor = "var(--border-active)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "var(--bg-card)";
                      e.currentTarget.style.borderColor = "var(--border)";
                    }}
                  >
                    <div
                      className="absolute left-0 top-0 bottom-0 w-[3px] opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ background: "var(--accent-cyan)" }}
                    />
                    <div className="flex items-center gap-2.5 mb-2">
                      <span
                        className="font-mono text-[9px] font-bold px-2 py-0.5 rounded-[3px] uppercase tracking-[0.5px]"
                        style={{
                          background: "rgba(8, 145, 178, 0.15)",
                          color: "var(--accent-cyan)",
                        }}
                      >
                        VR.org Original
                      </span>
                      <span
                        className="font-mono text-[10px] uppercase tracking-[0.5px]"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {ea.category}
                      </span>
                      <span
                        className="font-mono text-[10px] ml-auto"
                        style={{ color: "var(--text-muted)" }}
                      >
                        By {ea.author}
                      </span>
                    </div>
                    <div
                      className="font-display font-semibold leading-[1.4] transition-colors group-hover:!text-[var(--accent-cyan)]"
                      style={{ fontSize: 16, color: "var(--text-primary)", marginBottom: 6 }}
                    >
                      {ea.title}
                    </div>
                    <div
                      className="text-[13px] leading-[1.55] line-clamp-2"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {ea.snippet}
                    </div>
                    <div className="flex items-center gap-4 mt-2.5">
                      <span
                        className="font-mono text-[11px] flex items-center gap-1 group-hover:gap-2 transition-all"
                        style={{ color: "var(--accent-cyan)" }}
                      >
                        Read article &rarr;
                      </span>
                    </div>
                  </a>
                ))}
                {/* RSS featured articles */}
                {featured.map((article, i) => (
                  <ArticleCard key={article.id} article={article} index={i} />
                ))}
              </div>
            </div>
          )}

          {/* Guides section */}
          {CATEGORY_GUIDES[category] && (
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <span
                  className="font-display text-[13px] font-semibold uppercase tracking-[2px]"
                  style={{ color: "var(--accent-cyan)" }}
                >
                  Guides
                </span>
                <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {CATEGORY_GUIDES[category].map((guide) => (
                  <a
                    key={guide.href}
                    href={guide.href}
                    className="block rounded-[10px] border no-underline transition-all group relative overflow-hidden hover:translate-y-[-1px]"
                    style={{
                      background: "var(--bg-card)",
                      borderColor: "var(--border)",
                      padding: "16px 20px",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "var(--bg-card-hover)";
                      e.currentTarget.style.borderColor = "var(--border-active)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "var(--bg-card)";
                      e.currentTarget.style.borderColor = "var(--border)";
                    }}
                  >
                    <div
                      className="absolute left-0 top-0 bottom-0 w-[3px] opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ background: "var(--accent-cyan)" }}
                    />
                    <div
                      className="font-display font-semibold text-[15px] leading-[1.4] transition-colors group-hover:!text-[var(--accent-cyan)] mb-1"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {guide.label}
                    </div>
                    <div
                      className="text-[12px] leading-[1.5]"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {guide.description}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Live feed section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span
                  className="font-display text-[13px] font-semibold uppercase tracking-[2px]"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Live Feed
                </span>
                <div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    background: "var(--accent-green)",
                    boxShadow: "0 0 6px var(--accent-green)",
                    animation: "pulse-dot 2s ease-in-out infinite",
                  }}
                />
              </div>
              <div
                className="flex gap-1 rounded-md p-0.5 border"
                style={{ background: "var(--bg-secondary)", borderColor: "var(--border)" }}
              >
                <button
                  onClick={() => setView("full")}
                  className="text-[11px] font-medium px-3 py-1 rounded transition-all"
                  style={{
                    background: view === "full" ? "var(--bg-card)" : "transparent",
                    color: view === "full" ? "var(--text-primary)" : "var(--text-muted)",
                  }}
                >
                  Full
                </button>
                <button
                  onClick={() => setView("compact")}
                  className="text-[11px] font-medium px-3 py-1 rounded transition-all"
                  style={{
                    background: view === "compact" ? "var(--bg-card)" : "transparent",
                    color: view === "compact" ? "var(--text-primary)" : "var(--text-muted)",
                  }}
                >
                  Compact
                </button>
              </div>
            </div>

            {loading && <LoadingSkeleton count={5} />}

            {!loading && (
              <div className="flex flex-col gap-0.5">
                {liveFeed.map((article, i) => (
                  <div key={article.id}>
                    <ArticleCard article={article} compact={compact} index={i} />
                  </div>
                ))}
              </div>
            )}

            {!loading && liveFeed.length === 0 && featured.length === 0 && (
              <div
                className="text-center py-16 text-sm"
                style={{ color: "var(--text-muted)" }}
              >
                No articles in this category yet. Check back soon.
              </div>
            )}
          </div>
        </div>

        <div className="order-first lg:order-last">
          <Sidebar sourceStats={sourceStats} trending={trending} />
        </div>
      </div>

      <Footer />
    </>
  );
}
