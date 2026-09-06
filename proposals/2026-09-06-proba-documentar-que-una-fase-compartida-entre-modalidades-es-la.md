---
fecha: 2026-09-06
materia: proba
titulo: "Documentar que una fase compartida entre modalidades es la misma fase"
rama: proposal/proba-20260906-documentar-que-una-fase-compartida-entre-modalidades-es-la
estado: abierta
pr: null
---

## Motivo

El plan de Proba tiene cursada y final directo, y las dos comparten las fases de la cursada. El tipo Plan.tracks no decía si repetir el id de una fase es válido ni qué pasa con sus ids de tarea, y la materia no podía saberlo sin leer el compilador.

## Alcance

Archivos cambiados en la rama (`git status --porcelain` al proponer):

- `packages/contract/src/index.ts` — modificado
- `packages/contract/src/study.test.ts` — modificado

**Contrato afectado: `packages/contract`.** Si esto cambia el esquema, necesita versión del contrato o campo opcional con default, tests, y una fila en `docs/DECISIONS.md`; si solo documenta o prueba una decisión ya tomada, alcanza con decir cuál (regla de `docs/PROPOSALS.md`).

## Compatibilidad

Solo cambia un comentario JSDoc y agrega pruebas: ningún esquema, ningún campo nuevo. Las materias ya sincronizadas siguen validando igual.

## Gates

### `pnpm typecheck` — OK

Últimas líneas:

```

> sinapsis@0.1.0 typecheck .
> pnpm -r run typecheck

Scope: 6 of 7 workspace projects
packages/contract typecheck$ tsc --noEmit -p tsconfig.json
packages/contract typecheck: Done
apps/api typecheck$ tsc --noEmit -p tsconfig.json
packages/runtime typecheck$ tsc --noEmit -p tsconfig.json
packages/markdown typecheck$ tsc --noEmit -p tsconfig.json
packages/markdown typecheck: Done
packages/runtime typecheck: Done
apps/api typecheck: Done
packages/cli typecheck$ tsc --noEmit -p tsconfig.json
apps/web typecheck$ tsc --noEmit -p tsconfig.json
packages/cli typecheck: Done
apps/web typecheck: Done
```

### `pnpm test` — OK

Conteos (esto es lo que el orquestador vuelve a obtener en la rama):

- `packages/contract`: 31 passed (31)
- `packages/runtime`: 133 passed (133)
- `packages/markdown`: 88 passed (88)
- `apps/api`: 169 passed (169)
- `apps/web`: 252 passed (252)
- `packages/cli`: 50 passed (50)

Últimas líneas:

```
… (184 líneas anteriores)
apps/web test:  ✓ src/lib/keyboard.test.ts (4 tests) 5ms
apps/web test:  ✓ src/features/landing/LandingPage.test.tsx (13 tests) 1274ms
apps/web test:  ✓ src/features/subject/markdown/rehypeHeadingIds.test.ts (4 tests) 2ms
apps/web test:  ✓ src/features/subject/views/notesExport.test.ts (8 tests) 3ms
apps/web test:  ✓ src/features/subject/views/ReaderView.test.ts (8 tests) 2ms
apps/web test:  Test Files  23 passed (23)
apps/web test:       Tests  252 passed (252)
apps/web test:    Start at  04:13:09
apps/web test:    Duration  3.17s (transform 1.20s, setup 0ms, collect 6.38s, tests 3.21s, environment 11.52s, prepare 1.93s)
apps/web test: Done
packages/cli test:  ✓ src/cli.test.ts (50 tests) 5106ms
packages/cli test:    ✓ sinapsis propose > crea la rama, escribe la propuesta, anota el INBOX en main y vuelve a main 552ms
packages/cli test:    ✓ sinapsis propose > corre los gates y no crea nada si fallan 349ms
packages/cli test:    ✓ sinapsis propose > si el commit falla, la rama NO queda creada: el intento siguiente pasa (AC-15) 936ms
packages/cli test:    ✓ sinapsis propose > dos propuestas abiertas a la vez no se pisan: dos ramas y dos filas en el INBOX 472ms
packages/cli test:  Test Files  1 passed (1)
packages/cli test:       Tests  50 passed (50)
packages/cli test:    Start at  04:13:09
packages/cli test:    Duration  5.89s (transform 288ms, setup 0ms, collect 420ms, tests 5.11s, environment 0ms, prepare 147ms)
packages/cli test: Done
```

## Revisión

(la completa el orquestador con `/sinapsis-review`: veredicto, motivos, commit de merge)
