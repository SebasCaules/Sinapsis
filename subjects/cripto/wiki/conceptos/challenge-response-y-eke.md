---
title: Challenge-response y EKE
resumen: 'Protocolo en el que el verificador envía un desafío fresco y la entidad responde con una función de la clave y ese desafío, sin transmitirla; EKE cifra el diálogo entero para cerrar la verificación offline.'
fuentes: ["[[clase-07-autenticacion]]", "[[message-authentication-code]]", "[[ataques-a-un-sistema-de-autenticacion]]"]
aliases: [Challenge-response, Pregunta-respuesta, EKE, Encrypted Key Exchange, Autenticación por desafío]
type: concepto
unidad: 2
clase: 7
orden: 9
created: 2026-09-04
updated: 2026-09-04
tags: [criptografia, autenticacion, challenge-response, eke, protocolos, clase-07, sin-dictar]
sources: ["Clase 07 - Aplicaciones - Principios y autenticacion.pdf"]
---

# Challenge-response y EKE

**Cómo autenticar a un usuario remoto sin que la clave viaje nunca por la red — y por qué ese diseño, tal cual, todavía deja una rendija para verificar candidatas fuera de línea, que es exactamente la rendija que `EKE` cierra.** Es la nota donde se ve que "no enviar la clave" y "no dejar ninguna forma de verificarla sin la clave" son dos problemas distintos, resueltos por dos mecanismos distintos.

Cubre las filminas **43 y 44** del deck `Clase 07 - Aplicaciones - Principios y autenticacion.pdf`, verificadas contra la página renderizada a 150 dpi. Esta clase todavía no se dictó —hoy es 04/09/2026—, así que la nota está escrita contra el PDF y lecturas propias, rotuladas como tales; no hay transcripción ni video que la cubra.

## El problema: autenticar sin enviar la clave

Pedirle a un usuario remoto que **envíe la clave** para probar su identidad tiene dos fallas, y ninguna se arregla mejorando la clave:

- Exige un **canal seguro** para ese envío — el problema que se quería resolver reaparece como precondición.
- Si alguien descubre una comunicación **vieja**, la clave queda comprometida igual, sin importar qué tan buena sea: una clave capturada una vez sirve para siempre.

La solución de la filmina 43 ataca la raíz: **no enviar la clave nunca**, ni siquiera cifrada.

## El protocolo challenge-response

$$A \xrightarrow{\ \{\text{pedido de autenticación}\}\ } B \qquad A \xleftarrow{\ \{r\}\ } B \qquad A \xrightarrow{\ f(k,r)\ } B$$

$B$ envía un **challenge** $r$ —un valor que $A$ no podía predecir de antemano—, y $A$ responde con $f(k,r)$: una función de la clave compartida $k$ y de ese challenge. $B$, que también conoce $k$, recalcula $f(k,r)$ de su lado y compara. La clave $k$ nunca circula, y una respuesta capturada no sirve para el próximo intento porque el próximo $r$ va a ser distinto.

### El challenge tiene que comportarse como un nonce, no como un número cualquiera

