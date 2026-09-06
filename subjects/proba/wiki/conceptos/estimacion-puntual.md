---
titulo: Estimación Puntual
resumen: 'Dar un único valor para un parámetro mediante un estimador $\hat\theta=h(X_1,\dots,X_n)$. Su calidad se mide con $\mathrm{mse}(\hat\theta)=V(\hat\theta)+\mathrm{sesgo}^2(\hat\theta)$; se construye por máxima verosimilitud, MAP o momentos.'
tipo: concepto
unidad: 8
orden: 2
tags: [inferencia, estimacion, estimador]
fuentes: ["[[teorica-estimacion-puntual-intro]]", "[[teorica-estimacion-puntual-conocidos]]", "[[teorica-maxima-verosimilitud]]", "[[teorica-maximo-a-posteriori]]", "[[teorica-metodo-de-los-momentos]]", "[[tp8-estimacion-de-parametros]]", "[[video-metodos-de-estimacion]]", "[[video-poblacion-y-muestra]]"]
actualizado: 2026-09-04
---

# Estimación Puntual

**En breve.** Construir y evaluar un estimador $\hat\theta=h(X_1,\dots,X_n)$ que
devuelve un solo número para aproximar un parámetro $\theta$. Sirve para medir
qué tan bueno es un estimador (sesgo, varianza, ECM) y para construirlos por
máxima verosimilitud, MAP o el método de los momentos.

**Qué es:** dar **un único valor** como aproximación de un parámetro poblacional
desconocido $\theta$, a partir de un **estimador** $\hat\theta=h(X_1,\dots,X_n)$
calculado sobre la muestra. Es una de las dos ramas de la
[[inferencia-estadistica]] (la otra son los [[intervalos-de-confianza]]).

## Calidad de un estimador

Como $\hat\theta$ es una variable aleatoria, queremos que esté "cerca" de
$\theta$. Eso se mide con el **error cuadrático medio (ECM / MSE)**, según
[[teorica-estimacion-puntual-intro]]:

$$\mathrm{mse}(\hat\theta) = E\!\left[(\hat\theta-\theta)^2\right].$$

Sumando y restando $E[\hat\theta]$ adentro del cuadrado, el término cruzado se
anula y queda la descomposición fundamental **sesgo–varianza**:

$$\boxed{\;\mathrm{mse}(\hat\theta) = V(\hat\theta) + \mathrm{sesgo}^2(\hat\theta)\;}
\qquad \mathrm{sesgo}(\hat\theta) = E[\hat\theta]-\theta.$$

> [!figura] u8-descomposicion-sesgo-varianza
> Arriba, la distribución de $\hat\theta$ con su sesgo y su desvío señalados; abajo, la barra que descompone $\mathrm{mse}=V(\hat\theta)+\mathrm{sesgo}^2(\hat\theta)$. Cada barra viene partida en dos tramos: el **tramo liso**, del color del estimador, mide la varianza $V(\hat\theta)$, y el **tramo rayado** mide el $\mathrm{sesgo}^2$; el rótulo de la barra da el total y las lecturas de la derecha lo repiten con más cifras. Compare los dos estimadores: uno insesgado y disperso puede tener más ECM que uno sesgado y concentrado.

- **Estimador insesgado:** $\mathrm{sesgo}(\hat\theta)=0 \iff E[\hat\theta]=\theta$.
  En promedio da en el blanco.
- **Asintóticamente insesgado:** $\lim_{n\to\infty} E[\hat\theta]-\theta=0$.
- **Estimador consistente:** $\lim_{n\to\infty}\mathrm{mse}(\hat\theta)=0$
  (equivalentemente $\hat\theta\to\theta$ cuando $n\to\infty$). El estimador
  "ideal" es el **insesgado de mínima varianza**.

> **Intuición (analogía del tirador).** Piense en disparos a una diana. El
> **sesgo** es qué tan corrido del centro está el grupo de impactos en promedio
> (¿la mira está calibrada?); la **varianza** es qué tan disperso está el grupo
> (¿el pulso es firme?). El ECM castiga ambas cosas a la vez: un estimador bueno
> apunta al centro *y* agrupa fino. La consistencia dice que, al disparar muchas
> veces (más datos), el grupo se cierra sobre el centro. La consistencia se apoya
> en la [[ley-de-grandes-numeros]].

