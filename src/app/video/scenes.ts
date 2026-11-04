/**
 * scenes.ts — প্রতিটি শটের ভিজ্যুয়াল কম্পোজিশন
 * প্রতিটি draw() পায় normalized local time (0..1) আর absolute time (সেকেন্ড)
 */
import {
  W, H, C, F, bn,
  lerp, prog, easeOutExpo, easeOutQuint, easeInOutCubic, smoothstep, pop,
  drawWrapped, drawStaggered, goldRule, roundRect, card,
  iconShield, iconLock, iconBuilding, iconScale, iconPhone, iconDoc, iconWalk,
  checkMark, ornament,
} from "./motion";

export interface Seg {
  id: string;
  /** ফিক্সড সেকেন্ড; না দিলে VO ক্লিপের দৈর্ঘ্য থেকে হিসাব হবে */
  fixed?: number;
  vo?: string | string[];
  draw: (ctx: CanvasRenderingContext2D, p: number, t: number, lt: number) => void;
}

const MX = 96;          // horizontal margin
const CW = W - MX * 2;  // content width
const TOP = 300;        // safe zone top (ফেসবুক UI সেফ জোন)

/** সিনের ভেতরে একাধিক ব্লক stagger করার হেল্পার */
const st = (i: number, gap = 0.1) => i * gap;

/* =========================================================
   সিন ০ — কোল্ড ওপেন
   ========================================================= */
