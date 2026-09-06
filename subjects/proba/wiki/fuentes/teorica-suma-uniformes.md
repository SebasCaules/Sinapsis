---
titulo: Teórica — Suma de Dos Uniformes
resumen: "Slides manuscritas de la unidad 7 que calculan por convolución la suma de dos uniformes en $(0,1)$ y obtienen una densidad triangular en $(0,2)$: la familia uniforme no es estable frente a la suma, cambian soporte y forma."
tipo: fuente
formato: pdf
unidad: 7
archivo_raw: "raw/08-suma-de-va/05 - Suma de Variables Aleatorias Independientes - Dos Uniformes.pdf"
ingerido: 2026-05-30
---

# Teórica — Suma de Dos Uniformes

**Qué es:** slides manuscritas que calculan por convolución la densidad de la
suma de dos $\mathrm{Unif}(0,1)$ independientes, obteniendo una densidad
**triangular** (¡la suma NO es uniforme!).

**Cubre las unidades/temas:** unidad 7, convolución continua, suma de uniformes.

## Puntos clave
- $X,Y\sim\mathrm{Unif}(0,1)$ indep., $f_X=f_Y=1$ en $(0,1)$.
- $f_S(s)=\int_0^1 f_X(s-y)\,dy$; el integrando vale $1$ sólo cuando $s-1<y<s$.
- Resultado (densidad triangular en $(0,2)$):
$$
f_S(s)=\begin{cases} s & 0<s<1\\ 2-s & 1\le s<2\\ 0 & \text{en otro caso}\end{cases}
$$
- **Moraleja:** la familia uniforme **no** es estable bajo suma. El soporte se ensancha y la forma cambia.

## Páginas del wiki que toca
- [[suma-de-va-independientes]]
- [[distribucion-uniforme-continua]]
