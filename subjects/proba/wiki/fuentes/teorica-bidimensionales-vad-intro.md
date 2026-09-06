---
titulo: Teórica — Bidimensionales V.A.D. Intro
resumen: "Teórica manuscrita de la unidad 5 que introduce las variables aleatorias discretas bidimensionales con el ejemplo de la moneda y la urna: función de masa conjunta, marginales por suma, descomposición condicional y esperanza de $g(X,Y)$."
tipo: fuente
formato: pdf
unidad: 5
archivo_raw: "raw/06-funcion-va-y-bidimensionales/01 - Bidimensionales - V.A.D. - Intro.pdf"
ingerido: 2026-05-30
---

# Teórica — Bidimensionales V.A.D. Intro

**Qué es:** teórica manuscrita que introduce las variables aleatorias discretas bidimensionales con el ejemplo de la urna (moneda + bolilla).
**Cubre las unidades/temas:** función de masa de probabilidad conjunta, marginales discretas, valor esperado de $g(X,Y)$.

## Puntos clave
- Experimento de la urna: arranca con 10 blancas y 5 negras (15 en total). Se tira una moneda: si sale **cara** se agregan 10 negras (queda 10B, 15N) y si sale **ceca** se agregan 10 blancas (queda 20B, 5N); luego se extrae una bolilla. $X$ = resultado de la moneda (0 ceca, 1 cara), $Y$ = color de la bolilla (0 negra, 1 blanca). De ahí $P(Y=1\mid X=1)=10/25=0.4$ y $P(Y=1\mid X=0)=20/25=0.8$.
- Tabla conjunta $p_{X,Y}$: $(0,0)=0.1$, $(0,1)=0.4$, $(1,0)=0.3$, $(1,1)=0.2$. Marginales $p_X=(0.5,0.5)$, $p_Y=(0.4,0.6)$.
- Descomposición vía condicional: $p_{X,Y}(0,0)=P(Y=0\mid X=0)\,P(X=0)=p_{Y\mid X}(0\mid 0)\,p_X(0)$.
- Condición de normalización: $\sum_{\beta\in R_Y}\sum_{\alpha\in R_X} p_{X,Y}(\alpha,\beta)=1$.
- Marginales por suma: $p_X(\alpha)=\sum_{\beta\in R_Y} p_{X,Y}(\alpha,\beta)$, $p_Y(\beta)=\sum_{\alpha\in R_X} p_{X,Y}(\alpha,\beta)$.
- Valor esperado: $E[g(X,Y)]=\sum_{\alpha}\sum_{\beta} g(\alpha,\beta)\,p_{X,Y}(\alpha,\beta)$. Si $g$ depende solo de $X$, se recupera $E[h(X)]=\sum_\alpha h(\alpha)\,p_X(\alpha)$.

## Páginas del wiki que toca
- [[variables-aleatorias-bidimensionales]]
- [[independencia-de-variables-aleatorias]]
- [[covarianza-y-correlacion]]
