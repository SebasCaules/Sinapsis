---
titulo: "Resumen de la Unidad 6 — Procesos Estocásticos"
tipo: resumen
unidad: 6
orden: 1
hub: true
tags: [resumen, procesos-estocasticos, proceso-de-conteo, markov]
resumen: "Familia de variables aleatorias indexada por el tiempo: caminata aleatoria, procesos de conteo de Bernoulli (Binomial, Geométrica) y de Poisson (Poisson, Exponencial, Erlang), y cadenas de Markov con $\vec p(n)=\vec p(0)\,\mathbb{P}^n$ y $\vec\pi=\vec\pi\,\mathbb{P}$."
fuentes: ["[[procesos-estocasticos]]", "[[caminata-aleatoria]]", "[[proceso-de-bernoulli]]", "[[proceso-de-poisson]]", "[[relacion-bernoulli-poisson]]", "[[cadenas-de-markov]]", "[[formulario-procesos-estocasticos]]"]
actualizado: 2026-11-09
---

# Resumen de la Unidad 6 — Procesos Estocásticos

Hasta la unidad 5 se trabajó con una o varias variables aleatorias «sueltas»: una foto al azar del experimento. La unidad 6 pasa a la **película**: una familia de variables aleatorias $\{X(t)\}$ indexada por el tiempo, que describe cómo evoluciona al azar un sistema. Casi no hay distribuciones nuevas: se reutilizan las de las unidades 3 y 4 (Binomial, Geométrica, Binomial negativa, Poisson, Exponencial, Normal), ahora organizadas en el tiempo. La [[distribucion-erlang|Erlang]], que aparece como tiempo hasta el $k$-ésimo evento de Poisson, y la [[suma-de-va-independientes|suma de variables independientes]] se desarrollan en detalle en la unidad 7. El recorrido es: definiciones generales y tres propiedades simplificadoras; la caminata aleatoria como ejemplo guía; los dos procesos de conteo (Bernoulli en tiempo discreto y Poisson en tiempo continuo) y el límite que los une; y por último las cadenas de Markov, donde todo se calcula con una matriz de transición.

> [!info] Lo esencial
> - Un proceso estocástico $\{X(t)\}_{t\in\mathbb{T}}$ se clasifica por su conjunto de índices $\mathbb{T}$ y su espacio de estados $\mathbb{E}$ (discretos o continuos); se simplifica con estacionariedad, incrementos independientes y estacionarios, y propiedad de Markov.
> - La caminata aleatoria $X_n=\sum Y_k$ tiene momentos por linealidad e independencia, $E[X_n]=n(2p-1)$ y $V(X_n)=4np(1-p)$; tiene incrementos independientes y estacionarios pero no es estacionaria.
> - Proceso de Bernoulli: conteo Binomial$(k,p)$, espera entre eventos Geométrica, espera al $k$-ésimo Binomial negativa, ambas contadas en **ensayos** ($E[\tau_i]=1/p$, $E[T_k]=k/p$).
> - Proceso de Poisson: conteo Poisson$(\lambda t)$, espera entre eventos Exponencial$(\lambda)$, espera al $k$-ésimo Erlang$(k,\lambda)$; la dualidad $T_k<t\iff N(t)\ge k$ convierte tiempos en conteos.
> - Cadenas de Markov: $\vec p(n)=\vec p(0)\,\mathbb{P}^n$ para $n$ pasos; $\vec\pi=\vec\pi\,\mathbb{P}$ para el largo plazo, verificando antes la regularidad; $\mathbb{M}=(\mathbb{I}-\mathbb{Q})^{-1}$ para la absorción.

> [!nota] Notación del wiki
> La varianza se escribe $V(X)$, como en el [[formulario-maestro|formulario maestro]]. $N(\mu,\sigma)$ lleva como segundo parámetro el **desvío** $\sigma$, no la varianza: por eso la caminata gaussiana es $N(0,\sqrt n)$ con $V(X_n)=n$. En el proceso de Bernoulli, $\tau_i$ y $T_k$ se cuentan en **ensayos** (ver la sección 4).

## 1. Qué es un proceso estocástico

Un **proceso estocástico** es una familia de variables aleatorias $\{X(t)\}_{t\in\mathbb{T}}$, donde $\mathbb{T}$ es el **conjunto de índices** (o espacio de parámetros). El conjunto de valores que toma cada $X(t)$ es el **espacio de estados** $\mathbb{E}$; el proceso es **discreto** o **continuo** según lo sea $\mathbb{E}$, y $\mathbb{T}$ también puede ser discreto ($\mathbb{T}=\mathbb{N}$) o continuo ($\mathbb{T}=(a,b)\subset\mathbb{R}$). Fijado un resultado del azar $\omega$, la función $t\mapsto X(t)$ es una **trayectoria**. Describir el proceso por completo exige dar las **distribuciones conjuntas** de $(X(t_1),\dots,X(t_n))$ para toda tupla de índices, lo que rara vez es sencillo.

La única relación que vale en **todo** proceso es la ecuación de **Chapman-Kolmogorov**, que en el caso discreto es una marginalización sobre el estado intermedio:

$$ p(x_1,t_1,\dots,x_{k-1},t_{k-1},x_{k+1},t_{k+1},\dots) = \sum_{x_k\in\mathbb{E}} p(x_1,t_1,\dots,x_k,t_k,\dots) $$

Aquí $p(x_i,t_i,\dots)$ es la probabilidad conjunta de que el proceso valga $x_i$ en el instante $t_i$, y la suma recorre todos los estados posibles en $t_k$.

Cómo reconocerlo: el primer paso de cualquier ejercicio de la unidad es identificar el par ($\mathbb{T}$, $\mathbb{E}$): tiempo discreto con estados discretos lleva a caminata, Bernoulli o cadena de Markov; tiempo continuo lleva a Poisson.

