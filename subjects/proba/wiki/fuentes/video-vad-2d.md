---
titulo: "Video — VAD 2D"
resumen: "Clase en video de Lucio Pantazis (unidad 5) sobre vectores aleatorios discretos: distribución conjunta y marginales, condicionales, soporte, valor esperado de una función de dos variables, independencia, covarianza y correlación."
tipo: fuente
formato: video
unidad: 5
url: "https://youtu.be/AL3a_ytVwrY"
duracion: "50:42"
docente: Lucio Pantazis
ingerido: 2026-09-03
---

# Video — VAD 2D

**Qué es:** clase de Lucio Pantazis sobre variables aleatorias bidimensionales discretas, desarrollada
casi por completo alrededor de un único ejemplo extendido (las cajas del supermercado).
**Cubre:** distribución conjunta y marginales discretas, probabilidades condicionales entre variables,
representación gráfica del soporte, valor esperado de $g(X,Y)$, independencia, covarianza y coeficiente
de correlación.
**Guía asociada:** Guía 5.

## Recorrido de la clase

| Timestamp | Tema |
|---|---|
| [00:04] | Motivación: un vínculo entre variables que no es una función uno a uno (a diferencia de $Y=g(X)$). |
| [01:32] | Planteo del ejemplo: cajas del supermercado, $M$ = artículos máximos de la caja (20, 40 o 60) y $N$ = personas en la fila. |
| [04:12] | Se da la fórmula de la conjunta $P(M=i,N=j)$ (estructura combinatoria tipo binomial). |
| [07:04] | Marginal $P(M=20)$ por probabilidad total, calculada término a término (forma larga). |
| [09:29] | Marginales $P(M=40)$ y $P(M=60)$; error de límite de suma corregido en vivo. |
| [14:04] | Forma corta: sacar factor común y reconocer una suma de binomial completa (da 1). |
| [14:57] | De dónde sale el nombre "marginal" (suma por filas/columnas de la tabla). |
| [16:51] | Marginal de $N$: cálculo explícito de $P(N=0)$ a $P(N=6)$ vía probabilidad total. |
| [20:36] | Verificación cruzada: sumas por filas y por columnas coinciden con lo ya calculado. |
| [21:26] | Probabilidades condicionales entre variables: certezas ($=1$), imposibilidades ($=0$) y un caso intermedio. |
| [23:39] | Nuevo cálculo condicional: $P(N=2\mid M=40)$. |
| [24:34] | Problema de Andrea: calcular $P(N/M\le 1/6)$ recorriendo combinaciones caso por caso. |
| [27:00] | Representación gráfica del soporte: "graficar sirve siempre, siempre, siempre, siempre". |
| [29:37] | El mismo gráfico permite leer directamente las marginales (rectas verticales/horizontales). |
| [31:26] | Gráfico de curvas de nivel para la función $K=N/M$. |
| [31:52] | Definición formal: vector aleatorio bidimensional discreto, conjunta, marginales y condicionales. |
| [37:07] | Valor esperado de $g(X,Y)$; aplicado para recalcular $E(M)$ y $E(N)$ directo desde la conjunta. |
| [37:58] | Independencia de variables aleatorias: definición y demostración de $E[XY]=E[X]E[Y]$ bajo independencia. |
| [41:43] | Covarianza: definición e interpretación del signo (tendencias conjuntas). |
| [44:01] | Propiedades de la covarianza (simetría, $\text{Cov}(X,X)=\text{Var}(X)$, fórmula práctica). |
| [45:36] | Coeficiente de correlación: definición, rango $[-1,1]$ e interpretación de $\rho=\pm1$. |
| [47:38] | Aplicación al ejemplo: $E(N/M)$. |
| [49:49] | Aplicación al ejemplo: $E(M\cdot N)$ y $\text{Cov}(M,N)$; cierre del video. |

## Qué aporta sobre el apunte

La teoría de conjunta/marginales/condicionales/independencia/covarianza/correlación ya está
desarrollada en el wiki a partir de las teóricas del mismo docente — ver
[[variables-aleatorias-bidimensionales]], [[independencia-de-variables-aleatorias]] y
[[covarianza-y-correlacion]]. Lo que aporta este video es:

- **(a) Un ejercicio resuelto completo y distinto** de los ya archivados (el de la urna en
  [[teorica-bidimensionales-vad-intro]] y los de [[tp5-2024]]): una conjunta con estructura
  combinatoria (tipo binomial condicionada por fila) en vez de una tabla de números sueltos.
  Reproducido íntegro en la sección siguiente.
- **(b) La intuición gráfica** de que el soporte de un vector aleatorio discreto conviene
  dibujarlo como puntos en el plano, y que sobre ese dibujo las marginales son sumas sobre rectas
  verticales/horizontales y las funciones de $(X,Y)$ (como $K=N/M$) son sumas sobre curvas de
  nivel. Esto no estaba explícito en las teóricas ya ingeridas — ver aporte propuesto a
  [[variables-aleatorias-bidimensionales]].
- **(c) Advertencias explícitas del docente** sobre errores de límites de sumatoria y sobre no
  asumir que el recorrido conjunto es una "grilla completa" — ver más abajo.
- **(d) Énfasis**: remarca varias veces que el recorrido de $(M,N)$ **no** es el producto
  cartesiano de los recorridos de $M$ y de $N$ por separado (ya conocido en general por
  [[independencia-de-variables-aleatorias]], pero aquí lo reitera como algo importante a remarcar
  específicamente al plantear una conjunta discreta desde cero).

## Ejercicio resuelto en clase

**(Desde [01:32].)** Andrea, gerente de un supermercado, configura tres tipos de caja según la
cantidad máxima de artículos que aceptan: $M\in\{20,40,60\}$. Federico es un cliente que elige una
caja al azar (con probabilidades no uniformes) y $N$ es la cantidad de personas que tiene por
delante en la fila. La distribución conjunta de $(M,N)$ está dada por:

$$
P(M=i,N=j)=
\begin{cases}
\displaystyle \binom{8-\frac{i}{10}}{j}\cdot\frac{80-i}{120}\cdot\left(\frac34\right)^{j}\left(\frac14\right)^{8-\frac{i}{10}-j} & \text{si } i\in\{20,40,60\},\ 0\le j\le 8-\tfrac{i}{10} \\[4pt]
0 & \text{en otro caso}
\end{cases}
$$

Notar que el rango de $N$ depende de $M$: si $M=20$, $N$ llega hasta $6$; si $M=40$, hasta $4$; si
$M=60$, hasta $2$ como mucho (el recorrido conjunto no es un rectángulo).

### 1. Marginal de $M$ (probabilidad total)

**(Desde [07:04].)** Se descompone $P(M=i)=\sum_{j} P(M=i\cap N=j)$. Para $M=20$:

$$
P(M=20)=\sum_{j=0}^{6}\binom{6}{j}\cdot\frac12\cdot\left(\frac34\right)^{j}\left(\frac14\right)^{6-j}
=\frac12\underbrace{\sum_{j=0}^{6}\binom{6}{j}\left(\frac34\right)^{j}\left(\frac14\right)^{6-j}}_{=1\ (\text{binomial}(6,3/4))}=\frac12.
$$

El factor $\tfrac12$ sale de $\frac{80-20}{120}$ y ya no depende de $j$: sacándolo de factor común
queda la suma de **todas** las probabilidades de una $\text{Binomial}(6,3/4)$, que vale $1$. Con el
mismo argumento (**[09:29], con un error de límite de suma corregido en vivo**, ver Advertencias):

$$
P(M=40)=\frac{80-40}{120}=\frac13,\qquad P(M=60)=\frac{80-60}{120}=\frac16.
$$

Se verifica sumando las filas de la tabla numérica de la conjunta: da $0.5$, $0.333\overline3$ y
$0.1\overline6$ respectivamente.

### 2. Marginal de $N$ (probabilidad total)

**(Desde [16:51].)** Análogamente, fijando $N=j$ y sumando sobre $M\in\{20,40,60\}$:

$$
\begin{aligned}
P(N=0)&=\tfrac{97}{8192}\approx 0.011841, & P(N=1)&=\tfrac{329}{4096}\approx 0.080322,\\
P(N=2)&=\tfrac{1479}{8192}\approx 0.180542, & P(N=3)&=\tfrac{423}{2048}\approx 0.206543,\\
P(N=4)&=\tfrac{2079}{8192}\approx 0.253784, & P(N=5)&=\tfrac{729}{4096}\approx 0.177979,\\
P(N=6)&=\tfrac{729}{8192}\approx 0.088989. &&
\end{aligned}
$$

**(Desde [20:36].)** Se verifica que estos valores coinciden con la suma por columnas de la tabla
conjunta: por ejemplo $P(M=20\cap N=0)+P(M=40\cap N=0)+P(M=60\cap N=0)=0.000122+0.001302+0.010417=0.011841=P(N=0)$.

### 3. Probabilidades condicionales

**(Desde [21:26].)** Como ya se tienen las intersecciones, condicionar es directo:

$$
P(N=6\mid M=60)=\frac{P(N=6\cap M=60)}{P(M=60)}=\frac{0}{1/6}=0
$$
(si eligió la caja de 60, nunca puede tener 6 personas adelante: el soporte lo impide).

$$
P(M=20\mid N=6)=\frac{P(N=6\cap M=20)}{P(N=6)}=\frac{P(N=6)}{P(N=6)}=1
$$
(la única forma de que haya 6 personas en la fila es que haya elegido la caja de 20 artículos).

$$
P(N=2\mid M=40)=\frac{P(N=2\cap M=40)}{P(M=40)}=\frac{6\cdot\frac13\cdot\left(\frac34\right)^2\left(\frac14\right)^2}{1/3}=\frac{27}{128}.
$$

### 4. Probabilidad $P(N/M\le 1/6)$: por fuerza bruta y por gráfico

**(Desde [24:34], enumeración caso por caso.)** Andrea quiere verificar que el diseño de las cajas
es correcto: que la razón "personas en la fila sobre artículos máximos" sea, en general, a lo sumo
$1/6$. Recorriendo las 15 combinaciones con probabilidad positiva se ve que **solo tres** no cumplen
la condición: $(M,N)=(20,4)$, $(20,5)$, $(20,6)$. La forma directa (sumando las que sí cumplen) es
más larga:

$$
P\!\left(\frac NM\le\frac16\right)=P(N{=}0)+P(N{=}1)+P(N{=}2)+P(N{=}3)+P(M{=}40\cap N{=}4)
=\frac{97}{8192}+\frac{329}{4096}+\frac{1479}{8192}+\frac{423}{2048}+\frac13\left(\frac34\right)^{4}=\frac{2395}{4096}\approx 0.5847.
$$

**(Desde [27:00], por el complemento y el gráfico.)** Graficando el soporte se ve de inmediato que
conviene calcular el complemento (solo 3 puntos afuera contra 12 adentro):

$$
P\!\left(\frac NM\le\frac16\right)=1-P(M{=}20\cap N{=}4)-P(M{=}20\cap N{=}5)-P(M{=}20\cap N{=}6)
=1-\frac{1215}{8192}-\frac{729}{4096}-\frac{729}{8192}=\frac{2395}{4096}\approx 0.5847.
$$

Ambos caminos dan el mismo resultado; el segundo es mucho más corto y solo se nota mirando el
gráfico (ver Advertencias, más abajo).

### 5. Valores esperados de $M$ y de $N$

**(Desde [37:07], directo desde la conjunta con $E[g(X,Y)]=\sum\sum g(i,j)\,p_{X,Y}(i,j)$.)**

$$
E(M)=\sum_{i}\sum_{j} i\cdot p_{M,N}(i,j)=\frac{100}{3}\approx 33.33,\qquad
E(N)=\sum_{i}\sum_{j} j\cdot p_{M,N}(i,j)=\frac72=3.5.
$$

(Coincide con calcular $E(M)=20\cdot\frac12+40\cdot\frac13+60\cdot\frac16$ y $E(N)$ a partir de las
marginales ya obtenidas.)

### 6. Independencia

**(Desde [37:58]-[49:31].)** $M$ y $N$ **no** son independientes: por ejemplo
$P(M=40\cap N=6)=0$ pero $P(M=40)=\frac13>0$ y $P(N=6)=\frac{729}{8192}>0$, así que la conjunta no
se puede factorizar como producto de marginales. (Criterio general: el soporte $\{(i,j): p_{M,N}(i,j)>0\}$
no tiene forma de rectángulo, ver [[independencia-de-variables-aleatorias]].)

