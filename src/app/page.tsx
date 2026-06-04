import { HomeClient } from "@/components/HomeClient";
import { getHomeInitialData } from "@/lib/home-data";
import { getAllArticles } from "@/lib/articles";
import { StructuredData, newsCollectionSchema } from "@/components/StructuredData";

// Server-rendered homepage: the feed, editorials, and stats are read from the
// in-memory engine cache and rendered into the HTML, so non-JS crawlers and AI
// agents get the content at the root URL. HomeClient hydrates and keeps the feed
// live (polls every 5 min). force-dynamic because the feed is runtime state.
// Title/canonical/OG are inherited from the root layout (unchanged from before).
export const dynamic = "force-dynamic";

export default function Home() {
  const initial = getHomeInitialData();

  // CollectionPage + ItemList of the newest VR.org originals, so the homepage's
  // own reporting is machine-readable for Google Top Stories and AI citation.
  const recentOriginals = getAllArticles()
    .slice(0, 20)
    .map((a) => ({
      slug: a.slug,
      title: a.title,
      publishDate: a.publishDate,
      author: a.author,
    }));

  return (
    <>
      <StructuredData
        data={newsCollectionSchema(
          "VR.org: VR, AR & XR News",
          "The latest virtual reality, augmented reality, and XR news, plus original reporting and analysis from the VR.org team.",
          "https://vr.org/",
          recentOriginals
        )}
      />
      <HomeClient initial={initial} />
    </>
  );
}
