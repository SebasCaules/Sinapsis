---
title: Aseguramiento en el ciclo de vida
resumen: 'Las nueve fuentes de problemas de un sistema, el aseguramiento repartido sobre todas las etapas del proyecto y la distinción que ordena el bloque: la vulnerabilidad no es la amenaza, es lo que permite que ocurra.'
fuentes: ["[[clase-08-principios-de-diseno-y-vulnerabilidades]]", "[[confianza-y-aseguramiento]]", "[[modelado-de-amenazas]]", "[[video-08-vulnerabilidades]]"]
aliases: [Nueve fuentes de problemas, Peter Newman, Bug vulnerabilidad amenaza efecto, Amenaza contra vulnerabilidad, Clasificación de amenazas por consecuencia]
type: concepto
unidad: 2
clase: 8
orden: 3
created: 2026-09-04
updated: 2026-09-04
tags: [seguridad, aseguramiento, ciclo-de-vida, amenaza, vulnerabilidad, clase-08, sin-dictar]
sources: ["Clase 12 - Analisis de vulnerabilidades.pdf"]
---

# Aseguramiento en el ciclo de vida

**Dónde entra la seguridad en un proyecto de software —en todas las etapas, no al final— y la distinción que más se confunde de todo el bloque: una vulnerabilidad no es una amenaza, es lo que permite que una amenaza ocurra.** Es la nota bisagra entre [[confianza-y-aseguramiento|Confianza y aseguramiento]], que da el vocabulario, y [[modelado-de-amenazas|Modelado de amenazas]], que da el proceso concreto.

Cubre las filminas **6 a 8** del deck `Clase 12 - Analisis de vulnerabilidades.pdf`. **Esta clase todavía no se dictó** (hoy es 04/09/2026, la clase es el 15/10): no hay transcripción propia, y lo que sigue está escrito contra el PDF más [[video-08-vulnerabilidades|video-08]].

## Las nueve fuentes de problemas

La filmina 6 lista nueve orígenes, atribuidos por la propia lámina a *"Peter Newman"*:

1. Requerimientos incompletos, incorrectos o faltantes
2. Fallos en el diseño
3. Fallos en la implementación del hardware
4. Fallos en la implementación del software
5. Errores de uso por errores de operación
6. Uso indebido del sistema
7. Fallos de los equipos o del medio de comunicación
8. Casos de fuerza mayor, desastres
9. Errores al actualizar, mantener o decomisar

> **Sobre la atribución.** La filmina escribe literalmente *"Peter Newman"*, sin más datos. Es casi con certeza **Peter G. Neumann**, editor del *RISKS Digest* y autor de *Computer-Related Risks* — pero eso es una identificación, no algo que la filmina confirme, y `video-08` reporta el mismo apellido sin poder verificarlo contra el original tampoco. *(Lectura nuestra: se cita el apellido tal como aparece en la fuente, con la salvedad.)*

**Qué las une, según `video-08`:** las nueve comparten la misma naturaleza —son *bugs*—, y un bug se convierte en **vulnerabilidad** en el momento en que se lo puede explotar contra un objetivo de seguridad. La lista no separa "problemas de seguridad" de "problemas de calidad" porque, en el origen, no hay diferencia: un requerimiento mal escrito, un error de hardware y un desastre natural son, los tres, formas en que algo puede salir mal — recién se vuelven un problema *de seguridad* cuando alguien puede explotarlos.

Vale notar que las nueve mezclan **causas técnicas** (2, 3, 4), **causas humanas** (1, 5, 6, 9) y **causas ambientales** (7, 8) sin jerarquía entre ellas: la lista no dice que las técnicas sean más graves que las humanas. Es un recordatorio de que "seguridad informática" no es sólo código: un desastre físico en el 8 tiene el mismo estatus en la lista que un bug de implementación en el 4.

## El aseguramiento cubre todas las etapas

La filmina 7 traduce la cadena Política → Aseguramiento → Mecanismo de la nota anterior a las etapas concretas de un proyecto:

| Etapa | Se traduce en |
|---|---|
| Requerimientos | Análisis de amenazas, formación de políticas |
| Diseño | Modelo de seguridad |
| Implementación | Consistencia y trazabilidad |
| Mantenimiento | Control y configuración |

Y aclara que el aseguramiento **se adapta a cualquier metodología de desarrollo** — no depende de que el proyecto sea en cascada, ágil o cualquier otra. La consecuencia que la cátedra machaca, según `video-08`: **no dejar la seguridad para el final del proyecto**. El ejemplo que trae es Internet como infraestructura entera de protocolos que originalmente no traían ninguna consideración de seguridad incorporada, y que hoy se parchea capa sobre capa — el costo de agregar seguridad después, a una arquitectura ya desplegada y en uso por miles de millones de dispositivos, es órdenes de magnitud mayor que haberla considerado en el diseño original.

