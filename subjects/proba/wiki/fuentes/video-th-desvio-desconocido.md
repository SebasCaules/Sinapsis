---
titulo: "Video — TH (Desvío desconocido)"
resumen: "Clase en video de Lucio Pantazis (unidad 9) sobre la prueba de hipótesis para la media con desvío desconocido, con el estadístico Z por TCL si n es grande y la t de Student si n es chico, más el árbol completo de escenarios de la unidad."
tipo: fuente
formato: video
unidad: 9
url: "https://youtu.be/XZz1n38iK4Q"
duracion: "26:31"
docente: Lucio Pantazis
ingerido: 2026-09-03
---

# Video — TH (Desvío desconocido)

**Qué es:** última clase de la materia; retoma el ejemplo de Ricardo y las cajas
de tornillos (ya usado con $\sigma$ conocido) para desarrollar la prueba de
hipótesis para la media cuando el desvío poblacional $\sigma$ es **desconocido**,
con TCL/$Z$ (n grande) y $t$ de Student (n chico).
**Cubre:** estadístico $Z$ con $S$ en TCL, valores críticos y error tipo II cuando
$\sigma$ es desconocido, valor p, estadístico $T$ con $n$ chico, acotamiento del
valor p con tabla de cuantiles $t$, y el árbol completo de identificación de
escenarios de prueba de hipótesis.
**Guía asociada:** Guía 9

## Recorrido de la clase

| Timestamp | Tema |
|---|---|
| [00:00] | Apertura: última clase de la materia. |
| [00:13] | Retoma el ejemplo de Ricardo (cajas de tornillos, $\mu_0=350$, $n=50$): ahora desconfía también del desvío, no solo de la media. |
| [00:58]–[02:47] | Motivación conceptual: casi todas las cuentas de una prueba de hipótesis se hacen **antes** de tomar la muestra, y $S$ solo se conoce **después** — por eso no alcanza con "reemplazar $\sigma$ por $S$" en las fórmulas ya vistas. |
| [03:03] | Valores críticos: no se puede fijar $\bar x_c$ en unidades originales; se trabaja directamente con el estadístico estandarizado $Z=\dfrac{\bar X_n-\mu_0}{S/\sqrt n}$. |
| [07:21] | Error tipo II: tampoco se puede calcular antes de la muestra porque depende de $S$; se menciona la **prueba piloto** como paliativo. |
| [10:26] | El valor p no cambia conceptualmente: sigue calculándose **después** de tomar la muestra. |
| [11:22] | Repaso en fórmulas de las tres colas con $Z$ (TCL, $\sigma$ desconocida). |
| [13:50] | Tamaños muestrales pequeños: retoma el mismo ejemplo con $n=10$ (variables normales) → estadístico $T=\dfrac{\bar X_n-\mu}{S/\sqrt n}\sim t_{n-1}$. |
| [17:28]–[20:29] | Ejercicio numérico completo con $T$ de Student: $\bar x_{\text{obs}}=344$, $s_{\text{obs}}=12$, y técnica para **acotar el valor p** cuando no está tabulado exactamente. |
| [20:36] | Repaso en fórmulas de las tres colas con $T$ de Student. |
| [22:01]–[22:56] | Advertencia sobre no memorizar "$1-\alpha$" vs. "$1-\alpha/2$" sin pensar el reparto de área en cada cola. |
| [23:20]–[26:14] | "Identificación de escenarios": árbol completo de decisión (media/proporción, variables normales/no normales, $n$ grande/chico) y mención de extensiones para proporción con $n$ chico (binomial, hipergeométrica, geométrica). |
| [26:29] | Cierre de la clase y de la materia. |

## Qué aporta sobre el apunte

- **(a) Ejemplo resuelto paso a paso** que conecta la prueba con $Z$ ($n=50$) y con
  $T$ ($n=10$) sobre el **mismo caso** (Ricardo/tornillos, $\mu_0=350$), algo que
  no está en [[apunte-media-desvio-desconocido]] (que usa un ejemplo distinto, el
  de las lámparas). Se reproduce completo abajo.
- **(a) Técnica nueva:** cómo acotar el valor p cuando el estadístico observado no
  cae en un cuantil tabulado exacto de la $t$ de Student — se ubica entre dos
  cuantiles conocidos de la tabla y se acota el valor p entre los dos niveles de
  significación correspondientes. No está desarrollada en
  [[valor-p|la página de valor p]] (cuyo único ejercicio resuelto tiene un
  $t_{\text{obs}}$ que cae claramente fuera de rango, sin necesidad de acotar).
- **(b) Intuición:** por qué no alcanza con "cambiar $\sigma$ por $S$" en las
  fórmulas de la unidad anterior — la clave conceptual es que **casi todo el
  diseño de la prueba se hace antes de la muestra**, y $S$ solo se conoce
  después. Esto ya está señalado como advertencia puntual en
  [[apunte-media-desvio-desconocido]], pero aquí es el hilo conductor de toda la
  clase (repetido para $Z$, para el error tipo II y para $T$).
