---
titulo: Variable Aleatoria Discreta
resumen: "Función que asigna un número real a cada resultado del experimento y toma valores separados (contables). Se describe con su función de masa $p_X(k)=P(X=k)$ o con su acumulada, y se resume con esperanza y varianza; es el objeto central de la unidad 3."
tipo: concepto
unidad: 3
orden: 1
tags: [discreta, variable-aleatoria, fundamental]
fuentes: ["[[va-discretas-introduccion]]", "[[tp3-variables-aleatorias-discretas]]", "[[video-vad-generales]]"]
actualizado: 2026-09-04
---

# Variable Aleatoria Discreta

**En breve.** Una v.a. discreta es una regla que le pone un número a cada
resultado de un experimento y toma valores "contables" (separados). Se describe
con su [[funcion-de-distribucion-acumulada|PMF o su FDA]], y se la resume con
[[esperanza|esperanza]] y [[varianza|varianza]]. Es el objeto central de la
unidad 3.

Una **variable aleatoria (v.a.)** es una función $X : \mathcal{S} \mapsto \mathbb{R}$
que transforma cada resultado del [[espacio-muestral-y-eventos|espacio muestral]]
$\mathcal{S}$ en un número real. La probabilidad de cada valor de $X$ hereda la
probabilidad del evento de $\mathcal{S}$ que le corresponde. Según
[[va-discretas-introduccion]], conviene definir una v.a. porque resume mucha
información de los eventos y permite operar con números (sumar, restar,
multiplicar), cosa que no tiene sentido con los resultados crudos del experimento
(no se puede sumar "blanco" + "celeste").

> Intuición: *variable* = magnitud que toma varios valores; *aleatoria* = un
> resultado que no se puede predecir.

## Recorrido

El **recorrido** $\mathcal{R}_X$ es el conjunto de valores que $X$ toma con
probabilidad positiva. Una v.a. es **discreta (V.A.D.)** cuando $\mathcal{R}_X$
es discreto: se puede construir un entorno alrededor de cada valor sin
solapamiento con otro valor del recorrido. Las probabilidades de todo el
recorrido suman 1.

> [!figura] u3-de-s-a-la-recta-la-particion-que-induce-una-v-a
> Cada columna de $S$ es un evento $\{X = k\}$, con ancho proporcional a su probabilidad, y $X$ la envía a un punto de la recta. Los entornos disjuntos alrededor de cada valor son los que hacen discreto al recorrido $\mathcal{R}_X$.

## Función de masa de probabilidad (PMF)

La **función de probabilidad puntual** o **función de masa de probabilidad
(PMF)** $p_X$ asigna a cada real su probabilidad:
$$ p_X : \mathbb{R} \mapsto [0,1] \,/\, p_X(k) = P(X = k) $$
Toma valor 0 fuera del recorrido. Cumple la condición de normalización:
$$ \sum_{k \in \mathcal{R}_X} p_X(k) = 1 $$
Los eventos $\{X = k\}$ para distintos $k$ son mutuamente excluyentes y forman
una **partición** de $\mathcal{S}$, por lo que se les puede aplicar
[[probabilidad-total-y-bayes|probabilidad total y Bayes]].

> **No confundir $p_X$ con $P$.** Según [[video-vad-generales]], el docente
> señala esto como "lo más costoso" de esta parte de la materia: $p_X$ es una
> función que toma un **número real** $k$ y devuelve su probabilidad puntual
> ($p_X:\mathbb{R}\mapsto[0,1]$), mientras que $P$ es una función que toma un
> **evento** (un subconjunto de $\mathcal{S}$) y devuelve su probabilidad. Son
> objetos de naturaleza distinta aunque estén relacionados por
> $p_X(k)=P(X=k)$.

## Función de distribución acumulada (FDA)

