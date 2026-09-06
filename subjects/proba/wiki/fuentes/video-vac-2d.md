---
titulo: "Video — VAC 2D"
resumen: "Clase en video de Lucio Pantazis (unidad 5) sobre vectores aleatorios continuos: densidad conjunta, soporte no rectangular, marginales, valor esperado y covarianza, y la acumulada de la suma de dos variables dependientes."
tipo: fuente
formato: video
unidad: 5
url: "https://youtu.be/iUQrDpW4oNA"
duracion: "31:14"
docente: Lucio Pantazis
ingerido: 2026-09-03
---

# Video — VAC 2D

**Qué es:** clase del Dr. Lucio Pantazis sobre variables aleatorias bidimensionales
continuas, que repasa en paralelo el pasaje de discretas a continuas y después
desarrolla, de punta a punta, un único ejemplo extenso (densidad conjunta
constante sobre un soporte en forma de cuña).
**Cubre:** densidad conjunta, soporte, marginales, valor esperado y covarianza para
un vector continuo $(B,D)$; probabilidad de una región no rectangular del soporte;
distribución acumulada de la suma $T=B+D$ de dos variables continuas dependientes.
**Guía asociada:** Guía 5.

## Recorrido de la clase

| Timestamp | Tema |
|---|---|
| [00:04] | Repaso por paralelismo: todo lo visto para bidimensionales discretas se traduce a continuas cambiando "probabilidad puntual" por "densidad" y "suma" por "integral" (conjunta, marginales, condicionales, valor esperado, independencia, covarianza). |
| [05:03] | Arranca el ejemplo: Andrea vende banana y dulce de leche juntos; $B$ = gasto en banana, $D$ = gasto en dulce de leche (miles de pesos), con densidad conjunta $f_{B,D}(b,d)=k$ en $0\le b\le4,\ 2b\le d\le4b$. |
| [06:46] | Grafica el soporte (una cuña triangular entre las rectas $d=2b$ y $d=4b$, hasta $b=4$) y remarca que hay que graficar **antes** de plantear cualquier integral. |
| [11:22] | Halla la constante $k$ integrando la conjunta sobre el soporte: $k=1/16$. |
| [13:08] | Calcula la marginal $f_B(b)=b/8$ en $[0,4]$ y advierte: la conjunta es constante ("uniforme") pero la marginal **no** lo es. |
| [14:38] | Calcula $E(B)=8/3$ por dos caminos (integrando contra la conjunta y contra la marginal) y compara el costo de cada uno. |
| [15:39] | Muestra un error común al plantear $f_D(d)$: copiar los límites $2b$ y $4b$ tal cual (en función de $b$) para integrar en $b$, sin invertirlos en función de $d$. |
| [19:00] | Resuelve correctamente $f_D(d)$, partida en dos tramos ($0\le d\le8$ y $8<d\le16$). |
| [20:26] | Calcula $E(D)=8$, también por los dos caminos. |
| [21:39] | Calcula $\text{Cov}(B,D)=8/3$ a partir de $E(BD)=24$. |
| [22:26] | Plantea $P(B+D\le10)$: grafica la recta $b+d=10$ sobre el soporte para identificar la región a integrar. |
| [25:40] | Resultado: $P(B+D\le10)=5/12$. |
| [26:26] | Generaliza a la distribución acumulada de $T=B+D$: grafica cómo la recta $b+d=t$ va cortando el soporte a medida que $t$ crece, identificando los distintos casos. |
| [29:18] | Cierra $F_T(t)$ por tramos: $0$ si $t<0$; $t^2/240$ si $0\le t<12$; $t/4-3/2-t^2/160$ si $12\le t\le20$; $1$ si $t>20$. |
| [31:05] | Cierre de la clase: fin de bidimensionales continuas, transición a los últimos temas de la unidad. |

## Qué aporta sobre el apunte

La teoría general (conjunta, marginales, condicionales, valor esperado,
covarianza, independencia para el caso continuo) ya está en
[[teorica-bidimensionales-vac-intro]] y en [[variables-aleatorias-bidimensionales]],
que además trae el ejemplo resuelto de las piezas cilíndricas $(R,H)$. Este video no
repite esa teoría: aporta un **segundo ejemplo completo** con una geometría de
soporte distinta (una cuña, no un triángulo simple con $0<r<h$) y dos pasos que el
ejemplo del cilindro no cubre:

