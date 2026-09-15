---
titulo: Huecos — lo que sabemos que nos falta
tipo: wiki
modulo: [1, 2]
clase: []
division: "vault"
tags: [salud-de-la-wiki, huecos]
fuentes: [programa-oficial-12-83, clase-01, clase-02, srt-sistema-riesgos-trabajo, aspt-trabajo-relevamientos, guia-parcial-2-ambiental, preguntas-ambiental-2017, resumen-ordonez, resumen-velasco, finales-soa-compilado, clase-05]
actualizado: 2026-09-15
estado: en-desarrollo
resumen: 'Inventario explícito de lo que falta, para que la ausencia sea visible en vez de silenciosa. Un hueco anotado es una pregunta que se le puede hacer a la cátedra; un hueco no anotado es una página que alguien va a completar inventando.'
---

## En una línea

Inventario explícito de lo que **falta**, para que la ausencia sea visible en vez de silenciosa.
Un hueco anotado es una pregunta que se le puede hacer a la cátedra; un hueco no anotado es una
página que alguien va a completar inventando.

**Estado al 2026-09-15 (tras la ingesta de la Clase 5 — riesgos):** 25 huecos abiertos y
**5 cerrados**. Se cerró H-22 en su parte eléctrica (las 5 reglas de oro y la atribución de la
tabla de tensiones), H-13 y H-21 se achicaron, y se abrió **H-28** con lo que la clase nombra y no
tenemos (videos de apoyo, tablas de distancias, la fecha de Cromañón).

**Estado al 2026-08-25 (tras la ingesta de resúmenes, exámenes y el programa oficial):** 25 huecos
abiertos y **4 cerrados**. H-01 y H-02 bajaron de prioridad alta a media y se cerraron H-07 y H-08 — pero el programa oficial abrió
tres huecos nuevos al mostrar todo lo que la materia contiene y el vault no.

**Los tres de prioridad alta, que son los que hay que pedir:**

1. **H-01** — falta el **cronograma**. El programa oficial ya entró y cerró todo lo demás.
2. **H-19** — nadie confirmó que la guía del parcial 2 **siga vigente**; sus metadatos dicen 2017.
3. **H-25** — **la unidad 5 del programa ("Administración de riesgos") no tiene una sola página**,
   y ninguna fuente del vault la cubre.

Y una cuarta que no es un hueco sino una pregunta: **C-26**, cuál de los dos criterios de
aprobación rige. Ver [[evaluacion]].

## H-01 — Falta el **cronograma**; el programa ya lo tenemos (prioridad media)

**Bajado de prioridad alta a media el 2026-08-25.** Entró [[programa-oficial-12-83]] a `raw/material_catedra/`.

| Documento | Estado |
|---|---|
| **Programa oficial / contenidos mínimos** | **Cerrado.** 14 unidades, 6 TP, bibliografía obligatoria. Ver [[programa-oficial-12-83]] |
| **Modalidad de evaluación** | **Cerrado**, con una salvedad grande: **contradice a la Clase 1** en el criterio de aprobación. Ver C-26 y [[evaluacion]] |
| **Cronograma de clases** | **Sigue faltando.** Un programa no trae fechas |

**Lo que sigue bloqueado por la falta de cronograma:** las fechas de los dos parciales, cuántas
clases tiene la cursada, en qué clase arranca el módulo 2, y la validación automática de
`tools/lint.py` (`.plans/FIXES.md`, S-02).

**Acción:** pedir el cronograma. Es lo único que queda del hueco original.

## H-CERRADO-03 — ¿Los trabajos prácticos llevan nota?

**Cerrado el 2026-08-25** por [[programa-oficial-12-83]] (p. 6). Sí:

> "Los trabajos prácticos podrán ser **individuales o grupales (3 a 5 personas)** y serán
> **calificados por el docente** quien hará una **devolución** de los mismos."

Y son **condición de aprobación**: hace falta haber realizado **al menos el 80 %**. Eso cierra
H-08 (el [[ejercicio-barreras]]) y buena parte de H-10 (el trabajo del ASPT).

