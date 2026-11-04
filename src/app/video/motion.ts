/**
 * motion.ts — মোশন গ্রাফিক্স প্রিমিটিভ
 * প্রতিটি ফ্রেম Canvas 2D দিয়ে আঁকা হয় (কোনো ভিডিও/AI জেনারেটর নেই)।
 * সব easing ফাংশন ফিজিক্স-ভিত্তিক, linear নয় — এতেই "অর্গানিক" ফিল আসে।
 */

export const W = 1080;
export const H = 1920;

export const C = {
  bg0: "#08090c",
  bg1: "#12161d",
  bg2: "#0b0e13",
  ink: "#eae3d3",
  gold: "#d4af68",
  goldBright: "#f0d79b",
  goldDeep: "#8d6c2f",
  alert: "#c9554a",
  dim: "#8b909a",
  cardBg: "rgba(255,255,255,0.035)",
  cardLine: "rgba(212,175,104,0.22)",
};

export const F = {
  sans: (w: number, px: number) => `${w} ${px}px "Noto Sans Bengali", sans-serif`,
  serif: (w: number, px: number) => `${w} ${px}px "Noto Serif Bengali", serif`,
  num: (w: number, px: number) => `${w} ${px}px "Outfit", "Noto Sans Bengali", sans-serif`,
};

/* ---------- easing ---------- */
export const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** sub-progress within [a,b] */
export const prog = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));

export const smoothstep = (x: number) => {
  const t = clamp01(x);
  return t * t * (3 - 2 * t);
};
export const easeOutExpo = (x: number) => (x >= 1 ? 1 : 1 - Math.pow(2, -10 * x));
export const easeOutQuint = (x: number) => 1 - Math.pow(1 - clamp01(x), 5);
export const easeInOutCubic = (x: number) => {
  const t = clamp01(x);
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
};

/**
 * দ্বিতীয় ক্রমের স্প্রিং (underdamped) — overshoot সহ।
 * আইকন/কার্ড "বসার" সময় হালকা elastic ভাব দেয়।
 */
export function spring(x: number, damping = 0.55, freq = 2.1) {
  const t = clamp01(x);
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  const w = 2 * Math.PI * freq;
  return (
    1 -
    Math.exp(-damping * w * t) * (Math.cos(w * Math.sqrt(1 - damping * damping) * t) +
      (damping / Math.sqrt(1 - damping * damping)) * Math.sin(w * Math.sqrt(1 - damping * damping) * t))
  );
}

/** ease + overshoot সহ pop (স্কেল অ্যানিমেশনের জন্য) */
export const pop = (x: number) => spring(x, 0.5, 1.9);

/* ---------- বাংলা সংখ্যা ---------- */
const BN = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
export const bn = (n: number | string) => String(n).replace(/\d/g, (d) => BN[+d]);

/* ---------- বাংলা word-wrap (গ্রাফেম ক্লাস্টার কখনো ভাঙে না) ---------- */
export function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    const test = cur ? cur + " " + w : w;
    if (ctx.measureText(test).width <= maxWidth || !cur) cur = test;
    else {
      lines.push(cur);
      cur = w;
    }
  }
  if (cur) lines.push(cur);
  return lines;
}

export interface TextOpts {
  align?: CanvasTextAlign;
  baseline?: CanvasTextBaseline;
  lh?: number;
  maxWidth: number;
  color?: string;
  glow?: number;
  glowColor?: string;
}

export function drawWrapped(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  o: TextOpts
): number {
  const lines = wrapText(ctx, text, o.maxWidth);
  ctx.textAlign = o.align ?? "center";
  ctx.textBaseline = o.baseline ?? "top";
  const lh = o.lh ?? 1.45;
  const size = parseFloat(ctx.font.split("px")[0] || "40");
  if (o.color) ctx.fillStyle = o.color;
  if (o.glow) {
    ctx.shadowColor = o.glowColor ?? "rgba(212,175,104,0.55)";
    ctx.shadowBlur = o.glow;
  }
  lines.forEach((ln, i) => ctx.fillText(ln, x, y + i * size * lh));
  ctx.shadowBlur = 0;
  return lines.length * size * lh;
}

