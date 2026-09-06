# El contrato Sinapsis ↔ materia (referencia)

Versión adaptada, para el agente de materia, de `docs/CONTRACT.md` del repositorio de la
plataforma. La fuente de verdad ejecutable son los esquemas zod de
`packages/contract/src/index.ts`; si algo de acá contradice al CLI, gana el CLI (y hay que
reportarlo).

Una materia es una carpeta con un wiki markdown estilo Obsidian y un archivo
`sinapsis.config.json`. La plataforma no sabe nada más de ella.

---

## 1. `sinapsis.config.json`

### Campos

| Campo | Tipo | Obligatorio | Notas |
|---|---|---|---|
| `contract` | `1` | no (default 1) | Versión del contrato. |
| `slug` | string | **sí** | `^[a-z0-9][a-z0-9-]*$`, ≤ 120. Es la URL: `/m/<slug>`. |
| `name` | string | **sí** | ≤ 120. Hero del índice. |
| `code` | string | **sí** | ≤ 24. Código de cátedra. |
| `institution` | string | **sí** | ≤ 80. |
| `color` | string | no | `#rrggbb` o token `--u1`…`--u9`, `--u0`. |
| `semester` | string | no | ≤ 24. Ej. `2026-1C`. Sugerencia para la landing. |
| `division` | objeto | **sí** | `{ singular, abbr, plural }`. Nomenclatura del temario. |
| `divisions` | array | **sí** | 1..64. Ver abajo. |
| `pageTypes` | array | **sí** | 1..24. Ver abajo. |
| `rail` | array | no (default `[]`) | 0..6 grupos slot. |
| `fab` | objeto \| null | no (default `null`) | Botón flotante. |
| `wiki` | objeto | no (defaults) | Origen del wiki. |

### `division`

```json
{ "singular": "Unidad", "abbr": "U", "plural": "Unidades" }
```

`singular` ≤ 32, `abbr` ≤ 6, `plural` ≤ 32. Una sola nomenclatura por materia. Ejemplos
habituales: Unidad/U/Unidades, Semana/S/Semanas, Módulo/M/Módulos, Capítulo/C/Capítulos.

### `divisions[]`

```json
{ "key": "3", "name": "Variables Aleatorias Discretas", "kind": "numbered", "color": "--u3", "order": 3 }
```

| Campo | Notas |
|---|---|
| `key` | **obligatorio**. `^[a-z0-9_-]+$/i`, ≤ 24. Es el valor que escribe el frontmatter. |
| `name` | **obligatorio**. ≤ 120. Nombre real del programa. |
| `kind` | `numbered` (default) o `extra`. Las `extra` no se numeran y van en gris. |
| `color` | opcional. Si falta, la plataforma lo deriva del índice. |
| `order` | opcional. Si falta, manda el orden del array. |

La clave `meta` está **reservada** para las páginas transversales; no la uses en `divisions`.

**Color paramétrico:** con N ≤ 9 divisiones numeradas se usa la escala heráldica
`--u1`…`--u9`; con N > 9 se barre el matiz en `oklch` con luminosidad y croma fijos. No hay
que declarar nada: sale del índice de la división.

### `pageTypes[]`

```json
{ "key": "fuente", "label": "Fuente", "plural": "Fuentes", "folder": "fuentes",
  "countsAsContent": false, "collapsedByDefault": true }
```

| Campo | Notas |
|---|---|
| `key` | **obligatorio**. `^[a-z][a-z0-9_-]*$`, ≤ 32. Es lo que escribe `tipo:` en el frontmatter. |
| `label` / `plural` | **obligatorios**. ≤ 40. |
| `folder` | opcional, ≤ 64. Carpeta del wiki cuyas páginas son de este tipo por defecto. |
| `countsAsContent` | default `true`. `false` para material de referencia: no cuenta en el progreso. |
| `collapsedByDefault` | default `false`. `true` pliega el bloque en el índice. |

### `rail[]` y `fab`

Grupo: `{ id, label, color?, items[] }` — `id` `^[a-z][a-z0-9_-]*$`, 1..8 ítems.
Ítem: `{ id, label, icon, kind, target, hint? }`.
`fab`: lo mismo sin `id`, o `null`.

