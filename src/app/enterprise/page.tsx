import type { Metadata } from "next";
import { CategoryHub } from "@/components/CategoryHub";
import { getCategoryOriginalSummaries } from "@/lib/articles";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Enterprise XR News - Business, Training & Industry | VR.org",
  description:
    "Enterprise VR and AR news. XR adoption in business, training, healthcare, manufacturing, investment trends, and industry analysis.",
  openGraph: {
    title: "Enterprise XR News - Business, Training & Industry | VR.org",
    description: "Enterprise VR and AR news. XR adoption in business, training, healthcare, and industry analysis.",
    url: "https://vr.org/enterprise",
    siteName: "VR.org",
    images: [{ url: "https://vr.org/og-image.png", width: 1200, height: 630 }],
  },
  alternates: {
    canonical: "https://vr.org/enterprise",
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://vr.org/og-image.png"],
    title: "Enterprise XR News | VR.org",
    description: "Enterprise VR and AR news - business adoption, training, and investment.",
  },
};

export default function EnterprisePage() {
  const initialEditorial = getCategoryOriginalSummaries("enterprise", 8);
  return (
    <CategoryHub
      category="enterprise"
      title="Enterprise"
      description="How businesses are adopting VR, AR, and XR technology. Training simulations, healthcare applications, manufacturing workflows, investment trends, and enterprise strategy in the spatial computing industry. We follow the money and the deployments shaping how organizations use immersive tech at scale."
      initialEditorial={initialEditorial}
    />
  );
}
