---
title: AES
resumen: 'Primitiva de cifrado en bloque recomendada en la actualidad: reemplazo de DES elegido por concurso internacional abierto, con bloques de 128 bits, claves de 128, 192 o 256, y rondas sobre el campo $\mathrm{GF}(2^8)$.'
fuentes: ["[[clase-02-cifrado]]", "[[des-y-3des]]", "[[cuerpos-finitos-y-campos-de-galois]]"]
aliases: [AES, Advanced Encryption Standard, Byte Sub, Shift Row, Mix Column, Add Round Key, Round keys]
type: concepto
unidad: 1
clase: 2
orden: 10
created: 2026-08-21
updated: 2026-08-28
tags: [criptografia, aes, bloque, gf28, round-keys, clase-02, parcial, transcripcion]
sources: ["Clase 02 - Criptografia - Cifrado.pdf", "raw/clases/Clase 02pt2-Transcripcion.VTT"]
---

# AES

**La primitiva de cifrado recomendada en la actualidad.** Si el TP o un proyecto necesita cifrado simétrico, la respuesta por defecto es AES en un [[modos-de-encadenamiento|modo]] CPA-Secure.

---

## Qué es

- **Reemplazo de [[des-y-3des|DES]].**
- Fue seleccionado mediante un **concurso internacional abierto** (5 años).
- Orientado a bloques de **128 bits**.
- Clave de **128, 192 o 256 bits**.

> **El concurso importa tanto como el algoritmo.** *(lectura nuestra.)* Es la respuesta institucional al problema que dejó DES: sus cajas $S$ secretas generaron **quince años de desconfianza** aunque estuvieran bien diseñadas. AES se eligió al revés —convocatoria pública, candidatos publicados, criptoanálisis abierto durante cinco años, decisión argumentada— y por eso arrancó con una confianza que DES nunca tuvo. Es el [[principio-de-kerckhoffs|principio de Kerckhoffs]] aplicado al **proceso**, no sólo al algoritmo.

**El mecanismo del concurso, contado en clase:** el NIST —*"el Instituto de Estándares de Estados Unidos, que recomienda cuáles son los métodos criptográficos que tiene que usar la administración pública americana"*— convoca a gente de todo el mundo a mandar su algoritmo, y al ganador lo rebautiza: *"los originales tienen otro nombre, y entonces después le pusieron: bueno, listo, éste lo tomamos, y ahora le llamamos Advanced Encryption Standard"* (cues pt2 391-394).

> **Precisión nuestra.** El nombre original de AES es **Rijndael**, de Joan Daemen y Vincent Rijmen. En clase se lo adjudica primero a `IDEA` y el propio docente se corrige unos minutos después: *"Rijndael era el de AES"* (cue pt2 403). `IDEA` es otra cosa —Lai y Massey, ETH Zürich— y **no salió de ningún concurso del NIST**; sobre él sólo se dice que no es estándar, que es bueno y que *"creo que no está roto todavía; pero habría que chequear"* (cue pt2 412).

### Los tres tamaños de clave son una defensa contra el paso del tiempo

La filmina lista 128, 192 y 256 sin jerarquía ni motivo. El motivo lo da la clase, y es la [[seguridad-computacional|seguridad computacional]] cobrada como decisión de diseño: **todo algoritmo tiene un $n$, y ese $n$ envejece**. Un algoritmo se reemplaza porque sube el $n$ que hace falta o porque **no admite** un $n$ más grande; DES es el segundo caso y AES está construido para no serlo nunca.

> [!quote]- De la transcripción — la flexibilidad del tamaño de clave, y qué usar hoy (cues pt2 397-399, 405-406)
> *"Está orientado a bloques de 128 —o sea, ya de por sí el tamaño es más grande— y además **permite 3 tipos de clave. Eso está bueno porque le pusieron flexibilidad al algoritmo para que soporte el paso del tiempo, porque inexorablemente todos esos algoritmos tienen un $n$**."*
>
> Y la recomendación operativa, más fina que la de la filmina: *"hoy, la primitiva de cifrado recomendada, si ustedes están en un laburo y tienen que usar algo: **AES de entre 192 y 256 bits, probablemente 256**."*

## El recorte examinable

