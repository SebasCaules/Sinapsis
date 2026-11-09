---
titulo: "Resumen de la Unidad 5 — Función de V.A. y Bidimensionales"
tipo: resumen
unidad: 5
orden: 1
hub: true
tags: [resumen, bidimensionales, funcion-de-variable-aleatoria, condicional]
resumen: "La distribución de $Y=g(X)$ se obtiene por la FDA, $F_Y(y)=P(g(X)\le y)$. Un vector $(X,Y)$ se describe con su conjunta, de la que salen marginales, condicionales, covarianza, independencia y las leyes de esperanza y varianza total que resuelven las mezclas."
fuentes: ["[[funcion-de-variable-aleatoria]]", "[[tecnica-distribucion-de-una-funcion-de-va]]", "[[variables-aleatorias-bidimensionales]]", "[[covarianza-y-correlacion]]", "[[independencia-de-variables-aleatorias]]", "[[esperanza-condicional]]", "[[mezcla-de-distribuciones]]", "[[formulario-funcion-de-va-y-bidimensionales]]"]
actualizado: 2026-11-09
---

# Resumen de la Unidad 5 — Función de V.A. y Bidimensionales

Las unidades 3 y 4 describieron **una** variable aleatoria, discreta o continua, con su masa o su densidad, su acumulada y sus momentos. La unidad 5 extiende esa maquinaria en dos direcciones. Primero, **transformar** una variable: si se conoce la distribución de $X$, ¿cuál es la de $Y=g(X)$? La respuesta pasa siempre por la [[funcion-de-distribucion-acumulada|FDA]]. Segundo, observar **dos** variables a la vez: el vector $(X,Y)$ se describe con una distribución conjunta, de la que se obtienen marginales, condicionales, covarianza y correlación, el criterio de independencia y la esperanza condicional. Con esta última se resuelven las **mezclas**, donde una variable auxiliar elige de qué subpoblación sale el dato. Las herramientas de cálculo son las [[tecnica-integrales-dobles|integrales dobles]] con límites leídos del dibujo del soporte. La unidad siguiente pasa a los procesos estocásticos, que son familias de variables aleatorias observadas a lo largo del tiempo.

> [!info] Lo esencial
> - Para hallar la distribución de $Y=g(X)$ se escribe $F_Y(y)=P(g(X)\le y)$, se traduce el evento a uno sobre $X$, se evalúa en $F_X$ y solo entonces se deriva.
> - La conjunta lo contiene todo: las marginales se obtienen sumando o integrando la otra variable, pero las marginales **no** reconstruyen la conjunta.
> - $\text{Cov}(X,Y)=E[XY]-\mu_X\mu_Y$ y $\rho_{X,Y}=\text{Cov}(X,Y)/(\sigma_X\sigma_Y)\in[-1,1]$; independencia implica covarianza nula, pero no al revés (salvo el caso conjuntamente normal).
> - Un soporte no rectangular (por ejemplo $0<y<x<1$) basta para afirmar que las variables son dependientes.
> - $E[X]=E[E[X\mid Y]]$ y $\text{Var}(X)=E[\text{Var}(X\mid Y)]+\text{Var}(E[X\mid Y])$: la varianza nunca se promedia directamente.

> [!nota] Notación del wiki
> En esta unidad la varianza se escribe $\text{Var}(X)$, como en las fuentes de variables bidimensionales, porque así se lee mejor junto a $\text{Cov}(X,Y)$ y a la varianza condicional $\text{Var}(X\mid Y)$. Es la misma cantidad que $V(X)=\sigma_X^2$, la notación del [[formulario-maestro|formulario maestro]] y de las unidades 3, 4, 7 y 8.

## 1. Función de una variable aleatoria: el método de la FDA

Dada una v.a. $X$ y una función $g:\mathbb{R}\to\mathbb{R}$, $Y=g(X)$ es otra v.a. El problema central es: **conocida la distribución de $X$, hallar la de $Y$**. El procedimiento robusto, que sirve aunque $g$ no sea inyectiva o cambie el tipo de variable, es el **método de la FDA**: la acumulada de $Y$ es siempre una probabilidad sobre $X$.

$$ F_Y(y)=P(Y\le y)=P\big(g(X)\le y\big) $$

El truco consiste en reescribir el evento $\{g(X)\le y\}$ como un evento sobre $X$ (la **preimagen**) y leerlo en $F_X$. Después se pasa a densidad o masa:

$$ f_Y(y)=\frac{d}{dy}F_Y(y)\quad(Y\text{ continua}),\qquad p_Y(k)=\sum_{x:\,g(x)=k}p_X(x)\quad(Y\text{ discreta}) $$

