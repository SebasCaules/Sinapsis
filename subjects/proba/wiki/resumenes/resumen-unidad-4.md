---
titulo: "Resumen de la Unidad 4 — Variables Aleatorias Continuas"
tipo: resumen
unidad: 4
orden: 1
hub: true
tags: [resumen, continua, densidad, distribucion]
resumen: "Una variable continua tiene $P(X=a)=0$ y se describe con una densidad $f_X\ge0$ que integra 1; probabilidades, esperanza y varianza son integrales. La unidad presenta la Uniforme, la Exponencial (sin memoria), la Weibull, la Normal con su tabla $\Phi$ y la Pareto."
fuentes: ["[[variable-aleatoria-continua]]", "[[funcion-de-densidad]]", "[[distribucion-uniforme-continua]]", "[[distribucion-exponencial]]", "[[minimo-de-exponenciales]]", "[[tasa-de-fallas]]", "[[distribucion-weibull]]", "[[distribucion-normal]]", "[[estandarizacion-y-tabla-normal]]", "[[distribucion-pareto]]", "[[formulario-va-continuas]]"]
actualizado: 2026-11-09
---

# Resumen de la Unidad 4 — Variables Aleatorias Continuas

La unidad 3 trabajó con variables que toman valores separados y se describen con una función de masa. La unidad 4 traslada esa misma maquinaria al caso **continuo**: tiempos, longitudes, temperaturas, notas. La probabilidad puntual pasa a ser cero, la masa se reemplaza por una **densidad** y las sumas se convierten en **integrales**. Primero se ve la teoría general (FDA continua, densidad, esperanza y varianza por integral); luego los modelos continuos clásicos: la Uniforme, la Exponencial con su falta de memoria y sus aplicaciones a confiabilidad (mínimo de exponenciales, tasa de fallas, Weibull), la Normal con la técnica de estandarización y, como distribución extra, la Pareto. Las unidades siguientes usan estas herramientas para funciones de variables aleatorias, variables bidimensionales y sumas, donde la Normal vuelve como límite del teorema central del límite.

> [!info] Lo esencial
> - Una v.a. continua cumple $P(X=a)=0$ para todo $a$; por eso $<$ y $\le$ dan lo mismo y solo los intervalos tienen probabilidad positiva.
> - La densidad $f_X=F_X'$ es no negativa, integra 1 y su **área** da probabilidades; no es una probabilidad y puede valer más que 1.
> - $E[X]=\int x\,f_X(x)\,dx$ y $V(X)=E[X^2]-(E[X])^2$; si $X\ge0$, también $E[X]=\int_0^\infty P(X>x)\,dx$.
> - La Exponencial es la única continua sin memoria y con tasa de fallas constante; el mínimo de exponenciales independientes es exponencial con tasa $\sum\lambda_i$.
> - Toda normal se resuelve con una sola tabla: $F_X(x)=\Phi\big(\frac{x-\mu}{\sigma}\big)$, con $\Phi(-z)=1-\Phi(z)$ y $x_\alpha=\mu+\sigma z_\alpha$.

## 1. Variable aleatoria continua y su FDA

Una **variable aleatoria continua** (v.a.c.) toma valores en un continuo de $\mathbb{R}$ y su **probabilidad puntual es nula**. Hay tres caracterizaciones equivalentes:

$$ X \text{ es v.a.c.} \iff F_X \text{ es continua} \iff P(X=\alpha)=0\quad\forall\alpha\in\mathbb{R} $$

Esto la distingue de la v.a. discreta, cuya FDA es una «escalera» con saltos. La **FDA** $F_X(\alpha)=P(X\le\alpha)$ sigue siendo no decreciente, con límite 0 en $-\infty$ y 1 en $+\infty$. Como $F_X$ es continua, los bordes no importan:

$$ P(a<X<b)=P(a\le X\le b)=F_X(b)-F_X(a) $$

Vale para cualquier combinación de $<$ y $\le$, porque los extremos tienen probabilidad cero. El ejemplo de la cátedra: si $X$ es la altura de un alumno, $P(X=173\text{ cm})=0$; lo que se pregunta es $P(172.5<X<173.5)$.

Cómo reconocerlo: el enunciado mide una magnitud (tiempo, temperatura, longitud) en lugar de contar. Cuando la densidad viene por tramos, la FDA también queda por tramos y debe **empalmar** en los bordes del soporte (valer 0 en el extremo inferior y 1 en el superior); si no empalma, hay un error de cálculo.

