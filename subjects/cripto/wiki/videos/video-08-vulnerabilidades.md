---
title: Video 08 — Vulnerabilidades
resumen: 'Grabación de 2022 sobre análisis de vulnerabilidades: da el armazón de proceso —ecuación de riesgo, cadena de bug a efecto, modelado de amenazas y STRIDE— sin ningún catálogo de vulnerabilidades concretas.'
fuentes: ["[[videografia]]", "[[cronograma]]", "[[programa-y-objetivos]]"]
aliases: [Video 08, Vulnerabilidades (video), Análisis de vulnerabilidades, Ecuación de riesgo, STRIDE, Modelado de amenazas]
type: video
clase: 8
orden: 42
video: 08
youtube: ruyLU5fA3Tw
created: 2026-09-03
updated: 2026-09-04
tags: [video, seguridad, vulnerabilidades, riesgo, modelado-de-amenazas, stride, programacion-defensiva, bloque-2]
sources: ["https://www.youtube.com/watch?v=ruyLU5fA3Tw"]
---

# Video 08 — Vulnerabilidades

| | |
|---|---|
| **Video** | [Vulnerabilidades](https://www.youtube.com/watch?v=ruyLU5fA3Tw) — título de YouTube: *Criptografía y Seguridad Informática - Vulnerabilidades* |
| **Duración** | 49:13 |
| **Subido** | 03/06/2022 (`upload_date` de la metadata; la [[videografia\|Videografía]] lo fecha el **02/06/2022** — un día de diferencia, casi seguro por zona horaria. ***(Lectura nuestra.)***) |
| **Visibilidad** | **Público**. Es uno de los **3 de los 13** que no son *unlisted*. |
| **Docente** | **Rodrigo Ramele**. Es su canal, el segundo mazo es un Keynote propio y las anécdotas van en primera persona. **Adentro del video no hay webcam, ni nombre en pantalla, ni presentación**: la atribución es por procedencia, no por evidencia interna. |
| **Ancla en el [[cronograma#Segunda mitad — Seguridad (hasta el 2do parcial)\|cronograma]]** | **Clase 8 — Principios de diseño y vulnerabilidades**, 15/10 · **Guía 9 — Vulnerabilidades**, 02/11 |
| **Ancla en el [[programa-y-objetivos#Contenidos\|programa]]** | *"Verificación · auditorías · penetration testing · análisis de vulnerabilidades"* — Clase 8 / Guía 9 |

**Vale la pena verlo si buscas el armazón de proceso con el que la materia mira una aplicación** —la ecuación de riesgo, la cadena bug → vulnerabilidad → amenaza → efecto, los cinco pasos del modelado de amenazas y `STRIDE`—; **no lo mires esperando un catálogo de vulnerabilidades concretas**, porque no hay ninguno.

---

## Dos advertencias que van antes que el contenido

### 1. Es el único de los 13 videos cuyo carácter no se puede determinar

De los 13 videos de la playlist, **11 están probados como grabaciones de clase en vivo** (alumnos con nombre, turnos de habla, negociación del recreo en tiempo real) y **2 —los de teoría de números— están probados como videos complementarios producidos aparte**. Éste es el único que queda sin decidir, y la verificación lo dejó explícitamente así:

- **Cero marcas de audiencia en 7088 palabras de transcripción.** Ni un vocativo, ni una pregunta al curso, ni un nombre propio de alumno, ni micrófono, ni chat, ni recreo, ni despedida.
- **Pero tampoco marcas de estudio.** Los frames son screencast puro de filminas: no hay webcam, no hay UI de videoconferencia, no hay pestaña de Blackboard Collaborate —que es justamente lo que resuelve el caso en los Videos 10 y 13—.
- **Lo único que hay es deixis de curso sin interlocutor**: a 02:48 dice *"esta clase"* y *"la clase que sigue"*, y a lo largo del video habla de *"ustedes"*.

Puede ser una clase remota donde nadie habló, o una grabación de filminas hecha en soledad. **Con lo disponible no se puede decidir, y la nota no elige.** Lo que sí baja la confianza del argumento: el ASR es de 2022 y de calidad muy mala, aunque eso no explica la ausencia de marcas —el Video 08 tiene el ASR igual de destrozado que otros y aun así deja pasar *"ustedes"* y *"esta clase"*—.

**Por qué importa para estudiar:** si no hubo audiencia, no hay preguntas de alumnos, y las preguntas de alumnos son de dónde salen las marcas de parcial en las otras grabaciones. Eso explica que acá casi no haya ninguna (ver [[#Qué dijo sobre la evaluación|Qué dijo sobre la evaluación]]).

### 2. No hay OWASP Top 10, ni CWE, ni CVE, ni CVSS

**Ninguna de esas siglas aparece, ni en audio ni en pantalla.** Es exactamente lo que uno esperaría de una clase titulada *Vulnerabilidades*, y no está. El enfoque del video es **de proceso y de análisis de riesgo**, no catálogo de bugs: no vas a encontrar buffer overflow, ni injection, ni XSS como tipos enumerados.

Lo más cercano en todo el corpus de video está en el **[Video 13 — Tips Generales sobre el Final](https://www.youtube.com/watch?v=6rhEdPeqXcs)** (`XSS`, SQL injection, Broken Access Control, alrededor de 17:19-30:47). Ojo: ése es **repaso para el final, de 2024, y lo dicta el Ing. Lautaro Pinilla, no Ramele**.

> [!quote]- Del video — el enganche con las clases que siguen (02:48)
> *"esta clase va a estar muy presente también en la clase que sigue (…) pen testing"*
>
> *(Cita limpiada del ASR; ver [[#Lo que no se pudo verificar|Lo que no se pudo verificar]].)*

Eso encadena este video con los dos de pentesting: el **[Video 09 — Pentesting (2025)](https://www.youtube.com/watch?v=6KPkCyJ_W7M)**, que da la metodología y lo dicta Ramele, y el **[Video 10 — Pentesting (2024)](https://www.youtube.com/watch?v=-YLJdMMCkN4)**, que es el laboratorio hands-on y lo dicta Pinilla. **No son dos versiones del mismo material**: son clases distintas, de docentes distintos, de años distintos, y son complementarias.

---

## Recorrido

Los cortes salen de los cambios de filmina en pantalla. La columna *Qué se ve* importa porque **el vault no tiene ninguna de estas filminas**.

| Desde | Hasta | Tramo | Qué se ve en pantalla |
|---|---|---|---|
| 00:00 | 01:45 | Apertura: no inventes tu propio algoritmo (`WEP`) | Portada: foto de una caja fuerte de doble puerta abierta, título *Criptografía y Seguridad*, subtítulo *Análisis de vulnerabilidades* |
| 01:45 | 04:50 | Confianza y aseguramiento | Filmina de definiciones, con recuadro gris al pie: *estos conceptos no aplican sólo a seguridad* |
| 04:50 | 07:05 | Establecer confianza · **la ecuación de riesgo** | Diagrama de flechas hacia las cajas *Costosos* y *Complejos*; banda celeste al pie con la ecuación |
| 07:05 | 09:35 | Política, Aseguramiento y Mecanismo | Tres cajas verticales encadenadas; la palabra *evidencia*, subrayada |
| 09:35 | 11:15 | Niveles de evidencia | Filmina de tres niveles: informal, semiformal, formal |
| 11:15 | 14:45 | Las nueve fuentes de problemas | Lista numerada 1-9, atribuida en la filmina *"por Peter Newman"* |
| 14:45 | 17:50 | Aseguramiento en el ciclo de vida | Cuatro etapas con su derivación marcada por flechas |
| 17:50 | 19:45 | Amenaza contra vulnerabilidad · **la cadena** | Cuatro cajas celestes al pie: Bug · Vulnerabilidad (Debilidad) · Amenaza · Efecto no deseado |
| 19:45 | 23:40 | Modelado de amenazas: tres perspectivas · digresión *unbound* | Filmina de las tres perspectivas; se queda quieta ~4 min mientras habla |
| 23:40 | 25:10 | Entradas y salidas del modelado | Entradas y salidas; *conocimiento de la función primaria* resaltado en azul |
| 25:10 | 26:25 | **El ciclo de cinco pasos de Microsoft** | Diagrama circular de MSDN con cajas agregadas por la cátedra: *Bugs*, *DevSecOps*, `STRIDE` |
| 26:25 | 28:35 | Paso 1 — Identificar objetivos de seguridad · digresión cripto/smart contracts | Filmina de objetivos, con la pregunta guía *qué es lo que NO queremos que pase* |
| 28:35 | 32:05 | Paso 2 — Conceptualizar la aplicación · digresión DevSecOps | Filmina de deployment, roles, tecnologías, mecanismos; quieta ~3 min |
| 32:05 | 33:35 | Web App Security Frame | Las diez áreas listadas |
| 33:35 | 35:00 | Paso 3a — Zonas de confianza | Zonas externas y zonas privilegiadas, con ejemplos |
| 35:00 | 36:10 | Paso 3b — Flujo de datos | Refinamiento por niveles: capas → páginas → componentes |
| 36:10 | 37:35 | Paso 4 — Identificar amenazas: listas recurrentes | Las dos formas, con el link a MSDN `ms978518.aspx` |
| 37:35 | 37:55 | **STRIDE** | Filmina de las seis letras, primera letra de cada término en rojo; la amplía a pantalla completa y se lee la barra del visor: página 18 de 23 |
| 37:55 | 39:40 | Cambio de mazo · Defense-Detect-React-Recover | Portada *Defensive Programming* con foto del Coliseo; filmina *Attack Tree and Threat Model* con el círculo en cuatro cuadrantes |
| 39:40 | 43:50 | **Etapas de detección ordenadas por impacto** | Cadena de cajas oscuras encadenadas; queda ~4 min en pantalla |
| 43:50 | 44:00 | Pasada rápida: Secure Architecture y Storage | **Dos filminas en tres segundos, sin explicar** |
| 44:00 | 45:50 | Programación defensiva | Filmina de la escoba y seis burbujas |
| 45:50 | 48:50 | **Caso real: la API OData sobreexpuesta** | Dos filminas de código: la versión ingenua y el parche |
| 48:50 | 49:13 | Tip Points y cierre | Filmina final de seis puntos; anuncia que sigue en otra parte |

**El video corta a 49:13 anunciando que continúa con la misma presentación.** Esa continuación **no está en este archivo**, y no se identificó a qué otro video del corpus corresponde —si es que corresponde a alguno—.

---

## Son dos mazos, no uno

Es el dato de catalogación que hay que anotar, porque cambia qué material hay que buscar.

| Tramo | Mazo | Qué es |
|---|---|---|
| 00:00 - 37:55 | **`Clase 12 - Analisis de vulnerabilidades.pdf`**, 23 páginas | Material de cátedra. El nombre y el conteo de páginas se leyeron **ampliando la barra de título del visor de PDF a 37:38**. |
| 37:55 - 49:13 | **`Developer's.Hardening.SMILE.key`** | Keynote propio del docente. **No es material de cátedra numerado.** |

> **Ojo con la numeración.** El PDF que proyecta se llama literalmente *Clase 12*, y el [[cronograma]] de 2026 2C lo ancla en la **Clase 8**. No es contradicción: es que el numerado del archivo viene de otra edición de la materia. Vale dejar constancia del nombre real por si el PDF aparece suelto en el campus.

La consecuencia práctica: **la última cuarta parte del video no está respaldada por ninguna filmina de cátedra**. Postura defensiva, cadena de detección, secure architecture, storage, programación defensiva y el caso OData salen todos del Keynote personal.

---

## El armazón conceptual

Es lo que la clase repite y sobre lo que apoya todo lo demás.

### La ecuación de riesgo

$$\text{Riesgo} = \text{Amenazas} \times \text{Vulnerabilidades} \times \text{Bienes}$$

Aparece en la banda celeste al pie de la filmina de *Establecer confianza* (02:51) y vuelve varias veces. **Se usa como criterio de decisión, no como fórmula de cálculo**: si no se puede eliminar la amenaza, se bajan las vulnerabilidades —mejorando el código para que haya menos bugs— o se reduce el impacto sobre los bienes —poniendo restricciones—, en vez de bloquear la funcionalidad.

### La cadena que ordena todo lo demás

Bug → **Vulnerabilidad (Debilidad)** → Amenaza → **Efecto no deseado**

Son las cuatro cajas celestes al pie de la filmina de *Análisis de requerimientos* (17:56). La definición operativa: **un bug se vuelve vulnerabilidad cuando se lo puede explotar para romper un requerimiento de seguridad**; esa vulnerabilidad habilita una amenaza; y la amenaza consumada produce el efecto no deseado. La filmina aclara **explícitamente** que las amenazas no son vulnerabilidades: *una vulnerabilidad permite que una amenaza ocurra*.

**Amenaza**, definida en la misma filmina: *evento potencial que tiene como consecuencia un efecto no deseado en el sistema*.

### Confianza y aseguramiento

| Término | Definición de la filmina (01:49) |
|---|---|
| **Sistema confiable** | Sistema que cuenta con **suficiente evidencia creíble** para que uno crea que va a cumplir con un conjunto de requerimientos. **La confianza no es una escala discreta**: es gradual, no un sí o no. |
| **Aseguramiento** | La **confianza obtenida a través de técnicas específicas**. Es la justificación de por qué uno confía. |

La filmina remata con un recuadro al pie: **estos conceptos no aplican sólo a seguridad**. El docente lo desarrolla diciendo que la seguridad informática le copia mucho a la seguridad financiera —certificaciones, estandarización de procesos, auditorías de terceros, requisitos para empresas que cotizan en bolsa—.

**Cuatro vías para establecer confianza** (02:51): procesos de aseguramiento, adhesión a estándares, documentación y **revisión por expertos**. La filmina marca con flechas que la revisión por expertos es **la más efectiva** si existen las otras tres, y a la vez la más costosa y la más compleja.

### Política, Aseguramiento, Mecanismo

Tres cajas encadenadas (07:09), y es la parte de la clase donde más insiste:

| Nivel | Qué es |
|---|---|
| **Política** | Requerimientos que definen **explícitamente** las expectativas de seguridad |
| **Aseguramiento** | Justificación de que el mecanismo sigue la política, **a través de evidencia** |
| **Mecanismo** | Ejecutables diseñados e implementados para hacer cumplir las políticas |

El punto que machaca: **decir que algo es seguro sin ofrecer evidencia es una señal de alarma**. Trae el caso del voto electrónico y el CEO que afirmaba que su sistema era totalmente seguro sin mostrar un solo documento.

> [!quote]- Del video — la señal de alarma (07:48)
> *"cuando alguien justamente dice que algo es seguro y no ofrece más nada que eso"*

**Niveles de evidencia** (09:41): **informal** (enunciados, analogías) · **semiformal** (pseudocódigo, análisis caso por caso) · **formal** (métodos matemáticos, lenguajes formales de demostración de teoremas). Menciona el área de Marcelo Frías en el ITBA como la que cubre verificación formal, y aclara que **probar formalmente una pieza de código sólo se justifica en criticidad extrema**, tipo riesgo de explosión nuclear.

### Aseguramiento en el ciclo de vida

La filmina de 14:49 dice que el aseguramiento **abarca todas las etapas** y se adapta a cualquier ciclo de vida de desarrollo: requerimientos deriva en análisis de amenazas y formación de políticas; diseño, en modelo de seguridad; implementación, en consistencia y trazabilidad; mantenimiento, en control y configuración. El argumento hablado: **no dejar la seguridad para el final del proyecto**, con Internet como ejemplo de protocolos que originalmente no traían nada de seguridad incorporado. Y agrega que el aseguramiento va más allá del código: manejo de credenciales, papeles de la corporación, cultura de la organización.

---

## Las cinco clasificaciones, que conviene no confundir

Esto es lo que la clase da **en lugar de** una taxonomía de vulnerabilidades concretas. Son cinco cosas distintas y clasifican objetos distintos.

| # | Clasificación | Qué clasifica | Dónde |
|---|---|---|---|
| 1 | **Fuentes de problemas** (nueve ítems) | **Causas** | 11:15 |
| 2 | **Amenazas por consecuencia** — pérdida de confidencialidad, pérdida de integridad, denegación de servicio | **Consecuencias** | 17:50 |
| 3 | **STRIDE** (seis letras) | **Tipos de ataque** | 37:35 |
| 4 | **Web App Security Frame** (diez áreas) | **Superficie a revisar** | 32:05 |
| 5 | **Bug → Vulnerabilidad → Amenaza → Efecto** | **Ordena a las otras cuatro** | 17:50 |

### Las nueve fuentes de problemas

Tal como aparecen en la filmina de 11:18:

1. Requerimientos incompletos, incorrectos o faltantes
2. Fallos en el diseño
3. Fallos en la implementación del **hardware**
4. Fallos en la implementación del **software**
5. Errores de uso por errores de operación
6. Uso indebido del sistema
7. Fallos de los equipos o del medio de comunicación
8. Casos de fuerza mayor y desastres
9. Errores al actualizar, mantener o **decomisar**

El argumento con el que las une: **todas comparten lo mismo —son bugs—, y el bug que toca un objetivo de seguridad es el que se vuelve vulnerabilidad.**

**La filmina dice literalmente *"por Peter Newman"***, verificado ampliando el frame de 11:19 a 1400 px. ***(Lectura nuestra.)*** Casi con seguridad se refiere a **Peter G. Neumann**, el de *Computer-Related Risks* y el moderador del RISKS Digest — pero acá se reporta lo que dice la filmina, no lo que debería decir, y no se pudo renderizar el PDF original para confirmarlo.

> [!quote]- Del video — por qué el software nunca queda limpio (12:23)
> *"es muy complejo hacer código que realmente sea [seguro], un sistema que realmente sea muy seguro, porque es muy difícil que el software esté exento de [bugs]"*

Alrededor de ese punto hay una digresión que vale: **el software no evoluciona como una ingeniería sino más bien como algo biológico**, y una variable que nació con un objetivo y se reusa para otro es fuente típica de bug.

### STRIDE, letra por letra

La filmina (36:12) trae la instrucción de uso: **por cada *trust boundary*, preguntarse cómo un atacante podría intentar cumplir cada una de esas seis amenazas.** Es un cuestionario, no una lista para memorizar.

| Letra | Amenaza | Glosa del docente |
|---|---|---|
| **S** | Spoofing | Hacerse pasar por otro |
| **T** | Tampering | Alterar algo de una manera no prevista por el diseño. Ejemplo: fraude bancario en cajeros (36:43) |
| **R** | Repudiation | Negar haber hecho algo. Se contrarresta **firmando** |
| **I** | Information disclosure | — (la filmina la lista; en audio no la glosa aparte) |
| **D** | Denial of Service | La **supervivencia** del sistema |
| **E** | Elevation of privilege | Conseguir más permisos de los autorizados |

### Web App Security Frame

Las diez áreas a considerar (32:07): validación de entradas y datos · autenticación · autorización · administración de configuración · datos sensitivos · manejo de sesión · criptografía · manipulación de parámetros · manejo de excepciones · auditoría y logs.

---

## El proceso de modelado de amenazas de Microsoft

Es el eje de la segunda mitad del PDF. El diagrama de 25:15 está tomado de `msdn.microsoft.com/en-us/library/ms978516.aspx`, y **la cátedra le agregó tres etiquetas propias**: cajas *Bugs* y *DevSecOps* al costado, y `STRIDE` con una flecha apuntando al paso 4.

**Paso 1 identifica los objetivos; los pasos 2 a 5 ciclan.**

| Paso | Nombre | Qué pide la filmina | Timestamp |
|---|---|---|---|
| 1 | **Identify Security Objectives** | Confidencialidad, integridad, disponibilidad. Partir de los objetivos del sistema y considerar límites, con la pregunta guía **qué es lo que NO queremos que pase** — y trabajar para atrás desde ahí | 26:25 |
| 2 | **Application Overview** | Esquematizar el deployment (topología y capas, componentes críticos, servicios críticos e interfaces externas, protocolos) · identificar roles y sus casos de uso clave · identificar tecnologías (SO, web server, DB server, lenguaje, frameworks) · identificar los mecanismos de seguridad ya presentes | 28:35 |
| 3 | **Decompose Application** | (a) Identificar **zonas donde cambia el nivel de confianza requerido**. (b) Identificar el **flujo de datos** entre esas zonas | 33:35 |
| 4 | **Identify Threats** | Dos formas: arrancar de una **lista de amenazas recurrentes**, o **derivar amenazas mediante preguntas**. Acá entra `STRIDE` | 36:10 |
| 5 | **Identify Vulnerabilities** | (la filmina lo lista como paso del ciclo; el video no le dedica una lámina propia) | — |

**Entradas y salidas del modelado** (23:42) — *Entradas*: conocimiento de la función primaria de la aplicación (**resaltado en azul en la filmina como el más importante**), casos de uso e historias, flujo de datos, esquemas y modelos E/R, diagramas de deployment. *Salidas*: **lista de amenazas** y **lista de vulnerabilidades**.

**Tres perspectivas para armarlo** (19:50): centrado en el **atacante** (explota objetivos de un atacante) · centrado en el **software** (explota tipos de ataques a componentes) · centrado en **productos o assets** (explota ataques a productos y servicios).

**Zonas de confianza, detalle del paso 3a** (33:35) — *Zonas externas*: acceso al sistema de archivos del servidor, acceso a la base de datos, acceso a web services. *Zonas privilegiadas*: partes accesibles sólo para un rol particular. Ejemplos de la filmina: Internet e intranet, web server, db server; **el reporte de sueldos como zona para managers**. El docente lo extiende a contratos con otras empresas y listas de precios.

**Flujo de datos, detalle del paso 3b** (35:00) — Seguir la información desde su ingreso hasta su salida marcando los puntos de entrada y salida relevantes, y **refinar por niveles**: primero el flujo por capas (browser → web → middle → db → filesystem), después entre páginas, después entre componentes.

### La analogía del QA, y por qué invertir en seguridad no termina nunca

Dos ideas habladas que no están en ninguna filmina y que son de lo mejor del tramo:

- **El que modela amenazas tiene que sacarse el sombrero de desarrollador y ponerse el de atacante.** Es la misma separación que justifica que QA sea otra persona.
- **Invertir en seguridad es *unbound*.** No tiene tope: se puede meter plata y paranoia indefinidamente. Por eso hay un punto donde hay que parar, y **la decisión se toma con la ecuación de riesgo**: en vez de bloquear la funcionalidad, se atacan los otros factores.

> [!quote]- Del video — la seguridad como pozo sin fondo (22:14)
> *"es un pozo de plata y no termina nunca jamás, porque ustedes pueden ser todo lo paranoico que se les cante"*

> [!quote]- Del video — la palabra clave de la clase (25:01)
> *"no asumir nada"*

---

## El segundo mazo: Developer's Hardening

Desde 37:55. Cambia de aplicación y se ve la ventana de Keynote.

### Defense · Detect · React · Recover

Los cuatro cuadrantes del círculo azul de la filmina de 38:19 (*Attack Tree and Threat Model*): **Defensive Posture · Ability to Detect · Ability to React · Ability to Recover**. La idea: **el sistema no sólo tiene que defenderse; tiene que poder detectar que algo pasó, reaccionar, y volver al estado normal.**

Ejemplo del PIN (38:32): el sistema **detecta** un exceso de PINs incorrectos → entra en **modo defensivo** y bloquea → **reacciona** dejando un flag que registra el exceso → después de un *time-out* se **recupera** solo y vuelve al modo normal.

A la izquierda de la misma filmina: *Risk Analysis*, *Threat Model*, *Attack Tree* con *Attack Surface*, *Security Logs* y *Countermeasures List*; más *Apply known security policies* con *Secure Development Practices*, y *Let anyone know about it* con *Add it into the Done Criteria*.

### La cadena de etapas de detección, ordenada por impacto

Es la idea más portable del video. La filmina de 39:43 encadena, de mayor a menor impacto del bug:

**Deploytime ≫ QA-time ≫ CI-time ≫ test-time ≫ runtime ≫ compile-time ≫ intellisense-time**

- **Deploytime** es donde el bug tiene el **máximo impacto posible**; **intellisense-time**, el mínimo.
- La estrategia es **empujar la detección hacia la derecha de la cadena**. Que el editor te lo marque antes de compilar es un golazo.
- El porqué se cierra con la ecuación de riesgo: **menos impacto del bug significa menos amenaza, y menos amenaza significa menos riesgo.**
- Corolario: **los lenguajes fuertemente tipados atrapan más bugs en compilación.** Nombra **Rust** como caso extremo por lo específico de sus conversiones de datos.

Comentario al margen: en muchas empresas QA y testing funcional son **áreas separadas con gerentes distintos**.

### Programación defensiva

La filmina de 43:58 —la de la escoba y las burbujas— trae seis prácticas: **Coding Standards · Respect Contract · Size of Variables · Variable Domain · Assert Unexpected Input · KISS (Avoid complexity)**. A la izquierda: *Parameters Sanitation*; *Software Quality*, con la idea de que **cuando se desarrolla software de calidad se desarrolla software seguro también**; la cita de **Kernighan y Plauger (1981)** sobre escribir el programa para que sobreviva pequeños desastres; y **Do not ASS-U-ME anything**.

Lo que agrega hablado: **no asumir nada sobre la entrada**, sanitizar **todos** los parámetros, y el corolario propio:

> [!quote]- Del video — por qué la simplicidad es una propiedad de seguridad (45:36)
> *"el código simple es siempre el código que en general va a ser [...] más seguro"*

El argumento: en el código complejo **es imposible ver todas las aristas**.

### Las dos filminas que pasan sin explicación

**Secure Architecture** (43:55) y **Storage** (43:57) **pasan en menos de tres segundos cada una** mientras scrollea el Keynote. **No hay audio asociado: él no las explicó.** Se leyeron ampliando el frame, así que el contenido es fiel a lo que dice la filmina, pero **hay que tratarlas como material de referencia, no como algo dictado**.

- **Secure Architecture** — Trusted Operating System · Whitelisting (Bit9), con Carbon Black Bit9 y Endpoint Protection · DMZ más Firewall · Password vaults. Sobre un diagrama de LAN y DMZ con `HTTPS` verificando certificado de servidor **y** de cliente.
- **Storage** — Infraestructura: `HSM`, keystore, security appliance, tokens. Encrypted file systems: `EncFS`/`Loop-AES` en Linux, `EFS` en Windows, `FileVault` en macOS. Encima, una capa opcional de **encripción a nivel de aplicación con esquema KEK + DEK** —una *key encryption key* que protege la *data encryption key*—, más *Key Lifecycle*, y los ítems marcados con X: **data remanence** y **secure deletion**. El lema de la filmina: **hay que poder recuperar la información, y recuperarla de forma segura.**

---

## El caso OData: el único ataque concreto del video

Es el cierre (45:50-48:50) y **el único ejemplo desarrollado punta a punta**. Aparece como anécdota, no como parte de una taxonomía.

### El escenario

Un **servicio de backend mobile en la nube** generaba APIs **directamente sobre las entidades de la base de datos** y las exponía por **OData** — un protocolo de consulta tipo SQL sobre HTTP, donde el cliente manda un diccionario con operadores (por ejemplo, *temperatura igual a cinco*, equivalente a un `select`).

**Por qué era cómodo:** resolvía sincronización, escenarios offline y **todas las plataformas** sin duplicar código.

**Cuál era el agujero:** el cliente podía mandar **cualquier query** y acceder a **cualquier información** dentro de la base. Un canal abierto, análogo a una SQL injection pero con OData, **sin ninguna estructura que preguntara nada**. Generó tantos problemas que **dieron de baja el servicio** y cambiaron toda la estructura por un sistema nuevo que no lo permitía.

### El código, antes y después

La filmina de 45:53 muestra **la versión sin defensa**: `function read(query, user, request)` que llama directamente a `request.execute()`. Ejecuta lo que venga.

La de 47:37 muestra **el parche**, que el docente escribió él mismo: recorre el **árbol parseado del filtro** —`query._parsed.filter`, con sus ramas `right` y `left`— verificando que estén definidos y que sus miembros sean **exactamente `Acct_Id` e `Id_Contacto`**. Sólo si el filtro pasa el chequeo llama a `request.execute()`; en cualquier otro caso responde `request.send(FORBIDDEN)`. La filmina lleva un comentario en línea diciendo que filtra por `Acct_id` e `Id_Contacto`.

> El código de arriba está **descripto a partir de los frames**, no transcripto carácter por carácter de la filmina. Los nombres de identificador (`query._parsed.filter`, `Acct_Id`, `Id_Contacto`, `request.send(FORBIDDEN)`) sí se leyeron en pantalla; la forma exacta del recorrido del árbol, no.

### La moraleja, que es lo interesante

**El propio docente admite que el parche es feo**, y que resultaba **imposible cubrir todas las situaciones filtrando de esa manera**: el problema de fondo estaba en la infraestructura, no en la función. Es el mejor ejemplo del video de por qué la seguridad tiene que entrar en el **diseño** y no como remiendo — que es exactamente lo que dice la filmina de *Aseguramiento en el ciclo de vida* treinta minutos antes.

### Tip Points, la filmina de cierre (48:50)

- *Correctness is a local property* — **never ass-u-me other parts behave correctly for you**
- *Thinking securely from the beginning of every project*
- *Store information securely*
- **Your best defense is to mistrust all your data**
- *Defense - Detect - React - Recover*
- *Logs*

---

## Qué dijo sobre la evaluación

**Casi nada, y es coherente con que no haya audiencia.** Hay **una sola marca explícita**, alrededor de 09:20, y es indirecta: dice que el hecho de que hacer un sistema seguro sea **hipercomplejo** es un mensaje que la cátedra intenta transmitir en toda la parte de criptografía, y que después *"se intenta ver en los finales"* que los alumnos sean conscientes de eso.

> [!quote]- Del video — lo más cerca que llega de una marca de evaluación (09:33)
> *"seguridad [es] muy compleja, hacer un sistema seguro es híper complejo, muy difícil"*

**No dijo en ningún momento que algo entre en el parcial, ni marcó ninguna filmina como especialmente evaluable.**

Por contenido, lo que la clase machaca y repite tres veces es **la ecuación de riesgo** y **la distinción amenaza / vulnerabilidad**. ***(Lectura nuestra.)*** Eso no lo señaló él.

---

## Los tramos que no aportan

Se dicen para que nadie los mire dos veces buscando qué se perdió.

| Tramo | Qué es |
|---|---|
| **20:00-23:40** | Digresión hablada sobre lo *unbound* de la inversión en seguridad, con el ejemplo de las tarjetas de crédito y el comercio electrónico. La filmina no cambia en todo el tramo. La idea vale; el desarrollo es largo. |
| **26:40-28:30** | Digresión sobre la cantidad de startups cripto, la barrera de entrada al desarrollo artificialmente baja porque se ignora el aspecto de seguridad, y que van a quedar un montón de smart contracts mal hechos y clavados por ser inmodificables. **El ASR es prácticamente inservible acá**: sólo se recupera la idea general, sin detalle ni filmina que la respalde. |
| **29:00-32:00** | Digresión sobre **DevSecOps**: integración y entrega continua, y el recuerdo de cuando para salir a producción había que llenar un formulario de Word diciéndole a Operaciones qué binarios reemplazar, porque el desarrollador no tenía acceso al server. El punto real: **ese caos entre Dev y Ops genera por sí solo problemas de seguridad.** La filmina no cambia. |
| **11:50-11:57** | Pasa las filminas rápido hacia adelante y atrás mientras sigue hablando. No hay contenido nuevo. |
| **05:08 y 26:36** | Dos tramos de música o silencio donde el ASR marca `[Música]`. No se pierde nada sustantivo. |

---

## Lo que no se pudo verificar

Todo esto sale de los caveats de la ingesta y hay que leerlo antes de citar cualquier número o nombre propio de esta nota.

**La transcripción es ASR automático de YouTube y viene muy degradada.** Hay tramos enteros donde las frases no cierran. Lo obvio se corrigió por contexto: *"rc 9"* es `RC4`, *"803 euros"* es 802.11, *"cuba quality assurance"* es QA, *"el seco"* es DevSecOps. **Las citas de esta nota están limpiadas del ASR**: son fieles al sentido, pero **no las tomes como transcripción literal palabra por palabra**. Los corchetes marcan lo reconstruido; `[...]` marca una palabra que el ASR destruyó. Tampoco se corrió Whisper, así que **no hay una segunda pista para cotejar los tramos ilegibles**.

**Nombres propios dudosos que no se pudieron verificar en imagen:**

| Qué | Dónde | Estado |
|---|---|---|
| La certificación exigida a empresas que cotizan en bolsa estadounidense | 03:43 | El ASR dice *"la certificación de inicio"*. **Por contexto sería SOX, pero no se afirma.** |
| El banco que nombra | 35:48 | El ASR dice *"interbank"* o *"interbanking"*. Sin confirmar. |
| El servicio de nube del caso OData | 45:53 en adelante | Sólo se escucha claro *"mobile services"*, y él lo atribuye a Microsoft porque *"lo dio de baja"*. **Muy probablemente Azure Mobile Services, pero es inferencia y no está escrito en ninguna filmina.** ***(Lectura nuestra.)*** |
| La herramienta de CI que nombra | 31:51 | Suena a *"bambú"*, o sea **Bamboo**. Tampoco está en pantalla. |
| La cifra de variantes de conversión de datos de Rust | 43:00 | **El ASR la destruye por completo** (*"82 millones"*). **No se reporta.** Lo que sí se entiende es la idea: los lenguajes fuertemente tipados atrapan más bugs en compilación. |

**Cobertura de frames.** El barrido por escena dio sólo 44 frames en 49 minutos, porque el video es casi todo filminas estáticas; se reforzó con 12 frames dirigidos a los huecos y 13 recortes ampliados para leer texto chico. Así se confirmó que en los tramos largos sin cambio de frame (20:00-23:40, 29:00-32:00, 40:00-43:50) **la filmina efectivamente no cambia**: son digresiones habladas. Aun así, **si hubo alguna anotación efímera hecha con el cursor sobre una filmina, no se habría capturado.**

**Sobre la Guía 9: nada.** El video **no menciona la guía práctica ni resuelve ningún ejercicio de ella**. El mapeo a la Guía 9 es temático —viene del [[programa-y-objetivos#Contenidos|programa]] y de la [[videografia#Los 13, con sus datos duros|Videografía]]—, no de nada que se diga adentro del video.

**Sobre pentesting: sólo la mención de paso de 02:48.** No se desarrolla nada.

---

## Dónde queda este video en la cobertura del Bloque 2

La verificación adversarial dejó este balance, y ubica al Video 08 en la parte buena:

| Tema del Bloque 2 | Cobertura en video |
|---|---|
| Principios de diseño | **Sólida y doble** — Videos 06 (vigente) y 07 (complementario) |
| **Vulnerabilidades · riesgo · threat modeling** | **Sólida** — **este video** más el bloque final del Video 06 |
| Pentesting — metodología | **Sólida** — Video 09 |
| Pentesting — práctica | **Parcial** — Video 10: laboratorio reconstruible, pero **sin transcripción** |
| Flujo de información · confinamiento · canales ocultos | **Sólida** — Video 11 |
| Protección de datos · compliance | **Sólida** — Video 12 |
| Control de acceso · ACLs · capacidades | **Nula** |
| Políticas y modelos de seguridad | **Nula** — sólo dominancia aplicada, en el Video 11 |
| Autenticación | **Nula** |
| Malware | **Nula** — un solo hit en los ocho videos, y es una anécdota |

Dicho de otro modo: **este video cubre bien su casillero**, y lo que le falta —la taxonomía concreta— tampoco lo tapa ningún otro.