**Esto la filmina lo da por sentado y no lo dice explícitamente** *(precisión nuestra)*: para que "una respuesta vieja no sirva" sea cierto, $r$ tiene que ser **fresco** en cada ronda — no repetirse nunca entre sesiones legítimas y no ser adivinable de antemano. Es el mismo requisito que [[cifrado-probabilistico-nonce-e-iv|Cifrado probabilístico, nonce e IV]] exige del IV, y el mismo mecanismo que [[ataques-de-repeticion-y-frescura#Un número de secuencia es un nonce|Ataques de repetición y frescura § Un número de secuencia es un nonce]] usa para cerrar el *replay* contra un MAC: acá el rol lo cumple el challenge en lugar de un contador o un timestamp, pero el objetivo es idéntico — impedir que un mensaje capturado en una ronda anterior siga siendo válido en la siguiente.

### Qué es la función f

La filmina no lo especifica, pero la construcción sólo tiene sentido si $f(k,\cdot)$ es una función **con clave** que $B$ pueda recalcular y que un atacante sin $k$ no pueda predecir a partir de $r$ solo. Es exactamente la definición de un [[message-authentication-code|MAC]]: $f(k,r)$ juega el mismo papel que $\mathsf{Mac}_k(r)$, con $r$ como "mensaje" de un solo uso.

## La rendija: verificar candidatas sin volver a tocar el sistema real

**Esto es lo que motiva `EKE`, y la filmina 44 lo dice sin desarrollar el mecanismo — el desarrollo es nuestro.** Si $A$ y $B$ intercambian $r$ y $f(k,r)$ **en claro**, cualquiera que esté escuchando el canal se queda con ambos valores. Y con ambos valores en la mano, ya no necesita el sistema real para seguir atacando: puede probar una clave candidata $k'$ calculando $f(k',r)$ **en su propia máquina** y comparando contra el $f(k,r)$ capturado.

Esto convierte, con una sola escucha, un mecanismo pensado para atacarse **online** en uno atacable **offline** — la misma distinción de [[ataques-a-un-sistema-de-autenticacion|Ataques a un sistema de autenticación]]. Antes de la escucha, un atacante contra $k$ estaba limitado por lo que el sistema real le permitiera intentar (bloqueos, límites de tasa, auditoría); después de capturar un solo par $(r, f(k,r))$, queda con el mismo ataque de fuerza bruta **sin límite de intentos ni de tiempo real** que [[complejidad-y-espacio-de-claves|Complejidad y espacio de claves]] cuantifica con la fórmula de Anderson — contra el espacio completo de $k$, y sin volver a interactuar con $A$ ni $B$ nunca más.

## EKE: cerrar la rendija cifrando el diálogo entero

La filmina 44 agrega una capa: envolver los mismos tres mensajes en un **canal cifrado con una clave de sesión $k_s$**, independiente de $k$:

$$A \xrightarrow{\ \{\text{pedido de autenticación}\}\,k_s\ } B \qquad A \xleftarrow{\ \{r\}\,k_s\ } B \qquad A \xrightarrow{\ \{f(k,r)\}\,k_s\ } B$$

Sin $k_s$, un atacante que sólo ve tráfico cifrado no tiene ningún par $(r, f(k,r))$ en claro contra el cual probar candidatas: el ataque offline de verificación queda cerrado **no porque $f$ se haya vuelto más fuerte**, sino porque el atacante perdió el material sobre el que montar la comparación. Es la misma lógica, aplicada al revés, que el `IV` de [[cbc-mac#Publicar los estados intermedios también rompe|CBC-MAC]]: lo que no se publica, no se puede usar para verificar nada.

> **Erratas de la filmina, ya señaladas en la [[clase-07-autenticacion#9. Challenge-response y EKE|Clase 07]].** El tercer mensaje del diagrama está escrito $\{\,f\{k, r)\,\}\,k_s$ —abre con llave después de la $f$ y cierra con paréntesis, una mezcla que no cierra—; corresponde $\{f(k,r)\}\,k_s$. Y el título de la filmina dice *"EKE – Encripted Key Exchange"*: el término correcto en inglés es *Encrypted*, con "y".

### Lo que la filmina no explica: de dónde sale la clave de sesión

**Esto excede lo que cubre el deck, y conviene tenerlo presente para no llevarse una idea incompleta del protocolo real** *(lectura nuestra, fuera de la fuente)*. El diagrama de la filmina 44 presenta $k_s$ como si ya existiera un canal seguro previo — pero si $A$ y $B$ ya tuvieran una forma de compartir $k_s$ de manera segura, ¿por qué no usar directamente ese canal para todo? La pregunta no es capciosa: es exactamente el problema que el protocolo `EKE` real —de Bellovin y Merritt, 1992— fue diseñado para resolver, y lo resuelve de un modo bastante más fino que "envolver todo en una clave de sesión dada": las partes usan la propia contraseña, de **baja entropía**, para cifrar los valores públicos de un intercambio Diffie-Hellman, de forma que un atacante que intercepta el tráfico no puede distinguir un intento con la contraseña correcta de uno con una candidata incorrecta —los valores cifrados con una clave equivocada son indistinguibles de ruido, igual que los correctos—, así que tampoco puede montar el ataque de verificación offline de la sección anterior **ni siquiera contra la propia contraseña**, que es habitualmente el eslabón más débil de todo el esquema. La versión de la filmina captura el objetivo —cifrar el diálogo para no dejar material verificable en claro— pero no el mecanismo que hace que ese cifrado no dependa, a su vez, de tener ya una clave segura de antemano.

## Ver también

- [[clase-07-autenticacion#9. Challenge-response y EKE|Clase 07 — Autenticación § 9. Challenge-response y EKE]] — la sección de la que cuelga esta nota
- [[message-authentication-code|Message Authentication Code]] — la definición formal que $f(k,r)$ instancia
- [[ataques-a-un-sistema-de-autenticacion|Ataques a un sistema de autenticación]] — la distinción offline/online que explica por qué capturar $(r,f(k,r))$ es tan grave
- [[complejidad-y-espacio-de-claves|Complejidad y espacio de claves]] — la fórmula de Anderson que cuantifica el costo del ataque offline que `EKE` cierra
- [[cifrado-probabilistico-nonce-e-iv|Cifrado probabilístico, nonce e IV]] — el requisito de frescura que $r$ tiene que cumplir
- [[ataques-de-repeticion-y-frescura#Un número de secuencia es un nonce|Ataques de repetición y frescura]] — el mismo problema de frescura, resuelto con número de secuencia o timestamp en vez de un challenge
- [[cbc-mac#Publicar los estados intermedios también rompe|CBC-MAC § Publicar los estados intermedios también rompe]] — el mismo principio de "lo que no se publica no se puede explotar", en otra construcción
- [[autenticacion-remota-y-sso|Autenticación remota y SSO]] — el paso siguiente: delegar la autenticación entera en un tercero, en lugar de compartir $k$ directamente con cada sistema
