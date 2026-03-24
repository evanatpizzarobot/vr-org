import { NextRequest, NextResponse } from "next/server";
import { getFeaturedForCategory } from "@/lib/featured";
import { startFeedEngine } from "@/lib/rss/engine";

startFeedEngine();

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const category = searchParams.get("category");

  if (!category) {
    return NextResponse.json(
      { error: "category parameter required" },
      { status: 400 }
    );
  }

  const articles = getFeaturedForCategory(category);

  return NextResponse.json({
    featured: articles,
    category,
    count: articles.length,
  });
}
