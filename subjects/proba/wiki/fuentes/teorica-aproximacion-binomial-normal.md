---
titulo: Teórica — TCL: Aproximación de la Binomial por la Normal
resumen: 'Slides manuscritas de la unidad 7 que derivan, con la fórmula de Stirling y el desarrollo de Taylor, el teorema de De Moivre-Laplace: una $\mathrm{Bin}(n,p)$ se aproxima por una normal de media $np$ y desvío $\sqrt{npq}$, con corrección por continuidad.'
tipo: fuente
formato: pdf
unidad: 7
archivo_raw: "raw/08-suma-de-va/05 - TCL - Aproximación de la Binomial por la Normal.pdf"
ingerido: 2026-05-30
---

# Teórica — TCL: Aproximación de la Binomial por la Normal

**Qué es:** slides manuscritas que derivan, vía fórmula de Stirling y desarrollo
de Taylor de $\ln(1+x)$, que la PMF de una $\mathrm{Bin}(n,p)$ se aproxima por la
densidad de una $\mathcal N(np,\sqrt{npq})$ (teorema de De Moivre–Laplace).

**Cubre las unidades/temas:** unidad 7, aproximación normal de la binomial, corrección por continuidad.

## Puntos clave
- $S_n\sim\mathrm{Bin}(n,p)$ con $\mu_{S_n}=np$, $\sigma_{S_n}^2=npq$.
- Herramientas: **Stirling** $n!=\sqrt{2\pi n}\,n^n e^{-n}(1+O(1/n))$ y **Taylor** $\ln(1+x)=x-\tfrac{x^2}{2}+O(x^3)$.
- Tras el desarrollo: $P(S_n=x)\approx\dfrac{1}{\sqrt{2\pi npq}}\,e^{-\frac{(x-np)^2}{2npq}}$,
  es decir la densidad de una $\mathcal N(np,\sqrt{npq})$ evaluada en $x$.
- **Corrección por continuidad** (aproximar discreta por continua):
$$
P(S_n=s)\approx\Phi\!\left(\tfrac{s+\frac12-np}{\sqrt{npq}}\right)-\Phi\!\left(\tfrac{s-\frac12-np}{\sqrt{npq}}\right).
$$

## Páginas del wiki que toca
- [[aproximacion-normal-de-la-binomial]]
- [[teorema-central-del-limite]]
- [[distribucion-binomial]]
- [[distribucion-normal]]
