# `sinapsis.config.json` comentado — Probabilidad y Estadística

Este es el config real de la primera materia de la plataforma (decisión N0-14). El archivo
de verdad es JSON estricto: **no admite comentarios**. Los `//` de acá son explicación.

Wiki de origen: 209 páginas en seis carpetas (`conceptos`, `distribuciones`, `teoremas`,
`tecnicas`, `formularios`, `fuentes`) más `index.md` y `log.md` en la raíz.

```jsonc
{
  // ── Identidad ──────────────────────────────────────────────────────────────
  "contract": 1,          // versión del contrato que entiende esta materia
  "slug": "proba",        // URL de la materia: /m/proba. ^[a-z0-9][a-z0-9-]*$
  "name": "Probabilidad y Estadística",   // hero del índice
  "code": "93.24",                        // código de la cátedra
  "institution": "ITBA",
  "color": "--u9",        // color de la materia en la landing: token --u1…--u9 o hex #rrggbb
  "semester": "2026-1C",  // dónde cae en la landing la primera vez; después el usuario la mueve

  // ── Nomenclatura de la división del temario ────────────────────────────────
  // Proba organiza por "unidades". Otras materias usan semanas, módulos o capítulos.
  // `abbr` es lo que se ve en las píldoras del índice: U1, U2, U3…
  "division": { "singular": "Unidad", "abbr": "U", "plural": "Unidades" },

  // ── Divisiones ─────────────────────────────────────────────────────────────
  // El ORDEN DEL ARRAY es el orden del índice. `key` es lo que dice el frontmatter
  // de cada página en el campo `wiki.divisionField` (acá, `unidad:`).
  //
  // kind "numbered" (por defecto): entra en la numeración U1…U9 y en la escala de
  //   color paramétrica (N ≤ 9 → tokens --u1…--u9; N > 9 → barrido oklch).
  // kind "extra": sin número, color gris --u0, salvo que declare `color` propio.
  "divisions": [
    { "key": "1", "name": "Estadística Descriptiva" },
    { "key": "2", "name": "Introducción a la Probabilidad" },
    { "key": "3", "name": "Variables Aleatorias Discretas" },
    { "key": "4", "name": "Variables Aleatorias Continuas" },
    { "key": "5", "name": "Función de V.A. y Bidimensionales" },
    { "key": "6", "name": "Procesos Estocásticos" },
    { "key": "7", "name": "Suma de Variables Aleatorias" },
    { "key": "8", "name": "Inferencia Estadística" },
    { "key": "9", "name": "Pruebas de Hipótesis" },

    // La unidad "0" existe en el wiki pero no es una unidad del programa: se declara
    // como extra para que no se numere ni robe un color de la escala.
    { "key": "0", "name": "Complementos Matemáticos", "kind": "extra" },

    // Las evaluaciones llevan color fijo propio en vez del gris de las extra.
    { "key": "eval", "name": "Evaluaciones", "kind": "extra", "color": "--ueval" }
  ],

  // ── Tipos de página ────────────────────────────────────────────────────────
  // El ORDEN DEL ARRAY es el orden de los bloques dentro de cada división.
  // `folder` es la carpeta del wiki cuyas páginas son de este tipo por defecto;
  // el `tipo:` del frontmatter siempre manda por encima.
  "pageTypes": [
    { "key": "concepto",     "label": "Concepto",     "plural": "Conceptos",     "folder": "conceptos" },
    { "key": "distribucion", "label": "Distribución", "plural": "Distribuciones", "folder": "distribuciones" },
    { "key": "teorema",      "label": "Teorema",      "plural": "Teoremas",      "folder": "teoremas" },
    { "key": "tecnica",      "label": "Técnica",      "plural": "Técnicas",      "folder": "tecnicas" },
    { "key": "formulario",   "label": "Formulario",   "plural": "Formularios",   "folder": "formularios" },

    // Las fuentes son material de referencia (apuntes, TPs, videos de la cátedra):
    // countsAsContent false → no cuentan para el progreso de estudio;
    // collapsedByDefault true → el bloque arranca plegado en el índice.
    { "key": "fuente", "label": "Fuente", "plural": "Fuentes", "folder": "fuentes",
      "countsAsContent": false, "collapsedByDefault": true }
  ],

  // ── Rail: grupos SLOT ──────────────────────────────────────────────────────
  // Máximo 6 grupos × 8 ítems. Los grupos FIJOS (Mi ruta · Consultar · Wiki) los
  // dibuja la plataforma: no hay que declararlos acá.
  "rail": [
    {
      "id": "resolver",
      "label": "Resolver",
      "color": "--accent",
      "items": [
        // kind "tool": herramientas React propias de la materia. Son del Sprint 3;
        // hasta entonces la plataforma las muestra como "Próximamente" con su label.
        { "id": "explorador", "label": "Explorador de distribuciones", "icon": "chart",    "kind": "tool", "target": "explorador" },
        { "id": "taller",     "label": "Taller de resolución",         "icon": "function", "kind": "tool", "target": "taller" },
        { "id": "calc",       "label": "Calculadoras",                 "icon": "calc",     "kind": "tool", "target": "calc" },
        { "id": "lab",        "label": "Laboratorio Monte Carlo",      "icon": "flask",    "kind": "tool", "target": "lab" }
      ]
    },
    {
      "id": "material",
      "label": "Material",
      "color": "--u6",
      "items": [
        // kind "page": el target es el slug de una página que TIENE que existir.
        { "id": "formularios", "label": "Formulario general",  "icon": "sigma", "kind": "page", "target": "formulario-maestro" },
        // kind "link": el target es una URL absoluta; se abre en pestaña nueva.
        { "id": "catedra",     "label": "Campus de la cátedra", "icon": "link",  "kind": "link", "target": "https://campus.itba.edu.ar" }
      ]
    }
  ],

  // ── Botón flotante ─────────────────────────────────────────────────────────
  // Mismo formato que un ítem del rail (sin `id`), o null si la materia no lo usa.
  "fab": null,

  // ── Origen del wiki ────────────────────────────────────────────────────────
  "wiki": {
    "root": "wiki",              // carpeta raíz, RELATIVA al directorio del config
    "index": "index.md",         // se publica como el slug `indice`, tipo y división "meta"
    "log": "log.md",             // se publica como el slug `log`, tipo y división "meta"
    "ignore": [],                // carpetas de `root` que no se compilan (borradores, raw…)
    "divisionField": "unidad"    // qué campo del frontmatter dice la división
  }
}
```

