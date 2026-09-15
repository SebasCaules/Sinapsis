# Log

Registro cronológico **append-only** de todo lo que se hizo sobre esta wiki. No se reescriben
entradas viejas: si algo estaba mal, se corrige con una entrada nueva.

Formato: `## [AAAA-MM-DD] <operación> | <título>`, parseable con
`grep "^## \[" wiki/log.md | tail -5`.

---

## [2026-08-13] instalacion | Creación del vault desde cero

Estado previo: tres PDF sueltos en la raíz de la carpeta de la materia, sin estructura ni schema.

- Identificada la materia: **Seguridad Ocupacional y Ambiental (SOyA)**, obligatoria de 5.º año de
  Ingeniería Informática del ITBA, dictada por el Ing. Hernán Darío Ordoñez y tres docentes más.
- Estructura de tres capas creada según el patrón de los vaults hermanos del cuatrimestre
  (`raw/` inmutable + `wiki/` del LLM + `CLAUDE.md` como schema), tomando `FGIII` como referencia.
- Los tres PDF movidos a `raw/clases/` (2) y `raw/ejercicios/` (1). Nada más se tocó de `raw/`.
- `CLAUDE.md` escrito y adaptado a esta materia: dos módulos independientes, citación **por
  slide** con la regla `página = ceil(slide/2)`, `wiki/normativa/` como carpeta de primer nivel.
- `tools/` copiadas de FGIII; `.obsidian/` con el tema StudyVaults VSCode y `assets/` como carpeta
  de adjuntos; `.gitignore`; `.plans/` para el estado de ejecución.
- `tools/lint.py` migrado a los invariantes de esta materia: `unidad` → `modulo`, tipos `caso`/`tpc`
  → `normativa`/`ejercicio`, `MODULO_DE_CLASE` tolerante a clases desconocidas, `.cache/` y
  `.plans/` fuera del chequeo de huérfanos.
- `python3 tools/extraer.py` → 3 fuentes extraídas a `.cache/txt/` (24 páginas de PDF).

## [2026-08-13] ingesta | Clase 1 — Introducción, régimen y definiciones fundamentales

`raw/clases/1er clase SOyA - V-3.pdf` (14 páginas = 27 slides) → [[clase-01]].

Conceptos creados: [[01-01-salud-ocupacional]], [[01-02-enfermedad-profesional]],
[[01-03-sitio-de-trabajo]], [[01-04-peligro]], [[01-05-riesgo]], [[01-06-riesgo-aceptable]],
[[01-07-accidente]], [[01-08-incidente]], [[01-09-higiene-y-seguridad-industrial]].

Lo más importante que dejó: las **tres definiciones simultáneas de accidente** (Heinrich 1930,
Ley 24.557 art. 6, Johnson 1973), que se registran como tensión en [[contradicciones]] C-05 en
vez de fusionarse; y `R = P × G` como la ecuación de la que después se desprende todo.

Verificación adversarial: ROJO en la primera vuelta (2 findings altos), VERDE tras el fix.

## [2026-08-13] ingesta | Clase 2 — Estadísticas, causas y barreras

`raw/clases/SOyA Clase_2 V-1.pdf` (8 páginas = 15 slides) → [[clase-02]].

Conceptos creados: [[02-01-siniestralidad-laboral]], [[02-02-causas-de-los-accidentes]],
[[02-03-barrera]], [[02-04-prevencion-y-proteccion]], [[02-05-secuencia-del-accidente]],
[[02-06-jerarquia-de-controles]], [[02-07-epp]].

Hallazgos registrados en [[contradicciones]]: el soporte está fechado 4/3/24 (material de 2024
reusado), los datos de Argentina se titulan 2021 pero se atribuyen a "SRT año 2017" (C-01), y
"Hollangel" es errata por Hollnagel (C-02).

Verificación adversarial: ROJO en la primera vuelta (1 finding alto), VERDE tras el fix.

## [2026-08-13] ingesta | Consigna del Ejercicio de Barreras y caso First Chemical

`raw/ejercicios/Ejercicio Barreras v-3 -individual y en clase-.pdf` (2 páginas) →
[[ejercicio-barreras-consigna]] y [[caso-first-chemical-2002]].

El caso quedó reconstruido como línea de tiempo analizable (de la parada del proceso cinco semanas
antes hasta el hallazgo del análisis de riesgos de 1996 que nunca se trasladó), con el inventario
de elementos analizables separado de la resolución.

Verificación adversarial: ROJO en la primera vuelta (1 finding alto), VERDE tras el fix.

## [2026-08-13] investigacion | Contexto institucional, normativa y entidades

Búsqueda web, con todo lo externo aislado en [[contexto-externo]] según la regla del vault.

- **Confirmado** contra el plan de estudios publicado por el ITBA: la materia está en 5.º año de
  Ingeniería Informática. El **código numérico sigue sin confirmarse** en fuentes públicas
  (H-04 de [[huecos]]).
