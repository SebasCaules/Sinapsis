---
titulo: "Resumen de la Unidad 7 — Suma de Variables Aleatorias"
tipo: resumen
unidad: 7
orden: 1
hub: true
tags: [resumen, suma-de-va, tcl, lgn]
resumen: "La esperanza de una suma siempre suma y la varianza suma sin correlación; con independencia la distribución sale por convolución. Para $n$ i.i.d., $\bar X_n$ tiene media $\mu$ y varianza $\sigma^2/n$: Chebyshev la acota, la LGN la lleva a $\mu$ y el TCL la vuelve normal."
fuentes: ["[[suma-de-variables-aleatorias]]", "[[suma-de-va-independientes]]", "[[distribucion-gamma]]", "[[distribucion-erlang]]", "[[promedio-muestral]]", "[[desigualdad-de-chebyshev]]", "[[ley-de-grandes-numeros]]", "[[teorema-central-del-limite]]", "[[aproximacion-normal-de-la-binomial]]", "[[formulario-suma-de-va]]"]
actualizado: 2026-11-09
---

# Resumen de la Unidad 7 — Suma de Variables Aleatorias

La unidad 5 enseñó a trabajar con dos variables a la vez (conjunta, marginales, [[covarianza-y-correlacion|covarianza]], independencia) y la unidad 6 usó sumas de tiempos exponenciales en el [[proceso-de-poisson|proceso de Poisson]]. La unidad 7 estudia de forma sistemática la variable **suma** $S=X+Y$ (y su generalización $S_n=X_1+\dots+X_n$): cuánto vale su esperanza, cuánto su varianza y cuál es su distribución. De ahí sale el **promedio muestral** $\bar X_n$, y la unidad termina con las herramientas para estudiarlo: las **cotas de Markov y Chebyshev**, que valen para una sola variable con $n$ fijo y, aplicadas a $\bar X_n$, conducen a los resultados asintóticos; la **Ley de los Grandes Números** y el **Teorema Central del Límite**, que describen su comportamiento cuando $n$ crece, este último con su caso más usado, la **aproximación normal de la binomial**. Todo esto es la base de la unidad 8 (Inferencia Estadística), donde $\bar X_n$ se usa como estimador y su distribución aproximadamente normal permite construir intervalos de confianza.

> [!info] Lo esencial
> - $E[X+Y]=E[X]+E[Y]$ siempre; $V(X+Y)=V(X)+V(Y)$ solo si $\mathrm{Cov}(X,Y)=0$, y $V(X-Y)$ también **suma**.
> - Con independencia, la distribución de la suma es la **convolución**; varias familias se cierran (Normal, Poisson, Binomial de igual $p$) y otras sumas dan una familia conocida distinta (Exponenciales i.i.d. dan Gamma/Erlang).
> - Para $n$ i.i.d.: $E[\bar X_n]=\mu$ y $V(\bar X_n)=\sigma^2/n$; el desvío del promedio es $\sigma/\sqrt n$.
> - Chebyshev da una cota universal pero floja: $P(|X-\mu|\ge\varepsilon)\le\sigma^2/\varepsilon^2$; aplicada a $\bar X_n$ demuestra la LGN débil.
> - TCL: $S_n\approx\mathcal N(n\mu,\sqrt n\,\sigma)$ y $\bar X_n\approx\mathcal N(\mu,\sigma/\sqrt n)$, sin importar la distribución de origen.
> - Al aproximar una variable **discreta** por la Normal se usa la **corrección por continuidad** $\pm\tfrac12$.

> [!nota] Notación del wiki
> En toda la unidad, $\mathcal N(\mu,\sigma)$ lleva como segundo parámetro el **desvío** $\sigma$, no la varianza. Por ejemplo, $\mathcal N(20,3)$ significa media 20 y desvío 3. La varianza se escribe $V(X)$ o $\sigma^2$.

## 1. Esperanza, varianza y distribución de una suma

Dadas dos variables $X,Y$ cualesquiera, la **esperanza es lineal** sin ninguna hipótesis. La **varianza** de la suma, en cambio, arrastra el término de **covarianza**, que se anula si las variables son independientes o solo no correlacionadas. Para $n$ variables: $E[S_n]=\sum E[X_k]$ siempre, y $V(S_n)=\sum V(X_k)$ si son independientes.

$$ E[X+Y]=E[X]+E[Y] $$

