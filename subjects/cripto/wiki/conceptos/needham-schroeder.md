---
title: Needham-Schroeder
resumen: 'Protocolo simétrico de intercambio de claves con un KDC que comparte una clave previa con cada entidad y genera claves de sesión entre pares; base de Kerberos, y vulnerable a la reinyección de una clave de sesión vieja.'
fuentes: ["[[clase-05-protocolos-criptograficos]]", "[[distribucion-de-claves-y-kdc]]", "[[ataques-de-repeticion-y-frescura]]", "[[parciales-viejos]]"]
aliases: [Needham-Schroeder, Protocolo Needham-Schroeder, Ataque de reuso de clave de sesión, Segunda aproximación de Needham-Schroeder, Impersonación con clave de sesión vieja]
type: concepto
unidad: 1
clase: 5
orden: 7
created: 2026-09-04
updated: 2026-09-06
tags: [criptografia, protocolos, needham-schroeder, kdc, frescura, replay, clase-05, sin-dictar]
sources: ["raw/clases/Clase 05 - Protocolos.pdf"]
---

# Needham-Schroeder

**El protocolo de intercambio de claves simétrico, con un tercero de confianza (`KDC`), que resuelve del lado simétrico el mismo problema de identidad que la PKI resuelve del lado asimétrico — y el protocolo con más chance de aparecer, casi literal, en el primer parcial.** Es la nota más larga de esta clase, porque encadena dos intentos fallidos y un ataque exitoso, cada uno construido sobre el defecto del anterior.

Cubre las filminas **22 a 27** del PDF de teoría de la Clase 05. **Esta clase todavía no se dictó** — hoy es 04/09/2026, la fecha del [[cronograma]] es el 17/09 —, así que la nota está escrita contra el PDF de filminas, Katz & Lindell y lecturas propias rotuladas; no hay transcripción de esta clase. Las seis filminas fueron verificadas renderizando la página a 150 dpi: el texto extraído reproduce fielmente las fórmulas de los tres protocolos.

> **Por qué esta nota es la más rentable del temario de la Clase 05 para el primer parcial.** La nota [[parciales-viejos|Parciales viejos]] audita cuatro primeros parciales reales (2018 a 2025) y encuentra que **el Ejercicio 1 es siempre un protocolo**, con la estructura *"¿qué construye, qué problema tiene?"*. El examen **1C-2018** es, literalmente, este protocolo — con `T` en lugar de `KDC` como nombre del tercero de confianza, y sin el timestamp de la corrección de la sección final. El detalle completo, con los cuatro exámenes, está en la sección [[clase-05-protocolos-criptograficos#Para el parcial|Para el parcial]] de la nota de clase.

## Qué resuelve, y bajo qué hipótesis

*Filmina 22.* `Needham-Schroeder` es un protocolo de intercambio de claves **simétrico**: es el protocolo en el que se basan `Kerberos` y `Active Directory`. Requiere un servicio centralizado, el `KDC` (*Key Distribution Center*), y su función es generar **claves de sesión entre pares** — dos entidades que quieren hablar entre sí obtienen, vía el KDC, una clave simétrica compartida solo entre ellas dos.

La hipótesis de partida, sin la cual el protocolo no arranca: **cada entidad ya comparte una clave con el KDC**. Es exactamente el mismo tipo de hipótesis previa que la [[infraestructura-de-clave-publica|PKI]] resuelve de otra forma — ahí cada parte confía en una cadena de certificados hasta una raíz; acá cada parte comparte, de antemano, un secreto bilateral con el KDC. Cómo se llega a esa hipótesis —por qué distribuir una clave por par de participantes escala mal, y por qué un KDC central resuelve ese costo a cambio de un único punto de confianza— es el desarrollo de [[distribucion-de-claves-y-kdc|Distribución de claves y KDC]], de la Clase 04.

## Primera aproximación, y por qué no alcanza

*Filmina 23.* Con la nomenclatura que fija la propia filmina, $\mathrm{Enc}_k(M) = \{M\}_k$:

$$1)\ A \to \mathrm{KDC}:\ \{\text{Sesión } A \to B\}_{k_a}$$
$$2)\ A \leftarrow \mathrm{KDC}:\ \{k_s\}_{k_a} \,\Vert\, \{k_s\}_{k_b}$$
$$3)\ A \to B:\ \{k_s\}_{k_b}$$

