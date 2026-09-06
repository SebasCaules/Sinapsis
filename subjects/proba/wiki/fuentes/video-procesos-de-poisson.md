---
titulo: "Video — Procesos de Poisson"
resumen: "Clase en video de Lucio Pantazis (unidad 6) sobre el proceso de Poisson: proceso de conteo, incrementos independientes y estacionarios, condicionales hacia adelante y hacia atrás, y los tiempos exponencial y Gamma entre eventos."
tipo: fuente
formato: video
unidad: 6
url: "https://youtu.be/3W4Ng9nIceY"
duracion: "47:53"
docente: Lucio Pantazis
ingerido: 2026-09-03
---

# Video — Procesos de Poisson

**Qué es:** clase teórico-práctica completa sobre el [[proceso-de-poisson|proceso de Poisson]], desarrollada íntegramente con el ejemplo hilo conductor de las
notificaciones que le llegan a Natalia mientras escribe.
**Cubre:** definición de proceso de conteo e incrementos independientes/estacionarios,
definición formal del proceso de Poisson, ejemplos de probabilidades e incrementos,
condicionales "hacia adelante" y "hacia atrás" (con el error garrafal típico),
tiempos entre eventos ($\tau(k)$, exponencial) y tiempo hasta el $k$-ésimo evento
($T(n)$, Gamma/Erlang) vía la técnica de igualdad de eventos.
**Guía asociada:** Guía 6.

## Recorrido de la clase
| Timestamp | Tema |
|---|---|
| [00:04] | Motivación: ejemplo de Natalia y las notificaciones al celular; se define $N(t)$ = notificaciones acumuladas en los primeros $t$ minutos. |
| [03:22] | Por qué importan los **incrementos** $N(t)-N(s)$: permiten preguntar por una ventana de tiempo cualquiera, no solo desde el origen. |
| [05:49] | Definición formal de **proceso de conteo**: $E=\mathbb{N}_0$, $N(s)\le N(t)$ si $s<t$, $N(0)=0$. |
| [08:26] | Definición formal de **incrementos independientes** (intervalos disjuntos). |
| [10:52] | Definición formal de **incrementos estacionarios** ($N(t)-N(s)\sim N(t-s)$). |
| [12:45] | Definición completa del **proceso de Poisson**: las tres propiedades numeradas (1: $N(t)\sim\text{Po}(\lambda t)$; 2: incrementos independientes; 3: incrementos estacionarios) que se usan como "recetario" citado en cada paso de los ejercicios. |
| [16:22] | Ejemplo de probabilidades con Natalia ($\lambda=0.05\,\text{min}^{-1}$): $P(N(20)=5)$ y $P(N(40)\ge3)$. |
| [18:02] | Ejemplo con incrementos: $P(N(40)-N(25)\le3)$ y $E[N(40)-N(10)]$. |
| [20:21] | Ejemplo condicional "hacia adelante" (se conoce el pasado, se pregunta por el futuro): $P(N(40)=6\mid N(15)=2)$. |
| [21:38]–[25:32] | **Advertencia:** el error garrafal de reemplazar la intersección por el incremento sin verificar la dirección del condicionamiento. |
| [26:46] | Ejemplo condicional "hacia atrás" (se conoce el futuro, se pregunta por el pasado): $P(N(15)=2\mid N(40)=6)$ — aparece una estructura Binomial inesperada. |
| [32:19] | Cambio de perspectiva: de contar eventos a medir **tiempos**; se define $T(k)$ = tiempo hasta la $k$-ésima notificación. |
| [33:51] | Se definen los incrementos $\tau(k)=T(k)-T(k-1)$ (tiempo entre notificaciones consecutivas), distintos de $T(k)$. |
| [38:39] | Técnica de **igualdad de eventos**: $\{\tau(1)>t\}=\{N(t)=0\}$ como conjuntos, no solo como probabilidades. |
| [40:37] | Conclusión: $\tau(k)\sim\text{Exponencial}(\lambda)$ i.i.d. |
| [41:49] | $T(n)=\sum_{k=1}^n\tau(k)\sim\text{Gamma}(n,\lambda)$ (Erlang); sin primitiva cerrada para $n$ general. |
| [43:30]–[46:32] | Ejercicio resuelto: $P(T(3)>40)$ vía igualdad de eventos $\{T(3)>40\}=\{N(40)<3\}$, y verificación con software (`pgamma`). |

