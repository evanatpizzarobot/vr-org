"use client";

import { useEffect, useState } from "react";
import type { AdPlacement, AdPlacementMap } from "@/lib/ad-placements";
import { AdSlot } from "./AdSlot";

// A direct-sold ad slot. Fetches the placement config once (shared across every
// AdZone on the page) and renders the matching placement ONLY when it is active.
// When there is no active placement it returns null: no wrapper, no spacing, no
// DOM, so an inactive slot is completely invisible and cannot shift the layout.
// This is why the whole ad system can sit wired into the site while dormant.
//
// `fallbackSlot` (added 2026-08-01) opts a zone into showing an AdSense unit
// while it waits for a direct sponsor, so a reserved slot earns something
// instead of nothing and yields automatically the moment a placement goes
// active. It is opt-IN rather than default: 9 of the 10 zones sit on pages that
// already carry two or three AdSense units, and three are on the homepage,
// which already renders nine. Turning it on everywhere would have pushed the
// homepage to twelve. Only pass it where a page genuinely earns nothing.

export type AdZoneVariant = "hero" | "banner" | "rectangle" | "in-feed";

// Module-level memoized fetch: many AdZone instances, one network request.
let placementsPromise: Promise<AdPlacementMap> | null = null;
function loadPlacements(): Promise<AdPlacementMap> {
  if (!placementsPromise) {
    placementsPromise = fetch("/api/ad-placements")
      .then((r) => (r.ok ? r.json() : { placements: {} }))
      .then((d: { placements?: AdPlacementMap }) => d.placements ?? {})
      .catch(() => ({}) as AdPlacementMap);
  }
  return placementsPromise;
}

// Only allow http(s) or site-relative URLs. Blocks javascript:, data:, and
// other dangerous schemes from reaching href/src, even though this config is
// admin-edited (defense in depth at the trust boundary).
function safeUrl(raw: string | undefined): string | null {
  if (!raw) return null;
  const v = raw.trim();
  if (v.startsWith("/") && !v.startsWith("//")) return v; // site-relative
  return /^https?:\/\//i.test(v) ? v : null;
}

function Creative({ placement }: { placement: AdPlacement }) {
  const src = safeUrl(placement.imageUrl);
  if (!src) return null;

  const href = safeUrl(placement.linkUrl);
  const image = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={placement.alt || placement.advertiser || "Sponsor"}
      loading="lazy"
      className="block w-full h-auto rounded-[10px]"
    />
  );

  // Render the creative without a link if the destination is missing or unsafe.
  if (!href) return image;
  return (
    <a href={href} target="_blank" rel="sponsored noopener noreferrer" className="block">
      {image}
    </a>
  );
}

// AdSense format that matches each zone shape, used only for the fallback.
const FALLBACK_FORMAT: Record<AdZoneVariant, "auto" | "horizontal" | "rectangle"> = {
  hero: "horizontal",
  banner: "horizontal",
  "in-feed": "auto",
  rectangle: "rectangle",
};

export function AdZone({
  slot,
  variant,
  fallbackSlot,
}: {
  slot: string;
  variant: AdZoneVariant;
  fallbackSlot?: string;
}) {
  const [placement, setPlacement] = useState<AdPlacement | null>(null);
  const [resolved, setResolved] = useState(false);

  useEffect(() => {
    let live = true;
    loadPlacements().then((map) => {
      const p = map[slot];
      if (live) {
        setPlacement(p && p.active ? p : null);
        setResolved(true);
      }
    });
    return () => {
      live = false;
    };
  }, [slot]);

  if (!placement) {
    // Render nothing until the config resolves. Painting AdSense first and then
    // swapping in a direct creative would flash the wrong ad and count a bogus
    // AdSense impression, so the decision waits for the fetch.
    if (!resolved || !fallbackSlot) return null;
    const unit = (
      <AdSlot slot={fallbackSlot} format={FALLBACK_FORMAT[variant]} />
    );
    switch (variant) {
      case "hero":
        return <div className="max-w-[1400px] mx-auto px-6 mt-2 mb-1">{unit}</div>;
      case "banner":
        return <div className="my-8">{unit}</div>;
      case "in-feed":
        return <div className="my-4">{unit}</div>;
      default:
        return unit;
    }
  }

  const label = placement.label || "Sponsored";
  const unit = (
    <div className={`ad-container direct-ad direct-ad-${variant}`}>
      <span className="ad-label">{label}</span>
      <Creative placement={placement} />
    </div>
  );

  switch (variant) {
    case "hero":
      return <div className="max-w-[1400px] mx-auto px-6 mt-2 mb-1">{unit}</div>;
    case "banner":
      return <div className="my-8">{unit}</div>;
    case "in-feed":
      return <div className="my-4">{unit}</div>;
    case "rectangle":
    default:
      return unit;
  }
}
