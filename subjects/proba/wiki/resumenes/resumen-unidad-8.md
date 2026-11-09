---
titulo: "Resumen de la Unidad 8 — Inferencia Estadística"
tipo: resumen
unidad: 8
orden: 1
hub: true
tags: [resumen, inferencia, estimacion, intervalo-de-confianza]
resumen: "Con una muestra i.i.d. se estima un parámetro desconocido: con un solo valor (estimador, medido por $\mathrm{mse}=V+\mathrm{sesgo}^2$ y construido por MV, MAP o momentos) o con un intervalo de confianza $\gamma$ que usa $z$, $t_{n-1}$ o ji-cuadrado según el caso."
fuentes: ["[[inferencia-estadistica]]", "[[estimacion-puntual]]", "[[varianza-muestral]]", "[[distribucion-ji-cuadrado]]", "[[distribucion-t-de-student]]", "[[intervalos-de-confianza]]", "[[formulario-inferencia]]"]
actualizado: 2026-11-09
---

# Resumen de la Unidad 8 — Inferencia Estadística

La unidad 7 mostró que el promedio de $n$ variables i.i.d. tiene media $\mu$, varianza $\sigma^2/n$ y, por el [[teorema-central-del-limite|Teorema Central del Límite]], distribución aproximadamente normal. La unidad 8 invierte la pregunta: ahora $\mu$, $\sigma^2$ o $p$ son **desconocidos** y se quiere decir algo sobre ellos a partir de una **muestra**. Hay dos respuestas posibles: dar **un único valor** (estimación puntual) o dar **un rango** que contiene al parámetro con una confianza fijada (intervalo de confianza). Para lo segundo entran en juego dos distribuciones: la **ji-cuadrado**, que ya apareció en las unidades 5 y 7 (cuadrado de una normal estándar, caso de la Gamma) y aquí pasa a ser la ley de la varianza muestral, y la **t de Student**, que es nueva; ambas describen qué pasa cuando además de la media se estima la varianza. La unidad 9 agrega la tercera rama de la inferencia, las pruebas de hipótesis, que es dual de los intervalos de confianza.

> [!info] Lo esencial
> - Un **estimador** $\hat\theta=h(X_1,\dots,X_n)$ es una variable aleatoria; la **estimación** es el número que toma con los datos observados.
> - La calidad de un estimador se mide con el ECM: $\mathrm{mse}(\hat\theta)=V(\hat\theta)+\mathrm{sesgo}^2(\hat\theta)$.
> - Los estimadores se construyen por **máxima verosimilitud**, **máximo a posteriori** o **método de los momentos**.
> - La **varianza muestral** divide por $n-1$ para ser insesgada, y con datos normales $(n-1)S_n^2/\sigma^2\sim\chi^2_{n-1}$.
> - Un IC para la media o la proporción es $\text{estimador}\pm\text{fractil}\times\text{desvío del estimador}$: fractil $z$ si $\sigma$ es conocido (datos normales o $n$ grande) o se trata de una proporción; $t_{n-1}$ si los datos son normales y $\sigma$ se estima con $S_n$; $z$ con $S_n$ si $n$ es muy grande. El IC de la varianza no tiene esa forma: es un cociente asimétrico con dos cuantiles de la ji-cuadrado.
> - La confianza $\gamma$ es una propiedad de la **fórmula** antes de muestrear, no del intervalo ya calculado.

> [!nota] Notación del wiki
> En este resumen, $\mathcal N(\mu,\sigma)$ lleva como segundo parámetro el **desvío** (la página de la ji-cuadrado escribe $\mathcal N(\mu,\sigma^2)$). $z_p=\Phi^{-1}(p)$ es el fractil de la normal estándar, $t_{m,p}$ el de la t con $m$ grados de libertad y $\chi^2_{k;p}$ el cuantil de cola izquierda de la ji-cuadrado: $P(\chi^2_k\le\chi^2_{k;p})=p$. La varianza se escribe $V(X)$ o $\sigma^2$; el nivel de confianza es $\gamma$ y el de significación $\alpha=1-\gamma$.

## 1. Población, muestra y estimador

La **inferencia estadística** usa una muestra observada para sacar conclusiones sobre un **parámetro poblacional** $\theta$ (la media $\mu$, la varianza $\sigma^2$, una proporción $p$). El parámetro es **fijo pero desconocido**: no es una variable aleatoria (salvo en el enfoque bayesiano del MAP). La muestra $X_1,\dots,X_n$ se piensa como variables **i.i.d.** con la distribución poblacional, de modo que cualquier función de ella es también una variable aleatoria.

- **Estadístico:** cualquier función $g(X_1,\dots,X_n)$ de la muestra.
- **Estimador:** un estadístico $\hat\theta=h(X_1,\dots,X_n)$ usado para aproximar $\theta$. Es una v.a. (mayúsculas).
- **Estimación:** el valor concreto $\hat\theta(x_1,\dots,x_n)$ con los datos observados. Es un número (minúsculas).

