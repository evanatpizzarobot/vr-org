import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
  StructuredData,
  breadcrumbSchema,
  faqPageSchema,
  itemListSchema,
} from "@/components/StructuredData";
import { RecentArticles } from "@/components/RecentArticles";
import { AllPillarGuides } from "@/components/RelatedGuides";
import { AdSlot } from "@/components/AdSlot";
import { AD_SLOTS } from "@/lib/ads";
import { FaqSection } from "@/components/SpokeBlocks";
import {
  getReleaseDates,
  sortReleaseItems,
  type ReleaseCategory,
  type ReleaseItem,
} from "@/lib/release-dates";

// Force per-request rendering so edits to data/release-dates.json (which is
// volume-mounted on the VPS) go live without a Docker rebuild, matching the
// tracker's no-rebuild refresh design.
export const dynamic = "force-dynamic";

export const metadata = {
  title: "VR Release Dates 2026: Every Headset, Game & Accessory Coming Out | VR.org",
  description:
    "Live tracker of every upcoming VR and AR release. Valve Steam Frame, Pico Project Swan, Android XR glasses, and the VR games coming in 2026, with confirmed, expected, and rumored dates.",
  openGraph: {
    title: "VR Release Dates 2026: Every Headset, Game & Accessory Coming Out | VR.org",
    description:
      "Every upcoming VR headset, game, and accessory in one live tracker, with confirmed, expected, and rumored dates.",
    url: "https://vr.org/vr-release-dates",
    siteName: "VR.org",
    images: [
      {
        url: "https://vr.org/og-image.png",
        width: 1200,
        height: 630,
        alt: "VR Release Dates 2026 - VR.org",
      },
    ],
  },
  twitter: {
    card: "summary_large_image" as const,
    title: "VR Release Dates 2026: Every Headset, Game & Accessory | VR.org",
    description:
      "Every upcoming VR headset, game, and accessory in one live tracker.",
    images: ["https://vr.org/og-image.png"],
  },
  alternates: {
    canonical: "https://vr.org/vr-release-dates",
  },
};

const SECTIONS: { key: ReleaseCategory; title: string; blurb: string }[] = [
  {
    key: "headset",
    title: "VR headsets",
    blurb:
      "Full headsets, from the imminent Valve Steam Frame to the 2027 wave. Released models drop to the bottom of the list.",
  },
  {
    key: "glasses",
    title: "Smart glasses and AR",
    blurb:
      "Display glasses and AI glasses across Android XR, Snap, Apple, and the tethered players.",
  },
  {
    key: "game",
    title: "VR games",
    blurb:
      "Dated and windowed game launches. Games with no signal beyond an announcement are listed as TBA.",
  },
  {
    key: "accessory",
    title: "Accessories and more",
    blurb:
      "Controllers, treadmills, battery kits, and the hardware orbiting the headsets.",
  },
];

const STATUS_NOTE: Record<string, string> = {
  confirmed: "an exact date or month stated by the maker",
  expected: "an official window like a quarter or season, or a stated target",
  rumored: "leaks, filings, and supply-chain reporting the maker has not confirmed",
  released: "shipped recently and kept here briefly for reference",
};

function formatUpdated(iso: string): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

function ReleaseRow({ item }: { item: ReleaseItem }) {
  return (
    <div className="release-row" id={item.id}>
      <span className="release-name">
        {item.link ? <a href={item.link}>{item.name}</a> : item.name}
      </span>
      <span className={`release-badge release-badge-${item.status}`}>
        {item.status}
      </span>
      <span className="release-date">{item.dateText}</span>
      <span className="release-meta">
        {item.summary}
        {item.price ? ` Price: ${item.price}.` : ""}
        {item.platforms.length > 0 && (
          <>
            {" "}
            <span className="release-platforms">
              {item.platforms.join(" / ")}
            </span>
          </>
        )}
      </span>
    </div>
  );
}

