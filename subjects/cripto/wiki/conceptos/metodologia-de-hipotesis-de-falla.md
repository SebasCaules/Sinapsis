---
title: Metodología de hipótesis de falla
resumen: 'Procedimiento de cinco pasos con el que se ejecuta una prueba de penetración: recolección de información, hipótesis, prueba, generalización y eliminación; la generalización es, según la cátedra, el más importante.'
fuentes: ["[[clase-08-principios-de-diseno-y-vulnerabilidades]]", "[[video-09-pentesting-metodologia]]", "[[verificacion-formal-y-prueba-de-penetracion]]"]
aliases: [Metodología de hipótesis de falla, Hipótesis de Falla, Cinco pasos de la metodología de hipótesis de falla, Pivoting, Post-it con la contraseña]
type: concepto
unidad: 2
clase: 8
orden: 9
created: 2026-09-04
updated: 2026-09-06
tags: [seguridad, pentesting, hipotesis-de-falla, metodologia, pivoting, clase-08, sin-dictar]
sources: ["Clase 13 - Pentesing.pdf"]
---

# Metodología de hipótesis de falla

**El procedimiento de cinco pasos con el que se ejecuta, en la práctica, la definición de prueba de penetración que da la filmina anterior — y la explicación de por qué el paso que menos suena a lo que produce ("generalización") es, según la propia cátedra, el más importante de los cinco.** Es, según `video-09`, el contenido que la clase marca de forma más explícita como *lo que hay que llevarse*.

Cubre las filminas **6 a 16** del deck de Pentesting. **Esta clase todavía no se dictó** (hoy es 04/09/2026); lo que sigue está escrito contra el PDF, cruzado con [[video-09-pentesting-metodologia|video-09]], que desarrolla este mismo bloque en voz con un nivel de detalle que coincide filmina por filmina con el deck, más lecturas propias rotuladas como tales.

## Metodología informal, antes de los cinco pasos

La filmina 6 da el trazo grueso: **determinar y cuantificar objetivos** —por ejemplo, obtener información de clientes—; **encontrar cierta cantidad de vulnerabilidades, o buscarlas durante un período de tiempo acotado** —el estudio siempre se conduce desde el punto de vista de un atacante—; y **estudiar y categorizar los hallazgos**, porque el éxito de una prueba de penetración proviene del análisis de los hallazgos, no de la cantidad encontrada: permite detectar problemas recurrentes y enfocarse sistemáticamente en familias enteras de problemas, en vez de parchear uno por uno.

## Los cinco pasos

