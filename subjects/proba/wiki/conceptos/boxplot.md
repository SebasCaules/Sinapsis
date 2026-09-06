---
titulo: Boxplot (diagrama de caja)
resumen: 'Resume la muestra con cinco números (mínimo, $q_1$, mediana, $q_3$, máximo) y detecta atípicos con la regla de Tukey $q_1-1.5\,\mathrm{IQR}$ y $q_3+1.5\,\mathrm{IQR}$; los bigotes terminan en el dato real más extremo dentro de esos límites.'
tipo: concepto
unidad: 1
orden: 8
tags: [estadistica-descriptiva, boxplot, outliers]
fuentes: ["[[estadistica-descriptiva-general]]", "[[video-histogramas]]", "[[video-boxplots]]"]
actualizado: 2026-09-04
---

# Boxplot (diagrama de caja)

**En breve.** El boxplot dibuja la muestra con apenas cinco números (mínimo,
$q_1$, mediana, $q_3$, máximo) y marca automáticamente los outliers; es la
herramienta más rápida para comparar varias muestras y ver de un vistazo centro,
dispersión y [[asimetria-y-curtosis|asimetría]].

Gráfico que resume la distribución usando los [[cuartiles-y-percentiles|cuartiles]],
sin graficar todas las observaciones.

## Anatomía
- **Caja**: va de $q_1$ a $q_3$ → representa el **50% central** de los datos.
- **Línea dentro de la caja**: la [[medidas-de-tendencia-central|mediana]] $q_2$.
- **Bigotes**: se extienden hasta el mínimo y el máximo *"normales"*.
- **Outliers**: puntos sueltos, datos atípicos (ver abajo).

## Outliers — regla de Tukey
Basada en el [[medidas-de-dispersion|rango intercuartil]] $\text{IQR}=q_3-q_1$:
$$ L_W = q_1 - 1.5\cdot\text{IQR}, \qquad U_W = q_3 + 1.5\cdot\text{IQR}. $$
Los datos que **exceden** estos límites $[L_W, U_W]$ se consideran **outliers**.
Los bigotes llegan hasta el dato más extremo que aún esté dentro de los límites.

> [!figura] u1-bigotes-vs-limites-de-tukey
> El bigote superior se detiene en el **dato real** más grande que sigue por debajo de $U_W$. Al llevar el punto móvil por encima de la valla, el bigote salta hacia atrás en lugar de estirarse hasta $U_W$.

> ⚠️ **Error frecuente (marcado en clase por el docente).** Los bigotes **no**
> llegan necesariamente hasta $L_W$ y $U_W$: esos son solo los *límites* de lo
> normal. El bigote se corta en el dato real más extremo que sigue dentro de ese
> rango — "el boxplot se termina donde se terminan los datos", no donde termina
> el margen de Tukey. Es el punto que más se malinterpreta según
> [[video-boxplots|la clase de Boxplots]].

> **Intuición.** El factor $1.5$ es una convención: define un "margen razonable" de
> ancho una vez y media la caja a cada lado. Como el [[medidas-de-dispersion|IQR]]
> solo usa el 50% central, este criterio es **robusto** — un outlier no agranda la
> regla que sirve para detectarlo, a diferencia de lo que pasaría usando media y
> desvío (que el propio outlier inflaría).

## Lectura de la forma
La distancia desigual de $q_1$ y $q_3$ a la mediana revela **[[asimetria-y-curtosis|asimetría]]**.

### Comparación de boxplots
Para comparar la distribución de varios grupos, los boxplots deben graficarse
**en paralelo, en el mismo gráfico y con la misma escala** — de lo contrario no
son comparables.

> **Cuidado con el ancho de la caja.** El ancho de la caja suele estar vinculado
> con la **cantidad de observaciones** del grupo. Un grupo con pocos datos
> produce una caja visualmente tan "sólida" como una con muchos, pero sus
> cuartiles son mucho menos confiables — conviene tomar con pinza los resúmenes
> de un boxplot armado con pocas observaciones (ver ejemplo comparativo en
> [[video-boxplots|la clase de Boxplots]]).

Los outliers también se pueden reconocer directamente sobre un
[[histograma-y-frecuencias|histograma]], sin pasar por el boxplot: comparar el peso de
las colas. [[video-histogramas]] contrasta un histograma de colas **livianas** (viajes
en bicicleta, sin datos separados del resto) con uno de colas **pesadas** (viajes en
moto, con valores claramente atípicos a un lado).
