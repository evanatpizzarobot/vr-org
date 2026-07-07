import type { DealItem } from "./deals";

const FALLBACK_IMAGE = "https://vr.org/og-image.png";

export function parsePriceToNumber(price: string): number | null {
  if (!price) return null;
  const cleaned = price.replace(/[^0-9.]/g, "");
  if (!cleaned) return null;
  const n = parseFloat(cleaned);
  return Number.isFinite(n) ? n : null;
}

export function deriveBrand(name: string): string {
  const trimmed = name.trim();
  if (/^kiwi\b/i.test(trimmed)) return "KIWI Design";
  if (/^ray-ban\b/i.test(trimmed)) return "Ray-Ban";
  if (/^playstation\b/i.test(trimmed)) return "Sony";
  if (/^apple\b/i.test(trimmed)) return "Apple";
  if (/^nvidia\b/i.test(trimmed)) return "NVIDIA";
  if (/^meta\b/i.test(trimmed)) return "Meta";
  if (/^bigscreen\b/i.test(trimmed)) return "Bigscreen";
  if (/^viture\b/i.test(trimmed)) return "VITURE";
  if (/^rayneo\b/i.test(trimmed)) return "RayNeo";
  if (/^zybervr\b/i.test(trimmed)) return "ZyberVR";
  return trimmed.split(/\s+/)[0] || "Unknown";
}

export function productSchema(item: DealItem) {
  const numericPrice = parsePriceToNumber(item.price);
  const offers = Object.values(item.links).map((l) => ({
    "@type": "Offer",
    url: l.url,
    priceCurrency: "USD",
    ...(numericPrice !== null && { price: numericPrice.toFixed(2) }),
    availability: "https://schema.org/InStock",
    seller: { "@type": "Organization", name: l.label },
  }));
  return {
    "@type": "Product",
    name: item.name,
    description: item.description,
    image: item.image || FALLBACK_IMAGE,
    brand: { "@type": "Brand", name: deriveBrand(item.name) },
    offers,
  };
}