La filmina 7 es, según [[video-09-pentesting-metodologia#4. Metodología de Hipótesis de Falla|video-09]], la más importante de toda la clase — el docente la repite tres veces a lo largo del video y la marca explícitamente:

> [!quote]- Del video 09 — la marca explícita (40:58)
> "Esto es lo más importante de esta clase y esto es lo que se tienen que acordar."

| # | Paso | Qué produce |
|---|---|---|
| 1 | **Recolección de información** | Un modelo del sistema y sus partes, para conocerlo y entender su funcionamiento |
| 2 | **Hipótesis** | Asumir la existencia de vulnerabilidades concretas |
| 3 | **Prueba** | Probar las vulnerabilidades hipotetizadas |
| 4 | **Generalización** | Generalizar patrones y encontrar otras vulnerabilidades del mismo tipo |
| 5 | **Eliminación** *(opcional)* | Determinar los pasos necesarios para eliminarlas |

**Qué es una hipótesis en este esquema, y qué no es.** No es una sospecha genérica del tipo "este sistema puede tener problemas" — es una **afirmación falsable sobre una vulnerabilidad puntual**. El ejemplo que da `video-09`: *"este sistema tiene un endpoint contra el RENAPER con usuario y contraseña hardcodeados en el código"*. Una hipótesis así se puede probar y refutar; "puede tener problemas" no.

## Paso 1 — Recolección de información

Filminas 8-9. Componer un modelo del sistema y sus partes: **buscar discrepancias**, **revisar interfaces**. Hace falta **conocer bien el sistema** —documentación de diseño y manuales, cuando existan, prestando especial atención a secciones poco especificadas o ambiguas, y viendo el manejo de privilegios y los tipos de cuenta— y también **el ambiente**: nombres de usuarios y servidores, estructura de red.

### Los puntos calientes, según video-09

La filmina no los desarrolla; el docente los agrega en voz (43:25) como la traducción práctica de "buscar discrepancias":

- **Las interfaces con terceros** — servicios externos, pasarelas de pago, sistemas legacy con interfaces viejas: "ahí es donde están los quilombos".
- **Las discrepancias que se acumulan con el tiempo** — un sistema de vida larga que cambia requisitos sin reescribir lo viejo.
- **Los elementos reutilizados para más de un propósito** — un flag que sirve a la vez para detectar un ingreso y para saber que alguien está presente. Es el mismo patrón que [[principios-de-diseno#7. Mecanismos exclusivos|Mecanismos exclusivos]] prohíbe desde el lado del diseño: un mecanismo de seguridad no debe compartirse, y acá se ve el motivo desde el lado de quien busca romperlo.

Y un ejemplo puntual que ilustra por qué **cualquier convención de nombres predecible es explotable**: bautizar servidores con nombres de planetas es cómodo para administrar, pero le regala al atacante una forma de adivinar dónde está lo importante —si hay uno llamado *Plutón*, quizás ahí estén los usuarios—. La alternativa, un hash largo y aleatorio, choca contra la usabilidad porque nadie lo recuerda: es el mismo balance entre seguridad y comodidad que [[principios-de-diseno#8. Aceptación psicológica|Aceptación psicológica]] discute del lado del diseño.

### Punto de partida: tres niveles incrementales de atacante

La filmina 9 da tres niveles, y aclara que **según el tipo de prueba, algunos son irrelevantes**:

| Nivel | Atacante | Cuándo se ignora |
|---|---|---|
| 1 | Externo, **sin** conocimiento del sistema | Durante el diseño |
| 2 | Externo, **con** conocimiento del sistema | En sistemas con registro abierto |
| 3 | Con acceso al sistema | — |

Es, según señala `video-09`, **el análogo en seguridad de sistemas del [[modelos-de-ataque|modelo de adversario criptográfico]] del Bloque 1**: en los dos casos, la fuerza de la prueba depende de cuánta información inicial se le concede al atacante, y una prueba que sólo resiste a un atacante de nivel 1 no dice nada sobre su resistencia frente a uno de nivel 2 o 3. Es el mismo principio detrás de por qué [[principios-de-diseno#1. Menor privilegio|Menor privilegio]] exige asignar permisos por función: un atacante de nivel 3 —con acceso legítimo— es, en la práctica, el escenario más común y el más peligroso, porque ya partió con privilegios reales.

## Paso 2 — Hipótesis

Filminas 10-11. **Buscar posibles vulnerabilidades** por tres vías:

- **Examinando políticas y procedimientos** — buscar inconsistencias, y buscar inconsistencias **entre** políticas y mecanismos; los procedimientos pueden no cumplirse en la práctica.
- **Examinando implementaciones** — usar modelos de vulnerabilidades, revisar vulnerabilidades comunes o conocidas, usar los manuales para exceder límites u omitir pasos de secuencias documentadas.
- **Examinando mecanismos** — pueden estar mal implementados, el ambiente donde corren puede introducir errores, o pueden directamente no ser seguros — y **comparando con otros sistemas**, bajo la premisa de que sistemas parecidos tienen problemas parecidos.

El resultado de este paso es una **lista de posibles vulnerabilidades**, todavía sin probar.

### Por qué existe el post-it con la contraseña

`video-09` (50:47) desarrolla el ejemplo clásico de la primera vía —inconsistencia entre política y práctica— con una lectura que vale la pena retener porque cambia la conclusión: el post-it no es un caso de ignorancia del usuario.

> [!quote]- Del video 09 — por qué el post-it con el password existe (50:47)
> "Esa persona tiene un objetivo que tiene que hacer algo todos los días y si no, no se acuerda el password y no cumple con su objetivo."

La política falla porque **compite con la productividad**, no porque el usuario no entienda la regla. Es la misma tensión que [[principios-de-diseno#8. Aceptación psicológica|Aceptación psicológica]] plantea del lado del diseño: un mecanismo que dificulta el trabajo diario termina evadido, no obedecido, sin importar cuán correcto sea en el papel.

### Cuatro puntos calientes de implementación, según video-09

Sobre la segunda vía, el video agrega una lista de dónde suele aparecer una vulnerabilidad de implementación (52:43-55:27):

- **Seguridad en `API`s** y política de desarrollo de microservicios, y **`software supply chain` management**.
- **`RASP` (*Runtime Application Self Protection*) mal implementados** — sistemas que dejan al sistema operativo en integridad total, donde sólo corren los programas establecidos y no se puede alterar ningún binario base.
- **Federadores de login sin verificar** — el "iniciar sesión con Google" y equivalentes.
- **Software fuera de soporte (`EOL`)** — van a aparecer vulnerabilidades nuevas que ya nadie corrige; la estrategia entonces no es reemplazarlo de inmediato sino **encapsularlo, aislarlo y monitorear si fue explotado**.

El hilo que une a los cuatro, según el video: *"nadie te echa por contratar a IBM"* — la confianza delegada por completo en un producto de terceros, sin reservarse ningún margen de sospecha, es justamente por donde entran las vulnerabilidades que nadie audita.

> [!quote]- Del video 09 — cuánta confianza delegar en un producto de seguridad (55:27)
> "Voy a darle confianza, pero hasta ahí, y voy a asumir que quizás, ¿qué pasa si esto no anda?"

La tercera vía —examinar mecanismos y comparar con otros sistemas— cierra con un ejemplo concreto del video (57:34): si un sistema cobra con código `QR`, la hipótesis a examinar es **qué pasa si se falsifica el `QR`** —*`QR forgery`*—, si el sistema lo detecta, con qué mecanismo, si ese mecanismo está bien implementado y si de verdad forma parte del flujo de ejecución en producción, o quedó como una capa decorativa que nadie invoca.

## Paso 3 — Prueba

Filminas 12-13. Primero **priorizar** la lista de posibles vulnerabilidades, por lo general según el nivel de acceso requerido, y **definir cómo probar** la existencia de cada una:

- La **mejor manera** es analizar documentación o comportamiento.
- **Intentar explotarla es el último recurso**, y el menos eficiente — con la **excepción del pivoting**, que se desarrolla abajo.
- El test se diseña para ser **lo menos intrusivo posible**: algunas vulnerabilidades pueden denegar el servicio si se las prueba mal.
- El proceso normal es resguardar los datos de todo el sistema, documentar los requerimientos para detectar la vulnerabilidad, e intentar detectarla.
- **La prueba DEBE SER REPETIBLE**, en mayúsculas en la propia filmina.

`video-09` (1:00:30) agrega un segundo requisito que la filmina no escribe pero que el docente pone al mismo nivel: la prueba debe ser **repetible y concluyente**. Cuando el test es de instancia única —ocurrió una vez y no se pudo reproducir—, la evidencia es **leve**: puede figurar en el informe, pero no es concluyente, y lo que en realidad indica es que falta entender algo del sistema antes de poder afirmar nada. Y trae Chernóbil como recordatorio de un riesgo real del propio paso: **la prueba misma puede provocar el desastre** que se quiere prevenir, razón de más para diseñarla lo menos intrusiva posible.

### Pivoting

Filmina 14. Es probable que la existencia de una vulnerabilidad **provea más información** —por ejemplo, acceso al sistema operativo—, y con eso hay que volver a la fase de recolección. ***Pivoting*** es el uso de un punto de acceso ya comprometido para continuar el ataque: se compromete el firewall y desde ahí se sigue atacando la red interna.

Es la **única excepción** a la regla "intentar explotar es el último recurso": una vez que la explotación ya ocurrió como parte de probar una vulnerabilidad anterior, seguir explotando desde ese punto de apoyo es más eficiente que volver a empezar por documentación. Es también la prueba de que los cinco pasos no son estrictamente secuenciales: pivotear implica saltar del paso 3 de vuelta al paso 1, con más información de la que se tenía al principio.

## Pasos 4 y 5 — Generalización y eliminación

Filminas 15-16.

**Generalización.** A medida que las pruebas resultan exitosas emergen patrones, y a veces **dos vulnerabilidades combinadas constituyen un problema grave** — el ejemplo de la propia filmina es una cuenta invitado habilitada que permite conexión remota, sumada a un buffer overflow local que da derechos de administrador; ninguna de las dos por separado es tan grave como las dos juntas. La filmina lo marca como **la parte más importante de la prueba**, y `video-09` explica por qué con un argumento estructural: los sistemas se construyen replicando módulos, así que un problema encontrado en un servicio **probablemente exista en otros** construidos de la misma manera. Generalizar no es "sacar una conclusión general" en abstracto: es usar un hallazgo puntual como plantilla para buscar el mismo defecto en el resto del sistema.

**Eliminación** (opcional): por lo general sólo se incluyen recomendaciones, porque quien ejecuta la prueba no suele ser quien diseñó o desarrolló el sistema. Es importante que quede claro el contexto, los detalles y el mecanismo de explotación, para poder corregir el sistema, para poder impedirlo o monitorearlo mientras tanto, y para poder verificar si fue explotado en el pasado.

> **Una tensión que conviene tener resuelta de antemano, sobre el alcance de "generalización".** Un alumno le señala a Ramele, en `video-09` (1:21:42), una contradicción aparente: si el paso 4 se llama *generalización*, ¿cómo puede ser que, según [[validez-de-las-pruebas-de-penetracion|Validez de las pruebas de penetración]], *"los resultados de un test sirvan sólo marginalmente para otros"*? La resolución que da la cátedra: **la generalización opera dentro del mismo sistema** —pivoteando desde una vulnerabilidad ya explotada hacia sus derivaciones, buscando dónde se replica el mismo problema— y no generaliza nada **hacia afuera**, hacia sistemas distintos. Es una aclaración útil para no leer "generalización" y "validez externa" como si fueran la misma idea; se desarrolla con más detalle en la nota de validez.
