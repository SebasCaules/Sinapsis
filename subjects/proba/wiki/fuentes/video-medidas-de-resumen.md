---
titulo: "Video — Medidas de Resumen"
resumen: "Clase en video de Lucio Pantazis (unidad 1) que motiva la estadística descriptiva y recorre media, desvío estándar, asimetría y curtosis sobre 61 tiempos de viaje en subte, con la analogía física del equilibrio para explicar la media."
tipo: fuente
formato: video
unidad: 1
url: "https://youtu.be/ZT5Y83HYbwk"
duracion: "27:47"
docente: Lucio Pantazis
ingerido: 2026-09-03
---

# Video — Medidas de Resumen

**Qué es:** clase en video (YouTube, "Estadística Descriptiva - Medidas de Resumen") del Dr. Lucio José Pantazis, con las mismas slides de la teórica [[estadistica-descriptiva-general]].
**Cubre:** motivación de la estadística descriptiva, representación gráfica valor-vs-constante, media, desvío estándar, asimetría y kurtosis, todo sobre el ejemplo de los tiempos de viaje en subte.
**Guía asociada:** Guía 1.

## Recorrido de la clase

| Timestamp | Tema |
|---|---|
| [00:04] | Apertura: estadística y probabilidad como "las dos caras de la misma moneda". |
| [01:01] | Ejemplo motivador: una persona cronometra 61 viajes en subte al trabajo (minutos). |
| [03:12] | Definición de estadística descriptiva: sacar conclusiones de un conjunto de datos, sin generalizar todavía a otros conjuntos. |
| [04:46] | El problema de resumir: con 61 datos el docente dice que ya al quinto se queda sin concentración; hace falta resumir. |
| [04:54] | Representación gráfica "Valor vs. Constante" de los 61 tiempos. |
| [07:11] | Parámetros de forma: la media, con la analogía física del equilibrio/momento de rotación. |
| [09:52] | Advertencia (poderes deductivos): la media siempre tiene que caer entre el mínimo y el máximo de los datos. |
| [11:44] | Comparación subte vs. colectivo: mismas medias (≈40), pero conjuntos claramente distintos → motiva la dispersión. |
| [13:59] | Desvío estándar: fórmula, por qué se eleva al cuadrado, por qué $n-1$ y por qué la raíz. |
| [16:29] | Cálculo en R del desvío para subte (4.31) y colectivo (7.24); comparación gráfica. |
| [18:01] | Simetría: motivación con tren, taxi y subte (misma media y desvío, pero distinta asimetría). |
| [19:18] | Fórmula del coeficiente de asimetría $\gamma$ y su interpretación de signo. |
| [21:57] | Cálculo en R de $\gamma$ para subte (0.31), taxi (1.90) y tren (−1.50). |
| [23:52] | Kurtosis: motivación con moto, bicicleta y subte (misma media, desvío y simetría, pero distinto peso de colas). |
| [24:41] | Fórmula de la kurtosis $\kappa$ y su interpretación de signo respecto de la normal. |
| [25:53] | Cálculo en R de $\kappa$ para subte (−0.11), bicicleta (−1.32) y moto (2.56). |
| [27:41] | Cierre: "seguimos en otros videos" — corta justo en la slide-título de Percentiles (no se desarrolla en esta clase). |

## Qué aporta sobre el apunte

La teoría (definiciones y fórmulas de media, desvío, asimetría y kurtosis) es la
misma que ya está en [[medidas-de-tendencia-central]], [[medidas-de-dispersion]]
y [[asimetria-y-curtosis]] — mismo docente, mismas slides, mismo ejemplo del
subte. Lo que el video aporta **encima** del apunte:

