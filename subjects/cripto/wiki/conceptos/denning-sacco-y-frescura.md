---
title: Denning-Sacco y frescura
resumen: 'Modificación de Needham-Schroeder que agrega un timestamp dentro del ticket cifrado para B: acota a una ventana de tiempo el ataque con una clave de sesión vieja, a cambio de exigir relojes sincronizados.'
fuentes: ["[[clase-05-protocolos-criptograficos]]", "[[needham-schroeder]]", "[[ataques-de-repeticion-y-frescura]]", "[[seguridad-de-un-mac]]"]
aliases: [Denning-Sacco, Modificación Denning-Sacco, Denning Sacco, Timestamp en Needham-Schroeder, Corrección de Needham-Schroeder]
type: concepto
unidad: 1
clase: 5
orden: 8
created: 2026-09-04
updated: 2026-09-04
tags: [criptografia, protocolos, needham-schroeder, denning-sacco, frescura, timestamp, replay, kdc, clase-05, sin-dictar]
sources: ["raw/clases/Clase 05 - Protocolos.pdf"]
---

# Denning-Sacco y frescura

**El parche de una sola línea que convierte "el protocolo queda roto para siempre en cuanto se filtra una clave de sesión vieja" en "el protocolo queda roto solo durante una ventana de tiempo acotada".** Es la nota que muestra que agregar un timestamp no es gratis: cambia el tipo de supuesto de confianza del protocolo, de *"el nonce que yo mismo elegí"* a *"el reloj de otro, sincronizado con el mío"*.

Sale de la **filmina 28** del PDF de teoría de la Clase 05. La clase todavía no se dictó — hoy es 04/09/2026 y la fecha de la Clase 05 en el [[cronograma]] es el 17/09 — así que esta nota está escrita contra el PDF de filminas, contra Katz & Lindell y contra una lectura propia del paper original de Denning y Sacco (1981), rotulada donde corresponde. No hay transcripción ni callouts *De la transcripción*.

## De dónde viene el problema

Esta nota **no se entiende sin [[needham-schroeder|Needham-Schroeder]] primero**: ahí está la "segunda aproximación" del protocolo —la que agrega los nonces $r_1$ y $r_2$— y el ataque de la filmina 27 que la rompe. El resumen imprescindible: un atacante $E$ que en algún momento obtuvo una clave de sesión **vieja** $k_s$ —filtrada, por ejemplo, después de que esa sesión terminara— puede reinyectar el mensaje 3 grabado de esa sesión, $\{A \Vert k_s\}_{k_b}$, y $B$ no tiene **ningún** dato en ese mensaje que le permita distinguir una clave recién horneada de una de hace un mes. El nonce $r_1$ protege a $A$ contra la repetición del mensaje 2, pero $B$ no recibe ningún nonce propio para el mensaje 3, y por eso el ataque funciona con [[seguridad-de-un-mac|Mac-Forge]]-like probabilidad 1 sobre esa clave comprometida — ver el desarrollo completo en [[clase-05-protocolos-criptograficos#El ataque (filmina 27): una clave de sesión vieja alcanza|El ataque: una clave de sesión vieja alcanza]].

Esto es exactamente el patrón general de [[ataques-de-repeticion-y-frescura|Ataques de repetición y frescura]]: una construcción puede ser correcta en su propia definición de seguridad y aun así no ofrecer ninguna garantía contra un mensaje viejo reinyectado, porque esa garantía **no está en el alcance de la definición** — hay que agregarla aparte, con un mecanismo de frescura.

## El arreglo: un timestamp adentro del ticket

La modificación agrega un valor $T$ (timestamp) **adentro** del mensaje que viaja envuelto para $B$:

$$1)\ A \to C:\ A \,\Vert\, B \,\Vert\, r_1$$
$$2)\ A \leftarrow C:\ \{A \,\Vert\, B \,\Vert\, r_1 \,\Vert\, k_s \,\Vert\, \{A \,\Vert\, T \,\Vert\, k_s\}_{k_b}\}_{k_a}$$
$$3)\ A \to B:\ \{A \,\Vert\, T \,\Vert\, k_s\}_{k_b}$$
$$4)\ A \leftarrow B:\ \{r_2\}_{k_s}$$
$$5)\ A \to B:\ \{r_2 - 1\}_{k_s}$$

La comparación con Needham-Schroeder es de una sola celda:

| | Needham-Schroeder (2ª aproximación) | Denning-Sacco |
|---|---|---|
| Mensaje 3 | $\{A \Vert k_s\}_{k_b}$ | $\{A \Vert T \Vert k_s\}_{k_b}$ |
| Qué evalúa $B$ al recibirlo | nada — acepta cualquier $k_s$ bien formado | rechaza si $T$ no es reciente |
| Todos los demás mensajes | idénticos | idénticos |

**Por qué alcanza con esto.** Cuando $E$ reenvía un mensaje 3 grabado de una sesión vieja, $B$ lo descifra con $k_b$ y encuentra $T$ — y ahora **$B$ mismo**, sin volver a consultar a $C$ ni a $A$, puede comparar $T$ contra su reloj local y rechazar el ticket si $T$ no cae dentro de una ventana de aceptación $\Delta t$. El ataque de la filmina 27, corrido paso a paso contra esta versión: $E$ reenvía $\{A \Vert T_{\text{viejo}} \Vert k_s\}_{k_b}$, $B$ calcula $\text{ahora} - T_{\text{viejo}} > \Delta t$ y corta ahí — nunca llega a emitir el desafío $\{r_2\}_{k_s}$, así que $E$ ni siquiera tiene la oportunidad de demostrar que conoce $k_s$.

