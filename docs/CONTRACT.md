# El contrato Sinapsis ↔ materia

Una materia es una carpeta con un wiki markdown (estilo Obsidian) y un archivo
`sinapsis.config.json`. La plataforma no sabe nada más de ella. Todo lo que declara el
config lo dibuja el shell estándar; todo lo que no declara lo rellena la plataforma con
sus valores fijos. La fuente de verdad ejecutable es `packages/contract/src/index.ts`
(esquemas zod); este documento la explica.

## 1. `sinapsis.config.json`

```jsonc
{
  "contract": 1,
  "slug": "proba",                        // URL: /m/proba
  "name": "Probabilidad y Estadística",   // hero del índice (región 05)
  "code": "93.24",
  "institution": "ITBA",
  "color": "--u9",                        // hex #rrggbb o token --u1…--u9 / --u0
  "semester": "2026-1C",                  // sugerencia para la landing; el usuario puede moverla
  "division": { "singular": "Unidad", "abbr": "U", "plural": "Unidades" },   // región 06
  "divisions": [                          // orden del array = orden del índice
    { "key": "1", "name": "Estadística Descriptiva" },            // kind numbered (default)
    { "key": "0", "name": "Complementos", "kind": "extra" },      // sin número, color gris
    { "key": "eval", "name": "Evaluaciones", "kind": "extra", "color": "--ueval" }
  ],
  "pageTypes": [                          // bloques dentro de cada división, en este orden
    { "key": "concepto", "label": "Concepto", "plural": "Conceptos", "folder": "conceptos" },
    { "key": "fuente", "label": "Fuente", "plural": "Fuentes", "folder": "fuentes",
      "countsAsContent": false, "collapsedByDefault": true }
  ],
  "rail": [                               // grupos SLOT (región 03); máx. 6 grupos × 8 ítems
    { "id": "resolver", "label": "Resolver", "color": "--accent", "items": [
      { "id": "calc", "label": "Calculadoras", "icon": "calc", "kind": "tool", "target": "calc" },
      { "id": "formulario", "label": "Formulario", "icon": "sigma", "kind": "page", "target": "formulario-general" },
      { "id": "campus", "label": "Campus", "icon": "link", "kind": "link", "target": "https://…" }
    ] }
  ],
  "fab": null,                            // región 11: { icon, label, kind, target } o null
  "wiki": { "root": "wiki", "index": "index.md", "log": "log.md", "divisionField": "unidad" }
}
```

### Qué es FIJO y qué es SLOT (numeración del artboard 00)

| Región | Qué | Quién |
|---|---|---|
| 01 | Sello «S» → volver a la landing | FIJO |
| 02 | Grupos fijos del rail: Mi ruta (Inicio) · Consultar (Todo el wiki, Grafo) · Wiki (Índice, Registro) | FIJO |
| 03 | Grupos slot del rail (`rail[]`) | SLOT |
| 04 | Botón de plegar el índice | FIJO |
| 05 | Hero: `name` · `code` · `institution` | SLOT (datos) |
| 06 | Rótulo (`division.plural`) y árbol: divisiones → tipos → páginas | SLOT (datos) / FIJO (mecánica) |
| 07 | Cabecera: título, ⌘K, tema, avatar | FIJO |
| 08 | Migas | FIJO |
| 09 | Área de contenido (vista ancha 1120 / hoja 840) | FIJO |
| 10 | Columna derecha del lector (TOC, fuentes, enlazan aquí) | FIJO |
| 11 | Botón flotante (`fab`) | SLOT |

Geometría fija en toda materia: rail 52 · panel 250 · cabecera 40 · migas 28 · hoja 840 ·
vista ancha 1120 · columna 248.

### `kind` de los ítems del rail

| kind | target | Qué hace |
|---|---|---|
| `builtin` | `home` · `wiki` · `graph` · `flashcards` · `quiz` · `notes` · `favorites` | Abre una vista de la plataforma. En el Sprint 1 solo `home` y `wiki` existen; el resto muestra "Próximamente". |
| `page` | slug de una página del wiki | Abre esa página en el lector. |
| `link` | URL absoluta | Abre en pestaña nueva. |
| `tool` | id de la herramienta | Sprint 3 (plugins React). Hoy muestra "Próximamente" con el nombre. |

## 2. Frontmatter de cada página del wiki

```yaml
---
titulo: Distribución Normal          # obligatorio (si falta: primer H1; si no, el slug)
tipo: distribucion                    # clave de pageTypes; si falta, la del folder
unidad: 4                             # o el campo que diga wiki.divisionField; "" = transversal
orden: 8                              # opcional, 1..M dentro de la división
resumen: 'Una o dos frases…'          # alimenta tooltips y tarjetas
formato: pdf                          # libre (apunte, guia, video, slides…)
tags: [continua, normal]
fuentes: ["[[teorica-va-normal]]", "[[tp4]]"]   # wikilinks → slugs
actualizado: 2026-09-04
---
```

El slug de la página es el nombre del archivo sin `.md`. Los wikilinks `[[slug]]`,
`[[slug|texto]]` y `[[slug#ancla|texto]]` se resuelven contra los slugs de la misma
materia. Los callouts `> [!info|nota|tip|ejemplo|warn|figura]` se dibujan como avisos; el
callout `[!figura]` muestra su epígrafe (las figuras interactivas son Sprint 2+).

## 3. `Page` — lo que emite el compilador

