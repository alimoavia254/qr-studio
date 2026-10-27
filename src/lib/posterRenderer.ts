import type { PosterTemplateId } from "@/types/qr";

/**
 * One canvas renderer for every poster: the live preview, the template gallery thumbnails and the
 * PNG / JPG / WebP / PDF export all call drawPoster(), so what you see is exactly what you download.
 * Everything is drawn in a virtual 1000-unit-wide space and scaled to the real canvas size.
 */

export interface PosterSpec {
  templateId: PosterTemplateId;
  title: string;
  subtitle: string;
  brand: string;
  footer: string;
  showViewfinder: boolean;
  showSteps: boolean;
  card: string;
  text: string;
  accent: string;
}

export const POSTER_ASPECT: Partial<Record<PosterTemplateId, number>> = {
  "social-creator": 1.78, // 9:16 story format
};

export const posterAspect = (id: PosterTemplateId) => POSTER_ASPECT[id] ?? 1.42;

export function posterSize(id: PosterTemplateId, width: number) {
  return { W: width, H: Math.round(width * posterAspect(id)) };
}

const SANS = "system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";
const SERIF = "Georgia, 'Times New Roman', Times, serif";
const MONO = "ui-monospace, SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace";
const STEPS_TEXT = "1. Open Camera   •   2. Point at QR   •   3. Tap Link";

type Ctx = CanvasRenderingContext2D;
type Img = CanvasImageSource;

/* ------------------------------ colour helpers ------------------------------ */

function rgbOf(hex: string): [number, number, number] {
  let s = hex.replace("#", "").trim();
  if (s.length === 3) s = s.split("").map((c) => c + c).join("");
  const n = parseInt(s.slice(0, 6), 16);
  if (!Number.isFinite(n)) return [0, 0, 0];
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
const rgba = (hex: string, a: number) => {
  const [r, g, b] = rgbOf(hex);
  return `rgba(${r},${g},${b},${a})`;
};
/** amt > 0 lightens towards white, amt < 0 darkens towards black */
const shade = (hex: string, amt: number) => {
  const [r, g, b] = rgbOf(hex);
  const t = amt < 0 ? 0 : 255;
  const p = Math.abs(amt);
  const f = (c: number) => Math.round((t - c) * p + c);
  return `rgb(${f(r)},${f(g)},${f(b)})`;
};
const isDark = (hex: string) => {
  const [r, g, b] = rgbOf(hex);
  return (r * 299 + g * 587 + b * 114) / 1000 < 140;
};

/* ------------------------------ drawing helpers ------------------------------ */

function rr(ctx: Ctx, x: number, y: number, w: number, h: number, r: number) {
  const k = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + k, y);
  ctx.arcTo(x + w, y, x + w, y + h, k);
  ctx.arcTo(x + w, y + h, x, y + h, k);
  ctx.arcTo(x, y + h, x, y, k);
  ctx.arcTo(x, y, x + w, y, k);
  ctx.closePath();
}

function setSpacing(ctx: Ctx, px: number) {
  if ("letterSpacing" in ctx) (ctx as unknown as { letterSpacing: string }).letterSpacing = `${px}px`;
}

interface TextOpts {
  size: number;
  color: string;
  maxW: number;
  weight?: string | number;
  family?: string;
  maxLines?: number;
  lineH?: number;
  align?: CanvasTextAlign;
  spacing?: number;
  italic?: boolean;
  upper?: boolean;
}

function wrapLines(ctx: Ctx, str: string, maxW: number): string[] {
  const words = str.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (ctx.measureText(test).width <= maxW || !line) line = test;
    else {
      lines.push(line);
      line = w;
    }
  }
  if (line) lines.push(line);
  return lines;
}

/** Draws wrapped text that shrinks to fit. (x, y) = centre-x / top of the first line. Returns the bottom y. */
function text(ctx: Ctx, raw: string, x: number, y: number, o: TextOpts): number {
  const str = o.upper ? raw.toUpperCase() : raw;
  if (!str.trim()) return y;
  const maxLines = o.maxLines ?? 1;
  const family = o.family ?? SANS;
  let size = o.size;
  let lines: string[] = [];
  ctx.save();
  ctx.textBaseline = "top";
  ctx.textAlign = o.align ?? "center";
  setSpacing(ctx, o.spacing ?? 0);
  for (;;) {
    ctx.font = `${o.italic ? "italic " : ""}${o.weight ?? 600} ${size}px ${family}`;
    lines = wrapLines(ctx, str, o.maxW);
    const fits = lines.length <= maxLines && lines.every((l) => ctx.measureText(l).width <= o.maxW);
    if (fits || size <= o.size * 0.4) break;
    size -= 2;
  }
  if (lines.length > maxLines) lines = lines.slice(0, maxLines);
  const lh = size * (o.lineH ?? 1.12);
  ctx.fillStyle = o.color;
  lines.forEach((l, i) => ctx.fillText(l, x, y + i * lh));
  ctx.restore();
  return y + lines.length * lh;
}

