---
title: Video 06 — Principios de diseño (2026)
resumen: 'Clase grabada en 2026 sobre los ocho principios de diseño, versión vigente del deck: suma modelado de amenazas y un bloque sobre modelos de lenguaje, y no llega a cubrir las vulnerabilidades que anuncia su portada.'
fuentes: ["[[videografia]]", "[[cronograma]]", "[[programa-y-objetivos]]"]
aliases: [Video 06, Principios de diseño, Saltzer y Schroeder, Menor privilegio, Defensa en profundidad, Threat Modeling Manifesto]
type: video
clase: 8
orden: 40
video: 06
youtube: SgAzPJ_Sudk
created: 2026-09-03
updated: 2026-09-04
tags: [video, seguridad, principios-de-diseno, saltzer-schroeder, menor-privilegio, fail-safe, defensa-en-profundidad, threat-modeling, llm, prompt-injection, clase-08]
sources: ["https://www.youtube.com/watch?v=SgAzPJ_Sudk"]
---

# Video 06 — Principios de diseño (2026)

> **1:02:55** · Subido el **17/05/2026** · **Rodrigo Ramele** · **Oculto** (no listado, sólo por link) · Ancla: **Clase 8 — Principios de diseño y vulnerabilidades**, 15/10 → [[cronograma#Segunda mitad — Seguridad (hasta el 2do parcial)|cronograma]] · Título literal en YouTube: *Criptografía y Seguridad Informática - Principios de Diseño* · [Ver el video](https://www.youtube.com/watch?v=SgAzPJ_Sudk)

**Conviene ver el video completo si se va a rendir el segundo parcial** —es la única fuente que hay para esta clase, el vault no tiene sus filminas y son los ocho principios numerados los que tienen forma de temario—; **no hace falta verlo** si lo que se busca son vulnerabilidades concretas, taxonomías o algo con una fórmula adentro, porque en esta hora no hay ni una sola.

---

## Lo que hace distinto a este video

**Es la versión vigente del deck, y eso está verificado, no supuesto.** Hay dos videos de *Principios de Diseño* en la playlist: éste (2026) y el de 2024 (`08hziQPewts`, 1h 08). No son la misma clase grabada dos veces:

| | Éste (2026) | El de 2024 |
|---|---|---|
| Plantilla | Fondo blanco, banda turquesa, **sin pie ni paginación** | Pie *Criptografía y Seguridad - ITBA* + número de página |
| Archivo | Deck sin nombre visible, ~16 láminas | `Clase 07 - Aplicaciones - Principios de Diseño.pdf`, 16 pp. |
| Principio 2 | *Fallar de forma segura (Fail-safe defaults)*, 4 viñetas | *Valores iniciales seguros*, 2 viñetas |
| Principio 3 | *Simplicidad* | *Economía de mecanismos* |
| Principio 5 | *Sistema Abierto* | *Diseño abierto* |
| Principio 6 | *Segregación de Tareas* | *Separación de privilegios* |
| Principio 8 | *Menor asombro* | *Aceptación psicológica* |

**Los nombres difieren en 5 de los 8 principios y los ejemplos son disjuntos**: buscar `finger`, `sshd`, `Oracle`, `xz` o `Bishop` en la transcripción de éste da cero resultados reales, y buscar *castillo*, *Constantinopla*, *manifesto*, *LLM*, *poisoning*, *prompt injection*, *MITRE*, *STRIDE* u *holandés* en la del 2024 también da cero. Son dos clases distintas sobre el mismo tema. Esta versión tiene además una lámina propia de **Modelado de Amenazas** con el *Threat Modeling Manifesto* ([[#Modelado de amenazas y el Threat Modeling Manifesto|55:24]]) que en el deck de 2024 no existe; el de 2024, a cambio, tiene los ejemplos técnicos duros y la bibliografía de Bishop que acá faltan.

> **Caveat de fecha, y es importante.** Este video se subió el **17/05/2026**, o sea **primer cuatrimestre**. **No hay ningún video de Principios de Diseño de la cursada 2C-2026.** El único video de todo el corpus grabado dentro de esta cursada es el de *Criptografía Simétrica* (22/08/2026). Que la ancla sea la Clase 8 del 15/10 viene del tema y del [[programa-y-objetivos#Contenidos|programa]], no de la fecha.

El dictado se ancla al 1C-2026 desde adentro del propio video: en **17:08** Ramele pregunta *"¿alguien vino a la charla que dieron los de Hong Kong, que estuvo en el rectorado?"* y dice **"la semana pasada"**. Es clase en vivo, con alumnos que hablan y tienen nombre: **Nicolás** (10:15), **Joaquín** (18:10, 23:09 y 58:21), **Ignacio** (59:05). En **41:38-42:00** el docente se interrumpe: *"perdón, justo tengo un problemita acá en mi casa"*.

> **Discrepancia menor con la Videografía.** La [[videografia#Los 13, con sus datos duros|nota de Videografía]] anota este video como subido el **16/05/2026**; la metadata del archivo dice **2026-05-17**. Probablemente sea diferencia de huso horario ***(Lectura nuestra.)***, pero conviene alinear las dos.

**Y un desmentido que conviene registrar antes de mirarlo:** la portada del deck promete *Principios de Diseño de Seguridad / **Vulnerabilidades***. **Las vulnerabilidades no se ven.** La clase se come la hora entera con los ocho principios, el modelado de amenazas y el bloque de LLM, y termina justo cuando aparece la segunda portada, *Ejercicio del uso de estos principios*. De vulnerabilidades hay sólo menciones al pasar (SQL injection) y la promesa de verlas después. Si el vault daba por hecho que este video cubría la mitad de "vulnerabilidades" de la Clase 8, **no la cubre**.

> **Esta nota es la única fuente que existe.** El vault no tiene el PDF de esta clase. Todo lo que sigue sale de la transcripción y de 77 frames; las descripciones de láminas de abajo son el único registro del deck que hay en el vault.

---

## Recorrido

| Tramo | Tema | Qué hay ahí |
|---|---|---|
| 00:00-00:20 | Apertura | Portada del deck y prueba de micrófono nuevo |
| 00:20-06:38 | **La analogía del castillo** | Seis minutos sin cambiar de filmina, todo pregunta abierta al curso |
| 06:38-11:05 | Qué son los principios de diseño | Diagrama de cebolla; disponibilidad como primer requisito; el balance de tres |
| 11:05-12:33 | Tecnología, procesos y personas | El Venn de *disciplined execution* |
| 12:33-13:19 | Saltzer y Schroeder | 1975, sistemas operativos seguros |
| 13:19-18:25 | **1. Menor privilegio** | Need to know, `chmod 777`, digresión de Hong Kong |
| 18:25-24:04 | **2. Fallar de forma segura** | Whitelist contra blacklist; niveles de certificación de HSMs; fail deadly |
| 24:04-27:51 | **3. Simplicidad** | Tira cómica de las cajitas; tuplas sujeto-acceso-objeto; capas de superficie de ataque |
| 27:51-29:17 | **4. Mediación completa** | Los dos diagramas de mediación parcial contra completa |
| 29:17-36:55 | **5. Sistema abierto** | Kerckhoffs; los bits son eternos; open source y commits de agentes |
| 36:55-42:44 | **6. Segregación de tareas** | Oposición de intereses; el impuesto holandés a los barcos |
| 42:44-51:24 | **7. Mecanismos exclusivos y defensa en profundidad** | El flag de compras reusado para vouchers; pivoting contra side channel |
| 51:24-55:24 | **8. Menor asombro** | Meme de Anakin y Padmé; los mejores trabajadores como peores usuarios |
| 55:24-56:40 | Modelado de amenazas | Threat Modeling Manifesto; adelanta STRIDE y MITRE |
| 56:40-1:02:35 | **Seguridad de los LLM** | Poisoning en capas y mezcla de canales; discusión abierta con el curso |
| 1:02:35-1:02:55 | Cierre | Barrido del deck; aparece *Caso Aplicación Web '90* sin comentar |

---

## Inventario del deck

Como el PDF no está en `raw/`, esto es lo que hay. Dieciséis láminas: catorce de contenido y dos portadas.

| Timestamp | Lámina | Visual |
|---|---|---|
| 00:04 | Portada — *Criptografía y Seguridad · Principios de Diseño de Seguridad / Vulnerabilidades* | Foto de una puerta de bóveda de banco abierta, franja turquesa |
| 06:38 | *Principios de Diseño* (1) | Diagrama de cebolla: Policies, Procedures & Awareness · Physical · Network · Computer · Application · Device, con un candado al centro |
| 11:05 | *Principios de Diseño* (2) | Venn de TECHNOLOGY / PROCESS / PEOPLE con DISCIPLINED EXECUTION al medio |
| 12:33 | *Principios de Saltzer & Schroeder* | Sólo texto, tres párrafos |
| 13:19 | *1. Menor Privilegio (Least privilege)* | Texto + ejemplo de la información financiera confidencial |
| 18:25 | *2. Fallar de forma segura (Fail-safe defaults)* | Cuatro viñetas + ejemplo de autenticación contra base caída |
| 24:04 | *3. Simplicidad (Economy of mechanism)* | Tira cómica de tres viñetas: el pizarrón que se vuelve a llenar de cajitas |
| 26:42 | *3. Simplicidad* (2) | Dos diagramas Subject → Object con flecha roja rotulada Access |
| 26:58 | *3. Simplicidad* (3) | Cuadro *Attack Surface Layers*, cuatro bandas de color |
| 27:51 | *4. Mediación completa (Complete mediation)* | Dos triángulos X / Y / Mediator: Partial con tildes verdes, Complete con cruz roja |
| 29:17 | *5. Sistema Abierto (open design)* | Viñeta de xkcd del code talker navajo |
| 36:55 | *6. Segregación de Tareas (separation of privilege)* | Texto, cinco subviñetas del caso del descuento |
| 42:44 | *7. Mecanismos exclusivos (Defense-in-Depth)* | Texto + ejemplo de la venta sin autorización, con tres preguntas |
| 51:24 | *8. Menor asombro (psychological acceptability)* | Meme de Anakin y Padmé sobre política de passwords |
| 55:24 | *Modelado de Amenazas (Threat modeling)* | Recuadro con los *Values* del Threat Modeling Manifesto + `threatmodelingmanifesto.org` |
| 56:39 | Portada 2 — *Ejercicio del uso de estos principios* | Igual a la primera, otro subtítulo |
| 1:02:52 | *Caso Aplicación Web '90* | Cinco viñetas; visible sólo en el barrido final, **sin comentar** |

Las tres imágenes de humor del deck son la tira de las cajitas, la viñeta de xkcd del code talker y el meme de Anakin y Padmé.

---

## Los seis minutos del castillo

La clase arranca sin filmina: la portada queda quieta en pantalla mientras Ramele monta una sola pregunta al curso y la trabaja durante seis minutos. **Se captura una colina en la Edad Media y se construye un castillo: ¿qué se hace para que no entren?** De las respuestas del curso saca, en orden, casi todo el temario que va a numerar después:

1. **Aislar una parte de la colina** con un muro difícil de destruir y de escalar. El castillo no es para ganar la batalla, es para **ganar tiempo de defensa** y darte herramientas para defenderte con exposición limitada.
2. **Las ventanas trapezoidales** —abertura grande hacia afuera, chica hacia adentro— que te dejan disparar exponiendo lo mínimo.
3. **La zona de exclusión** alrededor del muro.
4. **Elegir el mejor terreno**: arriba de la colina, porque ya se tiene energía potencial a favor. Constantinopla como caso.
5. **Una única puerta de acceso que puedas controlar**, por donde pasa todo.

Los puntos 1, 4 y 5 prefiguran directamente **menor privilegio**, **mediación completa** y la idea de punto único de control; el 2 es defensa en profundidad avant la lettre. La digresión que cierra el tramo es el dron Predator como máximo histórico del principio militar de fondo.

> [!quote]- Del video — el principio rector militar (02:49)
> "El principio rector de todo lo que es militar es poder ejercer daño sin exponerme."

Es el mejor tramo del video como material de repaso: si sólo se dispone de seis minutos, **estos son los que conviene mirar**, porque son la versión mnemotécnica de los ocho principios.

---

## Antes de los principios: tres marcos

### Robusto quiere decir disponible

La filmina de *Principios de Diseño* (06:38) los define como bases que promueven un diseño cuyo resultado sea un sistema **robusto y seguro**, principios guía de alto nivel que se adaptan a las necesidades puntuales, se apoyan en las recomendaciones de los modelos de seguridad, **se aplican en todas las capas** donde funciona el sistema, y son simples y restrictivos. A la derecha, la cebolla de capas.

Ramele desarma "robusto": robusto es que **aguanta cambios**, y lo primero que algo necesita para ser seguro es **estar**. De ahí la consecuencia que conviene tener escrita, porque es contraintuitiva: **un denial of service es un ataque de seguridad**, aunque no toque la confidencialidad de nada (07:01). Un sistema apagado es un sistema al que no le puede pasar nada, y eso también es un problema de seguridad.

> [!quote]- Del video — la disponibilidad como primer requisito (07:19)
> "Hay que acordarse siempre que el primer requisito de seguridad es que el sistema esté disponible."

Marca además la distinción que va a usar todo el bloque: **los principios no son los modelos.** Los modelos son reglas con nombre y apellido y se ven más adelante.

### El balance de tres, y los captchas

Seguridad, funcionalidad y eficiencia se rebalancean entre sí como bueno, bonito y barato: un sistema muy seguro suele ser malísimo de usar (09:09). El ejemplo que elige es actual y sirve como puente al principio 8: **los captchas**. Con la proliferación de agentes se volvieron tan complejos que ya penalizan la aceptación del usuario, y de ahí el corrimiento hacia *liveness detection* e identificación de persona física.

> [!quote]- Del video — el eslabón más débil (09:00)
> "Siempre la seguridad es tan fuerte como el más débil de los eslabones de la cadena."

### Tecnología, procesos y personas

La segunda lámina de la sección (11:05) agrega una sola viñeta —los principios no deben perder de vista **cómo se implementan y quiénes los van a usar**— y debajo pone un Venn de tres círculos con **DISCIPLINED EXECUTION** en la intersección:

| Combinación | Qué falta | Qué sale |
|---|---|---|
| Process & tech | People | *Alienation* |
| People & tech | Process | *Automated chaos* |
| People & process | Technology | *Frustration* |

La insistencia del docente es que **por las personas es por donde el sistema cae**: es lo que menos se controla, es por donde entra la ingeniería social, y en las grietas de los procesos se mete todo lo demás. En 10:15 un alumno (Nicolás) aporta a este punto y Ramele lo adopta.

---

## Saltzer y Schroeder, y la advertencia de atribución

La lámina de 12:33 dice tres cosas: los principios fueron propuestos en **1975** para el **diseño de sistemas operativos seguros**; demostraron aplicabilidad en diseños generales y en sistemas modernos; y hoy son la base de buenas prácticas y estrategias de gobierno **en todas las capas y para todos los actores** del sistema —procesos, personas, mecanismos y tecnología—. Ramele agrega que en esa época pesaba mucho la pata de métodos formales.

> [!quote]- Del video — la instrucción sobre los ocho principios (13:22)
> "Es algo que se tiene que grabar a fuego porque esto es lo más importante."

> **Ojo con la atribución.** Que los **ocho** principios de este deck sean de Saltzer y Schroeder 1975 es lo que dice la filmina, no algo verificado contra el paper. Al menos dos de los nombres de la lista —*defensa en profundidad* y *modelado de amenazas*— no figuran en la enumeración clásica de ese trabajo, y parecen agregados posteriores. ***(Lectura nuestra, sin verificar contra el original.)*** El docente no hace la distinción y agrupa todo bajo el mismo encabezado. Si el parcial pregunta "los principios de Saltzer y Schroeder", **la lista que corresponde repetir es la del deck**, no la del paper.

La lectura de cátedra que corresponde a esto es **Bishop, cap. 14 — Design Principles** → [[bibliografia#2. Matt Bishop — Computer Security: Art and Science|Bibliografía]]. El deck de 2024 la cita explícitamente (cap. 12-13); **este video no cita bibliografía en ningún momento**.

---

## 1. Menor privilegio

**Least privilege · 13:19-18:25.** La filmina: *se debe asegurar que los sujetos sólo tengan el acceso necesario para realizar su trabajo*. Ni un permiso más. Un alumno aporta **need to know** y Ramele lo adopta como sinónimo operativo.

El ejemplo es de la propia lámina y conviene saberlo entero porque es el molde de los demás:

> **Sistema con información financiera confidencial de clientes: ¿quién accede?**
> - La persona que **responde el teléfono y programa reuniones** probablemente no necesite acceder a toda la información confidencial.
> - El **administrador de cuentas** sí necesita acceder — pero la clave está en asegurarse de que **no tenga acceso a las cuentas que no administra**.

La segunda viñeta es el punto fino: menor privilegio no es sólo *quién*, es *hasta dónde dentro del mismo rol*. Ramele agrega por qué cuesta aplicarlo: **exige planificación**, saber de antemano exactamente qué va a hacer cada uno, y eso es caro. El chiste del `chmod 777` es el atajo contrario.

Dos aportes del curso en este tramo: un alumno cuenta que como pasante de ciberseguridad tenía acceso a **todos los datos médicos** de la empresa; y la digresión sobre la charla de la City University of Hong Kong (17:08), de donde sale la frase que Ramele repite después.

> [!quote]- Del video — sobre la charla de Hong Kong (16:47)
> "El presente y el futuro de la inteligencia artificial es la seguridad informática."

---

## 2. Fallar de forma segura

**Fail-safe defaults · 18:25-24:04.** El default es **no tener acceso a nada**. Las cuatro viñetas de la lámina:

1. Las listas de permitidos (**whitelists**) son mejores que las listas de excluidos (**blacklists**).
2. Un sistema **no abre puertos innecesariamente**.
3. **No hay cuentas de usuario por defecto** con una contraseña conocida.
4. Un sistema que presenta una falla en un proceso o control de seguridad **debe moverse a un estado seguro**.

Ejemplo de la lámina, en 23:00: *mi sistema de autenticación no se puede conectar a la base de datos para verificar un password* → **rechaza el pedido y no asigna permisos**, por más que sean los mínimos posibles. **Lo que se pierde es funcionalidad**, y ése es el tradeoff que se acepta a cambio de no degradar a un estado inseguro.

**Whitelisting contra blacklisting** (18:43) es la parte con más contenido propio: marcar quién tiene permiso es lo alineado con menor privilegio. El contraejemplo que elige es **Twitter**: antes funcionaba como whitelist —se veía sólo a quienes se seguía— y hoy funciona con lista de excluidos —los que cada uno bloquea—, y el cambio **no es por seguridad** sino porque el objetivo del producto es influenciar.

### La digresión de los HSMs

Entre 20:41 y 23:00 se va largo a los dispositivos criptográficos físicos, y es contenido que no está en ninguna otra parte del vault. Los tokens, cryptochips y **HSMs** que usan los bancos permiten **flashear la clave privada y después quedar sin acceso a ella**: si se quiere cifrar, hay que usar el propio dispositivo. Eso es **antitampering**. La norma de certificación tiene **niveles del uno al cuatro**, y el más alto exige que si explota una bomba al lado, o el dispositivo desaparece o **no queda ninguna forma de llegar a la clave**; una implementación posible es un detector de radiación que dispare la destrucción a propósito.

> **Hueco declarado.** El ASR transcribe consistentemente *"NIPS"* en todo este tramo, fusionando dos siglas. Casi con seguridad el docente arranca hablando del **NIST** como organismo de estándares y después pasa a la norma de niveles 1-4 para módulos criptográficos, que es **FIPS 140** — pero el audio no permite separarlas con certeza, así que acá va **sin sigla**. En 21:35 dice *"hardware security model"* y aclara que se llama *"HCM"*: lo correcto es **hardware security module, HSM**, y no se sabe si el error es del docente o del ASR.

Cierra con **fail safe contra fail deadly** (23:41): fail deadly es la variante extrema donde el sistema se destruye o se inutiliza ante la sospecha de compromiso. Cuál elegir **depende de la evaluación de riesgo**, que es lo que permite decidir pragmáticamente — a veces se pierde más dinero con el fail deadly que con lo que se está evitando. Es el mismo tipo de razonamiento que la nota de [[estado-de-un-criptosistema|Estado de un criptosistema]] hace para el bloque de cripto.

---

## 3. Simplicidad

**Economy of mechanism · 24:04-27:51.** Dos viñetas: evitar arquitecturas muy sofisticadas al desarrollar controles de seguridad, porque los sistemas muy complejos **aumentan el riesgo de errores y la dependencia de otros componentes** para aplicar el control. *Keep it simple stupid.*

La cadena que arma el docente es: más complejidad → más superficie de ataque y más difícil de entender del todo → más bugs → más vulnerabilidades explotables. Y admite que es **muy difícil** lograr algo simple que además funcione.

> [!quote]- Del video — complejidad contra seguridad (25:01)
> "Todo lo que tiene que ver con la complejidad es enemiga de la seguridad. Las cosas más simples en general son más seguras."

La tira cómica de la lámina es la broma exacta: alguien anuncia que simplificó el proceso a tres pasos, el otro grita *"Whaaat"*, en la segunda viñeta piden **más cajitas**, y en la tercera el diagrama está otra vez lleno de cajas con el comentario *"looks like we do more"*.

### Tuplas sujeto-acceso-objeto

Lámina de 26:42. La forma concreta de reducir superficie de ataque: **minimizar la cantidad de tuplas (sujeto, acceso, objeto)**. Cada uno de esos accesos es susceptible de ser explotado, así que menos accesos disponibles para un sujeto significa menos riesgo de un ataque efectivo. Incluye también reducir la complejidad de los datos. Los dos diagramas de la lámina muestran el mismo esquema con el sujeto siendo una persona en uno y **otro servidor** en el otro: la tupla no es sólo humana.

### Capas de superficie de ataque

Lámina de 26:58, cuadro *Attack Surface Layers*:

| Banda | Qué incluye |
|---|---|
| **Managed assets** | Endpoints, servers, networks, mobile, websites, IoT |
| **Unknown assets** | Shadow IT, cloud stores, test data, code repositories, unused credentials |
| **Nth-party assets** | Contractors, hosted data, javascripts, cloud services, APIs |
| **Ephemeral assets** | Virtual environments, development environments, short-lived cloud assets, BYOD |

El comentario que la acompaña: las organizaciones gigantes son tan caóticas que su única salida es **pensar en anillos** y apoyarse en el menor privilegio.

> **Lo que no se llegó a ver.** Entre 25:34 y 26:20 un alumno comparte algo por el chat y Ramele lo comenta (*"vamos a ver qué compartiste"*), pero en cámara sólo se ve el visor de PDF con la barra de miniaturas: **lo compartido nunca entra en pantalla**. Del audio se rescatan fragmentos sueltos —algo con *creating secure* y una mención a **sandboxing**— que no alcanzan para reconstruirlo.

---

## 4. Mediación completa

**Complete mediation · 27:51-29:17.** Es el tramo más corto y el más fácil de recordar, porque es literalmente **la puerta del castillo**: no tiene sentido construir el muro y dejar un costado abierto.

La lámina: *si hay un control, éste debe aplicar a **todas** las interacciones alcanzadas*. Y la lista de síntomas: **muestreo de algunas transacciones**, **controles al azar** y **entidades por fuera del control** son todos problemas potenciales.

Los dos diagramas triangulares con nodos X, Y y **Mediator** son la definición gráfica: en *Partial Mediation* hay tildes verdes en todos los caminos, incluido el directo entre X e Y; en *Complete Mediation* ese camino directo está **tachado con una cruz roja**. Todo pasa por el mediador o no hay mediación.

> [!quote]- Del video — cerrando el principio (29:04)
> "Por eso seguridad informática es muy difícil de hacerla bien. Muy, muy difícil."

---

## 5. Sistema abierto

**Open design · 29:17-36:55.** Es el principio que ya está desarrollado en el vault: → **[[principio-de-kerckhoffs|Principio de Kerckhoffs]]**. La lámina lo dice con las mismas palabras que la nota de concepto —*en los algoritmos de encripción lo que se guarda es la clave y se cambia frecuentemente; el algoritmo es público y conocido por todos*— y agrega la única extensión nueva: **el mismo concepto se aplica a los controles de seguridad**, no sólo a los algoritmos. Ésa es toda la teoría que el video suma por encima de la nota de concepto.

Lo que sí aporta son **tres matices que la nota de concepto no tiene**:

**Primero, la ofuscación no está prohibida, sólo no puede ser el cimiento.** Que no pueda basar la seguridad en la oscuridad no significa que tenga que publicarlo todo: la seguridad son **barreras acumuladas**, y una capa de ofuscación te compra tiempo. Por eso los militares mantienen ocultos sus algoritmos **sin dejar de cumplir el principio**: el diseño no depende de que estén ocultos, el ocultamiento es una capa más. La viñeta de xkcd del **code talker navajo** —cifran el flujo y después lo mandan por el code talker, y alguien pregunta si el tipo no está simplemente diciendo *cero* y *uno* en navajo— es el chiste sobre esa capa.

**Segundo, los bits son eternos** (31:09). Todo secreto conocido por al menos una persona puede terminar revelado, y si además está digitalizado, por más capas que le pongas **va a estar ahí para siempre**. La política que propone no es no digitalizar: es asumirlo y decidir con conciencia hasta qué grado se está expuesto.

> [!quote]- Del video — la regla mnemotécnica (31:12 y 31:47)
> "Los bits son eternos."
>
> "Cada vez que vos digitalizás algo, tu mamá lo puede ver."

**Tercero, open source y responsabilidad humana** (34:25). La ventaja del software abierto es el **escrutinio**: más ojos, menos bugs que deriven en vulnerabilidades explotables. Pero ese argumento **se debilita si los proyectos aceptan commits y actualizaciones automáticas de agentes**, porque el principio pedía que hubiera **un responsable humano que responda por lo que commitea**. Si el software se vuelve una caja negra que cualquiera puede afectar, el principio cae y se vuelve a la lógica noventosa de pagarle a una empresa para que se haga cargo. Es la misma discusión que ya está en [[eleccion-de-primitivas#El escrutinio ayuda, pero no es una garantía|Elección de primitivas § El escrutinio ayuda, pero no es una garantía]], llevada del código criptográfico al software en general.

> **Lo que no se llegó a ver.** Alrededor de 33:20-33:40 un alumno aporta por chat el ejemplo de los **code talkers navajo** y sólo se escucha la respuesta de Ramele; el mensaje original no entra en pantalla.

---

## 6. Segregación de tareas

**Separation of privilege · 36:55-42:44.** La lámina: *toda tarea crítica no debe quedar bajo el control de un sólo sujeto; más de un sujeto debe ser parte del proceso para asegurar que hay un control entre partes*.

La formulación que conviene retener, porque es lo que lo distingue de mediación completa: **la mediación se pide única, el privilegio de controlar esa mediación se pide separado**. Uno evita agujeros; el otro evita el punto único de falla y el abuso desde adentro.

**Control por oposición de intereses** (38:07) es la variante que la lámina desarrolla, con cinco subviñetas del caso del descuento de venta: las partes tienen **objetivos opuestos** y en el equilibrio se evita el abuso. El **vendedor** debe pedir aprobación del descuento y le conviene descontar mucho para asegurar la venta; el **financiero** que aprueba quiere descontar lo menos posible porque pierde plata.

Un alumno señala que este principio **contradice el de simplicidad** —dos aprobadores es más complejo que uno— y Ramele lo acepta de plano. Es la tensión más honesta del video y vale como pregunta de parcial: **los principios no son consistentes entre sí**, se balancean.

> [!quote]- Del video — sobre esa tensión (38:58)
> "Por eso seguridad es un quilombo."

### El impuesto holandés a los barcos

El ejemplo largo del tramo (39:08), y el más lindo del video:

> **Problema.** El gobierno holandés necesita cobrar un impuesto a los barcos que pasan, **proporcional al valor de la carga**, sin parar y revisar cada barco — porque eso no escala (la aduana como ejemplo de caos).
>
> **Solución.** Declaración más oposición de intereses. Se declara qué se lleva y cuánto vale, y se paga el impuesto proporcional a **esa declaración**; pero queda **la obligación de vender la carga a cualquiera que ofrezca el precio declarado**.
>
> **Por qué funciona.** Si se subdeclara para pagar menos, la compran barata. El interés propio hace de mecanismo de control, y el sistema **escala sin mediación completa**.

La aplicación directa que baja después: que **no sea el mismo** el que controla las claves de la base de datos y el sistema de pagos.

---

## 7. Mecanismos exclusivos y defensa en profundidad

**Defense-in-Depth · 42:44-51:24.** Es el tramo más largo de los ocho y **son dos principios metidos en uno**, cosa que la lámina no disimula:

1. **Evitar que distintos mecanismos compartan recursos, algoritmos y hardware.** Si algo se implementa para seguridad, tiene que ser **exclusivamente** para eso: sin reutilizar flags ni variables que representen otro concepto.
2. **Diseñar controles compensatorios, de mitigación o de reacción** que se accionen si otro control de seguridad falla o es superado.

### El flag de compras reusado para vouchers

El ejemplo central (43:20), desarrollado entero:

> **Situación.** Hay un flag que habilita a un cliente a realizar compras. Llega un requerimiento: los clientes que pueden comprar **también** deben poder recibir un voucher.
>
> **El atajo.** Reutilizar el flag existente, que ya está por todos lados controlando todo. Se resuelve en dos minutos.
>
> **Lo que asume.** Que la correlación entre *poder comprar* y *poder recibir voucher* se mantiene **para siempre**.
>
> **Cuándo explota.** Cuando la correlación se rompe. Para entonces el mismo flag ya representa dos cosas: en unos lugares aplica a compras y en otros a vouchers, el código quedó mezclado y el cambio posterior es muchísimo más caro que haber creado la abstracción a tiempo.

La frase que le pone Ramele es **"assume is as you and me"**, que usa como recordatorio del peligro de asumir. La moraleja es la del principio: si algo se implementa para seguridad, tiene que ser un mecanismo exclusivo para eso, **aunque hoy parezca equivalente a otro concepto**.

### El ejemplo de defensa en profundidad, planteado como preguntas

La lámina lo deja abierto (46:21): *se hace segregación de tareas y se aplican mínimos privilegios, pero una vulnerabilidad permite a un atacante llevar adelante una venta sin solicitar las respectivas autorizaciones*. Y pregunta tres cosas: **qué controles se agregan para monitorear esa situación**, **cómo se pueden crear alertas que bloqueen la transacción**, y **si se puede pedir una confirmación**. La idea es que los controles compensatorios se accionen cuando el primario **ya fue superado**.

### Pivoting no es side channel

Intercambio con un alumno en 48:12 donde Ramele separa dos cosas que se estaban mezclando, y la distinción sirve para la Clase 8 completa:

| | Qué es | Ejemplo del video |
|---|---|---|
| **Pivoting** | Conseguir un acceso chico y desde ahí moverse **lateralmente** a otro servidor o aplicación. Es lo que se busca en pen testing | (se retoma en la clase de pen testing) |
| **Side channel** | Explotar un canal **que no estaba previsto** | Filmar con una cámara un video protegido por DRM; inferir los bits que procesa una máquina midiendo cuánto gira el ventilador |

Cierra el tramo con dos anécdotas físicas: **la llave de una puerta que implícitamente daba acceso al servidor** —el mecanismo compartido otra vez—, y el **tailgating** con la caja pesada, que es la persona sosteniendo la puerta abierta como falla de mediación completa.

> [!quote]- Del video — el cierre del tramo (50:51)
> "Seguridad informática es paranoia controlada."

---

## 8. Menor asombro

**Psychological acceptability · 51:24-55:24.** La lámina:

- El **peor enemigo** de cualquier diseño de seguridad es el **usuario no alineado**.
- El **mejor aliado** es el **usuario comprometido** con la seguridad.
- Los controles deben ser **simples de usar e inclusivos**, incluso para una persona sin conocimientos técnicos, y **no deben complicar el negocio** ni sus procesos.
- La **concientización** del problema y del valor de la seguridad es fundamental para lograr la aceptación del control.

El meme de la lámina es Anakin y Padmé en cuatro paneles: *estamos actualizando nuestra política de passwords para requerir un mínimo de 12 caracteres* / *pero los resets van a ser sólo anuales, ¿no?* / silencio / *¿no?*. Es exactamente el tipo de política que discute [[ataque-de-diccionario-sobre-hashes#Contramedidas|Ataque de diccionario sobre hashes § Contramedidas]], y el chiste es sobre el lado del usuario que esa nota no cubre.

**La mejor idea del video está acá** (52:09), y no es de la filmina sino del docente: **los empleados más eficientes son los peores usuarios de seguridad**. Precisamente porque saben navegar la burocracia y encontrarle la vuelta, están entrenados en **saltear restricciones** — y una restricción de seguridad es una restricción más que les impide resolverle el problema al cliente. La respuesta que propone es capacitación y que entiendan que **sostener la seguridad es parte de su trabajo**.

> [!quote]- Del video — el corolario (52:40)
> "Los más eficientes son los peores usuarios de seguridad."

La anécdota que lo ilustra: el jefe de ambulancias que, después de dos meses de trabajo de seguridad, puso usuario `admin` y contraseña `admin`.

Y el cierre conceptual del bloque de principios, que es la parte más de ingeniería de toda la clase: **la seguridad es unbounded** (54:38). No tiene límite: se puede poner tanta como la paranoia dicte, hasta construir el sistema más seguro del universo que **no se va a usar nunca** porque es imposible de usar. Un buen esquema **no asume que la persona nunca va a saltear el control**: asume que lo va a hacer, y piensa cómo volverlo una **excepción controlada y consciente**. Ahí es donde entran la experiencia de usuario y el diseño centrado en personas.

> [!quote]- Del video — qué separa a un ingeniero (53:29 y 54:39)
> "Un puente lo puede construir cualquiera. Ahora, un buen puente, eso es lo que hace un ingeniero."
>
> "Seguridad es unbounded, no tiene límite. Ustedes pueden poner tanta seguridad como la paranoia les diga."

---

## Modelado de amenazas y el Threat Modeling Manifesto

**55:24-56:40.** Es la lámina que existe sólo en esta versión del deck. Ramele aclara de entrada que **es más una manera de pensar el problema que un principio**, y por eso va sin numerar.

La definición de la lámina, en cuatro viñetas:

1. Modelar las **amenazas al negocio** sobre la superficie de ataque: entender por dónde te pueden atacar y cuáles son los **vectores**.
2. Con el **modelo y la clasificación** de la amenaza se definen **contramedidas específicas** para ese tipo de ataque.
3. El modelo debe incluir **información de inteligencia, tendencias y ataques pasados**.
4. Es un **proceso continuo**, porque las amenazas cambian.

Encima del texto, el recuadro con los **Values del Threat Modeling Manifesto** (`threatmodelingmanifesto.org`), que son cinco pares del tipo *X sobre Y*:

- Una cultura de **encontrar y arreglar problemas de diseño** por sobre el cumplimiento de checklists.
- **Personas y colaboración** por sobre procesos, metodologías y herramientas.
- Un **recorrido de entendimiento** por sobre una foto de seguridad o privacidad.
- **Hacer** modelado de amenazas por sobre **hablar** de modelado de amenazas.
- **Refinamiento continuo** por sobre una entrega única.

Adelanta que **STRIDE** y la **matriz MITRE** se ven más adelante. En 56:39 pasa un segundo por la portada *Ejercicio del uso de estos principios* y vuelve: **esta lámina queda en pantalla durante todo el bloque final**.

---

## El bloque final: qué le pasa a los LLM

**56:40-1:02:35.** Casi seis minutos de pregunta abierta al curso, con la lámina de threat modeling de fondo: **¿cuál es el principal problema de seguridad de los LLM, y en qué principio de diseño encaja?** Es el tramo más actual del video y el que menos se parece a nada más del vault.

### Poisoning, en cuatro capas

**Joaquín** (58:21) propone *poisoning* y lo explica con el ejemplo de pagarle a alguien para que le repita a un chatbot que **dos más dos es cinco** hasta que lo incorpore. Ramele lo abre en capas (57:49):

| Capa | Por dónde entra el veneno |
|---|---|
| **Datos de entrenamiento** | Lo que se le da al modelo para entrenar |
| **Fine-tuning** | El ajuste posterior |
| **Pesos** | Directamente, si se tiene acceso a ellos |
| **URLs de contexto** | Las páginas que el modelo levanta para armar la respuesta |

El argumento de fondo: como el esquema es muy caótico y el entrenamiento está muy automatizado, **es difícil que alguien lo controle**, y todo eso queda adentro del motor. Otro alumno (**Ignacio**, 59:05) trae el caso del preprint con una **enfermedad ocular inventada**, donde los autores dejaron pistas deliberadamente obvias —un paciente llamado *Gandalf the Great*— y aun así el material fue absorbido.

El segundo ejemplo es **prompt injection**: poner instrucciones en **letra blanca** dentro de un perfil de LinkedIn para que las levante el modelo que lo lea.

### El diagnóstico de fondo, que es el que interesa para el parcial

**El canal por donde viajan los datos de control del sistema está mezclado con el canal de datos del usuario** (1:01:26). Son dos niveles distintos que van por el mismo lugar. Y eso, dice Ramele, **es la generalización de todos los problemas de inyección, SQL injection incluido**: lo ideal sería no mandarle el control por el mismo canal que la pregunta de la persona, sino tener otro canal, u otros niveles estructurados.

**El principio que se rompe es el 7, mecanismos exclusivos.** Ésa es la respuesta que la clase construye y la razón por la que el bloque está donde está.

> [!quote]- Del video — el veredicto (1:02:19)
> "Ese es un problemón del LLM que calza perfecto en estos diseños."

---

## El ejercicio que queda planteado

En los últimos veinte segundos Ramele adelanta el deck a toda velocidad y aparece, **sin un solo comentario**, la lámina *Caso Aplicación Web '90*. Es el ejercicio de aplicación de los ocho principios y arranca la clase siguiente. El enunciado, leído del frame en alta resolución:

> - Actualmente hay un **sistema de ventas** que corre en un servidor **Linux**.
> - Posee un **web server basado en PHP** que se conecta con una base de datos **Postgres** instalada **en el mismo servidor**.
> - La **autenticación y gestión de usuarios** la maneja una **API interna**, también instalada dentro del servidor, que usa la **misma base de datos y el mismo schema**, aunque con tablas dedicadas.
> - La base de datos tiene **un único schema y un solo usuario**.
> - **Todos los procesos corren como `root`.**

Es el mejor ejercicio de repaso que deja el video: cada viñeta viola por lo menos un principio de los ocho, y el enunciado está diseñado para que se identifiquen. **La resolución no está en este video** ni, hasta donde se sabe, en ningún otro de la playlist.

---

## Lo que este video no trae

Para no inflar la cobertura de la Clase 8:

- **Vulnerabilidades.** Prometidas en la portada, no dictadas. Ni taxonomía, ni OWASP, ni CWE, ni CVE, ni CVSS. Sólo menciones al pasar a SQL injection.
- **Bibliografía.** No cita a Bishop ni a ningún otro texto. El deck de 2024 sí remite a Bishop cap. 12-13.
- **Ejemplos técnicos duros.** El deck de 2024 tiene `sshd` y el puerto 22, el protocolo `finger`, Oracle, el UAC de Vista y el ataque a `xz`. Acá **no hay ninguno**: los ejemplos son organizacionales, físicos o de negocio.
- **Fórmulas.** Cero. No hay una sola línea de matemática en toda la hora — cosa que separa este bloque del de criptografía de punta a punta.
- **La resolución del Caso Aplicación Web '90.**

Cuando falta algo de esto, **la fuente es el video de 2024** ([`08hziQPewts`](https://www.youtube.com/watch?v=08hziQPewts), 1h 08), que es complementario y no reemplazante: los conjuntos de ejemplos están verificados como **disjuntos**.

---

## Huecos declarados y errores de ASR

**Sobre los frames.** La detección de escena encontró sólo 47 candidatos y 24 de ellos caen entre 1:02:36 y 1:02:52, que es el docente adelantando el deck, no láminas nuevas comentadas. Se compensó con 30 frames dirigidos a timestamps elegidos desde la transcripción, más cinco reextracciones a 1280px para leer los textos chicos. **Quedaron cubiertas todas las láminas distintas**; la única que aparece exclusivamente en el barrido final es *Caso Aplicación Web '90*, que se leyó entera en alta resolución.

**Lo que no se llegó a ver.** Dos momentos, los dos ya señalados arriba: lo que un alumno comparte por chat entre 25:34 y 26:20 (sólo se ve el visor de PDF), y el aporte de los code talkers navajo alrededor de 33:20-33:40 (sólo se oye la respuesta).

**Errores de ASR corregidos por contexto**, para que nadie los reencuentre y crea que son términos nuevos: *Salzer y Sher* → **Saltzer & Schroeder** (confirmado por filmina); *Kerkof / KCOF / K* → **Kerckhoffs**; *precios abiertos* → **sistemas abiertos**; *list privilege* → **least privilege**; *failly* → **fail deadly**; *N service* → **denial of service**; *bags / BS / BAGS* → **bugs**; *sboxing / unboxing* → **sandboxing**; *strike* → **STRIDE**; *arca* → **arXiv**; *perprint* → **preprint**; *leness / linness detection* → **liveness detection**; *Open SCL / Opencele* → **OpenSSL / open source**; *inscripción* → **encripción**.

**Lo que quedó dudoso y por eso no se afirma:**

- La sigla de la norma de niveles 1-4 para dispositivos criptográficos (20:41-22:08). Ver el hueco declarado en [[#2. Fallar de forma segura|2. Fallar de forma segura]].
- *"Hardware security model / HCM"* en 21:35 — lo correcto es **HSM**, pero no se sabe si el error es del docente o del ASR.
- El comentario de 19:54 sobre puertos *"mayores de 60, 100 o cento y pico"* está confuso en el audio **y en la propia formulación del docente**; el corte real de puertos privilegiados es **1024**, así que el dato no se da por bueno.
- En 53:51 dice que a un compañero *"le agarró un 5P"*: no se entiende qué palabra es y no se reconstruyó.

---

## Relevancia para el examen

**El docente no dice en ningún momento que algo entre o no entre en el parcial, ni pronuncia la palabra "parcial".** Lo más cerca que llega es en 13:22, al abrir la lista: dice que estos principios son muy conocidos en seguridad y que **es algo que se tiene que grabar a fuego porque es lo más importante**. Y repite dos veces que el objetivo de la materia es que los alumnos **generen intuición** sobre estos principios (06:28), que van a estar presentes todo el tiempo de una u otra manera.

Con eso:

- **Lo único con estructura de temario examinable son los ocho principios numerados**, con su nombre en castellano y en inglés. La lista que corresponde es la de **este** deck, no la del de 2024 (difieren en 5 de 8) ni la del paper original.
- **El ejercicio a preparar es el Caso Aplicación Web '90**, planteado acá y resuelto en la clase siguiente, que no está grabada.
- **Lo que se adelanta y no se ve**: modelos de seguridad con nombre y apellido, riesgo, pen testing y pivoting, STRIDE, la matriz MITRE, y vulnerabilidades tipo SQL injection.

***(Lectura nuestra.)*** La pregunta más probable de un parcial sobre este material no es "enumerar los ocho principios" sino "dado este sistema, qué principios viola y cómo se arregla" — que es literalmente la forma del ejercicio que el deck deja planteado, y también la forma del bloque de LLM, donde la respuesta buscada era **qué principio se rompe**.

---

## Ver también

- [[videografia#Los 13, con sus datos duros|Videografía]] — dónde está listado este video y su versión de 2024
- [[cronograma#Segunda mitad — Seguridad (hasta el 2do parcial)|Cronograma]] — la Clase 8 del 15/10, contra la que se ancla
- [[programa-y-objetivos#Contenidos|Programa y objetivos]] — *"Seguridad en aplicaciones · principios de diseño seguro"*, que es la línea que este video cubre
- [[bibliografia#2. Matt Bishop — Computer Security: Art and Science|Bibliografía]] — **Bishop cap. 14, Design Principles**, es la lectura de esta clase; el video no la cita, el de 2024 sí
- [[principio-de-kerckhoffs|Principio de Kerckhoffs]] — el principio 5 ya desarrollado; el video agrega la extensión a controles de seguridad y el matiz de la ofuscación como capa
- [[eleccion-de-primitivas#El escrutinio ayuda, pero no es una garantía|Elección de primitivas en un proyecto]] — la misma discusión sobre el escrutinio del código abierto, en el bloque de criptografía
- [[estado-de-un-criptosistema|Estado de un criptosistema]] — el razonamiento por evaluación de riesgo que aparece en fail safe contra fail deadly
- [[ataque-de-diccionario-sobre-hashes#Contramedidas|Ataque de diccionario sobre hashes]] — el lado técnico de la política de passwords de la que se ríe el meme del principio 8
- [[tp-implementacion|TP de Implementación]] — los ocho principios son el checklist más barato para revisar el diseño del TP antes de entregarlo
