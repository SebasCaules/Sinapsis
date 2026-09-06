---
title: STRIDE y árboles de ataque
resumen: 'Las dos herramientas del paso de identificación de amenazas: STRIDE, un cuestionario de seis letras que se aplica en cada frontera de confianza, y el árbol de ataque, que descompone una amenaza en las condiciones que la habilitan.'
fuentes: ["[[clase-08-principios-de-diseno-y-vulnerabilidades]]", "[[modelado-de-amenazas]]", "[[descomposicion-de-la-aplicacion]]", "[[video-08-vulnerabilidades]]"]
aliases: [Clasificación STRIDE, Árbol de ataque, Spoofing Tampering Repudiation, Frontera de confianza, Trust boundary]
type: concepto
unidad: 2
clase: 8
orden: 6
created: 2026-09-04
updated: 2026-09-04
tags: [seguridad, stride, arbol-de-ataque, trust-boundary, modelado-de-amenazas, clase-08, sin-dictar]
sources: ["Clase 12 - Analisis de vulnerabilidades.pdf"]
---

# STRIDE y árboles de ataque

**Dos herramientas para el paso 4 del modelado de amenazas —identificar amenazas—: una clasificación de seis letras que funciona como cuestionario sistemático, y un formalismo de árbol para descomponer una amenaza en las condiciones que hacen falta para cumplirla.** Es la nota más citada del bloque de vulnerabilidades porque `STRIDE` es, según toda la bibliografía de la cátedra, la sigla que más se pregunta.

Cubre las filminas **17 a 19** del deck `Clase 12 - Analisis de vulnerabilidades.pdf`. **Esta clase todavía no se dictó** (hoy es 04/09/2026, la clase es el 15/10): no hay transcripción propia, y lo que sigue está escrito contra el PDF más [[video-08-vulnerabilidades|video-08]].

## Dos formas de llegar a una lista de amenazas

La filmina 17 da dos caminos, no excluyentes, para el paso 4 del ciclo de Microsoft:

- **Comenzar con una lista de amenazas recurrentes** — remite al propio [[descomposicion-de-la-aplicacion#El Web App Security Frame|Web App Security Frame]] de Microsoft (`ms978518.aspx`) como catálogo de amenazas, ataques y contramedidas recurrentes por cada aspecto de una aplicación web.
- **Derivar amenazas mediante preguntas** — que es exactamente lo que hace `STRIDE`.

## STRIDE, letra por letra

La filmina 18 trae la instrucción de uso escrita en la propia lámina, y es la parte que más se olvida: *"preguntar, por cada trust boundary, cómo un atacante puede intentar cumplir cada una de estas amenazas"*. **No es una lista para memorizar sin más: es un cuestionario que se aplica sistemáticamente en cada frontera de confianza** identificada en la [[descomposicion-de-la-aplicacion#Zonas donde cambia el nivel de confianza|descomposición de la aplicación]] — no una vez sobre el sistema entero.

| Letra | Amenaza | Glosa (según `video-08`) |
|---|---|---|
| **S** | Spoofing | Hacerse pasar por otro |
| **T** | Tampering | Alterar algo de una manera no prevista por el diseño — ejemplo del video: fraude bancario en cajeros automáticos |
| **R** | Repudiation | Negar haber hecho algo; se contrarresta **firmando** |
| **I** | Information disclosure | Divulgación de información que debería quedar confinada a una zona *(`video-08` no la glosa en audio, sólo la lista en la filmina)* |
| **D** | Denial of Service | Amenaza a la **supervivencia** del sistema |
| **E** | Elevation of privilege | Conseguir más permisos de los autorizados |

**Por qué la instrucción "por cada trust boundary" es la parte que un examen puede pedir y que se olvida en la práctica.** Aplicar las seis letras una sola vez, mirando el sistema como un bloque, produce una lista genérica que no distingue qué amenaza corresponde a qué frontera — y sin esa correspondencia, el paso 5 ([[clase-08-principios-de-diseno-y-vulnerabilidades#7. Identificación de vulnerabilidades|identificación de vulnerabilidades]]) no sabe dónde buscar. `STRIDE` aplicado bien produce **una tabla de seis filas por cada zona de confianza**, no seis filas para todo el sistema.

**Un ejemplo de aplicación, sobre el sistema de historial médico que reutiliza el deck** *(desarrollo nuestro, no está en la filmina)*: en la frontera **browser → firewall**, la pregunta de Tampering sería *¿puede un atacante alterar los datos de una consulta médica en tránsito antes de que lleguen al servidor?* — una pregunta bien distinta de la misma letra aplicada a la frontera **web server → base de datos**, donde Tampering preguntaría *¿puede alguien con acceso al servidor modificar directamente un registro sin pasar por la aplicación?* Las dos preguntas nacen de la misma letra, pero apuntan a mecanismos de defensa completamente distintos —cifrado en tránsito contra controles de acceso a la base—, y eso es exactamente lo que se pierde si `STRIDE` se aplica una sola vez para todo el sistema.

## Árboles de ataque

La filmina 19 introduce los **árboles de ataque** como herramienta para explorar amenazas una vez identificadas: **identifican las acciones y condiciones necesarias para que una amenaza se cumpla**. El ejemplo de la propia lámina:

```
Amenaza: un atacante obtiene credenciales de autenticación monitoreando la red
  1 — Las credenciales se envían en plano, Y
  2 — El atacante puede capturar los paquetes que se transmiten
      2.1 — El atacante reconoce las credenciales
```

**Cómo leer la estructura.** La raíz del árbol es la amenaza —el evento no deseado—. Cada nivel debajo lista **condiciones**, y el conector **"Y"** entre 1 y 2 dice que la amenaza sólo se concreta si **ambas** condiciones se cumplen a la vez: de nada sirve que las credenciales viajen en plano si el atacante no puede capturar el tráfico, y de nada sirve capturar el tráfico si las credenciales van cifradas. El nodo 2.1 es un refinamiento de la condición 2: capturar paquetes no alcanza si el atacante no puede además **reconocer** cuáles de esos paquetes llevan las credenciales.

Un árbol de ataque, a diferencia de `STRIDE`, no clasifica tipos de amenaza: **descompone una amenaza puntual** en la conjunción (o disyunción, si el árbol usara nodos "O") de subcondiciones más chicas, hasta llegar a hechos concretos y verificables sobre el sistema —"las credenciales se envían en plano" es algo que se puede chequear mirando el protocolo, no una abstracción—.

**La advertencia que cierra la filmina, con signo de exclamación en el original:**

> Estos árboles pueden crecer considerablemente. Concentrarse sólo en los aspectos esenciales que agreguen valor.

No es una regla técnica sobre cómo construir el árbol: es una advertencia de **alcance**. Un árbol de ataque exhaustivo para un sistema real —con todas las combinaciones posibles de condiciones necesarias para cada amenaza que `STRIDE` identificó, en cada frontera de confianza— es, en la práctica, inabarcable. La habilidad que pide el ejercicio es reconocer **qué ramas importan** y detener la descomposición ahí, no completar el árbol entero.

## Cómo encajan las dos herramientas entre sí

`STRIDE` y los árboles de ataque no compiten, se complementan en dos escalas distintas:

| | `STRIDE` | Árbol de ataque |
|---|---|---|
| **Qué produce** | Una lista amplia de **tipos** de amenaza posibles, por frontera | La descomposición **en profundidad** de una amenaza puntual |
| **Cuándo se usa** | Primero, para no dejar afuera ninguna categoría de amenaza | Después, sobre las amenazas que `STRIDE` marcó como relevantes |
| **Qué responde** | *¿Qué clase de cosas malas podrían pasar acá?* | *¿Qué tiene que ser cierto para que esta cosa mala puntual pase?* |

`STRIDE` sin árboles de ataque deja una lista de amenazas sin desarrollar, difícil de priorizar porque no queda claro qué tan fácil o difícil es concretar cada una. Árboles de ataque sin `STRIDE` corren el riesgo de desarrollar en detalle una amenaza que nunca se identificó como relevante, mientras otra categoría entera queda sin considerar. El orden natural es el que sigue el propio [[modelado-de-amenazas#El ciclo de cinco pasos de Microsoft|ciclo de modelado]]: `STRIDE` primero, para cubrir superficie; árboles de ataque después, sobre lo que `STRIDE` marcó como prioritario.

## Ver también

- [[clase-08-principios-de-diseno-y-vulnerabilidades#6. STRIDE y árboles de ataque|Clase 08 — Principios de diseño y vulnerabilidades § 6. STRIDE y árboles de ataque]]
- [[modelado-de-amenazas|Modelado de amenazas]] — el ciclo completo; `STRIDE` es el paso 4
- [[descomposicion-de-la-aplicacion|Descomposición de la aplicación]] — las zonas y fronteras de confianza sobre las que se aplica `STRIDE`
- [[principios-de-diseno#4. Mediación completa|Principios de diseño]] — una frontera de confianza sin mediación completa es exactamente el tipo de hueco que `STRIDE` busca
- [[modelos-de-ataque|Modelos de ataque]] — la otra gran taxonomía del curso, la de qué puede hacer un adversario criptográfico, con el mismo espíritu de cuestionario sistemático
- [[video-08-vulnerabilidades#STRIDE, letra por letra|video-08 — Vulnerabilidades § STRIDE, letra por letra]] — la fuente hablada de esta nota
- [[videografia|Videografía]] — el mapa completo de los videos de la cátedra
