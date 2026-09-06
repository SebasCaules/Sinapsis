---
titulo: Histograma y frecuencias
resumen: 'Reparte los datos en intervalos y grafica sus frecuencias $n_k$ y $f_k=n_k/n$; es la versión muestral de una densidad. La acumulada $F(\alpha)$ permite leer mediana, cuartiles y proporciones sin depender del ancho de intervalo.'
tipo: concepto
unidad: 1
orden: 7
tags: [estadistica-descriptiva, histograma, frecuencias]
fuentes: ["[[estadistica-descriptiva-general]]", "[[tp1-estadistica-descriptiva]]", "[[estadistica-descriptiva-introduccion]]", "[[video-histogramas]]"]
actualizado: 2026-09-04
---

# Histograma y frecuencias

**En breve.** El **histograma** muestra cómo se reparten los datos contando cuántos
caen en cada intervalo (*bin*); es la versión muestral de una densidad, y su variante
acumulada $F(\alpha)$ es la contraparte muestral de la
[[funcion-de-distribucion-acumulada|función de distribución acumulada (FDA)]].

> **Vistazo exploratorio previo.** Antes de resumir, conviene mirar los datos
> crudos. Las slides ([[estadistica-descriptiva-introduccion]], slide 3) sugieren
> dos gráficos iniciales: el **scatterplot muestra-vs-caso** (cada dato contra su
> número de observación) y la **dispersión de los datos sobre una recta**. Son un
> paso cualitativo para detectar tendencias, agrupamientos o valores atípicos antes
> de construir el histograma.

Para visualizar la distribución de una muestra se divide el rango de valores en
**intervalos** (llamados *bins*) $a_1 < a_2 < \dots < a_{N+1}$, con
$a_1 < \min_i x_i$ y $a_{N+1} \ge \max_i x_i$. Habitualmente son de **igual
longitud**.

## Frecuencias
- **Frecuencia absoluta** $n_k$: cantidad de datos en el $k$-ésimo intervalo,
  $$ n_k = |\{x_i : x_i \in (a_k, a_{k+1}]\}|. $$
- **Frecuencia relativa** $f_k = \dfrac{n_k}{n}$.
- Se cumplen: $\displaystyle\sum_{k=1}^N n_k = n$ y $\displaystyle\sum_{k=1}^N f_k = 1$.

El **histograma** es el gráfico de barras de $n_k$ (o $f_k$). El **polígono de
frecuencias** une los puntos medios de las barras.

> [!figura] u1-el-ancho-de-bin-cambia-la-historia
> El mismo conjunto de datos con distinta cantidad de intervalos: con pocos aparece una sola joroba y con muchos queda ruido. La acumulada de abajo no cambia, y es por eso que los cuartiles se leen sobre ella.

> **Por qué las barras van pegadas.** [[video-histogramas]] construye este mismo
> razonamiento primero para una variable **discreta** (gráfico de frecuencias con
> una barra separada por cada valor posible) y solo después lo extiende a una
> **continua**, mostrando que el gráfico discreto deja de servir porque los datos
> casi nunca se repiten exactamente — de ahí la necesidad de agrupar en intervalos.
> A diferencia del gráfico discreto, en el histograma las barras son **contiguas**:
> un intervalo con frecuencia $0$ no significa "valor imposible", sino un tramo
> poco frecuente dentro de un continuo sin huecos.

## Función de frecuencia relativa acumulada
$$ F(\alpha) = \frac{|\{x_i : x_i \le \alpha\}|}{n} \in [0,1]. $$
Es una función creciente (una "escalera"); su polígono se usa para
[[tecnica-datos-agrupados-interpolacion|interpolar]] mediana, cuartiles y
proporciones. Es la contraparte muestral de la
[[funcion-de-distribucion-acumulada|función de distribución acumulada]] de una
[[variable-aleatoria]].

> **Intuición.** Elegir el ancho de los *bins* es un arte: muy anchos esconden la
> forma (todo en una barra), muy finos la vuelven ruido (una barra por dato). La FDA
> acumulada esquiva ese problema porque no depende de cómo se agrupe — por eso se la usa
> para leer cuartiles y proporciones con precisión. Como punto de partida concreto,
> [[video-histogramas]] sugiere probar **entre 15 y 20 intervalos** y ajustar desde
> ahí mirando si el gráfico resulta informativo — no hay una fórmula cerrada, "hay
> que mirar cada conjunto de datos".

## Relación
- Cuando solo se dispone de la tabla de frecuencias (no los datos individuales)
  se trabaja con [[datos-agrupados]].
- La [[medidas-de-tendencia-central|moda]] de datos continuos sale del intervalo
  de mayor frecuencia.
