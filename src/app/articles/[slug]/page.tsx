import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { StructuredData, breadcrumbSchema } from "@/components/StructuredData";
import { RelatedGuides } from "@/components/RelatedGuides";
import { RelatedArticles } from "@/components/RelatedArticles";
import { ArticleAd } from "@/components/ArticleAd";
import { ShareButtons } from "@/components/ShareButtons";
import { getArticleBySlug, getAllSlugs } from "@/lib/articles";
import { injectInternalLinks } from "@/lib/internal-links";
import { CATEGORIES } from "@/lib/constants";

// Category hub routes that a tag pill can deep-link to directly.
const CATEGORY_ROUTES = new Set<string>(
  CATEGORIES.map((c) => c.key).filter((k) => k !== "all")
);

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

// Render slugs not present at build time on demand instead of 404ing. The
// article data is read at request time from the volume-mounted data/articles.json,
// so a newly published article is reachable the instant the deploy syncs the file,
// without waiting for the Docker rebuild to finish.
export const dynamicParams = true;

// Revalidate the Full Route Cache so an on-demand render is never pinned forever.
// Without this, a request that hits a brand-new slug BEFORE the deploy syncs
// articles.json caches a notFound() 404 that sticks until the container is
// recreated (data-only deploys are a no-op build and do not recreate it). 300s
// matches the site-wide ISR window used on the category hubs, /originals, /deals.
export const revalidate = 300;

function extractFirstImage(html: string): string | null {
  const match = html.match(/<img\s[^>]*src=["']([^"']+)["']/);
  if (!match) return null;
  const src = match[1];
  return src.startsWith("http") ? src : `https://vr.org${src}`;
}

// Google truncates meta descriptions past ~160 chars. Trim on a word boundary
// for the description tags; the full snippet still shows in on-page cards.
function clampMeta(text: string, max = 160): string {
  if (!text || text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > 80 ? cut.slice(0, lastSpace) : cut).trimEnd() + "…";
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return { title: "Article Not Found | VR.org" };

  const metaDescription = clampMeta(article.snippet);

  // og:image and twitter:image come from the opengraph-image.tsx file
  // convention in this segment (a branded card with the headline), so no
  // explicit images here; declaring them would override the generated one.
  return {
    title: `${article.title} | VR.org`,
    description: metaDescription,
    alternates: {
      canonical: `https://vr.org/articles/${article.slug}`,
    },
    openGraph: {
      title: article.title,
      description: metaDescription,
      url: `https://vr.org/articles/${article.slug}`,
      type: "article",
      publishedTime: article.publishDate,
      authors: [article.author],
      siteName: "VR.org",
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: metaDescription,
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
    dateModified: article.updatedDate || article.publishDate,
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

  // Ad placement. Measured in AdSense on 2026-08-01: In-Article and Pillar are
  // 96% of all revenue, and the other three units earn $0.46/week combined. So
  // In-Article is the unit worth having more of. The old layout put one after
  // paragraph one and one at the very end, which left the entire middle of a
  // long piece unmonetized: the median original runs 11 paragraphs, so roughly
  // ten of them sat between the two ads.
  //
  // Longer pieces now get a third unit near the midpoint. Short ones are left
  // exactly as they were, because a 600-word piece with three ads in it would
  // look like a content farm, and house policy is aesthetics over squeezing the
  // last cent.
  //
  // Gate on words AND paragraphs, not paragraphs alone. Paragraph count is a
  // bad proxy for length because the writers differ: Nina's 627-word DuckDuckGo
  // piece runs 13 short paragraphs and a paragraph-only gate wrongly read it as
  // long, while Sam writes far fewer, longer ones. 900 words is roughly the
  // median original, so about half of the archive qualifies.
  const MID_AD_MIN_PARAGRAPHS = 9;
  const MID_AD_MIN_WORDS = 900;

  const splitBody = (() => {
    const closes = [...linkedBody.matchAll(/<\/p>/gi)];
    if (closes.length === 0) {
      return { intro: linkedBody, middle: "", rest: "" };
    }
    const firstEnd = (closes[0].index ?? 0) + closes[0][0].length;
    const intro = linkedBody.slice(0, firstEnd);

    const wordCount = linkedBody
      .replace(/<[^>]+>/g, " ")
      .split(/\s+/)
      .filter(Boolean).length;

    if (
      closes.length < MID_AD_MIN_PARAGRAPHS ||
      wordCount < MID_AD_MIN_WORDS
    ) {
      return { intro, middle: linkedBody.slice(firstEnd), rest: "" };
    }

    // Nearest paragraph break to the midpoint of the remaining body. Skip any
    // break immediately followed by a <figure>, since an ad butted against an
    // image reads as clutter, and skip breaks too near the end so the mid unit
    // never lands right on top of the closing one.
    const target = firstEnd + (linkedBody.length - firstEnd) / 2;
    let best = -1;
    for (const m of closes) {
      const end = (m.index ?? 0) + m[0].length;
      if (end <= firstEnd) continue;
      if (end >= linkedBody.length - 400) continue;
      if (/^\s*<figure/i.test(linkedBody.slice(end, end + 40))) continue;
      if (best === -1 || Math.abs(end - target) < Math.abs(best - target)) {
        best = end;
      }
    }
    if (best === -1) {
      return { intro, middle: linkedBody.slice(firstEnd), rest: "" };
    }
    return {
      intro,
      middle: linkedBody.slice(firstEnd, best),
      rest: linkedBody.slice(best),
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
        id="main"
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
        <div className="mb-6">
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

        {/* Share buttons */}
        <div className="pb-8" style={{ borderBottom: "1px solid var(--border)" }}>
          <ShareButtons
            url={`https://vr.org/articles/${article.slug}`}
            title={article.title}
          />
        </div>

        {/* Article body, opening paragraph */}
        <div
          className="article-body"
          dangerouslySetInnerHTML={{ __html: splitBody.intro }}
        />

        {/* Ad after the opening paragraph */}
        {(splitBody.middle || splitBody.rest) && <ArticleAd />}

        {/* Article body up to the midpoint (or all of it on short pieces) */}
        {splitBody.middle && (
          <div
            className="article-body"
            dangerouslySetInnerHTML={{ __html: splitBody.middle }}
          />
        )}

        {/* Midpoint ad, long articles only */}
        {splitBody.rest && <ArticleAd />}

        {/* Article body, remainder */}
        {splitBody.rest && (
          <div
            className="article-body"
            dangerouslySetInnerHTML={{ __html: splitBody.rest }}
          />
        )}

        {/* Share buttons (post-read) */}
        <div
          className="mt-10 pt-6"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          <ShareButtons
            url={`https://vr.org/articles/${article.slug}`}
            title={article.title}
          />
        </div>

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
              href={`/${CATEGORY_ROUTES.has(tag) ? tag : article.category}`}
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
