"use client";

interface OriginalArticleCardProps {
  slug: string;
  title: string;
  snippet: string;
  category: string;
  author: string;
  publishDate: string;
}

export function OriginalArticleCard({
  slug,
  title,
  snippet,
  category,
  author,
  publishDate,
}: OriginalArticleCardProps) {
  const categoryLabel =
    category.charAt(0).toUpperCase() + category.slice(1);
  const formattedDate = new Date(publishDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <a
      href={`/articles/${slug}`}
      className="block rounded-[10px] border no-underline transition-all group relative overflow-hidden"
      style={{
        background: "var(--bg-card)",
        borderColor: "var(--border)",
        padding: "20px 24px",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "var(--bg-card-hover)";
        e.currentTarget.style.borderColor = "var(--border-active)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "var(--bg-card)";
        e.currentTarget.style.borderColor = "var(--border)";
      }}
    >
      <div
        className="absolute left-0 top-0 bottom-0 w-[3px] opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ background: "var(--accent-cyan)" }}
      />
      <div className="flex items-center gap-2.5 mb-2">
        <span
          className="font-mono text-[9px] font-bold px-2 py-0.5 rounded-[3px] uppercase tracking-[0.5px]"
          style={{
            background: "rgba(8, 145, 178, 0.15)",
            color: "var(--accent-cyan)",
          }}
        >
          VR.org Original
        </span>
        <span
          className="font-mono text-[10px] uppercase tracking-[0.5px]"
          style={{ color: "var(--text-muted)" }}
        >
          {categoryLabel}
        </span>
        <span
          className="font-mono text-[10px] ml-auto"
          style={{ color: "var(--text-muted)" }}
        >
          {formattedDate}
        </span>
      </div>
      <div
        className="font-display font-semibold leading-[1.4] transition-colors group-hover:!text-[var(--accent-cyan)]"
        style={{
          fontSize: 18,
          color: "var(--text-primary)",
          marginBottom: 6,
        }}
      >
        {title}
      </div>
      <div
        className="text-[13px] leading-[1.55] line-clamp-2"
        style={{ color: "var(--text-secondary)" }}
      >
        {snippet}
      </div>
      <div className="flex items-center justify-between mt-3">
        <span
          className="text-[13px]"
          style={{ color: "var(--text-muted)" }}
        >
          By {author}
        </span>
        <span
          className="font-mono text-[11px] flex items-center gap-1 group-hover:gap-2 transition-all"
          style={{ color: "var(--accent-cyan)" }}
        >
          Read article &rarr;
        </span>
      </div>
    </a>
  );
}