> [!figura] u6-que-mira-cada-propiedad-dos-ventanas-sobre-la-mi
> Dos ventanas móviles sobre una misma trayectoria: los histogramas de la izquierda muestran que la distribución del incremento depende solo del ancho de la ventana y no de dónde está. Los de la derecha muestran que la distribución de $X(t)$ sí cambia con $t$: el proceso tiene incrementos estacionarios sin ser estacionario.

Detalle: [[procesos-estocasticos|Procesos Estocásticos]]

## 2. Propiedades simplificadoras y proceso de conteo

Las tres simplificaciones acotan cuánto recuerda el sistema su pasado.

- **Proceso estacionario:** desplazar todos los índices un $\Delta t$ no cambia la distribución conjunta. Es **estacionario en sentido amplio** si solo $E[X(t)]$ y $V(X(t))$ son constantes (condición más débil).
- **Incrementos independientes:** para intervalos disjuntos, $X(t_2)-X(t_1)$ y $X(t_4)-X(t_3)$ son independientes. **Incrementos estacionarios:** la distribución de $X(t_2)-X(t_1)$ depende solo de la longitud del intervalo, no de dónde está.
- **Proceso de Markov:** el futuro depende solo del estado más reciente.

$$ p(x_1,t_1{+}\Delta t,\dots,x_n,t_n{+}\Delta t)=p(x_1,t_1,\dots,x_n,t_n) $$

Esta es la condición de **estacionariedad** (en sentido estricto), para cualquier $\Delta t$ y cualquier tupla de instantes.

$$ p(x_n,t_n\mid x_{n-1},t_{n-1},\dots,x_1,t_1)=p(x_n,t_n\mid x_{n-1},t_{n-1}) $$

Esta es la **propiedad de Markov**, para $t_1\le\dots\le t_n$. Con ella, Chapman-Kolmogorov toma su forma útil:

$$ p(x_3,t_3\mid x_1,t_1)=\sum_{x_2}p(x_3,t_3\mid x_2,t_2)\,p(x_2,t_2\mid x_1,t_1) $$

Para ir de $t_1$ a $t_3$ se suma sobre todos los estados intermedios $x_2$ en $t_2$. Si $\mathbb{E}$ es discreto, el proceso de Markov es una **cadena de Markov**.

Un **proceso de conteo** se asocia a los instantes $T_k$ en que ocurren eventos ($T_0=0$, crecientes):

$$ N(t)=\max\{k: T_k\le t\} $$

$N(t)$ cuenta los eventos hasta $t$; cumple $N(0)=0$, $N(t)\in\mathbb{N}_0$, es no decreciente, y $N(t)-N(s)$ es la cantidad de eventos en $(s,t]$. Los dos procesos de conteo de la materia son el de Bernoulli (tiempo discreto) y el de Poisson (tiempo continuo).

> [!warn] Media constante no implica estacionario
> Un proceso puede tener incrementos independientes y estacionarios sin ser estacionario: en TP6 Ej. 3, $E[X_n]=0$ pero $V(X_n)=1{,}3\,n$ crece con $n$, así que no es estacionario ni en sentido amplio.

