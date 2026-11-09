---
titulo: "Resumen de la Unidad 3 — Variables Aleatorias Discretas"
tipo: resumen
unidad: 3
orden: 1
hub: true
tags: [resumen, discreta, variable-aleatoria, distribucion]
resumen: "Una variable aleatoria discreta se describe con su masa $p_X(k)=P(X=k)$ o su acumulada, y se resume con $E[X]$ y $V(X)=E[X^2]-(E[X])^2$. La unidad presenta seis modelos: Bernoulli, Binomial, Geométrica, Binomial Negativa, Hipergeométrica y Poisson."
fuentes: ["[[variable-aleatoria]]", "[[funcion-de-distribucion-acumulada]]", "[[esperanza]]", "[[varianza]]", "[[funcion-generadora-de-momentos]]", "[[teoria-de-la-decision-valor-esperado]]", "[[distribucion-bernoulli]]", "[[distribucion-binomial]]", "[[distribucion-geometrica]]", "[[distribucion-binomial-negativa]]", "[[distribucion-hipergeometrica]]", "[[distribucion-poisson]]", "[[reconocer-distribucion-discreta]]", "[[formulario-va-discretas]]"]
actualizado: 2026-11-09
---

# Resumen de la Unidad 3 — Variables Aleatorias Discretas

La unidad 2 trabajó con probabilidades de **eventos**; la unidad 3 da el paso a los **números**: una variable aleatoria convierte cada resultado del experimento en un valor real, lo que permite sumar, promediar y medir dispersión. Primero se ve la maquinaria general de cualquier variable discreta (función de masa, acumulada, esperanza, varianza, función generadora de momentos) y una aplicación directa de la esperanza, la teoría de la decisión. Después se estudian los seis modelos discretos clásicos y cómo reconocer cuál corresponde a cada enunciado. La unidad 4 traslada estas mismas ideas al caso continuo, donde la masa puntual se reemplaza por una densidad.

> [!info] Lo esencial
> - Una v.a. discreta queda determinada por su masa $p_X(k)=P(X=k)$, que es no negativa y suma 1 sobre el recorrido, o por su acumulada $F_X(k)=P(X\le k)$.
> - La esperanza $E[X]=\sum k\,p_X(k)$ es lineal siempre; la varianza se calcula como $V(X)=E[X^2]-(E[X])^2$ y cumple $V(aX+c)=a^2V(X)$.
> - Bernoulli, Binomial, Geométrica y Binomial Negativa se arman con ensayos Bernoulli independientes; la Hipergeométrica es el muestreo sin reposición y la Poisson cuenta eventos raros con tasa $\lambda$.
> - La geométrica tiene dos convenciones: fracasos ($E=q/p$) o ensayos ($E=1/p$). La binomial negativa también admite las dos; la cátedra cuenta fracasos ($E=rq/p$). No hay que mezclarlas.
> - Para elegir el modelo se preguntan dos cosas: qué cuenta la variable y cómo se generan los datos (cantidad fija de ensayos o repetir hasta un éxito; con o sin reposición).

## 1. Variable aleatoria discreta y función de masa

Una **variable aleatoria (v.a.)** es una función $X:\mathcal{S}\mapsto\mathbb{R}$ que asigna un número real a cada resultado del espacio muestral; la probabilidad de cada valor se hereda del evento que le corresponde. El **recorrido** $\mathcal{R}_X$ es el conjunto de valores con probabilidad positiva, y la v.a. es **discreta** cuando ese recorrido está formado por valores separados. Se describe con la **función de masa de probabilidad (PMF)**, que vale 0 fuera del recorrido:

$$ p_X(k) = P(X=k)\ge 0, \qquad \sum_{k\in\mathcal{R}_X} p_X(k) = 1 $$

Aquí $p_X:\mathbb{R}\mapsto[0,1]$ toma un **número real** $k$ y devuelve su probabilidad puntual; la segunda igualdad es la **condición de normalización**. Los eventos $\{X=k\}$ forman una **partición** de $\mathcal{S}$, por lo que se les puede aplicar probabilidad total y Bayes.

Cómo reconocerla: cuando el enunciado define una variable que «cuenta» o «mide» algo y pide su distribución, se arma la tabla $k \mapsto p_X(k)$, muchas veces recorriendo un árbol de probabilidades (experimento por etapas). Si la PMF trae una constante desconocida $C$, se despeja con la normalización.

