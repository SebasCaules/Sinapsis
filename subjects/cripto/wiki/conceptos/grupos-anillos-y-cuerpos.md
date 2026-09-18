---
title: Grupos, anillos y cuerpos
resumen: 'Vocabulario algebraico con el que la Clase 04 escribe sus esquemas sin volver a definirlo: grupo, subgrupo, anillo, cuerpo, generador, orden, elemento primitivo y el grupo multiplicativo $\mathbb{Z}_p^{*}$; con el repaso que el docente reconstruyó en el aula porque los alumnos lo pidieron.'
fuentes: ["[[clase-04-criptografia-asimetrica-y-firma-digital]]", "[[cuerpos-finitos-y-campos-de-galois]]", "[[teoria-de-numeros]]", "[[cuerpos-finitos]]", "[[practica-05-de-la-clave-privada-a-la-clave-publica]]"]
aliases: [Grupos anillos y cuerpos, Grupo algebraico, Anillo algebraico, Subgrupo, Elemento generador de un grupo, Grupo multiplicativo Zp*, Grupo finito cíclico]
type: concepto
unidad: 1
clase: 4
orden: 2
created: 2026-09-04
updated: 2026-09-15
tags: [criptografia, algebra, grupos, anillos, cuerpos, aritmetica-modular, clase-04, transcripcion]
sources: ["Clase 04 - Criptografia - Cifrado asimetrico y firma digital.pdf", "raw/clases/Clase 04 - Transcripcion.VTT"]
---

# Grupos, anillos y cuerpos

**El vocabulario algebraico exacto —subgrupo, generador, orden, elemento primitivo, $\mathbb{Z}_p^{*}$— con el que el resto de la Clase 04 escribe Diffie-Hellman, RSA y El Gamal.** Esta nota no vuelve a demostrar lo que ya está probado en las notas de la Clase 2: dice específicamente qué agrega el repaso de filminas por encima de ellas y linkea el resto.

> **Fuentes de esta nota.** Filminas **9 a 15** de la Clase 04, dictada el **10/09** por Pablo Abad, con transcripción: [`Clase 04 - Transcripcion.VTT`](../../raw/clases/Clase%2004%20-%20Transcripcion.VTT), repaso de álgebra en los cues **290-517**. **El repaso no estaba planeado como lectura de filminas**: el docente preguntó si hacía falta —*"¿alguien entendió lo que dije? ¿alguien sabe de qué estoy hablando?"*, cue 289—, un alumno contestó *"bastante poco"* y otro pidió refrescar, y los veintiséis minutos que siguen son una reconstrucción con los alumnos aportando las definiciones. Para profundizar, el docente remite a **los primeros capítulos de Menezes** (cues 296-298), y aclara el nivel: *"no necesitan una licenciatura en matemáticas para diseñar cosas; es un repaso para que no estén perdidos"* (cues 300-303).

