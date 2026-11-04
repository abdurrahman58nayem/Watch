"""
render.py — ভিডিওটি ফ্রেম-বাই-ফ্রেম রেন্ডার করে MP4 বানায়।

ব্যবহার:
  python tools/render/render.py preview   # কয়েকটি নমুনা ফ্রেম PNG হিসেবে (দ্রুত চেক)
  python tools/render/render.py mp4       # সম্পূর্ণ MP4 (libx264 + AAC)

টাইমলাইন ব্রাউজার ভার্সনের নিয়ম মেনেই বসে: ফিক্সড সিন ছাড়া প্রতিটি সিনের দৈর্ঘ্য
তার ভয়েসওভার ক্লিপের আসল দৈর্ঘ্য + ০.৬ সেকেন্ড।
"""
from __future__ import annotations

import os
import random
import subprocess
import sys

import numpy as np
import skia
from mutagen.mp3 import MP3

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from skia_canvas import Canvas2D, load_fonts          # noqa: E402
import engine as E                                     # noqa: E402
from scenes import SEGMENTS                            # noqa: E402

AUDIO_DIR = os.path.join(ROOT, "public/video/audio")
FONT_DIR = os.path.join(ROOT, "tools/fonts")
OUT_DIR = os.path.join(ROOT, "public/downloads")
FPS = 30
CLIP_GAP = 0.6  # ভয়েসওভার শেষ হওয়ার পর সিনের শেষে ফাঁকা


def ffmpeg_exe() -> str:
    import imageio_ffmpeg

    return imageio_ffmpeg.get_ffmpeg_exe()


def build_timeline() -> tuple[list[dict], float]:
    cursor = 0.0
    segs = []
    for seg in SEGMENTS:
        vos = []
        voice = 0.0
        for f in seg["vo"]:
            d = MP3(os.path.join(AUDIO_DIR, f)).info.length
            vos.append(dict(file=f, at=voice, dur=d))
            voice += d
        dur = seg["fixed"] if seg.get("fixed") else max(4.0, voice + CLIP_GAP)
        segs.append(dict(id=seg["id"], start=cursor, dur=dur, draw=seg["draw"], vos=vos))
        cursor += dur
    return segs, cursor


def make_surface():
    surface = skia.Surface(E.W, E.H)
    canvas = surface.getCanvas()
    ctx = Canvas2D(canvas)
    return surface, canvas, ctx


def render_frame(ctx, segs, t: float, particles, grain_rng: random.Random) -> None:
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.clearRect(0, 0, E.W, E.H)
    E.drawBackground(ctx, t)
    E.drawLightStreaks(ctx, t)
    E.drawParticles(ctx, particles, 1.0 / FPS, t)

    seg = None
    for s in segs:
        if s["start"] <= t < s["start"] + s["dur"]:
            seg = s
            break
    if seg is None:
        seg = segs[-1]
    local = t - seg["start"]
    p = max(0.0, min(1.0, local / seg["dur"]))
    ctx.save()
    seg["draw"](ctx, p, t, local)
    ctx.restore()

    E.drawVignette(ctx)
    E.drawGrain(ctx, grain_rng)


def preview(n: int = 10) -> None:
    load_fonts(FONT_DIR)
    segs, total = build_timeline()
    print(f"total duration: {total:.2f}s")
    for s in segs:
        print(f"  {s['id']:<10} {s['start']:>7.2f} → {s['start'] + s['dur']:>7.2f}  ({s['dur']:.2f}s)")

    out = os.path.join(ROOT, "tools/render/out")
    os.makedirs(out, exist_ok=True)
    surface, canvas, ctx = make_surface()
    rng = random.Random(20261104)
    particles = E.makeParticles(120, rng)
    grain_rng = random.Random(99)

    times = [total * i / (n - 1) for i in range(n)]
    dt = 1.0 / FPS
    cur = 0
    for i, t in enumerate(times):
        # কণাগুলো ব্রাউজারের মতোই ক্রমিক ফ্রেমে এগিয়ে নিই (তাই একই অবস্থান)
        target = int(round(t / dt))
        while cur < target:
            E.drawParticles(None, particles, dt, cur * dt, update_only=True)
            cur += 1
        render_frame(ctx, segs, t, particles, grain_rng)
        img = surface.makeImageSnapshot()
        path = os.path.join(out, f"frame-{i:02d}-t{t:06.2f}.png")
        img.save(path, skia.EncodedImageFormat.kPNG)
        print("saved", os.path.basename(path))


