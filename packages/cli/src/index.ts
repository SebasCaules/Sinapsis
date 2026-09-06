#!/usr/bin/env node
/**
 * Punto de entrada ejecutable del CLI `sinapsis`.
 * La lógica vive en `cli.ts` (importable desde los tests sin efectos secundarios).
 */
import { main } from "./cli.js";

main(process.argv.slice(2))
  .then((code) => {
    process.exitCode = code;
  })
  .catch((cause: unknown) => {
    process.stderr.write(`${cause instanceof Error ? (cause.stack ?? cause.message) : String(cause)}\n`);
    process.exitCode = 1;
  });
