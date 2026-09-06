# Pruebas de punta a punta (Playwright)

Corren contra el **API y la web reales**, no contra mocks: se levanta el API de Hono en
`:3100` con una base SQLite descartable y la SPA de Vite en `:5174` con su proxy.
Los puertos `3000` / `5173` (los de desarrollo) quedan libres a propósito.

## Cómo correr

```bash
pnpm e2e                      # desde la raíz del repo
```

Equivale a `pnpm --filter @sinapsis/web run e2e`, que es
`playwright test -c ../../e2e/playwright.config.ts`. Playwright levanta y baja los dos
servidores por su cuenta (`webServer`), así que no hace falta tener nada corriendo antes.

Variantes útiles:

```bash
pnpm --filter @sinapsis/web exec playwright test -c ../../e2e/playwright.config.ts --headed
pnpm --filter @sinapsis/web exec playwright test -c ../../e2e/playwright.config.ts reader
pnpm --filter @sinapsis/web exec playwright test -c ../../e2e/playwright.config.ts --ui
pnpm --filter @sinapsis/web exec playwright show-report ../../e2e/playwright-report
```

Requisitos: `pnpm install` hecho y los navegadores de Playwright instalados
(`pnpm --filter @sinapsis/web exec playwright install chromium`).

## Cómo se siembran los datos

La base es **una sola para toda la corrida** (`apps/api/data/e2e.db`) y arranca vacía:
el comando del `webServer` del API la borra antes de levantar
(`rm -f apps/api/data/e2e.db*`), y `apps/api/src/index.ts` aplica las migraciones al
arrancar. No se puede borrar desde `globalSetup` porque ese hook corre **después** de que
los servidores están arriba.

`global-setup.ts` hace, en orden:

1. **Sesión.** `POST /api/auth/dev` contra `:3100` (el API corre con `AUTH_DEV_BYPASS=1`)
   y guarda la cookie `sinapsis_sid` como `storageState` en `.auth/dev.json`. Ese archivo
   es el `use.storageState` de toda la suite: las pruebas arrancan con sesión iniciada.
   Las cookies no distinguen puerto, así que la cookie emitida por `:3100` viaja también
   a la web de `:5174`.

2. **Materia con contenido.** Dos caminos, según haya vault o no:

   | Camino | Cuándo | Qué sube |
   |---|---|---|
   | **Vault real** | existe `~/Desktop/ITBA/26-1C/Proba_Obsidian/wiki` | compila ese wiki con `compileWiki({ config, rootDir, wikiRoot })` — el config es `examples/proba/sinapsis.config.json` y la raíz absoluta del vault va por `wikiRoot`, porque el contrato exige que `wiki.root` sea **relativo** — y hace `PUT /api/subjects/proba/sync` (209 páginas, 97 de contenido, 11 unidades). |
   | **Fixture** | no existe el vault | sube tal cual `fixtures/mini-payload.json` a `PUT /api/subjects/demo/sync`: materia «Materia Demo», 3 divisiones «Semana 01…03» (rótulo `Semana / S / Semanas`), 2 tipos y 8 páginas con `$$…$$`, `$inline$`, wikilinks `[[…\|…]]` y callouts `> [!info]`. |

   El sync se autentica con `Authorization: Bearer e2e-token` (`SYNC_TOKEN` del API).

3. **Landing.** El sync **no** pone la materia en la landing de nadie (las materias son
   globales, N0-6), así que se llama `POST /api/subjects` dos veces: una para la materia
   sincronizada (cuatrimestre `2026-1C`) y otra para la materia placeholder
   **«Materia Demo B»** (slug `demo-b`, `2025-2C`). Después se verifica con
   `GET /api/landing` que las dos quedaron.

4. **Manifiesto.** Escribe `.auth/seed.json` con qué camino se tomó y qué páginas usar
   (`support/seed.ts` lo lee). Las specs consultan ese manifiesto en vez de tener los
   datos de Proba escritos a mano, así que la suite corre igual con el fixture.

### Aislamiento entre pruebas

Un solo worker y una sola base: el aislamiento lo da la **reposición explícita**, no un
usuario por prueba. `support/app.ts` expone `resetLanding`, `resetProgress` y
`setUserTheme`, y cada archivo que ensucia estado los llama en `beforeEach` / `afterAll`
(`withApi(...)` porque `afterAll` no recibe la fixture `request`). El archivo
`auth.spec.ts` es el único que corre **sin** `storageState`.

## Qué cubre cada archivo

| Archivo | Qué prueba |
|---|---|
| `auth.spec.ts` | Sin sesión `/` rebota a `/login`; el botón de desarrollo entra; «Cerrar sesión» desde el avatar vuelve a `/login`. |
| `catalog-search.spec.ts` | `?d=` recorta el catálogo; el filtro de texto y su `?q=`; ⌘K/Ctrl+K abre la paleta y Enter navega al lector. |
| `landing.spec.ts` | Tarjeta de la materia sincronizada (código, institución, «SIN COMENZAR»); agrupado por cuatrimestre; gestión (mover + guardar + recarga); quitar con confirmación; alta desde el diálogo; estado vacío. |
| `reader.spec.ts` | KaTeX (`.katex-display` y `.katex`), wikilink interno navegable, «EN ESTA PÁGINA» y «ENLAZAN AQUÍ», marcar estudiado (índice + progreso + recarga) y «Siguiente». |
| `subject-shell.spec.ts` | Geometría del contrato (rail 52 · panel 250 · cabecera 40 · migas 28 medidos con `boundingBox`), grupos `data-slot` fijos y slot, hero, árbol del índice, plegado persistente y el sello «S». |
| `themes.spec.ts` | La tecla `T` cicla pergamino → laurel → claustro y persiste; capturas del smoke visual. |

## Capturas

`themes.spec.ts` deja nueve PNG de 1440×1024 en `e2e/shots/`:

```
landing-{pergamino,laurel,claustro}.png
materia-{pergamino,laurel,claustro}.png
lector-{pergamino,laurel,claustro}.png
```

Se sobrescriben en cada corrida y son deterministas (el árbol del índice se fija antes de
la primera captura).

## Selectores

Se prefieren roles y etiquetas accesibles (`getByRole`, `getByLabel`) y texto visible. Solo
hay tres `data-testid` en la app, agregados por esta suite porque las clases son de CSS
Modules (con hash) y no sirven como anclas:

| `data-testid` | Dónde | Para qué |
|---|---|---|
| `subject-header` | `features/subject/components/SubjectHeader.tsx` | medir la cabecera de 40 px sin depender del rol implícito `banner`. |
| `subject-card` (+ `data-slug`) | `features/landing/SubjectCard.tsx` | apuntar a una tarjeta concreta de la landing. |
| `division-row` (+ `data-division`) | `features/subject/components/IndexPanel.tsx` | contar y ubicar divisiones en el índice. |

## Archivos que no se versionan

`.auth/` (cookie y manifiesto de la siembra), `test-results/` y `playwright-report/`.
