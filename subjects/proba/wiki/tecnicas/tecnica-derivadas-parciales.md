---
titulo: Derivadas parciales
resumen: 'Derivar es la operación inversa de acumular: la densidad se recupera de la función de distribución con $f_X(x)=\frac{dF_X}{dx}$, y en el caso bidimensional con la derivada parcial cruzada $f(x,y)=\frac{\partial^2 F}{\partial x\,\partial y}$.'
tipo: tecnica
unidad: 0
orden: 3
tags: [complemento-matematico, derivacion, continua, bidimensional]
fuentes: ["[[complemento-derivadas-parciales]]"]
actualizado: 2026-09-04
---

# Derivadas parciales

**En breve.** Derivar una FDA recupera la densidad: en 1D, $f_X=F_X'$; en 2D, la
densidad conjunta es la derivada parcial cruzada $f=\partial^2 F/\partial x\,\partial y$.
Sirve para pasar de probabilidad **acumulada** a probabilidad **puntual** (densidad).

**Para qué sirve en proba:** derivar es la operación **inversa** de acumular. Si
$X$ es una variable aleatoria continua, su [[funcion-de-distribucion-acumulada|FDA]]
$F_X(x)=P(X\le x)$ acumula probabilidad, y la [[funcion-de-densidad|densidad]] se
recupera derivando: $f_X(x)=F_X'(x)$. En el caso de un par $(X,Y)$ la FDA conjunta
$F(x,y)=P(X\le x,\,Y\le y)$ se deriva **parcialmente respecto de las dos variables**
para obtener la densidad conjunta. El apunte [[complemento-derivadas-parciales]]
motiva esto con la analogía de la **densidad de una placa** a partir de su masa
acumulada.

## Idea en 1D: derivada como densidad (alambre)
Sea $m(x)$ la masa de un alambre acumulada desde $x=0$ hasta $x$ [kg]. La densidad
lineal [kg/m] en un punto $\alpha$ es el cociente incremental de masa, en el límite:
$$ \frac{\Delta m}{\Delta x}=\frac{m\!\left(\alpha+\tfrac{\Delta x}{2}\right)-m\!\left(\alpha-\tfrac{\Delta x}{2}\right)}{\Delta x}
\xrightarrow[\Delta x\to 0]{}\; \frac{dm}{dx}(\alpha). $$
**Analogía proba:** $m(x)\leftrightarrow F_X(x)$ (FDA), densidad $\leftrightarrow f_X(x)=F_X'(x)$.

> [!figura] u0-alambre-masa-acumulada-y-densidad
> Arriba, la masa acumulada $m(x)$ con la secante entre $\alpha\pm\Delta x/2$; abajo, la densidad $dm/dx$ en el mismo eje. La franja sombreada del panel inferior vale $\Delta m$, y dividida por $\Delta x$ da la pendiente de la secante del panel superior. Al reducir $\Delta x$ la pendiente medida se acerca a la derivada exacta en $\alpha$.

## Idea en 2D: derivada parcial cruzada (placa)
Sea $m(\alpha,\beta)$ la masa de la placa contenida en el cuadrante $\{x\le\alpha,\,y\le\beta\}$
[kg]. La densidad superficial [kg/m²] en $(\alpha,\beta)$ se obtiene como un cociente
incremental en las dos direcciones a la vez (los cuatro vértices del rectángulo,
con signos $+,-,+,-$):
$$ \frac{\Delta m}{\Delta x\,\Delta y}=\frac{m\!\left(\alpha+\tfrac{\Delta x}{2},\beta+\tfrac{\Delta y}{2}\right)-m\!\left(\alpha+\tfrac{\Delta x}{2},\beta-\tfrac{\Delta y}{2}\right)+m\!\left(\alpha-\tfrac{\Delta x}{2},\beta-\tfrac{\Delta y}{2}\right)-m\!\left(\alpha-\tfrac{\Delta x}{2},\beta+\tfrac{\Delta y}{2}\right)}{\Delta x\,\Delta y}. $$
Tomando límite $\Delta x,\Delta y\to 0$ esto es la **derivada parcial cruzada**:
$$ d(x,y)=\frac{\partial}{\partial x}\frac{\partial}{\partial y}\,m(x,y)=\frac{\partial^2 m}{\partial x\,\partial y}. $$
**Analogía proba:** $m(x,y)\leftrightarrow F(x,y)$ (FDA conjunta) y la densidad
conjunta es $f(x,y)=\dfrac{\partial^2 F}{\partial x\,\partial y}$.

> [!figura] u0-derivada-cruzada-cuatro-vertices
> Los cuatro cuadrantes acumulados con sus signos $+,-,+,-$: al sumarlos y restarlos solo sobrevive el rectángulo $\Delta x\cdot\Delta y$. Una sola derivada parcial dejaría una franja acumulada, no un punto; por eso hacen falta las dos. Observe que el cociente $\Delta m/(\Delta x\,\Delta y)$ tiende a $d(\alpha,\beta)$ cuando los dos lados se achican.

