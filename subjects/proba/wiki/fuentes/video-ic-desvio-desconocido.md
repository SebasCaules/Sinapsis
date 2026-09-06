---
titulo: "Video — IC (Desvío desconocido)"
resumen: "Clase en video de Lucio Pantazis (unidad 8) sobre el intervalo de confianza para la media con la t de Student, el de la varianza con ji-cuadrado, el árbol de identificación de escenarios y el tamaño muestral con la técnica de la muestra piloto."
tipo: fuente
formato: video
unidad: 8
url: "https://youtu.be/7R2mT7rTfjw"
duracion: "41:36"
docente: Lucio Pantazis
ingerido: 2026-09-03
---

# Video — IC (Desvío desconocido)

**Qué es:** clase (Dr. Lucio Pantazis) sobre intervalos de confianza cuando el
desvío poblacional es desconocido, cierra con el cálculo de tamaño muestral en
los tres escenarios (media con desvío conocido, media con desvío desconocido,
proporción).
**Cubre:** distribución t de Student aplicada al IC de la media; ji-cuadrado
aplicada al IC de la varianza cuando las variables no son normales; cálculo de
tamaño muestral, incluido el caso con desvío desconocido (técnica de la
"muestra piloto"); árbol de decisión para identificar el escenario correcto.
**Guía asociada:** Guía 8.

## Recorrido de la clase

| Timestamp | Tema |
|---|---|
| [00:05] | Motivación: por qué el desvío desconocido rompe el pivote normal (dividir por una variable, no por una constante). |
| [02:37] | Aparece la distribución t de Student (historia de Gosset) y comparación gráfica con la normal para distintos grados de libertad. |
| [06:14] | Construcción del IC para $\mu$ con $T$ (mismo despeje que el caso $Z$, cambiando cuantiles). |
| [07:33] | Ejemplo numérico: IC para la media con t de Student, $n=10$. |
| [08:07] | Cómo leer la tabla de cuantiles de la t (fila = grados de libertad, ya no solo columna). |
| [09:36] | Análisis de cobertura empírica: usar cuantiles normales en vez de t con $n=10$ da 93% en vez de 95%. |
| [11:22] | Regla práctica: a partir de $n>30$ el cálculo con normal y con t-Student casi no difieren (variables normales). |
| [12:59] | Pivote para variables NO normales: estimar la varianza con ji-cuadrado. |
| [17:16] | Ejemplo numérico: IC para la varianza $\sigma^2$ con ji-cuadrado. |
| [17:47] | Cobertura del IC de varianza: ji-cuadrado da la cobertura correcta; usar cuantiles t (mal aplicados) da 100% — está mal formulado. |
| [21:09] | Árbol de decisión: identificación de escenarios (media/proporción, normal/no normal, desvío y $n$). |
| [29:02] | Tamaño muestral con desvío **conocido** ($n=1537$) y advertencia sobre el redondeo. |
| [31:36] | Tamaño muestral con desvío **desconocido**: técnica de la "muestra piloto" ($n=1715$). |
| [36:04] | Tamaño muestral para proporción: cota conservadora ($n=9604$) vs. muestra piloto ($n=8068$). |

## Qué aporta sobre el apunte

- **(a) Ejercicio adicional de IC para la varianza vía ji-cuadrado**, con
  desarrollo completo (construcción del pivote, inversión de la desigualdad,
  fórmula final y ejemplo numérico). El apunte del docente introduce el
  estadístico $(n-1)S_n^2/\sigma^2\sim\chi^2_{n-1}$ (ver
  [[distribucion-ji-cuadrado]]) pero **no** construye ahí el intervalo de
  confianza para $\sigma^2$; este video sí lo hace punta a punta. Ver
  "Ejercicio resuelto en clase".
- **(a) Técnica de la "muestra piloto" para tamaño muestral con desvío
  desconocido**, tanto para la media como para la proporción con una
  estimación previa: usar el $s$ (o $\hat p$) de una muestra chica ya
  disponible como sustituto razonable del valor poblacional al despejar $n$
  para una muestra nueva más grande. Esto no está en
  [[intervalos-de-confianza]] (la sección "Tamaño muestral" de esa página solo
  cubre el caso con $\sigma$ conocido y la proporción con cota conservadora).
  Ver "Ejercicio resuelto en clase".