> **El ejemplo multiplicativo que el aula no dio lo trae la [[practica-05-de-la-clave-privada-a-la-clave-publica|Práctica 05]]** (14/09, filmina 7): $\mathbb{Z}_7^{*}$ generado por $3$, con la tabla $3^{0} = 1$, $3^{1} = 3$, $3^{2} = 2$, $3^{3} = 6$, $3^{4} = 4$, $3^{5} = 5$ — las seis unidades módulo $7$, o sea $3$ es primitivo. En el aula el ejemplo módulo $7$ fue con la **suma**, generado por el $1$. La misma lámina muestra qué pasa cuando el orden del grupo, $6$, no es primo: el ejemplo de Diffie-Hellman que la acompaña termina en la clave $1$ → [[practica-05-de-la-clave-privada-a-la-clave-publica#Por qué da 1, y qué enseña|Práctica 05 §5]].

## Por qué esta nota no repite la Clase 2

El bloque de filminas 9-15 es, literalmente, un repaso: las definiciones de grupo, grupo abeliano, anillo y cuerpo, la aritmética modular, el teorema de Euler-Fermat y la multiplicatividad de $\varphi$ **ya están** desarrolladas con demostración completa, ejemplos numéricos y tablas en:

- [[aritmetica-modular-y-divisibilidad|Aritmética modular y divisibilidad]]
- [[algoritmo-de-euclides-extendido|Algoritmo de Euclides extendido]]
- [[inverso-modular|Inverso modular]]
- [[cuerpos-finitos-y-campos-de-galois|Cuerpos finitos y campos de Galois]]

Esta nota va derecho a lo que ese material **no** tenía: la nomenclatura exacta —subgrupo, generador, orden, elemento primitivo— con la notación puntual que usa esta clase, porque es la que reaparece sin aviso en [[diffie-hellman|Diffie-Hellman]], [[rsa|RSA]], [[el-gamal|El Gamal]] y [[digital-signature-standard|DSS]]. Y suma lo que la voz agregó: **por qué** estas estructuras le sirven a la criptografía, que es lo que ninguna filmina del repaso dice.

## Grupo algebraico y subgrupo

Un **grupo algebraico** $(G, +)$ es un conjunto con una operación que cumple clausura, asociatividad, neutro e inverso — la definición estándar, ya cubierta en [[aritmetica-modular-y-divisibilidad|02.13]]. Un **grupo abeliano** agrega conmutatividad.

**Las cuatro propiedades las dijeron los alumnos**, y el docente las fue validando contra los enteros con la suma: clausura (*"aplicar la operación y que el resultado esté en el conjunto también"*), asociatividad (*"el resultado no depende de la agrupación"*), neutro (*"un elemento que al aplicar la operación no afecta al otro"*, el $0$) e inverso (*"para cada $n$, $-n$, y al operar da el neutro"*). El contraejemplo que el docente eligió para mostrar que la definición muerde es $(\mathbb{Z}, \cdot)$: asociativa y con neutro $1$, pero **el $5$ no tiene inverso entero** — haría falta $1/5$ —, y por eso *"nos inventamos otro conjunto, los racionales"* (cues 342-353). Es el mismo mecanismo que en aritmética modular deja al $0$ afuera del grupo multiplicativo.

> [!quote]- De la transcripción — la definición reconstruida entre todos, y el contraejemplo (cues 312-353)
> *"Un grupo algebraico son 2 cosas: es un conjunto de elementos y una operación. (…) A ver si se acuerdan por los nombres y me van ayudando. La primera es clausura."*
> — **Santiago Sánchez Marostica:** *"Puede ser aplicar la operación y que el resultado esté en el conjunto también."*
> — *"Espectacular, es eso. (…) Asociatividad."*
> — **Andrea Crescencio Bello:** *"Es cuando hacemos operaciones, y el resultado no depende de la agrupación que se le haga."*
> — *"Va por ahí. (…) Neutro."*
> — **Santiago:** *"Existe un elemento del conjunto que, al aplicar la operación, no afecta al elemento al que se le está realizando."* (…) *"El 0."*
> — *"Y después, inverso."*
> — **Santiago:** *"Todo número tiene que tener un complemento: tengo $n$ y $-n$, y al hacer la operación me da el neutro."*
> — *"Cualquier conjunto de bichos, cosas raras, y una operación que cumpla con esas 4 cosas, nos permite hablar de grupo. Y así como existen los grupos de los números enteros con la suma, los números enteros con la multiplicación **no** son un grupo. ¿Por qué? (…) Hay un neutro que es el 1. El problema es que si yo les doy un número cualquiera, por ejemplo el 5, ¿por cuánto había que multiplicarlo para que me dé 1? Lo tendría que multiplicar por un quinto, pero un quinto no es entero. Entonces nos inventamos otro conjunto, que son los racionales."*

Lo que la filmina 10 nombra explícitamente y las notas de la Clase 2 no llegaban a nombrar por separado es el **subgrupo**: $(G', +)$ es subgrupo de $(G, +)$ si

$$(G, +) \text{ es grupo}, \quad (G', +) \text{ es grupo}, \quad G' \subseteq G, \quad G' \neq \varnothing$$

Es decir, un subconjunto no vacío de $G$ que **por sí mismo**, con la misma operación restringida, vuelve a satisfacer los cuatro axiomas de grupo. El caso que va a aparecer en [[digital-signature-standard|`DSS`]] es exactamente éste: el generador $g$ de `DSS` genera un subgrupo de orden $q$ **dentro** de $\mathbb{Z}_p^{*}$, que tiene orden $p-1$ — un subgrupo propio, no todo el grupo. En la voz el subgrupo se define igual —un grupo cuyos elementos están todos contenidos en el otro, con la misma operación— y el docente anticipa que *"ahora vamos a ver para qué son interesantes los subgrupos"* (cue 372): la respuesta llega recién en `DSS`.

**La abstracción vale por la portabilidad.** El docente lista grupos cada vez más raros —los restos módulo 13, polinomios, puntos de una curva elíptica— y saca la moraleja que justifica todo el repaso: *"una vez que sabemos que tiene estructura de grupo, y eso es lo lindo del álgebra, le podemos aplicar las mismas propiedades, no importa lo que sea"* (cue 362). Es exactamente lo que [[el-gamal|El Gamal]] va a explotar: el mismo esquema escrito sobre $\mathbb{Z}_p^{*}$, sobre polinomios o sobre curvas elípticas.

## Grupo cíclico, generador, orden, primitivo

La filmina 11 fija una terna de definiciones que la Clase 2 no necesitaba nombrar con este nivel de precisión porque trabajaba sobre todo con $\mathbb{Z}_n$ directamente. Acá hacen falta porque Diffie-Hellman y El Gamal se escriben sobre un grupo cíclico **genérico** $G$, no siempre $\mathbb{Z}_n$.

$$G = \bigl(\{\, g^{n} \mid n \in \mathbb{Z}\,\},\ +\bigr), \qquad g^{n} = \underbrace{g + g + \cdots + g}_{n \text{ veces}}$$

La notación exponencial es multiplicativa por convención —"$g^n$" para $n$ aplicaciones sucesivas de $+$—, así que en un grupo escrito aditivamente sería $n \cdot g$; la clase usa la notación exponencial porque los grupos de interés (`DH`, `RSA`, El Gamal) son multiplicativos módulo un número.

- **Todos los grupos de tamaño $n$ son isomorfos** entre sí, y el **grupo canónico** de referencia es $\mathbb{Z}_n = (\{0, 1, \ldots, n-1\}, +)$.
- **Generador:** un elemento $g$ tal que $\gcd(g, n) = 1$. Hay exactamente $\varphi(n)$ generadores de un grupo de tamaño $n$ — la función $\varphi$ de Euler, ya desarrollada en [[cuerpos-finitos-y-campos-de-galois#Función phi de Euler|02.16]].
- **Orden de un elemento**, $\operatorname{ord}(g)$: el tamaño del subgrupo cíclico que $g$ genera, es decir, el menor $n$ tal que $g^{n}$ vuelve al neutro.
- **Elemento primitivo:** $g$ es primitivo si $\operatorname{ord}(g) = n$ — o sea, si genera **todo** el grupo, no sólo un subgrupo propio.

Esta terna —generador, orden, primitivo— es la que decide, más adelante, qué tan grande es el espacio de exponentes válidos en `DH` (dónde vive $x$ e $y$) y por qué `DSS` necesita un generador de orden **exactamente** $q$ y no de orden $p-1$.

**El ejemplo del aula es $\mathbb{Z}_7$ con la suma, generado por el $1$:** $1, 1+1 = 2, \ldots, 7 \equiv 0$, y al llegar a $8 \equiv 1$ *"el 1 ya lo generé"* — de ahí el nombre *cíclico*: repitiendo la operación se pasa por todos los valores y se vuelve al primero. Y las **dos razones** por las que estos grupos son los que interesan, que ninguna filmina escribe: son finitos —*"ya no tenemos que tener precisión arbitraria"*, cue 407— y en ellos existe el **generador**, del que se sabe que no es único, que dado un elemento es fácil decidir si lo es, y que **encontrar uno es difícil** cuando el grupo tiene $2^{256}$ elementos. Ésa es, dicho por el docente, *"una de las asimetrías que se usan en varios de estos problemas"*. Es la misma línea que el apunte de [[cuerpos-finitos|Cuerpos finitos]] deja como la más pesada del vault: no se conoce algoritmo eficiente para hallar un elemento primitivo.

> [!quote]- De la transcripción — el grupo cíclico módulo 7, y por qué los generadores son una asimetría (cues 392-417)
> *"Si yo pienso en el resto de sumar módulo 7 (…) yo tomo el elemento 1 y armo todo el grupo a partir de ahí: el primer elemento es 1, el segundo, que es 1 más 1, 2, el tercero 3 (…) en algún momento voy a llegar a 1 más 1 más 1 más 1, 8; pero como estamos con el módulo 7, eso va a ser 1, y el 1 ya lo generé. **Se les llama cíclicos porque cuando uno va repitiendo la operación va pasando por distintos valores y eventualmente vuelve al primero.** ¿Por qué nos interesan estos grupos en particular? Primero, porque son finitos: son muy amenos para implementar cosas, ya no tenemos que tener precisión arbitraria o números arbitrariamente grandes. Pero segundo, y vamos a ver que es súper interesante: en ese tipo de grupos, el elemento que fuimos repitiendo (…) tiene un nombre particular, se llama **generador**. Está demostrado que en ese tipo de grupos hay más de un generador. Y, para atarlo con lo que vimos: dado un elemento en particular, saber si es generador o no es trivial; **es muy difícil encontrar los generadores**. Si tengo módulo 7 es facilísimo; pero si estoy trabajando módulo $2^{256}$, que es una cantidad absurda de números, ya no es tan fácil encontrar ahí generadores. Y casualmente **la existencia de generadores y la dificultad de encontrarlos es una de las asimetrías que se usan en varios de estos problemas.**"*

> **Precisión nuestra sobre la palabra "generador" en la voz.** El docente define generador como el elemento que, repitiendo la operación, recorre **todo** el grupo — o sea, lo que la filmina 11 llama **elemento primitivo**. La filmina usa "generador" en un sentido más laxo (el elemento que genera *un* subgrupo cíclico, del tamaño que sea) y reserva "primitivo" para el que genera el grupo entero. En Diffie-Hellman y El Gamal las dos lecturas coinciden porque $g$ se elige generador **de $G$**; en `DSS` no, y ahí la distinción importa. Con $p$ primo, decidir si $g$ es primitivo módulo $p$ es fácil **si se conoce la factorización de $p-1$**; sin ella no lo es, y por eso los parámetros estandarizados traen $p$ y $q$ elegidos juntos.

## Anillo y cuerpo, en la forma condensada de esta clase

La filmina 12 da la misma jerarquía de [[cuerpos-finitos-y-campos-de-galois|02.16]] pero con otro orden de presentación, útil para memorizar la cadena de implicaciones:

$$\text{grupo abeliano } (G,+) \;\subset\; \text{anillo } (G,+,*) \;\subset\; \text{cuerpo } (G,+,*)$$

**Anillo:** $(G, +, *)$ tal que $(G,+)$ es grupo abeliano y $*$ es clausurada, asociativa y distributiva sobre $+$. **Cuerpo (o campo):** un anillo donde además $*$ es conmutativa, tiene neutro, y **todo elemento salvo el neutro de $+$** tiene inverso multiplicativo.

La condición *"salvo el neutro de $+$"* es la que separa un anillo cualquiera de un cuerpo: el cero nunca tiene inverso multiplicativo en ninguna estructura razonable ($0 \cdot x = 0 \neq 1$ para todo $x$), así que un cuerpo pide inverso para **todos los demás** elementos.

En la voz, el anillo es *"literalmente la definición de cómo funcionan los números enteros con la suma y la multiplicación"* (cue 423), y el cuerpo es *"la razón para introducir los números reales, que son el campo donde empiezan a cerrar todas las operaciones"* (cues 428-430). Y una advertencia honesta sobre el alcance: *"no vamos a explotar las propiedades específicas de campo en los ejemplos que vamos a ver acá"* (cue 431) — los esquemas de esta clase corren sobre **grupos**.

**Campos de Galois, en dos ideas prácticas.** Del bloque de la filmina 13 el docente rescata sólo lo que un informático necesita (cues 433-454): los elementos son **polinomios con coeficientes módulo 2** —cada término está o no está, así que $\{0, 1, x, x+1, x^{2}, \ldots\}$—, la cantidad de elementos es una **potencia de 2**, y por eso un byte o una palabra de 64 bits se mapea directo a un elemento del campo, sin transformaciones raras; y *"si bien son polinomios, se pueden operar como si fuesen máscaras de bits"*, con la sutileza de que los resultados se reducen módulo un polinomio para mantener el grado. Es exactamente el $\mathrm{GF}(2^{8})$ de `AES` que desarrolla [[cuerpos-finitos-y-campos-de-galois|02.16]]; esta clase no vuelve sobre él.

## El campo canónico Z_p*

La filmina 13 fija la notación de tamaño que el resto de la clase da por sabida:

$$\mathbb{Z}_p^{*} = \Bigl(\bigl\{\, k \mid k \in \{\mathbb{Z}_p - 0\} \wedge \gcd(k,p)=1 \,\bigr\},\ +,\ *\Bigr), \qquad p \text{ primo}, \qquad \lvert \mathbb{Z}_p^{*}\rvert = p - 1$$

Es el mismo objeto que [[cuerpos-finitos-y-campos-de-galois#El detalle que decide todo: el 0 queda afuera del segundo grupo|02.16]] llama *"el $0$ queda afuera del segundo grupo"*: $\mathbb{Z}_p$ con la suma es un grupo de tamaño $p$, pero $\mathbb{Z}_p$ con el producto **no** —porque $0$ no tiene inverso—, así que el grupo multiplicativo se define excluyéndolo, y su tamaño es $p-1$, no $p$. Esta es exactamente la notación $\mathbb{Z}_p^{*}$ que Diffie-Hellman y El Gamal usan para el grupo sobre el que corre toda la aritmética: **el generador $g$, las claves $h_1, h_2$ o $h$, todo vive en $\mathbb{Z}_p^{*}$**, nunca en $\mathbb{Z}_p$ completo.

También vale la generalización de la filmina 13 —todo campo finito tiene tamaño $p^{n}$ con $p$ primo y $n$ entero, y todos los campos del mismo tamaño son isomorfos— que es la misma que desarrolla [[cuerpos-finitos-y-campos-de-galois|02.16]] con $\mathrm{GF}(2^{m})$ como caso de interés para AES; esta clase no vuelve a ese caso particular.

## Aritmética modular, con n primo y con n compuesto

La aritmética modular es, en palabras del docente, *"transformar cualquier número en el resto de dividirlo por otro"*, con la virtud de convertir un conjunto infinito en uno finito (cues 459-462). Y sobre ese conjunto finito la estructura **depende del módulo**:

- si $n$ es **primo**, $\mathbb{Z}_n$ con la suma y el producto es un **campo finito**: *"se cumplen todas las propiedades lindas"*;
- si $n$ **no** es primo, es sólo un **anillo**: no todos los elementos tienen inverso multiplicativo.

El ejemplo del aula es $n = 6$: el $3$ no tiene inverso, porque $3\cdot1 = 3$, $3\cdot2 = 0$, $3\cdot3 = 3$, $3\cdot4 = 0$, $3\cdot5 = 3$ módulo $6$ — nunca da $1$. Y el corolario que el docente saca es el que hace funcionar `RSA`: **si uno se queda sólo con los elementos coprimos con $n$, la multiplicación vuelve a tener inverso para todos**. Ése es el grupo multiplicativo $\mathbb{Z}_n^{*}$, cuyo tamaño es exactamente $\varphi(n)$.

> [!quote]- De la transcripción — módulo 6, el 3 sin inverso, y quedarse con los coprimos (cues 465-488)
> *"En particular, si $n$ fuese un número primo, tenemos un campo finito: se cumplen todas las propiedades lindas. Si $n$ no es primo, tenemos un anillo; en particular, no va a haber inversa para todos los elementos de la operación de producto. (…) Si yo tuviese una base modular que no sea número primo, por ejemplo 6, los números módulo 6 no forman un campo finito. ¿Por qué? Porque va a haber algunos elementos que no van a tener inverso en la multiplicación. Creo que el 3, por ejemplo: módulo 6 no hay ningún número por el cual yo pueda multiplicar al 3 y que me dé 1. Fíjense que 3 por 1 es 3, 3 por 2 es 0, 3 por 3, 9, que vuelve a ser 3; 0, 3, 0, 3. Entonces el 3 no tiene inverso. Pero si yo estoy encaprichado y quiero trabajar módulo 6, y en vez de considerar los números 0, 1, 2, 3, 4, 5 saco a todos los elementos que no sean coprimos, o sea que compartan algún valor con 6 (…) ahí sí puedo trabajar. (…) Una de las cosas que se puede mostrar es que **si 2 números son coprimos entre sí, entonces el primer número va a tener inverso módulo el segundo.**"*

> **Dos correcciones a la voz** *(precisión nuestra; verificadas sobre la definición, cues 483-485)*. Al listar qué queda módulo 6, el docente dice *"sacar el 0, sacar el 2 y sacar el 3; me quedo con el conjunto de 1, 4, 5"*. **El 4 también hay que sacarlo**: comparte el factor $2$ con $6$, y de hecho $4\cdot x \bmod 6 \in \{0, 4, 2\}$ nunca da $1$. Lo que queda es $\mathbb{Z}_6^{*} = \{1, 5\}$, con $\varphi(6) = 2$ elementos —el mismo número que da la fórmula $\varphi(2)\varphi(3) = 1\cdot 2$ que él enuncia un minuto después—. Y lo que se obtiene al quedarse con los coprimos **no es "una estructura de campo finito de vuelta"**, como dice el cue 485: es un **grupo con la multiplicación**, porque la suma ya no cierra ($1 + 5 = 0 \notin \mathbb{Z}_6^{*}$). Ninguna de las dos afecta el uso que la clase le da: `RSA` sólo necesita que en $\mathbb{Z}_n^{*}$ todo elemento tenga inverso y que su tamaño sea $\varphi(n)$.

## Las tres identidades de aritmética modular

La filmina 14-15 cita, sin volver a demostrar, tres identidades que ya están probadas en el vault y que son las que hacen funcionar RSA y Diffie-Hellman:

$$a \equiv b \pmod n \iff a - b = k\cdot n \ \text{ para algún } k \in \mathbb{Z}$$

$$\gcd(k,n) = 1 \;\Longrightarrow\; \exists\, k^{-1} \mid k\cdot k^{-1} \equiv 1 \pmod n \qquad \text{(→ [[inverso-modular|Inverso modular]])}$$

$$a^{\varphi(n)} \equiv 1 \pmod n \qquad \text{(y si $p$ es primo: } a^{p-1} \equiv 1 \pmod p \text{)} \qquad \text{(→ Euler-Fermat, [[cuerpos-finitos-y-campos-de-galois#Función phi de Euler|02.16]])}$$

$$\varphi(n\cdot m) = \varphi(n)\cdot\varphi(m) \text{ si } \gcd(n,m)=1, \qquad \varphi(p^{a}) = p^{a} - p^{a-1} = p^{a-1}(p-1) \text{ si $p$ es primo}$$

> **Errata de la filmina (15), corregida en vivo por el docente.** La fórmula de $\varphi(p^{a})$ mezcla dos nombres para el mismo exponente ($a$ a la izquierda, $k$ a la derecha). Arriba va con un único nombre, $a$, siguiendo la demostración de [[cuerpos-finitos-y-campos-de-galois#Función phi de Euler|02.16]]. Al llegar a esa línea el docente se detiene: *"va a ser $p$ a la… perdón, acá lo voy a corregir de paso, así cuando se los comparto…: a ese factor, por $p$ a ese factor menos 1"* (cues 503-505). Es la segunda errata del curso que la cátedra reconoce en voz alta, después del `Mac-Forge` de la Clase 03.

**La voz llama a las dos últimas por su nombre y les da el uso.** El teorema de que cualquier elemento elevado a $\varphi(n)$ da $1$ es **el teorema de Euler** —*"no el difícil de Fermat, el simple: esto es la generalización"*—, y $\varphi(n)$ se calcula aplicando las dos reglas de multiplicatividad sobre la descomposición en primos. Y ahí el docente marca **el segundo problema asimétrico** de la clase, después de los generadores: con la factorización, $\varphi(n)$ es trivial; sin ella, calcularlo *"es un problema complicadísimo"*, porque factorizar tiene **complejidad subexponencial** — crece mucho más rápido que cualquier polinomio y no tiene solución práctica a tamaños grandes (cues 507-512). Ése es el problema del que va a colgar [[rsa|RSA]].

> [!quote]- De la transcripción — Euler, Fermat, y la asimetría de calcular el indicador (cues 489-512)
> *"Para todo número $n$, cualquier elemento que tome del conjunto, si lo elevo a un número que depende de este $n$, que se conoce como el **indicador de Euler**, el resultado va a ser siempre 1. En particular, si $n$ fuese primo, este indicador es $p - 1$: esta propiedad por ahí la vieron en algún lugar, porque hay hasta novelas escritas sobre esto, es el **pequeño teorema de Fermat**. No el difícil, el simple; esto de acá es la generalización y se conoce como teorema de Euler. (…) Con estas 2 reglas, si yo hago la famosa descomposición de números en sus factores primos, puedo calcular el indicador de Euler. Pero esto es súper importante porque acá nos chocamos con **otro problema asimétrico de la matemática**: si yo tengo la descomposición prima de un factor, es trivial calcular el indicador de Euler; pero si yo tengo el número nada más, y no tengo la descomposición en factores primos, calcular este número es un problema complicadísimo. Porque matemáticamente el problema de factorizar un número es un problema complicado: tiene **complejidad subexponencial**, crece mucho más rápido que polinómico, a tamaños suficientemente grandes no tiene solución práctica."*

**Dónde se usa cada una en el resto de la clase.** La primera identidad de Euler-Fermat es la que decide, en `RSA`, que $e \cdot d \equiv 1 \pmod{\varphi(n)}$ recupera exactamente $m$ al descifrar — porque $\varphi(n) = (p-1)(q-1)$ mide el tamaño del grupo multiplicativo $\mathbb{Z}_n^{*}$; la demostración se hizo en pantalla, y está en [[rsa#Por qué cierra: Euler-Fermat|RSA]]. La segunda, sobre el orden del grupo, decide en Diffie-Hellman que los exponentes $x$ e $y$ se sortean sobre $\mathbb{Z}_q$ — el tamaño exacto del grupo cíclico $G$.

**Y una promesa que no llegó.** El docente cierra el repaso diciendo que *"en la práctica probablemente repasemos con algunos ejercicios básicos, especialmente de aritmética"* (cue 298), y que *"tampoco se preocupen, que el cuerpo de la materia no es evaluarlos en aritmética"* (cue 515). La [[guia-04-manejo-de-claves-cifrado-asimetrico-y-firma-digital|Guía 4]] no trae ningún ejercicio de aritmética; el material de práctica sobre esto sigue siendo la [[teoria-de-numeros|tarea de la Clase 02]] y los ejemplos numéricos de [[rsa|RSA]] y [[el-gamal|El Gamal]].
