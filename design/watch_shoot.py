#!/usr/bin/env python3
"""
TIMEORA — watch shoot post-production helper.

Two jobs that must NOT be done by an AI image model:
  1. Typography + the "Butterfly Lock" badge  -> drawn pixel-perfect with code
  2. Web optimisation (small MB, no visible quality loss) -> code

Only ImageMagick (`convert`) is required. No Python packages.

Commands
--------
  badge      build the transparent "Butterfly Lock" badge PNG (crisp at 4x, then downsampled)
  overlay    stamp a badge onto ONE image, bottom-centre, with a soft shadow + optional scrim
  optimize   export web-ready .jpg (+ .webp), long side capped, metadata stripped
  all        overlay + optimize in one go (used by the shoot workflow)

Examples
--------
  python3 design/watch_shoot.py badge --out design/assets/badges/butterfly-lock-gold.png
  python3 design/watch_shoot.py overlay --in shoot/hero.png --out shoot/hero-lock.png \
        --badge design/assets/badges/butterfly-lock-gold.png --scrim 0.22
  python3 design/watch_shoot.py optimize --in shoot/hero-lock.png --out shoot/web/hero --max 1600 --quality 82
"""

from __future__ import annotations

import argparse
import json
import os
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent
FONT_SERIF = ROOT / "fonts" / "Marcellus-Regular.ttf"      # luxury caps (labels, badge)
FONT_SANS = ROOT / "fonts" / "Jost[wght].ttf"              # clean geometric sans (small caps)
FONT_DISPLAY = ROOT / "fonts" / "Cinzel[wght].ttf"         # optional display serif

THEMES = {
    # name: (primary, secondary, hairline)
    "gold": ("#EADFC8", "#A08C68", "#C9A86A"),
    "silver": ("#EDEFF1", "#9AA2A8", "#BFC6CB"),
    "noir": ("#F2F2F2", "#8C8C8C", "#6E6E6E"),
    "ivory": ("#F7F3EA", "#B4A88F", "#CDBF9F"),
    "ink": ("#141414", "#6B6B6B", "#141414"),      # dark type for light/cream backdrops
    "rose": ("#F7DFD8", "#D9AFA6", "#DCA79D"),    # blush-textured type for plum/dark backdrops
    "rose-ink": ("#6E403A", "#8A5B54", "#B08079"), # deep rose type for blush/pink backdrops
}


def run(args: list[str]) -> None:
    if shutil.which("convert") is None:
        sys.exit("ImageMagick `convert` not found on PATH")
    proc = subprocess.run(args, capture_output=True, text=True)
    if proc.returncode != 0:
        sys.exit(f"convert failed: {' '.join(args)}\n{proc.stderr.strip()}")


def sim(cmd: str) -> str:
    return " ".join(cmd) if isinstance(cmd, list) else cmd


# --------------------------------------------------------------------------------------
# 1. Vector butterfly-clasp icon (drawn with paths at 4x, then downsampled = no jaggies)
# --------------------------------------------------------------------------------------
def make_icon(out: str, size: int, color: str, stroke: int | None = None) -> str:
    k = 4                    # supersample factor
    s = size * k
    sw = stroke * k if stroke else max(2, round(s * 0.030))
    u = s / 100.0            # 100x100 design grid

    def p(x: float, y: float) -> str:
        return f"{x * u:.2f},{y * u:.2f}"

    body_w = 1.55 * u
    parts = [
        # left wing
        f"path 'M {p(50,33)} C {p(41,17)} {p(22,19)} {p(20,31)} C {p(18,44)} {p(34,51)} {p(50,55)}'",
        # right wing
        f"path 'M {p(50,33)} C {p(59,17)} {p(78,19)} {p(80,31)} C {p(82,44)} {p(66,51)} {p(50,55)}'",
        # antennae
        f"path 'M {p(50,28)} C {p(46,19)} {p(41,14)} {p(36,10)}'",
        f"path 'M {p(50,28)} C {p(54,19)} {p(59,14)} {p(64,10)}'",
        # body
        f"ellipse {p(50,40).split(',')[0]},{p(50,40).split(',')[1]} {body_w:.2f},{11 * u:.2f} 0,360",
    ]
    cmd = [
        "convert", "-size", f"{s}x{s}", "xc:none",
        "-stroke", color, "-strokewidth", f"{sw:.2f}", "-fill", "none",
        "-draw", " ".join(parts[:4]),
        "-stroke", "none", "-fill", color,
        "-draw", parts[4],
        "-resize", f"{size}x{size}",
        out,
    ]
    run(cmd)
    return out


