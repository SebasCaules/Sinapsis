---
titulo: Ruido
tipo: concepto
modulo: [1]
clase: []
division: "1"
tags: [ruido, higiene-industrial, sonido, sordera-profesional, decibel]
fuentes: [resumen-ordonez, finales-soa-compilado, aspt-trabajo-relevamientos]
actualizado: 2026-08-25
estado: en-desarrollo
aliases: [sonido, nivel-sonoro, sordera-profesional, decibel, db]
resumen: 'Sonido es una vibración mecánica que se propaga en un medio elástico —en el vacío no se propaga— y ruido es sonido indeseable; se mide en escala logarítmica porque entre el umbral audible y el de dolor hay un factor de 1.000.000, y su daño es irreversible: se pierden las células de la cóclea, y la primera frecuencia que se pierde es la de 4.000 Hz.'
---

> [!warning] Adelanto de fuente de alumno — la cursada 2026 todavía no dio este tema
> Este contenido viene de [[resumen-ordonez]], un resumen de alumno de una cursada anterior, y de
> [[finales-soa-compilado]], un compilado de finales resueltos por alumnos: **no de un soporte de
> clase de 2026**. Sirve para anticipar qué viene y qué se toma, no como cita de cátedra. Cuando la
> cátedra lo dicte, cotejar y anotar las diferencias en [[contradicciones]]. Ver
> [[modulo-1-seguridad]].
>
> La única excepción, señalada en su lugar, es el límite de **85 dB en 8 horas**, que sí aparece en
> un soporte de cátedra 2026 ([[aspt-trabajo-relevamientos]]).

## En una línea

**Sonido** es una vibración mecánica que se propaga en un medio elástico —**en el vacío no se
propaga**— y **ruido** es sonido indeseable; se mide en escala logarítmica porque entre el umbral
audible y el de dolor hay un factor de **1.000.000**, y su daño es **irreversible**: se pierden las
células de la cóclea, y **la primera frecuencia que se pierde es la de 4.000 Hz**.

## Desarrollo

### Sonido y ruido no son lo mismo

Las dos definiciones, textuales (Resumen Ordoñez, p. 6):

> - "**Sonido**: vibración mecánica que se propaga en un medio elástico (**en el vacío no se
>   propaga**)."
> - "**Ruido**: es un sonido indeseable, inarticulado y confuso."

| | Sonido | Ruido |
|---|---|---|
| Qué es | Un **fenómeno físico**: vibración mecánica en un medio elástico | Una **categoría de juicio**: sonido indeseable, inarticulado y confuso |
| Requiere medio material | **Sí** — en el vacío no se propaga | Ídem, es un sonido |
| Se define por | Su mecanismo de propagación | El **efecto sobre quien lo recibe** |

> [!important] "En el vacío no se propaga" está subrayado en la fuente por una razón
> Es el dato que separa al ruido de casi todos los demás agentes de higiene industrial que trae el
> módulo. La [[iluminacion|luz]] es radiación electromagnética y **sí** viaja en el vacío; el sonido
> necesita materia que vibre. De ahí se sigue algo muy práctico: **el ruido se puede cortar
> interrumpiendo el camino material**, y por eso la barrera acústica (encerramiento, montaje
> antivibratorio, aislación del piso) es un control de ingeniería que realmente funciona, mientras
> que "apantallar" la luz no la elimina.
>
> Y hay una segunda consecuencia, que es la que explica el paréntesis "y **vibración**" del ítem del
> relevamiento: **ruido y vibración son el mismo fenómeno en dos medios**. La vibración es lo que se
> transmite por la estructura; el ruido, lo que se transmite por el aire. La misma máquina genera
> los dos.
>
> > **Inferencia:** las dos consecuencias son lectura nuestra. El resumen da la definición y el
> > paréntesis, sin desarrollarlos.

**El ruido es una definición subjetiva y la fuente lo asume**: "indeseable" no es una propiedad
física de la onda, es una relación con quien escucha. La misma música a 95 dB es sonido para el que
la eligió y ruido para el vecino — y **el daño auditivo es exactamente el mismo en los dos casos**.

### Por qué la escala es logarítmica

