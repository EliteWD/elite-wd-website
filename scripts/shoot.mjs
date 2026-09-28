/**
 * Headless screenshots for visual QA.
 * Usage: node scripts/shoot.mjs <url> <outDir> <width> <height> [selector|scrollY ...]
 * Each extra argument is a CSS selector (scrolled into view) or a scrollY number.
 */
import puppeteer from "puppeteer-core";
import { mkdir } from "node:fs/promises";

const [url, outDir = "qa", w = "1280", h = "800", ...targets] = process.argv.slice(2);
const executablePath =
  process.env.CHROME_PATH || "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

await mkdir(outDir, { recursive: true });
const browser = await puppeteer.launch({ executablePath, headless: true });
const page = await browser.newPage();
await page.setViewport({ width: Number(w), height: Number(h), deviceScaleFactor: 1 });
// MOTION=1 keeps animations/video on; default is reduced motion for stable stills.
if (!process.env.MOTION) {
  await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
}
const errors = [];
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
page.on("pageerror", (e) => errors.push(e.message));
await page.goto(url, { waitUntil: "networkidle0" });
await page.evaluate(() => document.fonts.ready);

const shots = targets.length ? targets : ["0"];
for (const [i, t] of shots.entries()) {
  if (/^\d+$/.test(t)) {
    await page.evaluate((y) => window.scrollTo(0, y), Number(t));
  } else {
    await page.evaluate((sel) => document.querySelector(sel)?.scrollIntoView({ block: "start" }), t);
  }
  await new Promise((r) => setTimeout(r, 250));
  const file = `${outDir}/${String(i).padStart(2, "0")}.png`;
  await page.screenshot({ path: file });
  console.log(file);
}
const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
console.log(JSON.stringify({ overflowX: overflow, consoleErrors: errors }));
await browser.close();