> [!figura] u4-fda-escalera-vs-continua
> Compare el incremento $F_X(\alpha)-F_X(\alpha-\delta)$ en una FDA en escalera y en una FDA continua. Al achicar $\delta$, en la escalera el incremento se estanca en el tamaño del salto —que es $P(X=\alpha)$—, mientras que en la continua colapsa a cero.

> [!figura] u4-discretizacion-a-integral
> Discretice la densidad $f_X(x)=2x$ en intervalos de ancho $2\delta$ y compare $\sum_i x_i\,p_i$ con el valor exacto $E[X]=2/3$. Observe que al achicar $\delta$ la suma converge, y que correr la grilla cambia la aproximación pero no el límite.

Detalle: [[variable-aleatoria-continua|Variable Aleatoria Continua]]

## 2. Función de densidad, esperanza y varianza

La **función de densidad** (pdf) es el análogo continuo de la función de masa. Se obtiene derivando la FDA y, recíprocamente, la FDA es su integral:

$$ f_X(x)=\frac{dF_X(x)}{dx}, \qquad F_X(x)=\int_{-\infty}^{x} f_X(y)\,dy $$

La derivada vale donde $F_X$ es derivable; el valor de $f_X$ en puntos aislados no altera ninguna probabilidad. Sus dos propiedades son **no negatividad** y **normalización**:

$$ f_X(x)\ge0, \qquad \int_{-\infty}^{+\infty} f_X(x)\,dx=1 $$

La probabilidad de un intervalo es el **área bajo la densidad**:

$$ P(a<X\le b)=\int_a^b f_X(x)\,dx=F_X(b)-F_X(a) $$

La densidad se interpreta como **probabilidad por unidad de longitud**: $f_X(x)\,\Delta x$ aproxima la probabilidad de un intervalo pequeño de ancho $\Delta x$ alrededor de $x$. Por eso $f_X$ puede superar 1, mientras que el área nunca lo hace.

La **esperanza** y la **varianza** reemplazan la suma por una integral:

$$ E[X]=\int_{-\infty}^{+\infty} x\,f_X(x)\,dx, \qquad E[g(X)]=\int_{-\infty}^{+\infty} g(x)\,f_X(x)\,dx $$

$$ V(X)=\int_{-\infty}^{+\infty}(x-\mu_X)^2 f_X(x)\,dx=E[X^2]-(E[X])^2 $$

Con $g(x)=x^k$ se obtienen los momentos $E[X^k]$; en la práctica la varianza se calcula con la segunda forma. Para una variable **no negativa** existe además la **esperanza por la cola**, útil cuando se conoce $F_X$ pero la densidad es incómoda:

$$ E[X]=\int_0^{+\infty}\big(1-F_X(x)\big)\,dx=\int_0^{+\infty}P(X>x)\,dx \qquad (X\ge0) $$

Los **cuantiles** se definen con la FDA: el cuantil $\alpha$ es $x_\alpha$ tal que $F_X(x_\alpha)=\alpha$; la mediana es $x_{0.5}$.

Cómo reconocerlo: el patrón típico de examen da una densidad con una **constante $k$** sin determinar en un soporte $[a,b]$. Se despeja $k$ imponiendo $\int_{\mathbb{R}} f_X=1$ (alcanza con integrar sobre $[a,b]$), y luego se piden probabilidades, la FDA por tramos, $E[X]$, $V(X)$ y la mediana o cuartiles. Si el soporte no es acotado, las integrales son impropias.

> [!warn] La densidad no es una probabilidad
> $f_X(x)$ puede ser mayor que 1 y $P(X=x)$ siempre es 0. Además, un valor de $k$ «feo» (una fracción con números grandes, como $k=4/16875$ en el ejercicio de la temperatura) no es señal de error: es una constante que se arrastra en los cálculos siguientes.

> [!figura] u4-fda-y-densidad-acopladas
> Un cursor recorre a la vez la FDA y la densidad: la altura $F_X(x)$ es el área acumulada bajo $f_X$, y la pendiente de la tangente a $F_X$ es $f_X(x)$. De ahí salen las dos propiedades de esta sección: el área total vale $1$ y $F_X$ no decrece porque $f_X\ge0$.

> [!figura] u4-densidad-por-ancho-es-probabilidad
> El rectángulo de base $\Delta x$ y altura $f_X(x)$ se superpone al área exacta del mismo intervalo. Note que la densidad puede superar $1$ mientras el área nunca lo hace, y que los dos números se acercan al achicar $\Delta x$.

