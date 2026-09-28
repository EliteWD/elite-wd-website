/**
 * Review check for the unified estimate CTA: every estimate button/link reads the
 * single approved label, keeps pointing at the contact page, stays on one line
 * and doesn't push the nav or page into horizontal overflow.
 * Run (PowerShell, server on :3000): $env:VISUAL=1; npx playwright test e2e/cta.visual.ts --project=desktop
 */
import { expect, test } from "@playwright/test";

test.use({ baseURL: "http://localhost:3000" });

const labels = { es: "Solicitar estimado gratis", en: "Get a Free Estimate" } as const;
const retired = /Estimado gratis en casa|Agenda tu estimado|Continuar a mi estimado|Free estimate\b|Book your free|Continue to my free/;
const pages = ["", "/impact-windows", "/impact-doors", "/service-areas", "/about", "/contact"];
const widths = [
  { name: "phone-360", width: 360, height: 780 },
  { name: "phone-390", width: 390, height: 844 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "small-desktop", width: 900, height: 800 },
  { name: "desktop", width: 1280, height: 800 },
];

for (const lang of ["es", "en"] as const) {
  for (const size of widths) {
    test(`cta ${lang} ${size.name}`, async ({ page }) => {
      await page.setViewportSize({ width: size.width, height: size.height });
      await page.emulateMedia({ reducedMotion: "reduce" });

      for (const path of pages) {
        await page.goto(`/${lang}${path}`);

        // No retired CTA wording on any link or button.
        const actionTexts = await page.locator("a, button").allInnerTexts();
        expect(actionTexts.filter((t) => retired.test(t)), `${path}: retired CTA text`).toEqual([]);

        // Every estimate CTA: exact label, contact destination, single line when visible.
        const ctas = page.locator("a", { hasText: labels[lang] });
        const count = await ctas.count();
        for (let i = 0; i < count; i++) {
          const cta = ctas.nth(i);
          await expect(cta).toHaveText(labels[lang]);
          await expect(cta).toHaveAttribute("href", new RegExp(`^/${lang}/contact`));
          if (await cta.isVisible()) {
            const lines = await cta.evaluate((el) => {
              const lh = parseFloat(getComputedStyle(el).lineHeight) || 16;
              const pad = parseFloat(getComputedStyle(el).paddingTop) + parseFloat(getComputedStyle(el).paddingBottom);
              return Math.round((el.getBoundingClientRect().height - pad) / lh);
            });
            expect(lines, `${path}: CTA #${i} wraps`).toBeLessThanOrEqual(1);
          }
        }

        const layout = await page.evaluate(() => {
          const inner = document.querySelector("nav[aria-label=Main] .container") as HTMLElement | null;
          return {
            pageOverflow: document.documentElement.scrollWidth > innerWidth,
            navOverflow: inner ? inner.scrollWidth > inner.clientWidth + 1 : false,
          };
        });
        expect(layout.pageOverflow, `${path}: page overflow`).toBe(false);
        expect(layout.navOverflow, `${path}: nav overflow`).toBe(false);
      }

      await page.goto(`/${lang}`);
      await page.screenshot({ path: `test-results/cta/${lang}-${size.name}-top.png` });
    });
  }
}
