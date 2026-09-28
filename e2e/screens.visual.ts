/**
 * Visual snapshots of the interactive elements in an active state, for review.
 * Not part of the default suite. Needs the server on :3000.
 * Run (PowerShell): $env:VISUAL=1; npx playwright test --project=desktop
 * Output: test-results/screens/*.png
 */
import { test } from "@playwright/test";

test.use({ baseURL: "http://localhost:3000" });

test("interactive states", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });

  await page.goto("/es/impact-windows#glass");
  await page.getByRole("button", { name: "Tinte bronce" }).click();
  await page.locator("#glass").screenshot({ path: "test-results/screens/glass-bronze.png" });
  await page.getByRole("button", { name: "Vidrio de privacidad" }).click();
  await page.locator("[data-testid=glass-pane]").first().evaluate(() => new Promise((r) => setTimeout(r, 600)));
  await page.locator("#glass").screenshot({ path: "test-results/screens/glass-privacy.png" });

  await page.goto("/es");
  const planner = page.getByTestId("planner");
  await planner.scrollIntoViewIfNeeded();
  await planner.getByRole("button", { name: "Ventanas y puertas" }).click();
  await planner.screenshot({ path: "test-results/screens/planner-step2.png" });
  await planner.getByRole("button", { name: "11–20" }).click();
  await planner.getByRole("button", { name: "Cape Coral" }).click();
  await planner.screenshot({ path: "test-results/screens/planner-summary.png" });

  await page.goto("/es/service-areas");
  const checker = page.getByTestId("area-checker");
  await checker.getByLabel("Tu ciudad").fill("Estero");
  await checker.getByRole("button", { name: "Comprobar" }).click();
  await checker.screenshot({ path: "test-results/screens/checker-yes.png" });
});
