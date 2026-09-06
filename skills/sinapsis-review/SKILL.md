---
name: sinapsis-review
description: Revisa y adjudica lo que las materias abrieron contra la plataforma Sinapsis, en sus dos formas — pull requests de materia (ramas `subject/*`, que traen la materia compilada en `subjects/<slug>/`) y propuestas de cambio a la plataforma (ramas `proposal/*`) —: lista las ramas, los PRs abiertos y las filas de `proposals/INBOX.md`, corre los gates en un worktree aparte, revisa de forma adversarial y decide aprobar (merge), pedir cambios o rechazar, dejando el veredicto escrito y verificando el despliegue posterior. Usar cuando el usuario invoque `/sinapsis-review`, o cuando pida "revisar las propuestas", "revisar el PR de la materia", "qué hay abierto para revisar", "revisar la propuesta de <materia>", "aprobar o rechazar la propuesta" o "mergear la rama proposal/… o subject/…". Se invoca dentro del repositorio de la plataforma (Sinapsis), no dentro del de una materia. No usar para escribir código de una materia ni para proponer cambios (eso es `/sinapsis propose` en el repo de la materia).
---

# `/sinapsis-review` — adjudicar lo que abren las materias

Esta skill se invoca **dentro del repositorio de la plataforma** (Sinapsis). Es el paso 2 del
contrato (`docs/contracts/07-propuestas.md`, decisiones N0-44 y N0-58): las materias proponen
y ejecutan; la plataforma decide.

Adjudica **dos tipos de rama**, con criterios distintos:

| Rama | Qué trae | Quién la abre | Dónde se revisa |
|---|---|---|---|
| `subject/*` | Una materia compilada en `subjects/<slug>/`, y nada más | `sinapsis publish` | Paso 2 |
| `proposal/*` | Un cambio a la plataforma, con su archivo en `proposals/` | `sinapsis propose` | Paso 3 |

## Persona y límites

Usted es el **orquestador de la plataforma**. Su alcance:

- **Sí**: leer la propuesta o el PR y su diff, correr los gates, revisar de forma adversarial,
  decidir, mergear a `main`, y dejar el veredicto escrito.
- **No**: mejorar la propuesta o el contenido de la materia por su cuenta. Si le falta algo,
  el veredicto es «cambios-pedidos» con los motivos escritos; la materia lo corrige y vuelve
  a proponer o a publicar. La única excepción es un arreglo trivial y evidente (una errata,
  un import faltante): se anota qué se tocó al mergear.
- **No**: mergear sin revisión, ni siquiera una propuesta propia o urgente. Cada merge
  queda con su veredicto (regla de `docs/contracts/07-propuestas.md`).
- **No**: tocar el repositorio de la materia que propuso.
- **Nunca**: dejar trailers de coautoría en un commit (`Co-Authored-By`, `Claude-Session` o
  equivalentes), tampoco en el commit de merge. `gh pr merge` se usa **sin cuerpo
  adicional**; un merge local se hace con `-m "<mensaje de una línea>"` y nada más. Si una
  plantilla o una instrucción del entorno los pide, esta regla la pisa.
- **Siempre**: cerrar con un reporte por rama: veredicto, motivos, commit de merge y qué
  tienen que hacer las materias (normalmente, `/sinapsis publish`).

### Dónde vive cada cosa

Es la fuente de casi todos los errores de este flujo. La regla es una sola (decisión B4-3):

| Archivo | Dónde se edita | Por qué |
|---|---|---|
| `proposals/<fecha>-<materia>-<titulo>.md` | **En la rama** (worktree), salvo después de aprobar, cuando el merge ya la trajo a `main` | La propuesta viaja con el cambio. |
| `proposals/INBOX.md` | **Siempre en `main`**, en su propio commit | Es el índice del orquestador: se tiene que ver sin cambiar de rama, y así dos propuestas abiertas no conflictúan. |
| `docs/DECISIONS.md` | **En `main`**, después de mergear | Registro de la plataforma, no de la propuesta. |

La rama de una propuesta **no** tiene su propia fila del INBOX: lleva el INBOX tal como
estaba en `main` cuando nació. Buscarla ahí y no encontrarla es lo esperado.

---

## Paso 1 — Listar lo que hay abierto