## Estimadores puntuales clásicos

Según [[teorica-estimacion-puntual-conocidos]], con $X_i$ i.i.d., $\mu=E[X_i]$,
$\sigma^2=V(X_i)$:

| Parámetro | Estimador | Insesgado | ECM | Distribución (aprox.) |
|---|---|---|---|---|
| Media $\mu$ | $\overline X_n=\frac1n\sum X_i$ | sí | $\sigma^2/n$ | $\mathcal N(\mu,\sigma/\sqrt n)$ |
| Proporción $p$ | $\hat p=\frac1n\sum X_i$ ($X_i\sim$ Ber$(p)$) | sí | $p(1-p)/n$ | $\mathcal N(p,\sqrt{p(1-p)/n})$ |
| Varianza $\sigma^2$ | $S_n^2=\frac{1}{n-1}\sum(X_i-\overline X_n)^2$ | sí | (ver [[varianza-muestral]]) | $\to$ normal (TCL) |

> **La proporción como caso especial.** A diferencia de la media (donde $\mu$ y
> $\sigma$ son dos incógnitas separadas que hay que estimar y analizar por
> separado), en la proporción el desvío de $\hat p$ depende del mismo parámetro
> que se quiere estimar ($\sqrt{p(1-p)/n}$): no hay un "sigma" adicional que
> estimar aparte, todo el análisis se reduce a una sola incógnita, $p$ (según
> [[video-poblacion-y-muestra]]).

Las dos aproximaciones normales son consecuencia del
[[teorema-central-del-limite]] y son la base de los [[intervalos-de-confianza]].
El factor $n-1$ en $S_n^2$ es justo lo que lo hace insesgado (ver
[[varianza-muestral]] para la demostración).

## ¿De dónde salen los estimadores?

[[teorica-maxima-verosimilitud]] lista cuatro métodos: **máxima verosimilitud**,
**máximo a posteriori**, **método de los momentos** y **cuadrados mínimos**.

### Máxima verosimilitud (MV)

La **verosimilitud** es la densidad conjunta vista como función del parámetro,
$f(x_1,\dots,x_n;\theta)$. El estimador de MV es el valor de $\theta$ que la
maximiza:

$$\hat\theta = \arg\max_\theta f(x_1,\dots,x_n;\theta).$$

Con muestra i.i.d., $f=\prod_i f(x_i;\theta)$, y conviene maximizar la
**log-verosimilitud** $\ln f=\sum_i\ln f(x_i;\theta)$ (el logaritmo es creciente,
así que tiene el mismo máximo y convierte el producto en suma).
Los estimadores de MV son asintóticamente consistentes.

> [!figura] u8-verosimilitud-borde-vs-interior
> Dos verosimilitudes sobre la misma muestra observada, cada una reescalada a su propio máximo. En el panel del medio, $L(\alpha)=(2\alpha)^{-n}\exp\!\left(-\sum_i |x_i|/\alpha\right)$: la de la Laplace tiene un máximo **interior**, al que se llega derivando, y por eso la curva llega a la cumbre con tangente horizontal. En el panel de abajo, $L(\alpha)=(\alpha-3)^{-n}$ si $\alpha\ge\max_i x_i$ y $0$ si no (o $L(\alpha)=(8-\alpha)^{-n}$ si $\alpha\le\min_i x_i$, según el modelo elegido): la Uniforme tiene su máximo **en el borde**, en el salto $\alpha=\max_i x_i$, donde la derivada ni siquiera existe. Arrastre el dato más grande y vea al estimador seguirlo.

> [!figura] u8-superficie-log-verosimilitud-normal
> La log-verosimilitud $\ln L(\mu,\sigma)$ de una muestra normal como superficie: el desarrollo de clase (derivar respecto de $\mu$ con $\sigma$ fijo) es el corte dibujado en el panel de abajo, cuyo vértice cae en $\overline X_n$. Al crecer $n$ la cumbre se agudiza, y esa curvatura es lo que vuelve preciso al estimador.

