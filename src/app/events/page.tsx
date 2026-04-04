import type { Metadata } from "next";
import fs from "fs";
import path from "path";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { StructuredData, breadcrumbSchema } from "@/components/StructuredData";

export const metadata: Metadata = {
  title: "VR, AR & XR Events Calendar 2026 | Conferences & Expos | VR.org",
  description:
    "Complete calendar of virtual reality, augmented reality, and XR conferences, expos, and industry events for 2026. Dates, locations, and details.",
  openGraph: {
    title: "VR, AR & XR Events Calendar 2026 | VR.org",
    description:
      "Complete calendar of VR, AR, and XR conferences, expos, and industry events for 2026.",
    url: "https://vr.org/events",
    siteName: "VR.org",
  },
  alternates: {
    canonical: "https://vr.org/events",
  },
  twitter: {
    card: "summary_large_image",
    title: "VR & AR Events Calendar 2026 | VR.org",
    description:
      "All the VR, AR, and XR conferences, expos, and showcases in 2026.",
  },
};

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
}

function getEvents(): VREvent[] {
  try {
    const filePath = path.join(process.cwd(), "data", "events.json");
    if (!fs.existsSync(filePath)) return [];
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch {
    return [];
  }
}

function formatDateRange(start: string, end: string): string {
  const s = new Date(start + "T00:00:00");
  const e = new Date(end + "T00:00:00");
  const sMonth = s.toLocaleDateString("en-US", { month: "short" });
  const eMonth = e.toLocaleDateString("en-US", { month: "short" });
  const sDay = s.getDate();
  const eDay = e.getDate();

  if (start === end) {
    return `${sMonth} ${sDay}, ${s.getFullYear()}`;
  }
  if (sMonth === eMonth) {
    return `${sMonth} ${sDay}\u2013${eDay}, ${s.getFullYear()}`;
  }
  return `${sMonth} ${sDay} \u2013 ${eMonth} ${eDay}, ${s.getFullYear()}`;
}

function eventSchema(event: VREvent) {
  const locationParts = event.location.split(", ");
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.name,
    description: event.description,
    startDate: event.startDate,
    endDate: event.endDate,
    eventAttendanceMode:
      event.location === "Online"
        ? "https://schema.org/OnlineEventAttendanceMode"
        : "https://schema.org/OfflineEventAttendanceMode",
    location:
      event.location === "Online"
        ? {
            "@type": "VirtualLocation",
            url: event.url,
          }
        : {
            "@type": "Place",
            name: event.venue,
            address: {
              "@type": "PostalAddress",
              addressLocality: locationParts[0],
              addressRegion: locationParts[1] || "",
              addressCountry: locationParts.length > 1 ? "US" : "",
            },
          },
    url: event.url,
  };
}

const CAT_LABELS: Record<string, string> = {
  conference: "Conference",
  festival: "Festival",
  showcase: "Showcase",
  expo: "Expo",
};

export default function EventsPage() {
  const events = getEvents().sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );

  const now = new Date();
  const upcoming = events.filter((e) => new Date(e.endDate + "T23:59:59") >= now);
  const past = events.filter((e) => new Date(e.endDate + "T23:59:59") < now);

  return (
    <>
      {events.map((e) => (
        <StructuredData key={e.id} data={eventSchema(e)} />
      ))}
      <StructuredData
        data={breadcrumbSchema([
          { name: "VR.org", url: "https://vr.org" },
          { name: "Events", url: "https://vr.org/events" },
        ])}
      />
      <Header articleCount={0} lastUpdated="" />

      <main
        className="max-w-[900px] mx-auto px-6 py-12"
        style={{ color: "var(--text-primary)" }}
      >
        <h1
          className="font-display text-[32px] font-bold leading-[1.2] mb-3"
          style={{ letterSpacing: "-0.5px" }}
        >
          VR, AR &amp; XR Events Calendar 2026
        </h1>
        <p
          className="text-[15px] leading-[1.7] mb-10 max-w-[650px]"
          style={{ color: "var(--text-secondary)" }}
        >
          Your guide to the most important virtual reality, augmented reality,
          and spatial computing conferences, expos, and showcases.
        </p>

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
                <a
                  key={event.id}
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
                      {event.featured && (
                        <span style={{ fontSize: 12 }}>&#11088;</span>
                      )}
                      <span
                        className="font-display text-[17px] font-semibold leading-[1.3] transition-colors group-hover:!text-[var(--accent-cyan)]"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {event.name}
                      </span>
                    </div>
                    <span
                      className="font-mono text-[11px] px-2 py-0.5 rounded-[3px] uppercase tracking-[0.5px] flex-shrink-0"
                      style={{
                        background:
                          "color-mix(in srgb, var(--accent-cyan) 10%, transparent)",
                        color: "var(--accent-cyan)",
                      }}
                    >
                      {CAT_LABELS[event.category] || event.category}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-2">
                    <span
                      className="font-mono text-[12px] font-medium"
                      style={{ color: "var(--accent-cyan)" }}
                    >
                      {formatDateRange(event.startDate, event.endDate)}
                    </span>
                    <span
                      className="text-[13px]"
                      style={{ color: "var(--text-muted)" }}
                    >
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
                <a
                  key={event.id}
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
                    <span
                      className="font-display text-[15px] font-semibold"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {event.name}
                    </span>
                    <span
                      className="font-mono text-[11px]"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {formatDateRange(event.startDate, event.endDate)}
                    </span>
                  </div>
                  <span
                    className="text-[13px]"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {event.location}
                  </span>
                </a>
              ))}
            </div>
          </>
        )}
      </main>

      <Footer />
    </>
  );
}
