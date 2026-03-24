import type { Metadata } from "next";
import { CategoryHub } from "@/components/CategoryHub";

export const metadata: Metadata = {
  title: "Enterprise XR News — Business, Training & Investment | VR.org",
  description:
    "Latest enterprise XR news. Business adoption, workforce training, healthcare VR, investment trends, and industry analysis.",
  openGraph: {
    title: "Enterprise XR News | VR.org",
    description: "Latest enterprise XR news — business adoption, training, healthcare, and investment.",
    url: "https://vr.org/enterprise",
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
