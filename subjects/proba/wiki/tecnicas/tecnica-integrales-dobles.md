---
titulo: Integrales dobles
resumen: 'Integrar la densidad conjunta sobre una región da la probabilidad del par, $P((X,Y)\in R)=\iint_R f_{XY}\,dA$. Sirve para normalizar, calcular probabilidades de regiones, esperanzas y marginales; el trabajo real está en fijar los límites.'
tipo: tecnica
unidad: 0
orden: 2
tags: [complemento-matematico, integracion, continua, bidimensional]
fuentes: ["[[complemento-integrales-dobles]]"]
actualizado: 2026-09-04
---

# Integrales dobles

**En breve.** Integrar una densidad conjunta $f_{XY}$ sobre una región $R$ da la
probabilidad $P((X,Y)\in R)$ (el volumen bajo la superficie). Es la operación
**inversa** de derivar la FDA conjunta, y sirve para normalizar, calcular
probabilidades de regiones, esperanzas y marginales.

**Para qué sirve en proba:** dos variables aleatorias continuas se describen por
una [[funcion-de-densidad|densidad conjunta]] $f_{XY}(x,y)$. La probabilidad de
que el par $(X,Y)$ caiga en una región $R$ es el **volumen** bajo la superficie de
densidad, que se calcula con una integral doble
$P((X,Y)\in R)=\iint_R f_{XY}\,dA$; y la normalización exige $\iint_{\mathbb R^2} f_{XY}=1$.
El apunte [[complemento-integrales-dobles]] motiva esto con la analogía física de la
**masa de una placa** de densidad superficial $d(x,y)$.

## Idea: la integral doble como suma de Riemann (masa de una placa)
Dividimos la placa en celdas $\Delta x \times \Delta y$. La masa de la celda
centrada en $(x_i,y_j)$ es aproximadamente densidad por área:
$$ \Delta\text{masa}(x_i,y_j)\approx d(x_i,y_j)\,\Delta x\,\Delta y. $$

> [!figura] u0-superficie-densidad-suma-de-riemann
> Cada celda de la malla levanta un prisma de altura $d(x_i,y_j)$ sobre la parte de la celda que cae dentro de $R$, y la masa es el volumen que encierran. Las celdas del borde entran con la fracción de su área que cae dentro de $R$: ese es el peso $\Delta A_{ij}$ con que suman. Note que al aumentar $n$ los prismas se pegan a la superficie y el error frente al valor exacto $1/24$ baja de forma sostenida.

La masa total es la doble suma, y al refinar la malla ($\Delta x,\Delta y\to 0$)
se vuelve la integral doble:
$$ \text{masa}\approx \sum_i\sum_j d(x_i,y_j)\,\Delta x\,\Delta y
\;\xrightarrow[]{}\; \text{masa}=\iint_R d(x,y)\,dx\,dy. $$

**Diccionario masa ↔ probabilidad:** densidad $d(x,y)$ [kg/m²] $\leftrightarrow$
densidad conjunta $f_{XY}(x,y)$; masa total $\leftrightarrow$ probabilidad total
(debe ser $1$); baricentro $\leftrightarrow$ vector de esperanzas $(E[X],E[Y])$.

## Teorema de Fubini (integral iterada)
La integral doble se calcula como dos integrales simples anidadas, y **el orden de
integración se puede elegir** (ajustando los límites al recinto). Para el triángulo
$0<x<1,\;0<y<1-x$:
$$ \iint_R d\,dA = \int_0^1\!\!\left[\int_0^{1-x} d(x,y)\,dy\right]dx
= \int_0^1\!\!\left[\int_0^{1-y} d(x,y)\,dx\right]dy. $$
Clave: al integrar primero en $y$, los límites de $y$ pueden depender de $x$ (y viceversa).