> [!warn] No confundir $p_X$ con $P$
> $P$ toma un **evento** (subconjunto de $\mathcal{S}$) y devuelve su probabilidad; $p_X$ toma un **número**. Se relacionan por $p_X(k)=P(X=k)$, pero son objetos distintos. El docente lo señala como lo más costoso de esta parte.

Detalle: [[variable-aleatoria|Variable Aleatoria Discreta]]

## 2. Función de distribución acumulada (FDA)

La **FDA** acumula la probabilidad desde la izquierda y es una descripción **equivalente** a la PMF. Es **monótona no decreciente**, vale 0 en $-\infty$ y 1 en $+\infty$, y es **continua a derecha**. En una v.a. discreta es **escalonada**: constante entre valores del recorrido y con un salto de altura $p_X(k)$ en cada valor $k$.

$$ F_X(k) = P(X\le k) = \sum_{\{y\in\mathcal{R}_X\,:\,y\le k\}} p_X(y) $$

$$ P(a<X\le b) = F_X(b)-F_X(a), \qquad P(X>k) = 1-F_X(k), \qquad P(X<k) = F_X(k)-p_X(k) $$

La primera define la FDA; las siguientes traducen probabilidades de intervalos a diferencias de la FDA. La PMF se recupera midiendo el salto:

$$ p_X(k) = F_X(k) - \lim_{x\to k^-} F_X(x) $$

Cómo reconocerla: el enunciado da la FDA por tramos y pide probabilidades puntuales o de intervalos, o pide construir la FDA a partir de la tabla de la PMF.

> [!warn] Cuidado con $<$ y $\le$
> En una v.a. discreta $P(X<k)$ y $P(X\le k)$ difieren exactamente en la masa puntual $p_X(k)$. Por ejemplo, con recorrido en los enteros (como en el TP3 ej. 7), $P(2<X<5)=P(3\le X\le 4)=F_X(4)-F_X(2)$, y no $F_X(5)-F_X(2)$.

Detalle: [[funcion-de-distribucion-acumulada|Función de Distribución Acumulada (FDA)]]

## 3. Esperanza

La **esperanza** o **valor esperado** $E[X]=\mu_X$ es el promedio ponderado de los valores de $X$, con pesos iguales a sus probabilidades. Se interpreta como el **promedio a largo plazo** al repetir el experimento y como el **centro de masa** de la distribución, por lo que no tiene por qué ser un valor del recorrido (un dado tiene $E[X]=3{,}5$).

$$ E[X] = \mu_X = \sum_{k\in\mathcal{R}_X} k\,p_X(k) $$

$$ E[g(X)] = \sum_{k\in\mathcal{R}_X} g(k)\,p_X(k) $$

La segunda fórmula (ley del estadístico inconsciente, según el formulario) permite calcular la esperanza de cualquier función de $X$ sin hallar su distribución; con $g(x)=x^k$ da los **momentos** $E[X^k]$. La propiedad clave es la **linealidad**, que vale aunque $X$ e $Y$ no sean independientes:

$$ E[aX+bY+c] = a\,E[X] + b\,E[Y] + c $$

con $a,b,c$ constantes. Cómo reconocerla: se pide «valor esperado», «promedio», «ganancia media»; o una variable es suma de otras más simples (por ejemplo, una suma de Bernoulli con distinto $p$, donde $E[X]=p_1+p_2$ aunque no sea binomial).

> [!warn] La esperanza no factoriza productos
> En general $E[X\cdot Y]\ne E[X]\cdot E[Y]$; factorizar requiere independencia. Además, $\mu$ es un parámetro calculado con probabilidades antes de experimentar, mientras que $\bar{x}$ es un estadístico muestral: usar $\bar{x}$ para el valor esperado es un error conceptual.

Detalle: [[esperanza|Esperanza (Valor Esperado)]]

## 4. Varianza y desvío

La **varianza** mide la dispersión alrededor de la media: es el promedio de las desviaciones al cuadrado (el cuadrado evita que las positivas y negativas se cancelen y penaliza más las grandes). El **desvío estándar** $\sigma(X)=\sqrt{V(X)}$ vuelve a las unidades de $X$.

