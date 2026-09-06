---
titulo: Mezcla de Distribuciones
resumen: 'Modela una población formada por subpoblaciones: $f_X(x)=\sum_k f_{X\mid M}(x\mid k)P(M=k)$, combinación convexa de las condicionales. La varianza no se mezcla linealmente: se usa la ley de varianza total.'
tipo: concepto
unidad: 5
orden: 7
tags: [bidimensionales, mezcla, condicional]
fuentes: ["[[teorica-mezcla]]", "[[tp5-2024]]", "[[video-mezcla]]"]
actualizado: 2026-09-04
---

# Mezcla de Distribuciones

**En breve.** Una mezcla modela una población hecha de subpoblaciones: una variable auxiliar
elige primero "de qué grupo" sale el dato, y la distribución observada es el promedio ponderado de
las condicionales. Es la aplicación directa de la [[esperanza-condicional|ley de esperanza/varianza total]].

Una **mezcla** aparece cuando una variable $X$ (continua) tiene una distribución que depende de
otra variable $M$ (discreta) que selecciona "de qué población" proviene. Es el caso bidimensional
**mixto**: $X$ continua condicionada a $M$ discreta. La distribución de $X$ se obtiene promediando
las condicionales con los pesos $P(M=k)$ (probabilidad total).

> **Intuición.** Imagine dos urnas con histogramas distintos y que tiramos una moneda para decidir
> de cuál sacar. El histograma resultante es la superposición ponderada de los dos: por eso la
> densidad mezcla es una **combinación convexa**. Y como la elección de urna agrega su propia
> incertidumbre, la varianza de la mezcla siempre supera al promedio de las varianzas internas
> (**sobredispersión**): ese exceso es justo el término $\text{Var}(E[X\mid M])$.

## Fórmulas generales

Sea $X$ v.a.c., $M$ v.a.d. con $X\mid M=k$ de distribución conocida para cada $k\in R_M$
(según [[teorica-mezcla]]):

$$ F_X(x)=\sum_{k\in R_M} F_{X\mid M}(x\mid k)\,P(M=k), $$
$$ f_X(x)=\sum_{k\in R_M} f_{X\mid M}(x\mid k)\,P(M=k), $$
$$ E[g(X)]=\sum_{k\in R_M} E[g(X)\mid M=k]\,P(M=k). $$

La densidad de la mezcla es una **combinación convexa** de las densidades condicionales (los pesos
$P(M=k)$ suman 1).

> [!figura] u5-la-mezcla-como-superposicion-ponderada
> Cada densidad condicional aparece escalada por su peso y la mezcla es la suma de las dos: una combinación convexa, no una exponencial «promedio». Las tres barras comparan $E[\text{Var}(T\mid M)]$, $\text{Var}(E[T\mid M])$ y la varianza total; al igualar las dos medias condicionales el término «entre» se anula y solo entonces promediar varianzas daría bien.

> ⚠️ **La varianza NO se mezcla linealmente.** En general
> $$ \text{Var}(X)\neq\sum_k \text{Var}(X\mid M=k)\,P(M=k). $$
> La forma correcta usa $E[X^2]=\sum_k E[X^2\mid M=k]P(M=k)$ y luego
> $\text{Var}(X)=E[X^2]-(E[X])^2$. Equivalentemente (ley de varianza total)
> $\text{Var}(X)=E[\text{Var}(X\mid M)]+\text{Var}(E[X\mid M])$: falta el segundo término,
> que recoge la variabilidad **entre** las medias condicionales.
>
> Según [[video-mezcla]], este es un error muy frecuente que el docente usa deliberadamente en
> los parciales para diferenciar a quien aplica la fórmula de memoria de quien entiende el
> porqué.

## Mezcla inversa: discreta condicionada a continua

El otro tipo de mezcla (TP5, ec. 51-55) es **simétrico**: ahora la variable observada $X$ es
**discreta** y su distribución depende de una variable **continua** $Y$ (el parámetro deja de ser
fijo y pasa a ser aleatorio). La masa marginal de $X$ se obtiene **integrando** (en vez de sumar)
las masas condicionales contra la densidad de $Y$:

$$ p_X(x)=P(X=x)=\int_{\mathbb{R}} p_{X\mid Y}(x\mid y)\,f_Y(y)\,dy, $$
$$ E[h(X)]=\int_{\mathbb{R}} E[h(X)\mid Y=y]\,f_Y(y)\,dy=E\big[E[h(X)\mid Y]\big]. $$

Comparado con la mezcla "directa" (continua condicionada a discreta): allí se **suma** sobre los
valores de la discreta $M$ con pesos $P(M=k)$; aquí se **integra** sobre la continua $Y$ con
densidad $f_Y(y)$. En ambos casos el patrón es el mismo: la marginal es el **promedio** de las
condicionales contra la distribución de la variable auxiliar (ley de probabilidad total).

### Ejercicio resuelto (mezcla inversa)

**(Ej. 39 de [[tp5-2024]])** La cantidad de órdenes diarias es $N\mid\Lambda=\lambda\sim
\text{Poisson}(\lambda)$, donde el propio parámetro es aleatorio: $\Lambda\sim\text{Unif}(0,10)$,
con $f_\Lambda(\lambda)=\tfrac{1}{10}$ en $(0,10)$. Calcular $P(N=5)$ y $E[N]$, $\text{Var}(N)$.

