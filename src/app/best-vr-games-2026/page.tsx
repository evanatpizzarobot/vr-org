import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
  StructuredData,
  breadcrumbSchema,
  faqPageSchema,
  productItemListSchema,
} from "@/components/StructuredData";
import { RecentArticles } from "@/components/RecentArticles";
import { AllPillarGuides } from "@/components/RelatedGuides";
import { AdSlot } from "@/components/AdSlot";
import { AdZone } from "@/components/AdZone";
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
    images: ["https://vr.org/og-image.png"],
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
  dateModified: "2026-08-03",
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

const games2026List = productItemListSchema("Best VR Games of 2026", [
  {
    name: "Resident Evil Requiem",
    brand: "Capcom",
    image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/3764200/ce5437442768e38eb575f205ab9397d0264017b0/header.jpg",
    description: "Capcom's latest Resident Evil, with a community PC VR mod available within a week of its March 2026 launch.",
    url: "https://vr.org/best-vr-games-2026",
    offers: [{ price: 69.99, priceCurrency: "USD", availability: "https://schema.org/InStock", url: "https://store.steampowered.com/app/3764200/" }],
  },
  {
    name: "Batman: Arkham Shadow",
    brand: "Camouflaj",
    image: "https://img.youtube.com/vi/EPcCWR3DTIw/maxresdefault.jpg",
    description: "The best superhero game in VR, a Quest-exclusive Arkham entry translating freeflow combat into physical punches and gadget use.",
    url: "https://vr.org/best-vr-games-2026",
  },
  {
    name: "Little Nightmares VR: Altered Echoes",
    brand: "Bandai Namco",
    image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2482940/d452a2c46f521825dead1bd5fda5a2b6a31d6379/header.jpg",
    description: "The acclaimed puzzle-platformer franchise's standalone VR story, out on PSVR2, Quest, and PC VR.",
    url: "https://vr.org/best-vr-games-2026",
    offers: [{ price: 29.99, priceCurrency: "USD", availability: "https://schema.org/InStock", url: "https://store.steampowered.com/app/2482940/" }],
  },
  {
    name: "Microsoft Flight Simulator (PSVR 2)",
    brand: "Asobo Studio",
    image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2537590/header.jpg",
    description: "One of the most visually ambitious games ever made, now in stereoscopic VR on PSVR 2.",
    url: "https://vr.org/best-vr-games-2026",
    offers: [{ price: 69.99, priceCurrency: "USD", availability: "https://schema.org/InStock", url: "https://store.steampowered.com/app/2537590/" }],
  },
  {
    name: "TMNT: Empire City",
    brand: "nDreams",
    image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/3713650/b90ef5253a5ed86410cbbe2915e4286d46d7d9f6/header.jpg",
    description: "A physics-driven VR beat 'em up where you play as any of the four turtles with weighty two-handed weapons.",
    url: "https://vr.org/best-vr-games-2026",
    offers: [{ price: 24.99, priceCurrency: "USD", availability: "https://schema.org/InStock", url: "https://store.steampowered.com/app/3713650/" }],
  },
  {
    name: "GERONIMO",
    brand: "Dark Matter Studios",
    image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2019620/c18168bcea25a3fa7d835319ddc4aadb2281e997/header.jpg",
    description: "A tactical CQB shooter for up to six players, and the best-reviewed new VR release of the summer on Steam.",
    url: "https://vr.org/best-vr-games-2026",
    offers: [{ price: 19.99, priceCurrency: "USD", availability: "https://schema.org/InStock", url: "https://store.steampowered.com/app/2019620/" }],
  },
  {
    name: "One More Delve",
    brand: "ATVR",
    image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/3847110/92f301fa47b1172bea75826da3f2687bd1bf7a7e/header.jpg",
    description: "A largely solo-developed three-player co-op dungeon crawler with real physics, strong on Quest and more divisive on its July Steam debut.",
    url: "https://vr.org/best-vr-games-2026",
    offers: [{ price: 10.91, priceCurrency: "USD", availability: "https://schema.org/InStock", url: "https://store.steampowered.com/app/3847110/" }],
  },
  {
    name: "Into the Radius 2",
    brand: "CM Games",
    image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2307350/ef5e8a9f96d6ace7c79340c5df625eeb4a25f4a2/header_alt_assets_4.jpg?t=1781882958",
    description: "The closest thing VR has to S.T.A.L.K.E.R., a hardcore survival shooter that left Early Access for 1.0 in April 2026.",
    url: "https://vr.org/best-vr-games-2026",
    offers: [{ price: 27.99, priceCurrency: "USD", availability: "https://schema.org/InStock", url: "https://store.steampowered.com/app/2307350/" }],
  },
  {
    name: "Star Trek: Infection",
    image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/3954580/56bc2d41e38178545b45c2b79262e146e7c628ff/header.jpg",
    description: "A narrative survival horror set in the Star Trek universe aboard the U.S.S. Lumen, on Quest 3 and PC VR.",
    url: "https://vr.org/best-vr-games-2026",
    offers: [{ price: 29.99, priceCurrency: "USD", availability: "https://schema.org/InStock", url: "https://store.steampowered.com/app/3954580/" }],
  },
  {
    name: "Aces of Thunder",
    brand: "Gaijin Entertainment",
    image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2754090/header.jpg",
    description: "Cockpit-only WWI and WWII VR flight combat with War Thunder physics, full HOTAS support, and 24 aircraft.",
    url: "https://vr.org/best-vr-games-2026",
    offers: [{ price: 29.99, priceCurrency: "USD", availability: "https://schema.org/InStock", url: "https://store.steampowered.com/app/2754090/" }],
  },
  {
    name: "Hot Dogs, Horseshoes & Hand Grenades (H3VR)",
    brand: "Rust Ltd",
    image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/450540/header.jpg",
    description: "The definitive VR firearms sandbox, which hit its 1.0 release in July 2026 after a full decade in Early Access.",
    url: "https://vr.org/best-vr-games-2026",
    offers: [{ price: 19.99, priceCurrency: "USD", availability: "https://schema.org/InStock", url: "https://store.steampowered.com/app/450540/" }],
  },
  {
    name: "Virtual Hunter",
    brand: "Korpi Games",
    image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1549850/74407f4d2cc61225833c9231d5bb1a30d1b22a37/header.jpg?t=1778837658",
    description: "The most serious VR hunting sim yet, 64 square kilometer open worlds with six-player co-op on PSVR2, Quest, and PC VR.",
    url: "https://vr.org/best-vr-games-2026",
    offers: [{ price: 24.99, priceCurrency: "USD", availability: "https://schema.org/InStock", url: "https://store.steampowered.com/app/1549850/" }],
  },
]);