Vale siempre, sin importar la dependencia entre $X$ e $Y$.

$$ V(X+Y)=V(X)+2\,\mathrm{Cov}(X,Y)+V(Y) $$

Es el caso general; sale de desarrollar $E\big[((X-\mu_X)+(Y-\mu_Y))^2\big]$. Si $\mathrm{Cov}(X,Y)=0$ queda $V(X\pm Y)=V(X)+V(Y)$: la resta también suma varianzas por el factor $(-1)^2$. Lo que cambia de signo es la media, $\mu_{X-Y}=\mu_X-\mu_Y$.

La **distribución** de la suma se obtiene en general desde la **conjunta**, recorriendo los pares $(x,y)$ con $x+y=s$ (se parametriza por $y$, de modo que $x=s-y$):

$$ p_S(s)=\sum_{y\in R_Y} p_{X,Y}(s-y,\,y),\qquad f_S(s)=\int_{-\infty}^{+\infty} f_{X,Y}(s-y,\,y)\,dy $$

Discreta a la izquierda, continua a la derecha. Con la regla del producto se puede escribir con la condicional, $p_{X,Y}(s-y,y)=p_{X\mid Y}(s-y\mid y)\,p_Y(y)$. Si $X$ e $Y$ son **independientes**, la conjunta factoriza y queda la **convolución**:

$$ p_S(s)=\sum_{y\in R_Y} p_X(s-y)\,p_Y(y),\qquad f_S(s)=\int_{-\infty}^{+\infty} f_X(s-y)\,f_Y(y)\,dy $$

**Cómo reconocerlo:** el enunciado pide media o varianza de un total, una diferencia o una combinación de variables (se usan las dos primeras fórmulas); o pide la densidad o masa de $X+Y$ con densidades dadas que no son de una familia conocida (se plantea la convolución, cuidando los límites del soporte).

Detalle: [[suma-de-variables-aleatorias|Suma de Variables Aleatorias]]

## 2. Sumas de independientes con nombre propio

Cuando $X$ e $Y$ son independientes, la convolución devuelve una distribución con nombre propio: algunas familias se **conservan** con parámetros sumados (Binomial de igual $p$, Poisson, Normal, Gamma de igual tasa) y otras sumas pasan a otra familia (Bernoulli a Binomial, Exponencial a Gamma, Geométrica a Binomial Negativa, cuadrados de normales estándar a $\chi^2$, uniformes a triangular). En todos los casos $\mu_S=\mu_X+\mu_Y$ y $\sigma_S^2=\sigma_X^2+\sigma_Y^2$. Un atajo es la [[funcion-generadora-de-momentos|función generadora de momentos]]: la FGM de una suma de independientes es el **producto** de las FGM, y eso suele identificar la familia sin integrar.

| Sumandos (independientes) | Suma |
|---|---|
| $n$ veces $\mathrm{Bernoulli}(p)$ i.i.d. | $\mathrm{Bin}(n,p)$ |
| $\mathrm{Bin}(n_1,p)+\mathrm{Bin}(n_2,p)$, **misma** $p$ | $\mathrm{Bin}(n_1+n_2,p)$ |
| $\mathrm{Poisson}(\lambda_1)+\mathrm{Poisson}(\lambda_2)$ | $\mathrm{Poisson}(\lambda_1+\lambda_2)$ |
| $\mathcal N(\mu_1,\sigma_1)+\mathcal N(\mu_2,\sigma_2)$ | $\mathcal N(\mu_1+\mu_2,\sqrt{\sigma_1^2+\sigma_2^2})$ |
| $\mathrm{Unif}(0,1)+\mathrm{Unif}(0,1)$ | triangular en $(0,2)$, **no** uniforme |
| $n$ veces $\mathrm{Exp}(\lambda)$ i.i.d. | $\mathrm{Gamma}(n,\lambda)=\mathrm{Erlang}_n(\lambda)$ |
| $\mathrm{Geo}(p)+\mathrm{Geo}(p)$ | $\mathrm{BinNeg}(2,p)$ |
| $\mathrm{BinNeg}(n,p)+\mathrm{BinNeg}(m,p)$, **misma** $p$ | $\mathrm{BinNeg}(n+m,p)$ |
| $\sum_{i=1}^n \mathcal N(0,1)^2$ | $\chi^2_n$ |

