---
titulo: Cuartiles y percentiles
resumen: 'Medidas de posición que parten la muestra ordenada en cuatro tramos de igual cantidad de datos ($q_1$, mediana, $q_3$); son la base del boxplot y del rango intercuartil. Los percentiles se obtienen interpolando con $h=p\,n$.'
tipo: concepto
unidad: 1
orden: 6
tags: [estadistica-descriptiva, cuartiles, percentiles]
fuentes: ["[[estadistica-descriptiva-general]]", "[[tp1-estadistica-descriptiva]]", "[[video-percentilos]]"]
actualizado: 2026-09-03
---

# Cuartiles y percentiles

**En breve.** Los **cuartiles** parten la muestra ordenada en cuatro tramos de igual
cantidad de datos (deciles en 10, percentiles en 100); son la base del
[[boxplot|boxplot]] y del [[medidas-de-dispersion|IQR]], y describen *posición*
relativa sin verse afectados por valores extremos.

Así como la [[medidas-de-tendencia-central|mediana]] divide a los datos a la
mitad, los **cuartiles** los dividen en cuatro partes. Sea
$\tilde x_1 \le \tilde x_2 \le \dots \le \tilde x_n$ la muestra **ordenada**:

- $q_1$ (**primer cuartil**): deja el **25%** de los datos a su izquierda.
- $q_2$ (**segundo cuartil**): es la **[[medidas-de-tendencia-central|mediana]]**
  (50% a cada lado).
- $q_3$ (**tercer cuartil**): deja el **75%** a su izquierda.

## Definición formal
El $j$-ésimo cuartil es un $q_j \in [\tilde x_k,\, \tilde x_{k+1}]$ tal que
$$ \frac{k}{n} \le j\cdot 0.25 < \frac{k+1}{n}. $$
Cuando no se acumula **exactamente** la cantidad de datos requerida, se toma un
compromiso (p. ej. el promedio de dos observaciones contiguas). Hay ambigüedad:
distintos software/libros usan definiciones ligeramente distintas (en R, el
argumento `type` de `quantile`), pero las diferencias son insignificantes para
muestras grandes.

## Deciles y percentiles
Análogamente, los **deciles** parten la muestra en 10 y los **percentiles** en
100 partes.

### Fórmula de interpolación lineal (criterio del video)
Según [[video-percentilos]], el criterio de "compromiso" mencionado arriba se
puede escribir de forma explícita para un percentil $p \in (0,1)$, y no solo
para la mediana con $n$ par. Es **una convención entre varias posibles** (ver la
discrepancia al final de la sección), no *la* definición. Sobre la muestra
ordenada $\tilde x_1 \le \dots \le \tilde x_n$, sea
$$ h = p \cdot n. $$

- **Si $h$ es entero** (se acumula una cantidad exacta de datos, como en el
  caso de paridad de la mediana): hay dos posiciones en disputa y se **promedian**:
  $$ \text{percentil}_p = \frac{\tilde x_h + \tilde x_{h+1}}{2}. $$
- **Si $h$ no es entero**: sea $k = \lfloor h \rfloor$ y $f = h - k$ la parte
  fraccionaria; el percentil se interpola linealmente entre $\tilde x_k$ y
  $\tilde x_{k+1}$, proporcionalmente a $f$:
  $$ \text{percentil}_p = \tilde x_k + f\,(\tilde x_{k+1} - \tilde x_k). $$

> ⚠️ El caso "$h$ entero" **no** es el límite $f \to 0$ del segundo caso: da un
> **promedio** de dos estadísticos de orden, no un salto directo a
> $\tilde x_k$. Por eso se lo trata aparte. Ejemplos verificados en
> [[video-percentilos]]: $q_1$ con $n=60$ tiene $h = 60\cdot 0.25 = 15$
> (entero) → $q_1 = (\tilde x_{15}+\tilde x_{16})/2$; el percentil 97 tiene
> $h = 60\cdot 0.97 = 58.2$ (no entero) → $k=58$, $f=0.2$ →
> $p_{97} = \tilde x_{58} + 0.2\,(\tilde x_{59}-\tilde x_{58})$.

> ⚠️ **Discrepancia — alcance de la fórmula.** El criterio de arriba reproduce
> todos los ejemplos numéricos que el video calcula con $n=60$ ($q_1$, $q_3$,
> mediana, percentil 10 y percentil 97), pero **no** es un criterio único válido
> para todo $p$ y todo $n$. El choque concreto es la **mediana con $n$ impar**:
> con $p=0.5$ y $n=61$ resulta $h=30.5$ (no entero), y la rama de interpolación
> daría $(\tilde x_{30}+\tilde x_{31})/2$; en cambio, la definición de mediana de
> [[medidas-de-tendencia-central]] — y el propio video en ese mismo ejemplo —
> dan la observación central $\tilde x_{(n+1)/2} = \tilde x_{31} = 39.22319$.
>
> **Prevalece la definición de mediana.** Para $p = 0.5$: si $n$ es impar, la
> mediana es $\tilde x_{(n+1)/2}$; si $n$ es par, el promedio de las dos
> centrales (que sí coincide con la rama "$h$ entero"). La rama de interpolación
> se usa para percentiles con $h$ no entero **fuera** del caso $p=0.5$ con $n$
> impar. Esto no es un error de una fuente ni de la otra: es la ambigüedad que
> el propio docente advierte ([[video-percentilos]], [07:05]), donde
> `quantile(..., type=1..7)` en R da resultados distintos sobre los mismos datos.

> **Intuición.** Decir "estoy en el percentil 90 de altura" significa que el 90% de la
> gente mide menos que usted. El percentil traduce un valor crudo a una **posición
> relativa** dentro del grupo, que es justo lo que hacen los puntajes estandarizados
> de exámenes o las curvas de crecimiento del pediatra.

## Usos
- El **IQR** $= q_3 - q_1$ es una [[medidas-de-dispersion|medida de dispersión]]
  robusta.
- Definen la caja y los outliers del [[boxplot]].
- Con [[datos-agrupados]] se calculan por **interpolación lineal** sobre las
  frecuencias acumuladas → ver [[tecnica-datos-agrupados-interpolacion]].
