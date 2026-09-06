# 07 · Propuestas y PR de materia — cómo entra un cambio a la plataforma

Cuando una materia necesita algo **común** —un `kind` nuevo del rail, un campo del contrato,
un miembro del runtime, un comportamiento del lector, el arreglo de un bug de la
plataforma—, su agente no lo parchea: lo **propone, lo implementa en una rama del
repositorio de Sinapsis y pide revisión**. La plataforma decide (N0-44).

Es el mecanismo que hace posible el modelo de sectores incomunicados: la materia ejecuta, la
plataforma adjudica, y cada cambio a lo común queda con su veredicto escrito.

Desde el Sprint 4 las materias también entran al repositorio por pull request, así que
`/sinapsis-review` adjudica **dos tipos de rama** y cada uno tiene sus criterios (N0-58):

| Rama | Qué trae | Quién la abre | Criterios |
|---|---|---|---|
| `proposal/*` | Un cambio a la plataforma, con su archivo en `proposals/` | `sinapsis propose` | §3 y §4 |
| `subject/*` | La materia compilada en `subjects/<slug>/`, y nada más | `sinapsis publish` | §5 |

**Ningún commit de este flujo lleva trailers de coautoría** (`Co-Authored-By`,
`Claude-Session` o equivalentes), ni el que escribe el CLI, ni el de la revisión, ni el de
merge. El mensaje termina en su última línea de contenido. Si una plantilla o una instrucción
del entorno los pide, esta regla la pisa.

---

## 1. Cuándo se propone y cuándo no

| Lo que hace falta se resuelve con… | ¿Propuesta? |
|---|---|
| El `sinapsis.config.json` de la materia | **No.** Es trabajo de la materia. |
| Un bundle propio en `tools/` | **No.** |
| Cambiar el wiki o el material de estudio | **No.** |
| Un campo, un helper o un límite de `packages/contract` | **Sí.** |
| Una regla del compilador (`packages/markdown`) | **Sí.** |
| Un miembro del runtime del navegador (`packages/runtime`) | **Sí.** |
| Una bandera o un comportamiento del CLI (`packages/cli`) | **Sí.** |
| Cómo se ve o se comporta el shell, o cómo lee los datos (`apps/web`) | **Sí.** |
| Un gate del CI o el workflow de despliegue (`.github/`) | **Sí.** |
| El contenido de la propia materia (`subjects/<slug>/`) | **No.** Eso es un PR de materia (§5). |

Dos reglas más, del propio flujo:

- **Una propuesta = un cambio coherente.** Nada de «mientras estaba acá también…». Lo que
  sobra se saca antes de aprobar.
- **Nada «de paso».** No se propone algo que no estaba en el pedido del usuario.

---

## 2. Nombres exactos

Todo el flujo depende de que los nombres sean predecibles.

| Qué | Forma | Ejemplo |
|---|---|---|
| Rama | `proposal/<materia>-<AAAAMMDD>-<titulo>` | `proposal/proba-20260906-badge-en-el-rail` |
| Archivo de la propuesta | `proposals/<AAAA-MM-DD>-<materia>-<titulo>.md` | `proposals/2026-09-06-proba-badge-en-el-rail.md` |
| Índice | `proposals/INBOX.md` | — |
| Plantilla | `proposals/PLANTILLA.md` | — |

- `<materia>` es el slug normalizado del `--subject` (o `materia` si no queda nada).
- `<titulo>` es el `--title` normalizado a minúsculas con guiones y **recortado a 60
  caracteres por el guion anterior**, para que termine en una palabra entera y no en un
  muñón. Si no queda nada, `propuesta`.
- Dos propuestas abiertas a la vez no se pisan. Dos propuestas de la misma materia con el
  mismo título y el mismo día **sí**: la segunda se niega (`Ya existe la rama …`).

### Dónde vive cada archivo (decisión B4-3)

Es la fuente de casi todos los errores del flujo. La regla es una sola:

