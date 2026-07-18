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
import { ComparisonTable, FaqSection } from "@/components/SpokeBlocks";

export const metadata = {
  title: "Great on Frame: Every Verified Steam Frame Game So Far | VR.org",
  description:
    "Valve's Great on Frame page collects every game certified for the Steam Frame headset. The full verified list so far, what the 90 FPS certification requires, and every addition tracked as the catalog grows.",
  openGraph: {
    title: "Great on Frame: Every Verified Steam Frame Game So Far | VR.org",
    description:
      "The full Great on Frame list, what Steam Frame Verified certification requires, and every new addition tracked.",
    url: "https://vr.org/great-on-frame",
    siteName: "VR.org",
    images: [
      {
        url: "https://vr.org/article-images/steam-frame/steam-frame-headset.jpg",
        width: 1920,
        height: 1080,
        alt: "Valve Steam Frame standalone VR headset",
      },
    ],
  },
  twitter: {
    card: "summary_large_image" as const,
    title: "Great on Frame: Every Verified Steam Frame Game So Far",
    description:
      "The full Great on Frame list and every new addition, tracked by VR.org.",
    images: ["https://vr.org/article-images/steam-frame/steam-frame-headset.jpg"],
  },
  alternates: {
    canonical: "https://vr.org/great-on-frame",
  },
};

const LAST_UPDATED = "2026-07-17";

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Great on Frame: Every Steam Frame Verified Game, Tracked",
  datePublished: "2026-07-17",
  dateModified: LAST_UPDATED,
  author: { "@type": "Organization", name: "VR.org", url: "https://vr.org" },
  publisher: {
    "@type": "Organization",
    name: "VR.org",
    url: "https://vr.org",
    logo: { "@type": "ImageObject", url: "https://vr.org/logo.png" },
  },
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": "https://vr.org/great-on-frame",
  },
  image: "https://vr.org/article-images/steam-frame/steam-frame-headset.jpg",
};

const breadcrumbs = breadcrumbSchema([
  { name: "Home", url: "https://vr.org" },
  { name: "Valve Steam Frame", url: "https://vr.org/steam-frame" },
  { name: "Great on Frame", url: "https://vr.org/great-on-frame" },
]);

interface VerifiedGame {
  name: string;
  developer: string;
  type: "VR" | "Flatscreen";
  added: string;
  note: string;
}

// Source of truth for the verified list. Append on every addition and mirror
// each change in the CHANGELOG below; the audit registry tracks this page on a
// 14-day cadence but the real cadence is every catalog beat until launch.
const VERIFIED_GAMES: VerifiedGame[] = [
  {
    name: "The Lab",
    developer: "Valve",
    type: "VR",
    added: "Jul 13, 2026",
    note: "Valve's 2016 VR minigame collection, the original room-scale showcase, now certified on its own standalone hardware.",
  },
  {
    name: "Aperture Hand Lab",
    developer: "Valve",
    type: "VR",
    added: "Jul 13, 2026",
    note: "The 2019 hand-interaction demo built to show off Index controller finger tracking, recertified for the Frame's controllers.",
  },
  {
    name: "Portal 2",
    developer: "Valve",
    type: "Flatscreen",
    added: "Jul 13, 2026",
    note: "Not a VR game at all. Its badge covers standalone flatscreen play on-device through Proton, with full Frame controller support.",
  },
  {
    name: "Into Black",
    developer: "The Binary Mill",
    type: "VR",
    added: "Jul 13, 2026",
    note: "The cave-diving VR adventure was one of the first third-party games certified, a strong pick for showing off on-device rendering.",
  },
  {
    name: "Titan Isles",
    developer: "Psytec Games",
    type: "VR",
    added: "Jul 13, 2026",
    note: "A VR adventure from the studio behind Windlands, a series practically built on smooth locomotion holding a high frame rate.",
  },
  {
    name: "Underdogs",
    developer: "One Hamsa",
    type: "VR",
    added: "Jul 14, 2026",
    note: "The physical mech brawler is one of the most demanding arm-workout games in VR, which makes its 90 FPS badge a real statement.",
  },
  {
    name: "Ancient Dungeon",
    developer: "Eric Thullen",
    type: "VR",
    added: "Jul 14, 2026",
    note: "The solo-developed voxel roguelite that punches far above its weight. A natural fit for standalone hardware.",
  },
  {
    name: "Slots & Diapers",
    developer: "Independent",
    type: "Flatscreen",
    added: "Jul 14, 2026",
    note: "Like Portal 2, a flatscreen title. Its inclusion signals Valve wants the Frame judged as a general Steam machine, not only a VR headset.",
  },
];

interface ChangelogEntry {
  date: string;
  text: string;
}

const CHANGELOG: ChangelogEntry[] = [
  {
    date: "Jul 14, 2026",
    text: "Underdogs, Ancient Dungeon, and Slots & Diapers added, bringing the list to eight.",
  },
  {
    date: "Jul 13, 2026",
    text: "Great on Frame page discovered live on Steam with five titles: Portal 2, The Lab, Aperture Hand Lab, Into Black, and Titan Isles.",
  },
];

