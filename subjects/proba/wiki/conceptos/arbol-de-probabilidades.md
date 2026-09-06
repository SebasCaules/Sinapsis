---
titulo: Árbol de probabilidades
resumen: "Diagrama por etapas: cada arista lleva una probabilidad condicional y la probabilidad de un camino es el producto de sus aristas. Sumar hojas da la probabilidad total e invertir el árbol da Bayes; es el método más seguro en problemas de varias fases."
tipo: concepto
unidad: 2
orden: 10
tags: [probabilidad, arbol, condicional, bayes, particion]
fuentes: ["[[tp2-calculo-de-probabilidades]]", "[[independencia-condicional-bayes]]", "[[video-condicional]]"]
actualizado: 2026-09-04
---

# Árbol de probabilidades

**En breve.** Diagrama por etapas que pone en una sola imagen la
[[probabilidad-condicional|condicional]] (etiquetas de aristas), la
[[probabilidad-total-y-bayes|probabilidad total]] (sumar hojas) y
[[probabilidad-total-y-bayes|Bayes]] (invertir el árbol). Es el método más seguro
para no perderse en problemas de varias fases.

El **árbol de probabilidades** es la herramienta gráfica para organizar experimentos
**por etapas**: en cada nivel se ramifica según los resultados posibles y se etiquetan
las aristas con probabilidades **condicionales**. Hace visibles de un vistazo la
[[probabilidad-condicional|condicional]], la
[[probabilidad-total-y-bayes|probabilidad total]] y [[probabilidad-total-y-bayes|Bayes]].

## Las 4 reglas
Según [[tp2-calculo-de-probabilidades]] (repaso, pág. 4), para armar y leer el árbol:

1. **Etiqueta de cada arista**: en cada arista se coloca la probabilidad **condicional
   del nodo destino** (nodo "hijo") **dada** la intersección de todos los nodos del
   camino desde la raíz hasta él (la intersección de todos sus "antepasados").
2. **Los hijos forman una partición**: los nodos hijos de un mismo nodo son
   [[espacio-muestral-y-eventos|mutuamente excluyentes]] y su unión es el universo →
   son una [[probabilidad-total-y-bayes|partición]].
3. **Las aristas que salen de un nodo suman 1** (consecuencia de las dos anteriores:
   las condicionales sobre un mismo condicionante son una probabilidad legítima).
4. **Probabilidad de un camino = producto de sus aristas**: la probabilidad de la
   intersección de todos los nodos atravesados en un camino es el **producto** de las
   etiquetas de las aristas recorridas (regla del producto / probabilidad compuesta).

> Reglas 1 y 4 son la **regla de la multiplicación**
> $P(A\cap B)=P(A)\,P(B\mid A)$; la regla 2 es la **partición** y la 3 es que las
> condicionales suman 1. Sumar varias **hojas** que contienen un mismo evento es la
> **fórmula de probabilidad total**; invertir el árbol (de una hoja a una rama de
> arriba) es **Bayes**.

> [!figura] u2-arbol-bayes-invertido
> El árbol de dos niveles del ejemplo de daltónicos, con las cuatro reglas de arriba en acción: cada arista lleva $P(\text{hijo}\mid\text{antepasados})$, los hijos de un nodo son una partición, las aristas hermanas suman 1 y cada hoja es el producto de las etiquetas de su camino. Al invertir el árbol las hojas conservan exactamente su valor y solo cambian las etiquetas de las aristas, que pasan a ser las probabilidades a posteriori: eso, y nada más, es el teorema de Bayes.

## Cómo se usa
- **Probabilidad total** de un evento $B$ = suma de las probabilidades de **todos los
  caminos (hojas) que terminan en $B$**.
- **Bayes** ("invertir el árbol"): $P(\text{rama}\mid B)=\dfrac{\text{prob. del camino que pasa por la rama y llega a }B}{P(B)}$.

## Ejercicio resuelto — daltónicos (árbol → Bayes)
*El 4% de los varones y el 2% de las mujeres son daltónicos. Las mujeres son el 53% de
la población. ¿Qué proporción de varones hay entre los daltónicos?* (mismo ejemplo de
[[independencia-condicional-bayes]] y [[probabilidad-total-y-bayes]], armado como árbol.)

**Primer nivel — sexo (partición $\{V,\bar V\}$):**
$$ P(V)=0.47,\qquad P(\bar V)=0.53. \quad(\text{suman }1,\ \text{regla 3}) $$

**Segundo nivel — daltonismo (condicionado al sexo):**
$$ P(D\mid V)=0.04,\quad P(D^c\mid V)=0.96,\qquad P(D\mid\bar V)=0.02,\quad P(D^c\mid\bar V)=0.98. $$

**Hojas (regla 4, producto del camino):**

| Camino | Probabilidad |
|---|---|
| $V\to D$ | $0.47\cdot 0.04 = 0.0188$ |
| $V\to D^c$ | $0.47\cdot 0.96 = 0.4512$ |
| $\bar V\to D$ | $0.53\cdot 0.02 = 0.0106$ |
| $\bar V\to D^c$ | $0.53\cdot 0.98 = 0.5194$ |

(las cuatro hojas suman $1$.)

**Probabilidad total** de daltónico = suma de las hojas con $D$:
$$ P(D) = 0.0188 + 0.0106 = 0.0294. $$

**Bayes** ("invertir el árbol", lo que se pide):
$$ P(V\mid D) = \frac{P(V\cap D)}{P(D)} = \frac{0.0188}{0.0294} \approx 0.6395. $$
Es decir, $\approx 64\%$ de los daltónicos son varones (y $P(\bar V\mid D)\approx 0.3605$).

Ver también el ejemplo trabajado paso a paso en [[video-condicional]] (11:04-18:35):
extracción de 2 cartas sin reposición de un mazo de 5, cálculo de $P(B_2)$ primero por
conteo directo y después leyendo un árbol de dos etapas —mismo procedimiento de "sumar
los productos de las ramas" que esta página describe, aplicado en vivo.

## Relación
- [[probabilidad-condicional]] — etiquetas de las aristas (regla 1).
- [[probabilidad-total-y-bayes]] — sumar hojas (total) y invertir el árbol (Bayes).
- [[independencia]] — si las etapas son independientes, las etiquetas condicionales no
  dependen del camino (todas las ramas iguales nivel a nivel).
- Reaparece en U3 ([[variable-aleatoria|construir una v.a.d. con un árbol → PMF → E, V]])
  y en el [[tp2-calculo-de-probabilidades|TP2]] ej. 30 (mezcla de calidades, tabla 2×3)
  y ej. 29 (canal binario con 3 repetidores).
