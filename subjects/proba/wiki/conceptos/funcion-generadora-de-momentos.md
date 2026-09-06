---
titulo: Función Generadora de Momentos (FGM)
resumen: 'Función auxiliar $M_X(t)=E[e^{tX}]$ que empaqueta todos los momentos: $E[X^k]=M_X^{(k)}(0)$. Identifica unívocamente a la distribución y convierte la suma de variables independientes en producto de FGM.'
tipo: concepto
unidad: 3
orden: 5
tags: [discreta, fgm, momentos]
fuentes: ["[[tp3-variables-aleatorias-discretas]]"]
actualizado: 2026-06-06
---

# Función Generadora de Momentos (FGM)

**En breve.** La FGM es una función auxiliar $M_X(t)=E[e^{tX}]$ que empaqueta
**todos los [[esperanza|momentos]]** de $X$. Derivándola y evaluándola en $t=0$ se
sacan $E[X]$, $E[X^2]$, etc.; además identifica a la distribución y simplifica
sumas de variables independientes.

La **función generadora de momentos (FGM)** de una [[variable-aleatoria|v.a.]] $X$ se
define como:
$$ M_X(t) = E\!\left[e^{tX}\right] = \sum_{k \in \mathcal{R}_X} e^{tk}\,p_X(k) $$
(para los $t$ donde la suma converge). Es una herramienta que **codifica todos los
[[esperanza|momentos]]** de $X$ en una sola función.

> **Intuición.** El truco es el desarrollo en serie
> $e^{tX}=1+tX+\tfrac{t^2}{2!}X^2+\dots$: al tomar esperanza, el coeficiente de
> $t^k$ resulta ser $E[X^k]/k!$. Es decir, la FGM lleva los momentos "guardados"
> como coeficientes de su serie de Taylor; derivar $k$ veces y evaluar en $0$ es
> justamente el modo de extraer el $k$-ésimo coeficiente.

> Nota. El [[va-discretas-introduccion|apunte de la cátedra]] desarrolla la
> [[esperanza|esperanza]] y la [[varianza|varianza]] directamente con las sumas
> $\sum k\,p_X(k)$ y $\sum k^2\,p_X(k)$, sin recurrir a la FGM. La FGM se incluye
> aquí como herramienta complementaria estándar; los momentos de cada distribución
> también se obtienen sin ella.

## Propiedad de generación de momentos

Derivando $M_X(t)$ y evaluando en $t = 0$ se obtienen los momentos:
$$ E[X^k] = M_X^{(k)}(0) = \left.\frac{d^k}{dt^k} M_X(t)\right|_{t=0} $$
En particular:
$$ E[X] = M_X'(0), \qquad E[X^2] = M_X''(0), \qquad V(X) = M_X''(0) - \big(M_X'(0)\big)^2 $$

## Otras propiedades

- **Caracterización**: si dos v.a. tienen la misma FGM (en un entorno de $0$),
  tienen la misma distribución. La FGM identifica unívocamente a la distribución.
- **Transformación afín**: $M_{aX+b}(t) = e^{bt}\,M_X(at)$.
- **Suma de independientes**: si $X, Y$ son [[independencia|independientes]],
  $M_{X+Y}(t) = M_X(t)\cdot M_Y(t)$. (Esto explica por qué la suma de
  [[distribucion-bernoulli|Bernoulli]] independientes es
  [[distribucion-binomial|Binomial]], y la suma de
  [[distribucion-poisson|Poisson]] independientes es Poisson.)

## FGM de las distribuciones discretas de la unidad

| Distribución | FGM $M_X(t)$ |
|---|---|
| [[distribucion-bernoulli\|Bernoulli$(p)$]] | $q + p\,e^t$ |
| [[distribucion-binomial\|Binomial$(n,p)$]] | $(q + p\,e^t)^n$ |
| [[distribucion-geometrica\|Geométrica$(p)$]] (n.º de fracasos) | $\dfrac{p}{1 - q\,e^t}$, para $t < -\ln q$ |
| [[distribucion-binomial-negativa\|BinNeg$(r,p)$]] (n.º de fracasos) | $\left(\dfrac{p}{1 - q\,e^t}\right)^{r}$ |
| [[distribucion-poisson\|Poisson$(\lambda)$]] | $e^{\lambda(e^t - 1)}$ |

con $q = 1 - p$.

## Ejercicio resuelto

**Enunciado.** Verificar, con la FGM de la [[distribucion-bernoulli|Bernoulli$(p)$]],
que $E[X] = p$ y $V(X) = pq$.

**Planteo.** $M_X(t) = q + p\,e^t$. Derivamos respecto de $t$.

**Cálculo.**
$$ M_X'(t) = p\,e^t \;\Rightarrow\; E[X] = M_X'(0) = p\,e^0 = p $$
$$ M_X''(t) = p\,e^t \;\Rightarrow\; E[X^2] = M_X''(0) = p $$
$$ V(X) = E[X^2] - (E[X])^2 = p - p^2 = p(1-p) = pq $$

**Resultado.** $E[X] = p$ y $V(X) = pq$, que coinciden con las fórmulas directas de
la [[distribucion-bernoulli|Bernoulli]].