**El docente fija de frente qué se toma de AES, y es una sola cosa: la estructura algebraica.** No las tablas, no las cuatro etapas memorizadas, no el key schedule. La frase es *"lo que se tienen que saber de AES"*, y explica de paso por qué esta nota es corta comparada con la de [[des-y-3des|DES]]: el desbalance no es de la wiki, es de la clase.

> [!quote]- De la transcripción — la lógica de AES y qué hay que saber de él (cues pt2 407-413, 417-419)
> *"AES tiene una lógica diferente. ¿Cuál es la lógica diferente? Lo que se está haciendo es **resolver un sistema de ecuaciones** que en realidad no son booleanas, sino que es **un campo de Galois de $2^{8}$, un campo finito**."*
>
> Qué es un campo finito, dicho para la clase: *"es como una extensión de lo que pasa en los números enteros (…) la división entera [parte el conjunto] en clases de equivalencia, y quedan como un conjunto discreto de elementos posibles **que es finito**, en vez de ser infinitos valores. Eso es lo que se llama $\mathbb{Z}$ algo. Esto lo vieron en discreta."*
>
> Y el recorte, textual: *"Este no lo vamos a ver en detalle, porque la verdad es bastante pesado (…) DES es más comprensible, pero **AES se merece como 5 clases solamente para entender todo el algoritmo**, porque hace de todo. Pero la idea, la lógica, **lo principal, lo que se tienen que saber de AES, es esto: que está basado en la resolución de un sistema [matricial] en un campo de Galois finito, en un campo discreto**."*
>
> De paso, la digresión sobre Galois: murió a los 20 en un duelo, *"un tipo genial que había hecho todo antes de los 20 años"*.

Es también el mejor anclaje que tiene [[cuerpos-finitos-y-campos-de-galois|Cuerpos finitos y campos de Galois]] en la Clase 02: hasta acá esa nota se colgaba sólo del `Byte Sub` de la filmina; con esto, el $\mathrm{GF}(2^{8})$ pasa a ser **la respuesta a "¿qué es AES?"**, no un detalle de una etapa.

## Esquema de funcionamiento

![Una ronda de AES](../../assets/clase02-aes-ronda.png)

**4 etapas por cada ronda:**

| Etapa | Qué hace |
|---|---|
| **Byte Sub** | Sustitución de valores según una tabla derivada de **invertir** en el [[cuerpos-finitos-y-campos-de-galois\|campo GF(2⁸)]] |
| **Shift Row** | Permutación |
| **Mix Column** | Transformación **lineal invertible** de cada byte en función de los 4 que forman el mismo grupo |
| **Add Round Key** | **Xor** con la parte de la clave derivada para la ronda en cuestión |

### Variaciones para generar asimetrías

- **1ra ronda** → sólo tiene el paso **Add Round Key**.
- **Última ronda** → **no** tiene paso **Mix Column**.

> **Para qué las asimetrías** *(lectura nuestra; la filmina las enuncia sin justificar).* Sin ellas, las rondas serían todas idénticas y el cifrado tendría una regularidad que el criptoanálisis puede explotar. Además la última ronda sin `Mix Column` hace que **el descifrado tenga la misma forma** que el cifrado (con las etapas inversas), igual que la simetría que Feistel le daba a DES. El paso **Add Round Key inicial** es lo que impide que un adversario calcule las tres primeras etapas *sin conocer la clave*: sin él, las primeras operaciones serían públicas y regalarían una ronda entera.

**La clase respalda esa lectura, y le pega otra al lado.** Al pasar por la filmina, el docente da **dos motivos distintos en la misma frase** y no los separa: *"eso tiene que ver **para generar alguna cuestión de asimetría, para que no sea tan predecible**. Algunas cosas de los algoritmos son pequeños tweaks que le hicieron para **mejorar la performance** del algoritmo"* (cue pt2 422). La primera mitad es la justificación de seguridad que la nota infiere; la segunda es de otro orden. Conviene tener presentes las dos y saber que en clase van pegadas.

