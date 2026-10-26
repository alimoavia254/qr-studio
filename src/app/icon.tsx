import { ImageResponse } from "next/og";

export const size = {
  width: 48,
  height: 48,
};
export const contentType = "image/png";

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
          background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #ec4899 100%)",
          borderRadius: "11px",
          color: "white",
          fontWeight: 900,
          fontSize: "26px",
          letterSpacing: "-1px",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        V
      </div>
    ),
    {
      ...size,
    }
  );
}
