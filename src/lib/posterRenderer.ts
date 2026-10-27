import type { PosterLayoutId, PosterPattern, PosterTemplateId } from "@/types/qr";
import { POSTER_ICONS } from "@/lib/posterIcons";

/**
 * One canvas renderer for every poster: the live preview, the template gallery thumbnails and the
 * PNG / JPG / WebP / PDF export all call drawPoster(), so what you see is exactly what you download.
 * Everything is drawn in a virtual 1000-unit-wide space and scaled to the real canvas size.
 */

export interface PosterSpec {
  templateId: PosterTemplateId;
  layout: PosterLayoutId;
  title: string;
  subtitle: string;
  brand: string;
  footer: string;
  showViewfinder: boolean;
  showSteps: boolean;
  card: string;
  text: string;
  accent: string;
  /** second colour for gradients / patterns */
  alt: string;
  icon?: string;
  pattern?: PosterPattern;
  chips?: string[];
}

const LAYOUT_ASPECT: Partial<Record<PosterLayoutId, number>> = {
  story: 1.78, // 9:16 story format
  aurora: 1.78,
  ticket: 1.5,
};

export const posterAspect = (layout: PosterLayoutId) => LAYOUT_ASPECT[layout] ?? 1.42;

export function posterSize(layout: PosterLayoutId, width: number) {
  return { W: width, H: Math.round(width * posterAspect(layout)) };
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

const onColor = (hex: string) => (isDark(hex) ? "#ffffff" : "#111111");

/** Draws a lucide icon (24x24 outline) centred at (cx, cy) with the given size. */
function drawIcon(ctx: Ctx, name: string | undefined, cx: number, cy: number, size: number, color: string, lw = 2) {
  const d = name ? POSTER_ICONS[name] : undefined;
  if (!d) return;
  ctx.save();
  ctx.translate(cx - size / 2, cy - size / 2);
  ctx.scale(size / 24, size / 24);
  ctx.strokeStyle = color;
  ctx.lineWidth = lw;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.stroke(new Path2D(d));
  ctx.restore();
}

/** Text running around a circle, evenly spaced to fill the full ring. */
function circleText(ctx: Ctx, str: string, cx: number, cy: number, r: number, size: number, color: string, weight = 800) {
  ctx.save();
  ctx.font = `${weight} ${size}px ${SANS}`;
  ctx.fillStyle = color;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const chars = [...str];
  const widths = chars.map((c) => ctx.measureText(c).width);
  const total = widths.reduce((a, b) => a + b, 0);
  const gap = (Math.PI * 2 * r - total) / chars.length;
  let a = -Math.PI / 2;
  chars.forEach((c, i) => {
    const w = widths[i] + gap;
    const mid = a + w / 2 / r;
    ctx.save();
    ctx.translate(cx + Math.cos(mid) * r, cy + Math.sin(mid) * r);
    ctx.rotate(mid + Math.PI / 2);
    ctx.fillText(c, 0, 0);
    ctx.restore();
    a += w / r;
  });
  ctx.restore();
}

/** "Chalk" look: the text is drawn a few times, slightly offset and faded. */
function chalkText(ctx: Ctx, str: string, x: number, y: number, o: TextOpts): number {
  text(ctx, str, x + 2, y + 2, { ...o, color: rgba(o.color.startsWith("#") ? o.color : "#ffffff", 0.35) });
  return text(ctx, str, x, y, o);
}

function patternFill(ctx: Ctx, kind: PosterPattern, x: number, y: number, w: number, h: number, c1: string, c2: string) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();
  ctx.fillStyle = c2;
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = c1;
  if (kind === "stripes") {
    ctx.translate(x, y);
    ctx.rotate(-Math.PI / 4);
    const span = w + h;
    for (let i = -span; i < span; i += 120) ctx.fillRect(i, -span, 60, span * 3);
  } else if (kind === "checker") {
    const q = 70;
    for (let j = 0; j * q < h; j++) for (let i = 0; i * q < w; i++) if ((i + j) % 2 === 0) ctx.fillRect(x + i * q, y + j * q, q, q);
  } else {
    for (let j = 0; j * 64 < h + 64; j++)
      for (let i = 0; i * 64 < w + 64; i++) {
        ctx.beginPath();
        ctx.arc(x + i * 64 + (j % 2 ? 32 : 0), y + j * 64, 15, 0, Math.PI * 2);
        ctx.fill();
      }
  }
  ctx.restore();
}

