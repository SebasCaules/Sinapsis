---
titulo: Independencia de eventos
resumen: 'Dos eventos son independientes cuando $P(A\cap B)=P(A)P(B)$, equivalente a $P(B\mid A)=P(B)$: saber que uno ocurrió no cambia la probabilidad del otro. No confundir con mutuamente excluyentes, que es lo opuesto.'
tipo: concepto
unidad: 2
orden: 8
tags: [probabilidad, independencia]
fuentes: ["[[independencia-condicional-bayes]]", "[[tp2-calculo-de-probabilidades]]", "[[video-independencia]]"]
actualizado: 2026-09-04
---

# Independencia de eventos

**En breve.** Dos eventos son independientes cuando saber que uno ocurrió no cambia la
probabilidad del otro; eso permite **multiplicar** sus probabilidades para la
intersección. Es el supuesto que simplifica casi todo cálculo y la base de las
[[independencia-de-variables-aleatorias|v.a. independientes]].

Dos eventos $A, B$ son **independientes** sii
$$ P(A\cap B) = P(A)\cdot P(B). $$
Intuición: que ocurra uno **no aporta información** sobre el otro.

> ⚠️ **Cuidado con la intuición.** Independencia NO significa que un evento no afecte
> los *resultados* que puede tomar el otro —puede cambiarlos—, sino que no afecta sus
> *probabilidades*. Ejemplo: con $D=$"el resultado del dado es mayor que 4" y $F=$"el
> resultado es par" (independientes: $P(D)=\tfrac13$, $P(F)=\tfrac12$, $P(D\cap
> F)=P(\{6\})=\tfrac16=P(D)P(F)$), saber que ocurrió $D$ sí restringe los resultados
> posibles de $F$ a un único valor (6), pero la *probabilidad* de $F$ sigue siendo
> $\tfrac12$ (según [[video-independencia]]).

## Caracterización por la condicional
Si $P(C)\neq 0$: $\;C$ y $D$ independientes $\iff P(D\mid C)=P(D)$.
*(Sale de sustituir $P(D\cap C)=P(D)P(C)$ en la [[probabilidad-condicional|definición de condicional]].)*

> [!figura] u2-independencia-rectangulo
> Con $A$ definido por filas y $B$ por columnas, la intersección es siempre un rectángulo y su fracción de área es el producto de las dos bandas: $P(A\cap B)=P(A)P(B)$. Al reemplazar $B$ por un evento diagonal, como la suma, el recorte deja de ser rectangular y la igualdad se rompe: conocer $A$ pasa a cambiar la fracción de casos de $B$, que con independencia es la misma dentro de $A$ que en todo $S$.

## Casos particulares
- $\emptyset$ es independiente de **todo** evento ($P(A\cap\emptyset)=0=P(A)\cdot 0$).
- $S$ es independiente de **todo** evento ($P(A\cap S)=P(A)=P(A)\cdot 1$).

## Independencia de complementos
Si $A$ y $B$ son independientes, también lo son sus complementos: $A$ y $\bar B$;
$\bar A$ y $B$; y $\bar A$ y $\bar B$ (según [[video-independencia]]). En efecto,
$P(A\cap\bar B)=P(A)-P(A\cap B)=P(A)-P(A)P(B)=P(A)\big(1-P(B)\big)=P(A)P(\bar B)$.
Intuición: si saber que ocurrió $A$ no cambia la probabilidad de $B$, tampoco debería
cambiarla saber que $B$ **no** ocurrió.

## Colección de eventos
$\{A_k\}$ son independientes sii $P\!\left(\bigcap_k A_k\right)=\prod_k P(A_k)$.

> ⚠️ No confundir con [[espacio-muestral-y-eventos|mutuamente excluyentes]]: si
> $A,B$ son m.e. y ambos con prob. positiva, **no** son independientes (saber que
> ocurrió $A$ asegura que $B$ no ocurrió).

## Ejercicio resuelto
*Dos tiradores disparan a la vez, con probabilidades de acierto $0.6$ y $0.7$,
independientes. Calcular: (a) exactamente uno acierta; (b) exactamente dos.*

Sean $A_1$ = "tirador 1 acierta", $A_2$ = "tirador 2 acierta", independientes.

