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

export const metadata = {
  title: "Best VR Games of 2026: New Releases & Must-Play Titles | VR.org",
  description:
    "The best new VR games released in 2026 so far, plus the most anticipated upcoming titles. Updated regularly throughout the year.",
  openGraph: {
    title: "Best VR Games of 2026: New Releases & Must-Play Titles | VR.org",
    description:
      "The best new VR games released in 2026 so far, plus the most anticipated upcoming titles. Updated regularly throughout the year.",
    url: "https://vr.org/best-vr-games-2026",
    siteName: "VR.org",
    images: [
      {
        url: "https://vr.org/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image" as const,
  },
  alternates: {
    canonical: "https://vr.org/best-vr-games-2026",
  },
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Best VR Games of 2026: New Releases and Must-Play Titles",
  datePublished: "2026-03-24",
  dateModified: "2026-04-20",
  author: {
    "@type": "Organization",
    name: "VR.org",
    url: "https://vr.org",
  },
  publisher: {
    "@type": "Organization",
    name: "VR.org",
    url: "https://vr.org",
    logo: {
      "@type": "ImageObject",
      url: "https://vr.org/logo.png",
    },
  },
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": "https://vr.org/best-vr-games-2026",
  },
  image: "https://vr.org/og-image.png",
};

const breadcrumbs = breadcrumbSchema([
  { name: "Home", url: "https://vr.org" },
  { name: "Gaming", url: "https://vr.org/gaming" },
  { name: "Best VR Games 2026", url: "https://vr.org/best-vr-games-2026" },
]);

const games2026List = itemListSchema("Best VR Games of 2026", [
  { name: "Resident Evil Requiem", url: "https://vr.org/best-vr-games-2026" },
  { name: "Batman: Arkham Shadow", url: "https://vr.org/best-vr-games-2026" },
  { name: "Little Nightmares VR: Altered Echoes", url: "https://vr.org/best-vr-games-2026" },
  { name: "Whatever Valve ships with Steam Frame", url: "https://vr.org/best-vr-games-2026" },
  { name: "Star Trek: Infection", url: "https://vr.org/best-vr-games-2026" },
  { name: "TMNT VR", url: "https://vr.org/best-vr-games-2026" },
  { name: "Aces of Thunder", url: "https://vr.org/best-vr-games-2026" },
  { name: "Microsoft Flight Simulator (PSVR 2)", url: "https://vr.org/best-vr-games-2026" },
]);

const games2026Faq = faqPageSchema([
  {
    question: "What are the best VR games of 2026?",
    answer:
      "The best VR games released in 2026 so far include Batman: Arkham Shadow (carrying momentum from late 2025), the Resident Evil Requiem PC VR mod, and Little Nightmares VR: Altered Echoes. The year is still young, with major releases like Microsoft Flight Simulator on PSVR2, Star Trek: Infection, and Aces of Thunder still on the way.",
  },
  {
    question: "What VR games are coming in 2026?",
    answer:
      "Major VR releases expected in 2026 include Little Nightmares VR: Altered Echoes, Star Trek: Infection, TMNT VR, Aces of Thunder, Microsoft Flight Simulator for PSVR 2, and whatever launch title Valve ships alongside the Steam Frame headset.",
  },
  {
    question: "When does the Steam Frame release?",
    answer:
      "Valve has confirmed the Steam Frame is in development but has not announced a release date. It is expected to launch sometime in 2026, likely bundled with a first-party Valve VR title. The Steam Frame is the most anticipated headset in the VR enthusiast community.",
  },
  {
    question: "Are there new PSVR 2 games in 2026?",
    answer:
      "Yes. Microsoft Flight Simulator is coming to PSVR 2 in 2026, which could be a system-seller. Sony continues to support PSVR 2 with first-party and third-party AAA ports, and the headset now supports PC VR via an official adapter, opening the SteamVR library.",
  },
  {
    question: "What is the best VR game in 2026 so far?",
    answer:
      "Batman: Arkham Shadow is arguably the best VR game available in early 2026, translating Rocksteady's freeflow combat into physical VR punches, counters, and gadget use. It stands out as one of the strongest Quest exclusives to date.",
  },
]);

export default function BestVRGames2026Page() {
  return (
    <>
      <StructuredData data={articleSchema} />
      <StructuredData data={breadcrumbs} />
      <StructuredData data={games2026List} />
      <StructuredData data={games2026Faq} />
      <Header articleCount={0} lastUpdated="" />

      <main
        className="max-w-[720px] mx-auto px-6 py-16"
        style={{ color: "var(--text-primary)" }}
      >
        {/* H1 */}
        <h1
          className="font-display text-4xl font-bold mb-2"
          style={{ letterSpacing: "-0.5px" }}
        >
          Best VR Games of 2026
        </h1>
        <p
          className="text-sm mb-3"
          style={{ color: "var(--text-muted)" }}
        >
          Last updated: March 2026
        </p>

        <p
          className="text-[13px] mb-8"
          style={{ color: "var(--text-muted)" }}
        >
          Part of our{" "}
          <a
            href="/best-of"
            className="no-underline hover:underline"
            style={{ color: "var(--accent-cyan)" }}
          >
            Best Of 2026
          </a>{" "}
          guide collection.
        </p>

        {/* Intro */}
        <p
          className="text-[15px] leading-[1.7] mb-8"
          style={{ color: "var(--text-secondary)" }}
        >
          2026 is shaping up to be one of the biggest years for VR gaming.
          With Valve&apos;s Steam Frame on the horizon and studios pushing
          standalone hardware further than ever, the lineup of new releases
          and upcoming titles is stacked. Here are the best VR games of 2026
          so far, plus the most anticipated titles still on the way.
        </p>

        <a
          href="/deals#gaming-pcs"
          className="block no-underline rounded-[10px] border px-5 py-4 mb-10 transition-all hover:translate-y-[-1px]"
          style={{
            background: "var(--accent-dim)",
            borderColor: "var(--accent-mid)",
            color: "var(--text-primary)",
          }}
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <div
                className="font-display text-[15px] font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                Need a VR-ready PC? &rarr;
              </div>
              <div className="text-[13px] mt-1" style={{ color: "var(--text-secondary)" }}>
                GPU recommendations for the games in this list.
              </div>
            </div>
            <span
              className="font-mono text-[11px] uppercase tracking-[1.5px] whitespace-nowrap"
              style={{ color: "var(--accent-cyan)" }}
            >
              /deals
            </span>
          </div>
        </a>

        {/* Best new releases of 2026 (so far) */}
        <h2 className="font-display text-2xl font-semibold mb-4">
          Best new releases of 2026 (so far)
        </h2>

        {/* Resident Evil Requiem */}
        <h3 className="font-display text-xl font-semibold mb-2">
          Resident Evil Requiem
        </h3>
        <figure className="fitness-figure">
          <img
            src="https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/3764200/ce5437442768e38eb575f205ab9397d0264017b0/header.jpg"
            alt="Resident Evil Requiem key art featuring Grace Ashcroft and Leon S. Kennedy"
            loading="lazy"
          />
        </figure>
        <p
          className="text-[13px] mb-4"
          style={{ color: "var(--text-muted)" }}
        >
          Developer: Capcom | Platform: PC (VR mod available) | Released: March 2026
        </p>
        <p
          className="text-[15px] leading-[1.7] mb-8"
          style={{ color: "var(--text-secondary)" }}
        >
          Capcom&apos;s latest Resident Evil entry already has a PC VR mod
          less than a week after launch. While not an official VR release,
          the modding community has made it functional and the VR community
          is buzzing about it. A reminder that PC VR modding continues to be
          one of the most exciting frontiers in VR gaming.
        </p>

        {/* Batman: Arkham Shadow */}
        <h3 className="font-display text-xl font-semibold mb-2">
          Batman: Arkham Shadow
        </h3>
        <figure className="fitness-figure">
          <img
            src="https://img.youtube.com/vi/EPcCWR3DTIw/maxresdefault.jpg"
            alt="Batman: Arkham Shadow story trailer art for Meta Quest 3"
            loading="lazy"
          />
        </figure>
        <p
          className="text-[13px] mb-4"
          style={{ color: "var(--text-muted)" }}
        >
          Developer: Camouflaj | Platform: Quest | Released: Late 2025 (still peaking in early 2026)
        </p>
        <p
          className="text-[15px] leading-[1.7] mb-8"
          style={{ color: "var(--text-secondary)" }}
        >
          Arkham Shadow carried massive momentum into 2026. The combat
          system translates Rocksteady&apos;s freeflow fighting into physical
          VR punches, counters, and gadget use. The stealth sections where
          you perch on gargoyles and swoop down on enemies feel genuinely
          empowering. It&apos;s the best superhero game in VR by a wide
          margin and one of the strongest Quest exclusives to date.
        </p>

        {/* Little Nightmares VR: Altered Echoes */}
        <h3 className="font-display text-xl font-semibold mb-2">
          Little Nightmares VR: Altered Echoes
        </h3>
        <figure className="fitness-figure">
          <img
            src="https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2482940/d452a2c46f521825dead1bd5fda5a2b6a31d6379/header.jpg"
            alt="Little Nightmares VR: Altered Echoes key art showing Dark Six in a shadowed corridor"
            loading="lazy"
          />
        </figure>
        <p
          className="text-[13px] mb-4"
          style={{ color: "var(--text-muted)" }}
        >
          Developer: Bandai Namco | Platform: TBA | Released: April 2026 (announced)
        </p>
        <p
          className="text-[15px] leading-[1.7] mb-8"
          style={{ color: "var(--text-secondary)" }}
        >
          One of the most anticipated VR releases of the year. Bandai
          Namco&apos;s acclaimed puzzle-platformer franchise is making the
          jump to VR with a new standalone story. If they nail the sense of
          scale and creeping dread that defined the flat screen versions,
          this could be a standout horror experience.
        </p>

        {/* Ad: after New Releases, before Most Anticipated */}
        <div className="my-8">
          <AdSlot slot={AD_SLOTS.pillar} format="horizontal" />
        </div>

        {/* Most anticipated VR games for the rest of 2026 */}
        <h2 className="font-display text-2xl font-semibold mb-4">
          Most anticipated VR games for the rest of 2026
        </h2>

        {/* Whatever Valve ships with Steam Frame */}
        <h3 className="font-display text-xl font-semibold mb-2">
          Whatever Valve ships with Steam Frame
        </h3>
        <figure className="fitness-figure">
          <img
            src="https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/4165890/866449b5fb3696b4c869e954c1e98d1e19df0721/header.jpg"
            alt="Valve Steam Frame wireless VR headset official product image"
            loading="lazy"
          />
        </figure>
        <p
          className="text-[15px] leading-[1.7] mb-8"
          style={{ color: "var(--text-secondary)" }}
        >
          Nobody knows for certain what Valve is planning to launch alongside
          the Steam Frame headset, but the VR community is hoping for
          something in the Half-Life universe. Even if it&apos;s not
          Half-Life 3, a first-party Valve VR title bundled with new hardware
          could be the biggest VR gaming moment since Alyx.
        </p>

        {/* Star Trek: Infection */}
        <h3 className="font-display text-xl font-semibold mb-2">
          Star Trek: Infection
        </h3>
        <figure className="fitness-figure">
          <img
            src="https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/3954580/56bc2d41e38178545b45c2b79262e146e7c628ff/header.jpg"
            alt="Star Trek: Infection VR key art aboard the U.S.S. Lumen"
            loading="lazy"
          />
        </figure>
        <p
          className="text-[15px] leading-[1.7] mb-8"
          style={{ color: "var(--text-secondary)" }}
        >
          A narrative survival VR game set in the Star Trek universe. Players
          take on the role of a Vulcan Starfleet officer on a mission aboard
          the U.S.S. Lumen that goes sideways fast. The combination of a
          beloved franchise with immersive VR gameplay has serious potential.
        </p>

        {/* TMNT VR */}
        <h3 className="font-display text-xl font-semibold mb-2">
          TMNT VR
        </h3>
        <figure className="fitness-figure">
          <img
            src="https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/3713650/b90ef5253a5ed86410cbbe2915e4286d46d7d9f6/header.jpg"
            alt="Teenage Mutant Ninja Turtles: Empire City VR key art with the four turtles"
            loading="lazy"
          />
        </figure>
        <p
          className="text-[15px] leading-[1.7] mb-8"
          style={{ color: "var(--text-secondary)" }}
        >
          Teenage Mutant Ninja Turtles is coming to VR. Play as all four
          turtles in what promises to be an action-packed brawler set after
          the fall of Shredder. If the melee combat is physics-driven and the
          co-op works well, this could be a huge crowd pleaser.
        </p>

        {/* Aces of Thunder */}
        <h3 className="font-display text-xl font-semibold mb-2">
          Aces of Thunder
        </h3>
        <figure className="fitness-figure">
          <img
            src="https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2754090/header.jpg"
            alt="Aces of Thunder VR dogfight artwork with warplanes in combat"
            loading="lazy"
          />
        </figure>
        <p
          className="text-[15px] leading-[1.7] mb-8"
          style={{ color: "var(--text-secondary)" }}
        >
          A World War I and II flight combat game with a focus on
          cockpit-only VR gameplay. The flight model is derived from War
          Thunder, and it supports full HOTAS controls. For sim enthusiasts,
          this is one of the most anticipated VR titles of the year.
        </p>

        {/* Microsoft Flight Simulator (PSVR 2) */}
        <h3 className="font-display text-xl font-semibold mb-2">
          Microsoft Flight Simulator (PSVR 2)
        </h3>
        <figure className="fitness-figure">
          <img
            src="https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2537590/header.jpg"
            alt="Microsoft Flight Simulator 2024 cockpit and aircraft key art"
            loading="lazy"
          />
        </figure>
        <p
          className="text-[15px] leading-[1.7] mb-8"
          style={{ color: "var(--text-secondary)" }}
        >
          Microsoft Flight Simulator is coming to PSVR 2 in 2026. The flat
          screen version is already one of the most visually impressive games
          ever made. In VR, the sense of flight and scale should be
          extraordinary. This could be a system-seller for PSVR 2.
        </p>

        {/* Ad: after the last anticipated game, before related articles */}
        <div className="my-8">
          <AdSlot slot={AD_SLOTS.pillar} format="auto" />
        </div>

        {/* What to watch for */}
        <h2 className="font-display text-2xl font-semibold mb-4">
          What to watch for
        </h2>
        <p
          className="text-[15px] leading-[1.7] mb-4"
          style={{ color: "var(--text-secondary)" }}
        >
          The Steam Frame launch is the wild card for 2026. If Valve delivers
          a strong standalone headset with a compelling launch title, it
          could expand the VR gaming audience significantly and give
          developers a reason to invest more heavily in VR exclusive content.
          The Quest platform continues to dominate in install base, but
          SteamVR&apos;s library depth and the enthusiast PC VR audience
          remain critical for pushing the medium forward.
        </p>
        <p
          className="text-[15px] leading-[1.7] mb-8"
          style={{ color: "var(--text-secondary)" }}
        >
          We&apos;ll keep this page updated as new titles are announced and
          released throughout 2026.
        </p>

        {/* Latest gaming articles */}
        <RecentArticles
          tags={["gaming"]}
          heading="Latest VR Gaming Coverage"
          limit={5}
        />

        {/* Cross-link to other pillar pages */}
        <AllPillarGuides exclude="best-vr-games-2026" />
      </main>

      <Footer />
    </>
  );
}
