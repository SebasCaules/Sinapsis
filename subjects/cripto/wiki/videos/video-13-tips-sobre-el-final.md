---
title: Video 13 — Tips sobre el final
resumen: 'Clase grabada de Lautaro Pinilla sobre cómo se responde el ejercicio de hipótesis de falla del examen final: cinco errores comunes y un enunciado resuelto, sin tocar criptografía.'
fuentes: ["[[videografia]]", "[[reglamento-y-evaluacion]]", "[[video-09-pentesting-metodologia]]", "[[video-10-pentesting-laboratorio]]"]
aliases: [Video 13, Tips sobre el final, Tips Generales sobre el Final, Errores comunes del final, Ejercicio de final de microcréditos, DummyPay]
type: video
clase: catedra
orden: 8
video: 13
youtube: 6rhEdPeqXcs
created: 2026-09-03
updated: 2026-09-04
tags: [video, final, examen, pentest, seguridad-en-aplicaciones, vulnerabilidades, broken-access-control, broken-authentication, csrf, replay-attack, iso-27001, red-team, blue-team, hipotesis-de-falla, pinilla, clase-08]
sources: ["https://www.youtube.com/watch?v=6rhEdPeqXcs"]
---

# Video 13 — Tips sobre el final

> **2:56:06** · Subido el **02/07/2024** · **Ing. Lautaro Pinilla** (no Ramele) · **Oculto** (no listado, sólo por link) · **No cuelga de ninguna fila del [[cronograma]]**: corresponde al **examen final** escrito e integrador del [[reglamento-y-evaluacion#Final|reglamento]] · Clase en vivo por Blackboard Collaborate, **dictada en 2021** · Título literal en YouTube: *Criptografía y Seguridad Informática - Tips Generales sobre el Final* · [Ver el video](https://www.youtube.com/watch?v=6rhEdPeqXcs)

**Conviene ver el video completo si se va a rendir el final**, porque es el único lugar del corpus donde alguien de la cátedra explica cómo se responde un ejercicio de final, enumera cinco errores concretos que vio en resoluciones reales y resuelve un enunciado completo con el curso; **no hace falta verlo** si lo que se busca es un repaso integrador de la materia, porque **en las tres horas no se toca criptografía ni una sola vez**.

---

## Lo primero: el título miente, y en la dirección que más duele

*Tips Generales sobre el Final* y el hecho de que el final sea "escrito e integrador" inducen a esperar un repaso de las once clases. **No lo es.** En 2:56:06 no aparecen `DES`, `AES`, RSA, Diffie-Hellman, funciones de hash, firma digital ni secret sharing. El video es **exclusivamente** sobre la unidad de seguridad de aplicaciones y pentesting, porque de ahí sale **un** ejercicio del final, y a explicar cómo se responde **ese** ejercicio viene el docente.

Conviene tomarlo entonces como *tips sobre cómo se responde el ejercicio de hipótesis de falla*, no como repaso de la materia. El propio docente acota el universo, y esto sí es instrucción explícita de qué entra:

> [!quote]- Del video — el alcance de los temas del final (2:33:25)
> "Ojo, no se encierren solamente en esto, porque puede haber ejercicios en el final que sean de protocolos, de aplicación móvil o de embebidos."

Y en la diapositiva de Error 1 el tráfico serial por USB aparece como caso legítimo de uso de `Wireshark` justamente por lo mismo:

> [!quote]- Del video — aviso sobre embebidos, en la lámina de Error 1 (1:29:26)
> "Tráfico serial: en el final pueden tocar algo embebido."

### Quién habla, y cuánto vale lo que dice

**No es Rodrigo Ramele.** La descripción de YouTube dice literal: *"Tips generales sobre el final de la materia. **Por el Ing. Lautaro Pinilla**"*. Es el mismo docente y el mismo día de subida que el [[video-10-pentesting-laboratorio|Video 10 — Pentesting: laboratorio]] (2h 22, también de Pinilla): los dos se subieron con un minuto de diferencia. Son dos clases de un ayudante subidas al canal de Ramele. La [[videografia#Quién dicta qué|Videografía]] ya lo registra.

Esto importa para calibrar cuánto pesa cada afirmación, porque **el docente se descalifica a sí mismo tres veces**:

- En **01:00** abre diciendo que la información la sacó de YouTube, de Google y de algún conocido, que **él no trabaja en esa área** y que puede estar equivocado.
- En **1:38:45**, contando el ataque de red gemela, aclara que la parte de protocolos `WPA`/`WPA2` **la tiene floja** y que lo tomen con pinzas.
- En **28:47**, con el caso del DNI virtual argentino, dice que lo cuenta **a grandes rasgos** y que habría que investigarlo.

**Es material de repaso hecho por un ayudante, no doctrina de cátedra.** Lo que sí es doctrina, y hay que tratar como tal, es lo que dice sobre **cómo se corrige el ejercicio**: eso lo dice con autoridad, salió de leer resoluciones reales, y el ejercicio que trae se lo dio Pablo.

### Es de 2021, no de 2024

La pestaña del navegador en pantalla dice **"(2021 ...) 72.44"**. Lo seguro es el año: **2021**. **El cuatrimestre no se lee con confianza** a la resolución disponible —una lectura lo da como 1Q y otra como 2Q—, así que la nota no lo afirma. La fecha de subida es **tres años posterior al dictado**.

Y hay una prueba independiente que lo refuerza: el Video 10, del mismo docente y subido el mismo día, muestra en pantalla archivos con fecha de modificación **`2021-06-17 16:57`**. La [[videografia#La fecha de subida no dice cuándo se dictó|Videografía]] desarrolla por qué la fecha de subida no sirve como proxy del dictado en ninguno de los 13.

> **Sobre la fecha de subida.** Acá va **02/07/2024**, hora argentina, que es la que usa la Videografía. La metadata cruda del archivo, en UTC, dice `2024-07-03`. Es la misma subida.

### Es clase en vivo, con el curso adentro

Sesión de **Blackboard Collaborate** con panel de chat visible, alumnos identificados con nombre y apellido escribiendo mientras habla, y el aviso en pantalla de que *"Se están grabando los mensajes de este chat"*. En **00:24** dice que no tiene el chat abierto justo en ese momento; en **1:59:31** arranca con *"¿están todos listos?"*; en **2:50:20** pide que le pongan dos puntos en el chat. Hay recreo negociado, problemas de audio y micrófono, y buena parte de la última hora es ida y vuelta con alumnos.

Consecuencia práctica: **los micrófonos de los alumnos están flojos y muchas de sus intervenciones quedaron cortadas o inaudibles**. Todo lo que esta nota reporta de la resolución del ejercicio está reconstruido sobre todo desde **lo que responde el docente**, no desde lo que proponen los alumnos.

---

## Recorrido

| Tramo | Tema | Qué hay ahí |
|---|---|---|
| 00:00-01:57 | Apertura y agenda | Chequeo de grabación; anuncia vulnerabilidades, testeo web, mobile y de APIs, y teoría de pentest. **Disclaimer de que puede estar equivocado.** |
| 01:57-07:10 | Cómo se contrata un pentest | Startup chica contra corporación; scope, duración, reporte |
| 07:10-12:30 | Blue, Red y Purple Team, pivoting, escalamiento | Los sombreros; lateral contra vertical |
| 12:30-17:15 | **Lluvia de vulnerabilidades en el pizarrón** | La lista completa. **Acá está el aviso de parcial de 15:50** |
| 17:15-22:00 | XSS, SQLi y CSRF | El ejemplo del home banking, desarrollado |
| 22:00-25:30 | ISO 27000/27001, la tríada, MITM, Replay | Confidencialidad, disponibilidad, integridad como guía de impacto |
| 25:30-32:00 | **Broken Authentication contra Broken Access Control** | User enumeration; IDOR; roles. El punto que marca para el parcial |
| 32:00-33:30 | Herramientas: ZAP y Wireshark | Anuncia que `ZAP` se ve en la práctica del lunes siguiente |
| 33:30-45:00 | **Setup para testear una app mobile** | Los cuatro caminos, con diagrama de red |
| 45:00-49:00 | Testeo de API y el límite de Wireshark con HTTPS | Adelanta el Error 1 |
| 49:00-56:00 | Descubrimiento de endpoints y disclaimer legal | `dirsearch`, `gobuster`, parsear el `main.js` |
| 56:00-59:20 | Repaso y pregunta abierta | Deja picando si descubrir la IP de la API es reportable |
| 59:20-1:09:20 | **Recreo** | Sólo el cartel *MEDIALUNAS BREAK*. **Sin contenido.** |
| 1:09:20-1:16:00 | Normas como punto de venta, cadena de confianza | El auditor, el sello, el eslabón más débil |
| 1:16:00-1:23:00 | Trusting Trust, hardware, pendrive que emula teclado | Digresión. **Audio dañado entre 1:16 y 1:22** |
| 1:23:00-1:26:45 | **Por qué existe esta clase** | Buscó resoluciones en internet y encontró errores en común |
| **1:26:45-1:46:00** | **Presentación: los cinco errores comunes del final** | **El tramo más valioso del video** |
| 1:46:00-1:52:00 | Timestamp contra nonce, ventana de tiempo, firewall | Discusión con la clase sobre defensas contra replay |
| 1:52:00-2:02:00 | Green Team, ley de datos personales, bug bounty | El sombrero legal; el código penal; el caso PlayStation |
| **2:02:00-2:16:00** | **El enunciado del final y el método de resolución** | Consigna textual, resaltado del enunciado, modelo de negocio |
| **2:16:00-2:50:00** | **Resolución en vivo con los alumnos** | Hipótesis, aceptadas y rechazadas, con el criterio de cada una |
| **2:50:00-2:56:06** | **Errores típicos de este ejercicio y respuestas válidas** | Sin diapositiva; reconstruido sólo del audio |

---

## Los cinco errores comunes del final

Ésta es la razón por la que existe la clase. En **1:23:00-1:26:45** cuenta que buscó en internet resoluciones de estos ejercicios hechas por compañeros y ex alumnos, que algunas cosas estaban mal y otras eran debatibles, **pero que había un par de errores en común**. De ahí sale la presentación —hecha con slides renderizadas en texto en una terminal, `present presentacion.md`— y de ahí sale también la advertencia de arranque:

> [!quote]- Del video — sobre de dónde se estudia (1:26:08)
> "Ojo dónde estudian. Todo es confianza: ¿a quién le confiás tu solución de parcial?"

La primera lámina fija **los tres criterios por los que algo cuenta como error**, y conviene tenerlos a mano porque son el rasero con el que corrige todo lo que viene después (**1:27:10**):

1. **No es un uso adecuado** de la herramienta o del concepto.
2. **No es viable** el camino que propone para testear.
3. **No está bien aplicado** el concepto.

### Error 1 — Basta de Wireshark

Título literal de la lámina (**1:27:55**): *"Basta de Wireshark (excepto para cuando sí se usa)"*. La lámina muestra tres pares de consigna y respuesta de alumno donde ante *"Dada la página https://…"*, *"¿Cómo harías Man in The Middle?"* y hasta *"¿Cómo aprobarías el parcial?"*, la respuesta siempre empieza igual: **"Abro Wireshark y…"**.

El error de fondo es de concepto, no de gusto: **si la conexión va cifrada de punta a punta, lo que se captura en el medio es ruido cifrado, no `admin`/`admin` en texto plano**. Ya lo había adelantado en **49:11**, cuando escribió `HTTP` y `HTTPS` enfrentados en el pizarrón.

La segunda parte de la lámina (**1:29:40**) da la contracara, que es lo que hay que saber responder: **`Wireshark` sirve cuando se quiere CAPTURAR tráfico**, ya sea para usarlo después o para explotar información ya capturada. Tres casos legítimos:

| Caso | Por qué sirve |
|---|---|
| Tráfico `HTTP`, sin la S | Va en claro |
| `HTTPS` pero con `TLS` v1 | Versión vieja y rota |
| Tráfico serial, por ejemplo `USB` | Y acá avisa que **en el final pueden tocar algo embebido** |

### Error 2 — Proponer DoS o buffer overflow como prueba

Dos respuestas que marca como mal (**1:31:25**): mandar requests con parámetros gigantes para ver si hay buffer overflow, y mandar muchos requests y tomar un `500` como prueba de la vulnerabilidad.

> [!quote]- Del video — por qué no se testean los DoS (1:31:25)
> "Los DOS no se testean porque, de ser exitosos, tiran abajo la página."

El razonamiento completo: **un pentest tiene que ser lo menos intrusivo posible**, porque el que paga es el cliente cuya página estarías tirando abajo. Y un `500` no prueba nada, porque el sistema puede tardar un momento y volver a levantarse. Lo que sí sirve para el mismo objetivo es **detectar por escaneo que la versión del software es vieja y vulnerable**.

> **Errata de la filmina:** la última línea de esta lámina se corta fuera del borde derecho. Se lee *"Esto no significa nada porque puede que el sistema tarde un momento y vuelva a levantarse (además de que el error correcto s"* y ahí termina. No es un defecto de la captura: la imagen re-extraída a mayor resolución sigue cortada. El audio sugiere que continúa diciendo que el `500` es un error interno y no el que correspondería, **pero eso no se puede dar por textual**.

### Error 3 — Demasiada generosidad

Título literal de la lámina (**1:33:40**). Dos formas: pedirle al cliente que haga **un deploy aparte** para poder testear, y **asumir que ya se tiene una cuenta cargada** en la plataforma.

> [!quote]- Del video — sobre pedirle recursos al cliente (1:33:40)
> "El cliente no debería asignarnos recursos extra para que nosotros hagamos nuestro trabajo."

Lo segundo lo marca él mismo como **debatible**: depende del scope, de si el ataque es externo o interno, y de si se arranca con información nula, parcial o completa. Los pentests no suelen ser a caja negra. **Lo que no se perdona no es asumir, es asumir en silencio**: hay que aclararlo en la respuesta o preguntarlo.

### Error 4 — Ataques poco viables

La lámina (**1:36:10**) es sobre leaks de información de una app mobile hacia la caché. Dos respuestas que no van:

- *"Hago que el usuario se loguee y después se deslogueé con otra cuenta"* — **no es viable**: no se le puede pedir eso a la víctima.
- *"Me cuelgo al WiFi de la víctima"* — es posible, pero **está sin detallar**, y sin el cómo no es una respuesta.

Aprovecha para contar el ataque bien, que es lo que la respuesta tendría que haber dicho: el celular busca siempre la red conocida con más señal, así que **se levanta un access point con el mismo nombre y mucha más potencia, se mandan paquetes de desautenticación para que el equipo se caiga, y en la reconexión el cliente manda las credenciales al access point falso**.

> Sobre este ataque él mismo pide pinzas: dice que la parte de protocolos `WPA`/`WPA2` la tiene floja. Y repite el disclaimer legal: sólo sobre redes propias.

### Error 5 — Mal entendimiento de los ataques

El más importante de los cinco, y el que resume a los otros cuatro. Las dos citas que pone como ejemplo de respuesta vacía (**1:43:10**) son *"hago un replay attack…"* y *"CSRF usando una cookie"*, **sin explicar cómo, qué se envía, a quién y por qué**.

> [!quote]- Del video — el cierre de la lámina de Error 5 (1:43:10)
> "La idea puede ser buena pero sin fundamento no tiene nada que la sostenga."

Y el corolario, que dice apuntando a los alumnos que tiran nombres de ataque para llenar (**1:48:00**):

> [!quote]- Del video — sobre tirar ataques sin fundamento (1:48:00)
> "Ojo, no se hagan los capos de que saben. Si querés bailar, bailamos."

En su versión desarrollada: **si el fundamento está bien, se discute; si lo tiraste por tirar, se desarma solo.**

### Notas extra

Última diapositiva de la presentación (**1:44:10**), tres datos duros sueltos:

1. **`TLS` 1.0 es una versión vieja y vulnerable.**
2. **Se puede usar un timestamp para evitar replay**, evaluando caso a caso.
3. **Si no se quiere que la API reciba tráfico `HTTP`, simplemente se rechaza** — con redirect o con regla de firewall del lado del servidor.

El punto 3 lo desarrolla después (**1:46:00-1:52:00**) en la moraleja que importa para el examen: **no des por sentado que el otro lado no se defiende**. Un firewall es una tabla de reglas: si alguien se conecta a un servidor web por `FTP` en el puerto 21, la conexión se corta.

El punto 2 lo discute con la clase y ahí está el matiz que conviene saber: **el timestamp te da de dónde agarrarte, pero el nonce exige que emisor y receptor estén coordinados generando el mismo número**. Trae el ejemplo de los tokens físicos de banco con ventana de tiempo y qué pasa cuando alguien aprieta diez veces, el dispositivo se desincroniza y hay que llevarlo a resetear. El vault ya tiene la parte criptográfica de esto en [[cifrado-probabilistico-nonce-e-iv#Nonce e IV no son exactamente lo mismo|Cifrado probabilístico, nonce e IV]]; lo que agrega el video es el costo operativo de la sincronización.

---

## El aviso de parcial que hay que rescatar entero

En **15:50**, mientras anota `Broken Access Control` en el pizarrón, suelta la única instrucción explícita de parcial de todo el video, y es la señal más fuerte de todo el corpus de que el tema se evalúa:

> [!quote]- Del video — el aviso sobre autenticación y control de acceso (15:50)
> "Broken access control — ojo en el parcial con autenticación versus control de acceso."

La distinción, tal como la desarrolla en **25:30-32:00**:

| | Autenticación | Control de acceso |
|---|---|---|
| Qué verifica | **Que la persona es quien dice ser** | **Qué se puede tocar una vez adentro** |
| Cuándo falla | Se puede bypassear el login, se aceptan contraseñas débiles, no hay bloqueo por intentos fallidos, hay user enumeration | Se entró legítimamente y se accede a recursos que no corresponden |
| Nombre del hallazgo | `Broken Authentication` | `Broken Access Control` |

**Y esto es lo incómodo:** **no existe ninguna clase grabada de autenticación ni de control de acceso** en toda la playlist. Son [[videografia#Los cuatro huecos del Bloque 2|dos de los cuatro huecos del Bloque 2]]: la Clase 7 — Autenticación no tiene video, y la de control de acceso tampoco, porque en el Video 07 un alumno confirma que ese tema lo da Pablo y que se corrió a dos clases posteriores que no se grabaron. O sea: **el único lugar del corpus que te avisa que el tema entra es también la prueba de que no hay grabación que lo explique.** Para eso hay que ir al PDF de cátedra o a [[bibliografia#2. Matt Bishop — Computer Security: Art and Science|Bishop]].

---

## La taxonomía de vulnerabilidades

Este es el segundo motivo por el que la nota vale: **es el único lugar de todo el corpus donde aparece la taxonomía aplicada de vulnerabilidades**. El [[video-08-vulnerabilidades|Video 08 — Vulnerabilidades]], que es el que le corresponde a la Clase 8, **no trae OWASP Top 10 ni CWE ni CVE ni CVSS**. Acá, entre **12:30 y 30:47**, el docente le pide a la clase que tire vulnerabilidades web y las va anotando en el pizarrón. La lista resultante **funciona como temario de esa parte del final**:

| Vulnerabilidad | Qué es, según el video | Timestamp |
|---|---|---|
| `XSS` | Inyectar código en un input. Lo pasa rápido | 17:15 |
| `SQL injection` | Idem, lo pasa rápido | 17:15 |
| `CSRF` | Lograr que el usuario ejecute una acción no intencionada. Desarrollado abajo | 18:53 |
| `DoS` | Pega en **disponibilidad** de la tríada | 22:24 |
| `MITM` con impersonating | Meterse en el medio de una conexión y modificar | 23:50 |
| `Replay Attack` | Reenviar una acción ya ocurrida para obtener el mismo resultado | 24:24 |
| `Broken Authentication` | Ver la tabla de arriba | 26:00 |
| `Broken Access Control` | Ver la tabla de arriba | 28:47 |
| `Sensitive Data Exposure` | Es la respuesta a su propia pregunta abierta de 56:00 | 56:00 |

### La tríada, como guía de impacto

En **22:24** mete la familia **ISO 27000** y en particular la **ISO 27001**, que es la de seguridad de la información: estandariza procesos y políticas, con reglas que llegan hasta el tamaño del papel picado al destruir un archivo clasificado. Pide que sepan al menos el nombre y que la busquen.

Lo que sí usa como herramienta durante toda la clase son **los tres parámetros que hay que mantener**: **confidencialidad, disponibilidad e integridad**. Le sirven para clasificar el impacto de cada ataque (el `DoS` pega en disponibilidad). Y en **1:09:20** explica por qué una empresa se certifica: viene un auditor, chequea que efectivamente lo hagas, te da el sello, **y eso funciona como argumento de venta frente a la competencia**.

### CSRF, con el ejemplo del home banking

El único ataque de la lista que desarrolla entero (**18:53**), y por eso vale reproducirlo completo:

- La víctima está operando en la bolsa **con el home banking abierto** en otra pestaña.
- El atacante le ofrece **una página gratis de gráficos en tiempo real**.
- Adentro de esa página hay un link que en realidad es **un `POST` de transferencia contra el banco**.
- La víctima aprieta un botón cualquiera y, **como las cookies de sesión ya están guardadas, la transferencia sale**.

**La defensa que menciona:** exigir **un estado previo**, un token que sólo se consigue **navegando el flujo normal** de la aplicación —entrar a transferencias, pasar los niveles—, de modo que un request suelto disparado desde afuera no alcance.

### IDOR, con el ejemplo del identificador incrementable

Escrito en el pizarrón en **28:47**: al abrir el perfil propio en una red social se ve pasar `GET /users?id=33`. **33 es tu ID.** Se prueba cambiarlo por **32** y ver si el servidor devuelve los datos de otro usuario, cosa que no debería.

> Menciona que hubo un problema de ese estilo con la idea de virtualizar el DNI en Argentina, donde **a grandes rasgos** se cambiaba el número de documento y salían los datos de otra persona. **Él mismo aclara que habría que investigarlo más**, así que la anécdota no se toma como dato.

La otra cara de `Broken Access Control`, que es la que más se olvida: **no robar un rol, sino usar el rol propio para acceder a recursos que no le corresponden**.

### User enumeration

Anotado en el pizarrón como **paso previo a la fuerza bruta** (**28:14**): si el sistema **responde distinto** cuando el usuario no existe que cuando existe pero la contraseña está mal, con eso **se arma la lista de usuarios válidos** y recién después se les hace fuerza bruta. El vault ya tiene el costado criptográfico del segundo paso en [[ataque-de-fuerza-bruta|Ataque de fuerza bruta]] y las contramedidas de contraseñas en [[ataque-de-diccionario-sobre-hashes#Contramedidas|Ataque de diccionario sobre hashes]]; lo que agrega el video es **el paso de reconocimiento que los precede**.

---

## El ejercicio de final, resuelto

Casi 55 minutos (**2:02:00-2:56:06**) resolviendo en vivo un ejercicio de final **real, provisto por Pablo**. Es lo más parecido a un examen resuelto que hay en el corpus.

### La consigna, textual

Leída de la pantalla, donde el enunciado está abierto en `nvim`:

> **"Ante un pedido de realizar un pentest que abarque la app, establecer 4 hipótesis de falla pertinentes para el caso, basadas en problemas de seguridad en aplicaciones. Explicar para cada una, cómo probaría según la metodología. (4 puntos, 1 pto cada uno)"**

### El enunciado

Empresa de **microcréditos** con **aplicación nativa mobile**. Los datos que el docente resalta en verde en pantalla (**2:20:24**) son los que despiertan cada hipótesis:

- La app se comunica con el servidor por **una API REST propietaria correctamente protegida**.
- El usuario **se registra con email y contraseña**.
- **Sin autenticarse**, se ve un resumen de la cantidad de créditos otorgados, la tasa promedio y **las últimas 10 operaciones** (tipo, monto y condiciones — **no a quién**).
- Para invertir hay que **registrar los datos** de la tarjeta o cuenta bancaria.
- Ingresos y salidas los gestiona **DummyPay**, un proveedor de pagos externo que **se hace cargo del fraude**, y **la app ejecuta directamente llamadas a la API del proveedor**.
- La app **notifica por email** cuando vence una inversión o una cuota.

> **`DummyPay` es un nombre random.** Lo aclara explícitamente en **2:02:00**: no implica que el proveedor sea débil ni que el ejercicio espere que lo ataques por ahí.

### El método, que es lo que se está evaluando

Repite el mismo formato **una y otra vez durante una hora**, y una hipótesis que no lo cumple se cae sola. Son **dos partes obligatorias**:

> [!quote]- Del video — la primera parte obligatoria de cada hipótesis (2:23:29)
> "¿Qué cosa del texto te dio a entender que esto podría llegar a tener una vulnerabilidad?"

1. **Qué parte del enunciado te despertó la sospecha.**
2. **Cómo la probarías**, según la metodología.

Y antes de escribir nada, dos pasos de arranque que hace en vivo:

- **Resaltar la información importante del enunciado.** Literalmente lo hace en pantalla, marcando en verde los seis puntos de arriba.
- **Entender el modelo de negocio**, para saber cómo romperla y **qué le da más impacto a esa empresa en particular**.

> [!quote]- Del video — sobre la dirección del razonamiento (2:19:28)
> "No: vos querés testear tal cosa porque creés tal cosa, y lo querés testear."

**La metodología de hipótesis de falla no está en este video.** Remite a la última teórica, y ahí manda a buscar los pasos. ***(Lectura nuestra.)*** En el corpus, esa metodología está en el [[video-09-pentesting-metodologia|Video 09 — Pentesting: metodología]] (2025, de Ramele), que sí tiene las láminas de *Metodología de Hipótesis de Falla*; la clase a la que él remite es la teórica de 2021, no ese video, así que la correspondencia es **de tema, no de fuente**.

### Las hipótesis, y por qué acepta o rechaza cada una

| Hipótesis propuesta | Veredicto | Razón |
|---|---|---|
| **Replay attack contra DummyPay**, reenviando una transacción vieja si no hay timestamp (2:14:09) | **Aceptada** | Si el proveedor no controla el estado de la operación ni exige un token no replicable, se captura una llamada válida y se repite. **El hallazgo es de la app** en tanto le entrega el control al cliente |
| **DoS** sobre los endpoints que no requieren autenticación (2:14:20) | **Reformulada** | Cae en el Error 2. Lo que sí se hace es **medir si existe rate limit**: repetir el request a alta tasa y, si metiste cinco o diez mil en dos segundos y nadie te frenó, **ese es el hallazgo** — sin llegar a voltear el servicio |
| **MITM con proxy** contra las llamadas de la app a DummyPay (2:27:12) | **Rechazada como MITM, aceptada como otra cosa** | Si el atacante es el dueño del celular, es **equivalente a llamar directo** a la API; si es un tercero, queda **fuera del scope**. Lo que sí queda es una **falla de diseño y arquitectura**: nada pasa por los servidores de la empresa, y la app acepta y guarda cosas que ningún servidor propio chequea |
| **Deep links y CSRF** | **Rechazadas** | El enunciado dice que la API está **correctamente protegida** |
| **SQL injection** | **Rechazada** | Idem |
| **Autenticación insuficiente** (2:42:17) | **Aceptada, y es la más limpia** | Ver abajo |
| **Divulgación de información sensible** en el binario (2:46:04) | **Aceptada** | Ver abajo |
| **Correlacionar las últimas 10 operaciones** con una persona concreta (2:48:50) | **Aceptada como rebuscada** | Ver abajo |

#### Autenticación insuficiente, el caso modelo

Es el mejor ejemplo del método, porque **la hipótesis nace de un silencio del enunciado**. El texto dice que el usuario se registra con email y contraseña **y no dice nada más**. No menciona:

- política de contraseñas,
- límite de intentos fallidos,
- tiempo mínimo entre pruebas,
- detección de comportamiento anómalo —loguearse desde Japón, Ucrania y Argentina en un lapso de tres horas—,
- control de sesiones concurrentes en dos celulares.

**Cada uno de esos silencios habilita una hipótesis.** Y se prueba haciendo fuerza bruta con listas de contraseñas comunes contra la interfaz o directamente contra la API.

#### Divulgación de información sensible en el binario

Como la app **habla directo con DummyPay**, es probable que tenga adentro **credenciales reales del proveedor**. Se descomprime el APK y se busca. Menciona al pasar que **se puede calcular la entropía del archivo para ver si está cifrado o no**. Si esas credenciales se consiguen, **el impacto es mayor, porque se puede impersonar a la app contra el proveedor**. Lo mismo con los datos de tarjeta y cuenta bancaria que el enunciado obliga a registrar y que quedan guardados en algún lado.

#### La rebuscada que igual acepta

La pantalla sin autenticación muestra tipo de operación, monto y condiciones de las últimas 10 operaciones, y **lo único que no muestra es quién**. Se hace polling sobre ese endpoint mientras se observa a alguien operando —mirándole la pantalla en un bar— y **se asocia el monto con esa persona**. Lo acepta como information leak, pero lo marca como **extremadamente rebuscado** y con el problema de que **requiere un tercero**, algo que en general conviene evitar cuando lo que se pidió es analizar la app.

### Errores típicos de este ejercicio en particular

Los lee en el cierre (**2:50:00-2:56:06**). Tres:

1. **Hablar de buffer overflow**, cuando los lenguajes típicos de mobile no tienen ese problema.
2. **Hablar de una vulnerabilidad de forma genérica**, sin bajarla al caso.
3. **Proponer una contrapropuesta de solución** —*"usemos JWT en vez de contraseña"*— **sin haber identificado antes cuál era el problema**.

Y dos criterios de scope que valen como regla general:

- **Si se encuentra una vulnerabilidad en el proveedor externo, eso es del proveedor**, no de la app que se pidió analizar.
- **Meter en la hipótesis a un tercero externo** —una víctima usando su celular al lado tuyo— **generalmente cae fuera del scope de lo pedido**.

### Las respuestas válidas que enumera

Cinco, más al menos una que no se llegó a entender:

1. **Autenticación insuficiente** — no limitar intentos, permitir claves simples de tres dígitos.
2. **Divulgación de información sensible** — tarjetas de crédito y credenciales de la API guardadas en la app.
3. **Bypass de control** — en cómo la app le avisa a la API que se cursó un pago a nombre del usuario.
4. **DoS contra DummyPay** — usando libremente las credenciales que están en la app.
5. **La pantalla de estadísticas siendo una WebView** — marcada por él mismo como rebuscada.

> **Este bloque está incompleto y hay que saberlo.** Del **2:50:00 al 2:56:06 el docente habla sin diapositiva**: la pantalla compartida sigue mostrando el enunciado en `nvim`, verificado con frames de refuerzo a 2:51:00, 2:52:00, 2:53:00, 2:53:30, 2:54:10, 2:55:00 y 2:55:40. Esta lista se reconstruyó **sólo del audio**, que ahí está especialmente roto, **y hay al menos una hipótesis más que menciona y que no se llega a entender**.

---

## El marco: cómo se contrata un pentest y quién lo hace

La primera media hora es contexto de la industria. No es materia de examen directa, pero **da el vocabulario con el que después juzga las respuestas** —sobre todo el criterio de "lo menos intrusivo posible" del Error 2 y el de scope del Error 3.

### Startup contra corporación

- **Startup de dos años, una sola persona de seguridad** (**01:57**): lo mínimo es **análisis estático y análisis dinámico** con alguna herramienta. Si se quiere algo más serio, **se contrata un pentest**.
- **El pentest** puede cubrir toda la app o sólo el login. **El scope se charla y se pauta** —por ejemplo, no tocar nada de Finanzas, no tocar ninguna base de datos—, **dura del orden de una semana y termina en un reporte**. Variante: en vez de la web app se testea la API, o la app mobile, o las dos.
- **Corporación con muchas apps** (**05:30**): se van testeando de a una, y llega un punto en que conviene tener equipo propio.

### Los sombreros

| Equipo | Qué hace | Timestamp |
|---|---|---|
| **Blue Team** | Defensa. Respuesta a incidentes, chequeo de vulnerabilidades corriendo escáneres, **tickets y seguimiento de que se resuelvan**. Cuando algo cae, se encarga de que vuelva a estar como tiene que estar | 06:25 |
| **Red Team** | **No rehace el trabajo del pentester.** Ataca **la organización**, no la app: la conjunción de apps y las políticas de la empresa. Phishing, ingeniería social para armar el organigrama, y trabajo físico — entrar a la oficina y sacarle una foto al server, **tirar cinco pendrives en el piso y ver si los enchufan y si los reportan** | 08:00 |
| **Purple Team** | Mezcla de los dos en un mismo equipo. La misma gente capacitada para defender y para atacar. Lo presenta como **moda nueva** | 10:32 |
| **Green Team** | **El sombrero que se olvida: el área legal.** Aparece recién a la hora y media | 1:52:54 |

### Pivoting y escalamiento

En **12:10**, comprometida una máquina: **escalamiento lateral** es pasar a otro usuario o máquina **del mismo nivel de permisos**; **escalamiento vertical** es subir de privilegios sobre el mismo recurso, y se llama **privilege escalation**. Detalle de scope que importa: **el pentester suele frenar cuando accede; el Red Team sigue.**

### El Green Team y el costado legal

En **1:52:00-2:02:00**, el bloque más práctico del marco:

- **Ley de protección de datos personales**, más fuerte en Europa que en Argentina, con **multas por no proteger datos**.
- Compara **tirar abajo un servicio** con **un piquete que corta la calle**, cuando el modelo de negocio es virtual.
- **El código penal castiga todo acceso indebido.** El peor caso que describe: que te armen una causa y **te secuestren todos los equipos informáticos como pericia**.
- Contrapone el modelo de **bug bounty**, con el ejemplo de PlayStation pagando por un problema crítico de hardware **dentro del scope aceptado**.

Y el disclaimer que repite dos veces en el video:

> [!quote]- Del video — el disclaimer legal (53:44)
> "Todo lo que aprendan acá, teórico o práctico, no lo apliquen en cosas que no sean suyas."

---

## La parte técnica: cómo armar el setup

Media hora (**33:30-56:00**) sobre un problema concreto: **se tiene el celular y una app que le pega a una API cuya dirección no se conoce**. Es el tramo más técnico del video y el único con valor operativo directo.

### Cuatro caminos para interponerse

| Camino | Cómo | Qué se obtiene |
|---|---|---|
| **1. Emulador** | Correr un emulador de Android en la propia PC y capturar con `Wireshark` **sobre la interfaz de red virtual del emulador** | Todo el tráfico de la app, sin tocar el celular |
| **2. Router propio** | Un router extra conectado físicamente a la PC, **con la PC de gateway**; el celular se conecta a esa red de prueba | Todo su tráfico pasa por esa PC |
| **3. Rootear** | Rootear el celular y **tocar el `/etc/hosts`** para redirigir a tu máquina, que forwardea | Redirección selectiva por host |
| **4. Decompilar** | Bajarte el APK —**que es equivalente a un ZIP**—, descomprimirlo y **buscar la IP adentro** | La dirección, sin capturar nada |

> En el diagrama del pizarrón aparece una IP de destino de ejemplo que **no se pudo leer con confianza**: se distingue algo del estilo `220.11` seguido de más dígitos. **No se usa como dato.**

### Para APIs no hay setup

Se trabaja con proxy y punto (**45:00**). Anota `ZAP`, `Burp` y `Postman`; tira su fanatismo por el open source y aclara que `Burp` es paga. Sobre `ZAP` remarca que **es mucho más cómodo que las DevTools para rearmar requests**, y anuncia que lo van a usar en la clase práctica del lunes siguiente.

**Y acá está el límite que después es el Error 1:** si la conexión va `HTTPS` cifrada de punta a punta, **capturar en el medio te devuelve ruido cifrado**.

### Descubrimiento de endpoints

Con la IP sola no se puede hacer nada: **hacen falta los endpoints** (**52:29**). Dos formas:

- **Ataque de diccionario** con `dirsearch` y `gobuster`, que van probando nombres comunes —`/api/new`, `/api/old`, `/api/register`— hasta que alguno responde.
- **Parsear el `main.js` del frontend**, cuando hay Front y Back separados.

**Pero insiste en lo que hay que escribir en el examen:** en un pentest real **es probable que el cliente dé la lista de endpoints**, y conviene decirlo o preguntarlo en vez de asumir que no se tiene. Es el Error 3 aplicado.

---

## Las digresiones, y qué vale de ellas

Hay dos tramos largos sin contenido de examen. Se listan para que quede claro que se pueden saltear, y se rescata lo poco que dejan.

**Cadena de confianza y Trusting Trust (1:16:00-1:23:00).** Plantea al paranoico que se compila el kernel a mano para ganar seguridad y lo desarma con una cadena de preguntas: ¿con qué se compila?, con `gcc`; ¿y de dónde se bajó ese `gcc`?; ¿cómo se sabe que no tiene un `if` que le mete una cuenta al `sudo` que se está compilando? Sigue con el CPU —puede venir con una instrucción de más—, el Pentágono fabricando lo suyo, y si en un torneo de esports con dos millones de dólares en juego se permite traer el propio teclado. Cierra con un pendrive que en realidad es un microcontrolador **que emula un teclado y tipea comandos solo**.

Lo aprovechable es una sola línea, y es la misma de la parte organizacional: **la cadena es tan fuerte como el eslabón más débil** — si tu proveedor es inseguro, te atacan a través suyo. Esa es la forma en que el argumento sí puede aparecer en una respuesta.

> **Tres cosas de este tramo que no se pueden citar.** El **paper** que menciona sobre "confiar en la confianza" es casi seguro *Reflections on Trusting Trust*, pero **el nombre del autor él nunca lo dice**, así que no lo atribuyas. La distribución que nombra al hablar de compilar el kernel se entiende mal en el audio y **probablemente sea Gentoo, sin confirmar**. El pendrive que emula teclado apunta a un Rubber Ducky, pero **el nombre no se entiende**. Además, **entre 1:16 y 1:22 hay un problema de audio y micrófono** y el ASR queda casi vacío: parte del razonamiento sobre compilar el kernel se perdió.

**La anécdota del edificio (1:09:20-1:16:00).** Cuenta que le contaron en Redes que una empresa le exigió a otra **separación física entre pisos del edificio** para poder trabajar juntas. **Los nombres de las dos empresas salen de un ASR muy roto y podrían ser otras**, así que la nota no los reproduce. La moraleja es la del eslabón más débil, otra vez.

**El recreo (59:20-1:09:20).** Diez minutos de un cartel que dice *STREAM//STARTING · MEDIALUNAS BREAK*. **Cero contenido.**

---

## Qué se pudo leer y qué no

Además de lo ya marcado en cada sección:

- **La transcripción es el auto-sub `es-orig` de YouTube y está muy dañada**: pierde palabras enteras, corta frases a la mitad y en varios tramos deja renglones sueltos sin sentido. Lo que se pudo verificar contra el pizarrón o las diapositivas se corrigió; el resto no se cita textual.
- **Correcciones de ASR confirmadas visualmente**, porque están escritas en el pizarrón o en el enunciado: donde el ASR dice *"SAP"*, *"Sa"* o *"sap"* es **`ZAP`**; *"wir Shark"*, *"Wii shark"*, *"W shar"* es **`Wireshark`**; *"be Search y goaster"* son **`dirsearch`** y **`gobuster`**; *"damy Pay"*, *"dam Pay"*, *"D Pay"*, *"Andy"* es **DummyPay**; *"cf Cross"*, *"csrp"* es **`CSRF`**.
- **El pizarrón es Xournal++**, letra manuscrita chica sobre fondo cuadriculado. Los rótulos que la nota reporta se leyeron con confianza. **Los dibujos de red —nubes, routers, flechas— no siempre son legibles**, y se describieron por lo que dice el audio en ese momento.
- **Los cortes de tramo de la tabla de recorrido son aproximados** a la transición temática, no marcas exactas de cambio de pantalla. La transcripción viene en minutos corridos que pasan de 60, convertidos acá a horas.

---

## Qué aporta este video al mapeo del corpus

Tres cosas que salen de mirarlo y que la [[videografia#Quién dicta qué|Videografía]] ya incorporó:

1. **Es una de las dos piezas de evidencia de que no todos los videos son de Ramele.** Este y el Video 10, mismo docente y mismo día de subida.
2. **Es el contraejemplo más limpio de que la fecha de subida no dice cuándo se dictó**: subido en julio de 2024, dictado en 2021. Junto con el Video 10 tira abajo el mapeo por fechas.
3. **Es el único lugar del corpus con taxonomía aplicada de vulnerabilidades**, que es un hueco que el Video 08 no tapa.

Y una que **sigue pendiente de ajustar en la ficha**: el ancla al [[reglamento-y-evaluacion#Final|examen final]] es correcta, pero **la promesa de "escrito e integrador" hay que matizarla**. Este video cubre **una** parte del final —seguridad en aplicaciones—, no el integrador. Quien lo mire esperando repaso de criptografía va a perder tres horas.

---

## Ver también

- [[videografia#Los 13, con sus datos duros|Videografía]] — dónde está listado este video, con sus datos duros y su docente
- [[reglamento-y-evaluacion#Final|Reglamento y evaluación]] — qué es el final contra el que se ancla este video
- [[cronograma#Material sin fecha de clase|Cronograma]] — por qué este video no tiene fila propia
- [[programa-y-objetivos#Contenidos|Programa y objetivos]] — *"Seguridad en aplicaciones · penetration testing · análisis de vulnerabilidades"*, la línea de la Clase 8 de la que cuelga el contenido
- [[bibliografia#2. Matt Bishop — Computer Security: Art and Science|Bibliografía]] — a dónde ir por autenticación y control de acceso, que es justo lo que este video avisa que entra y ningún video explica
- [[video-09-pentesting-metodologia|Video 09 — Pentesting: metodología]] — **la metodología de hipótesis de falla**, que este video da por sabida y es la mitad de la consigna
- [[video-10-pentesting-laboratorio|Video 10 — Pentesting: laboratorio]] — la otra clase de Pinilla, misma tanda; el laboratorio del que acá se ve sólo la teoría
- [[video-08-vulnerabilidades|Video 08 — Vulnerabilidades]] — la clase que debería traer la taxonomía y no la trae
- [[video-06-principios-de-diseno-2026|Video 06 — Principios de diseño]] — los ocho principios; varias de las fallas que acá se buscan son principios rotos
- [[cifrado-probabilistico-nonce-e-iv#Nonce e IV no son exactamente lo mismo|Cifrado probabilístico, nonce e IV]] — la parte criptográfica de la discusión de timestamp contra nonce de 1:46:00
- [[ataque-de-fuerza-bruta|Ataque de fuerza bruta]] — el segundo paso del que user enumeration es el primero
- [[ataque-de-diccionario-sobre-hashes#Contramedidas|Ataque de diccionario sobre hashes]] — política de contraseñas y límite de intentos, que es la hipótesis modelo del ejercicio
- [[eleccion-de-primitivas|Elección de primitivas en un proyecto]] — el criterio detrás de *"`TLS` 1.0 es una versión vieja y vulnerable"* de las notas extra
- [[modelos-de-ataque|Modelos de ataque]] — el análogo criptográfico de la discusión de scope: cuánto sabe y cuánto puede el atacante
- [[tp-implementacion|TP de Implementación]] — las hipótesis de autenticación insuficiente y de credenciales en el binario son el checklist más barato para revisarlo
