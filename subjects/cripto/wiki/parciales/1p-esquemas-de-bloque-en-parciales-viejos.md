---
title: Esquemas de bloque en los parciales viejos
resumen: 'Los ejercicios de esquema de cifrado en bloque inventado que se tomaron en los cuatro primeros parciales del vault, con enunciado completo, respuesta modelo y tips.'
fuentes: ["[[parciales-viejos]]", "[[modos-de-encadenamiento]]", "[[pruebas-de-indistinguibilidad]]", "[[primitiva-de-cifrado-en-bloque]]", "[[cifrado-probabilistico-nonce-e-iv]]"]
aliases: [Esquemas de bloque en parciales viejos, Ejercicios viejos de esquema de bloque, Parcial esquemas de bloque resueltos]
type: parcial
clase: 1p
orden: 13
created: 2026-09-14
updated: 2026-09-14
tags: [parcial, primer-parcial, esquema-de-bloque, parciales-viejos, cbc, ctr, cpa]
sources: ["raw/parciales/Cripto - Primeros Parciales.pdf"]
---

# Esquemas de bloque en los parciales viejos

Hay un esquema de bloque inventado en cada uno de los cuatro parciales: seis ejercicios según la tabla de [[parciales-viejos|Parciales viejos]], donde está el análisis por parcial. Aquí se desarrollan cinco, en orden cronológico inverso: 2C-2025 Ej. 3, 1C-2025 Ej. 2, 1C-2023 Ej. 2 y Ej. 4, 1C-2018 Ej. 3. El sexto, el Ej. 4 del 1C-2018, es literalmente el mismo enunciado que el Ej. 4 del 1C-2023 —reapareció idéntico con cinco años de diferencia—, así que vale la misma respuesta modelo.

La receta y las trampas de este tipo están en [[1p-esquema-de-bloque|¿Es válido este esquema de bloque?]]; la sección entera empieza en [[primer-parcial|Primer parcial]].

## 2C-2025 · Ej. 3 — CBC con otro nombre

### Enunciado

Consideren el siguiente sistema de encripción en bloque para los mensajes $M_1M_2 \ldots M_n$, que generan los cifrados $C_0C_1C_2 \ldots C_n$.

$$\begin{aligned} C_0 &= IV \\ C_i &= E_k(C_{i-1} \oplus M_i), i = 1, 2, \ldots \end{aligned}$$

- a) ¿Es este un esquema de cifrado en bloque válido? Explicar y eventualmente corregirlo para que lo sea.
- b) Comparar la confidencialidad y la tolerancia a errores de transmisión de este sistema contra CBC, CTR y OFB.

### Respuesta modelo

**a) Validez.** El receptor conoce $k$ y recibe $C_0 = IV$ en claro junto con $C_1 \ldots C_n$. Como $E_k$ es una permutación con inversa $D_k$, al aplicarla a cada bloque queda $D_k(C_i) = C_{i-1} \oplus M_i$, y xoreando con $C_{i-1}$, que ya se recibió,

$$M_i = D_k(C_i) \oplus C_{i-1}, \qquad i = 1, \ldots, n.$$

Cada $M_i$ se recupera de forma única a partir de $k$, $C_i$ y $C_{i-1}$: **el esquema es válido** y no necesita corrección. Es exactamente el modo `CBC` —el xor con el criptograma anterior entra a la primitiva, y $C_{i-1} \oplus M_i = M_i \oplus C_{i-1}$—, con la única condición de uso que `CBC` exige: el $IV$ se sortea al azar para cada mensaje y no se repite con la misma clave.

**b) Confidencialidad.** Por ser `CBC`, es CPA-seguro si $E_k$ se comporta como una función pseudoaleatoria y el $IV$ es aleatorio: el mismo nivel que `CBC` (es el mismo esquema), que `CTR` (CPA-seguro si no se repite el par $(k, \text{nonce})$) y que `OFB` (CPA-seguro con $IV$ aleatorio). No aparece ninguna señal de inseguridad: el cifrado no es determinístico gracias al $IV$, y $C_i \oplus C_{i-1}$ no revela una función de $M_i$ porque la primitiva envuelve al xor. Como todo modo de encadenamiento, da confidencialidad y nada más: no da integridad.

