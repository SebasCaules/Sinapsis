---
titulo: "Resumen de la Unidad 0 — Complementos Matemáticos"
tipo: resumen
unidad: 0
orden: 1
hub: true
tags: [resumen, complemento-matematico, integracion, derivacion]
resumen: "Tres herramientas de cálculo para la parte continua: integrales impropias (un límite cuando el dominio es infinito o el integrando explota), integrales dobles con Fubini para densidades conjuntas y derivadas parciales para pasar de la acumulada a la densidad, $f=\partial^2 F/\partial x\,\partial y$."
fuentes: ["[[tecnica-integrales-impropias]]", "[[tecnica-integrales-dobles]]", "[[tecnica-derivadas-parciales]]", "[[formulario-complementos-matematicos]]"]
actualizado: 2026-11-09
---

# Resumen de la Unidad 0 — Complementos Matemáticos

Esta unidad no es un tema de probabilidad en sí: reúne las tres herramientas de cálculo que sostienen la parte continua de la materia. **Integrar** una densidad da probabilidad (en una y en dos variables) y **derivar** una función acumulada devuelve la densidad. Se aplican directamente en las [[variable-aleatoria-continua|variables aleatorias continuas]] (Unidad 4, cuya hoja es el [[formulario-va-continuas|formulario de v.a. continuas]]) y en las [[variables-aleatorias-bidimensionales|variables aleatorias bidimensionales]] (Unidad 5). Los apuntes lo motivan con la masa de un alambre o de una placa.

> [!info] Lo esencial
> - Una integral con un extremo infinito (Tipo I) o con el integrando no acotado en un extremo (Tipo II) se define como el límite de una integral ordinaria.
> - Converge si el límite existe y es finito; si no, diverge: $1/x^2$ converge en $[1,\infty)$ y $1/x$ diverge.
> - En proba, normalizar una densidad, calcular colas, la FDA y la esperanza son casi siempre integrales impropias.
> - $P((X,Y)\in R)$ es el volumen bajo la densidad conjunta: una integral doble que se calcula como dos integrales simples anidadas (Fubini).
> - En una integral iterada los límites externos son constantes y los internos pueden depender de la variable externa.
> - Derivar es la operación inversa de acumular: $f_X=F_X'$ en 1D y $f=\partial^2F/\partial x\,\partial y$ en 2D.

## 1. Integrales impropias

Una integral es **impropia** cuando no se puede evaluar directamente: o bien el **dominio de integración no es acotado** (**Tipo I**), o bien el **integrando no es continuo** en algún extremo del intervalo, por ejemplo tiene una asíntota (**Tipo II**). En ambos casos se reemplaza el punto problemático por una variable $t$, se integra en un intervalo ordinario y se toma límite.

**Tipo I — dominio no acotado.**

$$ \int_a^{+\infty} f(x)\,dx = \lim_{t\to+\infty}\int_a^{t} f(x)\,dx $$

Aquí $t$ es un corte finito que tiende a $+\infty$. El caso simétrico es $\int_{-\infty}^{b} f = \lim_{t\to-\infty}\int_t^{b} f$. Si los dos extremos son infinitos, se parte en un punto $c$ cualquiera:

$$ \int_{-\infty}^{+\infty} f(x)\,dx = \int_{-\infty}^{c} f(x)\,dx + \int_{c}^{+\infty} f(x)\,dx $$

y cada mitad se trata por separado.

**Tipo II — singularidad en un extremo.** Si $f$ es continua en $[a,b)$ pero no en $b$:

$$ \int_a^b f(x)\,dx = \lim_{t\to b^-}\int_a^{t} f(x)\,dx $$

y, si la singularidad está en $a$, $\int_a^b f = \lim_{t\to a^+}\int_t^b f$. Si $f$ no es continua ni en $a$ ni en $b$, se parte en un $c\in(a,b)$ y cada pedazo se trata como antes.

**Convergencia.** La integral impropia **converge** cuando se cumplen dos condiciones: (1) la integral ordinaria $\int_a^t f$ existe para cada corte $t$ finito, y (2) el límite existe y es **finito**. Si el límite no existe o es infinito, la integral **diverge**. Ejemplos de referencia:

$$ \int_1^{+\infty}\frac{1}{x^2}\,dx = \lim_{t\to\infty}\left(1-\frac{1}{t}\right) = 1 $$

(cola convergente), frente a $\int_1^{+\infty}\frac{1}{x}\,dx=\lim_{t\to+\infty}\ln t=+\infty$ (cola divergente), y un caso de Tipo II con área finita:

