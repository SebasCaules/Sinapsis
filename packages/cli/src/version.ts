import { readFileSync } from "node:fs";

/** Versión del CLI, leída de su `package.json` (funciona en `src/` y en `dist/`). */
export const VERSION: string = (() => {
  try {
    const raw = readFileSync(new URL("../package.json", import.meta.url), "utf8");
    const parsed = JSON.parse(raw) as { version?: unknown };
    return typeof parsed.version === "string" ? parsed.version : "0.0.0";
  } catch {
    return "0.0.0";
  }
})();

/** Identificador que viaja en `SyncPayload.generator`. */
export const GENERATOR = `@sinapsis/cli ${VERSION}`;
