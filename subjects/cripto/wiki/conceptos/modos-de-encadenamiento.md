---
title: Modos de encadenamiento
resumen: 'Los cinco modos que convierten una primitiva de bloque, determinística y de tamaño fijo, en un criptosistema usable: ECB, CBC, CFB, OFB y CTR, con su IV o nonce, su paralelismo y su propagación de errores.'
fuentes: ["[[clase-02-cifrado]]", "[[guia-02-criptografia-simetrica]]", "[[practica-03-seudoaleatoriedad-y-modos]]"]
aliases: [Modos de encadenamiento, Modos de operación, ECB, CBC, CFB, OFB, Counter, CTR]
type: concepto
unidad: 1
clase: 2
orden: 8
created: 2026-08-21
updated: 2026-09-06
tags: [criptografia, bloque, modos, ecb, cbc, cfb, ofb, ctr, propagacion-de-errores, fuera-de-orden, autosincronizacion, guia-02, practica-03, clase-02, transcripcion]
sources: ["Clase 02 - Criptografia - Cifrado.pdf", "raw/guias/guia2/Guia 2 - Criptografía Simétrica.pdf", "raw/practicas/Modo CFB.pdf", "raw/clases/Clase 02pt1-Transcripcion.VTT"]
---

# Modos de encadenamiento

Lo que convierte una [[primitiva-de-cifrado-en-bloque|primitiva de cifrado en bloque]] —determinística y de tamaño fijo— en un **criptosistema usable**.

> **Objetivo → extender una primitiva de cifrado a bloques mayores a su tamaño.**
> Hay diversos modos con diferentes propiedades. **No todos son aplicables a cada problema.**

---

## Los cinco modos

### ECB — Electronic Codebook

> Trata al mensaje original como un **conjunto de bloques independientes**.

![Modo ECB](../../assets/clase02-modo-ecb.png)

> **NO es CPA-Secure. (NO UTILIZAR)** — así, con el cartel rojo de prohibido, en la filmina.

