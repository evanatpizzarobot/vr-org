import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { StructuredData, breadcrumbSchema } from "@/components/StructuredData";
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
      "Our picks for the top VR headsets you can buy today. Quest 3, PSVR2, Vision Pro, and more.",
    href: "/best-vr-headsets",
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
      "Curated picks for headsets, accessories, and gaming PCs with the best prices.",
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
      </main>

      <Footer />
    </>
  );
}