const gamesList = itemListSchema(
  "Great on Frame verified Steam Frame games",
  VERIFIED_GAMES.map((g) => ({ name: g.name }))
);

const faq = faqPageSchema([
  {
    question: "What is Great on Frame?",
    answer:
      "Great on Frame is a curated Steam storefront section, live at store.steampowered.com/greatonframe, that collects every game certified to run well on the Steam Frame, Valve's upcoming standalone VR headset. It is the VR sibling of Great on Deck, the label that told Steam Deck buyers which games would actually play well on the hardware.",
  },
  {
    question: "Which games are Great on Frame right now?",
    answer:
      "Eight titles as of July 17, 2026: The Lab, Aperture Hand Lab, Portal 2, Into Black, Titan Isles, Underdogs, Ancient Dungeon, and Slots & Diapers. Three are Valve's own, and two of the eight (Portal 2 and Slots & Diapers) are flatscreen games rather than VR titles.",
  },
  {
    question: "What does Steam Frame Verified require?",
    answer:
      "Standalone VR titles must hold 90 FPS on-device, stricter than the 72Hz baselines Meta and Pico accept for their own certification tiers. Standalone flatscreen titles need at least 720p at 30 FPS with full Steam Frame controller support and a working default configuration. The badge is a recommendation rather than a gate.",
  },
  {
    question: "Why are flatscreen games like Portal 2 on a VR headset list?",
    answer:
      "The Steam Frame runs SteamOS and plays regular Steam games on-device through Proton, displayed on a virtual screen, with controllers that double as a gamepad. Certifying flatscreen titles signals that Valve wants the Frame treated as a portable Steam machine that also does VR, not a VR-only device.",
  },
  {
    question: "Do streamed PC VR games need the Great on Frame badge?",
    answer:
      "No. The certification applies to games running on the headset itself. Anything streamed from a gaming PC over the Frame's dedicated 6GHz wireless dongle is exempt, because performance there depends on your PC, not the headset.",
  },
  {
    question: "When does the Steam Frame come out?",
    answer:
      "Valve has confirmed summer 2026 but has not named a day or a price as of July 17, 2026. The Great on Frame page going live is one of the strongest launch signals yet; storefront sections appear when a product is weeks away, not quarters. Our Steam Frame hub tracks every release date and price signal.",
  },
]);

