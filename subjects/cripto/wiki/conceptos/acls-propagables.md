---
title: ACLs propagables
resumen: 'Variante de ACL en la que el control de acceso viaja con la información y no con el objeto: copiar el contenido no libera de la restricción original, y sus cuatro reglas por intersección degradan permisos como el Low-Water-Mark de Biba.'
fuentes: ["[[clase-06-politicas-de-seguridad-y-control-de-acceso]]", "[[listas-de-control-de-acceso]]", "[[modelos-de-integridad-de-biba]]"]
aliases: [ACLs propagables, PACL, Propagated ACLs, Control de acceso que sigue a la información]
type: concepto
unidad: 2
clase: 6
orden: 14
created: 2026-09-04
updated: 2026-09-04
tags: [control-de-acceso, acl, pacl, biba, clase-06, sin-dictar]
sources: ["Clase 08 - Control de acceso.pdf"]
---

# ACLs propagables

**Una variante de ACL donde el control de acceso no vive pegado al objeto, sino a la información que ese objeto contiene — así que copiar el contenido a un objeto nuevo no es forma de escapar de la restricción original.** Es la sección más corta de las ocho, pero la que conecta más directamente con un modelo de otra parte de la clase: el ejemplo desarrollado termina siendo, según la propia filmina, una implementación de Biba.

*Filminas 28 a 30 del deck de Control de acceso (`Clase 08 - Control de acceso.pdf`). La clase todavía no se dictó —hoy es 04/09/2026, la clase es el 01/10/2026—; esta nota está escrita contra el PDF y lecturas propias, rotuladas como tales. No hay transcripción.*

## Por qué hace falta esta variante

Una [[listas-de-control-de-acceso|ACL]] ordinaria protege un **objeto**: $ACL(o)$ dice quién puede leer o escribir $o$. Pero si un sujeto autorizado a leer $o$ **copia** su contenido a un objeto nuevo $o'$ que él mismo crea, nada en el modelo de ACL básico impide que $o'$ tenga un ACL completamente distinto —más permisivo— del que protegía a $o$: la información escapó de su control de acceso original con sólo copiarla.

**PACL** (*propagated ACL*, ACL propagable) cierra ese agujero: permite al **creador** de un objeto determinar quiénes y cómo acceden a él, pero además hace que la regla **siga a la información, no al objeto** — si el contenido se copia a un objeto nuevo, el control de acceso viaja con él, no se resetea.

## Las cuatro reglas

$$\begin{aligned}
&\text{Si } s_i \text{ crea } o: &&PACL(o) = PACL_{s_i}\\
&\text{Si } s_i \text{ modifica } o: &&PACL(o) \leftarrow PACL_{s_i} \cap PACL(o)\\
&\text{Si } s_i \text{ lee } o \iff (s_i, r) \in ACL(o): &&PACL'_{s_i} = PACL_{s_i} \cap PACL(o)\\
&\text{Si } s_i \text{ escribe } o \iff (s_i, w) \in ACL(o): &&PACL'(o) = PACL(o) \cap PACL_{s_i}
\end{aligned}$$

En prosa:

- **Crear** un objeto le pone el PACL de su creador, tal cual.
- **Modificar** un objeto existente **reduce** el PACL del objeto a la intersección con el de quien lo modificó.
- **Leer** un objeto **reduce** el PACL propio del lector a la intersección con el del objeto leído — el lector "hereda" las restricciones de lo que consumió.
- **Escribir** un objeto reduce el PACL **del objeto** a la intersección con el de quien escribió.

