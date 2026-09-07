---
title: Funciones de hash criptográficas
resumen: 'Par de algoritmos Gen y Hash que comprime un mensaje de cualquier largo a una etiqueta de tamaño fijo sin usar ningún secreto: el selector s es público y no es una clave.'
fuentes: ["[[clase-03-macs-y-cifrado-autenticado]]", "[[practica-04-macs-hash-y-cifrado-autenticado]]"]
aliases: [Funciones de hash criptográficas, Función de hash, Hash, Hash criptográfico, Digest, Función de resumen, Efecto avalancha, Criterio estricto de avalancha, Tabla de hash, Etiquetadores universales]
type: concepto
unidad: 1
clase: 3
orden: 6
created: 2026-08-28
updated: 2026-09-04
tags: [criptografia, hash, digest, avalancha, resumen, clase-03, transcripcion]
sources: ["Clase 03 - Criptografia - MACs y Cifrado Autenticado.pdf", "raw/clases/Clase 03pt1-Transcripcion.VTT", "raw/clases/Clase 03pt2 - Transcripcion.VTT", "raw/practicas/Clase 4.pdf"]
---

# Funciones de hash criptográficas

**El objeto que comprime un mensaje de cualquier largo a una etiqueta de tamaño fijo, y lo hace sin ningún secreto.** Esta nota define el par $(\mathsf{Gen}, \mathsf{Hash})$ y contesta la pregunta que la filmina abre y no cierra: si $s$ no es una clave, ¿para qué está? La cátedra la contestó en voz el 03/09, y la respuesta está más abajo.

---

> **Las dos sesiones de la Clase 3, y cómo se citan.** La Clase 3 se dictó en **dos jornadas** y cada una tiene su propia grabación, numerada desde el cue 1: la del **27/08** (`raw/clases/Clase 03pt1-Transcripcion.VTT`, 873 cues, filminas 1-21) y la del **03/09** (`raw/clases/Clase 03pt2 - Transcripcion.VTT`, 910 cues, filminas 22-41). Por eso **todo cue citado en esta wiki lleva prefijo de parte**: `(cues pt1 …)` para el 27/08 y `(cues pt2 …)` para el 03/09. Sin el prefijo el número no identifica nada.
>
> Las filminas 22 y 23, que son las de esta nota, corresponden a la **segunda** jornada. El 27/08, al abrir el bloque de MACs, el docente había anunciado que hay dos grandes formas de construir un MAC y que la segunda quedaba para más adelante *"porque depende de algo que no vimos todavía"* (cue pt1 602): **ese "algo" es esta nota**. A eso se suma la [[practica-04-macs-hash-y-cifrado-autenticado|Práctica 04]] del **31/08**, que se adelantó a la teoría y ya traía su propia filmina de funciones de hash.

## Definición

Igual que un [[criptosistema]] o un [[message-authentication-code|MAC]], una función de hash criptográfica no es *una función*: es un **par de algoritmos**.

$$\begin{aligned}
\mathsf{Gen} &: \; s \leftarrow S\\
\mathsf{Hash} &: \; h = H^{s}(m) \in \{0,1\}^{L}
\end{aligned}$$

con $L$ la **longitud del hash**. Tres rasgos, que son toda la definición:

1. **El dominio no está acotado.** $m$ puede ser cualquier cadena; en la práctica el mensaje va de un byte a un archivo de gigabytes.
2. **El codominio sí lo está**, y es chico: $\{0,1\}^{L}$ tiene $2^{L}$ elementos. De acá sale todo lo demás — que la función **comprime** es la razón por la que las [[resistencias-de-una-funcion-de-hash|colisiones existen]] y la razón por la que el resumen sirve para algo.
3. **No hay ningún valor secreto.** Ni $s$ ni nada: cualquiera puede calcular $H^{s}(m)$.

