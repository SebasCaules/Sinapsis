---
title: Algoritmo de Euclides extendido
resumen: 'Procedimiento que calcula el mcd de dos enteros y devuelve además los coeficientes de Bézout, con los que se resuelve una ecuación diofántica lineal y se obtiene cualquier inverso modular.'
fuentes: ["[[teoria-de-numeros]]", "[[aritmetica-modular-y-divisibilidad]]", "[[video-03-algoritmo-de-euclides-extendido]]", "[[clase-02-cifrado]]"]
aliases: [Algoritmo de Euclides extendido, Euclides extendido, Algoritmo de Euclides, Identidad de Bézout, Bézout, Coeficientes de Bézout, Ecuación diofántica lineal, Ecuación diofántica]
type: concepto
unidad: 1
clase: 2
orden: 14
created: 2026-08-24
updated: 2026-09-04
tags: [criptografia, teoria-de-numeros, euclides, bezout, diofantica, mcd, algoritmo, clase-02, parcial]
sources: [DirtyGuidToNumberTheory.pdf, "Clase 02pt1-Transcripcion.VTT", "Algoritmo Euclides Extendido (video, mirado)"]
---

# Algoritmo de Euclides extendido

Esta nota trae **cómo se calcula un mcd en la práctica, cómo se resuelve una ecuación diofántica $ax+by=c$, y de dónde salen los enteros $x,y$ de Bézout**. Es el procedimiento que el docente marcó nominalmente para el parcial, y el que hace falta para calcular cualquier [[inverso-modular|inverso modular]].

**Qué la distingue de sus vecinas.** [[aritmetica-modular-y-divisibilidad|Aritmética modular y divisibilidad]] define qué **es** el mcd; esta nota dice cómo se **obtiene**. Y el [[teoria-de-numeros|apunte de teoría de números]] es explícito en que el manuscrito **no trae el algoritmo**: define el mcd, afirma que existen los coeficientes de Bézout, y nunca los construye. **Ese hueco es exactamente lo que llena esta nota**, con dos corridas completas paso a paso.

