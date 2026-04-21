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
  },
};

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
          VR.org is your home for virtual reality, augmented reality, and spatial computing. We combine a real-time news feed aggregating headlines from the industry&apos;s top publications with original editorial content written by our team. Whether you&apos;re a VR gamer, an AR developer, or someone following the future of spatial computing, VR.org is built to keep you informed.
        </p>

        <h2 className="font-display text-2xl font-semibold mb-4">What you&apos;ll find here</h2>
        <p className="text-[15px] leading-[1.7] mb-4" style={{ color: "var(--text-secondary)" }}>
          VR.org is built around original editorial content supplemented by a real-time industry news feed. Here&apos;s what we publish:
        </p>
        <ul className="text-[15px] leading-[1.7] mb-6 flex flex-col gap-2 list-disc pl-5" style={{ color: "var(--text-secondary)" }}>
          <li>
            <strong style={{ color: "var(--text-primary)" }}>VR.org Originals</strong> : In-depth articles, opinion pieces, retrospectives, and analysis written by our editorial team. We currently have a growing library of original articles covering gaming, hardware, software, and industry trends. Browse them on our{" "}
            <a href="/originals" className="no-underline hover:underline" style={{ color: "var(--accent-cyan)" }}>Originals page</a>.
          </li>
          <li>
            <strong style={{ color: "var(--text-primary)" }}>Buyer&apos;s guides and rankings</strong> : Curated, regularly updated guides including our{" "}
            <a href="/best-vr-headsets" className="no-underline hover:underline" style={{ color: "var(--accent-cyan)" }}>Best VR Headsets 2026</a> buyer&apos;s guide,{" "}
            <a href="/best-vr-games" className="no-underline hover:underline" style={{ color: "var(--accent-cyan)" }}>Top 10 VR Games of All Time</a>,{" "}
            <a href="/best-vr-games-2026" className="no-underline hover:underline" style={{ color: "var(--accent-cyan)" }}>Best VR Games of 2026</a>, and{" "}
            <a href="/best-vr-apps" className="no-underline hover:underline" style={{ color: "var(--accent-cyan)" }}>Best VR Apps</a>.
          </li>
          <li>
            <strong style={{ color: "var(--text-primary)" }}>Educational resources</strong> : Explainers like our comprehensive{" "}
            <a href="/what-is-vr" className="no-underline hover:underline" style={{ color: "var(--accent-cyan)" }}>&quot;What is Virtual Reality?&quot;</a> guide for newcomers to the space.
          </li>
          <li>
            <strong style={{ color: "var(--text-primary)" }}>Industry news feed</strong> : A real-time aggregated feed pulling headlines from 11 trusted sources including Road to VR, UploadVR, TechCrunch, and XR Today. Every aggregated story credits and links directly to the original source.
          </li>
          <li>
            <strong style={{ color: "var(--text-primary)" }}>Category coverage</strong> : Dedicated sections for{" "}
            <a href="/hardware" className="no-underline hover:underline" style={{ color: "var(--accent-cyan)" }}>Hardware</a>,{" "}
            <a href="/gaming" className="no-underline hover:underline" style={{ color: "var(--accent-cyan)" }}>Gaming</a>,{" "}
            <a href="/software" className="no-underline hover:underline" style={{ color: "var(--accent-cyan)" }}>Software</a>,{" "}
            <a href="/enterprise" className="no-underline hover:underline" style={{ color: "var(--accent-cyan)" }}>Enterprise</a>,{" "}
            <a href="/ar" className="no-underline hover:underline" style={{ color: "var(--accent-cyan)" }}>AR</a>, and{" "}
            <a href="/xr" className="no-underline hover:underline" style={{ color: "var(--accent-cyan)" }}>XR</a>, each with editorial introductions and pinned original articles.
          </li>
        </ul>

        <h2 className="font-display text-2xl font-semibold mb-4">How we work</h2>
        <p className="text-[15px] leading-[1.7] mb-4" style={{ color: "var(--text-secondary)" }}>
          VR.org operates on two tracks. Our editorial team writes original content: long-form articles, buyer&apos;s guides, game rankings, and industry analysis. These pieces represent our own research, opinions, and expertise built over years in the VR space.
        </p>
        <p className="text-[15px] leading-[1.7] mb-4" style={{ color: "var(--text-secondary)" }}>
          Alongside the original content, our live feed pulls headlines from 11 trusted publications across the VR and AR ecosystem. The feed updates automatically throughout the day, with articles categorized across six verticals. Every aggregated story credits and links directly to the original source. The feed is a supplement to our editorial work, not a replacement for it.
        </p>
        <p className="text-[15px] leading-[1.7] mb-8" style={{ color: "var(--text-secondary)" }}>
          We believe the best way to serve readers is to combine original editorial perspective with comprehensive industry awareness. Our original articles give VR.org a voice. Our news feed makes sure nothing slips through the cracks.
        </p>

        <h2 className="font-display text-2xl font-semibold mb-4">Our mission</h2>
        <p className="text-[15px] leading-[1.7] mb-4" style={{ color: "var(--text-secondary)" }}>
          We believe the future is immersive. VR.org exists to be the most comprehensive and accessible source for everything happening in virtual reality, augmented reality, mixed reality, and spatial computing. We cover the full spectrum: hardware launches, game releases, developer tools, enterprise adoption, and industry trends.
        </p>
        <p className="text-[15px] leading-[1.7] mb-8" style={{ color: "var(--text-secondary)" }}>
          The VR and AR industry moves fast. Our goal is to make sure you never miss what matters.
        </p>

        <h2 className="font-display text-2xl font-semibold mb-4">Our story</h2>
        <p className="text-[15px] leading-[1.7] mb-4" style={{ color: "var(--text-secondary)" }}>
          VR.org originally launched as an editorial publication covering VR news, reviews, and events. We published hands-on coverage of headsets, attended industry events, and produced video content on our YouTube channel. As the industry evolved, we stepped back and reimagined what VR.org could be.
        </p>
        <p className="text-[15px] leading-[1.7] mb-4" style={{ color: "var(--text-secondary)" }}>
          In 2026, we relaunched VR.org as a hybrid platform: part real-time aggregator, part editorial publication. The aggregator keeps you current with the latest headlines from every major source. The original content gives us a platform to share our own perspectives, deep dives, and analysis on the technology we&apos;ve been passionate about for years.
        </p>
        <p className="text-[15px] leading-[1.7] mb-8" style={{ color: "var(--text-secondary)" }}>
          We&apos;re VR enthusiasts, gamers, and technologists who&apos;ve been following this space since the earliest consumer headsets. VR.org is the site we always wanted to exist.
        </p>

        <h2 className="font-display text-2xl font-semibold mb-4">Infrastructure</h2>
        <p className="text-[15px] leading-[1.7] mb-8" style={{ color: "var(--text-secondary)" }}>
          VR.org is hosted on infrastructure provided by{" "}
          <a
            href="https://www.netactuate.com"
            target="_blank"
            rel="noopener noreferrer"
            className="no-underline hover:underline"
            style={{ color: "var(--accent-cyan)" }}
          >
            NetActuate
          </a>{" "}
          (netactuate.com), a global edge infrastructure company operating across 45+ locations worldwide. We&apos;re proud to run on one of the world&apos;s largest peered networks.
        </p>

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

        <h2 className="font-display text-2xl font-semibold mt-8 mb-4">Our Writers</h2>
        <p className="text-[15px] leading-[1.7] mb-6" style={{ color: "var(--text-secondary)" }}>
          Our editorial team publishes original content daily, covering every corner of the VR, AR, and XR industry.
        </p>
        <div className="flex flex-col gap-5 mb-10">
          <div>
            <div className="text-[15px] font-semibold" style={{ color: "var(--text-primary)" }}>Evan Marcus</div>
            <div className="text-[13px] font-mono mb-1" style={{ color: "var(--accent-cyan)" }}>Co-Founder</div>
            <p className="text-[14px] leading-[1.6]" style={{ color: "var(--text-secondary)" }}>
              Covers VR gaming, hardware, and industry trends. Has been following VR since the Oculus DK1 era.
            </p>
          </div>
          <div>
            <div className="text-[15px] font-semibold" style={{ color: "var(--text-primary)" }}>Alex Reeves</div>
            <div className="text-[13px] font-mono mb-1" style={{ color: "var(--accent-cyan)" }}>Staff Writer</div>
            <p className="text-[14px] leading-[1.6]" style={{ color: "var(--text-secondary)" }}>
              Covers hardware launches, platform news, and the business side of VR.
            </p>
          </div>
          <div>
            <div className="text-[15px] font-semibold" style={{ color: "var(--text-primary)" }}>Jordan Kuo</div>
            <div className="text-[13px] font-mono mb-1" style={{ color: "var(--accent-cyan)" }}>Staff Writer</div>
            <p className="text-[14px] leading-[1.6]" style={{ color: "var(--text-secondary)" }}>
              Covers augmented reality, spatial computing, and the XR developer ecosystem.
            </p>
          </div>
          <div>
            <div className="text-[15px] font-semibold" style={{ color: "var(--text-primary)" }}>Nina Castillo</div>
            <div className="text-[13px] font-mono mb-1" style={{ color: "var(--accent-cyan)" }}>Staff Writer</div>
            <p className="text-[14px] leading-[1.6]" style={{ color: "var(--text-secondary)" }}>
              Covers VR and AR software, developer tools, and emerging platforms.
            </p>
          </div>
          <div>
            <div className="text-[15px] font-semibold" style={{ color: "var(--text-primary)" }}>Sam Whitfield</div>
            <div className="text-[13px] font-mono mb-1" style={{ color: "var(--accent-cyan)" }}>Contributing Writer</div>
            <p className="text-[14px] leading-[1.6]" style={{ color: "var(--text-secondary)" }}>
              Covers enterprise XR, VR training, and industry analysis.
            </p>
          </div>
        </div>

        <h2 className="font-display text-2xl font-semibold mb-4">Team</h2>
        <ul className="text-[15px] leading-[1.7] list-none flex flex-col gap-2" style={{ color: "var(--text-secondary)" }}>
          <li>
            Evan -{" "}
            <a href="mailto:evan@vr.org" className="no-underline hover:underline" style={{ color: "var(--accent-cyan)" }}>
              evan@vr.org
            </a>
          </li>
          <li>
            Mark -{" "}
            <a href="mailto:mark@vr.org" className="no-underline hover:underline" style={{ color: "var(--accent-cyan)" }}>
              mark@vr.org
            </a>
          </li>
          <li>
            Sandy -{" "}
            <a href="mailto:sandy@vr.org" className="no-underline hover:underline" style={{ color: "var(--accent-cyan)" }}>
              sandy@vr.org
            </a>
          </li>
        </ul>
      </main>

      <Footer />
    </>
  );
}
