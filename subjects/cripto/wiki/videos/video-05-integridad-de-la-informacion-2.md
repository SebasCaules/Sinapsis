---
title: Video 05 — Integridad de la información (2)
resumen: 'Segunda mitad de la jornada de 2025 de Ramele, partida en dos videos: recorre sin saltear las filminas 22 a 41 del deck de la Clase 03 —hash, Merkle-Damgård, MD5, SHA, HMAC, cifrado autenticado, CCM y GCM—.'
fuentes: ["[[clase-03-macs-y-cifrado-autenticado]]", "[[videografia]]", "[[video-04-integridad-de-la-informacion-1]]"]
aliases: ["Video 05", "Integridad de la Información #2", "Integridad #2", "Filminas 22-41", "Video de funciones de hash"]
type: video
clase: 3
orden: 41
video: 05
youtube: h1sUhSeJdf4
created: 2026-09-03
updated: 2026-09-04
tags: [video, integridad, hash, hmac, merkle, md5, sha, cumpleanos, privacidad-e-integridad, cifrado-autenticado, ccm, gcm, ramele, clase-03]
sources: ["https://www.youtube.com/watch?v=h1sUhSeJdf4"]
---

# Video 05 — Integridad de la información (2)

> **54:08** · subido el **27/03/2025** (jueves) · docente **Rodrigo Ramele** · video **oculto** (*unlisted*: se accede por la playlist, no sale en la búsqueda) · [Ver en YouTube](https://www.youtube.com/watch?v=h1sUhSeJdf4)
> **Es la segunda mitad de una sola jornada partida en dos archivos**, subidos el mismo día: el [[video-04-integridad-de-la-informacion-1|Video 04]] cierra negociando el recreo con el curso y éste arranca inmediatamente después. Sumados dan 2h 05.
> **Filminas 22 a 41** del deck [Clase 03 - Criptografia - MACs y Cifrado Autenticado.pdf](../../raw/clases/Clase%2003%20-%20Criptografia%20-%20MACs%20y%20Cifrado%20Autenticado.pdf) (41 páginas). Mapea a la fila **MAC y cifrado autenticado (2)**, jueves **03/09**, del [[cronograma]] — la segunda sesión de la [[clase-03-macs-y-cifrado-autenticado|Clase 03]].
> **Es una clase en vivo de otra cursada.** Marzo de 2025, dictada por Ramele; en 2026 la Clase 03 la da **Pablo Abad**. Se oyen alumnos por micrófono y por chat (Mauro, Uriel, Patrick, Nicolás), y en el cierre negocia con ellos y se despide. No es material producido en estudio.

**Para qué sirve mirarlo:** es una **segunda voz sobre las filminas 22-41** — hash, `HMAC`, cifrado autenticado, `CCM` y `GCM` —, de un docente distinto del que dictó esa sesión en 2026. Hasta el 04/09 era la **única** fuente hablada de ese tramo; dejó de serlo cuando apareció la [transcripción del 03/09](../../raw/clases/Clase%2003pt2%20-%20Transcripcion.VTT), que es la sesión real de esta cursada y está volcada en la [[clase-03-macs-y-cifrado-autenticado#12. La segunda sesión: cómo retoma el 03/09|Clase 03]]. Lo que conserva de valor es el **contraste**: Ramele en 2025 contra Abad en 2026 sobre el mismo deck. **Para qué no sirve:** no hay una sola demostración desarrollada, ni un ejercicio resuelto, ni nada de la matemática de la paradoja del cumpleaños; si se busca eso, las notas de `conceptos/` ya lo tienen más completo que el video.

---

## 1. Lo que hace único a este video

Tres cosas, en orden de importancia.

**Uno: es la segunda voz sobre la segunda mitad del deck** — y durante un tiempo fue la única. Las filminas 22 a 41 son el programa entero de funciones de hash, privacidad e integridad y cifrado autenticado. En la cursada 2026 esa sesión cae el **03/09**, y **desde el 04/09 la wiki sí tiene su transcripción**: las [[clase-03-macs-y-cifrado-autenticado#12. La segunda sesión: cómo retoma el 03/09|§12 a §25 de la Clase 03]] están escritas contra el audio de Abad, no contra el PDF. Este video sigue valiendo por dos razones: recorre las veinte filminas una por una sin saltearse ninguna, y lo hace **otro docente**, así que donde los dos difieren hay una lectura de la cátedra que ninguna filmina fija.

**Dos: se solapa con el [[video-04-integridad-de-la-informacion-1|Video 04]], y el solapamiento está medido.** El corte entre los dos archivos **no** cae en la juntura del deck: el 04 termina con la **filmina 22** en pantalla durante sus últimos 5 min 33 s, y el 05 arranca con **esa misma filmina 22**, que se queda hasta 06:58. Entre los dos, **12 min 31 s de clase sobre la misma página**. No es solapamiento de audio literal: en el 04 la trabaja de palabra (digest, tablas de hash, el `equals` de Java) y acá **vuelve a leer las viñetas** entre 05:38 y 06:56. Si vienes del 04, los primeros siete minutos de éste te van a sonar.

> Esto corrige lo que la [[videografia#El corte de los dos videos de Integridad|Videografía]] infería como *"#1 sobre la primera mitad, #2 sobre la segunda"*, con filminas 1-21 y 22-41. El corte real es **1-22 (salteando la 17) / 22-41**, con una filmina compartida. Está verificado cuadro por cuadro contra el PDF del repo, no inferido.

**Tres: contiene la frase que prueba que los videos de teoría de números son material aparte.** En 46:17, en medio de una digresión, dice *"yo después les voy a subir un video también"* sobre aritmética modular. Es el propio docente distinguiendo, dentro de una clase en vivo, entre la clase que está dando y los videos complementarios que produce por separado — o sea, [Guía rápida a teoría de números](https://www.youtube.com/watch?v=FcM8RpBvkf4) y [Euclides extendido](https://www.youtube.com/watch?v=KgnrX6I_Nd4) no son grabaciones de clase.

---

## 2. Recorrido

Las filminas están verificadas contra el PDF por decodificación continua del video; los timestamps de la columna *Tramo* son de contenido hablado y salen de la transcripción.

| Tramo | Filmina | Qué pasa | Nota del vault |
|---|---|---|---|
| **00:01 - 01:32** | 22 | Retoma el hilo: los esquemas de integridad **sin clave** se montan sobre funciones de hash. $h = H^{s}(m)$ de longitud $L$, obligatoriamente menor que la del mensaje | [[funciones-de-hash-criptograficas\|Funciones de hash criptográficas]] |
| **01:32 - 05:38** | 22 (sin cambiar) | **Digresión, y no está en ninguna filmina:** bit de paridad, `CRC`, el octavo bit del `ASCII` de 7 bits. Ver [[#3. Los primeros cinco minutos no están en ninguna filmina\|§3]] | — |
| **05:38 - 06:58** | 22 | Lee las viñetas: **$s$ es un selector, no una clave**; *"se llama funciones de resumen"*; *"son análogas a los MAC, pero sin clave"* | [[funciones-de-hash-criptograficas#El selector no es una clave\|Funciones de hash — El selector no es una clave]] |
| **06:58 - 08:40** | 23 | Etiquetadores universales: la tabla de *"The red fox jumps over the blue dog"* y el efecto avalancha | [[funciones-de-hash-criptograficas#Etiquetadores universales\|Etiquetadores universales]] |
| **08:40 - 09:57** | 24 | Colisiones: $n+1$ mensajes contra $n$ salidas, existen siempre. Es conteo, no debilidad | [[resistencias-de-una-funcion-de-hash#Las colisiones existen siempre\|Resistencias — Las colisiones existen siempre]] |
| **09:57 - 11:30** | 25 | Resistencia a preimágenes (cartel *ONE WAY*) | [[resistencias-de-una-funcion-de-hash#Las tres resistencias\|Las tres resistencias]] |
| **11:30 - 13:15** | 26 | Resistencia a segundas imágenes, y la diferencia con colisiones — **el punto que más machaca** | [[resistencias-de-una-funcion-de-hash#Lo único que las distingue es quién elige\|Lo único que las distingue es quién elige]] |
| **13:15 - 13:40** | 27 | Resistencia a colisiones, definición informal | idem |
| **13:40 - 15:43** | 28 | Experimento formal **Hash-Coll**, calcado del `Mac-Forge` | [[resistencias-de-una-funcion-de-hash#El juego Hash-Coll\|El juego Hash-Coll]] |
| **15:43 - 19:06** | 29 | Modelo general iterativo de **Merkle (1989)**: padding, bloque de longitud, función de compresión, $H_0 = IV$, función $g$ final. Acá declara que no tiene las notas | [[construccion-de-merkle-damgard\|Construcción de Merkle-Damgård]] |
| **19:06 - 21:58** | 30 | `MD5`: 128 bits, y para qué sigue sirviendo | [[primitivas-de-hash-estandar#MD5\|Primitivas de hash estándar — MD5]] |
| **21:58 - 23:54** | 31 | `SHA-1`: 160 bits, *"construida sobre la base de MD5"*, y el proceso de *challenge* público del NIST | [[primitivas-de-hash-estandar#SHA-1\|SHA-1]] |
| **23:54 - 24:38** | 32 | `SHA-3`: 224/256/384/512, NIST 2013, modelo esponja. **Acá comete el desliz de SHA-256** ([[#11. Erratas, deslices y dudas declaradas\|§11]]) | [[primitivas-de-hash-estandar#SHA-3\|SHA-3]] |
| **24:38 - 27:06** | 33 | `HMAC`: doble hash con `opad` e `ipad`, y por qué *"infalsificable"* sin definición formal detrás es chamullo | [[hmac\|HMAC]] |
| **27:06 - 28:57** | 34 | Costo de fuerza bruta de los tres ataques: $\lvert B \rvert$, $\lvert B \rvert$, $\lvert B \rvert^{1/2}$ | [[seguridad-de-las-funciones-de-hash#Los tres objetivos del atacante\|Los tres objetivos del atacante]] |
| **28:57 - 33:48** | 34 (sin cambiar) | **Paradoja del cumpleaños**, diez minutos, sólo conceptual. Él mismo aclara que no está en la presentación | [[seguridad-de-las-funciones-de-hash#Por qué la raíz cuadrada: la paradoja del cumpleaños\|Por qué la raíz cuadrada: la paradoja del cumpleaños]] |
| **33:48 - 36:04** | 35 | Funciones de hash en la práctica: mínimo 160 bits, `MD5` tachada, `SHA-3` recomendada | [[primitivas-de-hash-estandar#La lista de recomendadas del slide 35\|La lista de recomendadas del slide 35]] |
| **36:04 - 40:41** | 36 | Privacidad e integridad: las tres composiciones, con el veredicto de cada una | [[privacidad-e-integridad\|Privacidad e integridad]] |
| **40:41 - 42:11** | 37 | Cifrado autenticado: `CPA-Secure` + MAC infalsificable ⇒ `CCA-Secure`, con **dos claves distintas** | [[cifrado-autenticado\|Cifrado autenticado]] |
| **42:11 - 44:03** | 38 | Encadenamiento `CCM`, *authenticate-then-encrypt*, con la excepción de la clave única. La filmina propone un ejercicio | [[ccm-y-gcm#CCM\|CCM]] |
| **44:03 - 46:12** | 39 | Encadenamiento `GCM`: modo contador arriba, `GHASH` sobre $\mathrm{GF}(2^{128})$ abajo | [[ccm-y-gcm#GCM\|GCM]] |
| **46:12 - 47:38** | 39 (sin cambiar) | Digresión sobre teoría de números y sobre una materia que quiso abrir. **Adentro está lo único que dice del parcial** | [[#10. Lo que dijo sobre el parcial\|§10]] |
| **47:38 - 50:15** | 40 | Aplicaciones prácticas: sólo cifrado autenticado en sistemas reales, y la analogía del puente | [[cifrado-autenticado#Por qué en sistemas reales sólo se usa cifrado autenticado\|Por qué en sistemas reales sólo se usa cifrado autenticado]] |
| **50:15 - 54:08** | 41 | Lectura recomendada (Katz & Lindell), preguntas y cierre | [[bibliografia\|Bibliografía]] |

**La clase termina veinte minutos antes de hora**, y él lo dice: *"nos queda más de media hora, hicieron muy poquitas preguntas"* (50:18).

---

## 3. Los primeros cinco minutos no están en ninguna filmina

Es el mejor aporte del video por encima del PDF, y es puro audio: **cuatro minutos explicando qué es un hash NO criptográfico**, para que después se entienda por qué un hash cualquiera no sirve.

El **bit de paridad** es el hash más simple que existe. A una palabra de 8 bits se le agrega un noveno que vale $0$ si la cantidad de unos es par y $1$ si es impar — se calcula con `XOR` de todos los bits. Guardado junto al dato, permite detectar que **un** bit se flipeó en memoria; si se flipean **dos**, la paridad vuelve a coincidir y el error pasa. Es un hash en el sentido literal: un valor sintético, más corto que la entrada, que representa lo que hay ahí.

De ahí sube en escala: menciona los **códigos de Hamming** y el **`CRC`**, que generaliza la idea viendo los bits como un polinomio binario y quedándose con el resto de una división. Y cierra con el dato histórico: el **`ASCII` original era de 7 bits** y el octavo era justamente el bit de error.

> [!quote]- Del video — la bajada de los cuatro minutos de digresión (06:03)
> *"¿Cuáles son las [funciones de hash] que nos sirven criptográficamente? Porque no nos sirven todas, porque particularmente, por ejemplo, **las funciones de hash criptográficas no son para detectar errores, errores fortuitos**: tienen otro objetivo, que tienen el objetivo de integridad por detrás. Nosotros queremos dar integridad, evitar que alguien toquetee a propósito las cosas."*

La distinción que queda es **fortuito contra deliberado**: paridad y `CRC` protegen contra ruido de canal, no contra un adversario que puede elegir el mensaje. Es la misma frontera que separa un checksum de un `MAC`, y es lo que después le permite descartar `MD5` sin descartarlo del todo ([[#6. Las primitivas: MD5, SHA-1, SHA-3 y los digests en pantalla|§6]]).

---

## 4. Hash: la definición, el selector y las tres resistencias

La filmina 22 define el par de algoritmos: $\mathsf{Gen}$ elige $s \leftarrow S$, y $\mathsf{Hash}$ devuelve $h = H^{s}(m) \in \{0,1\}^{L}$.

Lo que el video agrega sobre la filmina es **el énfasis en que $s$ no es una clave**. Lo dice dos veces, una en cada video, y lo desarrolla: $s$ selecciona una función dentro de una familia, y *"son muy pocos los algoritmos que son familias: es un algoritmo y chau"*. O sea, en la práctica $S$ tiene un solo elemento y el selector no aparece por ningún lado. La nota [[funciones-de-hash-criptograficas#Por qué la teoría define una familia igual|Funciones de hash criptográficas]] ya explica por qué la teoría lo define igual; el video no agrega esa parte.

Las tres resistencias van una por filmina (25, 26, 27) y él las lee, pero **se detiene en una sola**: la diferencia entre segundas imágenes y colisiones. Le pregunta a la clase cuál es, nadie contesta, y la da él.

> [!quote]- Del video — la diferencia entre colisiones y segundas imágenes (12:28)
> *"En **las colisiones yo puedo buscar cualquier par**"* — contra el caso de segundas imágenes, donde el primer valor viene **fijado** y hay que encontrarle uno que le empate.

La conclusión es que **encontrar una segunda preimagen de un $x$ dado es un problema más duro que encontrar un par colisionante cualquiera**, y eso es exactamente lo que se cobra en [[#8. El costo de los tres ataques y la paradoja del cumpleaños|§8]] cuando aparece el $\lvert B \rvert^{1/2}$. La [[resistencias-de-una-funcion-de-hash#Lo único que las distingue es quién elige|nota de resistencias]] lo formula mejor: lo único que cambia entre las tres es **quién elige qué**.

El experimento **Hash-Coll** (filmina 28) lo presenta como calcado del `Mac-Forge`: se selecciona $s \leftarrow S$; el adversario $A$ obtiene **acceso total** a $H(x) = H^{s}(x)$ y la consulta todo lo que quiera; $A$ emite un par $x, x'$. El experimento vale $1$ si $x \neq x'$ y $H(x) = H(x')$. Entonces

$$\Pr[\mathsf{Hash\text{-}Coll}_{A,H} = 1] < \mathrm{negl}(n) \;\Longrightarrow\; H \text{ es libre de colisiones}$$

El subrayado que hace en voz: **no hay ninguna restricción sobre lo que el atacante puede computar**. La garantía es sobre la probabilidad, no sobre el poder de cómputo.

---

## 5. El modelo iterativo, y la duda que declara en vivo

La filmina 29 trae el diagrama clásico: entrada original $x$, preprocesamiento (*append padding bits* y *append length block*), entrada formateada $x = x_1 x_2 \ldots x_t$, procesamiento iterado con la función de compresión $f$, y una caja $g$ final.

$$H_{0} = IV, \qquad H_{i} = f(H_{i-1}, x_{i}), \qquad h(x) = g(H_{t})$$

Dos cosas para registrar, y las dos importan:

**El nombre Merkle-Damgård no aparece nunca.** Ni en la filmina, que se titula *"Modelo general iterativo"*, ni en el audio. El único nombre propio es **Merkle, 1989**. La wiki lo llama [[construccion-de-merkle-damgard|Merkle-Damgård]] — que es el nombre correcto y estándar —, pero conviene saber que **la cátedra acá no lo usa**, por si en un parcial el enunciado dice *"modelo general iterativo"*.

**Él mismo declara que no está seguro del encadenamiento.** En 17:32: *"me parece que es un [XOR] acá, creo que es un [XOR]… no me acuerdo, no tengo las notas"*. El diagrama de la filmina muestra $f$ alimentada por $H_{i-1}$ y $x_i$, **sin ningún XOR dibujado**. No completamos lo que él no afirmó: el encadenamiento de la filmina pasa por $f$, y punto. El desarrollo correcto —incluido dónde sí aparece un XOR, en Davies-Meyer— está en la [[construccion-de-merkle-damgard#El diagrama, pieza por pieza|nota de concepto]].

Menciona dos veces al pasar (16:02 y 18:16) que el **Merkle tree** hereda de esto y que es lo que habilita blockchain, y las dos veces lo difiere explícitamente a más adelante. **No es contenido de esta clase.**

---

## 6. Las primitivas: MD5, SHA-1, SHA-3 y los digests en pantalla

Tres filminas, una por primitiva, con la misma estructura: entrada de hasta $2^{64}$ bits, salida de tamaño fijo, aplicación iterativa, y tres digests de ejemplo. **No hay filmina de `SHA-2`**: aparece una única vez, como línea suelta en la filmina 35, y no la explica.

Los nueve digests que se ven en pantalla, **verificados con `openssl` contra la cadena vacía, `"a"` y `"abc"`**:

| Entrada | `MD5` (128 bits) | `SHA-1` (160 bits) | `SHA-3-256` (256 bits) |
|---|---|---|---|
| *(vacía)* | `d41d8cd98f00b204e9800998ecf8427e` | `da39a3ee5e6b4b0d3255bfef95601890afd80709` | `a7ffc6f8bf1ed76651c14756a061d662f580ff4de43b49fa82d80a4b80f8434a` |
| `a` | `0cc175b9c0f1b6a831c399e269772661` | `86f7e437faa5a7fce15d1ddcb9eaeaea377667b8` | `80084bf2fba02475726feb2cab2d8215eab14bc6bdd8bfb2c8151257032ecd8b` |
| `abc` | `900150983cd24fb0d6963f7d28e17f72` | `a9993e364706816aba3e25717850c26c9cd0d89d` | `3a985da74fe225b2045c172d6bd390bd855f086e3e9d525b46bfe24511431532` |

Los tres se corresponden con [[primitivas-de-hash-estandar#Los digests de ejemplo, verificados|Los digests de ejemplo, verificados]]. El detalle de longitud que él marca: **32 caracteres hexadecimales para `MD5`, 40 para `SHA-1`**, porque son 128 contra 160 bits. Sugiere reproducirlos con `md5sum` en Mac o Linux.

Sobre **`MD5`**, la bajada es más matizada que *"está roto, no lo uses"*. Le pregunta a la clase para qué lo usan; contestan *checksum de zips* y *verificar que una versión no cambió*. Y ahí separa los dos usos: para **detectar errores de transmisión** sigue siendo válido; para que **nadie te lo toquetee a propósito**, no.

> [!quote]- Del video — el criterio para MD5 (21:00)
> *"No es un algoritmo que hay que usar cuando el objetivo es un objetivo de seguridad."*

Sobre **`SHA-1`**, lo único que aporta por encima de la filmina es el contexto del **proceso de challenge del NIST**: se abre el algoritmo candidato y la comunidad intenta romperlo en público, y lo conecta con la ventaja de seguridad del código abierto. **No menciona SHAttered ni dice que `SHA-1` esté quebrada** — la [[primitivas-de-hash-estandar#La lista de recomendadas del slide 35|errata de la filmina 35]], que lista `SHA-1` entre las recomendadas sin marca, tampoco la corrige en voz.

En la filmina 35, **`SHA-3` es la recomendación explícita para proyectos nuevos**, y `MD5` está tachada y marcada *"Quebrada"*. Ahí es donde dice que recomendar `MD5` en un proyecto profesional *"les pueden hacer un juicio por mala praxis"* (34:57).

> **Errata de la filmina:** la 35 escribe *"Antes conocida como Kekkak"*. Es **Keccak**, el candidato que el NIST eligió para `SHA-3` en 2012.

---

## 7. HMAC

La filmina 33 da la construcción completa. Dada una $H$ libre de colisiones, $\mathsf{Gen}$ saca $k \leftarrow \mathcal{K}$ y $s \leftarrow S$, y

$$t = H^{s}\big( (k \oplus \mathsf{opad}) \,\Vert\, H^{s}( (k \oplus \mathsf{ipad}) \,\Vert\, m ) \big)$$

Lo que agrega de palabra: que `opad` e `ipad` son **dos constantes hardcodeadas elegidas por los autores** para dar buena difusión y confusión, y que está **probado** que `HMAC` supera el experimento `Mac-Forge`, o sea que es infalsificable. Y de ahí sale la advertencia metodológica más citable del video.

> [!quote]- Del video — por qué "seguro" sin definición formal no significa nada (27:20)
> *"En cualquier otro contexto que eso no esté definido concreto, y alguien te dice 'esto es infalsificable, esto es seguro, nadie lo puede romper': **es chamullo.** Si no lo contextualiza con esto."*

La lectura: **"infalsificable" es un predicado sobre un experimento**, no un adjetivo publicitario. Sin nombrar el juego contra el que se probó —`Mac-Forge`, `CPA`, `CCA`—, la afirmación está vacía. Es la misma idea que atraviesa [[pruebas-de-indistinguibilidad|Pruebas de indistinguibilidad]] y [[estado-de-un-criptosistema|Estado de un criptosistema]].

> **Errata de la filmina:** la 33 escribe $\mathsf{opad} = 0x36\ldots36$ y $\mathsf{ipad} = 0x5c5c\ldots5c$. **Los valores están intercambiados** respecto del RFC 2104, donde $\mathsf{ipad}$ es `0x36` repetido (*inner*) y $\mathsf{opad}$ es `0x5c` (*outer*). La estructura de la fórmula sí es correcta, y él la explica bien de palabra. Leída a alta resolución sobre el frame, la filmina proyectada en 2025 trae **la misma errata** que el PDF de 2026: no es un artefacto de la copia del repo. Desarmada en [[hmac#Errata central: opad e ipad tienen los valores intercambiados|HMAC — Errata central]].

---

## 8. El costo de los tres ataques y la paradoja del cumpleaños

La filmina 34 pone los tres objetivos del atacante sobre $h: A \to B$ y su costo de fuerza bruta:

$$\text{preimágenes: } \lvert B \rvert \qquad \text{segundas imágenes: } \lvert B \rvert \qquad \text{colisiones: } \lvert B \rvert^{1/2}$$

De ahí la conclusión operativa: **el ataque de colisiones es el más barato de los tres**, y por eso es el que fija el nivel de seguridad real de una función de hash.

Después vienen **diez minutos de paradoja del cumpleaños**, y hay que decir qué son y qué no son. **Son la anécdota, no la matemática.** Él aclara en 29:15 que *"no está tampoco en la presentación, y no estoy seguro si Pablo lo da en las clases"*, y avisa que no le va a dar detalle. Lo que queda del tramo es:

- Con **365 días** posibles, la cantidad de personas que hace falta juntar para que la probabilidad de que **dos cumplan el mismo día** llegue al 50 % es de **alrededor de 23**, no un número cercano a la mitad de 365.
- La razón es combinatoria: **se compara de a pares**, así que cada persona nueva agrega tantas comparaciones como personas ya había. Eso es lo que explica el exponente $1/2$.
- El experimento casero que propone: en una fiesta de más de 20 personas, anotar los cumpleaños; repitiéndolo 10 veces, en la mitad de los casos aparece un par repetido.
- Lo conecta al pasar con las **rainbow tables** ([[ataque-de-diccionario-sobre-hashes#Rainbow tables, en una línea|ataque de diccionario]]).

Para la derivación —el producto $\prod (1 - i/365)$, el paso a $\sqrt{\lvert B \rvert}$ y la cuenta de por qué $L$ bits de salida dan $L/2$ bits de seguridad— **el video no sirve**: está en [[seguridad-de-las-funciones-de-hash#El caso de los 23|Seguridad de las funciones de hash]] y él mismo remite a Katz & Lindell, capítulo 5 y página 542.

**El ejemplo numérico que sí cierra**, sobre la filmina 35: con el mínimo recomendado de **160 bits de salida**, la fuerza bruta contra imágenes cuesta $2^{160}$ operaciones y contra colisiones $2^{80}$. La mitad del exponente. Ése es todo el argumento de por qué 160 es el piso, y por qué [[seguridad-de-las-funciones-de-hash#Por qué 2 elevado a la 80 ya no alcanza|hoy 2⁸⁰ ya no alcanza]] — cosa que el video **no** dice: él lo ata a la ley de Moore y lo deja ahí.

---

## 9. Privacidad e integridad, cifrado autenticado, CCM y GCM

El último tercio es el arco que cierra la unidad, y es donde el video es más eficiente.

**Las tres composiciones** (filmina 36). Se disculpa porque no encuentra unos dibujos que las ilustraban, así que las explica de palabra, y la filmina va revelando el veredicto de cada una:

$$\text{(1) } c \leftarrow \mathsf{Enc}_{k_1}(m),\ t \leftarrow \mathsf{Mac}_{k_2}(m) \qquad \text{(2) } c \leftarrow \mathsf{Enc}_{k_1}\big(m \,\Vert\, \mathsf{Mac}_{k_2}(m)\big) \qquad \text{(3) } c \leftarrow \mathsf{Enc}_{k_1}(m),\ t \leftarrow \mathsf{Mac}_{k_2}(c)$$

| Composición | Veredicto de la filmina | Por qué |
|---|---|---|
| **Cifrar y autenticar** | Tachada con una cruz — *"$t$ puede brindar información de $m$"* | Al `MAC` la confidencialidad **no le interesa como objetivo**: nada le impide a la etiqueta filtrar el mensaje |
| **Autenticar, luego cifrar** | *"Puede ser seguro, requiere prueba de seguridad"* | No es segura por construcción: hay que probarla caso por caso |
| **Cifrar, luego autenticar** | *"Siempre es seguro"* | Es la recomendada, y es lo que hacen los protocolos tipo `SSL` |

> **Precisión sobre esos tres veredictos.** Están **en el PDF**, como builds de la filmina 36: `pdftotext -f 36` ya los trae. **No son anotaciones que el docente escriba en vivo**, aunque en el video aparezcan progresivamente sobre la misma página. Quien mire el video puede confundirse; quien lea el PDF los tiene todos juntos.

> [!quote]- Del video — el take-home message que enuncia como tal (40:33)
> *"Entonces esto es take home message: **cifren, y sobre el cifrado lo autentifican y generan el tag con el cifrado.**"*

Es una de las dos únicas cosas que él marca explícitamente como para llevarse. La otra es [[#10. Lo que dijo sobre el parcial|§10]].

**Cifrado autenticado** (filmina 37). Dado $\Pi_e$ `CPA-Secure` y $\Pi_m$ un MAC infalsificable, el combinado

$$\mathsf{Enc}: c \leftarrow \mathsf{Enc}_{k_1}(m),\ t \leftarrow \mathsf{Mac}_{k_2}(c) \qquad \mathsf{Dec}: \text{si } \mathsf{vrfy}_{k_2}(c,t)=1 \Rightarrow m = \mathsf{Dec}_{k_1}(c), \text{ si no, fallo}$$

es **`CCA-Secure`**. El énfasis en voz, dicho como aparte: **las dos claves tienen que ser distintas** (*"otra cosa, y tengan en cuenta que las claves tienen que ser distintas"*, 40:58). El desarrollo de por qué está en [[privacidad-e-integridad#Dos claves independientes|Dos claves independientes]]; el video sólo lo enuncia.

**`CCM`** (filmina 38). *Counter with CBC-MAC*, y es **authenticate-then-encrypt** — o sea, la composición (2), la que en general *"requiere prueba de seguridad"*:

$$e_{k}\big( \mathsf{cbc\text{-}mac}_{k}(M) \,\Vert\, m \big)$$

Lo excepcional, y lo dice con todas las letras: **esa prueba existe para este esquema en particular**, y lo que habilita es usar **la misma clave** para el cifrado y para el MAC, si el `IV` y el nonce no coinciden ni se reutilizan. Repasa qué es un nonce (*number used once*, se incrementa y se sincroniza entre las partes) y da su respuesta estándar: si un proyecto pide confidencialidad **más** integridad, `AES-CCM`. La filmina cierra con un **ejercicio: esquematizar un cifrado utilizando AES-CCM**, que **no resuelve en clase** y remite a *"material adicional en Campus"* — material que [[clase-03-macs-y-cifrado-autenticado#Cabos sueltos|no está en raw/]]. El ejercicio sí está [[ccm-y-gcm#El ejercicio del slide 38: esquematizar un cifrado con AES-CCM|resuelto en el vault]].

**`GCM`** (filmina 39). Lee el diagrama en dos mitades, y es la lectura más útil del tramo: **la parte de arriba es lisa y llanamente el cifrado en modo contador** (contador que se incrementa, se cifra con $E_k$, se hace XOR con el plaintext); **la de abajo toma los ciphertexts y va acumulando multiplicaciones** en aritmética modular hasta producir el *Auth Tag*.

$$H = E_{k}(0000\ldots0000) \qquad \mathsf{Mult}_{h}(x) = \mathsf{Mult}(x, h) \qquad \mathsf{Mult}(x,y) = x \cdot y \bmod x^{128}+x^{7}+x^{2}+x+1$$

Aclara que `GCM` es cifrado autenticado **distinto** de `CCM`, y que `AES-GCM` también es estándar. **No dice cuál preferir entre los dos** — eso lo resuelve el vault en [[ccm-y-gcm#CCM contra GCM|CCM contra GCM]] —, ni menciona el peligro de reusar el nonce en `GCM`, que es la contra grande del modo.

**Aplicaciones prácticas** (filmina 40). Tres reglas, y una arenga de dos minutos alrededor: usar **sólo** cifrado autenticado en sistemas reales, porque el cifrado *"normal"* puede ser manipulado; el requerimiento de privacidad **lleva implícito** el de integridad; y como uno casi nunca controla qué material se va a cifrar, la solución tiene que funcionar independientemente del contenido.

> [!quote]- Del video — privacidad implica integridad, y la analogía del puente (49:27)
> *"En aplicaciones reales, **el requerimiento de privacidad lleva implícito la integridad**. Y esto es recontraimportante que ustedes, ahora que cursaron esta materia, lo tengan presente y se lo graben a fuego. […] Construir sistemas informáticos sin tener en cuenta los aspectos de seguridad es como construir un puente y que si se cae, se cae. Es la misma idea. Toda la lógica de la mecánica y la estática es que el puente no se caiga."*

---

## 10. Lo que dijo sobre el parcial

Poco, y **no está donde uno lo buscaría**: la única indicación concreta sobre el parcial cae en 47:26, enterrada en medio de la digresión sobre teoría de números.

> [!quote]- Del video — lo único concreto sobre el parcial (47:22)
> *"[Ana] les da siempre algún ejercicio piola así para resolver de este estilo, que tienen que jugar un poco con esa matemática — y **para el parcial eso va, porque eso son ejercicios simples que se pueden tomar [en] el parcial**. Así que seguro, si buscan los archivos de los [parciales viejos], van a encontrar ese tipo de ejercicios. **Lo tienen que manejar** de alguna manera."*

O sea: **los ejercicios de aritmética modular y teoría de números que se dan en la práctica entran**, y recomienda buscar parciales viejos porque ahí están. Es sobre la Clase 4, no sobre ésta. Lo demás que dice de cara a la evaluación:

- **50:26** — *"Esta clase es muy importante"*, dicho al cerrar, más el consejo de aprovechar a Pablo la clase siguiente. Agrega que la grabación queda para consultar.
- **51:11 a 52:09** — La lectura. La filmina 41 manda **Katz & Lindell, capítulo 4**; en vivo agrega el **capítulo 5** (funciones de hash y aplicaciones, *"ahí está el ataque de cumpleaños y la parte matemática de por qué da eso"*) y los **apéndices A y B**, señalando la **página 542** para el problema del cumpleaños. Ver [[bibliografia#1. Katz & Lindell — Introduction to Modern Cryptography|Bibliografía]].
- **53:50** — *"El primer parcial lo armo y lo corrijo yo. El segundo también lo armo, aunque por ahí no lo tomo yo."* Dicho en 2025; **no hay garantía de que valga para 2026**, donde la Clase 03 la dio Abad.

**No dio temario, no dijo fecha, y no marcó ninguna demostración como "esto entra".**

---

## 11. Erratas, deslices y dudas declaradas

| Qué | Dónde | Cómo está |
|---|---|---|
| **`SHA-256` es `SHA-3`** | 24:12, de palabra | **Falso, y se contradice con su propia filmina 35**, que lista `SHA-2` y `SHA-3` por separado. `SHA-256` es la variante de 256 bits de **`SHA-2`**. Es un desliz al pasar, respondiéndole a un alumno; no lo corrige. Ver [[primitivas-de-hash-estandar#SHA-2\|SHA-2]] |
| **`opad` e `ipad` intercambiados** | Filmina 33 | Errata **del material**, no del docente. Confirmada en pantalla en la versión 2025 — [[#7. HMAC\|detalle en §7]] |
| **Kekkak** | Filmina 35 | Es **Keccak** |
| **`SHA-1` sin marca de quebrada** | Filmina 35 | La filmina la lista entre las recomendadas al lado de `MD5 → Quebrada`. `SHA-1` está rota desde **SHAttered (2017)**. **El video no lo corrige**: es la errata que más importa de esta mitad ([[primitivas-de-hash-estandar#La lista de recomendadas del slide 35\|03.09]]) |
| **$2^{64}$ bits de entrada para `SHA-3`** | Filmina 32 | Copiado de las filminas de `MD5` y `SHA-1`. **Falso para `SHA-3`**: el límite viene del bloque de longitud de Merkle-Damgård y la esponja no la usa. El video lee la filmina tal cual, sin notarlo |
| **El XOR del modelo iterativo** | 17:32, de palabra | **Duda declarada por él mismo**: *"no me acuerdo, no tengo las notas"*. La filmina no dibuja ningún XOR. Ver [[#5. El modelo iterativo, y la duda que declara en vivo\|§5]] |
| **"es falsificable"** | 27:02 | Lapsus: quiere decir **infalsificable** y se autocorrige siete segundos después |

**Dos cosas que no son erratas y podrían parecerlo:**

- Los veredictos de la filmina 36 (*"$t$ puede brindar información de $m$"*, etc.) **no son anotaciones en vivo del docente**: son builds del PDF de la cátedra. Ver [[#9. Privacidad e integridad, cifrado autenticado, CCM y GCM|§9]].
- Que `CCM` sea **authenticate-then-encrypt** cuando dos filminas antes dijo que ésa *"requiere prueba de seguridad"* **no es una contradicción**: el punto es justamente que `CCM` **tiene** esa prueba específica.

> **Ojo con el ASR.** La transcripción de este video es automática y castiga los nombres propios: *"M5"* y *"MN5"* por `MD5`; *"Ya 1"*, *"Ya tres"*, *"Shadow 56"* por `SHA-1`, `SHA-3`, `SHA-256`; *"Merkel"*, *"merker tre"* por Merkle; *"CS secure"* por `CCA-Secure`; *"ASCM"* y *"A es GCM"* por `AES-CCM` y `AES-GCM`; *"equisor"* y *"xisor"* por XOR; *"libro de Cats"* por Katz; *"Niss"* por NIST; *"los archivos de los personales"* por *los archivos de los parciales*. Las citas de esta nota van corregidas entre corchetes donde hacía falta.

---

## 12. Qué se puede saltear, y qué no aporta

**Tramos sin contenido de examen:**

- **46:12 - 47:38** — digresión sobre teoría de números y sobre una materia dedicada que él quiso abrir y no tuvo quórum. **Salvedad: adentro está lo único que dice del parcial** ([[#10. Lo que dijo sobre el parcial|§10]]), así que no lo saltees del todo.
- **50:15 - 54:08** — preguntas sobre qué capítulos leer, agradecimientos y despedida. Lo único rescatable son los capítulos de Katz.
- **28:57 - 33:48** — la paradoja del cumpleaños, si ya leíste [[seguridad-de-las-funciones-de-hash|03.11]]. Son diez minutos de anécdota sin una sola cuenta.
- **00:01 - 06:58** — si se viene del [[video-04-integridad-de-la-informacion-1|Video 04]], es la misma filmina 22 explicada de nuevo. La parte que **sí** vale es 01:32-05:38 ([[#3. Los primeros cinco minutos no están en ninguna filmina|§3]]), que no está en ninguna filmina ni en el 04.

**Lo que el video no tiene y las notas de concepto sí:** la demostración del teorema de Merkle-Damgård, el *length extension attack*, la matemática del cumpleaños, `SHA-2` explicada, SHAttered, el ejercicio de `AES-CCM` resuelto, `GHASH` desarmada por Horner, el peligro de reusar el nonce en `GCM`, y todo el [[ataque-de-diccionario-sobre-hashes|ataque de diccionario]], que sale de la [[guia-03-mac-y-funciones-de-hash|Guía 3]] y no del deck. **Para estudiar, el vault ya es más completo que el video.** Lo que el video da y el vault no puede dar solo es **el énfasis**: qué machaca, qué pasa rápido, y qué marcó como take-home.

**Lo que quedó sin poder verificar:** el *"material adicional en Campus"* que la filmina 38 cita para la prueba de `CCM` no está en `raw/` ni se muestra en el video. Y varias intervenciones de alumnos entraron **por chat escrito**, así que no quedan en la transcripción: sólo se ve la reacción de él.

---

## Ver también

- [[video-04-integridad-de-la-informacion-1|Video 04 — Integridad de la información (1)]] — la primera mitad de la misma jornada, filminas 1 a 22 salteando la 17
- [[clase-03-macs-y-cifrado-autenticado|Clase 03 — MACs y cifrado autenticado]] — la nota de clase, con las 41 filminas; este video cubre sus [[clase-03-macs-y-cifrado-autenticado#12. La segunda sesión: cómo retoma el 03/09|§12 a §25]]
- [[videografia|Videografía]] — el catálogo de los 13 videos y el mapeo contra el cronograma
- [[funciones-de-hash-criptograficas|Funciones de hash criptográficas]] · [[resistencias-de-una-funcion-de-hash|Resistencias de una función de hash]] · [[construccion-de-merkle-damgard|Construcción de Merkle-Damgård]] — filminas 22 a 29
- [[primitivas-de-hash-estandar|Primitivas de hash estándar]] · [[hmac|HMAC]] · [[seguridad-de-las-funciones-de-hash|Seguridad de las funciones de hash]] — filminas 30 a 35
- [[privacidad-e-integridad|Privacidad e integridad]] · [[cifrado-autenticado|Cifrado autenticado]] · [[ccm-y-gcm|CCM y GCM]] — filminas 36 a 40
- [[ataque-de-diccionario-sobre-hashes|Ataque de diccionario sobre hashes]] — el concepto de la unidad que **no** está en este video
- [[guia-03-mac-y-funciones-de-hash|Guía 3 — MAC y Funciones de Hash]] · [[guia-03-resolucion|Guía 3 — Resolución]] — la práctica del tema
- [[bibliografia|Bibliografía]] — Katz & Lindell, capítulos 4 y 5 y apéndices A y B, que es lo que manda a leer al cerrar
