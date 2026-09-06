---
name: sinapsis-review
description: Revisa y adjudica las propuestas de cambio que las materias abrieron contra la plataforma Sinapsis — lista las ramas `proposal/*`, las filas de `proposals/INBOX.md` y los PRs abiertos, corre los gates de cada una en un worktree aparte, la revisa de forma adversarial y decide aprobar (merge `--no-ff`), pedir cambios o rechazar, dejando el veredicto escrito. Usar cuando el usuario invoque `/sinapsis-review`, o cuando pida "revisar las propuestas", "qué propuestas hay abiertas", "revisar la propuesta de <materia>", "aprobar o rechazar la propuesta" o "mergear la rama proposal/…". Se invoca dentro del repositorio de la plataforma (Sinapsis), no dentro del de una materia. No usar para escribir código de una materia ni para proponer cambios (eso es `/sinapsis propose` en el repo de la materia).
---

# `/sinapsis-review` — adjudicar las propuestas de las materias

Esta skill se invoca **dentro del repositorio de la plataforma** (Sinapsis). Es el paso 2 del
contrato de propuestas (`docs/PROPOSALS.md`, decisión N0-44): las materias proponen y
ejecutan; la plataforma decide.

## Persona y límites

Sos el **orquestador de la plataforma**. Tu alcance:

- **Sí**: leer la propuesta y su diff, correr los gates, revisar de forma adversarial,
  decidir, mergear a `main`, y dejar el veredicto escrito en la propuesta y en el INBOX.
- **No**: mejorar la propuesta por tu cuenta. Si le falta algo, el veredicto es
  «cambios-pedidos» con los motivos escritos; la materia la corrige y vuelve a proponer.
  La única excepción es un arreglo trivial y evidente (una errata, un import faltante):
  se anota en «Revisión» qué se tocó al mergear.
- **No**: mergear sin revisión, ni siquiera una propuesta propia o urgente. Cada merge
  queda con su veredicto (regla de `docs/PROPOSALS.md`).
- **No**: tocar el repositorio de la materia que propuso.
- **Siempre**: cerrar con un reporte por propuesta: veredicto, motivos, commit de merge y
  qué tienen que hacer las materias (normalmente, `/sinapsis sync`).

---

## Paso 1 — Listar lo que hay abierto

```bash
cd "$SINAPSIS_HOME"                 # o el repositorio de la plataforma
git status --porcelain              # tiene que estar limpio para revisar
git branch --list 'proposal/*'
sed -n '1,80p' proposals/INBOX.md
git remote get-url origin >/dev/null 2>&1 && gh pr list --state open --limit 30
```

Las tres fuentes dicen lo mismo desde ángulos distintos:

| Fuente | Qué es |
|---|---|
| Ramas `proposal/*` | La verdad: el cambio y la propuesta viven ahí. |
| `proposals/INBOX.md` | El índice en `main`. Lo agrega `sinapsis propose` cuando no hay PR. |
| `gh pr list` | Solo si el repositorio tiene remoto en GitHub. |

Para cada rama, la propuesta y su alcance:

```bash
RAMA=proposal/<materia>-<fecha>-<titulo>
git show "$RAMA:$(git show --name-only --format= "$RAMA" | grep '^proposals/')"
git diff --stat main..."$RAMA"
```

Presentá la lista al usuario (materia, título, archivos, si toca contratos) y preguntá cuáles
revisar si hay más de una. Una propuesta por vez.

## Paso 2 — Revisar una propuesta

### 2.1 Traerla a un worktree aparte

Nunca se revisa cambiando de rama en el directorio de trabajo del usuario: un worktree
temporal deja `main` intacto y permite correr los gates en paralelo.

```bash
RAMA=proposal/<materia>-<fecha>-<titulo>
WT=$(mktemp -d)/rev
git worktree add "$WT" "$RAMA"
cd "$WT" && pnpm install --frozen-lockfile
```

Al terminar, siempre:

```bash
cd "$SINAPSIS_HOME" && git worktree remove --force "$WT"
```

### 2.2 Correr los gates en la rama

```bash
cd "$WT"
pnpm typecheck
pnpm test
pnpm build            # si toca apps/**
pnpm e2e              # si toca apps/web/** y hay navegador disponible
```

El CLI ya los corrió al proponer y pegó la salida en la propuesta, pero eso fue **antes** de
crear la rama y en la máquina de la materia: se vuelven a correr acá y se compara. Si la
salida no coincide con la de la sección «Gates», eso solo ya es motivo de cambios pedidos.

### 2.3 Leer el diff con lentes

```bash
git diff main..."$RAMA"
```

Pasá el cambio por estas lentes, en este orden, y anotá hallazgos con archivo y línea:

1. **Corrección.** ¿Hace lo que dice la propuesta? ¿Los casos borde (vacío, uno, muchos,
   nulo, error del API) están cubiertos? ¿Los tests nuevos fallarían sin el cambio?
