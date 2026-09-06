# Pruebas de punta a punta (Playwright)

Corren contra la **web real**, no contra mocks. Desde el Sprint 4 la plataforma es
una SPA estática: no hay API, no hay sesión y no hay cookies. La materia viaja como
archivos JSON dentro del sitio y todo lo personal —progreso, favoritos, apuntes,
repaso, plan, landing y perfil— vive en el navegador (IndexedDB con espejo en
`localStorage`).

De ahí salen las dos piezas de esta suite:

- un **sitio compilado** en `e2e/.site/`, que Vite sirve como `publicDir`;
- el **gancho de pruebas** `window.__sinapsis`, con el que las specs siembran y
  reponen el estado personal.

## Cómo correr

```bash
pnpm e2e                      # desde la raíz del repo
```

Equivale a `pnpm --filter @sinapsis/web run e2e`, que es
`playwright test -c ../../e2e/playwright.config.ts`. Playwright levanta y baja el
servidor por su cuenta (`webServer`), así que no hace falta tener nada corriendo
antes. El puerto `5173` (el de desarrollo) queda libre a propósito: la suite usa
el `5174`.

**`cd e2e && pnpm exec playwright test …` NO funciona** («unknown command 'test'»):
esta carpeta no tiene `package.json` ni `node_modules`, y el binario de Playwright
vive en `apps/web`. Un archivo suelto se corre así:

```bash
cd apps/web && pnpm exec playwright test -c ../../e2e/playwright.config.ts tests/plan-dates.spec.ts
```

Un solo caso, por su título:

```bash
cd apps/web && pnpm exec playwright test -c ../../e2e/playwright.config.ts -g "Siguiente"
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

## Cómo se siembra

### El sitio (`e2e/.site/`)

`support/site.ts` arma la carpeta que Vite sirve como `publicDir`:

1. copia de `apps/web/public/` todo menos `subjects/` (las fuentes —sin ellas el
   smoke visual saldría con la tipografía del sistema—, `manifest.webmanifest`,
   `icon.svg` y `.nojekyll`);
2. compila las materias FUENTE con el mismo `runSiteBuild` de
   `pnpm sinapsis -- site build`, hacia `e2e/.site/subjects/`;
3. deja `e2e/.site/build.json` con qué modo se tomó.

Eso ocurre **antes** de que arranque Vite: el comando del `webServer` empieza por
`prepare-site.ts`. No puede hacerlo `globalSetup`, porque Playwright levanta los
servidores primero (`createGlobalSetupTasks` corre los plugins antes que los
`globalSetup`) y Vite fotografía el contenido de `publicDir` al crearse.

### Los dos modos

| Modo | Fuente | Cuándo |
|---|---|---|
| **`proba`** | `subjects/` | existe `subjects/proba` (la materia real: 209 páginas, 95 de contenido, 11 unidades, 2 bundles) |
| **`demo`** | `e2e/fixtures/subjects/` | si no existe, o forzando el modo con la variable |

`SINAPSIS_E2E_VAULT` reemplaza la ruta que se comprueba: apuntándola a una carpeta
que no existe se fuerza el fixture, que es la única forma de ejercitarlo en una
máquina que sí tiene la materia real.

```bash
SINAPSIS_E2E_VAULT=/no/existe pnpm e2e
```

El fixture es una materia FUENTE completa, escrita como la escribiría cualquier
materia (`e2e/fixtures/subjects/demo/`):

```
sinapsis.config.json      3 semanas, 2 tipos de página, 2 grupos de rail
wiki/notas/*.md           7 páginas con $$…$$, $inline$, wikilinks y callouts
wiki/fuentes/*.md         1 fuente (no cuenta como contenido)
estudio/flashcards-demo.md  1 mazo autoral de 4 tarjetas
estudio/quiz-demo.md        1 quiz de 5 preguntas
estudio/plan.json           2 fases, sin modalidades ni instancias
estudio/kits.json           1 kit con páginas, mazo, quiz y lanzador
tools/mini-demo/            la vista «demo» y la figura «demo-fig»
```

Compila igual que cualquier materia del repositorio:

```bash
pnpm sinapsis -- site build --subjects e2e/fixtures/subjects --out /tmp/sinapsis-e2e-check
```

### El manifiesto (`e2e/.seed.json`)

`global-setup.ts` lee el sitio ya compilado y escribe `e2e/.seed.json`
(`support/seed.ts` lo lee). Las specs consultan ese manifiesto en vez de tener los
datos de Proba escritos a mano, así que la suite corre igual con el fixture:

| Campo | Para qué |
|---|---|
| `mode` | `isProba()`: las specs que solo valen con la materia real se saltean. |
| `subject` | nombre, código, cuatrimestre, divisiones declaradas y visibles, páginas. |
| `readerPage`, `catalogDivision`, `filterPage`, `palette` | las páginas y los términos con los que corren lector, catálogo y paleta. |
| `tools` | bundle principal (el que registra figuras), sus vistas y `allViews` (las de TODOS los bundles). |
| `railTools`, `railSlots` | los ítems y los grupos que declara el `rail[]` del config. |
| `figurePage` | la página con `> [!figura] <id>` y el id de la figura. |
| `study` | el mazo autoral más corto, el primer quiz, cuántos mazos automáticos, si hay plan y cuántos kits. |
| `landing`, `placeholder` | la landing que repone `resetLanding` (ver abajo). |

La siembra comprueba además que algún script del bundle registre la figura que
pide la página: sin eso, `figures.spec.ts` fallaría con «la figura no dibujó» sin
decir por qué. Y con la materia real exige que llegue el material de estudio: si
dejara de llegar, las specs de estudio pasarían probando estados vacíos.

## El gancho de pruebas y el aislamiento

Con `VITE_E2E=1` la web cuelga `window.__sinapsis`
(`apps/web/src/local/testHook.ts`):

```ts
window.__sinapsis = {
  reset(): Promise<void>;                    // deja el estado personal vacío
  snapshot(): Promise<LocalBackup>;          // el documento vigente
  restore(doc: LocalBackup): Promise<void>;  // lo reemplaza y lo persiste
  setTheme(theme): Promise<void>;            // el tema del perfil
};
```

`support/app.ts` lo envuelve. Todos los repositores son `snapshot()` + parche +
`restore()`:

| Helper | Firma | Qué hace |
|---|---|---|
| `snapshot` / `restore` / `resetLocal` | `(page[, doc])` | el gancho, en crudo. |
| `landingCards` | `(page)` | la landing calculada como la calcula la web: catálogo visible + placeholders, con `pagesCount`, `studiedCount` y `dueCount`. |
| `resetLanding` | `(page)` | deja la landing de la siembra: el catálogo en su cuatrimestre más la materia placeholder «Materia Demo B». |
| `resetSemesters` | `(page)` | repone la lista de cuatrimestres declarados (los vacíos, N0-32). |
| `resetProgress` | `(page, slug)` | desmarca las páginas estudiadas. |
| `resetStudy` | `(page, slug)` | vacía repasos, favoritos, apuntes, tareas, intentos y fechas del plan. |
| `studyState` | `(page, slug)` | el estado personal de la materia. |
| `expireSrsCards` | `(page, slug[, at])` | adelanta el vencimiento de las tarjetas SRS. |
| `setUserTheme` / `currentTheme` | `(page[, tema])` | el tema del perfil y el pintado en `<html data-theme>`. |
| `studyContent` / `subjectTools` / `subjectPages` | `(slug)` | leen los archivos del sitio, no el navegador. |
| `withApi` | `(browser, fn)` | abre una pestaña con la app cargada para los hooks sin fixture `page`. |

Dos cuidados:

- **el gancho solo existe con la aplicación cargada**: los helpers navegan a `/` si
  la pestaña está en `about:blank`. `main.tsx` lo instala DESPUÉS de leer el estado
  local, así que esperar al gancho garantiza que la hidratación terminó;
- **`restore()` invalida las consultas, pero si la pantalla ya estaba montada
  conviene recargar** (`page.reload()`) para verla con el estado nuevo.

**Aislamiento.** Cada prueba corre en su propio contexto de navegador, con
IndexedDB y `localStorage` vacíos: no hay base compartida, ni cookie sembrada, ni
limpieza al terminar. Lo que se repone es lo que la prueba necesita ENCONTRAR —la
materia placeholder de la landing, tarjetas de repaso vencidas—, no lo que dejó
sucio. Por eso desaparecieron los `afterAll` de reposición del Sprint 3.

`expireSrsCards` no es comodidad: calificar corre el SM-2 del contrato, que
siempre deja la próxima revisión en el futuro (con «Otra vez», diez minutos), y el
`dueCount` de la landing cuenta `due <= ahora`. Sin adelantar la fecha, la única
prueba posible sería esperar diez minutos. Lo que se prueba sigue siendo del
producto: el conteo lo calcula la web y la tarjeta la dibuja la landing.

## Qué cubre cada archivo

| Archivo | Qué prueba |
|---|---|
| `backup.spec.ts` | La copia de seguridad (S4 · §2.2): lo marcado sobrevive a la recarga; «Descargar copia de seguridad» baja un JSON con la forma de `LocalBackup`; «Restaurar copia» repone el estado desde el archivo; «Borrar todo lo local» vacía el documento y devuelve la landing a su estado inicial. |
| `catalog-search.spec.ts` | `?d=` recorta el catálogo; el filtro de texto y su `?q=`; ⌘K/Ctrl+K abre la paleta y Enter navega al lector. |
| `exercises.spec.ts` | El segundo bundle de la materia real (`proba-exercises`): sus tres vistas se montan y dibujan, el semáforo guarda con el prefijo de la materia y el rail las abre. Solo en modo `proba`. |
| `figures.spec.ts` | Figuras del lector (N0-42): el callout `> [!figura] id` monta un `canvas`/`svg` dentro de `figure.figura .fig-host`, sin marco de reserva ni `.fig-missing`, con su epígrafe; todas las figuras de la página dibujan; y la regresión N0-47 (solo en modo `proba`). |
| `flashcards.spec.ts` | La lista de mazos (autorales + automáticos, con la insignia «Automático») y la sesión con Espacio y notas 1-4 sobre el mazo autoral más corto de la materia. |
| `graph.spec.ts` | El `canvas`, la lista accesible «MÁS CITADAS», el filtro «Solo contenido», «Encajar», el resaltado por título y el salto al lector. |
| `landing.spec.ts` | Tarjeta de la materia del catálogo; agrupado por cuatrimestre; gestión (mover + guardar + recarga); quitar con confirmación; alta desde el diálogo; una materia del catálogo quitada vuelve desde la lista del diálogo; estado vacío. |
| `landing-due.spec.ts` | El contador «N para repasar»: calificar «Otra vez» deja la tarjeta a diez minutos y la landing todavía no la cuenta; con la tarjeta vencida aparece el contador, con su cifra, su nombre accesible y su enlace al repaso. |
| `landing-semesters.spec.ts` | Cuatrimestres del usuario (N0-32): agregar uno vacío, reordenar con el teclado y quitarlo. |
| `page-tip.spec.ts` | La tarjeta de vista previa (N0-50) en sus cuatro superficies, y que ningún enlace a página conserve el `title` nativo en ninguna vista del shell. |
| `plan-dates.spec.ts` | Fechas de las instancias evaluatorias (D7): cargarla, verla en su fase, borrarla, «Borrar fechas» vs. «Reiniciar el plan», y que elegir en el calendario guarde una sola fecha. Sin instancias, que no se dibuje el panel. |
| `plan-kits.spec.ts` | Las fases del plan y la fase actual; tildar una tarea sube el contador y persiste; los kits, el detalle del más completo y «Repasar los mazos del kit». |
| `plan-tracks.spec.ts` | Modalidades del plan (N0-43): el conmutador, el cambio de fases, la persistencia en `sinapsis.<slug>.planTrack` y las flechas. Sin modalidades, que no se dibuje. |
| `quiz.spec.ts` | La lista con su recuento de preguntas; el revelado CORRECTO/INCORRECTO con explicación; el quiz entero con su resultado y el intento registrado. |
| `reader.spec.ts` | KaTeX, wikilink interno navegable, «EN ESTA PÁGINA», marcar estudiado (índice + progreso + recarga) y «Siguiente». |
| `study.spec.ts` | «Lo mío»: favorito desde el lector → `/favorites` y recarga; apunte con guardado automático → recarga; `/notes` lo lista y «Exportar markdown» baja el `.md`. |
| `subject-shell.spec.ts` | Geometría del contrato (rail 52 · panel 250 · cabecera 40 · migas 28), grupos `data-slot` fijos y slot, hero, árbol del índice, plegado persistente, cajón por debajo de 900 px, pestañas y el sello «S». |
| `tabs.spec.ts` | Pestañas (N0-29): ⌘-clic abre dos sin navegar, el clic activa y navega, la ✕ cierra, la recarga las conserva y ⌘⇧] pasa a la siguiente. |
| `themes.spec.ts` | La tecla `T` cicla pergamino → laurel → claustro y persiste; capturas del smoke visual. |
| `tools.spec.ts` | Herramientas de la materia (N0-41): el rail abre los slots del config; `/m/:materia/t/:vista` monta la vista dentro de `.sinapsis-tool`; el cambio de tema no la rompe; volver y regresar la vuelve a montar; una vista que ningún bundle registra vuelve al inicio, y un slot reservado sin bundle dice «Próximamente». |

## Capturas

`themes.spec.ts` deja veinticuatro PNG de 1440×1024 en `e2e/shots/` (ocho vistas ×
tres temas):

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

Se sobrescriben en cada corrida y son deterministas (el árbol del índice se fija
antes de la primera captura) **salvo el grafo**: su lienzo parte de posiciones al
azar y cada corrida lo dibuja distinto. Sirve para mirar el tema, no para comparar
píxeles.

Las specs de herramientas y figuras dejan además, con los nombres de la siembra:

```
herramienta-<vista>.png            la vista de la materia recién montada
herramienta-<vista>-<tema>.png     la misma vista después de cambiar el tema
figura-<id>.png                    la página del lector con la figura dibujada
plan-modalidades.png               el plan con el conmutador de modalidad
```

Los nombres dependen del modo: las capturas versionadas son las del modo `proba`
(`herramienta-explorador*.png`, `figura-u0-alambre-masa-acumulada-y-densidad.png`).
Una corrida en modo demo deja las suyas (`herramienta-demo*.png`,
`figura-demo-fig.png`): son descartables y no se versionan.

## Selectores

Se prefieren roles y etiquetas accesibles (`getByRole`, `getByLabel`) y texto
visible. Los `data-testid` de la app son los mínimos que agregó esta suite, porque
las clases son de CSS Modules (con hash) y no sirven como anclas:

| `data-testid` | Dónde | Para qué |
|---|---|---|
| `subject-header` | `features/subject/components/SubjectHeader.tsx` | medir la cabecera de 40 px sin depender del rol implícito `banner`. |
| `subject-card` (+ `data-slug`) | `features/landing/SubjectCard.tsx` | apuntar a una tarjeta concreta de la landing. |
| `division-row` (+ `data-division`) | `features/subject/components/IndexPanel.tsx` | contar y ubicar divisiones en el índice. |
| `graph-meta`, `graph-zoom` | `features/subject/views/GraphView.tsx` | el contador «N de M páginas · K enlaces» y el nivel de acercamiento, que es lo único legible del lienzo. |
| `deck-card` (+ `data-deck`) | `features/subject/study/FlashcardsView.tsx` | contar mazos y apuntar a uno concreto. |
| `session-counter` | `features/subject/study/SessionView.tsx` | el «3 / 4» de la sesión, sin depender de un texto suelto. |
| `quiz-counter`, `quiz-card` (+ `data-question`) | `features/subject/study/QuizView.tsx` | la pregunta en curso, que sale mezclada. |
| `plan-phase` (+ `data-phase`), `plan-total` | `features/subject/study/PlanView.tsx` | contar fases y leer el «1/89» de pasos completados. |
| `kit-card` (+ `data-kit`) | `features/subject/study/KitsView.tsx` | contar kits y abrir uno concreto. |
| `tool-host` | `features/subject/tools/ToolHost.tsx` | el marco de una herramienta: distingue «hay una vista montada» de «Próximamente» y de error. |
| `drawer-scrim` | `features/subject/SubjectShell.tsx` | el velo del cajón del índice por debajo de 900 px. |

El nodo que el host le presta al bundle se apunta con
`.sinapsis-tool[data-view="<vista>"]` (y `data-tool` con el id del bundle). La
clase sola **no** alcanza: los bundles pueden montar la suya fuera del host —el
buscador ⌘J de Proba dibuja un `div.sinapsis-tool.ql-host` colgado del
documento—, así que sin el `[data-view]` el selector devuelve dos elementos.

Dos detalles del cliente que la suite tuvo que respetar y conviene no olvidar:

- **Casillas del plan.** Se tildan con `click()`, no con `check()`: la casilla la
  controla la caché optimista y `check()` espera a que cambie el `checked` nativo.
- **Arrastre con teclado (dnd-kit).** Entre «tomar» (Espacio) y la primera flecha
  hay que dejar pasar dos cuadros: la biblioteca mide los destinos con
  `requestAnimationFrame` después de arrancar el arrastre (`settle()` en
  `landing-semesters.spec.ts`).

## Archivos que no se versionan

`.site/` (el sitio compilado), `.seed.json` (el manifiesto de la siembra),
`test-results/` y `playwright-report/`.
