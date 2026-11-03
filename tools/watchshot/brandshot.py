#!/usr/bin/env python3
"""
brandshot.py — watch product-shot post-production helper.

Why this exists
---------------
Generated photos must NEVER contain baked-in text/icons from the image model:
text made by an image generator breaks, warps and looks cheap. So the spec badge
("বাটারফ্লাই লক" / "BUTTERFLY LOCK" + clasp image) is composited HERE, in code,
on top of the photo. Geometry + supersampled antialiasing + real HarfBuzz shaping
(see textpath.py) = crisp, repeatable, never broken, identical on every asset.

Commands
--------
  badge     Composite the spec badge (icon/clasp image + caption) onto one image.
  compress  Export web-ready .webp + .jpg at target widths with a size budget.

Deps: pillow (badge/compress), uharfbuzz + freetype-py (Bangla shaping).

Examples
--------
  # Bangla caption + the real clasp cutout, stacked, on the main shot
  python3 tools/watchshot/brandshot.py badge \
      --image out/raw/main.png --out out/main-badge.png \
      --text "বাটারফ্লাই লক" --icon-file public/lock/butterfly-clasp.png \
      --layout stack --icon-width-ratio 0.30 --rule --bg light

  # Latin caption with the vector butterfly mark
  python3 tools/watchshot/brandshot.py badge \
      --image out/raw/main.png --out out/main-badge.png \
      --text "BUTTERFLY LOCK" --icon butterfly --rule --bg auto

  python3 tools/watchshot/brandshot.py compress \
      --image out/main-badge.png --outdir public/watches/<slug> \
      --name main --widths 1600,900 --budget-kb 180
"""

from __future__ import annotations

import argparse
import os
import sys
import unicodedata
from dataclasses import dataclass

from PIL import Image, ImageDraw, ImageFilter, ImageFont

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
FONT_DIR = os.path.join(ROOT, "assets", "fonts")

GOLD_LIGHT_BG = (176, 141, 87)      # #B08D57 — reads premium on cream / blush
GOLD_DARK_BG = (201, 168, 106)      # #C9A86A
INK_LIGHT_BG = (26, 26, 26)         # #1A1A1A
INK_DARK_BG = (237, 233, 225)       # #EDE9E1

SS = 4  # supersample factor for crisp edges

BENGALI_FONTS = [
    "NotoSansBengali-Regular.ttf",
    "NotoSansBengali-Light.ttf",
    "NotoSerifBengali-Regular.ttf",
]


# ----------------------------------------------------------------------------- utils
def hex_to_rgb(value: str) -> tuple[int, int, int]:
    value = value.strip().lstrip("#")
    if len(value) == 3:
        value = "".join(c * 2 for c in value)
    if len(value) != 6:
        raise ValueError(f"bad hex colour: {value}")
    return tuple(int(value[i:i + 2], 16) for i in (0, 2, 4))  # type: ignore[return-value]


def load_font(name: str, size: int) -> ImageFont.FreeTypeFont:
    path = name if os.path.isabs(name) else os.path.join(FONT_DIR, name)
    if not os.path.exists(path):
        raise SystemExit(f"font not found: {path}")
    return ImageFont.truetype(path, size)


def resolve_font(name: str | None, bengali: bool) -> str:
    if name:
        return name if os.path.isabs(name) else os.path.join(FONT_DIR, name)
    return os.path.join(FONT_DIR, BENGALI_FONTS[0] if bengali else "Jost-Light.ttf")


def is_bengali(text: str) -> bool:
    return any(0x0980 <= ord(c) <= 0x09FF for c in text)


def region_luma(img: Image.Image, box: tuple[int, int, int, int]) -> float:
    patch = img.convert("L").crop(box).resize((24, 24))
    data = patch.tobytes()
    return sum(data) / len(data)


