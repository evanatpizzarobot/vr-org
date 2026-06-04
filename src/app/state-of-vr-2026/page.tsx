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
  title: "The State of VR & AR 2026: A News Data Study | VR.org",
  description:
    "An original VR.org data study of 130 stories across 36 monitored sources. Meta still owns 40% of VR coverage, but 44% of the conversation has shifted to AR and smart glasses. The data on where VR is headed in 2026.",
  openGraph: {
    title: "The State of VR & AR 2026: A News Data Study | VR.org",
    description:
      "Meta leads 40% of VR coverage, but 44% of the conversation has moved to AR and smart glasses. VR.org's original data study of the VR/AR industry in 2026.",
    url: "https://vr.org/state-of-vr-2026",
    siteName: "VR.org",
    images: [
      {
        url: "https://vr.org/og-image.png",
        width: 1200,
        height: 630,
        alt: "The State of VR & AR 2026 - VR.org Data Study",
      },
    ],
  },
  twitter: {
    card: "summary_large_image" as const,
    title: "The State of VR & AR 2026: A News Data Study | VR.org",
    description:
      "Meta leads 40% of VR coverage, but 44% of the conversation has moved to AR and smart glasses. VR.org's original data study.",
    images: ["https://vr.org/og-image.png"],
  },
  alternates: {
    canonical: "https://vr.org/state-of-vr-2026",
  },
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "The State of VR & AR 2026: A News Data Study",
  datePublished: "2026-06-04",
  dateModified: "2026-06-04",
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
  name: "The State of VR & AR 2026: VR.org News Data Study",
  description:
    "A content analysis of 130 VR.org original stories (March 14 to June 4, 2026) and a 139-story snapshot across 36 monitored VR and tech news sources, measuring company share of voice, topic mix, and the shift toward AR and smart glasses.",
  url: "https://vr.org/state-of-vr-2026",
  creator: { "@type": "Organization", name: "VR.org", url: "https://vr.org" },
  publisher: { "@type": "Organization", name: "VR.org", url: "https://vr.org" },
  datePublished: "2026-06-04",
  temporalCoverage: "2026-03-14/2026-06-04",
  license: "https://creativecommons.org/licenses/by/4.0/",
  keywords: [
    "virtual reality",
    "augmented reality",
    "XR",
    "Meta Quest",
    "Android XR",
    "smart glasses",
    "VR industry data",
  ],
  measurementTechnique:
    "Keyword content analysis of editorial coverage and an aggregated RSS news feed",
};

const breadcrumbs = breadcrumbSchema([
  { name: "Home", url: "https://vr.org" },
  { name: "The State of VR 2026", url: "https://vr.org/state-of-vr-2026" },
]);

const faq = faqPageSchema([
  {
    question: "Which company dominates VR news in 2026?",
    answer:
      "Meta dominates VR news in 2026. Across VR.org's 130 original stories from March to June 2026, 40% referenced Meta or the Quest platform, far ahead of any other company. In a same-period snapshot of 139 stories across 36 monitored sources, Meta led 32% of coverage. No other company comes close to Meta's share of the VR conversation.",
  },
  {
    question: "Is VR shifting toward AR and smart glasses?",
    answer:
      "Yes, clearly. In VR.org's data study, 44% of the 130 stories analyzed touched on AR or smart glasses, nearly half of all coverage, despite the site being VR-first. Driven by Ray-Ban Meta, Samsung's Galaxy XR and Galaxy Glasses, and Google's Android XR, the industry's center of gravity is visibly moving from immersive headsets toward lightweight glasses.",
  },
  {
    question: "What is the second most-covered VR platform after Meta?",
    answer:
      "Google's Android XR is the breakout second platform. In VR.org's coverage it appeared in 26% of stories, ahead of Apple's Vision Pro at 13%, driven by the launch of the Samsung Galaxy XR, the Android XR developer SDK, and Galaxy Glasses. A year ago Android XR barely registered; in 2026 it is the most-discussed platform after Meta.",
  },
  {
    question: "How was this VR data study conducted?",
    answer:
      "VR.org analyzed two datasets: its own 130 original stories published between March 14 and June 4, 2026, and a snapshot of 139 stories aggregated from 36 monitored VR-native and general-tech news sources. Company and topic share of voice was measured by keyword content analysis of titles, summaries, and tags. Figures reflect news coverage volume, which is a proxy for industry attention rather than sales or installed base.",
  },
]);

