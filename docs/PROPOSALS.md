# Propuestas de cambio a la plataforma (contrato N0-44)

Cuando una materia necesita algo **común** (un `kind` nuevo del rail, un campo del contrato, un
helper del runtime, un comportamiento del lector), su agente no lo parchea en su repo: lo
**propone, lo implementa en una rama de Sinapsis y pide revisión**. La plataforma decide.

## Flujo

1. **Proponer** (agente de materia, desde su repo o desde el de Sinapsis):
   ```bash
   pnpm --dir "$SINAPSIS_HOME" sinapsis -- propose --subject <slug> --title "<qué>" --body "<por qué>" [--files a,b]
   ```
   El CLI: crea la rama `proposal/<slug>-<fecha>-<titulo-slug>` desde `main` (falla si el
   árbol de `main` está sucio), escribe `proposals/<fecha>-<slug>-<titulo>.md` con la plantilla
   de abajo, commitea lo que el agente ya cambió más la propuesta, y:
   - si existe remoto `origin` en GitHub y `gh` está autenticado → `gh pr create` con el cuerpo de la propuesta;
   - si no → deja la rama local y agrega una línea a `proposals/INBOX.md`.
   Termina imprimiendo la instrucción para el usuario: «abra una sesión en el repo de Sinapsis y ejecute `/sinapsis-review`».
2. **Revisar** (orquestador, sesión en el repo de Sinapsis, skill `/sinapsis-review`):
   lista las propuestas abiertas (ramas `proposal/*`, INBOX, PRs), y por cada una: lee la
   propuesta y el diff, corre los gates en la rama (`typecheck`, `test`, `build`, `e2e` si toca
   web), revisa de forma adversarial (corrección, seguridad, compatibilidad con los contratos y
   con las demás materias, español neutro), y **decide**:
   - **Aprobar**: `git merge --no-ff proposal/…` en `main` (o merge del PR), actualiza
     `docs/DECISIONS.md` si cambió un contrato, marca la propuesta como `aprobada` con el commit.
   - **Pedir cambios**: escribe los motivos en la sección «Revisión» de la propuesta y deja la rama.
   - **Rechazar**: motivos en la propuesta, rama conservada 30 días, entrada en INBOX cerrada.
3. **Aplicar en las materias**: si el cambio afecta el contrato, la revisión anota qué debe
   actualizar cada materia (`/sinapsis sync` suele bastar).

## Reglas

- Una propuesta = un cambio coherente. Nada de «mientras estaba acá también…».
- La rama nace de `main` y no toca `main`. Sin revisión no hay merge, ni siquiera del propio orquestador en autopilot: el merge queda registrado con su veredicto.
- Los gates deben pasar en la rama antes de pedir revisión; el CLI los corre (`--skip-gates` solo para documentación).
- Cambios de contrato (`packages/contract`) requieren: versión del contrato o campo opcional con default, tests, y una fila en `docs/DECISIONS.md`.
- Español neutro en la propuesta y en el código visible.

## Plantilla (`proposals/PLANTILLA.md`)

```markdown
---
fecha: AAAA-MM-DD
materia: <slug>
titulo: "<qué se propone>"
rama: proposal/<slug>-<fecha>-<titulo>
estado: abierta | aprobada | cambios-pedidos | rechazada
pr: <url o null>
---

## Motivo
Qué necesita la materia y por qué no se resuelve dentro de su repo.

## Alcance
Archivos tocados y qué cambia en cada uno. Contratos afectados.

## Compatibilidad
Qué pasa con las demás materias y con los datos ya sincronizados.

## Gates
Salida literal de typecheck / test / build / e2e en la rama.

## Revisión
(la completa el orquestador) Veredicto, motivos, commit de merge.
```
