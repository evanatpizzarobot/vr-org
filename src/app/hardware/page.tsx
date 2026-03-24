import type { Metadata } from "next";
import { CategoryHub } from "@/components/CategoryHub";

export const metadata: Metadata = {
  title: "VR & AR Hardware News — Headsets, Displays & Controllers | VR.org",
  description:
    "Latest virtual reality and augmented reality hardware news. Headset reviews, specs, launches, and teardowns from Quest, Vision Pro, PSVR, Steam Frame, and more.",
  openGraph: {
    title: "VR & AR Hardware News — Headsets, Displays & Controllers | VR.org",
    description: "Latest virtual reality and augmented reality hardware news. Headset reviews, specs, launches, and teardowns.",
    url: "https://vr.org/hardware",
    siteName: "VR.org",
  },
  alternates: {
    canonical: "https://vr.org/hardware",
  },
  twitter: {
    card: "summary_large_image",
    title: "VR & AR Hardware News | VR.org",
    description: "Latest VR and AR hardware news — headsets, displays, controllers, and specs.",
  },
};

export default function HardwarePage() {
  return (
    <CategoryHub
      category="hardware"
      title="Hardware"
      description="VR & AR headsets, controllers, displays, and device specs — from consumer launches to prototype reveals."
    />
  );
}
