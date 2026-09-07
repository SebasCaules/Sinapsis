# 06 · La skill y el agente de materia — contrato operativo

Cada materia tiene su propio agente: una sesión de Claude Code **dentro del repositorio de la
materia** (el vault de Obsidian con su wiki), con la skill `/sinapsis`. Este documento es su
contrato de trabajo: qué comandos existen, qué sale de cada uno, qué puede tocar y qué no.

El orquestador tiene su propia skill, `/sinapsis-review`, y se invoca en el repositorio de la
plataforma: ver `07-propuestas.md`.

Desde el Sprint 4 el trabajo del agente de materia **termina en un pull request**, no en una
llamada a un servidor: `sinapsis publish` deja la materia en `subjects/<slug>/` del
repositorio de la plataforma, en su propia rama, y abre el PR que el orquestador adjudica
(N0-57, N0-58).

---

## 1. Dónde está el CLI

El CLI vive en el repositorio de la plataforma, no en el de la materia. Su ubicación canónica
es `SINAPSIS_HOME`; si no está definida, `~/Desktop/Projects/Sinapsis`.

```bash
SINAPSIS_HOME="${SINAPSIS_HOME:-$HOME/Desktop/Projects/Sinapsis}"
pnpm --dir "$SINAPSIS_HOME" sinapsis -- <comando> [opciones]
```

**Las rutas relativas se resuelven contra el directorio desde el que se invoca**, no contra el
del CLI. Situado en el repositorio de la materia, `--config sinapsis.config.json` apunta al de
la materia. El orden de resolución es:

1. `--cwd <dir>` — la bandera global; vale en cualquier posición y gana siempre.
2. `INIT_CWD` — solo si el proceso quedó dentro del paquete del CLI, que es lo que hace
   `pnpm --dir <repo> sinapsis -- …`.
3. `process.cwd()` — el caso normal.

Se admite `~` y `~/…` en las rutas del usuario.

### Variables de entorno

| Variable | Default | Qué es |
|---|---|---|
| `SINAPSIS_HOME` | `~/Desktop/Projects/Sinapsis` | Repositorio de la plataforma: para invocar el CLI, para `publish` y para `propose`. |
| `SINAPSIS_WEB` | `https://sebascaules.github.io/Sinapsis` | Base del sitio, para el enlace final que imprime el CLI. |

**No hay más.** `SINAPSIS_API`, `SINAPSIS_TOKEN` y `SYNC_TOKEN` desaparecieron con el API: no
hay servidor al que apuntar ni token que presentar. Si una instrucción vieja las menciona,
está desactualizada.

---

## 2. Los comandos

Banderas globales: `--cwd <dir>`, `-v` / `--version`, `--help`.

| Comando | Banderas | Qué hace |
|---|---|---|
| `init` | `--wiki <dir>` (`wiki`) · `--out <file>` (`sinapsis.config.json`) · `--slug <slug>` · `--force` | Propone un `sinapsis.config.json` a partir del wiki y deja lista la carpeta del material de estudio. |
| `validate` | `--config <file>` (`sinapsis.config.json`) | Valida el config contra el contrato y el **formato** del material de estudio. |
| `publish` | `--config <file>` · `--wiki <dir>` · `--repo <dir>` · `--dry-run` · `--out <file>` · `--no-pr` · `--branch <nombre>` | Compila, valida y publica la materia: la copia a `subjects/<slug>/` en una rama `subject/*` del repositorio de la plataforma y abre el PR. |
| `sync` | (las de `publish`) | **Alias oculto de `publish`**, por compatibilidad. Avisa y sigue. |
| `site build` | `--subjects <dir>` (`subjects`) · `--out <dir>` (`apps/web/public/subjects`) · `--only <slug>` · `--strict` | Compila `subjects/**` a los archivos estáticos del sitio. Lo corre el build de la plataforma, no la materia. |
| `status` | `--config <file>` · `--wiki <dir>` · `--repo <dir>` | Compara el vault local con lo que ya está en `subjects/<slug>/` y lista los PR de materia abiertos. |
| `tools build` | `--config <file>` · `--dir <dir>` · `--minify` · `--out <file>` | Valida y empaqueta los bundles de `<config>/tools`. |
| `tools list` | `--config <file>` · `--repo <dir>` | Bundles que la materia tiene en `subjects/<slug>/tools`. |
| `propose` | `--subject <slug>`* · `--title <texto>`* · `--body <texto>`* · `--files <a,b>` · `--compat <texto>` · `--skip-gates` · `--repo <dir>` | Propone un cambio a la **plataforma**. (\* obligatorias) |

