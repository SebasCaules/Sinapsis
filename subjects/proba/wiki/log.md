# Registro de la wiki

Registro cronológico append-only. Cada entrada empieza con:
`## [YYYY-MM-DD] <ingest|query|lint|setup> | <título>`

## [2026-05-30] setup | Inicialización del wiki
- Creada estructura de carpetas: `raw/` (+ `raw/assets/`) y `wiki/` con
  subcarpetas `fuentes/`, `conceptos/`, `distribuciones/`, `teoremas/`,
  `tecnicas/`, `formularios/`.
- Creado el schema `CLAUDE.md` (convenciones + flujos de ingesta/consulta/lint).
- Creados `index.md` y `log.md`.
- Próximo paso: descargar el material del campus ITBA y empezar a ingerir.

## [2026-05-30] descarga | Material del campus (Blackboard Ultra)
- Conectado a Chrome vía MCP al curso `_32899_1` (Comisión B, "20252Q").
- Mapeado el curso vía API interna de Blackboard: 358 nodos; 166 archivos,
  105 links externos, 10 foros, 9 tests, 4 documentos Ultra.
- **Descargados 96 documentos (≈114 MB)** a `raw/<unidad>/`, organizados por
  las 12 unidades del programa. Incluye teóricas (PDF/pptx), guías tp1–tp9 y
  19 evaluaciones (parciales, recuperatorios, finales y resoluciones).
- Método: navegación a URLs `bbcswebdav` (descarga directa con Chrome puesto en
  "Descargar PDFs") + reubicación con `raw/.dl_move.py`. `fetch`/blob bloqueado
  por CORS (CDN); iframes no disparan descarga.
- **No descargado:**
  - 68 imágenes = TODAS memes (carpetas "Memes de…"), sin valor de estudio → omitidas.
  - `ruido.wav` (audio, se abre inline) — pendiente manual.
  - `01 - Estadística Descriptiva - Introducción.txt` — dataset numérico (~200
    mediciones), se abre inline; capturado parcialmente, pendiente bajar entero.
- Próximo paso: ingerir el material al wiki (resúmenes de fuentes + páginas de
  conceptos/distribuciones/teoremas).

## [2026-05-30] ingest | Unidad 1 — Estadística Descriptiva (piloto)
- Fuentes leídas: `02 - Estadística Descriptiva - General.pdf` (44 págs) y
  `tp1_2024.pdf` (13 págs). (Falta el pptx de introducción.)
- Creadas 2 páginas de fuente: [[estadistica-descriptiva-general]],
  [[tp1-estadistica-descriptiva]].
- Creadas 8 páginas de concepto: [[estadistica-descriptiva]] (hub),
  [[poblacion-y-muestra]], [[medidas-de-tendencia-central]],
  [[medidas-de-dispersion]], [[cuartiles-y-percentiles]], [[asimetria-y-curtosis]],
  [[histograma-y-frecuencias]], [[boxplot]], [[datos-agrupados]].
- Creada 1 página de técnica: [[tecnica-datos-agrupados-interpolacion]].
- Actualizado `index.md`.
- Flag pendiente: la teórica define el signo de la curtosis ($\kappa<0$ ⇒ colas
  "más pesadas") al revés de la convención usual → anotado en
  [[asimetria-y-curtosis]] para verificar con la cátedra.
- Links forward sin página todavía: [[variable-aleatoria]], [[distribucion-normal]],
  [[inferencia-estadistica]].
- Piloto para calibrar estilo con Sebastián antes de seguir con las demás unidades.

## [2026-05-30] feedback | Calibración de estilo
- Sebastián pidió: **agregar ejercicios resueltos paso a paso (estilo parcial)** a
  cada página de concepto/técnica/distribución. Convención codificada en `CLAUDE.md`.
- Decisión: continuar la ingesta por la **Unidad 2 (Introducción a la Probabilidad)**.

## [2026-05-30] ingest | Unidad 2 — Introducción a la Probabilidad
- Fuentes leídas: `01 - Axiomas.pdf` (17), `01 - Independencia-Condicional-Bayes.pdf`
  (12), `01 - Regla de Laplace.pptx` (20 diapos, extraído con python-pptx).
  **Pendiente**: `tp2_2024.pdf` (53 págs) — lectura detallada para más ejercicios.
- Creadas 3 páginas de fuente: [[axiomas-probabilidad]], [[regla-de-laplace]],
  [[independencia-condicional-bayes]].
- Creadas 7 páginas de concepto: [[probabilidad]] (hub),
  [[espacio-muestral-y-eventos]], [[axiomas-de-probabilidad]], [[regla-de-laplace]],
  [[probabilidad-condicional]], [[independencia]], [[probabilidad-total-y-bayes]].
- Creada 1 técnica: [[tecnica-conteo-combinatoria]].
- **Ejercicios resueltos** incluidos (nueva convención): suma=8 (Laplace), 4-o-11
  (unión m.e.), dados suma≥8 (condicional), dos tiradores (independencia),
  daltónicos (Bayes), póker y cumpleaños (combinatoria).
- Actualizado `index.md`. Nuevos forward-links: [[suma-de-variables-aleatorias]],
  [[leyes-de-de-morgan|De Morgan]].

## [2026-05-30] ingest | Ingesta masiva (workflow) — unidades 3 a 9 + Complementos + Evaluaciones
- Ingesta en **paralelo** de 9 lotes de fuentes. **123 páginas nuevas** creadas
  (total del wiki ahora: 71 fuentes, 47 conceptos, 10 distribuciones, 3 teoremas,
  11 técnicas, 4 formularios).
- **Páginas creadas por lote:**
  - **U3 Variables Aleatorias Discretas (21):** 5 conceptos fundacionales
    ([[variable-aleatoria]], [[esperanza]], [[varianza]],
    [[funcion-de-distribucion-acumulada]], [[funcion-generadora-de-momentos]]),
    6 distribuciones (Bernoulli, Binomial, Geométrica, Binomial Negativa,
    Hipergeométrica, Poisson), 1 técnica ([[reconocer-distribucion-discreta]]),
    9 fuentes (slides intro + 7 apuntes manuscritos + tp3).
  - **U4 Variables Aleatorias Continuas (12):** 2 conceptos
    ([[variable-aleatoria-continua]], [[funcion-de-densidad]]), 3 distribuciones
    (uniforme continua, exponencial, normal), 1 técnica
    ([[estandarizacion-y-tabla-normal]]), 1 formulario, 5 fuentes.
  - **U5 Función de V.A. y Bidimensionales (15):** 5 conceptos
    ([[funcion-de-variable-aleatoria]], [[variables-aleatorias-bidimensionales]],
    [[covarianza-y-correlacion]], [[independencia-de-variables-aleatorias]],
    [[mezcla-de-distribuciones]]), 1 técnica, 9 fuentes.
  - **U6 Procesos Estocásticos (12):** 6 conceptos ([[procesos-estocasticos]] hub,
    proceso de Bernoulli/Poisson, relación Bernoulli-Poisson, cadenas de Markov,
    caminata aleatoria), 6 fuentes.
  - **U7 Suma de V.A. (22):** 4 conceptos ([[suma-de-variables-aleatorias]] hub,
    suma de independientes, aprox. normal de la binomial, promedio muestral),
    3 teoremas ([[teorema-central-del-limite]], [[ley-de-grandes-numeros]],
    [[desigualdad-de-chebyshev]]), 1 formulario, 14 fuentes.
  - **U8 Inferencia Estadística (17):** 4 conceptos ([[inferencia-estadistica]] hub,
    estimación puntual, intervalos de confianza, varianza muestral), 1 distribución
    ([[distribucion-t-de-student]]), 1 formulario, 11 fuentes.
  - **U9 Pruebas de Hipótesis (15):** 6 conceptos ([[prueba-de-hipotesis]] hub +
    error I/II, valor p, estadístico de prueba, prueba para media y proporción),
    1 técnica, 1 formulario, 7 fuentes.
  - **Complementos Matemáticos (6):** 3 técnicas (integrales impropias, integrales
    dobles, derivadas parciales) + 3 fuentes. unidad: 0 (sin número).
  - **Evaluaciones (3):** 1 fuente ([[evaluaciones]], catálogo de 19 archivos) +
    2 técnicas con 15 ejercicios de parcial resueltos (probabilidad y estadística).
- **Forward-links pendientes** (válidos, sin página todavía): [[distribucion-erlang]]
  (tiempo al k-ésimo evento Poisson), [[distribucion-gamma]], [[distribucion-ji-cuadrado]]
  (referida desde U8), [[distribucion-weibull]], `aproximacion-poisson-binomial`,
  `covarianza` (existe [[covarianza-y-correlacion]]), `convolucion`.
- **Discrepancias / notas relevantes a verificar:**
  - **Convención de la cátedra (U3):** la Geométrica y la Binomial Negativa cuentan
    NÚMERO DE FRACASOS (no de ensayos) → soporte $\mathbb{N}_0$, $E=q/p$ (geom.),
    $E=rq/p$ (bin. neg.). Marcado con bloques ⚠️ en sus páginas y en
    [[reconocer-distribucion-discreta]] para evitar confusión con muchos libros.
  - **t de Student (U8):** la teórica manuscrita tabula E/V de la t usando $n$ donde
    los grados de libertad reales son $n-1$; aclarado en [[distribucion-t-de-student]]
    contra la convención estándar $V(T)=\nu/(\nu-2)$, $\nu=n-1$.
  - **Integrales dobles (Compl.):** el apunte omite el factor $1/2$ al calcular la
    masa (masa=1/12 y baricentro 1/5 en vez de 1/24 y 2/5); ⚠️ en
    [[tecnica-integrales-dobles]], a confirmar con el docente.
  - **Mezclas (U5):** la varianza NO se promedia linealmente (Var(T)=1131≠1110 en el
    ejemplo); única excepción a "incorrelación≠independencia" es el caso normal conjunto.
  - **Notación N(μ,σ):** el segundo parámetro es el DESVÍO (no la varianza) en toda
    la cátedra; consistente en U7.
- **Verificación de salud del consolidador:**
  - Sin nombres de archivo duplicados dentro de cada carpeta. `regla-de-laplace.md`
    existe en `fuentes/` y en `conceptos/` (capas distintas, intencional).
  - Sin huérfanas evidentes: todos los hubs/conceptos quedan enlazados desde el index
    y entre sí; [[inferencia-estadistica]] cierra el lazo con [[poblacion-y-muestra]].
  - **Enlaces rotos detectados (slug ≠ nombre real de archivo)** — corregir en próximo
    lint:
    - `[[ley-de-grandes-numeros]]` en `conceptos/inferencia-estadistica.md` →
      debería ser `[[ley-de-grandes-numeros]]`.
    - `[[distribucion-t-de-student]]` y `[[estimacion-puntual]]` en
      `tecnicas/ejercicios-de-parcial-resueltos-estadistica.md` → reales:
      `[[distribucion-t-de-student]]` y `[[estimacion-puntual]]`.
    - `[[intervalos-de-confianza]]` en `conceptos/prueba-de-hipotesis.md` y
      `conceptos/prueba-de-hipotesis-para-la-media.md` → real:
      `[[intervalos-de-confianza]]`.
    - `[[prueba-de-hipotesis]]`, `[[funcion-de-variable-aleatoria]]`,
      `[[cadenas-de-markov]]`, `[[variables-aleatorias-bidimensionales]]` en
      `tecnicas/ejercicios-de-parcial-resueltos*.md` y `fuentes/evaluaciones.md` →
      reales: `[[prueba-de-hipotesis]]`, `[[funcion-de-variable-aleatoria]]`,
      `[[cadenas-de-markov]]`, `[[variables-aleatorias-bidimensionales]]`.
  - Sugerencias para futuras fuentes/lint: crear [[distribucion-erlang]],
    [[distribucion-gamma]], [[distribucion-ji-cuadrado]] y una página de aproximación
    Poisson de la Binomial; revisar/aclarar la convención de curtosis (flag de U1).

## [2026-05-30] lint | Correcciones post-ingesta masiva
- **8 enlaces rotos corregidos** (slugs que algunos agentes escribieron distinto del
  nombre real del archivo): `ley-de-los-grandes-numeros`→`ley-de-grandes-numeros`,
  `distribucion-t-student`→`distribucion-t-de-student`,
  `estimador-de-maxima-verosimilitud`→`estimacion-puntual`,
  `intervalo-de-confianza`→`intervalos-de-confianza`,
  `test-de-hipotesis`→`prueba-de-hipotesis`,
  `transformacion-de-variable-aleatoria`→`funcion-de-variable-aleatoria`,
  `cadena-de-markov`→`cadenas-de-markov`,
  `distribucion-conjunta`→`variables-aleatorias-bidimensionales`.
- **Ambigüedad resuelta**: había `fuentes/regla-de-laplace.md` y
  `conceptos/regla-de-laplace.md` (mismo basename → wikilink ambiguo en Obsidian).
  La fuente se renombró a `fuentes/regla-de-laplace-slides.md` y se actualizaron las
  referencias-fuente (frontmatter de [[regla-de-laplace]], [[probabilidad]],
  [[tecnica-conteo-combinatoria]] y la entrada del índice). Los `[[regla-de-laplace]]`
  conceptuales ahora resuelven sin ambigüedad al concepto.