Detalle: [[funcion-de-densidad|Función de Densidad de Probabilidad]]

## 3. Distribución Uniforme continua

$X\sim\text{Unif}(a,b)$ modela un valor **al azar en un intervalo** $(a,b)$ sin predilección por ningún punto: la densidad es **constante**.

$$ f_X(x)=\frac{1}{b-a}\ \ (a<x<b), \qquad F_X(x)=\frac{x-a}{b-a}\ \ (a<x\le b) $$

Fuera de $(a,b)$ la densidad vale 0; la FDA vale 0 antes de $a$ y 1 después de $b$. La consecuencia práctica es que la probabilidad de un subintervalo es la **proporción de largo** que ocupa:

$$ P(c<X<d)=\frac{d-c}{b-a} \qquad (a\le c<d\le b) $$

$$ E[X]=\frac{a+b}{2}, \qquad V(X)=\frac{(b-a)^2}{12} $$

La esperanza es el punto medio del intervalo. Es simétrica (asimetría 0) y platicúrtica, con curtosis $-6/5$. Además, si $U\sim\text{Unif}(0,1)$ y $F$ es una FDA continua estrictamente creciente, $F^{-1}(U)$ tiene FDA $F$ (método de la transformada inversa).

Cómo reconocerla: «al azar», «con igual probabilidad en un intervalo», «un pasajero llega en un instante al azar» a una parada con frecuencia fija. En el ejercicio del autobús que pasa cada 5 minutos, esperar menos de 3 minutos equivale a $P(X>2)=3/5$.

Detalle: [[distribucion-uniforme-continua|Distribución Uniforme (continua)]]

## 4. Distribución Exponencial y falta de memoria

$X\sim\text{Expo}(\lambda)$ modela **tiempos de vida, de espera o entre sucesos** de un proceso de Poisson de tasa $\lambda>0$ (sucesos por unidad de tiempo). El parámetro de la cátedra es la **tasa**, no la media.

$$ f_X(x)=\lambda e^{-\lambda x}\ \ (x>0), \qquad F_X(x)=1-e^{-\lambda x}, \qquad P(X>x)=e^{-\lambda x}\ \ (x\ge0) $$

$$ E[X]=\frac{1}{\lambda}, \qquad V(X)=\frac{1}{\lambda^2} $$

Media y desvío coinciden: $\sigma_X=1/\lambda$. Su propiedad característica es la **falta de memoria**: haber sobrevivido hasta $x$ no informa nada sobre el futuro.

$$ P(X>x+\Delta\mid X>x)=\frac{P(X>x+\Delta)}{P(X>x)}=e^{-\lambda\Delta}=P(X>\Delta) $$

Es la **única** distribución continua sin memoria (su análogo discreto es la geométrica). Es caso particular de la Weibull con $b=1$ y de la Gamma/Erlang con forma 1. Es sesgada a la derecha y leptocúrtica, con curtosis $+6$.

Cómo reconocerla: «tiempo hasta la falla», «tiempo entre llegadas», «falla al azar en promedio cada $T$ horas» (entonces $\lambda=1/T$). Si dan la media, $\lambda=1/\mu$. La falta de memoria se activa cuando el enunciado dice que el dispositivo «ya funcionó» cierto tiempo.

> [!warn] Pasar de media a tasa
> La media 400 hs significa $\lambda=1/400$, no $\lambda=400$. Y por falta de memoria, $P(\text{falla en las próximas 100 hs}\mid \text{ya duró 400})$ es simplemente $1-e^{-100/400}\approx0.2212$.

> [!figura] u4-falta-de-memoria-cola-renormalizada
> Arriba, la cola $x>t$ resaltada sobre la densidad; abajo, esa misma cola dividida por $P(X>t)$. Al mover $t$ la curva de abajo no se mueve: la vida restante tiene exactamente la misma exponencial que el dispositivo nuevo.

Detalle: [[distribucion-exponencial|Distribución Exponencial]]

## 5. Mínimo de exponenciales (sistemas en serie)

Un **sistema en serie** falla en cuanto falla **alguno** de sus componentes, así que su duración es el **mínimo** de las duraciones. Si $X_1,\dots,X_n$ son exponenciales **independientes** de tasas $\lambda_i$, el mínimo vuelve a ser exponencial y **las tasas se suman**:

