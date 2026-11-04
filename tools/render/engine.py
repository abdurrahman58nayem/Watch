"""
engine.py — src/app/video/motion.ts-এর পাইথন পোর্ট।
সব easing, জ্যামিতি ও ড্রয়িং অর্ডার হুবহু একই রাখা হয়েছে।
"""
from __future__ import annotations

import math
import random

import skia
from skia_canvas import Canvas2D, parse_color

W = 1080
H = 1920

C = {
    "bg0": "#08090c",
    "bg1": "#12161d",
    "bg2": "#0b0e13",
    "ink": "#eae3d3",
    "gold": "#d4af68",
    "goldBright": "#f0d79b",
    "goldDeep": "#8d6c2f",
    "alert": "#c9554a",
    "dim": "#8b909a",
    "cardBg": "rgba(255,255,255,0.035)",
    "cardLine": "rgba(212,175,104,0.22)",
}


def F(kind: str, w: int, px: int) -> str:
    fam = {"sans": "Noto Sans Bengali", "serif": "Noto Serif Bengali", "num": "Outfit"}[kind]
    return f'{w} {px}px "{fam}", sans-serif'


# ---------- easing ----------
def clamp01(x: float) -> float:
    return 0.0 if x < 0 else (1.0 if x > 1 else x)


def lerp(a: float, b: float, t: float) -> float:
    return a + (b - a) * t


def prog(t: float, a: float, b: float) -> float:
    return clamp01((t - a) / (b - a))


def smoothstep(x: float) -> float:
    t = clamp01(x)
    return t * t * (3 - 2 * t)


def easeOutExpo(x: float) -> float:
    return 1.0 if x >= 1 else 1 - math.pow(2, -10 * x)


def easeOutQuint(x: float) -> float:
    return 1 - math.pow(1 - clamp01(x), 5)


def easeInOutCubic(x: float) -> float:
    t = clamp01(x)
    return 4 * t * t * t if t < 0.5 else 1 - math.pow(-2 * t + 2, 3) / 2


def spring(x: float, damping: float = 0.55, freq: float = 2.1) -> float:
    t = clamp01(x)
    if t <= 0:
        return 0.0
    if t >= 1:
        return 1.0
    w = 2 * math.pi * freq
    wd = math.sqrt(1 - damping * damping)
    return 1 - math.exp(-damping * w * t) * (
        math.cos(w * wd * t) + (damping / wd) * math.sin(w * wd * t)
    )


def pop(x: float) -> float:
    return spring(x, 0.5, 1.9)


# ---------- বাংলা সংখ্যা ----------
_BN = "০১২৩৪৫৬৭৮৯"


def bn(n) -> str:
    return "".join(_BN[int(d)] if d.isdigit() else d for d in str(n))


# ---------- টেক্সট ----------
def wrapText(ctx: Canvas2D, text: str, maxWidth: float) -> list[str]:
    words = [w for w in text.split() if w]
    lines: list[str] = []
    cur = ""
    for w in words:
        test = (cur + " " + w) if cur else w
        if ctx.measureText(test).width <= maxWidth or not cur:
            cur = test
        else:
            lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines


def drawWrapped(ctx: Canvas2D, text: str, x: float, y: float, o: dict) -> float:
    lines = wrapText(ctx, text, o["maxWidth"])
    ctx.textAlign = o.get("align", "center")
    ctx.textBaseline = o.get("baseline", "top")
    lh = o.get("lh", 1.45)
    size = float(ctx.font.split("px")[0].split()[-1])
    if o.get("color"):
        ctx.fillStyle = o["color"]
    if o.get("glow"):
        ctx.shadowColor = o.get("glowColor", "rgba(212,175,104,0.55)")
        ctx.shadowBlur = o["glow"]
    for i, ln in enumerate(lines):
        ctx.fillText(ln, x, y + i * size * lh)
    ctx.shadowBlur = 0
    return len(lines) * size * lh


def drawStaggered(ctx: Canvas2D, text: str, x: float, y: float, o: dict) -> None:
    lines = wrapText(ctx, text, o["maxWidth"])
    size = float(ctx.font.split("px")[0].split()[-1])
    lh = o.get("lh", 1.4)
    step = o.get("stagger", 0.12)
    dur = o.get("dur", 0.5)
    ctx.textAlign = o.get("align", "center")
    ctx.textBaseline = o.get("baseline", "top")
    for i, ln in enumerate(lines):
        p = easeOutExpo(prog(o["t"], i * step, i * step + dur))
        if p <= 0:
            continue
        ctx.save()
        ctx.globalAlpha = p
        ctx.translate(0, (1 - p) * size * 0.55)
        ctx.fillStyle = o.get("color", C["ink"])
        if o.get("glow"):
            ctx.shadowColor = o.get("glowColor", "rgba(212,175,104,0.5)")
            ctx.shadowBlur = o["glow"] * p
        ctx.fillText(ln, x, y + i * size * lh)
        ctx.restore()
    ctx.shadowBlur = 0