$$ \text{Población} \;\longrightarrow\; \text{muestra } \{X_i\}_{i=1}^n \;\longrightarrow\; \text{estimador } \hat\theta \;\longrightarrow\; \theta $$

Es el esquema de la unidad. Las cantidades de la estadística descriptiva pasan a ser estimadores: $\overline X_n$ estima $\mu$, $S_n^2$ estima $\sigma^2$ y $\hat p$ estima $p$.

**Cómo reconocerlo:** si el ejercicio pide «la estimación», se evalúa el estimador en los datos. Por ejemplo, con $x_1=2$, $x_2=4$ y $\hat\mu=\frac12(X_1+X_2)$, la estimación es $\hat\mu(2,4)=3$.

> [!warn] Pre-muestra y post-muestra
> Antes de observar la muestra, $\overline X_n$ es una v.a.; después, $\overline x_n$ es un número. Confundirlos lleva a errores graves al interpretar un intervalo de confianza.

Detalle: [[inferencia-estadistica|Inferencia Estadística]]

## 2. Calidad de un estimador: sesgo, varianza y ECM

Como $\hat\theta$ es aleatorio, se quiere que esté «cerca» de $\theta$ en promedio. La medida es el **error cuadrático medio (ECM)**, que se descompone en la varianza del estimador más su sesgo al cuadrado (sumando y restando $E[\hat\theta]$, el término cruzado se anula).

$$ \mathrm{mse}(\hat\theta)=E\big[(\hat\theta-\theta)^2\big]=V(\hat\theta)+\mathrm{sesgo}^2(\hat\theta) $$

Con $\mathrm{sesgo}(\hat\theta)=E[\hat\theta]-\theta$. La varianza mide la dispersión del estimador; el sesgo, cuánto se corre del blanco en promedio.

- **Insesgado:** $E[\hat\theta]=\theta$.
- **Asintóticamente insesgado:** $\lim_{n\to\infty}E[\hat\theta]-\theta=0$.
- **Consistente:** $\lim_{n\to\infty}\mathrm{mse}(\hat\theta)=0$; se apoya en la [[ley-de-grandes-numeros|Ley de los Grandes Números]].
- El estimador ideal es el **insesgado de mínima varianza**. Un estimador insesgado pero disperso puede tener más ECM que uno sesgado y concentrado.

**Cómo reconocerlo:** el enunciado pide «elegir $b$ para que sea insesgado» (se impone $E[\hat\theta]=\theta$) o «el $a$ que minimiza la varianza» (se escribe $V(\hat\theta)$ en función de $a$ y se deriva). Con dos muestras independientes y $Y=a\overline X_1+b\overline X_2$, la insesgadez da $b=1-a$; con $n_1=n_2=n$ el mínimo es $a=\tfrac12$ y $V(Y)=\sigma^2/2n$.

> [!figura] u8-descomposicion-sesgo-varianza
> Arriba, la distribución de $\hat\theta$ con su sesgo y su desvío señalados; abajo, la barra que descompone $\mathrm{mse}=V(\hat\theta)+\mathrm{sesgo}^2(\hat\theta)$. Cada barra viene partida en dos tramos: el **tramo liso**, del color del estimador, mide la varianza $V(\hat\theta)$, y el **tramo rayado** mide el $\mathrm{sesgo}^2$; el rótulo de la barra da el total y las lecturas de la derecha lo repiten con más cifras. Compare los dos estimadores: uno insesgado y disperso puede tener más ECM que uno sesgado y concentrado.

> [!figura] u8-verosimilitud-borde-vs-interior
> Dos verosimilitudes sobre la misma muestra observada, cada una reescalada a su propio máximo. En el panel del medio, $L(\alpha)=(2\alpha)^{-n}\exp\!\left(-\sum_i |x_i|/\alpha\right)$: la de la Laplace tiene un máximo **interior**, al que se llega derivando, y por eso la curva llega a la cumbre con tangente horizontal. En el panel de abajo, $L(\alpha)=(\alpha-3)^{-n}$ si $\alpha\ge\max_i x_i$ y $0$ si no (o $L(\alpha)=(8-\alpha)^{-n}$ si $\alpha\le\min_i x_i$, según el modelo elegido): la Uniforme tiene su máximo **en el borde**, en el salto $\alpha=\max_i x_i$, donde la derivada ni siquiera existe. Arrastre el dato más grande y vea al estimador seguirlo.

> [!figura] u8-superficie-log-verosimilitud-normal
> La log-verosimilitud $\ln L(\mu,\sigma)$ de una muestra normal como superficie: el desarrollo de clase (derivar respecto de $\mu$ con $\sigma$ fijo) es el corte dibujado en el panel de abajo, cuyo vértice cae en $\overline X_n$. Al crecer $n$ la cumbre se agudiza, y esa curvatura es lo que vuelve preciso al estimador.