En el caso continuo se deriva con la **regla de la cadena**; en el discreto se agrupan las masas de las preimágenes de cada valor $k$.

**Tipos de resultado.** Una $X$ discreta da siempre una $Y$ discreta. Una $X$ continua con $g$ **escalonada** (que clasifica en categorías) da una $Y$ **discreta**, cuya masa en cada valor es la probabilidad de que $X$ caiga en el tramo correspondiente. Una $X$ continua con $g$ continua estrictamente monótona o por tramos da una $Y$ continua. Una discreta nunca se vuelve continua.

**Cómo reconocerlo:** el enunciado da la densidad o la acumulada de una magnitud (radio, tensión, demanda) y pregunta por otra que se calcula a partir de ella (volumen, potencia, beneficio).

> [!figura] u5-la-preimagen-de-g-x-y-sobre-la-curva-de-g
> Arriba, la curva $y=g(x)$ cortada por la recta horizontal de altura $y$; abajo, la densidad $f_X$ sobre el mismo eje, con la preimagen $\{x:g(x)\le y\}$ sombreada: esa área es $F_Y(y)$. Compare las tres opciones de $g$ y observe que la receta no cambia, solo cambia la forma de la preimagen (dos ramas con $x^2$, una semirrecta con $g$ monótona).

> [!figura] u5-de-una-uniforme-a-cualquier-distribucion
> El valor $u$ sorteado en $(0,1)$ viaja horizontalmente hasta la FDA y baja al eje $x$: eso es $F_X^{\leftarrow}(u)$. Al acumular sorteos el histograma reproduce la densidad objetivo; en el caso discreto, todo un tramo de valores de $u$ cae sobre el mismo salto y colapsa a un único $x$.

Detalle: [[funcion-de-variable-aleatoria|Función de Variable Aleatoria]]

## 2. La receta paso a paso y los casos según $g$

La técnica de la unidad tiene cuatro pasos: (1) **identificar el soporte de $Y$** como imagen de $g$ sobre el recorrido de $X$; (2) escribir $F_Y(y)=P(g(X)\le y)$ y traducir el evento; (3) derivar o sumar masas; (4) escribir el resultado **por tramos**, con el soporte explícito. La traducción del paso (2) depende de la forma de $g$:

$$ g\text{ creciente: } F_Y(y)=F_X\big(g^{-1}(y)\big),\qquad g\text{ decreciente: } F_Y(y)=1-F_X\big(g^{-1}(y)\big) $$

Si $g$ es **monótona estricta**, se puede usar directamente la fórmula del cambio de variable:

$$ f_Y(y)=f_X\big(g^{-1}(y)\big)\left|\frac{d}{dy}g^{-1}(y)\right| $$

El valor absoluto del jacobiano corrige cuánto estira o comprime $g$ el eje, y es positivo aunque $g$ sea decreciente.

Si $g$ **no es inyectiva**, la preimagen es una unión de intervalos y hay que sumar las ramas. Para $Y=X^2$:

$$ F_Y(y)=F_X(\sqrt{y})-F_X(-\sqrt{y}),\qquad y>0 $$

Con una **parábola genérica** $g(x)=ax^2+bx+c$ ($a>0$) con el vértice dentro del soporte, para cada $t$ se resuelve $ax^2+bx+(c-t)=0$ y, con las raíces $x_1<x_2$, queda $F_Y(t)=F_X(x_2)-F_X(x_1)$, porque la parábola queda por debajo de $t$ *entre* las raíces. Si $a<0$ (vértice máximo), el evento $\{Y\le t\}$ es el complemento, las dos colas: $F_Y(t)=F_X(x_1)+1-F_X(x_2)$. Donde el discriminante es negativo hay que justificar $F_Y(t)=0$ o $F_Y(t)=1$ a partir del signo de la parábola.

**Cómo reconocerlo:** si aparece un cuadrado, un módulo o una parábola con máximo o mínimo dentro del soporte, hay dos ramas. Si $g$ es monótona **sobre el soporte de $X$**, basta con una sola desigualdad.

> [!warn] Errores típicos
> Olvidar el valor absoluto del jacobiano; no sumar las dos ramas en $Y=X^2$ o $Y=|X|$; confundir el soporte (si $0<x<1$ e $Y=X^3$, entonces $0<y<1$, no todo $\mathbb{R}$).

Detalle: [[tecnica-distribucion-de-una-funcion-de-va|Técnica — Hallar la distribución de Y = g(X)]]

## 3. Transformación afín y transformada inversa

La **transformación afín** $Y=aX+b$ es el caso más usado y no requiere pasar por la FDA para los momentos:

$$ \mu_Y=a\,\mu_X+b,\qquad \sigma_Y^2=a^2\sigma_X^2,\qquad \sigma_Y=|a|\,\sigma_X $$

Además $\gamma_Y=\text{sign}(a)\,\gamma_X$ (asimetría), $\kappa_Y=\kappa_X$ (curtosis) y $\text{Cov}(X,Y)=a\,\sigma_X^2$. Si $a=0$, $Y=b$ es constante. La familia normal es **cerrada por afines**: si $X\sim N(\mu_X,\sigma_X)$ y $a\neq0$, entonces $Y\sim N(a\mu_X+b,\,|a|\sigma_X)$, de donde sale la estandarización (ver [[distribucion-normal|Distribución Normal]]).

La **transformada inversa** permite simular cualquier distribución a partir de una [[distribucion-uniforme-continua|uniforme]]:

$$ Y=F_X^{-1}(U),\quad U\sim\text{Unif}(0,1)\;\Rightarrow\;F_Y(y)=P\big(U\le F_X(y)\big)=F_X(y) $$

Vale si $F_X$ es estrictamente creciente. Si tiene saltos (caso discreto) se usa la **inversa generalizada** $F_X^{\leftarrow}(u)=\min\{x:\,u\le F_X(x)\}$: los saltos de $F_X$ marcan los cortes del intervalo $(0,1)$. Ejemplos de las páginas: $B\sim\text{Bernoulli}(0.6)$ se simula con $B=0$ si $u\le0.4$ y $B=1$ si $u>0.4$; una $\text{Exp}(0.5)$ (con la **tasa** como parámetro, según la convención del wiki: media $2$) se simula con $Y=-2\ln(1-U)$ (ver [[distribucion-exponencial|Distribución Exponencial]]).

**Cómo reconocerlo:** «simular», «generar a partir de una uniforme» o «hallar $g$ tal que $g(U)$ tenga la distribución de $X$».

> [!warn] Signo de $a$
> Con $a<0$ el desvío es $\sigma_Y=|a|\sigma_X$, no $a\sigma_X$.

Detalle: [[funcion-de-variable-aleatoria|Función de Variable Aleatoria]]

## 4. Vectores aleatorios: conjunta, marginales y condicionales

Un **vector aleatorio** $(X,Y)$ describe dos magnitudes observadas en el mismo experimento. En el caso discreto se describe con la **masa conjunta** $p_{X,Y}(x,y)=P(X=x,\,Y=y)$, que suma 1; en el continuo, con la **densidad conjunta** $f_{X,Y}\ge0$, que da probabilidades por integral doble:

$$ P\big((X,Y)\in B\big)=\iint_B f_{X,Y}(x,y)\,dx\,dy,\qquad \iint_{\mathbb{R}^2}f_{X,Y}=1 $$

La segunda igualdad es la **normalización**, que se usa para hallar constantes. Las **marginales** se obtienen sumando o integrando la otra variable (en una tabla, son las sumas de fila y de columna):

$$ p_X(x)=\sum_{y\in R_Y}p_{X,Y}(x,y),\qquad f_X(x)=\int_{-\infty}^{\infty}f_{X,Y}(x,y)\,dy $$

La marginal es la «sombra» de la conjunta: distintas conjuntas pueden tener las mismas marginales. La **condicional** divide la conjunta por la marginal de la variable que se fija:

$$ f_{X\mid Y}(x\mid y)=\frac{f_{X,Y}(x,y)}{f_Y(y)},\qquad p_{X\mid Y}(x\mid y)=\frac{p_{X,Y}(x,y)}{p_Y(y)} $$

La **esperanza de una función** de las dos variables se calcula contra la conjunta:

$$ E[h(X,Y)]=\iint_{\mathbb{R}^2}h(x,y)\,f_{X,Y}(x,y)\,dx\,dy $$

(con doble suma y $p_{X,Y}$ en el caso discreto). Donde existen las derivadas, $f_{X,Y}=\partial^2 F_{X,Y}/\partial x\,\partial y$ (ver [[tecnica-derivadas-parciales|derivadas parciales]]).

**Cómo reconocerlo:** dan una tabla de doble entrada o una densidad $f(x,y)$ y piden una constante, una probabilidad sobre una región, una marginal o $E[XY]$. **Primero se dibuja el soporte**: los límites variables de la integral doble son la mayor parte del ejercicio. Para una probabilidad $P(g(X,Y)\le c)$ se dibuja la región $\{g\le c\}$ sobre el soporte; a veces conviene el complemento.

> [!warn] Límites del soporte
> En un soporte triangular como $0<r<h<10$, la marginal de $H$ integra $r$ entre $0$ y $h$, no entre $0$ y $10$.