## Qué aporta sobre el apunte
- **(a) Ejemplos resueltos paso a paso.** Toda la clase gira en torno al ejemplo
  extendido de las notificaciones de Natalia, con cálculos numéricos completos que
  el apunte manuscrito no tiene (el apunte deduce las fórmulas en abstracto; el
  video las aplica). Ver la sección **Ejercicio resuelto en clase** más abajo.
- **(b) Intuición nueva — igualdad de eventos vs. igualdad de probabilidades.** El
  docente insiste en que $\{T_k<t\}=\{N(t)\ge k\}$ vale porque son **el mismo
  conjunto** de resultados (inclusión mutua demostrada gráficamente con rectas de
  tiempo), no una coincidencia numérica de probabilidades. Esto es el mecanismo
  lógico detrás de la [[proceso-de-poisson#Dualidad conteo ↔ tiempo (clave para ejercicios)|dualidad conteo↔tiempo]]
  ya escrita en la página del concepto, que la enuncia pero no explica por qué
  vale. Ver aporte propuesto.
- **(c) Advertencias explícitas de error frecuente (ver más abajo).**
- **(d) Énfasis.** El docente remarca que las tres propiedades numeradas del
  proceso de Poisson (marginal Poisson, incrementos independientes, incrementos
  estacionarios) son "las únicas que tenemos que ver teóricamente para encarar toda la
  parte práctica" [15:24]-[15:30], y que en los ejercicios conviene citar
  explícitamente cuál de las tres se usa en cada paso (se ve en las cuentas de los
  slides, marcadas con números (1), (2), (3) sobre cada igualdad). También insiste
  en que la fórmula binomial que aparece al condicionar "hacia atrás" **no** hay
  que memorizarla — alcanza con aplicar las tres propiedades con criterio
  [30:19]-[30:23].

## Ejercicio resuelto en clase

### 1. Condicionar "hacia atrás": de un conteo futuro a uno pasado
*De [26:46]. Notificaciones de Natalia según Poisson de tasa $\lambda=0.05\,\text{min}^{-1}$.*

**Enunciado.** Sabiendo que en los primeros 40 minutos hubo 6 notificaciones, ¿cuál
es la probabilidad de que hayan sido 2 en los primeros 15 minutos?

**Planteo.** Se busca $P(N(15)=2\mid N(40)=6)$. Por definición de probabilidad
condicional:
$$ P(N(15)=2\mid N(40)=6)=\frac{P(N(40)=6\cap N(15)=2)}{P(N(40)=6)}. $$

**Cálculo.** Como $N(15)=2$ está "adentro" de $N(40)=6$ (los intervalos $[0,15]$ y
$[0,40]$ se superponen), no se puede simplemente reemplazar la intersección por el
incremento $N(40)-N(15)$: hay que **restar la información conocida en ambos
lados**. Con $N(15)=2$ fijo, pedir $N(40)=6$ equivale a pedir $N(40)-N(15)=4$, y
ahora sí, como $(15,40]$ y $[0,15]$ son disjuntos, la intersección se factoriza por
incrementos independientes:
$$ P(N(40)=6\cap N(15)=2)=P\big(N(40)-N(15)=4\ \cap\ N(15)=2\big)=P(N(40)-N(15)=4)\cdot P(N(15)=2). $$
Por incrementos estacionarios, $N(40)-N(15)\sim N(25)$. Con $\lambda\cdot25=1.25$ y
$\lambda\cdot15=0.75$:
$$ P(N(15)=2\mid N(40)=6)=\frac{e^{-1.25}\frac{1.25^4}{4!}\cdot e^{-0.75}\frac{0.75^2}{2!}}{e^{-2}\frac{2^6}{6!}}=\binom{6}{4}\left(\frac{1.25}{2}\right)^4\left(\frac{0.75}{2}\right)^2\approx0.3219. $$

**Resultado.** $P(N(15)=2\mid N(40)=6)\approx0.3219$. Nótese que el resultado tiene
la forma de una $\text{Binomial}(6,\,p)$ con $p=t_1/t_2=15/40=0.375$ (la fracción de
tiempo transcurrido): condicionado a que hubo $n_2$ eventos en $[0,t_2]$, cada uno
"cae" independientemente y de forma uniforme en $[0,t_2]$, así que la cantidad que
cae en el sub-intervalo $[0,t_1]$ es $\text{Binomial}(n_2,\,t_1/t_2)$. Este
resultado **no** aparece en el apunte manuscrito de la teórica.

### 2. Tiempo hasta el tercer evento, vía igualdad de eventos
*De [43:30]-[46:32]. Mismos datos: $\lambda=0.05\,\text{min}^{-1}$.*

**Enunciado.** Calcular $P(T(3)>40)$, la probabilidad de que la tercera
notificación llegue después de los 40 minutos.

**Planteo.** $T(3)=\tau(1)+\tau(2)+\tau(3)$ es suma de tres exponenciales i.i.d. de
parámetro $\lambda$, por lo tanto $T(3)\sim\text{Gamma}(3,\lambda)$ (Erlang), cuya
función de distribución no tiene primitiva cerrada simple. En vez de integrar la
densidad Gamma, se usa la **igualdad de eventos**: "la tercera notificación llega
después de 40" ocurre exactamente cuando "hasta el minuto 40 hubo menos de 3
notificaciones":
$$ \{T(3)>40\}=\{N(40)<3\}. $$
(Los tres casos posibles — 0, 1 o 2 eventos antes del minuto 40 — se verifican
gráficamente en el slide: en todos ellos el tercer evento cae después del 40, y
viceversa.)

**Cálculo.** Como los eventos son iguales, sus probabilidades coinciden, y del lado
derecho sí se puede calcular con la Poisson de parámetro $\lambda\cdot40=2$:
$$ P(T(3)>40)=P(N(40)<3)=\sum_{i=0}^{2}e^{-2}\frac{2^i}{i!}\approx0.6766764. $$

**Verificación con software.** El docente muestra que el mismo valor se obtiene
integrando directamente la densidad Gamma: `1-pgamma(40, 3, rate=0.05)` da
`0.6766764`, coincidiendo exactamente con el cálculo vía Poisson.

**Resultado.** $P(T(3)>40)\approx0.6766764$.

## Advertencias del docente
- **[21:38]-[25:32] Error garrafal — condicionar "hacia adelante" vs "hacia
  atrás".** Cuando el condicionante es el **pasado** y se pregunta por el
  **futuro** (p. ej. $P(N(40)=6\mid N(15)=2)$), el atajo de reemplazar la
  intersección directamente por el incremento $P(N(40)-N(15)=4)$ es válido. Pero
  cuando el condicionante es el **futuro** y se pregunta por el **pasado** (p. ej.
  $P(N(15)=2\mid N(40)=6)$), aplicar el mismo atajo sin desarrollarlo con la
  definición de probabilidad condicional es un error muy común que puede llevar a
  probabilidades mayores que uno. El docente lo remarca explícitamente: "cuenta de
  ese error, por favor, que no lo hagan más".
- **[26:07]-[26:12] No decir que "la Poisson tiene falta de memoria".** El docente
  corrige de forma enfática ("no me gusta, no lo diga más, por favor, basta") una
  confusión típica: la falta de memoria es propiedad de los **tiempos entre
  eventos** ([[distribucion-exponencial|Exponencial]]), no algo que se pueda
  aplicar libremente al razonar sobre incrementos del conteo condicionando hacia
  atrás.
- **[30:14]-[30:23] No memorizar la fórmula Binomial que aparece al condicionar
  hacia atrás.** Es "difícil memorizárselo"; conviene en cambio recordar las tres
  propiedades del proceso de Poisson y aplicarlas con criterio partiendo siempre de
  la definición de probabilidad condicional.
- **[44:52]-[45:03] La técnica de igualdad de eventos es la más difícil de la
  unidad, pero importantísima.** El docente la describe como "importantísimo
  para la parte de Poisson... es como lo más difícil de hacer, pero también cuando
  uno lo entiende conceptualmente no se vuelve tan difícil".

## Páginas del wiki que toca
- [[proceso-de-poisson]]
- [[procesos-estocasticos]]
- [[relacion-bernoulli-poisson]]
- [[distribucion-exponencial]], [[distribucion-erlang]]
