import { expect, test, type Page } from "@playwright/test";

const pages = ["", "/impact-windows", "/impact-doors", "/service-areas", "/about", "/contact"];
const isMobile = (page: Page) => (page.viewportSize()?.width ?? 1280) < 734;

test.describe("routing & language", () => {
  test("root redirects by browser language", async ({ request }) => {
    const es = await request.get("/", { headers: { "accept-language": "es-US,es;q=0.9" }, maxRedirects: 0 });
    expect(es.status()).toBe(307);
    expect(es.headers()["location"]).toMatch(/\/es$/);

    const en = await request.get("/", { headers: { "accept-language": "en-US,en;q=0.9" }, maxRedirects: 0 });
    expect(en.headers()["location"]).toMatch(/\/en$/);
  });

  test("unknown path renders the localized 404", async ({ page }) => {
    const response = await page.goto("/es/no-existe");
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Esta página no está aquí.");
  });

  test("language switch keeps the current page", async ({ page }) => {
    test.skip(isMobile(page), "desktop nav link");
    await page.goto("/en/impact-windows");
    await page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: "Español" }).click();
    await expect(page).toHaveURL(/\/es\/impact-windows$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "es-US");
  });
});

test.describe("every page", () => {
  for (const lang of ["en", "es"]) {
    for (const path of pages) {
      test(`/${lang}${path} loads cleanly`, async ({ page }) => {
        const errors: string[] = [];
        page.on("pageerror", (e) => errors.push(e.message));
        page.on("console", (m) => m.type() === "error" && errors.push(m.text()));

        const response = await page.goto(`/${lang}${path}`);
        expect(response?.status()).toBe(200);
        await expect(page.locator("h1")).toHaveCount(1);

        const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
        expect(overflow, "no horizontal scroll").toBe(false);

        // Eager images must decode; lazy ones are only fetched near the viewport.
        const brokenImages = await page.evaluate(async () => {
          const eager = [...document.images].filter((img) => img.loading !== "lazy");
          await Promise.all(eager.map((img) => (img.complete ? null : img.decode().catch(() => null))));
          return eager.filter((img) => img.naturalWidth === 0).map((img) => img.src);
        });
        expect(brokenImages).toEqual([]);
        expect(errors).toEqual([]);
      });
    }
  }
});

test.describe("navigation chrome", () => {
  test("mobile menu opens, navigates and closes", async ({ page }) => {
    test.skip(!isMobile(page), "mobile only");
    await page.goto("/en");
    // The toggle's accessible name flips between "Menu" and "Close".
    const toggle = page.locator("button[aria-controls=mobile-menu]");
    await expect(toggle).toHaveAccessibleName("Menu");
    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
    await expect(toggle).toHaveAccessibleName("Close");
    await page.locator("#mobile-menu").getByRole("link", { name: "Impact Doors" }).click();
    await expect(page).toHaveURL(/\/en\/impact-doors$/);
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await expect(page.locator("#mobile-menu")).toBeHidden();
  });

  test("sticky action bar only on phones", async ({ page }) => {
    await page.goto("/en");
    const bar = page.getByTestId("mobile-action-bar");
    if (isMobile(page)) {
      await expect(bar).toBeVisible();
      await expect(bar.getByRole("link", { name: "Call" })).toHaveAttribute("href", /^tel:\+1\d{10}$/);
    } else {
      await expect(bar).toBeHidden();
    }
  });

  test("sections reveal as they scroll into view", async ({ page }) => {
    await page.goto("/en");
    const faq = page.locator("[data-reveal]").filter({ has: page.locator("#faq-title") });
    await expect(faq).not.toHaveClass(/is-revealed/);
    await faq.scrollIntoViewIfNeeded();
    await expect(faq).toHaveClass(/is-revealed/);
  });
});

test.describe("hero media", () => {
  test("desktop plays the video loop; phones get the still", async ({ page }) => {
    await page.goto("/en");
    const videos = page.locator("section[aria-labelledby=hero-title] video");
    if (isMobile(page)) {
      await expect(videos).toHaveCount(0);
      await expect(page.locator("section[aria-labelledby=hero-title] picture img")).toBeVisible();
    } else {
      await expect(videos).toHaveCount(2);
      await expect
        .poll(() => videos.first().evaluate((v: HTMLVideoElement) => v.currentTime), { timeout: 10_000 })
        .toBeGreaterThan(0.5);
    }
  });

  test("reduced motion shows the still instead of the video", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/en");
    await expect(page.locator("section[aria-labelledby=hero-title] video")).toHaveCount(0);
  });
});