> [!figura] u5-del-arbol-a-la-tabla-conjunta
> Cada camino del árbol se multiplica y aterriza en una celda de la tabla conjunta; los márgenes resaltados son literalmente las sumas de fila y de columna, de ahí el nombre «marginal». Observe la celda $p_{X,Y}(0,0)=0{,}10$ frente a $p_X(0)\,p_Y(0)=0{,}20$: no coinciden, así que $X$ e $Y$ no son independientes.

> [!figura] u5-traducir-p-g-x-y-c-a-una-region-del-plano
> El paso difícil es traducir $\{g(X,Y)\le c\}$ a una región del plano. Para el volumen $V=\pi R^2H$ sobre el soporte $0<r<h<10$, la curva de nivel parte la región en dos tramos con techos distintos ($h=10$ y la hipérbola), y por eso hacen falta dos integrales dobles. Mueva el umbral hasta que la curva salga del triángulo y la región vuelva a una sola integral.

> [!figura] u5-la-marginal-como-sombra-de-la-conjunta
> La superficie $f_{X,Y}(x,y)=(x+y)/27$ sobre $(0,3)^2$, un plano de corte en $x=t$ y, levantada como una pared por fuera del dominio (con su base punteada sobre el piso), la curva $f_X(t)=1/6+t/9$, que se va rellenando de $0$ a $t$ a medida que el corte avanza: cada posición de $t$ aporta el área de su corte. Integrar en $y$ es literalmente aplastar una dimensión: la marginal es la sombra de la conjunta.

> [!figura] u5-cortes-del-soporte-triangular-0-r-h-10
> El triángulo $0<r<h<10$ con un corte horizontal y uno vertical; a la derecha, la condicional que deja cada corte, con su esperanza marcada. Note que el intervalo de integración de $r$ llega hasta $h$ y no hasta $10$, y que el punto $(5,2)$ queda fuera del soporte aunque ambas marginales sean positivas ahí: eso basta para descartar la independencia.

Detalle: [[variables-aleatorias-bidimensionales|Variables Aleatorias Bidimensionales]]

## 5. Covarianza y correlación

La **covarianza** mide la asociación **lineal** entre $X$ e $Y$: cada producto $(X-\mu_X)(Y-\mu_Y)$ es positivo cuando ambas están del mismo lado de su media. Se calcula con la fórmula práctica:

$$ \text{Cov}(X,Y)=E\big[(X-\mu_X)(Y-\mu_Y)\big]=E[XY]-\mu_X\,\mu_Y $$

Propiedades: $\text{Cov}(X,X)=\text{Var}(X)$, es simétrica y **bilineal**, $\text{Cov}(aX+b,\,cY+d)=ac\,\text{Cov}(X,Y)$. Su uso más frecuente es la **varianza de una combinación lineal**:

$$ \text{Var}(aX+bY)=a^2\text{Var}(X)+2ab\,\text{Cov}(X,Y)+b^2\text{Var}(Y) $$

El **coeficiente de correlación** es la versión adimensional:

$$ \rho_{X,Y}=\frac{\text{Cov}(X,Y)}{\sigma_X\,\sigma_Y},\qquad -1\le\rho_{X,Y}\le1 $$

La cota sale de que $\text{Var}(zX+Y)\ge0$ para todo $z$: el discriminante $\le0$ da la desigualdad de Cauchy-Schwarz, $\big(\text{Cov}(X,Y)\big)^2\le\text{Var}(X)\,\text{Var}(Y)$. Con las variables normalizadas, $\text{Var}\big(X/\sigma_X\pm Y/\sigma_Y\big)=2\pm2\rho_{X,Y}\ge0$, que es otra forma de leer la cota. Además $\rho_{X,Y}=\pm1$ si y solo si $Y=aX+b$ con probabilidad 1, con $\text{sign}(a)=\text{sign}(\rho_{X,Y})$.

**Cómo reconocerlo:** piden $\text{Cov}$, $\rho$ o $\text{Var}(X+Y)$ a partir de una tabla conjunta o una densidad. El camino es marginales → $E[X]$, $E[Y]$, $E[X^2]$, $E[Y^2]$ → $E[XY]$ (con la conjunta, no con las marginales) → fórmula práctica.

> [!warn] Discrepancia: dos ejercicios con cifras distintas en el material crudo
> En el Ej. 25 del TP5 ($f_{X,Y}=(x+y)/27$ en $(0,3)^2$), una versión arrastra $E[XY]=5/3$ y $\text{Cov}=-67/48$; el wiki adopta $E[XY]=3$ y $\text{Cov}(X,Y)=-1/16$. En el Ej. 14, una resolución reporta $\sigma_X\approx1.8412$ y $\sigma_Y\approx1.3569$, que no son las raíces de las varianzas; los correctos son $1.3992$ y $1.1089$, con $\rho\approx-0.1658$.