export default function VRReleaseDatesPage() {
  const data = getReleaseDates();
  const updated = formatUpdated(data.lastUpdated);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "VR Release Dates 2026: Every Headset, Game, and Accessory Coming Out",
    datePublished: "2026-07-04",
    dateModified: data.lastUpdated || "2026-07-04",
    author: { "@type": "Organization", name: "VR.org", url: "https://vr.org" },
    publisher: {
      "@type": "Organization",
      name: "VR.org",
      url: "https://vr.org",
      logo: { "@type": "ImageObject", url: "https://vr.org/logo.png" },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": "https://vr.org/vr-release-dates",
    },
    image: "https://vr.org/og-image.png",
  };

  const breadcrumbs = breadcrumbSchema([
    { name: "Home", url: "https://vr.org" },
    { name: "Hardware", url: "https://vr.org/hardware" },
    { name: "VR Release Dates 2026", url: "https://vr.org/vr-release-dates" },
  ]);

  const upcoming = sortReleaseItems(
    data.items.filter((i) => i.status !== "released")
  );
  const trackerList = itemListSchema(
    "Upcoming VR and AR Releases 2026",
    upcoming.map((i) => ({
      name: i.name,
      ...(i.link && {
        url: i.link.startsWith("http") ? i.link : `https://vr.org${i.link}`,
      }),
    }))
  );

  const faq = faqPageSchema([
    {
      question: "When does the Valve Steam Frame come out?",
      answer:
        "Valve has confirmed a summer 2026 window for the Steam Frame, and as of early July the reservation window is expected imminently, likely following the same short-notice lottery format as the Steam Machine. There is no official price yet; analyst estimates cluster between $899 and $1,199. Our dedicated Steam Frame page tracks every signal as it lands.",
    },
    {
      question: "What new VR headsets are coming out in 2026?",
      answer:
        "The headliner is Valve's Steam Frame, confirmed for summer 2026. Samsung's Galaxy XR reaches the UK on July 8, and Pico's Project Swan, a Vision Pro competitor with 4000+ PPI micro-OLED displays, targets late 2026. The Meta Quest 4 is not a 2026 product; reporting points to 2027.",
    },
    {
      question: "What VR games are coming out in 2026?",
      answer:
        "Firm dates on the calendar include Cave Crave in July, Transformers: Beyond Reality Redux on September 3, and The Lightkeepers on September 10. Windowed for this year are Payday: Aces High, Breachers: Outbreak, Project Hail Mary: Journey Among the Stars, the Quest version of FNAF: Secret of the Mimic, Sol Protocol's September early access, and more.",
    },
    {
      question: "What do confirmed, expected, and rumored mean on this tracker?",
      answer:
        "Confirmed means the maker has stated an exact date or month. Expected means an official window such as a season or quarter, or a stated target that could still move. Rumored means the signal comes from leaks, regulatory filings, or supply-chain reporting that the maker has not confirmed. Items are re-verified against our reporting on every update.",
    },
    {
      question: "How often is this page updated?",
      answer:
        "The tracker runs on a weekly verification cycle, and major beats like a Steam Frame price reveal are reflected the day they land. Every entry links to the VR.org coverage it is sourced from, and the last-updated date at the top of the page reflects the most recent real change.",
    },
  ]);

  return (
    <>
      <StructuredData data={articleSchema} />
      <StructuredData data={breadcrumbs} />
      <StructuredData data={trackerList} />
      <StructuredData data={faq} />
      <Header articleCount={0} lastUpdated="" />

      <main
        className="max-w-[720px] mx-auto px-6 py-16"
        style={{ color: "var(--text-primary)" }}
      >
        <h1
          className="font-display text-4xl font-bold mb-3"
          style={{ letterSpacing: "-0.5px" }}
        >
          VR Release Dates 2026: Every Headset, Game, and Accessory Coming Out
        </h1>

        {updated && (
          <p className="text-sm mb-3" style={{ color: "var(--text-muted)" }}>
            Last updated: {updated}
          </p>
        )}

        <p className="text-[13px] mb-8" style={{ color: "var(--text-muted)" }}>
          Companion to our{" "}
          <a
            href="/upcoming-vr-headsets-2026"
            className="no-underline hover:underline"
            style={{ color: "var(--accent-cyan)" }}
          >
            upcoming VR headsets guide
          </a>{" "}
          and the{" "}
          <a
            href="/events"
            className="no-underline hover:underline"
            style={{ color: "var(--accent-cyan)" }}
          >
            events calendar
          </a>
          .
        </p>

        {/* Definitional lede for AI Overview capture */}
        <p
          className="text-[15px] leading-[1.7] mb-6"
          style={{ color: "var(--text-secondary)" }}
        >
          This is the VR.org release date tracker: every upcoming VR headset,
          pair of smart glasses, game, and accessory with a real signal behind
          it, in one dated list. The headline entry right now is Valve&apos;s{" "}
          <a
            href="/steam-frame"
            className="no-underline hover:underline"
            style={{ color: "var(--accent-cyan)" }}
          >
            Steam Frame
          </a>
          , confirmed for summer 2026 with reservations expected any day. Every
          entry links to the VR.org reporting it is sourced from, and each one
          carries a status badge so you can tell a maker-stated date from a
          leak.
        </p>

        <p
          className="text-[13.5px] leading-[1.7] mb-10"
          style={{ color: "var(--text-secondary)" }}
        >
          How to read the badges:{" "}
          {Object.entries(STATUS_NOTE).map(([status, note], i, arr) => (
            <span key={status}>
              <span className={`release-badge release-badge-${status}`}>
                {status}
              </span>{" "}
              means {note}
              {i < arr.length - 1 ? ". " : "."}
            </span>
          ))}
        </p>

        {SECTIONS.map((section, idx) => {
          const items = sortReleaseItems(
            data.items.filter((i) => i.category === section.key)
          );
          if (items.length === 0) return null;
          return (
            <section key={section.key} aria-labelledby={`heading-${section.key}`}>
              <h2
                id={`heading-${section.key}`}
                className="font-display text-2xl font-bold mt-10 mb-2"
              >
                {section.title}
              </h2>
              <p
                className="text-[13.5px] mb-4"
                style={{ color: "var(--text-muted)" }}
              >
                {section.blurb}
              </p>
              <div className="mb-6">
                {items.map((item) => (
                  <ReleaseRow key={item.id} item={item} />
                ))}
              </div>
              {idx === 0 && (
                <div className="my-8">
                  <AdSlot slot={AD_SLOTS.pillar} format="horizontal" />
                </div>
              )}
            </section>
          );
        })}

        <h2 className="font-display text-2xl font-bold mt-10 mb-3">
          How this tracker works
        </h2>
        <p
          className="text-[15px] leading-[1.7] mb-4"
          style={{ color: "var(--text-secondary)" }}
        >
          Every entry is sourced from VR.org reporting, and the link on each
          product goes to our deepest coverage of it. We re-verify dates weekly
          and on every major news beat: statuses move from rumored to expected
          to confirmed as the signals firm up, shipped products briefly show a
          released badge before rotating off, and nothing gets a date this page
          cannot back up. For the full story on the biggest entry, see our{" "}
          <a
            href="/steam-frame"
            className="no-underline hover:underline"
            style={{ color: "var(--accent-cyan)" }}
          >
            Valve Steam Frame hub
          </a>
          ; for buying advice on hardware you can get today, start with the{" "}
          <a
            href="/best-vr-headsets"
            className="no-underline hover:underline"
            style={{ color: "var(--accent-cyan)" }}
          >
            best VR headsets guide
          </a>
          .
        </p>

        <FaqSection schema={faq} />

        <RecentArticles heading="Latest VR News" limit={5} />
        <AllPillarGuides exclude="vr-release-dates" />
      </main>

      <Footer />
    </>
  );
}
