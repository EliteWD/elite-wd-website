/**
 * Review check for the "impact windows vs. hurricane panels" table:
 * 6 rows, no security/theft claim, no page overflow, snapshots at 3 widths.
 * Run (PowerShell, server on :3000): $env:VISUAL=1; npx playwright test e2e/comparison.visual.ts --project=desktop
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
    test(`comparison ${lang} ${size.name}`, async ({ page }) => {
      await page.setViewportSize({ width: size.width, height: size.height });
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto(`/${lang}`);
      const table = page.locator("table");
      const panel = table.locator("xpath=ancestor::div[contains(@class,'panel')][1]");
      await panel.scrollIntoViewIfNeeded();

      await expect(table.locator("tbody tr")).toHaveCount(6);
      await expect(table).not.toContainText(/robo|seguridad|break-in|burglar|theft|security|intrus/i);

      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
      expect(overflow, "no page-level horizontal scroll").toBe(false);

      await panel.screenshot({ path: `test-results/comparison/${lang}-${size.name}.png` });
    });
  }
}
