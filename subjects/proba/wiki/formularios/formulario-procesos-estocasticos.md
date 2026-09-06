---
titulo: Formulario — Procesos Estocásticos
resumen: "Hoja de la unidad 6: definiciones generales, caminata aleatoria, procesos de Bernoulli y de Poisson con la relación entre ambos, y cadenas de Markov con potencias de la matriz de transición, distribución estacionaria y tiempos medios."
tipo: formulario
unidad: 6
orden: 7
tags: [procesos-estocasticos, formulario, cheat-sheet]
fuentes: ["[[procesos-estocasticos]]", "[[caminata-aleatoria]]", "[[proceso-de-bernoulli]]", "[[proceso-de-poisson]]", "[[relacion-bernoulli-poisson]]", "[[cadenas-de-markov]]"]
actualizado: 2026-09-04
---

# Formulario — Procesos Estocásticos

Hoja de fórmulas de la unidad 6. Detalle en [[procesos-estocasticos]],
[[caminata-aleatoria]], [[proceso-de-bernoulli]], [[proceso-de-poisson]],
[[relacion-bernoulli-poisson]] y [[cadenas-de-markov]].

> **Técnica general.** Identifique primero el par (conjunto de índices, espacio de
> estados): tiempo discreto con estados discretos lleva a caminata, Bernoulli o
> cadena de Markov; tiempo continuo lleva a Poisson. Después decida si la pregunta
> es sobre un **conteo** (cuántos eventos en un tramo) o sobre un **tiempo** (cuánto
> falta hasta el evento $k$): la dualidad $T_k<t\iff N(t)\ge k$ traduce una en la
> otra. En cadenas de Markov casi todo se reduce a tres objetos: la potencia
> $\mathbb{P}^n$, el autovector a izquierda $\vec\pi$ y una inversa de matriz
> ($\mathbb{M}$ o $\mathbb{Z}$).

## Definiciones generales

| Objeto | Fórmula |
|---|---|
| Chapman-Kolmogorov (marginalización) | $p(x_1,t_1,\dots,x_{k-1},t_{k-1},x_{k+1},t_{k+1},\dots)=\sum_{x_k\in\mathbb{E}}p(x_1,t_1,\dots,x_k,t_k,\dots)$ |
| Proceso estacionario | $p(x_1,t_1{+}\Delta t,\dots,x_n,t_n{+}\Delta t)=p(x_1,t_1,\dots,x_n,t_n)$ |
| Incrementos independientes | $[t_1,t_2]\cap[t_3,t_4]=\emptyset\ \Rightarrow\ X(t_2)-X(t_1)\ \perp\ X(t_4)-X(t_3)$ |
| Incrementos estacionarios | $X(t_2)-X(t_1)\ \overset{d}{=}\ X(t_2{+}\Delta t)-X(t_1{+}\Delta t)$ |
| Propiedad de Markov | $p(x_n,t_n\mid x_{n-1},t_{n-1},\dots,x_1,t_1)=p(x_n,t_n\mid x_{n-1},t_{n-1})$ |
| Chapman-Kolmogorov (caso Markov) | $p(x_3,t_3\mid x_1,t_1)=\sum_{x_2}p(x_3,t_3\mid x_2,t_2)\,p(x_2,t_2\mid x_1,t_1)$ |

- **Proceso de conteo:** $N(t)=\max\{k:T_k\le t\}$, con $N(0)=0$ y $T_0=0$.

## Caminata aleatoria

- **Definición:** $X_n=\sum_{k=1}^{n}Y_k$, con $X_0=0$, $P(Y_k=+1)=p$, $P(Y_k=-1)=1-p$ i.i.d.
- **Caminata simétrica — distribución:** $P(X_n=x)=\binom{n}{\frac{n+x}{2}}\left(\tfrac12\right)^{n}$.
- **Caminata simétrica — momentos:** $E[X_n]=0$, $\operatorname{Var}[X_n]=n$.
- **Moneda cargada — distribución:** $P(X_n=k)=\binom{n}{(n+k)/2}\,p^{(n+k)/2}(1-p)^{(n-k)/2}$.
- **Moneda cargada — momentos:** $E[X_n]=n(2p-1)$, $\operatorname{Var}[X_n]=4np(1-p)$.
- **Vínculo con la binomial:** $X_n=2H_n-n$, con $H_n\sim\operatorname{Bin}(n,p)$.
- **Paso i.i.d. general:** $X_n=\sum_{i=0}^{n-1}Z_i\ \Rightarrow\ E[X_n]=n\,E[Z_0]$, $\operatorname{Var}[X_n]=n\operatorname{Var}[Z_0]$.
- **Caminata gaussiana:** $X_n=\sum_{k=1}^{n}G_k\sim N(0,\sqrt{n})$, con $G_k\sim N(0,1)$ i.i.d.

