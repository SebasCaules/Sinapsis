---
titulo: Proceso de Bernoulli
resumen: 'Proceso de conteo en tiempo discreto: en cada paso ocurre un evento con probabilidad $p$, de modo que $N(k)\sim\text{Binomial}(k,p)$, los tiempos entre eventos son geométricos y el tiempo al $k$-ésimo es binomial negativo.'
tipo: concepto
unidad: 6
orden: 3
tags: [procesos-estocasticos, discreto, proceso-de-conteo]
fuentes: ["[[teorica-proceso-de-bernoulli]]", "[[tp6-procesos-estocasticos]]"]
actualizado: 2026-09-04
---

# Proceso de Bernoulli

**En breve.** Es el reloj que tira una moneda en cada tic: en cada paso discreto
ocurre un evento con probabilidad $p$ (a lo sumo uno), y se cuenta cuántos van. Sirve
para modelar conteos en tiempo discreto y es la **versión discreta** del
[[proceso-de-poisson|proceso de Poisson]].

**Modela:** una secuencia de ensayos de éxito/fracaso en **tiempo discreto**
(p. ej. una jugada por unidad de tiempo), contando los éxitos acumulados.
**Tipo:** [[procesos-estocasticos#Proceso de conteo|proceso de conteo]] de tiempo
discreto.

> **Intuición.** Pensalo como tirar una moneda i.i.d. una vez por segundo. El
> conteo $N(k)$ es "cuántas caras llevo tras $k$ segundos" → [[distribucion-binomial|Binomial]].
> Mirando *cuándo* salen las caras aparecen las otras dos distribuciones: la
> espera hasta la próxima cara es [[distribucion-geometrica|Geométrica]], y hasta
> la $k$-ésima cara es [[distribucion-binomial-negativa|Binomial negativa]]. Es la
> "trama discreta" sobre la que se monta toda la unidad.

## Definición
$N(t)$ es un **proceso de Bernoulli con parámetro $p$** sii es un proceso de
conteo de tiempo discreto que cumple (según [[teorica-proceso-de-bernoulli]]):
1. Tiene [[procesos-estocasticos#Incrementos independientes y estacionarios|incrementos independientes]].
2. Los incrementos son **estacionarios**.
3. $P\big(N(k{+}1)-N(k)=1\big)=p$ (exactamente un evento en un intervalo).
4. $P\big(N(k{+}1)-N(k)=m\big)=0$ si $m>1$ (no más de un evento por intervalo).

Equivale a decir que en **cada intervalo de tiempo** hay un experimento de
Bernoulli i.i.d. con probabilidad de éxito $p$ constante, y a lo sumo un éxito por
experimento.

Se cumple $N(0)=0$, $N(t)\in\mathbb{N}_0$ y el recorrido $R_{N(k)}=\{0,1,\dots,k\}$.

## Distribución de los conteos
$N(k)$ = número de éxitos en $k$ experimentos i.i.d. Por lo tanto
$N(k)\sim$ [[distribucion-binomial|Binomial]]$(k,p)$:
$$ P(N(k)=n)=\binom{k}{n}p^n(1-p)^{k-n}. $$

## Incrementos
Por incrementos estacionarios e independientes, para $k\le m$:
$$ P\big(N(m)-N(k)=n\big)\overset{\text{inc. est.}}{=}P\big(N(m{-}k)=n\big)\;\Rightarrow\; N(m)-N(k)\sim\text{Binomial}(m{-}k,p). $$
Además, a partir de los incrementos independientes se prueba que $N(t)$ es un
[[procesos-estocasticos#Proceso de Markov|proceso de Markov]]:
$P(N(m)=n_m\mid N(\ell)=n_\ell, N(k)=n_k)=P(N(m)=n_m\mid N(\ell)=n_\ell)$.

## Tiempos entre eventos
Sean $\tau_i$ los tiempos (cantidad de ensayos) entre eventos consecutivos:
$\tau_i\sim$ [[distribucion-geometrica|Geométrica]]$(p)$ i.i.d.
El **tiempo hasta el $k$-ésimo evento** $T_k=\tau_1+\dots+\tau_k\sim$
[[distribucion-binomial-negativa|Binomial negativa]]$(k,p)$.

> [!figura] u6-anatomia-de-una-realizacion-de-bernoulli
> Una sola realización leída de tres maneras alineadas sobre el mismo eje de ensayos: el conteo $N(k)$ (éxitos en los primeros $k$ ensayos independientes, cada uno con éxito de probabilidad $p$ y fracaso de probabilidad $1-p$), la fila de ranuras éxito/fracaso, y los instantes $T_k$ —el ensayo del $k$-ésimo éxito— con las esperas $\tau_i$ entre dos éxitos consecutivos. Sirve para no confundir $\tau_i$ (geométrica) con $T_k$ (binomial negativa), ni el conteo con el tiempo.

## Relaciones con otras distribuciones / procesos
- Marginal: [[distribucion-binomial|Binomial]]; tiempos entre eventos:
  [[distribucion-geometrica|Geométrica]] (falta de memoria); tiempo al $k$-ésimo:
  [[distribucion-binomial-negativa|Binomial negativa]].
- Es la **versión discreta** del [[proceso-de-poisson|proceso de Poisson]]; al
  refinar el tiempo se obtiene Poisson (ver [[relacion-bernoulli-poisson]]).

## Cuándo usarlo (reconocer en un ejercicio)
- El tiempo avanza en **pasos discretos** y en cada paso ocurre o no un evento,
  de forma independiente y con probabilidad fija $p$.
- Te piden cuántos eventos en $k$ pasos (Binomial), cuántos pasos hasta el primer
  evento (Geométrica) o hasta el $k$-ésimo (Binomial negativa).

## Ejercicio resuelto
*Caminata aleatoria simétrica (de [[tp6-procesos-estocasticos]] Ej. 1, resuelto).
Se lanza una moneda repetidamente; el jugador gana 1 si sale cara y pierde 1 si
sale ceca. $X_n$ = dinero tras $n$ jugadas, $X_0=0$. Expresar $X_n$ como suma de
v.a. i.i.d. y dar $E[X_n]$, $\text{Var}[X_n]$.*

**Planteo.** Sea $G_n\sim\text{Bernoulli}(1/2)$ = "gana la jugada $n$" y la
ganancia $Y_n=2G_n-1\in\{-1,+1\}$ con $P(Y_n=\pm1)=\tfrac12$. Entonces
$$ X_n=\sum_{k=1}^{n}Y_k. $$

**Momentos del sumando.**
$$ E[Y_n]=(-1)\tfrac12+(+1)\tfrac12=0,\qquad \text{Var}[Y_n]=E[Y_n^2]=(-1)^2\tfrac12+(+1)^2\tfrac12=1. $$

**Esperanza y varianza de $X_n$.** Por linealidad y, para la varianza, por
independencia de los $Y_k$:
$$ E[X_n]=\sum_{k=1}^n E[Y_k]=0,\qquad \text{Var}[X_n]=\sum_{k=1}^n \text{Var}[Y_k]=n. $$

**Distribución.** Con $H_n=\sum_{k=1}^n G_n\sim\text{Binomial}(n,1/2)$ (¡suma de
Bernoulli i.i.d.!) y $X_n=2H_n-n$, el recorrido es $\{-n,-n+2,\dots,n-2,n\}$ y
$$ P(X_n=x)=\binom{n}{\frac{n+x}{2}}\Big(\tfrac12\Big)^n. $$

**Resultado.** $E[X_n]=0$, $\text{Var}[X_n]=n$. El proceso tiene incrementos
independientes y estacionarios pero **no** es estacionario (la varianza crece con
$n$). Conexión con esta página: las ganancias $G_n$ forman un proceso de Bernoulli
con $p=1/2$, y $H_n=N(n)$ es su conteo $\sim\text{Binomial}(n,1/2)$. Ver
[[caminata-aleatoria]].
