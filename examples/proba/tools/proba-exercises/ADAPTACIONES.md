# `proba-exercises` — adaptaciones respecto del baseline

Segundo bundle de herramientas de **Probabilidad y Estadística (ITBA 93.24)**.
Trae las tres pantallas grandes que faltaban del baseline
`~/Desktop/ITBA/26-1C/Proba_Obsidian/estudio/`: **Ejercicios**, **Simulador de
parcial** y **Formularios** (brechas `noportado-01` … `noportado-40`).

El método es el mismo que el de `proba-tools/ADAPTACIONES.md`: **puerto
verbatim**, con las desviaciones mínimas que impone correr dentro del runtime de
la plataforma en vez del `core.js` del baseline. El baseline es de **solo
lectura**: nada de lo que sigue se cambió allá. Cada diferencia lleva en el
código el comentario `[bundle]` y está explicada acá.

---

## 1. Qué contiene el bundle

| Archivo | Origen | kB |
|---|---|---:|
| `sinapsis.tools.json` | escrito para el bundle | 1,0 |
| `data/ejercicios-data.js` | `estudio/ejercicios-data.js` — **byte a byte** | 1072,6 |
| `data/formulas-data.js` | `estudio/formulas-data.js` — **byte a byte** | 487,7 |
| `data/exam-data.js` | **generado** desde `estudio/study-data.js` | 7,8 |
| `ejercicios.js` | `estudio/ejercicios.js` (101,9 kB) | 105,7 |
| `parcial.js` | **sección 3** de `estudio/study.js` | 30,8 |
| `formularios.js` | `estudio/formularios.js` (73,6 kB) | 76,8 |
| `css/vocab.css` | **generado** desde `estudio/styles.css` + `latex.css` | 55,0 |
| `css/ejercicios.css` | **generado** desde `estudio/ejercicios.css` (43,5 kB) | 49,5 |
| `css/parcial.css` | **generado** desde las reglas `exam-*` de `estudio/study.css` | 9,4 |
| `css/formularios.css` | **generado** desde `estudio/formularios.css` (17,4 kB) | 20,4 |
| `vendor/mermaid.min.js.txt` | `estudio/vendor/mermaid.min.js` — **byte a byte** | 3235,3 |

**11 archivos, 5,0 MB** según `sinapsis tools build` (tope de `ToolPush`: 20 MB
y 400 archivos). Los dos `scripts/*.mjs` son herramientas de generación: viven
en la carpeta y el CLI **no** los sube (los reporta como «no declarados en el
manifiesto», que es lo correcto).

Se corren a mano cuando cambia el baseline:

```
node scripts/extract-exam-data.mjs   # data/exam-data.js
node scripts/wrap-css.mjs            # css/*.css
```

Los dos corpus grandes (`ejercicios-data.js`, `formulas-data.js`) se **copian**
sin tocar: los genera el baseline con `build-ejercicios.py` y `build-formulas.py`
desde el wiki, así que cuando cambian los enunciados o los formularios del wiki
hay que volver a correr esos dos scripts **allá** y volver a copiar (misma
disciplina que los generados de `proba-tools`).

## 2. Lo que el bundle NO trae

* **Flashcards y quiz** de `study.js` (secciones 1 y 2): ese material ya vive en
  la plataforma como contenido de estudio de la materia. De `study.js` entra
  solo la sección 3 —el simulador— más `buildQuizPool`, que el simulador
  necesita para su propio banco.
* **KaTeX, `figures.js`, `plot.js`, `lib-math.js`**: los aporta el runtime, como
  en `proba-tools`.
* **`core.js`** y el resto del chrome del baseline (cabecera, rail, lector,
  paleta, grafo, selector de tema).

## 3. Adaptaciones aplicadas

### (a) Datos: tres globales propios

`ejercicios.js` y `formularios.js` leen `window.EJERCICIOS` y `window.FORMULAS`
exactamente como en el baseline, y los dos corpus viajan como **scripts** del
manifiesto (no como `manifest.data`): son 1,5 MB de JSON que, declarados como
datos, habría que volver a atar a mano a esos globales sin ganar nada.