# ---------- শেপ ----------
def goldRule(ctx: Canvas2D, cx: float, y: float, w: float, p: float, thick: float = 3) -> None:
    width = w * easeOutExpo(p)
    if width <= 0.5:
        return
    g = ctx.createLinearGradient(cx - width / 2, 0, cx + width / 2, 0)
    g.addColorStop(0, "rgba(212,175,104,0)")
    g.addColorStop(0.2, C["goldDeep"])
    g.addColorStop(0.5, C["goldBright"])
    g.addColorStop(0.8, C["goldDeep"])
    g.addColorStop(1, "rgba(212,175,104,0)")
    ctx.fillStyle = g
    ctx.fillRect(cx - width / 2, y - thick / 2, width, thick)


def roundRect(ctx: Canvas2D, x: float, y: float, w: float, h: float, r: float) -> None:
    ctx.beginPath()
    ctx.moveTo(x + r, y)
    ctx.arcTo(x + w, y, x + w, y + h, r)
    ctx.arcTo(x + w, y + h, x, y + h, r)
    ctx.arcTo(x, y + h, x, y, r)
    ctx.arcTo(x, y, x + w, y, r)
    ctx.closePath()


def card(ctx: Canvas2D, x: float, y: float, w: float, h: float, p: float, o: dict | None = None) -> None:
    o = o or {}
    s = pop(p)
    if s <= 0.001:
        return
    ctx.save()
    ctx.globalAlpha = min(1.0, p * 1.6)
    ctx.translate(x + w / 2, y + h / 2)
    ctx.scale(0.94 + 0.06 * s, 0.94 + 0.06 * s)
    ctx.translate(-(x + w / 2), -(y + h / 2))
    roundRect(ctx, x, y, w, h, o.get("r", 26))
    ctx.fillStyle = o.get("fill", C["cardBg"])
    ctx.fill()
    ctx.strokeStyle = o.get("line", C["cardLine"])
    ctx.lineWidth = 2
    ctx.stroke()
    ctx.restore()


# ---------- আইকন ----------
def iconShield(ctx: Canvas2D, cx: float, cy: float, r: float, p: float) -> None:
    if p <= 0:
        return
    ctx.save()
    ctx.globalAlpha = min(1.0, p * 2)
    ctx.strokeStyle = C["gold"]
    ctx.lineWidth = 5
    ctx.lineJoin = "round"
    ctx.lineCap = "round"
    ctx.shadowColor = "rgba(212,175,104,0.5)"
    ctx.shadowBlur = 18
    ctx.beginPath()
    ctx.moveTo(cx, cy - r)
    ctx.lineTo(cx + r * 0.82, cy - r * 0.55)
    ctx.lineTo(cx + r * 0.82, cy + r * 0.15)
    ctx.quadraticCurveTo(cx + r * 0.7, cy + r * 0.85, cx, cy + r)
    ctx.quadraticCurveTo(cx - r * 0.7, cy + r * 0.85, cx - r * 0.82, cy + r * 0.15)
    ctx.lineTo(cx - r * 0.82, cy - r * 0.55)
    ctx.closePath()
    ctx.stroke()
    cp = easeOutExpo(prog(p, 0.4, 1))
    if cp > 0:
        ctx.beginPath()
        ctx.moveTo(cx - r * 0.34, cy + r * 0.02)
        ctx.lineTo(cx - r * 0.06, cy + r * 0.32)
        ctx.lineTo(cx + r * 0.42, cy - r * 0.3)
        ctx.strokeStyle = C["goldBright"]
        ctx.stroke()
    ctx.restore()


def iconLock(ctx: Canvas2D, cx: float, cy: float, r: float, p: float) -> None:
    if p <= 0:
        return
    ctx.save()
    ctx.globalAlpha = min(1.0, p * 2)
    ctx.strokeStyle = C["gold"]
    ctx.lineWidth = 5
    ctx.lineCap = "round"
    ctx.shadowColor = "rgba(212,175,104,0.45)"
    ctx.shadowBlur = 16
    ctx.beginPath()
    ctx.arc(cx, cy - r * 0.25, r * 0.42, math.pi, 0)
    ctx.stroke()
    roundRect(ctx, cx - r * 0.7, cy - r * 0.15, r * 1.4, r * 1.05, r * 0.18)
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(cx, cy + r * 0.3, r * 0.11, 0, math.pi * 2)
    ctx.fillStyle = C["goldBright"]
    ctx.fill()
    ctx.restore()


