---
titulo: "Video — Boxplots"
resumen: "Clase corta de Lucio Pantazis (unidad 1) que construye un boxplot en vivo sobre tiempos de viaje reales: anatomía de la caja, regla de Tukey para los valores atípicos y comparación de cinco medios de transporte leyendo asimetría y colas."
tipo: fuente
formato: video
unidad: 1
url: "https://youtu.be/B_zoyRNvcRA"
duracion: "10:02"
docente: Lucio Pantazis
ingerido: 2026-09-03
---

# Video — Boxplots

**Qué es:** clase corta del Dr. Lucio Pantazis que presenta el boxplot recorriendo
en vivo su construcción sobre datos reales de tiempos de viaje, en vez de solo
enunciar la fórmula.
**Cubre:** anatomía del boxplot, outliers y la regla de Tukey, y comparación de
boxplots entre grupos.
**Guía asociada:** Guía 1.

## Recorrido de la clase

| Timestamp | Tema |
|---|---|
| [00:04] | Repaso: ya se vieron percentiles; se introduce el boxplot como gráfico que los usa. |
| [00:21] | Anatomía general: el diagrama se mueve entre el mínimo y el máximo de los datos. |
| [00:56] | La línea central de la caja es la mediana. |
| [01:26] | La caja (de $q_1$ a $q_3$) es el 50% central; su ancho es el rango intercuartil. |
| [02:03] | Los bigotes se extienden hasta el mínimo y el máximo "normales". |
| [02:40] | Outliers: ejemplo con los datos de taxi, que tienen valores atípicos por arriba. |
| [04:02] | Regla de Tukey: cómo se calcula el umbral de lo "atípico" ($L_W$, $U_W$). |
| [05:01] | Advertencia: el boxplot se corta donde terminan los datos reales, no en el límite de Tukey. |
| [05:55] | Paralelismo entre el boxplot y el gráfico exploratorio "valor vs. constante" (scatter). |
| [07:38] | Para comparar boxplots deben ir en la misma escala; el ancho de la caja se vincula con la cantidad de datos. |
| [08:25] | Ejemplo comparativo: cinco medios de transporte (Cabify, Subte, Taxi, Tren, Uber), leyendo asimetría y peso de colas. |

## Qué aporta sobre el apunte

La anatomía del boxplot y la regla de Tukey ya están desarrolladas en detalle en
[[boxplot]] (misma fórmula $L_W=q_1-1.5\cdot\text{IQR}$, $U_W=q_3+1.5\cdot\text{IQR}$),
así que el video no repite esa teoría. Aporta:

- **(a) Ejemplo resuelto en vivo.** En lugar de solo mostrar la fórmula, arma el
  boxplot paso a paso sobre el dataset real de tiempos de viaje en taxi (el mismo
  tipo de datos de [[estadistica-descriptiva-general]]): primero sin outliers,
  después marcándolos, mostrando que los valores atípicos no se grafican igual
  que el resto, sino aparte, como puntos sueltos por encima de la caja
  (02:52-03:11).
- **(a) Ejemplo comparativo.** Construye una comparación de cinco boxplots
  (Cabify, Subte, Taxi, Tren, Uber) y los lee uno por uno conectando la forma de
  cada caja con [[asimetria-y-curtosis|asimetría y colas pesadas/livianas]]
  (08:25-09:55) — ver detalle abajo.
- **(b) Analogía nueva.** Traza un paralelismo explícito entre el boxplot y el
  gráfico exploratorio "muestra vs. constante" (mencionado como paso 0 en
  [[estadistica-descriptiva-introduccion]]): el boxplot es una versión
  **resumida** de esa misma nube de puntos, que solo grafica los outliers y las
  medidas de resumen en vez de cada observación (05:55-07:06).
- **(c)/(d) Énfasis.** Insiste varias veces en que el boxplot grafica mientras
  haya datos y deja de graficar donde no los hay — que los bigotes no
  necesariamente tocan $L_W$/$U_W$ —
  marcándolo como el punto que más se malinterpreta (05:13-05:53 y 07:06-07:20). También
  remarca que el ancho de la caja es una pista informal de cuántas observaciones
  hay detrás de un grupo al comparar boxplots (07:38-08:24).