> [!figura] u8-map-prior-verosimilitud-posterior
> El prior, la verosimilitud y la posterior sobre el mismo eje $\mu$, con la barra de los dos pesos del promedio ponderado. Suba $n$ y vea a la posterior migrar desde $\mu_p$ hacia $\overline X_n$; con un prior poco informativo ($\sigma_p$ grande) el MAP colapsa sobre el estimador de máxima verosimilitud.

Detalle: [[estimacion-puntual|Estimación Puntual]]

## 3. Estimadores clásicos

Con $X_i$ i.i.d., $\mu=E[X_i]$ y $\sigma^2=V(X_i)$, los tres estimadores de uso diario son insesgados:

| Parámetro | Estimador | ECM | Distribución (aprox.) |
|---|---|---|---|
| Media $\mu$ | $\overline X_n=\frac1n\sum X_i$ | $\sigma^2/n$ | $\mathcal N(\mu,\sigma/\sqrt n)$ |
| Proporción $p$ | $\hat p=\frac1n\sum X_i$, $X_i\sim\mathrm{Ber}(p)$ | $p(1-p)/n$ | $\mathcal N\big(p,\sqrt{p(1-p)/n}\big)$ |
| Varianza $\sigma^2$ | $S_n^2=\frac{1}{n-1}\sum(X_i-\overline X_n)^2$ | $\frac{\sigma^4}{n}\big(\kappa+2+\frac{2}{n-1}\big)$ | $\to$ normal (TCL); con datos normales, exacta: $\frac{(n-1)S_n^2}{\sigma^2}\sim\chi^2_{n-1}$ |

$$ \overline X_n\approx\mathcal N\!\left(\mu,\frac{\sigma}{\sqrt n}\right),\qquad \hat p\approx\mathcal N\!\left(p,\sqrt{\frac{p(1-p)}{n}}\right) $$

Las dos aproximaciones normales salen del TCL y son la base de los intervalos de confianza. En la proporción el desvío depende del **mismo** $p$ que se estima: no hay un $\sigma$ aparte que estimar. En la tabla, $\kappa$ es el exceso de curtosis de la población ($\kappa=0$ en la normal).

Detalle: [[estimacion-puntual|Estimación Puntual]] y [[promedio-muestral|Promedio Muestral]]

## 4. Cómo se construyen los estimadores: MV, MAP y momentos

**Máxima verosimilitud (MV).** La **verosimilitud** es la densidad conjunta de la muestra vista como función de $\theta$; el estimador es el $\theta$ que la maximiza. Con muestra i.i.d. conviene maximizar la **log-verosimilitud**, que convierte el producto en suma y tiene el mismo máximo.

$$ \hat\theta=\arg\max_\theta \prod_{i=1}^n f(x_i;\theta),\qquad \mathcal L(\theta)=\sum_{i=1}^n \ln f(x_i;\theta) $$

Se deriva $\mathcal L$, se iguala a cero y se verifica que la derivada segunda sea negativa. Para la normal con $\sigma$ conocido da $\hat\mu=\overline X_n$; para la Laplace$(0,\alpha)$, $\hat\alpha=\frac1n\sum|x_i|$.

> [!warn] Cuando el parámetro está en el soporte no se deriva
> En la Uniforme$(3,\alpha)$ la verosimilitud $L(\alpha)=(\alpha-3)^{-n}$ solo vale si $\alpha\ge x_i$ para todos los datos y es decreciente: el máximo está en el borde, $\hat\alpha=\max_i x_i$. En la Uniforme$(\alpha,2)$, $\hat\alpha=\min_i x_i$. Igualar la derivada a cero no sirve. En la [[distribucion-pareto|Pareto]] con $x_0$ y $\alpha$ desconocidos se fija primero $\hat x_0=\min_i X_i$ y después se deriva respecto de $\alpha$.

**Máximo a posteriori (MAP).** Enfoque **bayesiano**: $\theta$ se trata como v.a. con una densidad **a priori** $g(\theta)$. Por Bayes se obtiene la **a posteriori** y se maximiza; como el denominador no depende de $\theta$, basta maximizar el numerador.

$$ g(\theta\mid x_1,\dots,x_n)\;\propto\; f(x_1,\dots,x_n\mid\theta)\,g(\theta) $$

Para [[distribucion-bernoulli|Bernoulli]]$(p)$ con prior Beta$(\alpha,\beta)$ y $s=\sum x_i$ éxitos:

$$ \hat p_{\text{MAP}}=\frac{s+\alpha-1}{n+\alpha+\beta-2} $$

El prior suma $\alpha-1$ éxitos y $\beta-1$ fracasos «virtuales»; con prior uniforme ($\alpha=\beta=1$) se recupera el estimador de MV $s/n$. Para la media de una normal con prior $\mathcal N(\mu_p,\sigma_p)$, el MAP es un promedio ponderado entre $\overline X_n$ y $\mu_p$: con $n$ pequeño manda el prior y con $n$ grande mandan los datos.

