/**
 * Review snapshots of the storm "highlight" frame in both languages at
 * phone / tablet / desktop widths, plus a fit check (copy stays inside the frame).
 * Run (PowerShell, server on :3000): $env:VISUAL=1; npx playwright test e2e/highlight.visual.ts --project=desktop
 */
import { expect, test } from "@playwright/test";

test.use({ baseURL: "http://localhost:3000" });

const widths = [
  { name: "phone", width: 390, height: 844 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1280, height: 800 },
];

for (const lang of ["es", "en"]) {
  for (const size of widths) {
    test(`highlight ${lang} ${size.name}`, async ({ page }) => {
      await page.setViewportSize({ width: size.width, height: size.height });
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto(`/${lang}`);
      const frame = page.locator("figure").first();
      await frame.scrollIntoViewIfNeeded();

      const fit = await frame.evaluate((fig) => {
        const box = fig.getBoundingClientRect();
        const copy = fig.querySelector("figcaption")!.getBoundingClientRect();
        return { copyTop: Math.round(copy.top - box.top), overflowX: document.documentElement.scrollWidth > innerWidth };
      });
      expect(fit.copyTop, "copy starts inside the frame").toBeGreaterThanOrEqual(0);
      expect(fit.overflowX).toBe(false);

      await frame.screenshot({ path: `test-results/highlight/${lang}-${size.name}.png` });
    });
  }
}