Ver página dedicada: [[funcion-de-distribucion-acumulada|Función de distribución acumulada]].
$$ F_X(k) = P(X \le k) $$
Es monótona no decreciente, continua a derecha, con $\lim_{k\to-\infty}F_X=0$ y
$\lim_{k\to+\infty}F_X=1$. Para una V.A.D. tiene forma escalonada (saltos en los
valores del recorrido).

## Esperanza, varianza y otros momentos

- **Esperanza (valor esperado / media)**: ver [[esperanza|Esperanza]].
$$ E[X] = \mu_X = \sum_{k \in \mathcal{R}_X} k\,p_X(k) $$
- **Varianza**: ver [[varianza|Varianza]].
$$ V(X) = \sigma_X^2 = E\!\left[(X-\mu_X)^2\right] = E[X^2] - (E[X])^2 $$
- **Momentos**: $E[X^k] = \sum_x x^k p_X(x)$. **Momentos centrados**:
  $E[(X-E[X])^k]$.
- **Asimetría y curtosis** (ver [[asimetria-y-curtosis]]):
  $$ \gamma(X) = \frac{E[(X-\mu_X)^3]}{\sigma_X^3}, \qquad
     \kappa(X) = \frac{E[(X-\mu_X)^4]}{\sigma_X^4} - 3 $$

> Estas fórmulas son la versión "probabilística" de las de
> [[datos-agrupados|datos agrupados]]: la frecuencia relativa $f_i/n$ converge a
> la probabilidad $P(X=k)$, según [[va-discretas-introduccion]].

## Función generadora de momentos (FGM)

Ver [[funcion-generadora-de-momentos|Función generadora de momentos]]: herramienta
$M_X(t) = E[e^{tX}]$ que codifica todos los momentos y caracteriza la distribución.

## Distribuciones discretas más usadas

- [[distribucion-bernoulli|Bernoulli]] — un único ensayo éxito/fracaso.
- [[distribucion-binomial|Binomial]] — número de éxitos en $n$ ensayos.
- [[distribucion-geometrica|Geométrica]] — fracasos hasta el primer éxito.
- [[distribucion-binomial-negativa|Binomial negativa (Pascal)]] — fracasos hasta el $r$-ésimo éxito.
- [[distribucion-hipergeometrica|Hipergeométrica]] — muestreo sin reposición.
- [[distribucion-poisson|Poisson]] — conteos en un intervalo.

Para decidir **cuál** usar frente a un enunciado, ver
[[reconocer-distribucion-discreta|cómo reconocer qué distribución discreta usar]].

## Ejercicio resuelto

**Enunciado** ([[tp3-variables-aleatorias-discretas]] ej. 2). La demanda diaria de
un artículo es una v.a. $D$ con recorrido $\mathcal{R}_D = \{1,2,3,4\}$ y función
de probabilidad $p_D(r) = C\,2^r/r!$ para $r \in \mathcal{R}_D$. Calcular la
constante $C$, $E[D]$ y $V(D)$.

**Planteo.** Usamos la condición de normalización $\sum_{r} p_D(r) = 1$.

**Cálculo.**
$$ C\left(\frac{2^1}{1!} + \frac{2^2}{2!} + \frac{2^3}{3!} + \frac{2^4}{4!}\right)
   = C\left(2 + 2 + \tfrac{8}{6} + \tfrac{16}{24}\right) = C\cdot 6 = 1
   \;\Rightarrow\; C = \tfrac{1}{6} $$
Las probabilidades quedan $p_D(1)=\tfrac13,\ p_D(2)=\tfrac13,\ p_D(3)=\tfrac29,\ p_D(4)=\tfrac19$.
$$ E[D] = 1\cdot\tfrac13 + 2\cdot\tfrac13 + 3\cdot\tfrac29 + 4\cdot\tfrac19 = \tfrac{19}{9} $$
$$ V(D) = E[D^2] - (E[D])^2 = \left(1^2\tfrac13 + 2^2\tfrac13 + 3^2\tfrac29 + 4^2\tfrac19\right) - \left(\tfrac{19}{9}\right)^2 = \tfrac{80}{81} $$