```ts
{ slug, title, type, folder, division, order?, summary, format?, tags[], sources[],
  updatedAt?, links: [{slug, anchor?, text?}], headings: [{level, text, id}], body, words }
```

Idéntico al contrato de `build.py` de la app de Proba con `unidad→division`,
`tipo→type`, `resumen→summary`, `fuentes→sources`, `actualizado→updatedAt`, con una
divergencia deliberada (N0-21): si el cuerpo empieza con un `# H1` que repite el título, el
compilador lo quita de `body` y no lo incluye en `headings` (el lector ya muestra el título).
Los ids de `headings` los calcula `headingId()` del contrato y el lector aplica el mismo
algoritmo al renderizar, así `[[pagina#ancla]]` resuelve siempre igual (N0-22).

Divisiones sintéticas (N0-23): las páginas sin división caen en `meta` («Transversales») y las
que declaran una división que no está en el config caen en `otras` («Otras»); ambas las
calcula `effectiveDivisions()` del contrato y no cuentan como divisiones declaradas.

## 4. Sync

```
PUT /api/subjects/:slug/sync
Authorization: Bearer <SYNC_TOKEN>
{ config: SubjectConfig, pages: Page[], generatedAt, generator }
→ { subject, pages, created, updated, deleted, warnings[] }
```

El sync es idempotente y reemplaza el conjunto de páginas de la materia: las páginas que
ya no existen en el wiki se borran (el progreso del usuario sobre slugs borrados se
conserva por si vuelven); solo se reindexan en la búsqueda las páginas que cambiaron. Las
rutas del config (`wiki.root`, `wiki.index`, `wiki.log`) deben ser relativas y quedar dentro
de la carpeta del config; los `link` del rail solo admiten `http(s)` o `mailto`. El CLI lo
ejecuta (acepta `--wiki <dir>` para apuntar a otra carpeta y `--cwd <dir>` para resolver rutas
relativas):

```bash
pnpm sinapsis sync --config /ruta/a/sinapsis.config.json --api http://localhost:3000
```

## 5. API del Sprint 1

| Método y ruta | Auth | Qué |
|---|---|---|
| `POST /api/auth/google` `{credential}` | — | Verifica el ID token de Google, crea/actualiza el usuario, setea la cookie de sesión. |
| `POST /api/auth/dev` | solo dev | Sesión como usuario local (`AUTH_DEV_BYPASS=1`). |
| `POST /api/auth/logout` | sesión | Cierra la sesión. |
| `GET /api/me` | sesión | `User`. |
| `PATCH /api/me` `{theme}` | sesión | Tema global del usuario. |
| `GET /api/landing` | sesión | `SubjectCard[]` agrupables por `semester`. |
| `PUT /api/landing` `LandingLayoutInput` | sesión | Reordenar / mover entre cuatrimestres. |
| `POST /api/subjects` `CreateSubjectInput` | sesión | Crea una materia placeholder y la pone en la landing. |
| `DELETE /api/subjects/:slug/landing` | sesión | Quita la materia de la landing del usuario (conserva progreso). |
| `GET /api/subjects/:slug` | sesión | `SubjectDetail`. |
| `GET /api/subjects/:slug/pages/:page` | sesión | `PageDetail`. |
| `GET /api/subjects/:slug/search?q=` | sesión | `SearchHit[]` (FTS5 sobre título y cuerpo). |
| `PUT` / `DELETE /api/subjects/:slug/progress/:page` | sesión | Marcar / desmarcar como estudiada. |
| `PUT /api/subjects/:slug/sync` | `SYNC_TOKEN` | Ver §4. |

### Rutas del Sprint 2 (estudio)

| Método y ruta | Auth | Qué |
|---|---|---|
| `GET /api/landing/semesters` | sesión | Cuatrimestres del usuario en orden (incluye vacíos). `PUT /api/landing` acepta `semesters?: string[]`. |
| `GET /api/subjects/:slug/graph` | sesión | `GraphData`: páginas y wikilinks resueltos (`page_links`). |
| `GET /api/subjects/:slug/study` | sesión | `StudyContent`: mazos, quizzes, plan y kits del wiki + mazos automáticos por división. |
| `GET /api/subjects/:slug/study/state` | sesión | `StudyState`: SRS, favoritos, apuntes, tareas hechas, intentos. |
| `POST /api/subjects/:slug/study/srs/:cardId` `{grade}` | sesión | Califica una tarjeta (SM-2, `sm2` del contrato) → `SrsState`. `DELETE` reinicia. |
| `PUT` / `DELETE /api/subjects/:slug/bookmarks/:page` | sesión | Favorito. |
| `PUT /api/subjects/:slug/notes/:page` `{body}` / `DELETE` | sesión | Apunte markdown por página. |
| `PUT` / `DELETE /api/subjects/:slug/tasks/:taskId` | sesión | Tarea del plan hecha / deshecha. |
| `POST /api/subjects/:slug/quiz/:quizId/attempts` `{score,total}` | sesión | Registra un intento. |

## 6. Skill `/sinapsis` (agente por materia)

- `/sinapsis init` — lee el wiki de la materia, propone `sinapsis.config.json` (divisiones a
  partir de los valores del frontmatter, tipos a partir de las carpetas, rail vacío) y lo
  deja para revisión.
- `/sinapsis sync` — compila y sincroniza contra el API local; reporta conteos y warnings
  (wikilinks rotos, páginas sin `resumen`).
- `/sinapsis status` — muestra el estado de la materia en la plataforma (última sync,
  páginas, divisiones sin páginas).