`tools push` **ya no existe**: los bundles viajan dentro del `publish`, como parte de
`subjects/<slug>/tools/`.

### 2.1 `init`

```bash
pnpm --dir "$SINAPSIS_HOME" sinapsis -- init --wiki wiki
```

Escribe el config en `--out` e imprime qué infirió: tipos de página (de las carpetas), campo
de división y sus valores con conteos, páginas sin `resumen`, y qué falta completar a mano.
Deja además la carpeta del material de estudio con un `README.md` del formato y un mazo de
ejemplo, **sin pisar nada que ya exista**.

Salida `1` si: la carpeta del wiki no existe · el archivo de salida ya existe y no se pasó
`--force` · no hay ningún `.md` en las carpetas del wiki · el config inferido no valida.

Lo que `init` deja como `COMPLETAR` y hay que completar a mano: `name`, `code`,
`institution`, `semester`; los nombres reales de las divisiones; la nomenclatura
(`division`); el `rail` (queda vacío); el `color` (opcional).

### 2.2 `validate`

```bash
pnpm --dir "$SINAPSIS_HOME" sinapsis -- validate --config sinapsis.config.json
```

Salida `0`:

```
Config válido: /ruta/sinapsis.config.json
  proba · Probabilidad y Estadística · 11 unidades · 6 tipo(s) de página
  Estudio: 6 mazos (46 tarjetas) · 1 quiz (15 preguntas) · plan: 6 fases · 8 kits
  Modalidades: Cursada + final (6 fases) · Final directo (3 fases)
  aviso · rail.resolver.calc: ningún bundle de tools/ registra la vista "calc" (…)
```

Salida `1` si: no encuentra el config · no es JSON válido · no cumple el esquema · alguna
regla de `extraChecks` falla · `wiki.study` queda fuera de la carpeta del config. **Los
avisos amarillos no cambian el código de salida.**

`validate` **no compila el wiki**: no puede verificar las referencias a slugs de página. Eso
sale en `publish --dry-run`, y el propio comando lo aclara.

### 2.3 `publish`

```bash
pnpm --dir "$SINAPSIS_HOME" sinapsis -- publish --config sinapsis.config.json --dry-run
pnpm --dir "$SINAPSIS_HOME" sinapsis -- publish --config sinapsis.config.json
```

Estructura de la salida, en este orden:

```
Probabilidad y Estadística · 93.24 · ITBA [proba]
  wiki: /ruta/al/wiki
  páginas: 209

  por tipo
    Conceptos                  74
    …
    Fuentes                    18  (no cuenta)
    Meta (índice, registro)     2

  por división
    Unidad 1 · Estadística Descriptiva        18
    …
    Sin división (índice, registro, sueltas)   2
    divisiones sin páginas: eval

  Estudio: 6 mazos (46 tarjetas) · 1 quiz (15 preguntas) · plan: 6 fases · 8 kits
  /ruta/al/estudio

  bundles: proba-tools (22 archivos, 913 KB) · proba-exercises (…)

  3 advertencia(s)
    …

publish OK · proba — 209 página(s), 2 bundle(s)
  rama: subject/proba-20260906
  PR abierto: https://github.com/SebasCaules/Sinapsis/pull/12
```

- **Con `--dry-run`** termina en `--dry-run: no se escribió nada.` y sale `0`. Es el modo de
  revisión: compila el wiki y el material de estudio y muestra todas las advertencias.
- **Con `--out <file>`** escribe el payload compilado (JSON indentado) antes de publicar.
- **Qué copia y qué borra**: §1 de `05-publicacion-y-sitio.md`. En corto: el config reescrito
  con `wiki.root: "wiki"` y `wiki.study: "estudio"`, el wiki, `estudio/` y los archivos de
  cada bundle; **reemplazo completo** de `subjects/<slug>/`, y nunca `dist/`, `.dist/`,
  `scripts/` ni `node_modules/`.
- **Dónde trabaja**: en un worktree temporal creado desde `origin/main` (o `main` si no hay
  remoto). **Nunca toca el árbol de trabajo del usuario ni cambia su rama**, ni en la materia
  ni en la plataforma.
- **El commit no lleva coautoría.** Ningún trailer `Co-Authored-By`, `Claude-Session` ni
  equivalente: el mensaje termina en su última línea de contenido (N0-58).
- **El PR** se abre si hay remoto en GitHub y `gh` autenticado. Con `--no-pr`, sin remoto o
  sin `gh`, deja la rama local y lo dice: no falta nada, el orquestador puede mergear
  localmente.