**Método de los momentos.** Se escribe un momento poblacional como función del parámetro, $\mu_k=E[X^k]=H(\theta)$, se lo iguala al momento muestral y se despeja.

$$ \hat\theta=H^{-1}(\hat\mu_k),\qquad \text{por ejemplo } E[X]=\frac{1}{\lambda}\;\Rightarrow\;\hat\lambda=\frac{1}{\overline X_n} $$

El ejemplo es la exponencial. Con la geométrica (muestreo inverso: entrevistar personas hasta la primera que aprueba, una vez por día), si $X_i$ son las **personas entrevistadas** el día $i$, incluida la que aprueba (versión «ensayos»), $E[X_i]=1/p$ da $\hat p=n/\sum X_i=1/\overline X_n$. Si en cambio $X_i$ cuenta los **fracasos** antes de la primera aprobación (convención por defecto del wiki desde U3), $E[X_i]=q/p$ y el estimador es $\hat p=1/(1+\overline X_n)=n/(n+\sum X_i)$; las dos versiones dan el mismo número porque los ensayos son los fracasos más uno. Para la Uniforme$(3,\alpha)$, $E[X]=\frac{3+\alpha}{2}$ da $\hat\alpha=2\overline X_n-3$, distinto del de MV.

**Cómo reconocer cuál usar:** si se conoce la familia y se pide el estimador «estándar», MV; si el enunciado da una distribución a priori del parámetro, MAP; si el parámetro se despeja fácil de la media (exponencial, uniforme), momentos.

> [!warn] Momentos puede dar un valor imposible
> El estimador de momentos puede salir incompatible con los datos: en la Pareto, el de $x_0$ puede quedar por encima del mínimo observado, y en la Uniforme$(3,\alpha)$, $2\overline X_n-3$ puede quedar por debajo de algún dato. MV no tiene este problema porque maximiza sobre el soporte válido.

Detalle: [[estimacion-puntual|Estimación Puntual]]

## 5. Varianza muestral

La **varianza muestral** es el estimador de $\sigma^2$. Divide por $n-1$ (**corrección de Bessel**) porque los desvíos se miden respecto de $\overline X_n$, que ya se ajusta a los datos: un grado de libertad se consume al estimar la media. El **desvío muestral** $S_n=\sqrt{S_n^2}$ reemplaza a $\sigma$ en los intervalos con desvío desconocido.

$$ S_n^2=\frac{1}{n-1}\sum_{i=1}^n (X_i-\overline X_n)^2,\qquad E[S_n^2]=\sigma^2 $$

Es **insesgado**, y consistente si la varianza y la curtosis son finitas. Para hacer cuentas a mano se usa la identidad de cálculo:

$$ (n-1)\,S_n^2=\sum_{i=1}^n X_i^2-n\,\overline X_n^2 $$

Con ella se prueba la insesgadez: tomando esperanza (con $\mu=0$), $E[(n-1)S_n^2]=n\sigma^2-n\cdot\frac{\sigma^2}{n}=(n-1)\sigma^2$.

**Cómo reconocerlo:** el enunciado da los datos crudos (o $\sum x_i$ y $\sum x_i^2$) y no da $\sigma$: hay que calcular $s$ con la identidad antes de armar el intervalo.

> [!warn] Dividir por $n$ subestima
> $\tilde S_n^2=\frac1n\sum(X_i-\overline X_n)^2$ cumple $E[\tilde S_n^2]=\frac{n-1}{n}\sigma^2$: tiene sesgo negativo, aunque es asintóticamente insesgado. Para estimar $\sigma^2$ se divide por $n-1$.

> [!warn] Discrepancia: denominador de la varianza descriptiva
> [[medidas-de-dispersion|Medidas de dispersión]] define la varianza de los datos $s^2$ con denominador $n-1$, mientras que [[varianza-muestral|Varianza Muestral]] llama «versión descriptiva» a la de denominador $n$. Las dos coinciden en que el estimador de $\sigma^2$ usa $n-1$.

> [!figura] u8-por-que-n-menos-1
> La parábola $Q(c)=\sum_i (x_i-c)^2$ alcanza su mínimo en $c=\overline X_n$ y nunca en $c=\mu$: la brecha $n(\overline X_n-\mu)^2$ entre ambos valores es justo lo que se pierde al centrar en la media muestral. Acumule muestras y compare los promedios de $Q/n$ y de $Q/(n-1)$ contra $\sigma^2$.

Detalle: [[varianza-muestral|Varianza Muestral]]

## 6. Distribución ji-cuadrado

La **ji-cuadrado** con $k$ grados de libertad es la suma de cuadrados de $k$ normales estándar independientes. Es no negativa, asimétrica, y es un caso de la [[distribucion-gamma|Gamma]] con forma $k/2$ y tasa $1/2$. En inferencia aparece como la ley del estadístico de la varianza muestral de una población normal.

