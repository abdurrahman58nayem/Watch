"""
qc.py — রেন্ডার হওয়া ফ্রেমের স্বয়ংক্রিয় মান যাচাই।

প্রতিটি সিনের শেষ ফ্রেমে (সব টেক্সট উপস্থিত থাকে) প্রতিটি fillText-এর
বাউন্ডিং বক্স ধরে নিচের বিষয়গুলো যাচাই করা হয়:

  1) overflow  — লেখা নিরাপদ জোনের (MX=96, TOP=300, নিচে 360px) বাইরে চলে গেছে কি না
  2) overlap   — দুটি টেক্সট বক্স একে অপরের ওপর পড়েছে কি না (ভিজ্যুয়াল কিউসির বদল)
  3) empty     — কোনো সিনে আদৌ লেখা এঁকেছে কি না

ব্যবহার:  python tools/render/qc.py
"""
from __future__ import annotations

import os
import random
import sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import skia                                    # noqa: E402
from skia_canvas import Canvas2D, load_fonts   # noqa: E402
import engine as E                             # noqa: E402
import render as R                             # noqa: E402
import shaper                                  # noqa: E402

MX = 96
TOP = 300
BOTTOM = E.H - 360          # 1560
RIGHT = E.W - MX            # 984

# glow/shadow ছড়িয়ে পড়ার জন্য নিরাপদ জোনে সামান্য সহনশীলতা
TOL = 8


class Box:
    __slots__ = ("text", "x0", "y0", "x1", "y1", "size")

    def __init__(self, text, x0, y0, x1, y1, size):
        self.text, self.x0, self.y0, self.x1, self.y1, self.size = text, x0, y0, x1, y1, size

    def __repr__(self):
        return f"Box({self.text[:26]!r} x[{self.x0:.0f},{self.x1:.0f}] y[{self.y0:.0f},{self.y1:.0f}])"


def patched_fillText(canvas: Canvas2D, sink: list[Box]):
    original = Canvas2D.fillText

    def wrapper(self, text, x, y):
        text = str(text)
        if text.strip():
            weight, size, family = self._fontparts()
            w = shaper.width(text, family, weight, size)
            m = self.current_matrix()
            scale = abs(m[0]) or 1.0
            size = size * scale
            w = w * scale
            px = x - (w / 2 if self.s.textAlign == "center" else w if self.s.textAlign in ("right", "end") else 0)
            tx, ty = self.transform_point(px, y)
            font = skia.Font(shaper.primary_typeface(family, weight), size)
            met = font.getMetrics()
            asc, desc = -met.fAscent, met.fDescent
            base = self.s.textBaseline
            if base == "top":
                baseline = ty + asc
            elif base == "middle":
                baseline = ty - (met.fAscent + met.fDescent) / 2
            elif base == "bottom":
                baseline = ty - met.fDescent
            else:
                baseline = ty
            # em-বক্স নয়, কালির আনুমানিক বিস্তার (অ্যাসেন্ট ৭২%, ডিসেন্ট ২৫%)
            sink.append(Box(text, tx, baseline - 0.72 * asc, tx + w,
                            baseline + 0.25 * desc, size))
        return original(self, text, x, y)

    return wrapper


def check_segment(segs, seg, draw_index):
    t = seg["start"] + seg["dur"] - 0.05
    surface = skia.Surface(E.W, E.H)
    ctx = Canvas2D(surface.getCanvas())
    boxes: list[Box] = []
    Canvas2D.fillText = patched_fillText(ctx, boxes)
    try:
        rng = random.Random(20261104)
        particles = E.makeParticles(120, rng)
        R.render_frame(ctx, segs, t, particles, random.Random(99))
    finally:
        Canvas2D.fillText = globals()["_orig_fillText"]

    problems = []
    if not boxes:
        problems.append("কোনো টেক্সট আঁকা হয়নি")
    for b in boxes:
        if b.x0 < MX - TOL or b.x1 > RIGHT + TOL:
            problems.append(f"ডান/বাম সীমা ছাড়িয়ে: {b!r}")
        if b.y0 < TOP - TOL or b.y1 > BOTTOM + TOL:
            problems.append(f"উপর/নিচের সীমা ছাড়িয়ে: {b!r}")
        if b.x1 - b.x0 > E.W:
            problems.append(f"প্রস্থ ক্যানভাসের চেয়ে বড়: {b!r}")
    # ওভারল্যাপ: কমপক্ষে ২৫% এলাকা মিলে গেলে সমস্যা
    for i in range(len(boxes)):
        for j in range(i + 1, len(boxes)):
            a, b = boxes[i], boxes[j]
            ix = min(a.x1, b.x1) - max(a.x0, b.x0)
            iy = min(a.y1, b.y1) - max(a.y0, b.y0)
            if ix > 0 and iy > 0 and len(a.text.strip()) > 1 and len(b.text.strip()) > 1:
                area_a = max((a.x1 - a.x0) * (a.y1 - a.y0), 1)
                area_b = max((b.x1 - b.x0) * (b.y1 - b.y0), 1)
                inter = ix * iy
                if inter / min(area_a, area_b) > 0.25:
                    problems.append(f"ওভারল্যাপ: {a!r} ∩ {b!r}")
    return boxes, problems


def main() -> int:
    _orig = Canvas2D.fillText
    globals()["_orig_fillText"] = _orig
    load_fonts(os.path.join(ROOT, "tools/fonts"))
    segs, total = R.build_timeline()
    print(f"মোট সময়: {total:.2f}s | প্রতি সিনের শেষ ফ্রেম যাচাই করা হচ্ছে\n")
    bad = 0
    for i, seg in enumerate(segs):
        boxes, problems = check_segment(segs, seg, i)
        status = "OK " if not problems else "FAIL"
        print(f"[{status}] {seg['id']:<10} টেক্সট বক্স: {len(boxes):>2}")
        for p in problems:
            bad += 1
            print(f"        - {p}")
    print()
    if bad:
        print(f"মোট {bad} টি সমস্যা পাওয়া গেছে।")
    else:
        print("কোনো লেআউট সমস্যা পাওয়া যায়নি।")
    return 1 if bad else 0


if __name__ == "__main__":
    raise SystemExit(main())