$$ \int_2^{5}\frac{1}{2\sqrt{x-2}}\,dx = \lim_{t\to 2^+}\left(\sqrt{3}-\sqrt{t-2}\right) = \sqrt{3} $$

donde el integrando explota en $x=2$ y una primitiva es $\sqrt{x-2}$.

> [!intuicion] Área finita sobre un dominio infinito
> Una región infinitamente larga tiene área finita si la cola se achica lo bastante rápido: $1/x^2$ converge, pero $1/x$ no decae lo suficiente y diverge.

**Para qué sirve en proba.** Una [[funcion-de-densidad|densidad]] $f_X$ debe cumplir la condición de normalización

$$ \int_{-\infty}^{+\infty} f_X(x)\,dx = 1 $$

y las probabilidades son áreas, $P(a\le X\le b)=\int_a^b f_X(x)\,dx$. Con la [[distribucion-exponencial|exponencial]] (soporte $[0,\infty)$), la [[distribucion-normal|normal]] (toda la recta) o la [[distribucion-gamma|gamma]] estas integrales son impropias, igual que la [[funcion-de-distribucion-acumulada|FDA]], $F_X(x)=\int_{-\infty}^{x} f_X(y)\,dy$, impropia en el límite inferior, y la [[esperanza]], $E[X]=\int_{-\infty}^{+\infty} x\,f_X(x)\,dx$, que incluso puede divergir.

**Cómo reconocerla.** Hay $\pm\infty$ en un límite de integración: **Tipo I**. El integrando explota en un extremo (denominador que se anula, raíz o logaritmo de cero): **Tipo II**.

> [!figura] u0-cola-convergente-vs-divergente
> El área acumulada de $1/x^2$ y la de $1/x$ sobre $[1,t]$, con $t$ creciendo hasta $10^4$. En el panel superior el sombreado marca el tramo ya integrado, de $1$ hasta $t$; como el eje $x$ es logarítmico, el área dibujada no es proporcional al valor. Note que la primera se estanca en $1$ mientras la segunda, $\ln t$, sigue subiendo sin techo.

> [!figura] u0-singularidad-tipo-ii-area-finita
> La curva $1/(2\sqrt{x-2})$ con el corte $t$ acercándose a la asíntota $x=2$. Al acercar $t$ a $2$ la franja se estira sin límite hacia arriba (el eje $y$ está recortado en $3.2$ y la punta se remata con una flecha) y, aun así, el área acumulada se estaciona en $\sqrt3\approx 1.7321$, como muestra la barra de la derecha.

Detalle: [[tecnica-integrales-impropias|Integrales impropias]]

## 2. Integrales dobles

Dos variables continuas se describen con una **densidad conjunta** $f_{XY}(x,y)$. La probabilidad de que el par caiga en una región $R$ es el **volumen** bajo la densidad sobre $R$. En la analogía de la **placa** de densidad $d(x,y)$ [kg/m²], cada celda $\Delta x\times\Delta y$ pesa aproximadamente $d(x_i,y_j)\,\Delta x\,\Delta y$ y, al refinar la malla, la **suma de Riemann** se vuelve la integral doble:

$$ \text{masa}\approx \sum_i\sum_j d(x_i,y_j)\,\Delta x\,\Delta y \;\longrightarrow\; \text{masa}=\iint_R d(x,y)\,dx\,dy $$

En probabilidad, la densidad conjunta ocupa el lugar de $d$ y la masa total es la probabilidad total:

$$ P((X,Y)\in R)=\iint_R f_{XY}(x,y)\,dA, \qquad \iint_{\R^2} f_{XY}(x,y)\,dA=1 $$

La segunda es la **normalización conjunta**, con la que se halla una constante $k$.

**Teorema de Fubini.** La integral doble se calcula como **dos integrales simples anidadas** (integral iterada), y el **orden de integración se puede elegir**, ajustando los límites al recinto. Para el triángulo $0<x<1,\ 0<y<1-x$:

$$ \iint_R d\,dA = \int_0^1\!\left[\int_0^{1-x} d(x,y)\,dy\right]dx = \int_0^1\!\left[\int_0^{1-y} d(x,y)\,dx\right]dy $$

> [!tip] Regla de los límites
> La integral interna barre el recinto con una varilla con la variable externa fija: sus límites pueden depender de esa variable. La externa suma todas las varillas: sus límites son **siempre constantes**. Si en un límite externo quedan dos variables, el orden está invertido. Conviene dibujar el recinto antes de elegir el orden; uno bien elegido evita partir la integral en dos.

**Baricentro y esperanzas.** El centro de masa de la placa es

