"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Ticker } from "@/components/Ticker";
import { FilterBar } from "@/components/FilterBar";
import { Feed } from "@/components/Feed";
import { Sidebar } from "@/components/Sidebar";
import { Footer } from "@/components/Footer";
import { SideRailAds } from "@/components/SideRailAds";
import { AdZone } from "@/components/AdZone";
import { useFeed } from "@/hooks/useFeed";
import { useFilters } from "@/hooks/useFilters";
import { SOURCES } from "@/lib/constants";
import { breakingLabel } from "@/lib/breaking";
import type { HomeInitialData, EditorialSummary } from "@/lib/home-data";

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

function relativeTime(iso: string): string {
  if (!iso) return "just now";
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.max(1, Math.floor(diff / 60000));
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function HomeClient({ initial }: { initial: HomeInitialData }) {
  const { articles, trending, sourceStats, lastUpdated, loading } = useFeed({
    articles: initial.feedArticles,
    trending: initial.trending,
    sourceStats: initial.sourceStats,
    lastUpdated: initial.lastUpdated,
  });
  const { activeFilter, filtered, setFilter } = useFilters(articles);
  const [editorials, setEditorials] = useState<EditorialSummary[]>(initial.editorials);

  const sourceCount = Object.keys(sourceStats).length || Object.keys(SOURCES).length;
  // Hero masthead date: the LIVE current date pinned to Pacific (the VR.org
  // newsroom timezone), computed after mount so the prerendered HTML never
  // mismatches the client during hydration (empty on first paint, filled on
  // mount).
  //
  // timeZone MUST be "America/Los_Angeles", never "UTC". This is a full "now"
  // timestamp: formatting it in UTC rolls the masthead a day AHEAD for anyone
  // whose local clock is already past UTC midnight (after ~5pm PT), which was
  // the "shows tomorrow's date" bug on 2026-07-15. "America/Los_Angeles" tracks
  // PST/PDT automatically (do NOT hardcode a PST offset, that breaks under
  // daylight time), so every reader sees the same LA date. The separate UTC
  // rule only applies to stored publishDate "YYYY-MM-DD" strings, which parse
  // as UTC midnight.
  const [heroDate, setHeroDate] = useState("");
  useEffect(() => {
    setHeroDate(
      new Date()
        .toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          timeZone: "America/Los_Angeles",
        })
        .toUpperCase()
    );
  }, []);

  // relativeTime() reads Date.now(), which differs between the server render and
  // the client, so compute the "Last update" label after mount to avoid a React
  // hydration mismatch (same deferral pattern as heroDate above).
  const [lastUpdateLabel, setLastUpdateLabel] = useState("now");
  useEffect(() => {
    setLastUpdateLabel(lastUpdated ? relativeTime(lastUpdated) : "now");
  }, [lastUpdated]);

  useEffect(() => {
    fetch("/api/articles?mix=true&limit=4")
      .then((r) => {
        if (!r.ok) throw new Error(`articles fetch failed: ${r.status}`);
        return r.json();
      })
      .then((data) => {
        if (Array.isArray(data.articles) && data.articles.length > 0) {
          setEditorials(data.articles);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <>
      <SideRailAds />
      <Header articleCount={filtered.length} lastUpdated={lastUpdated} />
      <Ticker articles={articles} />

      <main id="main">
      {/* ===== HOMEPAGE HERO ===== */}
      <section
        className="hero-wrap fade-up"
        style={{ animationDelay: "60ms" }}
        aria-label="Site introduction"
      >
        <div className="hero">
          <div className="hero-eyebrow">
            <span>Spatial computing, daily{heroDate ? <> &middot; {heroDate}</> : null}</span>
          </div>
          <h1 className="hero-headline">
            All the news from<br />
            the <span className="accent">immersive web</span>.
          </h1>
          <p className="hero-lede">
            VR.org aggregates the best headlines, launches, and content from across VR, AR and XR.
            From Quest and Vision Pro to PSVR2, Steam, and spatial-computing research.
          </p>
          <div className="hero-ctas">
            <a
              href="#feed"
              className="btn btn-primary"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("feed")?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
            >
              Start reading &rarr;
            </a>
            <a href="/about#sources" className="btn btn-ghost">Browse sources</a>
          </div>
          <div className="stat-row" role="group" aria-label="Live stats">
            <div className="stat">
              <span className="stat-label">Sources</span>
              <span className="stat-value">
                {sourceCount}
                <span className="tick">live</span>
              </span>
            </div>
            <div className="stat">
              <span className="stat-label">Stories today</span>
              <span className="stat-value">{articles.length.toLocaleString()}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Last update</span>
              <span className="stat-value">{lastUpdateLabel}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Categories</span>
              <span className="stat-value">6</span>
            </div>
          </div>
        </div>
      </section>

      {/* Direct-sold flagship banner. Dormant (renders nothing) until a
          placement is activated in data/ad-placements.json. */}
      <AdZone slot="homepage-hero" variant="hero" />

      <div id="feed" className="max-w-[1400px] mx-auto px-6 pb-16 pt-5 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 relative z-10">
        <div>
          {/* From Our Editors section */}
          {editorials.length > 0 && (
            <div className="mb-8 fade-up" style={{ animationDelay: "100ms" }}>
              <div className="flex items-center gap-3 mb-4">
                <h2
                  className="font-display text-[13px] font-semibold uppercase tracking-[2px] m-0"
                  style={{ color: "var(--accent-cyan)" }}
                >
                  From Our Editors
                </h2>
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
                  // Big-news red outline, auto-expires 48h after publish.
                  const breaking = breakingLabel(ea.breaking, ea.publishDate);
                  const restingBorder = breaking ? "var(--accent-red)" : "var(--border)";
                  return (
                    <a
                      key={ea.id}
                      href={`/articles/${ea.slug}`}
                      className="block rounded-[10px] border no-underline transition-all group relative overflow-hidden fade-in hover:translate-y-[-2px] editorial-glow"
                      style={{
                        background: "var(--bg-card)",
                        borderColor: restingBorder,
                        padding: "18px 20px",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "var(--bg-card-hover)";
                        e.currentTarget.style.borderColor = breaking ? "var(--accent-red)" : writerColor;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "var(--bg-card)";
                        e.currentTarget.style.borderColor = restingBorder;
                      }}
                    >
                      <div className="flex items-center gap-2.5 mb-2">
                        {breaking && (
                          <span
                            className="font-mono text-[9px] font-bold px-2 py-0.5 rounded-[3px] uppercase tracking-[0.5px]"
                            style={{
                              background: "color-mix(in srgb, var(--accent-red) 15%, transparent)",
                              color: "var(--accent-red)",
                            }}
                          >
                            {breaking}
                          </span>
                        )}
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
              <h2
                className="font-display text-[13px] font-semibold uppercase tracking-[2px] m-0"
                style={{ color: "var(--text-secondary)" }}
              >
                Guides &amp; Resources
              </h2>
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

          {/* Filter chips scope only the RSS feed below */}
          <FilterBar
            activeFilter={activeFilter}
            onFilterChange={setFilter}
            sourceCount={sourceCount}
          />

          {/* Main RSS feed */}
          <Feed articles={filtered} loading={loading} />
        </div>
        <div className="order-first lg:order-last fade-up" style={{ animationDelay: "250ms" }}>
          <Sidebar sourceStats={sourceStats} trending={trending} />
        </div>
      </div>
      </main>

      <Footer />
    </>
  );
}
