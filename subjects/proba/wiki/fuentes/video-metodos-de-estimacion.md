---
titulo: "Video — Métodos de Estimación"
resumen: "Clase en video de Lucio Pantazis (unidad 8) que desarrolla de punta a punta el método de los momentos y el de máxima verosimilitud, en los casos discreto y continuo y con uno y dos parámetros, y compara los resultados de ambos métodos."
tipo: fuente
formato: video
unidad: 8
url: "https://youtu.be/wDUgPpVgCjk"
duracion: "52:04"
docente: Lucio Pantazis
ingerido: 2026-09-03
---

# Video — Métodos de Estimación

**Qué es:** clase teórica en vivo (slides Beamer + pizarra) donde el docente
desarrolla el **método de los momentos** y la **máxima verosimilitud** con dos
ejemplos completos de punta a punta, en vez de la exposición ya escrita en el
apunte.
**Cubre:** método de los momentos y máxima verosimilitud (caso discreto y
continuo, uno y dos parámetros), comparación entre ambos métodos.
**Guía asociada:** Guía 8.

## Recorrido de la clase

| Timestamp | Tema |
|---|---|
| [00:00] | Motivación: Agustina entrevista personas hasta encontrar la primera que aprueba (muestreo inverso, tamaño de muestra no fijado de antemano) |
| [02:40] | Definición formal del método de los momentos: $k$-ésimo momento $E(X^k)$, lógica vía ley de los grandes números |
| [05:56]–[06:52] | Ejemplo: geométrica, $E(X_i)=1/p$, se despeja $\hat p_M=n/\sum X_i$ |
| [08:46] | Introducción a la máxima verosimilitud: "vero" = verdadero, "similitud" = similar |
| [09:36]–[13:00] | Verosimilitud conjunta para la geométrica; por qué hay que mantener el subíndice $i$ en $X_i$ |
| [13:00]–[16:00] | Por qué conviene el logaritmo de la verosimilitud (convierte producto en suma, más fácil de derivar) |
| [16:56]–[18:03] | Gráfico: verosimilitud y log-verosimilitud se maximizan en el mismo punto |
| [19:17]–[23:14] | Análisis de sesgo del estimador geométrico (binomial negativa, sin fórmula cerrada, casos extremos $p=0$ y $p=1$) |
| [23:17]–[24:10] | Cálculo post-muestra con datos reales: $\hat p = 10/23 = 0.4347826$ |
| [24:17]–[26:06] | Comparación entre métodos: momentos es rápido pero exige i.i.d.; MV es más versátil |
| [26:08]–[34:07] | Distribución de Pareto con $x_0=10$ conocido: MLE de $\alpha$ (caso continuo) |
| [34:42]–[38:23] | Pareto con $x_0=10$ conocido: método de los momentos de $\alpha$, advertencia de validez ($\alpha>1$) |
| [38:23]–[46:16] | Pareto con $x_0$ y $\alpha$ ambos desconocidos: MLE en dos parámetros, argumento gráfico del borde |
| [46:16]–[50:03] | Pareto, dos parámetros, método de los momentos (usa varianza), advertencia de validez ($\alpha>2$) |
| [50:31]–[52:03] | Comparación post-muestra con datos reales: el método de los momentos da un $\hat x_0$ mayor que el mínimo muestral (imposible) |

## Qué aporta sobre el apunte

- **(a) Ejemplos resueltos nuevos.** El apunte ([[teorica-metodo-de-los-momentos]],
  [[teorica-maxima-verosimilitud]]) ya trae los ejemplos de normal, Laplace,
  uniformes y exponencial que están en [[estimacion-puntual]]. Este video agrega
  dos ejemplos completos que no están en el wiki: (1) la
  [[distribucion-geometrica|geométrica]] con **muestreo inverso** (tamaño de
  muestra aleatorio, fijo el número de repeticiones) resuelta por ambos métodos;
  (2) la **distribución de Pareto**, primero con $x_0$ conocido y después con
  $x_0$ y $\alpha$ ambos desconocidos, también por ambos métodos.