def make_hairline(out: str, width: int, color: str, height: int = 2) -> str:
    run(["convert", "-size", f"{width}x{height * 4}", f"xc:{color}",
         "-resize", f"{width}x{height}!", out])
    return out


def render_text(out: str, text: str, font: str, size: int, color: str,
                tracking: int = 0, height: int | None = None) -> str:
    h = height or int(size * 2.2)
    cmd = ["convert", "-background", "none", "-fill", color, "-font", font,
           "-pointsize", str(size)]
    if tracking:
        cmd += ["-kerning", str(tracking)]
    cmd += ["-gravity", "center", "label:" + text, "-trim", "+repage", out]
    run(cmd)
    return out


# --------------------------------------------------------------------------------------
# 2. Badge assembly
# --------------------------------------------------------------------------------------
def build_badge(out: str, text: str = "BUTTERFLY LOCK",
                sub: str = "DEPLOYANT CLASP  ·  STAINLESS STEEL",
                theme: str = "gold", width: int = 1400, icon: str | None = None) -> str:
    """Transparent badge: hairline rule, butterfly clasp icon, letterspaced label + sub-label.

    Everything is drawn at 2x and downsampled, so edges stay razor sharp when the PNG is
    later scaled into the hero shot — no blur, no AI-mangled lettering.
    """
    primary, secondary, hair = THEMES.get(theme, THEMES["gold"])
    k = 2
    w = width * k
    tmp = tempfile.mkdtemp(prefix="badge-")

    icon_px = int(w * (0.105 if icon else 0.062))
    if icon:
        icon_png = os.path.join(tmp, "icon.png")
        run(["convert", icon, "-background", "none", "-resize", f"{icon_px}x{icon_px}", icon_png])
    else:
        icon_png = make_icon(os.path.join(tmp, "icon.png"), icon_px, hair)

    main_size = int(w * 0.052)
    sub_size = int(w * 0.0195)
    main_png = render_text(os.path.join(tmp, "main.png"), text, str(FONT_SERIF),
                           main_size, primary, tracking=int(main_size * 0.26))
    sub_png = render_text(os.path.join(tmp, "sub.png"), sub, str(FONT_SANS),
                          sub_size, secondary, tracking=int(sub_size * 0.34))

    # main row: [icon]  gap  [BUTTERFLY LOCK]
    row = os.path.join(tmp, "row.png")
    gap = int(w * 0.022)
    run(["convert", "-background", "none", "-gravity", "center",
         icon_png, "(", "-size", f"{gap}x1", "xc:none", ")", main_png,
         "+append", row])
    rule = make_hairline(os.path.join(tmp, "rule.png"), int(w * 0.16), hair)

    # explicit canvas + centred composites (append-padding can turn opaque)
    def dims(path):
        out = subprocess.run(["convert", path, "-format", "%w %h", "info:"],
                             capture_output=True, text=True).stdout.split()
        return int(out[0]), int(out[1])

    rw, rh = dims(rule)
    ow, oh = dims(row)
    sw, sh = dims(sub_png)
    vgap1, vgap2 = int(w * 0.030), int(w * 0.020)
    W = max(rw, ow, sw)
    H = rh + vgap1 + oh + vgap2 + sh
    body = os.path.join(tmp, "body.png")
    run(["convert", "-size", f"{W}x{H}", "xc:none",
         "(", rule, ")", "-geometry", f"+{(W - rw) // 2}+0", "-compose", "over", "-composite",
         "(", row, ")", "-geometry", f"+{(W - ow) // 2}+{rh + vgap1}", "-compose", "over", "-composite",
         "(", sub_png, ")", "-geometry", f"+{(W - sw) // 2}+{rh + vgap1 + oh + vgap2}",
         "-compose", "over", "-composite", body])

    Path(out).parent.mkdir(parents=True, exist_ok=True)
    run(["convert", body, "-trim", "+repage", "-bordercolor", "none", "-border", "8",
         "-resize", f"{width}x", "-strip", out])
    return out