interface PlateOpts {
  pad: number;
  radius: number;
  fill?: string;
  stroke?: string;
  strokeW?: number;
  shadow?: string;
  /** hard offset shadow (retro style) */
  hard?: { color: string; dx: number; dy: number };
}

/** White plate + QR. `top` is the outer top edge. Returns the outer rect. */
function plate(ctx: Ctx, cx: number, top: number, size: number, qr: Img | null, o: PlateOpts) {
  const full = size + o.pad * 2;
  const x = cx - full / 2;
  if (o.hard) {
    ctx.fillStyle = o.hard.color;
    rr(ctx, x + o.hard.dx, top + o.hard.dy, full, full, o.radius);
    ctx.fill();
  }
  ctx.save();
  if (o.shadow) {
    ctx.shadowColor = o.shadow;
    ctx.shadowBlur = 50;
    ctx.shadowOffsetY = 18;
  }
  ctx.fillStyle = o.fill ?? "#ffffff";
  rr(ctx, x, top, full, full, o.radius);
  ctx.fill();
  ctx.restore();
  if (o.stroke) {
    ctx.strokeStyle = o.stroke;
    ctx.lineWidth = o.strokeW ?? 6;
    rr(ctx, x, top, full, full, o.radius);
    ctx.stroke();
  }
  if (qr) ctx.drawImage(qr, cx - size / 2, top + o.pad, size, size);
  return { x, y: top, w: full, h: full };
}

function viewfinder(ctx: Ctx, r: { x: number; y: number; w: number; h: number }, color: string, gap = 26, arm = 70, lw = 10) {
  const x0 = r.x - gap;
  const y0 = r.y - gap;
  const x1 = r.x + r.w + gap;
  const y1 = r.y + r.h + gap;
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = lw;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  const c = (a: [number, number], b: [number, number], d: [number, number]) => {
    ctx.beginPath();
    ctx.moveTo(...a);
    ctx.lineTo(...b);
    ctx.lineTo(...d);
    ctx.stroke();
  };
  c([x0, y0 + arm], [x0, y0], [x0 + arm, y0]);
  c([x1 - arm, y0], [x1, y0], [x1, y0 + arm]);
  c([x0, y1 - arm], [x0, y1], [x0 + arm, y1]);
  c([x1 - arm, y1], [x1, y1], [x1, y1 - arm]);
  ctx.restore();
}

function stepsPill(ctx: Ctx, cx: number, y: number, w: number, bg: string, fg: string, h = 74) {
  ctx.fillStyle = bg;
  rr(ctx, cx - w / 2, y, w, h, h / 2);
  ctx.fill();
  text(ctx, STEPS_TEXT, cx, y + h * 0.3, { size: 28, weight: 800, color: fg, maxW: w * 0.92 });
}

function star(ctx: Ctx, cx: number, cy: number, outer: number, inner: number, points: number, rot = -Math.PI / 2) {
  ctx.beginPath();
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const a = rot + (i * Math.PI) / points;
    const px = cx + Math.cos(a) * r;
    const py = cy + Math.sin(a) * r;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
}

