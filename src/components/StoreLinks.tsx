/**
 * Official-store link row for guide pages.
 *
 * Per CLAUDE.md ("Link every named game, mod, or app to its official platform
 * page"), a reader should be able to click through to every platform a title
 * actually ships on, not just one. Destinations are first-party storefronts
 * only: Steam, the Meta Horizon Store, and the PlayStation Store. Never a
 * rehost, a key reseller, a wiki, or a search URL.
 *
 * Every href passed in must be verified against the storefront before it ships.
 */

export type StoreBrand = "steam" | "meta" | "playstation";

export interface StoreLink {
  brand: StoreBrand;
  /** What the reader is actually buying, when it differs by platform. */
  label: string;
  href: string;
}

const BRAND_CLASS: Record<StoreBrand, string> = {
  steam: "deal-btn-steam",
  meta: "deal-btn-meta",
  playstation: "deal-btn-playstation",
};

export function StoreLinks({
  stores,
  heading = "Where to buy",
  note,
}: {
  stores: StoreLink[];
  heading?: string;
  note?: string;
}) {
  if (!stores.length) return null;

  return (
    <div className="store-links">
      <span className="store-links-label">{heading}</span>
      <div className="store-links-row">
        {stores.map((s) => (
          <a
            key={s.brand + s.href}
            href={s.href}
            target="_blank"
            rel="noopener"
            className={`deal-btn ${BRAND_CLASS[s.brand]}`}
          >
            {s.label}
          </a>
        ))}
      </div>
      {note && <p className="store-links-note">{note}</p>}
    </div>
  );
}
