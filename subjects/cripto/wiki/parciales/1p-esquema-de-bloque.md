---
title: ¿Es válido este esquema de bloque?
resumen: 'Cómo resolver el ejercicio del esquema de cifrado en bloque inventado que aparece en todos los primeros parciales: decidir si es válido, si es CPA-seguro y cómo propaga errores frente a CBC, CTR y OFB.'
fuentes: ["[[parciales-viejos]]", "[[modos-de-encadenamiento]]", "[[pruebas-de-indistinguibilidad]]", "[[primitiva-de-cifrado-en-bloque]]", "[[cifrado-probabilistico-nonce-e-iv]]"]
aliases: [Esquema de bloque en el parcial, Validez de un esquema de bloque, Esquema inventado del parcial]
type: parcial
clase: 1p
orden: 12
created: 2026-09-14
updated: 2026-09-14
tags: [parcial, primer-parcial, esquema-de-bloque, modos, cpa, propagacion-de-errores, cbc]
sources: ["raw/parciales/Cripto - Primeros Parciales.pdf"]
---

# ¿Es válido este esquema de bloque?

Aparece en los cuatro parciales viejos, siempre en el medio del examen (Ej. 2, 3 o 4; nunca el primero, que es un protocolo, ni el último, que es Verdadero o Falso): seis ejercicios en cuatro parciales, dos en 1C-2023 y dos en 1C-2018. Nunca se pregunta qué es `CBC`: se inventa un esquema —un encadenamiento $C_i = \ldots$ o un criptosistema con parámetros— y hay que decidir si sirve.
La consigna se repite casi textual en 2C-2025 y 1C-2025: *"¿Es este un esquema de cifrado en bloque válido? Explicar y eventualmente corregirlo para que lo sea"* y *"Comparar la confidencialidad y la tolerancia a errores de transmisión de este sistema contra CBC, CTR y OFB"*. Las variantes piden explicar un `CTR` con una primitiva sin inversa (1C-2023 Ej. 2), demostrar con un experimento $\mathrm{PrivK}^{\mathrm{CPA}}$ que un criptosistema no es seguro (1C-2023 Ej. 4) o razonar qué pasa al quitar o anteponer bloques de un `CBC` (1C-2018 Ej. 3).

## Lo mínimo que hay que saber

### La primitiva y los cinco modos

- **Primitiva de cifrado en bloque**: $E_k : \{0,1\}^b \to \{0,1\}^b$, determinística y de tamaño fijo $b$ (`AES`: 128 bits; `DES`: 64). Para cada $k$ es una permutación pseudoaleatoria: biyectiva, con inversa $D_k$, e indistinguible de una función tomada al azar; cambiar un bit de la entrada cambia de forma impredecible cerca de la mitad de la salida (efecto avalancha). Por ser determinística, sola no es CPA-segura: bloques iguales dan criptogramas iguales.
- **Modo de encadenamiento**: la regla que extiende la primitiva a un mensaje de $n$ bloques $M_1 \ldots M_n$ y la vuelve probabilística con un valor público que viaja en claro junto al criptograma (en los enunciados, $C_0 = IV$): un IV (aleatorio) o un nonce (único).

| Modo | Cifrado | Descifrado | Qué necesita de la primitiva | IV o nonce |
|---|---|---|---|---|
| `ECB` | $C_i = E_k(M_i)$ | $M_i = D_k(C_i)$ | $E_k$ y $D_k$: permutación invertible | ninguno |
| `CBC` | $C_0 = IV$, $C_i = E_k(M_i \oplus C_{i-1})$ | $M_i = D_k(C_i) \oplus C_{i-1}$ | $E_k$ y $D_k$ | IV aleatorio |
| `CTR` | $C_i = M_i \oplus E_k(\text{nonce} \Vert i)$ | $M_i = C_i \oplus E_k(\text{nonce} \Vert i)$ | solo $E_k$, hacia adelante | nonce que no se repite con la misma $k$ |
| `OFB` | $O_0 = IV$, $O_i = E_k(O_{i-1})$, $C_i = M_i \oplus O_i$ | $M_i = C_i \oplus O_i$ | solo $E_k$ | IV aleatorio |
| `CFB` | $C_0 = IV$, $C_i = M_i \oplus E_k(C_{i-1})$ | $M_i = C_i \oplus E_k(C_{i-1})$ | solo $E_k$ | IV aleatorio |

