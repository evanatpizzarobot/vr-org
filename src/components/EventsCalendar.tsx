"use client";

import { useState, useMemo } from "react";

interface VREvent {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  venue: string;
  url: string;
  category: string;
  featured: boolean;
  tentative?: boolean;
}

const CATEGORIES = [
  { value: null, label: "All" },
  { value: "conference", label: "Conference" },
  { value: "expo", label: "Expo" },
  { value: "festival", label: "Festival" },
  { value: "showcase", label: "Showcase" },
] as const;

function formatDateRange(start: string, end: string): string {
  const s = new Date(start + "T00:00:00");
  const e = new Date(end + "T00:00:00");
  const sMonth = s.toLocaleDateString("en-US", { month: "short" });
  const eMonth = e.toLocaleDateString("en-US", { month: "short" });
  const sDay = s.getDate();
  const eDay = e.getDate();
  const sYear = s.getFullYear();
  const eYear = e.getFullYear();

  if (start === end) {
    return `${sMonth} ${sDay}, ${sYear}`;
  }
  if (sMonth === eMonth && sYear === eYear) {
    return `${sMonth} ${sDay}\u2013${eDay}, ${sYear}`;
  }
  if (sYear === eYear) {
    return `${sMonth} ${sDay} \u2013 ${eMonth} ${eDay}, ${sYear}`;
  }
  return `${sMonth} ${sDay}, ${sYear} \u2013 ${eMonth} ${eDay}, ${eYear}`;
}

