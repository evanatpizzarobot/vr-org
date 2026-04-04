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

  // Mix mode: pick articles that maximize writer + category diversity
  if (mix === "true" && limit > 0) {
    const picked: typeof articles = [];
    const usedAuthors = new Set<string>();
    const usedCategories = new Set<string>();

    // Pass 1: one article per unique author (newest first, already sorted)
    for (const a of articles) {
      if (picked.length >= limit) break;
      if (!usedAuthors.has(a.author)) {
        usedAuthors.add(a.author);
        usedCategories.add(a.category);
        picked.push(a);
      }
    }

    // Pass 2: fill remaining slots preferring unseen categories
    if (picked.length < limit) {
      const pickedIds = new Set(picked.map((p) => p.id));
      for (const a of articles) {
        if (picked.length >= limit) break;
        if (!pickedIds.has(a.id) && !usedCategories.has(a.category)) {
          usedCategories.add(a.category);
          picked.push(a);
          pickedIds.add(a.id);
        }
      }
      // Pass 3: fill any remaining with newest unused
      for (const a of articles) {
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
