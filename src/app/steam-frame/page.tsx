import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
  StructuredData,
  breadcrumbSchema,
  faqPageSchema,
  productSchema,
} from "@/components/StructuredData";
import { RecentArticles } from "@/components/RecentArticles";
import { AllPillarGuides } from "@/components/RelatedGuides";
import { AdSlot } from "@/components/AdSlot";
import { AD_SLOTS } from "@/lib/ads";
import { ComparisonTable, FaqSection } from "@/components/SpokeBlocks";

export const metadata = {
  title: "Valve Steam Frame: Release Date, Price, Specs & Everything We Know | VR.org",
  description:
    "Valve's Steam Frame is confirmed for summer 2026 with reservations imminent. The latest on the release date, price signals ($899 to $1,199 expected), full specs, and every development, tracked by VR.org.",
  openGraph: {
    title: "Valve Steam Frame: Release Date, Price, Specs & Everything We Know | VR.org",
    description:
      "Confirmed for summer 2026 with reservations imminent. Release date signals, price expectations, specs, and every development tracked.",
    url: "https://vr.org/steam-frame",
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
    title: "Valve Steam Frame: Release Date, Price, Specs & Everything We Know",
    description:
      "Confirmed for summer 2026 with reservations imminent. Every Steam Frame development, tracked by VR.org.",
    images: ["https://vr.org/article-images/steam-frame/steam-frame-headset.jpg"],
  },
  alternates: {
    canonical: "https://vr.org/steam-frame",
  },
};

const LAST_UPDATED = "2026-07-30";

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Valve Steam Frame: Release Date, Price, Specs, and Everything We Know",
  datePublished: "2026-07-04",
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
    "@id": "https://vr.org/steam-frame",
  },
  image: "https://vr.org/article-images/steam-frame/steam-frame-headset.jpg",
};

const breadcrumbs = breadcrumbSchema([
  { name: "Home", url: "https://vr.org" },
  { name: "Hardware", url: "https://vr.org/hardware" },
  { name: "Valve Steam Frame", url: "https://vr.org/steam-frame" },
]);

// Entity-only Product node: no offers (price unannounced), no ratings.
const frameProduct = productSchema({
  name: "Valve Steam Frame",
  brand: "Valve",
  description:
    "Standalone SteamOS VR headset with a dedicated 6GHz wireless dongle for PC VR streaming. Confirmed for a summer 2026 release; pricing not yet announced.",
  url: "https://vr.org/steam-frame",
  image: "https://vr.org/article-images/steam-frame/steam-frame-headset.jpg",
});

const faq = faqPageSchema([
  {
    question: "When does the Valve Steam Frame come out?",
    answer:
      "Valve has confirmed a summer 2026 window for the Steam Frame, alongside the Steam Machine that shipped June 30. Summer ends September 22, which leaves Valve a narrow window. On July 29 the FCC granted Valve equipment authorization for FCC ID 2AES4-1015, a device listed only as a VR Headset, which is the legal clearance required to sell it in the United States. Roughly 35 tons of VR hardware cleared customs into Valve's US warehouses in June and the Great on Frame store section went live in mid July, so the hardware is built, certified, and merchandised; Valve just has not named the day or the price.",
  },
  {
    question: "How much will the Steam Frame cost?",
    answer:
      "There is no official price yet. Early retailer database listings pointed to roughly $950 for a 512GB model and about $1,070 for a larger one, and analyst estimates cluster between $899 and $1,199. Valve originally said it wanted the Frame cheaper than the $999 Index, but the memory crisis that pushed the Steam Machine to $1,049 makes the low end of that range look optimistic. Budget toward the high end.",
  },
  {
    question: "How do I preorder the Steam Frame?",
    answer:
      "Valve has not opened reservations yet. Expect the same playbook as the Steam Machine: a short-notice, randomized reservation queue on Steam rather than a first-come first-served preorder, with purchase emails following within days. The Steam Controller sold out in under an hour and the Machine used a lottery, so supply will likely be tight.",
  },
  {
    question: "Is the Steam Frame standalone or a PC VR headset?",
    answer:
      "Both. It runs SteamOS on a Snapdragon 8 Gen 3 with 16GB of RAM and plays games on-device through Proton and FEX x86 emulation, including Android APKs. It also ships with a dedicated 6GHz point-to-point wireless dongle for streaming from a gaming PC, which Valve describes as the primary experience. Hands-on reports describe the streaming as having no perceptible lag.",
  },
  {
    question: "What games will the Steam Frame launch with?",
    answer:
      "No first-party launch game has been announced, and Road to VR reported that a Steam Frame team member denied Valve has any VR content in development. The launch story is the Steam library itself via streaming and Proton, plus the certified catalog on the Great on Frame page, which listed eight titles as of July 17 including Portal 2, The Lab, Into Black, and Underdogs. Payday: Aces High was the first third-party title to list Steam Frame as a target platform, and candidates like H3VR2 and Into the Radius 2 are in the window.",
  },
  {
    question: "What is Steam Frame Verified?",
    answer:
      "Valve's compatibility program, announced at GDC 2026. Standalone VR titles must hold 90 FPS on-device, stricter than the 72Hz baselines Meta and Pico accept, and standalone flatscreen titles need 720p at 30 FPS minimum with full Frame controller support. The badge is a recommendation rather than a gate, and streamed PC VR content is exempt. Certified games are collected on the Great on Frame storefront page, which went live in mid July 2026 and listed eight titles within two days.",
  },
]);

