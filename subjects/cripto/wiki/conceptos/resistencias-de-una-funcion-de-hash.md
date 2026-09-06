---
title: Resistencias de una función de hash
resumen: 'Las tres propiedades exigidas a una función de hash criptográfica —resistencia a colisiones, a segundas preimágenes y a preimágenes—, su jerarquía y lo único que las distingue, que es quién elige el mensaje.'
fuentes: ["[[clase-03-macs-y-cifrado-autenticado]]", "[[practica-04-macs-hash-y-cifrado-autenticado]]"]
aliases: [Resistencias de una función de hash, Resistencia a colisiones, Resistencia a preimágenes, Resistencia a segundas preimágenes, Colisión, Preimagen, Segunda preimagen, Hash-Coll, Principio del palomar, Computacionalmente imposible, Prueba de existencia, Commitment, Libre de colisiones]
type: concepto
unidad: 1
clase: 3
orden: 7
created: 2026-08-28
updated: 2026-09-04
tags: [criptografia, hash, colisiones, preimagen, palomar, hash-coll, commitment, clase-03, transcripcion]
sources: ["Clase 03 - Criptografia - MACs y Cifrado Autenticado.pdf", "raw/clases/Clase 03pt2 - Transcripcion.VTT", "raw/practicas/Clase 4.pdf"]
---

# Resistencias de una función de hash

**Las tres propiedades que se le piden a una [[funciones-de-hash-criptograficas|función de hash]], qué las separa, y por qué no son intercambiables.** La diferencia entre las tres es una sola cosa —**quién elige qué**— y esa cosa decide qué ataque real cubre cada una.

---

> **Estas filminas se dictaron el 03/09**, en la segunda sesión de la Clase 3 (`raw/clases/Clase 03pt2 - Transcripcion.VTT`, 910 cues). Como la Clase 3 tiene **dos grabaciones** y cada una numera sus cues desde 1, en esta wiki todo cue va con **prefijo de parte**: `(cues pt1 …)` para la jornada de las filminas 1-21, del 27/08, y `(cues pt2 …)` para la de las filminas 22-41, del 03/09.
>
> Las tres fuentes de esta nota son ahora: las filminas 24-28 de la teoría, la **jornada hablada del 03/09**, y las filminas 7 y 8 de la [[practica-04-macs-hash-y-cifrado-autenticado|Práctica 04]] del **31/08** —que se adelantó a la teoría y, a diferencia de ella, **ordena jerárquicamente** las tres propiedades—. Más Katz & Lindell §5.1.2 y §5.4.

## Colisión

$$x \ne x' \quad\text{y}\quad h(x) = h(x')$$

Dos mensajes distintos con el mismo digest. Nada más. La filmina 7 de la Práctica 04 lo escribe igual —*"Para $x \ne x'$ resulta $H(x) = H(x')$ — ¡Colisión!"*— y le agrega, con un triángulo rojo de advertencia, la línea que ordena todo el tema: **"Las colisiones van a existir"**.

### Las colisiones existen siempre

La filmina 24 lo dice con el **principio del palomar**:

> Si hay $n+1$ mensajes y $n$ valores de salida, existe al menos una colisión.

Es el argumento de conteo de siempre: $n+1$ palomas en $n$ palomares obligan a que dos compartan palomar. Aplicado a una función de hash con salida de $L$ bits, el enunciado concreto es que **basta considerar $2^{L}+1$ mensajes distintos para garantizar que dos colisionan**. Y como el dominio de una función de hash no está acotado —cualquier cadena de cualquier largo— no hay $2^{L}+1$ mensajes: hay infinitos. Las colisiones no sólo existen: **son abrumadoramente mayoría**.

El docente lo dice como teoría de conjuntos, y agrega el paso que la filmina se saltea: **es la exigencia de aceptar mensajes de tamaño arbitrario** la que garantiza que el conjunto de entrada es más grande que el de salida. No es un accidente de la función, es una consecuencia de la especificación.

> [!quote]- De la transcripción — las colisiones como hecho de conteo (cues pt2 171-178)
> **171-173.** "Es posible, también, por un tema de teoría de conjuntos básica: **si tenemos una función que mapea entre dos conjuntos y el conjunto de entrada es mayor al conjunto de salida, necesariamente va a haber elementos que mapean en el mismo lugar**. Entonces existen también las colisiones."
>
> **174-178.** "Esto es una colisión: son dos mensajes distintos pero que tienen la misma etiqueta. Y estos, por definición, existen, porque típicamente las funciones de hash criptográficas **tienen que aceptar mensajes de tamaño arbitrario**; y por el solo hecho de mapearlos a una cantidad de… mensajes de tamaño finito y acotado, **ya se sabe que hay más mensajes que posibles valores**. Entonces las colisiones son algo que existe. No, no se pueden ignorar."

