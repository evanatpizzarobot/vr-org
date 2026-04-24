import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { StructuredData, breadcrumbSchema } from "@/components/StructuredData";
import { getDeals, type DealItem } from "@/lib/deals";

export const metadata: Metadata = {
  title: "Best VR Deals 2026: Headsets, Accessories & Gaming PCs | VR.org",
  description:
    "The VR gear we actually recommend. Editorially independent picks for VR headsets, accessories, and VR-ready gaming PCs with links to trusted retailers.",
  alternates: {
    canonical: "https://vr.org/deals",
  },
  openGraph: {
    title: "Best VR Deals 2026 | VR.org",
    description:
      "The VR gear we actually recommend. Editorially independent picks for headsets, accessories, and gaming PCs.",
    url: "https://vr.org/deals",
    siteName: "VR.org",
    type: "website",
    images: [{ url: "https://vr.org/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@vrdotorg",
    creator: "@vrdotorg",
    title: "Best VR Deals 2026 | VR.org",
    description: "The VR gear we actually recommend.",
    images: ["https://vr.org/og-image.png"],
  },
};

function buttonClassForKey(key: string): string {
  switch (key) {
    case "amazon": return "deal-btn deal-btn-amazon";
    case "bh": return "deal-btn deal-btn-bh";
    case "meta": return "deal-btn deal-btn-meta";
    case "zybervr": return "deal-btn deal-btn-zybervr";
    case "direct": return "deal-btn deal-btn-direct";
    default: return "deal-btn deal-btn-default";
  }
}

function badgeClass(badge?: string): string {
  if (!badge) return "deal-badge";
  const lower = badge.toLowerCase();
  if (lower.includes("value")) return "deal-badge deal-badge-value";
  if (lower.includes("pick")) return "deal-badge deal-badge-pick";
  if (lower.includes("premium")) return "deal-badge deal-badge-premium";
  return "deal-badge deal-badge-pick";
}

function productSchema(item: DealItem) {
  const offers = Object.values(item.links).map((l) => ({
    "@type": "Offer",
    url: l.url,
    priceCurrency: "USD",
    seller: { "@type": "Organization", name: l.label },
  }));
  return {
    "@type": "Product",
    name: item.name,
    description: item.description,
    ...(item.image && { image: item.image }),
    offers,
  };
}

function parseDateToIso(last?: string): string {
  if (!last) return "";
  try {
    return new Date(last).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "UTC",
    });
  } catch {
    return last;
  }
}

export default function DealsPage() {
  const deals = getDeals();
  const allItems = deals.sections.flatMap((s) => s.items);

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Best VR Deals 2026",
    numberOfItems: allItems.length,
    itemListElement: allItems.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: productSchema(item),
    })),
  };

  return (
    <>
      <StructuredData data={itemListSchema} />
      <StructuredData
        data={breadcrumbSchema([
          { name: "VR.org", url: "https://vr.org" },
          { name: "Deals", url: "https://vr.org/deals" },
        ])}
      />
      <Header articleCount={0} lastUpdated="" />

      <main
        className="max-w-[1200px] mx-auto px-6 py-16"
        style={{ color: "var(--text-primary)" }}
      >
        {/* Hero */}
        <section className="deals-hero">
          <h1
            className="font-display text-[42px] md:text-[52px] font-bold mb-4"
            style={{ letterSpacing: "-0.5px" }}
          >
            VR Gear We Recommend
          </h1>
          <p
            className="text-[16px] leading-[1.6] mb-6"
            style={{ color: "var(--text-secondary)" }}
          >
            Hand-picked headsets, accessories, and PC hardware from the VR.org editorial team.
            Prices and availability change constantly, so we check these links often.
          </p>
          <p className="deals-disclosure">{deals.disclosure}</p>
        </section>

        {/* Sections */}
        {deals.sections.map((section) => (
          <section
            key={section.id}
            id={section.id}
            className="mb-16"
            aria-labelledby={`heading-${section.id}`}
          >
            <h2 id={`heading-${section.id}`} className="deals-section-title">
              {section.title}
            </h2>
            <p className="deals-section-desc">{section.description}</p>

            <div className="deals-grid">
              {section.items.map((item) => (
                <article key={item.name} className="deal-card">
                  <div className="deal-image">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        loading="lazy"
                      />
                    ) : (
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background:
                            "linear-gradient(135deg, var(--bg-card) 0%, var(--bg-secondary) 100%)",
                          color: "var(--text-muted)",
                          fontFamily: "var(--font-mono)",
                          fontSize: 11,
                          letterSpacing: "1px",
                          textTransform: "uppercase",
                        }}
                      >
                        {item.name.split(" ")[0]}
                      </div>
                    )}
                    {item.badge && (
                      <span className={badgeClass(item.badge)}>{item.badge}</span>
                    )}
                  </div>
                  <div className="deal-body">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="deal-name">{item.name}</h3>
                      <span className="deal-price">{item.price}</span>
                    </div>
                    <p className="deal-desc">{item.description}</p>
                    <div className="deal-buttons">
                      {Object.entries(item.links).map(([key, link]) => (
                        <a
                          key={key}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer nofollow sponsored"
                          className={buttonClassForKey(key)}
                        >
                          {link.label}
                        </a>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}

        {/* Last updated */}
        {deals.lastUpdated && (
          <div
            className="text-center font-mono text-[11px] mt-12 pt-6"
            style={{
              color: "var(--text-muted)",
              borderTop: "1px solid var(--border)",
            }}
          >
            Last updated: {parseDateToIso(deals.lastUpdated)}
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}
