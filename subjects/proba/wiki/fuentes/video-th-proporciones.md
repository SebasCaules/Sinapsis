---
titulo: "Video — TH (Proporciones)"
resumen: "Clase en video de Lucio Pantazis (unidad 9) sobre la prueba de hipótesis para una proporción: deducción de la región de rechazo con aproximación normal en los tres tipos de test, y prueba exacta con la binomial cuando n es chico."
tipo: fuente
formato: video
unidad: 9
url: "https://youtu.be/qLH_tPpasg0"
duracion: "34:02"
docente: Lucio Pantazis
ingerido: 2026-09-03
---

# Video — TH (Proporciones)

**Qué es:** clase grabada (Zoom) del docente Lucio Pantazis sobre pruebas de
hipótesis para una proporción poblacional, con el ejemplo recurrente de
Ricardo y su proveedor de tornillos.
**Cubre:** deducción de la región de rechazo con aproximación normal (tests
unilaterales y bilateral), y prueba exacta con la binomial cuando $n$ es
chico.
**Guía asociada:** Guía 9.

## Recorrido de la clase

| Timestamp | Tema |
|---|---|
| [00:06] | Repaso: por qué en proporción el desvío ya no se piensa aparte de la media (a diferencia de intervalos de confianza) |
| [01:24] | Ejemplo motivador: Ricardo y el proveedor de tornillos ($n=150$ cajas, $p_0=0.2$) |
| [04:40] | Planteo intuitivo de la región de rechazo en términos de $\hat p$ y deducción del valor crítico $p_c$ |
| [06:34] | Estandarización asumiendo $H_0$ cierta (por qué se reemplaza todo por $p_0$ y no por $\hat p$) |
| [07:12] | Advertencia: verificación del signo del valor crítico como control de coherencia |
| [09:05] | Dos formas equivalentes de plantear la región de rechazo: con $\hat p$ o con $Z$ estandarizado |
| [09:55]–[12:10] | Cálculo del error tipo II y ejemplo numérico (observa 22%, se acepta $H_0$) |
| [14:36] | Slide: test unilateral a izquierda (forma general) |
| [17:12] | Advertencia: no confiar ciegamente en la fórmula del valor p |
| [18:49] | Slide: test unilateral a derecha, regla de decisión y $\beta(p_1)$ |
| [20:22]–[22:26] | Slide: test bilateral, dos valores críticos y valor p bilateral |
| [24:53] | Caso $n$ chico: introducción (Ricardo solo puede revisar 10 cajas) |
| [27:22] | Cálculo exacto del error tipo I con la binomial y tabla de valores críticos |
| [29:23] | Demostración con un applet de distribución binomial (mabognar.github.io) |
| [31:00]–[33:21] | Error tipo II exacto (curva de operación característica) y valor p en el caso discreto |

## Qué aporta sobre el apunte

- **(a) Ejemplo nuevo con la aproximación normal.** El video resuelve un caso
  completo de $H_0: p=0.2$ vs $H_1: p>0.2$ con $n=150$ (Ricardo/proveedor de
  tornillos), pero la deducción es **la misma** que ya está en
  [[apunte-prueba-proporcion]] y [[prueba-de-hipotesis-para-la-proporcion]]
  (mismo despeje de $\hat p_c$, mismo $\beta(p)$). No se repite aquí; los
  números concretos del video ($p_c=0.2537$, $z_{0.95}$) son ilustrativos pero
  coinciden en método con el ejercicio de envases ya resuelto en el wiki.
- **(a) Caso $n$ chico con binomial exacta.** Esto **no está** en las fuentes
  ya ingeridas: cuando $n$ es demasiado chico para la aproximación normal, se
  puede seguir testeando la hipótesis usando la distribución binomial exacta
  del conteo de éxitos, buscando el valor crítico dentro del recorrido
  discreto. Ver el ejercicio resuelto abajo y el aporte propuesto a
  [[prueba-de-hipotesis-para-la-proporcion]].
