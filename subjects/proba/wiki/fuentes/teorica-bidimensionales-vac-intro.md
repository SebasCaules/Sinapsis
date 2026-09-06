---
titulo: Teórica — Bidimensionales V.A.C. Intro
resumen: "Teórica manuscrita extensa, de 27 páginas, sobre variables aleatorias continuas bidimensionales: densidad conjunta, marginales, esperanza de $g(X,Y)$, independencia y densidades y esperanzas condicionales, con el ejemplo de las piezas cilíndricas."
tipo: fuente
formato: pdf
unidad: 5
archivo_raw: "raw/06-funcion-va-y-bidimensionales/04 - Bidimensionales - V.A.C. - Intro.pdf"
ingerido: 2026-05-30
---

# Teórica — Bidimensionales V.A.C. Intro

**Qué es:** teórica manuscrita extensa (27 páginas) sobre variables aleatorias continuas bidimensionales, con el ejemplo desarrollado de las piezas cilíndricas (radio $R$, altura $H$).
**Cubre las unidades/temas:** densidad conjunta, marginales continuas, valor esperado de $g(X,Y)$, covarianza/correlación, independencia (discreta y continua), caso normal, densidades y esperanzas condicionales, ley de esperanza total.

## Puntos clave
- **Densidad conjunta** $f_{X,Y}\ge0$: $P((X,Y)\in B)=\iint_B f_{X,Y}(x,y)\,dx\,dy$; normalización $\iint_{\mathbb{R}^2} f_{X,Y}=1$.
- **Marginales:** $f_X(t)=\int_{-\infty}^{\infty} f_{X,Y}(t,y)\,dy$, $f_Y(u)=\int_{-\infty}^{\infty} f_{X,Y}(x,u)\,dx$ (vía Fubini + Teorema Fundamental del Cálculo a partir de $F_X$).
- Tabla comparativa V.A.D. vs V.A.C. (suma ↔ integral).
- **Valor esperado:** $E[g(X,Y)]=\iint_{\mathbb{R}^2} g(x,y)\,f_{X,Y}(x,y)\,dx\,dy$.
- Cov y $\rho$ idénticas al caso discreto. **Independencia continua:** $f_{X,Y}(x,y)=f_X(x)f_Y(y)$ para todo $(x,y)$.
- **Resumen V.A.C. 2D:** (i) indep $\Rightarrow E[g(X)h(Y)]=E[g(X)]E[h(Y)]$; (ii) indep $\Rightarrow \text{Cov}=0\Rightarrow\rho=0$; (iii) **si $\text{Cov}=0$ Y $X,Y$ son normales/gaussianas $\Rightarrow$ independientes** (caso especial donde sí vale el recíproco).
- **Ejemplo cilindro** $f_{R,H}(r,h)=\frac{3}{500}r$ en $0<r<h<10$: se halla $k=3/5000$, marginales $f_R(r)=\frac{3}{500}r(10-r)$, $f_H(h)=\frac{3}{1000}h^2$; $R,H$ NO independientes (vía densidades y vía $\text{Cov}(R,H)=2.5\neq0$).
- **Densidades condicionales:** $f_{X\mid Y}(x\mid y)=\dfrac{f_{X,Y}(x,y)}{f_Y(y)}$. Independencia sii $f_{X\mid Y}=f_X$.
- **Esperanza condicional:** $E[g(X)\mid Y=y]=\int g(x)f_{X\mid Y}(x\mid y)\,dx$. **Ley de esperanza total:** $E[g(X)]=E[E[g(X)\mid Y=y]]=\int E[g(X)\mid Y=y]f_Y(y)\,dy$.

## Páginas del wiki que toca
- [[variables-aleatorias-bidimensionales]]
- [[independencia-de-variables-aleatorias]]
- [[covarianza-y-correlacion]]
- [[mezcla-de-distribuciones]]
- [[funcion-de-densidad]]