**b) Errores de transmisión.** Sea un bit corrompido en $C_i$. Con $M_i = D_k(C_i) \oplus C_{i-1}$, $C_i$ aparece en dos ecuaciones: en $M_i$ entra por $D_k$ —avalancha, el bloque sale destruido entero— y en $M_{i+1} = D_k(C_{i+1}) \oplus C_i$ entra por un xor directo —se da vuelta exactamente ese bit—. De $M_{i+2}$ en adelante no se usa $C_i$: intactos. En `CTR`, $M_i = C_i \oplus E_k(\text{nonce} \Vert i)$ y el keystream no depende del criptograma: se corrompe solo ese bit de $M_i$. En `OFB`, $M_i = C_i \oplus O_i$ con $O_i = E_k(O_{i-1})$, que tampoco mira al criptograma: solo ese bit.

| Esquema | Un bit malo en $C_i$ afecta a |
|---|---|
| Este esquema | $M_i$ entero y un bit de $M_{i+1}$: 2 bloques, luego se autosincroniza |
| `CBC` | lo mismo: es el mismo esquema |
| `CTR` | un bit de $M_i$ |
| `OFB` | un bit de $M_i$ |

Conclusión: en confidencialidad está a la par de `CBC`, `CTR` y `OFB`; en tolerancia a errores es igual a `CBC` y peor que `CTR` y `OFB`, que degradan bit a bit. La contracara es que en `CTR` y `OFB` un atacante activo da vuelta bits elegidos del mensaje sin daño colateral: ninguno da integridad.

### Tips

- Lo que vale puntos en (a) es la fórmula del receptor escrita, no la frase "es CBC": primero $D_k(C_i) = C_{i-1} \oplus M_i$, después el despeje.
- Decir "es `CBC`" y heredar sus propiedades ahorra media respuesta, pero hay que justificar la equivalencia con la fórmula y nombrar la condición del $IV$ aleatorio.
- La trampa está en (b): `OFB` no propaga errores. Escribir su fórmula ($O_i = E_k(O_{i-1})$, $C_i = M_i \oplus O_i$) evita agruparlo con `CBC`.
- Se recicla en el 1C-2025 Ej. 2, que es el mismo enunciado con la primitiva en otra posición: conviene resolver los dos juntos.

## 1C-2025 · Ej. 2 — El esquema que parece CBC

### Enunciado

Consideren el siguiente sistema de encripción en bloque para los mensajes $M_1M_2 \ldots M_n$, que generan los cifrados $C_0C_1C_2 \ldots C_n$.

$$\begin{aligned} C_0 &= IV \\ C_i &= E_k(M_i) \oplus C_{i-1}, i = 1, 2, \ldots \end{aligned}$$

- a) ¿Es este un esquema de cifrado en bloque válido? Explicar.
- b) Comparar la confidencialidad y la tolerancia a errores de transmisión de este sistema contra CBC, CTR y OFB.

### Respuesta modelo

**a) Validez.** El receptor conoce $k$ y recibe $C_0 = IV$ y $C_1 \ldots C_n$. De $C_i = E_k(M_i) \oplus C_{i-1}$, xoreando con $C_{i-1}$ queda $E_k(M_i) = C_i \oplus C_{i-1}$, y como $E_k$ es una permutación con inversa $D_k$,

$$M_i = D_k(C_i \oplus C_{i-1}), \qquad i = 1, \ldots, n.$$

Cada bloque se recupera de forma única: **es válido**. Necesita la primitiva en las dos direcciones ($E_k$ para cifrar, $D_k$ para descifrar) y el $IV$ en claro. No es `CBC`: en `CBC` la primitiva envuelve al xor, $C_i = E_k(M_i \oplus C_{i-1})$; aquí el xor envuelve a la primitiva.

**b) Confidencialidad.** **No es CPA-seguro.** De la ecuación de cifrado sale

$$C_i \oplus C_{i-1} = E_k(M_i),$$

es decir, dos bloques contiguos del criptograma revelan una función determinística del bloque de mensaje, y el $IV$ no lo tapa porque se cancela al xorear. Experimento $\mathrm{PrivK}^{\mathrm{CPA}}_{A,\Pi}$, con $\Pi$ este esquema y $A$ el siguiente adversario:

