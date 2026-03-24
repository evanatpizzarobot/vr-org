export function NetActuateBanner() {
  return (
    <a
      href="https://www.netactuate.com"
      target="_blank"
      rel="noopener noreferrer"
      className="block rounded-[10px] border no-underline transition-all hover:border-[var(--accent-cyan)] overflow-hidden"
      style={{
        background: "var(--bg-card)",
        borderColor: "var(--border)",
      }}
    >
      <div
        className="px-4 py-3 text-center"
        style={{
          background: "linear-gradient(135deg, #0a1628 0%, #132240 100%)",
        }}
      >
        <div className="font-display text-[15px] font-bold tracking-wide text-white mb-0.5">
          Net<span style={{ color: "#4fc3f7" }}>Actuate</span>
        </div>
        <div className="text-[10px] uppercase tracking-[1.5px] text-gray-400">
          Global Edge Infrastructure
        </div>
      </div>
      <div
        className="px-4 py-3 text-center"
        style={{ borderTop: "1px solid var(--border)" }}
      >
        <div
          className="text-[11px] leading-[1.5]"
          style={{ color: "var(--text-secondary)" }}
        >
          Powering VR.org from 40+ edge locations worldwide
        </div>
        <div
          className="text-[10px] mt-1.5 font-mono"
          style={{ color: "var(--accent-cyan)" }}
        >
          netactuate.com →
        </div>
      </div>
    </a>
  );
}
