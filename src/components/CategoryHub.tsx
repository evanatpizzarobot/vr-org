"use client";

import { useState, useMemo, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ArticleCard } from "@/components/ArticleCard";
import { Sidebar } from "@/components/Sidebar";
import { CategoryMascot, CATEGORY_MASCOT_KIND } from "@/components/CategoryMascot";
import { AdSlot } from "@/components/AdSlot";
import { CategoryProducts } from "@/components/CategoryProducts";
import type { CategoryProductsResult } from "@/lib/category-products";
import { AD_SLOTS, AD_LAYOUT_KEYS } from "@/lib/ads";

import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { useFeed } from "@/hooks/useFeed";
import type { Article } from "@/types";
import type { OriginalSummary } from "@/lib/articles";
import {
  StructuredData,
  breadcrumbSchema,
  newsCollectionSchema,
} from "@/components/StructuredData";

interface CategoryHubProps {
  category: string;
  title: string;
  description: string;
  // Recent originals for this category, seeded by the server so the topical
  // cluster of /articles/ links is in the HTML for crawlers and AI agents.
  initialEditorial?: OriginalSummary[];
  // Server-seeded curated products for this category, rendered above Originals.
  products?: CategoryProductsResult | null;
}

const CATEGORY_GUIDES: Record<string, { label: string; href: string; description: string }[]> = {
  gaming: [
    { label: "Top 10 VR Games of All Time", href: "/best-vr-games", description: "The definitive ranking of the greatest VR games ever made." },
    { label: "Best VR Games 2026", href: "/best-vr-games-2026", description: "The top VR games to play right now in 2026." },
  ],
  hardware: [
    { label: "Best VR Headsets 2026", href: "/best-vr-headsets", description: "Our picks for the best VR headsets you can buy today." },
    { label: "VR for Beginners", href: "/vr-for-beginners", description: "Everything a first-time VR buyer needs to know." },
  ],
  software: [
    { label: "Best VR Apps & Utilities", href: "/best-vr-apps", description: "The top VR apps for productivity, social, fitness, and more." },
    { label: "Best VR Fitness Apps 2026", href: "/best-vr-fitness", description: "Top VR workout apps that actually replace the gym." },
  ],
  ar: [
    { label: "Best AR Glasses 2026", href: "/ar-glasses", description: "Every major AR smart glasses device compared." },
    { label: "Best VR Headsets 2026", href: "/best-vr-headsets", description: "Apple Vision Pro, Quest 3, and every major headset compared." },
  ],
  xr: [
    { label: "Best AR Glasses 2026", href: "/ar-glasses", description: "Smart glasses and Android XR devices ranked." },
    { label: "Best VR Apps & Utilities", href: "/best-vr-apps", description: "Top VR apps for productivity, social, and creativity." },
  ],
  enterprise: [
    { label: "Best VR Headsets 2026", href: "/best-vr-headsets", description: "The headsets businesses deploy for training, design, and collaboration." },
    { label: "Best VR Apps & Utilities", href: "/best-vr-apps", description: "Productivity, collaboration, and training tools that scale to teams." },
  ],
};

export function CategoryHub({ category, title, description, initialEditorial, products }: CategoryHubProps) {
  const { articles, trending, sourceStats, lastUpdated, loading } = useFeed();
  const [view, setView] = useState<"full" | "compact">("full");
  const [featured, setFeatured] = useState<Article[]>([]);
  // Seeded server-side and not refetched, so the server-rendered originals list
  // is never replaced after mount.
  const [editorialArticles] = useState<OriginalSummary[]>(initialEditorial ?? []);
  const compact = view === "compact";

  // RSS "featured" picks are live, so they are still fetched client-side.
  useEffect(() => {
    fetch(`/api/featured?category=${category}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.featured) setFeatured(data.featured);
      })
      .catch(() => {});
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
        data={newsCollectionSchema(
          `${title} | VR & AR News`,
          description,
          `https://vr.org/${category}`,
          editorialArticles
        )}
      />
      <Header articleCount={categoryArticles.length} lastUpdated={lastUpdated} />

      <main id="main">
      <div
        className="border-b category-header-wash"
        style={{
          borderColor: "var(--border)",
          background: "var(--bg-secondary)",
          ["--wash-color" as string]: `color-mix(in srgb, var(--cat-${category}, var(--accent-cyan)) 5%, transparent)`,
        }}
      >
        <div className="max-w-[1400px] mx-auto px-6 py-10 relative z-10 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] gap-8 items-center">
          <div>
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
          {CATEGORY_MASCOT_KIND[category] && (
            <div
              className="hidden lg:block h-[220px] w-full"
              style={{
                borderLeft: "1px dashed var(--border)",
                paddingLeft: 24,
              }}
            >
              <CategoryMascot
                kind={CATEGORY_MASCOT_KIND[category]}
                category={category}
              />
            </div>
          )}
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 pb-16 pt-6 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 relative z-10">
        <div>
          {products && <CategoryProducts data={products} />}
          {/* VR.org Originals for this category (server-rendered) + live RSS picks */}
          {(editorialArticles.length > 0 || featured.length > 0) && (
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <span
                  className="font-display text-[13px] font-semibold uppercase tracking-[2px]"
                  style={{ color: "var(--accent-cyan)" }}
                >
                  VR.org Originals
                </span>
                <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
                <a
                  href="/originals"
                  className="font-mono text-[10px] no-underline hover:underline"
                  style={{ color: "var(--text-muted)" }}
                >
                  All originals &rarr;
                </a>
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
                    {(i + 1) % 8 === 0 && i < liveFeed.length - 1 && (
                      <div className="my-4">
                        <AdSlot
                          slot={AD_SLOTS.feed}
                          format="fluid"
                          layoutKey={AD_LAYOUT_KEYS.feed}
                          minHeight={120}
                        />
                      </div>
                    )}
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

        {/* No order override: on mobile the sidebar stacks BELOW the main
            content (source order); on desktop the grid places it in the
            right-hand column. Previously order-first forced all the sidebar
            widgets above the category content on mobile. */}
        <div>
          <Sidebar sourceStats={sourceStats} trending={trending} />
        </div>
      </div>
      </main>

      <Footer />
    </>
  );
}
