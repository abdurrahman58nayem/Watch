/**
 * build-standalone.mjs
 * ভিডিও ইঞ্জিন + ভয়েসওভার + কন্ট্রোল — সব একটি সেল্ফ-কনটেইনড HTML ফাইলে এমবেড করে।
 * আউটপুট: public/downloads/nirobota-video-abdur-rahman.html
 *
 * চালান: node tools/build-standalone.mjs
 */
import { readFileSync, writeFileSync, mkdirSync, statSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const bin = (p) => readFileSync(join(root, p)).toString("base64");

/** TypeScript সোর্সকে একটি IIFE বান্ডলে রূপান্তর (esbuild) */
function buildEngine() {
  const js = execFileSync(
    "npx",
    [
      "--yes", "esbuild@0.24.0",
      "src/app/video/video-kit.ts",
      "--bundle", "--format=iife", "--global-name=VideoKit",
      "--target=es2020", "--legal-comments=none",
    ],
    { cwd: root, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 }
  );
  return js;
}

const engineJs = buildEngine();
const audioFiles = [
  "vo-01.mp3", "vo-02a.mp3", "vo-02b.mp3", "vo-03.mp3", "vo-04.mp3", "vo-05.mp3", "vo-06.mp3", "vo-07.mp3",
];
const audioB64 = audioFiles.map((f) => `"${f}": "${bin(`public/video/audio/${f}`)}"`).join(",\n");
const audioBytes = audioFiles.reduce((a, f) => a + statSync(join(root, `public/video/audio/${f}`)).size, 0);

const html = `<!DOCTYPE html>
<html lang="bn">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="author" content="আব্দুর রহমান" />
<title>যে নীরবতা আমাদের সন্তানদের ঢেকে রাখে | আব্দুর রহমান</title>
<style>
@font-face{font-family:'Noto Sans Bengali';font-style:normal;font-weight:400;font-display:swap;src:url(https://cdn.jsdelivr.net/npm/@fontsource/noto-sans-bengali@5/files/noto-sans-bengali-bengali-400-normal.woff2) format('woff2')}
@font-face{font-family:'Noto Sans Bengali';font-style:normal;font-weight:500;font-display:swap;src:url(https://cdn.jsdelivr.net/npm/@fontsource/noto-sans-bengali@5/files/noto-sans-bengali-bengali-500-normal.woff2) format('woff2')}
@font-face{font-family:'Noto Sans Bengali';font-style:normal;font-weight:600;font-display:swap;src:url(https://cdn.jsdelivr.net/npm/@fontsource/noto-sans-bengali@5/files/noto-sans-bengali-bengali-600-normal.woff2) format('woff2')}
@font-face{font-family:'Noto Sans Bengali';font-style:normal;font-weight:700;font-display:swap;src:url(https://cdn.jsdelivr.net/npm/@fontsource/noto-sans-bengali@5/files/noto-sans-bengali-bengali-700-normal.woff2) format('woff2')}
@font-face{font-family:'Noto Serif Bengali';font-style:normal;font-weight:400;font-display:swap;src:url(https://cdn.jsdelivr.net/npm/@fontsource/noto-serif-bengali@5/files/noto-serif-bengali-bengali-400-normal.woff2) format('woff2')}
@font-face{font-family:'Noto Serif Bengali';font-style:normal;font-weight:500;font-display:swap;src:url(https://cdn.jsdelivr.net/npm/@fontsource/noto-serif-bengali@5/files/noto-serif-bengali-bengali-500-normal.woff2) format('woff2')}
@font-face{font-family:'Noto Serif Bengali';font-style:normal;font-weight:600;font-display:swap;src:url(https://cdn.jsdelivr.net/npm/@fontsource/noto-serif-bengali@5/files/noto-serif-bengali-bengali-600-normal.woff2) format('woff2')}
@font-face{font-family:'Noto Serif Bengali';font-style:normal;font-weight:700;font-display:swap;src:url(https://cdn.jsdelivr.net/npm/@fontsource/noto-serif-bengali@5/files/noto-serif-bengali-bengali-700-normal.woff2) format('woff2')}
*{box-sizing:border-box}
body{margin:0;background:#08090c;color:#eae3d3;font-family:'Noto Sans Bengali',system-ui,sans-serif;
  display:flex;flex-direction:column;align-items:center;gap:22px;padding:32px 16px 48px}
header{text-align:center;max-width:520px}
.kicker{font-size:11px;letter-spacing:.32em;text-transform:uppercase;color:#d4af68}
h1{font-family:'Noto Serif Bengali',serif;font-size:28px;line-height:1.25;margin:8px 0 6px}
.credit{font-size:14px;color:#8b909a}
.credit b{color:#d4af68;font-weight:600}
.stage{position:relative;width:min(420px,92vw);aspect-ratio:9/16;border-radius:18px;overflow:hidden;
  border:1px solid rgba(212,175,104,.2);box-shadow:0 30px 80px -20px rgba(0,0,0,.9);background:#08090c}
canvas{display:block;width:100%;height:100%}
.panel{width:min(520px,94vw);display:flex;flex-direction:column;gap:12px}
.row{display:flex;align-items:center;gap:12px}
button.circle{height:44px;width:44px;flex:0 0 44px;border-radius:50%;border:1px solid rgba(212,175,104,.3);
  background:#d4af68;color:#08090c;font-size:15px;cursor:pointer;transition:.15s}
button.circle.ghost{background:transparent;color:#d4af68}
button.circle:hover{filter:brightness(1.12)}
button.circle:disabled{opacity:.4;cursor:default}
input[type=range]{flex:1;height:6px;-webkit-appearance:none;appearance:none;border-radius:99px;
  background:rgba(212,175,104,.2);cursor:pointer}
input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;height:14px;width:14px;border-radius:50%;
  background:#d4af68;box-shadow:0 0 0 4px rgba(212,175,104,.18)}
input[type=range]::-moz-range-thumb{height:14px;width:14px;border:0;border-radius:50%;background:#d4af68}
.time{width:96px;text-align:right;font-size:12px;color:#8b909a;font-variant-numeric:tabular-nums}
.chips{display:flex;flex-wrap:wrap;gap:8px;align-items:center;font-size:12px}
.chip{border-radius:99px;border:1px solid rgba(255,255,255,.1);color:#8b909a;padding:6px 12px;
  background:transparent;cursor:pointer;font-family:inherit;font-size:12px;transition:.15s}
.chip:hover{border-color:rgba(255,255,255,.25)}
.chip.on{border-color:#d4af68;background:rgba(212,175,104,.15);color:#d4af68}
.box{border:1px solid rgba(212,175,104,.2);background:rgba(255,255,255,.03);border-radius:12px;padding:16px}
.box h2{margin:0;font-size:14px}
.box p{margin:4px 0 0;font-size:12px;color:#8b909a}
.box .row{margin-top:12px;justify-content:space-between}
button.gold{border:0;border-radius:99px;background:#d4af68;color:#08090c;font-weight:600;font-size:14px;
  padding:10px 18px;cursor:pointer;font-family:inherit;transition:.15s}
button.gold:hover{filter:brightness(1.1)}
button.gold:disabled{opacity:.4;cursor:default}
.warn{margin-top:10px;font-size:12px;color:#e8a49c}
.bar{margin-top:8px;height:6px;border-radius:99px;background:rgba(212,175,104,.15);overflow:hidden}
.bar>div{height:100%;background:#d4af68;width:0;transition:.2s}
a.dl{display:inline-block;margin-top:10px;color:#d4af68;text-decoration:underline;text-underline-offset:4px;font-size:14px}
footer{max-width:520px;text-align:center;font-size:12px;line-height:1.7;color:#8b909a}
</style>
</head>
<body>

<header>
  <div class="kicker">Motion Graphics · 9:16 · Canvas 2D</div>
  <h1>যে নীরবতা আমাদের সন্তানদের ঢেকে রাখে</h1>
  <div class="credit">নির্মাণ ও উপস্থাপনা — <b>আব্দুর রহমান</b></div>
</header>

<div class="stage"><canvas id="cv" width="1080" height="1920"></canvas></div>

<div class="panel">
  <div class="row">
    <button class="circle" id="play" aria-label="প্লে/পজ">▶</button>
    <button class="circle ghost" id="restart" aria-label="আবার শুরু">⟲</button>
    <input type="range" id="scrub" min="0" max="1" step="0.05" value="0" />
    <span class="time" id="clock">0:00 / 0:00</span>
  </div>
  <div class="chips">
    <button class="chip" id="mute">সাউন্ড চালু</button>
    <button class="chip" id="safe">সেফ জোন</button>
    <span style="margin-left:auto;color:#8b909a">Space = প্লে/পজ</span>
  </div>

  <div class="box">
    <h2>ফেসবুকের জন্য এক্সপোর্ট</h2>
    <p>১০৮০×১৯২০ · WebM · ভয়েসওভারসহ</p>
    <div class="row">
      <span style="font-size:12px;color:#8b909a">রেকর্ড হতে পুরো ভিডিওর সময় লাগবে</span>
      <button class="gold" id="rec">ভিডিও ডাউনলোড</button>
    </div>
    <div class="warn" id="recWarn" style="display:none">রেকর্ডিং চলছে — এই ট্যাবটি সক্রিয় রাখুন, অন্য ট্যাবে যাবেন না।</div>
    <div class="bar" id="recBarWrap" style="display:none"><div id="recBar"></div></div>
    <a class="dl" id="saveLink" style="display:none" download="nirobota-abdur-rahman.webm">⬇ ফাইলটি সেভ করুন (WebM)</a>
  </div>
</div>

<footer>
  প্রতিটি ফ্রেম কোড দিয়ে আঁকা — Canvas 2D। কোনো AI ভিডিও জেনারেটর ব্যবহার করা হয়নি।<br />
  তথ্যসূত্র: আইন ও সালিশ কেন্দ্র · New Age · JMBF · Daily Asian Age
</footer>

<script>
/* ================= embedded engine (esbuild bundle) ================= */
${engineJs}

/* বান্ডলের API গ্লোবাল স্কোপে আনা */
const {
  W, H, C, F, bn,
  lerp, prog, easeOutExpo, easeOutQuint, easeInOutCubic, smoothstep, pop, spring,
  wrapText, drawWrapped, drawStaggered, goldRule, roundRect, card,
  iconShield, iconLock, iconBuilding, iconScale, iconPhone, iconDoc, iconWalk,
  checkMark, ornament,
  makeParticles, drawParticles, drawBackground, drawLightStreaks, drawVignette, drawGrain, drawSafeZones,
  SEGMENTS,
} = VideoKit;

/* ================= embedded voiceover (base64) ================= */
const AUDIO_B64 = {
${audioB64}
};

/* ================= player ================= */
(function () {
  const cv = document.getElementById("cv");
  const ctx = cv.getContext("2d");
  const $play = document.getElementById("play");
  const $restart = document.getElementById("restart");
  const $scrub = document.getElementById("scrub");
  const $clock = document.getElementById("clock");
  const $mute = document.getElementById("mute");
  const $safe = document.getElementById("safe");
  const $rec = document.getElementById("rec");
  const $recWarn = document.getElementById("recWarn");
  const $recBarWrap = document.getElementById("recBarWrap");
  const $recBar = document.getElementById("recBar");
  const $save = document.getElementById("saveLink");

  let muted = false, safeOn = false, playing = false, t = 0, total = 0, last = null, recording = false;
  const parts = makeParticles(120);
  const segs = [];

  const mmss = (s) => Math.floor(s / 60) + ":" + String(Math.floor(s % 60)).padStart(2, "0");

  function build() {
    return Promise.all(
      SEGMENTS.map(async (seg) => {
        const list = typeof seg.vo === "string" ? [seg.vo] : seg.vo || [];
        const vos = [];
        for (const f of list) {
          const el = new Audio("data:audio/mpeg;base64," + AUDIO_B64[f]);
          await new Promise((res, rej) => {
            el.addEventListener("loadedmetadata", res, { once: true });
            el.addEventListener("error", rej, { once: true });
          });
          vos.push({ el, dur: el.duration });
        }
        return { seg, vos, fixed: seg.fixed, draw: seg.draw };
      })
    ).then((items) => {
      let cursor = 0;
      items.forEach((it) => {
        const voice = it.vos.reduce((a, v) => a + v.dur, 0);
        const dur = it.fixed != null ? it.fixed : Math.max(4, voice + 0.6);
        let off = 0;
        it.vos.forEach((v) => { v.abs = cursor + off; off += v.dur; });
        segs.push({ start: cursor, dur: cursor + dur, draw: it.draw, vos: it.vos });
        cursor += dur;
      });
      total = cursor;
      $scrub.max = String(total);
      $clock.textContent = "0:00 / " + mmss(total);
    });
  }

  function currentSeg(time) {
    for (const s of segs) if (time >= s.start && time < s.end) return s;
    return segs[segs.length - 1];
  }

  function sync(time, shouldPlay) {
    const seg = currentSeg(time);
    for (const s of segs) {
      for (const v of s.vos) {
        const active = s === seg && time >= v.abs && time < v.abs + v.dur;
        if (active) {
          const off = time - v.abs;
          if (Math.abs(v.el.currentTime - off) > 0.28) { v.el.pause(); v.el.currentTime = off; }
          v.el.muted = muted;
          if (shouldPlay && v.el.paused) v.el.play().catch(function () {});
        } else if (!v.el.paused) v.el.pause();
      }
    }
  }

  function draw(time, dt) {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, W, H);
    drawBackground(ctx, time);
    drawLightStreaks(ctx, time);
    drawParticles(ctx, parts, dt, time);
    const seg = currentSeg(time);
    if (seg) {
      ctx.save();
      seg.draw(ctx, Math.max(0, Math.min(1, (time - seg.start) / (seg.end - seg.start))), time, time - seg.start);
      ctx.restore();
    }
    drawVignette(ctx);
    drawGrain(ctx, time);
    if (safeOn) drawSafeZones(ctx);
  }

  function tick(now) {
    requestAnimationFrame(tick);
    if (last === null) last = now;
    let dt = (now - last) / 1000;
    last = now;
    if (dt > 0.25) dt = 0.25;
    if (playing) {
      t += dt;
      if (t >= total) { t = total; playing = false; $play.textContent = "▶"; sync(t, false); }
      else sync(t, true);
      $scrub.value = String(t);
      $clock.textContent = mmss(t) + " / " + mmss(total);
      if (recording) {
        const pct = total > 0 ? Math.min(100, Math.round((t / total) * 100)) : 0;
        $recBar.style.width = pct + "%";
        $rec.textContent = "রেকর্ডিং " + pct + "%";
      }
    }
    draw(t, dt);
  }

  function setPlaying(v) {
    playing = v;
    $play.textContent = v ? "❚❚" : "▶";
    sync(t, v);
  }

  $play.addEventListener("click", function () {
    if (!total) return;
    if (!playing && t >= total - 0.01) t = 0;
    setPlaying(!playing);
  });
  $restart.addEventListener("click", function () { t = 0; setPlaying(true); });
  $scrub.addEventListener("input", function () {
    t = parseFloat($scrub.value);
    $clock.textContent = mmss(t) + " / " + mmss(total);
    sync(t, playing);
    draw(t, 0.016);
  });
  $mute.addEventListener("click", function () {
    muted = !muted;
    $mute.textContent = muted ? "সাউন্ড বন্ধ" : "সাউন্ড চালু";
    $mute.classList.toggle("on", muted);
  });
  $safe.addEventListener("click", function () {
    safeOn = !safeOn;
    $safe.classList.toggle("on", safeOn);
  });
  window.addEventListener("keydown", function (e) {
    if (e.code === "Space") { e.preventDefault(); $play.click(); }
  });

  /* ---------- WebM export ---------- */
  $rec.addEventListener("click", function () {
    if (recording || !total) return;
    const stream = cv.captureStream(30);
    const AC = window.AudioContext || window.webkitAudioContext;
    const ac = new AC();
    const dest = ac.createMediaStreamDestination();
    segs.forEach(function (s) {
      s.vos.forEach(function (v) { ac.createMediaElementSource(v.el).connect(dest); });
    });
    dest.stream.getAudioTracks().forEach(function (tr) { stream.addTrack(tr); });

    const mime = ["video/webm;codecs=vp9,opus", "video/webm;codecs=vp8,opus", "video/webm"].filter(function (m) {
      return window.MediaRecorder && MediaRecorder.isTypeSupported(m);
    })[0];
    if (!mime) { $rec.textContent = "ব্রাউজারে সাপোর্ট নেই"; return; }

    const rec = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: 8000000 });
    const chunks = [];
    rec.ondataavailable = function (e) { if (e.data.size) chunks.push(e.data); };
    rec.onstop = function () {
      const url = URL.createObjectURL(new Blob(chunks, { type: mime }));
      $save.href = url;
      $save.style.display = "inline-block";
      recording = false;
      $recWarn.style.display = "none";
      $recBarWrap.style.display = "none";
      $rec.textContent = "আবার ডাউনলোড";
      ac.close().catch(function () {});
    };

    recording = true;
    rec.start(250);
    $recWarn.style.display = "block";
    $recBarWrap.style.display = "block";
    t = 0;
    setPlaying(true);

    const waiter = setInterval(function () {
      if (t >= total - 0.05) {
        clearInterval(waiter);
        setPlaying(false);
        setTimeout(function () { rec.stop(); $recBar.style.width = "100%"; }, 400);
      }
    }, 120);
  });

  build().then(function () {
    requestAnimationFrame(tick);
    draw(0, 0.016);
  }).catch(function (e) {
    $clock.textContent = "লোড ব্যর্থ";
    console.error(e);
  });
})();
</script>
</body>
</html>
`;

mkdirSync(join(root, "public/downloads"), { recursive: true });
const out = join(root, "public/downloads/nirobota-video-abdur-rahman.html");
writeFileSync(out, html);
const kb = (statSync(out).size / 1024).toFixed(0);
console.log("built:", out);
console.log("size: " + kb + " KB  (audio " + (audioBytes / 1024).toFixed(0) + " KB embedded)");