- **(a) Ejemplo resuelto completo, con dos piezas nuevas.** Además del flujo
  habitual (soporte → constante $k$ → marginales → $E(B)$, $E(D)$ →
  $\text{Cov}(B,D)$), agrega: (i) calcular la probabilidad de una región **no
  rectangular** acotada por una recta oblicua ($P(B+D\le10)$, con la región de
  integración partida en dos tramos porque la recta cruza dos lados distintos del
  soporte); (ii) la **distribución acumulada completa de la suma** $T=B+D$ de dos
  variables **dependientes**, resuelta gráficamente viendo cómo la recta móvil
  $b+d=t$ va cortando al soporte. Ninguna de las dos cosas está desarrollada en
  [[teorica-bidimensionales-vac-intro]] ni en [[funcion-de-variable-aleatoria]]
  (que solo cubre transformaciones $Y=g(X)$ de **una** variable).
- **(b) Intuición nueva.** Aclara con precisión qué significa "uniforme" para un
  vector bidimensional: no que cada eje por separado sea uniforme, sino que la
  densidad conjunta sea **constante en el soporte** — y por eso mismo las
  marginales pueden (y en este ejemplo lo hacen) dejar de ser uniformes ([13:08]).
  Es una precisión sobre la "sombra" que ya describe
  [[variables-aleatorias-bidimensionales]], pero puntualizada específicamente para
  el caso de densidad constante.
- **(c) Advertencias del docente.** Ver sección dedicada abajo.
- **(d) Énfasis.** El punto que más tiempo dedica a remarcar en toda la clase,
  repetido varias veces con distintas palabras, es que **graficar el soporte es
  indispensable** para plantear bien los límites de integración en regiones no
  rectangulares — no es opcional ni un paso "de repaso" ([01:53], [06:44],
  [14:16], [15:50], [19:34]-[19:52], [24:40]-[24:43]).

## Ejercicio resuelto en clase

*(Arranca en [05:03].) Andrea sabe que la combinación de banana con dulce de leche
es un manjar, así que pone un pote de dulce de leche al lado de las bananas y mide
el consumo conjunto de ambos productos. Sean $B$ = gasto en banana y $D$ = gasto en
dulce de leche, ambos medidos en miles de pesos. Concluye que ambos gastos se
distribuyen con la densidad conjunta*
$$ f_{B,D}(b,d) = \begin{cases} k & \text{si } 0\le b\le4,\ 2b\le d\le4b \\ 0 & \text{en caso contrario} \end{cases} $$

**1. Graficar el soporte** ([06:46]). El soporte es la región entre las rectas
$d=2b$ (piso) y $d=4b$ (techo), para $b$ entre $0$ y $4$: una cuña que arranca en
el origen y llega hasta el segmento $b=4$, $8\le d\le16$. El docente insiste en que
sin este gráfico es muy difícil identificar correctamente los límites de
integración en todo lo que sigue.

**2. Hallar $k$** ([11:22]). Como la densidad conjunta debe integrar $1$ sobre
$\mathbb{R}^2$ (y es nula fuera del soporte), basta integrar sobre el soporte:
$$ 1 = \int_0^4\!\int_{2b}^{4b} k\,dd\,db = k\int_0^4 (4b-2b)\,db = k\int_0^4 2b\,db = k\cdot\big(b^2\big)\Big|_0^4 = 16k. $$
$$ \Rightarrow\quad k=\frac{1}{16},\qquad f_{B,D}(b,d)=\begin{cases}\tfrac{1}{16} & 0\le b\le4,\ 2b\le d\le4b\\ 0 & \text{en caso contrario}\end{cases}. $$

**3. Marginal de $B$** ([13:08]). Para cada $b\in[0,4]$, $d$ se mueve en el soporte
entre $2b$ y $4b$:
$$ f_B(b) = \int_{2b}^{4b} \frac{1}{16}\,dd = \frac{1}{16}\,(4b-2b) = \frac{b}{8},\qquad 0\le b\le4. $$
El docente remarca aquí algo importante: la conjunta es constante ($1/16$ en todo el
soporte), pero $f_B$ **no** es constante en $b$ — crece linealmente. La razón
geométrica es que a medida que $b$ aumenta, el segmento vertical de soporte
($[2b,4b]$) se hace más largo (de longitud $2b$), así que se integra "más densidad
constante" cuanto mayor es $b$. Conclusión que remarca explícitamente: conjunta
uniforme (densidad constante) **no implica** marginales uniformes.