- **(a) Ejemplos resueltos adicionales, en cadena.** El apunte solo trae los
  datos del subte; el video agrega tres comparaciones nuevas construidas sobre
  el mismo ejemplo, cada una aislando una medida distinta:
  - Subte vs. **colectivo**: casi la misma media (≈40 min) pero desvío muy
    distinto (4.31 vs. 7.24) → ilustra el riesgo de "resumir
    demasiado" en un solo número (12:14).
  - Subte vs. **taxi** vs. **tren**: misma media y desvío similares, pero
    signo de la asimetría opuesto (taxi con cola a la derecha, tren con cola
    a la izquierda) (18:01–22:52).
  - Subte vs. **bicicleta** vs. **moto**: media, desvío y simetría casi
    iguales, pero kurtosis muy distinta (bicicleta platicúrtica, moto
    leptocúrtica) (23:52–27:08).
- **(b) Advertencia de examen — control de coherencia de la media (09:52–11:00).**
  El docente insiste en que si la media da fuera del rango
  $[\min_i x_i, \max_i x_i]$, hay un error de cuenta: es cuestión de
  "desarrollar sus poderes deductivos" (11:11). No está como tal en el apunte ([[estadistica-descriptiva-general]]).
- **(c) Énfasis explícito** en que ninguna medida de resumen dice todo por sí
  sola — cada una aporta un aspecto distinto y por eso hace
  falta calcular varias para comparar conjuntos de datos (13:00, 23:04).

> La intuición del "equilibrio físico" de la media (pensar los datos como
> pesos sobre una recta) que el video da en [08:56] **no es un aporte nuevo**:
> el apunte [[estadistica-descriptiva-general]] la trae con una redacción casi
> idéntica ("los datos a su izquierda y a su derecha queden equilibrados"), y
> ya está recogida en [[medidas-de-tendencia-central]]. Se corrige aquí una
> afirmación previa de esta página que decía que el video la explicaba "con
> más detalle" — verificado contra el frame de la slide "Representación
> gráfica de la media" [09:06], el texto es prácticamente el mismo que el del
> PDF.

## Ejercicio resuelto en clase

*Arranca en [07:11], se completa en [25:53]. Fuente: video-medidas-de-resumen
— mismo ejemplo motivador (n=61 viajes en subte), mismo enunciado y mismas
fórmulas que [[estadistica-descriptiva-general]], pero con una corrida de R
distinta a la del apunte (ver discrepancia debajo). Todas las cifras de esta
sección fueron verificadas cuadro por cuadro contra las slides del video
(frames en 07:41, 16:53, 21:57 y 25:53), no transcriptas de oído.*

> ⚠️ Discrepancia: el video y el apunte [[estadistica-descriptiva-general]]
> presentan lo que parece ser "el mismo" ejercicio (n=61 tiempos de viaje en
> subte, misma consigna, mismas fórmulas, incluso el mismo layout de slide),
> pero las cifras concretas de media y desvío **no coinciden**:
> - **Subte** — video: $\bar x=40.01801$, $s=4.313204$ · apunte
>   ([[estadistica-descriptiva-general]]): $\text{mean}(x)=40.02001$,
>   $\text{sd}(x)=4.792449$.
> - **Colectivo** — video: $s=7.240922$ · apunte: $\text{sd}(y)=7.188674$.
>
> Llamativamente, para el subte $\gamma=0.3057749$ y $\kappa=-0.1125623$
> **sí coinciden exacto** (a 7 cifras significativas) entre video y apunte,
> pese a que $\gamma$ y $\kappa$ se calculan con las mismas $x_i$ que dan
> $\bar x$ y $s$ — algo que en principio no debería ocurrir si los conjuntos
> de datos fueran distintos. No hay manera de resolver esta inconsistencia sin
> acceso al script de R original del docente; probablemente el video reutiliza
> una ejecución previa de $\gamma$/$\kappa$ mientras que $\bar x$/$s$ surgen de
> una corrida distinta de los datos, o viceversa. Se deja constancia de ambas
> versiones tal como figuran en cada fuente — ninguna de las dos cifras fue
> alterada ni corregida.

**Enunciado.** Una persona cronometra el tiempo (en minutos) de $n=61$ viajes
en subte a su trabajo, obteniendo los datos $x_1,\dots,x_{61}$ (variable
cuantitativa continua). Calcular la media, el desvío estándar, el coeficiente
de asimetría y la kurtosis de la muestra.