`icon` sale de un registro cerrado: `home`, `map`, `grid`, `book`, `sigma`, `graph`,
`cards`, `quiz`, `pencil`, `timer`, `function`, `calc`, `compass`, `layers`, `notebook`,
`star`, `list`, `clock`, `square`, `circle`, `diamond`, `line`, `triangle`, `flask`,
`chart`, `table`, `link`, `tool`, `sparkle`, `wrench`.

| `kind` | `target` | Qué abre |
|---|---|---|
| `builtin` | `home` · `wiki` · `graph` · `flashcards` · `quiz` · `notes` · `favorites` | Vista de la plataforma. Hoy solo `home` y `wiki` existen. |
| `page` | slug de una página | Esa página en el lector. |
| `link` | URL absoluta (`https://…`) | Pestaña nueva. |
| `tool` | id de la herramienta | Sprint 3. Hoy: "Próximamente". |

### `wiki`

```json
{ "root": "wiki", "index": "index.md", "log": "log.md", "ignore": [],
  "divisionField": "unidad", "study": "estudio" }
```

| Campo | Default | Notas |
|---|---|---|
| `root` | `"wiki"` | Carpeta raíz, **relativa al directorio del config**. |
| `index` | — | Ruta relativa a `root`. Se publica como el slug `indice`. |
| `log` | — | Ídem, como el slug `log`. |
| `ignore` | `[]` | Carpetas de `root` que no se compilan. |
| `divisionField` | `"division"` | Campo del frontmatter que dice la división. |
| `study` | `"estudio"` | Material de estudio (§7), **relativo al config**, no a `root`. |

### Qué es FIJO y qué es SLOT

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
| 10 | Columna derecha del lector (TOC, fuentes, enlaces entrantes) | FIJO |
| 11 | Botón flotante (`fab`) | SLOT |

Geometría fija en toda materia: rail 52 · panel 250 · cabecera 40 · migas 28 · hoja 840 ·
vista ancha 1120 · columna 248.

---

## 2. Frontmatter de cada página

```yaml
---
titulo: Distribución Normal          # si falta: primer H1; si no, el slug capitalizado
tipo: distribucion                    # clave de pageTypes; si falta, la de la carpeta
unidad: 4                             # el campo de wiki.divisionField; vacío o ausente = transversal
orden: 8                              # opcional, entero positivo dentro de la división
resumen: 'Una o dos frases…'          # alimenta tooltips y tarjetas
formato: pdf                          # libre (apunte, guia, video, slides…)
tags: [continua, normal]
fuentes: ["[[teorica-va-normal]]", "[[tp4]]"]   # wikilinks → slugs
actualizado: 2026-09-04
---
```

Se aceptan también los nombres en inglés: `title`, `type`, `order`, `summary`, `format`,
`sources`, `updatedAt`.

**Bloque.** El frontmatter es el bloque YAML inicial entre `---`. Se parsea con YAML; si el
bloque no es YAML válido, se cae a un parser tolerante línea por línea (`clave: valor`,
listas `[a, b]`, cadenas entre comillas). Eso hace que un título con dos puntos sin comillas
siga funcionando, pero conviene entrecomillarlo igual.

**Slug.** El nombre del archivo sin `.md`, `^[a-z0-9][a-z0-9-]*$`. Si no cumple, se
normaliza (minúsculas, sin acentos, espacios → guiones) y se levanta una advertencia.

**Cuerpo.** Markdown crudo. La plataforma lo renderiza en el cliente con KaTeX, tablas GFM,
wikilinks y callouts de Obsidian `> [!info|nota|tip|ejemplo|warn|figura]`. El callout
`[!figura]` muestra su epígrafe (las figuras interactivas son Sprint 2+).

**Wikilinks.** `[[slug]]`, `[[slug|texto]]`, `[[slug#ancla|texto]]` y `[[#ancla]]` (misma
página). Se desescapa `\|` (los pipes de las tablas de Obsidian). Se deduplica por la terna
(slug, ancla, texto).

**Encabezados.** Se toman H1..H4 para el TOC del lector. Los que estén dentro de un bloque
`$$…$$` se ignoran. El `id` de cada encabezado se calcula quitando `$math$`, wikilinks y
`*_\``, bajando a minúsculas y dejando `[a-z0-9áéíóúñü]` con guiones.

---

## 3. `Page` — lo que emite el compilador