def drop_shadow(icon: Image.Image, blur: int, offset_y: int,
                alpha: int = 46) -> Image.Image:
    """Soft, light-direction-consistent shadow so the mark sits on the surface."""
    canvas = Image.new("RGBA", (icon.width + blur * 4, icon.height + blur * 4),
                       (0, 0, 0, 0))
    shadow = Image.new("RGBA", icon.size, (0, 0, 0, 0))
    shadow.putalpha(icon.getchannel("A").point(lambda v: int(v * alpha / 255)))
    canvas.alpha_composite(shadow, (blur * 2, blur * 2 + offset_y))
    canvas = canvas.filter(ImageFilter.GaussianBlur(blur))
    canvas.alpha_composite(icon, (blur * 2, blur * 2))
    return canvas


def colorize(mask: Image.Image, color: tuple[int, int, int]) -> Image.Image:
    out = Image.new("RGBA", mask.size, color + (0,))
    out.putalpha(mask)
    return out


# ---------------------------------------------------------------- icon geometry
def draw_butterfly(draw: ImageDraw.ImageDraw, box, color, stroke_ratio=0.075,
                   gap=0.045):
    """Vector butterfly mark — fallback when no real clasp photo is used."""
    x, y, s = box
    w = max(1, int(round(stroke_ratio * s)))
    g = gap

    def poly(pts):
        draw.polygon([(x + a * s, y + b * s) for a, b in pts],
                     outline=color, width=w)

    poly([(0.5 - g, 0.50), (0.30, 0.17), (0.11, 0.11), (0.09, 0.30), (0.34, 0.50)])
    poly([(0.5 + g, 0.50), (0.70, 0.17), (0.89, 0.11), (0.91, 0.30), (0.66, 0.50)])
    poly([(0.5 - g, 0.50), (0.33, 0.78), (0.16, 0.86), (0.14, 0.66), (0.38, 0.50)])
    poly([(0.5 + g, 0.50), (0.67, 0.78), (0.84, 0.86), (0.86, 0.66), (0.62, 0.50)])
    draw.line([(x + 0.5 * s, y + 0.36 * s), (x + 0.5 * s, y + 0.64 * s)],
              fill=color, width=max(1, int(round(w * 0.9))))


def draw_wrist(draw: ImageDraw.ImageDraw, box, color, stroke_ratio=0.075):
    x, y, s = box
    w = max(1, int(round(stroke_ratio * s)))
    cx = x + s / 2
    r = s * 0.30
    draw.ellipse([cx - r, y + s / 2 - r, cx + r, y + s / 2 + r], outline=color, width=w)
    draw.line([(cx - s * 0.11, y + s * 0.02), (cx + s * 0.11, y + s * 0.02)], fill=color, width=w)
    draw.line([(cx - s * 0.11, y + s * 0.98), (cx + s * 0.11, y + s * 0.98)], fill=color, width=w)


ICONS = {"butterfly": draw_butterfly, "watch": draw_wrist, "none": None}


# ------------------------------------------------------------------- text -> mask
@dataclass
class TextMask:
    mask: Image.Image     # L mode, already supersampled
    width: int
    height: int
    cap_h: int
    baseline: int


def latin_text_mask(text: str, font: ImageFont.FreeTypeFont, size_px: int,
                    tracking_em: float) -> TextMask:
    """Letter-spaced glyph placement (Latin looks best with tracking)."""
    adv, glyphs = [], []
    for ch in text:
        adv.append(font.getlength(" ") * 0.62 if ch == " " else font.getlength(ch))
        glyphs.append(ch)
    track = tracking_em * size_px
    width = int(sum(adv) + track * (len(text) - 1))
    asc, desc = font.getmetrics()
    cap_h = int(size_px * 0.72)
    height = asc + desc
    pad = size_px // 2
    canvas = Image.new("L", (width + pad * 2, height + pad * 2), 0)
    d = ImageDraw.Draw(canvas)
    pen = pad
    baseline = pad + asc
    for ch, a in zip(glyphs, adv):
        if ch != " ":
            d.text((pen, baseline), ch, font=font, fill=255, anchor="ls")
        pen += a + track
    return TextMask(canvas, canvas.width, canvas.height, cap_h, baseline)


