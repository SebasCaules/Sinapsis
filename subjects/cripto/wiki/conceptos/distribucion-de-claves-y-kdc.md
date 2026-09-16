---
title: Distribución de claves y KDC
resumen: 'El problema de compartir una clave simétrica cuando el único canal es inseguro: una clave por par crece de forma cuadrática y el KDC lo baja a $n$ claves con claves de sesión, a costa de un único punto de falla y de una base mínima de confianza que nunca desaparece.'
fuentes: ["[[clase-04-criptografia-asimetrica-y-firma-digital]]", "[[clase-03-macs-y-cifrado-autenticado]]", "[[intercambio-de-claves]]", "[[cifrado-autenticado]]", "[[needham-schroeder]]", "[[practica-05-de-la-clave-privada-a-la-clave-publica]]"]
aliases: [Distribución de claves y KDC, KDC, Key Distribution Center, Trusted Third Party, Clave de sesión, Kerberos, Base mínima de confianza]
type: concepto
unidad: 1
clase: 4
orden: 1
created: 2026-09-04
updated: 2026-09-15
tags: [criptografia, distribucion-de-claves, kdc, gestion-de-claves, clase-04, transcripcion]
sources: ["Clase 04 - Criptografia - Cifrado asimetrico y firma digital.pdf", "raw/clases/Clase 04 - Transcripcion.VTT"]
---

# Distribución de claves y KDC

**El problema que hace falta resolver antes de poder usar cualquiera de los esquemas simétricos de las clases 2 y 3: cómo llegan $A$ y $B$ a compartir una clave si el único canal que tienen es inseguro.** Es la nota que explica por qué el curso da un giro hacia una maquinaria completamente distinta —la criptografía asimétrica— apenas termina de cerrar el cifrado autenticado.

> **Fuentes de esta nota.** Filminas **2 a 5** de la Clase 04, dictada el **10/09** por Pablo Abad, con transcripción: [`Clase 04 - Transcripcion.VTT`](../../raw/clases/Clase%2004%20-%20Transcripcion.VTT), bloque de distribución de claves en los cues **1-114**, los primeros catorce minutos de la clase. La nota se escribió el 04/09 sólo contra el PDF y se revisó contra la voz el 14/09: lo que la voz agregó es la **base mínima de confianza**, la respuesta a un alumno sobre las claves iniciales, y la confirmación de lo que las imágenes de la filmina 5 sólo insinuaban.

