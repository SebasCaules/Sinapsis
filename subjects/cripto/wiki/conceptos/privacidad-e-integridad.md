---
title: Privacidad e integridad
resumen: 'Las tres formas de combinar un criptosistema y un MAC, cifrar y autenticar, autenticar y luego cifrar, y cifrar y luego autenticar, y por qué solo la última es siempre segura, con claves independientes.'
fuentes: ["[[clase-03-macs-y-cifrado-autenticado]]", "[[practica-04-macs-hash-y-cifrado-autenticado]]"]
aliases: [Privacidad e integridad, Encrypt-then-MAC, MAC-then-Encrypt, Encrypt-and-MAC, Cifrar y autenticar, Autenticar y luego cifrar, Cifrar y luego autenticar]
type: concepto
unidad: 1
clase: 3
orden: 12
created: 2026-08-28
updated: 2026-09-04
tags: [criptografia, integridad, mac, cifrado-autenticado, encrypt-then-mac, clase-03]
sources: ["Clase 03 - Criptografia - MACs y Cifrado Autenticado.pdf", "raw/clases/Clase 03pt2 - Transcripcion.VTT", "raw/practicas/Clase 4.pdf"]
---

# Privacidad e integridad

**Cómo se combinan un criptosistema y un MAC para tener las dos cosas a la vez, y por qué de las tres formas de hacerlo sólo una es siempre segura.** El orden en que se aplican no es una cuestión de gusto: decide si el esquema resultante resiste o no.

> **Fuentes.** La filmina de teoría de esta nota (slide 36) es de la **segunda sesión de la Clase 3, del 03/09**, que **sí tiene transcripción**: el bloque entero está dictado en los cues pt2 640-718, con resolución participativa. La [[practica-04-macs-hash-y-cifrado-autenticado|Práctica 04]] del 31/08 —tres días **antes** de la teoría— trae el mismo cuadro en su filmina 16, y ahí es donde la cátedra pone por escrito las dos condiciones que la teoría deja implícitas. El resto sale de Katz & Lindell y de lecturas propias rotuladas como tales.
>
> Ojo con los rangos de cues: la Clase 03 tiene **dos grabaciones** y cada una numera desde 1, así que acá todo cue va con prefijo de parte: `pt1` para el 27/08 y `pt2` para el 03/09.

---

## El problema

Tenemos dos primitivas que resuelven dos servicios de seguridad distintos:

- un criptosistema $\Pi_e$ [[pruebas-de-indistinguibilidad|CPA-Secure]], que da **confidencialidad**;
- un [[message-authentication-code|MAC]] $\Pi_m$ [[seguridad-de-un-mac|infalsificable]], que da **integridad**.

Y queremos las dos cosas a la vez. La tentación es pensar que alcanza con aplicar las dos, en cualquier orden. **No alcanza.** La primera línea del cuerpo de la filmina es exactamente eso: *"Tres formas (solo dos seguras):"* — el título de arriba es, simplemente, *"Privacidad e integridad"*.

La razón de fondo es que las definiciones de seguridad de cada primitiva **no dicen nada sobre lo que le pasa a la otra**. Que un MAC sea infalsificable significa que no se pueden producir etiquetas nuevas; no significa que la etiqueta esconda el mensaje. Que un cifrado sea CPA-Secure significa que el criptograma no filtra el mensaje; no significa que el criptograma no se pueda modificar — eso es justamente la [[maleabilidad]]. Componer primitivas es una operación que hay que **demostrar**, no suponer.

En clase el planteo llega por el camino inverso, y conviene registrarlo porque es el hilo que une las dos sesiones: el docente vuelve al ataque a la base de datos de sueldos con el que abrió la Clase 03 el 27/08, hace notar que los MAC y las funciones de hash resuelven **ese** problema y ninguno de los anteriores, y de ahí sale la pregunta de cómo combinar.

> [!quote]- De la transcripción — el reanclaje en el problema de la base de sueldos y el planteo de la combinación (cues pt2 654-662)
> lo que vimos hasta acá[,] [MAC]s y funciones de [hash], atacan el otro problema. Pero no hay nada en la definición de las funciones de hash o de los [MAC]s que proteja la confidencialidad de la información. Si si nosotros construimos una solución sólo con [hash] y con [MAC]s genial, detectamos la modificación […] pero todo el mundo vería la información o tendría acceso a la información o parte de la información? Incluso no hay nada porque el modelo de seguridad de de contra falsificaciones no lo toma en cuenta. No hay nada que no diga que a partir de la etiqueta, yo tal vez no puedo recuperar el mensaje original, pero tal vez puedo extraer parte del mensaje original o parte de la información que es lo que queremos proteger realmente cuando hablamos de confidencialidad.
>
> Entonces, ¿qué pasa cuando necesitamos las 2 cosas? Bueno, tenemos funciones que sabemos que nos dan confidencialidad o privacidad y funciones que nos dan integridad. Sí, ¿cómo las podemos combinar de alguna manera?

## Las tres combinaciones