$$ \bar x = \frac{\iint_R x\,d(x,y)\,dA}{\text{masa}},\qquad \bar y = \frac{\iint_R y\,d(x,y)\,dA}{\text{masa}} $$

Si $d$ es una densidad conjunta normalizada (masa $=1$), entonces $(\bar x,\bar y)=(E[X],E[Y])$.

**Diccionario masa ↔ probabilidad.** Masa total ↔ probabilidad total ($=1$); masa acumulada ↔ FDA conjunta (integrar la densidad sobre $\{X\le x,\ Y\le y\}$ la recupera); baricentro ↔ vector de esperanzas; momento de inercia respecto del baricentro ↔ [[varianza]].

**Cómo reconocerla.** Se da una densidad conjunta y se pide la probabilidad de una región, una constante, una marginal o $E[g(X,Y)]$. Para chequear la [[independencia-de-variables-aleatorias|independencia de $X$ e $Y$]] se compara la conjunta con el producto de las marginales (obtenidas integrando).

> [!discrepancia] Errata del apunte en el ejemplo de la placa
> Para la placa $\{0<x,\ 0<y,\ x+y<1\}$ con $d(x,y)=xy$, el apunte usa la primitiva $\int xy\,dy=xy^2$ (sin el $\tfrac12$) y publica masa $\tfrac1{12}$ y baricentro $(\tfrac15,\tfrac15)$. El wiki lo marca como error: con $\int y\,dy=\tfrac{y^2}{2}$ la masa es $\tfrac1{24}$ y el baricentro $(\tfrac25,\tfrac25)$; el propio apunte pone el $\tfrac12$ dos páginas después. En el parcial: cálculo correcto, dejando escrito $\int y\,dy=\tfrac{y^2}{2}$.

> [!figura] u0-superficie-densidad-suma-de-riemann
> Cada celda de la malla levanta un prisma de altura $d(x_i,y_j)$ sobre la parte de la celda que cae dentro de $R$, y la masa es el volumen que encierran. Las celdas del borde entran con la fracción de su área que cae dentro de $R$: ese es el peso $\Delta A_{ij}$ con que suman. Note que al aumentar $n$ los prismas se pegan a la superficie y el error frente al valor exacto $1/24$ baja de forma sostenida.

> [!figura] u0-fubini-orden-de-integracion
> La varilla de la integral interna barriendo el triángulo, en los dos órdenes de integración. La flecha superior es el **barrido externo**: la integral de afuera suma todas las varillas moviendo $x$ (o $y$, según el orden). Observe que el límite externo se mantiene constante y solo el interno depende de la otra variable: si en un límite quedan dos variables, el orden está invertido.

> [!figura] u0-baricentro-placa-triangular
> El baricentro correcto $(2/5,\,2/5)$ frente al $(1/5,\,1/5)$ que publica el apunte. Como la densidad $d(x,y)=xy$ se anula sobre los dos ejes, la masa se concentra hacia el interior del triángulo y el baricentro no puede quedar pegado al origen. En clave probabilística, tras normalizar la densidad, ese punto es $(\E[X],\,\E[Y])$.

Detalle: [[tecnica-integrales-dobles|Integrales dobles]]

## 3. Derivadas parciales

Derivar es la **operación inversa de acumular**: la FDA $F_X(x)=P(X\le x)$ acumula probabilidad y la densidad se recupera derivando. Si $m(x)$ es la masa de un **alambre** acumulada hasta $x$, la densidad lineal en $\alpha$ es el límite de $\Delta m/\Delta x$, o sea $\frac{dm}{dx}(\alpha)$. Con $m\leftrightarrow F_X$:

$$ f_X(x)=F_X'(x) $$

**Derivada parcial.** $\frac{\partial m}{\partial x}$ (o $\partial_x m$) es la derivada respecto de $x$ **tratando $y$ como constante**. Para una **placa**, $m(\alpha,\beta)$ es la masa del cuadrante $\{x\le\alpha,\ y\le\beta\}$, y la densidad sale de un cociente incremental en las dos direcciones (cuatro vértices con signos $+,-,+,-$), cuyo límite es la **derivada parcial cruzada**:

$$ d(x,y)=\frac{\partial}{\partial x}\frac{\partial}{\partial y}\,m(x,y)=\frac{\partial^2 m}{\partial x\,\partial y} $$

Con $m\leftrightarrow F$ (FDA conjunta $F(x,y)=P(X\le x,\,Y\le y)$), la densidad conjunta es

$$ f(x,y)=\frac{\partial^2 F}{\partial x\,\partial y} $$

