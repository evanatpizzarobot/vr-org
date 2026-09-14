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
  title: "Steam Frame Release Date: Launched September 14, 2026, Reservation Dates | VR.org",
  description:
    "The Valve Steam Frame launched September 14, 2026. Reservation signups close September 17 at 10 AM Pacific, results arrive that day, and purchase emails begin September 18. Every date, plus the signals that predicted it.",
  openGraph: {
    title: "Steam Frame Release Date: Launched September 14, 2026, Reservation Dates | VR.org",
    description:
      "Launched September 14. Signups close September 17 at 10 AM PT, purchase emails from September 18. Every key date and every signal that led there.",
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
    title: "Steam Frame Release Date: Launched September 14, 2026",
    description:
      "Signups close September 17 at 10 AM PT; purchase emails start September 18. Tracked by VR.org.",
    images: [
      "https://vr.org/article-images/steam-frame/steam-frame-controllers.jpg",
    ],
  },
  alternates: {
    canonical: "https://vr.org/steam-frame-release-date",
  },
};

const LAST_UPDATED = "2026-09-14";

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline:
    "Steam Frame Release Date: Launched September 14, 2026, and Every Signal That Called It",
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
    question: "When did the Steam Frame come out?",
    answer:
      "Valve launched the Steam Frame on September 14, 2026, with a Steam Hardware post titled \"Steam Frame is here!\" that opened reservation signups the same morning. Signups close Thursday, September 17, 2026 at 10:00 AM Pacific. Valve then runs a one-time randomization and emails every signup on September 17 with a reservation or waitlist result, and the first purchase emails go out September 18. Units ship as they become available, in randomized queue order. That kept Valve's summer 2026 promise with eight days to spare before summer ends on September 22.",
  },
  {
    question: "How do I reserve a Steam Frame?",
    answer:
      "Pick one model, the 256GB Kit at $1,059 or the 1TB Kit at $1,299, on the Steam Frame product page and join the list before September 17 at 10:00 AM Pacific. You need a Steam account in good standing that made a purchase before April 27, 2026, and Valve allows one signup per household, checked against payment method and shipping address. Signing up early gives no advantage, because the whole list is shuffled once. Anyone who signs up after the shuffle goes to the back of the waitlist.",
  },
  {
    question: "What happens after the September 17 randomization?",
    answer:
      "You get an email on September 17 saying you are either in the reservation queue or on the waitlist. A reservation means a unit of the model you chose is held in your name; when it is ready to ship, Valve emails you a purchase link and you have 72 hours to complete checkout before the reservation passes to the next person. Waitlisted buyers move up if reservations are cancelled, and future production runs are offered in waitlist order. Lists are separate for each model and for each shipping region, and you cannot switch models after the shuffle.",
  },
  {
    question: "Was the Steam Frame delayed?",
    answer:
      "Yes, softly. The November 2025 announcement targeted early 2026, which slipped to first half by February, and in April Valve publicly blamed the memory crisis for revisiting the schedule. Summer 2026 was the window that stuck: Valve reaffirmed it in late June alongside the Steam Machine launch and launched on September 14.",
  },
  {
    question: "Where can you buy the Steam Frame?",
    answer:
      "Valve ships the Steam Frame directly through Steam in the U.S., Canada, the UK, the EU, and Australia, with separate reservation lists for North America, the UK and EU, and Australia. In Japan, Taiwan, and Hong Kong it is sold through KOMODO, Valve's authorized distributor, which publishes its own pricing. South Korea is coming at a later date.",
  },
  {
    question: "What does the Steam Frame launch with?",
    answer:
      "No first-party launch game, but every kit includes a copy of Half-Life: Alyx, redeemed in the headset's settings (one copy per device, and not if you already own it). Valve counts over 100 games as Steam Frame Standalone Verified at launch, and the rest of your Steam library streams from a PC over the included Wi-Fi 6E wireless adapter.",
  },
  {
    question: "How much does the Steam Frame cost at launch?",
    answer:
      "$1,059 for the 256GB Kit and $1,299 for the 1TB Kit in the US, VAT included where applicable in other regions. A power supply is not included; Valve sells a 45W unit for $29. Our Steam Frame price page lists every regional price and accessory.",
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
  {
    date: "Sep 8, 2026",
    signal: "Great on Frame at 121 titles, 14 days of summer left",
    read: "Shelf mostly stocked, the promised week is here",
  },
  {
    date: "Sep 14, 2026",
    signal: "Valve posts \"Steam Frame is here!\" and opens reservation signups at $1,059 and $1,299",
    read: "Launched, eight days before summer ends",
  },
];

