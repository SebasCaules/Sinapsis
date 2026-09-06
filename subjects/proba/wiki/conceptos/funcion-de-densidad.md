---
titulo: Función de Densidad de Probabilidad
resumen: 'Análogo continuo de la función de masa: una función $f_X\ge0$ que integra $1$ y cuya área da probabilidades, $P(a<X\le b)=\int_a^b f_X(x)\,dx$. No es una probabilidad y puede superar $1$; es la derivada de la FDA.'
tipo: concepto
unidad: 4
orden: 2
tags: [continua, densidad, pdf]
fuentes: ["[[teorica-va-continuas]]", "[[tp4-variables-aleatorias-continuas]]", "[[video-vac-generales]]"]
actualizado: 2026-09-04
---

# Función de Densidad de Probabilidad

**En breve.** Es el análogo continuo de la PMF discreta: una función $f_X\ge0$ que integra $1$ y cuyo **área** bajo un intervalo da la probabilidad de ese intervalo. Sirve para calcular probabilidades, [[esperanza|esperanzas]] y [[varianza|varianzas]] de una variable continua.

La **función de densidad de probabilidad** (pdf, *probability density function*)
$f_X$ de una [[variable-aleatoria-continua|variable aleatoria continua]] $X$ es la
derivada de su [[funcion-de-distribucion-acumulada|FDA]] donde esta sea derivable
([[teorica-va-continuas]]):

$$ f_X(x) = \frac{dF_X(x)}{dx}\quad\text{para todo } x\in\mathbb{R} \text{ donde } F_X \text{ es derivable}. $$

Recíprocamente, la FDA es la integral de la densidad:
$$ F_X(x)=\int_{-\infty}^{x} f_X(y)\,dy. $$

## Propiedades

1. **Integra 1:** $\displaystyle\int_{-\infty}^{+\infty} f_X(x)\,dx=\int_{\mathbb{R}} f_X(x)\,dx=1.$
2. **No negativa:** $f_X(x)\ge0$ para todo $x$ (consecuencia de que $F_X$ es no decreciente).

> [!figura] u4-fda-y-densidad-acopladas
> Un cursor recorre a la vez la FDA y la densidad: la altura $F_X(x)$ es el área acumulada bajo $f_X$, y la pendiente de la tangente a $F_X$ es $f_X(x)$. De ahí salen las dos propiedades de esta sección: el área total vale $1$ y $F_X$ no decrece porque $f_X\ge0$.

### Patrón típico de examen: hallar la constante $k$

([[video-vac-generales]], 26:53–29:59) Es habitual que la densidad de una v.a.c.
venga dada con una constante $k$ sin determinar (p. ej. $f_X(x)=k\cdot g(x)$ en cierto
soporte $[a,b]$, y $0$ fuera). Se despeja $k$ imponiendo la condición de
normalización $\int_{\mathbb R} f_X(x)\,dx=1$: si la densidad vale $0$ fuera de
$[a,b]$, alcanza con integrar $g$ sobre $[a,b]$ e igualar a $1$. El valor de $k$
suele no ser "lindo" (una fracción con números grandes), pero eso no es señal de
error: es solo una constante que se arrastra en los cálculos siguientes
(probabilidades, FDA, esperanza, etc.).

## Interpretación

**Intuición.** La densidad puede pensarse como "probabilidad por unidad de longitud" (igual que la densidad física es masa por unidad de volumen): no es una probabilidad en sí, sino una **tasa**. Por eso puede valer más que $1$ — lo que nunca pasa de $1$ es el **área** $f_X(x)\,\Delta x$ acumulada sobre un intervalo. Cuanto más alta es la densidad en una zona, más concentrada está ahí la probabilidad.

> [!figura] u4-densidad-por-ancho-es-probabilidad
> El rectángulo de base $\Delta x$ y altura $f_X(x)$ se superpone al área exacta del mismo intervalo. Note que la densidad puede superar $1$ mientras el área nunca lo hace, y que los dos números se acercan al achicar $\Delta x$.

