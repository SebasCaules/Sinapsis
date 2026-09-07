---
title: Mecanismos de control de flujo
resumen: 'Las dos formas de hacer cumplir una política de flujo: el mecanismo estático, que certifica el programa en compilación, y el dinámico, que etiqueta los datos en ejecución; y dónde lo técnico deja de alcanzar.'
fuentes: ["[[clase-09-flujo-de-informacion]]", "[[politicas-de-control-de-flujo]]", "[[video-11-flujo-de-informacion]]"]
aliases: [Mecanismos de control de flujo, Mecanismos estáticos y dinámicos, Etiquetas de flujo de información, Control de flujo por etiquetas, Certificación de comandos]
type: concepto
unidad: 2
clase: 9
orden: 6
created: 2026-09-04
updated: 2026-09-06
tags: [seguridad, flujo-de-informacion, control-de-flujo, etiquetas, mecanismos, bloque-2, clase-09, sin-dictar]
sources: ["Clase 10 - Aplicaciones - Flujo de informacion.pdf"]
---

# Mecanismos de control de flujo

**Cómo se hace cumplir, en la práctica, la política de flujo de la nota anterior: analizando el programa entero antes de correrlo, o marcando cada dato con una etiqueta que viaja con él en tiempo de ejecución.** Y, en el cierre, dónde ese mecanismo técnico deja de alcanzar aunque esté perfectamente implementado.

Cubre las filminas **16 y 17** del deck `Clase 10 - Aplicaciones - Flujo de informacion.pdf`. La clase todavía no se dictó —hoy es 04/09/2026, y el dictado es el 22/10—, así que esta nota está escrita sólo contra el PDF; lo que no sale literal de la filmina va marcado como *(lectura nuestra)*.

## Los dos mecanismos

La filmina 16 los presenta como una dicotomía limpia: analizar antes de ejecutar, o vigilar mientras se ejecuta.

| | Cuándo actúa | Cómo funciona |
|---|---|---|
| **Estático** | Antes de ejecutar (compilación) | Analiza el flujo **comando por comando**, con herramientas de teoría de compiladores; sólo deja pasar los comandos que logra **certificar** |
| **Dinámico** | Durante la ejecución | Asigna **etiquetas** a la información. Al **leer**, el usuario adquiere la etiqueta del dato; al **escribir**, el dato sale marcado con todas las etiquetas que el usuario tenía acumuladas. Cada zona del sistema declara qué etiquetas tiene **prohibidas** y cuáles **requiere** |

### Mecanismo estático: certificar antes de correr

