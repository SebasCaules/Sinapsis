---
titulo: Proceso de Poisson
resumen: 'Proceso de conteo en tiempo continuo con tasa $\lambda$ constante: el conteo en un intervalo de longitud $t$ es $\mathrm{Poisson}(\lambda t)$ y los tiempos entre eventos son exponenciales i.i.d. Es el límite continuo del proceso de Bernoulli.'
tipo: concepto
unidad: 6
orden: 4
tags: [procesos-estocasticos, continuo, proceso-de-conteo]
fuentes: ["[[teorica-proceso-de-poisson]]", "[[tp6-procesos-estocasticos]]", "[[video-procesos-de-poisson]]"]
actualizado: 2026-09-04
---

# Proceso de Poisson

**En breve.** Modela eventos que caen "al azar" en tiempo continuo a una tasa
$\lambda$ constante (llamadas, arribos, fallas). Es el **límite continuo** del
[[proceso-de-bernoulli|proceso de Bernoulli]]: conteos $\sim$
[[distribucion-poisson|Poisson]], tiempos entre eventos $\sim$
[[distribucion-exponencial|Exponencial]].

**Modela:** la ocurrencia de eventos "al azar" en **tiempo continuo** a una tasa
constante: llamadas a una central, arribos a una cola, emisión de partículas,
fallas de un sistema, etc.
**Tipo:** [[procesos-estocasticos#Proceso de conteo|proceso de conteo]] de tiempo
continuo.

> **Intuición.** Tome un [[proceso-de-bernoulli|proceso de Bernoulli]] y haga los
> ticks del reloj infinitamente finos: en cada instante diminuto $h$ hay un evento
> con probabilidad $\lambda h$ (a lo sumo uno). El conteo Binomial se vuelve
> [[distribucion-poisson|Poisson]] y la espera Geométrica se vuelve
> [[distribucion-exponencial|Exponencial]]. La **tasa** $\lambda$ es el promedio de
> eventos por unidad de tiempo; todo lo demás sale de ahí ajustando unidades.

## Definición
$\{N(t)\}_{t\ge0}$ es un **proceso de Poisson con tasa $\lambda>0$** sii es un
proceso de conteo que cumple (según [[teorica-proceso-de-poisson]]):
1. Tiene [[procesos-estocasticos#Incrementos independientes y estacionarios|incrementos independientes]].
2. Los incrementos son **estacionarios**.
3. $P\big(N(t{+}h)-N(t)=1\big)=\lambda h+o(h)$ (un evento en un intervalo corto $h$).
4. $P\big(N(t{+}h)-N(t)>1\big)=o(h)$ (no hay eventos simultáneos).

Notación de **infinitésimo**: $f(h)=o(h)$ sii $\displaystyle\lim_{h\to0}\frac{f(h)}{h}=0$.
La condición 3 dice que $\lambda$ es la **tasa de generación de eventos**; la 2
garantiza que el proceso luce igual en cualquier intervalo de la misma longitud;
la 4 prohíbe eventos simultáneos.

> [!figura] u6-el-intervalo-infinitesimal-t-t-h-y-las-tres-rama
> Las tres únicas maneras de llegar a $N(t+h)=n$ sobre un intervalo corto $[t,t+h]$, con la probabilidad de cada rama. Observe que la tercera vale $o(h)$ y por eso desaparece al dividir por $h$: de ahí salen los dos términos de $\dot P_n=-\lambda P_n+\lambda P_{n-1}$, y para eso sirve el axioma 4.

## Distribución de los conteos
A partir de las condiciones se deduce el **sistema de ecuaciones diferenciales**
para $P_n(t)=P(N(t)=n)$:
$$ \dot P_0(t)=-\lambda P_0(t),\quad P_0(0)=1; \qquad \dot P_n(t)=-\lambda P_n(t)+\lambda P_{n-1}(t),\quad P_n(0)=0\ (n\ge1). $$
Resolviendo por inducción ($P_0(t)=e^{-\lambda t}$, $P_1(t)=\lambda t\,e^{-\lambda t}$, …)
se obtiene $N(t)\sim$ [[distribucion-poisson|Poisson]]$(\lambda t)$:
$$ \boxed{\,P(N(t)=n)=\frac{(\lambda t)^n}{n!}\,e^{-\lambda t}\quad(n\ge0).\,} $$
Por incrementos estacionarios, el conteo en cualquier intervalo de longitud
$\tau$ es $\text{Poisson}(\lambda\tau)$. En particular $E[N(t)]=\text{Var}[N(t)]=
\lambda t$.

## Tiempos entre eventos
Sea $\tau_{n+1}$ el tiempo desde el evento $n$ hasta el $n{+}1$. Como
$P(\tau_{n+1}>t)=P(\Delta N(t)=0)=P(N(t)=0)=e^{-\lambda t}$ para $t>0$:
$$ F_{\tau_{n+1}}(t)=1-e^{-\lambda t}\quad (t>0), $$
de donde $\tau_{n+1}\sim$ [[distribucion-exponencial|Exponencial]]$(\lambda)$ i.i.d.
El **tiempo hasta el $k$-ésimo evento** $T_k=\tau_1+\dots+\tau_k$ es
[[suma-de-variables-aleatorias|suma]] de $k$ exponenciales i.i.d., es decir una
**[[distribucion-erlang|Erlang]]$(k,\lambda)$** (Gamma de parámetro entero).

> **Caracterización alternativa:** $N(t)$ es un proceso de Poisson de tasa
> $\lambda$ $\iff$ los tiempos entre eventos $\tau_n\sim\text{Expo}(\lambda)$
> i.i.d. ($n\ge1$).

## Dualidad conteo ↔ tiempo (clave para ejercicios)
$T_k$ = instante del $k$-ésimo evento. Entonces, mirando la definición de proceso
de conteo:
$$ T_k< t \iff N(t)\ge k. $$
Esto permite pasar de preguntas sobre **tiempos** (Erlang/Exponencial) a preguntas
sobre **conteos** (Poisson) y viceversa.

> [!figura] u6-dualidad-conteo-tiempo-la-escalera-n-t-y-los-ins
> La misma realización leída de dos maneras: arriba la escalera $N(t)$, abajo los instantes $T_k$ y los tiempos entre eventos $\tau_i$. Los $\tau_i$ son exponenciales i.i.d. de tasa $\lambda$ y $T_k=\tau_1+\cdots+\tau_k$, de modo que la escalera salta $+1$ en cada $T_i$. Mueva $t$ y $k$ e intente dejar uno de los dos sucesos verdadero y el otro falso: no se puede, y las dos probabilidades —una calculada como Erlang y la otra como Poisson— coinciden siempre.

> **Por qué vale la dualidad (igualdad de eventos).** La equivalencia
> $T_k<t \iff N(t)\ge k$ no es una coincidencia numérica: los sucesos $\{T_k<t\}$ y
> $\{N(t)\ge k\}$ son literalmente el **mismo conjunto** de resultados (se prueba
> por inclusión mutua: si el $k$-ésimo evento llega antes de $t$, hasta $t$ hubo al
> menos $k$ eventos, y viceversa). Por eso sus probabilidades coinciden
> automáticamente, sin necesidad de calcular ninguna de las dos por separado. Es lo
> que permite pasar de $P(T_k>t)$ (una [[distribucion-erlang|Erlang/Gamma]] sin
> primitiva cerrada para $k$ general) a $P(N(t)<k)$ (suma finita de términos de
> [[distribucion-poisson|Poisson]]), como en el ejercicio $P(T(3)>40)=P(N(40)<3)$
> de [[video-procesos-de-poisson]] (verificado allí también con `pgamma` en
> software).

## Errores comunes al condicionar incrementos

Al calcular $P(N(t_2)=n_2\mid N(t_1)=n_1)$ con intervalos $[0,t_1]\subset[0,t_2]$
que se superponen, conviene partir siempre de la **definición** de condicional
$P(A\mid B)=P(A\cap B)/P(B)$ y no de atajos (de [[video-procesos-de-poisson]]):

- **Condicionar el futuro al pasado** ($t_1<t_2$, se conoce $N(t_1)=n_1$ y se
  pregunta por $N(t_2)$): el atajo de reemplazar la intersección directamente por
  el incremento, $P(N(t_2)-N(t_1)=n_2-n_1)$, es **válido** — restar $n_1$ a ambos
  lados de $N(t_2)=n_2$ dentro de la intersección no pierde información, porque el
  condicionante ya fija $N(t_1)=n_1$.
- **Condicionar el pasado al futuro** ($P(N(t_1)=n_1\mid N(t_2)=n_2)$): aplicar el
  mismo atajo sin desarrollarlo es un **error frecuente**: la probabilidad *no* se
  reduce a la del incremento $N(t_2)-N(t_1)$, porque el condicionante fija
  $N(t_2)=n_2$ pero deja libre qué pasó en $[0,t_1]$. Desarrollando bien la
  intersección, el resultado tiene estructura de
  $\text{Binomial}(n_2,\,t_1/t_2)$: condicionado a $n_2$ eventos totales en
  $[0,t_2]$, cada uno cae de forma independiente y uniforme en $[0,t_2]$, así que
  la cantidad que cae en $[0,t_1]$ es $\text{Binomial}(n_2,\,t_1/t_2)$.
- Por la misma razón, **no es correcto decir que "la Poisson tiene falta de
  memoria"**: la falta de memoria es propiedad de los **tiempos entre eventos**
  ([[distribucion-exponencial|Exponencial]]), no algo aplicable sin más a los
  incrementos del conteo al condicionar hacia atrás.

## Relaciones con otras distribuciones / procesos
- Marginal: [[distribucion-poisson|Poisson]]; tiempos entre eventos:
  [[distribucion-exponencial|Exponencial]] (falta de memoria); tiempo al
  $k$-ésimo: [[distribucion-erlang|Erlang]].
- Es la **versión continua** del [[proceso-de-bernoulli|proceso de Bernoulli]]:
  ver [[relacion-bernoulli-poisson]].

## Cuándo usarlo (reconocer en un ejercicio)
- Eventos que ocurren "al azar" en tiempo continuo a un **promedio/tasa**
  constante ($\lambda$ por unidad de tiempo).
- "¿Cuántos eventos en un tiempo $t$?" → Poisson($\lambda t$). "¿Tiempo hasta el
  próximo / entre eventos?" → Exponencial. "¿Tiempo hasta el $k$-ésimo?" → Erlang.
- Recuerde ajustar la tasa a la longitud del intervalo (mismas unidades).

## Ejercicio resuelto
*De [[tp6-procesos-estocasticos]] Ej. 8 (resuelto). En un banco se atiende en
promedio a 4 clientes cada 6 minutos según un proceso de Poisson. Calcular: (a)
$P(\ge6$ clientes en 6 min$)$; (b) $P($atender un cliente tome $>3$ min$)$; (c)
$P($atención entre 2 y 4 min$)$; (d) $P($atender 10 clientes tome $<10$ min$)$.*

**Tasa.** $\lambda=\dfrac{4}{6}=\dfrac23\ \text{min}^{-1}$.

**(a)** En 6 min, $N(6)\sim\text{Poisson}(\lambda\cdot6)=\text{Poisson}(4)$:
$$ P(N(6)\ge6)=1-\sum_{k=0}^{5}\frac{4^k}{k!}e^{-4}\approx 1-0.7851=0.2149. $$

**(b)–(c)** El tiempo de atención (entre eventos) $T\sim\text{Expo}(2/3)$, en
minutos. Usando $F_T(t)=1-e^{-\frac23 t}$:
$$ P(T>3)=e^{-\frac23\cdot3}=e^{-2}\approx 0.1353. $$
$$ P(2<T<4)=F_T(4)-F_T(2)=e^{-4/3}-e^{-8/3}\approx 0.1941. $$

**(d)** Sea $T_{10}$ el tiempo de atención de 10 clientes. Por la **dualidad**
$T_{10}<10 \iff N(10)\ge10$, con $N(10)\sim\text{Poisson}(\lambda\cdot10)=
\text{Poisson}(20/3)$:
$$ P(T_{10}<10)=P\big(N(10)\ge10\big)=1-\sum_{k=0}^{9}\frac{(20/3)^k}{k!}e^{-20/3}\approx 1-0.8626=0.1374. $$

**Resultado.** (a) $0.2149$, (b) $0.1353$, (c) $0.1941$, (d) $0.1374$.

> Nota: la clave de respuestas del TP6 da $0.1374$ para (d), valor que coincide con el
> redondeo correcto. La *resolución* paso a paso del raw escribe $0.1373$ por truncar un
> dígito en un paso intermedio; usamos $0.1374$.
