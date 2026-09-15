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
  title: "Steam Frame Price: $1,059 and $1,299, Official Regional Pricing | VR.org",
  description:
    "Valve priced the Steam Frame at $1,059 for 256GB and $1,299 for 1TB on September 14, 2026. Official prices in USD, CAD, EUR, GBP, AUD and PLN, the $29 power supply sold separately, and how the price compares to every estimate.",
  openGraph: {
    title: "Steam Frame Price: $1,059 and $1,299, Official Regional Pricing | VR.org",
    description:
      "Official: $1,059 (256GB) and $1,299 (1TB). Regional pricing, accessory prices, and every pre-launch estimate it beat or missed.",
    url: "https://vr.org/steam-frame-price",
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
    title: "Steam Frame Price: $1,059 and $1,299, Official Regional Pricing",
    description:
      "Valve's official Steam Frame prices in six currencies, plus the $29 PSU it does not ship in the box. By VR.org.",
    images: ["https://vr.org/article-images/steam-frame/steam-frame-headset.jpg"],
  },
  alternates: {
    canonical: "https://vr.org/steam-frame-price",
  },
};

const LAST_UPDATED = "2026-09-14";

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Steam Frame Price: $1,059 and $1,299, and Every Signal That Led There",
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
    "@id": "https://vr.org/steam-frame-price",
  },
  image: "https://vr.org/article-images/steam-frame/steam-frame-headset.jpg",
};

const breadcrumbs = breadcrumbSchema([
  { name: "Home", url: "https://vr.org" },
  { name: "Valve Steam Frame", url: "https://vr.org/steam-frame" },
  { name: "Steam Frame Price", url: "https://vr.org/steam-frame-price" },
]);

const faq = faqPageSchema([
  {
    question: "How much does the Steam Frame cost?",
    answer:
      "Valve announced official pricing on September 14, 2026. The Steam Frame 256GB Kit costs $1,059 and the 1TB Kit costs $1,299 in the US. Both kits include the headset, the Steam Frame Controllers, the Wi-Fi 6E wireless adapter, and a copy of Half-Life: Alyx. A power supply is not included; Valve sells a 45W PSU for $29, or a Steam Deck charger or any 45W or higher USB-C charger works.",
  },
  {
    question: "How much does the Steam Frame cost in Canada, the UK, Europe, and Australia?",
    answer:
      "Valve's official regional prices, VAT included where applicable: the 256GB model is 1,529 CAD, 1,049 EUR, 889 GBP, 1,609 AUD and 4,539 PLN; the 1TB model is 1,859 CAD, 1,279 EUR, 1,089 GBP, 1,969 AUD and 5,549 PLN. Valve ships directly to the US, Canada, the UK, the EU and Australia. In Japan, Taiwan and Hong Kong the headset is sold through Valve's authorized distributor KOMODO, which publishes its own pricing. South Korea is coming at a later date.",
  },
  {
    question: "What accessories cost extra?",
    answer:
      "Three first-party accessories are sold separately: the Steam Hardware Power Supply Unit (45W, 2.5m cable) for $29, the Ergonomic Accessories Kit (two controller hand straps with battery doors, a headset top strap, and an extended light blocker) for $59, and the Accessory Replacement Kit (face gasket, head cushion, standard light blocker) for $49. Valve only offers them as add-to-cart options at checkout to customers who receive a purchase email. Color passthrough requires the separately sold Arcturus Vision camera, which UploadVR reports at $149, and prescription lens inserts come from Zenni.",
  },
  {
    question: "How does the $1,059 price compare to the pre-launch estimates?",
    answer:
      "It landed inside the $899 to $1,199 analyst range. The June retailer database leak put roughly $950 on a 512GB model and roughly $1,070 on a larger tier; no 512GB model exists, and Valve's entry kit is 256GB priced near the higher figure. It also matched Brad Lynch's late-August expectation of a price north of $1,000. It missed Valve's November 2025 goal of undercutting the $999 Index: the 256GB Kit costs $60 more than the Index did, and $10 more than the $1,049 Steam Machine.",
  },
  {
    question: "Does the Steam Frame cost more than a Quest 3?",
    answer:
      "Yes. The Quest 3 sits at $599 after Meta's April 2026 price hike, so the $1,059 Steam Frame costs $460 more. The Frame carries double the Quest 3's memory at 16GB of LPDDR5X, eye tracking that drives Foveated Streaming, and a dedicated Wi-Fi 6E wireless adapter in the box for PC streaming.",
  },
  {
    question: "Why is the Steam Frame so expensive?",
    answer:
      "Two reasons: Valve packed in premium hardware (16GB of LPDDR5X, 2160x2160 LCD panels per eye, eye tracking, dual Wi-Fi 7 radios, a dedicated 6GHz streaming adapter in the box), and the AI-driven DRAM shortage rewrote pricing across the industry. Valve engineer Joy Lyons told PC Gamer the Frame's price target \"shifted due to the ongoing RAM crisis around the world.\" Valve had already blamed DDR5 contract prices, up more than 170% year over year, for the Steam Machine costing $1,049, and Qualcomm told customers on July 24 that Snapdragon prices rise by double digits for orders shipping after September 1.",
  },
  {
    question: "How do I buy one at this price?",
    answer:
      "Through a randomized reservation list. Sign up for one model on the Steam Frame product page before Thursday, September 17, 2026 at 10:00 AM Pacific. You need a Steam account in good standing with a purchase made before April 27, 2026, and Valve allows one signup per household. Signups are shuffled once, results arrive by email on September 17, and purchase emails start going out September 18. Each purchase email gives you 72 hours to check out.",
  },
]);

