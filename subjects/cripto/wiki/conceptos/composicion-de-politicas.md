---
title: Composición de políticas
resumen: 'Qué ocurre al conectar dos sistemas seguros por separado: el resultado es una política nueva, no la suma de las dos originales, y decidir cuánto hay que ceder para volverlas consistentes es un problema difícil.'
fuentes: ["[[clase-06-politicas-de-seguridad-y-control-de-acceso]]", "[[politica-de-seguridad-y-sistema-seguro]]", "[[bell-lapadula]]", "[[lenguajes-de-descripcion-de-politicas]]"]
aliases: [Composición de políticas, Autonomía versus seguridad, Principio de autonomía, Principio de seguridad, Gong y Qian, Ejemplo Bob Alice Eve Lilith]
type: concepto
unidad: 2
clase: 6
orden: 9
created: 2026-09-04
updated: 2026-09-04
tags: [politicas-de-seguridad, composicion-de-politicas, bell-lapadula, np-hard, clase-06, sin-dictar]
sources: ["Clase 06 - Politicas.pdf"]
---

# Composición de políticas

**Qué pasa cuando se conectan dos sistemas que ya son seguros por separado, y por qué la respuesta no es "el sistema conjunto también es seguro".** Es la nota donde el bloque de políticas cierra con su conclusión más incómoda: ni siquiera decidir *cuánto* hay que ceder para componer dos políticas de forma consistente es, en general, un problema que se resuelva rápido.

*Filminas 48 a 55 del deck de Políticas (`Clase 06 - Politicas.pdf`). La clase todavía no se dictó —hoy es 04/09/2026, la clase es el 01/10/2026—, así que esta nota está escrita contra el PDF y lecturas propias, rotuladas como tales; no hay transcripción ni callouts `De la transcripción`.*

## El problema y las dos preguntas

*Filmina 48.* Conectar dos sistemas que son seguros **cada uno por su cuenta** no dice nada, todavía, sobre el sistema resultante de conectarlos. El deck abre la sección con dos preguntas que no tienen respuesta automática:

1. ¿La composición de los dos sistemas será segura?
2. ¿Se puede crear una política única, consistente con las dos originales?

La razón de fondo es que "seguro" es una propiedad de un **par** (política, sistema) — ver [[politica-de-seguridad-y-sistema-seguro|Política de seguridad y sistema seguro]] — y componer dos sistemas cambia el conjunto de transiciones posibles sin que ninguna de las dos políticas originales diga nada sobre las transiciones **nuevas** que la conexión habilita.

## El ejemplo de Bell-LaPadula compuesto

*Filminas 49-51.* El deck plantea el caso concreto: dos sistemas que siguen un modelo del tipo [[bell-lapadula|Bell-LaPadula]], y pregunta cuál es el modelo compuesto del sistema conjunto. Aparecen dos problemas de entrada, ninguno trivial:

- **Los grupos no tienen orden total.** Si cada sistema tiene su propia jerarquía de niveles, componerlos no es simplemente "pegar" las dos listas: hace falta decidir cómo se ordenan entre sí los niveles de un sistema respecto de los del otro.
- **Hace falta una correspondencia entre niveles de seguridad de los dos sistemas.** Nada garantiza que el $\mathsf{Secret}$ de un sistema signifique lo mismo, en confidencialidad real, que el $\mathsf{Secret}$ del otro.

> **Errata de la filmina.** La filmina 50, titulada *"Ejemplo"*, es un diagrama roto **en el propio PDF de la cátedra** — verificado sobre la página renderizada a 150 dpi, no es un artefacto de `pdftotext`: la lámina muestra el recuadro *"This image cannot currently be displayed"* de PowerPoint en el lugar donde debía ir la figura con los dos sistemas de niveles y categorías que se estaban componiendo. El deck perdió esa imagen en algún momento de su historia y nunca se la repuso.

