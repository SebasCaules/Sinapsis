---
titulo: "Video — IC (Desvío conocido)"
resumen: "Clase en video de Lucio Pantazis (unidad 8) que desarrolla el intervalo de confianza para la media con desvío conocido y para una proporción, bilateral y unilaterales, con la técnica del pivote y la interpretación frecuentista de la confianza."
tipo: fuente
formato: video
unidad: 8
url: "https://youtu.be/Ym9bfITI_b8"
duracion: "47:12"
docente: Lucio Pantazis
ingerido: 2026-09-03
---

# Video — IC (Desvío conocido)

**Qué es:** clase en video (Lucio Pantazis) que desarrolla, con un ejemplo
numérico único hilado de punta a punta, el intervalo de confianza (IC) para la
media con desvío poblacional conocido y el IC para una proporción.
**Cubre:** motivación de la estimación por intervalos, técnica del pivote,
IC bilateral y unilaterales para la media (desvío conocido), interpretación
frecuentista, e IC bilateral y unilaterales para una proporción.
**Guía asociada:** Guía 8.

## Recorrido de la clase

| Timestamp | Tema |
|---|---|
| [00:05] | Motivación: por qué dar un rango en vez de un único valor (analogía de la pesca) |
| [04:34] | Planteo del caso de Agustina: media poblacional desconocida, desvío conocido ($\sigma\approx 10$), $n=100$, normalidad supuesta |
| [08:29] | Concepto de **distribución pivote** (analogía del pivote de básquet) |
| [09:22] | Uso del pivote: estandarización y cuantiles simétricos $z_{0.975}$ |
| [12:21] | Definición formal del intervalo de confianza $IC_\gamma(\mu)$ |
| [16:36] | Ejemplo numérico: $IC_{95\%}(\mu)$ con los datos de Agustina, $[43.006,\,46.926]$ |
| [18:26] | Advertencia: interpretación errónea de "probabilidad" después de la muestra |
| [20:08] | Simulación de 150 intervalos repetidos (interpretación frecuentista) |
| [23:36] | Trade-off entre confianza y precisión (analogía de la red de pesca) |
| [26:35] | Intervalos asimétricos: por qué en general se elige el cuantil simétrico |
| [28:38] | Introducción a los intervalos unilaterales |
| [32:05] | IC unilateral a izquierda y a derecha para la media (fórmulas y ejemplo numérico) |
| [35:36] | IC para proporciones: derivación del intervalo bilateral |
| [42:24] | Reemplazo de $p$ por $\hat p$ en el desvío: justificación numérica del "sacrificio" |
| [44:50] | Ejemplo numérico: IC bilateral y unilaterales para una proporción ($\hat p=0.7$, $n=100$) |

## Qué aporta sobre el apunte

- **(a) Intuición — técnica del pivote, nombrada explícitamente.** El video
  llama por su nombre a la técnica que subyace a los tres casos de
  [[intervalos-de-confianza]] (Z para la media, Z para la proporción, T para
  la media con $\sigma$ desconocido): construir una **distribución pivote**,
  es decir, una cantidad que combina la muestra con el parámetro desconocido
  pero cuya *distribución* no depende de él (aquí, $\frac{\overline X_n-\mu}
  {\sigma/\sqrt n}\sim\mathcal N(0,1)$). El apunte deriva cada caso por
  separado sin nombrar la técnica común; el video la explicita [08:29].
- **(a) Analogía — la pesca.** Dar un único valor es "tener la caña de pescar en
  un solo lugar"; dar un intervalo es "tirar una red": más ancha, más chance de
  atrapar el pez, pero menos informativa sobre dónde está exactamente. Motiva
  visualmente el trade-off entre nivel de confianza y precisión que el
  formulario resume con la fórmula del error de muestreo
  [00:47]–[01:22], retomada en [23:47]–[25:29].
- **(a) Analogía — el pivote de básquet.** El "pivote" (jugador alto y fijo
  al que se le pasa la pelota para que organice el juego del resto) ilustra
  por qué se elige estandarizar: es la única cantidad cuya distribución
  *se conoce con certeza*, y sirve de ancla para despejar el resto [08:29]–[08:59].
- **(c) Ejercicio resuelto completo** con el mismo ejemplo (Agustina) para
  los tres sub-casos: IC bilateral, unilateral a izquierda y unilateral a
  derecha de la media, y luego IC bilateral y unilaterales de una proporción
  — ver más abajo.