const SOV_MAX = 40;
const CAT_MAX = 25;

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
          The State of VR &amp; AR 2026
        </h1>
        <p className="text-sm mb-8" style={{ color: "var(--text-muted)" }}>
          Original research by VR.org &middot; Data through June 4, 2026
        </p>

        {/* Definitional lede */}
        <p
          className="text-[16px] leading-[1.7] mb-8"
          style={{ color: "var(--text-secondary)" }}
        >
          We analyzed 130 stories VR.org published over three months, plus a
          snapshot of 139 stories across the 36 VR and tech sources we monitor, to
          measure what the VR and AR industry is actually talking about in 2026.
          The short version: Meta still owns the conversation, but nearly half of
          it has already moved to AR and smart glasses.
        </p>

        {/* Key findings cards */}
        <div className="grid grid-cols-2 gap-3 mb-10">
          {[
            { stat: "40%", label: "of VR coverage references Meta or Quest, still the dominant voice in VR" },
            { stat: "44%", label: "of stories touch AR or smart glasses, the pivot is already here" },
            { stat: "#2", label: "Google's Android XR is now the most-covered platform after Meta (26%)" },
            { stat: "36", label: "VR-native and tech news sources monitored for this study" },
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
          1. Meta still owns the conversation
        </h2>
        <p className="text-[15px] leading-[1.7] mb-5" style={{ color: "var(--text-secondary)" }}>
          Across the 130 stories VR.org published from mid-March to early June
          2026, Meta or its Quest platform appeared in 40% of them, more than the
          next two companies combined. Whatever the headlines say about a maturing
          market, Meta remains the gravitational center of VR. The chart below
          shows the share of stories that referenced each company.
        </p>
        <div className="my-6">
          <StatBar label="Meta / Quest" value={40} max={SOV_MAX} />
          <StatBar label="Google / Android XR" value={26} max={SOV_MAX} color="var(--accent-green)" />
          <StatBar label="Valve / Steam" value={20} max={SOV_MAX} color="var(--accent-green)" />
          <StatBar label="Apple / Vision Pro" value={13} max={SOV_MAX} color="var(--accent-magenta)" />
          <StatBar label="Samsung" value={11} max={SOV_MAX} color="var(--accent-magenta)" />
          <StatBar label="Sony / PSVR2" value={8} max={SOV_MAX} color="var(--accent-magenta)" />
        </div>
        <p className="text-[12px] leading-[1.5] mb-2" style={{ color: "var(--text-muted)" }}>
          Share of voice: percentage of VR.org stories (n=130) referencing each company.
        </p>

        <h2 className="font-display text-2xl font-bold mt-12 mb-3">
          2. The pivot to AR and smart glasses is already here
        </h2>
        <p className="text-[15px] leading-[1.7] mb-4" style={{ color: "var(--text-secondary)" }}>
          The single most striking finding: 44% of stories, nearly half, touched
          on AR or smart glasses, on a site that is VR-first by name and history.
          Ray-Ban Meta&apos;s runaway success, Samsung&apos;s Galaxy XR and Galaxy
          Glasses, and a steady drumbeat of Android XR news have pulled the
          industry&apos;s attention toward lightweight glasses you would actually
          wear in public. The immersive headset is no longer the only story in
          spatial computing, and in 2026 it may not even be the biggest one. You
          can see this play out in our{" "}
          <a
            href="/ar-glasses"
            className="no-underline hover:underline"
            style={{ color: "var(--accent-cyan)" }}
          >
            best AR glasses guide
          </a>
          .
        </p>

        <div className="my-8">
          <AdSlot slot={AD_SLOTS.pillar} format="horizontal" />
        </div>

        <h2 className="font-display text-2xl font-bold mt-12 mb-3">
          3. Google&apos;s Android XR is the breakout platform
        </h2>
        <p className="text-[15px] leading-[1.7] mb-5" style={{ color: "var(--text-secondary)" }}>
          A year ago, Android XR barely registered. In our 2026 data it is the
          second most-covered platform after Meta, appearing in 26% of stories,
          ahead of Apple&apos;s Vision Pro at 13%. The launch of the Samsung
          Galaxy XR, the Android XR developer SDK, and the Galaxy Glasses tease put
          Google&apos;s platform at the center of the year&apos;s most active
          storyline. If Meta is the present of consumer XR, Android XR is making
          the strongest case to be its future rival.
        </p>

        <h2 className="font-display text-2xl font-bold mt-12 mb-3">
          4. What VR is actually talking about
        </h2>
        <p className="text-[15px] leading-[1.7] mb-5" style={{ color: "var(--text-secondary)" }}>
          Gaming remains the largest single category at 25% of coverage, but it no
          longer dominates the way it once did. Hardware, AR, and XR together make
          up the real center of gravity, a sign of an industry that has matured
          past being purely a games platform into a broader computing story.
        </p>
        <div className="my-6">
          <StatBar label="Gaming" value={25} max={CAT_MAX} />
          <StatBar label="Hardware" value={19} max={CAT_MAX} />
          <StatBar label="AR" value={18} max={CAT_MAX} color="var(--accent-magenta)" />
          <StatBar label="Software" value={15} max={CAT_MAX} color="var(--accent-green)" />
          <StatBar label="XR" value={12} max={CAT_MAX} color="var(--accent-magenta)" />
          <StatBar label="Enterprise" value={10} max={CAT_MAX} color="var(--accent-green)" />
        </div>
        <p className="text-[12px] leading-[1.5] mb-2" style={{ color: "var(--text-muted)" }}>
          Topic mix: share of VR.org stories (n=130) by primary category.
        </p>

        <h2 className="font-display text-2xl font-bold mt-12 mb-3">
          5. Valve&apos;s Steam Frame is the most-anticipated thing nobody can buy
        </h2>
        <p className="text-[15px] leading-[1.7] mb-5" style={{ color: "var(--text-secondary)" }}>
          Valve and Steam VR turned up in 20% of stories despite Valve having no
          new shipping headset all period. That is the signature of pent-up
          anticipation: the rumored Steam Frame generated a fifth of all coverage
          purely on the strength of what it might be. For a company with one
          aging, discontinued headset, that is a remarkable hold on the
          community&apos;s imagination, and a reminder of how much room there still
          is for a credible PC VR challenger.
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
            As a check on the three-month picture, we snapshotted the live feed on
            June 4, 2026: 139 recent stories across our monitored sources. The
            current pulse tracks the trend, Meta led 32% of stories and AR or
            smart-glasses coverage made up 19%, with UploadVR, Auganix, UC Today
            XR, Road to VR, and AR Insider the most active sources. The shift is
            not a one-off spike; it is the steady state of VR news in 2026.
          </p>
        </div>

        <h2 className="font-display text-2xl font-bold mt-12 mb-3">
          Methodology
        </h2>
        <p className="text-[14px] leading-[1.7] mb-4" style={{ color: "var(--text-secondary)" }}>
          This study draws on two datasets. The primary dataset is the 130
          original articles VR.org published between March 14 and June 4, 2026.
          The secondary dataset is a snapshot of 139 stories aggregated on June 4,
          2026 from the 36 VR-native and general-tech sources VR.org monitors.
          Company and topic share of voice was measured by keyword content
          analysis of each story&apos;s title, summary, and tags; a story can
          reference more than one company, so shares do not sum to 100%. These
          figures measure news coverage volume, which is a proxy for industry
          attention and momentum, not for unit sales or installed base. We publish
          the methodology in full so the numbers can be checked and cited with
          confidence.
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
            VR.org. &quot;The State of VR &amp; AR 2026: A News Data Study.&quot;
            June 2026. https://vr.org/state-of-vr-2026
          </p>
        </div>

        <h2 className="font-display text-2xl font-bold mt-12 mb-6">
          Frequently Asked Questions
        </h2>

        <h3 className="font-display text-xl font-semibold mb-3">
          Which company dominates VR news in 2026?
        </h3>
        <p className="text-[15px] leading-[1.7] mb-6" style={{ color: "var(--text-secondary)" }}>
          Meta. Across VR.org&apos;s 130 original stories from March to June 2026,
          40% referenced Meta or the Quest platform, far ahead of any other
          company, and Meta led 32% of a same-period 139-story feed snapshot. No
          other company comes close to Meta&apos;s share of the VR conversation.
        </p>

        <h3 className="font-display text-xl font-semibold mb-3">
          Is VR shifting toward AR and smart glasses?
        </h3>
        <p className="text-[15px] leading-[1.7] mb-6" style={{ color: "var(--text-secondary)" }}>
          Yes. In this study, 44% of stories touched on AR or smart glasses,
          nearly half of all coverage, driven by Ray-Ban Meta, Samsung&apos;s
          Galaxy XR and Galaxy Glasses, and Google&apos;s Android XR. The
          industry&apos;s center of gravity is visibly moving from immersive
          headsets toward lightweight glasses.
        </p>

        <h3 className="font-display text-xl font-semibold mb-3">
          What is the second most-covered VR platform after Meta?
        </h3>
        <p className="text-[15px] leading-[1.7] mb-8" style={{ color: "var(--text-secondary)" }}>
          Google&apos;s Android XR, which appeared in 26% of stories, ahead of
          Apple&apos;s Vision Pro at 13%. It was driven by the Samsung Galaxy XR
          launch, the Android XR developer SDK, and Galaxy Glasses.
        </p>

        <RecentArticles heading="Latest from VR.org" limit={4} />
        <AllPillarGuides heading="VR.org Guides" />
      </main>

      <Footer />
    </>
  );
}
