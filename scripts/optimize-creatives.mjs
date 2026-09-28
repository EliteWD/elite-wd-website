/**
 * Converts the Higgsfield originals in /creative-source into web-ready JPEGs in
 * /public/images (max 2400px wide). next/image then serves responsive AVIF/WebP.
 * Run: node scripts/optimize-creatives.mjs
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const images = [
  "master-d",
  "storm-interior",
  "window-product",
  "door-open",
  "glass-macro",
  "lock-detail",
  "install-hands",
  "aerial-cape-coral",
  "front-elevation",
];

await mkdir("public/images", { recursive: true });
for (const name of images) {
  const out = name === "master-d" ? "home-exterior" : name;
  const info = await sharp(`creative-source/${name}.png`)
    .resize({ width: 2400, withoutEnlargement: true })
    .jpeg({ quality: 84, mozjpeg: true, progressive: true })
    .toFile(`public/images/${out}.jpg`);
  console.log(`${out}.jpg  ${info.width}x${info.height}  ${Math.round(info.size / 1024)} KB`);
}

// Hero poster = the video's own first frame, so playback starts without a jump.
const poster = await sharp("creative-source/hero-first-frame.jpg")
  .jpeg({ quality: 86, mozjpeg: true, progressive: true })
  .toFile("public/images/hero-poster.jpg");
console.log(`hero-poster.jpg  ${poster.width}x${poster.height}`);
