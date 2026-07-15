import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
  StructuredData,
  breadcrumbSchema,
  faqPageSchema,
} from "@/components/StructuredData";

export const metadata = {
  title: "Advertise on VR.org | Sponsorships & Ad Placements",
  description:
    "Reach an engaged VR, AR, and XR audience. VR.org offers homepage and buyer-guide placements, sponsored content, newsletter sponsorships, and direct brand partnerships. Contact us for the media kit.",
  alternates: {
    canonical: "https://vr.org/advertise",
  },
  openGraph: {
    title: "Advertise on VR.org | Sponsorships & Ad Placements",
    description:
      "Reach an engaged VR, AR, and XR audience. Display placements, sponsored content, and direct brand partnerships on the web's two-letter home for immersive tech.",
    url: "https://vr.org/advertise",
    siteName: "VR.org",
    images: [{ url: "https://vr.org/og-image.png", width: 1200, height: 630 }],
  },
};

const WHY = [
  {
    title: "A category name people trust",
    body: "VR.org is a premium two-letter domain and a dedicated VR, AR, and XR newsroom. Google's AI Overview has named us among the top dedicated VR news sites, alongside Road to VR and UploadVR. Your brand sits in credible company.",
  },
  {
    title: "An engaged, on-topic audience",
    body: "Our readers are here for one thing: virtual, augmented, and extended reality. Enthusiasts, early adopters, developers, and industry professionals, not a general-tech crowd you have to filter down.",
  },
  {
    title: "Buyer intent, not just reach",
    body: "Our best-of and buyer guides are a top traffic driver. Readers land on them while actively comparing headsets, glasses, and gear to buy, the highest-intent moment in the funnel for a hardware brand.",
  },
  {
    title: "Brand-safe by design",
    body: "Every placement is clearly labeled and non-intrusive. No pop-ups, no auto-play, no interstitials. Your message appears in a clean, considered environment that respects the reader.",
  },
];

const WAYS = [
  {
    title: "Display placements",
    body: "A flagship homepage banner, leaderboards on the high-intent buyer guides, a native in-feed card, and a sidebar unit that runs across the site. Sized to your creative or designed by us.",
  },
  {
    title: "Sponsored content",
    body: "A professionally written, clearly labeled sponsored article that stays live permanently, with disclosed rel=sponsored links. Tell your story to a purely VR, AR, and XR audience.",
  },
  {
    title: "Newsletter sponsorship",
    body: "Put your logo and a single sponsor line in This Week in VR, our Friday roundup of the week's biggest stories, delivered to subscribers and published on site.",
  },
  {
    title: "Direct brand partnership",
    body: "A permanent, prominent sponsor presence in the spirit of our infrastructure partner NetActuate. Best for companies that want an ongoing association with VR.org rather than a single campaign.",
  },
];

const STANDARDS = [
  "Every paid placement is clearly labeled as sponsored.",
  "Outbound sponsor links use rel=sponsored.",
  "No pop-ups, auto-play, or interstitial ads, ever.",
  "Editorial coverage is independent and is never for sale. Sponsored posts are disclosed and kept separate from newsroom articles.",
];

const AUDIENCE = [
  "Headset and smart-glasses makers",
  "VR and AR game studios and publishers",
  "Platform, engine, and developer-tool companies",
  "Enterprise and training XR providers",
  "Events, expos, and industry conferences",
];

const FAQ = [
  {
    question: "Does VR.org accept advertising and sponsorships?",
    answer:
      "Yes. VR.org offers display ad placements, clearly labeled sponsored content, newsletter sponsorships, and direct brand partnerships. Email advertise@vr.org to start a conversation and receive our media kit.",
  },
  {
    question: "What ad placements are available on VR.org?",
    answer:
      "A flagship homepage banner, leaderboard banners on our buyer guides, a native in-feed card, and a site-wide sidebar unit, plus sponsored articles and newsletter sponsorships. Our media kit shows each placement in its exact spot on the page.",
  },
  {
    question: "Do you offer sponsored content?",
    answer:
      "Yes. We produce clearly labeled, disclosed sponsored posts that stay live permanently with rel=sponsored links. Editorial coverage stays independent and is never for sale.",
  },
  {
    question: "How do I get rates and a media kit?",
    answer:
      "Email advertise@vr.org and we will send the full media kit with every placement, specifications, and current rates. Custom packages and category exclusivity are available.",
  },
  {
    question: "Who is the VR.org audience?",
    answer:
      "An engaged, on-topic audience of virtual, augmented, and extended reality enthusiasts, early adopters, developers, and industry professionals. Our best-of buyer guides in particular reach readers who are actively researching a purchase.",
  },
];