**(b) Exactamente dos** $= A_1\cap A_2$:
$$ P(A_1\cap A_2) = P(A_1)P(A_2) = 0.6\cdot 0.7 = 0.42. $$

**(a) Exactamente uno** $= (A_1\cap A_2^c)\cup(A_1^c\cap A_2)$ (m.e.):
$$ P = P(A_1)P(A_2^c) + P(A_1^c)P(A_2) = 0.6\cdot 0.3 + 0.4\cdot 0.7 = 0.18 + 0.28 = 0.46. $$

## Ejercicio resuelto — mutuamente excluyentes vs. independientes ([[tp2-calculo-de-probabilidades]] ej. 12)
*Sean $A,B$ con $P(A)=0.4$ y $P(A\cup B)=0.7$. ¿Cuánto vale $p=P(B)$ si son
(a) m.e.? (b) independientes?*

**(a) M.e.** ($P(A\cap B)=0$): $\;P(A\cup B)=P(A)+P(B)\Rightarrow 0.7=0.4+p\Rightarrow p=0.3.$

**(b) Independientes** ($P(A\cap B)=P(A)P(B)$):
$$ P(A\cup B)=P(A)+P(B)-P(A)P(B)\Rightarrow 0.7 = 0.4 + p - 0.4p \Rightarrow 0.6\,p=0.3\Rightarrow p=0.5. $$
Distinto valor de $p$ según el supuesto: **m.e. e independiente son cosas opuestas**.

## Ejercicio resuelto — fiabilidad serie/paralelo ([[tp2-calculo-de-probabilidades]] ej. 20)
*Cuatro contactos $A,B,C,D$ (relevadores independientes) se conectan así: la rama
$A\!-\!B$ en serie, en **paralelo** con la rama $C\!-\!D$ en serie. Cada contacto puede
fallar la conexión con probabilidad $10^{-2}$. ¿Probabilidad de que circule corriente
entre entrada y salida?*

> [!figura] u2-serie-paralelo-fiabilidad
> El circuito del enunciado: las dos ramas en serie conectadas en paralelo, con cada contacto coloreado según su estado. La comparación en escala logarítmica muestra lo que aporta duplicar la rama: la probabilidad de falla baja de $1.99\times 10^{-2}$ a $3.96\times 10^{-4}$. Al hacer clic en un contacto se lo fuerza a fallar, y el rótulo de arriba dice si el circuito sigue conduciendo con los contactos abiertos elegidos.

Cada contacto **funciona** con $p=1-10^{-2}=0.99$.
- **Serie** (la rama funciona si funcionan **ambos**): $P(\text{rama})=p\cdot p=0.99^2=0.9801$.
- **Paralelo** (el circuito funciona si funciona **al menos una** rama → complemento de
  que fallen las dos): con $q_{\text{rama}}=1-0.9801=0.0199$,
$$ P = 1 - q_{\text{rama}}^2 = 1 - 0.0199^2 \approx 0.999604. $$

> Regla de oro: **serie → producto** (todos deben funcionar); **paralelo → complemento
> del producto de fallas** (basta con que uno funcione).

## Ejercicio resuelto — combinar condicionamiento e independencia
Cuando dos eventos **no** son independientes conviene condicionar por una partición y
usar independencia **dentro** de cada rama condicional:
$$ P(G) = P(G\mid M)P(M) + P(G\mid \bar M)P(\bar M), $$
donde cada $P(G\mid M)$ y $P(G\mid \bar M)$ se calculan descomponiendo en sucesos
mutuamente excluyentes y aplicando independencia entre las extracciones dentro de la
rama. Ver el desarrollo completo (mazo de 5 cartas + moneda, juego $G$ que se gana con
a lo sumo una carta par) en [[video-independencia]] [10:10]; resultado: $P(G)=93/125$.

## Relación
[[probabilidad-condicional]] · [[axiomas-de-probabilidad]] (no confundir con la unión de
m.e.) · [[arbol-de-probabilidades]] (las etapas independientes dan ramas iguales nivel a
nivel) · base de las [[independencia-de-variables-aleatorias|v.a. independientes]] y de
la [[suma-de-variables-aleatorias|suma de v.a.]] (unidades posteriores).
