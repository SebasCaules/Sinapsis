---
title: Test de Kasiski
resumen: 'Método de 1863 para hallar la longitud de clave de un cifrado de Vigenère: las distancias entre secuencias repetidas del criptograma son múltiplos del período, así que la longitud se busca entre sus divisores comunes.'
fuentes: ["[[clase-01-introduccion-y-criptografia-clasica]]", "[[practica-01-esquemas-y-taxonomias]]", "[[guia-01-criptografia-clasica]]"]
aliases: [Test de Kasiski, Método de Kasiski, Kasiski, Longitud de clave Vigenère]
type: concepto
unidad: 1
clase: 1
orden: 8
created: 2026-08-10
updated: 2026-08-11
tags: [criptoanalisis, vigenere, kasiski, longitud-de-clave, guia-01, practica-01]
sources: [Clase 01, Clase 1.pdf (práctica), Guía 1 Ej. 6]
---

# Test de Kasiski

Método para determinar la **longitud $t$ de la clave** de un [[cifrado-de-vigenere|cifrado de Vigenère]]. Publicado por **Friedrich Kasiski en 1863**, tras casi 300 años en que el esquema se consideró seguro.

Es la primera de las dos etapas del ataque a Vigenère; una vez conocido $t$, el resto es [[criptoanalisis-por-frecuencias|análisis de frecuencias]] sobre $t$ cifrados por rotación independientes.

---

## Idea

Si una misma secuencia del texto plano (un digrama o trigrama frecuente: `que`, `de`, `los`) aparece dos veces **alineada con la misma parte de la clave**, se cifra al mismo criptograma.

> Por lo tanto: la **distancia** entre dos apariciones de una secuencia repetida en el criptograma tiende a ser un **múltiplo de $t$**.

Con varias distancias, $t$ es un divisor común de todas ellas — en la práctica, se toma el **máximo común divisor** o el divisor más frecuente (algunas repeticiones son coincidencias azarosas y hay que descartarlas).

La filmina de la [[practica-01-esquemas-y-taxonomias|Práctica 01]] lo anota de forma comprimida:

> **Período de clave:** $D \mid \text{período}$

donde $D$ es la **distancia** entre dos apariciones de una secuencia repetida.

> *Lectura propia (la filmina no glosa la notación):* al pie de la letra la barra dice *"$D$ divide al período"*, pero el hecho que sostiene el método es el **converso**: **$\text{período} \mid D$** — el período $t$ divide a **cada** distancia, porque para que la repetición aparezca las dos apariciones tienen que caer alineadas con el mismo tramo de clave. Por eso $t$ se busca **entre los divisores comunes** de las distancias observadas, que es el paso de factorización de acá abajo.
>
> La implicación al revés no vale: con distancias $12$ y $18$, $D = 6$ es divisor común de ambas y sin embargo **no** divide a $t = 3$. Un divisor común es un **candidato** a período, no una garantía — de ahí que hagan falta el paso de verificación del procedimiento y el [[indice-de-coincidencia|índice de coincidencia]].

## Procedimiento

1. **Listar todas las secuencias repetidas** de al menos 3 caracteres en el criptograma, junto con la distancia entre apariciones.
2. **Factorizar** cada distancia.
3. **Estimar $t$** como el divisor común más plausible (mcd de las distancias, descartando outliers).
4. **Verificar:** partir el criptograma en $t$ sub-bloques tomando las posiciones $i \equiv j \pmod t$ y comprobar que el histograma de cada uno tiene el perfil del castellano (un pico marcado), no uno plano.
5. **Resolver cada sub-bloque** por separado: cada uno es un [[cifrado-por-rotacion|cifrado por rotación]], así que basta obtener la frecuencia de cada letra en él y alinear el pico con la $E$ — o probar las $n$ claves.

## Ejemplo de trabajo — Guía 1, Ej. 6

El enunciado da el andamiaje completo del método:

> Aparecen cuatro cadenas de cuatro caracteres que se repiten en el criptograma: **`JGAZ`**, **`NMON`**, **`PNFA`** y **`AZMJ`**.
>
> Estimar cuál puede ser la longitud y obtener la frecuencia de aparición de cada letra como primera de cada bloque.

Ver el estado de resolución en [[guia-01-criptografia-clasica|Guía 1]].

## Por qué esto mata a Vigenère

Sin Kasiski hay que probar $n^t$ claves. Con Kasiski el problema se **descompone** en $t$ problemas independientes de $n$ claves cada uno:

$$n^t \longrightarrow t \cdot n$$

**Vigenère no cae por tener pocas claves — cae porque el problema se factoriza.** Es la lección estructural de la criptografía clásica y la razón por la que en los esquemas modernos se exige que cada bit del texto cifrado dependa de *toda* la clave.

## Método complementario: índice de coincidencia

La otra herramienta que la [[practica-01-esquemas-y-taxonomias|Práctica 01]] le asigna a la sustitución polialfabética. **Kasiski propone candidatos, el IC confirma:** con las distancias se arma una lista corta de $t$ plausibles, y el $\mathrm{IC}$ de los sub-textos decide cuál es — el $t$ correcto es el que hace saltar el índice al valor del idioma en vez de dejarlo cerca de $1/n$. Es más robusto que Kasiski cuando hay pocas repeticiones. Todo el desarrollo (definición, valores, el procedimiento de partir en $t$ sub-textos) está en [[indice-de-coincidencia|Índice de coincidencia]].