**Queda abierto** un detalle: el programa lista **seis TP** y **el ASPT no está entre ellos**.
O el listado cambió entre 2023 y 2026, o el ASPT es actividad de clase sin calificar. Ver
[[programa-oficial-12-83]].

## H-CERRADO-04 — La modalidad de cursada

**Cerrado el 2026-08-25** por [[programa-oficial-12-83]] (p. 5): *"Las clases son **presenciales**
de tipo teórico-práctico."* Era H-07.

## H-25 — La unidad 5 del programa no tiene una sola página (prioridad alta)

El [[programa-oficial-12-83|programa oficial]] lista una unidad entera del módulo 1 de la que el
vault **no tiene absolutamente nada**:

> **5. Administración de riesgos.** "El **circuito de las pérdidas**. **Ciclo de gerenciamiento del
> riesgo**: identificación – análisis – evaluación, tratamiento y **financiación** de los riesgos.
> Rol de la prevención en el tratamiento y reducción de riesgos. **Costo de la protección vs. costo
> de las no conformidades**."

Sólo [[03-12-costos-del-accidente]] lo roza, y por el lado del iceberg. **No hay ninguna fuente
en `raw/` que cubra esto**: ni slide, ni resumen, ni pregunta de final.

Es, además, la unidad que conectaría el módulo 1 con la gestión de riesgo financiera —
"financiación de los riesgos" es el seguro, y ahí entra la [[art|ART]] desde otro ángulo.

**Acción:** pedir el material de esa unidad. Es el hueco de contenido más grande del módulo 1.

## H-26 — Temas del programa oficial sin página (prioridad media)

Además de la unidad 5 entera, el programa nombra contenidos que ninguna fuente del vault cubre:

| Tema | Unidad | Nota |
|---|---|---|
| **Pirámide de documentación** | 3 | Ni una mención en ningún soporte |
| **Riesgos mecánicos** y **espacios confinados** | 4 | Los espacios confinados aparecen sólo como ejemplo de permiso de trabajo |
| **Aparatos y aparejos para izar** | 4 | Está en (Resumen Ordoñez, p. 5), sin página propia |
| **Lluvia ácida, smog, BTEX, PAH, dioxinas, PCB, metales pesados, agroquímicos** | 9 | Ocho contaminantes nombrados; el vault sólo tiene [[material-particulado]] |
| **Residuos patogénicos** y **límites de vuelco** | 9 | [[residuos-peligrosos]] no los cubre |
| **Ley 26.331 de bosques** y **Ley 26.639 de glaciares** | 11 | Dos leyes de presupuestos mínimos que **ninguna otra fuente menciona** |
| **DIA, certificado de aptitud ambiental, manifiesto, dictamen técnico** | 13 | [[evaluacion-de-impacto-ambiental]] tiene EIA y EsIA, no el resto del circuito |
| **Ciclo del carbono**, eficiencia energética, energías renovables | 10 | — |
| **Aspectos e impactos ambientales, determinación de la significancia** | 12 | El corazón de un SGA ISO 14001, sin página |

**No se escriben por inferencia.** Cada uno necesita una fuente.

## H-27 — Cinco de los seis trabajos prácticos no los tenemos (prioridad media)

[[programa-oficial-12-83]] lista seis TP. Sólo tenemos el primero:

| TP | Tema | Estado |
|---|---|---|
| TP1 | Barreras preventivas y protectivas | resuelto: [[ejercicio-barreras]] |
| TP2 | Parámetros de legislación en aguas y consecuencias para la salud | falta |
| TP3 | **Cálculo de índices de biodiversidad** | falta |
| TP4 | Selección de tratamiento de efluentes líquidos | falta |
| TP5 | Diseño sustentable de **Van Hemel** | falta |
| TP6 | Elaboración de **matriz de importancia** | falta |

Los cinco que faltan son del **módulo 2**, y **tres son de cálculo** (índices, matriz, selección de
tratamiento). Las páginas de concepto correspondientes explican los conceptos pero **no traen
ejercicios resueltos**, que es lo que un TP pide.

**Acción:** pedir las consignas cuando arranque el módulo 2.

## H-02 — El módulo 2: sabemos qué evalúa, no cómo se dicta (prioridad media)