| Archivo | Dónde se edita | Por qué |
|---|---|---|
| `proposals/<fecha>-<materia>-<titulo>.md` | **En la rama** (worktree). Después de aprobar, el merge ya la trajo a `main` y se edita ahí. | La propuesta viaja con el cambio. |
| `proposals/INBOX.md` | **Siempre en `main`**, en su propio commit. | Es el índice del orquestador: se tiene que ver sin cambiar de rama, y así dos propuestas abiertas no conflictúan. |
| `docs/DECISIONS.md` | **En `main`**, después de mergear. | Registro de la plataforma, no de la propuesta. |

Una rama `proposal/*` lleva el INBOX **tal como estaba en `main` cuando nació**, sin su propia
fila. Buscarla ahí y no encontrarla es lo esperado.

---

## 3. Lado materia — `sinapsis propose`

### 3.1 Antes de ejecutar

1. **Pedirle el visto bueno al usuario.** Una propuesta crea una rama y dos commits en el
   repositorio de la plataforma: no se hace sin que lo pida o lo autorice.
2. **Comprobar que la plataforma esté lista.** El comando trabaja sobre el árbol de trabajo
   del repositorio de Sinapsis:

   ```bash
   git -C "$SINAPSIS_HOME" rev-parse --abbrev-ref HEAD   # tiene que decir main
   git -C "$SINAPSIS_HOME" status --porcelain            # solo lo que se va a proponer
   ```

   Si hay cambios de otro que no son suyos, **no se proponen**: se avisa al usuario.
3. **Implementar el cambio en el repositorio de la plataforma**, mínimo y coherente. Si toca
   `packages/contract`, el campo nuevo va **opcional y con default**, con sus tests, para que
   las materias ya publicadas sigan validando.

### 3.2 El comando

```bash
pnpm --dir "$SINAPSIS_HOME" sinapsis -- propose \
  --subject <slug> \
  --title "Qué se propone, en una línea" \
  --body "Por qué lo necesita la materia y por qué no se resuelve en su repositorio" \
  [--files packages/contract/src/index.ts,apps/web/src/…] \
  [--compat "Qué pasa con las demás materias y con lo ya publicado"] \
  [--skip-gates] \
  [--repo <dir>]
```

| Bandera | Obligatoria | Qué hace |
|---|---|---|
| `--subject <slug>` | **sí** | Materia que propone. |
| `--title <texto>` | **sí** | Qué se propone, en una línea. Da el nombre de la rama y del archivo. |
| `--body <texto>` | **sí** | El «Motivo»: por qué hace falta y por qué no se resuelve en la materia. |
| `--files <a,b>` | no | Archivos que la materia declara haber cambiado. Sin ella, se proponen **todos** los archivos modificados. |
| `--compat <texto>` | no | Texto de la sección «Compatibilidad». Sin ella queda un `COMPLETAR` con pistas según lo que se haya tocado. |
| `--skip-gates` | no | No corre `typecheck` / `test` / `build`. **Solo** para propuestas que no cambian código ejecutable. |
| `--repo <dir>` | no | Repositorio de la plataforma. Sin ella: `SINAPSIS_HOME`, y si no, la raíz del propio CLI. |

### 3.3 Qué hace el CLI, en orden

1. **Comprueba los argumentos.** Faltan `--subject`, `--title` o `--body` → sale `1`.
2. **Comprueba el repositorio**: que sea un repositorio git y que esté en **`main`**. Una
   propuesta nace de `main` y de ninguna otra rama.
3. **Compara los cambios con `--files`**:
   - un archivo modificado que `--files` no declara → sale `1` y los lista
     («Una propuesta es un cambio coherente: declare todo lo que toca o limpie el resto»);
   - un archivo declarado que no tiene cambios → sale `1`;
   - el árbol limpio → sale `1` («No hay ningún cambio que proponer»).
4. **Comprueba que la rama no exista** ya.
5. **Corre los gates ANTES de tocar git**: `pnpm typecheck`, `pnpm test`, y `pnpm build` solo
   si el cambio toca `apps/`. Son una cadena: el primero que falla corta. **Si fallan no crea
   nada**: ni rama, ni propuesta, ni fila del INBOX. Se corrige y se vuelve a ejecutar el
   mismo comando.