- **(b) Advertencia de examen — orden de despeje en los unilaterales.** Al
  construir un IC unilateral conviene partir de la desigualdad de
  probabilidad (no de "$\overline X_n\le \text{algo}$") porque, al aislar
  $\mu$, hay que invertir el signo de la desigualdad y es un punto donde
  "se equivoca en general" [29:38]–[31:47]. Esto no está desarrollado en
  [[teorica-ic-media-desvio-conocido]].
- **(b) Chequeo de cordura, no escrito en el apunte.** Como todos estos IC
  usan la estimación puntual ($\overline X_n$ o $\hat p$) como ancla: una
  **cota inferior** siempre debe dar *menor* que esa ancla, y una **cota
  superior** siempre debe dar *mayor*. Si no, hay un error de signo
  [31:37]–[31:52], [46:39]–[47:09].
- **(b) Advertencia sobre el peso de lo conceptual.** El docente insiste en
  que las cosas de esta parte de la materia "pueden ser muy mecánicas si uno
  las memoriza", pero **se penaliza**
  no distinguir qué es poblacional/muestral y qué se sabe antes/después de
  la muestra, aunque el resultado numérico esté bien [13:29]–[14:21].
- **(d) Énfasis.** El error más común y más insistido en toda la clase es la
  mala interpretación de "probabilidad" en el IC después de observar la
  muestra [18:26]–[19:43] — ya documentada en [[intervalos-de-confianza]]
  citando [[tp8-estimacion-de-parametros]], pero aquí se refuerza con la
  simulación de 150 intervalos y la analogía de la red ya tirada (el pez
  está o no está adentro, no hay azar involucrado) [19:01]–[19:43].
- **(d) Énfasis — por qué el cuantil simétrico.** El video muestra
  numéricamente (con R) que repartir el $5\%$ de forma asimétrica entre las
  colas da un intervalo **más largo** que repartirlo simétricamente
  (longitud $4.077$ vs. $3.9199$ para el mismo $\gamma$) — justifica por qué
  la convención del apunte usa $z_{\frac{1+\gamma}{2}}$ simétrico en vez de
  un reparto arbitrario [26:44]–[27:53].

## Ejercicio resuelto en clase

**Caso de Agustina — media con $\sigma$ conocido** [04:34]. Se quiere estimar
el puntaje medio poblacional $\mu$. Se supone $\sigma=10$ conocido y
normalidad, con una muestra de $n=100$. Como $\overline X_n$ es un promedio de
normales independientes divididas por una constante, $\overline X_n\sim
\mathcal N(\mu,\sigma/\sqrt n)$ **exactamente** (no hace falta apelar al TCL
en este caso) [06:27]–[07:01].

### 1) Derivación del pivote y del IC bilateral [09:22]–[12:21]

Estandarizando, $\dfrac{\overline X_n-\mu}{\sigma/\sqrt n}\sim\mathcal N(0,1)$.
Tomando $\gamma=0.95$ y despejando $\mu$ de
$$P\!\left(-z_{0.975}\le \frac{\overline X_n-\mu}{\sigma/\sqrt n}\le z_{0.975}\right)=0.95$$
se obtiene
$$IC_\gamma(\mu)=\left[\overline X_n - z_{\frac{1+\gamma}{2}}\frac{\sigma}{\sqrt n},\; \overline X_n + z_{\frac{1+\gamma}{2}}\frac{\sigma}{\sqrt n}\right]$$
— la misma fórmula que [[teorica-ic-media-desvio-conocido]] y
[[intervalos-de-confianza]] (Caso 1).

**Post-muestra**, Agustina observa $\overline x_{obs}=44.966$. Con
$z_{0.975}=1.96$:
$$IC_{95\%}(\mu)=\left[44.966 - 1.96\cdot\frac{10}{\sqrt{100}},\; 44.966+1.96\cdot\frac{10}{\sqrt{100}}\right]=\boxed{[43.006,\;46.926]}.$$

### 2) IC unilaterales [32:05]

**Unilateral a izquierda** (cota inferior para $\mu$):
$$IC_{95\%}(\mu)=\left[\overline X_n - z_{0.95}\frac{\sigma}{\sqrt n},\;+\infty\right)
=\left[44.966-1.6449\cdot\frac{10}{\sqrt{100}},\;+\infty\right)=\boxed{[43.3211,\;+\infty)}.$$
Si el puntaje tiene un máximo natural de $100$ puntos, en la práctica
$IC_{95\%}(\mu)=[43.3211,\,100]$.

