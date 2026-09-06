---
title: Sobre números aleatorios y randomness
resumen: 'Encuadre del enlace a un post de John D. Cook sobre aleatoriedad: qué hueco de la Clase 02 viene a tapar, el del origen físico del azar que el One Time Pad plantea y no responde.'
fuentes: ["[[clase-02-cifrado]]", "[[one-time-pad]]", "[[generador-pseudoaleatorio]]"]
aliases: [Números aleatorios, Numeros aleatorios, Randomness, Random is as random does, De dónde sale el azar]
type: apunte
clase: 2
orden: 33
created: 2026-08-24
updated: 2026-09-04
tags: [apunte, aleatoriedad, prg, one-time-pad, pendiente, recurso-externo]
sources: ["Sobre números aleatorios y randomness.txt"]
---

# Sobre números aleatorios y randomness

> **Fuente:** [`raw/apuntes/Sobre números aleatorios y randomness.txt`](../../raw/apuntes/Sobre%20n%C3%BAmeros%20aleatorios%20y%20randomness.txt)
> El archivo tiene **una sola línea**: una URL. Nada más.
> **El post está sin leer.** Todo lo que sigue es el **encuadre** del recurso desde lo que ya hay en la wiki — **no** es un resumen del post.

Esta nota trae **por qué el vault guarda un link sobre aleatoriedad**, y dónde encaja eso en la Clase 02. La nota no dice qué dice el post: dice **qué agujero de la teoría viene a tapar**, que es lo único que hoy se puede afirmar con la fuente en la mano. Cuando el post se lea, el contenido va acá.

---

## 1. Qué dice la fuente, literal

| Campo | Valor |
|---|---|
| Archivo | `Sobre números aleatorios y randomness.txt` |
| Contenido completo | `https://www.johndcook.com/blog/2012/04/19/random-is-as-random-does/` |

De la URL misma —**no** del archivo, que sólo trae la cadena— se leen tres cosas *(lectura nuestra del URL)*:

| Dato | De dónde sale |
|---|---|
| Título: *Random is as random does* | el *slug* final, `random-is-as-random-does` |
| Autor: **John D. Cook** | el dominio `johndcook.com` |
| Fecha: **19/04/2012** | el path `/blog/2012/04/19/` |

### Lo que la fuente NO dice

