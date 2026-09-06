---
titulo: Procesos Estocásticos
resumen: 'Familia de variables aleatorias $\{X(t)\}$ indexada por el tiempo que modela un sistema en evolución al azar; es el hub de la unidad 6. Se vuelve manejable con tres simplificaciones: estacionariedad, incrementos independientes y propiedad de Markov.'
tipo: concepto
unidad: 6
orden: 1
hub: true
tags: [procesos-estocasticos, hub]
fuentes: ["[[teorica-procesos-estocasticos-introduccion]]", "[[tp6-procesos-estocasticos]]"]
actualizado: 2026-09-04
---

# Procesos Estocásticos

**En breve.** Un proceso estocástico es una "película" aleatoria: una colección
de [[variable-aleatoria|variables aleatorias]] indexadas por el tiempo que
describe cómo evoluciona al azar un sistema. Es el hub de la unidad 6 y el marco
común de la [[caminata-aleatoria|caminata aleatoria]], los procesos de
[[proceso-de-bernoulli|Bernoulli]]/[[proceso-de-poisson|Poisson]] y las
[[cadenas-de-markov|cadenas de Markov]].

**Hub de la unidad 6.** Un **proceso estocástico** es una familia de variables
aleatorias $\{X(t)\}_{t\in\mathbb{T}}$, donde $\mathbb{T}$ es el **conjunto de
índices** (o espacio de parámetros) del proceso. Modela un sistema que evoluciona
en el tiempo (o en el espacio) sufriendo fluctuaciones al azar
(según [[teorica-procesos-estocasticos-introduccion]]).

> **Intuición.** Una variable aleatoria sola te da una foto al azar; un proceso
> estocástico te da una secuencia entera de fotos correlacionadas. Fijado un
> resultado del azar $\omega$, la función $t\mapsto X(t)$ es una **trayectoria**
> concreta; al variar $\omega$ se obtienen todas las trayectorias posibles. Las tres
> propiedades simplificadoras de abajo son distintas formas de acotar *cuánto*
> recuerda el sistema su pasado, para que describirlo sea manejable.

- **Espacio de estados** $\mathbb{E}$: el conjunto de valores que toma cada
  $X(t)$.
- El proceso es **discreto** o **continuo** según lo sea $\mathbb{E}$. El
  conjunto de parámetros $\mathbb{T}$ también puede ser discreto ($\mathbb{T}=
  \mathbb{N}$) o continuo ($\mathbb{T}=(a,b)\subset\mathbb{R}$).

Describir completamente un proceso requiere dar las **distribuciones conjuntas**
de $\{X(t_1),\dots,X(t_n)\}$ para toda tupla de índices. Como esto rara vez es
sencillo, se usan **simplificaciones**: procesos estacionarios, de incrementos
independientes, y procesos de Markov.

