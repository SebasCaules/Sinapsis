import { copyFileSync, existsSync } from "node:fs";
import { fileURLToPath, URL } from "node:url";
import { defineConfig, type Plugin } from "vitest/config";
import react from "@vitejs/plugin-react";

const resolvePath = (relative: string) => fileURLToPath(new URL(relative, import.meta.url));

/**
 * GitHub Pages no tiene fallback de SPA: cualquier ruta que no sea un archivo
 * devuelve `404.html`. Copiar `index.html` ahí es lo que hace que `/m/proba/wiki`
 * abra la aplicación en vez de la página de error de GitHub.
 */
function spaFallback(): Plugin {
  return {
    name: "sinapsis:spa-fallback",
    apply: "build",
    closeBundle() {
      const index = resolvePath("./dist/index.html");
      if (existsSync(index)) copyFileSync(index, resolvePath("./dist/404.html"));
    },
  };
}

/* vitest 3 ya trae los tipos de vite 6: el plugin de React entra sin el molde
   que hizo falta con vitest 2 (decisión W2-7 del Sprint 1, ya saldada). */
export default defineConfig({
  /* `/` en desarrollo; en Pages el workflow exporta `VITE_BASE=/Sinapsis/`. */
  base: process.env.VITE_BASE ?? "/",
  /* El end-to-end sirve su propio sitio compilado (`e2e/.site`) sin tocar `public/`. */
  publicDir: process.env.SINAPSIS_PUBLIC_DIR ?? "public",
  plugins: [react(), spaFallback()],
  resolve: { alias: { "@": resolvePath("./src") } },
  /* Sin proxy: ya no hay API al que reenviar; los datos son archivos del sitio. */
  server: { port: 5173 },
  build: { outDir: "dist", sourcemap: true },
  test: { environment: "jsdom", globals: true },
});
