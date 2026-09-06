---
titulo: Teórica — Ley de los Grandes Números
resumen: 'Slides manuscritas de la unidad 7 con la ley débil de los grandes números, demostrada por Chebyshev a partir de $V(\overline X_n)=\sigma_X^2/n$, y con la ley fuerte como convergencia casi segura del promedio muestral a $\mu_X$.'
tipo: fuente
formato: pdf
unidad: 7
archivo_raw: "raw/08-suma-de-va/03 - Ley de los Grandes Números.pdf"
ingerido: 2026-05-30
---

# Teórica — Ley de los Grandes Números

**Qué es:** slides manuscritas con la **ley débil** y la **ley fuerte** de los
grandes números, más la idea de demostración de la débil vía Chebyshev.

**Cubre las unidades/temas:** unidad 7, convergencia del promedio muestral.

## Puntos clave
- $X_1,X_2,\dots$ i.i.d. con media $\mu_X$ y desvío $\sigma_X$.
- **Ley débil (LDGN):** $\displaystyle\lim_{n\to\infty}P(|\bar X_n-\mu_X|>\varepsilon)=0$ para todo $\varepsilon>0$.
  - Idea: $\bar X_n$ tiene media $\mu_X$ y varianza $\sigma_X^2/n$; por Chebyshev
    $P(|\bar X_n-\mu_X|>\varepsilon)\le\dfrac{\sigma_X^2}{n\varepsilon^2}\to 0$.
- **Ley fuerte:** $\displaystyle P\!\left(\lim_{n\to\infty}\bar X_n=\mu_X\right)=1$ (convergencia casi segura).
- Interpretación: la media muestral $\bar X_n$ aproxima la media poblacional $\mu_X$.

## Páginas del wiki que toca
- [[ley-de-grandes-numeros]]
- [[desigualdad-de-chebyshev]]
- [[promedio-muestral]]
