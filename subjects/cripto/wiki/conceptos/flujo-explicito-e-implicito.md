---
title: Flujo explícito e implícito
resumen: 'Los dos tipos de flujo: el explícito, con una asignación que traspasa el valor, y el implícito, donde la información se filtra por la rama que se ejecuta o por si el programa termina, sin asignación explícita.'
fuentes: ["[[clase-09-flujo-de-informacion]]", "[[flujo-de-informacion]]", "[[video-11-flujo-de-informacion]]"]
aliases: [Flujo explícito e implícito, Flujo explícito, Flujo implícito, Flujo por control, Flujo por comportamiento, Flujo indirecto]
type: concepto
unidad: 2
clase: 9
orden: 4
created: 2026-09-04
updated: 2026-09-04
tags: [seguridad, flujo-de-informacion, flujo-explicito, flujo-implicito, analisis-de-programas, clase-09, bloque-2, sin-dictar]
sources: ["Clase 10 - Aplicaciones - Flujo de informacion.pdf"]
---

# Flujo explícito e implícito

**Que la información puede fluir sin que exista ninguna asignación que la traspase directamente — el caso que vuelve inútil a cualquier analizador de flujo que sólo mire instrucciones del tipo $y := f(x)$.**

Cubre las filminas **11 a 13** del deck `Clase 10 - Aplicaciones - Flujo de informacion.pdf`. La clase (22/10/2026) todavía no se dictó: hoy es 04/09/2026, no hay transcripción de esta cursada, y esta nota está escrita contra el PDF de filminas y contra [[video-11-flujo-de-informacion|video-11]] —clase grabada de otra cursada sobre el mismo deck, citada como contraste, no como transcripción propia—. Todo lo que no sale literal de la filmina va rotulado como *(lectura nuestra)*.

