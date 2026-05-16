import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "AirdropIndia · CryptoTaxIndia";
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
          justifyContent: "center",
          padding: "72px",
          background:
            "linear-gradient(135deg, #0a0a0a 0%, #1a0d2e 50%, #0a0a0a 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            color: "#a78bfa",
            fontSize: 28,
            fontWeight: 600,
            marginBottom: 32,
          }}
        >
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: 7,
              background:
                "linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)",
            }}
          />
          AirdropIndia · CryptoTaxIndia
        </div>
        <div
          style={{
            fontSize: 80,
            fontWeight: 700,
            lineHeight: 1.1,
            marginBottom: 24,
            backgroundImage:
              "linear-gradient(135deg, #fff 0%, #a78bfa 100%)",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          Free crypto airdrops & 30% tax math — for India.
        </div>
        <div
          style={{ fontSize: 28, color: "#a1a1aa", maxWidth: 980 }}
        >
          Section 115BBH + 1% TDS calculator · curated airdrops · AI guides
        </div>
      </div>
    ),
    size,
  );
}
