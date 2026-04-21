import { getAllArticles } from "@/lib/articles";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function RecentArticles({
  tag,
  tags,
  limit = 5,
  heading = "Latest Articles",
  fallbackToLatest = true,
}: {
  tag?: string;
  tags?: string[];
  limit?: number;
  heading?: string;
  fallbackToLatest?: boolean;
}) {
  const all = getAllArticles();
  const needles = tags ?? (tag ? [tag] : []);

  let filtered = needles.length
    ? all.filter((a) =>
        needles.some((t) => a.category === t || a.tags.includes(t))
      )
    : all;

  if (filtered.length === 0 && fallbackToLatest) {
    filtered = all;
  }

  const items = filtered.slice(0, limit);
  if (items.length === 0) return null;

  return (
    <aside
      className="mt-12 pt-8"
      style={{ borderTop: "1px solid var(--border)" }}
    >
      <h2
        className="font-display text-[13px] font-semibold uppercase tracking-[2px] mb-4"
        style={{ color: "var(--accent-cyan)" }}
      >
        {heading}
      </h2>
      <ul className="flex flex-col gap-3 list-none p-0">
        {items.map((article) => (
          <li key={article.id}>
            <a
              href={`/articles/${article.slug}`}
              className="block rounded-[10px] border no-underline transition-all group hover:translate-y-[-1px]"
              style={{
                background: "var(--bg-card)",
                borderColor: "var(--border)",
                padding: "14px 18px",
              }}
            >
              <div className="flex items-center gap-2 mb-1">
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
                  {article.category}
                </span>
                <span
                  className="font-mono text-[10px] ml-auto"
                  style={{ color: "var(--text-muted)" }}
                >
                  {formatDate(article.publishDate)}
                </span>
              </div>
              <div
                className="font-display font-semibold text-[15px] leading-[1.4] mb-1 group-hover:!text-[var(--accent-cyan)] transition-colors"
                style={{ color: "var(--text-primary)" }}
              >
                {article.title}
              </div>
              <div
                className="text-[12px] leading-[1.5] line-clamp-2"
                style={{ color: "var(--text-secondary)" }}
              >
                {article.snippet}
              </div>
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}