- Normativa fichada, con el texto oficial como fuente primaria: [[ley-19587]], [[dec-351-79]],
  [[ley-24557]], [[dec-658-96]], [[iso-45001]], [[iso-14001]], [[ley-25675]].
- Verificado que la cita de la cátedra a la Ley 24.557 art. 6 es **literal pero cortada** antes de
  la cláusula del accidente in itinere.
- Verificado que la jerarquía de controles de ISO 45001 (8.1.2) es **una sola escalera de cinco
  medidas**, y que la partición prevención/protección es de la cátedra, no de la norma
  ([[contradicciones]] C-03).
- Descubierto que **ISO 14001:2015 fue retirada el 15/4/2026 y reemplazada por ISO 14001:2026**,
  con transición hasta 2029. Confirmado de forma independiente por el orquestador.
- Entidades fichadas: [[hernan-ordonez]], [[oit]], [[oms]], [[srt]], [[niosh]], [[iso]],
  [[herbert-heinrich]], [[erik-hollnagel]], [[william-johnson]], [[james-reason]].

## [2026-08-13] escritura | Páginas de cursada, módulos, meta y síntesis

Escritas por el orquestador: [[materia]], [[evaluacion]], [[cronograma]], [[bibliografia]],
[[modulo-1-seguridad]], [[modulo-2-ambiente]], [[contradicciones]], [[huecos]],
[[glosario-es-en]], [[sintesis]].

[[modulo-2-ambiente]] queda **deliberadamente vacío**: el módulo no se dictó y no hay una sola
fuente sobre él. [[cronograma]] es un andamio, no el cronograma oficial: la cátedra no lo publicó.

## [2026-08-13] resolucion | Ejercicio de Barreras — el trabajo pendiente

Resuelto [[ejercicio-barreras]]: las tres consignas sobre el [[caso-first-chemical-2002]].
Verificación adversarial con **tres lentes independientes** (fidelidad a la consigna, completitud
contra el caso, corrección técnica de seguridad de procesos).

Ver el detalle del veredicto en `.plans/EXEC_STATE.md`.

## [2026-08-13] escritura | Índice, log, herramientas y hoja de repaso

Cerrado el vault: [[indice]], este log, [[herramientas]] y [[repaso-parcial-modulo-1]].

## [2026-08-13] auditoria | Auditoría final adversarial sobre las 53 páginas

Cinco auditores horizontales (fidelidad de citas, invento, coherencia cruzada, normativa contra
texto oficial, utilidad para estudiar), cada uno seguido de un refutador que intenta tumbar sus
hallazgos. 14 findings levantados: **13 confirmados y corregidos, 1 refutado**.

Lo más importante que encontró: **seis de los diez principios del art. 4 de la
[[ley-25675]] estaban mal citados**, presentados como texto literal — cuatro recortados sin
puntos suspensivos, uno con un error de número, y el de solidaridad con una cláusula final
**inventada**. Cotejados contra el HTML oficial de InfoLeg y reemplazados por el texto real.
La página ahora explica qué pasó y por qué.

También se corrigieron: el art. 5º de la [[ley-19587]] tiene **16 incisos y no 15** (la ñ va entre
la n y la o); la fase de la barrera B1 en [[ejercicio-barreras]], que quedaba inconsistente con la
de B2; el conteo de páginas del [[indice]]; y dos referencias que todavía decían que
[[ejercicio-barreras]] no existía.

La dimensión de fidelidad de citas —las ~220 citas `(Clase N, slide M)` verificadas una por una
contra el caché— cerró con **cero findings**.

Compuertas de cierre, todas en verde: lint limpio (53 páginas, 571 enlaces, 0 rotos, 0 huérfanas),
261 citas de slide dentro de rango, frontmatter completo en las 52 páginas que lo requieren, y
`raw/` intacto con sus tres archivos originales.

## [2026-08-25] ingesta | Clases 3 y 4 — seis fuentes de `raw/clases/clases-3y4/`

Ingesta completa del directorio `raw/clases/clases-3y4/`: **6 archivos, 82 páginas/slides de
material**. Es la ingesta más grande del vault hasta ahora — la wiki pasa de 53 a **81 páginas**.

**Las seis fuentes nuevas**, todas con página en `wiki/fuentes/`:

| Fuente | Qué es | Autor |
|---|---|---|
| [[srt-sistema-riesgos-trabajo]] | 22 slides sobre el sistema de riesgos del trabajo | Ing. Santiago Fernández Velasco |
| [[aspt-trabajo-relevamientos]] | 35 slides: el trabajo del andamio + 6 bloques de herramientas | Ing. Santiago Fernández Velasco |
| [[aspt-teoria]] | 7 páginas con el método del ASPT | GAMASI (consultora) |
| [[aspt-formulario]] | 3 páginas: la planilla, su ejemplo y las instrucciones | GAMASI (consultora) |
| [[apunte-iram-10005]] | 14 páginas sobre colores y señales de seguridad | sin declarar |
| [[clasificacion-de-accidentes-por-tipo-y-agente]] | 1 página: la tabla forma × agente | sin declarar |