> **La [[practica-05-de-la-clave-privada-a-la-clave-publica|Práctica 05]] (14/09) vuelve sobre este tramo cuatro días después, y trae dos cosas que la teoría no.** Primero, **la lista de las tres limitaciones** de la clave privada —distribución, almacenamiento, sistemas abiertos—, con una flecha que dice que el KDC resuelve las dos primeras y que la tercera es la que obliga a la clave pública: es Katz & Lindell §10.1-10.2, y ninguna filmina de la Clase 04 la enumera. Segundo, un diagrama de KDC en el que el centro le manda la clave de sesión **a cada parte** y que la lámina rotula *"Ej: Needham Schroeder"* — y no lo es: ése es el KDC simplificado del libro, y Needham-Schroeder es la variante en la que $A$ recibe las dos partes y reenvía el ticket. Detalle en [[practica-05-de-la-clave-privada-a-la-clave-publica#3. Las tres limitaciones de la clave privada, y qué resuelve el KDC|Práctica 05 §3]].

## El problema

Un criptosistema `CCA-Secure` —el estándar de la [[clase-03-macs-y-cifrado-autenticado|Clase 03]]— resuelve confidencialidad e integridad entre $A$ y $B$ una vez que ambas partes ejecutan $\mathsf{Enc}_k(M)$ con la **misma** clave $k$. Pero eso presupone lo que hay que construir: **una clave ya compartida**. Y esa clave no se puede mandar por el mismo canal que se quiere proteger —si el canal fuera seguro para transmitir la clave, ya no haría falta cifrar nada—.

La pregunta que abre la filmina 3 es exactamente ésa: *¿cómo se comparten las claves?*

**El docente la deriva del principio de Kerckhoffs, no la presenta como un problema aparte.** Si lo único en lo que puede descansar una prueba de seguridad es que el atacante no tiene la clave, entonces la restricción práctica es inmediata: la clave no puede viajar por un canal que el atacante escucha. La clase entera es el intento de salir de esa trampa.

> [!quote]- De la transcripción — el problema, deducido de Kerckhoffs (cues 18-24)
> *"Si se acuerdan, la idea de seguridad bajo el principio de Kerckhoffs decía que la seguridad de un sistema no puede verse comprometida ante un atacante que conozca el algoritmo, los detalles de implementación, la naturaleza de la información que circula, el tipo de sistema. **Lo único en lo cual puede descansar una prueba de seguridad es en que un atacante no tiene acceso a la clave.** Y eso nos impone una restricción práctica: si tenemos un canal que es inseguro, nosotros no podemos transmitir la clave por ese canal. Entonces, por un lado, para comunicarnos por un canal que tal vez es inseguro necesitamos que emisor y receptor tengan la clave. Pero no podemos mandar la clave por ese canal."*

## Dos escenarios, dos costos

**Dos puntos.** Si sólo hay que resolver el problema entre $A$ y $B$, alcanza con un **canal seguro puntual**: una reunión física, un correo cifrado con otra clave que ya se tenga, un mensajero de confianza. Es un costo que se paga una sola vez — y el docente advierte que *"encontrar un canal seguro no es algo trivial"* (cue 25).

**Múltiples puntos ($n$).** Cuando el sistema tiene $n$ participantes que potencialmente necesitan hablar entre sí de a pares —*"un servidor contra miles de clientes, o un sistema distribuido, una aplicación de chat segura a lo WhatsApp"* (cues 27-28)—, el mismo truco deja de escalar y aparecen dos estrategias con estructura de costo muy distinta.

### Estrategia 1 — una clave por combinación

Cada participante administra una clave distinta para cada posible interlocutor: $n-1$ claves por parte. El total de claves en el sistema es la cantidad de pares no ordenados de $n$ elementos:

$$\binom{n}{2} = \frac{n(n-1)}{2}$$

Es **cuadrático en $n$**. Con $n=10$ ya son $45$ claves; con $n=1000$, casi medio millón. Cada participante nuevo obliga a distribuir una clave con **todos** los que ya estaban, así que el costo de agregar gente crece con el tamaño del sistema, no con una constante.

**La cuenta se construyó en el aula, no se leyó.** El docente fue subiendo $n$ —dos personas, una clave; tres personas, tres claves; cuatro personas— y descartó la primera respuesta, $n$, mostrando que ya con tres participantes se necesitan tres claves. La fórmula la dio un alumno.

> [!quote]- De la transcripción — de "n" a "n por n menos uno sobre dos" (cues 36-50)
> *"Ahí Augusto dice n. (…) Pero fíjate que para 2 personas necesitás una clave, ya es menos que n menos 1; pero para 3 personas dije 3 claves. (…) Pensemos: si tengo 4 personas involucradas, yo, a la persona A, necesito una clave para que se conecte con B, otra con C, otra con D."*
> — **Tomás Pietravallo:** *"Sería n por n menos 1 sobre 2."*
> — *"Bien, que es la fórmula de todas las combinaciones de elementos tomados de a 2. Es un número que **escala cuadráticamente**. Entonces, cuando hablamos de un millón de posibles interacciones, estamos hablando de **billones** de posibles claves."*

### Estrategia 2 — un punto único de confianza

La alternativa es introducir una entidad central —un ***Trusted Third Party***— con la que cada participante comparte **una sola** clave fija. El total de claves en el sistema pasa a ser **lineal**, $n$ claves para $n$ entidades, sin importar cuántos pares distintos necesiten comunicarse. *"Un millón de usuarios, un millón de claves, pero ya no es un número que se escapa cuadráticamente"* (cue 69).

Esa entidad, instanciada como protocolo, es el **KDC** (*Key Distribution Center*, filminas 4-5) — en la imagen del docente, *"la central telefónica que coordina lo que haya que coordinar para que después pueda ocurrir una comunicación segura"* (cue 58).

## KDC — Key Distribution Center

Un KDC comparte una clave fija con cada participante del sistema: $k_a$ con $A$, $k_b$ con $B$, $k_c$ con $C$, etc. Cuando $A$ quiere hablar con $C$:

1. $A$ envía un pedido al KDC.
2. El KDC genera una **clave de sesión** nueva, $k_s$, específica para esa comunicación.
3. El KDC se la envía a las dos partes, cada una cifrada con la clave que comparte con esa parte:

$$\text{KDC} \to A:\ \mathsf{Enc}_{k_a}(k_s) \qquad\qquad \text{KDC} \to C:\ \mathsf{Enc}_{k_c}(k_s)$$

$A$ y $C$ descifran cada uno con su propia clave fija y quedan con $k_s$ en común, sin haberla transmitido nunca en claro y sin que el KDC tenga que repetir el proceso para cada par de la red.

**Por qué "de confianza" y no sólo "central".** El KDC genera $k_s$ y la reparte, así que **la conoce**: tiene, por construcción, la posibilidad de leer o adulterar todo lo que $A$ y $C$ se digan con ella. Que no lo haga no es algo que el protocolo pueda garantizar; es una hipótesis sobre la entidad. Por eso forma parte de lo que el docente llama el **diseño mínimo de confianza** del sistema.

> [!quote]- De la transcripción — clave de sesión, y por qué el KDC tiene que ser confiable (cues 71-79)
> *"La idea de estos protocolos es: supóngase que A quiere comunicarse con C. La idea es que medie esta interfaz en el medio, y lo que termina haciendo es **creando una clave específica para esa conversación, que se suele llamar clave de sesión**, y de alguna forma se la envía a A y se la envía a C. Y a partir de ahí se comunican tranquilos. ¿Por qué se habla de una tercera parte de confianza? Porque si se fijan en este esquema, el KDC genera una clave, se la reparte, pero el KDC, teniendo esa clave, tendría la posibilidad de vulnerar la confidencialidad o la integridad que se espera. Para que eso no ocurra, **el KDC tiene que ser un elemento de confianza: tiene que formar parte del diseño mínimo de confianza del sistema.** Por eso se le llama trusted party."*

Cómo son esos protocolos por dentro —qué mensajes van y vuelven, y qué puede salir mal— es material de la clase siguiente: *"la clase que viene vamos a ver algunos protocolos más abajo, a nivel de esto"* (cue 71). Es [[needham-schroeder|Needham-Schroeder]], el protocolo de KDC en el que se basan Kerberos y Active Directory.

### Qué gana y qué pierde frente a la Estrategia 1

| | Una clave por combinación | KDC |
|---|---|---|
| Claves totales en el sistema | $\binom{n}{2}$, cuadrático | $n$, lineal |
| Claves que administra cada participante | $n-1$ | $1$ (con el KDC) |
| Costo de agregar un participante | Distribuir con todos los existentes | Una clave nueva con el KDC |
| Punto de falla | Ninguno centralizado | **El KDC es un único punto de falla** |

El KDC resuelve el problema de escala al precio de introducir exactamente lo que el diseño distribuido evitaba: si el KDC se compromete, se cae o queda inaccesible, **toda** la red pierde la capacidad de negociar claves de sesión nuevas — y quien compromete al KDC obtiene, de una sola vez, la clave fija de cada participante del sistema. En la voz: *"sería como el blanco más jugoso para atacar (…) y es real, es por donde se suele atacar este tipo de sistemas, y es el lugar donde uno enfoca más prácticas de seguridad"* (cues 98-100).

## Lo que el KDC no resuelve: las claves iniciales y la base mínima de confianza

**Esta sección no está en ninguna filmina; salió de una pregunta de alumno.** Cuando el docente terminó de presentar el KDC, Carlos Vallejo Tapia preguntó por *"el problema de esas claves iniciales de cada una"* — las $n$ claves fijas que cada participante comparte con el KDC. La respuesta reordena el tramo entero: el KDC **no resuelve** la distribución de claves, la **achica**. Sigue haciendo falta un canal seguro para $n$ claves, sólo que ya no para $\binom{n}{2}$.

Y de ahí sale el enunciado más fuerte de la clase, que vale para todo el curso y no sólo para este tema: **no existe un sistema seguro construido sobre la desconfianza absoluta de todos con todos**. Todo diseño tiene un núcleo que se da por confiable y cuya caída arrastra al resto; lo que hace la ingeniería de seguridad es **achicar** ese núcleo, nunca eliminarlo. Es la idea que la literatura de seguridad llama *trusted computing base* *(el nombre es precisión nuestra; el docente dice "base mínima de confianza")*, y que en esta clase tiene su primera instancia: primero hizo falta un canal seguro para todo el mensaje; cifrando, sólo para la clave; con el KDC, sólo para $n$ claves; con la criptografía asimétrica, veremos, para menos todavía — pero nunca para nada.

> [!quote]- De la transcripción — "achicamos el problema, no lo resolvimos", y la base mínima de confianza (cues 82-96)
> — **Carlos Vallejo Tapia:** *"¿Y no estaría el problema también de esas claves iniciales de cada una?"*
> — *"Muy buen punto. A ver: con esto achicamos el problema, no lo resolvimos. Fíjense que venimos pateando el problema: partimos de una bola gigante y vamos como achicándola, pero todavía nunca lo solucionamos. Voy a hacer un spoiler: **la idea de cualquier diseño seguro de sistemas es achicar lo que se llama la base mínima de confianza.** Para construir seguridad hay un punto, que se busca que sea lo más chico posible, que tiene que funcionar bien y ser seguro, y que si se vulnera se vulnera la seguridad de todo el sistema, como una caída de fichas de dominó. **Está demostrado que no se puede construir un sistema seguro a partir de la absoluta desconfianza de todos con todos.** Se necesita siempre algo. Lo que vamos a ir haciendo es achicar cada vez más esa necesidad, pero nunca va a desaparecer. Acuérdense que al principio era: necesitamos compartir una cantidad absurda de información y no tenemos un canal seguro. Cifrando, podemos achicarlo: ahora necesitamos un canal seguro para transmitir sólo la clave. (…) Esto nos achica la cantidad de claves, pero, muy bien notado, no resuelve el problema todavía."*

**Cómo se resolvía en la práctica, antes de 1976.** Fuera de banda, siempre: la clave se quemaba en el dispositivo en la fábrica y después los dispositivos se instalaban en lugares distintos, o se anotaba en un papel, o se dictaba por teléfono (cues 112-114). Es el dato que hace ver por qué la criptografía asimétrica fue una revolución y no una mejora: durante décadas *"ésta fue la única forma de atacar el problema"*.

## Kerberos y Active Directory

La filmina 5 no desarrolla el punto en texto: sólo muestra dos imágenes, un sello con la cabeza de Cerbero —el perro de tres cabezas de la mitología griega, con motivo de meandro griego alrededor— y el logo de Microsoft Active Directory. **La voz confirma la lectura**: son las dos implementaciones dominantes de un KDC. Active Directory es la solución de Microsoft para armar dominios de computadoras, dispositivos y usuarios *"bajo una suerte de mismo paraguas"*; Kerberos es *"la variante abierta del mismo problema, que se popularizó por Unix"*, y el docente la ubica también en flotas de sensores IoT. Que Kerberos tome su nombre del guardián de tres cabezas por las tres partes del protocolo —cliente, servidor y KDC— sigue siendo lectura nuestra; la clase no lo dice.

> [!quote]- De la transcripción — las dos implementaciones que dominan (cues 101-110)
> *"Ésta es una de las formas más difundidas, incluso hoy día, de establecer canales seguros cuando hay una cantidad grande de componentes. Las dos implementaciones más conocidas de este concepto son **Active Directory**, que es la solución que desarrolló Microsoft para armar dominios de computadoras (…) y **Kerberos**, que es la variante, si quieren, abierta de ese mismo problema, que se popularizó por Unix. (…) Si van a trabajar en una empresa grande que usa tecnologías Microsoft, va a haber un Active Directory: es la implementación de un KDC, tecnología Microsoft. Si se van a una flota, por ejemplo, de sensores de IoT, muchos sensores que transmiten información sensible y están usando tecnologías más del lado Unix, probablemente haya algo de Kerberos."*

## Por qué esta nota antecede a la criptografía asimétrica

El KDC resuelve la distribución de claves **sin** salir del mundo simétrico: sigue habiendo una clave fija por participante, sólo que administrada centralmente. La [[clase-04-criptografia-asimetrica-y-firma-digital|Clase 04]] plantea esta sección como motivación y a continuación introduce una alternativa radicalmente distinta —dos claves por participante, una pública y una privada, sin ningún tercero de confianza que reparta secretos—. El KDC y la criptografía asimétrica no son mutuamente excluyentes: en la práctica, el intercambio de claves asimétrico (Diffie-Hellman) y los KDC conviven en protocolos reales, cada uno resolviendo una parte distinta del problema de gestión de claves que retoma la [[clase-05-protocolos-criptograficos|Clase 05]].

Y la Guía 4 arranca exactamente de acá: sus primeros cinco ejercicios son protocolos con claves de sesión, un tercero de confianza y los ataques que la voz anticipó —repetición, reuso de clave, suplantación— → [[guia-04-manejo-de-claves-cifrado-asimetrico-y-firma-digital#Ejercicio 1|Guía 4, Ej. 1]].
