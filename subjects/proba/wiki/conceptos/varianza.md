---
titulo: Varianza y Desvío
resumen: 'Mide la dispersión de una variable aleatoria alrededor de su media: $V(X)=E[(X-E[X])^2]=E[X^2]-(E[X])^2$, y el desvío $\sigma=\sqrt{V(X)}$ vuelve a las unidades originales. Propiedad clave: $V(aX+c)=a^2\,V(X)$.'
tipo: concepto
unidad: 3
orden: 4
tags: [discreta, varianza, dispersion, momentos]
fuentes: ["[[va-discretas-introduccion]]", "[[tp3-variables-aleatorias-discretas]]"]
actualizado: 2026-06-06
---

# Varianza y Desvío

**En breve.** La varianza mide cuán **dispersos** están los valores de una v.a.
alrededor de su media: es el promedio de las desviaciones al cuadrado. El desvío
$\sigma$ es su raíz, ya en las mismas unidades que $X$. Cuanto más grande, menos
predecible es el resultado.

La **varianza** de una [[variable-aleatoria|v.a. discreta]] $X$ mide cuánto se
dispersan (probabilísticamente) los valores alrededor de su
[[esperanza|media]] $\mu_X = E[X]$:
$$ V(X) = \sigma_X^2 = E\!\left[(X - E[X])^2\right] $$

> **Intuición.** ¿Por qué elevar al cuadrado y no usar $E[X-\mu]$? Porque las
> desviaciones positivas y negativas se cancelarían: $E[X-\mu]=0$ siempre. El
> cuadrado las vuelve todas positivas y, además, **penaliza más** las
> desviaciones grandes (un valor al doble de distancia pesa cuatro veces).
> El desvío $\sigma=\sqrt{V(X)}$ deshace el cuadrado para volver a las unidades
> originales.
Desarrollando el cuadrado y usando linealidad de la esperanza se obtiene la
**fórmula de cálculo** (la más usada en la práctica):
$$ \boxed{\,V(X) = E[X^2] - \big(E[X]\big)^2\,} $$
con $E[X^2] = \sum_{k\in\mathcal{R}_X} k^2\,p_X(k)$.

El **desvío estándar** es $\sigma(X) = \sqrt{V(X)}$, a veces notado $\sigma_X$.
Tiene las mismas unidades que $X$. La [[desigualdad-de-chebyshev|desigualdad de Chebyshev]] le da un sentido cuantitativo: acota la probabilidad de alejarse de la
media en términos de cuántos $\sigma$.

## Propiedades

Sean $a, c$ constantes:
- $V(c) = 0$ y $\sigma(c) = 0$.
- $V(a\cdot X) = a^2\,V(X) \;\Rightarrow\; \sigma(a\cdot X) = |a|\,\sigma(X)$.
- $V(X + c) = V(X) \;\Rightarrow\; \sigma(X+c) = \sigma(X)$ (un corrimiento no cambia la dispersión).
- Combinando: $V(a\cdot X + c) = a^2\,V(X) \;\Rightarrow\; \sigma(a\cdot X + c) = |a|\,\sigma(X)$.

> ⚠️ **Atención.** Si $X, Y$ son v.a., en general $V(X + Y) \ne V(X) + V(Y)$.
> No dividir/sumar la varianza por suma (o resta) de variables sin verificar que se
> pueda (requiere [[independencia|independencia]]).

## Ejercicio resuelto

**Enunciado** ([[va-discretas-introduccion]], ejemplo del casino). Sea $G$ la
ganancia del casino, con $\mathcal{R}_G = \{-4, 1\}$, $P(G=-4)=\tfrac16$,
$P(G=1)=\tfrac56$ y $E[G]=\tfrac16$ (ver [[esperanza|Esperanza]]). Calcular $V(G)$.

**Planteo.** Usamos $V(G) = E[G^2] - (E[G])^2$.

**Cálculo.**
$$ E[G^2] = (-4)^2\cdot\tfrac16 + 1^2\cdot\tfrac56 = \tfrac{16}{6} + \tfrac{5}{6} = \tfrac{21}{6} = \tfrac72 $$
$$ V(G) = \tfrac72 - \left(\tfrac16\right)^2 = \tfrac72 - \tfrac{1}{36} = \tfrac{126 - 1}{36} = \tfrac{125}{36} $$

**Resultado.** $V(G) = \tfrac{125}{36} \approx 3{,}47$, con desvío
$\sigma(G) = \sqrt{125/36} = \tfrac{5\sqrt5}{6} \approx 1{,}86$.
