---
titulo: Ejercicios de parcial resueltos (estadística)
resumen: "Banco de ejercicios de parcial y final de inferencia resueltos paso a paso: máxima verosimilitud, intervalos de confianza, pruebas de hipótesis y descriptiva, con énfasis en elegir el estadístico correcto y evitar los errores conceptuales típicos."
tipo: tecnica
unidad: eval
orden: 2
tags: [parcial, ejercicios, estadistica, inferencia]
fuentes: ["[[evaluaciones]]"]
actualizado: 2026-06-06
---

# Ejercicios de parcial resueltos (estadística)

**En breve.** Banco de ejercicios de parcial/final de inferencia (EMV, IC, test,
descriptiva) resueltos paso a paso: el foco está en **elegir el estadístico
correcto** ($z$ vs $t$, una cola vs dos) y en los errores conceptuales típicos
que la cátedra marca, no en los números.

Ejercicios **resueltos paso a paso** de la parte de estadística e inferencia,
sacados de los PDFs con resolución de [[evaluaciones]]: estimación de máxima
verosimilitud, intervalos de confianza, test de hipótesis (valor crítico, error
tipo II, p-valor) y descriptiva. La parte de **probabilidad y procesos** está en
[[ejercicios-de-parcial-resueltos]].

---

## Ej. 1 — Estimador de máxima verosimilitud (exponencial)

**Fuente:** `2025_12_05_Final_..._TemaA_RES.pdf`, Ej. 1 (toses).

**Enunciado.** Los tiempos entre toses son exponenciales i.i.d. de parámetro
$\lambda$ desconocido. Se miden 10 tiempos. (a) Hallar el EMV de $\lambda$ y
evaluarlo con los datos. (b) Calcular la asimetría y el histograma.

**Intuición — qué busca el EMV.** Entre todos los valores posibles de $\lambda$,
el de máxima verosimilitud es el que hace que **los datos observados sean lo más
probable posible**. La verosimilitud $L$ es justo "qué tan plausible es esta
muestra si el parámetro fuera $\lambda$", y se maximiza. El $\ln$ se aplica solo
porque convierte el producto en suma (más fácil de derivar) sin mover el máximo.

**Planteo (a) — método EMV.**
1. **Verosimilitud** (las $X_i$ son i.i.d. continuas, así que se multiplican las
   densidades):
$$ L(x_1,\dots,x_{10};\lambda) = \prod_{i=1}^{10} \lambda e^{-\lambda x_i}. $$
2. **Log-verosimilitud** (el $\ln$ es creciente, no cambia el argmax):
$$ \ln L = 10\ln\lambda - \lambda\sum_{i=1}^{10} x_i. $$
3. **Punto crítico**: $\frac{\partial}{\partial\lambda}\ln L = \frac{10}{\lambda}
   - \sum x_i = 0 \Rightarrow$
$$ \boxed{\hat\lambda_{MV} = \frac{10}{\sum_{i=1}^{10} x_i} = \frac{1}{\bar X}.} $$
Con $\sum x_i = 108.9$: $\hat\lambda_{MV} = 10/108.9 \approx 0.0918$.

> Distinción **pre-muestra / post-muestra**: el estimador como v.a. es
> $\hat\lambda = 1/\bar X$ (pre-muestra); el **número** $0.0918$ es la estimación
> post-muestra.

**(b) Coherencia.** Con $\bar x = \tfrac{108.9}{10} = 10.89$ y
$s = \sqrt{\tfrac{1}{n-1}\sum(x_i-\bar x)^2} = \sqrt{636.9755/9} \approx 8.4125$, la
asimetría muestral es
$$ \gamma = \frac{\tfrac1n\sum_{i=1}^{10}(x_i-\bar x)^3}{s^3} = 0.2396 > 0 $$
(asimetría positiva, a derecha) y el histograma —con intervalos de 5 min desde 0—
confirma cola larga a la derecha, coherente con que una exponencial es asimétrica
positiva. Ver [[estimacion-puntual]], [[asimetria-y-curtosis]], [[distribucion-exponencial]], [[promedio-muestral]].

