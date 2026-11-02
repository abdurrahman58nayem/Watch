# Watch Shot Playbook — নিয়ম, স্টাইল ও প্রোডাকশন গাইড

> এই ফাইলটাই আমাদের "মাথায় রাখা" নিয়মগুলোর লিখিত ভার্সন। প্রতিটা নতুন ঘড়ির ছবি বানানোর আগে এই ফাইল ফলো হবে।
> Owner brief: ভাইয়া (watch business, Bangladesh) · Repo: `abdurrahman58nayem/Watch` · Branch: `arena/48ce3008-watch`

---

## 1. কাজের ধরন (এক লাইনে)

ভাইয়া একটা ঘড়ির ছবি দেবেন → ছবিটা ভালো করে দেখে (ডায়াল, ইনডেক্স, হাত, কেস, বেজেল, ব্রেসলেট, ক্ল্যাস্প, রঙ, ফিনিশ) → **তিনটা আলাদা স্টাইলের প্রোডাক্ট ইমেজ** বানানো হবে → মেইন ছবিতে শুধু **কোড দিয়ে** "BUTTERFLY LOCK" লেখা + লক আইকন বসবে → তারপর নাম, বিবরণ, বিস্তারিত বিবরণ লেখা হবে → সব কিছু **git-এ কমিট হবে, পুশ হবে না**।

---

## 2. তিনটা শট — কী কী হবে

| # | Shot | কাজ | ফ্রেমিং |
|---|------|-----|---------|
| 1 | **Main / Hero (মেইন প্রোডাক্ট শট)** | পুরো ঘড়িটা বোঝা যাবে — কেস + ব্রেসলেট দুটোই সম্পূর্ণ ফ্রেমে, সামান্য ৩/৪ অ্যাঙ্গেল বা ফ্ল্যাট লে | পোর্ট্রেট 4:5 (1600×2000) — ওয়েবসাইটের মেইন ইমেজ |
| 2 | **Wrist shot (হাতে পরা)** | হাতে পরা অবস্থায়, প্রিমিয়াম লাইফস্টাইল ফিল; হাত/ত্বক/লাইট রিয়েল | পোর্ট্রেট 4:5 |
| 3 | **Detail / Macro** | ডায়ালের টেক্সচার, ইনডেক্স, হাত, ক্রাউন, ব্রেসলেটের লিংক, ক্ল্যাস্পের ফিনিশ — ম্যাক্রো ডিটেইল | স্কয়ার 1:1 |

**শর্ত:** ২ ও ৩ নম্বরে **কোনো লেখা বা লক আইকন থাকবে না**। শুধু মেইন ছবিতে স্পেক ব্যাজ।

---

## 3. "AI মনে হবে না" — বাধ্যতামূলক রিয়েলিজম রুলস

রিসার্চ থেকে পাওয়া যে যে জিনিস AI ছবিকে ফেক বানায়, সেগুলো এক্সপ্লিসিটলি বন্ধ করতে হবে:

1. **কনট্যাক্ট শ্যাডো** — ঘড়িটা সারফেসে বসে আছে বোঝা যাবে; নিচে গ্যাপ/হ্যালো থাকবে না।
2. **লাইটের দিক একটাই** — এক সোর্স, ৪৫° কী লাইট; সব রিফ্লেকশন ও শ্যাডো একই দিক মানবে।
3. **ম্যাটেরিয়াল মাইক্রো-টেক্সচার** — ব্রাশড স্টিলে সূক্ষ্ম ব্রাশ লাইন, পলিশে ক্রিস্প স্পেকুলার, লেদারে গ্রেইন/ক্রিজ, ডায়ালে সূক্ষ্ম গ্রেইন বা সানরেই বুরুশ।
4. **কাচের রিফ্লেকশন** — স্যাফায়ার ক্রিস্টালে হালকা, কন্ট্রোলড হাইলাইট; পুরো সাদা ব্লো-আউট নয়।
5. **নিখুঁত সিমেট্রি নয়** — হালকা অফ-সেন্টার ফ্রেমিং, স্বাভাবিক অসমতা।
6. **লেন্স ফিজিক্স** — ন্যাচারাল ডেপথ অফ ফিল্ড গ্রেডিয়েন্ট, হালকা ভিনিয়েট (৫–১০%), খুব সূক্ষ্ম ফিল্ম গ্রেইন, মাইক্রো ক্রোম্যাটিক অ্যাবারেশন।
7. **টেক্সট/লোগো** — ছবিতে **কোনো লেখা, লোগো, ওয়াটারমার্ক, ব্র্যান্ড নেম থাকবে না**। (ডায়ালে ব্র্যান্ড নেম থাকলে সেটা ঘড়ির নিজের, সেটা ঠিক থাকবে — বানানো নতুন লেখা নয়।)
8. **হাত** — হাতে পরা শটে আঙুল, নখ, ত্বকের টেক্সচার রিয়েল; মাখনের মতো স্মুথ ত্বক নয়, ৫ আঙুলের অ্যানাটমি ঠিক।
9. **স্কেল ও পারস্পেকটিভ** — কেসের বেধ, লাগ, ব্রেসলেটের প্রস্থ বাস্তবের মতো; ঘড়ি "ভাসবে" না।
10. **নিষিদ্ধ শব্দ** — prompt-এ "8k, masterpiece, ultra perfect, CGI, render, 3D" এগুলো দেব না; এর বদলে ক্যামেরা + লাইট + ম্যাটেরিয়াল লিখব।

