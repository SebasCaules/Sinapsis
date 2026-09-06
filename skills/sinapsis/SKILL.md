---
name: sinapsis
description: Conecta el wiki markdown de esta materia con la plataforma Sinapsis — crea o corrige su `sinapsis.config.json`, escribe el material de estudio (mazos de flashcards, quiz, plan y kits en `estudio/`), publica las herramientas y figuras de la materia (bundles de `tools/`), compila el wiki y lo sincroniza contra el API, y propone cambios a la plataforma cuando la materia necesita algo común. Usar cuando el usuario invoque `/sinapsis`, `/sinapsis init`, `/sinapsis sync`, `/sinapsis status`, `/sinapsis validate`, `/sinapsis tools` o `/sinapsis propose`, o cuando pida "sincronizar la materia con Sinapsis", "subir el wiki a Sinapsis", "generar el config de Sinapsis", "ver el estado de la materia en Sinapsis", "agregar flashcards / quiz / plan de estudio a la materia", "publicar las herramientas o las figuras de la materia", "proponer un cambio a la plataforma" o "revisar los wikilinks rotos del wiki". No usar para editar contenido del wiki que el usuario no haya pedido cambiar.
---

# `/sinapsis` — el agente de materia

Esta skill se invoca **dentro del repositorio de una materia** (el vault de Obsidian con su
wiki markdown), no dentro del repositorio de la plataforma. Su trabajo es mantener el puente
entre las dos cosas: un `sinapsis.config.json` correcto y un wiki que compile sin
advertencias.

## Persona y límites

Sos el agente de **esta** materia. Tu alcance:

- **Sí**: leer y editar el wiki de la materia, su `sinapsis.config.json`, y correr el CLI de
  Sinapsis en modo lectura/sync.
- **No**: parchear el repositorio de la plataforma (`$SINAPSIS_HOME`) por las suyas. Si algo
  del CLI, del API o del contrato está mal o le falta algo a la materia, hay un camino
  formal: `sinapsis propose` (ver «Proponer un cambio a la plataforma»). Nunca commitee en
  `main` de la plataforma ni edite sus archivos sin proponer.
- **No**: reescribir contenido del wiki por tu cuenta. Los arreglos de `resumen` faltantes o
  wikilinks rotos se **proponen** y se aplican solo si el usuario los autoriza.
- **Siempre**: cerrar con un reporte de qué se sincronizó (páginas, divisiones) y qué
  advertencias quedaron abiertas.

## Dónde está el CLI

El CLI vive en el repositorio de la plataforma. Su ubicación canónica es la variable de
entorno `SINAPSIS_HOME`; si no está definida, `~/Desktop/Projects/Sinapsis`.

```bash
SINAPSIS_HOME="${SINAPSIS_HOME:-$HOME/Desktop/Projects/Sinapsis}"
pnpm --dir "$SINAPSIS_HOME" sinapsis -- <comando> [opciones]
```

Las rutas relativas que se le pasen (`--config`, `--wiki`, `--out`) se resuelven **contra el
directorio desde el que invoca**, no contra el del CLI (también puede fijarse explícitamente con `--cwd <dir>`). Es decir: situado en el repo de la
materia, `--config sinapsis.config.json` apunta al de la materia.

Comandos:

| Comando | Qué hace |
|---|---|
| `init [--wiki <dir>] [--out <file>] [--slug <slug>] [--force]` | Propone un `sinapsis.config.json` a partir del wiki y deja lista la carpeta `estudio/`. |
| `validate [--config <file>]` | Valida el config contra el contrato y el formato del material de estudio. Sale 1 solo si el config falla. |
| `sync [--config <file>] [--wiki <dir>] [--api <url>] [--token <t>] [--dry-run] [--out <file>] [--tools]` | Compila y sincroniza; con `--tools`, también publica los bundles de herramientas. |
| `status [--config <file>] [--api <url>]` | Estado de la materia en la plataforma. |
| `tools build [--dir <carpeta>] [--minify]` | Valida y empaqueta los bundles de `tools/`. |
| `tools push [--dir <carpeta>] [--api <url>] [--token <t>]` | Construye y sube los bundles. |
| `tools list [--api <url>]` | Bundles que la materia tiene publicados. |
| `propose --subject <slug> --title "<qué>" --body "<por qué>"` | Propone un cambio a la **plataforma** en una rama de su repositorio. |

