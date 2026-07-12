import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { StatBar } from "@/components/StatBar";
import {
  StructuredData,
  breadcrumbSchema,
  faqPageSchema,
} from "@/components/StructuredData";
import { RecentArticles } from "@/components/RecentArticles";
import { AllPillarGuides } from "@/components/RelatedGuides";
import { AdSlot } from "@/components/AdSlot";
import { AD_SLOTS } from "@/lib/ads";

export const metadata = {
  title: "The State of VR, AR & XR 2026: A News Data Study | VR.org",
  description:
    "An original VR.org data study of 195 stories across 36 monitored sources. 42% of coverage now touches AR and smart glasses, Meta leads 38% of the conversation, and Android XR is the #2 platform. The data on where VR, AR and XR are headed in 2026.",
  openGraph: {
    title: "The State of VR, AR & XR 2026: A News Data Study | VR.org",
    description:
      "42% of coverage now touches AR and smart glasses, Meta leads 38% of the conversation, and Android XR is the #2 platform. VR.org's original data study of the VR, AR and XR industry in 2026.",
    url: "https://vr.org/state-of-vr-2026",
    siteName: "VR.org",
    images: [
      {
        url: "https://vr.org/og-image.png",
        width: 1200,
        height: 630,
        alt: "The State of VR, AR & XR 2026 - VR.org Data Study",
      },
    ],
  },
  twitter: {
    card: "summary_large_image" as const,
    title: "The State of VR, AR & XR 2026: A News Data Study | VR.org",
    description:
      "42% of coverage now touches AR and smart glasses, Meta leads 38%, and Android XR is the #2 platform. VR.org's original data study.",
    images: ["https://vr.org/og-image.png"],
  },
  alternates: {
    canonical: "https://vr.org/state-of-vr-2026",
  },
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "The State of VR, AR & XR 2026: A News Data Study",
  datePublished: "2026-06-04",
  dateModified: "2026-07-12",
  author: { "@type": "Organization", name: "VR.org", url: "https://vr.org" },
  publisher: {
    "@type": "Organization",
    name: "VR.org",
    url: "https://vr.org",
    logo: { "@type": "ImageObject", url: "https://vr.org/logo.png" },
  },
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": "https://vr.org/state-of-vr-2026",
  },
  image: "https://vr.org/og-image.png",
};

const datasetSchema = {
  "@context": "https://schema.org",
  "@type": "Dataset",
  name: "The State of VR, AR & XR 2026: VR.org News Data Study",
  description:
    "A content analysis of 195 VR.org original stories (March 14 to July 12, 2026) and a 151-story snapshot across 36 monitored VR and tech news sources, measuring company share of voice, topic mix, and the shift toward AR and smart glasses.",
  url: "https://vr.org/state-of-vr-2026",
  creator: { "@type": "Organization", name: "VR.org", url: "https://vr.org" },
  publisher: { "@type": "Organization", name: "VR.org", url: "https://vr.org" },
  datePublished: "2026-06-04",
  dateModified: "2026-07-12",
  temporalCoverage: "2026-03-14/2026-07-12",
  license: "https://creativecommons.org/licenses/by/4.0/",
  keywords: [
    "virtual reality",
    "augmented reality",
    "extended reality",
    "XR",
    "Meta Quest",
    "Android XR",
    "smart glasses",
    "VR industry data",
    "AR industry data",
  ],
  measurementTechnique:
    "Keyword content analysis of editorial coverage and an aggregated RSS news feed",
};

const breadcrumbs = breadcrumbSchema([
  { name: "Home", url: "https://vr.org" },
  { name: "The State of VR, AR & XR 2026", url: "https://vr.org/state-of-vr-2026" },
]);

