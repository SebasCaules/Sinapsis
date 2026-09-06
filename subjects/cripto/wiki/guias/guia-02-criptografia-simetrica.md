---
title: Guía 2 — Criptografía Simétrica
resumen: 'Los ocho enunciados de la Guía 2 transcriptos, con el concepto que destraba cada uno: secreto perfecto en los cuatro primeros y, desde el sexto, modos de encadenamiento, una primitiva de juguete y DES.'
fuentes: ["[[clase-02-cifrado]]", "[[clase-01-introduccion-y-criptografia-clasica]]", "[[guia-02-resolucion]]"]
aliases: [Guía 2, Guia 2]
type: guia
clase: 2
orden: 21
guia: 2
fecha: 2026-08-24
created: 2026-08-24
updated: 2026-09-04
tags: [guia, criptografia-simetrica, secreto-perfecto, indistinguibilidad, modos-de-encadenamiento, cbc, cfb, des]
sources: ["raw/guias/guia2/Guia 2 - Criptografía Simétrica.pdf", "raw/practicas/Modo CFB.pdf"]
---

# Guía 2 — Criptografía Simétrica

> **24/08/2026**, continúa el **31/08** · [Enunciado](../../raw/guias/guia2/Guia%202%20-%20Criptograf%C3%ADa%20Sim%C3%A9trica.pdf) · Teoría: [[clase-02-cifrado|Clase 02 — Cifrado simétrico]]
> **Resolución:** [[guia-02-resolucion|Guía 2 — Resolución]] — los **8 ejercicios resueltos**.

Esta nota reúne **los enunciados de la Guía 2 transcriptos**, con el concepto que destraba cada uno y el link directo a dónde está la cuenta hecha. Lo que se pide, no cómo se resuelve: el desarrollo vive en la [[guia-02-resolucion|resolución]].

---

## Ojo con el título: la guía no empieza donde dice que empieza

La guía se llama *Criptografía Simétrica*, que es el tema de la [[clase-02-cifrado|Clase 02]]. Pero **los cuatro primeros ejercicios son de secreto perfecto**, que es donde termina la [[clase-01-introduccion-y-criptografia-clasica|Clase 01]]. O sea: la guía arranca **cerrando el bloque de la clase anterior**. El Ej. 5, además, es una repetición textual de la Guía 1. Recién en el **Ej. 6** entra de lleno en el temario que le da nombre.