function wifiIcon(ctx: Ctx, cx: number, cy: number, r: number, color: string, lw: number) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = lw;
  ctx.lineCap = "round";
  for (let i = 1; i <= 3; i++) {
    ctx.beginPath();
    ctx.arc(cx, cy, (r * i) / 3, -Math.PI * 0.8, -Math.PI * 0.2);
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.arc(cx, cy, lw * 0.9, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function sparkle(ctx: Ctx, cx: number, cy: number, r: number, color: string) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(cx, cy - r);
  ctx.quadraticCurveTo(cx, cy, cx + r, cy);
  ctx.quadraticCurveTo(cx, cy, cx, cy + r);
  ctx.quadraticCurveTo(cx, cy, cx - r, cy);
  ctx.quadraticCurveTo(cx, cy, cx, cy - r);
  ctx.fill();
}

function radial(ctx: Ctx, cx: number, cy: number, r: number, color: string, a0: number) {
  const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
  g.addColorStop(0, rgba(color, a0));
  g.addColorStop(1, rgba(color, 0));
  ctx.fillStyle = g;
  ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
}

/* ---------------------------------- layouts ---------------------------------- */

type Layout = (ctx: Ctx, W: number, H: number, s: PosterSpec, qr: Img | null) => void;

/** Clean white card with camera corners. */
const minimal: Layout = (ctx, W, H, s, qr) => {
  const dark = isDark(s.card);
  ctx.fillStyle = s.card;
  ctx.fillRect(0, 0, W, H);
  const bar = ctx.createLinearGradient(0, 0, W, 0);
  bar.addColorStop(0, s.accent);
  bar.addColorStop(1, shade(s.accent, 0.4));
  ctx.fillStyle = bar;
  ctx.fillRect(0, 0, W, 20);

  text(ctx, s.brand, W / 2, 100, { size: 26, weight: 800, color: s.accent, maxW: 860, spacing: 6, upper: true });
  const yT = text(ctx, s.title, W / 2, 156, { size: 96, weight: 900, color: s.text, maxW: 860, maxLines: 2, lineH: 1.04, upper: true });
  text(ctx, s.subtitle, W / 2, yT + 18, { size: 36, weight: 500, color: rgba(s.text, 0.66), maxW: 820, maxLines: 2 });

  const size = 540;
  const r = plate(ctx, W / 2, 520, size, qr, {
    pad: 34,
    radius: 44,
    shadow: dark ? "rgba(0,0,0,0.5)" : "rgba(15,23,42,0.18)",
    stroke: dark ? undefined : "rgba(15,23,42,0.06)",
    strokeW: 4,
  });
  if (s.showViewfinder) viewfinder(ctx, r, s.accent);
  if (s.showSteps) stepsPill(ctx, W / 2, r.y + r.h + 78, 860, s.accent, "#fff");
  text(ctx, s.footer, W / 2, H - 112, { size: 28, weight: 500, color: rgba(s.text, 0.55), maxW: 860, maxLines: 2 });
};

/** Diagonal colour header, QR card overlapping it, dark cashier-style base. */
const payment: Layout = (ctx, W, H, s, qr) => {
  ctx.fillStyle = s.card;
  ctx.fillRect(0, 0, W, H);
  const g = ctx.createLinearGradient(0, 0, W, 520);
  g.addColorStop(0, shade(s.accent, -0.15));
  g.addColorStop(1, shade(s.accent, 0.25));
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(W, 0);
  ctx.lineTo(W, 440);
  ctx.lineTo(0, 560);
  ctx.closePath();
  ctx.fill();
  // soft rings
  ctx.strokeStyle = "rgba(255,255,255,0.12)";
  ctx.lineWidth = 3;
  for (let i = 0; i < 4; i++) {
    ctx.beginPath();
    ctx.arc(W - 40, 40, 120 + i * 70, 0, Math.PI * 2);
    ctx.stroke();
  }
  // brand chip
  ctx.fillStyle = "rgba(255,255,255,0.2)";
  rr(ctx, 70, 70, 360, 56, 28);
  ctx.fill();
  text(ctx, s.brand, 250, 84, { size: 24, weight: 800, color: "#fff", maxW: 320, spacing: 3, upper: true });
  const yT = text(ctx, s.title, 70, 160, { size: 104, weight: 900, color: "#fff", maxW: 760, maxLines: 2, lineH: 1.02, align: "left", upper: true });
  text(ctx, s.subtitle, 70, yT + 14, { size: 34, weight: 600, color: "rgba(255,255,255,0.86)", maxW: 700, maxLines: 2, align: "left" });

  const size = 500;
  const r = plate(ctx, W / 2, 560, size, qr, { pad: 36, radius: 46, shadow: "rgba(0,0,0,0.5)" });
  if (s.showViewfinder) viewfinder(ctx, r, "#ffffff", 28);
  // trust strip (replaced by the steps pill when that is on)
  const y = r.y + r.h + 60;
  const chips = s.showSteps ? [] : ["Instant", "Secure", "Contactless"];
  const cw = 250;
  const startX = W / 2 - (cw * 3 + 24 * 2) / 2;
  chips.forEach((c, i) => {
    ctx.fillStyle = "rgba(255,255,255,0.08)";
    rr(ctx, startX + i * (cw + 24), y, cw, 64, 32);
    ctx.fill();
    ctx.fillStyle = s.accent;
    ctx.beginPath();
    ctx.arc(startX + i * (cw + 24) + 34, y + 32, 9, 0, Math.PI * 2);
    ctx.fill();
    text(ctx, c, startX + i * (cw + 24) + 140, y + 18, { size: 28, weight: 700, color: s.text, maxW: 170 });
  });
  if (s.showSteps) stepsPill(ctx, W / 2, y, 860, s.accent, "#fff", 68);
  text(ctx, s.footer, W / 2, H - 100, { size: 27, weight: 500, color: rgba(s.text, 0.6), maxW: 860, maxLines: 2 });
};

/** Warm paper table-tent with a double border and serif type. */
const menu: Layout = (ctx, W, H, s, qr) => {
  const dark = isDark(s.card);
  ctx.fillStyle = s.card;
  ctx.fillRect(0, 0, W, H);
  // paper speckle
  for (let i = 0; i < 260; i++) {
    const x = (i * 7919) % W;
    const y = (i * 104729) % H;
    ctx.fillStyle = rgba(s.accent, 0.05);
    ctx.fillRect(x, y, 3, 3);
  }
  ctx.strokeStyle = s.accent;
  ctx.lineWidth = 6;
  rr(ctx, 40, 40, W - 80, H - 80, 24);
  ctx.stroke();
  ctx.lineWidth = 2;
  rr(ctx, 62, 62, W - 124, H - 124, 14);
  ctx.stroke();
  // corner diamonds
  ([[62, 62], [W - 62, 62], [62, H - 62], [W - 62, H - 62]] as [number, number][]).forEach(([x, y]) => {
    ctx.fillStyle = s.card;
    ctx.fillRect(x - 18, y - 18, 36, 36);
    ctx.fillStyle = s.accent;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(Math.PI / 4);
    ctx.fillRect(-11, -11, 22, 22);
    ctx.restore();
  });

  text(ctx, s.brand, W / 2, 130, { size: 28, weight: 700, family: SERIF, color: s.accent, maxW: 760, spacing: 8, upper: true });
  // divider with diamond
  const divider = (y: number) => {
    ctx.strokeStyle = s.accent;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(W / 2 - 300, y);
    ctx.lineTo(W / 2 - 40, y);
    ctx.moveTo(W / 2 + 40, y);
    ctx.lineTo(W / 2 + 300, y);
    ctx.stroke();
    ctx.fillStyle = s.accent;
    ctx.save();
    ctx.translate(W / 2, y);
    ctx.rotate(Math.PI / 4);
    ctx.fillRect(-12, -12, 24, 24);
    ctx.restore();
  };
  divider(205);
  const yT = text(ctx, s.title, W / 2, 245, { size: 108, weight: 700, family: SERIF, color: s.text, maxW: 780, maxLines: 2, lineH: 1.04, upper: true });
  text(ctx, s.subtitle, W / 2, yT + 12, { size: 38, weight: 400, italic: true, family: SERIF, color: rgba(s.text, dark ? 0.8 : 0.7), maxW: 760, maxLines: 2 });

  const size = 480;
  const r = plate(ctx, W / 2, 560, size, qr, { pad: 30, radius: 34, stroke: s.accent, strokeW: 8 });
  if (s.showViewfinder) viewfinder(ctx, r, s.accent, 30, 60, 8);
  if (s.showSteps) stepsPill(ctx, W / 2, r.y + r.h + 44, 800, s.accent, dark ? "#000" : "#fff", 66);
  else divider(r.y + r.h + 70);
  text(ctx, s.footer, W / 2, H - 150, { size: 32, weight: 400, italic: true, family: SERIF, color: rgba(s.text, 0.75), maxW: 760, maxLines: 2 });
};

/** Gradient sign with a big Wi-Fi symbol. */
const wifi: Layout = (ctx, W, H, s, qr) => {
  const g = ctx.createLinearGradient(0, 0, W, H);
  g.addColorStop(0, s.card);
  g.addColorStop(1, shade(s.accent, -0.55));
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = rgba(s.accent, 0.18);
  ctx.lineWidth = 3;
  for (let i = 1; i <= 6; i++) {
    ctx.beginPath();
    ctx.arc(W / 2, 330, i * 150, Math.PI * 1.1, Math.PI * 1.9);
    ctx.stroke();
  }
  // icon disc
  const iconY = 200;
  ctx.fillStyle = rgba(s.accent, 0.22);
  ctx.beginPath();
  ctx.arc(W / 2, iconY + 20, 130, 0, Math.PI * 2);
  ctx.fill();
  wifiIcon(ctx, W / 2, iconY + 70, 120, "#ffffff", 22);

  const yT = text(ctx, s.title, W / 2, 390, { size: 112, weight: 900, color: "#fff", maxW: 860, maxLines: 2, lineH: 1.02, upper: true });
  text(ctx, s.subtitle, W / 2, yT + 12, { size: 36, weight: 500, color: "rgba(255,255,255,0.78)", maxW: 800, maxLines: 2 });

  const size = s.showSteps ? 430 : 470;
  const r = plate(ctx, W / 2, s.showSteps ? 600 : 660, size, qr, { pad: 32, radius: 40, shadow: "rgba(0,0,0,0.45)" });
  if (s.showViewfinder) viewfinder(ctx, r, "#ffffff", 26, 64, 9);
  // network pill
  const py = r.y + r.h + (s.showSteps ? 52 : 56);
  ctx.fillStyle = "rgba(255,255,255,0.14)";
  rr(ctx, W / 2 - 360, py, 720, 78, 39);
  ctx.fill();
  wifiIcon(ctx, W / 2 - 300, py + 52, 26, "#fff", 6);
  text(ctx, s.brand, W / 2 + 20, py + 22, { size: 32, weight: 800, color: "#fff", maxW: 560, spacing: 3, upper: true });
  if (s.showSteps) stepsPill(ctx, W / 2, py + 100, 860, s.accent, "#fff", 66);
  text(ctx, s.footer, W / 2, H - 80, { size: 27, weight: 500, color: "rgba(255,255,255,0.7)", maxW: 860, maxLines: 2 });
};

/** Neo-brutalist sticker: thick outlines, hard shadows, starburst. */
const retro: Layout = (ctx, W, H, s, qr) => {
  const ink = s.text;
  ctx.fillStyle = s.card;
  ctx.fillRect(0, 0, W, H);
  // halftone dots
  ctx.fillStyle = rgba(s.accent, 0.22);
  for (let y = 0; y < 560; y += 36) {
    for (let x = (y / 36) % 2 ? 18 : 0; x < W; x += 36) {
      const d = Math.max(0, 11 - (y / 560) * 11);
      ctx.beginPath();
      ctx.arc(x, y, d, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  // border
  ctx.strokeStyle = ink;
  ctx.lineWidth = 16;
  ctx.strokeRect(8, 8, W - 16, H - 16);

  // starburst with title
  ctx.save();
  ctx.translate(W / 2, 262);
  ctx.rotate(-0.1);
  ctx.fillStyle = ink;
  star(ctx, 14, 14, 290, 232, 18, 0);
  ctx.fill();
  ctx.fillStyle = s.accent;
  star(ctx, 0, 0, 290, 232, 18, 0);
  ctx.fill();
  ctx.lineWidth = 8;
  ctx.strokeStyle = ink;
  ctx.stroke();
  text(ctx, s.title, 0, -92, { size: 136, weight: 900, color: "#fff", maxW: 400, maxLines: 2, lineH: 0.95, upper: true });
  ctx.restore();

  // brand tag
  ctx.fillStyle = ink;
  rr(ctx, 48, 48, 330, 58, 10);
  ctx.fill();
  text(ctx, s.brand, 213, 62, { size: 24, weight: 800, color: s.card, maxW: 300, spacing: 2, upper: true });

  text(ctx, s.subtitle, W / 2, 590, { size: 40, weight: 800, color: ink, maxW: 820, maxLines: 2 });

  const size = s.showSteps ? 400 : 470;
  const r = plate(ctx, W / 2, s.showSteps ? 670 : 690, size, qr, { pad: 28, radius: 24, stroke: ink, strokeW: 10, hard: { color: ink, dx: 20, dy: 20 } });
  if (s.showViewfinder) viewfinder(ctx, r, ink, 34, 60, 12);
  if (s.showSteps) stepsPill(ctx, W / 2, r.y + r.h + 56, 860, ink, s.card, 68);
  // footer band
  ctx.fillStyle = ink;
  ctx.fillRect(0, H - 130, W, 130);
  text(ctx, s.footer, W / 2, H - 92, { size: 30, weight: 800, color: s.card, maxW: 860, maxLines: 2, spacing: 1 });
};

/** Black and gold, centred, with ornamental corners. */
const luxury: Layout = (ctx, W, H, s, qr) => {
  ctx.fillStyle = s.card;
  ctx.fillRect(0, 0, W, H);
  radial(ctx, W / 2, 520, 700, s.accent, 0.16);
  const gold = ctx.createLinearGradient(0, 0, W, H);
  gold.addColorStop(0, shade(s.accent, 0.35));
  gold.addColorStop(0.5, s.accent);
  gold.addColorStop(1, shade(s.accent, -0.25));
  ctx.strokeStyle = gold;
  ctx.lineWidth = 3;
  ctx.strokeRect(46, 46, W - 92, H - 92);
  ctx.lineWidth = 9;
  const c = 110;
  ([[46, 46, 1, 1], [W - 46, 46, -1, 1], [46, H - 46, 1, -1], [W - 46, H - 46, -1, -1]] as [number, number, number, number][]).forEach(
    ([x, y, dx, dy]) => {
      ctx.beginPath();
      ctx.moveTo(x, y + dy * c);
      ctx.lineTo(x, y);
      ctx.lineTo(x + dx * c, y);
      ctx.stroke();
      ctx.fillStyle = gold;
      ctx.beginPath();
      ctx.arc(x + dx * 24, y + dy * 24, 8, 0, Math.PI * 2);
      ctx.fill();
    }
  );

  // monogram diamond
  ctx.save();
  ctx.translate(W / 2, 150);
  ctx.rotate(Math.PI / 4);
  ctx.strokeStyle = gold;
  ctx.lineWidth = 4;
  ctx.strokeRect(-22, -22, 44, 44);
  ctx.restore();
  text(ctx, s.brand, W / 2, 205, { size: 26, weight: 600, family: SERIF, color: s.accent, maxW: 760, spacing: 10, upper: true });
  const yT = text(ctx, s.title, W / 2, 265, { size: 100, weight: 700, italic: true, family: SERIF, color: shade(s.accent, 0.3), maxW: 780, maxLines: 2, lineH: 1.04 });
  // fine rule
  ctx.fillStyle = gold;
  ctx.fillRect(W / 2 - 140, yT + 24, 280, 3);
  text(ctx, s.subtitle, W / 2, yT + 54, { size: 34, weight: 400, family: SERIF, color: rgba(s.text, 0.82), maxW: 740, maxLines: 2, lineH: 1.25 });

  const size = s.showSteps ? 420 : 480;
  const r = plate(ctx, W / 2, s.showSteps ? 640 : 650, size, qr, { pad: 30, radius: 10, stroke: s.accent, strokeW: 7 });
  ctx.strokeStyle = rgba(s.accent, 0.5);
  ctx.lineWidth = 2;
  rr(ctx, r.x - 18, r.y - 18, r.w + 36, r.h + 36, 18);
  ctx.stroke();
  if (s.showViewfinder) viewfinder(ctx, r, s.accent, 44, 50, 6);
  if (s.showSteps) {
    ctx.strokeStyle = s.accent;
    ctx.lineWidth = 3;
    rr(ctx, W / 2 - 400, r.y + r.h + 64, 800, 64, 32);
    ctx.stroke();
    text(ctx, STEPS_TEXT, W / 2, r.y + r.h + 64 + 19, { size: 27, weight: 700, family: SERIF, color: s.accent, maxW: 740 });
  }
  text(ctx, s.footer, W / 2, H - 140, { size: 28, weight: 400, italic: true, family: SERIF, color: s.accent, maxW: 740, maxLines: 2 });
};

/** Full-bleed 9:16 story: gradient, sparkles, huge call-to-action. */
const social: Layout = (ctx, W, H, s, qr) => {
  const g = ctx.createLinearGradient(0, 0, W, H);
  g.addColorStop(0, shade(s.accent, -0.65));
  g.addColorStop(0.5, shade(s.accent, -0.3));
  g.addColorStop(1, shade(s.accent, 0.05));
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
  radial(ctx, 150, 250, 520, s.accent, 0.55);
  radial(ctx, 900, 1450, 640, "#ff4fa3", 0.4);
  ([[170, 170, 34], [850, 330, 22], [120, 900, 18], [880, 1100, 30], [780, 160, 14], [220, 1500, 24]] as [number, number, number][]).forEach(
    ([x, y, r]) => sparkle(ctx, x, y, r, "rgba(255,255,255,0.75)")
  );

  // handle pill
  const label = s.brand || "@yourname";
  ctx.font = `800 40px ${SANS}`;
  const pw = Math.min(860, Math.max(340, ctx.measureText(label).width + 150));
  const grad = ctx.createLinearGradient(W / 2 - pw / 2, 0, W / 2 + pw / 2, 0);
  grad.addColorStop(0, "#f9ce34");
  grad.addColorStop(0.5, "#ee2a7b");
  grad.addColorStop(1, "#6228d7");
  ctx.fillStyle = grad;
  rr(ctx, W / 2 - pw / 2, 150, pw, 100, 50);
  ctx.fill();
  ctx.fillStyle = "rgba(0,0,0,0.25)";
  ctx.beginPath();
  ctx.arc(W / 2 - pw / 2 + 52, 200, 28, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.arc(W / 2 - pw / 2 + 52, 200, 14, 0, Math.PI * 2);
  ctx.fill();
  text(ctx, label, W / 2 + 40, 177, { size: 40, weight: 800, color: "#fff", maxW: pw - 170 });

  const yT = text(ctx, s.title, W / 2, 330, { size: 150, weight: 900, color: "#fff", maxW: 860, maxLines: 3, lineH: 0.98, upper: true });
  text(ctx, s.subtitle, W / 2, yT + 22, { size: 40, weight: 500, color: "rgba(255,255,255,0.86)", maxW: 800, maxLines: 3, lineH: 1.2 });

  const size = 560;
  ctx.save();
  ctx.translate(W / 2, 1140);
  ctx.rotate(-0.035);
  const r = plate(ctx, 0, -size / 2 - 40, size, qr, { pad: 40, radius: 56, shadow: "rgba(0,0,0,0.5)" });
  if (s.showViewfinder) viewfinder(ctx, r, "#ffffff", 30, 80, 10);
  ctx.restore();
  // call-to-action pill
  ctx.fillStyle = "#ffffff";
  rr(ctx, W / 2 - 330, 1510, 660, 96, 48);
  ctx.fill();
  text(ctx, "Scan to follow", W / 2, 1534, { size: 46, weight: 900, color: shade(s.accent, -0.55), maxW: 560, upper: true, spacing: 2 });
  if (s.showSteps) stepsPill(ctx, W / 2, 1630, 860, "rgba(255,255,255,0.18)", "#fff", 62);
  text(ctx, s.footer, W / 2, H - 80, { size: 30, weight: 600, color: "rgba(255,255,255,0.8)", maxW: 860, maxLines: 2 });
};

/** Terminal / HUD look: grid, neon glow, mono type. */
const cyber: Layout = (ctx, W, H, s, qr) => {
  ctx.fillStyle = s.card;
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = rgba(s.accent, 0.09);
  ctx.lineWidth = 2;
  for (let x = 0; x <= W; x += 50) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, H);
    ctx.stroke();
  }
  for (let y = 0; y <= H; y += 50) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.stroke();
  }
  radial(ctx, W / 2, 700, 650, s.accent, 0.22);
  // cut-corner neon frame
  const cut = 70;
  ctx.save();
  ctx.shadowColor = s.accent;
  ctx.shadowBlur = 28;
  ctx.strokeStyle = s.accent;
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(40 + cut, 40);
  ctx.lineTo(W - 40, 40);
  ctx.lineTo(W - 40, H - 40 - cut);
  ctx.lineTo(W - 40 - cut, H - 40);
  ctx.lineTo(40, H - 40);
  ctx.lineTo(40, 40 + cut);
  ctx.closePath();
  ctx.stroke();
  ctx.restore();

  text(ctx, `[ ${s.brand || "SYSTEM ONLINE"} ]`, W / 2, 112, { size: 26, weight: 700, family: MONO, color: s.accent, maxW: 800, spacing: 5, upper: true });
  const yT = text(ctx, `> ${s.title}`, 90, 190, { size: 86, weight: 900, family: MONO, color: "#fff", maxW: 820, maxLines: 2, lineH: 1.05, align: "left", upper: true });
  // cursor
  ctx.fillStyle = s.accent;
  ctx.fillRect(90, yT + 6, 46, 14);
  text(ctx, s.subtitle, 90, yT + 48, { size: 32, weight: 500, family: MONO, color: "rgba(255,255,255,0.72)", maxW: 820, maxLines: 3, align: "left", lineH: 1.25 });

  const size = 470;
  const r = plate(ctx, W / 2, 530, size, qr, { pad: 30, radius: 14 });
  ctx.save();
  ctx.shadowColor = s.accent;
  ctx.shadowBlur = 30;
  ctx.strokeStyle = s.accent;
  ctx.lineWidth = 5;
  rr(ctx, r.x - 6, r.y - 6, r.w + 12, r.h + 12, 18);
  ctx.stroke();
  ctx.restore();
  if (s.showViewfinder) viewfinder(ctx, r, "#ffffff", 44, 56, 6);
  // progress bar
  const by = r.y + r.h + 64;
  text(ctx, "ACCESS", 90, by, { size: 28, weight: 700, family: MONO, color: s.accent, maxW: 200, align: "left", spacing: 3 });
  for (let i = 0; i < 10; i++) {
    ctx.fillStyle = i < 8 ? s.accent : rgba(s.accent, 0.2);
    ctx.fillRect(280 + i * 62, by + 2, 48, 28);
  }
  if (s.showSteps) stepsPill(ctx, W / 2, by + 64, 820, rgba(s.accent, 0.18), s.accent, 64);
  text(ctx, s.footer, W / 2, by + (s.showSteps ? 160 : 76), { size: 26, weight: 500, family: MONO, color: "rgba(255,255,255,0.6)", maxW: 820, maxLines: 2 });
};

/** Loud sale coupon: burst, dashed cut line, sticker. */
const offer: Layout = (ctx, W, H, s, qr) => {
  ctx.fillStyle = s.card;
  ctx.fillRect(0, 0, W, H);
  // rays
  ctx.save();
  ctx.translate(W / 2, 330);
  for (let i = 0; i < 24; i++) {
    ctx.rotate((Math.PI * 2) / 24);
    ctx.fillStyle = i % 2 ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0)";
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-90, -1100);
    ctx.lineTo(90, -1100);
    ctx.fill();
  }
  ctx.restore();
  // dashed coupon edge
  ctx.setLineDash([22, 16]);
  ctx.strokeStyle = "rgba(255,255,255,0.85)";
  ctx.lineWidth = 6;
  rr(ctx, 40, 40, W - 80, H - 80, 36);
  ctx.stroke();
  ctx.setLineDash([]);

  text(ctx, s.brand, W / 2, 110, { size: 30, weight: 800, color: s.accent, maxW: 820, spacing: 8, upper: true });
  // title with hard shadow
  const titleStyle: TextOpts = { size: 150, weight: 900, color: "#000", maxW: 860, maxLines: 2, lineH: 0.98, upper: true };
  text(ctx, s.title, W / 2 + 8, 168 + 8, titleStyle);
  const yT = text(ctx, s.title, W / 2, 168, { ...titleStyle, color: "#fff" });
  // subtitle ribbon
  ctx.fillStyle = s.accent;
  const rw = 820;
  ctx.save();
  ctx.translate(W / 2, yT + 60);
  ctx.rotate(-0.025);
  rr(ctx, -rw / 2, -4, rw, 84, 12);
  ctx.fill();
  text(ctx, s.subtitle, 0, 18, { size: 34, weight: 900, color: "#000", maxW: rw - 40, upper: true, spacing: 1 });
  ctx.restore();

  const size = 440;
  const r = plate(ctx, W / 2, 660, size, qr, { pad: 30, radius: 30, shadow: "rgba(0,0,0,0.4)" });
  if (s.showViewfinder) viewfinder(ctx, r, s.accent, 30, 64, 10);
  // sticker
  ctx.save();
  ctx.translate(r.x + r.w - 20, r.y + 20);
  ctx.rotate(0.22);
  ctx.fillStyle = s.accent;
  star(ctx, 0, 0, 100, 82, 14, 0);
  ctx.fill();
  text(ctx, "LIMITED", 0, -34, { size: 30, weight: 900, color: "#000", maxW: 130 });
  text(ctx, "TIME", 0, -2, { size: 38, weight: 900, color: "#000", maxW: 130 });
  ctx.restore();
  if (s.showSteps) stepsPill(ctx, W / 2, r.y + r.h + 70, 860, "#000", "#fff", 68);
  text(ctx, s.footer, W / 2, s.showSteps ? H - 84 : H - 140, { size: 30, weight: 700, color: "#fff", maxW: 800, maxLines: 2 });
};

