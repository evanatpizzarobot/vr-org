import type { Metadata } from "next";
import { CategoryHub } from "@/components/CategoryHub";

export const metadata: Metadata = {
  title: "Enterprise XR News - Business, Training & Industry | VR.org",
  description:
    "Enterprise VR and AR news. XR adoption in business, training, healthcare, manufacturing, investment trends, and industry analysis.",
  openGraph: {
    title: "Enterprise XR News - Business, Training & Industry | VR.org",
    description: "Enterprise VR and AR news. XR adoption in business, training, healthcare, and industry analysis.",
    url: "https://vr.org/enterprise",
    siteName: "VR.org",
  },
  alternates: {
    canonical: "https://vr.org/enterprise",
  },
  twitter: {
    card: "summary_large_image",
    title: "Enterprise XR News | VR.org",
    description: "Enterprise VR and AR news - business adoption, training, and investment.",
  },
};

export default function EnterprisePage() {
  return (
    <CategoryHub
      category="enterprise"
      title="Enterprise"
      description="How businesses are adopting VR, AR, and XR technology. Training simulations, healthcare applications, manufacturing workflows, investment trends, and enterprise strategy in the spatial computing industry. We follow the money and the deployments shaping how organizations use immersive tech at scale."
    />
  );
}