function confetti(ctx: Ctx, W: number, H: number, colors: string[], count = 46) {
  let seed = 11;
  const rnd = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  for (let i = 0; i < count; i++) {
    ctx.save();
    ctx.translate(rnd() * W, rnd() * H);
    ctx.rotate(rnd() * Math.PI);
    ctx.fillStyle = colors[i % colors.length];
    ctx.globalAlpha = 0.55;
    if (i % 3 === 0) {
      ctx.beginPath();
      ctx.arc(0, 0, 9 + rnd() * 8, 0, Math.PI * 2);
      ctx.fill();
    } else ctx.fillRect(-7, -16, 14, 32 * (0.5 + rnd()));
    ctx.restore();
  }
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
  const chips = s.showSteps ? [] : (s.chips && s.chips.length ? s.chips.slice(0, 3) : ["Instant", "Secure", "Contactless"]);
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

/** Gradient sign with a big icon disc (Wi-Fi, gift, phone, ...). */
const hero: Layout = (ctx, W, H, s, qr) => {
  const g = ctx.createLinearGradient(0, 0, W, H);
  g.addColorStop(0, s.card);
  g.addColorStop(1, s.alt);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
  if (s.icon === "cake-slice" || s.icon === "party-popper" || s.icon === "gift") confetti(ctx, W, H, ["#ffffff", s.accent, "#fde047"]);
  ctx.strokeStyle = rgba("#ffffff", 0.14);
  ctx.lineWidth = 3;
  for (let i = 1; i <= 6; i++) {
    ctx.beginPath();
    ctx.arc(W / 2, 330, i * 150, Math.PI * 1.1, Math.PI * 1.9);
    ctx.stroke();
  }
  const iconY = 235;
  ctx.fillStyle = rgba("#ffffff", 0.16);
  ctx.beginPath();
  ctx.arc(W / 2, iconY, 135, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = rgba("#ffffff", 0.35);
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(W / 2, iconY, 150, 0, Math.PI * 2);
  ctx.stroke();
  drawIcon(ctx, s.icon ?? "wifi", W / 2, iconY, 170, "#ffffff", 1.7);

  const yT = text(ctx, s.title, W / 2, 400, { size: 108, weight: 900, color: "#fff", maxW: 860, maxLines: 2, lineH: 1.02, upper: true });
  const yS = text(ctx, s.subtitle, W / 2, yT + 12, { size: 36, weight: 500, color: "rgba(255,255,255,0.82)", maxW: 800, maxLines: 2 });

  // Bottom is anchored; the QR card takes whatever room the (1 or 2 line) heading leaves.
  const stepsRoom = s.showSteps ? 88 : 0;
  const pillTop = H - 215 - stepsRoom;
  const top = yS + 64;
  const avail = pillTop - 76 - top;
  const full = Math.min(524, Math.max(300, avail));
  const size = full - 64;
  const r = plate(ctx, W / 2, top + Math.max(0, (avail - full) / 2), size, qr, { pad: 32, radius: 40, shadow: "rgba(0,0,0,0.45)" });
  if (s.showViewfinder) viewfinder(ctx, r, "#ffffff", 26, 64, 9);
  ctx.fillStyle = "rgba(255,255,255,0.16)";
  rr(ctx, W / 2 - 360, pillTop, 720, 78, 39);
  ctx.fill();
  drawIcon(ctx, s.icon ?? "wifi", W / 2 - 300, pillTop + 39, 40, "#fff", 2);
  text(ctx, s.brand, W / 2 + 24, pillTop + 22, { size: 32, weight: 800, color: "#fff", maxW: 540, spacing: 3, upper: true });
  if (s.showSteps) stepsPill(ctx, W / 2, pillTop + 100, 860, s.accent, onColor(s.accent), 66);
  text(ctx, s.footer, W / 2, H - 80, { size: 27, weight: 500, color: "rgba(255,255,255,0.78)", maxW: 860, maxLines: 2 });
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
  text(ctx, s.title, 0, -92, { size: 136, weight: 900, color: onColor(s.accent), maxW: 400, maxLines: 2, lineH: 0.95, upper: true });
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
  const yT = text(ctx, `> ${s.title}`, 90, 190, { size: 86, weight: 900, family: MONO, color: s.text, maxW: 820, maxLines: 2, lineH: 1.05, align: "left", upper: true });
  // cursor
  ctx.fillStyle = s.accent;
  ctx.fillRect(90, yT + 6, 46, 14);
  text(ctx, s.subtitle, 90, yT + 48, { size: 32, weight: 500, family: MONO, color: rgba(s.text, 0.72), maxW: 820, maxLines: 3, align: "left", lineH: 1.25 });

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
  if (s.showViewfinder) viewfinder(ctx, r, s.text, 44, 56, 6);
  // progress bar
  const by = r.y + r.h + 64;
  text(ctx, "ACCESS", 90, by, { size: 28, weight: 700, family: MONO, color: s.accent, maxW: 200, align: "left", spacing: 3 });
  for (let i = 0; i < 10; i++) {
    ctx.fillStyle = i < 8 ? s.accent : rgba(s.accent, 0.2);
    ctx.fillRect(280 + i * 62, by + 2, 48, 28);
  }
  if (s.showSteps) stepsPill(ctx, W / 2, by + 64, 820, rgba(s.accent, 0.18), s.accent, 64);
  text(ctx, s.footer, W / 2, by + (s.showSteps ? 160 : 76), { size: 26, weight: 500, family: MONO, color: rgba(s.text, 0.6), maxW: 820, maxLines: 2 });
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
  const titleStyle: TextOpts = { size: 150, weight: 900, color: isDark(s.card) ? s.accent : "#000", maxW: 860, maxLines: 2, lineH: 0.98, upper: true };
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
  text(ctx, s.subtitle, 0, 18, { size: 34, weight: 900, color: onColor(s.accent), maxW: rw - 40, upper: true, spacing: 1 });
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
  text(ctx, "LIMITED", 0, -34, { size: 30, weight: 900, color: onColor(s.accent), maxW: 130 });
  text(ctx, "TIME", 0, -2, { size: 38, weight: 900, color: onColor(s.accent), maxW: 130 });
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

/** Solid colour top half, QR card straddling the split. */
const split: Layout = (ctx, W, H, s, qr) => {
  ctx.fillStyle = s.card;
  ctx.fillRect(0, 0, W, H);
  const g = ctx.createLinearGradient(0, 0, W, 700);
  g.addColorStop(0, s.accent);
  g.addColorStop(1, s.alt);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, 700);
  const on = onColor(s.accent);
  ctx.fillStyle = rgba("#ffffff", 0.1);
  ctx.beginPath();
  ctx.arc(W - 80, 120, 260, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(60, 660, 180, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = rgba(on, 0.18);
  rr(ctx, 70, 70, 440, 56, 28);
  ctx.fill();
  text(ctx, s.brand, 290, 84, { size: 24, weight: 800, color: on, maxW: 400, spacing: 3, upper: true });
  const yT = text(ctx, s.title, 70, 165, { size: 110, weight: 900, color: on, maxW: 820, maxLines: 2, lineH: 1.0, align: "left", upper: true });
  text(ctx, s.subtitle, 70, yT + 16, { size: 36, weight: 500, color: rgba(on, 0.85), maxW: 760, maxLines: 2, align: "left" });

  const size = s.showSteps ? 420 : 450;
  const r = plate(ctx, W / 2, 540, size, qr, { pad: 32, radius: 44, shadow: "rgba(15,23,42,0.35)" });
  if (s.showViewfinder) viewfinder(ctx, r, s.accent, 28, 66, 9);
  const y = r.y + r.h + (s.showViewfinder ? 86 : 56);
  drawIcon(ctx, s.icon ?? "smartphone", W / 2 - 330, y + 36, 56, s.accent, 2);
  text(ctx, s.footer, W / 2 + 30, y + 10, { size: 32, weight: 600, color: s.text, maxW: 640, maxLines: 2, lineH: 1.2 });
  if (s.showSteps) stepsPill(ctx, W / 2, y + 120, 860, s.accent, on, 66);
};

/** Aurora blobs with a frosted-glass card. `tall` = 9:16 story version. */
const glassFn = (tall: boolean): Layout => (ctx, W, H, s, qr) => {
  ctx.fillStyle = s.card;
  ctx.fillRect(0, 0, W, H);
  radial(ctx, W * 0.15, H * 0.15, 700, s.accent, 0.75);
  radial(ctx, W * 0.9, H * 0.5, 800, s.alt, 0.7);
  radial(ctx, W * 0.25, H * 0.92, 700, shade(s.accent, 0.35), 0.5);
  const top = tall ? 150 : 110;
  const pw = 840;
  const ph = H - top * 2;
  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,0.35)";
  ctx.shadowBlur = 80;
  ctx.shadowOffsetY = 30;
  const pg = ctx.createLinearGradient(0, top, 0, top + ph);
  pg.addColorStop(0, "rgba(255,255,255,0.20)");
  pg.addColorStop(1, "rgba(255,255,255,0.07)");
  ctx.fillStyle = pg;
  rr(ctx, (W - pw) / 2, top, pw, ph, 64);
  ctx.fill();
  ctx.restore();
  ctx.strokeStyle = "rgba(255,255,255,0.38)";
  ctx.lineWidth = 3;
  rr(ctx, (W - pw) / 2, top, pw, ph, 64);
  ctx.stroke();

  const cx = W / 2;
  const y0 = top + 70;
  ctx.fillStyle = "rgba(255,255,255,0.18)";
  rr(ctx, cx - 250, y0, 500, 58, 29);
  ctx.fill();
  text(ctx, s.brand, cx, y0 + 15, { size: 24, weight: 800, color: s.text, maxW: 460, spacing: 4, upper: true });
  const yT = text(ctx, s.title, cx, y0 + 110, { size: tall ? 120 : 100, weight: 900, color: s.text, maxW: 740, maxLines: tall ? 3 : 2, lineH: 1.02, upper: true });
  text(ctx, s.subtitle, cx, yT + 16, { size: 34, weight: 500, color: rgba(s.text, 0.8), maxW: 720, maxLines: 3, lineH: 1.22 });

  const size = tall ? 520 : 440;
  const pTop = top + ph - size - 64 * 2 - (tall ? 190 : 150) - (s.showSteps ? 70 : 0);
  const r = plate(ctx, cx, pTop, size, qr, { pad: 32, radius: 46, shadow: "rgba(0,0,0,0.4)" });
  if (s.showViewfinder) viewfinder(ctx, r, s.text, 28, 66, 9);
  if (s.showSteps) stepsPill(ctx, cx, r.y + r.h + 40, 740, rgba(s.text, 0.2), s.text, 62);
  text(ctx, s.footer, cx, top + ph - (tall ? 130 : 105), { size: 28, weight: 600, color: rgba(s.text, 0.8), maxW: 720, maxLines: 2 });
};
const glass = glassFn(false);
const aurora = glassFn(true);

/** Round badge with text running around the edge. */
const stamp: Layout = (ctx, W, H, s, qr) => {
  ctx.fillStyle = s.card;
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = rgba(s.accent, 0.08);
  for (let y = 0; y < H; y += 46) {
    for (let x = (y / 46) % 2 ? 23 : 0; x < W; x += 46) {
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  const yT = text(ctx, s.title, W / 2, 90, { size: 112, weight: 900, color: s.text, maxW: 860, maxLines: 2, lineH: 1.0, upper: true });
  const R = 410;
  const cy = Math.max(yT + 70 + R, 800);
  ctx.save();
  ctx.shadowColor = rgba(s.accent, 0.5);
  ctx.shadowBlur = 40;
  ctx.shadowOffsetY = 16;
  ctx.fillStyle = s.accent;
  ctx.beginPath();
  ctx.arc(W / 2, cy, R, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  ctx.setLineDash([4, 14]);
  ctx.lineCap = "round";
  ctx.lineWidth = 6;
  ctx.strokeStyle = rgba(onColor(s.accent), 0.55);
  ctx.beginPath();
  ctx.arc(W / 2, cy, R - 30, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);
  const ring = `${s.brand.toUpperCase()}  •  ${s.subtitle.toUpperCase()}  •  `;
  circleText(ctx, ring.repeat(Math.max(1, Math.round(70 / ring.length))), W / 2, cy, R - 78, 38, onColor(s.accent));
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(W / 2, cy, 270, 0, Math.PI * 2);
  ctx.fill();
  const size = 330;
  const r = plate(ctx, W / 2, cy - size / 2 - 22, size, qr, { pad: 22, radius: 24 });
  if (s.showViewfinder) viewfinder(ctx, r, s.accent, 22, 56, 8);
  const by = cy + R + 40;
  if (s.showSteps) stepsPill(ctx, W / 2, by, 860, s.accent, onColor(s.accent), 62);
  text(ctx, s.footer, W / 2, s.showSteps ? by + 82 : by + 18, { size: 30, weight: 700, color: rgba(s.text, 0.75), maxW: 860, maxLines: 2 });
};

/** Bold pattern header (hazard stripes, checker, dots) with a label strip. */
const pattern: Layout = (ctx, W, H, s, qr) => {
  ctx.fillStyle = s.card;
  ctx.fillRect(0, 0, W, H);
  patternFill(ctx, s.pattern ?? "stripes", 0, 0, W, 470, s.accent, s.alt);
  ctx.fillStyle = s.card;
  rr(ctx, 60, 50, 420, 54, 27);
  ctx.fill();
  text(ctx, s.brand, 270, 64, { size: 24, weight: 800, color: s.text, maxW: 380, spacing: 3, upper: true });
  ctx.save();
  ctx.translate(W / 2, 300);
  ctx.rotate(-0.022);
  ctx.shadowColor = "rgba(0,0,0,0.3)";
  ctx.shadowBlur = 30;
  ctx.shadowOffsetY = 14;
  ctx.fillStyle = s.text;
  rr(ctx, -450, -130, 900, 270, 18);
  ctx.fill();
  ctx.shadowColor = "transparent";
  text(ctx, s.title, 0, -96, { size: 112, weight: 900, color: s.card, maxW: 820, maxLines: 2, lineH: 1.0, upper: true });
  ctx.restore();
  text(ctx, s.subtitle, W / 2, 520, { size: 38, weight: 700, color: s.text, maxW: 840, maxLines: 2 });

  const size = s.showSteps ? 400 : 440;
  const r = plate(ctx, W / 2, 640, size, qr, { pad: 30, radius: 34, stroke: s.text, strokeW: 8, shadow: "rgba(0,0,0,0.18)" });
  if (s.showViewfinder) viewfinder(ctx, r, s.text, 26, 62, 9);
  if (s.showSteps) stepsPill(ctx, W / 2, r.y + r.h + 40, 860, s.text, s.card, 64);
  text(ctx, s.footer, W / 2, H - 100, { size: 30, weight: 700, color: rgba(s.text, 0.75), maxW: 860, maxLines: 2 });
};

/** Packaging insert: kraft paper, stitched edge, taped label. */
const kraft: Layout = (ctx, W, H, s, qr) => {
  ctx.fillStyle = s.card;
  ctx.fillRect(0, 0, W, H);
  let seed = 3;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  ctx.lineWidth = 2;
  for (let i = 0; i < 420; i++) {
    ctx.strokeStyle = rgba(shade(s.card, -0.5), 0.07 + rnd() * 0.07);
    const x = rnd() * W;
    const y = rnd() * H;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + (rnd() - 0.5) * 70, y + (rnd() - 0.5) * 18);
    ctx.stroke();
  }
  const v = ctx.createRadialGradient(W / 2, H / 2, H * 0.3, W / 2, H / 2, H * 0.8);
  v.addColorStop(0, "rgba(0,0,0,0)");
  v.addColorStop(1, "rgba(60,30,0,0.22)");
  ctx.fillStyle = v;
  ctx.fillRect(0, 0, W, H);
  ctx.setLineDash([22, 14]);
  ctx.strokeStyle = s.accent;
  ctx.lineWidth = 5;
  rr(ctx, 46, 46, W - 92, H - 92, 22);
  ctx.stroke();
  ctx.setLineDash([]);

  text(ctx, s.brand, W / 2, 112, { size: 26, weight: 700, family: SERIF, color: s.accent, maxW: 800, spacing: 8, upper: true });
  drawIcon(ctx, s.icon ?? "heart", W / 2, 215, 96, s.accent, 1.8);
  const yT = text(ctx, s.title, W / 2, 290, { size: 104, weight: 700, italic: true, family: SERIF, color: s.text, maxW: 800, maxLines: 2, lineH: 1.02 });
  text(ctx, s.subtitle, W / 2, yT + 12, { size: 36, weight: 400, family: SERIF, color: rgba(s.text, 0.85), maxW: 760, maxLines: 2 });

  const size = s.showSteps ? 400 : 440;
  const top = 640;
  ctx.save();
  ctx.translate(W / 2, top + (size + 80) / 2);
  ctx.rotate(-0.025);
  const r = plate(ctx, 0, -(size + 80) / 2, size, qr, { pad: 40, radius: 14, shadow: "rgba(60,30,0,0.35)" });
  ctx.fillStyle = "rgba(255,245,210,0.75)";
  ([[-1, -0.5], [1, 0.5]] as [number, number][]).forEach(([dx, rot]) => {
    ctx.save();
    ctx.translate(dx * (r.w / 2 - 20), r.y + 8);
    ctx.rotate(rot * 0.8);
    ctx.fillRect(-70, -24, 140, 48);
    ctx.restore();
  });
  ctx.restore();
  if (s.showViewfinder) viewfinder(ctx, { x: W / 2 - (size + 80) / 2, y: top, w: size + 80, h: size + 80 }, s.accent, 40, 56, 7);
  if (s.showSteps) stepsPill(ctx, W / 2, top + size + 130, 820, s.accent, onColor(s.accent), 60);
  text(ctx, s.footer, W / 2, H - 140, { size: 32, weight: 400, italic: true, family: SERIF, color: s.text, maxW: 760, maxLines: 2 });
};

/** Chalkboard in a wooden frame with hand-written style text. */
const chalk: Layout = (ctx, W, H, s, qr) => {
  const HAND = "'Segoe Print', 'Bradley Hand', 'Chalkboard SE', 'Comic Sans MS', cursive";
  ctx.fillStyle = s.alt;
  ctx.fillRect(0, 0, W, H);
  for (let i = 0; i < 40; i++) {
    ctx.fillStyle = rgba(shade(s.alt, i % 2 ? -0.35 : 0.2), 0.15);
    ctx.fillRect(0, i * (H / 40), W, 2);
  }
  const bx = 56;
  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,0.5)";
  ctx.shadowBlur = 30;
  const bg = ctx.createRadialGradient(W / 2, H / 2, 100, W / 2, H / 2, H * 0.7);
  bg.addColorStop(0, shade(s.card, 0.12));
  bg.addColorStop(1, s.card);
  ctx.fillStyle = bg;
  rr(ctx, bx, bx, W - bx * 2, H - bx * 2, 14);
  ctx.fill();
  ctx.restore();
  radial(ctx, 260, 330, 300, "#ffffff", 0.05);
  radial(ctx, 760, 1000, 380, "#ffffff", 0.045);
  ctx.setLineDash([2, 12]);
  ctx.lineCap = "round";
  ctx.strokeStyle = "rgba(255,255,255,0.55)";
  ctx.lineWidth = 5;
  rr(ctx, 96, 96, W - 192, H - 192, 10);
  ctx.stroke();
  ctx.setLineDash([]);

  chalkText(ctx, s.brand, W / 2, 150, { size: 34, weight: 700, family: HAND, color: s.accent, maxW: 700, spacing: 4, upper: true });
  const yT = chalkText(ctx, s.title, W / 2, 215, { size: 112, weight: 800, family: HAND, color: s.text, maxW: 760, maxLines: 2, lineH: 1.05 });
  ctx.strokeStyle = s.accent;
  ctx.lineWidth = 7;
  ctx.beginPath();
  for (let x = 230; x <= 770; x += 10) {
    const y = yT + 18 + Math.sin(x / 22) * 8;
    if (x === 230) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();
  chalkText(ctx, s.subtitle, W / 2, yT + 54, { size: 38, weight: 600, family: HAND, color: rgba(s.text, 0.88), maxW: 740, maxLines: 2 });

  const size = s.showSteps ? 400 : 440;
  const r = plate(ctx, W / 2, 640, size, qr, { pad: 26, radius: 22 });
  ctx.setLineDash([10, 12]);
  ctx.strokeStyle = s.accent;
  ctx.lineWidth = 5;
  rr(ctx, r.x - 18, r.y - 18, r.w + 36, r.h + 36, 30);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = s.accent;
  star(ctx, 190, 760, 26, 11, 5);
  ctx.fill();
  star(ctx, 815, 640, 20, 8, 5);
  ctx.fill();
  drawIcon(ctx, s.icon ?? "coffee", 830, 960, 90, rgba(s.text, 0.85), 1.6);
  drawIcon(ctx, "sparkles", 175, 1000, 72, s.accent, 1.6);
  if (s.showViewfinder) viewfinder(ctx, r, s.text, 40, 56, 6);
  if (s.showSteps) stepsPill(ctx, W / 2, r.y + r.h + 54, 800, s.accent, onColor(s.accent), 60);
  chalkText(ctx, s.footer, W / 2, H - 175, { size: 34, weight: 600, family: HAND, color: s.text, maxW: 720, maxLines: 2 });
};

/** Event ticket with notches, perforation and a QR stub. */
const ticket: Layout = (ctx, W, H, s, qr) => {
  ctx.fillStyle = s.card;
  ctx.fillRect(0, 0, W, H);
  radial(ctx, W / 2, H * 0.2, 700, s.accent, 0.22);
  const x0 = 70;
  const y0 = 90;
  const tw = W - 140;
  const th = H - 180;
  const ny = y0 + th * 0.6;
  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,0.5)";
  ctx.shadowBlur = 60;
  ctx.shadowOffsetY = 24;
  const g = ctx.createLinearGradient(x0, y0, x0 + tw, y0 + th);
  g.addColorStop(0, s.accent);
  g.addColorStop(1, s.alt);
  ctx.fillStyle = g;
  rr(ctx, x0, y0, tw, th, 44);
  ctx.fill();
  ctx.restore();
  const on = onColor(s.accent);
  ctx.fillStyle = s.card;
  ctx.beginPath();
  ctx.arc(x0, ny, 38, 0, Math.PI * 2);
  ctx.arc(x0 + tw, ny, 38, 0, Math.PI * 2);
  ctx.fill();
  ctx.setLineDash([14, 12]);
  ctx.strokeStyle = rgba(on, 0.6);
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(x0 + 50, ny);
  ctx.lineTo(x0 + tw - 50, ny);
  ctx.stroke();
  ctx.setLineDash([]);

  text(ctx, s.brand, W / 2, y0 + 62, { size: 28, weight: 800, color: rgba(on, 0.9), maxW: 700, spacing: 10, upper: true });
  ctx.strokeStyle = rgba(on, 0.5);
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(W / 2 - 160, y0 + 118);
  ctx.lineTo(W / 2 + 160, y0 + 118);
  ctx.stroke();
  const yT = text(ctx, s.title, W / 2, y0 + 150, { size: 112, weight: 900, color: on, maxW: 740, maxLines: 2, lineH: 1.0, upper: true });
  text(ctx, s.subtitle, W / 2, yT + 14, { size: 34, weight: 500, color: rgba(on, 0.85), maxW: 700, maxLines: 2 });
  // info columns come from the footer: "SAT 12 DEC • 8:00 PM • GRAND HALL"
  const parts = s.footer.split(/[•|]/).map((p) => p.trim()).filter(Boolean).slice(0, 3);
  const useLabels = /\d/.test(s.footer);
  const labels = ["DATE", "TIME", "PLACE"];
  const colW = (tw - 120) / Math.max(parts.length, 1);
  parts.forEach((p, i) => {
    const cx = x0 + 60 + colW * i + colW / 2;
    if (useLabels) text(ctx, labels[i], cx, ny - 150, { size: 20, weight: 700, color: rgba(on, 0.65), maxW: colW - 10, spacing: 5 });
    text(ctx, p, cx, useLabels ? ny - 118 : ny - 100, { size: useLabels ? 32 : 36, weight: 800, color: on, maxW: colW - 14, maxLines: 2, lineH: 1.1 });
  });

  const size = s.showSteps ? 280 : 330;
  const r = plate(ctx, W / 2, ny + 44, size, qr, { pad: 22, radius: 22, shadow: "rgba(0,0,0,0.3)" });
  if (s.showViewfinder) viewfinder(ctx, r, on, 22, 50, 7);
  text(ctx, "SCAN AT ENTRY", W / 2, r.y + r.h + 26, { size: 26, weight: 800, color: on, maxW: 600, spacing: 8 });
  if (s.showSteps) stepsPill(ctx, W / 2, r.y + r.h + 76, tw - 120, rgba(on, 0.2), on, 54);
};

/** A tilted polaroid with the QR as the photo. */
const polaroid: Layout = (ctx, W, H, s, qr) => {
  const HAND = "'Segoe Print', 'Bradley Hand', 'Chalkboard SE', 'Comic Sans MS', cursive";
  const g = ctx.createLinearGradient(0, 0, W, H);
  g.addColorStop(0, s.card);
  g.addColorStop(1, shade(s.card, isDark(s.card) ? 0.15 : -0.08));
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
  confetti(ctx, W, H, [s.accent, s.alt, "#ffffff"], 54);
  text(ctx, s.brand, W / 2, 80, { size: 28, weight: 800, color: s.text, maxW: 800, spacing: 8, upper: true });

  ctx.save();
  ctx.translate(W / 2, 690);
  ctx.rotate(-0.045);
  ctx.shadowColor = "rgba(0,0,0,0.35)";
  ctx.shadowBlur = 70;
  ctx.shadowOffsetY = 30;
  ctx.fillStyle = "#ffffff";
  rr(ctx, -390, -470, 780, 960, 14);
  ctx.fill();
  ctx.shadowColor = "transparent";
  const pg = ctx.createLinearGradient(-340, -420, 340, 260);
  pg.addColorStop(0, s.accent);
  pg.addColorStop(1, s.alt);
  ctx.fillStyle = pg;
  rr(ctx, -340, -420, 680, 640, 6);
  ctx.fill();
  sparkle(ctx, -270, -340, 22, "rgba(255,255,255,0.8)");
  sparkle(ctx, 280, 150, 18, "rgba(255,255,255,0.8)");
  sparkle(ctx, 250, -350, 12, "rgba(255,255,255,0.7)");
  const size = s.showSteps ? 360 : 400;
  const r = plate(ctx, 0, -420 + (640 - size - 56) / 2, size, qr, { pad: 28, radius: 24, shadow: "rgba(0,0,0,0.35)" });
  if (s.showViewfinder) viewfinder(ctx, r, "#ffffff", 24, 52, 7);
  text(ctx, s.title, 0, 262, { size: 84, weight: 700, family: HAND, color: "#1f2937", maxW: 660, maxLines: 1 });
  text(ctx, s.subtitle, 0, 372, { size: 30, weight: 500, family: HAND, color: "#475569", maxW: 660, maxLines: 2 });
  ctx.fillStyle = "rgba(250,235,170,0.8)";
  ctx.save();
  ctx.translate(0, -470);
  ctx.rotate(0.05);
  ctx.fillRect(-100, -26, 200, 56);
  ctx.restore();
  ctx.restore();
  if (s.showSteps) stepsPill(ctx, W / 2, H - 175, 820, s.accent, onColor(s.accent), 58);
  text(ctx, s.footer, W / 2, H - 98, { size: 30, weight: 600, color: rgba(s.text, 0.8), maxW: 840, maxLines: 2 });
};

const LAYOUTS: Record<PosterLayoutId, Layout> = {
  minimal,
  payment,
  menu,
  hero,
  retro,
  luxury,
  story: social,
  cyber,
  offer,
  review,
  split,
  glass,
  aurora,
  stamp,
  pattern,
  kraft,
  chalk,
  ticket,
  polaroid,
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
  (LAYOUTS[spec.layout] ?? minimal)(ctx, 1000, vh, spec, qr);
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