6. **Crea la rama** `proposal/<materia>-<AAAAMMDD>-<titulo>`.
7. **Escribe la propuesta** con la plantilla completa y **commitea** el cambio de la materia
   junto con ella (`Propuesta de <materia>: <título>` + el `--body` como cuerpo), **sin
   trailers de coautoría**.
8. **Abre el PR** si hay remoto `origin` en GitHub y `gh auth status` pasa: empuja la rama y
   corre `gh pr create --title … --body-file <propuesta>`, y estampa la URL en el frontmatter
   (`pr: <url>`) con un `--amend`. **Si no hay remoto de GitHub o `gh` no está autenticado,
   no falta nada**: el flujo local es completo.
9. **Vuelve a `main`** pase lo que pase.
10. **Si no hubo PR**, agrega la fila a la tabla «Abiertas» de `proposals/INBOX.md`, en `main`
    y en un commit propio (`proposals: <materia> — <título>`).
11. **Imprime la instrucción para el usuario**, con la rama y el archivo.

### 3.4 Qué escribe en la propuesta

````markdown
---
fecha: 2026-09-06
materia: proba
titulo: "Badge de vencidas en el rail"
rama: proposal/proba-20260906-badge-de-vencidas-en-el-rail
estado: abierta
pr: null
---

## Motivo
(el --body, literal)

## Alcance
Archivos cambiados en la rama (`git status --porcelain` al proponer):

- `packages/contract/src/index.ts` — modificado
- `apps/web/src/features/subject/Rail.tsx` — modificado

**Contrato afectado: `packages/contract`.** Si esto cambia el esquema, necesita versión del
contrato o campo opcional con default, tests, y una fila en `docs/DECISIONS.md`; si solo
documenta o prueba una decisión ya tomada, alcanza con decir cuál.

## Compatibilidad
(el --compat, o un COMPLETAR con pistas según lo que se haya tocado)

## Gates
### `pnpm typecheck` — OK
### `pnpm test` — OK

Conteos (esto es lo que el orquestador vuelve a obtener en la rama):

- `@sinapsis/contract test`: 16 passed (16)
- `@sinapsis/api test`: 128 passed (128)

Últimas líneas:

```
…
```

## Revisión
(la completa el orquestador con `/sinapsis-review`: veredicto, motivos, commit de merge)
````

Dos detalles que importan al revisar:

- La ruta absoluta del repositorio se reemplaza por `.` en la salida de los gates: la
  propuesta la lee el orquestador en otra máquina y en un worktree.
- Lo que se pega no es la salida entera: los **conteos** de las pruebas (`Tests  N passed`),
  que son lo comparable entre dos máquinas, y las **últimas 20 líneas** de cada gate.

### 3.5 Después

Cerrar con la instrucción que imprime el CLI, nombrando la rama y el archivo:

> Abra una sesión de Claude Code en `<repo de Sinapsis>` y ejecute `/sinapsis-review`.

**La materia no revisa ni mergea su propia propuesta, ni le pone el veredicto, ni toca
`proposals/INBOX.md` a mano.** Decide la plataforma.

---

## 4. Lado orquestador — propuestas (`proposal/*`)

Se invoca **dentro del repositorio de la plataforma**. Una propuesta por vez. Los PR de
materia se adjudican con otros criterios: §5.

### 4.1 Listar lo abierto

```bash
cd "$SINAPSIS_HOME"
git status --porcelain              # tiene que estar limpio para revisar
git branch --list 'proposal/*'
sed -n '1,80p' proposals/INBOX.md
gh pr list --search "head:subject/" --state open   # los PR de materia, si hay gh
```

Los PRs solo existen si el remoto es **GitHub** y `gh` está instalado y autenticado (hay que
comprobar las tres cosas: un remoto local también responde a `git remote get-url origin`).
Si no están, no falta nada: las ramas son la verdad y el merge es local.

| Fuente | Qué es |
|---|---|
| Ramas `proposal/*` | La verdad: el cambio y la propuesta viven ahí. |
| `proposals/INBOX.md` | El índice en `main`. |
| `gh pr list` | Solo con remoto en GitHub y `gh` autenticado. |

