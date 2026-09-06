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

**`cd e2e && pnpm exec playwright test …` NO funciona** («unknown command 'test'»): esta
carpeta no tiene `package.json` ni `node_modules`, y el binario de Playwright vive en
`apps/web`. Un archivo suelto se corre así:

```bash
cd apps/web && pnpm exec playwright test -c ../../e2e/playwright.config.ts tests/plan-dates.spec.ts
```

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

   El payload lleva también el **material de estudio** (`payload.study`): `compileWiki`
   compila `examples/proba/estudio/` —que es relativa al config, no al vault (N0-27)— y lo
   mete en el `SyncPayload`, así que la siembra no hace nada especial para que llegue. Con
   el vault real quedan 6 mazos autorales (46 tarjetas) + 12 automáticos por unidad, 1 quiz
   de 15 preguntas, un plan con dos modalidades (N0-43: «cursada + final» y «final
   directo») y 8 kits.

   `SINAPSIS_E2E_VAULT` reemplaza la ruta del vault: apuntándola a una carpeta que no
   existe se fuerza el camino del fixture, que es la única forma de ejercitarlo en una
   máquina que sí tiene el vault.

   ```bash
   SINAPSIS_E2E_VAULT=/no/existe pnpm e2e
   ```

3. **Landing.** El sync **no** pone la materia en la landing de nadie (las materias son
   globales, N0-6), así que se llama `POST /api/subjects` dos veces: una para la materia
   sincronizada (cuatrimestre `2026-1C`) y otra para la materia placeholder
   **«Materia Demo B»** (slug `demo-b`, `2025-2C`). Después se verifica con
   `GET /api/landing` que las dos quedaron.

4. **Herramientas** (Sprint 3 · N0-41). Publica el bundle de la materia con el mismo
   `buildBundle` que usa `sinapsis tools build` —valida el manifiesto, que cada archivo
   declarado exista y que cada script parsee— y lo sube con
   `PUT /api/subjects/:slug/tools/:id` y el token de sync, que es lo que hace
   `sinapsis tools push`. Después lo verifica con `GET /api/subjects/:slug/tools`.

   | Camino | Bundle | Qué trae |
   |---|---|---|
   | **Vault real** | `examples/proba/tools/proba-tools` | 22 archivos (913 KB): 5 vistas (`explorador`, `calc`, `asistente`, `taller`, `lab`) y las figuras del wiki. |
   | **Fixture** | `fixtures/mini-tools/` | 2 archivos: la vista `demo` (un `<h2>` y un hueco de figura) y la figura `demo-fig`, que dibuja un `<canvas>`. La página `demo-repaso` del fixture la usa con `> [!figura] demo-fig`. |

   Los archivos del bundle se guardan en disco, no en la base: el `webServer` del API los
   manda a una carpeta propia (`TOOLS_DIR=./data/e2e-tools`) y la borra antes de cada
   corrida, igual que la base, así que la suite no toca las herramientas del entorno de
   desarrollo.

   La siembra comprueba además que la página de figuras traiga su callout
   `> [!figura] <id>` y que algún script del bundle registre esa figura: sin eso,
   `figures.spec.ts` fallaría con «la figura no dibujó» sin decir por qué.

5. **Manifiesto.** Escribe `.auth/seed.json` con qué camino se tomó y qué páginas usar
   (`support/seed.ts` lo lee). Las specs consultan ese manifiesto en vez de tener los
   datos de Proba escritos a mano, así que la suite corre igual con el fixture. Del
   Sprint 3 trae `tools` (id del bundle, vistas y rótulos), `railTools` (los ítems
   `kind: "tool"` del config) y `figurePage` (la página con figura y el id de la figura).

### Aislamiento entre pruebas

Un solo worker y una sola base: el aislamiento lo da la **reposición explícita**, no un
usuario por prueba. `support/app.ts` expone `resetLanding`, `resetProgress`, `resetStudy`,
`resetSemesters` y `setUserTheme`, y cada archivo que ensucia estado los llama en
`beforeEach` / `afterAll` (`withApi(...)` porque `afterAll` no recibe la fixture
`request`). El archivo `auth.spec.ts` es el único que corre **sin** `storageState`.

| Repositor | Qué repone | Con qué |
|---|---|---|
| `resetLanding` | las materias de la landing y su cuatrimestre | `POST` / `DELETE /api/subjects/:slug/landing`, `PUT /api/landing` |
| `resetSemesters` | la lista de cuatrimestres del usuario, vacíos incluidos (N0-32) | `PUT /api/landing` con `semesters` |
| `resetProgress` | las páginas marcadas como estudiadas | `DELETE /api/subjects/:slug/progress/:page` |
| `resetStudy` | SRS, favoritos, apuntes y tareas del plan | `DELETE` de `study/srs`, `bookmarks`, `notes` y `tasks` |