- Verificado: **0 basenames duplicados, 0 slugs rotos** de la lista anterior.
- Quedan como forward-links válidos (sin página aún, para futuras fuentes):
  [[distribucion-erlang]], [[distribucion-gamma]], [[distribucion-ji-cuadrado]],
  [[distribucion-weibull]], `aproximacion-poisson-binomial`, [[leyes-de-de-morgan|De Morgan]].

## [2026-05-30] lint | Revisión multi-agente (overseers)
- **30 reportes de overseers** (10 unidades × 3 lentes: fidelidad matemática,
  cobertura/vacíos, estructura/enlaces/convenciones).
- **78 hallazgos consolidados** (deduplicados): **7 alta, 30 media, 41 baja**.
- Hallazgos altos: TP2 sin ingerir (U2); ji-cuadrado sin página (U8);
  datos de resumen incorrectos en [[tp7-suma-de-va]] (U7); falta técnica de
  diseño de prueba / tamaño muestral (U9); slug roto `[[distribucion-uniforme]]`
  (→ distribucion-uniforme-continua, 6 ubicaciones); pptx introductorio de U1
  sin página de fuente; árbol de probabilidades sin tratamiento propio (U2).
- Reclasificados de "roto" a forward-link pendiente válido: [[distribucion-erlang]],
  [[distribucion-gamma]], [[distribucion-ji-cuadrado]], [[distribucion-weibull]],
  [[leyes-de-de-morgan|De Morgan]], [[minimo-de-exponenciales]]. El caso `[[aproximacion-poisson-binomial]]`
  SÍ es enlace mal dirigido (el contenido ya existe en [[distribucion-poisson]]).
- Informe completo: `revision-wiki-2026-05-30.md` (archivo eliminado el 2026-06-06
  una vez aplicados los arreglos; ver entrada del 2026-06-06). No se modificó ninguna
  otra página en la revisión; los arreglos los decidió el usuario.

## [2026-05-30] lint | Aplicación de la revisión (workflow)
- Se aplicaron los arreglos derivados de la revisión multi-agente del 2026-05-30
  (78 hallazgos: 7 alta, 30 media, 41 baja), distribuidos por agentes de arreglo
  por unidad más este consolidador final.
- **14 páginas nuevas** creadas en esta corrida:
  - U1: [[estadistica-descriptiva-introduccion]] (fuente, pptx de 26 slides).
  - U2: [[tp2-calculo-de-probabilidades]] (fuente), [[arbol-de-probabilidades]],
    [[leyes-de-de-morgan]] (resuelve el forward-link `[[De Morgan]]`).
  - U3: [[teoria-de-la-decision-valor-esperado]] (técnica).
  - U4: [[distribucion-weibull]], [[tasa-de-fallas]], [[minimo-de-exponenciales]].
  - U5: [[esperanza-condicional]].
  - U7: [[distribucion-gamma]], [[distribucion-erlang]].
  - U8: [[distribucion-ji-cuadrado]].
  - U9: [[diseno-de-prueba-tamano-muestral]] (técnica).
- **7 hallazgos altos resueltos:** TP2 ingerido (U2); ji-cuadrado con página (U8);
  datos de resumen corregidos en [[tp7-suma-de-va]] (fix de doble numeración; notas
  de discrepancia 3333/3334, 3523/3524, 13529/13530); técnica de diseño de prueba /
  tamaño muestral creada (U9); slug roto `[[distribucion-uniforme]]` uniformado a
  [[distribucion-uniforme-continua]] (6 ubicaciones); pptx introductorio de U1 con
  página de fuente; árbol de probabilidades con página propia (U2).
- **Cross-links de retorno aplicados por el consolidador** (enlaces entre unidades
  que los agentes de unidad no tocaron):
  - Origen combinatorio (TP2 ej. 4) reflejado en [[distribucion-binomial]] y
    [[distribucion-hipergeometrica]], con retorno a [[tecnica-conteo-combinatoria]].
  - [[distribucion-exponencial]]: Gamma/Erlang ahora como wikilink real (caso n=1) +
    mención a [[tecnica-integrales-impropias]].
  - [[distribucion-normal]]: retorno a [[distribucion-ji-cuadrado]], a las pruebas
    ([[prueba-de-hipotesis-para-la-media]] / [[prueba-de-hipotesis]]) y a
    [[tecnica-integrales-impropias]].
  - [[distribucion-hipergeometrica]] → [[intervalos-de-confianza]] (corrección por
    población finita, TP8 ej. 24).
  - [[datos-agrupados]] → [[intervalos-de-confianza]] (IC con datos agrupados, TP8 ej. 13).
  - [[varianza-muestral]] → [[prueba-de-hipotesis-para-la-media]] (ej. 20, IC de la varianza).
  - [[inferencia-estadistica]] → [[prueba-de-hipotesis]] + dualidad IC/prueba +
    [[formulario-pruebas-de-hipotesis]].
  - [[distribucion-t-de-student]] → [[prueba-de-hipotesis-para-la-media]] y
    [[diseno-de-prueba-tamano-muestral]].
  - Complementos Matemáticos: [[funcion-de-densidad]],
    [[funcion-de-distribucion-acumulada]] y [[variables-aleatorias-bidimensionales]]
    ahora enlazan de retorno a [[tecnica-integrales-impropias]],
    [[tecnica-integrales-dobles]] y/o [[tecnica-derivadas-parciales]];
    [[formulario-va-continuas]] menciona la técnica de integrales impropias.
- **Index actualizado**: las 14 páginas nuevas catalogadas en su categoría/unidad.
  Lista de pendientes vaciada — los forward-links [[distribucion-erlang]],
  [[distribucion-gamma]], [[distribucion-ji-cuadrado]], [[distribucion-weibull]],
  [[minimo-de-exponenciales]] y [[leyes-de-de-morgan|De Morgan]] ya tienen página propia.
- **CLAUDE.md**: documentada la convención del campo `unidad` (1-9 unidades del
  programa, `0` Complementos Matemáticos, `eval` Evaluaciones).
- **Verificación final**: 0 basenames duplicados; 0 slugs rotos conocidos
  (`distribucion-uniforme` pelado, `covarianza` pelado, etc.); todas las páginas de
  severidad alta existen.

## [2026-06-06] build | App de estudio HTML + borrado de la revisión
- **Eliminado** `wiki/revision-wiki-2026-05-30.md` a pedido del usuario (sus hallazgos
  ya fueron aplicados; ver entradas del 2026-05-30). Actualizada la referencia colgante
  en este log.
- **Creada** `estudio/` — aplicación web autónoma de estudio (un solo `index.html` que
  se abre con doble clic, sin servidor ni internet). Cubre end-to-end las 9 unidades +
  Complementos + Evaluaciones. Features: lector con KaTeX y wikilinks navegables,
  backlinks, TOC, búsqueda global (Cmd+K), modo claro/oscuro, flashcards con repetición
  espaciada, quizzes, mazo de ejercicios resueltos con solución revelable, explorador
  interactivo de distribuciones (PMF/PDF en vivo), calculadora de la tabla normal Φ y
  fractiles, asistente "¿qué distribución/prueba uso?", grafo de conexiones, panel de
  progreso, favoritos y notas personales. Todo el contenido se genera desde `wiki/`
  con `estudio/build.py` (regenerable). KaTeX y marked vendorizados en `estudio/vendor/`.

## [2026-06-06] lint | Auditoría multi-agente de la app + pulido sin emojis
- **Auditoría de 8 agentes paralelos** (estética, tipografía, accesibilidad, lector,
  matemática, features, plataforma, copy) sobre `estudio/`. Matemática: 0 hallazgos
  (las 14 distribuciones pasaron verificación numérica). Total 36 hallazgos aplicados.
- **App**: eliminados todos los emojis (diseño sobrio); foco de teclado visible (WCAG
  2.4.7); contraste AA en tema claro (--text-3, callouts good/warn); wikilinks de ancla
  `[[#Heading]]` ahora navegables; TOC sin contaminación de KaTeX; fuga de listeners del
  grafo y del scroll-spy corregidas; tipografía H1 unificada; tabular-nums; tokens de
  radio/ sombra de control; persistencia de tema arreglada; extractor de ejercicios
  restringido (98 reales, 0 prosa, 96 con solución revelable); quiz ahora con E[X] y V(X).
- **Wiki (contenido)**: se agregó el marcador `**Resolución.**` a 3 ejercicios de bloque
  único para separar enunciado/solución en la app sin spoilear: [[axiomas-de-probabilidad]]
  (dados 4 o 11), [[leyes-de-de-morgan]] (grupo sanguíneo 0⁻), [[tecnica-conteo-combinatoria]]
  (cumpleaños). Regenerado `estudio/data.js`.

## [2026-06-06] build | Rework de diseño de la app (paleta + grafo)
- **Nueva dirección estética "almanaque científico"**: papel cálido + tinta (fuera el
  índigo/violeta genérico). Acento bermellón con enlaces y datos en verde-petróleo.
  Fuentes distintivas vendorizadas offline: Fraunces (display), Spectral (cuerpo serif,
  se funde con la matemática), Hanken Grotesk (UI) y JetBrains Mono (números/labels).
  Textura de grano, dots de unidad en diamante, tema claro/oscuro recalibrado.
- **Botones visibles**: los "ghost" ahora tienen fondo + borde; el tab activo del
  explorador es bermellón (arreglado el conflicto de especificidad ghost/primary).
- **Grafo reworkeado**: físicas con colisión y enfriamiento, distribución redondeada
  (no más amontonado), pan + zoom-al-cursor + drag, botones de zoom/encajar, fit-to-view,
  render on-demand (se congela al asentarse), labels legibles. Arreglado el bug de
  clic-para-navegar (se distingue clic de arrastre por distancia). Verificado en navegador.
- `estudio/vendor/fonts/` agregado (11 woff2). Sin cambios de contenido del wiki.

## [2026-06-06] lint+build | Apuntes mejorados (agentes) + features de notas + contraste
- **Mejora de contenido con 11 agentes paralelos** (uno por unidad, archivos disjuntos):
  **83 páginas** de conceptos/distribuciones/teoremas/técnicas mejoradas con una línea
  de síntesis `**En breve.**` (83 páginas), recuadros `**Intuición.**` en lenguaje llano
  (76 páginas) y enlaces cruzados reforzados — SIN tocar matemática, números ni los
  bloques de discrepancia. Varios agentes además arreglaron bugs reales de KaTeX
  (wikilinks anidados en `\text{}`/`\boxed{}`, U3 y U6). `actualizado: 2026-06-06`.
- **Fix de render (app)**: `renderMarkdown` ahora protege los dólares escapados `\$`
  (montos como `\$4`, `\$0,40`) para que no abran fórmulas espurias; se restauran como
  `$` literal en prosa y como `\$` dentro de la matemática. Verificado: **0 errores de
  KaTeX en las 161 páginas**. También se corrigieron 2 fórmulas inline que abarcaban dos
  líneas (geométrica y medidas-de-tendencia-central) pasándolas a display/una línea.
- **Ecuaciones con más contraste**: las display del lector se muestran como bloques
  destacados (fondo + borde de acento), matemática a tinta plena.
- **Apuntes personales (app)**: notas por página con vista previa markdown+KaTeX,
  contador y fecha; nueva sección **Mis apuntes** con borrador general, búsqueda,
  exportar a `.md`, copiar todo y exportar nota individual.
- Regenerado `estudio/data.js` (≈870 KB).

## [2026-06-21] build | Parcial-Para-Imprimir: 21 PDFs estilo LaTeX (apuntes + resoluciones)
- Nueva carpeta en la raíz del vault `Parcial-Para-Imprimir/` con material de estudio listo
  para imprimir, generado con un pipeline propio (HTML + CSS + Chrome/puppeteer + Mermaid +
  MathJax), estética de artículo LaTeX, fondo blanco, **Latin Modern embebida** (base64).
- **10 apuntes** (uno por unidad: U1–U9 + Complementos) consolidando todos los conceptos del
  wiki; **9 resoluciones de TP** (TP1–TP9, transcribiendo la resolución oficial de cada guía
  + selección estilo parcial marcada como propuesta); **1 documento de exámenes** (Parte A:
  parciales/finales con resolución oficial transcrita, incl. tablas por K; Parte B: exámenes
  sin resolución oficial, resueltos con el método del curso y marcados como *propuesta*);
  **00-INDICE** (portada + leyenda de colores) y **LEEME.md**.
- Orquestado con Workflow (overseer): fan-out de 21 agentes escritores + verificación
  adversarial independiente + reparación (4 docs corregidos por fidelidad). Build verde:
  **21/21 PDFs, 43/43 diagramas, 249 páginas**. Fuente reproducible en `Parcial-Para-Imprimir/_src/`.
- Nota: este material vive fuera de `wiki/`; no se cataloga en `index.md`. Lo marcado como
  *resolución propuesta* es derivado (no oficial).

## [2026-06-28] ingest+build | Propuestos de Lutzio resueltos + material nuevo del Drive
- Ingerido `raw/13-propuestos-lutzio/propuestos-lutzio.pdf` ("TODOS LOS PROPUESTOS POR LUTZIO"):
  **~86 ejercicios propuestos** por Lutzio (Lucio J. Pantazis) que recorren las 9 unidades.
  Página-fuente: [[propuestos-lutzio]]; catalogado en `index.md`.
