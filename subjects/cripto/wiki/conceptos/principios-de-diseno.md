---
title: Principios de diseño
resumen: 'Los ocho criterios de Saltzer y Schroeder con los que se juzga si un sistema fue diseñado pensando en seguridad, presentados como casos particulares de dos ideas madre: simplicidad y restricción.'
fuentes: ["[[clase-08-principios-de-diseno-y-vulnerabilidades]]", "[[video-06-principios-de-diseno-2026]]", "[[video-07-principios-de-diseno-2024]]"]
aliases: [Los ocho principios de Saltzer y Schroeder, Simplicidad y restricción, Web server y menor privilegio, Fail-safe defaults, Idea madre de un principio de diseño]
type: concepto
unidad: 2
clase: 8
orden: 1
created: 2026-09-04
updated: 2026-09-06
tags: [seguridad, principios-de-diseno, saltzer-schroeder, kerckhoffs, defensa-en-profundidad, clase-08, sin-dictar]
sources: ["Clase 07 - Aplicaciones - Principios y autenticacion.pdf"]
---

# Principios de diseño

**Los ocho criterios con los que se juzga si un sistema fue diseñado pensando en seguridad, y por qué ninguno alcanza solo ni son consistentes entre sí.** Es la nota que da el vocabulario con el que el resto del Bloque 2 nombra un fallo de diseño: cuando el [[identificacion-de-vulnerabilidades|identificación de vulnerabilidades]] encuentra un hueco, casi siempre se lo puede describir como la violación de uno de estos ocho principios.

Cubre las filminas **2 a 15** del deck `Clase 07 - Aplicaciones - Principios y autenticacion.pdf` —las filminas 16-46, de autenticación, las desarrolla otra nota—. **Esta clase todavía no se dictó** (hoy es 04/09/2026, la clase es el 15/10), así que no hay transcripción propia: lo que sigue está escrito contra el PDF y contra dos grabaciones de cursadas anteriores sobre el mismo deck —[[video-06-principios-de-diseno-2026|video-06]] y [[video-07-principios-de-diseno-2024|video-07]]—, marcando siempre de cuál sale cada agregado.

