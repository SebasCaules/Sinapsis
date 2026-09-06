---
title: Guía 1 — Criptografía Clásica
resumen: 'Guía del 10/08 sobre criptografía clásica: ocho ejercicios de definiciones formales, rotación, sustitución, Vigenère, Kasiski, transposición y ataque de texto plano elegido, con el tablero de estado de cada uno.'
fuentes: ["[[clase-01-introduccion-y-criptografia-clasica]]", "[[practica-01-esquemas-y-taxonomias]]", "[[guia-01-resolucion]]"]
aliases: [Guía 1, Guia 1]
type: guia
clase: 1
orden: 21
guia: 1
fecha: 2026-08-10
created: 2026-08-10
updated: 2026-08-24
tags: [guia, criptografia-clasica, rotacion, vigenere, sustitucion, transposicion]
sources: [raw/guias/Guia 1 - Criptografía Clásica.pdf]
---

# Guía 1 — Criptografía Clásica

> **10/08/2026** · [Enunciado](../../raw/guias/guia1/Guia%201%20-%20Criptograf%C3%ADa%20Cl%C3%A1sica.pdf) · Teoría: [[clase-01-introduccion-y-criptografia-clasica|Clase 01]] · Práctica del mismo día: [[practica-01-esquemas-y-taxonomias|Práctica 01 — Esquemas y taxonomías]]
> **Resolución:** [[guia-01-resolucion]]

## Tablero de estado

*Estado al 24/08.* Leyenda: **resuelto** (desarrollado y verificado en la [[guia-01-resolucion|resolución]]) · **en curso** (empezado pero sin cerrar) · **pendiente** (sin empezar).

| # | Tema | Concepto que aplica | Estado |
|---|---|---|---|
| 1 | Definiciones formales `Gen`/`Enc`/`Dec` | [[criptosistema\|Criptosistema]] | resuelto |
| 2 | Composición de dos sustituciones simples | [[cifrado-de-sustitucion-monoalfabetica\|Sustitución monoalfabética]] | en curso |
| 3 | Descifrar criptograma de rotación (castellano, 27) | [[cifrado-por-rotacion\|Rotación]] · [[criptoanalisis-por-frecuencias\|Frecuencias]] · [[ataque-de-fuerza-bruta\|Fuerza bruta]] | resuelto |
| 4 | Vigenère: cifrar modular · elección de clave · composición | [[cifrado-de-vigenere\|Vigenère]] | resuelto |
| 5 | Clasificar 3 criptogramas por tipo de técnica | [[criptoanalisis-por-frecuencias\|Frecuencias]] · [[indice-de-coincidencia\|Índice de coincidencia]] · [[cifrado-por-transposicion\|Transposición]] | resuelto |
| 6 | Kasiski: longitud de clave y clave de un Vigenère | [[test-de-kasiski\|Test de Kasiski]] · [[indice-de-coincidencia\|Índice de coincidencia]] | en curso |
| 7 | Transposición por columnas + rotación: estrategia y costo | [[cifrado-por-transposicion\|Transposición]] · [[ataque-de-fuerza-bruta\|Fuerza bruta]] | resuelto |
| 8 | Chosen-plaintext attack sobre sustitución y Vigenère | [[modelos-de-ataque\|Modelos de ataque]] | pendiente |

Qué falta en los dos **en curso**: el **Ej. 2** tiene el argumento de grupo escrito pero le falta el ejemplo concreto que pide la consigna; el **Ej. 6** ya tiene la [[guia-01-resolucion#Script de Kasiski|herramienta]] corrida, la [[guia-01-resolucion#a) La longitud de la clave: 4|longitud de clave]] comprobada ($t = 4$) y la clave `JUAN` obtenida, y le falta el índice de coincidencia sobre los cuatro sub-textos —que es lo que pide el verbo *comprobar* del ítem (a)—, generalizar el script a esos cuatro sub-textos y volcar el desarrollo al crudo.

---

## Enunciados

### Ejercicio 1

Dar una **definición formal** de los algoritmos `Gen`, `Enc` y `Dec` para los siguientes esquemas:

- Cifrado de rotación
- Cifrado de sustitución monoalfabética
- Cifrado de Vigenère

### Ejercicio 2

¿Por qué la **composición de dos sistemas de sustitución simple** no provee más seguridad que el uso de uno solo? Ejemplificar.

### Ejercicio 3

Descifrar el siguiente criptograma, sabiendo que fue encriptado usando el **cifrado de rotación**, que se corresponde a un texto en **español (27 letras)** y los espacios fueron suprimidos. ¿Cuál fue la estrategia que utilizaste?

```
VKXYKBKXGKSGWAKQQGYIUYGYWAKXKGQRKSZKJKYKKYIUSYKMAÑX
```

### Ejercicio 4

**a)** Cifrar según Vigenère el mensaje $M = \texttt{UN\ VINO\ DE\ MESA}$ con la clave $K = \texttt{BACO}$, **sin usar la tabla**, sólo con operaciones modulares.

**b)** En un sistema de cifra de Vigenère la clave a usar puede ser `CERO` o bien `COMPADRE`. ¿Cuál de las dos conviene usar y por qué?