**12 conceptos nuevos**, con prefijo `03-`: [[03-01-aspt]],
[[03-02-clasificacion-de-accidentes]], [[03-03-colores-y-senales-de-seguridad]],
[[03-04-ergonomia]], [[03-05-seguridad-basada-en-comportamiento]], [[03-06-lockout-tagout]],
[[03-07-permiso-de-trabajo]], [[03-08-relevamiento-de-seguridad]],
[[03-09-sistema-de-riesgos-del-trabajo]], [[03-10-prestaciones-del-sistema]],
[[03-11-accidente-in-itinere]], [[03-12-costos-del-accidente]].

**6 normas nuevas fichadas:** [[iram-10005]] (completa), y cinco mínimas por la regla de "una
página por norma mencionada": [[res-srt-43-96]], [[dec-1338-96]], [[iram-2507]],
[[iram-def-d-1054]], [[iram-10033]].

**3 entidades nuevas:** [[santiago-fernandez-velasco]], [[iram]], [[art]].

**1 ejercicio resuelto:** [[aspt-andamio]] — el ASPT del andamio, con 7 pasos, 25 riesgos y 62
controles clasificados por nivel de jerarquía. La consigna de la cátedra son dos palabras
("ASPT – ANDAMIO"); el método y la rúbrica salen de [[aspt-teoria]] y del [[aspt-formulario]].

### Lo más importante que se descubrió

- **El código de la materia es 12.83.** Aparece impreso en las portadas de los dos soportes del
  Ing. Fernández Velasco. Cierra el hueco H-04, que llevaba abierto desde la primera ingesta y que
  no se había podido resolver ni por búsqueda web.
- **La jerarquía de controles tiene una tercera versión**, de tres niveles (ingeniería →
  administrativos → EPP), impresa dentro del formulario que hay que entregar, con "eliminar" y
  "sustituir" fuera de la escalera como principio previo. Registrado en [[contradicciones]] (C-09)
  y desarrollado en [[02-06-jerarquia-de-controles]], que ahora expone las tres lecturas en una
  sola tabla.
- **La definición del art. 6 de la Ley 24.557 se completa entre dos slides distintos.** La Clase 1
  cortaba antes del trayecto; el slide 8 del soporte nuevo lo incluye y el 9 le da al in itinere
  una definición propia con sus tres condiciones. Registrado como C-08.
- **El cuadro de la IRAM 10005 del slide 6 tiene dos columnas cruzadas** respecto del apunte, en
  las filas de amarillo y verde. Se resolvió **contra el propio cuerpo del apunte**, que dice dos
  veces cuál es el color del símbolo. Registrado como C-12.
- **Cuatro temas del temario que estaban en cero quedaron cubiertos**: clasificación de accidentes
  (5), ASPT (10), seguridad basada en comportamiento (12) y legislación (8). Ver
  [[modulo-1-seguridad]].

### Decisiones metodológicas de esta ingesta

- **`clase: [3, 4]`, no un número.** Los seis archivos vienen en una carpeta llamada `clases-3y4` y
  ninguno trae fecha al pie: no hay forma de saber cuál se dio en cuál. Los conceptos llevan prefijo
  `03.` por la regla de "la menor clase que lo cubre". Anotado en [[huecos]] (H-09).
- **Estos PDF son 1-up: slide = página.** A diferencia de [[clase-01]] y [[clase-02]], que son
  slides impresos 2-up y necesitan la conversión `página = ceil(slide/2)`. Está declarado en cada
  página de fuente y en `CLAUDE.md`.
- **Se citan por nombre corto del documento**, no por "Clase N": `(Sistema de Riesgos del Trabajo,
  slide 11)`, `(Trabajo ASPT, slide 6)`, `(ASPT, p. 5)`, `(Formulario ASPT, p. 3)`,
  `(IRAM 10005, p. 4)`, `(Clasificación de accidentes, p. 1)`. La convención quedó agregada a
  `CLAUDE.md`.
- **18 de los 35 slides de [[aspt-trabajo-relevamientos]] no tienen texto extraíble.** Todo lo que
  la wiki afirma sobre ellos sale de **mirar la lámina** rasterizada, no del caché de texto — que
  para ese archivo es prácticamente inservible. Los formularios del slide 34 y la infografía de EPP
  del slide 4 se transcribieron ampliando la imagen, y lo que no se lee sin ambigüedad se declaró
  como tal en vez de completarse.