Las familias de la tabla tienen su página: [[distribucion-binomial|Binomial]], [[distribucion-poisson|Poisson]], [[distribucion-normal|Normal]], [[distribucion-binomial-negativa|Binomial Negativa]] y [[distribucion-ji-cuadrado|ji-cuadrado]].

La suma de dos normales independientes es el caso más usado:

$$ X+Y\sim\mathcal N\big(\mu_1+\mu_2,\ \sqrt{\sigma_1^2+\sigma_2^2}\big) $$

Suman las **varianzas**, no los desvíos: con $\sigma_1=3$ y $\sigma_2=4$ el desvío de la suma es 5, no 7, y nunca es menor que el mayor de los dos. La suma de dos uniformes en $(0,1)$ da la densidad triangular:

$$ f_S(s)=\begin{cases} s & 0<s<1\\ 2-s & 1\le s<2\\ 0 & \text{si no}\end{cases} $$

Es el ejemplo de familia que **no** se conserva bajo suma. La suma de Poisson se demuestra por convolución y binomio de Newton; la de binomiales, con la identidad de Vandermonde, que **exige la misma $p$**.

> [!warn] Geométrica: dos convenciones
> El caso $\mathrm{Geo}(p)+\mathrm{Geo}(p)=\mathrm{BinNeg}(2,p)$ está deducido en la versión **«fracasos»** (recorrido $\{0,1,2,\dots\}$), donde $P(S=k)=(k+1)\,p^2(1-p)^k$. La geométrica también existe en versión **«intentos»**. Solo se pueden sumar variables de la **misma versión**: mezclarlas cambia el recorrido y $E[S]$. Ver [[distribucion-geometrica|Distribución Geométrica]].

**Cómo reconocerlo:** el total de varias cantidades independientes de la misma familia (llamadas en varias centrales Poisson, pesos normales, éxitos en varios lotes con la misma $p$). Se identifica la familia de la suma y se calcula exacto con sus parámetros.

Detalle: [[suma-de-va-independientes|Suma de Variables Aleatorias Independientes]]

## 3. Distribuciones Gamma y Erlang

La **Gamma** modela el **tiempo de espera hasta acumular varias ocurrencias** de un proceso de Poisson; es la suma de exponenciales independientes de la misma tasa. Tiene parámetro de **forma** $\alpha>0$ (también llamado $k$) y **tasa** $\lambda>0$. El curso la introduce con forma **entera** $n$, y en ese caso se llama **Erlang de orden $n$**: $\mathrm{Erlang}_n(\lambda)=\mathrm{Gamma}(n,\lambda)$. Con $n=1$ es la [[distribucion-exponencial|exponencial]].

$$ f_{T_n}(t)=\frac{\lambda^{n}\,t^{\,n-1}\,e^{-\lambda t}}{(n-1)!},\qquad t>0 $$

Es la densidad de $T_n=\tau_1+\dots+\tau_n$ con $\tau_i\sim\mathrm{Exp}(\lambda)$ i.i.d. Para forma real $\alpha$, $X\sim\mathrm{Gamma}(\alpha,\lambda)$, se reemplaza $n$ por $\alpha$ en toda la fórmula y $(n-1)!$ por la función Gamma $\Gamma(\alpha)=\int_0^\infty u^{\alpha-1}e^{-u}\,du$, que cumple $\Gamma(n)=(n-1)!$:

$$ f_X(x)=\frac{\lambda^{\alpha}\,x^{\,\alpha-1}\,e^{-\lambda x}}{\Gamma(\alpha)},\qquad x>0 $$

$$ E[X]=\frac{\alpha}{\lambda},\qquad V(X)=\frac{\alpha}{\lambda^{2}},\qquad M_X(t)=\left(\frac{\lambda}{\lambda-t}\right)^{\alpha}\ (t<\lambda) $$

Con forma entera $\alpha=n$ queda $E[T_n]=n/\lambda$ y $V(T_n)=n/\lambda^2$, que salen de sumar $n$ veces $E[\tau_i]=1/\lambda$ y $V(\tau_i)=1/\lambda^2$; la FGM es la potencia $\alpha$ de la FGM exponencial. Además, $\mathrm{Gamma}(\alpha_1,\lambda)+\mathrm{Gamma}(\alpha_2,\lambda)=\mathrm{Gamma}(\alpha_1+\alpha_2,\lambda)$ si son independientes con la **misma tasa**, y $\chi^2_k=\mathrm{Gamma}(k/2,\,1/2)$.