> **Ésta es la idea que reordena todo el tema**, y el docente la enuncia igual. La seguridad de una función de hash **no puede ser** que no haya colisiones, porque las hay y eso es un teorema, no una debilidad de diseño. Lo único que se puede pedir es que **sean computacionalmente inhallables**: que existan, que sean infinitas, y que nadie sepa exhibir ni una sola.
>
> En sus palabras: *"nosotros sabemos que es imposible evitar que haya colisiones; entonces resistencia a colisiones lo que busca es **ponerle una cuota a la dificultad de encontrarlas**"* (cues pt2 248-249).
>
> Es la misma mudanza que la [[seguridad-computacional|seguridad computacional]] hizo con el [[secreto-perfecto|secreto perfecto]]: de *"el adversario no puede"* a *"el adversario no puede en tiempo razonable"*. Acá el paso es todavía más marcado, porque el objeto que el adversario busca **está garantizado que existe**.

> **Corolario terminológico: "libre de colisiones" es el vocabulario de la cátedra.** La filmina 28 cierra diciendo que la función es *"libre de colisiones"*, y **no es un desliz de una lámina**: el docente lo usa así de forma consistente a lo largo de toda la jornada —*"se dice que la función es libre de colisiones"* (cue pt2 293), *"dada una función de hash que sea libre de colisiones"* (cue pt2 589), *"si la función de hash $H$ es libre de colisiones, este MAC es infalsificable"* (cue pt2 620)—. Es el término que hay que reconocer y devolver en un parcial.
>
> Dicho eso, **tomado literalmente el término dice lo contrario de lo que la filmina 24 acaba de demostrar** *(precisión nuestra):* funciones de hash libres de colisiones no hay. El término de la literatura y de Katz & Lindell es **resistente a colisiones** (*collision resistant*). Los dos nombran lo mismo; el segundo lo nombra sin decir una falsedad.

## Las tres resistencias

Las filminas 25, 26 y 27 dan una definición informal por propiedad. Transcriptas con su cuantificador exacto:

**Resistencia a preimágenes** (filmina 25)

> Para todo $y$, es computacionalmente imposible hallar $x$ tal que $h(x) = y$.

**Resistencia a segundas preimágenes** (filmina 26, que la titula *segundas imágenes*)

> Para todo $x$, es computacionalmente imposible hallar $x' \ne x$ tal que $h(x') = h(x)$.

**Resistencia a colisiones** (filmina 27)

> Es computacionalmente imposible hallar $x, x'$ tales que $h(x) = h(x')$ y $x \ne x'$.

Y el docente las presenta como **el paso que convierte una función de hash en una función de hash criptográfica**: *"lo que nos interesa […] para darle esta idea de criptográfica y no quedarnos sólo con función de hash, informalmente, es que se cumplan tres condiciones"* (cues pt2 179-181).

### La versión de la Práctica 04, que sí las ordena

La teoría presenta las tres en tres láminas separadas, sin relación entre ellas. **La Práctica 04 no**: su filmina 7, después de decir que las colisiones van a existir, abre una llave rotulada ***"Nociones de seguridad más débiles:"*** con dos flechas, hacia *resistente a segundas preimágenes* y hacia *resistente a preimagen*. Y su filmina 8, titulada **Niveles de Seguridad**, las **numera**:

| Nivel | Nombre en la filmina | Enunciado de la filmina |
|---|---|---|
| 1 | Resistente a Colisiones | Encontrar $x \ne x'$ tal que $H^{s}(x) = H^{s}(x')$ |
| 2 | Resistente a Segundas Preimágenes | Dado $x$, encontrar $x \ne x'$ tal que $H^{s}(x) = H^{s}(x')$ |
| 3 | Resistente a Preimagen | Dado $H^{s}(x) = y$, encontrar algún $x'$ tal que $H^{s}(x) = H^{s}(x')$ |

O sea que **la cátedra sí tiene la jerarquía por escrito**, con el mismo orden que esta nota y con el mismo orden que el docente enuncia en voz el 03/09 — sólo que está en el material de la práctica y no en el de la teoría.

