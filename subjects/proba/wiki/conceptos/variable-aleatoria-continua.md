---
titulo: Variable Aleatoria Continua
resumen: 'Variable aleatoria con acumulada continua: toma valores en un continuo, cumple $P(X=\alpha)=0$ y se describe por su densidad. Probabilidades, esperanza y varianza pasan de sumas a integrales, y da lo mismo usar $<$ que $\le$.'
tipo: concepto
unidad: 4
orden: 1
tags: [continua, variable-aleatoria, fda, densidad]
fuentes: ["[[teorica-va-continuas]]", "[[tp4-variables-aleatorias-continuas]]", "[[video-vac-generales]]"]
actualizado: 2026-09-04
---

# Variable Aleatoria Continua

**En breve.** Es una [[variable-aleatoria|variable aleatoria]] cuya [[funcion-de-distribucion-acumulada|FDA]] es continua (sin saltos): toma valores en un continuo, su probabilidad puntual es $0$ y se describe por una [[funcion-de-densidad|densidad]]. Probabilidades, [[esperanza|esperanza]] y [[varianza|varianza]] pasan de sumas (caso discreto) a **integrales**.

Una **variable aleatoria continua** (v.a.c.) es una [[variable-aleatoria|variable aleatoria]]
$X$ que toma valores en un continuo de $\mathbb{R}$ y cuya probabilidad
puntual es nula. Según [[teorica-va-continuas]] y [[tp4-variables-aleatorias-continuas]]
hay tres caracterizaciones equivalentes:

$$ X \text{ es v.a.c.} \iff F_X \text{ es continua} \iff P(X=\alpha)=0\quad\forall\alpha\in\mathbb{R}. $$

Además $P(X\in\mathbb{R})=1$. El caso $P(X=\alpha)=0$ **no** ocurre con una
variable aleatoria discreta (v.a.d.), donde la [[funcion-de-distribucion-acumulada|FDA]]
tiene saltos (forma de "escalera") en los puntos del recorrido.

> Ejemplo intuitivo ([[teorica-va-continuas]]): si $X=$ altura en cm de un alumno
> tomado al azar, entonces $P(X=173\text{ cm})=0$, e incluso
> $P(X=173.0000\ldots)=0$.

**Intuición ($P(X=\alpha)=0$).** Hay infinitos valores posibles en cualquier intervalo, así que la probabilidad de "pegarle exactamente" a uno es nula. Lo que tiene probabilidad positiva son los **intervalos**: se pregunta $P(172.5<X<173.5)$, no $P(X=173)$. Una consecuencia cómoda es que $<$ y $\le$ dan lo mismo (no hay que cuidar los bordes, a diferencia del caso discreto).

## Función de distribución acumulada (FDA)

Toda v.a. (discreta o continua) tiene [[funcion-de-distribucion-acumulada|FDA]]
$F_X:\mathbb{R}\to[0,1]$, $F_X(\alpha)=P(X\le\alpha)$, con las propiedades:

1. **No decreciente:** $\alpha\le\beta \Rightarrow F_X(\alpha)\le F_X(\beta)$ (creciente, no estrictamente).
2. $\displaystyle\lim_{\alpha\to-\infty}F_X(\alpha)=0$.
3. $\displaystyle\lim_{\alpha\to+\infty}F_X(\alpha)=1$.
4. $P(\alpha<X\le\beta)=P(X\in(\alpha,\beta])=F_X(\beta)-F_X(\alpha)$.

> [!figura] u4-fda-escalera-vs-continua
> Compare el incremento $F_X(\alpha)-F_X(\alpha-\delta)$ en una FDA en escalera y en una FDA continua. Al achicar $\delta$, en la escalera el incremento se estanca en el tamaño del salto —que es $P(X=\alpha)$—, mientras que en la continua colapsa a cero.

Para una v.a.c. $F_X$ es **continua**, y por eso da igual usar $<$ o $\le$:
$$ P(a<X<b)=P(a\le X\le b)=F_X(b)-F_X(a). $$

> **Chequeo práctico para detectar errores ([[video-vac-generales]], 37:28):** Cuando la densidad de una v.a.c. está definida por tramos, la FDA resultante también queda partida. Como $F_X$ tiene que ser continua, conviene verificar que los tramos **empalmen** en los bordes del soporte (p. ej., que el tramo intermedio dé $0$ al evaluarlo en el extremo inferior del soporte y $1$ en el extremo superior, coincidiendo con los tramos vecinos). Si no coincide, hay un error en la cuenta.

