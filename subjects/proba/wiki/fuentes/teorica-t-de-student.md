---
titulo: Teórica — Distribución t de Student
resumen: 'Teórica manuscrita de la unidad 8 sobre la t de Student: densidad simétrica, varianza $(n-1)/(n-3)$ con colas más pesadas que la normal, convergencia a $\mathcal N(0,1)$ y fractiles mayores cuando hay menos grados de libertad.'
tipo: fuente
formato: pdf
unidad: 8
archivo_raw: "raw/09-inferencia-estadistica/04 - Intervalos de Confianza - Media con Desvío Desconocido - t de Student.pdf"
ingerido: 2026-05-30
---

# Teórica — Distribución t de Student

**Qué es:** teórica manuscrita con la distribución t de Student: densidad,
momentos, comparación con la normal y comportamiento de los fractiles.
**Cubre las unidades/temas:** densidad de la t, simetría, esperanza/varianza
según grados de libertad, convergencia a la normal, fractiles.

## Puntos clave
- $T = \dfrac{\overline X_n-\mu}{S_n/\sqrt n} \sim t_{n-1}$; cuando $n\to\infty$,
  $t_{n-1}\to\mathcal N(0,1)$. (William S. Gosset, "Student".)
- **Densidad** ($n$ = grados de libertad):
  $$f_T(t)=\frac{1}{\sqrt{(n-1)\pi}}\frac{\Gamma(\frac n2)}{\Gamma(\frac{n-1}{2})}\left(1+\frac{t^2}{n-1}\right)^{-\frac n2}.$$
  Es **simétrica** ($f_T(-t)=f_T(t)$) y tiende a la densidad de $\mathcal N(0,1)$.
- **Momentos** (con $n$ grados de libertad): $E[T]=0$ si $n>2$ (no def. si $n\le 2$);
  $V(T)=\frac{n-1}{n-3}>1$ si $n>3$. Tiene **colas más pesadas** que la normal.
- **Fractiles:** $t_{m,\gamma}=F_{T_m}^{-1}(\gamma)$. Si $\ell>m$ entonces
  $t_{m,\gamma}>t_{\ell,\gamma}>z_\gamma$, y $t_{\ell,\gamma}\to z_\gamma$ cuando
  $\ell\to\infty$. Es decir, con menos grados de libertad el fractil es mayor
  (intervalos más anchos).

## Páginas del wiki que toca
- [[distribucion-t-de-student]]
- [[intervalos-de-confianza]]
