---
titulo: Esperanza Condicional
resumen: '$E[X\mid Y]$ es el promedio de $X$ una vez conocido $Y$, y como función de $Y$ es una variable aleatoria. De ahí la esperanza total $E[X]=E[E[X\mid Y]]$ y la varianza total $\mathrm{Var}(X)=E[\mathrm{Var}(X\mid Y)]+\mathrm{Var}(E[X\mid Y])$.'
tipo: concepto
unidad: 5
orden: 6
tags: [bidimensionales, condicional, esperanza, varianza]
fuentes: ["[[teorica-bidimensionales-vac-intro]]", "[[teorica-mezcla]]", "[[tp5-2024]]", "[[video-mezcla]]"]
actualizado: 2026-09-04
---

# Esperanza Condicional

**En breve.** $E[X\mid Y]$ es el promedio de $X$ que esperaríamos sabiendo el valor de $Y$;
volver a promediarlo sobre $Y$ recupera $E[X]$ (esperanza total) y permite descomponer
$\text{Var}(X)$ en variabilidad intra-grupo más inter-grupo (varianza total).

La **esperanza condicional** $E[X\mid Y]$ es el valor esperado de $X$ una vez que se conoce el
valor de otra [[variables-aleatorias-bidimensionales|variable aleatoria]] $Y$. Es la herramienta
central para "promediar por etapas": primero se promedia dentro de cada valor de $Y$, y después se
promedia sobre $Y$. De ahí salen la **ley de esperanza total** y la **ley de varianza total**.

## Definición

A partir de la distribución condicional (según [[teorica-bidimensionales-vac-intro]] y el repaso
del [[tp5-2024]], ec. 32-43):

**Caso discreto** ($p_{X\mid Y}(x\mid y)=p_{X,Y}(x,y)/p_Y(y)$):
$$ E[h(X)\mid Y=y]=\sum_{x\in R_X} h(x)\,p_{X\mid Y}(x\mid y). $$

**Caso continuo** ($f_{X\mid Y}(x\mid y)=f_{X,Y}(x,y)/f_Y(y)$):
$$ E[h(X)\mid Y=y]=\int_{-\infty}^{\infty} h(x)\,f_{X\mid Y}(x\mid y)\,dx. $$

> $E[X\mid Y=y]$ es un **número** (depende del valor $y$ que fijemos). Si dejamos $Y$ libre,
> $E[X\mid Y]$ es una **función de $Y$**, y por lo tanto **una variable aleatoria** ella misma. Esa
> distinción es la clave de las dos leyes que siguen.

También se define la **varianza condicional**:
$$ \text{Var}(X\mid Y)=\sigma_{X\mid Y}^2=E\big[(X-\mu_{X\mid Y})^2\mid Y\big]=E[X^2\mid Y]-\big(E[X\mid Y]\big)^2,\qquad \mu_{X\mid Y}=E[X\mid Y]. $$

## Ley de esperanza total

Promediar $E[X\mid Y]$ sobre la distribución de $Y$ recupera la esperanza de $X$ (TP5 ec. 34 y 41):
$$ E[X]=E\big[E[X\mid Y]\big]=\begin{cases}\displaystyle\sum_{y\in R_Y} E[X\mid Y=y]\,p_Y(y) & (Y \text{ discreta}),\\[2mm]\displaystyle\int_{-\infty}^{\infty} E[X\mid Y=y]\,f_Y(y)\,dy & (Y \text{ continua}).\end{cases} $$

Es la versión "esperada" de la [[probabilidad-total-y-bayes|probabilidad total]]: se descompone el
cálculo por casos (los valores de $Y$) y se promedia con sus pesos.

## Ley de varianza total

La varianza **no** se promedia directamente: a la media de las varianzas condicionales hay que
sumarle la varianza de las medias condicionales (TP5 ec. 36 y 43):
$$ \boxed{\;\text{Var}(X)=E\big[\text{Var}(X\mid Y)\big]+\text{Var}\big(E[X\mid Y]\big)\;} $$

- $E[\text{Var}(X\mid Y)]$ — variabilidad **dentro** de cada grupo (intra).
- $\text{Var}(E[X\mid Y])$ — variabilidad **entre** las medias de los grupos (inter).

> [!figura] u5-varianza-intra-mas-varianza-entre
> Tres densidades condicionales con sus medias marcadas y, encima, la densidad total. El ancho típico de cada grupo es la parte intra y la dispersión de las medias entre sí es la parte entre; la barra apilada muestra que solo sumando las dos se llega a $\text{Var}(X)$. Separe las medias sin tocar el ancho: la barra intra no se mueve y la total crece igual.

> **Intuición.** Piense en alturas de personas separadas por país. La dispersión total tiene dos
> fuentes: cuánto varían las alturas *dentro* de cada país (intra) y cuánto difieren los *promedios*
> de cada país entre sí (inter). Promediar solo las varianzas internas ignora que los grupos están
> "corridos" unos de otros, y por eso siempre subestima la varianza total.