## Función de densidad

La densidad se obtiene derivando la FDA: $f_X(x)=\dfrac{dF_X(x)}{dx}$ (ver
[[funcion-de-densidad|Función de densidad]] para detalle). Recíprocamente,
$$ F_X(x)=\int_{-\infty}^{x} f_X(y)\,dy,\qquad \int_{-\infty}^{+\infty} f_X(y)\,dy = 1. $$

## Esperanza como integral

La versión continua de la [[esperanza|esperanza]] reemplaza la suma de la v.a.d.
por una integral (es el límite de discretizar la v.a.c. con datos agrupados,
[[teorica-va-continuas]]):

$$ \mu_X = E[X] = \int_{-\infty}^{+\infty} x\, f_X(x)\,dx. $$

> [!figura] u4-discretizacion-a-integral
> Discretice la densidad $f_X(x)=2x$ en intervalos de ancho $2\delta$ y compare $\sum_i x_i\,p_i$ con el valor exacto $E[X]=2/3$. Observe que al achicar $\delta$ la suma converge, y que correr la grilla cambia la aproximación pero no el límite.

Más en general, el valor esperado de una función $g$ y los momentos son
$$ E[g(X)] = \int_{-\infty}^{+\infty} g(x)\,f_X(x)\,dx,\qquad E[X^k] = \int_{-\infty}^{+\infty} x^k\,f_X(x)\,dx. $$

## Varianza como integral

La versión continua de la [[varianza|varianza]]:
$$ \sigma_X^2 = \operatorname{Var}(X) = E[(X-\mu_X)^2] = \int_{-\infty}^{+\infty} (x-\mu_X)^2\, f_X(x)\,dx = E[X^2]-(E[X])^2, $$
con $E[X^2]=\int_{-\infty}^{+\infty} x^2\,f_X(x)\,dx$. Siempre $\sigma_X^2\ge0$.

## Esperanza por la cola (fórmula de supervivencia)

Para una v.a.c. **no negativa** ($X\ge0$), la esperanza se puede calcular integrando la
**función de supervivencia** $P(X>x)=1-F_X(x)$ en lugar de $x\,f_X(x)$
([[tp4-variables-aleatorias-continuas]] ej. 34-36):
$$ E[X]=\int_0^{+\infty}\big(1-F_X(x)\big)\,dx=\int_0^{+\infty}P(X>x)\,dx. $$
Es útil cuando se conoce $F_X$ (o $P(X>x)$) pero la densidad es incómoda de integrar. Surge
de intercambiar el orden de integración en $E[X]=\int_0^\infty\!\int_0^x f_X(x)\,dy\,dx$.

Ejemplo (exponencial): $\int_0^\infty e^{-\lambda x}\,dx=\tfrac1\lambda=E[X]$, consistente con
$E[X]=1/\lambda$ de la [[distribucion-exponencial|exponencial]].

## Integrales impropias

Como el soporte suele ser no acotado, conviene recordar
([[tecnica-integrales-impropias|integrales impropias]]):
$$ \int_a^{+\infty} w(x)\,dx=\lim_{t\to+\infty}\int_a^{t} w(x)\,dx, $$
y análogamente para $-\infty$ y para puntos donde $w$ no está definida.

## Distribuciones continuas usuales

- [[distribucion-uniforme-continua|Uniforme]] $\text{Unif}(a,b)$.
- [[distribucion-exponencial|Exponencial]] $\text{Expo}(\lambda)$.
- [[distribucion-normal|Normal]] $N(\mu,\sigma)$.

## Ejercicio resuelto

### Ejercicio resuelto — densidad simple, mediana

**Fuente:** [[tp4-variables-aleatorias-continuas]] ej. 3 (resuelto en la guía).

**Enunciado.** La densidad de $X$ es $f_X(x)=2(1-x)$ para $x\in(0,1)$ y $0$ fuera.
Calcular $E[X]$, $\operatorname{Var}[X]$ y la mediana $m$ definida por $P(X<m)=1/2$.

**Planteo.** El recorrido es $(0,1)$, así que las integrales van de $0$ a $1$.

