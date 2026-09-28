/**
 * Generates every web-ready logo asset from the original files in /brand-source.
 * Run: node scripts/brand-assets.mjs
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const src = (f) => `brand-source/${f}`;
const out = (f) => `public/brand/${f}`;
const BLACK = { r: 0, g: 0, b: 0, alpha: 1 };

await mkdir("public/brand", { recursive: true });

/** Row ranges containing visible (non-transparent) pixels. */
async function bands(file) {
  const { data, info } = await sharp(src(file)).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const rows = [];
  for (let y = 0; y < info.height; y++) {
    let visible = false;
    for (let x = 0; x < info.width && !visible; x++) {
      if (data[(y * info.width + x) * 4 + 3] > 16) visible = true;
    }
    rows.push(visible);
  }
  const result = [];
  let start = -1;
  rows.forEach((v, y) => {
    if (v && start < 0) start = y;
    if (!v && start >= 0) {
      result.push([start, y]);
      start = -1;
    }
  });
  if (start >= 0) result.push([start, rows.length]);
  return { bands: result.filter(([a, b]) => b - a > 8), width: info.width };
}

/** Crop the text block (everything below the icon) of a stacked logo. */
async function wordmark(file, name) {
  const { bands: b, width } = await bands(file);
  const top = b[1][0];
  const bottom = b[b.length - 1][1];
  // Extract and trim in separate passes — sharp rejects them in one pipeline.
  const block = await sharp(src(file)).extract({ left: 0, top, width, height: bottom - top }).png().toBuffer();
  const trimmed = await sharp(block).trim().toBuffer();
  await sharp(trimmed).resize({ width: 960 }).png().toFile(out(name));
}

// Stacked lockups (icon over wordmark)
await sharp(src("logo-stacked-white-text.webp")).trim().resize({ width: 800 }).png().toFile(out("logo-stacked-white.png"));
await sharp(src("logo-stacked-dark-text.webp")).trim().resize({ width: 800 }).png().toFile(out("logo-stacked-black.png"));

// Mark (icon only) + text-only wordmarks for the horizontal nav lockup
await sharp(src("logo-mark.webp")).trim().resize({ height: 256 }).png().toFile(out("logo-mark.png"));
await wordmark("logo-stacked-white-text.webp", "wordmark-white.png");
await wordmark("logo-stacked-dark-text.webp", "wordmark-black.png");

// Favicons (square, padded)
const mark = await sharp(src("logo-mark.webp")).trim().toBuffer();
async function squareIcon(size, file, background) {
  const inner = Math.round(size * 0.84);
  const icon = await sharp(mark).resize({ width: inner, height: inner, fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).toBuffer();
  await sharp({ create: { width: size, height: size, channels: 4, background } })
    .composite([{ input: icon, gravity: "center" }])
    .png()
    .toFile(file);
}
await squareIcon(512, "src/app/icon.png", { r: 0, g: 0, b: 0, alpha: 0 });
await squareIcon(180, "src/app/apple-icon.png", BLACK);

// Open Graph image: stacked white logo centered on the black stage
const og = await sharp(src("logo-stacked-white-text.webp")).trim().resize({ height: 380 }).toBuffer();
await sharp({ create: { width: 1200, height: 630, channels: 4, background: BLACK } })
  .composite([{ input: og, gravity: "center" }])
  .png()
  // Under [lang] so it resolves against the layout's metadataBase.
  .toFile("src/app/[lang]/opengraph-image.png");

console.log("Brand assets generated.");
