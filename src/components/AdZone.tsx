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
