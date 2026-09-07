---
title: Probabilidad y criptografía
resumen: 'Apunte de cátedra que arma el marco probabilístico de un criptosistema —mensajes, claves y cifrados como variables aleatorias— y lo aplica a dos ejemplos numéricos completos, uno con secreto perfecto y otro sin él.'
fuentes: ["[[clase-02-cifrado]]"]
aliases: [Probabilidad y criptografía, Probabilidad y criptografia, Ejemplos de secreto perfecto]
type: apunte
clase: 1
orden: 30
created: 2026-08-11
updated: 2026-09-04
tags: [apunte, probabilidad, secreto-perfecto, bayes, criptosistema, shannon]
sources: ["probabilidad y criptografia.pdf", "raw/clases/Clase 02pt2-Transcripcion.VTT"]
---

# Probabilidad y criptografía

> **Fuente:** [`probabilidad y criptografia.pdf`](../../raw/apuntes/probabilidad%20y%20criptografia.pdf) (3 páginas) · material de cátedra, preparado por **Ana** · Concepto atómico: [[modelo-probabilistico-de-un-criptosistema|Modelo probabilístico de un criptosistema]] · Definición: [[secreto-perfecto|Secreto perfecto]]

Esta nota trae **las cuentas hechas**: el apunte arma el marco probabilístico mínimo (tres espacios, tres fórmulas) y después lo aplica a dos ejemplos numéricos completos, uno con secreto perfecto y otro sin. Las definiciones generales viven en la [[modelo-probabilistico-de-un-criptosistema|nota de concepto]]; acá está el desarrollo de punta a punta de los dos ejemplos, que es lo propio de esta fuente.