> [!figura] u0-fubini-orden-de-integracion
> La varilla de la integral interna barriendo el triángulo, en los dos órdenes de integración. La flecha superior es el **barrido externo**: la integral de afuera suma todas las varillas moviendo $x$ (o $y$, según el orden). Observe que el límite externo se mantiene constante y solo el interno depende de la otra variable: si en un límite quedan dos variables, el orden está invertido.

**Intuición.** Piense la integral interna como **barrer el recinto con una varilla**.
Se fija un valor de $x$ (la varilla es vertical) y se la desliza de abajo hacia arriba
sumando densidad: por eso los límites de $y$ son funciones de $x$ —miden cuánto mide
la varilla en cada posición. Solo después la integral externa **suma todas las
varillas** moviendo $x$ de extremo a extremo del recinto. Por eso los límites
**externos son siempre constantes** y los **internos pueden depender de la variable
externa**: si te quedan dos variables en un límite, casi seguro invertiste el orden.

## Centro de masa / baricentro (≈ esperanzas)
$$ \bar x = \frac{\iint_R x\,d(x,y)\,dA}{\text{masa}},\qquad
   \bar y = \frac{\iint_R y\,d(x,y)\,dA}{\text{masa}}. $$
En proba, si $d$ es la densidad conjunta normalizada (masa $=1$), entonces
$\bar x = E[X]$ y $\bar y = E[Y]$.

> [!figura] u0-baricentro-placa-triangular
> El baricentro correcto $(2/5,\,2/5)$ frente al $(1/5,\,1/5)$ que publica el apunte. Como la densidad $d(x,y)=xy$ se anula sobre los dos ejes, la masa se concentra hacia el interior del triángulo y el baricentro no puede quedar pegado al origen. En clave probabilística, tras normalizar la densidad, ese punto es $(\E[X],\,\E[Y])$.

## Cómo reconocer cuándo usarla
- Probabilidad de una región del plano para un par $(X,Y)$ continuo.
- Normalizar una densidad conjunta (hallar la constante $k$ con $\iint k\,g = 1$).
- Calcular $E[X]$, $E[Y]$, $E[g(X,Y)]$ o densidades marginales.

## Ejercicio resuelto

> Una placa triangular ocupa $\{0<x,\;0<y,\;x+y<1\}$ y tiene densidad
> $d(x,y)=xy$ [kg/m²]. Hallar la masa y el centro de masa.
> (Ejemplo de [[complemento-integrales-dobles]].)

**Planteo (masa).** Por Fubini, integrando primero en $y$ entre $0$ y $1-x$, y
luego en $x$ entre $0$ y $1$:
$$ \text{masa} = \int_0^1\!\!\int_0^{1-x} x\,y\,dy\,dx. $$

**Cálculo de la masa.** Integrando primero en $y$, con la primitiva
$\int y\,dy=\tfrac{y^2}{2}$:
$$ \int_0^{1-x} xy\,dy = x\,\frac{y^2}{2}\Big|_0^{1-x} = \frac{x(1-x)^2}{2}, $$
y luego
$$ \frac12\int_0^1 x(1-x)^2\,dx = \frac12\int_0^1 (x-2x^2+x^3)\,dx $$
$$ = \frac12\left(\frac{x^2}{2}-\frac{2x^3}{3}+\frac{x^4}{4}\right)\Big|_0^1
= \frac12\cdot\frac{6-8+3}{12}=\frac12\cdot\frac{1}{12}=\frac{1}{24}. $$
**Masa $=\dfrac{1}{24}$ kg.**

