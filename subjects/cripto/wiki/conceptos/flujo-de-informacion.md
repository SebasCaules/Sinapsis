---
title: Flujo de información
resumen: 'Definición formal del traspaso de información: hay flujo de x a y cuando conocer y deja menos incertidumbre sobre x que antes de ejecutar el programa, medida con entropía condicional.'
fuentes: ["[[clase-09-flujo-de-informacion]]", "[[entropia-y-entropia-condicional]]", "[[video-11-flujo-de-informacion]]"]
aliases: [Definición formal de flujo de información, Flujo de información: definición, Traspaso de información, Filtración de información, Reducción de entropía condicional]
type: concepto
unidad: 2
clase: 9
orden: 3
created: 2026-09-04
updated: 2026-09-04
tags: [seguridad, flujo-de-informacion, entropia-condicional, definicion-formal, clase-09, bloque-2, sin-dictar]
sources: ["Clase 10 - Aplicaciones - Flujo de informacion.pdf"]
---

# Flujo de información

**La definición formal que convierte "algo de $x$ se filtró hacia $y$" en una desigualdad verificable entre entropías — el criterio que toda la clase usa de acá en adelante para decidir si un programa filtra información.**

Cubre las filminas **8 a 10** del deck `Clase 10 - Aplicaciones - Flujo de informacion.pdf`. La clase (22/10/2026) todavía no se dictó: hoy es 04/09/2026, no hay transcripción de esta cursada, y esta nota está escrita contra el PDF de filminas y contra [[video-11-flujo-de-informacion|video-11]] —clase grabada de otra cursada sobre el mismo deck, citada como contraste, no como transcripción propia—. Todo lo que no sale literal de la filmina va rotulado como *(lectura nuestra)*.

## La definición formal

**Filmina 8.** Sea $s$ el estado de un sistema y $t$ el estado del sistema luego de ejecutar los comandos $c_1,\dots,c_n$. Sean $x_s, y_s$ los valores de los objetos $x$ e $y$ en el estado $s$, y sea $y_t$ el valor de $y$ en el estado $t$. **Hay flujo de información de $x$ a $y$** si:

$$H(x_s \mid y_t) < H(x_s \mid y_s) \qquad \text{si } y \text{ existe en el estado } s$$

$$H(x_s \mid y_t) < H(x_s) \qquad \text{si } y \text{ no existe en el estado } s$$