Variables de entorno: `SINAPSIS_API` (por defecto `http://localhost:3000`),
`SINAPSIS_TOKEN` o `SYNC_TOKEN` (token de sync), `SINAPSIS_WEB` (por defecto
`http://localhost:5173`).

---

## El contrato, en corto

Referencia completa y comentada: `reference/contrato.md` y `reference/config-ejemplo.md`.

### 1. `sinapsis.config.json`

Todo lo que la plataforma sabe de la materia. Lo que el config no declara, lo rellena la
plataforma con sus valores fijos.

```jsonc
{
  "contract": 1,
  "slug": "proba",                        // URL: /m/proba
  "name": "Probabilidad y Estadística",
  "code": "93.24",
  "institution": "ITBA",
  "color": "--u9",                        // hex #rrggbb o token --u1…--u9 / --u0
  "semester": "2026-1C",                  // sugerencia para la landing
  "division": { "singular": "Unidad", "abbr": "U", "plural": "Unidades" },
  "divisions": [                          // el orden del array es el del índice
    { "key": "1", "name": "Estadística Descriptiva" },        // kind "numbered" (default)
    { "key": "0", "name": "Complementos", "kind": "extra" },  // sin número, gris
    { "key": "eval", "name": "Evaluaciones", "kind": "extra", "color": "--ueval" }
  ],
  "pageTypes": [                          // bloques dentro de cada división, en este orden
    { "key": "concepto", "label": "Concepto", "plural": "Conceptos", "folder": "conceptos" },
    { "key": "fuente", "label": "Fuente", "plural": "Fuentes", "folder": "fuentes",
      "countsAsContent": false, "collapsedByDefault": true }
  ],
  "rail": [                               // grupos SLOT; máximo 6 grupos × 8 ítems
    { "id": "resolver", "label": "Resolver", "color": "--accent", "items": [
      { "id": "formulario", "label": "Formulario", "icon": "sigma", "kind": "page",
        "target": "formulario-general" },
      { "id": "campus", "label": "Campus", "icon": "link", "kind": "link",
        "target": "https://campus.itba.edu.ar" }
    ] }
  ],
  "fab": null,                            // { icon, label, kind, target } o null
  "wiki": { "root": "wiki", "index": "index.md", "log": "log.md",
            "ignore": [], "divisionField": "unidad" }
}
```

**FIJO vs SLOT.** La plataforma dibuja siempre: el sello para volver a la landing, los grupos
fijos del rail (Mi ruta · Consultar · Wiki), el botón de plegar el índice, la mecánica del
árbol, la cabecera con ⌘K y tema, las migas, el área de contenido y la columna derecha del
lector. La materia solo aporta **datos** (hero, nomenclatura, divisiones, tipos) y los
**grupos slot** del rail más el `fab`.

**`kind` de los ítems del rail:**

| `kind` | `target` | Qué abre |
|---|---|---|
| `builtin` | `home` · `plan` · `kits` · `wiki` · `graph` · `flashcards` · `quiz` · `notes` · `favorites` | Una vista de la plataforma. No hace falta declararlas: los grupos fijos del rail ya las traen. |
| `page` | slug de una página | Esa página en el lector. |
| `link` | URL absoluta | Pestaña nueva. |
| `tool` | id de una **vista** de algún bundle de `tools/` | Esa herramienta de la materia (`/m/<slug>/t/<vista>`). Sin bundle que la registre, "Próximamente". |

### 2. Frontmatter de cada página

```yaml
---
titulo: Distribución Normal          # si falta: primer H1; si no, el slug
tipo: distribucion                    # clave de pageTypes; si falta, la de la carpeta
unidad: 4                             # el campo que diga wiki.divisionField; "" = transversal
orden: 8                              # opcional, entero positivo dentro de la división
resumen: 'Una o dos frases…'          # alimenta tooltips y tarjetas
formato: pdf                          # libre (apunte, guia, video, slides…)
tags: [continua, normal]
fuentes: ["[[teorica-va-normal]]", "[[tp4]]"]   # wikilinks → slugs
actualizado: 2026-09-04
---
```

El **slug** de la página es el nombre del archivo sin `.md` y tiene que ser
`^[a-z0-9][a-z0-9-]*$`. Los wikilinks `[[slug]]`, `[[slug|texto]]` y `[[slug#ancla|texto]]`
se resuelven contra los slugs de la misma materia; `[[#ancla]]` apunta a la propia página.
El compilador emite por página: `slug, title, type, folder, division, order?, summary,
format?, tags[], sources[], updatedAt?, links[], headings[], body, words`.