> "**Medición del Nivel Sonoro**: como la respuesta del oído al estímulo es logarítmica, la relación
> entre el umbral audible y el de dolor es muy grande = **1.000.000**. Luego es conveniente usar una
> escala logarítmica para medir niveles de intensidad (presión)."
>
> (Resumen Ordoñez, p. 6)

El argumento tiene dos patas, y conviene no confundirlas porque la fuente las encadena rápido:

| Pata | Qué afirma |
|---|---|
| **Fisiológica** | La **respuesta del oído** al estímulo es logarítmica: el oído no percibe diferencias absolutas de presión, percibe **razones** |
| **De rango** | La relación entre el **umbral audible** y el **umbral de dolor** es de **1.000.000** |

Juntas dan la conclusión: **una escala lineal es inservible acá**. Un rango de un millón a uno no se
grafica ni se tabula sin comprimirlo, y comprimirlo en logaritmo es además lo que hace la propia
percepción. De ahí el **decibel**.

> [!note] Lo que el resumen **no** dice de la escala
> No aparece en ninguna parte del texto extraído: la **fórmula** del nivel sonoro, la **presión de
> referencia**, la diferencia entre **dB, dB(A) y dB(C)**, ni la regla de que sumar dos fuentes
> iguales suma 3 dB. Esta página **no las escribe** (`CLAUDE.md` §6, regla 2). Anotado en [[huecos]].
>
> Lo que sí queda claro y es preguntable: **1.000.000** es la relación audible/dolor, y **el número
> es el argumento** de por qué la escala es logarítmica.

### Los tres efectos biológicos del ruido

Textual, en el orden y con la numeración del resumen (Resumen Ordoñez, p. 6):

| # | Efecto | Qué incluye, textual |
|---|---|---|
| **1** | **Sobre el aparato auditivo** | "disfunción, **sordera profesional**, desplazamiento transitorio del umbral" |
| **2** | **Efectos psicológicos** | "menor concentración, menos reflejos, **mayor cantidad de accidentes**" |
| **3** | **Interferencia en la comunicación hablada** | *(sin desarrollo en la fuente)* |

Los tres no son de la misma naturaleza, y esa es la lectura que hay que llevarse:

- **El 1 es el daño directo**, y ya tiene nombre legal: **"sordera profesional"** es
  [[01-02-enfermedad-profesional|enfermedad profesional]], del tipo que el [[dec-658-96]] lista con
  su agente de riesgo, su cuadro clínico y sus actividades. Dentro del punto 1 conviven además dos
  cosas distintas: el **desplazamiento transitorio del umbral** —la sordera pasajera de después del
  recital, que se recupera— y la **sordera profesional**, que no.
- **El 2 y el 3 son daño indirecto: el ruido como causa de accidente.** Esto es lo que convierte al
  ruido de un tema de higiene en un tema de **seguridad**. "Menos reflejos" y "mayor cantidad de
  accidentes" es el ruido operando sobre la **probabilidad** de la ecuación `R = P × G`
  ([[01-05-riesgo]]), y "interferencia en la comunicación hablada" es el ruido **anulando una
  barrera**: si el compañero grita "¡pará!" y no se lo escucha, la barrera existía y no funcionó.

> [!important] El ruido ataca por los dos lados de `R = P × G`
> Sobre la **gravedad** deja una enfermedad profesional irreversible. Sobre la **probabilidad**
> degrada atención, reflejos y comunicación, es decir, **desarma barreras de otros peligros**. Es el
> mismo patrón que la [[iluminacion]]: son agentes que dañan por sí mismos **y** deterioran la
> capacidad de la persona de defenderse de todo lo demás.
>
> Por eso un [[03-01-aspt|ASPT]] en un sector ruidoso no puede tratar al ruido como un riesgo más
> de una fila: contamina el análisis de todos los pasos. El documento de la cátedra lo usa
> justamente como **ejemplo del quinto criterio de selección de trabajos** —los trabajos de rutina,
> "en donde los empleados están continuamente expuestos a los riesgos inherentes. Por ejemplo,
> **alto nivel de ruido**" (ASPT, p. 3)—.
>
> > **Inferencia:** la lectura de los tres efectos repartidos entre P y G es nuestra. La fuente
> > enumera.

