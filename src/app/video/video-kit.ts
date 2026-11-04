/**
 * video-kit.ts — স্ট্যান্ডঅ্যালোন HTML বিল্ডের এন্ট্রি পয়েন্ট।
 * motion.ts + scenes.ts কে esbuild দিয়ে একটি IIFE বান্ডলে রূপান্তর করা হয়,
 * যা tools/build-standalone.mjs একটি সেল্ফ-কনটেইনড HTML ফাইলে এমবেড করে।
 */
export * from "./motion";
export { SEGMENTS } from "./scenes";