**Reglas de compilación que conviene tener presentes:**

- Solo se recorre el **primer nivel** de cada carpeta de `wiki.root`. Las subcarpetas se
  ignoran (con advertencia).
- Las carpetas listadas en `wiki.ignore` no se compilan.
- `wiki.index` y `wiki.log` se publican como los slugs `indice` y `log`, con
  `type: "meta"` y `division: "meta"`.
- Una división que no esté en `config.divisions` **no descarta la página**: levanta una
  advertencia y la página se conserva.
- Un slug de archivo inválido se normaliza (con advertencia): `Distribución Normal.md`
  → `distribucion-normal`.

### 3. Sync

```
PUT {api}/api/subjects/{slug}/sync    Authorization: Bearer <SYNC_TOKEN>
{ config, pages, generatedAt, generator }  →  { subject, pages, created, updated, deleted, warnings[] }
```

Es **idempotente y reemplaza** el conjunto de páginas: las que ya no existen en el wiki se
borran de la plataforma. El progreso del usuario sobre slugs borrados se conserva por si
vuelven. Renombrar un archivo `.md` equivale a borrar una página y crear otra.

### 4. Material de estudio (`estudio/`)

Mazos de flashcards, quizzes, plan de estudio y kits. Es **contenido de la materia**: vive en
la carpeta que declara `wiki.study` (por defecto `estudio/`), **relativa al config, no al
wiki**, y viaja en `payload.study` con el resto del sync. Todo es opcional: sin carpeta, la
plataforma autogenera un mazo por división con los `resumen` de las páginas.

```
estudio/
  flashcards-definiciones-clave.md   # tipo: flashcards → un mazo
  quiz-general.md                    # tipo: quiz       → un cuestionario
  plan.json                          # fases → hitos → tareas
  kits.json                          # paquetes de páginas + mazos + quizzes + herramientas
```

**Mazo.** Cada `##` abre una tarjeta: el encabezado es el anverso; lo que sigue, hasta el
próximo `##`, el reverso (markdown y KaTeX). `pagina:` y `tags:` son directivas opcionales al
principio del reverso, con o sin `>` delante.

```markdown
---
tipo: flashcards
titulo: Definiciones clave
id: definiciones-clave      # opcional; si falta, el nombre del archivo
division: "3"               # opcional; una clave de config.divisions
---

## Definición de esperanza $E[X]$

> pagina: esperanza
> tags: discreta, momentos

$E[X]=\sum_x x\,p_X(x)$.
```

El id de una tarjeta es `<id del mazo>:<n>`; como el repaso espaciado del usuario se guarda
por id, **si se reordenan las tarjetas se pierde su progreso**. Para fijarlo: `## Anverso {#mi-id}`.

**Quiz.** Cada `##` abre una pregunta; las opciones son una lista de tildes (`- [x]` la
correcta) y el blockquote que va después de la lista es la explicación. Hacen falta ≥ 2
opciones y ≥ 1 correcta. Una opción que es **solo matemática** lleva su texto para el lector
de pantalla al final de la línea: `- [x] $\alpha$ {alt: alfa}`.

```markdown
---
tipo: quiz
titulo: Quiz conceptual
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

**Plan y kits.** JSON validado contra `Plan` y `Kit[]`. Las tareas del plan llevan `kind`:
`read` (destino: una división), `cards` (un mazo), `quiz` (un quiz), `tool` (un **id de ítem
del `rail`**), `exercises` y `custom` (una página o una URL). Además del `label`, una tarea
puede llevar `detail` (una línea corta: «41 ejercicios · 14–16 h»), y las fases y los hitos,
`icon`. Los `tools` de un kit son también ids de ítems del `rail` del config.

```jsonc
// plan.json
{ "title": "Plan de estudio",
  "phases": [{ "id": "fase-1", "title": "Parcial 1", "subtitle": "U1 y U2",
    "date": "2026-10-01", "scope": "Qué cae en este examen (markdown)",
    "milestones": [{ "id": "fase-1-h1", "title": "Unidad 1", "icon": "book", "divisions": ["1"],
      "tasks": [{ "id": "fase-1-h1-t1", "label": "Resolver el TP1", "kind": "exercises",
                  "detail": "7 ejercicios · 4–5 h" }] }] }] }