Lo que sobrevive es el **análisis** de la filmina 51, que alcanza para reconstruir el tipo de ejemplo perdido aunque no sus compartimentos exactos: se determina el **orden de los niveles** entre los dos sistemas (la filmina da como ejemplo de correspondencia $\mathsf{S} < \mathsf{HIGH} < \mathsf{TS}$) y la **equivalencia de categorías** entre ambos (por ejemplo, que la categoría $\mathsf{east}$ de un sistema representa lo mismo que la del otro). El modelo compuesto resultante tendría **4 niveles** ($\mathsf{LOW} < \mathsf{S} < \mathsf{HIGH} < \mathsf{TS}$) y **3 categorías** ($\mathsf{SOUTH}, \mathsf{EAST}, \mathsf{WEST}$).

La conclusión que la filmina remarca importa más que el ejemplo en sí: **el resultado es una política nueva**, no la suma mecánica de las dos originales — ni siquiera cuando el modelo de base (Bell-LaPadula) es el mismo de los dos lados.

*(No es posible reconstruir de qué compartimentos exactos partía cada uno de los dos sistemas originales de la filmina 50: esa información vivía únicamente en la imagen rota, y no aparece en ningún otro lugar del deck.)*

## Cuándo la composición es trivial, y cuándo no

*Filminas 52-54.*

**Modelos iguales (filmina 52).** Si se puede reemplazar la política de cada componente por el modelo compuesto sin perder nada, la composición es **trivial**. Si no se puede, hay que demostrar que la composición **cubre** los requerimientos de las políticas de los componentes — y la filmina lo marca en su propio texto como *"muy difícil"*.

**Modelos diferentes (filmina 53).** Acá no hay ni siquiera una definición compartida de qué significa "seguro". Dos preguntas quedan abiertas y **sin una única respuesta**: ¿qué política domina la composición?, ¿qué significa "seguro" en este contexto conjunto? El deck ofrece dos **principios guía**, que no son equivalentes y pueden entrar en conflicto entre sí:

$$\textbf{Autonomía: } \text{todo acceso permitido por la política de \emph{algún} componente debe seguir permitido en la política emergente}$$

$$\textbf{Seguridad: } \text{todo acceso prohibido por la política de \emph{algún} componente debe seguir prohibido en la política emergente}$$

**Consecuencias (filmina 54).** La política compuesta que el deck adopta satisface el segundo principio: hereda **todas** las prohibiciones de los componentes. Eso resuelve lo prohibido y lo permitido explícitamente, pero deja un hueco: ¿qué hacer con los accesos que **ninguna** de las dos políticas originales menciona? Dos salidas, y son incompatibles entre sí:

- **Permitirlo** por defecto — el modelo original de **Gong y Qian**.
- **Prohibirlo** por defecto — el **principio de denegación por defecto**, la misma idea que ya aparece en los [[lenguajes-de-descripcion-de-politicas|lenguajes cerrados]] y que reaparece después en [[listas-de-control-de-acceso|ACLs]] y [[listas-de-capacidades|capacidades]].

> **Errata de la filmina** *(inferencia nuestra sobre el nombre).* La filmina 54 escribe literalmente *"Gong & Quiam"* — verificado sobre la página renderizada a 150 dpi, no es un artefacto de extracción: el texto de `pdftotext` reproduce la misma grafía. Es casi con certeza un error tipográfico del propio deck: el trabajo de referencia sobre interoperabilidad segura de políticas y su resultado de complejidad NP —citado más abajo en esta misma sección— es el de **Li Gong y Xiaolei Qian**, no de ningún "Quiam". Se preserva la grafía original de la filmina y se deja constancia del nombre probable, sin poder confirmarlo con ningún otro material de la cátedra.

## El ejemplo completo, desarrollado

*Filmina 55.* Dos sistemas, cada uno con una regla puntual:

$$\text{Sistema } X:\quad \text{Bob \emph{no puede} leer archivos de Alice}$$
$$\text{Sistema } Y:\quad \text{Eve y Lilith \emph{pueden} leer los archivos del otro (mutuamente)}$$

