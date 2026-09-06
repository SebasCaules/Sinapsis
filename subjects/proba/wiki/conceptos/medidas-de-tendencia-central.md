---
titulo: Medidas de tendencia central
resumen: 'Media $\bar{x}=\frac{1}{n}\sum x_i$, mediana y moda resumen dónde se ubica el centro de los datos; la media es sensible a valores atípicos y la mediana es robusta, así que elegir cuál reportar ya es una decisión estadística.'
tipo: concepto
unidad: 1
orden: 3
tags: [estadistica-descriptiva, media, mediana, moda]
fuentes: ["[[estadistica-descriptiva-general]]", "[[tp1-estadistica-descriptiva]]", "[[video-histogramas]]", "[[video-medidas-de-resumen]]"]
actualizado: 2026-09-04
---

# Medidas de tendencia central

**En breve.** **Media, mediana y moda** son tres formas de responder *"por dónde anda
el centro de los datos"*; difieren en cómo reaccionan a valores extremos, por lo que
elegir cuál reportar ya es una decisión estadística.

Números que informan *"por dónde andan los valores"* de una muestra
$\{x_i\}_{i=1}^n$. Forman parte de las [[estadistica-descriptiva|medidas de resumen]].

## Media muestral (promedio)
$$ \bar{x} = \frac{\sum_{i=1}^n x_i}{n} $$
Interpretación: el punto que "equilibra" los datos sobre la recta. Los valores más
alejados son los más influyentes en el cálculo → **sensible a outliers**.

> **Control de coherencia ([[video-medidas-de-resumen]], 09:52):** La media siempre debe
> caer dentro de $[\min_i x_i,\ \max_i x_i]$. Si el resultado cae fuera de ese rango,
> hay un error de cuenta — útil como verificación rápida en un parcial.

## Mediana
Valor que divide a los datos **a la mitad** (50% por debajo, 50% por encima). Se
calcula ordenando la muestra $\tilde x_1 \le \dots \le \tilde x_n$:
- **$n$ impar**: es la observación central, posición $(n+1)/2$.
- **$n$ par**: no hay una única observación que parta a la mitad → se toma el
  **promedio de las dos centrales** (posiciones $n/2$ y $n/2+1$).

> [!figura] u1-paridad-de-n-y-la-mediana
> Con $n$ impar la posición $(n+1)/2$ deja la misma cantidad de datos a cada lado; con $n$ par ninguna posición lo consigue —queda 29 contra 30 o 30 contra 29— y por eso se promedian las dos centrales.

Es el **segundo cuartil** $q_2$ → ver [[cuartiles-y-percentiles]].

## Moda
Valor que *"aparece más frecuentemente"*.
- Puede haber más de una → distribuciones **multimodales**.
- Para datos continuos: se divide el rango en intervalos y la moda es el punto
  medio del intervalo con mayor frecuencia (depende de los intervalos elegidos).
  Ver [[datos-agrupados]] e [[histograma-y-frecuencias]].
- Sirve también para datos cualitativos (p. ej. el apellido más común).

> ⚠️ **Error frecuente (advertencia del docente).** [[video-histogramas]] marca una
> confusión típica: pensar que el intervalo modal (el de mayor frecuencia) es
> automáticamente "el más importante" porque ahí "debería estar" la media. En su
> ejemplo la media da $\bar x=40$ pero el intervalo modal es $[37,39)$, que **no la
> contiene** — la media es un resumen distinto de la moda y no tienen por qué
> coincidir espacialmente en el histograma.

### Moda con datos agrupados: dos convenciones
Cuando los datos están agrupados, primero se identifica el **intervalo modal**
(el de frecuencia máxima $f_M$, entre $L_I$ y $L_D$) y luego:
1. **Punto medio:** $M = (L_I + L_D)/2$ (la marca de clase del intervalo modal).
2. **Interpolación** según las frecuencias **vecinas** $f_I$ (izquierda) y $f_D$
   (derecha), repartiendo el exceso proporcionalmente:
   $$ (M - L_I)(f_M - f_D) = (L_D - M)(f_M - f_I) \ \Rightarrow\
      M = \frac{L_D(f_M - f_I) + L_I(f_M - f_D)}{(f_M - f_I)+(f_M - f_D)}. $$
   La interpolación corre la moda hacia el vecino más frecuente. Procedimiento y
   ejemplo (TP1 ej. 4: $M\approx 167.79$ vs. $180$) en
   **[[tecnica-datos-agrupados-interpolacion]]**.

