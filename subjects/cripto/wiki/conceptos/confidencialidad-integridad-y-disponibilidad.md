---
title: Confidencialidad, integridad y disponibilidad
resumen: 'Las tres propiedades que después protege cada modelo de la clase, formalizadas sobre un mismo conjunto de entidades y un recurso, y distinguidas por su cuantificador y su relación: son tres ejes ortogonales, no una escala.'
fuentes: ["[[clase-06-politicas-de-seguridad-y-control-de-acceso]]", "[[politica-de-seguridad-y-sistema-seguro]]", "[[bell-lapadula]]", "[[modelos-de-integridad-de-biba]]"]
aliases: [Tríada CID, Confidencialidad integridad y disponibilidad, Integridad de datos, Integridad de origen, Garantía (seguridad), Tres ejes ortogonales de seguridad]
type: concepto
unidad: 2
clase: 6
orden: 2
created: 2026-09-04
updated: 2026-09-04
tags: [politicas-de-seguridad, confidencialidad, integridad, disponibilidad, cid, clase-06, sin-dictar]
sources: ["Clase 06 - Politicas.pdf"]
---

# Confidencialidad, integridad y disponibilidad

**La formalización de las tres propiedades que después va a proteger cada modelo de la clase — Bell-LaPadula la primera, Biba la segunda, la muralla china las dos a la vez — escritas con la misma forma y el mismo par de conjuntos, para que se vea que son tres ejes distintos y no tres sinónimos.** Es la nota que hay que tener firme para no confundir, en un parcial, cuál cuantificador va con cuál propiedad.

Cubre las filminas **4-8** del deck de Políticas (`Clase 06 - Politicas.pdf`). La clase todavía no se dictó —hoy es **04/09/2026**, la clase es el **01/10/2026**— así que esta nota está escrita contra el PDF, sin transcripción.

## La forma común

Las tres definiciones comparten el mismo par de objetos: un conjunto $X$ de entidades y una información o recurso $I$.

$$\textbf{Confidencialidad: } I \text{ es confidencial para } X \iff \text{ningún miembro de } X \text{ puede obtener información de } I$$

$$\textbf{Integridad: } I \text{ es íntegra para } X \iff \text{todo miembro de } X \text{ confía en } I$$

$$\textbf{Disponibilidad: } I \text{ está disponible para } X \iff \text{todo miembro de } X \text{ puede acceder a } I \text{ cuando lo requiere}$$

Lo que las distingue no es la forma —todas cuantifican sobre $X$— sino **qué cuantificador usan** y **sobre qué relación**:

$$\begin{array}{l|c|l}
\text{Propiedad} & \text{Cuantificador sobre } X & \text{Relación}\\ \hline
\text{Confidencialidad} & \text{ningún miembro} & \text{obtener información de } I\\
\text{Integridad} & \text{todo miembro} & \text{confiar en } I\\
\text{Disponibilidad} & \text{todo miembro} & \text{acceder a } I \text{ cuando se requiere}
\end{array}$$

Integridad y disponibilidad comparten el cuantificador ("todo miembro") pero no la relación: una exige **confianza**, la otra exige **acceso efectivo**. Confundir "todos confían" con "todos pueden acceder" es el error más común entre las tres —un dato puede ser íntegro y estar completamente inaccesible (un backup cifrado que nadie puede leer sin la clave sigue siendo confiable), o estar disponible y ser basura (un servidor que responde siempre, pero con datos corruptos).

## Confidencialidad: "ni siquiera por vías indirectas"

La filmina 5 repite la definición de la filmina 4 con un único agregado gráfico: una flecha rotulada *"¡Ni siquiera por vías indirectas!"*. La exigencia no es que $X$ no pueda leer $I$ **directamente** —eso sería una condición mucho más débil y mucho más fácil de implementar—, sino que ningún miembro de $X$ pueda **inferir** información de $I$ combinando cualquier otra cosa a la que tenga acceso.