/** Five big stars, friendly light card. */
const review: Layout = (ctx, W, H, s, qr) => {
  ctx.fillStyle = s.card;
  ctx.fillRect(0, 0, W, H);
  const band = ctx.createLinearGradient(0, 0, 0, 440);
  band.addColorStop(0, rgba(s.accent, 0.3));
  band.addColorStop(1, rgba(s.accent, 0));
  ctx.fillStyle = band;
  ctx.fillRect(0, 0, W, 440);

  text(ctx, s.brand, W / 2, 80, { size: 26, weight: 800, color: rgba(s.text, 0.55), maxW: 820, spacing: 6, upper: true });
  for (let i = 0; i < 5; i++) {
    const cx = W / 2 + (i - 2) * 150;
    ctx.save();
    ctx.shadowColor = rgba(s.accent, 0.5);
    ctx.shadowBlur = 24;
    ctx.fillStyle = s.accent;
    star(ctx, cx, 215, 68, 29, 5);
    ctx.fill();
    ctx.restore();
    ctx.fillStyle = "rgba(255,255,255,0.35)";
    star(ctx, cx - 6, 207, 30, 13, 5);
    ctx.fill();
  }
  const yT = text(ctx, s.title, W / 2, 322, { size: 84, weight: 900, color: s.text, maxW: 860, maxLines: 2, lineH: 1.03, upper: true });
  text(ctx, s.subtitle, W / 2, yT + 12, { size: 34, weight: 500, color: rgba(s.text, 0.68), maxW: 780, maxLines: 2 });

  const size = 440;
  const r = plate(ctx, W / 2, 610, size, qr, { pad: 32, radius: 50, stroke: s.accent, strokeW: 10, shadow: "rgba(15,23,42,0.16)" });
  if (s.showViewfinder) viewfinder(ctx, r, s.text, 28, 66, 9);
  // banner
  const by = r.y + r.h + 50;
  ctx.fillStyle = s.accent;
  rr(ctx, W / 2 - 330, by, 660, 92, 46);
  ctx.fill();
  text(ctx, "Scan  •  Rate  •  Done", W / 2, by + 24, { size: 42, weight: 900, color: isDark(s.accent) ? "#fff" : "#1c1917", maxW: 600 });
  if (s.showSteps) stepsPill(ctx, W / 2, by + 112, 860, rgba(s.text, 0.9), s.card, 60);
  text(ctx, s.footer, W / 2, H - 78, { size: 28, weight: 500, color: rgba(s.text, 0.58), maxW: 860, maxLines: 2 });
};