**Por qué falla** *(razonamiento nuestro; la filmina sólo lo prohíbe).* ECB es la aplicación literal de la propiedad (3) de [[pruebas-de-indistinguibilidad#Propiedades de CPA|CPA]] —partir y concatenar— a una primitiva **determinística**, que es justo lo que la propiedad (1) descarta. Bloques iguales dan criptogramas iguales, así que **el patrón de repeticiones del texto plano sobrevive intacto**. Es exactamente la debilidad que hundió a la [[cifrado-de-sustitucion-monoalfabetica|sustitución monoalfabética]] en la Clase 01, sólo que con bloques de 128 bits en lugar de letras: cambia la escala, no el defecto.

### CBC — Cipher Block Chaining

> Utiliza **la salida de un bloque como entrada para el próximo**. Disminuye el traspaso de información. **Requiere un valor inicial (IV) ALEATORIO.**

![Modo CBC](../../assets/clase02-modo-cbc.png)

Cada bloque de texto plano se xorea con el criptograma anterior (y el primero, con el IV) antes de entrar a la primitiva. Es lo que rompe la correspondencia bloque-a-bloque de ECB.

### CFB — Cipher Feedback

> **Utiliza sólo la función `Enc`.** Menor complejidad para dispositivos embebidos. Permite generar una transformación **de flujo a partir de una de bloque**.

![Modo CFB](../../assets/clase02-modo-cfb.png)

### OFB — Output Feedback

> Construye una transformación de flujo a partir de una de bloque. **Permite calcular los bits de la transformación por adelantado.**

![Modo OFB](../../assets/clase02-modo-ofb.png)

La diferencia con CFB está en qué se realimenta: CFB realimenta el **criptograma**, OFB realimenta la **salida de la primitiva**. Por eso en OFB el keystream **no depende del mensaje** y se puede precalcular.

### Counter (CTR)

> Utiliza un **contador** para generar secuencias de bits de clave. **Permite acceso aleatorio.** Muy útil en ambientes con capacidad de procesamiento paralelo.

![Modo Counter](../../assets/clase02-modo-ctr.png)

La entrada de la primitiva es $\text{nonce} \,\Vert\, \text{contador}$, y el contador avanza por bloque. No hay realimentación de ningún tipo: **cada bloque es independiente de los demás**, y eso es lo que habilita el paralelismo y el acceso aleatorio.

**La anatomía de la entrada** es lo que explica el acceso aleatorio: el IV está dividido en dos partes, un **nonce** que se usa una sola vez por mensaje —y por eso es el mismo en todos los bloques de ese mensaje— y un **contador** que va $0, 1, 2, 3, \dots$. El bloque $i$-ésimo del keystream sale de $\mathsf{Enc}_k(\text{nonce}\Vert i)$ **sin necesitar ninguno de los anteriores**, y el diagrama de la filmina lo dibuja con valores concretos (`c59bcf35…` repetido, contador `00000000`, `00000001`, `00000002`).

Es también el modo que **más le exige a la primitiva**: dos entradas consecutivas difieren en un puñado de bits, así que sin [[primitiva-de-cifrado-en-bloque#El efecto avalancha|efecto avalancha]] los bloques de keystream serían casi iguales entre sí y `CTR` se caería solo.

---

### Los cinco, vistos juntos: no son cinco cosas distintas

> [!quote]- De la transcripción — qué son los cinco modos, y los dos juicios que la tabla no registra (cues pt1 733, 787, 795, 808)
> *"Todos estos, en definitiva, lo que están tratando de hacer es armar como una secuencia, **un generador pseudoaleatorio de bloques** que se usan para xorear con cada uno de los bloques"* (cue pt1 795). Sumado a lo que ya dijo en `CFB` —*"se está pareciendo cada vez más a lo que es el mismo OTP"* (cue pt1 787)—: **`CFB`, `OFB` y `CTR` no son modos de bloque, son maneras de fabricar un [[criptosistema-de-flujo|cifrado de flujo]] a partir de una primitiva de bloque**, y por eso reaparecen las reglas del [[cifrado-probabilistico-nonce-e-iv|cifrado probabilístico]]: IV que no se repite, nunca el mismo keystream dos veces.
>
> Y los dos juicios comparativos: sobre `ECB`, *"éste es el más básico de todos los encadenamientos, y es el menos seguro, el que menos garantías de seguridad ofrece"* (cue pt1 733); sobre `CTR`, *"es **mejor que los otros modos**, porque justamente permite que si hay un error en uno, el error se limita solamente a eso y no a todos los otros mensajes. No hay encadenamiento"* (cue pt1 808).

> [!quote]- De la transcripción — `CFB` contra `OFB`, en una línea (cues pt1 788-794)
> Los dos diagramas de la filmina son casi idénticos. El docente lo resuelve así: ***"la diferencia entre `CFB` y `OFB` es qué es lo que se propaga: si antes o después de hacer el xor."***
>
> Consecuencia inmediata: como en `OFB` el keystream no toca el criptograma, *"permite hacer eventualmente el cálculo por adelantado"* y un error *"se propaga sólo un bit"*.

> [!quote]- De la transcripción — para qué sirve todo esto (cues pt1 726-727)
> Lo dice presentando `ECB`: *"el objetivo de todo esto es **entender los riesgos**, no aplicar todo, porque aplicar todo es carísimo. Entender por dónde uno se está moviendo y qué es lo que gana y qué es lo que pierde en cada caso."*

---

## Tabla comparativa

*(Las tres primeras columnas son de la filmina; las de paralelismo y acceso aleatorio se leen de los diagramas — lectura nuestra.)*

| Modo | IV / nonce | Usa de la primitiva | Cifrado paralelo | Descifrado paralelo | Acceso aleatorio | Seguridad |
|---|---|---|---|---|---|---|
| **ECB** | ninguno | `Enc` y `Dec` | Sí | Sí | Sí | **no CPA-Secure** |
| **CBC** | IV **aleatorio** | `Enc` y `Dec` | encadenado | Sí | al descifrar | CPA-Secure con IV aleatorio |
| **CFB** | IV | **sólo `Enc`** | encadenado | Sí | al descifrar | CPA-Secure con IV aleatorio |
| **OFB** | IV | **sólo `Enc`** | keystream secuencial | No | No | CPA-Secure con IV aleatorio |
| **CTR** | **nonce** + contador | **sólo `Enc`** | Sí | Sí | Sí | CPA-Secure si no se repite $(k, \text{nonce})$ |

> **La columna que más se usa en la práctica es "usa sólo `Enc`".** CFB, OFB y CTR **nunca invocan `Dec`** — el descifrado también corre `Enc`. Eso significa que un dispositivo embebido puede implementar **la mitad** de la primitiva, y es literalmente el argumento que da la filmina de CFB.

> **A la tabla le falta una columna, y es la que decide en un canal ruidoso:** la **propagación de errores**. Las filminas no la tienen, así que está resuelta abajo en su propia sección → [[#Propagación de errores|Propagación de errores]]. Es lo único que separa de verdad a `OFB` y `CTR` del resto.

### La distinción IV aleatorio vs. nonce

Es sutil y la filmina la marca con las mayúsculas y con el paréntesis del último bullet:

- **CBC exige IV ALEATORIO** — impredecible, sorteado. Un IV que el adversario pueda predecir rompe CBC aunque nunca se repita.
- **CTR exige $(k, \text{nonce})$ no repetido** — alcanza con **unicidad**, y por eso puede ser un contador.

→ [[cifrado-probabilistico-nonce-e-iv#Nonce e IV no son exactamente lo mismo|Cifrado probabilístico, nonce e IV]]

---

## Seguridad: cómo se demuestra

> Las pruebas son **por reducción a propiedades de la primitiva subyacente**. Requieren que la primitiva se comporte como una **función pseudoaleatoria**.

Y entonces:

> Si la primitiva es una función pseudoaleatoria:
> - **CBC** es CPA-Secure con IVs aleatorios
> - **OFB, CFB** son CPA-Secure con IVs aleatorios
> - **Counter** es CPA-Secure si no se repite $(k, \text{nonce})$

> Y el remate de la filmina, con el cartel de peligro: **no está demostrado que existan las funciones pseudoaleatorias.**
>
> Vale la pena detenerse ahí. Toda la criptografía simétrica moderna es un edificio de **teoremas condicionales**: *si* AES se comporta como una PRF, *entonces* AES-CBC es CPA-Secure. La hipótesis nunca se demostró —demostrarla implicaría $\mathrm{P} \ne \mathrm{NP}$— y lo que la sostiene es que nadie la refutó en décadas de intentos. Es la versión honesta de "todavía nadie lo rompió" que la [[clase-01-introduccion-y-criptografia-clasica|Clase 01]] criticaba: la diferencia es que ahora **está aislada en un solo lugar**, la primitiva, y todo lo demás se deduce.

**Y `ECB` no figura en esa enumeración**: además de tener su propio cartel de prohibido, **no entra en el teorema**. El teorema tampoco dice *"CBC es seguro"*: dice ***"CBC es tan seguro como pseudoaleatoria sea la primitiva"***.

> [!quote]- De la transcripción — cómo se convive con el disclaimer (cue pt1 837)
> El docente lo relativiza sin borrarlo: *"no está demostrado que existan, pero, a efectos prácticos, **las que se utilizan se comportan bastante bien como si fuesen funciones pseudoaleatorias**"*. Es la última frase de la jornada del 13/08.

## Propagación de errores

**Las filminas no tocan el tema** — hay que sacarlo de los diagramas de arriba —, y sin embargo es lo que pregunta de frente el [[guia-02-criptografia-simetrica#Ejercicio 6|Ej. 6 de la Guía 2]]. Esta nota trae *"si se me corrompe un bit, ¿cuánto se me arruina?"*.

### El marco: son dos preguntas distintas, no una

Antes de contar bloques hay que decidir **dónde ocurrió el error**, porque los dos casos se propagan de manera completamente distinta y el ejercicio pregunta por los dos:

| Dónde ocurre el error | Qué se pregunta |
|---|---|
| En el **texto claro**, antes de cifrar (un bit mal en $P_i$) | ¿cuántos bloques de **texto cifrado** salen distintos? |
| En el **canal**, sobre el criptograma ya transmitido (un bit mal en $C_i$) | ¿cuántos bloques de **texto descifrado** salen mal? |

Y después no hay nada que memorizar. Se escribe la ecuación del modo, se busca **en qué expresiones aparece el bloque que cambió**, y se pregunta **por dónde entra**:

- **Entra por la primitiva** ($\mathsf{Enc}_K$ o $\mathsf{Dec}_K$) → efecto **avalancha**: el bloque entero queda destruido, con aproximadamente la mitad de los bits mal.
- **Entra por un xor directo** → se da vuelta **exactamente ese bit** y nada más.

Esa distinción resuelve los cinco modos.

### CBC con un error de 1 bit en P_1: se propaga a todos los bloques de cifrado

$$C_i = \mathsf{Enc}_K\big(P_i \oplus C_{i-1}\big), \qquad C_0 = \mathrm{IV}$$

Un bit cambiado en $P_1$ cambia la entrada de la primitiva en el paso 1, así que $C_1$ cambia **entero**. Pero $C_1$ es a su vez parte de la entrada del paso 2, y $C_2$ de la del paso 3, y así siguiendo: como $\mathsf{Enc}_K$ es una permutación pseudoaleatoria, cada vez que su entrada cambia su salida cambia por completo, y **la cadena nunca se corta**.

$$P_1 \ \text{mal} \;\Rightarrow\; C_1 \ \text{mal} \;\Rightarrow\; C_2 \ \text{mal} \;\Rightarrow\; \cdots \;\Rightarrow\; C_n \ \text{mal}$$

**Se propaga a TODOS los bloques de cifrado, desde $C_1$ hasta el último.** Es propagación **total**, no acotada. *(Verificado por simulación: con 6 bloques, cambian los 6.)*

> **La consecuencia práctica, que es de diseño y no de robustez.** Ésta es exactamente la razón por la que en la [[#Tabla comparativa|tabla comparativa]] `CBC` figura como *encadenado* en la columna de cifrado paralelo: **tocar un byte del texto plano obliga a recifrar todo lo que viene después**. Si lo que hace falta es reescritura puntual de un bloque —cifrado de disco, por ejemplo—, el modo es `CTR`, donde cada bloque es independiente.

### CBC con un error de 1 bit en C_1: se propaga a exactamente dos bloques

Ahora el error está **en el canal**, sobre el criptograma ya transmitido. Las ecuaciones de descifrado son

$$P_i = \mathsf{Dec}_K(C_i) \oplus C_{i-1}, \qquad C_0 = \mathrm{IV}$$

y acá está toda la gracia: $C_1$ aparece en **dos** de ellas, y **entra distinto en cada una**.

| Bloque | Ecuación | Cómo entra $C_1$ | Resultado |
|---|---|---|---|
| $P_1$ | $\mathsf{Dec}_K(C_1) \oplus \mathrm{IV}$ | por la **primitiva inversa** | **destruido por completo** — avalancha, ~la mitad de los bits mal |
| $P_2$ | $\mathsf{Dec}_K(C_2) \oplus C_1$ | por **xor directo** | **exactamente UN bit** dado vuelta, en la misma posición que el error |
| $P_3$ | $\mathsf{Dec}_K(C_3) \oplus C_2$ | no aparece | **intacto** |
| $P_4 \dots$ | $\mathsf{Dec}_K(C_i) \oplus C_{i-1}$ | no aparece | **intactos** |

**Se propaga a exactamente 2 bloques ($P_1$ y $P_2$), y a partir del tercero el descifrado se recupera solo.** *(Verificado por simulación: el primer bloque con muchos bits mal, el segundo con exactamente uno, el resto intacto.)*

Por eso se dice que **`CBC` es autosincronizante ante errores de bit**: el error se contiene y el flujo se recupera sin ninguna intervención. Ojo con el alcance de la afirmación — vale *ante errores de bit*, **no ante pérdida de bloques**.

> **El contraste entre los dos casos es el corazón del ejercicio.**
>
> | Dónde ocurre el error de 1 bit | Hasta dónde llega |
> |---|---|
> | En el **texto claro**, antes de cifrar | a **todos** los bloques de cifrado |
> | En el **canal**, sobre el cifrado | a **2** bloques descifrados, y se corta |
>
> Es asimétrico y no es casualidad: al cifrar, el bloque modificado vuelve a atravesar la primitiva **en cada paso** de la cadena; al descifrar, cada $C_i$ toca sólo dos ecuaciones, y en una de las dos entra por un xor que no realimenta nada.

> **Lectura de seguridad, que el ejercicio no pide** *(lectura nuestra).* Que un bit de $C_1$ dé vuelta **exactamente** ese bit en $P_2$ no es sólo un dato sobre robustez: es **maleabilidad**. Un atacante activo puede modificar bits elegidos del texto descifrado sin conocer la clave, al precio de destruir el bloque anterior. Es la razón concreta de por qué el cifrado por sí solo no alcanza y hace falta integridad — ver [[#Lo que esta clase no cubre|Lo que esta clase no cubre]].

### CFB de 8 bits: 1 + n/s caracteres, y depende del tamaño de bloque

En `CFB` con segmentos de $s$ bits, el criptograma **se realimenta a un registro de desplazamiento** del tamaño de bloque $n$ de la primitiva. En cada paso: se cifra el registro con $\mathsf{Enc}_K$, se toman los $s$ bits más significativos como keystream, se xorean con el carácter de $s$ bits, y **el carácter cifrado entra al registro por un extremo** mientras se descartan $s$ bits por el otro.

Con $s = 8$ (un carácter), un bit erróneo en el carácter cifrado $c_j$ tiene **dos efectos separados**:

1. **Sobre el carácter $j$ mismo.** Vale $p_j = c_j \oplus \mathrm{ks}_j$, y el keystream de ese paso todavía es correcto porque el error **aún no entró** al registro. Entra por xor directo → **un solo bit mal** en $p_j$.
2. **Sobre los caracteres que siguen.** El carácter erróneo entra al registro y **sobrevive $n/s$ desplazamientos** hasta que lo empujan afuera. Mientras esté adentro, la entrada de la primitiva es incorrecta, el keystream sale distinto y esos $n/s$ caracteres quedan **destruidos por completo**.

$$\text{caracteres afectados} \;=\; \underbrace{1}_{\text{un bit mal}} \;+\; \underbrace{n/s}_{\text{destruidos}}$$

**Acá está lo que el enunciado no dice y hay que asumir: el número depende del tamaño de bloque de la primitiva.**

| Primitiva o fuente | Bloque $n$ | Segmento $s$ | Desplazamientos $n/s$ | Caracteres afectados |
|---|---|---|---|---|
| [[des-y-3des\|DES]] | 64 bits | 8 bits | $64/8 = 8$ | $1 + 8 = \mathbf{9}$ |
| [[aes\|AES]] | 128 bits | 8 bits | $128/8 = 16$ | $1 + 16 = \mathbf{17}$ |
| **Láminas de `CFB` de la cátedra** ([[practica-03-seudoaleatoriedad-y-modos\|Práctica 03]]) | **32 bits** | **8 bits** | $32/8 = 4$ | $1 + 4 = \mathbf{5}$ |

Con `DES` son **9 caracteres** —uno con un solo bit mal y ocho destruidos—, y a partir del décimo el registro ya se limpió: **`CFB` también es autosincronizante**. Con `AES` serían **17**. La respuesta correcta no es un número absoluto sino $1 + n/s$; un examen que pida "9" está asumiendo `DES` sin decirlo.

> **Y la propia cátedra usa un tercer valor en su material.** Las cuatro láminas de [`Modo CFB.pdf`](../../raw/practicas/Modo%20CFB.pdf) del 24/08 trabajan con **$n = 32$ y $s = 8$** — ni `DES` ni `AES` —, parámetros que están impresos en las tres primeras y que la cuarta, la del ejercicio, da por heredados, y ahí la respuesta es $1 + 32/8 = \mathbf{5}$ caracteres. La lámina 4 deja el cálculo planteado como ejercicio (*"analizar: llega mal $c_1$"*), que es el mismo [[guia-02-criptografia-simetrica#Ejercicio 6|Ej. 6c de la Guía 2]] con otros parámetros. Es la mejor prueba de que lo evaluable es la fórmula: la cátedra le cambia el $n$ a su propio ejemplo. → [[practica-03-seudoaleatoriedad-y-modos#9.1. El ejercicio de la lámina 4: llega mal el primer segmento|Práctica 03 § El ejercicio de la lámina 4]]

### Tabla: propagación de errores en los cinco modos

*(La fuente resuelve `CBC` en sus dos versiones y `CFB` ante error en el canal. Las filas de `ECB`, `OFB` y `CTR`, y la columna del texto claro de `CFB`, salen de aplicar la misma regla a las ecuaciones de cada modo — lectura nuestra.)*

| Modo | Error de 1 bit en el **texto claro** $P_i$ | Error de 1 bit en el **criptograma** $C_i$ |
|---|---|---|
| **ECB** | $C_i$ destruido entero, el resto intacto — **contenido en 1 bloque** | $P_i$ destruido entero, el resto intacto — **contenido en 1 bloque** |
| **CBC** | $C_i$ y **todos** los bloques siguientes — propagación total | $P_i$ destruido + $P_{i+1}$ con **1 bit** dado vuelta — **2 bloques** |
| **CFB** de $s$ bits | $c_i$ con **1 bit** mal (entra por xor directo) + **todos** los segmentos siguientes destruidos (por realimentación) — propagación total | $p_i$ con **1 bit** mal + los $n/s$ siguientes destruidos — **$1 + n/s$ segmentos** |
| **OFB** | **1 bit** erróneo en $C_i$ y nada más | **1 bit** erróneo en $P_i$ y nada más |
| **CTR** | **1 bit** erróneo en $C_i$ y nada más | **1 bit** erróneo en $P_i$ y nada más |

**Por qué `OFB` y `CTR` no propagan nada.** Los dos generan el keystream **sin mirar ni el mensaje ni el criptograma**: `OFB` realimenta la salida de la primitiva y `CTR` no realimenta absolutamente nada (cifra $\text{nonce} \,\Vert\, \text{contador}$). Como el keystream **no depende del cifrado**, cifrar y descifrar son un **xor directo** en las dos direcciones, y no queda ningún camino por el que un error pueda viajar: un bit erróneo entra y sale como un bit erróneo, en la misma posición. Son [[criptosistema-de-flujo|criptosistemas de flujo]] puros, y ésta es la ventaja concreta de serlo.

Es la fila que la [[#Tabla comparativa|tabla comparativa]] todavía no mostraba, y en la práctica pesa: sobre un canal ruidoso —radio, satélite, almacenamiento con sectores dañados— `OFB` y `CTR` degradan **bit a bit**, mientras que `CBC` pierde **un bloque entero más un bit** por cada bit corrompido y `CFB` con `DES` pierde **nueve caracteres**. Si el canal mete ruido y no se puede retransmitir, ésa es la razón técnica para elegir un modo de flujo.

> **La contracara, para no leer la tabla como un ranking.** La ausencia de propagación es exactamente lo mismo que **maleabilidad en su forma más pura**: en `OFB` y `CTR`, dar vuelta un bit del criptograma da vuelta el bit correspondiente del plano, con precisión quirúrgica y sin destruir nada alrededor. Ninguno de los cinco modos da integridad, pero en éstos el atacante activo tiene la mira más fina.

**La regla que resume la tabla entera:** si el bloque corrupto **entra por la primitiva**, hay avalancha y sale el bloque entero mal —$\approx$ la mitad de los bits—; si **entra por un xor directo**, se da vuelta exactamente ese bit y nada más.

> [!quote]- De la transcripción — el docente lo comenta modo por modo mientras dibuja (cues pt1 753-808)
> Todo lo que dice acá es sobre un **error en el canal**, no sobre un error en el texto claro antes de cifrar.
>
> - **ECB** (cue pt1 753): *"cada error afecta solamente a cada uno de los bloques"* — queda contenido.
> - **CBC** (cues pt1 754-758): *"reciben mal éste y además van a recibir mal el que sigue; después para el tercero ya no"* — el bloque y el siguiente, y ahí se corta.
> - **CFB** (cues pt1 784-785): *"un error en un bloque genera un error en todos los demás (…) hay que transmitir todo de vuelta"*.
> - **OFB** (cue pt1 791): *"permite que se propague sólo un bit si hay un error"*.
> - **CTR** (cues pt1 804-808): *"acá no hay encadenamiento (…) cualquier error que ocurre en alguno de los bits sólo altera ese"*.

> **La fila de `CFB` dicha en clase no coincide con la cuenta hecha.** *"Un error en un bloque genera un error en todos los demás"* (cue pt1 784) no se sostiene al desarrollarlo: el criptograma se realimenta a un registro que **se limpia** después de un bloque, así que el daño está acotado y **`CFB` es autosincronizante**. El [[guia-02-criptografia-simetrica#Ejercicio 6|Ej. 6c de la Guía 2]] da el número exacto, $1 + n/s$ segmentos. Las otras cuatro filas sí coinciden. *(Lectura nuestra, contra la resolución de la guía.)*

### Bloques que llegan fuera de orden: un modo de falla distinto

Hasta acá el enemigo fue el **ruido**: un bit que se da vuelta. Pero una red puede entregar los bloques **en otro orden** sin corromper ni un bit, y ése es un modo de falla **distinto** — no hay error que propagar, lo que se rompe es la **posición**. Es el caso que dibuja explícitamente la lámina 3 de las [[practica-03-seudoaleatoriedad-y-modos#9.2. La lámina 3: bloques fuera de orden|láminas de CFB de la cátedra]]: *"llegan mezclados: $c_2, c_1, c_3, c_4, \dots$"*.

La pregunta cambia de forma. Ya no es *"¿cuántos bits salen mal?"* sino **"¿cuánto tarda el modo en volver a producir texto correcto?"**, y se responde con una sola regla, que además explica hacia atrás toda la sección anterior:

> **El daño dura lo que tarda la memoria del modo en vaciarse.**

Cada modo "recuerda" una cantidad fija de criptograma pasado, y ésa —no la complejidad del modo— es la que fija el costo de cualquier incidente local.

#### CFB: el tramo desordenado **más** n/s, mientras el desorden quepa en el registro

El registro de desplazamiento guarda los **últimos $n/s$ segmentos recibidos**, así que sigue sucio hasta que los intrusos salen por el otro extremo. Con $c_1$ y $c_2$ intercambiados y $n = 32$, $s = 8$ (o sea $n/s = 4$):

| Paso | Contenido del registro | Salida |
|---|---|---|
| 1 | $\mathrm{IV}$ — correcto | **basura**: el keystream es el bueno pero el criptograma es $c_2$ |
| 2 | $[\,\mathrm{IV} \Vert c_2\,]$ — sucio | **basura** |
| 3 | $[\,\mathrm{IV} \Vert c_2, c_1\,]$ — sucio | **basura** |
| 4 | $[\,\mathrm{IV} \Vert c_2, c_1, c_3\,]$ — sucio | **basura** |
| 5 | $[\,c_2, c_1, c_3, c_4\,]$ — sucio | **basura** |
| 6 | $[\,c_1, c_3, c_4, c_5\,]$ — **todavía** sucio: $c_1$ ocupa el lugar de $c_2$ | **basura** |
| 7 | $[\,c_3, c_4, c_5, c_6\,]$ — limpio | **correcto** |

$$\text{segmentos perdidos} \;=\; \underbrace{L}_{\text{tramo desordenado}} \;+\; \underbrace{n/s}_{\text{mientras el registro esté sucio}} \;=\; 2 + 4 \;=\; \mathbf{6}$$

donde $L$ es la **posición del segundo segmento intercambiado**, o sea el largo del tramo que llegó fuera de orden. *(Verificado por simulación con $n = 32$, $s = 8$: con $c_1 \leftrightarrow c_2$ salen mal las posiciones 1 a 6 y de la 7 en adelante son correctas; con $c_1 \leftrightarrow c_3$, que desordena un tramo de $L = 3$, salen mal 7.)*

> **Pero $L + n/s$ NO es una fórmula general, y el límite está más cerca de lo que parece.** Vale **mientras los dos tramos de daño se toquen**, o sea mientras $L \le n/s + 2$ — acá, hasta $L = 6$. Más allá, los segmentos del medio **llegaron en su posición correcta y con el registro ya limpio**, así que se descifran bien: el daño **se parte en dos tramos** y el total deja de crecer. Con $n = 32$ y $s = 8$ nunca pasa de **10 segmentos**, por lejos que estén los dos intercambiados. → [[#La regla exacta: dos tramos, no uno|La regla exacta]]

**`CFB` se autosincroniza también ante reordenamiento**, por el mismo motivo que ante un error de bit. Lo que **no** hace —y conviene no confundir— es *reparar*: los seis segmentos perdidos están perdidos, no salen "desordenados pero legibles".

#### CBC: el tramo desordenado **más 1**, y nunca más de 4 bloques

$$P_i = \mathsf{Dec}_K(C_i) \oplus C_{i-1}$$

Acá no hay registro: cada bloque descifrado mira **exactamente dos** bloques recibidos, el propio y el anterior. La memoria del modo es de **un solo bloque**. Con $C_1$ y $C_2$ intercambiados:

| Bloque | Ecuación con lo efectivamente recibido | Resultado |
|---|---|---|
| $P'_1$ | $\mathsf{Dec}_K(C_2) \oplus \mathrm{IV}$ | **basura** |
| $P'_2$ | $\mathsf{Dec}_K(C_1) \oplus C_2$ | **basura** |
| $P'_3$ | $\mathsf{Dec}_K(C_3) \oplus C_1$ | **basura** — difiere del verdadero $P_3$ en $C_1 \oplus C_2$ |
| $P'_4$ | $\mathsf{Dec}_K(C_4) \oplus C_3$ | **correcto** |

**Se pierden 3 bloques y a partir del cuarto se recupera solo.** *(Verificado por simulación; con $C_1 \leftrightarrow C_3$ se pierden 4, o sea $L + 1$.)*

> **Y ahí se termina la fórmula: $C_1 \leftrightarrow C_3$ es el último caso donde $L + 1$ acierta.** Con $C_1 \leftrightarrow C_4$ se pierden **4** y no 5, porque $P'_3 = \mathsf{Dec}_K(C_3) \oplus C_2$ —bloque propio en su lugar, bloque anterior también en su lugar— sale **correcto**. Los dañados pasan a ser $\{1, 2\}$ y $\{L, L+1\}$: **dos tramos separados por bloques sanos**, y el total se queda clavado en 4 para siempre. Como `CBC` recuerda un solo bloque, le alcanza un desorden mínimo para desbordarla.

#### La regla exacta: dos tramos, no uno

Las dos fórmulas de arriba son el caso fácil de una regla más simple, y la regla explica por qué se rompen. Con **dos posiciones intercambiadas**, la $1$ y la $L$, los bloques dañados son exactamente la unión de **dos** intervalos, uno por intruso:

$$\text{dañados} \;=\; [\,1,\ 1+M\,] \;\cup\; [\,L,\ L+M\,], \qquad M \;=\; \text{memoria del modo, en bloques}$$

con $M = 0$ para `ECB`, `OFB` y `CTR`, $M = 1$ para `CBC` y $M = n/s$ para `CFB`. Cada intruso ensucia **su propia posición y los $M$ pasos siguientes**, porque ésos son los que todavía lo tienen en la memoria; a nadie más. De ahí salen los dos regímenes:

| Régimen | Condición | Bloques perdidos |
|---|---|---|
| los dos tramos **se tocan** | $L \le M + 2$ | **contiguo**, $L + M$ — la fórmula de arriba |
| los dos tramos **se separan** | $L \ge M + 3$ | $2\,(M+1)$, y **ya no crece** |

*(Simulación nuestra, con una permutación pseudoaleatoria genuina —red de Feistel de 8 rondas sobre el bloque entero, verificada biyectiva— barriendo $L$ de 2 a 12 sobre 400 corridas por caso. Se reporta el **máximo**, no el promedio: con $s = 8$ un segmento dañado coincide por azar con el correcto una vez cada 256, y eso baja en 1 el conteo de alguna corrida suelta.)*

| $L$ = posición del segundo intercambiado | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 |
|---|---|---|---|---|---|---|---|---|---|---|
| **`CBC`** ($M = 1$) | 3 | **4** | 4 | 4 | 4 | 4 | 4 | 4 | 4 | 4 |
| **`CFB`** con $n = 32,\ s = 8$ ($M = 4$) | 6 | 7 | 8 | 9 | **10** | 10 | 10 | 10 | 10 | 10 |
| **`CFB`** con `DES`, $n = 64,\ s = 8$ ($M = 8$) | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | **18** | 18 |

En **negrita**, el último valor en el que la fórmula $L + M$ todavía acierta; a partir del siguiente, sobreestima. Nótese que el tope $2\,(M+1)$ no depende de $L$: **`CBC` nunca pierde más de 4 bloques y `CFB` con $n = 32$ nunca más de 10 segmentos**, aunque los dos bloques intercambiados estén a mil posiciones de distancia.

> **Lo que sí es exacto en los dos regímenes** es *cuándo* se recupera el modo: el primer bloque correcto es el $L + M + 1$, el primero en el que ni la posición propia ni ninguna de las $M$ anteriores fue tocada. Para `CBC` con $C_1 \leftrightarrow C_2$ da $2 + 1 + 1 = 4$, y para `CFB` con $n/s = 4$ da $2 + 4 + 1 = 7$ — los dos números de las tablas de arriba.

> **La moraleja, y es la que conviene llevarse al parcial.** Lo evaluable no es $L + n/s$ sino **la memoria del modo**: cada bloque que llega fuera de lugar arruina su posición y las $M$ siguientes. Con eso se reconstruyen las dos fórmulas cuando el desorden es chico *y* se sabe por qué dejan de valer cuando es grande. Si el enunciado sólo intercambia dos bloques **adyacentes** —que es lo que dibuja la lámina 3 de la cátedra—, se está en el régimen contiguo y $L + n/s$ es la respuesta correcta.

#### El contraste, que va en contra de la intuición

| Modo | Memoria $M$ | Perdidos con dos **adyacentes** ($L = 2$) | Tope, por lejos que estén | Se recupera en |
|---|---|---|---|---|
| **ECB** | **0** — no recuerda nada | **2** — y salen **correctos, en el orden equivocado** | **2** | no hay nada que recuperar |
| **CBC** | **1 bloque** | $L + M = \mathbf{3}$ | **4** | el bloque $L + 2$ |
| **CFB** de $s$ bits | **$n/s$ segmentos** | $L + M = \mathbf{6}$ con $n=32,\ s=8$ | $2\,(n/s + 1) = \mathbf{10}$ | el segmento $L + n/s + 1$ |
| **OFB** | **0** (keystream por posición) | **2** | **2** | inmediatamente |
| **CTR** | **0** (keystream por posición) | **2** | **2** | inmediatamente |

*(Las cinco filas verificadas por simulación. Las dos columnas del medio son el mismo número en `ECB`, `OFB` y `CTR` justamente porque su memoria es nula: no hay régimen que desbordar.)*

Uno esperaría que el modo con la realimentación más profunda fuera el más robusto, y es **exactamente al revés**: `CBC`, que recuerda un solo bloque, se recupera **antes** que `CFB`, que arrastra $n/s$ segmentos. **La profundidad de la memoria es la duración del daño**, y por eso `OFB` y `CTR` —que no realimentan nada del criptograma— pierden sólo lo que efectivamente llegó cambiado de lugar.

> **Y `ECB` es el caso interesante, por lo contrario.** No pierde nada: como $P_i = \mathsf{Dec}_K(C_i)$ no depende de la posición, **reordenar el criptograma reordena el texto plano y listo** *(verificado)*. Leído como robustez suena bien; leído como seguridad es la peor noticia de la tabla, porque un atacante puede **reordenar, duplicar o borrar bloques** y el receptor descifra sin notar nada. Es el mismo agujero que la [[#Lo que esta clase no cubre|maleabilidad]]: ninguno de los cinco modos da integridad, y `ECB` ni siquiera opone la resistencia accidental de un encadenamiento. Es una razón más, independiente del patrón de repeticiones, para la prohibición de la filmina.

> **Qué sigue sin estar resuelto.** La **pérdida** o **inserción** de bits o bloques es otro problema distinto —cambia la *cantidad*, no sólo el orden, y si no está alineada a los límites de bloque desalinea todo lo que sigue— y **no está en el material que tenemos**. Lo único que la fuente aclara es que la autosincronización de `CBC` vale *ante errores de bit, no ante pérdida de bloques*. No lo desarrollamos más allá de eso.

> **Desarrollo completo, paso a paso:** [[guia-02-criptografia-simetrica#Ejercicio 6|Guía 2 — Resolución, Ejercicio 6]] · [[guia-02-criptografia-simetrica#Ejercicio 6|enunciado literal]]

## Lo que esta clase no cubre

**Integridad.** Todos estos modos dan **confidencialidad y nada más**: son maleables, y la sección de arriba lo hace concreto —en `CBC` un bit del criptograma da vuelta un bit elegido del plano descifrado, en `OFB` y `CTR` lo da vuelta sin daño colateral—. El cifrado autenticado es el tema de la [[cronograma|Clase 3]].

*(La propagación de errores también faltaba en las filminas. Ya no falta acá: se resolvió arriba, a partir del [[guia-02-criptografia-simetrica#Ejercicio 6|Ej. 6 de la Guía 2]].)*
