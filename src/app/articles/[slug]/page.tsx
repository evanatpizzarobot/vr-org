import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { StructuredData, breadcrumbSchema } from "@/components/StructuredData";
import { RelatedGuides } from "@/components/RelatedGuides";
import { RelatedArticles } from "@/components/RelatedArticles";
import { ArticleAd } from "@/components/ArticleAd";
import { getArticleBySlug, getAllSlugs } from "@/lib/articles";
import { injectInternalLinks } from "@/lib/internal-links";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

function extractFirstImage(html: string): string | null {
  const match = html.match(/<img\s[^>]*src=["']([^"']+)["']/);
  if (!match) return null;
  const src = match[1];
  return src.startsWith("http") ? src : `https://vr.org${src}`;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return { title: "Article Not Found | VR.org" };

  const ogImage = extractFirstImage(article.body) || "https://vr.org/og-image.png";

  return {
    title: `${article.title} | VR.org`,
    description: article.snippet,
    alternates: {
      canonical: `https://vr.org/articles/${article.slug}`,
    },
    openGraph: {
      title: article.title,
      description: article.snippet,
      url: `https://vr.org/articles/${article.slug}`,
      type: "article",
      publishedTime: article.publishDate,
      authors: [article.author],
      siteName: "VR.org",
      images: [{ url: ogImage, width: 1200, height: 630, alt: article.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.snippet,
      images: [ogImage],
    },
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const ogImage = extractFirstImage(article.body) || "https://vr.org/og-image.png";

  const authorSameAs: Record<string, string[]> = {
    "Evan Marcus": ["https://x.com/vrdotorg"],
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.snippet,
    url: `https://vr.org/articles/${article.slug}`,
    datePublished: article.publishDate,
    ...(article.updatedDate && { dateModified: article.updatedDate }),
    image: [ogImage],
    articleSection:
      article.category.charAt(0).toUpperCase() + article.category.slice(1),
    keywords: article.tags.join(", "),
    inLanguage: "en-US",
    author: {
      "@type": "Person",
      name: article.author,
      jobTitle: article.authorRole.split(", ")[0],
      worksFor: {
        "@type": "Organization",
        name: "VR.org",
        url: "https://vr.org",
      },
      ...(authorSameAs[article.author] && {
        sameAs: authorSameAs[article.author],
      }),
    },
    publisher: {
      "@type": "Organization",
      name: "VR.org",
      url: "https://vr.org",
      logo: {
        "@type": "ImageObject",
        url: "https://vr.org/logo.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://vr.org/articles/${article.slug}`,
    },
  };

  const categoryLabel =
    article.category.charAt(0).toUpperCase() + article.category.slice(1);

  const formattedDate = new Date(article.publishDate).toLocaleDateString(
    "en-US",
    { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" }
  );

  const linkedBody = injectInternalLinks(article.body);

  const splitBody = (() => {
    const match = linkedBody.match(/<\/p>/i);
    if (!match || match.index === undefined) {
      return { intro: linkedBody, rest: "" };
    }
    const cutoff = match.index + match[0].length;
    return {
      intro: linkedBody.slice(0, cutoff),
      rest: linkedBody.slice(cutoff),
    };
  })();

  return (
    <>
      <StructuredData data={articleSchema} />
      <StructuredData
        data={breadcrumbSchema([
          { name: "VR.org", url: "https://vr.org" },
          { name: categoryLabel, url: `https://vr.org/${article.category}` },
          {
            name: article.title,
            url: `https://vr.org/articles/${article.slug}`,
          },
        ])}
      />
      <Header articleCount={0} lastUpdated="" />

      <main
        className="max-w-[680px] mx-auto px-6 py-16"
        style={{ color: "var(--text-primary)" }}
      >
        {/* Category + Date */}
        <div className="flex items-center justify-between mb-6">
          <a
            href={`/${article.category}`}
            className="font-mono text-[11px] font-semibold uppercase tracking-[2px] no-underline"
            style={{ color: "var(--accent-cyan)" }}
          >
            {categoryLabel}
          </a>
          <span
            className="text-[13px]"
            style={{ color: "var(--text-muted)" }}
          >
            {formattedDate}
          </span>
        </div>

        {/* Title */}
        <h1
          className="font-display text-[30px] font-bold leading-[1.3] mb-6"
          style={{ letterSpacing: "-0.5px" }}
        >
          {article.title}
        </h1>

        {/* Byline */}
        <div className="mb-8 pb-8" style={{ borderBottom: "1px solid var(--border)" }}>
          <div className="text-[15px] font-medium">
            By {article.author}
          </div>
          <div
            className="text-[13px]"
            style={{ color: "var(--text-secondary)" }}
          >
            {article.authorRole}
          </div>
        </div>

        {/* Article body, opening paragraph */}
        <div
          className="article-body"
          dangerouslySetInnerHTML={{ __html: splitBody.intro }}
        />

        {/* Mid-article ad after first paragraph */}
        {splitBody.rest && <ArticleAd />}

        {/* Article body, remainder */}
        {splitBody.rest && (
          <div
            className="article-body"
            dangerouslySetInnerHTML={{ __html: splitBody.rest }}
          />
        )}

        {/* Ad after article body */}
        <ArticleAd />

        {/* Related VR.org Originals */}
        <RelatedArticles current={article} />

        {/* Related Guides */}
        <RelatedGuides tags={[article.category, ...article.tags]} />

        {/* Tags */}
        <div
          className="mt-12 pt-8 flex flex-wrap gap-2"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          {article.tags.map((tag) => (
            <a
              key={tag}
              href={`/${article.category}`}
              className="text-[11px] font-mono px-3 py-1 rounded-full border no-underline transition-colors hover:border-[var(--accent-cyan)]"
              style={{
                borderColor: "var(--border)",
                color: "var(--text-secondary)",
              }}
            >
              #{tag}
            </a>
          ))}
        </div>

        {/* Back link */}
        <div className="mt-8">
          <a
            href={`/${article.category}`}
            className="text-[13px] font-mono no-underline hover:underline"
            style={{ color: "var(--accent-cyan)" }}
          >
            &larr; Back to {categoryLabel} News
          </a>
        </div>
      </main>

      <Footer />
    </>
  );
}
