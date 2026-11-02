#!/usr/bin/env python3
"""
keyer.py — turn a shot-on-black product photo (e.g. the butterfly clasp) into a
clean, web-ready transparent cutout.

The supplied lock photo is shot on pure black (#000). Silver/chrome on black keys
out very cleanly, so we build alpha from the per-pixel max channel with a soft
threshold — no halo, no manual masking, and the result composites correctly on
both cream and dark backgrounds.

Commands
--------
  cutout  black-bg photo  ->  trimmed transparent PNG + WebP (+ JPG on flat bg)
  web     any photo       ->  compressed web copy at target width

Examples
--------
  python3 tools/watchshot/keyer.py cutout \
    --image assets/lock/butterfly-lock-source.png \
    --outdir public/lock --name butterfly-clasp \
    --crop 270,370,760,660 --width 900

  python3 tools/watchshot/keyer.py web \
    --image assets/lock/butterfly-lock-source.png \
    --outdir public/lock --name butterfly-lock-wide --width 1200
"""

from __future__ import annotations

import argparse
import os
import sys

from PIL import Image, ImageChops


def key_black(img: Image.Image, lo: int = 6, hi: int = 34) -> Image.Image:
    """alpha = smoothstep(lo, hi, max(R,G,B)) — black becomes fully transparent."""
    rgb = img.convert("RGB")
    r, g, b = rgb.split()
    mx = ImageChops.lighter(ImageChops.lighter(r, g), b)
    span = max(1, hi - lo)
    alpha = mx.point(lambda v: 0 if v <= lo else min(255, int((v - lo) * 255 / span)))
    out = rgb.convert("RGBA")
    out.putalpha(alpha)
    return out


def trim(img: Image.Image, pad: int = 6) -> Image.Image:
    bbox = img.getchannel("A").getbbox()
    if not bbox:
        return img
    x0, y0, x1, y1 = bbox
    x0, y0 = max(0, x0 - pad), max(0, y0 - pad)
    x1, y1 = min(img.width, x1 + pad), min(img.height, y1 + pad)
    return img.crop((x0, y0, x1, y1))


def save_web(img: Image.Image, outdir: str, name: str, width: int,
             budget_kb: int = 160, flat_bg=None) -> None:
    os.makedirs(outdir, exist_ok=True)
    if img.width > width:
        img = img.resize((width, round(img.height * width / img.width)), Image.LANCZOS)

    png = os.path.join(outdir, f"{name}.png")
    img.save(png, "PNG", optimize=True)
    pkb = os.path.getsize(png) / 1024

    webp = os.path.join(outdir, f"{name}.webp")
    for q in (90, 88, 86, 84, 82, 80, 78, 76):
        img.save(webp, "WEBP", quality=q, method=6, exact=True)
        wkb = os.path.getsize(webp) / 1024
        if wkb <= budget_kb:
            break

    print(f"  {png}  {pkb:6.1f} KB   (transparent PNG)")
    print(f"  {webp}  {wkb:6.1f} KB  (webp q{q}, keeps transparency)")

    if flat_bg is not None:
        flat = Image.new("RGB", img.size, flat_bg)
        flat.paste(img, (0, 0), img)
        jpg = os.path.join(outdir, f"{name}-on-cream.jpg")
        flat.save(jpg, "JPEG", quality=88, optimize=True, progressive=True)
        print(f"  {jpg}  {os.path.getsize(jpg)/1024:6.1f} KB  (jpg fallback)")


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(description="transparent cutouts + web exports")
    sub = ap.add_subparsers(dest="cmd", required=True)

    c = sub.add_parser("cutout", help="key out a black background, trim, export")
    c.add_argument("--image", required=True)
    c.add_argument("--outdir", required=True)
    c.add_argument("--name", required=True)
    c.add_argument("--crop", default=None, help="x0,y0,x1,y1 in source pixels")
    c.add_argument("--width", type=int, default=900)
    c.add_argument("--budget-kb", type=int, default=160)
    c.add_argument("--lo", type=int, default=6)
    c.add_argument("--hi", type=int, default=34)
    c.add_argument("--flat-bg", default=None, help="hex, e.g. #F7F5F1 for a jpg fallback")

    w = sub.add_parser("web", help="plain compressed export (keeps background)")
    w.add_argument("--image", required=True)
    w.add_argument("--outdir", required=True)
    w.add_argument("--name", required=True)
    w.add_argument("--width", type=int, default=1200)
    w.add_argument("--budget-kb", type=int, default=180)

    a = ap.parse_args(argv)
    img = Image.open(a.image)

    if a.cmd == "cutout":
        if a.crop:
            img = img.crop(tuple(int(v) for v in a.crop.split(",")))
        out = trim(key_black(img, a.lo, a.hi))
        print(f"cutout {out.width}x{out.height}")
        flat = None
        if a.flat_bg:
            v = a.flat_bg.lstrip("#")
            flat = tuple(int(v[i:i + 2], 16) for i in (0, 2, 4))
        save_web(out, a.outdir, a.name, a.width, a.budget_kb, flat)
        return 0

    if a.cmd == "web":
        save_web(img.convert("RGB"), a.outdir, a.name, a.width, a.budget_kb)
        return 0

    return 1


if __name__ == "__main__":
    sys.exit(main())
