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
  getCreators,
  creatorsInBeat,
  type Creator,
  type CreatorBeat,
} from "@/lib/vr-creators";

// Force per-request rendering so roster edits to data/vr-creators.json (volume
// mounted on the VPS) go live without a Docker rebuild, matching the release
// tracker's no-rebuild refresh design.
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Best VR YouTubers & Creators 2026: 22 Channels Worth Following | VR.org",
  description:
    "A curated directory of the best VR YouTube channels in 2026, grouped by what they cover. Nathie, Naysy, Cas and Chary XR, MRTV, Beardo Benjo, Without Parole, plus the Spanish, German, Japanese, and Korean creators worth knowing.",
  openGraph: {
    title: "Best VR YouTubers & Creators 2026: 22 Channels Worth Following | VR.org",
    description:
      "The VR channels worth following, grouped by beat: news, games and mods, headsets, smart glasses, developer tutorials, and four languages beyond English.",
    url: "https://vr.org/vr-youtubers",
    siteName: "VR.org",
    images: [
      {
        url: "https://vr.org/og-image.png",
        width: 1200,
        height: 630,
        alt: "Best VR YouTubers and Creators 2026 - VR.org",
      },
    ],
  },
  twitter: {
    card: "summary_large_image" as const,
    title: "Best VR YouTubers & Creators 2026: 22 Channels Worth Following | VR.org",
    description:
      "A curated directory of the best VR YouTube channels, grouped by what they cover.",
    images: ["https://vr.org/og-image.png"],
  },
  alternates: {
    canonical: "https://vr.org/vr-youtubers",
  },
};

const BEATS: { key: CreatorBeat; title: string; blurb: string }[] = [
  {
    key: "news",
    title: "VR news and general coverage",
    blurb:
      "Broad coverage across Quest, PC VR, and PlayStation. Start here if you only want to follow one or two channels.",
  },
  {
    key: "games",
    title: "Games, mods, and ports",
    blurb:
      "Reviews, first looks, and the VR mod scene. Between them these three cover Quest, PC VR, and PSVR2 without much overlap.",
  },
  {
    key: "hardware",
    title: "Headsets and smart glasses",
    blurb:
      "The review bench. Worth noting how much of this beat is now glasses rather than headsets.",
  },
  {
    key: "leaks",
    title: "Leaks and unreleased hardware",
    blurb:
      "For the headsets nobody has announced yet.",
  },
  {
    key: "culture",
    title: "Social VR and VRChat",
    blurb:
      "What life inside the social platforms is actually like, as opposed to what the hardware can do.",
  },
  {
    key: "howto",
    title: "Setup, fixes, and getting it running",
    blurb:
      "The unglamorous work of making the hardware do what it promised.",
  },
  {
    key: "fitness",
    title: "VR fitness",
    blurb:
      "Treated as a routine rather than a novelty, which is rarer than it should be.",
  },
  {
    key: "developer",
    title: "For developers",
    blurb:
      "If you are building in Unity or wiring up XR interactions, start here rather than with the consumer channels.",
  },
  {
    key: "international",
    title: "Beyond English",
    blurb:
      "The part of this page most likely to show you something new. The largest VR channel we found anywhere is in this group, and so is the smallest.",
  },
];

function CreatorCard({ creator }: { creator: Creator }) {
  return (
    <div
      id={creator.id}
      className="py-5 border-t"
      style={{ borderColor: "var(--border)" }}
    >
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-1">
        <a
          href={creator.url}
          target="_blank"
          rel="noopener"
          className="font-display text-lg font-bold no-underline hover:underline"
          style={{ color: "var(--text-primary)" }}
        >
          {creator.name}
        </a>
        <span
          className="font-mono text-[11px]"
          style={{ color: "var(--text-muted)" }}
        >
          {creator.handle}
        </span>
      </div>

      <p
        className="font-mono text-[11px] uppercase tracking-[0.5px] mb-2"
        style={{ color: "var(--text-muted)" }}
      >
        {creator.subsText} subscribers &middot; {creator.language}
      </p>

      <p
        className="text-[14.5px] leading-[1.7]"
        style={{ color: "var(--text-secondary)" }}
      >
        {creator.note}
        {creator.link && (
          <>
            {" "}
            <a
              href={creator.link}
              className="no-underline hover:underline"
              style={{ color: "var(--accent-cyan)" }}
            >
              Our coverage &rarr;
            </a>
          </>
        )}
      </p>
    </div>
  );
}