El ejemplo de [[flujo-de-informacion#El primer ejemplo, resuelto y verificado|Flujo de información]] —$y := x+z$— filtra por el camino más obvio: $y$ se calcula a partir de $x$ en una asignación explícita. Los dos ejemplos de esta nota muestran que ese camino no es el único.

## Flujo indirecto por rama

**Filmina 11.** Considerar `if x = 0 then y = 1 else y = 0`, con $x \in \{0,1\}$ y $p(x{=}0)=0{,}5$. La propia filmina señala lo interesante: **$x$ e $y$ no aparecen nunca en la misma asignación** — no hay ningún punto del código donde se escriba literalmente $y := f(x)$.

**Cálculo, verificado.** $x$ es una moneda justa entre dos valores:

$$H(x) = -2\cdot\tfrac12\log_2\tfrac12 = 1 \text{ bit}$$

Conocer $y$ determina $x$ sin ambigüedad, porque las dos ramas del `if` son mutuamente excluyentes y cubren todo el dominio de $x$: $y=1 \Rightarrow x=0$, y $y=0 \Rightarrow x=1$. No queda ningún valor de $x$ compatible con un $y$ dado salvo uno:

$$H(x \mid y{=}1) = -1\cdot\log_2 1 = 0, \qquad H(x\mid y{=}0) = -1\cdot\log_2 1 = 0$$
$$H(x\mid y) = p(y{=}1)\cdot 0 + p(y{=}0)\cdot 0 = 0$$

Como $0 < 1$, se cumple la definición de [[flujo-de-informacion#La definición formal|Flujo de información]] — $y$ no existía antes del `if`, así que corresponde comparar contra $H(x)$ incondicional — y **hay traspaso de información**. *(Lectura nuestra.)* El mecanismo es distinto del de $y:=x+z$: acá $x$ e $y$ nunca comparten una línea de código, pero el `if` funciona, en los hechos, igual que una asignación repartida en dos ramas en vez de escrita como una sola fórmula — **qué rama se ejecutó** ya fija el valor final de $y$ tan directamente como lo haría un $y:=f(x)$ explícito.

## Flujo indirecto por comportamiento

**Filmina 12.** Considerar `while x = 0 loop {}`, con $x \in \{0,1\}$ y $p(x{=}0)=0{,}5$. Acá el caso se lleva al extremo: **no existe ninguna asignación en absoluto**. Se define $y=0$ si el programa termina.

$$H(x) = 1 \qquad H(x \mid y) = 0$$

La cuenta es formalmente idéntica a la del `if` —misma distribución de $x$, misma reducción a cero—, pero lo que se observa para definir $y$ ya no es una variable escrita por el programa sino su **comportamiento**: si $x=1$, el `while` nunca entra al cuerpo y el programa termina de inmediato; si $x=0$, la condición nunca deja de cumplirse y el programa queda colgado para siempre. Saber si el programa terminó o no determina $x$ por completo, y **hay traspaso de información sin una sola línea que escriba nada**.

*(Lectura nuestra.)* Este es el caso límite de la generalización: no hay dato que copiar (como en $y:=x+z$) ni siquiera una rama visible que delate el valor (como en el `if`, donde al menos existe una asignación a $y$ en cada rama) — lo único que hay para observar es la propia ejecución del programa, terminar o no terminar, y esa sola observación —un bit binario— ya alcanza para reconstruir $x$ entero. Es el ejemplo que deja más claro por qué un análisis de flujo que sólo revise instrucciones de asignación es insuficiente: acá no hay ninguna instrucción de asignación que revisar.

### Por qué cada uno filtra, en una frase

*(Lectura nuestra: la filmina no propone esta clasificación por tipo de canal; es una síntesis a partir de los tres ejemplos — el de esta nota y el de [[flujo-de-informacion|Flujo de información]].)*

- **$y := x + z$** filtra porque $y$ es **función directa** de $x$: observar la salida de una operación aritmética sobre $x$ deja ver, con la incertidumbre residual que aporte $z$, el valor de $x$. Es flujo por **dato**.
- **El `if`** filtra porque, aunque $x$ nunca se copia a ningún lado, **la rama que se ejecuta depende de $x$**, y el valor final de $y$ delata qué rama se tomó. Es flujo por **control**.
- **El `while`** filtra porque ni siquiera hay una salida explícita: lo que se observa es si el programa **terminó o no**, y esa sola observación —terminó/no terminó— ya alcanza para reconstruir $x$. Es flujo por **comportamiento**, el caso límite: no hay dato ni rama visible, sólo la propia ejecución del programa como canal.

## La generalización: explícito contra implícito

**Filmina 13.** Los tres ejemplos anteriores se ordenan en dos categorías:

| Tipo | Qué es | Cuál de los ejemplos |
|---|---|---|
| **Explícito** | Existe una asignación o escritura de información del tipo $y := f(x)$ | $y := x+z$ |
| **Implícito** | Hay verificación de flujo **sin** asignaciones explícitas | El `if` y el `while` |

Con la clasificación por tipo de canal de arriba: flujo por dato es siempre explícito; flujo por control y flujo por comportamiento son ambos implícitos —en el `if`, $x$ aparece en la condición pero cada rama asigna a $y$ una **constante**, nunca una función explícita de $x$; en el `while` no hay ninguna asignación de la que hablar—. La filmina deja planteado el problema que ordena el resto de la clase: **encontrar y controlar los flujos implícitos de información**, mucho más sutiles y mucho más difíciles de capturar que los explícitos — un analizador de flujo que sólo mira asignaciones se pierde tanto el `if` como el `while`, exactamente los dos casos de esta nota.

## Ver también

- [[clase-09-flujo-de-informacion#4. Flujo explícito e implícito|Clase 09 — Flujo de información § 4. Flujo explícito e implícito]]
- [[flujo-de-informacion|Flujo de información]] — la definición formal y el ejemplo de flujo explícito sobre el que se construye esta nota
- [[politicas-de-control-de-flujo|Políticas de control de flujo]] — qué requisitos debe cumplir una política capaz de cubrir también los flujos implícitos
- [[video-11-flujo-de-informacion#2. Flujo indirecto por rama|Video 11 — Flujo de información § 2. Flujo indirecto por rama]], [[video-11-flujo-de-informacion#3. Flujo indirecto por comportamiento|§ 3. Flujo indirecto por comportamiento]] y [[video-11-flujo-de-informacion#Flujo explícito e implícito|§ Flujo explícito e implícito]] — los mismos dos ejemplos y la misma generalización, dictados