$$ T=\min(X_1,\dots,X_n)\sim\text{Expo}\Big(\textstyle\sum_{i=1}^n\lambda_i\Big), \qquad E[T]=\frac{1}{\sum_i\lambda_i} $$

Se deduce con la **función de supervivencia**: el mínimo supera $t$ si y solo si todos lo superan, y por independencia

$$ P(T>t)=\prod_{i=1}^n P(X_i>t)=\prod_{i=1}^n e^{-\lambda_i t}=e^{-(\sum_i\lambda_i)t} $$

Con $n$ componentes idénticos, $T\sim\text{Expo}(n\lambda)$ y $E[T]=1/(n\lambda)$: cuantos más componentes en serie, antes falla el sistema.

Cómo reconocerlo: «conectados en serie», «si falla al menos uno falla todo el sistema», o el primer evento entre varios procesos de Poisson superpuestos. El mismo argumento de la cola es el que da, por ejemplo, el mínimo de Pareto i.i.d.: $\min_i X_i\sim\text{Pareto}(x_0,n\alpha)$.

> [!warn] Mínimo no es suma
> El **mínimo** de exponenciales es exponencial; la **suma** de exponenciales i.i.d. es Gamma/Erlang y modela componentes en *standby* (uno arranca cuando falla el anterior), no en serie.

Detalle: [[minimo-de-exponenciales|Mínimo de exponenciales (sistemas en serie)]]

## 6. Función de tasa de fallas

Para una duración $T\ge0$, la **tasa de fallas** (o tasa de riesgo, *hazard rate*) mide el riesgo instantáneo de fallar **dado que se sobrevivió hasta $t$**. Al denominador $S(t)=1-F_T(t)=P(T>t)$ se lo llama **función de supervivencia** o confiabilidad.

$$ R(t)=\frac{f_T(t)}{1-F_T(t)}=-\frac{d}{dt}\ln S(t) $$

Para $\Delta t$ pequeño, $P(t\le T\le t+\Delta t\mid T>t)\approx R(t)\,\Delta t$. Integrando se recupera la distribución a partir de la tasa:

$$ S(t)=1-F_T(t)=\exp\!\left(-\int_0^t R(u)\,du\right) $$

La **forma** de $R$ describe el envejecimiento: **creciente** indica desgaste, **decreciente** indica «mortalidad infantil» y **constante** indica falla al azar. El resultado central (ej. 13 de la guía) es

$$ R(t)\equiv\lambda \ \text{(constante)} \iff T\sim\text{Expo}(\lambda) $$

La ida es un cálculo directo ($\lambda e^{-\lambda t}/e^{-\lambda t}=\lambda$); la vuelta resuelve la ecuación diferencial $-\frac{d}{dt}\ln S=\lambda$ con $S(0)=1$. Es otra forma de expresar la falta de memoria.

Cómo reconocerlo: piden «demostrar que la tasa de fallas es constante», clasificar un componente como que se desgasta o no, o reconstruir la FDA a partir de $R(t)$.

> [!warn] $R(t)$ no es $F_T(t)$
> $F_T(t)$ es la probabilidad de haber fallado antes de $t$; $R(t)$ es el peligro en el instante $t$ condicionado a haber llegado vivo. No es una probabilidad acumulada.

> [!figura] u4-tres-formas-de-la-tasa-de-fallas
> Tasa de fallas, supervivencia y densidad de una familia Weibull sobre el mismo eje $t$. Al variar el parámetro de forma $b$ se recorren las tres ramas: $b>1$ desgaste, $b=1$ falla al azar (exponencial) y $b<1$ mortalidad infantil.

Detalle: [[tasa-de-fallas|Función de tasa de fallas (tasa de riesgo)]]

## 7. Distribución Weibull

La **Weibull** generaliza la exponencial para duraciones con tasa de fallas **no constante**. La guía la define por su FDA, con forma $b>0$ y tasa (escala) $\lambda>0$:

$$ F_X(x)=1-e^{-(\lambda x)^b}\ \ (x>0), \qquad f_X(x)=\lambda b(\lambda x)^{b-1}e^{-(\lambda x)^b}\ \ (x>0) $$

$$ R(x)=\lambda b(\lambda x)^{b-1} $$

La tasa de fallas es una potencia de $x$: con $b=1$ es constante y se recupera la exponencial; con $b>1$ es creciente (desgaste); con $b<1$ es decreciente (mortalidad infantil). $\lambda$ solo fija la escala de tiempo. La mediana es $m=(\ln 2)^{1/b}/\lambda$. Su media y varianza usan la función Gamma (resultado estándar que el material de la unidad no deduce):

