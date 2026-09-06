---
titulo: Teórica — La correlación siempre está entre -1 y +1
resumen: 'Teórica manuscrita de la unidad 5 que demuestra que $\rho_{X,Y}$ vive en el intervalo $[-1,1]$: como $\mathrm{Var}(zX+Y)\ge0$ para todo $z$, el discriminante de ese polinomio cuadrático es no positivo y sale la desigualdad de Cauchy-Schwarz.'
tipo: fuente
formato: pdf
unidad: 5
archivo_raw: "raw/06-funcion-va-y-bidimensionales/10 - Bidimensionales - Correlación siempre entre -1 y +1.pdf"
ingerido: 2026-05-30
---

# Teórica — La correlación siempre está entre -1 y +1

**Qué es:** teórica manuscrita que demuestra la propiedad (1) del coeficiente de correlación: $\rho_{X,Y}\in[-1,+1]$.
**Cubre las unidades/temas:** desigualdad de Cauchy-Schwarz vía discriminante, acotación de $\rho$.

## Puntos clave
- Considera $P_2(z)=\text{Var}(zX+Y)=z^2\text{Var}(X)+2z\,\text{Cov}(X,Y)+\text{Var}(Y)\ge0$ para todo $z$ (es una varianza).
- Un polinomio cuadrático $\ge0$ tiene discriminante $\le0$: $[2\text{Cov}(X,Y)]^2-4\text{Var}(X)\text{Var}(Y)\le0$.
- Por lo tanto $(\text{Cov}(X,Y))^2\le\text{Var}(X)\text{Var}(Y)$ (Cauchy-Schwarz).
- Dividiendo por $\sigma_X^2\sigma_Y^2$: $\left(\dfrac{\text{Cov}(X,Y)}{\sigma_X\sigma_Y}\right)^2\le1$, es decir $\rho_{X,Y}^2\le1$ → $\rho_{X,Y}\in[-1,+1]$.

## Páginas del wiki que toca
- [[covarianza-y-correlacion]]