**Cálculo.**
$$ E[X]=\int_0^1 x\cdot 2(1-x)\,dx=\int_0^1 (2x-2x^2)\,dx=\Big[x^2-\tfrac{2}{3}x^3\Big]_0^1=1-\tfrac23=\tfrac13. $$
$$ E[X^2]=\int_0^1 x^2\cdot 2(1-x)\,dx=\int_0^1 (2x^2-2x^3)\,dx=\Big[\tfrac23 x^3-\tfrac12 x^4\Big]_0^1=\tfrac23-\tfrac12=\tfrac16. $$
$$ \operatorname{Var}[X]=E[X^2]-(E[X])^2=\tfrac16-\tfrac19=\tfrac{3-2}{18}=\tfrac1{18}. $$
Para la mediana,
$$ P(X<m)=\int_0^m 2(1-x)\,dx=2m-m^2=\tfrac12. $$
Resolviendo $m^2-2m+\tfrac12=0$ en $(0,1)$ se obtiene $m=1-\tfrac{1}{\sqrt2}$.

**Resultado.** $E[X]=\tfrac13$, $\operatorname{Var}[X]=\tfrac1{18}$, $m\approx0.293$.

### Ejercicio resuelto — densidad partida con constante a determinar (temperatura)

**Fuente:** [[video-vac-generales]] (26:53–45:27).

**Enunciado.** La temperatura $T$ (en °C) de un día de verano es una v.a.c. con densidad
$$
f_T(t) = \begin{cases} k\,(t-25)^2\,(40-t) & 25 \le t \le 40 \\ 0 & \text{en otro caso.} \end{cases}
$$
Hallar $k$; calcular $P(35\le T\le 37)$; la FDA $F_T(t)$; $E(T)$ y $V(T)$; la mediana y los cuartiles/percentil 5.

**Hallar $k$.** Imponiendo $\int_{\mathbb R} f_T = 1$ y usando que $f_T=0$ fuera de $[25,40]$:
$$ k\int_{25}^{40} (t-25)^2(40-t)\,dt = 1 \;\Longrightarrow\; k=\frac{4}{16875}. $$
(la primitiva del polinomio es $-\tfrac{t^4}{4}+30t^3-\tfrac{2625}{2}t^2+25000t$).

**$P(35\le T\le 37)$.**
$$
P(35\le T\le 37)=\frac{4}{16875}\left(-\frac{t^4}{4}+30t^3-\frac{2625}{2}t^2+25000t\right)\Big|_{35}^{37} = \frac{3824}{16875}\approx 0.2266.
$$

**FDA por tramos.**
$$
F_T(t)=\begin{cases}
0 & t<25\\[6pt]
\dfrac{4}{16875}\left(-\dfrac{t^4}{4}+30t^3-\dfrac{2625}{2}t^2+25000t-\dfrac{703125}{4}\right) & 25\le t\le 40\\[8pt]
1 & t>40
\end{cases}
$$
Como chequeo, el tramo del medio da $0$ en $t=25$ y $1$ en $t=40$: empalma con los tramos vecinos.

**$E(T)$ y $V(T)$.**
$$ E(T)=\int_{25}^{40} t\,f_T(t)\,dt = 34,\qquad V(T)=E(T^2)-E(T)^2=9\;\Rightarrow\;\sigma_T=3. $$
($E(T)=34$ cae dentro del soporte $[25,40]$, como debe ser.)

**Mediana y cuantiles.** La mediana de una v.a.c. es $x_{0.5}$ tal que $F_T(x_{0.5})=0.5$; en general el cuantil $\alpha$ es $x_\alpha$ con $F_X(x_\alpha)=\alpha$. Aquí $F_T$ no invierte en forma cerrada, así que se resuelve numéricamente:
$$ x_{0.5}\approx 34.21,\qquad Q_1=x_{0.25}\approx 31.84,\qquad Q_3=x_{0.75}\approx 36.35,\qquad P_5=x_{0.05}\approx 28.73. $$

**Resultado.** $k=4/16875$; $P(35\le T\le 37)\approx0.2266$; $E(T)=34$; $V(T)=9$ ($\sigma_T=3$); mediana $\approx34.21$; $Q_1\approx31.84$, $Q_3\approx36.35$, $P_5\approx28.73$.
