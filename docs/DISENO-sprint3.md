# Revisión de diseño — Sprint 3 (D5)

> Histórico: describe la arquitectura anterior al Sprint 4 (sitio estático); ver HANDOFF-sprint4.md.

Recorrido completo de la plataforma con Playwright headless sobre los servidores de
desarrollo reales: web `:5173`, API `:3000` y la materia **Proba** con 209 entradas —97 de
contenido y 112 fuentes—, 18 mazos / 141 tarjetas, un quiz de 15 preguntas, 8 kits, un plan
de 5 fases y 2 modalidades, y el bundle de herramientas de 913 kB.

## Método

| | |
|---|---|
| Pantallas distintas | **36** |
| Temas | 3 (`pergamino`, `laurel`, `claustro`) |
| Anchos | 4 (1440×900 · 1280×800 · 1024×768 · 390×844); la pasada de estados va solo a 1440 |
| Capturas | **374** en `design/referencias/sprint3-diseno/` (360 del estado final + 14 «antes» de las correcciones más visibles) |
| Comprobaciones automáticas por vista | desborde del documento y de cada caja, recorte de texto, **contraste WCAG medido** (no estimado: se compone el color efectivo sobre el fondo real y se calcula el cociente), objetivos táctiles < 24 px, nombres accesibles repetidos o ausentes, tamaños de icono por zona, errores de consola |

Pantallas recorridas: `login` (anónimo), `landing`, `landing-gestion`, `landing-dialogo`,
`landing-llena` / `landing-vacia` / `landing-llena-gestion` (con las fixtures de desarrollo:
7 materias, 3 cuatrimestres, `dueCount`, materia sin sincronizar, nombre largo), `inicio`,
`avatar-menu`, `paleta`, `paleta-vacia`, `atajos`, `lector`, `lector-largo`, `catalogo`,
`division`, `grafo`, `plan`, `kits`, `kit`, `flashcards`, `flashcards-sesion`,
`flashcards-dorso`, `quizzes`, `quiz`, `notas`, `favoritos`, `herramienta` (explorador),
`herramienta-calc`, `no-encontrada`.

Y una pasada de estados que no salen del recorrido normal, conseguida interceptando
`GET /api/subjects/proba/study/state` en el navegador (sin escribir nada en la base):
`favoritos-vacio`, `notas-vacio`, `plan-tildado` (29 de 57 tareas), `quiz-respondido`,
`quiz-resultado` (quiz entero contestado) y `pestanas` (nueve pestañas abiertas).

Nombre de las capturas: `<pantalla>-<tema>-<ancho>.png` es el estado **después** de las
correcciones; `<pantalla>-<tema>-<ancho>-antes.png` es el estado con el que se encontró.
`login` solo existe a 1440 y a 1024 porque es la única pasada sin cookie de sesión: con
sesión, `/login` redirige a la landing y pierde el parámetro de tema.

## Hallazgos

Ownership: **D5** = corregido en este reporte · **F5** = `ReaderView.module.css`,
`markdown/`, `packages/runtime` · **orq.** = fuera del reparto de la ola 2.

