"use client";

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
  { label: "Originals", href: "/originals" },
];

interface HeaderProps {
  articleCount: number;
  lastUpdated: string;
}

export function Header({ articleCount, lastUpdated }: HeaderProps) {
  const pathname = usePathname();
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
        <div className="flex items-center gap-6">
          <a href="/" className="flex items-center gap-1 no-underline flex-shrink-0">
            <img
              src="/logo.png"
              alt="VR.org"
              className="h-10 w-auto dark-logo-invert"
            />
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-5">
            {NAV_ITEMS.map(({ label, href }) => {
              const isActive = pathname === href;
              return (
                <a
                  key={href}
                  href={href}
                  className="text-[13px] font-medium no-underline transition-colors whitespace-nowrap"
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
                </a>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-4 flex-shrink-0">
          {/* Live dot with pulse ring */}
          <span className="live-dot-wrapper hidden sm:block">
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
            className="font-mono text-[11px] uppercase tracking-[1.5px] hidden sm:inline"
            style={{ color: "var(--accent-green)" }}
          >
            Live
          </span>
          {articleCount > 0 && (
            <span
              className="font-mono text-xs hidden lg:inline"
              style={{ color: "var(--text-muted)" }}
            >
              {articleCount} articles
            </span>
          )}
          {timeStr && (
            <span
              className="font-mono text-[11px] hidden lg:inline"
              style={{ color: "var(--text-muted)" }}
            >
              Updated {timeStr}
            </span>
          )}
          <ThemeToggle />
        </div>
      </div>

      {/* Subtle animated gradient line under nav */}
      <div className="section-divider-animated" style={{ opacity: 0.3 }} />

      {/* Mobile nav - horizontally scrollable */}
      <nav
        className="md:hidden flex items-center gap-4 px-4 pb-2 overflow-x-auto"
        style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}
      >
        {NAV_ITEMS.map(({ label, href }) => {
          const isActive = pathname === href;
          return (
            <a
              key={href}
              href={href}
              className="text-[13px] font-medium no-underline whitespace-nowrap flex-shrink-0"
              style={{
                color: isActive ? "var(--accent-cyan)" : "var(--text-secondary)",
                borderBottom: isActive ? "2px solid var(--accent-cyan)" : "2px solid transparent",
                paddingBottom: "2px",
              }}
            >
              {label}
            </a>
          );
        })}
      </nav>
    </header>
  );
}
