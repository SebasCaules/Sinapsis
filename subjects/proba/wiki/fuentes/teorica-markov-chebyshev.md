---
titulo: Teórica — Desigualdades de Markov y Chebyshev
resumen: 'Slides manuscritas de la unidad 7 con enunciado y demostración de las desigualdades de Markov, $P(X\ge\alpha)\le E[X]/\alpha$ para $X\ge 0$, y de Chebyshev, $P(|X-\mu|\ge\varepsilon)\le\sigma_X^2/\varepsilon^2$, válidas sin conocer la distribución.'
tipo: fuente
formato: pdf
unidad: 7
archivo_raw: "raw/08-suma-de-va/01 - Desigualdades de Markov y Chebychev.pdf"
ingerido: 2026-05-30
---

# Teórica — Desigualdades de Markov y Chebyshev

**Qué es:** slides manuscritas con los enunciados y las demostraciones de las
desigualdades de Markov y de Chebyshev.

**Cubre las unidades/temas:** unidad 7, cotas de probabilidad.

## Puntos clave
- **Markov:** si $X\ge 0$, entonces $P(X\ge\alpha)\le\dfrac{E[X]}{\alpha}$ para todo $\alpha>0$.
  - Demo (caso continuo): se acota $\mathbb 1_{\{x\ge\alpha\}}\le \tfrac{x}{\alpha}$ dentro de la integral.
- **Chebyshev:** $P(|X-\mu|\ge\varepsilon)\le\dfrac{\sigma_X^2}{\varepsilon^2}$ para todo $\varepsilon>0$.
  - Demo: aplicar Markov a la v.a. no negativa $(X-\mu)^2$ con $\alpha=\varepsilon^2$.
- No asumen nada sobre la distribución $\Rightarrow$ cotas válidas pero poco ajustadas.

## Páginas del wiki que toca
- [[desigualdad-de-chebyshev]]
- [[ley-de-grandes-numeros]]