interface TimelineEntry {
  date: string;
  slug: string;
  text: string;
}

const TIMELINE: TimelineEntry[] = [
  {
    date: "Mar 19, 2026",
    slug: "steam-frame-everything-we-know",
    text: "Our first full overview: standalone SteamOS headset, wireless PC streaming dongle, shipping in 2026.",
  },
  {
    date: "Mar 30, 2026",
    slug: "vr-games-showcase-march-2026-biggest-reveals",
    text: "Payday: Aces High becomes the first third-party game to list Steam Frame as a target platform.",
  },
  {
    date: "Apr 14, 2026",
    slug: "valve-steam-frame-update-april-2026",
    text: "The full spec sheet lands: 185g frontbox, dual 2160x2160 displays, Snapdragon 8 Gen 3, 16GB RAM, eye tracking.",
  },
  {
    date: "Apr 25, 2026",
    slug: "steam-frame-verified-90fps-stricter-than-quest-pico",
    text: "Steam Frame Verified requires 90 FPS for standalone VR, stricter than Meta and Pico.",
  },
  {
    date: "Apr 25, 2026",
    slug: "valve-steam-machine-controller-store-pages-live-april-2026",
    text: "Steam store hardware pages go live; KOMODO lists the Frame for Asian markets.",
  },
  {
    date: "Apr 30, 2026",
    slug: "memory-crisis-reshaping-vr-hardware-ai-dram-shortage-2026",
    text: "The AI-driven DRAM crisis puts the Frame's 16GB of LPDDR5X squarely in the blast radius.",
  },
  {
    date: "May 1, 2026",
    slug: "valve-steam-controller-launches-may-4-99-dollars",
    text: "The $99 Steam Controller, the Frame's non-VR input, gets a May 4 date.",
  },
  {
    date: "May 4, 2026",
    slug: "valve-steam-controller-sold-out-launch-day-may-2026",
    text: "The Steam Controller sells out in under an hour.",
  },
  {
    date: "May 4, 2026",
    slug: "steam-controller-sellout-demand-signal-steam-frame",
    text: "Our read on the sellout as a demand signal for the Frame.",
  },
  {
    date: "May 7, 2026",
    slug: "bosworth-quest-4-roadmap-learn-from-steam-frame-may-2026",
    text: "Meta CTO Bosworth says Meta will learn from the Frame, singling out the wireless dongle.",
  },
  {
    date: "May 13, 2026",
    slug: "steam-frame-ai-ram-crisis-delay-2026",
    text: "Valve publicly revisits the shipping schedule and pricing over the RAM crisis; the Frame is marked coming soon on Steam's backend.",
  },
  {
    date: "May 16, 2026",
    slug: "everything-riding-on-steam-frame-2026",
    text: "Our long-form on the stakes: the 6GHz dongle is the killer feature, and hands-on reports describe lag-free streaming.",
  },
  {
    date: "Jun 6, 2026",
    slug: "steam-frame-no-launch-game-reckoning-2026",
    text: "The launch-game reckoning: no first-party VR title, seven months after a team member denied any was in development.",
  },
  {
    date: "Jun 18, 2026",
    slug: "steam-frame-fcc-filing-warehouse-imports-june-2026-launch-imminent",
    text: "FCC embargo lifts on the motion controllers and an Enthusiast Kit; about 35 tons of hardware clears into US warehouses.",
  },
  {
    date: "Jun 25, 2026",
    slug: "steam-machine-1049-june-30-launch-price-ceiling-steam-frame",
    text: "The Steam Machine prices at $1,049 and Valve confirms summer 2026 for the Frame.",
  },
  {
    date: "Jul 3, 2026",
    slug: "this-week-in-vr-2026-07-03",
    text: "Status check: reservations still imminent, no official price.",
  },
  {
    date: "Jul 13, 2026",
    slug: "valve-great-on-frame-steam-page-steam-frame-launch-signal",
    text: "The Great on Frame storefront section goes live on Steam, the clearest launch signal yet.",
  },
  {
    date: "Jul 14, 2026",
    slug: "valve-great-on-frame-steam-page-steam-frame-launch-signal",
    text: "The verified list grows to eight titles in a day: Underdogs, Ancient Dungeon, and Slots & Diapers join.",
  },
  {
    date: "Jul 18, 2026",
    slug: "steam-frame-brutal-market-wins-anyway-2026",
    text: "Valve ships a major SteamVR dashboard overhaul in beta, and our read on why the Frame wins its brutal launch market anyway.",
  },
  {
    date: "Jul 30, 2026",
    slug: "steam-frame-fcc-grant-equipment-authorization-july-2026",
    text: "The FCC grants equipment authorization for FCC ID 2AES4-1015, clearing the headset for legal sale in the US. Certification covers the 6GHz radio the wireless PC VR pitch depends on.",
  },
];

