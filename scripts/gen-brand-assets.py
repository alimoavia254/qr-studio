#!/usr/bin/env python3
"""
Builds every logo asset from the single source image brand/logo-source.webp
(opaque, on a white background).  Run:  python3 scripts/gen-brand-assets.py

Outputs
  public/brand/logo-full-light.png        stacked logo, transparent, original colours (for white backgrounds)
  public/brand/logo-full-dark.png         stacked logo, transparent, dark ink turned white (for dark backgrounds)
  public/brand/logo-horizontal-dark.png   mark + wordmark lockup for the dark header / footer
  public/brand/logo-horizontal-light.png  same, for light backgrounds
  public/brand/logo-mark.png              Q with scan corners, transparent
  src/app/icon.png, src/app/apple-icon.png, src/app/favicon.ico
  public/icons/icon-192.png, icon-512.png, icon-maskable-512.png
  public/brand/og-lockup.png              lockup used by the social share images
"""
import os
import cv2
import numpy as np
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "brand", "logo-source.webp")
DARK_BG = (9, 13, 22)  # site background (#090d16)


def out(path):
    p = os.path.join(ROOT, path)
    os.makedirs(os.path.dirname(p), exist_ok=True)
    return p


def to_transparent(rgb):
    """White-matte removal: any colour composited on white -> colour + alpha."""
    a = rgb.astype(np.float32) / 255.0
    alpha = 1.0 - a.min(axis=2)
    alpha = np.clip((alpha - 0.025) / (1 - 0.025), 0, 1)
    safe = np.maximum(alpha, 1e-3)[..., None]
    col = np.clip((a - (1 - alpha)[..., None]) / safe, 0, 1)
    return np.dstack([col, alpha])


def to_dark_mode(rgba, word_rows=None, word_x_limit=0):
    """Dark navy ink and grey tagline become light so they read on a dark background.
    The "QR" letters of the wordmark (left of word_x_limit) are solid ink, so they all turn light."""
    r = rgba.copy()
    c = r[..., :3]
    mx, mn = c.max(axis=2), c.min(axis=2)
    sat = mx - mn
    ink = (mx < 0.62) & (sat < 0.42)
    if word_rows:
        y0, y1 = word_rows
        region = np.zeros_like(ink)
        region[y0 : y1 + 1, :word_x_limit] = True
        ink |= region & (r[..., 3] > 0)
    c[ink] = np.array([0.95, 0.97, 1.0])
    r[..., :3] = c
    return r


def img(rgba):
    return Image.fromarray((np.clip(rgba, 0, 1) * 255).astype(np.uint8))


def crop_to_content(im, pad=0):
    bbox = im.getchannel("A").point(lambda v: 255 if v > 8 else 0).getbbox()
    x0, y0, x1, y1 = bbox
    return im.crop((max(0, x0 - pad), max(0, y0 - pad), min(im.width, x1 + pad), min(im.height, y1 + pad)))


def on(bg, im):
    base = Image.new("RGBA", im.size, bg + (255,))
    base.alpha_composite(im)
    return base


src = np.array(Image.open(SRC).convert("RGB"))
light = to_transparent(src)

# ---- find the bands: mark / wordmark / tagline ----
alpha = light[..., 3] > 0.06
rows = alpha.sum(axis=1)
bands, start = [], None
for y, v in enumerate(rows):
    if v > 0 and start is None:
        start = y
    if v == 0 and start is not None:
        bands.append((start, y - 1))
        start = None
if start is not None:
    bands.append((start, len(rows) - 1))
assert len(bands) == 3, bands
(m0, m1), (w0, w1), (t0, t1) = bands

# the "V" starts at x~668 in the source; everything left of it ("QR") is dark navy ink
dark = to_dark_mode(light, (w0, w1), 660)


def band(rgba, y0, y1):
    full = img(rgba)
    return crop_to_content(full.crop((0, y0, full.width, y1 + 1)))


# ---- the Q glyph alone (without the four scan corners) ----
num, labels, stats, cent = cv2.connectedComponentsWithStats((alpha[m0 : m1 + 1] * 255).astype(np.uint8), connectivity=8)
mark_region = alpha[m0 : m1 + 1]
ys, xs = np.where(mark_region)
cx, cy = (xs.min() + xs.max()) / 2, (ys.min() + ys.max()) / 2
keep = np.zeros_like(mark_region)
for i in range(1, num):
    px, py = cent[i]
    # scan corners are small, far from the centre; everything else is the Q (ring, tail, little squares)
    if np.hypot(px - cx, py - cy) < 300 or stats[i, cv2.CC_STAT_AREA] > 20000:
        keep |= labels == i


def glyph(rgba):
    full = np.zeros_like(rgba)
    full[m0 : m1 + 1][keep] = rgba[m0 : m1 + 1][keep]
    return crop_to_content(img(full))


