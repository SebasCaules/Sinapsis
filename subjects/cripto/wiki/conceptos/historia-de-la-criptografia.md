---
title: Historia de la criptografía
resumen: 'Cuatro mil años de ciclo —cifrado nuevo, criptoanálisis, cifrado nuevo— que la Segunda Guerra corta: la crisis de 1945 reemplaza «todavía nadie lo rompió» por representación formal, modelo de amenaza y demostración.'
fuentes: ["[[clase-01-introduccion-y-criptografia-clasica]]"]
aliases: [Historia de la criptografía, Línea histórica, Criptografía clásica y moderna, Crisis de 1945, Shannon 1949]
type: concepto
unidad: 1
clase: 1
orden: 14
created: 2026-09-06
updated: 2026-09-06
tags: [criptografia, historia, shannon, turing, von-neumann, enigma, criptografia-moderna, clase-01]
sources: ["Clase 01 - Criptografia - Introduccion.pdf", "raw/clases/Clase 01-Transcripcion.VTT"]
---

# Historia de la criptografía

**La línea histórica no es decoración: es el argumento de por qué la criptografía moderna se define como se define.** Cada esquema nuevo de la tabla aparece como respuesta al criptoanálisis del anterior, y ese ciclo se corta en 1949, cuando el criterio «seguro es lo que todavía nadie rompió» se reemplaza por demostraciones.

![Historia de la criptografía](../../assets/Pasted%20image%2020260806164456.png)

## La tabla

| Fecha | Hito | Qué introduce |
|---|---|---|
| ~2500 AC | **Egipto** | Criptosistemas de sustitución: jeroglíficos no estándares |
| ~700-300 AC | **Escítala** | [[cifrado-por-transposicion\|Transposición]] usando báculos |
| 50 AC | **César** | [[cifrado-por-rotacion\|Rotación]] (subtipo de sustitución) |
| 800 DC | **Análisis de frecuencias** | Primeros documentos de [[criptoanalisis-por-frecuencias\|criptoanálisis]]. Comienzan a romperse los criptosistemas conocidos |
| 1500 | **Polialfabéticos** | Un símbolo cifrado representa distintos símbolos del original → [[cifrado-de-vigenere\|Vigenère]] |
| 1939 | **Bombe · Enigma** | Ataques de exploración sistemática por [[ataque-de-fuerza-bruta\|fuerza bruta]] → protocomputadoras |
| 1949 | **Shannon** — *Information Theory & Cryptography* | Publicaciones seminales que inician la **criptografía moderna** → [[secreto-perfecto\|secreto perfecto]] |

Dos precisiones que la clase agrega a la tabla:

- La fila del **800 DC** no marca sólo la aparición del análisis de frecuencias: marca el comienzo del **estudio sistemático** de los criptosistemas —construirlos, entenderlos y atacarlos—, que lleva más de mil años.
- El corte clásico/moderno **no es una fecha sino un período**, fines de los 30 y principios de los 40. 1939 y 1949 son mojones de la tabla, no el instante del cambio. La analogía es del docente: pasa lo mismo que con la física clásica y la moderna.

## Quién aporta qué: Turing, Shannon y von Neumann

A partir de una pregunta de un alumno —si todo esto arrancó con Turing— la clase reparte las atribuciones y completa la terna que la tabla no nombra:

| Quién | Qué aporta |
|---|---|
| **Turing** | El planteo teórico de la automatización que permitió construir las computadoras |
| **Shannon** | El planteo teórico de cómo estudiar la información en sí misma |
| **von Neumann** | El modelo de procesamiento con código y datos separados |

Los tres son la punta visible de una generación entera, no sus únicos protagonistas. La atribución importa para leer bien la fila de 1949: lo que Shannon aporta **no es una máquina** sino el aparato para estudiar la información misma.

> [!discrepancia] La asignación de cada aporte es reconstrucción nuestra
> El ASR degrada los tres apellidos (*«Green»*, *«Ya Non»*, *«el bonu»*, *«Buenoiman»*). Asignar la automatización a Turing, la teoría de la información a Shannon y la arquitectura código/datos a von Neumann sale del contenido de cada frase, no del audio.

## La crisis de 1945

**La Segunda Guerra no validó el criterio viejo: lo destruyó.** El escenario era el más extremo posible —de la confidencialidad de esas comunicaciones dependían vidas y el resultado de la guerra—, así que los dos bandos pusieron a sus mejores mentes tanto a construir como a romper. El resultado dejó un sabor amargo: con las herramientas desarrolladas durante la guerra **no habría quedado títere con cabeza**, porque no cayó sólo [[maquinas-de-rotores-y-enigma|Enigma]], cayeron todos los criptosistemas.

La conclusión no fue *«hagamos cifrados mejores»* sino algo más incómodo: **el criterio con el que decíamos «seguro» no sirve**. Ese es el contenido real de la fila 1949.

De esa crisis nacen varios campos a la vez —teoría de la información, teoría de la complejidad, las computadoras con la arquitectura de von Neumann— y nace la criptografía moderna, que **no se define por usar computadoras** sino por tres exigencias:

1. **Representación formal** del esquema — la terna $(\mathsf{Gen}, \mathsf{Enc}, \mathsf{Dec})$ de [[criptosistema#Definición formal|Criptosistema]].
2. **Modelo de amenaza** explícito, que deja de tratar «seguro» como absoluto y abre muchas definiciones de seguridad, una por escenario → [[modelos-de-ataque|Modelos de ataque]].
3. **Demostración**: ya no alcanza con *«este es mi algoritmo y yo digo que es seguro»*.

El vocabulario queda fijado acá: lo que esta wiki llama [[modelos-de-ataque|modelos de ataque]], el docente lo llama **modelo de amenaza**, y aclara que antes se decía **escenario**. En esta materia los tres nombres son equivalentes.

## Enigma como caso testigo de las tres exigencias

Según el relato de la clase, Enigma aguantó la mitad de la guerra y cayó cuando los aliados capturaron una máquina en una incursión terrestre y pudieron entender el algoritmo: aguantó **mientras el algoritmo fue secreto**, que es exactamente lo que el [[principio-de-kerckhoffs|principio de Kerckhoffs]] prohíbe suponer. Con los métodos modernos —conocer el algoritmo, o poder pedir cifrados de mensajes elegidos— se habría roto mucho antes.

> [!discrepancia] El relato de la caída de Enigma es una simplificación
> La clase da como **único** factor la captura de una máquina. La captura de material —máquinas, y sobre todo libros de claves— fue **una de varias vías**; faltan el trabajo previo del **Biuro Szyfrów** polaco (Rejewski reconstruyó el cableado y construyó las primeras *bombas* antes de la guerra, y se lo entregó a franceses y británicos en 1939) y los ***cribs*** de Bletchley Park, fragmentos de plano conocido. Queda registrado como lo que dijo la cátedra, no como historia establecida; el punto que la clase quiere hacer —que aguantó mientras el algoritmo fue secreto— se sostiene igual.
