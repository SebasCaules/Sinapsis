---
titulo: "Video — Población y Muestra"
resumen: "Clase en video de Lucio Pantazis (unidad 8) que abre la inferencia: población frente a muestra, parámetro frente a estimador, sesgo, varianza y error cuadrático medio, por qué se divide por n-1 y el estimador de una proporción."
tipo: fuente
formato: video
unidad: 8
url: "https://youtu.be/n_AyVpMT6MQ"
duracion: "39:20"
docente: Lucio Pantazis
ingerido: 2026-09-03
---

# Video — Población y Muestra

**Qué es:** clase grabada (Zoom) del Dr. Lucio Pantazis, primera mitad de
"Estimación e Intervalos de Confianza": arranca la unidad de inferencia con el
ejemplo hilo-conductor de Agustina y el ministerio de educación.
**Cubre:** población vs. muestra, parámetro vs. estadístico/estimador, sesgo,
varianza del estimador, error cuadrático medio, por qué $n-1$ en la varianza
muestral (con la ji-cuadrado), y el estimador de una proporción.
**Guía asociada:** Guía 8.

## Recorrido de la clase
| Timestamp | Tema |
|---|---|
| [00:04] | Transición de probabilidad a estadística inferencial: la probabilidad no desaparece, sustenta que la información vino de algún lado y tiene una cierta distribución probabilística. |
| [00:45] | Presenta el ejemplo hilo-conductor: Agustina, del ministerio de educación, quiere conocer el rendimiento matemático de la población a partir de un cuestionario. |
| [02:23] | Censar a toda la población es inviable ("sería un referéndum"); toma una muestra de 100 personas. |
| [03:21] | El promedio poblacional $\mu$ es un valor fijo y desconocido — nunca se va a conocer porque no se censa toda la población. |
| [06:04] | Distinción central: lo poblacional es fijo, lo muestral es variable (cambia con cada muestra) — y por qué es una variable aleatoria antes de observarla. |
| [07:14] | Notación del estimador $\hat\theta$ (el "sombrero"): depende de la muestra y estima un parámetro poblacional desconocido $\theta$. |
| [09:58] | Por qué se define el estimador **antes** de tomar la muestra: evita sesgar las conclusiones con los resultados ya vistos. |
| [10:18] | Simulación con 500 muestras de tamaño 100: los promedios muestrales, superpuestos, se concentran cerca de $\mu$ y su histograma se ve normal. |
| [12:45] | Definición de sesgo con ejemplo visual: comparación de una distribución del estimador centrada en $\theta$ (insesgada) contra una corrida (sesgada). |
| [18:41] | La varianza del estimador también importa: comparar muestra de 100 contra 400 (a mayor $n$, menor dispersión, estimador más preciso). |
| [21:04] | Error cuadrático medio (ECM) como balance entre sesgo y varianza, con la demostración completa de $\mathrm{ecm}=V(\hat\theta)+\mathrm{sesgo}^2$. |
| [24:08] | Arranca la explicación prometida en la guía 8: por qué la varianza muestral divide por $n-1$. |
| [25:46] | Deriva $E[(n-1)S_n^2/\sigma^2]=n-1$ a partir de la ji-cuadrado como caso particular de la Gamma. |
| [28:39] | El estimador que divide por $n$ (sin $-1$) es sesgado pero **asintóticamente insesgado**; con $n$ grande el sesgo es despreciable. |
| [30:07] | Segundo ejemplo: Agustina quiere la proporción poblacional de aprobados, no solo el puntaje promedio. |
| [31:59] | Modela la cantidad de aprobados en la muestra como Binomial$(n,p)$. |
| [33:09] | Aplica TCL a $\hat p$: distribución aproximadamente normal de media $p$ y desvío $\sqrt{p(1-p)/n}$. |
| [35:53] | Por qué la proporción es un caso especial: el desvío depende del mismo $p$, así que no hay un "sigma" separado que estimar. |
| [37:05] | Recapitula la distinción mayúscula/minúscula: variables aleatorias antes de la muestra, valores fijos observados después. |

## Qué aporta sobre el apunte
- **(d) Énfasis explícito de dificultad.** El docente marca dos veces que "esta
  parte de la materia es conceptualmente muy difícil, las cuentas en general son
  fáciles" [15:55] y que por eso repite y recapitula constantemente la distinción
  población/muestra y antes/después de la muestra — la misma distinción que ya
  está en [[inferencia-estadistica]], pero aquí el docente la señala como el punto
  que más cuesta y el que más hay que cuidar en el parcial.
