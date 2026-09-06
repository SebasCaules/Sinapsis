---
titulo: Formulario — Estadística Descriptiva
resumen: "Hoja de la unidad 1: frecuencias e histograma, medidas de tendencia central y de dispersión, cuartiles, asimetría y curtosis, boxplot y valores atípicos, con las versiones ponderadas e interpoladas para datos agrupados."
tipo: formulario
unidad: 1
orden: 11
tags: [estadistica-descriptiva, formulario, cheat-sheet]
fuentes: ["[[estadistica-descriptiva]]", "[[medidas-de-tendencia-central]]", "[[medidas-de-dispersion]]", "[[asimetria-y-curtosis]]", "[[cuartiles-y-percentiles]]", "[[histograma-y-frecuencias]]", "[[boxplot]]", "[[datos-agrupados]]", "[[tecnica-datos-agrupados-interpolacion]]"]
actualizado: 2026-09-04
---

# Formulario — Estadística Descriptiva

Hoja de fórmulas de la unidad 1. Detalle en [[estadistica-descriptiva]] y en las
páginas de cada medida.

> **Técnica.** Antes de elegir la fórmula, mire si el enunciado le da los **datos
> individuales** o solo una **tabla de frecuencias por intervalos**. Con datos
> individuales se usan las fórmulas de suma directa; con una tabla se usan las
> versiones ponderadas por la frecuencia y, para mediana, cuartiles, moda y
> proporciones, la **interpolación lineal sobre la frecuencia acumulada** — ver
> [[tecnica-datos-agrupados-interpolacion]]. Confundir las dos vías es el error más
> frecuente de la unidad.

## Frecuencias e histograma

Intervalos (*bins*) $a_1 < a_2 < \dots < a_{N+1}$ sobre la muestra $\{x_i\}_{i=1}^n$.
Ver [[histograma-y-frecuencias]].

- **Frecuencia absoluta:** $n_k = |\{x_i : x_i \in (a_k, a_{k+1}]\}|$
- **Frecuencia relativa:** $f_k = \dfrac{n_k}{n}$
- **Normalización de las frecuencias:** $\sum_{k=1}^N n_k = n,\qquad \sum_{k=1}^N f_k = 1$
- **Frecuencia relativa acumulada:** $F(\alpha) = \dfrac{|\{x_i : x_i \le \alpha\}|}{n} \in [0,1]$

## Tendencia central

Muestra ordenada $\tilde x_1 \le \tilde x_2 \le \dots \le \tilde x_n$. Ver
[[medidas-de-tendencia-central]].

| Objeto | Fórmula |
|---|---|
| Media | $\bar x = \dfrac{1}{n}\sum_{i=1}^n x_i$ |
| Mediana ($n$ impar) | $q_2 = \tilde x_{(n+1)/2}$ |
| Mediana ($n$ par) | $q_2 = \dfrac{\tilde x_{n/2} + \tilde x_{n/2+1}}{2}$ |
| Moda | valor de frecuencia máxima (la muestra puede ser multimodal) |

## Dispersión

Ver [[medidas-de-dispersion]].

| Objeto | Fórmula |
|---|---|
| Rango | $R = \lvert\max_i x_i - \min_i x_i\rvert$ |
| Varianza muestral | $s^2 = \dfrac{1}{n-1}\sum_{i=1}^n (x_i - \bar{x})^2$ |
| Desvío estándar muestral | $s = \sqrt{s^2}$ |
| Desvío absoluto medio | $w = \dfrac{1}{n}\sum_{i=1}^n \lvert x_i - \bar{x}\rvert$ |
| Desviación absoluta mediana (MAD) | $\text{MAD} = \text{mediana}\{\lvert x_i - \bar{x}\rvert\}$ |
| Rango intercuartílico | $\text{IQR} = q_3 - q_1$ |

El denominador $n-1$ de $s^2$ es el que corresponde a la varianza **muestral**;
la mediana, el MAD y el IQR son las versiones **robustas** frente a valores
atípicos.

## Cuartiles y percentiles

Ver [[cuartiles-y-percentiles]].

- **Cuartil (definición por posición):** el $j$-ésimo cuartil es un $q_j \in [\tilde x_k, \tilde x_{k+1}]$ tal que $\dfrac{k}{n} \le j\cdot 0.25 < \dfrac{k+1}{n}$
- **Posición del percentil:** $h = p \cdot n$
- **Percentil — $h$ entero (promedio de dos órdenes):** $\text{percentil}_p = \dfrac{\tilde x_h + \tilde x_{h+1}}{2}$
- **Percentil — $h$ no entero (interpolación), con $k=\lfloor h\rfloor$ y $f=h-k$:** $\text{percentil}_p = \tilde x_k + f\,(\tilde x_{k+1} - \tilde x_k)$