1. $A$ elige dos mensajes de dos bloques: $m_0 = M \Vert M$ (dos bloques iguales) y $m_1 = M \Vert M'$ con $M' \ne M$. No necesita el oráculo.
2. Se genera $k$, se sortea $b \leftarrow \{0,1\}$ y $A$ recibe $c = E_k(m_b) = C_0 C_1 C_2$.
3. $A$ calcula $X_1 = C_1 \oplus C_0$ y $X_2 = C_2 \oplus C_1$. Emite $b' = 0$ si $X_1 = X_2$, y $b' = 1$ si no.

Si $b = 0$: $X_1 = E_k(M)$ y $X_2 = E_k(M)$ coinciden, y $b' = 0$. Si $b = 1$: $X_1 = E_k(M)$ y $X_2 = E_k(M')$ son distintos porque $E_k$ es inyectiva y $M \ne M'$, y $b' = 1$. Entonces

$$\Pr\big[\mathrm{PrivK}^{\mathrm{CPA}}_{A,\Pi} = 1\big] = 1 > \tfrac12 + \varepsilon(n),$$

y el esquema no es CPA-seguro. Es el mismo defecto de `ECB`: bloques iguales dejan una huella igual. `CBC`, `CTR` y `OFB`, en cambio, son CPA-seguros bajo la hipótesis de primitiva pseudoaleatoria con $IV$ aleatorio (`CBC`, `OFB`) o nonce no repetido (`CTR`). La corrección es mover la primitiva afuera del xor: $C_i = E_k(M_i \oplus C_{i-1})$, que es `CBC`.

**b) Errores de transmisión.** Descifrado: $M_i = D_k(C_i \oplus C_{i-1})$. Un bit corrompido en $C_i$ entra por $D_k$ en dos ecuaciones: en $M_i = D_k(C_i \oplus C_{i-1})$ y en $M_{i+1} = D_k(C_{i+1} \oplus C_i)$. En las dos hay avalancha: **$M_i$ y $M_{i+1}$ salen destruidos enteros**; de $M_{i+2}$ en adelante no se usa $C_i$ y salen bien. En `CBC` ($M_i = D_k(C_i) \oplus C_{i-1}$) se destruye $M_i$, pero en $M_{i+1}$ el bit entra por xor directo: un solo bit. En `CTR` y `OFB` el keystream no depende del criptograma y solo se corrompe ese bit de $M_i$.

| Esquema | Un bit malo en $C_i$ afecta a |
|---|---|
| Este esquema | $M_i$ y $M_{i+1}$ destruidos enteros: 2 bloques, luego se autosincroniza |
| `CBC` | $M_i$ entero y un bit de $M_{i+1}$: 2 bloques |
| `CTR` | un bit de $M_i$ |
| `OFB` | un bit de $M_i$ |

Conclusión: es válido pero inseguro, peor que los tres en confidencialidad; en errores queda acotado a dos bloques como `CBC` (algo peor, porque el segundo bloque se pierde entero) y peor que `CTR` y `OFB`, que pierden un bit.

### Tips