La propuesta de una rama se saca del **diff contra `main`**, no del último commit (después de
un veredicto de «cambios pedidos» la rama tiene commits nuevos):

```bash
RAMA=proposal/<materia>-<AAAAMMDD>-<titulo>
PROP=$(git diff --name-only main..."$RAMA" -- proposals/ | grep -v 'INBOX\|PLANTILLA\|README' | head -1)
git show "$RAMA:$PROP"
git diff --stat main..."$RAMA"
```

### 4.2 Revisar en un worktree

Nunca se revisa cambiando de rama en el directorio del usuario:

```bash
WT=$(mktemp -d)/rev
git worktree add "$WT" "$RAMA"
cd "$WT" && pnpm install --frozen-lockfile
```

y al terminar, siempre `git worktree remove --force "$WT"`.

### 4.3 Los gates, otra vez

```bash
cd "$WT"
pnpm typecheck
pnpm test
pnpm build            # solo si el diff toca apps/**
pnpm e2e              # solo si toca apps/web/** y hay navegador disponible
```

Se comparan **los veredictos y los conteos** con la sección «Gates» de la propuesta, no el
texto literal: los tiempos, el orden de los paquetes y las advertencias cambian en cada
corrida. Es motivo de cambios pedidos que un gate pase en la propuesta y falle acá, o que los
conteos bajen sin que la propuesta lo explique. Los gates que no corresponden se anotan como
«no corresponde», no como OK.

Si la propuesta dice «Omitidos con `--skip-gates`», hay que comprobar que de verdad no cambie
código ejecutable; si lo cambia, ya es motivo de cambios pedidos.

### 4.4 Las siete lentes

`git diff main..."$RAMA"`, y el cambio pasa por estas lentes **en este orden**, anotando cada
hallazgo con archivo y línea:

| # | Lente | Qué se busca |
|---|---|---|
| 1 | **Corrección** | ¿Hace lo que dice la propuesta? ¿Los casos borde (vacío, uno, muchos, nulo, un `fetch` que falla) están cubiertos? ¿Los tests nuevos fallarían sin el cambio? |
| 2 | **Seguridad** | ¿Entra dato de una materia (que es un repositorio ajeno) sin validar? ¿Alguna ruta admite `..`, rutas absolutas o `javascript:`? ¿Se agrega HTML sin escapar? ¿Se afloja una validación de esquema o una contención de rutas? |
| 3 | **Contratos** | Si toca `packages/contract`: ¿el campo es opcional y con default? ¿Los `sinapsis.config.json` y las materias ya publicadas en `subjects/` siguen validando? ¿Hay tests del contrato? ¿Hace falta una fila en `docs/DECISIONS.md`? |
| 4 | **Compatibilidad entre materias** | ¿Le sirve a más de una materia, o es una necesidad de una sola disfrazada de contrato? ¿Rompe a las que no la usan? ¿Qué pasa con los datos que ya están en la base? |
| 5 | **Alcance** | ¿Es un cambio coherente, o hay un «mientras estaba acá también…»? |
| 6 | **Duplicación** | ¿Ya existe ese helper? La plataforma tiene **una sola** implementación de cada regla (slugs, colores, divisiones, ids). |
| 7 | **Idioma y forma** | Español neutro en el código visible, los mensajes y la propuesta. Comentarios que expliquen el porqué. |

**Adversarial**: se busca el caso en que el cambio falla, no la confirmación de que anda. Si
no se encuentra ninguno, se dice explícitamente en el veredicto y se nombra qué se buscó.

### 4.5 Decidir

#### Aprobar

```bash
cd "$SINAPSIS_HOME"
git worktree remove --force "$WT"
git checkout main
git merge --no-ff "$RAMA" -m "Propuesta de <materia>: <título> (aprobada)"
git rev-parse --short HEAD
```

El merge trae la propuesta a `main`. Después, **en `main`**:

1. **La propuesta**: `estado: aprobada` y la sección «Revisión» completa.
2. **El INBOX**: la fila sale de «Abiertas» y pasa a «Cerradas» con el veredicto y el commit
   de merge.