La herramienta clave para calcular probabilidades es la **dualidad Erlang–Poisson**: «la $n$-ésima ocurrencia todavía no llegó en $t$» equivale a «hasta $t$ hubo a lo sumo $n-1$ ocurrencias».

$$ P(T_n>t)=P\big(N(t)\le n-1\big)=\sum_{j=0}^{n-1}\frac{(\lambda t)^{j}}{j!}\,e^{-\lambda t},\qquad N(t)\sim\mathrm{Poisson}(\lambda t) $$

Así un problema de tiempo continuo se resuelve con una suma finita, sin integrar la densidad. Si $n$ es grande, también se puede aproximar por el TCL.

**Cómo reconocerlo:** «tiempo total hasta la $n$-ésima falla, llegada o evento», o componentes usados **en serie temporal** (uno arranca cuando falla el anterior) con duraciones exponenciales de la misma tasa.

> [!nota] Nombres de los parámetros
> La página de la Gamma usa forma $\alpha$ (o $k$) y la de la Erlang usa orden $k$; el formulario y la suma de exponenciales usan $n$. Es el mismo parámetro: la cantidad de exponenciales sumadas.

Detalle: [[distribucion-gamma|Distribución Gamma]] · [[distribucion-erlang|Distribución Erlang]]

## 4. Promedio muestral

Dada una muestra $X_1,\dots,X_n$ **i.i.d.** con media $\mu_X$ y varianza $\sigma_X^2$, el **promedio muestral** es la variable central de la distribución en el muestreo y de la estimación:

$$ \bar X_n=\frac1n\sum_{i=1}^n X_i=\frac1n S_n $$

Sus momentos salen directamente de los de la suma ($E[S_n]=n\mu_X$, $V(S_n)=n\sigma_X^2$):

$$ E[\bar X_n]=\mu_X,\qquad V(\bar X_n)=\frac{\sigma_X^2}{n},\qquad \sigma_{\bar X_n}=\frac{\sigma_X}{\sqrt n} $$

$\bar X_n$ es un estimador **insesgado** de $\mu_X$, y su desvío, el **error estándar**, cae como $1/\sqrt n$: para bajar el error a la mitad hay que **cuadruplicar** la muestra. Mientras $S_n$ se ensancha como $\sigma\sqrt n$, el promedio se angosta como $\sigma/\sqrt n$. Como $V(\bar X_n)\to0$, el promedio se concentra en $\mu_X$ (base de la LGN).

**Caso exacto:** si las $X_i$ son **normales**, $\bar X_n\sim\mathcal N(\mu_X,\sigma_X/\sqrt n)$ exactamente para todo $n$, porque una suma de normales independientes es normal; no hace falta el TCL. Si la distribución es otra o desconocida, el TCL da la misma normal como aproximación con solo conocer $\mu$ y $\sigma^2$.

**Cómo reconocerlo:** «la media de una muestra de $n$ cajas, piezas, eventos…». Se reemplaza el desvío individual por $\sigma/\sqrt n$ antes de tipificar. La **varianza muestral** $S_n^2$ se abre en la guía pero se desarrolla en la unidad 8: [[varianza-muestral|Varianza Muestral]].

Detalle: [[promedio-muestral|Promedio Muestral]]

## 5. Desigualdades de Markov y de Chebyshev

Son **cotas universales**: solo usan la esperanza o la varianza, no la forma de la distribución. Por eso valen siempre pero son **poco ajustadas**, ya que deben cubrir el peor caso posible.

$$ P(X\ge\alpha)\le\frac{E[X]}{\alpha} $$

Desigualdad de **Markov**: vale si $X$ toma solo valores **no negativos** y $\alpha>0$. Se demuestra comparando la indicadora $\mathbb 1_{\{x\ge\alpha\}}$ con la recta $x/\alpha$. El TP7 la enuncia con $|X|$: $P(|X|\ge\varepsilon)\le E[|X|]/\varepsilon$.

$$ P(|X-\mu|\ge\varepsilon)\le\frac{\sigma_X^2}{\varepsilon^2} $$

Desigualdad de **Chebyshev**: vale para toda $X$ con media $\mu$ y varianza $\sigma_X^2$ y todo $\varepsilon>0$. Se obtiene aplicando Markov a $(X-\mu)^2$ con $\alpha=\varepsilon^2$. Aplicada al promedio, con $V(\bar X_n)=\sigma_X^2/n$:

$$ P\big(|\bar X_n-\mu|\ge\varepsilon\big)\le\frac{\sigma_X^2}{n\,\varepsilon^2} $$

Es el puente directo a la LGN y la fórmula para **dimensionar tamaños de muestra**.

**Cómo reconocerlo:** «acotar», «al menos», «garantizar» o «no se conoce la distribución, solo $E$ y $V$». El intervalo pedido se reescribe como distancia a la media: $a<X<b$ con centro $\mu$ es $|X-\mu|<\varepsilon$.

> [!warn] La desigualdad se invierte al complementar
> Chebyshev acota $P(|X-\mu|\ge\varepsilon)$ por arriba. Si se pide $P(|X-\mu|<\varepsilon)$, queda $\ge 1-\sigma^2/\varepsilon^2$: el sentido cambia. Además, para $\varepsilon<\sigma$ la cota supera 1 y no dice nada.

Detalle: [[desigualdad-de-chebyshev|Desigualdades de Markov y de Chebyshev]]

## 6. Ley de los Grandes Números

Formaliza que **el promedio de muchas observaciones se acerca a la media poblacional**. Con $X_k$ i.i.d. de media $\mu$ y varianza $\sigma^2$:

$$ \lim_{n\to\infty} P\big(|\bar X_n-\mu|\ge\varepsilon\big)=0\qquad\forall\,\varepsilon>0 $$

**Ley débil** (convergencia en probabilidad). Se demuestra con Chebyshev: la cota $\sigma^2/(n\varepsilon^2)$ tiende a 0.

$$ P\!\left(\lim_{n\to\infty}\bar X_n=\mu\right)=1 $$

**Ley fuerte** (convergencia casi segura, con probabilidad 1). La fuerte implica la débil: la débil controla cada $n$ por separado, la fuerte dice que la probabilidad de que el límite difiera de $\mu$ es nula.

**Interpretación frecuentista:** si $\mathbb 1_k(A)$ indica si ocurrió $A$ en la repetición $k$, la frecuencia relativa $\hat P_n=\tfrac1n\sum_{k=1}^n\mathbb 1_k(A)$ es un promedio de i.i.d. con media $p=P(A)$, y por la ley fuerte $\hat P_n\to p$. Es la base de estimar probabilidades repitiendo experimentos. La LGN dice **adónde** va el promedio; el TCL dice **cómo fluctúa** en el camino.

**Cómo reconocerlo:** «cuántas repeticiones hacen falta para que la frecuencia relativa difiera de $p$ en menos de…». Con Chebyshev se usa $V(\hat P_n)=p(1-p)/n$ y, si $p$ es desconocida, el peor caso $p(1-p)\le\tfrac14$.

> [!warn] Discrepancia: redondeo del tamaño de muestra (TP7, ej. 16a)
> Las «Respuestas» de la guía reportan $n=3333$ (truncan $n>3333.\overline3$), mientras que la resolución paso a paso exige $n\ge3334$. El valor correcto es $3334$: el tamaño de muestra se redondea **hacia arriba**.

Detalle: [[ley-de-grandes-numeros|Ley de los Grandes Números]]

## 7. Teorema Central del Límite

El resultado central de la unidad: la suma o el promedio de muchas variables i.i.d. es **aproximadamente normal**, **sin importar** la distribución de origen, con tal de que tenga media y desvío finitos. Con $X_k$ i.i.d. de media $\mu$ y desvío $\sigma$:

$$ Z_n=\frac{\bar X_n-\mu}{\sigma/\sqrt n},\qquad \lim_{n\to\infty} P(Z_n\le z)=\Phi(z) $$

$Z_n$ es el promedio **tipificado** ($E[Z_n]=0$, $V(Z_n)=1$) y $\Phi$ es la FDA de la $\mathcal N(0,1)$, que se lee en la [[estandarizacion-y-tabla-normal|tabla de la Normal estándar]]. En la práctica, para $n$ grande:

$$ P(\bar X_n\le x)\approx\Phi\!\left(\frac{x-\mu}{\sigma/\sqrt n}\right),\qquad P(S_n\le s)\approx\Phi\!\left(\frac{s-n\mu}{\sqrt n\,\sigma}\right) $$

