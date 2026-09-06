---
titulo: Suma de Variables Aleatorias Independientes
resumen: "Reúne los casos con nombre propio de la suma de independientes, donde la convolución cierra la familia: normal más normal da normal, Poisson más Poisson da Poisson, binomiales de igual $p$ dan binomial y $n$ exponenciales i.i.d. dan Erlang."
tipo: concepto
unidad: 7
orden: 2
tags: [suma-de-va, convolucion, independencia]
fuentes: ["[[teorica-suma-va-independientes]]", "[[teorica-suma-iid-bernoulli]]", "[[teorica-suma-binomiales]]", "[[teorica-suma-poisson]]", "[[teorica-suma-normales]]", "[[teorica-suma-uniformes]]", "[[teorica-suma-exponenciales]]", "[[tp7-suma-de-va]]", "[[video-suma-variables]]"]
actualizado: 2026-09-04
---

# Suma de Variables Aleatorias Independientes

**En breve.** Cuando dos v.a. independientes se suman, su distribución se obtiene
por **convolución**. Varias familias se mantienen al sumar (la suma de dos
Normales es Normal, de dos Poisson es Poisson, etc.): esta página reúne esos
casos con nombre propio.

Cuando $X,Y$ son **independientes**, la distribución de $S=X+Y$ se obtiene por
**convolución** (ver [[suma-de-variables-aleatorias]] para el marco general):
- discreta: $p_S(s)=\sum_{y\in R_Y} p_X(s-y)\,p_Y(y)$;
- continua: $f_S(s)=\int_{-\infty}^{+\infty} f_X(s-y)\,f_Y(y)\,dy$.

**Intuición de la convolución.** Para que $S=X+Y$ valga $s$, todo lo que $X$ "no
aporta" lo aporta $Y$: si $X=s-y$, entonces $Y=y$. Se barren todas las maneras de
repartir $s$ entre los dos sumandos y se suman (o integran) sus probabilidades.
Gráficamente es **deslizar una densidad reflejada sobre la otra** y acumular el
solapamiento. Atajo útil: cuando ambas tienen [[funcion-generadora-de-momentos|FGM]],
la FGM de la suma es el **producto** de las FGM, y eso muchas veces identifica la
familia sin integrar.

Esta página reúne los **casos con nombre propio**. En todos: $\mu_S=\mu_X+\mu_Y$
y $\sigma_S^2=\sigma_X^2+\sigma_Y^2$.

## Resumen (tabla de sumas estables / cerradas)
| Sumandos (independientes) | Suma $S=X+Y$ |
|---|---|
| $\mathrm{Bernoulli}(p)$, $n$ veces i.i.d. | $\mathrm{Bin}(n,p)$ |
| $\mathrm{Bin}(n_1,p)+\mathrm{Bin}(n_2,p)$ (misma $p$) | $\mathrm{Bin}(n_1+n_2,p)$ |
| $\mathrm{Poisson}(\lambda_1)+\mathrm{Poisson}(\lambda_2)$ | $\mathrm{Poisson}(\lambda_1+\lambda_2)$ |
| $\mathcal N(\mu_1,\sigma_1)+\mathcal N(\mu_2,\sigma_2)$ | $\mathcal N(\mu_1+\mu_2,\sqrt{\sigma_1^2+\sigma_2^2})$ |
| $\mathrm{Unif}(0,1)+\mathrm{Unif}(0,1)$ | **triangular** (NO uniforme) |
| $\mathrm{Exp}(\lambda)$, $n$ veces i.i.d. | $\mathrm{Gamma}(n,\lambda)=\mathrm{Erlang}_n(\lambda)$ |
| $\mathrm{Geo}(p)+\mathrm{Geo}(p)$ | $\mathrm{BinNeg}(2,p)$ |
| $\sum_{i=1}^n \mathcal N(0,1)^2$ | $\chi^2_n$ |

> Las que mantienen la **familia** se llaman **estables** (Normal, Cauchy) o,
> más generalmente, dan **distribuciones infinitamente divisibles** (Poisson,
> Gamma, Normal, $\chi^2$, BinNeg, Cauchy). Detalle en [[tp7-suma-de-va]].