def build_badge_card(out: str, text: str = "BUTTERFLY LOCK",
                     sub: str = "ORIGINAL  ·  STAINLESS STEEL",
                     theme: str = "gold", width: int = 1400,
                     icon: str | None = None) -> str:
    """Spec-card lockup: real clasp photo | hairline divider | two lines of code-set type.

    Use this when the customer sends an actual photo of their clasp — the photo stays big
    enough to be recognisable instead of shrinking into a smudge.
    """
    primary, secondary, hair = THEMES.get(theme, THEMES["gold"])
    k = 2
    w = width * k
    tmp = tempfile.mkdtemp(prefix="card-")

    main_size, sub_size = int(w * 0.062), int(w * 0.0215)
    main_png = render_text(os.path.join(tmp, "m.png"), text, str(FONT_SERIF),
                           main_size, primary, tracking=int(main_size * 0.22))
    sub_png = render_text(os.path.join(tmp, "s.png"), sub, str(FONT_SANS),
                          sub_size, secondary, tracking=int(sub_size * 0.32))

    photo_h = int(main_size * 2.9)
    photo = os.path.join(tmp, "photo.png")
    if icon:
        run(["convert", icon, "-background", "none", "-resize", f"x{photo_h}", photo])
    else:
        make_icon(photo, int(photo_h * 0.9), hair)

    # text block, left aligned
    gap = int(main_size * 0.28)
    textblock = os.path.join(tmp, "tb.png")
    run(["convert", "-background", "none", main_png,
         "(", "-size", f"1x{gap}", "xc:none", ")", sub_png,
         "-gravity", "west", "-append", textblock])

    def dims(path):
        d = subprocess.run(["convert", path, "-format", "%w %h", "info:"],
                           capture_output=True, text=True).stdout.split()
        return int(d[0]), int(d[1])

    pw, ph = dims(photo)
    tw, th = dims(textblock)
    rule_w = max(2, int(w * 0.0018))
    gapA, gapB = int(main_size * 0.42), int(main_size * 0.46)
    W = pw + gapA + rule_w + gapB + tw
    H = max(ph, th)

    rule = os.path.join(tmp, "rule.png")
    run(["convert", "-size", f"{rule_w}x{ph}", f"xc:{hair}", "-alpha", "set",
         "-channel", "A", "-evaluate", "multiply", "0.85", "+channel", rule])

    body = os.path.join(tmp, "body.png")
    run(["convert", "-size", f"{W}x{H}", "xc:none",
         "(", photo, ")", "-geometry", f"+0+{(H - ph) // 2}", "-compose", "over", "-composite",
         "(", rule, ")", "-geometry", f"+{pw + gapA}+{(H - ph) // 2}", "-compose", "over", "-composite",
         "(", textblock, ")", "-geometry", f"+{pw + gapA + rule_w + gapB}+{(H - th) // 2}",
         "-compose", "over", "-composite", body])

    Path(out).parent.mkdir(parents=True, exist_ok=True)
    run(["convert", body, "-trim", "+repage", "-bordercolor", "none", "-border", "8",
         "-resize", f"{width}x", "-strip", out])
    return out


# --------------------------------------------------------------------------------------
# 3. Overlay onto one image only
# --------------------------------------------------------------------------------------
def overlay_image(src: str, out: str, badge: str, width_ratio: float = 0.46,
                  bottom_margin: float = 0.055, scrim: float = 0.0,
                  shadow: bool = True) -> str:
    tmp = tempfile.mkdtemp(prefix="overlay-")
    meta = json.loads(subprocess.run(
        ["convert", src, "-format", '{"w":%w,"h":%h}', "info:"],
        capture_output=True, text=True).stdout)
    W, H = meta["w"], meta["h"]

    bw = int(W * width_ratio)
    badge_r = os.path.join(tmp, "badge.png")
    run(["convert", badge, "-resize", f"{bw}x", badge_r])
    lockup = badge_r

    if shadow:
        with_shadow = os.path.join(tmp, "lockup-shadow.png")
        run(["convert", lockup, "(", "+clone", "-background", "black",
             "-shadow", "0x16+0+9", ")", "+swap", "-background", "none",
             "-layers", "merge", "+repage", with_shadow])
        lockup = with_shadow

    core = os.path.join(tmp, "core.png")
    if scrim > 0:                                  # legibility guard on light photos
        band = int(H * 0.28)
        mask = os.path.join(tmp, "mask.png")
        run(["convert", "-size", f"{W}x{band}", "gradient:black-white",
             "-evaluate", "multiply", f"{scrim:.3f}", mask])
        scrim_png = os.path.join(tmp, "scrim.png")
        run(["convert", "-size", f"{W}x{band}", "xc:#0A0A0A", mask, "-alpha", "off",
             "-compose", "CopyOpacity", "-composite", scrim_png])
        run(["convert", src, "(", scrim_png, ")", "-gravity", "south",
             "-compose", "over", "-composite", core])
    else:
        run(["convert", src, core])

    Path(out).parent.mkdir(parents=True, exist_ok=True)
    run(["convert", core, "(", lockup, ")", "-gravity", "south",
         "-geometry", f"+0+{int(H * bottom_margin)}", "-compose", "over",
         "-composite", "-strip", out])
    return out