> ⚠️ Discrepancia: la resolución de [[tp6-procesos-estocasticos]] escribe la caminata
> gaussiana como $X_n\sim N(0,n)$, parametrizando la normal por la **varianza**,
> mientras que el resto del wiki la parametriza por el **desvío**, $N(\mu,\sigma)$
> (ver [[formulario-va-continuas]] y [[distribucion-normal]]). Se adopta aquí la
> convención del wiki, $N(0,\sqrt{n})$; ambas describen la misma ley, de varianza $n$
> y desvío $\sqrt{n}$. Ver la nota en [[caminata-aleatoria]].

## Proceso de Bernoulli

- **Axioma de un evento por paso:** $P\big(N(k{+}1)-N(k)=1\big)=p$.
- **Axioma de no simultaneidad (discreto):** $P\big(N(k{+}1)-N(k)=m\big)=0$ si $m>1$.
- **Conteo de éxitos:** $P(N(k)=n)=\binom{k}{n}p^n(1-p)^{k-n}$, es decir $N(k)\sim\operatorname{Bin}(k,p)$.
- **Incremento por estacionariedad:** $P\big(N(m)-N(k)=n\big)=P\big(N(m{-}k)=n\big)$, con $k\le m$.
- **Markov del conteo:** $P\big(N(m)=n_m\mid N(\ell)=n_\ell,N(k)=n_k\big)=P\big(N(m)=n_m\mid N(\ell)=n_\ell\big)$.

## Proceso de Poisson

- **Axioma infinitesimal de un evento:** $P\big(N(t{+}h)-N(t)=1\big)=\lambda h+o(h)$.
- **Axioma infinitesimal de no simultaneidad:** $P\big(N(t{+}h)-N(t)>1\big)=o(h)$.
- **Notación de infinitésimo:** $f(h)=o(h)\iff\lim_{h\to0}\frac{f(h)}{h}=0$.
- **Kolmogorov — estado 0:** $\dot P_0(t)=-\lambda P_0(t)$, con $P_0(0)=1$.
- **Kolmogorov — estado $n\ge1$:** $\dot P_n(t)=-\lambda P_n(t)+\lambda P_{n-1}(t)$, con $P_n(0)=0$.
- **Kolmogorov — primeras soluciones:** $P_0(t)=e^{-\lambda t}$, $P_1(t)=\lambda t\,e^{-\lambda t}$.
- **Conteo en $[0,t]$:** $P(N(t)=n)=\frac{(\lambda t)^n}{n!}e^{-\lambda t}$, con $E[N(t)]=\operatorname{Var}[N(t)]=\lambda t$.
- **Cola del tiempo entre eventos:** $P(\tau_{n+1}>t)=P(N(t)=0)=e^{-\lambda t}$, de donde $\tau_{n+1}\sim\operatorname{Expo}(\lambda)$.
- **Dualidad conteo-tiempo:** $T_k<t\iff N(t)\ge k$.
- **Condicionar el pasado al futuro:** $\big(N(t_1)\mid N(t_2)=n_2\big)\sim\operatorname{Bin}\!\left(n_2,\tfrac{t_1}{t_2}\right)$, con $t_1<t_2$.

## Relación Bernoulli ↔ Poisson

- **Correspondencia de parámetros:** $p=\lambda\,\Delta t$.
- **Aproximación binomial del conteo:** $N(t)\ \underset{\text{aprox}}{\sim}\ \operatorname{Bin}\!\left(\frac{t}{\Delta t},\,\lambda\,\Delta t\right)$.
- **Paso al límite:** $\binom{t/\Delta t}{n}(\lambda\Delta t)^n(1-\lambda\Delta t)^{\frac{t}{\Delta t}-n}\xrightarrow[\Delta t\to0]{}\frac{(\lambda t)^n}{n!}e^{-\lambda t}$.

