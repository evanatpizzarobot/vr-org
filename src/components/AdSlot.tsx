"use client";

import { useEffect, useRef } from "react";

interface AdSlotProps {
  slot: string;
  format?: "auto" | "rectangle" | "horizontal" | "vertical";
  responsive?: boolean;
  className?: string;
  label?: boolean;
  minHeight?: number;
}

export function AdSlot({
  slot,
  format = "auto",
  responsive = true,
  className = "",
  label = true,
  minHeight,
}: AdSlotProps) {
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current) return;
    try {
      const w = window as unknown as { adsbygoogle?: unknown[] };
      w.adsbygoogle = w.adsbygoogle || [];
      (w.adsbygoogle as unknown[]).push({});
      pushed.current = true;
    } catch {
      /* noop */
    }
  }, []);

  const containerStyle = minHeight ? { minHeight: `${minHeight}px` } : undefined;

  return (
    <div className={`ad-container ${className}`} style={containerStyle}>
      {label && <span className="ad-label">Advertisement</span>}
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-7224757913262984"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? "true" : "false"}
      />
    </div>
  );
}
