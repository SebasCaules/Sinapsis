---
titulo: Formulario — Variables Aleatorias Discretas
resumen: "Hoja de la unidad 3: masa, acumulada, esperanza, varianza y función generadora de momentos, las dos convenciones de la geométrica y la binomial negativa, aproximaciones entre distribuciones y teoría de la decisión."
tipo: formulario
unidad: 3
orden: 14
tags: [discreta, formulario, cheat-sheet]
fuentes: ["[[variable-aleatoria]]", "[[esperanza]]", "[[varianza]]", "[[funcion-generadora-de-momentos]]", "[[distribucion-geometrica]]", "[[distribucion-binomial-negativa]]", "[[distribucion-hipergeometrica]]", "[[distribucion-poisson]]", "[[teoria-de-la-decision-valor-esperado]]", "[[reconocer-distribucion-discreta]]", "[[tp3-variables-aleatorias-discretas]]"]
actualizado: 2026-09-04
---

# Formulario — Variables Aleatorias Discretas

Hoja de fórmulas de la unidad 3. Detalle en [[variable-aleatoria]],
[[funcion-de-distribucion-acumulada]] y las páginas de cada distribución. La tabla
comparativa de las seis distribuciones discretas (soporte, PMF, $E$, $V$, FGM) está
en [[formulario-maestro|el formulario maestro]], sección 3.

> Para elegir la distribución antes de aplicar cualquier fórmula, use el árbol de
> decisión de [[reconocer-distribucion-discreta]]: primero pregunte si el número de
> ensayos está fijo o si se repite hasta un éxito, y después si el muestreo es con
> o sin reposición.

## General (v.a.d.)

