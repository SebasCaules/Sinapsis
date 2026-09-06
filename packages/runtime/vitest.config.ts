import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // El runtime es del NAVEGADOR: figuras, loader y markdown tocan el DOM.
    environment: "jsdom",
    include: ["test/**/*.test.ts"],
  },
});