> ⚠️ Error típico: escribir $\text{Var}(X)=\sum_y \text{Var}(X\mid Y=y)\,p_Y(y)$. Eso olvida el
> término **entre-grupos** $\text{Var}(E[X\mid Y])$ y subestima la varianza. Ver el contraejemplo en
> [[mezcla-de-distribuciones]].

## Ejercicio resuelto — esperanza total (cilindro)

**(Ejemplo de [[teorica-bidimensionales-vac-intro]])** Pieza cilíndrica con radio $R$ y altura $H$
de densidad conjunta $f_{R,H}(r,h)=\tfrac{3}{500}\,r$ en $0<r<h<10$. Verificar la ley de esperanza
total para $R$.

**Condicional y esperanza condicional.** La marginal de $H$ es
$f_H(h)=\int_0^h\tfrac{3}{500}r\,dr=\tfrac{3}{1000}h^2$ en $(0,10)$, de modo que
$$ f_{R\mid H}(r\mid h)=\frac{\tfrac{3}{500}r}{\tfrac{3}{1000}h^2}=\frac{2r}{h^2}\;(0<r<h),\qquad E[R\mid H=h]=\int_0^h r\,\frac{2r}{h^2}\,dr=\frac{2h}{3}. $$

**Ley de esperanza total.**
$$ E[R]=E\big[E[R\mid H]\big]=\int_0^{10}\frac{2h}{3}\cdot\frac{3}{1000}h^2\,dh=\int_0^{10}\frac{h^3}{500}\,dh=\frac{10000}{2000}=5. $$

**Resultado.** $E[R\mid H=h]=\tfrac{2h}{3}$ y $E[R]=5=\mu_R$, que coincide con el cálculo directo de
la marginal $f_R(r)=\tfrac{3}{500}r(10-r)$. El soporte triangular (no rectangular) muestra que $R$ y
$H$ **no** son [[independencia-de-variables-aleatorias|independientes]]; de hecho
$\text{Cov}(R,H)=E[RH]-\mu_R\mu_H=40-5\cdot7.5=2.5\neq0$.

## Ejercicio resuelto — varianza total (subte/colectivo)

**(Ejemplo de [[teorica-mezcla]])** Un empleado viaja en subte el 70 % de las veces ($M=0$,
$T\mid M=0\sim\text{Exp}(1/30)$) y en colectivo el 30 % ($M=1$, $T\mid M=1\sim\text{Exp}(1/40)$).
Hallar $E[T]$ y $\text{Var}(T)$ usando las dos leyes.

**Esperanzas condicionales.** $E[T\mid M=0]=30$, $E[T\mid M=1]=40$. Por la ley de esperanza total:
$$ E[T]=E[T\mid M=0]\,P(M=0)+E[T\mid M=1]\,P(M=1)=30(0.7)+40(0.3)=33\text{ min}. $$

**Ley de varianza total.** Para la exponencial $\text{Var}(T\mid M=0)=30^2=900$ y
$\text{Var}(T\mid M=1)=40^2=1600$.
$$ E\big[\text{Var}(T\mid M)\big]=900(0.7)+1600(0.3)=1110. $$
El término entre-grupos usa que $E[T\mid M]$ toma el valor $30$ con prob. $0.7$ y $40$ con prob.
$0.3$ (media $33$):
$$ \text{Var}\big(E[T\mid M]\big)=(30-33)^2(0.7)+(40-33)^2(0.3)=9(0.7)+49(0.3)=6.3+14.7=21. $$
$$ \text{Var}(T)=E\big[\text{Var}(T\mid M)\big]+\text{Var}\big(E[T\mid M]\big)=1110+21=1131. $$

**Resultado.** $E[T]=33$ min y $\text{Var}(T)=1131$ min². Coincide con el cálculo por momentos
($E[T^2]=2\cdot30^2(0.7)+2\cdot40^2(0.3)=2220$, $\text{Var}=2220-33^2=1131$). Promediar solo las
varianzas condicionales habría dado $1110$, y el faltante de $21$ es justamente
$\text{Var}(E[T\mid M])$, la dispersión **entre** las medias $30$ y $40$.

## Relación con otras páginas
- [[variables-aleatorias-bidimensionales]] — condicionales $f_{X\mid Y}$, $p_{X\mid Y}$ de donde sale $E[X\mid Y]$.
- [[mezcla-de-distribuciones]] — aplicación directa de las dos leyes (mezcla directa e inversa).
- [[video-mezcla]] — clase grabada que resuelve otro caso de varianza total (partición de tres escenarios) y advierte por qué no se puede promediar directamente las varianzas condicionales.
- [[probabilidad-total-y-bayes]] — la ley de esperanza total es la "versión esperada" de la probabilidad total.
- [[esperanza]], [[varianza]] — las versiones no condicionales.
- [[funcion-de-variable-aleatoria]] — $E[X\mid Y]$ es una función de $Y$ (una v.a.).