- **(b) Intuición de por qué aparece la t de Student.** El docente explica que
  el problema no es dividir por una constante distinta, sino que **el pivote
  pasa de dividir una normal por una constante a dividir una normal por una
  variable aleatoria** (el desvío muestral $S_n$ cambia de muestra a muestra),
  y por eso deja de ser normal [02:00]–[02:36]. Es una forma más intuitiva de
  motivar la t de Student que la manipulación algebraica sola del apunte
  ([[teorica-ic-media-desvio-desconocido-intro]]).
- **(b) Validación empírica por simulación (cobertura).** El video muestra
  gráficos de cobertura (miles de intervalos simulados, marcando en rojo los
  que no atrapan al valor real) para comparar: t-Student vs. normal en la
  media ($n=10$ y $n=100$), y ji-cuadrado vs. t-Student (mal aplicada) en la
  varianza ($n=10$ y $n=100$). Es una intuición visual de qué significa que un
  intervalo "tenga validez teórica" que no está en ningún apunte de la unidad.
- **(b) Intuición geométrica de la cota $p(1-p)\le 1/4$**: el docente explica
  que $p(1-p)$ es una parábola con raíces en $0$ y $1$, así que su eje de
  simetría (y máximo) está en $p=0.5$, donde vale $1/4$ [37:37]–[38:07]. El
  [[formulario-inferencia]] ya usa esta cota pero sin la justificación
  geométrica.
- **(c) Advertencias del docente**, ver sección dedicada abajo.
- **(d) Énfasis: identificar el escenario correcto pesa más que la cuenta en
  sí.** El docente arma un árbol de decisión completo (media/proporción →
  normal/no normal → desvío conocido/desconocido → $n$ grande/chico) y dice
  explícitamente que **lo más importante para el parcial es reconocer en cuál
  escenario se está**, no memorizar la fórmula [25:44]–[26:20]. El
  [[formulario-inferencia]] tiene un árbol de decisión textual equivalente
  pero sin el escenario de la varianza con ji-cuadrado.

## Ejercicio resuelto en clase

### 1) IC para la media, desvío desconocido (t de Student) — [07:33]

**Enunciado:** Agustina toma una muestra de $n=10$ personas y observa
$\overline x_{\text{obs}}=44.966$ y $s_{\text{obs}}=10.5634$. Hallar el
$IC_{95\%}(\mu)$.

**Planteo.** Variables normales, $\sigma$ desconocido, $n$ chico $\Rightarrow$
caso t de Student con $n-1=9$ grados de libertad
(ver [[intervalos-de-confianza]], Caso 3):
$$IC_\gamma(\mu)=\left[\overline x_{\text{obs}} - t_{9;0.975}\cdot\frac{s_{\text{obs}}}{\sqrt{10}}\;;\;\overline x_{\text{obs}} + t_{9;0.975}\cdot\frac{s_{\text{obs}}}{\sqrt{10}}\right].$$

**Cálculo.** De la tabla, $t_{9;0.975}=2.2622$ (fila $n=9$ grados de libertad,
columna $0.975$):
$$IC_{95\%}(\mu)=\left[44.966 - 2.2622\cdot\frac{10.5634}{\sqrt{10}}\;;\;44.966 + 2.2622\cdot\frac{10.5634}{\sqrt{10}}\right].$$

**Resultado.** $\boxed{IC_{95\%}(\mu) = [37.4092;\; 52.5228]}$.

### 2) IC para la varianza, variables normales (ji-cuadrado) — [15:28]–[17:16]

**Enunciado:** con la misma muestra de $n=10$ y $s_{\text{obs}}=10.5634$,
hallar el $IC_{95\%}(\sigma^2)$.