$$ \sum_{i=1}^k Z_i^2\sim\chi^2_k,\qquad E[X]=k,\qquad V(X)=2k $$

Con $Z_i\sim\mathcal N(0,1)$ independientes. La esperanza cuenta los cuadrados sumados ($E[Z_i^2]=1$).

$$ \frac{(n-1)\,S_n^2}{\sigma^2}\sim\chi^2_{n-1} $$

Vale si $X_i\sim\mathcal N(\mu,\sigma)$ i.i.d.; los grados de libertad son $n-1$ porque uno se consume al estimar la media. Tomando esperanza se recupera $E[S_n^2]=\sigma^2$, y con $V=2(n-1)$ sale $V(S_n^2)=\frac{2\sigma^4}{n-1}$.

Otras propiedades: si son independientes, $\chi^2_{k_1}+\chi^2_{k_2}=\chi^2_{k_1+k_2}$; para $k$ grande, $\chi^2_k\approx\mathcal N(k,\sqrt{2k})$.

**Cómo reconocerlo:** se pide un IC (o una prueba) **para la varianza** $\sigma^2$ o el desvío de una población normal, o se pide justificar la t de Student.

Detalle: [[distribucion-ji-cuadrado|Distribución Ji-cuadrado]]

## 7. Distribución t de Student

Al estandarizar la media muestral con el desvío **estimado** $S_n$ en vez de $\sigma$, el estadístico deja de ser normal estándar y pasa a ser una **t de Student** con $n-1$ grados de libertad. Es simétrica respecto de 0 y tiene **colas más pesadas** que la normal, porque $S_n$ es ruidoso: cuando sale pequeño, el cociente se infla.

$$ T=\frac{\overline X_n-\mu}{S_n/\sqrt n}\sim t_{n-1} $$

Vale con $X_i\sim\mathcal N(\mu,\sigma)$ i.i.d. y $\sigma$ desconocido. Se construye como $T=Z/\sqrt{V/k}$, con $Z\sim\mathcal N(0,1)$ y $V\sim\chi^2_k$ independientes.

$$ E[T]=0\ (m>1),\qquad V(T)=\frac{m}{m-2}>1\ (m>2) $$

Con $m$ grados de libertad. El fractil $t_{m,\gamma}$ es **mayor** que $z_\gamma$ y crece cuando bajan los grados de libertad, así que con $n$ pequeño el IC es más ancho. Cuando $m\to\infty$, $t_m\to\mathcal N(0,1)$.

**Cómo reconocerlo:** IC o prueba **para la media**, muestra **normal**, $\sigma$ **desconocido** y $n$ no grande.

> [!warn] Tamaño de muestra o grados de libertad
> La teórica escribe las fórmulas de la t en función del tamaño de muestra $n$ ($V(T)=\frac{n-1}{n-3}$), y otras fuentes en función de los grados de libertad $\nu$ ($V(T)=\frac{\nu}{\nu-2}$). Coinciden con $\nu=n-1$. En la tabla de fractiles se entra siempre por $\text{GDL}=n-1$.

> [!figura] u8-t-vs-normal-y-fractiles
> Arriba, la $t_m$ superpuesta a la $\mathcal N(0,1)$ con la cola de área $1-\gamma$ sombreada bajo cada una: la de la $t$ es más gruesa, así que su fractil queda más a la derecha. Abajo, $t_{m,\gamma}$ en función de $m$, siempre por encima de su asíntota $z_\gamma$.

Detalle: [[distribucion-t-de-student|Distribución t de Student]]

## 8. Intervalos de confianza para la media y la proporción

Un **intervalo de confianza** es un rango $(\hat\theta_\ell,\hat\theta_u)$ construido con la muestra que contiene a $\theta$ con **nivel de confianza** $\gamma$. Puede ser **bilateral** (dos extremos finitos) o **unilateral** (un extremo en $\pm\infty$, o en 0 o 1 para una proporción).

$$ P\big(\hat\theta_\ell(X_1,\dots,X_n)<\theta<\hat\theta_u(X_1,\dots,X_n)\big)=\gamma $$

Antes de muestrear, la fórmula atrapa a $\theta$ con probabilidad $\gamma$: de $M$ intervalos, alrededor de $\gamma M$ lo contienen. Después de muestrear, el intervalo contiene o no a $\theta$.

Los tres casos tienen la forma $\overline X_n\pm\Delta_B$ (o $\hat p\pm\Delta_B$), con la **semiamplitud** $\Delta_B$:

**Caso 1 — media con $\sigma$ conocido (normal) → $Z$.**

$$ \Delta_B=z_{\frac{1+\gamma}{2}}\,\frac{\sigma}{\sqrt n} $$

Sale de pedir $P(|\overline X_n-\mu|\le\Delta)=\gamma$, que da $\Phi\big(\Delta/(\sigma/\sqrt n)\big)=\frac{1+\gamma}{2}$. Si los datos no son normales pero $n$ es grande, el TCL permite usar la misma fórmula.

