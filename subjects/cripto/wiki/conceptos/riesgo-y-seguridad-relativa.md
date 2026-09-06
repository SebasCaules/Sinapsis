---
title: Riesgo y seguridad relativa
resumen: 'El criterio no criptográfico que decide si una primitiva alcanza, según de qué y de quién se protege uno. Distingue que una función esté formalmente quebrada de que sea inadecuada para un escenario dado.'
fuentes: ["[[clase-03-macs-y-cifrado-autenticado]]"]
aliases: [Riesgo y seguridad relativa, Riesgo, Seguridad relativa, Escenario de seguridad, De qué me protejo y de quién me protejo, Mínimo común denominador]
type: concepto
unidad: 1
clase: 3
orden: 16
created: 2026-09-04
updated: 2026-09-04
tags: [criptografia, seguridad, riesgo, hash, md5, primitivas, clase-03]
sources: ["raw/clases/Clase 03pt2 - Transcripcion.VTT"]
---

# Riesgo y seguridad relativa

**Por qué "¿es seguro?" sigue siendo una pregunta mal formada, incluso después de haber elegido bien la prueba.** [[estado-de-un-criptosistema|Estado de un criptosistema]] ya había convertido esa pregunta en *"¿seguro contra qué prueba?"*. Esta nota agrega el segundo eje, que la cátedra introduce recién en la segunda sesión de la Clase 3 y a propósito de `MD5`: **¿y seguro contra quién, y con qué consecuencias si falla?** De ahí sale el veredicto que ninguna filmina da: `MD5` no está "inseguro" a secas, está **inadecuado para ciertos escenarios**.

> Todo el material de esta nota es **hablado**: sale de la sesión del **03/09/2026** y no tiene respaldo en ninguna de las 41 filminas de teoría, que sólo traen el rótulo binario *Quebrada* de la filmina 35.

---

## Los dos factores del escenario de seguridad

El docente lo enuncia como una regla de dos entradas, y la enuncia justo después de dar la cota $2^{64}$ para colisiones en `MD5`:

> **El escenario de seguridad tiene dos factores: de qué me estoy protegiendo y de quién me estoy protegiendo.**

Las dos preguntas son independientes y ninguna de las dos es criptográfica:

| Factor | Qué pregunta | Qué determina |
|---|---|---|
| **De qué** | Qué le pasa al sistema —y a las personas— si el control falla | El **impacto**: cuánto vale evitarlo |
| **De quién** | Quién querría hacerlo fallar, con qué recursos y con qué motivación | La **capacidad del adversario**: cuánto está dispuesto a gastar |

El punto es que la primitiva no cambia de estado según quién la use. Lo que cambia es si su estado **alcanza** para lo que se le está pidiendo.

## Los tres escenarios escalonados

La clase no define el marco en abstracto: lo construye con tres ejemplos que suben de impacto manteniendo fija la primitiva, `MD5`.

| Escenario | Veredicto sobre `MD5` |
|---|---|
| La lista de figuritas que faltan para completar el álbum del mundial | Alcanza. Pedir más sería exagerar |
| Los estados financieros de una empresa, ya presentados ante el fisco | Empieza a ser **cuestionable** |
| Información militar cuya modificación maliciosa podría hacer morir gente | **Se queda corto** |

La misma función, tres respuestas distintas. Y el criterio que las separa no está en el $2^{64}$ ni en el $2^{20}$: está en qué pasa el día que alguien encuentre la colisión.

> [!quote]- De la transcripción — los dos factores y los tres escenarios (cues pt2 527-536)
> *"Algo que siempre hay que tener en cuenta es [que] el escenario de seguridad tiene 2 factores, si quieren. Uno es **de qué me estoy protegiendo** y [el] otro es **de quién me estoy protegiendo**. Si yo quiero verificar que nadie me modifique la lista de las figuritas que me faltan para completar el álbum del mundial (…) diría: estamos exagerando ya. Por eso el [MD5]. Si yo quiero garantizarme que nadie modifique los estados financieros de una empresa que se presentaron ya ante el fisco, bueno, [MD5] empieza [a ser] cuestionable. Si yo estoy trabajando en un ejército y quiero garantizar que no se modifique información con la cual podría morir gente si la modifica maliciosamente, [MD5] se queda corto. Entonces la seguridad siempre es… volvemos a esto: **no hay una única definición de seguridad**. El escenario de seguridad tiene que tener en cuenta el **potencial problema** y el **potencial impacto** que tiene. Después vamos a dar[lo]. **Eso se llama riesgo** y es parte del análisis que se hace todo el tiempo en seguridad."*
>
> El cue pt2 531 tiene un tramo que el ASR deja irrecuperable —posiblemente el nombre de una primitiva más fuerte propuesta por un alumno— y por eso va elidido; el resto de la frase se entiende sin él.