La filmina no da más detalle que "conceptos de teoría de compiladores" y "comandos certificados". Lo que sí se puede afirmar con lo que la propia clase ya construyó: certificar un comando es verificar, para cada camino posible del programa, que no viola ninguna de las dos condiciones de la [[flujo-de-informacion#La definición formal|definición de flujo]] —ni la explícita de un `y := f(x)`, ni la implícita de un `if` o un `while` que filtran sin asignación—. Es exactamente el "analizador que sólo mira asignaciones se pierde el `if` y el `while`" que [[flujo-explicito-e-implicito#La generalización: explícito contra implícito|Flujo explícito e implícito]] deja como problema abierto: un mecanismo estático que certifique en serio tiene que rastrear también los flujos implícitos, no sólo las asignaciones. *(Lectura nuestra: la filmina no conecta explícitamente "certificación" con "flujo implícito"; la conexión es nuestra, apoyada en que ambas cosas están a dos filminas de distancia dentro del mismo deck.)*

La ventaja del mecanismo estático es que el costo de análisis se paga **una sola vez**, en tiempo de compilación, y el programa certificado corre después sin ninguna vigilancia adicional. La desventaja simétrica: es **conservador** por necesidad —tiene que rechazar cualquier programa cuyo flujo no pueda demostrar seguro, incluidos programas que en la práctica nunca filtrarían nada— y no sirve para código que no se puede analizar de antemano (una biblioteca dinámica, un script interpretado que se genera en tiempo de ejecución).

### Mecanismo dinámico: etiquetas que viajan con el dato

Este mecanismo es, literalmente, la implementación en tiempo de ejecución de la **relación de dominancia** que [[politicas-de-control-de-flujo#La relación de dominancia de Bell-LaPadula aplicada al flujo|Políticas de control de flujo]] tomó de Bell-LaPadula un par de filminas antes: las "etiquetas" de esta filmina y las "clases" $C_1, C_2$ de la filmina 15 son la misma idea, una nombrada desde la política y la otra desde el mecanismo que la implementa *(lectura nuestra; la filmina 16 no hace esta conexión de manera explícita)*.

La regla de propagación tiene dos partes y conviene fijarla con un ejemplo mínimo:

- **Al leer**, el usuario (o el proceso) adquiere la etiqueta del dato leído.
- **Al escribir**, el dato de salida queda marcado con **todas** las etiquetas que el escritor tenía acumuladas hasta ese momento —no sólo la del dato que se está escribiendo en ese instante—.

Supóngase un proceso sin etiquetas que primero lee una variable $x$ etiquetada $\{\text{alto}\}$ y después escribe el resultado de un cálculo a una variable $y$. Por la primera regla, el proceso queda etiquetado $\{\text{alto}\}$ apenas termina de leer $x$; por la segunda, **todo** lo que ese proceso escriba después —incluso si el cálculo no usó $x$ para nada— sale etiquetado $\{\text{alto}\}$ también, porque la etiqueta viaja con el escritor y no con el dato de origen. Si $y$ vive en una zona cuyo conjunto de etiquetas **prohibidas** incluye $\{\text{alto}\}$ —una zona pública, por ejemplo—, el mecanismo bloquea la escritura. Es la misma lógica, mecanizada, del ejemplo con el que arrancó la clase entera: la copia que un editor de texto deja en `/tmp` hereda la etiqueta del archivo que la originó, y por eso un mecanismo dinámico correcto **sí** la bloquearía donde el [[control-de-acceso-y-flujo-de-informacion#El escenario: exámenes y /tmp|control de acceso por ACLs]] no la veía venir.

**El costo de la propagación "todo lo que tenía acumulado".** La regla es deliberadamente conservadora: basta con que el escritor haya leído *alguna vez* un dato de alta etiqueta para que **todo** lo que produzca después quede marcado igual, aunque ese dato de origen no haya influido en el resultado. Es el mismo fenómeno de sobre-etiquetado que un mecanismo estático sufre por el lado de los caminos que nunca se ejecutan: los mecanismos dinámicos, para no dejar pasar un flujo real, terminan bloqueando también flujos que no eran tales. *(Lectura nuestra: la filmina no discute este costo; es una consecuencia directa de la regla tal como está escrita.)*

## El límite de lo técnico

**Filmina 17.** El ejemplo es de esferas gubernamentales: un oficial que adquiere derechos de acceso a información confidencial **deja de poder emitir comunicados oficiales públicos** —control de flujo por etiquetas, aplicado a una persona en lugar de a una variable: el oficial "lee" información de alta clasificación y queda "etiquetado" en consecuencia, igual que el proceso del ejemplo anterior—. Pero la filmina hace tres preguntas que se contestan solas:

- ¿Cómo impedir que hable informalmente?
- ¿Cómo impedir que imprima documentación clasificada?
- ¿Cómo impedir que fotografíe una pantalla?

Ninguna tiene respuesta técnica, y el texto de la propia filmina lo dice sin vueltas: *"el control de información puede escapar del ámbito técnico"*. Es el límite explícito de todo lo desarrollado hasta acá —mecanismos estáticos y dinámicos incluidos—: **sólo se puede controlar lo que admite un mecanismo técnico**. Ningún etiquetado, por más fino que sea, ata la boca de una persona.

**Video 11: el mismo límite, dicho con más filo.** La clase grabada que cubre este deck lo remata con una frase que la filmina no trae:

> [!quote]- Citado en Video 11 — por dónde entran los ataques de verdad (41:57 y 42:16)
> *"Sólo se puede controlar y se puede hacer un mecanismo técnico. Después está todo lo que excede a lo técnico."*
>
> *"Los mayores ataques de estas cosas no son por análisis de flujo, sino más bien porque alguien deja un password escrito en un lugar, o lo llaman por teléfono y le hacen un chamullo, y da la información sin que se dé cuenta."*

La primera frase está dicha en registro oral y su sintaxis es elíptica; leída en limpio dice lo mismo que la filmina: sólo se puede controlar aquello para lo cual se puede hacer un mecanismo técnico *(lectura nuestra sobre la sintaxis, no sobre el contenido de la cita)*. Es, palabra por palabra, la misma idea que sostiene la [[video-09-pentesting-metodologia#6. Ejemplo resuelto: ataque externo por ingeniería social|metodología de pentesting]]: frente a un mecanismo de control de flujo perfecto, la vía de ataque que sigue funcionando es la ingeniería social, porque opera un nivel por encima de cualquier etiqueta o certificación. *(Lectura nuestra: ni la filmina 17 ni el video mencionan el pentesting; la conexión es nuestra.)*
