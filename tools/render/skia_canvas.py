"""
skia_canvas.py — ব্রাউজার Canvas 2D API-এর প্রতিরূপ, Skia-র উপরে।

কেন: ভিডিওটি মূলত Canvas 2D দিয়ে আঁকা (src/app/video/motion.ts)। একই গণিত ও একই
ড্রয়িং অর্ডার রেখে ফ্রেম-বাই-ফ্রেম রেন্ডার করার জন্য এই শিমটি ব্যবহার করা হয় — ফলে
রেন্ডার করা MP4 আর ব্রাউজারের প্রিভিউ একই দেখায়।
"""
from __future__ import annotations

import math
import random
from typing import Optional

import skia

# ---------- রঙ ----------
_BG = "#08090c"
_GOLD = "#d4af68"
_GOLD_BRIGHT = "#f0d79b"
_GOLD_DEEP = "#8d6c2f"
_INK = "#eae3d3"
_DIM = "#8b909a"

import shaper as _shaper

# _parse_font()-এ ব্যবহৃত পরিচিত ফন্ট-পরিবার
_FAMILIES = set(_shaper._CHAINS.keys())


def load_fonts(font_dir: str) -> None:
    _shaper.init(font_dir)


def _typeface(family: str, weight: int) -> skia.Typeface:
    """প্রধান টাইপফেস (মেট্রিক্স / বেসলাইন হিসাবের জন্য)।"""
    return _shaper.primary_typeface(family, weight)


def _parse_font(font: str):
    """'600 66px "Noto Serif Bengali", serif' → (weight, size, family)"""
    s = font.strip()
    if "px" not in s:
        return 400, 40.0, "Noto Sans Bengali"
    head, tail = s.split("px", 1)
    toks = head.split()
    size = 40.0
    if toks:
        try:
            size = float(toks[-1])
        except ValueError:
            pass
    weight = 400
    for tok in toks[:-1]:
        if tok.isdigit():
            weight = int(tok)
    family = "Noto Sans Bengali"
    for name in tail.split(","):
        name = name.strip().strip('"').strip("'")
        if name in _FAMILIES:
            family = name
            break
    return weight, size, family


def parse_color(color) -> skia.Color4f:
    if isinstance(color, skia.Color4f):
        return color
    if isinstance(color, (tuple, list)):
        return skia.Color4f(*color)
    s = str(color).strip()
    if s.startswith("rgba"):
        inner = s[s.index("(") + 1 : s.rindex(")")]
        v = [float(x.strip()) for x in inner.split(",")]
        return skia.Color4f(v[0], v[1], v[2], v[3] if len(v) > 3 else 1.0)
    if s.startswith("rgb"):
        inner = s[s.index("(") + 1 : s.rindex(")")]
        v = [float(x.strip()) / 255 for x in inner.split(",")]
        return skia.Color4f(v[0], v[1], v[2], 1.0)
    if s.startswith("#"):
        h = s[1:]
        if len(h) == 3:
            h = "".join(c * 2 for c in h)
        r = int(h[0:2], 16) / 255
        g = int(h[2:4], 16) / 255
        b = int(h[4:6], 16) / 255
        a = int(h[6:8], 16) / 255 if len(h) == 8 else 1.0
        return skia.Color4f(r, g, b, a)
    named = {
        "white": (1, 1, 1, 1),
        "black": (0, 0, 0, 1),
        "gold": _GOLD,
    }
    if s in named:
        v = named[s]
        return skia.Color4f(v[0], v[1], v[2], 1.0) if isinstance(v, tuple) else parse_color(v)
    return skia.Color4f(1, 1, 1, 1)