`CTR`, `OFB` y `CFB` son cifrados de flujo fabricados con la primitiva: generan un keystream y lo xorean con el mensaje. Por eso nunca invocan $D_k$ y les alcanza con una función pseudoaleatoria hacia adelante; `ECB` y `CBC` sí necesitan la inversa. Todos son CPA-seguros bajo la misma hipótesis —la primitiva se comporta como una función pseudoaleatoria— y con su IV o nonce bien usado; `ECB` no lo es nunca.

### Validez = invertibilidad

- **Válido** significa que el receptor, con $k$ y el criptograma completo (incluido $C_0$), recupera cada $M_i$ sin ambigüedad. Se demuestra **despejando $M_i$** y escribiendo la fórmula del receptor. Dos movimientos alcanzan: si $C_i = E_k(X)$, entonces $X = D_k(C_i)$; si $C_i = X \oplus Y$ con $Y$ recomputable por el receptor, entonces $X = C_i \oplus Y$.
- Si la primitiva envuelve a $M_i$ hace falta $D_k$ (permutación invertible); si $M_i$ solo entra por un xor con un keystream, alcanza con $E_k$ hacia adelante, y un `CTR` con una primitiva sin inversa es válido.
- **No es válido** cuando $M_i$ no se despeja: entra por dos caminos que no se cancelan ($C_i = M_i \oplus E_k(M_i)$), lo envuelve una función sin inversa de la que no se sale con un xor, o el receptor no tiene un dato que necesita (un $IV$ que no viaja). Corrección típica: mover la primitiva para que envuelva a la suma ($E_k(M_i \oplus C_{i-1})$) o para que genere un keystream independiente de $M$ ($M_i \oplus E_k(\cdot)$).
- Válido no es seguro: `ECB` es válido y está prohibido.

### El juego CPA y el molde del adversario

$\mathrm{PrivK}^{\mathrm{CPA}}_{A,\Pi}$: se genera $k \leftarrow K$; $A$ obtiene un oráculo $E_k(\cdot)$ y elige $m_0, m_1$ del mismo largo; se sortea $b \leftarrow \{0,1\}$; $A$ recibe $c = E_k(m_b)$ y emite $b'$. El experimento vale $1$ si $b' = b$. $\Pi$ es CPA-seguro si para todo $A$ eficiente $\Pr[\mathrm{PrivK}^{\mathrm{CPA}}_{A,\Pi} = 1] \le \tfrac12 + \varepsilon(n)$ con $\varepsilon$ despreciable. Para demostrar que **no** lo es, se exhibe un $A$ concreto que acierta con probabilidad $1$ (o $\tfrac12$ más algo no despreciable). Lo que se corrige es el procedimiento completo: quién es $\Pi$ y quién es $A$, qué mensajes elige y por qué, qué recibe, la regla de decisión para $b'$ y la cuenta de la probabilidad.

**Las tres señales que delatan un esquema**, con el adversario que corresponde a cada una:

| Señal | Cómo se ve | Qué elige $A$ | Qué compara | Acierta con |
|---|---|---|---|---|
| **Determinismo**: el criptograma depende solo de $(k, m)$ | no hay IV, o el valor "aleatorio" es función de la clave | pide al oráculo $c^* = E_k(m_0)$ y entrega $(m_0, m_1)$ con $m_0 \ne m_1$ | $b' = 0$ si $c = c^*$, si no $b' = 1$ | probabilidad $1$ |
| **Cancelación entre bloques contiguos**: una operación sobre $C_i$ y $C_{i-1}$ deja una función determinística de $M_i$ | la primitiva está adentro del xor con el bloque anterior, p. ej. $C_i \oplus C_{i-1} = E_k(M_i)$ | $m_0 = M \Vert M$, $m_1 = M \Vert M'$ con $M \ne M'$; no usa el oráculo | $b' = 0$ si $C_1 \oplus C_0 = C_2 \oplus C_1$, si no $b' = 1$ | probabilidad $1$ |
| **IV reutilizado**: se repite el par $(k, IV)$ o $(k, \text{nonce})$, o el keystream | IV fijo, nonce repetido | pide $c^* = E_k(m_0)$ y entrega $(m_0, m_1)$: para ese IV el cifrado vuelve a ser determinístico | $b' = 0$ si $c = c^*$; en un modo de flujo, además $c \oplus c^* = m_b \oplus m_0$ es $0$ solo si $b = 0$ | probabilidad $1$ |

