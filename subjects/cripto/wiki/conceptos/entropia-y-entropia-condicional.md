---
title: Entropía y entropía condicional
resumen: 'Medida de la incertidumbre que queda sobre una variable y de cuánta desaparece al conocer otra; es la herramienta que permite pasar de preguntar si hay filtración a cuantificar cuánta información se filtra.'
fuentes: ["[[clase-09-flujo-de-informacion]]", "[[teoria-de-la-informacion]]", "[[video-11-flujo-de-informacion]]"]
aliases: [Entropía y entropía condicional, Entropía condicional aplicada al flujo, Equivocación de Shannon, Incertidumbre residual, H(X dado Y)]
type: concepto
unidad: 2
clase: 9
orden: 2
created: 2026-09-04
updated: 2026-09-04
tags: [seguridad, flujo-de-informacion, entropia, entropia-condicional, teoria-de-la-informacion, clase-09, bloque-2, sin-dictar]
sources: ["Clase 10 - Aplicaciones - Flujo de informacion.pdf"]
---

# Entropía y entropía condicional

**Cómo medir cuánta incertidumbre queda sobre una variable, y cuánta de esa incertidumbre desaparece al conocer otra — el paso de "¿hay filtración?" a "¿cuánta filtración hay?" que el [[control-de-acceso-y-flujo-de-informacion|control de acceso]] no podía dar.**

Cubre las filminas **6 y 7** del deck `Clase 10 - Aplicaciones - Flujo de informacion.pdf`. La clase (22/10/2026) todavía no se dictó: hoy es 04/09/2026, no hay transcripción de esta cursada, y esta nota está escrita contra el PDF de filminas, contra [[video-11-flujo-de-informacion|video-11]] —una clase grabada de otra cursada sobre el mismo tema, citada como contraste, no como transcripción propia— y contra el apunte ya existente [[teoria-de-la-informacion|Teoría de la información]], que desarrolla esta misma maquinaria con más detalle y demostraciones. Todo lo que no sale literal de la filmina va rotulado como *(lectura nuestra)*.

## Entropía

**Filmina 6.** Definida sobre una variable aleatoria discreta $X$ que toma valores $x_1,\dots,x_n$:

$$H(X) = -\sum_{i=1}^{n} p(x_i)\log p(x_i)$$

