---
title: Bell-LaPadula
resumen: 'Modelo militar de confidencialidad reducido a dos reglas, una de lectura y otra de escritura, que juntas impiden que la información fluya hacia niveles más bajos: se lee hacia abajo y se escribe hacia arriba.'
fuentes: ["[[clase-06-politicas-de-seguridad-y-control-de-acceso]]", "[[politica-de-seguridad-y-sistema-seguro]]", "[[confidencialidad-integridad-y-disponibilidad]]", "[[modelos-de-politica]]"]
aliases: [BLP, Simple security property, Star property, Condición de cierre, No read up no write down, Principio de tranquilidad]
type: concepto
unidad: 2
clase: 6
orden: 6
created: 2026-09-04
updated: 2026-09-06
tags: [politicas-de-seguridad, bell-lapadula, confidencialidad, control-de-acceso-mandatorio, clase-06, sin-dictar]
sources: ["Clase 06 - Politicas.pdf"]
---

# Bell-LaPadula

**El primer modelo concreto de la clase: una política militar de confidencialidad reducida a dos reglas —una para leer, una para escribir— que juntas garantizan que la información nunca fluye hacia abajo. Es la nota donde se ve por qué hace falta la segunda regla y no alcanza con la primera, y por qué "no bajar nunca el nivel de un objeto" no es un capricho burocrático sino la única forma de no romper la primera regla retroactivamente.**

Cubre las filminas **15-28** del deck de Políticas (`Clase 06 - Politicas.pdf`). La clase todavía no se dictó —hoy es **04/09/2026**, la clase es el **01/10/2026**— así que esta nota está escrita contra el PDF, sin transcripción.

## Conceptualización del sistema

Bell-LaPadula (`BLP`) es un modelo de **política militar**, centrado en garantizar **confidencialidad** — de las tres propiedades de [[confidencialidad-integridad-y-disponibilidad|Confidencialidad, integridad y disponibilidad]], sólo se ocupa de la primera. El sistema se conceptualiza como sujetos $S$ y objetos $O$, con transiciones de la forma $(\text{Sujeto}, \text{Objeto}, \text{Acción})$, donde las acciones se clasifican en **Lectura** y **Escritura** — la misma estructura de transición de [[politica-de-seguridad-y-sistema-seguro|Política de seguridad y sistema seguro]], ya con un vocabulario concreto.

## Versión simplificada: niveles totalmente ordenados

Cada sujeto y cada objeto tiene un **nivel** asignado, tomado de una lista **totalmente ordenada**. El modelo original define cuatro:

$$\mathsf{Public} < \mathsf{Confidential} < \mathsf{Secret} < \mathsf{Top\ Secret}$$

pero el modelo funciona igual con cualquier cantidad de niveles — lo único que importa es que el orden sea total (dos niveles cualesquiera siempre son comparables). Con $L(\cdot)$ la función de etiquetado:

$$\textbf{Condición de seguridad simple (reducida): } S \text{ puede leer } O \iff L(O) \le L(S) \ \wedge\ S \text{ tiene permiso discrecional para leer } O$$

$$\textbf{Condición de cierre / *-property (reducida): } S \text{ puede escribir } O \iff L(S) \le L(O) \ \wedge\ S \text{ tiene permiso discrecional para escribir } O$$

**"La información fluye hacia arriba, no hacia abajo"** resume las dos condiciones: se puede leer hacia abajo o al mismo nivel ($L(O)\le L(S)$: el objeto que se lee tiene nivel menor o igual al del sujeto) y se puede escribir hacia arriba o al mismo nivel ($L(S)\le L(O)$), nunca al revés.

**El modelo combina acceso mandatorio y discrecional** — la instancia concreta del eje de [[paradigmas-de-control-de-acceso|Paradigmas de control de acceso]]: la condición de nivel es **MAC** (no se negocia, la fija el sistema), y el permiso discrecional es **DAC** (restringe más, dentro de lo que MAC ya permite). La regla que ordena la combinación: *"los accesos discrecionales solo pueden restringir a los mandatorios, no contradecirlos"* — DAC nunca amplía lo que MAC prohíbe, sólo puede acotar más.

### Ejemplo, verificado condición por condición

Sujetos: Diseñador, Gerente, Director. Objetos: Producto X, Balances. Etiquetado: $L(\text{Diseñador}) = \mathsf{Confidential}$, $L(\text{Gerente}) = \mathsf{Secret}$, $L(\text{Director}) = \mathsf{Top\ Secret}$, $L(\text{Producto X}) = \mathsf{Confidential}$, $L(\text{Balances}) = \mathsf{Secret}$.

Aplicando $L(O)\le L(S)$ para lectura y $L(S)\le L(O)$ para escritura a cada par (asumiendo permiso discrecional concedido en todos los casos, que es lo que la filmina evalúa):

