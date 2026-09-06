# Fidelidad con la app original de Proba — Sprint 3 (N0-46)

> Histórico: describe la arquitectura anterior al Sprint 4 (sitio estático); ver HANDOFF-sprint4.md.

Comparación página a página entre la materia **Probabilidad y Estadística** dentro de
Sinapsis (`http://localhost:5173/m/proba`) y la **app original de estudio**
(`~/Desktop/ITBA/26-1C/Proba_Obsidian/estudio`, servida en `http://localhost:4599`).

El criterio de N0-46: cada diferencia se clasifica en **INTENCIONAL** —la manda el
contrato, una decisión N0 o el artboard de `design/export/`— o en **DEFECTO**, que se
corrige. Cuando el artboard y el baseline se contradicen, **manda el artboard**: la
geometría del shell (rail 52 · panel 250 · cabecera 40 · migas 28 · hoja 840 · ancho 1120 ·
columna 248) es deliberada.

Las capturas están en `design/referencias/sprint3/`, con el patrón
`<pantalla>-<tema>-{sinapsis|baseline}[-1024][-antes|-despues].png`.

---

## 1. Alcance de la comparación

| | |
|---|---|
| Pantallas pareadas | **20** — inicio · lector (concepto, figuras, tablas) · catálogo · plan · kits · flashcards (lista y sesión) · quiz · grafo · explorador (lista y Normal) · calculadoras · asistente · taller (portada y caso) · laboratorio (antes y después de simular) · buscador de valores ⌘J |
| Temas | los 3 (`pergamino`, `laurel`, `claustro`) en las dos apps |
| Anchos | 1440 × 900 en todo; además 1024 × 768 en lector y explorador |
| Capturas | **164** archivos en `design/referencias/sprint3/` |
| Diferencias catalogadas | **34** — **25 intencionales** · **9 defectos** |
| Defectos corregidos por completo | **1** — F5-1 (matemática duplicada en herramientas e inicio) |
| Defectos mitigados dentro de ownership, con la cura fuera | **2** — F5-2 (fórmulas anchas → §4-A) y F5-3 (fórmulas de figura → §4-B) |
| Defectos enteramente fuera de ownership | **6** — §4-C(a), §4-C(b), §4-D, §4-E, §4-F, §4-G, con el diff exacto |

Método: además de la lectura visual de cada par, se midieron **estilos calculados** de los
mismos elementos en las dos apps (`fontSize`, `fontWeight`, `padding`, `background`,
`overflow`…) y se corrió un barrido automático sobre las 20 rutas de la materia buscando
desborde horizontal, marcado crudo (`[[…]]`, `$…$`, `> [!`), `.katex-error`, MathML visible
y errores de consola. Los números que aparecen abajo salen de esas mediciones, no de mirar
las capturas.

---

## 2. Tabla de diferencias

### 2.1 Shell de materia (todas las pantallas)

| pantalla | elemento | baseline | Sinapsis | veredicto | acción |
|---|---|---|---|---|---|
| todas | migas de navegación | en la misma fila que las acciones de la vista | fila propia de 28 px bajo la cabecera | **INTENCIONAL** — artboard `SubjectBoard.dc.html` (migas 28) | — |
| todas | rótulo del rail | «PROGRAMA» | «UNIDADES» | **INTENCIONAL** — sale de `division.plural` del config (N0-11) | — |
| todas | migas de una herramienta | `Resolver › Calculadoras` (sección del rail del baseline) | `Probabilidad y Estadística › Inicio › Resolver › Calculadoras` | **INTENCIONAL** — la plataforma antepone materia; los grupos SLOT los declara el config | — |
| todas | conmutador de tema | círculo relleno | icono de sol/luna | **INTENCIONAL** — chrome de la plataforma | — |
| todas | grano de fondo | textura de imprenta sobre `--bg` | idéntica | — | — |
| herramientas | relleno lateral del contenedor | 64 px | 38 px | INTENCIONAL — `ToolHost` usa el ancho `wide` (1120) del artboard | — |
| herramientas | subruta de una vista | `#/taller/markov` | `/m/proba/t/taller?arg=markov` | **INTENCIONAL** — la subruta del bundle viaja como `?arg=` (`ToolHost.tsx:39`) | — |

### 2.2 Lector