## Ejercicio resuelto en clase

Esta clase no desarrolla un ejercicio con cálculo numérico completo (no hay un
enunciado con datos concretos que se resuelvan a mano con la fórmula de Tukey).
En su lugar, el docente hace un **recorrido visual guiado** sobre boxplots ya
construidos a partir de datos reales, en dos partes:

**1. Boxplot de tiempos de viaje en taxi (02:40-05:53).** Sobre un boxplot vertical
del tiempo de viaje (en minutos):
- Muestra primero la versión **sin outliers**: caja entre aproximadamente 37 y 42
  minutos, mediana un poco menos de 40, bigotes hasta un mínimo de 30 y un máximo
  de 50 (valores leídos del eje, aproximados).
- Señala que esos datos "grafican distinto": varios puntos sueltos por encima de
  50 (los **outliers**) que quedan lejos del 50% central de la caja.
- Explica que esos puntos son atípicos porque exceden el límite superior de Tukey
  $U_W=q_3+1.5\cdot\text{IQR}$ — y da una interpretación intuitiva de qué
  significaría un dato así en la práctica: "hubo una obra y no pudo cruzar", "se
  quedó el tren", etc. — algo que amerita **inspeccionarse**, no descartarse sin
  más.
- Aclara el punto más importante de la clase: el bigote superior **no** llega
  hasta $U_W$, sino que se corta en el último dato real que está por debajo de
  $U_W$ — "el boxplot se termina" ahí porque no hay datos entre ese punto y el
  primer outlier.

**2. Paralelismo con el gráfico de puntos (05:55-07:06).** Superpone el boxplot
con el gráfico de "valor vs. constante" (cada observación como un punto sobre una
recta) de los mismos datos, mostrando que ambos dejan de graficar en el mismo
lugar: el boxplot es una versión resumida de esa nube de puntos.

**3. Comparación de cinco medios de transporte (08:25-09:55).** Sobre un gráfico
con un boxplot por medio de transporte (Cabify, Subte, Taxi, Tren, Uber, todos en
la misma escala), lee la forma de cada uno:
- Las medianas son parecidas entre grupos, salvo el taxi, que da un poco más baja.
- **Taxi**: colas pesadas, con varios outliers por arriba → asimetría a derecha.
- **Tren**: un outlier por abajo → asimetría a izquierda.
- **Uber**: outliers tanto por arriba como por abajo → cierta simetría, pero colas
  pesadas (conecta con una [[asimetria-y-curtosis|curtosis]] alta).
- **Subte**: caja más angosta (menos dispersión en el 50% central) pero sin
  outliers → colas livianas.
- Nota que, pese a tener formas distintas, dos grupos pueden terminar con el
  mismo desvío estándar si compensan menor dispersión central con colas más
  largas, o viceversa.

## Advertencias del docente

- **[05:01]** El boxplot "se termina" donde se terminan los datos: si no hay
  observaciones hasta el límite de Tukey $U_W$ (o $L_W$), el bigote no llega hasta
  ahí — no hay que confundir el límite de Tukey con el punto real donde termina el
  bigote. Lo marca explícitamente como algo importante de entender bien.
- **[08:13]** Al comparar grupos, si uno tiene muy pocos datos, "esos datos los
  tengo que agarrar con pinza": la caja se ve igual de sólida visualmente tenga pocas o muchas
  observaciones detrás, pero la confianza en sus cuartiles no es la misma.
- **[08:29]** Para que la comparación entre boxplots sea válida, siempre deben
  graficarse en el mismo gráfico y con la misma escala.

## Páginas del wiki que toca

- [[boxplot]]
- [[cuartiles-y-percentiles]]
- [[medidas-de-dispersion]]
- [[asimetria-y-curtosis]]
- [[histograma-y-frecuencias]]
- [[estadistica-descriptiva]]
