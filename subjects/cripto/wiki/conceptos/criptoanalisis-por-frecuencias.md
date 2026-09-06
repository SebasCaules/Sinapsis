---
title: Criptoanálisis por frecuencias
resumen: 'Ataque que no enumera claves: explota que el cifrado no altera la estadística del lenguaje y compara las frecuencias del criptograma con las del idioma. Rompe toda la criptografía clásica de sustitución.'
fuentes: ["[[clase-01-introduccion-y-criptografia-clasica]]", "[[practica-01-esquemas-y-taxonomias]]", "[[guia-01-criptografia-clasica]]"]
aliases: [Análisis de frecuencias, Criptoanálisis por frecuencias, Frecuencias de letras]
type: concepto
unidad: 1
clase: 1
orden: 6
created: 2026-08-10
updated: 2026-08-11
tags: [criptoanalisis, frecuencias, estadistica, clase-01, guia-01, practica-01]
sources: [Clase 01, Clase 1.pdf (práctica), Guía 1 Ej. 5]
---

# Criptoanálisis por frecuencias

El ataque que rompe toda la criptografía clásica de sustitución. No enumera claves: **explota que el cifrado no altera las propiedades estadísticas del lenguaje**.

> Primeros documentos: **800 DC**. A partir de ahí comienzan a romperse los criptosistemas que se conocían.

---

## Procedimiento

1. Obtener la frecuencia estimada de cada símbolo **en el lenguaje del mensaje**.
2. Calcular la frecuencia de cada símbolo **en el texto cifrado**.
3. Asumir que los símbolos de mayor probabilidad se corresponden.
4. Formar grupos de dos y tres letras comunes (`el`, `la`, `de`, `las`, `los`, `que`, …) y refinar iterativamente.

El paso 3 casi nunca acierta de entrada más allá de las 2-3 letras más frecuentes; el trabajo real está en el 4, y en usar **ganchos**: palabras que uno sospecha que están en el texto (`LACABEZA` en el ejercicio de la clase).

## Tabla de frecuencias del castellano

| Alta | % | Media | % | Baja | % |
|---|---|---|---|---|---|
| E | 13,11 | C | 4,85 | Y | 0,79 |
| A | 10,60 | L | 4,42 | Q | 0,74 |
| S | 8,47 | U | 4,34 | H | 0,60 |
| O | 8,23 | M | 3,11 | Z | 0,26 |
| I | 7,16 | P | 2,71 | J | 0,25 |
| N | 7,14 | G | 1,40 | X | 0,15 |
| R | 6,95 | B | 1,16 | W | 0,12 |
| D | 5,87 | F | 1,13 | K | 0,11 |
| T | 5,40 | V | 0,82 | Ñ | 0,10 |

> La [[guia-01-criptografia-clasica|Guía 1]] trae una versión redondeada de esta misma tabla; para resolver el Ej. 5 alcanza con distinguir **alta / media / baja**, no hacen falta los decimales.

---

## Qué esquema rompe (y qué no)

| Esquema | ¿Cae directo? | Por qué |
|---|---|---|
| [[cifrado-por-rotacion\|Rotación]] | Sí | La distribución de frecuencias se conserva **rotada**: basta alinear el pico con la $E$ |
| [[cifrado-de-sustitucion-monoalfabetica\|Sustitución monoalfabética]] | Sí | La distribución se conserva **permutada**: mismo histograma, etiquetas mezcladas |
| [[cifrado-de-vigenere\|Vigenère]] | Sólo por bloques | El histograma global se **aplana**; hay que hallar $t$ primero ([[test-de-kasiski\|Kasiski]]) y luego atacar cada sub-bloque |
| [[cifrado-por-transposicion\|Transposición]] | No | El histograma queda **idéntico** — pero por eso mismo delata que es transposición |

## El ejercicio de la clase

![Ejercicio de descifrado](../../assets/Pasted%20image%2020260806172344.png)

**Ayudas:** el mensaje original está en castellano · la separación en grupos de 5 símbolos no es parte del problema (sólo ayuda a contar) · **gancho: `LACABEZA`** aparece en el mensaje plano.

El ejercicio **no está para practicar sustitución**: está para medir la distancia entre *«no es seguro»* y *«lo rompí»*. Declarar inseguro un criptosistema es barato; explotarlo cuesta trabajo incluso en el cifrado más fácil que conoce la humanidad, y esa brecha es la que después justifica que la criptografía moderna hable de **costo** y no de imposibilidad. La cátedra habilita explícitamente resolverlo con un modelo de lenguaje o a mano, sin preferencia entre las dos vías.

## Identificar el tipo de cifrado a partir del histograma

Esto es exactamente el Ej. 5 de la [[guia-01-criptografia-clasica|Guía 1]]: clasificar sin descifrar.

| Observación en el criptograma | Diagnóstico |
|---|---|
| Frecuencias **iguales** a las del castellano, letra por letra | **Transposición** (se reordenaron posiciones, no símbolos) |
| Frecuencias con el **mismo perfil** (un pico ~13%, cola larga) pero en letras distintas | **Sustitución monoalfabética** |
| Frecuencias **aplanadas**, sin picos claros, todas cerca de $1/n$ | **Sustitución polialfabética** (Vigenère) |

El criterio operativo es mirar la **forma del histograma ordenado de mayor a menor**, no las letras concretas.

### Por qué funciona: la lectura del árbol de la Práctica 01

El árbol de cifrados clásicos de la [[practica-01-esquemas-y-taxonomias|Práctica 01]] le cuelga a cada rama la herramienta que la rompe, y ahí está la justificación de la tabla de arriba:

- **Sustitución monoalfabética** → *"frecuencias originales en cifrado"* (más el espacio de claves).
- **Trasposición** → *"frecuencias originales"*.
- **Sustitución polialfabética** → no le cuelga frecuencias: le cuelga **período de clave** y **[[indice-de-coincidencia|índice de coincidencia]]**.

O sea: las dos familias que **conservan las frecuencias originales** son justamente las que se diagnostican y se rompen mirando el histograma, y la polialfabética queda afuera porque las aplana — por eso necesita primero hallar $t$ ([[test-de-kasiski|Kasiski]]) y recién ahí volver a este ataque, sub-bloque por sub-bloque.

La diferencia fina entre las dos primeras la pone esta nota, no la filmina: monoalfabética conserva el **perfil** (mismos valores, otras etiquetas) y trasposición conserva la asignación **letra por letra**. Eso es lo que permite separarlas en la tabla de diagnóstico.

> **De cualitativo a cuantitativo.** La tabla de arriba clasifica por alta / media / baja, a ojo sobre el histograma. El [[indice-de-coincidencia|índice de coincidencia]] le pone número al mismo criterio: colapsa la distribución en un solo valor, cerca del del idioma cuando las frecuencias se conservan y cerca de $1/n$ cuando están aplanadas. Sirve para decidir sin discutir la forma del gráfico.

## Ver también

- [[cifrado-de-sustitucion-monoalfabetica|Cifrado de sustitución monoalfabética]]
- [[test-de-kasiski|Test de Kasiski]]
- [[indice-de-coincidencia|Índice de coincidencia]] — el mismo criterio, en un número
- [[practica-01-esquemas-y-taxonomias|Práctica 01 — Esquemas y taxonomías]] — el árbol de cifrados clásicos
- [[ataque-de-fuerza-bruta|Ataque de fuerza bruta]] — el otro camino, por enumeración
