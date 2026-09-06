# 00 · Principios — la constitución de Sinapsis

Este documento fija **quién decide qué** en Sinapsis, qué cosas son contrato y cuáles no,
cómo se versiona, qué cambios son compatibles y qué pasa cuando algo viola el contrato.
Los demás archivos de `docs/contracts/` describen un contrato concreto; este los gobierna a
todos.

Regla de lectura: **la fuente de verdad es el código**, no este texto. Donde un documento y
un esquema zod discrepen, gana el esquema. Cada archivo de esta carpeta termina con la lista
de archivos ejecutables que lo respaldan.

---

## 1. El modelo: sectores incomunicados

Sinapsis es una plataforma que envuelve wikis markdown de varias materias en un shell común.
El modelo de trabajo es el de una empresa con sectores que no se hablan directamente:

| Rol | Quién es | Qué puede hacer | Qué no puede hacer |
|---|---|---|---|
| **Plataforma** | Este repositorio (`apps/web`, `packages/*`, `.github/`). | Decidir cómo se ve y cómo se comporta todo lo común: shell, rail fijo, lector, estudio, grafo, runtime de herramientas. Definir y versionar los contratos. | Conocer el contenido de una materia concreta. No hay código «de Proba» en la plataforma. |
| **Materia** | Un repositorio ajeno: un vault de Obsidian con `wiki/`, `estudio/`, `tools/` y un `sinapsis.config.json`. Su copia publicada vive en `subjects/<slug>/` de este repositorio. | Producir datos (páginas, material de estudio) y herramientas (bundles) según contrato. Declarar sus divisiones, tipos y rail. | Cambiar la plataforma: ni sus archivos, ni su comportamiento, ni `subjects/` de otra materia. |
| **Agente de materia** | Una sesión de Claude Code dentro del repositorio de una materia, con la skill `/sinapsis`. | Editar el wiki, el config, el material de estudio y los bundles de **su** materia; correr el CLI; abrir el PR de su materia y proponer cambios. | Commitear en `main` de la plataforma, parchear `packages/*` o `apps/*` por su cuenta, mergear su propio PR o revisar su propia propuesta. |
| **Orquestador** | Una sesión de Claude Code dentro del repositorio de la plataforma, con la skill `/sinapsis-review`. | Revisar de forma adversarial las propuestas (`proposal/*`) y los PR de materia (`subject/*`), correr los gates, aprobar, pedir cambios o rechazar. Registrar decisiones en `docs/DECISIONS.md`. | Mergear sin veredicto escrito. Tocar el repositorio de la materia que propuso. Poner trailers de coautoría en un commit. |

La consecuencia práctica: **la materia produce, la plataforma decide cómo se ve**. Una
materia que necesita algo común no lo parchea: lo propone (ver `07-propuestas.md`).

---

## 2. Qué es contrato y qué no

**Es contrato** (cambiarlo afecta a todas las materias y requiere propuesta revisada):

| Contrato | Esquema o símbolo ejecutable | Documento |
|---|---|---|
| Configuración de una materia | `SubjectConfig` y todo lo que cuelga de él | `01-materia.md` |
| Página compilada del wiki | `Page`, `PageMeta`, `headingId`, `PAGE_TYPE_META`, `META_PAGES`, `DIVISION_NONE`, `DIVISION_OTHER`, `effectiveDivisions` | `02-paginas.md` |
| Material de estudio | `StudyContent` (`Deck`/`Card`/`Quiz`/`Plan`/`Kit`), `sm2`, `SrsState`, `StudyState` | `03-estudio.md` |
| Herramientas y figuras | `ToolManifest`, `ToolFile`, `ToolPush`, `ToolInfo`, `ToolFilePath`, `CompatApp`, `SinapsisRuntime`, `FigureContext` | `04-herramientas-y-figuras.md` |
| Archivos del sitio y estado local | `SiteCatalog`, `SiteSubject`, `SitePages`, `SiteTools`, `sitePaths`, `siteToolBase`, `SITE_FORMAT`, `LocalBackup`, `BACKUP_FORMAT` | `05-publicacion-y-sitio.md` |
| Superficie del CLI y de la skill | Comandos, banderas, códigos de salida | `06-skill-y-agentes.md` |
| Flujo de propuestas y de PR de materia | Ramas, archivo, estados, gates | `07-propuestas.md` |

