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
    "Valve's Steam Frame launched September 14, 2026 at $1,059 (256GB) and $1,299 (1TB), with reservation signups open until September 17. Official price, reservation dates, full specs, and every development, tracked by VR.org.",
  openGraph: {
    title: "Valve Steam Frame: Release Date, Price, Specs & Everything We Know | VR.org",
    description:
      "Launched September 14 at $1,059 and $1,299. Reservation dates, official specs, what is in the box, and every development tracked.",
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
      "Launched September 14 at $1,059. Reservations close September 17. Every Steam Frame development, tracked by VR.org.",
    images: ["https://vr.org/article-images/steam-frame/steam-frame-headset.jpg"],
  },
  alternates: {
    canonical: "https://vr.org/steam-frame",
  },
};

const LAST_UPDATED = "2026-09-14";

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

// Product node with Valve's official launch pricing (September 14, 2026).
// Sold through a reservation list, so availability is PreOrder. No ratings.
const frameProduct = productSchema({
  name: "Valve Steam Frame",
  brand: "Valve",
  description:
    "Wireless, streaming-first SteamOS VR headset with controllers, a Wi-Fi 6E wireless adapter for PC streaming, and standalone play on a Snapdragon 8 Gen 3. Launched September 14, 2026 in 256GB and 1TB kits.",
  url: "https://vr.org/steam-frame",
  image: "https://vr.org/article-images/steam-frame/steam-frame-headset.jpg",
  offers: [
    {
      price: 1059,
      priceCurrency: "USD",
      availability: "https://schema.org/PreOrder",
      url: "https://store.steampowered.com/hardware/steamframe",
      seller: "Valve",
    },
    {
      price: 1299,
      priceCurrency: "USD",
      availability: "https://schema.org/PreOrder",
      url: "https://store.steampowered.com/hardware/steamframe",
      seller: "Valve",
    },
  ],
});

