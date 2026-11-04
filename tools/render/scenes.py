"""
scenes.py — src/app/video/scenes.ts-এর পাইথন পোর্ট (প্রতিটি শটের কম্পোজিশন)।
"""
from __future__ import annotations

import math

from engine import (
    W, H, C, F, bn, lerp, prog, easeOutExpo, easeOutQuint, easeInOutCubic,
    smoothstep, pop, drawWrapped, drawStaggered, goldRule, roundRect, card,
    iconShield, iconLock, iconBuilding, iconScale, iconPhone, iconDoc, iconWalk,
    checkMark, ornament,
)

MX = 96
CW = W - MX * 2
TOP = 300


def st(i: int, gap: float = 0.1) -> float:
    return i * gap


# ---------- সিন ০ ----------
def s0(ctx, p, t, lt):
    walk = easeInOutCubic(prog(p, 0.02, 0.78))
    x = lerp(W * 0.28, W * 0.72, walk)
    alpha = smoothstep(prog(p, 0.02, 0.14)) * (1 - smoothstep(prog(p, 0.7, 0.84)))
    iconWalk(ctx, x, H * 0.4, 52, t * 5.5, alpha * 0.95)

    ctx.save()
    ctx.globalAlpha = alpha * 0.35
    ctx.fillEllipseFast(x, H * 0.4 + 60, 46, 9, "rgba(0,0,0,0.9)")
    ctx.restore()

    tp = prog(p, 0.3, 1)
    ctx.textAlign = "center"
    ctx.textBaseline = "alphabetic"
    ctx.font = F("serif", 700, 104)
    drawStaggered(ctx, "যে নীরবতা", W / 2, H * 0.545, dict(
        maxWidth=CW, t=tp, dur=0.55, stagger=0.1, color=C["ink"], glow=26, lh=1.2, align="center"))
    ctx.font = F("serif", 700, 104)
    drawStaggered(ctx, "আমাদের সন্তানদের", W / 2, H * 0.545 + 130, dict(
        maxWidth=CW, t=prog(p, 0.44, 1), dur=0.55, stagger=0.1, color=C["ink"], glow=26, lh=1.2, align="center"))
    ctx.font = F("serif", 700, 104)
    drawStaggered(ctx, "ঢেকে রাখে", W / 2, H * 0.545 + 260, dict(
        maxWidth=CW, t=prog(p, 0.58, 1), dur=0.55, stagger=0.1, color=C["gold"], glow=34, lh=1.2, align="center"))

    goldRule(ctx, W / 2, H * 0.545 + 370, 520, prog(p, 0.7, 1))
    ctx.font = F("sans", 500, 38)
    ctx.fillStyle = C["dim"]
    ctx.globalAlpha = smoothstep(prog(p, 0.78, 1))
    ctx.fillText("শিশু নিরাপত্তা · বাংলাদেশ", W / 2, H * 0.545 + 440)
    ctx.globalAlpha = 1


