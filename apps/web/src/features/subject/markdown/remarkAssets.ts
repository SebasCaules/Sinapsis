/**
 * remark-assets — el `src` de las imágenes del wiki (N0-68).
 *
 * El cuerpo viaja crudo desde `pages.json` y sus imágenes están escritas como
 * las escribe Obsidian: relativas al archivo `.md` del vault
 * (`![](../../assets/des-feistel.png)`). Esa ruta no existe en el sitio, así que
 * el compilador publicó cada archivo con un nombre estable y dejó el mapa
 * `ref → file` en la página; este plugin lo aplica al renderizar.
 *
 * Tres reglas, y las tres importan:
 *
 *  - **Solo se reescribe lo que está en el mapa.** Una referencia que el
 *    compilador no reconoció se deja intacta: el lector muestra lo que el wiki
 *    dice, no una ruta inventada.
 *  - **Nada de `javascript:` ni `data:`.** El mapa solo tiene nombres de archivo
 *    publicados, pero la guarda es explícita: lo que no sea un nombre simple no
 *    se usa.
 *  - **Sin HTML crudo.** Se cambia el `url` del nodo `image` del árbol; el
 *    lector sigue sin `rehype-raw` (N0-10).
 */
import type { PageAsset } from "@sinapsis/contract";
import { siteAssetBase } from "@sinapsis/contract/site";
import { visit } from "unist-util-visit";

export interface AssetOptions {
  /** Slug de la materia: arma la base de los adjuntos. */
  subject: string;
  /** Mapa de la página: `src` tal como está escrito → nombre publicado. */
  assets: readonly PageAsset[];
  /** `import.meta.env.BASE_URL` (termina en `/`). */
  base: string;
}

interface MdNode {
  type: string;
  url?: string;
  children?: MdNode[];
}

/**
 * Un nombre publicado es exactamente `<16 hex>.<ext>`, la forma que produce
 * `assetFileName` del compilador: un solo segmento, sin barras, sin dos puntos y
 * sin `..`. La copia de la expresión vive acá y no se importa de `@sinapsis/markdown`
 * porque el lector no depende del compilador; el contrato es la forma del nombre.
 * `svg` no está: no se publica (contrato `02` §10 bis).
 */
const PUBLISHED_FILE = /^[a-f0-9]{16}\.(png|jpe?g|gif|webp)$/;

function isSafeFile(file: string): boolean {
  return PUBLISHED_FILE.test(file);
}

/** URL final de un adjunto: `<BASE_URL>subjects/<slug>/assets/<file>`. */
export function assetUrl(base: string, subject: string, file: string): string {
  const prefix = base.endsWith("/") ? base : `${base}/`;
  return `${prefix}${siteAssetBase(subject)}/${file}`;
}

export function remarkAssets(options: AssetOptions) {
  const { subject, assets, base } = options;
  const map = new Map<string, string>();
  for (const asset of assets) {
    if (isSafeFile(asset.file)) map.set(asset.ref, asset.file);
  }

  return (tree: MdNode): void => {
    if (map.size === 0) return;
    visit(tree, "image", (node: MdNode) => {
      const url = node.url;
      if (url === undefined) return;
      const file = map.get(url);
      if (file === undefined) return;
      node.url = assetUrl(base, subject, file);
    });
  };
}