## Cadenas de Markov

| Objeto | Fórmula |
|---|---|
| Un paso | $\vec p(n+1)=\vec p(n)\,\mathbb{P}(n)$ |
| Cadena homogénea | $\vec p(n)=\vec p(0)\,\mathbb{P}^{n}$, con $\mathbb{P}^{(k)}=\mathbb{P}^{k}$ |
| Distribución estacionaria | $\vec\pi=\vec\pi\,\mathbb{P}$, con $\sum_j\pi_j=1$ |

- **Condicionar hacia el pasado (Bayes):** $P\big(X(n){=}s_i\mid X(n{+}k){=}s_j\big)=\frac{P(X(n{+}k){=}s_j\mid X(n){=}s_i)\,P(X(n){=}s_i)}{P(X(n{+}k){=}s_j)}$.
- **Forma canónica con absorbentes:** $\mathbb{P}=\begin{pmatrix}\mathbb{I} & \mathbf{0}\\ \mathbb{F} & \mathbb{Q}\end{pmatrix}$.
- **Matriz fundamental de absorción:** $\mathbb{M}=(\mathbb{I}-\mathbb{Q})^{-1}$.
- **Probabilidades de absorción:** $\mathbb{G}=\mathbb{M}\,\mathbb{F}$.
- **Tiempo total hasta la absorción:** $\mathbb{M}\,(1,1,\dots,1)^{\top}$.
- **Matriz $\mathbb{Z}$ (cadena regular):** $\mathbb{Z}=(\mathbb{I}-\mathbb{P}+\mathbb{W})^{-1}$, con $\mathbb{W}$ de filas iguales a $\vec\pi$.
- **Tiempo esperado de primer paso:** $E(T_{i,j})=\frac{\mathbb{Z}(j,j)-\mathbb{Z}(i,j)}{w_j}$, para $i\ne j$.
- **Tiempo medio de recurrencia:** $E(T_{j,j})=\frac{1}{w_j}$.
- **Probabilidad de primera visita:** $q_{ij}(n)=P\big(X_n=j,\ X_m\ne j\ \forall\,1\le m\le n{-}1\mid X_0=i\big)$, con $q_{ij}=\sum_{n\ge1}q_{ij}(n)$.
- **Tiempo de vida geométrico (dos estados):** $P(N=k)=(1-p)^{k}p$, con $E[N]=\frac{1-p}{p}$.

El bloque $\mathbb{Z}$ / $E(T_{i,j})$ sale de [[video-tiempos-de-espera]]; la
primera visita y el tiempo de vida geométrico, de los ejercicios 22 y 24 de
[[tp6-procesos-estocasticos]].

## Cuándo usar qué

- Tiempo en **pasos discretos** con un $\pm1$ (o una ganancia i.i.d.) por paso → [[caminata-aleatoria]]: momentos por linealidad e independencia, distribución vía la binomial de éxitos.
- Tiempo en **pasos discretos** con "ocurre o no ocurre" y probabilidad fija $p$ → [[proceso-de-bernoulli]]: conteo Binomial, espera Geométrica, espera al $k$-ésimo Binomial negativa.
- **Tiempo continuo** con una tasa media $\lambda$ por unidad de tiempo → [[proceso-de-poisson]]: conteo Poisson, espera Exponencial, espera al $k$-ésimo Erlang; ajuste $\lambda$ a las unidades del intervalo.
- Piden un **tiempo** y la Erlang no tiene primitiva cerrada → pase a **conteos** por la dualidad conteo-tiempo y sume términos de Poisson.
- Pocos **estados discretos** con reglas "del actual al siguiente" → [[cadenas-de-markov]]: la potencia $\mathbb{P}^n$ para $n$ pasos y el autovector a izquierda $\vec\pi$ para el largo plazo (verifique **antes** la regularidad).
- Hay estados **absorbentes** → forma canónica y matriz fundamental $\mathbb{M}$; si la cadena es **regular** y preguntan cuánto se tarda en llegar o volver a un estado → matriz $\mathbb{Z}$ y los tiempos de primer paso.
