---
titulo: Probabilidad total y teorema de Bayes
resumen: 'Con una partición del universo, la probabilidad total arma $P(B)=\sum_k P(B\mid A_k)P(A_k)$ y Bayes invierte la condicional: $P(A_i\mid B)=P(B\mid A_i)P(A_i)/P(B)$. Es la maquinaria de los problemas de test diagnóstico.'
tipo: concepto
unidad: 2
orden: 9
tags: [probabilidad, bayes, probabilidad-total, particion]
fuentes: ["[[independencia-condicional-bayes]]", "[[tp2-calculo-de-probabilidades]]"]
actualizado: 2026-09-04
---

# Probabilidad total y teorema de Bayes

**En breve.** Si se parte el universo en casos $\{A_k\}$, la probabilidad total **arma**
$P(B)$ sumando lo que aporta cada caso, y [[probabilidad-total-y-bayes|Bayes]] **da
vuelta** la condicional para pasar de $P(B\mid A_k)$ a $P(A_k\mid B)$ — de la causa al
diagnóstico. Es la maquinaria de los problemas de tests, fallas y diagnóstico.

## Partición
Una colección $\{A_k\}$ es una **partición** de $S$ sii:
1. son [[espacio-muestral-y-eventos|mutuamente excluyentes]] ($A_k\cap A_j=\emptyset$ si $k\neq j$),
2. $S=\bigcup_k A_k$ (cubren todo $S$).

Ejemplo simple: cualquier evento y su complemento, $\{A, A^c\}$.

## Fórmula de la probabilidad total
Para todo evento $B$ y partición $\{A_k\}$, primero se descompone $B$ en pedazos
disjuntos $B\cap A_k$ (forma equivalente, antes de aplicar la condicional):
$$ P(B) = \sum_k P(B\cap A_k) = \sum_k P(B\mid A_k)\,P(A_k). $$
Se "arma" $B$ a partir de los pedazos $B\cap A_k$ (m.e.) y se usa la
[[probabilidad-condicional|condicional]] $P(B\cap A_k)=P(B\mid A_k)P(A_k)$.

## Teorema de Bayes
Permite **dar vuelta** la condicional. Con $B$ evento y $\{A_k\}$ partición:
$$ P(A_i\mid B) = \frac{P(B\mid A_i)\,P(A_i)}{\sum_k P(B\mid A_k)\,P(A_k)}. $$
- $P(A_i)$ = probabilidad **a priori** (antes de la info extra).
- $P(A_i\mid B)$ = probabilidad **a posteriori** (después de observar $B$).

> [!figura] u2-bayes-mosaico-area
> El cuadrado de área 1 partido por el prior (ancho de cada columna) y por la verosimilitud (alto dentro de cada columna): $P(B)$ es la franja de positivos completa y $P(A_i\mid B)$ es la fracción verde de esa franja. Note que con prevalencia baja el rectángulo de falsos positivos es delgado pero se apoya sobre una columna mucho más ancha, y eso es lo que mantiene baja la probabilidad a posteriori.

**Intuición.** Se conoce la cadena causa → efecto ($P(B\mid A_i)$: dada la causa, qué tan
probable es el síntoma) pero se observa el efecto $B$ y se quiere deducir la causa. Bayes
"invierte la flecha": el numerador $P(B\mid A_i)P(A_i)$ es el peso del camino que pasa
por $A_i$ y produce $B$, y el denominador $P(B)$ (la probabilidad total) **normaliza**
entre todos los caminos que llegan a $B$. Por eso una causa rara (a priori chica) puede
seguir siendo improbable aun con un síntoma que la sugiere fuerte.

## Ejercicio resuelto
*El 4% de los varones y el 2% de las mujeres son daltónicos. Las mujeres son el 53%
de la población. ¿Qué proporción de varones hay entre los daltónicos?*

Sean $D$ = daltónico, $V$ = varón. Datos: $P(V)=0.47$, $P(\bar V)=0.53$,
$P(D\mid V)=0.04$, $P(D\mid \bar V)=0.02$. Como $\{V,\bar V\}$ es partición:

**Probabilidad total:**
$$ P(D) = P(D\mid V)P(V) + P(D\mid\bar V)P(\bar V) = 0.04(0.47)+0.02(0.53) = 0.0294. $$

**Bayes** (lo que se pide, $P(V\mid D)$):
$$ P(V\mid D) = \frac{P(D\mid V)P(V)}{P(D)} = \frac{0.0188}{0.0294} \approx 0.6395. $$
(Y $P(\bar V\mid D)=1-0.6395=0.3605$.)

## Ejercicio resuelto — test diagnóstico (falso positivo / falso negativo)
*(De [[tp2-calculo-de-probabilidades]] ej. 25.)* Un análisis detecta una enfermedad con
**sensibilidad** $P(+\mid E)=0.9$ y **especificidad** $P(-\mid E^c)=0.99$ (es decir
$P(+\mid E^c)=0.01$). La **prevalencia** es $P(E)=0.05$ (y $P(E^c)=0.95$). Calcular:
(a) $P(+)$; (b) falso positivo; (c) falso negativo; (d) $P(E\mid +)$; (e) si se repite el
análisis en otro laboratorio (independiente dada la condición) y ambos dan positivo,
$P(E\mid +_1\cap +_2)$.

**(a) Probabilidad total** de positivo:
$$ P(+) = P(+\mid E)P(E) + P(+\mid E^c)P(E^c) = 0.9(0.05)+0.01(0.95) = 0.0545. $$

**(b) Falso positivo** = positivo **y** sano:
$$ P(+\cap E^c) = P(+\mid E^c)P(E^c) = 0.01\cdot 0.95 = 0.0095. $$

**(c) Falso negativo** = negativo **y** enfermo:
$$ P(-\cap E) = P(-\mid E)P(E) = 0.1\cdot 0.05 = 0.005. $$

**(d) Bayes** (lo que importa clínicamente, valor predictivo positivo):
$$ P(E\mid +) = \frac{P(+\mid E)P(E)}{P(+)} = \frac{0.045}{0.0545} \approx 0.8257. $$

**(e) Dos positivos** independientes dada la condición ($P(+_1\cap +_2\mid E)=P(+_1\mid E)P(+_2\mid E)$):
$$ P(E\mid +_1\cap +_2) = \frac{0.9^2\,(0.05)}{0.9^2(0.05)+0.01^2(0.95)} \approx 0.9977. $$
(Repetir el test confirmatorio dispara la probabilidad a posteriori de $\approx 0.83$ a $\approx 1$.)

## Relación
[[probabilidad-condicional]] · [[independencia]] · [[arbol-de-probabilidades]]
(este problema se arma como árbol de dos niveles) · reaparece en
[[inferencia-estadistica|estimación]] (estimación máximo a posteriori).