## 1. Bernoulli → Binomial
Si $X_1,\dots,X_n\sim\mathrm{Bernoulli}(p)$ i.i.d. ($\mu=p$, $\sigma^2=pq$):
$$ S_n=\sum_{i=1}^n X_i\sim\mathrm{Bin}(n,p). $$
Es la **definición operativa** de la [[distribucion-binomial|Binomial]]: contar éxitos.

## 2. Binomial + Binomial → Binomial (misma $p$)
$X\sim\mathrm{Bin}(n_1,p)$, $Y\sim\mathrm{Bin}(n_2,p)$ indep. $\Rightarrow S\sim\mathrm{Bin}(n_1+n_2,p)$.
Demo por convolución + **identidad de Vandermonde**
$\binom{n_1+n_2}{k}=\sum_{\ell}\binom{n_1}{\ell}\binom{n_2}{k-\ell}$
(ver [[teorica-suma-binomiales]]). **Hace falta la misma $p$**.

## 3. Poisson + Poisson → Poisson
$X\sim\mathrm{Poisson}(\lambda_1)$, $Y\sim\mathrm{Poisson}(\lambda_2)$ indep.
$\Rightarrow S\sim\mathrm{Poisson}(\lambda_1+\lambda_2)$.
Demo por convolución + binomio de Newton (ver [[teorica-suma-poisson]]):
$$ p_S(s)=\frac{e^{-(\lambda_1+\lambda_2)}}{s!}\sum_{y=0}^s\binom{s}{y}\lambda_2^y\lambda_1^{s-y}=\frac{e^{-(\lambda_1+\lambda_2)}}{s!}(\lambda_1+\lambda_2)^s. $$

## 4. Normal + Normal → Normal
$X\sim\mathcal N(\mu_1,\sigma_1)$, $Y\sim\mathcal N(\mu_2,\sigma_2)$ indep.
$\Rightarrow S\sim\mathcal N\big(\mu_1+\mu_2,\sqrt{\sigma_1^2+\sigma_2^2}\big)$.
Demo: convolución de densidades + **completar cuadrados** en el exponente
(ver [[teorica-suma-normales]]). Los **desvíos NO suman**: suman las **varianzas**.

> [!figura] u7-los-desvios-se-suman-en-cuadratura
> Las tres campanas —todas centradas en 0 para que solo se compare el ancho— y, en punteado, la campana incorrecta que resultaría de sumar los desvíos: daría $\sigma_1+\sigma_2=7$ y no 5. El triángulo rectángulo de catetos $\sigma_1$ y $\sigma_2$ muestra por qué $\sigma_S$ es la hipotenusa y por qué nunca puede quedar por debajo del mayor de los dos.

**Intuición de por qué crece el desvío** (no solo la media). Al sumar $X$ e $Y$, un
valor alto de $X$ puede coincidir con uno alto de $Y$ y empujar la suma más arriba que
cualquiera de los dos por separado; simétricamente, valores bajos de ambas se combinan
hacia abajo. La dispersión de cada variable no se cancela al sumar, se **acumula** —por
eso $\sigma_S^2=\sigma_1^2+\sigma_2^2$ crece siempre, y nunca
$\sigma_S<\max(\sigma_1,\sigma_2)$ (según [[video-suma-variables]]).

## 5. Uniforme + Uniforme → triangular (no se conserva)
$X,Y\sim\mathrm{Unif}(0,1)$ indep. $\Rightarrow$ densidad **triangular** en $(0,2)$:
$$ f_S(s)=\begin{cases} s & 0<s<1\\ 2-s & 1\le s<2\\ 0 & \text{si no}\end{cases} $$
Ejemplo de familia **no estable** bajo suma (ver [[teorica-suma-uniformes]]).

> [!figura] u7-el-cuadrado-unidad-cortado-por-x-y-s
> La recta $x+y=s$ barre el cuadrado unidad y el largo de su tramo interior, medido sobre el eje $y$, es exactamente $f_S(s)$. Al deslizar $s$ se recorren los cuatro casos de la llave de arriba y se ve nacer el triángulo del panel derecho.

