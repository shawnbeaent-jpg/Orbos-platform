import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "GA Land Clearing — Professional Land Clearing Across Georgia";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "linear-gradient(135deg, #0B1420 0%, #17212B 55%, #174C3C 130%)",
          color: "#F4F0E8",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 18,
              border: "4px solid #22A06B",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 30,
              fontWeight: 700,
              color: "#F4F0E8",
            }}
          >
            GA
          </div>
          <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: 1 }}>GA LAND CLEARING</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 30, color: "#22A06B", fontWeight: 700, marginBottom: 16 }}>
            {"Georgia's Land Clearing & Site Preparation Partner"}
          </div>
          <div style={{ fontSize: 68, fontWeight: 800, lineHeight: 1.05, maxWidth: 980 }}>
            Professional Land Clearing Across Georgia
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 26, color: "#D8A94A", fontWeight: 700 }}>
          From Overgrown to Build-Ready · Marietta-based · Statewide
        </div>
      </div>
    ),
    { ...size }
  );
}
