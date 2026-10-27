import fs from "node:fs";
import path from "node:path";
import { ImageResponse } from "next/og";

export const OG_ALT = "QR Vibe - Free QR Code Generator With Logo";
export const OG_SIZE = { width: 1200, height: 630 };

/** Shared by the Open Graph and Twitter share images. Embeds the brand lockup (mark + wordmark). */
export function renderShareImage() {
  const lockup = fs.readFileSync(path.join(process.cwd(), "public/brand/og-lockup.png"));
  const src = `data:image/png;base64,${lockup.toString("base64")}`;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "70px 80px",
          background: "linear-gradient(135deg, #090d16 0%, #1e1b4b 60%, #4c1d95 100%)",
          color: "white",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} width={520} height={129} alt="QR Vibe" style={{ marginBottom: "44px" }} />
        <div style={{ fontSize: "70px", fontWeight: 900, lineHeight: 1.1, letterSpacing: "-2px" }}>
          Free QR Code Generator With Logo
        </div>
        <div style={{ fontSize: "32px", color: "#cbd5e1", marginTop: "26px" }}>
          Scan-tested · PNG, JPG & SVG · No sign-up · Never expires
        </div>
      </div>
    ),
    OG_SIZE,
  );
}
