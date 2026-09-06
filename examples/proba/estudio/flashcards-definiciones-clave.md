---
tipo: flashcards
titulo: 'Definiciones clave'
id: definiciones-clave
---

<!-- Generado por examples/proba/tools/convert-study-data.mjs desde estudio/study-data.js. -->

## Definición de esperanza $E[X]$ (caso discreto).

> pagina: esperanza

$E[X]=\sum_x x\,p_X(x)$. Es el promedio ponderado por probabilidad (centro de masa).

## Fórmula práctica de la varianza.

> pagina: varianza

$V(X)=E[X^2]-\big(E[X]\big)^2\ge 0$.

## ¿Qué es la FDA $F_X$ y sus propiedades?

> pagina: funcion-de-distribucion-acumulada

$F_X(x)=P(X\le x)$. No decreciente, continua por derecha, $F(-\infty)=0$, $F(+\infty)=1$. Discreta ⇒ escalonada.

## Relación entre densidad y FDA (continuas).

> pagina: funcion-de-densidad

$f_X(x)=F_X'(x)$ y $F_X(x)=\int_{-\infty}^x f_X(t)\,dt$. Además $\int_{\mathbb R} f=1$.

## Definición de la FGM y para qué sirve.

> pagina: funcion-generadora-de-momentos

$M_X(t)=E[e^{tX}]$. Genera momentos: $E[X^n]=M_X^{(n)}(0)$, y caracteriza la distribución (si existe en un entorno de 0).

## Probabilidad condicional y regla del producto.

> pagina: probabilidad-condicional

$P(A\mid B)=\dfrac{P(A\cap B)}{P(B)}$, con $P(B)>0$. Producto: $P(A\cap B)=P(B)\,P(A\mid B)$.

## Definición de independencia de dos eventos.

> pagina: independencia

$A,B$ independientes $\iff P(A\cap B)=P(A)\,P(B)\iff P(A\mid B)=P(A)$.

## Covarianza: fórmula práctica y signo.

> pagina: covarianza-y-correlacion

$\mathrm{Cov}(X,Y)=E[XY]-E[X]E[Y]$. $>0$ asociación directa, $<0$ inversa, indep. $\Rightarrow$ Cov$=0$ (no recíproco).

## Coeficiente de correlación $\rho$ y su rango.

> pagina: covarianza-y-correlacion

$\rho=\dfrac{\mathrm{Cov}(X,Y)}{\sigma_X\sigma_Y}\in[-1,1]$. $\rho=\pm1\iff$ relación lineal con probabilidad 1.