El docente presenta el objeto por dónde encaja en el curso: son **"los primos hermanos de los MAC"** y, sobre todo, **la primera construcción criptográfica del curso en la que no hay clave involucrada**. La signatura la describe por contraste directo con la terna del MAC: *"lo único que tiene como entrada es un mensaje, no usa claves; entonces, entrada un mensaje, salida una etiqueta"*.

> [!quote]- De la transcripción — la ubicación del hash en la unidad y su signatura (cues pt2 94-106)
> **94-98.** "Y ahora es momento de pasar, todavía dentro del campo de integridad, a los primos hermanos de los [MAC], que son las funciones de hash criptográficas. Las funciones de hash criptográficas tienen una gran, gran diferencia […]: todo lo que vimos hasta ahora… son la primera construcción criptográfica que vemos en la cual no va a haber clave involucrada."
>
> **99-102.** "Formalmente se habla de familias de funciones de [hash]. Entonces se va a hablar de una familia de funciones de [hash]. Existe una función de selección que elige una de las funciones, y la función de hash en sí misma."
>
> **103-106.** "La función de [hash] es una función que… si era la idea de los [MAC], pero lo único que tiene como entrada es un mensaje, no usa claves. Entonces: entrada un mensaje, salida una etiqueta, una secuencia de bits."

La filmina las llama **funciones de resumen**, que es el nombre castellano habitual, y al valor $h$ se lo llama **digest**. El docente confirma los dos: *"las van a leer en la literatura como funciones resumen o funciones digest en inglés"* (cues pt2 119-123), y agrega el rasgo que la filmina no escribe pero que la figura de la 23 ilustra: **la etiqueta no depende del largo del mensaje** (cue pt2 132).

> **Detalle de tipografía de la filmina.** El símbolo de pertenencia sale renderizado como `ε` en vez de `∈` (pasa igual en la filmina 34). Se lee $h \in \{0,1\}^{L}$; no hay ningún $\varepsilon$ en la definición.

> **Aporte de la Práctica 04** (filmina 6, del **31/08**, tres días **antes** que esta teórica). La práctica no define la familia ni el selector: da el enunciado mínimo —un rectángulo $m$ que colapsa a una cajita `hash`, *"comprime la entrada a una longitud fija"*— y le agrega de entrada el hilo que la teoría recién cierra en la filmina 33: ***"Permiten construir Esquemas Mac seguros"***. O sea que el material escrito de la cátedra ata hash → MAC desde el primer minuto. Y usa la notación $H^{s}$ **con superíndice** en sus filminas 8, 11, 12 y 13: la convención tipográfica que esta nota documenta más abajo no es una rareza de la teórica.

## El selector no es una clave

Es la línea que la filmina resalta, y **el docente la subraya con más fuerza todavía que la lámina**. La respuesta a *"si $s$ no es una clave, ¿para qué está?"* tiene dos mitades, y las dos las dio la cátedra el 03/09.

**Primera mitad: qué significa "clave" en criptografía.** No significa "parámetro que elige `Gen`". Significa **un valor que el adversario no conoce**: el modelo mental entero se apoya en eso, y en un escenario donde el atacante conoce la clave no se garantiza nada. El selector $s$ es **información pública**, y por eso no es una clave — no porque no exista, sino porque no es secreto.

> [!quote]- De la transcripción — por qué el selector no es una clave (cues pt2 107-110)
> **107.** "Esta construcción podría engañarnos un poco y puede hacernos pensar: bueno, pero esto es muy parecido a la función generación de claves."
>
> **108-109.** "Acuérdense: siempre que en criptografía hablamos de claves, es un modelo mental en el cual el algoritmo atacante, el adversario, **no conoce la clave**. Nunca garantizamos seguridad en un escenario donde el atacante conoce la clave. Eso es game over, se acabó."
>
> **110.** "**Esta función de selección es información pública. No, no, no es una clave.**"

