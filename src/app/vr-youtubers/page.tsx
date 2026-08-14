import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
  StructuredData,
  breadcrumbSchema,
  faqPageSchema,
  itemListSchema,
} from "@/components/StructuredData";
import { RecentArticles } from "@/components/RecentArticles";
import { AllPillarGuides } from "@/components/RelatedGuides";
import { AdSlot } from "@/components/AdSlot";
import { AD_SLOTS } from "@/lib/ads";
import { FaqSection } from "@/components/SpokeBlocks";
import {
  getCreators,
  creatorsInBeat,
  creatorsInGroup,
  sortByLastUpload,
  type Creator,
  type CreatorBeat,
} from "@/lib/vr-creators";

// Force per-request rendering so roster edits to data/vr-creators.json (volume
// mounted on the VPS) go live without a Docker rebuild, matching the release
// tracker's no-rebuild refresh design.
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Best VR YouTubers & Creators 2026: Who Still Covers VR | VR.org",
  description:
    "The VR YouTube channels worth following in 2026, verified upload by upload. Nathie, Naysy, Cas and Chary XR, MRTV, Beardo Benjo, and the non-English creators breaking stories first.",
  openGraph: {
    title: "Best VR YouTubers & Creators 2026: Who Still Covers VR | VR.org",
    description:
      "Every channel here was checked against its own upload feed. Who is still covering VR, who moved on, and who broke the story first.",
    url: "https://vr.org/vr-youtubers",
    siteName: "VR.org",
    images: [
      {
        url: "https://vr.org/og-image.png",
        width: 1200,
        height: 630,
        alt: "Best VR YouTubers and Creators 2026 - VR.org",
      },
    ],
  },
  twitter: {
    card: "summary_large_image" as const,
    title: "Best VR YouTubers & Creators 2026: Who Still Covers VR | VR.org",
    description:
      "The VR channels worth following in 2026, verified upload by upload.",
    images: ["https://vr.org/og-image.png"],
  },
  alternates: {
    canonical: "https://vr.org/vr-youtubers",
  },
};

const BEATS: { key: CreatorBeat; title: string; blurb: string }[] = [
  {
    key: "news",
    title: "VR news and general coverage",
    blurb:
      "The channels that decide which stories the rest of the audience hears about, plus the one that does it every week for an audience of nine thousand.",
  },
  {
    key: "games",
    title: "Games, mods, and ports",
    blurb:
      "Where a new VR mod or a PSVR2 release surfaces first. Between them these three cover Quest, PC VR, and PlayStation without much overlap.",
  },
  {
    key: "hardware",
    title: "Headsets and smart glasses",
    blurb:
      "The review bench. Note how much of it is now glasses rather than headsets, which is the shift the whole category is going through.",
  },
  {
    key: "howto",
    title: "Setup, fixes, and getting it running",
    blurb:
      "The unglamorous work of making the hardware do what it promised.",
  },
  {
    key: "fitness",
    title: "VR fitness",
    blurb:
      "Treated as a routine rather than a novelty, which is rarer than it should be.",
  },
  {
    key: "developer",
    title: "For developers",
    blurb:
      "If you are building in Unity or wiring up XR interactions, start here rather than with the consumer channels.",
  },
  {
    key: "international",
    title: "Beyond English",
    blurb:
      "The part of this page most likely to show you something new. The largest VR channel we found anywhere is in this group, and so is the smallest.",
  },
];

function formatDate(iso: string): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