3. **`docs/DECISIONS.md`**: una fila `N0-nn` **solo si el cambio decide algo nuevo** (un
   esquema, un campo, una regla de arquitectura), con el porqué y el costo de revertir. Un
   cambio que solo documenta o prueba una decisión que ya existe **no** abre una fila nueva:
   si acaso amplía la que ya está, y el veredicto dice cuál.
4. **Gates en `main`** una última vez: un merge limpio puede romper igual.
5. Commit: `Revisión de la propuesta de <materia>: <título>`.

El merge es `--no-ff` **siempre**: el commit de merge es el registro del veredicto.

#### Pedir cambios

No se mergea. Los motivos van en «Revisión» **en la rama**, con archivo y línea, y con qué
hace falta para que se apruebe. `estado: cambios-pedidos` en la propuesta y en el INBOX. La
rama queda y **la fila sigue en «Abiertas»**: sigue siendo trabajo pendiente, solo que ahora
la pelota la tiene la materia.

El INBOX se edita aparte, en `main`: la rama no tiene la fila de su propia propuesta.

#### Rechazar

Igual, con `estado: rechazada` y los motivos escritos: por qué no es un problema de la
plataforma, o cómo se resuelve dentro de la materia. La fila pasa a «Cerradas».

La rama se conserva **30 días** y es el **único lugar** donde vive el texto de una propuesta
rechazada: nunca llega a `main`. Por eso la fila de «Cerradas» tiene que bastarse sola
(fecha, materia, título, rama, veredicto).

### 4.6 Aplicar en las materias

Si el cambio afecta el contrato, el veredicto anota qué tiene que hacer cada materia. Casi
siempre alcanza con que su agente corra `sinapsis publish`, que abre el PR con la
materia recompilada. Si hace falta editar el
`sinapsis.config.json` o el material de estudio, se escribe como una instrucción concreta: la
ejecuta el agente de la materia con `/sinapsis`, no el orquestador.

---

## 5. Lado orquestador — PR de materia (`subject/*`)

Un PR de materia no propone nada: **trae contenido**. No lleva archivo en `proposals/`, no
tiene fila en el INBOX y no abre decisiones N0. Lo que se revisa es otra cosa.

### 5.1 Listarlos

```bash
cd "$SINAPSIS_HOME"
gh pr list --search "head:subject/" --state open
gh pr view <n> --json title,headRefName,files,statusCheckRollup
```

Sin `gh` (o sin remoto en GitHub), las ramas locales `subject/*` son la verdad:
`git branch --list 'subject/*'` y `git diff --stat main...<rama>`.

### 5.2 Los gates

Basta con que **el CI del PR esté verde**: `ci.yml` ya corre `pnpm typecheck`, `pnpm test`,
`pnpm build:subjects` y el build de la web, más el job `subject-pr` que comprueba el alcance
del diff. Si no hay CI (rama local, `gh` ausente), se corren a mano en un worktree:

```bash
WT=$(mktemp -d)/rev
git worktree add "$WT" "$RAMA"
cd "$WT" && pnpm install --frozen-lockfile
pnpm build:subjects --only <slug>
pnpm typecheck
pnpm test
cd "$SINAPSIS_HOME" && git worktree remove --force "$WT"
```

### 5.3 Los criterios

| # | Criterio | Cómo se comprueba |
|---|---|---|
| 1 | **CI verde** | `statusCheckRollup` del PR, o los gates en el worktree. |
| 2 | **`site build` sin errores** | `pnpm build:subjects --only <slug>` sale `0`. |
| 3 | **Advertencias razonadas** | El cuerpo del PR las lista; cada una tiene un motivo escrito. No hace falta que sean cero, sí que estén explicadas. |
| 4 | **Solo `subjects/<slug>/`** | `git diff --name-only main...<rama>`: nada fuera de esa carpeta, con el slug del nombre de la rama. |
| 5 | **Contenido revisado por muestreo** | El `sinapsis.config.json`, un par de páginas (frontmatter y cuerpo), el material de estudio y los manifiestos de los bundles. |
| 6 | **Sin coautoría** | `git log --format=%B main...<rama>` no muestra `Co-Authored-By` ni `Claude-Session`. |

