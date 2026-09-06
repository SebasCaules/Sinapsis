/**
 * Compila `e2e/.site/` antes de que arranque Vite.
 *
 * Lo corre el propio comando del `webServer` (ver `playwright.config.ts`): el
 * `globalSetup` de Playwright ocurre DESPUÉS de levantar los servidores, y Vite
 * fotografía `publicDir` al crearse, así que un sitio construido más tarde no se
 * serviría. Toda la lógica está en `support/site.ts`; esto solo la dispara.
 */
import { buildSite } from "./support/site";

buildSite().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
