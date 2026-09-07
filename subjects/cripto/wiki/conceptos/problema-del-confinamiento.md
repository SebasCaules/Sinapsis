---
title: Problema del confinamiento
resumen: 'El problema de impedir que un servidor revele información que el usuario considera confidencial, y por qué la aislación total es inalcanzable: todo proceso usa recursos medibles y compartidos que ya forman un canal.'
fuentes: ["[[clase-09-flujo-de-informacion]]", "[[video-11-flujo-de-informacion]]", "[[flujo-de-informacion]]"]
aliases: [Problema del confinamiento, Confinement problem, Aislación total, Aislamiento perfecto, Recursos medibles]
type: concepto
unidad: 2
clase: 9
orden: 7
created: 2026-09-04
updated: 2026-09-06
tags: [seguridad, flujo-de-informacion, confinamiento, aislacion, bloque-2, clase-09, sin-dictar]
sources: ["Clase 10 - Aplicaciones - Flujo de informacion.pdf"]
---

# Problema del confinamiento

**Por qué "aislar un proceso por completo" —la solución obvia a todo lo anterior— es, en la práctica, imposible: todo proceso usa recursos que se pueden medir, y medir un recurso compartido ya es un canal de comunicación.** Es el punto donde la clase deja de preguntar *cómo controlar el flujo dentro de un programa* y pasa a preguntar *qué pasa cuando ni siquiera se puede aislar un proceso del resto del sistema*.

Cubre las filminas **18 a 20** del deck `Clase 10 - Aplicaciones - Flujo de informacion.pdf`. La clase todavía no se dictó —hoy es 04/09/2026—, así que esta nota está escrita sólo contra el PDF; lo que no sale literal de la filmina va marcado como *(lectura nuestra)*.

## El problema, en dos partes

**Filmina 18.** Un sistema ideal tiene que resolver dos cosas a la vez, y la propia filmina las separa por dificultad:

| Requisito | Dificultad | Estado |
|---|---|---|
| Permitir que una entidad acceda **sólo** a los recursos para los que está autorizada | "Fácil" | Ya existen mecanismos seguros —es el [[control-de-acceso-y-flujo-de-informacion\|control de acceso]] con el que arrancó la clase, y que la filmina 5 ya había marcado como insuficiente por sí solo |
| **No revelar información de ningún tipo** a quien no está autorizado | "Difícil" | Es la parte que esta clase entera viene tratando de resolver desde la filmina 8 |

De ahí sale la definición formal, tal como la escribe la filmina: el **problema de confinamiento** es *prevenir que un servidor revele información que el usuario del servicio considere confidencial*.

### Por qué es la continuación natural de la definición de flujo

*(Lectura nuestra: la filmina no hace este enlace de manera explícita.)* La [[flujo-de-informacion#La definición formal|definición de flujo]] de la filmina 8 dice que hay flujo de $x$ a $y$ si $H(x_s \mid y_t) < H(x_s \mid y_s)$. El requisito "difícil" del confinamiento es exactamente el caso en que esa desigualdad **nunca** se cumple para ningún par (secreto, observable) accesible a un tercero no autorizado: para todo $y$ que el atacante pueda observar,

$$H(\text{secreto}_s \mid y_t) = H(\text{secreto}_s)$$

es decir, cero reducción de incertidumbre. Es el mismo caso límite que en la Unidad 1 se escribe como $I(M;C) = 0$ en el [[secreto-perfecto|secreto perfecto]]: allá la variable observable era el criptograma y el secreto el mensaje; acá la variable observable es cualquier cosa que un proceso externo pueda medir del servidor, y el secreto es lo que el usuario del servicio considera confidencial. La diferencia de fondo es de **alcance**: el secreto perfecto pide esa igualdad sólo respecto del criptograma que el esquema produce a propósito; el confinamiento la pide respecto de **absolutamente todo** lo que un observador externo pueda llegar a medir del proceso, lo haya diseñado el sistema para eso o no. Esa generalidad es, precisamente, lo que lo vuelve inalcanzable.

## Aislación total: la solución que no se puede alcanzar

**Filmina 19.** Sería la respuesta perfecta a la parte difícil. Sus requisitos:

- El proceso no puede comunicarse con otros procesos.
- El proceso no puede ser observado.

Su consecuencia, si se cumpliera: el proceso no revela información —la igualdad de arriba se cumpliría exactamente—. El problema, que la propia filmina nombra: **en la práctica es inalcanzable**, porque todo proceso usa recursos medibles —memoria, ciclos de CPU, espacio en disco, ancho de banda—.

**Filmina 20.** El argumento se cierra con el caso general: los procesos $a$ y $b$ no pueden comunicarse *por definición*, pero comparten el sistema de archivos; si no lo comparten, comparten el procesador; y además comparten memoria. **Todos estos recursos son observables**, y observarlos permite crear un canal de información que nadie diseñó para eso. Es el gozne de la clase entera: la aislación perfecta falla siempre por el mismo motivo estructural —dos procesos que no deberían poder comunicarse igual comparten el sustrato físico sobre el que corren—, y ese motivo es el que da nombre a la sección siguiente.

### Un ejemplo de por qué "medible" implica "explotable"

*(Lectura nuestra: ilustra el argumento de la filmina 20 con un recurso que ni siquiera aparece ahí —cuota de disco— para mostrar que el argumento no depende de cuál recurso se elija.)* Sean $a$ y $b$ dos procesos con prohibición explícita de comunicarse, corriendo en un sistema donde ambos comparten una cuota de disco fija de, por ejemplo, $100$ MB para el mismo directorio temporal.

- Si $a$ quiere transmitir el bit $1$, escribe un archivo de $90$ MB y lo retiene abierto.
- Si quiere transmitir el bit $0$, no escribe nada.
- $b$ intenta escribir un archivo propio de $20$ MB en el mismo directorio y observa el resultado: si la escritura **falla** por falta de espacio, infiere que $a$ transmitió un $1$; si **tiene éxito**, infiere un $0$.

$a$ y $b$ nunca intercambiaron un mensaje en el sentido que la política prohíbe —no hay ninguna llamada de $a$ a $b$—, y sin embargo el bit llega. El canal existe porque la cuota de disco es un **recurso medible y compartido**, exactamente la categoría que enumera la filmina 19: no hace falta CPU ni memoria para que el argumento funcione, alcanza con cualquier recurso finito que ambos procesos toquen. El mecanismo exacto por el que este tipo de canal se clasifica y se explota está desarrollado en [[canales-ocultos-y-side-channels|Canales ocultos y side channels]]; este ejemplo de cuota de disco es, en esa clasificación, un canal **espacial** —usa un atributo del recurso (cuánto espacio queda), no su orden temporal de acceso—, a diferencia del ejemplo de CPU de la filmina 22, que es **temporal**.

> **El origen del término, fuera del programa de la cátedra** *(lectura nuestra, contexto histórico)*. El "problema de confinamiento" no es una acuñación de esta clase: es el nombre que le dio Butler Lampson en 1973, en un trabajo corto que formuló exactamente este dilema —cómo confinar un programa de modo que no filtre los datos que procesa— y que introdujo el vocabulario que la filmina reproduce casi sin cambios. La cátedra no cita el trabajo en el deck; se deja constancia acá porque explica por qué la definición suena tan asentada pese a no traer ninguna demostración formal en la filmina: es un problema con más de cincuenta años y sin solución general conocida, no un ejercicio inventado para el curso.
