import type { Metadata } from "next";
import { CategoryHub } from "@/components/CategoryHub";

export const metadata: Metadata = {
  title: "VR & AR Hardware News — Headsets, Displays & Controllers | VR.org",
  description:
    "Latest VR and AR hardware news. Headset reviews, display technology, controller innovations, and specs for Meta Quest, Apple Vision Pro, PSVR 2, Steam Frame, and more.",
  openGraph: {
    title: "VR & AR Hardware News | VR.org",
    description: "Latest VR and AR hardware news — headsets, displays, controllers, and specs.",
    url: "https://vr.org/hardware",
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