- **Cinco recortes a `assets/`**, con el nombre diciendo de dónde salieron. Ninguno se escribió en
  `raw/`.

### Contradicciones nuevas

C-08 (art. 6 en tres versiones) · C-09 (la tercera jerarquía) · C-10 ("riesgo" usado como
"peligro" en el material del ASPT) · C-11 (material de 2025 sin fecha al pie) · C-12 (el cuadro
IRAM con columnas cruzadas) · C-13 ("in itinere" listado como forma de accidente) · C-14 (el
número de la IRAM-DEF escrito de dos maneras). Ver [[contradicciones]].

### Huecos

Cerrado H-04 (el código de la materia). Reescrito H-03 (queda menos temario sin dictar de lo que
había). Abiertos ocho nuevos: H-09 a H-17 — el reparto de archivos entre clases, si el trabajo del
ASPT lleva nota, la columna de responsable que el formulario no tiene, la metodología de SBC que
falta, los tres temas mostrados sin procedimentar, dos atribuciones normativas sin verificar contra
InfoLeg, la ILP y el in itinere que quedaron en una línea, las referencias bibliográficas faltantes
y las cinco normas nombradas al pasar. Ver [[huecos]].

### Páginas existentes actualizadas

[[01-02-enfermedad-profesional]] (los cuatro requisitos, los 44 agentes, los exámenes) ·
[[01-05-riesgo]] · [[01-07-accidente]] · [[01-08-incidente]] ·
[[02-01-siniestralidad-laboral]] · [[02-02-causas-de-los-accidentes]] ·
[[02-06-jerarquia-de-controles]] (las tres lecturas) · [[02-07-epp]] (de esbozo a consolidado:
el programa de nueve pasos y los tipos por parte del cuerpo) · [[ley-19587]] · [[dec-351-79]] ·
[[ley-24557]] · [[dec-658-96]] · [[srt]] · [[materia]] · [[cronograma]] ·
[[modulo-1-seguridad]] · [[bibliografia]] · [[glosario-es-en]] (unas 40 filas nuevas) ·
[[contradicciones]] · [[huecos]] · [[sintesis]] (dos movimientos nuevos: el método y el precio) ·
[[repaso-parcial-modulo-1]] (11 trampas nuevas, los números de las clases 3-4 y las preguntas 19 a
29) · [[indice]].

---

## [2026-08-25] ingesta | Resúmenes de alumnos, compilados de exámenes y el programa oficial

La ingesta más grande del vault hasta la fecha: **seis fuentes nuevas** y **~45 páginas**. Entró
por `raw/resumenes/` y `raw/examenes/` —dos carpetas que el schema no declaraba— y, a mitad de
camino, apareció además el **programa oficial de la materia** en `raw/material_catedra/`.

### Las seis fuentes

| Fuente | Qué es | Autoridad |
|---|---|---|
| [[programa-oficial-12-83]] | Ficha oficial ITBA de 12.83: **14 unidades, 6 TP, modalidad de evaluación y bibliografía obligatoria**. Versión 2023 | **cátedra** |
| [[guia-parcial-2-ambiental]] | **80 preguntas tipo del parcial 2**, con el código 12.83 impreso | **cátedra** |
| [[preguntas-ambiental-2017]] | Un alumno respondiendo **esa misma guía**, en 2017 | alumno |
| [[resumen-ordonez]] | Resumen clase por clase de la parte de [[hernan-ordonez]], cursada anterior | alumno |
| [[resumen-velasco]] | Ídem para [[santiago-fernandez-velasco]] | alumno |
| [[finales-soa-compilado]] | Finales 2Q2019, 1Q2020 y 2Q2020 con respuestas, más preguntas de parciales | alumno |

### Lo que cambió de fondo

**El módulo 2 dejó de estar vacío.** [[modulo-2-ambiente]] decía "página deliberadamente vacía" y
"no sabemos su temario". Ahora tiene las 80 preguntas de la guía de cátedra, **18 páginas de
concepto** y un banco de estudio. Sigue sin dictarse: todo su contenido descansa sobre respuestas
de un alumno de 2017, y cada página lo declara.

**El módulo 1 no tiene más temas en cero.** Diez páginas nuevas, escritas desde los resúmenes,
cubren los temas 3, 6, 11, 13 y 15 del temario. Se marcan *por resumen* y no *dictado*: están en el programa oficial,
pero **no hay ni un slide de 2026** que las respalde.

**Apareció una jerarquía de autoridad nueva.** `CLAUDE.md` §4 pasó de 5 a 7 escalones: se agregó
el escalón 3 (guías de preguntas de cátedra) y el 7 (material de alumno), con la regla de que este
último **no es fuente sino evidencia**: vale por mostrar qué se pregunta, no por lo que responde.

### Las 15 páginas de fuentes, conceptos y apuntes por categoría

