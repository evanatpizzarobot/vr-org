import type { Metadata } from "next";
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
import { AdZone } from "@/components/AdZone";
import { AD_SLOTS } from "@/lib/ads";

export const metadata: Metadata = {
  title: "Best Mixed Reality Games 2026: Top MR Games for Quest 3 | VR.org",
  description:
    "The best mixed reality games of 2026 for Quest 3 and Quest 3S. Games that use your actual walls, floor, and furniture as the level, ranked and priced by VR.org.",
  openGraph: {
    title: "Best Mixed Reality Games 2026: Top MR Games for Quest 3 | VR.org",
    description:
      "The best mixed reality games of 2026 for Quest 3 and Quest 3S. Games that turn your real room into the level, ranked and priced.",
    url: "https://vr.org/best-mixed-reality-games",
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
    card: "summary_large_image",
    title: "Best Mixed Reality Games 2026 | VR.org",
    description:
      "The MR games that actually use your room, ranked. Quest 3 and Quest 3S.",
  },
  alternates: {
    canonical: "https://vr.org/best-mixed-reality-games",
  },
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Best Mixed Reality Games 2026: Top MR Games for Quest 3",
  datePublished: "2026-08-13",
  dateModified: "2026-08-13",
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
    "@id": "https://vr.org/best-mixed-reality-games",
  },
  image: "https://vr.org/og-image.png",
};

const breadcrumbs = breadcrumbSchema([
  { name: "Home", url: "https://vr.org" },
  { name: "XR", url: "https://vr.org/xr" },
  {
    name: "Best Mixed Reality Games",
    url: "https://vr.org/best-mixed-reality-games",
  },
]);

const mrList = itemListSchema("Best Mixed Reality Games 2026", [
  { name: "Laser Dance", url: "https://vr.org/best-mixed-reality-games#laser-dance" },
  { name: "Starship Home", url: "https://vr.org/best-mixed-reality-games#starship-home" },
  { name: "Little Critters", url: "https://vr.org/best-mixed-reality-games#little-critters" },
  { name: "Cybercore Protocol", url: "https://vr.org/best-mixed-reality-games#cybercore-protocol" },
  { name: "Wall Town Wonders", url: "https://vr.org/best-mixed-reality-games#wall-town-wonders" },
  { name: "Drop Dead: The Cabin", url: "https://vr.org/best-mixed-reality-games#drop-dead-the-cabin" },
  { name: "Demeo Battles", url: "https://vr.org/best-mixed-reality-games#demeo-battles" },
  { name: "Cubism", url: "https://vr.org/best-mixed-reality-games#cubism" },
]);

const mrFaq = faqPageSchema([
  {
    question: "What is a mixed reality game?",
    answer:
      "A mixed reality game uses your headset's passthrough cameras to show your real room, then places virtual objects into it so they interact with your actual walls, floor, and furniture. A virtual ball can bounce off your real coffee table. The distinction that matters is whether the game reads your room's geometry or simply draws on top of the camera feed. The games on this list read it.",
  },
  {
    question: "Which headsets play mixed reality games?",
    answer:
      "Quest 3 and Quest 3S are the mainstream options, because both have colour passthrough and depth sensing and share the same chip. Quest Pro supports MR but is discontinued. Apple Vision Pro and Pico 4 Ultra also run mixed reality content, though most of the games on this list are Quest titles first.",
  },
  {
    question: "Do mixed reality games need a room scan?",
    answer:
      "Most do. Quest asks you to scan your space once so the game knows where your walls, floor, and large furniture are. Games like Laser Dance and Cybercore Protocol depend on that scan completely, because your floor plan becomes the level layout. Rescan whenever you rearrange furniture or the geometry will be wrong.",
  },
  {
    question: "How much space do you need for mixed reality games?",
    answer:
      "More than you need for seated VR, less than you might expect. Roughly 2 by 2 metres of clear floor covers most of this list. Laser Dance specifically wants room to duck and crawl between two points, while tabletop games like Demeo Battles work fine in a chair at a desk.",
  },
  {
    question: "Is mixed reality better than VR?",
    answer:
      "Neither replaces the other. VR is better when the game wants to put you somewhere else entirely, and it always will be. Mixed reality is better when the point is that this is happening in your home, which is why home defense, tabletop, and room-scale puzzle games dominate the genre. The strongest MR games are the ones that could not simply be reskinned as VR games.",
  },
  {
    question: "What is the best mixed reality game on Quest 3?",
    answer:
      "Laser Dance at $9.99 is the clearest demonstration of what mixed reality does that VR cannot, because the lasers route around your real furniture. Little Critters won UploadVR's Best Mixed Reality Game of 2025 and is the better pick for families. Starship Home is the most polished if you want a narrative rather than a challenge.",
  },
]);

