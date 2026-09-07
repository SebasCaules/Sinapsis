---
title: Primitiva de cifrado en bloque
resumen: 'Función pseudoaleatoria con clave que cifra bloques de tamaño fijo. Por ser determinística no es un criptosistema usable por sí sola: necesita padding y un modo de encadenamiento.'
fuentes: ["[[clase-02-cifrado]]", "[[clase-03-macs-y-cifrado-autenticado]]"]
aliases: [Primitiva de cifrado en bloque, Cifrado en bloque, Block cipher, Función pseudoaleatoria, PRF, Padding, Simple Pad, Des Pad]
type: concepto
unidad: 1
clase: 2
orden: 7
created: 2026-08-21
updated: 2026-09-06
tags: [criptografia, bloque, block-cipher, prf, padding, clase-02, transcripcion]
sources: ["Clase 02 - Criptografia - Cifrado.pdf", "Clase 03pt1-Transcripcion.VTT", "raw/clases/Clase 02pt1-Transcripcion.VTT", "raw/clases/Clase 02pt2-Transcripcion.VTT"]
---

# Primitiva de cifrado en bloque

La otra gran familia simétrica. La palabra que hay que retener es **primitiva**: por sí sola **no es un criptosistema usable**.

---

## Definición

$$\begin{aligned}
K &= \{0,1\}^n,\quad C = P = \{0,1\}^b\\
\mathsf{Gen} &: k \leftarrow K\\
\mathsf{Enc} &: e_k(m) = c\\
\mathsf{Dec} &: d_k(c) = m
\end{aligned}$$

Están definidas para mensajes de **tamaño FIJO** $b$ (el *tamaño de bloque*), con clave de $n$ bits. Dos parámetros distintos que conviene no mezclar: en AES-256, $n = 256$ pero $b = 128$.

## Son funciones pseudoaleatorias

> Podrían *"usarse"* como criptosistemas, pero **son determinísticas → No pasan la prueba `Mul`**.
> Se combinan con **mecanismos de encadenamiento** para formar criptosistemas seguros.

Y la formulación precisa que da la clase al hablar de seguridad:

> No es posible distinguir la función $f(x) = \mathsf{Enc}_k(x)$ de una función tomada **al azar del conjunto de funciones del mismo dominio**. Dicho de otra manera: **para cada posible $k$, $f(x) = \mathsf{Enc}_k(x)$ es un [[generador-pseudoaleatorio|generador pseudoaleatorio]]**.

> **Una precisión que la clase no hace** *(lectura nuestra).* Como existe `Dec`, $\mathsf{Enc}_k$ no es una función cualquiera sino una **permutación** de $\{0,1\}^{b}$ — biyectiva, por eso se puede invertir. En la literatura esto se llama **PRP** (*pseudorandom permutation*) y no PRF. La diferencia es visible sólo para un adversario que haga del orden de $2^{b/2}$ consultas (por el problema del cumpleaños: una función aleatoria tiene colisiones, una permutación no), así que para $b = 128$ es irrelevante en la práctica. Es la razón técnica por la que la clase puede tratarlas como equivalentes.

### La clave no transforma: elige

La imagen que vuelve intuitiva esa permutación aparece recién el 20/08, al entrar a DES: entre **todas** las permutaciones posibles de $\{0,1\}^{b}$, lo que hace la clave es **seleccionar una**. Cifrar es aplicar la permutación elegida; cambiar de clave es cambiar de permutación, **no retocar la que había**.

> [!quote]- De la transcripción — la clave elige la permutación (cues pt2 44-56)
> *"La manera de conceptualizarlos, más teórica, es **como funciones aleatorias**. Es como una especie de permutación donde uno tiene una entrada y la va a permutar y alterar todos los bits para dar una salida, que va a estar **dentro del mismo conjunto de valores posibles** que puede estar en la entrada. Entonces es como una especie de selección de una de todas las permutaciones posibles: **lo que hace la clave es permitir seleccionar una de todas las permutaciones posibles que hay de una longitud fija**."*

### El efecto avalancha

La clase describe entero el **efecto avalancha** sin nombrarlo, y es el criterio operativo con el que se juzga una primitiva concreta: **basta con que cambie un solo bit de la entrada para que la salida cambie de forma dispersa e impredecible**. El criterio negativo es el útil: si cambiar un bit cambia un bit, la función no es pseudoaleatoria.

