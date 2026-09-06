---
title: Cifrado probabilístico, nonce e IV
resumen: 'Reparación del cifrado determinístico: se agrega al generador un valor que no se repite con una misma clave, el nonce o IV, y el cifrado pasa a ser probabilístico. El nonce exige unicidad; el IV aleatorio, además, impredecibilidad.'
fuentes: ["[[clase-02-cifrado]]", "[[criptosistema-de-flujo]]", "[[pruebas-de-indistinguibilidad]]"]
aliases: [Cifrado probabilístico, Nonce, IV, Vector de inicialización, Modo sincronizado, Modo no sincronizado]
type: concepto
unidad: 1
clase: 2
orden: 6
created: 2026-08-21
updated: 2026-08-21
tags: [criptografia, nonce, iv, cifrado-probabilistico, flujo, clase-02]
sources: [Clase 02 - Criptografia - Cifrado.pdf]
---

# Cifrado probabilístico, nonce e IV

La reparación estructural de la Clase 02. Sale de un único resultado:

> **Si una función de cifrado es determinística, NO es segura bajo múltiples cifrados.**
> El adversario del [[pruebas-de-indistinguibilidad#Ejercicio 2: atacar un cifrado de flujo bajo Mul|ejercicio Mul]] **aplica a cualquier criptosistema donde $e_k(x)$ es constante.**

---

## El problema

Si `Enc` es determinística, **cifrar dos veces el mismo mensaje da el mismo criptograma**. Eso es una fuga en sí misma —el adversario ve repeticiones— y además regala las pruebas [[pruebas-de-indistinguibilidad|Mul y CPA]] sin necesidad de romper nada.

Alcanza con mirar las dos caras del mismo hecho:

| Construcción | Cómo se rompe |
|---|---|
| [[one-time-pad\|OTP]] con clave repetida | $c_{1} \oplus c_{2} = m_{1} \oplus m_{2}$ |
| [[criptosistema-de-flujo\|Flujo]] con la misma semilla | $c_{1} \oplus c_{2} = m_{1} \oplus m_{2}$ |
| Cualquier `Enc` determinística | $c_{1} = c_{2} \Leftrightarrow m_{1} = m_{2}$ |

> Las filminas subrayan el paralelo: *"¿Similar al problema del One Time Pad con reuso de claves? **¡No es casualidad!**"*.

## La solución

> Se agrega un valor a la función generadora. **Dicho valor no deberá repetirse para una misma clave** — se lo llama **nonce** o **IV**.

El keystream deja de ser $G(k)$ y pasa a ser $G(k, \mathrm{IV})$. La clave se puede reutilizar; **lo que no se puede repetir es el par $(k, \mathrm{IV})$**. Y como el $\mathrm{IV}$ viaja en claro junto al criptograma, el receptor puede reproducir el mismo keystream sin que el adversario gane nada.

> **El punto que cambia todo:** `Enc` deja de ser una función y pasa a ser un **algoritmo probabilístico**. Un mismo $m$ con una misma $k$ puede dar criptogramas distintos, y ahí muere el ataque de la sección anterior. Es exactamente la razón por la que la [[practica-01-esquemas-y-taxonomias|Práctica 01]] escribe $c \leftarrow \mathsf{Enc}_k(m)$ **con flecha** y $m := \mathsf{Dec}_k(c)$ con $:=$: el cifrado es probabilístico, el descifrado no.

### Las dos formas

![Modo sincronizado y modo no sincronizado](../../assets/clase02-flujo-iv-modos.png)

| Modo | Cómo | Lo que se ve en el diagrama |
|---|---|---|
| **Sincronizado** | **Un único IV** para toda la sesión | Un solo $G(k, \mathrm{IV})$ produce un keystream largo del que se van consumiendo tramos: $M_0$ toma el primero, $M_1$ el siguiente |
| **No sincronizado** | **Un IV por mensaje** | Cada mensaje arranca su propio generador: $G(k, \mathrm{IV}_0)$ para $M_0$, $G(k, \mathrm{IV}_1)$ para $M_1$ |

> **Cuándo sirve cada uno** *(lectura nuestra — la filmina muestra los dos esquemas sin compararlos).*
>
> - **Sincronizado** es más barato (un IV por sesión) pero exige que emisor y receptor **mantengan el estado alineado**: si se pierde un tramo, el receptor descifra desde una posición equivocada del keystream y todo lo que sigue es basura. Encaja en canales confiables y ordenados, tipo una conexión TCP.
> - **No sincronizado** cuesta transmitir un IV por mensaje, pero cada mensaje es **autocontenido**: se puede perder, reordenar o descifrar suelto. Es lo que hace falta en datagramas o en almacenamiento.
>
> El riesgo es el mismo en los dos: **si el par $(k, \mathrm{IV})$ se repite, se vuelve al caso determinístico** y el ataque de `Mul` funciona igual.

---

## Nonce e IV no son exactamente lo mismo

*(precisión nuestra; las filminas usan los dos términos como sinónimos.)*

| Término | Qué se le exige |
|---|---|
| **Nonce** (*number used once*) | Sólo **unicidad**: que no se repita con la misma clave. Puede ser un contador, y puede ser predecible |
| **IV aleatorio** | Unicidad **y** que sea **impredecible**: se sortea uniformemente |

La distinción **importa para los [[modos-de-encadenamiento|modos de encadenamiento]]** y la propia clase la usa aunque no la nombre:

- *"CBC … requiere un valor inicial (IV) **ALEATORIO**"* — en mayúsculas en la filmina.
- *"Counter es CPA-Secure **si no se repite (k, nonce)**"* — acá alcanza con unicidad, y por eso CTR puede usar un contador.

O sea: **CBC necesita azar, CTR necesita unicidad.** Confundirlos es un modo clásico de romper un sistema que en el papel estaba bien.

## Ver también

- [[pruebas-de-indistinguibilidad|Pruebas de indistinguibilidad]] — `Mul` y `CPA`, las pruebas que el determinismo regala
- [[criptosistema-de-flujo|Criptosistema de flujo]] — el caso donde aparece primero
- [[modos-de-encadenamiento|Modos de encadenamiento]] — cada modo con su requisito de IV
- [[primitiva-de-cifrado-en-bloque|Primitiva de cifrado en bloque]] — determinística por definición, de ahí la necesidad de los modos
- [[practica-01-esquemas-y-taxonomias|Práctica 01 — Esquemas y taxonomías]] — la notación $c \leftarrow \mathsf{Enc}_k(m)$
- [[clase-02-cifrado|Clase 02 — Cifrado simétrico]]
