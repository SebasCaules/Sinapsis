---
titulo: "Video — Datos Agrupados"
resumen: "Clase en video de Lucio Pantazis (unidad 1) sobre medidas de resumen con datos agrupados: marca de clase, media y desvío ponderados por la frecuencia, y mediana, cuartiles y percentiles por interpolación, con una tabla numérica completa."
tipo: fuente
formato: video
unidad: 1
url: "https://youtu.be/iraYNo3prvo"
duracion: "19:59"
docente: Lucio Pantazis
ingerido: 2026-09-03
---

# Video — Datos Agrupados

**Qué es:** clase grabada del Dr. Lucio Pantazis, proyectando y narrando las
diapositivas de "Medidas de resumen (Datos agrupados)" de la teórica
[[estadistica-descriptiva-general]], con un ejemplo numérico completo (tiempos de
tardanza en subte).
**Cubre:** media, desvío, asimetría y curtosis con [[datos-agrupados|datos agrupados]];
mediana, cuartiles y percentiles por [[tecnica-datos-agrupados-interpolacion|interpolación]].
**Guía asociada:** Guía 1.

## Recorrido de la clase

| Timestamp | Tema |
|---|---|
| [00:00] | Motivación: por qué a veces los datos ya vienen agrupados en rangos (ejemplo: tardanza en el subte) |
| [01:54] | Interpretación de la tabla de frecuencias: qué significa $f_i$ en cada intervalo $[L_i, L_{s,i})$ |
| [03:26] | Media con datos agrupados: el problema de elegir un "representante" del intervalo → marca de clase $x_i$ |
| [05:10] | Fórmula de la media agrupada ponderando por $f_i$; resultado numérico $\bar x_{Ag}=39{,}93$ vs. $\bar x=40{,}02$ sin agrupar (la diapositiva escribe $n=61$ en el denominador por error — ver ⚠️ discrepancia más abajo) |
| [07:58] | Desvío estándar agrupado: misma lógica, ponderando por $f_i$; $s_{Ag}=4{,}41$ vs. $s=4{,}31$ sin agrupar |
| [10:08] | Generalización: el mismo paralelismo (agregar $f_i$ a la suma) aplica también a simetría y curtosis |
| [11:29] | Mediana y percentiles: aparece la frecuencia acumulada $F_i$; la lógica ya no es "sumar" sino "acumular" |
| [11:53] | Cálculo directo de la mediana ($F_i=30$ cae justo en un límite → mediana $=39$) y del primer cuartil ($F_i=15$ → $q_1=37$) |
| [14:09] | Percentil 15: no cae en ningún límite exacto de la tabla, hace falta interpolar dentro del intervalo $(35,37)$ |
| [15:19] | Interpolación gráfica: dividir el intervalo en tantos subintervalos como datos tiene ($f_i=7$) |
| [16:29] | Fórmula general del percentil con datos agrupados; resultado $p15_{Ag}=35{,}29$ vs. $35{,}73$ real |
| [18:07] | Ejercicio propuesto en la slide: calcular el percentil 30 |
| [19:16] | Resolución verbal (sin slide dedicada) del percentil 30: $p30_{Ag}=37{,}4$ |

## Qué aporta sobre el apunte