La densidad **no** es una probabilidad: $f_X(x)$ puede ser mayor que $1$. Lo que
aproxima una probabilidad es $f_X$ por un ancho pequeño ([[teorica-va-continuas]]):
$$ f_X(\alpha)\,\Delta x \approx P\!\left(X\in\left(x-\tfrac{\Delta x}{2},\,x+\tfrac{\Delta x}{2}\right]\right)\quad\text{si }\Delta x\text{ es chico}. $$

La probabilidad de un intervalo es el área bajo la densidad:
$$ P(a<X\le b)=\int_a^b f_X(x)\,dx = F_X(b)-F_X(a). $$

> Nota: el valor de $f_X$ en un punto aislado no importa para las probabilidades,
> porque $P(X=\alpha)=0$. Por eso da igual definir o no la densidad en los
> bordes del soporte (ej.: en la [[distribucion-uniforme-continua|uniforme]] no
> se define $f_X$ en $a$ ni en $b$).

## Esperanza y momentos a partir de la densidad

$$ E[g(X)]=\int_{-\infty}^{+\infty} g(x)\,f_X(x)\,dx,\qquad E[X^k]=\int_{-\infty}^{+\infty} x^k\,f_X(x)\,dx. $$
En particular la [[esperanza|esperanza]] $\mu_X=\int x\,f_X\,dx$ y la
[[varianza|varianza]] $\sigma_X^2=\int (x-\mu_X)^2 f_X\,dx=E[X^2]-(E[X])^2$.

## Complementos matemáticos (técnicas de cálculo)

La densidad es el objeto central de varias técnicas de los Complementos Matemáticos:
- **[[tecnica-integrales-impropias]]** — la normalización $\int_{\mathbb R} f_X=1$ y
  los momentos $E[X^k]$ sobre soporte no acotado son integrales impropias.
- **[[tecnica-integrales-dobles]]** — en el caso bidimensional, probabilidades y
  esperanzas se calculan integrando la densidad conjunta sobre una región del plano.
- **[[tecnica-derivadas-parciales]]** — la densidad se recupera **derivando** la
  [[funcion-de-distribucion-acumulada|FDA]] ($f_X=F_X'$ en 1D; densidad conjunta
  $=\partial^2 F/\partial x\,\partial y$ en 2D).

## Cómo se relaciona con la PMF discreta

| | v.a. discreta | v.a. continua |
|---|---|---|
| objeto base | PMF $p_X(x)=P(X=x)$ | densidad $f_X(x)$ |
| "normalización" | $\sum_x p_X(x)=1$ | $\int_{\mathbb{R}} f_X=1$ |
| esperanza | $\sum_x x\,p_X(x)$ | $\int_{\mathbb{R}} x\,f_X(x)\,dx$ |
| $P(X=x)$ | $p_X(x)$ (puede ser $>0$) | siempre $0$ |

## Ejercicio resuelto

**Fuente:** [[tp4-variables-aleatorias-continuas]] ej. 14 a) (Weibull, resuelto en la guía).

**Enunciado.** La duración $X$ (en miles de horas) sigue una distribución de
[[distribucion-weibull|Weibull]] con FDA $F_X(x)=1-e^{-(\lambda x)^b}$ para $x>0$,
con $b=2$ y $\lambda=0.01$. Obtener la densidad $f_X$.

**Planteo.** La densidad es la derivada de la FDA donde existe; como $F_X=0$ para
$x\le0$, su derivada también es $0$ ahí.

**Cálculo.** Para $x>0$, con $b=2$, $\lambda=0.01$:
$$ f_X(x)=\frac{d}{dx}\Big[1-e^{-(0.01x)^2}\Big]=-e^{-(0.01x)^2}\cdot\big[-(0.01x)^2\big]'. $$
Como $\big[(0.01x)^2\big]'=2\cdot0.01x\cdot0.01=0.0002\,x$,
$$ f_X(x)=0.0002\,x\,e^{-(0.01x)^2}. $$

**Resultado.**
$$ f_X(x)=\begin{cases} 0.0002\,x\,e^{-(0.01x)^2} & x>0\\[2pt] 0 & x\le0.\end{cases} $$
(En general, $f_X(x)=\lambda b(\lambda x)^{b-1}e^{-(\lambda x)^b}$ para $x>0$.)