**Bajado de prioridad alta a media el 2026-08-25.** Ya no es cierto que haya "cero fuentes".

**Lo que se cerró:** [[guia-parcial-2-ambiental]] es **fuente de cátedra** —trae el código `12.83`
impreso en sus cuatro páginas— y trae **las 80 preguntas tipo del parcial 2**. Eso es, en los
hechos, el temario. Está desarrollado en 18 páginas de concepto y en
[[banco-parcial-2-ambiental]].

**Lo que sigue abierto, y es mucho:**

| Falta | Por qué importa |
|---|---|
| El **programa oficial** del módulo 2 | Una lista de preguntas no dice profundidad, orden ni bibliografía |
| **En qué clase arranca** y **quién lo dicta** | Sin eso no hay filas de [[cronograma]] ni prefijos `CC-NN-` |
| La **fecha del parcial 2** | Ver [[evaluacion]] |
| Si la guía **sigue vigente en 2026** | Ver C-24 en [[contradicciones]]: no está fechada y sus metadatos dicen **2017** |
| **Las respuestas** | La guía no trae ninguna. Ver H-18 |

Y el pasivo de fondo: **todo el contenido del módulo 2 en esta wiki está escrito sobre respuestas
de alumnos de 2017**, no sobre clase. Cada página lo declara en un callout, pero cuando el módulo
se dicte hay que cotejar las 18 páginas una por una.

## H-03 — Del temario del módulo 1, queda poco sin dictar (prioridad media)

**Actualizado el 2026-08-25.** La ingesta de las clases 3 y 4 cerró cuatro de los seis temas que
estaban en cero:

| Tema | Estado antes | Estado ahora |
|---|---|---|
| 5. Clasificación de los accidentes | sin cobertura | dictado: [[03-02-clasificacion-de-accidentes]] |
| 10. Análisis de seguridad de los puestos de trabajo | sin cobertura | dictado: [[03-01-aspt]] + [[aspt-andamio]] |
| 12. Seguridad basada en comportamiento | sin cobertura | dictado: [[03-05-seguridad-basada-en-comportamiento]] |
| 8. Legislación | parcial (fichado) | dictado: [[03-09-sistema-de-riesgos-del-trabajo]] |
| 9. Prevención de riesgos | parcial | dictado: el repertorio concreto de controles |
| 14. Herramientas de análisis | parcial | dictado: dos herramientas con trabajo resuelto |

**Lo que sigue faltando:**

**Segunda actualización, 2026-08-25 (tarde).** La ingesta de [[resumen-ordonez]] y
[[resumen-velasco]] cubre cuatro temas más — pero **con fuente de alumno, no de cátedra**, así que
pasan a *por resumen* y no a *dictado*:

| Tema | Estado | Página |
|---|---|---|
| 3. Modelos de accidentes | por resumen | [[modelos-de-accidentes]] — Heinrich lineal → Reason epidemiológico |
| 11. Programa de seguridad efectivo | por resumen | [[programa-de-seguridad-efectivo]] — los siete elementos |
| 13. Sistemas de gestión | por resumen | [[sistemas-de-gestion]] — PDCA, OHSAS, auditorías, certificación |
| 15. Investigación de incidentes | por resumen | [[investigacion-de-accidentes]] — el método de 4 pasos |
| 6. Tipos de peligros y riesgos | por resumen → **dictado en parte desde el 2026-09-15**: contaminantes, riesgo eléctrico e incendios tienen soporte de cátedra ([[clase-05]]); iluminación y ruido siguen sólo por resumen | [[05-01-contaminantes-quimicos-y-cmp]], [[05-02-riesgo-electrico]], [[05-03-proteccion-contra-incendios]] (cátedra); [[iluminacion]], [[ruido]], [[riesgos-tecnologicos]] (resumen) |

**Lo que sigue faltando de verdad:**

- **7. Identificación de peligros y evaluación de riesgos** — el [[03-01-aspt|ASPT]] lo hace en un
  puesto, pero falta el bloque metodológico general: matriz de riesgo, criterios de tolerabilidad,
  HIRA. La sigla HIRA aparece una sola vez, al pasar (Trabajo ASPT, slide 34).
  **Novedad:** [[resumen-ordonez]] (p. 10) trae una **matriz de riesgo 3 × 3** que es el mejor
  candidato aparecido hasta ahora. Ver [[01-05-riesgo]].
