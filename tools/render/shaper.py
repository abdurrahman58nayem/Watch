"""
shaper.py — HarfBuzz দিয়ে বাংলা টেক্সট শেপিং + ফন্ট ফলব্যাক।

কেন দরকার: skia.TextBlob.MakeFromString() কোনো শেপার চালায় না, ফলে
"ক্ষ" ৩টা আলাদা গ্লিফ হিসেবে আঁকা হয় — বাংলা যুক্তাক্ষর ভেঙে যায়।
HarfBuzz দিয়ে শেপ করলে ব্রাউজারের মতোই সঠিক রূপ পাওয়া যায়।

দ্বিতীয় সমস্যা: fontsource-এর woff2 সাবসেটগুলো শুধু বাংলা অথবা শুধু ল্যাটিন —
তাই "সূত্র: JMBF"-এর মতো মিশ্র লেখা আঁকতে প্রতি অক্ষরে সঠিক ফন্ট বেছে নিয়ে
রান ভাগ করে আলাদা শেপ করতে হয়।
"""
from __future__ import annotations

import os

import skia
import uharfbuzz as hb

_FONT_DIR: str = ""
_WEIGHTS = (400, 500, 600, 700)

# family → (bengali সাবসেট, ল্যাটিন সাবসেট, ল্যাটিন ফলব্যাক)
_CHAINS: dict[str, tuple[str, str, str]] = {
    "Noto Sans Bengali": ("noto-sans-bengali-bengali", "noto-sans-bengali-latin", "dejavu-sans"),
    "Noto Serif Bengali": ("noto-serif-bengali-bengali", "noto-serif-bengali-latin", "dejavu-serif"),
    "Outfit": ("noto-sans-bengali-bengali", "noto-sans-bengali-latin", "dejavu-sans"),
}
_DEFAULT_FAMILY = "Noto Sans Bengali"

_chain_cache: dict[tuple[str, int], list[tuple[skia.Typeface, hb.Font, int]]] = {}
_blob_cache: dict[tuple, tuple[skia.TextBlob, float]] = {}
_width_cache: dict[tuple, float] = {}


def _nearest_weight(w: int) -> int:
    return min(_WEIGHTS, key=lambda x: abs(x - int(w)))


def init(font_dir: str) -> None:
    global _FONT_DIR
    _FONT_DIR = font_dir
    _chain_cache.clear()
    _blob_cache.clear()
    _width_cache.clear()


def _chain(family: str, weight: int):
    key = (family if family in _CHAINS else _DEFAULT_FAMILY, _nearest_weight(weight))
    if key in _chain_cache:
        return _chain_cache[key]
    fam, w = key
    bn, la, fb = _CHAINS[fam]
    files = [f"{bn}-{w}.ttf", f"{la}-{w}.ttf", f"{fb}-{400 if w <= 500 else 700}.ttf"]
    out = []
    for name in files:
        path = os.path.join(_FONT_DIR, name)
        if not os.path.exists(path):
            continue
        tf = skia.Typeface.MakeFromFile(path)
        if tf is None:
            continue
        with open(path, "rb") as fh:
            face = hb.Face(fh.read())
        upem = face.upem or 1000
        hbf = hb.Font(face)
        # upem*64 স্কেল → পজিশন ফন্ট-ইউনিট×64, ফলে ভগ্নাংশ অ্যাডভান্সও সংরক্ষিত থাকে
        hbf.scale = (upem * 64, upem * 64)
        out.append((tf, hbf, upem * 64))
    if not out:
        raise RuntimeError(f"no fonts loaded for {family} {weight} in {_FONT_DIR}")
    _chain_cache[key] = out
    return out


def primary_typeface(family: str, weight: int) -> skia.Typeface:
    return _chain(family, weight)[0][0]


def _skfont(tf: skia.Typeface, size: float) -> skia.Font:
    f = skia.Font(tf, size)
    f.setSubpixel(True)
    f.setEdging(skia.Font.Edging.kSubpixelAntiAlias)
    return f


def _split_runs(text: str, chain):
    """প্রতিটি অক্ষর যে ফন্টে আছে, তার ওপর ভিত্তি করে ধারাবাহিক রান ভাগ করা।"""
    runs: list[tuple[int, list[str]]] = []
    for ch in text:
        cp = ord(ch)
        idx = 0
        for i, (tf, _hb, _u) in enumerate(chain):
            if tf.unicharToGlyph(cp) != 0:
                idx = i
                break
        if runs and runs[-1][0] == idx:
            runs[-1][1].append(ch)
        else:
            runs.append((idx, [ch]))
    return [(i, "".join(c)) for i, c in runs]


def _shape_run(text: str, tf, hb_font, upem: int, size: float):
    buf = hb.Buffer()
    buf.add_str(text)
    buf.guess_segment_properties()
    hb.shape(hb_font, buf)
    infos, poss = buf.glyph_infos, buf.glyph_positions
    if len(infos) != len(poss):
        return [], [], 0.0
    k = size / float(upem)
    glyphs, pos, x = [], [], 0.0
    for g, p in zip(infos, poss):
        glyphs.append(int(g.codepoint))
        pos.append((x + p.x_offset * k, p.y_offset * k))
        x += p.x_advance * k
    return glyphs, pos, x


def blob(text: str, family: str, weight: int, size: float):
    """(TextBlob, width) — ক্যাশ করা, কারণ একই লেখা বারবার আঁকা হয়।"""
    key = (text, family, int(weight), float(size))
    if key in _blob_cache:
        return _blob_cache[key]
    chain = _chain(family, weight)
    runs = []
    total = 0.0
    for idx, chunk in _split_runs(text, chain):
        tf, hb_font, upem = chain[idx]
        glyphs, pos, w = _shape_run(chunk, tf, hb_font, upem, size)
        if not glyphs:
            continue
        runs.append((tf, glyphs, [(x + total, y) for x, y in pos]))
        total += w
    builder = skia.TextBlobBuilder()
    for tf, glyphs, pos in runs:
        # skia-python-এ allocRunPos-এর প্রতি পজিশনে একটি skia.Point লাগে
        builder.allocRunPos(_skfont(tf, size), glyphs, [skia.Point(x, y) for x, y in pos])
    result = (builder.make(), total)
    _blob_cache[key] = result
    return result


def width(text: str, family: str, weight: int, size: float) -> float:
    key = (text, family, int(weight), float(size))
    if key in _width_cache:
        return _width_cache[key]
    w = blob(text, family, weight, size)[1]
    _width_cache[key] = w
    return w


def metrics(family: str, weight: int, size: float):
    """(ascent, descent) — textBaseline 'top'/'middle'/'bottom' হিসাবের জন্য।"""
    tf = primary_typeface(family, weight)
    return _skfont(tf, size).getMetrics()