> El EMV de la **Poisson** se resuelve idéntico (final 15/12 Ej. 1):
> $\hat\lambda_{MV} = \frac{1}{n}\sum k_i = \bar X$, derivando
> $\ln L = -n\lambda + \ln\lambda\sum k_i - \sum\ln(k_i!)$.

---

## Ej. 2 — Intervalo de confianza para la media (TCL, σ desconocido)

**Fuente:** `Resolucion_Parcialito_TP8y9_ComB.pdf`, Ej. 1.

**Enunciado.** Un profesor estima el tiempo medio $\mu$ que demoran sus alumnos
con un IC del 88%. Toma una muestra de $n$ alumnos, observa media $\bar x$ y
desvío $s$. Calcular el **límite superior** del intervalo.

**Planteo.** Las $X_i$ son i.i.d. con media $\mu$ y desvío $\sigma$ desconocidos.
Por TCL,
$$ \bar X_n \overset{(a)}{\sim} \mathcal{N}\!\left(\mu, \tfrac{\sigma}{\sqrt n}\right) \Rightarrow \frac{\bar X_n - \mu}{\sigma/\sqrt n} \overset{(a)}{\sim} \mathcal{N}(0,1). $$
Como $\sigma$ es desconocido, por [[ley-de-grandes-numeros|LGN]] se reemplaza $\sigma \approx s$ (válido para
$n$ grande; las diferencias son despreciables porque se divide por $\sqrt n$).

**Intuición — por qué aquí alcanza con $z$ y no hace falta la $t$.** Con $n$
grande, el desvío muestral $s$ ya estima muy bien a $\sigma$ (LGN), así que tratar
$s$ como si fuera el verdadero $\sigma$ casi no agrega error: por eso se usa la
normal. Cuando $n$ es chico esa aproximación falla y hay que pagar el "ensanche"
de la [[distribucion-t-de-student|t de Student]] (Ej. 3 y 4).

Para el **88% central** quedan $6\%$ en cada cola, así que el cuantil es
$z_{0.94}$. El intervalo es
$$ \bar X_n \pm z_{0.94}\,\frac{s}{\sqrt n}, $$
y el **límite superior** pedido:
$$ \boxed{b = \bar X_n + z_{0.94}\,\frac{s}{\sqrt n}.} $$

Ver [[intervalos-de-confianza]], [[teorema-central-del-limite]].

---

## Ej. 3 — IC con t-Student y tamaño de muestra por prueba y error

**Fuente:** `09 - Segundo Parcial.pdf`, Ej. 3 (absorción de pañales).

**Enunciado.** Absorción $\sim\mathcal{N}(\mu,\sigma)$, ambos desconocidos. (a)
Error $\le 10$ ml con confianza 90%, sabiendo $s\le 25$ ml: menor $n$ posible.
(b) Con $n=20$, $\bar x=500$, $s=15$: IC al 90%.

**Planteo (a) — $n$ aparece a ambos lados.** Como $\sigma$ es desconocido y las
$X_i$ son normales, se usa **t-Student**:
$$ \Delta = t_{0.95,\,n-1}\,\frac{s}{\sqrt n} \le 10 \Rightarrow n \ge \left(\frac{t_{0.95,\,n-1}\,s}{10}\right)^2. $$
El problema: $t_{0.95,n-1}$ **depende de $n$**. Estrategia:
1. **Estimación inicial** reemplazando $t$ por $z$: $n \ge (z_{0.95}\cdot 2.5)^2
   = 16.91 \Rightarrow$ probar $n=17$.
2. **Refinar por prueba y error**: con $n=17$, $\Delta=10.59>10$ (insuficiente);
   $n=18 \Rightarrow 10.25$ (aún no); $n=19 \Rightarrow 9.95<10$ ✓.
3. **Mínimo $n=19$.**

**Planteo (b).** Con $n=20$: $\Delta = t_{0.95,19}\,\frac{s}{\sqrt{20}} =
1.7291\cdot\frac{15}{\sqrt{20}} = 5.80$. IC $= 500 \pm 5.80 = (494.20, 505.80)$.

> **IC de proporción (2do parcial 2024 Ej. 2):** $\hat p \pm z_{1-\alpha/2}
> \sqrt{\hat p(1-\hat p)/n}$. Si no se conoce $\hat p$, se acota
> $\hat p(1-\hat p) \le 1/4$ para el tamaño de muestra:
> $n \ge \left(\frac{z_{1-\alpha/2}}{2\Delta}\right)^2$.