> **Errata de la filmina 8 de la Práctica 04:** el nivel 3 escribe la resistencia a preimagen como *"Dado $H^{s}(x) = y$, encontrar algún $x'$ tal que $H^{s}(x) = H^{s}(x')$"*. Eso **no es la resistencia a preimagen**: es literalmente el enunciado de una colisión, con $y$ definido y después nunca usado. Como está escrito, $x' = x$ ya satisface la condición y la propiedad se vuelve trivial. Debería decir $H^{s}(x') = y$ — hallar **una** preimagen del digest dado. Los niveles 1 y 2 están bien escritos. *(Errata de contenido, verificada sobre el render de la página, no artefacto de extracción.)*

> **Errata de la filmina 8 de la Práctica 04, segunda:** los **tres diagramas de conjuntos son el mismo dibujo repetido** —dos puntos del óvalo izquierdo con flechas que llegan al **mismo** punto del óvalo derecho—, y ese dibujo es el de una **colisión**. Ilustra correctamente el nivel 1 y no ilustra ni el 2 ni el 3: una segunda preimagen debería marcar cuál de los dos puntos viene dado, y una preimagen debería partir del punto de la derecha y buscar hacia la izquierda. *(Verificado sobre el render de la página.)*

### Computacionalmente imposible, definido

Los tres enunciados descansan en la misma frase, y el docente la desarma. **"Computacionalmente imposible" no es "imposible"**: con tiempo y cómputo infinitos siempre se encuentra una preimagen, porque —por el argumento del palomar— **al menos una hay**. Lo que quiere decir es lo de siempre en este curso:

$$\text{para todo } A \text{ } \mathrm{PPT}: \quad \Pr[A \text{ lo logra}] \le \mathsf{negl}(n)$$

o sea, un algoritmo que corra en **tiempo polinómico** tiene probabilidad **despreciable** de lograrlo. Es exactamente el vocabulario de la [[seguridad-computacional|seguridad computacional]], y el docente agrega un dato de historia que vale la pena: **el término se acuñó prácticamente para las funciones de hash**, cuando nacieron.

> [!quote]- De la transcripción — qué significa "computacionalmente imposible" (cues pt2 194-201)
> **194-195.** "Es computacionalmente imposible. **Computacionalmente imposible es un término que prácticamente se acuñó para las funciones de hash cuando nacieron**, pero que es exactamente lo mismo que cuando decimos que las posibilidades de que un atacante gane una prueba sean despreciables."
>
> **197-198.** "Es imposible… **no es absolutamente imposible**, porque alguien con tiempo y capacidad de cómputo infinita podría probar el universo de todos los mensajes posibles y encontrar alguno definitivamente, **porque al menos uno hay**."
>
> **199-201.** "Que sea computacionalmente imposible quiere decir que **un algoritmo que corra en tiempo polinómico** sobre el tamaño del conjunto de posibles etiquetas **va a tener una probabilidad despreciable** de encontrar una preimagen."

### Preimagen es más fuerte que la no invertibilidad de un MAC

El docente conecta la primera resistencia con algo ya visto, y la comparación ubica bien el nivel de exigencia. De un [[message-authentication-code|MAC]] se dijo que **no existe el "des-Mac"**: la etiqueta no permite reconstruir el mensaje. La resistencia a preimágenes es **eso, pero más fuerte** — no alcanza con que no haya un algoritmo de inversión, se exige que **ningún** algoritmo `PPT` pueda hallar **algún** mensaje que dé esa etiqueta, ni siquiera uno distinto del original.

Y ese matiz está en la letra de la propiedad: lo que se pide es imposible hallar **un** $x$ con $h(x) = y$, no *el* $x$ original. El docente lo aclara al pasar: *"acuérdense que puede haber más de uno que dé la misma etiqueta"* (cues pt2 203-204).

> [!quote]- De la transcripción — la resistencia a preimágenes contra el "des-Mac" (cues pt2 184-188)
> **184-186.** "Yo les dije cuando introduje los [MAC] que, a diferencia de los criptosistemas, no existe el [MAC] y el des-[MAC], el inverso: no se puede recuperar el mensaje."
>
> **186-188.** "Esa propiedad no necesariamente es lo que buscamos en la función de hash: **buscamos algo un poco más fuerte todavía**, que llamamos resistencia a preimágenes."

### Segunda preimagen: la propiedad que cierra el ciclo

Por qué no alcanza con la primera, dicho por la cátedra: la resistencia a preimágenes protege contra **el que sólo tiene el digest**; no dice absolutamente nada sobre **el que además tiene el documento original**. Y ése es un adversario real: es el que quiere sustituir un archivo por otro que valide contra el hash ya publicado.