> **Dos imprecisiones menores de la filmina** *(lectura nuestra, para no memorizarlas mal):*
> - *"Shift Row: permutación de **bits**"* → el desplazamiento es **de bytes**, por filas del estado (fila $i$ rota $i$ posiciones).
> - *"tabla derivada de **invertir una matriz**"* → lo que se invierte es **cada byte como elemento** de $\mathrm{GF}(2^{8})$ (inverso multiplicativo), seguido de una transformación afín. La caja $S$ es una tabla precalculada de esa composición. Qué es ese cuerpo, por qué todo byte no nulo tiene inverso ahí y por qué no sirve $\mathbb{Z}_{256}$: [[cuerpos-finitos-y-campos-de-galois|Cuerpos finitos y campos de Galois]].
>
> Ninguna de las dos cambia la idea: **`Byte Sub` es la única parte no lineal, y todo lo demás es lineal.**

## Round keys (128 bits)

> **Esto no entra en el parcial.** El docente recorre la filmina entera del key schedule sin detenerse y la cierra con un ***"esto ya no lo tomamos"*** (cue pt2 423). Queda acá porque es lo que la filmina dice y porque hace falta para leer una implementación, no porque se pregunte. Explica además por qué pasa por encima de las imprecisiones que las **notas de lectura** de abajo corrigen: no las señala porque no las va a evaluar.

Cómo se derivan las subclaves a partir de la clave original:

**Los primeros 16 bytes** corresponden a la **clave original**.

**Cada 16 bytes más:**

1. **Generar máscara**
   - Tomar los **últimos 4 bytes** y **rotarlos 8 bits** a la derecha.
   - Aplicar **ByteSub** a cada byte.
   - Al **byte menos significativo**: xor con $2^{i}$, siendo $i$ el número de grupo de bytes a generar ($1$ para los primeros 16).
2. **Generar grupos de 4 bytes**
   - Primeros 4 bytes: **máscara xor** los key bytes generados **16 posiciones antes**.
   - Siguientes: **xor** entre los 4 bytes generados y los generados 16 posiciones antes.

> **Notas de lectura** *(nuestras).*
> - La rotación de 4 bytes se llama **RotWord** en el estándar y se describe habitualmente como una rotación **a la izquierda** ($[a_0,a_1,a_2,a_3] \to [a_1,a_2,a_3,a_0]$). Es la misma operación que la filmina describe como "8 bits a la derecha": depende de la convención de orden de bytes. **No memorizar la dirección, memorizar que es una rotación de una posición de byte.**
> - El $2^{i}$ del xor es la constante de ronda **Rcon**. La simplificación funciona hasta $i = 8$; a partir de ahí el valor se reduce en $\mathrm{GF}(2^{8})$ y deja de ser una potencia de dos literal.
> - Las tres piezas del key schedule —rotar, pasar por la caja $S$, xorear una constante que cambia por ronda— están para lo mismo: **romper cualquier simetría** entre subclaves. Si todas las rondas usaran la misma clave, atacar 10 rondas costaría casi lo mismo que atacar una.

## En la práctica

De la filmina de [[eleccion-de-primitivas|primitivas recomendadas]]:

$$\mathrm{AES}: \{0,1\}^{128,\,192\ \text{o}\ 256} \times \{0,1\}^{128} \to \{0,1\}^{128}$$

→ **Recomendado para proyectos nuevos**: `AES-CBC`, `AES-CTR`.

**AES es la primitiva; `CBC` y `CTR` son los [[modos-de-encadenamiento|modos]].** "AES" a secas no es un criptosistema — es determinístico y cifra 128 bits. Lo que se usa siempre es el par `AES-<modo>`.

## Ver también

- [[des-y-3des|DES y 3-DES]] — a quién reemplaza y por qué
- [[cuerpos-finitos-y-campos-de-galois|Cuerpos finitos y campos de Galois]] — qué es $\mathrm{GF}(2^{8})$ y por qué `Byte Sub` puede invertir ahí: es el único cuerpo de 256 elementos salvo isomorfismos, y $\mathbb{Z}_{256}$ no lo es (los bytes pares no tienen inverso)
- [[primitiva-de-cifrado-en-bloque|Primitiva de cifrado en bloque]]
- [[modos-de-encadenamiento|Modos de encadenamiento]] — sin modo, AES no es usable
- [[eleccion-de-primitivas|Elección de primitivas en un proyecto]]
- [[clase-02-cifrado|Clase 02 — Cifrado simétrico]]
- Katz & Lindell cap. 6 *Practical Constructions of Symmetric-Key Primitives* ([[bibliografia|bibliografía]])