- **(b) Intuición — pensar con $\hat p$ en vez de con $Z$.** El docente insiste
  en que memorizar la fórmula del estadístico estandarizado es menos
  importante que poder plantear la región de rechazo directamente en términos
  de la proporción muestral observada ("más amigable"): alcanza con saber que
  $\hat p$ es aproximadamente normal con la media y el desvío que correspondan
  bajo cada hipótesis, y restar/dividir a mano. Esto ya está capturado como
  "equivalencia de estadísticos" en [[estadistico-de-prueba]], pero el video
  lo presenta explícitamente como estrategia de estudio, no solo como
  propiedad matemática.
- **(b) Intuición — por qué el $Z$ crítico bilateral es un único valor.**
  [20:45] En el test bilateral, los dos valores críticos $p_{c_1}$ y $p_{c_2}$
  son simétricos respecto de $p_0$ pero **no** respecto de cero (en la escala
  de $\hat p$). Al estandarizar, todo se recentra en $0$, y por eso alcanza
  con un único $z_{1-\alpha/2}$ en valor absoluto — la tabla con la regla
  $|Z|>z_{1-\alpha/2}$ que ya figura en
  [[prueba-de-hipotesis-para-la-proporcion]] es la consecuencia de esta
  asimetría/simetría que el video hace explícita.
- **(d) Énfasis — "valor p chico, se rechaza $H_0$" es universal.**
  [15:55]–[19:04] El docente repite varias veces, a propósito, que la regla de
  decisión con el valor p es la **misma en todo test** (media o proporción,
  uni o bilateral): solo cambia cómo se calcula el valor p, no la regla final
  de decisión. Lo marca como el hilo conductor de toda la unidad.

## Ejercicio resuelto en clase

**[24:53] Caso $n$ pequeño — prueba exacta con la binomial.**

**Enunciado.** Ricardo no tiene tiempo de revisar $n=150$ cajas y solo puede
revisar $n=10$. El proveedor sostiene que la proporción de cajas deficitarias
es $p_0=0.2$. Se plantea $H_0: p=0.2$ vs $H_1: p>0.2$, con una probabilidad
máxima de error tipo I del $5\%$.
(a) Hallar la región de rechazo.
(b) Calcular la probabilidad de error tipo II para $p_1=0.3$ y para $p_1=0.9$.
(c) Si en la muestra se observaron $x_{\text{obs}}=8$ cajas deficitarias,
calcular el valor p.

**Planteo.** Sea $X_{10}=$ cantidad de cajas deficitarias en la muestra de
$10$. Para cualquier $p$, como todas las cajas provienen de la misma
población y son independientes, $X_{10}\sim \text{Bi}(10,p)$. Con $n$ tan
chico **no vale la aproximación normal**: hay que trabajar con la binomial
exacta. Intuitivamente, Ricardo rechaza $H_0$ si observa "demasiadas" cajas
deficitarias, es decir, si $X_{10}\ge x_c$, con $x_c$ a determinar dentro del
recorrido discreto $\{0,1,\dots,10\}$.

**(a) Región de rechazo.** Se busca el menor $x_c$ tal que la probabilidad
máxima de error tipo I quede acotada por $5\%$:
$$ \alpha = P(\text{Rechazar } H_0 \mid H_0 \text{ cierta}) = P(X_{10}\ge x_c \mid p=0.2) = \sum_{i=x_c}^{10}\binom{10}{i}0.2^i\,0.8^{10-i} \le 0.05. $$

Tabla de $P(X_{10}\ge x_c \mid p=0.2)$ para cada $x_c$ posible:

| $x_c$ | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| $P(X_{10}\ge x_c)$ | 1 | 0.89263 | 0.62419 | 0.3222 | 0.12087 | **0.03279** | 0.00637 | 0.00086 | 0.00008 | 0 | 0 |

Como $P(X_{10}\ge 4)=0.12087>0.05$ y $P(X_{10}\ge 5)=0.03279\le 0.05$, el
menor valor de $x_c$ que cumple la cota es $x_c=5$.