> [!intuicion] Por qué hacen falta las dos derivadas
> $F(x,y)$ acumula sobre todo el cuadrante inferior izquierdo; una sola derivada parcial deja todavía una franja acumulada, no un punto.

**Teorema de Clairaut/Schwarz.** Si las parciales segundas son **continuas**, el orden de derivación no importa:

$$ \frac{\partial^2 m}{\partial x\,\partial y}=\frac{\partial^2 m}{\partial y\,\partial x} $$

Por eso da igual derivar primero en $x$ o en $y$. En el wiki, $\partial_x\partial_y m$ se lee "primero en $y$, después en $x$" (aclaración propia: el apunte escribe $\tfrac{d}{dx}\tfrac{d}{dy}m$ sin fijar el orden).

> [!ejemplo] Derivadas de $m(x,y)=x^2y^3$
> Parciales primeras: $\partial_x m=2xy^3$ ($y$ constante) y $\partial_y m=3x^2y^2$ ($x$ constante). Cruzadas: $\partial_y(2xy^3)=6xy^2$ y $\partial_x(3x^2y^2)=6xy^2$, que coinciden como predice Clairaut. Segundas puras: $\partial_{xx}m=\partial_x(2xy^3)=2y^3$ y $\partial_{yy}m=\partial_y(3x^2y^2)=6x^2y$. Si $m$ fuera una FDA conjunta, la densidad conjunta sería $f(x,y)=6xy^2$ sobre su soporte.

**Independencia.** Si $X$ e $Y$ son independientes, $F(x,y)=F_X(x)F_Y(y)$ y al derivar queda $f(x,y)=f_X(x)f_Y(y)$.

**Cómo reconocerla.** El enunciado da la FDA (o la masa acumulada) y pide la densidad: derivada **simple** en una variable, **cruzada** en dos.

> [!figura] u0-alambre-masa-acumulada-y-densidad
> Arriba, la masa acumulada $m(x)$ con la secante entre $\alpha\pm\Delta x/2$; abajo, la densidad $dm/dx$ en el mismo eje. La franja sombreada del panel inferior vale $\Delta m$, y dividida por $\Delta x$ da la pendiente de la secante del panel superior. Al reducir $\Delta x$ la pendiente medida se acerca a la derivada exacta en $\alpha$.

> [!figura] u0-derivada-cruzada-cuatro-vertices
> Los cuatro cuadrantes acumulados con sus signos $+,-,+,-$: al sumarlos y restarlos solo sobrevive el rectángulo $\Delta x\cdot\Delta y$. Una sola derivada parcial dejaría una franja acumulada, no un punto; por eso hacen falta las dos. Observe que el cociente $\Delta m/(\Delta x\,\Delta y)$ tiende a $d(\alpha,\beta)$ cuando los dos lados se achican.

> [!figura] u0-clairaut-dos-caminos
> Los dos órdenes de derivación de $m(x,y)=x^2y^3$ desembocan en el mismo $6xy^2$. La igualdad no es una convención de notación: cualquiera de los dos caminos del cuadrado llega al mismo lugar, y vale siempre que las parciales segundas sean continuas (teorema de Clairaut/Schwarz).

Detalle: [[tecnica-derivadas-parciales|Derivadas parciales]]

## Cómo aparece en los parciales

Las páginas no traen ejercicios de evaluaciones: los resueltos son los ejemplos de los apuntes, y los patrones salen de «Cómo reconocer» y «Cuándo usar qué»:

- **Calcular una integral impropia y decidir si converge.** Introducir el corte $t$, integrar con una primitiva y tomar límite. Ejemplos: $\int_1^{\infty}x^{-2}\,dx=1$ (Tipo I, primitiva $-1/x$) y $\int_2^5 \frac{dx}{2\sqrt{x-2}}=\sqrt3$ (Tipo II, primitiva $\sqrt{x-2}$).
- **Normalizar una densidad sobre un dominio no acotado**, o calcular una cola, la FDA o la esperanza: Tipo I.
- **Hallar la constante $k$ de una densidad conjunta** imponiendo $\iint k\,g=1$, o calcular la probabilidad de una región del plano: integral doble con Fubini, previo dibujo del recinto.
- **Masa y baricentro (o esperanzas) de una densidad sobre un triángulo**: el ejemplo de la placa $d(x,y)=xy$ en $x+y<1$, con masa $\tfrac1{24}$, $\text{masa}\cdot\bar x=\tfrac1{60}$, de donde $\bar x=\frac{1/60}{1/24}=\tfrac25$, y $\bar y=\tfrac25$ por simetría $x\leftrightarrow y$.
- **Marginales e independencia**: integrar la conjunta en una variable y comparar con el producto de marginales.
- **Pasar de la FDA a la densidad**: derivar $F_X$ en 1D o tomar la derivada cruzada de $F(x,y)$ en 2D, verificando que las cruzadas coincidan (ejemplo $x^2y^3\Rightarrow 6xy^2$).

