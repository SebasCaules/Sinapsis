---
titulo: Medidas de dispersión
resumen: 'Cuantifican qué tan esparcidos están los datos alrededor de su centro: rango, rango intercuartil, varianza muestral $s^2=\frac{1}{n-1}\sum(x_i-\bar{x})^2$, desvío estándar $s$ y las versiones robustas MAD y desvío absoluto medio.'
tipo: concepto
unidad: 1
orden: 4
tags: [estadistica-descriptiva, varianza, desvio, rango, iqr, mad]
fuentes: ["[[estadistica-descriptiva-general]]", "[[tp1-estadistica-descriptiva]]", "[[video-medidas-de-resumen]]"]
actualizado: 2026-09-04
---

# Medidas de dispersión

**En breve.** Cuantifican *"qué tan esparcidos"* están los datos alrededor de su
centro: dos muestras con la misma [[medidas-de-tendencia-central|media]] pueden ser
muy distintas si una está apretada y la otra desparramada, y eso es lo que mide la
dispersión (rango, IQR, varianza, desvío).

Informan *"qué tan dispersos"* están los datos alrededor de su centro. Junto con
las [[medidas-de-tendencia-central]] forman las medidas de resumen.

## Rango
$$ R = |\max_i x_i - \min_i x_i| $$
Muy sensible a [[boxplot|outliers]] (solo usa los dos extremos). El TP1 lo escribe
con barras de valor absoluto; como $\max \ge \min$, equivale a $\max_i x_i - \min_i x_i$.

## Rango intercuartil (IQR)
$$ \text{IQR} = q_3 - q_1 $$
Longitud del 50% **central** de los datos → robusto. Ver [[cuartiles-y-percentiles]]
y [[boxplot]] (define los bigotes y los outliers de Tukey).

## Varianza muestral
$$ s^2 = \frac{1}{n-1}\sum_{i=1}^n (x_i - \bar{x})^2 $$
Mide la dispersión promedio al cuadrado respecto de la [[medidas-de-tendencia-central|media]].
> Problema: queda en **unidades al cuadrado**. Se divide por $n-1$ (no $n$): es la
> versión muestral, relevante en [[inferencia-estadistica]].

> **Intuición.** Se elevan al cuadrado las distancias por dos razones: así no se
> cancelan los desvíos positivos con los negativos (que siempre suman cero), y se
> penaliza más a los datos muy lejanos. Dividir por $n-1$ en vez de $n$ corrige un
> sesgo: como $\bar x$ ya salió de los mismos datos, las distancias a $\bar x$ quedan
> un poco "demasiado chicas", y $n-1$ lo compensa. El detalle de por qué $n-1$ es
> insesgado se ve en [[varianza|la varianza poblacional]] y en
> [[estimacion-puntual|estimadores]].

## Desvío estándar
$$ s = \sqrt{s^2} $$
Misma unidad que los datos. Es la medida de dispersión más usada. Su valor
absoluto no siempre tiene interpretación directa, pero sirve para **comparar** dos
distribuciones con la misma media (una más dispersa que otra).

> [!figura] u1-bandas-x-ks-sobre-el-histograma
> Qué porcentaje de datos cae realmente dentro de $\bar x \pm k\,s$. Con el conjunto aproximadamente normal se recuperan las referencias 68 / 95 / 99 %; con el asimétrico esa regla práctica deja de valer.

> **Ejemplo.** Comparación subte vs. colectivo (mismos $n=61$, medias casi
> idénticas $\approx 40$ min) con desvíos muy distintos: subte $s=4.313204$,
> colectivo $s=7.240922$ — ilustra que la media sola "resume demasiado" y hace
> falta ver la dispersión. Fuente: [[video-medidas-de-resumen]] [16:29]. *Nota:*
> estas cifras son de la corrida de datos del video, distintas de las de
> [[estadistica-descriptiva-general]] (subte $s=4.792449$, colectivo
> $s=7.188674$) — ver la discrepancia documentada en
> [[video-medidas-de-resumen]].

## Media del desvío absoluto
$$ w = \frac{1}{n}\sum_{i=1}^n |x_i - \bar{x}| $$
Más "natural" que la varianza, pero analíticamente más incómoda ($x^2$ es
derivable en todos lados, $|x|$ no).

## Mediana del desvío absoluto (MAD)
$$ \text{MAD} = \text{mediana}\{\,|x_i - \bar{x}|\,\} $$
Medida **robusta**, usada en muchos contextos.

## Relación poblacional
La versión poblacional de la varianza muestral es la [[varianza|varianza $V(X)$]] de
una [[variable-aleatoria]] (con $\sigma = \sqrt{V(X)}$). El desvío muestral $s$
**estima** ese $\sigma$ poblacional.

## Con datos agrupados
$$ s_{Ag} = \sqrt{\frac{\sum_{i=1}^L (x_i - \bar{x}_{Ag})^2\, f_i}{n-1}} $$
($x_i$ = marca de clase). Ver [[datos-agrupados]].

## Ejercicio resuelto — desvío de 100 recién nacidos (TP1 ej. 5)
*Fuente: [[tp1-estadistica-descriptiva]] ej. 5 (resuelto).*

**Enunciado.** Peso (kg) de 100 recién nacidos, en tabla de datos agrupados:

| Marca $x_i$ | 2.7 | 2.9 | 3.1 | 3.3 | 3.5 | 3.7 | 3.9 | 4.1 | 4.3 | 4.5 |
|---|---|---|---|---|---|---|---|---|---|---|
| Frec. $f_i$ | 2 | 3 | 14 | 10 | 15 | 18 | 16 | 14 | 4 | 4 |

**Cálculo.** Con $n=100$ y $\bar x_{Ag} = 3.6460$ kg (ver
[[medidas-de-tendencia-central]]), el desvío agrupado es
$$ s = \sqrt{\frac{1}{n-1}\sum_{i=1}^{10} (x_i - \bar x_{Ag})^2\, f_i}
= \sqrt{\frac{17.7484}{99}} = 0.4234 \text{ kg}. $$
(Media y mediana del mismo ejercicio en [[medidas-de-tendencia-central]];
mediana por interpolación $=3.6667$ kg en [[tecnica-datos-agrupados-interpolacion]].)
