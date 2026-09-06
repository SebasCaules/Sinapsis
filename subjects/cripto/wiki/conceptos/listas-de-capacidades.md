---
title: Listas de capacidades
resumen: 'La proyección por filas de la matriz de acceso: cada sujeto porta la lista de objetos y derechos que posee, lo que invierte quién controla el dato frente a un ACL y obliga a proteger la capacidad de alteración y falsificación.'
fuentes: ["[[clase-06-politicas-de-seguridad-y-control-de-acceso]]", "[[matriz-de-control-de-acceso]]", "[[listas-de-control-de-acceso]]"]
aliases: [Listas de capacidades, Capacidades, Capability-based security, Amplificación de privilegios, Sistema Tahoe]
type: concepto
unidad: 2
clase: 6
orden: 12
created: 2026-09-04
updated: 2026-09-04
tags: [control-de-acceso, capacidades, revocacion, clase-06, sin-dictar]
sources: ["Clase 08 - Control de acceso.pdf"]
---

# Listas de capacidades

**El otro corte de la matriz de acceso: en vez de preguntar "quién puede entrar a este objeto" (ACL), la capacidad pregunta "qué tiene este sujeto en el bolsillo" — y esa diferencia de dirección cambia por completo quién controla el dato.** Es la proyección de la [[matriz-de-control-de-acceso|matriz de control de acceso]] por **filas**.

*Filminas 14 a 22 del deck de Control de acceso (`Clase 08 - Control de acceso.pdf`). La clase todavía no se dictó —hoy es 04/09/2026, la clase es el 01/10/2026—; esta nota está escrita contra el PDF y lecturas propias, rotuladas como tales. No hay transcripción.*

## Definición

Con $S$ conjunto de sujetos, $O$ conjunto de objetos y $R$ conjunto de acciones (derechos):

$$CAP(s) = \{(o_i, r_i) \mid o_i \in O,\ r_i \subseteq R\}$$