Si no aparece ninguna señal y el esquema es un modo conocido con otro nombre, el veredicto es "CPA-seguro bajo la hipótesis de que $E_k$ es una función pseudoaleatoria y el IV es aleatorio (o $(k, \text{nonce})$ no se repite)", el mismo nivel que `CBC`, `CTR` y `OFB`. Ninguno de los modos da integridad: confidencialidad y nada más.

### IV aleatorio y nonce único

- `CBC`, `CFB` y `OFB` exigen un IV **aleatorio**: sorteado por mensaje, impredecible. `CTR` exige solo que el par $(k, \text{nonce})$ **no se repita**, y por eso el nonce puede ser un contador. En los dos casos el valor viaja en claro junto al criptograma (en `CBC`, `OFB` y `CFB` es $C_0$): no es secreto, es lo que hace distinto cada cifrado.
- Si el par se repite, el cifrado vuelve a ser determinístico para ese IV y cae por la primera señal; en un modo de flujo, además, $C \oplus C' = M \oplus M'$.

### Propagación de errores en el canal

La pregunta del parcial es por un bit corrompido de $C_i$ **en la transmisión**. No hay nada que memorizar: se escribe la fórmula de **descifrado**, se busca en qué ecuaciones aparece $C_i$ y por dónde entra. Si entra por la primitiva ($D_k$ o $E_k$), el bloque sale destruido entero (avalancha: cerca de la mitad de los bits); si entra por un xor directo, se da vuelta exactamente ese bit.

| Modo | Dónde aparece $C_i$ al descifrar | Efecto de un bit malo en $C_i$ |
|---|---|---|
| `ECB` | $M_i = D_k(C_i)$ | $M_i$ destruido; 1 bloque |
| `CBC` | $M_i = D_k(C_i) \oplus C_{i-1}$ y $M_{i+1} = D_k(C_{i+1}) \oplus C_i$ | $M_i$ destruido entero y **un bit** de $M_{i+1}$; 2 bloques, después se autosincroniza |
| `CTR` | $M_i = C_i \oplus E_k(\text{nonce} \Vert i)$ | solo ese bit de $M_i$ |
| `OFB` | $M_i = C_i \oplus O_i$, y $O_i$ no depende de $C$ | solo ese bit de $M_i$ |
| `CFB` | $M_i = C_i \oplus E_k(C_{i-1})$ y $M_{i+1} = C_{i+1} \oplus E_k(C_i)$ | ese bit de $M_i$ y $M_{i+1}$ destruido entero; 2 bloques (con segmentos de $s$ bits y bloque de $b$: $1 + b/s$ segmentos) |

`OFB` y `CTR` no propagan nada porque el keystream no mira al criptograma. La contracara: no propagar es maleabilidad en su forma más pura —dar vuelta un bit de $C_i$ da vuelta ese bit de $M_i$—, y en `CBC` un bit de $C_i$ elige un bit de $M_{i+1}$ al precio de destruir $M_i$. Un error en el **texto claro antes de cifrar** es otra pregunta: en `CBC` se propaga a todos los bloques cifrados que siguen; en `CTR` y `OFB`, a un bit.

> [!warn] OFB no propaga errores
> El apunte de un estudiante lo agrupa con `CBC` en dos parciales distintos, y es incorrecto. `OFB` realimenta la salida de la primitiva, no el criptograma: $O_i = E_k(O_{i-1})$ nunca toca $C$, y un bit malo en $C_i$ es un bit malo en $M_i$ y nada más, igual que en `CTR`.

### Cirugía sobre un CBC

En `CBC` cada bloque descifrado mira exactamente dos bloques recibidos, $M_i = D_k(C_i) \oplus C_{i-1}$: la memoria del modo es de un bloque, y con eso se responde cualquier corte o inserción bloque por bloque.