**Planteo.** Si $X_i\sim\mathcal N(\mu,\sigma)$, entonces
$\frac{(n-1)S_n^2}{\sigma^2}\sim\chi^2_{n-1}$
(ver [[distribucion-ji-cuadrado]]). A diferencia de la normal y la t, la
ji-cuadrado **no es simétrica**, así que los dos cuantiles usados no son
opuestos entre sí. Partiendo de
$$P\!\left(\chi^2_{n-1;\frac{1-\gamma}{2}} \le \frac{(n-1)S^2}{\sigma^2} \le \chi^2_{n-1;\frac{1+\gamma}{2}}\right)=\gamma,$$
se invierten las tres fracciones (función decreciente $\Rightarrow$ se dan
vuelta las desigualdades) y se despeja $\sigma^2$:
$$P\!\left(\frac{(n-1)S^2}{\chi^2_{n-1;\frac{1+\gamma}{2}}} \le \sigma^2 \le \frac{(n-1)S^2}{\chi^2_{n-1;\frac{1-\gamma}{2}}}\right)=\gamma
\;\Longrightarrow\;
IC_\gamma(\sigma^2)=\left[\frac{(n-1)S^2}{\chi^2_{n-1;\frac{1+\gamma}{2}}}\;;\;\frac{(n-1)S^2}{\chi^2_{n-1;\frac{1-\gamma}{2}}}\right].$$

**Cálculo.** Con $n=10$, $\gamma=0.95$: $\chi^2_{9;0.975}=19.0228$ y
$\chi^2_{9;0.025}=2.7004$:
$$IC_{95\%}(\sigma^2)=\left[\frac{9\cdot 10.5634^2}{19.0228}\;;\;\frac{9\cdot 10.5634^2}{2.7004}\right].$$

**Resultado.** $\boxed{IC_{95\%}(\sigma^2) = [52.7934;\; 371.9007]}$.

> Nota del docente: con $n$ chico esta cuenta usando la t de Student en vez de
> la ji-cuadrado "cubre" el 100% de las simulaciones, pero **está mal
> formulada** — el intervalo queda sobreestimado (demasiado amplio) porque no
> se basa en la distribución real del estadístico. Ver advertencias abajo.

### 3) Tamaño muestral, media con desvío conocido — [29:02]

**Enunciado:** Agustina tiene $\sigma=10$ (conocido) y quiere un margen de
error $\Delta=0.5$ con $\gamma=0.95$. ¿Cuántas personas debe entrevistar?

**Planteo.** $\Delta=z_{0.975}\cdot\frac{\sigma}{\sqrt n}$, se despeja $n$:
$$0.5 \ge 1.96\cdot\frac{10}{\sqrt n} \;\Longrightarrow\; n \ge \left(1.96\cdot\frac{10}{0.5}\right)^2 = 1536.5835.$$

**Resultado.** Como $n$ debe ser entero y el error tiene que ser **menor o
igual** al pedido (no exactamente igual), se redondea **para arriba**:
$\boxed{n=1537}$ personas.

### 4) Tamaño muestral, media con desvío desconocido — técnica de la muestra piloto — [31:36]–[36:02]

**Enunciado:** Agustina quiere el mismo margen de error ($\Delta=0.5$,
$\gamma=0.95$) pero **no conoce $\sigma$**. Antes tomó una muestra de $n=100$
personas y observó $s_{\text{obs}}=10.5634$.

**Planteo.** El problema es que la fórmula de tamaño muestral necesita el
desvío *antes* de tomar la nueva muestra, y con $\sigma$ desconocido no hay
forma exacta de conseguirlo (aparecería $n$ tanto fuera como, indirectamente,
dentro de $S$). La solución práctica (que el docente llama explícitamente
"licencia poética", un razonamiento válido pero no elegante): usar el $s$ de
la muestra de $n=100$ ya disponible como estimación confiable de $\sigma$, ya
que por ley de los grandes números el desvío de una muestra razonablemente
grande ya debería parecerse al desvío poblacional real — y este, a su vez, al
desvío de la muestra nueva y más grande. Con esa cadena de aproximaciones se
reemplaza $\sigma\approx s_{\text{obs}}=10.5634$ en la fórmula de tamaño
muestral:
$$0.5 \ge 1.96\cdot\frac{10.5634}{\sqrt n} \;\Longrightarrow\; n \ge \left(1.96\cdot\frac{10.5634}{0.5}\right)^2 = 1714.6168.$$

**Resultado.** $\boxed{n=1715}$ personas.

**Verificación:** si la nueva muestra de $1715$ personas diera, por ejemplo,
$s_{\text{obs}}=9.2945$, el margen de error real sería
$\Delta = 1.96\cdot\frac{9.2945}{\sqrt{1715}} = 0.4399 \le 0.5$: la técnica
funcionó, el error real quedó por debajo del objetivo.

### 5) Tamaño muestral, proporción — cota conservadora vs. muestra piloto — [36:04]–[41:07]