def shaped_text_mask(text: str, font_path: str, size_px: int,
                     language: str | None = None) -> TextMask:
    """Bangla / complex scripts: shape with HarfBuzz, rasterise with FreeType."""
    from textpath import render_text

    if language is None:
        language = "bn" if is_bengali(text) else None
    sh = render_text(text, font_path, size_px, color=(255, 255, 255),
                     tracking_em=0.0, language=language)
    mask = sh.image.getchannel("A")
    bbox = mask.getbbox()
    if bbox:
        # trim the empty padding so the caption sits tight against the rule
        mask = mask.crop((bbox[0], bbox[1], bbox[2], bbox[3]))
        baseline = sh.baseline - bbox[1]
    else:
        baseline = sh.baseline
    return TextMask(mask, mask.width, mask.height, int(size_px * 0.62), baseline)


def build_text_mask(text: str, opts: "BadgeOpts", size_px: int) -> TextMask:
    bengali = is_bengali(text)
    font_path = resolve_font(opts.font, bengali)
    if bengali or not text.isascii():
        return shaped_text_mask(text, font_path, size_px, opts.language)
    return latin_text_mask(text, load_font(font_path, size_px), size_px, opts.tracking)


# ------------------------------------------------------------------------- badge pass
@dataclass
class BadgeOpts:
    text: str
    icon: str = "butterfly"
    pos: str = "bottom-center"
    accent: tuple[int, int, int] | None = None
    ink: tuple[int, int, int] | None = None
    rule: bool = False
    tracking: float = 0.34      # em (Latin only; Bangla is never letter-spaced)
    text_size: float = 0.030    # fraction of image width
    icon_ratio: float = 1.45    # icon box relative to text cap height
    layout: str = "inline"      # inline | stack
    icon_width_ratio: float = 0.34   # stack: icon width vs text width
    margin: float = 0.062       # fraction of image width
    bg_hint: str = "auto"       # auto | light | dark
    icon_file: str | None = None
    icon_key: bool = False
    icon_shadow: bool = False   # soft blurred shadow under the icon/clasp image
    font: str | None = None
    language: str | None = None
    pad_bottom: float = 0.0     # extend the seamless background downwards (room for the badge)
    square: bool = False        # output a 1:1 canvas with equal margins on all sides


def extend_bottom(img: Image.Image, fraction: float) -> Image.Image:
    """Grow a flat/sweep background downwards so the badge never sits on the product.

    Mirror-pad the last rows (continuous at the seam), soften with a blur and blend
    towards the mean bottom colour so no band or edge shows up in the final export.
    """
    if fraction <= 0:
        return img
    W, H = img.size
    extra = int(H * fraction)
    n = min(H, 180)
    mirror = img.crop((0, H - n, W, H)).transpose(Image.FLIP_TOP_BOTTOM)
    strip = mirror.resize((W, extra), Image.LANCZOS)
    bottom_rows = img.crop((0, H - 6, W, H)).resize((1, 1), Image.LANCZOS)
    flat = Image.new("RGB", (W, extra), bottom_rows.getpixel((0, 0)))
    strip = Image.blend(strip.filter(ImageFilter.GaussianBlur(22)), flat, 0.62)
    out = Image.new("RGB", (W, H + extra))
    out.paste(strip, (0, H))          # paint the extension first (never leave black)
    out.paste(img, (0, 0))
    # soften the join so the seam is invisible
    band_h = 26
    band = out.crop((0, H - band_h, W, H + band_h)).filter(ImageFilter.GaussianBlur(7))
    grad = Image.linear_gradient("L").resize((W, band_h * 2))
    mask = grad.point(lambda v: 255 - abs(v - 128) * 2)   # 0 at the edges, 255 mid
    out.paste(band, (0, H - band_h), mask)
    return out


