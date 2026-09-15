---
titulo: Clasificación de los accidentes
tipo: concepto
modulo: [1]
clase: [3, 4]
division: "1"
tags: [clasificacion-de-accidentes, accidente, investigacion-de-incidentes, estadistica]
fuentes: [clasificacion-de-accidentes-por-tipo-y-agente, aspt-formulario]
actualizado: 2026-08-25
estado: consolidado
aliases: [forma-y-agente, clasificacion-por-forma-y-agente, tipo-y-agente]
resumen: 'Todo accidente se clasifica en dos ejes independientes: la forma (el mecanismo por el que se produjo la lesión: caída, golpeado por, inhalación…) y el agente (la cosa concreta que la produjo: piso mojado, puerta de tolva, cloro…). Uno responde cómo; el otro, con qué.'
---

## En una línea

Todo accidente se clasifica en **dos ejes independientes**: la **forma** (el mecanismo por el que
se produjo la lesión: caída, golpeado por, inhalación…) y el **agente** (la cosa concreta que la
produjo: piso mojado, puerta de tolva, cloro…). Uno responde *cómo*; el otro, *con qué*.

## Desarrollo

### Los dos ejes

La cátedra reparte una única tabla, encabezada "METODOLOGÍA DE CLASIFICACIÓN DE ACCIDENTES", con
dos columnas: **FORMA** y **EJEMPLO DE AGENTES** (Clasificación de accidentes, p. 1). Que sean dos
columnas y no una es todo el contenido del método:

```
                accidente
                    │
        ┌───────────┴───────────┐
     FORMA                    AGENTE
   ¿cómo se produjo?      ¿con qué se produjo?
   caída a nivel          piso mojado
   golpeado por           puerta de tolva
   inhalación             cloro
        │                      │
    da la barrera          da la barrera
    de mecanismo           de fuente
```

**Por qué importa que sean independientes.** La misma forma admite muchos agentes y el mismo agente
puede dar formas distintas. "Caída a nivel" puede ser por piso mojado o por un pallet en el área de
circulación — y la medida correctiva no es la misma (secado y señalización en un caso, orden y
demarcación en el otro). Al revés: una escalera puede provocar una caída desde altura por
deslizamiento, o un golpe contra si alguien la choca. **Clasificar sólo por forma pierde la fuente;
clasificar sólo por agente pierde el mecanismo.** Y las dos cosas hacen falta para elegir barreras,
porque —en el vocabulario de [[02-03-barrera]]— el agente es dónde poner la barrera de fuente y
la forma es dónde poner la barrera de trayecto.

### La tabla completa

| Forma | Ejemplo de agentes |
|---|---|
| **Caídas** — a nivel (resbalón, tropezón) y desde altura | Piso en mal estado · Piso mojado · Pallet en área de circulación · Deslizamiento de escalera |
| **Movimiento manual (MM)** — caída de objeto, caída de persona, trasladar, empujar, levantar, otros | Caja · Perfil · Balde · Portón · Tambor de cola · Alambre |
| **Golpeado contra** — *la persona golpea al objeto* | Cañería |
| **Golpeado por** — *el objeto golpea a la persona* | Puerta de tolva |
| **Proyección** | Soda cáustica, polvo detergente |
| **Inhalación** | Cloro |
| **Herramienta manual** | Martillo |
| **Herramienta mecánica** | Taladro, sierra |
| **Manipuleo mecánico** | Aparejo |
| **Máquina - punto de trabajo** | Rodillos, punto de desbaste o aplastamiento |
| **Máquina - transmisión** | Correas, engranajes, poleas, cadenas |
| **Riesgo eléctrico** | Tablero eléctrico, contactor |
| **Vehículo de planta** | Autoelevador, zorra eléctrica |
| **Vehículo de calle** | Choque con auto realizando tareas laborales |
| **In itinere** | Choque de colectivo, bicicleta |
| **Otros** | No incluidos en otra categoría |

(Clasificación de accidentes, p. 1)

### Las tres distinciones finas que se pueden preguntar

**1. Golpeado contra vs. golpeado por.** Es la misma colisión vista desde el otro lado, y la tabla
la desambigua con paréntesis: "Cañería (**la persona golpea al objeto**)" es *golpeado contra*;
"Puerta de tolva (**el objeto golpea a la persona**)" es *golpeado por*. **La regla es quién se
movía.** No es un detalle burocrático: si se movía la persona, la barrera va sobre la circulación
(demarcar, iluminar, alejar la cañería); si se movía el objeto, va sobre el equipo (resorte de
retención, enclavamiento, protección).

