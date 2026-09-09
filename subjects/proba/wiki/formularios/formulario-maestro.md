---
titulo: Formulario Maestro
resumen: "Hoja integral de toda la materia, con las variables aleatorias como eje: probabilidad y combinatoria, discretas y continuas con sus tablas, bidimensionales, procesos estocásticos, suma de variables, inferencia y pruebas de hipótesis."
tipo: formulario
orden: 1
tags: [formulario, cheat-sheet, maestro, resumen, variable-aleatoria]
fuentes: ["[[variable-aleatoria]]", "[[variable-aleatoria-continua]]", "[[variables-aleatorias-bidimensionales]]", "[[distribucion-normal]]", "[[covarianza-y-correlacion]]", "[[teorema-central-del-limite]]"]
actualizado: 2026-09-04
---

# Formulario Maestro

## Contenido

1. U1 · [[#U1 · Estadística descriptiva|Estadística descriptiva]]
2. U2 · [[#U2 · Probabilidad — axiomas, condicional, Bayes, combinatoria|Probabilidad — axiomas, condicional, Bayes, combinatoria]]
3. U3 · [[#U3 · Variable aleatoria discreta (V.A.D.)|Variable aleatoria discreta (V.A.D.)]]
4. U3 · [[#U3 · Distribuciones discretas (tabla)|Distribuciones discretas (tabla)]]
5. U4 · [[#U4 · Variable aleatoria continua (V.A.C.)|Variable aleatoria continua (V.A.C.)]]
6. U4 · [[#U4 · Distribuciones continuas (tabla)|Distribuciones continuas (tabla)]]
7. U4 · [[#U4 · Normal estándar y estandarización|Normal estándar y estandarización]]
8. U5 · [[#U5 · Función de variable aleatoria Y=g(X)|Función de variable aleatoria Y=g(X)]]
9. U5 · [[#U5 · Variables bidimensionales (conjuntas)|Variables bidimensionales (conjuntas)]]
10. U5 · [[#U5 · Covarianza, correlación e independencia|Covarianza, correlación e independencia]]
11. U6 · [[#U6 · Procesos estocásticos (Bernoulli, Poisson, Markov)|Procesos estocásticos (Bernoulli, Poisson, Markov)]]
12. U7 · [[#U7 · Suma de v.a., desigualdades, LGN y TCL|Suma de v.a., desigualdades, LGN y TCL]]
13. U8 · [[#U8 · Inferencia: estimación e intervalos|Inferencia: estimación e intervalos]]
14. U9 · [[#U9 · Pruebas de hipótesis|Pruebas de hipótesis]]

> [!info] Convenciones
> $E[X]$ esperanza · $V(X)=\sigma_X^2$ varianza · $\mathcal{R}_X$ recorrido/soporte ·
> $q=1-p$. **V.A.D.**: PMF $p_X(k)=P(X=k)$. **V.A.C.**: densidad $f_X(x)$.
> FDA $F_X(x)=P(X\le x)$. FGM $M_X(t)=E[e^{tX}]$. **Normal por el desvío**:
> $N(\mu,\sigma)$ con $V(X)=\sigma^2$. **Exponencial por la tasa**:
> $\text{Expo}(\lambda)$, $E[X]=1/\lambda$. Geométrica y binomial negativa cuentan
> **fracasos** hasta el éxito.

## U1 · Estadística descriptiva

Resumen de una muestra $\{x_i\}_{i=1}^n$: centro, dispersión, forma y posición, **sin** inferir sobre la población. Hub: [[estadistica-descriptiva|Estadística descriptiva]].

### Tendencia central

| Medida | Fórmula (sin agrupar) | Nota |
|---|---|---|
| Media | $\bar x = \dfrac{1}{n}\sum_{i=1}^n x_i$ | sensible a outliers |
| Mediana $q_2$ | $n$ impar: obs. central pos. $\frac{n+1}{2}$; $n$ par: promedio de pos. $\frac{n}{2}$ y $\frac{n}{2}+1$ (muestra ordenada) | **robusta** |
| Moda | valor de frecuencia máxima (puede ser multimodal) | — |

Detalle: [[medidas-de-tendencia-central|tendencia central]].

### Dispersión

| Medida | Fórmula | Nota |
|---|---|---|
| Rango | $R = \lvert\max_i x_i - \min_i x_i\rvert$ | 2 extremos, muy sensible |
| Varianza muestral | $\;s^2 = \dfrac{1}{n-1}\displaystyle\sum_{i=1}^n (x_i-\bar x)^2\;$ | denominador $n-1$ |
| Desvío | $s = \sqrt{s^2}$ | misma unidad que los datos |
| Desvío abs. medio | $w = \dfrac{1}{n}\sum_{i=1}^n \lvert x_i-\bar x\rvert$ | — |
| MAD | $\text{MAD} = \operatorname{mediana}\{\lvert x_i-\bar x\rvert\}$ | **robusta** |
| IQR | $\text{IQR} = q_3 - q_1$ | 50% central, robusto |

$$ s^2 = \frac{1}{n-1}\sum_{i=1}^n (x_i-\bar x)^2 \qquad s=\sqrt{s^2} $$

Detalle: [[medidas-de-dispersion|dispersión]].

### Cuartiles y percentiles
Muestra ordenada $\tilde x_1 \le \dots \le \tilde x_n$. El $j$-ésimo cuartil $q_j\in[\tilde x_k,\tilde x_{k+1}]$ cumple
$$ \frac{k}{n} \le j\cdot 0{,}25 < \frac{k+1}{n}. $$
- $q_1$: 25% a izquierda · $q_2 = $ mediana (50%) · $q_3$: 75% a izquierda.
- Deciles parten en 10, percentiles en 100. Detalle: [[cuartiles-y-percentiles|cuartiles y percentiles]].

### Forma (asimetría y curtosis muestral)
$$ \gamma = \frac{1}{n s^3}\sum_{i=1}^n (x_i-\bar x)^3 \qquad
   \kappa = \frac{1}{n s^4}\sum_{i=1}^n (x_i-\bar x)^4 - 3 $$
$\gamma$: signo del sesgo · $\kappa$: exceso de curtosis (Normal $\Rightarrow \kappa=0$). Ver [[asimetria-y-curtosis|asimetría y curtosis]].

### Datos agrupados
Tabla de frecuencias por intervalos $[L_i,L_{s,i})$; marca de clase $x_i=\dfrac{L_i+L_{s,i}}{2}$ como representante. Con $n=\sum f_i$, $L$ intervalos (todo **aproximado**):

| Medida | Fórmula ponderada |
|---|---|
| Media | $\bar x_{Ag} = \dfrac{1}{n}\sum_{i=1}^L x_i\, f_i$ |
| Desvío | $s_{Ag} = \sqrt{\dfrac{1}{n-1}\sum_{i=1}^L (x_i-\bar x_{Ag})^2\, f_i}$ |
| Asimetría | $\gamma_{Ag} = \dfrac{1}{n\,s_{Ag}^3}\sum (x_i-\bar x_{Ag})^3 f_i$ |
| Curtosis | $\kappa_{Ag} = \dfrac{1}{n\,s_{Ag}^4}\sum (x_i-\bar x_{Ag})^4 f_i - 3$ |

**Mediana / cuartiles por interpolación lineal** sobre la frecuencia acumulada $F_i$ (localizar el intervalo que acumula la fracción $\alpha n$, ancho $L_{s}-L_{I}$, $F_{\text{ant}}$ acumulada previa):
$$ q = L_I + \frac{\alpha n - F_{\text{ant}}}{F - F_{\text{ant}}}\,(L_{s}-L_I), \qquad \text{mediana: }\alpha=0{,}5. $$

**Moda agrupada** (intervalo modal de frecuencia $f_M$, entre $L_I,L_D$; vecinas $f_I,f_D$): punto medio $M=\frac{L_I+L_D}{2}$, o interpolación
$$ M = \frac{L_D(f_M-f_I) + L_I(f_M-f_D)}{(f_M-f_I)+(f_M-f_D)}. $$

Detalle y ejemplos: [[datos-agrupados|datos agrupados]], [[tecnica-datos-agrupados-interpolacion|interpolación]].

### Boxplot y outliers de Tukey
Caja de $q_1$ a $q_3$ (línea en $q_2$), $\text{IQR}=q_3-q_1$. Cercas:
$$ [\,q_1 - 1{,}5\,\text{IQR}\;,\;\; q_3 + 1{,}5\,\text{IQR}\,]. $$
Todo dato fuera de ese rango es **outlier**. Ver [[boxplot|boxplot]].

## U2 · Probabilidad — axiomas, condicional, Bayes, combinatoria

Espacio de probabilidad $(S,\Sigma,P)$. Ver [[axiomas-de-probabilidad|axiomas de Kolmogorov]], [[probabilidad-condicional|condicional]], [[probabilidad-total-y-bayes|total y Bayes]], [[independencia|independencia]].

### Axiomas de Kolmogorov

$$ P(A)\ge 0 \qquad P(S)=1 \qquad P\!\left(\bigcup_{i=1}^{\infty}E_i\right)=\sum_{i=1}^{\infty}P(E_i)\ \ (E_i\ \text{m.e.}) $$

### Consecuencias

| Propiedad | Fórmula |
|---|---|
| Complemento | $P(A^c)=1-P(A)$ |
| Suceso imposible | $P(\emptyset)=0$ |
| Monotonía | $A\subseteq B\Rightarrow P(A)\le P(B)$ |
| Unión (incl.–excl. 2) | $P(A\cup B)=P(A)+P(B)-P(A\cap B)$ |
| Unión m.e. | $P(A\cup B)=P(A)+P(B)$ |

Inclusión-exclusión (3 eventos):
$$ P(A\cup B\cup C)=P(A)+P(B)+P(C)-P(A\cap B)-P(A\cap C)-P(B\cap C)+P(A\cap B\cap C). $$

### [[leyes-de-de-morgan|Leyes de De Morgan]]

$$ \overline{C\cup D}=\overline{C}\cap\overline{D} \qquad \overline{C\cap D}=\overline{C}\cup\overline{D} \qquad \overline{\bigcup_i A_i}=\bigcap_i\overline{A_i} \qquad \overline{\bigcap_i A_i}=\bigcup_i\overline{A_i} $$

$$ P(\overline{C}\cap\overline{D})=1-P(C\cup D) \qquad P(\overline{C}\cup\overline{D})=1-P(C\cap D) $$

> "Ninguno de varios" → pasar al complemento de la unión $1-P(A_1\cup\cdots\cup A_n)$.

### [[regla-de-laplace|Regla de Laplace]]

Solo si $S$ **finito** y resultados **equiprobables**:
$$ P(A)=\frac{\text{casos favorables}}{\text{casos posibles}}=\frac{|A|}{|S|}. $$

### [[tecnica-conteo-combinatoria|Combinatoria]]

**Suma** (disjuntos): $\left|\bigcup_i A_i\right|=\sum_i|A_i|$. **Producto** (etapas): $\left|A_1\times\cdots\times A_n\right|=\prod_i|A_i|$. **Permutaciones** de $n$: $n!$.

Elegir $r$ de $n$ (las 4 formas):

| | **Importa el orden** | **No importa el orden** |
|---|---|---|
| **Sin repetición** | $\dfrac{n!}{(n-r)!}$ (variaciones) | $\dbinom{n}{r}=\dfrac{n!}{r!\,(n-r)!}$ (combinaciones) |
| **Con repetición** | $n^{r}$ | $\dbinom{n+r-1}{r}$ |

Identidades: $\dbinom{n}{r}=\dbinom{n}{n-r}$; $\dbinom{n+1}{r}=\dbinom{n}{r}+\dbinom{n}{r-1}$ (Pascal); $\displaystyle\sum_{k=0}^{n}\binom{n}{k}=2^{n}$; $\displaystyle(x+y)^n=\sum_{k=0}^{n}\binom{n}{k}x^k y^{n-k}$.

> "y / luego" → producto; "o" (excluyentes) → suma; "al menos uno / ninguno" → complemento; ¿importa el orden? / ¿repone? → celda de la tabla.

### [[probabilidad-condicional|Probabilidad condicional]]

$$ P(D\mid C)=\frac{P(D\cap C)}{P(C)}\quad (P(C)\neq 0) $$

Regla del producto:
$$ P(D\cap C)=P(D\mid C)\,P(C) $$

### [[independencia|Independencia]]

$$ A,B\ \text{indep.}\iff P(A\cap B)=P(A)\,P(B) \qquad (P(C)\neq 0)\!:\ C,D\ \text{indep.}\iff P(D\mid C)=P(D) $$
Colección: $P\!\left(\bigcap_k A_k\right)=\prod_k P(A_k)$.

> ⚠️ M.e. $\neq$ independientes: si $A,B$ son m.e. con prob. positiva, **no** son independientes.

### [[probabilidad-total-y-bayes|Probabilidad total y Bayes]]

$\{A_k\}$ **partición** de $S$: m.e. ($A_k\cap A_j=\emptyset$) y cubren ($S=\bigcup_k A_k$). Caso simple: $\{A,A^c\}$.

**Probabilidad total:**
$$ P(B)=\sum_k P(B\cap A_k)=\sum_k P(B\mid A_k)\,P(A_k). $$

**Teorema de Bayes** (a priori $P(A_i)$ → a posteriori $P(A_i\mid B)$):
$$ P(A_i\mid B)=\frac{P(B\mid A_i)\,P(A_i)}{\sum_k P(B\mid A_k)\,P(A_k)}. $$

## U3 · Variable aleatoria discreta (V.A.D.)

Una [[variable-aleatoria|v.a.]] $X:\mathcal{S}\mapsto\mathbb{R}$ es **discreta** cuando su recorrido $\mathcal{R}_X$ es contable (valores separados). Se describe con su PMF o —equivalentemente— con su FDA, y se resume con [[esperanza|$E[X]$]] y [[varianza|$V(X)$]].

### Objetos que describen la V.A.D.

| Objeto | Definición | Propiedad clave |
|---|---|---|
| PMF $p_X(k)$ | $p_X(k)=P(X=k)$ | $\displaystyle\sum_{k\in\mathcal{R}_X}p_X(k)=1$; vale $0$ fuera de $\mathcal{R}_X$ |
| [[funcion-de-distribucion-acumulada\|FDA $F_X(k)$]] | $F_X(k)=P(X\le k)=\displaystyle\sum_{y\le k}p_X(y)$ | escalonada; salto en $k$ de altura $p_X(k)$ |
| [[esperanza\|Esperanza $E[X]$]] | $E[X]=\mu_X=\displaystyle\sum_{k}k\,p_X(k)$ | centro de masa |
| [[varianza\|Varianza $V(X)$]] | $V(X)=\sigma_X^2=E[X^2]-\big(E[X]\big)^2$ | dispersión; $\sigma_X=\sqrt{V(X)}$ |
| [[funcion-generadora-de-momentos\|FGM $M_X(t)$]] | $M_X(t)=E[e^{tX}]=\displaystyle\sum_k e^{tk}p_X(k)$ | genera momentos y caracteriza |

### PMF y FDA

$$ p_X(k)=P(X=k),\qquad \sum_{k\in\mathcal{R}_X}p_X(k)=1,\qquad F_X(k)=P(X\le k)=\!\!\sum_{y\in\mathcal{R}_X,\,y\le k}\!\!p_X(y) $$

**FDA — propiedades:** monótona no decreciente; continua a derecha (en V.A.D. **no** a izquierda); $\displaystyle\lim_{k\to-\infty}F_X=0$, $\displaystyle\lim_{k\to+\infty}F_X=1$. Forma **escalonada**: constante entre valores del recorrido, salta $p_X(k)$ en cada $k$.

**Recuperar la PMF y probabilidades de intervalos** (ver [[funcion-de-distribucion-acumulada|FDA]]):

$$ p_X(k)=F_X(k)-\lim_{x\to k^-}F_X(x),\qquad P(X<k)=F_X(k)-p_X(k) $$
$$ P(a<X\le b)=F_X(b)-F_X(a),\qquad P(X>k)=1-F_X(k) $$

> En V.A.D. la diferencia $<$ vs $\le$ **importa**: se distinguen en la masa puntual $p_X(k)$.

### Esperanza

$$ E[X]=\mu_X=\sum_{k\in\mathcal{R}_X}k\,p_X(k) $$

**Ley del estadístico inconsciente** ($E$ de una función, sin hallar la PMF de $g(X)$):

$$ E[g(X)]=\sum_{k\in\mathcal{R}_X}g(k)\,p_X(k) $$

**Linealidad** ($a,b,c$ constantes; $X,Y$ v.a., vale aunque **no** sean [[independencia|independientes]]):

$$ E[c]=c,\qquad E[aX+b]=a\,E[X]+b,\qquad E[aX+bY+c]=a\,E[X]+b\,E[Y]+c $$

> ⚠️ En general $E[XY]\ne E[X]\,E[Y]$ (la igualdad requiere [[independencia|independencia]]).

### Varianza y momentos

$$ V(X)=\sigma_X^2=E\!\big[(X-\mu_X)^2\big]=E[X^2]-\big(E[X]\big)^2,\qquad E[X^2]=\sum_{k}k^2\,p_X(k) $$

**Propiedades** ($a,c$ constantes):

$$ V(c)=0,\qquad V(aX+c)=a^2\,V(X)\;\Rightarrow\;\sigma(aX+c)=|a|\,\sigma(X) $$

> ⚠️ En general $V(X+Y)\ne V(X)+V(Y)$ (requiere [[independencia|independencia]]).

**Momentos** — de orden $k$: $E[X^k]=\displaystyle\sum_x x^k p_X(x)$. **Centrados**: $\mu_k=E\!\big[(X-\mu_X)^k\big]$.

### Asimetría y curtosis

Coeficientes adimensionales de **forma** (ver [[asimetria-y-curtosis|asimetría y curtosis]]), con momentos centrados estandarizados:

$$ \gamma(X)=\frac{E\!\big[(X-\mu_X)^3\big]}{\sigma_X^3},\qquad \kappa(X)=\frac{E\!\big[(X-\mu_X)^4\big]}{\sigma_X^4}-3 $$

$\gamma>0$: cola a derecha; $\gamma<0$: cola a izquierda; $\gamma\approx0$: simétrica. $\kappa$ compara el peso de las colas contra la [[distribucion-normal|normal]] (el $-3$ la toma de referencia).

### Función generadora de momentos (FGM)

$$ M_X(t)=E\!\big[e^{tX}\big]=\sum_{k\in\mathcal{R}_X}e^{tk}\,p_X(k) $$

| Propiedad | Fórmula |
|---|---|
| Genera momentos | $E[X^k]=M_X^{(k)}(0)$; $\;E[X]=M_X'(0)$, $\;E[X^2]=M_X''(0)$ |
| Varianza vía FGM | $V(X)=M_X''(0)-\big(M_X'(0)\big)^2$ |
| Caracteriza | misma FGM (entorno de $0$) $\Rightarrow$ misma distribución |
| Transformación afín | $M_{aX+b}(t)=e^{bt}\,M_X(at)$ |
| Suma de independientes | $X\perp Y\Rightarrow M_{X+Y}(t)=M_X(t)\cdot M_Y(t)$ |

Ver [[funcion-generadora-de-momentos|FGM]] para la tabla de $M_X(t)$ de cada distribución discreta. Distribuciones discretas usuales: [[distribucion-bernoulli|Bernoulli]], [[distribucion-binomial|Binomial]], [[distribucion-geometrica|Geométrica]], [[distribucion-binomial-negativa|Binomial negativa]], [[distribucion-hipergeometrica|Hipergeométrica]], [[distribucion-poisson|Poisson]] — para elegir cuál, ver [[reconocer-distribucion-discreta|cómo reconocer la distribución]].

## U3 · Distribuciones discretas (tabla)

Convención de la cátedra: **Geométrica** y **Binomial Negativa (Pascal)** cuentan **fracasos** hasta el 1er / $r$-ésimo éxito, con soporte $\mathcal{R}=\mathbb{N}_0$. En todas, $q=1-p$.

| Distribución | Soporte $\mathcal{R}_X$ | PMF $p_X(k)$ | $E[X]$ | $V(X)$ | FGM $M_X(t)$ |
|---|---|---|---|---|---|
| [[distribucion-bernoulli\|$\text{Bernoulli}(p)$]] | $\{0,1\}$ | $p_X(1)=p,\ p_X(0)=q$ | $p$ | $pq$ | $q+p\,e^t$ |
| [[distribucion-binomial\|$\text{Binomial}(n,p)$]] | $\{0,\dots,n\}$ | $\dbinom{n}{k}p^k q^{\,n-k}$ | $np$ | $npq$ | $(q+p\,e^t)^n$ |
| [[distribucion-geometrica\|$\text{Geom}(p)$]] | $\mathbb{N}_0$ | $q^{\,k}\,p$ | $\dfrac{q}{p}$ | $\dfrac{q}{p^2}$ | $\dfrac{p}{1-q\,e^t},\ t<-\ln q$ |
| [[distribucion-binomial-negativa\|$\text{BinNeg}(r,p)$]] | $\mathbb{N}_0$ | $\dbinom{k+r-1}{k}q^{\,k}p^{\,r}$ | $\dfrac{rq}{p}$ | $\dfrac{rq}{p^2}$ | $\left(\dfrac{p}{1-q\,e^t}\right)^{r},\ t<-\ln q$ |
| [[distribucion-hipergeometrica\|$\text{Hiperg}(N,M,n)$]] | $\{\max\{0,n-(N-M)\},\dots,\min\{n,M\}\}$ | $\dfrac{\binom{M}{k}\binom{N-M}{\,n-k\,}}{\binom{N}{n}}$ | $n\dfrac{M}{N}=np$ | $np\,q\,\dfrac{N-n}{N-1}$ | — |
| [[distribucion-poisson\|$\text{Poisson}(\lambda)$]] | $\mathbb{N}_0$ | $\dfrac{\lambda^{k}}{k!}\,e^{-\lambda}$ | $\lambda$ | $\lambda$ | $e^{\lambda(e^t-1)}$ |

En la Hipergeométrica, $p=M/N$ (proporción de especiales); el factor $\tfrac{N-n}{N-1}$ es la **corrección por población finita**.

**Notas:**
- **Bernoulli**: caso $n=1$ de la Binomial; ladrillo de todas las de conteo.
- **Binomial** = suma de $n$ Bernoulli$(p)$ independientes (muestreo con reposición / población grande).
- **Geométrica**: única discreta **sin memoria**, $P(X\ge L+\Delta\mid X\ge L)=P(X\ge\Delta)$; es el caso $r=1$ de la BinNeg.
- **BinNeg (Pascal)** = suma de $r$ geométricas$(p)$ independientes (por eso $E,V$ son $r$ veces las de la geométrica).
- **Hipergeométrica** = muestreo **sin reposición** de población finita; misma media que la Binomial ($np$) pero menor varianza; **se aproxima a $\text{Binomial}(n,M/N)$** cuando $N\gg n$.
- **Poisson** aproxima a $\text{Binomial}(n,p)$ cuando $n$ grande y $p$ chico, con $\lambda=np$; media y varianza coinciden ($=\lambda$); suma de Poisson independientes es Poisson ($\lambda_1+\lambda_2$).

## U4 · Variable aleatoria continua (V.A.C.)

$X$ es **v.a.c.** $\iff F_X$ continua $\iff P(X=\alpha)=0\ \forall\alpha\in\mathbb{R}$. Se describe por la [[funcion-de-densidad|densidad]] $f_X$; sumas del caso discreto $\to$ **integrales**. Ver [[variable-aleatoria-continua|V.A. continua]].

### Densidad y FDA

| Objeto | Fórmula |
|---|---|
| Densidad $\ge 0$ | $f_X(x)\ge 0,\quad \displaystyle\int_{-\infty}^{+\infty} f_X(x)\,dx = 1$ |
| FDA desde la densidad | $\displaystyle F_X(x)=P(X\le x)=\int_{-\infty}^{x} f_X(y)\,dy$ |
| Densidad desde la FDA | $\displaystyle f_X(x)=\frac{dF_X(x)}{dx}$ (donde $F_X$ derivable) |

**Probabilidad de un intervalo** (da igual $<$ o $\le$ porque $P(X=\alpha)=0$):
$$ P(a<X\le b)=P(a\le X\le b)=F_X(b)-F_X(a)=\int_a^b f_X(x)\,dx. $$

> Truco: la densidad **no** es probabilidad ($f_X(x)$ puede ser $>1$); lo que aproxima $P$ es $f_X(\alpha)\,\Delta x$. Ver [[funcion-de-densidad|densidad]].

### Esperanza y varianza

$$ E[X]=\mu_X=\int_{-\infty}^{+\infty} x\,f_X(x)\,dx,\qquad E[g(X)]=\int_{-\infty}^{+\infty} g(x)\,f_X(x)\,dx,\qquad E[X^k]=\int_{-\infty}^{+\infty} x^k\,f_X(x)\,dx. $$

$$ V(X)=\sigma_X^2=E[(X-\mu_X)^2]=\int_{-\infty}^{+\infty}(x-\mu_X)^2 f_X(x)\,dx=E[X^2]-(E[X])^2\ \ge 0. $$

### Esperanza por la cola (supervivencia), $X\ge 0$

$$ E[X]=\int_0^{+\infty}\big(1-F_X(x)\big)\,dx=\int_0^{+\infty}P(X>x)\,dx. $$

> Útil cuando se conoce $F_X$ (o $P(X>x)$) pero la densidad es incómoda de integrar. Ejemplo exponencial: $\int_0^\infty e^{-\lambda x}dx=1/\lambda$.

### Tasa de fallas (hazard) y confiabilidad

Para $T\ge 0$ (duración), con supervivencia $S(t)=1-F_T(t)=P(T>t)$. Ver [[tasa-de-fallas|tasa de fallas]].

$$ R(t)=\frac{f_T(t)}{1-F_T(t)}=-\frac{d}{dt}\ln S(t),\qquad S(t)=1-F_T(t)=\exp\!\left(-\int_0^t R(u)\,du\right). $$

$$ T\sim\text{Expo}(\lambda)\iff R(t)\equiv\lambda\ \text{(constante)}. $$

| Forma de $R(t)$ | Envejecimiento |
|---|---|
| creciente | desgaste |
| decreciente | mortalidad infantil |
| constante | al azar (sin memoria) $\to$ exponencial |

### Mínimo de exponenciales (sistema en serie)

Si $X_1,\dots,X_n$ son [[distribucion-exponencial|exponenciales]] **independientes** de tasas $\lambda_i$ (el sistema falla al fallar el primero). Ver [[minimo-de-exponenciales|mínimo de exponenciales]].

$$ T=\min(X_1,\dots,X_n)\sim\text{Expo}\!\left(\sum_{i=1}^n \lambda_i\right),\qquad P(T>t)=\prod_{i=1}^n e^{-\lambda_i t},\qquad E[T]=\frac{1}{\sum_i \lambda_i}. $$

Caso idéntico ($\lambda_i=\lambda$): $T\sim\text{Expo}(n\lambda)$, $E[T]=\dfrac{1}{n\lambda}=\dfrac{E[X_1]}{n}$.

> Nota: la **suma** de exponenciales i.i.d. (no el mínimo) es [[distribucion-gamma|Gamma]]/Erlang (sistema en *standby*).

### Notas de cálculo

- Soporte no acotado $\Rightarrow$ **integrales impropias**: $\displaystyle\int_a^{+\infty} w(x)\,dx=\lim_{t\to+\infty}\int_a^{t} w(x)\,dx$. Ver [[tecnica-integrales-impropias|integrales impropias]].
- Distribuciones continuas usuales: [[distribucion-uniforme-continua|Unif$(a,b)$]], [[distribucion-exponencial|Expo$(\lambda)$]], [[distribucion-normal|$N(\mu,\sigma)$]].

## U4 · Distribuciones continuas (tabla)

> Núcleo. V.A.C.: densidad $f_X(x)$, FDA $F_X(x)=P(X\le x)=\int_{-\infty}^x f_X$. **Normal parametrizada por el DESVÍO $\sigma$** (segundo parámetro $=\sigma$, con $V=\sigma^2$; nunca $N(\mu,\sigma^2)$). **Exponencial por la TASA $\lambda$.** Fuera del soporte, $f_X=0$.

| Distribución | Soporte $\mathcal{R}_X$ | Densidad $f_X(x)$ | FDA $F_X(x)$ | $E[X]$ | $V(X)$ |
|---|---|---|---|---|---|
| [[distribucion-uniforme-continua\|$\text{Unif}(a,b)$]] | $(a,b),\ a<b$ | $\dfrac{1}{b-a}$ | $\dfrac{x-a}{b-a}$ (lineal en $(a,b)$) | $\dfrac{a+b}{2}$ | $\dfrac{(b-a)^2}{12}$ |
| [[distribucion-exponencial\|$\text{Expo}(\lambda)$]] | $x>0$ | $\lambda e^{-\lambda x}$ | $1-e^{-\lambda x}$ | $\dfrac{1}{\lambda}$ | $\dfrac{1}{\lambda^2}$ |
| [[distribucion-normal\|$N(\mu,\sigma)$]] | $\mathbb{R}$ | $\dfrac{1}{\sqrt{2\pi}\,\sigma}\exp\!\left\{-\dfrac{(x-\mu)^2}{2\sigma^2}\right\}$ | $\Phi\!\left(\dfrac{x-\mu}{\sigma}\right)$ — sin forma cerrada (tabla de $\Phi$) | $\mu$ | $\sigma^2$ |
| [[distribucion-gamma\|$\text{Gamma}(\alpha,\lambda)$]] | $x>0$ | $\dfrac{\lambda^{\alpha}x^{\alpha-1}e^{-\lambda x}}{\Gamma(\alpha)}$ | sin forma cerrada (forma entera: ver Erlang) | $\dfrac{\alpha}{\lambda}$ | $\dfrac{\alpha}{\lambda^2}$ |
| [[distribucion-erlang\|$\text{Erlang}_k(\lambda)$]] | $t>0$ | $\dfrac{\lambda^{k}t^{k-1}e^{-\lambda t}}{(k-1)!}$ | $1-\displaystyle\sum_{j=0}^{k-1}\dfrac{(\lambda t)^{j}}{j!}e^{-\lambda t}$ | $\dfrac{k}{\lambda}$ | $\dfrac{k}{\lambda^2}$ |
| [[distribucion-weibull\|$\text{Weibull}(\lambda,b)$]] | $x>0$ | $\lambda\,b\,(\lambda x)^{b-1}\exp\!\big(-(\lambda x)^b\big)$ | $1-\exp\!\big(-(\lambda x)^b\big)$ | $\dfrac{1}{\lambda}\Gamma\!\left(1+\tfrac1b\right)$ | $\dfrac{1}{\lambda^2}\!\left[\Gamma\!\left(1+\tfrac2b\right)-\Gamma\!\left(1+\tfrac1b\right)^2\right]$ |
| [[distribucion-ji-cuadrado\|$\chi^2_k$]] | $(0,\infty)$ | $\dfrac{x^{k/2-1}e^{-x/2}}{2^{k/2}\,\Gamma\!\left(\tfrac{k}{2}\right)}$ | sin forma cerrada | $k$ | $2k$ |
| [[distribucion-t-de-student\|$t_m$]] | $\mathbb{R}$ | $\dfrac{1}{\sqrt{m\pi}}\dfrac{\Gamma\!\left(\tfrac{m+1}{2}\right)}{\Gamma\!\left(\tfrac{m}{2}\right)}\!\left(1+\tfrac{t^2}{m}\right)^{-\frac{m+1}{2}}$ | sin forma cerrada (tabla de fractiles) | $0$ ($m>1$) | $\dfrac{m}{m-2}$ ($m>2$) |

$\Gamma(\alpha)=\int_0^\infty u^{\alpha-1}e^{-u}\,du$; $\Gamma(n)=(n-1)!$ para $n$ entero; $\Gamma(\tfrac12)=\sqrt{\pi}$. Para la Normal, $\Phi=$ FDA de $Z\sim N(0,1)$ (ver [[estandarizacion-y-tabla-normal|estandarización]]).

### Notas (una línea)
- **[[distribucion-exponencial\|Exponencial]]:** única continua **sin memoria** — $P(X>x+\Delta\mid X>x)=P(X>\Delta)$; tasa de fallas constante $\lambda$; $P(X>x)=e^{-\lambda x}$.
- **[[distribucion-gamma\|Gamma]]:** suma de $\alpha$ [[distribucion-exponencial|exponenciales]] i.i.d. de tasa $\lambda$ ($\text{Gamma}(1,\lambda)=\text{Expo}(\lambda)$).
- **[[distribucion-erlang\|Erlang]]:** Gamma de forma **entera** $k$ $=$ tiempo hasta la $k$-ésima ocurrencia de un [[proceso-de-poisson|Poisson]]; dualidad $\{T_k>t\}\Leftrightarrow\{N(t)\le k-1\}$, $N(t)\sim\text{Poisson}(\lambda t)$.
- **[[distribucion-weibull\|Weibull]]:** $b=1$ $\Rightarrow$ exponencial; tasa de fallas $R(x)=\lambda b(\lambda x)^{b-1}$ ($b>1$ desgaste, $b<1$ mortalidad infantil).
- **[[distribucion-ji-cuadrado\|Ji-cuadrado]]:** $\chi^2_k=\sum_{i=1}^k Z_i^2$ con $Z_i\sim N(0,1)$ i.i.d.; en inferencia $\dfrac{(n-1)S_n^2}{\sigma^2}\sim\chi^2_{n-1}$; es $\text{Gamma}\!\left(\tfrac{k}{2},\tfrac12\right)$.
- **[[distribucion-t-de-student\|t-Student]]:** $T=\dfrac{\overline X_n-\mu}{S_n/\sqrt n}\sim t_{n-1}$; colas más pesadas que la [[distribucion-normal|normal]], converge a $N(0,1)$ cuando $m=n-1\to\infty$.

## U4 · Normal estándar y estandarización

Ver [[distribucion-normal|Normal $N(\mu,\sigma)$]] · [[estandarizacion-y-tabla-normal|estandarización y tabla]] · [[aproximacion-normal-de-la-binomial|aprox. normal de la binomial]].

### Normal estándar $Z\sim N(0,1)$

$$ f_Z(z)=\frac{1}{\sqrt{2\pi}}\,e^{-z^2/2},\qquad \Phi(z)\overset{\text{def}}{=}F_Z(z)=P(Z\le z)=\int_{-\infty}^{z}\frac{1}{\sqrt{2\pi}}e^{-y^2/2}\,dy. $$

Sin forma cerrada → se tabula. Guía: $\Phi(0)=0.5$, $\Phi(+\infty)=1$, $\Phi(-\infty)=0$.

### Estandarización

$$ Z=\frac{X-\mu}{\sigma}\sim N(0,1),\qquad F_X(x)=P(X\le x)=\Phi\!\left(\frac{x-\mu}{\sigma}\right). $$

- $z=\frac{x-\mu}{\sigma}$: a cuántos **desvíos** del centro está $x$ (una sola tabla sirve para toda $N(\mu,\sigma)$).
- **Simetría:** $\boxed{\ \Phi(-z)=1-\Phi(z)\ }$ (permite usar tabla solo con $z\ge0$).

| Probabilidad | Fórmula estandarizada |
|---|---|
| $P(X>x)$ | $1-\Phi\!\left(\frac{x-\mu}{\sigma}\right)$ |
| $P(a<X\le b)$ | $\Phi\!\left(\frac{b-\mu}{\sigma}\right)-\Phi\!\left(\frac{a-\mu}{\sigma}\right)$ |
| $P(\mu-k\sigma<X<\mu+k\sigma)$ | $2\Phi(k)-1$ |

### Fractiles / cuantiles (problema inverso)

$$ z_\alpha=\Phi^{-1}(\alpha),\qquad x_\alpha=\mu+\sigma\,z_\alpha,\qquad \boxed{\ z_{1-\alpha}=-z_\alpha\ }. $$

| $\alpha$ | $0.90$ | $0.95$ | $0.975$ | $0.99$ | $0.995$ |
|---|---|---|---|---|---|
| $z_\alpha$ | $1.2816$ | $1.6449$ | $1.96$ | $2.3263$ | $2.5758$ |

### Regla empírica (68–95–99.7)

$$ P(|X-\mu|<\sigma)\approx0.6827,\quad P(|X-\mu|<2\sigma)\approx0.9545,\quad P(|X-\mu|<3\sigma)\approx0.9973. $$

### Valores notables de $Z$

- Cuartiles: $Q_{1,3}=\mp0.6745$, rango intercuartílico $I_Q=1.349\,\sigma$ (en $X$: $Q_{1,3}=\mu\mp0.6745\sigma$).
- $E[|Z|]=\sqrt{2/\pi}\approx0.798$ (semi-normal).
- Outliers de Tukey en una normal: $P(\text{outlier})=2\Phi(-2.698)\approx0.7\%$.

### Interpolación lineal en la tabla

Si $z\in(z_1,z_2)$ (cae entre filas):
$$ \Phi(z)\approx \Phi(z_1)+\frac{\Phi(z_2)-\Phi(z_1)}{z_2-z_1}\,(z-z_1). $$
> Ej.: $\Phi(0.6\overline{6})$ con $\Phi(0.66)=0.7454$ y $\Phi(0.67)=0.7486$ da $\approx0.7475$.

### Aproximación normal de la binomial (De Moivre–Laplace)

Para $n$ grande, con $q=1-p$:
$$ \mathrm{Bin}(n,p)\;\approx\;N\big(np,\;\sqrt{npq}\big). $$
**Condición:** $np\ge5$ y $nq\ge5$. Si $p\approx0$ con $np$ moderado, usar [[distribucion-poisson|Poisson]].

**Corrección por continuidad** ($\pm\tfrac12$, clave por ser discreta):
$$
\begin{aligned}
P(S_n=s)&\approx\Phi\!\left(\tfrac{s+\frac12-np}{\sqrt{npq}}\right)-\Phi\!\left(\tfrac{s-\frac12-np}{\sqrt{npq}}\right),\\
P(a\le S_n\le b)&\approx\Phi\!\left(\tfrac{b+\frac12-np}{\sqrt{npq}}\right)-\Phi\!\left(\tfrac{a-\frac12-np}{\sqrt{npq}}\right).
\end{aligned}
$$
> Para $<$ / $>$ estrictos, mover el $\pm\tfrac12$ hacia adentro (excluir los extremos).

## U5 · Función de variable aleatoria Y=g(X)

Dada $X$ y $g:\mathbb{R}\to\mathbb{R}$, se define $Y=g(X)$; el objetivo es deducir la distribución de $Y$ desde la de $X$. Teoría en [[funcion-de-variable-aleatoria|Función de v.a.]]; receta en [[tecnica-distribucion-de-una-funcion-de-va|técnica $Y=g(X)$]].

### Método general (vía la FDA) — sirve siempre
$$ F_Y(y)=P(Y\le y)=P\big(g(X)\le y\big) $$
Se reescribe el evento $\{g(X)\le y\}$ en términos de $X$, se evalúa en $F_X$ y luego:
- $Y$ continua: $f_Y(y)=\dfrac{d}{dy}F_Y(y)$ (regla de la cadena).
- $Y$ discreta: $p_Y(k)=\displaystyle\sum_{x:\,g(x)=k} p_X(x)$.

**Traducir el evento según $g$:**

| $g$ | evento sobre $X$ | FDA de $Y$ |
|---|---|---|
| creciente | $\{X\le g^{-1}(y)\}$ | $F_Y(y)=F_X\!\big(g^{-1}(y)\big)$ |
| decreciente | $\{X\ge g^{-1}(y)\}$ | $F_Y(y)=1-F_X\!\big(g^{-1}(y)\big)$ |
| no inyectiva $Y=X^2$ | $\{-\sqrt{y}\le X\le\sqrt{y}\}$ | $F_Y(y)=F_X(\sqrt{y})-F_X(-\sqrt{y})$ |

### Caso $g$ monótona estricta (cambio de variable / jacobiano)
$$ f_Y(y)=f_X\!\big(g^{-1}(y)\big)\,\left|\dfrac{d}{dy}\,g^{-1}(y)\right| $$
El módulo del jacobiano corrige el estiramiento del eje y garantiza $f_Y\ge0$ (positivo aunque $g$ sea decreciente).

### Transformación afín $Y=aX+b$ (no requiere FDA para momentos)
- $E[Y]=a\,E[X]+b$
- $V(Y)=a^2\,V(X)\;\Rightarrow\;\sigma_Y=|a|\,\sigma_X$
- $\text{Cov}(X,Y)=a\,\sigma_X^2=\text{sign}(a)\,\sigma_X\sigma_Y$
- $a=0\Rightarrow Y=b$ constante: $V(Y)=0$, $P(Y=b)=1$.

**Normal (cerrada por afines):** si $X\sim N(\mu_X,\sigma_X)$ y $a\neq0$,
$$ Y=aX+b\sim N\big(a\mu_X+b,\;|a|\sigma_X\big),\qquad Z=\frac{Y-\mu_Y}{\sigma_Y}\sim N(0,1). $$

### Método de la transformada inversa (simulación)
Si $F_X$ es estrictamente creciente y $U\sim\text{Unif}(0,1)$:
$$ Y=F_X^{-1}(U)\ \Rightarrow\ F_Y(y)=P\big(U\le F_X(y)\big)=F_X(y), $$
es decir $Y$ tiene la misma distribución que $X$. Para no estrictamente crecientes (discretas), usar la inversa generalizada $F_X^{\leftarrow}(u)=\min\{x:\,u\le F_X(x)\}$.
- Ej. $\text{Expo}(\lambda)$: $Y=-\dfrac{1}{\lambda}\ln(1-U)$.

### Errores típicos
- Olvidar el $|dg^{-1}/dy|$ (módulo del jacobiano) al derivar.
- No tratar la no inyectividad: sumar las dos ramas en $Y=X^2$, $Y=|X|$.
- Confundir el soporte: si $0<x<1$ y $Y=X^3$, entonces $0<y<1$, no todo $\mathbb{R}$.
- Afín con $a<0$: $\sigma_Y=|a|\sigma_X$ (nunca $a\,\sigma_X$).

## U5 · Variables bidimensionales (conjuntas)

Un vector $(X,Y)$ observado en el mismo experimento. La **conjunta** lo contiene todo: sumando/integrando una variable → **marginales**; dividiendo → **condicionales**. Detalle en [[variables-aleatorias-bidimensionales|bidimensionales]], [[esperanza-condicional|esperanza condicional]] y [[mezcla-de-distribuciones|mezcla]].

### Conjunta, marginales, esperanza — V.A.D. vs V.A.C.

| | **V.A.D.** (masa) | **V.A.C.** (densidad) |
|---|---|---|
| conjunta | $p_{X,Y}(x,y)=P(X=x,Y=y)$ | $f_{X,Y}(x,y)\ge0$ |
| normalización | $\displaystyle\sum_{x}\sum_{y}p_{X,Y}=1$ | $\displaystyle\iint_{\mathbb{R}^2}f_{X,Y}\,dx\,dy=1$ |
| marginal de $X$ | $p_X(x)=\sum_{y}p_{X,Y}(x,y)$ | $f_X(x)=\int_{-\infty}^{\infty}f_{X,Y}(x,y)\,dy$ |
| marginal de $Y$ | $p_Y(y)=\sum_{x}p_{X,Y}(x,y)$ | $f_Y(y)=\int_{-\infty}^{\infty}f_{X,Y}(x,y)\,dx$ |
| $E[h(X,Y)]$ | $\sum_{x}\sum_{y}h(x,y)\,p_{X,Y}$ | $\iint_{\mathbb{R}^2}h(x,y)\,f_{X,Y}\,dx\,dy$ |

$$ P\big((X,Y)\in B\big)=\iint_B f_{X,Y}\,dx\,dy,\qquad f_{X,Y}(x,y)=\frac{\partial^2}{\partial x\,\partial y}P(X\le x,Y\le y). $$

> **Las marginales NO determinan la conjunta**: distintas conjuntas pueden tener las mismas marginales. Solo bajo [[independencia-de-variables-aleatorias|independencia]] vale $p_{X,Y}=p_X\,p_Y$ (o $f_{X,Y}=f_X\,f_Y$).

### Condicional y esperanza condicional

$$ f_{X\mid Y}(x\mid y)=\frac{f_{X,Y}(x,y)}{f_Y(y)},\qquad p_{X\mid Y}(x\mid y)=\frac{p_{X,Y}(x,y)}{p_Y(y)}. $$

$$ E[g(X)\mid Y=y]=\begin{cases}\displaystyle\sum_{x}g(x)\,p_{X\mid Y}(x\mid y) & (\text{V.A.D.}),\\[2mm]\displaystyle\int_{-\infty}^{\infty}g(x)\,f_{X\mid Y}(x\mid y)\,dx & (\text{V.A.C.}).\end{cases} $$

$$ \operatorname{Var}(X\mid Y)=E[X^2\mid Y]-\big(E[X\mid Y]\big)^2. $$

> $E[X\mid Y=y]$ es un **número**; $E[X\mid Y]$ (con $Y$ libre) es una **función de $Y$**, o sea una v.a.

### Leyes total (promediar por etapas)

$$ \boxed{\;E[X]=E\big[E[X\mid Y]\big]\;}\qquad \boxed{\;V(X)=E\big[V(X\mid Y)\big]+V\big(E[X\mid Y]\big)\;} $$

$$ E[X]=\begin{cases}\displaystyle\sum_{y}E[X\mid Y=y]\,p_Y(y) & (Y\text{ discreta}),\\[2mm]\displaystyle\int_{-\infty}^{\infty}E[X\mid Y=y]\,f_Y(y)\,dy & (Y\text{ continua}).\end{cases} $$

- $E[V(X\mid Y)]$ = variabilidad **intra**-grupo · $V(E[X\mid Y])$ = variabilidad **inter**-grupos.
- ⚠️ La varianza **no** se promedia sola: $V(X)\neq\sum_y V(X\mid Y=y)\,p_Y(y)$ (falta el término entre-grupos → subestima).

### Mezcla (caso mixto: una discreta condiciona a una continua)

**Directa** — $X$ continua, $M$ discreta con $X\mid M=k$ conocida (promedio ponderado = combinación convexa):
$$ \begin{aligned} F_X(x)&=\sum_{k}F_{X\mid M}(x\mid k)\,P(M{=}k),\\ f_X(x)&=\sum_{k}f_{X\mid M}(x\mid k)\,P(M{=}k),\\ E[g(X)]&=\sum_{k}E[g(X)\mid M{=}k]\,P(M{=}k). \end{aligned} $$

**Inversa** — $X$ discreta, $Y$ continua (parámetro aleatorio); se **integra** en vez de sumar:
$$ p_X(x)=\int_{\mathbb{R}}p_{X\mid Y}(x\mid y)\,f_Y(y)\,dy,\qquad E[h(X)]=\int_{\mathbb{R}}E[h(X)\mid Y{=}y]\,f_Y(y)\,dy. $$

> ⚠️ **Varianza de la mezcla (cuidado, no es lineal).** Usar $E[X^2]=\sum_k E[X^2\mid M{=}k]\,P(M{=}k)$ y luego $V(X)=E[X^2]-(E[X])^2$; o bien $V(X)=E[V(X\mid M)]+V(E[X\mid M])$. El exceso $V(E[X\mid M])$ es la **sobredispersión**. Además $E[h(X)]\neq E[h(X)\mid \text{parámetro}=E[\cdot]]$ (promediar la condicional ≠ evaluar en el promedio).

**Bayes sobre la mezcla** (invertir hacia $M$ dado un evento sobre $X$):
$$ P(M{=}k\mid X\in A)=\frac{P(X\in A\mid M{=}k)\,P(M{=}k)}{\sum_{j}P(X\in A\mid M{=}j)\,P(M{=}j)}. $$

Detalle y ejercicios: [[mezcla-de-distribuciones|mezcla de distribuciones]] · [[esperanza-condicional|leyes total]] · [[probabilidad-total-y-bayes|Bayes]] · [[covarianza-y-correlacion|Cov y correlación]] · [[tecnica-integrales-dobles|integrales dobles]].

## U5 · Covarianza, correlación e independencia

### Covarianza

$$ \text{Cov}(X,Y)=E\big[(X-\mu_X)(Y-\mu_Y)\big]=E[XY]-\mu_X\,\mu_Y. $$

| Propiedad | Fórmula |
|---|---|
| Con sí misma | $\text{Cov}(X,X)=V(X)$ |
| Simetría | $\text{Cov}(X,Y)=\text{Cov}(Y,X)$ |
| Bilineal | $\text{Cov}(aX+b,\,cY+d)=ac\,\text{Cov}(X,Y)$ |
| Caso afín $Y=aX+b$ | $\text{Cov}(X,Y)=a\,\sigma_X^2=\text{sign}(a)\,\sigma_X\sigma_Y$ |

**Varianza de una combinación lineal:**
$$ V(aX+bY)=a^2V(X)+2ab\,\text{Cov}(X,Y)+b^2V(Y). $$
$$ V(X\pm Y)=V(X)\pm 2\,\text{Cov}(X,Y)+V(Y). $$

### Coeficiente de correlación

$$ \rho_{X,Y}=\frac{\text{Cov}(X,Y)}{\sigma_X\,\sigma_Y}\in[-1,+1]. $$

- $|\text{Cov}(X,Y)|\le\sigma_X\sigma_Y$ (Cauchy–Schwarz), $\;(\text{Cov}(X,Y))^2\le V(X)V(Y)$.
- $\rho_{X,Y}=\pm1 \iff Y=aX+b$ con prob. $1$ ($a\neq0$, $\text{sign}(a)=\text{sign}(\rho_{X,Y})$): relación lineal exacta.

Detalle y demostraciones en [[covarianza-y-correlacion|Covarianza y correlación]].

### Independencia

$$ X,Y\text{ indep.} \iff p_{X,Y}(x,y)=p_X(x)\,p_Y(y)\ \ \text{(V.A.D.)} \iff f_{X,Y}(x,y)=f_X(x)\,f_Y(y)\ \ \text{(V.A.C.)} $$

Equivalente vía condicional: $f_{X\mid Y}(x\mid y)=f_X(x)$ (o $p_{X\mid Y}=p_X$).

**Si $X,Y$ son independientes:**

| Consecuencia | |
|---|---|
| Factoriza esperanza | $E[g_1(X)\,g_2(Y)]=E[g_1(X)]\,E[g_2(Y)]$; en particular $E[XY]=E[X]E[Y]$ |
| Incorrelación | $\text{Cov}(X,Y)=0$ y $\rho_{X,Y}=0$ |
| Varianza de la suma | $V(X+Y)=V(X)+V(Y)$ |
| Probabilidad conjunta | $P(X\in A,\,Y\in B)=P(X\in A)\,P(Y\in B)$ |

> **Recíproco FALSO en general:** $\text{Cov}=0\not\Rightarrow$ independencia (incorrelación no implica independencia). **Única excepción:** $X,Y$ conjuntamente normales $\Rightarrow \text{Cov}=0$ sí implica independencia.

**Truco (detección rápida de NO independencia):** un cero de $p_{X,Y}$ en una celda con $p_X(x)>0$ y $p_Y(y)>0$, o un **soporte no rectangular** de $f_{X,Y}$ (el rango de $Y$ depende de $X$) $\Rightarrow$ dependientes.

Detalle en [[independencia-de-variables-aleatorias|Independencia de V.A.]].

## U6 · Procesos estocásticos (Bernoulli, Poisson, Markov)

Tres procesos de conteo / evolución. Bernoulli y Poisson comparten esqueleto (conteo, incrementos indep. y estac., Markov); solo cambia discreto ↔ continuo. Detalle: [[proceso-de-bernoulli|Bernoulli]], [[proceso-de-poisson|Poisson]], [[relacion-bernoulli-poisson|relación B↔P]], [[cadenas-de-markov|cadenas de Markov]].

### Proceso de Bernoulli (tiempo discreto)

Reloj que en cada tic hace un ensayo Bernoulli($p$) i.i.d. (a lo sumo un éxito por paso). $N(0)=0$, $\mathcal{R}_{N(k)}=\{0,1,\dots,k\}$. Definido por: incrementos **independientes** y **estacionarios**, $P(N(k{+}1)-N(k)=1)=p$ y $P(N(k{+}1)-N(k)=m)=0$ si $m>1$.

| Pregunta | V.A. | Distribución |
|---|---|---|
| Conteo en $k$ pasos | $N(k)$ | [[distribucion-binomial\|Binomial]]$(k,p)$ |
| Incremento ($k\le m$) | $N(m)-N(k)$ | Binomial$(m{-}k,p)$ |
| Tiempo entre eventos / al próximo | $\tau_i$ | [[distribucion-geometrica\|Geométrica]]$(p)$ i.i.d. |
| Tiempo hasta el $k$-ésimo | $T_k=\tau_1+\dots+\tau_k$ | [[distribucion-binomial-negativa\|Binomial negativa]]$(k,p)$ |

$$ P(N(k)=n)=\binom{k}{n}p^n(1-p)^{k-n},\qquad q=1-p. $$

Nota: $\tau_i$ cuenta los **fracasos** entre eventos; Geométrica y Binomial negativa **cuentan fracasos** (soporte $\mathbb{N}_0$), $E[\tau]=q/p$. Es un [[proceso-de-bernoulli|proceso de Markov]].

### Proceso de Poisson (tiempo continuo)

Límite continuo del Bernoulli: eventos "al azar" a tasa $\lambda>0$ constante. Definido por: incrementos **independientes** y **estacionarios**, $P(N(t{+}h)-N(t)=1)=\lambda h+o(h)$ y $P(N(t{+}h)-N(t)>1)=o(h)$.

| Pregunta | V.A. | Distribución |
|---|---|---|
| Conteo en $[0,t]$ (o intervalo de long. $\tau$) | $N(t)$ | [[distribucion-poisson\|Poisson]]$(\lambda t)$ |
| Tiempo entre eventos / al próximo | $\tau_i$ | [[distribucion-exponencial\|Expo]]$(\lambda)$ i.i.d. |
| Tiempo hasta el $k$-ésimo | $T_k=\tau_1+\dots+\tau_k$ | [[distribucion-erlang\|Erlang]]$(k,\lambda)$ |

$$ P(N(t)=n)=\frac{(\lambda t)^n}{n!}\,e^{-\lambda t}\quad(n\ge0),\qquad E[N(t)]=V(N(t))=\lambda t. $$

$$ \tau_i\sim\text{Expo}(\lambda):\quad F_{\tau}(t)=1-e^{-\lambda t}\ (t>0),\qquad E[\tau]=1/\lambda. $$

**Dualidad conteo ↔ tiempo** (clave en ejercicios): $\ T_k< t \iff N(t)\ge k$. Convierte preguntas de tiempos (Erlang/Expo) en preguntas de conteos (Poisson).

Caracterización: $N(t)$ es Poisson($\lambda$) $\iff$ los $\tau_n\sim\text{Expo}(\lambda)$ i.i.d. Recuerde ajustar $\lambda$ a las unidades del intervalo.

### Relación Bernoulli → Poisson

Discretizando $[0,t]$ en $t/\Delta t$ intervalos con $p=\lambda\,\Delta t$:
$$ N(t)\ \underset{\text{aprox}}{\sim}\ \text{Binomial}\!\left(\tfrac{t}{\Delta t},\,\lambda\,\Delta t\right)\ \xrightarrow[\Delta t\to0]{}\ \text{Poisson}(\lambda t). $$
Análogos discreto ↔ continuo (con $p=\lambda\,\Delta t$): Binomial ↔ Poisson · Geométrica ↔ Exponencial · Binomial negativa ↔ Erlang. Ver [[relacion-bernoulli-poisson|detalle]].

| | **Bernoulli** | **Poisson** |
|---|---|---|
| Tiempo | discreto | continuo |
| Incrementos | indep. y estac. | indep. y estac. |
| Markov | sí | sí |
| Marginal $N(t)$ | [[distribucion-binomial\|Binomial]]$(k,p)$ | [[distribucion-poisson\|Poisson]]$(\lambda t)$ |
| Tiempos entre eventos | [[distribucion-geometrica\|Geométrica]] i.i.d. | [[distribucion-exponencial\|Exponencial]] i.i.d. |
| Tiempo al $k$-ésimo | [[distribucion-binomial-negativa\|Binomial neg.]] | [[distribucion-erlang\|Erlang]] |
| Parámetro | $p$ | $\lambda$ |

Ambos tiempos entre eventos tienen **falta de memoria** → los procesos son "sin memoria" (Markov).

### Cadenas de Markov

[[cadenas-de-markov|Proceso de Markov]] con estados **discretos** $\mathbb{E}=\{s_1,s_2,\dots\}$: el próximo estado depende **solo del actual**. Descripta por la distribución inicial $p_j(0)=P(X(0)=s_j)$ ($\sum_j p_j(0)=1$) y las transiciones $p_{ij}=P(X(n{+}1)=s_j\mid X(n)=s_i)$ ($\sum_j p_{ij}=1$).

**Propiedad markoviana:**
$$ P\big(X(n{+}1)=s_j\mid X(n)=s_i,\dots,X(0)\big)=P\big(X(n{+}1)=s_j\mid X(n)=s_i\big). $$

**Matriz de transición** $\mathbb{P}=(p_{ij})$: estocástica, **cada fila suma 1**. Vector de estado $\vec p(n)$ (suma 1).

$$ \vec p(n+1)=\vec p(n)\,\mathbb{P}\qquad\text{(Chapman–Kolmogorov).} $$

**Cadena homogénea** ($p_{ij}$ no depende de $n$): matriz de $n$ pasos $\mathbb{P}^{(n)}=\mathbb{P}^n$, con $(\mathbb{P}^n)_{ij}=P(\text{ir de }i\text{ a }j\text{ en }n\text{ pasos})$, y
$$ \vec p(n)=\vec p(0)\,\mathbb{P}^{n}. $$

**Distribución estacionaria** $\vec\pi$ (largo plazo / equilibrio) = autovector a izquierda de $\mathbb{P}$ con autovalor 1:
$$ \boxed{\ \vec\pi=\vec\pi\,\mathbb{P},\qquad \sum_j \pi_j=1.\ } $$

**Cadena regular** (existe $n$ con $\mathbb{P}^n>0$ en todas sus entradas) $\Rightarrow$ irreducible, recurrente y aperiódica; $\vec\pi=\lim_{n\to\infty}\vec p(n)$ existe y es **independiente** de $\vec p(0)$.

Tipos de estados: **accesible** ($p_{ij}^{(n)}>0$ algún $n$) · **comunican** (ambos sentidos) · **irreducible** (una sola clase) · **recurrente** $r_i=1$ / **transitorio** $r_i<1$ · **periódico** período $m_i>1$ / **aperiódico** $m_i=1$ · **absorbente** $p_{ii}=1$.

**Tiempo hasta absorción** (absorbentes $s_1,\dots,s_k$): $\mathbb{P}=\begin{pmatrix}\mathbb{I} & \mathbf{0}\\ \mathbb{F} & \mathbb{Q}\end{pmatrix}$, $\ \mathbb{M}=(\mathbb{I}-\mathbb{Q})^{-1}$ (tiempos esperados por estado), $\ \mathbb{G}=\mathbb{M}\,\mathbb{F}$ (prob. de absorción por cada $s_j$). Ver [[cadenas-de-markov|detalle y ejercicios]].

## U7 · Suma de v.a., desigualdades, LGN y TCL

Hub: [[suma-de-variables-aleatorias|Suma de v.a.]] · hoja completa: [[formulario-suma-de-va|Formulario u.7]].

### Esperanza y varianza de una suma
- **Esperanza (siempre, sin hipótesis):** $\;E[X+Y]=E[X]+E[Y]$, y en general $\;E\!\left[\sum_{k=1}^n X_k\right]=\sum_{k=1}^n E[X_k]$.
- **Varianza (caso general):** aparece la [[covarianza-y-correlacion|covarianza]]
$$ V(X+Y)=V(X)+2\,\mathrm{Cov}(X,Y)+V(Y),\qquad V\!\left(\sum_{k=1}^n X_k\right)=\sum_{k=1}^n V(X_k)+2\!\!\sum_{i<j}\mathrm{Cov}(X_i,X_j). $$
- **Independientes / no correlacionadas** ($\mathrm{Cov}=0$): $\;V(X\pm Y)=V(X)+V(Y)\;$ (la resta **también suma**); para $n$ indep. $\;V\!\left(\sum X_k\right)=\sum V(X_k)$.

### Caso i.i.d.: suma $S_n$ y promedio $\bar X_n$
$X_1,\dots,X_n$ i.i.d. con media $\mu$ y varianza $\sigma^2$. Sea $S_n=\sum_{i=1}^n X_i$ y $\bar X_n=\tfrac1n S_n$ ([[promedio-muestral|promedio muestral]]):

| | $S_n=\sum X_i$ | $\bar X_n=\tfrac1n S_n$ |
|---|---|---|
| Media | $n\mu$ | $\mu$ (insesgado) |
| Varianza | $n\sigma^2$ | $\dfrac{\sigma^2}{n}\xrightarrow{n\to\infty}0$ |
| Desvío | $\sqrt n\,\sigma$ | $\dfrac{\sigma}{\sqrt n}$ (**error estándar**) |

### Distribución de la suma: convolución ($X,Y$ independientes)
$$ \text{discreta: } p_S(s)=\sum_{y\in \mathcal R_Y} p_X(s-y)\,p_Y(y),\qquad \text{continua: } f_S(s)=\int_{-\infty}^{+\infty} f_X(s-y)\,f_Y(y)\,dy. $$
Atajo: con [[funcion-generadora-de-momentos|FGM]], $\;M_S(t)=M_X(t)\,M_Y(t)\;$ (indep.) suele identificar la familia sin integrar.

### Sumas de independientes con nombre propio (reproductividad) — ver [[suma-de-va-independientes]]
| Sumandos (independientes) | Suma $S$ |
|---|---|
| $n\times\mathrm{Bernoulli}(p)$ i.i.d. | $\mathrm{Bin}(n,p)$ |
| $\mathrm{Bin}(n_1,p)+\mathrm{Bin}(n_2,p)$ (misma $p$) | $\mathrm{Bin}(n_1+n_2,p)$ |
| $\mathrm{Poisson}(\lambda_1)+\mathrm{Poisson}(\lambda_2)$ | $\mathrm{Poisson}(\lambda_1+\lambda_2)$ |
| $\mathcal N(\mu_1,\sigma_1)+\mathcal N(\mu_2,\sigma_2)$ | $\mathcal N\!\big(\mu_1+\mu_2,\sqrt{\sigma_1^2+\sigma_2^2}\big)$ |
| $n\times\text{Expo}(\lambda)$ i.i.d. | $\mathrm{Gamma}(n,\lambda)=\mathrm{Erlang}_n(\lambda)$ |
| $\mathrm{Unif}(0,1)+\mathrm{Unif}(0,1)$ | **triangular** en $(0,2)$ (**NO** uniforme) |
| $\mathrm{Geo}(p)+\mathrm{Geo}(p)$ | $\mathrm{BinNeg}(2,p)$ |
| $\sum_{i=1}^n \mathcal N(0,1)^2$ | $\chi^2_n$ |

Normal + Normal: **suman medias y varianzas** (los desvíos NO suman). Gamma/Erlang: $\;f_{\Gamma(n,\lambda)}(x)=\dfrac{\lambda^n x^{n-1}e^{-\lambda x}}{(n-1)!}$ $(x>0)$, $E=\tfrac n\lambda$, $V=\tfrac n{\lambda^2}$.

### Desigualdades (cotas universales) — ver [[desigualdad-de-chebyshev]]
- **Markov** ($X\ge 0$), $\forall\,\alpha>0$: $\quad P(X\ge\alpha)\le\dfrac{E[X]}{\alpha}$.
- **Chebyshev** (media $\mu$, varianza $\sigma^2$), $\forall\,\varepsilon>0$: $\quad P(|X-\mu|\ge\varepsilon)\le\dfrac{\sigma^2}{\varepsilon^2}$.
- En términos de $k$ desvíos ($\varepsilon=k\sigma$): $\quad P(|X-\mu|\ge k\sigma)\le\dfrac1{k^2}$.
- Promedio i.i.d.: $\quad P(|\bar X_n-\mu|\ge\varepsilon)\le\dfrac{\sigma^2}{n\,\varepsilon^2}\xrightarrow{n\to\infty}0$ (puente a la LGN).

### Ley de los Grandes Números — ver [[ley-de-grandes-numeros]]
- **Débil (en probabilidad):** $\;\displaystyle\lim_{n\to\infty} P(|\bar X_n-\mu|\ge\varepsilon)=0\quad\forall\,\varepsilon>0$ (se prueba con Chebyshev).
- **Fuerte (casi segura):** $\;P\!\left(\displaystyle\lim_{n\to\infty}\bar X_n=\mu\right)=1$.

### Teorema Central del Límite — ver [[teorema-central-del-limite]]
$X_k$ i.i.d. con media $\mu$ y desvío $\sigma$; tipificada $\;Z_n=\dfrac{\bar X_n-\mu}{\sigma/\sqrt n}=\dfrac{S_n-n\mu}{\sqrt n\,\sigma}$:
$$ \lim_{n\to\infty}P(Z_n\le z)=\Phi(z). $$
Aproximaciones prácticas (regla usual $n>20$):
$$ \bar X_n\overset{\text{aprox}}{\sim}\mathcal N\!\Big(\mu,\tfrac{\sigma}{\sqrt n}\Big),\qquad S_n\overset{\text{aprox}}{\sim}\mathcal N\!\big(n\mu,\sqrt n\,\sigma\big),\qquad P(S_n\le s)\approx\Phi\!\Big(\tfrac{s-n\mu}{\sqrt n\,\sigma}\Big). $$
Frecuencia relativa ($\hat P_n=\tfrac1n\sum\mathbb 1_k(A)$, $p=P(A)$): $\;P(\hat P_n\le q)\approx\Phi\!\Big(\dfrac{q-p}{\sqrt{p(1-p)/n}}\Big)$.

### Aproximación normal de la binomial — ver [[aproximacion-normal-de-la-binomial]]
$$ \mathrm{Bin}(n,p)\approx\mathcal N\big(np,\sqrt{npq}\big),\qquad q=1-p. $$
**Corrección por continuidad** (v.a. discreta $\to$ continua, extremos incluidos se mueven hacia afuera):
$$ P(a\le S_n\le b)\approx\Phi\!\Big(\tfrac{b+\frac12-np}{\sqrt{npq}}\Big)-\Phi\!\Big(\tfrac{a-\frac12-np}{\sqrt{npq}}\Big),\qquad P(S_n=s)\approx\Phi\!\Big(\tfrac{s+\frac12-n\mu}{\sqrt n\,\sigma}\Big)-\Phi\!\Big(\tfrac{s-\frac12-n\mu}{\sqrt n\,\sigma}\Big). $$

> **LGN vs TCL:** La LGN dice *adónde* va el promedio (a $\mu$); el TCL dice *cómo* fluctúa (tamaño $\sigma/\sqrt n$, reescalado $\to$ Normal).

## U8 · Inferencia: estimación e intervalos

Resumen compacto. El detalle vive en [[formulario-inferencia|formulario de inferencia]] (estimación e IC) y [[formulario-pruebas-de-hipotesis|formulario de pruebas]]. Notación: $X_i$ i.i.d., $\mu=E[X_i]$, $\sigma^2=V(X_i)$, $\overline X_n=\frac1n\sum X_i$, confianza $\gamma$, significación $\alpha$.

### Estimación puntual

Estimador $\hat\theta=h(X_1,\dots,X_n)$. Calidad ([[estimacion-puntual|detalle]]):

| Concepto | Fórmula |
|---|---|
| Sesgo | $\mathrm{sesgo}(\hat\theta)=E[\hat\theta]-\theta$ |
| Insesgado | $E[\hat\theta]=\theta$ |
| ECM | $\mathrm{mse}(\hat\theta)=E[(\hat\theta-\theta)^2]=V(\hat\theta)+\mathrm{sesgo}^2(\hat\theta)$ |
| Consistente | $\lim_{n\to\infty}\mathrm{mse}(\hat\theta)=0$ |

**Estimadores clásicos** ($X_i$ i.i.d.):

| Parámetro | Estimador | ECM |
|---|---|---|
| Media $\mu$ | $\overline X_n=\frac1n\sum X_i$ | $\sigma^2/n$ |
| Proporción $p$ | $\hat p=\frac{X}{n}=\frac1n\sum X_i$ | $p(1-p)/n$ |
| Varianza $\sigma^2$ | $S_n^2=\frac{1}{n-1}\sum(X_i-\overline X_n)^2$ | ver [[varianza-muestral]] |

$S_n^2$ insesgado ($E[S_n^2]=\sigma^2$). Identidad de cálculo: $(n-1)S_n^2=\sum X_i^2-n\overline X_n^2$. Si normal, $\dfrac{(n-1)S_n^2}{\sigma^2}\sim\chi^2_{n-1}$ ([[distribucion-ji-cuadrado|ji-cuadrado]], [[varianza-muestral|detalle]]).

**Métodos de construcción** ([[estimacion-puntual|detalle]]):

- **Máxima verosimilitud (MV):** $\hat\theta=\arg\max_\theta\prod_i f(x_i;\theta)$; maximizar $\sum_i\ln f(x_i;\theta)$ (ojo: si $\theta$ está en el borde del soporte, maximizar por soporte, no derivando).
- **MAP (bayesiano):** $\hat\theta=\arg\max_\theta g(\theta\mid x)$ con $g(\theta\mid x)\propto f(x\mid\theta)\,g(\theta)$.
- **Momentos:** igualar $\mu_k=E[X^k]=H(\theta)$ al momento muestral $\hat\mu_k$ y despejar $\hat\theta=H^{-1}(\hat\mu_k)$.

### Intervalos de confianza

Semiamplitud bilateral $\Delta_B$ (IC bilateral $=\hat\theta\pm\Delta_B$); en unilaterales usar $\gamma$ en vez de $\frac{1+\gamma}{2}$. $z_p=\Phi^{-1}(p)$, $t_{m,p}=F_{T_m}^{-1}(p)$ ([[intervalos-de-confianza|detalle]]).

| Caso | Condición | $\Delta_B$ |
|---|---|---|
| Media, $\sigma$ conocido | normal (o $n$ grande, TCL) | $z_{\frac{1+\gamma}{2}}\dfrac{\sigma}{\sqrt n}$ |
| Proporción | $n$ grande | $z_{\frac{1+\gamma}{2}}\sqrt{\dfrac{\hat p(1-\hat p)}{n}}$ |
| Media, $\sigma$ desconocido | normal | $t_{n-1,\frac{1+\gamma}{2}}\dfrac{S_n}{\sqrt n}$ |

$$IC_\gamma(\mu)=\overline X_n\pm z_{\frac{1+\gamma}{2}}\frac{\sigma}{\sqrt n},\qquad
IC_\gamma(p)=\hat p\pm z_{\frac{1+\gamma}{2}}\sqrt{\frac{\hat p(1-\hat p)}{n}},\qquad
IC_\gamma(\mu)=\overline X_n\pm t_{n-1,\frac{1+\gamma}{2}}\frac{S_n}{\sqrt n}.$$

**Tamaño muestral** (error de muestreo $E$ = semiamplitud; despejar $n$):

| Objetivo | Fórmula |
|---|---|
| Media | $n\ge z_{\frac{1+\gamma}{2}}^2\,\dfrac{\sigma^2}{E^2}$ |
| Proporción (cota conservadora) | $n\ge z_{\frac{1+\gamma}{2}}^2\,\dfrac{1/4}{E^2}$ |
| Proporción (con $\hat p$ previo) | $n\ge z_{\frac{1+\gamma}{2}}^2\,\dfrac{\hat p(1-\hat p)}{E^2}$ |

## U9 · Pruebas de hipótesis

$H_0$ (se presume, lleva la igualdad) vs $H_1$. Errores ([[error-tipo-i-y-tipo-ii|detalle]]): tipo I = rechazar $H_0$ verdadera ($P\le\alpha$); tipo II = aceptar $H_0$ falsa ($\beta$); **potencia $=1-\beta$**. [[prueba-de-hipotesis|Marco general]].

**Estadísticos** ([[estadistico-de-prueba|detalle]], [[valor-p|valor p]]):

$$Z_{\text{media}}=\frac{\bar X-\mu_0}{\sigma/\sqrt n}\;(\sigma\text{ conocida o }n\text{ grande}),\qquad
T=\frac{\bar X-\mu_0}{S/\sqrt n}\sim t_{n-1}\;(\sigma\text{ desc., }n\text{ chico, normal}),$$
$$Z_{\text{prop}}=\frac{\hat q-q_0}{\sqrt{q_0(1-q_0)/n}}\;(n>100),\qquad \hat q=X/n.$$

**Región de rechazo** por cola:

| Prueba | $H_0\ /\ H_1$ | Rechaza si ($Z$) | Rechaza si ($T$) |
|---|---|---|---|
| Dos colas | $=\ /\ \ne$ | $\lvert Z\rvert>z_{1-\alpha/2}$ | $\lvert T\rvert>t_{n-1,1-\alpha/2}$ |
| Cola derecha | $\le\ /\ >$ | $Z>z_{1-\alpha}$ | $T>t_{n-1,1-\alpha}$ |
| Cola izquierda | $\ge\ /\ <$ | $Z<-z_{1-\alpha}$ | $T<-t_{n-1,1-\alpha}$ |

Valor crítico del estimador (media, $\sigma$ conocida): dos colas $\bar x_c=\mu_0\pm z_{1-\alpha/2}\frac{\sigma}{\sqrt n}$; cola derecha $\bar x_c=\mu_0+z_{1-\alpha}\frac{\sigma}{\sqrt n}$.

**Valor p** (rechazar $H_0\iff$ valor p $<\alpha$): cola derecha $1-\Phi(z_{\text{obs}})$; cola izquierda $\Phi(z_{\text{obs}})$; dos colas $2(1-\Phi(\lvert z_{\text{obs}}\rvert))$. Con $T$, reemplazar $\Phi$ por $\Xi_{n-1}$ (FDA de la [[distribucion-t-de-student|t]] con $n-1$ g.l.).