Y hay un modo que lo exige más que ningún otro. En `CTR` —ver [[modos-de-encadenamiento#Counter (CTR)|Modos de encadenamiento]]— las entradas consecutivas a la primitiva son $\text{nonce}\Vert i$ y $\text{nonce}\Vert i{+}1$: difieren en un puñado de bits. **Sin avalancha, los bloques de keystream de `CTR` serían casi iguales entre sí y el modo se caería solo.**

> [!quote]- De la transcripción — qué es una función pseudoaleatoria, en tres pasadas (cues pt1 690-697, 813-817, 826-828)
> La versión combinatoria: *"dado el bloque fijo de tamaño $b$, del mensaje original pueden ir a **cualquiera** de las permutaciones posibles de esos bits. Que sea pseudoaleatoria es que **ustedes no pueden predecir a cuál va a ir a parar**, y que puede ir a cualquiera."*
>
> La versión operativa: ***"basta con que haya un solo cambio en un bit para que haya una dispersión de cambios que no sea predecible"***, con el criterio negativo explícito: *"si yo cambio sólo un bit acá y me cambia un bit, es obvio que no es una función pseudoaleatoria"*.
>
> Y una tercera, con el rol de la clave (cues pt1 826-828): *"si ustedes alteran un solo bit, el output que le genera es lo mismo que si ese output hubiese sido un valor al azar de la longitud $b$"*; *"para cada uno de los $k$ (…) lo que determina la clave es **cómo se hace ese mapeo**, y si ustedes los recorren todos, da una vuelta completa a todos los valores posibles que pueden entrar en $b$"*.
>
> **El detalle que sólo aparece en la transcripción** (cues pt1 815-817): el docente introduce la avalancha **justo al explicar `CTR`**, y dice por qué la necesita ahí — *"lo único que cambia entre este y este es sólo un bit"*.

### Difusión y confusión: los dos objetivos

El mismo efecto, dicho como **par de criterios de diseño** en vez de como propiedad observable. Son los dos nombres que [[des-y-3des|DES]] y [[aes|AES]] van a usar sin que ninguna filmina los presente:

| Objetivo | Qué pide |
|---|---|
| **Difusión** | alterar un bit de la entrada tiene que alterar **muchos** de la salida, y de forma impredecible |
| **Confusión** | no se puede anticipar **cómo** la alteración de un bit modifica a los demás |

> **Precisión nuestra.** El reparto que hace el docente no es exactamente el de Shannon, donde *confusión* es la relación clave-criptograma y *difusión* la dispersión de la estadística del texto plano; las dos definiciones que da apuntan a la avalancha. Lo que importa para la materia es **el par**, no el reparto. Los [[parciales-viejos|parciales viejos]] preguntan por los dos nombres, así que conviene tenerlos.

> [!quote]- De la transcripción — difusión y confusión, definidas en voz (cue pt2 111)
> *"Los algoritmos buscan en general dos cosas con los bits. Una es lo que se llama **difusión**: si yo altero algún bit, que se alteren [muchos], o que no pueda predecir cuáles son los bits que se alteran (…) que afecte a la mayor cantidad posible. Y también **confusión**, que es que yo no pueda predecir cómo la alteración de un bit va a modificar los otros bits que están en la salida."*

### Invertible, salvo para la mitad de los modos

**La primitiva tiene que ser invertible** —hay `Dec`—, pero no todos los [[modos-de-encadenamiento|modos]] la usan entera. `ECB` y `CBC` invocan la función en las dos direcciones; `CFB`, `OFB` y `CTR` **usan sólo `Enc`**, también para descifrar. Ése es el motivo por el que esos tres sirven en embebidos: se implementa **la mitad** de la primitiva.

> [!quote]- De la transcripción — quién necesita la inversa y quién no (cues pt1 722-723, 747, 761-762)
> En `ECB` y `CBC`, *"lo pasan por la función de encriptación, que tiene que ser invertible, o sea, tiene que poder operar para el otro lado"*. En cambio `CFB` *"utiliza una función de encriptación solamente (…) no necesita que la función de encriptación tenga una inversa"*.

**El punto central:**

| La primitiva | El criptosistema |
|---|---|
| Determinística | Debe ser [[cifrado-probabilistico-nonce-e-iv\|probabilística]] |
| Tamaño fijo $b$ | Debe cifrar mensajes de cualquier largo |
| Falla `Mul` y `CPA` | Debe ser CPA-Secure |

Los **[[modos-de-encadenamiento|modos de encadenamiento]]** son precisamente lo que salva esas tres distancias.

---

## Por qué el bloque le ganó al flujo

Las filminas reparten las dos familias simétricas en pie de igualdad —[[criptosistema-de-flujo|flujo]] con IV, bloque con encadenamiento—, pero en la práctica **la de bloque es la que domina**. Al abrir la Clase 03 con el repaso, el docente da **tres razones** que ninguna filmina escribe:

1. **Es más eficiente.**
2. **Está mejor pensada para ejecutarse en hardware** — y de ahí el *throughput* más alto.
3. **Es más fácil de demostrar**: al no trabajar con estructuras potencialmente infinitas sino sobre un **dominio finito de tamaño fijo**, las demostraciones matemáticas salen *"un poco —no mucho, pero un poco— más fáciles de hacer y de seguir"*.

La tercera es la que más le importa a esta nota: el $b$ fijo de la definición de arriba no es sólo la limitación que los modos tienen que remendar, es también **lo que vuelve tratable la prueba**. Las dos primeras razones se encadenan entre sí en la voz del docente —eficiente *porque* está pensada para hardware—; la wiki las lista separadas porque son dos afirmaciones distintas y sólo la segunda menciona el throughput *(lectura nuestra)*.

> [!quote]- De la transcripción de la Clase 03 — las tres razones del bloque sobre el flujo (cues 29-32)
> *"Ahí aparece el concepto de los criptosistemas de bloque, que son los que hoy dominan el escenario de los criptosistemas: porque son **más eficientes**, porque están **mejor pensados para ejecutar en hardware** —entonces tienen mayor [throughput]—, y porque, al no trabajar con **estructuras potencialmente infinitas**, tienen demostraciones matemáticas un poco —no mucho, pero un poco— **más fáciles de hacer y de seguir**."*
>
> *(El ASR del cue 30 escribe "Froophoot": es **throughput**. Corrección nuestra.)*

→ El repaso completo, con la tabla de las dos ramas, está en [[clase-03-macs-y-cifrado-autenticado#2. Criptosistemas CPA-Secure: con qué se instancia|Clase 03 — §2]].

---

## Extensión: padding

*¿Qué ocurre si el mensaje a cifrar es más chico que el tamaño de bloque?* Se lo extiende **sistemáticamente**:

| Método | Cómo | Problema |
|---|---|---|
| **Simple Pad** | Completar con **ceros** | Es necesario **conocer el tamaño real** del mensaje por otra vía — si el mensaje terminaba en ceros, no se sabe cuáles son relleno |
| **Des Pad** | Agregar un bit **$1$** y después bits en **$0$** | Es autodelimitante: el receptor busca el último $1$. A cambio, **puede agregar un bloque completo** de padding (cuando el mensaje ya llenaba el bloque justo) |

> **Por qué Des Pad puede gastar un bloque entero.** *(lectura nuestra.)* Si el mensaje ya es múltiplo exacto del bloque, igual **hay que** agregar el $1$: si no se agregara, el receptor tomaría como relleno los ceros finales del mensaje real. El costo de un bloque de más es el precio de que el esquema sea no ambiguo. Es el mismo motivo por el que Simple Pad es más barato pero incompleto.

> [!quote]- De la transcripción — por qué existe más de un padding (cues pt1 711-712)
> La filmina lista dos métodos y no dice por qué existen dos. El docente sí: *"lo que se trata de evitar todo el tiempo es que haya un filtrado de información del mensaje original en el criptograma. Por eso existen diferentes tipos de padding, **para evitar tipos de ataque que explotan que quizás algo de información se puede sacar de cómo se está padeando**."*
>
> *(La clase no nombra el ataque concreto; el `padding oracle` no aparece en esta transcripción.)*

> **Errata de la filmina:** *"¿Que ocurre el mensaje a cifrar es más chico que el tamaño de bloque?"* — falta el *si* y falta la tilde de *Qué*. Las dos mismas fallas se repiten en la filmina siguiente, que cambia únicamente *más chico* por *más grande*. *(Precisión nuestra.)*

Y si el mensaje es **más grande** que el bloque:

> - Se **divide** el mensaje en bloques.
> - Se **extiende** el último bloque.
> - Se **transforma cada bloque** según algún [[modos-de-encadenamiento|modo de encadenamiento]].

## Las primitivas concretas del curso

- [[des-y-3des|DES y 3-DES]] — $b = 64$
- [[aes|AES]] — $b = 128$, la **recomendada**
- IDEA — $b = 64$, aparece sólo en la tabla de recomendados

→ [[eleccion-de-primitivas|Elección de primitivas en un proyecto]]
