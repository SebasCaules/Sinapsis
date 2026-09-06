import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

/* vitest 3 ya trae los tipos de vite 6: el plugin de React entra sin el molde
   que hizo falta con vitest 2 (decisión W2-7 del Sprint 1, ya saldada). */
export default defineConfig({
  plugins: [react()],
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  server: {
    port: 5173,
    proxy: { "/api": { target: process.env.VITE_API_URL ?? "http://localhost:3000", changeOrigin: false } },
  },
  build: { outDir: "dist", sourcemap: true },
  test: { environment: "jsdom", globals: true },
});