const games2026Faq = faqPageSchema([
  {
    question: "What are the best VR games of 2026?",
    answer:
      "Through early August 2026, the strongest VR releases include Batman: Arkham Shadow (carrying momentum from late 2025), the Resident Evil Requiem PC VR mod, Aces of Thunder, Little Nightmares VR: Altered Echoes, Microsoft Flight Simulator on PSVR2, TMNT: Empire City, the S.T.A.L.K.E.R.-style survival shooter Into the Radius 2 (now a full 1.0 release), the open-world hunting sim Virtual Hunter, and H3VR, which finally left Early Access with its 1.0 update over the Fourth of July weekend and sits at 97 percent positive across more than 23,000 Steam reviews. The summer's biggest new arrival is GERONIMO, a tactical CQB shooter that launched July 10 and holds a Very Positive rating on Steam. Whatever Valve launches alongside the Steam Frame remains the biggest wildcard for the back half of the year.",
  },
  {
    question: "What VR games are coming in the rest of 2026?",
    answer:
      "The biggest remaining wildcard for 2026 is whatever launch title Valve ships alongside the Steam Frame headset. Valve's Great on Frame store section, which certifies games for the headset, went live in July with a handful of titles and passed 50 games and apps by early August. Rust Ltd has also announced Hot Dogs, Horseshoes & Hand Grenades 2, with no date attached yet. Nearer term, Pine Studio opened a public VR preview for Escape Simulator 2 on August 3, the 1980s open-world crime game Streets of Miami VR lands on Quest and PC VR on August 28, and several PSVR 2 ports and Quest exclusives remain on publishers' roadmaps for the rest of the year.",
  },
  {
    question: "When does the Steam Frame release?",
    answer:
      "Valve has not announced a release date for the Steam Frame headset, but the signals have stopped being subtle. The Steam Machine shipped June 30 at $1,049, tens of tons of VR hardware cleared into Valve's US warehouses, the FCC granted equipment authorization on July 29, the Great on Frame certification section passed 50 titles, and on August 2 Valve published the headset's compatibility layers, Lepton and FEX, as public Steam entries. Valve still cites the memory supply crunch tied to AI demand as the reason it will not commit to a date, but regulatory clearance plus a public software stack points to weeks, not quarters.",
  },
  {
    question: "Are there new PSVR 2 games in 2026?",
    answer:
      "Yes. Microsoft Flight Simulator launched on PSVR 2 in late April 2026 and is one of the biggest VR releases of the year so far. Sony continues to support PSVR 2 with first-party and third-party AAA ports, and the headset now supports PC VR via an official adapter, opening the SteamVR library.",
  },
  {
    question: "What is the best VR game in 2026 so far?",
    answer:
      "Microsoft Flight Simulator on PSVR 2 is the most ambitious release of the year so far. Batman: Arkham Shadow remains the strongest Quest-native title, H3VR's long-awaited 1.0 gave PC VR its feel-good story of the summer and is the best-reviewed VR game on Steam by a wide margin, and GERONIMO is the best new thing to arrive since, a six-player tactical CQB shooter that has held a Very Positive rating since its July 10 launch.",
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
          Last updated: August 3, 2026
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
          Two thirds of the way through, 2026 is delivering on its promise as
          one of the biggest years for VR gaming. Microsoft Flight Simulator
          hit PSVR 2, TMNT: Empire City brought the turtles to VR, H3VR capped
          a decade in Early Access with its 1.0 release over the July 4
          weekend, and the tactical shooter GERONIMO arrived on July 10 to the
          strongest reception any new VR release has had this summer. On the
          hardware side, the Steam Frame cleared the FCC on July 29 and Valve
          put the headset&apos;s compatibility layers on Steam on August 2,
          which makes a fall launch look close to certain. Here are the best VR
          games of 2026 so far, plus the titles still ahead.
        </p>

        {/* Direct-sold buyer-guide banner. Dormant until activated in data/ad-placements.json. */}
        <AdZone slot="buyer-guide-banner" variant="banner" />

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
          Developer: Bandai Namco | Platform: PSVR2, Quest, PC VR | Released: April 24, 2026
        </p>
        <p
          className="text-[15px] leading-[1.7] mb-8"
          style={{ color: "var(--text-secondary)" }}
        >
          Bandai Namco&apos;s acclaimed puzzle-platformer franchise made the
          jump to VR on April 24 with a new standalone story following Dark
          Six through a deeply unsettling world of outsized threats and
          intricate puzzles. It is out now on PSVR2, Quest, and PC VR, and the
          sense of scale and creeping dread carries over from the flat-screen
          originals.
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
          className="text-[13px] mb-4"
          style={{ color: "var(--text-muted)" }}
        >
          Developer: Asobo Studio | Platform: PSVR 2 | Released: April 29, 2026
        </p>
        <p
          className="text-[15px] leading-[1.7] mb-8"
          style={{ color: "var(--text-secondary)" }}
        >
          The biggest thing to happen to PlayStation VR in a year. Microsoft
          Flight Simulator finally landed on PSVR 2 in late April, bringing
          one of the most visually impressive games ever made into stereoscopic
          VR. The sense of scale at altitude is genuinely staggering, and the
          PSVR 2 OLED panels handle the lighting beautifully. Read our{" "}
          <a
            href="/articles/microsoft-flight-simulator-psvr2-biggest-vr-game-on-playstation"
            className="no-underline hover:underline"
            style={{ color: "var(--accent-cyan)" }}
          >
            full launch coverage
          </a>{" "}
          for the complete breakdown.
        </p>

        {/* TMNT: Empire City */}
        <h3 className="font-display text-xl font-semibold mb-2">
          TMNT: Empire City
        </h3>
        <figure className="fitness-figure">
          <img
            src="https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/3713650/b90ef5253a5ed86410cbbe2915e4286d46d7d9f6/header.jpg"
            alt="Teenage Mutant Ninja Turtles: Empire City VR key art with the four turtles"
            loading="lazy"
          />
        </figure>
        <p
          className="text-[13px] mb-4"
          style={{ color: "var(--text-muted)" }}
        >
          Developer: nDreams | Platform: Quest, PC VR | Released: April 30, 2026
        </p>
        <p
          className="text-[15px] leading-[1.7] mb-8"
          style={{ color: "var(--text-secondary)" }}
        >
          The turtles arrived in VR. Empire City is a physics-driven beat
          &lsquo;em up where you can play as any of the four turtles, with
          two-handed weapons that actually feel weighty in your grip. The
          co-op delivers the cartoon energy fans wanted. Read our{" "}
          <a
            href="/articles/tmnt-empire-city-vr-launch-day-first-impressions"
            className="no-underline hover:underline"
            style={{ color: "var(--accent-cyan)" }}
          >
            launch-day impressions
          </a>{" "}
          for our full take.
        </p>

        {/* One More Delve */}
        <h3 className="font-display text-xl font-semibold mb-2">
          One More Delve
        </h3>
        <figure className="fitness-figure">
          <img
            src="https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/3847110/92f301fa47b1172bea75826da3f2687bd1bf7a7e/header.jpg"
            alt="One More Delve Steam header art showing a physics-based VR dungeon crawler"
            loading="lazy"
          />
        </figure>
        <p
          className="text-[13px] mb-4"
          style={{ color: "var(--text-muted)" }}
        >
          Developer: ATVR | Platform: Quest, PC VR | Released: April 28, 2026 (Quest), July 23, 2026 (Steam)
        </p>
        <p
          className="text-[15px] leading-[1.7] mb-8"
          style={{ color: "var(--text-secondary)" }}
        >
          A largely solo-developed three-player co-op dungeon crawler with real
          physics and hand-made levels, and the spring&apos;s best argument that
          one developer with the right idea can still carve out a moment in VR.
          The Quest reception has been strong. Its July 23 Steam debut has been
          rockier: as of early August it sits at Mixed, 69 percent positive
          across 36 reviews, with the praise going to the combat feel and the
          complaints going to sluggish body physics and thin late-run
          replayability. That is a small sample on a game still shipping
          updates, so treat it as a work in progress rather than a verdict. Our
          full{" "}
          <a
            href="/articles/one-more-delve-launch-solo-student-vr-dungeon-crawler"
            className="no-underline hover:underline"
            style={{ color: "var(--accent-cyan)" }}
          >
            launch coverage and review
          </a>{" "}
          has the details.
        </p>

        {/* Into the Radius 2 */}
        <h3 className="font-display text-xl font-semibold mb-2">
          Into the Radius 2
        </h3>
        <figure className="fitness-figure">
          <img
            src="https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2307350/ef5e8a9f96d6ace7c79340c5df625eeb4a25f4a2/header_alt_assets_4.jpg?t=1781882958"
            alt="Into the Radius 2 key art with a lone explorer beneath the anomaly eclipse"
            loading="lazy"
          />
        </figure>
        <p
          className="text-[13px] mb-4"
          style={{ color: "var(--text-muted)" }}
        >
          Developer: CM Games | Platform: PC VR, Quest | Released: April 23, 2026 (1.0)
        </p>
        <p
          className="text-[15px] leading-[1.7] mb-8"
          style={{ color: "var(--text-secondary)" }}
        >
          The closest thing VR has to S.T.A.L.K.E.R. left Early Access on
          April 23 with its full 1.0 release. CM Games&apos; survival shooter
          drops you alone into a surreal anomaly zone where you manually rack
          your slide, count every round, and maintain your guns by hand. The
          1.0 launch added a full story campaign, new weapons, and night
          vision, and a later update brought the multiplayer co-op players had
          been waiting for. It is one of the best hardcore VR games most people
          still have not heard of. Our{" "}
          <a
            href="/articles/into-the-radius-2-full-release-april-2026"
            className="no-underline hover:underline"
            style={{ color: "var(--accent-cyan)" }}
          >
            full release coverage
          </a>{" "}
          has the breakdown.
        </p>

        {/* H3VR 1.0 */}
        <h3 className="font-display text-xl font-semibold mb-2">
          Hot Dogs, Horseshoes &amp; Hand Grenades (H3VR)
        </h3>
        <figure className="fitness-figure">
          <img
            src="https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/450540/header.jpg"
            alt="Hot Dogs, Horseshoes and Hand Grenades Steam header art"
            loading="lazy"
          />
        </figure>
        <p
          className="text-[13px] mb-4"
          style={{ color: "var(--text-muted)" }}
        >
          Developer: Rust Ltd | Platform: PC VR | Released: 1.0 on July 4 weekend, 2026 (Update 120)
        </p>
        <p
          className="text-[15px] leading-[1.7] mb-8"
          style={{ color: "var(--text-secondary)" }}
        >
          Ten years after entering Early Access at the dawn of consumer VR,
          H3VR finally shipped its 1.0 over the Fourth of July weekend. It is
          the definitive firearms sandbox in VR: hundreds of meticulously
          simulated weapons, the gleefully weird Take and Hold mode, and a
          decade of free updates from a tiny team. Few games in any medium have
          been supported this well for this long, and the scoreboard reflects
          it. As of early August it holds an Overwhelmingly Positive rating on
          Steam, 97 percent positive across more than 23,000 reviews, which
          makes it comfortably the best-reviewed VR game on the platform. Rust
          Ltd has also put up a store page for a sequel, Hot Dogs, Horseshoes
          &amp; Hand Grenades 2, with no release date attached. Our{" "}
          <a
            href="/articles/h3vr-1-0-leaves-early-access-ten-years-2026"
            className="no-underline hover:underline"
            style={{ color: "var(--accent-cyan)" }}
          >
            ten-year retrospective
          </a>{" "}
          covers what the journey represents.
        </p>

        {/* GERONIMO */}
        <h3 className="font-display text-xl font-semibold mb-2">
          GERONIMO
        </h3>
        <figure className="fitness-figure">
          <img
            src="https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2019620/c18168bcea25a3fa7d835319ddc4aadb2281e997/header.jpg"
            alt="GERONIMO Steam header art showing tactical operators stacked up on a doorway"
            loading="lazy"
          />
        </figure>
        <p
          className="text-[13px] mb-4"
          style={{ color: "var(--text-muted)" }}
        >
          Developer: Dark Matter Studios | Platform: PC VR | Released: July 10, 2026 | $19.99
        </p>
        <p
          className="text-[15px] leading-[1.7] mb-8"
          style={{ color: "var(--text-secondary)" }}
        >
          The strongest new VR release of the summer, and the one most likely to
          still be in rotation at Christmas. GERONIMO is a close-quarters
          tactical shooter in the Ready or Not mould: breach a room, clear it
          slowly, and get punished hard for moving before your squad is set. It
          supports solo infiltration or six players together, and the weapon
          handling and attachment depth are the parts players keep singling out.
          It sits at Very Positive on Steam, 84 percent positive across more
          than 1,100 reviews as of early August, which is a rare hit rate for a
          VR shooter this early in its life. Expect rough edges, because the
          content pipeline is still filling in, but the core loop is already
          the real thing.
        </p>

        {/* Ad: after New Releases, before Most Anticipated */}
        <div className="my-8">
          <AdSlot slot={AD_SLOTS.pillar} format="horizontal" />
        </div>

        {/* Most anticipated VR games for the rest of 2026 */}
        <h2 className="font-display text-2xl font-semibold mb-4">
          Recently released, and what is still ahead
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
          The signals have stopped being signals. The Steam Machine shipped
          June 30 at $1,049, tens of tons of hardware labeled virtual reality
          devices cleared into Valve&apos;s US warehouses, and the{" "}
          <a
            href="/articles/valve-great-on-frame-steam-page-steam-frame-launch-signal"
            className="no-underline hover:underline"
            style={{ color: "var(--accent-cyan)" }}
          >
            Great on Frame store section
          </a>{" "}
          that certifies games for the headset opened in July with about half a
          dozen titles and passed 50 by early August. Then came the two that
          matter most: the{" "}
          <a
            href="/articles/steam-frame-fcc-grant-equipment-authorization-july-2026"
            className="no-underline hover:underline"
            style={{ color: "var(--accent-cyan)" }}
          >
            FCC granted equipment authorization on July 29
          </a>
          , which is legal permission to sell, and on August 2 Valve published
          Lepton and FEX, the headset&apos;s{" "}
          <a
            href="/articles/valve-lepton-fex-steam-frame-translation-layers-2026"
            className="no-underline hover:underline"
            style={{ color: "var(--accent-cyan)" }}
          >
            Android and x86 translation layers
          </a>
          , as public Steam entries. Nobody knows what Valve plans to launch
          alongside the Frame, but the community is hoping for something in the
          Half-Life universe. A first-party Valve VR title bundled with new
          hardware could be the biggest VR gaming moment since Alyx.
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
          Released March 31 on Quest 3 and PC VR, this narrative survival
          horror is set in the Star Trek universe. You play a Vulcan Starfleet
          officer aboard the U.S.S. Lumen as the mission collapses into
          something darker. Reception has been mixed: critics praised the
          atmosphere and franchise authenticity while flagging finicky controls
          and a short, roughly six to seven hour runtime. Worth it for Trek
          fans who can tolerate the rough edges.
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
          Released February 3 on PSVR2 and PC VR, this World War I and II
          flight combat game focuses on cockpit-only VR gameplay with physics
          derived from War Thunder. It supports full HOTAS controls, ships with
          24 aircraft, and won praise for its physical accuracy and audio while
          drawing criticism for a steep learning curve. Sim enthusiasts have
          embraced it.
        </p>

        {/* Virtual Hunter */}
        <h3 className="font-display text-xl font-semibold mb-2">
          Virtual Hunter
        </h3>
        <figure className="fitness-figure">
          <img
            src="https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1549850/74407f4d2cc61225833c9231d5bb1a30d1b22a37/header.jpg?t=1778837658"
            alt="Virtual Hunter VR key art showing deer, a pheasant, and hunters in the field"
            loading="lazy"
          />
        </figure>
        <p
          className="text-[15px] leading-[1.7] mb-8"
          style={{ color: "var(--text-secondary)" }}
        >
          Released May 27 on PSVR2 and Quest at $24.99 after a stretch on
          Steam, Korpi Games&apos; realistic hunting sim is the most serious
          attempt the genre has seen in VR. It is built around 64 square
          kilometer open worlds with solo play or six-player co-op, and it
          leans hard on each headset&apos;s hardware. If you have wanted a
          patient, tracking-focused hunting game in VR rather than an arcade
          shooting gallery, this is the one to watch. Our{" "}
          <a
            href="/articles/virtual-hunter-psvr2-quest-launch-2026"
            className="no-underline hover:underline"
            style={{ color: "var(--accent-cyan)" }}
          >
            launch coverage
          </a>{" "}
          breaks down the platform differences.
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
          The Steam Frame launch is still the wild card for the back half of
          2026, but it is a much smaller wild card than it was a month ago. The
          headset has regulatory clearance, a certification program past 50
          titles, and a published software stack. Meta Connect lands September
          23 with the Quest 4 now pointed at 2027, so Valve has the hardware
          stage largely to itself this fall. If it delivers a strong standalone
          headset with a compelling launch title, it could expand the VR gaming
          audience significantly and give developers a reason to invest more
          heavily in VR exclusive content. Nearer term, August is the usual
          pre-fall lull: Pine Studio opened a public VR preview for Escape
          Simulator 2 on August 3, Streets of Miami VR arrives August 28, and
          the narrative escape room{" "}
          <a
            href="/articles/amelias-escape-vr-escape-room-launch-july-2026"
            className="no-underline hover:underline"
            style={{ color: "var(--accent-cyan)" }}
          >
            Amelia&apos;s Escape
          </a>{" "}
          landed on Quest and Steam on July 23 at $15.99. Our{" "}
          <a
            href="/articles/best-vr-games-first-half-2026-standouts"
            className="no-underline hover:underline"
            style={{ color: "var(--accent-cyan)" }}
          >
            first-half standouts roundup
          </a>{" "}
          recaps the six months that got us here.
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