**Masa marginal (integrando la condicional).**
$$ P(N=5)=\int_0^{10} P(N=5\mid\Lambda=\lambda)\,f_\Lambda(\lambda)\,d\lambda=\int_0^{10}\frac{\lambda^5 e^{-\lambda}}{5!}\cdot\frac{1}{10}\,d\lambda=\frac{1}{1200}\int_0^{10}\lambda^5 e^{-\lambda}\,d\lambda. $$
Usando $\int \lambda^5 e^{-\lambda}\,d\lambda=-e^{-\lambda}(\lambda^5+5\lambda^4+20\lambda^3+60\lambda^2+120\lambda+120)$
(ayuda de la guía), se obtiene $P(N=5)\approx0.0933$.

> Observación: $P(N=5)\neq P\big(N=5\mid\Lambda=E[\Lambda]\big)$. Con $\Lambda$ fijo en su media
> $E[\Lambda]=5$ sería $\tfrac{5^5 e^{-5}}{5!}\approx0.1755$, **distinto** de $0.0933$: promediar la
> condicional NO es lo mismo que evaluar en el promedio.

**Esperanza y varianza (leyes total).** Como $E[N\mid\Lambda]=\Lambda$ y
$\text{Var}(N\mid\Lambda)=\Lambda$ (propiedad de la Poisson):
$$ E[N]=E\big[E[N\mid\Lambda]\big]=E[\Lambda]=5, $$
$$ \text{Var}(N)=E\big[\text{Var}(N\mid\Lambda)\big]+\text{Var}\big(E[N\mid\Lambda]\big)=E[\Lambda]+\text{Var}(\Lambda)=5+\frac{10^2}{12}=5+\frac{25}{3}=\frac{40}{3}. $$

**Resultado.** $P(N=5)\approx0.0933$, $E[N]=5$, $\text{Var}(N)=\tfrac{40}{3}\approx13.33$. El término
extra $\text{Var}(\Lambda)=\tfrac{25}{3}$ es lo que distingue a la mezcla de una Poisson pura (donde
$E=\text{Var}=\lambda$): la aleatoriedad del parámetro **agrega** dispersión (sobredispersión). La
ley de varianza total está formalizada en [[esperanza-condicional]].

## Bayes sobre la mezcla

Conocido un evento sobre $X$, se puede invertir para $M$ con [[probabilidad-total-y-bayes|Bayes]]:
$$ P(M=k\mid X\in A)=\frac{P(X\in A\mid M=k)\,P(M=k)}{\sum_{j} P(X\in A\mid M=j)\,P(M=j)}. $$

## Ejercicio resuelto

**(Ejemplo de [[teorica-mezcla]])** Un empleado va al trabajo en subte el 70 % de las veces y en
colectivo el 30 %. El tiempo en subte es $\text{Exp}$ con media 30 min; en colectivo, $\text{Exp}$
con media 40 min. Sea $M$ el medio ($M=0$ subte, $M=1$ colectivo) y $T$ el tiempo de viaje.

**Planteo.** $T\mid M=0\sim\text{Exp}(1/30)$, $T\mid M=1\sim\text{Exp}(1/40)$, $P(M=0)=0.7$,
$P(M=1)=0.3$. La densidad de la mezcla (para $t>0$):
$$ f_T(t)=\frac{1}{30}e^{-t/30}\,(0.7)+\frac{1}{40}e^{-t/40}\,(0.3). $$

**Esperanza.**
$$ E[T]=E[T\mid M=0]\,(0.7)+E[T\mid M=1]\,(0.3)=30(0.7)+40(0.3)=21+12=33\text{ min}. $$

**Varianza (con cuidado).** Para una $\text{Exp}(\lambda)$ vale $E[T^2]=2/\lambda^2$, o sea
$E[T^2\mid M=0]=2\cdot30^2=1800$ y $E[T^2\mid M=1]=2\cdot40^2=3200$. Entonces
$$ E[T^2]=1800(0.7)+3200(0.3)=2220 \;\Rightarrow\; \text{Var}(T)=2220-33^2=1131. $$
Observar que mezclar varianzas daría $30^2(0.7)+40^2(0.3)=1110\neq1131$: la diferencia (21) es
$\text{Var}(E[T\mid M])$, la dispersión entre las medias 30 y 40.

**Bayes (¿tomó el subte si tardó menos de 40?).**
$$ P(M=0\mid T<40)=\frac{P(T<40\mid M=0)\,(0.7)}{P(T<40\mid M=0)\,(0.7)+P(T<40\mid M=1)\,(0.3)}, $$
con $P(T<40\mid M=k)=1-e^{-40\lambda_k}$.

**Resultado.** $E[T]=33$ min, $\text{Var}(T)=1131$ min². La clave es nunca promediar varianzas
condicionales sin el término entre-grupos.

**(Otro ejemplo, de [[video-mezcla]])** partición de **tres** escenarios (uniforme, exponencial
trasladada y normal) para los gastos diarios de un empleado, con el mismo patrón: la acumulada,
la densidad y $E[g(X)]$ se mezclan linealmente, pero la varianza exige pasar por $E[X^2]$. Ver el
desarrollo completo, con la acumulada por tramos, en esa página.

## Relación con otras páginas
- [[esperanza-condicional]] — $E[X\mid Y]$, ley de esperanza total y de varianza total (base de las dos mezclas).
- [[variables-aleatorias-bidimensionales]] — caso mixto (discreta + continua) y condicionales.
- [[funcion-de-variable-aleatoria]] — la transformación inversa también parte de una v.a. auxiliar.
- [[distribucion-exponencial]] — las condicionales del ejemplo del subte/colectivo.
- [[distribucion-poisson]] — condicional del ejemplo de mezcla inversa.
- [[probabilidad-total-y-bayes]], [[esperanza]], [[varianza]].
