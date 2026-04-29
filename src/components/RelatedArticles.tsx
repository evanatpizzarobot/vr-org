import { getAllArticles, type EditorialArticle } from "@/lib/articles";

const WRITER_COLORS: Record<string, string> = {
  "Evan Marcus": "var(--writer-evan)",
  "Alex Reeves": "var(--writer-alex)",
  "Jordan Kuo": "var(--writer-jordan)",
  "Nina Castillo": "var(--writer-nina)",
  "Sam Whitfield": "var(--writer-sam)",
};

const CATEGORY_COLORS: Record<string, string> = {
  gaming: "var(--cat-gaming)",
  hardware: "var(--cat-hardware)",
  software: "var(--cat-software)",
  enterprise: "var(--cat-enterprise)",
  ar: "var(--cat-ar)",
  xr: "var(--cat-xr)",
};

interface ScoredArticle {
  article: EditorialArticle;
  score: number;
}

function pickRelated(
  current: EditorialArticle,
  pool: EditorialArticle[],
  limit = 3
): EditorialArticle[] {
  const tagSet = new Set(current.tags);
  const scored: ScoredArticle[] = [];

  for (const candidate of pool) {
    if (candidate.slug === current.slug) continue;
    let score = 0;
    if (candidate.category === current.category) score += 5;
    for (const t of candidate.tags) if (tagSet.has(t)) score += 2;
    const ageDays =
      (Date.now() - new Date(candidate.publishDate).getTime()) /
      (1000 * 60 * 60 * 24);
    if (ageDays < 14) score += 1;
    scored.push({ article: candidate, score });
  }

  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return (
      new Date(b.article.publishDate).getTime() -
      new Date(a.article.publishDate).getTime()
    );
  });

  return scored.slice(0, limit).map((s) => s.article);
}

export function RelatedArticles({ current }: { current: EditorialArticle }) {
  const pool = getAllArticles();
  const related = pickRelated(current, pool, 3);
  if (related.length === 0) return null;

  return (
    <aside
      className="mt-12 pt-8"
      style={{ borderTop: "1px solid var(--border)" }}
    >
      <h2
        className="font-display text-[13px] font-semibold uppercase tracking-[2px] mb-4 m-0"
        style={{ color: "var(--accent-cyan)" }}
      >
        Related Articles
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {related.map((a) => {
          const writerColor = WRITER_COLORS[a.author] || "var(--accent-cyan)";
          const catColor = CATEGORY_COLORS[a.category] || "var(--accent-cyan)";
          const dateLabel = new Date(a.publishDate).toLocaleDateString(
            "en-US",
            { month: "short", day: "numeric", timeZone: "UTC" }
          );
          return (
            <a
              key={a.slug}
              href={`/articles/${a.slug}`}
              className="block rounded-[10px] border no-underline transition-all relative overflow-hidden hover:translate-y-[-1px]"
              style={{
                background: "var(--bg-card)",
                borderColor: "var(--border)",
                padding: "16px 18px",
              }}
            >
              <div
                className="absolute left-0 top-0 bottom-0 w-[3px]"
                style={{ background: writerColor, opacity: 0.5 }}
              />
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="font-mono text-[9px] font-bold px-2 py-0.5 rounded-[3px] uppercase tracking-[0.5px]"
                  style={{
                    background: `color-mix(in srgb, ${catColor} 15%, transparent)`,
                    color: catColor,
                  }}
                >
                  {a.category}
                </span>
                <span
                  className="font-mono text-[10px] ml-auto"
                  style={{ color: "var(--text-muted)" }}
                >
                  {dateLabel}
                </span>
              </div>
              <div
                className="font-display font-semibold leading-[1.4] mb-1.5"
                style={{ fontSize: 14, color: "var(--text-primary)" }}
              >
                {a.title}
              </div>
              <div
                className="text-[12px] leading-[1.5] line-clamp-2"
                style={{ color: "var(--text-secondary)" }}
              >
                {a.snippet}
              </div>
              <div className="flex items-center gap-1.5 mt-2.5">
                <span
                  className="w-1.5 h-1.5 rounded-full inline-block"
                  style={{ background: writerColor }}
                />
                <span
                  className="font-mono text-[10px]"
                  style={{ color: writerColor }}
                >
                  {a.author}
                </span>
              </div>
            </a>
          );
        })}
      </div>
    </aside>
  );
}
