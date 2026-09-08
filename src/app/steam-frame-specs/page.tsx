import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
  StructuredData,
  breadcrumbSchema,
  faqPageSchema,
} from "@/components/StructuredData";
import { RecentArticles } from "@/components/RecentArticles";
import { AllPillarGuides } from "@/components/RelatedGuides";
import { AdSlot } from "@/components/AdSlot";
import { AD_SLOTS } from "@/lib/ads";
import { ComparisonTable, FaqSection } from "@/components/SpokeBlocks";

export const metadata = {
  title: "Steam Frame Specs: Full Hardware Spec Sheet & Controllers | VR.org",
  description:
    "Every confirmed Steam Frame specification: 2160x2160 per eye, Snapdragon 8 Gen 3, 16GB LPDDR5X, 21.6Wh battery, 185g visor, eye tracking, and the PCIe expansion slot. Plus the numbers Valve still has not published.",
  openGraph: {
    title: "Steam Frame Specs: Full Hardware Spec Sheet & Controllers | VR.org",
    description:
      "2160x2160 per eye, Snapdragon 8 Gen 3, 16GB RAM, 185g visor, eye-tracked foveated streaming. Every confirmed number in one table.",
    url: "https://vr.org/steam-frame-specs",
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
    title: "Steam Frame Specs: Full Hardware Spec Sheet & Controllers",
    description:
      "Every confirmed Steam Frame number in one table, and the ones Valve still has not given.",
    images: [
      "https://vr.org/article-images/steam-frame/steam-frame-headset.jpg",
    ],
  },
  alternates: {
    canonical: "https://vr.org/steam-frame-specs",
  },
};

const LAST_UPDATED = "2026-09-08";

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline:
    "Steam Frame Specs: Every Confirmed Number, and the Ones Valve Has Not Given",
  datePublished: "2026-09-08",
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
    "@id": "https://vr.org/steam-frame-specs",
  },
  image: "https://vr.org/article-images/steam-frame/steam-frame-headset.jpg",
};

const breadcrumbs = breadcrumbSchema([
  { name: "Home", url: "https://vr.org" },
  { name: "Valve Steam Frame", url: "https://vr.org/steam-frame" },
  { name: "Steam Frame Specs", url: "https://vr.org/steam-frame-specs" },
]);

const faq = faqPageSchema([
  {
    question: "What resolution is the Steam Frame?",
    answer:
      "2160x2160 per eye, on dual LCD panels behind multi-element pancake lenses. That is 4,665,600 pixels per eye, roughly 15 percent more per axis than the Quest 3's 2064x2208. Valve quotes the field of view conservatively at 110 degrees horizontal by 110 degrees vertical. Refresh runs at 72Hz and 120Hz, with a 144Hz mode Valve described as experimental at announcement.",
  },
  {
    question: "What chip is in the Steam Frame?",
    answer:
      "A Qualcomm Snapdragon 8 Gen 3 with 16GB of LPDDR5X RAM. That is the same class of silicon as the Quest 3, but with double the memory, which matters because the Frame runs x86 Steam games through Proton and FEX emulation rather than native Android builds. Storage comes in 256GB and 1TB UFS tiers, and there is a microSD slot that takes the same cards as a Steam Deck or Steam Machine.",
  },
  {
    question: "How much does the Steam Frame weigh?",
    answer:
      "185 grams for the visor alone, and 440 grams for the complete system with the default facial interface, speakers, strap and rear battery fitted. The weight is deliberately split: the 21.6Wh battery sits at the back of the strap as a counterweight rather than on your face, which is why the front-heavy figure stays low.",
  },
  {
    question: "Does the Steam Frame have eye tracking?",
    answer:
      "Yes, with IR illuminators. Valve is not using it primarily for interface control. It drives eye-tracked foveated streaming, which sends full detail only where you are looking and compresses the periphery, so PC VR streaming survives a wireless link. Valve claims lower latency and greater precision than Steam Link VR. Hand tracking, by contrast, is not supported: the Frame requires an input device.",
  },
  {
    question: "What are the Steam Frame controllers like?",
    answer:
      "Ringless, with 18 infrared LEDs each for the headset's cameras to track, and a gamepad-parity layout that puts all four of A, B, X and Y on the right controller and a D-pad on the left, so a flatscreen Steam game can be played without remapping. The thumbsticks use TMR (tunneling magnetoresistance) sensors rather than the potentiometers that cause stick drift. Capacitive sensing covers every input and the handle. Each controller runs on a single AA battery for roughly 40 hours. Grip straps are sold separately.",
  },
  {
    question: "What is the Steam Frame expansion slot for?",
    answer:
      "The Frame carries a one-lane Gen 4 PCIe data port alongside a dual 2.5Gbps MIPI camera interface, and Valve has said it intends to publish CAD files so third parties can design their own attachments. Valve named face tracking, depth sensors, full body tracking, alternative tracking systems and color passthrough cameras as the categories it had in mind. The first product to appear in that last category is an Arcturus color passthrough module with dual 32-megapixel sensors, built by the same company that supplied the Frame's camera tracking.",
  },
  {
    question: "Does the Steam Frame have color passthrough?",
    answer:
      "No. The four outward-facing cameras are greyscale fisheye units built for computer vision, meaning inside-out tracking, room geometry and controller position. Passthrough to the wearer is a secondary use of two of them and it is monochrome. Valve has not positioned the Frame as a mixed reality device, which is the single clearest difference between it and a Quest 3. Color passthrough on a Frame is an accessory purchase through the expansion slot, at a price nobody has published.",
  },
  {
    question: "What are the Steam Frame Verified requirements?",
    answer:
      "For standalone VR titles, a game must hold at least 72fps at 1728x1728 per eye running on the headset itself, and anything rendering below 1440x1440 is marked Unsupported. Valve announced 90fps at GDC 2026 and later revised the published figure down to 72 without an announcement. Standalone flatscreen titles need 720p at 30fps with full Frame controller support. The badge is a recommendation rather than a gate, and content streamed from a PC is exempt entirely.",
  },
]);