export default function BestMixedRealityGamesPage() {
  return (
    <>
      <StructuredData data={articleSchema} />
      <StructuredData data={breadcrumbs} />
      <StructuredData data={mrList} />
      <StructuredData data={mrFaq} />
      <Header articleCount={0} lastUpdated="" />

      <main
        className="max-w-[720px] mx-auto px-6 py-16"
        style={{ color: "var(--text-primary)" }}
      >
        <h1
          className="font-display text-4xl font-bold mb-2"
          style={{ letterSpacing: "-0.5px" }}
        >
          Best Mixed Reality Games 2026
        </h1>
        <p className="text-sm mb-3" style={{ color: "var(--text-muted)" }}>
          Last updated: August 2026
        </p>

        <p className="text-[13px] mb-8" style={{ color: "var(--text-muted)" }}>
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

        <p
          className="text-[15px] leading-[1.7] mb-8"
          style={{ color: "var(--text-secondary)" }}
        >
          Mixed reality has a credibility problem, and it is mostly the fault of
          the demos. Punch a cartoon hole in your wall, watch some robots pour
          out, take the headset off after eleven minutes. Plenty of Quest 3
          games technically support passthrough while treating your living room
          as wallpaper. The eight below do not. In each of them your walls,
          your floor, and the couch you have not moved in two years are load
          bearing parts of the design, and taking the game somewhere else would
          change how it plays.
        </p>

        {/* Direct-sold buyer-guide banner. Dormant until activated in data/ad-placements.json. */}
        <AdZone slot="buyer-guide-banner" variant="banner" />

        <h2 className="font-display text-2xl font-semibold mb-4">
          What actually counts as a mixed reality game
        </h2>
        <p
          className="text-[15px] leading-[1.7] mb-4"
          style={{ color: "var(--text-secondary)" }}
        >
          Passthrough alone is not mixed reality. Nearly every recent headset
          can show you a camera feed of your room, and a game that floats a
          menu in front of that feed is still just a VR game with the lights
          on. The line worth drawing is whether the game reads your room&apos;s
          geometry: the scan that tells it where your walls stop, how far away
          the floor is, and which lump in the middle is a sofa.
        </p>
        <p
          className="text-[15px] leading-[1.7] mb-8"
          style={{ color: "var(--text-secondary)" }}
        >
          That single distinction sorts the genre. Games that read the scan
          produce a different experience in every house, which is the one thing
          authored levels can never fake. Games that ignore it are identical
          everywhere and would honestly play better as VR. Everything on this
          list sits on the first side of that line. Prices are US Horizon Store
          or Steam list prices, checked in August 2026.
        </p>

        {/* Ad: after the explainer, before entry 1 */}
        <div className="my-8">
          <AdSlot slot={AD_SLOTS.pillar} format="auto" />
        </div>

        {/* 1. Laser Dance */}
        <h2
          id="laser-dance"
          className="font-display text-2xl font-semibold mb-2 scroll-mt-20"
        >
          1. Laser Dance
        </h2>
        <figure className="pillar-figure">
          <a
            href="https://www.youtube.com/watch?v=eQq6l48HZt0"
            target="_blank"
            rel="noopener"
          >
            <img
              src="https://img.youtube.com/vi/eQq6l48HZt0/maxresdefault.jpg"
              alt="A player in a Meta Quest 3 headset dodging red laser beams strung across a real living room in Laser Dance"
              loading="lazy"
            />
          </a>
          <figcaption>
            Watch: Laser Dance | Early Access Trailer | Meta Quest 3 + 3S on
            YouTube &rarr;
          </figcaption>
        </figure>
        <p className="text-[13px] mb-4" style={{ color: "var(--text-muted)" }}>
          Developer: Vanbo (Thomas Van Bouwel) | Platform: Quest 3, Quest 3S |
          Price: $9.99 early access
        </p>
        <p
          className="text-[15px] leading-[1.7] mb-8"
          style={{ color: "var(--text-secondary)" }}
        >
          The premise is a heist movie cliche and the execution is the best
          argument mixed reality has. Lasers fill your room, you have to reach a
          button on the far wall, and the beams are laid out around your actual
          furniture. You take cover behind your real couch. You crawl under your
          real table. Because the layout is generated from your scan, a level
          that is trivial in a big open lounge becomes genuinely awkward in a
          cluttered bedroom, and no two players are solving quite the same
          puzzle. It launched in early access with 18 levels across three
          stages, plays with hand tracking or controllers, and comes from the
          developer behind Cubism further down this list. At ten dollars it is
          also the cheapest way to understand why anyone bothers with MR.
        </p>

        {/* 2. Starship Home */}
        <h2
          id="starship-home"
          className="font-display text-2xl font-semibold mb-2 scroll-mt-20"
        >
          2. Starship Home
        </h2>
        <figure className="pillar-figure">
          <a
            href="https://www.youtube.com/watch?v=rdSSwmZitzM"
            target="_blank"
            rel="noopener"
          >
            <img
              src="https://img.youtube.com/vi/rdSSwmZitzM/maxresdefault.jpg"
              alt="Starship Home title art surrounded by glowing alien plants and pods"
              loading="lazy"
            />
          </a>
          <figcaption>
            Watch: Starship Home | Launch Trailer | Meta Quest Platform on
            YouTube &rarr;
          </figcaption>
        </figure>
        <p className="text-[13px] mb-4" style={{ color: "var(--text-muted)" }}>
          Developer: Creature | Platform: Quest 3, Quest 3S | Price: $19.99
        </p>
        <p
          className="text-[15px] leading-[1.7] mb-8"
          style={{ color: "var(--text-secondary)" }}
        >
          Your living room becomes the bridge of a starship, permanently. The
          controls bolt onto your real walls, the viewport opens where your
          window is, and across eight missions you travel between planets
          collecting and raising alien plants that then live in your house. It
          is the most polished thing on this list and the most gentle, a
          gardening game wearing a space opera. Reviews split on whether the
          mission loop repeats too much by the third planet, and that criticism
          is fair. It is still the game to hand somebody who has never
          understood what mixed reality is for, because the moment the ceiling
          opens is genuinely hard to shrug off. Budget four to six hours.
        </p>

        {/* 3. Little Critters */}
        <h2
          id="little-critters"
          className="font-display text-2xl font-semibold mb-2 scroll-mt-20"
        >
          3. Little Critters
        </h2>
        <figure className="pillar-figure">
          <a
            href="https://www.youtube.com/watch?v=TLln1fNAwLw"
            target="_blank"
            rel="noopener"
          >
            <img
              src="https://img.youtube.com/vi/TLln1fNAwLw/maxresdefault.jpg"
              alt="Cartoon monsters swarming through a living room around the Little Critters logo"
              loading="lazy"
            />
          </a>
          <figcaption>
            Watch: Little Critters | Launch Trailer | Meta Quest Platform on
            YouTube &rarr;
          </figcaption>
        </figure>
        <p className="text-[13px] mb-4" style={{ color: "var(--text-muted)" }}>
          Developer: Purple Yonder | Platform: Quest 3, Quest 3S, Pico 4 Ultra |
          Price: $19.99
        </p>
        <p
          className="text-[15px] leading-[1.7] mb-8"
          style={{ color: "var(--text-secondary)" }}
        >
          UploadVR&apos;s Best Mixed Reality Game of 2025, and the family pick
          here by a distance. Cartoon monsters invade your home from every
          direction, crawling up the walls and swooping through the middle of
          the room, and you fight back by sticking traps to your actual
          surfaces. Where you put them matters, so the game rewards knowing your
          own room. Purple Yonder made the well liked Little Cities before this,
          and the same warmth carries over: it is bright, funny, and readable
          enough that a child can play it without a tutorial. Rated 4.9 out of 5
          on the Horizon Store at the time of writing.
        </p>

        {/* Ad: mid-list */}
        <div className="my-8">
          <AdSlot slot={AD_SLOTS.pillar} format="auto" />
        </div>

        {/* 4. Cybercore Protocol */}
        <h2
          id="cybercore-protocol"
          className="font-display text-2xl font-semibold mb-2 scroll-mt-20"
        >
          4. Cybercore Protocol
        </h2>
        <figure className="pillar-figure">
          <a
            href="https://www.youtube.com/watch?v=VPvQJWlMa3w"
            target="_blank"
            rel="noopener"
          >
            <img
              src="https://img.youtube.com/vi/VPvQJWlMa3w/maxresdefault.jpg"
              alt="A robotic dragon bursting through a living room wall in Cybercore Protocol"
              loading="lazy"
            />
          </a>
          <figcaption>
            Watch: Cybercore Protocol - Mixed Reality Announcement Trailer on
            YouTube &rarr;
          </figcaption>
        </figure>
        <p className="text-[13px] mb-4" style={{ color: "var(--text-muted)" }}>
          Platform: Quest 3, Quest 3S | Price: $9.99 | Released: July 2026
        </p>
        <p
          className="text-[15px] leading-[1.7] mb-8"
          style={{ color: "var(--text-secondary)" }}
        >
          Tower defense is the genre that most wants your floor plan, because
          the entire genre is about the shape of the path. Cybercore Protocol
          converts your scanned walls into tactical corridors, plants a control
          hub on your real floor, and tears enemy portals open in your hallway.
          Between waves you place turrets, freezers, burners, lasers, and decoys
          along whatever chokepoints your home happens to have, then fight the
          wave yourself. The newest game here and one of the most convincing
          uses of the idea. We covered the launch in{" "}
          <a
            href="/articles/cybercore-protocol-quest-mixed-reality-tower-defense-2026"
            className="no-underline hover:underline"
            style={{ color: "var(--accent-cyan)" }}
          >
            our full write-up
          </a>
          .
        </p>

        {/* 5. Wall Town Wonders */}
        <h2
          id="wall-town-wonders"
          className="font-display text-2xl font-semibold mb-2 scroll-mt-20"
        >
          5. Wall Town Wonders
        </h2>
        <figure className="pillar-figure">
          <img
            src="https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/3570400/fe275da796fcd208e8b79d516bd44d2c3565774f/ss_fe275da796fcd208e8b79d516bd44d2c3565774f.1920x1080.jpg"
            alt="A tiny cave village built into a hole in a real textured wall, with a character riding a lizard, in Wall Town Wonders"
            loading="lazy"
          />
          <figcaption>Image: Cyborn / Steam</figcaption>
        </figure>
        <p className="text-[13px] mb-4" style={{ color: "var(--text-muted)" }}>
          Developer: Cyborn | Platform: Quest 3, Quest 3S, PC VR | Price: $19.99
        </p>
        <p
          className="text-[15px] leading-[1.7] mb-8"
          style={{ color: "var(--text-secondary)" }}
        >
          A miniature town that lives on your wall, built by tiny people who
          keep working while you are away. You punch holes in the plaster,
          string cable cars between rooms, and gradually colonise the flat
          surfaces of your home. It is the most relaxed entry on this list and
          the one that most rewards leaving installed for weeks rather than
          finishing in a weekend. Road to VR&apos;s review argued it leans too
          casual for players who want a real city builder, which is a
          reasonable warning if you are coming from Cities: Skylines. As
          something charming to check on with a coffee, it works.
        </p>

        {/* 6. Drop Dead: The Cabin */}
        <h2
          id="drop-dead-the-cabin"
          className="font-display text-2xl font-semibold mb-2 scroll-mt-20"
        >
          6. Drop Dead: The Cabin
        </h2>
        <figure className="pillar-figure">
          <img
            src="https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/3516890/cc26f5bf9046c8ee4cdfdad3184b44c7c8cef8c2/header.jpg"
            alt="Drop Dead: The Cabin key art showing a green-eyed zombie beside the game logo"
            loading="lazy"
          />
          <figcaption>Image: Soul Assembly / Steam</figcaption>
        </figure>
        <p className="text-[13px] mb-4" style={{ color: "var(--text-muted)" }}>
          Developer: Soul Assembly | Platform: Quest, PC VR | Price: $10.99
        </p>
        <p
          className="text-[15px] leading-[1.7] mb-8"
          style={{ color: "var(--text-secondary)" }}
        >
          One honest caveat first: the main campaign is a VR game, and mixed
          reality is a separate Home Invasion mode rather than the whole
          product. That mode is worth the entry price on its own. It asks you to
          mark your real door, your real windows, and a table, and then sends
          zombies through them. Hearing something come through the window you
          walk past every day does something a virtual cabin cannot, and the
          barricading loop gives you a reason to keep glancing over your
          shoulder at your own hallway. Best played after dark, which should go
          without saying.
        </p>

        {/* 7. Demeo Battles */}
        <h2
          id="demeo-battles"
          className="font-display text-2xl font-semibold mb-2 scroll-mt-20"
        >
          7. Demeo Battles
        </h2>
        <figure className="pillar-figure">
          <img
            src="https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1969310/67cf4ab9e8b053f51f66d62dc78d0b8fe2fe0636/header.jpg"
            alt="Demeo Battles key art with fantasy heroes arranged around the game logo"
            loading="lazy"
          />
          <figcaption>Image: Resolution Games / Steam</figcaption>
        </figure>
        <p className="text-[13px] mb-4" style={{ color: "var(--text-muted)" }}>
          Developer: Resolution Games | Platform: Quest, PC VR | Price: $19.99
        </p>
        <p
          className="text-[15px] leading-[1.7] mb-8"
          style={{ color: "var(--text-secondary)" }}
        >
          The tabletop case for mixed reality, and the least gimmicky version of
          it. Demeo Battles snaps its board onto your actual table, so you play
          a turn based dungeon skirmish hunched over your own kitchen furniture
          with a friend across from you. Resolution Games has been iterating on
          this format longer than almost anyone, and it shows in small things:
          the board sits at a sensible height, pieces are the right size to
          read at a glance, and nothing important hides behind your own hands.
          If your interest in MR is playing games with people in the same room,
          start here.
        </p>

        {/* 8. Cubism */}
        <h2
          id="cubism"
          className="font-display text-2xl font-semibold mb-2 scroll-mt-20"
        >
          8. Cubism
        </h2>
        <figure className="pillar-figure">
          <img
            src="https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/804530/ss_ed41ab4131c58428bd497a65f0a994f0ac77cf47.1920x1080.jpg"
            alt="A pastel interlocking block puzzle floating against a clean background in Cubism"
            loading="lazy"
          />
          <figcaption>Image: Thomas Van Bouwel / Steam</figcaption>
        </figure>
        <p className="text-[13px] mb-4" style={{ color: "var(--text-muted)" }}>
          Developer: Thomas Van Bouwel | Platform: Quest, PC VR | Price: $9.99
        </p>
        <p
          className="text-[15px] leading-[1.7] mb-8"
          style={{ color: "var(--text-secondary)" }}
        >
          The quiet one. Cubism is a hand tracked block puzzle that predates the
          current MR wave and got passthrough support along the way, and it
          remains the best demonstration that mixed reality does not have to be
          loud. Puzzles hover over your coffee table while you sit on the sofa
          with the room lights on and somebody else watching television nearby.
          That last part is the point: it is a headset game you can play in a
          shared living room without withdrawing from it. Sixty puzzles, no
          timers, no pressure, and it comes from the same developer as Laser
          Dance at the top of this list.
        </p>

        <h2 className="font-display text-2xl font-semibold mb-4">
          Getting the best results from mixed reality
        </h2>
        <p
          className="text-[15px] leading-[1.7] mb-4"
          style={{ color: "var(--text-secondary)" }}
        >
          Rescan your room after you move furniture. Every game on this list
          reads that scan, and a sofa the headset thinks is still against the
          far wall will produce lasers routed through thin air and traps that
          refuse to stick. The scan takes about a minute and fixes most of what
          people report as MR jank.
        </p>
        <p
          className="text-[15px] leading-[1.7] mb-8"
          style={{ color: "var(--text-secondary)" }}
        >
          Light the room properly, because passthrough cameras are still
          cameras and a dim lounge produces a grainy, smeary view that undercuts
          everything these games are trying to do. Clear roughly 2 by 2 metres
          if you can. And turn the Guardian boundary off where the game asks you
          to, since the whole point is that the room is the play space and a
          glowing grid in the middle of it defeats the illusion.
        </p>

        {/* Latest MR / XR coverage */}
        <RecentArticles
          tags={["xr", "gaming", "hardware"]}
          heading="Latest Mixed Reality & XR Coverage"
          limit={5}
        />

        {/* Cross-link to other pillar pages */}
        <AllPillarGuides exclude="best-mixed-reality-games" />
      </main>

      <Footer />
    </>
  );
}
