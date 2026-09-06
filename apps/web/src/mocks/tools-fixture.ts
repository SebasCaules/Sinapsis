/**
 * Bundles de mentira de la materia de prueba: lo que devuelve
 * `api.subject.tools(slug)` bajo `?mock=1`.
 *
 * El script es un archivo de verdad (`tools/demo-bundle.js`), servido por una
 * URL de `Blob`: así el runtime lo carga por el MISMO camino que un bundle real
 * —una etiqueta `<script src>` armada con `${base}/${path}`— y el smoke prueba
 * el camino de producción y no un atajo. El corte por la última barra deja
 * `base` y `path` de forma que volver a unirlos devuelva exactamente la URL del
 * blob. La `base` de este bundle es absoluta a propósito: `bundleOf` deja pasar
 * sin prefijo lo que ya es una URL. En la compilación de producción, Rollup poda
 * este módulo junto con el resto de las fixtures.
 */
import { RUNTIME_VERSION, type ToolInfo } from "@sinapsis/contract";
import bundleSource from "./tools/demo-bundle.js?raw";

let cached: { base: string; script: string } | null = null;

function bundleUrl(): { base: string; script: string } {
  if (cached) return cached;
  const url = URL.createObjectURL(new Blob([bundleSource], { type: "text/javascript" }));
  const at = url.lastIndexOf("/");
  cached = at > 0 ? { base: url.slice(0, at), script: url.slice(at + 1) } : { base: "", script: url };
  return cached;
}

/**
 * Un solo bundle que trae las dos cosas que hay que poder mirar: una vista
 * (`explorador`, el mismo id que declara el rail de Proba) y las figuras del
 * lector. Una materia real puede separarlas en dos bundles.
 */
export function mockTools(): ToolInfo[] {
  const { base, script } = bundleUrl();
  return [
    {
      manifest: {
        id: "demo",
        title: "Herramientas de prueba",
        version: "0.0.1",
        description: "Bundle de mentira del modo mock: una vista y una figura.",
        runtime: RUNTIME_VERSION,
        scripts: [script],
        styles: [],
        views: [
          { id: "explorador", label: "Explorador de distribuciones", icon: "chart", layout: "wide" },
        ],
        figures: true,
        progress: false,
        data: [],
      },
      bytes: bundleSource.length,
      updatedAt: "2026-09-05T18:00:00.000Z",
      base,
    },
  ];
}