> **Atención — no siempre se maximiza derivando.** Cuando el parámetro está en el
> **soporte** de la densidad (uniformes, por ejemplo), la verosimilitud no tiene
> un máximo interior: hay que maximizar **mirando el soporte**, no igualando la
> derivada a cero. Ver el ejercicio resuelto de las uniformes más abajo.

> **Extensión a dos parámetros con borde.** La misma lógica se generaliza cuando
> hay dos parámetros y uno de ellos define el soporte: para una
> [[distribucion-pareto|Pareto]] con $x_0$ y $\alpha$ ambos desconocidos, la
> verosimilitud no es continua en $x_0$ (no se puede derivar respecto de $x_0$),
> pero para cualquier $\alpha$ fijo la verosimilitud crece a medida que $x_0$ se
> acerca al mínimo muestral por abajo y se anula apenas lo supera. Por eso
> conviene fijar $\hat x_0=\min_i X_i$ primero (el mayor valor posible dentro del
> soporte válido) y solo entonces derivar respecto de $\alpha$ (ver
> [[video-metodos-de-estimacion]], 38:23–46:16, con el ejercicio resuelto
> completo).

### Máximo a posteriori (MAP)

Enfoque **bayesiano** ([[teorica-maximo-a-posteriori]]): se trata a $\theta$ como
v.a. con una densidad **a priori** $g(\theta)$ que codifica información previa.
Por el [[probabilidad-total-y-bayes|teorema de Bayes]] la densidad **a posteriori** es

$$g(\theta\mid x_1,\dots,x_n) = \frac{f(x_1,\dots,x_n\mid\theta)\,g(\theta)}{\int f(x_1,\dots,x_n\mid\zeta)\,g(\zeta)\,d\zeta},$$

y el estimador MAP la maximiza: $\hat\theta=\arg\max_\theta g(\theta\mid x_1,\dots,x_n)$.
Como el denominador no depende de $\theta$, basta maximizar el numerador.

> **Ejemplo (media de una normal con prior normal):** Si
> $X_i\sim\mathcal N(\mu,\sigma)$ y $\mu\sim\mathcal N(\mu_p,\sigma_p)$, el MAP da
> un **promedio ponderado** entre los datos y el prior:
> $$\hat\mu = \frac{n\sigma_p^2}{n\sigma_p^2+\sigma^2}\,\overline X_n + \frac{\sigma^2}{n\sigma_p^2+\sigma^2}\,\mu_p.$$
> Para $n$ chico manda el prior ($\hat\mu\approx\mu_p$); para $n$ grande mandan
> los datos ($\hat\mu\approx\overline X_n$).

> [!figura] u8-map-prior-verosimilitud-posterior
> El prior, la verosimilitud y la posterior sobre el mismo eje $\mu$, con la barra de los dos pesos del promedio ponderado. Suba $n$ y vea a la posterior migrar desde $\mu_p$ hacia $\overline X_n$; con un prior poco informativo ($\sigma_p$ grande) el MAP colapsa sobre el estimador de máxima verosimilitud.

El prior **no tiene por qué ser normal**. El [[tp8-estimacion-de-parametros]]
(ej. 5) plantea el MAP de una **Bernoulli con prior Beta** (ver el segundo
ejercicio resuelto), un caso muy típico de parcial.

### Método de los momentos

Según [[teorica-metodo-de-los-momentos]]: se escribe el $k$-ésimo momento
poblacional como función del parámetro, $\mu_k=E[X_i^k]=H(\theta)$, se estima por
el momento muestral $\hat\mu_k$ y se despeja $\hat\theta=H^{-1}(\hat\mu_k)$. Si
hay varios parámetros, se usan varios momentos.

> **Ejemplo ([[distribucion-exponencial|exponencial]]):** $X_i\sim\mathrm{Exp}(\lambda)$.
> Como $\mu=E[X_i]=1/\lambda$, se estima $\hat\mu=\overline X_n$ y se despeja
> $\hat\lambda = 1/\overline X_n$.