**Enunciado:** Agustina quiere un margen de error del $1\%$ para la
proporción de aprobados, con $\gamma=0.95$.

**Planteo (cota conservadora, sin información previa).** Como
$0\le\hat p\le 1$, el producto $\hat p(1-\hat p)$ es una parábola con raíces
en $0$ y $1$ y máximo en $\hat p=0.5$, donde vale $1/4$. Usando esa cota
(ver [[formulario-inferencia]]):
$$\Delta = z_{0.975}\sqrt{\frac{\hat p(1-\hat p)}{n}} \le z_{0.975}\sqrt{\frac{1/4}{n}} \le 0.01
\;\Longrightarrow\; n \ge z_{0.975}^2\cdot\frac{1/4}{0.01^2} = 9603.6471.$$

**Resultado (conservador).** $\boxed{n=9604}$ personas.

**Planteo (con muestra piloto).** Con la misma lógica del ejercicio anterior,
si ya se tomó una muestra de $n=100$ con proporción observada
$p_{\text{obs}}=0.7$, se usa ese valor en vez de la cota $1/4$:
$$\Delta \approx z_{0.975}\sqrt{\frac{0.7\cdot 0.3}{n}} \le 0.01
\;\Longrightarrow\; n \ge z_{0.975}^2\cdot\frac{0.7\cdot 0.3}{0.01^2} = 8067.0635.$$

**Resultado (con muestra piloto).** $\boxed{n=8068}$ personas — un alivio
frente a las $9604$ de la cota conservadora, porque $0.7\cdot 0.3=0.21 < 1/4$.

## Advertencias del docente

- **[02:00]–[02:36]** No se puede simplemente reemplazar $\sigma$ por $S_n$ en
  el pivote normal y seguir usando cuantiles normales: $S_n$ es una variable
  aleatoria (distinta en cada muestra), así que el cociente deja de ser
  normal. Es un error frecuente confundir "puedo calcular $S_n$ después de la
  muestra" con "el pivote sigue siendo normal".
- **[10:00]–[10:21]** Usar cuantiles normales en vez de t-Student cuando el
  desvío es desconocido y $n$ es chico da intervalos más angostos, lo cual
  *parece* deseable pero en realidad **no cubre** con la probabilidad
  declarada (en el ejemplo, 93% de cobertura real contra el 95% buscado).
- **[17:47]–[19:43]** Advertencia fuerte: usar cuantiles de la t-Student (en
  vez de ji-cuadrado) para el IC de la **varianza** da una cuenta que cubre el
  100% en la simulación, pero **está mal formulada probabilísticamente**. El
  docente explica que esa aparente "precisión" es frágil: si el pivote
  tuviera aunque sea un pequeño sesgo, la cobertura podría desplomarse de 100%
  a 0% muy rápido, porque los cuantiles usados no corresponden a la
  distribución real del estadístico.
- **[23:25]–[23:38]** Detalle práctico de tabla: los grados de libertad de la
  tabla de t-Student suelen listarse solo hasta $100$, porque a partir de ahí
  la diferencia con la normal ya no importa — si $n$ es mucho más grande y no
  aparece en la tabla, conviene usar directamente los cuantiles normales.
- **[25:44]–[26:03]** Advertencia explícita "para el parcialito": construir un
  intervalo de proporción con la fórmula de la media (o viceversa) es señal de
  no haber entendido el tema; lo mismo pasa si se usa la t-Student cuando
  correspondía la normal, o viceversa. Identificar el escenario correcto es lo
  que más se evalúa.
- **[29:39]–[30:52]** Sobre el redondeo del tamaño muestral: hay una intuición
  extendida de que siempre hay que redondear $n$ hacia arriba, "y es
  mentira" — depende de si la cantidad que se está acotando es un error que se
  quiere minimizar (ahí sí conviene el mayor o igual, redondeando para arriba)
  o de otra relación con signo distinto. Hay que seguir la lógica del
  problema, no aplicar una regla mecánica.

## Páginas del wiki que toca

- [[intervalos-de-confianza]]
- [[distribucion-t-de-student]]
- [[distribucion-ji-cuadrado]]
- [[varianza-muestral]]
- [[estimacion-puntual]]
- [[formulario-inferencia]]
- [[inferencia-estadistica]]