**4. Valor esperado de $B$** ([14:38]), por los dos caminos posibles — antes de
ocuparse de la marginal de $D$, el docente aprovecha que ya tiene $f_B$ recién
calculada:
$$ E(B) = \iint_{\mathbb{R}^2} b\cdot f_{B,D}(b,d)\,dd\,db = \int_0^4\!\int_{2b}^{4b} \frac{b}{16}\,dd\,db = \frac{8}{3}, $$
$$ E(B) = \int_0^4 b\cdot f_B(b)\,db = \int_0^4 \frac{b^2}{8}\,db = \frac{8}{3}. $$
El docente aclara que usar la marginal aquí parece más simple, pero solo porque ya
se la tenía calculada — no siempre calcular la marginal es el camino más corto.

**5. Marginal de $D$ — primero el error común** ([15:39]). El docente muestra una
resolución típicamente incorrecta:
$$ \text{MAL: } f_D(d) = \int_{2b}^{4b} \frac{1}{16}\,db \quad \Rightarrow \quad \text{da algo en función de } b,\text{ no de } d. $$
El problema es doble: (i) los límites de integración ($2b$, $4b$) están escritos en
función de $b$, que es justamente la variable que se está integrando, así que el
resultado depende de $b$ en vez de depender de $d$; (ii) aunque se corrijan los
límites, hay que pensar el gráfico **al revés**: fijar un valor de $d$ y ver entre
qué valores se mueve $b$ en el soporte para ese $d$ — no al revés. Despejando de
$d=2b$ y $d=4b$ se obtiene $b=d/2$ y $b=d/4$ respectivamente (los límites correctos
en función de $d$).

**Marginal correcta de $D$** ([19:00]). Viendo el gráfico, para cada $d$ los
límites de $b$ en el soporte cambian según el tramo:
- Si $0\le d\le8$: $b$ se mueve entre $d/4$ y $d/2$.
$$ f_D(d) = \int_{d/4}^{d/2} \frac{1}{16}\,db = \frac{1}{16}\Big(\frac{d}{2}-\frac{d}{4}\Big) = \frac{d}{64}. $$
- Si $8<d\le16$: $b$ se mueve entre $d/4$ y $4$ (el soporte se corta en $b=4$).
$$ f_D(d) = \int_{d/4}^{4} \frac{1}{16}\,db = \frac{1}{16}\Big(4-\frac{d}{4}\Big) = \frac{1}{4}-\frac{d}{64}. $$
$$ f_D(d) = \begin{cases} d/64 & 0\le d\le8 \\ 1/4 - d/64 & 8<d\le16 \\ 0 & \text{en caso contrario} \end{cases} $$

**6. Valor esperado de $D$** ([20:26]), también por los dos caminos:
$$ E(D) = \int_0^4\!\int_{2b}^{4b} \frac{d}{16}\,dd\,db = 8, \qquad E(D) = \int_0^8 \frac{d^2}{64}\,dd + \int_8^{16} d\Big(\frac{1}{4}-\frac{d}{64}\Big)dd = 8. $$

**7. Covarianza** ([21:39]). Se anticipa que $\text{Cov}(B,D)>0$ porque, por
construcción del soporte, cuando $B$ crece los valores posibles de $D$ también
suben. Falta $E(BD)$:
$$ E(B\cdot D) = \int_0^4\!\int_{2b}^{4b} \frac{b\cdot d}{16}\,dd\,db = \frac{1}{16}\int_0^4 b\cdot\frac{d^2}{2}\Big|_{2b}^{4b}\,db = \frac{1}{16}\int_0^4 6b^3\,db = 24. $$
$$ \text{Cov}(B,D) = E(BD) - E(B)E(D) = 24 - \frac{8}{3}\cdot8 = 24-\frac{64}{3} = \frac{8}{3}. $$

