import type { Metadata } from "next";
import { OriginalsHub } from "@/components/OriginalsHub";
import { StructuredData, breadcrumbSchema } from "@/components/StructuredData";
import { getAllArticles } from "@/lib/articles";

// Regenerate every 5 min so the server-rendered archive picks up newly published
// originals (articles.json is volume-mounted and can change without a rebuild).
export const revalidate = 300;

export const metadata: Metadata = {
  title: "VR.org Originals - In-Depth VR & AR Articles | VR.org",
  description:
    "Original articles, analysis, and opinion from the VR.org team. In-depth coverage of virtual reality, augmented reality, and spatial computing.",
  openGraph: {
    title: "VR.org Originals - In-Depth VR & AR Articles | VR.org",
    description:
      "Original articles, analysis, and opinion from the VR.org team.",
    url: "https://vr.org/originals",
    siteName: "VR.org",
  },
  alternates: {
    canonical: "https://vr.org/originals",
  },
  twitter: {
    card: "summary_large_image",
    title: "VR.org Originals | VR.org",
    description:
      "Original articles, analysis, and opinion from the VR.org team.",
  },
};

export default function OriginalsPage() {
  const articles = getAllArticles().map((a) => ({
    id: a.id,
    slug: a.slug,
    title: a.title,
    snippet: a.snippet,
    category: a.category,
    author: a.author,
    publishDate: a.publishDate,
  }));

  return (
    <>
      <StructuredData
        data={breadcrumbSchema([
          { name: "VR.org", url: "https://vr.org" },
          { name: "Originals", url: "https://vr.org/originals" },
        ])}
      />
      <OriginalsHub initialArticles={articles} />
    </>
  );
}