> **Ejemplo (muestreo inverso, [[distribucion-geometrica|geométrica]]):** Cuando
> el tamaño de la muestra no está fijado de antemano —por ejemplo, entrevistar
> personas hasta encontrar la primera que aprueba, día tras otro— cada $X_i$
> (personas entrevistadas el día $i$) es $\mathrm{Ge}(p)$ i.i.d. y $E[X_i]=1/p$.
> Igualando al promedio muestral, $\overline X_n\approx 1/p \Rightarrow
> \hat p_M=\dfrac{n}{\sum_{i=1}^n X_i}$. El método funciona igual aunque el
> tamaño de cada "experimento" (cantidad de entrevistas por día) sea aleatorio,
> siempre que la cantidad de repeticiones $n$ esté fija (ver
> [[video-metodos-de-estimacion]], 02:40–08:00).

## Cómo reconocer cuál usar

- **MV** — cuando se conoce la familia de la distribución y se quiere el
  estimador "estándar". Suele coincidir con los estimadores clásicos
  (p. ej. $\overline X_n$ para la media de una normal).
- **MAP** — cuando hay información previa creíble sobre el parámetro (prior).
- **Momentos** — cuando despejar el parámetro de un momento es fácil
  (típico con exponencial, uniforme).

> ⚠️ **Advertencia práctica.** El estimador de momentos puede dar un valor
> **incompatible con los propios datos observados**: para una
> [[distribucion-pareto|Pareto]] con mínimo $x_0$ desconocido, el estimador de
> momentos de $x_0$ puede resultar *mayor* que el mínimo efectivamente observado
> en la muestra, algo imposible porque $x_0$ tiene que ser menor o igual a todos
> los datos. La máxima verosimilitud no tiene este problema porque busca el
> máximo directamente sobre el soporte válido (ver
> [[video-metodos-de-estimacion]], 50:31–52:03).

## Ejercicio resuelto

**Enunciado** ([[teorica-maxima-verosimilitud]], reproducido también en el repaso
del [[tp8-estimacion-de-parametros]]): sean $X_i\sim\mathcal N(\mu,\sigma)$
i.i.d. con $\sigma$ conocido. Hallar el estimador de **máxima verosimilitud** de
$\mu$.

**Planteo.** La densidad de cada $X_i$ es
$f(x_i;\mu)=\frac{1}{\sqrt{2\pi}\,\sigma}\exp\!\left(-\frac{(x_i-\mu)^2}{2\sigma^2}\right)$.
La log-verosimilitud de la muestra es
$$\mathcal L(\mu)=\ln\prod_{i=1}^n f(x_i;\mu)=\sum_{i=1}^n\ln\frac{1}{\sqrt{2\pi\sigma^2}}-\sum_{i=1}^n\frac{(x_i-\mu)^2}{2\sigma^2}.$$

**Cálculo.** Derivando respecto de $\mu$ e igualando a cero:
$$\frac{\partial\mathcal L}{\partial\mu}=\sum_{i=1}^n\frac{x_i-\mu}{\sigma^2}=\frac{1}{\sigma^2}\left(\sum_{i=1}^n x_i - n\mu\right)=0 \;\Rightarrow\; \hat\mu=\frac1n\sum_{i=1}^n x_i.$$
La derivada segunda es $\frac{\partial^2\mathcal L}{\partial\mu^2}=-\frac{n}{\sigma^2}<0$,
así que efectivamente es un máximo.

**Resultado.** El estimador de MV de $\mu$ es la **media muestral**
$\boxed{\hat\mu=\overline X_n=\frac1n\sum X_i}$. Coincide con el estimador clásico
de la media: es insesgado y consistente.

## Ejercicio resuelto 2 — EMV de la Laplace y de la Uniforme

**Enunciado** ([[tp8-estimacion-de-parametros]], ej. 1): hallar el estimador de
máxima verosimilitud de $\alpha$ con $X_i$ i.i.d. para
(a) $X\sim\text{Laplace}(0,\alpha)$, $f_X(x)=\frac{1}{2\alpha}e^{-|x|/\alpha}$;
(b) $X\sim\text{Uniforme}(3,\alpha)$; (c) $X\sim\text{Uniforme}(\alpha,2)$.

