---
title: Construcción de Merkle-Damgård
resumen: 'Esquema iterativo que fabrica una función de hash de dominio ilimitado a partir de una función de compresión de bloque fijo; lo usan MD5, SHA-1 y SHA-2, hereda la resistencia a colisiones de la pieza chica y sufre length extension.'
fuentes: ["[[clase-03-macs-y-cifrado-autenticado]]", "[[practica-04-macs-hash-y-cifrado-autenticado]]"]
aliases: [Construcción de Merkle-Damgård, Merkle-Damgård, Merkle-Damgard, Modelo general iterativo, Función de compresión, Length extension attack, Ataque de extensión de longitud, Merkle-Damgård strengthening, Transformación final, Modo streaming]
type: concepto
unidad: 1
clase: 3
orden: 8
created: 2026-08-28
updated: 2026-09-04
tags: [criptografia, hash, merkle-damgard, compresion, length-extension, streaming, clase-03, transcripcion]
sources: ["Clase 03 - Criptografia - MACs y Cifrado Autenticado.pdf", "raw/clases/Clase 03pt1-Transcripcion.VTT", "raw/clases/Clase 03pt2 - Transcripcion.VTT", "raw/practicas/Clase 4.pdf"]
---

# Construcción de Merkle-Damgård

**Cómo se fabrica una [[funciones-de-hash-criptograficas|función de hash]] de dominio ilimitado a partir de una pieza que sólo sabe comprimir un bloque.** Es el esquema que usan `MD5`, `SHA-1` y toda la familia `SHA-2`, y el que explica de un saque dos cosas que parecen inconexas: por qué el hash entero hereda la seguridad de una pieza chica, y por qué $H(k \Vert m)$ **no** sirve como MAC.

---

> **Esta filmina se dictó el 03/09** (filmina 29), en la segunda sesión de la Clase 3. Como la Clase 3 tiene **dos grabaciones** —la del 27/08 (873 cues, filminas 1-21) y la del 03/09 (`raw/clases/Clase 03pt2 - Transcripcion.VTT`, 910 cues, filminas 22-41)— y cada una numera sus cues desde 1, **todo cue va con prefijo de parte**: `(cues pt1 …)` para el 27/08 o `(cues pt2 …)` para el 03/09.
>
> Esta nota tiene ahora **dos diagramas de la cátedra que no son el mismo**: el de la filmina 29 de teoría y el de la filmina 11 de la [[practica-04-macs-hash-y-cifrado-autenticado|Práctica 04]] del 31/08. Difieren en tres puntos, y esa diferencia es la que ordena la sección final sobre el length extension.

## El problema que resuelve

Hay una asimetría incómoda entre lo que se sabe construir y lo que hace falta:

- Lo que se sabe construir bien es una **función de compresión** $f$: toma una entrada de **tamaño fijo** y devuelve una salida de tamaño fijo más chico. Es una pieza analizable, criptoanalizable, con un dominio finito. El docente la define en una línea: *"una función a la que le vamos a pedir prácticamente las mismas propiedades que a la función de hash, pero que opera sobre bloques pequeños y de tamaño fijo"* (cues pt2 311-313).
- Lo que hace falta es una función que trague **cualquier cadena**, de un byte a un archivo de gigabytes.

**El paralelo con el bloque anterior de la materia es exacto**, y no es una lectura de esta wiki: **lo dijo el docente, y con la palabra "contemporáneo"**. Una [[primitiva-de-cifrado-en-bloque|primitiva de cifrado en bloque]] también está definida sólo para un tamaño fijo, y también hace falta cifrar mensajes de cualquier largo; lo que salva esa distancia son los [[modos-de-encadenamiento|modos de encadenamiento]]. **Merkle-Damgård es a las funciones de hash lo que `CBC` es a `AES`**: el mecanismo que convierte una primitiva de dominio fijo en algo usable, con la misma estructura de estado encadenado y —como se ve al final— **la misma familia de problemas**.

