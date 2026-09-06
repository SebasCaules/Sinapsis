---
titulo: Error tipo I y tipo II
resumen: 'Los dos fallos posibles de una prueba: rechazar $H_0$ siendo cierta (tipo I, probabilidad $\alpha$) o aceptarla siendo falsa (tipo II, probabilidad $\beta$). La potencia es $1-\beta$; bajar ambos a la vez exige aumentar el tamaño de muestra $n$.'
tipo: concepto
unidad: 9
orden: 3
tags: [prueba-de-hipotesis, error, potencia]
fuentes: ["[[tp9-pruebas-de-hipotesis]]", "[[intro-prueba-de-hipotesis-slides]]", "[[apunte-media-nula-igual]]", "[[apunte-media-nula-mayor-igual]]", "[[video-th-desvio-conocido]]", "[[video-th-desvio-desconocido]]"]
actualizado: 2026-09-04
---

# Error tipo I y tipo II

**En breve.** Toda [[prueba-de-hipotesis|prueba de hipótesis]] puede fallar de
dos maneras: rechazar $H_0$ cuando es cierta (tipo I, probabilidad $\alpha$) o
aceptarla cuando es falsa (tipo II, probabilidad $\beta$). Diseñar una prueba es
gestionar el balance entre ambos errores.

**Qué es:** En toda [[prueba-de-hipotesis|prueba de hipótesis]] la decisión
(aceptar o rechazar $H_0$) puede ser incorrecta por azar. Hay dos errores
posibles, según [[tp9-pruebas-de-hipotesis|TP9]]:

| | $H_0$ verdadera | $H_0$ falsa |
|---|---|---|
| **Se acepta $H_0$** | OK | **Error tipo II** |
| **Se rechaza $H_0$** | **Error tipo I** | OK |

- **Error tipo I:** rechazar $H_0$ siendo **verdadera**. Su probabilidad máxima
  admisible es el **nivel de significación** $\alpha$.
- **Error tipo II:** aceptar $H_0$ siendo **falsa**. Su probabilidad se denota
  $\beta$ y depende de **cuán falsa** sea $H_0$ (del valor real del parámetro).

> **Intuición (por qué son asimétricos).** $\alpha$ es **un solo número** que
> fijamos de antemano: bajo $H_0$ el parámetro vale $\theta_0$ y ahí calculamos
> la probabilidad de rechazar. En cambio $\beta$ es **una función**: "$H_0$ falsa"
> abarca infinitos valores de $\theta$ bajo $H_1$, y para cada uno hay un $\beta$
> distinto. Por eso $\alpha$ se controla directamente (cota de diseño) pero $\beta$
> no: solo podemos calcularlo para un $\theta_1$ concreto. En la analogía del
> [[prueba-de-hipotesis|jurado]], el sistema se diseña para que condenar a un
> inocente (tipo I) sea raro, a costa de a veces absolver a un culpable (tipo II).

## Nivel de significación y potencia

- **Nivel de significación** $\alpha$: se fija de antemano (chico, p. ej. 0.05).
  La región crítica se diseña para que $P_{H_0}(\text{rechazar }H_0)\le\alpha$.
- **Potencia** de la prueba $= 1-\beta$: probabilidad de rechazar $H_0$ cuando
  efectivamente es falsa. Cuanto mayor, mejor "detecta" la falsedad.

> [!figura] u9-las-dos-campanas-y-sobre-el-mismo-eje
> Las dos densidades del promedio muestral sobre el mismo eje: $\alpha$ es una cola de la curva de $H_0$ y $\beta$ es la masa de la curva de $H_1$ que cae del lado de la aceptación. Note que bajar $\alpha$ corre la frontera $\bar x_c$ y agranda $\beta$, mientras que subir $n$ angosta las dos campanas y hace caer $\beta$ sin mover $\alpha$ —en la figura $\alpha$ es el control y $\bar x_c$ la salida derivada—: ese margen ganado es el que después permite bajar también $\alpha$.

> Hay que **buscar un balance** entre $\alpha$ y $\beta$
> ([[intro-prueba-de-hipotesis-slides|slides]]): bajar $\alpha$ (región de
> rechazo más chica) tiende a **subir** $\beta$, y viceversa. Para bajar ambos a
> la vez hay que **aumentar el tamaño de muestra $n$**.

## La curva característica (curva OC) y curva de potencia

