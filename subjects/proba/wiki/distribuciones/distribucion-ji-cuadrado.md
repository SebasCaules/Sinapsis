---
titulo: Distribución Ji-cuadrado
resumen: 'Suma de cuadrados de $k$ normales estándar independientes, con $E[X]=k$ y $V(X)=2k$. En inferencia es la ley de $(n-1)S_n^2/\sigma^2$: sostiene la insesgadez de la varianza muestral, sus intervalos de confianza y la t de Student.'
tipo: distribucion
unidad: 8
orden: 4
tags: [continua, distribucion, inferencia]
fuentes: ["[[teorica-estimacion-puntual-conocidos]]", "[[teorica-t-de-student]]", "[[tp8-estimacion-de-parametros]]", "[[video-ic-desvio-desconocido]]"]
actualizado: 2026-09-03
---

# Distribución Ji-cuadrado

**En breve.** La distribución de una suma de cuadrados de normales estándar
independientes. En inferencia es la ley de $(n-1)S_n^2/\sigma^2$: sustenta la
insesgadez de la [[varianza-muestral]], los IC de la varianza y, como pieza
intermedia, la [[distribucion-t-de-student|t de Student]].

**Modela:** la suma de cuadrados de variables normales estándar independientes;
en inferencia, la distribución del estadístico $(n-1)S_n^2/\sigma^2$ que sustenta
la insesgadez de la [[varianza-muestral]] y los IC de la varianza.
**Soporte:** $x\in(0,\infty)$ (es una v.a. **no negativa**).
**Parámetros:** grados de libertad $k\in\mathbb N$ (en inferencia, $k=n-1$).

Se escribe $X\sim\chi^2_k$ (chi-cuadrado con $k$ grados de libertad). Es un caso
particular de la [[distribucion-gamma|distribución Gamma]] con forma $k/2$ y tasa
$1/2$.

## De dónde sale

Según [[teorica-estimacion-puntual-conocidos]], si $X_i\sim\mathcal N(\mu,\sigma^2)$
i.i.d. y $S_n^2=\frac{1}{n-1}\sum(X_i-\overline X_n)^2$ es la
[[varianza-muestral]], entonces

$$\boxed{\;\frac{(n-1)\,S_n^2}{\sigma^2}\sim\chi^2_{n-1}\;}$$

es decir, una ji-cuadrado con $n-1$ grados de libertad (uno se "consume" al
estimar la media con $\overline X_n$). Más en general, si $Z_1,\dots,Z_k$ son
$\mathcal N(0,1)$ independientes, entonces $\sum_{i=1}^k Z_i^2\sim\chi^2_k$
(conexión con [[suma-de-variables-aleatorias|suma de v.a.]] de la U7: la suma de
$N(0,1)^2$ es ji-cuadrado).

## Función de densidad

Con $k$ grados de libertad, según [[teorica-estimacion-puntual-conocidos]]
(escrita allí con $k=n-1$):

$$f_{\chi^2_k}(x) = \begin{cases}
\dfrac{x^{\frac{k}{2}-1}\,e^{-x/2}}{2^{\frac{k}{2}}\,\Gamma\!\left(\frac{k}{2}\right)} & x>0,\\[2mm]
0 & x\le 0,
\end{cases}$$

donde $\Gamma(\cdot)$ es la función gamma ($\Gamma(m+1)=m!$, $\Gamma(1/2)=\sqrt\pi$).
La teórica manuscrita la escribe directamente para el estadístico de la varianza,
con exponente $\frac{n-1}{2}-1$ y normalización $2^{\frac{n-1}{2}}\Gamma\!\left(\frac{n-1}{2}\right)$,
es decir la misma fórmula con $k=n-1$.

## Esperanza y varianza

Con $k$ grados de libertad:
- $E[X] = k$.
- $V(X) = 2k$.

> **Intuición.** Como $\chi^2_k=\sum_{i=1}^k Z_i^2$ con $Z_i\sim\mathcal N(0,1)$, y
> cada $E[Z_i^2]=V(Z_i)=1$, por linealidad $E[X]=k\cdot 1=k$: la esperanza
> simplemente cuenta cuántos cuadrados se suman. Y como los términos son
> independientes, las varianzas también se suman ([[suma-de-variables-aleatorias]]),
> dando $V(X)=k\cdot V(Z_i^2)=2k$.