- **Ningún tema del módulo 1 tiene ya cobertura cero.** Lo que falta ahora no es material: es
  **material de cátedra 2026** para los cinco temas que hoy sólo sostiene un resumen de alumno.
  Ver H-21.

Ver el estado completo en [[modulo-1-seguridad]].

## H-CERRADO-02 — El código ITBA de la materia

**Cerrado el 2026-08-25 por fuente de cátedra.** Es **12.83**. Las portadas de los dos soportes del
Ing. Fernández Velasco lo traen impreso: "SEGURIDAD OCUPACIONAL **(12.83 – SEGURIDAD OCUPACIONAL Y
AMBIENTAL)**" (Sistema de Riesgos del Trabajo, slide 1; Trabajo ASPT, slide 1).

No hizo falta buscarlo en la web: apareció en `raw/`. Ver [[materia]] y
[[santiago-fernandez-velasco]].

## H-05 — Referencias bibliográficas incompletas, clases 1 y 2 (prioridad media)

- **Hollnagel 2004** — el título no está en el slide. Casi seguro *Barriers and Accident
  Prevention*. Ver [[erik-hollnagel]].
- **Duijm et al., 2004** — sin referencia completa. (Clase 2, slide 11)
- **Heinrich 1930** — año a verificar contra *Industrial Accident Prevention* (1931).
  Ver [[contradicciones]], "Pendientes de verificar".
- **IEC 61508/11 e ISO 13702** — citadas al pasar (Clase 2, slide 11), sin página propia todavía.

## H-CERRADO-01 — Los cuatro campos del listado de enfermedades profesionales

**Cerrado el 2026-08-13** contra el texto oficial de la Ley 24.557 en InfoLeg. Los cuatro
elementos que enumera la cátedra —agente de riesgo, cuadros clínicos, exposición y actividades—
son cita literal del **art. 6, inc. 2 a) de la Ley 24.557**, que es la norma que ordena confeccionar
el listado; el [[dec-658-96]] lo ejecuta. Queda abierto sólo un detalle de maquetación (si son
cuatro columnas o tres), irrelevante para el contenido.

## H-06 — Los slides sin texto (prioridad baja)

Tres slides de la clase 1 son **sólo imagen** y el texto extraído no dice nada de ellos:

| Slide | Qué se ve en el texto extraído | Qué falta |
|---|---|---|
| 7 | nada | contenido desconocido |
| 8 | la URL `microsiervos.com/images/Lunch-atop-a-Skyscraper.jpg` | la foto de los obreros almorzando sobre la viga del rascacielos, 1932 — es el ícono de "seguridad laboral" y seguro se usa para abrir el debate |
| 19 | nada | probablemente el gráfico de la matriz de riesgo P × G, por su posición entre el slide 18 (R = P × G) y el 20 (riesgo aceptable) |

**Acción:** abrir el PDF y mirar esos tres slides; si aportan, recortarlos a `assets/` con el
nombre `clase-01-slide-NN-tema.png` y enlazarlos desde la página del concepto.

> **En la Clase 5 pasa lo mismo, y además se pierden los títulos.** El soporte de [[clase-05]]
> tiene 17 láminas sin texto extraíble y `pypdf` no levanta el título de ningún slide. Se leyeron
> las 42 láminas rasterizadas y diez se recortaron a `assets/`.
>
> **El problema es mucho más grande en las clases 3 y 4.** [[aspt-trabajo-relevamientos]] tiene
> **18 de sus 35 slides sin una sola palabra extraíble**. Esos 18 se leyeron mirando la lámina y
> los cinco de mayor peso se recortaron a `assets/`. El caché de texto de ese archivo es
> prácticamente inservible por sí solo, y conviene recordarlo antes de volver a consultarlo.

## H-07 — No sabemos la modalidad de cursada (prioridad baja)