**c)** Mostrar, con un ejemplo, que la **composición de dos cifrados Vigenère** resulta en otro cifrado Vigenère.

### Ejercicio 5

Teniendo en cuenta la frecuencia aproximada de aparición de letras en castellano, decir para **cada criptograma** si se ha obtenido mediante **sustitución monoalfabética**, **sustitución polialfabética** o **transposición**. *(No hay que descifrarlos.)*

**Criptograma 1**
```
KOZFVPCYVCWVZHMZLCIOHIFIZGJCZTVVXIGJLZHYZLGVMNVLYZ
```

**Criptograma 2**
```
HHMBIWSIPSNNTAWVITQWMEAQVNSPGQJNWELXMJDIBYUGNNRMEUDEM
ZIBTMYMBMWURBTIZXNCWZIUPZUQNRMEGJLWRVROPMREUMXXXAXDIP
UVFEASMBSASCETAEWOYYAKUSWEABSASCRECIOMEWTQOMYALMTXRAG
EWSQQHJDXMVJEAFIRNDUIANW
```

**Criptograma 3**
```
DERTNYLANAOTAABADEAXCEEAIDEJLXHRSUAUJUMXELAATECRTRNAZBI
RESOX
```

> La tabla de frecuencias del castellano está en [[criptoanalisis-por-frecuencias|criptoanálisis por frecuencias]], junto con el criterio de clasificación por forma del histograma.

### Ejercicio 6

Se recibe un criptograma cifrado mediante **Vigenère** (ver [enunciado completo](../../raw/guias/guia1/Guia%201%20-%20Criptograf%C3%ADa%20Cl%C3%A1sica.pdf), es largo). Se pide:

**a.** Comprobar la **longitud de la clave**.
**b.** Encontrar la **clave** del sistema y desencriptar sólo los **diez primeros caracteres**.

Para ello:
- Listar todas las **secuencias repetidas** de al menos 3 caracteres, junto con la distancia a la que se encuentran.
- **Ayuda:** aparecen cuatro cadenas de cuatro caracteres que se repiten: **`JGAZ`**, **`NMON`**, **`PNFA`** y **`AZMJ`**.
- Estimar la longitud y obtener la frecuencia de aparición de cada letra como **primera de cada bloque**.

> Es el procedimiento del [[test-de-kasiski|test de Kasiski]], paso por paso.
>
> El enunciado **no nombra** el índice de coincidencia, pero el verbo de (a) es *comprobar*: Kasiski propone la longitud y el [[indice-de-coincidencia|índice de coincidencia]] es la herramienta que la valida. Además, "la frecuencia de aparición de cada letra como primera de cada bloque" es exactamente el sub-texto sobre el que se calcula el IC. *(Lectura nuestra del enunciado, no de la cátedra.)*

### Ejercicio 7

Se cuenta con un texto cifrado producto de **transposición por columnas** (cada $n$ columnas se reacomodó el texto original) **y** un **cifrado de rotación**.

**a)** ¿Qué estrategia usarías para recuperar el mensaje original?
**b)** Si el texto cifrado tiene $m$ caracteres, ¿cuántas pruebas requeriría un ataque de fuerza bruta?

### Ejercicio 8

Mostrar que los siguientes cifrados son **muy fáciles de quebrar mediante un ataque de texto plano elegido** (*chosen-plaintext attack*):

- cifrado de sustitución monoalfabética
- cifrado de Vigenère

---

## Ver también

- [[guia-01-resolucion|Resolución]] — estado ejercicio por ejercicio
- [[clase-01-introduccion-y-criptografia-clasica|Clase 01]] — la teoría del jueves 06/08
- [[practica-01-esquemas-y-taxonomias|Práctica 01 — Esquemas y taxonomías]] — la clase práctica del lunes 10/08, el mismo día que se entregó esta guía
- [[cronograma|Cronograma]]