def make_room(src: str, out: str, shift: float = 0.09, feather: int = 40) -> str:
    """Slide the subject up without changing the frame: crop `shift` off the top and splice the
    same height back at the bottom using the photo's own edge colour, then feather the seam.

    Gives the badge clean negative space on an otherwise full-frame hero shot.
    """
    W, H = (int(x) for x in subprocess.run(
        ["convert", src, "-format", "%w %h", "info:"], capture_output=True, text=True
        ).stdout.split())
    top = max(1, int(H * shift))
    tmp = tempfile.mkdtemp(prefix="room-")
    cropped = os.path.join(tmp, "crop.png")
    run(["convert", src, "-crop", f"{W}x{H - top}+0+{top}", "+repage", cropped])

    edge = subprocess.run(["convert", cropped, "-gravity", "south", "-crop", f"{W}x2+0+0",
                           "+repage", "-resize", "1x1!", "-format", "%[pixel:p{0,0}]", "info:"],
                          capture_output=True, text=True).stdout.strip()

    spliced = os.path.join(tmp, "spliced.png")
    run(["convert", cropped, "-background", edge, "-gravity", "south",
         "-splice", f"0x{top}", spliced])

    # feather a narrow band around the seam so no straight line shows
    band_h = min(feather * 2, top)
    band = os.path.join(tmp, "band.png")
    run(["convert", spliced, "-crop", f"{W}x{band_h}+0+{H - top - band_h // 2}", "+repage",
         "-blur", "0x6", band])
    masked = os.path.join(tmp, "band-masked.png")
    run(["convert", band, "-alpha", "set",
         "-channel", "A", "-evaluate", "multiply", "0.55", "+channel", masked])
    Path(out).parent.mkdir(parents=True, exist_ok=True)
    run(["convert", spliced, "(", masked, ")", "-geometry",
         f"+0+{H - top - band_h // 2}", "-compose", "over", "-composite", "-strip", out])
    return out



GRADES = {
    # name: (temp_r, temp_b, saturation, sigmoidal contrast, black lift %)
    "none":      (1.000, 1.000, 100, 0.0, 0.0),
    "miqa-warm": (1.035, 0.965,  96, 2.5, 2.5),   # warm gold-friendly, soft matte shadows
    "miqa-cream":(1.020, 0.990,  92, 1.5, 4.0),   # airy filmic, lifted blacks
    "miqa-noir": (1.000, 1.020,  88, 4.0, 1.5),   # deep, cool, editorial
    "miqa-sand": (1.045, 0.955,  90, 1.0, 5.0),   # desert/sand tone
}


def grade_image(src: str, out: str, preset: str = "miqa-warm") -> str:
    """Warm editorial colour grade so new shots sit next to the MIQA catalogue.

    Kept deliberately gentle: temperature, a soft S-curve, a touch of black lift and a
    small saturation pull — nothing that changes the watch's real metal colour.
    """
    r, b, sat, sig, lift = GRADES.get(preset, GRADES["miqa-warm"])
    cmd = ["convert", src, "-colorspace", "sRGB"]
    if sat != 100:
        cmd += ["-modulate", f"100,{sat},100"]
    cmd += ["-channel", "R", "-evaluate", "multiply", f"{r:.4f}", "+channel",
            "-channel", "B", "-evaluate", "multiply", f"{b:.4f}", "+channel"]
    if sig:
        cmd += ["-sigmoidal-contrast", f"{sig},50%"]
    if lift:
        cmd += ["-level", f"{lift}%,100%"]
    Path(out).parent.mkdir(parents=True, exist_ok=True)
    cmd += ["-strip", out]
    run(cmd)
    return out