def iconBuilding(ctx: Canvas2D, cx: float, cy: float, r: float, p: float) -> None:
    if p <= 0:
        return
    ctx.save()
    ctx.globalAlpha = min(1.0, p * 2)
    ctx.strokeStyle = C["gold"]
    ctx.lineWidth = 5
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
    ctx.shadowColor = "rgba(212,175,104,0.45)"
    ctx.shadowBlur = 16
    ctx.beginPath()
    ctx.moveTo(cx - r * 0.85, cy + r * 0.8)
    ctx.lineTo(cx - r * 0.85, cy - r * 0.35)
    ctx.lineTo(cx, cy - r * 0.9)
    ctx.lineTo(cx + r * 0.85, cy - r * 0.35)
    ctx.lineTo(cx + r * 0.85, cy + r * 0.8)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(cx, cy - r * 0.45)
    ctx.lineTo(cx, cy + r * 0.8)
    ctx.stroke()
    ctx.restore()


def iconScale(ctx: Canvas2D, cx: float, cy: float, r: float, p: float) -> None:
    if p <= 0:
        return
    s = pop(p)
    ctx.save()
    ctx.globalAlpha = min(1.0, p * 2)
    ctx.translate(cx, cy)
    ctx.scale(s, s)
    ctx.strokeStyle = C["gold"]
    ctx.lineWidth = 5
    ctx.lineCap = "round"
    ctx.shadowColor = "rgba(212,175,104,0.5)"
    ctx.shadowBlur = 18
    ctx.beginPath()
    ctx.moveTo(0, -r * 0.8)
    ctx.lineTo(0, r * 0.75)
    ctx.moveTo(-r * 0.45, r * 0.9)
    ctx.lineTo(r * 0.45, r * 0.9)
    ctx.stroke()
    ctx.rotate(math.sin(min(1.0, p) * math.pi) * 0.05)
    ctx.beginPath()
    ctx.moveTo(-r * 0.85, -r * 0.55)
    ctx.lineTo(r * 0.85, -r * 0.55)
    ctx.stroke()
    for d in (-1, 1):
        ctx.beginPath()
        ctx.moveTo(d * r * 0.85, -r * 0.55)
        ctx.lineTo(d * r * 0.85, -r * 0.1)
        ctx.stroke()
        ctx.beginPath()
        ctx.arc(d * r * 0.85, -r * 0.05, r * 0.3, 0, math.pi)
        ctx.stroke()
    ctx.restore()


def iconPhone(ctx: Canvas2D, cx: float, cy: float, r: float, p: float) -> None:
    if p <= 0:
        return
    ctx.save()
    ctx.globalAlpha = min(1.0, p * 2)
    ctx.strokeStyle = C["gold"]
    ctx.lineWidth = 5
    ctx.lineCap = "round"
    ctx.shadowColor = "rgba(212,175,104,0.5)"
    ctx.shadowBlur = 16
    roundRect(ctx, cx - r * 0.42, cy - r * 0.75, r * 0.84, r * 1.5, r * 0.16)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(cx - r * 0.16, cy + r * 0.52)
    ctx.lineTo(cx + r * 0.16, cy + r * 0.52)
    ctx.stroke()
    ctx.restore()


def iconDoc(ctx: Canvas2D, cx: float, cy: float, r: float, p: float) -> None:
    if p <= 0:
        return
    ctx.save()
    ctx.globalAlpha = min(1.0, p * 2)
    ctx.strokeStyle = C["gold"]
    ctx.lineWidth = 5
    ctx.lineJoin = "round"
    ctx.shadowColor = "rgba(212,175,104,0.45)"
    ctx.shadowBlur = 16
    ctx.beginPath()
    ctx.moveTo(cx - r * 0.65, cy - r * 0.85)
    ctx.lineTo(cx + r * 0.28, cy - r * 0.85)
    ctx.lineTo(cx + r * 0.65, cy - r * 0.48)
    ctx.lineTo(cx + r * 0.65, cy + r * 0.85)
    ctx.lineTo(cx - r * 0.65, cy + r * 0.85)
    ctx.closePath()
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(cx + r * 0.28, cy - r * 0.85)
    ctx.lineTo(cx + r * 0.28, cy - r * 0.48)
    ctx.lineTo(cx + r * 0.65, cy - r * 0.48)
    ctx.stroke()
    ctx.restore()