> ⚠️ **Errata del apunte (verificada el 2026-08-13).**
> [[complemento-integrales-dobles]] (pág. 3) escribe la primitiva como
> $\int xy\,dy = xy^2$, **omitiendo el $\tfrac12$**, y publica masa $=\tfrac{1}{12}$
> y baricentro $(\tfrac15,\tfrac15)$. Que es un error y no otra convención se ve de
> tres formas:
> 1. **El propio apunte se contradice:** dos páginas después, al calcular
>    $\text{masa}\cdot\bar x$, sí escribe $\int x^2y\,dy=\frac{x^2y^2}{2}$ (con el
>    $\tfrac12$) y obtiene $\tfrac{1}{60}$. La misma primitiva no puede llevar
>    $\tfrac12$ en una página y no llevarlo en la otra.
> 2. **Verificación independiente:** $\int_0^1 x(1-x)^2dx=B(2,3)=\frac{1!\,2!}{4!}=\frac1{12}$,
>    y la masa es la mitad de eso, $\tfrac1{24}$.
> 3. **Sanity check físico:** con $d(x,y)=xy$ la placa no tiene masa sobre los ejes
>    y se concentra hacia el centro del triángulo, así que el baricentro tiene que
>    caer bien adentro: $(\tfrac25,\tfrac25)$ es plausible, $(\tfrac15,\tfrac15)$ lo
>    pegaría contra el vértice del origen.
>
> La "verificación" del apunte invirtiendo el orden de integración da $\tfrac1{12}$
> otra vez porque arrastra la misma primitiva sin el $\tfrac12$.
> **En el parcial:** Hacer el cálculo correcto ($\tfrac1{24}$); si te piden reproducir
> el ejemplo del apunte, deje escrito el paso $\int y\,dy=\tfrac{y^2}{2}$.

**Cálculo del numerador de $\bar x$.**
$$ \text{masa}\cdot\bar x = \int_0^1\!\!\int_0^{1-x} x\cdot xy\,dy\,dx
= \int_0^1 \frac{x^2 y^2}{2}\Big|_0^{1-x}dx = \frac{1}{2}\int_0^1 x^2(1-x)^2\,dx. $$
$$ = \frac{1}{2}\int_0^1 (x^2-2x^3+x^4)\,dx
= \frac{1}{2}\left(\frac{x^3}{3}-\frac{2x^4}{4}+\frac{x^5}{5}\right)\Big|_0^1 $$
$$ = \frac{1}{2}\left(\frac{1}{3}-\frac{1}{2}+\frac{1}{5}\right) = \frac{1}{2}\cdot\frac{10-15+6}{30}=\frac{1}{60}. $$

**Baricentro.**
$$ \bar x = \frac{\text{masa}\cdot\bar x}{\text{masa}} = \frac{1/60}{1/24} = \frac{24}{60} = \frac{2}{5}. $$
Por simetría del problema en $x\leftrightarrow y$, $\bar y = \dfrac{2}{5}$ también.

**Resultado.** Masa $=\dfrac{1}{24}$ kg; baricentro $\left(\bar x,\bar y\right)=\left(\tfrac25,\tfrac25\right)$.
(El apunte publica $\tfrac1{12}$ y $(\tfrac15,\tfrac15)$ — ver la errata de arriba.)

> Lectura probabilística: si en vez de una placa esto fuera una densidad conjunta,
> primero habría que normalizar dividiendo por la masa para que integre $1$; el
> baricentro sería entonces $(E[X],E[Y])$.

## Relación con otras páginas
- [[funcion-de-densidad]] — densidad conjunta y normalización en 2D.
- [[variables-aleatorias-bidimensionales]] — donde se aplica esta técnica.
- [[tecnica-integrales-impropias]] — la versión 1D (y para recintos no acotados, los límites pueden ir a $\infty$).
- [[tecnica-derivadas-parciales]] — operación inversa: derivar la masa acumulada da la densidad.
- [[esperanza]] — el baricentro es el análogo de la esperanza.
- [[varianza]] — el momento de inercia respecto del baricentro es el análogo de la varianza.
- [[independencia]] — para chequear independencia de $(X,Y)$ se compara la densidad conjunta con el producto de las marginales (obtenidas integrando).
- [[funcion-de-distribucion-acumulada]] — integrar la densidad sobre $\{X\le x, Y\le y\}$ recupera la FDA conjunta.
