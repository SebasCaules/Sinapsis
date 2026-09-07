---
title: Video 01 — Criptografía simétrica
resumen: 'Grabación de la primera sesión de la Clase 02, cortada cuatro minutos y medio antes del final; el audio ya está transcripto, así que su único aporte es saber qué filmina estaba proyectada en cada minuto.'
fuentes: ["[[clase-02-cifrado]]", "[[videografia]]"]
aliases: [Video 01, Video de Criptografía Simétrica, Grabación de la Clase 02, Clase 02 en video, Filminas con timestamp]
type: video
clase: 2
orden: 40
video: 01
youtube: 6rUALsjX4uI
created: 2026-09-03
updated: 2026-09-04
tags: [video, cifrado, simetrico, clase-02, ramele, youtube, filminas, timestamps, flujo, bloque]
sources: ["https://www.youtube.com/watch?v=6rUALsjX4uI"]
---

# Video 01 — Criptografía simétrica

> **[Criptografía y Seguridad Informática - Criptografía Simétrica](https://www.youtube.com/watch?v=6rUALsjX4uI)** — **2h 04m 20s** · subido el **22/08/2026** · canal [`@faturita`](https://www.youtube.com/@faturita), **Rodrigo Ramele** · **video oculto** (*unlisted*): se accede por link, no aparece en la búsqueda ni en la lista pública del canal.
> **Mapea a la [[clase-02-cifrado|Clase 02 — Cifrado simétrico]], primera fecha: el jueves 13/08/2026.** No a las dos: sólo a la primera.
> Filminas proyectadas: [`Clase 02 - Criptografia - Cifrado.pdf`](../../raw/clases/Clase%2002%20-%20Criptografia%20-%20Cifrado.pdf), **páginas 1 a 44** de 64.
> Transcripción de la misma sesión, ya en el vault: [`Clase 02pt1-Transcripcion.VTT`](../../raw/clases/Clase%2002pt1-Transcripcion.VTT).

**Vale la pena verlo sólo si necesitas saber qué filmina estaba proyectada en cada minuto.** Para el contenido hablado no sirve: es el mismo audio que ya está transcripto en `raw/` e ingerido, palabra por palabra, en la [[clase-02-cifrado|nota de la Clase 02]] — y encima le faltan los últimos cuatro minutos y medio, que son los que dejan tarea de parcial.

---

## Lo que este video es

**No es "otra versión del mismo tema": es literalmente la grabación de la Clase 02, primera fecha, cortada 4 min 35 s antes del final.** No es un dictado paralelo, no es una edición de otro año, no es un empalme de dos jornadas. Es el mismo archivo de audio y pantalla que produjo `Clase 02pt1-Transcripcion.VTT`, subido a YouTube nueve días después.

Esto importa porque cambia por completo para qué sirve la nota. La [[videografia|Videografía]] enmarca los 13 videos como material a mirar; para éste, lo único que queda por mirar es la pantalla.

La identidad está medida, no supuesta:

| Evidencia | Resultado |
|---|---|
| 5-gramas del video que aparecen textuales en la transcripción del 13/08 | **59,1 %** (contra **0,4 %** en la del 20/08) |
| 8-gramas | **43,2 %** (contra **0,0 %**) |
| 12-gramas | **28,9 %** (contra **0,0 %**) |
| Anclas temporales cruzadas | **siete**, repartidas de punta a punta, todas dentro de $\pm 1$ s |

Las siete anclas, con el minuto del video y el de la transcripción de Zoom:

| Qué se oye | Video | Transcripción 13/08 |
|---|---|---|
| *"cuando leen de copias físicas mejora la retención"* | 00:32 | 00:31,99 |
| *"¿En dónde, María Agustina? ¿En qué 1 sobre n?"* | 19:16 | 19:01–19:20 |
| *"si tuvieras un epsilon exactamente 0 tendrías secreto perfecto"* | 1:00:17 | 1:00:17 |
| La pausa de café (*"me voy a buscar un cafecito"*) | ~1:08 | 1:08:44 |
| *"el problema no es que la clave no cambie, el problema es usar el mismo IV siempre"* | 1:36:46 | 1:36:40 |
| El gato (*"mi gato, perdón, me asustó… me abre una la puerta"*) | 1:40:43 | 1:40:42 |
| *"se comportan bastante bien como si fuesen funciones pseudoaleatorias"* | 2:04:15 | 2:04:11–2:04:18 |
| **Corte del video en mitad de "Estamos hasta…"** | **2:04:19** | **2:04:19** — y la frase sigue |

Que casi el 30 % de las secuencias de doce palabras coincidan palabra por palabra entre **dos motores de ASR distintos** (el de YouTube y el de Zoom) es firma de audio idéntico, no de "el mismo docente explicando el mismo tema". Y el gato, la pausa de café con el *"volvemos 17:30"*, Neal Stephenson y *Cryptonomicon*, Nikita Jruschov y el chiste del micrófono nuevo están en los dos, en el mismo minuto.

> Es, además, el único de los 13 videos de la playlist que cae **dentro de la cursada en curso**. Los otros doce vienen de al menos siete cursadas repartidas entre 2017 y 2026.

---

## Recorrido

La columna **Filmina** es el número de página del PDF de la Clase 02. Es lo que este video aporta y ninguna otra fuente del vault tiene: **el amarre entre el minuto y la lámina.**

| Tramo | Filmina | Qué pasa |
|---|---|---|
| 00:00 – 01:28 | — | Pantalla en negro los primeros segundos. Katz & Lindell: está en PDF público y en la biblioteca, y hay que leerlo **en papel** (*"mejora la retención por órdenes de magnitud"*) |
| 01:29 – 05:04 | 1–2 | Portada *"Criptografía: Cifrado"*. Repaso del criptosistema como terna, $d_k(e_k(m)) = m$, los conjuntos. Kerckhoffs y la digresión sobre Microsoft |
| 05:05 – 10:01 | 3 | Secreto perfecto y la paradoja. Un alumno lo lee como independencia estadística; el docente lo relee en clave de teoría de la información |
| 10:02 – 13:27 | 4 | One Time Pad. Guerra Fría, libros de claves, *Cryptonomicon*. La logística de la clave larga |
| 13:28 – 19:26 | 5–6 | Sello TOP SECRET y **Demostración (1)**, el lema $\Pr[C{=}c] = 1/N$ narrado paso por paso |
| 19:27 – 22:11 | 7 | **Demostración (2)**. Responde de dónde sale cada $1/N$: la clave es uniforme, ninguna puede ser más probable que otra |
| 22:12 – 24:20 | 8 | Las malas noticias: $\lvert K \rvert \geq \lvert C \rvert$, el reuso de clave, la clave uniforme. Busca cómo traducir *leakage* |
| 24:21 – 26:43 | 9–12 | Ejercicio de la clave sesgada. **Las páginas 11 y 12 traen la resolución completa y las pasa de largo** |
| 26:44 – 31:26 | 13 | Más allá del OTP. Ida y vuelta largo: ningún algoritmo actual tiene secreto perfecto, todos son públicos, el criptograma siempre filtra algo |
| 31:27 – 34:00 | vuelve a 4–8 | **Pasa el deck para atrás a toda velocidad** mientras responde por qué el OTP es irrompible. Es indistinguible de azar puro |
| 34:01 – 36:52 | 14–16 | Seguridad computacional, en tres *builds*. *"Le vamos a ir soltando la soga al adversario"* |
| 36:53 – 43:59 | 17 | Criptosistemas de flujo, y **siete minutos de interludio sin filmina**: ¿son deterministas las computadoras?, ¿lo es ChatGPT?, semillas y el anillo de enteros |
| 44:00 – 46:40 | 18 | El registro de desplazamiento realimentado, bit por bit |
| 46:41 – 49:15 | 19 | Definición formal de generador pseudoaleatorio |
| 49:16 – 50:47 | 20 | Ejemplo congruencial. Lo plantea y **no lo resuelve** |
| 50:48 – 54:33 | 21–22 | *"¿Cómo medimos la seguridad?"* y qué es una prueba de seguridad |
| 54:34 – 1:02:08 | 23 | **Prueba EAV**, los cinco pasos. Cierra con la equivalencia *epsilon exactamente cero = secreto perfecto*, que marca como clave |
| 1:02:09 – 1:06:22 | 24–25 | Nivel de seguridad, $\mathrm{PPT}(n)$, función despreciable. Después la lámina de EAV parametrizada |
| 1:06:23 – 1:09:38 | 26–27 | Teorema del cifrado de flujo y el ejercicio que deja. Chiste del micrófono y **pausa de café de unos cinco minutos** |
| 1:09:39 – 1:13:50 | 28–29 | Prueba MUL. **Acá está el único aviso de parcial del video** (1:12:52) |
| 1:13:51 – 1:21:30 | 30–31 | La solución del ataque MUL y la necesidad de cifrado probabilístico. Se traba explicándolo: *"tengo el dibujito en mis apuntes en papel"* |
| 1:21:31 – 1:24:56 | 32 | Nonce e IV, modo sincronizado y no sincronizado. *"El IV no es secreto ni en cero ni en el uno ni en nada"* (1:23:29) |
| 1:24:57 – 1:32:29 | 33 | **Prueba CPA** y el oráculo de encripción. De dónde sale la palabra *oráculo* |
| 1:32:30 – 1:39:58 | 34 | Propiedades CPA. Se abre la mejor discusión de la jornada: **cómo descifra el receptor si el cifrado es estocástico** |
| 1:39:59 – 1:45:25 | 35–36 | Primitivas de cifrado en bloque y padding. **A 1:40:43 se levanta a abrirle la puerta al gato** (frame en negro a 1:40:58) |
| 1:45:26 – 1:51:35 | 37–38 | Extensión a mensajes largos y `ECB`, con el cartel de prohibido |
| 1:51:36 – 1:57:53 | 39–40 | `CBC` y `CFB`. Con `CFB` se traba en el descifrado y **consulta sus hojas fuera de cámara** (~1:53:26) |
| 1:57:54 – 2:01:19 | 41–42 | `OFB` y `Counter`. El efecto avalancha como justificación de por qué `Counter` no es trivial de romper |
| 2:01:20 – 2:04:20 | 43–44 | Seguridad de los modos por reducción, y el cartel final. **Corta en mitad de la frase "Estamos hasta…"** |

> Los bordes de tramo tienen $\pm 1$ min de holgura donde el docente comenta una filmina antes o después de pasarla. El caso peor es `CBC`/`CFB`: la detección de escena ubica la lámina de `CFB` en 1:52:32, pero el hilo hablado la trabaja recién cerca de 1:55:30. ***(Lectura nuestra: la conciliación de las dos fuentes de timestamp es del armado de esta nota.)***

---

## El deck parte limpio en la mitad

Las 64 filminas del PDF se reparten sin solapamiento entre las dos fechas de la Clase 02, y este video establece el borde por imagen:

| Filminas | Fecha | Contenido | En el vault |
|---|---|---|---|
| **1–44** | 13/08 — **este video** | de la portada a *"Seguridad de cifrado por bloques"* con el cartel de las funciones pseudoaleatorias | [[clase-02-cifrado#El recorrido, tramo por tramo\|tramos 1 a 10]] |
| **45–64** | 20/08 — **no está en video** | DES, función de transformación, subclaves, 3-DES, AES, *round keys*, criptosistemas en proyectos, estados, recomendados, bibliografía | [[clase-02-cifrado#El recorrido, tramo por tramo\|tramos 11 a 13]] |

El corte se verifica en dos direcciones. Hacia adelante: `grep -icE "IBM|feistel|rijndael|AES|s-box"` da **0** en la transcripción del 13/08 y **12** en la del 20/08. Hacia atrás: el 20/08, a 1:18:10, el docente dice *"estos son los modos que vimos la clase pasada. Lo tienen al principio. Lo tienen grabado."*

**Esto confirma por imagen lo que la nota de clase tenía medido sólo por el borde del texto** — ver [[clase-02-cifrado#Estado de las fuentes|Estado de las fuentes]], donde la ausencia de filminas compartidas entre las dos fechas estaba marcada como lectura propia. Con el video, para las 44 primeras deja de serlo: se ve cuál está proyectada en cada minuto.

---

## Lo único que el video aporta

**El canal visual sincronizado, y nada más.** Las transcripciones son audio sin filminas; el PDF son filminas sin tiempo. El video es la única fuente que ata las dos cosas.

Concretamente, tres cosas que sólo se saben mirando:

1. **Qué lámina corresponde a cada minuto** — la tabla de [[#Recorrido|Recorrido]].
2. **Dónde pasa el deck de corrido, para atrás y para adelante**, sin comentar: 31:27–31:41, 36:16–36:31, 1:33:30–1:33:38, 1:34:34–1:34:47. Eso explica por qué la secuencia de láminas no es monótona y por qué las de resolución del ejercicio de la clave sesgada aparecen en pantalla aunque nunca se desarrollen.
3. **Que hay tramos largos hablando sobre una sola lámina fija** — 36:52 a 44:01 y 54:34 a 1:02:09. Son los dos interludios donde el contenido está enteramente en la voz.

**En contenido de habla, el aporte es cero.** Todo lo que dice está en `Clase 02pt1-Transcripcion.VTT` y ya está desarrollado en la nota de clase con número de cue. Eso incluye lo que un informe superficial listaría como "lo que el video agrega sobre las filminas", y que en realidad ya está ingerido:

| Lo que se dice y no está en ninguna lámina | Dónde ya está |
|---|---|
| Cómo descifra el receptor un cifrado probabilístico: la semilla se parte en clave secreta más IV público (1:29:40–1:32:00) | [[cifrado-probabilistico-nonce-e-iv\|02.06]] |
| Propagación de errores modo por modo (1:52:00–2:00:00) | [[modos-de-encadenamiento#Propagación de errores\|02.08 Modos § Propagación de errores]] |
| El interludio sobre determinismo, semillas y el anillo de enteros (38:44–43:00) | [[generador-pseudoaleatorio#La analogía del anillo\|02.04 Generador § La analogía del anillo]] · [[numeros-aleatorios-y-randomness\|Números aleatorios]] |
| Secreto perfecto como aporte de información cero | [[teoria-de-la-informacion\|Teoría de la información]] |
| *EAV da exactamente $0{,}5$* $\iff$ *secreto perfecto* (1:00:17) | [[pruebas-de-indistinguibilidad#El puente que la filmina no dibuja: el secreto perfecto como caso límite\|El puente que la filmina no dibuja]] |
| Qué tan chico tiene que ser epsilon: la palabra es *negligible*, no hay valor fijo | [[seguridad-computacional\|02.02]] |
| Efecto avalancha como defensa del modo `Counter` (2:00:07) | [[modos-de-encadenamiento\|02.08]] · [[funciones-de-hash-criptograficas\|03.06]] |
| Katz en papel y *Cryptonomicon* de Neal Stephenson | [[bibliografia\|Bibliografía]] |

---

## Lo que el video no tiene y la clase sí

**Se perdieron los últimos 4 min 35 s.** El video corta a 2:04:19; la grabación de Zoom sigue normal hasta el *"stop a la grabación"* a 2:08:55. En esa cola hay contenido de examen:

| Minuto (transcripción) | Qué se dice |
|---|---|
| 2:04:40 | Anuncia que va a subir **dos videos de teoría de números** de repaso |
| 2:04:55 | *"cómo resolver la ecuación diofántica o cómo resolver lo que es el algoritmo de Euclides extendido. **Eso le va a servir para el parcial**."* |
| 2:06:19 | Precisa la lectura: **Katz, capítulos 1, 2 y 3** — *"40 o 50 páginas"*. No "la primera parte" genérica |
| 2:07:31 | *"ahora lo van a ver con Ana. Ana les va a hacer un súper repaso"* |
| 2:07:48 – 2:08:14 | Intercambio sobre los ejemplares físicos en biblioteca: dos de la segunda edición más uno de la anterior |

**Esto invierte el balance de la nota.** El video tiene **un solo** aviso explícito de parcial (a 1:12:52, sobre el formalismo de las pruebas de seguridad). El segundo, el de teoría de números, está justo en el tramo que falta. Quien mire el video y no lea la transcripción se pierde **la mitad de las indicaciones de parcial de esa jornada** y toda la tarea que quedó asignada — que está desarrollada en [[teoria-de-numeros#1. De dónde sale esto: es tarea de la Clase 02|Teoría de números]] y que es de donde salen [[aritmetica-modular-y-divisibilidad|02.13]], [[algoritmo-de-euclides-extendido|02.14]] y [[inverso-modular|02.15]].

**No se sabe por qué corta ahí.** No hay nada en el audio que lo explique. Puede ser un recorte deliberado o un fallo de subida; no hay evidencia para decidirlo.

**Y falta la segunda fecha entera.** El 20/08 son 1h 25 más, con solapamiento del **0,4 %** de 5-gramas contra este video. DES, Feistel, cajas $S$, 3-DES, AES y los criptosistemas en proyectos no aparecen en ningún minuto de esta grabación, pese al título *"Criptografía Simétrica"* que le puso YouTube.

---

## Los ejercicios que quedan planteados

Son cuatro, y **dos ya vienen resueltos en el propio deck aunque el docente los pase de largo.** Vale la pena tenerlos completos.

### El ejemplo del One Time Pad

Filmina 4, a 10:02. **Son 17 bits, no 16.** Verificado renderizando la página del PDF:

$$\begin{aligned}
m &= 0\,0\,1\,0\,1\,1\,0\,1\,0\,0\,0\,1\,0\,1\,1\,1\,0\\
k &= 0\,1\,1\,0\,0\,1\,1\,1\,0\,1\,0\,0\,1\,1\,0\,1\,0\\
\hline
c &= 0\,1\,0\,0\,1\,0\,1\,0\,0\,1\,0\,1\,1\,0\,1\,0\,0
\end{aligned}$$

El xor cierra posición por posición en las 17. No lo recorre bit a bit: lo usa para mostrar que atrás del algoritmo no hay más que una tabla de verdad. → [[one-time-pad|02.01 One Time Pad]]

### La clave sesgada

Filminas 10 a 12, a 24:21. Enunciado: claves con $\Pr[K{=}00]=0{,}3$, $\Pr[K{=}01]=0{,}1$, $\Pr[K{=}10]=0{,}4$, $\Pr[K{=}11]=0{,}2$; mensajes con $\Pr[M{=}00]=0{,}60$, $\Pr[M{=}01]=0{,}15$, $\Pr[M{=}10]=0{,}10$, $\Pr[M{=}11]=0{,}15$. Se observa $c = 01$ y se pide $\Pr[M{=}00 \mid C{=}01]$.

**La resolución completa está en las páginas 11 y 12**, y él las pasa de largo dejándolas como tarea (*"ustedes después hagan esta cuenta y van a ver que empieza a aparecer información"*). Si alguna nota del vault marca este ejercicio como *sin resolver*, está mal:

$$\begin{aligned}
\Pr[C{=}01] &= \textstyle\sum_{k}\Pr[M = 01\oplus k]\cdot\Pr[K{=}k]\\
&= 0{,}15\cdot 0{,}3 + 0{,}6\cdot 0{,}1 + 0{,}15\cdot 0{,}4 + 0{,}1\cdot 0{,}2 = 0{,}185
\end{aligned}$$

$$\Pr[C{=}01 \mid M{=}00] = \Pr[K = 01\oplus 00] = \Pr[K{=}01] = 0{,}1$$

$$\Pr[M{=}00 \mid C{=}01] = \frac{0{,}1 \cdot 0{,}6}{0{,}185} = 0{,}32 \;\ne\; 0{,}60 = \Pr[M{=}00]$$

Con la clave no uniforme se pierde la independencia y el criptograma filtra información. Mencionó que en la práctica con Ana hay dos o tres ejercicios de este tipo. → [[one-time-pad#Ejercicio: qué pasa si la clave no es aleatoria|El ejercicio de la clave sesgada]]

### El ataque que gana la prueba MUL

Filminas 29 y 30, a 1:11:00 y 1:13:58. **La solución también está en el deck**, y es el ejercicio que él marca como típico de parcial. El adversario propone los vectores

$$(m_{00} = 0\ldots0,\; m_{01} = 0\ldots0) \quad\text{y}\quad (m_{10} = 0\ldots0,\; m_{11} = 1\ldots1)$$

recibe $c_1$ y $c_2$, calcula $X = c_1 \oplus c_2 = m_1 \oplus m_2$, y emite $b = 0$ si $X = 0\ldots0$ y $b = 1$ si no. Gana con probabilidad $1$.

Lo que se evalúa no es el resultado sino el procedimiento:

> [!quote]- Del video — el único aviso explícito de parcial de la grabación (1:12:52 y 1:13:13)
> *"Una cosa súper importante, esto tanto para el parcial, en el final aparece menos, pero sobre todo para el parcial, para el recuperatorio y también para que hagan los ejercicios."*
>
> *"Este es un procedimiento que apunta a dar formalismo a algo que normalmente no lo tiene, y lo poderoso de esto es el formalismo."* Y sobre cómo resolverlo: *"cuando lo tengan que hacer, es importante que hagan los pasos y que establezcan bien los pasos, qué son cada componente, y busquen hacer la demostración lo más formal posible"*.

→ [[pruebas-de-indistinguibilidad|02.05 Pruebas de indistinguibilidad]] · [[pruebas-de-indistinguibilidad#Cómo se escribe la respuesta: el aviso de la clase sobre el parcial|El aviso más explícito de la clase sobre el parcial]]

### Los dos que quedan sin resolver

- **Filmina 20, a 49:16.** Generar 5 bits con $G_0 = s$, $G_i = G_{i-1}\cdot 3 + 1 \bmod 11$, tomando cada $G_i \bmod 2$, para $s = 2$ y para $s = 6$. Ni el video ni el deck lo resuelven.
- **Filmina 27, a 1:07:30.** Demostrar que si $G$ se puede distinguir de una secuencia aleatoria, el criptosistema de flujo basado en $G$ no pasa la prueba `Eav`. Lo describe como *conectar las dos cosas* y lo deja planteado.

---

## Correcciones

Cuatro cosas que un pase apurado del video sugiere y que el cruce contra la transcripción de Zoom y el PDF desmiente. Van acá porque son fáciles de repetir.

**Es el primer encuentro, no el segundo.** El *"(repaso)"* de las filminas 2 y 3 es repaso de la [[clase-01-introduccion-y-criptografia-clasica|Clase 01]] —la que dio Pablo Abad—, no de una Clase 2 previa. La grabación del 20/08 abre con *"llegamos a que vimos la vez pasada"* y recapitula exactamente lo que este video desarrolla.

**La frase sobre el IV de 1:36:46 no es del docente.** *"El problema no es que la clave no cambie, el problema es usar el mismo IV siempre"* la dice **el alumno Juan Ignacio Causse**; Ramele sólo la ratifica después (*"Claro, claro"*). En el `.VTT` de Zoom está atribuida con nombre y apellido. Es una de las mejores frases de la jornada y conviene acreditarla bien.

**María Agustina nunca habla.** Lo único que hay en el audio es Ramele diciendo *"¿En dónde, María Agustina? ¿En qué 1 sobre n?"* a 19:16. Preguntó **por chat**. Ni el ASR de YouTube ni el `.VTT` registran un turno suyo.

**El ejemplo del OTP son 17 bits.** Ver arriba. Leído de un frame de 512 px daba 16 y con dígitos equivocados; renderizando la página del PDF cierra en 17.

> **Quiénes hablan.** El `.VTT` de Zoom trae etiquetas con nombre completo que el ASR de YouTube no puede dar. En esta jornada: **Rodrigo Ramele** (792 turnos), **Juan Ignacio Causse** (64), **Carlos Amador Vallejo Tapia** (7), **Sebastián Caules** (1) y **Juan Pablo Fernández** (1). Los alumnos no se ven nunca: el docente comparte sólo su pantalla.

---

## Erratas y deslices

Verificados contra el PDF, no contra el ASR. Son cinco entradas: las dos primeras son erratas de la lámina; la tercera es una precisión de redondeo que **no** es errata; la cuarta es un desliz del docente en voz; y la quinta es una observación sobre la notación de una filmina, que se reporta tal como está escrita, sin corregirla.

> **Errata de la filmina:** la página 4 atribuye el One Time Pad a *"Verman (1917)"*. El apellido es **Vernam**.

> **Errata de la filmina:** en la página 12, el paso intermedio está tipeado como $\Pr(K = 01 * M \mid M = 00)$, con un asterisco donde va el xor. Debería ser $\Pr(K = 01 \oplus M \mid M{=}00)$. El resultado que sigue es correcto.

> **Precisión (no es errata):** la página 12 escribe $\Pr[M{=}00 \mid C{=}01] = 0{,}32$ cuando la cuenta exacta da $0{,}06/0{,}185 = 0{,}3243$. Es un redondeo a dos decimales, no un error de la lámina.

**El registro de la filmina 18 vale 14, y él dice 15.** El diagrama carga $0\,0\,0\,0\,1\,1\,1\,0$ y a 44:00 el docente duda en voz alta y termina diciendo *"es 15"*. **Verificado renderizando la página 18 del PDF a 200 dpi**: los ocho bits se leen sin ambigüedad y dan $14$. Es un desliz suyo, no de la lámina — y coincide con la lectura que [[generador-pseudoaleatorio|Generador pseudoaleatorio]] ya hacía de la misma imagen.

> La filmina 17 escribe *"Por ejemplo: $\lvert K \rvert = 2^{128}$, $\lvert M \rvert = \lvert K \rvert^{128}$"*. La notación es rara y él la narra distinto en voz. Se reporta tal cual está escrita, sin corregirla.

---

## Qué no se ve

- **Sus apuntes en papel.** Los consulta fuera de cámara varias veces, sobre todo a ~1:53:26 cuando se traba con el descifrado de `CFB`. A 1:15:22 dice que tiene *"mis súper apuntes"* y a 1:15:35 que pidió una pizarra digital a la facultad y no se la compraron. **No hay pizarrón ni tableta en todo el video**: lo que hay dibujado en esas hojas no se ve nunca. Hay además un dibujo hecho a mano que prometió subir —sobre por qué el cifrado de flujo con la misma semilla equivale al OTP con clave reusada— que **no está en `raw/`**.
- **Los alumnos.** Se comparte pantalla completa del docente y nada más. La atribución de preguntas sale del `.VTT` de Zoom, no del video.
- **Dos frames en negro:** el arranque (00:00) y 1:40:58, que es cuando se levanta a abrirle la puerta al gato.
- **A 1:09:05 se le ve el dock de macOS asomando abajo**, porque comparte pantalla completa y no la ventana de la presentación.

