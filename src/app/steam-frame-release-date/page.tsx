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
  title: "Steam Frame Release Date: Latest News & Launch Signals | VR.org",
  description:
    "When does the Valve Steam Frame come out? Summer 2026 is confirmed, hardware has cleared US customs, and the Great on Frame store page is live. Every release date signal, tracked and dated.",
  openGraph: {
    title: "Steam Frame Release Date: Latest News & Launch Signals | VR.org",
    description:
      "Summer 2026 confirmed, hardware in US warehouses, store page live. Every launch signal tracked and dated.",
    url: "https://vr.org/steam-frame-release-date",
    siteName: "VR.org",
    images: [
      {
        url: "https://vr.org/article-images/steam-frame/steam-frame-controllers.jpg",
        width: 1920,
        height: 1080,
        alt: "Valve Steam Frame motion controllers",
      },
    ],
  },
  twitter: {
    card: "summary_large_image" as const,
    title: "Steam Frame Release Date: Latest News & Launch Signals",
    description:
      "Summer 2026 confirmed, hardware in US warehouses, store page live. Tracked by VR.org.",
    images: [
      "https://vr.org/article-images/steam-frame/steam-frame-controllers.jpg",
    ],
  },
  alternates: {
    canonical: "https://vr.org/steam-frame-release-date",
  },
};

const LAST_UPDATED = "2026-09-06";

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline:
    "When Does the Steam Frame Come Out? Every Release Date Signal, Tracked",
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
    "@id": "https://vr.org/steam-frame-release-date",
  },
  image: "https://vr.org/article-images/steam-frame/steam-frame-controllers.jpg",
};

const breadcrumbs = breadcrumbSchema([
  { name: "Home", url: "https://vr.org" },
  { name: "Valve Steam Frame", url: "https://vr.org/steam-frame" },
  {
    name: "Steam Frame Release Date",
    url: "https://vr.org/steam-frame-release-date",
  },
]);

const faq = faqPageSchema([
  {
    question: "When does the Steam Frame come out?",
    answer:
      "Valve has confirmed summer 2026 but has not named a day as of September 6, 2026. The strongest signal yet arrived on September 3, when two of the headset's seven Steam backend packages were revised for the first time since May 5; Steam Machine packages changed six days before its reservation lottery opened, which points at the week of September 7. Every other prerequisite is cleared: the FCC granted equipment authorization for FCC ID 2AES4-1015 on July 29, roughly 35 tons of VR hardware cleared US customs in June, the Steam Machine already shipped June 30, the Great on Frame catalog has grown from eight titles to 117, and Valve's own unboxing and first-time-setup videos leaked out of the Steam client on August 19. Summer ends September 22, which leaves Valve 16 days to keep the promise.",
  },
  {
    question: "How do I preorder the Steam Frame?",
    answer:
      "You cannot yet, though dataminer Brad Lynch reported on September 4 that a reservation system is already live in Steam's backend for two Steam Frame SKUs. Expect the Steam Machine playbook: a short-notice randomized reservation queue on Steam rather than first-come first-served preorders, with purchase emails following within days. The $99 Steam Controller sold out in under an hour and the Machine used a lottery, so plan on tight supply and act fast when reservations open.",
  },
  {
    question: "Was the Steam Frame delayed?",
    answer:
      "Yes, softly. The November 2025 announcement targeted early 2026, which slipped to first half by February, and in April Valve publicly blamed the memory crisis for revisiting the schedule. Summer 2026 is the window that stuck, and Valve reaffirmed it in late June alongside the Steam Machine launch.",
  },
  {
    question: "Will the Steam Frame launch worldwide?",
    answer:
      "Valve has not published a country list. Steam store hardware pages went live in April with KOMODO listed as the distribution partner for Asian markets, the same arrangement Valve uses for the Steam Deck in Japan, Korea, Taiwan, and Hong Kong. Expect an initial wave centered on Valve's usual hardware regions with KOMODO handling Asia.",
  },
  {
    question: "What will the Steam Frame launch with?",
    answer:
      "No first-party launch game exists; Valve's bet is that your whole Steam library is the launch title, streamed over the bundled 6GHz dongle or run on-device through Proton. The Great on Frame page, which certifies games for on-device play, listed eight titles as of July 17. Watch how fast it grows; a filling storefront shelf is the classic pre-launch tell.",
  },
  {
    question: "How much will the Steam Frame cost at launch?",
    answer:
      "No official price. Retailer database leaks point to roughly $950 to $1,070, analyst estimates run $899 to $1,199, and the Steam Machine's $1,049 sticker argues for the high end. Our Steam Frame price tracker follows every signal.",
  },
]);

interface DateSignal {
  date: string;
  signal: string;
  read: string;
}

