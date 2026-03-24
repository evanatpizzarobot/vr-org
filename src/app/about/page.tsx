import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata = {
  title: "About VR.org — Your VR & AR News Hub",
  description: "VR.org is a real-time news aggregator for virtual reality, augmented reality, and spatial computing. Learn about our mission and team.",
  openGraph: {
    title: "About VR.org — Your VR & AR News Hub",
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
          VR.org is a real-time news aggregator covering virtual reality, augmented reality, and spatial computing. We pull headlines from the world&apos;s leading VR and AR publications and deliver them in one clean, continuously updated feed.
        </p>

        <h2 className="font-display text-2xl font-semibold mb-4">Our mission</h2>
        <p className="text-[15px] leading-[1.7] mb-8" style={{ color: "var(--text-secondary)" }}>
          We believe the future is immersive. VR.org exists to be the fastest way to stay informed about everything happening in virtual reality, augmented reality, mixed reality, and spatial computing — from hardware launches and game releases to enterprise adoption and industry analysis.
        </p>

        <h2 className="font-display text-2xl font-semibold mb-4">What we do</h2>
        <p className="text-[15px] leading-[1.7] mb-4" style={{ color: "var(--text-secondary)" }}>
          VR.org aggregates news from trusted sources across the VR and AR ecosystem. We don&apos;t rewrite or republish articles — we surface headlines, provide brief summaries, and link directly to the original source. Every story on VR.org credits and links back to the publication that wrote it.
        </p>
        <p className="text-[15px] leading-[1.7] mb-8" style={{ color: "var(--text-secondary)" }}>
          Our feed updates automatically throughout the day, pulling from sources including Road to VR, UploadVR, TechCrunch, XR Today, and more.
        </p>

        <h2 className="font-display text-2xl font-semibold mb-4">Who we are</h2>
        <p className="text-[15px] leading-[1.7] mb-4" style={{ color: "var(--text-secondary)" }}>
          VR.org was founded by a small team of VR enthusiasts, technologists, and gamers who have been following virtual reality since its earliest consumer days. We originally launched as an editorial publication covering VR news, reviews, and events. In 2026, we relaunched as a real-time aggregator to better serve the growing VR and AR community.
        </p>
        <p className="text-[15px] leading-[1.7] mb-8" style={{ color: "var(--text-secondary)" }}>
          The site is hosted on infrastructure provided by{" "}
          <a
            href="https://www.netactuate.com"
            target="_blank"
            rel="noopener noreferrer"
            className="no-underline hover:underline"
            style={{ color: "var(--accent-cyan)" }}
          >
            NetActuate
          </a>
          , a global edge infrastructure company operating across 40+ locations worldwide.
        </p>

        <h2 className="font-display text-2xl font-semibold mb-4">Connect with us</h2>
        <ul className="text-[15px] leading-[1.7] list-none flex flex-col gap-2" style={{ color: "var(--text-secondary)" }}>
          <li>
            General inquiries:{" "}
            <a href="mailto:contact@vr.org" className="no-underline hover:underline" style={{ color: "var(--accent-cyan)" }}>
              contact@vr.org
            </a>
          </li>
          <li>
            Advertising &amp; sponsorships:{" "}
            <a href="mailto:advertise@vr.org" className="no-underline hover:underline" style={{ color: "var(--accent-cyan)" }}>
              advertise@vr.org
            </a>
          </li>
          <li>
            Press &amp; media:{" "}
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
        </ul>

        <h2 className="font-display text-2xl font-semibold mt-8 mb-4">Team</h2>
        <ul className="text-[15px] leading-[1.7] list-none flex flex-col gap-2" style={{ color: "var(--text-secondary)" }}>
          <li>
            Evan —{" "}
            <a href="mailto:evan@vr.org" className="no-underline hover:underline" style={{ color: "var(--accent-cyan)" }}>
              evan@vr.org
            </a>
          </li>
          <li>
            Mark —{" "}
            <a href="mailto:mark@vr.org" className="no-underline hover:underline" style={{ color: "var(--accent-cyan)" }}>
              mark@vr.org
            </a>
          </li>
          <li>
            Sandy —{" "}
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
