import { ImageResponse } from "next/og";

export const alt = "QR Vibe - Free QR Code Generator With Logo";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function TwitterImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #090d16 0%, #1e1b4b 60%, #4c1d95 100%)",
          color: "white",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "40px" }}>
          <div
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "18px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "42px",
              fontWeight: 900,
              background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #ec4899 100%)",
            }}
          >
            V
          </div>
          <div style={{ fontSize: "40px", fontWeight: 800 }}>QR Vibe</div>
        </div>
        <div style={{ fontSize: "72px", fontWeight: 900, lineHeight: 1.1, letterSpacing: "-2px" }}>
          Free QR Code Generator With Logo
        </div>
        <div style={{ fontSize: "32px", color: "#cbd5e1", marginTop: "28px" }}>
          Scan-tested · PNG, JPG & SVG · No sign-up · Never expires
        </div>
      </div>
    ),
    size,
  );
}