$$\begin{array}{l|c|c}
 & \text{Puede leer} & \text{Puede escribir}\\ \hline
\text{Diseñador (Confidential)} & \text{Producto X} & \text{Producto X, Balances}\\
\text{Gerente (Secret)} & \text{Producto X, Balances} & \text{Balances}\\
\text{Director (Top Secret)} & \text{Producto X, Balances} & \text{ninguno de los dos}
\end{array}$$

El patrón que la tabla exhibe: **a mayor nivel del sujeto, más se puede leer y menos se puede escribir** — son movimientos opuestos. El Director, con el nivel más alto de los tres, puede leer todo lo que hay pero no puede escribir en ninguno de los dos objetos existentes (ambos están por debajo de Top Secret) — necesitaría un objeto en su propio nivel para poder escribir algo sin violar la condición de cierre.

## Cuando no hay orden completo: categorías y compartimentos

**El problema.** Si varios proyectos aislados $P_1, P_2, P_3$ están todos por debajo de un Director que los ve a todos, un esquema de niveles totalmente ordenados **no puede garantizar** la aislación entre $P_x$ y $P_y$: el Director domina a los tres por nivel, pero nada en el modelo de niveles impide que información de $P_1$ termine mezclada con la de $P_2$ a través de él —un nivel único no distingue "de qué proyecto" es la información, sólo "qué tan sensible" es—.

**Modelo completo.** Se agregan **categorías**: describen el tipo de información, **no están ordenadas** entre sí, y a cada sujeto y objeto se le asigna un **compartimento**:

$$\text{Compartimento} = (\text{Nivel}, \{\text{categorías}\})$$

**Dominancia.** Sea $l \in L$ (los niveles totalmente ordenados) y $C \subseteq CAT$ (un subconjunto de categorías):

$$(l, C)\ \operatorname{dom}\ (l', C') \iff l' \le l \ \wedge\ C' \subseteq C$$

Un compartimento domina a otro si su nivel es mayor o igual **y** su conjunto de categorías **incluye** al del otro (no basta con el nivel: hace falta que las categorías del segundo sean un subconjunto de las del primero). Con tres categorías $\{\text{Planes}, \text{Ideas}, \text{Coord.}\}$, el retículo de dominancia es exactamente el retículo de partes de ese conjunto ordenado por inclusión: $(\cdot,\{\text{Planes},\text{Ideas},\text{Coord.}\})$ domina a los tres pares, que dominan a los tres singletons, que dominan al conjunto vacío.

**Ejemplos concretos**, con $\mathsf{TS} > \mathsf{S} > \mathsf{P}$:

$$(\mathsf{TS},\{X\}) \operatorname{dom} (\mathsf{TS},\emptyset), \qquad (\mathsf{TS},\{X\}) \operatorname{dom} (\mathsf{S},\{X\}), \qquad (\mathsf{S},\{X\}) \not\operatorname{dom} (\mathsf{P},\{Y\}), \qquad (\mathsf{P},\{Y\}) \not\operatorname{dom} (\mathsf{S},\{X\})$$

Los dos últimos casos no son comparables — $\operatorname{dom}$ es un orden **parcial**, no total: dado un par de compartimentos $A, B$ puede pasar que $A \operatorname{dom} B$, que $B \operatorname{dom} A$, o que **ninguno domine al otro**. Esta es la diferencia estructural clave con la versión simplificada de arriba: ahí $\le$ siempre podía comparar dos niveles cualesquiera; acá $\operatorname{dom}$ puede dejar dos compartimentos sin relación, y eso es exactamente lo que resuelve el problema de aislación entre proyectos — dos compartimentos de nivel distinto pero categorías disjuntas simplemente no son comparables, así que ninguno de los dos accede al otro sin importar los niveles.

**Condiciones con dominancia**, reescribiendo las dos condiciones de arriba con $\operatorname{dom}$ en vez de $\le$:

$$\textbf{Condición de seguridad simple: } S \text{ puede leer } O \iff L(S) \operatorname{dom} L(O) \ \wedge\ S \text{ tiene permiso para leer } O$$
$$\textbf{Condición de cierre (*-property): } S \text{ puede escribir } O \iff L(O) \operatorname{dom} L(S) \ \wedge\ S \text{ tiene permiso para escribir } O$$

## Teorema básico de la seguridad, y por qué hace falta la condición de cierre

$$\textbf{Teorema básico de la seguridad: } \text{si el sistema arranca en un estado seguro y cada transición satisface la condición simple y la de cierre, \emph{todos} los estados son seguros}$$

Es la instancia concreta de "sistema seguro" de [[politica-de-seguridad-y-sistema-seguro|Política de seguridad y sistema seguro]]: la partición es "estados donde ningún sujeto lee por encima de su nivel", y el teorema es la prueba de que las dos reglas de transición nunca cruzan esa línea.