(Coherente con que $\frac{(n-1)S_n^2}{\sigma^2}\sim\chi^2_{n-1}$ tiene esperanza
$n-1$: tomando esperanza, $E\!\left[\frac{(n-1)S_n^2}{\sigma^2}\right]=n-1 \Rightarrow
E[S_n^2]=\sigma^2$, que es justamente la **insesgadez** de la varianza muestral
demostrada en [[varianza-muestral]].)

## Relaciones con otras distribuciones

- **Suma de normales al cuadrado:** $\sum_{i=1}^k Z_i^2\sim\chi^2_k$ con
  $Z_i\sim\mathcal N(0,1)$ i.i.d.
- **Gamma:** $\chi^2_k=\text{Gamma}\!\left(\frac{k}{2},\frac12\right)$ (forma $k/2$,
  tasa $1/2$). Para $k$ par coincide con una [[distribucion-erlang|Erlang]].
- **Aditividad:** si $X\sim\chi^2_{k_1}$ e $Y\sim\chi^2_{k_2}$ son independientes,
  $X+Y\sim\chi^2_{k_1+k_2}$ (los grados de libertad se suman).
- **t de Student:** la [[distribucion-t-de-student]] se construye como
  $T=\dfrac{Z}{\sqrt{V/k}}$ con $Z\sim\mathcal N(0,1)$ y $V\sim\chi^2_k$
  independientes. Por eso el estadístico
  $T=\frac{\overline X_n-\mu}{S_n/\sqrt n}$ es $t_{n-1}$: combina una normal
  estándar con la raíz de la ji-cuadrado $\frac{(n-1)S_n^2}{\sigma^2}$ normalizada.
- **Asintótica:** por el [[teorema-central-del-limite]], para $k$ grande
  $\chi^2_k\approx\mathcal N(k,\sqrt{2k})$.

## Cuándo usarla (reconocer en un ejercicio)

- Distribución del estadístico de la **varianza muestral** de una población
  normal $\to$ base del **IC y de la prueba de hipótesis para $\sigma^2$**.
- Como pieza intermedia para justificar la [[distribucion-t-de-student]] (cociente
  normal / raíz de ji-cuadrado).
- Suma de cuadrados de normales estándar independientes.
- Como pivote para construir el **intervalo de confianza de la varianza**
  $\sigma^2$ cuando las variables son normales: ver la derivación completa en
  [[intervalos-de-confianza]] (Caso 4). Cuidado: no confundir con el pivote de
  la t de Student — usar cuantiles de la t para este intervalo da una cobertura
  mal formulada (ver [[video-ic-desvio-desconocido]]).

## Ejercicio resuelto — Insesgadez de $S_n^2$ vía la ji-cuadrado

**Enunciado** ([[teorica-estimacion-puntual-conocidos]]): sabiendo que para una
muestra normal $\frac{(n-1)S_n^2}{\sigma^2}\sim\chi^2_{n-1}$, deducir
$E[S_n^2]=\sigma^2$ usando la esperanza de la ji-cuadrado.

**Planteo.** Llamemos $W=\frac{(n-1)S_n^2}{\sigma^2}$. Por hipótesis
$W\sim\chi^2_{n-1}$, así que $E[W]=n-1$ (grados de libertad).

**Cálculo.** Despejando $S_n^2=\frac{\sigma^2}{n-1}W$ y tomando esperanza por
linealidad:
$$E[S_n^2]=\frac{\sigma^2}{n-1}\,E[W]=\frac{\sigma^2}{n-1}\,(n-1)=\sigma^2.$$
Análogamente, usando $V(W)=2(n-1)$,
$$V(S_n^2)=\left(\frac{\sigma^2}{n-1}\right)^2 V(W)=\frac{\sigma^4}{(n-1)^2}\,2(n-1)=\frac{2\sigma^4}{n-1},$$
que coincide con el caso normal ($\kappa=0$) de la fórmula del ECM de $S_n^2$ del
[[formulario-inferencia]].

**Resultado.** $\boxed{E[S_n^2]=\sigma^2}$: la varianza muestral con denominador
$n-1$ es **insesgada**, y su varianza es $\frac{2\sigma^4}{n-1}$ en el caso normal.

## Páginas relacionadas
- [[varianza-muestral]] — el estadístico $(n-1)S_n^2/\sigma^2$ es ji-cuadrado.
- [[distribucion-t-de-student]] — se define como normal sobre raíz de ji-cuadrado.
- [[distribucion-normal]] — la suma de sus cuadrados estándar da la ji-cuadrado.
- [[distribucion-gamma]] · [[distribucion-erlang]] — la ji-cuadrado es un caso de Gamma.
- [[estimacion-puntual]] · [[intervalos-de-confianza]] — donde aparece en inferencia.
