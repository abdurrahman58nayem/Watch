import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: { absolute: "ডাউনলোড | যে নীরবতা আমাদের সন্তানদের ঢেকে রাখে" },
  description: "ভিডিও প্রোডাকশন প্যাক — মাস্টার ফরম্যাট, স্ক্রিপ্ট, ভয়েসওভার ও কোড।",
};

const rows = [
  {
    href: "/downloads/nirobota-video-abdur-rahman.mp4",
    title: "সম্পূর্ণ ভিডিও (MP4) — এক ক্লিকে ডাউনলোড",
    desc: "তৈরি ভিডিও ফাইল। ১০৮০×১৯২০ ভার্টিক্যাল · ২ মিনিট ৪৪ সেকেন্ড · বাংলা ভয়েসওভার সহ। ফেসবুক, হোয়াটসঅ্যাপ বা যেকোনো জায়গায় সরাসরি আপলোড করা যায়",
    size: "৩৪ MB",
    main: true,
  },
  {
    href: "/downloads/nirobota-video-abdur-rahman.html",
    title: "ভিডিও ইঞ্জিন — একটি ফাইল (HTML)",
    desc: "নিজে এডিট করতে চাইলে। ডাবল-ক্লিক করলেই ব্রাউজারে চলবে, সেখান থেকে WebM এক্সপোর্ট করা যায়। ইন্টারনেট বা npm লাগবে না",
    size: "৭৮৯ KB",
  },
  {
    href: "/downloads/nirobota-video-pack-abdur-rahman.zip",
    title: "প্রোডাকশন প্যাক (ZIP)",
    desc: "মাস্টার ফরম্যাট + স্ক্রিপ্ট + তথ্যসূত্র + ৮টি ভয়েসওভার MP3 + সোর্স কোড",
    size: "৫৬৭ KB",
  },
  { href: "/downloads/nirobota-script.md", title: "স্ক্রিপ্ট ও ভয়েসওভার (MD)", desc: "প্রতিটি সিনের ভয়েসওভার + অন-স্ক্রিন টেক্সট", size: "ছোট" },
  { href: "/downloads/nirobota-master-format.md", title: "মাস্টার ফরম্যাট (MD)", desc: "শট-বাই-শট টাইমিং, ভিজ্যুয়াল স্পেসিফিকেশন, মোশন প্রিন্সিপল", size: "ছোট" },
  { href: "/downloads/nirobota-sources.md", title: "তথ্যসূত্র (MD)", desc: "প্রতিটি তথ্যের সূত্র ও যাচাই", size: "ছোট" },
];

const audio = [
  ["vo-01.mp3", "সিন ১ — হুক"],
  ["vo-02a.mp3", "সিন ২ — সংখ্যা (ক)"],
  ["vo-02b.mp3", "সিন ২ — সংখ্যা (খ)"],
  ["vo-03.mp3", "সিন ৩ — ঢাকা"],
  ["vo-04.mp3", "সিন ৪ — আইন"],
  ["vo-05.mp3", "সিন ৫ — ইসলাম কী বলে"],
  ["vo-06.mp3", "সিন ৬ — করণীয়"],
  ["vo-07.mp3", "সিন ৭ — সমাপ্তি"],
] as const;

export default function DownloadsPage() {
  return (
    <div className="min-h-screen w-full bg-[#08090c] px-4 py-10 text-[#eae3d3]">
      <div className="mx-auto max-w-[640px] space-y-8">
        <header className="space-y-2 text-center">
          <p className="text-[11px] uppercase tracking-[0.32em] text-[#d4af68]">প্রোডাকশন প্যাক</p>
          <h1 className="text-2xl font-bold" style={{ fontFamily: '"Noto Serif Bengali", serif' }}>
            যে নীরবতা আমাদের সন্তানদের ঢেকে রাখে
          </h1>
          <p className="text-sm text-[#8b909a]">
            নির্মাণ ও উপস্থাপনা — <span className="text-[#d4af68]">আব্দুর রহমান</span>
          </p>
          <Link href="/video" className="inline-block pt-2 text-sm text-[#d4af68] underline underline-offset-4 hover:text-[#f0d79b]">
            ← ভিডিও প্লেয়ারে ফিরে যান
          </Link>
        </header>

        <div className="space-y-3">
          {rows.map((r) => (
            <a
              key={r.href}
              href={r.href}
              download
              className={`block rounded-xl border p-4 transition hover:border-[#d4af68] ${
                r.main ? "border-[#d4af68]/60 bg-[#d4af68]/10" : "border-white/10 bg-white/[0.03]"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold text-[#eae3d3]">{r.title}</p>
                  <p className="mt-1 text-xs text-[#8b909a]">{r.desc}</p>
                </div>
                <span className="shrink-0 text-xs text-[#d4af68]">{r.size}</span>
              </div>
            </a>
          ))}
        </div>

        <section className="space-y-2">
          <h2 className="text-sm font-semibold text-[#d4af68]">ভয়েসওভার (আলাদাভাবে)</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {audio.map(([file, label]) => (
              <a
                key={file}
                href={`/video/audio/${file}`}
                download
                className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-xs transition hover:border-[#d4af68]"
              >
                <span className="block text-[#eae3d3]">{label}</span>
                <span className="mt-0.5 block text-[#8b909a]">{file}</span>
              </a>
            ))}
          </div>
        </section>

        <p className="pb-6 text-center text-xs leading-relaxed text-[#8b909a]">
          <strong className="text-[#eae3d3]">MP4 ফাইলটি</strong>ই সবচেয়ে সহজ উপায় — ডাউনলোড
          করলেই চালানো যায়, কোনো সেটআপ ছাড়াই। ভিডিওটি ১০৮০×১৯২০ ভার্টিক্যাল (৯:১৬), ফেসবুক
          রিল/স্টোরির জন্য তৈরি, আর শব্দ বন্ধ থাকলেও বোঝা যায় — প্রতিটি মূল কথা স্ক্রিনেই লেখা থাকে।
          <br />
          <br />
          নিজে এডিট করতে চাইলে HTML ফাইলটি নিন — ডাবল-ক্লিক করলেই ব্রাউজারে চলবে, আর সেখান
          থেকেই WebM এক্সপোর্ট করা যাবে।
          <br />
          <br />
          ZIP-এর ভেতরে আছে: ৪টি ডকুমেন্ট, ৮টি MP3, আর ভিডিও ইঞ্জিনের সম্পূর্ণ কোড
          (<code className="text-[#d4af68]">motion.ts</code>,{" "}
          <code className="text-[#d4af68]">scenes.ts</code>,{" "}
          <code className="text-[#d4af68]">VideoClient.tsx</code>)।
        </p>
      </div>
    </div>
  );
}
