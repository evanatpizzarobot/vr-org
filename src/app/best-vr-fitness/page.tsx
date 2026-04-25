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
import { AD_SLOTS } from "@/lib/ads";

export const metadata: Metadata = {
  title: "Best VR Fitness Apps 2026: Top 10 VR Workout Games | VR.org",
  description:
    "The best VR fitness apps of 2026 ranked. Boxing, HIIT, dance, rhythm cardio, and structured workout classes that actually replace the gym. Tested and ranked by VR.org.",
  openGraph: {
    title: "Best VR Fitness Apps 2026: Top 10 VR Workout Games | VR.org",
    description:
      "The best VR fitness apps of 2026 ranked. Boxing, HIIT, dance, rhythm cardio, and structured workout classes that actually replace the gym.",
    url: "https://vr.org/best-vr-fitness",
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
    title: "Best VR Fitness Apps 2026 | VR.org",
    description:
      "Top VR workout apps ranked. Boxing, HIIT, dance, and structured classes.",
  },
  alternates: {
    canonical: "https://vr.org/best-vr-fitness",
  },
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Best VR Fitness Apps 2026: Top 10 VR Workout Games",
  datePublished: "2026-04-20",
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
    "@id": "https://vr.org/best-vr-fitness",
  },
  image: "https://vr.org/og-image.png",
};

const breadcrumbs = breadcrumbSchema([
  { name: "Home", url: "https://vr.org" },
  { name: "Software", url: "https://vr.org/software" },
  { name: "Best VR Fitness Apps", url: "https://vr.org/best-vr-fitness" },
]);

const fitnessList = itemListSchema("Best VR Fitness Apps 2026", [
  { name: "Supernatural", url: "https://vr.org/best-vr-fitness#supernatural" },
  { name: "FitXR", url: "https://vr.org/best-vr-fitness#fitxr" },
  { name: "Beat Saber", url: "https://vr.org/best-vr-fitness#beat-saber" },
  { name: "Les Mills Bodycombat", url: "https://vr.org/best-vr-fitness#les-mills-bodycombat" },
  { name: "Thrill of the Fight 2", url: "https://vr.org/best-vr-fitness#thrill-of-the-fight-2" },
  { name: "Pistol Whip", url: "https://vr.org/best-vr-fitness#pistol-whip" },
  { name: "Holofit", url: "https://vr.org/best-vr-fitness#holofit" },
  { name: "Liteboxer VR", url: "https://vr.org/best-vr-fitness#liteboxer-vr" },
  { name: "Synth Riders", url: "https://vr.org/best-vr-fitness#synth-riders" },
  { name: "Creed: Rise to Glory", url: "https://vr.org/best-vr-fitness#creed-rise-to-glory" },
]);

const fitnessFaq = faqPageSchema([
  {
    question: "Is VR a good workout?",
    answer:
      "Yes. Games like Beat Saber, Supernatural, FitXR, and Les Mills Bodycombat deliver genuine cardio workouts. Many VR users burn 400 to 600 calories per hour in active VR games, and the Quest platform includes built-in fitness tracking that logs calories and active minutes across every app.",
  },
  {
    question: "Can you lose weight with VR?",
    answer:
      "Yes. VR fitness has been shown to produce real weight loss results for users who commit to consistent workouts, the same way any form of cardio does. The advantage of VR is that it makes exercise enjoyable enough to stick with. Pair regular 30 to 60 minute sessions with a reasonable diet and weight loss is achievable.",
  },
  {
    question: "What is the best VR fitness app?",
    answer:
      "Supernatural and FitXR are the two leading VR fitness apps for structured, instructor-led workouts. Beat Saber remains the best gamified fitness app for high-intensity sessions. For boxing specifically, Les Mills Bodycombat and Thrill of the Fight 2 are outstanding.",
  },
  {
    question: "How many calories do you burn in VR?",
    answer:
      "Active VR games burn roughly 300 to 600 calories per hour depending on intensity. Beat Saber on Expert+ difficulty and boxing titles like Thrill of the Fight 2 are at the high end. Meta Quest's Move tracker shows real-time calorie estimates based on body movement intensity.",
  },
  {
    question: "Do I need a subscription for VR fitness?",
    answer:
      "Some VR fitness apps require subscriptions (Supernatural, FitXR, Les Mills Bodycombat) while others are one-time purchases (Beat Saber, Thrill of the Fight 2, Pistol Whip). Most subscription apps offer free trials. A single game like Beat Saber can provide years of workouts without any recurring fees.",
  },
  {
    question: "What is the best free VR fitness app?",
    answer:
      "Meta's built-in Move tracker is free and works across every Quest app. For free workouts, try the YouTube VR app and follow along with fitness channels. FitXR and Supernatural both offer free trials that give several workouts before requiring a subscription.",
  },
]);