$s$ no tiene ningún derecho sobre un objeto que no aparezca en $CAP(s)$ — otra vez el **principio de denegar por defecto**, la misma regla que en [[listas-de-control-de-acceso#Definición|ACL]].

## La diferencia de fondo con ACL: quién controla el dato

La fórmula de arriba parece un espejo simétrico de $ACL(o)$, pero **no lo es** en un aspecto crítico (filmina 16): **una capacidad funciona como una entrada que se posee**, no como un registro que el sistema consulta. La capacidad $(o_1, rwx)$ puede ser presentada por sujetos distintos, y quien la tiene, tiene el acceso — sin que el sistema medie en cada intento, como sí hace al consultar un ACL objeto por objeto.

Esa diferencia trae una consecuencia incómoda: **el sistema no controla estos datos** de la misma forma directa en que controla un ACL. Un ACL vive protegido junto al objeto y sólo el dueño lo modifica; una capacidad, en cambio, es algo que el sujeto **porta**, así que hacen falta mecanismos de protección **explícitos** para dos amenazas nuevas que ACL no tiene:

- que un usuario **altere** una capacidad (por ejemplo, extendiendo sus derechos),
- que un usuario **cree** capacidades por su cuenta, sin que el sistema las haya emitido.

## Cómo se implementa la posesión sin perder el control

*Filminas 17-18.* Tres mecanismos, cada uno resolviendo el problema de arriba por una vía distinta:

**Tags.** Marcas de bits controladas por **hardware** que impiden la modificación de registros de capacidad desde procesos de bajo privilegio — la protección vive por debajo del sistema operativo.

**Paging / segmentos protegidos.** Las capacidades se almacenan en un segmento de memoria marcado como **de sólo lectura**; los procesos acceden a ellas **indirectamente**, porque si accedieran directo se las podría copiar sin control. Ejemplo de la filmina: los **descriptores de archivo en Linux** son, en este sentido, capacidades — un proceso posee un entero pequeño (el fd) que el kernel traduce a un objeto real, y el proceso nunca manipula la estructura interna directamente.

**Criptografía.** Asociar a cada capacidad un **hash criptográfico** cifrado con una clave que sólo conoce el sistema; al presentar la capacidad, el sistema recalcula el hash y lo verifica.

### El mecanismo criptográfico, formalizado

*(Desarrollo nuestro, apoyado en [[message-authentication-code#La terna Gen, Mac y Vrfy|Message Authentication Code]] — la filmina no da esta formalización, sólo el nombre "criptografía".)* Sea $k$ una clave que sólo conoce el sistema y $C = (o, r)$ una capacidad (objeto, derechos). El sistema calcula y adjunta una etiqueta

$$t = \mathsf{Mac}_k(o \Vert r)$$

y entrega al sujeto el par $(C, t)$. Al presentarla, el sujeto envía $(o, r, t)$ y el sistema verifica $\mathsf{Vrfy}_k\bigl((o\Vert r),\, t\bigr) = 1$. Si $t$ no coincide con lo que produce $\mathsf{Mac}_k$ sobre $(o,r)$, la capacidad se rechaza. Esto resuelve exactamente las dos amenazas de arriba sin que el sistema tenga que guardar cada capacidad emitida: **alterar** $r$ sin conocer $k$ invalida $t$ (es la garantía de infalsificabilidad de un MAC, definida en [[seguridad-de-un-mac#El experimento Mac-Forge|Seguridad de un MAC]]), y **crear** una capacidad nueva de la nada exige forjar un $t$ válido para un $(o,r)$ elegido por el atacante — el mismo problema, otra vez.

## Controles adicionales

*Filmina 19.* **Control de copia**: como tener la capacidad implica tener el acceso, hay que restringir su copia — acceso indirecto (como en *paging*) o copia controlada por el propio sistema. **Amplificación**: la posibilidad de contar, temporalmente, con capacidades extendidas al ejecutar ciertas funciones — el ejemplo de la filmina es *user mode* vs. *kernel mode*: el sistema operativo "amplifica" temporalmente los privilegios del proceso durante una llamada al sistema, y se los retira al volver.

## Revocación por indirección

*Filmina 20.* Revisar **todas** las listas de capacidades del sistema para invalidar una es demasiado costoso, y en sistemas remotos sin control central directamente **imposible** — no hay ninguna autoridad central que sepa dónde están todas las copias. La solución práctica es la misma idea que ya resuelve el control de copia: **indirección**. Las capacidades no son el derecho en sí, sino **índices** dentro de una tabla que los procesos no pueden ver; revocar es simplemente invalidar la entrada correspondiente de esa tabla, sin tener que localizar cada copia de la capacidad que circula por el sistema.

## Ejemplo: Tahoe

*Filmina 21.* Sistema de archivos distribuido donde acceder a un archivo **requiere presentar una capacidad**, y hay capacidades separadas para **escritura**, **lectura** y **verificación** — no es un todo-o-nada, sino tres niveles independientes. Todo eso queda codificado en una única URI que combina clave de cifrado e información de validación:

```
URI:CHK:6hwdguhr5dvgte3qhosev7zszq:lgi66a5s6gchcu4yyaji:3:10:8448
```

La propia URI **es** la capacidad: quien la tiene puede descifrar y verificar el contenido, sin que ningún servidor central deba autorizar la operación — es la instancia real más directa del principio "poseer es poder acceder" con el que abre esta nota.

## ACLs y capacidades: equivalentes en teoría, distintos en uso

*Filmina 22.* Los dos modelos son **teóricamente equivalentes** — son las dos proyecciones (por columna, por fila) de la misma matriz de acceso —, pero difieren en la pregunta que responden y en dónde terminan usándose:

| | ACLs | Capacidades |
|---|---|---|
| Pregunta | Dado un objeto, ¿quiénes pueden usarlo y cómo? | Dado un sujeto, ¿qué objetos puede acceder y cómo? |
| Asociado a | Procesamiento imperativo | Procesamiento declarativo |
| Históricamente | El más desarrollado | Menos común |
| Ejemplo | Windows / Linux | Sistemas de respuesta de incidentes (IDS) |

**Lo que la filmina no dice, y conviene tener presente** *(lectura nuestra, no está en el deck)*: el motivo clásico por el que se prefieren capacidades en ciertos diseños de seguridad es el llamado **problema del deputy confundido** (*confused deputy problem*) — un ACL centraliza la decisión en un servicio con más privilegio que el usuario que lo invoca, y ese servicio puede terminar usando su propio privilegio en nombre de un pedido malicioso sin darse cuenta; una capacidad, en cambio, transporta el derecho junto con el pedido, así que el servicio nunca necesita más privilegio del que el propio pedido le entrega. No es contenido de esta clase — se deja acá sólo como contexto de por qué el modelo de capacidades, "menos común" según la filmina, sigue siendo relevante en el diseño de sistemas distribuidos como Tahoe.

## Ver también

- [[clase-06-politicas-de-seguridad-y-control-de-acceso#12. Listas de capacidades|Clase 06 — Listas de capacidades]]
- [[matriz-de-control-de-acceso|Matriz de control de acceso]] — la matriz completa de la que ésta es la proyección por filas
- [[listas-de-control-de-acceso|Listas de control de acceso]] — la proyección por columnas, teóricamente equivalente
- [[message-authentication-code#La terna Gen, Mac y Vrfy|Message Authentication Code]] — la terna Gen/Mac/Vrfy usada para formalizar la implementación criptográfica de una capacidad
- [[seguridad-de-un-mac#El experimento Mac-Forge|Seguridad de un MAC]] — la garantía de infalsificabilidad que hace que una capacidad protegida por MAC no se pueda alterar ni fabricar
- [[acls-propagables|ACLs propagables]] — otra variante donde el control viaja con la información, no con el objeto
- [[video-07-principios-de-diseno-2024#Qué no cubre este video|Video 07 — Principios de diseño (2024)]] y [[video-11-flujo-de-informacion|Video 11 — Flujo de información]] — confirman que ACL y capacidades son clase propia sin grabación
- Matt Bishop, *Computer Security: Art and Science*, cap. 16 (*Access Control Mechanisms*) ([[bibliografia|Bibliografía]])