| # | Pantalla | Tema/ancho | Falla | Sev. | Evidencia | Acción |
|---|---|---|---|---|---|---|
| 1 | Grafo | los 3 · 1024 y 390 | Por debajo de 1100 px `.side` es `flex: none` en columna y se comía todo el alto: **el lienzo quedaba en 2 px y el grafo desaparecía**. La vista solo mostraba la leyenda y «Más citadas». | **alta** | `grafo-pergamino-1024-antes.png` | corregido · `GraphView.module.css:380-395` (la vista pasa a alto automático, el lienzo a `clamp(300px, 52vh, 460px)`) |
| 2 | Todos los diálogos (atajos, agregar materia, borrar apunte) | claustro · todos | `Dialog.module.css` pintaba el velo con el literal `rgba(35,28,18,.42)` en vez de `var(--scrim)`: en el tema oscuro **no oscurecía nada** (medido en el mismo píxel: sin diálogo 41,38,34 → con diálogo 39,34,28; la paleta ⌘K, que sí usa el token, da 15,14,12). Además rompía la regla «nunca colores literales» de `tokens.css`. | **alta** | `atajos-claustro-1440-antes.png` vs `atajos-claustro-1440.png` | corregido · `Dialog.module.css:11` |
| 3 | Landing y login | los 3 · 390 | `.tools` de la cabecera no podía encogerse (sin `min-width: 0`) y el buscador trae ancho fijo de 300: el documento medía **436 px en una ventana de 390** y toda la página se desplazaba en horizontal. | **alta** | `landing-pergamino-390-antes.png` | corregido · `PlatformHeader.module.css:36` + `Button.module.css:66` (`.icon` con `flex: none`: el conmutador de tema se encogía a 21,8 px) |
| 4 | Inicio, plan, kits, flashcards, quiz, sesión, grafo, apuntes, favoritos, diálogos, paleta, estados | claustro · todos | **Grano ausente en la mitad de las superficies.** El rail, el índice, la cabecera, la hoja del lector, la tarjeta del catálogo y la tarjeta de materia llevaban `--grain-22`; ninguna otra. Medido en el interior de una tarjeta de kit: antes luminancia 25,00 con desviación **0,00** (superficie perfectamente plana), el fondo de la página 37,24/4,63. | media | `kits-claustro-1440-antes.png` | corregido · 17 módulos; después 43,88/4,50, ya con la textura del fondo |
| 5 | Sesión de repaso, quiz, plan, apuntes | los 3 · todos | Opacidad de deshabilitado inconsistente: 0,55 (notas 1-4 y «Siguiente»), 0,7 (opción del quiz, «Marcar todo el hito»), 0,5 («Exportar markdown») y 0,45 (lector). **N0-25 fija 0,75.** Los cuatro botones de nota parecían rotos antes de dar vuelta la tarjeta. | media | `flashcards-sesion-pergamino-1440-antes.png` | corregido · `SessionView.module.css:189`, `QuizView.module.css:137,204`, `PlanView.module.css:225`, `mine.module.css:60` · **pedido a F5** para `ReaderView.module.css:428` |
| 6 | Kits | los 3 · todos | Los chips de división envolvían a dos líneas y empujaban **27 px** el título, el resumen y el recuento respecto de las tarjetas vecinas de la misma fila. | media | `kits-claustro-1440-antes.png` | corregido · `DivisionChips` acepta `max` y resume el resto en «+N» (`ui.tsx:67`, `ui.module.css:94`); kits `max={3}`, hitos del plan `max={3}` |
| 7 | Landing | los 3 · todos | El pie de la tarjeta con insignia «N para repasar» envolvía: su filete y sus acciones quedaban 30 px por encima de los de las tarjetas vecinas. Igual en modo gestión con «Quitar» + selector de cuatrimestre. | media | `landing-llena-pergamino-1440-antes.png` | corregido · `.foot` pasa a rejilla de dos filas fijas (`SubjectCard.module.css:137`) |
| 8 | Plan, inicio, quizzes, sesión, apuntes, favoritos | los 3 · 1024 (y 1280 con el índice abierto) | **Todos los cortes responsivos medían la ventana**, pero el ancho útil es la ventana menos el rail (52) y el índice (250): a 1024 la columna mide 674 y ninguna `@media (max-width: 900px)` disparaba. El plan quedaba en dos columnas de 300 px con los títulos de hito partidos en tres líneas y el H1 en tres. | media | `plan-pergamino-1024-antes.png` | corregido · `container-type: inline-size` en las raíces de vista + `@container` (`ui.module.css:227`, `PlanView.module.css:354`, `HomeView.module.css:202`, `QuizzesView`, `QuizView`, `SessionView`, `mine`); `reviewGrid` pasa a `auto-fit` |
| 9 | Inicio | los 3 · todos | La numeración de la tarjeta de repaso usaba `--border-2`: **1,46:1 en claustro, 1,54 en laurel, 1,58 en pergamino**. Es contenido, no un filete. | media | `inicio-pergamino-1440-antes.png` | corregido · `HomeView.module.css:362` → `--text-3` (5,6:1) |
| 10 | Paleta ⌘K | claustro · todos | El `<mark>` del resaltado heredaba `--text-3`: sobre `--hl` daba **3,61:1**, es decir el fragmento resaltado era MENOS legible que sin resaltar. | media | `paleta-claustro-1440-antes.png` | corregido · `SearchPalette.module.css:47` → `color: var(--text)` (13,5 / 12,6 / 8,3 en los tres temas) |
| 11 | Paleta ⌘K | los 3 · todos | Los fragmentos mostraban markdown crudo: `**Qué es:**`, `## Función…`, y matemática abierta por el recorte del API (`$$ F_X(x)=P…`, `$X…`). | media | `paleta-claustro-1440-antes.png` | corregido · `plainSnippet` (`SearchPalette.tsx:51`) + 3 casos nuevos en `SearchPalette.test.ts` |
| 12 | Catálogo y grafo | los 3 · todos | Al envolver, la **segunda línea de chips volvía al margen** y quedaba 65 px a la izquierda de la primera, alineada con el rótulo «UNIDADES» en vez de con los chips. | media | `catalogo-laurel-1280-antes.png` | corregido · el rótulo sale del flujo, la fila arranca a 62 px (`CatalogView.module.css:62`, `GraphView.module.css:75`) |
| 13 | Índice (todas las vistas) | los 3 · todos | Cada división abierta aporta un enlace **«Ver la unidad completa»** con nombre accesible idéntico y destino distinto (el detector lo marcó en 204 de las 324 vistas; con las once divisiones abiertas son once enlaces homónimos). | media | recuento automático sobre las 324 vistas | corregido · `aria-label` que empieza por el rótulo visible (WCAG 2.5.3) · `IndexPanel.tsx:140` |
| 14 | Flashcards | los 3 · todos | Dieciocho «Estudiar todo» y varios «Estudiar nuevas (N)» homónimos entre sí (mismo rótulo, distinto mazo). | media | recuento automático | corregido · `ActionLink` acepta `label`; los mazos lo pasan con el título detrás (`FlashcardsView.tsx:140-153`) |
| 15 | Grafo | los 3 · 1440-1024 | El botón flotante de 44 px tapaba de forma **permanente** las últimas filas de «Más citadas» (columna con scroll propio) y, a 1024, el control «Centrar» del zoom. | media | medición en el DOM + `grafo-claustro-1440.png` (después) | corregido · `padding-bottom: 52px` en `.side` (`GraphView.module.css:299`) y zoom a la esquina libre por debajo de 1100 (`:389`) · **pedido a F5** para la columna del lector |
| 16 | Índice, inicio, catálogo, grafo, pestañas | los 3 · todos | `divisionShort` de una división `extra` devuelve el nombre recortado, y el modelo lo compone como «corto · nombre»: sale **«Comple. · Complementos Matemáticos»**, «Evalua. · Evaluaciones», «Transv. · Transversales». Tartamudea y obliga a recortar en el panel de 250. | media | `inicio-pergamino-1440-antes.png` | **pendiente · fuera de ownership** (`features/subject/model.ts`) — diff exacto abajo |
| 17 | Flashcards | los 3 · todos | `.cardHead` sin alto mínimo: el título de un mazo CON chip de unidad bajaba 7 px respecto del de sus vecinos de la misma fila. | media | `flashcards-laurel-1440-antes.png` | corregido · `FlashcardsView.module.css:36` |
| 18 | Apuntes, favoritos, inicio, división, landing, quiz, sesión, cabecera | los 3 · todos | Objetivos por debajo de 24 px: `noteAction` 21, `noteTitle` 20, `wikiLink` 16, `select` de cuatrimestre 22, conmutador de cuatrimestre 22, `todayLink` 21, `todayMore` 15, `sourcesHead` 14, conmutador de tema 21,8 a 390. Los campos de búsqueda del catálogo y de la paleta tenían 40/48 px de casco pero solo la línea de texto respondía. | media | recuento automático | corregido · `mine:60,264`, `HomeView:284,303`, `DivisionView:114`, `SemesterSection:89`, `SubjectCard:227`, `QuizView`/`SessionView` `.wikiLink`, `CatalogView:51`, `SearchPalette` `.input` (`align-self: stretch`) |
| 19 | Quiz, sesión, división, estados | los 3 · todos | Sin `:focus-visible` propio: «Otro quiz» (`.secondary`), «Ver en el wiki» (`.wikiLink` en quiz y sesión), «← Quizzes/Mazos» (`.back`), «FUENTES · N» (`.sourcesHead`), la acción de las tarjetas de estado. Quedaba el anillo por defecto del navegador, ajeno al sistema. | media | `quiz-pergamino-1440-antes.png` | corregido · `QuizView:222`+, `SessionView`, `DivisionView`, `States` |
| 20 | Pestañas de la materia | los 3 · todos | La ✕ de la pestaña activa a opacidad 0,6 daba **2,7:1** sobre la pestaña: por debajo del 3:1 que pide un componente gráfico (WCAG 1.4.11). | media | `inicio-pergamino-1440-antes.png` | corregido · 0,8 → 3,7:1 (`SubjectHeader.module.css:199`) |
| 21 | Migas (todas las vistas) | los 3 · todos | El punto separador en `--border-2`: 1,47 / 1,41 / 1,67:1. Es decorativo (`aria-hidden`), pero a ese contraste las migas se leían como una sola tira de palabras. | baja | 23 vistas por tema | corregido · `--track` (2,7-3,5:1) · `Crumbs.module.css:35` |
| 22 | Cabecera | los 3 · todos | Iconos de 12, 13, 14 y 16 px en el mismo grupo de controles: el conmutador de tema (16) se veía más grande que el buscador (14) que tiene al lado, y el «+» de pestaña nueva (13) más chico que el chevrón de la tira (14). | baja | recuento automático por zona | corregido · tema 16→14 (`ThemeToggle.tsx:41`), «+» 13→14 (`SubjectHeader.tsx`). El rail queda con 18 uniforme + 10 para la marca de enlace externo, que es una insignia y no un icono |
| 23 | Atajos | los 3 · todos | Dos filas con la misma descripción palabra por palabra («⌘K → Buscar en la materia» y «/ → Buscar en la materia»). | baja | `atajos-laurel-1440-antes.png` | corregido · «Buscar en la materia (una sola tecla)» · `ShortcutsDialog.tsx:28` |
| 24 | Catálogo | los 3 · todos | La matemática en línea de un resumen (una fracción) estira la caja de línea y dos tarjetas vecinas recortan a distinta altura dentro del mismo `line-clamp`. | baja | `catalogo-laurel-1280-antes.png` | **no corregido, decisión D5-6**: acotar o recortar la fórmula se lee peor que la línea despareja |
| 25 | Índice | los 3 · ≤ 900 | El panel se posa sobre el contenido sin velo y sin cierre propio (solo el chevrón del rail). | baja | `inicio-pergamino-390.png` | **no corregido** · el modo móvil está fuera del alcance del Sprint 3 |
| 26 | Flashcards, kits, plan | los 3 · 390 | `main` desborda 33 px en horizontal dentro del shell. | baja | recuento automático | **no corregido** · mismo motivo; los `@container` del hallazgo 8 lo reducen pero no lo cierran |
| 27 | Lector | los 3 · todos | Los segmentos de posición de página miden 18,2 × 20 y «← Anterior» / «Siguiente: …» / la tarjeta de enlace 15-17 px de alto. | media | `lector-claustro-1280-antes.png` | **pedido a F5** (`ReaderView.module.css`) |
| 28 | Lector | pergamino · 1440 | El epígrafe de figura (`p.figLabel`) mide **4,46:1**, justo por debajo de 4,5. | baja | contraste medido en `lector-pergamino-1440.png` | **pedido a F5** (`markdown/` o `packages/runtime`) |
| 29 | Herramientas de la materia | los 3 · todos | Las casillas y radios del bundle de Proba miden 15 × 15. | baja | `herramienta-pergamino-1440.png` | **pedido al orquestador** · el bundle es de `examples/proba/tools/**` |
| 30 | Página no encontrada | los 3 · todos | Un 404 de red por vista (el lector pide la página inexistente antes de decidir el estado). Es el comportamiento esperado, no una falla de diseño. | baja | consola de las 12 vistas | sin acción |
| 31 | Cabecera con muchas pestañas | los 3 · todos | Con nueve pestañas abiertas, `min-width: 92px` menos los 24 px que la ✕ tiene siempre reservados dejaba **41 px de rótulo, unos cinco caracteres**: la tira decía «Tod… Pla… Kits… Fla… Gra…». | media | `pestanas-pergamino-1440.png` | corregido · `min-width: 108px` (ocho caracteres); la tira sigue desbordando y se recorre con los ‹ › · `SubjectHeader.module.css` |
| 32 | Favoritos y apuntes vacíos | los 3 · todos | El icono que ancla el estado vacío usaba `--border-2`: **1,6:1**, prácticamente invisible. | baja | `favoritos-vacio-laurel-1440.png` | corregido · `--track` · `mine.module.css` `.emptyIcon` |
| 33 | Inicio | los 3 · todos | Al hacer legible la numeración (hallazgo 9) hacía falta reservarle la esquina: `.reviewMeta` podía pasarle por debajo. | baja | `inicio-pergamino-1440.png` | corregido · `padding-right: 26px` en `.reviewMeta` |

