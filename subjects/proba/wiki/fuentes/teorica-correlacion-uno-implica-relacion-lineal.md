---
titulo: Teórica — Correlación ±1 implica relación lineal
resumen: 'Teórica manuscrita de la unidad 5 con la varianza de una combinación lineal $\mathrm{Var}(aX+bY)$ y la prueba de que $\rho_{X,Y}=\pm1$ implica $Y=aX+b$ con probabilidad 1, con el signo de la pendiente igual al signo de la correlación.'
tipo: fuente
formato: pdf
unidad: 5
archivo_raw: "raw/06-funcion-va-y-bidimensionales/11 - Bidimensionales - Correlación igual a 1 implica relación lineal.pdf"
ingerido: 2026-05-30
---

# Teórica — Correlación ±1 implica relación lineal

**Qué es:** teórica manuscrita que prueba la propiedad (2) del coeficiente de correlación y la fórmula de la varianza de una combinación lineal.
**Cubre las unidades/temas:** varianza de $aX+bY$, $\rho=\pm1$ ⟺ relación lineal.

## Puntos clave
- **Varianza de una combinación lineal:** $\text{Var}(aX+bY)=a^2\text{Var}(X)+2ab\,\text{Cov}(X,Y)+b^2\text{Var}(Y)$. Casos: $\text{Var}(X+Y)=\text{Var}(X)+2\text{Cov}(X,Y)+\text{Var}(Y)$, $\text{Var}(X-Y)=\text{Var}(X)-2\text{Cov}(X,Y)+\text{Var}(Y)$.
- Si $\rho_{X,Y}=1$: $\text{Var}\!\left(\dfrac{X}{\sigma_X}-\dfrac{Y}{\sigma_Y}\right)=1-2\rho_{X,Y}+1=0$ → $\dfrac{X}{\sigma_X}-\dfrac{Y}{\sigma_Y}=d$ con prob. 1 → $Y=\dfrac{\sigma_Y}{\sigma_X}X-d\sigma_Y$ (relación lineal con pendiente positiva).
- Si $\rho_{X,Y}=-1$: $\text{Var}\!\left(\dfrac{X}{\sigma_X}+\dfrac{Y}{\sigma_Y}\right)=1+2\rho_{X,Y}+1=0$ → $Y=-\dfrac{\sigma_Y}{\sigma_X}X+\sigma_Y d$ (pendiente negativa).
- **Conclusión:** $\rho_{X,Y}=\pm1\Rightarrow$ existe $d\in\mathbb{R}$ tal que $Y=\rho_{X,Y}\sigma_Y\!\left[\dfrac{X}{\sigma_X}-d\right]$ con prob. 1; es decir $Y=aX+b$ con prob. 1, $a\neq0$, y $\text{sign}(a)=\text{sign}(\rho)$.

## Páginas del wiki que toca
- [[covarianza-y-correlacion]]