- **Un bundle roto detiene la publicación entera** en vez de dejar la materia a medias. Una
  materia **sin** carpeta `tools/` (o con la carpeta y sin ningún `sinapsis.tools.json`) no
  es un bundle roto: se avisa en amarillo y se publica igual.
- `--wiki <dir>` sobrescribe `wiki.root`. **No mueve `wiki.study`**, que cuelga del config.

Salida `1` si: el config no carga o no valida · el wiki no compila (rutas fuera de la
carpeta) · algún bundle no compila (no tener bundles no cuenta) · el repositorio de la
plataforma no existe o no es un repositorio git · falla la creación de la rama o el commit.

### 2.4 `status`

```bash
pnpm --dir "$SINAPSIS_HOME" sinapsis -- status --config sinapsis.config.json
```

Compara el vault local con lo que ya está publicado en `<repo>/subjects/<slug>/`: páginas
**nuevas, cambiadas y borradas** por huella del contenido, más el material de estudio y los
bundles. Si hay `gh`, lista además los PR abiertos `subject/<slug>-*`.

No hay servidor, así que `status` no necesita sesión ni token, y **no depende de que el sitio
esté desplegado**: mira el repositorio.

### 2.5 `tools build | list`

```bash
pnpm --dir "$SINAPSIS_HOME" sinapsis -- tools build            # valida y empaqueta
pnpm --dir "$SINAPSIS_HOME" sinapsis -- tools build --minify   # minifica y empaqueta eso
pnpm --dir "$SINAPSIS_HOME" sinapsis -- tools list             # qué hay publicado en subjects/
```

`build` informa por bundle: carpeta, archivos y bytes (con el desglose scripts / estilos /
datos), vistas registradas, si aporta figuras y el resultado del minificado. Cierra con
`N bundles listos · <bytes>`.

`list` lee `<repo>/subjects/<slug>/tools` y dice qué bundles están publicados, con sus vistas
y la ruta de cada una (`/m/<materia>/t/<vista>`).

Salida `1` si: el config no carga · no existe la carpeta de bundles · no hay ningún bundle ·
se pasó `--out` con más de un bundle · algún bundle no valida.

**Un bundle roto no se empaqueta ni deja empaquetar a los demás**: la materia no se publica
con la mitad de sus herramientas.

### 2.6 `site build`

Es un comando **de la plataforma**, no de la materia: lo corre `pnpm build:subjects` en local
y en CI para convertir `subjects/**` en los archivos estáticos que la web lee. Un agente de
materia normalmente no lo invoca; el orquestador sí, al revisar un PR. Contrato completo en
`05-publicacion-y-sitio.md` §2.

### 2.7 `propose`

Ver `07-propuestas.md`. Resumen: crea una rama en el repositorio de la **plataforma**, escribe
la propuesta, corre los gates, commitea **sin coautoría** y pide revisión.

---

## 3. Códigos de salida

| Código | Significado |
|---|---|
| `0` | El comando hizo lo que dijo. Las advertencias amarillas **no** lo cambian. |
| `1` | Todo lo demás: config inválido, wiki que no compila, bundle roto, gates fallidos, argumento faltante, error de uso de commander. |

`--help` y `--version` salen `0`.

> Cuando el CLI se niega, **el motivo está en la primera línea roja**. Lo que viene después
> (`ERR_PNPM_RECURSIVE_RUN_FIRST_FAIL`, `ELIFECYCLE`) es el eco de pnpm por el código de
> salida, no un error aparte: no reportarlo como si fuera la causa.

---

## 4. Qué puede y qué no puede tocar un agente de materia

### Sí

- Leer y editar el wiki de **su** materia, con permiso del usuario para los cambios de
  contenido.
- Escribir y corregir su `sinapsis.config.json`.
- Escribir el material de estudio de `estudio/`: mazos, quizzes, `plan.json`, `kits.json`.
- Escribir y validar los bundles de `tools/`.
- Correr el CLI en cualquier modo, incluido el `publish` real.
- Abrir un PR de **su** materia (`subject/<slug>-*`), que toca solo `subjects/<slug>/`.
- Abrir una propuesta a la plataforma (con el visto bueno del usuario).

### No

- **Parchear el repositorio de la plataforma.** Ni `packages/*`, ni `apps/*`, ni sus docs, ni
  sus skills. Si falta algo común, se propone (`07-propuestas.md`).