def mp4(start: int = 0, count: int | None = None, out_name: str | None = None,
        silent: str | None = None) -> None:
    load_fonts(FONT_DIR)
    segs, total = build_timeline()
    total_frames = int(round(total * FPS))
    first = int(start)
    last = total_frames if count is None else min(total_frames, first + int(count))
    nframes = last - first
    print(f"rendering frames {first}..{last} ({nframes}) @ {FPS}fps / total {total:.2f}s …")

    os.makedirs(OUT_DIR, exist_ok=True)
    if silent is None:
        silent = os.path.join(ROOT, "tools/render/out/silent.mp4")
    os.makedirs(os.path.dirname(silent), exist_ok=True)

    ff = ffmpeg_exe()
    enc = subprocess.Popen(
        [
            ff, "-y", "-f", "rawvideo", "-pix_fmt", "rgba",
            "-s", f"{E.W}x{E.H}", "-r", str(FPS), "-i", "-",
            "-c:v", "libx264", "-preset", "medium", "-crf", "18",
            "-pix_fmt", "yuv420p", "-movflags", "+faststart",
            silent,
        ],
        stdin=subprocess.PIPE,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.PIPE,
    )

    surface, canvas, ctx = make_surface()
    rng = random.Random(20261104)
    particles = E.makeParticles(120, rng)
    grain_rng = random.Random(99)
    buf = np.empty((E.H, E.W, 4), dtype=np.uint8)
    # N32 বাফার মেমোরিতে BGRA — তাই ffmpeg-এর 'rgba' এর সাথে মেলাতে স্পষ্টভাবে RGBA চাই
    info = skia.ImageInfo.Make(E.W, E.H, skia.ColorType.kRGBA_8888_ColorType,
                               skia.AlphaType.kPremul_AlphaType)

    try:
        for n, i in enumerate(range(first, last)):
            t = i / FPS
            render_frame(ctx, segs, t, particles, grain_rng)
            surface.readPixels(info, buf, E.W * 4, 0, 0)
            enc.stdin.write(buf.tobytes())
            if n % 300 == 0:
                print(f"  frame {i}/{last}  ({t:.1f}s)", flush=True)
    finally:
        enc.stdin.close()
        err = enc.stderr.read().decode(errors="ignore")
        if enc.wait() != 0:
            print(err[-2500:])
            raise SystemExit("ffmpeg video encode failed")

    # অডিও: প্রতিটি ক্লিপ তার নির্ধারিত সময়ে বসিয়ে একটি ট্র্যাকে মেশানো
    filters, inputs = [], []
    for s in segs:
        for v in s["vos"]:
            inputs += ["-i", os.path.join(AUDIO_DIR, v["file"])]
            idx = len(inputs) // 2 - 1
            delay = int(round((s["start"] + v["at"]) * 1000))
            # ক্লিপগুলো মনো — তাই adelay-এ একটিমাত্র মান
            filters.append(f"[{idx}:a]adelay={delay}[a{idx}]")
    if not filters:
        raise SystemExit("কোনো অডিও ক্লিপ পাওয়া যায়নি")
    mix = "".join(f"[a{i}]" for i in range(len(filters)))
    name = out_name or "nirobota-abdur-rahman.mp4"
    out = name if os.path.isabs(name) else (
        os.path.join(ROOT, name) if os.sep in name else os.path.join(OUT_DIR, name)
    )
    cmd = [ff, "-y"] + inputs + ["-i", silent]
    cmd += [
        # apad যোগ করা হয় যাতে অডিও শেষ হওয়ার পরেও ভিডিওর শেষ (ক্রেডিট) কেটে না যায়
        "-filter_complex",
        ";".join(filters)
        + f";{mix}amix=inputs={len(filters)}:duration=longest:normalize=0,apad[aout]",
        "-map", f"{len(inputs) // 2}:v", "-map", "[aout]",
        "-c:v", "copy", "-c:a", "aac", "-b:a", "128k", "-ar", "44100", "-ac", "2",
        "-shortest", "-movflags", "+faststart", out,
    ]
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0:
        print(r.stderr[-2500:])
        raise SystemExit("ffmpeg mux failed")
    print("done:", out, os.path.getsize(out) // 1024, "KB")


if __name__ == "__main__":
    mode = sys.argv[1] if len(sys.argv) > 1 else "preview"
    if mode == "mp4":
        if len(sys.argv) > 3:
            mp4(int(sys.argv[2]), int(sys.argv[3]),
                sys.argv[4] if len(sys.argv) > 4 else None,
                sys.argv[5] if len(sys.argv) > 5 else None)
        else:
            mp4()
    else:
        preview(int(sys.argv[2]) if len(sys.argv) > 2 else 10)