> [!figura] u5-que-mide-y-que-no-mide
> Los cuadrantes definidos por $\mu_X$ y $\mu_Y$ colorean el signo de $(x-\mu_X)(y-\mu_Y)$: la covarianza es el promedio de esos productos. Al llevar $\rho$ hacia $\pm1$ la nube colapsa sobre una recta; en cambio, con los generadores de contraejemplo la dependencia es evidente a simple vista y sin embargo $\rho\approx0$. La recta de mínimos cuadrados se dibuja en los tres generadores: en los contraejemplos queda horizontal, que es exactamente lo que significa $\rho\approx0$. El punto marcado en el cruce es el centro $(\bar{x},\bar{y})$, vértice de los cuatro cuadrantes.

Detalle: [[covarianza-y-correlacion|Covarianza y Correlación]]

## 6. Independencia de variables aleatorias

$X$ e $Y$ son **independientes** cuando conocer una no aporta información sobre la otra; formalmente, la conjunta se **factoriza** en el producto de las marginales:

$$ p_{X,Y}(x,y)=p_X(x)\,p_Y(y)\;\;\forall x,y,\qquad f_{X,Y}(x,y)=f_X(x)\,f_Y(y)\;\;\forall(x,y) $$

Equivalentemente, la condicional coincide con la marginal: $f_{X\mid Y}(x\mid y)=f_X(x)$. Consecuencias: $E[g_1(X)g_2(Y)]=E[g_1(X)]\,E[g_2(Y)]$, en particular $E[XY]=E[X]E[Y]$; $\text{Cov}=0$; y la varianza de la suma no tiene término cruzado:

$$ \text{Var}(X+Y)=\text{Var}(X)+\text{Var}(Y)\qquad(X,Y\text{ independientes}) $$

**Detección rápida de dependencia.** (a) **Test del cero**: si hay una celda con $p_{X,Y}(x,y)=0$ donde $p_X(x)>0$ y $p_Y(y)>0$, son dependientes. (b) **Soporte no rectangular**: la factorización solo es positiva sobre un producto cartesiano $A\times B$; si el rango de $Y$ depende de $X$ (como $0<y<x<1$), son dependientes sin hacer cuentas. El soporte rectangular es condición **necesaria, no suficiente**: $f=(x+y)/27$ en $(0,3)^2$ tiene soporte rectangular y aun así no factoriza.

**Cómo reconocerlo:** «¿son independientes?» se responde mirando primero el soporte y solo después probando la factorización. Si el enunciado *da* independencia, la conjunta se arma como producto (por ejemplo, dos [[distribucion-binomial|binomiales]] $\text{Bin}(3,0.5)$ independientes suman $\text{Bin}(6,0.5)$).

> [!warn] Incorrelación no implica independencia
> $\text{Cov}(X,Y)=0$ no garantiza independencia. La única excepción es el caso conjuntamente normal, donde $\text{Cov}=0$ sí implica independencia.

> [!figura] u5-soporte-rectangular-contra-soporte-no-rectangula
> Una misma recta $x=x_0$ recorre los dos soportes: en el rectángulo el rango admisible de $Y$ mide siempre lo mismo, en el triángulo se acorta al bajar $x_0$. Conocer $X$ restringe a $Y$, luego hay dependencia. Tenga en cuenta el aviso del panel izquierdo: el soporte rectangular es condición necesaria, no suficiente — en ese mismo ejemplo $f(x,y)=(x+y)/27$ no factoriza como producto de una función de $x$ por una de $y$, así que $X$ e $Y$ tampoco son independientes ahí.

Detalle: [[independencia-de-variables-aleatorias|Independencia de Variables Aleatorias]]

## 7. Esperanza condicional y leyes de esperanza y varianza total

La **esperanza condicional** es el promedio de $X$ calculado con la distribución condicional:

$$ E[h(X)\mid Y=y]=\int_{-\infty}^{\infty}h(x)\,f_{X\mid Y}(x\mid y)\,dx $$

(con suma y $p_{X\mid Y}$ en el caso discreto). $E[X\mid Y=y]$ es un **número**; $E[X\mid Y]$, como función de $Y$, es **una variable aleatoria**. Esa distinción da las dos leyes. La **varianza condicional** es $\text{Var}(X\mid Y)=E[X^2\mid Y]-(E[X\mid Y])^2$.

