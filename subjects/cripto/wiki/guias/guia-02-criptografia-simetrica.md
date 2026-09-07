---
title: Guía 2 — Criptografía Simétrica
resumen: 'Los ocho ejercicios de la Guía 2 con enunciado y resolución en la misma página: cada resolución va plegada debajo de su enunciado, con el razonamiento completo y no sólo el resultado — secreto perfecto, el juego Eav, modos de encadenamiento y las claves débiles de DES.'
fuentes: ["[[clase-02-cifrado]]", "[[clase-01-introduccion-y-criptografia-clasica]]"]
aliases: [Guía 2, Guia 2, Resolución Guía 2, Guia 2 resolucion, Soluciones Guía 2]
type: guia
clase: 2
orden: 21
guia: 2
fecha: 2026-08-24
created: 2026-08-24
updated: 2026-09-06
tags: [guia, resolucion, criptografia-simetrica, secreto-perfecto, indistinguibilidad, modos-de-encadenamiento, cbc, cfb, des, vigenere]
sources: ["raw/guias/guia2/Guia 2 - Criptografía Simétrica.pdf", "raw/guias/guia2/Resolucion Guia 2.md", "raw/practicas/Modo CFB.pdf", "raw/practicas/Clase 3.pdf"]
---

# Guía 2 — Criptografía Simétrica

> **24/08/2026**, continúa el **31/08** · [Enunciado](../../raw/guias/guia2/Guia%202%20-%20Criptograf%C3%ADa%20Sim%C3%A9trica.pdf) · Teoría: [[clase-02-cifrado|Clase 02 — Cifrado simétrico]]
> **Enunciado y resolución en la misma página:** debajo de cada ejercicio hay un aviso plegado con la resolución completa. Se abre con un clic, así se puede intentar el ejercicio antes de ver la cuenta.

Esta nota reúne **los enunciados de la Guía 2 transcriptos**, con el concepto que destraba cada uno, y **la resolución de los ocho, plegada debajo de cada enunciado**: primero lo que se pide, y recién al abrir el aviso el desarrollo completo.

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

Los **ocho** ejercicios están resueltos más abajo, en el aviso plegado que sigue a cada enunciado; la columna *Estado* linkea a cada uno.