- **(c) Advertencia del docente [22:01]:** no aprender de memoria si va
  "$1-\alpha$" o "$1-\alpha/2$" en la fórmula del cuantil crítico — hay que pensar
  cuánta probabilidad de error se reparte a cada lado según el tipo de cola.
  Marcado explícitamente como fuente frecuente de errores.
- **(d) Énfasis:** el docente aclara que, en la práctica, el escenario "variables
  no normales o desvío desconocido con $n$ chico" es el que más aparece en la
  vida real, aunque en la materia se cubre menos por ser más complejo — un
  criterio de importancia relativa entre los casos del árbol de decisión.
- **(d) Mención (fuera de programa estricto) [24:47]:** el docente comenta que
  existe al menos un ejercicio de parcial que usa una **hipergeométrica** para
  probar una proporción con $n$ chico (extracción sin reposición de un lote),
  como generalización de la idea de "acotar" el valor p con una distribución
  discreta en vez de recurrir a $Z$ o $T$.

## Ejercicio resuelto en clase

**Arranca en [00:13].** Ricardo evalúa si la cantidad promedio de tornillos por
caja es **menor** a la esperada. Plantea
$$ H_0:\mu=350 \qquad H_1:\mu<350. $$

### Parte 1 — $n=50$ cajas (TCL, $\sigma$ desconocido)

**Planteo [00:13]–[00:58].** Revisa $n=50$ cajas y calcula $\bar X_{50}$. Antes
(con $\sigma$ conocido) se trabajaba con
$\bar X_{50}\sim N\!\left(\mu,\ \sigma/\sqrt{50}\right)$. Ahora Ricardo también
desconfía del desvío poblacional $\sigma$, así que lo estima con el desvío
muestral $S$. Como $n=50$ es "suficientemente grande" por el
[[teorema-central-del-limite|TCL]], $S$ es numéricamente similar a $\sigma$, y
$$ \frac{\bar X_{50}-\mu}{\sigma/\sqrt{50}} \overset{\text{aprox}}{\sim} N(0,1) \quad\Longrightarrow\quad \frac{\bar X_{50}-\mu}{S/\sqrt{50}} \overset{\text{aprox}}{\sim} N(0,1). $$

**Por qué no hay un valor crítico en unidades originales [03:03].** Antes se
podía decir "rechazo si $\bar X_{50}<\bar x_c$" con
$\bar x_c = 350 - z_{0.95}\cdot\sigma/\sqrt{50}$. Ahora eso no sirve, porque
$\bar x_c = 350 - z_{0.95}\cdot S/\sqrt{50}$ depende de $S$, que **todavía no se
conoce antes de tomar la muestra**. Por eso se usa directamente el estadístico
estandarizado
$$ Z=\frac{\bar X_n-\mu_0}{S/\sqrt n}, $$
que ya "absorbe" el desvío desconocido: si el promedio observado es chico
comparado con la variabilidad del proceso, $Z$ da chico, sin necesidad de
conocer $S$ de antemano.

**Regla de decisión [06:41]–[07:04].** Con $0.05=P(\text{Rechazar }H_0\mid H_0\text{ cierta})=P\!\left(Z\le -z_{0.95}\ \middle|\ \mu=350\right)$, Ricardo puede fijar, **antes** de tomar la muestra:
$$ \text{Si } Z=\frac{\bar X_n-350}{S/\sqrt{50}} < -z_{0.95} \Rightarrow \text{Rechaza } H_0, \qquad \text{Si } Z\ge -z_{0.95} \Rightarrow \text{Acepta } H_0. $$

**Error tipo II [07:21]–[10:05].** Análogamente, $\beta(\mu_1)$ debería
calcularse antes de la muestra, pero su fórmula
$$ \beta(\mu_1) \overset{\text{TCL}}{\approx} 1-\Phi\!\left(-z_{0.95}+\frac{350-\mu_1}{S/\sqrt{50}}\right) $$
también depende de $S$, desconocido de antemano — este cálculo **no se puede
hacer**. El docente comenta que una salida parcial es usar el desvío muestral de
una **muestra piloto** más chica, tomado como si fuera conocido de antemano.

**Valor p [10:26]–[10:58].** No cambia conceptualmente respecto del caso $\sigma$
conocida, porque se calcula **después** de tomar la muestra (cuando $S$ ya se
conoce). Si se observa $\bar x_{\text{obs}}$:
$$ \text{valor p}=P\!\left(\bar X_{50}\le \bar x_{\text{obs}}\mid H_0\text{ cierta}\right)\approx \Phi\!\left(\frac{\bar x_{\text{obs}}-350}{S/\sqrt{50}}\right). $$

### Parte 2 — $n=10$ cajas ($T$ de Student)

