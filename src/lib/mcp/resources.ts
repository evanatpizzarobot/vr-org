// MCP resources for the VR.org remote endpoint (/mcp). Browsable VR.org content
// the host app can attach as context. Reads the live data layer directly (same
// as the tools), formats to markdown / HTML, and sanitizes + caps like tool
// output. The formatters here are kept identical to the npm package's
// src/resources.ts so both surfaces return the same text.

import { getAllArticles, getArticleBySlug } from "@/lib/articles";
import { searchVrNews, getVrEvents, EXPLAINERS } from "./tools";

const BASE = "https://vr.org";
const MAX_RESPONSE_BYTES = 50_000;
const CONTROL_CHARS = new RegExp(
  "[\\u0000-\\u0008\\u000B\\u000C\\u000E-\\u001F\\u007F-\\u009F]",
  "g",
);
const ZERO_WIDTH = new RegExp(
  "[\\u200B-\\u200F\\u202A-\\u202E\\u2060-\\u2064\\uFEFF]",
  "g",
);

function clean(s: string): string {
  let out = s.replace(CONTROL_CHARS, "").replace(ZERO_WIDTH, "");
  if (out.length > MAX_RESPONSE_BYTES) out = out.slice(0, MAX_RESPONSE_BYTES - 14) + "...[truncated]";
  return out;
}

// ---------- formatters (identical to vr-org-mcp/src/resources.ts) ----------

interface NewsItem { title: string | null; url: string | null; source?: string | null; published?: string | null; }
interface OriginalItem { title: string | null; url: string | null; author?: string | null; published?: string | null; snippet?: string | null; }
interface EventItem { name: string | null; start_date?: string | null; end_date?: string | null; location?: string | null; url?: string | null; }
interface GuideItem { title: string; summary: string; url: string; }
interface ArticleFields { title: string | null; author?: string | null; published?: string | null; url?: string | null; body_html?: string | null; }

function dateOnly(d?: string | null): string {
  return typeof d === "string" ? d.slice(0, 10) : "";
}

function metaParens(parts: Array<string | null | undefined>): string {
  const joined = parts.filter(Boolean).join(", ");
  return joined ? ` (${joined})` : "";
}

function formatNewsIndex(items: NewsItem[]): string {
  const lines = [
    "# Latest VR / AR / XR headlines",
    "",
    "Aggregated live by VR.org from VR-native and filtered general-tech sources.",
    "",
  ];
  const kept = items.filter((it) => it.title);
  for (const it of kept) {
    lines.push(`- [${it.title}](${it.url ?? ""})${metaParens([it.source, dateOnly(it.published)])}`);
  }
  if (kept.length === 0) lines.push("No headlines available right now.");
  return lines.join("\n");
}

function formatOriginalsIndex(items: OriginalItem[]): string {
  const lines = [
    "# Latest VR.org original articles",
    "",
    "Original reporting, opinion, and guides from the VR.org editorial team. Read any one in full via the vrorg://article/{slug} resource.",
    "",
  ];
  const kept = items.filter((it) => it.title);
  for (const it of kept) {
    lines.push(`- [${it.title}](${it.url ?? ""})${metaParens([it.author, dateOnly(it.published)])}`);
    if (it.snippet) lines.push(`  ${it.snippet}`);
  }
  if (kept.length === 0) lines.push("No articles available.");
  return lines.join("\n");
}

function formatEventsList(items: EventItem[]): string {
  const lines = [
    "# Upcoming VR / AR / XR events",
    "",
    "From VR.org's industry calendar, soonest first.",
    "",
  ];
  const kept = items.filter((e) => e.name);
  for (const e of kept) {
    const when =
      e.end_date && e.end_date !== e.start_date
        ? `${dateOnly(e.start_date)} to ${dateOnly(e.end_date)}`
        : dateOnly(e.start_date);
    const where = e.location ? `, ${e.location}` : "";
    const link = e.url ? ` ${e.url}` : "";
    lines.push(`- **${e.name}**${when ? ` (${when}${where})` : where ? ` (${where.slice(2)})` : ""}.${link}`);
  }
  if (kept.length === 0) lines.push("No upcoming events listed.");
  return lines.join("\n");
}

function formatGuidesDoc(guides: GuideItem[]): string {
  const lines = [
    "# VR.org guides: canonical answers",
    "",
    "VR.org's short, authoritative answers to common VR / AR / XR questions, each with its full guide link.",
    "",
  ];
  for (const g of guides) {
    lines.push(`## ${g.title}`, "", g.summary, "", `Guide: ${g.url}`, "");
  }
  return lines.join("\n").trimEnd();
}

function formatArticle(a: ArticleFields): string {
  const byline = [a.author, dateOnly(a.published)].filter(Boolean).join(", ");
  const header = [
    a.title ? `<h1>${a.title}</h1>` : "",
    byline ? `<p><em>${byline}</em></p>` : "",
  ]
    .filter(Boolean)
    .join("\n");
  const body = a.body_html ?? "";
  const footer = a.url ? `\n<p>Source: <a href="${a.url}">${a.url}</a></p>` : "";
  return `${header}\n${body}${footer}`.trim();
}

// ---------- resource content (reads local data) ----------

export function newsLatestResource(): string {
  const res = searchVrNews({ limit: 25 });
  const items = (res.articles ?? []).map((a) => ({
    title: a.title ?? null,
    url: a.url ?? null,
    source: a.source ?? null,
    published: a.published ?? null,
  }));
  return clean(formatNewsIndex(items));
}

export function originalsLatestResource(): string {
  const items = getAllArticles().slice(0, 25).map((a) => ({
    title: a.title,
    url: `${BASE}/articles/${a.slug}`,
    author: a.author,
    published: a.publishDate,
    snippet: a.snippet,
  }));
  return clean(formatOriginalsIndex(items));
}

export function eventsUpcomingResource(): string {
  const r = getVrEvents({ limit: 25 });
  return clean(formatEventsList(r.events));
}

export function guidesResource(): string {
  return clean(
    formatGuidesDoc(EXPLAINERS.map((e) => ({ title: e.title, summary: e.summary, url: `${BASE}${e.path}` }))),
  );
}

export function articleResource(slug: string): string {
  const a = getArticleBySlug(slug);
  if (!a) {
    return `<p>Article "${slug}" was not found. List available articles via the vrorg://originals/latest resource.</p>`;
  }
  return clean(
    formatArticle({
      title: a.title,
      author: a.author,
      published: a.publishDate,
      url: `${BASE}/articles/${a.slug}`,
      body_html: a.body,
    }),
  );
}

export function articleList(): Array<{ slug: string; title: string }> {
  return getAllArticles().slice(0, 30).map((a) => ({ slug: a.slug, title: a.title }));
}