**Por qué la condición simple sola no alcanza.** La condición simple sólo impide la **lectura directa** hacia arriba. **La condición de cierre existe para bloquear los caminos indirectos**: sin ella, un sujeto de nivel alto podría leer un secreto (permitido: lee hacia abajo o a su nivel) y después **escribirlo** en un objeto de nivel bajo (si no hubiera condición de cierre, nada se lo impediría) — filtrando el secreto a cualquier sujeto de nivel bajo que lea después ese objeto. Es un canal de escritura que elude por completo la restricción de lectura, y es exactamente la exigencia de "ni siquiera por vías indirectas" de [[confidencialidad-integridad-y-disponibilidad|Confidencialidad, integridad y disponibilidad]] aplicada a este modelo concreto.

## El problema de la comunicación

Si $A$ le envía un mensaje a $B$ con $B \operatorname{dom} A$: la condición de cierre **permite** el envío ($A$ escribe hacia arriba, hacia $B$). Pero si **$B$ le contesta**, la condición de cierre **lo prohíbe** — $B$ escribiendo hacia $A$ sería escribir hacia abajo. Es una consecuencia directa e incómoda del modelo aplicado al pie de la letra: la comunicación bidireccional entre sujetos de niveles distintos queda rota por diseño, porque el modelo no distingue "escribir para informar" de "escribir para filtrar" — trata las dos cosas igual.

La solución que da el propio Bell-LaPadula es permitir **bajar temporalmente** el nivel de acceso: cada sujeto tiene un $\mathsf{MaxLevel}$ (su nivel de habilitación real) y un $\mathsf{CurLevel}$ (el nivel al que opera en ese momento), con $\mathsf{MaxLevel} \operatorname{dom} \mathsf{CurLevel}$ — nunca se puede operar por encima del propio nivel máximo, sólo por debajo—. La disminución debe **solicitarse explícitamente**: $B$ pide bajar temporalmente a $\mathsf{CurLevel} = L(A)$ para poder responderle sin violar la condición de cierre (ahora $B$ escribe a un nivel igual al suyo temporal, no hacia abajo de su nivel real).

## Principio de tranquilidad

Usuarios y objetos **no cambian de nivel** después de creados. Las dos formas de romper esto son ambas fatales, cada una viola una de las dos condiciones:

- **Subir el nivel de un objeto**: la información ya fue leída por usuarios de menor nivel *antes* de la subida — viola **retroactivamente** la condición simple (esos lectores nunca debieron haber accedido a un objeto que, en su nuevo nivel, está por encima de ellos; pero ya lo hicieron).
- **Bajar el nivel de un objeto**: es el problema de **declasificación** — viola la condición de cierre, porque el objeto pudo haber sido escrito por sujetos de nivel alto bajo la garantía de que sólo otros de nivel alto lo leerían; bajarlo expone ese contenido a lectores de nivel bajo que antes no calificaban.

En los dos casos el problema es el mismo: las condiciones simple y de cierre se verifican **en el momento de cada transición**, así que cambiar retroactivamente el nivel de una entidad invalida garantías que ya se dieron por sentadas sobre transiciones pasadas. El teorema básico de la seguridad prueba que las transiciones nunca cruzan la partición **mientras los niveles se mantengan fijos**; sin el principio de tranquilidad, esa hipótesis deja de sostenerse y el teorema deja de aplicar.

## El único cruce con video: sólo la relación de dominancia

*(Cruce con video, no del deck.)* El [[video-11-flujo-de-informacion|Video 11 — Flujo de información]] es el **único** material en video de la cátedra que toca Bell-LaPadula, y lo hace con un alcance muy acotado: la filmina 15 de *esa* clase —Clase 9, deck de Flujo de información— usa **sólo la relación de dominancia**, sin desarrollar la condición simple ni la *-property. El propio docente la presenta en voz como *"dominancia, similar a lo que vimos en políticas"*, dando por vista una clase que, verificado sobre las ocho transcripciones del Bloque 2, **no tiene ninguna grabación**. Es decir: esta nota, escrita contra el PDF, es el desarrollo completo que el corpus de video no cubre en ningún lado.

Esa misma filmina reporta además una notación que ni la lámina ni el audio explican, $(b,-,C_1)$, para una **restricción discrecional** — y encaja exactamente con la regla de esta nota: *"los accesos discrecionales solo pueden restringir a los mandatorios, no contradecirlos"* es el enunciado general del que ese símbolo es un caso particular sin desarrollar. La lectura completa de esa notación, cruzando el signo $-$ con el derecho **revocado** de [[listas-de-control-de-acceso|Listas de control de acceso]], está en [[politicas-de-control-de-flujo|Políticas de control de flujo]].