$$ V(X) = \sigma_X^2 = E\!\left[(X-E[X])^2\right] = E[X^2] - \big(E[X]\big)^2 $$

La última expresión es la **fórmula de cálculo**, con $E[X^2]=\sum k^2\,p_X(k)$. Para constantes $a$ y $c$:

$$ V(aX+c) = a^2\,V(X), \qquad \sigma(aX+c) = |a|\,\sigma(X) $$

Un corrimiento $c$ no cambia la dispersión y $V(c)=0$. Cómo reconocerla: casi todo ejercicio de construcción de una PMF termina pidiendo $E[X]$, $V(X)$ y $\sigma_X$; se calculan en ese orden, primero $E[X]$ y $E[X^2]$.

> [!warn] La varianza no es lineal
> En general $V(X+Y)\ne V(X)+V(Y)$: sumar varianzas requiere independencia. Y el factor $a$ sale **al cuadrado**, no tal cual.

Detalle: [[varianza|Varianza y Desvío]]

## 5. Función generadora de momentos (FGM)

La **FGM** es una función auxiliar que guarda todos los momentos de $X$ en su serie de Taylor: el coeficiente de $t^k$ es $E[X^k]/k!$. Derivando $k$ veces y evaluando en $t=0$ se obtiene $E[X^k]$. Además **caracteriza** la distribución (misma FGM en un entorno de 0 implica misma distribución).

$$ M_X(t) = E\!\left[e^{tX}\right] = \sum_{k\in\mathcal{R}_X} e^{tk}\,p_X(k) $$

