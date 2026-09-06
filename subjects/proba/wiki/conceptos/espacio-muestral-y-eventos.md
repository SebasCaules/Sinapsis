---
titulo: Espacio muestral y eventos
resumen: 'Vocabulario de conjuntos de la probabilidad: el espacio muestral $S$ reúne todos los resultados posibles y un evento es un subconjunto $A\subseteq S$. Se opera con complemento, unión e intersección; son excluyentes si $A\cap B=\emptyset$.'
tipo: concepto
unidad: 2
orden: 2
tags: [probabilidad, fundamentos, conjuntos]
fuentes: ["[[axiomas-probabilidad]]"]
actualizado: 2026-06-06
---

# Espacio muestral y eventos

**En breve.** Es el vocabulario de conjuntos sobre el que se monta toda la
[[probabilidad|probabilidad]]: el experimento da resultados, $S$ los junta a todos y
un evento es un subconjunto de $S$ al que después le pondremos un número entre 0 y 1.

- **Experimento aleatorio $E$**: aquel cuyos resultados son **inciertos**.
- **Espacio muestral $S$**: conjunto de **todos** los resultados posibles.
- **Suceso / evento $A$**: un subconjunto de resultados, $A \subseteq S$.

**Ejemplo** (tirar un dado): $S=\{1,2,3,4,5,6\}$; "sale par" $A=\{2,4,6\}$,
"múltiplo de 3" $=\{3,6\}$, "no es primo" $=\{4,6\}$.

## Álgebra de sucesos
Con eventos se opera como con conjuntos:
- **Complemento** $A^c = S\setminus A$ ("que **no** ocurra $A$").
- **Unión** $A\cup B$ ("ocurre $A$ **o** $B$").
- **Intersección** $A\cap B$ ("ocurre $A$ **y** $B$").
- **[[leyes-de-de-morgan|De Morgan]]**: $(A\cup B)^c = A^c\cap B^c$ y $(A\cap B)^c = A^c\cup B^c$.

## Eventos mutuamente excluyentes (m.e.)
$A$ y $B$ son **mutuamente excluyentes** si $A\cap B=\emptyset$ (no pueden ocurrir
juntos). Clave para sumar probabilidades (3er [[axiomas-de-probabilidad|axioma]]).

## σ-álgebra $\Sigma$
La colección de eventos a los que se les asigna probabilidad. $\Sigma$ es una
**σ-álgebra** de $S$ sii:

**Intuición.** No siempre hace falta (cuando $S$ es finito se toma $\Sigma=2^S$, todos
los subconjuntos), pero conceptualmente es "la lista de preguntas con respuesta": si
puede preguntar por $A$, también puede preguntar por "no $A$" (axioma 2) y por
"alguno de estos" (axioma 3). Las tres condiciones garantizan que cualquier operación
de conjuntos sensata sobre eventos medibles vuelve a dar un evento medible.

1. $S \in \Sigma$.
2. $A\in\Sigma \Rightarrow A^c \in\Sigma$ (cerrada por complemento).
3. $A_1,A_2,\dots\in\Sigma \Rightarrow \bigcup_i A_i \in\Sigma$ (unión numerable).

De ahí: también contiene $\emptyset$ (**suceso imposible**) y las intersecciones
(por [[leyes-de-de-morgan|De Morgan]]). $S$ es el **suceso cierto**.

> Es el dominio de la medida de probabilidad $P$ en [[axiomas-de-probabilidad]].