Es decir, $\bar X_n\approx\mathcal N(\mu,\sigma/\sqrt n)$ y $S_n\approx\mathcal N(n\mu,\sqrt n\,\sigma)$. Para la frecuencia relativa, $P(\hat P_n\le q)\approx\Phi\big((q-p)/\sqrt{p(1-p)/n}\big)$.

**Corrección por continuidad.** Si $S_n$ es **discreta** (valores enteros), cada entero $s$ se ensancha al intervalo $[s-\tfrac12,\,s+\tfrac12]$:

$$ P(S_n=s)\approx\Phi\!\left(\frac{s+\frac12-n\mu}{\sqrt n\,\sigma}\right)-\Phi\!\left(\frac{s-\frac12-n\mu}{\sqrt n\,\sigma}\right) $$

En un intervalo, los extremos **incluidos** se corren hacia afuera ($\le b$ pasa a $b+\tfrac12$, $\ge a$ pasa a $a-\tfrac12$). En la suma de Poisson del TP7 (ej. 9), con corrección se obtiene $0.259$ frente a $0.251$ exacto; sin ella, $0.219$.

**Cómo reconocerlo:** se pide una probabilidad sobre un total o un promedio de **muchas** variables i.i.d. cuya distribución exacta no se conoce o es incómoda (suma de Bernoulli, de Poisson, de exponenciales, cantidades con solo $E$ y $V$ dados). Primero se calculan $n\mu$ y $\sqrt n\,\sigma$ de la suma, luego se tipifica.

> [!warn] Discrepancia: desde qué $n$ vale la aproximación
> La página del TCL adopta la regla habitual $n>20$. En [[video-tcl|la clase en video]] el docente prefiere $n\ge50$ y aclara que ni $n=100$ alcanza siempre si la distribución de origen es muy asimétrica (por ejemplo, una binomial con $p$ muy pequeño).

Detalle: [[teorema-central-del-limite|Teorema Central del Límite]]

## 8. Aproximación normal de la binomial

Es el caso particular más usado del TCL (De Moivre–Laplace): como $\mathrm{Bin}(n,p)$ es la suma de $n$ Bernoulli i.i.d. con $\mu=p$ y $\sigma^2=pq$, para $n$ grande:

$$ \mathrm{Bin}(n,p)\approx\mathcal N\big(np,\ \sqrt{npq}\big),\qquad q=1-p $$

La derivación usa la fórmula de Stirling y el desarrollo de Taylor de $\ln(1+x)$, y muestra que la masa binomial tiende a la densidad normal evaluada en $x$. Por ser la binomial **discreta** se aplica la corrección por continuidad:

$$ P(a\le S_n\le b)\approx\Phi\!\left(\frac{b+\frac12-np}{\sqrt{npq}}\right)-\Phi\!\left(\frac{a-\frac12-np}{\sqrt{npq}}\right) $$

Vale con $a$ y $b$ **incluidos**. Con desigualdades estrictas se excluyen los extremos: por ejemplo, $70<X<90$ es $71\le X\le89$, y el intervalo continuo es $(70.5,\,89.5)$.

**Cuándo conviene:** $n$ grande y $p$ ni muy pequeño ni muy grande, para evitar sumas binomiales enormes. Si $n$ es grande pero $p\approx0$ con $np$ moderado, conviene la aproximación de [[distribucion-poisson|Poisson]].

> [!warn] Discrepancia: condición práctica
> La página de la aproximación da la regla $np\ge5$ y $nq\ge5$. La clase en video pide $np>10$ **y** $n(1-p)>10$, con el contraejemplo $\mathrm{Bin}(100,\,0.05)$: $P(C\le2)$ exacto $\approx0.1183$ frente a $\approx0.1257$ con la normal.

Detalle: [[aproximacion-normal-de-la-binomial|Aproximación Normal de la Binomial]]

## Cómo aparece en los parciales

Según el registro de [[evaluaciones|Evaluaciones]], la unidad aparece en parciales y finales como «TCL con Gamma», «Poisson (suma + TCL)», «media muestral discreta», «TCL (proporción) + tamaño muestra» y «TCL (suma + tamaño n)». Los ejercicios de la guía y de las clases que siguen practican esos mismos patrones.