function CreatorCard({ creator }: { creator: Creator }) {
  return (
    <div
      id={creator.id}
      className="py-5 border-t"
      style={{ borderColor: "var(--border)" }}
    >
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-1">
        <a
          href={creator.url}
          target="_blank"
          rel="noopener"
          className="font-display text-lg font-bold no-underline hover:underline"
          style={{ color: "var(--text-primary)" }}
        >
          {creator.name}
        </a>
        <span
          className="font-mono text-[11px]"
          style={{ color: "var(--text-muted)" }}
        >
          {creator.handle}
        </span>
      </div>

      <p
        className="font-mono text-[11px] uppercase tracking-[0.5px] mb-2"
        style={{ color: "var(--text-muted)" }}
      >
        {creator.subsText} subscribers &middot; {creator.videos} videos &middot;{" "}
        {creator.language} &middot; last upload {formatDate(creator.lastUpload)}
      </p>

      <p
        className="text-[14.5px] leading-[1.7]"
        style={{ color: "var(--text-secondary)" }}
      >
        {creator.note}
        {creator.link && (
          <>
            {" "}
            <a
              href={creator.link}
              className="no-underline hover:underline"
              style={{ color: "var(--accent-cyan)" }}
            >
              Our coverage &rarr;
            </a>
          </>
        )}
      </p>
    </div>
  );
}

