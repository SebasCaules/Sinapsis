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
updated: 2026-09-06
tags: [criptografia, nonce, iv, cifrado-probabilistico, flujo, clase-02, transcripcion]
sources: [Clase 02 - Criptografia - Cifrado.pdf, "raw/clases/Clase 02pt1-Transcripcion.VTT"]
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

**Qué significan exactamente las dos palabras.** *Determinístico* es que la función de cifrado *"no depende de ningún otro valor de semilla extra más que la clave"* (cue pt1 494). *Probabilístico* **no** quiere decir que el algoritmo tire monedas por dentro —todo sigue siendo determinístico, son computadoras digitales— sino que **la salida deja de estar determinada por $(k, m)$ solos**. Desde el lado del adversario: lo que se busca es que el proceso de cifrado **no sea predecible** a partir de la entrada.

### La semilla partida en dos

La formulación corta del docente, y la que conviene memorizar: ***la semilla se parte en dos, una permanece secreta —la clave— y la otra es pública —el IV—***.

**La clave es lo que hace secreto al criptograma; el IV es lo que lo hace distinto cada vez.** Por eso el generador pasa a rotularse $G(S)$ y $G(S')$ —con $S$, no con $k$—: la semilla ya no es la clave sino la **combinación de clave e IV**.

> [!quote]- De la transcripción — la semilla partida en dos, en versión larga (cues pt1 505-508, 660-661)
> *"Termina siendo todo determinista, porque estamos hablando de computadoras digitales, pero tiene alguna semilla más allá de la del propio generador (…) esa semilla compartida mete aleatoriedad al proceso de cifrado y hace que, dado el mismo $X$ que entra, puedan salir cifrados distintos. **Eso significa que sea probabilístico.**"*
>
> Y por el lado del adversario (cues pt1 660-661), corrigiendo a un alumno que había dicho *ofuscar*: *"vos estás permitiendo que el proceso de encriptación no sea predecible, cuál es el output en base al input que vos le das (…) porque en definitiva vos lo que buscás es que haya una aleatoriedad que sea compleja de determinar"*.

### Cómo hace el receptor para descifrar

Es la pregunta que salta sola: si el mismo mensaje con la misma clave da criptogramas distintos, ¿cómo reproduce el otro lado algo que no es determinístico?

La respuesta desarma el nudo en dos piezas. Primera: la **condición de corrección** $d_k(e_k(m)) = m$ **sigue siendo obligatoria** —sin ella no hay criptosistema—. Segunda: se cumple porque **el IV viaja con el mensaje, en claro**. El receptor toma el IV que llegó, lo concatena a su mitad secreta, regenera el mismo keystream y xorea.

**El problema no es que la clave no cambie: el problema es usar siempre el mismo IV.**

> [!quote]- De la transcripción — la pregunta de un alumno y su resolución (cues pt1 621-653, 668-675)
> Pregunta (cue pt1 628): *"¿cómo hacés para del otro lado replicar eso que es no determinístico para poder desencriptarlo teniendo sólo la clave? Porque ahora, además de la clave, también importa el número aleatorio que generaste."*
>
> Respuesta: *"esto tiene que cumplirse siempre; si no, no es un criptosistema, porque es la primitiva base"* (cue pt1 631), y *"El IV es público"* (cue pt1 642), *"viene en el [mensaje]"* (cue pt1 644).
>
> El alumno remata con el resumen que el docente confirma: ***"el problema no es que la clave no cambie. El problema es usar siempre el mismo IV."*** Y el dato de escala: *"cada vez que te conectás a un lugar te generan un millón de IVs"* (cue pt1 650) — es lo que hace TLS en cada sesión.
>
> El cierre engancha con la entropía (cues pt1 668-675): un alumno dice *"ahí es donde entra el pseudoaleatorio (…) y cuanto mayor sea la entropía de eso, mejor"*, y el docente generaliza: *"por eso es tan importante eso, porque todo el tiempo estás generando números aleatorios por detrás, tanto para la generación de la clave como para la ejecución propia de los algoritmos"*.

### Los tres nombres de la semilla pública

La misma cosa se llama de tres maneras, y el docente las dice todas juntas: **vector de inicialización**, **nonce** y **salt**. Las dos primeras están en las filminas; **salt no aparece en ninguna**, y es el nombre con el que aparece en la mayoría de las implementaciones.

> [!quote]- De la transcripción — la receta concreta y los tres nombres (cues pt1 515-517, 537-539)
> *"Imaginate que tenés un número al azar que va al principio del mensaje y lo mandás en plano. Ese número **concatena** a la parte secreta de la semilla (…) y eso hace que esta secuencia sea diferente de esta otra."*
>
> Y el vocabulario (cues pt1 515-517): *"esa semilla más (…) se llama distinto. Se llama, por ejemplo, **vector de inicialización**, o se llama **nonce**. Se llama **SALT**, etcétera. Vas a tener como una especie de otra semilla que esa sí es compartida (…) es pública. Normalmente es parte también de lo que se envía."*

> **Cuidado con la tercera.** Que compartan nombre no las vuelve la misma cosa: la **sal** de una contraseña no siembra ningún generador y está para que el trabajo del atacante no se amortice entre cuentas. La diferencia de rol está en [[salting|Salting]] y en [[ataque-de-diccionario-sobre-hashes|Ataque de diccionario sobre hashes]].

> **Sobre la etimología de *nonce* (cue pt1 547).** El docente lo deriva de *"number one"*. La forma habitual en la literatura es **"number used once"** — número usado una sola vez, que es exactamente lo que describe a continuación. *(Precisión nuestra; el sentido que le da la clase es el correcto.)*

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
