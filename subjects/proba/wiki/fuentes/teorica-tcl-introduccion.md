---
titulo: Teórica — Teorema Central del Límite (Introducción)
resumen: 'Slides manuscritas de la unidad 7 con el enunciado del teorema central del límite y sus tres aproximaciones prácticas, para $Z_n$, $\overline X_n$ y $S_n$ con $n$ grande, además de una relectura de la ley de los grandes números.'
tipo: fuente
formato: pdf
unidad: 7
archivo_raw: "raw/08-suma-de-va/04 - Teorema Central del Límite - Introducción.pdf"
ingerido: 2026-05-30
---

# Teórica — Teorema Central del Límite (Introducción)

**Qué es:** slides manuscritas con el enunciado del TCL, las tres aproximaciones
prácticas ($Z_n$, $\bar X_n$, $S_n$) y una relectura de la LGN vía TCL.

**Cubre las unidades/temas:** unidad 7, TCL.

## Puntos clave
- $X_1,X_2,\dots$ i.i.d. con media $\mu_X$ y desvío $\sigma_X$ (**cualquier** distribución con media y desvío).
- $Z_n=\dfrac{\bar X_n-\mu_X}{\sigma_X/\sqrt n}$ tiene $E[Z_n]=0$ y $V(Z_n)=1$.
- TCL: $\displaystyle\lim_{n\to\infty}P(Z_n\le z)=\Phi(z)$ (acumulada de la $\mathcal N(0,1)$).
- Aproximaciones prácticas para $n$ grande ($>20$):
  - $P(Z_n\le z)\approx\Phi(z)$.
  - $P(\bar X_n\le x)\approx\Phi\!\left(\dfrac{x-\mu_X}{\sigma_X/\sqrt n}\right)$.
  - $P(S_n\le s)\approx\Phi\!\left(\dfrac{s-n\mu_X}{\sqrt n\,\sigma_X}\right)$.
- Relectura de la LGN: $P(|\bar X_n-\mu_X|\ge\varepsilon)\approx 2\big(1-\Phi(\tfrac{\varepsilon}{\sigma_X/\sqrt n})\big)\to 0$.

## Páginas del wiki que toca
- [[teorema-central-del-limite]]
- [[ley-de-grandes-numeros]]
- [[distribucion-normal]]