**(a) Laplace — derivando.** La log-verosimilitud es
$$\mathcal L(\alpha)=\sum_{i=1}^n\left[-\ln(2\alpha)-\frac{|x_i|}{\alpha}\right]
=-n\ln 2 - n\ln\alpha - \frac{1}{\alpha}\sum_{i=1}^n|x_i|.$$
Derivando e igualando a cero:
$$\frac{d\mathcal L}{d\alpha}=-\frac{n}{\alpha}+\frac{1}{\alpha^2}\sum_{i=1}^n|x_i|=0
\;\Rightarrow\; \boxed{\hat\alpha=\frac1n\sum_{i=1}^n |x_i|}.$$

**(b) Uniforme$(3,\alpha)$ — por soporte.** La densidad es
$f(x)=\frac{1}{\alpha-3}$ para $3<x<\alpha$. La verosimilitud
$L(\alpha)=(\alpha-3)^{-n}$ **solo** vale si **todos** los datos cumplen
$x_i\le\alpha$ (si algún $x_i>\alpha$ la densidad es 0 y $L=0$). Entre los
$\alpha$ admisibles, $L=(\alpha-3)^{-n}$ es **decreciente** en $\alpha$, así que
se maximiza tomando el menor $\alpha$ posible: el más chico que sigue conteniendo
a todos los datos. Resultado: $\boxed{\hat\alpha=\max_i x_i = x_{(n)}}$.

**(c) Uniforme$(\alpha,2)$ — por soporte.** Ahora $f(x)=\frac{1}{2-\alpha}$ para
$\alpha<x<2$ y $L(\alpha)=(2-\alpha)^{-n}$, válida si $\alpha\le x_i$ para todos.
$L$ es **creciente** en $\alpha$, así que conviene el mayor $\alpha$ admisible:
$\boxed{\hat\alpha=\min_i x_i = x_{(1)}}$.

> **Lección.** En (a) el parámetro es de escala y el máximo es interior (se
> deriva). En (b) y (c) el parámetro define el **borde del soporte**: la
> verosimilitud es monótona y el máximo está en el **extremo de la muestra**, no
> donde se anula la derivada.

**Contraste con momentos** (ej. 2). Por el [[teorica-metodo-de-los-momentos|método de los momentos]],
para la Uniforme$(3,\alpha)$ se iguala $E[X]=\frac{3+\alpha}{2}=\overline X_n$, de
donde $\hat\alpha=2\overline X_n-3$: un estimador **distinto** del de MV
($x_{(n)}$), que puede incluso quedar por debajo de algún dato observado.

## Ejercicio resuelto 3 — MAP de una Bernoulli con prior Beta

**Enunciado** ([[tp8-estimacion-de-parametros]], ej. 5): sean $X_i\sim$
[[distribucion-bernoulli|Bernoulli]]$(P)$ i.i.d. con prior $P\sim\text{Beta}(\alpha,\beta)$,
$f_P(p)=\frac{\Gamma(\alpha+\beta)}{\Gamma(\alpha)\Gamma(\beta)}p^{\alpha-1}(1-p)^{\beta-1}$
para $p\in(0,1)$, $\alpha,\beta>0$. Hallar el estimador MAP de $P$.

**Planteo.** Con $s=\sum_{i=1}^n x_i$ (número de éxitos), la verosimilitud es
$f(x\mid p)=p^{s}(1-p)^{n-s}$. La posterior es proporcional al producto
verosimilitud $\times$ prior:
$$g(p\mid x)\;\propto\; p^{s}(1-p)^{n-s}\cdot p^{\alpha-1}(1-p)^{\beta-1}
= p^{\,s+\alpha-1}(1-p)^{\,n-s+\beta-1}.$$