# ---------- সিন ১ ----------
def s1(ctx, p, t, lt):
    ctx.textAlign = "center"
    qp = easeOutExpo(prog(p, 0, 0.2))
    ctx.save()
    ctx.globalAlpha = qp * 0.5
    ctx.font = F("serif", 700, 460)
    ctx.fillStyle = "rgba(212,175,104,0.16)"
    ctx.textBaseline = "alphabetic"
    ctx.translate(W / 2, TOP + 470)
    ctx.scale(0.9 + 0.1 * qp, 0.9 + 0.1 * qp)
    ctx.fillText("?", 0, 0)
    ctx.restore()

    ctx.textBaseline = "top"
    ctx.font = F("serif", 600, 84)
    drawStaggered(ctx, "একটা শিশু ভোরবেলা", W / 2, TOP + 40, dict(
        maxWidth=CW, t=p, dur=0.4, stagger=0.09, color=C["ink"], lh=1.35))
    ctx.font = F("serif", 600, 84)
    drawStaggered(ctx, "ঘর থেকে বের হয়।", W / 2, TOP + 40 + 116, dict(
        maxWidth=CW, t=prog(p, 0.1, 1), dur=0.4, stagger=0.09, color=C["ink"], lh=1.35))

    goldRule(ctx, W / 2, TOP + 330, 460, prog(p, 0.28, 0.5))

    ctx.font = F("sans", 500, 54)
    drawStaggered(ctx, "ফিরে আসে চুপ করে।", W / 2, TOP + 390, dict(
        maxWidth=CW, t=prog(p, 0.34, 1), dur=0.4, stagger=0.09, color=C["dim"], lh=1.4))

    cp = prog(p, 0.56, 1)
    y0 = TOP + 560
    card(ctx, MX, y0, CW, 330, cp, dict(fill="rgba(201,85,74,0.07)", line="rgba(201,85,74,0.3)"))
    ctx.font = F("serif", 600, 66)
    drawStaggered(ctx, "অনেক প্রশ্নের উত্তর", W / 2, y0 + 62, dict(
        maxWidth=CW - 120, t=prog(p, 0.6, 1), dur=0.4, stagger=0.08, color=C["ink"], lh=1.3))
    ctx.font = F("serif", 600, 66)
    drawStaggered(ctx, "সে কাউকে বলে না।", W / 2, y0 + 62 + 92, dict(
        maxWidth=CW - 120, t=prog(p, 0.7, 1), dur=0.4, stagger=0.08, color="#e8a49c", lh=1.3))

    ctx.font = F("sans", 600, 46)
    ctx.fillStyle = C["gold"]
    ctx.globalAlpha = smoothstep(prog(p, 0.86, 1))
    ctx.fillText("আজ আমরা সেই নীরবতা নিয়েই কথা বলব", W / 2, y0 + 430)
    ctx.globalAlpha = 1


# ---------- সিন ২ ----------
def statBlock(ctx, x, y, w, h, value, label, sub, p, accent):
    card(ctx, x, y, w, h, p)
    e = easeOutQuint(p)
    ctx.save()
    ctx.textAlign = "center"
    ctx.textBaseline = "alphabetic"
    ctx.font = F("num", 700, 132)
    ctx.fillStyle = accent
    ctx.shadowColor = accent
    ctx.shadowBlur = 30 * e
    ctx.globalAlpha = min(1.0, p * 2)
    ctx.fillText(bn(round(value * e)), x + w / 2, y + 150)
    ctx.shadowBlur = 0
    ctx.textBaseline = "top"
    ctx.font = F("sans", 600, 44)
    ctx.fillStyle = C["ink"]
    ctx.fillText(label, x + w / 2, y + 186)
    ctx.font = F("sans", 400, 32)
    drawWrapped(ctx, sub, x + w / 2, y + 244, dict(maxWidth=w - 60, color=C["dim"], lh=1.3))
    ctx.restore()


def s2(ctx, p, t, lt):
    ctx.textAlign = "center"
    ctx.textBaseline = "top"
    ctx.font = F("sans", 600, 40)
    ctx.fillStyle = C["gold"]
    ctx.globalAlpha = smoothstep(prog(p, 0, 0.08))
    ctx.fillText("জানুয়ারি — সেপ্টেম্বর ২০২৬", W / 2, TOP - 10)
    ctx.globalAlpha = 1
    goldRule(ctx, W / 2, TOP + 62, 620, prog(p, 0.02, 0.12))

    ctx.font = F("serif", 600, 58)
    drawStaggered(ctx, "মাদ্রাসায় শিশু নির্যাতন", W / 2, TOP + 100, dict(
        maxWidth=CW, t=prog(p, 0.04, 1), dur=0.35, stagger=0.08, color=C["ink"]))

    bw = (CW - 40) / 2
    statBlock(ctx, MX, TOP + 200, bw, 330, 72, "ঘটনা", "শুধু মাদ্রাসাতেই", prog(p, 0.14, 0.34), C["gold"])
    statBlock(ctx, MX + bw + 40, TOP + 200, bw, 330, 109, "শিশু ক্ষতিগ্রস্ত", "কমপক্ষে", prog(p, 0.2, 0.4), "#e8a49c")

    goldRule(ctx, W / 2, TOP + 590, 780, prog(p, 0.3, 0.42))
    ctx.font = F("serif", 600, 54)
    drawStaggered(ctx, "সারাদেশে, ছেলে শিশুদের ওপর", W / 2, TOP + 630, dict(
        maxWidth=CW, t=prog(p, 0.34, 1), dur=0.35, stagger=0.08, color=C["ink"]))

    statBlock(ctx, MX + CW / 2 - bw / 2, TOP + 700, bw, 330, 171, "শিশু", "১৩১টি ঘটনায়", prog(p, 0.4, 0.6), C["gold"])

    roundRect(ctx, MX, TOP + 1070, CW, 130, 22)
    ctx.fillStyle = "rgba(255,255,255,0.03)"
    ctx.globalAlpha = smoothstep(prog(p, 0.56, 1))
    ctx.fill()
    ctx.globalAlpha = 1
    ctx.font = F("sans", 500, 40)
    drawStaggered(ctx, "এগুলো শুধু খবরের কাগজে আসা ঘটনা।", W / 2, TOP + 1105, dict(
        maxWidth=CW - 100, t=prog(p, 0.6, 1), dur=0.35, stagger=0.08, color=C["dim"]))
    ctx.font = F("sans", 400, 28)
    ctx.globalAlpha = smoothstep(prog(p, 0.7, 1))
    ctx.fillStyle = "rgba(139,144,154,0.8)"
    ctx.fillText("সূত্র: JusticeMakers Bangladesh in France (JMBF)", W / 2, TOP + 1215)
    ctx.globalAlpha = 1