`parcial.js` es el caso interesante. En el baseline leía `window.STUDY` entero;
acá **no puede usar `App.STUDY`**, porque ese es el `study-data.json` del bundle
`proba-tools`, cuyas `DISTS` llevan funciones vivas (`f`, `domain`, `mean`,
`varc`) que no se pueden pisar. Por eso `scripts/extract-exam-data.mjs` publica
una copia propia —solo datos— en `window.EXAMEN`, con las **dos** claves que el
generador de preguntas necesita: `QUIZ` (las 15 declaradas) y `DISTS` (`id`,
`name`, `slug`, `tex.mean`, `tex.var`, de las 14 distribuciones). Con eso el
banco vuelve a ser el del baseline: **43 preguntas de opción múltiple** (15
declaradas + 28 generadas) y **136 ejercicios abiertos**, verificado en pantalla.

### (b) La unidad de una página se llama `division`

`bancoMcq()` recorta el banco por unidades (`#/parcial?u=1,2`) leyendo la unidad
de la página del wiki que explica cada pregunta. En el baseline el campo era
`p.unidad`; en el contrato de la plataforma es `p.division`, y `"meta"` es la
transversal. Se aceptan los dos nombres, así el módulo sigue valiendo contra el
dato original. **Sin esto el recorte no filtraba nada**: `?u=1,2` ofrecía las 43
preguntas en vez de 0 (`parcial.js:111-122`).

### (c) El scroller es del shell, no la ventana

El baseline daba por sentado que scrollea el documento. En la plataforma
scrollea un contenedor del shell, así que las tres funciones que mueven la
lectura —el ancla `?ej=` de ejercicios, el ancla `?f=` de formularios y la
medición de la impresión— suben desde la raíz de la vista hasta el primer
ancestro con desbordamiento vertical propio (`scrollerDe`), y caen en `window`
si no hay ninguno, que es el caso del baseline
(`ejercicios.js:727`, `ejercicios.js:2121`, `formularios.js:1516`).

En el ancla de ejercicios hay además un detalle de `A.scrollFor()`: el baseline
preguntaba por el hash y acá la dirección no viaja en el hash, así que se
pregunta por la ruta actual (`ejercicios.js:2178`).

### (d) mermaid se carga perezosamente desde los archivos del bundle

41 resoluciones traen diagramas. En el baseline mermaid era un archivo del sitio
y el script se insertaba con una ruta relativa. Acá los archivos del bundle los
sirve el API bajo su propia base y **el manifiesto no tiene ranura para un
archivo que se carga a demanda**: declararlo en `scripts` cargaría 3,3 MB en
cada entrada a cualquiera de las tres vistas. Viaja entonces como archivo suelto
—`vendor/mermaid.min.js.txt`, que el CLI sube porque no es código declarado— y
se convierte en script con un `blob:` al abrir la primera resolución que tiene un
diagrama (`ejercicios.js:573-604`): el API sirve ese archivo como `text/plain`
con `nosniff`, así que un `<script src>` directo quedaría bloqueado. La URL se
calcula al evaluarse el módulo porque `A.toolFileUrl` solo resuelve mientras
corren los scripts del bundle.

El repintado al cambiar de tema (el SVG de mermaid trae los colores incrustados)
se conserva con un `MutationObserver` sobre `data-theme`, que ahora **se
desconecta con el bundle** (`ejercicios.js:645`): si no, quedaría un observador
vivo por cada entrada a la materia.

### (e) Todo lo que se ata a `window` se retira con el bundle

`beforeprint`/`afterprint` de ejercicios, el `resize` de formularios y el
`keydown` del simulador se registran con `A.onTeardown` (brecha `herr-04`), así
que salir de la materia los retira. El `keydown` del simulador merece una nota:
el baseline recibía un evento global `app:key` que despachaba `core.js`; la
plataforma no lo tiene, y los puntos de progreso y las opciones no son
focusables, así que el listener va sobre `document` y se limpia igual
(`parcial.js:622`).

### (f) El título de la pestaña lo compone el anfitrión

Como en `proba-tools`: ninguna de las tres vistas escribe `document.title`.
Piden un rótulo con `A.setTitle(...)` y la plataforma le agrega el nombre de la
materia (brecha `herr-10`).

### (g) Migas