Detalle: [[procesos-estocasticos#Propiedades simplificadoras|Propiedades simplificadoras]]

## 3. Caminata aleatoria

La **caminata aleatoria** es el ejemplo guía de la unidad: una partícula (o el capital de un jugador) que en cada paso suma $+1$ con probabilidad $p$ o $-1$ con probabilidad $1-p$. Es un proceso de **tiempo discreto** ($n\in\mathbb{N}_0$) con **estados discretos** ($\mathbb{E}=\mathbb{Z}$) y recorrido de $X_n$ igual a $\{-n,-n+2,\dots,n-2,n\}$. **Es de Markov**, tiene **incrementos independientes y estacionarios**, **no es estacionaria** (la varianza crece) y **no es un proceso de conteo** (puede decrecer).

$$ X_n=\sum_{k=1}^{n}Y_k,\qquad X_0=0,\qquad P(Y_k=+1)=p,\ P(Y_k=-1)=1-p $$

Los pasos $Y_k$ son i.i.d. El caso **simétrico** es $p=1/2$. Las ganancias $G_n\in\{0,1\}$, con $Y_n=2G_n-1$, forman un proceso de Bernoulli; su conteo $H_n\sim\text{Binomial}(n,p)$ determina $X_n=2H_n-n$, y de ahí sale la distribución:

$$ P(X_n=k)=\binom{n}{\frac{n+k}{2}}\,p^{\frac{n+k}{2}}(1-p)^{\frac{n-k}{2}},\qquad E[X_n]=n(2p-1),\quad V(X_n)=4np(1-p) $$

En el caso simétrico se reduce a $P(X_n=x)=\binom{n}{\frac{n+x}{2}}(\tfrac12)^n$, $E[X_n]=0$ y $V(X_n)=n$. La esperanza sale por **linealidad** y la varianza por **independencia** de los pasos. Para un paso i.i.d. general $Z_i$:

$$ X_n=\sum_{i=0}^{n-1}Z_i\ \Rightarrow\ E[X_n]=n\,E[Z_0],\qquad V(X_n)=n\,V(Z_0) $$

La **caminata gaussiana** (TP6 Ej. 4) usa pasos continuos $G_k\sim N(0,1)$ i.i.d.; como la suma de normales independientes es normal, $X_n\sim N(0,\sqrt n)$, con $E[X_n]=0$, $V(X_n)=n$ y $\mathbb{E}=\mathbb{R}$. Es el análogo discreto del **movimiento Browniano**. Por el TCL, la caminata simétrica estandarizada $X_n/\sqrt n$ tiende al mismo límite gaussiano.

Cómo reconocerla: «se gana o pierde 1 en cada jugada», «la partícula se mueve un lugar a izquierda o derecha»; piden $E[X_n]$, $V(X_n)$ o la distribución de $X_n$. La técnica es escribir $X_n$ como suma de i.i.d.

> [!warn] Discrepancia: parametrización de la normal
> La resolución de TP6 escribe la caminata gaussiana como $N(0,n)$ (parametrizada por la **varianza**); el resto del wiki usa $N(\mu,\sigma)$ (por el **desvío**), con lo que queda $N(0,\sqrt n)$. Es la misma ley: varianza $n$, desvío $\sqrt n$.

> [!figura] u6-trayectorias-de-la-caminata-y-el-abanico-n
> Varias trayectorias simuladas junto con la recta $E[X_n]=n(2p-1)$ y la banda $\pm k\sqrt{\text{Var}[X_n]}$, que se abre como $\sqrt{n}$. Observe que las trayectorias no vuelven a juntarse: con $p=1/2$ la media se queda en cero pero la dispersión crece, y por eso el proceso no es estacionario.

> [!figura] u6-caminata-1-contra-caminata-gaussiana-mismo-momen
> El peine discreto $P(X_n=x)$, que solo carga los enteros de la paridad de $n$, contra la densidad $N(0,\sqrt{n})$ (desvío $\sqrt{n}$, varianza $n$) multiplicada por el ancho del paso. Al subir $n$ los dos se encajan; la comparación de $P(|X_n|\le\sqrt n)$ con la aproximación normal muestra cuánto falta todavía para el límite.

Detalle: [[caminata-aleatoria|Caminata Aleatoria (Random Walk)]]

## 4. Proceso de Bernoulli

Es el **proceso de conteo de tiempo discreto**: en cada paso hay un ensayo de Bernoulli i.i.d. con probabilidad de éxito $p$ constante y **a lo sumo un evento por paso**. Se define por cuatro condiciones: incrementos independientes, incrementos estacionarios, $P(N(k{+}1)-N(k)=1)=p$ y $P(N(k{+}1)-N(k)=m)=0$ si $m>1$. El recorrido de $N(k)$ es $\{0,1,\dots,k\}$ y, a partir de los incrementos independientes, se prueba que es de **Markov**.

$$ P(N(k)=n)=\binom{k}{n}p^n(1-p)^{k-n} $$

Es decir, $N(k)\sim\text{Binomial}(k,p)$: $N(k)$ es la cantidad de éxitos en los primeros $k$ ensayos. Por incrementos estacionarios, el conteo en cualquier tramo depende solo de su longitud:

$$ P\big(N(m)-N(k)=n\big)=P\big(N(m{-}k)=n\big)\ \Rightarrow\ N(m)-N(k)\sim\text{Binomial}(m{-}k,p),\quad k\le m $$

Los **tiempos entre eventos** $\tau_i$ (cantidad de ensayos entre éxitos consecutivos) son **Geométrica**$(p)$ i.i.d., con falta de memoria, y el **tiempo hasta el $k$-ésimo evento** $T_k=\tau_1+\dots+\tau_k$ es **Binomial negativa**$(k,p)$.

Cómo reconocerlo: el tiempo avanza en pasos discretos y en cada paso ocurre o no un evento, de forma independiente y con $p$ fija. «¿Cuántos eventos en $k$ pasos?» lleva a Binomial; «¿cuántos pasos hasta el primero?», a Geométrica; «¿hasta el $k$-ésimo?», a Binomial negativa.

> [!warn] Dos convenciones de la geométrica
> Las páginas [[distribucion-geometrica]] y [[distribucion-binomial-negativa]] usan por defecto la convención «número de fracasos»: con $q=1-p$, $X\sim\text{Geométrica}(p)$ tiene $p_X(k)=q^k p$ y $E[X]=q/p$, y $X\sim\text{BinNeg}(k,p)$ cuenta los fracasos antes del $k$-ésimo éxito. En el proceso de Bernoulli, en cambio, $\tau_i$ es la **cantidad de ensayos** entre eventos (convención «número de ensayos»): $\tau_i=X+1$, con $p_{\tau}(k)=q^{k-1}p$ y $E[\tau_i]=1/p$. Del mismo modo, $T_k$ cuenta **ensayos** hasta el $k$-ésimo éxito, así que $T_k=X+k$ con $X\sim\text{BinNeg}(k,p)$: $P(T_k=n)=\binom{n-1}{k-1}q^{n-k}p^k$ para $n\ge k$ y $E[T_k]=k/p$. Aplicar a $T_k$ la PMF de la página de la binomial negativa sin el corrimiento de $k$ es un error. Esta convención de ensayos es la de la clase de la cátedra, que dibuja $T_k$ como el instante (número de ensayo) del $k$-ésimo éxito sobre el eje de tiempo, con $T_3=\tau_1+\tau_2+\tau_3$, y es la que usan la página del [[proceso-de-bernoulli|proceso de Bernoulli]] y el [[formulario-maestro|formulario maestro]]. El tiempo de vida de la cadena de TP6 Ej. 24, en cambio, sí usa la convención «fracasos» ($P(N=k)=(1-p)^k p$, $E[N]=\frac{1-p}{p}$). No conviene mezclar las versiones.

> [!figura] u6-anatomia-de-una-realizacion-de-bernoulli
> Una sola realización leída de tres maneras alineadas sobre el mismo eje de ensayos: el conteo $N(k)$ (éxitos en los primeros $k$ ensayos independientes, cada uno con éxito de probabilidad $p$ y fracaso de probabilidad $1-p$), la fila de ranuras éxito/fracaso, y los instantes $T_k$ —el ensayo del $k$-ésimo éxito— con las esperas $\tau_i$ entre dos éxitos consecutivos. Sirve para no confundir $\tau_i$ (geométrica) con $T_k$ (binomial negativa), ni el conteo con el tiempo.

Detalle: [[proceso-de-bernoulli|Proceso de Bernoulli]]

## 5. Proceso de Poisson

Es el **proceso de conteo de tiempo continuo** con **tasa** $\lambda>0$ (promedio de eventos por unidad de tiempo). Se define con cuatro condiciones: incrementos independientes, incrementos estacionarios, $P(N(t{+}h)-N(t)=1)=\lambda h+o(h)$ y $P(N(t{+}h)-N(t)>1)=o(h)$ (no hay eventos simultáneos), donde $f(h)=o(h)$ significa $\lim_{h\to0}f(h)/h=0$. De ellas sale el sistema de ecuaciones diferenciales para $P_n(t)=P(N(t)=n)$:

$$ \dot P_0(t)=-\lambda P_0(t),\ P_0(0)=1;\qquad \dot P_n(t)=-\lambda P_n(t)+\lambda P_{n-1}(t),\ P_n(0)=0\ (n\ge1) $$

Resolviendo por inducción ($P_0(t)=e^{-\lambda t}$, $P_1(t)=\lambda t\,e^{-\lambda t}$, …) se obtiene la distribución del conteo:

$$ P(N(t)=n)=\frac{(\lambda t)^n}{n!}\,e^{-\lambda t},\qquad E[N(t)]=V(N(t))=\lambda t $$

$N(t)\sim\text{Poisson}(\lambda t)$, y por incrementos estacionarios el conteo en cualquier intervalo de longitud $\tau$ es $\text{Poisson}(\lambda\tau)$. Los **tiempos entre eventos** son exponenciales:

$$ P(\tau_{n+1}>t)=P(N(t)=0)=e^{-\lambda t}\ \Rightarrow\ \tau_{n+1}\sim\text{Expo}(\lambda)\ \text{i.i.d.} $$

El **tiempo hasta el $k$-ésimo evento** $T_k=\tau_1+\dots+\tau_k$ es **Erlang**$(k,\lambda)$ (Gamma de parámetro entero). Caracterización alternativa: $N(t)$ es Poisson de tasa $\lambda$ si y solo si los $\tau_n$ son $\text{Expo}(\lambda)$ i.i.d. La herramienta clave para ejercicios es la **dualidad conteo-tiempo**:

$$ T_k< t \iff N(t)\ge k $$

Los dos sucesos son el mismo conjunto de resultados, así que tienen la misma probabilidad. Sirve para pasar de una Erlang, sin primitiva cerrada para $k$ general, a una suma finita de términos de Poisson; por ejemplo, $P(T_3>40)=P(N(40)<3)$.

Cómo reconocerlo: eventos «al azar» en tiempo continuo con un promedio constante (llamadas, arribos, emisión de partículas, fallas). «¿Cuántos en un tiempo $t$?» lleva a $\text{Poisson}(\lambda t)$; «¿tiempo hasta el próximo?», a Exponencial; «¿tiempo hasta el $k$-ésimo?», a Erlang o, por dualidad, a Poisson.

> [!warn] Unidades de la tasa y condicionamiento hacia atrás
> La tasa debe ajustarse a la longitud del intervalo: 4 clientes cada 6 minutos es $\lambda=2/3\ \text{min}^{-1}$, y 75 partículas por minuto en 20 s es $\lambda t=25$. Además, condicionar el futuro al pasado sí se reduce al incremento, $P(N(t_2)=n_2\mid N(t_1)=n_1)=P(N(t_2)-N(t_1)=n_2-n_1)$, pero condicionar el pasado al futuro **no**: para $t_1<t_2$, $\big(N(t_1)\mid N(t_2)=n_2\big)\sim\text{Binomial}(n_2,\,t_1/t_2)$. Tampoco es correcto decir que «la Poisson tiene falta de memoria»: la falta de memoria es de los tiempos entre eventos (Exponencial).

> [!figura] u6-el-intervalo-infinitesimal-t-t-h-y-las-tres-rama
> Las tres únicas maneras de llegar a $N(t+h)=n$ sobre un intervalo corto $[t,t+h]$, con la probabilidad de cada rama. Observe que la tercera vale $o(h)$ y por eso desaparece al dividir por $h$: de ahí salen los dos términos de $\dot P_n=-\lambda P_n+\lambda P_{n-1}$, y para eso sirve el axioma 4.

> [!figura] u6-dualidad-conteo-tiempo-la-escalera-n-t-y-los-ins
> La misma realización leída de dos maneras: arriba la escalera $N(t)$, abajo los instantes $T_k$ y los tiempos entre eventos $\tau_i$. Los $\tau_i$ son exponenciales i.i.d. de tasa $\lambda$ y $T_k=\tau_1+\cdots+\tau_k$, de modo que la escalera salta $+1$ en cada $T_i$. Mueva $t$ y $k$ e intente dejar uno de los dos sucesos verdadero y el otro falso: no se puede, y las dos probabilidades —una calculada como Erlang y la otra como Poisson— coinciden siempre.

Detalle: [[proceso-de-poisson|Proceso de Poisson]]

## 6. Relación entre los procesos de Bernoulli y de Poisson

El proceso de Poisson es el **límite continuo** del de Bernoulli: ambos son procesos de conteo con incrementos independientes y estacionarios y con propiedad de Markov; solo cambia que el tiempo es discreto o continuo. Se parte $[0,t]$ en $t/\Delta t$ intervalos de longitud $\Delta t$; en cada uno hay un evento con probabilidad $\approx\lambda\Delta t$ y más de uno con probabilidad $o(\Delta t)\approx0$. Así, $N(t)$ se comporta como un Bernoulli con $p=\lambda\Delta t$ y $k=t/\Delta t$ ensayos:

$$ N(t)\ \underset{\text{aprox}}{\sim}\ \text{Binomial}\!\left(\frac{t}{\Delta t},\,\lambda\,\Delta t\right)\ \xrightarrow[\Delta t\to0]{}\ \text{Poisson}(\lambda t) $$

Al tomar $\Delta t\to0$ con $kp=\lambda t$ fijo se recupera la aproximación Poisson de la binomial ($n$ grande, $p$ chico, $np=\lambda t$). La correspondencia de parámetros es $p=\lambda\,\Delta t$, y cada distribución discreta pasa a su análoga continua:

| | Bernoulli | Poisson |
|---|---|---|
| Tiempo | discreto | continuo |
| Parámetro | $p$ | $\lambda$ |
| Conteo $N(t)$ | Binomial | Poisson |
| Tiempo entre eventos | Geométrica i.i.d. | Exponencial i.i.d. |
| Tiempo hasta el $k$-ésimo | Binomial negativa | Erlang |

La Geométrica y la Exponencial comparten la **falta de memoria**, que es lo que hace a ambos procesos «sin memoria».

> [!warn] El paso de la discretización debe ser chico
> En TP6 Ej. 6 (75 partículas por minuto), discretizar 20 s en pasos de $\Delta t=1$ s da $p=\lambda\Delta t=1{,}25>1$, que no es una probabilidad válida: $\Delta t$ es demasiado grande para que haya «a lo sumo un evento por paso». Con $\Delta t=0{,}01$ s ($k=2000$, $p=0{,}0125$) la binomial da $\approx0{,}0519$, igual que la Poisson$(25)$.

> [!figura] u6-refinar-el-reloj-de-binomial-t-t-t-a-poisson-t
> Arriba, el intervalo $[0,t]$ partido en $m=t/\Delta t$ ranuras; abajo, la PMF de $\text{Binomial}(m,\lambda t/m)$ contra el perfil fijo de $\text{Poisson}(\lambda t)$. Al aumentar $m$ las barras se encajan sobre el perfil; con $m$ chico la lectura «estado del acoplamiento» avisa de $p=\lambda\Delta t>1$ —el error que se discute en el ejercicio resuelto de esta página— o de cuántos eventos comparten ranura: con ese $\Delta t$ el conteo discreto pierde eventos, y al achicarlo esa pérdida desaparece.

Detalle: [[relacion-bernoulli-poisson|Relación entre los procesos Bernoulli y Poisson]]

## 7. Cadenas de Markov: matriz de transición y evolución en $n$ pasos

Una **cadena de Markov** es un proceso de Markov con espacio de estados **discreto** $\mathbb{E}=\{s_1,s_2,\dots\}$; en la materia el tiempo también es discreto ($\mathbb{T}=\mathbb{N}_0$). Queda descripta por la **distribución inicial** $p_j(0)=P(X(0)=s_j)$ y las **probabilidades de transición** $p_{ij}(n)=P(X(n{+}1)=s_j\mid X(n)=s_i)$, que se ordenan en la **matriz de transición** $\mathbb{P}$: la fila $i$ es la distribución condicional de «a dónde se va desde $s_i$», por lo que **cada fila suma 1** (matriz estocástica). El **diagrama de estados** es el grafo equivalente: las etiquetas que salen de cada nodo suman 1.

$$ \vec p(n+1)=\vec p(n)\,\mathbb{P}(n) $$

$\vec p(n)=(p_1(n)\ p_2(n)\ \cdots)$ es el **vector fila** de probabilidades de estado en el instante $n$; esta es Chapman-Kolmogorov en forma matricial. Si la cadena es **homogénea** ($p_{ij}$ no depende de $n$):

$$ \vec p(n)=\vec p(0)\,\mathbb{P}^{n},\qquad \mathbb{P}^{(k)}=\mathbb{P}^{k} $$

$(\mathbb{P}^k)_{ij}$ es la probabilidad de ir de $s_i$ a $s_j$ en exactamente $k$ pasos: suma las probabilidades de todos los caminos de longitud $k$. Por ejemplo, $(\mathbb{P}^2)_{aa}=\sum_i p_{ai}\,p_{ia}$.

Cómo reconocerla: un sistema con pocos estados discretos y reglas «del estado actual al siguiente» con probabilidades fijas (clima, posición de un jugador, marca de un cliente, oportunidades de examen). Se arma $\mathbb{P}$ y el diagrama; «¿probabilidad de estar en tal estado tras $n$ pasos?» lleva a $\vec p(0)\mathbb{P}^n$. Si el condicionante incluye varios instantes, por la propiedad de Markov solo cuenta el último: $P(X_2=a\mid X_1=b,X_0=c)=p_{ba}$.

> [!warn] Dirección de la condicional
> $(\mathbb{P}^k)_{ij}$ solo sirve para condicionar hacia el futuro, $P(X(n+k)=s_j\mid X(n)=s_i)$. El sentido inverso no tiene atajo matricial: se resuelve con la definición de probabilidad condicional, es decir, con Bayes,
> $$ P(X(n){=}s_i\mid X(n{+}k){=}s_j)=\frac{P(X(n{+}k){=}s_j\mid X(n){=}s_i)\,P(X(n){=}s_i)}{P(X(n{+}k){=}s_j)} $$

> [!figura] u6-diagrama-de-estados-a-partir-de-la-matriz-p
> El grafo dirigido que corresponde a cada matriz $\mathbb{P}$, con las etiquetas $p_{ij}$ y los estados coloreados según sean recurrentes, transientes o absorbentes. Verifique que las etiquetas que salen de cada nodo suman 1, y compare la frecuencia de visitas acumulada con $\vec\pi$.

> [!figura] u6-convergencia-de-p-n-cuando-hay-y-cuando-no
> Las curvas $p_j(n)$ en las cuatro situaciones de la receta: converge sin depender de $\vec p(0)$, oscila sin converger, converge a un límite que sí depende de $\vec p(0)$, y estado transiente cuya curva cae a cero. Guarde una curva como referencia y cambie $\vec p(0)$ para ver en cuáles se mueve el límite y en cuáles no; la lectura «qué muestra esta cadena» resume el caso elegido.

> [!figura] u6-forma-canonica-los-bloques-i-0-f-q
> La misma matriz antes y después de reordenar los estados, con los cuatro bloques $\mathbb{I}$, $\mathbf{0}$, $\mathbb{F}$ y $\mathbb{Q}$ en colores. Note que el bloque $\mathbf{0}$ es nulo porque de un absorbente no se sale, y que el tiempo hasta la absorción se lee sumando la fila correspondiente de $\mathbb{M}=(\mathbb{I}-\mathbb{Q})^{-1}$. Las filas de $\mathbb{M}$ y de $\mathbb{G}=\mathbb{M}\,\mathbb{F}$ están al pie del dibujo y los totales, en las lecturas; cada fila de $\mathbb{G}$ suma 1.

Detalle: [[cadenas-de-markov#Matriz de transición|Cadenas de Markov — matriz de transición]]

## 8. Clasificación de estados y distribución estacionaria

En cadenas homogéneas, $s_j$ es **accesible** desde $s_i$ si $p_{ij}^{(n)}>0$ para algún $n$; si además hay vuelta, los estados **se comunican** y forman una **clase**. La cadena es **irreducible** si hay una sola clase. Con $r_i$ la probabilidad de volver a $s_i$ partiendo de $s_i$, el estado es **recurrente** si $r_i=1$ y **transitorio** si $r_i<1$. El **período** $m_i$ es el **mayor** entero tal que $p_{ii}^{(n)}=0$ cuando $n$ no es múltiplo de $m_i$; el estado es **periódico** si $m_i>1$ y **aperiódico** si $m_i=1$. Un estado es **absorbente** si $p_{ii}=1$.

La **distribución estacionaria** (o de largo plazo) es la que se reproduce a sí misma tras un paso:

$$ \vec\pi=\vec\pi\,\mathbb{P},\qquad \sum_j \pi_j=1 $$

$\vec\pi$ es el **autovector a izquierda** de $\mathbb{P}$ asociado al autovalor 1, normalizado para que sea distribución de probabilidad. Condición suficiente: si existe $n\ge1$ con **todas** las entradas de $\mathbb{P}^n$ positivas, la cadena es **regular**; entonces es irreducible, recurrente y aperiódica, y existe $\vec\pi=\lim_{n\to\infty}\vec p(n)$ **independiente** de $\vec p(0)$. Para buscar esa potencia conviene elevar al cuadrado sucesivamente ($\mathbb{P}^2$, $\mathbb{P}^4$, $\mathbb{P}^8$, …).

Si la cadena **no** es regular, la estructura decide:

| Estructura | ¿Hay $\vec\pi$? |
|---|---|
| Un único estado absorbente, accesible desde todos | Sí: la delta en ese estado |
| Dos o más estados absorbentes | No: el límite depende de $\vec p(0)$ |
| Estados transientes y el resto restringido es regular | Sí: 0 en los transientes y la estacionaria de la subcadena regular en el resto |
| Cadena periódica | Puede no existir como límite: $\mathbb{P}^n$ oscila sin converger, aunque los promedios temporales sí convergen |

Cómo reconocerla: «comportamiento a largo plazo», «fracción del tiempo en cada estado» o $P(X_{200}=a\mid X_0=b)$ con $n$ grande llevan a $\pi_a$.

> [!warn] Primero la regularidad, después el autovector
> Que la cadena sea regular es suficiente pero no necesario. Si no lo es y aun así se encuentra un vector con $\vec\pi=\vec\pi\mathbb{P}$ y $\sum\pi_i=1$, ese vector no necesariamente es la distribución estacionaria. Invertir el orden del razonamiento es uno de los errores más comunes del tema, aunque el número «dé bien» por casualidad.

Detalle: [[cadenas-de-markov#Distribución estacionaria|Cadenas de Markov — distribución estacionaria]]

## 9. Absorción, primera visita y tiempos medios

Con estados absorbentes $s_1,\dots,s_k$, se reordena $\mathbb{P}$ en **forma canónica** con bloques: $\mathbb{I}$ (absorbentes a absorbentes), $\mathbf{0}$ (de un absorbente no se sale), $\mathbb{F}$ (transitorios a absorbentes) y $\mathbb{Q}$ (transitorios a transitorios).

$$ \mathbb{M}=(\mathbb{I}-\mathbb{Q})^{-1},\qquad \mathbb{G}=\mathbb{M}\,\mathbb{F} $$

$\mathbb{M}(i,j)$ es la cantidad esperada de visitas al transitorio $j$ antes de la absorción, partiendo del transitorio $i$; la suma de cada fila, $\mathbb{M}\,(1,\dots,1)^{\top}$, da el tiempo total esperado hasta la absorción. $\mathbb{G}(i,j)$ es la probabilidad de ser absorbido por $s_j$ partiendo del transitorio $i$; cada fila de $\mathbb{G}$ suma 1.

> [!nota] Dos órdenes de la forma canónica
> La sección teórica escribe $\mathbb{P}=\begin{pmatrix}\mathbb{I}&\mathbf{0}\\ \mathbb{F}&\mathbb{Q}\end{pmatrix}$ (absorbentes primero, según TP6), mientras que el ejemplo de los videos escribe $\begin{pmatrix}\mathbb{Q}&\mathbb{F}\\ \mathbf{0}&\mathbb{I}\end{pmatrix}$ (transitorios primero). Los bloques son los mismos y $\mathbb{M}$ y $\mathbb{G}$ se calculan igual.

En una cadena **regular** no hay absorbentes e $\mathbb{I}-\mathbb{P}$ no es invertible (porque $\mathbb{P}$ tiene autovalor 1). En su lugar, con $\mathbb{W}$ la matriz que repite $\vec\pi$ en cada fila y $w_j=\pi_j$:

$$ \mathbb{Z}=(\mathbb{I}-\mathbb{P}+\mathbb{W})^{-1},\qquad E(T_{i,j})=\begin{cases}\dfrac{\mathbb{Z}(j,j)-\mathbb{Z}(i,j)}{w_j} & i\ne j\\[4pt] \dfrac{1}{w_j} & i=j\end{cases} $$

$E(T_{i,j})$ es el tiempo esperado de **primer paso** de $s_i$ a $s_j$; para $i=j$ es el **tiempo medio de recurrencia**, el recíproco de la probabilidad de largo plazo del estado.

La **probabilidad de primera visita** $q_{ij}(n)$ es la de llegar por primera vez a $j$ desde $i$ en exactamente $n$ pasos; como esos sucesos son disjuntos para distintos $n$:

$$ q_{ij}=\sum_{n\ge1}q_{ij}(n),\qquad E[T_{ij}]=\sum_{n\ge1}n\,q_{ij}(n) $$

Estas sumas suelen ser series geométricas, que se cierran con $\sum_{k\ge0}a^k=\frac{1}{1-a}$ y $\sum_{k\ge1}k\,a^{k-1}=\frac{1}{(1-a)^2}$, para una razón $|a|<1$. Una cadena de dos estados {vivo, muerto} con muerte absorbente da un tiempo de vida geométrico, $P(N=k)=(1-p)^k p$, $E[N]=\frac{1-p}{p}$ (convención «fracasos»).

Cómo reconocerlo: «probabilidad de terminar en tal estado final», «cuántos pasos en promedio hasta terminar» (absorbentes, $\mathbb{M}$ y $\mathbb{G}$); «cuánto se tarda en volver a tal estado» en una cadena regular ($\mathbb{Z}$ o $1/\pi_j$).

Detalle: [[cadenas-de-markov#Tiempo hasta absorción|Cadenas de Markov — absorción]], [[cadenas-de-markov#Tiempo de recurrencia / primer paso (cadenas regulares)|tiempos de recurrencia y primer paso]] y primera visita en [[cadenas-de-markov#Ejercicios resueltos|los ejercicios resueltos]]

## Cómo aparece en los parciales

- **Proceso como suma de i.i.d.** (TP6 Ej. 1, 2 y 3): se despliega la recurrencia $X_{n+1}=X_n+Z_n$ hasta $X_n=\sum Z_i$, se calcula $E[Z_0]$ y $V(Z_0)=E[Z_0^2]-E[Z_0]^2$, y se multiplica por $n$. La distribución de la caminata $\pm1$ sale de $X_n=2H_n-n$ con $H_n$ binomial. Suele pedirse además decidir si el proceso es estacionario, de Markov o de incrementos independientes.
- **Caminata gaussiana** (TP6 Ej. 4): suma de normales independientes, $X_n\sim N(0,\sqrt n)$, con espacio de estados $\mathbb{R}$.
- **Poisson con varias preguntas sobre el mismo proceso** (TP6 Ej. 8, banco con 4 clientes cada 6 minutos): conteo en un intervalo con $\text{Poisson}(\lambda t)$; tiempo de una atención con $\text{Expo}(\lambda)$ y $F_T(t)=1-e^{-\lambda t}$; tiempo de 10 atenciones con la dualidad $P(T_{10}<10)=P(N(10)\ge10)$. Resultados: $0{,}2149$, $0{,}1353$, $0{,}1941$ y $0{,}1374$.
- **Cambio de unidades y límite de Bernoulli** (TP6 Ej. 6): pasar la tasa al intervalo pedido y mostrar que la binomial con $\Delta t$ chico reproduce la Poisson.
- **Probabilidades condicionales del conteo**: hacia adelante se usa el incremento; hacia atrás, la binomial $\text{Binomial}(n_2,t_1/t_2)$ o la definición $P(A\mid B)=P(A\cap B)/P(B)$.
- **Cadena con matriz dada** (TP6 Ej. 17): propiedad de Markov para reducir el condicionante, $\mathbb{P}^2$ para dos pasos, verificar regularidad ($\mathbb{P}^2>0$) y resolver $\vec\pi=\vec\pi\mathbb{P}$ para $n$ grande; allí $\vec\pi=(10/27,7/27,10/27)$.
- **Clases y primera visita** (TP6 Ej. 22): identificar clases comunicantes, transitorias, recurrentes y periódicas; sumar series geométricas de $q_{ij}(n)$; restringir a la clase cerrada y hallar su estacionaria.
- **Cadenas absorbentes** (TP6 Ej. 24 y 25, ejemplos de los videos): armar $\mathbb{P}$ desde el enunciado, iterar $\vec p(n+1)=\vec p(n)\mathbb{P}$, hallar el límite, y calcular $\mathbb{M}=(\mathbb{I}-\mathbb{Q})^{-1}$ y $\mathbb{M}\mathbb{F}$ para tiempos y probabilidades de absorción.
- **Tiempos de recurrencia en cadenas regulares** y **estacionaria con un estado transiente**: matriz $\mathbb{Z}$; poner 0 en el transiente y resolver la subcadena regular.
- **Problemas de examen reales** ([[ejercicios-de-parcial-resueltos]], catalogados en [[evaluaciones]]): Poisson con condicional hacia atrás, Erlang por dualidad y **elegir $t$** para que $P(N(t)\ge50)>0{,}9$ con la aproximación normal $N(t)\approx N(\lambda t,\sqrt{\lambda t})$ y corrección por continuidad (final 05/12/2025, Ej. 2: $t\approx712{,}5$ min); Poisson con aproximación normal y cadena con estado absorbente y tiempo medio hasta la absorción (2do parcial 11/6/2024); cadena regular con estacionaria (parcial 25/10/2025); cadena de dos estados con Bayes temporal (final 22/7/2024).

## Tabla de fórmulas de la unidad

| Qué | Fórmula | Cuándo se usa |
|---|---|---|
| Proceso de conteo | $N(t)=\max\{k:T_k\le t\}$ | Definir el conteo a partir de los instantes de los eventos |
| Propiedad de Markov | $p(x_n,t_n\mid x_{n-1},t_{n-1},\dots,x_1,t_1)=p(x_n,t_n\mid x_{n-1},t_{n-1})$ | Reducir el condicionante al último estado |
| Chapman-Kolmogorov (Markov) | $p(x_3,t_3\mid x_1,t_1)=\sum_{x_2}p(x_3,t_3\mid x_2,t_2)\,p(x_2,t_2\mid x_1,t_1)$ | Pasar por un instante intermedio |
| Suma de pasos i.i.d. | $E[X_n]=nE[Z_0]$, $V(X_n)=nV(Z_0)$ | Momentos de una caminata general |
| Caminata $\pm1$ | $E[X_n]=n(2p-1)$, $V(X_n)=4np(1-p)$ | Momentos de la caminata con moneda cargada |
| Distribución de la caminata | $P(X_n=k)=\binom{n}{(n+k)/2}p^{(n+k)/2}(1-p)^{(n-k)/2}$ | Vía $X_n=2H_n-n$, $H_n\sim\text{Bin}(n,p)$ |
| Caminata gaussiana | $X_n\sim N(0,\sqrt n)$ | Pasos $N(0,1)$ i.i.d. |
| Conteo de Bernoulli | $P(N(k)=n)=\binom{k}{n}p^n(1-p)^{k-n}$ | Éxitos en $k$ pasos discretos |
| Incremento de Bernoulli | $N(m)-N(k)\sim\text{Bin}(m-k,p)$ | Conteo en un tramo de pasos |
| Conteo de Poisson | $P(N(t)=n)=\frac{(\lambda t)^n}{n!}e^{-\lambda t}$ | Eventos en un intervalo de longitud $t$ |
| Momentos de Poisson | $E[N(t)]=V(N(t))=\lambda t$ | Media y varianza del conteo |
| Tiempo entre eventos | $P(\tau>t)=e^{-\lambda t}$ | Espera hasta el próximo evento (Exponencial) |
| Dualidad conteo-tiempo | $T_k<t\iff N(t)\ge k$ | Probabilidades de una Erlang vía Poisson |
| Pasado dado el futuro | $\big(N(t_1)\mid N(t_2)=n_2\big)\sim\text{Bin}(n_2,t_1/t_2)$ | Condicionar hacia atrás, $t_1<t_2$ |
| Límite Bernoulli a Poisson | $p=\lambda\Delta t$, $\text{Bin}(t/\Delta t,\lambda\Delta t)\to\text{Poisson}(\lambda t)$ | Aproximar o conectar los dos procesos |
| Un paso de la cadena | $\vec p(n+1)=\vec p(n)\,\mathbb{P}$ | Avanzar la distribución de estados |
| $n$ pasos (homogénea) | $\vec p(n)=\vec p(0)\,\mathbb{P}^n$ | Probabilidad de estado tras $n$ pasos |
| Bayes en la cadena | $P(X_n{=}s_i\mid X_{n+k}{=}s_j)=\frac{(\mathbb{P}^k)_{ij}\,P(X_n=s_i)}{P(X_{n+k}=s_j)}$ | Condicionar al futuro |
| Distribución estacionaria | $\vec\pi=\vec\pi\,\mathbb{P}$, $\sum_j\pi_j=1$ | Largo plazo, tras verificar regularidad |
| Matriz fundamental | $\mathbb{M}=(\mathbb{I}-\mathbb{Q})^{-1}$ | Visitas esperadas a transitorios antes de absorber |
| Probabilidades de absorción | $\mathbb{G}=\mathbb{M}\,\mathbb{F}$ | Probabilidad de terminar en cada absorbente |
| Tiempo hasta absorción | $\mathbb{M}\,(1,\dots,1)^{\top}$ | Pasos esperados hasta absorber |
| Matriz $\mathbb{Z}$ | $\mathbb{Z}=(\mathbb{I}-\mathbb{P}+\mathbb{W})^{-1}$ | Tiempos de primer paso en cadena regular |
| Primer paso | $E(T_{i,j})=\frac{\mathbb{Z}(j,j)-\mathbb{Z}(i,j)}{w_j}$ | De $s_i$ a $s_j$, con $i\ne j$ |
| Recurrencia | $E(T_{j,j})=1/w_j$ | Volver a $s_j$ en cadena regular |
| Primera visita | $q_{ij}=\sum_{n\ge1}q_{ij}(n)$ | Probabilidad de alcanzar $j$ desde $i$ |
| Tiempo de vida geométrico | $P(N=k)=(1-p)^k p$, $E[N]=\frac{1-p}{p}$ | Cadena de dos estados con absorbente |

Hoja completa: [[formulario-procesos-estocasticos|Formulario — Procesos Estocásticos]]