**Ley de esperanza total**: se promedia por etapas, primero dentro de cada valor de $Y$ y luego sobre $Y$. Es la versión «esperada» de la [[probabilidad-total-y-bayes|probabilidad total]]:

$$ E[X]=E\big[E[X\mid Y]\big]=\sum_{y}E[X\mid Y=y]\,p_Y(y)\quad\text{o}\quad\int E[X\mid Y=y]\,f_Y(y)\,dy $$

**Ley de varianza total**: la varianza se descompone en una parte **intra** (dentro de cada grupo) y una parte **entre** grupos (dispersión de las medias condicionales):

$$ \text{Var}(X)=E\big[\text{Var}(X\mid Y)\big]+\text{Var}\big(E[X\mid Y]\big) $$

**Cómo reconocerlo:** el dato llega por etapas («dado que…», «si viaja en subte…») o se pide una media o varianza que es fácil de calcular condicionando. En el ejemplo del cilindro ($f_{R,H}=\tfrac{3}{500}r$ en $0<r<h<10$) resulta $f_{R\mid H}(r\mid h)=2r/h^2$, $E[R\mid H=h]=2h/3$ y $E[E[R\mid H]]=5=E[R]$.

> [!warn] Promediar varianzas
> Escribir $\text{Var}(X)=\sum_y\text{Var}(X\mid Y=y)\,p_Y(y)$ olvida el término $\text{Var}(E[X\mid Y])$ y subestima la varianza.

> [!figura] u5-varianza-intra-mas-varianza-entre
> Tres densidades condicionales con sus medias marcadas y, encima, la densidad total. El ancho típico de cada grupo es la parte intra y la dispersión de las medias entre sí es la parte entre; la barra apilada muestra que solo sumando las dos se llega a $\text{Var}(X)$. Separe las medias sin tocar el ancho: la barra intra no se mueve y la total crece igual.

Detalle: [[esperanza-condicional|Esperanza Condicional]]

## 8. Mezcla de distribuciones

Una **mezcla** modela una población formada por subpoblaciones: una variable auxiliar discreta $M$ elige «de qué grupo» sale el dato y $X\mid M=k$ tiene distribución conocida. Es el caso bidimensional **mixto**. La densidad, la acumulada y la esperanza de cualquier $g(X)$ se mezclan linealmente (probabilidad total), y la densidad resulta una **combinación convexa** de las condicionales:

$$ f_X(x)=\sum_{k\in R_M}f_{X\mid M}(x\mid k)\,P(M=k),\qquad E[g(X)]=\sum_{k\in R_M}E[g(X)\mid M=k]\,P(M=k) $$

Lo mismo vale para $F_X$. La varianza **no** se mezcla linealmente: se calcula $E[X^2]=\sum_k E[X^2\mid M=k]\,P(M=k)$ y luego $\text{Var}(X)=E[X^2]-(E[X])^2$, o bien con la ley de varianza total. El exceso sobre el promedio de varianzas es la **sobredispersión** $\text{Var}(E[X\mid M])$.

En la **mezcla inversa** la observada es discreta y el parámetro es continuo y aleatorio: se **integra** en lugar de sumar:

$$ p_X(x)=\int_{\mathbb{R}}p_{X\mid Y}(x\mid y)\,f_Y(y)\,dy $$

Conocido un evento sobre $X$, se invierte hacia $M$ con **Bayes**: $P(M=k\mid X\in A)=\dfrac{P(X\in A\mid M=k)P(M=k)}{\sum_j P(X\in A\mid M=j)P(M=j)}$.

**Cómo reconocerlo:** «el 70 % de las veces… y el 30 %…», una población partida en grupos con distinta distribución, o un parámetro que es a su vez aleatorio (por ejemplo una [[distribucion-poisson|Poisson]] con $\Lambda\sim\text{Unif}(0,10)$).

> [!warn] Promediar la condicional no es evaluar en el promedio
> En la mezcla Poisson–uniforme, $P(N=5)\approx0.0933$, mientras que con $\Lambda$ fijo en $E[\Lambda]=5$ daría $\approx0.1755$. Y la varianza de una mezcla en general no es el promedio de las varianzas condicionales (solo coincide si las medias condicionales son iguales, porque entonces $\text{Var}(E[X\mid M])=0$): según las páginas, la cátedra usa este error deliberadamente en los parciales.

> [!nota] Convención de la exponencial
> Como en todo el wiki, $\text{Exp}(\lambda)$ va con la **tasa**: $\text{Exp}(1/30)$ tiene media 30 y varianza $30^2$, y $E[T^2]=2/\lambda^2$.