class Gradient:
    """createLinearGradient / createRadialGradient এর প্রতিরূপ"""

    def __init__(self, kind, pts):
        self.kind = kind
        self.pts = pts
        self.stops: list[tuple[float, skia.Color4f]] = []

    def addColorStop(self, off, color):
        self.stops.append((max(0.0, min(1.0, float(off))), parse_color(color)))

    def shader(self):
        self.stops.sort(key=lambda x: x[0])
        pos = [s[0] for s in self.stops]
        cols = [s[1] for s in self.stops]
        if not pos:
            return None
        if self.kind == "linear":
            (x0, y0), (x1, y1) = self.pts
            return skia.GradientShader.MakeLinear(
                [(x0, y0), (x1, y1)], cols, pos, skia.TileMode.kClamp
            )
        (x0, y0), r0, (x1, y1), r1 = self.pts
        return skia.GradientShader.MakeTwoPointConical(
            (x0, y0), max(r0, 0.001), (x1, y1), max(r1, 0.001), cols, pos, skia.TileMode.kClamp
        )


class State:
    __slots__ = (
        "matrix", "fill", "stroke", "lineWidth", "globalAlpha", "font",
        "textAlign", "textBaseline", "shadowBlur", "shadowColor", "blend",
        "lineCap", "lineJoin",
    )

    def __init__(self):
        self.matrix = skia.Matrix()
        self.fill = _INK
        self.stroke = "#000000"
        self.lineWidth = 1.0
        self.globalAlpha = 1.0
        self.font = '400 40px "Noto Sans Bengali", sans-serif'
        self.textAlign = "start"
        self.textBaseline = "alphabetic"
        self.shadowBlur = 0.0
        self.shadowColor = "rgba(0,0,0,0)"
        self.blend = "source-over"
        self.lineCap = "butt"
        self.lineJoin = "miter"

    def copy(self) -> "State":
        s = State()
        for k in State.__slots__:
            if k == "matrix":
                s.matrix = skia.Matrix([self.matrix[i] for i in range(9)])
            else:
                setattr(s, k, getattr(self, k))
        return s


_BLEND = {
    "source-over": skia.BlendMode.kSrcOver,
    "lighter": skia.BlendMode.kPlus,
    "multiply": skia.BlendMode.kMultiply,
    "screen": skia.BlendMode.kScreen,
}


