import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ComparisonTable } from "@/components/SpokeBlocks";
import {
  StructuredData,
  breadcrumbSchema,
  faqPageSchema,
} from "@/components/StructuredData";
import { RecentArticles } from "@/components/RecentArticles";
import { AllPillarGuides } from "@/components/RelatedGuides";
import { AdSlot } from "@/components/AdSlot";
import { AD_SLOTS } from "@/lib/ads";

const LAST_UPDATED = "2026-09-06";

export const metadata = {
  title: "Meta Connect 2026: Date, Time, What to Expect, and Everything We Know | VR.org",
  description:
    "Meta Connect 2026 runs September 23 to 24 with the keynote on the 23rd. What Meta has teased, what the Quest roadmap actually allows, and what VR.org expects from the glasses-led keynote. Updated until the show.",
  openGraph: {
    title: "Meta Connect 2026: Date, Time, What to Expect | VR.org",
    description:
      "September 23 to 24. New smart glasses teased, Quest 4 pointed at 2027. Every signal, tracked.",
    url: "https://vr.org/meta-connect-2026",
    siteName: "VR.org",
    images: [
      {
        url: "https://vr.org/og-image.png",
        width: 1200,
        height: 630,
        alt: "Meta Connect 2026 - VR.org",
      },
    ],
  },
  twitter: {
    card: "summary_large_image" as const,
    title: "Meta Connect 2026: Date, Time, What to Expect | VR.org",
    description:
      "September 23 to 24. New smart glasses teased, Quest 4 pointed at 2027. Every signal, tracked.",
    images: ["https://vr.org/og-image.png"],
  },
  alternates: {
    canonical: "https://vr.org/meta-connect-2026",
  },
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Meta Connect 2026: Date, Time, What to Expect, and Everything We Know",
  datePublished: "2026-09-06",
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
    "@id": "https://vr.org/meta-connect-2026",
  },
  image:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Meta_Platforms_Headquarters_Menlo_Park_California.jpg/1280px-Meta_Platforms_Headquarters_Menlo_Park_California.jpg",
};

const eventSchema = {
  "@context": "https://schema.org",
  "@type": "Event",
  name: "Meta Connect 2026",
  description:
    "Meta's annual VR, AR, wearables and AI showcase. Keynote on September 23, developer state of the union and developer sessions on September 24, streamed from Meta's Menlo Park campus.",
  startDate: "2026-09-23",
  endDate: "2026-09-24",
  eventStatus: "https://schema.org/EventScheduled",
  eventAttendanceMode: "https://schema.org/MixedEventAttendanceMode",
  location: [
    {
      "@type": "Place",
      name: "Meta HQ",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Menlo Park",
        addressRegion: "CA",
        addressCountry: "US",
      },
    },
    { "@type": "VirtualLocation", url: "https://www.meta.com/connect/" },
  ],
  organizer: { "@type": "Organization", name: "Meta", url: "https://www.meta.com/" },
  url: "https://vr.org/meta-connect-2026",
};

const breadcrumbs = breadcrumbSchema([
  { name: "Home", url: "https://vr.org" },
  { name: "Events", url: "https://vr.org/events" },
  { name: "Meta Connect 2026", url: "https://vr.org/meta-connect-2026" },
]);

const faq = faqPageSchema([
  {
    question: "When is Meta Connect 2026?",
    answer:
      "September 23 to 24, 2026. The keynote is on Wednesday, September 23, and Meta's developer state of the union and developer sessions follow on September 24. Meta announced the dates on May 28, 2026 and is streaming the event from its Menlo Park, California campus.",
  },
  {
    question: "What time is the Meta Connect 2026 keynote?",
    answer:
      "Meta's registration page lists the keynote for September 23 without a start time as of September 6, 2026. Coverage of the May announcement pointed to a late-afternoon Pacific slot, and Meta's last several Connect keynotes started between 10 AM and 5 PM Pacific. VR.org will update this page the moment Meta posts a time.",
  },
  {
    question: "Will Meta announce the Quest 4 at Connect 2026?",
    answer:
      "Almost certainly not as a product you can buy. Reporting puts the gaming-focused Quest 4, rebooted under the codename Griffin, no earlier than the second half of 2027, and the ultralight puck-tethered headset known as Puffin or Phoenix in the first half of 2027. Meta CTO Andrew Bosworth said in July to stay tuned for Connect because there would be more to share about its next headsets, which reads as a tease or preview rather than a launch.",
  },
  {
    question: "What glasses is Meta teasing for Connect 2026?",
    answer:
      "Meta's save-the-date included an image of what looks like a new pair of smart glasses with no name, specs or price. The most credible candidates are a successor or sibling to the Ray-Ban Display glasses, possibly a cheaper display tier, and the neural wristband input Meta has been demoing. Bloomberg reported in May that the next Ray-Ban Display had been pulled into the first quarter of 2027, so a preview at Connect fits that timeline.",
  },
  {
    question: "How do I watch Meta Connect 2026?",
    answer:
      "Register for the free livestream at meta.com/connect. Meta streams the keynote on its own site and typically mirrors it on Facebook and YouTube. VR.org will publish a same-day recap of everything announced and link it from this page.",
  },
  {
    question: "How does Meta Connect relate to the Steam Frame launch?",
    answer:
      "Valve's stated summer 2026 window for the Steam Frame ends September 22, the day before the Connect keynote. Two of the Frame's Steam backend packages were revised on September 3 for the first time since May, the same move that preceded Steam Machine reservations by six days, so the Frame is expected to be on sale or in a reservation lottery before Meta takes the stage. Bosworth has already said Meta will learn from the Steam Frame.",
  },
]);

