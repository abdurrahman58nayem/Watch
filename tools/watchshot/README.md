# tools/watchshot

টুলিং ফর টাইমোরা ওয়াচ প্রোডাক্ট ইমেজ। নিয়ম-কানুন: [`docs/watch-photo-playbook.md`](../../docs/watch-photo-playbook.md)

টেক্সট বা লক আইকন **কখনো** ইমেজ জেনারেটর দিয়ে আঁকা হবে না — সবসময় এই স্ক্রিপ্ট দিয়ে, যাতে কোনোদিন ভাঙে না, ডিস্টর্ট না হয়।

## সেটআপ

```bash
python3 -m venv /home/user/.imgenv
/home/user/.imgenv/bin/pip install pillow          # fontTools + brotli শুধু ফন্ট কনভার্ট করতে
```

## ১. ব্যাজ বসানো (শুধু মেইন ছবিতে)

```bash
python3 tools/watchshot/brandshot.py badge \
  --image out/timora-atlas-main-raw.png \
  --out   out/timora-atlas-main.png \
  --text "BUTTERFLY LOCK" --icon butterfly --pos bottom-center --rule --bg auto
```

| অপশন | মানে |
|------|------|
| `--text` | যা লেখা হবে (ডিফল্ট `BUTTERFLY LOCK`) |
| `--icon` | `butterfly` \| `watch` \| `none` |
| `--pos` | `bottom-center` \| `bottom-left` \| `bottom-right` \| `top-center` |
| `--accent` / `--ink` | হেক্স কালার (`#B08D57`) — না দিলে অটো |
| `--rule` | লেখার নিচে হেয়ারলাইন |
| `--tracking` | অক্ষরের ফাঁক, em (ডিফল্ট 0.34) |
| `--text-size` | ছবির প্রস্থের কত ভাগ (ডিফল্ট 0.030) |
| `--margin` | সেফ মার্জিন, প্রস্থের ভাগ (ডিফল্ট 0.062) |
| `--bg` | `auto` \| `light` \| `dark` |
| `--icon-file` | আসল লকের কাটআউট PNG (যেমন `public/lock/butterfly-clasp.png`) |
| `--icon-key` | ওই PNG-র কালো ব্যাকগ্রাউন্ড কী-আউট করবে |
| `--layout` | `inline` (আইকন পাশে) \| `stack` (আইকন উপরে — আসল লক ছবির জন্য ডিফল্ট স্টাইল) |
| `--icon-width-ratio` | stack লেআউটে আইকনের প্রস্থ, টেক্সটের ভাগ (ডিফল্ট 0.34) |
| `--icon-ratio` | inline লেআউটে আইকনের উচ্চতা (ডিফল্ট 1.45) |

আসল লকের ছবি দিয়ে:

```bash
python3 tools/watchshot/brandshot.py badge \
  --image out/timora-atlas-main-raw.png --out out/timora-atlas-main.png \
  --text "BUTTERFLY LOCK" --icon-file public/lock/butterfly-clasp.png \
  --layout stack --icon-width-ratio 0.36 --rule --bg auto
```

## ২. কালো ব্যাকগ্রাউন্ড কী-আউট (`keyer.py`)

```bash
python3 tools/watchshot/keyer.py cutout \
  --image assets/lock/butterfly-lock-source.png \
  --outdir public/lock --name butterfly-clasp \
  --crop 270,370,760,660 --width 900 --budget-kb 90 --flat-bg "#F7F5F1"
```

কালো (#000) ব্যাকগ্রাউন্ডে শুট করা সিলভার/ক্রোম একদম পরিষ্কার কী-আউট হয় — alpha = smoothstep(max(R,G,B)), কোনো হ্যালো থাকে না। আউটপুট: ট্রান্সপারেন্ট PNG + WebP (+ চাইলে ফ্ল্যাট ব্যাকগ্রাউন্ডে JPG ফলব্যাক)।

## ৩. ওয়েবের জন্য কমপ্রেস

```bash
python3 tools/watchshot/brandshot.py compress \
  --image out/timora-atlas-main.png \
  --outdir public/watches/timora-atlas \
  --name main --widths 1600,900 --budget-kb 180
```

আউটপুট: `main-1600.webp`, `main-1600.jpg`, `main-900.webp`, `main-900.jpg` — প্রতিটার সাইজ প্রিন্ট হবে, বাজেটের মধ্যে রাখতে কোয়ালিটি অটো নামবে।

## ফন্ট

`assets/fonts/` — Jost Light/Regular, Cormorant Garamond Light/Medium (দুটোই SIL OFL, লাইসেন্স ফাইল পাশে আছে)।
ফন্ট `.woff2` থেকে `.ttf` বানাতে:

```python
from fontTools.ttLib import TTFont
f = TTFont("font.woff2"); f.flavor = None; f.save("font.ttf")
```