**Por qué "requerimientos" es la etapa que más se salta en la práctica, y por qué es la más cara de saltear.** Un requerimiento de seguridad mal formado en el origen (fuente de problemas #1 de la lista de arriba) se propaga: si nunca se especificó qué amenazas hay que eliminar, el diseño no tiene contra qué medirse, la implementación no tiene qué verificar, y el mantenimiento no sabe qué monitorear. Es la misma razón por la que [[modelado-de-amenazas|Modelado de amenazas]] insiste en que el **conocimiento de la función primaria de la aplicación** es la entrada más importante de su proceso: sin eso, no hay forma de escribir requerimientos de seguridad que valgan algo.

## Amenaza contra vulnerabilidad

La filmina 8 es la que más vale la pena memorizar de todo este bloque, porque la confusión entre los dos términos es constante:

> **Amenaza:** evento potencial que tiene como consecuencia un efecto no deseado en el sistema. **No son vulnerabilidades** — una vulnerabilidad **permite** que ocurra una amenaza.

Y clasifica las amenazas por **consecuencia**:

- Pérdida de **confidencialidad**
- Pérdida de **integridad**
- **Denegación de servicio**

**La diferencia en una frase:** la amenaza es el evento que no se quiere que pase; la vulnerabilidad es la grieta concreta del sistema que hace posible que ese evento ocurra. Una misma amenaza —por ejemplo, pérdida de confidencialidad de una base de datos— puede tener detrás múltiples vulnerabilidades distintas que la habilitan: una inyección SQL, una contraseña por defecto sin cambiar, un backup sin cifrar. Y una misma vulnerabilidad puede habilitar más de una amenaza: una inyección SQL que permite leer datos (confidencialidad) puede también permitir modificarlos (integridad).

Según `video-08`, esta filmina se acompaña de una cadena que no está literalmente dibujada como tal en el PDF, pero que el docente arma verbalmente a partir de sus cuatro cajas:

$$\text{Bug} \;\longrightarrow\; \text{Vulnerabilidad (debilidad)} \;\longrightarrow\; \text{Amenaza} \;\longrightarrow\; \text{Efecto no deseado}$$

Cada flecha de esta cadena es una condición necesaria pero no suficiente para la siguiente: no todo bug es una vulnerabilidad (la mayoría de los bugs no son explotables contra ningún objetivo de seguridad), no toda vulnerabilidad se traduce en una amenaza concretada (puede existir y no ser explotada nunca), y no toda amenaza que ocurre produce el peor efecto posible (un atacante puede lograr acceso parcial sin llegar a comprometer todo el sistema). Es un embudo, no una equivalencia.

**Por qué conviene tener la cadena completa y no sólo el par amenaza/vulnerabilidad.** El [[modelado-de-amenazas|modelado de amenazas]] trabaja de derecha a izquierda: parte de qué efecto no deseado hay que evitar, deriva qué amenazas lo producirían, y busca —en la [[descomposicion-de-la-aplicacion|descomposición de la aplicación]]— qué vulnerabilidades concretas las habilitarían. Entender la cadena completa es lo que permite ese recorrido en reversa: sin ella, "buscar vulnerabilidades" es una tarea sin rumbo, porque no hay forma de saber cuáles importan.

## Ver también

- [[clase-08-principios-de-diseno-y-vulnerabilidades#3. Aseguramiento en el ciclo de vida|Clase 08 — Principios de diseño y vulnerabilidades § 3. Aseguramiento en el ciclo de vida]]
- [[confianza-y-aseguramiento|Confianza y aseguramiento]] — la cadena Política → Aseguramiento → Mecanismo que esta nota distribuye sobre el ciclo de vida
- [[modelado-de-amenazas|Modelado de amenazas]] — el proceso que aplica la distinción amenaza/vulnerabilidad para producir la lista de cada una
- [[descomposicion-de-la-aplicacion|Descomposición de la aplicación]] — dónde se buscan concretamente las vulnerabilidades que la cadena predice
- [[estado-de-un-criptosistema|Estado de un criptosistema]] — el mismo vocabulario de "estado" aplicado a un esquema criptográfico concreto
- [[video-08-vulnerabilidades#La cadena que ordena todo lo demás|video-08 — Vulnerabilidades]] — la fuente hablada de esta nota
- [[videografia|Videografía]] — el mapa completo de los videos de la cátedra
