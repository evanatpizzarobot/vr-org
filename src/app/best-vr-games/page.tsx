import { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "Top 10 VR Games of All Time | VR.org",
  description:
    "The 10 greatest VR games ever made, ranked. From Half-Life: Alyx to Beat Saber, these are the titles that defined Virtual Reality gaming. Updated for 2026.",
  openGraph: {
    url: "https://vr.org/best-vr-games",
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
  },
  alternates: {
    canonical: "https://vr.org/best-vr-games",
  },
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Top 10 VR Games of All Time",
  datePublished: "2026-03-24",
  dateModified: "2026-04-20",
  author: {
    "@type": "Organization",
    name: "VR.org",
  },
  publisher: {
    "@type": "Organization",
    name: "VR.org",
    logo: {
      "@type": "ImageObject",
      url: "https://vr.org/logo.png",
    },
  },
};

const breadcrumbs = breadcrumbSchema([
  { name: "Home", url: "https://vr.org" },
  { name: "Gaming", url: "https://vr.org/gaming" },
  { name: "Top 10 VR Games", url: "https://vr.org/best-vr-games" },
]);

const gamesList = itemListSchema("Top 10 VR Games of All Time", [
  { name: "Half-Life: Alyx", url: "https://vr.org/best-vr-games#half-life-alyx" },
  { name: "Beat Saber", url: "https://vr.org/best-vr-games#beat-saber" },
  { name: "Resident Evil 4 VR", url: "https://vr.org/best-vr-games#resident-evil-4-vr" },
  { name: "Asgard's Wrath 2", url: "https://vr.org/best-vr-games#asgards-wrath-2" },
  { name: "Superhot VR", url: "https://vr.org/best-vr-games#superhot-vr" },
  { name: "Boneworks / Bonelab", url: "https://vr.org/best-vr-games#boneworks-bonelab" },
  { name: "The Walking Dead: Saints and Sinners", url: "https://vr.org/best-vr-games#walking-dead-saints-sinners" },
  { name: "Moss", url: "https://vr.org/best-vr-games#moss" },
  { name: "Pavlov VR", url: "https://vr.org/best-vr-games#pavlov-vr" },
  { name: "No Man's Sky VR", url: "https://vr.org/best-vr-games#no-mans-sky-vr" },
]);

const gamesFaq = faqPageSchema([
  {
    question: "What is the best VR game of all time?",
    answer:
      "Half-Life: Alyx is widely considered the best VR game of all time. Valve built every interaction from the ground up for VR, and the result is a polished, full-length AAA experience that no other VR title has matched for scope or ambition.",
  },
  {
    question: "What are the best VR games for Meta Quest?",
    answer:
      "Asgard's Wrath 2, Beat Saber, Resident Evil 4 VR, Batman: Arkham Shadow, Superhot VR, and Bonelab are widely regarded as the best VR games on Meta Quest. The Quest platform also supports Half-Life: Alyx via PC VR streaming.",
  },
  {
    question: "Is Half-Life: Alyx on Quest?",
    answer:
      "Half-Life: Alyx is a PC VR exclusive on SteamVR, but Quest owners can play it by connecting their headset to a gaming PC via USB-C (Quest Link) or wirelessly via Air Link or Virtual Desktop.",
  },
  {
    question: "What are the best free VR games?",
    answer:
      "Pavlov VR (paid but with huge community mods), VRChat, Rec Room, and Gorilla Tag are among the most played free VR games. Many of the best paid VR games go on sale regularly on the Meta Store and Steam.",
  },
  {
    question: "Do VR games make you fit?",
    answer:
      "Yes. Games like Beat Saber, Supernatural, FitXR, and Les Mills Bodycombat provide genuine cardio workouts. Many VR users burn 400 to 600 calories per hour in active VR games, and the Quest platform includes built-in fitness tracking.",
  },
]);

