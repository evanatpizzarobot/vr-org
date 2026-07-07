"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";

const NAV_ITEMS = [
  { label: "Feed", href: "/" },
  { label: "Hardware", href: "/hardware" },
  { label: "Gaming", href: "/gaming" },
  { label: "Software", href: "/software" },
  { label: "Enterprise", href: "/enterprise" },
  { label: "AR", href: "/ar" },
  { label: "XR", href: "/xr" },
  { label: "Events", href: "/events" },
  { label: "Originals", href: "/originals" },
  { label: "Best Of", href: "/best-of" },
  { label: "Deals", href: "/deals", isNew: true },
];

interface HeaderProps {
  articleCount: number;
  lastUpdated: string;
}

export function Header({ articleCount, lastUpdated }: HeaderProps) {
  const pathname = usePathname();
  // Compute the localized "updated at" time after mount only. toLocaleTimeString
  // uses the runtime timezone, which differs between the server render and the
  // browser, so doing it during render causes a React #418 hydration mismatch
  // now that the homepage seeds lastUpdated server-side.
  const [timeStr, setTimeStr] = useState("");
  useEffect(() => {
    setTimeStr(
      lastUpdated
        ? new Date(lastUpdated).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        : ""
    );
  }, [lastUpdated]);

  // Mobile menu (hamburger). Desktop nav is always visible and unaffected.
  const [menuOpen, setMenuOpen] = useState(false);

  // Close the menu whenever the route changes so a tap-to-navigate never leaves
  // the panel hanging open on the new page.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Escape closes the menu.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <header
      className="sticky top-0 z-50 backdrop-blur-xl border-b"
      style={{
        background: "var(--header-bg)",
        borderColor: "var(--border)",
      }}
    >
      <div className="px-6 h-16 flex items-center relative">
        {/* Mobile logo (desktop logo lives inside the centered cluster) */}
        <a href="/" className="flex items-center gap-1 no-underline flex-shrink-0 md:hidden">
          <img
            src="/logo.png"
            alt="VR.org"
            className="h-10 w-auto dark-logo-invert"
          />
        </a>

        {/* Desktop: logo + nav, absolutely centered */}
        <div className="hidden md:flex items-center gap-6 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <a href="/" className="flex items-center gap-1 no-underline flex-shrink-0">
            <img
              src="/logo.png"
              alt="VR.org"
              className="h-10 w-auto dark-logo-invert"
            />
          </a>
          <nav className="flex items-center gap-5">
            {NAV_ITEMS.map(({ label, href, isNew }) => {
              const isActive = pathname === href;
              return (
                <a
                  key={href}
                  href={href}
                  className="text-[13px] font-medium no-underline transition-colors whitespace-nowrap relative inline-flex items-center gap-1.5"
                  style={{
                    color: isActive ? "var(--accent-cyan)" : "var(--text-secondary)",
                    borderBottom: isActive ? "2px solid var(--accent-cyan)" : "2px solid transparent",
                    paddingBottom: "2px",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.color = "var(--accent-cyan)";
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.color = "var(--text-secondary)";
                  }}
                >
                  {label}
                  {isNew && (
                    <span
                      className="font-mono text-[8px] font-bold px-1.5 py-[1px] rounded uppercase tracking-[0.5px]"
                      style={{
                        background: "var(--accent-magenta)",
                        color: "#fff",
                      }}
                    >
                      New
                    </span>
                  )}
                </a>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-4 flex-shrink-0 ml-auto">
          {/* Live dot with pulse ring. Hidden until xl (1280px) so it never
              overlaps the absolutely-centered nav on portrait monitors. */}
          <span className="live-dot-wrapper hidden xl:block">
            <span
              className="block w-2 h-2 rounded-full relative"
              style={{
                background: "var(--accent-green)",
                boxShadow: "0 0 8px var(--accent-green)",
                animation: "pulse-dot 2s ease-in-out infinite",
              }}
            />
          </span>
          <span
            className="font-mono text-[11px] uppercase tracking-[1.5px] hidden xl:inline"
            style={{ color: "var(--accent-green)" }}
          >
            Live
          </span>
          {articleCount > 0 && (
            <span
              className="font-mono text-xs hidden min-[1700px]:inline"
              style={{ color: "var(--text-muted)" }}
            >
              {articleCount} articles
            </span>
          )}
          {timeStr && (
            <span
              className="font-mono text-[11px] hidden min-[1700px]:inline"
              style={{ color: "var(--text-muted)" }}
            >
              Updated {timeStr}
            </span>
          )}
          <ThemeToggle />

          {/* Mobile hamburger toggle (desktop uses the centered nav above) */}
          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((o) => !o)}
            className="md:hidden inline-flex items-center justify-center w-11 h-11 -mr-2 rounded-md"
            style={{ color: "var(--text-secondary)" }}
          >
            {menuOpen ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <line x1="5" y1="5" x2="19" y2="19" />
                <line x1="19" y1="5" x2="5" y2="19" />
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Subtle animated gradient line under nav */}
      <div className="section-divider-animated" style={{ opacity: 0.3 }} />

      {/* Mobile dropdown menu + scrim (rendered only when open) */}
      {menuOpen && (
        <>
          <div
            className="md:hidden fixed inset-0 top-16 z-40"
            style={{ background: "rgba(0, 0, 0, 0.35)" }}
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
          />
          <nav
            id="mobile-menu"
            className="md:hidden absolute left-0 right-0 top-full z-50 border-b"
            style={{
              background: "var(--bg-primary)",
              borderColor: "var(--border)",
              boxShadow: "0 12px 24px rgba(0, 0, 0, 0.25)",
            }}
          >
            <div className="flex flex-col py-1 max-h-[calc(100vh-4rem)] overflow-y-auto">
              {NAV_ITEMS.map(({ label, href, isNew }) => {
                const isActive = pathname === href;
                return (
                  <a
                    key={href}
                    href={href}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 px-6 py-3 text-[15px] font-medium no-underline"
                    style={{
                      color: isActive ? "var(--accent-cyan)" : "var(--text-secondary)",
                      borderLeft: isActive
                        ? "3px solid var(--accent-cyan)"
                        : "3px solid transparent",
                      background: isActive ? "var(--bg-secondary)" : "transparent",
                    }}
                  >
                    {label}
                    {isNew && (
                      <span
                        className="font-mono text-[8px] font-bold px-1.5 py-[1px] rounded uppercase tracking-[0.5px]"
                        style={{ background: "var(--accent-magenta)", color: "#fff" }}
                      >
                        New
                      </span>
                    )}
                  </a>
                );
              })}
            </div>
          </nav>
        </>
      )}
    </header>
  );
}