const faq = faqPageSchema([
  {
    question: "Is AR overtaking VR in 2026?",
    answer:
      "In news attention, it is getting close. In VR.org's data study, 42% of the 195 stories analyzed between March and July 2026 touched on AR or smart glasses, on a site that is VR-first by name. AR and XR combined now make up 30% of primary coverage, edging out gaming at 25%. And in the live industry feed, AR and smart-glasses coverage climbed from 19% of stories in early June to 26% by mid-July. VR remains the deep immersive platform, but glasses are becoming the mainstream conversation.",
  },
  {
    question: "Which company dominates VR and AR news in 2026?",
    answer:
      "Meta dominates. Across VR.org's 195 original stories from March 14 to July 12, 2026, 38% referenced Meta or the Quest platform, far ahead of any other company. In a 151-story snapshot of 36 monitored sources taken July 12, 2026, Meta led 28% of coverage. No other company comes close to Meta's share of the VR and AR conversation.",
  },
  {
    question: "What is the second most-covered XR platform after Meta?",
    answer:
      "Google's Android XR. It appeared in 24% of VR.org's stories, ahead of Valve and Steam at 19% and Apple's Vision Pro at 16%. The Samsung Galaxy XR rollout, the Android XR developer SDK, and the run-up to Galaxy Unpacked on July 22 kept Google's platform at the center of the year's most active storyline.",
  },
  {
    question: "How was this VR and AR data study conducted?",
    answer:
      "VR.org analyzed two datasets: its own 195 original stories published between March 14 and July 12, 2026, and a snapshot of 151 stories aggregated on July 12, 2026 from 36 monitored VR-native and general-tech news sources. Company and topic share of voice was measured by keyword content analysis of titles, summaries, and tags. Figures reflect news coverage volume, which is a proxy for industry attention rather than sales or installed base.",
  },
]);

const SOV_MAX = 38;
const CAT_MAX = 25;
const TREND_MAX = 51;