**Unilateral a derecha** (cota superior para $\mu$):
$$IC_{95\%}(\mu)=\left(-\infty,\;\overline X_n + z_{0.95}\frac{\sigma}{\sqrt n}\right]
=\left(-\infty,\;44.966+1.6449\cdot\frac{10}{\sqrt{100}}\right]=\boxed{(-\infty,\;46.6109]}.$$
Si el puntaje mínimo natural es $0$, en la práctica $IC_{95\%}(\mu)=[0,\,46.6109]$.

> Nótese cómo ambos IC unilaterales, con el mismo $n$ y la misma confianza,
> quedan **más precisos** que el bilateral de un solo lado — la idea que
> motiva usarlos cuando solo importa un extremo del rango, como remarca el
> chequeo de cordura de la sección anterior.

### 3) IC para una proporción [35:36]–[46:05]

Ahora Agustina quiere estimar la proporción poblacional de aprobados $p$. Por
TCL, $\hat p\sim\mathcal N\!\left(p,\sqrt{p(1-p)/n}\right)$ para $n$ grande, de
donde $\dfrac{\hat p - p}{\sqrt{p(1-p)/n}}\sim\mathcal N(0,1)$ es el pivote.
Al despejar $p$ aparece $\sqrt{p(1-p)/n}$ en el propio intervalo, que no se
puede calcular sin conocer $p$; se reemplaza $p$ por $\hat p$ apoyándose en la
ley de los grandes números — el error introducido es numéricamente
despreciable porque se divide por un $n$ grande, según muestra el cálculo con
calculadora en pantalla [42:24]–[44:24] (mismo resultado que
[[teorica-ic-proporcion]] e [[intervalos-de-confianza]], Caso 2).

Con $\hat p_{obs}=0.7$, $n=100$, $\gamma=95\%$:

**Bilateral:**
$$IC_{95\%}(p)=\left[0.7-1.96\sqrt{\frac{0.7\cdot 0.3}{100}},\;0.7+1.96\sqrt{\frac{0.7\cdot 0.3}{100}}\right]=\boxed{[0.6102,\;0.7898]}.$$

**Unilateral a izquierda:**
$$IC_{95\%}(p)=\left[0.7-1.6449\sqrt{\frac{0.7\cdot 0.3}{100}},\;1\right]=\boxed{[0.6246,\;1]}.$$

**Unilateral a derecha:**
$$IC_{95\%}(p)=\left[0,\;0.7+1.6449\sqrt{\frac{0.7\cdot 0.3}{100}}\right]=\boxed{[0,\;0.7754]}.$$

Los unilaterales usan $1$ y $0$ como cotas naturales de una proporción, igual
que en [[intervalos-de-confianza]] (Caso 2).

## Advertencias del docente

- No confundir "el intervalo tiene 95% de probabilidad de contener a $\mu$"
  (post-muestra, **incorrecto**) con "el 95% de los intervalos construidos de
  esta manera contienen a $\mu$" (pre-muestra, correcto) [21:33]. Es "el error
  más común" de esta unidad y "se nota" cuando no se entiende, aunque el número
  final esté bien [13:29]–[14:21], [18:26]–[19:43].
- Al despejar un IC unilateral, empezar planteando la desigualdad de
  probabilidad y no arrancar despejando directamente desde
  "$\overline X_n\le \text{algo}$": es fácil invertir el signo al pasar
  términos y "en general" ahí está el error [29:38]–[31:47].
- Chequeo rápido para detectar ese error de signo: una cota inferior debe dar
  **menor** que la estimación puntual (ancla); una cota superior debe dar
  **mayor**. Si no, hay que revisar la cuenta [31:37]–[31:52], [46:39]–[47:09].
- Distinguir con precisión qué es poblacional vs. muestral y qué se conoce
  antes vs. después de tomar la muestra: es donde "se penaliza" aunque el
  resultado numérico sea correcto [13:45]–[14:17].
- Redondear los cuantiles con la mayor cantidad de decimales posible antes de
  operar (el docente señala su propio redondeo de $z_{0.975}$ a $1.96$ como
  menos preciso de lo ideal) [16:58]–[17:25].

## Páginas del wiki que toca

- [[intervalos-de-confianza]]
- [[inferencia-estadistica]]
- [[estimacion-puntual]]
- [[teorica-ic-media-desvio-conocido]]
- [[teorica-ic-proporcion]]
- [[formulario-inferencia]]