- Generadas **9 resoluciones imprimibles** (`Parcial-Para-Imprimir/resoluciones/reso-lutzio-u1..u9`,
  reordenadas por unidad) + **1 consolidado** (`reso-lutzio-COMPLETO`, **153 págs**). Build verde:
  **9/9 PDFs, 30/30 diagramas**. Manifest, `00-INDICE` y `LEEME.md` actualizados.
- Pipeline (overseer + Workflow): 20 chunks escritos con verificación adversarial que **recalcula
  la matemática** (1ra pasada: 14 pass, 6 fix) → 2da pasada **híbrida** que cruza cada chunk con la
  **clave manuscrita de Juani GG** (por TP) y repara. Errores corregidos: caminata de la ruina del
  jugador (Diego) mal leída como sin-empate → *perezosa simétrica* (P(gana)=1/2, etc.); parámetro
  de Poisson en baterías (λt=4); fracciones de una cadena de Markov; lectura de un boxplot.
- Bajado del Drive de la cátedra (Claude-in-Chrome) a `raw/`: clave de soluciones de Juani GG por
  TP (`13-propuestos-lutzio/soluciones-juani-gg/`) + manuscrito 49pp + enunciados por TP (PNG);
  a `raw/12-evaluaciones/`: recuperatorios A/B resueltos, parcialitos TP3y4 (ComA/C/E/F) y TP8y9
  (ComA/F), ~16 parciales 2023-2025; tablas (normal/t) en `raw/tablas/`; resúmenes.
- Toda resolución es *(resolución propuesta)*: reconciliada con la clave del curso pero conviene
  verificar. Fuente reproducible: `_src/wf-lutzio.mjs`, `wf-lutzio-hybrid.mjs`, `assemble-lutzio.mjs`.

## [2026-07-01] ingest+build | Formulario Maestro (toda la materia) vía /orquesta
- Nueva página [[formulario-maestro]] en `wiki/formularios/`: **hoja de fórmulas integral** de las
  9 unidades, con el núcleo de variables aleatorias (V.A.D., V.A.C., distribuciones, Normal, función
  de v.a., bidimensionales, covarianza, suma/TCL) a full y probabilidad/procesos/descriptiva/
  inferencia como soporte compacto. 13 secciones, ~775 líneas; consolida ~70 páginas ya verificadas.
- Pipeline (overseer + Workflow `wf-formulario.mjs`): scout inline → **contrato de notación único**
  (Normal por desvío σ; geométrica/bin.neg. por fracasos; Expo por tasa) → 13 agentes generadores
  (uno por sección, leyendo solo sus fuentes) → **verificación adversarial** independiente por sección
  (re-lee la fuente, refuta/corrige; default desconfiar). Resultado: 13/13, 5 correcciones (4 baja +
  1 media: la nota de "tiempos entre eventos" del proceso de Bernoulli mezclaba "cantidad de ensayos"
  con la convención de fracasos → reconciliada a fracasos, consistente con $T_k\sim$ BinNeg).
- Spot-check del overseer: releídas a mano las 14 páginas de distribuciones + ley de varianza total;
  las **dos tablas** (discretas y continuas) coinciden 100% con el ground-truth. Edits de overseer:
  agregado el fractil $z_{0.995}=2.5758$; label "tiempo entre eventos" en Bernoulli. Integridad de
  enlaces: 155 wikilinks, 70 páginas destino, **0 rotos**. Catalogado en `index.md`.

## [2026-07-01] build | Web interactiva de los propuestos de Lutzio + PDF del formulario maestro
> Entrada **registrada retroactivamente el 2026-08-13**: el build del 30/06–01/07 quedó sin
> anotar en este log. Los números de abajo se recontaron sobre los archivos, no sobre el recuerdo.
- **Nueva página web** `Parcial-Para-Imprimir/reso-lutzio-web/` (offline, se abre con doble clic;
  KaTeX + Mermaid vendorizados): los **86 propuestos de Lutzio resueltos** (ver
  [[propuestos-lutzio]]) en acordeones por unidad y por ejercicio, enunciado + resolución
  desplegable, checkboxes con **puntaje por unidad y global** en `localStorage`.
- **Botón ⓘ por ecuación**: las **532 ecuaciones display** de los 86 ejercicios (cobertura 100%,
  86/86 ejercicios) tienen un popover con **de dónde sale** la ecuación — fórmula general o teorema
  + su especialización numérica; en bloques de varias líneas, un ítem por paso. Generado con el
  Workflow `_src/wf-lutzio-eqinfos.mjs` y ensamblado con `_src/merge-eqinfos.mjs`.
- **Desplegable "Fórmulas y teoremas"** (take-away) por ejercicio: **171 fórmulas** repartidas en
  **69 de los 86** ejercicios, con **dedup global first-occurrence** — cada fórmula figura solo en
  el primer ejercicio donde aparece, así que leídos en orden los desplegables arman el formulario
  de la materia sin repetir; si un ejercicio no aporta ninguna nueva muestra "Sin fórmulas nuevas".
  `_src/merge-takeaways.mjs` hace el dedup determinista, **audita** que ninguna key aparezca en dos
  take-aways y deja el catálogo en `_src/takeaways-catalogo.json`.
- **PDF del formulario maestro**: `Parcial-Para-Imprimir/formularios/formulario-maestro.pdf`
  (**15 págs**), compilado desde [[formulario-maestro]] con el pipeline de `_src/build.mjs`.
- Gotchas del día, ya resueltos: `<`/`>` dentro de `$...$` rompían el `innerHTML` de la web → el
  shell renderiza la matemática con KaTeX **antes** de insertar (y protege `\$`); y el
  `python3 -m http.server` cachea `data.js` (cache-bust con `?v=` sólo para probar: dejarlo escrito
  rompe la apertura por `file://`).
- Sin cambios en `wiki/`: este material vive fuera del wiki y, como el resto de
  `Parcial-Para-Imprimir/`, no se cataloga en `index.md`.

## [2026-08-13] lint | Cierre documental del build del 30/06–01/07
- Detectado al revisar pendientes: el build de arriba nunca se había registrado y la documentación
  del material impreso había quedado desfasada. Corregido:
  - `wiki/log.md`: agregada la entrada retroactiva `[2026-07-01] build` (la anterior a esta).
  - **`00-INDICE.pdf` recompilado** (`node build.mjs indice`): ahora lista la sección
    **Formulario** (`formularios/formulario-maestro`, 15 págs) y una nota sobre la versión web
    interactiva de los propuestos. Antes era del 28/06 y no mencionaba ninguno de los dos.
  - `Parcial-Para-Imprimir/LEEME.md`: agregados `formularios/` y `reso-lutzio-web/` al árbol, más
    cómo se regenera la web (`build-web.mjs` → `merge-eqinfos.mjs` → `merge-takeaways.mjs`).
  - `reso-lutzio-web/LEEME.md`: documentado el desplegable "Fórmulas y teoremas" y su build.
  - **Dato corregido**: el consolidado `reso-lutzio-COMPLETO` tiene **158 páginas**, no 153 — el
    número viejo quedó del armado previo al fix de `escMath()` del 28/06, que rebuildeó todo.
    Las entradas de log anteriores conservan el número que se registró entonces.
- Verificado tras recompilar: `00-INDICE.pdf` 3 págs, diagramas 0/0, texto con las tres altas.
- Siguen abiertos (de mayo, sin cambios): bajar `ruido.wav` y el dataset
  `01 - Estadística Descriptiva - Introducción.txt` del campus, y confirmar con la cátedra las
  discrepancias marcadas en [[asimetria-y-curtosis]] (signo de la curtosis),
  [[tecnica-integrales-dobles]] (factor $1/2$) y [[distribucion-t-de-student]] (g.l. $n$ vs $n-1$).

## [2026-08-13] lint | Las tres discrepancias "a verificar con la cátedra", resueltas
Cierra los tres flags que la entrada anterior listaba como abiertos. Ninguno necesitó preguntar:
los tres se deciden con las fuentes de la cátedra + verificación independiente.

- **Curtosis (U1) → errata de la teórica.** [[estadistica-descriptiva-general]] dice que
  $\kappa<0$ ⇒ "el peso de las colas es **mayor**" y $\kappa>0$ ⇒ "**menor**". Es al revés, por
  dos vías independientes: (1) la **guía TP1 2024** (ec. 7) define la misma $\kappa$ y aclara
  *"positivo si es alta la concentración"*; (2) evaluando la fórmula del propio apunte sobre
  distribuciones conocidas se obtiene uniforme $-1.2$, normal $0$, Laplace $+3$ — con esa
  fórmula, colas pesadas $\Rightarrow\kappa>0$, necesariamente. Actualizada
  [[asimetria-y-curtosis]] (ahora con meso/plati/leptocúrtica y el veredicto); el resto del
  wiki y las resoluciones ya usaban la convención estándar.
- **Integrales dobles (Compl.) → errata aritmética del apunte.** Releídas las páginas 3 y 5 del
  PDF manuscrito: en la masa escribe $\int xy\,dy=xy^2$ (sin el $\tfrac12$) y publica
  masa $=\tfrac1{12}$, $\bar x=\tfrac15$; dos páginas después, en el numerador de $\bar x$, sí
  usa $\frac{x^2y^2}{2}$ y obtiene $\tfrac1{60}$ — se contradice a sí mismo. Valores correctos:
  **masa $=\tfrac1{24}$ kg y baricentro $(\tfrac25,\tfrac25)$**, verificados aparte con la función
  Beta ($\int_0^1x(1-x)^2dx=B(2,3)=\tfrac1{12}$) y por consistencia física (con densidad $xy$ la
  masa se corre al centro del triángulo). [[tecnica-integrales-dobles]] ahora presenta el cálculo
  correcto y deja el del apunte anotado como errata; [[complemento-integrales-dobles]] idem.
- **t de Student (U8) → no era discrepancia, es notación.** La teórica parametriza por **tamaño
  de muestra $n$** (declara $T=\frac{\bar X_n-\mu}{S_n/\sqrt n}\sim t_{n-1}$), no por grados de
  libertad. Releídas sus tres tablas contra las fórmulas estándar con $\nu=n-1$: $\mu_T=0$ si
  $n>2$; $\sigma_T^2=\frac{n-1}{n-3}$ si $n>3$; $\kappa_T=\frac6{n-5}$ si $n>5$ — **coinciden
  exactamente**. El bloque ⚠️ de [[distribucion-t-de-student]] pasó a nota de notación con la
  tabla de equivalencia.