- **(b) Intuiciones y visualizaciones que no están en el apunte escrito.**
  - El gráfico de verosimilitud vs. log-verosimilitud (mismo $p$ maximiza
    ambas, aunque las escalas sean muy distintas) — hace visual el argumento de
    "el logaritmo es creciente, así que preserva el argmax" que en el apunte
    queda solo como afirmación.
  - El mapa de calor de la verosimilitud en función de $(x_0,\alpha)$
    (minuto ~44–46): muestra por qué, para $\alpha$ fijo, la verosimilitud
    crece monótonamente a medida que $x_0$ sube hacia el mínimo muestral y cae
    en cuanto lo supera — la justificación gráfica de por qué
    $\hat x_0=\min_i X_i$.
  - El análisis del sesgo del estimador de momentos de la geométrica: como la
    suma no tiene fórmula cerrada, se calcula numéricamente para cada $p$; el
    sesgo es máximo en $p=0.5$ (mucha variabilidad en el número de intentos) y
    tiende a 0 en los extremos $p\to 0$ y $p\to 1$ — una intuición sobre por
    qué el sesgo de un estimador puede depender del propio parámetro.
- **(c) Advertencias del docente.** Ver sección siguiente.
- **(d) Énfasis.** El docente insiste en que la elección de método no es
  automática: «las dos estrategias no siempre dan lo mismo» [37:50] y a veces
  una es directamente inconveniente o inviable — este video es, en sí, un
  refuerzo con ejemplos concretos de la sección
  [[estimacion-puntual#Cómo reconocer cuál usar|Cómo reconocer cuál usar]] que ya
  está en el wiki.

## Ejercicio resuelto en clase

**Enunciado** (video, 26:08–46:16): los puntajes de una población siguen una
distribución de Pareto con parámetro de forma $\alpha>0$ y valor mínimo $x_0$:
$$f_{X_i}(x)=\begin{cases}\dfrac{\alpha\cdot x_0^\alpha}{x^{\alpha+1}} & x>x_0\\[4pt] 0 & \text{caso contrario}\end{cases}$$
Estimar $\alpha$ por máxima verosimilitud, primero asumiendo $x_0=10$ conocido y
después asumiendo que $x_0$ también es desconocido.

### Parte 1 — $x_0=10$ conocido

**Planteo.** Como el parámetro que se busca está en el exponente (no en el
soporte), la verosimilitud es continua en $\alpha$ mientras todos los datos
superen $10$:
$$L(\alpha)=f(X_1,\dots,X_n;\alpha)=\begin{cases}\displaystyle\prod_{i=1}^n \frac{\alpha\cdot 10^\alpha}{X_i^{\alpha+1}} & \text{si }\min\{X_1,\dots,X_n\}>10\\[6pt] 0 & \text{caso contrario}\end{cases}$$
Si algún $X_i\le 10$ la densidad de ese dato es $0$ y anula todo el producto —
por eso se exige $\min_i X_i>10$.

**Cálculo.** Tomando logaritmo (válido solo donde $\min_i X_i>10$):
$$\ln L(\alpha)=n\ln\alpha+n\,\alpha\ln 10-(\alpha+1)\sum_{i=1}^n\ln X_i.$$
Derivando respecto de $\alpha$ e igualando a cero:
$$\frac{d}{d\alpha}\ln L(\alpha)=\frac{n}{\alpha}+n\ln 10-\sum_{i=1}^n\ln X_i=0.$$

**Resultado.**
$$\boxed{\hat\alpha=\frac{n}{\displaystyle\sum_{i=1}^n\ln X_i - n\ln 10}=\frac{n}{\displaystyle\sum_{i=1}^n\ln\!\left(\frac{X_i}{10}\right)}}$$
(el denominador no tiene sentido si algún dato no supera $10$, por eso hace
falta $\min_i X_i>10$).

### Parte 2 — $x_0$ también desconocido

**Planteo.** Ahora la verosimilitud depende de dos parámetros:
$$L(\alpha,x_0)=\begin{cases}\displaystyle\prod_{i=1}^n \frac{\alpha\cdot x_0^\alpha}{X_i^{\alpha+1}} & \text{si }\min\{X_1,\dots,X_n\}>x_0\\[6pt] 0 & \text{caso contrario}\end{cases}$$
A diferencia de $\alpha$, $x_0$ **no es derivable**: la verosimilitud no es
continua en $x_0$ (se trunca en $0$ apenas $x_0$ supera algún dato).

**Argumento del borde (en vez de derivar).** Para un $\alpha$ fijo, mientras
más grande sea $x_0$ (sin superar el mínimo muestral), más grande es
$x_0^\alpha$ en el numerador y por lo tanto más grande la verosimilitud —
crece monótonamente hasta $x_0=\min_i X_i$ y ahí se trunca a $0$. Entonces el
máximo respecto de $x_0$, para cualquier $\alpha$, se alcanza siempre en el
borde:
$$\hat x_0=\min\{X_1,\dots,X_n\}.$$

**Cálculo de $\alpha$.** Con $x_0$ fijado en $\hat x_0$, la cuenta es idéntica
a la Parte 1 reemplazando $10$ por $\hat x_0$:
$$\boxed{\hat\alpha=\frac{n}{\displaystyle\sum_{i=1}^n\ln\!\left(\dfrac{X_i}{\hat x_0}\right)}}$$

**Resultado numérico (post-muestra, $n=10$).** Para una muestra observada
$3.1,\,1.4,\,1.3,\,1.0,\,1.4,\,2.4,\,2.3,\,1.3,\,11.3,\,2.4$ (mínimo $=1$):
$\hat x_0=1$ y $\hat\alpha=1.3628$. Para una segunda muestra (mínimo $=1.2$):
$\hat x_0=1.2$ y $\hat\alpha=2.5833$.

> **Contraste con el método de los momentos.** Con $x_0=10$ conocido, igualando
> $E(X_i)=\dfrac{\alpha\cdot 10}{\alpha-1}$ al promedio muestral se obtiene
> $\hat\alpha=\dfrac{\overline X_n}{\overline X_n-10}$, válido solo si
> $\alpha>1$ (si el $\alpha$ real está entre 0 y 1, este estimador da
> necesariamente $>1$: mal). Con los dos parámetros desconocidos, usando media
> y varianza, se llega a $\hat\alpha=1+\sqrt{1+\overline X_n^2/S^2}$ y
> $\hat x_0=\overline X_n\sqrt{1+\overline X_n^2/S^2}\big/\!\left(1+\sqrt{1+\overline X_n^2/S^2}\right)$,
> válido solo si $\alpha>2$. Sobre las mismas dos muestras, el método de los
> momentos da $\hat x_0=1.6039,\ \hat\alpha=2.3522$ (primera muestra) y
> $\hat x_0=1.3969,\ \hat\alpha=4.0166$ (segunda) — en ambos casos $\hat x_0$
> por momentos queda **por encima del mínimo efectivamente observado** ($1$ y
> $1.2$ respectivamente), lo cual es imposible ($x_0$ tiene que ser menor o
> igual a todos los datos). Por eso, cuando el rango de validez del método de
> los momentos es tan restrictivo ($\alpha>2$), conviene usar máxima
> verosimilitud.

## Advertencias del docente

- El docente aclara que el estimador de MV de la Pareto no tiene sentido si
  alguna $X_i$ queda por debajo de $x_0$ — siempre hay que chequear
  $\min_i X_i > x_0$ antes de aplicar la fórmula. [34:09]
- El método de los momentos requiere que las variables sean i.i.d.; la máxima
  verosimilitud solo requiere conocer la distribución conjunta (ni siquiera
  necesitan ser independientes). [24:17]–[26:06]
- Las dos estrategias **no siempre dan el mismo resultado** — en el ejemplo de
  la geométrica coinciden, pero en el de la Pareto con dos parámetros dan
  estimaciones marcadamente distintas, y el de momentos puede ser directamente
  inconsistente con los datos observados. [50:31]–[52:03]
- El logaritmo de la verosimilitud es una herramienta útil cuando las
  variables son independientes (convierte el producto en suma), pero **no es
  obligatorio usarlo** — a veces hasta complica más la cuenta. [24:17]–[26:06]
- Para la varianza de una Pareto, la fórmula solo vale si $\alpha>2$ (más
  restrictivo que $\alpha>1$ que exige el valor esperado) — por eso el método
  de los momentos con dos parámetros es más frágil que con uno solo.
  [46:16]–[50:03]

## Páginas del wiki que toca

- [[estimacion-puntual]]
- [[inferencia-estadistica]]
- [[teorica-metodo-de-los-momentos]]
- [[teorica-maxima-verosimilitud]]
- [[formulario-inferencia]]