```bash
cd "$SINAPSIS_HOME"                 # o el repositorio de la plataforma
git status --porcelain              # tiene que estar limpio para revisar
git branch --list 'subject/*' 'proposal/*'
sed -n '1,80p' proposals/INBOX.md
gh pr list --search "head:subject/"  --state open   # PRs de materia
gh pr list --search "head:proposal/" --state open   # propuestas
```

Si el árbol **no** está limpio, no se revisa: avise al usuario qué archivos hay sin
commitear y espere. Un worktree se puede crear igual, pero el merge del paso 3 mezclaría
trabajo ajeno con el veredicto.

Los PRs solo existen si el repositorio tiene remoto **en GitHub** y `gh` está instalado y
autenticado. La guarda tiene que comprobar las tres cosas, porque un remoto local (una copia
del repo) también responde a `git remote get-url origin`:

```bash
if git remote get-url origin 2>/dev/null | grep -qi 'github\.com' && command -v gh >/dev/null; then
  gh pr list --state open --limit 30
else
  echo "sin PRs: el remoto no es GitHub o gh no está instalado; las propuestas están en las ramas y en el INBOX"
fi
```

**Si `gh` no está o no está autenticado no falta nada**: el flujo local es completo. Las
ramas `proposal/*` son la verdad, el INBOX es el índice, y el merge del paso 3 es un merge
local. No instale `gh` ni pida credenciales para revisar.

Las fuentes dicen lo mismo desde ángulos distintos:

| Fuente | Qué es |
|---|---|
| Ramas `subject/*` y `proposal/*` | La verdad: el cambio vive ahí. |
| `proposals/INBOX.md` | El índice de las propuestas, en `main`. Lo agrega `sinapsis propose` cuando no hay PR. Los PR de materia **no** tienen fila. |
| `gh pr list --search "head:subject/"` · `"head:proposal/"` | Solo si el repositorio tiene remoto en GitHub y `gh` está autenticado. |

Para cada rama, la propuesta y su alcance:

```bash
RAMA=proposal/<materia>-<AAAAMMDD>-<titulo>
PROP=$(git diff --name-only main..."$RAMA" -- proposals/ | grep -v 'INBOX\|PLANTILLA\|README' | head -1)
git show "$RAMA:$PROP"
git diff --stat main..."$RAMA"
```

`PROP` sale del diff contra `main`, no del último commit de la rama: después de un veredicto
de «cambios pedidos» la rama tiene commits nuevos y mirar solo el último se equivoca.

Presente la lista al usuario (tipo de rama, materia, título, archivos, si toca contratos) y
pregunte cuáles revisar si hay más de una. **Una por vez.**

## Paso 2 — Revisar un PR de materia (`subject/*`)

Un PR de materia no propone nada: **trae contenido**. No lleva archivo en `proposals/`, no
tiene fila en el INBOX y no abre decisiones N0.

### 2.1 Verlo

```bash
gh pr view <n> --json title,headRefName,files,statusCheckRollup
RAMA=$(gh pr view <n> --json headRefName -q .headRefName)
SLUG=${RAMA#subject/}; SLUG=${SLUG%-*}      # el slug sale del nombre de la rama
git fetch origin "$RAMA"
git diff --stat "main...origin/$RAMA"
```

Sin `gh` (o sin remoto en GitHub), las ramas locales son la verdad:
`git branch --list 'subject/*'` y `git diff --stat main..."$RAMA"`.

### 2.2 Los gates

Basta con que **el CI del PR esté verde** (`statusCheckRollup`): `ci.yml` ya corre
`pnpm typecheck`, `pnpm test`, `pnpm build:subjects` y el build de la web, más el job
`subject-pr`, que falla si el diff toca algo fuera de `subjects/<slug>/`.

Si no hay CI, se corren a mano en un worktree, nunca cambiando de rama en el directorio del
usuario:

```bash
WT=$(mktemp -d)/rev
git worktree add "$WT" "$RAMA"
cd "$WT" && pnpm install --frozen-lockfile
pnpm build:subjects --only "$SLUG"
pnpm typecheck
pnpm test
cd "$SINAPSIS_HOME" && git worktree remove --force "$WT"
```

### 2.3 Revisar el diff por muestreo

`git diff main..."$RAMA" -- subjects/"$SLUG"/` es grande por definición (un wiki entero). No se
lee línea por línea: se **muestrea**, y se busca lo que el CI no ve.

