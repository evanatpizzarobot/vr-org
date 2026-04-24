"use client";

import { AdSlot } from "./AdSlot";
import { AD_SLOTS } from "@/lib/ads";

export function SideRailAds() {
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