**No es contrato** (la plataforma lo cambia sin avisar a nadie):

- La estética: tokens de color, tipografías, geometría del shell, los tres temas
  (`pergamino`, `laurel`, `claustro`).
- La forma de las vistas builtin (Inicio, Lector, Grafo, Flashcards, Quiz, Plan, Kits,
  Apuntes, Favoritos) y sus atajos de teclado.
- Cómo la web guarda el estado personal por dentro (el almacén de IndexedDB, el espejo de
  `localStorage`, el rebote de escritura) y cómo construye el índice de búsqueda y su ranking.
  Lo que sí es contrato es el **formato exportado** (`LocalBackup`).
- Las claves de `localStorage` (`LS_KEYS`) y el estado de la sesión de lectura (pestañas,
  divisiones abiertas, panel plegado).
- El algoritmo de color paramétrico de divisiones (`divisionColor`), mientras respete
  `DivisionDef.color` cuando la materia lo declara.
- Cómo se copian físicamente los archivos de un bundle al sitio, mientras la URL siga siendo
  `BASE_URL` + `ToolInfo.base` + `/` + `path`.

La regla de corte: **si una materia puede observar el cambio desde su repositorio o desde su
`sinapsis.config.json`, es contrato**. Si solo lo observa mirando la pantalla, no lo es.

---

## 3. Versionado

Hay cuatro números y ninguno de ellos es un «número de versión del payload». Conviene no
confundirlos:

| Número | Dónde vive | Valor hoy | Qué significa | Quién lo escribe |
|---|---|---|---|---|
| `SubjectConfig.contract` | `sinapsis.config.json` | `1` (literal, default `1`) | Versión del contrato de configuración que entiende la materia. Un valor distinto de `1` **hace fallar la validación**. | La materia (puede omitirlo: el default lo pone). |
| `RUNTIME_VERSION` / `ToolManifest.runtime` | `packages/contract/src/index.ts`, `sinapsis.tools.json` | `1` (literal, default `1`) | Versión del runtime del navegador que el bundle necesita. Un valor distinto de `1` hace fallar `tools build` y el push. | La plataforma define; el bundle declara. |
| `SinapsisRuntime.version` | `window.SinapsisRuntime.version` | `1` | Lo que el runtime instalado dice ser, en tiempo de ejecución. | La plataforma. |
| `PACKAGE_VERSION` / `VERSION` → `generator` | `@sinapsis/markdown`, `@sinapsis/cli` (leídos de su `package.json`) | `0.1.0` → `"@sinapsis/cli 0.1.0"` | Trazabilidad: qué herramienta compiló estos archivos. **No se valida ni se compara**: es informativo. | El CLI / el compilador. |
| `SITE_FORMAT` | `packages/contract/src/site.ts`, campo `format` de los cuatro JSON del sitio | `1` (literal) | Versión del formato de los archivos estáticos. Un valor distinto no valida y la web lo trata como error de carga. | La plataforma (`site build` lo escribe, la web lo verifica). |
| `BACKUP_FORMAT` | `packages/contract/src/site.ts`, campo `format` de `LocalBackup` | `1` (literal) | Versión del documento del estado personal y del archivo de copia de seguridad. | La plataforma. |

`SITE_FORMAT` y `BACKUP_FORMAT` suben **solo con cambios incompatibles**. Todo lo demás se
resuelve con campos opcionales y con default: un archivo del sitio o una copia de seguridad
de una versión anterior tiene que seguir validando. `SyncPayload` sigue existiendo como
salida del compilador (`config`, `pages`, `study?`, `generatedAt`, `generator?`), pero ya no
viaja por la red: es lo que `publish` puede volcar con `--out` y lo que `site build` consume.

