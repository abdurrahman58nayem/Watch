#!/usr/bin/env python3
"""
textpath.py — properly shaped text rendering (Bengali + Latin) for image compositing.

Pillow alone cannot shape Bengali (no libraqm in this image), and unshaped Bengali
is broken Bengali — "র্ফ" without reph, wrong matras. So we do it the right way:

    HarfBuzz (uharfbuzz) shapes the string  ->  glyph ids + pen positions
    FreeType (freetype-py) rasterises each glyph
    Pillow composes them into one RGBA layer

That gives correct conjuncts/reph/matras and crisp antialiased edges at any size,
which means the Bangla caption on the product photo can never look broken.

Deps: pip install uharfbuzz freetype-py pillow
"""

from __future__ import annotations

import os
from dataclasses import dataclass

import freetype
import uharfbuzz as hb
from PIL import Image


@dataclass
class Shaped:
    image: Image.Image
    baseline: int          # distance from top of the image to the baseline
    width: int
    height: int


def _blob_face(font_path: str):
    blob = hb.Blob.from_file_path(font_path)
    face = hb.Face(blob)
    font = hb.Font(face)
    return face, font


def shape(text: str, font_path: str, size_px: int, tracking_em: float = 0.0,
          language: str | None = None):
    """Return (glyph_ids, [(x, y), ...] in pixels, upem scale)."""
    face, hb_font = _blob_face(font_path)
    upem = face.upem
    hb_font.scale = (upem, upem)

    buf = hb.Buffer()
    buf.add_str(text)
    buf.guess_segment_properties()
    if language:
        buf.language = language
    hb.shape(hb_font, buf, {"kern": True, "liga": True})

    scale = size_px / upem
    track = tracking_em * size_px
    glyphs, positions = [], []
    pen_x = 0.0
    for info, pos in zip(buf.glyph_infos, buf.glyph_positions):
        positions.append((pen_x + pos.x_offset * scale, -pos.y_offset * scale))
        glyphs.append(info.codepoint)
        pen_x += pos.x_advance * scale + track
    return glyphs, positions, int(round(pen_x)), upem


def render_text(text: str, font_path: str, size_px: int,
                color=(26, 26, 26), tracking_em: float = 0.0,
                language: str | None = "bn", pad: int = None) -> Shaped:
    """Render shaped text into a tight RGBA image."""
    glyphs, positions, advance, upem = shape(text, font_path, size_px, tracking_em, language)

    ft = freetype.Face(font_path)
    ft.set_pixel_sizes(0, size_px)
    ascender = int(round(ft.size.ascender / 64))
    descender = int(round(ft.size.descender / 64))  # negative

    pad = size_px // 3 if pad is None else pad
    w = advance + pad * 2
    h = ascender - descender + pad * 2
    canvas = Image.new("L", (max(1, w), max(1, h)), 0)
    baseline = pad + ascender

    for gid, (gx, gy) in zip(glyphs, positions):
        if gid == 0:
            continue
        ft.load_glyph(gid, freetype.FT_LOAD_RENDER | freetype.FT_LOAD_NO_HINTING)
        bmp = ft.glyph.bitmap
        if bmp.width == 0 or bmp.rows == 0:
            continue
        glyph_img = Image.frombytes("L", (bmp.width, bmp.rows), bytes(bmp.buffer))
        x = int(round(pad + gx + ft.glyph.bitmap_left))
        y = int(round(baseline + gy - ft.glyph.bitmap_top))
        canvas.paste(glyph_img, (x, y), glyph_img)

    rgba = Image.new("RGBA", canvas.size, color + (0,))
    rgba.putalpha(canvas)
    return Shaped(image=rgba, baseline=baseline, width=rgba.width, height=rgba.height)


def is_latin(text: str) -> bool:
    return all(ord(c) < 0x0250 for c in text)


if __name__ == "__main__":
    import sys

    out = sys.argv[1] if len(sys.argv) > 1 else "/tmp/textpath-demo.png"
    txt = sys.argv[2] if len(sys.argv) > 2 else "বাটারফ্লাই লক"
    fnt = sys.argv[3] if len(sys.argv) > 3 else os.path.join(
        os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))),
        "assets", "fonts", "NotoSansBengali-Regular.ttf")
    sh = render_text(txt, fnt, 96)
    bg = Image.new("RGBA", sh.image.size, (247, 245, 241, 255))
    bg.alpha_composite(sh.image)
    bg.convert("RGB").save(out)
    print("wrote", out, sh.image.size)
