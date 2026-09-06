---
titulo: Leyes de De Morgan
resumen: 'Al negar, unión e intersección se intercambian: $\overline{C\cup D}=\overline{C}\cap\overline{D}$ y $\overline{C\cap D}=\overline{C}\cup\overline{D}$. Es el recurso para traducir «ninguno» en el complemento de la unión.'
tipo: concepto
unidad: 2
orden: 3
tags: [probabilidad, conjuntos, fundamentos]
fuentes: ["[[tp2-calculo-de-probabilidades]]"]
actualizado: 2026-09-04
---

# Leyes de De Morgan

**En breve.** Reglas para "meter" un complemento dentro de una unión o intersección,
intercambiando $\cup\leftrightarrow\cap$. Son la herramienta para traducir "ninguno"
en "complemento de la unión", el truco que más aparece en parciales de
[[probabilidad|probabilidad]].

Las **leyes de De Morgan** relacionan complemento, unión e intersección de eventos.
Para dos eventos $C, D$:
$$ \overline{C\cup D} = \overline{C}\cap\overline{D}, \qquad
   \overline{C\cap D} = \overline{C}\cup\overline{D}. $$
En palabras: el complemento de "$C$ **o** $D$" es "**ni** $C$ **ni** $D$"; el
complemento de "$C$ **y** $D$" es "no $C$ **o** no $D$".

**Intuición.** Negar "pasa al menos uno" equivale a "no pasa ninguno" (hay que negar
*todos* a la vez → intersección de complementos). Negar "pasan los dos" equivale a
"falla al menos uno" (basta con que falle uno → unión de complementos). Negar siempre
**da vuelta** el "y" en "o" y viceversa.

**Versión general** (para $A_1,\dots,A_n$):
$$ \overline{\bigcup_{i} A_i} = \bigcap_{i}\overline{A_i}, \qquad
   \overline{\bigcap_{i} A_i} = \bigcup_{i}\overline{A_i}. $$

## Consecuencias sobre probabilidades
Combinando De Morgan con el [[axiomas-de-probabilidad|complemento]]
$P(\overline{A})=1-P(A)$ (según [[tp2-calculo-de-probabilidades]], ej. 14):
$$ P\!\left(\overline{C}\cap\overline{D}\right) = P\!\left(\overline{C\cup D}\right) = 1 - P(C\cup D), $$
$$ P\!\left(\overline{C}\cup\overline{D}\right) = P\!\left(\overline{C\cap D}\right) = 1 - P(C\cap D). $$

> [!figura] u2-de-morgan-cuatro-paneles
> Arriba, $(A\cup B)^c$ y $A^c\cap B^c$ sombrean exactamente la misma región; abajo ocurre lo mismo con $(A\cap B)^c$ y $A^c\cup B^c$. Es la comprobación visual de que negar convierte la unión en intersección y viceversa.

> Truco de parcial: cuando piden $P(\text{ninguno de varios})$, conviene casi siempre
> pasar al **complemento de la unión** $1-P(A_1\cup\cdots\cup A_n)$ y, si hace falta,
> desarrollar la unión con [[tecnica-conteo-combinatoria|inclusión-exclusión]].

## Ejercicio resuelto — grupo sanguíneo 0 negativo
*(Adaptado de [[tp2-calculo-de-probabilidades]] ej. 14.)* Una persona es **0 negativo**
si no tiene **ninguno** de los tres antígenos $A$, $B$, $Rh$: el evento es
$0^- = \overline{A}\cap\overline{B}\cap\overline{Rh}$.

**Resolución.** Por De Morgan,
$$ P(0^-) = P\!\left(\overline{A}\cap\overline{B}\cap\overline{Rh}\right)
         = 1 - P\!\left(\overline{\,\overline{A}\cap\overline{B}\cap\overline{Rh}\,}\right)
         = 1 - P(A\cup B\cup Rh). $$
Con [[tecnica-conteo-combinatoria|inclusión-exclusión]] de 3 eventos y los datos
$P(A)=0.4$, $P(B)=0.5$, $P(Rh)=0.6$, $P(A\cap B)=0.2$, $P(A\cap Rh)=0.3$,
$P(B\cap Rh)=0.3$, $P(A\cap B\cap Rh)=0.2$:
$$ P(A\cup B\cup Rh) = 0.4+0.5+0.6 - 0.2-0.3-0.3 + 0.2 = 0.9, $$
$$ P(0^-) = 1 - 0.9 = 0.1 \;\Rightarrow\; 10\%. $$

## Relación
- [[espacio-muestral-y-eventos]] — álgebra de sucesos (donde aparece la ley).
- [[axiomas-de-probabilidad]] — complemento $P(\overline{A})=1-P(A)$.
- [[tecnica-conteo-combinatoria]] — inclusión-exclusión, que combina con De Morgan.
- Se usa también en [[tp2-calculo-de-probabilidades]] ej. 28 (transmisión) para
  reescribir $\overline{\overline{X}\cup\overline{Y}}=X\cap Y$.