**Caso 2 — proporción → $Z$ con $\hat p$ en el desvío.**

$$ \Delta_B=z_{\frac{1+\gamma}{2}}\sqrt{\frac{\hat p(1-\hat p)}{n}} $$

Para $n$ grande. Como el desvío depende de $p$, se reemplaza por $\hat p$. Los unilaterales se acotan a $[0,1]$.

**Caso 3 — media con $\sigma$ desconocido (normal) → $t_{n-1}$.**

$$ \Delta_B=t_{n-1,\frac{1+\gamma}{2}}\,\frac{S_n}{\sqrt n} $$

Se reemplaza $\sigma$ por $S_n$ y $z$ por el fractil de la t con $n-1$ grados de libertad. Para $n$ muy grande, $t\approx z$ y se usa $z_{\frac{1+\gamma}{2}}S_n/\sqrt n$.

**Unilaterales:** se usa $\gamma$ en lugar de $\frac{1+\gamma}{2}$. Por ejemplo, la cota inferior con $\sigma$ conocido es $\big(\overline X_n-z_\gamma\frac{\sigma}{\sqrt n},\,\infty\big)$, y una cota máxima para una proporción es $\hat p+z_\gamma\sqrt{\hat p(1-\hat p)/n}$.

**Cómo reconocerlo:** se pregunta primero qué se estima (media o proporción) y después si $\sigma$ es dato. «Desvío estándar conocido de 15 g» → caso 1; «se observaron 18 defectuosas en 300» → caso 2; una lista corta de mediciones sin $\sigma$ → caso 3. «Máximo» o «mínimo» con cierta confianza → unilateral.

> [!warn] Lo que no se dice
> No es correcto decir «este intervalo tiene 90% de probabilidad de contener a $\mu$». Una vez calculado, los extremos son números fijos; la probabilidad $\gamma$ corresponde a la fórmula antes de tomar la muestra.

> [!warn] Discrepancia: umbral de «$n$ grande»
> La página de intervalos pide $n>100$ para aplicar el caso 1 a datos no normales y da «$>100/200$» para reemplazar $t$ por $z$; la página de la t menciona tanto «$n>100/200$» como «$n>200$», y el árbol del formulario usa $n>200$. Las páginas no fijan un único umbral.

> [!figura] u8-ic-cobertura-frecuentista
> Cien muestras de la misma población, cada una con su intervalo: los verdes atrapan a $\mu$ y los rojos no. Observe que al subir $n$ los intervalos se angostan pero la proporción de aciertos sigue pegada a $\gamma$: la confianza es una propiedad de la fórmula, no de un intervalo ya calculado.

> [!figura] u8-ji-cuadrado-dos-colas-ic-varianza
> Arriba, las dos colas de área $(1-\gamma)/2$ bajo la $\chi^2_{n-1}$: los cuantiles no son opuestos ni equidistantes del centro. Abajo, el eje de $\sigma^2$ con el intervalo; siga los dos conectores rotulados y note que el cuantil **superior** determina el extremo **inferior** del intervalo, y el inferior el superior. El cruce viene de despejar: al pasar de $\chi^2_{\text{inf}}\le (n-1)S^2/\sigma^2\le\chi^2_{\text{sup}}$ a una desigualdad en $\sigma^2$ hay que invertir, y al invertir se dan vuelta las desigualdades. Con el interruptor de los cuantiles de la t se ve el error: las dos condiciones que quedan apuntan en sentidos opuestos, no encierran nada y el intervalo resulta **vacío** (además, uno de los extremos sale negativo, fuera del eje por la izquierda). Con $n=10$ y $s\approx 10.56$ el intervalo queda muy cerca del que da el ejercicio resuelto citado al final de la sección.

Detalle: [[intervalos-de-confianza|Intervalos de Confianza]]

## 9. Intervalo de confianza para la varianza

Con datos normales, el pivote es $(n-1)S_n^2/\sigma^2\sim\chi^2_{n-1}$. Como la ji-cuadrado **no es simétrica**, los dos cuantiles no son opuestos: se toman los de $\frac{1-\gamma}{2}$ y $\frac{1+\gamma}{2}$, de modo que $P\big(\chi^2_{n-1;\frac{1-\gamma}{2}}\le (n-1)S_n^2/\sigma^2\le\chi^2_{n-1;\frac{1+\gamma}{2}}\big)=\gamma$, y se despeja $\sigma^2$. Al invertir las fracciones se invierten las desigualdades, así que el cuantil **superior** da el extremo **inferior**.

$$ IC_\gamma(\sigma^2)=\left[\frac{(n-1)S_n^2}{\chi^2_{n-1;\frac{1+\gamma}{2}}}\;;\;\frac{(n-1)S_n^2}{\chi^2_{n-1;\frac{1-\gamma}{2}}}\right] $$