export default function SteamFramePage() {
  return (
    <>
      <StructuredData data={articleSchema} />
      <StructuredData data={breadcrumbs} />
      <StructuredData data={frameProduct} />
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
          Valve Steam Frame: Release Date, Price, Specs, and Everything We Know
        </h1>

        <p className="text-sm mb-3" style={{ color: "var(--text-muted)" }}>
          Last updated: July 30, 2026
        </p>

        <p className="text-[13px] mb-8" style={{ color: "var(--text-muted)" }}>
          Deep dives:{" "}
          <a
            href="/steam-frame-release-date"
            className="no-underline hover:underline"
            style={{ color: "var(--accent-cyan)" }}
          >
            release date tracker
          </a>
          ,{" "}
          <a
            href="/steam-frame-price"
            className="no-underline hover:underline"
            style={{ color: "var(--accent-cyan)" }}
          >
            price tracker
          </a>
          , and the{" "}
          <a
            href="/great-on-frame"
            className="no-underline hover:underline"
            style={{ color: "var(--accent-cyan)" }}
          >
            Great on Frame verified games list
          </a>
          . Part of our{" "}
          <a
            href="/vr-release-dates"
            className="no-underline hover:underline"
            style={{ color: "var(--accent-cyan)" }}
          >
            VR release dates tracker
          </a>
          . For buying advice today, see the{" "}
          <a
            href="/best-pc-vr-headset"
            className="no-underline hover:underline"
            style={{ color: "var(--accent-cyan)" }}
          >
            best PC VR headsets
          </a>
          .
        </p>

        {/* Definitional lede for AI Overview capture */}
        <p
          className="text-[15px] leading-[1.7] mb-8"
          style={{ color: "var(--text-secondary)" }}
        >
          The Steam Frame is Valve&apos;s standalone SteamOS VR headset with a
          dedicated 6GHz wireless dongle for PC VR streaming, confirmed for a
          summer 2026 release. As of July 30, 2026 there is still no official
          price and no reservation date, but the last regulatory gate is now
          closed: the FCC granted Valve equipment authorization on July 29,
          making the headset legal to sell in the US. Hardware has cleared
          customs, the Great on Frame store section is live and filling with
          certified games, and Valve has 54 days left in its own stated summer
          window. This page tracks every signal, links to all of our reporting,
          and is updated on every beat until launch.
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
          Release date: summer 2026, reservations imminent
        </h2>
        <p
          className="text-[15px] leading-[1.7] mb-4"
          style={{ color: "var(--text-secondary)" }}
        >
          Valve confirmed in late June that both the Steam Machine and the Steam
          Frame ship in summer 2026, and the Machine has already made good on
          that, launching June 30 at $1,049 through a randomized reservation
          lottery. The Frame is expected to follow the same playbook within a
          similar window. The physical evidence agrees: roughly 32,000 kg of
          hardware labeled Virtual Reality Devices cleared customs into
          Valve&apos;s US warehouses in June, and the FCC embargo on the
          Frame&apos;s motion controllers lifted June 18. A leaked June 23 price
          reveal date came and went without a Frame announcement; Valve used
          that window for the Steam Machine instead. The headset itself cleared
          the FCC on July 29 under ID 2AES4-1015, so the only thing still
          missing is Valve naming the day and the price.
        </p>
        <p
          className="text-[15px] leading-[1.7] mb-4"
          style={{ color: "var(--text-secondary)" }}
        >
          The road here had slips. The November 2025 announcement targeted early
          2026, which softened to first half by February, and in April Valve
          publicly said the memory crisis forced it to revisit both the shipping
          schedule and pricing. Summer 2026 is the version that stuck, and it is
          the one Valve has put its name on.
        </p>

        <h2 className="font-display text-2xl font-bold mt-10 mb-3">
          Price: nothing official, budget for $899 to $1,199
        </h2>
        <p
          className="text-[15px] leading-[1.7] mb-4"
          style={{ color: "var(--text-secondary)" }}
        >
          Valve&apos;s stated goal was a headset cheaper than the $999 Index.
          Early 2026 estimates ranged from $500 to $800, but the AI-driven DRAM
          shortage rewrote everyone&apos;s math. Early retailer database
          listings surfaced in June around $950 for a 512GB model and $1,070 for
          a larger tier, and analyst estimates cluster between $899 and $1,199.
          The cautionary tale is the Steam Machine, which landed at $1,049,
          about $250 above expectations, with Valve explicitly blaming DDR5
          contract prices up more than 170% year over year. The Frame carries
          16GB of LPDDR5X into that same market, so we would budget toward the
          high end of the range. One honest caveat: reporting on the storage
          tiers is inconsistent, with 256GB, 512GB, and 1TB all appearing in
          different sources, so treat the exact configurations as unsettled
          until Valve publishes them.
        </p>

        <div className="my-8">
          <AdSlot slot={AD_SLOTS.pillar} format="horizontal" />
        </div>

        <h2 className="font-display text-2xl font-bold mt-10 mb-3">
          Specs at a glance
        </h2>
        <ComparisonTable
          caption="Confirmed Steam Frame specifications from Valve's announcement, FCC filings, and our reporting. Storage tiers remain unsettled across sources."
          columns={["Spec", "Steam Frame"]}
          rows={[
            ["Weight", "185g frontbox, about 440g with battery strap (Quest 3 is 515g)"],
            ["Displays", "Dual 2160x2160 LCD per eye, pancake lenses"],
            ["Refresh rate", "72 / 80 / 90 / 120Hz, experimental 144Hz"],
            ["Eye tracking", "Yes, drives foveated rendering and streaming optimization"],
            ["Chip", "Snapdragon 8 Gen 3"],
            ["Memory", "16GB LPDDR5X (double the Quest 3)"],
            ["Storage", "256GB to 1TB reported; tiers not finalized"],
            ["OS", "SteamOS (Arch Linux), Proton ARM64 + FEX x86 emulation, Android APKs"],
            ["PC streaming", "Bundled dedicated 6GHz Wi-Fi 6E dongle, point to point, no router"],
            ["Tracking", "Inside-out SLAM"],
            ["Controllers", "Two BLE motion controllers, TMR thumbsticks, tracking rings (FCC confirmed)"],
            ["Accessories", "Enthusiast Kit with hot-swappable battery (FCC confirmed); $99 Steam Controller for non-VR mode"],
          ]}
        />

        <figure className="pillar-figure">
          <img
            src="/article-images/steam-frame/steam-frame-controllers.jpg"
            alt="The two Steam Frame motion controllers, showing the D-pad on the left controller and the A, B, X, and Y face buttons on the right for gamepad compatibility"
            width={1920}
            height={1080}
            loading="lazy"
          />
          <figcaption>
            The Steam Frame controllers put a D-pad on the left and face buttons
            on the right, so they double as a gamepad for non-VR play. Image:
            Valve
          </figcaption>
        </figure>

        <h2 className="font-display text-2xl font-bold mt-10 mb-3">
          The streaming dongle is the whole thesis
        </h2>
        <p
          className="text-[15px] leading-[1.7] mb-4"
          style={{ color: "var(--text-secondary)" }}
        >
          Every wireless PC VR setup today fights your router. The Frame ships
          with a dedicated point-to-point 6GHz adapter that plugs into your PC
          and talks directly to the headset, and journalists who tried it at
          Valve&apos;s offices reported no perceptible lag. Valve describes the
          Frame as streaming-first with standalone capability, not the other way
          around: the Snapdragon 8 Gen 3 runs the Steam library on-device
          through Proton and FEX when you are away from your PC, and the
          strict{" "}
          <a
            href="/articles/steam-frame-verified-90fps-stricter-than-quest-pico"
            className="no-underline hover:underline"
            style={{ color: "var(--accent-cyan)" }}
          >
            90 FPS Steam Frame Verified program
          </a>{" "}
          governs what earns the on-device badge. Even Meta is paying
          attention: CTO Andrew Bosworth singled out the wireless dongle as
          something Meta will learn from.
        </p>

        <h2 className="font-display text-2xl font-bold mt-10 mb-3">
          The launch game question
        </h2>
        <p
          className="text-[15px] leading-[1.7] mb-4"
          style={{ color: "var(--text-secondary)" }}
        >
          There is no Half-Life: Alyx moment on the calendar. Road to VR
          reported at the announcement that a Steam Frame team member flatly
          denied Valve has any VR content in development, and seven months of
          silence have not contradicted that. Valve&apos;s bet is that the
          library is the launch title: your entire Steam catalog over the
          dongle, plus standalone Proton play. On the third-party side, Payday:
          Aces High was the first game to list Steam Frame as a platform, and
          titles like H3VR2 and Into the Radius 2 sit naturally in the launch
          window. We covered the stakes of shipping without a marquee exclusive
          in{" "}
          <a
            href="/articles/steam-frame-no-launch-game-reckoning-2026"
            className="no-underline hover:underline"
            style={{ color: "var(--accent-cyan)" }}
          >
            our launch-game reckoning
          </a>
          .
        </p>

        {/* Second unit. This is the site's #2 page by traffic (1,792 human
            pageviews/day, measured 2026-08-01) and carried a single ad more
            than 300 lines up, so most of the page was unmonetized. */}
        <div className="my-10">
          <AdSlot slot={AD_SLOTS.pillar} format="horizontal" />
        </div>

        <h2 className="font-display text-2xl font-bold mt-10 mb-3">
          Every Steam Frame development, dated
        </h2>
        <p
          className="text-[14px] leading-[1.6] mb-4"
          style={{ color: "var(--text-muted)" }}
        >
          The full beat-by-beat record of our Steam Frame coverage, oldest to
          newest. The headset itself was announced in November 2025.
        </p>
        <div className="mb-6">
          {TIMELINE.map((entry) => (
            <div key={`${entry.slug}-${entry.text.slice(0, 12)}`} className="release-row">
              <span className="release-date" style={{ marginLeft: 0 }}>
                {entry.date}
              </span>
              <span className="release-meta">
                <a
                  href={`/articles/${entry.slug}`}
                  className="no-underline hover:underline"
                  style={{ color: "var(--text-primary)" }}
                >
                  {entry.text}
                </a>
              </span>
            </div>
          ))}
        </div>

        <FaqSection schema={faq} />

        <RecentArticles heading="Latest Hardware News" limit={5} tag="hardware" />
        <AllPillarGuides exclude="steam-frame" />
      </main>

      <Footer />
    </>
  );
}