| Nombre | Qué se calcula | Qué se transmite | Veredicto de teoría 36 | Veredicto de práctica 16 |
|---|---|---|---|---|
| Cifrar y autenticar (`Encrypt-and-MAC`) | $c \leftarrow \mathsf{Enc}_{k_1}(m)$, $t \leftarrow \mathsf{Mac}_{k_2}(m)$ | $\langle c, t\rangle$ | **Inseguro** — *"$t$ puede brindar información de $m$"* | rojo: *"INSEGURO. La etiqueta $t$ puede brindar información de $m$"* |
| Autenticar y luego cifrar (`MAC-then-Encrypt`) | $c \leftarrow \mathsf{Enc}_{k_1}\bigl(m \,\Vert\, \mathsf{Mac}_{k_2}(m)\bigr)$ | $c$ | *"Puede ser seguro, requiere prueba de seguridad"* | amarillo: lo mismo, **más** *"(x padding)"* |
| Cifrar y luego autenticar (`Encrypt-then-MAC`) | $c \leftarrow \mathsf{Enc}_{k_1}(m)$, $t \leftarrow \mathsf{Mac}_{k_2}(c)$ | $\langle c, t\rangle$ | **Siempre es seguro** | verde: *"SEGURO. siempre que los algoritmos de encripción y mac lo sean y **claves independientes**"* |

**Cómo marca cada lámina cuál es la insegura, y por qué hay que mirarlo.** En el PDF de teoría, la primera opción está **tachada con una X grande a mano alzada** sobre sus dos líneas; sin eso, el título *"solo dos seguras"* no identifica cuál cae. En la Práctica 4 el mismo veredicto viene codificado como un **semáforo vertical** de tres círculos —rojo, amarillo, verde— alineados a la derecha. Son dos codificaciones visuales distintas del mismo contenido, y las dos se pierden enteras al extraer el texto del PDF.

Fijarse también en la tercera columna: **la única que no transmite la etiqueta por separado es `MAC-then-Encrypt`**, porque ahí la etiqueta viaja adentro del criptograma. Eso explica a la vez su ventaja (la etiqueta no se ve) y su defecto operativo, que aparece más abajo.

### La práctica corrige a la teoría en dos puntos

La filmina 16 de la [[practica-04-macs-hash-y-cifrado-autenticado|Práctica 04]] no es una copia de la 36 de teoría: **agrega texto en las dos filas que importan**, y ese texto es el que sostiene los enunciados.