**Intuición.** ¿Por qué hace falta derivar respecto de **las dos** variables? La
FDA conjunta $F(x,y)$ acumula probabilidad sobre todo el cuadrante inferior-izquierdo
$\{X\le x,\,Y\le y\}$. Para "desacumular" hasta quedarte con la densidad en un solo
punto tiene que adelgazar el cuadrante en las dos direcciones a la vez: la resta con
signos $+,-,+,-$ de los cuatro vértices del rectángulo es exactamente eso, quitar lo
que ya se contó por la izquierda y por abajo. Una sola derivada parcial dejaría todavía
una **franja** acumulada en la otra dirección, no un punto.

## Igualdad de las derivadas cruzadas (teorema de Clairaut/Schwarz)
Bajo ciertas condiciones de regularidad (las parciales segundas son continuas),
el orden de derivación no importa:
$$ \frac{\partial^2 m}{\partial x\,\partial y}=\frac{\partial^2 m}{\partial y\,\partial x}. $$
Por eso da igual derivar primero en $x$ o en $y$.

> [!figura] u0-clairaut-dos-caminos
> Los dos órdenes de derivación de $m(x,y)=x^2y^3$ desembocan en el mismo $6xy^2$. La igualdad no es una convención de notación: cualquiera de los dos caminos del cuadrado llega al mismo lugar, y vale siempre que las parciales segundas sean continuas (teorema de Clairaut/Schwarz).

## Notación
- $\dfrac{\partial m}{\partial x}$ o $\partial_x m$: derivada **parcial** respecto de $x$,
  tratando $y$ como constante.
- $\dfrac{\partial^2 m}{\partial x\,\partial y}=\partial_x\partial_y m$: derivar primero en $y$, después en $x$.
  *(El orden de lectura de la notación es una aclaración del wiki; el apunte
  [[complemento-derivadas-parciales]] escribe el operador como $\tfrac{d}{dx}\tfrac{d}{dy}m$
  pero no detalla cuál se aplica primero. Como las cruzadas coinciden bajo regularidad
  —ver teorema de Clairaut arriba—, el orden no altera el resultado.)*
- $\dfrac{\partial^2 m}{\partial x^2}=\partial_{xx} m$: derivar dos veces en $x$.

## Ejercicio resuelto

> Dada la masa acumulada $m(x,y)=x^2 y^3$, calcular las derivadas parciales de
> primer y segundo orden, y verificar la igualdad de las derivadas cruzadas.
> (Ejemplo de [[complemento-derivadas-parciales]].)

**Parciales primeras.**
$$ \frac{\partial m}{\partial x}=2x\,y^3 \quad(\text{$y$ constante}),\qquad
   \frac{\partial m}{\partial y}=3x^2\,y^2 \quad(\text{$x$ constante}). $$

**Derivadas cruzadas (deben coincidir).**
$$ \frac{\partial^2 m}{\partial y\,\partial x}=\frac{\partial}{\partial y}\big(2x\,y^3\big)=6x\,y^2,
\qquad
\frac{\partial^2 m}{\partial x\,\partial y}=\frac{\partial}{\partial x}\big(3x^2\,y^2\big)=6x\,y^2. $$
Coinciden: $\dfrac{\partial^2 m}{\partial y\,\partial x}=\dfrac{\partial^2 m}{\partial x\,\partial y}=6xy^2$,
como predice el teorema de Clairaut.

**Parciales segundas puras (a modo de práctica).**
$$ \frac{\partial^2 m}{\partial x^2}=\frac{\partial}{\partial x}(2xy^3)=2y^3,\qquad
   \frac{\partial^2 m}{\partial y^2}=\frac{\partial}{\partial y}(3x^2y^2)=6x^2y. $$

**Resultado.** La densidad asociada a esta masa acumulada sería
$d(x,y)=\dfrac{\partial^2 m}{\partial x\,\partial y}=6xy^2$. En clave probabilística:
si $m$ fuese una FDA conjunta $F(x,y)$, la densidad conjunta sería
$f(x,y)=6xy^2$ (sobre el soporte donde valga).

## Relación con otras páginas
- [[funcion-de-densidad]] — la densidad es la derivada de la masa/probabilidad acumulada.
- [[funcion-de-distribucion-acumulada]] — $f_X=F_X'$ en 1D; $f=\partial^2 F/\partial x\partial y$ en 2D.
- [[variables-aleatorias-bidimensionales]] — donde aparece la FDA conjunta y su derivada cruzada.
- [[tecnica-integrales-dobles]] — operación inversa: integrar la densidad recupera la masa/probabilidad.
- [[variable-aleatoria-continua]] — contexto general.
- [[variable-aleatoria]] — el concepto raíz del que cuelgan FDA y densidad.
- [[independencia]] — si $X,Y$ son independientes, $F(x,y)=F_X(x)F_Y(y)$ y al derivar queda $f(x,y)=f_X(x)f_Y(y)$.
