---
titulo: "Video — Percentilos"
resumen: "Clase en video de Lucio Pantazis (unidad 1) sobre mediana, cuartiles, rango intercuartil y percentiles, calculados en vivo con R sobre los tiempos de viaje en subte, incluyendo el caso de paridad y la interpolación lineal."
tipo: fuente
formato: video
unidad: 1
url: "https://youtu.be/BtLaPHYljps"
duracion: "21:03"
docente: Lucio Pantazis
ingerido: 2026-09-03
---

# Video — Percentilos

**Qué es:** clase en video del Dr. Lucio Pantazis donde recorre en vivo, con
ejemplos numéricos en R, el cálculo de mediana, cuartiles y percentiles sobre
el mismo dataset "tiempos de viaje en subte" de la teórica.
**Cubre:** mediana y el caso de paridad, cuartiles, rango intercuartil y
percentiles (con interpolación lineal explícita).
**Guía asociada:** Guía 1.

## Recorrido de la clase

| Timestamp | Tema |
|---|---|
| [00:04] | Motivación: por qué buscar otro "centro" además de la media (sensibilidad a valores extremos) |
| [01:38] | Gráfico de los datos ordenados del subte ($n=61$) y la lógica de "dividir la fila a la mitad" |
| [03:54] | Cálculo en R: posición 31 de los datos ordenados coincide con `median(x)` = 39.22319 |
| [04:15] | Caso de paridad: con $n=60$ ninguna posición única deja la mitad exacta (posición 30 → 29/30; posición 31 → 30/29) |
| [05:21] | Se toma el promedio de las dos posiciones centrales; interpretación como interpolación sobre la recta que une ambos valores |
| [07:05] | Distintas metodologías: `quantile(xSnew, 0.5, type=1..5)` en R da 38.99079 o 39.36691 según el tipo |
| [08:51] | Visión conceptual de la mediana: (1) deja "por lo menos" 50% a cada lado, (2) interpolación entre los valores en disputa |
| [11:12] | Cuartiles: $q_1$ (25%), $q_2$ = mediana (50%), $q_3$ (75%) |
| [12:25] | Cálculo de $q_1$ = 36.98404 (promedio de las posiciones 15 y 16, sobre $n=60$) |
| [13:41] | Cálculo de $q_3$ = 43.02624 (promedio de las posiciones 45 y 46) |
| [13:42] | Rango intercuartil (IQR) como medida de dispersión del 50% central |
| [16:01] | Generalización a percentiles (y quintiles, deciles); intuición con percentiles de peso en pediatría |
| [17:36] | Percentil 10: caso simple, se acumulan exactamente 6 datos |
| [17:41] | Percentil 97: caso con interpolación lineal explícita (97% de 60 = 58.2 datos) |
| [20:19] | Cierre de percentiles; la clase continúa con boxplots (próximo tema) |

## Qué aporta sobre el apunte

La teoría de mediana, cuartiles y percentiles ya está en
[[cuartiles-y-percentiles]] y [[medidas-de-tendencia-central]], tomada del
mismo apunte ([[estadistica-descriptiva-general]]) que usa este video como
base de sus slides. Lo que aporta el video, puntualmente:

- **(a) Ejemplo resuelto paso a paso con números concretos** sobre el dataset
  real de tiempos de viaje en subte: valores exactos de $q_1$, $q_3$, mediana
  con $n$ par, percentil 10 y percentil 97, verificados contra la salida de R
  en cada paso (`quantile()`, `median()`). El apunte fuente no muestra estos
  cálculos numéricos completos con la interpolación explícita del percentil
  97 — ver sección de ejercicio resuelto abajo.
- **(b) Intuición del percentil como "dato grande o chico" relativo al grupo**,
  con la analogía pediátrica: decir que un bebé pesa 4 kg no dice nada por sí
  solo; ese mismo peso es un percentil alto al nacer y un percentil bajo a los
  6 meses, porque el percentil compara contra el resto del grupo de referencia
  (min. [16:13]–[16:52]).