- El puntaje está en el experimento escrito completo: los mensajes ($M \Vert M$ contra $M \Vert M'$) con su porqué, la regla de decisión y la probabilidad $1$. La idea suelta ("xoreo contiguos") vale poco.
- Elegir $m_0$ con dos bloques iguales es la palanca: convierte una huella de bloque en una comparación de igualdad que el adversario hace sin clave y sin oráculo.
- Es el gemelo del 2C-2025 Ej. 3: mismo enunciado, primitiva en otra posición. Si se ve $E_k(M_i) \oplus \text{algo}$, probar $C_i \oplus C_{i-1}$.
- `OFB` no propaga errores: un bit. No agruparlo con `CBC`.

## 1C-2023 · Ej. 2 — CTR con una primitiva sin inversa

### Enunciado

Una propuesta de un cifrador en bloque usando modo CTR usa una primitiva de encripción $E(\cdot)$ que no admite una primitiva de desencripción inversa.

- (a) ¿ Es este un sistema de encripción válido ? Explicar.
- (b) ¿ Cómo se utiliza el nonce en dicho sistema ?
- (c) ¿ Cuál es la ventaja de este sistema en términos de procesamiento ?

### Respuesta modelo

**(a)** Sí, es válido. En `CTR` la primitiva se usa para generar un keystream, no para transformar el mensaje: con un nonce por mensaje y el número de bloque $i$,

$$C_i = M_i \oplus E_k(\text{nonce} \Vert i), \qquad M_i = C_i \oplus E_k(\text{nonce} \Vert i).$$

El receptor conoce $k$, recibe el nonce en claro y recomputa el mismo bloque de keystream $E_k(\text{nonce} \Vert i)$ **aplicando $E$ hacia adelante**; el xor es su propia inversa. En ninguna de las dos direcciones se invierte la primitiva, así que $E$ no necesita tener inversa: alcanza con que sea una función pseudoaleatoria (indistinguible de una función tomada al azar), no una permutación. Lo mismo vale para `OFB` y `CFB`; los que sí necesitan $D_k$ son `ECB` y `CBC`.

**(b)** El nonce es un valor que se elige para cada mensaje —al azar o con un contador de mensajes— y viaja en claro junto al criptograma. No entra en el xor: se concatena con el número de bloque para formar la entrada de la primitiva, $\text{nonce} \Vert i$, de modo que el keystream sea distinto para cada bloque del mensaje (por $i$) y para cada mensaje cifrado con la misma clave (por el nonce). La única condición es que **el par $(k, \text{nonce})$ no se repita**: basta unicidad, no hace falta que sea impredecible. Si se repitiera, dos mensajes compartirían keystream y $C \oplus C' = M \oplus M'$; el cifrado sería determinístico para ese nonce y dejaría de ser CPA-seguro.

**(c)** No hay ninguna dependencia entre bloques: el keystream del bloque $i$ es $E_k(\text{nonce} \Vert i)$ y no necesita el bloque anterior. Por eso el cifrado y el descifrado se **paralelizan** bloque a bloque, hay **acceso aleatorio** (se descifra el bloque $j$ sin tocar los anteriores) y el keystream se puede **precalcular** antes de tener el mensaje. Además, como solo se usa $E$, un dispositivo implementa la mitad de la primitiva. Y un bit corrompido en $C_i$ afecta solo a ese bit de $M_i$.

### Tips

- La respuesta a (a) es la fórmula de descifrado con $E$ hacia adelante. Decir "sí" sin la fórmula no muestra que se entendió.
- La distinción que vale puntos: `CTR`, `OFB` y `CFB` piden una función pseudoaleatoria; `ECB` y `CBC` piden una permutación invertible.
- En (b) se evalúa la condición de unicidad del par $(k, \text{nonce})$ y su contraste con el $IV$ aleatorio de `CBC`.
- Se recicla en cualquier comparación contra `CTR`: paralelismo, acceso aleatorio y un bit de propagación son siempre sus tres ventajas.

## 1C-2023 · Ej. 4 — Cuando el aleatorio deja de serlo

### Enunciado

Dado el siguiente criptosistema $\Pi = (\mathsf{Gen}, \mathsf{Enc}, \mathsf{Dec})$.

Para $p \in \mathbb{Z}$ y $a, b, r \in \mathbb{Z}_p$, siendo la clave $k = (a, b)$ y siendo $r \leftarrow random$

$$\begin{aligned} c &= E_k(m) = (r, ar + b + m)_{(p)} \\ m &= D_k(c) = (-ar - b + c)_{(p)} \end{aligned}$$

donde $(\cdot)_{(p)}$ implica que opera con aritmética modular.

- a) Considerar una variante del criptosistema donde $r$ en lugar de ser aleatorio toma el valor $r = (a+b)_{(p)}$ ¿es este criptosistema seguro contra ataque de texto cifrado elegido? Demostrar mediante un experimento $\mathrm{PrivK}^{\mathrm{CPA}}_{\mathcal{A},\Pi}$

### Respuesta modelo

**a)** Con $r = (a + b)_{(p)}$ el cifrado queda

$$c = E_k(m) = \big(a + b,\; a(a + b) + b + m\big)_{(p)} = \big(a + b,\; K + m\big)_{(p)}, \qquad K = (a^2 + ab + b)_{(p)},$$

donde la primera componente y la constante $K$ dependen solo de la clave. El cifrado es **determinístico**: para cada $m$ hay un único $c$. Un criptosistema determinístico no es CPA-seguro, y el experimento $\mathrm{PrivK}^{\mathrm{CPA}}_{\mathcal{A},\Pi}$ lo muestra. Sea $\Pi$ la variante y $\mathcal{A}$ el siguiente adversario (el bit del experimento se escribe $\beta$ para no confundirlo con la componente $b$ de la clave):

