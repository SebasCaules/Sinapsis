---
titulo: "01 - Estadística Descriptiva - Introducción (slides)"
resumen: "Slides introductorias de la unidad 1, 26 diapositivas que recorren la estadística descriptiva sobre un único conjunto de datos, el peso de 200 monedas de un euro, con medidas de posición, variabilidad y forma ya calculadas y su tabla de frecuencias."
tipo: fuente
formato: slides
unidad: 1
archivo_raw: "raw/02-estadistica-descriptiva/01 - Estadística Descriptiva - Introducción.pptx"
ingerido: 2026-05-30
actualizado: 2026-05-30
---

# 01 - Estadística Descriptiva - Introducción (slides)

**Qué es:** las slides introductorias de la Unidad 1 (Estadística Descriptiva),
26 diapositivas. Recorren toda la unidad de forma visual usando un **único dataset
concreto: el peso de 200 monedas de € 1**.

> **Comparte casi todo el contenido conceptual con la teórica
> [[estadistica-descriptiva-general|02 - General]]**: define las mismas medidas
> (tendencia central, variabilidad, forma), los mismos gráficos (histograma,
> polígono, boxplot) y los datos agrupados. La diferencia es que estas slides son
> el **recorrido motivador** con un ejemplo numérico cerrado, mientras que la
> teórica General es la presentación formal con las fórmulas. Estas dos fuentes
> sustentan en conjunto las páginas de conceptos de U1.

## El dataset de las 200 monedas
Se **pesan 200 monedas de € 1 tomadas al azar** (la muestra; se espera que sea
representativa de toda la población de monedas acuñadas). El peso (en gramos) es
la característica cuantitativa que se estudia. Sobre este conjunto se calculan
todas las medidas de la unidad.

### Gráficos exploratorios iniciales (slide 3)
Antes de calcular nada, "dos gráficos para dar un primer vistazo de los datos":
- **Muestra vs. caso (scatterplot):** cada peso contra el número de moneda.
- **Constante vs. muestra:** dispersión de los datos sobre una recta.

Son un paso **exploratorio previo** para mirar la nube de puntos antes de resumirla.
Ver [[histograma-y-frecuencias]] / [[estadistica-descriptiva]].

### Medidas calculadas sobre las 200 monedas
| Tipo | Medida | Valor (slide) |
|---|---|---|
| Posición (slide 5) | media $\bar x$ | $7.5204$ |
| | mediana $q_2$ | $7.5180$ |
| | tercer cuartil $q_3$ | $7.5445$ |
| | primer cuartil $q_1$ | $7.4970$ |
| Variabilidad (slide 7) | rango $R$ | $0.20200$ |
| | rango intercuartil IQR | $0.04750$ |
| | desvío estándar $s$ | $0.03481$ |
| Forma (slide 10) | asimetría $\gamma$ | $0.13174$ |
| | curtosis $\kappa$ | $-0.10237$ |
| Forma corregida (slide 12) | asimetría $\gamma$ | $0.13274$ |
| | curtosis $\kappa$ | $-0.04442$ |

### Tabla de frecuencias del dataset (slides 13-18)
La muestra se agrupa en 8 intervalos de longitud $0.030$:

| Lím. inf. | Lím. sup. | Marca | Frec. | Frec. acum. | Frec. rel. | Frec. rel. acum. |
|---|---|---|---|---|---|---|
| 7.405 | 7.435 | 7.420 | 1 | 1 | 0.005 | 0.005 |
| 7.435 | 7.465 | 7.450 | 10 | 11 | 0.050 | 0.055 |
| 7.465 | 7.495 | 7.480 | 37 | 48 | 0.185 | 0.240 |
| 7.495 | 7.525 | 7.510 | 62 | 110 | 0.310 | 0.550 |
| 7.525 | 7.555 | 7.540 | 61 | 171 | 0.305 | 0.855 |
| 7.555 | 7.585 | 7.570 | 24 | 195 | 0.120 | 0.975 |
| 7.585 | 7.615 | 7.600 | 4 | 199 | 0.020 | 0.995 |
| 7.615 | 7.645 | 7.630 | 1 | 200 | 0.005 | 1.000 |
| | | | **200** | | **1.000** | |

Con ella se construye el **histograma y polígono de frecuencias** (slides 15-16) y
el **polígono de frecuencias relativas acumuladas** (slides 17-18).

## Puntos clave
- Introduce la distinción **[[poblacion-y-muestra|población vs muestra]]** y la
  idea de muestra *representativa* tomada al azar.
- **[[medidas-de-tendencia-central|Posición]]**: media, mediana, cuartiles
  $q_1, q_3$ (con su interpretación: la media conserva la suma; la mediana es robusta).
- **[[medidas-de-dispersion|Variabilidad]]**: rango, IQR, desvío estándar (nulo
  sii todos los datos son iguales).
- **[[boxplot|Diagrama de caja]]**: marca *outliers* moderados fuera de los límites
  de Tukey.
- **[[asimetria-y-curtosis|Parámetros de forma]]**: coeficiente de simetría (sesgo
  positivo/negativo) y de curtosis (concentración en torno a la media; $\approx 0$
  para normal). Incluye además la **versión con corrección por muestra pequeña**
  (slides 11-12): evita un sesgo en la estimación (se retoma al ver estimadores) y,
  para la curtosis, la corrección sirve solo para variables normales.
- **[[histograma-y-frecuencias|Frecuencias]]** absolutas/relativas/acumuladas y el
  **polígono de frecuencias acumuladas**.
- **[[datos-agrupados|Datos agrupados]]** y el cálculo de parámetros y cuartiles
  con la tabla de frecuencias (interpolación), cerrando con "Datos completos vs.
  datos agrupados" (slide 26).

## Páginas del wiki que toca
- [[estadistica-descriptiva]] (hub)
- [[poblacion-y-muestra]], [[medidas-de-tendencia-central]],
  [[medidas-de-dispersion]], [[asimetria-y-curtosis]], [[cuartiles-y-percentiles]],
  [[histograma-y-frecuencias]], [[boxplot]], [[datos-agrupados]]