| pantalla | elemento | baseline | Sinapsis | veredicto | acción |
|---|---|---|---|---|---|
| lector | hoja | sin caja propia: el papel es el fondo de la vista | hoja `--elevated` de 840 con borde, filete superior del color de la división y `--shadow-lg` | **INTENCIONAL** — artboard (`width:840px; background:var(--elevated); border-top:2px solid {{activeColor}}; border-radius:16px; padding:22px 40px 40px`) + N0-20 | — |
| lector | H1 | `clamp(27px,3.6vw,36px)` → 36 px, `letter-spacing:-.02em` | **40 px**/1.1, `margin:6px 0 0` | **INTENCIONAL** — artboard: `font:600 40px/1.1 var(--font-display)` | — |
| lector | H2 | 21 px / 700, filete por `box-shadow` | **16,5 px** / 600, `border-bottom` | **INTENCIONAL** — artboard: `font:600 16.5px var(--font-ui)` | — |
| lector | H3 | 16,5 px / 700 sobre `--text` | 14,5 px / 600 sobre `--text-2` | **INTENCIONAL** — escala tipográfica de la plataforma, coherente con el H2 del artboard | — |
| lector | cuerpo del texto | `font-weight: 500` (heredado de `body`) | `font-weight: 400` | **INTENCIONAL** — el artboard fija `font:400 17px/1.72 var(--font-read)` | — |
| lector | medida de lectura | prosa de 739 px | prosa de **758 px** | **INTENCIONAL** — N0-20 (la hoja mide 840 también con el índice abierto) | — |
| lector | barra de progreso de la página | **dos** filas: filete por grupo de tipo + píldoras por página, con tramas rayadas para las fuentes | **una** fila de píldoras + rótulo del tipo centrado | **INTENCIONAL** — artboard (`segments` en una sola fila de 5 px) | — |
| lector | placa de fórmula: papel y filete | `--surface` (más clara que la hoja), filete `--accent` al 60 %, `padding 16px 12px`, `box-shadow: relief, shadow` | `--surface-2` (`--bg-2` en claustro), filete del color de la división, `padding 22px 26px` | **INTENCIONAL** — artboard: `background:#1a1408; border-left:3px solid {{activeColor}}; padding:22px 26px` | — |
| lector | cuerpo de la fórmula | 19,38 px (`1.14em`) | 18,7 px (`--math-scale` 1,10) | INTENCIONAL — 3,5 % de diferencia, dentro del ruido de la escala matemática | — |
| lector | **fórmula ancha** | **nunca desborda**: `refitFormulas` encoge hasta 0,78 del cuerpo y solo entonces desplaza con degradado (`.is-wide`) | **10 fórmulas cortadas sin aviso** en 8 páginas medidas (excesos de 33 a 106 px) | **DEFECTO** | **corregido en parte** — `markdown.module.css:151-172`; el resto en §4-A |
| lector | epígrafe de figura | `--font-ui` 13 px, redonda | `--font-read` 12,5 px, **cursiva** | INTENCIONAL — la cursiva serif es la voz editorial de la hoja | — |
| lector | marco de figura | `--surface-2` sobre hoja `--surface` (Δ 8/10/16) | `--surface` sobre hoja `--elevated` (Δ 3/5/7) | INTENCIONAL — misma relación (un escalón más oscuro que la hoja) con el sistema de superficies de la plataforma. Si se quisiera el contraste del baseline: `background: var(--surface-2)` en `markdown.module.css:219` | — |
| lector | rótulo sobre el epígrafe | no existe | `FIGURA · U0-FUBINI-ORDEN-DE-INTEGRACION` | **DEFECTO** — expone el identificador interno de la figura al lector | pendiente, §4-D |
| lector | **fórmulas dentro de las figuras** | compuestas con KaTeX | **LaTeX crudo** en `<code>`, y el más largo se salía de la hoja (1585 px de ancho de contenido en una hoja de 840) | **DEFECTO** | **desborde contenido** en `figures.css:87-102`; causa raíz en §4-B |
| lector | `[[#ancla\|texto]]` | resuelto como enlace interno | **13 enlaces crudos** visibles en `formulario-maestro` | **DEFECTO** | pendiente, §4-C |
| lector | `[[slug\|texto con $math$]]` | resuelto | **crudo** (23 casos en `formulario-maestro`, 4 en `formulario-va-discretas`) | **DEFECTO** | pendiente, §4-C |
| lector | wikilink | `border-bottom` de 1 px + fondo `--link-soft` al pasar | `text-decoration: underline` con `text-underline-offset: 3px` | INTENCIONAL — subrayado del artboard («un enlace subrayado») | — |
| lector | columna derecha | ÍNDICE · FUENTES · ENLAZAN AQUÍ | ÍNDICE · **APUNTES** · FUENTES · ENLAZAN AQUÍ | **INTENCIONAL** — apuntes es del Sprint 2 (N0-35) | — |
| lector | «+N ejercicios» en la línea de meta | presente | ausente | INTENCIONAL — los ejercicios del baseline no entran al bundle (ADAPTACIONES §1) | — |
| lector | índice «En esta página» | etiqueta limpia (`Leyes de De Morgan`, `… X ≥ 0`): el índice se arma del DOM ya compuesto | **marcado crudo**: `[[leyes-de-de-morgan\|Leyes de De Morgan]]`, `… $X\ge 0$`. **86 entradas en 34 páginas** | **DEFECTO** — el índice se arma de `Page.headings`, que guarda el encabezado sin componer (correcto: `headingId` depende de ese texto, N0-22) | pendiente, §4-G |
| lector | anclas del índice | funcionan | funcionan (75 anclas, **0 rotas** en `formulario-maestro`) | — | — |
| lector | consola | limpia | `Warning: Encountered two children with the same key` en `formulario-maestro` | **DEFECTO** | pendiente, §4-E |
| lector · 1024 | columna derecha | se mantiene | pasa a panel deslizante («PANEL») | **INTENCIONAL** — N0-36 | — |

