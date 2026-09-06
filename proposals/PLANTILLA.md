---
fecha: AAAA-MM-DD
materia: <slug>
titulo: "<qué se propone>"
rama: proposal/<materia>-<AAAAMMDD>-<titulo>
estado: abierta
pr: null
---

<!--
La escribe `sinapsis propose`, no se copia a mano. Nombres exactos, para poder buscarlos:

  rama:    proposal/<materia>-<AAAAMMDD>-<titulo>     p. ej. proposal/proba-20260906-badge-en-el-rail
  archivo: proposals/<AAAA-MM-DD>-<materia>-<titulo>.md

`<titulo>` es el título en minúsculas y con guiones, recortado a 60 caracteres por el guion
anterior (nunca a mitad de palabra).
-->

## Motivo

Qué necesita la materia y por qué no se resuelve dentro de su repositorio.

## Alcance

Archivos tocados y qué cambia en cada uno. Contratos afectados.

## Compatibilidad

Qué pasa con las demás materias ya publicadas en `subjects/` y con el estado personal que
la gente ya tiene guardado en su navegador.

## Gates

Los conteos de `typecheck` / `test` / `build` / `e2e` en la rama, y las últimas líneas de
cada uno. El orquestador vuelve a correrlos y compara los conteos, no el texto literal.

## Revisión

(la completa el orquestador con `/sinapsis-review`)

**Veredicto:** aprobada · cambios-pedidos · rechazada
**Revisó:** orquestador de la plataforma · <fecha>
**Commit de merge:** `<sha>` (o «no corresponde»)

### Gates en la rama

### Hallazgos

### Efecto en las materias