> [!quote]- De la transcripción — qué agrega la segunda preimagen (cues pt2 241-245)
> **241-242.** "Entre la propiedad anterior y esta **se termina de cerrar el ciclo**, porque esta nos garantiza que **el que tenía el documento original no puede usar ese documento original tampoco como ayuda** para generar un segundo documento. […] **La primera propiedad no dice nada de eso.**"
>
> **243-245.** "La primera propiedad nos dice que nadie puede, a partir del hash que se publica, recuperar el documento o un documento parecido. Esta nos dice que **a partir de un documento es imposible generar un segundo documento** que tenga la misma [etiqueta]."

### Lo único que las distingue es quién elige

Leídas de corrido las tres suenan parecidas. La diferencia está en **qué le dan al adversario y qué tiene que producir él**:

| Propiedad | Le dan | Tiene que producir | Grados de libertad |
|---|---|---|---|
| Preimagen | un digest $y$ | un $x$ con $h(x) = y$ | ninguno: el objetivo está fijo |
| Segunda preimagen | un mensaje $x$ | un $x' \ne x$ con $h(x') = h(x)$ | uno: elige $x'$, pero $x$ le vino dado |
| Colisión | nada | cualquier par $x \ne x'$ que coincida | dos: elige **los dos** mensajes |

**Cuantos más grados de libertad, más fácil el ataque**, y por lo tanto **más fuerte la propiedad** que lo declara inviable. Resistir colisiones es lo más difícil de las tres, porque es resistir al adversario más libre.

**Este criterio salió en clase, y lo verbalizó un alumno.** El docente preguntó qué diferencia hay entre colisiones y segundas preimágenes; Emilio Mitchell contestó con la formulación exacta —en una el $x$ está fijo, en la otra se eligen los dos—, y el docente le puso el nombre: **un grado más de libertad**.

> [!quote]- De la transcripción — los grados de libertad, con respuesta de alumno (cues pt2 254-264)
> **254.** Pablo Abad: "¿Cuál es la diferencia, a ver si a alguien se le ocurre, entre esta propiedad y las segundas preimágenes? Porque son muy parecidas."
>
> **259.** Emilio Mitchell: "En uno tienes un $x$ fijo y en el otro eliges tanto $x$ como [$x'$]."
>
> **260-264.** Pablo Abad: "Muy bien, correcto. […] **En segundas [preimágenes] nosotros partimos de un documento que ya existe, $x$, y nuestro objetivo es encontrar un segundo. En colisiones tenemos un grado más de libertad: tenemos que inventarnos dos documentos.**"

> **La versión de Katz & Lindell, que cuantifica distinto** *(precisión nuestra).* La filmina dice *"para todo $y$"* y *"para todo $x$"*; el libro los enuncia sobre un $y$ (o un $x$) **uniforme**, y con $s$ entregado al adversario:
> - *Segunda preimagen* (o **target-collision resistance**): dado $s$ y un $x$ uniforme, es inviable hallar $x' \ne x$ con $H^{s}(x') = H^{s}(x)$.
> - *Preimagen*: dado $s$ y un $y$ uniforme, es inviable hallar $x$ con $H^{s}(x) = y$. El libro agrega la lectura que conviene retener: **esto es decir que $H^{s}$ es de una vía** (*one-way*).
>
> "Uniforme" es más débil que "para todo", y es la versión que se puede sostener y demostrar. La cuantificación universal de la filmina se lee bien como enunciado informal; en una demostración hay que usar la otra.

## La jerarquía

$$\text{resistente a colisiones} \;\Longrightarrow\; \text{resistente a segundas preimágenes} \;\Longrightarrow\; \text{resistente a preimágenes}$$

**pero la implicación es asintótica, no matemática.** Ésa es la corrección más importante que trajo la sesión del 03/09, y hay que leerla antes que la cadena de arriba.

### La salvedad que la cátedra dio sin que se la pidieran

El docente volvió sobre el tema por iniciativa propia —*"algo que se me escapó decirles"*— justo antes de entrar a los ataques por fuerza bruta, y lo que dijo es más fino que la implicación pelada:

- **La resistencia a colisiones NO garantiza matemáticamente** las otras dos. Hay **casos borde** donde la implicación se cae: **si la entrada es muy chica**, o **si la cantidad de mensajes involucrados es muy chica**. Existe toda una taxonomía de subcasos —segundas preimágenes sobre conjuntos chicos, sobre etiquetas de tamaño chico— que el docente declara **fuera del alcance de la materia**.
- **Asintóticamente sí.** Con **etiquetas de tamaño grande** y **potencialmente muchos mensajes**, la resistencia a colisiones **sí** garantiza las otras dos. *"Por eso nos centramos sólo en esa prueba."*