Lo único que **no** se puede reponer son los intentos de quiz: el contrato no expone un
`DELETE` de `attempts`, así que `quiz.spec.ts` asserta «al menos uno» en vez de una
cantidad exacta.

`support/app.ts` tiene además **una sola** función que escribe en la base sin pasar por el
API, `expireSrsCards(slug)`: adelanta el vencimiento de las tarjetas SRS de una materia.
No es comodidad. Calificar por HTTP corre el SM-2 del contrato, que nunca deja la próxima
revisión en el pasado —con «Otra vez» la deja a diez minutos—, y el `dueCount` de la
landing cuenta `due <= ahora`: sin adelantar la fecha, la única prueba posible sería
esperar diez minutos. Los tests del API insertan filas con `due` de ayer por la misma
razón. Lo que se prueba sigue siendo del producto: el conteo lo calcula el API y la
tarjeta la dibuja la web. `resetStudy` la limpia como a cualquier otra fila de SRS.

El estado de UI del cliente (pestañas, divisiones abiertas del índice) vive en
`localStorage` y no hace falta reponerlo: el `storageState` sembrado solo trae la cookie,
así que cada prueba arranca con `localStorage` vacío.

## Qué cubre cada archivo

| Archivo | Qué prueba |
|---|---|
| `auth.spec.ts` | Sin sesión `/` rebota a `/login`; el botón de desarrollo entra; «Cerrar sesión» desde el avatar vuelve a `/login`. |
| `catalog-search.spec.ts` | `?d=` recorta el catálogo; el filtro de texto y su `?q=`; ⌘K/Ctrl+K abre la paleta y Enter navega al lector. |
| `figures.spec.ts` | Figuras del lector (N0-42): el callout `> [!figura] id` monta un `canvas`/`svg` dentro de `figure.figura .fig-host`, sin marco de reserva ni `.fig-missing`, con su epígrafe «Figura · id»; todas las figuras de la página dibujan; y la regresión N0-47 (`tecnica-derivadas-parciales` entera: ≥ 6 `h2`, `.katex-display`, sin `.katex-error` ni «undefined»). |
| `flashcards.spec.ts` | La lista de mazos (autorales + automáticos, con la insignia «Automático»); la sesión con Espacio y notas 1-4: el contador avanza, el SRS queda persistido con `due` futuro y el mazo corto llega a la pantalla final. |
| `graph.spec.ts` | El `canvas`, la lista accesible «MÁS CITADAS», el filtro «Solo contenido» (baja el contador de nodos, no el total), el resaltado por título (`?q=`) y el salto al lector. |
| `landing.spec.ts` | Tarjeta de la materia sincronizada (código, institución, «SIN COMENZAR»); agrupado por cuatrimestre; gestión (mover + guardar + recarga); quitar con confirmación; alta desde el diálogo; estado vacío. |
| `landing-due.spec.ts` | El contador «N para repasar» de la tarjeta (Sprint 3): calificar «Otra vez» en la sesión deja la tarjeta a diez minutos y la landing todavía no la cuenta; con la tarjeta vencida (`expireSrsCards`) aparece el contador, con su cifra, su nombre accesible y su enlace al repaso. |
| `landing-semesters.spec.ts` | Cuatrimestres del usuario (N0-32): agregar uno vacío y que sobreviva a la recarga, reordenar con el teclado (asa → Espacio → flecha → Espacio) y quitar uno vacío. |
| `plan-kits.spec.ts` | Las 6 fases del plan y la fase actual; tildar una tarea sube el contador y persiste; los 8 kits, el detalle de uno y «Repasar los mazos del kit» → `flashcards/kit:<id>`. |
| `plan-tracks.spec.ts` | Modalidades del plan (N0-43): el conmutador ofrece las que trae el plan y arranca en la primera; cambiar de modalidad cambia las fases visibles y se recuerda en `sinapsis.<slug>.planTrack` tras recargar; un plan sin modalidades no dibuja el conmutador (con el fixture). |
| `quiz.spec.ts` | La lista con su recuento de preguntas; el revelado CORRECTO/INCORRECTO con explicación; el quiz entero (15) con su resultado `n/15` y el intento registrado. |
| `reader.spec.ts` | KaTeX (`.katex-display` y `.katex`), wikilink interno navegable, «EN ESTA PÁGINA» y «ENLAZAN AQUÍ», marcar estudiado (índice + progreso + recarga) y «Siguiente». |
| `study.spec.ts` | «Lo mío»: favorito desde el lector → `/favorites` y recarga; apunte con guardado automático → recarga; `/notes` lo lista y «Exportar markdown» baja el `.md`. |
| `subject-shell.spec.ts` | Geometría del contrato (rail 52 · panel 250 · cabecera 40 · migas 28 medidos con `boundingBox`), grupos `data-slot` fijos y slot, hero, árbol del índice, plegado persistente y el sello «S». |
| `tabs.spec.ts` | Pestañas (N0-29): ⌘-clic en el índice abre dos sin navegar, el clic activa y navega, la ✕ cierra, la recarga las conserva y ⌘⇧] pasa a la siguiente. |
| `themes.spec.ts` | La tecla `T` cicla pergamino → laurel → claustro y persiste; capturas del smoke visual. |
| `tools.spec.ts` | Herramientas de la materia (N0-41): el rail abre los slots que declara el config; `/m/:materia/t/:vista` monta la vista dentro de `.sinapsis-tool` con su título y su dibujo; cambiar de tema desde la cabecera no la rompe; volver al inicio y regresar la vuelve a montar; una vista que ningún bundle registra muestra «PRÓXIMAMENTE» sin errores de consola. |

