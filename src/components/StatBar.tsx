// Simple horizontal bar for the data-study charts. Server component, no JS.
// Bar width is scaled to `max` for readability; the printed value is the real
// figure so the chart never misrepresents the number.

export function StatBar({
  label,
  value,
  max = 100,
  suffix = "%",
  color = "var(--accent-cyan)",
}: {
  label: string;
  value: number;
  max?: number;
  suffix?: string;
  color?: string;
}) {
  const pct = Math.max(2, Math.min(100, (value / max) * 100));
  return (
    <div className="flex items-center gap-3 mb-2.5">
      <div
        className="w-[150px] sm:w-[185px] text-[13px] shrink-0 leading-tight"
        style={{ color: "var(--text-secondary)" }}
      >
        {label}
      </div>
      <div
        className="flex-1 h-[22px] rounded-[5px] relative overflow-hidden"
        style={{ background: "var(--bg-secondary)" }}
      >
        <div
          className="h-full rounded-[5px]"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
      <div
        className="w-[44px] text-right text-[13px] font-mono font-semibold shrink-0"
        style={{ color: "var(--text-primary)" }}
      >
        {value}
        {suffix}
      </div>
    </div>
  );
}