export default function GreatOnFramePage() {
  return (
    <>
      <StructuredData data={articleSchema} />
      <StructuredData data={breadcrumbs} />
      <StructuredData data={gamesList} />
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
          Great on Frame: Every Steam Frame Verified Game, Tracked
        </h1>

        <p className="text-sm mb-3" style={{ color: "var(--text-muted)" }}>
          Last updated: July 17, 2026
        </p>

        <p className="text-[13px] mb-8" style={{ color: "var(--text-muted)" }}>
          Part of our{" "}
          <a
            href="/steam-frame"
            className="no-underline hover:underline"
            style={{ color: "var(--accent-cyan)" }}
          >
            Steam Frame hub
          </a>
          . For the launch picture, see the{" "}
          <a
            href="/steam-frame-release-date"
            className="no-underline hover:underline"
            style={{ color: "var(--accent-cyan)" }}
          >
            release date tracker
          </a>{" "}
          and{" "}
          <a
            href="/steam-frame-price"
            className="no-underline hover:underline"
            style={{ color: "var(--accent-cyan)" }}
          >
            price tracker
          </a>
          .
        </p>

        {/* Definitional lede for AI Overview capture */}
        <p
          className="text-[15px] leading-[1.7] mb-8"
          style={{ color: "var(--text-secondary)" }}
        >
          Great on Frame is Valve&apos;s curated Steam section for games
          certified to run well on the Steam Frame headset, the VR sibling of
          the Great on Deck label that shaped Steam Deck buying for four years.
          The page went live in mid July 2026 and lists eight titles as of July
          17: three from Valve and five from third parties, including two
          flatscreen games. This page tracks every title on the list, what the
          certification actually requires, and every addition as Valve fills
          the shelves ahead of launch.
        </p>

        <figure className="pillar-figure">
          <img
            src="/article-images/steam-frame/steam-frame-headset.jpg"
            alt="Valve Steam Frame standalone VR headset shown at a three-quarter angle with the Valve logo on the head strap"
            width={1920}
            height={1080}
            loading="lazy"
          />
          <figcaption>Image: Valve</figcaption>
        </figure>

        <h2 className="font-display text-2xl font-bold mt-10 mb-3">
          The full Great on Frame list
        </h2>
        <p
          className="text-[15px] leading-[1.7] mb-4"
          style={{ color: "var(--text-secondary)" }}
        >
          Eight games carry the badge as of July 17, 2026. The list launched
          with five titles the week of July 13 and grew by three within a day,
          which is exactly the cadence you would expect from a company
          stocking shelves before opening the doors.
        </p>
        <ComparisonTable
          caption="Every game on Valve's Great on Frame page, in the order they appeared. VR titles must hold 90 FPS on-device; flatscreen titles need 720p at 30 FPS with full controller support."
          columns={["Game", "Developer", "Type", "Listed"]}
          rows={VERIFIED_GAMES.map((g) => [g.name, g.developer, g.type, g.added])}
        />

        <div className="mb-6">
          {VERIFIED_GAMES.map((g) => (
            <div key={g.name} className="release-row">
              <span className="release-date" style={{ marginLeft: 0 }}>
                {g.name}
              </span>
              <span className="release-meta">{g.note}</span>
            </div>
          ))}
        </div>

        <div className="my-8">
          <AdSlot slot={AD_SLOTS.pillar} format="horizontal" />
        </div>

        <h2 className="font-display text-2xl font-bold mt-10 mb-3">
          What the badge actually certifies
        </h2>
        <p
          className="text-[15px] leading-[1.7] mb-4"
          style={{ color: "var(--text-secondary)" }}
        >
          Great on Frame is the shop window for the{" "}
          <a
            href="/articles/steam-frame-verified-90fps-stricter-than-quest-pico"
            className="no-underline hover:underline"
            style={{ color: "var(--accent-cyan)" }}
          >
            Steam Frame Verified program
          </a>{" "}
          Valve announced at GDC 2026, and the bar is not gentle. A standalone
          VR title has to hold 90 frames per second running on the
          headset&apos;s Snapdragon 8 Gen 3, stricter than the 72Hz baselines
          Meta and Pico accept for their own stores. The reasoning is
          physiological rather than cosmetic: on a Steam Deck a frame dip is an
          annoyance, but in a headset it is a fast route to motion sickness.
          The badge is Valve personally vouching that a game will not make you
          queasy.
        </p>
        <p
          className="text-[15px] leading-[1.7] mb-4"
          style={{ color: "var(--text-secondary)" }}
        >
          Flatscreen games have their own track: at least 720p at 30 FPS
          on-device, a working default control scheme, and full support for the
          Frame controllers, which put a D-pad on the left hand and face
          buttons on the right precisely so they can double as a gamepad.
          Streamed PC VR content is exempt from all of it, because performance
          over the 6GHz dongle depends on the PC doing the rendering.
        </p>

        <h2 className="font-display text-2xl font-bold mt-10 mb-3">
          Why this list is worth tracking
        </h2>
        <p
          className="text-[15px] leading-[1.7] mb-4"
          style={{ color: "var(--text-secondary)" }}
        >
          Deck Verified quietly became one of the most influential systems
          Valve ever shipped. It changed the performance targets developers
          aimed at and changed what people bought, because a green checkmark on
          a store page moves units. Valve is now running the same play for VR,
          a category that has always struggled to tell newcomers which of its
          thousands of titles are actually worth buying.{" "}
          <a
            href="/articles/valve-great-on-frame-steam-page-steam-frame-launch-signal"
            className="no-underline hover:underline"
            style={{ color: "var(--accent-cyan)" }}
          >
            We covered why the page&apos;s existence is itself a launch signal
          </a>
          : Valve does not build customer-facing storefront sections for
          products it plans to sell next year.
        </p>
        <p
          className="text-[15px] leading-[1.7] mb-4"
          style={{ color: "var(--text-secondary)" }}
        >
          The growth rate of this list is also the best public proxy for launch
          timing. The Frame has{" "}
          <a
            href="/articles/steam-frame-no-launch-game-reckoning-2026"
            className="no-underline hover:underline"
            style={{ color: "var(--accent-cyan)" }}
          >
            no first-party launch game
          </a>
          , so the certified catalog is the launch lineup. Eight titles is not
          a lineup yet. Watch how fast that number climbs; it will tell you
          more about the release date than any shipping manifest.
        </p>

        <h2 className="font-display text-2xl font-bold mt-10 mb-3">
          List changelog
        </h2>
        <p
          className="text-[14px] leading-[1.6] mb-4"
          style={{ color: "var(--text-muted)" }}
        >
          Every change to the Great on Frame catalog since the page appeared,
          newest first.
        </p>
        <div className="mb-6">
          {CHANGELOG.map((entry) => (
            <div key={entry.date + entry.text.slice(0, 12)} className="release-row">
              <span className="release-date" style={{ marginLeft: 0 }}>
                {entry.date}
              </span>
              <span className="release-meta">{entry.text}</span>
            </div>
          ))}
        </div>

        <FaqSection schema={faq} />

        <RecentArticles heading="Latest Gaming News" limit={5} tag="gaming" />
        <AllPillarGuides exclude="great-on-frame" />
      </main>

      <Footer />
    </>
  );
}