### 7. Covarianza

**(Desde [49:49].)** Falta $E(M\cdot N)=\sum_i\sum_j i\cdot j\cdot p_{M,N}(i,j)=100$ (muchos términos
se anulan cuando $j=0$). Entonces:

$$
\text{Cov}(M,N)=E(M\cdot N)-E(M)\,E(N)=100-\frac{100}{3}\cdot\frac72=100-\frac{350}{3}=-\frac{50}{3}\approx-16.67.
$$

**Resultado.** $\text{Cov}(M,N)=-\tfrac{50}{3}<0$, coherente con la intuición inicial del problema:
a mayor cantidad de artículos máximos de la caja elegida, en general menos personas por delante en
la fila (y viceversa). El video no calcula numéricamente $\sigma_M$, $\sigma_N$ ni $\rho_{M,N}$ para
este ejemplo; solo deja planteada la covarianza como cierre.

### Complemento: $E(N/M)$

**(Desde [47:38].)** Como aplicación adicional de $E[g(X,Y)]$, se calcula
$E\!\left(\dfrac NM\right)=\displaystyle\sum_{i}\sum_j \frac ji\cdot p_{M,N}(i,j)\approx 0.141667$,
que en efecto queda por debajo de $1/6\approx0.1667$: el diseño de las cajas cumple, en promedio, el
criterio que Andrea quería verificar (relacionado con el punto 4 de más arriba, pero mirando el
promedio de $N/M$ en vez de la probabilidad de que $N/M$ sea chico).

## Advertencias del docente

- **[09:29]** Al calcular $P(M=40)$ dice "acá [sic] debería decir hasta cuatro. Esto está mal" — se había
  escrito la suma hasta $j=6$ en vez de hasta $j=4$ (el máximo real de $N$ cuando $M=40$). Explica
  que el error se autocorrige solo: los términos con $j=5,6$ para $M=40$ dan combinatorio
  $\binom{4}{5}=\binom{4}{6}=0$ (tomar un conjunto más grande que el de abajo tiene cero formas), así
  que sumar de más no cambia el resultado, pero conviene no arrastrar el límite mal escrito.
- **[24:40]** Al plantear el umbral $N/M\le 1/6$ dice por error "un quinto" en vez de "un sexto" y se
  corrige de inmediato ("yo lo había cambiado", [24:57]). El umbral correcto usado en todo el ejercicio es
  $1/6$.
- **[27:12] — la advertencia más fuerte de la clase:** "lo que más quiero que se lleven para cuando
  tenemos dos variables que estamos analizando en conjunto es que graficar sirve siempre, siempre,
  siempre, siempre. No traten de esquivar graficar porque se van a perder de cosas." Lo ilustra
  mostrando que sin graficar hay que enumerar las 15 combinaciones y sumar 12 de ellas, mientras que
  graficando el soporte se ve de inmediato que conviene el complemento (sumar solo 3).
- **[38:44]** Insiste en que la independencia de variables es una condición **mucho más fuerte** que
  la independencia de un par de eventos puntuales: exige que **todos** los eventos asociados a una
  variable sean independientes de **todos** los asociados a la otra, para **todos** los valores
  posibles simultáneamente — no alcanza con verificar un par de valores.
- **[39:59]** Remarca que $E[XY]=E[X]E[Y]$ bajo independencia **no tiene recíproca**: "no vale al
  revés [...] siempre se puede encontrar un caso" en el que valga la igualdad sin que las variables
  sean independientes (coincide con lo ya escrito en [[covarianza-y-correlacion]] e
  [[independencia-de-variables-aleatorias]] sobre incorrelación vs. independencia).

## Páginas del wiki que toca

- [[variables-aleatorias-bidimensionales]]
- [[independencia-de-variables-aleatorias]]
- [[covarianza-y-correlacion]]
- [[esperanza-condicional]]
- [[funcion-de-variable-aleatoria]]
- [[tecnica-distribucion-de-una-funcion-de-va]]