### 2.3 Herramientas de la materia

| pantalla | elemento | baseline | Sinapsis | veredicto | acción |
|---|---|---|---|---|---|
| explorador · calc · taller · lab · ⌘J · inicio | **matemática** | una sola fórmula compuesta | **fórmula DUPLICADA**: la versión compuesta seguida del MathML como texto plano, y sin la tipografía de KaTeX. 72 fórmulas afectadas en calculadoras, 14 en el explorador, 5 en el laboratorio, 4 en el taller y 4 en el inicio | **DEFECTO** — `katex.min.css` solo la cargaba el trozo del lector | **corregido** en `packages/runtime/src/styles/figures.css:1-9` |
| explorador | maqueta, colores de barras, ejes, leyendas, lecturas | — | idénticos | — | — |
| calculadoras | tarjetas, chips de sección, presets, botón de copiar | — | idénticos (los presets entran en una línea porque la columna es 24 px más ancha) | — | — |
| taller | hub de casos, colores por caso, tarjetas | — | idénticos | — | — |
| taller · caso | barra «← Taller de resolución» | en la misma fila que las migas | fila propia bajo las migas de la plataforma | **INTENCIONAL** — shell (migas 28) | — |
| laboratorio | controles, histograma, curva del TCL, leyenda | — | idénticos | — | — |
| asistente | tabs, tarjetas de rama, «Empezar de nuevo» | — | idénticos | — | — |
| ⌘J | FAB, burbuja, tabs, fractiles, pasos | — | idénticos (monta en su propio host, P4-6) | — | — |

### 2.4 Vistas de plataforma (inicio, catálogo, estudio)

| pantalla | elemento | baseline | Sinapsis | veredicto | acción |
|---|---|---|---|---|---|
| inicio | orden de los bloques | hero · Progreso · REPASO DE HOY | hero · **PARA HOY** (plan + favoritos) · Progreso | **INTENCIONAL** — bloque del Sprint 2 | — |
| inicio | pista de progreso vacía | beige claro, 7 px, muy redondeada | oliva más oscura, 4 px | INTENCIONAL — tokens de la plataforma. Se anota que a 0/11 la pista lee como barra llena; es del CSS del inicio (D5), no del lector | anotado |
| catálogo | tarjeta de página | título + `U1 · Concepto`, agrupadas por tipo dentro de la unidad | tipo + título + **resumen con matemática compuesta**, sin subgrupos por tipo | **INTENCIONAL** — el resumen es dato del contrato y el artboard dibuja tarjetas de resumen | — |
| plan | modalidades | conmutador cursada/final | conmutador cursada/final | — (cierra N0-37 con `Plan.tracks`, N0-43) | — |
| kits · flashcards · quiz | — | vistas propias del Sprint 2 | — | **INTENCIONAL** — no existen como tales en el baseline o cambian de contrato | — |
| grafo | vista completa | **SÍ existe en el baseline** (`reader.js:1262-1650`, `styles.css:867-870`, `reader.css:488-525`): arrastre de nodos, encuadre automático y botón «Encajar a la vista», seis hubs rotulados, etiquetas con placa y descarte por colisión, exclusión de fuentes y metas por omisión, pista de uso, leyenda agrupada y lista textual completa | canvas con `d3-force` (N0-31 / N0-39) | **BRECHA** — la fila anterior lo daba por «sin baseline» y lo dejó fuera de la comparación; ninguna decisión N0 declara intencional suprimir arrastre, encuadre, hubs ni lista textual | 17 brechas verificadas, 16 cerradas (arrastre, encaje, hubs, etiquetas, aristas sin dirección, fuerzas, siembra determinista, lista textual, pista de uso); queda abierta la leyenda agrupada por bloques temáticos, que necesita `divisionGroups` en el contrato |