```

Referencia completa, con todas las verificaciones: `reference/contrato.md` §7.

El plan puede tener **modalidades** (`tracks`): «Cursada + final» y «Final directo», por
ejemplo. Cada una trae sus propias fases; `phases` repite las de la modalidad por defecto
(es lo que se ve mientras el usuario no elija otra). Los ids de tarea son **globales al
plan**: dos tareas distintas no pueden compartirlo (el progreso del usuario se guarda por
id), pero una fase que aparece en dos modalidades es la misma fase y conserva sus ids.

### 5. Herramientas y figuras (`tools/`)

Referencia completa, con un bundle mínimo listo para copiar: `reference/herramientas.md`.

Una herramienta es una **vista propia de la materia** (un explorador, una calculadora) y una
figura es un **dibujo interactivo** dentro de una página del wiki. Las dos salen del mismo
lugar: un bundle de scripts clásicos que el CLI empaqueta y el API sirve.

```
tools/<id>/
  sinapsis.tools.json    # manifiesto: id, title, version, scripts[], styles[], views[], figures, data[]
  tools.js               # IIFE contra window.App / window.M (nada de módulos ES)
  css/tools.css
  data/datos.json
```

- Los **scripts se cargan en orden**, después del runtime de la plataforma, y registran lo
  suyo: `App.registerView(id, fn)` para una vista, `App.registerFigure(id, draw, meta)` para
  una figura. Los estilos se inyectan y se quitan con el bundle.
- El runtime garantiza, además del registro: los datos de la materia (`App.SUBJECT`,
  `App.PAGES`, `App.BY_SLUG`, `App.UNITS`, `App.isStudied`, `App.DATA`), navegación
  (`App.go`, `App.setCrumbs`, `App.toast`), render (`App.renderMarkdown`, `App.rich`,
  `App.katex`, `App.icon`, `App.escapeHtml`, `App.cssVar`) y dibujo (`App.Fig`, `App.Plot`,
  `window.M`). Es la superficie `CompatApp` del contrato. Cada figura recibe además su
  propio `api`: `state`/`setState` para los controles, `cleanup(fn)`, `theme`, `cssVar` y
  `redraw()`.
- Las rutas del manifiesto son relativas a la carpeta del bundle, sin `..`, y con extensión
  conocida (`js mjs css json svg png jpg jpeg webp woff woff2 txt md csv`). Tope: 20 MB.
- Un ítem del rail con `kind: "tool"` apunta al **id de la vista**, no al del bundle.
- Un callout `> [!figura] <id>` del wiki monta la figura de ese id; sin bundle, se ve el
  epígrafe y nada más.

```bash
pnpm --dir "$SINAPSIS_HOME" sinapsis -- tools build          # valida y empaqueta
pnpm --dir "$SINAPSIS_HOME" sinapsis -- tools push           # construye y sube
pnpm --dir "$SINAPSIS_HOME" sinapsis -- sync --tools         # wiki + estudio + herramientas
```

`tools build` no confía en que el bundle esté bien: valida el manifiesto, comprueba que cada
archivo declarado exista y quede dentro de la carpeta, y **parsea cada script** (`node
--check`). Un script que el manifiesto no declara no se sube: el runtime no lo cargaría.

---

## Procedimientos

### `/sinapsis init` — primera vez

1. **Ubicar el wiki.** Confirme cuál es la carpeta raíz (normalmente `wiki/`). Si el vault
   tiene material crudo (`raw/`, PDFs, adjuntos), no es parte del wiki: irá a `wiki.ignore`
   o simplemente no tendrá `.md`.

2. **Correr el CLI:**

   ```bash
   pnpm --dir "$SINAPSIS_HOME" sinapsis -- init --wiki wiki
   ```

   Escribe `sinapsis.config.json` en el directorio actual e imprime qué infirió: tipos de
   página (de las carpetas), campo de división y sus valores, y páginas sin `resumen`.
   No sobreescribe un config existente salvo con `--force`.

   Además deja lista la carpeta del material de estudio (`estudio/`) con un `README.md` del
   formato y un `flashcards-ejemplo.md` de dos tarjetas. No pisa nada que ya exista, y no
   hace falta usarla: si queda como está, la plataforma autogenera un mazo por división.

3. **Completar a mano** lo que dice "COMPLETAR": `name`, `code`, `institution`, `semester`.

4. **Revisar las divisiones.** `init` deja nombres provisorios ("Unidad 1", "Unidad 2"…).
   Reemplazalos por los **nombres reales del programa** de la cátedra. Buscalos en el
   `index.md` del wiki, en el programa de la materia o preguntá al usuario. Marcá como
   `"kind": "extra"` las que no llevan número (complementos, evaluaciones, transversales).

5. **Revisar la nomenclatura.** `division` debe decir cómo llama la cátedra a sus
   divisiones: Unidad/U/Unidades, Semana/S/Semanas, Módulo/M/Módulos, Capítulo/C/Capítulos.
   Una sola nomenclatura por materia.

6. **Proponer un `rail`.** Revise qué herramientas ya tiene la materia y arme **1 o 2 grupos
   slot** con lo que exista de verdad:

   - Una página que ya funciona como índice o formulario general → `kind: "page"`,
     `target: "<slug>"`.
   - Un campus, un drive, un repositorio de la cátedra → `kind: "link"`, `target: "<url>"`.
   - Una herramienta interactiva que la materia querría tener → `kind: "tool"` **solo como
     placeholder**: hasta el Sprint 3 la plataforma la muestra como "Próximamente". No
     inventes herramientas que nadie pidió.

   No dupliques los grupos fijos (Inicio, Todo el wiki, Grafo, Índice, Registro): esos ya
   los dibuja la plataforma.

7. **Validar y mostrar el diff:**

   ```bash
   pnpm --dir "$SINAPSIS_HOME" sinapsis -- validate --config sinapsis.config.json
   ```

   Mostrale al usuario el config final (o el diff contra el generado) y pedile el visto
   bueno antes de sincronizar.

### `/sinapsis sync` — publicar el wiki

1. **Validar** primero:

   ```bash
   pnpm --dir "$SINAPSIS_HOME" sinapsis -- validate --config sinapsis.config.json
   ```

   Si sale 1, arreglá el config antes de seguir. Los errores vienen con la ruta del campo.

2. **Dry-run y leer las advertencias:**

   ```bash
   pnpm --dir "$SINAPSIS_HOME" sinapsis -- sync --config sinapsis.config.json --dry-run
   ```

   Revise el resumen: páginas por tipo, páginas por división, divisiones sin páginas, y la
   lista de advertencias. Las que importan:

   | Advertencia | Qué significa | Arreglo |
   |---|---|---|
   | `wikilink(s) roto(s)` | El destino no existe como página | Corregir el slug, o crear la página, o desenlazar |
   | `N página(s) sin "resumen"` | Sin tooltip ni tarjeta | Escribir 1-2 frases en el frontmatter |
   | `división "X" no está en config.divisions` | Falta declararla, o hay una errata en el frontmatter | Agregar la división o corregir la página |
   | `tipo "X" no está en config.pageTypes` | Ídem con los tipos | Agregar el tipo o corregir la página |
   | `slug normalizado` | El nombre del archivo no es un slug válido | Renombrar el archivo |
   | `subcarpeta ignorada` | Hay `.md` en un segundo nivel que no se compilan | Aplanar la carpeta o aceptarlo |
   | `divisiones sin páginas` | Una división declarada quedó vacía | Ingerir contenido o sacarla del config |
   | `estudio · referencia rota en …` | Una tarjeta, un kit o una tarea apunta a una página, un mazo, un quiz o una división que no existe | Corregir el destino en el archivo del material de estudio |
   | `estudio · … no marca ninguna opción correcta` | Una pregunta del quiz no tiene `- [x]` | Marcar la correcta (si no, la pregunta se descarta) |
   | `estudio · … no es JSON válido` / `phases.0.title: …` | `plan.json` o `kits.json` no cumplen el contrato | Corregir el campo que nombra la advertencia |

   La línea `Estudio: N mazos (M tarjetas) · …` del resumen dice qué material se va a
   publicar. Si dice «sin material propio», la materia no tiene carpeta `estudio/` (o está
   vacía) y la plataforma va a autogenerar un mazo por división: es válido.

3. **Corregir**, si el usuario lo autoriza. Presentá la lista concreta ("estos 4 wikilinks
   apuntan a `distribucion-uniforme`, que no existe; ¿lo cambio por `distribucion-uniforme-continua`
   o creo la página?") y esperá su respuesta. No edites páginas del wiki sin permiso.

4. **Sync real:**

   ```bash
   pnpm --dir "$SINAPSIS_HOME" sinapsis -- sync --config sinapsis.config.json
   ```

   Necesita el token: `--token <t>`, o `SINAPSIS_TOKEN`/`SYNC_TOKEN` en el entorno, y el API
   corriendo (`pnpm dev:api` en el repo de la plataforma). Si el API no responde, el CLI
   sale 1 con el motivo.

5. **Reportar** el `SyncResult` literal (`pages`, `created`, `updated`, `deleted`,
   `warnings`) y el enlace: `http://localhost:5173/m/<slug>`. Nombrá las advertencias que
   quedaron sin resolver y por qué.