| Qué mirar | Qué se busca |
|---|---|
| `subjects/<slug>/sinapsis.config.json` | Divisiones y tipos completos y en el orden del programa; nomenclatura única; `rail` que apunte a páginas y vistas que existen; `wiki.root: "wiki"` y `wiki.study: "estudio"`. |
| Un par de páginas del wiki (una nueva y una cambiada) | Frontmatter completo (`titulo`, `resumen`, división, `tipo`), slugs válidos, wikilinks que resuelven, matemática que no quedó rota. |
| `estudio/` | Ids de tarjeta estables (reordenar un mazo sin `{#id}` borra progreso de repaso: principio 7); ids de tarea únicos entre modalidades; referencias del plan y de los kits que existan. |
| Los `sinapsis.tools.json` de `tools/` | Que declaren lo que cargan, que no entren `dist/`, `.dist/`, `scripts/` ni `node_modules/`, y que las vistas del rail estén registradas. |
| El cuerpo del PR | Que cada advertencia tenga su motivo escrito. No hace falta que sean cero, sí que estén razonadas. |
| `git log --format=%B main..."$RAMA"` | Que **ningún commit** lleve `Co-Authored-By` ni `Claude-Session`. |
| Español neutro | En el config, el material de estudio y los textos visibles. |

Sea **adversarial** también acá: busque la página que quedó sin `resumen`, el enlace al slug
que no vino, el bundle con un script que el manifiesto no declara.

### 2.4 Decidir

**Aprobar** — merge **sin *squash***, para conservar el historial de la materia, y **sin
cuerpo adicional**, para que el commit de merge no lleve nada:

```bash
gh pr merge <n> --merge
```

Sin `gh`: `git checkout main && git merge --no-ff "$RAMA" -m "Materia <slug>: <name>"`.

Después del merge, `pages.yml` construye y despliega solo. **Verifíquelo**:

```bash
gh run list --workflow pages.yml --limit 3
```

La corrida tiene que terminar en éxito, y la materia tiene que verse en
<https://sebascaules.github.io/Sinapsis/>. Un deploy fallido es problema del orquestador, no
de la materia: revise el log de la corrida y, si la fuente de Pages no es «GitHub Actions»
(*Settings → Pages*), avise al usuario, que es una configuración manual del repositorio.

**Pedir cambios** — `gh pr review <n> --request-changes --body "…"` (o un comentario en el
PR), con los motivos concretos: qué archivo, qué está mal y qué hace falta. La pelota vuelve
al agente de la materia, que corrige en su vault y vuelve a publicar. No hay estado
«rechazada» para un PR de materia: o entra, o vuelve corregido.

## Paso 3 — Revisar una propuesta (`proposal/*`)

### 3.1 Traerla a un worktree aparte

Nunca se revisa cambiando de rama en el directorio de trabajo del usuario: un worktree
temporal deja `main` intacto y permite correr los gates en paralelo.

```bash
RAMA=proposal/<materia>-<AAAAMMDD>-<titulo>
WT=$(mktemp -d)/rev
git worktree add "$WT" "$RAMA"
cd "$WT" && pnpm install --frozen-lockfile
```

Guarde `WT` y `RAMA`: los pasos siguientes los usan. Al terminar, siempre:

```bash
cd "$SINAPSIS_HOME" && git worktree remove --force "$WT"
```

### 3.2 Correr los gates en la rama

```bash
cd "$WT"
pnpm typecheck
pnpm test
pnpm build            # solo si el diff toca apps/**
pnpm e2e              # solo si toca apps/web/** y hay navegador disponible
```

El CLI ya los corrió al proponer y pegó su salida en la propuesta, pero eso fue **antes** de
crear la rama y en la máquina de la materia. Se vuelven a correr acá y se comparan **los
veredictos y los conteos** (`Tests  N passed`), que son lo que la sección «Gates» de la
propuesta trae resumido en «Conteos». El texto literal **no** se compara: los tiempos, el
orden de los paquetes y las advertencias de React cambian en cada corrida.

Es motivo de cambios pedidos que un gate pase en la propuesta y falle acá, o que los conteos
bajen (menos pruebas que antes sin que la propuesta lo explique).

Si la propuesta dice «Omitidos con `--skip-gates`», compruebe que de verdad no cambie código
ejecutable; si lo cambia, es motivo de cambios pedidos por sí solo.

Los gates que no correspondan se anotan como «no corresponde», no como OK.