- **Diferencia de dos promedios normales** (TP7, ej. 19): muestras de 10 y 15 de una $\mathcal N(20,\sqrt3)$. Cada promedio es normal exacto, $V(\bar X_{10})=3/10$ y $V(\bar Y_{15})=1/5$; la diferencia $W$ tiene media 0 y $V(W)=1/2$ (las varianzas suman aunque se reste). $P(|W|>0.3)=2\big(1-\Phi(0.3\sqrt2)\big)\approx0.6714$.
- **Componentes en standby (serie temporal): Gamma/Erlang exacto contra TCL** (TP7, ej. 7): 30 instrumentos con duración $\mathrm{Exp}(0.1)$, cada uno entra en funcionamiento cuando falla el anterior, así que la duración total es la **suma** (un sistema en serie en sentido de confiabilidad sería el **mínimo**, $\mathrm{Exp}(\sum\lambda_i)$); $T\sim\mathrm{Gamma}(30,\,0.1)$ con $E[T]=300$ y $V(T)=3000$. Exacto vía $N(310)\sim\mathrm{Poisson}(31)$: $P(T>310)=P(N\le29)\approx0.4047$. Por TCL: $1-\Phi(10/\sqrt{3000})\approx0.4276$, que es lo que reporta la guía.
- **Promedio de normales** (TP7, ej. 17b): cajas $\mathcal N(20,3)$, $n=100$; $\bar X_{100}\sim\mathcal N(20,\,0.3)$ y $P(19.7\le\bar X_{100}\le20.6)=\Phi(2)-\Phi(-1)\approx0.8185$, frente a $\approx0.1191$ para una sola caja.
- **Promedio con distribución desconocida** (clase en video): $E(M_i)=150$, $V(M_i)=500$, 104 eventos; por TCL $\bar M_{104}\approx\mathcal N(150,\sqrt{500/104})$ y $P(148\le\bar M_{104}\le153)\approx0.7335$. Basta con media y varianza.
- **Acotar con Chebyshev cuando no hay distribución** (clase en video): $E[M]=150$, $V(M)=500$; $100<M<200$ es $|M-150|<50$ y $P\ge1-500/2500=0.8$.
- **Chebyshev contra el valor real** (TP7, ej. 3): cañón con $X\sim\mathrm{Bin}(100,\,0.8)$, $E[X]=80$, $V(X)=16$. Chebyshev da $P(70<X<90)\ge0.84$; la binomial exacta da $0.98305$ y la normal con corrección $2\Phi(2.375)-1\approx0.98245$.
- **Tamaño de muestra para la frecuencia relativa** (TP7, ej. 16): con Chebyshev y el peor caso $p(1-p)\le\tfrac14$, $n>1/(4\cdot0.03\cdot0.05^2)$ da $n\ge3334$; con la aproximación normal (ej. 16b), $P(|\hat P_n-p|\ge\varepsilon)\approx2\big(1-\Phi(\varepsilon\sqrt n/\sigma)\big)$ con $\sigma\le\tfrac12$ y $\varepsilon=0.05$; pedir que sea $\le0.03$ exige $\Phi(0.1\sqrt n)\ge0.985$, es decir $0.1\sqrt n\ge z_{0.985}\approx2.17$, y $n\ge(2.17/0.1)^2=470.89$, luego alcanza $n\ge471$.
- **Dimensionar un recurso con el TCL** (TP7, ej. 5): central con 1800 usuarios y $p=1/30$; $S_{1800}\approx\mathcal N(60,\sqrt{58})$. Con corrección, $1-\Phi\big((N-59.5)/\sqrt{58}\big)\le0.01$ exige $N\ge z_{0.99}\sqrt{58}+59.5=77.217$, luego $N=78$.
- **Suma de Poisson: TCL contra exacto** (TP7, ej. 9): 50 variables $\mathrm{Poisson}(0.3)$; $S\sim\mathrm{Poisson}(15)$. TCL con corrección: $P(S\ge18)\approx1-\Phi(2.5/\sqrt{15})\approx0.2595$; exacto $\approx0.2511$.
- **Suma de binomiales y corrección por continuidad** (clase en video): $104$ variables $\mathrm{Bin}(100,\,0.05)$, $S_{104}\approx\mathcal N(520,\sqrt{494})$; $P(S_{104}\le490)$ da $0.0885$ sin corregir y $0.0922$ con $490.5$, frente a $0.0913$ exacto.

## Tabla de fórmulas de la unidad