# ---------- সিন ৩ ----------
COVER_STEPS = [
    (iconLock, "মিথ্যা আশ্বাস", "শিশুকে ভয় দেখানো, লোভ দেখানো"),
    (iconBuilding, "প্রতিষ্ঠানের চাপ", "ভাবমর্যাদার নামে চুপ করানো"),
    (iconShield, "আইনে বাধা", "পুলিশ অভিযুক্ত নিতে গেলেও"),
]


def s3(ctx, p, t, lt):
    ctx.textAlign = "center"
    ctx.textBaseline = "top"
    ctx.font = F("sans", 600, 40)
    ctx.fillStyle = "#e8a49c"
    ctx.globalAlpha = smoothstep(prog(p, 0, 0.07))
    ctx.fillText("অপরাধ একা হয় না", W / 2, TOP - 10)
    ctx.globalAlpha = 1

    ctx.font = F("serif", 700, 88)
    drawStaggered(ctx, "তারপর শুরু হয় ঢাকা", W / 2, TOP + 60, dict(
        maxWidth=CW, t=prog(p, 0.02, 1), dur=0.35, stagger=0.09, color=C["ink"], glow=20))

    for i, (icon, title, sub) in enumerate(COVER_STEPS):
        cp = prog(p, 0.14 + st(i, 0.16), 0.34 + st(i, 0.16))
        y = TOP + 240 + i * 240
        card(ctx, MX, y, CW, 210, cp)
        icon(ctx, MX + 118, y + 105, 54, cp)
        ctx.save()
        ctx.globalAlpha = min(1.0, cp * 1.8)
        ctx.textAlign = "left"
        ctx.font = F("serif", 600, 56)
        ctx.fillStyle = C["ink"]
        ctx.fillText(f"{bn(i + 1)}. {title}", MX + 210, y + 58)
        ctx.font = F("sans", 400, 36)
        ctx.fillStyle = C["dim"]
        ctx.fillText(sub, MX + 210, y + 130)
        ctx.restore()

    y0 = TOP + 960
    goldRule(ctx, W / 2, y0, 700, prog(p, 0.66, 0.78))
    ctx.font = F("serif", 700, 56)
    drawStaggered(ctx, "শিশু নয় —", W / 2, y0 + 50, dict(
        maxWidth=CW, t=prog(p, 0.7, 1), dur=0.3, stagger=0.08, color=C["ink"]))
    ctx.font = F("serif", 700, 56)
    drawStaggered(ctx, "তখন রক্ষা করা হয় প্রতিষ্ঠানকে।", W / 2, y0 + 50 + 92, dict(
        maxWidth=CW, t=prog(p, 0.78, 1), dur=0.3, stagger=0.08, color="#e8a49c", glow=18))
    ctx.font = F("sans", 400, 28)
    ctx.textAlign = "center"
    ctx.globalAlpha = smoothstep(prog(p, 0.88, 1))
    ctx.fillStyle = "rgba(139,144,154,0.8)"
    ctx.fillText("সূত্র: আইন ও সালিশ কেন্দ্র / New Age — গাজীপুর, গাছা", W / 2, y0 + 250)
    ctx.globalAlpha = 1