El régimen insiste tres veces en que las evaluaciones son **PRESENCIALES**, en mayúsculas
(Clase 1, slide 3). Esa insistencia sugiere que se está distinguiendo de algo — probablemente
clases remotas o híbridas — pero **no hay ningún dato sobre cómo se dictan las clases**.
Ver [[evaluacion]].

## H-08 — El ejercicio de barreras: ¿lleva nota? (prioridad baja)

El nombre del archivo dice "individual y en clase", lo que sugiere trabajo de proceso. Pero no hay
consigna de entrega, ni fecha, ni criterio de corrección. La resolución de [[ejercicio-barreras]]
está hecha para el caso más exigente (que se corrija), que es la decisión conservadora correcta.

## H-09 — No sabemos qué archivo de `clases-3y4/` va con cuál clase (prioridad media)

Los seis archivos están en una sola carpeta llamada `clases-3y4`, y **eso es toda la información
que tenemos**. Ninguno trae fecha impresa al pie. Las páginas correspondientes declaran
`clase: [3, 4]` y los conceptos llevan prefijo `03-NN-` por la regla de "la menor clase que lo
cubre".

**Acción:** confirmar en el campus o en clase el reparto real y las fechas. Ver [[cronograma]].

## H-10 — El trabajo del ASPT: ¿lleva nota? ¿cuándo se entrega? (prioridad media)

La consigna es **una sola lámina con dos palabras**: "ASPT – ANDAMIO"
([[aspt-trabajo-relevamientos]], slide 2). No hay fecha de entrega, ni si es individual o grupal, ni
criterio de corrección, ni si la nota cuenta. Es el mismo hueco que H-08 tiene para el
[[ejercicio-barreras]].

[[aspt-andamio]] está resuelto para el caso más exigente (que se corrija con la rúbrica que se
desprende de [[aspt-teoria]]), que es la decisión conservadora correcta.

## H-11 — El formulario del ASPT no tiene columna para el responsable (prioridad baja)

Las instrucciones piden en su punto 5 "las personas responsables de llevar adelante las acciones
solicitadas" (Formulario ASPT, p. 3), y la planilla de las páginas 1 y 2 tiene **tres columnas**:
pasos, riesgos, controles. No hay dónde ponerlo.

[[aspt-andamio]] lo resuelve anotando el responsable dentro de la celda de control. **Acción:**
preguntar si se espera una cuarta columna o si el criterio es ése.

## H-12 — Seguridad basada en comportamiento: sólo el modelo y un caso (prioridad media)

La cátedra da el ciclo **antecedente → comportamiento → consecuencia** con realimentación
(Trabajo ASPT, slide 30) y la secuencia de fotos del accidente de la grúa. **No da** la metodología
de un programa de SBC: observación entre pares, tarjetas de observación, feedback, indicadores de
comportamiento seguro, ni los autores del campo. No hay que inventar esa capa. Ver
[[03-05-seguridad-basada-en-comportamiento]].

## H-13 — Tres temas que la cátedra muestra pero no procedimenta (prioridad media)

| Tema | Qué se dio | Qué falta |
|---|---|---|
| [[03-06-lockout-tagout]] | Tres láminas de fotos: la planta, el hardware, el tanque. **Desde el 2026-09-15**, además, la definición y la mecánica del candado, y la secuencia formal **para energía eléctrica** (las 5 reglas de oro = consignación del Dec. 351/79) — [[clase-05]] | El tratamiento de energías residuales y una secuencia formal para energías no eléctricas |
| [[03-07-permiso-de-trabajo]] | Una lámina con tres documentos de terceros | Qué tareas exigen permiso (altura, caliente, eléctrico, excavación, izaje), normativa argentina de espacios confinados, un formulario propio de la cátedra |
| [[03-08-relevamiento-de-seguridad]] | La lista de 16 ítems | Planilla, criterios de conformidad, frecuencia, ejemplos resueltos |

Contrasta con el [[03-01-aspt|ASPT]], que sí viene con método, formulario y trabajo práctico.

## H-14 — Dos atribuciones normativas sin verificar contra el texto oficial (prioridad media)

