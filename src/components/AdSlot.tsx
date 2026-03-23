interface AdSlotProps {
  inline?: boolean;
}

export function AdSlot({ inline }: AdSlotProps) {
  return (
    <div
      className="rounded-[10px] border border-dashed text-center font-mono text-[10px] uppercase tracking-[2px]"
      style={{
        background: "var(--bg-secondary)",
        borderColor: "var(--border)",
        color: "var(--text-muted)",
        padding: inline ? "20px" : "30px 20px",
        margin: inline ? "4px 0" : undefined,
      }}
    >
      Ad Space
      <br />
      — Google AdSense —
    </div>
  );
}