### 2.5 Temas y anchos

| pantalla | elemento | verificación | resultado |
|---|---|---|---|
| todas | `laurel` y `claustro` | 20 pantallas pareadas por tema | sin diferencias adicionales a las de `pergamino` |
| lector | contraste en `claustro` | tinta de la prosa, placa de fórmula (`--bg-2`), epígrafes, migas | legible; la placa es más oscura que en el baseline **por artboard** (`#1a1408`) |
| todas | desborde horizontal del documento | barrido sobre las 20 rutas | `scrollWidth - clientWidth = 0` en todas |
| lector · explorador | 1024 × 768 | recortes, panel deslizante, apilado de tarjetas | sin recortes; el explorador apila y el lector pliega la columna (N0-36) |

---

## 3. Defectos corregidos (dentro de ownership)

### F5-1 · La hoja de KaTeX no llegaba a las herramientas ni al inicio

**Síntoma.** Al entrar directo a cualquier vista de herramienta o al inicio de la materia,
**toda la matemática salía duplicada** —la fórmula compuesta seguida de su MathML como
texto plano— y sin la tipografía de KaTeX. Medido: `katex.min.css` cargada en
`/m/proba/p/…` y **no** cargada en `/m/proba`, `/m/proba/t/explorador` (14 fórmulas),
`/t/calc` (72), `/t/lab` (5) y `/t/taller` (4). El bloque `.katex-mathml`, que KaTeX emite
para lectores de pantalla y que esa hoja esconde, quedaba `position: static` y visible.

**Causa.** `katex/dist/katex.min.css` la importaban solo `Markdown.tsx` y `MathText.tsx`,
que viven en trozos diferidos del lector. Ninguna ruta de herramienta los carga.

**Corrección.** `packages/runtime/src/styles/figures.css:1-9` — `@import "katex/dist/katex.min.css";`.
`figures.css` ya es la hoja que el host inyecta para cualquier vista de herramienta o
figura (`ensureFigureStyles`), y `Fig.tex` compone KaTeX sobre el dibujo, así que la
dependencia es legítima. `katex` es dependencia directa de `@sinapsis/runtime`.

**Antes / después.**
`explorador-pergamino-sinapsis-antes.png` → `…-despues.png`;
`calc-pergamino-sinapsis-antes.png` → `…-despues.png`;
`lookup-pergamino-sinapsis-antes.png` → `…-despues.png`;
`inicio-pergamino-sinapsis-antes.png` → `…-despues.png`.
El «después» del explorador y de calculadoras es indistinguible de
`explorador-pergamino-baseline.png` y `calc-pergamino-baseline.png`.

**Costo.** El build de producción emite la hoja de KaTeX dos veces (`katex-*.css` 29 kB
para el lector y dentro de `figures-*.css` 35 kB para las herramientas): ~23 kB crudos,
~9 kB comprimidos, que el navegador paga una sola vez por sesión. Si D5 prefiere evitarlo,
la alternativa limpia es un import global —`import "katex/dist/katex.min.css";` en
`apps/web/src/main.tsx`— y quitar el `@import` de `figures.css`; el efecto visible es el
mismo. Queda a criterio del orquestador.

### F5-2 · Las fórmulas anchas se cortaban sin aviso

**Síntoma.** Medido sobre 8 páginas: el baseline **no deja desbordar ninguna** de sus 152
placas (encoge 13 de ellas hasta 0,78 del cuerpo con `refitFormulas` y ninguna llega a
`.is-wide`); Sinapsis dejaba **10 fórmulas cortadas** con excesos de 33 a 106 px, con
`overflow-x: auto` pero sin ninguna señal de que la fórmula siguiera.

**Corrección.** `apps/web/src/features/subject/markdown/markdown.module.css:151-172`:

* **Sangría de la placa** hacia los márgenes de la hoja
  (`margin-inline: calc(-1 * clamp(8px, 1.2vw, 17px))`, el mismo recurso de `reader.css`
  del baseline). Recupera 34 px de ancho útil (702 → 736) sin tocar la medida de lectura
  ni ensanchar la hoja: entra holgada en los 40 px de relleno lateral de `.sheet`. Solo
  para las placas que cuelgan directo de la prosa, para no romper una fórmula dentro de un
  callout o de una figura.
* **Degradado de borde sin JavaScript**: dos capas de fondo `local` (se corren con el
  contenido) tapan dos capas `scroll` (fijas a la caja), así que la señal aparece solo del
  lado que todavía tiene fórmula por ver. Es el mismo aviso que da `.katex-display.is-wide`
  en el baseline, resuelto desde la hoja de estilos.
* `scrollbar-width: thin` y `overscroll-behavior-x: contain`, como el baseline.

**Resultado.** Las placas desbordadas bajan de 10 a 9 y los excesos de 33-106 px a
29-72 px; las 9 que quedan **avisan** en vez de cortarse en seco. La paridad completa
—cero desbordes— necesita el encogido previo, que no se puede hacer desde CSS: §4-A.

**Riesgo heredado que conviene anotar.** El baseline pone `overflow: clip` en la placa
normal y solo abre el scroll en `.is-wide`, precisamente para que «el par de píxeles que
sobran del redondeo» no vuelva desplazable una placa que entra y dibuje una barra bajo cada
fórmula (comentario de `styles.css:639-643`). En la plataforma `overflow-x: auto` estaba
desde antes y no se puede acotar sin el `.is-wide` de §4-A; se dejó `scrollbar-width: thin`
para acotar el daño. En macOS —barras superpuestas— no se ve nada; en un sistema con barras
clásicas convendría revisarlo después de aplicar §4-A, que devuelve la marca y permite
volver a `overflow: clip` por omisión.

**Antes / después.** `placa-tecnica-derivadas-parciales-pergamino-sinapsis-antes.png`
(fórmula cortada en el filete, sin aviso) → `…-pergamino-sinapsis-despues.png` (34 px más
de fórmula y degradado a la derecha) → `placa-tecnica-derivadas-parciales-pergamino-baseline.png`
(la fórmula **entera**, encogida a `1.012em`).
El degradado se verificó en los tres temas —`…-claustro-sinapsis-despues.png` y
`…-laurel-sinapsis-despues.png`— y sobre una placa que **sí entra**
(`placa-que-entra-pergamino-sinapsis.png` contra `…-baseline.png`), donde las capas `local`
tapan por completo a las `scroll` y el papel se ve liso: una fórmula que entra queda
exactamente como antes.

### F5-3 · El repliegue de `Fig.tex` se salía de la hoja

**Síntoma.** Cuando `putTex` no puede componer la fórmula deja el LaTeX crudo en un
`<code>`. Como esa caja es un overlay (`position: absolute`, `white-space: nowrap`,
centrada sobre una coordenada del dibujo), una línea larga se iba muy afuera de la hoja:
medido, 1585 px de ancho de contenido en una hoja de 840 en `tecnica-integrales-dobles`.

**Corrección.** `packages/runtime/src/styles/figures.css:87-102` — `.fig-tex:has(> code)`
vuelve al flujo, debajo del lienzo, donde se lee entero y no desborda. `:has(> code)` acota
la regla **exactamente** al repliegue: con KaTeX disponible el hijo es `.katex` y la regla
no aplica, así que no cambia nada del dibujo correcto.

**Resultado.** El ancho de contenido de la prosa baja de 1585 a 775 px en
`tecnica-integrales-dobles` y de 930 a 775 en `tecnica-derivadas-parciales` (los 17 px
sobre 758 son la sangría de F5-2, deliberada).

**Antes / después.** `figura-detalle-pergamino-sinapsis-antes.png` →
`…-despues.png`, contra `figura-detalle-pergamino-baseline.png`.

> Es **contención, no cura**: la figura sigue mostrando LaTeX crudo en vez de la fórmula.
> La causa raíz está en §4-B y no es de esta ownership.

### F5-4 · Divergencia declarada de `figures.css` respecto del baseline