## Ecuación de Chapman-Kolmogorov
Vale en **todo** proceso estocástico. En el caso discreto, marginalizando sobre
el estado intermedio en $t_k$:
$$ p(x_1,t_1,\dots,x_{k-1},t_{k-1},x_{k+1},t_{k+1},\dots) = \sum_{x_k\in\mathbb{E}} p(x_1,t_1,\dots,\mathbf{x_k},\mathbf{t_k},\dots). $$
En los [[#Proceso de Markov|procesos de Markov]] adopta su forma simple y útil.

## Propiedades simplificadoras

### Proceso estacionario
$\{X(t)\}_t$ es **estacionario** sii desplazar todos los índices un $\Delta t$ no
cambia la distribución conjunta:
$$ p(x_1,t_1{+}\Delta t,\dots,x_n,t_n{+}\Delta t)=p(x_1,t_1,\dots,x_n,t_n). $$
Es decir, $\{X(t)\}_t$ no se distingue de $\{X(t+\Delta t)\}_t$. Es
**estacionario en sentido amplio** si solo $E[X(t)]$ y $\text{Var}[X(t)]$ son
constantes (condición más débil).

### Incrementos independientes y estacionarios
- **Incrementos independientes:** para intervalos disjuntos $[t_1,t_2]\cap[t_3,t_4]
  =\emptyset$, los incrementos $X(t_2)-X(t_1)$ y $X(t_4)-X(t_3)$ son v.a.
  independientes. Los cambios en partes separadas del tiempo no se influyen.
- **Incrementos estacionarios:** $X(t_2)-X(t_1)$ y $X(t_2{+}\Delta t)-X(t_1{+}
  \Delta t)$ tienen la **misma distribución**. El incremento depende solo de la
  longitud del intervalo, no de dónde está.

> [!figura] u6-que-mira-cada-propiedad-dos-ventanas-sobre-la-mi
> Dos ventanas móviles sobre una misma trayectoria: los histogramas de la izquierda muestran que la distribución del incremento depende solo del ancho de la ventana y no de dónde está. Los de la derecha muestran que la distribución de $X(t)$ sí cambia con $t$: el proceso tiene incrementos estacionarios sin ser estacionario.

### Proceso de Markov
$\{X(t)\}_t$ es un **proceso de Markov** sii, para $t_1\le\dots\le t_n$,
$$ p(x_n,t_n\mid x_{n-1},t_{n-1},\dots,x_1,t_1)=p(x_n,t_n\mid x_{n-1},t_{n-1}). $$
El futuro depende **solo del estado más reciente**, no de toda la historia. Aquí
Chapman-Kolmogorov se simplifica a $p(x_3,t_3\mid x_1,t_1)=\sum_{x_2}p(x_3,t_3\mid
x_2,t_2)\,p(x_2,t_2\mid x_1,t_1)$. Cuando $\mathbb{E}$ es discreto se trata de una
[[cadenas-de-markov|cadena de Markov]].

> **Intuición (Markov = "sin memoria del camino").** Para predecir el mañana solo
> importa dónde está hoy, no cómo se llegó hasta ahí. Es la misma idea de
> [[independencia|independencia]] del pasado dado el presente que tiene la
> [[distribucion-exponencial|exponencial]] (falta de memoria) en tiempo continuo y
> la [[distribucion-geometrica|geométrica]] en tiempo discreto.

## Proceso de conteo
Dado un proceso $\{T_k\}$ que marca los instantes de ocurrencia de eventos ($T_0=
0$, $k\le m\Rightarrow T_k\le T_m$), se le asocia el **proceso de conteo**
$$ N(t)=\max\{k: T_k\le t\}, $$
que cuenta los eventos hasta el instante $t$. Cumple $N(0)=0$, $N(t)\in
\mathbb{N}_0$, $s\le t\Rightarrow N(s)\le N(t)$, y $N(t)-N(s)$ = # de eventos en
$(s,t]$. Los dos procesos de conteo estrella de la materia son:
- [[proceso-de-bernoulli|Proceso de Bernoulli]] — tiempo **discreto**.
- [[proceso-de-poisson|Proceso de Poisson]] — tiempo **continuo**.
- Su vínculo: [[relacion-bernoulli-poisson|Poisson como límite de Bernoulli]].

## Páginas de la unidad
- [[caminata-aleatoria]] — el ejemplo guía (random walk).
- [[proceso-de-bernoulli]], [[proceso-de-poisson]], [[relacion-bernoulli-poisson]].
- [[cadenas-de-markov]] — Markov con espacio de estados discreto.

## Ejercicio resuelto
*De [[tp6-procesos-estocasticos]] Ej. 3. Proceso en tiempo discreto $X_{n+1}=X_n+
Z_n$ ($n=0,1,2,\dots$, $X_0=0$), con $Z_n$ i.i.d. de recorrido $\{-2,-1,0,1,2\}$
y $p_Z(\pm2)=0.1$, $p_Z(\pm1)=0.25$, $p_Z(0)=0.3$. Hallar $E[X_n]$ y
$\text{Var}[X_n]$.*

**Planteo.** Expresamos el proceso como
[[suma-de-variables-aleatorias|suma de v.a. independientes]].
Desplegando la recurrencia desde $X_0=0$:
$$ X_1=Z_0,\quad X_2=Z_0+Z_1,\quad X_3=Z_0+Z_1+Z_2 \;\Rightarrow\; X_n=\sum_{i=0}^{n-1}Z_i. $$

**Esperanza.** Por linealidad, con $E[Z_i]=\sum_z z\,p_Z(z)=0$ (la distribución
es simétrica respecto de $0$):
$$ E[X_n]=\sum_{i=0}^{n-1}E[Z_i]=0. $$

**Varianza.** Como las $Z_i$ son **independientes**, la varianza de la suma es la
suma de varianzas; y como son idénticamente distribuidas, $\text{Var}[Z_i]=
\text{Var}[Z_0]$:
$$ \text{Var}[Z_0]=E[Z_0^2]-\underbrace{E[Z_0]^2}_{0}=\sum_{i}i^2 p_Z(i)=4(0.1)+1(0.25)+0+1(0.25)+4(0.1)=1.3. $$
$$ \text{Var}[X_n]=\sum_{i=0}^{n-1}\text{Var}[Z_0]=1.3\,n. $$

**Resultado.** $E[X_n]=0$ y $\text{Var}[X_n]=1.3\,n$ (crece con $n$: el proceso
tiene [[#Incrementos independientes y estacionarios|incrementos independientes y estacionarios]] pero **no** es estacionario).