> [!figura] u5-la-mezcla-como-superposicion-ponderada
> Cada densidad condicional aparece escalada por su peso y la mezcla es la suma de las dos: una combinación convexa, no una exponencial «promedio». Las tres barras comparan $E[\text{Var}(T\mid M)]$, $\text{Var}(E[T\mid M])$ y la varianza total; al igualar las dos medias condicionales el término «entre» se anula y solo entonces promediar varianzas daría bien.

Detalle: [[mezcla-de-distribuciones|Mezcla de Distribuciones]]

## Cómo aparece en los parciales

- **Distribución de una función creciente** (Ej. 5 del TP5): radio $R$ con $f_R(r)=6r(1-r)$ en $(0,1)$ y volumen $V=\tfrac{4\pi}{3}R^3$. Se escribe $F_V(v)=F_R\big(\sqrt[3]{3v/4\pi}\big)$, se deriva con la regla de la cadena y queda $f_V(v)=\tfrac{3}{2\pi}\big(\sqrt[3]{4\pi/(3v)}-1\big)$ en $(0,\tfrac{4\pi}{3})$. Para el área $A=4\pi R^2$ la página escribe las dos ramas, $\{-\sqrt{a/4\pi}\le R\le\sqrt{a/4\pi}\}$, pero como $R>0$ la rama negativa aporta $F_R(-\sqrt{a/4\pi})=0$: dentro del soporte $g$ es creciente y $f_A(a)=\tfrac{3}{4\pi}\big(1-\tfrac{\sqrt a}{2\sqrt\pi}\big)$ en $(0,4\pi)$.
- **Transformación no inyectiva** (ejemplo de la teórica y Ej. 2b/3a del TP5): $V\sim N(0,1)$ y $W=V^2$. Se obtiene $F_W(w)=2\Phi(\sqrt{w})-1$ y $f_W(w)=\tfrac{1}{\sqrt{2\pi w}}e^{-w/2}$, que es una [[distribucion-ji-cuadrado|chi-cuadrado]] con 1 grado de libertad.
- **Parábola con el vértice en el soporte** (Ej. 6 del TP5): beneficio $B=10Q-5Q^2$ con $Q$ triangular en $(0,2)$. El evento $\{B\le b\}$ son las dos colas $Q\le 1-\sqrt{1-b/5}$ o $Q\ge 1+\sqrt{1-b/5}$; resulta $F_B(b)=\big(1-\sqrt{1-b/5}\big)^2$ en $[0,5]$ y $P(B>3)\approx0.8649$.
- **Simulación**: construir $g(U)$ por tramos a partir de los saltos de $F_X$ (por ejemplo, una hipergeométrica con valores $0,1,2$ y cortes en $1/3$ y $13/15$).
- **Densidad conjunta en un rectángulo** (Ej. 25 del TP5): hallar la constante por normalización ($a=1/27$), una probabilidad sobre un subrectángulo ($1/9$), la marginal ($f_X(x)=\tfrac16+\tfrac{x}{9}$), $E[X]=7/4$ y la covarianza.
- **Tabla conjunta discreta** (Ej. 14 del TP5): marginales por fila y columna, momentos, $E[XY]$ con tabla auxiliar, $\text{Cov}=-0.2572$, $\rho\approx-0.1658$ y verificación con $\text{Var}(X+Y)$.
- **Independencia**: con soporte triangular $0<y<x<1$ y $f=2$ (Ej. 26 del TP5) se concluye la dependencia por el soporte y se confirma con $f_Xf_Y=4x(1-y)\neq2$. Con dos binomiales independientes (Ej. 23) se arma la conjunta como producto y se suma sobre la diagonal ($P(X=Y)=5/16$) o las antidiagonales.
- **Soporte triangular y condicional** (cilindro): marginal con límites variables, condicional, esperanza condicional y verificación de la esperanza total; $\text{Cov}(R,H)=2.5$.
- **Mezcla directa** (subte/colectivo): densidad mezcla de exponenciales $f_T(t)=\sum_k\lambda_k e^{-\lambda_k t}P(M=k)$, $E[T]=33$ min, $\text{Var}(T)=1131$ (no $1110$) y Bayes para $P(M=0\mid T<40)$.
- **Mezcla inversa** (Ej. 39 del TP5): $N\mid\Lambda\sim\text{Poisson}(\Lambda)$, $\Lambda\sim\text{Unif}(0,10)$; $P(N=5)$ por integral, $E[N]=5$ y $\text{Var}(N)=E[\Lambda]+\text{Var}(\Lambda)=40/3$.
- **Parciales y finales reales** (ver [[evaluaciones|Evaluaciones]] y [[ejercicios-de-parcial-resueltos|Ejercicios de parcial resueltos]]): la **conjunta jerárquica** (exponencial, 2.º parcial 11/06/18; uniforme, recuperatorio 2019) se arma con la definición de condicional, $f_{X,Y}(x,y)=f_{Y\mid X}(y\mid x)\,f_X(x)$; la v.a. mixta por probabilidad total (parcial 25/10/2025); y la densidad conjunta en soporte triangular con transformación logarítmica (final 05/12/2025: $f_{T,X}=\tfrac{3}{160}tx$ en $1\le x\le t+1$, $0\le t\le4$, $X=\log_{10}C$, con $P(X\le3)=43/80$ por complemento y $P(C>1000)=P(X>3)=37/80$).

