/**
 * Verifies the desktop hero video actually plays and hands off (crossfade loop).
 * Usage: node scripts/check-hero-video.mjs [url]   (server must be running)
 */
import puppeteer from "puppeteer-core";

const url = process.argv[2] || "http://localhost:3000/en";
const browser = await puppeteer.launch({
  executablePath: process.env.CHROME_PATH || "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  headless: true,
  args: ["--autoplay-policy=no-user-gesture-required"],
});
const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 800 });
await page.goto(url, { waitUntil: "networkidle0" });

const sample = () =>
  page.evaluate(() =>
    [...document.querySelectorAll("video")].map((v) => ({
      time: +v.currentTime.toFixed(2),
      paused: v.paused,
      opacity: getComputedStyle(v).opacity,
    })),
  );

console.log("t=1s ", JSON.stringify(await sample()));
await new Promise((r) => setTimeout(r, 8500));
console.log("t=9.5s", JSON.stringify(await sample()));
await browser.close();
