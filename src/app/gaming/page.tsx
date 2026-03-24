import type { Metadata } from "next";
import { CategoryHub } from "@/components/CategoryHub";

export const metadata: Metadata = {
  title: "VR Gaming News — Games, Launches & Studios | VR.org",
  description:
    "Latest VR gaming news. Game launches, trailers, studio announcements, mods, and reviews across Quest, PCVR, PSVR 2, and more.",
  openGraph: {
    title: "VR Gaming News | VR.org",
    description: "Latest VR gaming news — launches, trailers, studios, and reviews.",
    url: "https://vr.org/gaming",
  },
};

export default function GamingPage() {
  return (
    <CategoryHub
      category="gaming"
      title="Gaming"
      description="VR game launches, trailers, studio news, mods, and reviews across all platforms."
    />
  );
}