| # | Tema | Concepto que aplica | Estado |
|---|---|---|---|
| 1 | Distribución de $\mathcal{C}$ y refutación del secreto perfecto | [[secreto-perfecto\|Secreto perfecto]] · [[modelo-probabilistico-de-un-criptosistema\|Modelo probabilístico]] | [[guia-02-criptografia-simetrica#Ejercicio 1\|resuelto]] |
| 2 | ¿Secreto perfecto ⟹ todas las a posteriori iguales entre sí? | [[secreto-perfecto\|Secreto perfecto]] · [[modelo-probabilistico-de-un-criptosistema\|Modelo probabilístico]] | [[guia-02-criptografia-simetrica#Ejercicio 2\|resuelto]] |
| 3 | Secreto perfecto en rotación, sustitución y Vigenère | [[secreto-perfecto\|Secreto perfecto]] · [[cifrado-por-rotacion\|Rotación]] · [[cifrado-de-sustitucion-monoalfabetica\|Sustitución monoalfabética]] · [[cifrado-de-vigenere\|Vigenère]] | [[guia-02-criptografia-simetrica#Ejercicio 3\|resuelto]] |
| 4 | Vigenère de período aleatorio contra el experimento `Eav` | [[pruebas-de-indistinguibilidad\|Pruebas de indistinguibilidad]] · [[cifrado-de-vigenere\|Vigenère]] | [[guia-02-criptografia-simetrica#Ejercicio 4\|resuelto]] |
| 5 | `CPA` sobre sustitución monoalfabética y Vigenère | [[modelos-de-ataque\|Modelos de ataque]] · [[pruebas-de-indistinguibilidad\|Pruebas de indistinguibilidad]] | [[guia-02-criptografia-simetrica#Ejercicio 5\|resuelto]] |
| 6 | Propagación de errores en `CBC` y `CFB` | [[modos-de-encadenamiento\|Modos de encadenamiento]] | [[guia-02-criptografia-simetrica#Ejercicio 6\|resuelto]] |
| 7 | Primitiva $(M \cdot K) \bmod 32$ cifrando en modo `CBC` | [[primitiva-de-cifrado-en-bloque\|Primitiva de cifrado en bloque]] · [[modos-de-encadenamiento\|Modos de encadenamiento]] · [[inverso-modular\|Inverso modular]] · [[algoritmo-de-euclides-extendido\|Euclides extendido]] · [[aritmetica-modular-y-divisibilidad\|Aritmética modular]] | [[guia-02-criptografia-simetrica#Ejercicio 7\|resuelto]] |
| 8 | Claves débiles de DES | [[des-y-3des\|DES y 3-DES]] | [[guia-02-criptografia-simetrica#Ejercicio 8\|resuelto]] |

---

> [!nota]- Cómo está resuelta esta guía
> Esta nota reúne **las cuentas hechas de la Guía 2**, con el razonamiento completo y no sólo el resultado. Los ocho ejercicios están resueltos de punta a punta. Es el material que más directamente cae en el **Parcial 1 (24/09)**: la guía recorre el secreto perfecto desde los dos lados (verificarlo y refutarlo), lo ataca con el juego `Eav`, y después baja a lo operativo — modos de encadenamiento, propagación de errores, un cifrado de bloque de juguete y las claves débiles de DES.
>
> Cada resolución va **plegada debajo del enunciado** correspondiente, y arranca con el resumen en cursiva de lo que se pide. Los apuntes crudos de los que salieron las cuentas están en [Resolucion Guia 2.md](../../raw/guias/guia2/Resolucion%20Guia%202.md).
>
> ### Tablero: qué destraba cada ejercicio
>
> | Ej. | Lo que se pregunta | El concepto que lo destraba |
> |---|---|---|
> | 1 | Refutar secreto perfecto de **cuatro** maneras | [[secreto-perfecto\|Secreto perfecto]] · [[pruebas-de-indistinguibilidad\|Pruebas de indistinguibilidad]] |
> | 2 | Probar o refutar una afirmación sobre las a posteriori | [[secreto-perfecto\|Secreto perfecto]] · [[one-time-pad\|One Time Pad]] |
> | 3 | Cuándo los clásicos **sí** alcanzan secreto perfecto | [[cifrado-por-rotacion\|Rotación]] · [[cifrado-de-sustitucion-monoalfabetica\|Sustitución]] · [[cifrado-de-vigenere\|Vigenère]] |
> | 4 | Calcular $\Pr[\mathsf{Eav}_{A,\Pi}=1]$ de un adversario concreto | [[pruebas-de-indistinguibilidad\|Pruebas de indistinguibilidad]] |
> | 5 | Dos ataques CPA constructivos | [[modelos-de-ataque\|Modelos de ataque]] |
> | 6 | Propagación de errores en `CBC` y `CFB` | [[modos-de-encadenamiento\|Modos de encadenamiento]] |
> | 7 | Tamaño de bloque, clave efectiva, `CBC` a mano | [[primitiva-de-cifrado-en-bloque\|Primitiva de cifrado en bloque]] · [[modos-de-encadenamiento\|Modos]] · [[inverso-modular\|Inverso modular]] · [[algoritmo-de-euclides-extendido\|Euclides extendido]] |
> | 8 | Claves débiles de DES | [[des-y-3des\|DES y 3-DES]] |

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

> [!nota]- Resolución del Ejercicio 1
> *Criptosistema con $\mathcal{M} = \{a,b\}$, $\mathcal{K} = \{k_1,k_2,k_3\}$ y la tabla de `Enc` dada. a) Hallar la distribución de $C$. b) Demostrar de las **cuatro maneras vistas en la teoría** que no tiene secreto perfecto.*
>
> ![Enunciado Ej. 1](../../assets/Pasted%20image%2020260821153134.png)
>
> **Este sistema ya está trabajado en la wiki.** Es *exactamente* el **Ejemplo 2** de [[probabilidad-y-criptografia|Probabilidad y criptografía]] — mismos espacios, misma tabla, mismas distribuciones. Ahí están las cuentas de los dos criterios distribucionales y el análisis de qué filtra cada criptograma. Acá abajo se rehacen igual (porque es lo que hay que saber escribir en el parcial) y se agregan las dos maneras que el apunte no cubre: la indistinguibilidad de mensajes y el juego `Eav`.
>
> ### Los datos
>
> $$\mathcal{M} = \{a, b\},\qquad \Pr[M{=}a] = 0{,}25 = \tfrac14,\qquad \Pr[M{=}b] = 0{,}75 = \tfrac34$$
> $$\mathcal{K} = \{k_1, k_2, k_3\},\qquad \Pr[K{=}k_1] = \tfrac12,\qquad \Pr[K{=}k_2] = \Pr[K{=}k_3] = \tfrac14$$
>
> Tabla de `Enc`:
>
> | `Enc` | $a$ | $b$ |
> |---|---|---|
> | $k_1$ | 1 | 2 |
> | $k_2$ | 2 | 3 |
> | $k_3$ | 3 | 4 |
>
> $$\mathcal{C} = \{\mathsf{Enc}_k(x) \;/\; x \in \mathcal{M} \wedge k \in \mathcal{K}\} = \{1,2,3,4\}$$
>
> Dos observaciones que ya anticipan todo lo que va a pasar:
>
> - **La tabla no es cuadrada.** $3 \times 2$ casillas sobre 4 símbolos de cifrado. Desde $a$ se alcanza $\{1,2,3\}$ y desde $b$ se alcanza $\{2,3,4\}$: **los soportes no coinciden**.
> - **Las claves no son uniformes.** $k_1$ pesa el doble que las otras dos.
>
> Son dos fallas independientes, y el sistema tiene las dos.
>
> ### a) Distribución de C
>
> La fórmula es la marginal del [[modelo-probabilistico-de-un-criptosistema|modelo probabilístico]]: se suma sobre todos los pares $(k, x)$ que producen ese criptograma, y cada par pesa $\Pr[K{=}k]\Pr[M{=}x]$ por la **hipótesis de independencia** entre clave y mensaje.
>
> $$\Pr[C{=}c] \;=\; \sum_{k \,:\, \mathsf{Enc}_k^{-1}(c)\ \text{existe}} \Pr[K{=}k]\cdot\Pr\big[M{=}\mathsf{Dec}_k(c)\big]$$
>
> Se lee la tabla **por celdas**: cada celda es un par $(k_i, x)$ y aporta un término al criptograma que tiene escrito adentro.
>
> | $c$ | Celdas $(k, x)$ que lo producen | Cuenta | $\Pr[C{=}c]$ |
> |---|---|---|---|
> | 1 | $(k_1, a)$ | $\tfrac12\cdot\tfrac14$ | $\tfrac18 = 0{,}125$ |
> | 2 | $(k_1, b)$, $(k_2, a)$ | $\tfrac12\cdot\tfrac34 + \tfrac14\cdot\tfrac14 = \tfrac{6}{16}+\tfrac{1}{16}$ | $\tfrac{7}{16} = 0{,}4375$ |
> | 3 | $(k_2, b)$, $(k_3, a)$ | $\tfrac14\cdot\tfrac34 + \tfrac14\cdot\tfrac14 = \tfrac{3}{16}+\tfrac{1}{16}$ | $\tfrac{4}{16} = \tfrac14 = 0{,}25$ |
> | 4 | $(k_3, b)$ | $\tfrac14\cdot\tfrac34$ | $\tfrac{3}{16} = 0{,}1875$ |
>
> *Control de suma:* $\tfrac{2}{16} + \tfrac{7}{16} + \tfrac{4}{16} + \tfrac{3}{16} = \tfrac{16}{16} = 1$. **Cierra.**
>
> **Lo que ya se ve acá.** $C{=}1$ y $C{=}4$ tienen **un solo término** en la suma: hay una única combinación (clave, mensaje) capaz de producirlos. Eso es el germen del problema — si sólo un mensaje puede generar ese criptograma, verlo delata el mensaje. El resto del ejercicio es formalizar esa intuición cuatro veces.
>
> ### b) Las cuatro demostraciones
>
> #### La trampa del ejercicio: Shannon no sirve acá
>
> Antes de empezar, hay que **descartar explícitamente el atajo**, porque es el error clásico en este ejercicio. El [[secreto-perfecto#Teorema de Shannon (cota de claves)|teorema de Shannon]] dice
>
> $$\text{secreto perfecto} \implies \lvert\mathcal{K}\rvert \ge \lvert\mathcal{M}\rvert$$
>
> y acá $\lvert\mathcal{K}\rvert = 3 \ge 2 = \lvert\mathcal{M}\rvert$: **la cota se cumple**. Como la implicación va en un solo sentido, cumplir la cota **no prueba nada**. Es condición necesaria, nunca suficiente. El conteo de claves no ve la estructura de `Enc`, y es justo la estructura la que falla.
>
> Por eso hay que ir a los criterios **distribucionales**, que sí miran cómo están repartidas las claves entre los criptogramas. Van las cuatro maneras.
>
> #### Manera 1 — Criterio del mensaje (la definición)
>
> **Definición.** $\Pi$ tiene secreto perfecto si para toda distribución sobre $\mathcal{M}$, todo $m \in \mathcal{M}$ y todo $c \in \mathcal{C}$ con $\Pr[C{=}c] > 0$: $\ \Pr[M{=}m \mid C{=}c] = \Pr[M{=}m]$.
>
> Se calculan las a posteriori con **Bayes**. Como para cada par $(x, c)$ hay a lo sumo **una** clave que lleva $x$ a $c$ (ver la tabla: no hay repetidos en las columnas), la fórmula queda con un solo término arriba:
>
> $$\Pr[M{=}x \mid C{=}c] \;=\; \frac{\Pr[M{=}x]\cdot\Pr\big[K = k(x,c)\big]}{\Pr[C{=}c]}$$
>
> donde $k(x,c)$ es esa única clave, y el numerador vale $0$ si no existe.
>
> $$\Pr[M{=}a\mid C{=}1] = \frac{\tfrac14\cdot\tfrac12}{\tfrac18} = \frac{1/8}{1/8} = 1 \qquad\qquad \Pr[M{=}b\mid C{=}1] = \frac{\tfrac34\cdot 0}{\tfrac18} = 0$$
>
> $$\Pr[M{=}a\mid C{=}2] = \frac{\tfrac14\cdot\tfrac14}{\tfrac{7}{16}} = \frac{1/16}{7/16} = \tfrac17 \qquad \Pr[M{=}b\mid C{=}2] = \frac{\tfrac34\cdot\tfrac12}{\tfrac{7}{16}} = \frac{6/16}{7/16} = \tfrac67$$
>
> $$\Pr[M{=}a\mid C{=}3] = \frac{\tfrac14\cdot\tfrac14}{\tfrac{4}{16}} = \frac{1/16}{4/16} = \tfrac14 \qquad \Pr[M{=}b\mid C{=}3] = \frac{\tfrac34\cdot\tfrac14}{\tfrac{4}{16}} = \frac{3/16}{4/16} = \tfrac34$$
>
> $$\Pr[M{=}a\mid C{=}4] = \frac{\tfrac14\cdot 0}{\tfrac{3}{16}} = 0 \qquad\qquad\ \ \Pr[M{=}b\mid C{=}4] = \frac{\tfrac34\cdot\tfrac14}{\tfrac{3}{16}} = \frac{3/16}{3/16} = 1$$
>
> | A posteriori | $c=1$ | $c=2$ | $c=3$ | $c=4$ | **A priori** | ¿Coincide? |
> |---|---|---|---|---|---|---|
> | $\Pr[M{=}a\mid C{=}c]$ | $\mathbf{1}$ | $1/7$ | $1/4$ | $\mathbf{0}$ | $1/4$ | sólo en $c=3$ |
> | $\Pr[M{=}b\mid C{=}c]$ | $\mathbf{0}$ | $6/7$ | $3/4$ | $\mathbf{1}$ | $3/4$ | sólo en $c=3$ |
>
> **No hay secreto perfecto.** El caso más elocuente es $c=1$: ver un 1 hace que $\Pr[M{=}a\mid C{=}1] = 1$, es decir que el adversario pasa de creer $1/4$ a **saber con certeza** que el mensaje fue $a$. Simétricamente, ver un 4 delata $b$. Eso es fuga total, no un sesguito.
>
> **Detalle que hay que decir en voz alta:** $c=3$ **sí** cumple la definición ($1/4$ y $3/4$, clavadas en la a priori). No salva nada. La definición es un $\forall c$, así que **alcanza con que un solo $c$ falle** para que no haya secreto perfecto. Refutar un $\forall$ cuesta un contraejemplo; probarlo cuesta la tabla entera.
>
> #### Manera 2 — Criterio del cifrado
>
> **Caracterización equivalente.** Hay secreto perfecto si y sólo si $\ \Pr[C{=}c \mid M{=}m] = \Pr[C{=}c]\ $ para todo $m$ y todo $c$. → [[secreto-perfecto#Caracterización equivalente|Secreto perfecto § Caracterización equivalente]]
>
> Es la lectura **por filas de la tabla de `Enc`**: fijado el mensaje, se pregunta qué masa de claves manda ese mensaje a cada criptograma.
>
> $$\Pr[C{=}1\mid M{=}a] = \Pr[K{=}k_1] = \tfrac12 \qquad\ \ \Pr[C{=}1\mid M{=}b] = 0$$
> $$\Pr[C{=}2\mid M{=}a] = \Pr[K{=}k_2] = \tfrac14 \qquad\ \ \Pr[C{=}2\mid M{=}b] = \Pr[K{=}k_1] = \tfrac12$$
> $$\Pr[C{=}3\mid M{=}a] = \Pr[K{=}k_3] = \tfrac14 \qquad\ \ \Pr[C{=}3\mid M{=}b] = \Pr[K{=}k_2] = \tfrac14$$
> $$\Pr[C{=}4\mid M{=}a] = 0 \qquad\qquad\qquad\ \ \Pr[C{=}4\mid M{=}b] = \Pr[K{=}k_3] = \tfrac14$$
>
> | $\Pr[C{=}c\mid M{=}x]$ | $c=1$ | $c=2$ | $c=3$ | $c=4$ | suma |
> |---|---|---|---|---|---|
> | $x = a$ | $1/2$ | $1/4$ | $1/4$ | $0$ | 1 |
> | $x = b$ | $0$ | $1/2$ | $1/4$ | $1/4$ | 1 |
> | **$\Pr[C{=}c]$** | $1/8$ | $7/16$ | $1/4$ | $3/16$ | 1 |
>
> **No hay secreto perfecto.** Contraejemplo mínimo, y con eso alcanza para el parcial:
>
> $$\Pr[C{=}1 \mid M{=}a] = \tfrac12 \;\ne\; \tfrac18 = \Pr[C{=}1]$$
>
> Las tres filas coinciden **sólo** en la columna $c=3$ — el mismo criptograma inofensivo que apareció en la Manera 1, como tenía que pasar: los dos criterios son equivalentes y dan siempre el mismo veredicto.
>
> #### Manera 3 — Indistinguibilidad de mensajes
>
> **Tercera caracterización** (la de Katz & Lindell): hay secreto perfecto si y sólo si $\ \Pr[\mathsf{Enc}_K(m) = c] = \Pr[\mathsf{Enc}_K(m') = c]\ $ para todo par de mensajes $m, m'$ y todo $c$.
>
> Es la más cómoda de las tres, y conviene entender **por qué**: no menciona $\Pr[M]$ **en absoluto**. La probabilidad es sólo sobre el sorteo de la clave. Eso importa porque la definición de secreto perfecto cuantifica sobre *toda* distribución de mensajes, y este criterio te ahorra tener que pensar en eso: si las dos filas de la tabla de la Manera 2 son iguales entre sí, hay secreto perfecto **para cualquier** $\Pr[M]$.
>
> Acá las dos filas ya están calculadas:
>
> | | $c=1$ | $c=2$ | $c=3$ | $c=4$ |
> |---|---|---|---|---|
> | $\Pr[\mathsf{Enc}_K(a) = c]$ | $1/2$ | $1/4$ | $1/4$ | $0$ |
> | $\Pr[\mathsf{Enc}_K(b) = c]$ | $0$ | $1/2$ | $1/4$ | $1/4$ |
> | **¿Iguales?** | **no** | **no** | sí | **no** |
>
> **No hay secreto perfecto.** Con $m = a$, $m' = b$ y $c = 1$:
>
> $$\Pr[\mathsf{Enc}_K(a) = 1] = \tfrac12 \;\ne\; 0 = \Pr[\mathsf{Enc}_K(b) = 1]$$
>
> *(Lectura nuestra.)* Las tres maneras anteriores son la misma cuenta leída en tres direcciones: la Manera 2 compara cada fila **contra la marginal**, la Manera 3 compara **las filas entre sí**, y la Manera 1 aplica Bayes para pasar de filas a columnas. Que fallen las tres a la vez no es coincidencia — son equivalentes.
>
> #### Manera 4 — El juego Eav: exhibir un adversario que gana
>
> La cuarta manera es **operativa**: en vez de comparar distribuciones, se construye un adversario concreto y se calcula su probabilidad de éxito. Si supera $1/2$, no hay secreto perfecto (ni siquiera indistinguibilidad).
>
> La prueba $\mathsf{Eav}_{A,\Pi}$, tal como está en [[pruebas-de-indistinguibilidad#Las tres pruebas|Pruebas de indistinguibilidad]]. **Ojo con la notación**: el enunciado usa $b$ como nombre de un mensaje, así que acá al bit del juego lo llamamos $\beta$ para que no choquen.
>
> $$\begin{aligned}
> &1)\ \ A \text{ emite } m_0 = a \ \text{ y } \ m_1 = b\\
> &2)\ \ \text{se sortea } k \leftarrow \mathcal{K} \ \text{ según } \Pr[K]\\
> &3)\ \ \text{se sortea } \beta \leftarrow \{0,1\} \ \text{ uniforme}\\
> &4)\ \ A \text{ recibe } c = \mathsf{Enc}_k(m_\beta)\\
> &5)\ \ A \text{ emite } \beta' \in \{0,1\}; \quad \mathsf{Eav}_{A,\Pi} = 1 \iff \beta' = \beta
> \end{aligned}$$
>
> **La estrategia de $A$** sale directo de la tabla de la Manera 3: para cada $c$, apostar al mensaje que lo produce con más probabilidad.
>
> | $c$ recibido | $\Pr[\mathsf{Enc}_K(a){=}c]$ | $\Pr[\mathsf{Enc}_K(b){=}c]$ | $A$ responde | Por qué |
> |---|---|---|---|---|
> | 1 | $1/2$ | $0$ | $\beta' = 0$ | sólo $a$ puede producir un 1 |
> | 2 | $1/4$ | $1/2$ | $\beta' = 1$ | $b$ lo produce el doble de seguido |
> | 3 | $1/4$ | $1/4$ | $\beta' = 0$ | empate: da igual, se rompe hacia 0 |
> | 4 | $0$ | $1/4$ | $\beta' = 1$ | sólo $b$ puede producir un 4 |
>
> **Probabilidad de éxito.** $A$ acierta cuando $\beta=0$ si el criptograma cae en $\{1, 3\}$, y cuando $\beta=1$ si cae en $\{2,4\}$:
>
> $$\Pr[\text{éxito} \mid \beta{=}0] = \Pr[\mathsf{Enc}_K(a) \in \{1,3\}] = \tfrac12 + \tfrac14 = \tfrac34$$
> $$\Pr[\text{éxito} \mid \beta{=}1] = \Pr[\mathsf{Enc}_K(b) \in \{2,4\}] = \tfrac12 + \tfrac14 = \tfrac34$$
>
> Como $\beta$ es uniforme:
>
> $$\Pr[\mathsf{Eav}_{A,\Pi} = 1] = \tfrac12\cdot\tfrac34 + \tfrac12\cdot\tfrac34 = \boxed{\tfrac34} \;>\; \tfrac12$$
>
> **No hay secreto perfecto**, y encima el sistema ni siquiera es indistinguible: el exceso $\varepsilon = 1/4$ es una constante, no algo despreciable.
>
> **Esta es la estrategia óptima.** *(Verificado.)* La cota máxima de cualquier adversario en este juego es
> $$\tfrac12\sum_{c}\max\big(\Pr[\mathsf{Enc}_K(a){=}c],\ \Pr[\mathsf{Enc}_K(b){=}c]\big) = \tfrac12\left(\tfrac12 + \tfrac12 + \tfrac14 + \tfrac14\right) = \tfrac34$$
> o sea que $3/4$ no se puede mejorar. La cuenta también explica de dónde sale el exceso: cada columna en la que las dos filas difieren aporta $\tfrac12\lvert \text{diferencia}\rvert$ por encima del $1/2$ base. La columna $c=3$, donde son iguales, no aporta nada — es la misma observación de siempre, vista una cuarta vez.
>
> ### Resumen del Ejercicio 1
>
> | Manera | Qué se compara | Dónde falla | Veredicto |
> |---|---|---|---|
> | 1 · mensaje | a posteriori contra a priori | $c \in \{1,2,4\}$ | no |
> | 2 · cifrado | filas contra la marginal $\Pr[C]$ | $c \in \{1,2,4\}$ | no |
> | 3 · indistinguibilidad | filas entre sí | $c \in \{1,2,4\}$ | no |
> | 4 · juego $\mathsf{Eav}$ | probabilidad de éxito contra $1/2$ | $3/4 > 1/2$ | no |
> | *(Shannon)* | $\lvert\mathcal{K}\rvert$ contra $\lvert\mathcal{M}\rvert$ | $3 \ge 2$: **se cumple** | **no concluye** |

### Ejercicio 2

Probar o encontrar un **contraejemplo** de la siguiente afirmación:

> En un criptosistema que posee la propiedad de **secreto perfecto** se cumple que para toda distribución sobre el espacio de mensajes $\mathcal{M}$, para todo $m, m' \in \mathcal{M}$ y para todo $c \in \mathcal{C}$,
> $$\Pr[M = m \mid C = c] = \Pr[M = m' \mid C = c]$$

> [!nota]- Resolución del Ejercicio 2
> *Probar o encontrar un contraejemplo: en un criptosistema con secreto perfecto, para toda distribución sobre $\mathcal{M}$, todo $m, m' \in \mathcal{M}$ y todo $c \in \mathcal{C}$ vale $\Pr[M{=}m \mid C{=}c] = \Pr[M{=}m' \mid C{=}c]$.*
>
> ![Enunciado Ej. 2](../../assets/Pasted%20image%2020260821194650.png)
>
> **La afirmación es FALSA.** Va el contraejemplo, pero primero conviene ver *por qué* es falsa, porque el error conceptual que la genera es el que hay que no cometer en el parcial.
>
> ### El error conceptual, en dos renglones
>
> Por hipótesis el sistema tiene secreto perfecto, así que para cualesquiera $m, m'$ y todo $c$ con $\Pr[C{=}c] > 0$:
>
> $$\Pr[M{=}m \mid C{=}c] = \Pr[M{=}m] \qquad\text{y}\qquad \Pr[M{=}m' \mid C{=}c] = \Pr[M{=}m']$$
>
> Reemplazando en la afirmación, lo que se estaría pidiendo es
>
> $$\Pr[M{=}m] = \Pr[M{=}m'] \quad \forall m, m' \in \mathcal{M}$$
>
> es decir, **que la distribución sobre $\mathcal{M}$ sea uniforme**. Y ahí está el problema: la definición de secreto perfecto cuantifica sobre **toda** distribución sobre $\mathcal{M}$, no sólo sobre la uniforme. El sistema no tiene ningún control sobre qué mensajes decide emitir el usuario. Si la fuente es sesgada, sigue sesgada después de ver el criptograma — precisamente porque el criptograma **no aporta información**.
>
> **La moraleja, que es lo que se lleva al parcial.** El secreto perfecto dice que el criptograma **no cambia** las creencias del adversario. **No** dice que las **iguale** entre sí. Lo que se preserva es la distribución a priori, sea la que sea — incluida una a priori muy desbalanceada. Un adversario que sabe que el 99 % de los mensajes son `ATACAR` sigue sabiéndolo después de ver el cifrado, y eso **no** es una falla del sistema: esa información ya la tenía antes.
>
> ### El contraejemplo concreto
>
> Alcanza con el **[[one-time-pad|One Time Pad]] de un bit**, que es el sistema con secreto perfecto más chico que existe:
>
> $$\mathcal{M} = \mathcal{K} = \mathcal{C} = \{0,1\},\qquad \mathsf{Gen}: k \leftarrow \{0,1\} \text{ uniforme},\qquad \mathsf{Enc}_k(m) = m \oplus k$$
>
> **Tiene secreto perfecto** — está demostrado en la nota del [[one-time-pad|OTP]], y se ve en una línea: para todo par $(m,c)$ hay exactamente una clave que los conecta, $k = m \oplus c$, y todas pesan $1/2$. Luego $\Pr[\mathsf{Enc}_K(m) = c] = 1/2$ independiente de $m$: es la caracterización de la Manera 3 del Ejercicio 1. La tabla de `Enc` es un cuadrado latino de orden 2.
>
> Ahora se elige una distribución de mensajes **no uniforme** — la misma del Ejercicio 1, para que se vea el paralelo:
>
> $$\Pr[M{=}0] = \tfrac14, \qquad \Pr[M{=}1] = \tfrac34$$
>
> Marginal del criptograma:
>
> $$\Pr[C{=}0] = \Pr[M{=}0]\Pr[K{=}0] + \Pr[M{=}1]\Pr[K{=}1] = \tfrac14\cdot\tfrac12 + \tfrac34\cdot\tfrac12 = \tfrac12$$
> $$\Pr[C{=}1] = \Pr[M{=}0]\Pr[K{=}1] + \Pr[M{=}1]\Pr[K{=}0] = \tfrac14\cdot\tfrac12 + \tfrac34\cdot\tfrac12 = \tfrac12$$
>
> A posteriori, con Bayes, tomando $c = 0$:
>
> $$\Pr[M{=}0 \mid C{=}0] = \frac{\Pr[M{=}0]\Pr[K{=}0]}{\Pr[C{=}0]} = \frac{\tfrac14\cdot\tfrac12}{\tfrac12} = \tfrac14$$
> $$\Pr[M{=}1 \mid C{=}0] = \frac{\Pr[M{=}1]\Pr[K{=}1]}{\Pr[C{=}0]} = \frac{\tfrac34\cdot\tfrac12}{\tfrac12} = \tfrac34$$
>
> | | $c=0$ | $c=1$ | **a priori** |
> |---|---|---|---|
> | $\Pr[M{=}0\mid C{=}c]$ | $1/4$ | $1/4$ | $1/4$ |
> | $\Pr[M{=}1\mid C{=}c]$ | $3/4$ | $3/4$ | $3/4$ |
>
> Las a posteriori **coinciden exactamente con las a priori** → el secreto perfecto se cumple, como tenía que cumplirse. Y sin embargo, tomando $m = 0$, $m' = 1$, $c = 0$:
>
> $$\Pr[M{=}0 \mid C{=}0] = \tfrac14 \;\ne\; \tfrac34 = \Pr[M{=}1 \mid C{=}0]$$
>
> **La afirmación falla.** Un sistema con secreto perfecto, una distribución legítima sobre $\mathcal{M}$, y las dos a posteriori distintas.
>
> ### La afirmación que sí es verdadera, y se le parece
>
> *(Lectura nuestra — el enunciado no lo pide, pero es la confusión que hay que desarmar.)*
>
> La afirmación del enunciado se vuelve **verdadera** si se cambia qué está condicionado a qué:
>
> $$\Pr[\,\mathsf{Enc}_K(m) = c\,] = \Pr[\,\mathsf{Enc}_K(m') = c\,] \qquad \forall m, m' \in \mathcal{M},\ \forall c \in \mathcal{C}$$
>
> Eso es la **indistinguibilidad de mensajes** (la Manera 3 del Ejercicio 1), y es **equivalente** al secreto perfecto. La diferencia es exactamente dónde va la barra:
>
> | Expresión | Qué compara | ¿Equivale a secreto perfecto? |
> |---|---|---|
> | $\Pr[M{=}m \mid C{=}c]$ contra $\Pr[M{=}m' \mid C{=}c]$ | dos mensajes, **dado** el cifrado | **no** — equivale a $\Pr[M]$ uniforme |
> | $\Pr[C{=}c \mid M{=}m]$ contra $\Pr[C{=}c \mid M{=}m']$ | dos mensajes, **fijado** el mensaje | **sí** |
>
> La segunda no arrastra la a priori (se cancela); la primera sí. Por eso una es una caracterización y la otra es una afirmación falsa que sólo vale en el caso uniforme.

### Ejercicio 3

Para los siguientes ejercicios, considerar el **alfabeto inglés (26 símbolos)**.

**a)** Demostrar que **si se encripta un solo símbolo**, entonces el [[cifrado-por-rotacion|cifrado de rotación]] tiene **secreto perfecto**.

**b)** ¿Cuál es el **mayor tamaño** que puede tener el espacio de textos planos $\mathcal{M}$ como para que el [[cifrado-de-sustitucion-monoalfabetica|cifrado de sustitución monoalfabética]] posea **secreto perfecto**?

**c)** Mostrar **cómo usar el [[cifrado-de-vigenere|cifrado de Vigenère]]** para encriptar una palabra de longitud $t$ y tener **secreto perfecto**.

> El punto (a) es exactamente el caso $\ell = 1$ que la nota de [[secreto-perfecto|secreto perfecto]] demuestra, sólo que ahí sobre el alfabeto de 27 y acá sobre el de 26. El (c) es el mismo argumento estirado a $t$ símbolos: se puede leer como *"¿cuándo el Vigenère es un [[one-time-pad|one-time pad]]?"*. *(Lectura nuestra; la guía no lo dice con esas palabras.)*

> [!nota]- Resolución del Ejercicio 3
> *Con el alfabeto inglés ($n = 26$): a) probar que la rotación de un solo símbolo tiene secreto perfecto; b) ¿cuál es el mayor $\lvert\mathcal{M}\rvert$ posible para que la sustitución monoalfabética tenga secreto perfecto?; c) cómo usar Vigenère para cifrar una palabra de longitud $t$ con secreto perfecto.*
>
> El hilo conductor de los tres incisos es el mismo: **los cifrados clásicos sí alcanzan el secreto perfecto, pero sólo cuando el espacio de mensajes se recorta hasta que la cota de Shannon se satisface con igualdad**. Lo que hay que descubrir en cada caso es *cuál* es el recorte correcto.
>
> ### a) Rotación sobre un solo símbolo
>
> Con $\mathcal{M} = \mathcal{C} = \mathcal{K} = \mathbb{Z}_{26}$, clave uniforme y $\mathsf{Enc}_k(m) = (m + k) \bmod 26$.
>
> **Demostración por la caracterización de indistinguibilidad** (la Manera 3 del Ej. 1, que es la que no necesita $\Pr[M]$). Fijados $m, c \in \mathbb{Z}_{26}$, la ecuación
>
> $$(m + k) \equiv c \pmod{26}$$
>
> tiene **exactamente una** solución en $\mathbb{Z}_{26}$, a saber $k = (c - m) \bmod 26$ — porque $(\mathbb{Z}_{26}, +)$ es un grupo y la traslación por $m$ es una biyección. Luego
>
> $$\Pr[\mathsf{Enc}_K(m) = c] = \Pr\big[K = (c-m) \bmod 26\big] = \tfrac{1}{26}$$
>
> y ese valor **no depende de $m$**. Por la caracterización equivalente, **hay secreto perfecto**. $\blacksquare$
>
> Tres lecturas del mismo hecho, que conviene tener las tres:
>
> - **Es un OTP** sobre el grupo $(\mathbb{Z}_{26}, +)$ en lugar de $(\mathbb{Z}_2^n, \oplus)$. → [[one-time-pad|One Time Pad]]
> - **La tabla de cifrado es un cuadrado latino** de orden 26: cada fila y cada columna contienen los 26 símbolos exactamente una vez. Cuadrado latino + clave uniforme $\Rightarrow$ secreto perfecto.
> - **La cota de Shannon se cumple con igualdad**: $\lvert\mathcal{K}\rvert = \lvert\mathcal{M}\rvert = \lvert\mathcal{C}\rvert = 26$. No sobra ni falta una clave.
>
> Ya está desarrollado en [[secreto-perfecto#Aplicación: ¿cuándo es perfecto el cifrado por rotación?|Secreto perfecto § ¿cuándo es perfecto el cifrado por rotación?]], con el recíproco incluido: con $\ell \ge 2$ **deja** de ser perfecto, y por dos razones distintas (el conteo $26 < 26^\ell$, y explícitamente porque la rotación preserva el patrón de repeticiones posicionales). Ese contraste con el $\ell \ge 2$ es lo que vuelve interesante al inciso (b).
>
> ### b) Sustitución monoalfabética: el máximo es |M| = 26!
>
> Esta es la respuesta **no obvia** de la guía. La intuición barata dice *"con longitud 1, $\lvert\mathcal{M}\rvert = 26$"*, y está muy lejos.
>
> El esquema es: $\mathcal{K} = S_{26}$, las permutaciones del alfabeto, $\lvert\mathcal{K}\rvert = 26!$, `Gen` sortea $\pi$ uniforme, y $\mathsf{Enc}_\pi(m_1 \dots m_\ell) = \pi(m_1)\dots\pi(m_\ell)$. → [[cifrado-de-sustitucion-monoalfabetica|Sustitución monoalfabética]]
>
> #### Cota superior: Shannon
>
> Por el [[secreto-perfecto#Teorema de Shannon (cota de claves)|teorema de Shannon]], secreto perfecto $\Rightarrow \lvert\mathcal{M}\rvert \le \lvert\mathcal{K}\rvert$. Acá
>
> $$\lvert\mathcal{M}\rvert \;\le\; \lvert\mathcal{K}\rvert \;=\; 26! \;\approx\; 4{,}03\times10^{26}$$
>
> Eso es todo lo que da la cota: un techo. Falta lo difícil, que es mostrar que el techo **se toca**.
>
> #### Alcanzabilidad: los anagramas del alfabeto
>
> Se toma como espacio de mensajes
>
> $$\mathcal{M} = \{\, m \in \Sigma^{26} \;:\; m \text{ usa cada letra del alfabeto exactamente una vez} \,\}$$
>
> o sea las cadenas de longitud 26 que son **anagramas del alfabeto completo**. Hay $26!$ de ellas, una por cada ordenamiento. Y $\mathcal{C} = \mathcal{M}$, porque aplicarle una permutación a un anagrama devuelve otro anagrama.
>
> **Afirmación:** para todo par $m, c \in \mathcal{M}$ existe **exactamente una** $\pi \in S_{26}$ con $\mathsf{Enc}_\pi(m) = c$.
>
> *Existe:* la condición $\pi(m_i) = c_i$ para $i = 1,\dots,26$ define $\pi$ sobre las 26 letras — porque $m$ usa cada letra exactamente una vez, así que cada letra del alfabeto aparece en exactamente una posición y recibe exactamente una imagen: no hay conflictos. Y la $\pi$ resultante es biyectiva porque $c$ también usa cada letra exactamente una vez, o sea que las imágenes son todas distintas y cubren todo $\Sigma$.
>
> *Es única:* las 26 condiciones $\pi(m_i) = c_i$ fijan el valor de $\pi$ en cada uno de los 26 elementos del dominio. No queda ningún grado de libertad.
>
> Con eso, y clave uniforme:
>
> $$\Pr[\mathsf{Enc}_K(m) = c] = \Pr\big[K = \pi(m,c)\big] = \frac{1}{26!} \qquad \text{para todo par } (m,c)$$
>
> independiente de $m$ → **secreto perfecto**, otra vez por la caracterización de indistinguibilidad. Y
>
> $$\lvert\mathcal{M}\rvert = 26! = \lvert\mathcal{K}\rvert$$
>
> o sea **la cota de Shannon con igualdad**: es el máximo posible. $\blacksquare$
>
> *(Verificado.)* La construcción fue chequeada por enumeración exhaustiva con alfabetos chicos: con $n=3$ y $n=4$, tomar $\mathcal{M}$ = cadenas de longitud $n$ sin letras repetidas da $\lvert\mathcal{M}\rvert = n! = \lvert\mathcal{K}\rvert$ y el sistema resulta perfecto.
>
> #### Por qué falla el caso ingenuo M = Sigma^2
>
> Este es el contraste que hace entender el resultado. Si uno intenta $\mathcal{M} = \Sigma^2$ (todas las cadenas de largo 2, $\lvert\mathcal{M}\rvert = 676$), el conteo **no objeta nada**: $676 \ll 26!$, la cota de Shannon sobra por un margen astronómico. Y sin embargo **no hay secreto perfecto**.
>
> La razón es estructural: **la sustitución preserva el patrón de repeticiones**. Como $\pi$ es una función, letras iguales van a letras iguales:
>
> $$m = \texttt{aa} \;\Longrightarrow\; \mathsf{Enc}_\pi(m) = \pi(\texttt{a})\pi(\texttt{a}), \text{ que tiene los dos símbolos IGUALES, sea cual sea } \pi$$
>
> Entonces, tomando cualquier $c = xy$ con $x \ne y$:
>
> $$\Pr[\mathsf{Enc}_K(\texttt{aa}) = xy] = 0 \qquad\text{mientras que}\qquad \Pr[\mathsf{Enc}_K(\texttt{ab}) = xy] = \frac{24!}{26!} > 0$$
>
> Las dos filas difieren → no hay secreto perfecto. *(Verificado por enumeración: $\mathcal{M} = \Sigma^2$ no es perfecto.)*
>
> Y es **la misma fuga de siempre**: es lo que habilita el [[criptoanalisis-por-frecuencias|criptoanálisis por frecuencias]], lo que hunde a la [[secreto-perfecto|rotación con longitud de clave mayor o igual que 2]], y lo que prohíbe el modo [[modos-de-encadenamiento|ECB]]. Cambia la escala; el defecto es el mismo.
>
> #### El matiz que hay que entender
>
> | $\mathcal{M}$ | $\lvert\mathcal{M}\rvert$ | Largo de los mensajes | ¿Secreto perfecto? |
> |---|---|---|---|
> | $\Sigma$ (un símbolo) | $26$ | 1 | **sí** |
> | $\Sigma^2$ | $676$ | 2 | **no** — $\texttt{aa}$ delata |
> | $\Sigma^{26}$ | $26^{26}$ | 26 | **no** — y encima viola Shannon |
> | Anagramas de $\Sigma$ | $\mathbf{26!}$ | 26 | **sí** |
>
> **Lo que limita no es la longitud del mensaje sino la estructura de $\mathcal{M}$.** Con mensajes de largo 26 se puede tener secreto perfecto (última fila) o no tenerlo (tercera fila): lo que decide es si $\mathcal{M}$ está armado de manera que ningún mensaje tenga un patrón de repeticiones distinguible de otro. Los anagramas cumplen eso trivialmente: **todos** tienen el mismo patrón (ninguna repetición).
>
> ### c) Vigenère con secreto perfecto sobre una palabra de longitud t
>
> La receta es de una línea, pero cada palabra cuenta:
>
> **Elegir el período de la clave igual a la longitud del mensaje ($t$), sortear $k = k_1\dots k_t$ uniforme en $\Sigma^t$, y usarla UNA SOLA VEZ.**
>
> Con eso, $\mathcal{M} = \mathcal{C} = \mathcal{K} = \Sigma^t$ y
>
> $$c_i = (m_i + k_i) \bmod 26, \qquad i = 1,\dots,t$$
>
> (el índice cíclico $((i-1) \bmod t) + 1$ de [[cifrado-de-vigenere|Vigenère]] se vuelve simplemente $i$, porque el período coincide con el largo: ninguna posición reusa clave).
>
> **Por qué funciona.** Cada símbolo se cifra con una rotación **independiente y uniforme**, así que es el argumento del inciso (a) repetido $t$ veces en paralelo. Formalmente: fijados $m, c \in \Sigma^t$, la única clave que los conecta es $k_i = (c_i - m_i) \bmod 26$ para cada $i$, y por lo tanto
>
> $$\Pr[\mathsf{Enc}_K(m) = c] = \Pr\big[K = (c - m) \bmod 26\big] = \frac{1}{26^{t}}$$
>
> independiente de $m$ → **secreto perfecto**. Es literalmente el **[[one-time-pad|OTP]] sobre $(\mathbb{Z}_{26}, +)^t$**, y de nuevo Shannon con igualdad: $\lvert\mathcal{K}\rvert = 26^t = \lvert\mathcal{M}\rvert$.
>
> **Por qué las tres condiciones son necesarias:**
>
> | Condición | Qué pasa si se afloja |
> |---|---|
> | Período $= t$ (no menos) | con $t' < t$ hay posiciones que comparten $k_i$; esas posiciones quedan **correlacionadas** y el sistema preserva relaciones entre símbolos. Es el flanco que explota el [[test-de-kasiski\|test de Kasiski]] y confirma el [[indice-de-coincidencia\|índice de coincidencia]] |
> | Clave uniforme | si algún $k_i$ está sesgado, la fila de $\Pr[\mathsf{Enc}_K(m)=c]$ deja de ser constante — es el ejercicio de la clave sesgada de la nota del [[one-time-pad\|OTP]] |
> | Un solo uso | dos mensajes con la misma clave dan $c \oplus c' = m \oplus m'$ (o su análogo modular): se filtra la diferencia de los planos sin tocar la clave |
>
> Y esto es exactamente el motivo por el que Vigenère "de verdad" (clave corta, reusada) **no** tiene secreto perfecto: con $t' < \lvert m\rvert$ se viola Shannon de entrada, $\lvert\mathcal{K}\rvert = 26^{t'} < 26^{\lvert m\rvert} = \lvert\mathcal{M}\rvert$. → [[cifrado-de-vigenere#Consecuencias prácticas|Vigenère § Consecuencias prácticas]]

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

> [!nota]- Resolución del Ejercicio 4
> *Vigenère con $\mathcal{M} = \Sigma^3$ ($\Sigma$ = alfabeto inglés). `Gen` elige primero el período $t$ uniforme en $\{1,2,3\}$ y después la clave $k$ uniforme en $\Sigma^t$. a) Ejemplo de cifrado. b) Calcular $\Pr[\mathsf{PrivK}^{\mathsf{eav}}_{A,\Pi} = 1]$ para el adversario que emite $m_0 = \texttt{aab}$, $m_1 = \texttt{abb}$ y responde `'0'` si los dos primeros símbolos del criptograma son iguales, `'1'` si no. c) ¿Tiene secreto perfecto?*
>
> Este es el ejercicio de cuenta larga de la guía, y el que más se parece a lo que puede caer en el parcial. La estructura del cálculo —condicionar sobre una variable escondida de `Gen`, evaluar cada caso por separado y promediar— es lo transferible.
>
> ### El esquema
>
> $$\begin{aligned}
> \mathsf{Gen} &: \ t \leftarrow \{1,2,3\} \ \text{uniforme},\quad \text{después } k = k_1\dots k_t \leftarrow \Sigma^{t} \ \text{uniforme}\\
> \mathsf{Enc}_k &: \ c_i = \big(m_i + k_{((i-1) \bmod t) + 1}\big) \bmod 26, \qquad i = 1,2,3
> \end{aligned}$$
>
> Lo raro —y lo que hace al ejercicio— es que **la clave no tiene longitud fija**: `Gen` sortea primero *cuánta* clave va a generar. Eso significa que $\mathcal{K}$ es la unión disjunta $\Sigma \cup \Sigma^2 \cup \Sigma^3$, y que la distribución sobre $\mathcal{K}$ **no es uniforme**: cada una de las 26 claves de largo 1 tiene probabilidad $\tfrac13\cdot\tfrac1{26}$, mientras que cada una de las $26^3$ de largo 3 tiene $\tfrac13\cdot\tfrac1{26^3}$. Las claves cortas son muchísimo más probables, individualmente, que las largas. Ahí está enterrada la fuga.
>
> ### a) Ejemplo de cifrado
>
> Tomamos $m = \texttt{cab}$, y supongamos que `Gen` sorteó $t = 2$ y $k = \texttt{de}$. Con la identificación $\texttt{a}=0, \texttt{b}=1, \dots, \texttt{z}=25$:
>
> $$m = \texttt{cab} = (2,\, 0,\, 1), \qquad k = \texttt{de} = (3,\, 4)$$
>
> | $i$ | $m_i$ | Índice de clave $((i-1)\bmod t)+1$ | $k$ usado | $c_i = (m_i + k)\bmod 26$ | Letra |
> |---|---|---|---|---|---|
> | 1 | $2$ ($\texttt{c}$) | $((0)\bmod 2)+1 = 1$ | $k_1 = 3$ | $(2+3) \bmod 26 = 5$ | $\texttt{f}$ |
> | 2 | $0$ ($\texttt{a}$) | $((1)\bmod 2)+1 = 2$ | $k_2 = 4$ | $(0+4) \bmod 26 = 4$ | $\texttt{e}$ |
> | 3 | $1$ ($\texttt{b}$) | $((2)\bmod 2)+1 = 1$ | $k_1 = 3$ | $(1+3) \bmod 26 = 4$ | $\texttt{e}$ |
>
> $$\mathsf{Enc}_{\texttt{de}}(\texttt{cab}) = \texttt{fee}$$
>
> **El renglón que importa es el tercero:** como el período es 2 y el mensaje mide 3, la tercera posición **vuelve a usar $k_1$**. Ese reuso dentro del mismo mensaje es exactamente lo que el adversario del inciso (b) va a explotar (en su caso, con $t=1$).
>
> ### b) La probabilidad de éxito del adversario
>
> #### Qué está testeando A, en una frase
>
> $$m_0 = \texttt{aab} \quad\text{(los dos primeros símbolos IGUALES)} \qquad m_1 = \texttt{abb} \quad\text{(los dos primeros DISTINTOS)}$$
>
> y $A$ responde según si $c_1 = c_2$ o no. O sea: **$A$ está preguntando si el cifrado conservó la igualdad entre las dos primeras posiciones.** Es el ataque del patrón de repeticiones, otra vez, adaptado al juego.
>
> **Convención de notación para todo este inciso.** $m_0$ y $m_1$ son los dos **mensajes** del juego; a los **símbolos** de un mensaje los llamamos $x_1 x_2 x_3$, para que el subíndice de mensaje no choque con el de posición. Así, $m_0 = \texttt{aab}$ quiere decir $x_1 = x_2 = \texttt{a}$ y $x_3 = \texttt{b}$.
>
> La cuenta se hace **condicionando sobre $t$**, porque la respuesta cambia radicalmente entre $t=1$ y $t \in \{2,3\}$.
>
> #### Caso t = 1: el adversario gana siempre
>
> Con período 1 hay una sola letra de clave, $k_1$, y **todas** las posiciones la usan:
>
> $$c_1 = (x_1 + k_1)\bmod 26, \qquad c_2 = (x_2 + k_1)\bmod 26$$
>
> Restando, $c_1 - c_2 \equiv x_1 - x_2 \pmod{26}$, y por lo tanto
>
> $$c_1 = c_2 \iff x_1 = x_2$$
>
> **sin ninguna aleatoriedad de por medio.** El cifrado con período 1 **preserva la igualdad posicional**: es la misma fuga del **Ejercicio 3b** (la sustitución no puede mandar $\texttt{aa}$ a dos símbolos distintos) y del $\ell \ge 2$ de la rotación.
>
> - Si $\beta = 0$ (se cifró $m_0 = \texttt{aab}$, con $x_1 = x_2 = \texttt{a}$): **siempre** $c_1 = c_2$ → $A$ emite `'0'` → **acierta con probabilidad 1**.
> - Si $\beta = 1$ (se cifró $m_1 = \texttt{abb}$, con $x_1 \ne x_2$): **nunca** $c_1 = c_2$ → $A$ emite `'1'` → **acierta con probabilidad 1**.
>
> Con $t=1$ el juego está entregado: $A$ acierta con certeza, gane quien gane el sorteo de $\beta$.
>
> #### Caso t = 2 y t = 3: el azar tapa la fuga
>
> Con período 2 o 3, las dos primeras posiciones usan **letras de clave distintas**, $k_1$ y $k_2$, que son **independientes y uniformes** en $\mathbb{Z}_{26}$:
>
> $$c_1 = (x_1 + k_1)\bmod 26, \qquad c_2 = (x_2 + k_2)\bmod 26$$
>
> Entonces
>
> $$c_1 = c_2 \iff k_2 - k_1 \equiv x_1 - x_2 \pmod{26}$$
>
> La variable $D = (k_2 - k_1) \bmod 26$ es **uniforme** en $\mathbb{Z}_{26}$: fijado $k_1$, $k_2$ recorre todo $\mathbb{Z}_{26}$ uniformemente, y la traslación por $-k_1$ es una biyección. Luego, **sea cual sea el mensaje**:
>
> $$\Pr[c_1 = c_2] = \Pr\big[D = (x_1 - x_2) \bmod 26\big] = \tfrac{1}{26}$$
>
> Y ahora la asimetría del adversario:
>
> - Si $\beta = 0$ ($m_0$, con $x_1 = x_2$): $A$ acierta sólo si sale $c_1 = c_2$, o sea con probabilidad $\tfrac1{26}$. **Acierta $\tfrac1{26}$.**
> - Si $\beta = 1$ ($m_1$, con $x_1 \ne x_2$): $A$ acierta si sale $c_1 \ne c_2$, o sea $1 - \tfrac1{26} = \tfrac{25}{26}$. **Acierta $\tfrac{25}{26}$.**
>
> *(Lectura nuestra.)* Nótese que con $t \ge 2$ el adversario es **peor que una moneda** cuando $\beta = 0$: apuesta a un evento de probabilidad $1/26$. Lo que lo salva es que en el otro brazo acierta casi siempre. El adversario no es óptimo — está desbalanceado a propósito — y aun así alcanza para romper el sistema, que es todo lo que hace falta.
>
> #### La tabla completa y el promedio
>
> | $t$ | $\Pr[t]$ | Qué determina $c_1 = c_2$ | $\Pr[\text{acierto} \mid \beta{=}0]$ | $\Pr[\text{acierto} \mid \beta{=}1]$ |
> |---|---|---|---|---|
> | $1$ | $1/3$ | $c_1 = c_2 \iff x_1 = x_2$ (determinista) | $1$ | $1$ |
> | $2$ | $1/3$ | $c_1 = c_2 \iff k_2 - k_1 = x_1 - x_2$ | $1/26$ | $25/26$ |
> | $3$ | $1/3$ | idem (las posiciones 1 y 2 no comparten clave) | $1/26$ | $25/26$ |
>
> Promediando sobre $t$, que es uniforme en $\{1,2,3\}$:
>
> $$\Pr[\text{acierto} \mid \beta{=}0] = \tfrac13\cdot 1 + \tfrac13\cdot\tfrac{1}{26} + \tfrac13\cdot\tfrac{1}{26} = \tfrac13\left(1 + \tfrac{2}{26}\right) = \tfrac13\cdot\tfrac{28}{26} = \tfrac{28}{78} = \tfrac{14}{39} \approx 0{,}3590$$
>
> $$\Pr[\text{acierto} \mid \beta{=}1] = \tfrac13\cdot 1 + \tfrac13\cdot\tfrac{25}{26} + \tfrac13\cdot\tfrac{25}{26} = \tfrac13\left(1 + \tfrac{50}{26}\right) = \tfrac13\cdot\tfrac{76}{26} = \tfrac{76}{78} = \tfrac{38}{39} \approx 0{,}9744$$
>
> Como $\beta$ es uniforme en $\{0,1\}$:
>
> $$\Pr\big[\mathsf{PrivK}^{\mathsf{eav}}_{A,\Pi} = 1\big] = \tfrac12\cdot\tfrac{14}{39} + \tfrac12\cdot\tfrac{38}{39} = \tfrac{14 + 38}{78} = \tfrac{52}{78} = \boxed{\tfrac{2}{3}} \approx 0{,}6667$$
>
> *(Verificado por enumeración exhaustiva de las $26 + 26^2 + 26^3$ claves.)*
>
> **De dónde sale el $2/3$, contado a ojo:** un tercio de las veces ($t=1$) el adversario acierta con probabilidad $1$, y los otros dos tercios acierta con probabilidad $\tfrac12\left(\tfrac1{26} + \tfrac{25}{26}\right) = \tfrac12$, o sea como una moneda. Entonces $\tfrac13\cdot 1 + \tfrac23\cdot\tfrac12 = \tfrac13 + \tfrac13 = \tfrac23$. **Toda la ventaja viene del caso $t=1$**, y vale exactamente el peso de ese caso.
>
> ### c) ¿Tiene secreto perfecto?
>
> **No.** El argumento es inmediato a partir de (b):
>
> $$\Pr\big[\mathsf{PrivK}^{\mathsf{eav}}_{A,\Pi} = 1\big] = \tfrac23 \;>\; \tfrac12$$
>
> El secreto perfecto exige que **todo** adversario —incluso uno sin ningún límite de cómputo, porque acá no hay hipótesis computacionales— acierte con probabilidad **exactamente** $1/2$. Basta exhibir uno que supere esa cota, y el del inciso (b) llega a $2/3$ con una regla de decisión que se escribe en un renglón. $\blacksquare$
>
> **Dónde está la fuga, dicho con precisión:** en el caso $t = 1$, que aporta un tercio de la masa de probabilidad y filtra el patrón de repeticiones **por completo**. Los otros dos tercios se comportan como un OTP sobre las dos primeras posiciones y no filtran nada. El sistema es una mezcla de un esquema perfecto y uno roto, y la mezcla hereda lo peor.
>
> #### El chequeo de conteo: otra vez la lección del Ejercicio 1
>
> Vale la pena hacerlo explícito, porque el paralelo con el Ejercicio 1 es exacto:
>
> $$\lvert\mathcal{K}\rvert = 26 + 26^2 + 26^3 = 26 + 676 + 17{.}576 = 18{.}278$$
> $$\lvert\mathcal{M}\rvert = 26^3 = 17{.}576$$
>
> $$\lvert\mathcal{K}\rvert = 18{.}278 \;\ge\; 17{.}576 = \lvert\mathcal{M}\rvert$$
>
> **La cota de Shannon se cumple** — y aun así no hay secreto perfecto. Igual que en el Ejercicio 1 ($3 \ge 2$), igual que en el Ejemplo 2 del [[probabilidad-y-criptografia|apunte de probabilidad]]. Lo que falla no es el conteo sino **cómo están repartidas las claves**: las 26 claves de período 1 se llevan un tercio entero de la masa, y son justo las que no mezclan nada.

### Ejercicio 5

Demostrar que los siguientes cifrados son **vulnerables a un ataque de texto plano elegido** (*chosen-plaintext attack*):

- cifrado de **sustitución monoalfabética**
- cifrado de **Vigenère**

> Es **literalmente el [[guia-01-criptografia-clasica#Ejercicio 8|Ej. 8 de la Guía 1]]**, con "muy fáciles de quebrar" cambiado por "vulnerables". Si ya lo hiciste, es el mismo argumento. La diferencia es el momento: acá ya está disponible el formalismo de [[pruebas-de-indistinguibilidad#Las tres pruebas|CPA]] como **prueba de indistinguibilidad**, y no sólo como el [[modelos-de-ataque|modelo de ataque]] informal de la Clase 01. *(Que ese sea el motivo de la repetición es lectura nuestra.)*

> [!nota]- Resolución del Ejercicio 5
> *Demostrar que la sustitución monoalfabética y el cifrado de Vigenère son vulnerables a un ataque de texto plano elegido (chosen-plaintext attack).*
>
> El marco es la prueba `CPA` de [[pruebas-de-indistinguibilidad#Las tres pruebas|Pruebas de indistinguibilidad]]: el adversario tiene acceso a un **oráculo de cifrado** $f(x) = \mathsf{Enc}_k(x)$ **antes** de elegir sus mensajes, y lo puede consultar con lo que quiera. → [[modelos-de-ataque|Modelos de ataque]]
>
> **La versión general ya está probada.** Los dos cifrados son **determinísticos**, y *determinístico $\Rightarrow$ no CPA-Secure* — la demostración de tres líneas está en [[pruebas-de-indistinguibilidad#Propiedades de CPA|CPA § Propiedades]]: $A$ pide $c^{*} = f(m_0)$, después emite $(m_0, m_1)$, y responde $0$ si el desafío coincide con $c^{*}$. Gana con probabilidad 1 sin saber nada del cifrado.
>
> Lo que se pide acá es más fuerte y más concreto: no distinguir, sino **recuperar la clave entera con una sola consulta**. Un ataque de *recuperación total de clave*, no de distinción.
>
> ### Sustitución monoalfabética
>
> **La consulta:** $A$ le pide al oráculo que cifre el alfabeto completo,
>
> $$m^{*} = \texttt{abcdefghijklmnopqrstuvwxyz}$$
>
> **La respuesta:** el oráculo devuelve
>
> $$f(m^{*}) = \pi(\texttt{a})\,\pi(\texttt{b})\,\pi(\texttt{c})\dots\pi(\texttt{z})$$
>
> que **es la tabla de sustitución completa**, leída en orden. La clave $\pi$ está literalmente escrita en el criptograma: la imagen de cada letra aparece en la posición de esa letra.
>
> **El resultado:** con $\pi$ en la mano, $A$ calcula $\pi^{-1}$ y descifra cualquier criptograma futuro. En el juego `CPA` emite dos mensajes distintos cualesquiera, recibe el desafío, lo descifra y responde correctamente con probabilidad $1$.
>
> **Costo:** **una** consulta de 26 símbolos. Compáralo con el espacio de claves: $26! \approx 4\times10^{26}$. El ataque no depende del tamaño de $\mathcal{K}$ en absoluto — es la refutación definitiva del *"espacio de claves grande $=$ seguro"* que ya aparecía en la [[guia-01-criptografia-clasica|Guía 1]]. → [[cifrado-de-sustitucion-monoalfabetica#Ataque de texto plano elegido|Sustitución § Ataque de texto plano elegido]]
>
> ### Vigenère
>
> Se apoya en el hecho de que $\texttt{a} = 0$ es el **neutro** de $(\mathbb{Z}_{26}, +)$.
>
> **La consulta:** $A$ pide cifrar una tirada de $\texttt{a}$,
>
> $$m^{*} = \underbrace{\texttt{aaaa}\dots\texttt{a}}_{L \text{ símbolos}}, \qquad L \ge t$$
>
> **La respuesta:** como $m_i = 0$ para todo $i$,
>
> $$c_i = (0 + k_{((i-1)\bmod t)+1}) \bmod 26 = k_{((i-1)\bmod t)+1}$$
>
> es decir que **el criptograma es la clave repetida**: $c = k_1k_2\dots k_t\,k_1k_2\dots$ Se lee la clave directamente.
>
> **Si $t$ es desconocido:** se pide una tirada larga de $\texttt{a}$ y se **lee el período en el criptograma**. La cadena resultante es exactamente periódica de período $t$, así que $t$ se detecta a simple vista — no hace falta [[test-de-kasiski|Kasiski]] ni [[indice-de-coincidencia|índice de coincidencia]], que son las herramientas del caso pasivo (COA). Bajo CPA el problema es trivial.
>
> **El resultado:** con $k$ y $t$, $A$ descifra todo. En el juego `CPA` gana con probabilidad $1$.
>
> **Costo:** **una** consulta.
>
> ### Lo transferible
>
> | | Consulta | Qué devuelve el oráculo | Qué se recupera |
> |---|---|---|---|
> | Sustitución monoalfabética | el alfabeto entero, 26 símbolos | $\pi$ evaluada en orden | la permutación completa |
> | Vigenère | $\texttt{aa}\dots\texttt{a}$, $L \ge t$ | la clave repetida | $k$ y, de yapa, $t$ |
>
> En los dos casos el truco es el mismo: **elegir el texto plano que hace que el criptograma sea la clave**. En sustitución, el mensaje que recorre todo el dominio; en Vigenère, el mensaje neutro. Ese es el patrón que conviene tener presente, porque se generaliza a cualquier cifrado con estructura algebraica simple.

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

> [!nota]- Resolución del Ejercicio 6
> *En `ECB` un error en un bloque del cifrado afecta sólo al bloque de texto claro correspondiente. a) En `CBC`, ¿a través de cuántos bloques de texto **cifrado** se propaga un error de un bit en $P_1$? b) En `CBC`, ¿a través de cuántos bloques de texto **descifrado** se propaga un error de un bit en $C_1$? c) ¿Hasta dónde se propaga un error de un bit en un carácter del cifrado en modo `CFB` de ocho bits?*
>
> **La figura del enunciado** (el diagrama de `CBC` que la guía referencia con *"ver figura"*) está en el [PDF de la cátedra](../../raw/guias/guia2/Guia%202%20-%20Criptograf%C3%ADa%20Sim%C3%A9trica.pdf), página 2. No la tenemos capturada en `assets/`; los diagramas equivalentes de la clase están en [[modos-de-encadenamiento#Los cinco modos|Modos de encadenamiento § Los cinco modos]].
>
> **La idea que resuelve los tres incisos:** no hay nada que memorizar. Se escriben las **ecuaciones del modo**, se pregunta *"¿en qué expresiones aparece el bloque que cambió?"*, y se distingue si entra **por la primitiva** (efecto avalancha, el bloque se destruye entero) o **por un xor directo** (se da vuelta exactamente ese bit y nada más). Todo lo demás sale de ahí.
>
> ### a) CBC: un bit de error en P_1 afecta a **todos** los bloques de cifrado
>
> Las ecuaciones de cifrado, con $C_0 = \mathrm{IV}$:
>
> $$C_i = \mathsf{Enc}_K\big(P_i \oplus C_{i-1}\big), \qquad i = 1, 2, \dots, n$$
>
> Seguimos la propagación:
>
> | Bloque | Ecuación | ¿Cambia? | Por qué |
> |---|---|---|---|
> | $C_1$ | $\mathsf{Enc}_K(P_1 \oplus \mathrm{IV})$ | **sí, entero** | $P_1$ entra a la primitiva → avalancha: cambia ~la mitad de los bits |
> | $C_2$ | $\mathsf{Enc}_K(P_2 \oplus C_1)$ | **sí, entero** | $P_2$ está bien, pero $C_1$ cambió y **entra a la primitiva** |
> | $C_3$ | $\mathsf{Enc}_K(P_3 \oplus C_2)$ | **sí, entero** | $C_2$ cambió, y otra vez entra a la primitiva |
> | $\vdots$ | | | inducción |
> | $C_n$ | $\mathsf{Enc}_K(P_n \oplus C_{n-1})$ | **sí, entero** | |
>
> **Respuesta: se propaga a TODOS los bloques de cifrado, desde $C_1$ hasta el último.** Es propagación **total**, no acotada. *(Verificado por simulación: con 6 bloques, cambian los 6.)*
>
> El argumento inductivo, en una línea: si $C_{i-1}$ cambió, entonces la entrada de la primitiva en el paso $i$ cambió, y como $\mathsf{Enc}_K$ es una permutación pseudoaleatoria, su salida cambia por completo. Nunca se corta la cadena.
>
> **La consecuencia práctica.** Esto es exactamente por qué `CBC` **no permite cifrado paralelo** ni **reescritura puntual** de un bloque: tocar un byte del plano obliga a recifrar todo lo que viene después. Es la fila "cifrado paralelo: encadenado" de la [[modos-de-encadenamiento#Tabla comparativa|tabla comparativa]]. Si hace falta reescritura puntual, el modo es `CTR`, donde cada bloque es independiente.
>
> ### b) CBC: un bit de error en C_1 afecta a exactamente **2** bloques descifrados
>
> Ahora el error está **en el canal** (sobre el criptograma ya transmitido), no en el plano. Las ecuaciones de descifrado:
>
> $$P_i = \mathsf{Dec}_K(C_i) \oplus C_{i-1}, \qquad C_0 = \mathrm{IV}$$
>
> $C_1$ aparece en **dos** de ellas, y **entra de manera distinta en cada una**. Ese es todo el ejercicio:
>
> | Bloque | Ecuación | Cómo entra $C_1$ | Resultado |
> |---|---|---|---|
> | $P_1$ | $\mathsf{Dec}_K(C_1) \oplus \mathrm{IV}$ | **por la primitiva inversa** | **destruido por completo** — efecto avalancha, ~la mitad de los bits mal |
> | $P_2$ | $\mathsf{Dec}_K(C_2) \oplus C_1$ | **por xor directo** | **exactamente UN bit dado vuelta**, en la misma posición que el error |
> | $P_3$ | $\mathsf{Dec}_K(C_3) \oplus C_2$ | no aparece | **intacto** |
> | $P_4 \dots$ | $\mathsf{Dec}_K(C_i) \oplus C_{i-1}$ | no aparece | **intactos** |
>
> **Respuesta: se propaga a exactamente 2 bloques ($P_1$ y $P_2$), y a partir del tercero el descifrado se recupera solo.** *(Verificado por simulación: bloque 1 con muchos bits mal, bloque 2 con exactamente 1, el resto intacto.)*
>
> Se dice que **`CBC` es autosincronizante ante errores de bit**: el error se contiene y el flujo se recupera sin intervención. Ojo con el alcance: *ante errores de bit*, no ante **pérdida o inserción de bloques** — si se pierde un bloque entero, todo lo que sigue queda desalineado y no se recupera nunca.
>
> **El contraste (a) vs. (b) es el corazón del ejercicio.**
>
> | Dónde ocurre el error | Cómo se propaga |
> |---|---|
> | En el **texto claro**, antes de cifrar (a) | a **todos** los bloques de cifrado |
> | En el **canal**, sobre el cifrado (b) | a **2** bloques descifrados, y se corta |
>
> Es asimétrico y no es casualidad: al cifrar, el bloque modificado atraviesa la primitiva **en cada paso** de la cadena; al descifrar, cada $C_i$ sólo toca dos ecuaciones porque la cadena se recorre "hacia atrás" con un xor que no realimenta.
>
> **Lectura de seguridad, que el enunciado no pide** *(lectura nuestra).* Que un bit de $C_1$ dé vuelta **exactamente** ese bit en $P_2$ no es sólo un dato sobre robustez: es **maleabilidad**. Un atacante activo puede modificar bits elegidos del plano descifrado sin conocer la clave, a cambio de destruir el bloque anterior. Por eso el cifrado por sí solo no da integridad y hace falta un **MAC** o un modo de cifrado autenticado — que es justo el tema de la **Clase 3** (27/08, ver [[cronograma]]).
>
> ### c) CFB de 8 bits: se propaga a 1 + n/s caracteres
>
> En `CFB` con segmentos de $s$ bits, el criptograma **se realimenta a un registro de desplazamiento** de tamaño de bloque $n$. En cada paso: se cifra el registro con $\mathsf{Enc}_K$, se toman los $s$ bits más significativos como keystream, se xorean con el carácter de $s$ bits, y **el carácter cifrado entra al registro por la derecha** mientras se descartan $s$ bits por la izquierda. → [[modos-de-encadenamiento#Los cinco modos|Modos § CFB]]
>
> Acá $s = 8$ bits (un carácter). Un error de un bit en el carácter cifrado $c_j$ tiene **dos efectos separados**:
>
> 1. **Sobre el carácter $j$ mismo:** $p_j = c_j \oplus (\text{keystream}_j)$, y el keystream en ese paso todavía es correcto (el error aún no entró al registro). Entra **por xor directo** → **un solo bit mal** en $p_j$.
> 2. **Sobre los caracteres siguientes:** el carácter erróneo **entra al registro** y se queda adentro durante $n/s$ desplazamientos, hasta que lo empujan afuera. Mientras esté adentro, la entrada de la primitiva es incorrecta → el keystream sale distinto → esos $n/s$ caracteres quedan **destruidos por completo**.
>
> $$\text{caracteres afectados} \;=\; \underbrace{1}_{\text{un bit mal}} \;+\; \underbrace{n/s}_{\text{destruidos}}$$
>
> **La dependencia del tamaño de bloque es explícita y hay que decirla:**
>
> | Primitiva | Tamaño de bloque $n$ | $s$ | Desplazamientos $n/s$ | Caracteres afectados |
> |---|---|---|---|---|
> | *el ejemplo de la cátedra* | 32 bits | 8 | $32/8 = 4$ | $1 + 4 = \mathbf{5}$ |
> | `DES` | 64 bits | 8 | $64/8 = 8$ | $1 + 8 = \mathbf{9}$ |
> | `AES` | 128 bits | 8 | $128/8 = 16$ | $1 + 16 = \mathbf{17}$ |
>
> **Respuesta: con `DES` ($n = 64$), el error se propaga a 9 caracteres** — el primero con un solo bit mal y los 8 siguientes destruidos. A partir del décimo el registro ya se limpió y el descifrado vuelve a ser correcto: **`CFB` también es autosincronizante**.
>
> Si la primitiva fuera `AES` ($n = 128$), serían **17** caracteres. La respuesta **no** es un número absoluto: es $1 + n/s$, y hay que decir con qué $n$ se está trabajando. Un examen que pida "9" está asumiendo `DES` sin decirlo.
>
> **El $n$ que dibuja la cátedra es 32, no 64.** Las cuatro láminas de [`Modo CFB.pdf`](../../raw/practicas/Modo%20CFB.pdf) —material propio de la cátedra, del 24/08— trabajan con $n = 32$ y $s = 8$: las **tres primeras** lo llevan rotulado *"Ejemplo: n = 32; s = 8"*, y la cuarta, la del ejercicio abierto, no lo repite. Con esos parámetros la cuenta da $1 + 32/8 = \mathbf{5}$ caracteres: **es la primera fila de la tabla, y conviene tenerla a mano porque es el número que sale de su propio material.** El recorrido de las láminas está en [[practica-03-seudoaleatoriedad-y-modos|Práctica 3 — Seudoaleatoriedad y modos]].
>
> Esas mismas láminas plantean además **otros dos modos de falla que este ejercicio no pregunta**: bloques que llegan **fuera de orden** (la lámina 3 muestra $c_2, c_1, c_3, c_4, \dots$) y un ejercicio abierto —*"analizar"*— con $c_1$ corrupto. **La cátedra los deja planteados y no los resuelve**; la wiki sí, en [[modos-de-encadenamiento|Modos de encadenamiento § Bloques que llegan fuera de orden]] y en [[practica-03-seudoaleatoriedad-y-modos|Práctica 03 §9]]. Ojo con la diferencia: un bloque **fuera de orden** no es el error de bit de este inciso, y la autosincronización que se afirma más arriba está establecida sólo para el error de bit.

### Ejercicio 7

Considerando el siguiente cifrado de bloque:

$$E(K, M) = (M \cdot K) \bmod 32$$

**a)** ¿Cuál es el **tamaño del bloque**? ¿Cuál es el **espacio efectivo de la clave**?

**b)** **Encriptar** el mensaje $24\ \ 17\ \ 26\ \ 25\ \ 12$ usando modo **`CBC`** con vector de inicialización $\mathrm{IV} = 19$ y $K = 7$.

**c)** **Desencriptar** en modo `CBC`.

> El adjetivo *efectivo* en (a) es el guiño del ejercicio: la clave se elige entre $32$ valores, pero **no todos sirven** — una $E(K, \cdot)$ que no sea invertible rompe la condición de corrección de un [[criptosistema]] y con eso no hay `Dec` posible. Cuáles quedan es justamente lo que hay que contestar. *(Lectura nuestra de por qué el enunciado dice "efectivo"; la guía no lo aclara.)*
>
> Ojo también con el (c): en `CBC` el descifrado usa $E^{-1}$, así que para hacerlo hay que **invertir la multiplicación módulo 32**, no dividir. Ver [[primitiva-de-cifrado-en-bloque|primitiva de cifrado en bloque]] y el diagrama de [[modos-de-encadenamiento#Los cinco modos|CBC]]. La herramienta para invertir es el [[algoritmo-de-euclides-extendido#6. Ejemplo 1: el mcd de 7 y 32|algoritmo de Euclides extendido]] — ahí está corrido paso a paso justo este $\operatorname{mcd}(7,32)$ — y el criterio de cuándo existe el inverso está en [[inverso-modular#Quiénes son los inversibles|inverso modular]], que es también lo que contesta el (a).

> [!nota]- Resolución del Ejercicio 7
> *Cifrado de bloque $E(K, M) = (M \cdot K) \bmod 32$. a) ¿Tamaño de bloque? ¿Espacio efectivo de clave? b) Cifrar el mensaje $24\ \ 17\ \ 26\ \ 25\ \ 12$ en modo `CBC` con $\mathrm{IV} = 19$ y $K = 7$. c) Descifrar.*
>
> ### a) Tamaño de bloque y espacio efectivo de clave
>
> **Tamaño de bloque.** La aritmética es en $\mathbb{Z}_{32}$, y
>
> $$32 = 2^5$$
>
> así que los bloques son los enteros de $0$ a $31$, o sea **bloques de 5 bits**. *(De paso: es un tamaño de juguete. La recomendación de la cátedra es $\ge 128$ bits de bloque — ver [[eleccion-de-primitivas|Elección de primitivas]].)*
>
> **Espacio efectivo de clave.** Para que exista `Dec`, la función $E(K, \cdot)$ tiene que ser **biyectiva** sobre $\mathbb{Z}_{32}$ — es la [[criptosistema|condición de corrección]] del criptosistema. Multiplicar por $K$ es biyectivo en $\mathbb{Z}_{32}$ si y sólo si $K$ es **[[inverso-modular#Quiénes son los inversibles|inversible]]** módulo 32, o sea
>
> $$\operatorname{mcd}(K, 32) = 1 \iff K \text{ es impar}$$
>
> (porque el único primo que divide a $32$ es el $2$). Las claves útiles son entonces
>
> $$\{1, 3, 5, 7, \dots, 31\}, \qquad \text{y hay } \varphi(32) = 32 - 16 = 16 = 2^4 \text{ de ellas}$$
>
> $$\textbf{Espacio efectivo de clave: } 16 \text{ claves} = \mathbf{4 \text{ bits efectivos}}$$
>
> aunque la clave se **escriba** con 5 bits (32 valores posibles). **La mitad del espacio nominal es basura**: con $K$ par la función no es inyectiva y el mensaje no se puede recuperar.
>
> **Matiz que vale la pena señalar** *(lectura nuestra).* $K = 1$ es la **identidad**: $E(1, M) = M$, no cifra nada. Así que en la práctica quedan **15** claves con algún efecto. Es el mismo defecto que tiene la rotación con $k = 0$, y la razón por la que "espacio de clave nominal" y "espacio de clave efectivo" no son lo mismo. `DES` tiene el mismo fenómeno a otra escala: la clave se **escribe** con 64 bits pero sólo **56** son efectivos, porque PC-1 descarta los 8 bits de paridad — ver [[des-y-3des|DES y 3-DES]]. La tabla completa de los 16 inversos módulo 32 está en [[inverso-modular#La tabla completa de inversos|Inverso modular § La tabla completa de inversos]], y sirve para chequear a mano cualquier corrida de Euclides con este módulo.
>
> ### b) Cifrar en modo CBC con IV = 19, K = 7
>
> Las ecuaciones de [[modos-de-encadenamiento|CBC]], con esta primitiva:
>
> $$C_i = \big((P_i \oplus C_{i-1}) \cdot 7\big) \bmod 32, \qquad C_0 = \mathrm{IV} = 19$$
>
> El xor es **bit a bit sobre los 5 bits** del bloque. Va el primer paso desplegado, para fijar la alineación:
>
> $$\begin{array}{rl}
> P_1 = 24 = & \texttt{11000}\\
> C_0 = \mathrm{IV} = 19 = & \texttt{10011}\\ \hline
> P_1 \oplus C_0 = 11 = & \texttt{01011}
> \end{array}$$
>
> y después $11 \cdot 7 = 77 = 2\cdot 32 + 13 \equiv 13 \pmod{32}$, o sea $C_1 = 13$.
>
> La tabla completa, con los xor en binario de 5 bits:
>
> | $i$ | $P_i$ | $P_i$ bin | $C_{i-1}$ | $C_{i-1}$ bin | $P_i \oplus C_{i-1}$ bin | $= X_i$ | $X_i \cdot 7$ | $\bmod 32$ | $C_i$ |
> |---|---|---|---|---|---|---|---|---|---|
> | 1 | 24 | $\texttt{11000}$ | 19 | $\texttt{10011}$ | $\texttt{01011}$ | 11 | 77 | $77 - 2\cdot32 = 13$ | **13** |
> | 2 | 17 | $\texttt{10001}$ | 13 | $\texttt{01101}$ | $\texttt{11100}$ | 28 | 196 | $196 - 6\cdot32 = 4$ | **4** |
> | 3 | 26 | $\texttt{11010}$ | 4 | $\texttt{00100}$ | $\texttt{11110}$ | 30 | 210 | $210 - 6\cdot32 = 18$ | **18** |
> | 4 | 25 | $\texttt{11001}$ | 18 | $\texttt{10010}$ | $\texttt{01011}$ | 11 | 77 | $77 - 2\cdot32 = 13$ | **13** |
> | 5 | 12 | $\texttt{01100}$ | 13 | $\texttt{01101}$ | $\texttt{00001}$ | 1 | 7 | $7$ | **7** |
>
> $$\boxed{C = 13,\ 4,\ 18,\ 13,\ 7}$$
>
> **Detalle lindo para señalar** *(lectura nuestra).* Nótense los bloques 1 y 4: $C_1 = C_4 = 13$ **y sin embargo** $P_1 = 24 \ne 25 = P_4$. Dos bloques de texto claro **distintos** produjeron el **mismo** criptograma, porque el encadenamiento los mezcló con contextos distintos que casualmente colisionaron ($24 \oplus 19 = 11 = 25 \oplus 18$).
>
> Es justo **lo contrario** del problema de [[modos-de-encadenamiento|ECB]], donde bloques iguales dan siempre criptogramas iguales y el patrón del plano sobrevive. Acá la correspondencia bloque-a-bloque está rota en las dos direcciones: eso es lo que aporta el encadenamiento.
>
> Cuidado con leerlo de más: que **acá** colisionen es una casualidad de estos números y de un bloque de 5 bits ridículamente chico. Con bloques de 128 bits las colisiones son astronómicamente raras (y cuando aparecen, son un problema de seguridad, no una virtud — es el límite del *birthday bound*).
>
> ### c) Descifrar en modo CBC
>
> Para invertir la primitiva hace falta $K^{-1} \bmod 32$, o sea el entero $x$ con $7x \equiv 1 \pmod{32}$.
>
> **Con el algoritmo de Euclides extendido:**
>
> $$\begin{aligned}
> 32 &= 4\cdot 7 + 4\\
> 7 &= 1\cdot 4 + 3\\
> 4 &= 1\cdot 3 + 1\\
> 3 &= 3\cdot 1 + 0 \quad \Rightarrow\ \operatorname{mcd}(7,32) = 1 \ \text{(existe el inverso)}
> \end{aligned}$$
>
> Sustituyendo hacia atrás:
>
> $$1 = 4 - 3 = 4 - (7 - 4) = 2\cdot 4 - 7 = 2\,(32 - 4\cdot 7) - 7 = 2\cdot 32 - 9\cdot 7$$
>
> Luego $-9\cdot 7 \equiv 1 \pmod{32}$, y
>
> $$K^{-1} = -9 \bmod 32 = \boxed{23}$$
>
> *Verificación directa:* $7 \cdot 23 = 161 = 5\cdot 32 + 1 \equiv 1 \pmod{32}$. **Correcto.**
>
> **Dónde está esta cuenta desarrollada.** La corrida completa de Euclides extendido sobre $\operatorname{mcd}(7,32)$ —con las **dos formas**, la sustitución hacia atrás y la tabla de coeficientes, y el chequeo del último renglón— está en [[algoritmo-de-euclides-extendido#6. Ejemplo 1: el mcd de 7 y 32|Algoritmo de Euclides extendido § 6]]: es exactamente este ejemplo. Ahí se explica también por qué $2\cdot 32 - 9\cdot 7 = 1$ y $23\cdot 7 - 5\cdot 32 = 1$ son **la misma identidad de Bézout** escrita con otro representante, que es el paso que acá se resuelve de un saque con $-9 \bmod 32 = 23$.
>
> El criterio de **por qué** existe el inverso (y por qué sólo para las $K$ impares, que es el inciso (a)) está en [[inverso-modular#Quiénes son los inversibles|Inverso modular]]; las definiciones de base —divisibilidad, mcd, congruencia módulo $m$— en [[aritmetica-modular-y-divisibilidad|Aritmética modular y divisibilidad]]. El manuscrito de la cátedra que encarga el tema está recorrido en [[teoria-de-numeros|Teoría de números]]: **no trae ningún número concreto** y manda justamente a este Ej. 7c como su ejemplo numérico.
>
> **Las ecuaciones de descifrado** de `CBC` con esta primitiva:
>
> $$P_i = \big((C_i \cdot 23) \bmod 32\big) \oplus C_{i-1}, \qquad C_0 = \mathrm{IV} = 19$$
>
> | $i$ | $C_i$ | $C_i \cdot 23$ | $\bmod 32$ | $= Y_i$ bin | $C_{i-1}$ bin | $Y_i \oplus C_{i-1}$ bin | $P_i$ |
> |---|---|---|---|---|---|---|---|
> | 1 | 13 | 299 | $299 - 9\cdot32 = 11$ | $\texttt{01011}$ | $\texttt{10011}$ (19) | $\texttt{11000}$ | **24** |
> | 2 | 4 | 92 | $92 - 2\cdot32 = 28$ | $\texttt{11100}$ | $\texttt{01101}$ (13) | $\texttt{10001}$ | **17** |
> | 3 | 18 | 414 | $414 - 12\cdot32 = 30$ | $\texttt{11110}$ | $\texttt{00100}$ (4) | $\texttt{11010}$ | **26** |
> | 4 | 13 | 299 | $11$ | $\texttt{01011}$ | $\texttt{10010}$ (18) | $\texttt{11001}$ | **25** |
> | 5 | 7 | 161 | $161 - 5\cdot32 = 1$ | $\texttt{00001}$ | $\texttt{01101}$ (13) | $\texttt{01100}$ | **12** |
>
> $$\boxed{P = 24,\ 17,\ 26,\ 25,\ 12}$$
>
> Que es el mensaje original: **la corrección se verifica**. Notar que el descifrado **sí es paralelizable** —cada $P_i$ depende sólo de $C_i$ y $C_{i-1}$, que ya están todos disponibles—, a diferencia del cifrado del inciso (b), que es estrictamente secuencial. Es la asimetría de la [[modos-de-encadenamiento#Tabla comparativa|tabla comparativa de modos]], verificada a mano.

### Ejercicio 8

Una **clave débil** para **DES** es una clave $K$ tal que

$$E_k\big(E_k(x)\big) = x, \qquad \forall x$$

Analizar **por qué** una clave formada por **todos sus bits en 0**, o **todos sus bits en 1**, es una clave débil de DES. ¿Cuáles serían **otras dos** claves débiles?

> La pista está en la estructura: DES genera **16 subclaves** a partir de $K$, y en una [[des-y-3des#Estructura: red de Feistel|red de Feistel]] descifrar es **el mismo circuito con las subclaves en orden inverso**. Si las 16 subclaves salen todas iguales, cifrar dos veces es cifrar y descifrar. El detalle de la [[des-y-3des#Generación de subclaves|generación de subclaves]] está en la nota de DES. *(La conexión con Feistel es lectura nuestra; el enunciado sólo da la definición.)*

> [!nota]- Resolución del Ejercicio 8
> *Una clave débil de DES es una $K$ tal que $E_K(E_K(x)) = x$ para todo $x$. Analizar por qué una clave con todos sus bits en 0, o todos en 1, es débil. ¿Cuáles serían otras dos claves débiles?*
>
> **Reformulación de la definición:** $K$ es débil si $\mathsf{Enc}_K$ es una **involución** ($\mathsf{Enc}_K = \mathsf{Enc}_K^{-1}$), o sea si **cifrar es lo mismo que descifrar**. Aplicar el cifrado dos veces devuelve el original.
>
> ### Por qué pasa: dos piezas que encajan
>
> #### Pieza 1 — La red de Feistel se invierte dando vuelta las subclaves
>
> En una [[des-y-3des#Estructura: red de Feistel|red de Feistel]], **descifrar es correr el mismo circuito con las subclaves en orden inverso**:
>
> $$\mathsf{Enc}_K \ \text{usa} \ K_1, K_2, \dots, K_{16} \qquad\qquad \mathsf{Dec}_K \ \text{usa} \ K_{16}, K_{15}, \dots, K_1$$
>
> Eso es una propiedad estructural de Feistel, no una particularidad de DES, y es lo que permite que cifrar y descifrar compartan el hardware.
>
> #### Pieza 2 — El key schedule puede producir 16 subclaves idénticas
>
> La [[des-y-3des#Generación de subclaves|generación de subclaves de DES]] funciona así:
>
> $$\begin{aligned}
> &\text{PC-1: de los 64 bits de } K \text{ selecciona 56 y los parte en dos mitades de 28: } C_0 \text{ y } D_0\\
> &\text{Ronda } i: \ C_i = C_{i-1} \lll r_i, \qquad D_i = D_{i-1} \lll r_i \quad \text{(rotación circular a izquierda)}\\
> &\text{PC-2: } K_i = \text{PC-2}(C_i \Vert D_i), \ \text{tomando 24 bits de cada mitad} \rightarrow \text{subclave de 48 bits}
> \end{aligned}$$
>
> **La observación clave:** una cadena queda fija bajo la rotación de **un bit** —y por lo tanto bajo **todas** las del calendario— si y sólo si es **constante**, todos ceros o todos unos.
>
> - ($\Leftarrow$) Si $C_0 = 0^{28}$ entonces $C_0 \lll r = 0^{28}$ para todo $r$; ídem con $1^{28}$.
> - ($\Rightarrow$) Acá entra el calendario: DES **arranca con $r_1 = 1$**. Pedir $C_0 \lll 1 = C_0$ es pedir que cada bit sea igual a su vecino, y eso obliga a la cadena constante.
>
> **El "sólo si" vale para la rotación de 1, no para una rotación cualquiera** *(precisión nuestra).* Una cadena de 28 bits queda fija bajo $\lll r$ cuando su período divide a $\operatorname{mcd}(r, 28)$, así que con $r = 2$ hay cadenas **no constantes** que también quedan fijas: $(01)^{14}$ rotada dos lugares es ella misma. Y no es un caso de laboratorio — el [[des-descripcion-del-algoritmo|calendario de DES]] usa $r_i = 2$ en **12 de las 16 rondas** (las de 1 bit son sólo las rondas 1, 2, 9 y 16). Lo que fuerza la constancia es **la ronda 1**. Enunciado para "una rotación circular" a secas, el lema es falso, y las cadenas de período 2 que se cuelan por esa grieta son justamente de donde salen las **claves semi-débiles** de más abajo.
>
> Entonces, si $C_0$ y $D_0$ son **cada una** constante:
>
> $$C_i = C_0 \quad\text{y}\quad D_i = D_0 \quad \text{para toda ronda } i$$
>
> y como PC-2 es una función fija que sólo depende de $(C_i, D_i)$:
>
> $$K_1 = K_2 = \dots = K_{16}$$
>
> **Las 16 subclaves salen idénticas.**
>
> #### Las dos piezas juntas
>
> Si todas las subclaves son iguales, la secuencia invertida $K_{16}, \dots, K_1$ es **la misma** que la secuencia directa $K_1, \dots, K_{16}$. Por la Pieza 1, eso significa
>
> $$\mathsf{Enc}_K = \mathsf{Dec}_K \qquad\Longrightarrow\qquad \mathsf{Enc}_K(\mathsf{Enc}_K(x)) = \mathsf{Dec}_K(\mathsf{Enc}_K(x)) = x \quad \forall x$$
>
> que es exactamente la definición de clave débil. $\blacksquare$
>
> **Por qué la clave de todos ceros y la de todos unos califican:** si los 64 bits son 0, los 56 que sobreviven a PC-1 también son 0, y las dos mitades quedan $C_0 = D_0 = 0^{28}$ — constantes. Ídem con todos unos: $C_0 = D_0 = 1^{28}$.
>
> ### Los bits de paridad
>
> DES usa **56 bits reales**; el bit 8 de cada byte es de **paridad** y PC-1 lo descarta. Por eso las claves débiles se suelen escribir con la paridad ya puesta:
>
> - la clave "todos 0" se escribe `0101010101010101` (paridad impar en cada byte)
> - la "todos 1" se escribe `FEFEFEFEFEFEFEFE`
>
> Pero `0000000000000000` y `FFFFFFFFFFFFFFFF` **también son débiles**, porque lo único que importa son los 56 bits que sobreviven a PC-1: los bits de paridad no entran nunca al key schedule. Es una distinción de implementación (qué acepta la librería), no de criptografía.
>
> ### Las cuatro claves débiles
>
> Como sólo hay **dos** valores constantes posibles para cada mitad de 28 bits, hay $2 \times 2 = 4$ combinaciones, y por lo tanto **exactamente 4 claves débiles**:
>
> | $C_0$ | $D_0$ | Clave en hexadecimal (con bits de paridad) |
> |---|---|---|
> | $0^{28}$ | $0^{28}$ | `0101 0101 0101 0101` |
> | $1^{28}$ | $1^{28}$ | `FEFE FEFE FEFE FEFE` |
> | $0^{28}$ | $1^{28}$ | `1F1F 1F1F 0E0E 0E0E` |
> | $1^{28}$ | $0^{28}$ | `E0E0 E0E0 F1F1 F1F1` |
>
> **Las "otras dos" que pide el enunciado son las mixtas:**
>
> $$\texttt{1F1F1F1F0E0E0E0E} \qquad\text{y}\qquad \texttt{E0E0E0E0F1F1F1F1}$$
>
> **Por qué justo esos bytes.** La lectura tentadora —que la primera mitad de la clave alimenta a $C_0$ y la segunda a $D_0$— es **falsa**, y conviene desarmarla porque lo que pasa de verdad explica el hexadecimal. PC-1 no parte la clave por la mitad: **parte cada byte**. Numerando los bits de cada byte del 1 (el más significativo) al 8 (el menos), el reparto es:
>
> | Bit dentro del byte | Adónde va |
> |---|---|
> | 1, 2, 3 | a $C_0$, en los **ocho** bytes |
> | 4 | a $D_0$ si el byte es el 1, 2, 3 o 4; a $C_0$ si es el 5, 6, 7 u 8 |
> | 5, 6, 7 | a $D_0$, en los **ocho** bytes |
> | 8 | a ningún lado: es el bit de **paridad** |
>
> O sea: **los bits altos de cada byte arman $C_0$ y los bajos arman $D_0$**, con un solo bit —el 4— que cambia de bando a mitad de la clave. Los ocho bytes alimentan a **las dos** mitades del key schedule: los bytes 1 a 4 ponen 12 bits en $C_0$ y 16 en $D_0$, y los bytes 5 a 8 al revés *(verificado corriendo la tabla PC-1)*. No hay ninguna partición por mitades de la clave.
>
> Con eso el hexadecimal se lee solo. La tercera fila pide $C_0 = 0^{28}$ y $D_0 = 1^{28}$, o sea **bits altos en cero y bits bajos en uno** en los ocho bytes:
>
> $$\texttt{1F} = \texttt{0001\ 1111} \qquad\qquad \texttt{0E} = \texttt{0000\ 1110}$$
>
> Los dos bytes tienen los bits 1, 2 y 3 en cero y los bits 5, 6 y 7 en uno. **Difieren justo en el bit 4**, que es el que cambia de destino: en los bytes 1 a 4 ese bit cae en $D_0$ y tiene que valer 1, y eso da `1F`; en los bytes 5 a 8 cae en $C_0$ y tiene que valer 0, y eso da `0E`. Por eso la clave es `1F` cuatro veces seguida de `0E` cuatro veces y no un byte repetido ocho veces: **el patrón se quiebra exactamente donde PC-1 le cambia el bando al bit 4**. Los dos bytes difieren también en el bit 8, pero eso es sólo la paridad acomodándose —`1F` tiene cinco unos y `0E` tres, los dos impares— y ese bit no entra nunca al key schedule.
>
> La cuarta fila es la misma construcción con los papeles cambiados: altos en uno y bajos en cero, o sea `E0` $= \texttt{1110\ 0000}$ en los primeros cuatro bytes y `F1` $= \texttt{1111\ 0001}$ en los últimos.
>
> ### Impacto real
>
> **Prácticamente ninguno, y eso también hay que decirlo.** Cuatro claves sobre $2^{56}$ es una probabilidad de
>
> $$\frac{4}{2^{56}} = 2^{-54} \approx 5{,}6\times10^{-17}$$
>
> de sortear una por accidente con un generador decente. Las claves débiles **no rompen DES**.
>
> **Lo que sí rompió a DES fue el tamaño de la clave**: $2^{56}$ es un espacio alcanzable por [[ataque-de-fuerza-bruta|fuerza bruta]] con hardware dedicado, y por eso el vault lo clasifica como [[estado-de-un-criptosistema|quebrado]]. El criptoanálisis **diferencial** (1990) y el **lineal** (1992) de la [[des-y-3des#Evolución: cómo se erosionó|tabla de evolución]] son ataques teóricamente más baratos que la fuerza bruta, pero **su costo se mide en textos, no en clave**: exigen $2^{47}$ textos planos **elegidos** y $2^{43}$ textos planos **conocidos** respectivamente.
>
> **Cuidado con leer esos dos números como un espacio de clave achicado.** El espacio de clave de DES es $2^{56}$ en los tres renglones con número de esa tabla: ni el diferencial ni el lineal lo reducen. Lo que baja es el **costo del ataque** —así se llama la columna, justamente— y baja en una moneda distinta: pares plano/cifrado bajo la **misma** clave. Por eso en la práctica ninguno de los dos fue nunca viable, porque nadie consigue $2^{47}$ pares elegidos.
>
> *(Agregado nuestro: la filmina da la tabla de costos y no dice cuál de las tres vías se usó realmente. La que se usó fue la primera — la demostración pública fue el **Deep Crack** de la EFF, en 1998: una máquina dedicada que barrió el espacio de $2^{56}$ en cuestión de días.)*
>
> El problema real es otro: **un generador de claves mal hecho**. Un buffer sin inicializar da todo ceros, y todo ceros **es** una clave débil. Por eso las implementaciones serias chequean y descartan explícitamente estas 4 claves antes de usarlas. Es un caso de manual del *"no inventes criptografía"* de [[eleccion-de-primitivas|Elección de primitivas]]: el algoritmo está bien, lo que falla es el `Gen`.
>
> **Las semi-débiles: el enunciado no las pide, pero la cátedra sí las nombra.** No en las filminas de la Clase 02, sino en el esquema de la [Práctica 3](../../raw/practicas/Clase%203.pdf) del 24/08, que las define así: *"Claves Semidébiles: (vienen de a pares) $E_{k_x}(E_{k_y}(m)) = m$ — en lugar de generar 16 subclaves distintas, generan 2 o 4"*. La misma lámina caracteriza las **débiles** con el mismo criterio: *"en lugar de generar 16 subclaves distintas, generan 1"* — que es exactamente lo que demuestra la Pieza 2 de arriba.
>
> **Esa caracterización por cantidad de subclaves distintas es la que conviene llevarse:** 1 subclave ⟹ débil; 2 o 4 ⟹ semi-débil. El mecanismo es el mismo un escalón más arriba — mitades de **período 2** bajo rotación en lugar de período 1, que son las que la rotación de 2 bits deja fijas (ver el recuadro de la Pieza 2). *(Que sean **6 pares** es agregado nuestro: la lámina da la definición y el conteo de subclaves, no el número de pares.)*

---

> [!nota]- Qué se lleva al parcial
> Las cuatro ideas transferibles de la guía, que valen mucho más que los números puntuales:
>
> **1. $\lvert\mathcal{K}\rvert \ge \lvert\mathcal{M}\rvert$ es necesario pero nunca suficiente — y esta guía lo muestra dos veces.**
> En el Ejercicio 1, $3 \ge 2$ y no hay secreto perfecto. En el Ejercicio 4, $18.278 \ge 17.576$ y tampoco. En los dos casos el conteo **se cumple** y no salva nada, porque el conteo no ve la **estructura de `Enc`**. Corolario operativo: el teorema de Shannon sirve para **refutar** cuando la cota se viola, jamás para **probar** cuando se cumple. Si en el parcial la cota se cumple, hay que ir a los criterios distribucionales o al juego `Eav`. Y en el otro sentido (Ejercicio 3), el secreto perfecto siempre aparece con la **cota saturada**: $26 = 26$, $26! = 26!$, $26^t = 26^t$.
>
> **2. El secreto perfecto preserva la distribución a priori; no la iguala.**
> Es el Ejercicio 2 entero. $\Pr[M{=}m \mid C{=}c] = \Pr[M{=}m]$ dice que el criptograma **no cambia** las creencias del adversario, no que las vuelva uniformes. Y de las tres caracterizaciones equivalentes, la más cómoda para trabajar es la que **no menciona $\Pr[M]$**:
> $$\Pr[\mathsf{Enc}_K(m) = c] = \Pr[\mathsf{Enc}_K(m') = c] \quad \forall m, m', c$$
> porque el secreto perfecto cuantifica sobre *toda* distribución de mensajes, y este criterio te evita tener que pensarlo. Regla práctica: para **probar** secreto perfecto, conviene usar esta; para **refutar**, alcanza con exhibir un solo par $(m, c)$ que falle, o directamente construir el adversario.
>
> **3. Lo que filtra es siempre el patrón de repeticiones, y aparece disfrazado en todos lados.**
> $\texttt{aa}$ no puede cifrarse en dos símbolos distintos bajo sustitución (Ej. 3b); Vigenère con período 1 preserva la igualdad posicional y entrega el juego (Ej. 4b); la rotación con $\ell \ge 2$ cae por lo mismo; `ECB` está prohibido por lo mismo; el [[criptoanalisis-por-frecuencias|criptoanálisis por frecuencias]] vive de lo mismo. Es **una sola fuga con cinco caras**. Y la contracara constructiva: los cifrados clásicos alcanzan el secreto perfecto justo cuando $\mathcal{M}$ se recorta para que ese patrón no distinga nada — los anagramas del Ej. 3b son el ejemplo elegante.
>
> **4. Los modos de encadenamiento no se memorizan: se leen de sus ecuaciones.**
> Los Ejercicios 6 y 7 son la misma técnica aplicada dos veces. Escribir $C_i = \mathsf{Enc}_K(P_i \oplus C_{i-1})$ o $P_i = \mathsf{Dec}_K(C_i) \oplus C_{i-1}$, preguntarse **en qué ecuaciones aparece el bloque que cambió**, y distinguir si entra **por la primitiva** (bloque destruido, avalancha) o **por un xor directo** (un bit dado vuelta, en la misma posición). De ahí salen los tres incisos del Ej. 6 sin recordar ningún número, y de ahí sale también por qué `CBC` cifra secuencial pero descifra en paralelo. Bonus del Ej. 6c: la respuesta $1 + n/s$ **depende del tamaño de bloque** — conviene no responder "9" sin aclarar que se asume `DES`, y tener presente que el material de `CFB` de la cátedra trabaja con $n = 32$ y $s = 8$, o sea **5**.