const DATE_SIGNALS: DateSignal[] = [
  {
    date: "Nov 2025",
    signal: "Steam Frame announced, targeting early 2026",
    read: "Original window",
  },
  {
    date: "Feb 2026",
    signal: "Window softens to first half of 2026",
    read: "First slip",
  },
  {
    date: "Apr 2026",
    signal: "Valve revisits schedule over the RAM crisis; store pages go live",
    read: "Delay made official",
  },
  {
    date: "Jun 18, 2026",
    signal: "FCC embargo lifts on controllers and Enthusiast Kit",
    read: "Hardware is final",
  },
  {
    date: "Jun 2026",
    signal: "About 35 tons of VR hardware clears US customs",
    read: "Inventory is stateside",
  },
  {
    date: "Jun 25, 2026",
    signal: "Valve confirms summer 2026 alongside Steam Machine pricing",
    read: "Window locked",
  },
  {
    date: "Jun 30, 2026",
    signal: "Steam Machine ships, clearing Valve's launch runway",
    read: "Frame is next in line",
  },
  {
    date: "Jul 13, 2026",
    signal: "Great on Frame store section goes live with five titles",
    read: "Merchandising begins",
  },
  {
    date: "Jul 14, 2026",
    signal: "Verified list grows to eight titles in a single day",
    read: "Shelves being stocked",
  },
  {
    date: "Jul 18, 2026",
    signal: "Major SteamVR dashboard overhaul ships to beta users",
    read: "The software is dressing for launch",
  },
  {
    date: "Jul 24, 2026",
    signal: "Qualcomm notifies customers of double-digit Snapdragon price rises for orders shipping after September 1",
    read: "A reason not to slip past August",
  },
  {
    date: "Jul 29, 2026",
    signal: "FCC grants equipment authorization for FCC ID 2AES4-1015, filed May 13",
    read: "Legally sellable in the US",
  },
  {
    date: "Aug 5, 2026",
    signal: "Published Steam Frame Verified floor confirmed at 72 fps, down from the 90 announced at GDC",
    read: "Bar lowered to fill the shelf",
  },
  {
    date: "Aug 6, 2026",
    signal: "Half-Life 2: VR Mod certified, the first marquee name on the list",
    read: "A reason to buy one",
  },
  {
    date: "Aug 10, 2026",
    signal: "Great on Frame reports 65 titles, up from eight on July 17",
    read: "Catalog reaching launch scale",
  },
  {
    date: "Aug 19, 2026",
    signal: "Valve's unboxing and first-time-setup videos leak from the Steam client",
    read: "Retail packaging is finished",
  },
  {
    date: "Aug 24, 2026",
    signal: "Great on Frame at 89 titles, four weeks of summer remaining",
    read: "Shelves filling, clock running",
  },
  {
    date: "Aug 27, 2026",
    signal: "Great on Frame reaches 98 titles, with Beat Saber and Job Simulator certified",
    read: "Marquee names arriving",
  },
  {
    date: "Aug 28, 2026",
    signal: "Brad Lynch tells the Gamertag VR podcast review units are out and shipping starts mid September",
    read: "Reviewers have hardware",
  },
  {
    date: "Sep 3, 2026",
    signal: "Two of the Frame's seven Steam packages revised, the first change since May 5; Steam Machine packages moved six days before its lottery",
    read: "The six-day clock starts",
  },
  {
    date: "Sep 4, 2026",
    signal: "Lynch reports a reservation system live in Steam's backend for two SKUs",
    read: "The checkout exists",
  },
  {
    date: "Sep 6, 2026",
    signal: "Great on Frame at 117 titles, 16 days of summer left",
    read: "Week of September 7 is the working assumption",
  },
];