**Cálculo.** Tomando logaritmo (la constante de normalización no depende de $p$):
$$Q(p)=(s+\alpha-1)\ln p + (n-s+\beta-1)\ln(1-p).$$
Derivando e igualando a cero:
$$Q'(p)=\frac{s+\alpha-1}{p}-\frac{n-s+\beta-1}{1-p}=0
\;\Rightarrow\; (s+\alpha-1)(1-p)=(n-s+\beta-1)\,p,$$
y despejando $p$:
$$\boxed{\hat p_{\text{MAP}}=\frac{s+\alpha-1}{n+\alpha+\beta-2}
=\frac{\sum_i x_i+\alpha-1}{n+\alpha+\beta-2}.}$$

**Resultado.** El prior Beta agrega $\alpha-1$ "éxitos" y $\beta-1$ "fracasos"
virtuales. Con prior uniforme ($\alpha=\beta=1$) se recupera el estimador de MV
$\hat p=s/n$; para $n$ grande el prior pierde peso y $\hat p_{\text{MAP}}\to s/n$.
La conjugación Beta–Bernoulli hace que la posterior siga siendo una Beta.

## Ejercicio resuelto 4 — Estimador insesgado de mínima varianza

**Enunciado** ([[tp8-estimacion-de-parametros]], ej. 6): sea $X$ con media $\mu$ y
varianza $\sigma^2$. Se toman dos muestras independientes de tamaños $n_1$ y
$n_2$, con medias muestrales $\overline X_1$ y $\overline X_2$, y se define
$Y=a\overline X_1+b\overline X_2$ con $0<a<1$.
(a) Determinar $b$ en función de $a$ para que $Y$ sea **insesgado** de $\mu$.
(b) Con $n_2=2n_1$, hallar el $a$ que **minimiza** $V(Y)$.
(c) Si $n_1=n_2=n$ y $b=1-a$, probar que $V(Y)<V(\overline X_1)$ y que el mínimo
es $\sigma^2/2n$ en $a=\tfrac12$.

**(a) Insesgadez.** Como $E[\overline X_1]=E[\overline X_2]=\mu$,
$$E[Y]=(a+b)\mu \stackrel{!}{=}\mu \;\Rightarrow\; \boxed{b=1-a}.$$

**(b) Mínima varianza con $n_2=2n_1$.** Por independencia,
$V(Y)=a^2\frac{\sigma^2}{n_1}+(1-a)^2\frac{\sigma^2}{n_2}
=\frac{\sigma^2}{n_1}\left(a^2+\frac{(1-a)^2}{2}\right)$.
Derivando respecto de $a$ e igualando a cero:
$$\frac{d}{da}\!\left(a^2+\tfrac{(1-a)^2}{2}\right)=2a-(1-a)=3a-1=0
\;\Rightarrow\; \boxed{a=\tfrac13},\quad b=\tfrac23.$$
(La muestra más grande, $n_2=2n_1$, recibe el doble de peso — coherente.)

**(c) Caso $n_1=n_2=n$.** Ahora
$V(Y)=\frac{\sigma^2}{n}\!\left(a^2+(1-a)^2\right)$. Como $a^2+(1-a)^2<1$ para
$a\in(0,1)$, resulta $V(Y)<\frac{\sigma^2}{n}=V(\overline X_1)$. Minimizando:
$\frac{d}{da}(a^2+(1-a)^2)=2a-2(1-a)=4a-2=0\Rightarrow a=\tfrac12$, que da
$$V(Y)_{\min}=\frac{\sigma^2}{n}\cdot\frac12=\boxed{\frac{\sigma^2}{2n}}.$$

**Resultado.** Promediar las dos muestras con pesos proporcionales a sus tamaños
(equivalentemente, $a=1/2$ cuando $n_1=n_2$) da el **estimador insesgado de
mínima varianza** dentro de esta familia: combinar información reduce la varianza.

## Páginas relacionadas
- [[inferencia-estadistica]] — el marco general de la unidad.
- [[intervalos-de-confianza]] — la otra rama de la inferencia.
- [[varianza-muestral]] — la insesgadez de $S_n^2$ y su vínculo con la [[distribucion-ji-cuadrado]].
- [[formulario-inferencia]] — todas las fórmulas y el árbol de decisión juntos.