- **Quitar $C_0$**: $M_1 = D_k(C_1) \oplus C_0$ no se puede calcular; $M_2 \ldots M_n$ salen bien. Se pierde solo $M_1$.
- **Quitar $C_n$**: ninguna ecuación de $M_1 \ldots M_{n-1}$ usa $C_n$; se pierde solo $M_n$.
- **Quitar un $C_j$ del medio**: se pierden $M_j$ y $M_{j+1}$, los dos que lo usan; desde $M_{j+2}$ todo es correcto.
- **Anteponer un bloque $M_0$**: hace falta un nuevo primer bloque $C'_0$ con $D_k(C_0) \oplus C'_0 = M_0$, o sea $C'_0 = D_k(C_0) \oplus M_0$; se transmite $C'_0 C_0 C_1 \ldots C_n$ y el resto del descifrado no cambia. Solo puede hacerlo quien tiene $k$, porque necesita $D_k(C_0)$: es una manipulación legítima, no un ataque de [[maleabilidad|maleabilidad]].

## Receta

1. **Reescribe el esquema** con sus ecuaciones de cifrado, $C_0 = IV$ e $i = 1, \ldots, n$, y clasifícalo: la primitiva envuelve al xor con el bloque anterior ($E_k(M_i \oplus \ldots)$, familia `CBC`) o el xor envuelve a la primitiva ($M_i \oplus E_k(\ldots)$, familia de flujo: `CTR`, `OFB`, `CFB`).
2. **Validez**: despeja $M_i$ y escribe la fórmula del receptor. Di qué necesita de la primitiva ($D_k$, o solo $E_k$) y qué datos ($IV$ o nonce, que viajan en claro). Si $M_i$ no se despeja, di por qué y propón la corrección mínima. Si el esquema es un modo conocido con otro nombre, dilo: hereda sus propiedades.
3. **Seguridad**: busca las tres señales. Si hay una, escribe el experimento completo: $\Pi$, $A$, los $m_0, m_1$ y por qué, qué recibe, la regla de decisión y $\Pr[\mathrm{PrivK}^{\mathrm{CPA}}_{A,\Pi} = 1] = 1$; concluye que no es CPA-seguro. Si no hay ninguna, escribe que es CPA-seguro bajo la hipótesis de primitiva pseudoaleatoria e IV aleatorio (o nonce no repetido), como `CBC`, `CTR` y `OFB`.
4. **Errores**: escribe la fórmula de descifrado, marca cada ecuación donde aparece $C_i$ y por dónde entra (primitiva: bloque entero; xor: un bit). Cuenta bloques y compáralos en una tabla con `CBC` (bloque entero y un bit del siguiente), `CTR` (un bit) y `OFB` (un bit).
5. **Cierra** con el veredicto en una línea: válido o no y por qué; CPA-seguro o no y a qué modo equivale; cuántos bloques pierde un bit malo contra `CBC`, `CTR` y `OFB`.

## Plantilla de respuesta

**a) Validez.** El esquema es $C_0 = IV$, $C_i =$ \<fórmula\>. Despejando: \<paso con $D_k$ o con $\oplus$\>, luego $M_i =$ \<fórmula del receptor\>. El receptor conoce $k$ y recibe $C_0, \ldots, C_n$, así que recupera todos los $M_i$: **es válido**. Necesita \<$D_k$, permutación invertible / solo $E_k$ hacia adelante\>. \<Es exactamente el modo X / No coincide con ningún modo estándar\>. \<Si no fuera válido: $M_i$ no se despeja porque …; se corrige con $C_i = \ldots$\>

**b) Confidencialidad.** \<Señal detectada, o ninguna\>. Sea $\Pi$ el esquema y $A$ el siguiente adversario: (1) $A$ \<pide al oráculo … / no necesita el oráculo\> y elige $m_0 =$ \<…\>, $m_1 =$ \<…\>, porque \<…\>; (2) recibe $c = E_k(m_b) =$ \<$C_0 C_1 C_2$\>; (3) calcula \<…\> y emite $b' = 0$ si \<condición\>, $b' = 1$ si no. Si $b = 0$, \<la condición se cumple\>; si $b = 1$, \<no se cumple\>. Luego $\Pr[\mathrm{PrivK}^{\mathrm{CPA}}_{A,\Pi} = 1] = 1 > \tfrac12 + \varepsilon$: **no es CPA-seguro**, a diferencia de `CBC`, `CTR` y `OFB`, que lo son con IV aleatorio o nonce no repetido. \<O bien: no hay señal; es CPA-seguro bajo las mismas hipótesis que el modo X\>.

**c) Errores de transmisión.** Descifrado: $M_i =$ \<…\>. Un bit malo en $C_i$ entra \<por la primitiva / por xor\> en $M_i$ y \<por … / no aparece\> en $M_{i+1}$: se pierden \<N\> bloques y desde $M_{i+2}$ se recupera. Contra `CBC`: $M_i$ entero y un bit de $M_{i+1}$; `CTR` y `OFB`: solo ese bit. \<Veredicto comparativo en una línea\>.