**Planteo [13:50].** Ahora Ricardo solo revisa $n=10$ cajas — muestra chica, ya
no vale el TCL. Si las $X_i$ son (al menos aproximadamente) normales,
$$ T=\frac{\bar X_n-\mu}{S/\sqrt n}\sim t_{n-1}, \qquad\text{y suponiendo } H_0 \text{ cierta: } \quad T=\frac{\bar X_{10}-350}{S/\sqrt{10}}\sim t_9. $$

**Valor crítico [15:42]–[16:32].** Se rechaza si el promedio estandarizado es
demasiado chico: $T<t_c$, con
$$ 0.05=P\!\left(\frac{\bar X_{10}-350}{S/\sqrt{10}}\le t_c\ \middle|\ \mu=350\right) \;\Rightarrow\; t_c=-t_{9,\,0.95}=-1.8331. $$

**Datos observados [17:59]–[18:20]:** se observa $\bar x_{\text{obs}}=344$ y
desvío muestral $s_{\text{obs}}=12$. El estadístico observado es
$$ t_{\text{obs}}=\frac{344-350}{12/\sqrt{10}}=\frac{-6}{3.795}\approx -1.5811. $$

**Decisión por valor crítico [18:20]–[18:58].** Como
$t_{\text{obs}}=-1.5811 > -1.8331=t_c$, el estadístico **no** cae en la región de
rechazo: se **acepta $H_0$**.

**Acotando el valor p con la tabla [19:03]–[20:29].** El valor p exacto sería
$$ \text{valor p}=P\!\left(T\le t_{\text{obs}}\mid H_0\text{ cierta}\right)=F_{t_9}(t_{\text{obs}}), $$
pero la tabla de cuantiles de $t_9$ solo trae algunos valores discretos:

| $\delta$ | 0.8 | 0.9 | 0.95 | 0.975 | 0.99 | 0.995 |
|---|---|---|---|---|---|---|
| $t_{9,\delta}$ | 0.8834 | 1.3830 | 1.8331 | 2.2622 | 2.8214 | 3.2498 |

Como $t_{\text{obs}}=-1.5811$ queda **entre** $-t_{9,0.95}=-1.8331$ y
$-t_{9,0.9}=-1.3830$ (es decir, $-1.8331 \le t_{\text{obs}} \le -1.3830$), y estos
dos cuantiles dejan $5\%$ y $10\%$ de área a su izquierda respectivamente, se
puede concluir sin calculadora ni software:
$$ 0.05 \le \text{valor p} \le 0.1. $$

**Resultado.** Como el nivel de significación es $\alpha=0.05$ y valor p
$\ge 0.05$, la conclusión coincide con la del valor crítico: **no se rechaza
$H_0$** (Ricardo no tiene evidencia suficiente, con $n=10$, de que el promedio de
tornillos por caja sea menor a $350$).

## Advertencias del docente

- **[00:58]–[02:47]** Casi todas las cuentas de una prueba de hipótesis (región de
  rechazo, error tipo II, tamaño muestral) se hacen **antes** de tomar la
  muestra; cuando el desvío es desconocido, esas cuentas "no tienen sentido" si
  dependen de $S$, porque $S$ solo se conoce después de muestrear. Se repite
  como criterio central para no confundirse en toda la unidad, y coincide con la
  advertencia ya registrada en [[apunte-media-desvio-desconocido]].
- **[10:07]–[10:20]** El docente aclara que las fórmulas de la unidad son
  "mecánicas" y fáciles de aprender **mal** si no se entiende el concepto detrás;
  recomienda pensar el planteo en vez de memorizar.
- **[13:45]** Sobre la fórmula del valor p bilateral (con el factor 2): "no les
  recomiendo que se la acuerden [de memoria]. Es más fácil pensarlo realmente."
- **[22:01]–[22:56]** Marca explícitamente como error frecuente escribir
  "$1-\alpha$" donde corresponde "$1-\alpha/2$" (o viceversa) sin pensar en cómo
  se reparte la probabilidad de error entre las colas — "es una forma muy fácil
  de equivocarse".
- **[26:01]** Sobre las extensiones no vistas en el curso (proporción con $n$
  chico vía binomial/hipergeométrica/geométrica): "tampoco es necesario" para la
  materia, se menciona solo para mostrar que el tema sigue mucho más allá de lo
  que se cubre.

## Páginas del wiki que toca

- [[prueba-de-hipotesis-para-la-media]]
- [[error-tipo-i-y-tipo-ii]]
- [[valor-p]]
- [[estadistico-de-prueba]]
- [[reconocer-prueba-de-hipotesis]]
- [[formulario-pruebas-de-hipotesis]]
- [[prueba-de-hipotesis]]
- [[prueba-de-hipotesis-para-la-proporcion]]
- [[diseno-de-prueba-tamano-muestral]]