**Fuentes (6):** las seis de la tabla de arriba.

**Conceptos del módulo 2 (18):** [[ambiente-y-sus-componentes]] ·
[[cuerpos-de-agua-lenticos-y-loticos]] · [[suelo-y-acuiferos]] ·
[[tratamiento-de-efluentes-liquidos]] · [[dqo-dbo-y-biodegradabilidad]] ·
[[efluentes-gaseosos-y-toxicidad]] · [[atmosfera-y-sus-capas]] · [[efecto-invernadero-y-gei]] ·
[[capa-de-ozono-e-inversion-termica]] · [[niveles-de-organizacion-y-dominios]] ·
[[biodiversidad]] · [[sucesion-ecologica-y-estrategias-r-k]] · [[contaminacion-y-polucion]] ·
[[residuos-peligrosos]] · [[material-particulado]] ·
[[desarrollo-sustentable-e-indicadores]] · [[evaluacion-de-impacto-ambiental]] ·
[[nivel-de-complejidad-ambiental]].

**Conceptos del módulo 1 (10):** [[05-01-contaminantes-quimicos-y-cmp|contaminantes-quimicos-y-cmp]] · [[iluminacion]] · [[ruido]] ·
[[05-02-riesgo-electrico|riesgo-electrico]] · [[05-03-proteccion-contra-incendios|proteccion-contra-incendios]] · [[riesgos-tecnologicos]] ·
[[investigacion-de-accidentes]] · [[sistemas-de-gestion]] ·
[[programa-de-seguridad-efectivo]] · [[modelos-de-accidentes]].

**Normativa (5):** [[convenio-de-basilea]] · [[protocolo-de-montreal]] · [[protocolo-de-kioto]] ·
[[art-41-constitucion-nacional]] · [[ohsas-18001]].

**Entidades (4):** [[ipcc]] · [[uicn]] · [[ciquime]] · [[dupont]].

**Apuntes (2):** [[banco-parcial-2-ambiental]] —las 80 preguntas con respuesta y con la marca de
qué cayó en finales— y [[guia-de-finales]].

### Contradicciones: C-15 a C-27

Trece nuevas, y son de una clase distinta a las anteriores: **no son deslices de un soporte, son
diferencias entre cursadas**. Las que más pesan:

- **C-26 (prioridad alta)** — el programa oficial dice "**el promedio** de los parciales es superior a 4"; la
  Clase 1 dice "aprobar **cada módulo** con 4 o más". **No son equivalentes** y es la única
  contradicción del vault con consecuencia directa sobre aprobar la materia. Gana la Clase 1, pero
  **hay que preguntarlo**.
- **C-18** — peligro según OHSAS 18001 incluye "situación o acto"; según ISO 45001, sólo "fuente".
  Cambia qué se anota en la primera columna de un ASPT.
- **C-15** — la ILT: el resumen dice un año, el soporte 2025 dice dos.
- **C-24** — la guía del parcial 2 **no está fechada** y sus metadatos internos dicen **2017**.
- **C-22** — dos genealogías de los modelos de accidente: Heinrich → Johnson → Hollnagel (la que
  sostiene el vault) o Heinrich → Reason (la del resumen).
- **C-27** — el programa nombra OHSAS 18001 en la unidad 7 e ISO 45001 en la bibliografía.

### Huecos: cuatro cerrados, seis abiertos

**Cerrados:** el programa oficial (parte de H-01), la modalidad de cursada (H-07) y si los TP
llevan nota (H-08, y buena parte de H-10 — **sí llevan nota, y hace falta el 80 %**).

**Abiertos:** H-18 (las preguntas que el resumen de 2017 no contesta), **H-19 (prioridad alta)** (la guía del
parcial 2 sin fechar), H-20 a H-24 (de qué año son los resúmenes, los cinco temas que sólo sostiene
un resumen, lo que las fuentes nombran y no tenemos, los enunciados que están sólo como imagen, y
las letras griegas que el extractor descarta), **H-25 (prioridad alta)** (la unidad 5 del programa,
"Administración de riesgos", **sin una sola página**), H-26 (temas del programa sin cobertura) y
H-27 (cinco de los seis TP que no tenemos).

### Dos bugs del repo, corregidos

- El usuario movió el PDF de la IRAM 10005 a `raw/normativa/`; el `raw_path`, dos menciones más y
  el caché quedaron apuntando a la ruta vieja. Lo detectó `lint.py`. (S-12)
- [[02-07-epp]] enumeraba **nueve** pasos pero una referencia cruzada decía "los pasos 8 y 10", y
  `CLAUDE.md` §7 decía "programa de **diez** pasos". Se rasterizó el slide 4 del Trabajo ASPT y se
  contaron los checkboxes: son **nueve**. (S-14)

### Páginas existentes actualizadas

