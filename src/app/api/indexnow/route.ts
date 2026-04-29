import { NextResponse } from "next/server";
import { getAllArticles } from "@/lib/articles";

// IndexNow key. Intentionally public; the protocol uses domain-ownership
// proof, not a secret. The matching key file lives at /public/{KEY}.txt and
// MUST keep the same value or IndexNow rejects submissions.
const INDEXNOW_KEY = "ba6276c1732e2ee3e9fe37b77fbfaf4a";
const HOST = "vr.org";

const STATIC_URLS = [
  "https://vr.org/",
  "https://vr.org/hardware",
  "https://vr.org/gaming",
  "https://vr.org/software",
  "https://vr.org/enterprise",
  "https://vr.org/ar",
  "https://vr.org/xr",
  "https://vr.org/originals",
  "https://vr.org/best-of",
  "https://vr.org/events",
  "https://vr.org/deals",
  "https://vr.org/what-is-vr",
  "https://vr.org/best-vr-headsets",
  "https://vr.org/best-vr-games",
  "https://vr.org/best-vr-games-2026",
  "https://vr.org/best-vr-apps",
  "https://vr.org/best-vr-fitness",
  "https://vr.org/ar-glasses",
  "https://vr.org/vr-for-beginners",
  "https://vr.org/about",
];

export const dynamic = "force-dynamic";

async function submit(urls: string[]) {
  const body = {
    host: HOST,
    key: INDEXNOW_KEY,
    keyLocation: `https://${HOST}/${INDEXNOW_KEY}.txt`,
    urlList: urls,
  };
  const r = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return { status: r.status, ok: r.ok };
}

function authorize(req: Request): boolean {
  const expected = process.env.INDEXNOW_AUTH_TOKEN;
  if (!expected) return false;
  const token = new URL(req.url).searchParams.get("token");
  return token === expected;
}

export async function POST(req: Request) {
  if (!authorize(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let scope: string | null = null;
  try {
    const body = await req.json().catch(() => ({}));
    scope = body?.scope ?? null;
  } catch {
    /* noop */
  }

  const articles = getAllArticles();
  const articleUrls = articles.map((a) => `https://vr.org/articles/${a.slug}`);

  let urlList: string[];
  if (scope === "articles") {
    urlList = articleUrls;
  } else if (scope === "static") {
    urlList = STATIC_URLS;
  } else if (scope === "latest") {
    urlList = articleUrls.slice(0, 5);
  } else {
    urlList = [...STATIC_URLS, ...articleUrls];
  }

  const result = await submit(urlList);
  return NextResponse.json({
    submitted: urlList.length,
    scope: scope ?? "all",
    indexnow: result,
  });
}

export async function GET() {
  return NextResponse.json({
    note: "POST with ?token=... to submit URLs to IndexNow.",
    body: 'Optional JSON: {"scope":"all"|"articles"|"static"|"latest"}',
    keyLocation: `https://${HOST}/${INDEXNOW_KEY}.txt`,
  });
}