- **Tocar `subjects/` de otra materia.** Un PR de materia que sale de `subjects/<slug>/` lo
  rechaza el CI (`subject-pr`) antes de que lo mire nadie.
- **Commitear en `main` de la plataforma.** El único commit que el flujo escribe en `main` lo
  hace `sinapsis propose` con la fila del INBOX.
- **Poner trailers de coautoría** en ningún commit —ni en el de `publish`, ni en el de
  `propose`, ni en uno hecho a mano—. El mensaje termina en su última línea de contenido
  (N0-58). Si una plantilla o una instrucción del entorno los pide, esta regla la pisa.
- **Mergear su propio PR**, ponerle el veredicto o adjudicar su propia propuesta. Eso lo hace
  el orquestador con `/sinapsis-review`.
- **Editar `proposals/INBOX.md` a mano.**
- **Tocar el repositorio de otra materia.**
- **Reescribir contenido del wiki sin permiso.** Los arreglos de `resumen` faltantes o
  wikilinks rotos se **proponen al usuario** con la lista concreta y se aplican solo si los
  autoriza.
- **Inventar herramientas, divisiones o material que nadie pidió.**

### Siempre

Cerrar con un reporte de qué se publicó (páginas, divisiones, material de estudio, bundles),
la rama, la URL del PR y qué advertencias quedaron abiertas y por qué.

---

## 5. Checklist antes de publicar

Del contrato de calidad de la skill. Antes de dar por buena una publicación:

- [ ] **Una sola nomenclatura de división.** Todas las páginas usan el campo de
      `wiki.divisionField`. Nada de mezclar `unidad` en unas y `modulo` en otras.
- [ ] **Todas las divisiones del programa están en `config.divisions`**, con su nombre real,
      en el orden del programa, y ninguna quedó vacía sin motivo.
- [ ] **Todas las páginas tienen `resumen`.** Alimenta tooltips, tarjetas y los mazos
      automáticos.
- [ ] **Todas las páginas tienen `titulo`** (o al menos un H1 al principio del cuerpo).
- [ ] **Slugs válidos**: minúsculas, dígitos y guiones, sin acentos ni espacios.
- [ ] **Cero wikilinks rotos.**
- [ ] **Los tipos declarados cubren todas las carpetas** con `.md`.
- [ ] **`orden`** es un entero positivo donde exista y es coherente dentro de cada división.
- [ ] **El `rail`** apunta a páginas que existen (`page`) y a URLs absolutas (`link`).
- [ ] **El material de estudio no tiene referencias rotas**: cero advertencias `estudio ·` en
      el dry-run.
- [ ] **Los ids de tarjeta son estables.** Si hubo que reordenar un mazo, las tarjetas que se
      venían repasando llevan `{#id}` para no perder el progreso de repaso espaciado.
- [ ] **Los ids de tarea del plan son únicos** entre todas las modalidades, y una fase que
      aparece en dos modalidades es idéntica en las dos.
- [ ] **Cada ítem `kind: "tool"` del rail abre una vista que existe**: cero avisos
      «ningún bundle de tools/ registra la vista …» en `validate`.
- [ ] **Los bundles construyen limpio**: `tools build` sale `0`.
- [ ] **El PR toca solo `subjects/<slug>/`.** Nada de la plataforma se cuela en el diff.
- [ ] **Ningún commit lleva trailers de coautoría.**

### El orden que conviene

```bash
# 1. el config
pnpm --dir "$SINAPSIS_HOME" sinapsis -- validate --config sinapsis.config.json
# 2. el wiki y el estudio, sin escribir nada
pnpm --dir "$SINAPSIS_HOME" sinapsis -- publish --config sinapsis.config.json --dry-run
# 3. las herramientas, si las hay
pnpm --dir "$SINAPSIS_HOME" sinapsis -- tools build
# 4. corregir lo que haya que corregir (con permiso del usuario)
# 5. publicar: rama, commit y PR
pnpm --dir "$SINAPSIS_HOME" sinapsis -- publish --config sinapsis.config.json
# 6. verificar qué quedó pendiente de merge
pnpm --dir "$SINAPSIS_HOME" sinapsis -- status --config sinapsis.config.json
```

---

## 6. Advertencias del dry-run y qué hacer con cada una