[[01-04-peligro]] (la variante OHSAS y por qué cambia qué es peligro) · [[01-05-riesgo]] (la
variante OHSAS y un candidato para la lámina del slide 19) · [[01-06-riesgo-aceptable]] (segunda
atribución posible) · [[01-07-accidente]] (Blake 1950, el eslabón que falta) ·
[[03-01-aspt]] (la trampa de los cuatro disparadores) ·
[[03-09-sistema-de-riesgos-del-trabajo]] (572 vs 1075 actividades) ·
[[03-10-prestaciones-del-sistema]] (las cuatro causales de cese de la ILT) ·
[[herbert-heinrich]] (la pirámide de Bird) · [[james-reason]] (**dejó de ser cierto que ninguna
fuente lo mencione**) · [[modulo-1-seguridad]] (las 7 unidades oficiales y la leyenda *por resumen*) ·
[[modulo-2-ambiente]] (reescrita entera) · [[evaluacion]] (el programa, C-26, y dos inferencias
tachadas que resultaron equivocadas) · [[cronograma]] · [[bibliografia]] (la bibliografía
obligatoria oficial) · [[glosario-es-en]] (unas 60 filas nuevas, casi todas del módulo 2) ·
[[contradicciones]] · [[huecos]] · [[sintesis]] (**movimiento 7**: el módulo 2 no rima con el
módulo 1 como se esperaba) · [[repaso-parcial-modulo-1]] (11 trampas verificadas contra exámenes
reales) · [[indice]] · `CLAUDE.md` (§1, §2 y §4) · `.plans/FIXES.md` (S-12 a S-16).

## [2026-09-15] ingesta | Clase 5 — Riesgos (1): soporte "Clase 4 2020" y tres clases grabadas

**Fuente:** `raw/clases/clase-riesgos1/SOyA Clase 4 2do Cuat 2020.pdf` (42 slides, 1-up, Ing.
Ordoñez, PDF generado el 31/8/2020) más **tres videos de Google Drive** —"1 - Contaminación
ambiental" (29:35), "2 - Riesgo eléctrico" (33:03), "3 - Protección contra incendios" (53:09)—
que son la clase grabada sobre ese mismo soporte. **Numerada como clase 5 por decisión del
usuario.** Página: [[clase-05]].

### Cómo se obtuvieron los videos y qué quedó de ellos

- Los enlaces exigen sesión de Google (401 anónimo). Con autorización del usuario se usaron las
  cookies de Chrome (perfil ITBA) para bajarlos por el endpoint de descarga de Drive; el extractor
  de `yt-dlp` para Drive daba 403 aun con cookies.
