---
title: Máquinas de rotores y Enigma
resumen: 'La cúspide de la criptografía clásica: un polialfabético mecánico cuyo período es tan grande que no se repite en la práctica, con la permutación del tablero y la posición de los rotores como clave, y el reflector que hace que cifrar y descifrar sean la misma operación.'
fuentes: ["[[clase-01-introduccion-y-criptografia-clasica]]"]
aliases: [Enigma, Máquina Enigma, Criptosistemas de rotores, Máquinas de rotores, Rotores, Steckerbrett]
type: concepto
unidad: 1
clase: 1
orden: 15
created: 2026-09-06
updated: 2026-09-06
tags: [criptografia-clasica, polialfabetica, rotores, enigma, segunda-guerra, fuerza-bruta, clase-01]
sources: ["Clase 01 - Criptografia - Introduccion.pdf", "raw/clases/Clase 01-Transcripcion.VTT"]
---

# Máquinas de rotores y Enigma

**Los criptosistemas de rotores son la cúspide de la criptografía clásica.** Los polialfabéticos dominan su última etapa y crecen en complejidad hasta llegar a las máquinas de rotores, la vedette de la Primera y la Segunda Guerra Mundial. Enigma es el ejemplar famoso por una razón puntual: fue criptoanalizado **durante la guerra en la que se lo estaba usando**.

En el vocabulario de esta materia, **Enigma es un polialfabético de período astronómico**: la sustitución cambia letra a letra y en la práctica no se repite, así que es un [[cifrado-de-vigenere|Vigenère]] con un período que ningún [[test-de-kasiski|Kasiski]] alcanza. *(La lectura es nuestra; el docente describe el mecanismo pero no lo formula así.)*

## Cómo funciona

Es una máquina de escribir mecánica donde cada tecla es un pulsador que cierra un circuito. La clave son **dos configuraciones**:

1. Una **permutación de las conexiones** del tablero.
2. La **posición inicial de los rotores**. Cada rotor es un disco con 26 posiciones y un cableado fijo, y el catch es que **giran con cada tecla**: el primero avanza a cada pulsación, y al completar la vuelta arrastra al segundo, que al completar la suya arrastra al tercero — como un cuentakilómetros. Con tres rotores son $26^{3}$ posiciones iniciales.

La señal atraviesa los tres rotores, **vuelve reflejada** y enciende una lámpara con la letra resultante. Esa ida y vuelta es lo que hace que **cifrar y descifrar sean la misma operación**: se ponen los rotores en la posición inicial y se tipea — entra el plano y sale el cifrado, o entra el cifrado y sale el plano.

> [!discrepancia] El tablero de conexiones no venía fijo de fábrica
> La clase lo describe *«quemado»* en la máquina, y de ahí saca la imagen de **máquinas gemelas** apareadas de a dos. El *Steckerbrett* era **reconfigurable**: el operador lo recableaba según la clave del día, junto con la elección y el orden de los rotores, y las máquinas de servicio eran **intercambiables**. Lo que sí es cierto, y es el punto que la clase quiere hacer, es que **esa permutación forma parte de la clave**, no del algoritmo.

## Por qué de acá salen las computadoras

**Acá está el porqué de la palabra «protocomputadoras» en la fila de 1939 de la [[historia-de-la-criptografia|línea histórica]].** El cómputo moderno aparece como la **industrialización de una mesa de analistas** enumerando claves a mano: automatizar sistemáticamente lo que antes hacían personas probando combinaciones una por una. El [[ataque-de-fuerza-bruta|ataque de fuerza bruta]] no es un ataque de juguete — es el ataque que obligó a inventar la computadora.

## No fue un caso aislado

Hay variantes de cuatro rotores, y **todas las potencias tenían su propia máquina** —alemanes, americanos, ingleses, japoneses—, todas con la misma idea de claves rotativas en un espacio tan grande que no se repite en la práctica. Todas fueron atacadas: no es que sólo cayó Enigma.