/** প্রতিটি লাইন আলাদা stagger দিয়ে ওঠে — kinetic typography */
export function drawStaggered(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  o: TextOpts & { stagger?: number; t: number; dur?: number }
): void {
  const lines = wrapText(ctx, text, o.maxWidth);
  const size = parseFloat(ctx.font.split("px")[0] || "40");
  const lh = o.lh ?? 1.4;
  const step = o.stagger ?? 0.12;
  const dur = o.dur ?? 0.5;
  ctx.textAlign = o.align ?? "center";
  ctx.textBaseline = o.baseline ?? "top";
  lines.forEach((ln, i) => {
    const p = easeOutExpo(prog(o.t, i * step, i * step + dur));
    if (p <= 0) return;
    ctx.save();
    ctx.globalAlpha = p;
    ctx.translate(0, (1 - p) * size * 0.55);
    ctx.fillStyle = o.color ?? C.ink;
    if (o.glow) {
      ctx.shadowColor = o.glowColor ?? "rgba(212,175,104,0.5)";
      ctx.shadowBlur = o.glow * p;
    }
    ctx.fillText(ln, x, y + i * size * lh);
    ctx.restore();
  });
  ctx.shadowBlur = 0;
}

/* ---------- শেপ ---------- */
export function goldRule(ctx: CanvasRenderingContext2D, cx: number, y: number, w: number, p: number, thick = 3) {
  const width = w * easeOutExpo(p);
  if (width <= 0.5) return;
  const g = ctx.createLinearGradient(cx - width / 2, 0, cx + width / 2, 0);
  g.addColorStop(0, "rgba(212,175,104,0)");
  g.addColorStop(0.2, C.goldDeep);
  g.addColorStop(0.5, C.goldBright);
  g.addColorStop(0.8, C.goldDeep);
  g.addColorStop(1, "rgba(212,175,104,0)");
  ctx.fillStyle = g;
  ctx.fillRect(cx - width / 2, y - thick / 2, width, thick);
}

export function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

export function card(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  p: number,
  opts: { r?: number; fill?: string; line?: string } = {}
) {
  const s = pop(p);
  if (s <= 0.001) return;
  ctx.save();
  ctx.globalAlpha = Math.min(1, p * 1.6);
  ctx.translate(x + w / 2, y + h / 2);
  ctx.scale(0.94 + 0.06 * s, 0.94 + 0.06 * s);
  ctx.translate(-(x + w / 2), -(y + h / 2));
  roundRect(ctx, x, y, w, h, opts.r ?? 26);
  ctx.fillStyle = opts.fill ?? C.cardBg;
  ctx.fill();
  ctx.strokeStyle = opts.line ?? C.cardLine;
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.restore();
}

/* ---------- আইকন (ভেক্টর, কোডে আঁকা) ---------- */
export function iconShield(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, p: number) {
  if (p <= 0) return;
  ctx.save();
  ctx.globalAlpha = Math.min(1, p * 2);
  ctx.strokeStyle = C.gold;
  ctx.lineWidth = 5;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.shadowColor = "rgba(212,175,104,0.5)";
  ctx.shadowBlur = 18;
  ctx.beginPath();
  ctx.moveTo(cx, cy - r);
  ctx.lineTo(cx + r * 0.82, cy - r * 0.55);
  ctx.lineTo(cx + r * 0.82, cy + r * 0.15);
  ctx.quadraticCurveTo(cx + r * 0.7, cy + r * 0.85, cx, cy + r);
  ctx.quadraticCurveTo(cx - r * 0.7, cy + r * 0.85, cx - r * 0.82, cy + r * 0.15);
  ctx.lineTo(cx - r * 0.82, cy - r * 0.55);
  ctx.closePath();
  ctx.stroke();
  const cp = easeOutExpo(prog(p, 0.4, 1));
  if (cp > 0) {
    ctx.beginPath();
    ctx.moveTo(cx - r * 0.34, cy + r * 0.02);
    ctx.lineTo(cx - r * 0.06, cy + r * 0.32);
    ctx.lineTo(cx + r * 0.42, cy - r * 0.3);
    ctx.strokeStyle = C.goldBright;
    ctx.stroke();
  }
  ctx.restore();
}

export function iconLock(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, p: number) {
  if (p <= 0) return;
  ctx.save();
  ctx.globalAlpha = Math.min(1, p * 2);
  ctx.strokeStyle = C.gold;
  ctx.lineWidth = 5;
  ctx.lineCap = "round";
  ctx.shadowColor = "rgba(212,175,104,0.45)";
  ctx.shadowBlur = 16;
  ctx.beginPath();
  ctx.arc(cx, cy - r * 0.25, r * 0.42, Math.PI, 0);
  ctx.stroke();
  roundRect(ctx, cx - r * 0.7, cy - r * 0.15, r * 1.4, r * 1.05, r * 0.18);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(cx, cy + r * 0.3, r * 0.11, 0, Math.PI * 2);
  ctx.fillStyle = C.goldBright;
  ctx.fill();
  ctx.restore();
}