$$ E[X]=\frac{1}{\lambda}\,\Gamma\!\left(1+\tfrac1b\right), \qquad V(X)=\frac{1}{\lambda^2}\left[\Gamma\!\left(1+\tfrac2b\right)-\Gamma\!\left(1+\tfrac1b\right)^2\right] $$

Cómo reconocerla: el enunciado nombra «Weibull» y da la FDA $1-e^{-(\lambda x)^b}$, o pide la **duración garantizada** $G_p$ con $P(X>G_p)=p$, que se despeja de $e^{-(\lambda G_p)^b}=p$. Con $b=2$ y $\lambda=0.01$ (miles de horas), $G_{90}=\sqrt{-\ln 0.9}/0.01\approx32.459$; como está en miles de horas, $G_{90}\approx32\,459$ hs.

> [!nota] Probabilidad condicional en la Weibull
> Como la única continua sin memoria es la exponencial, si se pregunta por piezas que ya superaron cierta duración, la probabilidad es condicional y no se simplifica como en la exponencial: $P(X>20\mid X>10)=P(X>20)/P(X>10)=e^{-0.03}$ con los datos del ejercicio, no $P(X>10)$.

Detalle: [[distribucion-weibull|Distribución Weibull]]

## 8. Distribución Normal

$X\sim N(\mu,\sigma)$ es la «campana»: simétrica alrededor de $\mu$ y con dispersión fijada por $\sigma$. Modela mediciones físicas, errores, dimensiones de piezas y calificaciones, y aparece como límite de sumas (teorema central del límite).

$$ f_X(x)=\frac{1}{\sqrt{2\pi}\,\sigma}\exp\!\left\{-\frac{(x-\mu)^2}{2\sigma^2}\right\},\qquad x\in\mathbb{R} $$

$$ E[X]=\mu, \qquad V(X)=\sigma^2 $$

Por simetría, media, mediana y moda valen $\mu$; los puntos de inflexión están en $\mu\pm\sigma$. Asimetría y curtosis valen 0 (es la referencia mesocúrtica). La FDA **no tiene forma cerrada**, por lo que se reduce a la normal estándar:

$$ F_X(x)=\Phi\!\left(\frac{x-\mu}{\sigma}\right) $$

Aquí $\Phi$ es la FDA tabulada de $Z\sim N(0,1)$. Otras propiedades clave son la **transformación lineal** y la **regla empírica**:

$$ Y=aX+b \ (a\neq0) \;\Rightarrow\; Y\sim N(a\mu+b,\ |a|\,\sigma) $$

$$ P(|X-\mu|<\sigma)\approx0.6827,\quad P(|X-\mu|<2\sigma)\approx0.9545,\quad P(|X-\mu|<3\sigma)\approx0.9973 $$

El valor absoluto en el desvío de $Y$ es necesario porque $a$ puede ser negativo. La suma de normales independientes es normal.

Cómo reconocerla: el enunciado dice «normal» o «gaussiana» y da media y desvío (o varianza); piden porcentajes de superar un valor, o el valor (capacidad de tanque, nota mínima, tolerancia) asociado a una probabilidad dada.

> [!warn] Convención: el segundo parámetro es el desvío
> La cátedra escribe $N(\mu,\sigma)$ con el **desvío** estándar, no la varianza. Si el enunciado da «media 78 y varianza 36», entonces $X\sim N(78,6)$. Otros textos usan $N(\mu,\sigma^2)$.

> [!figura] u4-regla-empirica-invariante
> Las tres bandas **anidadas** $\mu\pm k\sigma$ sombreadas sobre la campana, cada una rotulada con la probabilidad de su intervalo completo: $68.27\,\%$ para $\mu\pm\sigma$, $95.45\,\%$ para $\mu\pm2\sigma$ y $99.73\,\%$ para $\mu\pm3\sigma$ (el núcleo queda más oscuro porque pertenece a las tres). Al mover $\mu$ y $\sigma$ la curva se desplaza y se estira, pero los tres porcentajes no cambian: por eso alcanza una sola tabla de $\Phi$. Con «ver en unidades $z$» se superpone la $N(0,1)$ de referencia y se comprueba que todas las normales colapsan en la misma curva.

Detalle: [[distribucion-normal|Distribución Normal]]

## 9. Estandarización y uso de la tabla normal