La filmina pide componerlos identificando roles entre los dos sistemas: Bob juega, en el sistema compuesto, el papel de Eve; Alice, el de Lilith.

**Paso 1 — expandir por transitividad.** La regla de $Y$ es simétrica: Eve lee a Lilith **y** Lilith lee a Eve. Trasladando la identificación de roles, eso genera **dos** candidatos de acceso en el sistema compuesto:

$$\text{candidato 1: Bob lee archivos de Alice} \qquad \text{candidato 2: Alice lee archivos de Bob}$$

**Paso 2 — quitar lo que alguna política prohíbe.** El sistema $X$ prohíbe explícitamente el candidato 1 (Bob lee a Alice). Del candidato 2 —Alice lee a Bob— ninguno de los dos sistemas dice nada en contra: $X$ sólo habla de Bob leyendo a Alice, no al revés, y $Y$ lo permitiría. Por el **principio de seguridad**, hay que quitar el candidato 1; el candidato 2 sobrevive porque ninguna política lo prohíbe.

**Resultado:** la política compuesta mínima que respeta a $X$ y a $Y$ conserva *"Alice puede leer archivos de Bob"* y descarta *"Bob puede leer archivos de Alice"* — **una** relación quitada de dos candidatas, que es exactamente el mínimo posible dado que $X$ sólo prohíbe una de las dos direcciones. *(El desarrollo paso a paso es nuestro; el enunciado y la metodología de tres pasos son de la filmina.)*

### Por qué el caso general es difícil

La filmina cierra con la conclusión más fuerte de la sección, sin desarrollar la demostración:

> **Determinar el número mínimo de relaciones que hay que quitar para que la composición quede consistente es, en general, un problema NP.**

El ejemplo de arriba es demasiado chico para exhibir la dificultad —con dos personas y una sola prohibición, "cuál quitar" es obvio—, pero la estructura general **sí escala mal**: cuando la expansión transitiva de muchos sistemas produce un conjunto grande de candidatos con prohibiciones cruzadas y superpuestas, decidir cuál es el subconjunto **mínimo** a eliminar para que ninguna prohibición sobreviva es un problema combinatorio de la misma familia que la búsqueda de un conjunto mínimo de aristas a quitar de un grafo para eliminar todos sus ciclos o violaciones de restricción —un problema de optimización combinatoria sobre un grafo de relaciones, no una simple revisión caso por caso—. *(Esta analogía con problemas de grafos es lectura nuestra: el deck no la desarrolla, sólo enuncia la conclusión de NP-completitud/dureza.)* La consecuencia práctica es la que vale para el parcial: componer dos políticas seguras no es sólo conceptualmente delicado —qué principio guía usar, qué hacer con los huecos—, sino que encontrar la composición **óptima** (la que sacrifica lo menos posible) es computacionalmente intratable en el caso general.

## Ver también

- [[clase-06-politicas-de-seguridad-y-control-de-acceso#9. Composición de políticas|Clase 06 — Composición de políticas]]
- [[politica-de-seguridad-y-sistema-seguro|Política de seguridad y sistema seguro]] — la definición de "seguro" que esta sección pone a prueba al componer sistemas
- [[bell-lapadula|Bell-LaPadula]] — el modelo que protagoniza el ejemplo de composición de las filminas 49-51
- [[lenguajes-de-descripcion-de-politicas|Lenguajes de descripción de políticas]] — de donde sale el principio de denegación por defecto que reaparece acá como una de las dos salidas posibles
- [[muralla-china|Muralla china]] — el otro modelo del deck de Políticas, con su propio elemento temporal que ninguna composición de esta sección contempla
- [[matriz-de-control-de-acceso|Matriz de control de acceso]] — el modelo que retoma el deck de Control de acceso inmediatamente después de esta sección
- Matt Bishop, *Computer Security: Art and Science*, cap. 4 (*Security Policies*), y la línea de trabajo de Li Gong y Xiaolei Qian sobre interoperabilidad segura entre políticas ([[bibliografia|Bibliografía]])