interface PriceSignal {
  date: string;
  signal: string;
  figure: string;
}

const PRICE_SIGNALS: PriceSignal[] = [
  {
    date: "Nov 2025",
    signal: "Valve says it wants the Frame cheaper than the $999 Index",
    figure: "Under $999",
  },
  {
    date: "Early 2026",
    signal: "Pre-crisis analyst estimates",
    figure: "$500 to $800",
  },
  {
    date: "Apr 2026",
    signal: "Valve publicly revisits pricing over the RAM crisis",
    figure: "Range moves up",
  },
  {
    date: "Jun 2026",
    signal: "Retailer database listings leak, 512GB and larger tier (no 512GB model shipped)",
    figure: "~$950 and ~$1,070",
  },
  {
    date: "Jun 23, 2026",
    signal: "Leaked price reveal date passes with no announcement",
    figure: "No official price",
  },
  {
    date: "Jun 25, 2026",
    signal: "Steam Machine prices at $1,049, about $250 above expectations",
    figure: "High-end anchor",
  },
  {
    date: "Jul 2026",
    signal: "Analyst consensus going into launch",
    figure: "$899 to $1,199",
  },
  {
    date: "Jul 24, 2026",
    signal: "Qualcomm notifies customers of double-digit Snapdragon increases for orders shipping after September 1",
    figure: "Upward cost pressure",
  },
  {
    date: "Jul 29, 2026",
    signal: "FCC grants equipment authorization, clearing US sale, with no price attached",
    figure: "Still no official price",
  },
  {
    date: "Aug 10, 2026",
    signal: "Great on Frame reaches 65 titles, still no price or reservation window",
    figure: "$899 to $1,199 stands",
  },
  {
    date: "Aug 19, 2026",
    signal: "Valve's unboxing and setup videos leak from the Steam client, packaging finished",
    figure: "Still no price",
  },
  {
    date: "Aug 24, 2026",
    signal: "Great on Frame at 89 titles, four weeks of summer left, no price",
    figure: "$899 to $1,199 stands",
  },
  {
    date: "Aug 28, 2026",
    signal: "Brad Lynch, on the Gamertag VR podcast, expects the Frame to land north of $1,000",
    figure: "Over $1,000",
  },
  {
    date: "Sep 3, 2026",
    signal: "Two Steam packages revised and a reservation backend appears; neither carries a price",
    figure: "Still none",
  },
  {
    date: "Sep 14, 2026",
    signal: "Valve announces official pricing and opens reservation signups",
    figure: "$1,059 (256GB), $1,299 (1TB)",
  },
];

const REGIONAL_PRICES: string[][] = [
  ["United States", "$1,059 USD", "$1,299 USD"],
  ["Canada", "$1,529 CAD", "$1,859 CAD"],
  ["European Union", "1,049 EUR", "1,279 EUR"],
  ["United Kingdom", "889 GBP", "1,089 GBP"],
  ["Australia", "$1,609 AUD", "$1,969 AUD"],
  ["Poland", "4,539 PLN", "5,549 PLN"],
];

const ACCESSORY_PRICES: string[][] = [
  ["Power Supply Unit (45W, 2.5m cable)", "$29", "49 CAD / 39 EUR / 29 GBP / 49 AUD / 139 PLN"],
  ["Ergonomic Accessories Kit", "$59", "89 CAD / 69 EUR / 59 GBP / 99 AUD / 279 PLN"],
  ["Accessory Replacement Kit", "$49", "69 CAD / 59 EUR / 49 GBP / 89 AUD / 229 PLN"],
];