1. Se genera $k = (a, b)$. $\mathcal{A}$ elige un $m_0 \in \mathbb{Z}_p$ cualquiera y pide al oráculo $c^* = E_k(m_0) = (r, y^*)$.
2. $\mathcal{A}$ entrega el par $(m_0, m_1)$ con $m_1 \ne m_0$. Se sortea $\beta \leftarrow \{0,1\}$ y $\mathcal{A}$ recibe $c = E_k(m_\beta) = (r, y)$.
3. $\mathcal{A}$ emite $\beta' = 0$ si $c = c^*$, y $\beta' = 1$ si no.

Si $\beta = 0$, $c = E_k(m_0) = c^*$ porque el cifrado es determinístico, y $\beta' = 0$. Si $\beta = 1$, $y = K + m_1$ mientras que $y^* = K + m_0$; difieren porque $m_1 \ne m_0$ en $\mathbb{Z}_p$, así que $c \ne c^*$ y $\beta' = 1$. Entonces

$$\Pr\big[\mathrm{PrivK}^{\mathrm{CPA}}_{\mathcal{A},\Pi} = 1\big] = 1 > \tfrac12 + \varepsilon,$$

y la variante **no es segura**. De hecho, con esa única consulta $\mathcal{A}$ recupera $K = (y^* - m_0)_{(p)}$ y descifra cualquier criptograma $(r, y)$ como $m = (y - K)_{(p)}$: el sistema queda totalmente roto.

### Tips

- Lo primero que se escribe es el cifrado con $r$ sustituido, mostrando que todo lo que no es $m$ depende solo de la clave: eso es "determinístico", y de ahí sale todo.
- El experimento tiene que estar completo: la consulta al oráculo, el par $(m_0, m_1)$, la regla de decisión y la probabilidad. "Determinístico, entonces no es CPA-seguro" sin experimento no cumple la consigna.
- El enunciado dice "texto cifrado elegido" pero pide el experimento CPA: se responde con CPA. Un adversario de texto cifrado elegido tiene todo lo que tiene uno CPA y además un oráculo de descifrado, así que el mismo ataque gana también ese juego; el veredicto no cambia.
- No conviene afirmar que la versión con $r$ aleatorio es CPA-segura: no se pide, y no lo es. Con dos consultas al oráculo $(r_1, y_1)$ y $(r_2, y_2)$ para mensajes conocidos se despejan $a$ y $b$ del sistema lineal $y_j - m_j = a r_j + b \pmod p$ (con $p$ primo y $r_1 \ne r_2$).

## 1C-2018 · Ej. 3 — Cirugía sobre CBC

### Enunciado

En un esquema de encripción en bloques CBC de longitud n un mensaje $M_1M_2 \ldots M_n$ se cifra como un bloque de longitud n+1, $C_0C_1C_2 \ldots C_n$.

$$\begin{aligned} C_0 &= IV \\ C_k &= E_k(M_k \oplus C_{k-1}) \end{aligned}$$

- a) ¿ Cómo se ve afectada la desencripción si el primer bloque $C_0$ es eliminado del texto cifrado ?
- b) ¿ Cómo se ve afectada la desencripción si el último bloque $C_n$ es eliminado del texto cifrado ?
- c) Teniendo el texto cifrado ya generado como se especificó con anterioridad, ¿ Cómo puede un usuario legitimo agregar un texto de bloque $M_0$ específico al principio del mensaje plano original agregando bloques $C_k$ adicionales en cualquier ubicación del texto cifrado ?

### Respuesta modelo

El descifrado de `CBC` es, escribiendo el índice como $i$ para no confundirlo con la clave $k$,

$$M_i = D_k(C_i) \oplus C_{i-1}, \qquad i = 1, \ldots, n,$$

y cada bloque de texto plano depende exactamente de dos bloques recibidos: el propio y el anterior. Con eso se responden los tres incisos.

**a) Se elimina $C_0$.** El receptor recibe $C_1 C_2 \ldots C_n$. $M_1 = D_k(C_1) \oplus C_0$ necesita el $IV$, que ya no está: **$M_1$ no se puede recuperar**. Los demás no usan $C_0$: $M_2 = D_k(C_2) \oplus C_1, \ldots, M_n = D_k(C_n) \oplus C_{n-1}$ salen correctos. Se pierde exactamente un bloque, el primero. (Si el receptor descifra la secuencia recibida tomando $C_1$ como si fuera el $IV$, obtiene directamente $M_2 \ldots M_n$, sin $M_1$.)