export default function StateOfVR2026Page() {
  return (
    <>
      <StructuredData data={articleSchema} />
      <StructuredData data={breadcrumbs} />
      <StructuredData data={datasetSchema} />
      <StructuredData data={faq} />
      <Header articleCount={0} lastUpdated="" />

      <main
        className="max-w-[760px] mx-auto px-6 py-16"
        style={{ color: "var(--text-primary)" }}
      >
        <p
          className="font-mono text-[11px] font-bold uppercase tracking-[2px] mb-3"
          style={{ color: "var(--accent-cyan)" }}
        >
          VR.org Data Study
        </p>
        <h1
          className="font-display text-4xl font-bold mb-3"
          style={{ letterSpacing: "-0.5px" }}
        >
          The State of VR, AR &amp; XR 2026
        </h1>
        <p className="text-sm mb-8" style={{ color: "var(--text-muted)" }}>
          Original research by VR.org &middot; Updated July 12, 2026 &middot;
          Data: March 14 to July 12, 2026
        </p>

        {/* Definitional lede */}
        <p
          className="text-[16px] leading-[1.7] mb-8"
          style={{ color: "var(--text-secondary)" }}
        >
          We analyzed all 195 stories VR.org has published since mid-March,
          plus a snapshot of 151 stories across the 36 VR and tech sources we
          monitor, to measure what the VR, AR, and XR industry is actually
          talking about in 2026. The short version: the headset is no longer
          the whole story. Meta still owns the conversation, but 42% of
          coverage now touches AR and smart glasses, and the glasses share of
          the industry-wide feed has been climbing all summer.
        </p>

        {/* Key findings cards */}
        <div className="grid grid-cols-2 gap-3 mb-10">
          {[
            { stat: "42%", label: "of stories touch AR or smart glasses. Glasses are now nearly half the conversation" },
            { stat: "38%", label: "of coverage references Meta or Quest, still the dominant voice in VR and AR" },
            { stat: "#2", label: "Google's Android XR is the most-covered platform after Meta (24%)" },
            { stat: "195", label: "VR.org original stories analyzed, across 36 monitored VR and tech sources" },
          ].map((c) => (
            <div
              key={c.stat}
              className="rounded-[12px] border p-5"
              style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
            >
              <div
                className="font-display text-[34px] font-bold leading-none mb-2"
                style={{ color: "var(--accent-cyan)" }}
              >
                {c.stat}
              </div>
              <div className="text-[13px] leading-[1.5]" style={{ color: "var(--text-secondary)" }}>
                {c.label}
              </div>
            </div>
          ))}
        </div>

        <h2 className="font-display text-2xl font-bold mt-12 mb-3">
          1. The pivot to AR and smart glasses is the story of 2026
        </h2>
        <p className="text-[15px] leading-[1.7] mb-4" style={{ color: "var(--text-secondary)" }}>
          The single most striking finding: 42% of our stories touched on AR or
          smart glasses, on a site that is VR-first by name and history.
          Ray-Ban Meta&apos;s runaway success, Snap opening preorders for its
          $2,195 Spectacles, XREAL undercutting everyone at $299, Even
          Realities hitting a $1 billion valuation, and a steady drumbeat of
          Android XR news have pulled the industry&apos;s attention toward
          lightweight glasses you would actually wear in public. VR remains
          the deep, immersive experience nothing else can match; AR is
          becoming the thing people wear every day. You can see this play out
          in our{" "}
          <a
            href="/ar-glasses"
            className="no-underline hover:underline"
            style={{ color: "var(--accent-cyan)" }}
          >
            best AR glasses guide
          </a>
          .
        </p>
        <p className="text-[15px] leading-[1.7] mb-5" style={{ color: "var(--text-secondary)" }}>
          It is not a spike, either. Month by month, AR and smart glasses have
          never dipped below a third of our coverage, and they peaked at just
          over half in May as AWE season ramped up.
        </p>
        <div className="my-6">
          <StatBar label="March (from Mar 14)" value={38} max={TREND_MAX} color="var(--accent-magenta)" />
          <StatBar label="April" value={33} max={TREND_MAX} color="var(--accent-magenta)" />
          <StatBar label="May" value={51} max={TREND_MAX} color="var(--accent-magenta)" />
          <StatBar label="June" value={38} max={TREND_MAX} color="var(--accent-magenta)" />
          <StatBar label="July (through Jul 12)" value={43} max={TREND_MAX} color="var(--accent-magenta)" />
        </div>
        <p className="text-[12px] leading-[1.5] mb-2" style={{ color: "var(--text-muted)" }}>
          Share of each month&apos;s VR.org stories touching AR or smart
          glasses. March and July are partial months.
        </p>

        <h2 className="font-display text-2xl font-bold mt-12 mb-3">
          2. Meta still owns the conversation
        </h2>
        <p className="text-[15px] leading-[1.7] mb-5" style={{ color: "var(--text-secondary)" }}>
          Across the 195 stories VR.org published from mid-March to mid-July
          2026, Meta or its Quest platform appeared in 38% of them, more than
          the next two companies combined. Whatever the headlines say about a
          maturing market, Meta remains the gravitational center of both VR
          and AR: Quest on the headset side, Ray-Ban Meta on the glasses side.
          Apple&apos;s 16%, by contrast, came largely from retreat news, a
          gutted headset roadmap, a cancelled cheap Vision Pro display, and a
          hardware chief poached by OpenAI, with two pairs of glasses the only
          survivors on its roadmap. The chart below shows the share of stories
          that referenced each company.
        </p>
        <div className="my-6">
          <StatBar label="Meta / Quest" value={38} max={SOV_MAX} />
          <StatBar label="Google / Android XR" value={24} max={SOV_MAX} color="var(--accent-green)" />
          <StatBar label="Valve / Steam" value={19} max={SOV_MAX} color="var(--accent-green)" />
          <StatBar label="Apple / Vision Pro" value={16} max={SOV_MAX} color="var(--accent-magenta)" />
          <StatBar label="Samsung" value={9} max={SOV_MAX} color="var(--accent-magenta)" />
          <StatBar label="Sony / PSVR2" value={9} max={SOV_MAX} color="var(--accent-magenta)" />
        </div>
        <p className="text-[12px] leading-[1.5] mb-2" style={{ color: "var(--text-muted)" }}>
          Share of voice: percentage of VR.org stories (n=195) referencing each company.
        </p>

        <div className="my-8">
          <AdSlot slot={AD_SLOTS.pillar} format="horizontal" />
        </div>

        <h2 className="font-display text-2xl font-bold mt-12 mb-3">
          3. Google&apos;s Android XR is the breakout platform
        </h2>
        <p className="text-[15px] leading-[1.7] mb-5" style={{ color: "var(--text-secondary)" }}>
          A year ago, Android XR barely registered. In our 2026 data it is the
          second most-covered platform after Meta, appearing in 24% of
          stories, ahead of Valve at 19% and Apple&apos;s Vision Pro at 16%.
          The Samsung Galaxy XR&apos;s international rollout, the Android XR
          developer SDK, and teardowns hinting at how apps will work on
          Android XR glasses kept Google&apos;s platform at the center of the
          year&apos;s most active storyline, with Galaxy Unpacked on July 22
          shaping up as its next big moment. If Meta is the present of
          consumer XR, Android XR is making the strongest case to be its
          future rival.
        </p>

        <h2 className="font-display text-2xl font-bold mt-12 mb-3">
          4. What the industry is actually talking about
        </h2>
        <p className="text-[15px] leading-[1.7] mb-5" style={{ color: "var(--text-secondary)" }}>
          Gaming remains the largest single category at 25% of coverage, but
          it no longer dominates the way it once did. Put AR and XR together
          and they now account for 30% of primary coverage, edging out gaming
          for the first time. The industry has matured past being purely a
          games platform into a broader computing story, and the data shows
          it.
        </p>
        <div className="my-6">
          <StatBar label="Gaming" value={25} max={CAT_MAX} />
          <StatBar label="Hardware" value={18} max={CAT_MAX} />
          <StatBar label="Software" value={17} max={CAT_MAX} color="var(--accent-green)" />
          <StatBar label="AR" value={16} max={CAT_MAX} color="var(--accent-magenta)" />
          <StatBar label="XR" value={14} max={CAT_MAX} color="var(--accent-magenta)" />
          <StatBar label="Enterprise" value={8} max={CAT_MAX} color="var(--accent-green)" />
        </div>
        <p className="text-[12px] leading-[1.5] mb-2" style={{ color: "var(--text-muted)" }}>
          Topic mix: share of VR.org stories (n=195) by primary category.
        </p>

        <h2 className="font-display text-2xl font-bold mt-12 mb-3">
          5. Steam Frame went from rumor to freight in one quarter
        </h2>
        <p className="text-[15px] leading-[1.7] mb-5" style={{ color: "var(--text-secondary)" }}>
          Valve and Steam turned up in 19% of stories despite Valve having no
          new shipping headset all period. When we first published this study
          in June, the Steam Frame was pure anticipation. Since then the
          signals have turned physical: FCC filings, dozens of tons of
          headsets logged in shipping manifests, and the Steam Machine
          landing at $1,049 on June 30 to set a price ceiling for the headset
          that follows it. What Valve still has not shown is a launch game,
          and that is now the biggest open question in PC VR. Few companies
          could hold a fifth of the conversation with an unreleased product;
          Valve is doing it while barely saying a word.
        </p>

        {/* Live pulse box */}
        <div
          className="rounded-[12px] border p-6 my-10"
          style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
        >
          <div
            className="font-mono text-[10px] font-bold uppercase tracking-[1.5px] mb-3"
            style={{ color: "var(--accent-green)" }}
          >
            The live pulse
          </div>
          <p className="text-[14px] leading-[1.65]" style={{ color: "var(--text-secondary)" }}>
            As a check on the four-month picture, we snapshotted the live feed
            on July 12, 2026: 151 recent stories across our monitored sources.
            Meta led 28% of stories, and AR or smart-glasses coverage made up
            26%, up from 19% in our June 4 snapshot. UploadVR, UC Today XR,
            Auganix, The Ghost Howls, Road to VR, and AR Insider were the most
            active sources. The glasses shift is not a one-off spike in our
            own coverage; the whole industry feed is moving the same
            direction.
          </p>
        </div>

        <h2 className="font-display text-2xl font-bold mt-12 mb-3">
          Methodology
        </h2>
        <p className="text-[14px] leading-[1.7] mb-4" style={{ color: "var(--text-secondary)" }}>
          This study draws on two datasets. The primary dataset is the 195
          original articles VR.org published between March 14 and July 12,
          2026. The secondary dataset is a snapshot of 151 stories aggregated
          on July 12, 2026 from the 36 VR-native and general-tech sources
          VR.org monitors. Company and topic share of voice was measured by
          keyword content analysis of each story&apos;s title, summary, and
          tags; a story can reference more than one company, so shares do not
          sum to 100%. These figures measure news coverage volume, which is a
          proxy for industry attention and momentum, not for unit sales or
          installed base. The study was first published on June 4, 2026 and
          all figures were recomputed from the full dataset on July 12, 2026.
          We publish the methodology in full so the numbers can be checked and
          cited with confidence.
        </p>

        {/* Cite this study */}
        <div
          className="rounded-[12px] border p-6 my-10"
          style={{ background: "var(--bg-secondary)", borderColor: "var(--border)" }}
        >
          <div
            className="font-display text-[13px] font-semibold uppercase tracking-[2px] mb-3"
            style={{ color: "var(--accent-cyan)" }}
          >
            Cite this study
          </div>
          <p className="text-[13px] leading-[1.6] mb-3" style={{ color: "var(--text-secondary)" }}>
            This research is free to cite and republish with attribution
            (CC BY 4.0). Please credit VR.org and link to this page.
          </p>
          <p
            className="text-[12.5px] leading-[1.6] font-mono p-3 rounded-[8px]"
            style={{ background: "var(--bg-card)", color: "var(--text-muted)" }}
          >
            VR.org. &quot;The State of VR, AR &amp; XR 2026: A News Data
            Study.&quot; June 2026, updated July 2026.
            https://vr.org/state-of-vr-2026
          </p>
        </div>

        <h2 className="font-display text-2xl font-bold mt-12 mb-6">
          Frequently Asked Questions
        </h2>

        <h3 className="font-display text-xl font-semibold mb-3">
          Is AR overtaking VR in 2026?
        </h3>
        <p className="text-[15px] leading-[1.7] mb-6" style={{ color: "var(--text-secondary)" }}>
          In news attention, it is getting close. 42% of the stories in this
          study touched on AR or smart glasses, AR and XR combined now edge
          out gaming as the biggest slice of primary coverage, and the live
          feed&apos;s glasses share climbed from 19% to 26% between June and
          July. VR remains the deep immersive platform; glasses are becoming
          the mainstream conversation.
        </p>

        <h3 className="font-display text-xl font-semibold mb-3">
          Which company dominates VR and AR news in 2026?
        </h3>
        <p className="text-[15px] leading-[1.7] mb-6" style={{ color: "var(--text-secondary)" }}>
          Meta. Across VR.org&apos;s 195 original stories from March to July
          2026, 38% referenced Meta or the Quest platform, far ahead of any
          other company, and Meta led 28% of a 151-story feed snapshot taken
          July 12. No other company comes close to Meta&apos;s share of the
          conversation.
        </p>

        <h3 className="font-display text-xl font-semibold mb-3">
          What is the second most-covered XR platform after Meta?
        </h3>
        <p className="text-[15px] leading-[1.7] mb-8" style={{ color: "var(--text-secondary)" }}>
          Google&apos;s Android XR, which appeared in 24% of stories, ahead of
          Valve and Steam at 19% and Apple&apos;s Vision Pro at 16%. It was
          driven by the Samsung Galaxy XR rollout, the Android XR developer
          SDK, and the run-up to Galaxy Unpacked on July 22.
        </p>

        <RecentArticles heading="Latest from VR.org" limit={4} />
        <AllPillarGuides heading="VR.org Guides" />
      </main>

      <Footer />
    </>
  );
}
