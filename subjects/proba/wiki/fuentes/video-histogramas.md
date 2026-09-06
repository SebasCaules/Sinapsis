---
titulo: "Video — Histogramas"
resumen: "Clase en video de Lucio Pantazis (unidad 1) que construye el histograma pasando de una variable discreta a una continua, discute cómo elegir la cantidad de intervalos y enseña a leer la asimetría y el peso de las colas en el gráfico."
tipo: fuente
formato: video
unidad: 1
url: "https://youtu.be/ZfFUYXlJ8KU"
duracion: "12:00"
docente: Lucio Pantazis
ingerido: 2026-09-03
---

# Video — Histogramas

**Qué es:** clase grabada de Lucio Pantazis sobre cómo construir e interpretar un histograma, motivándolo primero desde una variable discreta y extendiéndolo después a una variable continua.
**Cubre:** gráfico de frecuencias para datos discretos, construcción del histograma para datos continuos, elección de la cantidad de intervalos, y lectura de asimetría y peso de colas en un histograma.
**Guía asociada:** Guía 1.

## Recorrido de la clase

| Timestamp | Tema |
|---|---|
| [00:00] | Título: "Histogramas" |
| [00:30] | Variable discreta: cantidad de veces que una persona llega tarde por semana (datos en subte/tren/colectivo), min $=0$, max $=4$ pero el máximo se repite una sola vez |
| [02:01] | Gráfico valor vs. constante con datos discretos: los puntos se superponen y no deja ver qué valor es más frecuente |
| [02:30] | Gráfico de frecuencias "apilando" en el eje $y$ cada dato repetido: ahora sí se distingue que $1$ tardanza es el valor más común |
| [03:18] | Extiende el mismo problema a una variable continua: duración de viajes en tren; el gráfico valor vs. constante ya no sirve porque casi ningún dato se repite exactamente |
| [04:16] | Divide el rango en intervalos de 2 minutos y cuenta cuántos datos caen en cada uno (frecuencia por intervalos) |
| [05:48] | Arma el histograma con 11 intervalos; el intervalo modal es $[37,39)$ pero **no contiene a la media** ($\bar x = 40$) |
| [07:41] | Prueba con pocos intervalos (3): el gráfico deja de ser informativo, todo se concentra en una sola barra |
| [08:57] | Vuelve al histograma de 11 intervalos como referencia de comparación |
| [09:25] | Prueba con muchos intervalos (100, más que los 61 datos disponibles): aparecen intervalos con frecuencia 0 que no significan valores infrecuentes |
| [10:36] | Da el rango orientativo para elegir la cantidad de intervalos: "en general se prueban como entre 15 y 20" |
| [10:54] | Título de slide "Asimetrías"; histograma de duración de viajes en **taxi** (la palabra "taxi" se pronuncia solo en [11:02]) — cola hacia valores altos |
| [11:14] | Cambia al histograma de duración de viajes en **tren** — cola hacia valores bajos |
| [11:20] | Título de slide "Colas livianas"; histograma de viajes en **bicicleta**, sin valores atípicos marcados. La palabra "bicicleta" solo aparece **escrita en la slide**: en el audio nunca se pronuncia (se dice "colas livianas" en [11:21]) |
| [11:29] | Título de slide "Colas Pesadas"; histograma de viajes en **moto**, con valores atípicos claramente separados del resto. Igual que "bicicleta", la palabra "moto" solo aparece **escrita en la slide**, nunca se pronuncia en el audio |
| [11:56] | Cierre: anuncia que queda un último video de la unidad |

## Qué aporta sobre el apunte

- **(a) Ejemplo resuelto nuevo.** Ningún apunte ya ingerido usa este dataset: tardanzas
  semanales (variable discreta, subte/tren/colectivo) y duraciones de viaje en tren/taxi/
  bicicleta/moto (variable continua). Es un ejemplo distinto del de las 200 monedas de
  [[estadistica-descriptiva-introduccion]] y de las llamadas/recién nacidos de
  [[tp1-estadistica-descriptiva]] — sirve como tercer caso de estudio para practicar.
- **(a) Puente discreto → continuo.** El apunte ([[estadistica-descriptiva-general]],
  [[histograma-y-frecuencias]]) presenta el histograma directamente para datos continuos;
  el video arma el mismo razonamiento primero para una variable **discreta** (gráfico de
  frecuencias apilando puntos en el eje $y$) y después muestra por qué ese gráfico deja
  de funcionar al pasar a **continua** (los datos ya no se repiten exactamente), lo cual
  motiva por qué hace falta agrupar en intervalos. Esta progresión no está en el apunte.