const KEY_DATES: string[][] = [
  ["Mon, Sep 14, 2026", "Launch announcement; reservation signups open"],
  ["Thu, Sep 17, 2026, 10:00 AM PT", "Signups close; one-time randomization of each list"],
  ["Thu, Sep 17, 2026", "Reservation or waitlist result emails go out"],
  ["Fri, Sep 18, 2026", "First purchase emails; 72 hours to check out each"],
  ["After Sep 17, 2026", "Late signups join the back of the waitlist"],
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
          Steam Frame Release Date: Launched September 14, 2026, and Every Signal That Called It
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
          className="text-[15px] leading-[1.7] mb-4"
          style={{ color: "var(--text-secondary)" }}
        >
          The Valve Steam Frame launched on September 14, 2026. Valve&apos;s
          Steam Hardware post, headlined &quot;Steam Frame is here!&quot;, went
          up at 10:01 AM Pacific and opened reservation signups on the spot.
          Signups close Thursday, September 17 at 10:00 AM Pacific, everyone
          gets a reservation or waitlist email that day, and the first purchase
          emails go out Friday, September 18. Pricing starts at $1,059. The
          launch kept Valve&apos;s summer 2026 promise with eight days of summer
          to spare.
        </p>
        <p
          className="text-[15px] leading-[1.7] mb-8"
          style={{ color: "var(--text-secondary)" }}
        >
          It did not arrive in the week this page had pointed to. Two of the
          headset&apos;s Steam backend packages were revised on September 3,
          and because Steam Machine packages had moved six days before its own
          lottery, we read that as the week of September 7. The actual gap was
          11 days. The rest of the trail held up: FCC authorization on July 29,
          35 tons of hardware through US customs in June, leaked setup videos
          on August 19, and a Great on Frame shelf that reached 121 titles by
          September 8. Our{" "}
          <a
            href="/articles/steam-frame-reservation-how-to-sign-up-before-september-17-2026"
            className="no-underline hover:underline"
            style={{ color: "var(--accent-cyan)" }}
          >
            reservation guide
          </a>{" "}
          walks through signing up, and the{" "}
          <a
            href="/articles/steam-frame-launch-price-1059-psu-not-included-2026"
            className="no-underline hover:underline"
            style={{ color: "var(--accent-cyan)" }}
          >
            launch report
          </a>{" "}
          covers what Valve announced.
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
          Steam Frame key dates
        </h2>
        <ComparisonTable
          caption="Valve's official Steam Frame reservation schedule, from the September 14, 2026 announcement and the Steam Frame FAQ. Times are Pacific."
          columns={["Date", "What happens"]}
          rows={KEY_DATES}
        />

        <h2 className="font-display text-2xl font-bold mt-10 mb-3">
          The signal timeline
        </h2>
        <ComparisonTable
          caption="Every Steam Frame release date signal in order, from the November 2025 announcement to launch day, and what each one told us."
          columns={["Date", "Signal", "Our read"]}
          rows={DATE_SIGNALS.map((s) => [s.date, s.signal, s.read])}
        />

        <h2 className="font-display text-2xl font-bold mt-10 mb-3">
          Why the launch was never months away
        </h2>
        <p
          className="text-[15px] leading-[1.7] mb-4"
          style={{ color: "var(--text-secondary)" }}
        >
          Three kinds of evidence stacked up before Valve said a word. The
          regulatory kind:{" "}
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
          . The Frame was the last piece of Valve&apos;s 2026 hardware wave
          waiting for a date, and it got one on September 14.
        </p>

        <div className="my-8">
          <AdSlot slot={AD_SLOTS.pillar} format="horizontal" />
        </div>

        <h2 className="font-display text-2xl font-bold mt-10 mb-3">
          How launch day actually works
        </h2>
        <p
          className="text-[15px] leading-[1.7] mb-4"
          style={{ color: "var(--text-secondary)" }}
        >
          There is no traditional preorder page. Valve reused the randomized
          reservation system it built for the Steam Machine, saying it helped
          improve the purchase experience and limit resellers, and the{" "}
          <a
            href="/articles/valve-steam-controller-sold-out-launch-day-may-2026"
            className="no-underline hover:underline"
            style={{ color: "var(--accent-cyan)" }}
          >
            $99 Steam Controller selling out in under an hour
          </a>{" "}
          shows what first-come first-served would have looked like. This time
          the window runs three days instead of opening with no warning, and
          Valve says outright that there is no incentive to be first: every
          signup made before September 17 at 10:00 AM Pacific lands in the same
          shuffle. Its FAQ adds that the longer window gives it time to confirm
          signups are real accounts, one per household.
        </p>
        <p
          className="text-[15px] leading-[1.7] mb-4"
          style={{ color: "var(--text-secondary)" }}
        >
          The eligibility bar is the part most likely to catch someone out.
          Your Steam account must be in good standing and must have made a
          purchase before April 27, 2026, so a fresh account opened for launch
          week does not qualify. You pick the 256GB or 1TB model at signup and
          cannot change it after the shuffle. Lists are separate per model and
          per shipping region (North America, the UK and EU, and Australia),
          which is why Valve warns that a waitlisted buyer in another region
          may get a purchase email before you do. Once your email arrives, you
          have 72 hours to check out. Price details, including the $29 power
          supply that is not in the box, are on{" "}
          <a
            href="/steam-frame-price"
            className="no-underline hover:underline"
            style={{ color: "var(--accent-cyan)" }}
          >
            our Steam Frame price page
          </a>
          .
        </p>

        <FaqSection schema={faq} />

        <RecentArticles heading="Latest Hardware News" limit={5} tag="hardware" />
        <AllPillarGuides exclude="steam-frame-release-date" />
      </main>

      <Footer />
    </>
  );
}
