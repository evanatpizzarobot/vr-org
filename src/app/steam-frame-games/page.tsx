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
  title: "Steam Frame Games: What You Can Actually Play on It | VR.org",
  description:
    "Three different things run on a Steam Frame: your PC VR library streamed over the 6GHz link, flatscreen Steam games on-device through Proton, and native certified VR titles. What each path gets you, and what is missing at launch.",
  openGraph: {
    title: "Steam Frame Games: What You Can Actually Play on It | VR.org",
    description:
      "Streamed PC VR, flatscreen Steam games through Proton, and 117 certified native titles. The three ways anything runs on a Steam Frame.",
    url: "https://vr.org/steam-frame-games",
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
    title: "Steam Frame Games: What You Can Actually Play on It",
    description:
      "Streamed PC VR, flatscreen Steam through Proton, and the certified native list. All three explained.",
    images: [
      "https://vr.org/article-images/steam-frame/steam-frame-controllers.jpg",
    ],
  },
  alternates: {
    canonical: "https://vr.org/steam-frame-games",
  },
};

const LAST_UPDATED = "2026-09-08";

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline:
    "What Games Can You Play on the Steam Frame? The Three Ways Anything Runs",
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
    "@id": "https://vr.org/steam-frame-games",
  },
  image:
    "https://vr.org/article-images/steam-frame/steam-frame-controllers.jpg",
};

const breadcrumbs = breadcrumbSchema([
  { name: "Home", url: "https://vr.org" },
  { name: "Valve Steam Frame", url: "https://vr.org/steam-frame" },
  { name: "Steam Frame Games", url: "https://vr.org/steam-frame-games" },
]);

const faq = faqPageSchema([
  {
    question: "What games can you play on the Steam Frame?",
    answer:
      "Three different libraries, through three different mechanisms. First, your existing PC VR library streamed from a gaming PC over the bundled 6GHz adapter, which is the experience Valve calls primary and which means anything in SteamVR already works. Second, flatscreen Steam games running on the headset itself, translated from x86 by Proton and FEX, played on a virtual screen. Third, native VR titles certified under Steam Frame Verified, collected on Valve's Great on Frame page, which reported 117 titles on September 6, 2026. The Frame also runs Android APKs.",
  },
  {
    question: "Does the Steam Frame play PC VR games?",
    answer:
      "Yes, and it is the headset's main pitch. The Frame ships with a dedicated 6GHz Wi-Fi 6E USB adapter that plugs into your gaming PC and creates a point-to-point link rather than routing through your home network. Eye-tracked foveated streaming sends full detail only where you are looking, which is how the image survives compression. Valve claims lower latency and greater precision than Steam Link VR, and hands-on reports have described no perceptible lag. Anything that runs in SteamVR on your PC is playable this way.",
  },
  {
    question: "How many games are Steam Frame Verified?",
    answer:
      "117 as of September 6, 2026, up from 98 on August 27, 65 on August 10 and just eight on July 17. The catalog has grown roughly fifteen-fold in seven weeks. Most of that growth is flatscreen Steam catalog games rather than native VR, so the raw number overstates how much new VR content the Frame arrives with.",
  },
  {
    question: "Does the Steam Frame have exclusive games?",
    answer:
      "No first-party launch title has been announced, and Road to VR reported that a Steam Frame team member denied Valve has any VR content in development. Valve's own The Lab was downgraded to Unsupported on July 29, 2026. The most notable VR title on the certified list is Half-Life 2: VR Mod, a free community mod certified on August 6. The Frame's launch library argument is the Steam library you already own, not exclusives.",
  },
  {
    question: "Can you play flatscreen Steam games on the Steam Frame?",
    answer:
      "Yes, on the headset itself with no PC involved. SteamOS runs on the Snapdragon 8 Gen 3 and uses Proton plus FEX x86 emulation to translate desktop Steam builds, which is why the Frame carries 16GB of RAM against the Quest 3's 8GB. The controllers were designed for this: they carry a gamepad-parity layout with all of A, B, X and Y on the right controller and a D-pad on the left, so a flatscreen game needs no remapping. Certified flatscreen titles must hold 720p at 30fps.",
  },
  {
    question: "What is the difference between Steam Frame Verified and Great on Frame?",
    answer:
      "Steam Frame Verified is the certification program; Great on Frame is the storefront page that collects the games which passed it. Standalone VR titles must hold at least 72fps at 1728x1728 per eye on-device, and anything rendering below 1440x1440 is marked Unsupported. Valve announced 90fps at GDC 2026 and quietly revised the published figure to 72. The badge is a recommendation rather than a gate, and games streamed from a PC are exempt entirely.",
  },
]);

