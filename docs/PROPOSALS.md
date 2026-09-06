# Propuestas de cambio a la plataforma (contrato N0-44)

Cuando una materia necesita algo **común** (un `kind` nuevo del rail, un campo del contrato, un
helper del runtime, un comportamiento del lector), su agente no lo parchea en su repo: lo
**propone, lo implementa en una rama de Sinapsis y pide revisión**. La plataforma decide.

## Flujo

1. **Proponer** (agente de materia, desde su repo o desde el de Sinapsis):
   ```bash
   pnpm --dir "$SINAPSIS_HOME" sinapsis -- propose \
     --subject <slug> --title "<qué>" --body "<por qué>" \
     [--files a,b] [--compat "<qué pasa con las demás materias>"] [--skip-gates]
   ```
   El CLI, en este orden:
   1. comprueba que el repositorio de la plataforma esté en `main` y que lo único modificado
      sea lo que `--files` declara (si se pasa);
   2. corre los gates **antes de tocar git** (`pnpm typecheck`, `pnpm test`, y `pnpm build`
      si el cambio toca `apps/`). Si alguno falla, **no crea nada**: ni rama, ni propuesta,
      ni fila del INBOX;
   3. crea la rama `proposal/<materia>-<AAAAMMDD>-<titulo>` desde `main`;
   4. escribe `proposals/<AAAA-MM-DD>-<materia>-<titulo>.md` con la plantilla completa y
      commitea ahí el cambio de la materia junto con la propuesta;
   5. si existe remoto `origin` en GitHub y `gh` está autenticado → `gh pr create` con el
      cuerpo de la propuesta; si no → deja la rama local y agrega una fila a la tabla
      «Abiertas» de `proposals/INBOX.md`, **en `main` y en su propio commit** (B4-3);
   6. vuelve a `main` e imprime la instrucción para el usuario: «abra una sesión en el repo
      de Sinapsis y ejecute `/sinapsis-review`», con el nombre de la rama a revisar.

   `<titulo>` es el título en minúsculas y con guiones, recortado a 60 caracteres por el
   guion anterior. Si la rama ya existe, el comando se niega en vez de pisarla.

2. **Revisar** (orquestador, sesión en el repo de Sinapsis, skill `/sinapsis-review`):
   lista las propuestas abiertas (ramas `proposal/*`, INBOX, PRs), y por cada una: lee la
   propuesta y el diff, corre los gates en un worktree de la rama (`typecheck`, `test`,
   `build`, `e2e` si toca web), revisa de forma adversarial (corrección, seguridad,
   compatibilidad con los contratos y con las demás materias, español neutro), y **decide**:
   - **Aprobar**: `git merge --no-ff proposal/…` en `main` (o merge del PR), marca la
     propuesta como `aprobada` con el commit de merge, pasa la fila del INBOX a «Cerradas» y
     agrega una fila a `docs/DECISIONS.md` si el cambio decide algo nuevo.
   - **Pedir cambios**: motivos en la sección «Revisión» de la propuesta, en la rama; la
     rama queda y la fila sigue en «Abiertas» con estado `cambios-pedidos`.
   - **Rechazar**: motivos en la propuesta, rama conservada 30 días, fila en «Cerradas».
3. **Aplicar en las materias**: si el cambio afecta el contrato, la revisión anota qué debe
   actualizar cada materia (`/sinapsis sync` suele bastar).

## Reglas

- Una propuesta = un cambio coherente. Nada de «mientras estaba acá también…».
- La rama nace de `main` y no toca `main`, salvo la fila del INBOX. Sin revisión no hay
  merge, ni siquiera del propio orquestador en autopilot: el merge queda con su veredicto.
- Los gates deben pasar en la rama antes de pedir revisión; el CLI los corre. `--skip-gates`
  es solo para propuestas que no cambian código ejecutable.
- Cambios de **esquema** en `packages/contract` requieren: versión del contrato o campo
  opcional con default, tests, y una fila en `docs/DECISIONS.md`. Un cambio a
  `packages/contract` que solo documenta o prueba una decisión que ya está tomada no abre
  una fila nueva: amplía la que ya existe, y el veredicto dice cuál.
- Español neutro en la propuesta y en el código visible.
- El INBOX vive en `main` y solo ahí. Una rama `proposal/*` lleva el INBOX como estaba
  cuando nació, sin su propia fila: es lo esperado, y es lo que evita que dos propuestas
  abiertas a la vez conflictúen.

## Qué es qué

| Archivo | Dónde vive | Quién lo escribe |
|---|---|---|
| `proposals/<fecha>-<materia>-<titulo>.md` | En la rama; llega a `main` si se aprueba | `sinapsis propose`; la sección «Revisión», el orquestador |
| `proposals/INBOX.md` | Siempre en `main` | `sinapsis propose` (fila abierta) y `/sinapsis-review` (la cierra) |
| `docs/DECISIONS.md` | `main` | El orquestador, al aprobar |

La plantilla completa está en `proposals/PLANTILLA.md`.
