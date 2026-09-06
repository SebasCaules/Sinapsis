---
titulo: "Cadenas de Markov (slides)"
resumen: 'Presentación de la unidad 6 sobre cadenas de Markov: matriz de transición, Chapman-Kolmogorov matricial $\vec p(n)=\vec p(0)\,\mathbb{P}^n$, distribución estacionaria de la cadena regular y ejemplos con estados absorbentes y periódicos.'
tipo: fuente
formato: slides
unidad: 6
archivo_raw: "raw/07-procesos-estocasticos/01 - Cadenas de Markov.pptx"
ingerido: 2026-05-30
---

# Cadenas de Markov (slides)

**Qué es:** presentación teórica sobre cadenas de Markov, desde la definición
hasta la distribución estacionaria, con varios ejemplos resueltos.
**Cubre las unidades/temas:** proceso de Markov vs. cadena de Markov, matriz de
transición, ecuación de Chapman-Kolmogorov en forma matricial, cadena homogénea,
diagrama de estados, distribución estacionaria, cadena regular, estados
absorbentes y periódicos.

## Puntos clave
- Una **cadena de Markov** es un proceso de Markov con espacio de estados
  **discreto**. Queda descripta por la distribución inicial $\vec p(0)$ y la
  **matriz de transición** $\mathbb{P}$ (filas suman 1).
- Chapman-Kolmogorov matricial: $\vec p(n+1)=\vec p(n)\,\mathbb{P}$; para cadena
  **homogénea** $\vec p(n)=\vec p(0)\,\mathbb{P}^n$.
- **Distribución estacionaria** $\vec\pi=\vec\pi\,\mathbb{P}$ (autovector a
  izquierda con autovalor 1). Condición suficiente de existencia: cadena
  **regular** ($\mathbb{P}^n>0$ para algún $n$), y entonces $\vec\pi$ no depende
  de $\vec p(0)$.
- Ejemplos: el vendedor viajero (cadena regular de 3 estados), el bebé (cadena
  **periódica**, sin estacionaria pero con promedios temporales), la vida
  (estado **absorbente**: la muerte).

## Páginas del wiki que toca
- [[cadenas-de-markov]]
- [[procesos-estocasticos]] (hub)