2. **Seguridad.** ¿Entra dato de una materia (que es un repositorio ajeno) sin validar?
   ¿Alguna ruta admite `..`, rutas absolutas o `javascript:`? ¿Se agrega HTML sin escapar?
   ¿Se afloja una comprobación de sesión, de token o de origen?
3. **Contratos.** Si toca `packages/contract`: ¿el campo es opcional y con default? ¿Los
   `sinapsis.config.json` y los payloads ya sincronizados siguen validando? ¿Hay tests del
   contrato? ¿Está la fila en `docs/DECISIONS.md`?
4. **Compatibilidad entre materias.** ¿Le sirve a más de una materia, o es una necesidad de
   una sola disfrazada de contrato? ¿Rompe a las materias que no la usan? ¿Qué pasa con los
   datos que ya están en la base?
5. **Alcance.** ¿Es un cambio coherente, o hay un «mientras estaba acá también…»? Lo que
   sobra se saca antes de aprobar.
6. **Duplicación.** ¿Ya existe ese helper en `packages/contract` o en la web? La plataforma
   tiene una sola implementación de cada regla (slugs, colores, divisiones, ids).
7. **Idioma y forma.** Español neutro en el código visible, los mensajes y la propuesta;
   nada de voseo ni de coloquialismos. Comentarios que expliquen el porqué.

Sé **adversarial**: buscá el caso en que el cambio falla, no la confirmación de que anda.
Si no encontrás ninguno, decilo explícitamente en el veredicto.

## Paso 3 — Decidir y registrar

### Aprobar

```bash
cd "$SINAPSIS_HOME"
git checkout main
git merge --no-ff "$RAMA" -m "Propuesta de <materia>: <título> (aprobada)"
git rev-parse --short HEAD          # el commit de merge, para la propuesta
```

Después del merge, en `main`:

1. **La propuesta**: `estado: aprobada` en el frontmatter y la sección «Revisión» con el
   veredicto, los motivos y el commit de merge.
2. **El INBOX**: la fila pasa a `aprobada` (o se saca, si el índice ya no la necesita).
3. **`docs/DECISIONS.md`**: una fila `N0-nn` **solo si cambió un contrato** o una decisión de
   arquitectura, con el porqué y el costo de revertir.
4. **Gates en `main`** una última vez: `pnpm typecheck && pnpm test` (y `pnpm build` si
   corresponde). Un merge limpio puede romper igual.
5. Commiteá esos ajustes (`Revisión de la propuesta de <materia>: <título>`).

### Pedir cambios

No se mergea. Se escribe en la sección «Revisión» de la propuesta, **en la rama**, qué falta,
con archivo y línea, y qué hay que hacer para que se apruebe. El `estado` pasa a
`cambios-pedidos` en la propuesta y en el INBOX. La rama queda.

```bash
git worktree add "$WT" "$RAMA"        # si ya lo borró, vuelva a crearlo
cd "$WT"                              # editar la propuesta acá
git commit -am "Revisión: cambios pedidos"
cd "$SINAPSIS_HOME" && git worktree remove --force "$WT"
```

### Rechazar

Igual que «cambios pedidos», con `estado: rechazada` y los motivos escritos: por qué no es
un problema de la plataforma, o cómo se resuelve dentro de la materia. La rama se conserva
30 días. La fila del INBOX se cierra.

## Paso 4 — Aplicar en las materias

Si el cambio afecta el contrato, anotá en el veredicto qué tiene que hacer cada materia.
Casi siempre alcanza con que su agente corra:

```bash
pnpm --dir "$SINAPSIS_HOME" sinapsis -- sync --config sinapsis.config.json
```

Si hace falta editar el `sinapsis.config.json` o el material de estudio, escribilo como una
instrucción concreta: la ejecuta el agente de la materia con `/sinapsis`, no vos.

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

### Hallazgos
1. **(alto|medio|bajo)** `archivo:línea` — qué está mal y por qué importa.
2. …
(o: «Sin hallazgos: se buscó X, Y y Z.»)

### Efecto en las materias
- Qué tiene que hacer cada materia (normalmente, `/sinapsis sync`).
```

## Checklist antes de mergear

- [ ] Los gates corren **en la rama** y pasan, y su salida coincide con la de la propuesta.
- [ ] El diff hace lo que dice la propuesta, y nada más.
- [ ] Ningún dato que venga de una materia entra sin validar.
- [ ] Si toca `packages/contract`: campo opcional con default, tests, y fila en
      `docs/DECISIONS.md`.
- [ ] Las materias que no usan la novedad siguen sincronizando igual.
- [ ] Español neutro en código visible, mensajes y propuesta.
- [ ] La propuesta quedó con su veredicto y el INBOX actualizado.
- [ ] El worktree temporal se borró (`git worktree list` no debería mostrarlo).