---

## 4. Compatibilidad: qué se puede cambiar y cómo

### 4.1 Cambios compatibles (no rompen ninguna materia)

Se pueden hacer sin cambiar `contract: 1`, pero **igual pasan por propuesta revisada** si
tocan `packages/contract`:

- Agregar un campo **opcional con default** a cualquier esquema (`z.…().optional()` o
  `.default(…)`). Los `sinapsis.config.json` de `subjects/` y las copias de seguridad ya
  guardadas siguen validando.
- Agregar un valor a un enum **de salida** que la materia no declara (por ejemplo, un tipo de
  callout nuevo reconocido por el lector).
- Ampliar un límite hacia arriba (`max`), o relajar un `regex`.
- Agregar un campo **opcional con default** a un archivo del sitio (`site.ts`) o a
  `LocalBackup`, sin subir `SITE_FORMAT` ni `BACKUP_FORMAT`.
- Agregar una vista builtin a `BUILTIN_VIEWS`.
- Agregar un icono a `IconName`.
- Agregar un miembro a `CompatApp` (los bundles existentes lo ignoran).
- Cambiar cualquier cosa de la lista «no es contrato» de §2.

### 4.2 Cambios incompatibles (requieren propuesta y, casi siempre, decisión N0)

- Agregar un campo **obligatorio**, o quitar el default de uno que lo tenía.
- Quitar o renombrar un campo, un valor de enum, una constante exportada o un helper.
- Restringir un límite hacia abajo (`max` menor, `min` mayor) o endurecer un `regex`.
- Cambiar la semántica de un campo sin cambiar su nombre (lo peor de todo: valida igual y
  significa otra cosa).
- Quitar un miembro de `CompatApp` o cambiar su firma: rompe bundles ya publicados.
- Cambiar el algoritmo de `headingId`: invalida todas las anclas `[[pagina#ancla]]` escritas
  a mano en los wikis.
- Cambiar los ids que genera el compilador (mazos, tarjetas, preguntas, tareas): borra el
  progreso de repaso espaciado (`SrsState`) y las tareas hechas (`StudyState.tasksDone`) de
  los usuarios, porque ese estado se guarda **por id**.
- Cambiar `contract`, `RUNTIME_VERSION`, `SITE_FORMAT`, `BACKUP_FORMAT` o el formato de
  `sinapsis.tools.json`.

Un cambio incompatible que no se puede evitar se hace subiendo `contract` a `2` y aceptando
ambas versiones durante una transición: nunca rompiendo `1` en el lugar.

### 4.3 Requisitos de un cambio de contrato

Regla de `docs/PROPOSALS.md`, verificada por el orquestador antes de mergear:

1. Versión del contrato **o** campo opcional con default.
2. Tests en `packages/contract` que cubran el campo nuevo y el caso sin él.
3. Una fila `N0-nn` en `docs/DECISIONS.md` con el porqué y el costo de revertir.
4. Los `sinapsis.config.json` de `subjects/` y las copias de seguridad existentes siguen
   validando.
5. Español neutro en el código visible y en los mensajes.

---

## 5. Cómo se resuelve un conflicto

En orden, hasta que uno resuelva:

1. **El esquema zod manda sobre la prosa.** Si `docs/` dice una cosa y
   `packages/contract/src/index.ts` otra, el código tiene razón y el documento es un bug.
   Corregir el documento no necesita propuesta (no es código ejecutable): es
   `--skip-gates`.