**Planteo y cálculo — media** [07:11]:
$$ \bar x = \frac{\sum_{i=1}^{61} x_i}{61} = 40.01801 \text{ min} $$
El docente verifica en R que `sum(x)/n` coincide con `mean(x)`.

**Planteo y cálculo — desvío estándar** [13:59]:
$$ s = \sqrt{\frac{\sum_{i=1}^{61}(x_i-\bar x)^2}{61-1}} = \sqrt{\frac{\sum (x_i-\bar x)^2}{60}} = 4.313204 \text{ min} $$
Verificado con `sd(x)`. Para el conjunto de datos del colectivo (mismo $n$,
misma $\bar x \approx 39.99$), el desvío da $s=7.240922$ — mayor dispersión
aunque la media sea prácticamente igual (sobre la discrepancia de estas
cifras con el apunte, ver el recuadro más arriba).

**Planteo y cálculo — asimetría** [19:18]–[21:57]:
$$ \gamma = \frac{\sum_{i=1}^{61}(x_i-\bar x)^3}{61\cdot s^3} = 0.3057749 $$
Verificado con `skewness(x)`. Al ser cercano a cero, el subte es
relativamente simétrico. Para comparar: taxi da $\gamma=1.89803$ (asimetría
marcada a derecha) y tren da $\gamma=-1.504807$ (asimetría marcada a
izquierda) — cifras leídas del frame de la slide "Cálculo" en [21:57]; taxi y
tren son ejemplos propios del video, sin equivalente en el apunte.

**Planteo y cálculo — kurtosis** [24:41]–[25:53]:
$$ \kappa = \frac{\sum_{i=1}^{61}(x_i-\bar x)^4}{61\cdot s^4} - 3 = -0.1125623 $$
Verificado con `kurtosis(x)`. Cercano a cero → peso de colas similar al de
una [[distribucion-normal|normal]]. Para comparar: bicicleta da
$\kappa=-1.32002$ (colas livianas, platicúrtica) y moto da $\kappa=2.563028$
(colas pesadas, leptocúrtica) — cifras leídas del frame de la slide "Cálculo"
en [25:53]; moto y bicicleta son ejemplos propios del video, sin equivalente
en el apunte (el PDF no menciona ninguno de los dos vehículos).

**Resultado.** Para los 61 tiempos de viaje en subte:
$\bar x = 40.018$ min, $s = 4.313$ min, $\gamma = 0.306$, $\kappa = -0.113$ —
una distribución centrada en 40 minutos, con dispersión moderada,
aproximadamente simétrica y con colas similares a una normal.

## Advertencias del docente

- **[09:52]** La media **siempre** tiene que quedar entre el mínimo y el
  máximo de los datos (no necesariamente en el centro exacto, pero sí en ese
  rango). Si no ocurre, hay un error en la cuenta: son cosas que "les tienen
  que hacer ruido" [10:38], del mismo modo que hace ruido escuchar a alguien
  hablar en otra variedad del español.
- **[13:00]/[23:04]** Ninguna medida de resumen aislada alcanza para comparar
  conjuntos de datos: dos muestras pueden compartir la media y aun así ser muy
  distintas (colectivo vs. subte); pueden compartir media y desvío y diferir
  en simetría (taxi vs. tren); pueden compartir media, desvío y simetría y
  diferir en kurtosis (moto vs. bicicleta). Cuantas más medidas se calculan,
  más información se tiene para comparar.
- **[15:29]** Sobre el $n-1$ del desvío: el docente pide "por ahora confíen"
  en la fórmula — la justificación completa se da solo con estimadores
  (Guía 8), aunque adelanta que para $n$ grande la diferencia entre dividir
  por $n$ o por $n-1$ es numéricamente ínfima.

## Páginas del wiki que toca

- [[estadistica-descriptiva]]
- [[medidas-de-tendencia-central]]
- [[medidas-de-dispersion]]
- [[asimetria-y-curtosis]]
- [[cuartiles-y-percentiles]]