> **Fuentes.** Apunte manuscrito [`DirtyGuidToNumberTheory.pdf`](../../raw/apuntes/DirtyGuidToNumberTheory.pdf) — de él salen el enunciado de la [[teoria-de-numeros#Ecuación diofántica lineal|ecuación diofántica]], el tip de Bézout y la forma general de las soluciones · el video del docente, **ya mirado y volcado** en [[video-03-algoritmo-de-euclides-extendido|video-03]], donde resuelve $41x - 19y = 8$ a mano de punta a punta · el encargo en la [transcripción de la Clase 02](../../raw/clases/Clase%2002pt1-Transcripcion.VTT).
>
> **El algoritmo en sí, las demostraciones, las dos corridas de ejemplo y el análisis de complejidad son desarrollo nuestro**, porque no están en ninguna fuente escrita del vault. **Pendiente concreto y ahora barato:** contrastar esta presentación contra la del docente, que está desarrollada en [[video-03-algoritmo-de-euclides-extendido|video-03]] — él arma la tabla en otro orden y sobre un ejemplo distinto de los dos de acá.

---

## 1. Dos preguntas que conviene no mezclar

El tema tiene dos capas, y casi todos los errores vienen de confundirlas:

| Pregunta | Quién la responde | Qué devuelve |
|---|---|---|
| **¿Cuánto vale $\operatorname{mcd}(a,b)$?** | algoritmo de Euclides "pelado" | un número, $d$ |
| **¿Qué enteros $x,y$ cumplen $ax+by=d$?** | algoritmo de Euclides **extendido** | el par $(x,y)$, además de $d$ |

La primera alcanza para **decidir** si una diofántica tiene solución. La segunda es la que hace falta para **encontrarla** — y es la que se usa en criptografía, porque el [[inverso-modular|inverso modular]] **es** uno de esos coeficientes. *(Distinción nuestra; el manuscrito no separa las dos capas porque no trae ninguna de las dos.)*

---

## 2. La ecuación diofántica lineal

$$a x + b y = c, \qquad a, b, c \in \mathbb{Z}$$

**"Diofántica" quiere decir que sólo se aceptan soluciones enteras**, y esa restricción es toda la dificultad. Sobre $\mathbb{Q}$ o sobre $\mathbb{R}$ la ecuación tiene infinitas soluciones para cualquier $c$ (con $a,b$ no ambos nulos) y no habría nada que discutir: se despeja $y = (c - ax)/b$ y listo. Pedir $x,y \in \mathbb{Z}$ la convierte en un problema de **divisibilidad**.

> **Teorema.** $ax + by = c$ tiene solución entera **si y sólo si** $\operatorname{mcd}(a,b) \mid c$.

*Demostración.* Llamemos $d = \operatorname{mcd}(a,b)$.

- **($\Rightarrow$) Necesidad.** Como $d \mid a$ y $d \mid b$, el [[aritmetica-modular-y-divisibilidad#El lemma que sostiene todo lo demás|lemma de combinación lineal]] dice que $d \mid (ax+by)$ para cualesquiera $x,y$. Si hay solución, $ax+by = c$, luego $d \mid c$.
- **($\Leftarrow$) Suficiencia.** Por [[#3. La identidad de Bézout|Bézout]] existen $x_0, y_0$ con $a x_0 + b y_0 = d$. Como $d \mid c$, el cociente $c/d$ es **entero**. Multiplicando la identidad por $c/d$:
  $$a\Big(x_0\tfrac{c}{d}\Big) + b\Big(y_0\tfrac{c}{d}\Big) = d\cdot\tfrac{c}{d} = c$$
  y los dos paréntesis son enteros. $\blacksquare$

**La suficiencia no es sólo una prueba de existencia: es una receta.** Dice literalmente *"resolver el caso $c = d$ con Euclides extendido y después multiplicar todo por $c/d$"*. Eso es lo que se hace en el [[#8. Ejemplo 2: el mcd de 84 y 30, con d mayor que 1|Ejemplo 2]] de acá abajo.

> **Matiz de escritura del manuscrito.** El tip de la hoja 1 escribe $(a{:}b)=1 \Rightarrow ax+by=1$ con implicación simple, y en la sección de la diofántica el mismo criterio aparece con $\iff$. La vuelta vale: si $ax+by=1$ tiene solución entera, todo divisor común de $a$ y $b$ divide a $1$, o sea $\operatorname{mcd}(a,b)=1$. Es un ida y vuelta.

---

## 3. La identidad de Bézout

> **Identidad de Bézout.** Para todo par $a, b \in \mathbb{Z}$ no ambos nulos, **existen** $x, y \in \mathbb{Z}$ tales que
> $$a x + b y = \operatorname{mcd}(a,b)$$
> En particular, si $a \perp b$ existen $x,y$ con $ax + by = 1$.

*(El manuscrito la anota como un "tip" al pasar —$(a{:}b)=1 \Rightarrow ax+by=1$— y nunca vuelve sobre ella. Es, sin embargo, la bisagra de las dos hojas.)*

**Demostración (no constructiva, y por eso insuficiente).** Sea $S = \{\, ax + by > 0 \;:\; x,y \in \mathbb{Z} \,\}$, el conjunto de las combinaciones lineales **positivas**. No es vacío ($a\cdot a + b\cdot b > 0$), así que tiene un mínimo $e = a x_0 + b y_0$. Dividiendo $a$ por $e$: $a = qe + r$ con $0 \le r < e$, y
$$r = a - qe = a - q(ax_0 + by_0) = a(1 - qx_0) + b(-qy_0)$$
es otra combinación lineal. Si fuera $r > 0$ estaría en $S$ y sería menor que el mínimo: absurdo. Luego $r = 0$, o sea $e \mid a$; lo mismo con $b$. Entonces $e$ es divisor común, y como todo divisor común divide a $e$ (por el lemma de combinación lineal), $e = \operatorname{mcd}(a,b)$. $\blacksquare$

> **Por qué esta demostración no alcanza.** Prueba que $x$ e $y$ **existen** y no da ninguna forma de encontrarlos: el mínimo de un conjunto infinito no es un algoritmo. Para criptografía eso es inservible — hace falta *el número*, no la certeza de que hay uno. **Euclides extendido es la versión constructiva del mismo teorema**, y por eso es lo que se estudia. *(Observación nuestra.)*

---

## 4. El algoritmo de Euclides (por restos)

Se apoya en las dos propiedades del mcd de [[aritmetica-modular-y-divisibilidad#Las dos propiedades que usa Euclides|la nota de base]]:

$$\operatorname{mcd}(a, 0) = \lvert a\rvert \qquad\text{y}\qquad \operatorname{mcd}(a,b) = \operatorname{mcd}(b,\, a \bmod b)$$

$$\begin{aligned}
&\textsf{Euclides}(a, b):\\
&\quad \textbf{mientras } b \ne 0:\\
&\qquad (a, b) \leftarrow (b,\ a \bmod b)\\
&\quad \textbf{devolver } a
\end{aligned}$$

**Corrección.** Cada iteración preserva el mcd (por el paso de recursión) y termina en el caso base.

**Terminación.** Los restos son estrictamente decrecientes y no negativos: $b > a \bmod b \ge 0$. Una sucesión así de naturales no puede ser infinita.

> **La lectura importante: Euclides no factoriza.** La forma "de colegio" de calcular un mcd es factorizar los dos números y multiplicar los primos comunes con el menor exponente — $84 = 2^2\cdot 3\cdot 7$, $30 = 2\cdot 3\cdot 5$, mcd $= 2\cdot 3 = 6$. Eso funciona con dos dígitos y es **inutilizable** con dos mil bits, porque factorizar es un problema para el que no se conoce algoritmo eficiente.
>
> **Euclides esquiva la factorización por completo**: sólo hace divisiones con resto. Esa asimetría —*calcular el mcd es fácil, factorizar es difícil*— no es un detalle de implementación: **es una de las asimetrías sobre las que se construye la criptografía asimétrica**. RSA necesita las dos cosas a la vez: que Euclides sea barato (para generar la clave) y que factorizar sea caro (para que nadie la recupere). *(Lectura nuestra; se retoma en la sección 8.)*

---

## 5. La versión extendida

La idea: **arrastrar, en cada renglón, cómo se escribe ese resto como combinación de los dos números originales**. Si en cada paso se sabe

$$r_i = s_i\,a + t_i\,b$$

entonces cuando $r_i$ sea el último resto no nulo se tiene $d = s_i\,a + t_i\,b$, que es Bézout.

Y los $s_i, t_i$ salen de la **misma recurrencia que los restos**. Si $r_i = r_{i-2} - q_i\,r_{i-1}$, entonces necesariamente

$$s_i = s_{i-2} - q_i\,s_{i-1}, \qquad t_i = t_{i-2} - q_i\,t_{i-1}$$

con las condiciones iniciales que representan a los dos números de entrada como combinaciones triviales de sí mismos:

| $i$ | $r_i$ | $s_i$ | $t_i$ |
|---|---|---|---|
| $-1$ | $a$ | $1$ | $0$ |
| $0$ | $b$ | $0$ | $1$ |

*(Se lee: $a = 1\cdot a + 0\cdot b$ y $b = 0\cdot a + 1\cdot b$.)*

$$\begin{aligned}
&\textsf{EuclidesExtendido}(a, b):\\
&\quad (r_{-1}, s_{-1}, t_{-1}) \leftarrow (a, 1, 0)\\
&\quad (r_{0},\ s_{0},\ t_{0}\ ) \leftarrow (b, 0, 1)\\
&\quad i \leftarrow 0\\
&\quad \textbf{mientras } r_i \ne 0:\\
&\qquad i \leftarrow i+1\\
&\qquad q_i \leftarrow \lfloor r_{i-2} / r_{i-1} \rfloor\\
&\qquad r_i \leftarrow r_{i-2} - q_i\,r_{i-1}\\
&\qquad s_i \leftarrow s_{i-2} - q_i\,s_{i-1}\\
&\qquad t_i \leftarrow t_{i-2} - q_i\,t_{i-1}\\
&\quad \textbf{devolver } (d, x, y) = (r_{i-1},\ s_{i-1},\ t_{i-1})
\end{aligned}$$

> **El invariante, que es lo único que hay que creer:** en todo momento $r_i = s_i\,a + t_i\,b$. Vale para los dos renglones iniciales por construcción, y se preserva porque las tres columnas obedecen **la misma** combinación lineal: si $r_{i-2}$ y $r_{i-1}$ son combinaciones de $a$ y $b$, entonces $r_{i-2} - q_i r_{i-1}$ también, y sus coeficientes son exactamente $s_{i-2}-q_i s_{i-1}$ y $t_{i-2}-q_i t_{i-1}$. Es inducción, no magia.

**Dos formas de hacerlo a mano, y las dos dan lo mismo:**

| Forma | Cómo | Cuándo conviene |
|---|---|---|
| **Sustitución hacia atrás** | primero se corre Euclides, después se despeja cada resto desde el anteúltimo hacia arriba | es la que se ve más rápido en un parcial, con pocos pasos |
| **Tabla hacia adelante** | se arrastran $s_i, t_i$ en la misma pasada | no hay que rehacer nada, y es la que se programa. Con más de 4 o 5 divisiones es mucho menos propensa a error |

En los dos ejemplos que siguen se hacen **las dos**, para que puedas verificar una contra la otra.

---

## 6. Ejemplo 1: el mcd de 7 y 32

**Este es el ejemplo que hay que saber hacer**: es exactamente el que pide el [[guia-02-criptografia-simetrica|Ej. 7c de la Guía 2]], donde la primitiva de bloque es $E(K,M) = (M\cdot K)\bmod 32$ con $K = 7$ y para descifrar hace falta $7^{-1} \bmod 32$.

### 6.1 Euclides pelado

| Paso | Dividendo | Divisor | Cociente $q$ | Resto $r$ |
|---|---|---|---|---|
| 1 | $32$ | $7$ | $4$ | $32 - 4\cdot 7 = 4$ |
| 2 | $7$ | $4$ | $1$ | $7 - 1\cdot 4 = 3$ |
| 3 | $4$ | $3$ | $1$ | $4 - 1\cdot 3 = 1$ |
| 4 | $3$ | $1$ | $3$ | $3 - 3\cdot 1 = \mathbf{0}$ |

$$\operatorname{mcd}(7,32) = 1 \quad\text{(el último resto no nulo)}$$

Que era previsible sin hacer nada —$32 = 2^5$ y $7$ es impar, así que no comparten factores— pero el punto no es el $1$: **es la cadena de cocientes $4, 1, 1, 3$**, que es de donde salen los coeficientes.

### 6.2 Sustitución hacia atrás

Se arranca del renglón del último resto no nulo y se va reemplazando:

$$\begin{aligned}
1 &= 4 - 1\cdot 3 && \text{(paso 3)}\\
&= 4 - 1\cdot(7 - 1\cdot 4) && \text{(paso 2: } 3 = 7 - 4)\\
&= 2\cdot 4 - 1\cdot 7 &&\\
&= 2\cdot(32 - 4\cdot 7) - 1\cdot 7 && \text{(paso 1: } 4 = 32 - 4\cdot 7)\\
&= 2\cdot 32 - 9\cdot 7 &&
\end{aligned}$$

$$\boxed{\;2\cdot 32 - 9\cdot 7 = 64 - 63 = 1\;}$$

> **El error clásico acá es "hacer la cuenta".** En el segundo renglón la tentación es escribir $4 - 1\cdot 3 = 1$ y seguir. **No hay que resolver nada**: los números $4$, $7$, $32$ y $3$ tienen que quedar **sin evaluar**, porque son los que van a terminar como coeficientes. Lo único que se agrupa son los múltiplos de un mismo número.

### 6.3 La misma corrida en tabla

Con $a = 32$, $b = 7$ (el invariante es $r_i = s_i\cdot 32 + t_i\cdot 7$):

| $i$ | $q_i$ | $r_i$ | $s_i$ | $t_i$ | Verificación $s_i\cdot 32 + t_i\cdot 7$ |
|---|---|---|---|---|---|
| $-1$ | — | $32$ | $1$ | $0$ | $32$ |
| $0$ | — | $7$ | $0$ | $1$ | $7$ |
| $1$ | $4$ | $4$ | $1$ | $-4$ | $32 - 28 = 4$ |
| $2$ | $1$ | $3$ | $-1$ | $5$ | $-32 + 35 = 3$ |
| $3$ | $1$ | $\mathbf{1}$ | $\mathbf{2}$ | $\mathbf{-9}$ | $64 - 63 = \mathbf{1}$ |
| $4$ | $3$ | $0$ | $-7$ | $32$ | $-224 + 224 = 0$ |

El renglón $i = 3$ es el del último resto no nulo: **$d = 1$, con $x = 2$ e $y = -9$**. Coincide con la sustitución hacia atrás.

> **Chequeo gratis del último renglón.** Cuando $r_i = 0$, los coeficientes valen siempre $\pm b/d$ y $\mp a/d$. Acá: $s_4 = -7 = -7/1$ y $t_4 = 32 = 32/1$. Si te da otra cosa, te equivocaste en algún paso. *(Truco nuestro; sale de la [[#7. La forma general de las soluciones|forma general de las soluciones]].)*

### 6.4 Bajarlo a la forma que pide la guía

El resultado $2\cdot 32 - 9\cdot 7 = 1$ y el que pide el enunciado del ejercicio, $23\cdot 7 - 5\cdot 32 = 1$, **son la misma identidad**: los coeficientes de Bézout **no son únicos**. Se pasa de uno al otro reduciendo el coeficiente de $7$ módulo $32$:

$$-9 \equiv -9 + 32 = 23 \pmod{32}$$

y recalculando el otro para que la cuenta cierre: $7\cdot 23 = 161$, y $161 - 1 = 160 = 5\cdot 32$, así que

$$\boxed{\;23\cdot 7 - 5\cdot 32 = 161 - 160 = 1\;}$$

**Verificado.** Es el par que conviene reportar cuando lo que se busca es un inverso, porque $23$ ya está en $\{0,\dots,31\}$ — o sea, ya es un representante de $\mathbb{Z}_{32}$. Leyendo la identidad módulo $32$, el término $-5\cdot 32$ desaparece y queda

$$7\cdot 23 \equiv 1 \pmod{32} \quad\Longrightarrow\quad 7^{-1} = 23 \ \text{ en } \mathbb{Z}_{32}$$

que es el resultado que usa el [[inverso-modular|inverso modular]] y el descifrado del Ej. 7c.

### 6.5 Y la diofántica general con estos números

Ya que tenemos Bézout, cualquier $7x + 32y = c$ sale gratis, porque $\operatorname{mcd} = 1$ divide a todo. Por ejemplo $7x + 32y = 5$: multiplicando la identidad por $5$,

$$7\cdot 115 + 32\cdot(-25) = 805 - 800 = 5 \quad\checkmark$$

y reduciendo $115 \equiv 19 \pmod{32}$ se obtiene el par chico: $7\cdot 19 + 32\cdot(-4) = 133 - 128 = 5$. $\checkmark$

---

## 7. La forma general de las soluciones

Una diofántica con solución tiene **infinitas**, y todas salen de una:

> **Teorema.** Si $d = \operatorname{mcd}(a,b)$ divide a $c$ y $(x_0, y_0)$ es una solución particular de $ax+by=c$, entonces **todas** las soluciones enteras son
> $$x = x_0 + t\,\frac{b}{d}, \qquad y = y_0 - t\,\frac{a}{d}, \qquad t \in \mathbb{Z}$$

*Demostración.* *(Desarrollo nuestro: el manuscrito da la fórmula de $x$ sin la de $y$ y sin justificarla.)*

- **Son soluciones.** $a\big(x_0 + t\tfrac{b}{d}\big) + b\big(y_0 - t\tfrac{a}{d}\big) = ax_0 + by_0 + t\tfrac{ab}{d} - t\tfrac{ab}{d} = c$. Los dos términos en $t$ se cancelan exactamente.
- **Son todas.** Si $(x,y)$ es otra solución, restando las dos ecuaciones queda $a(x-x_0) = -b(y-y_0)$. Dividiendo por $d$: $\tfrac{a}{d}(x-x_0) = -\tfrac{b}{d}(y-y_0)$, y ahora $\tfrac{a}{d} \perp \tfrac{b}{d}$ (si compartieran un factor, $d$ no habría sido el máximo). Entonces $\tfrac{b}{d}$ divide a $x - x_0$, o sea $x - x_0 = t\,\tfrac{b}{d}$ para algún entero $t$, y de ahí sale $y$. $\blacksquare$

**El paso $b/d$ es el que importa.** No es $b$: es $b$ dividido por el mcd. Con $d = 1$ las soluciones van de $b$ en $b$; con $d$ grande, mucho más juntas. Y es exactamente el paso que hace que una [[inverso-modular#4. La ecuación lineal de congruencia|congruencia lineal tenga d soluciones distintas módulo m]] en vez de una.

---

## 8. Ejemplo 2: el mcd de 84 y 30, con d mayor que 1

El primer ejemplo tiene $d=1$ y por eso oculta la mitad de la teoría. Este la muestra.

### 8.1 La tabla completa, de una pasada

Con $a = 84$, $b = 30$ (invariante: $r_i = s_i\cdot 84 + t_i\cdot 30$):

| $i$ | $q_i$ | $r_i$ | $s_i$ | $t_i$ | Verificación $s_i\cdot 84 + t_i\cdot 30$ |
|---|---|---|---|---|---|
| $-1$ | — | $84$ | $1$ | $0$ | $84$ |
| $0$ | — | $30$ | $0$ | $1$ | $30$ |
| $1$ | $2$ | $24$ | $1$ | $-2$ | $84 - 60 = 24$ |
| $2$ | $1$ | $\mathbf{6}$ | $\mathbf{-1}$ | $\mathbf{3}$ | $-84 + 90 = \mathbf{6}$ |
| $3$ | $4$ | $0$ | $5$ | $-14$ | $420 - 420 = 0$ |

$$\operatorname{mcd}(84,30) = 6, \qquad \boxed{\;-1\cdot 84 + 3\cdot 30 = -84 + 90 = 6\;}$$

**Verificado.** Y el chequeo del último renglón: $s_3 = 5 = 30/6$, $t_3 = -14 = -84/6$. $\checkmark$

*Sustitución hacia atrás, por si se prefiere esa forma:* $6 = 30 - 1\cdot 24 = 30 - (84 - 2\cdot 30) = 3\cdot 30 - 84$. Idéntico.

### 8.2 Resolver 84x + 30y = 18

$\operatorname{mcd}(84,30) = 6$ y $6 \mid 18$, así que **hay solución**. Multiplicando la identidad de Bézout por $18/6 = 3$:

$$84\cdot(-3) + 30\cdot 9 = -252 + 270 = 18 \quad\checkmark$$

Solución particular: $(x_0, y_0) = (-3, 9)$. Y la familia completa, con $b/d = 30/6 = 5$ y $a/d = 84/6 = 14$:

$$x = -3 + 5t, \qquad y = 9 - 14t$$

| $t$ | $x$ | $y$ | $84x + 30y$ |
|---|---|---|---|
| $-1$ | $-8$ | $23$ | $-672 + 690 = 18$ |
| $0$ | $-3$ | $9$ | $-252 + 270 = 18$ |
| $1$ | $2$ | $-5$ | $168 - 150 = 18$ |
| $2$ | $7$ | $-19$ | $588 - 570 = 18$ |

Las cuatro verifican. Nótese que **el $x$ avanza de $5$ en $5$, no de $30$ en $30$**: es el $b/d$ de la sección anterior.

### 8.3 Y una que no tiene solución: 84x + 30y = 5

$6 \nmid 5$, así que **no hay ningún par de enteros** que la resuelva. Y se puede ver sin teoría: el lado izquierdo es siempre par (los dos coeficientes lo son) y el derecho es impar.

> **La moraleja de este ejemplo.** Con $d = 1$ —el caso del Ej. 7 de la Guía 2— *toda* diofántica tiene solución y el criterio parece trivial. Con $d > 1$ el criterio muerde: hay valores de $c$ inalcanzables. **Es el mismo criterio que, trasladado a congruencias, decide si un [[inverso-modular|inverso modular]] existe o no** — y ahí sí importa muchísimo, porque decide qué claves sirven y cuáles no.

---

## 9. Complejidad: O(log min(a,b))

> **Teorema (Lamé, 1844).** El número de divisiones que hace el algoritmo de Euclides sobre $(a,b)$ es $O(\log \min(a,b))$. Más fino: no supera **5 veces la cantidad de dígitos decimales** del menor de los dos.

**La intuición de por qué.** En dos pasos consecutivos, el resto **al menos se reduce a la mitad**: si $r_{i} \le r_{i-1}/2$ ya está; y si $r_i > r_{i-1}/2$, entonces el cociente siguiente es $1$ y $r_{i+1} = r_{i-1} - r_i < r_{i-1}/2$. En cualquiera de los dos casos, cada **dos** iteraciones el número se achica a menos de la mitad — y un número de $n$ bits no se puede partir al medio más de $n$ veces.

**El peor caso son los números de Fibonacci consecutivos**, donde todos los cocientes valen $1$ salvo el último —que vale $2$— y no hay ningún atajo. Con la convención $F_1 = F_2 = 1$, la corrida sobre $\operatorname{mcd}(F_{n+1}, F_n)$ toma exactamente $n-1$ divisiones. *(Verificado: $\operatorname{mcd}(F_4, F_3) = \operatorname{mcd}(3,2)$ son $2$ divisiones y $\operatorname{mcd}(F_6, F_5) = \operatorname{mcd}(8,5)$ son $4$ — cuidado con el corrimiento de índice, que es el error fácil acá.)* Como $F_n$ crece exponencialmente, esa cantidad crece logarítmicamente en el tamaño de la entrada. *(Con $\operatorname{mcd}(7,32)$ los cocientes fueron $4,1,1,3$: cuatro divisiones, y la cota de Lamé sobre el menor de los dos —$7$, un solo dígito decimal— da $5$. Encaja.)*

### Por qué esto es lo que hace practicable a RSA

*(Lectura nuestra, y **adelanto**: RSA se ve en la Clase 4, que todavía no está ingerida. Esto sale de entender el algoritmo, no de ninguna fuente del vault.)*

Al poner el logaritmo en escala real: con una clave RSA de $2048$ bits, los números en juego tienen unos $617$ dígitos decimales:

| Operación sobre números de 2048 bits | Costo | Practicable |
|---|---|---|
| Euclides extendido | unas **pocas miles de divisiones** | Sí — milisegundos |
| Factorizar el módulo | subexponencial, **fuera de alcance** | No, y de eso depende la seguridad |
| Fuerza bruta sobre la clave | $2^{2048}$ | No, ni de lejos |

**Las dos primeras filas juntas son RSA.** La generación de claves necesita calcular $d = e^{-1} \bmod \varphi(n)$, que es un inverso modular sobre números de ese tamaño: si Euclides fuera exponencial, **no habría RSA**, porque generar una clave sería tan caro como romperla. Y si factorizar fuera fácil, tampoco lo habría, porque cualquiera recuperaría $\varphi(n)$ y con él la clave privada.

Es decir: la seguridad de RSA no vive en que "las cuentas sean difíciles", sino en la **brecha** entre dos problemas que a simple vista se parecen. Euclides está del lado fácil. Es la misma forma de argumento que la [[seguridad-computacional|seguridad computacional]] de la Clase 2 —*todo es rompible, la pregunta es en cuánto tiempo*—, sólo que acá la asimetría se usa a favor.

---

## 10. Checklist para el parcial

El docente marcó nominalmente *"cómo resolver la ecuación diofántica"* y *"cómo resolver lo que es el algoritmo de Euclides extendido"*. En orden de ejecución:

1. **Correr Euclides** hasta resto $0$. El mcd es el **último resto no nulo**, no el cero.
2. **Decidir si hay solución**: $ax+by=c$ tiene solución $\iff d \mid c$. Si no divide, se termina acá y la respuesta es "no existe".
3. **Obtener Bézout**: sustitución hacia atrás o tabla, sin evaluar los productos intermedios.
4. **Escalar**: multiplicar la identidad por $c/d$ para pasar de $ax+by=d$ a $ax+by=c$.
5. **Dar la familia**: $x = x_0 + t\,b/d$, $y = y_0 - t\,a/d$.
6. **Verificar reemplazando.** Son treinta segundos y detecta el 100 % de los errores de signo, que son los más frecuentes.

**Los tres errores que más se cometen:**

- Devolver el resto $0$ como mcd en vez del anterior.
- Evaluar los productos durante la sustitución hacia atrás, y perder los coeficientes.
- Usar $b$ en vez de $b/d$ en el paso de la familia de soluciones.

---

## Sobre la numeración de esta nota

Esta nota lleva `02.14` porque el bloque de teoría de números se ubica en la **Clase 02** —cuyo contador de conceptos cierra en `02.12`— y ésta es la segunda de las tres. De dónde sale esa atribución de clase, por qué no hay una oficial y qué habría que renumerar si la cátedra mueve el tema está en [[aritmetica-modular-y-divisibilidad#Sobre la numeración de esta nota|Aritmética modular y divisibilidad § Sobre la numeración de esta nota]], que vale para las tres.