**Segunda mitad**: para qué está entonces. Está para prohibirle al adversario **precomputar**, y se desarrolla abajo en [[#Por qué la teoría define una familia igual|Por qué la teoría define una familia igual]].

Con eso, los tres puntos que la filmina enumera quedan cerrados:

- **$s$ existe**: la definición no habla de una función sino de una **familia** $\{H^{s}\}_{s \in S}$, y `Gen` elige un miembro.
- **$s$ no es secreto.** No se comparte por un canal seguro, no se acuerda entre dos partes, no hace falta protegerlo. Es un **selector**: dice *cuál* de las funciones de la familia se está usando.
- **En muchas implementaciones $S = \{s_0\}$**, o sea que la familia tiene **un solo elemento** y el selector es constante. Eso es exactamente lo que pasa con `MD5`, `SHA-1`, `SHA-2` y `SHA-3`: no hay ningún parámetro que elegir, la función está fija en el estándar. Ver [[primitivas-de-hash-estandar|Primitivas de hash estándar]].

El tercer punto también es de la cátedra, y viene con un aviso de vocabulario que conviene tener: **"familia de funciones de hash" se usa en la industria con otro sentido** —variantes de una misma función con distintos parámetros, como los cuatro tamaños de `SHA-3`— que no es el sentido formal de esta definición.

> [!quote]- De la transcripción — la familia de un solo elemento y los dos sentidos de "familia" (cues pt2 111-118)
> **111-114.** "Ahora, esta es la teoría, y esto se usa más que nada para demostraciones y demás. En la práctica… es muy probable que **el conjunto de posibles algoritmos tenga un solo elemento**. Pasa en muchas de las funciones que se utilizan hoy día."
>
> **115-116.** "Cuando veamos las pruebas de seguridad les cuento por qué está esta transformación y qué caso quiere modelar. […] Hay funciones de hash con distintos parámetros, es más, y se habla de familias de funciones de [hash], **pero con otro sentido que el sentido formal**."

### Análogas a los MACs, pero sin clave

La otra frase de cierre de la filmina. **La cátedra sostiene el paralelo con más fuerza que esta nota**: dice que las funciones de hash *"cumplen con muchas de las propiedades que tienen los MAC"* y que la dispersión de la salida **se ve mejor acá que en un MAC**, porque en un MAC uno puede atribuirle esa dispersión a la clave y acá no hay clave a la que atribuírsela (cues pt2 124-126 y 139-140).

Dicho eso, **la caracterización "sin clave" es engañosa** *(precisión nuestra, siguiendo a Katz & Lindell §5.1).* La diferencia decisiva no es que no haya clave: la hay, es $s$. La diferencia es que **$s$ es público**, y por lo tanto la seguridad tiene que valer **aun dándole $s$ al adversario** — que es exactamente lo que el docente dice en el cue pt2 110 con otras palabras.

| | [[message-authentication-code\|MAC]] | Función de hash |
|---|---|---|
| Parámetro que elige `Gen` | $k$, la **clave** | $s$, el **selector** |
| ¿El adversario lo conoce? | **No** — si lo conoce, falsifica al instante | **Sí**, se le entrega |
| Qué se le exige | que no pueda producir un par $(m,t)$ válido nuevo | que no pueda producir dos mensajes con el mismo digest |
| Prueba asociada | `Mac-Forge` ([[seguridad-de-un-mac\|seguridad de un MAC]]) | `Hash-Coll` ([[resistencias-de-una-funcion-de-hash\|resistencias]]) |
| Sirve para | integridad **con** un secreto compartido | integridad **sin** ningún secreto |

Katz & Lindell marca esta diferencia con una convención tipográfica: escribe $H^{s}$ **con superíndice** en lugar de $H_s$, y dice explícitamente que lo hace *para enfatizar* que $s$ no es secreto —el subíndice es el lugar donde el libro pone las claves, como en $\mathsf{Enc}_k$ o $\mathsf{Mac}_k$—. **Las filminas heredan el superíndice**: el slide 22 de teoría escribe $H^{s}(m)$, el slide 28 escribe la familia como $H^{x}(n)$, y las filminas 8, 11, 12 y 13 de la Práctica 04 escriben $H^{s}$ — todas con el selector arriba, y más abajo en ese mismo slide 22 el $s_0$ del conjunto $S = \{s_0\}$ va **como subíndice**, o sea que el PDF distingue las dos posiciones a propósito. Lo que las filminas no heredan es la explicación. *(Verificado con `pdftotext -bbox-layout` sobre las páginas 22, 28 y 33 y con el render de las páginas.)*

**En esta wiki se usa $H^{s}$**, que es la forma de las filminas y la del libro. Donde todavía aparezca $H_s$ o $h_s$ —incluido el recuadro de la recurrencia de la Práctica 04, que escribe $z_i = h_s(z_{i-1} \Vert x_i)$ con subíndice mientras el resto de la misma lámina usa superíndice— es exactamente lo mismo, y el subíndice ahí **no** significa "secreto".

> **Otra simplificación de la filmina** *(precisión nuestra).* La línea $\mathsf{Gen}: s \leftarrow S$ sugiere sortear uniformemente en un conjunto. Katz & Lindell define `Gen` como un **algoritmo probabilístico** que recibe $1^{n}$ y devuelve $s$, precisamente porque no toda cadena tiene por qué ser un selector válido. Para el curso la simplificación no cambia nada; conviene saber que es una simplificación.

## Por qué la teoría define una familia igual

Si en la práctica $S = \{s_0\}$, la pregunta obvia es para qué el formalismo se molesta en definir una familia. **La respuesta la dio la cátedra en clase**, y coincide punto por punto con la de Katz & Lindell: el paso de selección está para que el adversario **no pueda traer una colisión precomputada**.

Con una sola función fija, hay una forma trivial de ganar cualquier prueba de resistencia a colisiones: el día que alguien encuentre **una** colisión de esa función, se la **cablea adentro** al adversario y ese adversario gana siempre, en tiempo constante, sin hacer nada. Eligiendo $s$ **al empezar la prueba** eso deja de funcionar: el adversario recibe la función y recién entonces empieza a trabajar.

> [!quote]- De la transcripción — el paso 1 de Hash-Coll prohíbe precomputar (cues pt2 294-303)
> **294-296.** "Acá es donde aparece la formalidad de la selección de funciones. ¿Qué quiere decir esto? **El paso uno lo que nos dice es que no vale que el algoritmo [adversario] precompute una colisión antes siquiera de que empiece la prueba.**"
>
> **297-299.** "Porque la realidad es: si yo tengo una sola función de [hash] y algún día le encuentro una colisión, una forma trivial de ganar sería **hardcodearle esa colisión** y que admita siempre esa colisión. La estructura de esta prueba está pensada para que, de alguna manera, [el adversario] no pueda tener memoria en ese sentido."
>
> **300-303.** "Entonces, **incluso cuando en la práctica las familias suelen ser una sola función, la estructura formal tiene esa selección para dejar claro eso**. O sea: el adversario obtiene la función y a partir de ahí empieza a trabajar sobre la función que obtiene. **No puede traer información precalculada.**"

La versión del libro es la misma idea escrita como argumento de existencia, y es la que conviene saber contar en un parcial:

> Tomemos una función **fija** $H : \{0,1\}^{*} \to \{0,1\}^{L}$, sin selector. Como el dominio es infinito y el codominio tiene $2^{L}$ elementos, **existen pares colisionantes** — infinitos, de hecho ([[resistencias-de-una-funcion-de-hash#Las colisiones existen siempre|el argumento del palomar]]). Fijemos uno cualquiera, $(x_0, x'_0)$. Entonces existe un algoritmo que corre en **tiempo constante** y devuelve una colisión de $H$: el que tiene ese par **cableado adentro** y lo imprime. Ese algoritmo existe aunque nadie sepa escribirlo, porque el par existe.
>
> Conclusión: para una $H$ fija, la frase *"$H$ es resistente a colisiones"* es **formalmente vacía** — siempre hay un adversario `PPT` que gana con probabilidad $1$.

Con una familia el problema desaparece: el adversario recibe $s$ **después** de elegido, y no puede llevar cableado un par colisionante para cada uno de los $\lvert S\rvert$ selectores posibles. Por eso la definición formal necesita `Gen`, aunque la implementación no lo use.

Y la salvaguarda que evita que esto se lea como un tecnicismo destructivo, también de Katz & Lindell: las funciones sin clave que se usan en el mundo real **son resistentes a colisiones a todos los efectos prácticos, porque los pares colisionantes son desconocidos**; y las demostraciones de seguridad siguen valiendo mientras muestren que romper el esquema construido **produce un algoritmo que halla colisiones**. El formalismo con familia es la manera de escribir eso sin decir una falsedad.

> **La moraleja, en una línea** *(lectura nuestra).* La resistencia a colisiones no es una propiedad de la función: es una afirmación sobre **el estado del conocimiento público**. `MD5` no cambió en 2004 — cambió que alguien publicó el par.

## De dónde viene el nombre: las tablas de hash

La cátedra dedica veinte cues a esto, con la clase respondiendo, y es el mejor puente para entender qué se le está pidiendo a la función. El docente lo abre preguntando: *"¿Por qué se las llama funciones de hash? ¿Se acuerdan cuando vieron estructuras y algoritmos, las tablas de búsqueda de hash?"* (cues pt2 141-142).

La tabla de hash de Estructuras de Datos tiene **la misma anatomía**:

| Tabla de hash (estructuras de datos) | Función de hash criptográfica |
|---|---|
| Un vector de tamaño fijo con $n$ buckets | Un codominio $\{0,1\}^{L}$ de tamaño fijo |
| Una función que convierte el elemento en un número de bucket | $H^{s}$, que convierte el mensaje en una etiqueta |
| Los elementos a insertar son dinámicos y no están predefinidos | El dominio es cualquier cadena, de cualquier largo |
| Se busca **distribución uniforme** sobre los buckets | Se busca que la etiqueta se disperse uniformemente |
| Si hay más elementos que buckets, dos caen en el mismo: **colisión** | Si hay más mensajes que etiquetas, dos comparten etiqueta: **colisión** |

Y las dos razones por las que se quiere uniformidad son distintas pero paralelas: en la tabla, para que la búsqueda no degenere en lineal dentro de un bucket cargado; en criptografía, para que un cambio mínimo del mensaje no deje ningún rastro predecible en la etiqueta. El docente cierra el paralelo con la frase que da el nombre: **"se les llama funciones de hash criptográficas… porque cumplen bastantes de esas ideas"** (cue pt2 166).

> [!quote]- De la transcripción — las tablas de hash, con la explicación de un alumno (cues pt2 144-166)
> **144.** Pablo Abad: "¿Alguien se anima a contar más o menos cuál es la idea de cómo funcionan esas tablas de búsqueda?"
>
> **145-146.** Tomás Pietravallo: "Intenta generar un código único a partir del elemento. Por ejemplo, si tienes texto, quizás vas multiplicando cada carácter por un primo y lo sumas, o haces alguna transformación. Así, más o menos sabes que te da uniforme en el espacio módulo… por ejemplo, capacidad del vector. Y eso me permite hacer búsquedas en más o menos tiempo constante."
>
> **147-153.** Pablo Abad: "Exacto. O sea, uno se arma un vector de cierto tamaño fijo predefinido de entradas. Entonces, en vez de tener una lista y mantenerla ordenada […], la idea de la función de [hash] es una función que rápido convierta lo que estoy almacenando en un número, en el número de bucket dentro de ese vector."
>
> **155-156.** Pablo Abad: "¿Y por qué se busca una distribución uniforme?" — Tomás Pietravallo: "Para intentar que no caiga todo en el mismo bucket, porque, depende del algoritmo que uses, cuando tienes colisiones vas a terminar igual haciendo una búsqueda lineal."
>
> **158-162.** Pablo Abad: "La función que transforma la información en número de bucket la definimos a priori […]. Los inputs que vamos a meter en la tabla tranquilamente son dinámicos, no están predefinidos. Y entonces hay una cantidad finita de espacios. **Si hay más elementos que queremos meter [que espacios], seguro que va a ocurrir que dos caigan en el mismo bucket, y a eso lo llamamos colisión.**"
>
> **166.** Pablo Abad: "**Se les llama funciones de hash criptográficas, este tipo de funciones que vamos a dar, porque cumplen bastantes de esas ideas.**"

**Dónde termina el paralelo** *(lectura nuestra).* Una tabla de hash quiere pocas colisiones **en promedio** y las resuelve cuando ocurren; una función de hash criptográfica sabe que las colisiones son infinitas y sólo pide que **nadie pueda exhibir una**. Y una función de hash de tabla es reversible sin drama —nadie le pide que no lo sea—, mientras que acá la irreversibilidad es la primera de [[resistencias-de-una-funcion-de-hash#Las tres resistencias|las tres resistencias]]. El nombre viene de la analogía; las exigencias, no.

## El requisito informal, antes de las tres resistencias

Antes de enunciar las propiedades formales, el docente pone el criterio en dos palabras, y es la traducción exacta al mundo del hash de la moraleja que dejaron [[seguridad-de-un-mac|los tres MACs candidatos]] del 27/08: la etiqueta **tiene que tomar en cuenta todo el mensaje**, y **cualquier cambio menor tiene que generar una avalancha de cambios impredecibles** (cues pt2 127-129). Un MAC que sólo cubría los primeros bits fallaba por lo primero; un checksum falla por lo segundo.

## Etiquetadores universales

![Cinco entradas casi idénticas y sus digests, todos completamente distintos entre sí](../../assets/clase03-hash-etiquetadores.png)

La filmina 23 no tiene texto: es sólo esta figura. Muestra cinco entradas pasando por la misma caja rotulada *cryptographic hash function* y los cinco digests que salen. El docente la recorre en vivo, entrada por entrada, y aclara de dónde salió: *"acá hay un ejemplo que, si no me acuerdo mal, lo saqué de Wikipedia hace mucho"* (cue pt2 130).

| Entrada | Digest |
|---|---|
| `Fox` | `DFCD 3454 BBEA 788A 751A 696C 24D9 7009 CA99 2D17` |
| `The red fox jumps over the blue dog` | `0086 46BB FB7D CBE2 823C ACC7 6CD1 90B1 EE6E 3ABC` |
| `The red fox jumps ouer the blue dog` | `8FD8 7558 7851 4F32 D1C6 76B1 79A9 0DA4 AEFE 4819` |
| `The red fox jumps oevr the blue dog` | `FCD3 7FDB 5AF2 C6FF 915F D401 C0A9 7D9A 46AF FB45` |
| `The red fox jumps oer the blue dog` | `8ACA D682 D588 4C75 4BF4 1799 7D88 BCF8 92B9 6A6C` |

**Qué hay que ver, en orden:**

1. **Las filas 2 a 5 son la misma frase con perturbaciones mínimas.** `over` → `ouer` (una letra cambiada), → `oevr` (dos letras transpuestas), → `oer` (una letra borrada). En la imagen la palabra alterada está sombreada. Son exactamente el tipo de cambio que un humano no ve al leer, y el docente las lee en ese orden.
2. **Los cuatro digests no se parecen en nada entre sí.** Ni un grupo hexadecimal en común, ni un prefijo compartido, ni una tendencia. Eso es el **efecto avalancha**: un bit de diferencia en la entrada cambia aproximadamente la mitad de los bits de salida. Es lo que separa una función de hash criptográfica de un checksum o un CRC, donde un cambio chico produce un cambio chico y por eso se pueden compensar errores a mano.
3. **La fila 1 muestra la otra mitad de la propiedad.** `Fox` tiene 3 caracteres y las otras entradas tienen 34, y **los cinco digests miden exactamente lo mismo**: 40 dígitos hexadecimales, o sea $L = 160$ bits. Ese es el "resumen" de la filmina 22 — la salida no depende del largo de la entrada, que es lo primero que el docente hace notar.

> [!quote]- De la transcripción — la lectura en vivo de la figura (cues pt2 132-140)
> **132.** "¿Cuál es la idea? Cualquier mensaje arbitrario se convierte en una etiqueta. Primero, fíjense que **no importa la longitud del mensaje: las etiquetas suelen tener una longitud fija**."
>
> **135-138.** "Fíjense qué pasa cuando, por ejemplo, tomamos un mensaje y **le cambiamos simplemente un símbolo**: cambió totalmente también. ¿Y qué pasa si tomamos el mensaje original y simplemente **damos vuelta dos símbolos**? Volvió a cambiar radicalmente. Y este, si quieren, es **una mezcla de los dos**: cambió radicalmente todavía de otra manera, medio impredecible."
>
> **139-140.** "Esta misma estructura se ve también con los [MAC] con una clave. Pero acá, que no hay clave involucrada, **es más directo ver este resultado**, porque en los [MAC] uno le puede atribuir gran parte de esta dispersión a la clave. Nada más. Las funciones de hash, no."

### La figura no es MD5

El docente dice al pasar que la función de la figura es `MD5`: *"de cinco mensajes pasados por la misma función de hash —que no importa, es [MD5], es anecdótico—"* (cue pt2 131). **Verificado contra la propia filmina, no cierra** *(precisión nuestra).*

| | Longitud del digest | Dígitos hexadecimales |
|---|---|---|
| Los cinco digests de la figura 23 | $160$ bits | **40** |
| `MD5`, según la filmina 30 del mismo deck | $128$ bits | 32 |
| `SHA-1`, según la filmina 31 | $160$ bits | **40** |

Los digests dibujados miden 40 grupos hexadecimales; `MD5` produce 32. La filmina 30 del mismo PDF lo dice con todas las letras —*"salida: secuencia de 128 bits"*— y sus tres ejemplos (`d41d8cd9…`) tienen efectivamente 32 dígitos. **El tamaño de la figura es el de `SHA-1`, no el de `MD5`.**

La lectura caritativa es la que el propio docente ofrece: dijo *"es anecdótico"*, y unos minutos después, ya sobre la filmina 30, vuelve a hacer el mismo ejercicio de perturbación **ahí sí con `MD5`** (*"acá tienen tres ejemplos que voy a repetir nosotros para seguir viendo este patrón"*, cues pt2 382-384). O sea que la atribución parece un cruce entre las dos láminas, no una afirmación sobre la figura. **Nada de la explicación depende de cuál función sea**: la figura ilustra avalancha y compresión, que valen para las dos.

### El criterio estricto de avalancha

El "efecto avalancha" tiene nombre técnico y forma cuantificada, y el docente los da —aclarando que el tema **queda fuera del programa**—: el **criterio estricto de avalancha** (*strict avalanche criterion*) es uno de los criterios de diseño con los que se evalúan las [[construccion-de-merkle-damgard|funciones de compresión]].

$$\text{para todo bit } i \text{ de la entrada y todo bit } j \text{ de la etiqueta:}\quad \Pr[\text{el bit } j \text{ cambia} \mid \text{se invierte el bit } i] \approx \tfrac{1}{2}$$

Las dos exigencias que esconde la fórmula:

1. **Alrededor del 50 %**, no "mucho": cambiar un bit de entrada tiene que cambiar cada bit de salida con probabilidad cercana a un medio, con **sesgo despreciable**.
2. **Para todos los pares $(i,j)$ por igual.** Es la parte que se pasa por alto: no alcanza con que cambie la mitad de los bits, tiene que ser **impredecible cuáles**. Si se pudiera saber que cierto bit de la entrada afecta más a ciertos bits de la etiqueta que a otros, eso ya es una estructura que un criptoanalista puede explotar.

> [!quote]- De la transcripción — el criterio estricto de avalancha (cues pt2 385-392)
> **385-386.** "De hecho, hay un criterio —no lo vamos a ver en la materia, pero hay criterios de diseño para evaluar las funciones de compresión—, y hay un criterio que se llama **criterio estricto de avalancha**."
>
> **386-389.** "Que dice que, ante el cambio de un bit cualquiera en la entrada, tiene que haber **un sesgo despreciable alrededor del 50 por ciento de que cambie cada bit de la etiqueta**."
>
> **390-392.** "O sea, **no deberíamos poder entender que un bit de la entrada hace que cambien más ciertos bits de la etiqueta que otros**. Pero bueno, la forma de ver eso es esto: que hago un cambio lo más chico posible y cambia todo."

> **Tres advertencias sobre esta figura** *(lectura nuestra).*
> - **Los digests son ilustrativos, no reales.** Miden 160 bits, del tamaño de `SHA-1`, pero no son el hash de esas cadenas bajo ninguna función concreta. No conviene intentar reproducirlos. (Los que **sí** son reales y están verificados son los de las filminas 30 a 32: ver [[primitivas-de-hash-estandar#Los digests de ejemplo, verificados|Primitivas de hash estándar]].)
> - **La figura no ilustra ninguna de las tres resistencias.** Ilustra avalancha y compresión, que son propiedades observables. Que dos entradas distintas den digests distintos *en cinco ejemplos* no dice nada sobre si alguien puede **construir** un par que coincida — eso es la [[resistencias-de-una-funcion-de-hash|resistencia a colisiones]], y no se ve en ningún dibujo.
> - **"Etiquetadores universales" no es un término técnico.** El título usa "etiquetador" en el sentido de la filmina 14 (`Mac` como etiquetador) y "universal" en el sentido coloquial de *sirve para cualquier entrada*. **No** es la *universal hash function* de Katz & Lindell §4.6.1, que es una noción teórico-informacional distinta y que el curso no toca. Buscar un teorema sobre "hashes universales" a partir de este título no lleva a ningún lado.

## Para qué se usan

La filmina no lo lista acá, pero es lo que da sentido al resto del bloque:

- **Integridad sin secreto compartido** — publicar $h$ junto al archivo alcanza para detectar modificaciones, siempre que $h$ llegue por un canal confiable.
- **Prueba de existencia (*commitment*)** — publicar hoy la etiqueta de un documento y revelar el documento después, de modo que nadie pueda cambiarlo en el medio ni deducirlo del digest. Es el uso que el docente desarrolla más largo el 03/09, con dos ejemplos —una apuesta sobre un resultado ya escrito y una patente con fórmula secreta— y con los dos nombres. Está entero en [[resistencias-de-una-funcion-de-hash#Prueba de existencia: el commitment|Resistencias de una función de hash]], porque el punto interesante es **qué resistencia sostiene cada mitad**.
- **Como pieza de un MAC** — [[hmac|HMAC]] es la "segunda forma de construir un MAC" que el docente dejó pendiente el 27/08 y dictó el 03/09. La Práctica 04 ya lo anunciaba el 31/08 en su filmina 6.
- **Almacenamiento de contraseñas** — se guarda $h(\text{contraseña})$, no la contraseña. Con la trampa que desarrolla [[ataque-de-diccionario-sobre-hashes|Ataque de diccionario sobre hashes]].
- **Firma digital** — se firma el digest, no el documento, porque el documento no entra en el algoritmo de firma.
- **Índice universal de contenido** — el uso que hizo popular a `MD5`: identificar un archivo por su hash en redes P2P, donde el mismo contenido vive con nombres distintos en máquinas distintas (cues pt2 393-400). Ver [[primitivas-de-hash-estandar#MD5|Primitivas de hash estándar]].

Qué resistencia hace falta en cada caso, y por qué no son la misma: [[resistencias-de-una-funcion-de-hash#Qué ataque real cubre cada resistencia|Resistencias de una función de hash]].