$$ E[X^k] = M_X^{(k)}(0), \qquad V(X) = M_X''(0) - \big(M_X'(0)\big)^2 $$

Vale para los $t$ donde la suma converge. Otras propiedades: $M_{aX+b}(t)=e^{bt}M_X(at)$ y, si $X$ e $Y$ son independientes, $M_{X+Y}(t)=M_X(t)\,M_Y(t)$; eso explica por qué la suma de $n$ Bernoulli$(p)$ independientes, todas con el mismo $p$, es Binomial$(n,p)$ y la suma de Poisson independientes es Poisson. Cómo reconocerla: el enunciado da una FGM y pide momentos, o pide identificar la distribución de una suma de independientes.

> [!nota] Herramienta complementaria
> El apunte de la cátedra calcula esperanza y varianza directamente con las sumas, sin FGM; los momentos de cada distribución también se obtienen sin ella.

Detalle: [[funcion-generadora-de-momentos|Función Generadora de Momentos (FGM)]]

## 6. Teoría de la decisión — maximizar el valor esperado

Patrón de ejercicio en el que se elige un **parámetro de decisión** $k$ (cuántas unidades comprar o producir, qué obra tomar) y la ganancia depende de $k$ y de una v.a. $X$ que **no se controla** (la demanda). El criterio es tomar la decisión que **maximiza la ganancia esperada** (o minimiza el costo esperado). La receta: (1) identificar $k$ y $X$ con su distribución; (2) escribir $G_k=g_k(X)$; (3) calcular $E[G_k]$ para cada $k$ en una tabla; (4) elegir el máximo.

$$ E[G_k] = \sum_x G_k(x)\,p_X(x), \qquad k^* = \arg\max_k E[G_k] $$

En el modelo del vendedor de diarios, con precio de venta $v$ y costo unitario $c$:

$$ G_k(X) = \begin{cases} v\,X - c\,k, & X<k \quad(\text{sobran unidades})\\ (v-c)\,k, & X\ge k \quad(\text{vende todo}) \end{cases} $$

Cómo reconocerla: aparece «cuántos debe comprar / producir para maximizar la ganancia esperada». No es una distribución nueva, es una aplicación de $E[g(X)]$. Atajo: el óptimo cae dentro del recorrido de la demanda, porque por debajo del mínimo $E[G_k]$ crece con $k$ y por encima del máximo decrece. En el TP3 ej. 11 ($v=1$, $c=0{,}40$) el óptimo es $k^*=68$, con $E[G_{68}]=40{,}10$.

Variantes del TP3: el valor de la información perfecta (ej. 9) y el cambio de criterio a la probabilidad de superar un umbral (ej. 10).

Detalle: [[teoria-de-la-decision-valor-esperado|Teoría de la Decisión — Maximización del Valor Esperado]]

## 7. Distribución Bernoulli

Un **único ensayo** con dos resultados: éxito ($X=1$, probabilidad $p$) o fracaso ($X=0$, probabilidad $q=1-p$). Es el **ladrillo** con el que se construyen la Binomial, la Geométrica y la Binomial Negativa. Se nota $X\sim\text{Bernoulli}(p)$ y equivale a $\text{Binomial}(1,p)$.

$$ p_X(1) = p, \qquad p_X(0) = q = 1-p, \qquad E[X] = p, \qquad V(X) = p\,q, \qquad M_X(t) = q+p\,e^t $$

La varianza $pq$ es máxima en $p=\tfrac12$ y nula en $p=0$ o $p=1$. Cómo reconocerla: un solo ensayo o un solo individuo, con resultado «pasa / no pasa», «defectuoso / sano». También aparece como indicadora dentro de sumas: en el TP3 ej. 8 (circuitos serie y paralelo) $X=F_I+F_{II}$ es suma de dos Bernoulli con $p$ distinto (0,99 y 0,81), así que no es binomial, pero por linealidad $E[X]=0{,}99+0{,}81=1{,}8$.

Detalle: [[distribucion-bernoulli|Distribución Bernoulli]]

## 8. Distribución Binomial

Cuenta los **éxitos en una cantidad fija $n$** de ensayos Bernoulli **independientes e idénticos** (mismo $p$). Las tres condiciones: $X$ cuenta éxitos; el experimento se repite $n$ veces idénticas; los ensayos son independientes. Es la suma de $n$ Bernoulli$(p)$ independientes. Soporte $\{0,1,\dots,n\}$.

$$ p_X(k) = \binom{n}{k}\,p^k\,q^{\,n-k}, \qquad k\in\{0,1,\dots,n\} $$

Aquí $p^k q^{n-k}$ es la probabilidad de **una** secuencia concreta con $k$ éxitos y $\binom{n}{k}$ cuenta **cuántas** secuencias así hay.

$$ E[X] = n\,p, \qquad V(X) = n\,p\,q, \qquad M_X(t) = (q+p\,e^t)^n $$

Cómo reconocerla: «cuántos de los $n$…», muestreo **con reposición** o de una población tan grande que la reposición no importa (por ejemplo, «de un lote muy grande»). Las preguntas típicas son $P(X=k)$, $P(X\le k)$ sumando términos y $P(X\ge 1)=1-q^n$.

Detalle: [[distribucion-binomial|Distribución Binomial]]

## 9. Distribución Geométrica

Repite un ensayo Bernoulli **hasta el primer éxito**. En la convención por defecto del wiki, $X$ cuenta los **fracasos** antes del primer éxito, con soporte $\mathbb{N}_0=\{0,1,2,\dots\}$.

$$ p_X(k) = q^{\,k}\,p, \quad k\in\mathbb{N}_0, \qquad E[X] = \frac{q}{p}, \qquad V(X) = \frac{q}{p^2}, \qquad P(X\ge m) = q^{\,m}, \qquad M_X(t) = \frac{p}{1-q\,e^t}\;\;(t<-\ln q) $$

La cola $P(X\ge m)=q^m$ dice que hubo al menos $m$ fracasos seguidos. La geométrica es la **única distribución discreta sin memoria**: haber esperado ya $L$ fracasos no cambia lo que falta.

$$ P(X\ge L+\Delta \mid X\ge L) = P(X\ge \Delta), \qquad L,\Delta\in\mathbb{N}_0 $$

Se verifica con la cola: $\dfrac{P(X\ge L+\Delta)}{P(X\ge L)}=\dfrac{q^{\,L+\Delta}}{q^{\,L}}=q^{\,\Delta}$, que no depende de $L$.

> [!warn] Dos convenciones: fracasos o ensayos
> Si se cuentan los **ensayos** hasta el primer éxito (incluido el del éxito), como en las slides de Pantazis (ejemplo del casino), la variable es $Y=X+1$, con soporte $\mathbb{N}=\{1,2,\dots\}$, $p_Y(k)=q^{k-1}p$, $E[Y]=1/p$, $E[Y^2]=(1+q)/p^2$ y $V(Y)=q/p^2$. La varianza coincide; la esperanza difiere en 1. Regla práctica de las páginas: «cuántos intentos / apuestas / personas se eligen» suele ser la versión de ensayos; «cuántos fracasos / fallas previas», la de fracasos.

$$ Y = X + 1 \;\Rightarrow\; E[Y] = \frac{q}{p} + 1 = \frac{1}{p}, \qquad V(Y) = V(X) = \frac{q}{p^2} $$

Cómo reconocerla: «hasta que ocurra por primera vez». En el TP3 ej. 40a ($p=0{,}05$) el número medio de personas sanas antes de la primera con talasemia es $q/p=19$, y «las 12 primeras sanas» es $P(X\ge 12)=0{,}95^{12}\approx 0{,}54$.

Detalle: [[distribucion-geometrica|Distribución Geométrica]]

## 10. Distribución Binomial Negativa (Pascal)

Generaliza la geométrica: cuenta los **fracasos antes del $r$-ésimo éxito**. Es la suma de $r$ geométricas independientes, por eso su media y su varianza son $r$ veces las de una geométrica; el caso $r=1$ es la geométrica. Soporte $\mathbb{N}_0$.

$$ p_X(k) = \binom{k+r-1}{k}\,q^{\,k}\,p^{\,r}, \qquad k\in\mathbb{N}_0 $$

El combinatorio es $\binom{k+r-1}{k}$ y no $\binom{k+r}{k}$ porque el último ensayo está obligado a ser el $r$-ésimo éxito: solo se reparten los $k$ fracasos y los $r-1$ éxitos previos.

$$ E[X] = \frac{r\,q}{p}, \qquad V(X) = \frac{r\,q}{p^2}, \qquad M_X(t) = \left(\frac{p}{1-q\,e^t}\right)^{r} $$

Es «complementaria» a la binomial: la binomial fija los ensayos y cuenta éxitos; la binomial negativa fija los éxitos y cuenta fracasos. Esto permite pasar de una a otra: en el TP3 ej. 40b, «entre las 36 primeras no hay 3 con talasemia» equivale a «a lo sumo 2 éxitos en 36 ensayos», que se calcula con la Binomial$(36;\,0{,}05)$ y da $\approx 0{,}7321$.

> [!warn] Misma doble convención que la geométrica
> La cátedra cuenta **fracasos**; otros textos cuentan el número total de ensayos hasta el $r$-ésimo éxito. No mezclar las versiones.

Cómo reconocerla: «hasta acumular $r$ éxitos», «hasta que aparezca el tercero…».

Detalle: [[distribucion-binomial-negativa|Distribución Binomial Negativa (Pascal)]]

## 11. Distribución Hipergeométrica

Es la «binomial **sin reposición**»: cuenta los individuos del tipo especial en una muestra de tamaño $n$ extraída sin devolver de una población **finita** de $N$ individuos, de los cuales $M$ son especiales. Las extracciones **no** son independientes y la probabilidad de éxito cambia en cada paso. Soporte: de $\max\{0,\,n-(N-M)\}$ a $\min\{n,\,M\}$.

$$ p_X(k) = \frac{\dbinom{M}{k}\dbinom{N-M}{n-k}}{\dbinom{N}{n}} $$

Hay $\binom{N}{n}$ muestras equiprobables; las favorables eligen $k$ de los $M$ especiales y $n-k$ de los $N-M$ restantes. Con $p=M/N$:

$$ E[X] = n\,p, \qquad V(X) = n\,p\,q\,\frac{N-n}{N-1} $$

El **factor de corrección por población finita** $\frac{N-n}{N-1}$ hace que la varianza sea **menor** que la de una binomial con los mismos $n$ y $p$; la media coincide. Si $N\gg n$ (y $M,\,N-M\gg n$), la hipergeométrica se aproxima por la Binomial$(n,\,M/N)$. La misma idea reaparece en inferencia (Unidad 8): en el intervalo de confianza de una proporción con población finita, la guía (TP8 ej. 24) escribe la semiamplitud como $z\sqrt{\hat p(1-\hat p)}\sqrt{(N-n)/(N\,n)}$, es decir, el error estándar $\sqrt{\hat p(1-\hat p)/n}$ multiplicado por $\sqrt{(N-n)/N}$. Ese factor usa $N$ en el denominador en lugar de $N-1$; para $N$ grande ambos son prácticamente iguales.

Cómo reconocerla: «muestra sin reemplazo» de un total pequeño y conocido ($N$ y $M$ dados, no solo una proporción): cartas, urnas sin devolución, defectuosos de un lote pequeño. En el TP3 ej. 4 ($N=10$, $M=2$, $n=3$) se obtiene $E[X]=0{,}6$ y $V(X)\approx 0{,}373$; con reposición sería binomial, con la misma media y $V=0{,}48$.

Detalle: [[distribucion-hipergeometrica|Distribución Hipergeométrica]]

## 12. Distribución Poisson

Cuenta el número de ocurrencias de un evento **raro** en un intervalo (de tiempo, espacio, etc.) cuando ocurren a una **tasa media constante** $\lambda>0$. Su sello es que **media y varianza coinciden**. Soporte $\mathbb{N}_0$.

$$ p_X(k) = \frac{\lambda^k}{k!}\,e^{-\lambda}, \qquad E[X] = V(X) = \lambda, \qquad M_X(t) = e^{\lambda(e^t-1)} $$

La suma de Poisson independientes es Poisson, con $\lambda_1+\lambda_2$. Además, es el **límite de la binomial**: con $n$ grande y $p$ pequeño se usa $\lambda=np$.

$$ \binom{n}{k}p^k(1-p)^{\,n-k} \;\approx\; \frac{(np)^k}{k!}\,e^{-np} $$

La aproximación se apoya en un límite formal: si $n\,p_n\to\lambda>0$, para todo $k\in\mathbb{N}_0$

$$ \lim_{n\to\infty}\binom{n}{k}p_n^{\,k}(1-p_n)^{\,n-k} = \frac{\lambda^k}{k!}\,e^{-\lambda} $$

La regla práctica de la cátedra es $n>100$ y $p<0{,}01$, pero la condición esencial es que **$p$ sea pequeño**: la varianza binomial $npq$ coincide con la de Poisson $np$ solo si $q\approx 1$. La aproximación también evita factoriales gigantes en la calculadora.

Cómo reconocerla: «número medio de… por hora / km / página», o una binomial con muchos ensayos y probabilidad muy pequeña (TP3 ej. 34: $n=500$, $p=0{,}002$, $\lambda=1$, $P(X\ge 1)=1-e^{-1}\approx 0{,}632$).

> [!warn] Discrepancia: condición sobre $\lambda$
> La página de Poisson dice que la cátedra recomienda trabajar con $\lambda=np$ **pequeño**, mientras que el formulario habla de $\lambda=np$ **moderado**. Ambas piden $n$ grande y $p$ pequeño; solo la página de Poisson precisa que lo determinante es que $p$ sea pequeño.

Detalle: [[distribucion-poisson|Distribución Poisson]]

## 13. Reconocer qué distribución discreta usar

El modelo se elige con dos preguntas: **qué cuenta la variable** y **cómo se generan los datos**. El árbol de decisión:

1. ¿Un solo ensayo éxito/fracaso? → Bernoulli$(p)$.
2. ¿Cantidad fija $n$ de ensayos, se cuentan éxitos? Con reposición o población grande → Binomial$(n,p)$; sin reposición y población finita → Hipergeométrica$(N,M,n)$.
3. ¿Se repite hasta el primer éxito? → Geométrica$(p)$.
4. ¿Se repite hasta el $r$-ésimo éxito? → BinNeg$(r,p)$.
5. ¿Ocurrencias en un intervalo con tasa media $\lambda$? → Poisson$(\lambda)$.

Las dos aproximaciones que simplifican cuentas son:

$$ \text{Hipergeométrica}(N,M,n) \approx \text{Binomial}\!\left(n,\tfrac{M}{N}\right) \text{ si } N\gg n; \qquad \text{Binomial}(n,p) \approx \text{Poisson}(np) \text{ si } n \text{ grande y } p \text{ pequeño} $$

> [!warn] Cuando ninguna estructura conocida aplica
> Que cada rama condicional tenga un modelo conocido no implica que la variable total lo tenga. Si una moneda decide si se extrae con o sin reposición, $X$ es binomial dado ceca e hipergeométrica dado cara, pero la $X$ incondicional no es ninguna de las dos: hay que calcular $P(X=k)$ desde cero con probabilidad total.

> [!warn] Discrepancia: ¿qué convención usa la cátedra?
> La página de reconocimiento afirma que en la materia la geométrica y la binomial negativa cuentan **fracasos** (media $q/p$, no $1/p$). La página de la geométrica precisa que **ambas** convenciones son usadas por la cátedra: fracasos en el apunte y el TP3, ensayos en las slides de Pantazis. Conviene leer el enunciado y decidir qué se cuenta.

Detalle: [[reconocer-distribucion-discreta|Reconocer qué distribución discreta usar]]

## Cómo aparece en los parciales

Los patrones que se repiten en los ejercicios resueltos de las páginas de la unidad:

- **Construir una PMF por etapas.** Un experimento con pruebas sucesivas (controladoras que se reprocesan, TP3 ej. 5) se resuelve con un árbol: probabilidades condicionales → tabla de $p_X$ → $E[X]$, $E[X^2]$, $V(X)$, $\sigma_X$. Hay que leer bien el recorrido (allí se reprocesa a lo sumo 2 veces).
- **Hallar una constante por normalización.** La PMF viene con una constante $C$ (TP3 ej. 2, $p_D(r)=C\,2^r/r!$): se impone $\sum p_D(r)=1$ y luego se calculan $E$ y $V$.
- **Leer una FDA escalonada.** Se da $F_X$ por tramos (TP3 ej. 7) y se piden $p_X(k)$ como salto, $P(X>k)$ y probabilidades de intervalos cuidando $<$ y $\le$.
- **Suma de Bernoulli no idénticas.** Circuitos serie y paralelo (TP3 ej. 8): cada circuito es una Bernoulli con su propio $p$; la PMF se arma a mano y la esperanza sale por linealidad.
- **Maximizar la ganancia esperada.** Vendedor de diarios (TP3 ej. 11) y variantes (ej. 9 y 10): escribir $G_k(X)$ por casos, tabular $E[G_k]$ y elegir el máximo.
- **Identificar el modelo y aplicar la fórmula.** Fusibles de un lote grande → Binomial (TP3 ej. 21); muestra sin reemplazo de 3 de 10 → Hipergeométrica, comparando con la versión con reposición (TP3 ej. 4); talasemia → Geométrica y Binomial Negativa (TP3 ej. 40); artículos deteriorados con $n$ grande y $p$ pequeño → Poisson (TP3 ej. 34).
- **Falta de memoria.** «Si ya vio 10 sin el error, ¿probabilidad de ver 10 más?» (TP3 ej. 41): la respuesta es la misma que partiendo de cero.
- **Tamaño mínimo de muestra.** «¿Cuántos ensayos hacen falta para acertar al menos una vez con probabilidad $\ge 0{,}9$?» (TP3 ej. 32): se plantea $P(X_n=0)\le 0{,}1$ con la binomial exacta, $n\ge -1/\log_{10}(1-p)$, o con Poisson, $n\ge -\ln(0{,}1)/p$; con $p=0{,}01$ dan 230 y 231.
- **Pasar de BinNeg a Binomial.** «No hay 3 éxitos en los primeros 36» se reescribe como «a lo sumo 2 éxitos en 36» (TP3 ej. 40b).
- **Con o sin reposición, en símbolos.** En el [[parcialito-tp3y4|parcialito de TP3 y TP4]] el ejercicio discreto viene con enunciado simbólico ($M$, $m$, $N$) y la respuesta es una fórmula. El eje es el muestreo: sin reposición se condiciona extracción por extracción o se usa la Hipergeométrica; con reposición las extracciones son independientes y aparece la Binomial (comisiones C y E: $\mathrm{Bi}(7;p)$ frente a $\mathcal{H}(N+M;M;4)$).

## Tabla de fórmulas de la unidad

| Qué | Fórmula | Cuándo se usa |
|---|---|---|
| PMF y normalización | $p_X(k)=P(X=k)\ge 0$, $\sum_k p_X(k)=1$ | Describir la v.a.; despejar constantes |
| FDA | $F_X(k)=P(X\le k)$ | Probabilidades acumuladas |
| Intervalos con la FDA | $P(a<X\le b)=F_X(b)-F_X(a)$ | Probabilidad de un rango |
| Cola | $P(X>k)=1-F_X(k)$ | «Más de $k$» |
| Estricta | $P(X<k)=F_X(k)-p_X(k)$ | Desigualdad estricta en discretas |
| PMF desde la FDA | $p_X(k)=F_X(k)-\lim_{x\to k^-}F_X(x)$ | Altura del salto |
| Esperanza | $E[X]=\sum_k k\,p_X(k)$ | Promedio a largo plazo |
| Esperanza de una función | $E[g(X)]=\sum_k g(k)\,p_X(k)$ | Momentos, ganancias $G_k$ |
| Linealidad | $E[aX+bY+c]=aE[X]+bE[Y]+c$ | Sumas de variables, aun dependientes |
| Varianza | $V(X)=E[X^2]-(E[X])^2$ | Dispersión |
| Transformación afín | $V(aX+c)=a^2V(X)$, $\sigma(aX+c)=\lvert a\rvert\sigma(X)$ | Cambios de escala y corrimientos |
| FGM | $M_X(t)=E[e^{tX}]$ | Momentos; sumas de independientes |
| Momentos vía FGM | $E[X^k]=M_X^{(k)}(0)$ | Derivar y evaluar en 0 |
| Decisión | $k^*=\arg\max_k E[G_k]$ | Elegir cuánto producir o comprar |
| Bernoulli$(p)$ | $p_X(1)=p$; $E=p$; $V=pq$; $M=q+pe^t$ | Un solo ensayo |
| Binomial$(n,p)$ | $\binom{n}{k}p^kq^{n-k}$; $E=np$; $V=npq$; $M=(q+pe^t)^n$ | $n$ fijo, con reposición |
| Geométrica, fracasos | $q^kp$, $k\in\mathbb{N}_0$; $E=q/p$; $V=q/p^2$; $M=\frac{p}{1-qe^t}$ | Fracasos antes del primer éxito |
| Geométrica, ensayos | $q^{k-1}p$, $k\in\mathbb{N}$; $E=1/p$; $V=q/p^2$ | Ensayos hasta el primer éxito |
| Cola geométrica (fracasos) | $P(X\ge m)=q^m$ | «Los $m$ primeros fracasan» |
| Falta de memoria (fracasos) | $P(X\ge L+\Delta\mid X\ge L)=P(X\ge\Delta)=q^{\Delta}$, $L,\Delta\in\mathbb{N}_0$ | Condicionar a lo ya esperado |
| BinNeg$(r,p)$ | $\binom{k+r-1}{k}q^kp^r$; $E=rq/p$; $V=rq/p^2$; $M=\left(\frac{p}{1-qe^t}\right)^r$ | Fracasos antes del $r$-ésimo éxito |
| Hipergeométrica$(N,M,n)$ | $\binom{M}{k}\binom{N-M}{n-k}/\binom{N}{n}$; $E=nM/N$ | Sin reposición, población finita |
| Varianza hipergeométrica | $V=npq\,\frac{N-n}{N-1}$, con $p=M/N$, $q=1-p$ | Corrección por población finita |
| Poisson$(\lambda)$ | $\frac{\lambda^k}{k!}e^{-\lambda}$; $E=V=\lambda$; $M=e^{\lambda(e^t-1)}$ | Eventos raros con tasa $\lambda$ |
| Aproximación de Poisson | $\binom{n}{k}p^kq^{n-k}\approx\frac{(np)^k}{k!}e^{-np}$ | $n$ grande, $p$ pequeño |
| Tamaño mínimo (binomial) | $n\ge -1/\log_{10}(1-p)$ | Al menos un éxito con prob. $\ge 0{,}9$ |
| Tamaño mínimo (Poisson) | $n\ge -\ln(0{,}1)/p$ | Ídem, vía aproximación |

La hoja completa, con los momentos vía FGM y las dos convenciones lado a lado, está en el [[formulario-va-discretas|Formulario — Variables Aleatorias Discretas]]; la tabla con la FGM de cada distribución está en el [[formulario-maestro|formulario maestro]].