`packages/runtime/src/styles/figures.css` era byte a byte el del baseline (ADAPTACIONES §2).
Ahora tiene dos divergencias, las dos marcadas con `[F5]` en el código y anotadas en la
cabecera del archivo: el `@import` de KaTeX (F5-1, que el baseline no necesita porque su
`index.html` carga la librería para todo el documento) y la regla `.fig-tex:has(> code)`
(F5-3, que en el baseline nunca se dispara). Conviene reflejarlo en `ADAPTACIONES.md`
cuando P4 vuelva a tocar el bundle.

---

## 4. Defectos pendientes (fuera de ownership) — diffs propuestos

### §4-A · Enganchar `refitFormulas` en el lector → D5

`refitFormulas` (el encogido de dos pasadas del baseline) **ya está portado** en
`packages/runtime/src/markdown.ts:493` y exportado por `@sinapsis/runtime`, pero el lector
usa `react-markdown` + `rehype-katex` (N0-10) y nunca lo llama. Con esto los desbordes
pasan de 9 a 0 y la fidelidad con el baseline es exacta.

Archivo: `apps/web/src/features/subject/markdown/Markdown.tsx`

```diff
@@
-import { useMemo } from "react";
+import { useEffect, useMemo, useRef } from "react";
+import { refitFormulas } from "@sinapsis/runtime";
@@
 export const Markdown = memo(function Markdown({ body, subject, exists }: MarkdownProps) {
+  const host = useRef<HTMLDivElement>(null);
   const remarkPlugins = useMemo<PluggableList>(
     () => [remarkGfm, remarkMath, [remarkWikilinks, { subject, exists }], remarkCallouts],
     [subject, exists],
   );
 
+  /* Port del ajuste del baseline (`core.js` → `fitWideFormulas`): una placa que no
+     entra en la medida se encoge hasta 0.78 del cuerpo y recién entonces se desplaza.
+     Sin esto 9 fórmulas del wiki quedan cortadas. Se corre después de pintar y al
+     cambiar el ancho útil (plegar el índice, aparecer la barra de scroll). */
+  useEffect(() => {
+    const el = host.current;
+    if (!el) return;
+    refitFormulas(el);
+    const ro = new ResizeObserver(() => refitFormulas(el));
+    ro.observe(el);
+    return () => ro.disconnect();
+  }, [body]);
+
   return (
-    <div className={css.prose}>
+    <div className={css.prose} ref={host}>
```

`refitFormulas` ya está exportado (`packages/runtime/src/index.ts:48`), así que el cambio se
agota en este archivo. La regla `.katex-display.is-wide` no hace falta: el degradado de
F5-2 ya cubre el caso, y cuando la fórmula entra el degradado no llega a verse.

### §4-B · `window.katex` para las figuras → R4 / runtime

`packages/runtime/src/figures.ts:458` (`putTex`) compone con **`window.katex`**, que en el
baseline definía `index.html` y en la plataforma no existe (verificado:
`typeof window.katex === "undefined"` en las 3 rutas probadas, mientras `App.katex` sí es
función). Por eso las 13 fórmulas de figura de `tecnica-derivadas-parciales` (6),
`tecnica-integrales-dobles` (4) y `cadenas-de-markov` (3) salen como LaTeX crudo.

La corrección mínima —y la que deja `putTex` verbatim, que es lo que pide P4-1— es publicar
el global al instalar el runtime, igual que hacía el baseline:

Archivo: `packages/runtime/src/index.ts`

```diff
@@
+import katex from "katex";
@@
   current = runtime;
   if (typeof window !== "undefined") {
     window.App = app;
     window.M = app.M;
     window.SinapsisRuntime = runtime;
+    /* El baseline cargaba KaTeX como global desde `index.html` y los bundles lo
+       asumen: `figures.js` → `putTex` compone con `window.katex`. Sin esto las
+       fórmulas de las figuras salen como LaTeX crudo. Se publica solo si nadie
+       más lo puso, y el teardown lo retira. */
+    if (!window.katex) window.katex = katex;
   }
@@ (en currentTeardown)
     if (window.SinapsisRuntime === runtime) delete window.SinapsisRuntime;
+    if (window.katex === katex) delete window.katex;
```

Hay que declarar `katex` en el `Window` del runtime (donde ya viven `App`, `M` y
`SinapsisRuntime`). Alternativa equivalente: cambiar `putTex` para que use `A.katex`, pero
ahí se pierden las macros propias de `figures.ts` (`macros()` mezcla `MACROS` con
`A.KATEX_MACROS`) y se aparta del port verbatim.

Una vez aplicado, la regla `.fig-tex:has(> code)` de F5-3 queda como red de seguridad y no
se dispara.