## El nombre del concepto: riesgo

El docente le pone nombre en el mismo momento en que lo introduce, y lo hace señalando que la formalización **no es de esta unidad**: la ponderación entre *potencial problema* y *potencial impacto* se llama **riesgo**, y se desarrolla más adelante, en la parte de seguridad de sistemas.

Eso es lo que vuelve a este concepto algo más que una anécdota de la clase de hash: es un adelanto declarado de un marco que la materia va a usar sistemáticamente. Hasta que llegue, lo que queda es la forma cualitativa de arriba, que ya alcanza para decidir.

> **Qué falta todavía.** *(lectura nuestra.)* Un análisis de riesgo completo cruza **probabilidad** de ocurrencia con **impacto** y decide qué se mitiga, qué se transfiere y qué se acepta. La clase da sólo el eje de impacto y el de capacidad del adversario, y no da ninguna escala. Conviene no anticiparse a la unidad correspondiente: lo que sí queda fijado acá es que **el criterio de suficiencia de una primitiva vive fuera de la criptografía**.

## Quebrada no es lo mismo que inadecuada

La tensión que el marco resuelve es real y aparece en el mismo párrafo de la clase: `MD5` **está formalmente quebrada** —hay ataques publicados que hallan colisiones con menos de $2^{20}$ operaciones, muy por debajo de la cota genérica $2^{64}$ que da la [[seguridad-de-las-funciones-de-hash#Por qué la raíz cuadrada: la paradoja del cumpleaños|paradoja del cumpleaños]]— y **sigue usándose en muchos lados**. Las dos cosas son ciertas a la vez, y no hay contradicción:

- **El estado de la primitiva es un hecho técnico**, absoluto y sin contexto. Es lo que clasifica [[estado-de-un-criptosistema#Los tres estados|Estado de un criptosistema]]: `MD5` está **quebrada**, punto.
- **La adecuación es una relación** entre ese hecho y un escenario. Depende del impacto y del adversario, y por eso admite tres respuestas distintas para la misma función.

> [!quote]- De la transcripción — el veredicto en dos tiempos sobre MD5 (cues pt2 525-526, 538)
> *"Por eso [MD5], a ver… no sé si decir que no es seguro, pues se sigue usando en muchos lados. **La seguridad siempre es relativa** también, ¿no?"*
>
> *"Desde un punto de vista formal (…) decimos que [MD5] está **quebrado**. Sí, porque, además, con los ataques publicados que hay, no se necesitan 2 a las 64: se necesitan **menos de 2 a la 20** operaciones para encontrar una co[lisión]."*

> **Y la relatividad no autoriza a usar `MD5` en algo nuevo.** *(precisión nuestra, y es donde el marco se puede leer mal.)* La regla operativa de [[eleccion-de-primitivas#La regla|Elección de primitivas]] no se ablanda: **ni debilitada ni quebrada entran a un proyecto nuevo**, cualquiera sea el impacto. Que `MD5` "alcance" para la lista de figuritas no es un permiso para elegirla: es la explicación de por qué lo que ya está desplegado con `MD5` no siempre hay que apagarlo mañana. El marco de riesgo sirve para **priorizar migraciones**, no para justificar diseños.

## El mínimo común denominador

El segundo aporte de este bloque cambia la escala del problema: deja de mirar la primitiva y mira el sistema entero.

**La seguridad de un sistema es la de su componente más débil.** Y el docente agrega el dato de campo que da vuelta la conclusión intuitiva: hoy la parte criptográfica de un sistema real está *"en la estratosfera"* respecto de todo lo demás —la infraestructura, el código, los procesos, la gente—. De ahí sale el remate:

> **Que un sistema caiga por mal uso de criptografía "bordea la negligencia" hoy en día.**

No porque la criptografía sea infalible, sino porque es la única parte del sistema donde el conocimiento necesario está estandarizado, documentado, demostrado y empaquetado en librerías gratuitas. Perder por ahí es perder en el terreno donde ganar era más barato.

> [!quote]- De la transcripción — el mínimo común denominador y la criptografía en la estratosfera (cues pt2 573-578)
> *"Me estoy adelantando al resto de la materia, pero básicamente **la seguridad de un sistema es el mínimo común denominador de la seguridad de todos los componentes**. Y hoy día toda la parte criptográfica de un sistema está como [en] la estratosfera versus el resto (…) de otros patrones y de otras interacciones que hay en los sistemas. Entonces, teniendo resuelto técnicamente que la seguridad por el lado de criptografía esté a niveles buenos, **el que un sistema caiga por mal uso de criptografía bordea la negligencia hoy día**."*

**Los dos enunciados se complementan y hay que leerlos juntos.** El de riesgo dice que sobredimensionar es un gasto sin retorno; el del mínimo común denominador dice dónde está el techo real de lo que se gana. Combinados: **subir la primitiva por encima de lo que el escenario pide no mejora el sistema, porque el eslabón débil está en otro lado — y aun así, quedarse por debajo de lo que el escenario pide es indefendible, porque llegar era gratis.**

## La regla de campo que sale de acá

El docente la da como consejo directo, y es la aplicación práctica del marco completo:

**Si aparece un sistema usando `MD5` —o cualquier función que no sea de la familia SHA—, hay que averiguar el estado de esa primitiva**, porque es probable que haya un problema latente. No "apagarlo": averiguar. Es exactamente el orden que el marco impone —primero el hecho técnico, después el escenario— y la razón de que la tabla de [[primitivas-de-hash-estandar#Qué usar, en la práctica|primitivas de hash estándar]] sea el punto de partida de la decisión y no la decisión misma.

> [!quote]- De la transcripción — averiguar el estado antes de decidir (cues pt2 569-572)
> *"Y la única consideración es: si se encuentran con un criptosistema que está usando [MD5] o alguna función que no sea de estas, **averigüen el estado**, porque es probable que ahí sí haya un problema latente de seguridad; de los complicados de explotar, pero (…) en criptografía, justo en las zonas donde la seguridad en los sistemas actuales es lo más fuerte que hay."*

## Por qué esto es una nota y no una sección

> **El argumento a favor.** El docente le pone **nombre propio** al concepto y anuncia que se **formaliza más adelante en la materia**: por definición sobrevive a la clase de hash. Y hace falta desde varios lugares a la vez — [[primitivas-de-hash-estandar|03.09]] y [[seguridad-de-las-funciones-de-hash|03.11]] tabulan estados y exponentes sin dar el criterio para usarlos; [[estado-de-un-criptosistema|02.11]] clasifica sin decir qué escenario justifica cada clase; [[eleccion-de-primitivas|02.12]] decide sin nombrar el impacto. Sin esta nota, ese criterio queda repetido en pedazos o directamente ausente.
>
> **El argumento en contra, para dejarlo registrado.** Son unos veinte cues de digresión, sin ninguna filmina detrás, y la mitad de lo que dicen ya está —en otras palabras— en [[estado-de-un-criptosistema#Un criptosistema puede ser seguro y estar quebrado al mismo tiempo|Estado de un criptosistema]] y en la sección *Cómo decidir* de [[eleccion-de-primitivas#Cómo decidir, en la práctica|02.12]]. Un vault más conservador lo habría puesto como sección de `02.11`. Lo que inclina la balanza es el anuncio explícito de la unidad de seguridad: cuando llegue, esta nota es el punto de enganche, y moverla después rompe links.

## Ver también

- [[agilidad-criptografica|Agilidad criptográfica]] — el otro criterio no-matemático de esta sesión: el riesgo dice *cuánto* hace falta hoy, la agilidad dice qué pasa cuando eso deje de alcanzar
- [[estado-de-un-criptosistema|Estado de un criptosistema]] — el hecho técnico sobre el que esta nota construye la relación; ahí está el *"¿contra qué prueba?"*, acá el *"¿y contra quién?"*
- [[eleccion-de-primitivas|Elección de primitivas en un proyecto]] — la regla operativa que este marco **no** ablanda
- [[primitivas-de-hash-estandar|Primitivas de hash estándar]] — la tabla de estados que sin este criterio no se sabe cómo usar
- [[seguridad-de-las-funciones-de-hash|Seguridad de las funciones de hash]] — de dónde salen el $2^{64}$ y el $2^{20}$ de `MD5`
- [[clase-03-macs-y-cifrado-autenticado|Clase 03 — MACs y cifrado autenticado]] — la sesión del 03/09, donde esto se dicta
- [[practica-04-macs-hash-y-cifrado-autenticado|Práctica 04 — MACs, hash y cifrado autenticado]] — la práctica del 31/08, que llegó a estos temas tres días antes que la teoría
