/** Measures nav pieces at a given width. Usage: node scripts/measure-nav.mjs <url> <width> */
import puppeteer from "puppeteer-core";

const [url, width = "390"] = process.argv.slice(2);
const browser = await puppeteer.launch({
  executablePath: process.env.CHROME_PATH || "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  headless: true,
});
const page = await browser.newPage();
await page.setViewport({ width: Number(width), height: 800 });
await page.goto(url, { waitUntil: "networkidle0" });
const out = await page.evaluate(() => {
  const w = (el) => (el ? Math.round(el.getBoundingClientRect().width) : null);
  const inner = document.querySelector("nav[aria-label=Main] .container");
  const [logo, , actions] = inner.children;
  const local = document.querySelector("nav[aria-label]:not([aria-label=Main])");
  const wide = [...document.querySelectorAll("body *")]
    .filter((el) => el.getBoundingClientRect().right > innerWidth + 1)
    .slice(0, 5)
    .map((el) => `${el.tagName}.${String(el.className).slice(0, 40)} r=${Math.round(el.getBoundingClientRect().right)}`);
  return {
    viewport: innerWidth,
    navContent: inner.clientWidth - 2 * parseFloat(getComputedStyle(inner).paddingLeft),
    logo: w(logo),
    actions: w(actions),
    ctaPill: w(actions.querySelector("a[href$=contact]")),
    localNav: local ? { box: w(local), title: w(local.firstElementChild), cta: w(local.querySelector("a[href$=contact]")) } : null,
    overflowing: wide,
  };
});
console.log(JSON.stringify(out, null, 1));
await browser.close();
