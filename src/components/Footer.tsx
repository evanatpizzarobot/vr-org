import { SOURCES } from "@/lib/constants";

export function Footer() {
  const sourceNames = Object.values(SOURCES)
    .map((s) => s.name)
    .join(" • ");

  return (
    <footer
      className="border-t relative z-10"
      style={{ borderColor: "var(--border)", background: "var(--bg-secondary)" }}
    >
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
          | Everything VR &amp; AR
        </div>

        <div className="flex gap-5 flex-wrap">
          {[
            { label: "Hardware", href: "/hardware" },
            { label: "Gaming", href: "/gaming" },
            { label: "Software", href: "/software" },
            { label: "Enterprise", href: "/enterprise" },
            { label: "AR", href: "/ar" },
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
              { label: "Best VR Headsets 2026", href: "/best-vr-headsets" },
              { label: "Top 10 VR Games", href: "/best-vr-games" },
              { label: "Best VR Games 2026", href: "/best-vr-games-2026" },
              { label: "Best VR Apps", href: "/best-vr-apps" },
            ].map(({ label, href }, i) => (
              <span key={href}>
                {i > 0 && " • "}
                <a
                  href={href}
                  className="no-underline hover:underline"
                  style={{ color: "var(--accent-cyan)" }}
                >
                  {label}
                </a>
              </span>
            ))}
          </span>
        </div>
        <div
          className="w-full pt-2 font-mono text-[10px] tracking-[0.5px]"
          style={{ color: "var(--text-muted)" }}
        >
          Sources: {sourceNames}
        </div>
      </div>
    </footer>
  );
}