## Mediana vs. media: robustez
La **mediana es robusta** ante [[boxplot|outliers]]; la media no.

> [!figura] u1-balanza-media-contra-mediana
> La media es el punto donde se equilibran los brazos de palanca, de modo que un solo dato lejano la arrastra; la mediana solo cuenta cuántos datos quedan a cada lado y no se mueve.

> **Intuición.** La media *suma* el aporte de cada dato, así que un solo valor enorme
> arrastra el promedio entero; la mediana solo mira *qué dato queda en el medio*, sin
> importar cuán lejos esté el extremo. Por eso para sueldos o precios de viviendas
> (donde unos pocos valores gigantes inflan el promedio) se suele reportar la mediana.
- Alturas $\{150,160,170,180,190\}$: $\bar x = m = 170$. Si un dato se mide mal
  como $\{150,160,170,180,\mathbf{290}\}$: la mediana sigue $m=170$, pero
  $\bar x = 190$.
- Ingresos $\{1,1,2,100\}$: ingreso medio $\bar x = 104/4 = 26$ (US\$), pero el 50%
  gana menos de $m=1.5$. ¿Cuál describe mejor?

> ⚠️ **Discrepancia con el raw:** la teórica
> [[estadistica-descriptiva-general]] reporta para este mismo ejemplo
> $\bar x \approx 20.8$. Ese valor es un **error**: surge de dividir la suma $104$ por
> $n=5$ en lugar de $n=4$ ($104/5 = 20.8$). Con las **4** observaciones el promedio
> correcto es $104/4 = \mathbf{26}$.

> Versión poblacional de la media: la [[esperanza|esperanza $E[X]$]] de una
> [[variable-aleatoria]]. La media muestral $\bar x$ **estima** ese $E[X]$.

## Con datos agrupados
$$ \bar{x}_{Ag} = \frac{\sum_{i=1}^L x_i\, f_i}{n} $$
donde $x_i$ es la **marca de clase** y $f_i$ la frecuencia del intervalo $i$.
Detalle en [[datos-agrupados]].

## Ejercicio resuelto — peso de 100 recién nacidos (TP1 ej. 5)
*Fuente: [[tp1-estadistica-descriptiva]] ej. 5 (resuelto).*

**Enunciado.** Se pesan 100 recién nacidos; tabla de datos agrupados (marca en kg):

| Marca $x_i$ | 2.7 | 2.9 | 3.1 | 3.3 | 3.5 | 3.7 | 3.9 | 4.1 | 4.3 | 4.5 |
|---|---|---|---|---|---|---|---|---|---|---|
| Frec. $f_i$ | 2 | 3 | 14 | 10 | 15 | 18 | 16 | 14 | 4 | 4 |

**Media (agrupada).** Con $n=\sum f_i = 100$:
$$ \bar x = \frac{1}{n}\sum x_i f_i = \frac{364.60}{100} = 3.6460 \text{ kg}. $$

**Mediana (por interpolación).** Los datos se acumulan hasta los **extremos
derechos** de los intervalos: la marca $3.5$ es el intervalo $(3.4,3.6]$ y $3.7$ el
$(3.6,3.8]$. La acumulada hasta $3.6$ es $44$ y hasta $3.8$ es $62$; como
$n/2 = 50$ cae en $(3.6,3.8]$:
$$ m_e = 3.6 + \frac{50-44}{62-44}(3.8-3.6) = 3.6667 \text{ kg}. $$
(El desvío $s=0.4234$ está en [[medidas-de-dispersion]]; el detalle del método de
interpolación, en [[tecnica-datos-agrupados-interpolacion]].)