- **(c) Advertencia explícita sobre la ambigüedad del cálculo** ([07:05]):
  el comando `quantile` de R tiene siete formas distintas (`type=1..7`) de
  calcular percentiles, y con el mismo conjunto de datos pueden dar resultados
  distintos — pero **coinciden siempre que los dos valores en disputa sean
  iguales**. El docente remarca que va a buscar ejemplos de parcial donde esto
  no genere ambigüedad.
- **(d) Énfasis:** insiste en la **interpolación lineal** como la forma
  general de resolver cualquier percentil que no caiga en una cantidad entera
  de datos a acumular (no solo el caso de paridad de la mediana), y advierte
  que "no tiene sentido" promediar dos datos cuando lo que hay que acumular es,
  por ejemplo, 58.2 datos: el resultado debe estar **más cerca** del dato 58
  que del 59, proporcionalmente al 0.2 (min. [18:16]–[20:03]). Esta fórmula
  general de interpolación entre estadísticos de orden **no estaba escrita de
  forma explícita** en [[cuartiles-y-percentiles]] antes de este video (que
  solo la menciona para [[datos-agrupados|datos agrupados]], vía
  [[tecnica-datos-agrupados-interpolacion]] — un caso distinto, porque ahí se
  interpola sobre frecuencias acumuladas de intervalos, no sobre estadísticos
  de orden individuales); se agregó la sección "Fórmula de interpolación
  lineal (criterio del video)" a [[cuartiles-y-percentiles]] a partir de este
  video, con **dos casos** ($h=p\cdot n$ entero → promedio de
  $\tilde x_h$ y $\tilde x_{h+1}$; $h$ no entero → interpolación lineal con
  $k=\lfloor h\rfloor$ y $f=h-k$), porque tratar el caso "$h$ entero" como el
  límite $f\to 0$ de la interpolación da solo $\tilde x_k$ y **no** reproduce
  el promedio que el propio video usa para $q_1$, $q_3$ y el percentil 10
  (ver ejercicio resuelto abajo).

## Ejercicio resuelto en clase

*Fuente: video, sobre el dataset "tiempos de viaje en subte" de
[[estadistica-descriptiva-general]]. Arranca en [03:54].*

**Enunciado.** Con los $n=61$ tiempos de viaje en subte (en minutos) ya
ordenados $\tilde x_1 \le \dots \le \tilde x_{61}$, calcular la mediana. Luego,
suponiendo un conjunto reducido de $n=60$ observaciones (mismos datos
ordenados, sin la última), calcular la mediana, el primer y tercer cuartil, el
percentil 10 y el percentil 97.

**Mediana con $n=61$ (min. [03:54]).**
Como $n$ es impar, hay una única posición central: $(n+1)/2 = 31$. Esa
posición deja exactamente 30 datos por debajo y 30 por encima:
$$ \text{mediana} = \tilde x_{31} = 39.22319. $$
Coincide con `median(x)` en R.

**Mediana con $n=60$ — caso de paridad (min. [04:15]–[07:01]).**
Con $n$ par no existe una posición única: la posición 30 deja 29 datos
por debajo y 30 por encima; la posición 31 deja 30 por debajo y 29 por
encima. Ninguna de las dos cumple exactamente "mitad y mitad". Se toma el
promedio de ambas posiciones en disputa:
$$ \text{mediana} = \frac{\tilde x_{30} + \tilde x_{31}}{2} = 39.36691. $$
(el docente no da los valores individuales de $\tilde x_{30}$ y $\tilde x_{31}$
por separado, solo el resultado del promedio, verificado con
`median(xSnew) = 39.36691`).