- **(a) Ejemplo resuelto completo con narración paso a paso.** El apunte
  [[estadistica-descriptiva-general]] usa el mismo escenario ("tiempos de viaje en
  subte") y, en su sección de datos **sin agrupar**, un dataset de 61 observaciones
  cuya media ($\bar x = 40{,}02$) es muy cercana a la que este video cita como "sin
  agrupar" ($40{,}01801$; en la clase lo menciona como $40{,}01$ en [07:22]) — es razonable que
  comparta el mismo origen. **Pero la tabla agrupada no es la misma tabla**: releído
  el PDF crudo (`raw/02-estadistica-descriptiva/02 - Estadística Descriptiva -
  General.pdf`), el ejemplo de "datos agrupados" del apunte usa 9 intervalos de
  ancho 3 (de 27 a 54, $n=60$, $\bar x_{Ag}=39{,}95$), mientras que este video arma
  su propia tabla con 11 intervalos de ancho 2 (de 29 a 51, $n=60$,
  $\bar x_{Ag}=39{,}93$) — dos agrupamientos distintos del mismo tipo de dataset, no
  el mismo ejemplo reproducido. El video reconstruye en vivo, con el "por qué" de
  cada paso, el cálculo de la media, el desvío y (sobre todo) el percentil 15 sobre
  **su propia** tabla — ver la sección "Ejercicio resuelto en clase" abajo, con
  números distintos a los que ya están en [[tecnica-datos-agrupados-interpolacion]].
- **(b) Intuición del porqué se pondera por frecuencia.** El docente insiste en que
  la tentación inicial es promediar solo las marcas de clase (eso da el centro del
  *rango* de valores, no de los *datos*), y que multiplicar cada marca por su $f_i$
  es lo que hace que los rangos más frecuentes aporten más a la suma — la
  misma idea que ya resume el callout de intuición de [[datos-agrupados]], pero aquí
  aparece motivada con el contraste explícito entre las dos cuentas (min 03:29–07:59).
- **(c) Advertencia conceptual: percentiles no son "paralelos" a media/desvío.**
  El docente marca explícitamente (11:38–11:50) que, a diferencia de media, desvío,
  simetría y curtosis (que solo agregan $f_i$ a la fórmula sin agrupar), el cálculo
  de percentiles usa una lógica **distinta** (acumulación, no suma) — "no tengo este
  paralelismo para los percentilos". Es un punto de posible confusión en el parcial.
- **(d) Énfasis: dividir por $n$ (total de datos), no por $L$ (cantidad de
  intervalos).** Remarca (06:16–06:22) que si se divide por la cantidad de
  intervalos en vez de por el total de datos "estoy haciendo otro promedio" — un
  error frecuente al armar la fórmula de la media agrupada.

## Ejercicio resuelto en clase

*Arranca en [13:47] (planteo del cuartil/percentil) y se resuelve en [15:19]–[16:29].*
Fuente de los datos: tabla de tardanzas del subte, agrupada en 11 intervalos de
ancho 2 minutos, $n=60$ datos.

**Tabla de frecuencias (según se muestra en las diapositivas):**

| $L_i$ | $L_{s,i}$ | $f_i$ | $F_i$ (acumulada) |
|---|---|---|---|
| 29 | 31 | 1 | 1 |
| 31 | 33 | 1 | 2 |
| 33 | 35 | 6 | 8 |
| 35 | 37 | 7 | 15 |
| 37 | 39 | 15 | 30 |
| 39 | 41 | 5 | 35 |
| 41 | 43 | 10 | 45 |
| 43 | 45 | 6 | 51 |
| 45 | 47 | 6 | 57 |
| 47 | 49 | 1 | 58 |
| 49 | 51 | 2 | 60 |

> ⚠️ Discrepancia (dentro de la propia diapositiva del docente, no de la
> transcripción): en la diapositiva "Media con datos agrupados" [05:10] (frame
> verificado), la fórmula $\bar x_{Ag}=\frac{\sum x_i f_i}{n}$ se muestra con
> **$n=61$** en el denominador, pero la tabla de esa misma diapositiva tiene
> $f_i$ que suman $1+1+6+7+15+5+10+6+6+1+2=60$, y el numerador que exhibe la
> diapositiva es $2396$. $2396/60=39{,}93$ coincide con el resultado que muestra
> la diapositiva; $2396/61=39{,}28$ no. Es decir, la diapositiva tiene un
> **error de tipeo en el denominador** (probablemente arrastrado del $n=61$ del
> dataset sin agrupar original citado más arriba en la clase), y el resultado
> numérico que da ($39{,}93$) es el correcto para $n=60$. El resto del ejercicio
> (mediana, cuartiles, percentiles, que se calculan con la frecuencia acumulada
> $F_i$ hasta $60$, ver diapositiva de [11:53]) usa consistentemente $n=60$, que
> es el valor que se usa en todos los cálculos de esta página.

**Enunciado.** Con esta tabla, calcular la mediana, el primer cuartil y el
percentil 15 de los tiempos de tardanza.

**Planteo — mediana.** Se busca acumular el 50% de los 60 datos, es decir, 30
datos. Mirando la columna $F_i$, ese valor se acumula **exactamente** al llegar a
39 (fila $37$–$39$, $F_i=30$). Como el valor buscado cae justo en el límite
superior de un intervalo, no hace falta interpolar:
$$ \text{mediana} = 39 \text{ minutos}. $$
(Compárese con el valor real sin agrupar, $39{,}37$: similar.)

**Planteo — primer cuartil.** Acumular el 25% de 60 = 15 datos. De nuevo cae
exacto: $F_i=15$ en el límite superior del intervalo $35$–$37$, así que
$$ q_1 = 37 \text{ minutos}. $$

**Planteo — percentil 15.** Acumular el 15% de 60 = 9 datos. Aquí **no** hay
ningún límite con $F_i=9$: se sabe que hasta 35 se acumularon 8 datos y hasta 37
se acumularon 15. El valor buscado está entre 35 y 37, y como faltan pocos datos
para acumular (9 $-$ 8 $=$ 1 de los 7 que hay en ese intervalo), debe quedar
**más cerca de 35 que de 37**.

**Cálculo.** Se asume que los $f_i=7$ datos del intervalo $(35,37)$ se reparten
uniformemente, dividiendo el intervalo en 7 subintervalos iguales. Faltan
acumular $9-8=1$ dato de esos 7, así que se avanza $1/7$ del ancho del intervalo
desde el límite inferior:
$$ p15_{Ag} = L_i + \frac{\frac{15}{100}\cdot n - F_{i-1}}{f_i}\,(L_{s,i}-L_i)
= 35 + \frac{9-8}{7}\cdot 2 = 35{,}29 \text{ minutos}. $$

**Resultado.** $p15_{Ag} = 35{,}29$, similar al valor real sin agrupar,
$35{,}73$ (comparación mostrada en la diapositiva de cierre, [16:29]).

> Esta fórmula es la misma que la de
> [[tecnica-datos-agrupados-interpolacion#Cuartil / mediana por interpolación|interpolación para cuartiles/mediana]]
> del wiki, aplicada aquí a un percentil genérico (15%) en lugar de a un cuartil (25/50/75%).

**Ejercicio propuesto y resuelto al cierre — percentil 30.** El docente lo deja
como ejercicio para el estudiante ([18:07]) y lo resuelve verbalmente al final de
la clase ([19:16], sin diapositiva dedicada): acumular el 30% de 60 = 18 datos.
Hasta 37 se acumulan 15 y hasta 39 se acumulan 30 ($f_i=15$ en ese intervalo), así
que faltan $18-15=3$ datos de los 15:
$$ p30_{Ag} = 37 + \frac{18-15}{15}\cdot 2 = 37{,}4 \text{ minutos}. $$

## Advertencias del docente

- [06:16] Al calcular la media agrupada, dividir siempre por $n$ (el total de
  datos), **no** por $L$ (la cantidad de intervalos) — si no, "estoy haciendo otro
  promedio" (del centro del rango, no de los datos).
- [11:38] Los percentiles con datos agrupados **no** siguen el mismo paralelismo
  que media/desvío/simetría/curtosis (esas solo agregan $f_i$ a la fórmula sin
  agrupar): usan una lógica de frecuencia **acumulada**, distinta de una suma
  ponderada.
- [19:48] Remarca, al cerrar la clase, que la fórmula general de percentiles agrupados "es la cuenta
  más criteriosa que podemos hacer, aun con la pérdida de información" — es decir,
  aunque no reproduce el dato exacto, es la mejor aproximación disponible y es el
  procedimiento esperado en el parcial.

## Páginas del wiki que toca

- [[datos-agrupados]]
- [[tecnica-datos-agrupados-interpolacion]]
- [[cuartiles-y-percentiles]]
- [[medidas-de-tendencia-central]]
- [[medidas-de-dispersion]]
- [[asimetria-y-curtosis]]
- [[histograma-y-frecuencias]]
- [[estadistica-descriptiva]]
