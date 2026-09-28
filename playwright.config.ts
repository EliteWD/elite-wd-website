import { defineConfig, devices } from "@playwright/test";

const PORT = 3100;

/**
 * End-to-end tests against the production build, using the locally installed
 * Chrome (channel: "chrome") so no browser download is needed.
 * Run: npm run build && npm run test:e2e
 */
export default defineConfig({
  testDir: "./e2e",
  // VISUAL=1 runs the review snapshots (e2e/*.visual.ts) instead of the test suite.
  testMatch: process.env.VISUAL ? /.*\.visual\.ts$/ : /.*\.spec\.ts$/,
  fullyParallel: true,
  retries: 0,
  reporter: [["list"]],
  use: {
    baseURL: `http://localhost:${PORT}`,
    channel: "chrome",
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "desktop",
      use: { ...devices["Desktop Chrome"], channel: "chrome", viewport: { width: 1280, height: 800 } },
    },
    {
      name: "mobile",
      use: {
        channel: "chrome",
        viewport: { width: 390, height: 844 },
        deviceScaleFactor: 3,
        isMobile: true,
        hasTouch: true,
      },
    },
  ],
  webServer: {
    command: `npx next start -p ${PORT}`,
    url: `http://localhost:${PORT}/en`,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