- **No se escribieron en `raw/`** (regla dura #1): quedaron en `.cache/videos/` con su nombre
  original. La página de fuente declara la **carpeta** `raw/clases/clase-riesgos1/` como
  `raw_path`, así que cuando el usuario los mueva ahí el lint los cubre sin cambios.
- Se transcribieron **localmente** (mlx-whisper, `whisper-large-v3-turbo`, español forzado) y se
  guardaron en `.cache/txt/` con el nombre que les corresponde dentro de `raw/`:
  `clases--clase-riesgos1--N---*.txt`, una línea por segmento con `[mm:ss]`. Se muestreó cada
  video a un cuadro por minuto para fijar qué slide estaba en pantalla en cada tramo.
- **Herramienta nueva: `tools/transcribir.py`**, el hermano de `extraer.py` para video y audio
  (misma convención de nombres; `--raw-dir` para archivos que aún no están en `raw/`). Probado
  de punta a punta sobre el video 1. Documentado en [[herramientas]].
- El texto extraído del PDF pierde **los títulos de todos los slides** y 17 láminas: se leyó el
  PDF entero rasterizado, y diez láminas más un cuadro del video se recortaron a `assets/`
  (`clase-05-slide-NN-*.png`, `clase-05-video-2-1820-dibujo-puesta-a-tierra.png`).

### Páginas nuevas (3)

- [[clase-05]] — acta: convenciones de cita (`(Clase 5, slide N)`, `(Video X, mm:ss)`), los tres
  bloques, el recorrido slide por slide con el tramo de video y lo que agrega la voz.
- [[res-srt-900-15]] — protocolo de medición de puesta a tierra **y continuidad**: la única
  resolución SRT que un soporte de clase cita con número (slide 21).
- `tools/transcribir.py`.

### Páginas renombradas y reescritas (3) — de "adelanto de alumno" a fuente de cátedra

`contaminantes-quimicos-y-cmp` → [[05-01-contaminantes-quimicos-y-cmp]] ·
`riesgo-electrico` → [[05-02-riesgo-electrico]] ·
`proteccion-contra-incendios` → [[05-03-proteccion-contra-incendios]]. El nombre viejo quedó
como alias. El resumen de alumno resultó ser **copia literal de estos slides**, así que las tres
se recitaron contra el soporte y se les sumó lo que sólo está en la voz: los asfixiantes con y
sin reacción, el órgano diana, los dos ejemplos de la CMP-CPT (zapatos y cabina de pintura —el
primero es la consigna del final 1Q2020), "cuanto más bajo el CMP más tóxica", campanas y
máscaras; la tabla de efectos en mA y el corrimiento de umbrales, "la térmica protege equipos y
el diferencial personas", la mecánica del candado LOTO, la consignación como término del
Dec. 351/79 aplicable a cualquier energía, el EPP eléctrico pieza por pieza; la reacción en
cadena como radicales libres, el ejemplo de la cocina para la banda, la clase K, "CO₂ apaga la
llama pero no la brasa", los polvos como sales comunes, los agentes limpios en salas de
servidores, Cromañón contra el art. 160, el marbete anual y la carga de fuego como requisito
legal exigible.

### Páginas existentes actualizadas (17)

[[03-06-lockout-tagout]] (definición de cátedra; la regla "un candado, una llave, un dueño"
dejó de ser inferencia; LOTO = regla 2 de las 5 reglas de oro) · [[02-07-epp]] (protección
respiratoria y EPP eléctrico) · [[02-04-prevencion-y-proteccion]] (las "capas de cebolla") ·
[[dec-351-79]] (lo que la clase le atribuye en los tres bloques y el **art. 160**) ·
[[res-srt-861-15]] · [[cronograma]] (fila 5) · [[modulo-1-seguridad]] (tema 6 dictado en parte) ·
[[modulo-2-ambiente]] y [[materia]] (**Affranchino dicta el módulo 2**, según Ordoñez en 2020) ·
[[hernan-ordonez]] · [[resumen-ordonez]] (sus láminas son estos slides) ·
[[repaso-parcial-modulo-1]] (números, normas, cinco trampas y siete preguntas nuevas) ·
[[glosario-es-en]] (33 términos) · [[sintesis]] (la clase 5 confirma el movimiento 3 desde
adentro) · [[herramientas]] · [[huecos]] · [[contradicciones]] · [[indice]] · `CLAUDE.md`.

### Contradicciones: C-28 a C-30

Tres respuestas de [[finales-soa-compilado]] que chocan con el soporte de cátedra del mismo tema:
**C-28** la puesta a tierra es protectiva (slide 17) y el compilado marcó "ninguna"; **C-29**
tensión vs. intensidad (la cátedra tabula en mA; el compilado marcó "tensión"); **C-30** espuma
para aceite lubricante (la tabla del slide 29 dice SÍ; el compilado tildó "ninguno"). Gana la
cátedra en las tres; C-29 queda sin respuesta declarada porque la pregunta está mal formulada.

### Huecos

Cerrados: las 5 reglas de oro y la atribución de la tabla de tensiones (H-22, parte eléctrica);
achicados H-13 (LOTO tiene secuencia para energía eléctrica) y H-21 (tres temas del bloque de
higiene pasaron a cátedra). Abierto **H-28**: el video de arc flash, los dos videos de las 5 reglas,
las tablas de distancias de TCT, la clase de requisitos legales, la fecha de Cromañón ("creo que
2006", sin corregir) y la respuesta de cátedra a C-29.

### Pendiente del usuario

Mover los tres `.mp4` de `.cache/videos/` a `raw/clases/clase-riesgos1/` para que sean fuente
formal; el comando está en [[clase-05]].

## [2026-09-15] mantenimiento | Borrados los videos de la clase 5

Por pedido del usuario se borró `.cache/videos/` (los tres `.mp4` de [[clase-05]], 391 MB). No
van a `raw/`. Quedan en el repo: las tres transcripciones de `.cache/txt/`
(`clases--clase-riesgos1--N---*.txt`), que ahora **no se regeneran solas** —hay que volver a bajar
los videos de Drive—, y los recortes de `assets/`. Los enlaces de Drive se dejaron en la página de
fuente para poder recuperarlos. Actualizados [[clase-05]], [[indice]], [[herramientas]],
`CLAUDE.md`, `tools/transcribir.py` (ejemplo de uso) y `.plans/FIXES.md` (S-17 cerrado).

## [2026-09-15] mantenimiento | Prefijos de conceptos, subcarpetas por módulo y estados sin emojis

A pedido del usuario, tres cambios de forma, ninguno de contenido:

1. **Prefijo de `conceptos/`.** `1.CC.NN-nombre` pasó a `CC.NN-nombre`: el dígito del módulo
   salió del nombre de archivo. Las 31 páginas con prefijo se renombraron y se reescribieron los
   ~1.300 wikilinks y menciones en toda la wiki, `CLAUDE.md` y `.plans/`. No se agregaron
   `aliases:` con los nombres viejos porque no quedó ningún enlace que los use.
2. **Subcarpetas por módulo.** `wiki/conceptos/` quedó en `seguridad/` (módulo 1, 38 páginas) y
   `ambiente/` (módulo 2, 18 páginas); el módulo lo dice la carpeta, no el nombre. Las rutas
   relativas de las imágenes bajaron un nivel (`../../../assets/`). `tools/lint.py` reemplazó
   `MODULO_DE_CLASE` por `MODULO_DE_CARPETA` y verifica que la subcarpeta coincida con `modulo:`.
3. **Sin emojis.** Los marcadores de estado (los cuadrados y círculos de colores, el tilde, la
   diana, el triángulo de advertencia) se reemplazaron por palabras fijas: `dictado` / `por
   resumen` / `parcial` / `sin cobertura` en [[modulo-1-seguridad]], [[repaso-parcial-modulo-1]] y
   [[huecos]]; `(prioridad alta | media | baja)` en los títulos de [[huecos]]; `respondida` /
   `a medias` / `sin respuesta` / `final` en [[banco-parcial-2-ambiental]]; `ingestada` en
   [[cronograma]]. Los diagramas ASCII y las flechas tipográficas se conservan. La regla quedó
   como regla dura 8 de `CLAUDE.md`.

Además, [[indice]] perdió la columna de estado (el `estado:` vive en el frontmatter de cada
página), los dos avisos de "qué entró en la última ingesta" (viven en este log) y las negritas
que marcaban novedad. `.plans/FIXES.md` se consolidó en una sola tabla ordenada por ID (S-10 y
S-18 cerrados, S-02 recortado, S-19 agregado). Las entradas anteriores de este log se tocaron
sólo para renombrar enlaces y cambiar glifos por palabras; el texto no se reescribió.

Verificación: `python3 tools/lint.py` limpio (132 páginas, 0 problemas) antes y después.

## [2026-09-15] publicacion | Migración de la wiki a Sinapsis (materia `soya`)

La wiki se publica en la plataforma Sinapsis. Lo que entró al repo, fuera de `wiki/`:

- `sinapsis.config.json`: materia `soya`, código 12.83, nomenclatura Módulo/M/Módulos, cuatro
  divisiones (`1` Higiene y Seguridad Ocupacional, `2` Medio Ambiente, `cursada`, `vault`), siete
  tipos de página, un rail de seis ítems (repaso del parcial 1, banco del parcial 2, guía de
  finales, programa oficial, contradicciones, huecos) y la síntesis como página suelta.
- `estudio/`: cuatro mazos (155 tarjetas: definiciones del módulo 1, números del módulo 1,
  normativa, y las 80 preguntas de la guía del parcial 2 generadas desde
  [[banco-parcial-2-ambiental]]), dos quizzes (46 preguntas), `plan.json` (parcial 1, parcial 2
  y final; recuperatorio como instancia opcional; sin fechas, H-01) y `kits.json` (tres kits).

Lo que el compilador exigió y cambió en el wiki, a pedido del usuario y sin tocar el cuerpo de
ninguna página:

1. **Prefijo con guion**: `01.04-peligro` pasó a `01-04-peligro` (Sinapsis no admite puntos en el
   slug). Las 31 páginas con prefijo se renombraron y se reescribieron ~1.400 wikilinks y menciones.
2. **Carpeta plana**: las subcarpetas `conceptos/seguridad/` y `conceptos/ambiente/` de esta misma
   mañana se deshicieron (el compilador sólo lee el primer nivel); el módulo queda en `modulo:` y en
   el nuevo campo `division:`.
3. **Frontmatter**: `division` y `resumen` en las 131 páginas (el resumen es la sección "En una
   línea" aplanada; los de [[repaso-parcial-modulo-1]], [[sintesis]] y [[contexto-externo]] se
   escribieron a mano), `temas` pasó a llamarse `tags`, y las cinco páginas de `meta/` pasaron de
   `tipo: meta` a `tipo: wiki` (clave reservada por la plataforma).
4. **Síntesis a `apuntes/`**: la raíz de `wiki/` sólo compila el índice y el registro.
5. **Enlaces**: 23 que apuntaban a un alias ahora apuntan al nombre de archivo (la plataforma no
   resuelve aliases), 11 enlaces al índice pasaron de `index` a `indice` (alias nuevo, que es el
   slug con el que se publica) y 4 enlaces al archivo `CLAUDE.md` quedaron como texto plano.

`tools/lint.py` verifica ahora la coherencia `division` ↔ `modulo` y el prefijo con guion;
`CLAUDE.md` documenta todo en §2 y en el nuevo §8; [[herramientas]] describe el config, el material
de estudio y los comandos. Verificación: `lint.py` limpio (132 páginas) y `publish --dry-run` sin
advertencias (132 páginas, 16 imágenes, 4 mazos, 2 quizzes, 3 fases, 3 kits).
