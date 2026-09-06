---
titulo: Formulario — Función de V.A. y Bidimensionales
resumen: "Hoja de la unidad 5: distribución de una función de variable aleatoria, transformación afín, simulación por transformada inversa, conjuntas y marginales, condicionales, independencia, covarianza, correlación y mezclas."
tipo: formulario
unidad: 5
orden: 8
tags: [bidimensionales, funcion-de-variable-aleatoria, formulario, cheat-sheet]
fuentes: ["[[funcion-de-variable-aleatoria]]", "[[tecnica-distribucion-de-una-funcion-de-va]]", "[[variables-aleatorias-bidimensionales]]", "[[covarianza-y-correlacion]]", "[[independencia-de-variables-aleatorias]]", "[[esperanza-condicional]]", "[[mezcla-de-distribuciones]]", "[[tp5-2024]]"]
actualizado: 2026-09-04
---

# Formulario — Función de V.A. y Bidimensionales

Hoja de fórmulas de la unidad 5. El desarrollo completo está en
[[funcion-de-variable-aleatoria]], [[variables-aleatorias-bidimensionales]],
[[covarianza-y-correlacion]], [[independencia-de-variables-aleatorias]],
[[esperanza-condicional]] y [[mezcla-de-distribuciones]].

> **Técnica maestra de la unidad.** Casi todo se resuelve con dos movimientos.
> Primero: ante una función de una variable aleatoria, pasar por la FDA — escribir la
> acumulada de la nueva variable, traducir el evento a uno sobre la variable original y
> solo entonces derivar (receta en [[tecnica-distribucion-de-una-funcion-de-va]]).
> Segundo: ante un vector aleatorio, dibujar el soporte en el plano antes de integrar,
> porque los límites variables de la integral doble ([[tecnica-integrales-dobles]]) son
> el 80 % del ejercicio.

## Función de una variable aleatoria $Y=g(X)$

| Objeto | Fórmula |
|---|---|
| FDA de $Y$ (método general) | $F_Y(y)=P(Y\le y)=P\big(g(X)\le y\big)$ |
| Densidad de $Y$ (caso continuo) | $f_Y(y)=\dfrac{d}{dy}F_Y(y)$ |
| Masa de $Y$ (caso discreto) | $p_Y(k)=\displaystyle\sum_{x:\,g(x)=k} p_X(x)$ |
| $g$ creciente | $F_Y(y)=F_X\big(g^{-1}(y)\big)$ |
| $g$ decreciente | $F_Y(y)=1-F_X\big(g^{-1}(y)\big)$ |
| $g$ monótona estricta (cambio de variable) | $f_Y(y)=f_X\big(g^{-1}(y)\big)\left\lvert\dfrac{d}{dy}g^{-1}(y)\right\rvert$ |
| $g$ no inyectiva ($Y=X^2$) | $F_Y(y)=F_X(\sqrt{y})-F_X(-\sqrt{y})$ |

## Transformación afín $Y=aX+b$

| Objeto | Fórmula |
|---|---|
| Media | $\mu_Y=a\,\mu_X+b$ |
| Varianza y desvío | $\sigma_Y^2=a^2\sigma_X^2,\qquad \sigma_Y=\lvert a\rvert\,\sigma_X$ |
| Asimetría y curtosis | $\gamma_Y=\text{sign}(a)\,\gamma_X,\qquad \kappa_Y=\kappa_X$ |
| Covarianza con el original | $\text{Cov}(X,Y)=a\,\sigma_X^2=\text{sign}(a)\,\sigma_X\sigma_Y$ |
| Familia normal (cerrada por afines) | $X\sim N(\mu_X,\sigma_X)\;\Rightarrow\;Y=aX+b\sim N(a\mu_X+b,\,\lvert a\rvert\sigma_X)$ |

## Simulación por transformada inversa

- **Transformada inversa:** $Y=F_X^{-1}(U)$ con $U\sim\text{Unif}(0,1)\;\Rightarrow\;F_Y=F_X$.
- **Inversa generalizada** (sirve también en el caso discreto): $F_X^{\leftarrow}(u)=\min\{x:\,u\le F_X(x)\}$.

## Vector aleatorio $(X,Y)$: conjunta y marginales

| Objeto | Fórmula |
|---|---|
| Masa conjunta (V.A.D.) | $p_{X,Y}(x,y)=P(X=x,\,Y=y),\qquad \displaystyle\sum_{x}\sum_{y}p_{X,Y}(x,y)=1$ |
| Marginales (V.A.D.) | $p_X(x)=\displaystyle\sum_{y\in R_Y}p_{X,Y}(x,y),\qquad p_Y(y)=\sum_{x\in R_X}p_{X,Y}(x,y)$ |
| Esperanza de $h(X,Y)$ (V.A.D.) | $E[h(X,Y)]=\displaystyle\sum_{x\in R_X}\sum_{y\in R_Y}h(x,y)\,p_{X,Y}(x,y)$ |
| Densidad conjunta (V.A.C.) | $P\big((X,Y)\in B\big)=\displaystyle\iint_B f_{X,Y}(x,y)\,dx\,dy,\qquad \iint_{\mathbb{R}^2}f_{X,Y}=1$ |
| Marginales (V.A.C.) | $f_X(t)=\displaystyle\int_{-\infty}^{\infty}f_{X,Y}(t,y)\,dy,\qquad f_Y(u)=\int_{-\infty}^{\infty}f_{X,Y}(x,u)\,dx$ |
| Esperanza de $h(X,Y)$ (V.A.C.) | $E[h(X,Y)]=\displaystyle\iint_{\mathbb{R}^2}h(x,y)\,f_{X,Y}(x,y)\,dx\,dy$ |

