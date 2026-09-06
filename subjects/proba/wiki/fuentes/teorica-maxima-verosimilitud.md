---
titulo: Teórica — Estimación Puntual (Máxima Verosimilitud)
resumen: 'Teórica manuscrita de la unidad 8 que enumera las cuatro fuentes de estimadores y desarrolla máxima verosimilitud: maximizar $\prod_i f(x_i;\theta)$ trabajando con la log-verosimilitud, con el ejemplo normal que devuelve $\hat\mu=\overline X_n$.'
tipo: fuente
formato: pdf
unidad: 8
archivo_raw: "raw/09-inferencia-estadistica/03 - Estimación Puntual - Máxima Verosimilitud.pdf"
ingerido: 2026-05-30
---

# Teórica — Estimación Puntual (Máxima Verosimilitud)

**Qué es:** teórica manuscrita que responde "¿de dónde salen los estimadores?"
y desarrolla el método de **máxima verosimilitud (MV)**.
**Cubre las unidades/temas:** función de verosimilitud, log-verosimilitud,
estimador de MV de la media de una normal.

## Puntos clave
- Las cuatro fuentes de estimadores: (1) máxima verosimilitud, (2) máximo a
  posteriori, (3) método de los momentos, (4) cuadrados mínimos.
- **Verosimilitud:** densidad conjunta vista como función de $\theta$,
  $f(x_1,\dots,x_n;\theta)$.
- **Estimador de MV:** $\hat\theta = \arg\max_\theta f(x_1,\dots,x_n;\theta)$.
- Con muestra i.i.d.: $f(x_1,\dots,x_n;\theta)=\prod_i f(x_i;\theta)$ y se
  trabaja con la **log-verosimilitud** $\ln f = \sum_i \ln f(x_i;\theta)$.
- **Ejemplo (normal):** $X_i\sim\mathcal N(\mu,\sigma)$ i.i.d., estimar $\mu$.
  Derivando la log-verosimilitud e igualando a 0 se obtiene
  $\hat\mu = \frac1n\sum X_i = \overline X_n$ (la derivada segunda da $-n<0$,
  confirma máximo).

## Páginas del wiki que toca
- [[estimacion-puntual]]
- [[inferencia-estadistica]]