| Qué | Fórmula | Cuándo se usa |
|---|---|---|
| Esperanza de una suma | $E[X+Y]=E[X]+E[Y]$ | Siempre |
| Varianza de una suma | $V(X+Y)=V(X)+2\,\mathrm{Cov}(X,Y)+V(Y)$ | Caso general |
| Varianza sin correlación | $V(X\pm Y)=V(X)+V(Y)$ | Independientes o $\mathrm{Cov}=0$ |
| Suma de $n$ i.i.d. | $E[S_n]=n\mu$, $V(S_n)=n\sigma^2$ | Totales |
| Convolución discreta | $p_S(s)=\sum_{y} p_X(s-y)\,p_Y(y)$ | $X,Y$ independientes discretas |
| Convolución continua | $f_S(s)=\int f_X(s-y)\,f_Y(y)\,dy$ | $X,Y$ independientes continuas |
| Normal más normal | $\mathcal N(\mu_1+\mu_2,\sqrt{\sigma_1^2+\sigma_2^2})$ | Normales independientes |
| Poisson más Poisson | $\mathrm{Poisson}(\lambda_1+\lambda_2)$ | Poisson independientes |
| Binomial más binomial | $\mathrm{Bin}(n_1+n_2,p)$ | Misma $p$ |
| Suma de exponenciales | $\mathrm{Gamma}(n,\lambda)=\mathrm{Erlang}_n(\lambda)$ | $n$ exponenciales i.i.d. |
| Densidad Gamma/Erlang | $f(t)=\dfrac{\lambda^n t^{n-1}e^{-\lambda t}}{(n-1)!}$ | Tiempo hasta la $n$-ésima ocurrencia |
| Momentos Gamma | $E=n/\lambda$, $V=n/\lambda^2$ | Gamma/Erlang |
| Dualidad Erlang–Poisson | $P(T_n>t)=P(N(t)\le n-1)$, $N(t)\sim\mathrm{Poisson}(\lambda t)$ | Valor exacto de colas de la Erlang |
| Promedio muestral | $E[\bar X_n]=\mu$, $V(\bar X_n)=\sigma^2/n$ | Media de una muestra i.i.d. |
| Markov | $P(X\ge\alpha)\le E[X]/\alpha$ | $X\ge0$, solo se conoce $E[X]$ |
| Chebyshev | $P(\lvert X-\mu\rvert\ge\varepsilon)\le\sigma^2/\varepsilon^2$ | Solo se conocen $\mu$ y $\sigma^2$ |
| Chebyshev para el promedio | $P(\lvert\bar X_n-\mu\rvert\ge\varepsilon)\le\sigma^2/(n\varepsilon^2)$ | Dimensionar $n$, demostrar la LGN |
| LGN débil | $\lim_n P(\lvert\bar X_n-\mu\rvert\ge\varepsilon)=0$ | Convergencia en probabilidad |
| LGN fuerte | $P(\lim_n \bar X_n=\mu)=1$ | Convergencia casi segura |
| TCL para el promedio | $\bar X_n\approx\mathcal N(\mu,\sigma/\sqrt n)$ | $n$ grande, cualquier distribución |
| TCL para la suma | $S_n\approx\mathcal N(n\mu,\sqrt n\,\sigma)$ | $n$ grande, cualquier distribución |
| Frecuencia relativa | $P(\hat P_n\le q)\approx\Phi\big((q-p)/\sqrt{p(1-p)/n}\big)$ | Estimar una proporción |
| Normal de la binomial | $\mathrm{Bin}(n,p)\approx\mathcal N(np,\sqrt{npq})$ | $n$ grande, $p$ moderado |
| Corrección por continuidad | $P(a\le S_n\le b)\approx\Phi\big(\tfrac{b+1/2-np}{\sqrt{npq}}\big)-\Phi\big(\tfrac{a-1/2-np}{\sqrt{npq}}\big)$ | Aproximar una binomial por la normal; para otra suma discreta, $np$ y $\sqrt{npq}$ pasan a $n\mu$ y $\sqrt n\,\sigma$ |
| Fractiles usuales | $z_{0.95}=1.6449$, $z_{0.975}=1.96$, $z_{0.985}\approx2.17$, $z_{0.99}=2.3263$ | Despejar $n$ o un umbral |

La hoja completa, con todas las sumas con nombre propio, está en [[formulario-suma-de-va|Formulario — Suma de V.A., LGN y TCL]].
