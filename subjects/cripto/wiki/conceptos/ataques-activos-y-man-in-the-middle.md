---
title: Ataques activos y man in the middle
resumen: 'Los cuatro poderes de un adversario que además de escuchar puede escribir en el canal —omitir, reescribir, reordenar y repetir— y la sustitución de clave pública que rompe todo esquema de intercambio visto hasta la Clase 04.'
fuentes: ["[[clase-05-protocolos-criptograficos]]", "[[modelos-de-ataque]]", "[[infraestructura-de-clave-publica]]"]
aliases: [Ataques activos, Man in the middle, MITM, Repositorio de claves públicas, Sustitución de clave pública, Ataque activo sobre el intercambio de claves]
type: concepto
unidad: 1
clase: 5
orden: 1
created: 2026-09-04
updated: 2026-09-06
tags: [criptografia, protocolos, mitm, ataques-activos, administracion-de-claves, clase-05, sin-dictar]
sources: ["raw/clases/Clase 05 - Protocolos.pdf"]
---

# Ataques activos y man in the middle

**Por qué ningún protocolo de intercambio de claves visto hasta la Clase 04 sobrevive a un adversario que puede modificar mensajes, y no solo leerlos.** Es la nota que explica el salto de modelo de amenaza que motiva toda la clase: pasar de "alguien escucha" a "alguien puede mentir en el medio".

Cubre las filminas **2 a 6** del PDF de teoría de la Clase 05. **Esta clase todavía no se dictó** — hoy es 04/09/2026 y la fecha del [[cronograma]] es el 17/09 — así que la nota está escrita contra el PDF de filminas, Katz & Lindell y lecturas propias rotuladas; no hay transcripción ni callouts *De la transcripción*. Verificado renderizando las filminas 5 y 6 a 150 dpi.

## El punto de partida: un canal seguro exige una clave ya compartida

*Filminas 2-3.* Un criptosistema `CCA`-Secure permite enviar información entre $A$ y $B$ manteniendo confidencialidad e integridad —$\mathrm{Enc}_k(M)$, con la maquinaria de [[cifrado-autenticado|cifrado autenticado]]—, pero **exige que las dos partes ya conozcan una misma clave**. Un protocolo de [[intercambio-de-claves|intercambio de claves]] es lo que resuelve ese "ya conozcan": formalmente, un protocolo $\Pi(n)$ ejecutado por dos partes sin más entrada que el parámetro de seguridad, cuya salida es la transcripción de los mensajes intercambiados más dos claves, una por parte,

$$\Pi(n) \;\longrightarrow\; (\mathrm{Tran},\, k_a,\, k_b)$$

con la **condición fundamental** de que las dos coincidan:

$$k_a = k_b$$

Ese es exactamente el molde que instancia Diffie-Hellman en la [[clase-04-criptografia-asimetrica-y-firma-digital|Clase 04]], y la definición completa —con el experimento `KE` que mide si la clave resultante sirve— está en [[intercambio-de-claves|Intercambio de claves]]. Todo lo que sigue en esta clase **asume ese problema resuelto** contra un espía puramente pasivo, y pregunta qué pasa cuando el adversario deja de serlo.

## Los cuatro poderes de un atacante activo

*Filmina 4.* Frente a un intercambio de claves como el de [[clase-04-criptografia-asimetrica-y-firma-digital|Diffie-Hellman]], un espía puramente pasivo solo puede observar la transcripción. Un atacante **activo** puede, además:

- **Omitir** mensajes.
- **Reescribir** su contenido.
- **Reordenar** la secuencia.
- **Repetir** mensajes ya enviados.

La filmina es categórica: **ninguno de los esquemas de intercambio de claves vistos hasta la Clase 04 funciona frente a este adversario**. La familia de ataques que lo explota es la que da nombre a esta nota: `Man in the Middle` (`MITM`).

> **Por qué esto no es una sorpresa técnica, sino un cambio de modelo** *(lectura nuestra)*. Las pruebas de seguridad que el curso vio hasta acá —[[pruebas-de-indistinguibilidad|pruebas de indistinguibilidad]], los [[modelos-de-ataque|modelos de ataque]] `COA`/`KPA`/`CPA`/`CCA`— acotan qué puede **ver** o **elegir consultar** el adversario, pero siempre contra un canal que entrega los mensajes intactos entre las partes honestas. Un intercambio de claves ideal, como el $\Pi(n)\to(\mathrm{Tran}, k_a, k_b)$ de [[intercambio-de-claves|Intercambio de claves]], se diseñó y demostró bajo esa hipótesis de canal honesto. Un atacante que además puede **escribir** en el canal no está fuera del alcance de una primitiva más fuerte: está fuera del alcance del **modelo entero**, porque la garantía $k_a = k_b$ nunca se formuló contra un adversario con ese poder.