> [!quote]- De la transcripción — la motivación, y el paralelo explícito con los cifrados de bloque (cues pt2 306-317)
> **306-309.** "En 1989, más o menos, un investigador de IBM —y después complementado por otro investigador que se llama [Damgård]— estaban buscando **formas sistemáticas de construir funciones de hash de tal forma que se puedan aprovechar, como ocurrió con las funciones de bloque, muchos aspectos de las demostraciones, y no haya que empezar desde cero con cada función**. Y plantean una construcción general que se conoce como **modelo general iterativo de [Merkle-Damgård]**."
>
> **311-313.** "…que procesa mensajes de tamaño arbitrario a partir de una función mucho más simple, que se llama **función de compresión**: una función a la que le vamos a pedir prácticamente las mismas propiedades que a la función de hash, pero que **opera sobre bloques pequeños y de tamaño fijo**."
>
> **314-317.** "**Es contemporáneo**, y por eso el parecido en cuanto a la idea al desarrollo de los criptosistemas de bloque. Si se acuerdan, era eso: **era tener una función más simple, especialmente más finita en el sentido de que tenga entrada y salida de tamaños conocidos y fijos, que simplifica mucho las demostraciones, y tener una construcción arriba que nos diga: si conseguiste el bloque del medio, yo te lo extiendo a tamaños arbitrarios. Esta es la misma idea.**"

> **La atribución oral tiene un error de fondo** *(corrección nuestra, conocimiento externo a la bibliografía del vault).* El docente corrige en voz la errata de la lámina —nombra a los dos autores y llama al modelo por los dos apellidos— pero agrega un dato nuevo que es falso: **Ralph Merkle no era investigador de IBM**. Su trabajo es de Stanford y Berkeley, y después de Xerox PARC. La historia de IBM es la de `DES`, que el propio docente cuenta dos veces esa misma jornada (cues pt2 405-412) — parece un cruce entre las dos anécdotas. La fecha, 1989, sí es correcta.

## El diagrama, pieza por pieza

![Modelo general de una función de hash iterada: preprocesamiento, función de compresión realimentada y transformación final](../../assets/clase03-merkle-damgard.png)

Todo el dibujo está encerrado en un rectángulo rotulado *hash function h*: lo de adentro **es** la función de hash. De arriba abajo, y en el mismo orden en que el docente lo recorre en clase:

1. **Entrada** — la cadena original $x$, de largo arbitrario.
2. **Preprocesamiento**, con dos pasos apilados **y en este orden**:
   - `append padding bits` — completar hasta múltiplo del tamaño de bloque. El docente lo presenta así: *"hay una etapa que ellos llaman de preprocesamiento, pero que de alguna manera es el equivalente al padding"* (cues pt2 320-321).
   - `append length block` — agregar un bloque que codifica el **largo del mensaje**.
3. **Entrada formateada** — $x = x_1 x_2 \dots x_t$, ya partida en $t$ bloques del mismo tamaño.
4. **Procesamiento iterado** — la caja `compression function f`, con:
   - $x_i$ entrando desde arriba (el bloque de mensaje del paso $i$),
   - $H_{i-1}$ entrando desde la izquierda (el **estado encadenado**),
   - $H_i$ saliendo hacia abajo,
   - y **la realimentación**: una línea que sale de $H_i$, rodea la caja y vuelve a entrar como $H_{i-1}$. **Ese lazo es todo lo que "iterativo" significa**: la misma $f$ se aplica $t$ veces, cada vez con el estado que dejó la anterior.
   - a la derecha, la anotación $H_0 = IV$: la condición inicial del lazo.
5. **Transformación final** — la caja $g$, aplicada al último estado $H_t$.
6. **Salida** — $h(x) = g(H_t)$.

En fórmula, el lazo entero es:

$$H_0 = IV, \qquad H_i = f(H_{i-1},\, x_i) \;\; \text{para } i = 1,\dots,t, \qquad h(x) = g(H_t)$$