Ver [[intervalos-de-confianza]], [[distribucion-t-de-student]].

---

## Ej. 4 — Valor crítico de un test (cola izquierda, t-Student)

**Fuente:** `Resolucion_Parcialito_TP8y9_ComB.pdf`, Ej. 2.

**Enunciado.** Un profesor quiere ver si una nueva metodología **reduce** el
tiempo medio de corrección $\mu$. Corrige $n=10$ exámenes, tiempo normal,
$\sigma$ desconocido, $\alpha = 10\%$. Calcular el **valor crítico**.

**Planteo.** Hipótesis (la sospecha "disminuye" va en $H_1$):
$$ H_0: \mu \ge \mu_0, \qquad H_1: \mu < \mu_0. $$
Como $\sigma$ desconocido y $n$ chico → estadístico
$T = \frac{\bar X_n - \mu_0}{s/\sqrt n} \sim t_{n-1}$. Se rechaza $H_0$ si $T$ es
chico. Controlando el error tipo I:
$$ P(T < t_c \mid \mu=\mu_0) = 0.1 \Rightarrow t_c = t_{n-1;0.1} = -t_{n-1;0.9}. $$

> **Error conceptual frecuente (que la resolución marca):** NO es válido tomar
> $x_c = \mu_0 - t_{n-1;0.9}\,\frac{s}{\sqrt n}$ como valor crítico, porque $s$
> se conoce **después** de tomar la muestra y la región de rechazo se fija
> **antes**. El valor crítico debe ser conocido a priori: $t_c = -t_{n-1;0.9}$,
> y se rechaza si $\frac{\bar X_n - \mu_0}{s/\sqrt n} < -t_{n-1;0.9}$.

Ver [[prueba-de-hipotesis]], [[prueba-de-hipotesis-para-la-media]], [[error-tipo-i-y-tipo-ii]], [[distribucion-t-de-student]].

---

## Ej. 5 — Error tipo II y p-valor (test de proporción, dos colas)

**Fuente:** `2025_12_05_Final_..._TemaA_RES.pdf`, Ej. 4 (gripe en la guardia).

**Enunciado.** Históricamente el 25% de las personas en la guardia están
engripadas. Con $n=400$ y $\alpha=6\%$ se testea si el porcentaje cambió. (a)
Error tipo II si el real es $p=18\%$. (b) Con $\hat p_{obs}=29\%$, calcular el
p-valor y concluir.

**Planteo — el test (dos colas).**
$$ H_0: p = 0.25, \qquad H_1: p \ne 0.25. $$
Por TCL, $\hat p \sim \mathcal{N}\!\left(p, \sqrt{p(1-p)/n}\right)$. Como es de
dos colas con $\alpha=0.06$, los valores críticos usan $z_{0.97}\approx 1.8808$ y
$\sqrt{0.25\cdot 0.75/400}\approx 0.02165$:
$$ p_{c_1} = 0.25 - z_{0.97}\sqrt{\tfrac{0.25\cdot 0.75}{400}}\approx 0.2093,
\quad p_{c_2} = 0.25 + z_{0.97}\sqrt{\tfrac{0.25\cdot 0.75}{400}}\approx 0.2907. $$

> ⚠️ Discrepancia con el raw: `2025_12_05_Final_..._TemaA_RES.pdf` Ej. 4 escribe
> $p_{c_2}\approx 0.2407$, valor **aritméticamente imposible** (el crítico superior
> debe ser $>0.25$). El correcto es $0.2907$: es simétrico de $p_{c_1}=0.2093$
> respecto de $0.25$ (ambos a $\pm 0.0407$) y es el que cierra el $\beta=0.0637$ del
> propio raw. El $0.2407$ es un typo (un $9$ leído como $4$).

**(a) Error tipo II** $\beta = P(\text{aceptar } H_0 \mid p=0.18)$. Se evalúa la
probabilidad de caer entre los críticos **bajo la distribución real** $p=0.18$:
$$ \beta(0.18) = \Phi\!\left(\frac{p_{c_2}-0.18}{\sqrt{0.18\cdot 0.82/400}}\right) - \Phi\!\left(\frac{p_{c_1}-0.18}{\sqrt{0.18\cdot 0.82/400}}\right) \approx 0.0637. $$