*(Lectura nuestra.)* Esta es exactamente la generalización de una idea que ya apareció en la Unidad 1 con otro nombre y otro alcance: el [[clase-01-introduccion-y-criptografia-clasica#3. Seguridad (informal)|ataque de sentido del mensaje]] de la Clase 01 cuenta como ruptura de seguridad aunque el adversario no descifre nada —le alcanza con enterarse de algo sobre el mensaje—. Acá se generaliza en dos direcciones: de "el mensaje" a **cualquier información o recurso** $I$, y de "un adversario" a **un conjunto $X$ cualquiera** de entidades que no deberían enterarse. La cláusula "ni siquiera por vías indirectas" es la que exige demostrar seguridad contra **canales de inferencia**, no sólo contra lectura directa; es el mismo requisito que más adelante hace falta la [[bell-lapadula#Bell-LaPadula|condición de cierre de Bell-LaPadula]] —bloquear el canal de escritura hacia abajo que eludiría la lectura hacia arriba— y el que motiva el requisito de "agregación" en las [[modelos-de-integridad-de-biba|políticas de integridad de Biba]] —impedir deducir información sensible a partir de datos publicados—.

## Integridad: tres sabores, no una sola pregunta

La filmina 6 distingue tres tipos de integridad (filmina 7), que son en realidad **tres preguntas distintas** que suelen quedar comprimidas bajo la misma palabra:

$$\begin{array}{l|l}
\text{Tipo} & \text{Pregunta que responde}\\ \hline
\text{Integridad de datos} & \text{¿el dato llegó intacto? (confianza en transporte y almacenamiento)}\\
\text{Integridad de origen} & \text{¿vino de quien dice? (confianza en la identidad que lo produjo)}\\
\text{Garantía} & \text{¿hace lo que promete? (confianza en que el recurso o programa funciona bien)}\\
\end{array}$$

*(Lectura nuestra.)* Las dos primeras ya tienen mecanismo dedicado en la Unidad 1: **integridad de datos** es exactamente lo que resuelve un [[message-authentication-code|MAC]] o una [[funciones-de-hash-criptograficas|función de hash]] —detectar que el mensaje cambió en el camino—, y **integridad de origen** es lo que resuelve una firma o, en el caso simétrico, el mismo MAC leído del lado de "sólo quien tiene la clave pudo producir esta etiqueta". La tercera, **garantía**, es de un orden distinto: no es una propiedad de un dato puntual sino de un programa o sistema completo, y no tiene un mecanismo criptográfico de una sola línea que la resuelva —se acerca más a verificación de software y auditoría que a criptografía—. El deck no vuelve a nombrar "garantía" en el resto de la clase; los modelos de integridad que siguen ([[modelos-de-integridad-de-biba|Biba]]) trabajan sobre todo con la primera noción, la de confiabilidad de datos y programas frente a modificación.

## Disponibilidad: la propiedad que un DoS rompe sin tocar las otras dos

La disponibilidad es la única de las tres que habla de **acceso efectivo en el tiempo** ("cuando lo requiera"), no de confianza ni de secreto. Un ataque de denegación de servicio no lee nada confidencial ni modifica nada íntegro: apaga el acceso, y eso alcanza para violar la política.

*(Cruce con video.)* El [[video-06-principios-de-diseno-2026|Video 06 — Principios de diseño (2026)]] lo remarca del lado de los principios de diseño, con una frase que funciona como corolario informal de esta definición: un sistema apagado no puede violar confidencialidad ni integridad, pero **sí** viola disponibilidad, y eso también cuenta como problema de seguridad. La filmina 8 es la formalización de la que esa observación es consecuencia directa.

## Por qué son tres ejes, no una escala

Las tres propiedades **no son intercambiables ni comparables entre sí**: están cuantificadas distinto (ningún/todo) y sobre relaciones distintas (obtener información / confiar / acceder). Un sistema puede tener cualquier combinación de las tres, independientemente:

- **Confidencial y no íntegro**: nadie ve el dato, pero está corrompido (un archivo cifrado con bit-rot).
- **Íntegro y no disponible**: el dato es confiable, pero inaccesible (un backup correcto en un disco que no arranca).
- **Disponible y no confidencial ni íntegro**: un servidor siempre responde, con datos públicos y posiblemente alterados.

No hay una noción de "más seguro" que combine las tres en un único número: son tres condiciones independientes, y un sistema real casi siempre prioriza dos a costa de la tercera —es la tensión clásica que un firewall o un [[zona-desmilitarizada|DMZ]] resuelven de un modo y una política militar como Bell-LaPadula, de otro completamente distinto (sacrifica disponibilidad y usabilidad por confidencialidad extrema).
