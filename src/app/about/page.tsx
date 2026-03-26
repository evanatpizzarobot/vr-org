import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata = {
  title: "About VR.org | Your VR & AR News Hub",
  description: "VR.org is a real-time news aggregator for virtual reality, augmented reality, and spatial computing. Learn about our mission and team.",
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

        <h2 className="font-display text-2xl font-semibold mb-4">What we do</h2>
        <p className="text-[15px] leading-[1.7] mb-4" style={{ color: "var(--text-secondary)" }}>
          VR.org operates on two tracks.
        </p>
        <p className="text-[15px] leading-[1.7] mb-4" style={{ color: "var(--text-secondary)" }}>
          Our live feed pulls headlines from 11 trusted sources across the VR and AR ecosystem, including Road to VR, UploadVR, TechCrunch, XR Today, and more. The feed updates automatically throughout the day, with articles categorized across Hardware, Gaming, Software, Enterprise, AR, and XR. Every aggregated story credits and links directly to the original source.
        </p>
        <p className="text-[15px] leading-[1.7] mb-4" style={{ color: "var(--text-secondary)" }}>
          Alongside the feed, we publish VR.org Originals. These are in-depth articles, guides, and opinion pieces written by our team covering the topics we care about most. From retrospectives on games that defined VR to analysis of where the industry is headed, our original content gives VR.org a voice beyond aggregation. You&apos;ll find Originals pinned at the top of every category page and collected on our dedicated{" "}
          <a href="/originals" className="no-underline hover:underline" style={{ color: "var(--accent-cyan)" }}>
            Originals page
          </a>.
        </p>
        <p className="text-[15px] leading-[1.7] mb-8" style={{ color: "var(--text-secondary)" }}>
          We also maintain a growing library of evergreen guides and resources, including our{" "}
          <a href="/what-is-vr" className="no-underline hover:underline" style={{ color: "var(--accent-cyan)" }}>
            &quot;What is Virtual Reality?&quot;
          </a>{" "}
          explainer, buyer&apos;s guides for{" "}
          <a href="/best-vr-headsets" className="no-underline hover:underline" style={{ color: "var(--accent-cyan)" }}>
            VR headsets
          </a>, and curated rankings of the{" "}
          <a href="/best-vr-games" className="no-underline hover:underline" style={{ color: "var(--accent-cyan)" }}>
            best VR games
          </a>{" "}
          and{" "}
          <a href="/best-vr-apps" className="no-underline hover:underline" style={{ color: "var(--accent-cyan)" }}>
            apps
          </a>.
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

        <h2 className="font-display text-2xl font-semibold mt-8 mb-4">Team</h2>
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
