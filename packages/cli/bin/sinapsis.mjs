#!/usr/bin/env node
/**
 * Envoltorio del binario `sinapsis`: ejecuta la build de `dist/`.
 * Para desarrollo (sin build) usar `pnpm --filter @sinapsis/cli start -- <args>`.
 */
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

const entry = new URL("../dist/index.js", import.meta.url);

if (!existsSync(fileURLToPath(entry))) {
  process.stderr.write(
    "sinapsis: falta la build del CLI.\n" +
      "  Compilá con:  pnpm --filter @sinapsis/cli build\n" +
      "  O corré en desarrollo:  pnpm --filter @sinapsis/cli start -- <args>\n",
  );
  process.exit(1);
}

await import(entry.href);