def square_pad(img: Image.Image, side: int | None = None) -> Image.Image:
    """Pad to a 1:1 canvas by continuing the background outwards from the edges.

    Website grids want equal margins on all four sides. We stretch the outermost
    row/column of pixels into the empty band (a seamless continuation of the studio
    sweep) and soften it, so no seam, crop or re-scale happens, and the product keeps
    exactly the size it was shot at.
    """
    W, H = img.size
    side = side or max(W, H)
    if W == side and H == side:
        return img

    canvas = img.copy()
    if side - W > 0:
        band = (side - W) // 2
        left = img.crop((0, 0, 1, H)).resize((band, H), Image.BILINEAR)
        right = img.crop((W - 1, 0, W, H)).resize((band, H), Image.BILINEAR)
        left = left.filter(ImageFilter.GaussianBlur(6))
        right = right.filter(ImageFilter.GaussianBlur(6))
        tmp = Image.new("RGB", (W + band * 2, H))
        tmp.paste(left, (0, 0))
        tmp.paste(img, (band, 0))
        tmp.paste(right, (band + W, 0))
        canvas = tmp

    cw, ch = canvas.size
    if side - ch > 0:
        band = (side - ch) // 2
        top = canvas.crop((0, 0, cw, 1)).resize((cw, band), Image.BILINEAR)
        bot = canvas.crop((0, ch - 1, cw, ch)).resize((cw, band), Image.BILINEAR)
        top = top.filter(ImageFilter.GaussianBlur(6))
        bot = bot.filter(ImageFilter.GaussianBlur(6))
        out = Image.new("RGB", (cw, side))
        out.paste(top, (0, 0))
        out.paste(canvas, (0, band))
        out.paste(bot, (0, band + ch))
        canvas = out

    return canvas.crop((0, 0, side, side))