export default function BestVRGamesPage() {
  return (
    <>
      <StructuredData data={articleSchema} />
      <StructuredData data={breadcrumbs} />
      <StructuredData data={gamesList} />
      <StructuredData data={gamesFaq} />
      <Header articleCount={0} lastUpdated="" />
      <main style={{ maxWidth: 720, margin: "0 auto" }} className="py-16 px-4">
        <h1
          className="font-display text-4xl font-bold mb-2"
          style={{ letterSpacing: "-0.5px" }}
        >
          Top 10 VR Games of All Time
        </h1>
        <p className="text-sm mb-10" style={{ color: "var(--text-muted)" }}>
          Last updated: March 2026
        </p>

        <p
          className="text-[15px] leading-[1.7] mb-8"
          style={{ color: "var(--text-secondary)" }}
        >
          Virtual Reality has produced some genuinely unforgettable gaming
          experiences over the past decade. These ten games didn&apos;t just work
          well in VR. They proved that VR is its own medium, capable of things no
          flat screen can replicate. Whether you just got your first headset or
          you&apos;ve been in VR since the DK1 days, these are the games that
          define what Virtual Reality gaming can be.
        </p>

        {/* 1. Half-Life: Alyx */}
        <h2 id="half-life-alyx" className="font-display text-2xl font-semibold mb-2 scroll-mt-20">
          1. Half-Life: Alyx
        </h2>
        <figure className="fitness-figure">
          <img
            src="https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/546560/header.jpg"
            alt="Half-Life: Alyx Steam header art with Alyx Vance and a Combine soldier"
            loading="lazy"
          />
        </figure>
        <p
          className="text-[13px] mb-4"
          style={{ color: "var(--text-muted)" }}
        >
          Developer: Valve | Platform: PC VR | Released: 2020
        </p>
        <p
          className="text-[15px] leading-[1.7] mb-8"
          style={{ color: "var(--text-secondary)" }}
        >
          Half-Life: Alyx isn&apos;t just the best VR game ever made. It&apos;s
          one of the best games, period. Valve built every interaction from the
          ground up for VR, from the gravity gloves to the way you physically
          rummage through shelves for ammo. The world of City 17 feels tangible
          in a way no other game has matched. The pacing, the horror, the puzzle
          design, the story. Everything clicks. Six years later, nothing has come
          close to this level of polish and ambition in VR. If you own a VR
          headset and haven&apos;t played it, fix that immediately.{" "}
          <a
            href="/articles/half-life-alyx-still-the-gold-standard"
            className="no-underline hover:underline"
            style={{ color: "var(--accent-cyan)" }}
          >
            Read our full feature on why Alyx is still the gold standard
          </a>
        </p>

        {/* 2. Beat Saber */}
        <h2 id="beat-saber" className="font-display text-2xl font-semibold mb-2 scroll-mt-20">
          2. Beat Saber
        </h2>
        <figure className="fitness-figure">
          <img
            src="https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/620980/header.jpg"
            alt="Beat Saber rhythm VR game header art"
            loading="lazy"
          />
        </figure>
        <p
          className="text-[13px] mb-4"
          style={{ color: "var(--text-muted)" }}
        >
          Developer: Beat Games | Platform: Quest, PC VR, PSVR | Released: 2018
        </p>
        <p
          className="text-[15px] leading-[1.7] mb-8"
          style={{ color: "var(--text-secondary)" }}
        >
          Beat Saber turned VR into a cultural phenomenon. The concept is dead
          simple: slash blocks to the beat of music with glowing sabers. But the
          execution is flawless. The responsiveness, the visual clarity, the way
          expert-level tracks make you feel like a Jedi having a workout.
          It&apos;s the game that sold more headsets than any other, and years
          later it&apos;s still the first thing most people load up when they try
          VR. The custom song community keeps it endlessly replayable.
        </p>

        {/* 3. Resident Evil 4 VR */}
        <h2 id="resident-evil-4-vr" className="font-display text-2xl font-semibold mb-2 scroll-mt-20">
          3. Resident Evil 4 VR
        </h2>
        <figure className="fitness-figure">
          <img
            src="https://upload.wikimedia.org/wikipedia/en/d/d9/Resi4-gc-cover.jpg"
            alt="Resident Evil 4 cover art used as the basis for the Quest VR port"
            loading="lazy"
          />
        </figure>
        <p
          className="text-[13px] mb-4"
          style={{ color: "var(--text-muted)" }}
        >
          Developer: Armature Studio / Capcom | Platform: Quest | Released: 2021
        </p>
        <p
          className="text-[15px] leading-[1.7] mb-8"
          style={{ color: "var(--text-secondary)" }}
        >
          Taking one of the greatest action games ever made and rebuilding it for
          VR could have gone wrong in a hundred ways. Instead, Resident Evil 4 VR
          became one of the most impressive ports in gaming history. Physically
          aiming the gun, reaching over your shoulder for the shotgun, managing
          your inventory in real space. Everything feels natural. The village
          siege, the lake encounter, the castle halls. Moments that were already
          iconic on a flat screen become genuinely intense when you&apos;re
          standing inside them.
        </p>

        {/* 4. Asgard's Wrath 2 */}
        <h2 id="asgards-wrath-2" className="font-display text-2xl font-semibold mb-2 scroll-mt-20">
          4. Asgard&apos;s Wrath 2
        </h2>
        <figure className="fitness-figure">
          <img
            src="https://upload.wikimedia.org/wikipedia/en/b/b4/Asgard%27s_Wrath_2_cover.jpg"
            alt="Asgard's Wrath 2 cover art for Meta Quest"
            loading="lazy"
          />
        </figure>
        <p
          className="text-[13px] mb-4"
          style={{ color: "var(--text-muted)" }}
        >
          Developer: Sanzaru Games | Platform: Quest | Released: 2023
        </p>
        <p
          className="text-[15px] leading-[1.7] mb-8"
          style={{ color: "var(--text-secondary)" }}
        >
          Asgard&apos;s Wrath 2 is the game that proved standalone VR can
          support a full-scale RPG. The amount of content is staggering: dozens
          of hours of combat, exploration, puzzles, and boss fights across richly
          detailed mythological environments. Wall running, grappling hooks,
          melee and magic combat. It has everything. It&apos;s the closest thing
          to a AAA console RPG that exists entirely inside a VR headset, and it
          sets the bar for what Quest games can achieve.
        </p>

        {/* 5. Superhot VR */}
        <h2 id="superhot-vr" className="font-display text-2xl font-semibold mb-2 scroll-mt-20">
          5. Superhot VR
        </h2>
        <figure className="fitness-figure">
          <img
            src="https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/617830/header.jpg"
            alt="Superhot VR Steam header art with red shattering enemies"
            loading="lazy"
          />
        </figure>
        <p
          className="text-[13px] mb-4"
          style={{ color: "var(--text-muted)" }}
        >
          Developer: Superhot Team | Platform: Quest, PC VR, PSVR | Released:
          2017
        </p>
        <p
          className="text-[15px] leading-[1.7] mb-8"
          style={{ color: "var(--text-secondary)" }}
        >
          Time only moves when you move. That single idea made Superhot one of
          the smartest games on any platform. In VR, it becomes something else
          entirely. Physically dodging bullets, catching weapons mid-air, lining
          up shots while frozen in time. Every encounter plays out like
          you&apos;re directing your own action movie. It&apos;s short, but every
          minute is perfectly designed. The kind of game that makes you understand
          why VR exists.
        </p>

        {/* 6. Boneworks / Bonelab */}
        <h2 id="boneworks-bonelab" className="font-display text-2xl font-semibold mb-2 scroll-mt-20">
          6. Boneworks / Bonelab
        </h2>
        <figure className="fitness-figure">
          <img
            src="https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/823500/header.jpg"
            alt="Boneworks key art from Stress Level Zero"
            loading="lazy"
          />
        </figure>
        <p
          className="text-[13px] mb-4"
          style={{ color: "var(--text-muted)" }}
        >
          Developer: Stress Level Zero | Platform: PC VR / Quest | Released:
          2019 / 2022
        </p>
        <p
          className="text-[15px] leading-[1.7] mb-8"
          style={{ color: "var(--text-secondary)" }}
        >
          Stress Level Zero built the most ambitious physics system in VR. Your
          virtual body has weight, momentum, and collision. Objects behave like
          real objects. Weapons feel heavy. Climbing feels physical. The result is
          a sandbox where emergent gameplay happens constantly. Boneworks was the
          PC VR version that blew people&apos;s minds. Bonelab brought it to
          Quest with mod support that turned it into an endlessly expandable
          platform. Neither game holds your hand, and that&apos;s the point.
        </p>

        {/* 7. The Walking Dead: Saints and Sinners */}
        <h2 id="walking-dead-saints-sinners" className="font-display text-2xl font-semibold mb-2 scroll-mt-20">
          7. The Walking Dead: Saints and Sinners
        </h2>
        <figure className="fitness-figure">
          <img
            src="https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/916840/header.jpg"
            alt="The Walking Dead: Saints and Sinners VR header art"
            loading="lazy"
          />
        </figure>
        <p
          className="text-[13px] mb-4"
          style={{ color: "var(--text-muted)" }}
        >
          Developer: Skydance Interactive | Platform: Quest, PC VR, PSVR |
          Released: 2020
        </p>
        <p
          className="text-[15px] leading-[1.7] mb-8"
          style={{ color: "var(--text-secondary)" }}
        >
          Saints and Sinners nailed VR melee combat in a way nobody else has. The
          physics-driven weapon system means every swing, stab, and throw has
          real weight behind it. Combined with a survival loop that forces you to
          scavenge and make hard choices in a flooded New Orleans, it creates one
          of the most immersive VR experiences available. The sequel, Retribution,
          expanded on everything, but the original remains a landmark title.
        </p>

        {/* 8. Moss */}
        <h2 id="moss" className="font-display text-2xl font-semibold mb-2 scroll-mt-20">
          8. Moss
        </h2>
        <figure className="fitness-figure">
          <img
            src="https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/846470/header.jpg"
            alt="Moss VR header art featuring Quill the mouse adventurer"
            loading="lazy"
          />
        </figure>
        <p
          className="text-[13px] mb-4"
          style={{ color: "var(--text-muted)" }}
        >
          Developer: Polyarc | Platform: Quest, PC VR, PSVR | Released: 2018
        </p>
        <p
          className="text-[15px] leading-[1.7] mb-8"
          style={{ color: "var(--text-secondary)" }}
        >
          Moss proved that VR doesn&apos;t have to be first-person to be magical.
          You play as a spirit guide looking down at Quill, a tiny mouse on an
          adventure through a storybook world. The perspective is like peering
          into a living diorama. You lean in to examine details, reach down to
          interact with the environment, and build a genuine emotional connection
          with a character who is six inches tall. It&apos;s intimate, beautiful,
          and unlike anything else in VR.
        </p>

        {/* 9. Pavlov VR */}
        <h2 id="pavlov-vr" className="font-display text-2xl font-semibold mb-2 scroll-mt-20">
          9. Pavlov VR
        </h2>
        <figure className="fitness-figure">
          <img
            src="https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/555160/header.jpg"
            alt="Pavlov VR competitive multiplayer shooter Steam header"
            loading="lazy"
          />
        </figure>
        <p
          className="text-[13px] mb-4"
          style={{ color: "var(--text-muted)" }}
        >
          Developer: Vankrupt Games | Platform: Quest, PC VR | Released: 2017
        </p>
        <p
          className="text-[15px] leading-[1.7] mb-8"
          style={{ color: "var(--text-secondary)" }}
        >
          Pavlov is the Counter-Strike of VR. Fast, competitive multiplayer
          shooting with manual reloading, realistic weapon handling, and a
          massive community. Search and Destroy, Team Deathmatch, and an
          incredible modding scene that has recreated everything from Call of Duty
          maps to zombie survival modes. It&apos;s scrappy, community-driven,
          and endlessly playable. If you want competitive VR multiplayer, Pavlov
          is where the community lives.
        </p>

        {/* 10. No Man's Sky VR */}
        <h2 id="no-mans-sky-vr" className="font-display text-2xl font-semibold mb-2 scroll-mt-20">
          10. No Man&apos;s Sky VR
        </h2>
        <figure className="fitness-figure">
          <img
            src="https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/275850/header.jpg"
            alt="No Man's Sky Steam header art with explorer and alien fauna"
            loading="lazy"
          />
        </figure>
        <p
          className="text-[13px] mb-4"
          style={{ color: "var(--text-muted)" }}
        >
          Developer: Hello Games | Platform: Quest, PC VR, PSVR | Released: 2019
          (VR update)
        </p>
        <p
          className="text-[15px] leading-[1.7] mb-8"
          style={{ color: "var(--text-secondary)" }}
        >
          No Man&apos;s Sky is the ultimate VR exploration game. An entire
          procedurally generated universe, playable start to finish in VR. Flying
          your ship from a planet&apos;s surface into orbit, landing on unknown
          worlds, building bases, trading with aliens. The sense of scale is
          unmatched. Standing in the cockpit of your freighter and looking out at
          a gas giant filling the viewport is the kind of moment that reminds you
          why you bought a headset. Hello Games has continued to update and
          improve VR support years after launch, making it one of the best
          ongoing VR experiences.
        </p>

        {/* Honorable Mentions */}
        <h2 className="font-display text-2xl font-semibold mb-2">
          Honorable mentions
        </h2>
        <p
          className="text-[15px] leading-[1.7] mb-8"
          style={{ color: "var(--text-secondary)" }}
        >
          Pistol Whip is rhythm meets action in the slickest package possible.
          Phasmophobia is the best co-op horror experience in VR, especially with
          friends on mics. Into the Radius is Stalker in VR and scratches that
          hardcore survival itch. Batman: Arkham Shadow brings
          Rocksteady-quality combat to Quest. Walkabout Mini Golf is proof that
          the simplest ideas can become the most played VR games in your library.
        </p>

        {/* Latest gaming articles */}
        <RecentArticles
          tags={["gaming"]}
          heading="Latest VR Gaming Coverage"
          limit={5}
        />

        {/* Cross-link to other pillar pages */}
        <AllPillarGuides exclude="best-vr-games" />
      </main>
      <Footer />
    </>
  );
}
