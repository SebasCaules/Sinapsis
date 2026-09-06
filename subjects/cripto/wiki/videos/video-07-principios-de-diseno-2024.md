---
title: Video 07 — Principios de diseño (2024)
resumen: 'Clase grabada en 2024 sobre los mismos ocho principios con un deck anterior: aporta los ejemplos técnicos de cada uno, la bibliografía de Bishop y un anexo de hardening para desarrolladores.'
fuentes: ["[[videografia]]", "[[cronograma]]", "[[video-06-principios-de-diseno-2026]]"]
aliases: [Video 07, Principios de diseño 2024, Saltzer y Schroeder 2024, Developer's Hardening, Principio de la cebolla, Seguridad unbounded]
type: video
clase: 8
orden: 41
video: 07
youtube: 08hziQPewts
created: 2026-09-03
updated: 2026-09-04
tags: [video, seguridad, principios-de-diseno, saltzer-schroeder, hardening, bloque-2, clase-08, ramele]
sources: ["https://www.youtube.com/watch?v=08hziQPewts"]
---

# Video 07 — Principios de diseño (2024)

> **Duración:** 1:07:33 · **Subido:** 10/05/2024 · **Docente:** Rodrigo Ramele · **Visibilidad:** oculto (*unlisted*, se accede por la playlist)
> **Mapea a:** [[cronograma|Clase 8 — Principios de diseño y vulnerabilidades]], 15/10 · [[videografia#Los 13, con sus datos duros|Videografía]]
> **Link:** [Principios de Diseño (2024)](https://www.youtube.com/watch?v=08hziQPewts)
> **Es una clase en vivo**, no un video de estudio: hay preguntas de alumnos con turno de habla y negociación del recreo al cierre. Verificado contra la transcripción.

Sirve para llevarte los **ejemplos técnicos** de cada principio —el web server, `sshd` y el puerto 22, Oracle, `finger`, Vista UAC, el ataque a `xz`— y la **bibliografía**, que es lo que la versión 2026 no tiene; **no** sirve como versión canónica del deck, porque el deck vigente es el del [[video-06-principios-de-diseno-2026|Video 06]] y cinco de los ocho principios cambiaron de nombre.

---

## Por qué mirar las dos versiones

La [[videografia#Los 13, con sus datos duros|Videografía]] decía que este video *"se deja listada porque dura 5 minutos más, no porque haya que mirar las dos"*. **Eso está desmentido.** La verificación adversarial comparó frames de los dos videos y encontró que **son dos decks distintos**:

| | Video 07 (este, 10/05/2024) | [[video-06-principios-de-diseno-2026\|Video 06]] (17/05/2026) |
|---|---|---|
| Archivo del deck | `Clase 07 - Aplicaciones - Principios de Diseño.pdf`, 16 páginas | deck sin nombre visible, ~16 láminas |
| Plantilla | pie *"Criptografía y Seguridad - ITBA"* + número de página | fondo blanco, banda turquesa, sin pie ni paginación |
| Ejemplos | web server, `sshd`, Oracle, `finger`, Vista UAC, `xz` | castillo, Constantinopla, `LLM` poisoning, `MITRE`, `STRIDE` |
| Bibliografía | Bishop, capítulos 12-13 (filmina 16) | no la tiene |
| Anexo propio | *Developer's Hardening*, 11 minutos | no lo tiene |
| Lámina exclusiva | — | *Modelado de Amenazas (Threat modeling)* + Threat Modeling Manifesto |

**Los conjuntos de ejemplos son disjuntos**, verificado por búsqueda sobre las transcripciones completas de los dos: `finger`, `sshd`, `oracle`, `xz` y `bishop` dan cero apariciones en el Video 06, y `castillo`, `constantinopla`, `manifesto`, `LLM`, `poisoning`, `MITRE` y `STRIDE` dan cero en éste.

### La tabla que más conviene tener a mano: los nombres cambiaron

Cinco de los ocho principios se llaman distinto en cada deck. Si se estudia por un deck y el examen toma el otro, esta es la tabla que salva:

| Nº | Nombre en el deck 2024 (este video) | Nombre en el deck 2026 ([[video-06-principios-de-diseno-2026\|Video 06]]) |
|---|---|---|
| 1 | Menor privilegio | Menor Privilegio (*Least privilege*) |
| 2 | **Valores iniciales seguros** | **Fallar de forma segura** (*Fail-safe defaults*) |
| 3 | **Economía de mecanismos** | **Simplicidad** |
| 4 | Mediación completa | Mediación completa |
| 5 | **Diseño abierto** | **Sistema Abierto** |
| 6 | **Separación de privilegios** | **Segregación de Tareas** |
| 7 | Mecanismos exclusivos | Mecanismos exclusivos |
| 8 | **Aceptación psicológica** | **Menor asombro** |

> El veredicto de verificación enumera **las cinco filas que cambian** (2, 3, 5, 6 y 8) y da la fila 1 con su texto exacto en los dos decks. Las filas **4 y 7 se listan acá como sin cambio porque no están entre las cinco que cambian**, no porque se hayan leído los dos frames uno al lado del otro. ***(Lectura nuestra.)***

Un dato más, del mismo veredicto: el Video 06 se subió el **17/05/2026**, o sea primer cuatrimestre. **No existe ningún video de Principios de diseño grabado en la cursada 2C-2026.**

---

## Recorrido

| Desde | Hasta | Tramo |
|---|---|---|
| 00:00 | 01:26 | Apertura. Filmina título con la bóveda blindada. Aclara que el tema se toca también en PAW y en Redes, y anticipa el anexo del final |
| 01:26 | 02:00 | Filmina 2: las dos ideas madre (simplicidad y restricción) y la cita a Saltzer y Schroeder |
| 02:00 | 05:10 | **Principio 1: menor privilegio.** Filmina 3, ejemplo del CEO. Corte con el intercambio sobre control de acceso y Pablo |
| 05:10 | 09:10 | Pregunta de alumno: ¿la política de roles al arranque o sobre la marcha? Digresión sobre el *paranoico controlado* |
| 09:10 | 11:27 | Límites del menor privilegio (granularidad del S.O.) y filmina 4, el web server. Caso Apache |
| 11:27 | 15:35 | **Principio 2: valores iniciales seguros.** Filmina 5 (`sshd` y el puerto 22), bloqueo por intentos, routers con clave de fábrica, filmina 6 (Oracle) |
| 15:35 | 17:50 | **Principio 3: economía de mecanismos.** Filmina 7, enganche con programación defensiva |
| 17:50 | 18:45 | Filmina 8: el protocolo `finger` |
| 18:45 | 23:13 | **Principio 4: mediación completa.** Filmina 9, el backup, y la introducción de la *seguridad unbounded* |
| 23:13 | 26:10 | Pregunta de alumno: por qué un único punto de verificación. La analogía de la ciudadela |
| 26:10 | 28:04 | Segunda pregunta: ¿economía de mecanismos y mediación completa se pisan? |
| 28:04 | 32:00 | **Principio 5: diseño abierto.** Filmina 10, Kerckhoffs, seguridad por oscuridad, código en el cliente y apps móviles |
| 32:00 | 38:00 | **Debate abierto de seis minutos**: ¿el open source es más o menos seguro? Termina en el ataque a `xz` |
| 38:00 | 41:15 | **Principio 6: separación de privilegios.** Filminas 11 y 12: dev que no administra producción, dos firmas bancarias |
| 41:15 | 47:35 | **Principio 7: mecanismos exclusivos.** Filmina 13: canales ocultos, VMs, sandbox de iOS |
| 47:35 | 53:20 | **Principio 8: aceptación psicológica.** Filmina 14, usabilidad y accesibilidad, *liveness detection*, RENAPER, Worldcoin |
| 53:20 | 56:10 | Filmina 15 (firewalls personales, Windows Vista `UAC`) y filmina 16 (lectura recomendada: Bishop) |
| 56:10 | 1:07:33 | **Anexo:** cierra el PDF de la cátedra y abre en Keynote su presentación *Developer's Hardening* |

> **Cuidado con los timestamps de las filminas.** El barrido de frames captura la lámina cuando la toma, no cuando el docente la pone; en la filmina 15 el desfasaje llega a casi tres minutos. Los tramos de esta tabla salen del audio, que es lo confiable.

---

## Las dos ideas madre

Filmina 2 (01:26). Los principios se presentan como **líneas rectoras de alto nivel, no recetas**: bases que promueven un diseño con resultado un sistema robusto y seguro. Descansan sobre dos ideas que la filmina explicita:

- **Simplicidad** — menos cosas pueden salir mal, menos inconsistencias y zonas no definidas, más fácil de entender y de verificar.
- **Restricción** — minimizar el acceso, minimizar la comunicación.

El pie de la filmina cita **Saltzer y Schroeder, *"The protection of information in computer systems"***. Es la única fuente primaria que el deck nombra además de Bishop.

---

## Los ocho principios

Lo que sigue es, para cada principio: **lo que dice la filmina** (que es lo que entra en el parcial) y **el ejemplo que sólo está en esta versión** (que es lo que justifica mirarla).

> **No hay ni un ejemplo numérico resuelto en todo el video.** No es una clase de cuentas: es una clase de criterio. Si lo que se busca son ejercicios paso a paso, éste no es el video.

### 1. Menor privilegio

**Filmina 3 (02:00).** Un sujeto debe recibir **sólo los privilegios necesarios para completar su tarea**. Los privilegios se asignan **por función, no por identidad** — de ahí la idea de rol. Si una tarea requiere derechos adicionales, se asignan y **se desechan luego de su uso**. Ejemplo de la filmina: el CEO no tiene por qué acceder a todos los archivos confidenciales de ingeniería.

**El límite práctico (09:10):** el sistema operativo muchas veces **no tiene la granularidad deseada**, y una granularidad demasiado fina se vuelve inadministrable. Si hay que administrar cada acceso discrecional a cada archivo, el esquema no se sostiene.

**Filmina 4 — el web server (09:54).** Es el ejemplo más aprovechable del deck. Debería poder:

- leer las carpetas de archivos web,
- leer sus archivos de configuración,
- escribir en sus carpetas de logs **sólo en modo append**.

Y **no** debería poder:

- leer otros archivos,
- escribir en otros lugares (con el asterisco *"salvo lugares de upload o webdav"*),
- sobreescribir logs.

La filmina remata con la caja **"¿Alguien vio un web server configurado de esta manera?"**. Ramele agrega el caso real: **Apache**, en una época, usaba las mismas *system calls* de logueo de Unix que procesos internos, y eso se explotaba para acceder a información de otros procesos. Después se separó. El mismo caso vuelve en el principio 7.

### 2. Valores iniciales seguros

**Filmina 5 (11:27).** El acceso a cualquier objeto debe ser **denegado por defecto**, y si una acción falla por seguridad el sistema debe **volver al estado de seguridad inicial**.

**El ejemplo de la filmina es `sshd` y el puerto 22.** `sshd` intenta abrir el puerto 22 y falla. **No** debe abrir otro puerto y **no** debe elevar sus privilegios para reintentar. La caja al pie: *"Si lo hiciese, es probable que se pueda atacar el sistema"*.

Alrededor de eso (13:25-15:35) suma tres cosas:

- **Bloqueo por intentos de password.** El usuario prueba $N$ veces, el sistema lo bloquea por un tiempo, y después ese bloqueo se resetea a un estado inicial que ya tiene el flag levantado pero permite reintentar. El ciclo de vida siempre tiene que volver a una situación segura.
- **Routers con clave de fábrica.** Se distribuyen con passwords triviales para el *kick start* inicial; el setup debería impedir que esa clave quede en producción, y los instaladores actuales ya no lo admiten.
- **Filmina 6, Oracle (14:23).** Las instalaciones antiguas definían usuarios administrativos iniciales con claves predefinidas, algunos poco evidentes, y era responsabilidad del administrador modificarlos. Hoy los instaladores piden la clave inicial.

El mantra con el que lo cierra es **no asumir nada**, jugando con la etimología del *assume* en inglés.

### 3. Economía de mecanismos

**Filmina 7 (15:35).** Los mecanismos de seguridad deben ser **simples**, porque:

- menos cosas pueden salir mal,
- se simplifica la verificación formal e informal,
- si algo sale mal es más fácil de corregir,
- las relaciones de confianza (en entradas y salidas) son más visibles.

Su lectura: **cada feature agregado aumenta la superficie de ataque**, y hay un punto en que se vuelve inhumanamente imposible prever todo. Lo engancha directo con **programación defensiva**: sanitizar entradas, chequear que los datos vengan como uno espera, no asumir que la relación de confianza va a estar siempre de tu lado.

**Filmina 8 — el protocolo `finger` (17:50).** Un host podía pedir información de un usuario registrado en otro host. Muchas implementaciones **asumían que la respuesta del servidor estaba bien formada**, un hecho oculto dentro de las complejidades propias del protocolo. Un servidor malicioso podía generar un **mensaje de respuesta infinito**, con tres desenlaces:

1. se llenan logs y disco — *denial of service*;
2. se cae el servicio — *denial of service*;
3. **buffer overflow** con ejecución remota de código.

Es el ejemplo que mejor muestra por qué complejidad y confianza implícita son el mismo problema.

### 4. Mediación completa

**Filmina 9 (18:45).** **Todos** los accesos a objetos deben ser verificados, **incluso si el objeto se accede varias veces**. La filmina marca los costos: va en contra de la eficiencia porque **no permite usar caches**, y es complejo de implementar — ¿qué pasa si mientras se está accediendo a un objeto le quitan el permiso?

**El choque con la robustez (19:16).** Pregunta a la clase qué hacen para preservar los datos de un disco; un alumno contesta *backup*. Ahí está la tensión: **cada copia adicional da robustez pero crea una oportunidad más de ataque**, aun cifrada. Se quiere **no** tener un único punto de falla, y a la vez **sí** se quiere un único punto de control.

**Aclaración que salió de una pregunta (23:13-26:10):** mediación completa **no implica un único servidor, implica un único mecanismo**. Dos sectores de una empresa con esquemas de administración de usuarios distintos y algo compartido es un quilombo potencial.

> [!quote]- Del video — la ciudadela con una sola puerta (25:04)
> "Si vos tenés una ciudadela, vos vas a querer que no tenga diez puertas: vas a querer que tenga una."

Los de adentro se van a quejar de que pierden eficiencia porque hay que sacar todo el tráfico por ahí, pero controlaste todo.

**Y la pregunta que conviene tener anticipada (26:10-28:04):** un alumno pregunta si centralizar el mecanismo es economía de mecanismos o mediación completa. La respuesta es que **está justo en el medio y la aclaración es correcta**: economía tiene que ver con tenerlo simple, mediación con poder controlar todo el acceso desde un único lugar.

> [!quote]- Del video — por qué los principios se solapan (27:50)
> "Son principios de diseño rectores, son ideas, entonces están mezcladas."

### 5. Diseño abierto

**Filmina 10 (28:04).** La seguridad **no debe depender del secreto del diseño o de la implementación**. Puntos de la filmina:

- **No** significa que haya que publicar el código fuente.
- Un atacante puede conseguir el algoritmo **desensamblando el ejecutable**, **sobornando o coercionando** a un desarrollador, o **buscando en desechos**.
- Esto **no aplica a las claves**, sino a los algoritmos.
- La violación del principio se llama **seguridad por oscuridad**.

Es exactamente el [[principio-de-kerckhoffs|principio de Kerckhoffs]], que el vault ya tiene desarrollado; **no hace falta volver a estudiarlo acá**. Lo que el video agrega es que lo marca explícitamente como pregunta de parcial (ver [[#Qué marca como pregunta de examen|Qué marca como pregunta de examen]]).

> [!quote]- Del video — Kerckhoffs enunciado en una línea (28:19)
> "El principio de Kerckhoffs: lo único que tiene que estar oculto es la clave."

**El ejemplo actualizado (29:14):** con aplicaciones web puras se asumía que el atacante no iba a acceder al código del servidor. Con clientes gordos y **sobre todo con apps móviles** eso se rompe: hay que asumir que el código que corre en el teléfono va a estar en manos del atacante, que además puede modificarlo. En Android la decompilación es fácil por cómo opera la máquina virtual, por más ofuscación que se ponga; en iOS es un poco más difícil por la compilación nativa. El código JavaScript del cliente es el caso trivial.

### 6. Separación de privilegios

**Filmina 11 (38:53).** Un sistema **no debe otorgar permisos basado en una sola condición**. Se refiere a la **asignación** de permisos, y busca evitar que un sujeto obtenga privilegios y los use. De ahí derivan **separación de tareas** y **defensa en profundidad**: si se compromete un área, el compromiso queda restringido a ella, y ningún rol puede completar solo toda la cadena.

El ejemplo hablado, que es el más aplicable: **quien administra el servidor de deploy o de staging no puede ser el desarrollador, y quien desarrolla no puede administrar la base de datos** — aunque en empresa chica no se cumpla nunca.

**Filmina 12 (40:12).** Dos casos:

- los bancos requieren **dos firmas** para aprobar transacciones electrónicas por sobre cierto monto;
- algunos sistemas **no permiten modificar los permisos de otro administrador**: el administrador es tope en cuanto a permisos, pero no puede administrar los permisos de sus pares.

### 7. Mecanismos exclusivos

**Filmina 13 (41:17).** Los mecanismos de seguridad **no deben compartirse**. Si se comparten, **puede fluir información entre variables compartidas** y **pueden generarse canales ocultos**. El principio promueve **aislación**: máquinas virtuales y *sandboxing*.

Su agregado (42:00) es una tesis fuerte y bastante examinable:

> [!quote]- Del video — la seguridad no se agrega después (42:00)
> "La seguridad se tiene que hacer desde raíz, se tiene que tener en cuenta desde raíz."

El argumento: si la seguridad se agrega después como un feature, es justamente ahí cuando el mecanismo de seguridad termina compartido con algo del negocio.

**Sandbox de iOS (43:29).** El sistema operativo le pinta a cada proceso **su propia versión del hardware y del entorno**. La app declara un perfil de qué cosas de hardware va a usar, el usuario lo autoriza, y el sistema le entrega una versión de la máquina con eso. El área de archivos a la que accede es **exclusiva de ese proceso**, no compartida con las demás aplicaciones: si eso se compromete, se compromete sólo eso. Un alumno aporta el paralelo de los **usuarios dedicados de Linux** para ciertas aplicaciones, y Ramele cierra volviendo al caso de Apache y las syscalls de log.

> El ASR transcribe *"barrat"* donde el docente nombra el área de archivos del sandbox. Por el paralelo con 46:45 (*"bar log"*, *"bar message"*) lo más probable es que esté diciendo rutas tipo `/var`, pero **no hay filmina que lo respalde y queda sin confirmar**.

### 8. Aceptación psicológica

**Filmina 14 (48:09).** Los mecanismos de seguridad **no deben dificultar el acceso al recurso**. La filmina:

- requiere **ocultar el mecanismo**,
- en general es **muy difícil o imposible**,
- hay que **simplificar instalación y configuración**,
- y **evitar la necesidad de conocimientos técnicos**.

No tiene sentido pedir una password de 40 dígitos: nadie la va a usar. De ahí deriva a **usabilidad y accesibilidad** — cómo se resuelve esto para una persona mayor o con otras condiciones fisiológicas — y a los ejemplos de identidad (49:35): las validaciones que se masificaron en la pandemia (*mirar la cámara, pestañear tres veces, hacer una mueca*, tipo RENAPER) eran muy malas; **Worldcoin** apunta a lo mismo con reconocimiento de iris. Aclara que ***liveness detection* es una de las líneas de investigación que tienen en el ITBA**. Anécdota complementaria: el token bancario que exigía instalar un plugin y tipear cuatro dígitos, como ejemplo de mecanismo que la gente simplemente no adopta.

**Filmina 15 (53:20, capturada en el barrido recién a 56:00).** Dos ejemplos:

- **Firewalls personales**: exigen que el usuario identifique redes como internas o externas y determine cuándo una aplicación puede actuar como servidor. Decisiones que el usuario no está en condiciones de tomar.
- **Windows Vista `UAC`**: cada operación privilegiada mostraba una ventana pidiendo acceso.

El contexto histórico que agrega (53:42) es lo bueno del tramo: antes de Vista, Windows era un desastre de seguridad **por estrategia de negocio y *time to market***; los componentes **COM** y su variante **ActiveX** se instalaban solos, con acceso total a la computadora, por el mero hecho de entrar a una página web. Vista **sobrecorrigió**, y la sobrecorrección volvió el sistema insoportable. Es el caso de manual del principio: un mecanismo correcto en lo técnico que fracasa por rechazo del usuario.

---

## El debate sobre open source y el ataque a xz

Seis minutos (32:00-38:00) en que Ramele **pregunta a la clase y deja argumentar**. Es material de esta cursada, no del deck, y es el mejor tramo del video para el tipo de razonamiento que pide el final.

Las dos posiciones que salen:

- **A favor:** si es público, todo el mundo lo ve.
- **En contra:** en código cerrado una vulnerabilidad puede quedar diez años porque sólo tres tipos miran — pero depende de **quién la encuentre primero**, y eso también vale para el abierto.

> [!quote]- Del video — el escrutinio como supuesto, no como hecho (35:07)
> "Se asume que es más seguro porque tenés más escrutinio, hay más ojos mirando."

La conclusión que deja es cuidadosa: el *assumption* es que el open source es **un poco** más seguro por el escrutinio, la cantidad de ojos y la comunidad activa, **pero sólo si ese componente efectivamente se da**.

Y el contraejemplo con el que lo prueba es el **ataque a `xz`** (32:05): alguien se ganó con el tiempo la confianza del mantenedor de un paquete de compresión, ayudándolo en un montón de cosas, y terminó metiendo una **puerta trasera**. Ramele lo atribuye a un servicio secreto de un país. En 2024 era noticia reciente — lo llama *"lo que pasó hace poco"*—, y eso fecha el video con precisión. Lo contrasta con dos casos opuestos: el meme del desarrollador en Estonia que sostiene toda la estructura (`curl`), donde el escrutinio **no** se da, y **OpenSSL**, donde sí.

> El nombre del paquete sale cortado por el ASR en 32:16. El contexto —paquete de compresión, mantenedor único, backdoor, servicio secreto— es inequívoco, pero **el nombre no se leyó en ninguna filmina**.

---

## Tres hilos transversales

Atraviesan toda la clase y son, junto con la tabla de nombres, lo que más rinde llevarse de acá.

**1. La seguridad es *unbounded* (21:22).** Siempre se puede hacer un sistema más seguro, agregando más controles, hasta el infinito, acotado sólo por el presupuesto. Por eso choca permanentemente con performance, features y usabilidad, y por eso **hay que definir un nivel de seguridad objetivo en vez de perseguir el máximo**. Se conecta directo con [[seguridad-computacional|seguridad computacional]]: el nivel de seguridad es una decisión de diseño, no un absoluto.

> [!quote]- Del video — por qué seguridad siempre es la que dice que no (21:12 y 21:22)
> "Seguridad choca con todo. Es lo malo que todo el mundo le dice sí pero no, sí pero no."
>
> "Es muy importante que ustedes sean conscientes de que seguridad es unbounded, que no tiene límite."

Lo ilustra con su experiencia en una tarjeta de crédito, donde el área de seguridad informática decía que no a todo, porque **lo más fácil es no hacer nada**.

**2. El paranoico controlado (05:10-09:10).** La respuesta a *"¿los roles estrictos desde el arranque o se van ajustando?"* es que la seguridad se arma **por capas, como una cebolla**: primero buenas prácticas y mantras generales, después una política general (nombra Bell-LaPadula como ejemplo del **tipo** de política, sin desarrollarla), y recién después se la vuelve específica y mandatoria. De ahí deriva a una digresión larga sobre el perfil: seguridad es el área más compleja de computación porque hay que saber de todo.

> [!quote]- Del video — el perfil que pide el área (07:36 y 08:24)
> "La gente que labura bien en seguridad es un paranoico controlado."
>
> "Es muy difícil sacarte el gorro del ingeniero que lo está construyendo y ponerte el del que lo ve desde el punto de vista de la seguridad."

El paralelo que usa es QA. Es digresión, sí, pero es la digresión que define qué evalúa el final.

**3. El eslabón más débil (1:03:23, en el anexo).** El sistema es una cadena y su fortaleza se rompe por el eslabón más débil. **Corolario: la seguridad se juzga de manera global, no local.**

> [!quote]- Del video — las dos formulaciones (1:03:33 y 1:03:44)
> "La fortaleza de esa cadena se rompe por el link más débil."
>
> "La seguridad se juzga de manera global, no local."

---

## El anexo de hardening para desarrolladores

**56:10-1:07:33.** Cierra el PDF de la cátedra y abre en Keynote **una presentación propia, *Developer's Hardening*, tomada de una capacitación empresarial**. Lo venía anunciando desde 00:52 (*"después yo se lo voy a contar bien desde otra perspectiva, que es complementaria"*). Son once minutos que **no existen en el Video 06** y que reordenan lo mismo desde el punto de vista del que escribe código.

**Security awareness (56:53-58:22).** La filmina, sobre una foto de Venecia, dice: *you know why, you've heard the news, the world is not SAFE, we are targets, our customers are asking us for protection*. La animación remata apareciendo primero **"Now you feel Secure!"** y encima el desmentido **"NO! Never feel secure!"**. Lo primero que se le enseña a un empleado es que la seguridad existe y que uno es un *target*; lo que en seguridad física llaman *context awareness*, acá es *security awareness*.

> [!quote]- Del video — la formulación del principio (57:28)
> "El momento en que vos te sentís seguro es el momento en que cometés un error."

**Hardening y assets (1:01:01).** *Hardening* es **aplicar un conjunto de reglas o procedimientos para mejorar la seguridad del sistema, en general removiendo las partes innecesarias**. La filmina insiste en el orden: *"We need to identify FIRST where are our ASSETS!"* y *"Where is the SENSIBLE INFORMATION?"*. Proteger todo por igual es caro e innecesario.

El ejemplo histórico (59:42) es bueno: cuando se empezó a migrar de `http` a `https`, se ponía bajo SSL también todo el contenido público. Como ahí no hay confidencialidad que preservar, no hacía falta, y evitarlo bajaba complejidad, costo y tiempo — en una época en que SSL era carísimo y se compraban **placas aceleradoras dedicadas** para cifrar y descifrar, análogas a lo que hoy es una GPU.

**El triángulo de suma cero (1:02:00).** Filmina con **Security** arriba y **Performance** y **Features (Complexity)** en la base, con el texto *"Security is unbounded, so we need to add a balance between performance, complexity, and security. It is a sum-zero equation."* El caso extremo de sistema totalmente seguro es **uno que no existe**, o uno completamente aislado.

**La tecnología no vive aislada (1:02:30-1:06:00).** Primero la filmina *"As a Developer, how to be hardened?"*: **Cryptography** y **Defensive Programming** apoyados sobre una banda que dice **SECURITY AWARENESS**. Después la filmina en estrella con **Processes, Infrastructure, Culture, Corporation, People** y **Tech. Solution** — esta última circulada — y el pie *"Technology do not exist in isolation"*. La solución tecnológica es **un solo vértice**: los mayores hackeos entran por el lado de la gente, con ingeniería social y scams por WhatsApp.

Y cierra el punto con un ejemplo actual que es, en el fondo, una violación de **mecanismos exclusivos** (1:04:47): **billeteras virtuales que usan el mismo canal —SMS o WhatsApp— a la vez como segundo factor de autenticación y como vía de recupero de clave**. Es un mecanismo de seguridad compartido, y buena parte de los scams se apoyan exactamente en eso. Honestamente admite que del otro lado alguien va a decir que es el balance encontrado entre aceptación de la gente e implementación relativamente segura, y que eso también es válido.

**El principio de la cebolla (1:06:00-1:07:33).** Filmina *"The Onion Principle - Layer after layer"*, con Minas Tirith, una cebolla cortada y grabados de ciudades amuralladas medievales. **Se asume que alguien puede pasar la primera muralla, y por eso está la segunda**, y así sucesivamente: en ningún escenario se asume estar seguro del todo. Le sigue la filmina *"Architectural Design Principle"*, con el mismo pie: diagrama **DMZ → firewall → Database**, con un **Process Sandbox** adentro.

**Filmina final, *"Tip Points"* (1:07:00)** — el resumen de todo el anexo en seis líneas:

- *Professional Balanced Paranoid*
- identificar y enfocarse en la información sensible
- balance seguridad contra performance y complejidad
- *"Our realm: Computational Secure, key length is important"*
- el principio de la cebolla
- la tecnología no existe en aislamiento

Ese cuarto punto engancha directo con [[seguridad-computacional|seguridad computacional]] y con [[eleccion-de-primitivas#Ver también|elección de primitivas]]: el terreno de la materia es la seguridad computacional, y ahí el largo de clave es un parámetro de diseño.

### Las filminas del anexo por las que pasa de largo

Entre 58:22 y 58:45 atraviesa tres o cuatro filminas **sin comentarlas**, buscando el meme. Van listadas porque están en el video, no porque aporten:

- *"Growth of the Threat"*: gráfico con la sofisticación de las herramientas creciendo y la sofisticación requerida de los atacantes decreciendo entre 1980 y 2008 (*password guessing*, *self-replicating code*, *packet spoofing*, sniffers, *denial of service*, *cross site scripting*, *sophisticated C2*). **No la explica.**
- Meme de Star Trek, *"Are you two friends?"*, con las etiquetas **CRYPTOGRAPHY / CRYPTOCURRENCY** respondiendo **No / Yes**. Único fin: aclarar que cripto acá es criptografía.
- La **escala de seguridad**, de menos a más: *Ad hoc Secure* → *Computational Secure Practical* → *Provable Secure* → *Complexity-theoretic Secure* → *Unconditional Secure / Perfect Secrecy*. Los dos extremos de esa escala son [[secreto-perfecto|secreto perfecto]] y [[seguridad-computacional|seguridad computacional]], ya desarrollados en el vault.
- *"Former RSA Challenge"*: tabla de números RSA factorizados con sus premios, y un popup sobre Verisign y Thawte forzando la migración de certificados SSL de 1024 a 2048 bits.
- A 1:02:42, una filmina de ataques genéricos: *ciphertext only*, *known plaintext*, *chosen plaintext*, *chosen ciphertext*, *distinguishing attacks*, *birthday*, *meet-in-the-middle*, más un recuadro de *timing attacks*, sobre el diagrama Eve / Bob / Alice. Es la taxonomía que el vault ya tiene en [[modelos-de-ataque|modelos de ataque]]. **Tampoco la comenta.**

---

## Qué marca como pregunta de examen

Cuatro señales explícitas, en orden de aparición:

| Timestamp | Qué dice |
|---|---|
| 28:16 | El **principio de Kerckhoffs** es una de las preguntas del parcial. Lo enuncia como *lo único que tiene que estar oculto es la clave* |
| 31:22 | **Seguridad por oscuridad** — el nombre que recibe la violación del principio de diseño abierto — también fue pregunta de examen |
| 42:36 | **Canales ocultos**, hablando de mecanismos exclusivos, fue pregunta en el examen |
| 47:38 | El objetivo de esta clase es **generar intuición de seguridad**, y eso es lo que más se evalúa en el final. En 38:10 lo describe como un *final cuasi profesional* |

> [!quote]- Del video — qué evalúa el final (47:41)
> "Uno de los objetivos que tiene esta materia es generarles a ustedes intuición en relación a seguridad."

**Lectura recomendada, filmina 16 (56:17):** capítulos **12-13** de *Computer Security: Art and Science*, de **Matt Bishop**.

> **Ojo con la numeración.** El PDF de Bishop que está en `raw/` es la **2ª edición**, donde *Design Principles* es el **capítulo 14** y los capítulos 12 y 13 son *Cipher Techniques* y *Authentication* — ver el [[bibliografia#2. Matt Bishop — Computer Security: Art and Science|mapeo capítulo por capítulo]]. ***(Lectura nuestra.)*** Lo más probable es que la filmina venga de la numeración de la 1ª edición y nunca se actualizara; **no está verificado**, y no hay forma de confirmarlo desde el video. Si se va a leer, conviene guiarse por el título del capítulo y no por el número.

---

## Qué no cubre este video

**Control de acceso, ACLs y listas de capacidades: no están, y no están en ningún video del canal.** El intercambio de 04:35-04:57 es la prueba dura de que se dictan en **otras dos clases, con Pablo**, que no existen grabadas:

> [!quote]- Del video — control de acceso queda para otras dos clases con Pablo (04:35-04:57)
> "La parte de control de acceso ya la vieron con Pablo, ¿no?… o todo el tema de AC[L] y lista de capacidades.
> — No, todavía no, no, eso no.
> — Okay, porque hicimos un enroque. Y si bien acá algo se toca… lo mandamos para el final, queda, creo que va a ser en **dos clases**."

Lo confirma desde el otro lado el [[video-11-flujo-de-informacion|Video 11]], que en 03:28 dice *"las listas de control de acceso, llamadas ACLs, que ya lo vamos a ver en detalle… eso lo vemos todo en la clase de control de acceso"*.

**Autenticación tampoco:** al momento de esta clase todavía no se había dictado, y el docente lo da por no visto. En todo el corpus de videos no hay ninguna clase de autenticación.

**Y no desarrolla los modelos de seguridad.** Nombra Bell-LaPadula en el tramo 05:10-09:10 sólo como ejemplo del **tipo** de política que va después de los principios. Si se busca el modelo (*simple security property*, *\*-property*), no está acá.

---

## Lo que no se pudo leer

Convenciones del vault: lo que se vio y no se leyó, se declara.

- **La tabla del *Former RSA Challenge* (58:38)** aparece a baja resolución; **no se transcribió ningún número** de las columnas de dígitos decimales, binarios y premios. El docente además pasa de largo.
- **El *"barrat"* del sandbox de iOS (43:53)** — ver la nota en el [[#7. Mecanismos exclusivos|principio 7]].
- **1:02:23**: el ASR transcribe algo como *"un call server que está totalmente aislado, que está como que tenía de pkr"*. Suena a un servidor de CA raíz de una PKI *air-gapped*, pero **no se da por seguro**.
- **El nombre del paquete `xz` (32:16)** viene cortado por el ASR y no aparece en ninguna filmina.
- Los nombres de los alumnos que intervienen aparecen como **Mauro** y **Nicolás** según lo que dice el docente; no se verificaron de otro modo.
- **No hay pizarrón ni cámara del docente**: la clase es enteramente filminas proyectadas, así que no hay nada escrito a mano que pueda haberse perdido.

---

## Misma jornada que el Video 11

Este video y el [[video-11-flujo-de-informacion|Video 11 — Flujo de información]] **se subieron el mismo día (10/05/2024) y son la misma jornada de clase, partida en dos archivos**. No son dos clases distintas de la misma cursada: es una clase con un recreo en el medio.

> [!quote]- Del video — el cierre anunciando el corte y lo que sigue (1:07:33)
> "Si les parece hacemos un descansito hasta y media y volvemos y media, que vamos a ver **flujo de información**, que es lo que sigue, ¿les parece? Okay, dale. Bueno, gracias, chicos, por participar."

Y el Video 11 abre en 02:26 con *"va a heredar una mejor seguridad por varios de los principios de diseño [de los que] charlamos hoy"*. **Si se va a mirar uno, conviene mirar los dos seguidos y en ese orden**: el segundo se apoya explícitamente en el primero.

---

## Ver también

- [[video-06-principios-de-diseno-2026|Video 06 — Principios de diseño (2026)]] — la versión vigente del deck. Conviene ver ésa primero y ésta después, por los ejemplos.
- [[video-11-flujo-de-informacion|Video 11 — Flujo de información]] — la segunda mitad de esta misma jornada.
- [[principio-de-kerckhoffs|Principio de Kerckhoffs]] — el principio 5 ya desarrollado, con la consecuencia sobre el César.
- [[seguridad-computacional|Seguridad computacional]] — el *"our realm"* de la filmina final y el fondo de la seguridad *unbounded*.
- [[secreto-perfecto|Secreto perfecto]] — el otro extremo de la escala del anexo.
- [[modelos-de-ataque|Modelos de ataque]] — la taxonomía de la filmina de 1:02:42, ya desarrollada.
- [[eleccion-de-primitivas|Elección de primitivas en un proyecto]] — el largo de clave como decisión de diseño.
- [[bibliografia#2. Matt Bishop — Computer Security: Art and Science|Bibliografía]] — Bishop, y el mapeo de capítulos que contradice el número de la filmina 16.
- [[videografia#Los 13, con sus datos duros|Videografía]] — dónde encaja este video entre los 13.
- [[cronograma|Cronograma]] — Clase 8, 15/10.