$A$ le pide al KDC una clave de sesión para hablar con $B$. El KDC genera $k_s$ y se la envía a $A$ envuelta en dos partes: una que $A$ puede abrir con la clave $k_a$ que comparte con el KDC, y otra que $A$ **no puede** abrir —está cifrada con $k_b$, la clave de $B$— y que simplemente reenvía como "ticket" en el tercer mensaje.

**Los dos problemas.** *Filmina 24.* Ninguno de los tres mensajes lleva ningún elemento de frescura —ni nonce ni timestamp— y eso habilita dos ataques distintos:

- **Repetición (*replay*).** Un atacante que grabó una ejecución legítima anterior puede reenviar directamente $\{k_s\}_{k_b}$ y los mensajes que siguen. $B$ no tiene absolutamente ninguna información con la que distinguir esto de una sesión nueva y genuina con $A$.
- **Reuso de clave (*key reuse*).** Un atacante graba el mensaje 2 que el KDC envía a $A$. Cuando $A$, más adelante, quiera iniciar **otra** conversación distinta, el atacante se lo reinyecta en lugar de la respuesta fresca del KDC. $A$ (y por lo tanto $B$) terminan reutilizando, sin darse cuenta, la misma clave de sesión de una vez anterior.

## Segunda aproximación: agregar un nonce

*Filmina 25.* La respuesta al problema de arriba es agregar un valor de frescura — un nonce $r_1$ que $A$ elige y que ata cada respuesta del KDC a esta ejecución concreta:

$$1)\ A \to \mathrm{KDC}:\ A \,\Vert\, B \,\Vert\, r_1$$
$$2)\ A \leftarrow \mathrm{KDC}:\ \{A \,\Vert\, B \,\Vert\, r_1 \,\Vert\, k_s \,\Vert\, \{A \,\Vert\, k_s\}_{k_b}\}_{k_a}$$
$$3)\ A \to B:\ \{A \,\Vert\, k_s\}_{k_b}$$
$$4)\ A \leftarrow B:\ \{r_2\}_{k_s}$$
$$5)\ A \to B:\ \{r_2 - 1\}_{k_s}$$

**Por qué cada mensaje hace exactamente lo que hace** *(filmina 26)*:

- **Mensaje 2.** Va cifrado bajo $k_a$, la clave que solo $A$ y el KDC comparten, así que $A$ sabe que **viene efectivamente del KDC** — nadie más pudo haberlo producido. Y no es una repetición del ataque de la primera aproximación, porque el $r_1$ que vuelve adentro coincide con el que $A$ acababa de elegir y enviar en el mensaje 1: el nonce ata la respuesta a **esta** ejecución.
- **Mensaje 4.** Solo $B$ puede generarlo, porque requiere conocer $k_s$ — que $B$ acaba de obtener descifrando el mensaje 3 con $k_b$. Es el desafío con el que $B$ le avisa a $A$ de un intento de comunicación y le pide una prueba de que también tiene $k_s$.
- **Mensaje 5.** $A$ confirma la comunicación devolviendo $r_2 - 1$ cifrado con $k_s$ — demuestra que pudo descifrar el mensaje 4 y operar sobre $r_2$. $B$ sabe que esto **tampoco** es una repetición, porque $r_2$ es un nonce que el propio $B$ acaba de elegir para esta ejecución puntual.

**El patrón que vale la pena aislar** *(lectura nuestra)*: los mensajes 4 y 5 son, estructuralmente, un [[challenge-response-y-eke|challenge-response]] — $B$ desafía con un nonce cifrado bajo $k_s$, y $A$ demuestra conocer $k_s$ devolviendo una función simple del nonce ($r_2-1$) bajo la misma clave. Es la primera aparición, en este curso, de ese patrón aplicado a la confirmación mutua de una clave recién distribuida.