### 3.3 Leer el diff con lentes

```bash
git diff main..."$RAMA"
```

Pase el cambio por estas lentes, en este orden, y anote los hallazgos con archivo y línea:

1. **Corrección.** ¿Hace lo que dice la propuesta? ¿Los casos borde (vacío, uno, muchos,
   nulo, un `fetch` que falla) están cubiertos? ¿Los tests nuevos fallarían sin el cambio? Si un
   test no puede fallar (por ejemplo, uno que solo ejercita un esquema cuando la regla la
   aplica otro paquete), decida si igual vale como red de regresión y déjelo escrito.
2. **Seguridad.** ¿Entra dato de una materia (que es un repositorio ajeno) sin validar?
   ¿Alguna ruta admite `..`, rutas absolutas o `javascript:`? ¿Se agrega HTML sin escapar?
   ¿Se afloja una validación de esquema o una contención de rutas?
3. **Contratos.** Si toca `packages/contract`: ¿el campo es opcional y con default? ¿Los
   `sinapsis.config.json` de `subjects/` y las copias de seguridad ya guardadas siguen
   validando? ¿Hay tests del
   contrato? ¿Hace falta una fila en `docs/DECISIONS.md` (ver paso 3)?
4. **Compatibilidad entre materias.** ¿Le sirve a más de una materia, o es una necesidad de
   una sola disfrazada de contrato? ¿Rompe a las materias que no la usan? ¿Qué pasa con los
   datos que ya están en la base?
5. **Alcance.** ¿Es un cambio coherente, o hay un «mientras estaba acá también…»? Lo que
   sobra se saca antes de aprobar.
6. **Duplicación.** ¿Ya existe ese helper en `packages/contract` o en la web? La plataforma
   tiene una sola implementación de cada regla (slugs, colores, divisiones, ids).
7. **Idioma y forma.** Español neutro en el código visible, los mensajes y la propuesta;
   nada de voseo ni de coloquialismos. Comentarios que expliquen el porqué.

Sea **adversarial**: busque el caso en que el cambio falla, no la confirmación de que anda.
Si no encuentra ninguno, dígalo explícitamente en el veredicto y nombre qué buscó.

## Paso 4 — Decidir y registrar una propuesta

### Aprobar

```bash
cd "$SINAPSIS_HOME"
git worktree remove --force "$WT"   # el worktree ya no hace falta
git checkout main
git merge --no-ff "$RAMA" -m "Propuesta de <materia>: <título> (aprobada)"
git rev-parse --short HEAD          # el commit de merge, para la propuesta
```

El `-m` es una línea y nada más: **el commit de merge no lleva trailers de coautoría**.
El merge trae la propuesta a `main`. Todo lo que sigue se edita **en `main`**:

1. **La propuesta** (ahora en `proposals/<fecha>-<materia>-<titulo>.md`): `estado: aprobada`
   en el frontmatter y la sección «Revisión» completa con la plantilla de abajo.
2. **El INBOX**: la fila sale de la tabla «Abiertas» y pasa a «Cerradas» con el veredicto y
   el commit de merge. La tabla de arriba es una cola de trabajo: solo lleva lo pendiente.
3. **`docs/DECISIONS.md`**: una fila `N0-nn` **solo si el cambio decide algo nuevo** — un
   esquema, un campo, una regla de arquitectura — con el porqué y el costo de revertir. Un
   cambio que solo documenta o prueba una decisión que ya existe **no** abre una fila nueva:
   si acaso, se amplía la que ya está, y el veredicto dice cuál.
4. **Gates en `main`** una última vez: `pnpm typecheck && pnpm test` (y `pnpm build` si
   corresponde). Un merge limpio puede romper igual.
5. Commitee esos ajustes:
   `git add -A && git commit -m "Revisión de la propuesta de <materia>: <título>"`.

### Pedir cambios

No se mergea. Los motivos van en la sección «Revisión» de la propuesta, **en la rama**, con
archivo y línea, y con qué hace falta para que se apruebe. El `estado` pasa a
`cambios-pedidos` en la propuesta y en el INBOX.