## Cómo se traduce una página

Archivo `wiki/conceptos/aproximacion-normal-de-la-binomial.md`:

```yaml
---
titulo: Aproximación Normal de la Binomial
resumen: 'Caso más usado del TCL: para $n$ grande, $\mathrm{Bin}(n,p)\approx\mathcal{N}(np,\sqrt{npq})$.'
tipo: concepto
unidad: 7
orden: 9
tags: [tcl, binomial, normal]
fuentes: ["[[teorica-aproximacion-binomial-normal]]", "[[tp7-suma-de-va]]"]
actualizado: 2026-09-04
---
```

Compila a:

```jsonc
{
  "slug": "aproximacion-normal-de-la-binomial",   // el nombre del archivo sin .md
  "title": "Aproximación Normal de la Binomial",  // `titulo` → primer H1 → slug capitalizado
  "type": "concepto",                              // `tipo`, o el pageType de la carpeta
  "folder": "conceptos",
  "division": "7",                                 // el campo `unidad` (wiki.divisionField)
  "order": 9,                                      // `orden`
  "summary": "Caso más usado del TCL: …",          // `resumen`
  "tags": ["tcl", "binomial", "normal"],
  "sources": ["teorica-aproximacion-binomial-normal", "tp7-suma-de-va"],  // `fuentes`, sin [[ ]]
  "updatedAt": "2026-09-04",                       // `actualizado`
  "links": [ { "slug": "distribucion-binomial", "text": "Binomial" } ],   // wikilinks del cuerpo
  "headings": [ { "level": 1, "text": "…", "id": "…" } ],                 // H1..H4, TOC del lector
  "body": "# Aproximación Normal…",                // markdown crudo, sin frontmatter
  "words": 814
}
```

## Cosas que suelen salir mal

- **Una división del frontmatter que no está en `divisions`.** La página se conserva pero
  queda fuera del índice hasta que se declare la división. `publish` avisa.
- **`kind: "page"` apuntando a un slug que no existe.** El ítem del rail no abre nada.
  `validate` no lo detecta (no lee el wiki); el dry-run de `publish` sí lo va a mostrar como
  wikilink roto solo si además está enlazado desde alguna página, así que conviene
  verificarlo a mano.
- **Nombres de archivo con acentos o mayúsculas.** Se normalizan con advertencia, pero el
  slug resultante puede no ser el que esperan los wikilinks que ya existen. Conviene
  renombrar el archivo en el wiki.
- **Carpetas anidadas.** `wiki/fuentes/videos/clase-1.md` no se compila: solo se recorre el
  primer nivel de cada carpeta.
- **Renombrar un `.md`.** Para la plataforma es borrar una página y crear otra. El progreso
  del slug viejo se conserva por si vuelve, pero no se traslada al nuevo.