### `/sinapsis status` — cómo quedó

```bash
pnpm --dir "$SINAPSIS_HOME" sinapsis -- status --config sinapsis.config.json
```

Muestra la última sync, el total de páginas, el desglose por división, el material de estudio
publicado y las divisiones sin páginas, y avisa si el config local difiere del que tiene la
plataforma. Si la línea de estudio dice «API sin soporte de estudio», el API de esa
instalación es anterior al Sprint 2: el sync sigue funcionando, pero el material no se ve.

`status` necesita **sesión**, no token: el CLI intenta primero `POST /api/auth/dev`, que
funciona con el API levantado con `AUTH_DEV_BYPASS=1` (decisión N0-5 de la plataforma). Si
responde 401, decíselo al usuario tal cual: hay que levantar el API con esa variable o
iniciar sesión en la web. No intentes rodear la autenticación.

### `/sinapsis validate` — solo el config

```bash
pnpm --dir "$SINAPSIS_HOME" sinapsis -- validate --config sinapsis.config.json
```

Sale 0 si el config cumple el contrato (los avisos amarillos no son errores), 1 si no.
También revisa el **formato** del material de estudio (`estudio/`) y resume qué encontró; lo
único que no puede verificar sin compilar el wiki son las referencias a slugs de páginas, que
salen en `sync --dry-run`.