const faq = faqPageSchema([
  {
    question: "When does the Valve Steam Frame come out?",
    answer:
      "Valve launched the Steam Frame on September 14, 2026, opening reservation signups in a Steam Hardware post titled \"Steam Frame is here!\" Signups close Thursday, September 17 at 10:00 AM Pacific, when Valve randomizes each list once and emails every signup a reservation or waitlist result. The first purchase emails go out September 18, and units ship as they become available. That lands inside the summer 2026 window Valve confirmed in late June, eight days before summer ends on September 22. The trail that led here included FCC equipment authorization on July 29 under FCC ID 2AES4-1015, roughly 35 tons of VR hardware through US customs in June, and Steam backend package revisions on September 3 and 10.",
  },
  {
    question: "How much does the Steam Frame cost?",
    answer:
      "The Steam Frame 256GB Kit costs $1,059 and the 1TB Kit costs $1,299. Regional prices are 1,529 and 1,859 CAD, 1,049 and 1,279 EUR, 889 and 1,089 GBP, 1,609 and 1,969 AUD, and 4,539 and 5,549 PLN, VAT included where applicable. Each kit includes the headset, the Steam Frame Controllers, the Wi-Fi 6E wireless adapter, and Half-Life: Alyx. A power supply is not included: Valve sells a 45W PSU for $29, and a Steam Deck charger or any 45W or higher USB-C charger also works.",
  },
  {
    question: "How do I preorder the Steam Frame?",
    answer:
      "Valve does not take traditional preorders. Choose the 256GB or 1TB model on the Steam Frame product page and join the reservation list before September 17, 2026 at 10:00 AM Pacific. Your Steam account must be in good standing and must have made a purchase before April 27, 2026, and Valve allows one signup per household. Signing up early gives no advantage, since every signup is shuffled once. If you land in the reservation queue, Valve emails a purchase link when your unit is ready, starting September 18, and you have 72 hours to check out. Buyers in Japan, Taiwan, and Hong Kong order through KOMODO, Valve's authorized distributor.",
  },
  {
    question: "Is the Steam Frame standalone or a PC VR headset?",
    answer:
      "Both. Valve calls it a streaming-first wireless VR headset that also supports standalone play. It runs SteamOS 3 on a 4nm Snapdragon 8 Gen 3 with 16GB of LPDDR5X and plays games on-device through Proton and FEX x86 translation, plus Android APKs through Lepton, with over 100 games Steam Frame Standalone Verified at launch. For PC play it ships with a Wi-Fi 6E wireless adapter that gives streaming a dedicated 6GHz link, while one of the headset's two Wi-Fi 7 radios carries the stream and the other stays on your home network. Eye tracking drives Valve's Foveated Streaming, which Valve says typically offers over a 10x improvement in image quality and effective bandwidth.",
  },
  {
    question: "What games does the Steam Frame launch with?",
    answer:
      "Every Steam Frame includes a copy of Half-Life: Alyx, redeemed in the headset's settings; only one copy can be redeemed per device, and not on an account that already owns it. UploadVR reports Valve built a native 64-bit ARM version that runs standalone on the headset, with Workshop items and Steam Cloud saves working across standalone and PC streaming. No new first-party game shipped with it, and Road to VR reported that a Steam Frame team member denied Valve has any VR content in development. Valve's launch post counts over 100 games Steam Frame Standalone Verified. The rest of the launch story is the Steam library itself via streaming and Proton, plus the certified catalog on the Great on Frame page, which reported 130 titles on September 11, up from 121 on September 8, 117 on September 6, 98 on August 27, 65 on August 10 and eight on July 17. Most of that growth is flatscreen catalog games such as Balatro, Cuphead, and Hollow Knight: Silksong rather than native VR. The highest-profile VR title on the list is Half-Life 2: VR Mod, a free community mod certified on August 6, while Valve's own The Lab was downgraded to Unsupported on July 29. Payday: Aces High was the first third-party title to list Steam Frame as a target platform.",
  },
  {
    question: "What is Steam Frame Verified?",
    answer:
      "Valve's compatibility program, announced at GDC 2026. Standalone VR titles must hold at least 72 fps at 1728x1728 per eye on-device, and anything rendering below 1440x1440 is marked Unsupported. Valve first announced 90 FPS and later revised the published requirement down to 72 without an announcement. Standalone flatscreen titles need 720p at 30 FPS minimum with full Frame controller support. The badge is a recommendation rather than a gate, and streamed PC VR content is exempt. Certified games are collected on the Great on Frame storefront page, which went live in mid July 2026 with eight titles and reported 130 on September 11.",
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
    text: "Valve announces Steam Frame Verified at GDC with a 90 FPS floor for standalone VR. The published requirement was later cut to 72 fps.",
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
  {
    date: "Aug 5, 2026",
    slug: "steam-frame-verified-72fps-valve-quietly-cut-requirement-2026",
    text: "Valve's partner docs now read 72 fps at 1728x1728, down from the 90 FPS announced at GDC, with a hard Unsupported cutoff below 1440x1440.",
  },
  {
    date: "Aug 6, 2026",
    slug: "half-life-2-vr-mod-steam-frame-verified-2026",
    text: "Half-Life 2: VR Mod clears Steam Frame Verified, making a free community mod the highest-profile certified title on the list.",
  },
  {
    date: "Aug 7, 2026",
    slug: "valve-the-lab-unsupported-steam-frame-arm64-proton-2026",
    text: "Valve's own The Lab is cut from category 3 to Unsupported and moved onto an ARM64 Proton runtime, failing the bar the Half-Life 2 mod just cleared.",
  },
  {
    date: "Aug 10, 2026",
    slug: "valve-great-on-frame-steam-page-steam-frame-launch-signal",
    text: "Great on Frame reports 65 titles, an eightfold increase in under a month, with flatscreen catalog games now outnumbering native VR ones.",
  },
  {
    date: "Aug 10, 2026",
    slug: "valve-lepton-fex-steam-frame-translation-layers-2026",
    text: "The Steam Frame ARM64 Compat List drops its access token and appears in the Steam client. Its tool registry now puts Proton 11.0 (ARM64) on the stable channel, replacing the experimental ARM64EC builds that held that slot in 2024.",
  },
  {
    date: "Aug 19, 2026",
    slug: "steam-frame-unboxing-setup-videos-leak-steam-client",
    text: "Valve's own unboxing and first-time-setup videos fall out of the Steam client, showing retail packaging and the Ergonomic Accessories Kit. Companies do not finish and stage setup videos for hardware that is quarters away.",
  },
  {
    date: "Aug 24, 2026",
    slug: "valve-great-on-frame-steam-page-steam-frame-launch-signal",
    text: "Great on Frame reaches 89 titles, up 24 in fourteen days, with every genre count rising and the RPG filter doubling. Still no price and no date, and summer ends September 22.",
  },
  {
    date: "Aug 27, 2026",
    slug: "great-on-frame-98-certified-titles-72fps-threshold-2026",
    text: "Great on Frame reaches 98 titles, and the names finally matter: Beat Saber, Job Simulator, Walkabout Mini Golf VR, Pistol Whip and all three I Expect You To Die games are certified.",
  },
  {
    date: "Sep 1, 2026",
    slug: "gunman-contracts-own-launch-date-september-10-2026",
    text: "Gunman Contracts: Stand Alone sets a September 10 launch on its own, the first third-party title to put a day on the calendar inside the Frame's expected window.",
  },
  {
    date: "Sep 6, 2026",
    slug: "steam-frame-packages-revised-september-3-reservation-backend-2026",
    text: "SteamDB shows two of the Frame's seven backend packages revised on September 3, the first change since May 5, and Brad Lynch reports a reservation system live in Steam's backend for two SKUs. Steam Machine packages moved six days before its lottery opened. Great on Frame stands at 117 titles.",
  },
  {
    date: "Sep 8, 2026",
    slug: "steam-frame-packages-revised-september-3-reservation-backend-2026",
    text: "Great on Frame reaches 121 certified titles, four more than September 6: DREDGE, BALL x PIT and Everything is Crab on the flatscreen side, RUMBLE in VR. Four in two days is a slower rate than the late-August waves, which is what a shelf looks like once it is mostly stocked. The week the package revisions pointed at is now underway, with 14 days of summer left.",
  },
  {
    date: "Sep 11, 2026",
    slug: "steam-frame-lepton-android-runtime-52-of-130-certified-2026",
    text: "Great on Frame reaches 130, and the runtime field on those records shows 67 titles pointed at proton-stable against 52 at lepton-stable, Valve's Android layer. Three certified games are Steam pages with no PC build at all. The same two backend packages that moved on September 3 moved again on September 10, three minutes apart both times.",
  },
  {
    date: "Sep 14, 2026",
    slug: "steam-frame-launch-price-1059-psu-not-included-2026",
    text: "Valve launches the Steam Frame at $1,059 for 256GB and $1,299 for 1TB, with Half-Life: Alyx included and the power supply sold separately. Reservation signups open immediately and close September 17 at 10 AM Pacific; purchase emails begin September 18.",
  },
];

// Rendered oldest to newest. Entries are hand-maintained and have shipped
// appended in the wrong direction before (Sept 2026), so sort at render time
// instead of trusting array order. Stable sort keeps same-day entries in
// array order.
const TIMELINE_SORTED = [...TIMELINE].sort(
  (a, b) => Date.parse(a.date) - Date.parse(b.date),
);

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
          Last updated: September 14, 2026
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
          , the{" "}
          <a
            href="/steam-frame-specs"
            className="no-underline hover:underline"
            style={{ color: "var(--accent-cyan)" }}
          >
            full spec sheet
          </a>
          , a guide to{" "}
          <a
            href="/steam-frame-games"
            className="no-underline hover:underline"
            style={{ color: "var(--accent-cyan)" }}
          >
            what games run on it
          </a>
          , plus our{" "}
          <a
            href="/steam-frame-vs-quest-3"
            className="no-underline hover:underline"
            style={{ color: "var(--accent-cyan)" }}
          >
            Steam Frame vs Quest 3 comparison
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
          The Steam Frame is Valve&apos;s wireless, streaming-first SteamOS VR
          headset, and it launched on September 14, 2026. The 256GB Kit costs
          $1,059 and the 1TB Kit $1,299, each with the Steam Frame Controllers,
          a Wi-Fi 6E wireless adapter for PC streaming, and a copy of
          Half-Life: Alyx. The power supply is sold separately for $29. You buy
          one through a randomized reservation list: signups close Thursday,
          September 17 at 10:00 AM Pacific, and the first purchase emails go
          out September 18. Valve counts over 100 games Steam Frame Standalone
          Verified at launch. This page links every piece of our reporting,
          from the November 2025 announcement through launch week, and keeps
          tracking the headset as it reaches buyers.
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
          Release date: launched September 14, 2026
        </h2>
        <p
          className="text-[15px] leading-[1.7] mb-4"
          style={{ color: "var(--text-secondary)" }}
        >
          Valve&apos;s Steam Hardware account posted &quot;Steam Frame is
          here!&quot; at 10:01 AM Pacific on Monday, September 14, and opened
          reservations in the same post. It is the Steam Machine playbook
          again, and Valve says so, citing the reservation system as a way to
          improve the purchase experience and limit resellers. Signups stay
          open until Thursday, September 17 at 10:00 AM Pacific. Each
          model&apos;s list is then shuffled once, everyone is emailed a
          reservation or waitlist result that day, and purchase emails start
          September 18 with a 72-hour window to check out. To qualify, your
          Steam account must be in good standing with a purchase made before
          April 27, 2026, and Valve allows one signup per household. Our{" "}
          <a
            href="/articles/steam-frame-reservation-how-to-sign-up-before-september-17-2026"
            className="no-underline hover:underline"
            style={{ color: "var(--accent-cyan)" }}
          >
            reservation guide
          </a>{" "}
          walks through each step, and the{" "}
          <a
            href="/steam-frame-release-date"
            className="no-underline hover:underline"
            style={{ color: "var(--accent-cyan)" }}
          >
            release date page
          </a>{" "}
          has every key date.
        </p>
        <p
          className="text-[15px] leading-[1.7] mb-4"
          style={{ color: "var(--text-secondary)" }}
        >
          Valve ships directly through Steam to the U.S., Canada, the UK, the
          EU, and Australia. Japan, Taiwan, and Hong Kong buy through KOMODO,
          Valve&apos;s authorized distributor, and South Korea follows later.
          The road here had slips. The November 2025 announcement targeted
          early 2026, which softened to first half by February, and in April
          Valve publicly said the memory crisis forced it to revisit both the
          shipping schedule and pricing. Summer 2026 was the version that
          stuck, and Valve made it with eight days of summer left.
        </p>

        <h2 className="font-display text-2xl font-bold mt-10 mb-3">
          Price: $1,059 and $1,299, power supply extra
        </h2>
        <p
          className="text-[15px] leading-[1.7] mb-4"
          style={{ color: "var(--text-secondary)" }}
        >
          Valve&apos;s stated goal in November 2025 was a headset cheaper than
          the $999 Index. The 256GB Kit landed at $1,059, and the 1TB Kit at
          $1,299. That is inside the $899 to $1,199 analyst range we tracked
          all summer, and $10 above the Steam Machine, which Valve priced at
          $1,049 after blaming DDR5 contract prices up more than 170% year
          over year. Three first-party accessories are sold separately, and
          only at checkout once you have a purchase email: a 45W power supply
          with a 2.5m cable ($29), the Ergonomic Accessories Kit with
          controller hand straps and battery doors, a top strap, and an
          extended light blocker ($59), and a replacement kit of the face
          gasket, head cushion, and standard light blocker ($49). Color
          passthrough is not built in; Valve lists the Arcturus Vision camera
          as a Steam Frame Compatible add-on for it, which UploadVR reports at
          $149, and Zenni makes the prescription inserts. Regional prices and the full signal history
          are on{" "}
          <a
            href="/steam-frame-price"
            className="no-underline hover:underline"
            style={{ color: "var(--accent-cyan)" }}
          >
            our Steam Frame price page
          </a>
          , and{" "}
          <a
            href="/articles/steam-frame-launch-price-1059-psu-not-included-2026"
            className="no-underline hover:underline"
            style={{ color: "var(--accent-cyan)" }}
          >
            our launch report
          </a>{" "}
          breaks down what the money buys.
        </p>

                <div className="my-8">
          <AdSlot slot={AD_SLOTS.pillar} format="horizontal" />
        </div>

        <h2 className="font-display text-2xl font-bold mt-10 mb-3">
          Specs at a glance
        </h2>
        <ComparisonTable
          caption="Steam Frame specifications from Valve's official product page (September 14, 2026), with weight from earlier reporting and controller details from FCC filings."
          columns={["Spec", "Steam Frame"]}
          rows={[
            ["Weight", "185g frontbox, about 440g with battery strap (Quest 3 is 515g)"],
            ["Displays", "Dual 2160x2160 LCD per eye, pancake lenses"],
            ["Refresh rate", "72 to 144Hz (144Hz experimental)"],
            ["Eye tracking", "Yes, low-latency eye tracking drives Foveated Streaming"],
            ["Chip", "4nm Snapdragon 8 Gen 3, ARM64"],
            ["Memory", "16GB unified LPDDR5X (double the Quest 3)"],
            ["Storage", "256GB or 1TB UFS, plus microSD card slot"],
            ["Battery", "Rechargeable 21.6 Wh Li-ion; power supply not included"],
            ["OS", "SteamOS 3. Proton 11.0 (ARM64) on Steam Linux Runtime 4.0, FEX for x86 translation, Lepton for Android APKs"],
            ["Wireless", "Headset Wi-Fi 7, 2x2, dual radios; Bluetooth 5.4"],
            ["PC streaming", "Included Wi-Fi 6E wireless adapter on a dedicated 6GHz link; Foveated Streaming and Multi-Link Streaming"],
            ["Tracking", "Inside-out, four high-resolution monochrome cameras with infrared illuminators"],
            ["Passthrough", "Monochrome built in; color via the $149 Arcturus Vision camera add-on"],
            ["Audio", "Dual speaker drivers per ear, dual microphone array"],
            ["Controllers", "Steam Frame Controllers, full 6-DOF and gamepad controls; TMR thumbsticks (FCC filings)"],
            ["Price", "$1,059 (256GB Kit), $1,299 (1TB Kit); Half-Life: Alyx included"],
            ["Accessories", "PSU $29, Ergonomic Accessories Kit $59, Accessory Replacement Kit $49; Zenni prescription inserts"],
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
          with a plug-and-play 6GHz wireless adapter that plugs into your PC
          and gives streaming its own link, and journalists who tried it at
          Valve&apos;s offices reported no perceptible lag. The launch page
          fills in the rest: one of the headset&apos;s two radios is dedicated
          to the stream while the other handles your Wi-Fi, Multi-Link
          Streaming routes data across every available connection at once,
          and Foveated Streaming uses eye tracking to put the best pixels
          where you are looking, which Valve says typically offers over a 10x
          improvement in image quality and effective bandwidth. Valve describes the
          Frame as streaming-first with standalone capability, not the other way
          around: the Snapdragon 8 Gen 3 runs the Steam library on-device
          through Proton and FEX when you are away from your PC, and the
          strict{" "}
          <a
            href="/articles/steam-frame-verified-72fps-valve-quietly-cut-requirement-2026"
            className="no-underline hover:underline"
            style={{ color: "var(--accent-cyan)" }}
          >
            Steam Frame Verified program
          </a>{" "}
          governs what earns the on-device badge. That standalone stack
          quietly graduated on August 10, when Valve&apos;s compat registry
          moved Proton 11.0 (ARM64) into the proton-stable slot held until
          then by experimental ARM64EC builds, and added Steam Linux Runtime
          4.0 for arm64 as a required dependency. Even Meta is paying
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
          There is no new Half-Life moment. Road to VR reported at the
          announcement that a Steam Frame team member flatly denied Valve has
          any VR content in development, and ten months later the launch
          confirmed it. What Valve did instead was put the old one in the box:
          every Steam Frame includes a copy of Half-Life: Alyx, redeemed in the
          headset&apos;s settings, one per device, and{" "}
          <a
            href="https://www.uploadvr.com/steam-frame-price-revealed-reservations-opened-alyx-included/"
            target="_blank"
            rel="noopener"
            className="no-underline hover:underline"
            style={{ color: "var(--accent-cyan)" }}
          >
            UploadVR reports
          </a>{" "}
          Valve built a native 64-bit ARM version that runs standalone, with
          Steam Cloud saves shared between the headset and PC streaming. We
          wrote about{" "}
          <a
            href="/articles/half-life-alyx-standalone-steam-frame-launch-game-2026"
            className="no-underline hover:underline"
            style={{ color: "var(--accent-cyan)" }}
          >
            what that does for the launch
          </a>
          . Valve&apos;s bet is still
          that the library is the launch title: your entire Steam catalog over
          the wireless adapter, plus over 100 games Steam Frame Standalone
          Verified for on-device play. On the third-party side, Payday:
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
          {TIMELINE_SORTED.map((entry) => (
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