1. **Los cuatro requisitos de enfermedad profesional** (agente, exposición, enfermedad, relación de
   causalidad). El slide los atribuye al [[dec-658-96]] pero su lenguaje es de considerandos o de la
   introducción del Anexo I. **No sabemos en qué parte del decreto están.**
2. **El índice del [[dec-351-79]].** Los 16 ítems del relevamiento parecen ser sus capítulos, pero
   sólo está confirmado el **capítulo 12** —el único que la cátedra cita por número—. Falta cotejar
   el resto, y el orden del slide no coincide exactamente con el del decreto.

**Acción:** cotejar contra InfoLeg. Es trabajo de verificación, no de búsqueda de material nuevo.

## H-15 — Dos temas del sistema que quedaron en una línea (prioridad media)

- **ILP (Incapacidad Laboral Permanente):** el soporte le dedica tres palabras
  —"indemnización por incapacidad"— frente a las siete preguntas desarrolladas de la ILT. Falta
  todo: grados, parcial/total, provisoria/definitiva, comisiones médicas, cálculo. Ver
  [[03-10-prestaciones-del-sistema]].
- **In itinere:** falta qué pasa con el trayecto trabajo→estudio o trabajo→otro empleo, cómo se
  prueba la habitualidad, y cuánto pesan los in itinere en el total de casos notificados. Ver
  [[03-11-accidente-in-itinere]].

**No hay que completarlos por inferencia**: son artículos de ley, y la regla dura #2 aplica.

## H-16 — Referencias bibliográficas de las clases 3 y 4 (prioridad baja)

- **El gráfico del iceberg de costos** (Sistema de Riesgos del Trabajo, slide 20) trae "Ilust. 4"
  al pie y habla de "las técnicas del control de pérdidas moderno": es una figura reproducida de un
  libro, y **la cátedra no da la referencia**.
- **La infografía de prestaciones 2022** (slide 16) no declara qué organismo la publica.
- **La tabla de clasificación de accidentes** ([[clasificacion-de-accidentes-por-tipo-y-agente]])
  no tiene autor ni fecha: sólo dice "Referencias de Prevención de Riesgos".
- **El [[apunte-iram-10005]]** no tiene autor, ni fecha, ni número de edición de la norma que
  resume.

Ver [[bibliografia]].

## H-17 — Cinco normas nombradas al pasar, sin texto (prioridad baja)

[[res-srt-43-96]] · [[dec-1338-96]] · [[iram-2507]] · [[iram-def-d-1054]] · [[iram-10033]]