1. **Donde teoría dice *"Siempre es seguro"* a secas, la práctica escribe *"siempre que los algoritmos de encripción y mac lo sean y claves independientes"*.** No es una salvedad decorativa: la independencia de claves es exactamente la hipótesis del teorema, y el [[#Dos claves independientes|ejercicio de la filmina 18]] de la misma práctica está construido para probar por contraejemplo que sin ella el esquema se cae — con la forma **correcta** de combinar y con los dos componentes seguros por separado.
2. **Donde teoría no explica por qué la segunda forma necesita prueba, la práctica anota *"(x padding)"*.** Es la cátedra señalando el mecanismo concreto: el problema de `MAC-then-Encrypt` es el **padding**, o sea el oráculo de padding que esta nota desarrolla en [[#Verificar antes de descifrar|Verificar antes de descifrar]] y que hasta ahora estaba rotulado como lectura propia. Con esa anotación deja de serlo.

Hay además un matiz de prudencia: teoría titula *"tres formas (solo dos seguras)"*, lo que cuenta a `MAC-then-Encrypt` entre las seguras; la práctica se cuida y sólo dice *"puede ser seguro, requiere prueba de seguridad"*.

### El estatus de cada forma, dicho en clase

Ésta es la precisión más importante que aporta la transcripción, y la nota no la tenía escrita como estatus sino disuelta en los argumentos. El docente distingue **tres situaciones distintas**, no dos:

| Forma | Estatus exacto |
|---|---|
| `Encrypt-and-MAC` | **No alcanza.** No hay nada que impida que la etiqueta filtre información del mensaje |
| `MAC-then-Encrypt` | **Hay demostraciones para ciertas combinaciones** de MAC y criptosistema. **No hay una prueba general** |
| `Encrypt-then-MAC` | **Hay una demostración general**, que aplica **para cualquier criptosistema y para cualquier MAC** |

La frase que ordena la tabla es del docente y vale como consigna de la materia entera: *"una cosa es que intuitivamente parezca. Otra cosa es demostrarlo"*. `MAC-then-Encrypt` **sí** resuelve intuitivamente el problema que hunde a la primera —mete la etiqueta adentro de lo cifrado—, y aun así eso no basta.

> [!quote]- De la transcripción — el estatus de las tres formas y la asimetría de las pruebas (cues pt2 668-693)
> son 3 formas que que tenemos para combinar esto[:] la primera es no combinarlas, y la otra es combinarlas primero, etiquetando o primero, cifrando […] de estas 3 formas, hay solo 2 que hay una que es insegura. ¿se les ocurre alguna alguna idea de cuál podría ser y por qué[?]
>
> [TOMÁS PIETRAVALLO:] [Cifrar] y autenticar porque estás dándole 2 piezas de información sobre el mensaje original.
>
> [Pablo Abad:] Muy bien ¿correcto? […] si nosotros lo hacemos por separado[,] nosotros estamos publicando, almacenando, transfiriendo el texto cifrado […] y la etiqueta. No hay nada que nos diga que un atacante a través de la etiqueta, no pueda recuperar información del mensaje. Y si recupera información, perdimos confidencialidad, perdimos privacidad […] La primera forma: cifrar y autenticar por separado no alcanza.
>
> la segunda forma, autentificar y luego cifrar. Es un poco más complicada […] puede ser segura. No existe ninguna prueba general de seguridad. No hay ninguna prueba que nos diga para todo cripto sistema[,] y para todo [MAC] esto va a ser seguro […] intuitivamente resuelve el problema que tiene el primero […] el segundo método de alguna manera, lo que hace es vuelve confidencial la etiqueta también[,] la mete adentro de lo que se cifra […] El [cachet] acá es que una cosa es que intuitivamente parezca. Otra cosa es demostrarlo. Entonces hay demostraciones para ciertas combinaciones de [MAC] y cripto sistemas. No hay una prueba general de seguridad, como sí hay para la tercera.
>
> cifrar y luego autenticar, o sea, generar la etiqueta del mensaje cifrado[,] tiene una demostración general que aplica para cualquier [cripto]sistema[,] para cualquier [MAC].

### Cifrar y autenticar

$$c \leftarrow \mathsf{Enc}_{k_1}(m), \qquad t \leftarrow \mathsf{Mac}_{k_2}(m), \qquad \text{se envía } \langle c, t\rangle$$

**Por qué falla.** La etiqueta se calcula **sobre el texto plano** y viaja **en claro**. La definición de MAC no pide en ningún lado que $t$ oculte $m$: pide que nadie pueda fabricar etiquetas válidas. Un MAC podría, sin dejar de ser infalsificable, publicar el primer bit del mensaje pegado a la etiqueta y seguir siendo perfectamente seguro *como MAC*. En clase la respuesta la da un alumno —Tomás Pietravallo— y el docente la reformula así: al hacerlo por separado se publican **dos piezas de información** sobre el mismo mensaje, y nada garantiza que la segunda no hable de él.

Hay una manera útil de recordarlo, que también es del docente: **la primera forma es, en realidad, no combinar nada.** Las otras dos componen las funciones; ésta las aplica en paralelo y manda las dos salidas.

Y no hace falta un contraejemplo artificial: **todos los MAC que se usan de verdad son determinísticos** — [[cbc-mac|CBC-MAC]] y [[hmac|HMAC]] lo son. Determinístico quiere decir que el mismo $m$ siempre produce el mismo $t$. Entonces, dos transmisiones con la misma etiqueta delatan que llevan **el mismo mensaje**, aunque los criptogramas sean distintos porque el cifrado sea probabilístico. Es exactamente la falla que la Clase 2 usa para descartar el cifrado determinístico: [[pruebas-de-indistinguibilidad#Propiedades de CPA|determinístico implica no CPA-Secure]].

**El adversario que lo rompe** *(lectura nuestra; ni la filmina ni la clase exhiben el ataque, las dos se quedan en el enunciado del problema).* Contra el esquema compuesto, en el juego `CPA`:

$$\begin{aligned}
&1.\ A \text{ consulta el oráculo de cifrado con } m_0 \text{ y recibe } \langle c_0, t_0\rangle \text{ con } t_0 = \mathsf{Mac}_{k_2}(m_0)\\
&2.\ A \text{ emite el par } (m_0, m_1) \text{ con } m_0 \neq m_1 \text{ y recibe el desafío } \langle c^{*}, t^{*}\rangle\\
&3.\ A \text{ responde } b' = 0 \text{ si } t^{*} = t_0,\ \text{ y } b' = 1 \text{ en caso contrario}
\end{aligned}$$

Como $\mathsf{Mac}$ es determinístico, si el desafío cifró $m_0$ entonces $t^{*} = t_0$ con certeza. La única forma de que el adversario falle es que las dos etiquetas coincidan, $\mathsf{Mac}_{k_2}(m_0) = \mathsf{Mac}_{k_2}(m_1)$ — y ese evento tiene probabilidad despreciable, porque si no la tuviera, copiar la etiqueta de $m_0$ y emitirla sobre $m_1$ **ya sería una falsificación** y $\Pi_m$ no sería infalsificable. O sea que el adversario acierta con probabilidad $1 - \mathsf{negl}(n)$, con una sola consulta. El esquema compuesto no es CPA-Secure, y por lo tanto tampoco puede ser [[ataque-de-texto-cifrado-escogido|CCA-Secure]].

> El punto conceptual: **la etiqueta rompe la confidencialidad, no la integridad.** La integridad de esta combinación está perfectamente bien; lo que se pierde es lo que ya se tenía. El docente lo cierra con la misma forma: *"si recupera información, perdimos confidencialidad, perdimos privacidad"* (cue pt2 678).

### Autenticar y luego cifrar

$$c \leftarrow \mathsf{Enc}_{k_1}\bigl(m \,\Vert\, \mathsf{Mac}_{k_2}(m)\bigr), \qquad \text{se envía } c$$

**Qué arregla.** La etiqueta viaja **cifrada**, así que la fuga del caso anterior desaparece: un observador no ve $t$, ve un criptograma más largo. Por eso la filmina no la tacha.

**Por qué la filmina dice sólo *"puede ser seguro"*.** Acá conviene ser muy preciso con **qué se pierde y qué no**, porque es fácil etiquetarlo mal.

- De las hipótesis **sí** se deduce que el esquema compuesto es CPA-Secure y que es **infalsificable**. Es exactamente el Ejercicio 4.24 de Katz & Lindell: *authenticate-then-encrypt*, instanciado con cualquier cifrado CPA-Secure y cualquier MAC seguro, da un cifrado CPA-Secure e infalsificable. La **integridad** de esta combinación, entonces, no está en discusión.
- Lo que **no** se deduce es la **CCA-seguridad** — y sin CCA-seguridad no hay [[cifrado-autenticado|cifrado autenticado]], porque la definición pide las dos cosas.

Y la CCA-seguridad es una noción de **confidencialidad frente a un adversario activo**, no de integridad: Katz & Lindell lo subraya en §4.5.4, donde separa las dos nociones y aclara que en CCA no interesa la integridad del mensaje *per se*, sino mantener la privacidad contra alguien que puede intervenir el canal. Por eso el modo de falla de este orden **no es que el adversario fabrique mensajes**: es que **lee los nuestros**.

La razón estructural es una sola: con este orden el criptograma que llega es un objeto que el receptor **tiene que descifrar antes de poder juzgarlo**, y todo lo que `Dec` haga con datos que el adversario eligió es superficie de ataque.

**Y la cátedra nombra el mecanismo.** La anotación *"(x padding)"* de la filmina 16 de la práctica dice, en dos palabras, dónde está el problema: en el **relleno**. Katz & Lindell desarrolla exactamente ese caso —`CBC` con padding, dos causas de fallo distinguibles, oráculo de padding— y registra que el ataque se llevó puestas configuraciones reales de `IPsec` que estaban armadas como *authenticate-then-encrypt*, y también versiones de `SSL` que intentaron defenderse devolviendo un único mensaje de error y aun así cayeron por temporización (§4.5.2). O sea que la anotación de la práctica y la sección [[#Verificar antes de descifrar|Verificar antes de descifrar]] de esta nota son lo mismo dicho a dos escalas.

> **Dos lecturas del mismo veredicto, y conviene tener las dos.**
>
> **Katz & Lindell es el más duro.** El libro concluye que *authenticate-then-encrypt* no provee cifrado autenticado en general y **no debería usarse** (§4.5.2). Su Ejercicio 4.24 pide demostrar que la combinación con componentes seguros da un esquema CPA-seguro e infalsificable, pero **no CCA-seguro** — y CCA-seguro es justamente lo que se necesita para hablar de [[cifrado-autenticado|cifrado autenticado]].
>
> **La cátedra es notablemente más suave.** Para el docente la segunda forma *"puede ser segura"*, hay demostraciones para combinaciones concretas, y el protocolo que la usa la usa **de forma segura** (cue pt2 702). Las dos posiciones son compatibles si se lee así: *puede ser seguro para instanciaciones concretas que traigan su propia prueba, pero como receta genérica está desaconsejado.* Una de esas instanciaciones concretas es [[ccm-y-gcm|CCM]], y viene con la prueba puesta.

### Cifrar y luego autenticar

$$c \leftarrow \mathsf{Enc}_{k_1}(m), \qquad t \leftarrow \mathsf{Mac}_{k_2}(c), \qquad \text{se envía } \langle c, t\rangle$$

**Por qué es siempre seguro**, en dos mitades *(lectura nuestra; la filmina afirma el veredicto sin argumentarlo, y la clase tampoco lo demuestra: se limita a decir que la demostración general existe)*:

1. **La confidencialidad no se toca.** La etiqueta se calcula sobre $c$, que es un dato **público**: cualquiera que vea el criptograma lo tiene. Entonces $t$ no puede filtrar nada de $m$ que $c$ no filtrara ya, y la CPA-seguridad del esquema compuesto se reduce directamente a la de $\Pi_e$. Es el argumento simétrico del que hunde a `Encrypt-and-MAC`: allá la etiqueta se calculaba sobre el secreto, acá sobre lo que ya es público.
2. **Todo criptograma que el receptor acepta lo produjo el emisor.** Para que `Dec` haga algo distinto de fallar sobre un $c'$ cualquiera, el adversario tiene que acompañarlo de un $t'$ que verifique — o sea, **falsificar** bajo $\mathsf{Mac}_{k_2}$, que por hipótesis pasa con probabilidad despreciable. La [[maleabilidad]] del cifrado sigue existiendo (se pueden seguir dando vuelta bits de $c$), pero **queda inutilizada**: el resultado ya no lo acepta nadie.

Esa segunda mitad es la que convierte la combinación en algo CCA-Secure, y es el resultado que desarrolla [[cifrado-autenticado|Cifrado autenticado]].

## Por qué está desplegada la segunda forma: la cronología

Una pregunta razonable, que el docente se hace solo antes de que la haga nadie: si hay una forma con demostración general y otra cuya respuesta es *"depende"*, ¿por qué existen sistemas serios construidos sobre la segunda?

La respuesta es histórica. **La formalización del cifrado autenticado es reciente: de los últimos veinte y pocos años.** Muchas herramientas de seguridad que hoy siguen en producción se diseñaron **antes** de que existieran esas pruebas, con la segunda forma en mente, y se defendieron a fuerza de contramedidas puntuales contra cada debilidad conocida en vez de con un teorema. No están rotas; están sostenidas por otra clase de argumento.

> [!quote]- De la transcripción — la formalización es de los últimos veinte y pocos años (cues pt2 694-699)
> Me pueden preguntar, y es totalmente válido[:] bueno[,] si tenemos una que siempre es segura y otra que la respuesta es: depende[,] y el depende puede ser difícil de probar[,] ¿por qué la consideraríamos siquiera?
>
> [P]or temas históricos […] la formalización de los criptosistemas [autenticados] es reciente[,] reciente en criptografía. Es de los últimos 20 y pocos años. Me parece un montón, pero pero es bastante reciente, pero hay muchas herramientas seguras que se desarrollaron con este modelo en mente antes de de pensar en las pruebas de de criptosistemas autenticados.

### SSH y la segunda forma: una discrepancia registrada

El único protocolo real que la cátedra nombra en este bloque es **`SSH`**, y lo da como ejemplo de la **segunda** forma. Hay que registrar la afirmación tal como fue dicha y, al lado, la discrepancia — porque **el argumento del docente vale con cualquiera de las dos asignaciones**, y no es una nota al pie: es el ejemplo con el que cierra el tema.

> [!quote]- De la transcripción — SSH como ejemplo de la segunda forma (cues pt2 700-707)
> entre ellas una muy importante que es [SSH], el shell remoto que usamos para administrar servidores. El protocolo [SSH] utiliza el mecanismo del medio. Sí, lo utilizas de forma segura. […] tiene un montón de contramedidas para garantizarse que, incluso sin una prueba de seguridad de esto, todas las debilidades conocidas[,] esta estructura[,] [estuvieran] mitigadas. entonces es seguro. Digo, lo utilizamos para administrar prácticamente todos los servidores del mundo […] Si estuviésemos diseñando [SSH] hoy desde 0, seguro utilizaríamos el tercer mecanismo. Y el tercer mecanismo es el que se utiliza en los protocolos más modernos.

**La discrepancia** *(precisión nuestra; conocimiento externo a la bibliografía del vault salvo donde se cita a Katz & Lindell).* El protocolo cuyo caso canónico es *authenticate-then-encrypt* no es `SSH` sino **`SSL`/`TLS` hasta la versión 1.2**, y eso sí está en la bibliografía: Katz & Lindell lo dice con todas las letras al describir la capa de registro —*"TLS 1.2 uses an authenticate-then-encrypt approach"*, §12.8— y remite justamente a la sección donde explica por qué ese enfoque es problemático. El transporte clásico de `SSH`, en cambio, calcula el MAC **sobre el texto plano** y lo transmite **al lado** del paquete cifrado: eso es `Encrypt-and-MAC`, o sea la **primera** forma, la que la filmina tacha.

**Lo notable es que la conclusión del docente sobrevive a las dos lecturas, y con la segunda queda incluso más fuerte:**

- Si `SSH` fuera la segunda forma, sería un sistema desplegado sobre un orden sin prueba general, sostenido por contramedidas. Es lo que el docente dice.
- Si `SSH` es la primera —que es lo que indica su especificación—, entonces es un sistema desplegado sobre el orden que la lámina marca **inseguro**, sostenido por contramedidas. El argumento es el mismo, con más fuerza todavía.

En los dos casos se llega al mismo lugar: **hoy se diseñaría con la tercera forma**, y los protocolos modernos la usan. Esto no descalifica el ejemplo; lo que hace es cambiar de fila la etiqueta.

## Por qué gana la tercera: agilidad criptográfica

La razón que la cátedra pone **primero** para preferir `Encrypt-then-MAC` no es la demostración. Es de ingeniería, y el docente la presenta como *"un concepto muy importante que hasta ahora venimos ignorando completamente"*: **las primitivas criptográficas se vuelven obsoletas**, sin excepción, y cualquier sistema pensado para durar tiene que tener previsto el camino de actualización.

Con `Encrypt-then-MAC` ese camino es corto. El MAC opera sobre el criptograma, que es un objeto ya cerrado; si el MAC queda obsoleto, **se reemplaza por otro y no hay que volver a demostrar la seguridad del sistema entero**, porque la garantía sale del teorema genérico y el teorema no habla de ningún MAC en particular. Con `MAC-then-Encrypt` no: como la seguridad de esa combinación depende de la combinación **concreta**, cambiar una pieza obliga a rehacer el argumento.

Es el mismo criterio que ordena [[eleccion-de-primitivas|Elección de primitivas en un proyecto]] y que tiene nota propia en [[agilidad-criptografica|Agilidad criptográfica]].

> [!quote]- De la transcripción — la agilidad criptográfica como razón para preferir la tercera forma (cues pt2 710-718)
> [C]uando 1 piensa ya en protocolos y empieza a salir de la abstracción matemática, y empieza a pensar en sistemas que van a van a estar funcionando[,] hay un concepto muy importante que hasta ahora venimos ignorando completamente[,] que es[:] las primitivas criptográficas, no importa lo buenos que sean, eventualmente se vuelven obsoletas. entonces cualquier protocolo, cualquier sistema que esté pensado para durar mucho tiempo tiene que tener previsto ¿qué va a pasar cuando la criptografía que usa se vuelva obsoleta? ¿cuál es el camino para actualizarlo?
>
> Sí, entonces la tercera forma es como que simplifica ese camino en el sentido de[:] bueno, si se volvió obsoleta, el [MAC] lo puedo reemplazar por otro. y no necesito volver a probar la seguridad en todo el sistema, como pasa [en] el segundo. Entonces, por eso se favorece hoy día al tercero.

## Dos claves independientes

Las tres fórmulas del slide escriben $k_1$ y $k_2$, no $k$. **No es notación decorativa: es una condición.** Y no basta con que sean distintas — tienen que generarse **de forma independiente**, que es lo que hace el $\mathsf{Gen}$ del slide 37: $k_1 \leftarrow \mathsf{Gen}_e$ y $k_2 \leftarrow \mathsf{Gen}_m$, dos sorteos separados.

La cátedra lo dice dos veces por escrito en la Práctica 04, y las dos veces con marcador visual: en la **filmina 16**, dentro del veredicto verde (*"siempre que los algoritmos de encripción y mac lo sean y claves independientes"*), y en la **filmina 17**, en una estrella roja al costado de la construcción — *"Las claves $k_1$ y $k_2$ deben ser independientes"*. La teoría lo deja implícito en el $\mathsf{Gen}$; la práctica lo saca a la superficie.

**Por qué.** Las pruebas de seguridad de $\Pi_e$ y de $\Pi_m$ suponen, cada una por su lado, que su clave es uniforme y desconocida para el adversario. Si la clave es la misma, esa hipótesis deja de valer para las dos a la vez: nada en la definición de MAC impide que $\mathsf{Mac}_k$ revele información sobre cómo se comporta $\mathsf{Enc}_k$, ni al revés. Katz & Lindell lo pone como regla general: *claves criptográficas independientes deberían usarse siempre que se combinan esquemas distintos* (§4.5.2).

**El caso concreto que lo demuestra, que además es ejercicio de la cátedra.** El contraejemplo de Katz & Lindell (p. 139) es, palabra por palabra y con la misma notación, el **ejercicio de la filmina 18 de la Práctica 04**:

> *"Considerar: $F$ una función pseudoaleatoria biyectiva fuerte; $\mathsf{Enc}_k(m) = F_k(m \Vert r)$; $\mathsf{Mac}_k(c) = F^{-1}_k(c)$ (pasa Mac Forge). Probar que el esquema haciendo Cifrar y luego autenticar no es resistente a CCA (por tener claves iguales)."*

Hace falta un contraejemplo donde las dos piezas sean **demostrablemente seguras por separado**, porque si no, no se está viendo el daño que hace compartir la clave — y el enunciado lo concede explícitamente con ese *"(pasa Mac Forge)"*. Sea $F$ una permutación pseudoaleatoria **fuerte** y tomemos, sobre `Encrypt-then-MAC` —el orden bueno—:

$$\mathsf{Enc}_k(m) = F_k(m \,\Vert\, r), \quad m \in \{0,1\}^{n/2},\ r \leftarrow \{0,1\}^{n/2}, \qquad\qquad \mathsf{Mac}_k(c) = F_k^{-1}(c)$$

Por separado las dos son impecables: el cifrado es CPA-Secure —y hasta CCA-Secure, Ejercicio 4.25— y el MAC es infalsificable, porque si $F$ es una PRP fuerte entonces $F^{-1}$ también lo es. Pero con **la misma** $k$ el esquema compuesto emite

$$\bigl\langle\, F_k(m \Vert r),\; \mathsf{Mac}_k\bigl(F_k(m\Vert r)\bigr) \,\bigr\rangle \;=\; \bigl\langle\, F_k(m \Vert r),\; F_k^{-1}\bigl(F_k(m\Vert r)\bigr) \,\bigr\rangle \;=\; \bigl\langle\, F_k(m \Vert r),\; m \Vert r \,\bigr\rangle$$

o sea **el mensaje en claro pegado al criptograma**. Y esto no contradice en nada el teorema de la construcción genérica, justamente porque el teorema exige que $k_1$ y $k_2$ se sorteen de forma independiente.

> **El desarrollo prueba más de lo que el enunciado pide** *(observación nuestra)*. La consigna pide mostrar que el esquema **no es CCA-Secure**, y el ataque de arriba ni siquiera usa el oráculo de descifrado: el adversario lee $m \Vert r$ de la etiqueta, con lo cual el esquema **no es CPA-Secure ni resiste a un espía pasivo**. Falla en la noción más débil de todas, y por lo tanto *a fortiori* en `CCA`. Que la consigna pida `CCA` es sólo porque es la prueba que la clase venía discutiendo.

**Una segunda forma de verlo, más cerca de lo que la clase ya tiene a mano** *(lectura nuestra)*. Tomemos $\Pi_e$ igual a [[modos-de-encadenamiento|CBC]] con $\mathrm{IV} = 0^{n}$ y $\Pi_m$ igual a [[cbc-mac|CBC-MAC]], las dos con la **misma** clave $k$. Las dos recursiones son literalmente la misma:

$$\mathrm{CBC}: \quad c_0 := 0^{n},\; c_i := F_k(c_{i-1}\oplus m_i) \qquad\qquad \mathrm{CBC\text{-}MAC}: \quad u_0 := 0^{n},\; u_i := F_k(u_{i-1}\oplus m_i)$$

de donde $u_\ell = c_\ell$: **la etiqueta es, bit por bit, el último bloque del criptograma**. El MAC no agrega ninguna garantía nueva, porque lo que verifica es un dato que el propio criptograma ya trae. Este segundo ejemplo **muestra el mecanismo de la interferencia pero no prueba lo mismo que el primero**, y hay que decirlo: `CBC` con IV fijo es determinístico, así que ya no era CPA-Secure **antes** de compartir la clave. Con claves independientes la coincidencia $u_\ell = c_\ell$ no desaparece del todo — pasa a tener probabilidad $\approx 2^{-n}$, que es despreciable, no cero.

> **La excepción, y por qué es una excepción.** [[ccm-y-gcm|CCM]] rompe esta regla a propósito: hace CBC-MAC y CTR **con la misma clave**. Puede hacerlo porque **trae una prueba de seguridad específica**, que es lo que sostiene el resultado; el formateo de los bloques ayuda —el primer bloque del MAC lleva un byte de `Flags` que ningún bloque de contador puede tener, así que ésos seguro no chocan— pero **no separa los dominios enteros**: los bloques que la cadena del MAC evalúa después no tienen ninguna estructura que los mantenga lejos de los contadores, y lo que hace la prueba es **acotar** esa probabilidad de colisión, no anularla. Es la diferencia entre violar la regla con una demostración y violarla por descuido. El detalle está en [[ccm-y-gcm#La misma clave, que normalmente estaría prohibido|CCM y GCM]].
>
> Y no hay contradicción entre las dos láminas de la cátedra, aunque parezcan chocar: la práctica enseña que **reusar la clave rompe `Encrypt-then-MAC` en general**, y la teoría afirma que `CCM` es CCA-Secure **con una sola clave**. Lo primero es un enunciado universal sobre la construcción genérica; lo segundo, un enunciado sobre un diseño concreto que trae su propia demostración.

## Verificar antes de descifrar

Éste es el punto operativo donde la diferencia entre los dos órdenes deja de ser teórica.

| | `MAC-then-Encrypt` | `Encrypt-then-MAC` |
|---|---|---|
| Dónde viaja la etiqueta | adentro del criptograma | al lado del criptograma |
| Qué necesita el receptor para verificar | descifrar primero | sólo $c$, $t$ y $k_2$ |
| Orden forzado en `Dec` | descifrar → despadear → verificar | **verificar → descifrar** |
| Qué corre sobre datos elegidos por el adversario | el descifrado y el despadeo | nada: se rechaza antes |

Con `Encrypt-then-MAC` el receptor **verifica antes de descifrar**, y un criptograma con etiqueta inválida **nunca llega a `Dec`**. Con `MAC-then-Encrypt` no hay alternativa: la etiqueta está adentro, así que hay que descifrar —y quitar el padding— para siquiera encontrarla.

**Por qué eso mata los ataques de oráculo de padding** *(el mecanismo está en Katz & Lindell §4.5.2, y la cátedra lo nombra con el "(x padding)" de la práctica; los nombres propios y las fechas son conocimiento externo)*. Cuando `Dec` corre sobre un criptograma manipulado, hay **dos** formas de fallar: que el padding no tenga la forma correcta y que la etiqueta no verifique. Si el receptor las distingue —por un mensaje de error distinto, o simplemente porque una tarda menos que la otra— está entregando **un bit de información por consulta** sobre el descifrado de un criptograma que el adversario eligió. Con ese bit, y explotando la [[maleabilidad]] de `CBC`, se descifra un criptograma cualquiera **byte por byte**, sin la clave. Es la forma canónica de un [[ataque-de-texto-cifrado-escogido|ataque de texto cifrado escogido]].

Y unificar los mensajes de error **no alcanza**: el libro lo descarta con tres razones —hay motivos legítimos para tener errores distintos, la combinación deja de ser genérica porque obliga a saber qué devuelve el cifrado de abajo, y sobre todo es dificilísimo garantizar que no se distingan, porque hasta la diferencia de tiempo alcanza—. Katz & Lindell registra que hubo versiones de `SSL` que intentaron exactamente eso y cayeron igual, por temporización.

Con `Encrypt-then-MAC` esa clase de ataque **no existe**: el criptograma manipulado se rechaza por la etiqueta antes de que ningún código de padding lo mire, así que no hay dos caminos de error que distinguir.

> **De dónde salieron esos ataques.** `TLS` hasta la versión 1.2 usaba `MAC-then-Encrypt` sobre `CBC` —Katz & Lindell lo consigna explícitamente al describir la capa de registro, §12.8—, y esa decisión de diseño es el origen de una familia entera de vulnerabilidades reales: el ataque de oráculo de padding de Vaudenay (2002) y sus reencarnaciones por temporización, como Lucky Thirteen (2013). El libro registra además que el mismo ataque se llevó puestas configuraciones de `IPsec` armadas como *authenticate-then-encrypt* (§4.5.2 y las notas del capítulo 4), aunque el valor por omisión de `IPsec` para cifrado autenticado sea *encrypt-then-authenticate*. `TLS 1.3` eliminó `CBC` del protocolo y sólo admite [[cifrado-autenticado|cifrado autenticado]], que en la práctica es [[ccm-y-gcm|AES-GCM]]. *(Los nombres y las fechas de los ataques son conocimiento externo a la bibliografía del vault.)*

## Qué hay que retener

- Las tres combinaciones **existen**; sólo `Encrypt-then-MAC` es segura sin condiciones — y "sin condiciones" quiere decir, según la práctica, *siempre que los componentes lo sean y las claves sean independientes*.
- El estatus de cada una es distinto y hay que saberlo con precisión: la primera **no alcanza**; la segunda tiene **pruebas para ciertas combinaciones y ninguna general**; la tercera tiene **una demostración general que vale para cualquier criptosistema y cualquier MAC**.
- El motivo de cada veredicto es distinto, y las dos fallas son **de confidencialidad**, no de integridad. `Encrypt-and-MAC` pierde la CPA-seguridad: la etiqueta habla del mensaje. `MAC-then-Encrypt` sigue siendo CPA-Secure e **infalsificable** (Ejercicio 4.24 de Katz & Lindell), pero puede perder la **CCA-seguridad**: hay que descifrar y despadear antes de poder verificar, y dos causas de fallo distinguibles dan un oráculo que recupera el texto plano entero. La práctica resume ese mecanismo en dos palabras: *"(x padding)"*.
- **Dos claves independientes**, siempre, salvo que haya una prueba que diga lo contrario. El ejercicio de la filmina 18 muestra el precio de olvidarlo **con el orden correcto y componentes seguros**.
- La razón por la que hoy gana la tercera no es sólo la demostración: es la **[[agilidad-criptografica|agilidad criptográfica]]** — permite jubilar el MAC obsoleto sin rehacer la prueba del sistema entero.
- La regla mnemotécnica que resume todo: **autenticar lo que se transmite, no lo que se guardó** — o sea, el MAC va sobre $c$, porque $c$ es lo que el adversario puede tocar.

## Ver también

- [[cifrado-autenticado|Cifrado autenticado]] — `Encrypt-then-MAC` escrito como criptosistema, y el teorema de que el resultado es CCA-Secure
- [[ccm-y-gcm|CCM y GCM]] — los dos modos reales: uno de cada orden, y por qué cada uno se salva
- [[agilidad-criptografica|Agilidad criptográfica]] — la razón de ingeniería por la que se favorece la tercera forma
- [[maleabilidad|Maleabilidad]] — el problema que abre la clase y que esta nota empieza a cerrar
- [[ataque-de-texto-cifrado-escogido|Ataque de texto cifrado escogido]] — el modelo en el que se mide todo esto
- [[message-authentication-code|Message Authentication Code]] y [[seguridad-de-un-mac|Seguridad de un MAC]] — qué garantiza y qué no garantiza la pieza que se está combinando
- [[cbc-mac|CBC-MAC]] — el MAC determinístico del que sale el ejemplo de las dos claves iguales
- [[pruebas-de-indistinguibilidad|Pruebas de indistinguibilidad]] — `CPA`, y por qué determinístico implica inseguro
- [[modos-de-encadenamiento|Modos de encadenamiento]] — `CBC` y su padding, que es donde muerde el oráculo
- [[eleccion-de-primitivas|Elección de primitivas en un proyecto]] — dónde aterriza el criterio de reemplazabilidad
- [[clase-03-macs-y-cifrado-autenticado|Clase 03 — MACs y cifrado autenticado]] — la sesión del 03/09, cues pt2 640-718
- [[practica-04-macs-hash-y-cifrado-autenticado|Práctica 04 — MACs, hash y cifrado autenticado]] — las filminas 16, 17 y 18, que son las que corrigen y ponen a prueba este cuadro
- Katz & Lindell cap. 4 *Message Authentication Codes*, §4.5.2 ([[bibliografia|bibliografía]])