mark_light = band(light, m0, m1)
mark_dark = band(dark, m0, m1)
word_light = band(light, w0, w1)
word_dark = band(dark, w0, w1)
tag_light = band(light, t0, t1)
tag_dark = band(dark, t0, t1)
q_light = glyph(light)
q_dark = glyph(dark)

# ---- full logo ----
crop_to_content(img(light), 8).save(out("public/brand/logo-full-light.png"), optimize=True)
crop_to_content(img(dark), 8).save(out("public/brand/logo-full-dark.png"), optimize=True)
mark_light.save(out("public/brand/logo-mark.png"), optimize=True)


# ---- horizontal lockup: mark + wordmark ----
def lockup(mark, word, height=240):
    mh = height
    mw = round(mark.width * mh / mark.height)
    wh = round(height * 0.46)
    ww = round(word.width * wh / word.height)
    gap = round(height * 0.16)
    canvas = Image.new("RGBA", (mw + gap + ww, mh), (0, 0, 0, 0))
    canvas.alpha_composite(mark.resize((mw, mh), Image.LANCZOS), (0, 0))
    canvas.alpha_composite(word.resize((ww, wh), Image.LANCZOS), (mw + gap, (mh - wh) // 2))
    return canvas


lk_dark = lockup(mark_dark, word_dark)
lk_light = lockup(mark_light, word_light)
lk_dark.save(out("public/brand/logo-horizontal-dark.png"), optimize=True)
lk_light.save(out("public/brand/logo-horizontal-light.png"), optimize=True)
lk_dark.save(out("public/brand/og-lockup.png"), optimize=True)


# ---- square icons from the Q glyph ----
def square(glyph_im, size, pad_ratio, bg=None, radius_ratio=0):
    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    if bg is not None:
        bgim = Image.new("RGBA", (size, size), bg + (255,))
        if radius_ratio:
            mask = Image.new("L", (size, size), 0)
            from PIL import ImageDraw

            ImageDraw.Draw(mask).rounded_rectangle((0, 0, size - 1, size - 1), radius=int(size * radius_ratio), fill=255)
            canvas.paste(bgim, (0, 0), mask)
        else:
            canvas = bgim
    inner = int(size * (1 - 2 * pad_ratio))
    s = min(inner / glyph_im.width, inner / glyph_im.height)
    g = glyph_im.resize((max(1, round(glyph_im.width * s)), max(1, round(glyph_im.height * s))), Image.LANCZOS)
    canvas.alpha_composite(g, ((size - g.width) // 2, (size - g.height) // 2))
    return canvas


square(q_light, 512, 0.06).save(out("src/app/icon.png"), optimize=True)
square(q_dark, 180, 0.16, bg=DARK_BG).convert("RGB").save(out("src/app/apple-icon.png"), optimize=True)
square(q_dark, 192, 0.14, bg=DARK_BG, radius_ratio=0.22).save(out("public/icons/icon-192.png"), optimize=True)
square(q_dark, 512, 0.14, bg=DARK_BG, radius_ratio=0.22).save(out("public/icons/icon-512.png"), optimize=True)
# maskable: full-bleed background, glyph inside the 80% safe zone
square(q_dark, 512, 0.24, bg=DARK_BG).save(out("public/icons/icon-maskable-512.png"), optimize=True)
ico = square(q_light, 256, 0.04)
ico.save(out("src/app/favicon.ico"), sizes=[(16, 16), (32, 32), (48, 48)])

# ---- previews for a quick visual check (not committed) ----
prev = Image.new("RGBA", (1800, 700), DARK_BG + (255,))
prev.alpha_composite(crop_to_content(img(dark), 8).resize((660, round(660 * crop_to_content(img(dark), 8).height / crop_to_content(img(dark), 8).width))), (20, 20))
prev.alpha_composite(lk_dark.resize((900, round(900 * lk_dark.height / lk_dark.width))), (760, 40))
prev.alpha_composite(q_dark.resize((200, round(200 * q_dark.height / q_dark.width))), (760, 330))
light_strip = Image.new("RGBA", (1800, 360), (255, 255, 255, 255))
light_strip.alpha_composite(lk_light.resize((900, round(900 * lk_light.height / lk_light.width))), (20, 20))
light_strip.alpha_composite(q_light.resize((200, round(200 * q_light.height / q_light.width))), (1000, 100))
sheet = Image.new("RGBA", (1800, 1060), (255, 255, 255, 255))
sheet.alpha_composite(prev, (0, 0))
sheet.alpha_composite(light_strip, (0, 700))
sheet.convert("RGB").save(os.environ.get("BRAND_PREVIEW", "/tmp/brand-preview.png"))
print("bands", bands, "| lockup", lk_dark.size, "| mark", mark_light.size, "| q", q_light.size)
