---
title: Ataques a un sistema de autenticación
resumen: 'Romper la autenticación es hallar cualquier dato que produzca la información complementaria almacenada; según cómo se verifique el candidato, el ataque es offline y sin límite de intentos, u online y limitable.'
fuentes: ["[[clase-07-autenticacion]]", "[[autenticacion]]", "[[video-06-principios-de-diseno-2026]]", "[[video-12-proteccion-de-datos-personales]]"]
aliases: [Ataques a un sistema de autenticación, Ataque offline, Ataque online, Adivinando claves, Impersonar una entidad]
type: concepto
unidad: 2
clase: 7
orden: 4
created: 2026-09-04
updated: 2026-09-04
tags: [autenticacion, ataques, offline, online, fuerza-bruta, clase-07, sin-dictar]
sources: ["Clase 07 - Aplicaciones - Principios y autenticacion.pdf", "wiki/videos/video-06-principios-de-diseno-2026.md", "wiki/videos/video-07-principios-de-diseno-2024.md", "wiki/videos/video-12-proteccion-de-datos-personales.md"]
---

# Ataques a un sistema de autenticación

**Cómo se escribe con las mismas cinco letras del modelo de autenticación qué significa "romper" el sistema, y por qué la distinción entre atacarlo offline y atacarlo online es la que organiza cada mecanismo de defensa que viene después en la clase.**

*Filminas 29 y 30 del deck de Aplicaciones. Esta clase todavía no se dictó (hoy es 04/09/2026): la nota está escrita contra el PDF de filminas, más los videos de principios de diseño y protección de datos —que traen ejemplos concretos de cada modo de ataque— y lecturas propias, todas rotuladas.*

## Objetivos enfrentados

La filmina 29 abre con la asimetría de objetivos que define todo ataque de autenticación: el sistema quiere **identificar correctamente** a las entidades; el atacante quiere **ser identificado como una entidad que no es** — impersonarla. Con las letras de [[autenticacion|Autenticación]], el mecanismo del atacante es encontrar

$$a \in A \quad \text{tal que, para algún } f \in F,\quad f(a) = c \ \text{ y } \ c \text{ está asociado a una entidad}$$

Nótese qué es exactamente lo que el atacante necesita reproducir: no el $a$ original de la víctima, sino **cualquier** $a$ que, pasado por $f$, produzca el mismo $c$ ya asociado a esa entidad. Contra una función $f$ con colisiones fáciles de encontrar, ni siquiera hace falta acertar la clave real.

## Dos caminos de verificación, dos modos de ataque

La filmina da dos formas de comprobar si un candidato funciona, y esas dos formas **son** los dos grandes modos de atacar:

| | Offline | Online |
|---|---|---|
| **Cómo verifica** | probar varios $a$, computar $f(a)$ y comparar contra $c$ | intentar autenticar directamente vía $l(a) \in L$, contra el sistema real |
| **Qué requiere de entrada** | haber conseguido $c$ (por ejemplo, robar el archivo con los hashes) | nada más que poder llegar al punto de login |
| **Límite de intentos** | ninguno — corre sólo limitado por el poder de cómputo del atacante | cada intento pasa por el sistema, así que se lo puede auditar, limitar o bloquear |
| **Ejemplo de la filmina 30** | `/etc/shadow` de Linux con `crack` o `john the ripper`; archivo `SAM` de Windows con `ophcrack` | probar la función de `login` con una cuenta conocida — `root`, `administrator`, `guest` |