**Dónde está la compresión.** $f$ recibe $H_{i-1}$ (de $n$ bits) **más** $x_i$ (de $n$ bits) y devuelve $H_i$ (de $n$ bits): entran $2n$, salen $n$. El docente lo dice con esas palabras —*"toman una entrada que tiene $2x$ cantidad de bits […] y da una salida que tiene $x$: como que compacta a la mitad"* (cues pt2 368-370)—. Ahí está el "comprime", y de ahí sale —por [[resistencias-de-una-funcion-de-hash#Las colisiones existen siempre|conteo]]— que $f$ tiene colisiones.

> **Choque de notación entre las fuentes** *(precisión nuestra, y vale la pena tenerlo claro antes del parcial).* El diagrama de teoría llama $f$ a la **función de compresión** y $h$ a la **función de hash completa**. Katz & Lindell y la Práctica 04 hacen exactamente al revés: llaman $h^{s}$ a la de compresión y $H^{s}$ a la completa. Son la misma construcción con las letras cambiadas.

## Las dos versiones de la cátedra

La Práctica 04 dibuja **la misma transformación con otra lámina**, y no es una copia: es la versión de Katz & Lindell, con los índices explícitos y con el teorema enunciado en un recuadro. Vale la pena tener las dos, porque **lo que una omite la otra lo dice**.

![La transformación de Merkle-Damgård con dominio, recurrencia, bloque de longitud y el teorema de reducción](../../assets/practica04-merkle-damgard.png)

Lo que la filmina 11 de la práctica trae y la 29 de teoría no tiene:

$$\lvert x\rvert = L < 2^{\,l(n)}, \qquad x = x_1 x_2 x_3 \dots x_B, \qquad \lvert x_i\rvert = l$$
$$\text{se usa } h^{s} : \{0,1\}^{2l} \to \{0,1\}^{l} \text{ segura}, \qquad z_0 = 0^{l}, \qquad x_{B+1} = \lvert x\rvert$$
$$z_i = h_s(z_{i-1} \Vert x_i), \qquad H^{s}(x) = z_{B+1}$$

y, en un recuadro gris, **el teorema, enunciado por la cátedra**:

> Una colisión en $H^{s}$ sólo puede ocurrir si hay una colisión en $h^{s}$.

O sea que el Teorema 5.4, que hasta ahora esta nota sólo tenía del libro, **es material de cátedra por escrito**.

**Las tres diferencias entre las dos láminas**, que hay que tener presentes porque la sección de length extension depende de ellas:

| | Teoría, filmina 29 | Práctica 04, filmina 11 |
|---|---|---|
| Estado inicial | $H_0 = IV$, sin valor | $z_0 = 0^{l}$, la constante de ceros |
| Bloque de longitud | `append length block`, dentro del preprocesamiento | $x_{B+1} = \lvert x\rvert$, un bloque numerado y explícito |
| Transformación final | **sí**: la caja $g$, y la salida es $h(x) = g(H_t)$ | **no**: la salida es $z_{B+1}$ **directo** |

> **Errata de la filmina 11 de la Práctica 04:** escribe *"Transformación de Merkle **Darmgard**"*. El apellido es **Damgård** —Ivan Damgård, danés—: están transpuestas las letras de la primera sílaba y falta la `å`. La forma sin tilde (*Damgard*) es la castellanización habitual y es aceptable; *Darmgard* no.

> **Y una inconsistencia menor de notación en la misma lámina.** El recuadro de la recurrencia escribe $z_i = h_s(z_{i-1} \Vert x_i)$ con el selector **como subíndice**, mientras que el resto de la filmina —y las filminas 8, 12 y 13— lo escriben $h^{s}$, con superíndice. Es la misma función; el subíndice acá **no** significa "secreto". Ver [[funciones-de-hash-criptograficas#El selector no es una clave|El selector no es una clave]].

## Preprocesamiento

**Ajustar el tamaño del mensaje.** El [[primitiva-de-cifrado-en-bloque#Extensión: padding|padding]] tiene que llevar $x$ a un múltiplo del tamaño de bloque. Es el mismo problema que en los modos de cifrado y se resuelve igual.

**Agregar un bloque con el tamaño.** La filmina lo lista como un segundo paso del preprocesamiento, al mismo nivel que el relleno, como si fuera un detalle de formato. **No lo es**: es la mitad de la demostración del teorema, y además es una **decisión de diseño discutible que la cátedra discute**. Las dos cosas, en las dos secciones que siguen.

En la versión de Katz & Lindell (Construcción 5.3), con $L = \lvert x\rvert$ y bloques de $n$ bits:

$$B := \lceil L/n \rceil, \qquad x \text{ paddeado con ceros hasta } x_1,\dots,x_B, \qquad x_{B+1} := L \text{ codificado en } n \text{ bits}$$
$$z_0 := 0^{n}, \qquad z_i := h^{s}(z_{i-1} \Vert x_i) \;\; \text{para } i = 1,\dots,B+1, \qquad H^{s}(x) := z_{B+1}$$

que es, letra por letra, lo que dibuja la filmina 11 de la Práctica 04. El libro agrega que en las implementaciones reales la longitud **no ocupa un bloque entero**: se codifica en unos pocos bits dentro del último bloque. El diagrama muestra la versión de bloque completo porque es la que se demuestra cómoda.

### Por qué la longitud va al final: un compromiso, no un descuido

La cátedra es explícita en que **ponerla al final no es lo mejor** —*"hoy día sabemos que agregarla al final no es lo mejor"*, y hasta arriesga que Merkle y Damgård, rediseñando hoy, **la habrían puesto como prefijo**—, y sin embargo explica por qué el sufijo ganó: **el modo streaming**.

- **Longitud como prefijo**: para escribir el primer bloque hace falta saber el largo total, o sea **tener el mensaje entero** antes de empezar a calcular.
- **Longitud como sufijo**: se puede empezar a procesar **un mensaje que todavía está llegando**, y agregar el largo recién al cerrar. Es lo que permite hashear un archivo mientras se descarga, o un flujo de red.

El docente lo llama *"un buen compromiso"*, y **es exactamente el mismo trade-off que aparece en [[cbc-mac#Opción 2 — la longitud como prefijo|CBC-MAC]]**, del otro lado del curso. Katz lo enuncia en las notas del capítulo 4 con estas palabras, hablando de anteponer la longitud al mensaje en `CBC-MAC`: *"This has the disadvantage of not being able to cope with streaming data, where the length of the message is not known in advance"* (cap. 4, *References and Additional Reading*). Las dos primitivas, la misma tensión, la misma resolución.

> [!quote]- De la transcripción — el sufijo como compromiso por el modo streaming (cues pt2 325-334)
> **325-326.** "Ya en el modelo de [Merkle], además de agregar los bits de padding, se agrega la longitud de bloque al final. **Hoy día sabemos que agregarla al final no es lo mejor.**"
>
> **328.** "**Creo que si [Merkle] y [Damgård] estuviesen rediseñando eso con el conocimiento que tenemos hoy, hubiesen agregado la longitud como prefijo.**"
>
> **329-333.** "Dicho todo esto, agregarla como sufijo tiene una ventaja muy grande, que es: **podemos trabajar en una suerte de modo streaming, donde podemos empezar a procesar y calcular la etiqueta de un mensaje que está llegando, sin necesidad de tenerlo completo**. Si el tamaño estuviese al principio, necesitamos tener todo el mensaje para poder calcular la etiqueta."
>
> **334.** "Entonces **es un buen compromiso**. Y, si quieren, el problema potencial que tendría agregarlo como sufijo se resuelve por agregar una transformación al final."

### El estado inicial: tres versiones que circulan

No son la misma, y conviene tenerlas separadas:

| Fuente | Qué dice |
|---|---|
| Teoría, filmina 29 | $H_0 = IV$ — hay un vector de inicialización, sin decir cuál |
| Práctica 04, filmina 11 | $z_0 = 0^{l}$ — la constante de ceros |
| El docente, en voz (cues pt2 356-357) | *"el estado inicial suele ser un **vector aleatorio**, un vector de inicialización"* |
| Katz & Lindell, Construcción 5.3 | $z_0 := 0^{n}$, y aclara que el valor **es arbitrario y puede reemplazarse por cualquier constante** |

**La palabra "aleatorio" es la que hay que leer con cuidado** *(precisión nuestra).* En una función de hash **no hay clave y la función tiene que ser determinística**: si el `IV` se sorteara en cada evaluación, dos personas hasheando el mismo archivo obtendrían digests distintos y la función no serviría para nada. El `IV` de `MD5`, `SHA-1` y `SHA-2` es una **constante fija y publicada en el estándar**. Lo que sí es cierto —y es probablemente lo que el docente quiere decir— es que esa constante **parece** aleatoria y no tiene estructura aprovechable: es el mismo criterio *nothing-up-my-sleeve* que explica los valores de `opad` e `ipad` en [[hmac|HMAC]]. Y lo dice Katz: el valor es **arbitrario**, cualquier constante sirve, lo que no significa que sea sorteado.

## El teorema que hace que valga la pena

La filmina 29 lo enuncia en una viñeta suelta, sin justificar:

> La seguridad está dada por la función de compresión.

La Práctica 04 lo enuncia en su recuadro gris: *"Una colisión en $H^{s}$ sólo puede ocurrir si hay una colisión en $h^{s}$"*. Y el teorema que respalda las dos frases es el que hace que toda la construcción tenga sentido:

> **Teorema (Katz & Lindell 5.4).** Si la función de compresión $h^{s}$ es resistente a colisiones, entonces la función de hash $H^{s}$ que Merkle-Damgård construye a partir de ella también lo es.

**Por qué es un resultado grande.** Sin él, "función de hash" sería un objeto imposible de analizar: el dominio es infinito, no hay nada sobre lo que hacer criptoanálisis. El teorema **reduce el problema a una pieza finita**: alcanza con analizar $h^{s}$, que opera sobre $2l$ bits fijos. Los diagramas de la cátedra son, literalmente, el enunciado del teorema dibujado — y es la razón por la que el docente arranca el tema hablando de "aprovechar los aspectos de las demostraciones y no empezar desde cero con cada función".

### La idea de la demostración, que es lo que hay que llevarse

Se prueba el contrarrecíproco: **toda colisión en $H^{s}$ produce una colisión en $h^{s}$**. Dados $x \ne x'$ con $H^{s}(x) = H^{s}(x')$, hay dos casos.

**Caso 1 — los mensajes tienen longitudes distintas.** Entonces el último bloque procesado es $h^{s}(z_B \Vert L)$ para uno y $h^{s}(z'_{B'} \Vert L')$ para el otro, con $L \ne L'$. Las **salidas coinciden** (es la colisión de la que se partió) y las **entradas difieren** (difieren en el campo de longitud, sin necesidad de mirar nada más). Eso ya es, por definición, una colisión de $h^{s}$. Listo.

**Caso 2 — misma longitud.** Se recorre la cadena **hacia atrás** desde el final hasta el primer punto donde las entradas de $h^{s}$ difieren. Ese punto existe, porque los mensajes son distintos; y ahí las salidas coinciden y las entradas no. Otra colisión de $h^{s}$.

### Y ahí está la razón de ser del bloque de longitud

**El Caso 1 es exactamente el bloque de longitud haciendo su trabajo.** Sin él, dos mensajes de largo distinto no tendrían ningún campo que los distinga al final de la cadena y la demostración se queda sin primer caso.

Y no es sólo que la demostración falle: **sin el bloque de longitud aparecen colisiones triviales** *(lectura nuestra, sobre el relleno con ceros de la Construcción 5.3).* Si el padding es "completar con ceros hasta múltiplo del bloque" y no se agrega la longitud, entonces $x$ y $x \Vert 0$ **se paddean a la misma cadena**, entran a la misma cadena de $h^{s}$ y devuelven el mismo digest. Ahí hay una colisión que se escribe en un renglón, sin criptoanálisis de ningún tipo.

Ese refuerzo tiene nombre propio: **Merkle-Damgård strengthening**. Lo que la filmina anota como una viñeta de formato es la pieza sobre la que se apoya la mitad del teorema.

> **Errata de la filmina 29:** dice *"Propuesto por Merkle en 1989"*. **Ralph Merkle e Ivan Damgård la publicaron de forma independiente, los dos en CRYPTO '89**, y por eso la construcción se llama **transformación de Merkle-Damgård** y no "transformación de Merkle". Katz & Lindell la nombra siempre con los dos apellidos (§5.2, Construcción 5.3, Teorema 5.4). **La lámina quedó incompleta, pero el docente la corrigió en voz**: menciona al *"otro investigador que se llama Damgård"* y llama al esquema *"modelo general iterativo de Merkle-Damgård"* (cues pt2 306-309). La Práctica 04 también usa los dos apellidos, con la errata de tipeo señalada más arriba.

## La contra: length extension

La misma estructura que hace demostrable el teorema abre un agujero, y es un agujero grande.

**Qué sabe el atacante.** Cuando la salida de la función **es el estado interno al terminar** —o sea, cuando no hay transformación final, o cuando $g$ es la identidad—, quien conoce $H^{s}(m)$ conoce $z_{B+1}$: conoce **el punto exacto de la cadena donde el cálculo se quedó**. Y como $h^{s}$, el `IV` y el padding son públicos, puede **seguir iterando**: eligiendo bloques $m'$ a gusto, calcula

$$H^{s}\bigl(m \,\Vert\, \mathrm{pad}(m) \,\Vert\, m'\bigr)$$

**sin conocer $m$**. Le alcanza con conocer $H^{s}(m)$ y $\lvert m\rvert$ —el largo, no el contenido—, porque el largo es lo que determina el padding.

### Por qué esto rompe el MAC ingenuo

El candidato obvio para construir un MAC con una función de hash es

$$\mathsf{Mac}_k(m) = H^{s}(k \,\Vert\, m)$$

y es **completamente inseguro** cuando $H^{s}$ es Merkle-Damgård sin transformación final. El adversario que ve un par legítimo $(m, t)$ con $t = H^{s}(k \Vert m)$:

1. Toma $t$, que **es el estado interno** de la cadena después de procesar $k \Vert m$ con su padding.
2. Elige cualquier $m'$ y sigue iterando $h^{s}$ desde ese estado, obteniendo $t^{*}$.
3. Emite el par $\bigl(m \Vert \mathrm{pad}(k \Vert m) \Vert m',\; t^{*}\bigr)$, que es **válido** y cuyo mensaje **nunca consultó**.

Eso es una falsificación existencial: gana el juego [[seguridad-de-un-mac|Mac-Forge]]. La única información extra que necesita es $\lvert k \rvert$ para reconstruir el padding, que en general es pública o se prueba por fuerza bruta en unos pocos intentos. Es el **Ejercicio 5.10** de Katz & Lindell.

**Y esto es exactamente por qué [[hmac|HMAC]] tiene la forma que tiene.** Su capa externa vuelve a hashear el digest interno con una segunda clave derivada, así que lo que el adversario ve **no es** el estado interno de ninguna cadena que él pueda continuar. Las dos capas no son redundancia: son la respuesta a este ataque.

### La misma familia de ataques que el sufijo de CBC-MAC

Esto **lo ató la cátedra**, y lo forzó una pregunta de un alumno. Emilio Mitchell preguntó por qué se sabe hoy que poner el tamaño al final es más inseguro, y la respuesta del docente atraviesa las dos sesiones de la clase: *"es por el mismo problema que vieron cuando vimos `CBC-MAC`"*. Si se permiten bloques de distintos tamaños, un mensaje puede ser **prefijo** de otro; y quien controla eso **tiene acceso a estados intermedios que se suponía que se descartaban**, con lo cual puede compensarlos y forzar el valor final. El docente lo generaliza sin que se lo pidan: **"este ataque se puede trasladar a los modelos iterativos en general"** (cue pt2 350).

> [!quote]- De la transcripción — la pregunta de Emilio y el traslado del ataque de CBC-MAC (cues pt2 336-351)
> **336-337.** Emilio Mitchell: "¿Por qué sabemos hoy en día que es más inseguro poner al final el tamaño del bloque?"
>
> **338-340.** Pablo Abad: "Es **por el mismo problema que viste cuando vimos [CBC-MAC]**, que les dije: ojo que esta construcción simple funciona si usamos bloques de tamaño fijo, porque **si permitimos bloques de distintos tamaños yo puedo hacer que un bloque sea prefijo de otro**. Y con eso, en este ejemplo, **yo tengo acceso a los estados intermedios que se supone que se descartan**."
>
> **342-344.** "Y teniendo acceso a los estados intermedios… yo acá calculo un estado intermedio, acá calculo el estado final de $ab$, pero que es el estado intermedio de este otro mensaje. **Conociendo los estados intermedios, yo los puedo compensar de alguna manera y hacer que el resultado final dé el valor que quiera.**"
>
> **347-348.** "Cuando vimos formas de corregir eso en el `CBC` habíamos dicho: bueno, una forma es agregarle el prefijo. Si se le agrega como sufijo, el problema es que **existe un ataque más sofisticado** que el que habíamos visto de longitud, pero sigue existiendo."
>
> **350-351.** "**Este ataque se puede trasladar a los modelos iterativos en general**; y se podría trasladar a este si no existiese esta función [de transformación] acá."

Y la regla general que le da nombre a la familia es de la **primera** sesión, cerrando el bloque de `CBC-MAC`:

> [!quote]- De la transcripción de la Clase 03 — los extension attacks como familia (cues pt1 786-789)
> **786.** "Y ésta es la demostración de por qué como sufijo no sirve. **Esta familia de ataque se llama *extension attacks* en general.**"
>
> **787-789.** "Casi todas las construcciones criptográficas que son así, [iterativas], de ir procesando por bloque, tienen este tipo de problemas: **necesitan no revelar estados intermedios**, y la modificación se hace al final. Entonces casi todas van a ver que **ponen la modificación o en la clave o al principio del mensaje**."
>
> Es del 27/08, en el cierre de la filmina 21. Ahí el docente **todavía no habla de Merkle-Damgård** —esas filminas las dio el 03/09—, pero enuncia la regla general, y una semana después la aplica él mismo a este modelo. `CBC-MAC` con la longitud como prefijo y `HMAC` con sus dos capas son la misma solución al mismo problema, en dos primitivas distintas.

### Discrepancia: qué hace la transformación final

**Ésta es la única discrepancia de fondo de la nota, y conviene registrarla entera** *(precisión nuestra).*

**Lo que dice la cátedra.** Para el docente, la caja $g$ es una **pieza de seguridad**, y con ella el modelo **no** sufre length extension. Tres veces lo dice: la construcción *"agrega una función de transformación al final [que] no deja salir los estados intermedios, sino que los transforma; **no es un problema de seguridad**"* (cue pt2 327); *"a esa salida se la transforma con una **función no reversible**, que tiene que ver con eliminar la posibilidad de que alguien tenga acceso a esos estados intermedios"* (cues pt2 362-364); y, cerrándole la pregunta a Emilio, *"este ataque […] se podría trasladar a este **si no existiese esta función acá**"* (cue pt2 351). De ahí sale su conclusión de que poner la longitud como sufijo es un compromiso aceptable.

**Lo que está verificado en el material.**

1. **La filmina 29 de teoría le da la razón**: dibuja la caja $g$ y escribe $h(x) = g(H_t)$.
2. **La filmina 11 de la Práctica 04, no**: no tiene ninguna caja $g$, y la salida es $H^{s}(x) = z_{B+1}$, el último estado **directo**. Es la lámina de la propia cátedra, de tres días antes.
3. **Katz & Lindell tampoco**: la Construcción 5.3 termina en *"Output $z_{B+1}$"*. No hay transformación final en el libro.
4. **`MD5`, `SHA-1` y `SHA-2` tampoco la tienen** — su $g$ es la identidad. Y ése es un hecho, no una interpretación: **es exactamente la razón por la que el length extension attack es real** en esas funciones, por la que $H(k \Vert m)$ no sirve como MAC, y por la que [[hmac|HMAC]] es **anidado** en lugar de una sola pasada. Si el modelo desplegado tuviera la $g$ no reversible del cue pt2 327, `HMAC` no haría falta.

**Cómo se resuelve.** La lectura caritativa, que además es la técnicamente correcta: **algunas presentaciones de Merkle-Damgård admiten una transformación de salida $g$ opcional** —la filmina 29 es una de ellas—, y las construcciones que **sí** la instancian de forma no trivial efectivamente resisten el length extension: `SHA-512/256` y `SHA-384`, que **truncan** el estado y por lo tanto no lo revelan entero; y `SHA-3`, que ni siquiera es Merkle-Damgård. O sea que **el docente describe una variante reforzada del modelo, no la que instancian las funciones desplegadas ni la que dibuja la otra lámina de su propia cátedra**.

El resultado práctico, que es lo que hay que retener:

| Instanciación de $g$ | Ejemplos | ¿Length extension? |
|---|---|---|
| Identidad, o ausente | `MD5`, `SHA-1`, `SHA-256`, `SHA-512` | **Sí** |
| Truncado del estado | `SHA-224`, `SHA-384`, `SHA-512/256` | No |
| No aplica: no es Merkle-Damgård | `SHA-3` (esponja) | No |

**Y por eso la conclusión del docente sobre el sufijo hay que leerla con la salvedad puesta.** *"El problema potencial de agregarlo como sufijo se resuelve por agregar una transformación al final"* (cue pt2 334) es cierto **de la variante con $g$ no trivial**, y falso de `MD5`, `SHA-1` y `SHA-2`, que son las que el curso usa. Lo que sí queda en pie sin ninguna salvedad es su diagnóstico: **el problema es el acceso a estados intermedios**, y **hoy se diseñaría distinto** — que es exactamente lo que hicieron `SHA-3` y las variantes truncadas.

## SHA-3 no usa este modelo

Vale decirlo acá para que no se lea Merkle-Damgård como *la* forma de hacer un hash: **`SHA-3` (Keccak) no la usa**. Su núcleo es una permutación sin clave de 1600 bits y una **construcción esponja**, y esa diferencia estructural fue **uno de los motivos de su elección** — el NIST quiso que un avance criptoanalítico contra la familia `SHA` no se llevara puestas las dos generaciones a la vez. Ver [[primitivas-de-hash-estandar#SHA-3|Primitivas de hash estándar]].

**La Práctica 04 lo tiene tabulado**, y con el mismo par que esta nota construye: su filmina 10 clasifica los *"Modelos de Aplicación (Construcciones)"* en dos ramas, **Iterativo → `CBC-MAC` / Merkle** y **Esponja → Keccak (`SHA-3`)**. La rama iterativa mete en la misma caja al MAC de bloque y al hash, que es exactamente el paralelo que el docente repite en los cues pt2 322-324.

Y el puente al resto del bloque también lo dice él: *"a partir del modelo iterativo se empezaron a definir un montón de funciones $f$, y de ahí salen las funciones de hash por ahí más conocidas"* (cue pt2 372) — o sea, [[primitivas-de-hash-estandar|MD5, SHA-1 y SHA-2]].

## Ver también

- [[funciones-de-hash-criptograficas|Funciones de hash criptográficas]] — qué se está construyendo
- [[resistencias-de-una-funcion-de-hash|Resistencias de una función de hash]] — la resistencia a colisiones que el teorema traslada de $h^{s}$ a $H^{s}$
- [[primitivas-de-hash-estandar|Primitivas de hash estándar]] — quiénes usan este modelo (`MD5`, `SHA-1`, `SHA-2`) y quién no (`SHA-3`)
- [[hmac|HMAC]] — la construcción cuya forma se explica por el length extension de esta nota
- [[cbc-mac|CBC-MAC]] — el ataque hermano, sobre una primitiva de bloque en vez de un hash, y el mismo compromiso prefijo/sufijo
- [[primitiva-de-cifrado-en-bloque|Primitiva de cifrado en bloque]] — la otra pieza de dominio fijo del curso, y el padding
- [[modos-de-encadenamiento|Modos de encadenamiento]] — el paralelo estructural: encadenar estado para pasar de tamaño fijo a tamaño libre
- [[clase-03-macs-y-cifrado-autenticado|Clase 03 — MACs y cifrado autenticado]] — las dos sesiones, 27/08 y 03/09
- [[practica-04-macs-hash-y-cifrado-autenticado|Práctica 04 — MACs, hash y cifrado autenticado]] — la filmina 11, con el teorema en recuadro y sin caja $g$
- Katz & Lindell cap. 5 *Hash Functions and Applications*, §5.2 ([[bibliografia|bibliografía]])