`A.crumbsFor` es del `core.js` del baseline y no está en el runtime. Ejercicios
y parcial escriben las suyas a mano con la misma forma del original. En
formularios, el anfitrión llega solo hasta «Formularios»: el tramo de la unidad
(«U5 · Función de V.A. y Bidimensionales», que el core agregaba solo) lo escribe
la vista, que es la única que sabe qué unidad está mostrando
(`formularios.js:698-712`).

### (h) La paleta ⌘K: el bundle ofrece, el shell decide

En el baseline la paleta armaba su propio índice de las 643 fórmulas
(`core.js:2106-2141`). Acá la paleta es del shell, así que la vista **aporta** sus
resultados con `A.registerSearchProvider` —grupo «Fórmulas», destino
`#/formularios/<u>?f=<id>`, que la propia vista resuelve— y el shell decide si
los muestra (`formularios.js:1675-1699`). Mientras la paleta no consuma los
proveedores esto no hace nada y no cuesta nada: el índice es perezoso. Ver §6.

### (i) Un enlace a la misma vista con otra consulta vuelve a dibujar

Lo único que este puerto necesitó del runtime además de las primitivas que ya
estaban. En el baseline, cualquier cambio de ruta disparaba `hashchange` y la
vista se volvía a dibujar; en la plataforma el host reinvoca la vista cuando
cambia el **argumento**, pero no cuando cambia el resto de la consulta. Con eso,
«Mi hoja» (`#/formularios?sel=1`) cambiaba la URL y dejaba el documento como
estaba: 555 casillas y «49 fórmulas» donde el original mostraba las 3 marcadas.

`App.go` ahora pide el redibujo cuando el destino es la misma vista con el mismo
argumento y otra consulta (`packages/runtime/src/compat.ts`, helper exportado
`isQueryOnlyChange`). Un cambio de **argumento** no entra: de eso sigue
encargándose el host sin desmontar, que es lo que conserva lo escrito al saltar
de sección (brecha `herr-13`). Tampoco entra un enlace al sitio donde uno ya
está, para que no borre lo cargado. Vale para cualquier bundle, no solo para
este.

### (j) CSS: acotado a `.sinapsis-tool`, salvo la impresión

`scripts/wrap-css.mjs` es el mismo de `proba-tools` (mismo analizador, mismo
reescritor de selectores, mismo criterio de vocabulario) con dos diferencias:

1. **Las reglas de impresión salen del envoltorio.** `ejercicios.css` y
   `formularios.css` traen `@media print` con selectores que apuntan a `html` /
   `body` (`html:has(.ej-doc)`, `body:has(.ej-doc) .crumbs`): son **ancestros**
   del contenedor de la vista, así que no pueden vivir dentro de
   `.sinapsis-tool { … }`. Los bloques `@media print` se emiten planos, al final
   del archivo, con el prefijo `.sinapsis-tool ` en los selectores que sí son de
   adentro y verbatim en los que empiezan por `html`/`body`. Sin esto, imprimir
   con un tema oscuro dejaba los márgenes de la hoja en negro y las migas del
   shell salían en el papel. Verificado con `emulateMedia({ media: "print" })`:
   rail, cabecera, migas y barras de la vista ocultas, fondo blanco, y los 12
   ejercicios de la colección en la hoja.
2. **`css/parcial.css` es un recorte de `study.css`**: solo las reglas `exam-*` y
   las tres que refinan las opciones de opción múltiple. Flashcards y quiz no
   entran.

`css/vocab.css` se genera igual que en `proba-tools` pero con dos secciones más
de `styles.css` —`FLASHCARDS` (el anillo y la barra de progreso que reusa el
resultado del parcial) y `QUIZ` (`.quiz-opt`, `.quiz-q`, `.quiz-opts`, que el
simulador usa para sus ítems)— y con `latex.css` entero, que es la piel de
documento que comparten las tres vistas.

---

## 4. Estado que guardan las tres vistas

Todo pasa por `A.LS`, que es `localStorage` con prefijo de materia
(`sinapsis.<materia>.rt.<clave>`). Las claves conservan el nombre del baseline a
propósito: renombrarlas por dentro sería magia invisible para quien porte la
vista.