**8. Probabilidad del gasto combinado** ([22:26]). ¿Cuál es la probabilidad de que
el gasto total no supere los $10.000$ pesos, $P(B+D\le10)$? Conviene graficar la
recta $b+d=10$ (es decir $d=10-b$) sobre el soporte: corta al lado $d=4b$ en
$(2,8)$ y al lado $d=2b$ en $(10/3,20/3)$. Para $b\le2$ toda la franja vertical del
soporte queda por debajo de la recta; para $2<b\le10/3$ el techo pasa a ser la
recta $d=10-b$ en vez de $d=4b$:
$$ P(B+D\le10) = \int_0^2\!\int_{2b}^{4b} \frac{1}{16}\,dd\,db + \int_2^{10/3}\!\int_{2b}^{10-b} \frac{1}{16}\,dd\,db = \frac{1}{16}\Big(4 + \frac{100}{3}-\frac{50}{3}-20+6\Big) = \frac{5}{12}. $$
Resultado ([25:40]): es decir, casi la mitad de las veces el gasto combinado supera
los $10.000$ pesos.

**9. Distribución acumulada de $T=B+D$** ([26:26]). Se generaliza la idea anterior
para cualquier $t$: $F_T(t)=P(B+D\le t)$ se calcula viendo cómo la recta móvil
$b+d=t$ corta al soporte. Los cortes relevantes son con los dos lados de la cuña
($d=2b$ y $d=4b$) y con el borde vertical $b=4$; esos cortes ocurren en $t=12$
(la recta pasa por la esquina $(4,8)$) y en $t=20$ (pasa por la esquina $(4,16)$),
lo que da cuatro casos:
$$ F_T(t) = \begin{cases} 0 & t<0 \\[4pt] \dfrac{t^2}{240} & 0\le t<12 \\[8pt] \dfrac{t}{4}-\dfrac{3}{2}-\dfrac{t^2}{160} & 12\le t\le20 \\[8pt] 1 & t>20 \end{cases} $$
(Se puede verificar que $F_T$ es continua en $t=12$ y en $t=20$, y que con esta
FDA se podría derivar para obtener $f_T$ y de ahí $E(T)$ y $\text{Var}(T)$, aunque
el docente no llega a hacerlo en esta clase.)

**Resultado final:** $f_{B,D}(b,d)=1/16$ en la cuña $0\le b\le4,\ 2b\le d\le4b$;
$f_B(b)=b/8$; $f_D(d)$ partida en dos tramos; $E(B)=8/3$; $E(D)=8$;
$\text{Cov}(B,D)=8/3$ (positiva, como se anticipó); $P(B+D\le10)=5/12$; y $F_T(t)$
por tramos como arriba.

## Advertencias del docente

- **[15:50]** Sobre el error de plantear $f_D(d)=\int_{2b}^{4b}\tfrac{1}{16}\,db$ tal
  cual: "esto porque no grafican. Sí, está mal, mal." — lo atribuye directamente a
  no haber graficado el soporte antes de escribir la integral.
- **[16:26]-[16:57]** Explica la causa exacta del error: hay que "pensarlo al
  revés" — fijar el valor de la variable que se está calculando ($d$) y ver entre
  qué valores se mueve la otra ($b$), no dejar los límites en función de la
  variable que se integra.
- **[19:34]-[19:52]** Advertencia general, con tono de examen: "este ejercicio se
  van a equivocar si no grafican [...] con probabilidad uno" — y agrega que
  graficar no solo evita errores sino que hace el ejercicio genuinamente más fácil
  ("es más fácil hacer estos ejercicios graficando que sin graficar").
  Ver también [[variables-aleatorias-bidimensionales]] para el resto de la teoría
  de soporte y marginales.
- **[24:40]-[24:43]** Repite la advertencia una tercera vez, ya en el planteo de
  $P(B+D\le10)$: "les insisto, insisto, insisto, grafiquen, grafiquen, grafiquen,
  no es tan difícil, en serio."

## Páginas del wiki que toca
- [[variables-aleatorias-bidimensionales]]
- [[covarianza-y-correlacion]]
- [[funcion-de-variable-aleatoria]]
- [[independencia-de-variables-aleatorias]]
- [[esperanza-condicional]]
- [[tecnica-distribucion-de-una-funcion-de-va]]