Mide la incertidumbre a la hora de determinar el valor de la variable. Es la misma cuenta del apunte de [[teoria-de-la-informacion#3. Información de Shannon y entropía|Teoría de la información]], escrita con signo opuesto pero idéntica: allá se define $H(x) = \sum p(x_i)\log(1/p(x_i))$, y $\log(1/p) = -\log p$ por las propiedades del logaritmo, así que las dos fórmulas son la misma expresión. Con logaritmo en base dos, $H$ se mide en bits.

Los dos extremos que trae la filmina:

- **Máximo**, con $p(x_i) = 1/n$ para todo $i$ — distribución uniforme. Es la única distribución de máxima entropía cuando el único dato disponible es que hay $n$ valores posibles, tal como lista el apunte en sus [[teoria-de-la-informacion#Distribuciones de máxima entropía|distribuciones de máxima entropía]].
- **Mínimo**, con $p(x_i) = 1$ y $p(x_j) = 0$ para $j \ne i$ — evento único: no hay ninguna incertidumbre porque el resultado ya se conoce de antemano.

**Verificación con un caso intermedio** *(lectura nuestra, no está en la filmina)*: para $n=4$ valores equiprobables, $p(x_i)=1/4$ para los cuatro,

$$H(X) = -4 \cdot \tfrac{1}{4}\log_2\tfrac{1}{4} = -4\cdot\tfrac14\cdot(-2) = 2 \text{ bits}$$

que es exactamente $\log_2 4$: hacen falta $2$ bits para distinguir $4$ valores igualmente probables, la lectura de $H$ como "cantidad de bits necesarios" que el apunte reserva para el caso uniforme —con cualquier otra distribución, $H$ queda por debajo de $\log_2 n$—.

## Entropía condicional

**Filmina 7.** Se obtiene reemplazando las probabilidades por probabilidades condicionadas. Con $X$ tomando valores $x_1,\dots,x_n$ e $Y$ tomando valores $y_1,\dots,y_m$:

$$H(X \mid Y=y) = -\sum_{i=1}^{n} p(x_i \mid y)\log p(x_i \mid y)$$

$$H(X \mid Y) = \sum_{j=1}^{m} p(y_j)\,H(X \mid Y=y_j)$$

La primera fórmula es la incertidumbre sobre $X$ que queda **una vez fijado un valor concreto** $y$; la segunda es el promedio de esa incertidumbre, pesado por la probabilidad de cada $y_j$ — la incertidumbre esperada sobre $X$ una vez que se sabe *algo* de $Y$, sin saber todavía cuál.

El apunte de [[teoria-de-la-informacion#Entropía condicional|Teoría de la información]] define la misma fórmula orientada a un canal de comunicación —ahí $x$ es la entrada y $y$ la salida, y $H(x\mid y)$ es la **equivocación** de Shannon: cuánto queda sin determinar sobre la entrada después de observar la salida—. Acá los roles son genéricos: no hay todavía un "canal" con entrada y salida fijas, sólo dos variables cualesquiera $X$ e $Y$ del estado de un programa. La fórmula es idéntica; lo que cambia es a qué par de variables se aplica, y eso se fija recién en la [[flujo-de-informacion|definición formal de flujo]] de la sección siguiente.

### Los dos casos límite, verificados

Ninguno de los dos ejemplos que siguen está en la filmina 7 —que sólo da la fórmula—; son una construcción propia *(lectura nuestra)* para fijar la intuición antes de los ejemplos con asignaciones que trae la propia clase en la sección siguiente.

**Caso 1 — independencia total.** Sean $X$ e $Y$ dos monedas justas e **independientes**, cada una con $p(0)=p(1)=1/2$. Entonces $p(x\mid y) = p(x)$ para cualquier $y$, porque conocer $Y$ no cambia nada sobre $X$:

$$H(X) = -2\cdot\tfrac12\log_2\tfrac12 = 1 \text{ bit}$$
$$H(X\mid Y{=}y) = -2\cdot\tfrac12\log_2\tfrac12 = 1 \text{ bit, para cada valor de } y$$
$$H(X\mid Y) = \tfrac12\cdot 1 + \tfrac12\cdot 1 = 1 \text{ bit}$$

$H(X\mid Y) = H(X)$: conocer $Y$ no redujo en absoluto la incertidumbre sobre $X$. No hay ninguna correlación, y por lo tanto —como se precisa en la sección siguiente— **no hay flujo de información** de $Y$ a $X$.

**Caso 2 — dependencia total.** Sea ahora $Y := X$ (una copia exacta), con $X$ la misma moneda justa. Conocer $Y$ determina $X$ sin ambigüedad: $p(x\mid y)=1$ si $x=y$ y $0$ en cualquier otro caso.

$$H(X\mid Y{=}y) = -1\cdot\log_2 1 = 0 \text{ bits, para cada valor de } y$$
$$H(X\mid Y) = \tfrac12\cdot 0 + \tfrac12\cdot 0 = 0 \text{ bits}$$

$H(X\mid Y) = 0 < H(X) = 1$: la reducción es total, y es exactamente el caso mínimo de entropía de la filmina 6 aplicado a la condicional — toda la incertidumbre original desapareció, así que hay flujo completo.

Estos dos casos son los extremos de la misma escala en la que va a caer el ejemplo de la filmina 10 —$H(x\mid y) = 1{,}5$ bits, ni $0$ ni $3$—, desarrollado en [[flujo-de-informacion|Flujo de información]].

## Qué aporta esta herramienta frente al secreto perfecto

El [[secreto-perfecto|secreto perfecto]] de la Clase 1 ya usa esta misma familia de ideas, escrito en el lenguaje de independencia probabilística: $\Pr[M{=}m\mid C{=}c] = \Pr[M{=}m]$ para todo $m,c$. Es, en el vocabulario de esta nota, la afirmación $H(M\mid C) = H(M)$ —el caso de independencia total del Caso 1 de arriba, aplicado a mensaje y criptograma—. Pero el secreto perfecto es una afirmación de **todo o nada**: se cumple o no se cumple, y si no se cumple no dice cuánto se filtró. La entropía condicional, en cambio, da un **número** en cualquier punto intermedio de la escala: $1{,}5$ bits filtrados es una respuesta que "el cifrado no tiene secreto perfecto" no puede dar. *(Lectura nuestra: la comparación explícita con el secreto perfecto no está en la filmina 6 ni en la 7; se apoya en que $H(x)-H(x\mid y) = I(x;y)$ —la [[teoria-de-la-informacion#Información mutua|información mutua]] del apunte—, así que "la condicional bajó en tanto" y "la mutua vale tanto" son la misma cantidad expresada de dos maneras.)*

## Ver también

- [[clase-09-flujo-de-informacion#2. Entropía y entropía condicional|Clase 09 — Flujo de información § 2. Entropía y entropía condicional]]
- [[control-de-acceso-y-flujo-de-informacion|Control de acceso y flujo de información]] — la motivación cualitativa que esta nota cuantifica
- [[flujo-de-informacion|Flujo de información]] — dónde $H(X\mid Y)$ se convierte en el criterio formal de si hay flujo
- [[teoria-de-la-informacion|Teoría de la información]] — entropía, entropía condicional, información mutua y el canal de Shannon, desarrollados con demostraciones
- [[secreto-perfecto|Secreto perfecto]] — el caso límite de independencia total, del que esta nota da la versión graduada
- [[video-11-flujo-de-informacion#Los quince minutos de teoría de la información|Video 11 — Flujo de información § Los quince minutos de teoría de la información]] y [[video-11-flujo-de-informacion#Entropía condicional y la definición formal de flujo|§ Entropía condicional y la definición formal de flujo]] — el mismo material, dictado