**Resultado.** $C = \tfrac16$, $E[D] = \tfrac{19}{9} \approx 2{,}11$, $V(D) = \tfrac{80}{81} \approx 0{,}99$.

### Ejercicio resuelto — construir la v.a.d. con un árbol (controladoras)

**Enunciado** ([[tp3-variables-aleatorias-discretas]] ej. 5). Un fabricante de
controladoras de discos rígidos prueba cada unidad. El 84 % pasa la prueba inicial
sin modificación. Las que fallan se reelaboran; de esas, el 75 % pasa una segunda
prueba. Las que fallan la segunda se rehacen de nuevo y se vuelven a probar; pasa
el 90 % y el resto se desarma. Sea $X$ = número de veces que se **reprocesa** una
controladora elegida al azar. (a) Recorrido y distribución; (b) $E[X]$ e
interpretación; (c) $V(X)$ y $\sigma_X$; (d) porcentaje que se desarma.

**Planteo.** Sea $A_i$ = "pasa la prueba $i$". Cada prueba solo se hace si falló la
anterior, así que los datos son **condicionales**:
$$P(A_1)=0{,}84,\quad P(A_2\mid \bar A_1)=0{,}75,\quad P(A_3\mid \bar A_2\cap\bar A_1)=0{,}90.$$
Ojo con el enunciado: si falla la tercera prueba **no** se reprocesa una tercera
vez, se desarma. Por eso $X$ se reprocesa **a lo sumo 2 veces** $\Rightarrow
\mathcal{R}_X=\{0,1,2\}$. Recorriendo el árbol de probabilidades:

- $X=0$: pasó la primera $\Rightarrow P(X=0)=P(A_1)=0{,}84$.
- $X=1$: falló la primera, pasó la segunda $\Rightarrow P(X=1)=P(\bar A_1)\,P(A_2\mid\bar A_1)=0{,}16\cdot 0{,}75=0{,}12$.
- $X=2$: falló las dos primeras $\Rightarrow P(X=2)=P(\bar A_1)\,P(\bar A_2\mid\bar A_1)=0{,}16\cdot 0{,}25=0{,}04$.

| $x$ | 0 | 1 | 2 |
|---|---|---|---|
| $p_X(x)$ | 0,84 | 0,12 | 0,04 |

(suman 1).

**Cálculo.**
$$E[X]=0\cdot 0{,}84 + 1\cdot 0{,}12 + 2\cdot 0{,}04 = 0{,}20$$
$$E[X^2]=0\cdot 0{,}84 + 1\cdot 0{,}12 + 4\cdot 0{,}04 = 0{,}28$$
$$V(X)=E[X^2]-(E[X])^2 = 0{,}28 - 0{,}20^2 = 0{,}24, \qquad \sigma_X=\sqrt{0{,}24}\approx 0{,}49$$
Para el ítem (d), desarmarse $=$ fallar las **tres** pruebas:
$$P(D)=P(\bar A_1)\,P(\bar A_2\mid\bar A_1)\,P(\bar A_3\mid\bar A_2\cap\bar A_1)=0{,}16\cdot 0{,}25\cdot 0{,}10=0{,}004.$$

**Resultado.** $E[X]=0{,}2$ reprocesamientos promedio por controladora (en 100
controladoras, $\approx 20$ reprocesamientos en total — distinto de la cantidad de
controladoras reprocesadas, porque una puede reprocesarse dos veces);
$V(X)=0{,}24$, $\sigma_X\approx 0{,}49$; se desarma el **0,4 %**. Es un buen ejemplo
de cómo se **construye** una v.a.d. a partir de un experimento por etapas:
árbol $\to$ PMF $\to E$, $V$ (ver también [[reconocer-distribucion-discreta]]).
