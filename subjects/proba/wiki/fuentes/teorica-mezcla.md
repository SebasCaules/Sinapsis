---
titulo: Teórica — Mezcla de Distribuciones
resumen: "Teórica manuscrita de la unidad 5 con el ejemplo del viaje en subte o colectivo: densidad y esperanza de una mezcla como promedio ponderado de las condicionales, y la advertencia de que la varianza no se promedia de esa manera."
tipo: fuente
formato: pdf
unidad: 5
archivo_raw: "raw/06-funcion-va-y-bidimensionales/09 - Bidimensionales - Mezcla.pdf"
ingerido: 2026-05-30
---

# Teórica — Mezcla de Distribuciones

**Qué es:** teórica manuscrita con el ejemplo del empleado que viaja en subte o colectivo, ilustrando la mezcla de una v.a.c. condicionada a una v.a.d.
**Cubre las unidades/temas:** mezcla de distribuciones, FDA y densidad de la mezcla, esperanza y varianza de la mezcla, probabilidad total y Bayes.

## Puntos clave
- $M$ = medio de transporte (v.a.d., $R_M=\{0,1\}$, subte/colectivo), $T$ = tiempo de viaje (v.a.c.). $T\mid M=0\sim\text{Exp}(1/30)$, $T\mid M=1\sim\text{Exp}(1/40)$, $P(M=0)=0.7$, $P(M=1)=0.3$.
- **FDA de la mezcla:** $F_T(t)=F_{T\mid M=0}(t)P(M=0)+F_{T\mid M=1}(t)P(M=1)$. Densidad: $f_T(t)=f_{T\mid M=0}(t)P(M=0)+f_{T\mid M=1}(t)P(M=1)=\frac{0.7}{30}e^{-t/30}+\frac{0.3}{40}e^{-t/40}$ para $t>0$.
- **Esperanza:** $E[T]=E[T\mid M=0]P(M=0)+E[T\mid M=1]P(M=1)=30(0.7)+40(0.3)=33$.
- **Cuidado con la varianza:** $E[T^2]=E[T^2\mid M=0](0.7)+E[T^2\mid M=1](0.3)$ usando $E[T^2]=2\lambda^{-2}$ para exponenciales; da $2(30^2)(0.7)+2(40^2)(0.3)=2220$. Luego $\text{Var}(T)=2220-33^2=1131$. **NO** es igual a $\text{Var}(T\mid M=0)P(M=0)+\text{Var}(T\mid M=1)P(M=1)=1110$ (falta el término entre medias).
- **Bayes:** $P(M=0\mid T<40)=\dfrac{P(T<40\mid M=0)P(M=0)}{P(T<40\mid M=0)P(M=0)+P(T<40\mid M=1)P(M=1)}$.
- **Caso general** ($X$ v.a.c., $M$ v.a.d.): $F_X(x)=\sum_{k\in R_M} F_{X\mid M}(x\mid k)P(M=k)$; $f_X(x)=\sum_k f_{X\mid M}(x\mid k)P(M=k)$; $E[g(X)]=\sum_k E[g(X)\mid M=k]P(M=k)$.

## Páginas del wiki que toca
- [[mezcla-de-distribuciones]]
- [[distribucion-exponencial]]
- [[probabilidad-total-y-bayes]]