Es la receta para resolver cualquier normal con **una sola tabla**. El valor estandarizado $z$ mide a cuántos **desvíos** del centro está $x$.

$$ Z=\frac{X-\mu}{\sigma}\sim N(0,1), \qquad \Phi(z)=P(Z\le z) $$

La igualdad de probabilidades al estandarizar vale porque se aplica una función creciente y biyectiva a ambos lados de la desigualdad. Como las tablas suelen traer solo $z\ge0$, se usa la **simetría**:

$$ \Phi(-z)=1-\Phi(z) $$

$$ P(X>x)=1-\Phi\!\left(\frac{x-\mu}{\sigma}\right), \qquad P(\mu-k\sigma<X<\mu+k\sigma)=2\Phi(k)-1 $$

En el **problema inverso** (dan la probabilidad y piden el valor) se usa el **fractil** $z_\alpha=\Phi^{-1}(\alpha)$:

$$ x_\alpha=\mu+\sigma\,z_\alpha, \qquad z_{1-\alpha}=-z_\alpha $$

Fractiles habituales: $z_{0.90}\approx1.2816$, $z_{0.95}\approx1.6449$, $z_{0.975}\approx1.96$, $z_{0.99}\approx2.3263$. Si el $z$ cae entre dos filas de la tabla se **interpola linealmente**:

$$ \Phi(z)\approx\Phi(z_1)+\frac{\Phi(z_2)-\Phi(z_1)}{z_2-z_1}\,(z-z_1) $$

Interpolar acierta unos cinco decimales; redondear a la fila más cercana, solo dos. Resultados útiles para $Z$: cuartiles $\pm0.6745$, rango intercuartílico $1.349\,\sigma$, probabilidad de outlier de Tukey $\approx0.7\%$ y $E[|Z|]=\sqrt{2/\pi}\approx0.798$.

Mini-receta: (1) identificar $\mu$ y $\sigma$; (2) si piden probabilidad, estandarizar y buscar $\Phi$; si piden un valor, buscar $z_\alpha$ y despejar $x_\alpha$; (3) usar la simetría para los negativos; (4) interpolar si hace falta.

> [!warn] Dibujar antes de despejar
> El docente advierte que $z_{1-\alpha}=-z_\alpha$ se aplica mal con frecuencia cuando se usa de memoria. Conviene dibujar siempre la campana y marcar el área de cada cola antes de despejar un cuantil.

> [!figura] u4-simetria-phi-dos-colas
> Las dos colas de la normal estándar, sombreadas por separado y con su área. Se ve que $\Phi(-z)$ y $1-\Phi(z)$ miden lo mismo, y que la región central vale $2\Phi(z)-1$.

> [!figura] u4-fractil-inverso-densidad-y-sigmoide
> El mismo $\alpha$ leído en las dos direcciones: como área a la izquierda de $z_\alpha$ en la densidad, y como entrada por el eje vertical de la sigmoide $\Phi$ hasta bajar al eje $z$. El punto espejo muestra que $z_{1-\alpha}=-z_\alpha$.

> [!figura] u4-interpolar-vs-redondear-tabla-z
> Ampliación de $\Phi$ entre las filas $z=0.66$ y $z=0.67$. En un tramo de $0.01$ la curva y la cuerda casi se calcan: por eso interpolar acierta cinco decimales y redondear a la fila más cercana, solo dos.

Detalle: [[estandarizacion-y-tabla-normal|Estandarización y uso de la tabla normal (Z)]]

## 10. Distribución Pareto

$X\sim\text{Pareto}(x_0,\alpha)$ modela magnitudes con un **mínimo garantizado** $x_0>0$ y **cola pesada** (ingresos, puntajes, siniestros). $\alpha>0$ es el parámetro de forma: a mayor $\alpha$, cola más liviana.

$$ f_X(x)=\frac{\alpha\,x_0^{\alpha}}{x^{\alpha+1}}\ \ (x>x_0), \qquad P(X>x)=\left(\frac{x_0}{x}\right)^{\alpha}\ \ (x\ge x_0) $$

La cola decae **polinomialmente**, no exponencialmente. Sus momentos existen solo para ciertos $\alpha$:

$$ E[X]=\frac{\alpha\,x_0}{\alpha-1}\ \ (\alpha>1), \qquad V(X)=\frac{x_0^2\,\alpha}{(\alpha-1)^2(\alpha-2)}\ \ (\alpha>2) $$