> ⚠️ Con `quantile(xSnew, 0.5, type=k)` en R, los siete tipos disponibles dan
> **38.99079** (type 1, 3, 4) o **39.36691** (type 2, 5) según el criterio de
> desempate — ilustrando que el cálculo es intrínsecamente ambiguo cuando hay
> "disputa" entre dos posiciones.

**Primer cuartil $q_1$ (min. [12:25]).**
El 25% de $n=60$ son exactamente $60 \cdot 0.25 = 15$ datos. Se acumulan 15
datos hasta la posición 15, y se toma el promedio con la posición 16 (mismo
criterio de "disputa" que en la mediana):
$$ q_1 = \frac{\tilde x_{15} + \tilde x_{16}}{2} = 36.98404. $$
Esto deja 15 datos a la izquierda y 45 a la derecha, tal como pide la
definición.

**Tercer cuartil $q_3$ (min. [13:41]).**
El 75% de 60 son $45$ datos:
$$ q_3 = \frac{\tilde x_{45} + \tilde x_{46}}{2} = 43.02624. $$
Deja 45 datos a la izquierda y 15 a la derecha.

**Rango intercuartil (min. [13:42]).**
$$ \text{IQR} = q_3 - q_1 = 43.02624 - 36.98404 = 6.0422 \text{ minutos}. $$
Es el rango donde se encuentra el 50% central de los tiempos de viaje.

**Percentil 10 (min. [17:36]).**
El 10% de $n=60$ son exactamente $6$ datos. Se promedian las posiciones 6 y 7:
$$ p_{10} = \frac{\tilde x_6 + \tilde x_7}{2}, $$
dejando 6 datos a la izquierda y 54 a la derecha.

**Percentil 97 — interpolación lineal explícita (min. [17:41]–[20:03]).**
El 97% de $n=60$ **no** es un entero: $60 \cdot 0.97 = 58.2$ datos. No se
puede "acumular 58.2 datos", así que el resultado debe quedar **entre** el
dato 58 y el dato 59, pero más cerca del 58 (porque $0.2$ está más cerca de
$0$ que de $1$). El docente arma la recta que une $\tilde x_{58}$ con
$\tilde x_{59}$ y evalúa en la fracción $0.2$:
$$ p_{97} = \tilde x_{58} + 0.2\,(\tilde x_{59} - \tilde x_{58}). $$
Interpretación: hasta el dato 58 ya se acumularon 58 datos; faltan acumular
"0.2 datos" más, y eso se traduce en avanzar un $20\%$ del incremento entre
$\tilde x_{58}$ y $\tilde x_{59}$ sobre la recta que los une (esta es la misma
lógica de interpolación lineal que ya se usó, de forma menos explícita, para
la mediana y los cuartiles con paridad).

## Advertencias del docente

- **[07:05]** El cálculo de percentiles no tiene un criterio unificado: R
  ofrece siete formas distintas (`quantile(..., type=1..7)`) y **dan
  resultados distintos** con el mismo conjunto de datos. El docente aclara
  que para ejercicios de evaluación va a preferir casos donde los dos valores
  en disputa **coincidan**, de modo que no haya ambigüedad entre métodos.
- **[09:44]** Remarca la definición conceptual robusta: un valor es "mediana
  válida" si deja **por lo menos** 50% de los datos a cada lado (contando el
  propio valor de ambos lados si hace falta) — este criterio es el que se
  extiende luego a cuartiles y percentiles en general.
- **[18:01]** Insiste en que la interpolación lineal (y no, por ejemplo,
  redondear o promediar sin ponderar) es la forma correcta de resolver
  percentiles que no caen en una cantidad entera de datos, porque el
  resultado debe quedar proporcionalmente más cerca del estadístico de orden
  que más se acerca a la fracción pedida.

## Páginas del wiki que toca

- [[cuartiles-y-percentiles]]
- [[medidas-de-tendencia-central]]
- [[medidas-de-dispersion]]
- [[boxplot]]
- [[tecnica-datos-agrupados-interpolacion]]
- [[estadistica-descriptiva]]