### Lo que agrega el final: el oído no se repara

> [!important] Esto **cayó en un final** y es el contenido más específico de la página
> Final **1Q2020, Sección Ocupacional, pregunta 3**. La consigna quedó en el compilado como
> **captura de pantalla del examen** —era una toma en línea, con casillas— y el caché de texto no la
> levanta. Se transcribe de la página 13 rasterizada:
>
> > "**¿Cuál es la frecuencia que es más importante para identificar si está comenzando un proceso
> > de pérdida de audición?**
> > [ ] Banda de los 3000 Hz. [ ] Banda de los 5000 Hz. [ ] Banda de los 2000 Hz.
> > **[x] Banda de los 4000 Hz.**"
> >
> > (Finales SOA, p. 13)
>
> **La casilla marcada en la captura es la de 4.000 Hz**, y las otras tres opciones son bandas
> vecinas: 2.000, 3.000 y 5.000. **No hay forma de acertar por descarte** — o se sabe el número o no.

La explicación que dejaron los compiladores, textual (Finales SOA, p. 13):

> - "**El oído no es un órgano reparable.**"
> - "**Se pierden pelitos de la cóclea.**"
> - "Cada zona de la cóclea recibe ciertas frecuencias."
>   - "La **primera zona que se pierde es la de 4000 Hz**. Esto se suele usar cómo indicativo de si
>     la persona fue expuesta por mucho tiempo a un ruido."

El razonamiento completo, en cuatro pasos:

1. **La cóclea está tonotopizada**: cada zona responde a un rango de frecuencias.
2. **La exposición prolongada destruye las células de una zona antes que las de las otras** — la de
   4.000 Hz.
3. **Esa pérdida es irreversible**: "el oído no es un órgano reparable". No hay recuperación ni
   reparación quirúrgica de lo perdido.
4. Por lo tanto, **una caída en la banda de 4.000 Hz en una audiometría es el marcador temprano** de
   exposición prolongada a ruido: aparece **antes** de que la persona note que oye peor, porque
   4.000 Hz está por encima del grueso de las frecuencias de la voz.

> [!note] Sobre "pelitos" y sobre el paso 4
> - La fuente escribe **"pelitos de la cóclea"**. El término técnico es **células ciliadas**
>   (*hair cells*): son las células sensoriales del órgano de Corti, y su nombre viene justamente de
>   los estereocilios que las coronan. **La glosa es nuestra, no de la fuente** — que sólo dice
>   "pelitos" — y va acá para que se entienda por qué "no se repara": las células ciliadas de
>   mamífero no se regeneran.
> - El **paso 4** (por qué 4.000 Hz sirve como marcador temprano, y su relación con el rango de la
>   voz) también es **inferencia nuestra**. La fuente afirma que se usa como indicativo; no explica
>   por qué funciona.

> [!important] La consecuencia práctica: en ruido, prevenir es lo único que sirve
> Que el daño sea **irreversible** cambia la ecuación de [[02-04-prevencion-y-proteccion]]. Con la
> mayoría de los peligros, la protección mitiga y el daño se repara —hay
> [[03-10-prestaciones-del-sistema|prestaciones en especie]], hay rehabilitación, hay
> recalificación—. Con la sordera profesional por ruido **no hay reparación posible**: la
> [[03-09-sistema-de-riesgos-del-trabajo|ART]] indemniza, y eso es todo lo que puede hacer.
>
> Es literalmente el principio que el resumen anota en su bloque de la clase 2, entre las
> consecuencias del accidente para el trabajador: *"**OJO! La compensación económica NUNCA balancea
> las pérdidas!**"* (Resumen Ordoñez, p. 3). El ruido es su caso más limpio.
>
> > **Inferencia:** la conclusión es nuestra; la cita de la compensación sí es de la fuente, pero
> > está escrita a propósito de los accidentes en general, no del ruido. **Ojo:** esa frase **no
> > aparece** en el texto de la [[clase-02]] de 2026 — es del resumen, no del soporte de esta
> > cursada.

### El único número de cátedra 2026 sobre ruido: 85 dB en 8 horas

