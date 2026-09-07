---
title: Agilidad criptográfica
resumen: 'Toda primitiva termina obsoleta, así que un sistema pensado para durar debe prever el camino de actualización; es la razón práctica por la que gana Encrypt-then-MAC, que deja cambiar el MAC sin rehacer la prueba.'
fuentes: ["[[clase-03-macs-y-cifrado-autenticado]]", "[[privacidad-e-integridad]]"]
aliases: [Agilidad criptográfica, Crypto-agility, Obsolescencia de las primitivas, Camino de actualización, Horizonte de décadas]
type: concepto
unidad: 1
clase: 3
orden: 17
created: 2026-09-04
updated: 2026-09-04
tags: [criptografia, seguridad, agilidad-criptografica, primitivas, encrypt-then-mac, cifrado-autenticado, clase-03]
sources: ["raw/clases/Clase 03pt2 - Transcripcion.VTT"]
---

# Agilidad criptográfica

**Toda primitiva se vuelve obsoleta, y un sistema que no previó cómo reemplazarla ya tiene su fecha de vencimiento puesta.** El docente lo presenta como *"un concepto muy importante que hasta ahora venimos ignorando completamente"*, y lo dice en el punto exacto en que la clase deja la matemática y empieza a mirar sistemas que van a estar corriendo durante años. De ahí sale el corolario que ninguna filmina da y que esta nota existe para registrar: **la razón práctica por la que gana `Encrypt-then-MAC` no es la demostración, es que se puede cambiar la pieza sin volver a demostrar nada.**

> Todo el material de esta nota es **hablado**, de la sesión del **03/09/2026**. Ni la filmina 36 —las tres formas de combinar— ni la 37 —cifrado autenticado— mencionan la obsolescencia ni el reemplazo.

---

## El concepto

La cadena de razonamiento es corta y no tiene ninguna parte técnica:

1. Las primitivas criptográficas, **no importa lo buenas que sean**, eventualmente se vuelven obsoletas.
2. Por lo tanto, cualquier sistema pensado para durar tiene que tener previsto **qué va a pasar** cuando la criptografía que usa se vuelva obsoleta.
3. La pregunta concreta que hay que poder contestar en el momento del diseño es: **¿cuál es el camino para actualizarlo?**

