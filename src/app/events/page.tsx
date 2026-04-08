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

const ORGANIZER_MAP: Record<string, string> = {
  "AWE USA 2026": "AWE",
  "AWE Asia 2026": "AWE",
  "SIGGRAPH 2026": "ACM SIGGRAPH",
  "Apple WWDC 2026": "Apple",
  "Meta Connect 2026": "Meta",
  "Google I/O 2026": "Google",
  "IEEE VR 2026": "IEEE",
  "ISMAR 2026": "IEEE",
  "Laval Virtual 2026": "Laval Virtual",
  "GDC 2026": "Informa",
  "CES 2026": "CTA",
  "CES 2027": "CTA",
  "SPIE AR/VR/MR 2026": "SPIE",
  "SPIE Photonics West 2027": "SPIE",
  "MWC Barcelona 2026": "GSMA",
  "SXSW 2026": "SXSW",
  "NVIDIA GTC 2026": "NVIDIA",
  "ACM CHI 2026": "ACM",
  "Computex 2026": "TAITRA",
  "Summer Game Fest 2026": "Summer Game Fest",
  "Gamescom 2026": "Koelnmesse",
  "IFA 2026": "gfu / Messe Berlin",
  "Tokyo Game Show 2026": "CESA",
  "Augmented Enterprise Summit 2026": "BrainXchange",
  "Games for Change Festival 2026": "Games for Change",
  "Immersive Tech Week 2026": "VRDays Foundation",
  "UnitedXR Europe 2026": "UnitedXR",
  "Meaningful XR 2026": "Meaningful XR",
  "VR Games Showcase (Spring 2026)": "UploadVR",
  "Web Summit 2026": "Web Summit",
};

function getAttendanceMode(location: string): string {
  const loc = location.toLowerCase();
  if (loc.includes("online") || loc.includes("virtual") || loc.includes("youtube")) {
    return "https://schema.org/OnlineEventAttendanceMode";
  }
  return "https://schema.org/OfflineEventAttendanceMode";
}

function eventSchema(event: VREvent) {
  const locationParts = event.location.split(", ");
  const lastPart = locationParts[locationParts.length - 1]?.trim() || "";
  const isUS = locationParts.length > 1 && /^[A-Z]{2}$/.test(lastPart);
  const organizerName = ORGANIZER_MAP[event.name] || event.name;
  const attendanceMode = getAttendanceMode(event.location);
  const year = event.startDate.split("-")[0];

  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.name,
    description: event.description,
    startDate: event.startDate,
    endDate: event.endDate,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: attendanceMode,
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
    image: ["https://vr.org/og-image.png"],
    organizer: {
      "@type": "Organization",
      name: organizerName,
      url: event.url,
    },
    performer: {
      "@type": "Organization",
      name: organizerName,
    },
    offers: {
      "@type": "Offer",
      url: event.url,
      availability: "https://schema.org/InStock",
      validFrom: `${year}-01-01`,
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