| Clave | Vista | Forma | Qué es |
|---|---|---|---|
| `pe.exEstado` | ejercicios | `{v:1, m:{ "<id>": {e:1\|2\|3, t:"YYYY-MM-DD"} }}` | el semáforo de los 289 ejercicios (1 solo · 2 con poca ayuda · 3 con mucha ayuda) y la fecha |
| `pe.exUltimo` | ejercicios | `{u, col, id}` | «Seguir donde estaba» |
| `pe.exReso` | ejercicios | `"open"` \| `"closed"` | el interruptor «Mostrar las resoluciones» |
| `pe.exPractica` | ejercicios | `"on"` \| `"off"` | el modo práctica |
| `pe.formSel` | formularios | `{ "<id de fórmula>": 1 }` | «mi hoja» |

**Lo que convendría promover a `StudyState.toolState`** (brecha `noportado-37`):
las dos primeras y `pe.formSel`. El semáforo de 289 ejercicios y la hoja que uno
se arma para el parcial son exactamente lo que no se quiere perder al abrir la
app en otra máquina; `pe.exReso` y `pe.exPractica` son preferencias de pantalla
y pueden quedarse en el dispositivo. Forma sugerida, con la clave externa igual
al id del bundle:

```ts
// packages/contract/src/index.ts, dentro de StudyState
toolState: z.record(z.string(), z.record(z.string(), z.unknown())).default({}),
```

y en el runtime `App.toolState("proba-exercises")` con lectura sincrónica y
escritura con rebote, para que el bundle cambie `A.LS` por `A.toolState` en cinco
líneas. Con tope de tamaño en el API: el semáforo completo pesa ~14 kB.

---

## 5. Lo que quedó igual y hay que no romper

* **El semáforo es un `radiogroup` de verdad**: flechas para moverse, Espacio y
  Enter para confirmar, `tabindex` móvil y desmarcado por segundo clic **solo con
  el puntero** (`ev.detail > 0`), para no contradecir el patrón ARIA. Es el único
  control de este tipo en toda la plataforma.
* **El interruptor «Mostrar las resoluciones»** abre y cierra la colección en
  lotes con presupuesto de 40 ms por cuadro y un token de generación que cancela
  el lote en vuelo: sin él, desmarcar dejaba el documento contradiciendo al
  control.
* **El contador es honesto**: «10 de 55» calcula el denominador **sin** el filtro.
* **La búsqueda de fórmulas distingue sigla de término largo** (palabra entera
  hasta tres letras, subcadena a partir de cuatro): sin eso «IC» devolvía 193 de
  643. Verificado: 24 de 643.
* **Las tablas booktabs de distribuciones** vuelven a ecuaciones sueltas con la
  búsqueda activa, «solo esenciales», «mi hoja» o pantalla angosta, porque una
  tabla a medias miente.
* **Los avisos de fiabilidad** del enunciado (parametrizado por K, resolución
  propuesta no oficial, respuesta simbólica) viajan con el corpus: sin ellos, 12
  resoluciones no oficiales se leen como si fueran de cátedra.

---

## 6. Lo que este bundle NO puede resolver solo

Tres integraciones del baseline necesitan un punto de extensión de la
plataforma. El lado del bundle ya está escrito o es trivial de escribir; falta el
lado del shell.

1. **Ejercicios al pie de la vista de unidad** (`noportado-17`). La división la
   dibuja la plataforma. Hace falta algo como
   `App.registerDivisionSection(id, fn)` en `packages/runtime/src/compat.ts` que
   `apps/web/src/features/subject/views/DivisionView.tsx` monte al pie.
2. **Pasos de ejercicios en la barra de unidad** (`noportado-18`). Mismo punto de
   extensión aplicado a la secuencia:
   `App.registerSequenceSteps(divisionKey, fn)` consumido por `ReaderView.tsx`.
3. **Grupo «Fórmulas» en la paleta ⌘K** (`noportado-34`). El proveedor ya está
   registrado (§3-h); falta que `SearchPalette.tsx` consulte
   `runtime.searchProviders()`.

Y una cuarta, de dato y no de código: las cinco tareas «Simulacro …» de
`examples/proba/estudio/plan.json` son hoy `kind: "custom"` con `target: null`.
Con la vista publicada pueden pasar a `kind: "tool"` con `target: "parcial"`; el
recorte por unidades (`?u=1,2`) necesita además que `PlanTask` admita un
argumento de ruta.