const displayRows = [
  ["Panels", "Dual LCD, 2160x2160 per eye"],
  ["Lenses", "Multi-element pancake"],
  ["Refresh", "72Hz and 120Hz, plus a 144Hz mode called experimental at announcement"],
  ["Field of view", "110 degrees horizontal by 110 degrees vertical, quoted conservatively"],
  ["IPD", "Manual dial"],
  ["Eye tracking", "Yes, with IR illuminators, driving foveated streaming"],
  ["Hand tracking", "Not supported, an input device is required"],
];

const computeRows = [
  ["SoC", "Qualcomm Snapdragon 8 Gen 3"],
  ["Memory", "16GB LPDDR5X, unified"],
  ["Storage", "256GB or 1TB UFS"],
  ["Expandable storage", "microSD, same cards as Steam Deck and Steam Machine"],
  ["OS", "SteamOS, with Proton and FEX x86 emulation"],
  ["Battery", "21.6Wh, rear-mounted in the strap, replaceable"],
  ["Weight, visor", "185 g"],
  ["Weight, complete", "440 g with facial interface, speakers, strap and battery"],
];

const ioRows = [
  ["Cameras", "Four outward-facing greyscale fisheye"],
  ["Tracking", "Inside-out computer vision (SLAM)"],
  ["Passthrough", "Monochrome, via two front cameras"],
  ["Audio", "Built-in dual driver speakers"],
  ["Wi-Fi", "Wi-Fi 7, dual radios"],
  ["Bundled adapter", "6GHz Wi-Fi 6E USB adapter for point-to-point PC streaming"],
  ["Expansion", "One-lane Gen 4 PCIe port plus dual 2.5Gbps MIPI camera interface"],
];

const controllerRows = [
  ["Design", "Ringless, 18 IR LEDs per controller"],
  ["Layout", "Gamepad parity: A/B/X/Y all on the right, D-pad on the left"],
  ["Thumbsticks", "TMR (tunneling magnetoresistance), not potentiometers"],
  ["Sensing", "Capacitive on every input and on the handle"],
  ["Battery", "One AA per controller, roughly 40 hours"],
  ["Grip straps", "Sold separately"],
];

const unknownRows = [
  ["Price", "Not announced. Analyst estimates cluster $899 to $1,199"],
  ["Release date", "Summer 2026 confirmed, no day named. Summer ends September 22"],
  ["Battery life", "No runtime figure published for the headset"],
  ["IPD range", "Valve has not given the millimetre range of the dial"],
  ["Storage pricing", "No per-tier price for the 256GB and 1TB models"],
];

