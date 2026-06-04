import { HomeClient } from "@/components/HomeClient";
import { getHomeInitialData } from "@/lib/home-data";

// Server-rendered homepage: the feed, editorials, and stats are read from the
// in-memory engine cache and rendered into the HTML, so non-JS crawlers and AI
// agents get the content at the root URL. HomeClient hydrates and keeps the feed
// live (polls every 5 min). force-dynamic because the feed is runtime state.
// Title/canonical/OG are inherited from the root layout (unchanged from before).
export const dynamic = "force-dynamic";

export default function Home() {
  const initial = getHomeInitialData();
  return <HomeClient initial={initial} />;
}
