/**
 * Build del CLI: un único `dist/index.js` autocontenido.
 *
 * Hace falta empaquetar (y no solo compilar con tsc) porque los paquetes del
 * workspace se consumen como TypeScript fuente (`main: ./src/index.ts`), y Node
 * no resuelve los especificadores `./x.js` de un archivo `.ts`.
 */
import { build } from "esbuild";

await build({
  entryPoints: ["src/index.ts"],
  outfile: "dist/index.js",
  bundle: true,
  platform: "node",
  format: "esm",
  target: "node20",
  sourcemap: true,
  legalComments: "none",
  banner: {
    // El shebang ya viene de `src/index.ts`; acá solo va el shim de `require`
    // que necesitan las dependencias CommonJS empaquetadas.
    js: [
      "import { createRequire as __createRequire } from 'node:module';",
      "const require = __createRequire(import.meta.url);",
    ].join("\n"),
  },
});