- **Material impreso**: recompilados `apunte-u0-complementos-matematicos` (masa/baricentro
  corregidos + errata explicada), `apunte-u1-estadistica-descriptiva` (nota de signo reescrita
  como errata, con la evidencia) y `apunte-u8-inferencia-estadistica` (de "discrepancia de
  notación" a "no hay error"). Build verde: 5/5 PDFs, 10/10 diagramas.
- **Queda pendiente sólo lo del campus**: `ruido.wav` y
  `01 - Estadística Descriptiva - Introducción.txt` siguen sin bajar — la sesión de Blackboard
  expiró y el login SSO de ITBA lo tiene que hacer Sebastián.

## [2026-09-03] ingest | Video — Datos Agrupados (clase grabada, Pantazis)
Ingerida la clase grabada ["Datos Agrupados"](https://youtu.be/iraYNo3prvo) (19:59, Dr. Lucio
Pantazis) en [[video-datos-agrupados]]. Cubre media, desvío, simetría/curtosis y — sobre todo —
mediana/cuartiles/percentiles con [[datos-agrupados|datos agrupados]] por
[[tecnica-datos-agrupados-interpolacion|interpolación]], con un ejercicio completo (tardanzas en
el subte, tabla de 11 intervalos, $n=60$) narrado paso a paso.

- **Discrepancia detectada y documentada (no de transcripción, de la propia diapositiva):** la
  diapositiva "Media con datos agrupados" [05:10] escribe $n=61$ en el denominador de
  $\bar x_{Ag}=\sum x_i f_i / n$, pero la tabla de esa diapositiva suma $f_i=60$ y el resultado
  numérico que muestra ($39{,}93$) sólo es consistente con dividir por 60 (verificado con frame:
  $2396/60=39{,}93$, $2396/61=39{,}28$). Anotado con `> ⚠️ Discrepancia` en la página, sin
  corregir silenciosamente la fuente.
- **Aclarada una sobre-afirmación del ingest inicial:** la primera versión de la página decía que
  el apunte [[estadistica-descriptiva-general]] usa "este mismo dataset (61 datos)" para su
  propio ejemplo de datos agrupados. Releído el PDF crudo: el apunte sí usa un dataset de 61
  observaciones para su ejemplo *sin agrupar* (media $40{,}02$, cercana a los $40{,}01801$ que
  cita el video), pero su ejemplo *agrupado* usa una tabla distinta (9 intervalos de ancho 3,
  27–54, $\bar x_{Ag}=39{,}95$) de la que arma este video (11 intervalos de ancho 2, 29–51,
  $\bar x_{Ag}=39{,}93$) — no es literalmente el mismo ejemplo agrupado, aunque comparte el
  escenario y probablemente el dataset de origen.
- Agregados backlinks desde [[datos-agrupados]] y [[tecnica-datos-agrupados-interpolacion]].
- Faltaba en `index.md` (sección Fuentes → Unidad 1) — agregado. (Nota: el resto de las fuentes
  `video-*` del wiki tampoco están indexadas todavía — patrón sistémico a revisar en un lint
  aparte, fuera del alcance de esta corrección puntual.)

## [2026-09-03] lint | Corrección ejercicio urna hipergeométrica (video Binomial e Hipergeométrica)
- **Error matemático corregido en `[[video-binomial-e-hipergeometrica]]`**, ejercicio resuelto
  parte (ii) sin reposición, $B\sim\mathcal H(10,4,5)$. El archivo afirmaba $E(B^2)=24/5=4{,}8$,
  $V(B)=4/5=0{,}8$ y $V(G)=64/5=12{,}8$. Recalculado por suma directa sobre la PMF y por la
  fórmula cerrada (ambos métodos, que el propio archivo ya citaba): **$E(B^2)=14/3\approx4{,}667$,
  $V(B)=2/3\approx0{,}667$, $V(G)=32/3\approx10{,}67$**. La cuenta $5\cdot0{,}4\cdot0{,}6\cdot5/9$
  que el archivo ya escribía da $2/3$, no $4/5$: el error era de resultado final, no de método.
  La conclusión cualitativa (menor varianza sin reposición) se mantiene con los valores nuevos.
- **Aporte numérico corregido y aplicado en `[[distribucion-hipergeometrica]]`** (sección
  "Relaciones con otras distribuciones"), min. 58:19 del video. Con $N=1000$, $M=400$:
  $n=5,k=0$ da $P\approx0{,}0778$ (binomial) vs. $0{,}0772$ (hipergeométrica, valores distintos,
  no "prácticamente iguales" con el mismo decimal como decía la versión anterior); $n=100,k=40$
  da $P\approx0{,}0812$ (binomial) vs. $0{,}0856$ (hipergeométrica) — ambos recalculados con
  `python3`/`math.comb`, no los decimales previos (0,0754/0,0836) que estaban desviados.

## [2026-09-03] ingest | Video — Mezcla
- Ingerida la clase grabada "Mezcla" (Pantazis, https://youtu.be/01vNiwYEhb4, 22:21). Creada
  [[video-mezcla]] en `wiki/fuentes/`.
- Aporta un ejemplo resuelto nuevo (partición de tres escenarios — uniforme, exponencial
  trasladada y normal — para los gastos diarios de un empleado), distinto del ejemplo
  subte/colectivo de [[teorica-mezcla]]; dos intuiciones nuevas (mezcla como función partida de
  análisis, y por qué mezclar normales muy separadas da varias campanas en vez de una); y la
  advertencia del docente sobre por qué la varianza no se mezcla linealmente y su uso como trampa
  de parcial.
- Actualizadas las páginas que la fuente toca: [[mezcla-de-distribuciones]] (frontmatter
  `fuentes` + enlace en la sección de la varianza y en "Ejercicios resueltos"),
  [[esperanza-condicional]], [[variables-aleatorias-bidimensionales]] y
  [[funcion-de-variable-aleatoria]] (frontmatter `fuentes` en las tres). Actualizado `index.md`
  (Unidad 5).

## [2026-09-03] ingest | Video — Uniformes y Exponenciales
- Ingerida la clase grabada "Uniformes y Exponenciales" (Pantazis,
  https://youtu.be/XwovbmRhUAI, 26:27). Creada [[video-uniformes-y-exponenciales]] en
  `wiki/fuentes/`.
- Aporta dos ejemplos resueltos completos y nuevos, no presentes en los apuntes teóricos
  ([[teorica-va-uniforme]], [[teorica-va-exponencial]]): la hora del amanecer (uniforme,
  $a=15,b=20$) y el tiempo de falla de un termómetro (exponencial, $\lambda=1/1000$, resuelto
  vía integral impropia con límite). También aporta intuiciones (por qué $E[X]$ cae en el centro
  de la uniforme, por qué la exponencial le gana en velocidad al polinomio en el límite de
  $E(T_F)$, adelanto cualitativo de la Gamma) y dos advertencias del docente (FDA lineal no
  implica densidad uniforme; sentido estricto de las desigualdades en la falta de memoria).
- **Corrección post-verificación:** la fila de la tabla "Recorrido de la clase" en [08:55] citaba
  entre comillas una frase del docente con voseo ("si sabés...") que contradecía la cita textual
  correcta ya presente en "Qué aporta sobre el apunte" (con "ustedes"/"saben"). Se re-verificó
  contra el subtítulo original (`es-orig`) del video: la transcripción real usa "saben" (ustedes),
  nunca voseo. Corregida la fila de la tabla a una paráfrasis sin comillas y afinada la cita
  textual de "Qué aporta" para que coincida más de cerca con la transcripción, con el rango de
  timestamps corregido a [09:08]–[09:18] (el rango previo, [08:55]–[09:13], marcaba el inicio del
  tema del apéndice, no el tramo exacto de la cita).
- Agregada la entrada faltante en `index.md` (Unidad 4 — Variables Aleatorias Continuas), que
  había quedado sin indexar en la ingesta original.

## [2026-09-03] lint | Corrección de fidelidad — Video Medidas de Resumen
- Verificador adversarial reportó 4 findings sobre [[video-medidas-de-resumen]]: dos de
  severidad alta/media acusando de posible fabricación o mala transcripción las cifras de
  media/desvío del subte y del colectivo (por no coincidir con `raw/02-estadistica-descriptiva/02
  - Estadística Descriptiva - General.pdf`), uno de severidad media cuestionando las cifras de
  taxi/tren/moto/bicicleta por no aparecer en ese PDF, y uno de severidad baja sobre una
  afirmación de novedad de la intuición del "equilibrio físico" de la media.
- Como `watch-work/ZT5Y83HYbwk` no existía en el scratchpad, se volvió a correr `/watch` sobre el
  video (https://youtu.be/ZT5Y83HYbwk) y se releyeron los frames relevantes (07:41, 13:59, 16:29,
  21:57, 25:53).
- **Resultado de la verificación con frames:** las cifras del "Ejercicio resuelto" (subte
  $\bar x=40.01801$, $s=4.313204$; colectivo $s=7.240922$; taxi $\gamma=1.89803$; tren
  $\gamma=-1.504807$; moto $\kappa=2.563028$; bicicleta $\kappa=-1.32002$) son transcripciones
  **exactas** de las slides "Cálculo" que el docente muestra en el video — no hay fabricación ni
  error de transcripción. Los findings de severidad alta/media que acusaban fabricación son
  **falsos positivos** en cuanto a la fidelidad video↔página.
- El problema real, distinto del que planteaba el verificador: la página afirmaba que el video
  usa "los mismos datos" que el apunte [[estadistica-descriptiva-general]], y eso es **falso** —
  el video corre con una realización de datos distinta a la del PDF (media y desvío no coinciden
  entre ambas fuentes, aunque asimetría y kurtosis del subte sí coinciden exacto, lo cual queda
  señalado como anomalía sin explicación disponible). Corregido: se reemplazó la afirmación de
  "mismos datos" por una descripción precisa (mismo enunciado/fórmulas, corrida distinta) y se
  agregó un recuadro `> ⚠️ Discrepancia` con ambos juegos de cifras.
- El finding de severidad baja sí era válido: la intuición del "equilibrio físico" de la media
  está redactada en el video casi textual a como aparece en el PDF — no es un aporte nuevo del
  video. Se quitó ese ítem de la lista de aportes y se dejó una nota aclaratoria.
- El finding sobre taxi/tren/moto/bicicleta (ausentes del PDF) se confirmó como falso positivo:
  esas cifras están en slides propias del video (sin equivalente en el PDF), consistente con lo
  que la propia página ya describía como "ejemplos nuevos" en la sección "Que aporta sobre el
  apunte". Se agregaron aclaraciones inline de que son ejemplos exclusivos del video.
- Ningún dato se propagó todavía a [[medidas-de-tendencia-central]], [[medidas-de-dispersion]] ni
  [[asimetria-y-curtosis]] (verificado con grep, sin coincidencias), así que no había nada que
  corregir en esas páginas.

## [2026-09-03] ingest | Video — TH (Proporciones)
- Se creó [[video-th-proporciones]] (clase grabada de Pantazis, 34 min,
  https://youtu.be/qLH_tPpasg0) sobre pruebas de hipótesis para una
  proporción: repaso del caso con aproximación normal ($n=150$, ejemplo de
  Ricardo y el proveedor de tornillos) y, como aporte nuevo respecto de las
  fuentes ya ingeridas, la prueba exacta con la binomial cuando $n$ es chico
  (ejercicio resuelto completo: región de rechazo, $\beta(p_1)$ y valor p con
  $n=10$).
- Esta entrada de log y la referencia en `index.md` (sección Unidad 9 —
  Pruebas de Hipótesis) habían quedado pendientes al momento de la ingesta
  original y se completan ahora — ver corrección más abajo.

## [2026-09-03] lint | Corrección — Video TH (Proporciones)
- Error de cálculo confirmado en el ejercicio resuelto de
  [[video-th-proporciones]], parte (b): el texto afirmaba
  $\beta(0.3)\approx 0.37$. Recalculado
  $\beta(0.3)=P(X_{10}\le 4\mid p=0.3)=\sum_{i=0}^{4}\binom{10}{i}0.3^i0.7^{10-i}$
  término a término: el valor correcto es $\beta(0.3)\approx 0.8498$, más del
  doble del valor original. Corregido en la página, junto con una aclaración
  de que la potencia real para detectar $p_1=0.3$ con $n=10$ es baja
  ($\approx 15\%$), no la que sugería el valor erróneo. El valor
  $\beta(0.9)\approx 0.00015$ era correcto y no se modificó.
- Se agregó la referencia faltante a [[video-th-proporciones]] en `index.md`
  (Unidad 9 — Pruebas de Hipótesis), que no se había hecho en la ingesta
  original pese a lo que exige `CLAUDE.md`.

## [2026-09-03] lint | Corrección de fidelidad — Video Histogramas
- Verificador adversarial reportó 4 findings sobre [[video-histogramas]] (clase
  "Histogramas", https://youtu.be/ZfFUYXlJ8KU): uno de severidad alta (página sin
  indexar: ausente de `index.md` y sin entrada en `log.md`, huérfana), dos de
  severidad media (frontmatter con `url`/`duracion`/`docente` en vez de
  `archivo_raw`; timestamps imprecisos en el tramo de asimetrías/colas) y uno de
  severidad media (aporte propuesto que repetía parcialmente una intuición ya
  escrita en [[histograma-y-frecuencias]]).
- Como `watch-work/ZfFUYXlJ8KU` no existía en el scratchpad, se corrió `/watch`
  sobre el video y además se extrajeron fotogramas puntuales con `ffmpeg -ss`
  sobre el `.mp4` descargado para ubicar con precisión de segundo los cuatro
  cambios de slide del tramo [10:47]–[11:31] (taxi → tren → "Colas livianas"/
  bicicleta → "Colas Pesadas"/moto).
- **Timestamps corregidos** (finding confirmado): la tabla "Recorrido de la clase"
  tenía [10:48]/[10:49] para taxi/tren y [11:13]/[11:20] para bicicleta/moto.
  Verificado contra el VTT y los frames: taxi arranca en [10:54]–[10:56] (la
  palabra "taxi" se pronuncia en [11:02]), tren en [11:14], "Colas livianas"
  (bicicleta) en [11:20] y "Colas Pesadas" (moto) en [11:29]. Confirmado además
  que **"bicicleta" y "moto" nunca se pronuncian en el audio** — solo aparecen
  escritas en el texto de la slide ("consideremos los datos de duración de viajes
  en Bicicleta/Moto") — y que el rango 15-20 intervalos se dice en [10:36]-[10:40],
  no en [10:48] como sugería la tabla original. Tabla y nota de precisión
  actualizadas en la página.
- **Aporte de "rango orientativo" reformulado** (finding confirmado): el número
  concreto (15-20 intervalos) sigue siendo un aporte real del video, pero el
  texto ya no repite la explicación del trade-off ancho/ruido que ya está en el
  callout de intuición de [[histograma-y-frecuencias]] — se aclaró que ese
  trade-off ya estaba cubierto y que lo nuevo es puntualmente el número.
- **Frontmatter revisado y confirmado correcto** (finding descartado como falso
  positivo): `url`/`duracion`/`docente` en vez de `archivo_raw` no es una
  desviación — es la misma convención ya usada de forma consistente en las otras
  fuentes de tipo video del wiki ([[video-mezcla]], [[video-cadenas-de-markov]],
  [[video-procesos-estocasticos]], y varias más creadas en esta misma tanda de
  ingesta). No hay bloques Dataview en el wiki que dependan de `archivo_raw`, así
  que no hay nada roto. Se agregó una nota aclaratoria en la página en vez de
  cambiar el esquema.
- **Orfandad resuelta** (finding confirmado, severidad alta): se agregó la entrada
  faltante en `index.md` (Unidad 1 — Estadística Descriptiva) y se propagaron los
  aportes ya redactados a las páginas de destino que la fuente dice tocar —
  [[histograma-y-frecuencias]] (por qué las barras van pegadas + heurística de
  15-20 intervalos), [[medidas-de-tendencia-central]] (advertencia: el intervalo
  modal no necesariamente contiene a la media), [[asimetria-y-curtosis]] y
  [[boxplot]] (ejemplo taxi/tren/bicicleta/moto de asimetría y peso de colas), y
  el hub [[estadistica-descriptiva]] (mención en "Fuentes de la unidad"). Las
  cinco páginas ahora enlazan a [[video-histogramas]] (frontmatter `fuentes` +
  cuerpo) y quedaron con `actualizado: 2026-09-03`.
- **Nota aparte (no corregida, fuera de alcance de este pase):** al revisar el
  índice se confirmó que la mayoría de las ~34 páginas `wiki/fuentes/video-*.md`
  del wiki no tienen entrada en `index.md` ni en `log.md` — es un problema
  sistémico de varias ingestas de video que quedaron incompletas, no exclusivo de
  esta página. Se corrigió solo lo referido a [[video-histogramas]]; el resto
  queda pendiente de un lint dedicado (varias de esas páginas ya se están
  corrigiendo en tandas paralelas, a juzgar por cambios concurrentes vistos en
  `index.md` durante esta sesión).

## [2026-09-03] lint | Corrección de fidelidad — Video VAC 2D

Un verificador adversarial descargó [[video-vac-2d]] (clase "VAC 2D",
https://youtu.be/iUQrDpW4oNA) con la skill `/watch` y comparó sus timestamps
contra la transcripción temporizada real del video. Encontró que el tramo
09:38-21:30 tenía varios desplazamientos, el más grave de más de 6 minutos y
apuntando a contenido distinto: la fila decía "[20:56] Calcula E(B)=8/3", pero
en el minuto real 20:56 el docente está terminando E(D)=8, no E(B); el cálculo
real de E(B) ocurre entre 14:38 y 15:11. Se re-descargó el video (el directorio
`watch-work/iUQrDpW4oNA` no existía todavía pese a lo que decía la tarea) y se
revisó la transcripción completa entre 09:00 y 21:00 para fijar cada timestamp
contra el contenido real:

- $k=1/16$: [09:38] → **[11:22]** (a los 09:38 recién se plantea la integral).
- Marginal $f_B(b)=b/8$ + advertencia "uniforme no implica marginal uniforme":
  [11:25] → **[13:08]**.
- $E(B)=8/3$: estaba en [20:56] (contenido equivocado); pasa a **[14:38]**, y se
  reordenó el paso dentro de "Ejercicio resuelto en clase" para que aparezca
  **antes** de la marginal de $D$ — así ocurre realmente en la clase (el docente
  calcula $E(B)$ apenas termina $f_B$, y solo después ataca $f_D$).
- Error común al plantear $f_D(d)$: [14:31] → **[15:39]**.
- $E(D)=8$: [21:30] → **[20:26]** (coincide con el minuto real en que concluye,
  liberando el [20:56] que ahora ocupa correctamente $E(B)$).
- Resultado $P(B+D\le10)=5/12$: [25:49] → **[25:40]** (ajuste menor, no
  reportado como finding pero corregido con el mismo dato de transcripción ya
  disponible).

Se dejaron sin tocar los timestamps desde [19:00] en adelante que el
verificador confirmó exactos (marginal correcta de $D$, Cov, $P(B+D\le10)$,
"insisto insisto insisto" en 24:40, generalización a $F_T$, cierre en 31:05),
así como las citas textuales de "Advertencias del docente", que ya coincidían
con precisión de segundos. La matemática, el balance de LaTeX, los wikilinks y
la ausencia de duplicación con [[variables-aleatorias-bidimensionales]] y
[[funcion-de-variable-aleatoria]] ya habían sido verificados de forma
independiente y no requirieron cambios.

## [2026-09-03] ingest | Video — TH (Desvío conocido)

- Se creó [[video-th-desvio-conocido]] (clase grabada de Pantazis, 76 min,
  https://youtu.be/Pcg9s8_qAMQ), primera clase de la unidad de pruebas de
  hipótesis: motivación con el clip de "Un cuento chino", planteo de $H_0$/$H_1$
  para la media con $\sigma$ conocido, valor crítico premuestra, error tipo II y
  curva OC, decisión post-muestra y valor p, generalización a cola derecha y
  bilateral, y la advertencia enfática de no plantear $H_0$/$H_1$ sobre el
  estadístico muestral.
- Esta entrada de log y la referencia en `index.md` (sección Unidad 9 — Pruebas
  de Hipótesis) habían quedado pendientes al momento de la ingesta original y se
  completan ahora — ver corrección más abajo.

## [2026-09-03] lint | Corrección — Video TH (Desvío conocido)

- Error matemático confirmado y auto-contradictorio en "Ejercicio resuelto",
  párrafo de $\beta(345)$: la página tenía $\beta(\mu_1)=\Phi\!\left(\frac{\bar
  x_c-\mu_1}{\sigma/\sqrt n}\right)$ (signo invertido) y calculaba
  $\beta(345)=\Phi(1{,}891)\approx 0{,}9707$, etiquetando ese número como
  "probabilidad de rechazar" y a su complemento $0{,}0293$ como $\beta(345)$ —
  exactamente al revés, y en contradicción con la propia tabla "Recorrido de la
  clase" de la misma página, que ya decía correctamente $\beta(345)\approx 2{,}9\%$.
  Se re-corrió `/watch` (el directorio `watch-work/Pcg9s8_qAMQ` no existía
  todavía) y se extrajo con `ffmpeg -ss` el fotograma de la slide exacta
  (≈37:22) donde el docente escribe la fórmula:
  $\beta(345)=1-\Phi\!\left(\frac{x_c-345}{10/\sqrt{50}}\right)\approx
  1-\Phi(1{,}89068)\approx 0{,}0293335$. La transcripción confirma además que el
  docente dice textualmente "solo el 2,9% de las veces [...] no me voy a dar
  cuenta de que la media real está por debajo" — es decir, $2{,}9\%$ es la
  probabilidad de **no detectar** (β), no de rechazar. Corregidos en la página
  la fórmula general (signo) y el desarrollo de $\beta(345)$, agregando además
  el valor de la potencia $1-\beta(345)=\Phi(1{,}89068)\approx 0{,}9707$ que
  faltaba.
- Se agregó la referencia faltante a [[video-th-desvio-conocido]] en `index.md`
  (Unidad 9 — Pruebas de Hipótesis), que no se había hecho en la ingesta
  original pese a lo que exige `CLAUDE.md`.

## [2026-09-03] lint | Corrección de fidelidad — Video Procesos Estocásticos

- Cuatro hallazgos de una verificación externa sobre
  [[video-procesos-estocasticos]], todos confirmados:
  - **Tres timestamps mal atribuidos** (desvíos de 3,5 a 5 minutos respecto
    de dónde ocurre el contenido citado, verificados contra la transcripción
    de auto-captions): la fila de la tabla "Recorrido de la clase" sobre
    procesos estacionarios decía [20:52] y el tema arranca recién en
    [24:32]; la cita textual de "Advertencias del docente" sobre la
    estacionariedad decía [24:26]-[24:32] y en realidad corresponde a
    [28:04]-[28:09] ("no no lo vamos a usar tanto... no lo vamos a usar
    casi", dicho justo después de la condición de covarianza-depende-del-
    retardo, no específicamente sobre "sentido estricto" — el docente nunca
    usa ese término); y el "Cierre del docente" del ejercicio resuelto decía
    [14:30] y la cita real ("si tuviera que ver qué pasa en el décimo
    minuto... para tres pasos sí podría mirar") es de [09:20]-[09:29].
  - **Inconsistencia aritmética confirmada** en el resultado final del
    ejercicio resuelto. Como el directorio `watch-work/eKdxFbX9re8` no
    existía, se re-corrió `/watch` y se extrajo con `ffmpeg -ss` la slide
    exacta (≈13:40) que muestra el árbol completo con todos los valores
    intermedios. Recalculando la suma ponderada de las 6 ramas no nulas con
    esos mismos valores intermedios de la slide, el resultado da
    $\approx0{,}0825$, casi exactamente la mitad de $0{,}1648$ que la slide
    reporta como resultado final — error de la fuente (probablemente del
    script que generó la slide), no de transcripción del wiki. Se agregó un
    callout `> ⚠️ Discrepancia` en la página en vez de corregir en
    silencio: se deja registrado el valor de la fuente ($0{,}1648$) junto
    con el valor verificable a partir de sus propios datos intermedios
    ($\approx0{,}0825$).

## [2026-09-03] ingest | Las 37 clases grabadas de la cátedra (22.7 h) — entrada consolidada

Entrada paraguas de la ingesta completa de los videos. Las entradas por clase de más arriba
(escritas durante la corrida) quedan como detalle; esta las enmarca y cierra la operación.

**Qué entró.** Las **37 clases grabadas** del Dr. Lucio Pantazis (YouTube público, **22.7 h**),
una página por clase en `wiki/fuentes/video-*.md`, con **50 ejercicios resueltos** reproducidos
paso a paso desde el pizarrón. Los enlaces salieron del cronograma
`Cronograma Probabilidad y Estadística 2026_Q1.xlsx` que aportó Sebastián: 228 hyperlinks a
`youtu.be` repartidos en las 6 comisiones, que colapsan a 37 videos únicos. El mapeo video→unidad
se hizo con la columna "Guías" del cronograma, no por heurística de título (un primer mapeo
automático por palabras clave confundía U4 con U5 y se descartó).

**Método.** Dos workflows con verificación adversarial. El primero (109 agentes) ingirió los 37
videos en pipeline build → verify → fix → re-verify. El segundo (19 agentes) integró los aportes
a las páginas de concepto con ownership disjunto de archivos. Estado y decisiones en
`.claude/workforce-videos/EXEC_STATE.md`.

**Cómo se miraron.** Con la skill `/watch` (transcripción `es-orig` + frames de las slides).
**996 frames leídos** en total, entre 9 y 53 por clase. Dos ajustes fueron necesarios:
- La skill pedía los subtítulos con `--sub-langs en.*`, así que bajaba la **traducción automática
  al inglés** en vez del español original — "subte" salía como "Subtech", "taxi" como "tax".
  Parcheado `~/.claude/skills/watch/scripts/download.py` para que el idioma salga de las variables
  `WATCH_SUB_LANGS`/`WATCH_SUB_PREFER`, conservando `en.*` como default.
- Presupuesto de frames calibrado midiendo la curva de saturación sobre la clase de Cadenas de
  Markov (32 min): 200 muestras→19 frames distintos, 400→26, 800→32, 1600→36. Se fijó
  `--max-frames 600`. Son slides Beamer casi estáticas: el dedup colapsa cientos de muestras a las
  ~30 slides realmente distintas.

**Qué aportan sobre lo ya ingerido.** La teoría ya estaba en el wiki (los apuntes PDF son del
mismo docente), así que la regla fue **no reescribirla**. Las páginas de video aportan los
ejercicios que resuelve en clase, las intuiciones que no están en el apunte, y las advertencias
de "esto lo tomo en el parcial". **62 aportes** se integraron a páginas de concepto,
distribuciones, teoremas y formularios; 2 se descartaron por redundantes.

**Discrepancias encontradas y documentadas** (ninguna corregida en silencio):
- [[video-datos-agrupados]]: la diapositiva "Media con datos agrupados" [05:10] escribe $n=61$
  en el denominador, pero su propia tabla suma $f_i=60$ y el resultado que muestra ($39{,}93$)
  sólo cierra dividiendo por 60. Error de la diapositiva, no de transcripción.
- [[video-medidas-de-resumen]]: media y desvío del subte no coinciden con los del apunte
  ($s=4{,}313$ vs. $4{,}792$) pese a compartir $n=61$ y enunciado — son corridas distintas de
  datos. Queda anotada además una anomalía sin explicar: $\gamma$ y $\kappa$ sí coinciden exacto
  a 7 cifras entre ambas fuentes.
- [[video-binomial-e-hipergeometrica]]: error aritmético del propio ingest, detectado por el
  verificador y corregido — $E(B^2)=14/3$, $V(B)=2/3$, no $24/5$ y $4/5$.

**Adjudicaciones de N0** (el veredicto de un verificador no es final):
- El único ROJO persistente, sobre [[video-laplace]], era **falso positivo**. El re-verificador
  sostenía que el timestamp [06:30] estaba fabricado; el frame en t≈6:26 ya muestra la slide
  "Espacios no equiprobables" y la transcripción tiene la cita "Pero ojo que acá hay un error muy
  común" en [06:30] exacto. Resuelto a favor del worker.
- 12 videos reportaron `frames: 0` en su schema, lo que parecía indicar que no se habían mirado.
  Auditados los transcripts: los 37 corrieron `/watch` y leyeron frames. Era un error de
  contabilidad del campo, no de fidelidad.

**Deuda anotada, fuera del alcance de esta ingesta:**
- **Voseo preexistente en ~19 páginas** de sesiones anteriores (`Pensá`, `tenés`, `obtenés`,
  `podés`…), que contradice la regla de español neutro. Esta corrida no introdujo ninguno nuevo;
  el problema es anterior y merece un lint propio.
- `distribucion-pareto` quedó como forward-link: el docente la usa como segundo ejemplo de
  máxima verosimilitud en [[video-metodos-de-estimacion]] y no existe página. Anotada en
  `index.md`.

## [2026-09-03] lint | Auditoría final adversarial y corrección de fidelidad (37 videos)

Cierre de la ingesta de videos. La auditoría final (5 auditores horizontales en Opus + refutación
adversarial de cada finding) reportó 44 problemas y **confirmó 26** tras refutarlos uno por uno.
Los 18 refutados eran, en su mayoría, problemas **preexistentes** que el auditor atribuía a esta
ingesta, o cuentas que no cerraban al rehacerlas.

**El hallazgo importante fue sistémico, no puntual.** En la dimensión de fidelidad, 11 de 12
páginas muestreadas tenían citas fabricadas o timestamps mal anclados. Muestrear no alcanzaba: se
verificó **cada timestamp y cada cita de las 37 páginas** contra la transcripción real del video
correspondiente. Resultado: **176 correcciones en 35 de las 37 páginas** —
**91 timestamps** re-anclados, **56 citas fabricadas** (frases entre comillas que el docente nunca
dijo, reescritas como paráfrasis o eliminadas) y **21 citas desfasadas**. Solo
[[video-vac-generales]] y [[video-th-desvio-desconocido]] estaban limpias.

Ejemplos de lo corregido:
- [[video-laplace]] atribuía al docente, entre comillas y con timestamp, "esta es una técnica muy
  útil cuando los casos se ramifican mucho". No existe en el video: la palabra "técnica" no
  aparece ni una vez. La idea sí la sostiene con otras palabras — reescrito como paráfrasis.
- [[video-axiomas]] tenía cinco filas consecutivas del recorrido corridas entre 1,4 y 3,3 minutos,
  con el timeline re-sincronizándose después (no era un desfase global del archivo).

**Errores matemáticos confirmados y corregidos:**
- [[video-laplace]] afirmaba que $P(B)$ coincide con y sin reposición, cuando la propia página
  calculaba $12/25=0{,}48$ y $12/20=0{,}6$ dos líneas antes. Corregido: los casos favorables sí
  coinciden (12), lo que cambia es el espacio muestral.
- [[video-distribucion-estacionaria-no-regulares]]: el enunciado en prosa del Caso 2 contradecía
  su propia matriz de transición; y la matriz etiquetada $\mathbb{P}^{16}$ era en realidad
  $\mathbb{P}^8$. Ambas recalculadas.
- [[cuartiles-y-percentiles]]: la fórmula de percentil general fallaba en el caso $p\cdot n$
  entero y contradecía, sin marca de discrepancia, la definición de mediana ya escrita en la
  página. Unificada.

**Además:** eliminada una sección de meta-comentario de un agente que se había filtrado a
[[video-histogramas]]; 8 pipes sin escapar que rompían tablas; 15 wikilinks partidos por saltos de
línea (Obsidian no los resuelve); 3 frontmatter con `fuentes` incompleto; y los calcos "chequeo de
sanidad" y "testear".

**Verificación de cierre:** las 37 páginas renderizan en la app de estudio, 3112 expresiones LaTeX
sin un solo error de KaTeX, cero wikilinks rotos, cero errores de consola. `data.js` regenerado y
verificado estable (200 páginas, 110 fuentes).

## [2026-09-04] lint | Rework de la app de estudio + figuras interactivas en el wiki

Ejecución por olas (workforce): 6 unidades de fundación, 19 de vistas/figuras, 12 de correcciones y pedidos
nuevos, más auditoría final. En el wiki: se agregaron ~92 callouts `> [!figura] <id>` con epígrafe en ~50
páginas de conceptos, distribuciones, teoremas y técnicas (unidades 0–9), anclados tras el heading
correspondiente y con `actualizado: 2026-09-04`. En Obsidian se ven como cajas con el epígrafe; en la app
(`estudio/`) se dibujan como figuras interactivas. Sin cambios de contenido en el texto de las páginas.

## [2026-09-04] ingest | Formulario de Complementos Matemáticos (unidad 0)

Pedido P-22 («agregar una página de formulario a las unidades que no lo tienen»), paso 1 de la ola: primera hoja de fórmulas propia para la unidad 0.

- **Nueva:** `wiki/formularios/formulario-complementos-matematicos.md` (`tipo: formulario`, `unidad: 0`, `orden: 4`, último de la unidad tras integrales impropias 1, integrales dobles 2 y derivadas parciales 3).
- **Fuentes:** [[tecnica-integrales-impropias]], [[tecnica-integrales-dobles]], [[tecnica-derivadas-parciales]].
- **Contenido:** 28 fórmulas etiquetadas en tres bloques — integrales impropias (los cinco casos de Tipo I y Tipo II más el de doble singularidad, tres referencias numéricas de convergencia/divergencia y las cuatro apariciones en probabilidad: normalización, probabilidad como área, FDA y esperanza); integrales dobles (masa, celda de Riemann, suma de Riemann, Fubini en el triángulo, los dos baricentros, probabilidad de una región, normalización conjunta y baricentro como vector de esperanzas); derivadas parciales (cociente incremental, densidad en 1D, derivada cruzada, densidad conjunta desde la FDA, Clairaut y la consecuencia de independencia). Cierra con el diccionario masa ↔ probabilidad y una sección «Cuándo usar qué» de seis líneas de reconocimiento.
- **Diseño:** hoja aditiva y autónoma; riesgo de deduplicación contra `formulario-maestro.md` nulo, porque ninguna sección del maestro mapea a la unidad 0. El maestro no se tocó.
- **Verificado:** los 34 bloques LaTeX compilan con KaTeX (`throwOnError: true`); los 11 wikilinks apuntan a páginas existentes; frontmatter YAML válido; sin voseo.
- **Pendiente del integrador:** agregar el archivo a `FILE_ORDER` en `estudio/build-formulas.py` (si no, se ignora en silencio), escribir las 28 notas en `estudio/formulas-notas.json` y correr `build-formulas.py --check` y `build.py`.

## [2026-09-04] ingest | Formulario de la unidad 1 — Estadística Descriptiva (P-22)

Nueva hoja de fórmulas [[formulario-estadistica-descriptiva|Formulario — Estadística Descriptiva]] (`unidad: 1`, `orden: 11`, último de la unidad), como parte del pedido P-22 de dar formulario propio a las unidades que no lo tenían.

- **Criterio.** Las hojas por unidad son **aditivas**: [[formulario-maestro]] queda como resumen integral de toda la materia y no se tocó. La página nueva es igualmente un formulario **completo y autónomo** de la unidad para quien la lee en Obsidian, así que repite las fórmulas centrales que ya trae el maestro §12; la app de estudio las deduplica y conserva la versión del maestro.
- **30 fórmulas** en 8 secciones: frecuencias e histograma; tendencia central; dispersión; cuartiles y percentiles; forma; datos agrupados (fórmulas ponderadas); interpolación sobre la acumulada; boxplot y outliers. Cierra con "Cuándo usar qué".
- **Aporte neto sobre el maestro** (lo que la app debería sumar): frecuencia absoluta $n_k$, relativa $f_k$, su normalización y la acumulada $F(\alpha)$ de [[histograma-y-frecuencias]]; el criterio de percentil por interpolación de [[cuartiles-y-percentiles]] ($h=p\cdot n$ y sus dos ramas); y de [[tecnica-datos-agrupados-interpolacion]] el cuartil agrupado con denominador $f_i$, la acumulada interpolada $P(x)$, la proporción $(P(b)-P(a))/n$, la moda en forma implícita y la convención del punto medio. De [[boxplot]], los bigotes $L_W$/$U_W$.
- Se trasladó a la hoja la **discrepancia** de [[cuartiles-y-percentiles]] entre el criterio de interpolación de [[video-percentilos]] y la definición de mediana para $p=0.5$ con $n$ impar (prevalece la definición de mediana).
- **Verificado:** los 65 bloques LaTeX compilan con KaTeX (`throwOnError:true`); los 10 wikilinks resuelven a archivos existentes; `orden` 1..11 en la unidad 1 sin huecos.
- **Pendiente para el integrador:** agregar el archivo a `FILE_ORDER` en `estudio/build-formulas.py` (después del maestro y de las 4 hojas actuales), cargar las notas de las 30 fórmulas en `estudio/formulas-notas.json` y correr `--check` y `build.py`.

Aparte, en [[caminata-aleatoria]] (unidad 6) quedó resuelta la convención de la caminata gaussiana: se escribe $X_n\sim N(0,\sqrt{n})$, consistente con el $N(\mu,\sigma)$ del resto del wiki, con nota de discrepancia respecto de la resolución de [[tp6-procesos-estocasticos]], que la parametriza por la varianza.

## [2026-09-04] ingest | Formulario de la unidad 2 (Probabilidad)

Pedido P-22: agregar hoja de fórmulas a las unidades que no la tenían. Se creó
[[formulario-probabilidad]] (unidad 2, `orden: 11`, último libre de la unidad).

- **Archivo nuevo:** `wiki/formularios/formulario-probabilidad.md` — 43 fórmulas en
  6 secciones (axiomas y consecuencias; conteo; condicional, árbol y regla del
  producto; probabilidad total y Bayes; independencia; fiabilidad y patrones
  clásicos) más «Cuándo usar qué».
- **Criterio aditivo:** la hoja se lee completa y autónoma en Obsidian, así que
  repite las fórmulas centrales del §1 de [[formulario-maestro]]; la app las
  deduplica por (rótulo, variante, tex) y conserva la versión del maestro. El
  aporte neto son ~20 fórmulas: permutaciones y variaciones en forma desarrollada,
  inclusión-exclusión general, identidad alternante, palomar en símbolos,
  aproximación hipergeométrica → binomial, regla del producto en la forma del
  árbol, «las aristas de un nodo suman 1», Bayes con partición binaria, las tres
  parejas de complementos independientes y su deducción, unión de independientes,
  $\emptyset$ y $S$ independientes de todo, cota del solape, fiabilidad en serie y
  en paralelo generalizadas a $n$ componentes, el caso serie-paralelo del TP2
  ej. 20, el problema del cumpleaños y «al menos uno» en $n$ ensayos.
- **Fuentes usadas:** [[axiomas-de-probabilidad]], [[leyes-de-de-morgan]],
  [[regla-de-laplace]], [[tecnica-conteo-combinatoria]],
  [[probabilidad-condicional]], [[independencia]], [[probabilidad-total-y-bayes]],
  [[arbol-de-probabilidades]], [[tp2-calculo-de-probabilidades]].
- **Verificación:** 73 bloques LaTeX compilan con KaTeX (`throwOnError: true`, 0
  fallas); los 15 wikilinks resuelven a archivos existentes; frontmatter válido;
  `orden: 11` no abre huecos en la unidad 2.
- **Pendiente del integrador:** agregar `formulario-probabilidad.md` a `FILE_ORDER`
  de `estudio/build-formulas.py` (después del maestro y de las 4 hojas actuales) y
  cargar las notas nuevas en `estudio/formulas-notas.json`, o `--check` falla.

## [2026-09-04] ingest | Formulario de la unidad 3 (V.A. discretas)

Se agrega `wiki/formularios/formulario-va-discretas.md` (`unidad: 3`, `orden: 14`), quinta
hoja por unidad del wiki, dentro del pedido P-22 ("agregar una página de formulario a las
unidades que no lo tienen"). Sigue la convención de [[formulario-va-continuas]]: callout de
técnica al inicio, secciones `##` por tema, tablas «Objeto | Fórmula» para familias y viñetas
para fórmulas sueltas.

**Contenido** (38 fórmulas en seis secciones):
- *General (v.a.d.)* — PMF, FDA, recuperación de la PMF desde la FDA, probabilidades de
  intervalo, esperanza, ley del estadístico inconsciente, linealidad, varianza, transformación
  afín, momentos y FGM.
- *Geométrica y binomial negativa — las dos convenciones* — la fila de la cátedra
  (**fracasos**, $\mathbb{N}_0$, $E=q/p$) y la de las slides de Pantazis (**ensayos**,
  $\mathbb{N}$, $E=1/p$, $E[Y^2]=(1+q)/p^2$), con la relación $Y=X+1$ y un bloque
  `> ⚠️ Discrepancia:` que documenta ambas fuentes.
- *Falta de memoria (discreta)* — $P(X\ge L+\Delta\mid X\ge L)=P(X\ge\Delta)$, extraída como
  fórmula y ya no como prosa.
- *Aproximaciones entre distribuciones* — Poisson→Binomial y su límite,
  Hipergeométrica→Binomial, varianza hipergeométrica factorizada y el factor de corrección por
  población finita.
- *Tamaño de muestra mínimo* — cota exacta binomial y cota vía Poisson.
- *Teoría de la decisión* — $E[G_k]$, el criterio $k^{*}=\arg\max_k E[G_k]$ y la ganancia por
  casos del modelo del vendedor de diarios.

Cierra con «Cuándo usar qué», seis líneas de reconocimiento enlazadas a cada distribución.
No se reproduce la tabla comparativa de las seis distribuciones discretas: sigue viviendo en
[[formulario-maestro]] §3, al que remite la introducción.

**Fuentes**: [[variable-aleatoria]], [[esperanza]], [[varianza]],
[[funcion-generadora-de-momentos]], [[distribucion-geometrica]],
[[distribucion-binomial-negativa]], [[distribucion-hipergeometrica]],
[[distribucion-poisson]], [[teoria-de-la-decision-valor-esperado]],
[[reconocer-distribucion-discreta]], [[tp3-variables-aleatorias-discretas]].

**Verificación**: los 101 bloques de matemática compilan con KaTeX (`throwOnError: true`); los
24 wikilinks resuelven a archivos existentes; `orden: 14` es el siguiente libre de la unidad 3
(1..13 sin huecos). Falta, del lado del pipeline: registrar el archivo en `FILE_ORDER` de
`estudio/build-formulas.py` y escribir las notas nuevas en `estudio/formulas-notas.json`.

## [2026-09-04] ingest | Formulario de la unidad 5 (Función de V.A. y Bidimensionales) + corrección de la caminata gaussiana

- **Pedido P-22 (hojas por unidad, aditivas).** Se creó `wiki/formularios/formulario-funcion-de-va-y-bidimensionales.md` (`unidad: 5`, `orden: 8`, último libre de la unidad), la quinta hoja por unidad junto al [[formulario-maestro]], que queda intacto como resumen integral.
- **Contenido:** 45 fórmulas en 7 tablas «Objeto | Fórmula» más 3 viñetas — función de una v.a. ($Y=g(X)$ por la FDA, monótona, no inyectiva, cambio de variable), transformación afín, simulación por transformada inversa, conjunta y marginales (discreto y continuo), condicionales y leyes de esperanza/varianza total, independencia, covarianza y correlación, y mezclas.
- **Aporte neto sobre el maestro** (inventario de la Fase 0): $\text{Var}(X/\sigma_X\pm Y/\sigma_Y)=2\pm2\rho$, el discriminante de Cauchy-Schwarz, la inversa generalizada $F_X^{\leftarrow}(u)=\min\{x:u\le F_X(x)\}$, el test del cero para descartar independencia, $E[X^2]=\sum_k E[X^2\mid M=k]P(M=k)$, la mezcla de exponenciales y la mezcla inversa. Fuentes: [[funcion-de-variable-aleatoria]], [[tecnica-distribucion-de-una-funcion-de-va]], [[variables-aleatorias-bidimensionales]], [[covarianza-y-correlacion]], [[independencia-de-variables-aleatorias]], [[esperanza-condicional]], [[mezcla-de-distribuciones]], [[tp5-2024]].
- **Corrección en [[caminata-aleatoria]] (unidad 6):** la caminata gaussiana pasa a $X_n=\sum_{k=1}^{n}G_k\sim N(0,\sqrt{n})$, alineada con la convención $N(\mu,\sigma)$ del resto del wiki, con bloque `> ⚠️ Discrepancia:` que deja constancia de que la resolución de [[tp6-procesos-estocasticos]] la escribe como $N(0,n)$ (parametrización por varianza). Misma distribución, distinta convención.
- **Verificación:** los 162 bloques de math de ambas páginas compilan con KaTeX (`throwOnError:true`); todos los wikilinks resuelven; el `orden` de la unidad 5 queda 1..8 sin huecos.

## [2026-09-04] ingest | Formulario de la unidad 6 (procesos estocásticos)

- **Página nueva:** [[formulario-procesos-estocasticos]] (`tipo: formulario`, `unidad: 6`, `orden: 7` — último de la unidad, sin huecos: la U6 ocupaba 1..6).
- **Qué trae:** 46 fórmulas en seis secciones (definiciones generales, caminata aleatoria, proceso de Bernoulli, proceso de Poisson, relación Bernoulli↔Poisson, cadenas de Markov) más un callout de técnica y una sección final «Cuándo usar qué».
- **Aporte neto sobre [[formulario-maestro]] §11:** todo [[procesos-estocasticos]] (Chapman-Kolmogorov por marginalización y en forma de Markov, estacionariedad, incrementos independientes/estacionarios, $N(t)=\max\{k:T_k\le t\}$), toda [[caminata-aleatoria]] (simétrica, moneda cargada, paso i.i.d. general y caminata gaussiana), las ecuaciones de Kolmogorov y los axiomas infinitesimales de [[proceso-de-poisson]] junto con el condicionamiento del pasado al futuro $\operatorname{Bin}(n_2,t_1/t_2)$, el escalar $p=\lambda\,\Delta t$ de [[relacion-bernoulli-poisson]], y de [[cadenas-de-markov]] la forma canónica, $\mathbb{M}=(\mathbb{I}-\mathbb{Q})^{-1}$ y $\mathbb{G}=\mathbb{M}\mathbb{F}$ desagregadas, $\mathbb{Z}=(\mathbb{I}-\mathbb{P}+\mathbb{W})^{-1}$, $E(T_{i,j})$, $E(T_{j,j})$, la primera visita $q_{ij}$ y el tiempo de vida geométrico.
- **Criterio:** hoja aditiva y autónoma — incluye también las fórmulas centrales que ya están en el maestro (conteos Binomial/Poisson, dualidad $T_k<t\iff N(t)\ge k$, $\vec p(n)=\vec p(0)\mathbb{P}^n$, $\vec\pi=\vec\pi\mathbb{P}$), que la app deduplica conservando la versión del maestro.
- **Discrepancia registrada:** la caminata gaussiana se escribe $X_n\sim N(0,\sqrt n)$ (convención $N(\mu,\sigma)$ del wiki) en vez del $N(0,n)$ de la resolución de [[tp6-procesos-estocasticos]]; anotada en la hoja nueva y en [[caminata-aleatoria]], donde además se ajustó el pie de la figura de la caminata gaussiana.
- **Verificación:** 99 bloques de math compilan con KaTeX sin errores; los 10 wikilinks resuelven; frontmatter YAML válido.
- **Pendiente para el pipeline:** agregar el archivo a `FILE_ORDER` de `estudio/build-formulas.py`, escribir las notas nuevas en `estudio/formulas-notas.json` y correr `--check` y `build.py`.

## [2026-09-04] ingest | Parcialitos TP3–TP4 (4 comisiones)

**Fuentes:** `raw/12-evaluaciones/Resoluciones_Parcialitos_TP3y4_Com{A,C,E,F}.pdf` (Lucio José Pantazis, 2 páginas cada uno, resolución oficial completa).

Se salda la deuda S-10: los cuatro PDF del segundo parcialito estaban en disco desde el 2026-06-28 pero no figuraban ni en el wiki ni en el corpus de ejercicios, aunque `index.md` ya los daba por catalogados.

**Qué entró**
- Página de fuente nueva: [[parcialito-tp3y4]] — una sola para las cuatro comisiones (son el mismo hito de cursada), con la tabla de los 8 ejercicios, el análisis de los dos ejes del parcialito y el ejercicio resuelto de la Com. E paso a paso.
- Frag nuevo para el PDF imprimible: `Parcial-Para-Imprimir/_src/frags/reso-parcialitos-tp3y4.html` — 4 secciones (una por comisión), 8 ejercicios con enunciado literal y resolución transcrita fielmente. Es el primer frag de instancia 'parcialito' que lleva la ruta del crudo en el preámbulo de cada `<h2>`, así que sus 8 ítems quedan con `fuente.raw` trazable.

**Lo que muestran los cuatro exámenes**
Son cuatro exámenes distintos, no cuatro copias, y están pareados dos a dos:
- **Com. A ↔ Com. F** — el mismo relato de las manzanas podridas, sin y con reposición. Sin reposición hay que condicionar ($E(X)=\tfrac{m}{M}\tfrac{M-m}{M-1}+2\tfrac{m}{M}\tfrac{m-1}{M-1}$); con reposición las extracciones son independientes y todo colapsa a $E(X)=\tfrac{m(M+m)}{M^{2}}$.
- **Com. C ↔ Com. E** — el mismo cajón de $N$ naranjas y $M$ mandarinas: repuesto a diario da [[distribucion-binomial|Binomial]] $\mathrm{Bi}(7;\tfrac{M}{N+M})$ con $P(X\ge 5)$; agotado en el día da [[distribucion-hipergeometrica|Hipergeométrica]] $\mathcal{H}(N+M;M;4)$ con $P(X\le 2)$.
- El molde es fijo: **Ejercicio 1 discreto (U3), Ejercicio 2 continuo (U4)**. En la parte continua el eje es densidad-a-normalizar (Com. C y E, $f_T(t)=m\,t$ en $(a,b)$, con $m=\tfrac{2}{b^{2}-a^{2}}$) contra distribución conocida ([[distribucion-normal|Normal]] en Com. A, [[distribucion-exponencial|Exponencial]] en Com. F).
- Los enunciados son **simbólicos**: siete de los ocho resultados son fórmulas en parámetros. El único número de todo el parcialito es el $0{,}9047$ de la Com. A Ej. 2.

**Discrepancia anotada**
> ⚠️ Discrepancia: en `Resoluciones_Parcialitos_TP3y4_ComE.pdf` el enunciado pide «a lo sumo 2 naranjas» y la resolución oficial calcula $P(X\le 2)$ con $X$ = cantidad de mandarinas, es decir «a lo sumo 2 mandarinas». Se transcribió la resolución tal cual y se dejó la observación en la página de fuente y en el frag.

**Verificación**
Los 25 bloques display y 70 inline del frag compilan con KaTeX (0 fallas); ídem la página wiki (57 bloques, 0 fallas). Las reglas de formato del parser (h2 numerado, ruta del crudo en `<code>`, `<div class="def"><p>` pegado a cada `<h3>`, ausencia de spoilers) se chequearon por grep. El registro en `estudio/build-ejercicios.py` y la reparación de la fase `parcialito2` en `estudio/study-data.js` quedan a cargo de la integración.

## [2026-09-04] ingest | Parcialito TP8–TP9 (comisiones A y F)

- **Fuentes:** `raw/12-evaluaciones/Resolucion_Parcialito_TP8y9_ComA.pdf` y `..._ComF.pdf` (Lucio José Pantazis, 2 páginas y 2 ejercicios cada uno), contrastadas contra `..._ComB.pdf`, ya transcripto en `Parcial-Para-Imprimir/_src/frags/reso-examenes-A-oficiales.html` §3.
- **Resultado del contraste:** ninguno de los 4 ejercicios de A y F coincide con los de Com. B, así que los 4 se transcriben. El hito tiene un patrón fijo: Ejercicio 1 = intervalo de confianza deducido desde el TCL, Ejercicio 2 = valor crítico de una prueba sobre la media. Las perillas que cambian entre comisiones son el parámetro estimado (media vs. proporción), el nivel de confianza y el extremo pedido, y si $\sigma$ es dato (normal estándar) o desconocido (t-Student), más la cola del test.
- **Nuevo:** `Parcial-Para-Imprimir/_src/frags/reso-parcialitos-tp8y9-acf.html` — 2 secciones (Com. A y Com. F), 4 ejercicios con enunciado en callout de definición, resolución fiel y bloque de resultado; 115 bloques TeX verificados con KaTeX.
- **Nuevo:** `wiki/fuentes/parcialito-tp8y9-acf.md` — página de fuente única para las tres comisiones, con tabla comparativa, puntos clave, ejercicio resuelto paso a paso (Com. A Ej. 1, IC para una proporción) y 20 wikilinks verificados.
- **Discrepancias anotadas:** el PDF de Com. F arrastra tres erratas de copiado desde la resolución de Com. B — nivel $0{,}88$ en las igualdades intermedias del Ejercicio 1 cuando el enunciado pide 92 %; el extremo inferior rotulado $b$ en vez de $a$; y el signo $<$ en el bloque de error común del Ejercicio 2, que es de cola derecha. En los tres casos se transcribe el desarrollo correcto y se deja la observación.
- **Pendiente para el integrador:** dar de alta el frag en `estudio/build-ejercicios.py` (tema "D", 4 ítems, unidades 8/8/9/9), agregar las dos filas a `wiki/fuentes/evaluaciones.md` y definir si el frag entra en `manifest.json`.

## [2026-09-04] ingest | Integración de las 6 hojas nuevas en la app de estudio (P-22)

Cierre del pedido P-22 del lado del pipeline: las seis hojas por unidad creadas en esta ola pasan a estar vivas en la app de fórmulas.

- **`estudio/build-formulas.py`:** se agregaron a `FILE_ORDER`, después de [[formulario-maestro]] y de las cuatro hojas anteriores y en orden de unidad, `formulario-complementos-matematicos.md` (0), `formulario-estadistica-descriptiva.md` (1), `formulario-probabilidad.md` (2), `formulario-va-discretas.md` (3), `formulario-funcion-de-va-y-bidimensionales.md` (5) y `formulario-procesos-estocasticos.md` (6). Sin esa línea el archivo se ignoraba en silencio.
- **`estudio/formulas-notas.json`:** 216 notas nuevas (433 → 649 entradas), tomadas de la curaduría que entregó cada escritor: cuándo se usa, condiciones, tags y `esencial`. Se respetó la marca de esencial tal como la dejó cada hoja (34 nuevas).
- **Resultado:** `estudio/formulas-data.js` pasa de **433 a 648 fórmulas**. Por unidad (declaradas | emitidas | descartadas por deduplicación contra el maestro): U0 28|28|0 · U1 31|30|1 · U2 43|31|11 · U3 38|35|2 · U5 45|45|0 · U6 46|46|0. El reparto final por unidad queda U0 28, U1 49, U2 55, U3 92, U4 102, U5 100, U6 78, U7 54, U8 45, U9 45.
- **Deduplicación:** se perdieron las 14 fórmulas que repetían el tex y el rótulo de [[formulario-maestro]] (sobre todo la sección 1: axiomas, uniones, Laplace, condicional, probabilidad total y Bayes general), la pérdida aceptada al decidir que las hojas por unidad fueran **aditivas** y autónomas en Obsidian. El maestro no se tocó.
- **Curaduría manual:** se descartó con `omitir` la línea «Signo de $\gamma$ … Normal $\Rightarrow\kappa=0$» de la hoja de la unidad 1, que es la leyenda de las dos fórmulas anteriores y no una fórmula; y se limpió con una sobreescritura de `tex` el prefijo en prosa que arrastraba la «Inversa generalizada» de la unidad 5. Ninguna de las seis páginas del wiki necesitó corrección de formato.
- **Verificado:** `build-formulas.py --check` sale **OK** (648/648 con nota, 0 sin nota, 0 notas huérfanas, 0 ids duplicados, 648/648 compilan con KaTeX). En la app, las pestañas de fórmulas de las unidades 0, 1, 2, 3, 5 y 6 muestran las secciones nuevas con 0 `.katex-error` y sin errores de consola.
- **Pendiente:** regenerar `estudio/data.js` (`python3 estudio/build.py`), que todavía trae congelado el pie de figura anterior de la caminata gaussiana en [[caminata-aleatoria]].

## [2026-09-04] ingest | Integración de los parcialitos nuevos al corpus de ejercicios

Cierre de la ingesta de los seis PDF de parcialito que entraron hoy ([[parcialito-tp3y4]] y [[parcialito-tp8y9-acf]]): los dos frags nuevos quedaron dados de alta en el corpus de ejercicios de la app, y el plan de estudio pasó a citarlos.

**Corpus de ejercicios (`estudio/build-ejercicios.py` → `estudio/ejercicios-data.js`)**
- Alta de los dos frags como temas nuevos: `C` = `reso-parcialitos-tp3y4.html` (8 ejercicios) y `D` = `reso-parcialitos-tp8y9-acf.html` (4). La letra del tema es solo el prefijo del id; no tiene relación con la comisión del parcialito, que vive en el título de la sección.
- El corpus pasó de **277 a 289 ejercicios** (guía 119 · Lutzio 86 · examen 84). En el grupo «parciales», U3 pasó de 2 a 6 ítems y U4 de 8 a 12; el banco del simulacro acotado a U3–U4 pasó de 14 a 22 ejercicios de examen.
- Las 12 unidades se asignaron por tabla explícita, con razón escrita: los ocho de TP3–TP4 alternan U3 (v.a. discreta) y U4 (v.a. continua); los cuatro de TP8–TP9 alternan U8 (intervalo de confianza) y U9 (valor crítico de la prueba). Cero avisos de heurística.
- Los 12 ítems son los **primeros parcialitos con `fuente.raw` trazable**: el corpus pasó de 8 a 14 rutas de `raw/12-evaluaciones/` citadas.

**Marca de respuesta simbólica**
Estos parcialitos no piden un número sino una fórmula en los parámetros del enunciado, y eso cambia cómo se practican. Se agregó un tag estructural nuevo, `respuesta-simbolica`, aplicado por tabla explícita de ids a **11 de los 12** ítems. El único excluido es el Ejercicio 2 de la Comisión A de TP3–TP4, cuya respuesta es $0{,}9047$ — el único valor numérico de todo el hito. La ficha del ejercicio lo muestra como un chip más, junto a los tags de tema.

**Plan de estudio (`estudio/study-data.js`)**
- Se salda la deuda S-10: la fase **Parcialito 2** decía qué cubre la guía pero no qué tomó la cátedra. Ahora cinco de sus seis entradas se apoyan en instancias reales — la esperanza de una v.a.d. con y sin reposición (Com. A y F), [[distribucion-binomial|Binomial]] frente a [[distribucion-hipergeometrica|Hipergeométrica]] sobre el mismo cajón (Com. C y E), la densidad lineal a normalizar pedida en las dos colas (Com. C y E), la [[distribucion-normal|Normal]] resuelta con la simetría de $\Phi$ (Com. A) y la [[distribucion-exponencial|Exponencial]] de media $L$ con probabilidad condicional (Com. F) — y se conserva una entrada de guía por LOTUS y FDA.
- La fase **Parcialito 3** sumó el intervalo de confianza para una proporción y el valor crítico con $\sigma$ conocido (Com. A), y sus dos entradas de Com. B ahora citan también la Com. F.

**Impresión**
Los dos frags entran a `Parcial-Para-Imprimir/_src/manifest.json` como PDF propios (`resoluciones/reso-parcialitos-tp3y4.pdf` y `resoluciones/reso-parcialitos-tp8y9-acf.pdf`); no se anexaron a `reso-examenes.html`.

**Catálogo**
[[evaluaciones]] sumó las seis filas nuevas con su ruta cruda y sus temas, corrigió el resumen por tipo (ya no dice «parcialitos Com. B»: son tres hitos y ocho comisiones) y enlaza las dos páginas de fuente nuevas.

**Verificación**
`build-ejercicios.py --check`: 289 ítems, 0 WARNING, 12 761 segmentos de matemática compilados con KaTeX sin errores. `node --check study-data.js`: OK. En la app, 0 errores de consola en `#/ejercicios/3/parciales`, `#/ejercicios/4/parciales`, `#/plan?fase=parcialito2` y `#/parcial?u=3,4`; el panel del Parcialito 2 muestra las cinco citas nuevas y las fichas nuevas muestran el chip de respuesta simbólica.

## [2026-09-04] ingest | Distribución Pareto — se salda la deuda S-13

**Qué se hizo.** Se creó `wiki/distribuciones/distribucion-pareto.md` (unidad 4,
`orden: 10`), la última página que quedaba en la lista de «Páginas referenciadas
aún no creadas» de `index.md`. El formulario de la unidad 4
([[formulario-va-continuas]]) pasó de `orden: 10` a `orden: 11` para dejarle el
lugar, manteniendo la unidad numerada 1..11 sin huecos.

**Fuentes.** [[video-metodos-de-estimacion]] (26:08–52:03) es el único sustento
documental: aporta la densidad, la esperanza, el estimador de máxima
verosimilitud con $x_0$ conocido y con ambos parámetros desconocidos, el
argumento del borde para $\hat x_0=\min_i X_i$, el método de los momentos con sus
dos rangos de validez y los resultados numéricos sobre dos muestras.
[[tp4-variables-aleatorias-continuas]] la lista como distribución extra de la
unidad 4. En `raw/` no hay ninguna mención de «Pareto».

**Contenido de la página.** Densidad $f(x)=\alpha x_0^\alpha/x^{\alpha+1}$, FDA
$F(x)=1-(x_0/x)^\alpha$ y cola $P(X>x)=(x_0/x)^\alpha$; $E[X]=\alpha x_0/(\alpha-1)$
si $\alpha>1$ y $V(X)=x_0^2\alpha/((\alpha-1)^2(\alpha-2))$ si $\alpha>2$;
momentos generales $E[X^k]=\alpha x_0^k/(\alpha-k)$ para $\alpha>k$; la relación
clave $\ln(X/x_0)\sim\mathrm{Exp}(\alpha)$ («la Pareto es la exponencial en escala
logarítmica»), que explica de un plumazo el estimador de máxima verosimilitud;
sección «Cuándo usarla»; sección de estimación (MV con y sin $x_0$ conocido,
momentos) y un `## Ejercicio resuelto` en dos partes con los números del video
($\hat x_0=1,\ \hat\alpha=1.3628$ en la primera muestra;
$\hat x_0=1.2,\ \hat\alpha=2.5833$ en la segunda) y el contraste contra el método
de los momentos, que devuelve un $\hat x_0$ mayor que el mínimo observado.

**Cross-links restaurados.** Las dos menciones de Pareto en
[[estimacion-puntual]] (el bloque sobre dos parámetros con borde y la advertencia
sobre el estimador de momentos incompatible con los datos) estaban degradadas a
texto plano por falta de destino; vuelven a ser wikilinks a
[[distribucion-pareto]].

**Verificación.** 158 bloques de LaTeX renderizados con KaTeX sin fallas; los 17
destinos de wikilink de la página resuelven a un archivo existente; `orden` de la
unidad 4 corre 1..11 sin huecos ni repetidos. La fórmula de la varianza se
corroboró contra la fuente comprobando que reproduce exactamente los estimadores
de momentos del video ($1+E[X]^2/V(X)=(\alpha-1)^2$).

**Anotado como no respaldado por fuentes.** La inexistencia de la función
generadora de momentos para $t>0$ lleva una nota explícita: se sigue de la propia
densidad, no de una afirmación de la cátedra, que trabaja la Pareto solo desde la
estimación.

**Pendiente para el integrador.** Regenerar `estudio/data.js` con
`python3 estudio/build.py`: cambió el frontmatter de dos páginas de la unidad 4.

## [2026-09-04] ingest | S-11 — particion de las 13 placas de formula que desbordaban a 1366 px

**Que se hizo.** Se salda la deuda S-11 de legibilidad: las 13 placas display inventariadas en F-02 (cadenas `A = B = C \Rightarrow D`, o identidades separadas por `\quad`/`\qquad`) se partieron con un patron uniforme — corte en el `\Rightarrow` o en el `\qquad` repitiendo el termino puente al inicio del segundo `$$`, o `\begin{aligned}` de filas cortas cuando el corte natural era una enumeracion. **No se modifico ningun contenido matematico**: mismas expresiones y mismos valores, solo distinto salto de linea.

**Paginas tocadas (placa y exceso medido antes):**
- [[tecnica-datos-agrupados-interpolacion]] :117 (+80 px) — dos interpolaciones separadas por `\qquad` → dos display.
- [[distribucion-weibull]] :75 (+78 px) — tres pasos de derivada → corte tras `\big[(0.01x)^2\big]'`.
- [[formulario-maestro]] :441 (+64 px) — tres identidades de la mixtura discreta/continua → `\begin{aligned}` en la misma linea (los ids de formula estan anclados al numero de linea; el archivo conserva sus 775 lineas).
- [[distribucion-normal]] :154 (+64 px), :52 (+29 px, regla empirica → `aligned` de tres filas) y :127 (desbordaba solo a 1080 px).
- [[tecnica-integrales-dobles]] :90 (+61 px) y :119 (+26 px).
- [[variables-aleatorias-bidimensionales]] :120 (+38 px).
- [[intervalos-de-confianza]] :279 (+30 px).
- [[axiomas-de-probabilidad]] :85 (+14 px) — inclusion-exclusion de tres sucesos → `aligned` de tres filas.
- [[distribucion-bernoulli]] :92 (+11 px) — `aligned` en una linea, para no romper el item de lista.
- [[estandarizacion-y-tabla-normal]] :107 (+2 px) y :109 (+10 px).

**Nucleo duro.** Las 2 placas que desbordaban a cualquier ancho (incluso con la columna de lectura mas ancha, cw=676) eran `distribucion-weibull:75` y `tecnica-datos-agrupados-interpolacion:117`; ambas quedaron resueltas por particion, no por reduccion de tamano.

**Verificacion.** `python3 estudio/build.py` (209 paginas) y medicion con Chrome headless sobre las 97 paginas de contenido, comparando en cada `.katex-display` el ancho de contenido contra el `scrollWidth` de su `.katex-html` (misma metrica que `plateFit`): **1366 px → 0 placas, 1080 px → 0, 1440 px → 0, 1280 px → 0**. Ademas 0 `.katex-error` en las 10 paginas editadas, y las ocurrencias de `\begin{aligned}` aparecen solo dentro de las anotaciones TeX de KaTeX (no queda tex crudo visible).

## [2026-09-04] lint | Higiene de callouts, orden por unidad y placas anchas (Ola 6)

- 9 callouts con patrón «> **Rótulo** ([[fuente]]): minúscula» reescritos como «> **Rótulo (fuente):** Mayúscula» (axiomas-de-probabilidad, estadistico-de-prueba, intervalos-de-confianza, medidas-de-tendencia-central, probabilidad-condicional, prueba-de-hipotesis-para-la-media, estandarizacion-y-tabla-normal y otras dos).
- `caminata-aleatoria`: caminata gaussiana parametrizada como $N(0,\sqrt{n})$ (convención $N(\mu,\sigma)$ del wiki) con callout de discrepancia después de la lista.
- 14 placas de fórmula que desbordaban a 1366 px partidas en dos bloques `$$…$$` o `aligned` (weibull, datos-agrupados-interpolacion, normal ×2, integrales-dobles, bidimensionales, maestro §8 y otras).
- Campo `orden` auditado en las 10 unidades: 1..M sin huecos (U0 4, U1 11, U2 11, U3 14, U4 11, U5 8, U6 7, U7 10, U8 7, U9 9). `distribucion-pareto` entra en U4 con orden 10 y el formulario de U4 pasa a 11.

## [2026-09-05] lint | Citas del docente con «acá»: marca [sic]

- Revisión de las cinco apariciones de «acá» en citas textuales del docente dentro de
  `wiki/fuentes/video-*.md`. Las cinco ya estaban entre comillas; se agregó `[sic]` una vez
  por cita para dejar claro que el regionalismo es del hablante y no de la redacción del wiki.
- Páginas tocadas: [[video-laplace]] (advertencia [06:30]), [[video-normales]] (autocorrección
  [17:39–18:03] y énfasis [33:45]), [[video-vad-2d]] (advertencia [09:29]).
- Sin cambios de contenido matemático. `python3 estudio/build.py` regenerado (209 páginas).

