import { ImageResponse } from "next/og";
import { getArticleBySlug } from "@/lib/articles";

// Branded per-article social card. The file convention wires this into
// og:image automatically (and X falls back to og:image when twitter:image
// is absent), replacing the old behavior of pointing social cards at the
// article's first inline image, which had arbitrary aspect ratios and could
// die when a third-party host removed the file. The NewsArticle schema in
// page.tsx still uses the real inline photo, which Google prefers.
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "VR.org article";

const CATEGORY_LABELS: Record<string, string> = {
  hardware: "Hardware",
  gaming: "Gaming",
  software: "Software",
  enterprise: "Enterprise",
  ar: "AR / Spatial",
  xr: "XR",
};

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  const title = article?.title || "VR News, AR News & XR News";
  const category = article
    ? CATEGORY_LABELS[article.category] || article.category
    : "News";
  const author = article?.author || "VR.org";
  const date = article
    ? new Date(article.publishDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "UTC",
      })
    : "";

  // Long headlines step down so four lines still fit above the byline.
  const titleSize = title.length > 90 ? 44 : title.length > 60 ? 52 : 60;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "56px 64px",
          background:
            "linear-gradient(135deg, #0a0e17 0%, #111827 50%, #0a0e17 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Subtle grid overlay */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage:
              "linear-gradient(rgba(0,229,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.03) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Glow effect */}
        <div
          style={{
            position: "absolute",
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(0,229,255,0.07) 0%, transparent 70%)",
            top: "-180px",
            right: "-120px",
          }}
        />

        {/* Header: wordmark + category */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            zIndex: 1,
          }}
        >
          <div
            style={{
              fontSize: "40px",
              fontWeight: 800,
              color: "#e8edf5",
              letterSpacing: "-1px",
              display: "flex",
            }}
          >
            VR
            <span style={{ color: "#00e5ff" }}>.org</span>
          </div>
          <div
            style={{
              fontSize: "20px",
              fontWeight: 600,
              color: "#00e5ff",
              textTransform: "uppercase",
              letterSpacing: "4px",
              display: "flex",
            }}
          >
            {category}
          </div>
        </div>

        {/* Headline */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "28px",
            zIndex: 1,
          }}
        >
          <div
            style={{
              width: "88px",
              height: "5px",
              background: "linear-gradient(90deg, #0891B2 0%, #00e5ff 100%)",
              borderRadius: "3px",
              display: "flex",
            }}
          />
          <div
            style={{
              fontSize: `${titleSize}px`,
              fontWeight: 800,
              color: "#e8edf5",
              letterSpacing: "-1px",
              lineHeight: 1.18,
              display: "flex",
            }}
          >
            {title}
          </div>
        </div>

        {/* Byline */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            zIndex: 1,
          }}
        >
          <div
            style={{ fontSize: "22px", color: "#8896ab", display: "flex" }}
          >
            By {author}
          </div>
          <div
            style={{ fontSize: "22px", color: "#4a5568", display: "flex" }}
          >
            {date}
          </div>
        </div>
      </div>
    ),
    size
  );
}