# ---------- সিন ৪ ----------
LAW_ROWS = [
    ("ধারা ৯", "নারী ও শিশু নির্যাতন দমন আইন ২০০০",
     "শিশু ধর্ষণে সর্বোচ্চ শাস্তি মৃত্যুদণ্ড, অথবা যাবজ্জীবন কারাদণ্ড"),
    ("২০২০", "সংশোধনী", "সব ধরনের ধর্ষণে সর্বোচ্চ শাস্তি হিসেবে মৃত্যুদণ্ড যুক্ত"),
    ("সময়সীমা", "২০২৫ সংশোধনী", "তদন্ত ১৫ দিন, বিচার ৯০ দিনের মধ্যে সম্পন্ন"),
]


def s4(ctx, p, t, lt):
    ctx.textAlign = "center"
    ctx.textBaseline = "top"
    iconDoc(ctx, W / 2, TOP + 70, 62, prog(p, 0, 0.14))

    ctx.font = F("sans", 600, 40)
    ctx.fillStyle = C["gold"]
    ctx.globalAlpha = smoothstep(prog(p, 0.04, 0.12))
    ctx.fillText("আইন কী বলে", W / 2, TOP + 170)
    ctx.globalAlpha = 1

    ctx.font = F("serif", 700, 84)
    drawStaggered(ctx, "জেনে রাখুন", W / 2, TOP + 235, dict(
        maxWidth=CW, t=prog(p, 0.06, 1), dur=0.35, stagger=0.09, color=C["ink"], glow=22))

    for i, (k, v, detail) in enumerate(LAW_ROWS):
        rp = prog(p, 0.18 + st(i, 0.17), 0.4 + st(i, 0.17))
        y = TOP + 400 + i * 250
        off = (1 - easeOutExpo(rp)) * 90
        ctx.save()
        ctx.globalAlpha = min(1.0, rp * 1.7)
        ctx.translate(-off, 0)
        roundRect(ctx, MX, y, CW, 215, 24)
        ctx.fillStyle = C["cardBg"]
        ctx.fill()
        ctx.strokeStyle = C["cardLine"]
        ctx.lineWidth = 2
        ctx.stroke()
        ctx.fillStyle = C["gold"]
        ctx.fillRect(MX, y + 22, 6, 171)
        ctx.textAlign = "left"
        ctx.font = F("sans", 700, 46)
        ctx.fillText(k, MX + 44, y + 46)
        ctx.font = F("sans", 400, 32)
        ctx.fillStyle = C["dim"]
        ctx.fillText(v, MX + 44, y + 104)
        ctx.font = F("serif", 500, 40)
        drawWrapped(ctx, detail, MX + 44, y + 150, dict(
            maxWidth=CW - 90, align="left", color=C["ink"], lh=1.28))
        ctx.restore()

    ctx.font = F("sans", 400, 28)
    ctx.textAlign = "center"
    ctx.globalAlpha = smoothstep(prog(p, 0.78, 1))
    ctx.fillStyle = "rgba(139,144,154,0.8)"
    ctx.fillText("সূত্র: দণ্ডবিধি ১৮৬০ · নারী ও শিশু নির্যাতন দমন আইন ২০০০", W / 2, TOP + 1180)
    ctx.globalAlpha = 1