| Ejercicios | De dónde sale el tema | Qué se pregunta |
|---|---|---|
| 1 a 3 | **Clase 01** — [[secreto-perfecto\|secreto perfecto]] | verificar/refutar secreto perfecto sobre criptosistemas chicos y sobre los tres cifrados clásicos |
| 4 | **bisagra** entre las dos clases | responde una pregunta de secreto perfecto (Clase 01) **con la herramienta de la Clase 02**: el experimento `Eav` |
| 5 | Clase 01 — [[modelos-de-ataque\|modelos de ataque]] | `CPA` sobre los cifrados clásicos. Es **el mismo enunciado que el [[guia-01-criptografia-clasica#Ejercicio 8\|Ej. 8 de la Guía 1]]** |
| 6 a 8 | **Clase 02** | modos de encadenamiento, una primitiva de bloque de juguete, y DES |

> **Que el Ej. 4 sea la bisagra es lectura nuestra**, no algo que la guía diga. Lo que sí es literal es que el enunciado nombra el experimento $\mathsf{PrivK}^{\mathsf{eav}}_{A,\Pi}$ —formalismo de la Clase 02, ver [[pruebas-de-indistinguibilidad|pruebas de indistinguibilidad]]— y termina preguntando *"¿tiene secreto perfecto?"*, que es vocabulario de la Clase 01.

Y hay un ejercicio que **la teoría no cubre**: el **Ej. 6**, propagación de errores en `CBC` y `CFB`. Las filminas de la Clase 02 presentan los cinco modos con sus diagramas pero **no dicen nada sobre qué pasa cuando se corrompe un bit** — está anotado como hueco en la propia nota de [[modos-de-encadenamiento#Lo que esta clase no cubre|modos de encadenamiento]]. Ese ejercicio hay que sacarlo leyendo los diagramas, no repitiendo una filmina.

---

## Tablero de estado

Los **ocho** ejercicios están resueltos en la [[guia-02-resolucion|nota de resolución]]; la columna *Estado* linkea a cada uno.

| # | Tema | Concepto que aplica | Estado |
|---|---|---|---|
| 1 | Distribución de $\mathcal{C}$ y refutación del secreto perfecto | [[secreto-perfecto\|Secreto perfecto]] · [[modelo-probabilistico-de-un-criptosistema\|Modelo probabilístico]] | [[guia-02-resolucion#Ejercicio 1\|resuelto]] |
| 2 | ¿Secreto perfecto ⟹ todas las a posteriori iguales entre sí? | [[secreto-perfecto\|Secreto perfecto]] · [[modelo-probabilistico-de-un-criptosistema\|Modelo probabilístico]] | [[guia-02-resolucion#Ejercicio 2\|resuelto]] |
| 3 | Secreto perfecto en rotación, sustitución y Vigenère | [[secreto-perfecto\|Secreto perfecto]] · [[cifrado-por-rotacion\|Rotación]] · [[cifrado-de-sustitucion-monoalfabetica\|Sustitución monoalfabética]] · [[cifrado-de-vigenere\|Vigenère]] | [[guia-02-resolucion#Ejercicio 3\|resuelto]] |
| 4 | Vigenère de período aleatorio contra el experimento `Eav` | [[pruebas-de-indistinguibilidad\|Pruebas de indistinguibilidad]] · [[cifrado-de-vigenere\|Vigenère]] | [[guia-02-resolucion#Ejercicio 4\|resuelto]] |
| 5 | `CPA` sobre sustitución monoalfabética y Vigenère | [[modelos-de-ataque\|Modelos de ataque]] · [[pruebas-de-indistinguibilidad\|Pruebas de indistinguibilidad]] | [[guia-02-resolucion#Ejercicio 5\|resuelto]] |
| 6 | Propagación de errores en `CBC` y `CFB` | [[modos-de-encadenamiento\|Modos de encadenamiento]] | [[guia-02-resolucion#Ejercicio 6\|resuelto]] |
| 7 | Primitiva $(M \cdot K) \bmod 32$ cifrando en modo `CBC` | [[primitiva-de-cifrado-en-bloque\|Primitiva de cifrado en bloque]] · [[modos-de-encadenamiento\|Modos de encadenamiento]] · [[inverso-modular\|Inverso modular]] · [[algoritmo-de-euclides-extendido\|Euclides extendido]] · [[aritmetica-modular-y-divisibilidad\|Aritmética modular]] | [[guia-02-resolucion#Ejercicio 7\|resuelto]] |
| 8 | Claves débiles de DES | [[des-y-3des\|DES y 3-DES]] | [[guia-02-resolucion#Ejercicio 8\|resuelto]] |

---

## Enunciados

### Ejercicio 1

Sea un criptosistema con las siguientes características.

**Espacio de mensajes:**

$$\mathcal{M} = \{a, b\}, \qquad \Pr[M = a] = 0{,}25 \quad ; \quad \Pr[M = b] = 0{,}75$$

**Espacio de claves:** $\mathcal{K} = \{k_1, k_2, k_3\}$, donde `Gen` genera una clave según las siguientes probabilidades:

$$\Pr[K = k_1] = 0{,}5 \quad ; \quad \Pr[K = k_2] = \Pr[K = k_3] = 0{,}25$$

El algoritmo `Enc` está definido por la tabla:

| `Enc` | $a$ | $b$ |
|---|---|---|
| $k_1$ | 1 | 2 |
| $k_2$ | 2 | 3 |
| $k_3$ | 3 | 4 |

Por lo que el espacio de cifrados

$$\mathcal{C} = \{\,\mathsf{Enc}_k(x) \;/\; x \in \mathcal{M} \ \wedge\ k \in \mathcal{K}\,\}$$

resulta ser $\{1, 2, 3, 4\}$.

Se pide:

**a)** Hallar la **distribución de probabilidades de $\mathcal{C}$** (espacio de cifrados).
**b)** Demostrar **de las cuatro maneras vistas en la teoría** que el sistema **no tiene secreto perfecto**.

> **Este criptosistema ya está resuelto entero en el vault.** Es —mismo $\mathcal{M}$, mismo $\mathcal{K}$, misma tabla de `Enc`, mismas distribuciones— el **Ejemplo 2** del apunte [[probabilidad-y-criptografia|Probabilidad y criptografía]], donde están calculadas la distribución de $\mathcal{C}$, la tabla de $\Pr[C{=}y \mid M{=}x]$ y la de a posteriori, más el análisis de **por qué** falla (soportes distintos + pesos distintos) y la moraleja de que $\lvert\mathcal{K}\rvert \ge \lvert\mathcal{M}\rvert$ se cumple igual. Vale la pena leerlo antes de resolver el ejercicio.
>
> **El enunciado no enumera cuáles son "las cuatro maneras".** Habrá que cruzarlo con lo dicho en clase. Los candidatos que la wiki tiene escritos son: la [[secreto-perfecto#Definición|definición]] ($\Pr[M{=}m \mid C{=}c] = \Pr[M{=}m]$), la [[secreto-perfecto#Caracterización equivalente|caracterización equivalente]] ($\Pr[\mathsf{Enc}_K(m) = c] = \Pr[\mathsf{Enc}_K(m') = c]$), el criterio del cifrado ($\Pr[C{=}y \mid M{=}x] = \Pr[C{=}y]$) y la formulación por adversario del experimento `Eav`. *(Lectura nuestra: la guía no las lista.)*

### Ejercicio 2

Probar o encontrar un **contraejemplo** de la siguiente afirmación:

> En un criptosistema que posee la propiedad de **secreto perfecto** se cumple que para toda distribución sobre el espacio de mensajes $\mathcal{M}$, para todo $m, m' \in \mathcal{M}$ y para todo $c \in \mathcal{C}$,
> $$\Pr[M = m \mid C = c] = \Pr[M = m' \mid C = c]$$

### Ejercicio 3

Para los siguientes ejercicios, considerar el **alfabeto inglés (26 símbolos)**.

**a)** Demostrar que **si se encripta un solo símbolo**, entonces el [[cifrado-por-rotacion|cifrado de rotación]] tiene **secreto perfecto**.

**b)** ¿Cuál es el **mayor tamaño** que puede tener el espacio de textos planos $\mathcal{M}$ como para que el [[cifrado-de-sustitucion-monoalfabetica|cifrado de sustitución monoalfabética]] posea **secreto perfecto**?

**c)** Mostrar **cómo usar el [[cifrado-de-vigenere|cifrado de Vigenère]]** para encriptar una palabra de longitud $t$ y tener **secreto perfecto**.

> El punto (a) es exactamente el caso $\ell = 1$ que la nota de [[secreto-perfecto|secreto perfecto]] demuestra, sólo que ahí sobre el alfabeto de 27 y acá sobre el de 26. El (c) es el mismo argumento estirado a $t$ símbolos: se puede leer como *"¿cuándo el Vigenère es un [[one-time-pad|one-time pad]]?"*. *(Lectura nuestra; la guía no lo dice con esas palabras.)*

### Ejercicio 4

Dado un criptosistema $\Pi = (\mathsf{Gen}, \mathsf{Enc}, \mathsf{Dec})$ de **Vigenère**, sobre un espacio de mensajes $\mathcal{M} = \Sigma^{3}$, donde $\Sigma$ es el **alfabeto inglés**. El algoritmo `Gen` elige primero el **período $t$** de la clave en forma **aleatoria y uniforme**, dentro del rango $t \in \{1, 2, 3\}$. Luego, elige la clave $k$ dentro de $\Sigma^{*}$, tal que $\lvert k \rvert = t$.

**a)** Mostrar un **ejemplo** de cómo el criptosistema cifra un mensaje.

**b)** Calcular la **probabilidad de éxito** del experimento $\mathsf{PrivK}^{\mathsf{eav}}_{A,\Pi}$ para un adversario que hace lo siguiente:

- $A$ emite primero los mensajes $m_0 = \texttt{aab}$, $m_1 = \texttt{abb}$.
- Al recibir el cifrado $c$, $A$ emite $0$ si el **primer símbolo de $c$ es igual al segundo**, y emite $1$ en caso contrario.

**c)** De acuerdo a lo calculado en el punto (b), ¿**tiene secreto perfecto**?

> **Dos reconstrucciones de la transcripción**, porque el texto extraído del PDF perdió superíndices y símbolos:
>
> - $\mathcal{M} = \Sigma^{3}$ — el exponente $3$ había quedado suelto en el renglón siguiente. Que sea $3$ y no otro número lo confirma el propio enunciado: $m_0$ y $m_1$ tienen **tres letras**.
> - $t \in \{1,2,3\}$ y $\lvert k\rvert = t$ — el $\in$ y las barras de longitud se perdieron en la extracción.
>
> Si te queda alguna duda, la fuente literal es el [PDF](../../raw/guias/guia2/Guia%202%20-%20Criptograf%C3%ADa%20Sim%C3%A9trica.pdf).
>
> **Sobre la notación:** $\mathsf{PrivK}^{\mathsf{eav}}_{A,\Pi}$ es como escribe el experimento Katz & Lindell (ver [[bibliografia|bibliografía]]); las filminas de la Clase 02 lo llaman $\mathsf{Eav}_{A,\Pi}$. Es **la misma prueba**, escrita paso a paso en [[pruebas-de-indistinguibilidad#Las tres pruebas|pruebas de indistinguibilidad]].

### Ejercicio 5

Demostrar que los siguientes cifrados son **vulnerables a un ataque de texto plano elegido** (*chosen-plaintext attack*):

- cifrado de **sustitución monoalfabética**
- cifrado de **Vigenère**

> Es **literalmente el [[guia-01-criptografia-clasica#Ejercicio 8|Ej. 8 de la Guía 1]]**, con "muy fáciles de quebrar" cambiado por "vulnerables". Si ya lo hiciste, es el mismo argumento. La diferencia es el momento: acá ya está disponible el formalismo de [[pruebas-de-indistinguibilidad#Las tres pruebas|CPA]] como **prueba de indistinguibilidad**, y no sólo como el [[modelos-de-ataque|modelo de ataque]] informal de la Clase 01. *(Que ese sea el motivo de la repetición es lectura nuestra.)*

### Ejercicio 6

> Con el modo `ECB`, si hay un error en un bloque del texto cifrado transmitido, solamente afecta al bloque de texto claro correspondiente.

**a)** En el modo `CBC` (**ver figura**) un error de un bit en $P_1$, ¿a través de cuántos bloques de **texto cifrado** se propaga?

**b)** En el modo `CBC`, un error de un bit en $C_1$, ¿a través de cuántos bloques de **texto descifrado** se propaga?

**c)** Si se produce un error de un bit en la transmisión de un carácter del texto cifrado en modo **`CFB` de ocho bits**, ¿hasta dónde se propaga el error?

> **Las figuras están en el PDF y no en esta nota.** El enunciado dice *"ver figura"*: la página 2 del [PDF de la guía](../../raw/guias/guia2/Guia%202%20-%20Criptograf%C3%ADa%20Sim%C3%A9trica.pdf) trae los esquemas de cifrado y descifrado de `CBC` y de `CFB`, que la extracción de texto no captura. Para resolverlo alcanza con los diagramas equivalentes que ya están en el vault: [[modos-de-encadenamiento#Los cinco modos|CBC y CFB en modos de encadenamiento]].
>
> **Este ejercicio no tiene filmina detrás.** La Clase 02 presenta los cinco modos con sus diagramas y su tabla comparativa, pero **no toca la propagación de errores** — está registrado como hueco en [[modos-de-encadenamiento#Lo que esta clase no cubre|lo que esta clase no cubre]]. Hay que deducirlo de los diagramas: seguir el bit corrompido por las flechas y ver a qué bloques llega.
>
> **Lo que sí hay, del mismo día.** La cátedra repartió cuatro láminas aparte de `CFB` — [`Modo CFB.pdf`](../../raw/practicas/Modo%20CFB.pdf) — con los diagramas de cifrado y descifrado. Las **tres primeras** están rotuladas *"Ejemplo: n = 32; s = 8"*; la cuarta, que es la del ejercicio abierto, no repite los parámetros y hay que arrastrarlos de las anteriores. Son **diagramas, no la respuesta**: no analizan el error de bit que pide el (c). Sirven para otras dos cosas. Primero, fijan los parámetros con los que ella misma trabaja — con $n = 32$ y $s = 8$ el error alcanza $1 + 32/8 = 5$ caracteres, no los 9 de `DES`. Segundo, plantean **otro** modo de falla que el ejercicio no pregunta: bloques que llegan **fuera de orden**, y un "analizar" abierto con $c_1$ corrupto.
>
> Notar además que (a) y (b) preguntan cosas **distintas**: (a) es un error en el **texto plano antes de cifrar** y se propaga hacia adelante en el **cifrado**; (b) es un error en el **canal** y se propaga en el **descifrado**. No son la misma cuenta.

### Ejercicio 7

Considerando el siguiente cifrado de bloque:

$$E(K, M) = (M \cdot K) \bmod 32$$

**a)** ¿Cuál es el **tamaño del bloque**? ¿Cuál es el **espacio efectivo de la clave**?

**b)** **Encriptar** el mensaje $24\ \ 17\ \ 26\ \ 25\ \ 12$ usando modo **`CBC`** con vector de inicialización $\mathrm{IV} = 19$ y $K = 7$.

**c)** **Desencriptar** en modo `CBC`.

> El adjetivo *efectivo* en (a) es el guiño del ejercicio: la clave se elige entre $32$ valores, pero **no todos sirven** — una $E(K, \cdot)$ que no sea invertible rompe la condición de corrección de un [[criptosistema]] y con eso no hay `Dec` posible. Cuáles quedan es justamente lo que hay que contestar. *(Lectura nuestra de por qué el enunciado dice "efectivo"; la guía no lo aclara.)*
>
> Ojo también con el (c): en `CBC` el descifrado usa $E^{-1}$, así que para hacerlo hay que **invertir la multiplicación módulo 32**, no dividir. Ver [[primitiva-de-cifrado-en-bloque|primitiva de cifrado en bloque]] y el diagrama de [[modos-de-encadenamiento#Los cinco modos|CBC]]. La herramienta para invertir es el [[algoritmo-de-euclides-extendido#6. Ejemplo 1: el mcd de 7 y 32|algoritmo de Euclides extendido]] — ahí está corrido paso a paso justo este $\operatorname{mcd}(7,32)$ — y el criterio de cuándo existe el inverso está en [[inverso-modular#Quiénes son los inversibles|inverso modular]], que es también lo que contesta el (a).

### Ejercicio 8

Una **clave débil** para **DES** es una clave $K$ tal que

$$E_k\big(E_k(x)\big) = x, \qquad \forall x$$

Analizar **por qué** una clave formada por **todos sus bits en 0**, o **todos sus bits en 1**, es una clave débil de DES. ¿Cuáles serían **otras dos** claves débiles?

> La pista está en la estructura: DES genera **16 subclaves** a partir de $K$, y en una [[des-y-3des#Estructura: red de Feistel|red de Feistel]] descifrar es **el mismo circuito con las subclaves en orden inverso**. Si las 16 subclaves salen todas iguales, cifrar dos veces es cifrar y descifrar. El detalle de la [[des-y-3des#Generación de subclaves|generación de subclaves]] está en la nota de DES. *(La conexión con Feistel es lectura nuestra; el enunciado sólo da la definición.)*

---

## Ver también

- [[guia-02-resolucion|Guía 2 — Resolución]] — los ocho ejercicios desarrollados
- [[clase-02-cifrado|Clase 02 — Cifrado simétrico]] — la teoría del 13/08 y 20/08, que es la que esta guía practica
- [[clase-01-introduccion-y-criptografia-clasica|Clase 01 — Introducción y criptografía clásica]] — de donde salen los Ej. 1 a 4
- [[probabilidad-y-criptografia|Probabilidad y criptografía]] — su **Ejemplo 2 es el Ej. 1 de esta guía**, resuelto de punta a punta
- [[guia-01-criptografia-clasica|Guía 1 — Criptografía Clásica]] — su Ej. 8 es el Ej. 5 de acá
- [[secreto-perfecto|Secreto perfecto]] · [[pruebas-de-indistinguibilidad|Pruebas de indistinguibilidad]] · [[modos-de-encadenamiento|Modos de encadenamiento]] · [[des-y-3des|DES y 3-DES]]
- [[cronograma|Cronograma]] — la guía se da el 24/08 y continúa el 31/08
