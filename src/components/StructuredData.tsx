interface StructuredDataProps {
  data: Record<string, unknown>;
}

export function StructuredData({ data }: StructuredDataProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export const ORGANIZATION_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "VR.org",
  url: "https://vr.org",
  logo: "https://vr.org/logo.png",
  description:
    "Real-time news aggregator for virtual reality, augmented reality, and spatial computing.",
  foundingDate: "2017",
  sameAs: [
    "https://x.com/vrdotorg",
    "https://www.youtube.com/channel/UCTKqC49lw-HF1NxlquRoc0Q",
    "https://www.facebook.com/VRorg-760203404165583/",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    email: "contact@vr.org",
    contactType: "customer service",
  },
};

export const WEBSITE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "VR.org",
  url: "https://vr.org",
  description:
    "Real-time VR, AR, and XR news aggregated from the world's top sources.",
  publisher: {
    "@type": "Organization",
    name: "VR.org",
    url: "https://vr.org",
  },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://vr.org/?q={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
};

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function categoryPageSchema(
  name: string,
  description: string,
  url: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    url,
    isPartOf: {
      "@type": "WebSite",
      name: "VR.org",
      url: "https://vr.org",
    },
    publisher: {
      "@type": "Organization",
      name: "VR.org",
      url: "https://vr.org",
      logo: "https://vr.org/logo.png",
    },
  };
}

export function faqPageSchema(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function itemListSchema(
  name: string,
  items: { name: string; url?: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    numberOfItems: items.length,
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      ...(item.url && { url: item.url }),
    })),
  };
}

// Product schema, reusable across buyer guides (entity-only, no price) and
// future /reviews pages (with offers + a genuine first-party reviewRating).
// IMPORTANT: only attach aggregateRating or review when the score is a real
// VR.org editorial rating. Marking up a blended "consensus" score from other
// outlets is a structured-data spam violation, so leave them off otherwise.
export interface ProductInput {
  name: string;
  brand?: string;
  image?: string;
  description?: string;
  url?: string;
  offers?: {
    price?: number | string;
    priceCurrency?: string;
    availability?: string;
    url?: string;
    seller?: string;
  }[];
  aggregateRating?: {
    ratingValue: number | string;
    reviewCount?: number;
    bestRating?: number;
  };
  review?: {
    ratingValue: number | string;
    bestRating?: number;
    author?: string;
    body?: string;
  };
}

export function productNode(p: ProductInput): Record<string, unknown> {
  const node: Record<string, unknown> = { "@type": "Product", name: p.name };
  if (p.brand) node.brand = { "@type": "Brand", name: p.brand };
  if (p.image) node.image = p.image;
  if (p.description) node.description = p.description;
  if (p.url) node.url = p.url;
  if (p.offers && p.offers.length) {
    node.offers = p.offers.map((o) => ({
      "@type": "Offer",
      ...(o.price !== undefined && { price: String(o.price) }),
      priceCurrency: o.priceCurrency || "USD",
      availability: o.availability || "https://schema.org/InStock",
      ...(o.url && { url: o.url }),
      ...(o.seller && { seller: { "@type": "Organization", name: o.seller } }),
    }));
  }
  if (p.aggregateRating) {
    node.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: String(p.aggregateRating.ratingValue),
      bestRating: String(p.aggregateRating.bestRating ?? 5),
      ...(p.aggregateRating.reviewCount !== undefined && {
        reviewCount: String(p.aggregateRating.reviewCount),
      }),
    };
  }
  if (p.review) {
    node.review = {
      "@type": "Review",
      reviewRating: {
        "@type": "Rating",
        ratingValue: String(p.review.ratingValue),
        bestRating: String(p.review.bestRating ?? 5),
      },
      author: { "@type": "Organization", name: p.review.author || "VR.org" },
      ...(p.review.body && { reviewBody: p.review.body }),
    };
  }
  return node;
}

export function productSchema(p: ProductInput) {
  return { "@context": "https://schema.org", ...productNode(p) };
}

export function productItemListSchema(name: string, products: ProductInput[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    numberOfItems: products.length,
    itemListElement: products.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: productNode(p),
    })),
  };
}