En general, $E[X^k]=\alpha x_0^k/(\alpha-k)$ si $\alpha>k$, y la integral diverge si $\alpha\le k$. Relación clave: $\ln(X/x_0)$ es exponencial de tasa $\alpha$, es decir, la Pareto es la exponencial en escala logarítmica. La cátedra la usa sobre todo como ejemplo de estimación: con $x_0$ conocido, el estimador de máxima verosimilitud es $\hat\alpha=n/\sum\ln(X_i/x_0)$; con $x_0$ desconocido, $\hat x_0=\min_i X_i$ (parámetro en el soporte: se mira el borde, no se deriva).

Cómo reconocerla: un valor mínimo garantizado con pocos casos muy grandes, o una densidad con forma de potencia $c/x^{\beta}$ sobre $[x_0,\infty)$, donde $\beta=\alpha+1$ y $c=\alpha x_0^{\alpha}$.

> [!warn] Verificar que el momento exista
> Si $0<\alpha\le1$ la Pareto no tiene esperanza finita; si $1<\alpha\le2$ tiene esperanza pero no varianza finita. Antes de usar las fórmulas hay que chequear $\alpha>1$ o $\alpha>2$.

Detalle: [[distribucion-pareto|Distribución Pareto]]

## Cómo aparece en los parciales

- **Densidad con constante $k$** ([[variable-aleatoria-continua|temperatura]], [[funcion-de-densidad|función de densidad]]): hallar $k$ con $\int f_X=1$, luego una probabilidad de intervalo, la FDA por tramos (chequeando que empalme), $E[X]$, $V(X)=E[X^2]-(E[X])^2$ y la mediana o cuartiles con $F_X(x_\alpha)=\alpha$.
- **Densidad simple sin constante** (guía ej. 3): $f_X(x)=2(1-x)$ en $(0,1)$; calcular $E[X]=1/3$, $V(X)=1/18$ y la mediana resolviendo $2m-m^2=1/2$.
- **Uniforme por proporción de largo** (guía ej. 7): instante de llegada al azar; traducir el evento («espera menos de 3 minutos») a un subintervalo y dividir largos.
- **Exponencial con falta de memoria** (guía ej. 10): media dada → $\lambda=1/\mu$; «ya funcionó $x$ horas» → se ignora el pasado.
- **Exponencial combinada con binomial** (guía ej. 10 b y 12): $p=P(X>t)=e^{-\lambda t}$ se usa como probabilidad de éxito de una $\text{Bi}(n,p)$; «al menos uno» se resuelve por complemento, y a veces hay que **despejar $\lambda$** a partir de una probabilidad binomial dada.
- **Sistema en serie** (guía ej. 11 y 12 b): la duración es el mínimo; $P(T>t)=\prod P(X_i>t)$ y, si son exponenciales, $T\sim\text{Expo}(\sum\lambda_i)$.
- **Demostraciones de confiabilidad** (guía ej. 13): tasa de fallas constante si y solo si exponencial, vía $R=-\frac{d}{dt}\ln S$ y $S(0)=1$.
- **Weibull** (guía ej. 14): derivar la FDA para obtener la densidad, despejar la duración garantizada $G_p$ con $e^{-(\lambda G_p)^b}=p$, y una probabilidad condicional usada como $p$ de una binomial cuya esperanza es $np$.
- **Normal directa e inversa** (guía ej. 16, 21 y 27): porcentajes $P(X\le x)$, $P(X>x)$, $P(a<X\le b)$; fractiles para capacidad de tanque o nota mínima del 10 % superior; probabilidades condicionales como $P(X>84\mid X>72)$; tolerancias y despeje del desvío máximo con $2\Phi(0.025/\sigma)-1=0.999$.
- **Cuartiles y outliers en la normal** (guía ej. 15): $Q_{1,3}=\mu\mp0.6745\sigma$, cercas de Tukey en $\pm2.698$ desvíos estandarizados, $P(\text{outlier})\approx0.007$ y $E[|Z|]=\sqrt{2/\pi}$.
- **Pareto y existencia de momentos**: si piden esperanza o varianza, verificar primero $\alpha>1$ o $\alpha>2$ antes de usar la fórmula. La cátedra también la usa como ejemplo de estimación puntual (máxima verosimilitud), tema de unidades posteriores.

