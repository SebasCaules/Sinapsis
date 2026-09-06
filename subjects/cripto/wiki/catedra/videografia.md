---
title: Videografía
resumen: 'Mapa de los 20 videos grabados que existen de la materia, de tres orígenes distintos: qué es cada pieza, quién la dicta, qué temas del programa cubre y cuáles quedan sin grabación.'
fuentes: ["[[cronograma]]", "[[programa-y-objetivos]]", "[[teoria-de-numeros]]"]
aliases: [Videografía, Videos de la cátedra, Videos del docente, Playlist de Ramele, Cryptography and Information Security]
type: catedra
clase: catedra
orden: 5
created: 2026-08-25
updated: 2026-09-04
tags: [catedra, videos, playlist, youtube, ramele, pinilla, cronograma, filmografia, ingerida]
sources: ["Playlist 'Cryptography and Information Security' (YouTube, canal @faturita) — fuente externa, no está en raw/", "Los 20 videos, mirados el 03/09/2026", "Metadata de yt-dlp: video.info.json de cada video"]
---

# Videografía

> **Fuente:** [Playlist *Cryptography and Information Security*](https://www.youtube.com/playlist?list=PLJHMIS4ekxNRi0ulNhReN3errur5BN0J5) — canal [`@faturita`](https://www.youtube.com/@faturita), de **Rodrigo Ramele**, uno de los docentes que dictan la teoría.
> **Ésta sigue siendo la única nota del vault cuya fuente no está en `raw/`.** Nadie de la cátedra pasó esta playlist. Ver [[#De dónde sale esto|De dónde sale esto]].
> **Los 20 videos están mirados** desde el 03/09/2026, y cada uno de los 13 de la playlist tiene su nota propia en [[video-01-criptografia-simetrica|videos/]]. Esta nota es el **mapa**: qué existe, quién lo dicta, qué es cada cosa y qué queda sin cubrir.

Esta nota trae **qué material grabado existe de la materia y para qué sirve cada pieza**. Son **20 videos y 17 horas y media**, de **tres orígenes distintos** que conviene no mezclar, repartidos en nueve años.

Esta nota hacía una sola cosa —mapear títulos contra el cronograma— porque no se había mirado nada. Ahora que están todos vistos, hace tres: mapea, **corrige lo que el mapeo por títulos había inferido mal**, y manda a la nota de cada video para el contenido.

---

## Qué cambió al mirarlos

La versión anterior de esta nota infería el contenido de cada video a partir del título y de dónde lo ubica el programa. Estaba explícitamente rotulado como inferencia, y estuvo bien que lo estuviera: **la mitad se cayó.**

| Lo que esta nota afirmaba | Qué pasó al mirarlo |
|---|---|
| "Son 13 videos" | La playlist tiene **14 entradas**. La decimocuarta está **privada** y es inaccesible. Ver [[#El video privado\|El video privado]]. |
| "Los 13 son todos de Ramele" | **Falso.** Dos son del **Ing. Lautaro Pinilla**, y lo dice la descripción de YouTube de cada uno. Ver [[#Quién dicta qué\|Quién dicta qué]]. |
| "Son grabaciones de las clases de teoría" | **Cierto para 11 de 13.** Los dos de teoría de números son material didáctico producido aparte, y uno queda sin determinar. Ver [[#Qué es cada cosa\|Qué es cada cosa]]. |
| "Una tanda por cuatrimestre" | **Falso.** Los 13 vienen de al menos siete cursadas repartidas entre 2017 y 2026. Es un acopio histórico subido en lotes. |
| "La coincidencia de fechas cierra el mapeo" | **Se cae, pero no por donde parecía.** Las fechas estaban bien; lo que no vale es la inferencia. Ver [[#La fecha de subida no dice cuándo se dictó\|La fecha de subida no dice cuándo se dictó]]. |
| *Integridad #1* cubre las filminas 1-21 y *#2* las 22-41 | **Refutado en los dos extremos.** El #1 llega a la **22** y **saltea la 17**; el #2 arranca en esa **misma 22**. Ver [[#El corte de los dos videos de Integridad\|El corte de los dos videos de Integridad]]. |
| *Criptografía Simétrica* es "otra versión del mismo tema" | **Es la grabación literal de la Clase 2 del 13/08**, la que cursaste. Ver [[video-01-criptografia-simetrica\|video-01]]. |
| La segunda *Principios de Diseño* "se deja listada, no porque haya que mirar las dos" | **Sí hay que mirar las dos**: son decks distintos con ejemplos disjuntos. |
| Los dos *Pentesting* son dos versiones del mismo tema | **Son dos clases distintas, de dos docentes distintos**, sin una sola herramienta en común. |

---

## De dónde sale esto

Los dos videos de teoría de números —[Euclides extendido](https://www.youtube.com/watch?v=KgnrX6I_Nd4) y [Guía rápida a teoría de números](https://www.youtube.com/watch?v=FcM8RpBvkf4)— llegaron al vault como dos `.txt` de una línea en `raw/apuntes/`, y están enmarcados en [[teoria-de-numeros|teoría de números]]. Los dos son del canal `@faturita`, y **ese canal tiene una playlist entera de la materia**.

Lo que hay que tener claro sobre la procedencia:

- **La cátedra no publicó esta playlist.** No aparece en ningún PDF de `raw/material_Catedra/`, ni en las filminas, ni en ninguna transcripción. Lo único que Ramele linkeó explícitamente son los dos de teoría de números.
- **Pero el canal es de un docente de la cátedra**, y eso está confirmado dentro del vault: en la Clase 02, Ramele dice *"2 vídeos míos"* refiriéndose a los de teoría de números. El mismo handle firma los repos de [[implementaciones-de-referencia|implementaciones de referencia]].
- **Diez de los trece son videos ocultos** (*unlisted*): no salen en la búsqueda de YouTube ni en la lista pública del canal, pero se acceden porque la playlist los sirve. Los tres públicos son los dos de teoría de números y *Vulnerabilidades*.
- **No hay contrato de disponibilidad, y ya se cobró una pieza.** La entrada decimocuarta de la playlist pasó a privada. Un video oculto puede seguir el mismo camino cualquier día.

### Cómo se verificó cada dato

Todo lo que esta nota afirma sobre metadatos —título, autor, duración, fecha, público u oculto— sale del `video.info.json` que baja `yt-dlp`, no de leer la página. Todo lo que afirma sobre **contenido** sale de haber mirado el video: transcripción en castellano (pista `es-orig`) más frames extraídos por detección de escena.

> **Ojo con las fechas de `yt-dlp`.** El campo `upload_date` viene en **UTC**, y como estos videos se suben de noche, seis de los trece caen en el día siguiente. Todas las fechas de esta nota están convertidas a **hora argentina**, que es la que corresponde para compararlas con el cronograma.

---

## El corpus completo: tres orígenes

No es un corpus, son tres, y mezclarlos es el error fácil.

| Origen | Cuántos | Duración | Quién | Dónde está el contenido |
|---|---|---|---|---|
| **Playlist de teoría** de `@faturita` | 13 | 17h 06 | Ramele (11) y Pinilla (2) | Una nota por video en [[video-01-criptografia-simetrica\|videos/]] |
| **Videos de la Práctica 2** | 4 | 14 min | **Ana Arias**, 2020-2021 | [[practica-02-videos\|Práctica 02 — Videos]] |
| **Píldoras formativas** que linkea la Práctica 3 | 3 | 17 min | **UPM / Criptored**, guion de Jorge Ramió | [[practica-03-seudoaleatoriedad-y-modos\|Práctica 03]] |

Los tres últimos **no son de la cátedra**: son material externo de la Universidad Politécnica de Madrid que la filmina de la Práctica 3 linkea. Los cuatro de Ana Arias sí son de la cátedra, pero son de la **práctica**, no de la teoría, y son de otra cursada.

---

## La playlist: 14 entradas, 13 accesibles

### El video privado

La playlist lista **14** entradas. La que ocupa el sexto lugar, `wbMkmmtksrc`, devuelve `Private video` y su `oembed` da HTTP 403: **no es accesible**, ni siquiera con los clientes alternativos de `yt-dlp` que sí recuperan otros videos ocultos. No se puede saber qué es.

Lo único que se puede decir es dónde está: **entre las dos versiones de *Principios de Diseño***, la de 2024 y la de 2026.

> ***(Lectura nuestra.)*** Por posición, el candidato natural es una **tercera versión de Principios de Diseño**, de una cursada intermedia. Pero el orden de la playlist no es estrictamente temático —*Criptografía Simétrica*, que es de la Clase 2, está **última**—, así que la posición no alcanza para afirmarlo. Es también el único candidato a tapar alguno de los [[#Los cuatro huecos del Bloque 2|huecos del Bloque 2]], y no hay forma de saberlo.

### Los 13, con sus datos duros

La columna *Qué es* distingue las tres categorías de [[#Qué es cada cosa|Qué es cada cosa]].

| Video | Dur. | Subido | Docente | Qué es | Ancla en el [[cronograma]] | Nota de clase |
|---|---|---|---|---|---|---|
| [[video-01-criptografia-simetrica\|01 Criptografía Simétrica]] | 2h 04 | sáb 22/08/2026 | Ramele | clase en vivo | **Clase 2**, 13/08 — es *esa* clase | [[clase-02-cifrado\|Clase 02]] |
| [[video-02-guia-rapida-a-teoria-de-numeros\|02 Guía Rápida a Teoría de Números]] | 31 min | lun 09/04/2018 | Ramele | video didáctico | Tarea de la **Clase 2** · base de la **Clase 4** | [[clase-04-criptografia-asimetrica-y-firma-digital\|Clase 04]] |
| [[video-03-algoritmo-de-euclides-extendido\|03 Algoritmo Euclides Extendido]] | 14 min | sáb 17/06/2017 | Ramele | video didáctico | idem | [[clase-04-criptografia-asimetrica-y-firma-digital\|Clase 04]] |
| [[video-04-integridad-de-la-informacion-1\|04 Integridad de la Información #1]] | 1h 10 | jue 27/03/2025 | Ramele | clase en vivo | **Clase 3**, filminas 1-22 | [[clase-03-macs-y-cifrado-autenticado\|Clase 03]] |
| [[video-05-integridad-de-la-informacion-2\|05 Integridad de la Información #2]] | 54 min | jue 27/03/2025 | Ramele | clase en vivo | **Clase 3**, filminas 22-41 | [[clase-03-macs-y-cifrado-autenticado\|Clase 03]] |
| [[video-06-principios-de-diseno-2026\|06 Principios de Diseño (2026)]] | 1h 02 | dom 17/05/2026 | Ramele | clase en vivo | **Clase 8**, 15/10 | [[clase-08-principios-de-diseno-y-vulnerabilidades\|Clase 08]] |
| [[video-07-principios-de-diseno-2024\|07 Principios de Diseño (2024)]] | 1h 07 | vie 10/05/2024 | Ramele | clase en vivo | **Clase 8**, 15/10 | [[clase-08-principios-de-diseno-y-vulnerabilidades\|Clase 08]] |
| [[video-08-vulnerabilidades\|08 Vulnerabilidades]] | 49 min | jue 02/06/2022 | Ramele | **sin determinar** | **Clase 8** · **Guía 9**, 02/11 | [[clase-08-principios-de-diseno-y-vulnerabilidades\|Clase 08]] |
| [[video-09-pentesting-metodologia\|09 Pentesting: metodología]] | 1h 39 | lun 03/11/2025 | Ramele | clase en vivo | **Clase 8** · **Guía 9**, 02/11 | [[clase-08-principios-de-diseno-y-vulnerabilidades\|Clase 08]] |
| [[video-10-pentesting-laboratorio\|10 Pentesting: laboratorio]] | 2h 22 | mar 02/07/2024 | **Pinilla** | clase en vivo | idem | [[clase-08-principios-de-diseno-y-vulnerabilidades\|Clase 08]] |
| [[video-11-flujo-de-informacion\|11 Flujo de Información]] | 52 min | vie 10/05/2024 | Ramele | clase en vivo | **Clase 9**, 22/10 · **Guía 8**, 26/10 | [[clase-09-flujo-de-informacion\|Clase 09]] |
| [[video-12-proteccion-de-datos-personales\|12 Protección Corpo de Datos Personales]] | 1h 19 | vie 07/11/2025 | Ramele | clase en vivo | **Clase 11**, 05/11 *(corregido, ver nota abajo)* | Sin nota — la Clase 11 sigue sin deck |
| [[video-13-tips-sobre-el-final\|13 Tips Generales sobre el Final]] | 2h 56 | mar 02/07/2024 | **Pinilla** | clase en vivo | **Final**, fuera del cronograma | — |

> **Los títulos van tal cual YouTube los tiene.** *"Protección Corpo de Datos Personales"* se lee raro porque es *"Corporativa"* cortado. No se corrige acá: los títulos van literales.

> **Corrección a la fila del `12`.** Esta tabla llegó a mapearlo también hacia la **Clase 10** — Seguridad en la empresa, 29/10 —, además de la Clase 11. La propia nota de [[video-12-proteccion-de-datos-personales|video-12]] lo descarta: lo que hay hacia la Clase 10 son dos referencias hacia atrás, a una clase de pentesting ya dictada — *"acá volvemos a lo que vieron conmigo… yo lo di en el marco de pen testing"* (38:52) —, no contenido de seguridad de redes. Ancla correcta: **sólo Clase 11**. La Clase 10 sigue sin ningún video, y su [[clase-10-seguridad-en-la-empresa#Estado de las fuentes|nota]] ya lo deja asentado.

---

## Quién dicta qué

**No son todos de Ramele**, y esto no hace falta inferirlo: lo dice la descripción de YouTube de los propios videos.

| Video | Descripción textual en YouTube |
|---|---|
| `10` Pentesting | *"72.44 - Criptografía y Seguridad Informática. Clase sobre Pentesting **por el Ing. Lautaro Pinilla**"* |
| `13` Tips sobre el Final | *"Tips generales sobre el final de la materia. **Por el Ing. Lautaro Pinilla**"* |

Los dos se subieron el mismo día, con un minuto de diferencia. Son de un ayudante, subidos al canal de Ramele.

Esto importa por dos razones. La primera es de atribución. La segunda es práctica: **el video que explica cómo se toma el final no lo dicta ninguno de los dos docentes que dan la teoría este cuatrimestre**, así que lo que dice sobre el examen hay que leerlo como lo que es —la experiencia de un ayudante en 2021— y no como una instrucción vigente de la cátedra.

Las descripciones, además, traen el temario que el propio autor le puso a cada video, y eso el mapeo por títulos no lo tenía:

| Video | Temario según su descripción |
|---|---|
| `04` | *"CPA y CCA · Message Authentication Codes"* |
| `05` | *"Funciones de Hash Criptográficas · HMAC · Merkle-Damgård"* |
| `09` | *"Pentesting · Programación Defensiva"* |
| `11` | *"Control de Acceso dinámico · Flujo de Información · Entropía. Entropía Condicionada. · Relación de Dominancia Bell-LaPadula · Aislamiento: VMs y Sandboxing"* |

---

## Qué es cada cosa

La nota afirmaba que los 13 son grabaciones de clases. Al mirarlos, se parten en tres grupos.

### Once son clases en vivo

Y la evidencia no es ambigua: hay alumnos con nombre y apellido, turnos de habla, negociación del recreo en tiempo real y despedidas. Algunos ejemplos, todos de los propios videos:

- `01` — *"¿Se entiende esto, chicos? Preguntas."* (51:35) · *"Interrúmpanme cuando quieran"* (65:38) · *"estoy en mi casa hoy"* (10:28)
- `04` — *"Hola a todos. Bueno, empezamos la grabación"* (00:04), y cierra negociando la hora del recreo con el curso: *"¿Hacemos 17:20? Dale. Sí, hagamos 17:30."*
- `05` — *"Uriel, ¿te animás a decirla? Si no te animás con el micrófono, a escribirla"* (29:22) · *"yo los voy a ir a buscar para el parcial"* (53:28)
- `11` — *"alguien que se anime a explicarlo, vale tirar fruta"* (13:13) · *"la última hora se solapa con redes"* (51:39)
- `13` — sesión de **Blackboard Collaborate** con el chat de alumnos visible en pantalla, incluido el aviso *"Se están grabando los mensajes de este chat"*

### Dos son videos didácticos, no clases

Los **dos de teoría de números** (`02` y `03`) son exactamente lo que esta nota negaba: material producido aparte.

- **Cero marcas de audiencia**, en ninguna categoría, en las 4081 y 1690 palabras de sus transcripciones: ni vocativos, ni preguntas al curso, ni nombres, ni micrófono, ni recreo, ni despedida. Todos los demás videos con transcripción tienen marcas en varias categorías a la vez.
- **El propio Ramele los llama "video", no "clase"**, y remite de uno al otro: *"en el otro vídeo está el resultado con Euclides extendido"* (`02`, 12:24). Un docente en clase no le recomienda a los alumnos presentes mirar otro video para el paso que acaba de saltear.
- Son cámara cenital sobre papel, sin pantalla compartida ni interfaz de videoconferencia.

Y hay confesión directa en otro video: en `05` (46:17), en clase en vivo, Ramele dice *"yo después les voy a subir un video también"*. Distingue explícitamente entre la clase que está dando y los videos que sube aparte.

### Uno queda sin determinar

`08` *Vulnerabilidades* no tiene **ni una** marca de audiencia en 7088 palabras, pero tampoco marca de estudio: es screencast puro de filminas, sin webcam ni interfaz de videoconferencia. Puede ser una clase remota donde nadie habló, o una grabación hecha en soledad. **Con lo disponible no se puede decidir, y esta nota no elige.**

---

## Cuatro videos que son dos jornadas

Trece videos no son trece clases. Dos pares son **una sola jornada partida en dos archivos**, y se nota en que se subieron con un minuto de diferencia:

| Jornada | Videos | Subidos | Cómo se sabe |
|---|---|---|---|
| Integridad de la información | `04` + `05` | jue 27/03/2025, 20:40 | El `04` termina negociando el recreo; el `05` arranca inmediatamente después sin repasar nada. |
| Principios de diseño y flujo | `07` + `11` | vie 10/05/2024, 10:47 y 10:48 | El `07` cierra: *"hacemos un descansito... volvemos y media, que vamos a ver flujo de información"*. El `11` abre: *"varios de los principios de diseño [de los que] charlamos hoy"*. |

El tercer par del mismo día, `10` + `13` (mar 02/07/2024, 23:04 y 23:05), **no** es una jornada: son dos clases distintas de Pinilla subidas juntas.

### El corte de los dos videos de Integridad

Era el pendiente más barato de verificar de toda la nota y **salió mal**, en los dos extremos. Contra el PDF de 41 filminas de la [[clase-03-macs-y-cifrado-autenticado|Clase 03]]:

- El **`04`** recorre las filminas **1 a 22**, no 1 a 21. Termina con la **22** —funciones de hash— en pantalla durante sus últimos **5 min 33 s**. O sea que el pasaje a los esquemas **sin clave** ocurre dentro del primer video, no del segundo.
- El **`04` saltea la filmina 17**, el ejercicio de los tres MACs candidatos: pasa de la 16 (52:35) directo a la 18 (52:55).
- El **`05` arranca en esa misma filmina 22** y de ahí sí va limpio hasta la 41. La 22 se explica **dos veces**, una por video: 12 min 31 s de clase sobre la misma página.
- **La filmina 17 no la da ninguno de los dos.** Es la única de las 41 que no aparece en pantalla en ningún momento.

El detalle minuto a minuto de qué filmina está proyectada está en las notas de [[video-04-integridad-de-la-informacion-1|video-04]] y [[video-05-integridad-de-la-informacion-2|video-05]].

> **Por qué la inferencia parecía cerrar.** El deck se parte en dos mitades limpias y la sesión del 27/08 de la cursada 2026 se detuvo justo en la juntura. Era una hipótesis razonable; simplemente no era cierta. El conteo también engañaba: el `04` muestra **21 filminas distintas**, pero son las 1-16 y 18-22 — le falta la 17 y le sobra la 22.

---

## La fecha de subida no dice cuándo se dictó

Ésta era la pata más fuerte del mapeo anterior: dos videos subidos en noviembre de 2025 caían, con un día de corrimiento, en el mismo día de semana que el cronograma de 2026 asigna a esos temas.

**Las fechas estaban bien.** Convertidas a hora argentina, *Pentesting* se subió el **lunes 03/11/2025** y *Vulnerabilidades* un **jueves**, tal como decía la nota. Lo que no vale es la conclusión, y hay un contraejemplo que la liquida:

> El video `10` se subió el **02/07/2024**. Los archivos que el docente sube en vivo al servidor durante esa clase se ven en pantalla con su fecha de modificación: **`2021-06-17 16:57`**. La clase es de **junio de 2021**, subida **tres años después**.

Lo mismo, más flojo, en `13`: la pestaña del navegador en pantalla dice **2021**, y se subió el mismo día que el `10`.

Conclusión: **la fecha de subida marca cuándo se publicó el lote, no cuándo se dictó la clase.** Los 13 vienen de al menos siete cursadas distintas entre 2017 y 2026, y se subieron en tandas mucho después. La coincidencia de noviembre sigue siendo llamativa, pero es una coincidencia, no una regla.

Lo que **sí** ancla una fecha de dictado, cuando existe, es evidencia interna al video:

| Video | Ancla interna | Cuándo se dictó |
|---|---|---|
| `01` | Es la grabación de la Clase 2 pt1, verificado contra la transcripción del vault | **13/08/2026** |
| `06` | *"la charla que dieron los de Hong Kong"* en el rectorado, *"la semana pasada"* (17:08) | 1C 2026 |
| `10` | `Last modified 2021-06-17 16:57` en el servidor, en pantalla | **17/06/2021** |
| `13` | Pestaña del navegador: *"(2021 …) 72.44"* | 2021 |

---

## Qué cubre y qué no

### El Bloque 1 ya no lo necesita

Las tres clases del Bloque 1 que tienen video **ya están ingeridas desde su propia fuente**, y el video no agrega habla:

- **Clase 2** — el video `01` **es** la grabación de la clase del 13/08 que ya está en `raw/` como transcripción. Lo único que aporta es el **canal visual sincronizado**: qué página del deck está proyectada en cada minuto. Eso es real y útil, pero no es contenido nuevo. Aporta menos que la transcripción, que llega **4 min 35 s más lejos** e incluye el encargo de la tarea y la bibliografía del parcial.
- **Clase 3** — los videos `04` y `05` son de **Ramele en 2025**; la clase de este cuatrimestre la dio **Abad**. Sirven para **contrastar dos docentes sobre el mismo deck**. Hasta el 04/09 el `05` era además **la única fuente hablada** sobre las filminas 22-41; dejó de serlo cuando se ingirió la [transcripción del 03/09](../../raw/clases/Clase%2003pt2%20-%20Transcripcion.VTT), que es la sesión real de esta cursada.
- **Clase 4** — los videos `02` y `03` son la tarea de teoría de números y siguen siendo lo único que hay de eso; el `03` resuelve $41x - 19y = 8$ entera, paso a paso. Pero **la Clase 4 en sí —RSA, Diffie-Hellman, firma digital— ya no depende de ellos**: desde el 04/09 tiene su propio deck de 41 filminas en [[clase-04-criptografia-asimetrica-y-firma-digital|Clase 04 — Criptografía asimétrica y firma digital]]. Los dos videos siguen siendo el andamiaje previo, no el contenido de la clase.
- **Clase 5** — sin video, y sigue sin video. Pero, igual que la Clase 4, ya tiene deck propio: [[clase-05-protocolos-criptograficos|Clase 05 — Protocolos criptográficos]].

### Los cuatro huecos del Bloque 2

Así se llamaba esta sección hasta el 04/09, cuando la premisa era literal: el vault **no tenía ni una sola filmina** de las Clases 6 a 11, así que los videos eran la única esperanza para todo el Bloque 2. Ese mismo día llegó deck para las Clases 6 a 10. La pregunta cambia: ya no es *"qué tema no tiene ninguna fuente"*, sino *"qué tema sigue sin video que lo respalde"* — y ahí los cuatro huecos originales no se movieron un milímetro, porque **ningún video nuevo apareció en el canal**. Lo que cambió es que tres de los cuatro dejaron de ser vacíos de contenido:

| Tema del programa | Filmina (desde el 04/09) | Video |
|---|---|---|
| Principios de diseño | Sí — Clase 8 | **Sólida y doble** — `06` vigente más `07` complementario |
| Vulnerabilidades y modelado de amenazas | Sí — Clase 8 | **Sólida** — `08` más el cierre del `06` |
| Pentesting: metodología | Sí — Clase 8 | **Sólida** — `09` |
| Pentesting: práctica | Sí — Clase 8 (mismo deck que metodología) | **Parcial** — `10`, laboratorio reconstruible pero **sin una palabra de lo hablado** |
| Flujo de información, confinamiento, canales ocultos | Sí — Clase 9 | **Sólida** — `11` |
| Protección de datos y compliance | **No** — la Clase 11 sigue sin deck | **Sólida** — `12`, única fuente |
| **Control de acceso, ACLs, listas de capacidades** | **Sí, nuevo** — deck de Control de acceso, Clase 6 | **Sigue nula** |
| **Políticas y modelos de seguridad** | **Sí, nuevo** — deck de Políticas, Clase 6 | **Sigue nula** — sólo la relación de dominancia aplicada |
| **Autenticación** | **Sí, nuevo** — filminas 16-46 del deck de Aplicaciones, Clase 7 | **Sigue nula** — pero tres videos la rozan, ver [[#La tensión de la Clase 07\|más abajo]] |
| **Malware** | **No** — el deck de flujo de información (Clase 9) no lo menciona ni una vez | **Sigue nula** |

Tres de los cuatro huecos originales se taparon con filmina el mismo día que se documentó esta nota: control de acceso y políticas llegaron en el deck fusionado de la [[clase-06-politicas-de-seguridad-y-control-de-acceso|Clase 06]] *(fusión que es decisión del vault, no de la cátedra — la propia nota lo declara)*, y autenticación llegó en la mitad del deck compartido de la [[clase-07-autenticacion|Clase 07]]. Ninguno de los tres tiene, todavía, un solo minuto de video que lo dicte: la única evidencia de que la cátedra los explica en voz sigue siendo, para control de acceso, la cita del `07` de más abajo.

**El hueco que queda —el único de los cuatro que sigue siendo un vacío total, sin filmina ni video que lo desarrolle— es el malware.** Nominalmente es la segunda mitad de la Clase 9 (el cronograma la llama *"Flujo de información y malware"*), pero su propia nota de clase confirma **cero menciones** en las 27 filminas del deck, y la búsqueda sobre los ocho videos del Bloque 2 devuelve **una sola mención**: una anécdota de ransomware en una pyme argentina, en el `12`. No hay taxonomía en ningún lado.

**Y aparece un hueco distinto, de otra naturaleza: la Clase 11 — Protección de datos, la única clase de todo el Bloque 2 que sigue sin ningún deck.** No es un hueco de video —el `12` la cubre entera y en detalle, y sigue siendo la mejor cubierta de las once clases del cronograma en ese sentido—, sino un hueco de filmina: no hay PDF de la cátedra, no hay fecha de cuándo podría aparecer, y la única fuente sigue siendo una grabación de otro docente en otra cursada. Es el hueco simétrico al que tapó esta ingesta: donde antes faltaba filmina en seis clases y sobraba video en una, ahora falta filmina en una sola.

Hay evidencia interna de que la cátedra dicta control de acceso en clases que no se grabaron. En el `07` (04:35):

> [!quote]- Del video 07 — control de acceso se dicta en otra clase (04:35-04:57)
> — *"la parte de control de acceso ya la vieron con Pablo, ¿no?… o todo el tema de AC[L] y lista de capacidades."*
> — *"No, todavía no, no, eso no."*
> — *"Okay, porque hicimos un enroque. Y si bien acá algo se toca… lo mandamos para el final, queda, creo que va a ser en **dos clases**."*

*(Lectura nuestra.)* El mapeo del vault junta control de acceso y políticas en **una sola clase** (la 06), no en las **dos** que menciona esta cita — son decisiones de catalogación distintas, hechas en momentos distintos, y esta nota no puede confirmar si coinciden con lo que la cátedra termine dictando.

Un matiz que conviene no confundir: el `11` trae *"control de acceso dinámico"* (filmina 16, 40:33), pero eso es **flujo de información con etiquetas**, no la clase de control de acceso. Y lo que trae de **Bell-LaPadula** es la **relación de dominancia** aplicada al flujo, no el modelo completo: no hay *simple security property*, ni *star-property*, ni Biba, ni Clark-Wilson, ni Chinese Wall.

> ***(Lectura nuestra.)*** Para autenticación, control de acceso y políticas ya no hace falta seguir buscando en video: están en la filmina de sus clases respectivas. Para malware, sigue sin haber nada del vault, y hay que ir al campus o a **Bishop** — al que los propios videos remiten: cap. 12-13 desde el `07`, cap. 23 desde el `09` *(justo el capítulo de malware)*, cap. 16 y 17 desde el `11`. Para protección de datos, mientras la Clase 11 no tenga deck propio, el `12` sigue siendo la única fuente completa. Ver [[bibliografia|Bibliografía]].

### Filmina contra video, ahora que se puede comparar

Hasta el 04/09 esta pregunta no tenía con qué contestarse: no había filmina de ninguna clase del Bloque 2, así que "¿el video da lo mismo que el deck?" no era una pregunta que se pudiera hacer. Ahora sí, clase por clase:

| Clase | Deck(s) | Video más cercano | Veredicto |
|---|---|---|---|
| [[clase-06-politicas-de-seguridad-y-control-de-acceso\|Clase 06 — Políticas y control de acceso]] | Políticas (56 filminas) + Control de acceso (43) | `11` (fragmento) | **Otra cosa.** El `11` sólo aplica la dominancia de Bell-LaPadula al flujo de información; no sigue este deck, no nombra ACLs ni listas de capacidades. |
| [[clase-07-autenticacion\|Clase 07 — Autenticación]] | Filminas 16-46 del deck de Aplicaciones | Ninguno la dicta | **No hay para comparar** — pero `06`, `07` y `12` la rozan con ejemplos sueltos; ver [[#La tensión de la Clase 07\|la tensión de la Clase 07]] más abajo. |
| [[clase-08-principios-de-diseno-y-vulnerabilidades\|Clase 08 — Principios de diseño y vulnerabilidades]] | Aplicaciones 2-15 + Análisis de vulnerabilidades (22) + Pentesting (32) | `07`, `08`, `09` | **Cubren lo mismo, verificado por la propia nota de clase.** El deck de principios coincide textualmente con `07` (2024), no con `06` (2026) — que sigue aportando dos piezas propias, la analogía del castillo y el bloque de LLM. El deck de vulnerabilidades comparte nombre de archivo con el que proyecta `08`, con un desfasaje mínimo de una página sin resolver. El de pentesting coincide filmina por filmina con `09`. `10` es la excepción: **otra cosa** — laboratorio práctico de otro docente, sin deck compartido y sin una palabra de audio disponible. |
| [[clase-09-flujo-de-informacion\|Clase 09 — Flujo de información]] | 27 filminas | `11` | **Cubre lo mismo**, filmina por filmina y en el mismo orden, sobre un archivo con otro nombre pero idéntico contenido — es el caso más limpio de todo el corpus. |
| [[clase-10-seguridad-en-la-empresa\|Clase 10 — Seguridad en la empresa]] | 36 filminas | Ninguno | **No se puede saber** — ningún video de la playlist toca seguridad de redes, firewalls ni DMZ, ni de refilón. |

### La tensión de la Clase 07

Esta nota clasifica la cobertura en video de la Clase 7 como **nula** en la tabla y en la fila de arriba, y es cierto: **ningún video la dicta**, ninguno sigue el deck de autenticación ni lo nombra como tema propio. Pero eso no equivale a que ningún video la roce, y decirlo así —como hacía esta nota antes del 04/09— se leía mal frente a lo que ya documentan las notas de concepto de esa misma clase. La propia [[clase-07-autenticacion#Estado de las fuentes|Clase 07 — Autenticación]] lo resuelve así, y esta nota dice lo mismo para no contradecirla:

- **[[video-06-principios-de-diseno-2026|06 — Principios de diseño (2026)]]**: los `HSM` bancarios y la anécdota `admin`/`admin`, citados en [[almacenamiento-de-claves#Archivo cifrado|Almacenamiento de claves]] y en [[ataques-a-un-sistema-de-autenticacion#El ejemplo online, verificado con dos videos de la cátedra|Ataques a un sistema de autenticación]].
- **[[video-07-principios-de-diseno-2024|07 — Principios de diseño (2024)]]**: el token bancario, RENAPER y Worldcoin, citados en [[factores-de-autenticacion#Algo que tengo: la brecha entre el objeto y el canal|Factores de autenticación]].
- **[[video-12-proteccion-de-datos-personales|12 — Protección de datos personales]]**: el PIN de Apple, citado en [[ataques-a-un-sistema-de-autenticacion#Offline sin límite: el caso del PIN de Apple|Ataques a un sistema de autenticación]] y en [[complejidad-y-espacio-de-claves#Cuando el control de ejecución falla, el espacio de claves queda desnudo|Complejidad y espacio de claves]].

Los tres son ejemplos incidentales mientras el video desarrolla otro tema —principios de diseño o protección de datos—, no una clase de autenticación. La distinción que ya usan las notas de concepto es la correcta: **ningún video dicta la Clase 7, pero tres la cruzan**, y esta nota adopta la misma redacción para que las tres no se contradigan.

### Las clases sin ningún video

| Clase | Fecha | Qué hay en su lugar |
|---|---|---|
| **Clase 1** — Introducción y criptografía clásica | 06/08 | Sin video, pero con la [transcripción completa](../../raw/clases/Clase%2001-Transcripcion.VTT) del 06/08, ya ingerida. |
| [[clase-04-criptografia-asimetrica-y-firma-digital\|Clase 4 — Criptografía asimétrica]] | 10/09 | Sin video propio, pero ya no es el hueco que era: tiene deck completo de 41 filminas desde el 04/09. Sólo el andamiaje previo de teoría de números sigue en video (`02`, `03`). |
| [[clase-05-protocolos-criptograficos\|Clase 5 — Protocolos criptográficos]] | 17/09 | Sin video, pero con deck completo desde el 04/09. |
| [[clase-06-politicas-de-seguridad-y-control-de-acceso\|Clase 6 — Políticas de seguridad y control de acceso]] | 01/10 | Sin video que la dicte —sigue siendo uno de los [[#Los cuatro huecos del Bloque 2\|huecos de video de arriba]]—, pero con deck completo (dos decks fusionados) desde el 04/09. |
| [[clase-07-autenticacion\|Clase 7 — Autenticación]] | 08/10 | Sin video que la dicte, idem, aunque tres la rozan de refilón — ver [[#La tensión de la Clase 07\|la tensión de la Clase 07]]. Con deck completo (mitad de un archivo compartido con la Clase 8) desde el 04/09. |

---

## Qué mirar y cuándo

Ordenado por cuándo te sirve, y con la advertencia de cuándo **no** conviene mirarlo.

Desde el 04/09 el criterio cambia para todo el Bloque 2: donde antes el video **era** la fuente, ahora casi siempre hay que leer primero el deck de la [[#Los 13, con sus datos duros|clase correspondiente]] y usar el video sólo para lo que la filmina no trae.

1. **Ahora, para el Parcial 1** — los dos de teoría de números, [[video-02-guia-rapida-a-teoria-de-numeros|02]] (31 min) y [[video-03-algoritmo-de-euclides-extendido|03]] (14 min). Son **la tarea que el docente encargó** y dijo que sirve para el parcial, y siguen siendo el andamiaje que conviene tener antes de leer el deck de la [[clase-04-criptografia-asimetrica-y-firma-digital|Clase 04]]. 45 minutos, el mejor retorno del corpus.
2. **Para la segunda mitad de la Clase 3** — [[video-05-integridad-de-la-informacion-2|05]] (54 min). Ya no es lo único hablado sobre las filminas 22-41 —desde el 04/09 está la [transcripción del 03/09](../../raw/clases/Clase%2003pt2%20-%20Transcripcion.VTT), volcada en la [[clase-03-macs-y-cifrado-autenticado#12. La segunda sesión: cómo retoma el 03/09|Clase 03]]—, pero sigue siendo la **única versión de Ramele** de ese tramo, y donde difiere de Abad hay una lectura de la cátedra que ninguna filmina fija.
3. **No mires el [[video-01-criptografia-simetrica|01]] para enterarte de la Clase 2.** Es la misma clase que ya cursaste y que el vault tiene entera. Conviene mirar tramos puntuales para ver qué filmina va con qué explicación.
4. **Clases 6 y 7 — solo la filmina.** [[clase-06-politicas-de-seguridad-y-control-de-acceso|Clase 06]] y [[clase-07-autenticacion|Clase 07]] tienen deck completo y ningún video que las cubra de verdad: mirar `06`, `07`, `11` o `12` enteros buscando estos dos temas ya no rinde, porque lo poco que aportan son cruces puntuales que las propias notas de concepto ya citan (ver [[#La tensión de la Clase 07|la tensión de la Clase 07]]).
5. **Clase 8 — filmina primero, después el video que corresponda a cada tercio.** Es la clase con más deck (68 filminas repartidas en tres decks) y más video (cinco de los ocho de la playlist). Leído el deck, [[video-09-pentesting-metodologia|09]] desarrolla en voz el tercio de pentesting filmina por filmina; [[video-07-principios-de-diseno-2024|07]] hace lo mismo con el tercio de principios de diseño (es el deck que coincide con **éste**, no con `06`); [[video-08-vulnerabilidades|08]] con el de vulnerabilidades. `06` aporta sólo dos piezas que no están en ningún otro lado —la analogía del castillo y el bloque de seguridad de LLM—, y `10` es aparte: un laboratorio práctico sin relación de deck, útil como caso hands-on, inútil como clase.
6. **Clase 9 — filmina o video, da lo mismo por dónde entrar.** [[video-11-flujo-de-informacion|11]] sigue el deck de [[clase-09-flujo-de-informacion|Clase 09]] filmina por filmina y en el mismo orden; el video suma los ejemplos hablados que ninguna filmina trae (el ventilador del servidor para la entropía condicional, entre otros).
7. **Clase 10 — sólo filmina.** No hay ningún video de la playlist que toque seguridad de redes, firewalls o DMZ.
8. **Sólo si vas al final** — [[video-13-tips-sobre-el-final|13]] (2h 56). Ojo: es de 2021 y de un ayudante, no de los docentes actuales.

---

## Pendientes

- **Recuperar el audio del [[video-10-pentesting-laboratorio|video-10]].** Es el único de los 20 sin transcripción de ningún tipo: no tiene subtítulos y se miró sólo por frames, o sea 2h 22 de clase práctica sin una palabra de lo hablado. **El audio existe** y se recupera con una clave de Whisper sin volver a bajar nada. Es, por lejos, el mayor retorno por esfuerzo que queda.
- **Preguntar en clase si la cátedra avala la playlist.** El docente linkeó dos videos; los otros once los encontramos nosotros. Sigue abierto; ya no pesa como antes —desde el 04/09 sólo la Clase 11 depende de estos videos como fuente completa—, pero autenticación, control de acceso, políticas y malware siguen sin ningún respaldo hablado, sea de la cátedra o de esta playlist.
- **Averiguar qué es el video privado.** Ya no es candidato a tapar el hueco de control de acceso ni el de políticas —ambos se taparon con filmina—; sigue siendo el único candidato a explicar malware o a completar la Clase 11, y no hay forma de verlo sin que el dueño dé acceso.
- **Chequear que los links sigan vivos** antes de apoyarse en ellos cerca de un parcial. Diez de trece son ocultos y uno ya se perdió.
- **Confirmar si hay más videos fuera de la playlist.** Los ocultos no se pueden enumerar: sólo aparecen los que la playlist lista.

## Ver también

- **Las 13 notas de video**, una por cada uno: [[video-01-criptografia-simetrica|01]] · [[video-02-guia-rapida-a-teoria-de-numeros|02]] · [[video-03-algoritmo-de-euclides-extendido|03]] · [[video-04-integridad-de-la-informacion-1|04]] · [[video-05-integridad-de-la-informacion-2|05]] · [[video-06-principios-de-diseno-2026|06]] · [[video-07-principios-de-diseno-2024|07]] · [[video-08-vulnerabilidades|08]] · [[video-09-pentesting-metodologia|09]] · [[video-10-pentesting-laboratorio|10]] · [[video-11-flujo-de-informacion|11]] · [[video-12-proteccion-de-datos-personales|12]] · [[video-13-tips-sobre-el-final|13]]
- [[cronograma|Cronograma]] — el calendario contra el que se mapeó todo esto
- [[programa-y-objetivos|Programa y objetivos]] — el mapeo tema ↔ clase del que sale la columna de anclas
- [[reglamento-y-evaluacion|Reglamento y evaluación]] — qué es el examen final al que apunta el video `13`
- [[bibliografia|Bibliografía]] — a dónde ir para malware, el único tema que hoy no cubre ni filmina ni video
- [[teoria-de-numeros|Teoría de números]] — la nota que encarga los videos `02` y `03`
- [[practica-02-videos|Práctica 02 — Videos]] — los cuatro videos de Ana Arias sobre secreto perfecto
- [[practica-03-seudoaleatoriedad-y-modos|Práctica 03 — Seudoaleatoriedad y modos]] — las tres píldoras de la UPM
- [[clase-02-cifrado|Clase 02 — Cifrado simétrico]] — la clase que el video `01` graba
- [[clase-03-macs-y-cifrado-autenticado|Clase 03 — MACs y cifrado autenticado]] — la clase que cubren los videos `04` y `05`
- [[clase-04-criptografia-asimetrica-y-firma-digital|Clase 04 — Criptografía asimétrica y firma digital]] — el deck que ya no depende de los videos `02` y `03`, aunque siguen siendo su andamiaje
- [[clase-05-protocolos-criptograficos|Clase 05 — Protocolos criptográficos]] — sin video, con deck propio desde el 04/09
- [[clase-06-politicas-de-seguridad-y-control-de-acceso|Clase 06 — Políticas de seguridad y control de acceso]] — deck nuevo, video que sigue sin cubrirla
- [[clase-07-autenticacion|Clase 07 — Autenticación]] — deck nuevo, ningún video la dicta, tres la rozan
- [[clase-08-principios-de-diseno-y-vulnerabilidades|Clase 08 — Principios de diseño y vulnerabilidades]] — la clase con más deck y más video del Bloque 2
- [[clase-09-flujo-de-informacion|Clase 09 — Flujo de información]] — el caso más limpio: deck y video coinciden filmina por filmina
- [[clase-10-seguridad-en-la-empresa|Clase 10 — Seguridad en la empresa]] — deck nuevo, sin ningún video
- [[indice|Índice de la wiki]]