## Resumen por severidad

| Severidad | Total | Corregidas | Pedidas a otro agente | Sin acción (decisión / fuera de alcance) |
|---|---|---|---|---|
| Alta | 3 | 3 (#1, #2, #3) | 0 | 0 |
| Media | 19 | 17 | 2 (F5 · #27 · orq. · #16) | 0 |
| Baja | 11 | 5 (#21, #22, #23, #32, #33) | 2 (F5 · #28 · orq. · #29) | 4 (#24 y #25 y #26 decisión / fuera de alcance; #30 no es una falla) |
| **Total** | **33** | **25** | **4** | **4** |

## Decisiones D5-n

| # | Decisión | Por qué | Costo de revertir |
|---|---|---|---|
| D5-1 | **El velo de los diálogos es `var(--scrim)`.** El literal `rgba(35,28,18,.42)` se elimina. | Es la única forma de que el diálogo se separe del fondo en los tres temas; además `tokens.css` prohíbe los literales. | Ninguno. |
| D5-2 | **Los cortes responsivos de las vistas de materia miden el CONTENEDOR, no la ventana** (`container-type: inline-size` + `@container`). El grafo se queda en `@media` porque su corte cambia el alto de la propia raíz de vista, y una consulta de contenedor no puede estilar a su contenedor. | El ancho útil es la ventana menos 302 px de rail e índice, y además cambia cuando se pliega el índice: un corte por ventana nunca puede acertar. Sobrevive al build (verificado en `dist/assets/*.css`). | Bajo: volver a `@media` con umbrales corridos. |
| D5-3 | **El grano de superficie de claustro se aplica a TODAS las superficies**, no solo a rail/índice/cabecera/hoja/catálogo. | Es lo que dice el comentario de `--grain-22` en `tokens.css` («tarjetas, cabeceras, hoja»); la mitad de la aplicación se veía plana al lado de la otra mitad. Se sigue la convención del repo (un bloque `:global([data-theme="claustro"])` por módulo) en vez de una utilidad global, para no introducir `composes … from global`. | Bajo: quitar 17 bloques. |
| D5-4 | **El pie de la tarjeta de materia es una rejilla de dos filas fijas** (datos arriba, acciones abajo), aunque las tarjetas sin insignia ganen ~20 px de alto. | Con una fila flexible, el filete del pie salta entre tarjetas vecinas según tengan o no `dueCount`. La alineación del filete a lo ancho de la fila vale más que los 20 px. El mockup 00 no define este pie (`Repasar`/`Plan` y `dueCount` son de los sprints 2 y 3). | Bajo. |
| D5-5 | **Los chips de división se cortan en 3 y el resto se resume en «+N»** (kits e hitos del plan). El «+N» lleva el nombre completo de las divisiones que faltan en su `title` y en un texto solo para lectores de pantalla (no en `aria-label`: en un `span` sin rol no se expone de forma fiable). | Un kit de nueve unidades desalineaba toda su fila. No se pierde información. | Bajo: quitar el `max`. |
| D5-6 | **La matemática en línea de los resúmenes del catálogo se deja como está.** | Acotarla con `max-height` la recorta y bajarle el cuerpo la vuelve ilegible; una caja de línea más alta cada tantas tarjetas molesta menos. | — |
| D5-7 | **Los nombres accesibles repetidos se desambiguan añadiendo contexto DETRÁS del rótulo visible** («Estudiar todo · Teoremas», «Ver la unidad completa: Estadística Descriptiva»), nunca reescribiéndolo. | WCAG 2.5.3 «Label in Name» exige que el nombre accesible contenga el rótulo visible; el control por voz deja de funcionar si no. | Ninguno. |
| D5-8 | **El punto separador de las migas usa `--track`.** | Es el token de «trazo que se tiene que ver» del sistema y deja el punto en 2,7-3,5:1: visible sin competir con el texto. Como es `aria-hidden`, no le aplica el 4,5:1. | Ninguno. |

## Decisiones de producto que NO tomé

1. **Modo móvil (≤ 600 px).** El índice se posa sobre el contenido sin velo ni cierre, el
   shell deja 88 px de contenido útil a 390 y `main` desborda 33 px. Está fuera del alcance
   del Sprint 3 y necesita una decisión de producto (¿rail y índice en un cajón? ¿la
   materia arranca con el índice plegado por debajo de N px?), no un ajuste de CSS.
2. **Colisión del botón flotante con el contenido.** Se cerraron las dos colisiones
   permanentes (columna del grafo y controles de zoom); el solape transitorio mientras se
   desplaza una lista es inherente a un botón flotante. Si molesta, la decisión es moverlo
   o hacerlo desaparecer al desplazar, y eso cambia el contrato de la región 11 del mockup.
3. **Rótulo de las divisiones `extra`** (hallazgo 16): la corrección propuesta es de
   `model.ts`, fuera del reparto de la ola 2.
4. **«Repasar» y «Plan» de la tarjeta de materia** no tienen más afordancia que el hover
   (decisión U26 del Sprint 1: «discretos»). Se deja como está, pero conviene confirmarlo:
   son las dos únicas acciones de la tarjeta que no se ven como acciones.
5. **La modalidad del plan (`Plan.tracks`) se dibuja ARRIBA del H1**, antes del título de
   la página. Funciona, pero invierte la jerarquía habitual (título → controles). Moverla
   es una decisión de producto sobre N0-43.

## Cambios que necesito de otros agentes

### F5 — `apps/web/src/features/subject/views/ReaderView.module.css`

```diff
@@ .noteSave:disabled
-.noteSave:disabled { opacity: 0.45; cursor: default; }
+/* N0-25: un control deshabilitado baja a 0,75 y nada más. */
+.noteSave:disabled { opacity: 0.75; cursor: default; }

@@ .segment
 .segment {
+  /* 24 px: objetivo táctil mínimo del contrato (medido 18,2 × 20). */
+  min-height: 24px;

@@ .prev / .next / .cardLink
 .prev, .next, .cardLink {
+  /* medidos 15-17 px de alto */
+  min-height: 24px;
+  display: inline-flex;
+  align-items: center;

@@ .side
 .side {
   max-height: calc(100vh - 90px);
   overflow-y: auto;
+  /* Hueco para el botón flotante de la materia: tapaba «FUENTES» sin manera
+     de sacarlo (visto a 1280 y a 1440). */
+  padding-bottom: 52px;
 }
```

Y en `markdown/markdown.module.css` o en `packages/runtime/src/styles/figures.css`, el
epígrafe de figura mide **4,46:1** sobre `--surface` en pergamino (`rgb(122,113,88)` sobre
`rgb(250,245,234)`), justo por debajo de 4,5: subirlo a `--text-3` (5,62:1) o a
`--umeta-ink`.

### Orquestador — `apps/web/src/features/subject/model.ts` (sin dueño en la ola 2)

```diff
@@ function labelOf
 function labelOf(short: string, name: string): string {
-  return short && short !== name ? `${short} · ${name}` : name;
+  /* Una división `extra` no tiene rótulo corto propio: `divisionShort` devuelve
+     el nombre recortado, y componerlo con el nombre entero tartamudea
+     («Comple. · Complementos Matemáticos») y obliga a recortar en el panel de
+     250 px. Si el corto es un prefijo del nombre, no aporta nada. */
+  if (!short || short === name) return name;
+  const stem = short.replace(/\.$/, "");
+  if (name.startsWith(stem)) return name;
+  return `${short} · ${name}`;
 }
```

`divisionShort` sigue igual: el chip corto («Comple.») se usa solo, donde sí sirve.
No hay pruebas que dependan de `label` (sí de `short`, que no cambia).

### Orquestador — `examples/proba/tools/**`

Las casillas y radios del bundle de herramientas miden 15 × 15 px. Es contenido de la
materia, no de la plataforma.

## Antes / después

Las diez correcciones más visibles, con captura de los dos estados:

| # | Antes | Después |
|---|---|---|
| 1 | `grafo-pergamino-1024-antes.png` | `grafo-pergamino-1024.png` |
| 2 | `atajos-claustro-1440-antes.png` | `atajos-claustro-1440.png` |
| 2 | `landing-dialogo-claustro-1440-antes.png` | `landing-dialogo-claustro-1440.png` |
| 3 | `landing-pergamino-390-antes.png` | `landing-pergamino-390.png` |
| 4 | `kits-claustro-1440-antes.png` | `kits-claustro-1440.png` |
| 7 | `landing-llena-pergamino-1440-antes.png` | `landing-llena-pergamino-1440.png` |
| 8 | `plan-pergamino-1024-antes.png` | `plan-pergamino-1024.png` |
| 9 | `inicio-pergamino-1440-antes.png` | `inicio-pergamino-1440.png` |
| 10 | `paleta-claustro-1440-antes.png` | `paleta-claustro-1440.png` |
| 12 | `catalogo-laurel-1280-antes.png` | `catalogo-laurel-1280.png` |
| 17 | `flashcards-laurel-1440-antes.png` | `flashcards-laurel-1440.png` |
| 5 | `flashcards-sesion-pergamino-1440-antes.png` | `flashcards-sesion-pergamino-1440.png` |
| 5 · 19 | `quiz-pergamino-1440-antes.png` | `quiz-pergamino-1440.png` |
| 5 · 27 | `lector-claustro-1280-antes.png` | `lector-claustro-1280.png` (el pedido a F5 sigue abierto) |

Todas en `design/referencias/sprint3-diseno/`.

## Verificación después de las correcciones

Segundo recorrido completo (mismas 324 vistas del recorrido principal), con el mismo
detector automático:

| métrica | antes | después |
|---|---|---|
| casos de contraste por debajo de AA | 344 | **280**, en 4 combinaciones distintas — 3 son el punto separador de las migas (decorativo, `aria-hidden`, D5-8) y 1 es `p.figLabel`, del lector (pedido a F5) |
| objetivos táctiles < 24 px | 951 | **636**, todos en `ReaderView` (pedido a F5) y en los `input` del bundle de la materia |
| desplazamiento horizontal del documento | 12 vistas | **0** |
| nombres accesibles repetidos | 468 | **180**, todos del par «enlace del rail ↔ pestaña de la cabecera», que son roles distintos (`link` y `tab`) y un lector de pantalla sí distingue |
| desbordes de caja | 948 | 948 — son el `-webkit-line-clamp` de los resúmenes (falso positivo del detector: `scrollHeight > clientHeight` es justamente lo que hace un recorte a N líneas) |

En un recorrido de comprobación sobre las 12 pantallas más tocadas × 3 temas, lo único que
queda es el punto separador de las migas: cero objetivos por debajo de 24 px y cero
desbordes de documento.

## Puertas

- `pnpm --filter @sinapsis/web typecheck` — verde.
- `pnpm --filter @sinapsis/web test` — verde (229 pruebas; 3 casos nuevos en
  `SearchPalette.test.ts`).
- `pnpm --filter @sinapsis/web build` — verde; las `@container` y los `container-type`
  sobreviven al empaquetado (verificado en `dist/assets/*.css`).
- `pnpm e2e` lo corre E5. **Ninguna spec existente se modificó**: los cambios de nombre
  accesible añaden contexto detrás del rótulo visible y ninguna spec afirma sobre el
  número de chips de división, la opacidad ni la geometría tocada.
