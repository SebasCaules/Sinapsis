---
titulo: Teórica — Función de Variable Aleatoria
resumen: "Teórica manuscrita de la unidad 5 sobre cómo obtener la distribución de $Y=g(X)$ por el método de la función de distribución acumulada, con transformaciones afines de normales y el método de la transformada inversa para simular distribuciones."
tipo: fuente
formato: pdf
unidad: 5
archivo_raw: "raw/06-funcion-va-y-bidimensionales/01 - Función de variable aleatoria.pdf"
ingerido: 2026-05-30
---

# Teórica — Función de Variable Aleatoria

**Qué es:** teórica manuscrita sobre cómo obtener la distribución de $Y=g(X)$ a partir de la de $X$, con varios ejemplos y la aplicación a la generación de números aleatorios.
**Cubre las unidades/temas:** transformación $Y=g(X)$, método de la FDA, transformaciones afines, v.a. normales, método de la transformada inversa.

## Puntos clave
- **Procedimiento general** para $Y=g(X)$: (1) partir de $F_X$; (2) determinar $F_Y(y)=P(Y\le y)=P(g(X)\le y)$; (3) derivar/sumar para obtener $f_Y$ o $p_Y$. A veces el paso por la FDA no es necesario (caso discreto sencillo).
- Tipos de transformación: continua→continua, continua→discreta, discreta→discreta (no toda combinación es posible).
- **Ejemplo 1** (discreto, $Y=|X|$): $R_X=\{-2,-1,0,1,2\}$, $g$ no inyectiva; se suman las probabilidades de las preimágenes.
- **Ejemplo 2** ($W=V^2/1\Omega$ con $V\sim N(0,1)$): $f_W(w)=\frac{1}{\sqrt{2\pi w}}e^{-w/2}$ para $w>0$ (es una [[distribucion-ji-cuadrado|Chi-cuadrado]] con 1 g.l.). Resuelto en [[funcion-de-variable-aleatoria]].
- **Ejemplo 3** (uniforme → discreta): clasificación del pH del agua en 3 tipos a partir de $U\sim\text{Unif}(5,8)$.
- **Transformaciones afines** $Y=aX+b$: $\mu_Y=a\mu_X+b$, $\sigma_Y^2=a^2\sigma_X^2$, $\sigma_Y=|a|\sigma_X$; asimetría $\gamma_Y=\text{sign}(a)\gamma_X$, curtosis $\kappa_Y=\kappa_X$ (si $a\neq0$). Si $a=0$, $Y=b$ constante.
- **Normales:** si $X\sim N(\mu_X,\sigma_X)$ y $a\neq0$, $Y=aX+b\sim N(a\mu_X+b,|a|\sigma_X)$. Estandarización $Z=(Y-\mu_Y)/\sigma_Y\sim N(0,1)$.
- **Método de la transformada inversa:** si $U\sim\text{Unif}(0,1)$ y $Y=F_X^{-1}(U)$ entonces $F_Y=F_X$. Sirve para simular cualquier distribución. Inversa generalizada $F_X^{\leftarrow}(u)=\min\{x:u\le F_X(x)\}$. Ejemplos: simular Bernoulli(0.6) y Exp(0.5) desde una uniforme.

## Páginas del wiki que toca
- [[funcion-de-variable-aleatoria]]
- [[tecnica-distribucion-de-una-funcion-de-va]]
- [[mezcla-de-distribuciones]]
- [[distribucion-normal]]
- [[distribucion-exponencial]]
- [[distribucion-ji-cuadrado]]
