import path from "node:path";
import { defineConfig, devices } from "@playwright/test";

/**
 * E2E contra la web real. `pnpm e2e` desde la raíz.
 *
 * Ya no hay API: la plataforma es una SPA estática que lee archivos de
 * `subjects/`, y el estado personal vive en el navegador. Por eso hay UN solo
 * `webServer` (Vite) y no hay `storageState`: cada prueba arranca con un
 * contexto limpio.
 *
 * El comando del `webServer` compila el sitio ANTES de levantar Vite
 * (`prepare-site.ts`): Playwright arranca los servidores antes de correr
 * `globalSetup`, y Vite fotografía el contenido de `publicDir` al crearse, así
 * que un sitio escrito después no se serviría. `globalSetup` lee lo compilado y
 * escribe el manifiesto de la siembra (`e2e/.seed.json`).
 */
const WEB_PORT = 5174;
const SITE_DIR = path.join(__dirname, ".site");

const PREPARE = `pnpm --filter @sinapsis/cli exec tsx ${path.join(__dirname, "prepare-site.ts")}`;
const VITE = [
  "VITE_E2E=1",
  `SINAPSIS_PUBLIC_DIR='${SITE_DIR}'`,
  `pnpm --filter @sinapsis/web exec vite --port ${WEB_PORT} --strictPort`,
].join(" ");

export default defineConfig({
  testDir: "./tests",
  outputDir: "./test-results",
  globalSetup: path.join(__dirname, "global-setup.ts"),
  timeout: 45_000,
  expect: { timeout: 8_000 },
  retries: 0,
  workers: 1,
  fullyParallel: false,
  reporter: [["list"], ["html", { open: "never", outputFolder: "./playwright-report" }]],
  use: {
    baseURL: `http://localhost:${WEB_PORT}`,
    ...devices["Desktop Chrome"],
    viewport: { width: 1440, height: 1024 },
    locale: "es-AR",
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
  webServer: {
    command: `${PREPARE} && ${VITE}`,
    url: `http://localhost:${WEB_PORT}`,
    reuseExistingServer: false,
    // Compilar la materia real (209 páginas y dos bundles) entra cómodo en dos minutos.
    timeout: 180_000,
    cwd: "..",
  },
});
