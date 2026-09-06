import { defineConfig, type ViteUserConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  /* vitest 2 arrastra los tipos de vite 5 y la app corre sobre vite 6: sus
     `Plugin` no son asignables entre sí. El molde alcanza solo al plugin; el
     resto de la configuración sí se verifica. */
  plugins: react() as unknown as ViteUserConfig["plugins"],
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  server: {
    port: 5173,
    proxy: { "/api": { target: process.env.VITE_API_URL ?? "http://localhost:3000", changeOrigin: false } },
  },
  build: { outDir: "dist", sourcemap: true },
  test: { environment: "jsdom", globals: true },
});