El muestreo del criterio 5 busca lo que el CI no ve: divisiones o tipos que no coinciden con
el config, resúmenes vacíos, wikilinks a páginas que no vinieron, ids de tarjeta que
cambiaron sin `{#id}` (borra progreso de repaso, principio 7), bundles con scripts que el
manifiesto no declara, y texto que no sea español neutro.

### 5.4 Decidir

**Aprobar** — merge **sin *squash***, para conservar el historial de la materia:

```bash
gh pr merge <n> --merge          # sin --body: el commit de merge no lleva nada extra
```

Sin `gh`: `git checkout main && git merge --no-ff "$RAMA" -m "Materia <slug>: <name>"`.
En los dos casos, **el mensaje del merge no lleva trailers de coautoría**.

Después del merge, `pages.yml` construye y despliega solo:

```bash
gh run list --workflow pages.yml --limit 3
```

y se verifica que la corrida termine en éxito y que la materia se vea en
<https://sebascaules.github.io/Sinapsis/>. Un deploy fallido es del orquestador, no de la
materia.

**Pedir cambios** — `gh pr review <n> --request-changes --body "…"` (o un comentario en el
PR), con los motivos concretos: qué archivo, qué está mal y qué hace falta. La pelota vuelve
al agente de la materia, que corrige en su vault y vuelve a publicar.

No hay estado `rechazada` para un PR de materia: o entra, o vuelve corregido.

---

## 6. Estados

| Estado | Dónde está la propuesta | Fila del INBOX | Quién tiene la pelota |
|---|---|---|---|
| `abierta` | En su rama | «Abiertas» | El orquestador. |
| `cambios-pedidos` | En su rama, con «Revisión» escrita | «Abiertas» | **La materia**: corrige y vuelve a pedir revisión. |
| `aprobada` | En `main`, mergeada con `--no-ff` | «Cerradas», con el commit | Nadie: cerrada. Las materias vuelven a publicar si hace falta. |
| `rechazada` | Solo en su rama (30 días) | «Cerradas» | Nadie: cerrada. |

Un PR de materia no tiene estos estados: está abierto, mergeado o con cambios pedidos, y eso
lo dice el propio PR.

---

## 7. Los gates

| Gate | Cuándo corre | Quién |
|---|---|---|
| `pnpm typecheck` | Siempre (salvo `--skip-gates`) | CLI al proponer, y el orquestador en la rama |
| `pnpm test` | Siempre (salvo `--skip-gates`) | Ídem |
| `pnpm build` | Solo si el cambio toca `apps/` | Ídem |
| `pnpm e2e` | Solo si toca `apps/web/**` y hay navegador | **Solo el orquestador** |
| Gates en `main` después del merge | Al aprobar | El orquestador |
| `pnpm build:subjects` (o `--only <slug>`) | Siempre en un PR de materia | CI del PR, o el orquestador en el worktree |
| Regla de alcance (`subject-pr`) | Siempre en un PR de materia | CI del PR |

`--skip-gates` es solo para propuestas que no cambian código ejecutable (documentación), y el
orquestador lo comprueba. En un PR de materia no existe: el CI corre igual.

---

## 8. Reglas del flujo, en una lista

- Una propuesta = un cambio coherente.
- Un PR de materia = una materia, y **solo** `subjects/<slug>/`.
- La rama nace de `main` y no toca `main`, salvo la fila del INBOX.
- **Sin revisión no hay merge**, ni siquiera del propio orquestador en autopilot: cada merge
  queda con su veredicto.
- Los gates deben pasar en la rama antes de pedir revisión.
- Cambios de **esquema** en `packages/contract`: versión del contrato o campo opcional con
  default, tests, y una fila en `docs/DECISIONS.md`.
- Español neutro en la propuesta, en el PR y en el código visible.
- **Ningún commit lleva trailers de coautoría**, en ninguna de las dos ramas ni en el merge.
- El INBOX vive en `main` y solo ahí.
- Nadie adjudica su propia propuesta ni mergea su propio PR de materia.