class Canvas2D:
    """ব্রাউজার CanvasRenderingContext2D-এর সাবসেট"""

    def __init__(self, canvas: skia.Canvas):
        self.c = canvas
        self.s = State()
        self._stack: list[State] = []
        self._sub: list[tuple[float, float]] = []
        self._curves: list = []

    # ---- state ----
    def save(self):
        self._stack.append(self.s.copy())
        self.c.save()

    def restore(self):
        if self._stack:
            self.s = self._stack.pop()
            self.c.restore()

    # ---- properties (browser-এর মতোই অ্যাক্সেস) ----
    @property
    def fillStyle(self):
        return self.s.fill

    @fillStyle.setter
    def fillStyle(self, v):
        self.s.fill = v

    @property
    def strokeStyle(self):
        return self.s.stroke

    @strokeStyle.setter
    def strokeStyle(self, v):
        self.s.stroke = v

    @property
    def lineWidth(self):
        return self.s.lineWidth

    @lineWidth.setter
    def lineWidth(self, v):
        self.s.lineWidth = float(v)

    @property
    def globalAlpha(self):
        return self.s.globalAlpha

    @globalAlpha.setter
    def globalAlpha(self, v):
        self.s.globalAlpha = max(0.0, min(1.0, float(v)))

    @property
    def font(self):
        return self.s.font

    @font.setter
    def font(self, v):
        self.s.font = v

    @property
    def textAlign(self):
        return self.s.textAlign

    @textAlign.setter
    def textAlign(self, v):
        self.s.textAlign = v

    @property
    def textBaseline(self):
        return self.s.textBaseline

    @textBaseline.setter
    def textBaseline(self, v):
        self.s.textBaseline = v

    @property
    def shadowBlur(self):
        return self.s.shadowBlur

    @shadowBlur.setter
    def shadowBlur(self, v):
        self.s.shadowBlur = float(v)

    @property
    def shadowColor(self):
        return self.s.shadowColor

    @shadowColor.setter
    def shadowColor(self, v):
        self.s.shadowColor = v

    @property
    def lineCap(self):
        return self.s.lineCap

    @lineCap.setter
    def lineCap(self, v):
        self.s.lineCap = v

    @property
    def lineJoin(self):
        return self.s.lineJoin

    @lineJoin.setter
    def lineJoin(self, v):
        self.s.lineJoin = v

    @property
    def globalCompositeOperation(self):
        return self.s.blend

    @globalCompositeOperation.setter
    def globalCompositeOperation(self, v):
        self.s.blend = v

    # ---- transform ----
    def setTransform(self, a, b, c, d, e, f):
        self.c.setMatrix(skia.Matrix([a, c, e, b, d, f, 0, 0, 1]))

    def clearRect(self, x, y, w, h):
        self.c.save()
        self.c.clipRect(skia.Rect.MakeXYWH(x, y, w, h))
        self.c.clear(skia.ColorTRANSPARENT)
        self.c.restore()

    def translate(self, x, y):
        self.c.translate(x, y)

    def scale(self, x, y=None):
        self.c.scale(x, y if y is not None else x)

    def rotate(self, a):
        self.c.rotate(math.degrees(a), 0, 0)

    # ---- gradient ----
    def createLinearGradient(self, x0, y0, x1, y1):
        return Gradient("linear", ((x0, y0), (x1, y1)))

    def createRadialGradient(self, x0, y0, r0, x1, y1, r1):
        return Gradient("radial", ((x0, y0), r0, (x1, y1), r1))

    # ---- paint ----
    def _paint(self, style, stroking=False) -> skia.Paint:
        p = skia.Paint()
        p.setAntiAlias(True)
        p.setStyle(skia.Paint.kStroke_Style if stroking else skia.Paint.kFill_Style)
        if stroking:
            p.setStrokeWidth(max(self.s.lineWidth, 0.01))
            p.setStrokeCap({"butt": skia.Paint.kButt_Cap, "round": skia.Paint.kRound_Cap,
                            "square": skia.Paint.kSquare_Cap}[self.s.lineCap])
            p.setStrokeJoin({"miter": skia.Paint.kMiter_Join, "round": skia.Paint.kRound_Join,
                             "bevel": skia.Paint.kBevel_Join}[self.s.lineJoin])
        if isinstance(style, Gradient):
            sh = style.shader()
            if sh is not None:
                p.setShader(sh)
            a = self.s.globalAlpha
            if a < 1.0:
                p.setColor(skia.Color4f(1, 1, 1, a))
        else:
            col = parse_color(style)
            p.setColor(skia.Color4f(col.fR, col.fG, col.fB, col.fA * self.s.globalAlpha))
        if not stroking and self.s.shadowBlur > 0.5:
            sc = parse_color(self.s.shadowColor)
            if sc.fA > 0.001:
                p.setMaskFilter(
                    skia.MaskFilter.MakeBlur(
                        skia.BlurStyle.kNormal_BlurStyle,
                        max(self.s.shadowBlur / 2.0, 0.4),
                        False,
                    )
                )
                p.setColor(skia.Color4f(sc.fR, sc.fG, sc.fB, sc.fA * self.s.globalAlpha))
        p.setBlendMode(_BLEND.get(self.s.blend, skia.BlendMode.kSrcOver))
        return p

    def fillRect(self, x, y, w, h):
        self.c.drawRect(skia.Rect.MakeXYWH(x, y, w, h), self._paint(self.s.fill))

    def strokeRect(self, x, y, w, h):
        self.c.drawRect(skia.Rect.MakeXYWH(x, y, w, h), self._paint(self.s.stroke, True))

    # ---- path ----
    def beginPath(self):
        self._sub = []
        self._curves = []

    def moveTo(self, x, y):
        self._sub.append((x, y))
        self._curves.append(("m", x, y))

    def lineTo(self, x, y):
        self._curves.append(("l", x, y))

    def quadraticCurveTo(self, cx, cy, x, y):
        self._curves.append(("q", cx, cy, x, y))

    def arcTo(self, x1, y1, x2, y2, r):
        # canvas arcTo: বর্তমান বিন্দু, (x1,y1), (x2,y2) দিয়ে তৈরি কোণায় r ব্যাসার্ধের চাপ
        if not self._sub:
            self.moveTo(x1, y1)
            return
        x0, y0 = self._sub[-1]
        d0 = math.hypot(x1 - x0, y1 - y0)
        d2 = math.hypot(x2 - x1, y2 - y1)
        if d0 < 1e-6 or d2 < 1e-6 or r <= 0:
            self.lineTo(x1, y1)
            return
        ux0, uy0 = (x1 - x0) / d0, (y1 - y0) / d0
        ux2, uy2 = (x2 - x1) / d2, (y2 - y1) / d2
        cross = ux0 * uy2 - uy0 * ux2
        if abs(cross) < 1e-6:
            self.lineTo(x1, y1)
            return
        t = r / abs(math.tan(math.acos(max(-1.0, min(1.0, ux0 * ux2 + uy0 * uy2))) / 2))
        t = min(t, d0, d2)
        p1 = (x1 - ux0 * t, y1 - uy0 * t)
        p2 = (x1 + ux2 * t, y1 + uy2 * t)
        cx = x1 + (uy0 - uy2) * (r / abs(cross)) * (1 if cross > 0 else -1) * 0
        # কেন্দ্র: p1,p2 থেকে r দূরে
        mx, my = (p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2
        dx, dy = p2[0] - p1[0], p2[1] - p1[1]
        d = math.hypot(dx, dy) or 1e-6
        h2 = max(r * r - (d / 2) ** 2, 0.0)
        h = math.sqrt(h2)
        nx, ny = -dy / d, dx / d
        c1 = (mx + nx * h, my + ny * h)
        c2 = (mx - nx * h, my - ny * h)
        cx, cy = (c1 if ((c1[0] - x1) * ux2 + (c1[1] - y1) * uy2 < 0) else c2)
        a1 = math.atan2(p1[1] - cy, p1[0] - cx)
        a2 = math.atan2(p2[1] - cy, p2[0] - cx)
        ccw = cross < 0
        self._curves.append(("a", cx, cy, r, a1, a2, ccw))
        self._sub.append((p2[0], p2[1]))
        void = cx, cy
        del void

    def arc(self, cx, cy, r, a0, a1, ccw=False):
        self._curves.append(("a", cx, cy, r, a0, a1, bool(ccw)))
        self._sub.append((cx + r * math.cos(a1), cy + r * math.sin(a1)))

    def ellipse(self, cx, cy, rx, ry, rot, a0, a1, ccw=False):
        self._curves.append(("e", cx, cy, rx, ry, rot, a0, a1, bool(ccw)))
        self._sub.append((cx + rx * math.cos(a1), cy + ry * math.sin(a1)))

    def closePath(self):
        self._curves.append(("z",))

    def _build(self) -> skia.Path:
        path = skia.Path()
        started = False
        for seg in self._curves:
            op = seg[0]
            if op == "m":
                path.moveTo(seg[1], seg[2])
                started = True
            elif op == "l":
                if not started:
                    path.moveTo(*self._sub[0]) if self._sub else path.moveTo(0, 0)
                    started = True
                path.lineTo(seg[1], seg[2])
            elif op == "q":
                path.quadTo(seg[1], seg[2], seg[3], seg[4])
            elif op == "a":
                _, cx, cy, r, a0, a1, ccw = seg
                self._arc_to_path(path, cx, cy, r, r, 0.0, a0, a1, ccw, started)
                started = True
            elif op == "e":
                _, cx, cy, rx, ry, rot, a0, a1, ccw = seg
                self._arc_to_path(path, cx, cy, rx, ry, rot, a0, a1, ccw, started)
                started = True
            elif op == "z":
                path.close()
        return path

    @staticmethod
    def _arc_to_path(path, cx, cy, rx, ry, rot, a0, a1, ccw, started):
        # চাপকে ছোট ছোট রেখাংশে ভাগ করা (বৃত্তাকার জ্যামিতি হুবহু থাকে)
        sweep = a1 - a0
        if not ccw:
            while sweep < 0:
                sweep += 2 * math.pi
        else:
            while sweep > 0:
                sweep -= 2 * math.pi
        n = max(2, int(abs(sweep) / (math.pi / 32)) + 1)
        cr, sr = math.cos(rot), math.sin(rot)
        for i in range(n + 1):
            a = a0 + sweep * i / n
            x = rx * math.cos(a)
            y = ry * math.sin(a)
            px = cx + x * cr - y * sr
            py = cy + x * sr + y * cr
            if i == 0 and not started:
                path.moveTo(px, py)
            else:
                path.lineTo(px, py)

    def fill(self):
        self.c.drawPath(self._build(), self._paint(self.s.fill))

    def stroke(self):
        self.c.drawPath(self._build(), self._paint(self.s.stroke, True))

    def fillEllipseFast(self, cx, cy, rx, ry, color):
        p = self._paint(color)
        self.c.drawOval(skia.Rect.MakeLTRB(cx - rx, cy - ry, cx + rx, cy + ry), p)

    # ---- image ----
    def drawImage(self, img, x, y, w=None, h=None):
        p = skia.Paint()
        p.setAntiAlias(False)
        if self.s.globalAlpha < 1.0:
            p.setColor(skia.Color4f(1, 1, 1, self.s.globalAlpha))
        p.setBlendMode(_BLEND.get(self.s.blend, skia.BlendMode.kSrcOver))
        dst = skia.Rect.MakeXYWH(x, y, w if w is not None else img.width(), h if h is not None else img.height())
        sampling = skia.SamplingOptions(skia.FilterMode.kNearest, skia.MipmapMode.kNone)
        self.c.drawImageRect(img, dst, sampling, p)

    # ---- text ----
    def _skfont(self) -> skia.Font:
        weight, size, family = _parse_font(self.s.font)
        f = skia.Font(_typeface(family, weight), size)
        f.setSubpixel(True)
        f.setEdging(skia.Font.Edging.kSubpixelAntiAlias)
        return f

    def _fontparts(self):
        return _parse_font(self.s.font)  # (weight, size, family)

    def measureText(self, text: str):
        weight, size, family = self._fontparts()
        w = _shaper.width(str(text), family, weight, size)

        class _M:
            width = w

        return _M()

    def _text_x(self, w: float, x: float) -> float:
        a = self.s.textAlign
        if a == "center":
            return x - w / 2
        if a in ("right", "end"):
            return x - w
        return x

    def _text_y(self, f: skia.Font, y: float) -> float:
        b = self.s.textBaseline
        m = f.getMetrics()
        if b == "top":
            return y - m.fAscent
        if b == "middle":
            return y - (m.fAscent + m.fDescent) / 2
        if b == "bottom":
            return y - m.fDescent
        return y

    def current_matrix(self):
        """Skia ক্যানভাসের বর্তমান ট্রান্সফর্ম (translate/scale সহ)।"""
        m = self.c.getTotalMatrix()
        return [m[i] for i in range(9)]

    def transform_point(self, x: float, y: float):
        m = self.current_matrix()
        return (m[0] * x + m[1] * y + m[2], m[3] * x + m[4] * y + m[5])

    def fillText(self, text, x, y):
        weight, size, family = self._fontparts()
        blob, w = _shaper.blob(str(text), family, weight, size)
        if blob is None:
            return
        px, py = self._text_x(w, x), self._text_y(self._skfont(), y)
        paint = self._paint(self.s.fill)
        # shadow আলাদা পাসে, যাতে লেখার রঙ ঠিক থাকে
        if self.s.shadowBlur > 0.5:
            sc = parse_color(self.s.shadowColor)
            if sc.fA > 0.001:
                sp = skia.Paint(paint)
                sp.setMaskFilter(
                    skia.MaskFilter.MakeBlur(
                        skia.BlurStyle.kNormal_BlurStyle, max(self.s.shadowBlur / 2.0, 0.4), False
                    )
                )
                sp.setColor(skia.Color4f(sc.fR, sc.fG, sc.fB, sc.fA * self.s.globalAlpha))
                self.c.drawTextBlob(blob, px, py, sp)
        self.c.drawTextBlob(blob, px, py, paint)

    def strokeText(self, text, x, y):
        weight, size, family = self._fontparts()
        blob, w = _shaper.blob(str(text), family, weight, size)
        if blob is None:
            return
        px, py = self._text_x(w, x), self._text_y(self._skfont(), y)
        self.c.drawTextBlob(blob, px, py, self._paint(self.s.stroke, True))
