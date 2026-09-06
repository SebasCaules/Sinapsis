---
titulo: Promedio Muestral
resumen: 'Promedio de una muestra i.i.d.: estimador insesgado de la media, con desvío $\sigma_X/\sqrt{n}$ que se achica al crecer $n$. Sus dos teoremas clave son la ley de grandes números (converge a la media) y el teorema central del límite (se vuelve aproximadamente normal).'
tipo: concepto
unidad: 7
orden: 5
tags: [muestreo, promedio, estimador, suma-de-va]
fuentes: ["[[teorica-suma-promedio-iid]]", "[[teorica-tcl-introduccion]]", "[[tp7-suma-de-va]]", "[[video-tcl]]"]
actualizado: 2026-09-04
---

# Promedio Muestral $\bar X_n$

**En breve.** El promedio de una muestra i.i.d. Es un estimador **insesgado** de
la media $\mu_X$ cuya dispersión $\sigma_X/\sqrt n$ se achica con $n$. Sus dos
teoremas clave son la [[ley-de-grandes-numeros|LGN]] (converge a $\mu_X$) y el
[[teorema-central-del-limite|TCL]] (se vuelve aprox. Normal).

Dada una muestra $X_1,\dots,X_n$ **i.i.d.** con media $\mu_X$ y varianza
$\sigma_X^2$, el **promedio muestral** (o media muestral) es
$$ \bar X_n=\frac1n\sum_{i=1}^n X_i=\frac1n S_n. $$
Es la v.a. central de la **distribución en el muestreo** y de la estimación.

## Media y varianza
Según [[teorica-suma-promedio-iid]]:
$$ E[\bar X_n]=\mu_X,\qquad V(\bar X_n)=\frac{V(S_n)}{n^2}=\frac{n\sigma_X^2}{n^2}=\frac{\sigma_X^2}{n}. $$
- $\bar X_n$ es un estimador **insesgado** de $\mu_X$ ($E[\bar X_n]=\mu_X$).
- Su **desvío** es $\sigma_{\bar X_n}=\dfrac{\sigma_X}{\sqrt n}$ (el famoso *error estándar*).
- $V(\bar X_n)=\dfrac{\sigma_X^2}{n}\xrightarrow{n\to\infty}0$: el promedio se **concentra** en $\mu_X$.

> **Intuición ($\sqrt n$, no $n$).** Al promediar, los errores individuales se
> cancelan parcialmente, pero no del todo: la dispersión cae como $1/\sqrt n$, no
> como $1/n$. Por eso para **bajar el error a la mitad hace falta cuadruplicar la
> muestra**. Esa es la "ley de rendimientos decrecientes" del muestreo.

> [!figura] u7-s-n-se-abre-x-n-se-cierra
> Los dos paneles comparten la escala horizontal y los sumandos son variables normales independientes e idénticamente distribuidas: al subir $n$, la suma $S_n$ se ensancha como $\sigma\sqrt n$ y desborda la ventana, mientras el promedio $\bar X_n$ se angosta como $\sigma/\sqrt n$ hasta volverse una aguja. Note que pasar de $n$ a $4n$ solo parte a la mitad el ancho del promedio.

## Sus dos grandes teoremas
- [[ley-de-grandes-numeros|LGN]]: $\bar X_n\to\mu_X$ (en probabilidad / casi seguro).
- [[teorema-central-del-limite|TCL]]: $\dfrac{\bar X_n-\mu_X}{\sigma_X/\sqrt n}\to\mathcal N(0,1)$,
  es decir $\bar X_n\overset{\text{aprox}}{\sim}\mathcal N\!\big(\mu_X,\tfrac{\sigma_X}{\sqrt n}\big)$.

> Caso exacto: si las $X_i$ son **Normales**, $\bar X_n$ es **exactamente**
> $\mathcal N\!\big(\mu_X,\tfrac{\sigma_X}{\sqrt n}\big)$ para todo $n$ (no hace
> falta el TCL), porque suma de normales es normal — ver [[suma-de-va-independientes]].

## La varianza muestral
El título del [[tp7-suma-de-va]] es "suma de v.a. **y distribución en el
muestreo**": además del promedio $\bar X_n$, la guía (ej. 20c) abre la
distribución en el muestreo de la **varianza muestral** $S_n^2$. Ese hilo se
desarrolla en la unidad 8 → ver [[varianza-muestral]] (estimador insesgado con
denominador $n-1$ y su distribución vía [[distribucion-ji-cuadrado]]).

## Ejercicio resuelto

### Ejercicio resuelto — promedio de v.a. Normales
*([[tp7-suma-de-va]], ej. 17b de la guía.) El peso de cajas es $\mathcal N(20,3)$
kg. Calcular la probabilidad de que la media de una muestra de 100 cajas esté
entre 19.7 y 20.6 kg.*

**Planteo.** $X_i\sim\mathcal N(20,3)$, $n=100$. El promedio es exactamente normal:
$$ \bar X_{100}\sim\mathcal N\!\left(20,\;\frac{3}{\sqrt{100}}\right)=\mathcal N(20,\,0.3). $$

**Tipificación.**
$$ P(19.7\le\bar X_{100}\le 20.6)=\Phi\!\left(\frac{20.6-20}{0.3}\right)-\Phi\!\left(\frac{19.7-20}{0.3}\right)=\Phi(2)-\Phi(-1). $$

**Cálculo.** $\Phi(2)\approx0.9772$, $\Phi(-1)=1-\Phi(1)\approx1-0.8413=0.1587$:
$$ P\approx 0.9772-0.1587=0.8185. $$

**Resultado.** $\;P(19.7\le\bar X_{100}\le 20.6)\approx 0.8185.$ *(Comparar con el
ítem a, una sola caja $\mathcal N(20,3)$: la misma franja da sólo $\approx0.1191$,
porque $\sigma$ de la caja es $3$ y la del promedio es $0.3$.)*

### Ejercicio resuelto — promedio de una variable de distribución desconocida
*([[video-tcl]], min. 37:39.) $M_i$ = cantidad de canciones puestas en el $i$-ésimo de $104$ eventos; se desconoce su distribución, sólo $E(M_i)=150$ y $V(M_i)=500$. Calcular $P(148\le\bar M_{104}\le153)$.*

**Planteo.** Por el TCL, sin conocer la distribución de $M_i$:
$$ \bar M_{104}\overset{\text{TCL}}{\sim}\mathcal N\!\left(150,\sqrt{\tfrac{500}{104}}\right). $$

**Cálculo.**
$$ P(148\le\bar M_{104}\le153)\approx\Phi(1{,}3682)-\Phi(-0{,}9121)=0{,}7335295. $$

**Resultado.** $\approx0{,}7335$. Es el caso emblemático que justifica por qué importa no exigir conocer la distribución exacta: alcanza con la media y la varianza.

## Enlaces
- [[suma-de-variables-aleatorias]] · [[suma-de-va-independientes]] · [[ley-de-grandes-numeros]] · [[teorema-central-del-limite]].
- [[esperanza]] · [[varianza]] · [[distribucion-normal]] · [[desigualdad-de-chebyshev]].
- [[varianza-muestral]] — el otro estimador clave del muestreo (unidad 8).
