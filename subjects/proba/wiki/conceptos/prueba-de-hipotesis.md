---
titulo: Prueba de hipótesis
resumen: "Método de la inferencia para decidir entre dos hipótesis sobre un parámetro poblacional a partir de una muestra, controlando de antemano la probabilidad de equivocarse. Hub de la unidad 9: tipos de prueba, región de rechazo, errores tipo I y II, y valor p."
tipo: concepto
unidad: 9
orden: 1
hub: true
tags: [inferencia, prueba-de-hipotesis, hub]
fuentes: ["[[tp9-pruebas-de-hipotesis]]", "[[intro-prueba-de-hipotesis-slides]]", "[[video-th-desvio-conocido]]"]
actualizado: 2026-09-03
---

# Prueba de hipótesis

**En breve.** Es el método de la [[inferencia-estadistica|inferencia]] para
decidir, a partir de una muestra, entre dos afirmaciones sobre un parámetro
poblacional, controlando de antemano la probabilidad de equivocarse. Es el tema
central de la unidad 9.

> **Hub de la unidad 9.** Esta página reúne el marco general de las pruebas de
> hipótesis y enlaza a las pruebas concretas: para la
> [[prueba-de-hipotesis-para-la-media|media]] y para la
> [[prueba-de-hipotesis-para-la-proporcion|proporción]].

**Qué es:** una **prueba de hipótesis** (hypothesis test) es una forma de
contrastar dos hipótesis mutuamente excluyentes sobre un parámetro de una
población, evaluando su veracidad a partir de una muestra. Según
[[tp9-pruebas-de-hipotesis|TP9]], como en general no conocemos completamente la
población, **nunca tenemos certeza total**: toda decisión puede equivocarse por
azar.

## Las dos hipótesis

Nos concentramos en pruebas **binarias** (solo dos hipótesis):

- **Hipótesis nula** $H_0$: la afirmación que se pone a prueba. Es la hipótesis
  "por defecto", la que se mantiene salvo evidencia fuerte en contra.
- **Hipótesis alternativa** $H_1$: la complementaria de $H_0$.

> **Intuición (analogía del jurado).** $H_0$ es "el acusado es inocente": se la
> presume cierta y solo se la abandona ante **evidencia fuerte** en contra. La
> muestra es la prueba presentada en el juicio. Por eso no son simétricas:
> mantener $H_0$ por falta de evidencia ("no culpable") **no demuestra** que sea
> cierta, igual que un veredicto absolutorio no demuestra inocencia. La carga de
> la prueba recae siempre sobre $H_1$.

> **Motivación alternativa (cine).** [[video-th-desvio-conocido]] (min. 00:41)
> propone la misma idea con un clip de la película argentina *Un cuento chino*
> (2005), donde un cliente reclama por una caja de tornillos incompleta: $H_0$ es
> el statu quo ("la caja está completa, salvo evidencia en contra"), igual que en
> la analogía del jurado.

Según el sentido de $H_1$ hay tres tipos de prueba (para un parámetro $\theta$
con valor de referencia $\theta_0$):

| Tipo | $H_0$ | $H_1$ | Región de rechazo |
|---|---|---|---|
| **Dos colas** (bilateral) | $\theta = \theta_0$ | $\theta \ne \theta_0$ | en ambas colas |
| **Cola derecha** | $\theta \le \theta_0$ | $\theta > \theta_0$ | a la derecha |
| **Cola izquierda** | $\theta \ge \theta_0$ | $\theta < \theta_0$ | a la izquierda |

> La igualdad siempre va en $H_0$. El "$=$", "$\le$" o "$\ge$" del lado de $H_0$
> define el tipo de cola, pero la deducción del valor crítico se hace en el caso
> límite $\theta=\theta_0$ (el más desfavorable dentro de $H_0$).

## Ingredientes

- **Estadístico de prueba** $\Lambda$: una función de la muestra (un solo
  número) que resume los datos. Ej.: $\bar X$, $Z$, $T$, $\hat q$. Ver
  [[estadistico-de-prueba]].
- **Región crítica / de rechazo** $R$: conjunto de valores de $\Lambda$ para los
  cuales se rechaza $H_0$. Se rechaza $H_0$ cuando $\Lambda \in R$.
- **Nivel de significación** $\alpha$: cota (pequeña) para la máxima
  probabilidad admisible de cometer un [[error-tipo-i-y-tipo-ii|error tipo I]].
  La región crítica $R^{(\alpha)}$ se elige tal que
  $$ P_{H_0}\!\left(\Lambda \in R^{(\alpha)}\right) \le \alpha. $$