| Objeto | Fórmula |
|---|---|
| PMF | $p_X(k)=P(X=k)$, con $p_X\ge 0$ y $\sum_{k\in\mathcal{R}_X}p_X(k)=1$ |
| FDA | $F_X(k)=P(X\le k)=\sum_{y\in\mathcal{R}_X,\,y\le k}p_X(y)$ |
| PMF desde la FDA | $p_X(k)=F_X(k)-\lim_{x\to k^-}F_X(x)$ |
| Probabilidades de intervalo | $P(a<X\le b)=F_X(b)-F_X(a)$, $P(X>k)=1-F_X(k)$, $P(X<k)=F_X(k)-p_X(k)$ |
| Esperanza | $E[X]=\mu_X=\sum_{k\in\mathcal{R}_X}k\,p_X(k)$ |
| Ley del estadístico inconsciente | $E[g(X)]=\sum_{k\in\mathcal{R}_X}g(k)\,p_X(k)$ |
| Linealidad de la esperanza | $E[aX+bY+c]=a\,E[X]+b\,E[Y]+c$ |
| Varianza | $V(X)=\sigma_X^2=E[X^2]-\big(E[X]\big)^2$ |
| Varianza de una transformación afín | $V(aX+c)=a^2\,V(X)$, $\;\sigma(aX+c)=\lvert a\rvert\,\sigma(X)$ |
| Momento de orden $k$ | $E[X^k]=\sum_{x}x^k\,p_X(x)$ |
| FGM | $M_X(t)=E\big[e^{tX}\big]=\sum_{k\in\mathcal{R}_X}e^{tk}\,p_X(k)$ |
| Momentos vía FGM | $E[X^k]=M_X^{(k)}(0)$, $\;V(X)=M_X''(0)-\big(M_X'(0)\big)^2$ |

> En una v.a. discreta la diferencia entre $<$ y $\le$ **importa**: se separan por la
> masa puntual $p_X(k)$.

## Geométrica y binomial negativa — las dos convenciones

El punto más resbaladizo de la unidad: la cátedra cuenta **fracasos** y las slides
[[va-discretas-introduccion|de Pantazis]] cuentan **ensayos**. Con $q=1-p$:

| Objeto | Fórmula |
|---|---|
| Geométrica — fracasos: PMF | $p_X(k)=q^{\,k}\,p,\qquad k\in\mathbb{N}_0$ |
| Geométrica — fracasos: esperanza | $E[X]=\dfrac{q}{p}$ |
| Geométrica — fracasos: varianza | $V(X)=\dfrac{q}{p^2}$ |
| Geométrica — fracasos: cola | $P(X\ge m)=q^{\,m}$ |
| Geométrica — ensayos: PMF | $p_Y(k)=q^{\,k-1}\,p,\qquad k\in\mathbb{N}=\{1,2,\dots\}$ |
| Geométrica — ensayos: esperanza | $E[Y]=\dfrac{1}{p}$ |
| Geométrica — ensayos: momento de orden 2 | $E[Y^2]=\dfrac{1+q}{p^2}$ |
| Geométrica — ensayos: varianza | $V(Y)=\dfrac{q}{p^2}$ |
| Geométrica — relación entre convenciones | $Y=X+1\;\Rightarrow\;E[Y]=E[X]+1,\;V(Y)=V(X)$ |
| BinNeg — fracasos: PMF | $p_X(k)=\dbinom{k+r-1}{k}q^{\,k}p^{\,r},\qquad k\in\mathbb{N}_0$ |
| BinNeg — fracasos: esperanza | $E[X]=\dfrac{r\,q}{p}$ |
| BinNeg — fracasos: varianza | $V(X)=\dfrac{r\,q}{p^2}$ |
| BinNeg — caso $r=1$ | $\text{BinNeg}(1,p)=\text{Geom}(p)$ |

Regla práctica: si el enunciado pide "cuántos intentos / apuestas / personas se
eligen", es la versión de ensayos ($E=1/p$); si pide "cuántos fracasos / fallas
previas", es la de fracasos ($E=q/p$). Fuente: [[distribucion-geometrica]] y
[[distribucion-binomial-negativa]].

> ⚠️ Discrepancia: [[geometrica-apunte]] y [[tp3-variables-aleatorias-discretas]]
> definen la geométrica sobre los **fracasos** ($\mathcal{R}_X=\mathbb{N}_0$,
> $E[X]=q/p$), mientras que [[va-discretas-introduccion]] (slides, ejemplo del
> casino) la define sobre los **ensayos** ($\mathcal{R}_Y=\mathbb{N}$, $E[Y]=1/p$).
> Las dos versiones son correctas y se relacionan por $Y=X+1$; la varianza coincide.
> Lo mismo vale para la binomial negativa, donde la cátedra cuenta fracasos y otros
> textos cuentan ensayos totales.

## Falta de memoria (discreta)

La geométrica es la **única** distribución discreta sin memoria
([[distribucion-geometrica]]). Para $L,\Delta\in\mathbb{N}_0$:

- **Falta de memoria (discreta):** $P(X\ge L+\Delta\mid X\ge L)=P(X\ge\Delta)$
- **Falta de memoria — verificación por la cola:** $\dfrac{P(X\ge L+\Delta)}{P(X\ge L)}=\dfrac{q^{\,L+\Delta}}{q^{\,L}}=q^{\,\Delta}$

El cociente no depende de $L$: haber esperado ya $L$ fracasos no cambia cuánto
falta esperar. La análoga continua es la [[distribucion-exponencial|exponencial]].

## Aproximaciones entre distribuciones

- **Poisson aproxima a la binomial:** $\dbinom{n}{k}p^k(1-p)^{\,n-k}\;\approx\;\dfrac{(np)^k}{k!}\,e^{-np}$
- **Límite de Poisson:** $\lim_{n\to\infty}\dbinom{n}{k}p_n^{\,k}(1-p_n)^{\,n-k}=\dfrac{\lambda^k}{k!}\,e^{-\lambda}$
- **Hipergeométrica tiende a la binomial:** $\lim_{N\to\infty}P(X_N=k)=P(Y=k)$, con $Y\sim\text{Bin}(n,\,M/N)$
- **Hipergeométrica — varianza en forma factorizada:** $V(X)=n\,\dfrac{M}{N}\,\dfrac{N-M}{N}\,\dfrac{N-n}{N-1}$
- **Factor de corrección por población finita:** $\dfrac{N-n}{N-1}$

Condiciones de aplicación: la aproximación de Poisson pide $n$ grande y $p$ chico
con $\lambda=np$ moderado ([[poisson-aproximacion-binomial-apunte]]); la de la
hipergeométrica pide $N\gg n$ y $M,\,N-M\gg n$ ([[hipergeometrica-apunte]]).

## Tamaño de muestra mínimo

Patrón "¿cuántos ensayos hacen falta para observar al menos un éxito con
probabilidad $\ge 0{,}9$?" ([[distribucion-poisson]]):

- **Condición de partida:** $P(X_n\ge 1)=1-P(X_n=0)\ge 0{,}9\iff P(X_n=0)\le 0{,}1$
- **Cota exacta (binomial):** $n\ge\dfrac{-1}{\log_{10}(1-p)}$
- **Cota vía Poisson:** $n\ge\dfrac{-\ln(0{,}1)}{p}$

Las dos cotas difieren en una unidad para $p$ chico (con $p=0{,}01$ dan $230$ y
$231$): la binomial es la exacta, la de Poisson es conservadora.

## Teoría de la decisión (valor esperado)

Patrón de [[teoria-de-la-decision-valor-esperado]]: se elige un parámetro $k$ y la
ganancia depende de $k$ y de una v.a. $X$ que no se controla.

- **Ganancia esperada de la decisión $k$:** $E[G_k]=\sum_{x}G_k(x)\,p_X(x)$
- **Criterio de decisión:** $k^{*}=\arg\max_{k}E[G_k]$
- **Ganancia por casos (modelo del vendedor de diarios):** $G_k(X)=\begin{cases}v\,X-c\,k, & X<k\\ (v-c)\,k, & X\ge k\end{cases}$

Aquí $v$ es el precio de venta y $c$ el costo unitario; en
[[tp3-variables-aleatorias-discretas]] ej. 11 son $v=1$ y $c=0{,}40$. El óptimo
siempre cae dentro del recorrido de la demanda: por debajo del mínimo $E[G_k]$
crece con $k$ y por encima del máximo decrece.

## Cuándo usar qué

- **Número de ensayos fijo $n$, con reposición o población grande** → [[distribucion-binomial|Binomial$(n,p)$]]; con $n=1$, [[distribucion-bernoulli|Bernoulli$(p)$]].
- **Número de ensayos fijo $n$, sin reposición y población finita conocida ($N$, $M$)** → [[distribucion-hipergeometrica|Hipergeométrica]]; si $N\gg n$, aproxime por la binomial.
- **Se repite hasta el primer éxito** → [[distribucion-geometrica|Geométrica]]; verifique si el enunciado cuenta fracasos ($E=q/p$) o ensayos ($E=1/p$).
- **Se repite hasta el $r$-ésimo éxito** → [[distribucion-binomial-negativa|BinNeg$(r,p)$]], con $E=rq/p$.
- **Conteo de eventos en un intervalo de tiempo, espacio o volumen, con tasa $\lambda$ dada** → [[distribucion-poisson|Poisson$(\lambda)$]]; también como aproximación de la binomial con $n$ grande y $p$ chico.
- **Aparece "elegir cuánto producir / comprar / qué opción tomar"** → no es una distribución nueva: es [[teoria-de-la-decision-valor-esperado|maximizar $E[G_k]$]].
