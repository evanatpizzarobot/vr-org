import type { Metadata } from "next";
import { getAllArticles } from "@/lib/articles";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { StructuredData, breadcrumbSchema } from "@/components/StructuredData";
import { OriginalArticleCard } from "@/components/OriginalArticleCard";

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
  const articles = getAllArticles();

  return (
    <>
      <StructuredData
        data={breadcrumbSchema([
          { name: "VR.org", url: "https://vr.org" },
          { name: "Originals", url: "https://vr.org/originals" },
        ])}
      />
      <Header articleCount={0} lastUpdated="" />

      <main
        className="max-w-[1400px] mx-auto px-6 py-10"
        style={{ color: "var(--text-primary)" }}
      >
        {/* Page header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <span
              className="font-mono text-[9px] font-bold px-2 py-0.5 rounded-[3px] uppercase tracking-[0.5px]"
              style={{
                background: "rgba(8, 145, 178, 0.15)",
                color: "var(--accent-cyan)",
              }}
            >
              VR.org Original
            </span>
          </div>
          <h1
            className="font-display text-[28px] font-bold leading-[1.3] mb-2"
            style={{ letterSpacing: "-0.5px" }}
          >
            Originals
          </h1>
          <p
            className="text-[15px] leading-[1.6] max-w-[600px]"
            style={{ color: "var(--text-secondary)" }}
          >
            In-depth articles, analysis, and opinion written by the VR.org team.
          </p>
        </div>

        {/* Articles list */}
        <div className="flex flex-col gap-3 max-w-[800px]">
          {articles.map((article) => (
            <OriginalArticleCard
              key={article.id}
              slug={article.slug}
              title={article.title}
              snippet={article.snippet}
              category={article.category}
              author={article.author}
              publishDate={article.publishDate}
            />
          ))}
        </div>
      </main>

      <Footer />
    </>
  );
}