def build_badge(img: Image.Image, opts: BadgeOpts) -> Image.Image:
    img = extend_bottom(img.convert("RGB"), opts.pad_bottom)
    W, H = img.size
    size_px = max(18, int(round(W * opts.text_size)))
    text = opts.text if is_bengali(opts.text) else opts.text.upper()

    tm = build_text_mask(text, opts, size_px * SS)
    cap_h, text_w = tm.cap_h * SS, tm.mask.width
    gap = int(size_px * SS * (0.62 if opts.layout == "stack" else 0.58))

    icon_img = None
    if opts.icon_file:
        from keyer import key_black, trim

        icon_img = Image.open(opts.icon_file)
        icon_img = trim(key_black(icon_img)) if opts.icon_key else icon_img.convert("RGBA")
    use_vector = opts.icon != "none" and icon_img is None

    rule_gap = int(size_px * SS * 1.05) if opts.rule else 0
    if opts.layout == "stack" and (icon_img or use_vector):
        icon_w = int(text_w * opts.icon_width_ratio) if opts.icon_file else int(cap_h * opts.icon_ratio)
        if icon_img:
            icon_img = icon_img.resize(
                (icon_w, max(1, round(icon_img.height * icon_w / icon_img.width))),
                Image.LANCZOS)
            icon_h = icon_img.height
        else:
            icon_h = icon_w
        total_w = max(text_w, icon_w)
        total_h = icon_h + gap + tm.mask.height + rule_gap
        layout = "stack"
    else:
        if icon_img:
            icon_h = int(cap_h * opts.icon_ratio)
            icon_img = icon_img.resize(
                (max(1, round(icon_img.width * icon_h / icon_img.height)), icon_h),
                Image.LANCZOS)
            icon_w = icon_img.width
        elif use_vector:
            icon_w = icon_h = int(cap_h * opts.icon_ratio)
        else:
            icon_w = icon_h = 0
        total_w = int(text_w + (icon_w + gap if (icon_img or use_vector) else 0))
        total_h = int(max(tm.mask.height, icon_h) + rule_gap)
        layout = "inline"

    # --- colours: sample the real area so the badge never disappears
    m = int(W * opts.margin)
    probe = (max(0, W // 2 - total_w // 2), max(0, H - m - total_h),
             min(W, W // 2 + total_w // 2), H)
    luma = region_luma(img, probe)
    light_bg = luma > 132 if opts.bg_hint == "auto" else opts.bg_hint == "light"
    accent = opts.accent or (GOLD_LIGHT_BG if light_bg else GOLD_DARK_BG)
    ink = opts.ink or (INK_LIGHT_BG if light_bg else INK_DARK_BG)

    if icon_img is not None and opts.icon_shadow:
        blur = max(2, int(size_px * SS * 0.22))
        icon_img = drop_shadow(icon_img, blur, offset_y=int(blur * 0.55))
        icon_w, icon_h = icon_img.size

    pad = int(size_px * SS * 0.6)
    layer = Image.new("RGBA", (total_w + pad * 2, total_h + pad * 2), (0, 0, 0, 0))

    text_x = pad + ((total_w - text_w) // 2 if layout == "stack" else
                    (icon_w + gap if (icon_img or use_vector) else 0))
    if layout == "stack":
        if icon_img:
            layer.alpha_composite(icon_img, (pad + (total_w - icon_w) // 2, pad))
        else:
            d = ImageDraw.Draw(layer)
            ICONS[opts.icon]((pad + (total_w - icon_w) // 2, pad, icon_w), accent + (255,))
        text_y = pad + icon_h + gap
    else:
        if icon_img:
            layer.alpha_composite(icon_img, (pad, pad + (total_h - rule_gap - icon_h) // 2))
        elif use_vector:
            d = ImageDraw.Draw(layer)
            ICONS[opts.icon]((pad, pad + (total_h - rule_gap - icon_h) // 2, icon_w),
                             accent + (255,))
        text_y = pad + (max(tm.mask.height, icon_h) - tm.mask.height) // 2

    layer.alpha_composite(colorize(tm.mask, ink), (text_x, text_y))

    if opts.rule:
        rule_color = tuple(int(a * 0.6 + i * 0.4) for a, i in zip(accent, ink))
        d = ImageDraw.Draw(layer)
        ry = pad + total_h - int(size_px * SS * 0.1)
        d.line([(pad, ry), (pad + total_w, ry)], fill=rule_color + (235,),
               width=max(1, int(round(size_px * SS * 0.028))))

    layer = layer.resize((max(1, layer.width // SS), max(1, layer.height // SS)),
                         Image.LANCZOS)

    mx = int(W * opts.margin)
    my = int(W * opts.margin)
    if opts.pos == "bottom-center":
        px, py = (W - layer.width) // 2, H - my - layer.height
    elif opts.pos == "bottom-left":
        px, py = mx, H - my - layer.height
    elif opts.pos == "bottom-right":
        px, py = W - mx - layer.width, H - my - layer.height
    elif opts.pos == "top-center":
        px, py = (W - layer.width) // 2, my
    else:
        raise SystemExit(f"unknown --pos {opts.pos}")
    px, py = max(0, px), max(0, py)

    out = img.convert("RGBA")
    out.alpha_composite(layer, (px, py))
    out = out.convert("RGB")
    if opts.square:
        out = square_pad(out)
    return out


# ---------------------------------------------------------------------- compression
def compress(src: Image.Image, outdir: str, name: str, widths, budget_kb: int) -> None:
    os.makedirs(outdir, exist_ok=True)
    for w in widths:
        h = int(round(src.height * w / src.width))
        img = src.resize((w, h), Image.LANCZOS) if src.width > w else src.copy()

        kb = jkb = 0
        for q in (84, 82, 80, 78, 76, 74, 72, 70, 68):
            path = os.path.join(outdir, f"{name}-{w}.webp")
            img.save(path, "WEBP", quality=q, method=6, exact=True)
            kb = os.path.getsize(path) / 1024
            if kb <= budget_kb:
                break
        print(f"  {path}  {kb:6.1f} KB  (webp q{q})")

        for q in (86, 84, 82, 80, 78, 76, 74, 72, 70):
            jpath = os.path.join(outdir, f"{name}-{w}.jpg")
            img.save(jpath, "JPEG", quality=q, optimize=True, progressive=True,
                     subsampling=2)
            jkb = os.path.getsize(jpath) / 1024
            if jkb <= budget_kb:
                break
        print(f"  {jpath}  {jkb:6.1f} KB  (jpg q{q})")

        if kb > budget_kb:
            print(f"  ! {name}-{w}.webp still over budget ({kb:.0f} KB > {budget_kb} KB)")


# ------------------------------------------------------------------------------ CLI
def main(argv=None) -> int:
    ap = argparse.ArgumentParser(description="watch shot post-production")
    sub = ap.add_subparsers(dest="cmd", required=True)

    b = sub.add_parser("badge", help="composite the spec badge onto a photo")
    b.add_argument("--image", required=True)
    b.add_argument("--out", required=True)
    b.add_argument("--text", default="BUTTERFLY LOCK")
    b.add_argument("--font", default=None,
                   help="ttf path or file name in assets/fonts (auto-picked for Bangla)")
    b.add_argument("--language", default=None, help="BCP-47 tag for shaping, e.g. bn")
    b.add_argument("--icon", default="butterfly", choices=sorted(ICONS))
    b.add_argument("--icon-file", default=None,
                   help="real cutout PNG to use instead of the vector mark")
    b.add_argument("--icon-key", action="store_true",
                   help="key out a black background in --icon-file")
    b.add_argument("--layout", default="inline", choices=["inline", "stack"],
                   help="stack puts the image/clasp above the caption")
    b.add_argument("--icon-width-ratio", type=float, default=0.34,
                   help="stack layout: icon width as a fraction of the text width")
    b.add_argument("--icon-ratio", type=float, default=1.45,
                   help="inline layout: icon height relative to cap height")
    b.add_argument("--pos", default="bottom-center",
                   choices=["bottom-center", "bottom-left", "bottom-right", "top-center"])
    b.add_argument("--accent", default=None, help="hex, e.g. #B08D57")
    b.add_argument("--ink", default=None, help="hex")
    b.add_argument("--rule", action="store_true", help="hairline under the badge")
    b.add_argument("--icon-shadow", action="store_true",
                   help="soft shadow under the icon/clasp image")
    b.add_argument("--tracking", type=float, default=0.34)
    b.add_argument("--text-size", type=float, default=0.030, help="fraction of width")
    b.add_argument("--margin", type=float, default=0.062, help="fraction of width")
    b.add_argument("--bg", default="auto", choices=["auto", "light", "dark"])
    b.add_argument("--square", action="store_true",
                   help="pad to a 1:1 canvas with equal margins on all sides")
    b.add_argument("--pad-bottom", type=float, default=0.0,
                   help="extend the seamless bg downwards by this fraction (badge room)")

    sq = sub.add_parser("square", help="pad any shot to a 1:1 canvas (equal margins)")
    sq.add_argument("--image", required=True)
    sq.add_argument("--out", required=True)
    sq.add_argument("--side", type=int, default=0, help="0 = keep the longest side")

    c = sub.add_parser("compress", help="export webp + jpg at target widths")
    c.add_argument("--image", required=True)
    c.add_argument("--outdir", required=True)
    c.add_argument("--name", required=True)
    c.add_argument("--widths", default="1600,900")
    c.add_argument("--budget-kb", type=int, default=220)

    a = ap.parse_args(argv)

    if a.cmd == "badge":
        img = Image.open(a.image)
        opts = BadgeOpts(
            text=a.text, icon=a.icon, pos=a.pos,
            accent=hex_to_rgb(a.accent) if a.accent else None,
            ink=hex_to_rgb(a.ink) if a.ink else None,
            rule=a.rule, tracking=a.tracking, text_size=a.text_size,
            icon_ratio=a.icon_ratio, layout=a.layout,
            icon_width_ratio=a.icon_width_ratio, margin=a.margin, bg_hint=a.bg,
            icon_file=a.icon_file, icon_key=a.icon_key, icon_shadow=a.icon_shadow,
            font=a.font, language=a.language, pad_bottom=a.pad_bottom,
            square=a.square,
        )
        out = build_badge(img, opts)
        os.makedirs(os.path.dirname(os.path.abspath(a.out)), exist_ok=True)
        out.save(a.out, "PNG")
        print(f"badge → {a.out}  ({out.width}x{out.height})")
        return 0

    if a.cmd == "square":
        src = Image.open(a.image).convert("RGB")
        out = square_pad(src, a.side or None)
        os.makedirs(os.path.dirname(os.path.abspath(a.out)), exist_ok=True)
        out.save(a.out, "PNG")
        print(f"square → {a.out}  ({out.width}x{out.height})")
        return 0

    if a.cmd == "compress":
        widths = [int(w) for w in a.widths.split(",") if w.strip()]
        src = Image.open(a.image).convert("RGB")
        compress(src, a.outdir, a.name, widths, a.budget_kb)
        return 0

    return 1


if __name__ == "__main__":
    sys.exit(main())
