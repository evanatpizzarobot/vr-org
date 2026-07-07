import { StructuredData } from "@/components/StructuredData";
import { productSchema } from "@/lib/product-schema";
import type { CategoryProductsResult } from "@/lib/category-products";

function buttonClassForKey(key: string): string {
  switch (key) {
    case "amazon": return "deal-btn deal-btn-amazon";
    case "meta": return "deal-btn deal-btn-meta";
    case "zybervr": return "deal-btn deal-btn-zybervr";
    case "steam": return "deal-btn deal-btn-steam";
    case "quest": return "deal-btn deal-btn-quest";
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
  if (lower.includes("favorite") || lower.includes("staff")) return "deal-badge deal-badge-favorite";
  return "deal-badge deal-badge-pick";
}

const isExternal = (href: string) => /^https?:\/\//i.test(href);

export function CategoryProducts({ data }: { data: CategoryProductsResult }) {
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: data.heading,
    numberOfItems: data.picks.length,
    itemListElement: data.picks.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: productSchema(item),
    })),
  };

  return (
    <section className="mb-10" aria-label={data.heading}>
      <StructuredData data={itemListSchema} />

      <div className="flex items-center gap-3 mb-4">
        <span
          className="font-display text-[13px] font-semibold uppercase tracking-[2px]"
          style={{ color: "var(--accent-cyan)" }}
        >
          {data.heading}
        </span>
        <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
        <a
          href={data.seeAll.href}
          className="font-mono text-[10px] no-underline hover:underline"
          style={{ color: "var(--text-muted)" }}
        >
          {data.seeAll.label} &rarr;
        </a>
      </div>

      {data.mostPopular.length > 0 && (
        <ol className="category-popular">
          {data.mostPopular.map((item, i) => (
            <li key={item.name} className="category-popular-row">
              <span className="category-popular-rank">{i + 1}</span>
              <a
                href={item.href}
                className="category-popular-link"
                {...(isExternal(item.href)
                  ? { target: "_blank", rel: "noopener noreferrer nofollow sponsored" }
                  : {})}
              >
                <span className="category-popular-name">{item.name}</span>
                <span className="category-popular-sub">{item.subtitle}</span>
              </a>
            </li>
          ))}
        </ol>
      )}

      <div className="deals-grid" style={{ marginTop: 18 }}>
        {data.picks.map((item) => (
          <article key={item.name} className="deal-card">
            <div className="deal-image">
              {item.image ? (
                <img src={item.image} alt={item.name} loading="lazy" />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "linear-gradient(135deg, var(--bg-card) 0%, var(--bg-secondary) 100%)",
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
              {item.badge && <span className={badgeClass(item.badge)}>{item.badge}</span>}
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
  );
}
