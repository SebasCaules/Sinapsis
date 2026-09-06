---
titulo: Variables Aleatorias Discretas — Introducción (slides Pantazis)
resumen: "Slides teóricas de la unidad 3, del Lic. Lucio José Pantazis, que introducen la variable aleatoria discreta desde el ejemplo de la urna y recorren recorrido, PMF, FDA, esperanza, varianza y medidas de forma."
tipo: fuente
formato: slides
unidad: 3
archivo_raw: "raw/04-va-discretas/Variables Aleatorias Discretas - Introducción.pdf"
ingerido: 2026-05-30
---

# Variables Aleatorias Discretas — Introducción (slides Pantazis)

**Qué es:** presentación teórica (Lic. Lucio José Pantazis, 17/08/2023) que
introduce las variables aleatorias discretas desde un ejemplo motivador (urna con
6 bolas celestes y 4 blancas, 4 extracciones con reposición).
**Cubre las unidades/temas:** v.a. discreta, recorrido, PMF, FDA, esperanza,
varianza, desvío, asimetría, curtosis, partición del espacio muestral.

## Puntos clave
- Construye la variable $D$ = número de bolas celestes en 4 extracciones, mostrando
  que $P(D=k) = \binom{4}{k}(3/5)^k(2/5)^{4-k}$ (anticipa la binomial).
- Define **v.a.** como función $X : \mathcal{S} \mapsto \mathbb{R}$; **recorrido**
  $\mathcal{R}_X$; **PMF** $p_X(k) = P(X=k)$ con $\sum_k p_X(k) = 1$.
- **Esperanza** $E[X] = \sum_k k\,p_X(k)$, conectada con la media de datos
  agrupados (la frecuencia relativa converge a la probabilidad).
- **Propiedades de la esperanza** (linealidad) y **de la varianza**, con las dos
  advertencias: $E[XY] \ne E[X]E[Y]$ y $V(X+Y) \ne V(X)+V(Y)$ en general.
- **FDA** $F_X(k)=P(X\le k)$: monótona, continua a derecha, escalonada.
- Tabla de medidas de resumen (media, varianza, desvío, simetría, curtosis) en
  versión datos agrupados vs. v.a.
- Ejemplos resueltos: ganancia del casino $G$ (Bernoulli/dado) y $Y$ = apuestas
  hasta perder por primera vez (geométrica, con series).

## Páginas del wiki que toca
- [[variable-aleatoria]] (fundacional)
- [[esperanza]], [[varianza]], [[funcion-de-distribucion-acumulada]]
- [[distribucion-bernoulli]], [[distribucion-binomial]], [[distribucion-geometrica]]
- [[asimetria-y-curtosis]], [[datos-agrupados]], [[regla-de-laplace]]
- [[probabilidad-total-y-bayes]]