> **No es un apunte huérfano: lo sube la cátedra y lo preparó Ana.** Al abrir el 20/08 —la segunda fecha de la [[clase-02-cifrado|Clase 02]]— el docente insiste en que *"es muy importante el tema de probabilidad [y] estadística"* y ahí mismo lo presenta: *"les subimos un apunte buenísimo [de] Ana, que está disponible"* (cue pt2 26). Al final de esa misma clase vuelve a nombrarlo al recorrer el campus en pantalla, entre los apuntes: *"ejemplos de probabilidad, temas de probabilidad y estadística que los van a necesitar para todo lo que tiene que ver con las pruebas de secreto perfecto, para los experimentos"* (cue pt2 522). Y el PDF lo corrobora por su cuenta: sus metadatos declaran `Author: Ana` y `Title: Microsoft Word - PROBABILIDAD Y CRIPTOGRAFÍA.doc`.
>
> **De este apunte, las fuentes dan el nombre de pila y nada más.** Que esa Ana sea la **Lic. Ana María Arias Roig** —del [[reglamento-y-evaluacion#Equipo docente|equipo docente]], autora del apunte de [[cuerpos-finitos|Cuerpos finitos]] y de las filminas de la [[practica-03-seudoaleatoriedad-y-modos|Práctica 03]]— es **lectura nuestra**: ni la transcripción ni este PDF traen el apellido. Lo que la sostiene, y no es inferencia, es que el docente pone los dos apuntes en la misma mano: el cue siguiente presenta el de cuerpos finitos como *"un apunte **también** que preparaba Ana"* (cue pt2 27), y **ése** sí lleva el nombre completo —*"Lic Ana María Arias Roig"* en su primera página, `Author: Ana Arias Roig` en los metadatos—.

> [!quote]- De la transcripción — la cátedra presenta el apunte al abrir el 20/08 (cues pt2 26-27)
> *"Algo importante: ya vimos que es muy importante el tema de probabilidad [y] estadística. Por eso ahora les voy a mostrar (…) **les subimos un apunte buenísimo [de] Ana**, que está disponible (…) para que les den una idea. Éstas son todas cosas que ustedes ya vieron, pero bueno, hay que repasarlas."*
>
> *"Eso está bueno que lo vean después. Subimos varios links de videos y vamos a ver algunos apuntes más. Y hay un apunte **también que preparaba Ana**, muy bueno, que explica lo que es un cuerpo finito."*
>
> *(El primer pasaje es de los más degradados del ASR —imprime "hay le subimos un apunte buenísimo ana que está disponible en en ahora para quien le den un una una idea"—, así que lo citado es lo legible y los corchetes marcan lo que completamos. El apellido no aparece en ningún cue.)*

---

## 1. Marco

Un [[criptosistema]] se mira como **tres variables aleatorias** sobre tres espacios:

| Espacio | Símbolo | Distribución | Qué modela |
|---|---|---|---|
| Mensajes | $\mathcal{M}$ | $\Pr[M = x]$ | qué tan probable es que se emita el mensaje $x$ |
| Claves | $\mathcal{K}$ | $\Pr[K = k]$ | qué tan probable es que `Gen()` sortee la clave $k$ |
| Cifrados | $\mathcal{C} = \{\mathsf{Enc}_k(x) \;/\; x \in \mathcal{M} \wedge k \in \mathcal{K}\}$ | $\Pr[C = y]$ | **derivada** de las dos anteriores |

Notar que $\mathcal{C}$ no trae distribución propia: se define como la **imagen** de `Enc` y su distribución sale de $M$ y $K$.

### La hipótesis de independencia

> *"Las claves se eligen independientemente de los mensajes planos, por lo que:"*
> $$\Pr[M = x,\, K = k] \;=\; \Pr[M = x] \cdot \Pr[K = k]$$

Esto **no es un teorema, es una hipótesis de modelado**: `Gen()` sortea la clave *sin mirar el mensaje*. Todo lo que sigue descansa sobre esa factorización — el porqué está desarrollado en la [[modelo-probabilistico-de-un-criptosistema|nota de concepto]].

### Las tres fórmulas (referencia rápida)

El apunte las deriva en LaTeX antes de los ejemplos. Acá van sólo los nombres, porque el desarrollo vive en [[modelo-probabilistico-de-un-criptosistema|Modelo probabilístico de un criptosistema]]:

| Fórmula | Qué calcula |
|---|---|
| **(a)** marginal, $\Pr[C = y]$ | qué tan probable es ver el cifrado $y$, sumando sobre las claves que pueden producirlo |
| **(b)** condicional, $\Pr[C = y \mid M = x]$ | la masa de claves que llevan $x$ a $y$ — es la que se compara contra (a) en el **criterio del cifrado** |
| **(c)** a posteriori, $\Pr[M = x \mid C = y]$ | (a) y (b) enchufadas en Bayes: lo que el adversario cree del mensaje tras ver $y$ — es la del **criterio del mensaje** |

> **En cada ejemplo el apunte chequea los dos criterios por separado:** $\Pr[C{=}y \mid M{=}x] = \Pr[C{=}y]$ (la caracterización equivalente) y $\Pr[M{=}x \mid C{=}y] = \Pr[M{=}x]$ (la [[secreto-perfecto|definición de secreto perfecto]]). Son equivalentes, así que dan siempre el mismo veredicto — los calcula por separado justamente para que se vea.

---

## 2. Ejemplo 1 — sí hay secreto perfecto

$$\mathcal{M} = \{a, b\},\quad \Pr[M{=}a] = \Pr[M{=}b] = 0{,}5$$
$$\mathcal{K} = \{k_1, k_2\},\quad \Pr[K{=}k_1] = \Pr[K{=}k_2] = 0{,}5$$
$$\mathcal{C} = \{c, d\}$$

Tabla de `Enc`:

| `Enc` | $a$ | $b$ |
|---|---|---|
| $k_1$ | $c$ | $d$ |
| $k_2$ | $d$ | $c$ |

### Distribución del cifrado

$$\Pr[C{=}c] = \Pr[K{=}k_1]\Pr[M{=}a] + \Pr[K{=}k_2]\Pr[M{=}b] = 0{,}5\cdot 0{,}5 + 0{,}5\cdot 0{,}5 = 0{,}5$$
$$\Pr[C{=}d] = \Pr[K{=}k_1]\Pr[M{=}b] + \Pr[K{=}k_2]\Pr[M{=}a] = 0{,}5\cdot 0{,}5 + 0{,}5\cdot 0{,}5 = 0{,}5$$

### Criterio del cifrado

Cada casilla tiene **una sola** clave que la realiza, así que la suma de (b) tiene un único término:

$$\Pr[C{=}c \mid M{=}a] = \Pr[K{=}k_1] = 0{,}5 \qquad \Pr[C{=}c \mid M{=}b] = \Pr[K{=}k_2] = 0{,}5$$
$$\Pr[C{=}d \mid M{=}a] = \Pr[K{=}k_2] = 0{,}5 \qquad \Pr[C{=}d \mid M{=}b] = \Pr[K{=}k_1] = 0{,}5$$

| $\Pr[C{=}y \mid M{=}x]$ | $y = c$ | $y = d$ |
|---|---|---|
| $x = a$ | 0,5 | 0,5 |
| $x = b$ | 0,5 | 0,5 |
| **$\Pr[C{=}y]$** | **0,5** | **0,5** |

Las dos filas son idénticas entre sí **y** idénticas a la marginal: se cumple $\Pr[C{=}y\mid M{=}x] = \Pr[C{=}y]\ \forall y\,\forall x$ → **hay secreto perfecto**.

### Criterio del mensaje (Bayes)

$$\Pr[M{=}a \mid C{=}c] = \frac{\Pr[M{=}a]\Pr[K{=}k_1]}{\Pr[C{=}c]} = \frac{0{,}5 \cdot 0{,}5}{0{,}5} = 0{,}5$$
$$\Pr[M{=}a \mid C{=}d] = \frac{\Pr[M{=}a]\Pr[K{=}k_2]}{\Pr[C{=}d]} = \frac{0{,}5 \cdot 0{,}5}{0{,}5} = 0{,}5$$
$$\Pr[M{=}b \mid C{=}c] = \frac{\Pr[M{=}b]\Pr[K{=}k_2]}{\Pr[C{=}c]} = \frac{0{,}5 \cdot 0{,}5}{0{,}5} = 0{,}5$$
$$\Pr[M{=}b \mid C{=}d] = \frac{\Pr[M{=}b]\Pr[K{=}k_1]}{\Pr[C{=}d]} = \frac{0{,}5 \cdot 0{,}5}{0{,}5} = 0{,}5$$

A posteriori = a priori = 0,5 en los cuatro casos: se cumple $\Pr[M{=}x\mid C{=}y] = \Pr[M{=}x]\ \forall y\,\forall x$ → **hay secreto perfecto**. Ver el criptograma no le cambió al adversario ni un bit de lo que creía.

> **Ojo con el alcance de este chequeo.** El apunte verifica los dos criterios con **una sola** distribución de mensajes ($\Pr[M]$ uniforme), pero la [[secreto-perfecto|definición de secreto perfecto]] cuantifica sobre **toda** distribución de $\mathcal{M}$: un $\Pr[M]$ particular no certifica nada. Lo que cierra el caso libre de distribución es el argumento del cuadrado latino de acá abajo — $\Pr[C{=}y\mid M{=}x] = 1/\lvert\mathcal{K}\rvert$ **independiente de $x$**, donde $\Pr[M]$ ni aparece. *(En el Ejemplo 2 no hace falta este cuidado: para **refutar** un $\forall$ alcanza con exhibir una distribución que falle.)*

### Por qué funciona: es un cuadrado latino

> **Lectura mía, no del apunte** — el PDF muestra la tabla y las cuentas, no la nombra ni la explica así.

La tabla de `Enc` no tiene repetidos **ni en filas ni en columnas** — es un **cuadrado latino** de orden 2:

- **Sin repetidos en la fila $k_i$** ⇒ $\mathsf{Enc}_{k_i}$ es inyectiva ⇒ el sistema es *correcto* (se puede descifrar). Esto es sólo la condición de corrección.
- **Sin repetidos en la columna $x$, y cubriendo todo $\mathcal{C}$** ⇒ desde cada mensaje se llega a **todos** los cifrados, cada uno con **exactamente una** clave. Con claves uniformes, eso fuerza $\Pr[C{=}y\mid M{=}x] = 1/\lvert\mathcal{K}\rvert$ **independiente de $x$**: secreto perfecto.

Es literalmente el mismo argumento que el caso $\ell = 1$ del [[cifrado-por-rotacion|cifrado por rotación]] analizado en [[secreto-perfecto|secreto perfecto]]: ahí "existe exactamente una clave $k = (c - m) \bmod n$ que lleva $m$ a $c$", acá "hay exactamente un $k_i$ por casilla". Cuadrado latino + clave uniforme ⇒ **secreto perfecto**; el [[secreto-perfecto|one-time pad]] es el caso concreto de esa receta sobre el grupo $(\mathbb{Z}_n, +)$.

> **Observación:** el Ejemplo 1 *es* la rotación con $n = 2$ y $\ell = 1$. Identificando $a, c \mapsto 0$ y $b, d \mapsto 1$, la tabla queda $k_1 = {+}0$ y $k_2 = {+}1$ en $(\mathbb{Z}_2, +)$. Es el mismo objeto con otros nombres.

---

## 3. Ejemplo 2 — no hay secreto perfecto

$$\mathcal{M} = \{a, b\},\quad \Pr[M{=}a] = 0{,}25;\ \ \Pr[M{=}b] = 0{,}75$$
$$\mathcal{K} = \{k_1, k_2, k_3\},\quad \Pr[K{=}k_1] = 0{,}5;\ \ \Pr[K{=}k_2] = \Pr[K{=}k_3] = 0{,}25$$
$$\mathcal{C} = \{1, 2, 3, 4\}$$

Tabla de `Enc`:

| `Enc` | $a$ | $b$ |
|---|---|---|
| $k_1$ | 1 | 2 |
| $k_2$ | 2 | 3 |
| $k_3$ | 3 | 4 |

Tres cosas cambiaron respecto del Ejemplo 1: la distribución de mensajes **no es uniforme**, la de claves **tampoco**, y la tabla **ya no es un cuadrado** ($3 \times 2$ sobre 4 símbolos).

### Distribución del cifrado

$$\Pr[C{=}1] = \Pr[K{=}k_1]\Pr[M{=}a] = \tfrac12 \cdot \tfrac14 = \tfrac18$$
$$\Pr[C{=}2] = \Pr[K{=}k_1]\Pr[M{=}b] + \Pr[K{=}k_2]\Pr[M{=}a] = \tfrac12\cdot\tfrac34 + \tfrac14\cdot\tfrac14 = \tfrac{6}{16} + \tfrac{1}{16} = \tfrac{7}{16}$$
$$\Pr[C{=}3] = \Pr[K{=}k_2]\Pr[M{=}b] + \Pr[K{=}k_3]\Pr[M{=}a] = \tfrac14\cdot\tfrac34 + \tfrac14\cdot\tfrac14 = \tfrac{3}{16} + \tfrac{1}{16} = \tfrac14$$
$$\Pr[C{=}4] = \Pr[K{=}k_3]\Pr[M{=}b] = \tfrac14 \cdot \tfrac34 = \tfrac{3}{16}$$

*Control:* $\tfrac{2}{16} + \tfrac{7}{16} + \tfrac{4}{16} + \tfrac{3}{16} = 1$.

$C{=}1$ y $C{=}4$ tienen **un solo término**: hay una sola combinación (clave, mensaje) que los produce. Ese es el germen del problema.

### Criterio del cifrado

$$\Pr[C{=}1\mid M{=}a] = \Pr[K{=}k_1] = \tfrac12 \qquad \Pr[C{=}1\mid M{=}b] = 0$$
$$\Pr[C{=}2\mid M{=}a] = \Pr[K{=}k_2] = \tfrac14 \qquad \Pr[C{=}2\mid M{=}b] = \Pr[K{=}k_1] = \tfrac12$$
$$\Pr[C{=}3\mid M{=}a] = \Pr[K{=}k_3] = \tfrac14 \qquad \Pr[C{=}3\mid M{=}b] = \Pr[K{=}k_2] = \tfrac14$$
$$\Pr[C{=}4\mid M{=}a] = 0 \qquad\qquad\quad\ \ \Pr[C{=}4\mid M{=}b] = \Pr[K{=}k_3] = \tfrac14$$

| $\Pr[C{=}y\mid M{=}x]$ | $y=1$ | $y=2$ | $y=3$ | $y=4$ | suma |
|---|---|---|---|---|---|
| $x = a$ | $1/2$ | $1/4$ | $1/4$ | $0$ | 1 |
| $x = b$ | $0$ | $1/2$ | $1/4$ | $1/4$ | 1 |
| **$\Pr[C{=}y]$** | $1/8$ | $7/16$ | $1/4$ | $3/16$ | 1 |

**NO** se cumple $\Pr[C{=}y\mid M{=}x] = \Pr[C{=}y]\ \forall y\,\forall x$ → **NO hay secreto perfecto**. Alcanza con una casilla: $\Pr[C{=}1\mid M{=}b] = 0 \ne 1/8 = \Pr[C{=}1]$.

### Criterio del mensaje (Bayes)

$$\Pr[M{=}a\mid C{=}1] = \frac{\tfrac14 \cdot \tfrac12}{\tfrac18} = 1 \qquad\qquad \Pr[M{=}b\mid C{=}1] = \frac{\tfrac34 \cdot 0}{\tfrac18} = 0$$
$$\Pr[M{=}a\mid C{=}2] = \frac{\tfrac14 \cdot \tfrac14}{\tfrac{7}{16}} = \frac{1/16}{7/16} = \tfrac17 \qquad \Pr[M{=}b\mid C{=}2] = \frac{\tfrac34 \cdot \tfrac12}{\tfrac{7}{16}} = \frac{6/16}{7/16} = \tfrac67$$
$$\Pr[M{=}a\mid C{=}3] = \frac{\tfrac14 \cdot \tfrac14}{\tfrac14} = \tfrac14 \qquad\quad\ \ \Pr[M{=}b\mid C{=}3] = \frac{\tfrac34 \cdot \tfrac14}{\tfrac14} = \tfrac34$$
$$\Pr[M{=}a\mid C{=}4] = \frac{\tfrac14 \cdot 0}{\tfrac{3}{16}} = 0 \qquad\qquad \Pr[M{=}b\mid C{=}4] = \frac{\tfrac34 \cdot \tfrac14}{\tfrac{3}{16}} = \frac{3/16}{3/16} = 1$$

| a posteriori | $y=1$ | $y=2$ | $y=3$ | $y=4$ | **a priori** |
|---|---|---|---|---|---|
| $\Pr[M{=}a\mid C{=}y]$ | $\mathbf{1}$ | $1/7$ | $1/4$ | $\mathbf{0}$ | $1/4$ |
| $\Pr[M{=}b\mid C{=}y]$ | $\mathbf{0}$ | $6/7$ | $3/4$ | $\mathbf{1}$ | $3/4$ |

**NO** se cumple $\Pr[M{=}x\mid C{=}y] = \Pr[M{=}x]\ \forall y\,\forall x$ → **NO hay secreto perfecto**. Los dos criterios coinciden, como tenían que coincidir.

### Lo jugoso: no todos los criptogramas filtran lo mismo

> **Lectura mía, no del apunte** — el PDF calcula la tabla de a posteriori, concluye "NO hay secreto perfecto" y se detiene ahí.

Leyendo la tabla de a posteriori por columnas se ve una gradación que la definición, por ser un $\forall$, aplasta en un simple "no":

| Criptograma | A posteriori | Qué filtra |
|---|---|---|
| $y = 1$ | $(1,\ 0)$ | **delata el mensaje entero**: sólo $a$ puede producir un 1 |
| $y = 4$ | $(0,\ 1)$ | **delata el mensaje entero**: sólo $b$ puede producir un 4 |
| $y = 2$ | $(1/7,\ 6/7)$ | **sesga**: $a$ pasa de $1/4$ a $1/7$ (menos probable), $b$ sube de $3/4$ a $6/7$ |
| $y = 3$ | $(1/4,\ 3/4)$ | **nada**: coincide exactamente con la a priori |

- $C{=}1$ y $C{=}4$ son **certezas**: el adversario que los ve sabe el mensaje sin hacer nada. La causa es estructural — los soportes no coinciden: desde $a$ se alcanza $\{1,2,3\}$ y desde $b$ se alcanza $\{2,3,4\}$. Cualquier cifrado en la diferencia simétrica identifica el mensaje.
- $C{=}2$ es **sesgo**: el soporte sí coincide, pero los pesos no ($\Pr[C{=}2\mid M{=}a] = 1/4 \ne 1/2 = \Pr[C{=}2\mid M{=}b]$), porque la clave no es uniforme.
- $C{=}3$ es **inofensivo**: ahí sí $\Pr[C{=}3\mid M{=}a] = \Pr[C{=}3\mid M{=}b] = 1/4$, y por eso la a posteriori queda clavada en la a priori.

O sea: hay **dos fallas independientes** —soporte desparejo y pesos desparejos— y el sistema tiene las dos. El secreto perfecto exige que *ninguna* columna filtre; que $C{=}3$ se porte bien no salva nada.

### El aporte fuerte: |K| ≥ |M| es necesario pero **no suficiente**

> **Lectura mía, no del apunte** — el PDF no menciona a Shannon ni la cota de claves; la lectura viene de cruzarlo con la clase.

El enunciado general —la implicación va en **un solo sentido**, o sea que $\lvert\mathcal{K}\rvert \ge \lvert\mathcal{M}\rvert$ es condición **necesaria** y nunca suficiente— está en [[secreto-perfecto#Teorema de Shannon (cota de claves)|secreto perfecto]]. Lo que aporta el Ejemplo 2 es la **instancia numérica** que lo exhibe, y conviene tenerla a mano para el parcial:

$$\lvert\mathcal{K}\rvert = 3 \;\ge\; \lvert\mathcal{M}\rvert = 2$$

**La cota se cumple** — y aun así **no hay secreto perfecto**: 3 claves, 2 mensajes, 4 cifrados, y ver $C{=}1$ ya delata el plano. Lo que falta, y el conteo no ve, es la estructura de `Enc`: cada mensaje debe alcanzar el mismo conjunto de cifrados, con la misma masa de claves — el cuadrado latino del Ejemplo 1.

> **Error típico:** "tengo tantas claves como mensajes, entonces es seguro". Falso, y este ejemplo lo prueba. Puede compararse con el argumento de conteo que descarta la [[secreto-perfecto|rotación con longitud de clave mayor o igual que 2]]: ahí el conteo **sí** alcanza para descartar, porque va en la dirección buena de la implicación.

---

## 4. Errata del apunte original

> **Está mal en el PDF, no en la wiki.** En la última cuenta de Bayes de la página 3, el original imprime, literal:
>
> $$\Pr[M{=}b\mid C{=}4] \;=\; \frac{\Pr[M{=}b]\cdot\Pr[K{=}k_3]}{\Pr[C{=}4]} \;=\; \frac{\boxed{\tfrac14} \cdot \tfrac14}{\boxed{\tfrac18}} \;=\; 1$$
>
> Son **dos erratas de tipeo en la misma expresión**, independientes entre sí:
>
> | Se imprime | Debería decir | Por qué |
> |---|---|---|
> | numerador $\Pr[M{=}b] = \tfrac14$ | $\tfrac34$ | es el dato del enunciado del Ejemplo 2; las otras filas de $\Pr[M{=}b\mid\cdot]$ del apunte usan $\tfrac34$ bien |
> | denominador $\Pr[C{=}4] = \tfrac18$ | $\tfrac{3}{16}$ | el propio apunte lo había calculado unos renglones antes: $\Pr[C{=}4] = \tfrac14\cdot\tfrac34 = \tfrac{3}{16}$. El $\tfrac18$ es el valor de $\Pr[C{=}1]$, arrastrado al copiar el renglón |
>
> Tomada al pie de la letra, la expresión impresa vale $\tfrac{1/16}{1/8} = \tfrac12$ — **no** el $1$ que el mismo renglón da como resultado. Con los dos valores corregidos:
>
> $$\Pr[M{=}b\mid C{=}4] = \frac{\tfrac34 \cdot \tfrac14}{\tfrac{3}{16}} = \frac{3/16}{3/16} = 1$$
>
> O sea: **el resultado final que imprime el apunte ($1$) es el correcto**; lo que está mal es el camino. Y hay que corregir las **dos** cosas — arreglando una sola, la cuenta tampoco da $1$.
>
> El $\tfrac18$ también aparece mal en el renglón vecino, $\Pr[M{=}a\mid C{=}4] = \tfrac{1/4\,\cdot\,0}{1/8} = 0$ (ahí el numerador $\Pr[M{=}a] = \tfrac14$ sí está bien), pero el resultado es $0$ por el numerador y la errata no se nota.
>
> *(Cuidado con corregir de más: **no** toda aparición de $\tfrac18$ es errata. En $\Pr[M{=}b\mid C{=}1] = \tfrac{3/4\,\cdot\,0}{1/8} = 0$ el denominador **está bien**, porque ahí $\Pr[C{=}1]$ sí vale $\tfrac18$.)*

---

## 5. Resumen de los dos ejemplos

| | Ejemplo 1 | Ejemplo 2 |
|---|---|---|
| $\lvert\mathcal{M}\rvert$ / $\lvert\mathcal{K}\rvert$ / $\lvert\mathcal{C}\rvert$ | 2 / 2 / 2 | 2 / 3 / 4 |
| $\Pr[M]$ | uniforme | $1/4$, $3/4$ |
| $\Pr[K]$ | uniforme | $1/2$, $1/4$, $1/4$ |
| Tabla de `Enc` | cuadrado latino | no cuadrada, soportes distintos |
| Cota de Shannon $\lvert\mathcal{K}\rvert \ge \lvert\mathcal{M}\rvert$ | se cumple | **se cumple** |
| $\Pr[C{=}y\mid M{=}x] = \Pr[C{=}y]$ | Sí | No |
| $\Pr[M{=}x\mid C{=}y] = \Pr[M{=}x]$ | Sí | No |
| **Secreto perfecto** | **sí** | **no** |

La moraleja de leer las dos filas juntas: la cota de claves no distingue los dos casos; **lo que los distingue es la estructura de la tabla de `Enc`**.