### §4-C · Wikilinks que el lector no resuelve → D5

Dos formas que el baseline sí resuelve y `remarkWikilinks` deja crudas. Medido en
`formulario-maestro`: **36** wikilinks crudos contra **0** en el baseline —13 de la forma (a)
y 23 de la forma (b)—, y 113 resueltos contra 151; en `formulario-va-discretas`, 4 contra 0.

**(a) `[[#ancla|texto]]` — enlace a un encabezado de la misma página.**
`parseWikilink` ya parte bien la entrada (`slug: ""`, `anchor: "…"`), pero el transformador
solo mira el slug y cae en el camino del literal:

Archivo: `apps/web/src/features/subject/markdown/remarkWikilinks.ts`

```diff
         const { slug, anchor, text: label } = parseWikilink(inner);
         const shown = label ?? slug;
-        if (!slug) {
+        /* `[[#ancla|texto]]` es un salto DENTRO de la página, como en el baseline: no
+           tiene slug y no hace falta ninguno, alcanza con el ancla del compilador. */
+        if (!slug && anchor) {
+          out.push({
+            type: "link",
+            url: `#${headingId(anchor)}`,
+            data: { hProperties: { className: ["wikilink"] } },
+            children: [{ type: "text", value: shown || anchor }],
+          });
+        } else if (!slug) {
           out.push({ type: "text", value: m[0] });
         } else if (exists(slug)) {
```

(`headingId` ya está importado en el archivo, línea 14.)

**(b) `[[slug|Binomial $(n,p)$]]` — etiqueta con matemática.**
Es un problema de **orden de plugins**: `remarkMath` corre antes y parte el nodo de texto en
el `$`, así que el `]]` de cierre ya no está en el mismo nodo y la expresión
`/\[\[([^\]\n]+)\]\]/g` no engancha.

Archivo: `apps/web/src/features/subject/markdown/Markdown.tsx`

```diff
-    () => [remarkGfm, remarkMath, [remarkWikilinks, { subject, exists }], remarkCallouts],
+    /* Los wikilinks van ANTES que remarkMath: si la matemática corre primero, parte el
+       nodo de texto en el `$` y una etiqueta como `[[slug|Binomial $(n,p)$]]` queda sin
+       su `]]` en el mismo nodo, así que sale cruda. */
+    () => [remarkGfm, [remarkWikilinks, { subject, exists }], remarkMath, remarkCallouts],
```

Hay que volver a correr `remarkWikilinks.test.ts` y agregarle los dos casos.

### §4-D · El epígrafe de figura muestra el identificador → D5

`remarkCallouts.ts:163` — `labelFor("figura", id)` devuelve `` `Figura · ${title}` ``, y el
primer token del título de `> [!figura] id` **es** el id, así que el lector ve
`FIGURA · U0-FUBINI-ORDEN-DE-INTEGRACION`. El baseline no dibuja ningún rótulo: el epígrafe
es solo el epígrafe.

```diff
-  if (kind === "figura") return title ? `Figura · ${title}` : "Figura";
+  /* El «título» de `> [!figura] id` es el identificador del bundle, no texto para el
+     lector (el baseline no lo muestra). El rótulo se queda en la palabra sola. */
+  if (kind === "figura") return "Figura";
```

### §4-E · Claves de React repetidas en `formulario-maestro` → D5

`Warning: Encountered two children with the same key` al renderizar `formulario-maestro`
(única página de las 20 barridas que lo dispara). No tiene efecto visible hoy, pero es el
tipo de aviso que precede a un reordenamiento incorrecto.

### §4-F · Pista de progreso del inicio → D5

A 0/11 la pista vacía de cada unidad se pinta oliva oscuro y lee como barra **llena**; en el
baseline es beige claro y se distingue del relleno de un vistazo. Es del CSS del inicio de
materia, no del lector. Comparar `inicio-pergamino-sinapsis.png` con
`inicio-pergamino-baseline.png`.

### §4-G · El índice «En esta página» muestra el marcado crudo → D5

`ReaderView.tsx:286` pinta `{h.text}` tal cual. Cuando el encabezado del wiki trae un
wikilink o matemática en línea —`### [[leyes-de-de-morgan|Leyes de De Morgan]]`,
`### Esperanza por la cola (supervivencia), $X\ge 0$`— el índice muestra los corchetes y los
`$`. Barrido sobre las 35 páginas del vault con encabezados así: **86 entradas crudas en 34
páginas** (18 solo en `formulario-maestro`). El baseline no lo sufre porque arma su índice
del DOM ya compuesto.