export function iconBuilding(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, p: number) {
  if (p <= 0) return;
  ctx.save();
  ctx.globalAlpha = Math.min(1, p * 2);
  ctx.strokeStyle = C.gold;
  ctx.lineWidth = 5;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.shadowColor = "rgba(212,175,104,0.45)";
  ctx.shadowBlur = 16;
  ctx.beginPath();
  ctx.moveTo(cx - r * 0.85, cy + r * 0.8);
  ctx.lineTo(cx - r * 0.85, cy - r * 0.35);
  ctx.lineTo(cx, cy - r * 0.9);
  ctx.lineTo(cx + r * 0.85, cy - r * 0.35);
  ctx.lineTo(cx + r * 0.85, cy + r * 0.8);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx, cy - r * 0.45);
  ctx.lineTo(cx, cy + r * 0.8);
  ctx.stroke();
  ctx.restore();
}

export function iconScale(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, p: number) {
  if (p <= 0) return;
  const s = pop(p);
  ctx.save();
  ctx.globalAlpha = Math.min(1, p * 2);
  ctx.translate(cx, cy);
  ctx.scale(s, s);
  ctx.strokeStyle = C.gold;
  ctx.lineWidth = 5;
  ctx.lineCap = "round";
  ctx.shadowColor = "rgba(212,175,104,0.5)";
  ctx.shadowBlur = 18;
  ctx.beginPath();
  ctx.moveTo(0, -r * 0.8);
  ctx.lineTo(0, r * 0.75);
  ctx.moveTo(-r * 0.45, r * 0.9);
  ctx.lineTo(r * 0.45, r * 0.9);
  ctx.stroke();
  const tilt = Math.sin(Math.min(1, p) * Math.PI) * 0.05;
  ctx.rotate(tilt);
  ctx.beginPath();
  ctx.moveTo(-r * 0.85, -r * 0.55);
  ctx.lineTo(r * 0.85, -r * 0.55);
  ctx.stroke();
  [-1, 1].forEach((d) => {
    ctx.beginPath();
    ctx.moveTo(d * r * 0.85, -r * 0.55);
    ctx.lineTo(d * r * 0.85, -r * 0.1);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(d * r * 0.85, -r * 0.05, r * 0.3, 0, Math.PI);
    ctx.stroke();
  });
  ctx.restore();
}

export function iconPhone(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, p: number) {
  if (p <= 0) return;
  ctx.save();
  ctx.globalAlpha = Math.min(1, p * 2);
  ctx.strokeStyle = C.gold;
  ctx.lineWidth = 5;
  ctx.lineCap = "round";
  ctx.shadowColor = "rgba(212,175,104,0.5)";
  ctx.shadowBlur = 16;
  roundRect(ctx, cx - r * 0.42, cy - r * 0.75, r * 0.84, r * 1.5, r * 0.16);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx - r * 0.16, cy + r * 0.52);
  ctx.lineTo(cx + r * 0.16, cy + r * 0.52);
  ctx.stroke();
  ctx.restore();
}

export function iconDoc(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, p: number) {
  if (p <= 0) return;
  ctx.save();
  ctx.globalAlpha = Math.min(1, p * 2);
  ctx.strokeStyle = C.gold;
  ctx.lineWidth = 5;
  ctx.lineJoin = "round";
  ctx.shadowColor = "rgba(212,175,104,0.45)";
  ctx.shadowBlur = 16;
  ctx.beginPath();
  ctx.moveTo(cx - r * 0.65, cy - r * 0.85);
  ctx.lineTo(cx + r * 0.28, cy - r * 0.85);
  ctx.lineTo(cx + r * 0.65, cy - r * 0.48);
  ctx.lineTo(cx + r * 0.65, cy + r * 0.85);
  ctx.lineTo(cx - r * 0.65, cy + r * 0.85);
  ctx.closePath();
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx + r * 0.28, cy - r * 0.85);
  ctx.lineTo(cx + r * 0.28, cy - r * 0.48);
  ctx.lineTo(cx + r * 0.65, cy - r * 0.48);
  ctx.stroke();
  ctx.restore();
}

