import type { Metadata } from "next";
import { CategoryHub } from "@/components/CategoryHub";

export const metadata: Metadata = {
  title: "Enterprise XR News — Business, Training & Industry | VR.org",
  description:
    "Enterprise VR and AR news. XR adoption in business, training, healthcare, manufacturing, investment trends, and industry analysis.",
  openGraph: {
    title: "Enterprise XR News — Business, Training & Industry | VR.org",
    description: "Enterprise VR and AR news. XR adoption in business, training, healthcare, and industry analysis.",
    url: "https://vr.org/enterprise",
    siteName: "VR.org",
  },
  twitter: {
    card: "summary_large_image",
    title: "Enterprise XR News | VR.org",
    description: "Enterprise VR and AR news — business adoption, training, and investment.",
  },
};

export default function EnterprisePage() {
  return (
    <CategoryHub
      category="enterprise"
      title="Enterprise"
      description="Business adoption, workforce training, healthcare, investment, and industry analysis in VR and AR."
    />
  );
}
