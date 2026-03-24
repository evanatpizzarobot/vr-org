import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0a0e17 0%, #111827 50%, #0a0e17 100%)",
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
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(0,229,255,0.08) 0%, transparent 70%)",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
            zIndex: 1,
          }}
        >
          <div
            style={{
              fontSize: "72px",
              fontWeight: 800,
              color: "#e8edf5",
              letterSpacing: "-2px",
              display: "flex",
            }}
          >
            VR
            <span style={{ color: "#00e5ff" }}>.org</span>
          </div>

          <div
            style={{
              fontSize: "24px",
              color: "#8896ab",
              fontWeight: 400,
              letterSpacing: "0.5px",
            }}
          >
            Virtual Reality & Augmented Reality News
          </div>

          <div
            style={{
              display: "flex",
              gap: "24px",
              marginTop: "12px",
              fontSize: "14px",
              color: "#4a5568",
              textTransform: "uppercase",
              letterSpacing: "3px",
              fontWeight: 600,
            }}
          >
            <span>Hardware</span>
            <span style={{ color: "#1e293b" }}>•</span>
            <span>Gaming</span>
            <span style={{ color: "#1e293b" }}>•</span>
            <span>Software</span>
            <span style={{ color: "#1e293b" }}>•</span>
            <span>Enterprise</span>
            <span style={{ color: "#1e293b" }}>•</span>
            <span>AR</span>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
