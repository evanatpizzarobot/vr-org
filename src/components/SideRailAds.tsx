"use client";

import { useEffect, useState } from "react";
import { AdSlot } from "./AdSlot";
import { AD_SLOTS } from "@/lib/ads";

const RAIL_BREAKPOINT = 1900;

export function SideRailAds() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${RAIL_BREAKPOINT}px)`);
    const update = () => setShow(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  if (!show) return null;

  return (
    <>
      <div className="side-rail side-rail-left">
        <AdSlot
          slot={AD_SLOTS.rail}
          format="vertical"
          responsive={false}
          label={true}
          minHeight={600}
        />
      </div>
      <div className="side-rail side-rail-right">
        <AdSlot
          slot={AD_SLOTS.rail}
          format="vertical"
          responsive={false}
          label={true}
          minHeight={600}
        />
      </div>
    </>
  );
}