# ---------- সিন ৫ ----------
def s5(ctx, p, t, lt):
    ctx.textAlign = "center"
    ctx.textBaseline = "top"
    ornament(ctx, W / 2, TOP + 80, 78, prog(p, 0, 0.16), t * 0.06)

    ctx.font = F("sans", 600, 40)
    ctx.fillStyle = C["gold"]
    ctx.globalAlpha = smoothstep(prog(p, 0.04, 0.12))
    ctx.fillText("ইসলাম কী বলে", W / 2, TOP + 200)
    ctx.globalAlpha = 1

    c1 = prog(p, 0.08, 0.26)
    card(ctx, MX, TOP + 240, CW, 280, c1, dict(fill="rgba(212,175,104,0.06)", line="rgba(212,175,104,0.35)"))
    ctx.font = F("serif", 700, 70)
    drawStaggered(ctx, "ধর্ষণের শিকার শিশুর", W / 2, TOP + 290, dict(
        maxWidth=CW - 120, t=prog(p, 0.1, 1), dur=0.3, stagger=0.08, color=C["ink"]))
    ctx.font = F("serif", 700, 70)
    drawStaggered(ctx, "ওপর কোনো দোষ নেই", W / 2, TOP + 290 + 92, dict(
        maxWidth=CW - 120, t=prog(p, 0.16, 1), dur=0.3, stagger=0.08, color=C["gold"], glow=26))

    iconScale(ctx, W / 2, TOP + 600, 62, prog(p, 0.24, 0.4))
    ctx.font = F("sans", 500, 40)
    drawStaggered(ctx, "চার মাযহাবের ফকিহদের অবস্থান এক —", W / 2, TOP + 680, dict(
        maxWidth=CW, t=prog(p, 0.28, 1), dur=0.3, stagger=0.08, color=C["ink"]))
    ctx.font = F("sans", 500, 40)
    drawStaggered(ctx, "যাকে জোর করা হয়েছে, তার ওপর হদ্দ শাস্তি নেই", W / 2, TOP + 738, dict(
        maxWidth=CW, t=prog(p, 0.33, 1), dur=0.3, stagger=0.08, color=C["ink"]))

    goldRule(ctx, W / 2, TOP + 810, 760, prog(p, 0.38, 0.48))

    ctx.font = F("sans", 600, 38)
    ctx.globalAlpha = smoothstep(prog(p, 0.42, 0.5))
    ctx.fillStyle = C["gold"]
    ctx.fillText("কুরআনের নির্দেশ", W / 2, TOP + 850)
    ctx.globalAlpha = 1

    ctx.font = F("serif", 600, 58)
    drawStaggered(ctx, "সাক্ষ্য গোপন করো না —", W / 2, TOP + 915, dict(
        maxWidth=CW, t=prog(p, 0.45, 1), dur=0.3, stagger=0.08, color=C["ink"], glow=16))
    ctx.font = F("serif", 500, 40)
    drawStaggered(ctx, "যে গোপন করে, তার অন্তর গোনাহগার  ·  ২:২৮৩", W / 2, TOP + 992, dict(
        maxWidth=CW, t=prog(p, 0.52, 1), dur=0.3, stagger=0.08, color=C["dim"]))

    ctx.font = F("serif", 600, 58)
    drawStaggered(ctx, "ন্যায়বিচার দাঁড়া করাও —", W / 2, TOP + 1072, dict(
        maxWidth=CW, t=prog(p, 0.6, 1), dur=0.3, stagger=0.08, color=C["ink"], glow=16))
    ctx.font = F("serif", 500, 40)
    drawStaggered(ctx, "যাদের প্রতি ঘৃণা আছে, তাদের বেলায়ও  ·  ৫:৮", W / 2, TOP + 1149, dict(
        maxWidth=CW, t=prog(p, 0.66, 1), dur=0.3, stagger=0.08, color=C["dim"]))


# ---------- সিন ৬ ----------
ACTIONS = ["শিশুর কথা বিশ্বাস করুন", "১০৯৮ নম্বরে ফোন করুন", "প্রতিষ্ঠানে নিরাপদ অভিযোগ ব্যবস্থা দাবি করুন"]