- **No dice de qué trata el post.** Ni una línea de contexto, ni un título propio, ni una nota de por qué se guardó.
- **No dice a qué clase pertenece.** El archivo vive en `raw/apuntes/`, que por [[indice#Convenciones|convención del vault]] es exactamente la carpeta de lo que **no cuelga de ninguna fecha del cronograma**. Así que el enganche con la Clase 02 que se desarrolla más abajo es una lectura nuestra, no una asignación de la cátedra.
- **No hay fecha verificable.** El único *timestamp* disponible es el del filesystem (24/08/2026), que corresponde a **cuándo se ingirió el archivo a `raw/`** y no dice nada sobre cuándo se publicó ni cuándo se recomendó. Mismo caso que la [[practica-02-videos|Práctica 02]].
- **No dice si es lectura obligatoria, sugerida o al pasar.** Acá no se afirma ninguna de las tres.

---

## 2. Por qué este recurso está acá: el agujero que deja la Clase 02

La Clase 02 hace una pregunta y no la contesta. En la tercera de las "malas noticias" del [[one-time-pad#Las malas noticias|One Time Pad]], la filmina dice, literal:

> La clave **DEBE** ser aleatoria. ¿Cómo puede garantizarse esto?

Y sigue de largo. El resto de la clase construye la respuesta *computacional* —el [[generador-pseudoaleatorio|generador pseudoaleatorio]]— pero **nunca vuelve a la pregunta física**. Ese hueco es, muy probablemente, la razón de ser de este link *(lectura nuestra)*.

### El problema tiene tres capas, y la clase sólo cierra dos

| Pregunta | Dónde se responde en la wiki | Estado |
|---|---|---|
| ¿Qué pasa si la clave **no** es uniforme? | [[one-time-pad#Ejercicio: qué pasa si la clave no es aleatoria\|ejercicio de la clave sesgada]] | **cerrada**: se mide la fuga con Bayes |
| ¿Cómo consigo muchos bits que **parezcan** aleatorios a partir de pocos? | [[generador-pseudoaleatorio\|generador pseudoaleatorio]] | **cerrada**: definición formal de indistinguibilidad |
| ¿De dónde sale la **semilla** $s$, que sí tiene que ser azar de verdad? | — | **abierta** en el curso hasta acá |

La tercera fila es la que importa. El PRG **no elimina** el requisito de azar verdadero: lo **comprime**. Antes hacían falta $\lvert m\rvert$ bits genuinamente aleatorios (la cota de Shannon del [[secreto-perfecto|secreto perfecto]]); ahora alcanza con $s$ bits, digamos $128$, y $G$ los estira hasta $n \gg s$. Es una mejora enorme —de "tan larga como el mensaje" a "una constante"— pero **el piso sigue existiendo**: si esos $128$ bits no son azar, todo lo de arriba se cae, porque el generador es determinístico y la semilla lo determina entero.

> **En una frase.** El OTP necesita azar verdadero *en cantidad*; el PRG lo necesita *en calidad*. Ninguno de los dos se salva de necesitarlo.

### Qué muestra el ejercicio de la clave sesgada

Vale traerlo porque es la evidencia de que esto **no es una preocupación teórica**. Con $P(K{=}00) = 0{,}3$, $P(K{=}01) = 0{,}1$, $P(K{=}10) = 0{,}4$, $P(K{=}11) = 0{,}2$ —una clave apenas torcida, ni siquiera predecible— el OTP deja de tener secreto perfecto y se puede **medir cuánto filtra**: observando $C = 01$, la a priori $P(M{=}00) = 0{,}60$ se derrumba a $0{,}32$ y el mensaje $11$ pasa de $0{,}15$ a $0{,}324$, empatando con el favorito. Las cuentas completas están en la [[one-time-pad#Ejercicio: qué pasa si la clave no es aleatoria|nota del OTP]].

En la demostración de secreto perfecto los dos $1/N$ **se cancelan**: uno viene de que la clave es uniforme, el otro de que el criptograma resulta uniforme. Al romper la uniformidad de la clave no queda nada en pie. La aleatoriedad no es un detalle de implementación del OTP — **es la hipótesis sobre la que se apoya la prueba entera**.

---

## 3. La lectura del título (lectura nuestra)

> **Cuidado con el alcance de esta sección.** Lo que sigue se deduce **del título y de nada más**. No es lo que el post argumenta —eso está sin leer—, es lo que el título *sugiere* leído desde la Clase 02. Si al leerlo resulta que el post va para otro lado, esta sección se corrige.

*Random is as random does* — "aleatorio es lo que aleatorio hace". La construcción calca el *"stupid is as stupid does"* del inglés coloquial, y lo que hace en los dos casos es **mover el criterio del ser al hacer**: no importa qué es una cosa por dentro, importa cómo se comporta.

Aplicado a los bits, eso es **exactamente la definición de PRG**. Repasando la definición formal de la clase: $G$ es pseudoaleatorio respecto de una familia $D$ si para toda prueba $f \in D$

$$P\big(\,f(G(r^{s})) \neq f(r^{n})\,\big) = \varepsilon$$

con $\varepsilon$ [[seguridad-computacional#Nivel de seguridad|despreciable]]. Nótese qué **no** aparece en esa fórmula: el origen de los bits. $G$ es un **algoritmo determinístico** —su salida está completamente decidida por $s$, no tiene una sola gota de azar adentro— y aun así la definición lo deja pasar, **siempre que se comporte como azar** ante toda prueba de $D$.

| | ¿Azar de **origen**? | ¿Azar de **comportamiento**? | Qué se le exige |
|---|---|---|---|
| [[one-time-pad\|OTP]] | **Sí**, es la hipótesis central | consecuencia del origen | $k$ uniforme sobre $\{0,1\}^{n}$ |
| [[generador-pseudoaleatorio\|PRG]] | **No**, es determinístico | **Sí**, es toda la definición | ninguna $f \in D$ lo distingue |

Ese renglón es el salto conceptual de la clase entera: se abandona la pregunta *"¿esto es azar?"* —que es metafísica y no se puede chequear mirando una secuencia— por la pregunta *"¿alguien puede notar que no lo es?"*, que sí se puede acotar. Es el mismo movimiento que la [[seguridad-computacional|seguridad computacional]] hace con la seguridad: de una propiedad absoluta a una relativa a un adversario acotado.

### El límite del eslogan

"Aleatorio es lo que aleatorio hace" tiene una trampa que conviene tener a mano para el parcial: **"hace" respecto de qué familia $D$**. Cambiando $D$ cambia el veredicto sobre la misma secuencia.

El [[generador-pseudoaleatorio#Y por qué este G NO es un generador pseudoaleatorio|ejercicio del generador 3G + 1 módulo 11]] lo muestra en chico: la salida $01010$ **pasa** cualquier test ingenuo de frecuencia —tiene tantos ceros como unos, no repite patrones obvios—, y sin embargo el generador tiene período $5$, un punto fijo en $s = 5$ y produce apenas **6 secuencias distintas de las 32 posibles**. Contra la familia "contar los unos" se comporta como azar; contra la familia "revisar si está en esta lista de 6" no dura ni un intento.

> **La moraleja para leer el post.** "Se ve aleatorio" es un juicio sobre el observador, no sobre la secuencia. En criptografía $D$ son **todas** las funciones computables en tiempo `PPT`, que es la familia más grande que tiene sentido pedir — y por eso pasar los tests estadísticos clásicos no alcanza ni de cerca. Un LFSR pasa Diehard y se resuelve con álgebra lineal.

---

## 4. Qué NO se afirma en esta nota

Para que quede explícito, porque es material de estudio:

- **No se resume el post.** No sabemos si habla de generadores físicos, de tests estadísticos, de por qué los humanos son malos generando azar, de `/dev/urandom` o de otra cosa entera.
- **No se afirma que la cátedra lo haya recomendado.** El archivo está en `raw/apuntes/` sin ninguna atribución.
- **No se afirma que el post use la definición formal de PRG.** La conexión de la sección 3 sale del título; el post es de un blog de matemática general, no necesariamente de criptografía.

---

## 5. Pendientes

- [ ] **Leer el post** y volcar el contenido acá: tesis, ejemplos, y si distingue azar verdadero de pseudoazar.
- [ ] **Contrastarlo con la definición formal** de [[generador-pseudoaleatorio|PRG]]: confirmar o corregir la lectura del título de la sección 3.
- [ ] **Confirmar si tiene clase asignada** o si es material suelto de verdad. Hasta entonces la nota vive en `apuntes/`.
- [ ] **Buscar la respuesta a la pregunta abierta** de la fila 3 de la tabla de la sección 2 —de dónde salen los bits de la semilla— en las clases que vienen o en la bibliografía. Katz & Lindell la trata; ver [[bibliografia|bibliografía]].

## Ver también

- [[one-time-pad|One Time Pad]] — la filmina que hace la pregunta y no la contesta, más el ejercicio de la clave sesgada
- [[generador-pseudoaleatorio|Generador pseudoaleatorio]] — la respuesta computacional: azar juzgado por comportamiento
- [[seguridad-computacional|Seguridad computacional]] — el mismo movimiento, aplicado a la seguridad en vez de al azar
- [[criptosistema-de-flujo|Criptosistema de flujo]] — el consumidor de todo esto: el OTP con $G(k)$ en lugar de $k$
- [[cifrado-probabilistico-nonce-e-iv|Cifrado probabilístico, nonce e IV]] — el otro lugar donde el curso pide azar, y donde se rompen los sistemas que en el papel estaban bien
- [[probabilidad-y-criptografia|Probabilidad y criptografía]] — el andamiaje con el que se mide la fuga cuando el azar falla
- [[implementaciones-de-referencia|Implementaciones de referencia en Java]] — el otro apunte que es sólo links, y donde esta pregunta vuelve como "¿de dónde saca la clave este código?"
- [[clase-02-cifrado|Clase 02 — Cifrado simétrico]]
