---
titulo: Teórica — Suma y Promedio de Variables Aleatorias I.I.D.
resumen: 'Slides manuscritas de la unidad 7 que deducen esperanza y varianza de la suma y del promedio de variables i.i.d.: $\mu_{S_n}=n\mu_X$, $\sigma_{S_n}^2=n\sigma_X^2$ y $V(\overline X_n)=\sigma_X^2/n$, que tiende a cero con $n$.'
tipo: fuente
formato: pdf
unidad: 7
archivo_raw: "raw/08-suma-de-va/02 - Suma y Promedio de Variables Aleatorias I.I.D.pdf"
ingerido: 2026-05-30
---

# Teórica — Suma y Promedio de Variables Aleatorias I.I.D.

**Qué es:** slides manuscritas que deducen $E$ y $V$ de la suma $S_n$ y del
promedio $\bar X_n$ de $n$ v.a. i.i.d., destacando que $\sigma_{\bar X_n}^2\to 0$.

**Cubre las unidades/temas:** unidad 7, suma de i.i.d., promedio muestral.

## Puntos clave
- $X_1,\dots,X_n$ i.i.d. con media $\mu_X$ y varianza $\sigma_X^2$.
- $S_n=\sum_{i=1}^n X_i$: $\;\mu_{S_n}=\sum_i E[X_i]=n\mu_X$; por independencia $\sigma_{S_n}^2=\sum_i V(X_i)=n\sigma_X^2$.
- $\bar X_n=\tfrac1n S_n$: $\;E[\bar X_n]=\mu_X$, $\;V(\bar X_n)=\tfrac1{n^2}V(S_n)=\dfrac{\sigma_X^2}{n}$.
- Conclusión clave: $\sigma_{\bar X_n}^2=\dfrac{\sigma_X^2}{n}\xrightarrow{n\to\infty}0$
  (el promedio se concentra en $\mu_X$ — preludio de la [[ley-de-grandes-numeros|LGN]]).

## Páginas del wiki que toca
- [[suma-de-variables-aleatorias]]
- [[promedio-muestral]]
- [[ley-de-grandes-numeros]]