$\beta$ no es un único número: es una **función** $\beta(\theta_1)$ del valor real
del parámetro bajo $H_1$.

> [!figura] u9-curva-oc-la-forma-de-segun-la-cola
> La curva $\beta(\theta_1)$ cambia de forma según la cola: decreciente, creciente o con máximo en $\theta_0$. Verifique los tres puntos guía —$\beta(\theta_0)=1-\alpha$, $\beta\approx 0.5$ sobre el valor crítico y $\beta\to 0$ al alejarse— y compare varias curvas de distinto $n$.

- **Curva característica de operación (OC):** gráfica de $\beta(\theta_1)$ vs $\theta_1$.
- **Curva de potencia:** gráfica de $1-\beta(\theta_1)$ vs $\theta_1$.

Valores característicos (para la media, [[apunte-media-nula-igual|nula igual]] y
[[apunte-media-nula-mayor-igual|nula mayor o igual]]):

- $\beta(\theta_0)=1-\alpha$ (en el borde de $H_0$).
- $\beta(\text{valor crítico})\approx 0.5$ si la distribución del estadístico es simétrica.
- $\beta\to 0$ cuando $\theta_1$ se aleja "mucho" hacia $H_1$.

### Ejemplo numérico de un punto de la curva OC

Con $n=50$, $\sigma=10$, $\mu_0=350$ y valor crítico $x_c=347.6738$ (prueba de
cola izquierda):
$$ \beta(345)=1-\Phi\!\left(\frac{x_c-345}{\sigma/\sqrt n}\right)=1-\Phi(1.89068)\approx0.0293. $$
Es un punto concreto de la curva OC: el docente lo verbaliza como "solo el
2,9% de las veces no me voy a dar cuenta de que la media real está por debajo"
(fuente: [[video-th-desvio-conocido]], slide de Error tipo II, ~37:22).

## Fórmulas de $\beta$ por tipo de prueba (media, $\sigma$ conocida)

Sea $Z$ el estadístico estandarizado. Según [[tp9-pruebas-de-hipotesis|TP9]]:

- **Dos colas:** $\beta(\mu_1)=\Phi\!\left(z_{1-\alpha/2}+\tfrac{\mu_0-\mu_1}{\sigma/\sqrt n}\right)-\Phi\!\left(-z_{1-\alpha/2}+\tfrac{\mu_0-\mu_1}{\sigma/\sqrt n}\right)$.
- **Cola derecha:** $\beta(\mu_1)=\Phi\!\left(z_{1-\alpha}+\tfrac{\mu_0-\mu_1}{\sigma/\sqrt n}\right)$.
- **Cola izquierda:** $\beta(\mu_1)=1-\Phi\!\left(-z_{1-\alpha}+\tfrac{\mu_0-\mu_1}{\sigma/\sqrt n}\right)$.

## Diseño de la prueba: fijar α y β para despejar n

Cuando un problema **impone a la vez** un $\alpha$ y un $\beta$ (para cierto valor
alternativo $\theta_1$), se pueden **despejar** el tamaño de muestra $n$ y el valor
crítico de la regla de decisión. Ese es el contenido de la técnica
[[diseno-de-prueba-tamano-muestral|diseño de la prueba y tamaño muestral]]
(ej. 4, 5, 6, 7 y 16 del [[tp9-pruebas-de-hipotesis|TP9]]). Para la media con
$\sigma$ conocida:
$$ n=\left(\frac{(z_{1-\alpha}+z_{1-\beta^*})\,\sigma}{\mu_1-\mu_0}\right)^2 \quad(\text{redondeando hacia arriba}). $$
Es la fórmula detrás de la frase "para bajar $\alpha$ y $\beta$ a la vez hay que
aumentar $n$".

> **Cuando $\sigma$ es desconocido.** El error tipo II $\beta(\mu_1)$ no puede
> calcularse antes de tomar la muestra si depende del desvío muestral $S$ (que
> solo se conoce después de muestrear). Una salida práctica, mencionada en
> [[video-th-desvio-desconocido|el video de TH con desvío desconocido]], es
> estimar $S$ con una **muestra piloto** más chica y tomarla como si fuera
> conocida de antemano para poder diseñar la prueba principal.

## Ejemplo conceptual discreto (sin aproximación normal)