Cada una tiene su página, deliberadamente mínima, con lo único que la cátedra dice de ella. **No se
reconstruye su contenido de memoria** — un listado de estudios clínicos o un articulado mal citado
es peor que no citarlo (regla dura #2).

## H-18 — Las preguntas de la guía que nadie contestó (prioridad media)

De las 80 preguntas de [[guia-parcial-2-ambiental]], [[preguntas-ambiental-2017]] deja varias **sin
responder o respondidas sólo con una figura** que no se extrae del PDF. El listado exacto está en
[[banco-parcial-2-ambiental]], en la sección "Las preguntas que nadie contestó".

Las más caras, porque piden algo que no se puede inferir:

- **Preg. 11** — "Dibuje un diagrama de bloques general para el tratamiento de efluentes líquidos".
  [[tratamiento-de-efluentes-liquidos]] lo reconstruye y **lo marca como inferencia**.
- **Preg. 76** — la matriz energética argentina. **No hay porcentajes** y no se inventan.
- **Preg. 78** — el equivalente en CABA de las categorías de radicación industrial bonaerenses.
  Ver [[nivel-de-complejidad-ambiental]].
- **Preg. 52** — la más difícil del bloque de [[biodiversidad]]: el alumno no la contesta.

**Acción:** son las preguntas para llevar a clase cuando arranque el módulo 2.

## H-19 — La guía del parcial 2 no está fechada (prioridad alta)

Es el hueco más caro que abrió esta ingesta. [[guia-parcial-2-ambiental]] es la única fuente de
cátedra del módulo 2, y **nada en ella dice de qué año es**. Sus metadatos internos declaran
`CreationDate D:20170214` y su preg. 35 llama "reciente" a la cumbre de Kigali, que fue en 2016.

Toda la wiki del módulo 2 descansa sobre este documento. Si la cátedra cambió la guía, **18 páginas
de concepto apuntan a un temario viejo**. Ver C-24 en [[contradicciones]].

**Acción: preguntar en clase si esta guía sigue siendo la vigente.** Es la pregunta de mayor
retorno de toda la lista.

## H-20 — De qué año son los resúmenes de alumnos (prioridad baja)

[[resumen-ordonez]] fecha sus clases "jueves 10/3", "jueves 17/3", "lunes 28/3", "jueves 21/4": es
una cursada de **primer** cuatrimestre, y la de 2026 es de segundo (arranca el lunes 3/8). Con eso
alcanza para saber que **no es de esta cursada**, que es lo que importa.

**Deliberadamente no se infirió el año calendario a partir de los días de la semana.** Sería
adivinar. [[resumen-velasco]] no trae ninguna fecha.

Sirve para calibrar cuánto pesa lo que adelantan: ver C-16 en [[contradicciones]], que muestra que
el material de cátedra se actualiza entre años.

## H-21 — Cinco temas del módulo 1 que sólo tenemos por resumen de alumno (prioridad media)

La ingesta del 2026-08-25 sumó diez páginas de concepto del módulo 1 que **la cursada 2026 todavía
no dictó**. Todas abren con el callout de fuente de alumno, pero conviene tenerlas juntas:

| Página | Qué cierra del temario | Riesgo |
|---|---|---|
| [[investigacion-de-accidentes]] | tema 15 | El método completo, pero sin soporte 2026 |
| [[sistemas-de-gestion]] | tema 13 | Todo el glosario de gestión viene de OHSAS, no de ISO 45001 |
| [[programa-de-seguridad-efectivo]] | tema 11 | Dos de sus siete elementos el resumen sólo los nombra |
| [[modelos-de-accidentes]] | tema 3 | Dos genealogías distintas — ver C-22 |
| ~~[[05-01-contaminantes-quimicos-y-cmp]], [[05-02-riesgo-electrico]], [[05-03-proteccion-contra-incendios]]~~ | tema 6 y tema 9 | **Cerrado el 2026-09-15**: las tres tienen soporte de cátedra en [[clase-05]] (de 2020, del mismo docente). El resumen resultó ser una copia de esos slides |
| [[iluminacion]], [[ruido]] | tema 6 | Siguen sólo por resumen. Si la carpeta se llama `clase-riesgos1`, es razonable esperar una `clase-riesgos2` con estos temas |

**Acción:** cuando la cátedra dicte estos temas, cotejar y anotar diferencias. Hasta entonces, es
material para anticipar, no para citar como cátedra.

## H-22 — Cosas que las fuentes nuevas nombran y el vault no tiene (prioridad baja)

- **Frank Bird** — su pirámide (1969) aparece en [[resumen-ordonez]] y su nombre ya estaba en
  [[03-12-costos-del-accidente]]. No tiene página en `wiki/entidades/`. Ver C-20.
- **Blake (1950)** — tercera definición de accidente en el resumen, ausente de la cursada 2026.
  Ver C-19 y [[01-07-accidente]].
- ~~**Las 5 reglas de oro** de la consignación eléctrica: [[resumen-ordonez]] las nombra y **no las
  enumera**.~~ **Cerrado el 2026-09-15**: están en el slide 20 de [[clase-05]], con definición en
  el slide 19 y explicación en video. Ver [[05-02-riesgo-electrico]]. También se cerró la
  **atribución de la tabla de tensiones**: es "según el decreto 351" (Video Riesgo eléctrico,
  00:57).
- **El listado largo de legislación** de [[resumen-ordonez]] (p. 4): Dec. 170/96, Dec. 334/96,
  Ley 20.744, Dec. 390/76, Ley CABA 1.346, Dec. 49/14, Res. SRT 295/03, 84/12, 85/12, 801/15,
  861/15, 900/15, Dec. 911/96, Res. SRT 51/97, 35/98, 319/99, Dec. 617/97, Dec. 249/07,
  Res. SRT 311/03. Ninguna tiene página, salvo la **[[res-srt-900-15|900/15]]**, que la Clase 5
  cita con número (slide 21). **Se dejan nombradas, no reconstruidas.**
- **DR 1741/96** de provincia de Buenos Aires — la fuente del NCA, sin cotejar. Ver
  [[nivel-de-complejidad-ambiental]].

## H-23 — Los enunciados del compilado de finales que están sólo como imagen (prioridad media)

[[finales-soa-compilado]] pesa 49 MB porque **la mayoría de las consignas son capturas de pantalla**.
El texto extraído trae la explicación pero no siempre la pregunta. Para recuperarlas hay que
rasterizar:

```bash
pdftoppm -png -r 90 "raw/examenes/FINALES SOA [COMPILADO].pdf" /ruta/scratchpad/img/final
```

Es el mismo modo de fallo que H-06 y que el de [[aspt-trabajo-relevamientos]], ahora en la fuente
que más información táctica tiene sobre el examen. Ver [[guia-de-finales]].

## H-24 — El extractor pierde las letras griegas (prioridad baja)

Las preguntas 50 a 53 de [[guia-parcial-2-ambiental]] dicen "biodiversidad **α**", "**β**",
"**γ**" — y en `.cache/txt/` aparecen **vacías**: el PDF las escribe con la fuente Symbol en el
rango de uso privado de Unicode (U+F061, U+F062, U+F067) y `tools/extraer.py` las descarta.

Sin la letra, las cuatro preguntas son indistinguibles y la 52 pierde el sentido. Se recuperaron de
[[preguntas-ambiental-2017]], que las transcribe como "(alpha)", "(beta)", "(gamma)".

Es un modo de fallo **silencioso** y distinto del de los slides rasterizados: no falta texto, falta
un carácter. Anotado en `.plans/FIXES.md` (S-13).

## H-28 — Lo que la Clase 5 nombra y el vault no tiene (prioridad media)

[[clase-05]] es la primera fuente de cátedra del bloque de riesgos específicos, y como toda clase
grabada remite a material de apoyo que no llegó a `raw/`:

| Qué | Dónde lo nombra | Nota |
|---|---|---|
| El **video de arc flash** de una empresa de textiles ignífugos, con maniquíes | Clase 5, slide 13 (URL de YouTube `K3TymjMxzJQ`); Video Riesgo eléctrico, 03:32 | Apoyo visual; no es contenido evaluable |
| **Dos videos cortos de las 5 reglas de oro** aplicadas (un tablero de BT, una subestación de MT/AT) | Video Riesgo eléctrico, 22:22 | El docente pide seguirlos con el panfleto del slide 20 a mano |
| Las **tablas de distancias de seguridad** para trabajos con tensión que "la ley misma tiene" | Video Riesgo eléctrico, 13:56 | Del [[dec-351-79]]; no se reproducen ni se reconstruyen |
| La clase de **requisitos legales** que el docente da por pendiente | Video Contaminación, 29:08 | Es la unidad 3 del programa ("pirámide de documentación", ver H-26) |
| La **fecha de Cromañón** | Video Incendios, 32:36: "creo que 2006" | El docente duda; ninguna otra fuente la trae. **No se corrige sin fuente** |
| El "video de la clase inicial sobre riesgos laborales" con la foto del matafuego colocado demasiado alto | Video Incendios, 44:15 | De la clase 1 de **2020**, no de la de 2026 |
| Los **valores de la tabla de límites** más allá de las 13 sustancias del extracto | Clase 5, slide 6 ("PARCIAL") | La tabla completa es del Dec. 351/79 |
| Cuál es la **respuesta de cátedra** a la pregunta "tensión o intensidad" | C-29 en [[contradicciones]] | Pregunta para llevar a clase |

**Acción:** pedir en clase los dos videos de las 5 reglas de oro si se vuelven a usar; el resto es
verificación contra InfoLeg o pregunta directa.

## Cómo se usa esta página

Cada vez que se ingesta una fuente nueva: cerrar los huecos que resuelva y abrir los que revele.
Un hueco que se cierra **no se borra**: se marca como cerrado, con la fuente que lo cerró, para que quede el
rastro de qué se sabía y desde cuándo.