- **Errores** ([[error-tipo-i-y-tipo-ii|página dedicada]]):

  | | $H_0$ verdadera | $H_0$ falsa |
  |---|---|---|
  | Se acepta $H_0$ | OK | **Error tipo II** ($\beta$) |
  | Se rechaza $H_0$ | **Error tipo I** ($\alpha$) | OK |

  La **potencia** de la prueba es $1-\beta$ (probabilidad de rechazar $H_0$
  cuando es falsa).
- **Valor p** ([[valor-p|página dedicada]]): probabilidad de que, bajo $H_0$, el
  estadístico dé "tan mal o peor" que el valor observado. Se **rechaza $H_0$ si
  valor p $< \alpha$**.

## Procedimiento (estilo parcial)

1. Identificar el parámetro y plantear $H_0$ y $H_1$ (definir el tipo de cola).
2. Elegir el estadístico de prueba $\Lambda$ y su distribución bajo $H_0$.
3. Fijar $\alpha$ y construir la región de rechazo (valor crítico).
4. Calcular el valor observado $\lambda_{\text{obs}}$.
5. **Decidir:** rechazar $H_0$ si $\lambda_{\text{obs}} \in R$ (o si valor p $<\alpha$).
6. Concluir en términos del problema.

> Gracias al [[teorema-central-del-limite|TCL]], las fórmulas basadas en la
> normal valen aunque la variable no sea normal **si $n$ es grande**.

## Pruebas concretas de esta unidad

- [[prueba-de-hipotesis-para-la-media|Prueba para la media]] — estadístico $Z$
  (con $\sigma$ conocida o $n$ grande) o $T$ ($\sigma$ desconocida, $n$ chico).
- [[prueba-de-hipotesis-para-la-proporcion|Prueba para la proporción]] —
  estadístico $Z$ con $\hat q = X/n$.

## Conceptos relacionados

- [[error-tipo-i-y-tipo-ii]], [[valor-p]], [[estadistico-de-prueba]]
- [[reconocer-prueba-de-hipotesis]] (cómo plantear $H_0$/$H_1$ y elegir la cola)
- [[diseno-de-prueba-tamano-muestral]] (fijar $\alpha$ y $\beta$ para despejar $n$ y $c$)
- [[intervalos-de-confianza]] (dualidad con las pruebas de dos colas)
- [[inferencia-estadistica]] (marco general del que es parte), [[estimacion-puntual]]
- [[poblacion-y-muestra]], [[teorema-central-del-limite]]
- [[formulario-pruebas-de-hipotesis]] (cheat-sheet de fórmulas), [[formulario-inferencia]]

## Ejercicio resuelto

**Enunciado** (analogía del jurado, [[intro-prueba-de-hipotesis-slides|slides]]
y ejercicio 12 del [[tp9-pruebas-de-hipotesis|TP9]], adaptado de Paulos):
"Se formula la hipótesis de que **al menos el 15 %** de los coches de cierta
región son Corvette. Tras observar 1000 coches se ven 80 Corvette. ¿Se sostiene
la hipótesis a un nivel de significación del 5 %?"

**Planteo.** Parámetro: proporción $p$ de Corvette. La hipótesis a defender es
$p\ge 0.15$, así que es una prueba de **cola izquierda**:
$$ H_0: p \ge 0.15 \qquad H_1: p < 0.15, \qquad \alpha = 0.05. $$
Estadístico (con $n=1000$ grande, [[prueba-de-hipotesis-para-la-proporcion|prueba para la proporción]]):
$$ Z = \frac{\hat p - p_0}{\sqrt{p_0(1-p_0)/n}}, \qquad \hat p = \frac{80}{1000}=0.08,\ p_0=0.15. $$

**Cálculo.**
$$ z_{\text{obs}} = \frac{0.08 - 0.15}{\sqrt{0.15\cdot 0.85/1000}} = \frac{-0.07}{\sqrt{0.0001275}} = \frac{-0.07}{0.01129} \approx -6.2. $$
El valor p de cola izquierda es $\Phi(-6.2)$, del orden de $10^{-10}$ (el TP9
reporta "del orden de $10^{-10}$"). Como valor p $\ll \alpha=0.05$, cae muy
adentro de la región de rechazo.

**Resultado.** Se **rechaza $H_0$**: con la evidencia muestral, la proporción de
Corvette es significativamente menor al 15 %. (El propio texto advierte que aquí
podríamos estar cometiendo un error: si una exposición de Corvette atravesó la
región, rechazaríamos una $H_0$ que en realidad era verdadera → error tipo I).