export default function VRYouTubersPage() {
  const data = getCreators();
  const verified = formatDate(data.lastVerified);
  const dormant = sortByLastUpload(creatorsInGroup(data, "dormant"));
  const offsite = creatorsInGroup(data, "offsite");
  const activeCount = creatorsInGroup(data, "active").length;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "The VR Creators Worth Following in 2026",
    datePublished: "2026-08-14",
    dateModified: data.lastUpdated || "2026-08-14",
    author: { "@type": "Organization", name: "VR.org", url: "https://vr.org" },
    publisher: {
      "@type": "Organization",
      name: "VR.org",
      url: "https://vr.org",
      logo: { "@type": "ImageObject", url: "https://vr.org/logo.png" },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": "https://vr.org/vr-youtubers",
    },
    image: "https://vr.org/og-image.png",
  };

  const breadcrumbs = breadcrumbSchema([
    { name: "Home", url: "https://vr.org" },
    { name: "Originals", url: "https://vr.org/originals" },
    { name: "VR Creators Worth Following", url: "https://vr.org/vr-youtubers" },
  ]);

  const creatorList = itemListSchema(
    "VR Creators Worth Following in 2026",
    data.creators.map((c) => ({ name: c.name, url: c.url }))
  );

  const faq = faqPageSchema([
    {
      question: "Who is the biggest VR YouTuber?",
      answer:
        "In English, Nathie, at roughly 810,000 subscribers and more than 1,500 videos. Globally it is not close: the Spanish-language channel Virtumaniacos has roughly 3.7 million subscribers, more than four times the largest English VR channel, and posts several times a week. Syrmor has a larger subscriber count than Nathie at roughly 1 million, but has published only 139 videos in total and posts a few times a year.",
    },
    {
      question: "Which VR YouTubers are still actively posting in 2026?",
      answer:
        "Nathie, Naysy, Beardo Benjo, Cas and Chary XR, MRTV, Gamertag VR, Without Parole, Fix My Oculus, Tyriel Wood, BMFVR, OtterWorldly, ThisKory, Valem Tutorials, Dilmer Valecillos, Virtumaniacos, VoodooDE VR, Okurasu VR, and SideBook VR had all uploaded within roughly two weeks of this page's last verification. Virtual Reality Oasis, Syrmor, and ThrillSeeker all still have very large audiences but have not posted recently, so they are listed separately with their last upload dates.",
    },
    {
      question: "Why is Virtual Reality Oasis not in the main list?",
      answer:
        "His last upload was November 13, 2025, and the three videos before it are all about the Ready Or Not VR mod he built himself rather than VR coverage. He has roughly 615,000 subscribers and a genuinely useful back catalogue of headset reviews, so he is listed under the section for large channels that have gone quiet. We would rather state the date plainly than either drop him silently or imply he is still publishing.",
    },
    {
      question: "Who broke the Half-Life 2 on Quest 3 standalone story?",
      answer:
        "A Korean channel called SideBook VR, with 568 subscribers, posted the Half-Life 2 Quest 3 standalone test on August 10, 2026, followed by an updated run and a Portal 1 test. The story reached a large audience three days later when Nathie posted about it, over footage credited to Hostile VR. It is the clearest example on this page that audience size and contribution are different measurements.",
    },
    {
      question: "How was this list put together?",
      answer:
        "Every channel was opened directly and every subscriber count, video count, and last upload date was read from that channel's own page and RSS feed on the verification date shown at the top. No figure was copied from another list. Channels were then judged on what they actually publish rather than on reach alone, which is why several large channels are absent and a 568-subscriber channel is present.",
    },
  ]);

  return (
    <>
      <StructuredData data={articleSchema} />
      <StructuredData data={breadcrumbs} />
      <StructuredData data={creatorList} />
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
          The VR Creators Worth Following in 2026
        </h1>

        {verified && (
          <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
            Every channel verified {verified}
          </p>
        )}

        <p
          className="text-[15px] leading-[1.7] mb-5"
          style={{ color: "var(--text-secondary)" }}
        >
          We opened every channel on this page and read its numbers off its own
          upload feed. Nothing here is copied from another list. That turned out
          to matter, because the thing we found is not who is biggest. It is
          what has happened to the beat itself.
        </p>

        <p
          className="text-[15px] leading-[1.7] mb-5"
          style={{ color: "var(--text-secondary)" }}
        >
          Virtual Reality Oasis, at roughly 615,000 subscribers, has not uploaded
          since November 2025, and his last three videos are about a mod he built
          himself. ThrillSeeker, at roughly 720,000, went quiet in March; his
          final upload is titled &ldquo;The VR Industry&apos;s Great Reset.&rdquo;
          MRTV is still working but posted a video in July called &ldquo;We Are
          Not Just Reviewing VR Anymore.&rdquo; Cas and Chary renamed the channel
          from Cas and Chary VR to Cas and Chary XR. Tyriel Wood has led with
          smart glasses for weeks.
        </p>

        <p
          className="text-[15px] leading-[1.7] mb-5"
          style={{ color: "var(--text-secondary)" }}
        >
          The people posting about VR games several times a week are mostly the
          mid-size channels. And the largest VR-focused channel we found
          anywhere is not in English.
        </p>

        <p
          className="text-[15px] leading-[1.7] mb-8"
          style={{ color: "var(--text-secondary)" }}
        >
          So this is not a ranking. It is {activeCount} channels still doing the
          work, grouped by what they actually cover, plus an honest accounting of
          the very large ones that stopped.
        </p>

        <nav aria-label="Jump to section" className="flex flex-wrap gap-2 mb-10">
          {[
            ...BEATS.filter((b) => creatorsInBeat(data, b.key).length > 0).map(
              (b) => ({ label: b.title, id: `heading-${b.key}` })
            ),
            ...(dormant.length > 0
              ? [{ label: "Gone quiet", id: "heading-dormant" }]
              : []),
            ...(offsite.length > 0
              ? [{ label: "Not on YouTube", id: "heading-offsite" }]
              : []),
          ].map(({ label, id }) => (
            <a
              key={id}
              href={`#${id}`}
              className="font-mono text-[11px] uppercase tracking-[0.5px] no-underline px-3 py-1.5 rounded-full border transition-colors hover:!text-[var(--accent-cyan)] hover:!border-[var(--accent-cyan)]"
              style={{
                color: "var(--text-secondary)",
                borderColor: "var(--border)",
              }}
            >
              {label}
            </a>
          ))}
        </nav>

        {BEATS.map((beat, idx) => {
          const list = creatorsInBeat(data, beat.key);
          if (list.length === 0) return null;
          return (
            <section key={beat.key} aria-labelledby={`heading-${beat.key}`}>
              <h2
                id={`heading-${beat.key}`}
                className="font-display text-2xl font-bold mt-10 mb-2"
              >
                {beat.title}
              </h2>
              <p
                className="text-[13.5px] leading-[1.6] mb-2"
                style={{ color: "var(--text-muted)" }}
              >
                {beat.blurb}
              </p>
              <div className="mb-6">
                {list.map((c) => (
                  <CreatorCard key={c.id} creator={c} />
                ))}
              </div>
              {idx === 1 && (
                <div className="my-8">
                  <AdSlot slot={AD_SLOTS.pillar} format="horizontal" />
                </div>
              )}
            </section>
          );
        })}

        {dormant.length > 0 && (
          <section aria-labelledby="heading-dormant">
            <h2
              id="heading-dormant"
              className="font-display text-2xl font-bold mt-12 mb-2"
            >
              Still enormous, no longer posting
            </h2>
            <p
              className="text-[13.5px] leading-[1.6] mb-2"
              style={{ color: "var(--text-muted)" }}
            >
              Three of the largest audiences in VR video belong to channels that
              have gone quiet. Dropping them would make this page tidier and less
              true, so here they are with their last upload dates stated plainly.
              Their back catalogues are still worth your time.
            </p>
            <div className="mb-6">
              {dormant.map((c) => (
                <CreatorCard key={c.id} creator={c} />
              ))}
            </div>
          </section>
        )}

        {offsite.length > 0 && (
          <section aria-labelledby="heading-offsite">
            <h2
              id="heading-offsite"
              className="font-display text-2xl font-bold mt-12 mb-2"
            >
              Doing the work somewhere other than YouTube
            </h2>
            <p
              className="text-[13.5px] leading-[1.6] mb-2"
              style={{ color: "var(--text-muted)" }}
            >
              A growing amount of real VR discussion now happens in places with
              no upload schedule to check. Hostile VR is the example we ran into
              directly: the footage behind the Half-Life 2 on Quest 3 story this
              month was theirs, it reached everyone through someone else&apos;s
              post, and we could not find a channel of their own to point you to.
            </p>
            <div className="mb-6">
              {offsite.map((c) => (
                <CreatorCard key={c.id} creator={c} />
              ))}
            </div>
          </section>
        )}

        <h2 className="font-display text-2xl font-bold mt-12 mb-3">
          What is missing, and why we are telling you
        </h2>
        <p
          className="text-[15px] leading-[1.7] mb-4"
          style={{ color: "var(--text-secondary)" }}
        >
          Two gaps we could not close honestly. We did not find an active,
          high-quality Portuguese-language VR channel in this pass, and rather
          than pad the list with something we would not actually recommend, we
          left the slot empty. Chinese-language VR creators are a bigger
          omission, and mostly a structural one: that conversation happens on
          Bilibili, not YouTube, so a page built on YouTube upload feeds is the
          wrong instrument for finding it. If you know who belongs in either
          slot, we would genuinely like to hear about it.
        </p>

        <h2 className="font-display text-2xl font-bold mt-10 mb-3">
          How this list works
        </h2>
        <p
          className="text-[15px] leading-[1.7] mb-4"
          style={{ color: "var(--text-secondary)" }}
        >
          Every entry was verified by opening the channel and reading its own
          numbers, not by cross-checking someone else&apos;s roundup. Subscriber
          counts are rounded on purpose, because an exact figure is wrong within
          a week. Inclusion is judged on what a channel publishes rather than how
          many people watch it, which is why a few very large channels are absent
          and why a Korean channel with 568 subscribers made it in on the
          strength of one test video. We re-verify every 90 days, and anyone who
          goes quiet moves to the section above rather than disappearing. For
          what to actually put on the hardware they are reviewing, start with our{" "}
          <a
            href="/best-vr-headsets"
            className="no-underline hover:underline"
            style={{ color: "var(--accent-cyan)" }}
          >
            best VR headsets guide
          </a>{" "}
          and the{" "}
          <a
            href="/vr-release-dates"
            className="no-underline hover:underline"
            style={{ color: "var(--accent-cyan)" }}
          >
            release date tracker
          </a>
          .
        </p>

        <FaqSection schema={faq} />

        <RecentArticles heading="Latest VR News" limit={5} />
        <AllPillarGuides exclude="vr-youtubers" />
      </main>

      <Footer />
    </>
  );
}