const s0: Seg = {
  id: "cold-open",
  fixed: 7.5,
  draw: (ctx, p, t) => {
    // শিশু হেঁটে যাচ্ছে — ধীর, নিঃশব্দ
    const walk = easeInOutCubic(prog(p, 0.02, 0.78));
    const x = lerp(W * 0.28, W * 0.72, walk);
    const alpha = smoothstep(prog(p, 0.02, 0.14)) * (1 - smoothstep(prog(p, 0.7, 0.84)));
    iconWalk(ctx, x, H * 0.4, 52, t * 5.5, alpha * 0.95);

    // ছায়া
    ctx.save();
    ctx.globalAlpha = alpha * 0.35;
    ctx.beginPath();
    ctx.ellipse(x, H * 0.4 + 60, 46, 9, 0, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(0,0,0,0.9)";
    ctx.fill();
    ctx.restore();

    // টাইটেল
    const tp = prog(p, 0.3, 1);
    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";
    ctx.font = F.serif(700, 104);
    drawStaggered(ctx, "যে নীরবতা", W / 2, H * 0.545, {
      maxWidth: CW, t: tp, dur: 0.55, stagger: 0.1,
      color: C.ink, glow: 26, lh: 1.2, align: "center",
    });
    ctx.font = F.serif(700, 104);
    const tp2 = prog(p, 0.44, 1);
    drawStaggered(ctx, "আমাদের সন্তানদের", W / 2, H * 0.545 + 130, {
      maxWidth: CW, t: tp2, dur: 0.55, stagger: 0.1,
      color: C.ink, glow: 26, lh: 1.2, align: "center",
    });
    ctx.font = F.serif(700, 104);
    const tp3 = prog(p, 0.58, 1);
    drawStaggered(ctx, "ঢেকে রাখে", W / 2, H * 0.545 + 260, {
      maxWidth: CW, t: tp3, dur: 0.55, stagger: 0.1,
      color: C.gold, glow: 34, lh: 1.2, align: "center",
    });

    goldRule(ctx, W / 2, H * 0.545 + 370, 520, prog(p, 0.7, 1));
    ctx.font = F.sans(500, 38);
    ctx.fillStyle = C.dim;
    ctx.globalAlpha = smoothstep(prog(p, 0.78, 1));
    ctx.fillText("শিশু নিরাপত্তা · বাংলাদেশ", W / 2, H * 0.545 + 440);
    ctx.globalAlpha = 1;
  },
};

/* =========================================================
   সিন ১ — হুক
   ========================================================= */
const s1: Seg = {
  id: "hook",
  vo: ["vo-01.mp3"],
  draw: (ctx, p) => {
    ctx.textAlign = "center";

    // বড় প্রশ্নচিহ্ন — লাইন-ড্রয়িং ভাব
    const qp = easeOutExpo(prog(p, 0, 0.2));
    ctx.save();
    ctx.globalAlpha = qp * 0.5;
    ctx.font = F.serif(700, 460);
    ctx.fillStyle = "rgba(212,175,104,0.16)";
    ctx.textBaseline = "alphabetic";
    ctx.translate(W / 2, TOP + 470);
    ctx.scale(0.9 + 0.1 * qp, 0.9 + 0.1 * qp);
    ctx.fillText("?", 0, 0);
    ctx.restore();

    ctx.textBaseline = "top";
    ctx.font = F.serif(600, 84);
    drawStaggered(ctx, "একটা শিশু ভোরবেলা", W / 2, TOP + 40, {
      maxWidth: CW, t: p, dur: 0.4, stagger: 0.09, color: C.ink, lh: 1.35,
    });
    ctx.font = F.serif(600, 84);
    drawStaggered(ctx, "ঘর থেকে বের হয়।", W / 2, TOP + 40 + 116, {
      maxWidth: CW, t: prog(p, 0.1, 1), dur: 0.4, stagger: 0.09, color: C.ink, lh: 1.35,
    });

    goldRule(ctx, W / 2, TOP + 330, 460, prog(p, 0.28, 0.5));

    ctx.font = F.sans(500, 54);
    drawStaggered(ctx, "ফিরে আসে চুপ করে।", W / 2, TOP + 390, {
      maxWidth: CW, t: prog(p, 0.34, 1), dur: 0.4, stagger: 0.09, color: C.dim, lh: 1.4,
    });

    // "অনেক প্রশ্নের উত্তর সে কাউকে বলে না।"
    const cp = prog(p, 0.56, 1);
    const y0 = TOP + 560;
    card(ctx, MX, y0, CW, 330, cp, { fill: "rgba(201,85,74,0.07)", line: "rgba(201,85,74,0.3)" });
    ctx.font = F.serif(600, 66);
    drawStaggered(ctx, "অনেক প্রশ্নের উত্তর", W / 2, y0 + 62, {
      maxWidth: CW - 120, t: prog(p, 0.6, 1), dur: 0.4, stagger: 0.08, color: C.ink, lh: 1.3,
    });
    ctx.font = F.serif(600, 66);
    drawStaggered(ctx, "সে কাউকে বলে না।", W / 2, y0 + 62 + 92, {
      maxWidth: CW - 120, t: prog(p, 0.7, 1), dur: 0.4, stagger: 0.08, color: "#e8a49c", lh: 1.3,
    });

    ctx.font = F.sans(600, 46);
    ctx.fillStyle = C.gold;
    ctx.globalAlpha = smoothstep(prog(p, 0.86, 1));
    ctx.fillText("আজ আমরা সেই নীরবতা নিয়েই কথা বলব", W / 2, y0 + 430);
    ctx.globalAlpha = 1;
  },
};

/* =========================================================
   সিন ২ — সংখ্যা
   ========================================================= */
function statBlock(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number,
  value: number, label: string, sub: string,
  p: number, accent: string
) {
  card(ctx, x, y, w, h, p);
  const e = easeOutQuint(p);
  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  ctx.font = F.num(700, 132);
  ctx.fillStyle = accent;
  ctx.shadowColor = accent;
  ctx.shadowBlur = 30 * e;
  ctx.globalAlpha = Math.min(1, p * 2);
  ctx.fillText(bn(Math.round(value * e)), x + w / 2, y + 150);
  ctx.shadowBlur = 0;
  ctx.textBaseline = "top";
  ctx.font = F.sans(600, 44);
  ctx.fillStyle = C.ink;
  ctx.fillText(label, x + w / 2, y + 186);
  ctx.font = F.sans(400, 32);
  ctx.fillStyle = C.dim;
  drawWrapped(ctx, sub, x + w / 2, y + 244, { maxWidth: w - 60, color: C.dim, lh: 1.3 });
  ctx.restore();
}

const s2: Seg = {
  id: "numbers",
  vo: ["vo-02a.mp3", "vo-02b.mp3"],
  draw: (ctx, p) => {
    ctx.textAlign = "center";
    ctx.textBaseline = "top";

    ctx.font = F.sans(600, 40);
    ctx.fillStyle = C.gold;
    ctx.globalAlpha = smoothstep(prog(p, 0, 0.08));
    ctx.fillText("জানুয়ারি — সেপ্টেম্বর ২০২৬", W / 2, TOP - 10);
    ctx.globalAlpha = 1;
    goldRule(ctx, W / 2, TOP + 62, 620, prog(p, 0.02, 0.12));

    ctx.font = F.serif(600, 58);
    drawStaggered(ctx, "মাদ্রাসায় শিশু নির্যাতন", W / 2, TOP + 100, {
      maxWidth: CW, t: prog(p, 0.04, 1), dur: 0.35, stagger: 0.08, color: C.ink,
    });

    const bw = (CW - 40) / 2;
    statBlock(ctx, MX, TOP + 200, bw, 330, 72, "ঘটনা", "শুধু মাদ্রাসাতেই", prog(p, 0.14, 0.34), C.gold);
    statBlock(ctx, MX + bw + 40, TOP + 200, bw, 330, 109, "শিশু ক্ষতিগ্রস্ত", "কমপক্ষে", prog(p, 0.2, 0.4), "#e8a49c");

    goldRule(ctx, W / 2, TOP + 590, 780, prog(p, 0.3, 0.42));

    ctx.font = F.serif(600, 54);
    drawStaggered(ctx, "সারাদেশে, ছেলে শিশুদের ওপর", W / 2, TOP + 630, {
      maxWidth: CW, t: prog(p, 0.34, 1), dur: 0.35, stagger: 0.08, color: C.ink,
    });

    statBlock(ctx, MX + CW / 2 - bw / 2, TOP + 700, bw, 330, 171, "শিশু", "১৩১টি ঘটনায়", prog(p, 0.4, 0.6), C.gold);

    // ফুটার
    const fp = prog(p, 0.56, 1);
    roundRect(ctx, MX, TOP + 1070, CW, 130, 22);
    ctx.fillStyle = "rgba(255,255,255,0.03)";
    ctx.globalAlpha = smoothstep(fp);
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.font = F.sans(500, 40);
    drawStaggered(ctx, "এগুলো শুধু খবরের কাগজে আসা ঘটনা।", W / 2, TOP + 1105, {
      maxWidth: CW - 100, t: prog(p, 0.6, 1), dur: 0.35, stagger: 0.08, color: C.dim,
    });
    ctx.font = F.sans(400, 28);
    ctx.globalAlpha = smoothstep(prog(p, 0.7, 1));
    ctx.fillStyle = "rgba(139,144,154,0.8)";
    ctx.fillText("সূত্র: JusticeMakers Bangladesh in France (JMBF)", W / 2, TOP + 1215);
    ctx.globalAlpha = 1;
  },
};

/* =========================================================
   সিন ৩ — ঢাকা
   ========================================================= */
const coverSteps = [
  { icon: iconLock, title: "মিথ্যা আশ্বাস", sub: "শিশুকে ভয় দেখানো, লোভ দেখানো" },
  { icon: iconBuilding, title: "প্রতিষ্ঠানের চাপ", sub: "ভাবমর্যাদার নামে চুপ করানো" },
  { icon: iconShield, title: "আইনে বাধা", sub: "পুলিশ অভিযুক্ত নিতে গেলেও" },
];

const s3: Seg = {
  id: "coverup",
  vo: ["vo-03.mp3"],
  draw: (ctx, p) => {
    ctx.textAlign = "center";
    ctx.textBaseline = "top";

    ctx.font = F.sans(600, 40);
    ctx.fillStyle = "#e8a49c";
    ctx.globalAlpha = smoothstep(prog(p, 0, 0.07));
    ctx.fillText("অপরাধ একা হয় না", W / 2, TOP - 10);
    ctx.globalAlpha = 1;

    ctx.font = F.serif(700, 88);
    drawStaggered(ctx, "তারপর শুরু হয় ঢাকা", W / 2, TOP + 60, {
      maxWidth: CW, t: prog(p, 0.02, 1), dur: 0.35, stagger: 0.09, color: C.ink, glow: 20,
    });

    coverSteps.forEach((s, i) => {
      const cp = prog(p, 0.14 + st(i, 0.16), 0.34 + st(i, 0.16));
      const y = TOP + 240 + i * 240;
      card(ctx, MX, y, CW, 210, cp);
      s.icon(ctx, MX + 118, y + 105, 54, cp);
      ctx.save();
      ctx.globalAlpha = Math.min(1, cp * 1.8);
      ctx.textAlign = "left";
      ctx.font = F.serif(600, 56);
      ctx.fillStyle = C.ink;
      ctx.fillText(`${bn(i + 1)}. ${s.title}`, MX + 210, y + 58);
      ctx.font = F.sans(400, 36);
      ctx.fillStyle = C.dim;
      ctx.fillText(s.sub, MX + 210, y + 130);
      ctx.restore();
    });

    const y0 = TOP + 960;
    goldRule(ctx, W / 2, y0, 700, prog(p, 0.66, 0.78));
    ctx.font = F.serif(700, 56);
    drawStaggered(ctx, "শিশু নয় —", W / 2, y0 + 50, {
      maxWidth: CW, t: prog(p, 0.7, 1), dur: 0.3, stagger: 0.08, color: C.ink,
    });
    ctx.font = F.serif(700, 56);
    drawStaggered(ctx, "তখন রক্ষা করা হয় প্রতিষ্ঠানকে।", W / 2, y0 + 50 + 92, {
      maxWidth: CW, t: prog(p, 0.78, 1), dur: 0.3, stagger: 0.08, color: "#e8a49c", glow: 18,
    });
    ctx.font = F.sans(400, 28);
    ctx.textAlign = "center";
    ctx.globalAlpha = smoothstep(prog(p, 0.88, 1));
    ctx.fillStyle = "rgba(139,144,154,0.8)";
    ctx.fillText("সূত্র: আইন ও সালিশ কেন্দ্র / New Age — গাজীপুর, গাছা", W / 2, y0 + 250);
    ctx.globalAlpha = 1;
  },
};

/* =========================================================
   সিন ৪ — আইন
   ========================================================= */
const lawRows = [
  { k: "ধারা ৯", v: "নারী ও শিশু নির্যাতন দমন আইন ২০০০", p: "শিশু ধর্ষণে সর্বোচ্চ শাস্তি মৃত্যুদণ্ড, অথবা যাবজ্জীবন কারাদণ্ড" },
  { k: "২০২০", v: "সংশোধনী", p: "সব ধরনের ধর্ষণে সর্বোচ্চ শাস্তি হিসেবে মৃত্যুদণ্ড যুক্ত" },
  { k: "সময়সীমা", v: "২০২৫ সংশোধনী", p: "তদন্ত ১৫ দিন, বিচার ৯০ দিনের মধ্যে সম্পন্ন" },
];

const s4: Seg = {
  id: "law",
  vo: ["vo-04.mp3"],
  draw: (ctx, p) => {
    ctx.textAlign = "center";
    ctx.textBaseline = "top";

    iconDoc(ctx, W / 2, TOP + 70, 62, prog(p, 0, 0.14));

    ctx.font = F.sans(600, 40);
    ctx.fillStyle = C.gold;
    ctx.globalAlpha = smoothstep(prog(p, 0.04, 0.12));
    ctx.fillText("আইন কী বলে", W / 2, TOP + 170);
    ctx.globalAlpha = 1;

    ctx.font = F.serif(700, 84);
    drawStaggered(ctx, "জেনে রাখুন", W / 2, TOP + 235, {
      maxWidth: CW, t: prog(p, 0.06, 1), dur: 0.35, stagger: 0.09, color: C.ink, glow: 22,
    });

    lawRows.forEach((r, i) => {
      const rp = prog(p, 0.18 + st(i, 0.17), 0.4 + st(i, 0.17));
      const y = TOP + 400 + i * 250;
      // বাম দিক থেকে স্লাইড-ইন
      const off = (1 - easeOutExpo(rp)) * 90;
      ctx.save();
      ctx.globalAlpha = Math.min(1, rp * 1.7);
      ctx.translate(-off, 0);
      roundRect(ctx, MX, y, CW, 215, 24);
      ctx.fillStyle = C.cardBg;
      ctx.fill();
      ctx.strokeStyle = C.cardLine;
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = C.gold;
      ctx.fillRect(MX, y + 22, 6, 171);
      ctx.textAlign = "left";
      ctx.font = F.sans(700, 46);
      ctx.fillText(r.k, MX + 44, y + 46);
      ctx.font = F.sans(400, 32);
      ctx.fillStyle = C.dim;
      ctx.fillText(r.v, MX + 44, y + 104);
      ctx.font = F.serif(500, 40);
      ctx.fillStyle = C.ink;
      drawWrapped(ctx, r.p, MX + 44, y + 150, {
        maxWidth: CW - 90, align: "left", color: C.ink, lh: 1.28,
      });
      ctx.restore();
    });

    ctx.font = F.sans(400, 28);
    ctx.textAlign = "center";
    ctx.globalAlpha = smoothstep(prog(p, 0.78, 1));
    ctx.fillStyle = "rgba(139,144,154,0.8)";
    ctx.fillText("সূত্র: দণ্ডবিধি ১৮৬০ · নারী ও শিশু নির্যাতন দমন আইন ২০০০", W / 2, TOP + 1180);
    ctx.globalAlpha = 1;
  },
};

/* =========================================================
   সিন ৫ — ইসলাম কী বলে
   ========================================================= */
const s5: Seg = {
  id: "islam",
  vo: ["vo-05.mp3"],
  draw: (ctx, p, t) => {
    ctx.textAlign = "center";
    ctx.textBaseline = "top";

    ornament(ctx, W / 2, TOP + 80, 78, prog(p, 0, 0.16), t * 0.06);

    ctx.font = F.sans(600, 40);
    ctx.fillStyle = C.gold;
    ctx.globalAlpha = smoothstep(prog(p, 0.04, 0.12));
    ctx.fillText("ইসলাম কী বলে", W / 2, TOP + 200);
    ctx.globalAlpha = 1;

    // মূল দাবি
    const c1 = prog(p, 0.08, 0.26);
    card(ctx, MX, TOP + 240, CW, 280, c1, { fill: "rgba(212,175,104,0.06)", line: "rgba(212,175,104,0.35)" });
    ctx.font = F.serif(700, 70);
    drawStaggered(ctx, "ধর্ষণের শিকার শিশুর", W / 2, TOP + 290, {
      maxWidth: CW - 120, t: prog(p, 0.1, 1), dur: 0.3, stagger: 0.08, color: C.ink,
    });
    ctx.font = F.serif(700, 70);
    drawStaggered(ctx, "ওপর কোনো দোষ নেই", W / 2, TOP + 290 + 92, {
      maxWidth: CW - 120, t: prog(p, 0.16, 1), dur: 0.3, stagger: 0.08, color: C.gold, glow: 26,
    });

    iconScale(ctx, W / 2, TOP + 600, 62, prog(p, 0.24, 0.4));
    ctx.font = F.sans(500, 40);
    drawStaggered(ctx, "চার মাযহাবের ফকিহদের অবস্থান এক —", W / 2, TOP + 680, {
      maxWidth: CW, t: prog(p, 0.28, 1), dur: 0.3, stagger: 0.08, color: C.ink,
    });
    ctx.font = F.sans(500, 40);
    drawStaggered(ctx, "যাকে জোর করা হয়েছে, তার ওপর হদ্দ শাস্তি নেই", W / 2, TOP + 738, {
      maxWidth: CW, t: prog(p, 0.33, 1), dur: 0.3, stagger: 0.08, color: C.ink,
    });

    goldRule(ctx, W / 2, TOP + 810, 760, prog(p, 0.38, 0.48));

    // কুরআনের নির্দেশ
    ctx.font = F.sans(600, 38);
    ctx.globalAlpha = smoothstep(prog(p, 0.42, 0.5));
    ctx.fillStyle = C.gold;
    ctx.fillText("কুরআনের নির্দেশ", W / 2, TOP + 850);
    ctx.globalAlpha = 1;

    ctx.font = F.serif(600, 58);
    drawStaggered(ctx, "সাক্ষ্য গোপন করো না —", W / 2, TOP + 915, {
      maxWidth: CW, t: prog(p, 0.45, 1), dur: 0.3, stagger: 0.08, color: C.ink, glow: 16,
    });
    ctx.font = F.serif(500, 40);
    drawStaggered(ctx, "যে গোপন করে, তার অন্তর গোনাহগার  ·  ২:২৮৩", W / 2, TOP + 992, {
      maxWidth: CW, t: prog(p, 0.52, 1), dur: 0.3, stagger: 0.08, color: C.dim,
    });

    ctx.font = F.serif(600, 58);
    drawStaggered(ctx, "ন্যায়বিচার দাঁড়া করাও —", W / 2, TOP + 1072, {
      maxWidth: CW, t: prog(p, 0.6, 1), dur: 0.3, stagger: 0.08, color: C.ink, glow: 16,
    });
    ctx.font = F.serif(500, 40);
    drawStaggered(ctx, "যাদের প্রতি ঘৃণা আছে, তাদের বেলায়ও  ·  ৫:৮", W / 2, TOP + 1149, {
      maxWidth: CW, t: prog(p, 0.66, 1), dur: 0.3, stagger: 0.08, color: C.dim,
    });
  },
};

/* =========================================================
   সিন ৬ — করণীয়
   ========================================================= */
const actions = ["শিশুর কথা বিশ্বাস করুন", "১০৯৮ নম্বরে ফোন করুন", "প্রতিষ্ঠানে নিরাপদ অভিযোগ ব্যবস্থা দাবি করুন"];

const s6: Seg = {
  id: "action",
  vo: ["vo-06.mp3"],
  draw: (ctx, p, t) => {
    ctx.textAlign = "center";
    ctx.textBaseline = "top";

    ctx.font = F.serif(700, 88);
    drawStaggered(ctx, "তাহলে করণীয় কী?", W / 2, TOP, {
      maxWidth: CW, t: prog(p, 0, 1), dur: 0.35, stagger: 0.09, color: C.ink, glow: 22,
    });

    actions.forEach((a, i) => {
      const ap = prog(p, 0.12 + st(i, 0.13), 0.32 + st(i, 0.13));
      const y = TOP + 180 + i * 175;
      card(ctx, MX, y, CW, 145, ap);
      checkMark(ctx, MX + 92, y + 73, 40, prog(p, 0.2 + st(i, 0.13), 0.4 + st(i, 0.13)));
      ctx.save();
      ctx.globalAlpha = Math.min(1, ap * 1.8);
      ctx.textAlign = "left";
      ctx.font = F.sans(500, 46);
      ctx.fillStyle = C.ink;
      drawWrapped(ctx, a, MX + 160, y + 50, { maxWidth: CW - 220, align: "left", color: C.ink, lh: 1.2 });
      ctx.restore();
    });

    // হেল্পলাইন হিরো
    const hp = prog(p, 0.5, 0.72);
    const cy = TOP + 900;
    const s = pop(hp);
    ctx.save();
    ctx.globalAlpha = Math.min(1, hp * 1.6);
    ctx.translate(W / 2, cy);
    ctx.scale(s, s);
    // পালসিং রিং
    for (let i = 0; i < 3; i++) {
      const ph = (t * 0.55 + i * 0.33) % 1;
      ctx.beginPath();
      ctx.arc(0, 0, lerp(150, 330, ph), 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(212,175,104,${(1 - ph) * 0.35})`;
      ctx.lineWidth = 3;
      ctx.stroke();
    }
    roundRect(ctx, -320, -140, 640, 280, 40);
    ctx.fillStyle = "rgba(212,175,104,0.1)";
    ctx.fill();
    ctx.strokeStyle = "rgba(240,215,155,0.55)";
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";
    ctx.font = F.num(700, 170);
    ctx.fillStyle = C.goldBright;
    ctx.shadowColor = "rgba(240,215,155,0.75)";
    ctx.shadowBlur = 40;
    ctx.fillText("১০৯৮", 0, 62);
    ctx.restore();

    ctx.textBaseline = "top";
    ctx.font = F.sans(500, 36);
    drawStaggered(ctx, "শিশু হেল্পলাইন · টোল ফ্রি · সারাদেশে · ২৪ ঘণ্টা", W / 2, cy + 190, {
      maxWidth: CW, t: prog(p, 0.72, 1), dur: 0.3, stagger: 0.08, color: C.ink,
    });
    iconPhone(ctx, W / 2 - 330, cy, 46, prog(p, 0.6, 0.8));
    iconPhone(ctx, W / 2 + 330, cy, 46, prog(p, 0.6, 0.8));
  },
};

/* =========================================================
   সিন ৭ — সমাপ্তি
   ========================================================= */
const s7: Seg = {
  id: "closing",
  vo: ["vo-07.mp3"],
  draw: (ctx, p) => {
    ctx.textAlign = "center";
    ctx.textBaseline = "top";

    ctx.font = F.serif(600, 68);
    drawStaggered(ctx, "নীরব থাকা মানে", W / 2, H * 0.34, {
      maxWidth: CW, t: prog(p, 0, 1), dur: 0.35, stagger: 0.09, color: C.dim,
    });
    ctx.font = F.serif(600, 68);
    drawStaggered(ctx, "এই ব্যবস্থার পক্ষে থাকা।", W / 2, H * 0.34 + 96, {
      maxWidth: CW, t: prog(p, 0.1, 1), dur: 0.35, stagger: 0.09, color: "#e8a49c", glow: 20,
    });

    goldRule(ctx, W / 2, H * 0.34 + 250, 620, prog(p, 0.3, 0.45));

    ctx.font = F.serif(700, 82);
    drawStaggered(ctx, "প্রতিটি শিশুর নিরাপদ", W / 2, H * 0.34 + 320, {
      maxWidth: CW, t: prog(p, 0.36, 1), dur: 0.35, stagger: 0.09, color: C.ink,
    });
    ctx.font = F.serif(700, 82);
    drawStaggered(ctx, "বেড়ে ওঠার অধিকার আছে", W / 2, H * 0.34 + 320 + 112, {
      maxWidth: CW, t: prog(p, 0.46, 1), dur: 0.35, stagger: 0.09, color: C.ink,
    });

    iconShield(ctx, W / 2, H * 0.34 + 690, 84, prog(p, 0.56, 0.8));
    ctx.font = F.serif(600, 58);
    ctx.globalAlpha = smoothstep(prog(p, 0.7, 1));
    ctx.fillStyle = C.gold;
    ctx.fillText("আসুন, সেই অধিকার রক্ষা করি", W / 2, H * 0.34 + 830);
    ctx.globalAlpha = 1;
  },
};

/* =========================================================
   সিন ৮ — ক্রেডিট
   ========================================================= */
const s8: Seg = {
  id: "credits",
  fixed: 13,
  draw: (ctx, p, t) => {
    ctx.textAlign = "center";
    ctx.textBaseline = "top";

    ornament(ctx, W / 2, H * 0.32, 96, prog(p, 0, 0.2), -t * 0.05);

    ctx.font = F.sans(500, 40);
    ctx.globalAlpha = smoothstep(prog(p, 0.08, 0.2));
    ctx.fillStyle = C.dim;
    ctx.fillText("নির্মাণ ও উপস্থাপনা", W / 2, H * 0.42);
    ctx.globalAlpha = 1;

    goldRule(ctx, W / 2, H * 0.455, 480, prog(p, 0.14, 0.28));

    // নাম — shimmer সহ
    const np = easeOutExpo(prog(p, 0.18, 0.4));
    ctx.save();
    ctx.globalAlpha = np;
    ctx.textBaseline = "alphabetic";
    ctx.font = F.serif(700, 130);
    const shimmer = ctx.createLinearGradient(W / 2 - 380, 0, W / 2 + 380, 0);
    const k = (Math.sin(t * 1.1) + 1) / 2;
    shimmer.addColorStop(0, C.goldDeep);
    shimmer.addColorStop(Math.max(0.05, Math.min(0.95, k)), C.goldBright);
    shimmer.addColorStop(1, C.goldDeep);
    ctx.fillStyle = shimmer;
    ctx.shadowColor = "rgba(240,215,155,0.45)";
    ctx.shadowBlur = 34;
    ctx.fillText("আব্দুর রহমান", W / 2, H * 0.545);
    ctx.restore();

    ctx.textBaseline = "top";
    goldRule(ctx, W / 2, H * 0.578, 480, prog(p, 0.3, 0.44));

    ctx.font = F.sans(400, 36);
    ctx.globalAlpha = smoothstep(prog(p, 0.36, 0.52));
    ctx.fillStyle = C.dim;
    ctx.fillText("সহযোগিতায় — Arena.ai", W / 2, H * 0.60);
    ctx.globalAlpha = 1;

    ctx.font = F.sans(400, 30);
    ctx.globalAlpha = smoothstep(prog(p, 0.46, 0.62));
    ctx.fillStyle = "rgba(139,144,154,0.7)";
    ctx.fillText("তথ্যসূত্র: ASK · New Age · JMBF · Daily Asian Age", W / 2, H * 0.655);
    ctx.globalAlpha = 1;

    // শেয়ার প্রম্পট
    const sp = prog(p, 0.58, 0.78);
    card(ctx, W / 2 - 340, H * 0.7, 680, 170, sp, { fill: "rgba(212,175,104,0.08)", line: "rgba(212,175,104,0.3)" });
    ctx.font = F.sans(600, 44);
    ctx.globalAlpha = Math.min(1, sp * 1.7);
    ctx.fillStyle = C.ink;
    ctx.fillText("ভিডিওটি শেয়ার করুন", W / 2, H * 0.7 + 44);
    ctx.font = F.sans(400, 32);
    ctx.fillStyle = C.gold;
    ctx.fillText("জানলে শিশু সুরক্ষিত থাকে", W / 2, H * 0.7 + 108);
    ctx.globalAlpha = 1;
  },
};

export const SEGMENTS: Seg[] = [s0, s1, s2, s3, s4, s5, s6, s7, s8];