interface TimelineEntry {
  date: string;
  slug: string;
  text: string;
}

const TIMELINE: TimelineEntry[] = [
  {
    date: "May 7, 2026",
    slug: "bosworth-quest-4-roadmap-learn-from-steam-frame-may-2026",
    text: "Andrew Bosworth confirms two next-generation headsets remain on the roadmap and says Meta will learn from Valve's Steam Frame.",
  },
  {
    date: "May 21, 2026",
    slug: "meta-response-google-io-2026-no-price-cut-ray-ban-display",
    text: "Two days after Google puts an October ship date on Android XR glasses, Meta un-pauses the European Ray-Ban Display rollout and Bloomberg reports the next Display is pulled into Q1 2027. The current price does not move.",
  },
  {
    date: "May 27, 2026",
    slug: "meta-ray-ban-display-developer-sdk-2026",
    text: "Meta opens Ray-Ban Display to third-party developers with a native mobile SDK and a web apps route.",
  },
  {
    date: "May 28, 2026",
    slug: "meta-connect-2026-date-september-glasses-tease",
    text: "Meta sets Connect for September 23 to 24 in Menlo Park and teases a new pair of smart glasses in the save-the-date. It does not dangle a Quest.",
  },
  {
    date: "Jun 20, 2026",
    slug: "meta-quest-4-everything-we-know",
    text: "Our Quest 4 tracker sorts every claim into confirmed, reported or rumor. The short version: not in 2026, with the price trending up.",
  },
  {
    date: "Jul 16, 2026",
    slug: "meta-connect-2026-headset-tease-puffin-griffin-roadmap",
    text: "Bosworth says stay tuned for Connect on headsets. The roadmap allows a tease of Griffin (Quest 4, H2 2027 at the earliest) and the ultralight Puffin (H1 2027), not a launch.",
  },
  {
    date: "Jul 29, 2026",
    slug: "meta-phoenix-110-gram-weight-budget-bigscreen-beyond-2026",
    text: "Setup graphics for the ultralight headset surface in Quest firmware. The weight target is under 110 grams, which asks for a Bigscreen Beyond with cameras.",
  },
  {
    date: "Aug 27, 2026",
    slug: "meta-hologram-calling-codec-avatars-horizon-os-framework-2026",
    text: "Horizon OS builds carry Hologram Calling frameworks referencing Codec Avatars, and the Meta AI app has Hologram product tours. A software reveal shaped for a keynote.",
  },
  {
    date: "Aug 31, 2026",
    slug: "quest-3-240hz-extended-refresh-rates-developer-docs-2026",
    text: "Meta's developer docs list Quest 3 as accepting refresh rates up to 207 Hz, with 240 Hz behind developer mode, then tell developers not to require it.",
  },
];

