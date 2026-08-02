import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

// Favicon: GA monogram badge in brand emerald (spec §4 favicon).
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0B1420",
          borderRadius: 7,
          border: "2px solid #22A06B",
          color: "#F4F0E8",
          fontSize: 15,
          fontWeight: 700,
          fontFamily: "sans-serif",
        }}
      >
        GA
      </div>
    ),
    { ...size }
  );
}
