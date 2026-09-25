---
fecha: 2026-09-25
materia: derecho
titulo: "Referencia de herramientas: App.DATA usa el nombre del archivo sin extensión"
rama: proposal/derecho-20260925-referencia-de-herramientas-app-data-usa-el-nombre-del
estado: abierta
pr: null
---

## Motivo

La referencia de la skill (skills/sinapsis/reference/herramientas.md, línea 48) decía que un archivo declarado en data queda en App.DATA["data/datos.json"]. El runtime lo guarda con dataKey() de packages/runtime/src/loader.ts: nombre sin carpeta ni extensión (App.DATA["datos"]), como ya dice el contrato canónico docs/contracts/04-herramientas-y-figuras.md (líneas 53, 266 y 745). Al portar las herramientas de la materia derecho siguiendo la skill, las tres vistas leían App.DATA["data/kit.json"] y se dibujaban vacías; se detectó recién en la vista previa local. El arreglo alinea la referencia con el runtime y con el contrato, y agrega una línea explícita en la sección de datos para que el agente de materia no vuelva a caer en el error.

## Alcance

Archivos cambiados en la rama (`git status --porcelain` al proponer):

- `skills/sinapsis/reference/herramientas.md` — modificado

Contratos afectados: ninguno (`packages/contract` no se toca).

## Compatibilidad

Solo documentación: no cambia el contrato, el runtime ni ninguna materia publicada. Los bundles que ya leen App.DATA por nombre sin extensión siguen igual.

## Gates

Omitidos con `--skip-gates`: la propuesta no cambia código ejecutable.

## Revisión

(la completa el orquestador con `/sinapsis-review`: veredicto, motivos, commit de merge)
