---
name: sinapsis
description: Conecta el wiki markdown de esta materia con la plataforma Sinapsis — crea o corrige su `sinapsis.config.json`, compila el wiki y lo sincroniza contra el API. Usar cuando el usuario invoque `/sinapsis`, `/sinapsis init`, `/sinapsis sync`, `/sinapsis status` o `/sinapsis validate`, o cuando pida "sincronizar la materia con Sinapsis", "subir el wiki a Sinapsis", "generar el config de Sinapsis", "ver el estado de la materia en Sinapsis" o "revisar los wikilinks rotos del wiki". No usar para editar contenido del wiki que el usuario no haya pedido cambiar.
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
- **No**: tocar el repositorio de la plataforma (`$SINAPSIS_HOME`). Si algo del CLI, del API
  o del contrato está mal, reportalo al usuario con el mensaje literal del error; no lo
  arregles desde acá.
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
| `init [--wiki <dir>] [--out <file>] [--slug <slug>] [--force]` | Propone un `sinapsis.config.json` a partir del wiki. |
| `validate [--config <file>]` | Valida el config contra el contrato. Sale 1 si falla. |
| `sync [--config <file>] [--wiki <dir>] [--api <url>] [--token <t>] [--dry-run] [--out <file>]` | Compila y sincroniza. |
| `status [--config <file>] [--api <url>]` | Estado de la materia en la plataforma. |

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
| `builtin` | `home` · `wiki` · `graph` · `flashcards` · `quiz` · `notes` · `favorites` | Una vista de la plataforma. Hoy solo `home` y `wiki` existen; el resto muestra "Próximamente". |
| `page` | slug de una página | Esa página en el lector. |
| `link` | URL absoluta | Pestaña nueva. |
| `tool` | id de la herramienta | Sprint 3. Hoy muestra "Próximamente". |

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

Muestra la última sync, el total de páginas, el desglose por división y las divisiones sin
páginas, y avisa si el config local difiere del que tiene la plataforma.

`status` necesita **sesión**, no token: el CLI intenta primero `POST /api/auth/dev`, que
funciona con el API levantado con `AUTH_DEV_BYPASS=1` (decisión N0-5 de la plataforma). Si
responde 401, decíselo al usuario tal cual: hay que levantar el API con esa variable o
iniciar sesión en la web. No intentes rodear la autenticación.

### `/sinapsis validate` — solo el config

```bash
pnpm --dir "$SINAPSIS_HOME" sinapsis -- validate --config sinapsis.config.json
```

Sale 0 si el config cumple el contrato (los avisos amarillos no son errores), 1 si no.

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

## Referencias

- `reference/contrato.md` — el contrato completo: config, frontmatter, `Page`, sync y API.
- `reference/config-ejemplo.md` — el `sinapsis.config.json` de Probabilidad y Estadística,
  comentado campo por campo.
