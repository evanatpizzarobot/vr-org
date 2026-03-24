import type { Metadata } from "next";
import { CategoryHub } from "@/components/CategoryHub";

export const metadata: Metadata = {
  title: "AR & Spatial Computing News — Smart Glasses & Mixed Reality | VR.org",
  description:
    "Latest AR and spatial computing news. Smart glasses, mixed reality, Apple Vision Pro, Meta Orion, and the future of augmented reality.",
  openGraph: {
    title: "AR & Spatial Computing News | VR.org",
    description: "Latest AR news — smart glasses, mixed reality, spatial computing, and more.",
    url: "https://vr.org/ar",
  },
};

export default function ARPage() {
  return (
    <CategoryHub
      category="ar"
      title="AR / Spatial Computing"
      description="Smart glasses, mixed reality, spatial computing, and the expanding world of augmented reality."
    />
  );
}
