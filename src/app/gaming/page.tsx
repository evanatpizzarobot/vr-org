import type { Metadata } from "next";
import { CategoryHub } from "@/components/CategoryHub";

export const metadata: Metadata = {
  title: "VR Gaming News - Games, Launches & Reviews | VR.org",
  description:
    "Breaking VR gaming news. New game announcements, trailers, release dates, reviews, and updates from the top VR gaming studios and platforms.",
  openGraph: {
    title: "VR Gaming News - Games, Launches & Reviews | VR.org",
    description: "Breaking VR gaming news. New game announcements, trailers, release dates, reviews, and updates.",
    url: "https://vr.org/gaming",
    siteName: "VR.org",
  },
  alternates: {
    canonical: "https://vr.org/gaming",
  },
  twitter: {
    card: "summary_large_image",
    title: "VR Gaming News | VR.org",
    description: "Breaking VR gaming news - launches, trailers, studios, and reviews.",
  },
};

export default function GamingPage() {
  return (
    <CategoryHub
      category="gaming"
      title="Gaming"
      description="VR gaming news, reviews, and analysis. From AAA launches and indie gems to game showcases and studio announcements, we cover the games that make VR worth owning. Our team tracks releases across Quest, PSVR2, SteamVR, and every major platform so you never miss what's next."
    />
  );
}
