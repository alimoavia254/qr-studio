import { ImageResponse } from "next/og";

const SIZES = [192, 512];

export function generateStaticParams() {
  return SIZES.map((s) => ({ size: String(s) }));
}

export async function GET(_req: Request, ctx: { params: Promise<{ size: string }> }) {
  const { size } = await ctx.params;
  const px = SIZES.includes(Number(size)) ? Number(size) : 512;
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
          color: "white",
          fontWeight: 900,
          fontSize: px * 0.55,
          letterSpacing: -px * 0.02,
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        V
      </div>
    ),
    { width: px, height: px }
  );
}