## 6. Exponenciales → Gamma / Erlang
$\tau_1,\dots,\tau_n\sim\mathrm{Exp}(\lambda)$ i.i.d. $\Rightarrow$
$$ T_n=\sum_{i=1}^n\tau_i\sim\mathrm{Gamma}(n,\lambda),\qquad f_{T_n}(t)=\frac{\lambda^n t^{\,n-1}e^{-\lambda t}}{(n-1)!}\;\;(t>0). $$
$T_n$ es el instante de la $n$-ésima ocurrencia de un [[proceso-de-poisson|proceso de Poisson]]
de tasa $\lambda$; la demo usa $\{T_n>t\}\Leftrightarrow\{N(t)\le n-1\}$
(ver [[teorica-suma-exponenciales]]). La $\mathrm{Gamma}(n,\lambda)$ con $n$ entero
es la [[distribucion-erlang|Erlang de orden $n$]]; sus momentos son
$E[T_n]=n/\lambda$ y $V(T_n)=n/\lambda^2$ (ver [[distribucion-gamma]]).

## 7. Geométrica + Geométrica → Binomial Negativa
Si $T_1,T_2\sim\mathrm{Geo}(p)$ i.i.d. (versión "fracasos", $R=\mathbb N_0$) independientes:
$$ S=T_1+T_2\sim\mathrm{BinNeg}(2,p). $$
Demo por convolución (probabilidad total sobre $T_1$, ver [[video-suma-variables]]):
$$ P(S=k)=\sum_{i=0}^k (1-p)^{k-i}p\cdot(1-p)^i p = (k+1)\,p^2(1-p)^k=\binom{k+1}{1}p^2(1-p)^k. $$
El factor $k+1$ es el combinatorio que identifica la Binomial Negativa. Generaliza a $n$
sumandos: $\mathrm{BinNeg}(n,p)+\mathrm{BinNeg}(m,p)=\mathrm{BinNeg}(n+m,p)$ (misma $p$);
la Geométrica es el caso particular $n=1$.

> ⚠️ Hay que sumar variables en la **misma versión** ("fracasos" o "intentos", nunca
> mezclar): cambia el recorrido y $E[S]$ de la suma.

## Ejercicio resuelto
*([[tp7-suma-de-va]], ej. 7 de la guía.) 30 instrumentos $D_1,\dots,D_{30}$ se usan en serie:
cuando uno falla empieza el siguiente. La duración de cada uno es
$\mathrm{Exp}(0.1\,\text{1/hora})$ y las duraciones son independientes. $T$ = tiempo
total de operación. ¿Probabilidad de que $T$ exceda 310 horas?*

**Planteo.** $T=\sum_{i=1}^{30}\tau_i$ con $\tau_i\sim\mathrm{Exp}(0.1)$ i.i.d.
Por el caso 6, $T\sim\mathrm{Gamma}(30,\,0.1)$.

**Valor exacto (vía Poisson).** Con $N\sim\mathrm{Poisson}(\lambda t)=\mathrm{Poisson}(0.1\cdot310)=\mathrm{Poisson}(31)$:
$$ P(T>310)=P(N<30)=\sum_{k=0}^{29}\frac{31^k}{k!}e^{-31}\approx 0.40465. $$

**Aproximación por TCL** (suma de 30 i.i.d.): $E[T]=30/0.1=300$, $V(T)=30/0.1^2=3000$.
$$ P(T>310)\approx 1-\Phi\!\left(\frac{310-300}{\sqrt{3000}}\right)=1-\Phi\!\left(\frac{1}{\sqrt{30}}\right)\approx 1-\Phi(0.1826)\approx 0.4276. $$

**Resultado.** Exacto $\approx 0.4047$; TCL $\approx 0.4276$ (aproximación razonable
para $n=30$). *(También podría acotarse con Markov/Chebyshev, pero la cota queda muy floja.)*

## Enlaces
- [[suma-de-variables-aleatorias]] (hub) · [[independencia]] · [[funcion-generadora-de-momentos]] (atajo para identificar la suma).
- Distribuciones: [[distribucion-binomial]] · [[distribucion-poisson]] ·
  [[distribucion-normal]] · [[distribucion-uniforme-continua]] · [[distribucion-exponencial]] ·
  [[distribucion-gamma]] · [[distribucion-erlang]] · [[distribucion-geometrica]] ·
  [[distribucion-binomial-negativa]] · [[distribucion-ji-cuadrado]].
- [[aproximacion-normal-de-la-binomial]] (caso 1 + TCL) · [[teorema-central-del-limite]].
