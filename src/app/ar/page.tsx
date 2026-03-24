import type { Metadata } from "next";
import { CategoryHub } from "@/components/CategoryHub";

export const metadata: Metadata = {
  title: "Augmented Reality News - AR Glasses & Spatial Computing | VR.org",
  description:
    "Augmented reality and spatial computing news. Smart glasses, AR wearables, mixed reality, Apple Vision Pro, and the future of AR technology.",
  openGraph: {
    title: "Augmented Reality News - AR Glasses & Spatial Computing | VR.org",
    description: "Augmented reality and spatial computing news. Smart glasses, mixed reality, and the future of AR.",
    url: "https://vr.org/ar",
    siteName: "VR.org",
  },
  alternates: {
    canonical: "https://vr.org/ar",
  },
  twitter: {
    card: "summary_large_image",
    title: "AR & Spatial Computing News | VR.org",
    description: "Augmented reality news - smart glasses, spatial computing, and mixed reality.",
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