export default function SteamFramePricePage() {
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
          Steam Frame Price: $1,059 and $1,299, and Every Signal That Led There
        </h1>

        <p className="text-sm mb-3" style={{ color: "var(--text-muted)" }}>
          Last updated: September 14, 2026
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
          </a>{" "}
          and the{" "}
          <a
            href="/great-on-frame"
            className="no-underline hover:underline"
            style={{ color: "var(--accent-cyan)" }}
          >
            Great on Frame verified games list
          </a>
          , the{" "}
          <a
            href="/steam-frame-specs"
            className="no-underline hover:underline"
            style={{ color: "var(--accent-cyan)" }}
          >
            full spec sheet
          </a>
          , and a guide to{" "}
          <a
            href="/steam-frame-games"
            className="no-underline hover:underline"
            style={{ color: "var(--accent-cyan)" }}
          >
            what games run on it
          </a>

          .
        </p>

        {/* Definitional lede for AI Overview capture */}
        <p
          className="text-[15px] leading-[1.7] mb-4"
          style={{ color: "var(--text-secondary)" }}
        >
          The Steam Frame costs $1,059 for the 256GB Kit and $1,299 for the
          1TB Kit. Valve announced both prices on September 14, 2026, in the
          same post that opened reservation signups. Either kit includes the
          headset, the Steam Frame Controllers, the Wi-Fi 6E wireless adapter,
          and a copy of Half-Life: Alyx. A power supply is not in the box:
          Valve sells a 45W unit for $29, and says a Steam Deck charger or any
          45W or higher USB-C charger works instead. Prices include VAT where
          applicable.
        </p>
        <p
          className="text-[15px] leading-[1.7] mb-8"
          style={{ color: "var(--text-secondary)" }}
        >
          The number landed inside the $899 to $1,199 analyst range this page
          tracked all summer, but above the roughly $950 that June&apos;s
          retailer database leak attached to a 512GB model, a tier that never
          existed. It missed the goal Valve set itself in November 2025, a
          Frame cheaper than the $999 Index. How the regional figures compare
          once VAT is taken out is in{" "}
          <a
            href="/articles/steam-frame-regional-prices-net-of-tax-reservation-supply-2026"
            className="no-underline hover:underline"
            style={{ color: "var(--accent-cyan)" }}
          >
            our regional pricing analysis
          </a>
          . You can only buy at this price through Valve&apos;s randomized
          reservation list, which closes Thursday, September 17 at 10:00 AM
          Pacific. Our{" "}
          <a
            href="/articles/steam-frame-reservation-how-to-sign-up-before-september-17-2026"
            className="no-underline hover:underline"
            style={{ color: "var(--accent-cyan)" }}
          >
            step-by-step reservation guide
          </a>{" "}
          covers eligibility and what happens after the shuffle, and our{" "}
          <a
            href="/articles/steam-frame-launch-price-1059-psu-not-included-2026"
            className="no-underline hover:underline"
            style={{ color: "var(--accent-cyan)" }}
          >
            launch report
          </a>{" "}
          breaks down what the money buys.
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
          Official Steam Frame prices by region
        </h2>
        <ComparisonTable
          caption="Valve's official Steam Frame pricing, announced September 14, 2026. VAT included where applicable. Japan, Taiwan and Hong Kong pricing is published by KOMODO, Valve's authorized distributor there."
          columns={["Region", "256GB Kit", "1TB Kit"]}
          rows={REGIONAL_PRICES}
        />

        <h2 className="font-display text-2xl font-bold mt-10 mb-3">
          Accessories sold separately
        </h2>
        <ComparisonTable
          caption="First-party Steam Frame accessories. Valve only offers them as add-to-cart options at checkout, to customers who have received a purchase email."
          columns={["Accessory", "US price", "Other regions"]}
          rows={ACCESSORY_PRICES}
        />

        <h2 className="font-display text-2xl font-bold mt-10 mb-3">
          Every price signal, from goal to announcement
        </h2>
        <ComparisonTable
          caption="Every Steam Frame price signal in order, from Valve's original goal to the official September 14, 2026 announcement."
          columns={["Date", "Signal", "Figure"]}
          rows={PRICE_SIGNALS.map((s) => [s.date, s.signal, s.figure])}
        />

        <h2 className="font-display text-2xl font-bold mt-10 mb-3">
          Why the price climbed past the Index
        </h2>
        <p
          className="text-[15px] leading-[1.7] mb-4"
          style={{ color: "var(--text-secondary)" }}
        >
          The story of the Steam Frame&apos;s price is really the story of the
          AI-driven DRAM shortage. When Valve announced the headset in November
          2025, it said out loud that it wanted to come in under the $999
          Index, and early estimates ranged from $500 to $800. By April, Valve
          was publicly saying{" "}
          <a
            href="/articles/steam-frame-ai-ram-crisis-delay-2026"
            className="no-underline hover:underline"
            style={{ color: "var(--accent-cyan)" }}
          >
            the memory crisis had forced it to revisit both the shipping
            schedule and pricing
          </a>
          . The Frame carries 16GB of LPDDR5X, double the Quest 3, into a
          market where Valve itself blamed DDR5 contract prices, up more than
          170% year over year, for the Steam Machine&apos;s $1,049 sticker. On
          launch day Valve engineer Joy Lyons told{" "}
          <a
            href="https://www.pcgamer.com/hardware/vr-hardware/valve-targeted-a-lower-price-for-the-steam-frame-then-the-memory-crisis-happened-i-wish-we-could-have-shipped-it-at-the-price-that-we-were-at-last-year/"
            target="_blank"
            rel="noopener"
            className="no-underline hover:underline"
            style={{ color: "var(--accent-cyan)" }}
          >
            PC Gamer
          </a>{" "}
          the Frame&apos;s price target &quot;shifted due to the ongoing RAM
          crisis around the world.&quot;
        </p>
        <p
          className="text-[15px] leading-[1.7] mb-4"
          style={{ color: "var(--text-secondary)" }}
        >
          That Steam Machine number turned out to be the best predictor on
          this page. It landed{" "}
          <a
            href="/articles/steam-machine-1049-june-30-launch-price-ceiling-steam-frame"
            className="no-underline hover:underline"
            style={{ color: "var(--accent-cyan)" }}
          >
            about $250 above what most people expected
          </a>
          , from the same company, in the same summer, built from components in
          the same squeezed supply chain. Valve could not hold the Machine
          under a grand, and it did not hold the Frame there either: the 256GB
          Kit came in $10 above the Machine.
        </p>

        <div className="my-8">
          <AdSlot slot={AD_SLOTS.pillar} format="horizontal" />
        </div>

        <h2 className="font-display text-2xl font-bold mt-10 mb-3">
          What you get for the money
        </h2>
        <p
          className="text-[15px] leading-[1.7] mb-4"
          style={{ color: "var(--text-secondary)" }}
        >
          The $1,059 buys more than a headset. The kit includes the Steam
          Frame Controllers, with full 6-DOF tracking and gamepad controls, and
          the Wi-Fi 6E wireless adapter that gives PC streaming its own
          dedicated 6GHz link. On the headset, one of two Wi-Fi 7 radios
          carries that stream while the other stays on your home network.
          Inside is a 4nm Snapdragon 8 Gen 3 with 16GB of LPDDR5X, 2160x2160
          LCD panels per eye behind pancake lenses, 72 to 144Hz refresh (144Hz
          is labeled experimental), and eye tracking that drives Valve&apos;s
          Foveated Streaming. It runs games standalone too, with Valve counting
          over 100 titles Steam Frame Standalone Verified at launch. The full
          breakdown lives on our{" "}
          <a
            href="/steam-frame-specs"
            className="no-underline hover:underline"
            style={{ color: "var(--accent-cyan)" }}
          >
            Steam Frame spec sheet
          </a>
          . For how it stacks against what you can buy today, see the{" "}
          <a
            href="/best-pc-vr-headset"
            className="no-underline hover:underline"
            style={{ color: "var(--accent-cyan)" }}
          >
            best PC VR headsets
          </a>
          .
        </p>
        <p
          className="text-[15px] leading-[1.7] mb-4"
          style={{ color: "var(--text-secondary)" }}
        >
          The 1TB Kit is a $240 step for storage alone, and both models take a
          microSD card. Budget a little past the sticker too. The $29 power
          supply is the obvious add if you do not already own a 45W USB-C
          charger. Color passthrough is not built in either: the headset
          tracks with four monochrome cameras, and Valve lists the separately
          sold Arcturus Vision camera as a Steam Frame Compatible accessory
          for color passthrough, a $149 add-on according to{" "}
          <a
            href="https://www.uploadvr.com/steam-frame-price-revealed-reservations-opened-alyx-included/"
            target="_blank"
            rel="noopener"
            className="no-underline hover:underline"
            style={{ color: "var(--accent-cyan)" }}
          >
            UploadVR
          </a>
          . Prescription lens inserts come from Zenni.
          The FCC-confirmed Enthusiast Kit with a hot-swappable battery that
          surfaced this summer was not on Valve&apos;s launch accessory list.
        </p>

        <FaqSection schema={faq} />

        <RecentArticles heading="Latest Hardware News" limit={5} tag="hardware" />
        <AllPillarGuides exclude="steam-frame-price" />
      </main>

      <Footer />
    </>
  );
}
