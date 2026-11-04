"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SEGMENTS, type Seg } from "./scenes";
import {
  W, H,
  makeParticles, drawParticles, drawBackground, drawLightStreaks, drawVignette, drawGrain, drawSafeZones,
} from "./motion";

interface Built {
  id: string;
  dur: number;
  start: number;
  vos: { file: string; at: number; el: HTMLAudioElement; dur: number }[];
  draw: Seg["draw"];
}

const AUDIO_BASE = "/video/audio/";

export default function VideoClient() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const builtRef = useRef<Built[]>([]);
  const partsRef = useRef(makeParticles(120));
  const timeRef = useRef(0);
  const lastRef = useRef<number | null>(null);
  const playingRef = useRef(false);
  const recRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const [ready, setReady] = useState(false);
  const [readyErr, setReadyErr] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [safe, setSafe] = useState(false);
  const [muted, setMuted] = useState(false);
  const [recState, setRecState] = useState<"idle" | "recording" | "done">("idle");
  const [recPct, setRecPct] = useState(0);
  const [url, setUrl] = useState<string | null>(null);

  /* ---------- timeline build: VO ক্লিপের আসল দৈর্ঘ্য মেপে ---------- */
  useEffect(() => {
    let cancelled = false;
    const voMap = new Map<string, HTMLAudioElement>();

    const loadOne = (file: string) =>
      new Promise<{ el: HTMLAudioElement; dur: number }>((resolve, reject) => {
        const el = new Audio(AUDIO_BASE + file);
        el.preload = "auto";
        el.crossOrigin = "anonymous";
        voMap.set(file, el);
        const ok = () => resolve({ el, dur: isFinite(el.duration) && el.duration > 0 ? el.duration : 0 });
        el.addEventListener("loadedmetadata", ok, { once: true });
        el.addEventListener("error", () => reject(new Error(file)), { once: true });
      });

    (async () => {
      try {
        await (document as Document & { fonts?: FontFaceSet }).fonts?.ready;
        const files = Array.from(new Set(SEGMENTS.flatMap((s) => (typeof s.vo === "string" ? [s.vo] : s.vo ?? []))));
        const loaded: Record<string, { el: HTMLAudioElement; dur: number }> = {};
        for (const f of files) loaded[f] = await loadOne(f);

        let cursor = 0;
        const built: Built[] = SEGMENTS.map((seg) => {
          const list = typeof seg.vo === "string" ? [seg.vo] : seg.vo ?? [];
          const start = cursor;
          // প্রতিটি ক্লিপের offset সিন-লোকাল সময়ে রাখি (v.at)
          const vos = list.map((file) => {
            const at = cursor - start;
            cursor += loaded[file].dur;
            return { file, at, el: loaded[file].el, dur: loaded[file].dur };
          });
          const voice = vos.reduce((a, v) => a + v.dur, 0);
          const dur = seg.fixed ?? Math.max(4, voice + 0.6);
          const b: Built = { id: seg.id, dur, start: cursor, vos, draw: seg.draw };
          cursor += dur;
          return b;
        });
        if (cancelled) return;
        builtRef.current = built;
        setTotal(cursor);
        setReady(true);
      } catch (e) {
        if (!cancelled) setReadyErr(e instanceof Error ? e.message : String(e));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  /* ---------- audio sync ---------- */
  const syncAudio = useCallback((t: number, shouldPlay: boolean) => {
    const segs = builtRef.current;
    const seg = segs.find((s) => t >= s.start && t < s.start + s.dur) ?? segs[segs.length - 1];
    const local = t - (seg?.start ?? 0);
    for (const s of segs) {
      for (const v of s.vos) {
        if (seg && s === seg && local >= v.at && local < v.at + v.dur) {
          const off = local - v.at;
          if (Math.abs(v.el.currentTime - off) > 0.28) {
            v.el.pause();
            // HTMLMediaElement-এর currentTime — ইচ্ছাকৃত মিউটেশন (স্ক্রাব/সিঙ্ক)
            // eslint-disable-next-line react-hooks/immutability
            v.el.currentTime = off;
          }
          v.el.muted = muted;
          if (shouldPlay && v.el.paused) void v.el.play().catch(() => {});
        } else if (!v.el.paused) {
          v.el.pause();
        }
      }
    }
  }, [muted]);

  /* ---------- render ---------- */
  const render = useCallback(
    (t: number, dt: number) => {
      const cv = canvasRef.current;
      const ctx = cv?.getContext("2d");
      if (!cv || !ctx) return;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, W, H);

      drawBackground(ctx, t);
      drawLightStreaks(ctx, t);
      drawParticles(ctx, partsRef.current, dt, t);

      const segs = builtRef.current;
      const seg = segs.find((s) => t >= s.start && t < s.start + s.dur) ?? segs[segs.length - 1];
      if (seg) {
        const local = t - seg.start;
        const p = Math.max(0, Math.min(1, local / seg.dur));
        ctx.save();
        seg.draw(ctx, p, t, local);
        ctx.restore();
      }

      drawVignette(ctx);
      drawGrain(ctx, t);
      if (safe) drawSafeZones(ctx);
    },
    [safe]
  );

  /* ---------- loop ---------- */
  useEffect(() => {
    let raf = 0;
    const step = (now: number) => {
      raf = requestAnimationFrame(step);
      const last = lastRef.current ?? now;
      let dt = (now - last) / 1000;
      lastRef.current = now;
      if (dt > 0.25) dt = 0.25; // ট্যাব বদলালে লাফ দেবে না
      if (playingRef.current) {
        timeRef.current += dt;
        if (timeRef.current >= total && total > 0) {
          timeRef.current = total;
          playingRef.current = false;
          setPlaying(false);
          syncAudio(total, false);
        } else {
          syncAudio(timeRef.current, true);
        }
        setTime(timeRef.current);
      }
      render(timeRef.current, dt);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [render, safe, syncAudio, total]);

  /* ---------- controls ---------- */
  const toggle = useCallback(() => {
    if (!ready) return;
    if (!playingRef.current && timeRef.current >= total - 0.01) {
      timeRef.current = 0;
      syncAudio(0, true);
    }
    playingRef.current = !playingRef.current;
    setPlaying(playingRef.current);
    syncAudio(timeRef.current, playingRef.current);
  }, [ready, total, syncAudio]);

  const seek = useCallback(
    (t: number) => {
      timeRef.current = Math.max(0, Math.min(total, t));
      setTime(timeRef.current);
      syncAudio(timeRef.current, playingRef.current);
      render(timeRef.current, 0.016);
    },
    [total, syncAudio, render]
  );

  const restart = useCallback(() => {
    seek(0);
    playingRef.current = true;
    setPlaying(true);
    syncAudio(0, true);
  }, [seek, syncAudio]);

  /* ---------- WebM export ---------- */
  const exportVideo = useCallback(async () => {
    const cv = canvasRef.current;
    if (!cv || recState === "recording") return;
    const stream = cv.captureStream(30);

    const AC: typeof AudioContext =
      window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ac = new AC();
    const dest = ac.createMediaStreamDestination();
    for (const s of builtRef.current) for (const v of s.vos) ac.createMediaElementSource(v.el).connect(dest);
    dest.stream.getAudioTracks().forEach((tr) => stream.addTrack(tr));

    const mime = ["video/webm;codecs=vp9,opus", "video/webm;codecs=vp8,opus", "video/webm"].find(
      (m) => typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(m)
    );
    if (!mime) return;
    const rec = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: 8_000_000 });
    chunksRef.current = [];
    rec.ondataavailable = (e) => e.data.size && chunksRef.current.push(e.data);
    rec.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: mime });
      const u = URL.createObjectURL(blob);
      setUrl((old) => {
        if (old) URL.revokeObjectURL(old);
        return u;
      });
      setRecState("done");
      ac.close().catch(() => {});
    };

    rec.start(250);
    recRef.current = rec;
    setRecState("recording");
    setRecPct(0);

    // একদম শুরু থেকে রেকর্ড
    timeRef.current = 0;
    playingRef.current = true;
    setPlaying(true);
    syncAudio(0, true);

    const tick = window.setInterval(() => {
      setRecPct(total > 0 ? Math.min(100, Math.round((timeRef.current / total) * 100)) : 0);
    }, 200);

    const wait = window.setInterval(() => {
      if (timeRef.current >= total - 0.05) {
        window.clearInterval(wait);
        window.clearInterval(tick);
        playingRef.current = false;
        setPlaying(false);
        syncAudio(total, false);
        window.setTimeout(() => {
          recRef.current?.stop();
          recRef.current = null;
          setRecPct(100);
        }, 400);
      }
    }, 120);
  }, [recState, total, syncAudio]);

  /* ---------- keyboard ---------- */
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        toggle();
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [toggle]);

  const mmss = useMemo(
    () => (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`,
    []
  );

  return (
    <div className="min-h-screen w-full bg-[#08090c] text-[#eae3d3] px-4 py-8 flex flex-col items-center gap-6">
      <header className="w-full max-w-[520px] text-center space-y-2">
        <p className="text-[11px] tracking-[0.32em] text-[#d4af68] uppercase">Motion Graphics · 9:16 · Canvas 2D</p>
        <h1
          className="text-3xl font-bold leading-tight"
          style={{ fontFamily: '"Noto Serif Bengali", serif' }}
        >
          যে নীরবতা আমাদের সন্তানদের ঢেকে রাখে
        </h1>
        <p className="text-sm text-[#8b909a]">
          নির্মাণ ও উপস্থাপনা — <span className="text-[#d4af68]">আব্দুর রহমান</span>
        </p>
      </header>

      <div
        className="relative w-full max-w-[420px] overflow-hidden rounded-[18px] border border-[#d4af68]/20 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)]"
        style={{ aspectRatio: "9 / 16", background: "#08090c" }}
      >
        <canvas ref={canvasRef} width={W} height={H} className="block h-full w-full" />
        {!ready && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-sm">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#d4af68]/30 border-t-[#d4af68]" />
            <p className="text-[#8b909a]">
              {readyErr ? `অডিও লোড হয়নি: ${readyErr}` : "ফন্ট ও অডিও লোড হচ্ছে…"}
            </p>
          </div>
        )}
      </div>

      <div className="w-full max-w-[520px] space-y-3">
        <div className="flex items-center gap-3">
          <button
            onClick={toggle}
            disabled={!ready}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#d4af68] text-[#08090c] transition hover:bg-[#f0d79b] disabled:opacity-40"
            aria-label={playing ? "পজ" : "প্লে"}
          >
            {playing ? (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><rect x="2" y="1" width="4" height="14" rx="1" /><rect x="10" y="1" width="4" height="14" rx="1" /></svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M3 1.5v13l11-6.5z" /></svg>
            )}
          </button>
          <button
            onClick={restart}
            disabled={!ready}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#d4af68]/30 text-[#d4af68] transition hover:bg-[#d4af68]/10 disabled:opacity-40"
            aria-label="আবার শুরু"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M2.5 8a5.5 5.5 0 1 0 1.7-4" /><path d="M2 1.5V5h3.5" /></svg>
          </button>
          <input
            type="range"
            min={0}
            max={total || 1}
            step={0.05}
            value={time}
            onChange={(e) => seek(parseFloat(e.target.value))}
            disabled={!ready}
            className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-[#d4af68]/20 accent-[#d4af68]"
          />
          <span className="w-24 shrink-0 text-right text-xs tabular-nums text-[#8b909a]">
            {mmss(time)} / {mmss(total)}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <Toggle on={muted} onClick={() => setMuted((m) => !m)} label={muted ? "সাউন্ড বন্ধ" : "সাউন্ড চালু"} />
          <Toggle on={safe} onClick={() => setSafe((s) => !s)} label="সেফ জোন" />
          <span className="ml-auto text-[#8b909a]">Space = প্লে/পজ</span>
        </div>

        <div className="rounded-xl border border-[#d4af68]/20 bg-white/[0.03] p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-[#eae3d3]">ফেসবুকের জন্য এক্সপোর্ট</p>
              <p className="text-xs text-[#8b909a]">১০৮০×১৯২০ · WebM · অডিওসহ</p>
            </div>
            <button
              onClick={exportVideo}
              disabled={!ready || recState === "recording"}
              className="rounded-full bg-[#d4af68] px-4 py-2 text-sm font-semibold text-[#08090c] transition hover:bg-[#f0d79b] disabled:opacity-40"
            >
              {recState === "recording" ? `রেকর্ডিং ${recPct}%` : "ভিডিও ডাউনলোড"}
            </button>
          </div>
          {recState === "recording" && (
            <p className="mt-3 text-xs text-[#e8a49c]">
              রেকর্ডিং চলছে — এই ট্যাবটি সক্রিয় রাখুন, অন্য ট্যাবে যাবেন না।
            </p>
          )}
          {recState === "recording" && (
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[#d4af68]/15">
              <div className="h-full rounded-full bg-[#d4af68] transition-all" style={{ width: `${recPct}%` }} />
            </div>
          )}
          {url && (
            <a
              href={url}
              download="nirôbota-abdur-rahman.webm"
              className="mt-3 inline-block text-sm text-[#d4af68] underline underline-offset-4 hover:text-[#f0d79b]"
            >
              ⬇ ফাইলটি সেভ করুন (WebM)
            </a>
          )}
        </div>
      </div>

      <footer className="max-w-[520px] pb-10 text-center text-xs leading-relaxed text-[#8b909a]">
        প্রতিটি ফ্রেম কোড দিয়ে আঁকা — Canvas 2D। কোনো AI ভিডিও জেনারেটর ব্যবহার করা হয়নি।
        <br />
        তথ্যসূত্র: আইন ও সালিশ কেন্দ্র · New Age · JMBF · Daily Asian Age
        <br />
        <a
          href="/downloads"
          className="mt-3 inline-block rounded-full border border-[#d4af68]/40 px-4 py-1.5 text-[#d4af68] transition hover:bg-[#d4af68]/10"
        >
          ⬇ স্ক্রিপ্ট, ভয়েসওভার ও কোড ডাউনলোড করুন
        </a>
      </footer>
    </div>
  );
}

function Toggle({ on, onClick, label }: { on: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 transition ${
        on
          ? "border-[#d4af68] bg-[#d4af68]/15 text-[#d4af68]"
          : "border-white/10 text-[#8b909a] hover:border-white/25"
      }`}
    >
      {label}
    </button>
  );
}
