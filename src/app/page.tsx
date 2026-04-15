"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Ticker } from "@/components/Ticker";
import { FilterBar } from "@/components/FilterBar";
import { Feed } from "@/components/Feed";
import { Sidebar } from "@/components/Sidebar";
import { Footer } from "@/components/Footer";
import { useFeed } from "@/hooks/useFeed";
import { useFilters } from "@/hooks/useFilters";
import { SOURCES } from "@/lib/constants";

interface EditorialSummary {
  id: string;
  slug: string;
  title: string;
  author: string;
  authorRole: string;
  snippet: string;
  publishDate: string;
  category: string;
  tags: string[];
}

const WRITER_COLORS: Record<string, string> = {
  "Evan Marcus": "var(--writer-evan)",
  "Alex Reeves": "var(--writer-alex)",
  "Jordan Kuo": "var(--writer-jordan)",
  "Nina Castillo": "var(--writer-nina)",
  "Sam Whitfield": "var(--writer-sam)",
};

const CATEGORY_COLORS: Record<string, string> = {
  gaming: "var(--cat-gaming)",
  hardware: "var(--cat-hardware)",
  software: "var(--cat-software)",
  enterprise: "var(--cat-enterprise)",
  ar: "var(--cat-ar)",
  xr: "var(--cat-xr)",
};

const GUIDES = [
  { label: "What is VR?", href: "/what-is-vr", description: "A complete beginner's guide to virtual reality technology." },
  { label: "Best VR Headsets 2026", href: "/best-vr-headsets", description: "Our picks for the top VR headsets you can buy today." },
  { label: "Top 10 VR Games", href: "/best-vr-games", description: "The definitive ranking of the greatest VR games ever made." },
  { label: "Best VR Games 2026", href: "/best-vr-games-2026", description: "The top VR games to play right now in 2026." },
  { label: "Best VR Apps", href: "/best-vr-apps", description: "Top VR apps for productivity, social, fitness, and more." },
];

export default function Home() {
  const { articles, trending, sourceStats, lastUpdated, loading } = useFeed();
  const { activeFilter, filtered, setFilter } = useFilters(articles);
  const [editorials, setEditorials] = useState<EditorialSummary[]>([]);

  const sourceCount = Object.keys(sourceStats).length || Object.keys(SOURCES).length;

  useEffect(() => {
    fetch("/api/articles?mix=true&limit=4")
      .then((r) => r.json())
      .then((data) => setEditorials(data.articles || []))
      .catch(() => {});
  }, []);

  return (
    <>
      <Header articleCount={filtered.length} lastUpdated={lastUpdated} />
      <Ticker articles={articles} />
      <FilterBar
        activeFilter={activeFilter}
        onFilterChange={setFilter}
        sourceCount={sourceCount}
      />

      <div className="max-w-[1400px] mx-auto px-6 pb-16 pt-5 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 relative z-10">
        <div>
          {/* From Our Editors section */}
          {editorials.length > 0 && (
            <div className="mb-8 fade-up" style={{ animationDelay: "100ms" }}>
              <div className="flex items-center gap-3 mb-4">
                <span
                  className="font-display text-[13px] font-semibold uppercase tracking-[2px]"
                  style={{ color: "var(--accent-cyan)" }}
                >
                  From Our Editors
                </span>
                <div
                  className="flex-1 h-px"
                  style={{ background: "linear-gradient(to right, var(--accent-cyan), var(--accent-magenta), transparent)" }}
                />
                <a
                  href="/originals"
                  className="font-mono text-[11px] no-underline hover:underline transition-colors"
                  style={{ color: "var(--accent-cyan)" }}
                >
                  View all originals &rarr;
                </a>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {editorials.map((ea) => {
                  const writerColor = WRITER_COLORS[ea.author] || "var(--accent-cyan)";
                  const catColor = CATEGORY_COLORS[ea.category] || "var(--accent-cyan)";
                  return (
                    <a
                      key={ea.id}
                      href={`/articles/${ea.slug}`}
                      className="block rounded-[10px] border no-underline transition-all group relative overflow-hidden fade-in hover:translate-y-[-2px] editorial-glow"
                      style={{
                        background: "var(--bg-card)",
                        borderColor: "var(--border)",
                        padding: "18px 20px",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "var(--bg-card-hover)";
                        e.currentTarget.style.borderColor = writerColor;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "var(--bg-card)";
                        e.currentTarget.style.borderColor = "var(--border)";
                      }}
                    >
                      {/* Writer accent stripe (always visible) */}
                      <div
                        className="absolute left-0 top-0 bottom-0 w-[3px] transition-opacity"
                        style={{ background: writerColor, opacity: 0.5 }}
                      />
                      <div className="flex items-center gap-2.5 mb-2">
                        <span
                          className="font-mono text-[9px] font-bold px-2 py-0.5 rounded-[3px] uppercase tracking-[0.5px]"
                          style={{
                            background: `color-mix(in srgb, ${catColor} 15%, transparent)`,
                            color: catColor,
                          }}
                        >
                          {ea.category}
                        </span>
                        <span
                          className="font-mono text-[9px] px-2 py-0.5 rounded-[3px] uppercase tracking-[0.5px]"
                          style={{
                            background: `color-mix(in srgb, ${writerColor} 10%, transparent)`,
                            color: writerColor,
                          }}
                        >
                          {ea.author.split(" ")[0]}
                        </span>
                      </div>
                      <div
                        className="font-display font-semibold leading-[1.4] transition-colors"
                        style={{ fontSize: 15, color: "var(--text-primary)", marginBottom: 6 }}
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
                        {/* Writer color dot */}
                        <span className="flex items-center gap-1.5">
                          <span
                            className="w-1.5 h-1.5 rounded-full inline-block"
                            style={{ background: writerColor }}
                          />
                          <span
                            className="font-mono text-[10px]"
                            style={{ color: writerColor }}
                          >
                            {ea.author}
                          </span>
                        </span>
                        <span
                          className="font-mono text-[10px] ml-auto"
                          style={{ color: "var(--text-muted)" }}
                        >
                          {new Date(ea.publishDate).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" })}
                        </span>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          )}

          {/* Guides & Resources section */}
          <div className="mb-8 fade-up" style={{ animationDelay: "200ms" }}>
            <div className="flex items-center gap-3 mb-4">
              <span
                className="font-display text-[13px] font-semibold uppercase tracking-[2px]"
                style={{ color: "var(--text-secondary)" }}
              >
                Guides &amp; Resources
              </span>
              <div
                className="flex-1 h-px"
                style={{ background: "linear-gradient(to right, var(--text-muted), transparent)" }}
              />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {GUIDES.map((guide) => (
                <a
                  key={guide.href}
                  href={guide.href}
                  className="block rounded-[10px] border no-underline transition-all group relative overflow-hidden hover:translate-y-[-1px]"
                  style={{
                    background: "var(--bg-card)",
                    borderColor: "var(--border)",
                    padding: "14px 16px",
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
                    className="font-display font-semibold text-[13px] leading-[1.4] transition-colors group-hover:!text-[var(--accent-cyan)] mb-1"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {guide.label}
                  </div>
                  <div
                    className="text-[11px] leading-[1.5] line-clamp-2"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {guide.description}
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Main RSS feed */}
          <Feed articles={filtered} loading={loading} />
        </div>
        <div className="order-first lg:order-last fade-up" style={{ animationDelay: "250ms" }}>
          <Sidebar sourceStats={sourceStats} trending={trending} />
        </div>
      </div>

      <Footer />
    </>
  );
}
