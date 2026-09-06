---
titulo: "Video — Uniformes y Exponenciales"
resumen: "Clase en video de Lucio Pantazis (unidad 4) que introduce la uniforme continua y la exponencial con dos ejemplos resueltos desde la definición, e incluye integrales impropias, falta de memoria y un adelanto de la distribución Gamma."
tipo: fuente
formato: video
unidad: 4
url: "https://youtu.be/XwovbmRhUAI"
duracion: "26:27"
docente: Lucio Pantazis
ingerido: 2026-09-03
---

# Video — Uniformes y Exponenciales

**Qué es:** clase en video de Lucio Pantazis que introduce las distribuciones uniforme continua y exponencial a partir de dos ejemplos numéricos completos, resueltos paso a paso desde la definición.
**Cubre:** distribución uniforme continua ($U(a,b)$), distribución exponencial ($\text{Expo}(\lambda)$), integrales impropias aplicadas a la normalización de una densidad, falta de memoria, y una introducción (adelanto) a la distribución Gamma.
**Guía asociada:** Guía 4.

## Recorrido de la clase

| Timestamp | Tema |
|---|---|
| [00:01] | Introducción: variables continuas "de estructura conocida" — no hace falta rederivar $E$, $V$, densidad ni FDA cada vez. |
| [00:37] | Motivación: la hora del amanecer (entre las 6:15 y las 6:20) como ejemplo de variable uniforme. |
| [01:52] | Cálculo de $k=1/5$ para la densidad del ejemplo y deducción de la FDA por tramos. |
| [03:13] | Cálculo de $E(T_A)=17{,}5$ y $V(T_A)=25/12$ para el ejemplo del amanecer. |
| [04:42] | Generalización al caso $U(a,b)$: FDA, densidad, $E$ y $V$; advertencia sobre FDA lineal vs. densidad constante. |
| [07:44] | Motivación de la variable exponencial: tiempos de falla — ejemplo de un termómetro con densidad $k\,e^{-t/1000}$. |
| [08:55] | Apéndice: integrales impropias, con la analogía de que si se conocen límite e integral definida ya no es difícil (igual que con series). Cita textual abajo. |
| [10:01] | Cálculo de $k=1/1000$ resolviendo la integral impropia por límite. |
| [11:32] | FDA del ejemplo: $F_{T_F}(t)=1-e^{-t/1000}$. |
| [12:24] | Cálculo de $E(T_F)=1000$ (integración por partes + L'Hôpital). |
| [16:04] | Cálculo de $V(T_F)=1000^2$ (repitiendo el procedimiento con $t^2$). |
| [18:21] | Generalización: notación $T\sim\text{Expo}(\lambda)$, FDA, densidad, $E(T)=1/\lambda$, $V(T)=1/\lambda^2$. |
| [19:26] | Propiedad de falta de memoria: demostración y advertencia sobre el sentido de las desigualdades. |
| [22:44] | Adelanto (no evaluable de memoria todavía): introducción a la distribución Gamma y su relación con la exponencial. |
| [26:10] | Cierre: aclara la notación $U\sim\mathcal U(a,b)$ para la uniforme. |

## Qué aporta sobre el apunte

- **(a) Ejemplos resueltos completos y nuevos.** Los apuntes ya ingeridos
  ([[teorica-va-uniforme]], [[teorica-va-exponencial]]) presentan directamente
  la fórmula general de $U(a,b)$ y $\text{Expo}(\lambda)$ sin un ejemplo numérico
  previo. Este video, en cambio, deriva ambas distribuciones **desde un caso
  concreto** — la hora del amanecer ($a=15,b=20$) y el termómetro
  ($\lambda=1/1000$) — antes de generalizar. Ninguno de los dos ejemplos
  numéricos está en el apunte teórico ni en [[distribucion-uniforme-continua]] /
  [[distribucion-exponencial]] (que usan ejercicios de [[tp4-variables-aleatorias-continuas]]).
  Ver la sección "Ejercicio resuelto en clase" abajo.
- **(b) Intuiciones y analogías.**
  - Integrales impropias: "si saben límite y si saben integral definida...
    integral impropia no es un paso difícil... es la misma lógica que la que
    tenemos con series" [09:08]–[09:18] — conecta con
    [[tecnica-integrales-impropias]].
  - Por qué el valor esperado de la uniforme cae en el **centro** del intervalo:
    lo contrasta con un ejemplo de una clase anterior (temperatura) donde había
    "más densidad a la derecha que a la izquierda" y por eso la media no
    coincidía con el centro [04:03]–[04:14].
  - Por qué en el límite para $E(T_F)$ los términos con $M\,e^{-M/1000}$ se
    anulan: "la exponencial en velocidad de divergencia le va a ganar siempre
    al polinomio" [14:14]–[14:19] (uso intuitivo de L'Hôpital).
  - Sobre la Gamma: a mayor $\alpha$ los dispositivos "tienden a durar más"
    (la curva se corre a la derecha y se aplana), a mayor $\lambda$ "tienden a
    durar menos" (se comprime) [25:38]–[25:46].
- **(c) Advertencias del docente.** Ver sección dedicada abajo.
- **(d) Énfasis.** La clase dedica casi toda su duración a los dos ejemplos
  numéricos completos (uniforme y exponencial) antes de generalizar, y trata la
  distribución Gamma explícitamente como un adelanto que "no es algo que se
  tengan que acordar esto, pero quizás después va a aparecer" [22:55]–[23:00] —
  es decir, no es materia cerrada de esta clase, solo motivación para más
  adelante (unidad 7, [[distribucion-gamma]]).

## Ejercicio resuelto en clase

### Ejemplo 1 — la hora del amanecer (variable uniforme)

**Fuente:** [[video-uniformes-y-exponenciales]] [00:37]–[04:42].

**Enunciado.** En cierta época del año el amanecer ocurre entre las 6:15 y las
6:20 AM, sin predilección por ningún instante del intervalo. Sea $T_A=$ minutos
desde las 6 AM en que amanece un día cualquiera. Hallar su densidad, su FDA, su
valor esperado y su varianza.

**Planteo.** Como no hay motivo para que un minuto del intervalo sea más
probable que otro, la densidad es constante en $[15,20]$:
$$ f_{T_A}(t)=\begin{cases} k & 15\le t\le 20\\ 0 & \text{en caso contrario.}\end{cases} $$

**Cálculo de $k$.** La densidad debe integrar $1$:
$$ 1=\int_{15}^{20}k\,dt = k\cdot 5 \;\Longrightarrow\; k=\frac{1}{5}. $$

**Distribución acumulada.** Integrando por tramos (antes de 15 se acumula $0$,
entre 15 y 20 crece linealmente, después de 20 vale $1$):
$$ F_{T_A}(t)=\begin{cases} 0 & t<15\\[2pt] \dfrac{t-15}{5} & 15\le t\le 20\\[4pt] 1 & t>20.\end{cases} $$

**Valor esperado.**
$$ E(T_A)=\int_{15}^{20} t\cdot\frac15\,dt=\left.\frac{t^2}{10}\right|_{15}^{20}=\frac{20^2-15^2}{10}=\frac{35}{2}=17{,}5. $$
Tiene sentido que dé el centro del intervalo: no hay tendencia hacia valores
altos ni bajos.

**Varianza.**
$$ E(T_A^2)=\int_{15}^{20} t^2\cdot\frac15\,dt=\left.\frac{t^3}{15}\right|_{15}^{20}=\frac{20^3-15^3}{15}=\frac{925}{3}, $$
$$ V(T_A)=E(T_A^2)-E(T_A)^2=\frac{925}{3}-\left(\frac{35}{2}\right)^2=\frac{25}{12}. $$

**Resultado.** $T_A\sim\text{Unif}(15,20)$, con $E(T_A)=17{,}5$ minutos y
$V(T_A)=\tfrac{25}{12}$ minutos².

### Ejemplo 2 — tiempo de falla de un termómetro (variable exponencial)

**Fuente:** [[video-uniformes-y-exponenciales]] [07:44]–[18:01].

**Enunciado.** El tiempo de funcionamiento en días $T_F$ de un termómetro sigue
la densidad
$$ f_{T_F}(t)=\begin{cases} k\cdot e^{-t/1000} & t>0\\ 0 & \text{en caso contrario.}\end{cases} $$
Hallar $k$, la FDA, el valor esperado y la varianza.

**Cálculo de $k$ (integral impropia).** El dominio $(0,\infty)$ no está
acotado, así que se integra hasta $M$ y se toma límite (ver
[[tecnica-integrales-impropias]]):
$$ \int_0^{\infty}k\,e^{-t/1000}\,dt=\lim_{M\to\infty}k\cdot\Big(-1000\,e^{-t/1000}\Big)\Big|_0^{M}=\lim_{M\to\infty}1000k\Big(1-e^{-M/1000}\Big)=1000k. $$
Como esta integral debe valer $1$: $k=\dfrac{1}{1000}$.

**Distribución acumulada.**
$$ F_{T_F}(t)=\int_0^{t}\frac{e^{-s/1000}}{1000}\,ds=\Big(-e^{-s/1000}\Big)\Big|_0^{t}=1-e^{-t/1000}\qquad(t>0). $$

**Valor esperado (integración por partes + L'Hôpital).**
$$ E(T_F)=\int_0^{\infty} t\cdot\frac{e^{-t/1000}}{1000}\,dt=\lim_{M\to\infty}\left[-\Big(t+1000\Big)e^{-t/1000}\right]_0^{M}=1000, $$
ya que el término $M\,e^{-M/1000}\to 0$ cuando $M\to\infty$ (la exponencial
decae más rápido de lo que crece cualquier polinomio).

**Varianza.** Repitiendo el mismo procedimiento con $t^2$ (una segunda
integración por partes):
$$ E(T_F^2)=2\cdot 1000^2,\qquad V(T_F)=E(T_F^2)-E(T_F)^2=2\cdot1000^2-1000^2=1000^2. $$

**Resultado.** $k=1/1000$ (equivalente a la tasa $\lambda=1/1000$),
$F_{T_F}(t)=1-e^{-t/1000}$, $E(T_F)=1000$ días, $V(T_F)=1000^2$ días² — la
misma estructura que la [[distribucion-exponencial]] general con
$\lambda=1/1000$.

## Advertencias del docente

- **[06:16]** FDA lineal no implica variable uniforme: "a veces ven una lineal
  en la densidad y piensan que es uniforme y no, o sea, uniforme, densidad
  constante, tatúenselo." Lo que define a la uniforme es que la **densidad**
  sea constante, no que la FDA sea lineal (la FDA es lineal *porque* la
  densidad es constante, no al revés).
- **[22:03]–[22:29]** Falta de memoria — cuidado con el sentido de las
  desigualdades: la propiedad $P(T>a+b\mid T>a)=P(T>b)$ vale **solo** con
  "$>$" en ambos miembros. El docente marca explícitamente como **incorrectas**
  las variantes $P(T<a+b\mid T>a)=P(T<b)$ y $P(T>a+b\mid T<a)=P(T>b)$: "esto
  está mal y esto está mal... no traten de usar esto siempre" — advierte que es
  un error frecuente de interpretación.
- **[03:01], [06:04], [12:49], [16:24]** Erratas de copy-paste en las
  diapositivas del ejemplo (dice "$T_F$" donde debería decir "$T_A$", o falta
  cambiar "$u$"/"$m$" en algunas fórmulas): no son errores de contenido, el
  docente las señala y aclara en el momento — no reproducirlas al citar las
  fórmulas.

## Páginas del wiki que toca
- [[distribucion-uniforme-continua|Distribución Uniforme continua]]
- [[distribucion-exponencial|Distribución Exponencial]]
- [[tasa-de-fallas|Función de tasa de fallas]]
- [[funcion-de-densidad|Función de densidad]]
- [[variable-aleatoria-continua|Variable aleatoria continua]]
- [[formulario-va-continuas|Formulario — V.A. continuas]]
