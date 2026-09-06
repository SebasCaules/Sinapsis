---
titulo: Función de Distribución Acumulada (FDA)
resumen: 'Acumula probabilidad: $F_X(k)=P(X\le k)$, descripción equivalente a la PMF y la más cómoda para intervalos, con $P(a<X\le b)=F_X(b)-F_X(a)$. En una variable discreta es escalonada y cada salto vale $p_X(k)$.'
tipo: concepto
unidad: 3
orden: 2
tags: [discreta, fda, distribucion]
fuentes: ["[[va-discretas-introduccion]]", "[[tp3-variables-aleatorias-discretas]]"]
actualizado: 2026-09-04
---

# Función de Distribución Acumulada (FDA)

**En breve.** La FDA acumula probabilidad: $F_X(k)$ es la probabilidad de que $X$
no supere $k$. Es una descripción de la v.a. **equivalente** a la
[[variable-aleatoria|PMF]], y es la más cómoda para calcular probabilidades de
intervalos.

Para cualquier [[variable-aleatoria|v.a. discreta]] $X$ se define la **función de
distribución acumulada (FDA)** $F_X : \mathbb{R} \mapsto [0,1]$ como:
$$ F_X(k) = P(X \le k) = \sum_{\{y \in \mathcal{R}_X \,:\, y \le k\}} p_X(y) $$
Es una forma equivalente a la [[variable-aleatoria|PMF]] de describir el
comportamiento de una v.a.

> **Intuición.** Imagine que va barriendo la recta de izquierda a derecha y
> acumula toda la probabilidad que deja atrás: empieza en 0 (nada acumulado a
> la izquierda de todo) y termina en 1 (ya se recogió toda la masa). Cada vez que
> se cruza un valor del recorrido hay un salto de altura $p_X(k)$; entre valores
> no pasa nada, por eso la FDA de una V.A.D. es **escalonada**.

## Propiedades

- **Monótona no decreciente**: si $k_1 \le k_2 \Rightarrow F_X(k_1) \le F_X(k_2)$.
- $\displaystyle\lim_{k\to-\infty} F_X(k) = 0$ y $\displaystyle\lim_{k\to+\infty} F_X(k) = 1$.
- **Continua a derecha**: $\displaystyle\lim_{x\to k^+} F_X(x) = F_X(k)$.
  (Para una V.A.D. **no** es continua a izquierda: en cada valor del recorrido hay
  un salto de altura $p_X(k)$.)

## Forma escalonada

Como hay muchos valores con probabilidad nula, la FDA de una V.A.D. tiene forma
**escalonada**: es constante entre valores del recorrido y salta en cada valor
$k$ una altura igual a $p_X(k)$. Según [[va-discretas-introduccion]], esto explica
gráficamente por qué la función es continua a derecha pero no a izquierda.

> [!figura] u3-la-escalera-de-la-fda-cada-salto-es-una-masa-pun
> La PMF y su FDA escalonada, con el extremo cerrado arriba y el abierto abajo en cada salto. Mueva el cursor: la diferencia entre $F_X(x) = P(X \le x)$ y $P(X < x)$ es exactamente la masa puntual $p_X(x)$.

## Del caso continuo: recuperar la densidad derivando

En el caso continuo la FDA es derivable y su derivada es la
[[funcion-de-densidad|densidad]]: $f_X=F_X'$ en una dimensión, y la densidad
conjunta es la derivada parcial cruzada de la FDA conjunta,
$f_{XY}=\partial^2 F_{XY}/\partial x\,\partial y$. El detalle de esta inversa de
"acumular" está en [[tecnica-derivadas-parciales]] (Complementos Matemáticos).

## Relación con probabilidades de intervalos

- $P(X \le k) = F_X(k)$.
- $P(X < k) = F_X(k) - p_X(k)$ (para V.A.D.).
- $P(a < X \le b) = F_X(b) - F_X(a)$.
- $P(X > k) = 1 - F_X(k)$.

> **Cuidado con los $<$ vs $\le$.** En una V.A.D. la diferencia **importa**:
> $P(X<k)$ y $P(X\le k)$ se distinguen exactamente en la masa puntual $p_X(k)$.
> Se recupera la [[variable-aleatoria|PMF]] desde la FDA mirando el tamaño del salto:
> $p_X(k) = F_X(k) - \lim_{x\to k^-}F_X(x)$.

## Ejercicio resuelto

**Enunciado** ([[tp3-variables-aleatorias-discretas]] ej. 7). El número $X$ de
defectos importantes en un automóvil tiene FDA:
$$ F_X(x) = \begin{cases}
0 & x < 0 \\ 0{,}06 & 0 \le x < 1 \\ 0{,}19 & 1 \le x < 2 \\ 0{,}39 & 2 \le x < 3 \\
0{,}67 & 3 \le x < 4 \\ 0{,}92 & 4 \le x < 5 \\ 0{,}97 & 5 \le x < 6 \\ 1 & x \ge 6
\end{cases} $$
Calcular $p_X(2)$, $P(X > 3)$, $P(2 \le X \le 5)$ y $P(2 < X < 5)$.

**Planteo y cálculo.** Cada salto de la FDA es la PMF en ese punto.
- $p_X(2) = P(X=2) = F_X(2) - F_X(1) = 0{,}39 - 0{,}19 = 0{,}20$.
- $P(X > 3) = 1 - F_X(3) = 1 - 0{,}67 = 0{,}33$.
- $P(2 \le X \le 5) = F_X(5) - F_X(1) = 0{,}97 - 0{,}19 = 0{,}78$.
- $P(2 < X < 5) = P(3 \le X \le 4) = F_X(4) - F_X(2) = 0{,}92 - 0{,}39 = 0{,}53$.

**Resultado.** $0{,}20$; $0{,}33$; $0{,}78$; $0{,}53$. (El valor esperado de esta
variable es $E[X] = 2{,}80$.)
