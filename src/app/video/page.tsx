import type { Metadata } from "next";
import "./video.css";
import VideoClient from "./VideoClient";

export const metadata: Metadata = {
  title: { absolute: "যে নীরবতা আমাদের সন্তানদের ঢেকে রাখে | আব্দুর রহমান" },
  description:
    "শিশু যৌন নির্যাতন ও ধামাচাপা নিয়ে বাংলা মোশন গ্রাফিক্স ভিডিও। নির্মাণ ও উপস্থাপনা — আব্দুর রহমান। তথ্যসূত্র: আইন ও সালিশ কেন্দ্র, New Age, JMBF, Daily Asian Age।",
  keywords: [
    "শিশু নিরাপত্তা",
    "শিশু নির্যাতন",
    "মাদ্রাসা",
    "বাংলাদেশ",
    "শিশু হেল্পলাইন ১০৯৮",
    "আব্দুর রহমান",
  ],
  authors: [{ name: "আব্দুর রহমান" }],
  openGraph: {
    title: "যে নীরবতা আমাদের সন্তানদের ঢেকে রাখে",
    description:
      "শিশু যৌন নির্যাতন ও ধামাচাপা — আইন, পরিসংখ্যান ও ইসলামের নীতি দিয়ে দেখা। নির্মাণ: আব্দুর রহমান।",
    type: "video.other",
    locale: "bn_BD",
  },
  twitter: {
    card: "summary_large_image",
    title: "যে নীরবতা আমাদের সন্তানদের ঢেকে রাখে",
    description:
      "শিশু যৌন নির্যাতন ও ধামাচাপা — আইন, পরিসংখ্যান ও ইসলামের নীতি দিয়ে দেখা। নির্মাণ: আব্দুর রহমান।",
  },
};

export default function VideoPage() {
  return <VideoClient />;
}