**(b) p-valor** (dos colas): probabilidad, **bajo $H_0$**, de un resultado tan o
más extremo que lo observado ($|\hat p - 0.25| \ge |0.29-0.25| = 0.04$):
$$ p\text{-valor} = 2\left[1 - \Phi\!\left(\frac{0.04}{\sqrt{0.25\cdot 0.75/400}}\right)\right] = 2\left[1-\Phi(1.8475)\right] \approx 0.0645. $$
Como p-valor $\approx 0.065 > \alpha = 0.06$, **no se rechaza $H_0$** (por poco):
no hay evidencia suficiente de que el porcentaje haya cambiado.

> El final 15/12 Ej. 5 hace lo mismo para una **media** con $\sigma$ conocido:
> usa $z$ en vez de la t y estandariza con $\sigma/\sqrt n$. Mismo esquema de dos
> colas, error tipo II y p-valor.

Ver [[prueba-de-hipotesis]], [[prueba-de-hipotesis-para-la-proporcion]], [[error-tipo-i-y-tipo-ii]], [[valor-p]], [[teorema-central-del-limite]], [[distribucion-normal]].

---

## Ej. 6 — Mediana de datos agrupados (interpolación)

**Fuente:** `Res_Parcialito_TP1y2_ComB.pdf`, Ej. 1.

**Enunciado.** Pacientes por intervalo de edad: $[20,30)\to 5$, $[30,40)\to 15$,
$[40,50)\to k$, $[50,60)\to 10$. Calcular la mediana (con $k$ paramétrico,
$k\ge 35$).

**Planteo.**
1. **Frecuencias acumuladas**: $5,\ 20,\ 20+k,\ 30+k$. Total $n=30+k$.
2. **Datos a acumular** para la mediana (50%): $m = n/2 = 15 + k/2$.
3. **Localizar el intervalo**: como $k\ge 35$, $15+k/2 \ge 32.5$, que cae entre
   20 y $20+k$ ⇒ la mediana está en $[40,50)$.
4. **Interpolar** dentro del intervalo:
$$ \tilde x = \underbrace{40}_{L_i} + \frac{m - F_{ant}}{f_{\text{int}}}\cdot \underbrace{10}_{\text{ancho}} = 40 + \frac{(15+k/2) - 20}{k}\cdot 10 = 45 - \frac{50}{k}. $$

> Mismo método que `04 - Primer Parcial .pdf` Ej. 1, donde la mediana de los
> pesos de recién nacidos cae en $(3.6, 3.8]$ y se interpola:
> $\text{mediana} = \frac{50-44}{62-44}(3.8-3.6) + 3.6 = 3.6667$.

Ver [[tecnica-datos-agrupados-interpolacion]], [[datos-agrupados]], [[medidas-de-tendencia-central]].

---

## Ej. 7 — Cuartiles y boxplot (datos discretos)

**Fuente:** `Resolución_Examen_15_12_TemaA.pdf`, Ej. 1b.

**Enunciado.** Datos de estornudos por hora (12 valores): calcular mediana,
$q_1$, $q_3$ y hacer un boxplot.

**Planteo.**
1. **Ordenar** los datos: $1,1,2,2,2,3,3,4,4,4,5,8$.
2. **Cuartiles** por posición acumulada: $q_1 = 2$ (25%), mediana $= 3$ (50%),
   $q_3 = 4$ (75%). Rango intercuartílico $IQR = q_3 - q_1 = 2$.
3. **Boxplot**: caja de $q_1$ a $q_3$ con la mediana adentro; bigotes hasta
   $q_1 - 1.5\,IQR$ y $q_3 + 1.5\,IQR$. El valor $8$ queda fuera del bigote
   superior ($4 + 1.5\cdot 2 = 7$) ⇒ es un **outlier**.

Ver [[cuartiles-y-percentiles]], [[boxplot]], [[medidas-de-dispersion]].

---

## Ej. 8 — TCL para una proporción + despeje del tamaño muestral