## El problema de origen: ¿de dónde sale una clave pública? (filmina 5)

Todo esquema asimétrico visto hasta la Clase 04 **confía implícitamente** en que una clave pública corresponde a la identidad correcta. Esa confianza no viene de la matemática del esquema — viene de cómo se obtuvo la clave. La filmina lo plantea con $A$ consultando un repositorio $\mathrm{REP}$:

$$A \xrightarrow{\;\text{¿clave de } B\text{?}\;} \mathrm{REP}, \qquad \mathrm{REP} \xrightarrow{\;pk_b\;} A \qquad \text{(lo esperado)}$$

Si esa asociación identidad-clave se puede vulnerar, el ataque es directo. Con $E$ interpuesto entre $A$ y $\mathrm{REP}$:

$$A \xrightarrow{\;\text{¿clave de } B\text{?}\;} E \xrightarrow{\;\text{¿clave de } B\text{?}\;} \mathrm{REP}, \qquad \mathrm{REP} \xrightarrow{\;pk_b\;} E \xrightarrow{\;pk_e\;} A$$

$E$ **no bloquea** la consulta: la reenvía y obtiene $pk_b$ genuina de $\mathrm{REP}$. El ataque está enteramente en la respuesta — $E$ le entrega a $A$ su propia clave $pk_e$ en lugar de $pk_b$. La filmina resalta $pk_e$ en rojo precisamente en ese punto, para marcar la sustitución.

**Lo que hace posible este paso es la ausencia total de autenticación en el canal $A$–$\mathrm{REP}$–$B$.** $\mathrm{REP}$ no firma su respuesta, y $A$ no tiene ninguna forma de distinguir una respuesta genuina de $\mathrm{REP}$ de una inyectada por $E$: ambas llegan con el mismo formato, por el mismo canal. Este es exactamente el vacío que la [[infraestructura-de-clave-publica|infraestructura de clave pública]] va a llenar.

## La consecuencia: intercepción y modificación transparentes (filmina 6)

Una vez que $A$ tiene la clave equivocada, cree que puede hablar en forma confidencial con $B$. Lo que $A$ imagina:

$$A \xrightarrow{\;\mathrm{Enc}_{pk_b}(M)\;} B$$

Lo que ocurre en realidad:

$$A \xrightarrow{\;\mathrm{Enc}_{pk_e}(M)\;} E \xrightarrow{\;\mathrm{Enc}_{pk_b}(M)\;} B$$

$E$ recibe un cifrado bajo **su propia** clave pública — la que $A$ cree que es de $B$ —, lo descifra con la clave privada correspondiente, lee o modifica $M$ a voluntad, y **vuelve a cifrarlo bajo la clave real de $B$** antes de reenviarlo. Ni $A$ ni $B$ tienen ningún indicio de que el mensaje pasó por un tercero: los dos extremos ven exactamente el tráfico que esperarían ver en una sesión legítima.

**El cierre de la filmina es la tesis de toda la clase:** *el problema no está en la función de cifrado — entra en la esfera de administración de claves.* $\mathrm{Enc}$ puede ser perfectamente `CPA`-Secure o `CCA`-Secure; eso no importa si la clave que se está usando para cifrar nunca fue la correcta. El ataque no rompe ninguna primitiva criptográfica: rompe la premisa no verificada de que $pk_b$ pertenece a $B$.

## Por qué esto reordena el resto de la clase

Este ataque es la bisagra entre las dos mitades del temario que traza el [[clase-05-protocolos-criptograficos#Mapa de la clase|mapa de la clase]]: del lado asimétrico, la respuesta es atar identidades a claves con un tercero confiable que **firma** esa asociación — la [[infraestructura-de-clave-publica|infraestructura de clave pública]] y los [[certificados-digitales|certificados digitales]] que le siguen. Del lado simétrico, [[needham-schroeder|Needham-Schroeder]] enfrenta el mismo problema de identidad con un tercero confiable distinto — un `KDC` que **comparte** una clave con cada parte en lugar de firmar certificados.