**Resultado (a).** Se rechaza $H_0$ si $X_{10}\ge 5$ (cinco o más cajas
deficitarias de las diez revisadas); se acepta $H_0$ si $X_{10}\le 4$. La
probabilidad de error tipo I efectivamente garantizada es $0.03279$, **por
debajo** del $5\%$ pedido — con una variable discreta casi nunca se puede
alcanzar exactamente el $\alpha$ nominal, solo acotarlo por arriba.

**(b) Error tipo II.** Con el límite de aceptación fijado en $X_{10}\le 4$:
$$ \beta(p_1) = P(\text{Aceptar } H_0 \mid p=p_1) = P(X_{10}\le 4 \mid p=p_1) = \sum_{i=0}^{4}\binom{10}{i}p_1^i(1-p_1)^{10-i}. $$
Para $p_1=0.3$: $\beta(0.3)\approx 0.8498$. Para $p_1=0.9$: $\beta(0.9)\approx 0.00015$.
Repitiendo el cálculo para más valores de $p_1$ se obtiene la curva de
operación característica (OC): arranca cerca de $1-\alpha\approx 0.97$ en
$p_1=0.2$ y cae hacia $0$ a medida que $p_1$ se aleja de $p_0$ hacia la
derecha — pero de forma gradual cerca de $p_0$: con $n=10$ tan chico, el test
todavía tiene muy poca potencia para distinguir $p_1=0.3$ de $p_0=0.2$
($\beta(0.3)\approx 0.85$, es decir, solo $15\%$ de probabilidad de detectar
ese corrimiento).

**(c) Valor p para $x_{\text{obs}}=8$.**
$$ \text{valor p} = P(X_{10}\ge x_{\text{obs}} \mid p=0.2) = P(X_{10}\ge 8 \mid p=0.2) = 0.00008. $$
Es la misma tabla del punto (a), leída en el valor observado en vez de en el
crítico: cada fila de esa tabla es directamente el valor p que resultaría de
haber observado ese $x_{\text{obs}}$.

**Resultado (c).** Como $0.00008 \ll 0.05$ (y $8>x_c=5$), se rechaza $H_0$
con muchísima más evidencia que la mínima requerida para rechazar.

## Advertencias del docente

- [07:12] Al despejar el valor crítico, chequear el **signo**: si se rechaza
  cuando el estadístico es "demasiado grande", el valor crítico debe quedar
  **por encima** del valor de referencia $p_0$ (nunca por debajo) — es un
  error frecuente y fácil de detectar revisando este sentido.
- [17:12] "La fórmula no tiene mucho sentido porque no son fórmulas
  sencillas […] es mejor pensar" — advierte contra memorizar ciegamente las
  fórmulas de $\beta$ y del valor p sin entender de dónde salen: quien confía
  solo en la fórmula y la aplica mal no tiene forma de darse cuenta de que el
  resultado está mal.
- [22:26] Marca explícitamente la fórmula del valor p **bilateral** como "el
  más antiintuitivo y el más difícil acordarse la fórmula" — recomienda pensarla
  dibujando la campana y usando la simetría respecto del valor de referencia
  en vez de recordar la fórmula de memoria.
- [15:55]–[19:04] Remarca que la regla "valor p chico $\Rightarrow$ se
  rechaza $H_0$" es la que hay que recordar siempre; lo que cambia de test en
  test es solamente cómo se calcula ese valor p.

## Páginas del wiki que toca

- [[prueba-de-hipotesis-para-la-proporcion]]
- [[apunte-prueba-proporcion]]
- [[estadistico-de-prueba]]
- [[error-tipo-i-y-tipo-ii]]
- [[valor-p]]
- [[reconocer-prueba-de-hipotesis]]
- [[diseno-de-prueba-tamano-muestral]]
- [[prueba-de-hipotesis]]
- [[formulario-pruebas-de-hipotesis]]
