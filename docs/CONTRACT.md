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
| `GET /api/subjects/:slug/study/state` | sesión | `StudyState`: SRS (solo tarjetas que existen en el material vigente; las filas huérfanas se conservan en la base), favoritos, apuntes, tareas hechas, últimos 50 intentos. |
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

## 7. Material de estudio (`wiki.study`)

Los mazos, el quiz, el plan y los kits son **contenido de la materia**, no de la plataforma
(N0-27): viven en la carpeta que declara `wiki.study` (por defecto `estudio/`), que es
**relativa al config, no al wiki** —así `--wiki <otro-vault>` no la desvía—, se compilan con
el resto del wiki y viajan en `SyncPayload.study` (`StudyContent`). Todo es opcional: sin
carpeta, `payload.study` viaja vacío y la plataforma autogenera un mazo por división con los
`resumen` de las páginas (`autoDecks`, marcado `source: "auto"`), que además siempre agrega
como complemento. El campo viaja en cada sync —también vacío— para que el sync reemplace el
material igual que reemplaza las páginas: borrar la carpeta lo borra de la plataforma. Su
ausencia queda reservada para un CLI anterior al Sprint 2, y el API la lee como «dejá lo que
ya tenías».

```
estudio/
  flashcards-<lo-que-sea>.md   → Deck    (tipo: flashcards)
  quiz-<lo-que-sea>.md         → Quiz    (tipo: quiz)
  plan.json                    → Plan
  kits.json                    → Kit[]
```

Los `.md` sin `tipo` (un `README.md`, notas del autor) se ignoran en silencio. Nada de esto
puede romper un sync: los problemas de formato y las referencias rotas son **advertencias**,
igual que los wikilinks rotos.

### Mazos — `tipo: flashcards`

```markdown
---
tipo: flashcards
titulo: Definiciones clave
id: definiciones-clave      # opcional; si falta, el nombre del archivo normalizado
division: "3"               # opcional; una clave de config.divisions
descripcion: Las que se toman siempre.   # opcional
---

## Definición de esperanza $E[X]$

> pagina: esperanza          # opcional: página del wiki relacionada
> tags: discreta, momentos   # opcional

$E[X]=\sum_x x\,p_X(x)$.
```

Cada `##` abre una tarjeta: el encabezado es el **anverso** y lo que sigue, hasta el próximo
`##`, el **reverso** (markdown y KaTeX, igual que una página). Los `###` no abren tarjeta, y
los `##` dentro de un bloque de código o de un `$$…$$` tampoco. Las directivas `pagina:` y
`tags:` valen al principio del reverso, con o sin `>` delante (así se leen como un callout en
Obsidian). Las tarjetas heredan la `division` del mazo.

El id de una tarjeta es `<id del mazo>:<n>`, con `n` correlativo: es estable mientras no se
reordenen las tarjetas. Como el SRS del usuario se guarda por id, para fijarlo se escribe al
final del encabezado: `## Anverso {#mi-id}`.

### Quizzes — `tipo: quiz`

```markdown
---
tipo: quiz
titulo: Quiz conceptual
id: quiz-general
---

## ¿Qué distribución tiene media = varianza?

> pagina: distribucion-poisson

- [ ] Binomial
- [x] Poisson
- [ ] Normal

> Poisson: $E[X]=V(X)=\lambda$.

## ¿Qué mide la potencia de una prueba?

- [ ] $\alpha$ {alt: alfa}
- [x] $1-\beta$ {alt: uno menos beta}
```

Cada `##` abre una pregunta; el texto entre el encabezado y la lista se suma al enunciado.
Las opciones son una lista de tildes (`- [x]` la correcta, `- [ ]` las demás) y el blockquote
que va **después** de la lista es la explicación. Hacen falta ≥ 2 opciones y ≥ 1 correcta: si
no, la pregunta se descarta con una advertencia (y si no queda ninguna, el quiz entero).

Una opción que es **solo matemática** no deja nada que leer en voz alta: el `{alt: …}` al
final de la línea le da el texto que anuncia el lector de pantalla (`QuizOption.alt`). Es
opcional y solo hace falta ahí; si al quitarlo la opción quedara sin texto, la directiva se
ignora y `{alt: …}` se toma como el texto de la opción.

### `plan.json` y `kits.json`

JSON validado contra `Plan` y `Kit[]` del contrato; los errores se informan con la ruta del
campo (`phases.0.milestones.2.title: Required`).

```jsonc
// plan.json — fases → hitos → tareas
{ "title": "Plan de estudio",
  "phases": [{ "id": "fase-1", "title": "Parcial 1", "subtitle": "U1 y U2",
    "date": "2026-10-01",            // opcional, AAAA-MM-DD
    "scope": "Qué cae en este examen (markdown)",
    "milestones": [{ "id": "fase-1-h1", "title": "Unidad 1", "divisions": ["1"],
      "tasks": [{ "id": "fase-1-h1-t1", "label": "Leer la teoría", "kind": "read", "target": "1" }] }] }] }
```

```jsonc
// kits.json — paquetes de material para un objetivo
[{ "id": "parcial-1", "title": "Parcialito 1 · TP1–TP2", "description": "…",
   "divisions": ["1", "2"], "pages": ["esperanza"], "decks": ["definiciones-clave"],
   "quizzes": ["quiz-general"], "tools": ["calc"] }]
```

`kind` de una tarea y qué es su `target`:

| `kind` | `target` | Qué abre |
|---|---|---|
| `read` | clave de división | La división en el índice. |
| `cards` | id de mazo (o sin `target`) | El mazo (o el repaso del día). |
| `quiz` | id de quiz | El quiz. |
| `tool` | id de ítem del `rail` | Una herramienta de la materia. |
| `exercises` | slug de página o URL (opcional) | Práctica: TP, guía de ejercicios. |
| `custom` | slug de página o URL (opcional) | Cualquier otra cosa. |

Además del `label`, una tarea puede llevar `detail`: una línea corta con el costo estimado o
la aclaración («41 ejercicios · 14–16 h»), que la plataforma muestra aparte y no dentro del
nombre de la tarea. Las fases y los hitos admiten `icon` (un nombre del registro cerrado de
iconos, el mismo del `rail`); si falta, la plataforma usa el suyo.

### Qué se verifica

`sinapsis sync --dry-run` levanta una advertencia (nunca un error) por cada:

- `pagina:` de una tarjeta o pregunta, o `pages[]` de un kit, que apunta a un slug inexistente;
- `decks[]` / `quizzes[]` de un kit, o `target` de una tarea `cards` / `quiz`, que no existe;
- `target` de una tarea `read` que no es una división declarada;
- `target` de una tarea `tool` que no es un id de ítem del `rail` del config;
- `division` de un mazo, quiz, hito o kit que no está en `config.divisions`;
- `tools[]` de un kit que no es un id de ítem del `rail` del config;
- id repetido (mazo, quiz, tarjeta, pregunta o kit);
- tarjeta sin reverso, pregunta sin opciones o sin correcta, JSON inválido.

`sinapsis validate` corre las mismas verificaciones salvo las que necesitan las páginas del
wiki (no lo compila): las referencias a slugs se ven en el dry-run del sync.
