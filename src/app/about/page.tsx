import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { StructuredData, breadcrumbSchema } from "@/components/StructuredData";

export const metadata = {
  title: "About VR.org | Your VR & AR News Hub",
  description: "VR.org is a real-time news aggregator for virtual reality, augmented reality, and spatial computing. Learn about our mission and team.",
  alternates: {
    canonical: "https://vr.org/about",
  },
  openGraph: {
    title: "About VR.org | Your VR & AR News Hub",
    description: "VR.org is a real-time news aggregator for virtual reality, augmented reality, and spatial computing.",
    url: "https://vr.org/about",
    siteName: "VR.org",
    images: [{ url: "https://vr.org/og-image.png", width: 1200, height: 630 }],
  },
};

const WRITERS = [
  {
    name: "Evan Marcus",
    role: "Co-Founder",
    email: "evan@vr.org",
    bio: "Covers VR gaming, hardware, and industry trends. Has followed VR since the Oculus DK1.",
  },
  {
    name: "Alex Reeves",
    role: "Staff Writer",
    email: "alex@vr.org",
    bio: "Covers hardware launches, platform news, and the business side of VR.",
  },
  {
    name: "Jordan Kuo",
    role: "Staff Writer",
    email: "jordan@vr.org",
    bio: "Covers augmented reality, spatial computing, and the XR developer ecosystem.",
  },
  {
    name: "Nina Castillo",
    role: "Staff Writer",
    email: "nina@vr.org",
    bio: "Covers VR and AR software, developer tools, and emerging platforms.",
  },
  {
    name: "Sam Whitfield",
    role: "Contributing Writer",
    email: "sam@vr.org",
    bio: "Covers enterprise XR, VR training, and industry analysis.",
  },
];

const OWNERS = [
  { name: "Evan Marcus", email: "evan@vr.org" },
  { name: "Mark Mahle", email: "mark@vr.org" },
  { name: "Sandy Mahle", email: "sandy@vr.org" },
];

