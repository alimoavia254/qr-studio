"use client";

import React, { useEffect, useRef, useState } from "react";
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
  /** Draw only once the canvas scrolls into view (gallery with many thumbnails) */
  lazy?: boolean;
}

export function PosterCanvas({ spec, px, className, getQr, fake, tick, label, lazy }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const [visible, setVisible] = useState(!lazy);
  const { H } = posterSize(spec.layout, px);

  useEffect(() => {
    if (!lazy || visible) return;
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [lazy, visible]);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || !visible) return;
    const { W, H: h } = posterSize(spec.layout, px);
    canvas.width = W;
    canvas.height = h;
    ctx.clearRect(0, 0, W, h);
    const qr = getQr ? getQr() : makeFakeQr(Math.round(W * 0.6), fake?.dark ?? "#111", "#ffffff", fake?.eye ?? fake?.dark ?? "#111");
    drawPoster(ctx, W, h, spec, qr);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    px,
    tick,
    visible,
    spec.templateId,
    spec.layout,
    spec.alt,
    spec.icon,
    spec.pattern,
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
