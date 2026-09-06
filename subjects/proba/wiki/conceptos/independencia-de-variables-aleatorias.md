---
titulo: Independencia de Variables Aleatorias
resumen: 'Hay independencia cuando la conjunta se factoriza, $f_{X,Y}=f_X\,f_Y$; entonces $E[XY]=E[X]E[Y]$ y la covarianza es nula. El recíproco falla salvo en el caso normal, y un soporte no rectangular delata dependencia.'
tipo: concepto
unidad: 5
orden: 5
tags: [bidimensionales, independencia]
fuentes: ["[[teorica-independencia-vad]]", "[[teorica-bidimensionales-vac-intro]]", "[[tp5-2024]]"]
actualizado: 2026-09-04
---

# Independencia de Variables Aleatorias

**En breve.** $X$ e $Y$ son independientes cuando saber una no dice nada sobre la otra; el test
formal es que la conjunta se factorice como producto de marginales ($f_{X,Y}=f_X f_Y$), lo que
implica $\text{Cov}=0$ pero **no** al revés.

Dos [[variables-aleatorias-bidimensionales|variables aleatorias]] $X$ e $Y$ son **independientes**
cuando conocer el valor de una no aporta información sobre la otra. Formalmente, la distribución
conjunta se factoriza como producto de las marginales.

## Definición

**Caso discreto** (según [[teorica-independencia-vad]]):
$$ X,Y \text{ independientes} \iff p_{X,Y}(x,y)=p_X(x)\,p_Y(y)\quad\forall x\in R_X,\,y\in R_Y. $$

**Caso continuo** (según [[teorica-bidimensionales-vac-intro]]):
$$ X,Y \text{ independientes} \iff f_{X,Y}(x,y)=f_X(x)\,f_Y(y)\quad\forall (x,y)\in\mathbb{R}^2. $$

Equivalentemente, vía condicionales: $X,Y$ independientes sii $f_{X\mid Y}(x\mid y)=f_X(x)$ (o
$p_{X\mid Y}=p_X$), es decir la condicional coincide con la marginal.

> [!figura] u5-soporte-rectangular-contra-soporte-no-rectangula
> Una misma recta $x=x_0$ recorre los dos soportes: en el rectángulo el rango admisible de $Y$ mide siempre lo mismo, en el triángulo se acorta al bajar $x_0$. Conocer $X$ restringe a $Y$, luego hay dependencia. Tenga en cuenta el aviso del panel izquierdo: el soporte rectangular es condición necesaria, no suficiente — en ese mismo ejemplo $f(x,y)=(x+y)/27$ no factoriza como producto de una función de $x$ por una de $y$, así que $X$ e $Y$ tampoco son independientes ahí.

> **Truco de detección rápida:** Si la conjunta tiene algún cero ($p_{X,Y}(x,y)=0$) en una celda
> donde ambas marginales son positivas ($p_X(x)>0$ y $p_Y(y)>0$), las variables NO pueden ser
> independientes. También: si el **soporte** de $f_{X,Y}$ no es un rectángulo (p. ej. la región
> $0<r<h<10$ del cilindro), $X$ e $Y$ no son independientes.
>
> *Por qué el soporte rectangular:* la factorización $f_{X,Y}=f_X(x)f_Y(y)$ es $>0$ exactamente
> donde ambos factores son $>0$, o sea sobre un producto cartesiano (rectángulo) $A\times B$. Si el
> rango admisible de $Y$ **depende** del valor de $X$ (como $Y<X$ en el cilindro), conocer $X$ ya
> restringe a $Y$: hay información, luego dependencia.

## Consecuencias

Si $X,Y$ son independientes:
1. $E[g_1(X)\,g_2(Y)]=E[g_1(X)]\,E[g_2(Y)]$. En particular $E[XY]=E[X]E[Y]$.
2. $\text{Cov}(X,Y)=0$ y $\rho_{X,Y}=0$ (ver [[covarianza-y-correlacion]]).
3. $\text{Var}(X+Y)=\text{Var}(X)+\text{Var}(Y)$ (se anula el término de covarianza).
4. $P(X\in A,\,Y\in B)=P(X\in A)\,P(Y\in B)$.

> ⚠️ El recíproco de (2) no vale en general: **incorrelación no implica independencia**. La
> única excepción es el caso conjuntamente normal (gaussiano), donde $\text{Cov}=0$ sí implica
> independencia.

