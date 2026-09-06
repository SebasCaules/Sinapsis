# 01 · La materia — `sinapsis.config.json`

Todo lo que la plataforma sabe de una materia está en un solo archivo:
`sinapsis.config.json`, en la raíz del repositorio de la materia. Lo que el config no
declara, lo rellena la plataforma con sus valores fijos.

El esquema ejecutable es `SubjectConfig` en `packages/contract/src/index.ts`. Se valida en
tres momentos: `sinapsis validate` (antes de tocar nada), `sinapsis sync` (al compilar) y el
API (al recibir el payload). Los tres usan el mismo esquema.

```
<repositorio de la materia>/
  sinapsis.config.json     ← este contrato
  wiki/                    ← ver 02-paginas.md
  estudio/                 ← ver 03-estudio.md
  tools/                   ← ver 04-herramientas-y-figuras.md
```

---

## 1. Campos de `SubjectConfig`

| Campo | Tipo | Obligatorio | Default | Restricción | Descripción |
|---|---|---|---|---|---|
| `contract` | número | no | `1` | literal `1` | Versión del contrato que entiende la materia. Cualquier otro valor **falla**. |
| `slug` | `Slug` | **sí** | — | `^[a-z0-9][a-z0-9-]*$`, 1–120 | Identidad de la materia. Es la URL (`/m/<slug>`) y la clave del sync. |
| `name` | texto | **sí** | — | 1–120 | Nombre completo, en el hero del índice. |
| `code` | texto | **sí** | — | 1–24 | Código de la cátedra (`93.24`). |
| `institution` | texto | **sí** | — | 1–80 | Institución (`ITBA`). |
| `color` | `ColorRef` | no | — | `#rrggbb` o `--token` | Color de la materia en la landing. Sin él, la plataforma usa `--u1`. |
| `semester` | texto | no | — | ≤ 24 | Cuatrimestre **sugerido** para la landing (`2026-1C`). El usuario puede mover la materia a otro. |
| `division` | `DivisionLabel` | **sí** | — | ver §2 | Cómo llama la cátedra a sus divisiones (Unidad/U/Unidades). |
| `divisions` | `DivisionDef[]` | **sí** | — | 1–64 elementos | El temario, en el orden del índice. |
| `pageTypes` | `PageTypeDef[]` | **sí** | — | 1–24 elementos | Los bloques dentro de cada división, en este orden. |
| `rail` | `RailGroup[]` | no | `[]` | ≤ 6 grupos | Grupos **slot** del rail. Los fijos los dibuja la plataforma. |
| `fab` | `Fab` o `null` | no | `null` | — | Botón flotante de la materia. |
| `wiki` | `WikiSource` | no | `{}` (todos sus defaults) | ver §7 | Dónde están el wiki y el material de estudio. |

### Primitivas compartidas