---

## 9. Errores típicos

| Síntoma | Causa | Arreglo |
|---|---|---|
| `El repositorio está en "x" y una propuesta nace de "main"` | Quedó una rama de una propuesta anterior con el checkout puesto. | `git -C "$SINAPSIS_HOME" checkout main`. |
| `El árbol tiene N cambio(s) que --files no declara` | Hay trabajo ajeno en el árbol, o falta declarar un archivo. | Declarar todo lo que se toca, o limpiar el resto. |
| `--files nombra archivos sin cambios` | Se declaró un archivo que no se llegó a tocar. | Sacarlo de `--files`. |
| `No hay ningún cambio que proponer` | Se ejecutó `propose` antes de implementar el cambio. | Implementar primero. |
| `Ya existe la rama proposal/…` | Misma materia, mismo título, mismo día. | Revisar esa propuesta, o borrar la rama y repetir. |
| `Los gates no pasan: no se creó la rama ni la propuesta` | Un gate falló. | Corregir y volver a ejecutar **el mismo comando**. |
| `ERR_PNPM_RECURSIVE_RUN_FIRST_FAIL` / `ELIFECYCLE` en la salida | Es el eco de pnpm por el código de salida `1`. | El motivo real está en la **primera** línea roja. |
| «No encuentro la fila del INBOX en la rama» | El INBOX vive **solo en `main`** (B4-3). | Es lo esperado. |
| La propuesta quedó local, sin PR | No hay remoto en GitHub, o `gh` no está autenticado. | No falta nada: el flujo local es completo. |
| Al pedir cambios, el INBOX quedó desactualizado | Se editó el INBOX en el worktree de la rama. | El INBOX se edita en `main`, aparte. |
| Se aprobó y `main` no compila | El merge fue limpio pero el resultado no. | Correr los gates en `main` **después** del merge, siempre. |
| El CI del PR de materia falla en `subject-pr` | El diff toca algo fuera de `subjects/<slug>/`. | Sacar ese cambio del PR; si es de la plataforma, va por una propuesta. |
| Se mergeó un PR de materia y el sitio no cambió | El deploy de Pages falló, o la fuente de Pages no es «GitHub Actions». | `gh run list --workflow pages.yml` y *Settings → Pages*. |
| El commit de merge lleva `Co-Authored-By` | Se pasó un cuerpo a `gh pr merge` o se usó una plantilla del entorno. | Mergear sin cuerpo adicional; la regla de no coautoría pisa cualquier plantilla. |

---

## Fuente ejecutable

- `docs/PROPOSALS.md` — el contrato del flujo, en prosa corta.
- `proposals/PLANTILLA.md` — el formato de una propuesta.
- `proposals/INBOX.md` — el índice: «Abiertas» arriba, «Cerradas» abajo.
- `proposals/README.md` — qué es cada archivo de la carpeta.
- `packages/cli/src/commands/propose.ts` — `runPropose`, `renderProposal`, `runGates`,
  `openPullRequest`, `noteInInbox`, `insertInboxRow`, `gateCounts`, `shorten`.
- `packages/cli/src/commands/publish.ts` — la rama `subject/*`, el commit y el PR de materia.
- `packages/cli/src/git.ts` — `changedFiles`, `git`, `gitLine`, `runCommand`.
- `.github/workflows/ci.yml` — los gates de cada PR y el job `subject-pr`.
- `.github/workflows/pages.yml` — el despliegue posterior al merge.
- `skills/sinapsis/SKILL.md` — «Proponer un cambio a la plataforma» (lado materia).
- `skills/sinapsis-review/SKILL.md` — la revisión completa (lado orquestador).

## Decisiones relacionadas

N0-44 (el flujo de propuestas) · N0-45 (contratos consolidados) ·
N0-57 (materias como fuente en `subjects/`) · N0-58 (integración de materias por PR, sin
coautoría) · B4-3 (el INBOX vive solo en `main`, en su propio commit) · Q5-1 (la fila va al
final de la tabla de abiertas, no del archivo).