Vale con $X_i\sim\mathcal N(\mu,\sigma)$ i.i.d. Con $n=10$ y $s=10.5634$, el $IC_{95\%}(\sigma^2)$ es $[52.79;\,371.90]$.

**Cómo reconocerlo:** el enunciado pide un intervalo para la **varianza** o el **desvío** de una población normal.

> [!warn] No usar cuantiles de la t para la varianza
> Es un error frecuente: el intervalo resultante no se basa en la distribución real del estadístico y queda mal formulado. La varianza usa ji-cuadrado, no Student.

Detalle: [[intervalos-de-confianza|Intervalos de Confianza]] (caso 4) y [[distribucion-ji-cuadrado|Distribución Ji-cuadrado]]

## 10. Tamaño muestral y población finita

El **error de muestreo** $E$ es la semiamplitud del IC. Despejando $n$ de $E=z_{\frac{1+\gamma}{2}}\sigma/\sqrt n$ se obtiene cuántos datos hacen falta para una precisión dada:

$$ n\ge z_{\frac{1+\gamma}{2}}^2\,\frac{\sigma^2}{E^2} $$

Para una proporción se reemplaza $\sigma^2$ por $p(1-p)$, usando la **cota conservadora** $p(1-p)\le\frac14$ o una estimación previa $\hat p$. Si $\sigma$ es desconocido, se usa el $s$ de una **muestra piloto**. Como $E\propto 1/\sqrt n$, partir el error a la mitad exige cuadruplicar la muestra. Si ya se midieron algunos datos, la respuesta es la diferencia («cuántos más»).

**Población finita.** Si se muestrea **sin reposición** de una población de tamaño $N$, el conteo es [[distribucion-hipergeometrica|hipergeométrico]] y la semiamplitud lleva un factor de corrección:

$$ E=z_{1-\frac{\alpha}{2}}\sqrt{\hat p(1-\hat p)}\,\sqrt{\frac{N-n}{N\,n}},\qquad n=\frac{1}{B^2+\frac1N},\quad B=\frac{E}{z_{1-\alpha/2}\sqrt{\hat p(1-\hat p)}} $$

Si $N\gg n$ se recupera la fórmula infinita; si $N=n$ el error es 0. El $n$ necesario queda acotado por $N$.

**Cómo reconocerlo:** «¿cuántos envases más para un error de 5 g?», «tamaño de muestra para una semiamplitud de 0.01», o una población explícitamente finita (por ejemplo, $N$ hogares).

Detalle: [[intervalos-de-confianza|Intervalos de Confianza]]

## Cómo aparece en los parciales

Los ejercicios resueltos de las páginas de la unidad (casi todos del [[tp8-estimacion-de-parametros|TP8]]) repiten estos patrones. Para ejercicios tomados en evaluaciones, ver [[ejercicios-de-parcial-resueltos-estadistica|Ejercicios de parcial resueltos (estadística)]] y el [[parcialito-tp8y9-acf|Parcialito TP8 y TP9]].

1. **Estimador de MV derivando.** Escribir la log-verosimilitud, derivar, igualar a cero y verificar el máximo. Casos típicos: normal con $\sigma$ conocido ($\hat\mu=\overline X_n$) y Laplace ($\hat\alpha=\frac1n\sum|x_i|$).
2. **Estimador de MV por soporte.** Uniformes con un extremo desconocido: $\hat\alpha=\max x_i$ o $\min x_i$, sin derivar. Suele venir junto con el estimador de momentos para compararlos.
3. **MAP con prior conjugado.** Bernoulli con prior Beta: posterior $\propto p^{s+\alpha-1}(1-p)^{n-s+\beta-1}$, derivar el logaritmo y despejar.
4. **Insesgadez y mínima varianza.** Combinar dos medias muestrales $Y=a\overline X_1+b\overline X_2$: imponer $E[Y]=\mu$ y minimizar $V(Y)$ en $a$.
5. **Demostrar la insesgadez de $S_n^2$**, con la identidad de cálculo o con la esperanza de la ji-cuadrado.
6. **IC de la media con $t$.** Lista corta de datos normales sin $\sigma$: calcular $\bar x$ y $s$ (con $\sum x_i^2$), buscar $t_{n-1,\frac{1+\gamma}{2}}$ y armar $\bar x\pm\Delta_B$. Por ejemplo, 7 recipientes con $\bar x=10$, $s=0.2828$ y $t_{6,0.975}=2.4469$ dan $(9.74;\,10.26)$; 10 paquetes de azúcar al 90% dan $(983.6;\,989.6)$ g, que no contiene el nominal de 1000 g.
7. **IC de la media con $Z$ y tamaño muestral.** $\sigma$ conocido: armar el intervalo y despejar el $n$ para un error dado, restando los ya medidos (latas de café: $n\ge25$, faltan 15).
8. **IC de una proporción**, bilateral y unilateral («porcentaje defectuoso máximo»), más el tamaño muestral con $\hat p$ previo o con la cota $\frac14$ (piezas: $\hat p=0.06$, $(0.037;\,0.083)$, máximo $7.76\%$).
9. **IC con datos agrupados y $n$ grande.** Media y desvío por marca de clase y fractil $z$ por TCL (sílice, $n=150$).
10. **IC de la varianza** con cuantiles de la ji-cuadrado (y no de la t).
11. **Interpretar** el intervalo en términos frecuentistas y decidir si contiene un valor nominal.