`Page.headings.text` **tiene que seguir siendo el texto crudo**: `headingId` se calcula sobre
él y es lo que el autor del wiki escribe en `[[pagina#ancla]]` (N0-22). Verificado: las 75
anclas de `formulario-maestro` funcionan, ninguna rota. O sea que el arreglo es de
presentación y va en el lector, no en el compilador.

Archivo: `apps/web/src/features/subject/views/ReaderView.tsx`

```diff
+import { MathText } from "../components/MathText";
+
+/* Un encabezado del wiki puede traer wikilinks: el índice muestra la ETIQUETA, no el
+   marcado. `h.text` se deja intacto porque de él sale `h.id` (N0-22): esto es solo
+   presentación. La matemática en línea la compone MathText, igual que los resúmenes
+   del catálogo. */
+const WIKILINK_EN_TITULO = /\[\[([^\]\n|]+)(?:\|([^\]\n]+))?\]\]/g;
+const tocLabel = (text: string): string =>
+  text.replace(WIKILINK_EN_TITULO, (_, destino: string, etiqueta?: string) =>
+    (etiqueta ?? destino).trim(),
+  );
@@
-                    {h.text}
+                    <MathText text={tocLabel(h.text)} />
```

`MathText` ya existe (`apps/web/src/features/subject/components/MathText.tsx`), memoriza y
cachea el HTML por fórmula, así que el índice no paga por componerla en cada render.

---

## 5. Decisiones

| Id | Decisión |
|---|---|
| **F5-1** | Cuando el artboard de `design/export/` y el baseline se contradicen, **manda el artboard**: la hoja de 840, el H1 de 40 px, el H2 de 16,5 px, el papel y el filete de la placa de fórmula y la barra de progreso de una sola fila quedan como están y se documentan como intencionales, no como defectos. |
| **F5-2** | La hoja de KaTeX se carga desde `packages/runtime/src/styles/figures.css` y no desde `main.tsx`: es la única hoja que la plataforma ya inyecta para toda vista de herramienta o figura, y `Fig.tex` la necesita de todos modos. Se acepta la duplicación de ~9 kB comprimidos en el build; la alternativa global queda ofrecida en §3-F5-1 para que la adjudique el orquestador. |
| **F5-3** | El aviso de fórmula desbordada se resuelve **sin JavaScript** (capas de fondo `local` sobre `scroll`) en vez de replicar el par `.is-wide` / `.at-start` / `.at-end` del baseline. Compone con el encogido de §4-A si D5 lo engancha: si la fórmula entra, el degradado nunca se ve. |
| **F5-4** | El repliegue de `Fig.tex` se contiene con `:has(> code)` en vez de recortar `.fig-plot` o `.fig-host`: `.fig-svg` tiene `overflow: visible` a propósito (varias figuras apoyan rótulos unos píxeles fuera del viewBox) y recortar ahí les comería el rótulo. |
| **F5-5** | `figures.css` deja de ser byte a byte el del baseline. Las dos divergencias van marcadas con `[F5]` en el código y declaradas en la cabecera del archivo, para que el cotejo con el baseline siga siendo verificable. |

---

## 6. Lo que no se pudo comparar

| Qué | Por qué |
|---|---|
| Ejercicios, simulador de parcial, formularios interactivos, apuntes y favoritos del baseline (`#/ejercicios`, `#/parcial`, `#/formularios`, `#/apuntes`, `#/favoritos`) | `ejercicios.js`, `formularios.js` y su chrome **no entran al bundle** por decisión de alcance (ADAPTACIONES §1): no hay pantalla equivalente que comparar. |
| Callouts que no sean `[!figura]` | El vault de Proba usa **93** `[!figura]` y **un** `[!info]`: los siete tipos que estila `markdown.module.css` (nota, tip, intuición, ejemplo, warn, discrepancia) no tienen ni una aparición real donde cotejarse. |
| Bloques de código en la prosa | El baseline no emite ninguno en las páginas comparadas (`.doc code` ausente); no hay contra qué medir el `pre`/`code` del lector. |
| Grafo, kits, flashcards con SRS y quiz | Existen en el baseline pero con otro contrato de datos (N0-27, N0-28): la comparación sería de producto, no de fidelidad. Se capturaron los pares igual, para el registro. |
| Impresión (`@media print`) | Fuera del alcance de N0-46; el baseline tiene reglas propias que la plataforma todavía no porta. |