export default function MetaConnect2026Page() {
  return (
    <>
      <StructuredData data={articleSchema} />
      <StructuredData data={eventSchema} />
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
          Meta Connect 2026: Date, Time, What to Expect, and Everything We Know
        </h1>

        <p className="text-sm mb-3" style={{ color: "var(--text-muted)" }}>
          Last updated: September 6, 2026
        </p>

        <p className="text-[13px] mb-8" style={{ color: "var(--text-muted)" }}>
          Part of our{" "}
          <a
            href="/events"
            className="no-underline hover:underline"
            style={{ color: "var(--accent-cyan)" }}
          >
            VR, AR and XR events calendar
          </a>
          . See also the{" "}
          <a
            href="/steam-frame"
            className="no-underline hover:underline"
            style={{ color: "var(--accent-cyan)" }}
          >
            Steam Frame hub
          </a>{" "}
          for the launch landing the day before, and our{" "}
          <a
            href="/articles/meta-quest-4-everything-we-know"
            className="no-underline hover:underline"
            style={{ color: "var(--accent-cyan)" }}
          >
            Quest 4 tracker
          </a>
          .
        </p>

        {/* Definitional lede for AI Overview capture */}
        <p
          className="text-[15px] leading-[1.7] mb-8"
          style={{ color: "var(--text-secondary)" }}
        >
          Meta Connect 2026 runs September 23 to 24, with the keynote on
          Wednesday the 23rd and developer sessions on the 24th, streamed from
          Meta&apos;s Menlo Park campus. Meta announced the dates on May 28 and
          teased a new pair of smart glasses in the same breath. It did not
          tease a headset, and the roadmap explains why: the gaming Quest 4 is
          pointed at the second half of 2027 and the ultralight Puffin headset
          at the first half, so anything Meta shows on stage is a preview, not
          a product. Expect a glasses-led keynote, a Horizon OS software story
          built around Hologram calling and AI, and a headset tease at most.
          This page tracks every signal until the show and becomes the
          everything-announced recap afterward.
        </p>

        <figure className="pillar-figure">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Meta_Platforms_Headquarters_Menlo_Park_California.jpg/1280px-Meta_Platforms_Headquarters_Menlo_Park_California.jpg"
            alt="Meta Platforms headquarters sign at 1 Hacker Way in Menlo Park, California, the site of Connect 2026"
            loading="lazy"
          />
          <figcaption>
            Meta&apos;s Menlo Park campus, host of Connect 2026. Image: LPS.1 /
            Wikimedia Commons (CC0)
          </figcaption>
        </figure>

        <h2 className="font-display text-2xl font-bold mt-10 mb-3">
          Dates, time, and how to watch
        </h2>
        <ComparisonTable
          caption="Meta Connect 2026 schedule as published on Meta's registration page, checked September 6, 2026."
          columns={["Day", "Session", "Status"]}
          rows={[
            ["Wednesday, September 23", "Meta Connect keynote", "Confirmed; start time not yet posted"],
            ["Thursday, September 24", "Developer state of the union", "Confirmed"],
            ["Thursday, September 24", "Developer sessions", "Confirmed"],
          ]}
        />
        <p
          className="text-[15px] leading-[1.7] mb-4"
          style={{ color: "var(--text-secondary)" }}
        >
          Registration for the free livestream is open at{" "}
          <a
            href="https://www.meta.com/connect/"
            target="_blank"
            rel="noopener"
            className="no-underline hover:underline"
            style={{ color: "var(--accent-cyan)" }}
          >
            meta.com/connect
          </a>
          , which frames the show as a two-day livestream about &quot;AI
          technologies, AI glasses and VR,&quot; in that order. Meta has not
          posted a keynote start time yet. Coverage of the May announcement
          pointed to a late-afternoon Pacific slot, which would put it in the
          evening for the US East Coast and overnight for Europe; we will
          update this table when Meta commits to a time.
        </p>

        <h2 className="font-display text-2xl font-bold mt-10 mb-3">
          What Meta has actually said
        </h2>
        <p
          className="text-[15px] leading-[1.7] mb-4"
          style={{ color: "var(--text-secondary)" }}
        >
          Two things. The{" "}
          <a
            href="/articles/meta-connect-2026-date-september-glasses-tease"
            className="no-underline hover:underline"
            style={{ color: "var(--accent-cyan)" }}
          >
            May 28 save-the-date
          </a>{" "}
          promised &quot;the latest in VR, wearables, metaverse, and AI&quot;
          and a look at Meta&apos;s &quot;next computing platform,&quot; and it
          carried an image of an unnamed pair of smart glasses. Then in July,
          CTO Andrew Bosworth{" "}
          <a
            href="/articles/meta-connect-2026-headset-tease-puffin-griffin-roadmap"
            className="no-underline hover:underline"
            style={{ color: "var(--accent-cyan)" }}
          >
            told Quest owners to stay tuned for Connect
          </a>{" "}
          because there would be more to share about Meta&apos;s next
          headsets. That is the entire official record. Everything else on
          this page is reporting, roadmap leaks, and inference.
        </p>

        <div className="my-8">
          <AdSlot slot={AD_SLOTS.pillar} format="horizontal" />
        </div>

        <h2 className="font-display text-2xl font-bold mt-10 mb-3">
          What the roadmap allows on stage
        </h2>
        <p
          className="text-[15px] leading-[1.7] mb-4"
          style={{ color: "var(--text-secondary)" }}
        >
          Meta is building two headsets and neither ships this year. The
          traditional Quest 4 effort was rebooted under the codename Griffin
          after the Pismo prototypes were scrapped, and reporting puts it no
          earlier than the second half of 2027. The more interesting device is
          the ultralight, puck-tethered headset that has gone by Puffin, Loma
          and Phoenix, tracking toward the first half of 2027 at{" "}
          <a
            href="/articles/meta-phoenix-110-gram-weight-budget-bigscreen-beyond-2026"
            className="no-underline hover:underline"
            style={{ color: "var(--accent-cyan)" }}
          >
            under 110 grams on the face
          </a>{" "}
          and reportedly under $1,000, aimed at media, social and fitness
          rather than headline gaming. Meta has shown future hardware years
          early before, so a Puffin preview is plausible. A Quest 4 you can
          order is not.
        </p>
        <p
          className="text-[15px] leading-[1.7] mb-4"
          style={{ color: "var(--text-secondary)" }}
        >
          Glasses are where Meta has momentum to show off, and the tease says
          it knows that. The credible candidates are a successor or cheaper
          sibling to Ray-Ban Display, which{" "}
          <a
            href="/articles/meta-ray-ban-display-developer-sdk-2026"
            className="no-underline hover:underline"
            style={{ color: "var(--accent-cyan)" }}
          >
            opened to third-party developers in May
          </a>
          , more of the neural wristband, and whatever &quot;wearables&quot;
          covers beyond eyewear. Bloomberg&apos;s May report that{" "}
          <a
            href="/articles/meta-response-google-io-2026-no-price-cut-ray-ban-display"
            className="no-underline hover:underline"
            style={{ color: "var(--accent-cyan)" }}
          >
            the next Display was pulled into the first quarter of 2027
          </a>{" "}
          makes a Connect preview the natural first look. On the software
          side,{" "}
          <a
            href="/articles/meta-hologram-calling-codec-avatars-horizon-os-framework-2026"
            className="no-underline hover:underline"
            style={{ color: "var(--accent-cyan)" }}
          >
            Hologram Calling frameworks are already sitting in Horizon OS
          </a>{" "}
          with product tours in the Meta AI app, which is the shape of a
          feature staged for a keynote demo.
        </p>

        <h2 className="font-display text-2xl font-bold mt-10 mb-3">
          The day before: Steam Frame
        </h2>
        <p
          className="text-[15px] leading-[1.7] mb-4"
          style={{ color: "var(--text-secondary)" }}
        >
          Valve&apos;s stated summer window for the Steam Frame ends September
          22, the day before the keynote, and{" "}
          <a
            href="/articles/steam-frame-packages-revised-september-3-reservation-backend-2026"
            className="no-underline hover:underline"
            style={{ color: "var(--accent-cyan)" }}
          >
            two of the Frame&apos;s Steam backend packages were revised on
            September 3
          </a>
          , the same move that preceded Steam Machine reservations by six
          days. So the likeliest sequence is a Steam Frame lottery in the
          second week of September, first units in mid September, and Meta
          walking on stage a week later with no new headset to sell against a
          185 gram SteamOS device that streams the entire Steam catalog. Bosworth
          said in May that{" "}
          <a
            href="/articles/bosworth-quest-4-roadmap-learn-from-steam-frame-may-2026"
            className="no-underline hover:underline"
            style={{ color: "var(--accent-cyan)" }}
          >
            Meta would learn from the Steam Frame
          </a>
          . Connect is the first chance to see what that means. Our{" "}
          <a
            href="/steam-frame-vs-quest-3"
            className="no-underline hover:underline"
            style={{ color: "var(--accent-cyan)" }}
          >
            Steam Frame vs Quest 3 comparison
          </a>{" "}
          covers the two headsets that will actually be on sale that week.
        </p>

        <h2 className="font-display text-2xl font-bold mt-10 mb-3">
          Every Connect 2026 signal, dated
        </h2>
        <div className="mb-8">
          {TIMELINE.map((t) => (
            <div
              key={t.slug + t.date}
              className="py-3"
              style={{ borderBottom: "1px solid var(--border)" }}
            >
              <div className="text-[12px] font-mono mb-1" style={{ color: "var(--text-muted)" }}>
                {t.date}
              </div>
              <a
                href={`/articles/${t.slug}`}
                className="no-underline hover:underline text-[15px] leading-[1.6]"
                style={{ color: "var(--text-secondary)" }}
              >
                {t.text}
              </a>
            </div>
          ))}
        </div>

        <RecentArticles heading="Latest Meta and XR News" limit={4} tag="xr" />
        <AllPillarGuides exclude="meta-connect-2026" />
      </main>

      <Footer />
    </>
  );
}
