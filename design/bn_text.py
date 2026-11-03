#!/usr/bin/env python3
"""
Bengali (and any complex-script) text renderer that actually shapes correctly.

ImageMagick's `label:` uses raw freetype without a shaper, so conjuncts such as
"ফ্ল" break apart and matras sit in the wrong place. This module shapes the string
with HarfBuzz (uharfbuzz) and rasterises each glyph with FreeType (freetype-py),
writing a transparent PNG that can be composited anywhere.

Deps (installed by design/setup_tools.sh):
    pip install --break-system-packages Pillow uharfbuzz freetype-py

Usage:
    python3 design/bn_text.py "বাটারফ্লাই লক" --out design/assets/badges/bn-butterfly-lock.png \
        --size 96 --color "#4A2E28"
"""

from __future__ import annotations

import argparse
import sys

import freetype
import uharfbuzz as hb
from PIL import Image

DEFAULT_FONT = "design/fonts/HindSiliguri-Bold.ttf"


def render(text: str, font_path: str, size: int, color: str = "#000000",
           tracking: float = 0.0, supersample: int = 2) -> Image.Image:
    """Return an RGBA image of `text` shaped by HarfBuzz and rendered by FreeType."""
    blob = hb.Blob.from_file_path(font_path)
    face = hb.Face(blob)
    hbfont = hb.Font(face)
    hb.ot_font_set_funcs(hbfont)

    buf = hb.Buffer()
    buf.add_str(text)
    buf.direction = "ltr"
    buf.script = "Beng"
    buf.language = "bn"
    hb.shape(hbfont, buf, {"kern": True, "liga": True, "calt": True})
    infos, positions = buf.glyph_infos, buf.glyph_positions

    px = size * supersample
    ft = freetype.Face(font_path)
    ft.set_pixel_sizes(0, px)
    upem = ft.units_per_EM or 1000
    scale = px / upem

    # measure: total advance width
    pen = sum(pos.x_advance * scale for pos in positions) + tracking * supersample * len(positions)
    width = int(pen + px) + 4
    # face.ascender/descender are font units (see units_per_EM); convert to pixels
    ascent = int(ft.ascender / upem * px) if ft.ascender else int(px * 0.8)
    descent = int(abs(ft.descender) / upem * px) if ft.descender else int(px * 0.3)
    height = ascent + descent + 4

    r, g, b = _rgb(color)
    img = Image.new("RGBA", (max(width, 8), max(height, 8)), (0, 0, 0, 0))
    x = 2.0
    for info, pos in zip(infos, positions):
        ft.load_glyph(info.codepoint, freetype.FT_LOAD_RENDER | freetype.FT_LOAD_TARGET_NORMAL)
        bmp = ft.glyph.bitmap
        if bmp.width and bmp.rows:
            glyph = Image.frombytes("L", (bmp.width, bmp.rows), bytes(bmp.buffer))
            layer = Image.new("RGBA", glyph.size, (r, g, b, 0))
            layer.putalpha(glyph)
            img.alpha_composite(
                layer,
                (
                    int(x + pos.x_offset * scale + ft.glyph.bitmap_left),
                    int(ascent - pos.y_offset * scale - ft.glyph.bitmap_top + 2),
                ),
            )
        x += pos.x_advance * scale + tracking * supersample

    # trim to content, then downsample for clean edges
    bbox = img.getbbox()
    if bbox:
        img = img.crop(bbox)
    if supersample > 1:
        img = img.resize((img.width // supersample, img.height // supersample),
                         Image.LANCZOS)
    return img


def _rgb(color: str):
    c = color.lstrip("#")
    return int(c[0:2], 16), int(c[2:4], 16), int(c[4:6], 16)


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("text")
    ap.add_argument("--out", required=True)
    ap.add_argument("--font", default=DEFAULT_FONT)
    ap.add_argument("--size", type=int, default=96)
    ap.add_argument("--color", default="#000000")
    ap.add_argument("--tracking", type=float, default=0.0)
    a = ap.parse_args()
    img = render(a.text, a.font, a.size, a.color, a.tracking)
    img.save(a.out)
    print(f"{a.out} {img.width}x{img.height}")


if __name__ == "__main__":
    main()