export default function VRYouTubersPage() {
  const data = getCreators();
  const total = data.creators.length;
  const languages = new Set(
    data.creators.map((c) => c.language.split(",")[0].trim())
  ).size;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "The VR Creators Worth Following in 2026",
    datePublished: "2026-08-14",
    dateModified: data.lastUpdated || "2026-08-14",
    author: { "@type": "Organization", name: "VR.org", url: "https://vr.org" },
    publisher: {
      "@type": "Organization",
      name: "VR.org",
      url: "https://vr.org",
      logo: { "@type": "ImageObject", url: "https://vr.org/logo.png" },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": "https://vr.org/vr-youtubers",
    },
    image: "https://vr.org/og-image.png",
  };

  const breadcrumbs = breadcrumbSchema([
    { name: "Home", url: "https://vr.org" },
    { name: "Originals", url: "https://vr.org/originals" },
    { name: "VR Creators Worth Following", url: "https://vr.org/vr-youtubers" },
  ]);

  const creatorList = itemListSchema(
    "VR Creators Worth Following in 2026",
    data.creators.map((c) => ({ name: c.name, url: c.url }))
  );

  const faq = faqPageSchema([
    {
      question: "Who is the biggest VR YouTuber?",
      answer:
        "In English, Nathie, at roughly 810,000 subscribers and more than 1,500 videos, followed by Naysy at roughly 780,000. Globally it is not close: the Spanish-language channel Virtumaniacos has roughly 3.7 million subscribers, more than four times the largest English VR channel. Syrmor has a larger subscriber count than Nathie at roughly 1 million, but works in a different form, editing VRChat interviews into short documentaries.",
    },
    {
      question: "Which VR YouTuber should I follow for PSVR2?",
      answer:
        "Without Parole, whose catalogue runs to thousands of videos almost entirely about PlayStation VR2, covering reviews, trailers, and a regular podcast. Gamertag VR also reviews PSVR2 releases alongside Quest and PC VR, and uses a blunt buy, wait for a sale, or ignore verdict rather than a score.",
    },
    {
      question: "Which VR channels cover smart glasses rather than headsets?",
      answer:
        "Tyriel Wood is the most focused on them, covering VITURE Pro 2, XREAL DNA, and camera-free glasses like the Memomind One and Even G2, usually after wearing them for an extended period. Cas and Chary XR cover glasses alongside headsets, and BMFVR mixes smart glasses testing with mixed reality work on Quest 3.",
    },
    {
      question: "Are there good VR YouTube channels that are not in English?",
      answer:
        "Yes, and one of them is the largest VR channel we found anywhere. Virtumaniacos is Spanish-language with roughly 3.7 million subscribers. VoodooDE VR is a German creator who runs a separate English-language channel. Okurasu VR covers the Japanese Quest scene as a Meta Quest ambassador. SideBook VR is Korean, has 568 subscribers, and ran the Half-Life 2 Quest 3 standalone test three days before that story reached a large audience.",
    },
    {
      question: "How was this list put together?",
      answer:
        "Every channel was opened directly and its figures read from that channel's own page rather than copied from another roundup, then judged on what it actually publishes rather than on audience size alone. That is why several very large channels are absent and why a 568-subscriber Korean channel is included. The page is grouped by beat and is not ranked.",
    },
  ]);

  return (
    <>
      <StructuredData data={articleSchema} />
      <StructuredData data={breadcrumbs} />
      <StructuredData data={creatorList} />
      <StructuredData data={faq} />
      <Header articleCount={0} lastUpdated="" />

      <main
        className="max-w-[720px] mx-auto px-6 py-16"
        style={{ color: "var(--text-primary)" }}
      >
        <h1
          className="font-display text-4xl font-bold mb-4"
          style={{ letterSpacing: "-0.5px" }}
        >
          The VR Creators Worth Following in 2026
        </h1>

        <p
          className="text-[15px] leading-[1.7] mb-5"
          style={{ color: "var(--text-secondary)" }}
        >
          {total} channels making VR worth watching, grouped by what they
          actually cover so you can skip to the part you care about. Some review
          headsets. Some live in the mod scene. One of them interviews strangers
          inside VRChat and turns it into documentary.
        </p>

        <p
          className="text-[15px] leading-[1.7] mb-5"
          style={{ color: "var(--text-secondary)" }}
        >
          This is not ranked and it is not ordered by size. We opened every
          channel rather than copying another site&apos;s roundup, and the test
          for inclusion was simple: is this worth someone&apos;s evening? That is
          how a Korean channel with 568 subscribers ends up here alongside one
          with 3.7 million.
        </p>

        <p
          className="text-[15px] leading-[1.7] mb-8"
          style={{ color: "var(--text-secondary)" }}
        >
          {languages} languages are represented. If you only ever watch VR
          coverage in English, the last section is the one to scroll to.
        </p>

        <nav aria-label="Jump to section" className="flex flex-wrap gap-2 mb-10">
          {BEATS.filter((b) => creatorsInBeat(data, b.key).length > 0).map(
            (b) => (
              <a
                key={b.key}
                href={`#heading-${b.key}`}
                className="font-mono text-[11px] uppercase tracking-[0.5px] no-underline px-3 py-1.5 rounded-full border transition-colors hover:!text-[var(--accent-cyan)] hover:!border-[var(--accent-cyan)]"
                style={{
                  color: "var(--text-secondary)",
                  borderColor: "var(--border)",
                }}
              >
                {b.title}
              </a>
            )
          )}
        </nav>

        {BEATS.map((beat, idx) => {
          const list = creatorsInBeat(data, beat.key);
          if (list.length === 0) return null;
          return (
            <section key={beat.key} aria-labelledby={`heading-${beat.key}`}>
              <h2
                id={`heading-${beat.key}`}
                className="font-display text-2xl font-bold mt-10 mb-2"
              >
                {beat.title}
              </h2>
              <p
                className="text-[13.5px] leading-[1.6] mb-2"
                style={{ color: "var(--text-muted)" }}
              >
                {beat.blurb}
              </p>
              <div className="mb-6">
                {list.map((c) => (
                  <CreatorCard key={c.id} creator={c} />
                ))}
              </div>
              {idx === 1 && (
                <div className="my-8">
                  <AdSlot slot={AD_SLOTS.pillar} format="horizontal" />
                </div>
              )}
            </section>
          );
        })}

        <h2 className="font-display text-2xl font-bold mt-12 mb-3">
          What is missing, and why we are telling you
        </h2>
        <p
          className="text-[15px] leading-[1.7] mb-4"
          style={{ color: "var(--text-secondary)" }}
        >
          Two gaps we could not close honestly. We did not find a Portuguese-language
          VR channel we would actually recommend, and rather than pad the list we
          left the slot empty. Chinese-language VR creators are a bigger omission,
          and mostly a structural one: that conversation largely happens on
          Bilibili rather than YouTube, so a page built around YouTube channels is
          the wrong instrument for finding it. If you know who belongs in either
          slot, we would genuinely like to hear about it.
        </p>

        <h2 className="font-display text-2xl font-bold mt-10 mb-3">
          How this list works
        </h2>
        <p
          className="text-[15px] leading-[1.7] mb-4"
          style={{ color: "var(--text-secondary)" }}
        >
          Every entry was checked by opening the channel itself, not by
          cross-referencing someone else&apos;s list. Subscriber counts are
          rounded on purpose, because an exact figure is wrong within a week.
          Inclusion is judged on what a channel publishes rather than how many
          people watch it. We revisit the roster every 90 days and add creators
          as we come across them, so this will grow. For what to actually put on
          the hardware these channels review, start with our{" "}
          <a
            href="/best-vr-headsets"
            className="no-underline hover:underline"
            style={{ color: "var(--accent-cyan)" }}
          >
            best VR headsets guide
          </a>{" "}
          and the{" "}
          <a
            href="/vr-release-dates"
            className="no-underline hover:underline"
            style={{ color: "var(--accent-cyan)" }}
          >
            release date tracker
          </a>
          .
        </p>

        <FaqSection schema={faq} />

        <RecentArticles heading="Latest VR News" limit={5} />
        <AllPillarGuides exclude="vr-youtubers" />
      </main>

      <Footer />
    </>
  );
}