export default function AdvertisePage() {
  return (
    <>
      <StructuredData
        data={breadcrumbSchema([
          { name: "VR.org", url: "https://vr.org" },
          { name: "Advertise", url: "https://vr.org/advertise" },
        ])}
      />
      <StructuredData data={faqPageSchema(FAQ)} />
      <Header articleCount={0} lastUpdated="" />

      <main
        className="max-w-[860px] mx-auto px-6 py-16"
        style={{ color: "var(--text-primary)" }}
      >
        <div
          className="font-mono text-[11px] font-semibold uppercase tracking-[2px] mb-3"
          style={{ color: "var(--accent-cyan)" }}
        >
          Partner with VR.org
        </div>
        <h1
          className="font-display text-4xl font-bold mb-4"
          style={{ letterSpacing: "-0.5px" }}
        >
          Advertise on VR.org
        </h1>
        <p
          className="text-[16px] leading-[1.7] mb-6"
          style={{ color: "var(--text-secondary)" }}
        >
          VR.org is the two-letter home for virtual, augmented, and extended
          reality. We pair a real-time newsroom with buyer guides that people
          read right before they buy, which puts your brand in front of an
          audience that is already leaning in. If you sell to the VR, AR, or XR
          world, this is where they are already paying attention.
        </p>

        <div className="flex flex-wrap items-center gap-4 mb-14">
          <a href="mailto:advertise@vr.org" className="btn btn-primary">
            Get in touch &rarr;
          </a>
          <span className="text-[13px]" style={{ color: "var(--text-muted)" }}>
            Tell us a little about your goals and we will send the full media kit.
          </span>
        </div>

        <h2 className="font-display text-2xl font-semibold mb-5">
          Why advertise on VR.org
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-14">
          {WHY.map((item) => (
            <div
              key={item.title}
              className="rounded-[12px] border p-5"
              style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
            >
              <div
                className="font-display text-[15px] font-semibold mb-2"
                style={{ color: "var(--text-primary)" }}
              >
                {item.title}
              </div>
              <p
                className="text-[13.5px] leading-[1.6] m-0"
                style={{ color: "var(--text-secondary)" }}
              >
                {item.body}
              </p>
            </div>
          ))}
        </div>

        <h2 className="font-display text-2xl font-semibold mb-3">
          Ways to partner
        </h2>
        <p
          className="text-[15px] leading-[1.7] mb-5"
          style={{ color: "var(--text-secondary)" }}
        >
          Pick the fit for your campaign, or mix a few. We keep rates out of this
          page on purpose, so reach out and we will match a package to your goals.
        </p>
        <div className="flex flex-col gap-3 mb-6">
          {WAYS.map((item) => (
            <div
              key={item.title}
              className="rounded-[12px] border p-5"
              style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
            >
              <div
                className="font-display text-[15px] font-semibold mb-1.5"
                style={{ color: "var(--text-primary)" }}
              >
                {item.title}
              </div>
              <p
                className="text-[13.5px] leading-[1.6] m-0"
                style={{ color: "var(--text-secondary)" }}
              >
                {item.body}
              </p>
            </div>
          ))}
        </div>
        <p
          className="text-[14px] leading-[1.7] mb-14"
          style={{ color: "var(--text-muted)" }}
        >
          Request our media kit for every placement, its specifications, and
          current rates.
        </p>

        <h2 className="font-display text-2xl font-semibold mb-5">
          Our standards
        </h2>
        <ul
          className="text-[15px] leading-[1.7] mb-14 list-disc pl-6 flex flex-col gap-2"
          style={{ color: "var(--text-secondary)" }}
        >
          {STANDARDS.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>

        <h2 className="font-display text-2xl font-semibold mb-4">
          A fit for
        </h2>
        <div className="flex flex-wrap gap-2.5 mb-14">
          {AUDIENCE.map((a) => (
            <span
              key={a}
              className="rounded-full border px-3.5 py-1.5 text-[13px]"
              style={{
                background: "var(--bg-card)",
                borderColor: "var(--border)",
                color: "var(--text-secondary)",
              }}
            >
              {a}
            </span>
          ))}
        </div>

        <h2 className="font-display text-2xl font-semibold mb-5">
          Frequently asked questions
        </h2>
        <div className="flex flex-col gap-5 mb-14">
          {FAQ.map((item) => (
            <div key={item.question}>
              <div
                className="font-display text-[15px] font-semibold mb-1.5"
                style={{ color: "var(--text-primary)" }}
              >
                {item.question}
              </div>
              <p
                className="text-[14px] leading-[1.7] m-0"
                style={{ color: "var(--text-secondary)" }}
              >
                {item.answer}
              </p>
            </div>
          ))}
        </div>

        <div
          className="rounded-[14px] border p-8 text-center"
          style={{
            background: "var(--bg-card)",
            borderColor: "var(--border)",
          }}
        >
          <h2 className="font-display text-2xl font-semibold mb-2">
            Ready to reach the VR, AR &amp; XR audience?
          </h2>
          <p
            className="text-[15px] leading-[1.7] mb-6 max-w-[520px] mx-auto"
            style={{ color: "var(--text-secondary)" }}
          >
            Send us a note about your brand and what you want to achieve. We will
            reply with the media kit and a package that fits.
          </p>
          <a href="mailto:advertise@vr.org" className="btn btn-primary">
            advertise@vr.org
          </a>
          <p className="text-[12px] mt-5 m-0" style={{ color: "var(--text-muted)" }}>
            Press enquiries:{" "}
            <a
              href="mailto:press@vr.org"
              className="no-underline hover:underline"
              style={{ color: "var(--accent-cyan)" }}
            >
              press@vr.org
            </a>
          </p>
        </div>
      </main>

      <Footer />
    </>
  );
}