- **(b) Analogía de las dos distribuciones (sesgo vs. varianza).** Complementa la
  analogía del tirador que ya está en [[estimacion-puntual]]: aquí lo hace con dos
  distribuciones superpuestas (una sesgada de poca varianza, otra insesgada de
  mucha varianza) y explica por qué, mirando los valores extremos, el estimador
  sesgado-pero-preciso puede ser "más representativo" del valor real que el
  insesgado-pero-disperso [19:51]–[21:04]. Motiva por qué se usa el ECM y no solo
  el sesgo — concepto que ya está formalizado en [[estimacion-puntual]].
- **(a) Ejemplo/demo simulada de la distribución del promedio.** La simulación de
  500 muestras de tamaño 100 superpuestas y su histograma (que se ve normal) es
  una ilustración visual del TCL aplicado a $\overline X_n$ que no está en la
  teórica manuscrita ([[teorica-estimacion-puntual-conocidos]] da la fórmula
  directamente, sin esta demo).
- **(c) Advertencia práctica sobre software.** Al hablar del estimador que divide
  por $n$ en vez de $n-1$, avisa: "un software tiene que chequear si está usando
  esto dividido $n$ o esto dividido $n-1$" [28:32] — relevante para no confundir
  la salida de calculadoras o librerías que usan por defecto una u otra
  convención.
- **(d) Insight sobre la proporción como caso especial.** Remarca que, a
  diferencia de la media (donde $\mu$ y $\sigma$ son dos incógnitas separadas),
  en la proporción el desvío depende del mismo parámetro que se quiere estimar,
  así que "no son dos cosas que yo tengo que analizar, sino como una sola" [35:44].
  Este matiz no está explícito en [[teorica-estimacion-puntual-conocidos]] ni en
  [[estimacion-puntual]].

## Ejercicio resuelto en clase
Esta clase no desarrolla ejercicios numéricos completos (no hay datos concretos
que se calculen a mano paso a paso). En su lugar, el docente trabaja dos ejemplos
conceptuales con datos simulados/ilustrativos:

1. **Ejemplo de Agustina — puntaje medio** [00:45]–[29:00]: plantea el problema
   de estimar el rendimiento medio $\mu$ de una población a partir de una
   muestra de 100 personas, usa una simulación de 500 muestras para mostrar
   visualmente que $\overline X_n$ se distribuye aproximadamente normal alrededor
   de $\mu$, y de ahí deriva sesgo, varianza y ECM del estimador — y por qué la
   varianza muestral usa $n-1$.
2. **Ejemplo de Agustina — proporción de aprobados** [30:07]–[36:56]: plantea
   estimar la proporción poblacional $p$ de personas que aprueban un
   cuestionario a partir de la proporción muestral $\hat p$, modela la cantidad
   de aprobados como Binomial$(n,p)$ y aplica TCL para obtener
   $\hat p \sim \mathcal N\!\left(p,\sqrt{p(1-p)/n}\right)$.

Las fórmulas y demostraciones que sí calcula completas (ECM $=V(\hat\theta)+\mathrm{sesgo}^2$,
$E[(n-1)S_n^2/\sigma^2]=n-1$) coinciden con las ya resueltas paso a paso en
[[estimacion-puntual]] y en [[distribucion-ji-cuadrado]] — ver esas páginas para
la versión completa con LaTeX.

## Advertencias del docente
- [09:14] Insiste en definir el estimador **antes** de ver la muestra: "si yo no
  digo de antemano, [...] me puedo ver muy sesgado por los resultados" — decidir
  después de ver los datos invalida la objetividad del análisis.
- [15:55] Marca que esta parte de la unidad es "conceptualmente muy difícil" aun
  cuando "las cuentas en general son fáciles" — pide prestar atención a los
  conceptos, no solo memorizar las fórmulas.
- [28:32] Advierte que hay que revisar si un software usa como denominador de la
  varianza muestral $n$ o $n-1$, porque ambos aparecen según la implementación.
- [37:35] Repite la convención de mayúscula/minúscula ($\overline X_n$ vs.
  $\overline x_n$) como señal de si todavía se está antes o después de observar
  la muestra — la marca como un error común de interpretación.

## Páginas del wiki que toca
- [[inferencia-estadistica]]
- [[estimacion-puntual]]
- [[varianza-muestral]]
- [[distribucion-ji-cuadrado]]