```ts
{
  slug: string,            // ^[a-z0-9][a-z0-9-]*$
  title: string,           // ≤ 200
  type: string,            // clave de pageTypes, o "meta" para índice/registro
  folder: string,          // carpeta de origen; "meta" para las de la raíz
  division: string,        // clave de división; "meta" si es transversal
  order?: number,          // entero positivo
  summary: string,         // ≤ 1200, "" si falta
  format?: string,
  tags: string[],
  sources: string[],       // slugs de las fuentes del frontmatter
  updatedAt?: string,
  links: { slug, anchor?, text? }[],
  headings: { level, text, id }[],
  body: string,            // markdown crudo, sin frontmatter
  words: number
}
```

### Reglas del recorrido

1. Se recorren las **carpetas de primer nivel** de `wiki.root` que tengan al menos un `.md`,
   primero las declaradas en `pageTypes[].folder` (en ese orden) y después el resto en orden
   alfabético. Las de `wiki.ignore` y las que empiezan con `.` se saltan.
2. Dentro de cada carpeta, solo los `.md` del primer nivel, en orden alfabético. Las
   subcarpetas se ignoran con advertencia.
3. `wiki.index` y `wiki.log` se agregan al final como los slugs `indice` y `log`, con
   `type` `meta`, `folder` `meta` y `division` `meta`.
4. Si dos archivos producen el mismo slug, se conserva el primero y se avisa.

### Advertencias que puede emitir

`slug normalizado` · `slug duplicado` · `subcarpeta ignorada` · `división normalizada` ·
`orden inválido` · `división no está en config.divisions` · `tipo no está en config.pageTypes` ·
`páginas sin "resumen"` · `wikilinks rotos`.

Ninguna descarta contenido salvo el slug duplicado.

---

## 4. Sync

```
PUT {api}/api/subjects/{slug}/sync
Authorization: Bearer <SYNC_TOKEN>
Content-Type: application/json

{ config: SubjectConfig, pages: Page[], study?: StudyContent, generatedAt: string, generator?: string }
→ { subject, pages, created, updated, deleted, warnings[] }
```

`study` es lo compilado de la carpeta `wiki.study` (§7). Viaja en cada sync, también vacío
(el sync lo reemplaza igual que a las páginas: borrar la carpeta lo borra de la plataforma).
Sin material propio, la plataforma autogenera un mazo por división con los `resumen`.

Idempotente y **reemplaza** el conjunto de páginas de la materia: las que ya no están en el
wiki se borran. El progreso del usuario sobre slugs borrados se conserva por si vuelven.

## 5. API del Sprint 1

| Método y ruta | Auth | Qué |
|---|---|---|
| `POST /api/auth/google` | — | Login con el ID token de Google. |
| `POST /api/auth/dev` | solo dev | Sesión local (`AUTH_DEV_BYPASS=1`). Es lo que usa `status`. |
| `POST /api/auth/logout` | sesión | Cierra la sesión. |
| `GET /api/me` · `PATCH /api/me` | sesión | Usuario y tema. |
| `GET /api/landing` · `PUT /api/landing` | sesión | Grilla de materias del usuario. |
| `POST /api/subjects` | sesión | Materia placeholder desde la landing. |
| `DELETE /api/subjects/:slug/landing` | sesión | Quita la materia de la landing. |
| `GET /api/subjects/:slug` | sesión | `SubjectDetail`: config, páginas sin cuerpo, progreso. |
| `GET /api/subjects/:slug/pages/:page` | sesión | `PageDetail`: página, enlaces entrantes, estudiada. |
| `GET /api/subjects/:slug/search?q=` | sesión | Búsqueda de texto completo. |
| `PUT` / `DELETE /api/subjects/:slug/progress/:page` | sesión | Marcar / desmarcar estudiada. |
| `PUT /api/subjects/:slug/sync` | `SYNC_TOKEN` | Ver §4. |

## 6. La skill `/sinapsis`

- `init` — lee el wiki, propone el `sinapsis.config.json` (tipos de las carpetas, divisiones
  de los valores del frontmatter, rail vacío) y lo deja para revisión.
- `validate` — valida el config contra el contrato.
- `sync` — compila y sincroniza; reporta conteos y advertencias.
- `status` — última sync, páginas, divisiones sin páginas.

