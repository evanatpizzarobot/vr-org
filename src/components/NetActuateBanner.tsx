"use client";

export function NetActuateBanner() {
  return (
    <a
      href="https://www.netactuate.com"
      target="_blank"
      rel="noopener noreferrer"
      className="block rounded-[10px] border no-underline transition-all hover:border-[var(--accent-cyan)] hover:translate-y-[-1px] group sponsor-banner"
      style={{
        borderColor: "var(--border)",
      }}
    >
      <div className="px-5 py-5 flex flex-col items-center text-center">
        <span
          className="font-mono text-[9px] font-medium uppercase tracking-[2px] mb-3"
          style={{ color: "var(--text-muted)" }}
        >
          Hosted by
        </span>

        {/* Dark mode: white logo from NetActuate docs */}
        <img
          src="https://www.netactuate.com/docs/img/NA-White-Logo-H.png"
          alt="NetActuate - Global Edge Infrastructure"
          className="max-w-[160px] w-full h-auto mb-3 sponsor-logo"
        />

        <div
          className="text-[12px] font-medium mb-0.5"
          style={{ color: "var(--text-secondary)" }}
        >
          Global Edge Infrastructure
        </div>
        <div
          className="text-[11px] mb-3"
          style={{ color: "var(--text-muted)" }}
        >
          45+ locations worldwide
        </div>

        <span
          className="font-mono text-[11px] flex items-center gap-1 group-hover:gap-2 transition-all"
          style={{ color: "var(--accent-cyan)" }}
        >
          Learn More →
        </span>
      </div>
    </a>
  );
}