export default function SteamFrameSpecsPage() {
  return (
    <>
      <StructuredData data={articleSchema} />
      <StructuredData data={breadcrumbs} />
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
          Steam Frame Specs: Every Confirmed Number, and the Ones Valve Has Not
          Given
        </h1>

        <p className="text-sm mb-3" style={{ color: "var(--text-muted)" }}>
          Last updated: September 8, 2026
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
          . See also the{" "}
          <a
            href="/steam-frame-release-date"
            className="no-underline hover:underline"
            style={{ color: "var(--accent-cyan)" }}
          >
            release date tracker
          </a>
          , the{" "}
          <a
            href="/steam-frame-price"
            className="no-underline hover:underline"
            style={{ color: "var(--accent-cyan)" }}
          >
            price tracker
          </a>
          , the{" "}
          <a
            href="/steam-frame-vs-quest-3"
            className="no-underline hover:underline"
            style={{ color: "var(--accent-cyan)" }}
          >
            Steam Frame vs Quest 3 comparison
          </a>
          , and the{" "}
          <a
            href="/great-on-frame"
            className="no-underline hover:underline"
            style={{ color: "var(--accent-cyan)" }}
          >
            Great on Frame verified games list
          </a>
          .
        </p>

        {/* Definitional lede for AI Overview capture */}
        <p
          className="text-[17px] leading-[1.75] mb-6"
          style={{ color: "var(--text-secondary)" }}
        >
          The Valve Steam Frame is a standalone SteamOS headset with{" "}
          <strong>2160x2160 LCD panels per eye</strong>, a{" "}
          <strong>Snapdragon 8 Gen 3</strong> paired with{" "}
          <strong>16GB of LPDDR5X</strong>, a <strong>21.6Wh</strong> battery
          mounted at the back of the strap, and a visor that weighs{" "}
          <strong>185 grams</strong> on its own or{" "}
          <strong>440 grams</strong> fully assembled. It has eye tracking, four
          greyscale tracking cameras, Wi-Fi 7, and a PCIe expansion slot. It
          does not have color passthrough or hand tracking. Valve has confirmed
          every number on this page and none of the money: there is still no
          price and no release date beyond summer 2026.
        </p>

        <p
          className="text-[15px] leading-[1.7] mb-4"
          style={{ color: "var(--text-secondary)" }}
        >
          Specifications below come from Valve&apos;s own announcement, as
          documented in{" "}
          <a
            href="https://www.uploadvr.com/valve-steam-frame-official-announcement-features-details/"
            target="_blank"
            rel="noopener"
            className="no-underline hover:underline"
            style={{ color: "var(--accent-cyan)" }}
          >
            UploadVR&apos;s write-up of the November 12, 2025 reveal
          </a>
          , with the expansion slot detail confirmed against{" "}
          <a
            href="https://www.roadtovr.com/steam-frame-color-passthrough-camera-upgrade/"
            target="_blank"
            rel="noopener"
            className="no-underline hover:underline"
            style={{ color: "var(--accent-cyan)" }}
          >
            Road to VR&apos;s September 2 report
          </a>
          . Where sources disagree, this page says so rather than picking the
          tidier number.
        </p>

        <h2 className="font-display text-2xl font-bold mt-10 mb-3">
          Display and optics
        </h2>

        <ComparisonTable
          caption="Refresh rates are the one soft figure here. Valve's announcement described 72Hz and 120Hz with an experimental 144Hz mode; some later spec aggregators list intermediate steps that Valve has not published."
          columns={["Spec", "Steam Frame"]}
          rows={displayRows}
        />

        <p
          className="text-[15px] leading-[1.7] mb-4"
          style={{ color: "var(--text-secondary)" }}
        >
          2160x2160 per eye is 4.67 million pixels an eye. Quest 3 renders
          2064x2208. On paper the Frame is ahead, but the number that will
          decide how it actually looks is not on any spec sheet: how hard the
          Snapdragon has to compress a streamed image to get it across the
          room. That is what the eye tracking is for.
        </p>

        <h2 className="font-display text-2xl font-bold mt-10 mb-3">
          Compute, storage and power
        </h2>

        <ComparisonTable
          caption="16GB is double the Quest 3's memory. The Frame needs it: Proton and FEX are translating x86 Steam builds on the fly rather than running native Android ports."
          columns={["Spec", "Steam Frame"]}
          rows={computeRows}
        />

        <p
          className="text-[15px] leading-[1.7] mb-4"
          style={{ color: "var(--text-secondary)" }}
        >
          The weight split is the design decision worth understanding. 185
          grams on the face and the battery behind your head is a very
          different object to wear than a 515-gram Quest 3 with its mass out
          front, even though the Frame&apos;s assembled 440 grams is not far
          off. Valve also made the battery part of the strap and replaceable,
          which is a repairability choice almost nobody else in this category
          has made.
        </p>

        <div className="my-8">
          <AdSlot slot={AD_SLOTS.pillar} format="horizontal" />
        </div>

        <h2 className="font-display text-2xl font-bold mt-10 mb-3">
          Cameras, audio and connectivity
        </h2>

        <ComparisonTable
          caption="Four greyscale cameras, no color passthrough. This is the clearest line between the Frame and a mixed reality headset."
          columns={["Spec", "Steam Frame"]}
          rows={ioRows}
        />

        <p
          className="text-[15px] leading-[1.7] mb-4"
          style={{ color: "var(--text-secondary)" }}
        >
          Note the two different radios. The Frame has Wi-Fi 7 with dual radios
          for normal network use, and it ships with a separate 6GHz Wi-Fi 6E
          USB adapter that plugs into your gaming PC to create a dedicated
          point-to-point link. That adapter is the reason Valve calls this a
          streaming-first headset rather than a standalone one. Hands-on
          reports have described the streaming as having no perceptible lag.
        </p>

        <h2 className="font-display text-2xl font-bold mt-10 mb-3">
          The controllers
        </h2>

        <ComparisonTable
          caption="The gamepad-parity layout is the tell: Valve expects you to play flatscreen Steam games in this headset, not just VR ones."
          columns={["Spec", "Steam Frame controllers"]}
          rows={controllerRows}
        />

        <p
          className="text-[15px] leading-[1.7] mb-4"
          style={{ color: "var(--text-secondary)" }}
        >
          Two details deserve more attention than they got. TMR thumbsticks use
          magnetic sensing instead of the resistive contacts that wear down and
          produce stick drift, which is a fix for the single most common
          controller failure in the industry. And a single AA running roughly
          40 hours means no charging dock, no proprietary cell, and no
          controller that dies mid-session with no way to keep playing.
        </p>

        <h2 className="font-display text-2xl font-bold mt-10 mb-3">
          The expansion slot, and what is already being built for it
        </h2>

        <p
          className="text-[15px] leading-[1.7] mb-4"
          style={{ color: "var(--text-secondary)" }}
        >
          The Frame carries a one-lane Gen 4 PCIe data port and a dual 2.5Gbps
          MIPI camera interface, and Valve has said it intends to publish CAD
          files so third parties can build their own attachments. At
          announcement Valve named the categories it had in mind: face
          tracking, depth sensors, full body tracking, entirely different
          tracking solutions, and color passthrough cameras.
        </p>
        <p
          className="text-[15px] leading-[1.7] mb-4"
          style={{ color: "var(--text-secondary)" }}
        >
          Ten months later the first product in that last category surfaced.
          Komodo Station, Valve&apos;s hardware vendor in Asia, published a
          product page for an Arcturus color passthrough module with dual
          32-megapixel sensors and 5K stereo capture, apparently earlier than
          anyone intended. Arcturus Industries built the camera tracking system
          inside the Frame, so the company selling the upgrade supplied the
          part being upgraded. No price, and no date.
        </p>

        <h2 className="font-display text-2xl font-bold mt-10 mb-3">
          What Valve still has not told anyone
        </h2>

        <ComparisonTable
          caption="A spec sheet with no price on it is not a product you can plan around. These are the gaps as of September 8, 2026."
          columns={["Unknown", "Where it stands"]}
          rows={unknownRows}
        />

        <p
          className="text-[15px] leading-[1.7] mb-4"
          style={{ color: "var(--text-secondary)" }}
        >
          The absence of a published battery runtime is the one that should
          bother buyers most. 21.6Wh is a real number, but watt-hours only
          become hours once you know what the headset draws, and that depends
          entirely on whether you are streaming from a PC or rendering on
          device. Valve has been happy to quote grams and pixels and has said
          nothing about how long the thing runs.
        </p>

        <FaqSection schema={faq} />

        <RecentArticles heading="Latest Steam Frame News" limit={5} tag="hardware" />
        <AllPillarGuides exclude="steam-frame-specs" />
      </main>

      <Footer />
    </>
  );
}
