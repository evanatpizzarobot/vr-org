import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { StructuredData, breadcrumbSchema } from "@/components/StructuredData";
import { AUTHORS, getAuthorBySlug } from "@/lib/authors";
import { getAllArticles } from "@/lib/articles";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return AUTHORS.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const author = getAuthorBySlug(slug);
  if (!author) return { title: "Author Not Found | VR.org" };
  return {
    title: `${author.name}, ${author.role} | VR.org`,
    description: author.bio,
    alternates: { canonical: `https://vr.org/author/${author.slug}` },
    openGraph: {
      title: `${author.name}, ${author.role} at VR.org`,
      description: author.bio,
      url: `https://vr.org/author/${author.slug}`,
      type: "profile",
      siteName: "VR.org",
    },
  };
}

export default async function AuthorPage({ params }: PageProps) {
  const { slug } = await params;
  const author = getAuthorBySlug(slug);
  if (!author) notFound();

  const articles = getAllArticles().filter((a) => a.author === author.name);

  const profileSchema = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    mainEntity: {
      "@type": "Person",
      "@id": `https://vr.org/author/${author.slug}#person`,
      name: author.name,
      url: `https://vr.org/author/${author.slug}`,
      jobTitle: author.role,
      description: author.bio,
      worksFor: {
        "@type": "Organization",
        name: "VR.org",
        url: "https://vr.org",
      },
      ...(author.sameAs && author.sameAs.length
        ? { sameAs: author.sameAs }
        : {}),
    },
  };

  return (
    <>
      <StructuredData data={profileSchema} />
      <StructuredData
        data={breadcrumbSchema([
          { name: "VR.org", url: "https://vr.org" },
          { name: author.name, url: `https://vr.org/author/${author.slug}` },
        ])}
      />
      <Header articleCount={0} lastUpdated="" />

      <main
        id="main"
        className="max-w-[720px] mx-auto px-6 py-16"
        style={{ color: "var(--text-primary)" }}
      >
        <div
          className="font-mono text-[11px] font-semibold uppercase tracking-[2px] mb-3"
          style={{ color: "var(--accent-cyan)" }}
        >
          {author.role}, VR.org
        </div>
        <h1
          className="font-display text-4xl font-bold mb-4"
          style={{ letterSpacing: "-0.5px" }}
        >
          {author.name}
        </h1>
        <p
          className="text-[15px] leading-[1.7] mb-10"
          style={{ color: "var(--text-secondary)" }}
        >
          {author.bio}
        </p>

        <h2 className="font-display text-2xl font-semibold mb-4">
          Articles by {author.name}
          <span
            className="font-mono text-[13px] font-normal ml-3"
            style={{ color: "var(--text-muted)" }}
          >
            {articles.length}
          </span>
        </h2>

        {articles.length === 0 ? (
          <p className="text-[15px]" style={{ color: "var(--text-muted)" }}>
            No articles yet. Check back soon.
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {articles.map((a) => (
              <a
                key={a.slug}
                href={`/articles/${a.slug}`}
                className="block rounded-[10px] border no-underline transition-all hover:border-[var(--accent-cyan)] hover:translate-y-[-1px]"
                style={{
                  background: "var(--bg-card)",
                  borderColor: "var(--border)",
                  padding: "16px 20px",
                }}
              >
                <div className="flex items-center gap-2.5 mb-1.5">
                  <span
                    className="font-mono text-[10px] uppercase tracking-[0.5px]"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {a.category}
                  </span>
                  <span
                    className="font-mono text-[10px] ml-auto"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {new Date(a.publishDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      timeZone: "UTC",
                    })}
                  </span>
                </div>
                <div
                  className="font-display font-semibold text-[16px] leading-[1.4]"
                  style={{ color: "var(--text-primary)", marginBottom: 4 }}
                >
                  {a.title}
                </div>
                <div
                  className="text-[13px] leading-[1.55] line-clamp-2"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {a.snippet}
                </div>
              </a>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}