> [!warn] Antes de dar una probabilidad
> Si una integral doble debe dar una probabilidad, primero hay que verificar que la densidad integre uno; si no, se divide por la masa.

## Tabla de fórmulas de la unidad

| Qué | Fórmula | Cuándo se usa |
|---|---|---|
| Impropia Tipo I (extremo superior) | $\int_a^{+\infty} f\,dx=\lim_{t\to+\infty}\int_a^{t} f\,dx$ | Límite superior infinito |
| Impropia Tipo I (extremo inferior) | $\int_{-\infty}^{b} f\,dx=\lim_{t\to-\infty}\int_t^{b} f\,dx$ | Límite inferior infinito |
| Impropia Tipo I (ambos extremos) | $\int_{-\infty}^{+\infty} f=\int_{-\infty}^{c} f+\int_{c}^{+\infty} f$ | Integrar sobre toda la recta |
| Impropia Tipo II (singularidad en $b$) | $\int_a^b f\,dx=\lim_{t\to b^-}\int_a^{t} f\,dx$ | $f$ explota en el extremo derecho |
| Impropia Tipo II (singularidad en $a$) | $\int_a^b f\,dx=\lim_{t\to a^+}\int_t^{b} f\,dx$ | $f$ explota en el extremo izquierdo |
| Tipo II en los dos extremos | $\int_a^b f=\int_a^{c} f+\int_{c}^{b} f,\ c\in(a,b)$ | $f$ explota en $a$ y en $b$ |
| Colas de referencia | $\int_1^{\infty}\frac{dx}{x^2}=1$, $\int_1^{\infty}\frac{dx}{x}=+\infty$ | Comparar velocidad de decaimiento |
| Normalización 1D | $\int_{-\infty}^{+\infty} f_X(x)\,dx=1$ | Verificar una densidad o hallar una constante |
| Probabilidad como área | $P(a\le X\le b)=\int_a^b f_X(x)\,dx$ | Probabilidad de un intervalo |
| FDA | $F_X(x)=\int_{-\infty}^{x} f_X(y)\,dy$ | Acumular la densidad |
| Esperanza | $E[X]=\int_{-\infty}^{+\infty} x\,f_X(x)\,dx$ | Media de una v.a. continua (puede divergir) |
| Masa (suma de Riemann) | $\text{masa}=\iint_R d(x,y)\,dx\,dy$ | Límite de $\sum_i\sum_j d\,\Delta x\,\Delta y$ |
| Probabilidad de una región | $P((X,Y)\in R)=\iint_R f_{XY}\,dA$ | Par $(X,Y)$ continuo |
| Normalización conjunta | $\iint_{\R^2} f_{XY}\,dA=1$ | Hallar $k$ en una densidad conjunta |
| Fubini (triángulo) | $\int_0^1\!\int_0^{1-x} d\,dy\,dx=\int_0^1\!\int_0^{1-y} d\,dx\,dy$ | Elegir el orden de integración |
| Baricentro | $\bar x=\frac{\iint_R x\,d\,dA}{\text{masa}}$, $\bar y=\frac{\iint_R y\,d\,dA}{\text{masa}}$ | Con masa $1$: $(\bar x,\bar y)=(E[X],E[Y])$ |
| Densidad lineal (cociente incremental) | $\frac{\Delta m}{\Delta x}\xrightarrow[\Delta x\to 0]{}\frac{dm}{dx}(\alpha)$ | Masa acumulada de un alambre |
| Densidad en 1D | $f_X(x)=F_X'(x)$ | De la FDA a la densidad |
| Derivada cruzada | $d(x,y)=\frac{\partial^2 m}{\partial x\,\partial y}$ | De la masa acumulada a la densidad de la placa |
| Densidad conjunta | $f(x,y)=\frac{\partial^2 F}{\partial x\,\partial y}$ | De la FDA conjunta a la densidad |
| Clairaut/Schwarz | $\frac{\partial^2 m}{\partial x\,\partial y}=\frac{\partial^2 m}{\partial y\,\partial x}$ | Parciales segundas continuas |
| Independencia | $F=F_XF_Y\Rightarrow f=f_Xf_Y$ | Derivar una FDA conjunta factorizada |

Hoja completa: [[formulario-complementos-matematicos|Formulario — Complementos Matemáticos]].
