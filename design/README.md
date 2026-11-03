# design/ — ওয়াচ শুট ডেস্ক

এই ফোল্ডারটা ওয়েবসাইটের কোড থেকে আলাদা: এখানে **প্রোডাক্ট ফটো + কপি** বানানোর নিয়ম,
রিসার্চ আর টুলিং থাকে।

| ফাইল | কী আছে |
|---|---|
| `BRIEF.md` | 🔒 ভাইয়ার দেওয়া স্থায়ী নিয়ম (R1–R12) — এটাই অথরিটি |
| `RESEARCH.md` | ওয়াচ ফটোগ্রাফি + ফেসবুক সেলিং রিসার্চ, সোর্সসহ |
| `watch_shoot.py` | ব্যাজ (কোড-টাইপোগ্রাফি) + ওভারলে + ওয়েব অপ্টিমাইজ |
| `fonts/` | Marcellus, Jost, Cinzel — SIL Open Font License |
| `assets/badges/` | বানানো `BUTTERFLY LOCK` ব্যাজ PNG |
| `work/<slug>/` | AI থেকে আসা কাঁচা ফ্রেম (কমিট হয়, সাইটে যায় না) |

## ফ্লো (প্রতি প্রোডাক্টে)

1. ভাইয়ার ছবি নেওয়া → `work/<slug>/input.jpg` (+ ফিচার লিস্ট)
2. ইনপুট ছবি রেফারেন্স হিসেবে দিয়ে ৩টি ফ্রেম জেনারেট: `hero`, `wrist`, `detail`
3. শুধু hero-তে ব্যাজ: `overlay` কমান্ড (`--scrim` হালকা হলে, `--icon` নিজের লক ছবি হলে)
4. `optimize` → `public/watches/<slug>/<slug>-{hero,wrist,detail}.jpg|webp`
5. কপি (নাম/শর্ট/ডিটেইল) → `work/<slug>/copy.md`
6. **লোকাল কমিট — push নয়**

## কমান্ড

```bash
python3 design/watch_shoot.py badge    --out design/assets/badges/butterfly-lock-gold.png
python3 design/watch_shoot.py overlay  --in design/work/<slug>/hero.png \
        --out design/work/<slug>/hero-lock.png \
        --badge design/assets/badges/butterfly-lock-gold.png --width-ratio 0.46 --scrim 0.25
python3 design/watch_shoot.py optimize --in design/work/<slug>/hero-lock.png \
        --out public/watches/<slug>/<slug>-hero --max 1600 --quality 82
```

থিম: `gold` (ডার্ক ব্যাকগ্রাউন্ড), `ink` (হালকা ব্যাকগ্রাউন্ডে ডার্ক লেখা), `silver`, `ivory`, `noir`।

## টেক নোট

- লেখা/আইকন সবসময় ImageMagick + TTF দিয়ে ভেক্টর-লেভেলে আঁকা হয় (2× supersample),
  তাই ১৬০০px-এও এজ ক্রিস্প — AI-এর মতো বানান ভাঙে না।
- আউটপুট: JPG progressive q82, 4:4:4 (টেক্সট এজ পরিষ্কার), metadata stripped; সাথে WebP।
- এক্সপোর্টের পর ফাইল সাইজ আর ভিজুয়াল দুইটাই চেক করা হয় (BRIEF R6)।