- **(b) Intuición: por qué las barras del histograma van pegadas.** A diferencia del
  gráfico de frecuencias discreto (barras separadas, una por cada valor posible), en el
  histograma las barras son **contiguas** porque representan un valor continuo: un
  intervalo con frecuencia 0 no significa "valor imposible" sino "tramo poco frecuente
  dentro de un continuo", así que conceptualmente el eje no tiene huecos.
- **(b) Heurística práctica para elegir la cantidad de intervalos.** El docente evita dar
  una fórmula cerrada: menciona que existen reglas para elegirla pero dice que no le gustan
  nada, porque son una excusa para no pensar y en la materia se viene a pensar ([08:46]);
  elegir un valor intermedio es, en sus palabras, "un arte" ([09:28]) y por eso siempre
  hay que probar ([10:33]). Sí da un rango orientativo: probar **entre 15 y 20 intervalos**
  como punto de partida y ajustar mirando si el gráfico resulta informativo. El trade-off ancho/ruido en sí ya
  está en el callout de [[histograma-y-frecuencias]] — lo que aporta el video es
  puntualmente el **número concreto** (15-20) para arrancar a probar, que no está en
  ningún apunte.
- **(c) Advertencia (error frecuente).** Marca explícitamente una confusión típica:
  pensar que el **intervalo modal** (el de mayor frecuencia) es automáticamente "el más
  importante" porque ahí "debería estar" la media. En su ejemplo la media da $40$ pero el
  intervalo modal es $[37,39)$, que **no la contiene**. La media es un resumen distinto
  de la moda y no tienen por qué coincidir espacialmente en el histograma — ver también
  la sección de moda en [[medidas-de-tendencia-central]].
- **(d) Énfasis.** Insiste en que leer un histograma es más que identificar la barra más
  alta: importa la **forma completa** de la distribución (sube, se estanca, baja) y,
  aparte del centro, se pueden leer directamente ahí la **asimetría** y el **peso de las
  colas** (outliers visibles o no) — ver [[asimetria-y-curtosis]] y [[boxplot]].

## Ejercicio resuelto en clase

Esta clase no desarrolla un ejercicio cerrado con enunciado-planteo-cálculo-resultado al
estilo parcial; en su lugar, construye **en vivo, paso a paso sobre un mismo dataset**
(duración de viajes en tren, alrededor de 61 datos) la secuencia completa que lleva del
dato crudo al histograma final:

1. **[03:18]** Grafica los datos crudos (valor vs. constante) y muestra que, al ser
   continuos, casi ningún par de datos coincide exactamente — el gráfico no distingue
   qué valores son más frecuentes.
2. **[04:16]** Divide el rango en intervalos de $2$ minutos y cuenta, intervalo por
   intervalo, cuántos datos caen en cada uno (anota los conteos sobre el gráfico:
   $1,1,6,7,15,5,10,6,6,1,2$).
3. **[05:48]** Traduce esos conteos a un histograma de $11$ intervalos y lo interpreta:
   intervalo modal $[37,39)$ con frecuencia $15$; valores por debajo de $33$ o por
   encima de $47$ minutos, infrecuentes; la media ($40$) cae fuera del intervalo modal.
4. **[07:41]–[09:57]** Repite la construcción con $3$ intervalos y con $100$ intervalos
   sobre el mismo dataset para mostrar, por comparación directa, los dos extremos a
   evitar (demasiado agregado / demasiado ruidoso).

Es más una **demostración metodológica** (cómo se construye y se ajusta un histograma)
que un ejercicio numérico cerrado — el valor está en seguir la secuencia de decisiones,
no en un resultado final a reportar.

## Advertencias del docente

- **[06:56]–[07:03]** "Lo primero que dicen [los alumnos] es: este es el intervalo más
  importante porque es el que más se repite... ahí está la media." Aclara que **no**:
  la media puede caer en cualquier intervalo, no necesariamente el modal.
- **[09:19]–[09:24]** Advierte contra la intuición de que tomar más intervalos siempre va a
  dar un mejor gráfico: con demasiados intervalos (más que la cantidad de datos) aparecen huecos artificiales
  que no reflejan que esos rangos sean realmente infrecuentes.
- **[09:34]–[09:47]** Remarca que un intervalo con frecuencia $0$ rodeado de intervalos
  con frecuencia alta **no debe leerse como un rango infrecuente**, sino como ruido de
  haber elegido demasiados intervalos.
- **[10:36]–[10:39]** Da el rango orientativo para la cantidad de intervalos a probar:
  "en general se prueban como entre 15 y 20".

## Páginas del wiki que toca

- [[histograma-y-frecuencias]]
- [[medidas-de-tendencia-central]]
- [[asimetria-y-curtosis]]
- [[datos-agrupados]]
- [[boxplot]]
- [[estadistica-descriptiva]]