---

## 4. "কমদামী মনে হবে না" — প্রিমিয়াম রুলস

- **ন্যূনতম প্রপস**: হয় একদম ক্লিন, নাহয় একটাই টেক্সচার্ড সারফেস (ম্যাট স্টোন / ফাইন লিনেন / ডার্ক ভেলভেট)। বেশি জিনিস = কম দামি লাগে।
- **নেগেটিভ স্পেস** — ছবিতে শ্বাস নেওয়ার জায়গা; ঘড়ি ফ্রেমের ৫৫–৭০%।
- **ব্যাকগ্রাউন্ড** — সলিড কালার + সফট শ্যাডো (ডিফল্ট)। থিমের সাথে ম্যাচ করা যায়: ওয়ার্ম আইভরি, স্যান্ড, স্টোন গ্রে, ডিপ চারকোল, অফ-ব্ল্যাক, ডিপ গ্রিন/নেভি। **গ্যাঁজানো গ্রেডিয়েন্ট, নিয়ন, গ্লাসমরফিজম, ফ্যান্টাসি ব্যাকগ্রাউন্ড নিষিদ্ধ।**
- **প্যালেট** — বেস নিউট্রাল + একটাই অ্যাকসেন্ট (গোল্ড #B08D57 / #C9A86A)। একই ঘড়ির তিনটা ছবিতে একই ব্যাকগ্রাউন্ড ফ্যামিলি থাকবে, যাতে ওয়েবসাইটে সেট হিসেবে দেখতে ভালো লাগে।
- **শ্যাডো** — শুধু কনট্যাক্ট + সফট ডিফিউজড ফলঅফ শ্যাডো; ড্রপ-শ্যাডো-অন-ট্রান্সপারেন্ট নয়।
- **শার্পনেস** — ঘড়ি ট্যাক-শার্প, ব্যাকগ্রাউন্ড হালকা সফট; পুরো ছবি সমান শার্প হলে সস্তা লাগে।
- **ক্রপ** — স্ট্র্যাপ কাটা গেলেও চলবে, কিন্তু ডায়াল কখনো কাটা যাবে না (মেইন শটে)।

---

## 5. Butterfly Lock ব্যাজ — নিয়ম (গুরুত্বপূর্ণ)

> ছবি জেনারেট করার সময় **কখনোই** ছবিতে টেক্সট/লক আঁকতে বলা হবে না। লেখা ও আইকন **শুধু কোড দিয়ে** বসবে — `tools/watchshot/brandshot.py`।

- শুধু **মেইন ছবিতে**, নিচে সেন্টারে: 🦋 আইকন + `BUTTERFLY LOCK` (letterspaced, uppercase) + হেয়ারলাইন।
- অন্য দুই ছবিতে **কিছুই থাকবে না**।
- আইকন вектор-জিওমেট্রি (৪ ডানা + বডি) — তাই যেকোনো সাইজে ক্রিস্প, কখনো ভাঙবে না, ডিস্টর্ট হবে না।
- টেক্সট হাই-রেজে (৪× সুপারস্যাম্পল) রেন্ডার হয়ে ডাউনস্কেল হয় → অ্যান্টি-অ্যালিয়াসড, শার্প।
- ব্যাকগ্রাউন্ডের লুমিন্যান্স দেখে অটো কালার: লাইট ব্যাকগ্রাউন্ডে ডার্ক ইনক + গোল্ড #B08D57; ডার্কে ওয়ার্ম অফ-হোয়াইট #EDE9E1 + গোল্ড #C9A86A।
- ভাইয়ার নিজের বাটারফ্লাই-লক ছবি এলে সেটাও ব্যাজে ব্যবহার করা যাবে (`--icon` অপশনে কাস্টম পাথ যোগ করা হবে) — কোড চেঞ্জ ছোট, লেখা একই থাকবে।
- কমান্ড:
  ```bash
  python3 tools/watchshot/brandshot.py badge \
    --image out/<slug>-main-raw.png --out out/<slug>-main.png \
    --text "BUTTERFLY LOCK" --icon butterfly --pos bottom-center --rule --bg auto
  ```

**কখন লেখা হবে:** ভাইয়া বললে ("এটা বাটারফ্লাই লক") — তখনই মেইন ছবিতে বসবে, নাহয় ছবি ক্লিন থাকবে।
**ভিন্ন স্পেক হলে** একই সিস্টেমে বদলানো যাবে: `--text "SAPPHIRE GLASS"`, `--icon watch` ইত্যাদি।

---

## 6. ওয়েবের জন্য ফাইল রুলস

- সাইজ: মেইন ও রিস্ট 1600×2000, ডিটেইল 1600×1600 (source) → এক্সপোর্ট 1600w + 900w।
- ফরম্যাট: **WebP (কোয়ালিটি ~80–84, method 6)** প্রাইমারি + **JPEG (progressive, 4:2:0, q≈82–86)** ফলব্যাক।
- বাজেট: প্রতি ফাইল **≤ 180 KB** (মেইন), ≤ 150 KB (ডিটেইল)। তারপরও কোয়ালিটি ঠিক রাখতে ২:১ ডাউনস্কেল + unsharp মাইক্রো-শার্পেনিং ব্যবহার করা হবে, আগ্রেসিভ কম্প্রেশন নয়।
- নামকরণ: `public/watches/<slug>/<slug>-main-1600.webp` ইত্যাদি — ছোট হাতের, হাইফেন, স্পেস নেই।
- `next.config.ts`-এ `images.unoptimized = true` আছে, তাই আসল ফাইলের সাইজই গুরুত্বপূর্ণ — এজন্যই বাজেট কড়া।
- কমান্ড:
  ```bash
  python3 tools/watchshot/brandshot.py compress \
    --image out/<slug>-main.png --outdir public/watches/<slug> \
    --name main --widths 1600,900 --budget-kb 180
  ```

---

## 7. কপি রাইটিং রুলস (নাম + বিবরণ)

- **সেলার ভয়েস নয়** — "বিক্রেতা বলছেন", "আমরা দিচ্ছি", "আমাদের দোকানে" — এসব কিছুই না। সরাসরি পণ্যের কথা, কপি-পেস্ট করার মতো রেডি।
- নাম: ১–২ শব্দের ব্র্যান্ডেবল নাম + সিরিজ/রেফারেন্স। ইংরেজি নাম (ওয়েবসাইটের জন্য), পাশে বাংলা উচ্চারণ/অর্থ।
- প্রতিটা ছবি সেটের সাথে যা যা দিতে হবে:
  1. **নাম** (৩–৪টি অপশন)
  2. **শর্ট ডেসক্রিপশন** (১ লাইন, ~20 শব্দ)
  3. **ডেসক্রিপশন** (২–৩ প্যারা, ~120–150 শব্দ)
  4. **ডিটেইলড ডেসক্রিপশন / স্পেসিফিকেশন** (বুলেট: কেস, ডায়াল, মুভমেন্ট, গ্লাস, WR, স্ট্র্যাপ, সাইজ, ক্ল্যাস্প, ওয়ারেন্টি)
  5. **ফিচার বুলেট** (৫–৭টা, ছোট)
- টোন: শান্ত, আত্মবিশ্বাসী, প্রিমিয়াম — হাইপারবোল ("বিশ্বসেরা", "অরিজিনাল সুইস" যেটা সত্য নয়) নিষিদ্ধ।

---

## 8. ইমেজ জেনারেশন প্রম্পট টেমপ্লেট (ইংরেজি)

### main (মেইন / হিরো)
```
Editorial product photograph of [WATCH DESCRIPTION FROM THE USER PHOTO], full watch
visible: case, bezel, dial, bracelet and clasp complete inside frame.
Camera: 85mm macro lens, f/9, tack-sharp on the watch, camera slightly above eye
level at a 20-degree three-quarter angle, subtle natural depth-of-field falloff.
Lighting: single large softbox key from upper-left at 45 degrees, white bounce card
on the right, controlled specular highlights on polished surfaces, crisp brushed
metal micro-texture, faint sapphire crystal reflection, realistic contact shadow
plus soft diffused falloff shadow to the lower right matching the key light.
Background: solid [COLOUR] seamless studio sweep, generous negative space.
Realism: natural film grain, 6% corner vignette, slight lens chromatic aberration at
the frame edge, faint dust-free but non-uniform surface variation, not perfectly
symmetric framing.
Absolutely no text, no logo, no watermark, no props, no hands.
Premium watch advertising quality, natural colour grade, not CGI.
```

### wrist (হাতে পরা)
```
Photorealistic editorial wrist shot of the same [WATCH DESCRIPTION], worn on a
[man's/woman's] wrist, sleeve of a [fine knit / crisp white shirt / dark suit cuff]
partially visible lower-left. Natural window-direction soft light from the left,
gentle falloff, realistic skin texture with natural pores and fine hair, correct
five-finger anatomy, relaxed natural hand pose, watch sits naturally with the case
slightly turned toward camera.
Camera: 50mm, f/2.2, shallow but believable bokeh, focus on the dial.
Background: soft out-of-focus [COLOUR] surface, no clutter.
Natural film grain, no retouching gloss, no text, no logo, no watermark.
```

### detail (ম্যাক্রো)
```
Macro detail photograph of [WATCH DESCRIPTION] — extreme close-up on the dial
texture, applied indices, hand-set and the bracelet links / crown.
Camera: 100mm macro, f/11 focus-stacked sharpness on the detail, 1:1 crop.
Lighting: raking side light from the left to reveal brushing direction and applied
index facets, small dark flag on the right for contrast, tight controlled highlight
on the crystal edge, realistic micro-scratches and material grain visible.
Background: same solid [COLOUR] as the hero shot, falling into shadow.
No text, no logo, no watermark, no skin, no props. Not CGI, natural colour grade.
```

**প্রম্পট লেখার সময়:** `[WATCH DESCRIPTION]`-এ ভাইয়ার দেওয়া ছবি থেকে হুবহু ডিটেইল বসবে (কেস শেপ, ডায়াল কালার, ইনডেক্স টাইপ, ব্রেসলেট টাইপ, ক্ল্যাস্প টাইপ)। ব্যাকগ্রাউন্ড কালার তিনটা ছবিতে একই পরিবারের হবে।

---

## 9. ওয়ার্কফ্লো চেকলিস্ট

1. ভাইয়ার ছবি + ব্রিফ পড়া (ডিটেইল নোট করা) → নিচের "Watch brief" সেকশনে লিখে রাখা
2. মেইন শট জেনারেট (টেক्सট ছাড়া) → রিভিউ: AI-লুক / কমদামি-লুক চেক
3. রিস্ট শট → রিভিউ (হাত, লাইট, স্কেল)
4. ডিটেইল শট → রিভিউ (ম্যাটেরিয়াল, শার্পনেস)
5. মেইনে কোড দিয়ে ব্যাজ বসানো (লাগলে)
6. কমপ্রেস → সাইজ চেক (≤180 KB)
7. নাম + শর্ট/লং/ডিটেইলড ডেসক্রিপশন লেখা
8. `public/watches/<slug>/`-এ ফাইল রাখা, docs আপডেট, **git commit (push নয়)**

---

## 10. Watch brief (ভাইয়ার ইনপুট থেকে ভরা হবে)

- ছবি: ⏳ এখনো পাওয়া যায়নি (এই রিপোতে/watch-photo নেই)
- বাটারফ্লাই লকের ছবি: ⏳ এখনো পাওয়া যায়নি (আমাদের নিজের ভেক্টর আইকন রেডি আছে)
- ঘড়ির নাম (ভাইয়ার পছন্দ): —
- ফিচার/স্পেসিফিকেশন: —
- ব্যাকগ্রাউন্ড পছন্দ: —
- ভিডিও সংক্রান্ত কাজ: ⏳ আগের কথাবার্তার কনটেক্সট এই রিপোতে নেই — ভাইয়া আবার বললে লিখে রাখা হবে

## 11. সংরক্ষিত সিদ্ধান্ত (Decision log)

- 2026-11-02: ৩-শট সেট (main / wrist / detail), মেইন শটেই শুধু স্পেক ব্যাজ।
- 2026-11-02: ব্যাজ সবসময় কোড দিয়ে (`brandshot.py`), কখনো ইমেজ মডেল দিয়ে নয়।
- 2026-11-02: ফন্ট লক — Jost Light (লেটারস্পেসড ক্যাপস) + Cormorant Garamond (সেরিফ অপশন), দুটোই OFL, `assets/fonts/`-এ আছে।
- 2026-11-02: প্যালেট — গোল্ড অ্যাকসেন্ট #B08D57 (লাইট) / #C9A86A (ডার্ক), ইনক #1A1A1A / #EDE9E1।
- 2026-11-02: ডেলিভারি ফরম্যাট — WebP + JPEG ফলব্যাক, ≤180 KB।
- 2026-11-02: কাজ git-এ কমিট হবে, **পুশ করা হবে না**।
