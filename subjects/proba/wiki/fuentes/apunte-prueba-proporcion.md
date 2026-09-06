---
titulo: Apunte — Prueba para la proporción
resumen: 'Apunte manuscrito de la unidad 9 que deduce, por aproximación normal, la prueba de cola derecha sobre una proporción: $\hat p_c=p_0+z_{1-\alpha}\sqrt{p_0(1-p_0)/n}$, junto con la curva $\beta(p)$ y el cálculo del valor p.'
tipo: fuente
formato: apunte
unidad: 9
archivo_raw: "raw/10-pruebas-de-hipotesis/09 - Prueba de hipotesis para la proporción.pdf"
ingerido: 2026-05-30
---

# Apunte — Prueba para la proporción

**Qué es:** Apunte manuscrito que deduce la región de rechazo, $\beta(p)$ y el
valor p para la prueba de hipótesis sobre una proporción (cola derecha).

**Cubre las unidades/temas:** unidad 9 — prueba para la proporción con $n$ grande.

## Puntos clave

- $H_0: p\le p_0$ vs $H_1: p>p_0$, nivel de significación $\alpha$.
- Por TCL, si $n$ es grande, $\hat p \sim N\!\left(p_0, \sqrt{\tfrac{p_0(1-p_0)}{n}}\right)$ bajo $H_0$.
- Error tipo I (acotado en $p=p_0$):
  $$ P(\text{Error I}) = 1-\Phi\!\left(\tfrac{\hat p_c - p_0}{\sqrt{p_0(1-p_0)/n}}\right)=\alpha \Rightarrow \hat p_c = p_0 + z_{1-\alpha}\sqrt{\tfrac{p_0(1-p_0)}{n}} $$
- $\beta(p) = \Phi\!\left(\tfrac{\hat p_c - p}{\sqrt{p(1-p)/n}}\right)$ para $p>p_0$; $\beta(\hat p_c)=0.5$, $\beta(p_0)=1-\alpha$, $\beta(1)=0$.
- Valor p (cola derecha): $\text{valor p} = P_{p_0}(\hat p \ge \hat p_{\text{obs}}) = 1-\Phi\!\left(\tfrac{\hat p_{\text{obs}}-p_0}{\sqrt{p_0(1-p_0)/n}}\right)$.

## Páginas del wiki que toca

- [[prueba-de-hipotesis-para-la-proporcion]]
- [[valor-p]]
- [[error-tipo-i-y-tipo-ii]]