La infografía de EPP de las clases 3-4 —**esta sí es fuente de cátedra de esta cursada**— dice, en el
bloque de protección auditiva:

> "Tapones y orejeras, desechables o reutilizables. Se elige según el entorno laboral y la eficacia
> del protector. **Debe evitarse que se supere el límite admisible de 85 decibeles durante un lapso
> de 8 horas de trabajo.**"
>
> (Trabajo ASPT, slide 4)

> [!important] Es el **único valor numérico** de toda esa lámina de EPP
> [[02-07-epp]] ya lo señala: de los ocho tipos de EPP que recorre la infografía, **el único que
> viene con un número es el auditivo**. Eso lo convierte en el candidato natural a dato preguntable,
> y además es el puente entre este bloque y lo que la cursada 2026 sí dictó.
>
> Notar la estructura del límite: **85 dB** *sobre* **8 horas**. Es la misma lógica de la
> [[05-01-contaminantes-quimicos-y-cmp|CMP]] —una concentración (acá, un nivel) **ponderada sobre la
> jornada**— aplicada al agente acústico en lugar del químico. No es "nunca más de 85 dB": es
> "no más de 85 dB promediados sobre el turno".
>
> > **Inferencia:** el paralelo con la CMP es nuestro. Ninguna de las dos fuentes los cruza, y el
> > slide no explicita si los 85 dB son un promedio ponderado o un tope instantáneo.

### El instrumento: Res. SRT 85/12

El resumen nombra, dentro de su listado de legislación aplicable y **sin desarrollarla**:

> "**RES SRT 85/12 Protocolo medición de ruido.**" (Resumen Ordoñez, p. 4)

> [!warning] Eso es **todo** lo que dice la fuente sobre la 85/12
> Número, año y una etiqueta de siete palabras. **No hay artículo, no hay contenido, no hay
> procedimiento.** Esta página no reconstruye qué exige el protocolo, con qué instrumento se mide,
> en qué puntos, ni cada cuánto: por la regla dura #2 de `CLAUDE.md`, una norma mal citada es peor
> que no citarla. Si se necesita, se va al texto oficial de la [[srt]] y ahí sí es fuente primaria
> (`CLAUDE.md` §4).
>
> Lo único afirmable hoy: **existe un protocolo oficial de medición de ruido y es la Res. SRT 85/12**
> — es decir, el verbo "monitorear" del bloque de higiene industrial tiene, para el ruido, un
> instrumento reglamentado propio, igual que la [[res-srt-84-12|84/12]] para iluminación y la
> [[res-srt-861-15|861/15]] para contaminantes químicos. Página pendiente: [[res-srt-85-12]].

## En la materia

Parte del **tema 6 del temario, "Tipos de peligros y riesgos"**, parcial según
[[modulo-1-seguridad]]. En el resumen cae en la **"Clase 3 — Lectura Libre"** (Resumen Ordoñez,
p. 6), material que en aquella cursada no se dictó en clase y se tomó igual.

De la cursada 2026, lo único que hay son **dos menciones laterales**, las dos en las clases 3-4:

- **"Ruido y vibración"** es uno de los **16 ítems** del listado de
  [[03-08-relevamiento-de-seguridad]] (Trabajo ASPT, slide 3), tomado de los capítulos del
  [[dec-351-79]].
- **"Alto nivel de ruido"** es el ejemplo del **quinto criterio de selección de trabajos** del
  [[03-01-aspt|ASPT]] — los trabajos de rutina con exposición continua (ASPT, p. 3).
- Y el **límite de 85 dB / 8 h** de la infografía de [[02-07-epp]] (Trabajo ASPT, slide 4).

**¿Apareció en un final? Sí.** Final **1Q2020, Sección Ocupacional, pregunta 3** (Finales SOA,
p. 13): **la frecuencia que marca el inicio de la pérdida de audición**, con cuatro bandas como
opciones y **4.000 Hz** como respuesta. Es una pregunta de dato puro: no se deduce, se sabe.

Si hay que priorizar tres cosas de esta página para un parcial: **4.000 Hz**, **1.000.000** y
**85 dB en 8 horas**.

## Relación con otros temas

