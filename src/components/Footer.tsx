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
          — Everything VR &amp; AR
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
          className="w-full pt-4 border-t mt-2 font-mono text-[10px] tracking-[0.5px]"
          style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
        >
          Sources: {sourceNames}
        </div>
      </div>
    </footer>
  );
}
