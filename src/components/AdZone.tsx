"use client";

import { useEffect, useState } from "react";
import type { AdPlacement, AdPlacementMap } from "@/lib/ad-placements";

// A direct-sold ad slot. Fetches the placement config once (shared across every
// AdZone on the page) and renders the matching placement ONLY when it is active.
// When there is no active placement it returns null: no wrapper, no spacing, no
// DOM, so an inactive slot is completely invisible and cannot shift the layout.
// This is why the whole ad system can sit wired into the site while dormant.

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

function Creative({ placement }: { placement: AdPlacement }) {
  if (!placement.imageUrl) return null;
  return (
    <a
      href={placement.linkUrl || "#"}
      target="_blank"
      rel="sponsored noopener"
      className="block"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={placement.imageUrl}
        alt={placement.alt || placement.advertiser || "Sponsor"}
        loading="lazy"
        className="block w-full h-auto rounded-[10px]"
      />
    </a>
  );
}

export function AdZone({ slot, variant }: { slot: string; variant: AdZoneVariant }) {
  const [placement, setPlacement] = useState<AdPlacement | null>(null);

  useEffect(() => {
    let live = true;
    loadPlacements().then((map) => {
      const p = map[slot];
      if (live) setPlacement(p && p.active ? p : null);
    });
    return () => {
      live = false;
    };
  }, [slot]);

  if (!placement) return null;

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