## Trampas

- Confundir $C_i = E_k(M_i \oplus C_{i-1})$ (es `CBC`, CPA-seguro) con $C_i = E_k(M_i) \oplus C_{i-1}$ (no es `CBC`: $C_i \oplus C_{i-1} = E_k(M_i)$ es una huella de bloque, como en `ECB`). La posición de la primitiva decide la seguridad, y el IV no lo arregla porque se cancela al xorear contiguos.
- Escribir que `OFB` propaga errores como `CBC`. No: un bit malo en $C_i$ es un bit malo en $M_i$ y nada más, igual que en `CTR`.
- Decir que `CTR` (u `OFB`, `CFB`) no es válido porque la primitiva no tiene inversa. Se usa $E_k$ hacia adelante en las dos direcciones; solo `ECB` y `CBC` necesitan $D_k$.
- Invertir en el orden equivocado: para `CBC` es $M_i = D_k(C_i) \oplus C_{i-1}$, no $D_k(C_i \oplus C_{i-1})$. Se deshace primero la última operación que hizo el emisor.
- Dar la idea del ataque ("xorea y compara") sin el experimento: se corrige el procedimiento formal —pasos, mensajes con su porqué, regla de decisión, probabilidad—.
- Confundir válido con seguro: validez es invertibilidad; un esquema puede ser válido e inseguro (`ECB`, 1C-2025 Ej. 2).
- Llamar "aleatorio" a un valor que es función de la clave ($r = a + b$): el cifrado es determinístico y cae con una consulta al oráculo.
- Confundir IV aleatorio con nonce: `CBC` necesita azar (impredecible), `CTR` necesita unicidad. Repetir el par $(k, IV)$ vuelve determinístico al cifrado.
- Mezclar las dos preguntas de errores: error en el texto claro antes de cifrar (en `CBC` se propaga a todo lo que sigue) y error en el canal (2 bloques). El parcial pregunta por el canal.
- Al quitar bloques de un `CBC`, decir que se pierde todo lo que sigue: se pierden a lo sumo dos bloques; quitar $C_0$ pierde solo $M_1$ y quitar $C_n$ solo $M_n$.

## Para profundizar

- [[1p-esquemas-de-bloque-en-parciales-viejos|Esquemas de bloque en los parciales viejos]] — los ejercicios de este tipo que ya se tomaron, con enunciado completo, respuesta modelo y tips.
- [[primer-parcial|Primer parcial]] — el hub de la sección, con la tabla de los siete tipos y el orden sugerido.
- [[modos-de-encadenamiento|Modos de encadenamiento]] — los cinco modos con sus diagramas, la tabla comparativa y la propagación de errores desarrollada modo por modo, incluido el reordenamiento de bloques.
- [[pruebas-de-indistinguibilidad|Pruebas de indistinguibilidad]] — los juegos Eav, Mul y CPA, la demostración de que determinístico implica no CPA-seguro y el aviso de la clase sobre cómo se corrige el experimento.
- [[primitiva-de-cifrado-en-bloque|Primitiva de cifrado en bloque]] — qué es una permutación pseudoaleatoria, el efecto avalancha y qué modos necesitan la inversa.
- [[cifrado-probabilistico-nonce-e-iv|Cifrado probabilístico, nonce e IV]] — por qué el cifrado tiene que ser probabilístico y la diferencia entre IV aleatorio y nonce único.
- [[generador-pseudoaleatorio|Generador pseudoaleatorio]] — la definición de indistinguible del azar que la primitiva hereda y que los modos de flujo usan como keystream.
- [[maleabilidad|Maleabilidad]] — la contracara de no propagar errores: por qué ninguno de los modos da integridad.
- [[clase-02-cifrado|Clase 02 — Cifrado]] — la clase de la que salen la primitiva, los modos y las pruebas de indistinguibilidad.
- [[practica-03-seudoaleatoriedad-y-modos|Práctica 03 — Seudoaleatoriedad y modos]] — las láminas de `CFB` de la cátedra y la definición de CPA con oráculo antes y después del desafío.
- [[parciales-viejos|Parciales viejos]] — el análisis por parcial y la verificación de cada resolución.