export default function BestVRFitnessPage() {
  return (
    <>
      <StructuredData data={articleSchema} />
      <StructuredData data={breadcrumbs} />
      <StructuredData data={fitnessList} />
      <StructuredData data={fitnessFaq} />
      <Header articleCount={0} lastUpdated="" />

      <main
        className="max-w-[720px] mx-auto px-6 py-16"
        style={{ color: "var(--text-primary)" }}
      >
        <h1
          className="font-display text-4xl font-bold mb-2"
          style={{ letterSpacing: "-0.5px" }}
        >
          Best VR Fitness Apps 2026
        </h1>
        <p
          className="text-sm mb-10"
          style={{ color: "var(--text-muted)" }}
        >
          Last updated: April 2026
        </p>

        <p
          className="text-[15px] leading-[1.7] mb-8"
          style={{ color: "var(--text-secondary)" }}
        >
          VR has quietly become one of the most effective ways to work out at
          home. The best VR fitness apps in 2026 deliver boxing classes with
          real instructors, rhythm-based cardio that burns 500 calories an hour
          without feeling like exercise, and full-body HIIT sessions you can
          knock out in your living room. Below are the ten VR workout apps
          worth your time, ranked by how consistently they get us moving.
        </p>

        <h2 className="font-display text-2xl font-semibold mb-4">
          Is VR fitness worth it?
        </h2>
        <p
          className="text-[15px] leading-[1.7] mb-8"
          style={{ color: "var(--text-secondary)" }}
        >
          Short answer: yes, if you are the kind of person who starts a home
          workout routine and then quits three weeks in because it is boring.
          VR solves the boredom problem. You are so focused on slashing blocks,
          ducking punches, or chasing a top score that you forget you are
          exercising. Most serious VR users burn between 400 and 600 calories
          per hour in active games, which is comparable to running. The
          barrier to entry is a Meta Quest 3 or Quest 3S (from $299) plus a
          subscription or two, and you have a gym that lives in a drawer.
        </p>

        {/* Ad: after Is VR Fitness Worth It, before app #1 */}
        <div className="my-8">
          <AdSlot slot={AD_SLOTS.pillar} format="auto" />
        </div>

        {/* 1. Supernatural */}
        <h2 id="supernatural" className="font-display text-2xl font-semibold mb-2 scroll-mt-20">
          1. Supernatural
        </h2>
        <figure className="fitness-figure">
          <img
            src="https://cdn.getsupernatural.com/images/SN-landscape.png"
            alt="Supernatural VR fitness app on Meta Quest"
            loading="lazy"
          />
        </figure>
        <p className="text-[13px] mb-4" style={{ color: "var(--text-muted)" }}>
          Developer: Within | Platform: Quest | Category: Structured cardio classes
        </p>
        <p
          className="text-[15px] leading-[1.7] mb-8"
          style={{ color: "var(--text-secondary)" }}
        >
          Supernatural is the gold standard for instructor-led VR fitness.
          Daily new classes drop in boxing, flow (rhythm-based cardio), stretch,
          and meditation, all set to licensed music from major artists and
          filmed in stunning real-world locations like Machu Picchu and the
          Grand Canyon. The production value is what separates Supernatural
          from everything else in this list. If you want a VR workout that
          feels like a premium gym experience, this is it. The subscription
          (around $20/month) is pricey but justified by the sheer volume of
          new content.
        </p>

        {/* 2. FitXR */}
        <h2 id="fitxr" className="font-display text-2xl font-semibold mb-2 scroll-mt-20">
          2. FitXR
        </h2>
        <figure className="fitness-figure">
          <img
            src="https://fitxr.com/cdn/shop/files/Hero_Image_Deck_1.png?v=1757556709"
            alt="FitXR studio with instructor-led VR workouts"
            loading="lazy"
          />
        </figure>
        <p className="text-[13px] mb-4" style={{ color: "var(--text-muted)" }}>
          Developer: FitXR | Platform: Quest | Category: Class-based workouts
        </p>
        <p
          className="text-[15px] leading-[1.7] mb-8"
          style={{ color: "var(--text-secondary)" }}
        >
          FitXR offers boxing, HIIT, dance, and combat classes with a roster
          of instructors and class lengths that fit any schedule. The boxing
          programs in particular deliver genuinely intense sessions. The app
          has been iterated on for years and remains one of the most polished
          VR fitness experiences. More affordable than Supernatural at roughly
          $10/month, with a free trial that covers enough workouts to see if
          the format works for you.
        </p>

        {/* 3. Beat Saber */}
        <h2 id="beat-saber" className="font-display text-2xl font-semibold mb-2 scroll-mt-20">
          3. Beat Saber
        </h2>
        <figure className="fitness-figure">
          <img
            src="https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/620980/header.jpg"
            alt="Beat Saber rhythm VR game"
            loading="lazy"
          />
        </figure>
        <p className="text-[13px] mb-4" style={{ color: "var(--text-muted)" }}>
          Developer: Beat Games | Platform: Quest, PC VR, PSVR | Category: Rhythm cardio
        </p>
        <p
          className="text-[15px] leading-[1.7] mb-8"
          style={{ color: "var(--text-secondary)" }}
        >
          Beat Saber was not designed as a fitness app, but on Expert+ it is
          one of the most demanding cardio workouts you can get in VR. Users
          regularly burn 400 to 600 calories per hour slashing blocks on
          high-difficulty tracks. No subscription required, a massive base
          library of songs, and an enormous custom song modding scene that
          gives you infinite content. If you only buy one VR game for fitness,
          this is it.
        </p>

        {/* 4. Les Mills Bodycombat */}
        <h2 id="les-mills-bodycombat" className="font-display text-2xl font-semibold mb-2 scroll-mt-20">
          4. Les Mills Bodycombat
        </h2>
        <figure className="fitness-figure">
          <img
            src="https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/3484680/library_hero.jpg"
            alt="Les Mills Bodycombat VR martial arts cardio"
            loading="lazy"
          />
        </figure>
        <p className="text-[13px] mb-4" style={{ color: "var(--text-muted)" }}>
          Developer: Odders Lab / Les Mills | Platform: Quest, PSVR2 | Category: Martial arts cardio
        </p>
        <p
          className="text-[15px] leading-[1.7] mb-8"
          style={{ color: "var(--text-secondary)" }}
        >
          Les Mills brought their massively popular gym class to VR, and it
          works beautifully. Mixed martial arts choreography with punches,
          kicks, and elbows, set to energetic music and coached by actual Les
          Mills instructors. One-time purchase with free DLC updates, which
          makes it a great value compared to subscription apps.
        </p>

        {/* 5. Thrill of the Fight 2 */}
        <h2 id="thrill-of-the-fight-2" className="font-display text-2xl font-semibold mb-2 scroll-mt-20">
          5. Thrill of the Fight 2
        </h2>
        <figure className="fitness-figure">
          <img
            src="https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/3279600/header.jpg"
            alt="The Thrill of the Fight 2 VR boxing"
            loading="lazy"
          />
        </figure>
        <p className="text-[13px] mb-4" style={{ color: "var(--text-muted)" }}>
          Developer: Sealost Interactive | Platform: Quest | Category: Boxing simulator
        </p>
        <p
          className="text-[15px] leading-[1.7] mb-8"
          style={{ color: "var(--text-secondary)" }}
        >
          The follow-up to the famously brutal VR boxing sim is a more
          complete package with better opponents, tighter hit detection, and
          smoother movement. If you want to feel like you actually boxed three
          rounds, Thrill of the Fight 2 delivers. Not for the faint of heart.
          Expect to be sore.
        </p>

        {/* Ad: between #5 (Thrill of the Fight 2) and #6 (Pistol Whip) */}
        <div className="my-8">
          <AdSlot slot={AD_SLOTS.pillar} format="horizontal" />
        </div>

        {/* 6. Pistol Whip */}
        <h2 id="pistol-whip" className="font-display text-2xl font-semibold mb-2 scroll-mt-20">
          6. Pistol Whip
        </h2>
        <figure className="fitness-figure">
          <img
            src="https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/929530/header.jpg"
            alt="Pistol Whip VR rhythm shooter"
            loading="lazy"
          />
        </figure>
        <p className="text-[13px] mb-4" style={{ color: "var(--text-muted)" }}>
          Developer: Cloudhead Games | Platform: Quest, PC VR, PSVR | Category: Rhythm shooter
        </p>
        <p
          className="text-[15px] leading-[1.7] mb-8"
          style={{ color: "var(--text-secondary)" }}
        >
          Pistol Whip puts you in a John Wick style rail shooter synced to
          music. You duck, dodge, lean, and aim constantly. The fitness payoff
          comes from the unique mix of upper and lower body movement. One-time
          purchase with regular free content updates.
        </p>

        {/* 7. Holofit */}
        <h2 id="holofit" className="font-display text-2xl font-semibold mb-2 scroll-mt-20">
          7. Holofit
        </h2>
        <figure className="fitness-figure">
          <img
            src="https://www.holodia.com/wp-content/uploads/2022/03/holofit_vr_fitness_cycling_rowing_running_boxing.png"
            alt="Holofit VR overlay for cardio equipment"
            loading="lazy"
          />
        </figure>
        <p className="text-[13px] mb-4" style={{ color: "var(--text-muted)" }}>
          Developer: Holodia | Platform: Quest | Category: Cardio machine companion
        </p>
        <p
          className="text-[15px] leading-[1.7] mb-8"
          style={{ color: "var(--text-secondary)" }}
        >
          Holofit pairs with real fitness equipment (rowing machines,
          ellipticals, stationary bikes) and overlays VR environments so your
          workout feels like rowing across the Arctic or cycling through
          alien landscapes. Niche, but incredibly effective at making
          stationary cardio tolerable.
        </p>

        {/* 8. Liteboxer VR */}
        <h2 id="liteboxer-vr" className="font-display text-2xl font-semibold mb-2 scroll-mt-20">
          8. Liteboxer VR
        </h2>
        <figure className="fitness-figure">
          <img
            src="https://images.squarespace-cdn.com/content/v1/656a0f7700f22346d4b063b9/0fc2d4a3-f72c-4b31-a67b-f5092397b3fe/23_LS_P-010.jpg"
            alt="Liteboxer VR boxing fitness"
            loading="lazy"
          />
        </figure>
        <p className="text-[13px] mb-4" style={{ color: "var(--text-muted)" }}>
          Developer: Liteboxer | Platform: Quest | Category: Boxing fitness
        </p>
        <p
          className="text-[15px] leading-[1.7] mb-8"
          style={{ color: "var(--text-secondary)" }}
        >
          Liteboxer brings the popular at-home boxing platform to VR. Punch
          combinations sync to music with flashing target cues, and the app
          tracks your accuracy, speed, and power. A solid alternative to FitXR
          if boxing is your primary focus.
        </p>

        {/* 9. Synth Riders */}
        <h2 id="synth-riders" className="font-display text-2xl font-semibold mb-2 scroll-mt-20">
          9. Synth Riders
        </h2>
        <figure className="fitness-figure">
          <img
            src="https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/885000/header.jpg"
            alt="Synth Riders VR rhythm dance"
            loading="lazy"
          />
        </figure>
        <p className="text-[13px] mb-4" style={{ color: "var(--text-muted)" }}>
          Developer: Kluge Interactive | Platform: Quest, PC VR, PSVR | Category: Rhythm dance
        </p>
        <p
          className="text-[15px] leading-[1.7] mb-8"
          style={{ color: "var(--text-secondary)" }}
        >
          Think of Synth Riders as Beat Saber's more dance-oriented cousin.
          Flowing hand movements along musical paths, full-body swaying, and
          an emphasis on rhythm and flow rather than slashing. The dedicated
          Dance mode is particularly good for anyone who wants a lower-impact
          but still sweat-inducing workout.
        </p>

        {/* 10. Creed: Rise to Glory */}
        <h2 id="creed-rise-to-glory" className="font-display text-2xl font-semibold mb-2 scroll-mt-20">
          10. Creed: Rise to Glory
        </h2>
        <figure className="fitness-figure">
          <img
            src="https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/804490/header.jpg"
            alt="Creed Rise to Glory VR boxing"
            loading="lazy"
          />
        </figure>
        <p className="text-[13px] mb-4" style={{ color: "var(--text-muted)" }}>
          Developer: Survios | Platform: Quest, PC VR, PSVR | Category: Boxing story mode
        </p>
        <p
          className="text-[15px] leading-[1.7] mb-8"
          style={{ color: "var(--text-secondary)" }}
        >
          Creed is a full boxing game rather than a fitness app, but the
          training modes and fights are physically demanding enough to count.
          If you want a story-driven progression system attached to your
          workouts, Creed's Rocky-meets-Creed career mode is genuinely fun.
        </p>

        {/* How to get started */}
        <h2 className="font-display text-2xl font-semibold mb-4">
          How to get started with VR fitness
        </h2>
        <p
          className="text-[15px] leading-[1.7] mb-4"
          style={{ color: "var(--text-secondary)" }}
        >
          The Meta Quest 3S at $299 is the most accessible entry point.
          Before you start, pick up a sweat-friendly face cover and a better
          head strap because the default Quest face interface is not built
          for actual sweat. Silicone covers cost $15 to $25 and protect the
          headset. Plan 3 to 4 workouts per week and mix an instructor-led
          app (Supernatural or FitXR) with a rhythm game (Beat Saber or
          Synth Riders) to avoid burnout. Start with 20 minute sessions and
          build up.
        </p>

        {/* Latest fitness / software articles */}
        <RecentArticles
          tags={["software", "gaming", "fitness"]}
          heading="Latest VR Fitness & Software Coverage"
          limit={5}
        />

        {/* Cross-link to other pillar pages */}
        <AllPillarGuides exclude="best-vr-fitness" />
      </main>

      <Footer />
    </>
  );
}
