---
titulo: Distribución Bernoulli
resumen: 'Ensayo único con dos resultados: éxito (vale 1, con probabilidad $p$) o fracaso (vale 0). Es el ladrillo con el que se arman Binomial, Geométrica y Binomial Negativa; cumple $E[X]=p$ y $V(X)=p(1-p)$.'
tipo: distribucion
unidad: 3
orden: 7
tags: [discreta, distribucion]
fuentes: ["[[bernoulli-apunte]]", "[[tp3-variables-aleatorias-discretas]]"]
actualizado: 2026-09-04
---

# Distribución Bernoulli

**En breve.** Es el "ladrillo" más simple: un único ensayo con dos resultados,
éxito (vale 1, probabilidad $p$) o fracaso (vale 0). Todas las demás
distribuciones de conteo de la unidad (Binomial, Geométrica, BinNeg) se construyen
encadenando ensayos Bernoulli.

**Modela:** un único experimento con dos resultados posibles, "éxito" (con
probabilidad $p$) o "fracaso".
**Soporte:** $\mathcal{R}_X = \{0, 1\}$.
**Parámetros:** $p \in [0,1]$ = probabilidad de éxito ($q = 1 - p$ = fracaso).

Se nota $X \sim \text{Bernoulli}(p)$ ("$X$ tiene distribución Bernoulli" / "$X$
está distribuido como Bernoulli"). Según [[bernoulli-apunte]], modela cualquier
experimento del que solo interesa si ocurre o no un evento de probabilidad $p$
(p. ej. "sacar una bola roja de la urna").

## Función de masa
$$ p_X(0) = P(X=0) = q = 1-p, \qquad p_X(1) = P(X=1) = p $$

## Esperanza y varianza
- $E[X] = \mu_X = p$
- $V(X) = \sigma_X^2 = p\,q = p(1-p)$

> Derivación ([[bernoulli-apunte]]): $E[X] = 0\cdot q + 1\cdot p = p$ y
> $E[X^2] = 0^2\cdot q + 1^2\cdot p = p$, luego
> $V(X) = E[X^2] - (E[X])^2 = p - p^2 = pq$.

> **Intuición.** $E[X]=p$ porque $X$ vale 1 una fracción $p$ de las veces y 0 el
> resto: el promedio es directamente la proporción de éxitos. La
> [[varianza|varianza]] $pq$ es máxima en $p=\tfrac12$ (máxima incertidumbre: el
> resultado es "una moneda") y se anula en $p=0$ o $p=1$ (resultado seguro, sin
> dispersión).

## Función generadora de momentos
$$ M_X(t) = q + p\,e^t $$
(ver [[funcion-generadora-de-momentos|FGM]]).

## Relaciones con otras distribuciones
- $X \sim \text{Bernoulli}(p) \;\Leftrightarrow\; X \sim$
  [[distribucion-binomial|Binomial$(1, p)$]]. La Bernoulli es el caso $n=1$ de la
  Binomial.
- La suma de $n$ Bernoulli$(p)$ [[independencia|independientes]] es una
  [[distribucion-binomial|Binomial$(n, p)$]].

## Cuándo usarla (reconocer en un ejercicio)
- Hay **un solo** ensayo (o se mira un solo individuo).
- Solo importan dos resultados: pasa / no pasa, éxito / fracaso, defectuoso / sano.
- Se pregunta por la probabilidad de un único evento.

## Ejercicio resuelto

**Enunciado** (basado en [[bernoulli-apunte]], urna de 7 bolillas). Una urna tiene
7 bolillas: 4 azules y 3 rojas. Se toma 1 bolilla al azar. Sea $X = 1$ si sale
roja, $X = 0$ si sale azul. Hallar la distribución, $E[X]$ y $V(X)$.

**Planteo.** Es un único ensayo con dos resultados $\Rightarrow X \sim
\text{Bernoulli}(p)$. Por [[regla-de-laplace|Laplace]], $p = P(X=1) = \tfrac37$.

**Cálculo.**
$$ p_X(0) = \tfrac47 = q, \qquad p_X(1) = \tfrac37 = p $$
$$ E[X] = p = \tfrac37 \approx 0{,}43 $$
$$ V(X) = pq = \tfrac37\cdot\tfrac47 = \tfrac{12}{49} \approx 0{,}245 $$

**Resultado.** $X \sim \text{Bernoulli}(3/7)$, con $E[X] = 3/7$ y $V(X) = 12/49$.

### Ejercicio resuelto — suma de Bernoulli *no* idénticas (circuitos serie/paralelo)

**Enunciado** ([[tp3-variables-aleatorias-discretas]] ej. 8). La probabilidad de
falla de un componente electrónico es $0{,}10$. Una compañía arma dos tipos de
circuito: el tipo **I** es un **paralelo** de dos componentes (funciona si
funciona **al menos uno**); el tipo **II** es una **serie** de dos componentes
(funciona si funcionan **ambos**). Se elige un circuito de cada tipo. Sea $X$ =
número de circuitos que funcionan al probar los dos. (a) PMF y FDA; (b) $E[X]$.

**Planteo.** Cada circuito es un ensayo Bernoulli, pero con **probabilidad de
éxito distinta**, así que $X = F_I + F_{II}$ es suma de **dos Bernoulli no
idénticas** (no es Binomial). Sea $P(\text{componente funciona})=0{,}9$, componentes
[[independencia|independientes]].

- Circuito I (paralelo), $F_I = C_1\cup C_2$:
  $$\begin{aligned}P(F_I)&=P(C_1)+P(C_2)-P(C_1)P(C_2)=0{,}9+0{,}9-0{,}81=0{,}99\\ &\Rightarrow F_I\sim\text{Bernoulli}(0{,}99).\end{aligned}$$
- Circuito II (serie), $F_{II}=C_3\cap C_4$:
  $$P(F_{II})=0{,}9\cdot 0{,}9=0{,}81 \Rightarrow F_{II}\sim\text{Bernoulli}(0{,}81).$$

Como $F_I$ y $F_{II}$ dependen de componentes distintos, son independientes.
$\mathcal{R}_X=\{0,1,2\}$.

**Cálculo.** Con $P(\bar F_I)=0{,}01$ y $P(\bar F_{II})=0{,}19$:
$$P(X=0)=P(\bar F_I)P(\bar F_{II})=0{,}01\cdot 0{,}19=0{,}0019$$
$$P(X=1)=P(\bar F_I)P(F_{II})+P(F_I)P(\bar F_{II})=0{,}01\cdot 0{,}81+0{,}99\cdot 0{,}19=0{,}1962$$
$$P(X=2)=P(F_I)P(F_{II})=0{,}99\cdot 0{,}81=0{,}8019$$

| $x$ | 0 | 1 | 2 |
|---|---|---|---|
| $p_X(x)$ | 0,0019 | 0,1962 | 0,8019 |

[[funcion-de-distribucion-acumulada|FDA]] escalonada:
$$
F_X(x)=
\begin{cases}
0 & x<0\\
0{,}0019 & 0\le x<1\\
0{,}1981 & 1\le x<2\\
1 & x\ge 2
\end{cases}
$$
Valor esperado (por linealidad de la esperanza, $E[X]=E[F_I]+E[F_{II}]$):
$$E[X]=0\cdot 0{,}0019 + 1\cdot 0{,}1962 + 2\cdot 0{,}8019 = 0{,}99+0{,}81 = 1{,}80.$$

**Resultado.** $E[X]=1{,}8$ circuitos funcionando en promedio. Como las dos
Bernoulli **no** comparten $p$, no se puede usar $E[\text{Bin}]=np$; pero la
[[esperanza|linealidad de la esperanza]] sigue valiendo: $E[X]=p_I+p_{II}=0{,}99+0{,}81$.