export default function SteamFrameReleaseDatePage() {
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
          When Does the Steam Frame Come Out? Every Release Date Signal, Tracked
        </h1>

        <p className="text-sm mb-3" style={{ color: "var(--text-muted)" }}>
          Last updated: September 6, 2026
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
            href="/steam-frame-price"
            className="no-underline hover:underline"
            style={{ color: "var(--accent-cyan)" }}
          >
            price tracker
          </a>
          , the{" "}
          <a
            href="/great-on-frame"
            className="no-underline hover:underline"
            style={{ color: "var(--accent-cyan)" }}
          >
            Great on Frame verified games list
          </a>
          , and the full{" "}
          <a
            href="/vr-release-dates"
            className="no-underline hover:underline"
            style={{ color: "var(--accent-cyan)" }}
          >
            VR release dates tracker
          </a>
          .
        </p>

        {/* Definitional lede for AI Overview capture */}
        <p
          className="text-[15px] leading-[1.7] mb-8"
          style={{ color: "var(--text-secondary)" }}
        >
          The Valve Steam Frame is confirmed for summer 2026, and as of September
          6, 2026 Valve has not named the day. It has, however, started touching
          the store: two of the headset&apos;s seven Steam backend packages were
          revised on September 3, the first change since May 5, and Steam Machine
          packages moved six days before its reservation lottery opened. The
          regulatory path is fully clear: the FCC granted equipment authorization on July 29 under
          FCC ID 2AES4-1015, which is the last gate before a radio device can
          legally be sold in the United States. Add the 35 tons of hardware
          already through US customs, a Steam Machine that shipped on June 30,
          and a Great on Frame catalog that went from eight titles to 117 in
          seven weeks, and nothing is left but the announcement. Summer ends
          September 22. This page tracks every release date signal, dated, until
          Valve makes it official.
        </p>

        <figure className="pillar-figure">
          <img
            src="/article-images/steam-frame/steam-frame-controllers.jpg"
            alt="The two Steam Frame motion controllers, showing the D-pad on the left controller and the A, B, X, and Y face buttons on the right"
            width={1920}
            height={1080}
            loading="lazy"
          />
          <figcaption>Image: Valve</figcaption>
        </figure>

        <h2 className="font-display text-2xl font-bold mt-10 mb-3">
          The signal timeline
        </h2>
        <ComparisonTable
          caption="Every Steam Frame release date signal in order, and what each one actually tells us."
          columns={["Date", "Signal", "Our read"]}
          rows={DATE_SIGNALS.map((s) => [s.date, s.signal, s.read])}
        />

        <h2 className="font-display text-2xl font-bold mt-10 mb-3">
          Why we think it is weeks, not months
        </h2>
        <p
          className="text-[15px] leading-[1.7] mb-4"
          style={{ color: "var(--text-secondary)" }}
        >
          Three kinds of evidence stack up. The regulatory kind:{" "}
          <a
            href="/articles/steam-frame-fcc-filing-warehouse-imports-june-2026-launch-imminent"
            className="no-underline hover:underline"
            style={{ color: "var(--accent-cyan)" }}
          >
            the FCC embargo on the Frame&apos;s motion controllers lifted June
            18
          </a>
          , and companies do not finalize FCC paperwork for hardware they plan
          to keep revising. The physical kind: roughly 32,000 kg of hardware
          labeled Virtual Reality Devices cleared customs into Valve&apos;s US
          warehouses in June. You do not pay to warehouse inventory you are
          not about to sell. And the retail kind:{" "}
          <a
            href="/articles/valve-great-on-frame-steam-page-steam-frame-launch-signal"
            className="no-underline hover:underline"
            style={{ color: "var(--accent-cyan)" }}
          >
            Valve stood up a customer-facing Great on Frame shopping section
          </a>{" "}
          in mid July and stocked it with eight certified titles within two
          days. Valve merchandises products it is about to sell.
        </p>
        <p
          className="text-[15px] leading-[1.7] mb-4"
          style={{ color: "var(--text-secondary)" }}
        >
          The sequencing logic points the same way. Valve tends to clear one
          launch before starting the next, and{" "}
          <a
            href="/articles/steam-machine-1049-june-30-launch-price-ceiling-steam-frame"
            className="no-underline hover:underline"
            style={{ color: "var(--accent-cyan)" }}
          >
            the Steam Machine started reaching doorsteps June 30
          </a>
          . The Frame is the last piece of Valve&apos;s 2026 hardware wave
          still waiting for a date, and summer ends in September.
        </p>

        <div className="my-8">
          <AdSlot slot={AD_SLOTS.pillar} format="horizontal" />
        </div>

        <h2 className="font-display text-2xl font-bold mt-10 mb-3">
          How launch day will probably work
        </h2>
        <p
          className="text-[15px] leading-[1.7] mb-4"
          style={{ color: "var(--text-secondary)" }}
        >
          Do not expect a traditional preorder page. The Steam Machine used a
          short-notice randomized reservation lottery on Steam, with purchase
          emails going out within days, and the{" "}
          <a
            href="/articles/valve-steam-controller-sold-out-launch-day-may-2026"
            className="no-underline hover:underline"
            style={{ color: "var(--accent-cyan)" }}
          >
            $99 Steam Controller sold out in under an hour
          </a>{" "}
          before that. Valve built the lottery system precisely because its
          hardware launches keep getting crushed by demand. When the Frame
          reservation window opens, it will likely open with little warning
          and close fast, so decide your budget now (
          <a
            href="/steam-frame-price"
            className="no-underline hover:underline"
            style={{ color: "var(--accent-cyan)" }}
          >
            our price tracker has every signal
          </a>
          ) and keep your Steam wallet and shipping details current.
        </p>
        <p
          className="text-[15px] leading-[1.7] mb-4"
          style={{ color: "var(--text-secondary)" }}
        >
          The one wrinkle history warns about: a leaked June 23 price reveal
          date already came and went without an announcement. Valve&apos;s
          calendar is not our calendar, and the only date that counts is the
          one Valve publishes. When that happens, this page will say so in the
          first sentence.
        </p>

        <FaqSection schema={faq} />

        <RecentArticles heading="Latest Hardware News" limit={5} tag="hardware" />
        <AllPillarGuides exclude="steam-frame-release-date" />
      </main>

      <Footer />
    </>
  );
}