def s6(ctx, p, t, lt):
    ctx.textAlign = "center"
    ctx.textBaseline = "top"
    ctx.font = F("serif", 700, 88)
    drawStaggered(ctx, "তাহলে করণীয় কী?", W / 2, TOP, dict(
        maxWidth=CW, t=prog(p, 0, 1), dur=0.35, stagger=0.09, color=C["ink"], glow=22))

    for i, a in enumerate(ACTIONS):
        ap = prog(p, 0.12 + st(i, 0.13), 0.32 + st(i, 0.13))
        y = TOP + 180 + i * 175
        card(ctx, MX, y, CW, 145, ap)
        checkMark(ctx, MX + 92, y + 73, 40, prog(p, 0.2 + st(i, 0.13), 0.4 + st(i, 0.13)))
        ctx.save()
        ctx.globalAlpha = min(1.0, ap * 1.8)
        ctx.textAlign = "left"
        ctx.font = F("sans", 500, 46)
        drawWrapped(ctx, a, MX + 160, y + 50, dict(maxWidth=CW - 220, align="left", color=C["ink"], lh=1.2))
        ctx.restore()

    hp = prog(p, 0.5, 0.72)
    cy = TOP + 900
    s = pop(hp)
    ctx.save()
    ctx.globalAlpha = min(1.0, hp * 1.6)
    ctx.translate(W / 2, cy)
    ctx.scale(s, s)
    for i in range(3):
        ph = (t * 0.55 + i * 0.33) % 1
        ctx.beginPath()
        ctx.arc(0, 0, lerp(150, 330, ph), 0, math.pi * 2)
        ctx.strokeStyle = f"rgba(212,175,104,{(1 - ph) * 0.35})"
        ctx.lineWidth = 3
        ctx.stroke()
    roundRect(ctx, -320, -140, 640, 280, 40)
    ctx.fillStyle = "rgba(212,175,104,0.1)"
    ctx.fill()
    ctx.strokeStyle = "rgba(240,215,155,0.55)"
    ctx.lineWidth = 3
    ctx.stroke()
    ctx.textAlign = "center"
    ctx.textBaseline = "alphabetic"
    ctx.font = F("num", 700, 170)
    ctx.fillStyle = C["goldBright"]
    ctx.shadowColor = "rgba(240,215,155,0.75)"
    ctx.shadowBlur = 40
    ctx.fillText("১০৯৮", 0, 62)
    ctx.restore()

    ctx.textBaseline = "top"
    ctx.font = F("sans", 500, 36)
    drawStaggered(ctx, "শিশু হেল্পলাইন · টোল ফ্রি · সারাদেশে · ২৪ ঘণ্টা", W / 2, cy + 190, dict(
        maxWidth=CW, t=prog(p, 0.72, 1), dur=0.3, stagger=0.08, color=C["ink"]))
    iconPhone(ctx, W / 2 - 330, cy, 46, prog(p, 0.6, 0.8))
    iconPhone(ctx, W / 2 + 330, cy, 46, prog(p, 0.6, 0.8))


# ---------- সিন ৭ ----------
def s7(ctx, p, t, lt):
    ctx.textAlign = "center"
    ctx.textBaseline = "top"
    ctx.font = F("serif", 600, 68)
    drawStaggered(ctx, "নীরব থাকা মানে", W / 2, H * 0.34, dict(
        maxWidth=CW, t=prog(p, 0, 1), dur=0.35, stagger=0.09, color=C["dim"]))
    ctx.font = F("serif", 600, 68)
    drawStaggered(ctx, "এই ব্যবস্থার পক্ষে থাকা।", W / 2, H * 0.34 + 96, dict(
        maxWidth=CW, t=prog(p, 0.1, 1), dur=0.35, stagger=0.09, color="#e8a49c", glow=20))

    goldRule(ctx, W / 2, H * 0.34 + 250, 620, prog(p, 0.3, 0.45))

    ctx.font = F("serif", 700, 82)
    drawStaggered(ctx, "প্রতিটি শিশুর নিরাপদ", W / 2, H * 0.34 + 320, dict(
        maxWidth=CW, t=prog(p, 0.36, 1), dur=0.35, stagger=0.09, color=C["ink"]))
    ctx.font = F("serif", 700, 82)
    drawStaggered(ctx, "বেড়ে ওঠার অধিকার আছে", W / 2, H * 0.34 + 320 + 112, dict(
        maxWidth=CW, t=prog(p, 0.46, 1), dur=0.35, stagger=0.09, color=C["ink"]))

    iconShield(ctx, W / 2, H * 0.34 + 690, 84, prog(p, 0.56, 0.8))
    ctx.font = F("serif", 600, 58)
    ctx.globalAlpha = smoothstep(prog(p, 0.7, 1))
    ctx.fillStyle = C["gold"]
    ctx.fillText("আসুন, সেই অধিকার রক্ষা করি", W / 2, H * 0.34 + 830)
    ctx.globalAlpha = 1