## El ataque: una clave de sesión vieja alcanza

*Filmina 27.* **Escenario.** El atacante $E$ ya obtuvo, por el medio que sea —por ejemplo, una clave que se filtró después de que la sesión terminara—, una clave de sesión **antigua** $k_s$. El ataque arranca directamente desde el **tercer** mensaje, sin tocar al KDC en absoluto:

$$E \to B:\ \{A \,\Vert\, k_s\}_{k_b}$$
$$E \leftarrow B:\ \{r_2\}_{k_s}$$
$$E \to B:\ \{r_2 - 1\}_{k_s}$$

$E$ simplemente **reenvía el mensaje 3 de una ejecución vieja**, que sigue siendo un ciphertext perfectamente válido bajo $k_b$ — nadie dijo que $\{A\Vert k_s\}_{k_b}$ caduque por su cuenta. $B$ lo descifra con su clave $k_b$, obtiene $A$ y $k_s$, y **no tiene ningún dato con el que distinguir** si $k_s$ es la clave que el KDC acaba de generar o una de hace un mes. $B$ le manda su desafío $\{r_2\}_{k_s}$ a quien cree que es $A$; como $E$ **sí conoce** $k_s$ —es justamente la clave comprometida—, puede descifrarlo, calcular $r_2 - 1$ y responder correctamente. **$E$ logra impersonar a $A$** frente a $B$, sin haber roto ninguna primitiva criptográfica y sin haber interactuado nunca con el KDC.

### Por qué el nonce de la segunda aproximación no alcanza

**El defecto de fondo, en una frase** *(lectura nuestra, siguiendo el razonamiento de la propia secuencia de filminas)*: el mensaje 3, $\{A\Vert k_s\}_{k_b}$, no lleva **ningún** elemento que le permita a $B$ distinguir una clave de sesión recién generada de una vieja. El nonce $r_1$ protege a **$A$** contra la repetición del mensaje 2 —porque $A$ eligió $r_1$ y puede comprobar que coincide—, pero no le da a **$B$** ninguna herramienta equivalente para el mensaje 3, porque $B$ nunca eligió ningún valor propio antes de recibirlo. La asimetría es exacta: hay frescura para un extremo del protocolo y no para el otro.

Y la consecuencia de esa asimetría es más grave que "una sesión queda expuesta": **una vez que cualquier clave de sesión pasada se compromete, el protocolo entero queda roto para siempre**, no solo para esa sesión puntual — cualquier clave de sesión vieja filtrada, sin importar cuánto tiempo haya pasado, sigue siendo una llave de impersonación válida contra $B$.

> **Aclaración de notación.** El deck alterna dos rótulos para el mismo tercero de confianza. Lo llama `KDC` en la filmina introductoria (22, *"Requiere un servicio centralizado (KDC)"*) y en los **diagramas** de las dos aproximaciones (23 y 25); lo llama `C` en las filminas de **prosa** (24, *"Un atacante graba el mensaje de C a A"*; 26, *"Encriptado con clave compartida A-C"*) y en el diagrama de la [[denning-sacco-y-frescura|modificación Denning-Sacco]] (28). La filmina 27 no lo nombra de ninguna forma: en su diagrama solo aparecen $E$ y $B$. Es la **misma entidad** en todos los casos — la alternancia de rótulo es una inconsistencia de las láminas, no dos protocolos distintos.

## La corrección

El arreglo —agregar un timestamp $T$ dentro del ticket que $B$ recibe, para que $B$ pueda verificar la frescura de la clave de sesión en lugar de aceptar cualquier $k_s$ que llegue bien envuelta— es la **modificación Denning-Sacco**, desarrollada en la nota siguiente: [[denning-sacco-y-frescura|Denning-Sacco y frescura]].