export function iconWalk(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, phase: number, alpha: number) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = C.gold;
  ctx.lineWidth = r * 0.13;
  ctx.lineCap = "round";
  ctx.shadowColor = "rgba(212,175,104,0.6)";
  ctx.shadowBlur = 22;
  const swing = Math.sin(phase) * 0.42;
  ctx.beginPath();
  ctx.arc(cx, cy - r * 0.72, r * 0.24, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx, cy - r * 0.45);
  ctx.lineTo(cx, cy + r * 0.1);
  ctx.moveTo(cx, cy + r * 0.1);
  ctx.lineTo(cx + Math.sin(swing) * r * 0.4, cy + r * 0.8);
  ctx.moveTo(cx, cy + r * 0.1);
  ctx.lineTo(cx - Math.sin(swing) * r * 0.4, cy + r * 0.8);
  ctx.moveTo(cx, cy - r * 0.3);
  ctx.lineTo(cx - Math.sin(swing) * r * 0.35, cy + r * 0.12);
  ctx.stroke();
  // ব্যাগ
  ctx.beginPath();
  roundRect(ctx, cx - r * 0.02, cy - r * 0.42, r * 0.42, r * 0.42, r * 0.08);
  ctx.stroke();
  ctx.restore();
}

export function checkMark(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, p: number) {
  const e = easeOutExpo(p);
  if (e <= 0) return;
  ctx.save();
  ctx.strokeStyle = C.goldBright;
  ctx.lineWidth = 6;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.shadowColor = "rgba(240,215,155,0.7)";
  ctx.shadowBlur = 14;
  const pts: [number, number][] = [
    [cx - r * 0.5, cy],
    [cx - r * 0.12, cy + r * 0.38],
    [cx + r * 0.55, cy - r * 0.4],
  ];
  ctx.beginPath();
  ctx.moveTo(pts[0][0], pts[0][1]);
  if (e < 0.5) {
    const k = e / 0.5;
    ctx.lineTo(lerp(pts[0][0], pts[1][0], k), lerp(pts[0][1], pts[1][1], k));
  } else {
    ctx.lineTo(pts[1][0], pts[1][1]);
    const k = (e - 0.5) / 0.5;
    ctx.lineTo(lerp(pts[1][0], pts[2][0], k), lerp(pts[1][1], pts[2][1], k));
  }
  ctx.stroke();
  ctx.restore();
}

