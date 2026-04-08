import type { Metadata } from "next";
import fs from "fs";
import path from "path";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { StructuredData, breadcrumbSchema } from "@/components/StructuredData";
import { EventsCalendar } from "@/components/EventsCalendar";

export const metadata: Metadata = {
  title:
    "VR, AR & XR Events Calendar 2026-2027 | Conferences & Expos | VR.org",
  description:
    "Complete calendar of virtual reality, augmented reality, and XR conferences, expos, showcases, and industry events for 2026 and 2027. Dates, locations, and details for every major VR event.",
  openGraph: {
    title: "VR, AR & XR Events Calendar 2026-2027 | VR.org",
    description:
      "Complete calendar of VR, AR, and XR conferences, expos, and industry events for 2026 and 2027.",
    url: "https://vr.org/events",
    siteName: "VR.org",
  },
  alternates: {
    canonical: "https://vr.org/events",
  },
  twitter: {
    card: "summary_large_image",
    title: "VR & AR Events Calendar 2026-2027 | VR.org",
    description:
      "All the VR, AR, and XR conferences, expos, and showcases in 2026 and 2027.",
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
  tentative?: boolean;
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

function eventSchema(event: VREvent) {
  const locationParts = event.location.split(", ");
  const lastPart = locationParts[locationParts.length - 1]?.trim() || "";
  const isUS = locationParts.length > 1 && /^[A-Z]{2}$/.test(lastPart);

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
              addressRegion: isUS ? lastPart : "",
              addressCountry: isUS ? "US" : lastPart,
            },
          },
    url: event.url,
  };
}

export default function EventsPage() {
  const events = getEvents();

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
          VR, AR &amp; XR Events Calendar
        </h1>
        <p
          className="text-[15px] leading-[1.7] mb-8 max-w-[650px]"
          style={{ color: "var(--text-secondary)" }}
        >
          Your guide to the most important virtual reality, augmented reality,
          and spatial computing conferences, expos, and showcases.
        </p>

        <EventsCalendar events={events} />
      </main>

      <Footer />
    </>
  );
}