def iconWalk(ctx: Canvas2D, cx: float, cy: float, r: float, phase: float, alpha: float) -> None:
    ctx.save()
    ctx.globalAlpha = alpha
    ctx.strokeStyle = C["gold"]
    ctx.lineWidth = r * 0.13
    ctx.lineCap = "round"
    ctx.shadowColor = "rgba(212,175,104,0.6)"
    ctx.shadowBlur = 22
    swing = math.sin(phase) * 0.42
    ctx.beginPath()
    ctx.arc(cx, cy - r * 0.72, r * 0.24, 0, math.pi * 2)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(cx, cy - r * 0.45)
    ctx.lineTo(cx, cy + r * 0.1)
    ctx.moveTo(cx, cy + r * 0.1)
    ctx.lineTo(cx + math.sin(swing) * r * 0.4, cy + r * 0.8)
    ctx.moveTo(cx, cy + r * 0.1)
    ctx.lineTo(cx - math.sin(swing) * r * 0.4, cy + r * 0.8)
    ctx.moveTo(cx, cy - r * 0.3)
    ctx.lineTo(cx - math.sin(swing) * r * 0.35, cy + r * 0.12)
    ctx.stroke()
    ctx.beginPath()
    roundRect(ctx, cx - r * 0.02, cy - r * 0.42, r * 0.42, r * 0.42, r * 0.08)
    ctx.stroke()
    ctx.restore()


def checkMark(ctx: Canvas2D, cx: float, cy: float, r: float, p: float) -> None:
    e = easeOutExpo(p)
    if e <= 0:
        return
    ctx.save()
    ctx.strokeStyle = C["goldBright"]
    ctx.lineWidth = 6
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
    ctx.shadowColor = "rgba(240,215,155,0.7)"
    ctx.shadowBlur = 14
    pts = [(cx - r * 0.5, cy), (cx - r * 0.12, cy + r * 0.38), (cx + r * 0.55, cy - r * 0.4)]
    ctx.beginPath()
    ctx.moveTo(pts[0][0], pts[0][1])
    if e < 0.5:
        k = e / 0.5
        ctx.lineTo(lerp(pts[0][0], pts[1][0], k), lerp(pts[0][1], pts[1][1], k))
    else:
        ctx.lineTo(pts[1][0], pts[1][1])
        k = (e - 0.5) / 0.5
        ctx.lineTo(lerp(pts[1][0], pts[2][0], k), lerp(pts[1][1], pts[2][1], k))
    ctx.stroke()
    ctx.restore()


def ornament(ctx: Canvas2D, cx: float, cy: float, r: float, p: float, rot: float = 0) -> None:
    if p <= 0:
        return
    ctx.save()
    ctx.globalAlpha = min(1.0, p) * 0.9
    ctx.translate(cx, cy)
    ctx.rotate(rot)
    ctx.strokeStyle = C["gold"]
    ctx.lineWidth = 3
    ctx.shadowColor = "rgba(212,175,104,0.6)"
    ctx.shadowBlur = 14
    for k in range(2):
        ctx.beginPath()
        for i in range(5):
            a = (i / 4) * math.pi * 2 + (k * math.pi) / 4
            x = math.cos(a) * r * easeOutExpo(p)
            y = math.sin(a) * r * easeOutExpo(p)
            if i == 0:
                ctx.moveTo(x, y)
            else:
                ctx.lineTo(x, y)
        ctx.stroke()
    ctx.restore()


# ---------- ব্যাকগ্রাউন্ড ----------
_grain = None


def _grain_image():
    global _grain
    if _grain is not None:
        return _grain
    import numpy as np

    rng = random.Random(7)
    n = 256
    arr = np.zeros((n, n, 4), dtype=np.uint8)
    gray = np.array([int(120 + rng.random() * 90) for _ in range(n * n)], dtype=np.uint8)
    arr[:, :, 0] = arr[:, :, 1] = arr[:, :, 2] = gray.reshape(n, n)
    arr[:, :, 3] = 26
    _grain = skia.Image.fromarray(arr, skia.ColorType.kRGBA_8888_ColorType, skia.AlphaType.kUnpremul_AlphaType)
    return _grain


class Particle:
    __slots__ = ("x", "y", "r", "vx", "vy", "depth", "seed")

    def __init__(self, rng: random.Random):
        self.depth = rng.random()
        self.x = rng.random() * W
        self.y = rng.random() * H
        self.r = lerp(0.7, 2.6, self.depth)
        self.vx = lerp(-4, 4, rng.random())
        self.vy = lerp(-16, -4, self.depth + rng.random() * 0.4)
        self.seed = rng.random() * 100


