import { defineConfig } from "vitest/config";

/**
 * Las pruebas comparan la salida del CLI como texto plano. `picocolors` decide
 * al cargarse si pinta o no según la terminal: con `NO_COLOR` fijado antes de
 * importar nada, la salida es la misma en un TTY y en CI.
 */
export default defineConfig({
  test: { env: { NO_COLOR: "1", FORCE_COLOR: "0" } },
});
