---
titulo: Datos agrupados
resumen: 'Cuando solo se dispone de una tabla de frecuencias por intervalos, las medidas de resumen se aproximan usando la marca de clase $x_i=(L_i+L_{s,i})/2$ como representante; la mediana y los cuartiles exigen además interpolar dentro del intervalo.'
tipo: concepto
unidad: 1
orden: 9
tags: [estadistica-descriptiva, datos-agrupados, frecuencias]
fuentes: ["[[estadistica-descriptiva-general]]", "[[tp1-estadistica-descriptiva]]", "[[video-histogramas]]", "[[video-datos-agrupados]]"]
actualizado: 2026-09-04
---

# Datos agrupados

**En breve.** Cuando solo se tiene una **tabla de frecuencias** por intervalos (no los
datos uno por uno), todas las [[estadistica-descriptiva|medidas de resumen]] se
**aproximan** usando la marca de clase como representante de cada intervalo; mediana y
cuartiles requieren además [[tecnica-datos-agrupados-interpolacion|interpolación]].

A veces los datos **no** vienen individualizados, sino resumidos en una **tabla de
frecuencias** por intervalos $[L_i, L_{s,i})$. Se sabe cuántos datos cayeron en
cada rango ($f_i$) pero **se perdió** el valor exacto de cada observación → todos
los cálculos son **aproximaciones**.

La clave es la **marca de clase** $x_i = \dfrac{L_i + L_{s,i}}{2}$ (punto medio del
intervalo), que actúa como representante del intervalo.

> **Intuición.** Como no se sabe dónde cayó cada dato dentro de su intervalo, se hace la
> apuesta más neutral: se supone que todos están justo en el medio (la marca de clase)
> y que se reparten **uniformemente** dentro del intervalo. Por eso los resultados son
> aproximados: cuanto más anchos los intervalos, más información se perdió y mayor el
> error respecto del cálculo con los datos crudos.

## Medidas con datos agrupados
Las fórmulas son las de [[medidas-de-tendencia-central|datos sin agrupar]] pero
incorporando la frecuencia $f_i$ (con $n=\sum f_i$, $L$ = número de intervalos):

| Medida | Sin agrupar | Agrupada |
|---|---|---|
| Media | $\bar x = \frac{\sum x_i}{n}$ | $\bar x_{Ag} = \frac{\sum_{i=1}^L x_i f_i}{n}$ |
| Desvío | $s=\sqrt{\frac{\sum(x_i-\bar x)^2}{n-1}}$ | $s_{Ag}=\sqrt{\frac{\sum(x_i-\bar x_{Ag})^2 f_i}{n-1}}$ |
| Asimetría | $\gamma=\frac{\sum(x_i-\bar x)^3}{n s^3}$ | $\gamma_{Ag}=\frac{\sum(x_i-\bar x_{Ag})^3 f_i}{n s_{Ag}^3}$ |
| Curtosis | $\kappa=\frac{\sum(x_i-\bar x)^4}{n s^4}-3$ | $\kappa_{Ag}=\frac{\sum(x_i-\bar x_{Ag})^4 f_i}{n s_{Ag}^4}-3$ |

(Marca de clase $x_i$ en lugar de cada dato.) Ver [[medidas-de-dispersion]] y
[[asimetria-y-curtosis]].

## Moda con datos agrupados
La moda se asigna al **intervalo modal** (el de mayor frecuencia). Dos convenciones:
el **punto medio** del intervalo modal, o la **interpolación** según las frecuencias
vecinas $f_I, f_D$ (corre la moda hacia el vecino más frecuente). Fórmula en
**[[tecnica-datos-agrupados-interpolacion]]** y en [[medidas-de-tendencia-central]].
Ojo con confundir el intervalo modal con "donde está la media" — ver la advertencia
de [[video-histogramas]] en [[medidas-de-tendencia-central]].

## Mediana y cuartiles: interpolación
Estos **no** se basan en sumas sino en la **frecuencia acumulada** $F_i$
(cuántos datos hay con valor $\le L_{s,i}$). Se localiza el intervalo que acumula
la fracción buscada y se **interpola linealmente** dentro de él. Procedimiento y
fórmulas en **[[tecnica-datos-agrupados-interpolacion]]**.

> [!figura] u1-los-f-i-subintervalos-del-reparto
> De dónde sale la fórmula: el intervalo se parte en $f_i$ subintervalos iguales, uno por dato, y el cuartil cae donde termina el subintervalo del dato buscado. En el dibujo, los $f_i = 18$ datos del intervalo $[36, 39)$ se reparten parejo en 18 subintervalos iguales, y por eso cada tabique adelanta el acumulado en una unidad. El supuesto de reparto uniforme es lo que vuelve **aproximado** el resultado.

Ejemplo (Ej 5 de la guía, $n=100$): mediana en el intervalo $[3.6,3.8)$ con
$F_{\text{ant}}=44$, $F=62$:
$$ \text{mediana} = \frac{50 - 44}{62 - 44}\,(3.8 - 3.6) + 3.6 = 3.6667. $$

> Los resultados agrupados son **similares pero no idénticos** a los de datos sin
> agrupar (se paga un costo de precisión por haber perdido información).

> **Advertencia (docente, en [[video-datos-agrupados]]).** Media, desvío, simetría y
> curtosis agrupados son "paralelos" a sus versiones sin agrupar: la única
> diferencia es agregar $f_i$ a la suma. Los **percentiles no** — su cálculo se basa
> en acumular ($F_i$), no en sumar, así que no hay ese mismo paralelismo. Es un
> punto de confusión típico.

## Ejercicio resuelto
- [[tecnica-datos-agrupados-interpolacion#Ejercicio resuelto — 1000 llamadas (TP1 ej. 4)|TP1 ej. 4]]
  — 1000 llamadas: media, desvío, **moda por interpolación**, mediana y proporciones.
- [[medidas-de-tendencia-central#Ejercicio resuelto — peso de 100 recién nacidos (TP1 ej. 5)|TP1 ej. 5]]
  — 100 recién nacidos: media $3.6460$, desvío $0.4234$, mediana $3.6667$ por interpolación.
- [[video-datos-agrupados#Ejercicio resuelto en clase|Clase grabada (Pantazis)]] —
  tardanzas en el subte ($n=60$, 11 intervalos): media, desvío, mediana, $q_1$ y
  percentil 15 narrados paso a paso, con una discrepancia de $n$ detectada en la
  propia diapositiva de la media.

## Uso en inferencia
La media y el desvío calculados sobre datos agrupados (por marca de clase)
alimentan directamente un **intervalo de confianza para la media**: ver el ejercicio
resuelto 4 de [[intervalos-de-confianza]] (TP8 ej. 13, IC de la media con datos
agrupados a partir de la media y el desvío por marca de clase).