const pathRows = [
  [
    "Streamed PC VR",
    "Your whole SteamVR library",
    "A gaming PC plus the bundled 6GHz adapter",
    "The primary experience, per Valve",
  ],
  [
    "On-device flatscreen",
    "Desktop Steam games on a virtual screen",
    "Nothing, runs on the headset",
    "Proton and FEX translate x86; needs 720p30 to certify",
  ],
  [
    "On-device native VR",
    "117 certified titles as of Sep 6",
    "Nothing, runs on the headset",
    "Must hold 72fps at 1728x1728 per eye",
  ],
];

export default function SteamFrameGamesPage() {
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
          What Games Can You Play on the Steam Frame? The Three Ways Anything
          Runs
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
          . The full certified catalog lives on our{" "}
          <a
            href="/great-on-frame"
            className="no-underline hover:underline"
            style={{ color: "var(--accent-cyan)" }}
          >
            Great on Frame list
          </a>
          . See also the{" "}
          <a
            href="/steam-frame-specs"
            className="no-underline hover:underline"
            style={{ color: "var(--accent-cyan)" }}
          >
            full spec sheet
          </a>
          , the{" "}
          <a
            href="/steam-frame-release-date"
            className="no-underline hover:underline"
            style={{ color: "var(--accent-cyan)" }}
          >
            release date tracker
          </a>
          , and the{" "}
          <a
            href="/steam-frame-price"
            className="no-underline hover:underline"
            style={{ color: "var(--accent-cyan)" }}
          >
            price tracker
          </a>
          .
        </p>

        {/* Definitional lede for AI Overview capture */}
        <p
          className="text-[17px] leading-[1.75] mb-6"
          style={{ color: "var(--text-secondary)" }}
        >
          Asking what games run on a Steam Frame has three answers, because
          three different things happen depending on where the game executes.
          Your existing PC VR library <strong>streams</strong> to the headset
          over a dedicated 6GHz link. Flatscreen Steam games run{" "}
          <strong>on the headset itself</strong>, translated from x86 by Proton
          and FEX. And native VR titles certified under{" "}
          <strong>Steam Frame Verified</strong> run on-device too, 117 of them
          as of September 6, 2026. The Frame also runs Android APKs. What it
          does not have is a single exclusive launch title.
        </p>

        <ComparisonTable
          caption="The three execution paths. Most coverage collapses these into one number, which is why the catalog size gets misread."
          columns={["Path", "What you get", "What you need", "The catch"]}
          rows={pathRows}
        />

        <h2 className="font-display text-2xl font-bold mt-10 mb-3">
          Path one: your PC library, streamed
        </h2>
        <p
          className="text-[15px] leading-[1.7] mb-4"
          style={{ color: "var(--text-secondary)" }}
        >
          This is the answer Valve wants you to care about, and it is the
          reason the headset ships with a USB adapter in the box. The 6GHz
          Wi-Fi 6E dongle plugs into your gaming PC and talks directly to the
          headset rather than going through your router, which removes the
          single biggest source of latency in wireless PC VR. Eye-tracked
          foveated streaming does the rest: the headset knows where your pupil
          is pointed and spends its bandwidth there.
        </p>
        <p
          className="text-[15px] leading-[1.7] mb-4"
          style={{ color: "var(--text-secondary)" }}
        >
          Practically, that means the Frame&apos;s VR library on day one is
          however many SteamVR titles you already own. No certification list
          applies, because none of it is running on the headset. This is also
          the path with the hard prerequisite: no gaming PC, no path one.
        </p>

        <div className="my-8">
          <AdSlot slot={AD_SLOTS.pillar} format="horizontal" />
        </div>

        <h2 className="font-display text-2xl font-bold mt-10 mb-3">
          Path two: flatscreen Steam games, on the headset
        </h2>
        <p
          className="text-[15px] leading-[1.7] mb-4"
          style={{ color: "var(--text-secondary)" }}
        >
          SteamOS runs on the Frame&apos;s Snapdragon 8 Gen 3, and Proton plus
          FEX translate desktop x86 builds into something the ARM chip can
          execute. That is why the headset carries 16GB of RAM where a Quest 3
          carries 8. You are not playing an Android port of a Steam game, you
          are playing the Steam game.
        </p>
        <p
          className="text-[15px] leading-[1.7] mb-4"
          style={{ color: "var(--text-secondary)" }}
        >
          Most of the certified catalog&apos;s recent growth is this category:{" "}
          <a
            href="https://store.steampowered.com/app/2379780/"
            target="_blank"
            rel="noopener"
            className="no-underline hover:underline"
            style={{ color: "var(--accent-cyan)" }}
          >
            Balatro
          </a>
          ,{" "}
          <a
            href="https://store.steampowered.com/app/268910/"
            target="_blank"
            rel="noopener"
            className="no-underline hover:underline"
            style={{ color: "var(--accent-cyan)" }}
          >
            Cuphead
          </a>{" "}
          and{" "}
          <a
            href="https://store.steampowered.com/app/1030300/"
            target="_blank"
            rel="noopener"
            className="no-underline hover:underline"
            style={{ color: "var(--accent-cyan)" }}
          >
            Hollow Knight: Silksong
          </a>{" "}
          are flatscreen games on a virtual screen, not VR. The controllers
          were built for exactly this, with all four face buttons on the right
          hand and a D-pad on the left so nothing needs remapping. Certification
          for this category asks only for 720p at 30fps.
        </p>

        <h2 className="font-display text-2xl font-bold mt-10 mb-3">
          Path three: native VR, certified
        </h2>
        <p
          className="text-[15px] leading-[1.7] mb-4"
          style={{ color: "var(--text-secondary)" }}
        >
          Steam Frame Verified is the certification and{" "}
          <a
            href="/great-on-frame"
            className="no-underline hover:underline"
            style={{ color: "var(--accent-cyan)" }}
          >
            Great on Frame
          </a>{" "}
          is the shelf it puts them on. A standalone VR title has to hold at
          least 72fps at 1728x1728 per eye on the headset, and anything
          rendering below 1440x1440 gets marked Unsupported. Valve announced
          90fps at GDC 2026 and later revised the published number down to 72
          without saying so.
        </p>
        <p
          className="text-[15px] leading-[1.7] mb-4"
          style={{ color: "var(--text-secondary)" }}
        >
          The marquee names that have landed:{" "}
          <a
            href="https://store.steampowered.com/app/658920/"
            target="_blank"
            rel="noopener"
            className="no-underline hover:underline"
            style={{ color: "var(--accent-cyan)" }}
          >
            Half-Life 2: VR Mod
          </a>
          , a free community mod certified on August 6 and the highest-profile
          VR title on the list;{" "}
          <a
            href="https://store.steampowered.com/app/620980/"
            target="_blank"
            rel="noopener"
            className="no-underline hover:underline"
            style={{ color: "var(--accent-cyan)" }}
          >
            Beat Saber
          </a>{" "}
          and{" "}
          <a
            href="https://store.steampowered.com/app/448280/"
            target="_blank"
            rel="noopener"
            className="no-underline hover:underline"
            style={{ color: "var(--accent-cyan)" }}
          >
            Job Simulator
          </a>
          , both certified around August 27. And{" "}
          <a
            href="https://store.steampowered.com/app/3456660/"
            target="_blank"
            rel="noopener"
            className="no-underline hover:underline"
            style={{ color: "var(--accent-cyan)" }}
          >
            PAYDAY: Aces High
          </a>{" "}
          from Fast Travel Games was the first third-party title to name Steam
          Frame as a target platform, currently listed for Q4 2026.
        </p>

        <h2 className="font-display text-2xl font-bold mt-10 mb-3">
          The gap nobody at Valve is filling
        </h2>
        <p
          className="text-[15px] leading-[1.7] mb-4"
          style={{ color: "var(--text-secondary)" }}
        >
          There is no first-party launch game. Road to VR reported that a Steam
          Frame team member denied Valve has any VR content in development, and
          Valve&apos;s own The Lab was downgraded to Unsupported on July 29,
          2026. A hardware launch from the company that made Half-Life: Alyx,
          arriving with nothing of its own to play, is a genuine strategic
          choice rather than an oversight: the argument is that you already own
          the library.
        </p>
        <p
          className="text-[15px] leading-[1.7] mb-4"
          style={{ color: "var(--text-secondary)" }}
        >
          Whether that argument holds depends entirely on which path you fall
          into. If you have a gaming PC, the Frame arrives with more VR content
          than any headset ever launched with. If you do not, it arrives with
          117 certified titles, most of them flatscreen, and a free Half-Life 2
          mod as the headline VR experience.
        </p>

        <FaqSection schema={faq} />

        <RecentArticles heading="Latest Steam Frame News" limit={5} tag="gaming" />
        <AllPillarGuides exclude="steam-frame-games" />
      </main>

      <Footer />
    </>
  );
}