def makeParticles(n: int, rng: random.Random) -> list[Particle]:
    return [Particle(rng) for _ in range(n)]


def drawParticles(ctx: Canvas2D | None, ps: list[Particle], dt: float, t: float, boost: float = 1.0, update_only: bool = False) -> None:
    for p in ps:
        p.x += (p.vx * dt + math.sin(t * 0.35 + p.seed) * 7 * dt) * boost
        p.y += p.vy * dt * boost
        if p.y < -20:
            p.y = H + 20
            p.x = random.random() * W
        if p.x < -20:
            p.x = W + 20
        if p.x > W + 20:
            p.x = -20
        if update_only or ctx is None:
            continue
        tw = 0.55 + 0.45 * math.sin(t * 1.4 + p.seed * 3)
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, math.pi * 2)
        ctx.fillStyle = f"rgba(226,205,160,{(0.06 + 0.16 * p.depth) * tw})"
        ctx.fill()


def drawBackground(ctx: Canvas2D, t: float, warmth: float = 1.0) -> None:
    g = ctx.createLinearGradient(0, 0, W * 0.35, H)
    g.addColorStop(0, C["bg1"])
    g.addColorStop(0.55, C["bg2"])
    g.addColorStop(1, C["bg0"])
    ctx.fillStyle = g
    ctx.fillRect(0, 0, W, H)

    gx = W * 0.5 + math.sin(t * 0.11) * W * 0.16
    gy = H * 0.3 + math.cos(t * 0.09) * H * 0.06
    rg = ctx.createRadialGradient(gx, gy, 0, gx, gy, W * 0.95)
    rg.addColorStop(0, f"rgba(150,116,52,{0.2 * warmth})")
    rg.addColorStop(0.45, f"rgba(70,60,40,{0.09 * warmth})")
    rg.addColorStop(1, "rgba(0,0,0,0)")
    ctx.fillStyle = rg
    ctx.fillRect(0, 0, W, H)

    bg = ctx.createLinearGradient(0, H * 0.72, 0, H)
    bg.addColorStop(0, "rgba(0,0,0,0)")
    bg.addColorStop(1, "rgba(0,0,0,0.55)")
    ctx.fillStyle = bg
    ctx.fillRect(0, 0, W, H)


def drawLightStreaks(ctx: Canvas2D, t: float, count: int = 3) -> None:
    for i in range(count):
        period = 13 + i * 5.5
        phase = (t + i * 4.2) % period
        life = phase / period
        if life > 0.62:
            continue
        k = life / 0.62
        alpha = math.sin(k * math.pi) * 0.13
        x = lerp(-W * 0.4, W * 1.35, k)
        y = H * (0.22 + i * 0.26)
        ctx.save()
        ctx.globalCompositeOperation = "lighter"
        ctx.translate(x, y)
        ctx.rotate(-0.42 + i * 0.13)
        g = ctx.createLinearGradient(-W * 0.55, 0, W * 0.55, 0)
        g.addColorStop(0, "rgba(212,175,104,0)")
        g.addColorStop(0.5, f"rgba(240,215,155,{alpha})")
        g.addColorStop(1, "rgba(212,175,104,0)")
        ctx.fillStyle = g
        ctx.fillRect(-W * 0.55, -3, W * 1.1, 6)
        ctx.restore()


def drawVignette(ctx: Canvas2D) -> None:
    g = ctx.createRadialGradient(W / 2, H * 0.46, H * 0.22, W / 2, H * 0.5, H * 0.78)
    g.addColorStop(0, "rgba(0,0,0,0)")
    g.addColorStop(1, "rgba(0,0,0,0.62)")
    ctx.fillStyle = g
    ctx.fillRect(0, 0, W, H)


def drawGrain(ctx: Canvas2D, rng: random.Random) -> None:
    tile = _grain_image()
    ctx.save()
    ctx.globalAlpha = 0.055
    ox = -rng.randrange(256)
    oy = -rng.randrange(256)
    x = ox
    while x < W:
        y = oy
        while y < H:
            ctx.drawImage(tile, x, y)
            y += 256
        x += 256
    ctx.restore()


def drawSafeZones(ctx: Canvas2D) -> None:
    ctx.save()
    ctx.strokeStyle = "rgba(80,200,255,0.55)"
    ctx.lineWidth = 3
    ctx.strokeRect(70, 230, W - 140, H - 230 - 330)
    ctx.fillStyle = "rgba(80,200,255,0.75)"
    ctx.font = F("sans", 500, 22)
    ctx.textAlign = "left"
    ctx.fillText("SAFE ZONE", 74, 214)
    ctx.restore()