## Condicionales y esperanza condicional

| Objeto | Fórmula |
|---|---|
| Densidad condicional | $f_{X\mid Y}(x\mid y)=\dfrac{f_{X,Y}(x,y)}{f_Y(y)}$ |
| Esperanza condicional (V.A.C.) | $E[h(X)\mid Y=y]=\displaystyle\int_{-\infty}^{\infty}h(x)\,f_{X\mid Y}(x\mid y)\,dx$ |
| Varianza condicional | $\text{Var}(X\mid Y)=E[X^2\mid Y]-\big(E[X\mid Y]\big)^2$ |
| Ley de esperanza total | $E[X]=E\big[E[X\mid Y]\big]$ |
| Ley de varianza total | $\text{Var}(X)=E\big[\text{Var}(X\mid Y)\big]+\text{Var}\big(E[X\mid Y]\big)$ |

## Independencia de $X$ e $Y$

| Objeto | Fórmula |
|---|---|
| Definición (V.A.D.) | $p_{X,Y}(x,y)=p_X(x)\,p_Y(y)\quad\forall x\in R_X,\,y\in R_Y$ |
| Definición (V.A.C.) | $f_{X,Y}(x,y)=f_X(x)\,f_Y(y)\quad\forall (x,y)\in\mathbb{R}^2$ |
| Esperanza del producto | $E[g_1(X)\,g_2(Y)]=E[g_1(X)]\,E[g_2(Y)]$ |
| Varianza de la suma | $\text{Var}(X+Y)=\text{Var}(X)+\text{Var}(Y)$ |
| Test del cero (descarta independencia) | $\exists\,(x,y):\ p_{X,Y}(x,y)=0,\ p_X(x)>0,\ p_Y(y)>0\ \Rightarrow\ X,Y\ \text{dependientes}$ |

## Covarianza y correlación

| Objeto | Fórmula |
|---|---|
| Definición | $\text{Cov}(X,Y)=E\big[(X-\mu_X)(Y-\mu_Y)\big]$ |
| Fórmula práctica | $\text{Cov}(X,Y)=E[XY]-\mu_X\,\mu_Y$ |
| Bilinealidad | $\text{Cov}(aX+b,\,cY+d)=ac\,\text{Cov}(X,Y)$ |
| Varianza de una combinación lineal | $\text{Var}(aX+bY)=a^2\text{Var}(X)+2ab\,\text{Cov}(X,Y)+b^2\text{Var}(Y)$ |
| Coeficiente de correlación | $\rho_{X,Y}=\dfrac{\text{Cov}(X,Y)}{\sigma_X\,\sigma_Y}$ |
| Cauchy-Schwarz (discriminante $\le0$) | $\big(\text{Cov}(X,Y)\big)^2\le\text{Var}(X)\,\text{Var}(Y)$ |
| Variables normalizadas | $\text{Var}\!\left(\dfrac{X}{\sigma_X}\pm\dfrac{Y}{\sigma_Y}\right)=2\pm2\rho_{X,Y}$ |
| Correlación extrema | $\rho_{X,Y}=\pm1\iff Y=aX+b\ \text{con prob. }1,\ \text{sign}(a)=\text{sign}(\rho_{X,Y})$ |

## Mezcla de distribuciones

| Objeto | Fórmula |
|---|---|
| FDA de la mezcla ($M$ discreta) | $F_X(x)=\displaystyle\sum_{k\in R_M}F_{X\mid M}(x\mid k)\,P(M=k)$ |
| Densidad de la mezcla | $f_X(x)=\displaystyle\sum_{k\in R_M}f_{X\mid M}(x\mid k)\,P(M=k)$ |
| Esperanza de la mezcla | $E[g(X)]=\displaystyle\sum_{k\in R_M}E[g(X)\mid M=k]\,P(M=k)$ |
| Momento de segundo orden (para la varianza) | $E[X^2]=\displaystyle\sum_{k}E[X^2\mid M=k]\,P(M=k)$ |
| Mezcla de exponenciales | $f_T(t)=\displaystyle\sum_{k}\lambda_k\,e^{-\lambda_k t}\,P(M=k)$ |
| Mezcla inversa ($X$ discreta, $Y$ continua) | $p_X(x)=\displaystyle\int_{\mathbb{R}}p_{X\mid Y}(x\mid y)\,f_Y(y)\,dy$ |

- **La varianza no se mezcla linealmente:** $\text{Var}(X)\neq\displaystyle\sum_{k}\text{Var}(X\mid M=k)\,P(M=k)$.

> Hay que pasar por el momento de segundo orden de la mezcla o por la ley de varianza
> total; es el error que la cátedra usa deliberadamente en los parciales (ver
> [[mezcla-de-distribuciones]]).

## Cuándo usar qué

- **Dan la distribución de una variable y piden la de una función de ella** → método de la FDA; si la función es afín, alcanzan la media y el desvío transformados, sin integrar.
- **La función es un cuadrado, un módulo o una parábola con el vértice dentro del soporte** → la preimagen tiene dos ramas: la acumulada es la diferencia de la FDA en las dos raíces.
- **Dan la densidad conjunta y piden una probabilidad o una esperanza** → integral doble sobre la región, con los límites leídos del dibujo del soporte.
- **Preguntan si dos variables son independientes** → primero el soporte (si no es rectangular, ya son dependientes); solo después la factorización en producto de marginales.
- **Aparece un dato por etapas o una población partida en grupos** → mezcla: esperanza total para la media y varianza total (o el momento de segundo orden) para la varianza.
- **Piden simular una distribución a partir de una uniforme** → transformada inversa, con la inversa generalizada si la acumulada tiene saltos.