### `/sinapsis tools` — publicar las herramientas

1. **Construir y leer el resumen:**

   ```bash
   pnpm --dir "$SINAPSIS_HOME" sinapsis -- tools build
   ```

   Informa, por bundle: archivos y bytes, vistas registradas, si aporta figuras, y qué
   quedó afuera. Sale 1 —sin subir nada— si el manifiesto no cumple el contrato, si falta
   un archivo declarado, si una ruta se escapa de la carpeta o si un script no parsea.

2. **Revisar los avisos.** Los dos habituales:

   | Aviso | Qué significa | Arreglo |
   |---|---|---|
   | `N script/estilo que el manifiesto no declara (no se suben)` | Hay `.js` o `.css` en la carpeta que nadie carga | Agregarlos a `scripts`/`styles`, o dejarlos (son de construcción) |
   | `N archivo(s) con extensión ajena al contrato` | `.yaml`, `.html`, `.ts`… | Convertirlos o sacarlos de la carpeta |

3. **Comprobar el rail.** `sinapsis validate` avisa si un ítem `kind: "tool"` apunta a una
   vista que ningún bundle registra. Los `target` son ids de **vista**.

4. **Subir**, con el API corriendo y el token:

   ```bash
   pnpm --dir "$SINAPSIS_HOME" sinapsis -- tools push
   ```

   o, junto con el wiki y el material de estudio, `sinapsis sync --tools`.

5. **Verificar**: `sinapsis tools list` y, en el navegador, `/m/<slug>/t/<vista>` y una
   página con `[!figura]`. Reportá qué vistas quedaron publicadas y con qué versión.

### `/sinapsis propose` — proponer un cambio a la plataforma

**Cuándo.** Solo cuando lo que falta es **común a varias materias** y no se puede resolver
dentro del repositorio de la materia: un `kind` nuevo del rail, un campo del contrato, un
helper del runtime, un comportamiento del lector, un arreglo de un bug de la plataforma.

**Cuándo no.** Si se resuelve con un bundle propio, con el config, o cambiando el wiki: eso
es trabajo de la materia y no ocupa a la plataforma. Tampoco se propone «de paso» algo que
no estaba en el pedido del usuario.

1. **Pedirle el visto bueno al usuario.** Una propuesta crea una rama y un commit en el
   repositorio de la plataforma: no se hace sin que lo pida o lo autorice.