2. **El dueño único manda sobre la copia.** Cada regla tiene un solo dueño y todos los demás
   la importan. Si dos lugares calculan lo mismo distinto, el bug está en el que no es dueño:

   | Regla | Dueño único |
   |---|---|
   | Id de encabezado | `headingId` (contrato) — N0-22 |
   | Plegado de acentos y mayúsculas | `fold` (contrato) |
   | Slug válido / normalización | `Slug`, `normalizeSlug` (contrato) |
   | División efectiva de una página | `divisionOf`, `effectiveDivisions` (contrato) — N0-23 |
   | Color de una división | `divisionColor` (contrato) — N0-12 |
   | ¿Cuenta como contenido? | `countsAsContent` (contrato) |
   | Repaso espaciado | `sm2` (contrato) — N0-28 |
   | Rótulo canónico de cuatrimestre | `canonicalSemester` (contrato) — N0-32 |
   | Rutas del SPA | `routes` (contrato) |
   | Ruta de un archivo del sitio | `sitePaths` (contrato) |
   | Base de un bundle en el sitio | `siteToolBase` (contrato) |
   | Fases distintas de un plan con modalidades | `planPhases` (`@sinapsis/markdown`) |

3. **La plataforma decide sobre la presentación; la materia, sobre el contenido.** Si el
   desacuerdo es «cómo se ve», gana la plataforma sin discusión. Si es «qué dice», gana la
   materia.
4. **Si sigue sin resolverse, es una propuesta.** No se parchea en la materia ni se mergea
   en la plataforma sin veredicto escrito (N0-44).

---

## 6. Qué pasa cuando algo viola el contrato

Hay tres regímenes distintos y conviene no mezclarlos.

### 6.1 Advertencias — el contenido nunca rompe una publicación

El compilador **no falla por contenido**. Una página sin `resumen`, un wikilink roto, una
división no declarada, un quiz sin opción correcta: todo eso genera una `CompileIssue` que se
imprime como advertencia y el material se emite igual. Los `IssueKind` existentes son:

`slug-normalized` · `duplicate-slug` · `unknown-division` · `invalid-division` ·
`unknown-type` · `missing-summary` · `invalid-order` · `broken-link` · `nested-folder` ·
`study-invalid` · `study-empty` · `study-duplicate-id` · `study-broken-ref` ·
`quiz-few-options` · `quiz-no-correct`

Esas advertencias viajan de tres maneras: las imprime el CLI (`publish`, con o sin
`--dry-run`), van al cuerpo del pull request de la materia, y quedan guardadas en
`SiteSubject.warnings` (tope 500) para el reporte de la plataforma. Ninguna detiene la
publicación. `site build --strict` es la única excepción, y es una decisión del build, no del
contrato: sirve para que el CI no deje pasar contenido roto sin que nadie lo mire.

### 6.2 Errores del compilador — solo contención de rutas

`compileWiki` lanza (y el CLI sale 1) únicamente cuando una ruta del config apunta fuera de
su carpeta. Son tres mensajes literales:

```
wiki.root: "<valor>" queda fuera de la carpeta del config
wiki.index: la ruta "<valor>" queda fuera de la carpeta del wiki
wiki.log: la ruta "<valor>" queda fuera de la carpeta del wiki
wiki.study: "<valor>" queda fuera de la carpeta del config
```

Es defensa en profundidad: `SafeRelativePath` ya rechaza `..`, rutas absolutas y `~`, pero el
config viene de un repositorio ajeno y no se confía en la forma del texto.

### 6.3 Rechazos duros — validación de esquema y del protocolo

| Dónde | Mensaje | Efecto |
|---|---|---|
| `sinapsis validate` (config) | `<ruta> no cumple el contrato:` y una línea `  <campo>: <motivo>` por issue de zod | salida `1` |
| `sinapsis validate` (reglas que zod no expresa) | `<ruta> tiene N problema(s):` + `  <campo>: <motivo>` | salida `1` |
| `publish` / `site build`, config que no valida | El mismo formato, nombrando la materia | salida `1` |
| Tools, id cruzado | `El id del manifiesto ("<a>") no coincide con el de la carpeta ("<b>")` | salida `1` |
| Tools, archivo declarado ausente | `El manifiesto declara archivos que no existen: <lista>` | salida `1` |
| Tools, ruta inadmisible | `Archivo "<path>": <motivo>` / `El archivo "<path>" viene repetido en el bundle` | salida `1` |
| Bundle demasiado grande | `El bundle supera el tope de 20 MB` | salida `1` |
| PR de materia fuera de alcance | El job `subject-pr` lista los archivos que salen de `subjects/<slug>/` | CI en rojo |
| Archivo del sitio con otro `format` | El esquema de `site.ts` no valida | la web muestra un error de carga |
| Copia de seguridad inválida | `LocalBackup` no valida | se rechaza el archivo entero, sin fusiones parciales |