## Tabla de fórmulas de la unidad

| Qué | Fórmula | Cuándo se usa |
|---|---|---|
| FDA de $Y=g(X)$ | $F_Y(y)=P\big(g(X)\le y\big)$ | Siempre, para cualquier $g$ |
| Densidad de $Y$ | $f_Y(y)=\frac{d}{dy}F_Y(y)$ | $Y$ continua |
| Masa de $Y$ | $p_Y(k)=\sum_{x:\,g(x)=k}p_X(x)$ | $Y$ discreta |
| $g$ creciente / decreciente | $F_X(g^{-1}(y))$ / $1-F_X(g^{-1}(y))$ | $g$ monótona |
| Cambio de variable | $f_Y(y)=f_X(g^{-1}(y))\,\lvert\tfrac{d}{dy}g^{-1}(y)\rvert$ | $g$ monótona estricta |
| Dos ramas | $F_Y(y)=F_X(\sqrt{y})-F_X(-\sqrt{y})$ | $Y=X^2$ |
| Afín | $\mu_Y=a\mu_X+b$, $\sigma_Y=\lvert a\rvert\sigma_X$ | $Y=aX+b$ |
| Normal por afín | $aX+b\sim N(a\mu_X+b,\lvert a\rvert\sigma_X)$ | $X$ normal, $a\neq0$ |
| Transformada inversa | $Y=F_X^{-1}(U)\Rightarrow F_Y=F_X$ | Simular desde $\text{Unif}(0,1)$ |
| Inversa generalizada | $F_X^{\leftarrow}(u)=\min\{x:u\le F_X(x)\}$ | Simular una discreta |
| Normalización conjunta | $\iint f_{X,Y}=1$, $\sum\sum p_{X,Y}=1$ | Hallar constantes |
| Marginal | $f_X(x)=\int f_{X,Y}(x,y)\,dy$ | De la conjunta a una variable |
| Condicional | $f_{X\mid Y}=f_{X,Y}/f_Y$, $p_{X\mid Y}=p_{X,Y}/p_Y$ | Fijar el valor de $Y$ |
| Esperanza de $h(X,Y)$ | $\iint h\,f_{X,Y}\,dx\,dy$ | $E[XY]$, $E[X+Y]$, etc. |
| Covarianza | $\text{Cov}(X,Y)=E[XY]-\mu_X\mu_Y$ | Asociación lineal |
| Correlación | $\rho=\text{Cov}(X,Y)/(\sigma_X\sigma_Y)\in[-1,1]$ | Comparar asociaciones |
| Cauchy-Schwarz | $\big(\text{Cov}(X,Y)\big)^2\le\text{Var}X\,\text{Var}Y$ | Acotar la covarianza |
| Normalizadas | $\text{Var}(X/\sigma_X\pm Y/\sigma_Y)=2\pm2\rho$ | Probar $\rho\in[-1,1]$ |
| Combinación lineal | $\text{Var}(aX+bY)=a^2\text{Var}X+2ab\,\text{Cov}+b^2\text{Var}Y$ | Varianza de sumas |
| Independencia | $f_{X,Y}=f_Xf_Y$, $p_{X,Y}=p_Xp_Y$ | Probar o usar independencia |
| Esperanza condicional | $E[h(X)\mid Y=y]=\int h(x)f_{X\mid Y}(x\mid y)\,dx$ | Promedio dado $Y$ |
| Esperanza total | $E[X]=E[E[X\mid Y]]$ | Datos por etapas |
| Varianza total | $\text{Var}X=E[\text{Var}(X\mid Y)]+\text{Var}(E[X\mid Y])$ | Varianza por etapas o de una mezcla |
| Mezcla | $f_X=\sum_k f_{X\mid M}(\cdot\mid k)P(M=k)$ | Población partida en grupos |
| Mezcla inversa | $p_X(x)=\int p_{X\mid Y}(x\mid y)f_Y(y)\,dy$ | Parámetro aleatorio continuo |

Hoja completa: [[formulario-funcion-de-va-y-bidimensionales|Formulario — Función de V.A. y Bidimensionales]]
