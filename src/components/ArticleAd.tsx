"use client";

import { AdSlot } from "./AdSlot";
import { AD_SLOTS } from "@/lib/ads";

export function ArticleAd() {
  return (
    <div className="my-8">
      <AdSlot slot={AD_SLOTS.article} format="auto" minHeight={250} />
    </div>
  );
}
