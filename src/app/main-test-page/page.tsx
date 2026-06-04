import type { Metadata } from "next";
import { HomeClient } from "@/components/HomeClient";
import { getHomeInitialData } from "@/lib/home-data";

// Staging copy of the homepage, server-rendered with the feed already in the
// HTML. Noindexed so it never competes with "/" in search or gets crawled as a
// duplicate. Once validated, the same HomeClient + getHomeInitialData wiring
// moves into app/page.tsx and this route is deleted.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Home (SSR preview) | VR.org",
  robots: { index: false, follow: false },
  alternates: { canonical: "https://vr.org/" },
};

export default function MainTestPage() {
  const initial = getHomeInitialData();
  return <HomeClient initial={initial} />;
}
