---
title: Elección de primitivas en un proyecto
resumen: 'Regla práctica de ingeniería: no desarrollar criptografía propia sino usar primitivas y bibliotecas públicas ya escrutadas, con las funciones recomendadas, los tamaños de clave y el límite que tiene ese escrutinio.'
fuentes: ["[[clase-02-cifrado]]", "[[principio-de-kerckhoffs]]", "[[estado-de-un-criptosistema]]"]
aliases: [Elección de primitivas, Criptosistemas en proyectos, Primitivas recomendadas, No inventes criptografía, Tamaños de clave]
type: concepto
unidad: 1
clase: 2
orden: 12
created: 2026-08-21
updated: 2026-09-04
tags: [criptografia, buenas-practicas, aes, salsa20, tamanos-de-clave, tp, clase-02, transcripcion]
sources: ["Clase 02 - Criptografia - Cifrado.pdf", "raw/clases/Clase 02pt2-Transcripcion.VTT"]
---

# Elección de primitivas en un proyecto

El cierre práctico de la Clase 02: qué se usa de verdad, y por qué **no** hay que escribir criptografía propia.

---

## La regla

> Se considera **mala práctica** desarrollar un criptosistema nuevo para un proyecto.
> Existen funciones que han sido **estudiadas por años** para llegar a un nivel de confianza adecuado.
> Continuamente se publican avances que afectan la seguridad de funciones existentes.

Las dos frases juntas dicen algo más fuerte que "usar bibliotecas": dicen que la **confianza en una primitiva es un producto del tiempo y del escrutinio público**, no del ingenio de quien la escribió. Un algoritmo nuevo no es *inseguro* — es **desconocido**, que a los fines prácticos es peor. Y como el escrutinio nunca termina, la elección hay que **revisarla**, no clavarla una vez.

> Es la consecuencia operativa del [[principio-de-kerckhoffs|principio de Kerckhoffs]] y del contraste [[des-y-3des|DES vs. AES]]: el diseño secreto de las cajas $S$ de DES costó quince años de desconfianza; el concurso abierto de AES compró credibilidad desde el día uno.

**El porqué, dicho en clase, es de implementación y no de diseño:** *"es muy jodido implementar las cosas bien, y es muy fácil que por una implementación incorrecta de algo que está bien ustedes dejen una puerta abierta sin querer"* (cues pt2 433-437). O sea que la regla no dice sólo *"tu algoritmo puede ser malo"*: dice que **aun con el algoritmo correcto, el código propio es el eslabón débil**, porque toda la seguridad del resto del sistema descansa en que esa pieza se comporte exactamente como se supone.

### La enmienda de 2026: tampoco el criptosistema que te da un modelo

**El docente reescribe la filmina en voz alta**, y es la línea de toda la clase más directamente aplicable al [[tp-implementacion|TP]]. El motivo de la regla no cambió —lo que compra confianza es el **escrutinio acumulado**, no que el código parezca correcto—, pero sí cambió lo barato que es producir criptografía nueva: lo que antes costaba semanas de trabajo ahora se pide y llega hecho, y eso **no** agrega ni un día de escrutinio.

> [!quote]- De la transcripción — la regla actualizada, y por qué (cues pt2 469-473)
> *"Había una época en que hacer esto era más jodido. Fíjense que yo les expliqué DES en detalle: hay que sentarse y demora mucho tiempo hacerlo. A mí me llevó, hace 20 años, **una o dos semanas** hacer esa implementación (…) Era más difícil hacerlo. Ahora se puede, porque ahora ustedes le pueden decir [a un modelo] que se lo haga. **Eso es hiper riesgoso.**"*
>
> Y la reescritura, textual: *"O sea, **esto debería cambiarse a: se considera mala práctica desarrollar un criptosistema nuevo para un proyecto, o usar uno que te dé un [modelo de lenguaje]** (…) Es preferible ir por **la librería que está escrutiñada**, que está más probada, que la ven otros también."*
>
> *(El ASR destroza la palabra que nombra la herramienta en los cues 472-473; va entre corchetes. La implementación de DES que menciona es la suya — ver [[implementaciones-de-referencia|Implementaciones de referencia]].)*

### La única excepción que la clase admite

La filmina enuncia la regla y punto. La clase agrega **bajo qué condición se dobla**, y la condición no es *"somos cuidadosos"*: es **desconfianza de la cadena de suministro** más un equipo que sepa criptografía. El escenario que da es un proyecto grande que puede pagar el costo de no depender de nadie, en un contexto donde el hardware sobre el que uno se monta puede estar trabajando para el fabricante y no para uno.

