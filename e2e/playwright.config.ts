import { defineConfig, devices } from "@playwright/test";

/**
 * E2E contra API + web reales. `pnpm e2e` desde la raíz.
 * El API arranca con una base temporal (E2E_DB) y bypass de desarrollo; la web con el proxy de Vite.
 */
const API_PORT = 3100;
const WEB_PORT = 5174;

export default defineConfig({
  testDir: "./tests",
  outputDir: "./test-results",
  timeout: 45_000,
  expect: { timeout: 8_000 },
  retries: 0,
  workers: 1,
  reporter: [["list"], ["html", { open: "never", outputFolder: "./playwright-report" }]],
  use: {
    baseURL: `http://localhost:${WEB_PORT}`,
    ...devices["Desktop Chrome"],
    viewport: { width: 1440, height: 1024 },
    locale: "es-AR",
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
  webServer: [
    {
      command: `PORT=${API_PORT} DATABASE_URL=file:./data/e2e.db AUTH_DEV_BYPASS=1 SESSION_SECRET=e2e-secret-e2e-secret-e2e-secret-1234 SYNC_TOKEN=e2e-token pnpm --filter @sinapsis/api exec tsx src/db/migrate.ts && PORT=${API_PORT} DATABASE_URL=file:./data/e2e.db AUTH_DEV_BYPASS=1 SESSION_SECRET=e2e-secret-e2e-secret-e2e-secret-1234 SYNC_TOKEN=e2e-token pnpm --filter @sinapsis/api exec tsx src/index.ts`,
      url: `http://localhost:${API_PORT}/api/health`,
      reuseExistingServer: false,
      timeout: 60_000,
      cwd: "..",
    },
    {
      command: `VITE_API_URL=http://localhost:${API_PORT} pnpm --filter @sinapsis/web exec vite --port ${WEB_PORT} --strictPort`,
      url: `http://localhost:${WEB_PORT}`,
      reuseExistingServer: false,
      timeout: 60_000,
      cwd: "..",
    },
  ],
});
