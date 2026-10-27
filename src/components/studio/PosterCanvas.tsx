"use client";

import React, { useEffect, useRef } from "react";
import { drawPoster, makeFakeQr, posterSize, type PosterSpec } from "@/lib/posterRenderer";

interface Props {
  spec: PosterSpec;
  /** Pixel width of the canvas bitmap. CSS size is controlled with className. */
  px: number;
  className?: string;
  /** Live preview: the real QR canvas. Omit to draw a placeholder QR (template gallery). */
  getQr?: () => CanvasImageSource | null;
  /** Placeholder QR colours (gallery only) */
  fake?: { dark: string; eye: string };
  /** Changes whenever the real QR was re-rendered, to trigger a redraw */
  tick?: number;
  label?: string;
}

export function PosterCanvas({ spec, px, className, getQr, fake, tick, label }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const { H } = posterSize(spec.templateId, px);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const { W, H: h } = posterSize(spec.templateId, px);
    canvas.width = W;
    canvas.height = h;
    ctx.clearRect(0, 0, W, h);
    const qr = getQr ? getQr() : makeFakeQr(Math.round(W * 0.6), fake?.dark ?? "#111", "#ffffff", fake?.eye ?? fake?.dark ?? "#111");
    drawPoster(ctx, W, h, spec, qr);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    px,
    tick,
    spec.templateId,
    spec.title,
    spec.subtitle,
    spec.brand,
    spec.footer,
    spec.showViewfinder,
    spec.showSteps,
    spec.card,
    spec.text,
    spec.accent,
    fake?.dark,
    fake?.eye,
  ]);

  return <canvas ref={ref} width={px} height={H} className={className} role="img" aria-label={label ?? "Poster preview"} />;
}