> [!warn] Discrepancia: guía ej. 21 a
> En la normal de la rosca ($D\sim N(10.02,0.075)$, especificación $10\pm0.025$), la resolución detallada de la guía obtiene $P(\text{fuera})=0.7464$ leyendo $\Phi(0.066)\approx0.5239$, mientras que la sección de Respuestas del mismo documento da $0.7477$. La diferencia no es de redondeo sino de una resta mal hecha en la resolución: escribe $0.5239-0.2743=0.2536$, cuando la resta da $0.2496$ (y con ese valor saldría $P(\text{fuera})=0.7504$). Además, $0.5239$ es $\Phi(0.06)$; con el valor correcto $\Phi(0.0667)\approx0.5266$ se obtiene $P(E)\approx0.2523$ y $P(\text{fuera})\approx0.7477$, que coincide con la sección de Respuestas. Ver [[distribucion-normal|Distribución Normal]].

## Tabla de fórmulas de la unidad

| Qué | Fórmula | Cuándo se usa |
|---|---|---|
| Caracterización de v.a.c. | $F_X$ continua $\iff P(X=\alpha)=0\ \forall\alpha$ | Decidir si la variable es continua; ignorar los bordes |
| Densidad y FDA | $f_X=F_X'$, $F_X(x)=\int_{-\infty}^x f_X(y)\,dy$ | Pasar de una a la otra |
| Normalización | $\int_{\mathbb{R}} f_X=1$, $f_X\ge0$ | Hallar la constante $k$ |
| Probabilidad de intervalo | $P(a<X\le b)=\int_a^b f_X=F_X(b)-F_X(a)$ | Cualquier probabilidad continua |
| Esperanza | $E[X]=\int x\,f_X(x)\,dx$ | Media de una densidad dada |
| Esperanza de una función | $E[g(X)]=\int g(x)\,f_X(x)\,dx$ | Momentos $E[X^k]$ |
| Varianza | $V(X)=E[X^2]-(E[X])^2$ | Dispersión de una densidad dada |
| Esperanza por la cola | $E[X]=\int_0^\infty P(X>x)\,dx$ | $X\ge0$ con FDA conocida |
| Cuantil | $F_X(x_\alpha)=\alpha$ | Mediana, cuartiles, percentiles |
| Uniforme | $f_X=\frac{1}{b-a}$, $E=\frac{a+b}{2}$, $V=\frac{(b-a)^2}{12}$ | Valor al azar en $(a,b)$ |
| Exponencial | $f_X=\lambda e^{-\lambda x}$, $P(X>x)=e^{-\lambda x}$, $E=\frac1\lambda$, $V=\frac1{\lambda^2}$ | Tiempos de vida o entre sucesos |
| Falta de memoria | $P(X>x+\Delta\mid X>x)=e^{-\lambda\Delta}$ | Exponencial que «ya duró» $x$ |
| Mínimo de exponenciales | $\min X_i\sim\text{Expo}(\sum\lambda_i)$ | Sistemas en serie |
| Tasa de fallas | $R(t)=\frac{f_T(t)}{1-F_T(t)}$, $S(t)=e^{-\int_0^t R}$ | Confiabilidad, envejecimiento |
| Weibull | $F_X=1-e^{-(\lambda x)^b}$, $R=\lambda b(\lambda x)^{b-1}$ | Tasa de fallas no constante: desgaste si $b>1$, mortalidad infantil si $b<1$ |
| Normal | $f_X=\frac{1}{\sqrt{2\pi}\sigma}e^{-\frac{(x-\mu)^2}{2\sigma^2}}$, $E=\mu$, $V=\sigma^2$ | Mediciones, errores, notas |
| Transformación lineal | $aX+b\sim N(a\mu+b,\ \lvert a\rvert\sigma)$ | Cambios de unidad de una normal |
| Estandarización | $F_X(x)=\Phi\big(\frac{x-\mu}{\sigma}\big)$ | Toda probabilidad normal |
| Simetría de $\Phi$ | $\Phi(-z)=1-\Phi(z)$, $z_{1-\alpha}=-z_\alpha$ | Tablas con $z\ge0$ |
| Fractil | $x_\alpha=\mu+\sigma z_\alpha$ | Problema inverso (valor dada la probabilidad) |
| Intervalo centrado | $P(\lvert X-\mu\rvert<k\sigma)=2\Phi(k)-1$ | Tolerancias simétricas, regla 68–95–99.7 |
| Pareto | $P(X>x)=(x_0/x)^\alpha$, $E=\frac{\alpha x_0}{\alpha-1}$ ($\alpha>1$) | Mínimo garantizado y cola pesada |

Hoja completa: [[formulario-va-continuas|Formulario — Variables Aleatorias Continuas]]
