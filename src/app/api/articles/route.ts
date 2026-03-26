import { NextRequest, NextResponse } from "next/server";
import { getAllArticles, getFeaturedArticles } from "@/lib/articles";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const category = searchParams.get("category");
  const featured = searchParams.get("featured");

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

  // Return without the full body to keep responses light
  const summaries = articles.map(({ body, ...rest }) => rest);

  return NextResponse.json({ articles: summaries });
}