Todos los mensajes van en español neutro, en la primera línea de la salida del comando (lo
que viene después es el eco de pnpm por el código de salida, no la causa).

### 6.4 Qué NO hace un rechazo

- Un `publish` rechazado **no deja la materia a medias**: se compila y se valida todo antes
  de escribir nada, y lo que se escribe va en un worktree temporal que solo llega al
  repositorio como una rama completa.
- Un bundle roto **detiene la publicación entera** en vez de dejar la materia con la mitad de
  sus herramientas.
- Un `site build` fallido **no deja el sitio mezclado**: la materia que falla hace salir `1` y
  el error nombra la carpeta y el campo.
- Borrar una página **no borra el estado personal**: las páginas estudiadas, los favoritos,
  los apuntes, el repaso espaciado y las tareas se guardan por slug o por id en el navegador y
  sobreviven; si la página o la tarjeta vuelve, la marca sigue ahí. Lo único que desaparece de
  la vista es el repaso de tarjetas que ya no existen en el material vigente.

---

## 7. Diez principios, en una línea cada uno

1. La materia produce datos y herramientas; la plataforma decide cómo se ven.
2. Todo lo común se cambia por propuesta revisada, nunca por parche.
3. Cada regla tiene un dueño único y todos los demás la importan.
4. El contenido nunca rompe una publicación: los problemas de contenido son advertencias.
5. Lo que viene de una materia es dato ajeno: se valida en el borde, siempre.
6. Ninguna ruta declarada por una materia puede salir de su carpeta.
7. Los ids son estado del usuario: cambiarlos le borra el progreso.
8. Un campo nuevo nace opcional y con default.
9. Publicar reemplaza: lo que no viene, se borra (salvo el estado personal, que es del navegador).
10. La fuente de verdad es el esquema zod; este texto lo explica.

---

## Fuente ejecutable

- `packages/contract/src/index.ts` — todos los esquemas y helpers compartidos.
- `packages/contract/src/runtime.ts` — `CompatApp`, `SinapsisRuntime`, `FigureContext`.
- `packages/contract/src/site.ts` — los archivos del sitio y el estado personal.
- `packages/markdown/src/compile.ts` — `IssueKind`, `formatIssues`, `isInside`, contención de rutas.
- `packages/cli/src/commands/validate.ts` — `extraChecks`, mensajes de `validate`.
- `packages/cli/src/commands/publish.ts` · `site.ts` — qué se publica y qué se compila.
- `.github/workflows/ci.yml` — los gates de cada PR y la regla de alcance de un PR de materia.

## Decisiones relacionadas

N0-1 (monorepo) · N0-6 (materias globales, landing por persona) · N0-11 (rail fijo/slot) ·
N0-12 (color paramétrico) · N0-13 (compilador propio) ·
N0-21 (H1 duplicado) · N0-22 (dueño de los ids de encabezado) · N0-23 (divisiones sintéticas) ·
N0-27 (el estudio es contenido de la materia) · N0-28 (SM-2) · N0-41 (bundles clásicos) ·
N0-42 (figuras) · N0-43 (`Plan.tracks`) · N0-44 (propuestas) · N0-45 (esta carpeta) ·
N0-47 (normalización de `$$`) · N0-56 (sitio estático, estado personal en el navegador) ·
N0-57 (materias como fuente en `subjects/`) · N0-58 (integración por PR, sin coautoría) ·
N0-59 (`basename` y `404.html`) · N0-60 (búsqueda y grafo en el cliente).