| Tipo | Regla | Ejemplos válidos | Ejemplos inválidos |
|---|---|---|---|
| `Slug` | `^[a-z0-9][a-z0-9-]*$`, 1–120 | `proba`, `distribucion-normal`, `tp4` | `Proba` (mayúscula), `-x` (empieza con guion), `probabilidad_y_estadistica` (guion bajo) |
| `DivisionKey` | `^[a-z0-9_-]+$` **sin distinguir mayúsculas**, 1–24 | `1`, `0`, `eval`, `s01`, `U3` | `unidad 3` (espacio), `unidad.3` (punto) |
| `ColorRef` | `^(#[0-9a-fA-F]{6}\|--[a-z0-9-]+)$` | `#7c2230`, `--u9`, `--ueval` | `#abc` (3 dígitos), `red`, `var(--u9)` |
| `SafeRelativePath` | 1–200; sin raíz absoluta (`/`, `C:\`), sin `~` inicial, sin segmento `..`, sin NUL | `wiki`, `contenido/wiki`, `index.md` | `/tmp/wiki`, `../otro`, `~/vault` |
| `ExternalUrl` | 1–400; `http://…`, `https://…` o `mailto:…` | `https://campus.itba.edu.ar`, `mailto:catedra@itba.edu.ar` | `//cdn.example.com`, `javascript:alert(1)`, `campus.itba.edu.ar` |
| `IconName` | uno de los 30 iconos del registro cerrado (§6) | `sigma`, `flask` | `beaker`, `📊` |

---

## 2. `division` — la nomenclatura (`DivisionLabel`)

Cómo se nombra **una** división. Una sola nomenclatura por materia.

| Campo | Tipo | Obligatorio | Default | Restricción | Descripción |
|---|---|---|---|---|---|
| `singular` | texto | **sí** | — | 1–32 | `Unidad`, `Semana`, `Módulo`, `Capítulo`. |
| `abbr` | texto | **sí** | — | 1–6 | Prefijo del rótulo corto: `U3`, `S07`. |
| `plural` | texto | **sí** | — | 1–32 | Rótulo del árbol del índice. |

Rótulos que derivan de esto (`divisionShort`, `divisionLong` del contrato):

- Corto de una división numerada: `abbr` + su posición entre las numeradas → `U3`.
- Corto de una `extra`: su `name` si mide ≤ 8 caracteres, y si no, los 6 primeros más un punto.
- Largo de una numerada: `<singular> <n> · <name>` → `Unidad 3 · Variables Aleatorias Discretas`.
- Largo de una `extra`: su `name` a secas.

---

## 3. `divisions` — el temario (`DivisionDef[]`)

| Campo | Tipo | Obligatorio | Default | Restricción | Descripción |
|---|---|---|---|---|---|
| `key` | `DivisionKey` | **sí** | — | ver §1; **`meta` está prohibida** | Lo que escriben las páginas en su frontmatter. |
| `name` | texto | **sí** | — | 1–120 | Nombre real del programa de la cátedra. |
| `order` | entero | no | — | — | Orden explícito en el índice. Sin él, el del array. |
| `kind` | `"numbered"` \| `"extra"` | no | `"numbered"` | — | `numbered` cuenta para la numeración y el color paramétrico; `extra` va sin número y en gris. |
| `color` | `ColorRef` | no | — | ver §1 | Color fijo. Sin él, lo deriva la plataforma. |

**Reglas:**

- El orden del array es el orden del índice, salvo que se declare `order` (se ordena por
  `order ?? posición`, con la posición como desempate).
- Las claves no se repiten: `validate` sale 1 con `divisions: clave repetida "<key>"`.
- `"meta"` está **reservada** para las páginas transversales: `validate` sale 1 con
  `divisions: "meta" está reservada para las páginas transversales`.
- `"otras"` no está prohibida, pero es la clave sintética que la plataforma usa para agrupar
  divisiones no declaradas (ver `02-paginas.md` §5): conviene no usarla.
- Color automático (`divisionColor`, N0-12): con ≤ 9 divisiones numeradas se usan los tokens
  heráldicos `--u1`…`--u9` por posición; con más, se barre el matiz en `oklch`. Las `extra`
  y las no declaradas van a `--u0`.

---

## 4. `pageTypes` — los tipos de página (`PageTypeDef[]`)

| Campo | Tipo | Obligatorio | Default | Restricción | Descripción |
|---|---|---|---|---|---|
| `key` | texto | **sí** | — | `^[a-z][a-z0-9_-]*$`, 1–32; **`meta` prohibida** | Lo que escribe el frontmatter en `tipo`. |
| `label` | texto | **sí** | — | 1–40 | Singular (`Distribución`). |
| `plural` | texto | **sí** | — | 1–40 | Encabezado del bloque en el índice (`Distribuciones`). |
| `folder` | texto | no | — | 1–64 | Carpeta de `wiki.root` cuyas páginas son de este tipo **por defecto**. El frontmatter manda. |
| `countsAsContent` | booleano | no | `true` | — | `false` para las «fuentes»: no cuentan en el progreso ni en la numeración de lectura, y pesan menos en la búsqueda. |
| `collapsedByDefault` | booleano | no | `false` | — | `true` pliega el bloque en el índice. |
| `color` | `string` | no | paleta por posición (`typeColor`) | hex `#rrggbb` o token `--nombre` | Color del tipo: segmentos de la barra de unidad del lector y puntos de tipo. Sin declarar, la plataforma asigna `--u2, --u3, --u5, --u1, …` por posición entre los tipos que cuentan como contenido; los que no cuentan van en `--u0`. |

**Reglas:**

- `key: "meta"` es rechazada por el propio esquema con el mensaje
  `pageTypes: la clave «meta» está reservada para índice y registro`.
- Claves repetidas: error de `validate` (`pageTypes: clave repetida "<key>"`).
- Carpetas repetidas: error de `validate` (`pageTypes: carpeta repetida "<folder>"`).
- El orden de `pageTypes` decide el orden de las carpetas que recorre el compilador y el de
  los bloques dentro de cada división.
- Un tipo que aparece en una página y no está declarado **no descarta la página**: levanta la
  advertencia `tipo "X" no está en config.pageTypes` y la página se conserva. Como no está
  declarado, `countsAsContent` lo trata como contenido.

---

## 5. `rail` y `fab` — la navegación de la materia

El rail tiene dos mitades. La plataforma dibuja los **grupos fijos** (N0-11) y la materia
aporta hasta 6 **grupos slot** entre medio.

### 5.1 Grupos fijos (los dibuja la plataforma, no se declaran)

`FIXED_RAIL` — antes de los slots de la materia:

| Grupo | Color | Ítems (`kind: builtin`) |
|---|---|---|
| `ruta` · «Mi ruta» | `--primary` | `home` Inicio · `plan` Plan de estudio · `kits` Kits de estudio |
| `consultar` · «Consultar» | `--u3` | `wiki` Todo el wiki · `graph` Grafo de conexiones |
| `practicar` · «Practicar» | `--good` | `flashcards` Flashcards · `quiz` Quiz |

`FIXED_RAIL_TAIL` — después de los slots:

| Grupo | Color | Ítems |
|---|---|---|
| `mio` · «Lo mío» | `--warn` | `notes` Mis apuntes · `favorites` Favoritos (builtin) |
| `wikimeta` · «Wiki» | `--text-2` | `index` Índice del wiki · `log` Registro del wiki (`kind: page`, targets `indice` y `log`) |

**No los dupliques en tu `rail`.**

### 5.2 `RailGroup`

| Campo | Tipo | Obligatorio | Default | Restricción | Descripción |
|---|---|---|---|---|---|
| `id` | texto | **sí** | — | `^[a-z][a-z0-9_-]*$`, 1–48 | Único entre los grupos del config. |
| `label` | texto | **sí** | — | 1–40 | Rótulo del grupo. |
| `color` | `ColorRef` | no | — | ver §1 | Color del grupo. |
| `items` | `RailItem[]` | **sí** | — | **1–8** elementos | Los ítems del grupo. |

### 5.3 `RailItem`

| Campo | Tipo | Obligatorio | Default | Restricción | Descripción |
|---|---|---|---|---|---|
| `id` | texto | **sí** | — | `^[a-z][a-z0-9_-]*$`, 1–48 | Único entre **todos** los ítems del config, incluido el `fab`. Es lo que citan `PlanTask.target` (`kind: "tool"`) y `Kit.tools`. |
| `label` | texto | **sí** | — | 1–60 | Texto del ítem. |
| `icon` | `IconName` | **sí** | — | registro cerrado (§6) | Icono, lo dibuja la plataforma. |
| `kind` | enum | **sí** | — | `builtin` \| `page` \| `link` \| `tool` | Qué abre. |
| `target` | texto | **sí** | — | 1–400, depende de `kind` | El destino. |
| `hint` | texto | no | — | ≤ 120 | Tooltip. Sin él, `label · grupo`. |

### 5.4 `kind` y su `target`

| `kind` | Forma de `target` | Qué abre | Verificación |
|---|---|---|---|
| `builtin` | uno de `BUILTIN_VIEWS`: `home` `plan` `kits` `wiki` `graph` `flashcards` `quiz` `notes` `favorites` | Una vista de la plataforma. | El esquema exige `^[a-z][a-z0-9_-]{0,47}$`; `validate` verifica además que esté en `BUILTIN_VIEWS` (error). |
| `page` | un `Slug` de una página del wiki | Esa página en el lector (`/m/<slug>/p/<target>`). | El esquema exige `Slug`. Que la página exista lo verifica el compilador (advertencia de wikilink solo si la cita el cuerpo; el rail no se verifica contra las páginas). |
| `link` | `ExternalUrl`: `http(s)://…` o `mailto:…` | Pestaña nueva. | El esquema y `validate` (error: `un ítem "link" necesita una URL http(s) o mailto`). |
| `tool` | el **id de una vista** declarada en algún `sinapsis.tools.json` de `tools/` | Esa herramienta (`/m/<slug>/t/<target>`). Sin bundle que la registre, la plataforma muestra «Próximamente». | `validate` avisa (advertencia, no error): `<donde>: ningún bundle de tools/ registra la vista "<target>"`. |

> **Cuidado con `tool`:** el `target` es el id de la **vista** (`ToolView.id`), no el id del
> bundle (`ToolManifest.id`). Un bundle puede registrar varias vistas.

### 5.5 `fab`

`null` o un objeto con `icon`, `label` (1–60), `kind` y `target`, con las mismas reglas de
`target` que un `RailItem`. No lleva `id` propio, pero **su `target` cuenta** para la
verificación de ítems `tool` y su presencia entra en el chequeo de ids repetidos.

---

## 6. `IconName` — el registro cerrado de iconos

Los dibuja la plataforma; una materia no puede aportar los suyos.

```
home   map    grid   book     sigma   graph  cards  quiz    pencil  timer
function calc compass layers  notebook star  list   clock
square circle diamond line    triangle flask chart  table
link   tool   sparkle wrench
```

Los mismos nombres valen para `RailItem.icon`, `Fab.icon`, `ToolView.icon`,
`PlanPhase.icon` y `PlanMilestone.icon`.

---

## 7. `wiki` — dónde están los archivos (`WikiSource`)

| Campo | Tipo | Obligatorio | Default | Restricción | Descripción |
|---|---|---|---|---|---|
| `root` | `SafeRelativePath` | no | `"wiki"` | relativa al **config**, dentro de su carpeta | Raíz del wiki. La bandera `--wiki <dir>` del CLI la sobreescribe (y esa sí se confía: es del usuario). |
| `index` | `SafeRelativePath` | no | — | relativa a `root`, dentro de `root` | Página índice. Se publica como el slug `indice`, `type: "meta"`, `division: "meta"`. |
| `log` | `SafeRelativePath` | no | — | relativa a `root`, dentro de `root` | Página de registro. Se publica como el slug `log`, ídem. |
| `ignore` | texto[] | no | `[]` | — | Nombres de carpetas de primer nivel que no se recorren. |
| `divisionField` | texto | no | `"division"` | — | Campo del frontmatter que trae la división. En Proba es `"unidad"`. |
| `study` | `SafeRelativePath` | no | `"estudio"` | relativa al **config**, dentro de su carpeta | Carpeta del material de estudio (N0-27). **No es relativa al wiki**: `--wiki <otro-vault>` no la desvía. |

---

## 8. Ejemplo completo y comentado (Probabilidad y Estadística)

Es `examples/proba/sinapsis.config.json` tal cual, con comentarios agregados. El archivo real
es JSON estricto: **sin comentarios y sin comas finales**.

```jsonc
{
  // Versión del contrato. Se puede omitir: el default es 1.
  "contract": 1,

  // Identidad. `slug` es la URL (/m/proba) y la clave del sync: no se cambia a la ligera.
  "slug": "proba",
  "name": "Probabilidad y Estadística",
  "code": "93.24",
  "institution": "ITBA",
  "color": "--u9",                 // token del design system; también vale "#7c2230"
  "semester": "2026-1C",           // sugerencia: el usuario puede mover la materia

  // Cómo llama la cátedra a una división. Una sola nomenclatura por materia.
  "division": { "singular": "Unidad", "abbr": "U", "plural": "Unidades" },

  // El temario. El orden del array es el del índice.
  "divisions": [
    { "key": "1", "name": "Estadística Descriptiva" },            // kind "numbered" por default → U1
    { "key": "2", "name": "Introducción a la Probabilidad" },
    { "key": "3", "name": "Variables Aleatorias Discretas" },
    { "key": "4", "name": "Variables Aleatorias Continuas" },
    { "key": "5", "name": "Función de V.A. y Bidimensionales" },
    { "key": "6", "name": "Procesos Estocásticos" },
    { "key": "7", "name": "Suma de Variables Aleatorias" },
    { "key": "8", "name": "Inferencia Estadística" },
    { "key": "9", "name": "Pruebas de Hipótesis" },
    // Las "extra" no llevan número ni entran en la escala de color paramétrica.
    { "key": "0", "name": "Complementos Matemáticos", "kind": "extra" },
    { "key": "eval", "name": "Evaluaciones", "kind": "extra", "color": "--ueval" }
  ],

  // Los bloques dentro de cada división. `folder` es la carpeta de wiki/ que los alimenta.
  "pageTypes": [
    { "key": "concepto",     "label": "Concepto",     "plural": "Conceptos",     "folder": "conceptos" },
    { "key": "distribucion", "label": "Distribución", "plural": "Distribuciones","folder": "distribuciones" },
    { "key": "teorema",      "label": "Teorema",      "plural": "Teoremas",      "folder": "teoremas" },
    { "key": "tecnica",      "label": "Técnica",      "plural": "Técnicas",      "folder": "tecnicas" },
    { "key": "formulario",   "label": "Formulario",   "plural": "Formularios",   "folder": "formularios" },
    // Las fuentes no cuentan para el progreso y llegan plegadas al índice.
    { "key": "fuente", "label": "Fuente", "plural": "Fuentes", "folder": "fuentes",
      "countsAsContent": false, "collapsedByDefault": true }
  ],

  // Grupos SLOT: máximo 6 grupos, de 1 a 8 ítems cada uno.
  "rail": [
    {
      "id": "resolver",
      "label": "Resolver",
      "color": "--accent",
      "items": [
        // `target` de un ítem "tool" es el id de la VISTA del bundle, no el del bundle.
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
        // "page": un slug del wiki de esta materia.
        { "id": "formularios", "label": "Formulario general",   "icon": "sigma", "kind": "page", "target": "formulario-maestro" },
        // "link": solo http(s) o mailto.
        { "id": "catedra",     "label": "Campus de la cátedra", "icon": "link",  "kind": "link", "target": "https://campus.itba.edu.ar" }
      ]
    }
  ],

  // Botón flotante: null o { icon, label, kind, target }.
  "fab": null,

  // Rutas. `root`, `index` y `log` son del wiki; `study` cuelga del CONFIG, no del wiki.
  "wiki": {
    "root": "wiki",
    "index": "index.md",
    "log": "log.md",
    "ignore": [],
    "divisionField": "unidad",
    "study": "estudio"          // default; se puede omitir
  }
}
```

---

## 9. Qué verifica `sinapsis validate`

Dos capas. La primera es zod (el esquema de arriba); la segunda son las reglas que zod no
puede expresar, en `extraChecks` y `checkTools`.

### Errores (salida `1`)

| Mensaje | Causa |
|---|---|
| `divisions: clave repetida "<key>"` | Dos divisiones con la misma `key`. |
| `pageTypes: clave repetida "<key>"` | Dos tipos con la misma `key`. |
| `rail: clave repetida "<id>"` | Dos grupos con el mismo `id`. |
| `divisions: "meta" está reservada para las páginas transversales` | Una división declara `key: "meta"`. |
| `pageTypes: carpeta repetida "<folder>"` | Dos tipos apuntan a la misma carpeta. |
| `rail.<grupo>.<item>: id de ítem repetido "<id>"` | Dos ítems (o un ítem y el `fab`) comparten `id`. |
| `rail.<grupo>.<item>: vista builtin desconocida "<target>" (válidas: …)` | Un `kind: "builtin"` apunta a algo que no está en `BUILTIN_VIEWS`. |
| `rail.<grupo>.<item>: un ítem "link" necesita una URL http(s) o mailto` | Un `kind: "link"` con un target que no es `ExternalUrl`. |
| `wiki.study: "<valor>" queda fuera de la carpeta del config` | `study` escapa de la carpeta del config. |

### Advertencias (no cambian el código de salida)

| Mensaje | Causa |
|---|---|
| `aviso · name, code, institution, semester: todavía dice "COMPLETAR"` | Quedaron los placeholders de `sinapsis init`. |
| `aviso · rail.<grupo>.<item>: ningún bundle de tools/ registra la vista "<target>" (…)` | Un ítem `kind: "tool"` sin vista que lo respalde. Si la materia no tiene bundles, el mensaje lo aclara: la plataforma muestra «Próximamente». |
| `aviso · estudio · …` | Problemas del material de estudio (ver `03-estudio.md`). |

---

## 10. Errores típicos

| Síntoma | Causa | Arreglo |
|---|---|---|
| `slug: solo minúsculas, dígitos y guiones` | El `slug` tiene mayúsculas, acentos, espacios o guiones bajos. | `probabilidad-y-estadistica`, no `Probabilidad_y_Estadística`. |
| `color: hex #rrggbb o token --nombre` | Se escribió `var(--u9)`, `#abc` o `red`. | `--u9` o `#7c2230`. |
| `link: solo URLs http(s) o mailto` | Un `kind: "link"` con `//cdn…`, una ruta relativa o `javascript:`. | URL absoluta con esquema. |
| `target inválido para kind «page»` | El `target` de un `page` no es un `Slug` (mayúsculas, acentos). | Usar el nombre del archivo `.md` sin extensión, ya normalizado. |
| `vista builtin desconocida "estudio"` | Se inventó una vista builtin. | Elegir una de `BUILTIN_VIEWS`; recuerde que los builtin ya están en los grupos fijos. |
| El rail muestra «Próximamente» | El ítem es `kind: "tool"` y ningún bundle registra esa vista, o el `target` es el id del bundle en vez del de la vista. | Publicar el bundle (`sinapsis tools push`) o corregir el `target`. |
| Las divisiones salen en un orden raro | Se mezcló `order` en algunas divisiones y no en otras. | Poner `order` en todas o en ninguna. |
| Todas las páginas caen en «Otras» | `wiki.divisionField` no coincide con el campo real del frontmatter. | Ajustar `divisionField` (Proba usa `unidad`). |
| «Transversales» tiene todas las páginas | Las páginas no declaran el campo de división. | Completar el frontmatter, o aceptar que son transversales. |
| Un tipo de página no se ve agrupado | La carpeta del wiki no está declarada en ningún `pageTypes[].folder`. | Agregar el tipo con su `folder`. |
| `wiki.root: "<valor>" queda fuera de la carpeta del config` | `root` apunta afuera (`../vault/wiki`). | Poner el config al lado del wiki, o usar la bandera `--wiki <dir>` en el CLI. |
| El material de estudio no aparece | `wiki.study` se resolvió contra el wiki en vez del config. | Es relativa **al config**; si el config vive en otro repositorio, `estudio/` va al lado del config. |

---

## Fuente ejecutable

- `packages/contract/src/index.ts` — `SubjectConfig`, `DivisionLabel`, `DivisionDef`,
  `PageTypeDef`, `RailItem`, `RailGroup`, `Fab`, `WikiSource`, `Slug`, `DivisionKey`,
  `ColorRef`, `IconName`, `SafeRelativePath`, `ExternalUrl`, `BUILTIN_VIEWS`, `FIXED_RAIL`,
  `FIXED_RAIL_TAIL`, `divisionShort`, `divisionLong`, `divisionColor`, `countsAsContent`.
- `packages/cli/src/commands/validate.ts` — `extraChecks`, `checkTools`, `loadConfig`.
- `packages/cli/src/commands/init.ts` y `packages/markdown/src/scaffold.ts` — el config que
  propone `sinapsis init`.
- `apps/api/src/services/subjects.ts` — `resolveConfig` (config sintético de una materia
  placeholder, sin sync).
- `examples/proba/sinapsis.config.json` — el ejemplo real.

## Decisiones relacionadas

N0-6 (materias globales, landing por usuario) · N0-11 (rail fijo y slot) ·
N0-12 (escala de color paramétrica) · N0-14 (Proba como primera materia) ·
N0-23 (divisiones sintéticas) · N0-27 (`wiki.study` relativa al config) ·
N0-32 (cuatrimestres canónicos) · N0-41 (ítems `tool` = vistas de un bundle).