> **Qué deck es el vigente, y por qué importa para estudiar.** Comparando el texto de las filminas 2 a 15 de este deck contra las tablas de nombres que traen las dos notas de video, **el deck de esta cursada (2026 2C) es textualmente el mismo que proyectó `video-07` en 2024**: mismos nombres en castellano (*Valores iniciales seguros*, *Economía de mecanismos*, *Diseño abierto*, *Separación de privilegios*, *Aceptación psicológica*), mismos ejemplos (`sshd` y el puerto 22, Oracle, el protocolo `finger`, los bancos y las dos firmas, los firewalls personales y `UAC`) y hasta la misma redacción literal de las viñetas.
>
> El deck de `video-06` (2026, primer cuatrimestre) es una versión **distinta**: cambia cinco de los ocho nombres (*Fallar de forma segura*, *Simplicidad*, *Sistema Abierto*, *Segregación de Tareas*, *Menor asombro*), trae otros ejemplos (el castillo medieval, el impuesto holandés a los barcos, los LLM, el *Threat Modeling Manifesto*) y no tiene bibliografía. *(Verificación nuestra, comparando el texto extraído del PDF contra las dos tablas de nombres de las notas de video.)*
>
> La consecuencia práctica: **la nomenclatura y los ejemplos que corresponde estudiar son los de este deck y los de `video-07`**, porque son los que se van a proyectar. Esta nota desarrolla el deck vigente y cita `video-06` sólo donde aporta algo que no está en ningún otro lado —la analogía del castillo, el impuesto holandés, el caso del flag reusado, la distinción pivoting/side-channel—, marcándolo siempre como material de otro deck. Queda afuera de esta nota, y vive únicamente en [[video-06-principios-de-diseno-2026#El bloque final: qué le pasa a los LLM|la nota de ese video]], su bloque final sobre seguridad de los LLM.

## Las dos ideas madre

La filmina 2 no da ocho principios sueltos: los presenta como **casos particulares de dos ideas**, y conviene tenerlo presente porque los ocho terminan reduciéndose a una combinación de las dos:

| Idea | Qué busca |
|---|---|
| **Simplicidad** | Menos cosas pueden salir mal; menos inconsistencias y zonas no definidas; más fácil de entender y de verificar |
| **Restricción** | Minimizar el acceso; minimizar la comunicación |

La cátedra los llama *"principios guía de alto nivel"*, no recetas cerradas — y esa frase importa porque, como se ve más abajo, dos de los ocho **se contradicen entre sí** y la propia cátedra lo acepta sin resolverlo.

| # | Principio | Idea madre dominante | Filmina(s) |
|---|---|---|---|
| 1 | Menor privilegio | Restricción | 3-4 |
| 2 | Valores iniciales seguros | Restricción | 5-6 |
| 3 | Economía de mecanismos | Simplicidad | 7-8 |
| 4 | Mediación completa | Restricción | 9 |
| 5 | Diseño abierto | — *(no depende de ocultar, no encaja en ninguna de las dos)* | 10 |
| 6 | Separación de privilegios | Restricción | 11-12 |
| 7 | Mecanismos exclusivos | Simplicidad + restricción | 13 |
| 8 | Aceptación psicológica | — *(condición de adopción, no de diseño técnico)* | 14-15 |

*(La columna de idea madre es lectura nuestra: la filmina no traza esta correspondencia explícitamente, aunque la deja sugerida en el orden de exposición.)*

## 1. Menor privilegio

*Filmina 3, ejemplo del CEO; filmina 4, ejemplo del web server.*

> Un sujeto debe recibir **sólo los privilegios necesarios** para completar su tarea. Los privilegios se asignan **por función, no por identidad**. Si una tarea requiere derechos adicionales, se le asignan y se desechan luego de su uso. **Muchas veces el sistema operativo o el sistema no posee el nivel de granularidad deseado.**

El ejemplo que da la propia filmina 3 es el CEO de una compañía: no tiene por qué tener acceso a todos los archivos confidenciales sólo por ser CEO — el privilegio se sigue de la tarea, no del cargo.

El ejemplo de la filmina 4 es el que rinde para un examen porque da una lista verificable:

| Un web server debería poder | Un web server NO debería poder |
|---|---|
| Leer las carpetas de archivos web | Leer otros archivos |
| Leer sus archivos de configuración | Escribir en otros lugares *(salvo upload o webdav)* |
| Escribir en sus carpetas de logs, sólo **append** | Sobreescribir logs |

La filmina remata con *"¿Alguien vio un web server configurado de esta manera?"* — la lámina sólo formula la pregunta y no la contesta. *(Lectura nuestra de la pregunta.)* Lo que la pregunta deja implícito es que casi ningún sistema real lo cumple al pie de la letra, y que el costo de no cumplirlo es que un compromiso parcial (un archivo leído, un directorio con permiso de más) se convierte en compromiso total.

**El límite práctico, que la filmina sólo enuncia y `video-07` desarrolla** (09:10): el sistema operativo **no siempre tiene la granularidad** que el principio pediría, y pedirla igual vuelve el esquema inadministrable — si hay que gestionar permiso por permiso a nivel de archivo, el costo operativo supera al riesgo evitado. El caso que trae `video-07` es **Apache**, que en una época reutilizaba las mismas *system calls* de logueo de Unix que procesos internos del sistema, permitiendo acceder a información de otros procesos — el mismo caso reaparece en el [[#7. Mecanismos exclusivos|principio 7]].

## 2. Valores iniciales seguros

*Filmina 5, `sshd`; filmina 6, Oracle.*

> El acceso a cualquier objeto debe ser **denegado por defecto**. Si una acción falla por seguridad, el sistema debe volver al estado de seguridad inicial.

El ejemplo de `sshd`: si falla al abrir el puerto 22, **no** debe abrir otro puerto ni elevar privilegios para reintentar — *"si lo hiciese, es probable que se pueda atacar el sistema"*. El de Oracle: las instalaciones antiguas creaban usuarios administrativos con claves predefinidas, algunas poco evidentes, y dejaban en manos del administrador cambiarlas; los instaladores actuales piden la clave en el momento de instalar.

Es la misma lógica que cierra el [[principio-de-kerckhoffs|principio de Kerckhoffs]] desde otro ángulo: la seguridad no puede depender de que alguien se acuerde de hacer algo después, tiene que quedar resuelta por default.

**Whitelisting contra blacklisting** (`video-06`, 18:43, deck distinto): marcar explícitamente quién tiene permiso está alineado con este principio; una lista de excluidos no. El contraejemplo que trae es **Twitter**, que pasó de whitelist —se veía sólo a quienes se seguía— a blacklist —los que se bloquean—, y el cambio no fue por seguridad sino porque al producto le conviene maximizar exposición.

**Fail-safe contra fail-deadly** (`video-06`, 23:41, deck distinto): la variante extrema es que el sistema se **destruya** o se inutilice ante la sospecha de compromiso — es el criterio de los **HSM** (*hardware security modules*) bancarios: se flashea la clave privada y después queda inaccesible salvo a través del propio dispositivo; en los niveles de certificación más altos, si el dispositivo detecta manipulación física se autodestruye antes que exponer la clave. Cuál de las dos variantes conviene depende de una evaluación de riesgo — el mismo tipo de razonamiento que hace [[estado-de-un-criptosistema|Estado de un criptosistema]] para decidir cuándo un esquema debilitado sigue siendo utilizable.

## 3. Economía de mecanismos

*Filmina 7; filmina 8, protocolo `finger`.*

> Los mecanismos de seguridad deben ser **simples**: menos cosas pueden salir mal, se simplifica la verificación (formal e informal), si algo sale mal es más fácil de corregir, y las relaciones de confianza —en entradas y salidas— son más visibles.

El ejemplo del protocolo `finger` es el más rico técnicamente de todo el bloque: un host podía pedir información de un usuario registrado en otro host, y muchas implementaciones **asumían que la respuesta del servidor estaba bien formada** — un supuesto escondido dentro de la propia complejidad del protocolo. Un servidor malicioso podía generar una respuesta infinita, con tres desenlaces: se llenan logs y disco (denegación de servicio), se cae el servicio (denegación de servicio), o **buffer overflow con ejecución remota de código**.

La cadena que arma `video-07` (15:35): más complejidad → más superficie de ataque y más difícil de entender por completo → más bugs → más vulnerabilidades explotables. Complejidad y confianza implícita terminan siendo el mismo problema — cuanta más superficie tiene un mecanismo, más lugares hay donde una asunción no verificada puede esconderse.

## 4. Mediación completa

*Filmina 9.*

> **Todos** los accesos a objetos deben ser verificados, incluso si el objeto es accedido varias veces. Puede ir en contra de la eficiencia —no permite usar cachés— y es complejo de implementar: ¿qué ocurre si mientras se está accediendo a un objeto le quitan el permiso a mitad de camino?

`video-06` (deck distinto) lo resume con la imagen más citable de todo el bloque: es literalmente **la puerta del castillo** — no tiene sentido construir todo el muro y dejar un costado sin control.

**La aclaración que más vale, y que sale de una pregunta de alumno en `video-07`** (23:13): mediación completa **no exige un único servidor, exige un único mecanismo**. Dos sectores de una organización con esquemas de administración de usuarios distintos, aunque compartan infraestructura, ya violan el principio — aunque cada sector individualmente medie completo sus propios accesos.

**La tensión con la robustez** (`video-07`, 19:16): a la pregunta de cómo se preservan los datos de un disco, la respuesta obvia es *backup* — y ahí aparece el choque: cada copia adicional da **robustez** pero abre **una oportunidad más de ataque**, aun cifrada. Se quiere simultáneamente no tener un único punto de falla y sí tener un único punto de control, y esos dos objetivos no siempre conviven fácil.

## 5. Diseño abierto

*Filmina 10.*

> La seguridad **no debe depender del secreto del diseño o la implementación**. No significa que deba publicarse el código fuente. Un atacante puede conseguir el algoritmo desensamblando el ejecutable, sobornando o coercionando a un desarrollador, o buscando en desechos. Esto **no aplica a las claves**, sino a los algoritmos. La violación del principio se denomina **"seguridad por oscuridad"**.

Es, textualmente, el **[[principio-de-kerckhoffs|principio de Kerckhoffs]]** ya desarrollado desde la Clase 1, extendido de los algoritmos criptográficos a los mecanismos de seguridad en general: lo que Kerckhoffs dice sobre un cifrado ("la seguridad recae en la clave, no en el algoritmo oculto"), este principio lo dice sobre cualquier control ("la seguridad recae en el diseño correcto, no en que el adversario no sepa cómo funciona"). `video-07` lo marca explícitamente como pregunta de examen en cursadas anteriores, con la fórmula *"lo único que tiene que estar oculto es la clave"*.

**Por qué es más difícil de sostener con apps móviles** (`video-07`, 29:14): con aplicaciones web puras se podía asumir que el atacante no llegaba al código del servidor. El código de un cliente móvil corre en un dispositivo que el atacante controla físicamente, así que hay que asumir que va a poder decompilarlo y modificarlo — en Android es relativamente fácil por cómo opera la máquina virtual; en iOS es algo más difícil por la compilación nativa. El código JavaScript de un cliente web es el caso trivial, siempre visible.

**El debate sobre open source y el caso `xz`** (`video-07`, 32:00-38:00, seis minutos de discusión abierta en clase): la posición a favor es que más ojos miran el código y encuentran más bugs antes; la posición en contra es que en código cerrado una vulnerabilidad puede durar años porque casi nadie mira, **pero eso también depende de quién la encuentre primero** en el caso abierto. El contraejemplo que cierra la discusión es el ataque a `xz`: alguien se ganó con el tiempo la confianza del mantenedor único de un paquete de compresión muy usado, y terminó insertando una puerta trasera — la conclusión que deja la cátedra es que el escrutinio del open source **es una suposición, no una garantía**, y sólo vale si esa comunidad activa efectivamente existe. Es el mismo argumento que desarrolla [[eleccion-de-primitivas#El escrutinio ayuda, pero no es una garantía|Elección de primitivas § El escrutinio ayuda, pero no es una garantía]] para primitivas criptográficas, trasladado del código de una función criptográfica al software en general.

`video-06` (deck distinto) agrega dos matices adicionales: la ofuscación **no está prohibida**, sólo no puede ser el cimiento — es una capa que compra tiempo, no una base—; y **"los bits son eternos"**: todo secreto digitalizado puede terminar filtrado, así que la política razonable es decidir con conciencia cuánta exposición se acepta, no evitar digitalizar.

## 6. Separación de privilegios

*Filmina 11; filmina 12, ejemplo bancario.*

> Un sistema no debe otorgar permisos basado en **una sola condición**. Se refiere a la asignación de permisos, y busca evitar que un sujeto pueda obtener privilegios y usarlos sin control. De ahí se derivan la **separación de tareas** y la **defensa en profundidad**.

El ejemplo de la filmina es doble: los bancos requieren **dos firmas** para aprobar transacciones electrónicas por sobre cierto monto, y algunos sistemas **no permiten que un administrador modifique los permisos de otro administrador** — el administrador es tope en cuanto a sus propios permisos, pero no puede tocar los de sus pares. `video-07` agrega el ejemplo más aplicable a desarrollo: quien administra el servidor de deploy o de staging no debería ser quien desarrolla, y quien desarrolla no debería administrar la base de datos de producción — con la salvedad, honesta, de que en una empresa chica esto casi nunca se cumple.

**El ejemplo largo, y el más ilustrativo de todo el bloque** (`video-06`, 39:08, deck distinto): el impuesto holandés a los barcos. El problema es cobrar un impuesto proporcional al valor de la carga sin parar y revisar cada barco, porque eso no escala. La solución: declaración más **oposición de intereses** — el capitán declara qué lleva y cuánto vale, paga el impuesto sobre esa declaración, pero queda **obligado a venderle la carga a cualquiera que ofrezca el precio declarado**. Si subdeclara para pagar menos impuesto, lo compran barato; el interés propio hace de control, y el sistema escala sin necesitar [[#4. Mediación completa|mediación completa]] sobre cada barco.

**La tensión con economía de mecanismos, aceptada sin resolver.** Un alumno le señala al docente, en `video-06`, que este principio **contradice directamente** el de [[#3. Economía de mecanismos|economía de mecanismos]] — pedir dos firmas es objetivamente más complejo que pedir una—, y la cátedra lo acepta de plano: **los ocho principios no son consistentes entre sí, se balancean caso por caso**. No hay una jerarquía que resuelva el conflicto de antemano; es la evidencia más clara de que la filmina 2 tenía razón al llamarlos *"principios guía"* y no reglas.

## 7. Mecanismos exclusivos

*Filmina 13.*

> Los mecanismos de seguridad **no deben compartirse**: puede fluir información entre variables compartidas, y pueden generarse canales ocultos. El principio promueve **aislación** — máquinas virtuales, *sandboxing*.

Es el principio que más conecta con el resto de la clase: un mecanismo de seguridad reutilizado para otra cosa es exactamente el tipo de hallazgo que busca la [[metodologia-de-hipotesis-de-falla|metodología de hipótesis de falla]] en el paso de recolección de información. `video-07` retoma acá el caso de Apache del [[#1. Menor privilegio|principio 1]] y suma el **sandbox de iOS**: el sistema operativo le presenta a cada proceso su propia versión del hardware y del entorno, y el área de archivos a la que accede es exclusiva de ese proceso — si se compromete, se compromete sólo eso, no el resto de las aplicaciones.

**El caso desarrollado entero** (`video-06`, 43:20, deck distinto, pero es el ejemplo más nítido de por qué este principio importa en la práctica de desarrollo): un flag habilita a un cliente a comprar; llega un requerimiento nuevo, que quien puede comprar también pueda recibir un voucher. El atajo es reutilizar el flag existente en vez de crear uno nuevo, asumiendo que la correlación entre *poder comprar* y *poder recibir voucher* se mantiene para siempre —así lo describe la nota de video, en su propia prosa y no como cita textual del docente. Cuando la correlación se rompe —hay clientes que compran pero no deberían recibir voucher, o viceversa— el flag ya representa dos cosas a la vez, el código quedó mezclado entre los dos usos, y corregirlo después es mucho más caro que haber creado la abstracción exclusiva desde el principio. Es la misma lógica, en código de aplicación, que el caso de Apache en infraestructura.

**Defensa en profundidad, la segunda mitad del principio** que la filmina de teoría no separa explícitamente pero que `video-06` sí distingue: además de no compartir mecanismos, hay que **diseñar controles compensatorios** que se activen cuando el control primario ya fue superado — no basta con el mecanismo exclusivo, hace falta un plan para cuando falla.

## 8. Aceptación psicológica

*Filmina 14; filmina 15, firewalls personales y Windows Vista `UAC`.*

> Los mecanismos de seguridad **no deben dificultar el acceso al recurso**. Esto en general es muy difícil o imposible de lograr sin ocultar el mecanismo: hay que simplificar instalación y configuración, y evitar la necesidad de conocimientos técnicos.

El ejemplo es doble: los **firewalls personales**, que exigen que el usuario identifique redes como internas o externas y decida cuándo una aplicación puede actuar como servidor —decisiones para las que la mayoría de los usuarios no está técnicamente preparada—, y **Windows Vista `UAC`**, donde cada operación privilegiada mostraba una ventana pidiendo autorización explícita. `video-07` agrega el contexto histórico: antes de Vista, Windows tenía un historial de seguridad débil por estrategia de negocio y *time to market* —los componentes `COM` y `ActiveX` se instalaban solos, con acceso total al sistema, por el sólo hecho de visitar una página web—, y Vista **sobrecorrigió** hasta volverse tedioso de usar. Es el caso de manual del principio: un mecanismo técnicamente correcto que fracasa por rechazo del usuario.

**La observación más citable del bloque** (`video-06`, deck distinto, pero directamente aplicable): **los empleados más eficientes suelen ser los peores usuarios de seguridad**, precisamente porque son los que mejor saben moverse por la burocracia interna y encontrarle la vuelta a cualquier restricción que les estorbe para resolverle el problema al cliente. La respuesta no es bajar la seguridad: es capacitar y transmitir que sostenerla es parte del trabajo de todos.

**El corolario que cierra el bloque de principios en `video-06`**: la seguridad es *unbounded* — no tiene límite, se le puede agregar controles indefinidamente hasta construir el sistema más seguro del universo, que **no se va a usar nunca** porque es imposible de operar. Un buen diseño no asume que el usuario nunca va a saltear el control: asume que lo va a hacer, y trata de convertirlo en una excepción **controlada y consciente**. Es la misma idea, aplicada a control de acceso, que [[seguridad-computacional|Seguridad computacional]] aplica al largo de clave: el nivel de seguridad es una decisión de diseño con un costo, no un máximo a perseguir.

## Por qué conviene memorizarlos como criterio de diagnóstico, no como lista

Los ocho principios rara vez se preguntan como *"enumerar los ocho"*: `video-06` deja planteado, sin resolver, un ejercicio del tipo *"dado este sistema, qué principios viola y cómo se arregla"*, que es la forma más probable de pregunta de examen según esa nota de video —la propia nota de video rotula esa previsión como lectura suya, no como algo dicho en clase. Es también la forma en que opera el resto de la Clase 8: cuando la [[identificacion-de-vulnerabilidades|identificación de vulnerabilidades]] encuentra un bug explotable, casi siempre se lo puede describir retrospectivamente como la violación de uno o más de estos ocho — un flag reusado es una violación de mecanismos exclusivos; un default abierto es una violación de valores iniciales seguros; una UI que nadie entiende es una violación de aceptación psicológica.