> **Errata de la filmina.** El título de la filmina 28 dice **"Modificación Demming-Sacco"**. El apellido correcto es **Denning** (por Dorothy Denning), no "Demming". Confirmado contra la página renderizada a 150 dpi: el texto "Demming" está impreso tal cual en el título, no es un artefacto de `pdftotext`.

## La trampa: qué compra el timestamp y qué no

**Leer esto como "ya está, arreglado para siempre" es el error más común, y la propia filmina no lo advierte** *(lectura nuestra, siguiendo el planteo del paper original de Denning y Sacco, "Timestamps in Key Distribution Protocols", 1981)*.

El arreglo **no elimina** la ventana de vulnerabilidad: la **acota**. Con nonces, la frescura de un mensaje se ata a una ejecución concreta del protocolo —$r_1$ solo tiene sentido dentro de la sesión que lo generó, y nunca "caduca" por el paso del tiempo, sino porque ya fue usado—. Con timestamps, la frescura se ata al **reloj**, y eso trae dos supuestos nuevos que el protocolo con nonces no necesitaba:

1. **Relojes sincronizados entre todas las partes**, dentro de una tolerancia razonable. Si el reloj de $B$ está adelantado o atrasado respecto del de $C$ más allá de lo que $\Delta t$ tolera, $B$ rechaza tickets legítimos (falso positivo) o acepta tickets viejos que deberían caer fuera de ventana (falso negativo).
2. **Una ventana de aceptación $\Delta t$ explícita**, que es en sí misma una decisión de diseño con un trade-off: $\Delta t$ chico exige relojes muy sincronizados y es intolerante a la latencia de red; $\Delta t$ grande vuelve a abrir una versión acotada del ataque original.

**El ataque que sigue siendo posible.** Si $E$ logra comprometer $k_s$ y reinyectar el mensaje 3 **dentro** de la ventana $\Delta t$ desde que $C$ lo emitió —por ejemplo, interceptando el tráfico en tiempo real en lugar de robar una clave de hace meses—, $T$ sigue pareciendo reciente y $B$ acepta el ticket exactamente igual que en el ataque original. Denning-Sacco no vuelve el robo de $k_s$ inofensivo: vuelve **angosta** la ventana en la que ese robo es explotable, de "para siempre" a "mientras $T$ no haya expirado". Es una mejora real y no cosmética —la mayoría de los escenarios de robo de claves no son en tiempo real—, pero es una mejora de **grado**, no la eliminación del problema de fondo.

$$\text{Needham-Schroeder (2ª aprox.): ventana de ataque} = (\text{fin de la sesión},\ \infty)$$
$$\text{Denning-Sacco: ventana de ataque} = (\text{emisión de } T,\ \text{emisión de } T + \Delta t\,]$$

## Nonce contra timestamp, la comparación que importa

| | Nonce ($r_1$, $r_2$) | Timestamp ($T$) |
|---|---|---|
| Qué garantiza | unicidad por ejecución — nunca se reutiliza | recencia respecto de un reloj compartido |
| Supuesto que exige | ninguno sobre relojes | relojes sincronizados dentro de $\Delta t$ |
| Costo | requiere una ida y vuelta (desafío-respuesta) para que **ambas** partes generen y verifiquen su propio nonce | no requiere interacción adicional: $B$ decide solo, comparando contra su reloj |
| Falla si… | el generador de aleatoriedad es predecible o se reutiliza un valor | los relojes se desincronizan, o el atacante actúa dentro de $\Delta t$ |

Es la misma dicotomía que [[ataques-de-repeticion-y-frescura|Ataques de repetición y frescura]] plantea en general para los `MAC`: número de secuencia y timestamp son las dos contramedidas que la cátedra nombra ahí, y acá se ve **por qué** ninguna de las dos es gratis — cada una traslada el problema de "¿este mensaje es viejo?" a un supuesto distinto que hay que sostener en la implementación real.

## Ver también

- [[needham-schroeder|Needham-Schroeder]] — el protocolo que esta nota corrige, con el ataque de la clave de sesión vieja desarrollado paso a paso
- [[ataques-de-repeticion-y-frescura|Ataques de repetición y frescura]] — el concepto general de frescura y sus dos contramedidas, nonce y timestamp, del que Denning-Sacco es una instancia concreta
- [[seguridad-de-un-mac|Seguridad de un MAC]] — por qué una primitiva demostrablemente segura no cubre por sí sola la repetición de mensajes
- [[tls-arquitectura-y-record|TLS: arquitectura y record]] — la siguiente parada de la clase, donde la frescura reaparece con los nonces $r_1, r_2$ del handshake
- [[clase-05-protocolos-criptograficos#9. La modificación Denning-Sacco|Clase 05 — Protocolos criptográficos]] — sección 9, de donde sale esta nota
- Katz & Lindell, cap. 4 — la distinción entre lo que garantiza la primitiva y lo que tiene que resolver el protocolo que la usa
- Denning, D. E. y Sacco, G. M., *"Timestamps in Key Distribution Protocols"*, Communications of the ACM, 1981 — el paper original que introduce esta modificación y discute la necesidad de relojes sincronizados *(lectura propia, no citada por la filmina)*