**b) Se elimina $C_n$.** Ninguna de las ecuaciones de $M_1, \ldots, M_{n-1}$ usa $C_n$; todas salen correctas. Solo $M_n = D_k(C_n) \oplus C_{n-1}$ se pierde. Se pierde exactamente un bloque, el último.

**c) Agregar un bloque $M_0$ al principio.** No alcanza con insertar un bloque cifrado cualquiera, porque cada bloque se descifra contra el anterior: el primer bloque original pasaría a descifrarse como $D_k(C_0) \oplus (\text{bloque insertado})$. Lo que se hace es **anteponer un nuevo primer bloque $C'_0$**, que pasa a ser el $IV$ del criptograma extendido, elegido para que $C_0$ se descifre como $M_0$:

$$D_k(C_0) \oplus C'_0 = M_0 \quad\Longleftrightarrow\quad C'_0 = D_k(C_0) \oplus M_0.$$

El criptograma queda $C'_0 C_0 C_1 \ldots C_n$ y el receptor, sin cambiar nada, obtiene $D_k(C_0) \oplus C'_0 = M_0$, $D_k(C_1) \oplus C_0 = M_1$, ..., $D_k(C_n) \oplus C_{n-1} = M_n$: el mensaje $M_0 M_1 \ldots M_n$. Se agrega un solo bloque, al principio, y no hay que recifrar nada. El usuario legítimo puede hacerlo porque tiene $k$ y calcula $D_k(C_0)$; sin la clave no se puede.

### Tips

- Los tres incisos se responden con la misma fórmula: escribirla primero y marcar, en cada caso, qué ecuaciones usan el bloque que falta o que se agrega.
- Cuantificar: (a) y (b) pierden exactamente un bloque; quitar un $C_j$ del medio perdería dos ($M_j$ y $M_{j+1}$). Decir "se pierde todo lo que sigue" es incorrecto: la memoria de `CBC` es de un bloque.
- En (c), la clave del puntaje es que $C'_0$ se calcula con $D_k$: es una manipulación de quien tiene la clave, no un ataque de [[maleabilidad|maleabilidad]] (un atacante sin $k$ solo puede dar vuelta bits de $M_1$ tocando $C_0$, no elegir un bloque $M_0$).
- Se recicla en cualquier pregunta de propagación en `CBC`: es la misma regla de dos bloques que explica por qué un bit malo en $C_i$ afecta a $M_i$ y a $M_{i+1}$.

## Lo que se repite

- Siempre hay un esquema inventado y las mismas tres preguntas en el mismo orden: validez (despejar $M_i$ y escribir la fórmula del receptor), confidencialidad (experimento CPA completo, o herencia de un modo conocido) y errores de transmisión (seguir un bit de $C_i$ por la fórmula de descifrado).
- La posición de la primitiva decide: $E_k(M_i \oplus C_{i-1})$ es `CBC` y es seguro; $E_k(M_i) \oplus C_{i-1}$ deja $C_i \oplus C_{i-1} = E_k(M_i)$ y cae con $m_0 = M \Vert M$, $m_1 = M \Vert M'$.
- Un "aleatorio" que es función de la clave es determinístico, y lo determinístico cae con una consulta al oráculo y la comparación $c = c^*$.
- Regla de errores: por la primitiva, bloque entero; por xor, un bit. `CBC`: $M_i$ entero y un bit de $M_{i+1}$; `CTR` y `OFB`: un bit. `OFB` nunca propaga, por más que se lo agrupe con `CBC`.
- `CTR`, `OFB` y `CFB` usan $E_k$ hacia adelante en las dos direcciones: una primitiva sin inversa les alcanza; `ECB` y `CBC` necesitan $D_k$.
- `CBC` recuerda un bloque: quitar o insertar un bloque afecta a lo sumo a dos, y anteponer $M_0$ cuesta un $C'_0 = D_k(C_0) \oplus M_0$.
- Para llevar memorizado: las fórmulas de cifrado y descifrado de los cinco modos, el molde del experimento CPA con sus cinco piezas (quién es $\Pi$ y quién es $A$, mensajes y su porqué, qué recibe, regla de decisión, probabilidad) y la tabla de errores contra `CBC`, `CTR` y `OFB`.