Las cuatro reglas comparten una sola dirección: **la intersección**. Ninguna operación puede *ampliar* un PACL, sólo restringirlo o mantenerlo — es la misma lógica del "mínimo común denominador de derechos" que ya aparece en la [[muralla-china#Propiedad de cierre|propiedad de cierre de la muralla china]]: una vez que la información pasó por un canal más restringido, no hay forma de que recupere derechos que perdió en el camino.

## El ejemplo, desarrollado paso a paso

*Filminas 29-30.* Estado inicial:

$$PACL_{\text{Pablo}} = \{(\text{Pablo}, rw), (\text{Horacio}, r)\}, \qquad PACL_{\text{Horacio}} = \{(\text{Horacio}, rw), (\text{Juan}, r)\}, \qquad PACL(o_1) = PACL_{\text{Pablo}}$$

**Paso 1 — Horacio escribe $o_2$ (objeto nuevo).** Por la regla de escritura, $PACL(o_2) = PACL(o_2) \cap PACL_{\text{Horacio}}$; como $o_2$ es nuevo y no tiene restricción previa, el resultado es directamente

$$PACL(o_2) = PACL_{\text{Horacio}} = \{(\text{Horacio}, rw), (\text{Juan}, r)\}$$

**Juan puede leer $o_2$** — hereda el acceso que ya tenía sobre los objetos de Horacio, porque $o_2$ nace con el PACL completo de quien lo escribió.

**Paso 2 — Horacio lee $o_1$.** Por la regla de lectura,

$$PACL'_{\text{Horacio}} = PACL_{\text{Horacio}} \cap PACL(o_1) = \{(\text{Horacio}, rw),(\text{Juan}, r)\} \cap \{(\text{Pablo}, rw),(\text{Horacio}, r)\}$$

La intersección de dos conjuntos de pares (sujeto, derecho) sólo retiene lo que **ambos** conjuntos permiten para el **mismo** sujeto: $\text{Juan}$ no aparece en el PACL de $o_1$, así que se pierde por completo; $\text{Horacio}$ aparece en los dos, con $rw$ en el suyo propio y sólo $r$ en el de $o_1$ — la intersección de derechos se queda con el más restrictivo:

$$PACL'_{\text{Horacio}} = \{(\text{Horacio}, r)\}$$

El PACL de Horacio **se degrada**: pierde a Juan por completo, y su propio derecho baja de $rw$ a $r$. Leer un objeto más restringido contamina —restringe— lo que el lector puede a su vez propagar.

**Paso 3 — Horacio crea $o_2'$ con el contenido de $o_1$** (después de haberlo leído en el Paso 2). Por la regla de creación,

$$PACL(o_2') = PACL'_{\text{Horacio}} = \{(\text{Horacio}, r)\}$$

**Juan ya no tiene ningún acceso** a esta nueva copia — aunque sí lo tenía sobre el $o_2$ del Paso 1, escrito directamente por Horacio sin pasar antes por la lectura de $o_1$. Es la prueba de que el mecanismo funciona: la **misma** persona (Horacio), con el **mismo** contenido origen, produce copias con derechos distintos según el camino que tomó la información — directo (Paso 1) versus a través de una lectura restringida (Pasos 2-3).

## La conexión con Biba, que la propia filmina señala

La filmina cierra el ejemplo con una observación que conecta directamente con otra sección de la Clase 06:

> *"Es una implementación casi directa de una política de integridad según el modelo de Bilba."*

> **Errata de la filmina:** el PDF escribe literalmente "Bilba", no "Biba" —verificado sobre la página renderizada a 150 dpi, no es un artefacto de `pdftotext`—; es un error tipográfico real del deck de Control de acceso. El modelo al que se refiere la observación es el de **Biba**, desarrollado en [[modelos-de-integridad-de-biba|Modelos de integridad de Biba]]. Se preserva la grafía original dentro de la cita.

La analogía es exacta: en [[modelos-de-integridad-de-biba#Los tres modelos|Low-Water-Mark]] —uno de los tres modelos de Biba— leer un objeto de menor nivel de integridad **degrada** el nivel del sujeto que lo lee, $i'(s) = \min(i(s), i(o))$, para impedir que después contamine información de nivel alto con lo que acaba de leer. Acá pasa lo mismo con el PACL: leer un objeto con un PACL más restringido **degrada** el PACL propio de quien lee (Paso 2), y esa degradación se propaga a cualquier cosa que ese sujeto cree después (Paso 3) — exactamente el mismo patrón de "lo que entra por abajo, empuja todo hacia abajo" que Low-Water-Mark aplica a niveles de integridad en lugar de a conjuntos de permisos.

## Ver también

- [[clase-06-politicas-de-seguridad-y-control-de-acceso#14. ACLs propagables|Clase 06 — ACLs propagables]]
- [[listas-de-control-de-acceso|Listas de control de acceso]] — el ACL ordinario del que PACL es una variante
- [[secretos-compartidos-y-metodo-de-shamir|Secretos compartidos y método de Shamir]] — la sección inmediatamente anterior
- [[oauth-2|OAuth 2.0]] — la sección inmediatamente siguiente
- [[modelos-de-integridad-de-biba#Los tres modelos|Modelos de integridad de Biba]] — el modelo del que este mecanismo es, según la propia filmina, una implementación casi directa
- [[muralla-china#Propiedad de cierre|Muralla china]] — otra política que usa la misma lógica de "restringir por intersección" para cerrar canales indirectos
- Matt Bishop, *Computer Security: Art and Science*, cap. 16 (*Access Control Mechanisms*) ([[bibliografia|Bibliografía]])
