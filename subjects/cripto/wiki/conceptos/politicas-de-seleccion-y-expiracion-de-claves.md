---
title: Políticas de selección y expiración de claves
resumen: 'Diseño de la política de contraseñas de un sistema: quién elige la clave —aleatoria, pronunciable o del usuario—, la revisión proactiva al momento del alta y los tres requisitos que evitan que la expiración forzada sea contraproducente.'
fuentes: ["[[clase-07-autenticacion]]", "[[complejidad-y-espacio-de-claves]]", "[[video-06-principios-de-diseno-2026]]", "[[video-07-principios-de-diseno-2024]]"]
aliases: [Políticas de selección de claves, Expiración de claves, Revisión proactiva de claves, Claves pronunciables, Selección de claves]
type: concepto
unidad: 2
clase: 7
orden: 6
created: 2026-09-04
updated: 2026-09-04
tags: [criptografia, autenticacion, claves, politicas-de-seguridad, usabilidad, clase-07, sin-dictar]
sources: ["Clase 07 - Aplicaciones - Principios y autenticacion.pdf"]
---

# Políticas de selección y expiración de claves

**Cómo se diseña la política de contraseñas de un sistema —quién elige la clave, cuánto dura y qué se le exige antes de aceptarla— sin que la política termine empeorando la seguridad que se supone que mejora.** Es la nota donde se ve, con una cuenta concreta, cuánto vale realmente una clave "pronunciable" frente a una aleatoria del mismo largo.

Cubre las filminas **37 a 39** del deck `Clase 07 - Aplicaciones - Principios y autenticacion.pdf`. Esta clase todavía no se dictó —hoy es 04/09/2026—, así que la nota está escrita contra el PDF y lecturas propias, rotuladas como tales; no hay transcripción ni video que la cubra.

## Selección de claves: tres alternativas y su costo

La filmina 37 pone en tensión directa tres formas de generar una clave, y cada una paga un precio distinto:

| Alternativa | Ventaja | Costo |
|---|---|---|
| **Aleatoria** | cada clave es equiprobable — la condición ideal para la fórmula de Anderson | difícil de memorizar (ejemplo de la filmina: `fL3K&8%j`) |
| **Pronunciable** | fonemas encadenados, fácil de memorizar (`helgoret`, `mipoterjo`, `jusacila`) | **el espacio de claves efectivo se reduce mucho** frente al nominal |
| **Elegida por el usuario** | máxima comodidad | tiende a ser fácil de adivinar — es la puerta de entrada al [[ataque-de-diccionario-sobre-hashes\|ataque de diccionario]] |

