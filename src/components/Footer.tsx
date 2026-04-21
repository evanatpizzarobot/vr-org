import { SOURCES } from "@/lib/constants";

const SOURCE_COLORS: Record<string, string> = {
  "Road to VR": "var(--accent-cyan)",
  "UploadVR": "var(--accent-magenta)",
  "TechCrunch": "var(--accent-green)",
  "XR Today": "var(--accent-orange)",
  "The Verge": "var(--accent-blue)",
  "Ars Technica": "var(--accent-red)",
  "Mixed News": "#d97706",
  "VentureBeat": "#7c3aed",
  "The Ghost Howls": "#0d9488",
  "Hypergrid Business": "#4f46e5",
  "Extended Reality News": "#e11d48",
};

export function Footer() {
  const sources = Object.values(SOURCES);

  return (
    <footer
      className="relative z-10"
      style={{ background: "var(--bg-secondary)" }}
    >
      {/* Gradient line above footer */}
      <div className="footer-gradient-line" />

      <div className="max-w-[1400px] mx-auto px-6 py-8 flex items-center justify-between flex-wrap gap-4">
        <div className="text-[13px]" style={{ color: "var(--text-muted)" }}>
          &copy; 2026{" "}
          <a
            href="/"
            className="no-underline"
            style={{ color: "var(--accent-cyan)" }}
          >
            VR.org
          </a>{" "}
          | Everything VR, AR &amp; XR{" "}
          |{" "}
          <a
            href="https://x.com/vrdotorg"
            target="_blank"
            rel="noopener noreferrer"
            className="no-underline hover:underline"
            style={{ color: "var(--accent-cyan)" }}
            aria-label="Follow VR.org on X"
          >
            @vrdotorg
          </a>
        </div>

        <div className="flex gap-5 flex-wrap">
          {[
            { label: "Hardware", href: "/hardware" },
            { label: "Gaming", href: "/gaming" },
            { label: "Software", href: "/software" },
            { label: "Enterprise", href: "/enterprise" },
            { label: "AR", href: "/ar" },
            { label: "Events", href: "/events" },
            { label: "About", href: "/about" },
            { label: "Privacy", href: "/privacy" },
          ].map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="text-xs no-underline transition-colors hover:!text-[var(--accent-cyan)]"
              style={{ color: "var(--text-muted)" }}
            >
              {label}
            </a>
          ))}
        </div>

        <div
          className="w-full pt-4 border-t mt-2 flex flex-wrap gap-x-5 gap-y-1"
          style={{ borderColor: "var(--border)" }}
        >
          <span
            className="font-mono text-[10px] tracking-[0.5px]"
            style={{ color: "var(--text-muted)" }}
          >
            Guides:{" "}
            {[
              { label: "What is VR?", href: "/what-is-vr" },
              { label: "VR for Beginners", href: "/vr-for-beginners" },
              { label: "Best VR Headsets 2026", href: "/best-vr-headsets" },
              { label: "Best AR Glasses 2026", href: "/ar-glasses" },
              { label: "Top 10 VR Games", href: "/best-vr-games" },
              { label: "Best VR Games 2026", href: "/best-vr-games-2026" },
              { label: "Best VR Apps", href: "/best-vr-apps" },
              { label: "Best VR Fitness Apps", href: "/best-vr-fitness" },
              { label: "Events Calendar", href: "/events" },
            ].map(({ label, href }, i) => (
              <span key={href}>
                {i > 0 && " • "}
                <a
                  href={href}
                  className="footer-guide-link"
                  style={{ color: "var(--accent-cyan)" }}
                >
                  {label}
                </a>
              </span>
            ))}
          </span>
        </div>
        <div
          className="w-full pt-2 font-mono text-[10px] tracking-[0.5px] flex flex-wrap gap-x-1"
          style={{ color: "var(--text-muted)" }}
        >
          <span>Sources: </span>
          {sources.map((s, i) => (
            <span key={s.name}>
              {i > 0 && <span> &bull; </span>}
              <span
                className="inline-block w-1.5 h-1.5 rounded-full mr-0.5"
                style={{
                  background: SOURCE_COLORS[s.name] || "var(--text-muted)",
                  verticalAlign: "middle",
                  marginBottom: 1,
                }}
              />
              {s.name}
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
}