export default function AboutPage() {
  return (
    <>
      <StructuredData
        data={breadcrumbSchema([
          { name: "VR.org", url: "https://vr.org" },
          { name: "About", url: "https://vr.org/about" },
        ])}
      />
      <Header articleCount={0} lastUpdated="" />

      <main
        className="max-w-[720px] mx-auto px-6 py-16"
        style={{ color: "var(--text-primary)" }}
      >
        <h1
          className="font-display text-4xl font-bold mb-8"
          style={{ letterSpacing: "-0.5px" }}
        >
          About VR.org
        </h1>

        <p className="text-[15px] leading-[1.7] mb-8" style={{ color: "var(--text-secondary)" }}>
          VR.org is a home for virtual reality, augmented reality, and spatial computing. We pair a real-time feed of headlines from the industry&apos;s top publications with original reporting, buyer&apos;s guides, and analysis from our editorial team. Whether you play in VR, build for AR, or just want to track where spatial computing is headed, VR.org is built to keep you current.
        </p>

        <h2 className="font-display text-2xl font-semibold mb-4">What you&apos;ll find here</h2>
        <ul className="text-[15px] leading-[1.7] mb-8 flex flex-col gap-2 list-disc pl-5" style={{ color: "var(--text-secondary)" }}>
          <li>
            <strong style={{ color: "var(--text-primary)" }}>VR.org Originals:</strong> Reviews, opinion, retrospectives, and analysis from our editorial team, spanning gaming, hardware, software, and the business of XR. Browse them on our{" "}
            <a href="/originals" className="no-underline hover:underline" style={{ color: "var(--accent-cyan)" }}>Originals page</a>.
          </li>
          <li>
            <strong style={{ color: "var(--text-primary)" }}>Buyer&apos;s guides and rankings:</strong> Regularly updated picks, including{" "}
            <a href="/best-vr-headsets" className="no-underline hover:underline" style={{ color: "var(--accent-cyan)" }}>Best VR Headsets 2026</a>,{" "}
            <a href="/best-vr-games" className="no-underline hover:underline" style={{ color: "var(--accent-cyan)" }}>Top 10 VR Games of All Time</a>,{" "}
            <a href="/best-vr-games-2026" className="no-underline hover:underline" style={{ color: "var(--accent-cyan)" }}>Best VR Games of 2026</a>, and{" "}
            <a href="/best-vr-apps" className="no-underline hover:underline" style={{ color: "var(--accent-cyan)" }}>Best VR Apps</a>.
          </li>
          <li>
            <strong style={{ color: "var(--text-primary)" }}>Original research:</strong> Data studies built from our own coverage, including{" "}
            <a href="/state-of-vr-2026" className="no-underline hover:underline" style={{ color: "var(--accent-cyan)" }}>The State of VR &amp; AR 2026</a>. Free to cite with attribution.
          </li>
          <li>
            <strong style={{ color: "var(--text-primary)" }}>Explainers:</strong> Plain-language guides like{" "}
            <a href="/what-is-vr" className="no-underline hover:underline" style={{ color: "var(--accent-cyan)" }}>What is Virtual Reality?</a> for anyone new to the space.
          </li>
          <li>
            <strong style={{ color: "var(--text-primary)" }}>Live industry feed:</strong> A real-time feed pulling from 38+ trusted sources including Road to VR, UploadVR, Auganix, and AR Insider. Every story credits and links to its original source.
          </li>
          <li>
            <strong style={{ color: "var(--text-primary)" }}>Category coverage:</strong> Dedicated hubs for{" "}
            <a href="/hardware" className="no-underline hover:underline" style={{ color: "var(--accent-cyan)" }}>Hardware</a>,{" "}
            <a href="/gaming" className="no-underline hover:underline" style={{ color: "var(--accent-cyan)" }}>Gaming</a>,{" "}
            <a href="/software" className="no-underline hover:underline" style={{ color: "var(--accent-cyan)" }}>Software</a>,{" "}
            <a href="/enterprise" className="no-underline hover:underline" style={{ color: "var(--accent-cyan)" }}>Enterprise</a>,{" "}
            <a href="/ar" className="no-underline hover:underline" style={{ color: "var(--accent-cyan)" }}>AR</a>, and{" "}
            <a href="/xr" className="no-underline hover:underline" style={{ color: "var(--accent-cyan)" }}>XR</a>, each with editorial context and pinned originals.
          </li>
        </ul>

        <h2 className="font-display text-2xl font-semibold mb-4">How we work</h2>
        <p className="text-[15px] leading-[1.7] mb-4" style={{ color: "var(--text-secondary)" }}>
          VR.org runs on two tracks. Our editors write the original work: long-form articles, buyer&apos;s guides, rankings, and analysis grounded in years spent with this technology. Our live feed then pulls headlines from 38+ publications across VR and AR, sorted into six verticals and refreshed throughout the day, always linking back to the source.
        </p>
        <p className="text-[15px] leading-[1.7] mb-8" style={{ color: "var(--text-secondary)" }}>
          The feed makes sure nothing slips past you. The editorial gives VR.org its voice. Together they cover the full spectrum: hardware launches, game releases, developer tools, enterprise adoption, and the trends shaping what comes next.
        </p>

        <h2 className="font-display text-2xl font-semibold mb-4">Our story</h2>
        <p className="text-[15px] leading-[1.7] mb-8" style={{ color: "var(--text-secondary)" }}>
          VR.org first launched as an editorial publication: hands-on headset coverage, event reporting, and video. As the industry matured, we rebuilt it. In 2026 we relaunched as a hybrid platform, part real-time aggregator and part publication, run by people who have followed this space since the earliest consumer headsets. It is the VR site we always wanted to exist.
        </p>

        <h2 className="font-display text-2xl font-semibold mb-4">Infrastructure</h2>
        <p className="text-[15px] leading-[1.7] mb-8" style={{ color: "var(--text-secondary)" }}>
          VR.org runs on infrastructure from{" "}
          <a
            href="https://www.netactuate.com"
            target="_blank"
            rel="noopener noreferrer"
            className="no-underline hover:underline"
            style={{ color: "var(--accent-cyan)" }}
          >
            NetActuate
          </a>{" "}
          (netactuate.com), a global edge network spanning 45+ locations. We are proud to sit on one of the world&apos;s largest peered networks.
        </p>

        <h2 className="font-display text-2xl font-semibold mb-4">Our Writers</h2>
        <p className="text-[15px] leading-[1.7] mb-6" style={{ color: "var(--text-secondary)" }}>
          Our editorial team publishes original content daily, covering every corner of the VR, AR, and XR industry.
        </p>
        <div className="flex flex-col gap-5 mb-10">
          {WRITERS.map((w) => (
            <div key={w.email}>
              <div className="text-[15px] font-semibold" style={{ color: "var(--text-primary)" }}>{w.name}</div>
              <div className="text-[13px] font-mono mb-1" style={{ color: "var(--accent-cyan)" }}>
                {w.role}{" · "}
                <a href={`mailto:${w.email}`} className="no-underline hover:underline" style={{ color: "var(--accent-cyan)" }}>{w.email}</a>
              </div>
              <p className="text-[14px] leading-[1.6]" style={{ color: "var(--text-secondary)" }}>
                {w.bio}
              </p>
            </div>
          ))}
        </div>

        <h2 className="font-display text-2xl font-semibold mb-4">Business Relations</h2>
        <p className="text-[15px] leading-[1.7] mb-6" style={{ color: "var(--text-secondary)" }}>
          VR.org is independently owned and run by its three co-owners. For partnerships, sponsorships, and business inquiries, reach any of us directly.
        </p>
        <div className="flex flex-col gap-4 mb-10">
          {OWNERS.map((o) => (
            <div key={o.email}>
              <div className="text-[15px] font-semibold" style={{ color: "var(--text-primary)" }}>{o.name}</div>
              <div className="text-[13px] font-mono" style={{ color: "var(--accent-cyan)" }}>
                Co-Owner{" · "}
                <a href={`mailto:${o.email}`} className="no-underline hover:underline" style={{ color: "var(--accent-cyan)" }}>{o.email}</a>
              </div>
            </div>
          ))}
        </div>

        <h2 className="font-display text-2xl font-semibold mb-4">Connect with us</h2>
        <ul className="text-[15px] leading-[1.7] list-none flex flex-col gap-2" style={{ color: "var(--text-secondary)" }}>
          <li>
            General Inquiries:{" "}
            <a href="mailto:contact@vr.org" className="no-underline hover:underline" style={{ color: "var(--accent-cyan)" }}>
              contact@vr.org
            </a>
          </li>
          <li>
            Advertising &amp; Sponsorships:{" "}
            <a href="mailto:advertise@vr.org" className="no-underline hover:underline" style={{ color: "var(--accent-cyan)" }}>
              advertise@vr.org
            </a>
          </li>
          <li>
            Press &amp; Media:{" "}
            <a href="mailto:press@vr.org" className="no-underline hover:underline" style={{ color: "var(--accent-cyan)" }}>
              press@vr.org
            </a>
          </li>
          <li>
            Twitter / X:{" "}
            <a href="https://x.com/vrdotorg" target="_blank" rel="noopener noreferrer" className="no-underline hover:underline" style={{ color: "var(--accent-cyan)" }}>
              @vrdotorg
            </a>
          </li>
          <li>
            YouTube:{" "}
            <a href="https://www.youtube.com/channel/UCTKqC49lw-HF1NxlquRoc0Q" target="_blank" rel="noopener noreferrer" className="no-underline hover:underline" style={{ color: "var(--accent-cyan)" }}>
              VR.org
            </a>
          </li>
        </ul>
      </main>

      <Footer />
    </>
  );
}
