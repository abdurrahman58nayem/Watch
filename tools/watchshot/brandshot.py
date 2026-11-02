#!/usr/bin/env python3
"""
brandshot.py — Timora watch shot post-production helper.

Why this exists
---------------
Generated photos must NEVER contain baked-in text/icons from the image model:
text made by an image generator breaks, warps and looks cheap. So the spec badge
("BUTTERFLY LOCK" + clasp icon) is composited HERE, in code, on top of the photo.
Vector-ish geometry + supersampled antialiasing = crisp, repeatable, rectifiable
at any size, and identical on every asset.

Commands
--------
  badge     Composite the spec badge (icon + letterspaced text) onto one image.
  compress  Export web-ready .webp + .jpg at target widths with size budget.

Requirements: python3 + Pillow (+ fontTools only if you re-convert .woff2 fonts).

Examples
--------
  python3 tools/watchshot/brandshot.py badge \
      --image out/main-raw.png --out out/main-badge.png \
      --text "BUTTERFLY LOCK" --icon butterfly --pos bottom-center --rule

  python3 tools/watchshot/brandshot.py compress \
      --image out/main-badge.png --outdir public/watches/timora-atlas \
      --name main --widths 1600,900 --budget-kb 220
"""

from __future__ import annotations

import argparse
import math
import os
import sys
from dataclasses import dataclass

from PIL import Image, ImageDraw, ImageFont

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
FONT_DIR = os.path.join(ROOT, "assets", "fonts")

GOLD_LIGHT_BG = (176, 141, 87)      # #B08D57 — reads premium on cream / off-white
GOLD_DARK_BG = (201, 168, 106)      # #C9A86A
INK_LIGHT_BG = (26, 26, 26)         # #1A1A1A
INK_DARK_BG = (237, 233, 225)       # #EDE9E1

SS = 4  # supersample factor for crisp edges


# ----------------------------------------------------------------------------- utils
def hex_to_rgb(value: str) -> tuple[int, int, int]:
    value = value.strip().lstrip("#")
    if len(value) == 3:
        value = "".join(c * 2 for c in value)
    if len(value) != 6:
        raise ValueError(f"bad hex colour: {value}")
    return tuple(int(value[i:i + 2], 16) for i in (0, 2, 4))  # type: ignore[return-value]


def load_font(name: str, size: int) -> ImageFont.FreeTypeFont:
    path = os.path.join(FONT_DIR, name)
    if not os.path.exists(path):
        raise SystemExit(f"font not found: {path}")
    return ImageFont.truetype(path, size)


def region_luma(img: Image.Image, box: tuple[int, int, int, int]) -> float:
    patch = img.convert("L").crop(box).resize((24, 24))
    data = patch.tobytes()
    return sum(data) / len(data)


# ---------------------------------------------------------------- butterfly clasp icon
def draw_butterfly(draw: ImageDraw.ImageDraw, box, color, stroke_ratio=0.075,
                   gap=0.045):
    """Butterfly (deployant clasp) mark inside `box` (x, y, size).

    Pure geometry: four wing outlines + body. Stays crisp at any size and never
    inherits generator artefacts (which is exactly why it is not part of the
    generated photo). Coordinate space is 0..1.
    """
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
    """Minimal watch-case line icon (used when a shot needs a non-lock spec mark)."""
    x, y, size = box
    s = size
    w = max(1, int(round(stroke_ratio * s)))
    cx = x + s / 2
    r = s * 0.30
    draw.ellipse([cx - r, y + s / 2 - r, cx + r, y + s / 2 + r], outline=color, width=w)
    draw.line([(cx - s * 0.11, y + s * 0.02), (cx + s * 0.11, y + s * 0.02)], fill=color, width=w)
    draw.line([(cx - s * 0.11, y + s * 0.98), (cx + s * 0.11, y + s * 0.98)], fill=color, width=w)


ICONS = {"butterfly": draw_butterfly, "watch": draw_wrist, "none": None}