**Fuente:** `2025Q2_Parcial_Resolución.pdf`, Ej. 5 (preguntas de examen).

> Enunciado con parámetro $K$ (dígito del legajo). Fijamos $K=2$ para tener números
> concretos; el método es general.

**Enunciado.** Una pregunta la sabe responder el $\frac{30K+90}{K+2}\%$ de los
alumnos, es decir $p=\frac{30K+90}{100(K+2)}$ (con $K=2$, $p=0.375$). Carlos se
lleva $n=25(K+3)$ exámenes (con $K=2$, $n=125$). (a) $P(\ge 10(K+3)$ correctas$)$.
(b) $P(\ge 34\%$ correctas$)$. (c) **Mínimo nº de exámenes** para que
$P\!\left(\hat p \ge \frac{29K+87}{100(K+2)}\right) > 0.9$ (con $K=2$, umbral
$0.3625$).

**Planteo (a) — conteo: binomial ≈ normal.** $X_n$ = nº de respuestas correctas
$\sim\text{Bi}(n,p)$. Como $n$ es grande, por TCL
$X_n \overset{(a)}{\sim}\mathcal{N}\!\big(np,\ \sqrt{np(1-p)}\big)$. Con **corrección
por continuidad**:
$$ P(X_n\ge 10(K+3)) \approx 1 - \Phi\!\left(\frac{10(K+3)-0.5-np}{\sqrt{np(1-p)}}\right). $$

**Planteo (b) — proporción muestral.** Misma información leída como proporción:
$$ \hat p = \frac{X_n}{n}\overset{(a)}{\sim}\mathcal{N}\!\left(p,\ \sqrt{\tfrac{p(1-p)}{n}}\right)
   \ \Rightarrow\ P(\hat p\ge 0.34) = 1 - \Phi\!\left(\frac{0.34-p}{\sqrt{p(1-p)/n}}\right). $$

**Planteo (c) — despejar $n$ (lo distinto del Ej. 3).** Aquí $n$ es la incógnita y
aparece **solo** dentro de la raíz (no en el cuantil, porque el estadístico es
$\hat p$ y se usa $z$, no $t$), así que se despeja de forma cerrada. Con umbral
$u=\frac{29K+87}{100(K+2)}$ (y $u>p$, cola derecha):
$$ P(\hat p\ge u) = 1-\Phi\!\left(\frac{u-p}{\sqrt{p(1-p)/n}}\right)\ge 0.9
   \ \Rightarrow\ \frac{u-p}{\sqrt{p(1-p)/n}}\le \Phi^{-1}(0.1) = -z_{0.9}. $$
Despejando (y como $u>p$ el numerador es positivo, hay que cuidar el sentido de la
desigualdad al pasar la raíz):
$$ \boxed{\,n \ge \frac{p(1-p)\,\big(\Phi^{-1}(0.1)\big)^2}{(u-p)^2}\,}. $$
Con $K=2$: $p=0.375$, $u=0.3625$, $\big(\Phi^{-1}(0.1)\big)^2=z_{0.9}^2\approx 1.6424$,
$(u-p)^2=(-0.0125)^2$ ⇒ $n\ge 2464$ exámenes.

> **Contraste con el Ej. 3.** Allí el cuantil $t_{0.95,n-1}$ **dependía de $n$**, por
> eso había que iterar por prueba y error. Aquí el estadístico es una proporción
> ($z$ fijo, no $t$), así que el tamaño muestral se despeja de una sola vez.
> Es el mismo esquema de "fijar la confianza/potencia y despejar $n$" que aparece en
> [[diseno-de-prueba-tamano-muestral]].

Ver [[teorema-central-del-limite]], [[intervalos-de-confianza]], [[distribucion-normal]], [[distribucion-binomial]].

---

## Ver también

- [[ejercicios-de-parcial-resueltos|Ejercicios de parcial resueltos (probabilidad)]]
- [[evaluaciones|Catálogo de evaluaciones]]
- [[estimacion-puntual]], [[intervalos-de-confianza]], [[prueba-de-hipotesis]]
- [[inferencia-estadistica|Inferencia estadística]], [[estadistica-descriptiva|Estadística descriptiva]]
- [[reconocer-prueba-de-hipotesis|Cómo reconocer qué test usar]]