> ⚠️ Discrepancia: el criterio de interpolación de arriba proviene de
> [[video-percentilos]] y reproduce todos sus ejemplos con $n=60$, pero choca con la
> definición de mediana para $p=0.5$ y $n$ impar. **Prevalece la definición de
> mediana** de [[medidas-de-tendencia-central]]. El análisis completo está en
> [[cuartiles-y-percentiles]].

## Forma

Ver [[asimetria-y-curtosis]].

- **Coeficiente de asimetría:** $\gamma = \dfrac{\sum_{i=1}^n (x_i - \bar{x})^3}{n\, s^3}$
- **Exceso de curtosis:** $\kappa = \dfrac{\sum_{i=1}^n (x_i - \bar{x})^4}{n\, s^4} - 3$

Signo de $\gamma$: sesgo a derecha o a izquierda. Normal $\Rightarrow \kappa = 0$
(mesocúrtica).

## Datos agrupados — fórmulas ponderadas

Intervalos $[L_i, L_{s,i})$ con frecuencia $f_i$, $n=\sum f_i$ y $L$ intervalos.
Todas son **aproximadas**: reemplazan cada dato por la marca de clase de su
intervalo. Ver [[datos-agrupados]].

| Objeto | Fórmula |
|---|---|
| Marca de clase | $x_i = \dfrac{L_i + L_{s,i}}{2}$ |
| Media agrupada | $\bar x_{Ag} = \dfrac{\sum_{i=1}^L x_i f_i}{n}$ |
| Desvío agrupado | $s_{Ag} = \sqrt{\dfrac{\sum_{i=1}^L (x_i - \bar x_{Ag})^2 f_i}{n-1}}$ |
| Asimetría agrupada | $\gamma_{Ag} = \dfrac{\sum (x_i - \bar x_{Ag})^3 f_i}{n\, s_{Ag}^3}$ |
| Curtosis agrupada | $\kappa_{Ag} = \dfrac{\sum (x_i - \bar x_{Ag})^4 f_i}{n\, s_{Ag}^4} - 3$ |

## Interpolación sobre la acumulada (datos agrupados)

$F_i$ es la frecuencia **acumulada** hasta $L_{s,i}$ y $F_{i-1}$ la acumulada hasta
el límite inferior del intervalo elegido. Ver
[[tecnica-datos-agrupados-interpolacion]].

- **Cuartil agrupado por interpolación:** $q_{j,Ag} = L_i + \dfrac{j\cdot 0.25\cdot n - F_{i-1}}{f_i}\,(L_{s,i} - L_i)$
- **Acumulada interpolada:** $P(x) = F_{i-1} + (F_i - F_{i-1})\,\dfrac{x - L_i}{L_{s,i}-L_i}$
- **Proporción de datos en $(a,b)$:** $\dfrac{P(b) - P(a)}{n}$
- **Moda agrupada — forma implícita:** $(M - L_I)\,(f_M - f_D) = (L_D - M)\,(f_M - f_I)$
- **Moda agrupada — despejada:** $M = \dfrac{L_D\,(f_M - f_I) + L_I\,(f_M - f_D)}{(f_M - f_I) + (f_M - f_D)}$
- **Moda agrupada — convención del punto medio:** $M = \dfrac{L_I + L_D}{2}$

Para la mediana se usa la fórmula del cuartil con $j=2$, es decir localizando
$n/2$ sobre la acumulada.

## Boxplot y outliers

Caja de $q_1$ a $q_3$, con la mediana $q_2$ marcada adentro. Ver [[boxplot]].

- **Bigotes (cercas de Tukey):** $L_W = q_1 - 1.5\cdot\text{IQR}, \qquad U_W = q_3 + 1.5\cdot\text{IQR}$

Todo dato fuera de $[L_W, U_W]$ es un **outlier**. Los bigotes que se dibujan no
llegan hasta $L_W$ y $U_W$: se detienen en el último dato real que queda dentro.

## Cuándo usar qué

- Le dan los datos uno por uno y piden "resumir la muestra": media, mediana, desvío muestral y cuartiles, en ese orden.
- Le dan una tabla de frecuencias por intervalos: todo pasa a las versiones ponderadas por frecuencia, y la mediana, los cuartiles y la moda salen por interpolación, no por suma.
- Piden "qué porcentaje de los datos cae entre tal y tal valor": interpole la acumulada en los dos extremos y divida la diferencia por el total.
- Hay valores extremos sospechosos y quieren una medida que no se mueva: mediana, MAD e IQR en lugar de media, desvío y rango.
- Piden detectar outliers o dibujar un boxplot: cuartiles primero, después el rango intercuartílico y las cercas de Tukey.
- Preguntan por la forma de la distribución: asimetría para el sesgo, exceso de curtosis para el peso de las colas comparado con la normal.