**Enunciado** (ejercicio 13 del [[tp9-pruebas-de-hipotesis|TP9]]): recibimos una
caja con $12$ piezas y queremos ensayar $H_0$: "las $12$ piezas son buenas",
extrayendo **una sola** unidad. La condición de rechazo (obvia) es que la pieza
extraída sea **defectuosa**. ¿Cuánto vale $\beta$ si en realidad hay
$k=1,2,\dots,12$ piezas defectuosas?

Si la pieza extraída es buena, no se puede rechazar $H_0$ (pero tampoco
aceptarla con certeza). El **error tipo II** es no rechazar $H_0$ (sacar una pieza
buena) cuando en realidad $H_0$ es falsa (hay $k\ge 1$ defectuosas). Con $k$
defectuosas en $12$, sacar una buena tiene probabilidad
$$ \beta(k) = P(\text{pieza buena}\mid k\text{ defectuosas}) = \frac{12-k}{12}, \qquad k=0,1,\dots,12. $$
Así $\beta(0)=1$ (si no hay defectuosas, jamás se rechaza: $H_0$ es verdadera),
$\beta(12)=0$ (si todas son defectuosas, siempre se rechaza). Es un caso "de
juguete" útil para ver que **$\beta$ es una función del grado de falsedad de
$H_0$**, sin necesidad de la aproximación normal (coincide con la respuesta del
TP9: $\beta=\tfrac{12-k}{12}$).

## Apéndice: simulación del error tipo I (Octave)

El [[tp9-pruebas-de-hipotesis|TP9]] incluye una simulación opcional en Octave de
una prueba de cola derecha: genera $N=1000$ muestras de tamaño $n$ bajo $H_0$
verdadera y cuenta con qué frecuencia el estadístico ($Z$ con $\sigma$ conocida, o
$T$ con $S$) cae en la región de rechazo a nivel $\alpha=0.05$. Las frecuencias
empíricas obtenidas ($\approx 0.043$ y $\approx 0.044$) resultan **próximas a
$0.05$**, ilustrando que $\alpha$ es justamente la probabilidad (de largo plazo)
de cometer el error tipo I cuando $H_0$ es cierta.

## Conceptos relacionados

- [[prueba-de-hipotesis]], [[valor-p]], [[estadistico-de-prueba]]
- [[prueba-de-hipotesis-para-la-media]], [[prueba-de-hipotesis-para-la-proporcion]]
- [[diseno-de-prueba-tamano-muestral]] (despejar $n$ y $c$ fijando $\alpha$ y $\beta$)
- [[reconocer-prueba-de-hipotesis]] (plantear $H_0$/$H_1$ y elegir la cola)
- [[ley-de-grandes-numeros]] (el apéndice de simulación ilustra $\alpha$ como frecuencia de largo plazo)

## Ejercicio resuelto

**Enunciado** (ejercicio 2 del [[tp9-pruebas-de-hipotesis|TP9]]): Un nuevo
procedimiento para producir cemento debería dar una resistencia media de
$5000\ \text{kg/cm}^2$ con desvío $\sigma=120\ \text{kg/cm}^2$. Para probar
$H_0:\mu=5000$ vs $H_1:\mu<5000$ se analizan $n=50$ probetas y **se rechaza $H_0$
si la media muestral es menor que $4970$**.
(a) Probabilidad de error tipo I. (b) $\beta$ para $\mu=4960$.

**Planteo.** Prueba de cola izquierda. Bajo $H_0$, $\bar X \sim N(5000,\ 120/\sqrt{50})$.
El error estándar es $\sigma/\sqrt n = 120/\sqrt{50}=16.97$.

**(a) Error tipo I.** Es rechazar siendo $\mu=\mu_0=5000$:
$$ \alpha = P_{5000}(\bar X < 4970) = \Phi\!\left(\frac{4970-5000}{16.97}\right)=\Phi(-1.768)\approx 0.039. $$
Es decir $\alpha \approx 3.9\%$.

**(b) Error tipo II para $\mu=4960$.** Es aceptar ($\bar X \ge 4970$) siendo en
realidad $\mu=4960$:
$$ \beta(4960)=P_{4960}(\bar X \ge 4970)=1-\Phi\!\left(\frac{4970-4960}{16.97}\right)=1-\Phi(0.589)=1-0.722 \approx 0.278. $$

**Resultado.** $\alpha\approx 0.039$ y $\beta(4960)\approx 0.278$ (coincide con
la respuesta del TP9: $0.278$; para $\mu=4950$ da $0.119$). Nótese cómo $\beta$
**baja** a medida que $\mu$ se aleja de $\mu_0$.
