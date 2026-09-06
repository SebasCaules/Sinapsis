---
titulo: Distribución Binomial Negativa (Pascal)
resumen: 'Cuenta los fracasos previos al $r$-ésimo éxito en ensayos Bernoulli independientes: $p_X(k)=\binom{k+r-1}{k}q^k p^r$, con $E[X]=rq/p$ y $V(X)=rq/p^2$. Generaliza la geométrica, que es el caso $r=1$; la cátedra cuenta fracasos, no ensayos.'
tipo: distribucion
unidad: 3
orden: 10
tags: [discreta, distribucion]
fuentes: ["[[binomial-negativa-apunte]]", "[[tp3-variables-aleatorias-discretas]]"]
actualizado: 2026-09-04
---

# Distribución Binomial Negativa (Pascal)

**En breve.** Generaliza la [[distribucion-geometrica|Geométrica]]: cuenta los
fracasos hasta el $r$-ésimo éxito (la geométrica es el caso $r=1$). Es la suma de
$r$ geométricas independientes, por eso su media y varianza son $r$ veces las de
una sola.

**Modela:** el número de **fracasos** obtenidos antes de conseguir el $r$-ésimo
éxito, en ensayos [[independencia|independientes]] con igual probabilidad de éxito
$p$.
**Soporte:** $\mathcal{R}_X = \mathbb{N}_0 = \{0, 1, 2, \dots\}$.
**Parámetros:** $r \in \mathbb{N}$ = número de éxitos buscados; $p \in (0,1]$ =
probabilidad de éxito ($q = 1-p$).

Se nota $X \sim \text{BinNeg}(r, p)$ (también llamada **de Pascal**).

> ⚠️ **Convención de la cátedra.** Igual que la
> [[distribucion-geometrica|Geométrica]], aquí $X$ cuenta **fracasos** (no ensayos
> totales), por lo que $\mathcal{R}_X = \mathbb{N}_0$. Otros textos cuentan el
> número total de ensayos hasta el $r$-ésimo éxito; **no mezclar las versiones**.
> Fuente: [[binomial-negativa-apunte]] y [[tp3-variables-aleatorias-discretas]].

## Función de masa
$$ p_X(k) = P(X=k) = \binom{k + r - 1}{k}\,q^{\,k}\,p^{\,r}, \qquad k \in \mathbb{N}_0 $$

> [!figura] u3-la-tira-de-ensayos-por-que-c-k-r1-k-y-no-c-k-r-k
> La última casilla queda clavada como el $r$-ésimo éxito y solo las primeras $k+r-1$ se permutan libremente. Por eso el combinatorio es $\binom{k+r-1}{k}$ y no $\binom{k+r}{k}$; con $r = 1$ se reduce a la geométrica.

> Idea ([[binomial-negativa-apunte]]): el último ensayo (posición $k+r$) es el
> $r$-ésimo éxito. En los $k + r - 1$ ensayos previos hay $k$ fracasos y $r-1$
> éxitos repartidos de $\binom{k+r-1}{k}$ formas, cada secuencia con probabilidad
> $q^k p^r$. La normalización usa el desarrollo del **binomio negativo**:
> $\binom{k+r-1}{k} = (-1)^k\binom{-r}{k}$ y $p^r(1-q)^{-r} = \sum_k \binom{k+r-1}{k}q^k p^r = 1$.

## Esperanza y varianza
- $E[X] = \mu_X = \dfrac{r\,q}{p} = r\,\dfrac{1-p}{p}$
- $V(X) = \sigma_X^2 = \dfrac{r\,q}{p^2} = r\,\dfrac{1-p}{p^2}$

> Son $r$ veces las de la geométrica, consistente con que es la suma de $r$
> geométricas independientes.

> **Intuición.** ¿Por qué $\binom{k+r-1}{k}$ y no $\binom{k+r}{k}$? Porque el
> **último** ensayo está obligado a ser el $r$-ésimo éxito (si no, no habrías
> "parado" ahí): solo se reparten libremente los $k$ fracasos y los $r-1$ éxitos
> previos entre las primeras $k+r-1$ posiciones. Por linealidad de la
> [[esperanza|esperanza]], esperar $r$ éxitos cuesta en promedio $r$ veces lo que
> cuesta esperar uno.

## Función generadora de momentos
$$ M_X(t) = \left(\frac{p}{1 - q\,e^t}\right)^{r}, \qquad t < -\ln q $$
(ver [[funcion-generadora-de-momentos|FGM]]; es la de la geométrica a la $r$).

## Relaciones con otras distribuciones
- $\text{BinNeg}(1, p) = $ [[distribucion-geometrica|Geométrica$(p)$]].
- Es la suma de $r$ [[distribucion-geometrica|geométricas$(p)$]] independientes
  (cada una cuenta los fracasos entre éxitos consecutivos).
- Es "complementaria" a la [[distribucion-binomial|Binomial]]: la binomial fija el
  número de ensayos y cuenta éxitos; la binomial negativa fija el número de éxitos
  y cuenta fracasos.

## Cuándo usarla (reconocer en un ejercicio)
- Se repiten ensayos Bernoulli **hasta acumular $r$ éxitos**.
- Se pregunta por la cantidad de fracasos (o de ensayos) hasta el $r$-ésimo éxito.

## Ejercicio resuelto

**Enunciado** ([[tp3-variables-aleatorias-discretas]] ej. 40b). El 5 % de la
población tiene talasemia. Se toman personas al azar, una tras otra. ¿Cuál es el
número medio de personas elegidas antes de que aparezca la **tercera** con
talasemia? ¿Cuál es la probabilidad de que entre las 36 primeras no haya 3 con
talasemia?

**Planteo.** "Éxito" = persona con talasemia, $p = 0{,}05$, $r = 3$. Sea $X$ =
n.º de personas sin talasemia (fracasos) antes de la tercera con talasemia
$\Rightarrow X \sim \text{BinNeg}(3,\ 0{,}05)$.

**Cálculo.**
$$ E[X] = \frac{r\,q}{p} = \frac{3\cdot 0{,}95}{0{,}05} = 57 $$
"Entre las 36 primeras no hay 3 con talasemia" significa que aún no se alcanzó el
tercer éxito en los primeros 36 ensayos, es decir, hubo a lo sumo 2 éxitos en 36
ensayos. Conviene calcularlo con la [[distribucion-binomial|Binomial$(36,\ 0{,}05)$]]
$Y$ = n.º de éxitos en 36:
$$ P(Y \le 2) = \sum_{j=0}^{2}\binom{36}{j}0{,}05^{j}\,0{,}95^{\,36-j} \approx 0{,}7321 $$

**Resultado.** En promedio $57$ personas sin talasemia antes de la tercera con
talasemia; $P(\text{no 3 entre las 36}) \approx 0{,}7321$.