> [!quote]- De la transcripción — la implicación es asintótica y tiene casos borde (cues pt2 471-478)
> **472-474.** "Algo que se me escapó decirles: **la resistencia a colisiones se relaciona con estas dos, pero de una forma bastante compleja, y no garantiza segundas preimágenes y preimágenes matemáticamente**."
>
> **475-476.** "Porque **hay casos borde donde no lo puede garantizar: si la entrada es muy chica, o si la cantidad de mensajes que ciframos son muy chicos**. Entonces hay como subcategorías que se escapan del conocimiento de la materia, donde se habla de segundas preimágenes en conjuntos chicos, segundas preimágenes [con] etiquetas de tamaño chico…"
>
> **477-478.** "**Ahora: asintóticamente, cuando hablamos de etiquetas de tamaño grande y potencialmente muchos mensajes, resistencia a colisiones garantiza las otras dos propiedades. Por eso nos centramos sólo en esa prueba.**"

**Y esa salvedad no es un tecnicismo: es la puerta por la que entra el [[ataque-de-diccionario-sobre-hashes|ataque de diccionario]].** El Ejercicio 6 de la Guía 3 pide recuperar la nota de un alumno a partir del hash `SHA-1` de un dominio de **diez elementos**. `SHA-1` es —o era— resistente a colisiones, y sin embargo esas preimágenes se recuperan con diez llamadas a `openssl`. No hay contradicción: es exactamente **el caso borde "la entrada es muy chica"** que el docente deja fuera del programa. La jerarquía vale para dominios grandes; el ataque de diccionario vive donde no vale. Ver [[ataque-de-diccionario-sobre-hashes#El costo no es 2 elevado a la 160, es el tamaño del dominio|El costo no es 2 elevado a la 160, es el tamaño del dominio]].

### Por qué la implicación funciona cuando funciona

Con las hipótesis de tamaño puestas, los dos pasos de la cadena son éstos.

**Primera implicación — sin salvedades.** Si alguien, dado un $x$ uniforme, halla $x' \ne x$ con el mismo digest, entonces ese par $(x, x')$ **es** una colisión. Un hallador de segundas preimágenes es literalmente un hallador de colisiones. Contrarrecíproco: si no hay colisiones hallables, no hay segundas preimágenes hallables.

**Segunda implicación — con una salvedad que importa.** Supongamos que alguien sabe hallar preimágenes. Entonces se construye un hallador de segundas preimágenes así: dado $x_0$, se calcula $y := H^{s}(x_0)$, se le pasa al hallador de preimágenes, y devuelve un $x$ con $H^{s}(x) = y$. Si $x \ne x_0$, gana.

**El "si" es toda la salvedad.** El argumento necesita que **con alta probabilidad $x \ne x_0$**, y eso descansa en que **$H$ comprime**: como muchísimas entradas van al mismo digest, es improbable que el hallador devuelva justo el $x_0$ del que se partió. Si $H$ fuera inyectiva la única preimagen sería $x_0$ y el argumento se cae entero. O sea: **la segunda implicación no es un hecho lógico, es un hecho sobre funciones que comprimen** — y "que comprimen mucho", que es otra forma de decir la hipótesis de tamaño del docente.

> **Y la salvedad de la bibliografía, que apunta al mismo lugar.** Katz & Lindell dice explícitamente que **no** define formalmente estas nociones ni demuestra estas implicaciones, porque no las usa en el resto del libro: quedan enunciadas de manera informal y formalizarlas es el **Ejercicio 5.1**. Cualquier nota —ésta incluida— que las presente como teoremas las está sobrevendiendo. Se usan como brújula, no como lema. Que es, dicho de otro modo, lo mismo que la cátedra dijo en voz el 03/09.

### Las implicaciones no se invierten

Y no es una posibilidad teórica: **es el estado real de `MD5` y de `SHA-1`**. Las dos están rotas para colisiones —hay pares publicados— y **siguen sin ataque práctico de preimágenes**. Son el contraejemplo caminando de que resistir preimágenes no implica resistir colisiones. Ver [[primitivas-de-hash-estandar|Primitivas de hash estándar]] y [[seguridad-de-las-funciones-de-hash|Seguridad de las funciones de hash]].

### La propiedad más fuerte es la más barata de romper

Suena contradictorio y no lo es:

| Propiedad | Costo del mejor ataque genérico |
|---|---|
| Preimagen | $2^{L}$ |
| Segunda preimagen | $2^{L}$ |
| Colisión | $\Theta(2^{L/2})$ |

No se conoce **ningún** ataque genérico a preimágenes ni a segundas preimágenes que haga menos de $2^{L}$ evaluaciones. Para colisiones, en cambio, el **ataque del cumpleaños** baja el costo a la raíz cuadrada. La explicación es la de la tabla de grados de libertad, y el docente la anticipa acá mismo, antes de llegar a la filmina de seguridad: con dos grados de libertad se puede jugar **todos contra todos** en vez de todos contra uno.

> [!quote]- De la transcripción — por qué colisiones cuesta menos, anticipado (cues pt2 267-274)
> **267.** "A falta de un ataque más inteligente, un ataque por fuerza bruta acá sería: yo tengo $x$ y empiezo a generar un documento al azar; ¿el hash es igual? No. Otro documento; ¿el hash es igual? No. Hasta encontrarlo."
>
> **268-271.** "Con la función colisión yo puedo hacer algo un poco más inteligente: **genero el primer documento, genero el segundo, ¿las etiquetas coinciden? No. Genero un tercero, pero ahora puedo comparar la etiqueta del tercero contra las dos que generé; y cuando genero el cuarto, comparo contra las tres; y el quinto contra las cuatro, y así sucesivamente.**"
>
> **272-274.** "Uno dice: sí, pero cuando tienes un trillón de etiquetas se complica. Se complica un poco, pero **es un problema que sabemos resolver muy eficientemente con cómputo distribuido: no es que se vuelve intratable**."

Es la razón por la que una salida de 160 bits da $2^{80}$ contra colisiones y ya no alcanza. Los números, la paradoja del cumpleaños y el desarrollo del ataque están en [[seguridad-de-las-funciones-de-hash|Seguridad de las funciones de hash]].

## El juego Hash-Coll

La filmina 28 formaliza sólo la tercera propiedad —la más fuerte— con el mismo molde que [[seguridad-de-un-mac|Mac-Forge]] y que las [[pruebas-de-indistinguibilidad|pruebas de indistinguibilidad]]. Y el docente explica **por qué sólo una**: hay varias pruebas de seguridad para funciones de hash —*"es todo un mundo"*— y la materia se queda con la que considera medular para el uso cotidiano, que es justamente la resistencia a colisiones (cues pt2 278-281).

Dado un nivel de seguridad $n$, un adversario $A$ y una familia de funciones de hash:

$$\begin{aligned}
&1)\;\; \text{se selecciona una función } s \leftarrow S\\
&2)\;\; A \text{ obtiene acceso a } H(x) = H^{s}(x)\\
&3)\;\; A \text{ emite } x,\, x'
\end{aligned}$$

