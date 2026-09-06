---
title: Matriz de control de acceso
resumen: 'Modelo que asigna a cada par sujeto-objeto un conjunto de derechos. Es el más expresivo y el más caro, disperso e inmanejable a escala, por lo que solo se implementan sus dos proyecciones, ACL por columnas y capacidades por filas.'
fuentes: ["[[clase-06-politicas-de-seguridad-y-control-de-acceso]]", "[[lenguajes-de-descripcion-de-politicas]]"]
aliases: [Matriz de control de acceso, Matriz de acceso, Access control matrix, Matriz de accesos]
type: concepto
unidad: 2
clase: 6
orden: 10
created: 2026-09-04
updated: 2026-09-04
tags: [control-de-acceso, matriz-de-acceso, acl, capacidades, clase-06, sin-dictar]
sources: ["Clase 08 - Control de acceso.pdf"]
---

# Matriz de control de acceso

**El modelo más simple y más expresivo para representar quién puede hacer qué sobre qué, y por qué en la práctica nadie lo almacena literalmente como una matriz.** Es la nota bisagra entre la parte teórica del deck de Políticas y los dos mecanismos concretos que dominan el resto de la clase: ACLs y listas de capacidades.

*Filminas 2-3 del deck de Control de acceso (`Clase 08 - Control de acceso.pdf`). La clase todavía no se dictó —hoy es 04/09/2026, la clase es el 01/10/2026—, así que esta nota está escrita contra el PDF y lecturas propias, rotuladas como tales; no hay transcripción.*

## La definición

Una fila por sujeto (usuario), una columna por objeto, y las acciones permitidas en la intersección:

$$\begin{array}{c|ccccc}
 & Obj_1 & Obj_2 & Obj_3 & \cdots & Obj_n\\ \hline
Usuario_1 & r & r & rx & & rwx\\
Usuario_2 & & ox & & & \\
\vdots & & & & & \\
Usuario_n & o & x & & &
\end{array}$$

Formalmente, con $S$ el conjunto de sujetos, $O$ el de objetos y $R$ el de acciones posibles (derechos), la matriz es una función

$$M: S \times O \to 2^{R}$$

que a cada par (sujeto, objeto) le asigna un subconjunto de derechos — posiblemente vacío, que es la celda en blanco de la tabla de arriba. *(La formalización como función $S \times O \to 2^{R}$ es lectura nuestra a partir del ejemplo de la filmina, que sólo da la tabla; el vocabulario de "acción permitida en la intersección" es literal del deck.)*

Esta forma es exactamente la de una política **cerrada** en el sentido de [[lenguajes-de-descripcion-de-politicas|Lenguajes de descripción de políticas]]: el ejemplo de esa sección con $A = \{(\mathsf{admin},\mathsf{sys},\mathsf{execute}),\dots\}$ **es**, literalmente, una matriz de acceso escrita como un conjunto de triplas $(sujeto, objeto, derecho)$ en lugar de como una tabla — la representación cambia, la información es idéntica.

## Por qué "el más expresivo" y "el más caro" son la misma propiedad

**Permite implementar cualquier política.** No hay ninguna restricción estructural sobre qué combinaciones sujeto-objeto-derecho son válidas: cada celda es independiente de todas las demás. Ésa es su fuerza y, a la vez, el origen de todos sus problemas prácticos.

**El crecimiento.** El propio ejemplo de la filmina lo cuantifica: 100.000 archivos por 500 usuarios dan

$$100\,000 \times 500 = 50\,000\,000 \text{ entradas}$$

—cincuenta millones de celdas para un sistema de tamaño modesto, verificado: la cuenta de la filmina es correcta. Y eso es sólo el **tamaño** de la matriz completa, sin contar el costo de mantenerla actualizada.

De ese único hecho —una matriz gigantesca y casi toda vacía— salen, sin necesidad de otro argumento, las cuatro debilidades que la filmina lista:

- **Desperdicio de espacio.** La matriz real es siempre **dispersa**: la inmensa mayoría de los pares usuario-objeto no tiene ningún derecho asignado. Almacenar cincuenta millones de celdas para representar, típicamente, unos pocos miles de derechos reales es puro desperdicio.
- **Facilidad para determinar accesos.** Ésta es, en realidad, una ventaja marcada por la propia filmina: dado un objeto puntual, basta mirar su **columna** para saber quién puede acceder a él y cómo.
- **Complejidad para soportar altas y bajas.** Agregar un usuario o un objeto nuevo cambia la estructura completa de la matriz — hay que agregar una fila o columna entera, la mayoría de cuyas celdas quedarán vacías.
- **Administración compleja.** Se administra elemento a elemento: no hay forma de decir "todos los profesores pueden leer este archivo" sin escribir una entrada por cada profesor — el problema que después resuelven los **grupos** dentro de [[listas-de-control-de-acceso#Grupos: el volumen y sus conflictos|ACLs]].

## Las dos proyecciones que sí se usan

Nadie implementa la matriz completa. Lo que se implementa son sus dos **proyecciones**, cada una recortando la dispersión desde un eje distinto:

- **Por columna** → [[listas-de-control-de-acceso|Listas de control de acceso (ACL)]]: para cada objeto, sólo la lista de pares (sujeto, derechos) que tienen algo asignado. Resuelve directamente la pregunta *"¿quién puede acceder a este objeto?"*.
- **Por fila** → [[listas-de-capacidades|Listas de capacidades]]: para cada sujeto, sólo la lista de pares (objeto, derechos) que posee. Resuelve la pregunta inversa, *"¿a qué puede acceder este sujeto?"*.

Las dos secciones siguientes muestran que ACLs y capacidades son **teóricamente equivalentes** — proyectar por columna o por fila no pierde ni agrega información, sólo cambia qué pregunta es barata de responder y cuál queda cara.

## Un caso real: la matriz como política basada en atributos

*(Cruce con video, no del deck.)* El [[video-12-proteccion-de-datos-personales#6.5. Data labeling y el ejemplo de AWS Tag Policy|Video 12]] trae un ejemplo de policy de AWS —JSON con versión `2012-10-17`— anotado con la terna clásica de control de acceso: el campo `Principal` es el **sujeto**, `Resource` es el **objeto**, y una condición sobre una etiqueta (`Condition`/`StringEquals` sobre `s3:ExistingObjectTag/environment`) reemplaza a la celda puntual de la matriz. Es la misma estructura sujeto-objeto-derecho de esta sección, con una variante que evita exactamente el problema de "altas y bajas" señalado arriba: en vez de una celda por objeto puntual, la condición se escribe contra una **etiqueta**, así que la política sobrevive a que aparezcan objetos nuevos sin tocar ninguna entrada — el mismo objetivo que persiguen ACLs y capacidades, resuelto por una tercera vía (control de acceso basado en atributos) que ninguno de los dos decks de esta clase desarrolla.

## Ver también

- [[clase-06-politicas-de-seguridad-y-control-de-acceso#10. Matriz de control de acceso|Clase 06 — Matriz de control de acceso]]
- [[lenguajes-de-descripcion-de-politicas|Lenguajes de descripción de políticas]] — el lenguaje cerrado de la filmina 10-11 es, en el fondo, una matriz de acceso escrita como conjunto de triplas
- [[composicion-de-politicas|Composición de políticas]] — la sección inmediatamente anterior del recorrido de la clase
- [[listas-de-control-de-acceso|Listas de control de acceso]] — la proyección por columna
- [[listas-de-capacidades|Listas de capacidades]] — la proyección por fila
- [[video-12-proteccion-de-datos-personales#6.5. Data labeling y el ejemplo de AWS Tag Policy|Video 12 — Protección de datos personales]] — el ejemplo de policy de AWS anotado con sujeto/objeto/derecho
- Matt Bishop, *Computer Security: Art and Science*, cap. 16 (*Access Control Mechanisms*) ([[bibliografia|Bibliografía]])