# ---------- সিন ৮ ----------
def s8(ctx, p, t, lt):
    ctx.textAlign = "center"
    ctx.textBaseline = "top"
    ornament(ctx, W / 2, H * 0.32, 96, prog(p, 0, 0.2), -t * 0.05)

    ctx.font = F("sans", 500, 40)
    ctx.globalAlpha = smoothstep(prog(p, 0.08, 0.2))
    ctx.fillStyle = C["dim"]
    ctx.fillText("নির্মাণ ও উপস্থাপনা", W / 2, H * 0.42)
    ctx.globalAlpha = 1

    goldRule(ctx, W / 2, H * 0.455, 480, prog(p, 0.14, 0.28))

    # নাম — shimmer: ব্রাউজারে মুভিং গ্রেডিয়েন্ট, এখানে একই রঙের ইন্টারপোলেশন
    np_ = easeOutExpo(prog(p, 0.18, 0.4))
    ctx.save()
    ctx.globalAlpha = np_
    ctx.textBaseline = "alphabetic"
    ctx.font = F("serif", 700, 130)
    k = (math.sin(t * 1.1) + 1) / 2
    g = ctx.createLinearGradient(W / 2 - 380, 0, W / 2 + 380, 0)
    g.addColorStop(0, C["goldDeep"])
    g.addColorStop(max(0.05, min(0.95, k)), C["goldBright"])
    g.addColorStop(1, C["goldDeep"])
    ctx.fillStyle = g
    ctx.shadowColor = "rgba(240,215,155,0.45)"
    ctx.shadowBlur = 34
    ctx.fillText("আব্দুর রহমান", W / 2, H * 0.545)
    ctx.restore()

    ctx.textBaseline = "top"
    goldRule(ctx, W / 2, H * 0.578, 480, prog(p, 0.3, 0.44))

    ctx.font = F("sans", 400, 36)
    ctx.globalAlpha = smoothstep(prog(p, 0.36, 0.52))
    ctx.fillStyle = C["dim"]
    ctx.fillText("সহযোগিতায় — Arena.ai", W / 2, H * 0.60)
    ctx.globalAlpha = 1

    ctx.font = F("sans", 400, 30)
    ctx.globalAlpha = smoothstep(prog(p, 0.46, 0.62))
    ctx.fillStyle = "rgba(139,144,154,0.7)"
    ctx.fillText("তথ্যসূত্র: ASK · New Age · JMBF · Daily Asian Age", W / 2, H * 0.655)
    ctx.globalAlpha = 1

    sp = prog(p, 0.58, 0.78)
    card(ctx, W / 2 - 340, H * 0.7, 680, 170, sp, dict(fill="rgba(212,175,104,0.08)", line="rgba(212,175,104,0.3)"))
    ctx.font = F("sans", 600, 44)
    ctx.globalAlpha = min(1.0, sp * 1.7)
    ctx.fillStyle = C["ink"]
    ctx.fillText("ভিডিওটি শেয়ার করুন", W / 2, H * 0.7 + 44)
    ctx.font = F("sans", 400, 32)
    ctx.fillStyle = C["gold"]
    ctx.fillText("জানলে শিশু সুরক্ষিত থাকে", W / 2, H * 0.7 + 108)
    ctx.globalAlpha = 1


SEGMENTS = [
    dict(id="cold-open", fixed=7.5, vo=[], draw=s0),
    dict(id="hook", vo=["vo-01.mp3"], draw=s1),
    dict(id="numbers", vo=["vo-02a.mp3", "vo-02b.mp3"], draw=s2),
    dict(id="coverup", vo=["vo-03.mp3"], draw=s3),
    dict(id="law", vo=["vo-04.mp3"], draw=s4),
    dict(id="islam", vo=["vo-05.mp3"], draw=s5),
    dict(id="action", vo=["vo-06.mp3"], draw=s6),
    dict(id="closing", vo=["vo-07.mp3"], draw=s7),
    dict(id="credits", fixed=13.0, vo=[], draw=s8),
]
