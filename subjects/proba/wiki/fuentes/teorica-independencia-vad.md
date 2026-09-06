---
titulo: Teórica — Independencia de V.A. Discretas
resumen: 'Teórica manuscrita de la unidad 5 que define la independencia de variables aleatorias discretas por la factorización $p_{X,Y}(\alpha,\beta)=p_X(\alpha)p_Y(\beta)$, deduce $E[XY]=\mu_X\mu_Y$ y advierte que covarianza nula no implica independencia.'
tipo: fuente
formato: pdf
unidad: 5
archivo_raw: "raw/06-funcion-va-y-bidimensionales/03 - Bidimensionales - V.A.D. - Independencia.pdf"
ingerido: 2026-05-30
---

# Teórica — Independencia de V.A. Discretas

**Qué es:** teórica manuscrita que define independencia de v.a. discretas y deriva sus consecuencias.
**Cubre las unidades/temas:** independencia, factorización de la conjunta, esperanza de producto, relación con covarianza.

## Puntos clave
- Si $X,Y$ son independientes: $p_{Y\mid X}(\beta\mid\alpha)=p_Y(\beta)$ y $p_{X\mid Y}(\alpha\mid\beta)=p_X(\alpha)$.
- **Definición:** $X,Y$ v.a.d. son independientes sii $p_{X,Y}(\alpha,\beta)=p_X(\alpha)\,p_Y(\beta)$ para todo $\alpha\in R_X$, $\beta\in R_Y$.
- En el ejemplo de la urna: $p_{X,Y}(0,0)=0.1\neq p_X(0)p_Y(0)=0.5\cdot0.4=0.2$ → NO son independientes.
- Si $X,Y$ independientes: $E[g_1(X)\,g_2(Y)]=E[g_1(X)]\,E[g_2(Y)]$. En particular $E[XY]=\mu_X\mu_Y$.
- Consecuencia: $X,Y$ independientes $\Rightarrow \text{Cov}(X,Y)=0$ y $\rho_{X,Y}=0$.
- **¡Ojo!** No vale el recíproco: $\text{Cov}(X,Y)=0 \not\Rightarrow X,Y$ independientes.

## Páginas del wiki que toca
- [[independencia-de-variables-aleatorias]]
- [[covarianza-y-correlacion]]