## Ejercicio resuelto

**(Ej. 23 de [[tp5-2024]])** $X,Y\sim\text{Binomial}(3,0.5)$ **independientes**. Calcular
$P(X=Y)$ y mostrar que $Z=X+Y\sim\text{Binomial}(6,0.5)$.

**Conjunta (por independencia).**
$$ p_{X,Y}(i,j)=P(X=i)P(Y=j)=\binom{3}{i}\binom{3}{j}\,0.5^{6},\qquad 0\le i,j\le3. $$

**Cálculo de $P(X=Y)$.** Suma sobre la diagonal $i=j$:
$$ P(X=Y)=\sum_{i=0}^{3}\binom{3}{i}^2 0.5^{6}=\big(1+9+9+1\big)\,0.5^{6}=20\cdot0.5^6=\frac{5}{16}=0.3125. $$
(Se usó $\sum_i\binom{3}{i}^2=\binom{6}{3}=20$, identidad de Vandermonde.)

**Distribución de $Z=X+Y$.** Para cada $k\in\{0,\dots,6\}$ se suman las anti-diagonales $i+j=k$.
Por ejemplo, $p_Z(3)=\sum_{i=0}^3\binom{3}{i}\binom{3}{3-i}0.5^6=20\cdot0.5^6=\frac{5}{16}$, que
coincide con $\binom{6}{3}0.5^6$. Verificando todos los $k$, las masas coinciden con las de una
$\text{Binomial}(6,0.5)$.

**Resultado.** $P(X=Y)=\tfrac{5}{16}$ y $Z=X+Y\sim\text{Binomial}(6,0.5)$, con
$E[Z]=6\cdot0.5=3$ y $\text{Var}(Z)=6\cdot0.5\cdot0.5=1.5$. Esto ilustra la **propiedad
reproductiva** de la binomial: la suma de binomiales independientes con la misma $p$ es binomial.

## Ejercicio resuelto — soporte no rectangular (continuo)

**(Ej. 26 de [[tp5-2024]])** Un tanque arranca el día con $X$ miles de litros y se venden $Y$
miles de litros durante el día. La densidad conjunta es $f_{X,Y}(x,y)=2$ en la región
$0<y<x<1$ (y $0$ fuera). ¿Son $X$ e $Y$ independientes?

**Soporte triangular (detección rápida).** La región $\{0<y<x<1\}$ es un **triángulo**, no un
rectángulo: el rango admisible de $Y$ depende de $X$ (siempre $Y<X$, no se puede vender más de lo
que había). Eso ya garantiza que $X$ e $Y$ **no** son independientes. Confirmémoslo con las
marginales.

**Marginales.**
$$ f_X(x)=\int_0^x 2\,dy=2x\quad(0<x<1),\qquad f_Y(y)=\int_y^1 2\,dx=2(1-y)\quad(0<y<1). $$

**Test de factorización.**
$$ f_X(x)\,f_Y(y)=2x\cdot2(1-y)=4x(1-y)\neq 2=f_{X,Y}(x,y). $$
La conjunta no es el producto de las marginales, así que $X$ e $Y$ **no** son independientes.

**Resultado.** $X,Y$ dependientes. El argumento decisivo es el **soporte no rectangular**: cuando
la región donde $f_{X,Y}>0$ no es un producto cartesiano $A\times B$, las variables nunca pueden
ser independientes, sin necesidad de calcular nada. Por ejemplo, una probabilidad condicional como
$P(Y>0.5\mid X>0.7)$ usa $f_{Y\mid X}(y\mid x)=\tfrac{2}{2x}=\tfrac{1}{x}$ en $0<y<x$, que **sí**
depende de $x$ (otra forma de ver la dependencia).

## Relación con otras páginas
- [[covarianza-y-correlacion]] — independencia ⟹ Cov = 0 (no al revés).
- [[variables-aleatorias-bidimensionales]] — conjunta, marginales, condicionales.
- [[esperanza-condicional]] — bajo independencia $E[X\mid Y]=E[X]$ (la condicional iguala a la marginal).
- [[distribucion-binomial]] — propiedad reproductiva usada en el ejercicio.
- [[mezcla-de-distribuciones]] — caso donde las variables NO son independientes por construcción.
