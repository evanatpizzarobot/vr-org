import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { StructuredData, breadcrumbSchema } from "@/components/StructuredData";
import { RecentArticles } from "@/components/RecentArticles";
import { AdSlot } from "@/components/AdSlot";
import { AD_SLOTS } from "@/lib/ads";

export const metadata: Metadata = {
  title: "Best Of 2026: Top VR Headsets, Games, Apps & Gear | VR.org",
  description:
    "VR.org's complete collection of best-of guides for 2026. Top VR headsets, best VR games, AR glasses, fitness apps, and gear recommendations from our editorial team.",
  alternates: {
    canonical: "https://vr.org/best-of",
  },
  openGraph: {
    title: "Best Of 2026: Top VR Headsets, Games, Apps & Gear | VR.org",
    description:
      "VR.org's complete collection of best-of guides for 2026. Top VR headsets, best VR games, AR glasses, fitness apps, and gear recommendations.",
    url: "https://vr.org/best-of",
    type: "website",
    siteName: "VR.org",
    images: [{ url: "https://vr.org/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@vrdotorg",
    title: "Best Of 2026: Top VR Headsets, Games, Apps & Gear | VR.org",
    description:
      "VR.org's complete collection of best-of guides for 2026.",
    images: ["https://vr.org/og-image.png"],
  },
};

const collectionSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Best Of 2026",
  description: "VR.org's complete collection of best-of guides for 2026.",
  url: "https://vr.org/best-of",
  publisher: {
    "@type": "Organization",
    name: "VR.org",
    url: "https://vr.org",
    logo: "https://vr.org/logo.png",
  },
  hasPart: [
    {
      "@type": "Article",
      name: "Best VR Headsets 2026",
      url: "https://vr.org/best-vr-headsets",
    },
    {
      "@type": "Article",
      name: "Best Budget VR Headset 2026",
      url: "https://vr.org/best-budget-vr-headset",
    },
    {
      "@type": "Article",
      name: "Quest 3 vs Quest 3S",
      url: "https://vr.org/quest-3-vs-quest-3s",
    },
    {
      "@type": "Article",
      name: "Quest 3 vs Apple Vision Pro",
      url: "https://vr.org/quest-3-vs-vision-pro",
    },
    {
      "@type": "Article",
      name: "PSVR2 vs Quest 3",
      url: "https://vr.org/psvr2-vs-quest-3",
    },
    {
      "@type": "Article",
      name: "Best VR Headset for Kids 2026",
      url: "https://vr.org/best-vr-headset-for-kids",
    },
    {
      "@type": "Article",
      name: "Best PC VR Headset 2026",
      url: "https://vr.org/best-pc-vr-headset",
    },
    {
      "@type": "Article",
      name: "Best Standalone VR Headset 2026",
      url: "https://vr.org/best-standalone-vr-headset",
    },
    {
      "@type": "Article",
      name: "Best VR Headset for Gaming 2026",
      url: "https://vr.org/best-vr-headset-for-gaming",
    },
    {
      "@type": "Article",
      name: "Best VR Headset for Sim Racing 2026",
      url: "https://vr.org/best-vr-headset-for-sim-racing",
    },
    {
      "@type": "Article",
      name: "Best VR Headset for Movies 2026",
      url: "https://vr.org/best-vr-headset-for-movies",
    },
    {
      "@type": "Article",
      name: "Highest Resolution VR Headset 2026",
      url: "https://vr.org/highest-resolution-vr-headset",
    },
    {
      "@type": "Article",
      name: "Upcoming VR Headsets 2026",
      url: "https://vr.org/upcoming-vr-headsets-2026",
    },
    {
      "@type": "Article",
      name: "VR, AR & XR Release Dates 2026",
      url: "https://vr.org/vr-release-dates",
    },
    {
      "@type": "Article",
      name: "Valve Steam Frame: Everything We Know",
      url: "https://vr.org/steam-frame",
    },
    {
      "@type": "Article",
      name: "Best AR Glasses 2026",
      url: "https://vr.org/ar-glasses",
    },
    {
      "@type": "Article",
      name: "Top 10 VR Games of All Time",
      url: "https://vr.org/best-vr-games",
    },
    {
      "@type": "Article",
      name: "Best VR Games 2026",
      url: "https://vr.org/best-vr-games-2026",
    },
    {
      "@type": "Article",
      name: "Best VR Apps & Utilities 2026",
      url: "https://vr.org/best-vr-apps",
    },
    {
      "@type": "Article",
      name: "Best VR Fitness Apps 2026",
      url: "https://vr.org/best-vr-fitness",
    },
  ],
};

const breadcrumbs = breadcrumbSchema([
  { name: "Home", url: "https://vr.org" },
  { name: "Best Of", url: "https://vr.org/best-of" },
]);

interface BestOfCard {
  title: string;
  description: string;
  href: string;
  badge: string;
  badgeColor: string;
}

const CARDS: BestOfCard[] = [
  {
    title: "Best VR Headsets 2026",
    description:
      "Our picks for the top VR headsets you can buy today. Quest 3, PSVR2, Vision Pro, Galaxy XR, Bigscreen Beyond 2, and what's next.",
    href: "/best-vr-headsets",
    badge: "Hardware",
    badgeColor: "var(--accent-cyan)",
  },
  {
    title: "Best Budget VR Headset 2026",
    description:
      "The cheapest ways into VR under $400. The $349 Quest 3S, PSVR2, and the smartest used Quest buys, plus the bargains to skip.",
    href: "/best-budget-vr-headset",
    badge: "Hardware",
    badgeColor: "var(--accent-cyan)",
  },
  {
    title: "Quest 3 vs Quest 3S",
    description:
      "Same chip, same games, $250 apart. Which Meta Quest to buy, with lenses, resolution, and passthrough compared.",
    href: "/quest-3-vs-quest-3s",
    badge: "Comparison",
    badgeColor: "var(--accent-cyan)",
  },
  {
    title: "Quest 3 vs Apple Vision Pro",
    description:
      "A $599 VR gaming headset versus a $3,499 spatial computer. Displays, input, content, and who each one is for.",
    href: "/quest-3-vs-vision-pro",
    badge: "Comparison",
    badgeColor: "var(--accent-cyan)",
  },
  {
    title: "PSVR2 vs Quest 3",
    description:
      "OLED, eye tracking, and haptics that need a PS5, versus standalone freedom and the biggest VR library.",
    href: "/psvr2-vs-quest-3",
    badge: "Comparison",
    badgeColor: "var(--accent-cyan)",
  },
  {
    title: "Best VR Headset for Kids",
    description:
      "Age-appropriate VR picks, the safety and IPD factors that matter, parental controls, and what to avoid.",
    href: "/best-vr-headset-for-kids",
    badge: "Hardware",
    badgeColor: "var(--accent-cyan)",
  },
  {
    title: "Best PC VR Headset 2026",
    description:
      "Top headsets for SteamVR and PC gaming. The wireless Quest 3, the ultralight Bigscreen Beyond 2, and the Pimax Crystal Light.",
    href: "/best-pc-vr-headset",
    badge: "Hardware",
    badgeColor: "var(--accent-cyan)",
  },
  {
    title: "Best Standalone VR Headset 2026",
    description:
      "All-in-one VR with no PC or console. Quest 3, Quest 3S, Apple Vision Pro, and Samsung Galaxy XR ranked.",
    href: "/best-standalone-vr-headset",
    badge: "Hardware",
    badgeColor: "var(--accent-cyan)",
  },
  {
    title: "Best VR Headset for Gaming",
    description:
      "The headsets built for playing. Quest 3 for wireless freedom, PSVR2 for PS5 exclusives, and the PC picks that push the most frames.",
    href: "/best-vr-headset-for-gaming",
    badge: "Hardware",
    badgeColor: "var(--accent-cyan)",
  },
  {
    title: "Best VR Headset for Sim Racing",
    description:
      "Cockpit-ready picks for iRacing, ACC, and Assetto Corsa, with the clarity, refresh rate, and GPU horsepower they demand.",
    href: "/best-vr-headset-for-sim-racing",
    badge: "Hardware",
    badgeColor: "var(--accent-cyan)",
  },
  {
    title: "Best VR Headset for Movies",
    description:
      "A personal big screen on your face. Vision Pro's pixel density, Quest 3's app library, and the media apps worth installing.",
    href: "/best-vr-headset-for-movies",
    badge: "Hardware",
    badgeColor: "var(--accent-cyan)",
  },
  {
    title: "Highest Resolution VR Headset",
    description:
      "The sharpest displays in VR ranked by real per-eye resolution, from Galaxy XR and Vision Pro to the Pimax Crystal Super.",
    href: "/highest-resolution-vr-headset",
    badge: "Hardware",
    badgeColor: "var(--accent-cyan)",
  },
  {
    title: "Upcoming VR Headsets 2026",
    description:
      "New releases and what's coming next, from the Samsung Galaxy XR to Valve's Steam Frame and the Meta Quest 4.",
    href: "/upcoming-vr-headsets-2026",
    badge: "Hardware",
    badgeColor: "var(--accent-cyan)",
  },
  {
    title: "VR, AR & XR Release Dates 2026",
    description:
      "Every upcoming VR headset, pair of AR glasses, game, and accessory in one live tracker, with confirmed, expected, and rumored dates.",
    href: "/vr-release-dates",
    badge: "Tracker",
    badgeColor: "var(--accent-cyan)",
  },
  {
    title: "Valve Steam Frame: Everything We Know",
    description:
      "The most anticipated headset in VR. Release date signals, price expectations, specs, and every development tracked.",
    href: "/steam-frame",
    badge: "Hardware",
    badgeColor: "var(--accent-cyan)",
  },
  {
    title: "Best AR Glasses 2026",
    description:
      "Smart glasses and AR displays ranked. Ray-Ban Meta, Rokid, XREAL, VITURE, and the next wave.",
    href: "/ar-glasses",
    badge: "AR",
    badgeColor: "var(--accent-magenta)",
  },
  {
    title: "Top 10 VR Games of All Time",
    description:
      "The definitive ranking of the greatest VR games ever made, from Half-Life: Alyx to Beat Saber.",
    href: "/best-vr-games",
    badge: "Gaming",
    badgeColor: "var(--accent-green)",
  },
  {
    title: "Best VR Games 2026",
    description:
      "The top VR games to play right now. New releases, early access hits, and most anticipated.",
    href: "/best-vr-games-2026",
    badge: "Gaming",
    badgeColor: "var(--accent-green)",
  },
  {
    title: "Best VR Apps & Utilities",
    description:
      "Top VR apps for productivity, social, fitness, and creativity. Virtual Desktop, VRChat, and more.",
    href: "/best-vr-apps",
    badge: "Software",
    badgeColor: "var(--accent-blue)",
  },
  {
    title: "Best VR Fitness Apps 2026",
    description:
      "The best VR workout games and fitness apps. Supernatural, FitXR, Beat Saber, and beyond.",
    href: "/best-vr-fitness",
    badge: "Software",
    badgeColor: "var(--accent-blue)",
  },
  {
    title: "VR Gear We Recommend",
    description:
      "Curated picks for headsets, accessories, GPUs, and Steam peripherals at current prices.",
    href: "/deals",
    badge: "Deals",
    badgeColor: "var(--accent-orange)",
  },
];

export default function BestOfPage() {
  return (
    <>
      <StructuredData data={collectionSchema} />
      <StructuredData data={breadcrumbs} />
      <Header articleCount={0} lastUpdated="" />

      <main
        className="max-w-[1100px] mx-auto px-6 py-16"
        style={{ color: "var(--text-primary)" }}
      >
        <h1
          className="font-display text-4xl font-bold mb-4"
          style={{ letterSpacing: "-0.5px" }}
        >
          Best Of 2026
        </h1>
        <p
          className="text-[15px] leading-[1.7] mb-12 max-w-[680px]"
          style={{ color: "var(--text-secondary)" }}
        >
          The VR.org editorial team&apos;s picks for the best headsets, games,
          apps, and gear. Updated regularly as new products launch and rankings
          change.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {CARDS.map((card) => (
            <a
              key={card.href}
              href={card.href}
              className="block rounded-[12px] border no-underline transition-all group relative overflow-hidden hover:translate-y-[-2px]"
              style={{
                background: "var(--bg-card)",
                borderColor: "var(--border)",
                padding: "20px 22px",
              }}
            >
              <span
                className="font-mono text-[10px] font-semibold uppercase tracking-[1.5px] inline-block mb-3"
                style={{ color: card.badgeColor }}
              >
                {card.badge}
              </span>
              <div
                className="font-display font-semibold text-[18px] leading-[1.3] mb-2 group-hover:!text-[var(--accent-cyan)] transition-colors"
                style={{ color: "var(--text-primary)" }}
              >
                {card.title}
              </div>
              <div
                className="text-[13px] leading-[1.6] mb-3"
                style={{ color: "var(--text-secondary)" }}
              >
                {card.description}
              </div>
              <span
                className="font-mono text-[11px] uppercase tracking-[1.5px] inline-flex items-center gap-1 group-hover:!text-[var(--accent-cyan)] transition-colors"
                style={{ color: "var(--text-muted)" }}
              >
                Read guide &rarr;
              </span>
            </a>
          ))}
        </div>

        {/* Ad: bottom of card grid */}
        <div className="my-12">
          <AdSlot slot={AD_SLOTS.pillar} format="auto" />
        </div>

        <p
          className="text-[15px] leading-[1.7] mt-4"
          style={{ color: "var(--text-secondary)" }}
        >
          Looking for the latest VR news? Head to{" "}
          <a
            href="/"
            className="no-underline hover:underline"
            style={{ color: "var(--accent-cyan)" }}
          >
            the feed
          </a>{" "}
          or browse our{" "}
          <a
            href="/originals"
            className="no-underline hover:underline"
            style={{ color: "var(--accent-cyan)" }}
          >
            original articles
          </a>
          .
        </p>

        <RecentArticles heading="Latest VR News" limit={6} />
      </main>

      <Footer />
    </>
  );
}