Las tres opciones se leen mejor como los tres puntos de un mismo eje —cuánta entropía le queda a la clave una vez que se le exige que un humano la use— que como alternativas independientes. La aleatoria maximiza $N$ en la [[clase-07-autenticacion#La fórmula de Anderson|fórmula de Anderson]]; las otras dos la sacrifican a cambio de usabilidad, y la clase pronunciable **sólo parece** un punto intermedio.

### Cuánto vale realmente una clave pronunciable

**Esto no está en la filmina: es una cuenta propia que usa exactamente los parámetros del [[clase-07-autenticacion#Ejemplo 2 — el mismo despeje con otro espacio (filmina 34)|Ejemplo 2]] de la clase, para mostrar el tamaño real de la reducción que la filmina sólo describe en palabras.**

El Ejemplo 2 de [[complejidad-y-espacio-de-claves|Complejidad y espacio de claves]] calcula, para una clave de 8 letras sobre un alfabeto de 26 caracteres —o sea, aleatoria— con $G = 10^{4}$ pruebas/segundo y $P > 0{,}5$:

$$N_{\text{aleatoria}} = 26^{8} = 208\,827\,064\,576, \qquad T_{\text{aleatoria}} \approx \frac{0{,}5 \times 26^{8}}{10^{4}} = 10\,441\,353\text{ s} \approx 121\text{ días}$$

Ahora tomemos una clave pronunciable de la **misma longitud**, 8 letras, armada como la filmina la construye: **fonemas encadenados**, no letras sueltas. Un supuesto explícito y razonable —**no está en la filmina**— es que cada fonema es una sílaba consonante-vocal: con 20 consonantes y 5 vocales del castellano hay $20 \times 5 = 100$ sílabas posibles, y 8 letras son 4 sílabas:

$$N_{\text{pronunciable}} = 100^{4} = 10^{8} = 100\,000\,000$$

$$T_{\text{pronunciable}} \approx \frac{0{,}5 \times 10^{8}}{10^{4}} = 5\,000\text{ s} \approx 1\text{ h } 23\text{ min}$$

**La reducción es de un factor $\approx 2\,088$** ($208\,827\,064\,576 / 100\,000\,000$), y el tiempo para alcanzar la misma probabilidad de éxito pasa de **121 días a poco más de una hora**. Éste es el contenido exacto de la advertencia de la filmina —*"el espacio de claves se ve muy reducido"*—, sólo que con números: la restricción fonética no resta caracteres del alfabeto nominal, resta **combinaciones válidas dentro de ese alfabeto**, y eso es indistinguible, para la fórmula de Anderson, de haber usado una clave más corta.

> **El paralelo con el video.** El [[video-07-principios-de-diseno-2024#8. Aceptación psicológica|Video 07]] trae la otra mitad de esta misma tensión, del lado opuesto: *no tiene sentido pedir una password de 40 dígitos, porque nadie la va a usar* —la nota de video lo formula en su propia prosa, no como cita textual del docente. Las dos fuentes describen el mismo eje —seguridad nominal contra seguridad usable— desde extremos distintos: la filmina de esta clase muestra cuánto se pierde al facilitar la memorización, el video muestra que exigir el máximo nominal tampoco sirve porque el usuario abandona el mecanismo. Ninguna de las dos fuentes resuelve la tensión; las dos la señalan.

### Por qué "elegida por el usuario" es la peor de las tres

La filmina no cuantifica esta opción —dice sólo *"las claves tienden a ser fáciles de adivinar"*—, pero la razón estructural ya está desarrollada en el vault: es exactamente lo que ataca la sección de **mejores ataques** de [[complejidad-y-espacio-de-claves#Mejores ataques que la búsqueda aleatoria|Complejidad y espacio de claves]] y, con más detalle formal, [[ataque-de-diccionario-sobre-hashes|Ataque de diccionario sobre hashes]]. El punto en común: cuando el usuario elige, el $N$ nominal del alfabeto deja de importar — lo que cuenta es el tamaño del **diccionario** de claves plausibles, que es órdenes de magnitud menor.

## Revisión proactiva

La filmina 38 propone resolver la tensión sin sacrificar ninguno de los dos lados: **analizar la clave al momento de crearla** y rechazar las que resulten "fáciles". Cuatro capacidades que debería tener ese análisis:

1. Aplicar reglas sobre palabras.
2. Buscar en diccionarios.
3. Buscar patrones.
4. Usar información del usuario y del contexto.

**Es la misma lista de la sección "mejores ataques", corrida de lugar.** [[complejidad-y-espacio-de-claves#Mejores ataques que la búsqueda aleatoria|Complejidad y espacio de claves § Mejores ataques]] enumera diccionarios de palabras, diccionarios de brechas previas, transformaciones (`l→1`, `o→0`, sufijos, prefijos, palabras espejadas) e información de contexto (nombre, usuario, DNI, fecha de nacimiento) — las mismas cuatro categorías, aplicadas en el momento del **alta** en lugar del momento del **ataque**. La revisión proactiva no es una idea nueva: es correr, contra el propio candidato, el mismo motor de búsqueda que después va a correr un atacante — y ganarle de mano.

## Expiración de claves

Forzar el cambio de clave después de un tiempo o evento **limita el daño de una clave ya comprometida** que todavía no se sabe comprometida. La filmina 39 pone tres requisitos, y los tres existen porque, sin ellos, la política es contraproducente:

- **Evitar el reuso** — recordar y bloquear las $N$ últimas claves.
- **Evitar cambios demasiado frecuentes** — sin este límite, el requisito anterior se esquiva trivialmente: si el sistema recuerda y bloquea las últimas 5 claves, un usuario que quiere **volver** a su clave favorita después de un cambio forzado sólo necesita cambiarla **cinco veces seguidas** para que la sexta ronda ya no choque contra el historial. El bloqueo de reuso sin un mínimo de tiempo entre cambios no bloquea nada: sólo agrega pasos.
- **Dar tiempo para pensar la nueva clave** — avisar con anticipación, no forzar el cambio en el momento mismo del *login*.

### El tercer requisito, y por qué la cátedra lo separa de los otros dos

Los dos primeros requisitos son **mecánicos** — se implementan con un historial y un contador de tiempo mínimo. El tercero es distinto: es una concesión explícita a que la persona que elige la clave **necesita margen** para no degradar en el otro extremo del problema —eligiendo algo trivial por apuro—.

> **Dónde aparece esta misma tensión, contada como chiste.** El [[video-06-principios-de-diseno-2026#8. Menor asombro|Video 06]] trae, en la filmina del principio de *aceptación psicológica*, el meme de Anakin y Padmé sobre una política de passwords: *"requerir un mínimo de 12 caracteres"* / *"pero los resets van a ser sólo anuales, ¿no?"* / silencio / *"¿no?"*. El propio video lo lee como una crítica al usuario, no a la política técnica —*"el chiste es sobre el lado del usuario"*—, y el requisito de "dar tiempo para pensar la nueva clave" de esta filmina es exactamente la mitad de la ecuación que el meme no menciona: una política de expiración que **no** avisa con anticipación ni da margen produce el mismo resultado que el chiste ridiculiza — el usuario harto que resuelve el problema con la clave más simple que el filtro le permite.

## Ver también

- [[clase-07-autenticacion#6. Políticas de selección y expiración de claves|Clase 07 — Autenticación § 6. Políticas de selección y expiración de claves]] — la sección de la que cuelga esta nota
- [[complejidad-y-espacio-de-claves|Complejidad y espacio de claves]] — la fórmula de Anderson y sus tres despejes, base de la cuenta de la sección 1
- [[salting|Salting]] — la otra defensa que actúa sobre las mismas claves, del lado del almacenamiento y no de la elección
- [[pbkdf2|PBKDF2]] — sube el costo por intento en vez de exigirle más al usuario; los dos enfoques son complementarios
- [[ataques-a-un-sistema-de-autenticacion|Ataques a un sistema de autenticación]] — la distinción offline/online que motiva por qué la revisión proactiva y la expiración importan más contra ataques offline
- [[ataque-de-diccionario-sobre-hashes|Ataque de diccionario sobre hashes]] — por qué reducir $N$ nominal a un dominio pequeño ataca sin romper ninguna propiedad criptográfica
- [[ataque-de-fuerza-bruta#Principio de espacio de claves suficiente|Ataque de fuerza bruta § Principio de espacio de claves suficiente]] — el criterio de la Unidad 1 del que la fórmula de Anderson es la versión cuantitativa
- [[video-06-principios-de-diseno-2026#8. Menor asombro|Video 06 — Principios de diseño (2026) § 8. Menor asombro]] — el meme sobre política de passwords y la aceptación del usuario
- [[video-07-principios-de-diseno-2024#8. Aceptación psicológica|Video 07 — Principios de diseño (2024) § 8. Aceptación psicológica]] — por qué exigir el máximo nominal tampoco funciona