El paso 1 no es una conjetura pesimista: es la única lectura honesta de la historia que la propia clase acaba de contar. `MD5` fue el estándar de facto y hoy [[riesgo-y-seguridad-relativa#Quebrada no es lo mismo que inadecuada|se rompe con menos de 2²⁰ operaciones]]; `SHA-1` pasó de reemplazo a *"en el borde"*; `DES` fue norma federal durante dos décadas. Ninguna de las tres se diseñó para fallar.

> [!quote]- De la transcripción — la obsolescencia y el camino de actualización (cues pt2 710-718)
> *"Cuando uno piensa ya en protocolos y empieza a salir de la abstracción matemática, y empieza a pensar en sistemas que van a estar funcionando, **hay un concepto muy importante que hasta ahora venimos ignorando completamente**, que es: **las primitivas criptográficas, no importa lo buenas que sean, eventualmente se vuelven obsoletas**. Entonces, cualquier protocolo, cualquier sistema que esté pensado para durar mucho tiempo tiene que tener previsto qué va a pasar cuando la criptografía que usa se vuelva obsoleta, **cuál es el camino para actualizarlo**. Entonces la tercera forma simplifica ese camino, en el sentido de: bueno, si se volvió obsoleta, **el MAC lo puedo reemplazar por otro y no necesito volver a probar la seguridad en todo el sistema**, como pasa [en] el segundo. Entonces por eso se favorece hoy día al tercero."*

## Por qué esto decide entre las tres formas

Éste es el aporte que el vault no tenía. [[privacidad-e-integridad|Privacidad e integridad]] llega a que `Encrypt-then-MAC` gana **por la demostración**: es la única de las tres combinaciones que es segura para cualquier par de componentes seguros. El argumento de la agilidad llega a la misma conclusión por otro camino, y es el camino que un ingeniero puede usar sin abrir Katz.

**La diferencia está en qué hay que volver a demostrar el día que una pieza se cae.**

| Forma | Qué garantía se tiene | Qué pasa al reemplazar el MAC |
|---|---|---|
| [[privacidad-e-integridad#Cifrar y luego autenticar\|Cifrar y luego autenticar]] — `Encrypt-then-MAC` | Un **teorema genérico**: vale para *cualquier* $\Pi_e$ CPA-seguro y *cualquier* $\Pi_m$ infalsificable | Nada. El teorema se vuelve a aplicar con el componente nuevo. Sólo hay que verificar que el reemplazo cumpla su propia hipótesis |
| [[privacidad-e-integridad#Autenticar y luego cifrar\|Autenticar y luego cifrar]] — `MAC-then-Encrypt` | Sólo **instanciaciones concretas** vienen con prueba propia | La prueba era de esa combinación concreta. Cambiar una pieza obliga a **rehacer el análisis de seguridad del sistema entero** |

La asimetría es exactamente la que separa un teorema cuantificado sobre todos los componentes de una prueba escrita para un caso. **`Encrypt-then-MAC` deja el sistema modular; la segunda forma lo deja acoplado.** Y como el reemplazo no es una posibilidad remota sino algo que va a pasar, ese acoplamiento es una deuda con fecha.

> **El mismo argumento vale hacia el otro lado, y conviene decirlo** *(lectura nuestra)*. La modularidad no es sólo del MAC: en `Encrypt-then-MAC` también se puede cambiar el criptosistema sin tocar el MAC, porque la hipótesis sobre $\Pi_e$ es únicamente [[pruebas-de-indistinguibilidad|CPA-seguridad]]. Lo que **no** se puede relajar es la condición de [[privacidad-e-integridad#Dos claves independientes|claves independientes]]: un reemplazo que reutilice material de clave entre las dos piezas rompe la hipótesis del teorema, y ahí la agilidad se pierde igual.

Y por eso el docente cierra el punto diciendo que la tercera forma **es la que usan los protocolos modernos**, y que si `SSH` se diseñara hoy desde cero se construiría así. Ese comentario sobre `SSH` trae una discrepancia sobre a cuál de las tres formas pertenece el protocolo, que se registra en [[privacidad-e-integridad|Privacidad e integridad]]; para el argumento de la agilidad da lo mismo cuál sea la respuesta.

## El horizonte de décadas

El segundo lugar donde el concepto aparece —antes, y sin nombre todavía— es en la recomendación de tamaños de hash. La cátedra recomienda `SHA-3` de **256 bits para todo**, y reserva la variante de **512 bits para sistemas de almacenamiento** pensados en horizontes de décadas: información que se quiere retener **veinte o treinta años**.

Lo notable no es la recomendación sino la salvedad que el docente le pega inmediatamente:

> **En un horizonte de décadas no se puede asegurar nada.**

Puede aparecer un ataque que rompa `SHA-3`, y para entonces quizá ya exista un `SHA-8` superpuesto. Están las computadoras cuánticas, que **hoy no tienen ningún ataque material contra esto**, pero de las que no se puede afirmar que nunca lo tengan. Esa honestidad es justamente el motivo por el que la agilidad es un requisito de diseño y no una precaución opcional: **si el horizonte es de décadas, el sistema va a sobrevivir a su propia criptografía, y lo único que se puede diseñar de antemano es el reemplazo.**

> [!quote]- De la transcripción — los tamaños, las décadas y lo que no se puede asegurar (cues pt2 559-566)
> *"El tamaño más chico es seguro hoy día; el tamaño más grande se reserva… como esto es integridad y tiene que ver con el almacenamiento y garantías de una modificación, acá aparecen algunos escenarios donde hay información que se quiere retener por 20, 30 años. Y el consejo práctico es: usá la variante más chica, la de 256 bits, para todo; se recomienda la de 512 para sistema[s] de almacenamiento, pensando en horizontes de décadas. **La gran realidad es que en un horizonte de décadas no se puede asegurar nada.** O sea, puede aparecer un ataque que rompa [SHA-3] y que a esa altura ya tengamos [SHA-8] que esté superpuesto. Ahí están las computadoras cuánticas, que si bien hoy día no tienen ningún ataque material a esto, no quiere decir que cuando se vuelvan más masivas no generen estudios nuevos que hoy día no se pueden hacer y lleguen a algo."*

> **Sobre lo cuántico, con más precisión que la que la clase necesitaba dar** *(precisión nuestra; el docente no entra en detalle y no le hace falta para su argumento).* Contra funciones de hash el efecto conocido es acotado: la búsqueda de Grover reduce la búsqueda de preimágenes de $2^{\ell}$ a $\approx 2^{\ell/2}$ operaciones —una raíz cuadrada, la misma pérdida que la [[seguridad-de-las-funciones-de-hash|paradoja del cumpleaños]] ya impone a las colisiones—, y contra colisiones las mejoras cuánticas conocidas son marginales una vez que se contabiliza la memoria. En términos prácticos, **duplicar la salida compensa a Grover**, que es otra manera de leer la recomendación de 512 bits para almacenamiento largo. La amenaza cuántica seria es contra la criptografía **asimétrica**, que la materia todavía no vio. Nada de esto contradice al docente: refuerza su punto de que el margen se compra con tamaño y con capacidad de reemplazo, no con confianza.

## Qué significa "tener previsto el camino"

La clase no baja el concepto a mecanismos concretos; queda anunciado para la unidad de protocolos. Lo que sigue es lectura propia, y va separado por eso.

> **Las tres formas en que un sistema queda ágil o no** *(lectura nuestra, no dicho en clase).*
>
> 1. **La primitiva se nombra, no se supone.** El criptograma o el mensaje del protocolo lleva un identificador de qué algoritmo se usó. Sin eso no hay migración posible: no se puede leer lo viejo mientras se escribe lo nuevo.
> 2. **Hay un período en que conviven dos versiones.** Ningún reemplazo real es atómico. El diseño tiene que admitir verificar con el algoritmo viejo y firmar con el nuevo durante la transición, y tiene que definir cuándo se corta el soporte del viejo.
> 3. **La negociación no la elige el atacante.** El mecanismo que permite convivir es también el que permite un ataque de degradación, forzando a las partes a la opción más débil que ambas soportan. La contramedida es tener un piso mínimo aceptable y autenticar la negociación.
>
> El punto 3 es la razón de que la agilidad **no sea gratis**: cada camino de actualización es superficie de ataque nueva. Es un intercambio, no una mejora unilateral.

## Por qué esto es una nota y no una sección

> **El argumento a favor.** El docente lo señala él mismo como *"un concepto muy importante"* y como un hueco del curso hasta ese momento, y lo enmarca como algo que se retoma *"en un par de clases, cuando veamos protocolos"*. Es un **criterio de diseño**, no un detalle de la Clase 3: se necesita desde [[privacidad-e-integridad|03.12]] (por qué gana la tercera forma), desde [[cifrado-autenticado|03.13]] (por qué el esquema genérico se prefiere a uno acoplado), desde [[primitivas-de-hash-estandar|03.09]] (por qué hay que averiguar el estado de una primitiva) y desde [[estado-de-un-criptosistema|02.11]] y [[eleccion-de-primitivas|02.12]].
>
> **El argumento en contra, para dejarlo registrado.** Son **nueve cues**, sin ninguna filmina detrás, y hoy toda su carga útil se descarga en un solo lugar: la comparación de las tres formas de [[privacidad-e-integridad|03.12]]. Por el criterio que el vault usa para decidir —una idea merece nota propia cuando se la cita desde varios lados— la agilidad todavía está en el límite, y una sección *"Agilidad criptográfica: por qué gana la tercera"* dentro de `03.12` habría cumplido igual de bien **por ahora**. Lo que la salva es la promesa explícita de retomarlo en protocolos: la apuesta es que en dos clases esta nota crezca. Si no crece, corresponde plegarla a `03.12`.