# --------------------------------------------------------------------------------------
# 4. Web optimisation
# --------------------------------------------------------------------------------------
def optimize(src: str, out_base: str, max_side: int = 1600, quality: int = 82,
             make_webp: bool = True, webp_quality: int = 80) -> dict:
    """JPEG (progressive, 4:4:4, metadata stripped) + optional WebP sibling.

    `out_base` has no extension; both files are written next to it.
    """
    Path(out_base).parent.mkdir(parents=True, exist_ok=True)
    jpg = f"{out_base}.jpg"
    run(["convert", src, "-auto-orient", "-resize", f"{max_side}x{max_side}>",
         "-colorspace", "sRGB", "-strip", "-interlace", "Plane",
         "-sampling-factor", "4:4:4", "-define", "jpeg:dct-method=float",
         "-quality", str(quality), jpg])
    result = {"jpg": jpg, "jpg_kb": round(os.path.getsize(jpg) / 1024, 1)}
    if make_webp:
        webp = f"{out_base}.webp"
        run(["convert", src, "-auto-orient", "-resize", f"{max_side}x{max_side}>",
             "-colorspace", "sRGB", "-strip", "-quality", str(webp_quality), webp])
        result.update(webp=webp, webp_kb=round(os.path.getsize(webp) / 1024, 1))
    return result


# --------------------------------------------------------------------------------------
# CLI
# --------------------------------------------------------------------------------------
def main() -> None:
    ap = argparse.ArgumentParser(description="Watch shoot: code-drawn badges + web export")
    sub = ap.add_subparsers(dest="cmd", required=True)

    b = sub.add_parser("badge")
    b.add_argument("--out", required=True)
    b.add_argument("--text", default="BUTTERFLY LOCK")
    b.add_argument("--sub", default="DEPLOYANT CLASP  ·  STAINLESS STEEL")
    b.add_argument("--theme", default="gold", choices=sorted(THEMES))
    b.add_argument("--width", type=int, default=1400)
    b.add_argument("--icon", help="use your own lock/butterfly image instead of the vector")
    b.add_argument("--layout", default="horizontal", choices=["horizontal", "card"])

    o = sub.add_parser("overlay")
    o.add_argument("--in", dest="src", required=True)
    o.add_argument("--out", required=True)
    o.add_argument("--badge", required=True)
    o.add_argument("--width-ratio", type=float, default=0.44)
    o.add_argument("--bottom-margin", type=float, default=0.055)
    o.add_argument("--scrim", type=float, default=0.0,
                   help="0 = off, 0.2 = subtle dark band, 0.4 = strong (use on light photos)")
    o.add_argument("--no-shadow", action="store_true")


    gcmd = sub.add_parser("grade")
    gcmd.add_argument("--in", dest="src", required=True)
    gcmd.add_argument("--out", required=True)
    gcmd.add_argument("--preset", default="miqa-warm", choices=sorted(GRADES))

    r = sub.add_parser("room")
    r.add_argument("--in", dest="src", required=True)
    r.add_argument("--out", required=True)
    r.add_argument("--shift", type=float, default=0.09,
                   help="fraction of the frame to move the subject up")
    r.add_argument("--feather", type=int, default=40)

    p = sub.add_parser("optimize")
    p.add_argument("--in", dest="src", required=True)
    p.add_argument("--out", required=True, help="path without extension")
    p.add_argument("--max", type=int, default=1600)
    p.add_argument("--quality", type=int, default=82)
    p.add_argument("--webp-quality", type=int, default=80)
    p.add_argument("--no-webp", action="store_true")

    a = ap.parse_args()
    if a.cmd == "badge":
        fn = build_badge_card if a.layout == "card" else build_badge
        print(fn(a.out, a.text, a.sub, a.theme, a.width, a.icon))
    elif a.cmd == "overlay":
        print(overlay_image(a.src, a.out, a.badge, a.width_ratio, a.bottom_margin,
                            a.scrim, not a.no_shadow))
    elif a.cmd == "grade":
        print(grade_image(a.src, a.out, a.preset))
    elif a.cmd == "room":
        print(make_room(a.src, a.out, a.shift, a.feather))
    elif a.cmd == "optimize":
        print(json.dumps(optimize(a.src, a.out, a.max, a.quality, not a.no_webp,
                                  a.webp_quality), indent=2))


if __name__ == "__main__":
    main()
