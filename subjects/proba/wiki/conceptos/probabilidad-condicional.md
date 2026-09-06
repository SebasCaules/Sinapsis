---
titulo: Probabilidad condicional
resumen: 'Mide la probabilidad de $D$ sabiendo que ocurrió $C$, reduciendo el universo a $C$: $P(D\mid C)=P(D\cap C)/P(C)$, con $P(C)\neq 0$. Reordenada da la regla de la multiplicación, base de la probabilidad total y de Bayes.'
tipo: concepto
unidad: 2
orden: 7
tags: [probabilidad, condicional]
fuentes: ["[[independencia-condicional-bayes]]", "[[video-condicional]]"]
actualizado: 2026-09-04
---

# Probabilidad condicional

**En breve.** Mide la chance de $D$ una vez que se sabe que $C$ ocurrió: se achica el
universo a $C$ y se mira qué fracción de $C$ también cumple $D$. Es el ladrillo de la
[[independencia]], la [[probabilidad-total-y-bayes|probabilidad total y Bayes]] y el
[[arbol-de-probabilidades|árbol de probabilidades]].

> **Intuición frecuentista ([[video-condicional]], 00:04-08:18):** Si se repite un
> experimento muchas veces y se sabe que ocurrió $C$, la frecuencia relativa de $B$
> ya no se calcula sobre el total de repeticiones sino solo sobre aquellas en las
> que $C$ ocurrió — eso es exactamente "restringir los casos totales a $C$".
> Formalmente,
> $$ \frac{n_{B\cap C}}{n_C} = \frac{n_{B\cap C}/n}{n_C/n} \xrightarrow[n\to\infty]{} \frac{P(B\cap C)}{P(C)}, $$
> que es la definición de $P(B\mid C)$.

La probabilidad de $D$ **dado** $C$ (sabiendo que $C$ ocurrió), con $P(C)\neq 0$:
$$ P(D\mid C) = \frac{P(D\cap C)}{P(C)}. $$
**Idea**: condicionar a $C$ es *reducir el universo* de todo $S$ a solo $C$; ahora
$C$ pasa a ser el nuevo "espacio cierto" y se cuentan los casos de $D$ dentro de $C$.

> ⚠️ Si $P(C)=0$, la condicional $P(D\mid C)$ **no está definida** (división por cero):
> no se puede condicionar a un suceso de probabilidad nula. La definición exige
> explícitamente $P(C)\neq 0$ ([[tp2-calculo-de-probabilidades]], repaso).

> Frases que indican condicional: "si...", "sabiendo que...", "dado que...", "de los
> casos en que...".
>
> La probabilidad condicional **cumple todos los [[axiomas-de-probabilidad|axiomas]]**
> (es una probabilidad legítima sobre el universo reducido).

## Ejercicio resuelto
*Se tiran dos dados y la suma es $\ge 8$. ¿Probabilidad de que la suma sea par?*

> [!figura] u2-dados-condicional-grilla
> Las 36 celdas equiprobables de $S$, con $C=\{\text{suma}\ge 8\}$ marcado en el borde y $D=\{\text{suma par}\}$ en el relleno. Al restringir el universo a $C$ ninguna celda cambia de lugar: solo cae el denominador, de 36 casos a 15, y por eso $P(D)=\tfrac12$ se convierte en $P(D\mid C)=\tfrac{9}{15}$.

Sea $C=\{\text{suma}\ge 8\}$ y $D=\{\text{suma par}\}$.
- $|C| = 15$ casos $\Rightarrow P(C)=\tfrac{15}{36}$.
- $C\cap D$ (suma $\ge 8$ **y** par: 8, 10, 12) $= 9$ casos $\Rightarrow P(C\cap D)=\tfrac{9}{36}$.
$$ P(D\mid C) = \frac{P(D\cap C)}{P(C)} = \frac{9/36}{15/36} = \frac{9}{15} = \frac{3}{5} = 0.6. $$

## Error común

> ⚠️ Error frecuente ([[video-condicional]], 21:24): NO se puede "dar vuelta" el
> evento condicionante al usar una propiedad derivada. Es **falso** que
> $P(A\mid B) = 1 - P(A\mid B^c)$: $P(A\mid B)$ y $P(A\mid B^c)$ restringen los
> casos totales a dos conjuntos distintos ($B$ y $B^c$), así que no hay ninguna
> razón para que sumen 1. En general, todas las propiedades derivadas de los
> axiomas (vacío, complemento, monotonía, etc.) valen solo **mientras el evento
> condicionante se mantenga fijo**.

## Relación
- Si $P(D\mid C)=P(D)$, los eventos son [[independencia|independientes]].
- Reordenando: $P(D\cap C)=P(D\mid C)\,P(C)$ (**regla de la multiplicación**) → base de
  la [[probabilidad-total-y-bayes|probabilidad total y Bayes]] y de las etiquetas del
  [[arbol-de-probabilidades|árbol de probabilidades]].
