---
title: Factores de autenticación
resumen: 'Las cuatro fuentes de las que puede salir la prueba de identidad que aporta una entidad, algo que conozco, algo que tengo, algo que soy y dónde estoy, cada una con su propia debilidad estructural.'
fuentes: ["[[clase-07-autenticacion]]", "[[autenticacion]]", "[[video-07-principios-de-diseno-2024]]"]
aliases: [Factores de autenticación, Algo que conozco, Algo que tengo, Algo que soy, Factor de contexto, Risk-based authentication]
type: concepto
unidad: 2
clase: 7
orden: 2
created: 2026-09-04
updated: 2026-09-04
tags: [autenticacion, factores-de-autenticacion, biometria, contexto, clase-07, sin-dictar]
sources: ["Clase 07 - Aplicaciones - Principios y autenticacion.pdf", "wiki/videos/video-07-principios-de-diseno-2024.md"]
---

# Factores de autenticación

**De dónde puede salir la información $a \in A$ que una entidad aporta para autenticarse, y por qué cada una de las cuatro fuentes trae una debilidad estructural distinta que ningún refinamiento técnico elimina del todo.**

*Filminas 19 a 23 del deck de Aplicaciones. Esta clase todavía no se dictó (hoy es 04/09/2026): la nota está escrita contra el PDF de filminas, más el [[video-07-principios-de-diseno-2024|Video 07 — Principios de diseño (2024)]] —que sí toca el tema, aunque de forma tangencial y sin nombrar el deck de autenticación— y lecturas propias, todas rotuladas.*

## Cuatro fuentes, cuatro supuestos distintos

La filmina 19 es la única que enumera las cuatro juntas: la [[autenticacion|información de autenticación]] $a\in A$ **no tiene el mismo grado de confianza** según de dónde salga. Las filminas 20 a 23 desarrollan cada una con ejemplos y una debilidad que la propia filmina nombra:

| Factor | Ejemplos de la filmina | Qué asume | Debilidad estructural (según la filmina) |
|---|---|---|---|
| **Algo que conozco** | clave, frase (*passphrase*), pregunta secreta | secreto compartido entre la entidad y el sistema | depende de la confidencialidad del secreto; requiere almacenarlo de manera segura |
| **Algo que tengo** | smart card / token USB, generador de claves (ej. RSA-ID), celular, tarjeta de coordenadas | posesión exclusiva de un objeto físico | el elemento se puede copiar o clonar; la información en tránsito se puede suplantar |
| **Algo que soy** | huellas digitales, retina, voz, cara | característica intrínseca de la entidad, poco modificable | los métodos actuales no son 100% eficaces; asume que el lector no puede ser manipulado |
| **Dónde estoy (contexto)** | red/país/geolocalización de origen, host/terminal/dispositivo, día y hora, *velocity* | el contexto de dónde y cuándo llega la solicitud | funciona sólo como refuerzo, nunca solo (ver más abajo) |

**Ningún factor está libre de fallar por sí solo** — es la lectura que atraviesa las cuatro filminas: cada debilidad listada es un motivo por el cual, en la práctica, se combinan dos o más factores en vez de confiar en uno solo. La filmina no usa el término, pero es exactamente lo que la industria llama **autenticación multifactor** *(precisión nuestra)*.

## Algo que conozco: el factor que sostiene al resto de la clase

Todo el resto de esta clase —[[almacenamiento-de-claves|almacenamiento]], [[ataques-a-un-sistema-de-autenticacion|ataques]], [[complejidad-y-espacio-de-claves|complejidad del espacio de claves]], [[salting]], PBKDF2 (más adelante en la clase) — desarrolla casi enteramente este primer factor. La filmina 20 da la razón en dos frases: es *"uno de los mecanismos más empleados"* y *"sirve de base a otros mecanismos"*. El segundo motivo no es retórico: el *challenge-response* de más adelante en la clase **sigue basado en que las dos partes conocen la misma clave** — sólo cambia el protocolo por el cual se demuestra ese conocimiento sin transmitirlo. El factor no desaparece cuando se refina el mecanismo; se lo sigue usando, mejor protegido.

## Algo que tengo: la brecha entre el objeto y el canal

La filmina 21 separa dos ataques distintos, y conviene no mezclarlos porque atacan puntos distintos de la cadena:

- **El objeto se copia o clona** — el ataque es sobre la posesión misma. Ejemplo del [[video-07-principios-de-diseno-2024#8. Aceptación psicológica|Video 07]]: un token bancario que exigía instalar un plugin propietario y tipear cuatro dígitos fue un fracaso de adopción — la gente simplemente no lo usaba. *(Lectura nuestra, no está en el video: un fracaso de adopción así es, en general, el tipo de presión práctica que termina empujando a reemplazar el objeto dedicado por uno de uso ya cotidiano, como el propio celular.)*
- **La información en tránsito se suplanta** — el ataque es sobre el canal por el que el factor viaja, no sobre el objeto en sí. El [[video-07-principios-de-diseno-2024#Tres hilos transversales|Video 07]], en una sección distinta y sobre otro principio (*mecanismos exclusivos*, no aceptación psicológica), trae un ejemplo de este mismo problema aplicado al celular como segundo factor: si el SMS o WhatsApp que entrega el código de un solo uso es también el canal de recupero de la clave, un atacante que intercepta o secuestra ese canal no necesita clonar nada — le alcanza con desviar el mensaje. Es una violación concreta de ese principio: usar el mismo canal a la vez como segundo factor y como vía de recuperación anula la independencia que el segundo factor debería aportar, y es la base de buena parte de los *scams* de billeteras virtuales con SMS. *(El video no conecta esta anécdota con la del token bancario del punto anterior; son dos ejemplos de dos segmentos distintos del mismo video, sobre dos principios distintos — el vínculo entre ambos, si lo hay, es lectura nuestra, no del video.)*

*(Cruce con el video, no de la filmina: el deck de autenticación no desarrolla este ejemplo — es la clase de principios de diseño la que lo trae, aplicado de forma incidental a este mismo factor.)*

## Algo que soy: por qué "poco modificable" no es "sin fallas"

La filmina 22 lista tres advertencias, y las tres apuntan al mismo punto: la biometría desplaza el problema, no lo elimina.

- **Los métodos no son 100% eficaces** — hay tasas de falso positivo y falso negativo, y ninguna es cero.
- **El lector se puede manipular** — la garantía completa de la filmina es "salvo que alguien intervenga el dispositivo de lectura", una hipótesis que no siempre se sostiene.
- **La característica no es secreta ni revocable.** *(Lectura nuestra, no está en la filmina pero es la consecuencia más grave):* una clave comprometida se cambia; una huella o una cara comprometidas no — es la misma característica para siempre.

El [[video-07-principios-de-diseno-2024#8. Aceptación psicológica|Video 07]] agrega un ángulo que la filmina no cubre — la usabilidad del factor, no su seguridad —, con dos ejemplos reales: las validaciones biométricas masificadas durante la pandemia (*"mirá la cámara, pestañeá tres veces, hacé una mueca"*, tipo RENAPER) que el docente califica de "muy malas", y **Worldcoin**, que apunta al mismo problema con reconocimiento de iris. El video señala además que la *liveness detection* —detectar si lo que el lector ve es una persona real y no una foto o una máscara— es justamente la línea de investigación que intenta cerrar la segunda advertencia de la filmina, la del lector manipulable.

## El contexto es distinto a los otros tres

La filmina 23 es la única que describe su factor con **dos direcciones opuestas**, y eso lo separa cualitativamente de los tres anteriores:

- **Factor positivo** — refuerza la identidad reclamada. El ejemplo de la filmina: un operador que sólo puede conectarse desde la red privada del centro de cómputos.
- **Factor negativo** — reduce la confianza sin necesariamente romperla. El ejemplo de la filmina: un usuario que aparece de golpe conectándose desde otro país tiene *"MENOS chances de que sea quien dice ser"* — nótese que la filmina dice *menos*, no *ninguna*.

*(Lectura nuestra.)* Esa doble dirección es exactamente la lógica de cualquier sistema de ***risk-based authentication***: el contexto no decide por sí solo si autenticar o no, ajusta cuánta evidencia adicional exigir. Por esa misma razón el contexto **nunca funciona solo** — no hay forma de que "conectarse desde tal país" apruebe o rechace una identidad sin ningún otro factor detrás; sólo puede sumar o restar confianza sobre lo que otro factor ya estableció.

## Ver también

- [[clase-07-autenticacion#2. Factores de autenticación|Clase 07 — Autenticación § 2. Factores de autenticación]] — la sección de la que cuelga esta nota
- [[clase-07-autenticacion#Estado de las fuentes|Clase 07 — Autenticación § Estado de las fuentes]] — por qué el cruce con el Video 07 no contradice que ningún video dicte esta clase
- [[autenticacion|Autenticación]] — el modelo $(A,C,F,L,S)$ del que $a\in A$ es la entrada que estos factores completan
- [[almacenamiento-de-claves|Almacenamiento de claves]] — qué pasa con el factor "algo que conozco" una vez que el sistema lo tiene que guardar
- [[video-07-principios-de-diseno-2024#8. Aceptación psicológica|Video 07 — Principios de diseño (2024) § 8. Aceptación psicológica]] — biometría, usabilidad y *liveness detection*
- [[video-07-principios-de-diseno-2024#Tres hilos transversales|Video 07 — Principios de diseño (2024) § Tres hilos transversales]] — el ejemplo de SMS/WhatsApp como canal compartido entre segundo factor y recupero de clave
