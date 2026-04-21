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