---

## 7. Material de estudio (`wiki.study`)

Mazos, quizzes, plan y kits. Carpeta declarada en `wiki.study` (por defecto `estudio/`),
**relativa al config** (no al wiki: `--wiki <otro-vault>` no la mueve). Todo opcional.

```
estudio/
  flashcards-*.md   → Deck   (tipo: flashcards)
  quiz-*.md         → Quiz   (tipo: quiz)
  plan.json         → Plan
  kits.json         → Kit[]
```

Los `.md` sin `tipo` en el frontmatter (README, notas) se ignoran en silencio.

### Mazo (`tipo: flashcards`)

| Frontmatter | Obligatorio | Notas |
|---|---|---|
| `tipo: flashcards` | sí | Lo que hace que el archivo sea un mazo. |
| `titulo` | sí | Nombre del mazo en la plataforma. |
| `id` | no | Si falta, el nombre del archivo normalizado. Lo usan `plan.json` y `kits.json`. |
| `division` | no | Una clave de `config.divisions`; las tarjetas la heredan. |
| `descripcion` | no | Una o dos frases. |

Cada `##` abre una tarjeta: encabezado = anverso, cuerpo hasta el próximo `##` = reverso
(markdown + KaTeX). Los `###` no abren tarjeta, ni los `##` dentro de un bloque de código o
de un `$$…$$`. Al principio del reverso valen dos directivas, con o sin `>` delante:

- `pagina: <slug>` — página del wiki relacionada («ver en el wiki»).
- `tags: a, b` — etiquetas de la tarjeta.

Id de tarjeta: `<id del mazo>:<n>`, `n` correlativo. **Reordenar tarjetas cambia los ids y
pierde el progreso del SRS**; para fijarlo: `## Anverso {#mi-id}`.

### Quiz (`tipo: quiz`)

Mismo frontmatter (`tipo: quiz`). Cada `##` abre una pregunta; el texto entre el encabezado y
la lista se suma al enunciado. Opciones: lista de tildes, `- [x]` correcta, `- [ ]` incorrecta
(≥ 2 opciones, ≥ 1 correcta). El blockquote **posterior** a la lista es la explicación.
`pagina:` vale igual que en los mazos.

### `plan.json` (`Plan`)

```jsonc
{ "title": "Plan de estudio",
  "phases": [{
    "id": "fase-1", "title": "Parcial 1", "subtitle": "U1 y U2",
    "date": "2026-10-01",             // opcional, AAAA-MM-DD
    "scope": "Qué cae (markdown)",    // opcional
    "milestones": [{
      "id": "fase-1-h1", "title": "Unidad 1", "divisions": ["1"],
      "tasks": [
        { "id": "fase-1-h1-t1", "label": "Leer la teoría", "kind": "read", "target": "1" },
        { "id": "fase-1-h1-t2", "label": "Flashcards", "kind": "cards", "target": "definiciones-clave" }
      ] }] }] }
```

| `kind` | `target` |
|---|---|
| `read` | clave de división |
| `cards` | id de mazo (o sin `target`: repaso del día) |
| `quiz` | id de quiz |
| `exercises` | slug de página o URL (opcional) |
| `custom` | slug de página o URL (opcional) |

Los ids son la clave del progreso del usuario («tarea hecha»): conviene que sean estables
(`fase-1`, `fase-1-h2-t3`).

### `kits.json` (`Kit[]`)

```jsonc
[{ "id": "parcial-1", "title": "Parcialito 1 · TP1–TP2", "description": "…",
   "divisions": ["1", "2"], "pages": ["esperanza"], "decks": ["definiciones-clave"],
   "quizzes": ["quiz-general"], "tools": ["calc"] }]
```

`tools` son **ids de ítems del `rail`** del config, no URLs.

### Advertencias del material de estudio

`sinapsis sync --dry-run` avisa (sin fallar) por: página / mazo / quiz / división / herramienta
inexistente, `target` de una tarea `read` que no es una división, id repetido (mazo, quiz,
tarjeta, pregunta, kit), tarjeta sin reverso, pregunta con menos de 2 opciones o sin correcta,
y JSON que no cumple el contrato (con la ruta del campo).

`sinapsis validate` corre lo mismo salvo lo que necesita las páginas del wiki (no lo compila).