Las dos ramas cubren el único detalle que distingue "actualizar una variable existente" de "crear una variable nueva": si $y$ ya tenía un valor antes de correr el programa, el punto de comparación es la incertidumbre condicionada a *ese* valor previo, $H(x_s\mid y_s)$; si $y$ no existía —se declaró recién en este tramo de código—, no hay valor previo con el que comparar, y el punto de referencia es la incertidumbre incondicional $H(x_s)$, que es exactamente el [[entropia-y-entropia-condicional#Entropía|caso base de la entropía]] antes de conocer nada de $y$.

En criollo: **si después de ejecutar el programa y conocer $y$ queda menos incertidumbre sobre $x$ que la que había antes, es porque algo de $x$ se traspasó a $y$.** El criterio es de **reducción relativa**, no de valor absoluto — lo que importa es cuánto *bajó* $H$, no cuánto vale en ninguno de los dos extremos. Es la misma estructura de los dos casos límite verificados en [[entropia-y-entropia-condicional#Los dos casos límite, verificados|Entropía y entropía condicional]]: si $H(x\mid y)=H(x)$ no hay flujo (independencia total), y si $H(x\mid y)=0$ el flujo es completo — la definición formal de acá cubre además todo el rango intermedio entre esos dos extremos.

### Por qué el criterio es "menor" y no "mayor"

Puede resultar contraintuitivo que la condición sea una reducción de incertidumbre y no un aumento. La razón es que **la entropía mide lo que falta por saber, no lo que ya se sabe**: si conocer $y$ *reduce* cuánto falta por saber sobre $x$, es porque $y$ aportó predictibilidad sobre $x$ — y aportar predictibilidad es, precisamente, lo que significa que información de $x$ llegó a $y$. Si en cambio $H(x_s\mid y_t)$ fuera *mayor* que la referencia, eso significaría que conocer $y$ volvió a $x$ **más** incierto, lo cual no tiene una lectura causal razonable dentro de este marco: no hay manera de que ejecutar un programa determinístico incremente la incertidumbre real sobre un valor que ya estaba fijado en el estado $s$. La reducción es, en este sentido, la única dirección posible de la desigualdad si lo que se busca es capturar traspaso de información.

## El primer ejemplo, resuelto y verificado

**Filminas 9 y 10.** Antes del ejemplo, la filmina 9 hace una aclaración importante de alcance: **existen técnicas formales de análisis de flujo en programas**, y **en general hay flujo de información en un programa** —es necesario para que funcione: un programa que no mueve información de sus entradas a sus salidas no hace nada útil—. Lo que interesa verificar son **casos puntuales**, y el que trae la propia filmina es el que le importa a esta materia: **que una función de cifrado no revele información de la clave**. *(Lectura nuestra: la filmina deja esto en prosa; traducido al vocabulario de esta nota, la propiedad que se quiere verificar es que $H(\text{clave} \mid \text{criptograma})$ no baje respecto de $H(\text{clave})$ — que observar el criptograma no reduzca la incertidumbre sobre la clave.)* Es la misma preocupación que sostiene el [[secreto-perfecto|secreto perfecto]] y la [[seguridad-computacional|seguridad computacional]] de la Unidad 1, aplicada ahora con el vocabulario de esta clase.

**Filmina 10 — el ejemplo.** Considerar el comando $y := x + z$, donde $0 \le x \le 7$ con igual probabilidad y $Z = \{p(z{=}1)=0{,}5,\ p(z{=}2)=0{,}25,\ p(z{=}3)=0{,}25\}$.

**Entropía natural de $x$.** Ocho valores equiprobables, $p(x_i)=1/8$:

$$H(x) = -\sum_{i=0}^{7} \tfrac{1}{8}\log_2\tfrac{1}{8} = -8\cdot\tfrac18\cdot(-3) = 3 \text{ bits}$$

que es $\log_2 8 = 3$: son los bits necesarios para distinguir $8$ valores equiprobables, exactamente el caso máximo de [[entropia-y-entropia-condicional#Entropía|Entropía]].

**Entropía de $x$ conociendo $y$.** Después del comando, sabiendo el valor de $y$, $x$ sólo puede haber sido $y-1$, $y-2$ o $y-3$ —los tres únicos valores de $z$ posibles—, heredando exactamente las probabilidades de $z$:

$$H(x \mid y) = -\tfrac{1}{2}\log_2\tfrac{1}{2} - \tfrac14\log_2\tfrac14 - \tfrac14\log_2\tfrac14 = \tfrac12 + \tfrac12 + \tfrac12 = 1{,}5 \text{ bits}$$

**Verificación paso a paso** *(lectura nuestra, no está desarrollado así en la filmina)*: $-\log_2(1/2) = 1$, así que el primer término aporta $\tfrac12\cdot 1 = 0{,}5$; $-\log_2(1/4) = 2$, así que cada uno de los otros dos términos aporta $\tfrac14\cdot 2 = 0{,}5$. Sumando los tres: $0{,}5+0{,}5+0{,}5 = 1{,}5$, que coincide con el valor que remata la propia filmina.

**Conclusión, con la desigualdad de la sección anterior aplicada.** $y$ no existía antes de ejecutar el comando —se crea recién con la asignación—, así que corresponde la segunda rama de la definición: $H(x_s\mid y_t) < H(x_s)$. Sustituyendo, $1{,}5 < 3$, la desigualdad se cumple, y **hay flujo de información de $x$ a $y$** — la propia filmina lo remata con un globo de texto. De los $3$ bits de incertidumbre original quedaron $1{,}5$: se filtró exactamente un bit y medio, ni todo ni nada, el punto intermedio entre los dos casos límite de [[entropia-y-entropia-condicional#Los dos casos límite, verificados|Entropía y entropía condicional]].

*(Lectura nuestra.)* En el lenguaje de [[teoria-de-la-informacion#Información mutua|información mutua]] del apunte de teoría de la información, esta misma cuenta se lee como $I(x;y) = H(x) - H(x\mid y) = 3 - 1{,}5 = 1{,}5$ bits: la cantidad exacta de información que $y$ porta sobre $x$. La filmina nunca escribe $I(x;y)$; la equivalencia es una traducción propia entre las dos notaciones del vault.

## Ver también

- [[clase-09-flujo-de-informacion#3. Flujo de información: la definición|Clase 09 — Flujo de información § 3. Flujo de información: la definición]]
- [[entropia-y-entropia-condicional|Entropía y entropía condicional]] — la herramienta con la que se construye esta definición
- [[flujo-explicito-e-implicito|Flujo explícito e implícito]] — los dos ejemplos siguientes, donde el mismo criterio detecta flujo sin ninguna asignación aritmética
- [[secreto-perfecto|Secreto perfecto]] — el caso "que el cifrado no revele nada de la clave" que la filmina 9 evoca en prosa
- [[seguridad-computacional|Seguridad computacional]] — la versión relajada de esa misma exigencia bajo poder de cómputo acotado
- [[teoria-de-la-informacion#Información mutua|Teoría de la información § Información mutua]] — la cantidad exacta que mide esta definición, en otra notación
- [[video-11-flujo-de-informacion#Entropía condicional y la definición formal de flujo|Video 11 — Flujo de información § Entropía condicional y la definición formal de flujo]] y [[video-11-flujo-de-informacion#1. Flujo directo por asignación|§ 1. Flujo directo por asignación]] — la misma definición y el mismo ejemplo, dictados