$$\mathsf{Hash\text{-}Coll}_{A,H} = 1 \quad\text{si}\quad x \ne x' \;\text{ y }\; H(x) = H(x')$$

$$\text{Si}\quad \Pr[\mathsf{Hash\text{-}Coll}_{A,H} = 1] < \mathsf{neg}(n) \quad\text{para todo } A\ \mathrm{PPT}, \quad H \text{ es libre de colisiones}$$

**Dos lecturas del paso 2**, que es el único que tiene sustancia:

- *"Obtiene acceso a"* sugiere un **oráculo**, como en `CPA` o en `Mac-Forge`. Acá no hace falta: como $s$ es **público**, entregárselo al adversario le da la función entera, no un oráculo. Katz & Lindell le pasa $s$ directamente. **Y eso es el punto**: la resistencia a colisiones tiene que valer **conociendo $s$**, que es exactamente lo que la distingue de la seguridad de un MAC. *(Precisión nuestra.)*
- Por eso mismo el juego **no tiene fase de consultas ni conjunto $Q$**: no hay nada que consultar. Comparado con `Mac-Forge`, `Hash-Coll` es notablemente más simple, y la razón es que no hay ningún secreto que proteger.

**Y el paso 1, que parece decoración, es el corazón de la prueba.** El docente lo desarrolla entero: la selección está para prohibirle al adversario **traer una colisión precomputada**, porque con una única función fija bastaría con cablearle adentro un par colisionante conocido para ganar siempre. El desarrollo completo, con la cita y con la versión de Katz & Lindell, está en [[funciones-de-hash-criptograficas#Por qué la teoría define una familia igual|Por qué la teoría define una familia igual]].

> **Notación de la filmina** *(precisión nuestra).* La filmina escribe la familia como $H^{x}(n)$ y en el mismo juego usa $x$ para los mensajes que el adversario emite. Son dos cosas distintas con la misma letra: el índice de la familia es $s$, como dice el paso 1. Leer $\{H^{s}\}$.
>
> Además, el umbral va escrito con $<$; la forma canónica del vault para estas cotas es $\le \mathsf{negl}(n)$ (ver [[notacion-y-terminologia|Notación y terminología]]). La diferencia no cambia nada acá.

## Prueba de existencia: el commitment

Es el uso que el docente desarrolla **más largo** de toda la jornada, y el vault no lo tenía. Se llama **prueba de existencia** o **commitment**, y el docente dice que *"se usa mucho en protocolos, ya cuando queremos construir soluciones criptográficas que tienen que combinar cosas"* (cue pt2 234).

**El mecanismo, en dos tiempos:**

1. **Comprometerse.** Quien tiene el documento publica **sólo el digest** $h = H^{s}(\text{documento})$. El digest no revela el documento.
2. **Abrir.** Más tarde publica el documento. Cualquiera recalcula el hash —son determinísticos— y verifica que coincide con el que se publicó en el paso 1.

Lo que eso demuestra es: **el documento existía en el momento del paso 1 y no fue modificado después**.

**Los dos ejemplos de la cátedra:**

- **Una apuesta sobre un resultado ya escrito.** El evento ya ocurrió y su resultado está escrito en algún lado; alguien apuesta sobre él. La desconfianza natural del apostador es que haya **dos sobres** y que al final le muestren el que le conviene al otro. Publicando la etiqueta **antes** y el documento **al final**, esa maniobra queda cerrada.
- **Una patente con fórmula secreta.** Las patentes sensibles —el docente pone el caso de la industria farmacéutica— se guardan bajo secreto, y eso obliga a confiar en el depositario, que podría estar de acuerdo con el titular y dejarlo "actualizar" el documento si hay una disputa. Registrar **junto con la patente un hash de la documentación** permite demostrar, años después, qué documento existía el día del registro.

> [!quote]- De la transcripción — la prueba de existencia y sus dos ejemplos (cues pt2 206-234)
> **206-207.** "Piensen un poco ya en los usos que abre esto, porque esto abre un tipo de servicio que se llama **prueba de existencia**, donde yo puedo demostrar que algo existe **sin revelar ese algo**."
>
> **213-218.** "Como el evento ya existe, el que va a hacer la apuesta, lo que no va a querer es que lo estafen de alguna manera. […] **Yo tendría desconfianza de que haya tipo dos sobres**: yo apuesto a uno y me sacan el sobre que dice… […] Entonces podría demostrar que el resultado del evento está escrito **revelando la etiqueta de ese mensaje** y, llegado el momento final, **mostrando el documento**."
>
> **219-221.** "Porque es fácil, con el documento, calcular y ver que hace match con la etiqueta —si le aplico el hash de vuelta, **los hash son determinísticos**, lleva la misma etiqueta—; y esta propiedad me diría que, **habiendo publicado la etiqueta, es imposible que hayan inventado un segundo documento que justo le pega la misma etiqueta**."
>
> **231-232.** "En este tipo de patentamiento con fórmula secreta, uno podría aplicar en el mundo digital construcciones de este tipo y, **junto con la patente, dejar asentado un hash de la documentación**; lo que permitiría, si en el futuro hay una disputa, **demostrar que cuando se patentó existía el documento y que no fue modificado**."
>
> **234.** "**Estas pruebas de existencia —o *commit*, se llama también—** se usan mucho en protocolos, ya cuando queremos construir soluciones criptográficas que tienen que combinar cosas."

### Qué resistencia sostiene cada mitad

El docente introduce el ejemplo **bajo la resistencia a preimágenes**, pero el argumento que da en el cue pt2 221 —*"es imposible que hayan inventado un segundo documento que justo le pega la misma etiqueta"*— **no es preimagen**: es segunda preimagen. Vale la pena separarlo, porque un commitment necesita **las dos cosas al mismo tiempo** *(lectura nuestra, sobre lo dicho en clase).*

| Propiedad del commitment | Qué garantiza | Resistencia que la sostiene |
|---|---|---|
| **Ocultamiento** (*hiding*) | del digest publicado no se deduce el documento | **preimagen** |
| **Vinculación** (*binding*) | quien publicó el digest no puede abrirlo con otro documento | **segunda preimagen** / **colisiones** |

Y la distinción no es cosmética: **quién elige el documento decide cuál de las dos hace falta**. Si el documento comprometido lo elige un tercero, alcanza con segunda preimagen; si lo elige **el mismo que se compromete** —que es el caso de la apuesta y el de la patente—, hace falta **resistencia a colisiones**, porque ese adversario puede fabricar **los dos** documentos de antemano. Es el mismo razonamiento del caso de la firma, más abajo.

> **Y una advertencia sobre el ocultamiento** *(lectura nuestra).* La resistencia a preimágenes es **necesaria y no suficiente** para ocultar: si el documento comprometido pertenece a un conjunto chico o adivinable —"gana el equipo A" o "gana el equipo B"—, el hash no oculta nada, porque el otro hashea las dos opciones y compara. Los esquemas de commitment reales agregan un **valor aleatorio** al documento antes de hashear, exactamente por esta razón. Es el mismo fenómeno de [[ataque-de-diccionario-sobre-hashes|Ataque de diccionario sobre hashes]], en otro escenario. La cátedra no lo mencionó.

## Qué ataque real cubre cada resistencia

Las tres propiedades no son tres niveles de exigencia sobre la misma amenaza: **cada una es la amenaza de un escenario distinto**. *(Lectura nuestra: ni las filminas ni la clase mapean propiedad contra escenario; el mapeo es el que hace falta para no elegir mal.)*

| Escenario | Quién elige el mensaje | Resistencia que hace falta |
|---|---|---|
| **Firmar un documento** — se firma $h(x)$, no $x$ | el atacante prepara **los dos** documentos y hace firmar el inocuo | **colisiones** |
| **Verificar una descarga** contra el hash publicado | el archivo legítimo $x$ ya existe y no lo eligió el atacante | **segundas preimágenes** |
| **Almacenar contraseñas** — la base guarda $h(x)$ | el atacante ve el digest y quiere el mensaje | **preimágenes** |
| **Commitment de un documento propio** | el que se compromete elige el documento, y puede elegir dos | **colisiones** |

**El caso de la firma es el que más se subestima.** La objeción natural es *"una colisión al azar no sirve para nada, van a ser dos cadenas de basura"*. Es falsa: el atacante no necesita colisionar mensajes aleatorios, necesita colisionar **dos mensajes que él quiere**. El ejemplo de Katz & Lindell es una empleada que quiere que una carta de despido colisione con una carta de recomendación: escribe la misma carta con palabras intercambiables por sinónimos y, con **64 palabras con un sinónimo cada una**, genera $2^{64}$ variantes del mismo texto. Después busca la colisión **entre los dos conjuntos**. El desarrollo completo, en [[seguridad-de-las-funciones-de-hash|Seguridad de las funciones de hash]].

**Y el caso de las contraseñas tiene una trampa.** La resistencia a preimágenes es **necesaria pero no suficiente**: dice que es inviable invertir el hash de una entrada **uniforme**, y una contraseña no es uniforme ni por casualidad. Contra un diccionario de $10^{9}$ candidatos, una función de hash perfecta no defiende nada — el atacante hashea el diccionario. Por eso lo que se usa no es un hash a secas sino **sal más una función deliberadamente lenta**. *(Lectura nuestra; el curso no lo desarrolla acá.)*

## Ver también

- [[funciones-de-hash-criptograficas|Funciones de hash criptográficas]] — la definición, y por qué el selector $s$ es público
- [[construccion-de-merkle-damgard|Construcción de Merkle-Damgård]] — el teorema que traslada la resistencia a colisiones de la función de compresión al hash entero
- [[seguridad-de-las-funciones-de-hash|Seguridad de las funciones de hash]] — el ataque del cumpleaños, los $2^{L/2}$ y los tamaños de salida que hoy alcanzan
- [[primitivas-de-hash-estandar|Primitivas de hash estándar]] — cuáles cayeron, por qué propiedad, y en qué año
- [[ataque-de-diccionario-sobre-hashes|Ataque de diccionario sobre hashes]] — el caso borde de la jerarquía: dominios chicos, donde resistir colisiones no protege nada
- [[seguridad-de-un-mac|Seguridad de un MAC]] — el juego `Mac-Forge`, del que `Hash-Coll` es la versión sin secreto
- [[seguridad-computacional|Seguridad computacional]] — `PPT` y función despreciable, el vocabulario que "computacionalmente imposible" traduce
- [[estado-de-un-criptosistema|Estado de un criptosistema]] — seguro, debilitado y quebrado; una función rota para colisiones y sana para preimágenes es el caso de manual
- [[clase-03-macs-y-cifrado-autenticado|Clase 03 — MACs y cifrado autenticado]] — las dos sesiones, 27/08 y 03/09
- [[practica-04-macs-hash-y-cifrado-autenticado|Práctica 04 — MACs, hash y cifrado autenticado]] — los "Niveles de Seguridad" de la filmina 8, con sus dos erratas
- Katz & Lindell cap. 5 *Hash Functions and Applications*, §5.1.2 y §5.4 ([[bibliografia|bibliografía]])
