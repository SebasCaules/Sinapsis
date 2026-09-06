---
titulo: Integrales impropias (complemento matemático)
resumen: "Complemento matemático que repasa las integrales impropias de tipo I, con dominio no acotado, y de tipo II, con singularidad en el integrando, ambas definidas como límites; es la herramienta para normalizar densidades y calcular colas continuas."
tipo: fuente
formato: pdf
unidad: 0
archivo_raw: "raw/11-complementos-matematicos/Integrales impropias.pdf"
ingerido: 2026-05-30
---

# Integrales impropias (complemento matemático)

**Qué es:** apunte manuscrito (4 páginas) que repasa las integrales impropias —
herramienta indispensable para normalizar densidades y calcular probabilidades de
variables aleatorias continuas sobre dominios no acotados o con singularidades.

**Cubre las unidades/temas:** complementos matemáticos (sin número de unidad).
Soporte para [[variable-aleatoria-continua]] y [[funcion-de-densidad]].

## Puntos clave
- **Tipo I — dominio de integración no acotado.** Se define como límite de una
  integral sobre un intervalo finito:
  $$ \int_a^{+\infty} f(x)\,dx = \lim_{t\to\infty}\int_a^{t} f(x)\,dx,\qquad
     \int_{-\infty}^{b} f(x)\,dx = \lim_{t\to-\infty}\int_t^{b} f(x)\,dx. $$
  Para $\int_{-\infty}^{+\infty}$ se parte en dos: $\int_{-\infty}^{c}+\int_{c}^{+\infty}$.
- **Dos condiciones para que valga:** (1ro) la integral ordinaria debe existir
  para cada $t$ finito; (2do) tiene que existir el límite.
- **Tipo II — integrando no continuo en todo el intervalo** (singularidad en un
  extremo). Si $f$ es continua en $[a,b)$ pero no en $b$:
  $\int_a^b f = \lim_{t\to b^-}\int_a^t f$. Análogo si la singularidad está en $a$.
  Con singularidad interior en $c\in(a,b)$ se parte en $\int_a^c + \int_c^b$.
- **Ejemplo 1:** $\int_1^{\infty} \tfrac{1}{x^2}\,dx = 1$ (área finita bajo una cola).
- **Ejemplo 2:** $\int_2^5 \tfrac{1}{2\sqrt{x-2}}\,dx = \sqrt{3}$ (singularidad en $x=2$).

## Páginas del wiki que toca
- [[tecnica-integrales-impropias|Técnica: integrales impropias]]
- [[variable-aleatoria-continua]]
- [[funcion-de-densidad]]