> [!quote]- De la transcripción — cuándo el mantra admite excepción (cues pt2 440-449)
> *"En un proyecto muy grande, que involucra muchas cosas y que puede llegar a asumir cierto costo, está bueno **no depender de nadie** y que ustedes tengan el control total del esquema. Y esto se vuelve muy importante sobre todo en esta última época, **a dónde el hardware viene con trampa**: viene con algo interno que no actúa por ustedes, sino que está actuando **a favor del fabricante** (…) hay muchos chips, microcontroladores, circuitos integrados completos que internamente hacen algunas cosas."*
>
> Con el freno puesto: *"**tómenlo con pinzas**. Es el mantra más fuerte, pero, como todo mantra, puede tener una excepción. Un proyecto muy grande, bueno, quizás no es tan mala idea, si puede haber un equipo dedicado — **lo que sí, seguro tiene que ser un equipo de gente que conozca de criptografía**."*

### El escrutinio ayuda, pero no es una garantía

La segunda mitad de la regla —*"existen funciones que han sido estudiadas por años"*— se traduce en clase a una decisión de ingeniería concreta: usar la biblioteca pública más mirada que haya, con la fórmula *"nobody gets fired for hiring IBM"*. Para cifrar, eso hoy es `OpenSSL`. **Pero elegir bien la biblioteca no cierra el problema**, y el contraejemplo que da la clase es el mejor que hay, porque el bug no estuvo en el algoritmo ni en el modo sino en **cómo se sembraba la clave**: alguien "arregló" una inicialización que parecía un descuido y con eso redujo drásticamente el conjunto de claves alcanzables. Es el mecanismo del [[generador-pseudoaleatorio|generador pseudoaleatorio]] otra vez — menos entropía en la semilla, menos claves alcanzables — y es la misma falla que vuelve peligrosas a las [[des-y-3des#Impacto real|claves débiles de DES]].

> [!quote]- De la transcripción — el escrutinio y su límite (cues pt2 456-467)
> *"La utilización de algoritmos e implementaciones **que son públicas y que tienen mucho escrutinio** es una buena idea (…) *nobody gets fired for hiring IBM* (…) Si tienen que hacer algo de cifrado y usan **OpenSSL**, que es la librería open source más utilizada en casi todo, bueno, es una **excelente decisión de ingeniería**."*
>
> Y el límite: *"Ahora, eso no nos salva de todo. De hecho pasó: **habían metido un commit en OpenSSL que cambiaba la manera en que se inicializaba una clave**. Cuando uno inicializaba la memoria para poner la clave, quedaba lo que la memoria tenía. **Eso generaba más entropía**, y hacía que la clave que después se derivaba fuese mejor. Alguien dijo: uy, acá se olvidaron de poner ceros, y metió una línea (…) **[esa inicialización] redujo un montón las claves posibles. Era mejor que estuviese basura, porque generaba más entropía.**"*

> **Precisión nuestra.** Es el bug de `OpenSSL` en **Debian, 2008** —dieciocho años, no *"unos 10"*—. Lo que se quitó fue la línea que sembraba el pool de entropía con memoria sin inicializar, para acallar un aviso de Valgrind, y el efecto fue dejar el PID del proceso como única fuente de azar. La versión del docente —*"metió ceros"*— es una aproximación; **la causa y la consecuencia que describe son las correctas**.

## Criptosistemas de flujo recomendados

Funciones $G(\cdot)$:

| $G(\cdot)$ | Firma / uso | Estado |
|---|---|---|
| ~~RC4~~ | https y WEP | tachado |
| ~~CSS~~ | DVDs | tachado |
| ~~A5/1, A5/2~~ | GSM | tachado |
| ~~E0~~ | Bluetooth | tachado |
| **Salsa20** | $\{0,1\}^{128\ \text{o}\ 256} \times \{0,1\}^{64} \to \{0,1\}^{n}$, $n = 2^{64}\cdot 2^{9}$ | recomendado |
| **Rabbit** | $\{0,1\}^{128} \times \{0,1\}^{64} \to \{0,1\}^{n}$, $n = 2^{128}$ | recomendado |

El $\{0,1\}^{64}$ de los dos recomendados es el **IV**, señalado con una flecha en la filmina. Los cuatro tachados no lo tienen en la firma — y esa es, estructuralmente, la diferencia entre las dos mitades de la tabla. Ver [[cifrado-probabilistico-nonce-e-iv|nonce e IV]]. La lectura queda confirmada en voz: al recorrer la tabla el docente llama a ese campo *"el vector de inicialización"*, no lo deduce de la flecha (cues pt2 493-498).

### La primera fila es la regla rota en vivo

**`RC4` no está tachado por ser un mal algoritmo: está tachado por cómo lo usó `WEP`.** Es el caso que la clase cuenta para ilustrar qué pasa cuando un equipo que no es de criptografía se arma su propia seguridad — y el modo de falla es el de [[cifrado-probabilistico-nonce-e-iv|nonce e IV]], no el de la primitiva: **el mismo vector de inicialización todo el tiempo**, que es exactamente el escenario donde un [[criptosistema-de-flujo|cifrado de flujo]] deja de proteger nada.

> [!quote]- De la transcripción — WiFi al principio era suicida (cues pt2 450-455)
> *"Cuando sale WiFi, la primera vez, WiFi fue diseñado por gente que era **de comunicaciones**, que conocía radiofrecuencia. Lo que hicieron fue exportar la misma idea que existía en Ethernet a un espacio de radiofrecuencias (…) y dijeron: bueno, che, tenemos que ponerle algo de seguridad. **Armemos un algoritmo. Armemos uno nosotros.**"*
>
> *"[Terminó usándose] **RC4**, que es un algoritmo de cifrado en flujo, y que tenía problemas de seguridad tremendos. **Por eso WiFi era suicida al principio** (…) una de las cosas que hacía era **inicializar siempre con la misma clave**, una pavada: todos los vectores de inicialización eran con la misma clave (…) entonces era muy sencillo de atacar, **casi trivial**. Y justamente porque se olvidaron de esa regla de no implementar eso sin usar algo diseñado por gente específica de criptografía."*

> **Precisión nuestra.** `RC4` lo diseñó **Ron Rivest** en RSA Security, en 1987, años antes de `WEP`; el grupo de WiFi no lo inventó, lo **usó mal** (un IV de 24 bits concatenado a la clave). El docente le atribuye el diseño dos veces (cues pt2 453 y 493). La moraleja que saca —la falla vino de armarse la seguridad sin gente de criptografía— se sostiene igual, y encaja mejor con la corrección: lo que se improvisó no fue la primitiva sino **el protocolo que la envuelve**.

## Criptosistemas de bloque recomendados

| Primitiva | Firma | Modos que lista | Estado |
|---|---|---|---|
| ~~DES~~ | $\{0,1\}^{56} \times \{0,1\}^{64} \to \{0,1\}^{64}$ | — | tachado |
| **IDEA** | $\{0,1\}^{128} \times \{0,1\}^{64} \to \{0,1\}^{64}$ | `IDEA-CBC`, `IDEA-CTR` | recomendado |
| **3DES** | $\{0,1\}^{112\ \text{o}\ 168} \times \{0,1\}^{64} \to \{0,1\}^{64}$ | `3DES-CBC`, `3DES-CTR` | recomendado |
| **[[aes\|AES]]** | $\{0,1\}^{128,\,192\ \text{o}\ 256} \times \{0,1\}^{128} \to \{0,1\}^{128}$ | `AES-CBC`, `AES-CTR` | **Recomendado para proyectos nuevos** |

> **Lo que hay que leer en esta tabla, más allá de los nombres:** cada entrada es **primitiva + modo**, nunca la primitiva sola. La filmina nunca escribe "usar AES": escribe `AES-CBC` y `AES-CTR`. Sin [[modos-de-encadenamiento|modo]] no hay criptosistema.
>
> Y notar el bloque de **64 bits** que arrastran IDEA y 3DES contra los **128** de AES. No es un detalle de eficiencia: con bloques de 64 bits aparecen colisiones tras $\approx 2^{32}$ bloques cifrados con la misma clave, que hoy es una cantidad de tráfico perfectamente alcanzable. Es la razón práctica de que AES sea el recomendado.

**La filmina se quedó atrás en una fila: 3DES.** Al recorrer la tabla, el docente lo saca de los proyectos nuevos —*"eventualmente se puede utilizar (…) más o menos. No, yo no usaría para un proyecto nuevo"*—, después de haber dicho, al cerrar DES, que *"ahora se considera que está roto y no se usa más"* (cues pt2 382, 504). El recomendado que nombra sin ambigüedad es uno solo: *"**AES, que es el oficial del NIST, en modo `CBC` y en modo `CTR`**"* (cue pt2 507). Y de paso deja dicho qué significan esas siglas —*"es el modo de encadenamiento"*, `CBC` de *Cipher Block Chaining* y `CTR` de *Counter*—, que es la lectura de la tabla que está arriba. Ver [[estado-de-un-criptosistema|Estado de un criptosistema]].

## Tamaños

| Espacio | Recomendación de la filmina |
|---|---|
| **Claves** | $>64$ bits. AES tiene **128, 192 o 256** |
| **Mensajes** (bloque) | $\ge 128$ bits |

Y la escala para dimensionar qué significa un exponente:

| Referencia | Orden |
|---|---|
| Partículas en el universo | $\approx 2^{88}$ átomos |
| Edad estimada del universo | $\approx 2^{58}$ segundos |

> **Errata de la filmina:** el $2^{88}$ de la primera fila no es la cantidad de átomos del universo. El universo observable tiene $\approx 10^{80}$ átomos, o sea $\approx 2^{266}$: la filmina está corrida en **178 órdenes binarios**. $2^{88} \approx 3\cdot 10^{26}$ es, más bien, el orden de los átomos de **unos tres kilos de agua**. La segunda fila sí está bien: los $4{,}35\cdot 10^{17}$ segundos de edad del universo son $\approx 2^{58{,}6}$.
>
> **El argumento de la clase se sostiene igual, y se sostiene por la fila que está bien.** Lo que vuelve inalcanzable a $2^{128}$ es el **tiempo**, no el conteo de átomos — ver el recuadro de abajo. Y el número corregido tiene su propia lectura, que además es la que conviene recordar: $2^{266}$ átomos es del orden de $2^{256}$, **la clave más grande que ofrece AES**. Con el valor real, la comparación con los átomos deja de hablar de 128 bits y pasa a hablar de 256. *(Los dos órdenes de magnitud son cuenta nuestra; la filmina sólo da el $2^{88}$.)*

> **Para qué está esta comparación.** Es la respuesta física a *"¿qué es un adversario limitado?"* de la [[seguridad-computacional|seguridad computacional]]. Un ataque de $2^{64}$ es caro pero se paga —lo pagó [[des-y-3des|DES]] con $2^{56}$—; uno de $2^{128}$ es $2^{64}$ **veces** eso. Puesto contra la segunda fila de la tabla: una máquina que probara una clave por segundo desde el Big Bang llevaría $2^{58}$ intentos hechos, y le faltarían $2^{70}$ edades del universo para terminar. **Un margen de 128 bits no es "muy difícil": es de otro orden**, y de ahí que el corte esté donde está.

### Por qué las GPU no mueven la aguja acá

Es la pieza que le falta al argumento de escala, y la clase la da explícitamente. **Cifrar un bloque es intrínsecamente serial**: cada ronda depende de la anterior, así que una GPU —que rinde cuando el mismo cálculo se abre en miles de hilos— no acelera *una* prueba de clave. Lo que sí escala es **repartir el espacio de clave entre máquinas**, y eso es una aceleración **lineal** que se paga en dólares, no en generaciones de hardware. Por eso la respuesta a *"¿cuán roto está DES?"* es una cifra de dinero y no un modelo de placa — ver [[des-y-3des#Evolución: cómo se erosionó|DES y 3-DES]] — y por eso el margen de 128 bits de la filmina sigue estando en otro orden.

> [!quote]- De la transcripción — el nivel de seguridad contra el poder de cómputo (cues pt2 511-514)
> *"Fíjense que las GPU tienen impacto, **pero no tanto en esto**. ¿Por qué? Porque **estos algoritmos no son muy paralelizables**. Es difícil explotar la cuestión: la GPU funciona bien cuando algo se puede paralelizar; si no hay una cuestión de paralelización, no son tan útiles para probar estas cosas. Entonces ahí empieza el hecho de hacer multiprogramación, o sea **paralelizar a nivel de cómputo, que es lo que hace el paper que presentamos: arranca un montón de workers y divide el espacio de clave entre todos los workers**."*

## Cómo decidir, en la práctica

*(síntesis nuestra de la filmina y del resto de la clase.)*

1. **No escribir la primitiva.** Usar una de la tabla de recomendados.
2. **Elegir el modo, no sólo la primitiva.** `AES-CBC` con IV aleatorio o `AES-CTR` con nonce único. Nunca [[modos-de-encadenamiento|ECB]].
3. **Fijar contra qué prueba hay que estar seguro** antes de elegir — CPA es el mínimo moderno → [[pruebas-de-indistinguibilidad|pruebas de indistinguibilidad]].
4. **Verificar el manejo de IV/nonce**, que es donde se rompen los sistemas que en el papel estaban bien.
5. **Revisar la elección con el tiempo:** hoy recomendado no es para siempre → [[estado-de-un-criptosistema|estado de un criptosistema]].

> **Relevancia para el [[tp-implementacion|TP]].** El trabajo práctico pide implementar una función de seguridad **no vista en el curso**, a partir de un paper. Esta filmina es la que marca el límite: implementar algo para **aprender y demostrar** es el objetivo del TP; lo que la cátedra califica de mala práctica es **inventar un criptosistema nuevo para un proyecto en producción**. Son dos cosas distintas y conviene tenerlo claro al justificar el TP.

## Ver también

- [[estado-de-un-criptosistema|Estado de un criptosistema]] — el vocabulario para clasificar candidatos
- [[aes|AES]] · [[des-y-3des|DES y 3-DES]] · [[criptosistema-de-flujo|Criptosistema de flujo]]
- [[modos-de-encadenamiento|Modos de encadenamiento]]
- [[seguridad-computacional|Seguridad computacional]] — qué significan los exponentes
- [[tp-implementacion|TP de Implementación]]
- [[clase-02-cifrado|Clase 02 — Cifrado simétrico]]