/** ইসলামি জ্যামিতিক অর্নামেন্ট (আট-কোনা তারা) — সিন ০৫-এর ফ্রেম */
export function ornament(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, p: number, rot = 0) {
  if (p <= 0) return;
  ctx.save();
  ctx.globalAlpha = Math.min(1, p) * 0.9;
  ctx.translate(cx, cy);
  ctx.rotate(rot);
  ctx.strokeStyle = C.gold;
  ctx.lineWidth = 3;
  ctx.shadowColor = "rgba(212,175,104,0.6)";
  ctx.shadowBlur = 14;
  for (let k = 0; k < 2; k++) {
    ctx.beginPath();
    for (let i = 0; i <= 4; i++) {
      const a = (i / 4) * Math.PI * 2 + (k * Math.PI) / 4;
      const x = Math.cos(a) * r * easeOutExpo(p);
      const y = Math.sin(a) * r * easeOutExpo(p);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  ctx.restore();
}

/* ---------- background fx ---------- */
let grainCanvas: HTMLCanvasElement | null = null;
function grainTile() {
  if (grainCanvas) return grainCanvas;
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const g = c.getContext("2d")!;
  const img = g.createImageData(256, 256);
  for (let i = 0; i < img.data.length; i += 4) {
    const v = 120 + Math.random() * 90;
    img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
    img.data[i + 3] = 26;
  }
  g.putImageData(img, 0, 0);
  grainCanvas = c;
  return c;
}

export interface Particle {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  depth: number;
  seed: number;
}

export function makeParticles(n: number): Particle[] {
  const out: Particle[] = [];
  for (let i = 0; i < n; i++) {
    const depth = Math.random();
    out.push({
      x: Math.random() * W,
      y: Math.random() * H,
      r: lerp(0.7, 2.6, depth),
      vx: lerp(-4, 4, Math.random()),
      vy: lerp(-16, -4, depth + Math.random() * 0.4),
      depth,
      seed: Math.random() * 100,
    });
  }
  return out;
}

export function drawParticles(ctx: CanvasRenderingContext2D, ps: Particle[], dt: number, t: number, boost = 1) {
  for (const p of ps) {
    p.x += (p.vx * dt + Math.sin(t * 0.35 + p.seed) * 7 * dt) * boost;
    p.y += p.vy * dt * boost;
    if (p.y < -20) {
      p.y = H + 20;
      p.x = Math.random() * W;
    }
    if (p.x < -20) p.x = W + 20;
    if (p.x > W + 20) p.x = -20;
    const tw = 0.55 + 0.45 * Math.sin(t * 1.4 + p.seed * 3);
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(226,205,160,${(0.06 + 0.16 * p.depth) * tw})`;
    ctx.fill();
  }
}

export function drawBackground(ctx: CanvasRenderingContext2D, t: number, warmth = 1) {
  const g = ctx.createLinearGradient(0, 0, W * 0.35, H);
  g.addColorStop(0, C.bg1);
  g.addColorStop(0.55, C.bg2);
  g.addColorStop(1, C.bg0);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);

  // ধীর ড্রিফট করা উষ্ণ আলোর বল — "secondary motion"
  const gx = W * 0.5 + Math.sin(t * 0.11) * W * 0.16;
  const gy = H * 0.3 + Math.cos(t * 0.09) * H * 0.06;
  const rg = ctx.createRadialGradient(gx, gy, 0, gx, gy, W * 0.95);
  rg.addColorStop(0, `rgba(150,116,52,${0.2 * warmth})`);
  rg.addColorStop(0.45, `rgba(70,60,40,${0.09 * warmth})`);
  rg.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = rg;
  ctx.fillRect(0, 0, W, H);

  // নিচের ঠান্ডা শ্যাডো
  const bg = ctx.createLinearGradient(0, H * 0.72, 0, H);
  bg.addColorStop(0, "rgba(0,0,0,0)");
  bg.addColorStop(1, "rgba(0,0,0,0.55)");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);
}

export function drawLightStreaks(ctx: CanvasRenderingContext2D, t: number, count = 3) {
  for (let i = 0; i < count; i++) {
    const period = 13 + i * 5.5;
    const phase = (t + i * 4.2) % period;
    const life = phase / period;
    if (life > 0.62) continue;
    const k = life / 0.62;
    const alpha = Math.sin(k * Math.PI) * 0.13;
    const x = lerp(-W * 0.4, W * 1.35, k);
    const y = H * (0.22 + i * 0.26);
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.translate(x, y);
    ctx.rotate(-0.42 + i * 0.13);
    const g = ctx.createLinearGradient(-W * 0.55, 0, W * 0.55, 0);
    g.addColorStop(0, "rgba(212,175,104,0)");
    g.addColorStop(0.5, `rgba(240,215,155,${alpha})`);
    g.addColorStop(1, "rgba(212,175,104,0)");
    ctx.fillStyle = g;
    ctx.fillRect(-W * 0.55, -3, W * 1.1, 6);
    ctx.restore();
  }
}

export function drawVignette(ctx: CanvasRenderingContext2D) {
  const g = ctx.createRadialGradient(W / 2, H * 0.46, H * 0.22, W / 2, H * 0.5, H * 0.78);
  g.addColorStop(0, "rgba(0,0,0,0)");
  g.addColorStop(1, "rgba(0,0,0,0.62)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
}

export function drawGrain(ctx: CanvasRenderingContext2D, t: number, amount = 1) {
  const tile = grainTile();
  ctx.save();
  ctx.globalAlpha = 0.055 * amount;
  const ox = -Math.floor(Math.random() * 256);
  const oy = -Math.floor(Math.random() * 256);
  for (let x = ox; x < W; x += 256) for (let y = oy; y < H; y += 256) ctx.drawImage(tile, x, y);
  ctx.restore();
  void t;
}

/** ফেসবুক UI সেফ-জোন দেখানোর গাইড (শুধু preview মোডে) */
export function drawSafeZones(ctx: CanvasRenderingContext2D) {
  ctx.save();
  ctx.strokeStyle = "rgba(80,200,255,0.55)";
  ctx.setLineDash([14, 12]);
  ctx.lineWidth = 3;
  ctx.strokeRect(70, 230, W - 140, H - 230 - 330);
  ctx.setLineDash([]);
  ctx.fillStyle = "rgba(80,200,255,0.75)";
  ctx.font = F.sans(500, 22);
  ctx.textAlign = "left";
  ctx.fillText("SAFE ZONE", 74, 214);
  ctx.restore();
}