## Capturas

`themes.spec.ts` deja veinticuatro PNG de 1440×1024 en `e2e/shots/` (ocho vistas × tres
temas):

```
landing-{pergamino,laurel,claustro}.png
materia-{pergamino,laurel,claustro}.png
lector-{pergamino,laurel,claustro}.png
grafo-{pergamino,laurel,claustro}.png
flashcards-{pergamino,laurel,claustro}.png
sesion-{pergamino,laurel,claustro}.png
plan-{pergamino,laurel,claustro}.png
kits-{pergamino,laurel,claustro}.png
```

Se sobrescriben en cada corrida y son deterministas (el árbol del índice se fija antes de
la primera captura) **salvo el grafo**: su lienzo parte de posiciones al azar y cada
corrida lo dibuja distinto. Sirve para mirar el tema, no para comparar píxeles.

Las specs del Sprint 3 dejan además, con los nombres de la siembra:

```
herramienta-<vista>.png            la vista de la materia recién montada
herramienta-<vista>-<tema>.png     la misma vista después de cambiar el tema
figura-<id>.png                    la página del lector con la figura dibujada
plan-modalidades.png               el plan con el conmutador de modalidad
```

## Selectores

Se prefieren roles y etiquetas accesibles (`getByRole`, `getByLabel`) y texto visible. Los
`data-testid` de la app son los mínimos que agregó esta suite, porque las clases son de CSS
Modules (con hash) y no sirven como anclas:

| `data-testid` | Dónde | Para qué |
|---|---|---|
| `subject-header` | `features/subject/components/SubjectHeader.tsx` | medir la cabecera de 40 px sin depender del rol implícito `banner`. |
| `subject-card` (+ `data-slug`) | `features/landing/SubjectCard.tsx` | apuntar a una tarjeta concreta de la landing. |
| `division-row` (+ `data-division`) | `features/subject/components/IndexPanel.tsx` | contar y ubicar divisiones en el índice. |
| `graph-meta` | `features/subject/views/GraphView.tsx` | el contador «N de M páginas · K enlaces», que es lo único legible del lienzo. |
| `deck-card` (+ `data-deck`) | `features/subject/study/FlashcardsView.tsx` | contar mazos y apuntar a uno concreto. |
| `session-counter` | `features/subject/study/SessionView.tsx` | el «3 / 4» de la sesión, sin depender de un texto suelto. |
| `quiz-counter` | `features/subject/study/QuizView.tsx` | ídem para la pregunta en curso. |
| `plan-phase` (+ `data-phase`) | `features/subject/study/PlanView.tsx` | contar fases y apuntar a una. |
| `plan-total` | `features/subject/study/PlanView.tsx` | el «1/89» de pasos completados. |
| `kit-card` (+ `data-kit`) | `features/subject/study/KitsView.tsx` | contar kits y abrir uno concreto. |
| `tool-host` | `features/subject/tools/ToolHost.tsx` | el marco de una herramienta (lo trajo la app, no esta suite): distingue «hay una vista montada» de los estados «Próximamente» y de error. |

El nodo que el host le presta al bundle se apunta con `.sinapsis-tool[data-view="<vista>"]`
(y `data-tool` con el id del bundle). La clase sola **no** alcanza: los bundles pueden
montar la suya fuera del host —el buscador ⌘J de Proba dibuja un `div.sinapsis-tool.ql-host`
colgado del documento—, así que sin el `[data-view]` el selector devuelve dos elementos.

Dos detalles del cliente que la suite tuvo que respetar y conviene no olvidar:

- **Casillas del plan.** Se tildan con `click()`, no con `check()`: la casilla la controla
  la caché optimista y `check()` espera a que cambie el `checked` nativo.
- **Arrastre con teclado (dnd-kit).** Entre «tomar» (Espacio) y la primera flecha hay que
  dejar pasar dos cuadros: la biblioteca mide los destinos con `requestAnimationFrame`
  después de arrancar el arrastre (`settle()` en `landing-semesters.spec.ts`).

## Archivos que no se versionan

`.auth/` (cookie y manifiesto de la siembra), `test-results/` y `playwright-report/`.