**La distinción no es de detalle: es la que organiza toda la sección de prevención que sigue en la clase.** Contra un atacante offline no sirve limitar intentos —nunca vuelve a tocar el sistema real una vez que tiene $c$—, así que la única defensa posible es subir el costo de calcular $f(a)$ para cada candidato: es exactamente lo que hace la [[complejidad-y-espacio-de-claves#La fórmula de Anderson|fórmula de Anderson]] y, más adelante, PBKDF2 (más adelante en la clase). Contra un atacante online, en cambio, alcanza con **limitar el uso de la función de autenticación** — la filmina 31 lo llama así, y ese conjunto de contramedidas (tiempos crecientes ante fallas, deshabilitar principales, *jailing*/honeypot, `CAPTCHA`s) desarrolla en [[complejidad-y-espacio-de-claves#Prevenciones generales|Complejidad y espacio de claves § Prevenciones generales]] exactamente ese lado de la tabla.

## El ejemplo online, verificado con dos videos de la cátedra

El ejemplo de "cuenta conocida" de la filmina 30 (`root`, `administrator`, `guest`) tiene una versión concreta y con nombre propio en dos videos de la videografía que la propia clase de autenticación no toca:

- **[[video-06-principios-de-diseno-2026#8. Menor asombro|Video 06]]**, al desarrollar el principio de aceptación psicológica, trae la anécdota real del jefe de ambulancias que, después de dos meses de trabajo de seguridad, puso usuario `admin` y contraseña `admin` —la nota de video lo cuenta en su propia prosa, no como cita textual del docente. Es el mismo ataque de la filmina 30 mirado desde el punto de vista del defensor: la cuenta "conocida" no siempre hay que adivinarla, a veces la deja puesta el propio administrador.
- **[[video-07-principios-de-diseno-2024#2. Valores iniciales seguros|Video 07]]**, al desarrollar el principio de valores iniciales seguros, da el mismo fenómeno del lado de la fábrica: *routers* distribuidos con contraseñas triviales para el arranque inicial, e instalaciones antiguas de Oracle con usuarios administrativos y claves predefinidas. La contramedida que describe —**bloqueo por intentos de password**, donde el sistema frena tras $N$ intentos fallidos y vuelve a un estado seguro después de un tiempo— es la misma familia de defensa **online** que la filmina 31 lista bajo "tiempos crecientes ante fallas en la autenticación".

*(Cruce con los videos, no de la filmina: el deck de autenticación no nombra ninguno de estos dos casos — son las clases de principios de diseño las que los traen, aplicados de forma incidental a este mismo ataque.)*

## Offline sin límite: el caso del PIN de Apple

El [[video-12-proteccion-de-datos-personales#La anécdota de Apple contra el Estado (50:57)|Video 12]] trae un caso que ilustra, mejor que cualquier ejemplo del deck, qué significa que un ataque offline "corre sin límite de intentos": tras el atentado de la maratón de Boston, el iPhone bloqueado no pudo abrirse porque Apple no tenía forma de saltear el PIN — hasta que una empresa contratada por el Estado **hizo tampering del hardware y puenteó el contador de intentos**. Sin ese contador, probar las diez mil combinaciones de un PIN de cuatro dígitos deja de ser una defensa online (limitada, auditable) y se convierte en un ataque offline de fuerza bruta pura sobre un espacio de claves minúsculo. Es la misma lección que cierra [[complejidad-y-espacio-de-claves|Complejidad y espacio de claves]]: un espacio de claves chico no es un problema mientras el **control de ejecución** —acá, el contador de intentos— siga en pie; el ataque real fue romper ese control, no el PIN.

## Ver también

- [[clase-07-autenticacion#4. Ataques a un sistema de autenticación|Clase 07 — Autenticación § 4. Ataques a un sistema de autenticación]] — la sección de la que cuelga esta nota
- [[clase-07-autenticacion#Estado de las fuentes|Clase 07 — Autenticación § Estado de las fuentes]] — por qué los cruces con los Videos 06, 07 y 12 no contradicen que ningún video dicte esta clase
- [[autenticacion|Autenticación]] — el modelo $(A,C,F,L,S)$ con el que esta nota escribe el ataque
- [[almacenamiento-de-claves|Almacenamiento de claves]] — el esquema Unix tradicional, blanco directo del ataque offline sobre `/etc/shadow`
- [[complejidad-y-espacio-de-claves|Complejidad y espacio de claves]] — cuánto cuesta en tiempo cada uno de los dos modos de ataque
- [[ataque-de-fuerza-bruta#Principio de espacio de claves suficiente|Ataque de fuerza bruta]] — el piso de todo ataque offline, con o sin límite de intentos
- [[ataque-de-diccionario-sobre-hashes|Ataque de diccionario sobre hashes]] — cómo se reduce el costo del ataque offline por debajo de la fuerza bruta pura
- [[video-06-principios-de-diseno-2026#8. Menor asombro|Video 06 — Principios de diseño (2026) § 8. Menor asombro]] — la anécdota `admin`/`admin`
- [[video-07-principios-de-diseno-2024#2. Valores iniciales seguros|Video 07 — Principios de diseño (2024) § 2. Valores iniciales seguros]] — bloqueo por intentos y claves de fábrica
- [[video-12-proteccion-de-datos-personales#La anécdota de Apple contra el Estado (50:57)|Video 12 — Protección de datos personales § La anécdota de Apple contra el Estado (50:57)]] — qué pasa cuando se rompe el control que hacía "online" a un ataque