const LAYOUTS: Partial<Record<PosterTemplateId, Layout>> = {
  "viewfinder-minimal": minimal,
  "payment-merchant": payment,
  "cafe-menu": menu,
  "wifi-stand": wifi,
  "vibrant-retro": retro,
  "luxury-event": luxury,
  "social-creator": social,
  "modern-cyber": cyber,
  "offer-sale": offer,
  "review-stars": review,
};

/** Draws the complete poster into ctx at size W x H (H must come from posterSize). */
export function drawPoster(ctx: Ctx, W: number, H: number, spec: PosterSpec, qr: Img | null) {
  const k = W / 1000;
  const vh = H / k;
  ctx.save();
  ctx.scale(k, k);
  // rounded card edge
  rr(ctx, 0, 0, 1000, vh, 36);
  ctx.clip();
  (LAYOUTS[spec.templateId] ?? minimal)(ctx, 1000, vh, spec, qr);
  ctx.restore();
}

/* ------------------------- placeholder QR for thumbnails ------------------------- */

/** A believable QR-looking tile, so the gallery can show every template without rendering a real code. */
export function makeFakeQr(px: number, dark: string, light: string, eye = dark): HTMLCanvasElement {
  const n = 25;
  const c = document.createElement("canvas");
  c.width = c.height = px;
  const ctx = c.getContext("2d");
  if (!ctx) return c;
  ctx.fillStyle = light;
  ctx.fillRect(0, 0, px, px);
  const m = px / n;
  let seed = 7;
  const rnd = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  const inFinder = (x: number, y: number) =>
    (x < 8 && y < 8) || (x >= n - 8 && y < 8) || (x < 8 && y >= n - 8);
  ctx.fillStyle = dark;
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      if (inFinder(x, y)) continue;
      if (rnd() > 0.52) {
        rr(ctx, x * m + m * 0.06, y * m + m * 0.06, m * 0.88, m * 0.88, m * 0.3);
        ctx.fill();
      }
    }
  }
  const finder = (fx: number, fy: number) => {
    ctx.fillStyle = eye;
    rr(ctx, fx * m, fy * m, 7 * m, 7 * m, m * 1.6);
    ctx.fill();
    ctx.fillStyle = light;
    rr(ctx, (fx + 1) * m, (fy + 1) * m, 5 * m, 5 * m, m * 1.1);
    ctx.fill();
    ctx.fillStyle = eye;
    rr(ctx, (fx + 2) * m, (fy + 2) * m, 3 * m, 3 * m, m * 1);
    ctx.fill();
  };
  finder(0, 0);
  finder(n - 7, 0);
  finder(0, n - 7);
  return c;
}