**2. Punto de trabajo vs. transmisión.** Las dos son "máquina", pero la parte peligrosa es
distinta. El **punto de trabajo** (*point of operation*) es donde la máquina hace lo suyo — rodillos,
desbaste, aplastamiento — y no se puede encerrar del todo sin dejar de producir. La **transmisión**
—correas, engranajes, poleas, cadenas— no necesita estar accesible nunca y se resuelve con guarda
fija. Separarlas es separar el problema difícil del problema fácil.

**3. Movimiento manual: caída de objeto vs. caída de persona.** El original las ejemplifica en
paralelo para que no se confundan: "Caja (**se cae la caja** al transportarla)" contra
"Perfil (**se cae la persona** al transportarlo)". El agente es el mismo tipo de cosa; lo que cae
es distinto.

### La categoría rara: "in itinere"

"In itinere" está listada como una **forma**, junto a "caídas" y "golpeado por". Pero un choque de
colectivo camino al trabajo es, mecánicamente, un vehículo de calle: lo que hace distinto al
in itinere no es cómo pasó sino **dónde pasó y bajo qué encuadre legal se cubre**.

> **Inferencia:** la tabla parece ser una planilla de carga de siniestros de una planta, y en ese
> contexto tiene sentido práctico que el in itinere sea una categoría de primer nivel — es la que
> separa lo que ocurre bajo control del empleador de lo que no, que es exactamente el corte que
> importa para notificar a la [[art|ART]]. Pero conceptualmente mezcla dos ejes. Registrado en
> [[contradicciones]] (C-13). Ver [[03-11-accidente-in-itinere]].

### Clasificar hacia adelante: el checklist del formulario

Las nueve preguntas del [[aspt-formulario]] son esta misma taxonomía dada vuelta. Donde la tabla
dice "golpeado por", el checklist pregunta "¿Alguien puede ser golpeado o contactado por algo al
realizar este trabajo?"; donde dice "caídas", pregunta "¿Puede haber caídas?".

| Forma de la tabla | Pregunta del checklist |
|---|---|
| Golpeado por / Proyección | ¿Alguien puede ser golpeado o contactado por algo? |
| Golpeado contra | ¿Alguien puede golpear contra algo o contactar algún riesgo físico? |
| Inhalación / Proyección | ¿Alguien puede estar expuesto a condiciones riesgosas? |
| Caídas (a nivel) | ¿Alguien puede resbalarse, tropezarse? |
| Movimiento manual - levantar | ¿Alguien puede realizar sobreesfuerzos? |
| Máquina (punto de trabajo, transmisión) | ¿Puede haber atrapamientos? |
| Caídas (desde altura) | ¿Puede haber caídas? |

Es el mismo repertorio de mecanismos usado dos veces: **retrospectivamente** para clasificar lo que
pasó (investigación de incidentes, tema 15 del temario) y **prospectivamente** para imaginar lo que
puede pasar (fase 3 del [[03-01-aspt|ASPT]]). Que sea el mismo repertorio no es casualidad: una
taxonomía de accidentes sirve para prevenir sólo si se la puede correr hacia el futuro.

### Para qué sirve clasificar

No es burocracia estadística. Clasificar de forma consistente es lo que permite:

- **Agregar y comparar**: sin categorías fijas no hay serie estadística, y sin serie no se puede
  decir si algo mejoró. Es la precondición de los datos de [[02-01-siniestralidad-laboral]].
- **Detectar patrones**: cinco "golpeado por" con agente "puerta de tolva" en un año no es mala
  suerte, es una guarda que falta.
- **Elegir dónde intervenir**: la forma sugiere el tipo de barrera; el agente, dónde ponerla.

## En la materia

Cubre el **tema 5 del temario** del [[modulo-1-seguridad]] ("Clasificación de los accidentes"), que
hasta esta ingesta figuraba sin dictar. Es material de repaso de tipo memorístico: la tabla es
corta, cerrada y se puede pedir que se complete.

## Relación con otros temas

- [[01-07-accidente]] — lo que se clasifica.
- [[03-11-accidente-in-itinere]] — la categoría que rompe el eje.
- [[03-01-aspt]] — la fase 3 usa este repertorio hacia adelante.
- [[aspt-formulario]] — el checklist de nueve preguntas.
- [[02-05-secuencia-del-accidente]] — la forma nombra la fase de contacto de la secuencia.
- [[02-03-barrera]] — el agente da la barrera de fuente; la forma, la de trayecto.
- [[02-01-siniestralidad-laboral]] — clasificar es la precondición de medir.

## Fuentes

- (Clasificación de accidentes, p. 1) — [[clasificacion-de-accidentes-por-tipo-y-agente]]
- (Formulario ASPT, p. 1) — [[aspt-formulario]]