# ------------------------------------------------------------------------- badge pass
@dataclass
class BadgeOpts:
    text: str
    icon: str = "butterfly"
    pos: str = "bottom-center"
    accent: tuple[int, int, int] | None = None
    ink: tuple[int, int, int] | None = None
    rule: bool = False
    tracking: float = 0.34      # em
    text_size: float = 0.030    # fraction of image width
    icon_ratio: float = 1.45    # icon box relative to text cap height
    margin: float = 0.062       # fraction of image width
    bg_hint: str = "auto"       # auto | light | dark
    layout: str = "inline"      # inline = icon beside text, stack = icon above text
    icon_width_ratio: float = 0.34  # stack layout: icon width vs text width
    icon_file: str | None = None   # use a real cutout PNG instead of the vector mark
    icon_key: bool = False         # key out a black background of that PNG


def build_badge(img: Image.Image, opts: BadgeOpts) -> Image.Image:
    W, H = img.size
    size_px = max(18, int(round(W * opts.text_size)))
    font = load_font("Jost-Light.ttf", size_px * SS)
    text = opts.text.upper()

    # --- letter-spaced text metrics (Pillow has no tracking, so place glyphs)
    adv, glyphs = [], []
    for ch in text:
        if ch == " ":
            adv.append(font.getlength(" ") * 0.62)
            glyphs.append(ch)
        else:
            adv.append(font.getlength(ch))
            glyphs.append(ch)
    track = opts.tracking * size_px * SS
    text_w = sum(adv) + track * (len(text) - 1)

    asc, desc = font.getmetrics()
    cap_h = int(size_px * SS * 0.72)

    icon_size = int(cap_h * opts.icon_ratio)
    has_icon = opts.icon != "none" or opts.icon_file
    gap = int(size_px * SS * 0.58) if has_icon else 0
    rule_gap = int(size_px * SS * 0.85) if opts.rule else 0

    icon_img = None
    icon_w = icon_size
    if opts.icon_file:
        from keyer import key_black, trim  # local module, same folder
        icon_img = Image.open(opts.icon_file)
        if opts.icon_key:
            icon_img = trim(key_black(icon_img))
        else:
            icon_img = icon_img.convert("RGBA")
        icon_h = int(cap_h * opts.icon_ratio)
        icon_w = max(1, round(icon_img.width * icon_h / icon_img.height))
        icon_img = icon_img.resize((icon_w, icon_h), Image.LANCZOS)
        icon_size = icon_h

    stack = opts.layout == "stack" and icon_img is not None
    if stack:
        icon_w = max(1, int(text_w * opts.icon_width_ratio))
        icon_img = icon_img.resize(
            (icon_w, max(1, round(icon_img.height * icon_w / icon_img.width))), Image.LANCZOS
        )
        icon_size = icon_img.height
        gap = int(size_px * SS * 0.62)
        total_w = int(max(text_w, icon_w))
        total_h = int(icon_size + gap + cap_h + rule_gap)
    else:
        total_w = int(text_w + icon_size + gap) if icon_img else int(
            text_w + (icon_size + gap if has_icon else 0)
        )
        total_h = int(max(cap_h, icon_size) + rule_gap)

    # --- colours: sample the actual area so the badge never disappears
    m = int(W * opts.margin)
    probe = (
        max(0, W // 2 - total_w // 2),
        max(0, H - m - total_h),
        min(W, W // 2 + total_w // 2),
        H,
    )
    luma = region_luma(img, probe)
    light_bg = luma > 132 if opts.bg_hint == "auto" else opts.bg_hint == "light"
    accent = opts.accent or (GOLD_LIGHT_BG if light_bg else GOLD_DARK_BG)
    ink = opts.ink or (INK_LIGHT_BG if light_bg else INK_DARK_BG)

    pad = int(size_px * SS * 0.6)
    layer = Image.new("RGBA", (total_w + pad * 2, total_h + pad * 2), (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)

    pen_x = pad
    if stack:
        layer.alpha_composite(icon_img, (pad + (total_w - icon_w) // 2, pad))
        text_top = pad + icon_size + gap
        pen_x = pad + (total_w - int(text_w)) // 2
    elif icon_img is not None:
        layer.alpha_composite(icon_img, (pen_x, pad + (cap_h - icon_size) // 2))
        pen_x += icon_w + gap
    elif opts.icon != "none":
        ICONS[opts.icon](draw, (pen_x, pad + (cap_h - icon_size) // 2, icon_size), accent + (255,))
        pen_x += icon_size + gap

    baseline = (text_top if stack else pad) + asc - int((asc - cap_h) * 0.35)
    for ch, a in zip(glyphs, adv):
        if ch != " ":
            draw.text((pen_x, baseline), ch, font=font, fill=ink + (255,), anchor="ls")
        pen_x += a + track

    if opts.rule:
        base_top = text_top if stack else pad
        ry = base_top + cap_h + rule_gap - int(size_px * SS * 0.18)
        draw.line(
            [(pad, ry), (pad + total_w, ry)],
            fill=accent + (150,),
            width=max(1, int(round(size_px * SS * 0.028))),
        )

    layer = layer.resize(
        (max(1, layer.width // SS), max(1, layer.height // SS)), Image.LANCZOS
    )

    # --- position with safe margins
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
    return out.convert("RGB")


# ---------------------------------------------------------------------- compression
def compress(src: Image.Image, outdir: str, name: str, widths, budget_kb: int) -> None:
    os.makedirs(outdir, exist_ok=True)
    for w in widths:
        h = int(round(src.height * w / src.width))
        img = src.resize((w, h), Image.LANCZOS) if src.width > w else src.copy()

        # webp — the default delivery format
        for q in (84, 82, 80, 78, 76, 74, 72, 70, 68):
            path = os.path.join(outdir, f"{name}-{w}.webp")
            img.save(path, "WEBP", quality=q, method=6, exact=True)
            kb = os.path.getsize(path) / 1024
            if kb <= budget_kb:
                break
        print(f"  {path}  {kb:6.1f} KB  (webp q{q})")

        # jpg fallback — progressive, 4:2:0
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
    ap = argparse.ArgumentParser(description="Timora watch shot post-production")
    sub = ap.add_subparsers(dest="cmd", required=True)

    b = sub.add_parser("badge", help="composite the spec badge onto a photo")
    b.add_argument("--image", required=True)
    b.add_argument("--out", required=True)
    b.add_argument("--text", default="BUTTERFLY LOCK")
    b.add_argument("--icon", default="butterfly", choices=sorted(ICONS))
    b.add_argument("--icon-file", default=None,
                   help="real cutout PNG to use instead of the vector mark")
    b.add_argument("--icon-key", action="store_true",
                   help="key out a black background in --icon-file")
    b.add_argument("--icon-width-ratio", type=float, default=0.34,
                   help="stack layout: icon width as a fraction of the text width")
    b.add_argument("--layout", default="inline", choices=["inline", "stack"],
                   help="stack puts the real clasp photo above the text")
    b.add_argument("--icon-ratio", type=float, default=1.45,
                   help="icon height relative to text cap height")
    b.add_argument("--pos", default="bottom-center",
                   choices=["bottom-center", "bottom-left", "bottom-right", "top-center"])
    b.add_argument("--accent", default=None, help="hex, e.g. #B08D57")
    b.add_argument("--ink", default=None, help="hex")
    b.add_argument("--rule", action="store_true", help="hairline under the badge")
    b.add_argument("--tracking", type=float, default=0.34)
    b.add_argument("--text-size", type=float, default=0.030, help="fraction of width")
    b.add_argument("--margin", type=float, default=0.062, help="fraction of width")
    b.add_argument("--bg", default="auto", choices=["auto", "light", "dark"])

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
            text=a.text,
            icon=a.icon,
            pos=a.pos,
            accent=hex_to_rgb(a.accent) if a.accent else None,
            ink=hex_to_rgb(a.ink) if a.ink else None,
            rule=a.rule,
            tracking=a.tracking,
            text_size=a.text_size,
            margin=a.margin,
            bg_hint=a.bg,
            icon_file=a.icon_file,
            icon_key=a.icon_key,
            icon_ratio=a.icon_ratio,
            layout=a.layout,
            icon_width_ratio=a.icon_width_ratio,
        )
        out = build_badge(img, opts)
        os.makedirs(os.path.dirname(os.path.abspath(a.out)), exist_ok=True)
        out.save(a.out, "PNG")
        print(f"badge → {a.out}  ({out.width}x{out.height})")
        return 0

    if a.cmd == "compress":
        widths = [int(w) for w in a.widths.split(",") if w.strip()]
        src = Image.open(a.image).convert("RGB")
        compress(src, a.outdir, a.name, widths, a.budget_kb)
        return 0

    return 1


if __name__ == "__main__":
    sys.exit(main())
