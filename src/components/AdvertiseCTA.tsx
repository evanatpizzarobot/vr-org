// Small sidebar call-to-action letting interested companies know VR.org offers
// ad placements and sponsorships. Links to the /advertise page. Dashed border
// evokes an available ad slot without being intrusive.
export function AdvertiseCTA() {
  return (
    <a
      href="/advertise"
      className="block rounded-[10px] border border-dashed no-underline transition-all hover:border-[var(--accent-cyan)] hover:translate-y-[-1px] group"
      style={{ borderColor: "var(--border-active)" }}
    >
      <div className="px-5 py-5 flex flex-col items-center text-center">
        <span
          className="font-mono text-[9px] font-medium uppercase tracking-[2px] mb-2"
          style={{ color: "var(--text-muted)" }}
        >
          Advertise with us
        </span>
        <div
          className="font-display text-[16px] font-semibold mb-1.5"
          style={{ color: "var(--text-primary)" }}
        >
          Your ad here
        </div>
        <div
          className="text-[11.5px] leading-[1.5] mb-3"
          style={{ color: "var(--text-secondary)" }}
        >
          Reach the VR, AR &amp; XR audience. Sponsorships and ad placements
          available.
        </div>
        <span
          className="font-mono text-[11px] flex items-center gap-1 group-hover:gap-2 transition-all"
          style={{ color: "var(--accent-cyan)" }}
        >
          Get in touch &rarr;
        </span>
      </div>
    </a>
  );
}