test.describe("interactive elements", () => {
  test("glass simulator tints only the glass", async ({ page }) => {
    await page.goto("/en/impact-windows");
    const panes = page.getByTestId("glass-pane");
    await expect(panes).toHaveCount(2);

    const bronze = page.getByRole("button", { name: "Bronze tint" });
    await bronze.click();
    await expect(bronze).toHaveAttribute("aria-pressed", "true");
    await expect(panes.first()).toHaveAttribute("data-look", "bronze");
    await expect(page.getByText("A warm tone that softens bright western sun.")).toBeVisible();

    await page.getByRole("button", { name: "Privacy glass" }).click();
    await expect(panes.nth(1)).toHaveAttribute("data-look", "privacy");
  });

  test("project planner hands its answers to the estimate form", async ({ page }) => {
    await page.goto("/en");
    const planner = page.getByTestId("planner");
    await planner.getByRole("button", { name: "Impact windows" }).click();
    await planner.getByRole("button", { name: "6–10" }).click();
    await planner.getByRole("button", { name: "Naples" }).click();

    await expect(page.getByTestId("planner-summary")).toContainText("Naples");
    await planner.getByRole("link", { name: "Get a Free Estimate" }).click();

    await expect(page).toHaveURL(/\/en\/contact\?.*project=windows/);
    await expect(page.getByRole("radio", { name: "Impact windows" })).toBeChecked();
    await expect(page.getByLabel("City")).toHaveValue("Naples");
    await expect(page.getByLabel("Anything else we should know?")).toHaveValue(/6–10/);
  });

  test("planner back and restart", async ({ page }) => {
    await page.goto("/es");
    const planner = page.getByTestId("planner");
    await planner.getByRole("button", { name: "Puertas de impacto" }).click();
    await expect(planner).toContainText("Paso 2 de 3");
    await planner.getByRole("button", { name: /Atrás/ }).click();
    await expect(planner).toContainText("Paso 1 de 3");
  });

  test("area checker confirms served cities and handles others", async ({ page }) => {
    await page.goto("/en/service-areas");
    const checker = page.getByTestId("area-checker");
    const input = checker.getByLabel("Your city");

    await input.fill("naples");
    await checker.getByRole("button", { name: "Check" }).click();
    await expect(page.getByTestId("area-result")).toContainText("Yes — we serve Naples.");
    await expect(checker.getByRole("link", { name: "Get a Free Estimate" })).toHaveAttribute("href", /city=Naples/);

    await input.fill("Orlando");
    await checker.getByRole("button", { name: "Check" }).click();
    await expect(page.getByTestId("area-result")).toContainText("Orlando isn't on our list yet");
  });
});

test.describe("estimate form", () => {
  test("validates required fields", async ({ page }) => {
    await page.goto("/en/contact");
    await page.getByRole("button", { name: "Request my estimate" }).click();
    for (const message of [
      "Please enter your name.",
      "Please enter a valid phone number.",
      "Please enter a valid email address.",
      "Please select your city.",
      "Please choose a project type.",
      "Please choose the property type.",
      "Please choose when you'd like to do it.",
    ]) {
      await expect(page.getByText(message)).toBeVisible();
    }
    await expect(page.getByLabel("Full name")).toBeFocused();
  });

  test("property type and timeline questions appear in Spanish too", async ({ page }) => {
    await page.goto("/es/contact");
    await expect(page.getByRole("group", { name: "¿Qué tipo de propiedad es?" }).getByRole("radio")).toHaveCount(4);
    await expect(page.getByRole("group", { name: "¿Cuándo te gustaría realizar el proyecto?" }).getByRole("radio")).toHaveCount(4);
    await page.getByRole("radio", { name: "Condominio" }).check();
    await expect(page.getByRole("radio", { name: "Condominio" })).toBeChecked();
  });

  test("a valid request asks to call while no endpoint is connected", async ({ page }) => {
    await page.goto("/en/contact");
    await page.getByLabel("Full name").fill("Test Homeowner");
    await page.getByLabel("Phone").fill("2395550100");
    await page.getByLabel("Email").fill("test@example.com");
    await page.getByLabel("City").selectOption("Cape Coral");
    await page.getByRole("radio", { name: "Impact doors" }).check();
    await page.getByRole("radio", { name: "Single-family home in an HOA community" }).check();
    await page.getByRole("radio", { name: "In 1–3 months" }).check();
    await page.getByRole("button", { name: "Request my estimate" }).click();
    // Scope to the form: Next.js also renders a (hidden) route-announcer alert.
    await expect(page.locator("form").getByRole("alert")).toContainText("please call us");
  });
});