2. **Implementar el cambio en el repositorio de la plataforma**, mínimo y coherente: un
   cambio por propuesta. Si toca `packages/contract`, el campo nuevo va **opcional y con
   default**, con sus tests, para que las materias ya sincronizadas sigan validando.

3. **Proponer:**

   ```bash
   pnpm --dir "$SINAPSIS_HOME" sinapsis -- propose \
     --subject <slug> \
     --title "Qué se propone, en una línea" \
     --body "Por qué lo necesita la materia y por qué no se resuelve en su repo" \
     [--files packages/contract/src/index.ts,apps/web/src/…] \
     [--compat "Qué pasa con las demás materias y con lo ya sincronizado"]
   ```

   El CLI comprueba que la plataforma esté en `main` y que lo único modificado sea lo que
   `--files` declara; corre los gates (`pnpm typecheck`, `pnpm test`, y `pnpm build` si toca
   `apps/`) **antes** de tocar git; crea la rama `proposal/<slug>-<fecha>-<titulo>`; escribe
   `proposals/<fecha>-<slug>-<titulo>.md` con motivo, alcance (la lista real de archivos),
   compatibilidad y la salida literal de los gates; commitea todo en la rama; abre el PR si
   hay remoto en GitHub y `gh` autenticado, y si no anota la propuesta en
   `proposals/INBOX.md` de `main`; y vuelve a `main`.

   Si los gates fallan **no crea nada**: corrija y vuelva a ejecutar el mismo comando.
   `--skip-gates` es solo para propuestas que no cambian código ejecutable.

4. **Cerrar con la instrucción para el usuario**, que es la que imprime el CLI:

   > Abra una sesión de Claude Code en `<repo de Sinapsis>` y ejecute `/sinapsis-review`.

   La materia **no** revisa ni mergea su propia propuesta. Decide la plataforma.

---

## Checklist de calidad del wiki

Antes de dar por buena una sincronización:

- [ ] **Una sola nomenclatura de división.** Todas las páginas usan el mismo campo del
      frontmatter (el de `wiki.divisionField`). Nada de mezclar `unidad` en unas y `modulo`
      en otras.
- [ ] **Todas las divisiones del programa están en `config.divisions`**, con su nombre real,
      en el orden del programa, y ninguna quedó vacía sin motivo.
- [ ] **Todas las páginas tienen `resumen`.** Una o dos frases; alimenta los tooltips de
      enlace y las tarjetas del índice.
- [ ] **Todas las páginas tienen `titulo`** (o al menos un H1 al principio del cuerpo).
- [ ] **Slugs válidos**: minúsculas, dígitos y guiones. Sin acentos, espacios ni mayúsculas
      en los nombres de archivo.
- [ ] **Sin wikilinks rotos.** Cero advertencias de destino inexistente.
- [ ] **Los tipos declarados cubren todas las carpetas** con `.md`.
- [ ] **`orden`** es un entero positivo donde exista, y es coherente dentro de cada división.
- [ ] **El `rail`** apunta a páginas que existen (`kind: "page"`) y a URLs absolutas
      (`kind: "link"`).
- [ ] **El material de estudio no tiene referencias rotas.** Cero advertencias `estudio ·`
      en el dry-run: cada `pagina:`, cada `pages[]` de un kit y cada `target` de una tarea
      apuntan a algo que existe.
- [ ] **Los ids de las tarjetas son estables.** Si hubo que reordenar un mazo, las tarjetas
      que ya se venían repasando llevan `{#id}` para no perder su progreso de SRS.
- [ ] **Los ids de tarea del plan son únicos** entre todas las modalidades, y una fase que
      aparece en dos modalidades es idéntica en las dos.
- [ ] **Cada ítem `kind: "tool"` del rail abre una vista que existe.** Cero avisos «ningún
      bundle de tools/ registra la vista …» en `validate`.
- [ ] **Los bundles construyen limpio.** `tools build` sale 0 y no deja scripts sin declarar
      que el bundle necesite.

## Referencias

- `reference/contrato.md` — el contrato completo: config, frontmatter, `Page`, sync y API.
- `reference/config-ejemplo.md` — el `sinapsis.config.json` de Probabilidad y Estadística,
  comentado campo por campo.
- `reference/herramientas.md` — bundles de herramientas y figuras: manifiesto, qué garantiza
  el runtime (`window.App`), un bundle mínimo completo y los comandos `tools build/push/list`.