| Advertencia | Qué significa | Arreglo |
|---|---|---|
| `wikilink(s) roto(s)` | El destino no existe como página. | Corregir el slug, crear la página o desenlazar. |
| `N página(s) sin "resumen"` | Sin tooltip, sin tarjeta y sin mazo automático. | Escribir 1–2 frases en el frontmatter. |
| `división "X" no está en config.divisions` | Falta declararla, o hay una errata. | Agregar la división o corregir las páginas. |
| `tipo "X" no está en config.pageTypes` | Ídem con los tipos. | Agregar el tipo o corregir las páginas. |
| `slug normalizado` | El nombre del archivo no es un slug válido. | Renombrar el archivo. |
| `subcarpeta ignorada` | Hay `.md` en un segundo nivel. | Aplanar la carpeta, o aceptarlo. |
| `divisiones sin páginas` | Una división declarada quedó vacía. | Ingerir contenido o sacarla del config. |
| `estudio · referencia rota en …` | Una tarjeta, un kit o una tarea apunta a algo que no existe. | Corregir el destino. |
| `estudio · … no marca ninguna opción correcta` | Una pregunta del quiz no tiene `- [x]`. | Marcar la correcta (si no, la pregunta se descarta). |
| `estudio · … no es JSON válido` / `phases.0.title: …` | `plan.json` o `kits.json` no cumplen el contrato. | Corregir el campo que nombra la advertencia. |
| `aviso · rail.x.y: ningún bundle de tools/ registra la vista "z"` | El ítem `tool` no tiene vista detrás. | Publicar el bundle, o corregir el `target`. |
| `N script/estilo que el manifiesto no declara (no se copian)` | Hay `.js`/`.css` en la carpeta del bundle que nadie carga. | Declararlos, o dejarlos si son de construcción. |
| `N archivo(s) con extensión ajena al contrato` | `.ts`, `.html`, `.yaml`… | Convertirlos o sacarlos de la carpeta. |

Las advertencias viajan al PR (en el cuerpo) y al sitio (`SiteSubject.warnings`): el
orquestador espera que cada una esté razonada, no que sean cero.

La línea `Estudio: …` dice qué material se va a publicar. Si dice **«sin material propio»**,
la materia no tiene carpeta de estudio (o está vacía) y la plataforma va a autogenerar un
mazo por división: es válido.

---

## 7. Cómo pedir un cambio a la plataforma

Cuando lo que falta **no se puede resolver dentro del repositorio de la materia** —un `kind`
nuevo del rail, un campo del contrato, un miembro del runtime, un comportamiento del lector,
un bug de la plataforma— el camino es una **propuesta**, no un parche.

Regla de corte:

| Se resuelve con… | ¿Propuesta? |
|---|---|
| El `sinapsis.config.json` | No: es trabajo de la materia. |
| Un bundle propio en `tools/` | No. |
| Cambiar el wiki o el material de estudio | No. |
| Algo de `packages/contract`, `packages/markdown`, `packages/runtime`, `packages/cli`, `apps/web` o `.github/` | **Sí.** |

El flujo completo, desde los dos lados, está en `07-propuestas.md`. En una línea:

```bash
pnpm --dir "$SINAPSIS_HOME" sinapsis -- propose \
  --subject <slug> --title "<qué se propone>" --body "<por qué hace falta>"
```

y después el usuario abre una sesión en el repositorio de la plataforma y ejecuta
`/sinapsis-review`. **La materia no revisa ni mergea su propia propuesta, ni su propio PR de
materia.**

---

## Fuente ejecutable

- `skills/sinapsis/SKILL.md` — la skill del agente de materia.
- `skills/sinapsis/reference/contrato.md` · `config-ejemplo.md` · `herramientas.md` — sus
  referencias.
- `skills/sinapsis-review/SKILL.md` — la skill del orquestador.
- `packages/cli/src/cli.ts` — comandos, banderas y defaults.
- `packages/cli/src/context.ts` — resolución del directorio base y de `~`.
- `packages/cli/src/commands/` — `init.ts`, `validate.ts`, `publish.ts`, `site.ts`,
  `status.ts`, `tools.ts`, `propose.ts`.
- `packages/cli/src/report.ts` — el formato de todas las salidas (`heading`, `countsByType`,
  `countsByDivision`, `studyLine`, `warnings`, `webUrl`).
- `packages/cli/src/git.ts` — worktree, rama, commit y PR.
- `packages/markdown/src/scaffold.ts` — lo que infiere `init`.

## Decisiones relacionadas

N0-13 (el compilador es un paquete propio) · N0-27 (material de estudio en el repositorio de
la materia) · N0-40 (herramientas por materia) · N0-41 y N0-42 (bundles y figuras) ·
N0-44 (propuestas) · N0-56 (sitio estático sin API ni token) ·
N0-57 (materias como fuente en `subjects/`) · N0-58 (integración por PR, sin coautoría).
