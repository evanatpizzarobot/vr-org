import { NextRequest, NextResponse } from "next/server";
import { getAllArticles, getFeaturedArticles } from "@/lib/articles";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const category = searchParams.get("category");
  const featured = searchParams.get("featured");
  const mix = searchParams.get("mix");
  const limit = parseInt(searchParams.get("limit") || "0", 10);

  let articles = getAllArticles();

  if (category) {
    articles = articles.filter(
      (a) => a.category === category || a.tags.includes(category)
    );
  }

  if (featured === "true") {
    articles = category
      ? getFeaturedArticles(category)
      : articles.filter((a) => a.featured);
  }

  // Mix mode: prioritize all articles from today (so a busy publish day
  // never hides a piece), then fill remaining slots with the
  // diversity-maximizing algorithm against older content.
  if (mix === "true" && limit > 0) {
    const todayIso = new Date().toISOString().slice(0, 10);
    const todayArticles = articles.filter((a) => a.publishDate === todayIso);
    const olderArticles = articles.filter((a) => a.publishDate !== todayIso);

    const picked: typeof articles = todayArticles.slice(0, limit);
    const pickedIds = new Set(picked.map((p) => p.id));
    const usedAuthors = new Set(picked.map((p) => p.author));
    const usedCategories = new Set(picked.map((p) => p.category));

    // Pass 1: one older article per unique author
    for (const a of olderArticles) {
      if (picked.length >= limit) break;
      if (!usedAuthors.has(a.author)) {
        usedAuthors.add(a.author);
        usedCategories.add(a.category);
        picked.push(a);
        pickedIds.add(a.id);
      }
    }

    // Pass 2: fill remaining slots preferring unseen categories
    if (picked.length < limit) {
      for (const a of olderArticles) {
        if (picked.length >= limit) break;
        if (!pickedIds.has(a.id) && !usedCategories.has(a.category)) {
          usedCategories.add(a.category);
          picked.push(a);
          pickedIds.add(a.id);
        }
      }
    }

    // Pass 3: fill any remaining with newest unused
    if (picked.length < limit) {
      for (const a of olderArticles) {
        if (picked.length >= limit) break;
        if (!pickedIds.has(a.id)) {
          picked.push(a);
          pickedIds.add(a.id);
        }
      }
    }

    articles = picked;
  }

  // Return without the full body to keep responses light
  const summaries = articles.map(({ body, ...rest }) => rest);

  return NextResponse.json({ articles: summaries });
}