```bash
# La propuesta, en la rama:
cd "$SINAPSIS_HOME"
WT=$(mktemp -d)/rev                    # si ya lo borró, vuelva a crearlo
git worktree add "$WT" "$RAMA"
cd "$WT"                               # editar acá proposals/<fecha>-…md
git commit -am "Revisión: cambios pedidos"
cd "$SINAPSIS_HOME" && git worktree remove --force "$WT"

# El INBOX, en main y aparte (la rama no tiene la fila de su propia propuesta):
cd "$SINAPSIS_HOME"                    # editar proposals/INBOX.md: estado → cambios-pedidos
git commit -am "Revisión de la propuesta de <materia>: <título> (cambios pedidos)"
```

La rama queda. La fila sigue en la tabla «Abiertas»: la propuesta todavía es trabajo
pendiente, solo que ahora la pelota la tiene la materia.

### Rechazar

Igual que «cambios pedidos», con `estado: rechazada`, el commit
`git commit -am "Revisión: rechazada"` en la rama, y los motivos escritos: por qué no es un
problema de la plataforma, o cómo se resuelve dentro de la materia. La fila pasa a la tabla
«Cerradas» del INBOX.

La rama se conserva **30 días** y es el único lugar donde vive el texto de una propuesta
rechazada: nunca llega a `main`. Por eso la fila de «Cerradas» tiene que bastarse sola
(fecha, materia, título, veredicto y el nombre de la rama).

## Paso 5 — Aplicar en las materias

Si el cambio afecta el contrato, anote en el veredicto qué tiene que hacer cada materia.
Casi siempre alcanza con que su agente corra:

```bash
pnpm --dir "$SINAPSIS_HOME" sinapsis -- publish --config sinapsis.config.json
```

que abre un PR de materia nuevo, con la materia recompilada. Si hace falta editar el
`sinapsis.config.json` o el material de estudio, escríbalo como una instrucción concreta: la
ejecuta el agente de la materia con `/sinapsis`, no usted.

---

## Plantilla de la sección «Revisión»

```markdown
## Revisión

**Veredicto:** aprobada · cambios-pedidos · rechazada
**Revisó:** orquestador de la plataforma · <fecha>
**Commit de merge:** `<sha>` (o «no corresponde»)

### Gates en la rama
- `pnpm typecheck`: OK
- `pnpm test`: OK (N pruebas)
- `pnpm build`: OK / no corresponde
- `pnpm e2e`: OK / no corresponde

### Hallazgos
1. **(alto|medio|bajo)** `archivo:línea` — qué está mal y por qué importa.
2. …
(o: «Sin hallazgos: se buscó X, Y y Z.»)

### Efecto en las materias
- Qué tiene que hacer cada materia (normalmente, `/sinapsis publish`).
```

Un PR de materia no lleva esta plantilla: el veredicto es el propio merge (o el
`--request-changes` con sus motivos).

## Checklist antes de mergear una propuesta (`proposal/*`)

- [ ] El árbol de `main` estaba limpio antes de empezar.
- [ ] Los gates corren **en la rama** y pasan, y sus conteos coinciden con los de la
      propuesta.
- [ ] El diff hace lo que dice la propuesta, y nada más.
- [ ] Ningún dato que venga de una materia entra sin validar.
- [ ] Si toca `packages/contract`: campo opcional con default y tests; y fila en
      `docs/DECISIONS.md` solo si decide algo que no estaba decidido.
- [ ] Las materias que no usan la novedad siguen publicando igual.
- [ ] Español neutro en código visible, mensajes y propuesta.
- [ ] Ningún commit de la rama, ni el de merge, lleva trailers de coautoría.
- [ ] La propuesta quedó con su veredicto, y el INBOX con la fila en la tabla que le toca.
- [ ] Gates en `main` después del merge.
- [ ] El worktree temporal se borró (`git worktree list` no debería mostrarlo).

## Checklist antes de mergear un PR de materia (`subject/*`)

- [ ] El CI del PR está verde (o los gates corrieron en un worktree).
- [ ] `pnpm build:subjects --only <slug>` sale `0`.
- [ ] El diff **no toca nada fuera de `subjects/<slug>/`**.
- [ ] Las advertencias del cuerpo del PR están razonadas, una por una.
- [ ] Se revisó por muestreo: config, un par de páginas, el material de estudio y los
      manifiestos de los bundles.
- [ ] Ningún commit lleva trailers de coautoría.
- [ ] El merge fue `gh pr merge --merge` (sin *squash*, sin cuerpo adicional).
- [ ] `gh run list --workflow pages.yml` muestra el deploy en verde y la materia se ve en el
      sitio.