export function EventsCalendar({ events }: { events: VREvent[] }) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [locationSearch, setLocationSearch] = useState("");

  const sorted = useMemo(
    () =>
      [...events].sort(
        (a, b) =>
          new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
      ),
    [events]
  );

  const filtered = useMemo(() => {
    return sorted.filter((e) => {
      if (selectedCategory && e.category !== selectedCategory) return false;
      if (
        locationSearch &&
        !e.location.toLowerCase().includes(locationSearch.toLowerCase()) &&
        !e.venue.toLowerCase().includes(locationSearch.toLowerCase())
      )
        return false;
      return true;
    });
  }, [sorted, selectedCategory, locationSearch]);

  const now = new Date();
  const upcoming = filtered.filter(
    (e) => new Date(e.endDate + "T23:59:59") >= now
  );
  const past = filtered.filter(
    (e) => new Date(e.endDate + "T23:59:59") < now
  );

  const isFiltered = selectedCategory !== null || locationSearch.length > 0;

  return (
    <>
      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-8">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.value;
            return (
              <button
                key={cat.value || "all"}
                onClick={() => setSelectedCategory(cat.value)}
                className="px-3 py-1.5 rounded-full text-[12px] font-mono uppercase tracking-[0.5px] border transition-all cursor-pointer"
                style={{
                  borderColor: isActive
                    ? "var(--accent-cyan)"
                    : "var(--border)",
                  color: isActive ? "var(--accent-cyan)" : "var(--text-muted)",
                  background: isActive
                    ? "color-mix(in srgb, var(--accent-cyan) 12%, transparent)"
                    : "transparent",
                }}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
        <div className="relative sm:ml-auto w-full sm:w-auto">
          <input
            type="text"
            placeholder="Filter by location..."
            value={locationSearch}
            onChange={(e) => setLocationSearch(e.target.value)}
            className="w-full sm:w-[220px] px-3 py-1.5 pl-8 rounded-full text-[12px] font-mono border outline-none transition-all"
            style={{
              borderColor: locationSearch
                ? "var(--accent-cyan)"
                : "var(--border)",
              color: "var(--text-primary)",
              background: "var(--bg-card)",
            }}
          />
          <svg
            className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5"
            style={{ color: "var(--text-muted)" }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Results count when filtered */}
      {isFiltered && (
        <p
          className="text-[12px] font-mono mb-4"
          style={{ color: "var(--text-muted)" }}
        >
          Showing {filtered.length} of {events.length} events
        </p>
      )}

      {/* Upcoming Events */}
      {upcoming.length > 0 && (
        <>
          <div className="flex items-center gap-3 mb-5">
            <span
              className="font-display text-[13px] font-semibold uppercase tracking-[2px]"
              style={{ color: "var(--accent-cyan)" }}
            >
              Upcoming Events
            </span>
            <div
              className="flex-1 h-px"
              style={{
                background:
                  "linear-gradient(to right, var(--accent-cyan), transparent)",
              }}
            />
          </div>
          <div className="flex flex-col gap-3 mb-12">
            {upcoming.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </>
      )}

      {/* Past Events */}
      {past.length > 0 && (
        <>
          <div className="flex items-center gap-3 mb-5">
            <span
              className="font-display text-[13px] font-semibold uppercase tracking-[2px]"
              style={{ color: "var(--text-muted)" }}
            >
              Past Events
            </span>
            <div
              className="flex-1 h-px"
              style={{ background: "var(--border)" }}
            />
          </div>
          <div className="flex flex-col gap-3 opacity-60">
            {past.map((event) => (
              <PastEventCard key={event.id} event={event} />
            ))}
          </div>
        </>
      )}

      {/* No results */}
      {filtered.length === 0 && (
        <div
          className="text-center py-16 text-[14px]"
          style={{ color: "var(--text-muted)" }}
        >
          No events match your filters. Try adjusting your search.
        </div>
      )}
    </>
  );
}

const CAT_LABELS: Record<string, string> = {
  conference: "Conference",
  festival: "Festival",
  showcase: "Showcase",
  expo: "Expo",
};

function EventCard({ event }: { event: VREvent }) {
  return (
    <a
      href={event.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block rounded-[10px] border no-underline transition-all group relative overflow-hidden hover:translate-y-[-1px]"
      style={{
        background: "var(--bg-card)",
        borderColor: event.featured
          ? "color-mix(in srgb, var(--accent-cyan) 30%, var(--border))"
          : "var(--border)",
        padding: "20px 24px",
      }}
    >
      {event.featured && (
        <div
          className="absolute left-0 top-0 bottom-0 w-[3px]"
          style={{ background: "var(--accent-cyan)" }}
        />
      )}
      <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2.5">
          {event.featured && <span style={{ fontSize: 12 }}>&#11088;</span>}
          <span
            className="font-display text-[17px] font-semibold leading-[1.3] transition-colors group-hover:!text-[var(--accent-cyan)]"
            style={{ color: "var(--text-primary)" }}
          >
            {event.name}
          </span>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {event.tentative && (
            <span
              className="font-mono text-[10px] px-2 py-0.5 rounded-[3px] uppercase tracking-[0.5px]"
              style={{
                background:
                  "color-mix(in srgb, var(--text-muted) 15%, transparent)",
                color: "var(--text-muted)",
              }}
            >
              Dates TBA
            </span>
          )}
          <span
            className="font-mono text-[11px] px-2 py-0.5 rounded-[3px] uppercase tracking-[0.5px]"
            style={{
              background:
                "color-mix(in srgb, var(--accent-cyan) 10%, transparent)",
              color: "var(--accent-cyan)",
            }}
          >
            {CAT_LABELS[event.category] || event.category}
          </span>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-2">
        <span
          className="font-mono text-[12px] font-medium"
          style={{ color: "var(--accent-cyan)" }}
        >
          {formatDateRange(event.startDate, event.endDate)}
        </span>
        <span className="text-[13px]" style={{ color: "var(--text-muted)" }}>
          {event.location}
          {event.venue !== "TBA" &&
            event.venue !== "Multiple venues" &&
            ` \u00B7 ${event.venue}`}
        </span>
      </div>
      <p
        className="text-[13px] leading-[1.6] mb-2"
        style={{ color: "var(--text-secondary)" }}
      >
        {event.description}
      </p>
      <span
        className="font-mono text-[11px] flex items-center gap-1 group-hover:gap-2 transition-all"
        style={{ color: "var(--accent-cyan)" }}
      >
        Visit website &rarr;
      </span>
    </a>
  );
}

function PastEventCard({ event }: { event: VREvent }) {
  return (
    <a
      href={event.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block rounded-[10px] border no-underline transition-all hover:opacity-80"
      style={{
        background: "var(--bg-card)",
        borderColor: "var(--border)",
        padding: "16px 20px",
      }}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
        <div className="flex items-center gap-2">
          <span
            className="font-display text-[15px] font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            {event.name}
          </span>
          <span
            className="font-mono text-[10px] px-1.5 py-0.5 rounded-[3px] uppercase tracking-[0.5px]"
            style={{
              background:
                "color-mix(in srgb, var(--text-muted) 10%, transparent)",
              color: "var(--text-muted)",
            }}
          >
            {CAT_LABELS[event.category] || event.category}
          </span>
        </div>
        <span
          className="font-mono text-[11px]"
          style={{ color: "var(--text-muted)" }}
        >
          {formatDateRange(event.startDate, event.endDate)}
        </span>
      </div>
      <span className="text-[13px]" style={{ color: "var(--text-muted)" }}>
        {event.location}
      </span>
    </a>
  );
}