- [[01-09-higiene-y-seguridad-industrial]] — el ruido es agente de **higiene industrial** (prevenir
  enfermedades ocupacionales) y a la vez causa de accidentes: cae de los dos lados de la partición.
- [[01-02-enfermedad-profesional]] y [[dec-658-96]] — la **sordera profesional** como enfermedad
  listada, con su agente de riesgo y sus actividades.
- [[01-05-riesgo]] — el ruido opera sobre los dos factores de `R = P × G`.
- [[01-07-accidente]] y [[01-08-incidente]] — los efectos psicológicos del ruido ("menos
  reflejos, mayor cantidad de accidentes") son un mecanismo causal explícito hacia el accidente; el
  daño auditivo, en cambio, no tiene incidente que lo anticipe.
- [[02-02-causas-de-los-accidentes]] — el ruido excesivo es **condición insegura**, y la
  "interferencia en la comunicación hablada" es exactamente la "comunicación pobre" que la cátedra
  lista entre las fallas de gestión (Clase 2, slide 7).
- [[02-03-barrera]] y [[02-04-prevencion-y-proteccion]] — encerramiento y aislación son barreras
  preventivas; tapones y orejeras, protectivas.
- [[02-06-jerarquia-de-controles]] — el orden correcto para atacar el ruido: eliminar la fuente,
  sustituir la máquina, encerrar (ingeniería), rotar personal (administrativo) y recién ahí el
  protector auditivo.
- [[02-07-epp]] — tapones y orejeras, y el límite de **85 dB en 8 horas**: el único número de toda
  la lámina de EPP.
- [[03-01-aspt]] — el ruido como ejemplo del quinto criterio de selección de trabajos (ASPT, p. 3).
- [[03-08-relevamiento-de-seguridad]] — "ruido y vibración", uno de los 16 ítems relevables.
- [[03-09-sistema-de-riesgos-del-trabajo]] y [[03-10-prestaciones-del-sistema]] — qué queda
  cuando el daño ya es irreversible: indemnización, no reparación.
- [[05-01-contaminantes-quimicos-y-cmp|contaminantes-quimicos-y-cmp]] y [[iluminacion]] — los otros dos bloques de la misma "Clase 3"
  del resumen; los tres son agentes que se miden con instrumento y se comparan contra un límite.
- [[dec-351-79]] y [[ley-19587]] — el marco legal de las condiciones de higiene, de donde sale el
  capítulo de ruido y vibración.
- [[iso-45001]] — el marco de gestión donde esta identificación de peligros se sistematiza.
- [[srt]] y [[res-srt-85-12]] — el organismo y el protocolo de medición, nombrado y no desarrollado.
- [[huecos]] — la fórmula del nivel sonoro, dB(A) vs. dB(C), y el contenido de la Res. SRT 85/12.

## Fuentes

- (Resumen Ordoñez, p. 6) — [[resumen-ordonez]]: las definiciones de sonido y ruido, el argumento de
  la escala logarítmica con el factor 1.000.000, y los tres efectos biológicos. **Fuente de alumno,
  cursada anterior.**
- (Resumen Ordoñez, p. 4) — la **Res. SRT 85/12**, nombrada en el listado de legislación aplicable,
  sin desarrollo.
- (Resumen Ordoñez, p. 3) — "la compensación económica NUNCA balancea las pérdidas", usada acá para
  el argumento sobre la irreversibilidad.
- (Finales SOA, p. 13) — [[finales-soa-compilado]], final **1Q2020, Sección Ocupacional,
  pregunta 3**: la consigna sobre la frecuencia (4.000 Hz) y la explicación sobre la cóclea. **La
  consigna es una captura de pantalla**; se transcribió de la p. 13 rasterizada a 110 dpi, donde la
  casilla marcada es legible.
- (Trabajo ASPT, slides 3 y 4) — [[aspt-trabajo-relevamientos]]: el límite de **85 dB en 8 horas** y
  el ítem "ruido y vibración" del relevamiento. **Fuente de cátedra 2026.**
- (ASPT, p. 3) — [[aspt-teoria]]: "alto nivel de ruido" como ejemplo del quinto criterio de selección
  de trabajos. **Fuente de cátedra 2026.**