## Tabla de fórmulas de la unidad

| Qué | Fórmula | Cuándo se usa |
|---|---|---|
| Error cuadrático medio | $\mathrm{mse}(\hat\theta)=V(\hat\theta)+\mathrm{sesgo}^2(\hat\theta)$ | Comparar estimadores |
| Sesgo | $\mathrm{sesgo}(\hat\theta)=E[\hat\theta]-\theta$ | Insesgado si vale 0 |
| Consistencia | $\lim_{n\to\infty}\mathrm{mse}(\hat\theta)=0$ | Comportamiento con $n$ grande |
| Media muestral | $\overline X_n=\frac1n\sum X_i$, ECM $\sigma^2/n$ | Estimar $\mu$ |
| Proporción muestral | $\hat p=\frac1n\sum X_i$, ECM $p(1-p)/n$ | Estimar $p$ |
| Varianza muestral | $S_n^2=\frac{1}{n-1}\sum(X_i-\overline X_n)^2$ | Estimar $\sigma^2$ (insesgada) |
| Identidad de cálculo | $(n-1)S_n^2=\sum X_i^2-n\overline X_n^2$ | Calcular $s$ a mano |
| Máxima verosimilitud | $\hat\theta=\arg\max_\theta\sum_i\ln f(x_i;\theta)$ | Familia conocida |
| MAP | $\hat\theta=\arg\max_\theta f(x\mid\theta)\,g(\theta)$ | Hay prior sobre $\theta$ |
| MAP Bernoulli–Beta | $\hat p=\frac{s+\alpha-1}{n+\alpha+\beta-2}$ | Prior Beta$(\alpha,\beta)$ |
| Momentos | $E[X^k]=H(\theta)=\hat\mu_k\Rightarrow\hat\theta=H^{-1}(\hat\mu_k)$ | Parámetro fácil de despejar |
| Ji-cuadrado | $\frac{(n-1)S_n^2}{\sigma^2}\sim\chi^2_{n-1}$; si $X\sim\chi^2_k$, $E=k$, $V=2k$ | Datos normales, varianza |
| t de Student | $\frac{\overline X_n-\mu}{S_n/\sqrt n}\sim t_{n-1}$ | Normal, $\sigma$ desconocido |
| IC media, $\sigma$ conocido | $\overline X_n\pm z_{\frac{1+\gamma}{2}}\frac{\sigma}{\sqrt n}$ | Normal, o $n$ grande |
| IC media, $\sigma$ desconocido | $\overline X_n\pm t_{n-1,\frac{1+\gamma}{2}}\frac{S_n}{\sqrt n}$ | Normal, $n$ pequeño |
| IC media, $\sigma$ desconocido, $n$ muy grande | $\overline X_n\pm z_{\frac{1+\gamma}{2}}\frac{S_n}{\sqrt n}$ | $t\approx z$ (caso 3') |
| IC proporción | $\hat p\pm z_{\frac{1+\gamma}{2}}\sqrt{\frac{\hat p(1-\hat p)}{n}}$ | $n$ grande |
| IC unilateral | mismo, con $z_\gamma$ o $t_{n-1,\gamma}$ | Cota máxima o mínima |
| IC varianza | $\Big[\frac{(n-1)S_n^2}{\chi^2_{n-1;\frac{1+\gamma}{2}}};\frac{(n-1)S_n^2}{\chi^2_{n-1;\frac{1-\gamma}{2}}}\Big]$ | Normal, estimar $\sigma^2$ |
| Tamaño muestral, media | $n\ge z_{\frac{1+\gamma}{2}}^2\sigma^2/E^2$ | Error $E$ fijado ($s$ piloto si $\sigma$ falta) |
| Tamaño muestral, proporción | $n\ge z_{\frac{1+\gamma}{2}}^2\hat p(1-\hat p)/E^2$, o con $\frac14$ | Error $E$ fijado |
| Población finita | $n=\frac{1}{B^2+1/N}$, con $B=\frac{E}{z_{1-\alpha/2}\sqrt{\hat p(1-\hat p)}}$ | Sin reposición, $N$ finito |

Todas las fórmulas, con el árbol de decisión entre $z$, $t$ y ji-cuadrado, están en el [[formulario-inferencia|Formulario — Inferencia Estadística]]. La dualidad con las pruebas de hipótesis sigue en [[prueba-de-hipotesis|Prueba de Hipótesis]].
