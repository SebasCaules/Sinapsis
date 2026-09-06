---
title: Notación y terminología
resumen: 'Inventario de los símbolos que esta wiki usa de verdad, con su significado y la nota donde aparece; cuando el vault escribe la misma cosa de dos maneras, lo señala y fija la forma canónica.'
fuentes: ["[[clase-01-introduccion-y-criptografia-clasica]]", "[[clase-02-cifrado]]", "[[practica-01-esquemas-y-taxonomias]]", "[[practica-03-seudoaleatoriedad-y-modos]]"]
aliases: [Notación, Notacion, Terminología, Terminologia, Glosario, Símbolos, Glosario de símbolos]
type: concepto
unidad: 1
clase: 2
orden: 17
created: 2026-08-24
updated: 2026-09-04
tags: [criptografia, notacion, glosario, terminologia, convenciones, demostraciones, clase-01, clase-02, parcial]
sources: ["Clase 01 - Criptografia - Introduccion.pdf", "Clase 02 - Criptografia - Cifrado.pdf", "Clase 1.pdf (práctica 01)", "Clase 3.pdf (práctica 03)", "probabilidad y criptografia.pdf", "DirtyGuidToNumberTheory.pdf", "Cuerpos Finitos - ITBA 2021(1).pdf", "informationtheory.pdf", "des.pdf", "Katz & Lindell"]
---

# Notación y terminología

Esta nota trae qué es cada símbolo, para cuando, leyendo una fórmula del vault, aparece uno y **no se recuerda qué era**. Es la nota de vuelta: cada fila dice qué significa el símbolo, cómo se pronuncia y en qué nota está usado de verdad.

**Qué la distingue de sus vecinas.** No es una lista sacada de un libro: es el **inventario de la notación que esta wiki efectivamente usa**, barrida archivo por archivo. Todo símbolo listado acá aparece en alguna nota, y la columna *Dónde se usa* lo prueba con un link. Cuando el vault escribe la misma cosa de dos maneras, esta nota **lo dice y fija la forma canónica** en vez de disimularlo — esa es la sección [[#12. Inconsistencias conocidas y la forma canónica|12]].

> **Cómo leerla.** No se lee de arriba abajo. Se entra por el símbolo. Las secciones 1 a 3 son las que más se usan en el parcial de la Unidad 1; la 10 es la que conviene leer **entera** una vez, porque no es un glosario sino el catálogo de las cuatro formas de demostración que la materia usa de verdad.

---

## 1. Los tres espacios y sus elementos

La convención de fondo, que vale en todo el vault: **mayúscula caligráfica es el conjunto, minúscula itálica es un elemento del conjunto**.

| Símbolo | Qué significa | Dónde se usa |
|---|---|---|
| $\mathcal{M}$ | **Espacio de mensajes**: todos los textos planos que el esquema admite | [[criptosistema\|Criptosistema]], [[secreto-perfecto\|Secreto perfecto]] |
| $\mathcal{K}$ | **Espacio de claves**: todas las claves que `Gen` puede producir | [[criptosistema\|Criptosistema]], [[modelo-probabilistico-de-un-criptosistema\|Modelo probabilístico]] |
| $\mathcal{C}$ | **Espacio de criptogramas**: todas las salidas posibles de `Enc` | [[criptosistema\|Criptosistema]] |
| $m$ | Un **mensaje** concreto, $m \in \mathcal{M}$ | en todas |
| $k$ | Una **clave** concreta, $k \in \mathcal{K}$ | en todas |
| $c$ | Un **criptograma** concreto, $c \in \mathcal{C}$ | en todas |
| $p$ | Lo mismo que $m$, en la notación de las filminas (*plaintext*): $e_k(p) = c$ | [[criptosistema#Notaciones equivalentes\|Criptosistema § Notaciones equivalentes]] |
| $x$, $y$ | Mensaje y criptograma en la notación del apunte de probabilidad: $\Pr[C{=}y \mid M{=}x]$ | [[modelo-probabilistico-de-un-criptosistema\|Modelo probabilístico]], [[probabilidad-y-criptografia\|Probabilidad y criptografía]] |
| $\Sigma$ | **Alfabeto** finito de símbolos (las letras) | [[cifrado-por-rotacion\|Cifrado por rotación]], [[cifrado-de-vigenere\|Vigenère]] |
| $n = \lvert\Sigma\rvert$ | **Tamaño del alfabeto**: $27$ para castellano (con `Ñ`), $26$ para inglés | [[cifrado-por-rotacion\|Cifrado por rotación]] |
| $\Sigma^{\ell}$ | Cadenas de **exactamente** $\ell$ símbolos del alfabeto | [[secreto-perfecto\|Secreto perfecto]] |
| $\Sigma^{*}$ | Cadenas de **cualquier** longitud (incluida la vacía) | [[cifrado-por-rotacion\|Cifrado por rotación]] |
| $\ell$ | **Longitud** de un mensaje, medida en símbolos | [[ataque-de-fuerza-bruta\|Fuerza bruta]], [[secreto-perfecto\|Secreto perfecto]] |
| $\sigma$ | La **biyección letra $\to$ número** por orden alfabético: $\sigma(\texttt{A})=0,\dots$ | [[cifrado-por-rotacion\|Cifrado por rotación]], [[guia-01-resolucion\|Guía 1 — Resolución]] |
| $\lvert X\rvert$ | **Cardinal** de un conjunto (cuántos elementos tiene) o **longitud** de una cadena | [[secreto-perfecto\|Secreto perfecto]]: $\lvert\mathcal{K}\rvert \ge \lvert\mathcal{M}\rvert$ |
| $\#X$ | Cardinal también, en el vocabulario de teoría de grupos: $\#\langle x\rangle$ | [[cuerpos-finitos-y-campos-de-galois\|Cuerpos finitos y campos de Galois]] |
| $\{0,1\}^{n}$ | Las cadenas de **$n$ bits**: el espacio en el que trabajan flujo, bloque y las pruebas | [[pruebas-de-indistinguibilidad\|Pruebas de indistinguibilidad]] |

> **Ojo con el doble sentido de $n$.** En el bloque clásico $n$ es el **tamaño del alfabeto** ($n = \lvert\Sigma\rvert = 27$); en el bloque moderno $n$ es el **parámetro / nivel de seguridad**, típicamente el largo de la clave en bits ([[seguridad-computacional#Nivel de seguridad|seguridad computacional § Nivel de seguridad]]). Son dos cosas distintas con la misma letra, y el vault usa las dos. Se desambigua por contexto: si al lado hay un $\Sigma$ o un alfabeto, es el tamaño del alfabeto; si al lado hay un $\mathrm{PPT}$ o un $\varepsilon(n)$, es el parámetro de seguridad.

---

## 2. Variables aleatorias contra valores

Es **la confusión número uno** de la Unidad 1 y merece leerse despacio.

> $M$, $K$ y $C$ (mayúscula itálica) son **variables aleatorias**. $m$, $k$ y $c$ (minúscula) son **los valores concretos** que esas variables pueden tomar.

Por eso se escribe $\Pr[M{=}m]$ y **nunca** $\Pr[m]$: la probabilidad no es de un número suelto, es del **evento** "la variable aleatoria $M$ tomó el valor $m$".

| Escritura | Qué es | Comentario |
|---|---|---|
| $M$ | Variable aleatoria "el mensaje que Alice manda" | Su distribución la fija el **idioma y el contexto**, no el diseñador |
| $K$ | Variable aleatoria "la clave que sorteó `Gen`" | Su distribución **es parte de la especificación** del criptosistema |
| $C$ | Variable aleatoria **derivada**: $C = \mathsf{Enc}_K(M)$ | No se elige: queda **inducida** por las otras dos y por `Enc` |
| $\Pr[M{=}m]$ | Probabilidad de que el mensaje sea $m$ | Correcto |
| $\Pr[m]$ | — | **Incorrecto**: falta decir de qué variable |
| $\Pr[C{=}c \mid M{=}m]$ | Probabilidad de ver $c$ **dado que** el mensaje fue $m$ | La fórmula con la que se **verifica** secreto perfecto |

> **Por qué importa tanto acá y no en otras materias.** La definición de [[secreto-perfecto|secreto perfecto]] es $\Pr[M{=}m \mid C{=}c] = \Pr[M{=}m]$: una igualdad **entre dos distribuciones de la misma variable aleatoria**, la a posteriori y la a priori. Si se confunden $M$ y $m$, la definición se lee como una igualdad entre números y deja de decir nada. La paradoja que la [[clase-02-cifrado|Clase 02]] señala —$C$ y $M$ son dependientes pero la definición pide que sean independientes— **sólo se puede enunciar** con las variables aleatorias separadas de sus valores.

**La convención tipográfica que ayuda:** el vault escribe las igualdades dentro de $\Pr[\cdot]$ con llaves tight, $\Pr[M{=}m]$ en vez de $\Pr[M = m]$, para que el signo igual no se separe y se lea como una sola pieza. Es cosmético pero está usado sistemáticamente: cerca de **cuatrocientas** veces en las notas de la wiki.

---

## 3. Los algoritmos y el esquema

| Símbolo | Qué significa | Dónde se usa |
|---|---|---|
| $\mathsf{Gen}$ | Algoritmo de **generación de clave**. El único **probabilístico** del trío en los esquemas clásicos | [[criptosistema\|Criptosistema]] |
| $\mathsf{Enc}$ | Algoritmo de **cifrado**: $\mathcal{K}\times\mathcal{M}\to\mathcal{C}$ | [[criptosistema\|Criptosistema]] |
| $\mathsf{Dec}$ | Algoritmo de **descifrado**: $\mathcal{K}\times\mathcal{C}\to\mathcal{M}$. Siempre determinístico | [[criptosistema\|Criptosistema]] |
| $\mathsf{Enc}_k(m)$ | La clave va de **subíndice**: cifrar $m$ con la clave $k$ | en todas |
| $e_k(p)$, $d_k(c)$ | **Lo mismo**, en la notación de las filminas de la cátedra | [[criptosistema#Notaciones equivalentes\|Criptosistema § Notaciones equivalentes]] |
| $e(k,p)$, $\{p\}_k$ | **Lo mismo otra vez**: variantes que aparecen en la bibliografía | [[criptosistema#Notaciones equivalentes\|Criptosistema § Notaciones equivalentes]] |
| $\Pi$ | **El esquema entero**: $\Pi = (\mathsf{Gen}, \mathsf{Enc}, \mathsf{Dec})$. Es un objeto, no una operación | [[pruebas-de-indistinguibilidad\|Pruebas de indistinguibilidad]] |
| $\pi(\mathsf{Gen},\mathsf{Enc},\mathsf{Dec})_{\text{priv}}$ | El mismo esquema en la escritura de la práctica, con **π minúscula** y el subíndice `priv` de *clave privada* | [[practica-01-esquemas-y-taxonomias\|Práctica 01]] |
| $\Pi(n)$ | La **familia** de esquemas parametrizada por el nivel de seguridad | [[seguridad-computacional\|Seguridad computacional]] |
| $F_k$ | Una **primitiva** de bloque instanciada con la clave $k$ — no es un criptosistema | [[primitiva-de-cifrado-en-bloque\|Primitiva de cifrado en bloque]] |
| $G$, $G(k)$ | **Generador pseudoaleatorio** y su salida (el *keystream*) | [[generador-pseudoaleatorio\|Generador pseudoaleatorio]] |

**La condición de corrección**, que es lo mínimo que un esquema tiene que cumplir:

$$\forall k \in \mathcal{K},\ \forall m \in \mathcal{M}: \quad \mathsf{Dec}_k(\mathsf{Enc}_k(m)) = m$$

> **Choque de símbolos que hay que tener presente:** $\pi$ minúscula es **el esquema completo** en la [[practica-01-esquemas-y-taxonomias|Práctica 01]], y es la **permutación-clave** en la [[cifrado-de-sustitucion-monoalfabetica|sustitución monoalfabética]] ($k = \pi \in S_n$) y en el [[cifrado-por-rotacion|cifrado por rotación]] ($\pi_k(x) = (x+k)\bmod n$). Son objetos distintos. Katz & Lindell evita el choque usando $\Pi$ mayúscula para el esquema; el vault reproduce la minúscula donde la filmina la escribe así y la aclara en el lugar.

---

## 4. Asignación y azar

Esta distinción viene de la [[practica-01-esquemas-y-taxonomias|Práctica 01]], que es la que la introduce explícitamente. **No es decoración**: la flecha marca dónde entra la aleatoriedad, y por lo tanto dónde puede haber seguridad.

| Símbolo | Qué significa | Dónde se usa |
|---|---|---|
| $\leftarrow$ | **Asignación probabilística**: el lado derecho tira monedas. $k \leftarrow \mathsf{Gen}()$, $c \leftarrow \mathsf{Enc}_k(m)$ | [[practica-01-esquemas-y-taxonomias\|Práctica 01]], [[criptosistema\|Criptosistema]] |
| $:=$ | **Asignación determinística**: el resultado es único. $m := \mathsf{Dec}_k(c)$ | [[practica-01-esquemas-y-taxonomias\|Práctica 01]] |
| $b \leftarrow \{0,1\}$ | Sortear el **bit oculto** del juego, uniforme | [[pruebas-de-indistinguibilidad\|Pruebas de indistinguibilidad]] |
| $r$, $r^{n}$ | Una cadena **uniforme** de $n$ bits, el objeto contra el que se compara $G(k)$ | [[pruebas-de-indistinguibilidad\|Pruebas de indistinguibilidad]] |

**El sorteo uniforme queda fuera de la tabla, a propósito.** Es la flecha con el signo pesos encima, y se lee *"elegir $k$ uniforme en $\mathbb{Z}_n$"*:

$$k \xleftarrow{\$} \mathbb{Z}_n$$

Está usada en [[cifrado-por-rotacion|cifrado por rotación]], [[cifrado-de-sustitucion-monoalfabetica|sustitución monoalfabética]], [[cifrado-de-vigenere|Vigenère]] y la [[guia-01-resolucion|resolución de la Guía 1]], siempre dentro de la terna `Gen` / `Enc` / `Dec`.

> **Por qué esa fórmula va en un bloque aparte y no en una celda** *(nota de escritura, no de contenido).* El símbolo se produce con `\xleftarrow{\$}`, y el `\$` de adentro es un **dólar escapado**. El escáner de delimitadores de math de Obsidian busca el siguiente `$` sin interpretar el backslash, así que en math **inline** puede cerrar el span antes de tiempo y dejar el resto de la celda como texto plano roto. En un bloque `$$...$$` el cierre es `$$` y el problema no se da: las otras seis apariciones del vault están **todas** en display —dentro del `\begin{aligned}` con el que cada nota escribe su terna `Gen` / `Enc` / `Dec`— y por eso ésta también va en display. **Regla:** `\xleftarrow{\$}` nunca inline, y menos dentro de una celda de tabla.

> **Por qué `Dec` va con $:=$ y no con flecha.** Descifrar **no puede tirar una moneda**: si lo hiciera, el resultado no sería único y se rompería la condición de corrección. `Gen` sí es probabilístico —elige la clave al azar— y `Enc` se escribe con flecha para dejar la puerta abierta al [[cifrado-probabilistico-nonce-e-iv|cifrado probabilístico]], que es exactamente lo que la Clase 02 va a necesitar. En los clásicos `Enc` es determinístico, y ese determinismo es lo que los hace caer bajo `CPA`.

### El parámetro de seguridad en unario

Katz escribe los algoritmos como $\mathsf{Gen}(1^{n})$: el parámetro de seguridad $n$ se pasa **en unario**, es decir como una cadena de $n$ unos, no como el número $n$ en binario.

**Dónde se usa, que no es sólo el libro.** La notación es de Katz & Lindell ([[bibliografia|bibliografía]]), pero entró al vault por la **práctica**: la filmina [`Clase 3.pdf`](../../raw/practicas/Clase%203.pdf) la escribe tal cual —*"kGen(1n)"* y *"El adversario A recibe 1n"*— y la [[practica-03-seudoaleatoriedad-y-modos|Práctica 03]] la reproduce en el $\mathsf{Gen}(1^{n})$ de su [[practica-03-seudoaleatoriedad-y-modos#3. El OTP redefinido con el generador, y su veredicto|§3]] y en el paso 2 del experimento de su [[practica-03-seudoaleatoriedad-y-modos#6. El experimento PrivK-CPA, en 5 pasos|§6]], donde además le dedica un párrafo. La [[clase-02-cifrado#Notación y terminología|Clase 02]] ya tenía su propia fila de glosario.

Las filminas de **teoría** son las que no la usan: las Clases 01 y 02 escriben $\mathsf{Gen}$, $A(n)$ y $\Pi(n)$ a secas, sin unario. O sea que dentro de la misma materia conviven las dos escrituras según de qué filmina venga el enunciado — y las dos significan lo mismo.

**Por qué en unario, que es la única parte que hay que entender.** "Tiempo polinomial" siempre significa *polinomial en el largo de la entrada*. Si le pasaras el número $n$ escrito en binario, la entrada mediría $\log n$ bits y "polinomial" pasaría a significar *polinomial en $\log n$* — o sea polilogarítmico en $n$, que es muchísimo menos de lo que se le quiere permitir al adversario y al esquema honesto. Escribiéndolo como $1^{n}$ la entrada mide $n$, y $\mathrm{PPT}$ significa lo que uno quiere que signifique. Es un truco de contabilidad, no una idea: sirve para que la definición de [[seguridad-computacional|seguridad computacional]] sea la correcta.

---

## 5. Probabilidad

| Símbolo | Qué significa | Dónde se usa |
|---|---|---|
| $\Pr[A]$ | Probabilidad del evento $A$ | forma **canónica** del vault: es la que usa la enorme mayoría de las notas |
| $P[A]$ | Lo mismo, en la notación del apunte de probabilidad | [[modelo-probabilistico-de-un-criptosistema\|Modelo probabilístico]], [[probabilidad-y-criptografia\|Probabilidad y criptografía]] |
| $\Pr[A \mid B]$ | Probabilidad **condicional**: de $A$ **dado que** pasó $B$. La barra se escribe `\mid`, nunca un pipe crudo | [[secreto-perfecto\|Secreto perfecto]] |
| $\Pr[M{=}m]$ | Distribución **a priori**: lo que el adversario cree del mensaje **antes** de ver nada | [[secreto-perfecto\|Secreto perfecto]] |
| $\Pr[M{=}m \mid C{=}c]$ | Distribución **a posteriori**: lo que cree **después** de ver el criptograma | [[probabilidad-y-criptografia\|Probabilidad y criptografía]] |
| $\Pr[C{=}c]$ | **Marginal** del criptograma: se obtiene sumando sobre todas las claves y mensajes que lo producen | [[modelo-probabilistico-de-un-criptosistema\|Modelo probabilístico]] |
| $\sum$ | Suma, casi siempre sobre las claves que hacen algo: $\sum_{k\,:\,x\,=\,\mathsf{Dec}_k(y)}$ | [[modelo-probabilistico-de-un-criptosistema\|Modelo probabilístico]] |
| $\varepsilon$, $\varepsilon(n)$ | La **ventaja** del adversario por encima de $0{,}5$; con $n$, ya parametrizada por el nivel de seguridad | [[pruebas-de-indistinguibilidad\|Pruebas de indistinguibilidad]] |
| $\delta$ | La **ventaja de un distinguidor** $D$ entre dos distribuciones | [[pruebas-de-indistinguibilidad#Ejercicio 1: si G se distingue, el flujo no pasa EAV\|Pruebas de indistinguibilidad § Ejercicio 1]] |

**Bayes**, que es la única herramienta de probabilidad que la materia usa de verdad:

$$\Pr[M{=}m \mid C{=}c] \;=\; \frac{\Pr[C{=}c \mid M{=}m]\cdot \Pr[M{=}m]}{\Pr[C{=}c]}$$

> **La regla operativa que sale de ahí.** El [[secreto-perfecto|secreto perfecto]] se **define** con la a posteriori pero se **verifica** con la condicional del cifrado, porque esa última no depende de la distribución del mensaje: es literalmente *"la masa de claves que llevan $m$ a $c$"*. Todo el desarrollo está en [[modelo-probabilistico-de-un-criptosistema|modelo probabilístico de un criptosistema]].

**Hipótesis de independencia**: en todo el vault se asume $\Pr[M{=}m,\ K{=}k] = \Pr[M{=}m]\cdot\Pr[K{=}k]$, porque `Gen` sortea la clave sin mirar el mensaje. Sin esa hipótesis **no vale ninguna de las tres fórmulas** del modelo probabilístico.

### Teoría de la información

La segunda familia de notación probabilística del vault, y la que más sorprende porque parece de otra materia. Vive entera en el apunte de [[teoria-de-la-informacion|Teoría de la información]] y desde ahí se asoma a dos notas: [[secreto-perfecto|secreto perfecto]], que enuncia con ella la versión fuerte del teorema de Shannon ($H(K) \ge H(M)$), y la [[clase-02-cifrado|Clase 02]], que escribe el secreto perfecto como $I(M;C) = 0$. El [[generador-pseudoaleatorio|generador pseudoaleatorio]] la usa **en prosa y sin símbolos**, para el argumento de que la expansión mueve recipientes y no contenido. Sirve para lo mismo que Bayes, pero **contando bits en vez de comparando distribuciones**.

| Símbolo | Qué significa | Dónde se usa |
|---|---|---|
| $H(X)$ | **Entropía**: la sorpresa promedio de una variable aleatoria, en bits. $H(X) = \sum_x p(x)\log_2 \tfrac{1}{p(x)}$ | [[teoria-de-la-informacion#3. Información de Shannon y entropía\|Teoría de la información § 3]] |
| $H(X \mid Y)$ | **Entropía condicional**: la incertidumbre que queda sobre $X$ una vez que se conoce $Y$. Shannon la llama *equivocación* | [[teoria-de-la-informacion#Entropía condicional\|Teoría de la información § Entropía condicional]] |
| $H(X,Y)$ | **Entropía conjunta**, la del par. De ahí sale la regla de la cadena: $H(X,Y) = H(X) + H(Y \mid X)$ | [[teoria-de-la-informacion#Las identidades que hay que tener a mano\|Teoría de la información § Las identidades]] |
| $I(X;Y)$ | **Información mutua**: cuántos bits de $X$ te revela ver $Y$. $I(X;Y) = H(X) - H(X \mid Y)$ | [[teoria-de-la-informacion#Información mutua\|Teoría de la información § Información mutua]] |
| $p(x)$ | La **distribución** de la variable, escrita como función en vez de como $\Pr[X{=}x]$ | [[teoria-de-la-informacion#3. Información de Shannon y entropía\|Teoría de la información § 3]] |
| $\log_2$ | Logaritmo **en base 2**. Es lo único que hace que la unidad sea el *bit* y no el *nat* | idem |
| $\eta$ | El **ruido** del canal, en el modelo $y = x + \eta$ | [[teoria-de-la-informacion#4. El canal: entropía conjunta, condicional e información mutua\|Teoría de la información § 4]] |
| $C$ (sin subíndices, en un canal) | **Capacidad del canal**: $C = \max_{p(x)} I(x;y)$ | [[teoria-de-la-informacion#5. Capacidad de canal y los dos teoremas de codificación\|Teoría de la información § 5]] |

**Las dos fórmulas por las que esto entra a la materia**, las dos en [[teoria-de-la-informacion#8. El puente con criptografía|Teoría de la información § 8]]:

$$I(M;C) = 0 \qquad\text{y}\qquad H(K) \;\ge\; H(M)$$

La primera es el [[secreto-perfecto|secreto perfecto]] escrito en bits: *"el criptograma no aporta ninguna información sobre el mensaje"*. La segunda es el teorema de Shannon en su versión fuerte — la cota de conteo $\lvert\mathcal{K}\rvert \ge \lvert\mathcal{M}\rvert$ sale de ella como caso particular con mensajes equiprobables, y la de entropía además detecta un `Gen()` sesgado que el conteo no ve.

> **Otro choque de letras, y de los peores, porque los dos sentidos conviven en la misma página.** El $C$ de **capacidad de canal** no tiene nada que ver con el $C$ de **criptograma** ni con el $\mathcal{C}$ de **espacio de criptogramas**, y los tres se cruzan justo cuando el apunte hace el puente con criptografía. Se desambigua por la compañía: si al lado hay un $\max_{p(x)}$ o un canal, es capacidad; si está adentro de un $\Pr[\cdot]$ o de un $H(\cdot)$ junto a $M$ y $K$, es el criptograma.

> **Y dos escrituras conviviendo, que conviene reconocer las dos.** La información mutua aparece como $I(M;C)$ con **punto y coma** en el bloque de criptografía y como $I(x,y)$ con **coma** en el bloque del canal, siguiendo cada uno a su fuente; y las variables van en **mayúscula** ($H(M)$, $H(K)$) cuando son las del criptosistema y en **minúscula** ($H(x)$, $H(y)$) cuando son las del tutorial de canales. Es la misma función y son las mismas variables aleatorias. La forma canónica está fijada en la [[#12. Inconsistencias conocidas y la forma canónica|sección 12]].

---

## 6. Adversario y recursos

| Símbolo | Qué significa | Dónde se usa |
|---|---|---|
| $A$ | El **adversario**: el algoritmo que intenta ganar la prueba. El vault lo escribe con $A$ itálica pelada | [[pruebas-de-indistinguibilidad\|Pruebas de indistinguibilidad]], [[guia-02-criptografia-simetrica\|Guía 2]] |
| $\mathcal{A}$ | **El mismo adversario**, en la caligráfica de Katz & Lindell y del enunciado de la [[guia-02-criptografia-simetrica\|Guía 2]]. El vault usa mayoritariamente $A$ pelada, pero la [[clase-02-cifrado#Notación y terminología\|Clase 02]] escribe $\mathsf{PrivK}^{\mathsf{eav}}_{\mathcal{A},\Pi}$ y $\mathcal{A}(1^{n})$ | [[clase-02-cifrado#Notación y terminología\|Clase 02 § Notación]], [[bibliografia\|Bibliografía]] |
| $D$ | El **distinguidor**: variante del adversario que sólo tiene que decir "esto es pseudoaleatorio" o "esto es al azar" | [[pruebas-de-indistinguibilidad#Ejercicio 1: si G se distingue, el flujo no pasa EAV\|Pruebas de indistinguibilidad § Ejercicio 1]] |
| $b$ | El **bit oculto** que el juego sortea y que el adversario tiene que adivinar | [[pruebas-de-indistinguibilidad\|Pruebas de indistinguibilidad]] |
| $b'$ | El bit que el adversario **emite**. Gana si $b = b'$ | [[pruebas-de-indistinguibilidad\|Pruebas de indistinguibilidad]] |
| $\beta$, $\beta'$ | **Exactamente lo mismo que $b$ y $b'$**, renombrados cuando la letra $b$ ya está tomada como nombre de un mensaje | [[guia-02-resolucion#Ejercicio 1\|Guía 2 — Resolución § Ej. 1]] y [[guia-02-resolucion#Ejercicio 4\|§ Ej. 4b]] |
| $n$ | **Nivel / parámetro de seguridad**. En la práctica, el largo de la clave en bits | [[seguridad-computacional#Nivel de seguridad\|Seguridad computacional § Nivel de seguridad]] |
| $1^{n}$ | El mismo parámetro **escrito en unario**, como argumento: $\mathsf{Gen}(1^{n})$, *"$A$ recibe $1^{n}$"*. Desarrollado más arriba, en la [[#4. Asignación y azar\|sección 4]] | [[practica-03-seudoaleatoriedad-y-modos#3. El OTP redefinido con el generador, y su veredicto\|Práctica 03 §3]] y [[practica-03-seudoaleatoriedad-y-modos#6. El experimento PrivK-CPA, en 5 pasos\|§6]], [[clase-02-cifrado#Notación y terminología\|Clase 02 § Notación]] |
| $\mathrm{PPT}$ | *Probabilistic Polynomial Time*: el adversario puede tirar monedas y corre en tiempo polinomial en $n$ | [[seguridad-computacional\|Seguridad computacional]] |
| $p(n)$ | Un **polinomio** en $n$ — la cota de pasos que el adversario tiene permitida | [[seguridad-computacional\|Seguridad computacional]] |
| $\mathsf{negl}(n)$ | Una **función despreciable** en $n$. Es la abreviatura de Katz, y el vault la usa donde reproduce la filmina de la práctica | [[practica-03-seudoaleatoriedad-y-modos#3. El OTP redefinido con el generador, y su veredicto\|Práctica 03 §3, §5 y §6]], [[clase-02-cifrado#Notación y terminología\|Clase 02 § Notación]] |

> **Por qué existen $\beta$ y $\beta'$ si ya existen $b$ y $b'$.** Porque **el enunciado de la Guía 2 usa $b$ como nombre de un mensaje**, y el bit del juego no puede llamarse igual que uno de los mensajes que el juego sortea. La [[guia-02-resolucion#Ejercicio 1|resolución]] lo dice en el lugar donde renombra: *"el enunciado usa $b$ como nombre de un mensaje, así que acá al bit del juego lo llamamos $\beta$ para que no choquen"*. Es un renombre **local y declarado**, no una segunda convención: la letra canónica del vault sigue siendo $b$, y sólo se cambia cuando hay colisión. Vale la pena registrarlo porque en el parcial la colisión se repite sola: los mensajes se suelen llamar $a$ y $b$.

### Función despreciable

Donde sigue a las filminas de teoría, el vault la llama $\varepsilon(n)$, y la define así, con la precisión que la filmina se come:

> $\varepsilon$ es **despreciable** si **para todo polinomio $p$** existe $N$ tal que $\varepsilon(n) < 1/p(n)$ para todo $n > N$.

O sea: **decae más rápido que la inversa de cualquier polinomio**. El cuantificador es universal sobre el polinomio, no existencial — ése es exactamente el punto donde la taquigrafía de la filmina engaña. La tabla de ejemplos ($2^{-n}$ sí, $1/n^{100}$ no) está en [[seguridad-computacional|seguridad computacional]].

> **La literatura abrevia esto como $\mathsf{negl}(n)$, y "una función polinomial" como $\mathrm{poly}(n)$.** De las dos, **$\mathsf{negl}$ ya está en el vault**: la [[practica-03-seudoaleatoriedad-y-modos|Práctica 03]] reproduce con ella las **tres** cotas de la filmina —$\Pr[\cdots] = \tfrac12 + \mathsf{negl}(n)$ para el OTP con generador (§3), para el esquema construido sobre la función pseudoaleatoria (§5) y para el experimento `PrivK-CPA` (§6)— y la [[clase-02-cifrado#Notación y terminología|Clase 02]] le dedica una fila de glosario. **$\mathrm{poly}(n)$, en cambio, no aparece en ninguna nota:** donde hace falta un polinomio, el vault escribe $p(n)$. Y las filminas de teoría no usan ninguna de las dos: escriben $\varepsilon(n)$ y hablan de *despreciable* o *negligible*.
>
> **La macro es $\mathsf{negl}$**, sans-serif, para que viaje con la misma familia que $\mathsf{PrivK}$, $\mathsf{Gen}$ y $\mathsf{Enc}$, con los que comparte fórmula. Ver la [[#12. Inconsistencias conocidas y la forma canónica|sección 12]].

### Oráculo

> Un **oráculo** es una caja negra que el adversario puede **consultar**: le pasa una entrada, recibe la salida, y **no ve nada del interior** — ni la clave, ni el estado, ni cuánto costó.

"Tener acceso a un oráculo de `Enc`" significa que $A$ puede pedir $f(x) = e_k(x)$ para los $x$ que quiera, tantas veces como quiera (dentro de su cota polinomial), **sin conocer $k$**. Es la formalización del modelo `CPA` de la [[modelos-de-ataque|taxonomía de ataques]]: el adversario deja de ser pasivo y pasa a poder **elegir** qué se cifra.

La consecuencia estructural, que la [[pruebas-de-indistinguibilidad#Las tres pruebas|prueba CPA]] hace explícita: en `CPA` **la clave se genera primero**, porque $A$ necesita el oráculo *antes* de elegir sus mensajes. En `Eav` y `Mul` el orden es al revés.

---

## 7. Los experimentos, desarmados

El vault escribe el experimento de dos maneras equivalentes. La corta es la de las filminas; la larga es la de Katz & Lindell, y es la que usa el enunciado de la [[guia-02-criptografia-simetrica|Guía 2]].

$$\mathsf{Eav}_{A,\Pi} \qquad\text{es lo mismo que}\qquad \mathsf{PrivK}^{\mathsf{eav}}_{A,\Pi}$$

**Pieza por pieza:**

| Pieza | Qué es |
|---|---|
| $\mathsf{PrivK}$ | El **nombre de la familia** de experimentos: *Private-Key*, o sea de clave privada. Distingue estos juegos de los del mundo asimétrico |
| ${}^{\mathsf{eav}}$ (superíndice) | **Cuál** de los juegos: `eav` = *eavesdropping*. No es el único que el vault tiene escrito: la [[practica-03-seudoaleatoriedad-y-modos#6. El experimento PrivK-CPA, en 5 pasos\|Práctica 03]] usa $\mathsf{PrivK}^{\mathsf{CPA}}_{A,\Pi}(n)$ para el juego de texto plano escogido (y, una vez, $\mathsf{PrivK}^{\mathsf{Eav}}$ con mayúscula, contra la convención de la [[#12. Inconsistencias conocidas y la forma canónica\|sección 12]]). En Katz la misma familia $\mathsf{PrivK}$ hospeda además el juego de múltiples cifrados |
| ${}_{A}$ (primer subíndice) | **Quién** ataca: el adversario concreto contra el que se está midiendo |
| ${}_{\Pi}$ (segundo subíndice) | **Qué** se ataca: el esquema concreto $\Pi = (\mathsf{Gen},\mathsf{Enc},\mathsf{Dec})$ |
| $(n)$ (argumento) | El **nivel de seguridad** con el que se instancia la familia. El vault suele omitirlo; Katz lo escribe siempre |
| $= 1$ | El experimento **devuelve un bit**: $1$ si el adversario ganó ($b = b'$), $0$ si no |

De ahí que la cantidad que se calcula sea siempre $\Pr[\mathsf{PrivK}^{\mathsf{eav}}_{A,\Pi} = 1]$: la probabilidad de que **ese** adversario le gane a **ese** esquema. El Ej. 4b de la [[guia-02-resolucion|Guía 2]] es exactamente ese cálculo, y da $2/3$.

### La tabla de las pruebas

| Prueba | Nombre largo | Qué puede el adversario | Nota |
|---|---|---|---|
| $\mathsf{Eav}$ | *Eavesdropping indistinguishability* | Elige $m_0, m_1$ y ve **un** criptograma. Pasivo | [[pruebas-de-indistinguibilidad#Las tres pruebas\|Pruebas de indistinguibilidad]] |
| $\mathsf{Mul}$ | *Multiple message eavesdropping* | Elige dos **vectores** de mensajes; todos se cifran con la **misma** clave. Pasivo | [[pruebas-de-indistinguibilidad#Las tres pruebas\|Pruebas de indistinguibilidad]] |
| $\mathsf{CPA}$ | *Chosen Plaintext indistinguishability* | Tiene **oráculo de cifrado** antes y después de elegir. Activo | [[pruebas-de-indistinguibilidad#Las tres pruebas\|Pruebas de indistinguibilidad]] |
| `CCA` | *Chosen Ciphertext attack* | Además, **oráculo de descifrado** | El experimento $\mathsf{CCA}_{A,\Pi}$ está escrito paso a paso en [[ataque-de-texto-cifrado-escogido\|Ataque de texto cifrado escogido]] |

**Cada prueba contiene a la anterior**: de las tres primeras, pasar `CPA` es la exigencia más fuerte. Y la serie **no termina ahí**: `CCA` la extiende con el oráculo de descifrado, y es la primera que **ninguno** de los criptosistemas del curso pasa.

> **Ojo con la homonimia de `CCA`.** La sigla nombra **dos cosas distintas** en el vault, y conviene no mezclarlas. En [[modelos-de-ataque|Modelos de ataque]] es una **categoría de adversario** —qué recursos tiene, y la meta es recuperar el texto plano—; en [[ataque-de-texto-cifrado-escogido|03.02]] es un **juego formal** —la meta es adivinar el bit $b$, y la condición de aprobación es $\Pr[\mathsf{CCA}_{A,\Pi}(n)=1] \le \tfrac12 + \mathsf{negl}(n)$ para todo adversario $\mathrm{PPT}$—. La primera sirve para **describir** ataques; el segundo, para **demostrar o refutar** seguridad exhibiendo un adversario concreto. Es la misma relación que hay entre la fila COA de esa taxonomía y el juego `Eav`.

---

## 8. Operadores y relaciones

| Símbolo | Qué significa | Dónde se usa |
|---|---|---|
| $\oplus$ | **XOR** bit a bit. También, en teoría de cuerpos, la **suma genérica** del cuerpo | [[one-time-pad\|One Time Pad]], [[cuerpos-finitos-y-campos-de-galois\|Cuerpos finitos y campos de Galois]] |
| $\odot$ | **Producto genérico** de un cuerpo (el compañero de $\oplus$) | [[cuerpos-finitos-y-campos-de-galois\|Cuerpos finitos y campos de Galois]] |
| $\Vert$ | **Concatenación** de bloques o de cadenas: $R_{16}\Vert L_{16}$ | [[modos-de-encadenamiento\|Modos de encadenamiento]], [[des-descripcion-del-algoritmo\|DES paso a paso]] |
| $\circ$ | **Composición** de funciones: $\pi_{-k}\circ\pi_k = \operatorname{id}$ | [[cifrado-por-rotacion\|Cifrado por rotación]] |
| $\cdot$ | Producto, o simplemente separador multiplicativo | en todas |
| $a \bmod b$ | El **resto** de dividir $a$ por $b$. Es una **operación**: devuelve un número | [[aritmetica-modular-y-divisibilidad\|Aritmética modular]] |
| $x \equiv y \pmod m$ | **Congruencia**: $x$ e $y$ dejan el mismo resto módulo $m$. Es una **relación**: devuelve verdadero o falso | [[aritmetica-modular-y-divisibilidad\|Aritmética modular]] |
| $a \mid b$ | **$a$ divide a $b$**: existe $c$ entero con $b = a\cdot c$ | [[aritmetica-modular-y-divisibilidad\|Aritmética modular]] |
| $a \nmid b$ | $a$ **no** divide a $b$ | [[algoritmo-de-euclides-extendido\|Euclides extendido]] |
| $a \perp b$ | **Coprimos**: $\operatorname{mcd}(a,b) = 1$. Notación del manuscrito, glosada ahí como *"$a$ COPRIME $b$"* | [[aritmetica-modular-y-divisibilidad\|Aritmética modular]], [[inverso-modular\|Inverso modular]] |
| $\operatorname{mcd}(a,b)$ | **Máximo común divisor** | [[algoritmo-de-euclides-extendido\|Euclides extendido]] |
| $\operatorname{mcm}(a,b)$ | **Mínimo común múltiplo** | [[cuerpos-finitos-y-campos-de-galois\|Cuerpos finitos y campos de Galois]] |
| $(a{:}b)$ | El mcd **en la notación del manuscrito** de teoría de números | [[teoria-de-numeros#2. La notación propia del manuscrito\|Teoría de números § 2]] |
| $\varphi(n)$ | **Función de Euler**: cuántos enteros de $1$ a $n$ son coprimos con $n$ | [[cuerpos-finitos-y-campos-de-galois\|Cuerpos finitos y campos de Galois]], [[inverso-modular\|Inverso modular]] |
| $a^{-1}$ | **Inverso multiplicativo** módulo algo: el $x$ con $a x \equiv 1$ | [[inverso-modular\|Inverso modular]] |
| $\bar{x}$, $[x]_m$ | La **clase de equivalencia** de $x$ módulo $m$ | [[aritmetica-modular-y-divisibilidad\|Aritmética modular]] |
| $r_m(x)$ | El **resto** de $x$ al dividir por $m$, escrito como función | [[aritmetica-modular-y-divisibilidad\|Aritmética modular]] |
| $\lll$ | **Rotación circular a izquierda** de una cadena de bits | [[des-y-3des\|DES y 3-DES]], [[des-descripcion-del-algoritmo\|DES paso a paso]] |
| $\lll$ | **"Muchísimo menor que"**, cuando los dos lados son cardinales | [[criptosistema-de-flujo\|Criptosistema de flujo]]: $\lvert\mathcal{K}\rvert \lll \lvert\mathcal{M}\rvert$ |
| $\approx$, $\ge$, $\le$, $\ne$ | Aproximadamente, mayor o igual, menor o igual, distinto | en todas |
| $\to$, $\mapsto$ | Flecha de **firma** ($\mathcal{K}\times\mathcal{M}\to\mathcal{C}$) y flecha de **imagen** ($x \mapsto a x$) | [[criptosistema\|Criptosistema]], [[inverso-modular\|Inverso modular]] |
| $\in$, $\setminus$, $\cap$, $\cup$, $\emptyset$ | Pertenencia, diferencia, intersección, unión, conjunto vacío | en todas |

> **El mismo símbolo $\mid$ tiene *tres* sentidos en el vault, y hay que leerlo por contexto.**
>
> 1. Dentro de un $\Pr[\cdot]$ es **condicional**: $\Pr[A \mid B]$ = *"la probabilidad de $A$ dado $B$"*.
> 2. Dentro de un $H(\cdot)$ es **entropía condicional**: $H(X \mid Y)$ = *"la incertidumbre que queda sobre $X$ una vez que se conoce $Y$"* ([[#Teoría de la información|sección 5]]). Es el mismo *"dado"* que el anterior, pero lo que devuelve no es una probabilidad sino una **cantidad de bits**.
> 3. Entre dos enteros es **divisibilidad**: $a \mid b$ = *"$a$ divide a $b$"*.
>
> No hay ambigüedad real —los dos primeros viven adentro de un delimitador que los anuncia, $\Pr$ o $H$, y el tercero no— pero la primera vez sorprende, sobre todo porque el símbolo se **lee** de maneras opuestas: en $\Pr[A \mid B]$ y en $H(X \mid Y)$ lo de la **derecha** es lo que se sabe; en $a \mid b$ lo de la **izquierda** es lo que divide. Y ojo con el sentido 2 en la fórmula del secreto perfecto en bits: $H(M \mid C) = H(M)$ dice *"ver el criptograma no baja la incertidumbre sobre el mensaje"*, que es la traducción exacta de $\Pr[M{=}m \mid C{=}c] = \Pr[M{=}m]$ al otro idioma.

> **Y $\lll$ también tiene dos sentidos en el vault**, como muestran las dos filas de arriba. En el bloque de DES es la **rotación circular** de las mitades de la clave; en [[criptosistema-de-flujo|criptosistema de flujo]] es *"muchísimo menor que"*, reproduciendo el `<<<` de la filmina. Se desambigua por los operandos: **cadena de bits a la izquierda y un número de posiciones a la derecha** $\Rightarrow$ rotación; **cardinales de los dos lados** $\Rightarrow$ comparación de tamaños.

**$\bmod$ contra $\pmod{}$ contra $\equiv$, que es lo que más se mezcla en el parcial:**

| Escritura | Qué es | Ejemplo |
|---|---|---|
| $a \bmod b$ | **Operación**. Devuelve *un número*, el resto | $17 \bmod 12 = 5$ |
| $x \equiv y \pmod m$ | **Relación**. Devuelve *verdadero o falso* | $17 \equiv 5 \pmod{12}$ |
| $x \equiv y\ (m)$ | La misma relación en la notación del manuscrito | [[teoria-de-numeros\|Teoría de números]] |

Escribir $17 \equiv 5 \bmod 12$ mezcla las dos y no significa nada: o se pone el $\bmod$ como operación de un lado, o se pone el $\pmod{}$ como aclaración de toda la congruencia.

---

## 9. Estructuras algebraicas

| Símbolo | Qué significa | Dónde se usa |
|---|---|---|
| $\mathbb{Z}$ | Los **enteros** | [[aritmetica-modular-y-divisibilidad\|Aritmética modular]] |
| $\mathbb{N}$, $\mathbb{R}$, $\mathbb{Q}$ | Naturales, reales, racionales | [[cuerpos-finitos-y-campos-de-galois\|Cuerpos finitos y campos de Galois]] |
| $\mathbb{Z}_n$ | Los enteros **módulo $n$**: $\{0,1,\dots,n-1\}$ con suma y producto módulo $n$. También escrito $\mathbb{Z}/n\mathbb{Z}$ | [[cifrado-por-rotacion\|Cifrado por rotación]], [[aritmetica-modular-y-divisibilidad\|Aritmética modular]] |
| $\mathbb{Z}_n^{*}$ | Los **inversibles** de $\mathbb{Z}_n$: los $a$ con $a \perp n$. Tiene $\varphi(n)$ elementos | [[inverso-modular\|Inverso modular]] |
| $\mathbb{F}_q$ | El **cuerpo finito** de $q$ elementos | [[cuerpos-finitos-y-campos-de-galois\|Cuerpos finitos y campos de Galois]] |
| $\mathrm{GF}(2^{8})$ | *Galois Field* de $256$ elementos: el cuerpo donde vive cada byte de AES | [[aes\|AES]], [[cuerpos-finitos-y-campos-de-galois\|Cuerpos finitos y campos de Galois]] |
| $S_n$ | El **grupo simétrico**: las $n!$ permutaciones de $n$ elementos. El espacio de claves de la sustitución | [[cifrado-de-sustitucion-monoalfabetica\|Sustitución monoalfabética]] |
| $\langle x\rangle$ | El **subgrupo generado** por $x$: todas sus potencias | [[cuerpos-finitos-y-campos-de-galois\|Cuerpos finitos y campos de Galois]] |
| $\langle a, b\rangle$ | Un **par ordenado** (o una tupla). No tiene nada que ver con la fila de arriba | [[practica-03-seudoaleatoriedad-y-modos#5. El esquema CPA-seguro construido sobre la función pseudoaleatoria\|Práctica 03 § 5]]: $c := \langle r,\ F_k(r)\oplus m\rangle$ |
| $\operatorname{ord}(x)$ | **Orden de un elemento**: el menor $n$ con $x^{n} = e$ | [[cuerpos-finitos-y-campos-de-galois\|Cuerpos finitos y campos de Galois]] |
| $\operatorname{Exp}(G)$ | **Exponente del grupo**: el mcm de los órdenes de todos sus elementos | [[cuerpos-finitos-y-campos-de-galois\|Cuerpos finitos y campos de Galois]] |
| $\operatorname{id}$ | La **función identidad** | [[cifrado-por-rotacion\|Cifrado por rotación]] |
| $e$, $e_{\oplus}$, $e_{\odot}$ | El **elemento neutro** (de la suma y del producto, respectivamente) | [[cuerpos-finitos-y-campos-de-galois\|Cuerpos finitos y campos de Galois]] |

> **Otro choque de letras.** El $e$ de *neutro* de la sección de cuerpos es una letra distinta del $e_k$ de *encrypt* de las filminas de la Clase 01. Nunca aparecen en la misma fórmula, pero conviene tenerlo presente: si el subíndice es una clave, es cifrado; si es $\oplus$ o $\odot$, es un neutro.

> **Y los angulares también tienen dos sentidos**, como muestran las dos filas de arriba. En el bloque de teoría de grupos, $\langle x\rangle$ es el **subgrupo generado** por $x$; en el esquema `CPA`-seguro de la [[practica-03-seudoaleatoriedad-y-modos#5. El esquema CPA-seguro construido sobre la función pseudoaleatoria|Práctica 03]] —que copia la filmina [`Clase 3.pdf`](../../raw/practicas/Clase%203.pdf), donde ya está escrito con angulares y coma, $c := \langle r,\ F_k(r)\oplus m\rangle$, y el descifrado arranca *"dados $\langle r, s\rangle$"*— es un **par ordenado**: el criptograma es la dupla *(valor fresco, mensaje enmascarado)*. Se desambigua **contando lo que hay adentro**: **un solo elemento, y de un grupo** $\Rightarrow$ subgrupo generado; **dos o más componentes separadas por coma** $\Rightarrow$ tupla. Un tercer indicio, cuando la duda persiste: el subgrupo generado se compara con $\#$ y con $\operatorname{ord}$; el par ordenado se **desarma** ($c = \langle r, s\rangle$) para descifrar.

**El criterio que hay que memorizar de este bloque:** $\mathbb{Z}_n$ es cuerpo **si y sólo si $n$ es primo**. Si $n$ es compuesto hay elementos sin inverso —y encima divisores de cero—, y por eso AES trabaja en $\mathrm{GF}(2^{8})$ y no en $\mathbb{Z}_{256}$.

---

## 10. Cuantificadores y estructura de una demostración

### Los símbolos

| Símbolo | Qué significa | Dónde se usa |
|---|---|---|
| $\forall$ | **Para todo**. Es el cuantificador de casi todas las definiciones de seguridad | [[secreto-perfecto\|Secreto perfecto]], [[criptosistema\|Criptosistema]] |
| $\exists$ | **Existe** (al menos uno) | [[aritmetica-modular-y-divisibilidad\|Aritmética modular]] |
| $\Rightarrow$, $\Longrightarrow$, $\implies$ | **Implica** | en todas |
| $\Leftarrow$ | Es implicado por | [[inverso-modular\|Inverso modular]] |
| $\iff$, $\Longleftrightarrow$ | **Si y sólo si**: doble implicación | [[secreto-perfecto\|Secreto perfecto]], [[inverso-modular\|Inverso modular]] |
| $\wedge$, $\lor$ | Y lógico, o lógico | [[aritmetica-modular-y-divisibilidad\|Aritmética modular]] |
| $\blacksquare$ | **Fin de la demostración** (QED). Es la forma canónica del vault | [[aritmetica-modular-y-divisibilidad\|Aritmética modular]], [[inverso-modular\|Inverso modular]] |

**La convención de las dos direcciones.** Cuando el enunciado es un *si y sólo si*, se demuestran las dos implicaciones por separado y cada una se rotula con la flecha que le toca: $(\Rightarrow)$ para *"si vale el enunciado, entonces vale la condición"* y $(\Leftarrow)$ para la vuelta. Los dos ejemplos limpios del vault:

- [[inverso-modular|Inverso modular]], sección 2 — $(\Leftarrow)$ por Bézout, $(\Rightarrow)$ por el lemma de combinación lineal.
- [[secreto-perfecto|Secreto perfecto § Aplicación]] — $(\Leftarrow \ell = 1)$ contando claves, $(\Rightarrow \ell \ge 2)$ con dos argumentos alternativos.

### Las cuatro formas de demostración que la materia usa de verdad

Esto no es un glosario de símbolos: es el catálogo de las **cuatro plantillas** que aparecen una y otra vez en las guías y en el parcial. Reconocer cuál te están pidiendo es la mitad del ejercicio.

**1. Contraejemplo — para refutar un $\forall$.**
Si la afirmación dice *"para todo $c$ vale tal cosa"*, **alcanza con exhibir un solo $c$ donde falle**. No hay que explicar por qué falla en general ni construir una teoría: se muestra el caso y se cierra.

- [[guia-02-resolucion|Guía 2 — Ej. 3]]: *"probar o encontrar un contraejemplo"*, y la afirmación resulta **falsa**.
- [[aritmetica-modular-y-divisibilidad|Aritmética modular § 5]]: la cancelación no se hereda a $\mathbb{Z}_m$, y el contraejemplo mínimo es $4\cdot 3 \equiv 4\cdot 11 \pmod{32}$ con $3 \not\equiv 11$.
- [[ataque-de-fuerza-bruta|Fuerza bruta]]: $\lvert\mathcal{K}\rvert \ge \lvert\mathcal{M}\rvert$ no alcanza para secreto perfecto, y el contraejemplo es el Ejemplo 2 del apunte de probabilidad.

**2. Exhibir un adversario — para refutar seguridad.**
*"Este esquema no pasa tal prueba"* nunca se demuestra en abstracto: se **construye un adversario concreto**, se dice qué mensajes elige y qué responde, y se calcula su probabilidad de éxito. Si esa probabilidad supera a $1/2$ por un margen no despreciable, listo.

- [[pruebas-de-indistinguibilidad#Ejercicio 2: atacar un cifrado de flujo bajo Mul|Pruebas de indistinguibilidad § Ejercicio 2]] — el adversario contra `Mul` que gana con **probabilidad 1**.
- [[pruebas-de-indistinguibilidad#Propiedades de CPA|Pruebas de indistinguibilidad § Propiedades]] — *"determinístico $\Rightarrow$ no CPA-Secure"*, en tres líneas, pidiendo una consulta al oráculo.
- [[guia-02-resolucion|Guía 2 — Ej. 4b]] — se calcula $\Pr[\mathsf{PrivK}^{\mathsf{eav}}_{A,\Pi} = 1] = 2/3$ para un adversario dado.

**3. Reducción — "si se rompe esto, se rompe aquello".**
Es **la** forma de demostración de la criptografía moderna. Para probar que $\Pi$ es seguro se supone lo contrario —un adversario $A$ que le gana— y se **construye con él** un algoritmo que rompe la primitiva subyacente. Como se cree que la primitiva no se rompe, $A$ no puede existir. Toda la seguridad queda **delegada hacia abajo**: el teorema no dice *"CBC es seguro"*, dice *"CBC es tan seguro como pseudoaleatoria sea la primitiva"*.

- [[pruebas-de-indistinguibilidad#Ejercicio 1: si G se distingue, el flujo no pasa EAV|Pruebas de indistinguibilidad § Ejercicio 1]] — el ejemplo canónico, escrito paso a paso: de un distinguidor de $G$ sale un adversario de `Eav`.
- [[modos-de-encadenamiento|Modos de encadenamiento]] — los cinco modos se prueban por reducción a la primitiva.
- [[seguridad-computacional|Seguridad computacional]] — por qué *despreciable* se define como se define: para que la reducción **componga** ($p(n)\cdot\varepsilon(n)$ sigue siendo despreciable).

**4. Conteo — la plantilla de Shannon.**
Argumento de cardinales puros: se cuentan objetos de un lado y del otro y se muestra que no alcanzan. No aparece ningún adversario ni ninguna probabilidad.

- [[secreto-perfecto#Teorema de Shannon (cota de claves)|Secreto perfecto § Teorema de Shannon]] — si $\lvert\mathcal{K}\rvert < \lvert\mathcal{M}\rvert$, algún $c$ no es alcanzable desde algún $m$, y ese $c$ descarta ese $m$.
- [[cuerpos-finitos-y-campos-de-galois|Cuerpos finitos y campos de Galois]] — cuántos generadores tiene un grupo cíclico: $\varphi(\lvert G\rvert)$.

> **Cómo elegir.** Si te piden *refutar una afirmación general* $\to$ contraejemplo. Si te piden *mostrar que un esquema no es seguro* $\to$ adversario. Si te piden *probar que un esquema sí es seguro* $\to$ reducción. Si aparece una **cota** entre tamaños de espacios $\to$ conteo.

---

## 11. Convenciones tipográficas del vault

Estas son las reglas de escritura, no de contenido. Están fijadas en la sección [[indice#Convenciones|Convenciones del índice]] y se aplican en todas las notas.

### Cuándo backtick y cuándo LaTeX

| Va en backticks | Va en LaTeX |
|---|---|
| Nombres propios en **prosa**: `Enc`, `Dec`, `Gen`, `Eav`, `Mul`, `CPA`, `CBC`, `CTR`, `ECB`, `AES-CBC` | **Toda** la matemática, inline con `$...$` o display con `$$...$$` |
| Pasos de AES: `Byte Sub`, `Mix Column`, `Shift Row` | Variables sueltas: $n$, $m$, $\ell$, $t$ |
| Rutas y nombres de archivo | Cardinales y desigualdades: $\lvert\mathcal{K}\rvert \ge \lvert\mathcal{M}\rvert$ |
| Bloques ` ``` ` sólo para: `mermaid`, código Python real, y criptogramas largos para copiar | Tiras de números y literales de texto que conviven con fórmulas |

La regla de decisión: **si es una ecuación o una variable, va en LaTeX; si es el nombre de una cosa, va en backticks.** Un literal suelto que convive con fórmulas en el mismo párrafo va en $\texttt{}$, no en backticks — así $m = \texttt{cab}$ y $\texttt{c}$ se ven igual dos renglones más abajo.

### Las familias de fuente en math, y qué le toca a cada una

| Macro | Para qué | Ejemplos |
|---|---|---|
| `\mathsf{}` | **Algoritmos y pruebas** | $\mathsf{Gen}$, $\mathsf{Enc}$, $\mathsf{Dec}$, $\mathsf{Eav}$, $\mathsf{Mul}$, $\mathsf{CPA}$, $\mathsf{PrivK}$ |
| `\mathcal{}` | **Espacios** (los tres conjuntos del criptosistema) | $\mathcal{M}$, $\mathcal{K}$, $\mathcal{C}$ |
| `\mathbb{}` | **Conjuntos numéricos** estándar | $\mathbb{Z}$, $\mathbb{Z}_n$, $\mathbb{N}$, $\mathbb{R}$, $\mathbb{F}_q$ |
| `\mathrm{}` | **Siglas y nombres romanos** | $\mathrm{GF}(2^{8})$, $\mathrm{PPT}$, $\mathrm{IV}$, $\mathrm{IC}$, $\mathrm{IP}$ |
| `\operatorname{}` | **Funciones con nombre** | $\operatorname{mcd}$, $\operatorname{mcm}$, $\operatorname{ord}$, $\operatorname{Exp}$, $\operatorname{id}$ |
| `\texttt{}` | **Literales de texto** dentro de math (con `\ ` para los espacios) | $\texttt{HOLA}$, $\texttt{UN\ VINO\ DE\ MESA}$ |
| `\text{}` | Prosa dentro de una fórmula | $\text{Secreto perfecto} \implies \dots$ |

### La regla del pipe

> **Nunca un `|` crudo dentro de `$...$`.** Rompe las tablas de markdown: Obsidian corta la celda ahí y la fila se desarma.

- Cardinal y valor absoluto $\to$ `\lvert ... \rvert`, que además abre y cierra con el espaciado correcto.
- Condicional y divisibilidad $\to$ `\mid`.
- Concatenación $\to$ `\Vert`.

Esto vale **aunque la fórmula no esté en una tabla**, para que se pueda mover el texto de un lado a otro sin romperlo.

### Detalles menores que igual están usados en todo el vault

| Convención | Ejemplo |
|---|---|
| Decimales con **coma**, tight | `0{,}5` $\to$ $0{,}5$ · `0{,}0775` $\to$ $0{,}0775$ |
| Igualdades tight dentro de $\Pr[\cdot]$ | `\Pr[M{=}m]` $\to$ $\Pr[M{=}m]$ |
| Conjuntos con llaves escapadas | `\{0,1\}^{n}` $\to$ $\{0,1\}^{n}$ |
| Fracciones inline con `\tfrac`, display con `\frac` o `\dfrac` | $\tfrac12$ en prosa, $\frac{a}{b}$ en display |
| Resultado final en `\boxed{}` | $\boxed{\tfrac{2}{3}}$ |
| Pseudocódigo y ternas con `\begin{aligned}` | los cinco pasos de cada prueba |
| Grillas y alineaciones de columnas con `\begin{array}` y `\hline` | tablas de Vigenère, xor bit a bit |
| Anotar una equivalencia con `\underbrace{}_{}` | las tres caracterizaciones de la congruencia |
| Espaciado con `\quad`, `\qquad`, `\;`, `\,` | separar condiciones dentro de un display |

### Nombres de archivo

Kebab-case, sin tildes ni espacios, y con un prefijo numérico según el tipo de nota:

| Tipo | Patrón | Ejemplo |
|---|---|---|
| Concepto | `<clase>.<orden>-<nombre>.md` | `notacion-y-terminologia.md` |
| Clase de teoría | `clase-NN-tema-corto.md` | `clase-02-cifrado.md` |
| Clase de práctica | `practica-NN-tema-corto.md` | `practica-03-seudoaleatoriedad-y-modos.md` |
| Guía y su resolución | `guia-NN-tema.md` y `guia-NN-resolucion.md` | `guia-02-resolucion.md` |
| Apunte | `tema.md`, sin número | `teoria-de-la-informacion.md` |

**Sobre el prefijo de los conceptos**, que es el único que tiene dos números: **clase** es la que introduce el concepto —la semana temática completa, teoría del jueves y práctica del lunes— y **orden** es la posición dentro de esa clase, siguiendo el orden en que la clase lo **desarrolla**, no en el que lo menciona al pasar. Los dos van con **cero a la izquierda** (`02`, no `2`) para que el explorador de archivos no desordene al pasar del noveno.

> **Ojo con las versiones anteriores del vault.** Los conceptos se llamaban `<unidad>.<clase>.<orden>-<nombre>.md`, con **tres** números y la unidad adelante, y **se renombraron sacando la unidad**: hoy son dos. El motivo está en la [[#Sobre la numeración de esta nota|sección final]]. En prosa también se los cita con dos números (`02.17`, no el prefijo viejo). Si aparece un link de tres números, está roto: no resuelve a ningún archivo del vault.

**Y una regla que no es tipográfica pero se aplica en todas las notas:** lo que no está en la fuente **se dice**, no se infiere en silencio. Las lecturas propias van rotuladas *(lectura nuestra)* o *(desarrollo nuestro)*, y los errores de las filminas van marcados con `> **Errata de la filmina:**`.

---

## 12. Inconsistencias conocidas y la forma canónica

El vault creció por ingestas sucesivas y en **siete** lugares quedaron dos escrituras conviviendo. Acá se fija cuál es la buena. **Al escribir una nota nueva, se usa la de la columna canónica; si aparece la otra en una nota vieja, es candidata a unificar.**

| Tema | Forma canónica | Qué más aparece | Regla |
|---|---|---|---|
| La prueba de observador | $\mathsf{Eav}$ | $\mathsf{eav}$ | **Mayúscula** cuando es el nombre de la prueba ($\mathsf{Eav}_{A,\Pi}$); **minúscula sólo** como superíndice de $\mathsf{PrivK}^{\mathsf{eav}}$, que es como lo escribe Katz. Unificado en todo el vault |
| Orden de un elemento | $\operatorname{ord}$ | $\operatorname{Ord}$, $\operatorname{orden}$ | Siempre $\operatorname{ord}(x)$ en minúscula. $\operatorname{Exp}(G)$ sí va con mayúscula: es otra función |
| Máximo común divisor | $\operatorname{mcd}$ | $\gcd$ | $\operatorname{mcd}$ siempre, salvo cuando el punto del párrafo es justamente **enumerar las notaciones alternativas** |
| Vector de inicialización | $\mathrm{IV}$ | $IV$ pelado | $IV$ sin `\mathrm` lo renderiza MathJax como el **producto $I\cdot V$**, en itálica. Vale para toda sigla: $\mathrm{IC}$, $\mathrm{IP}$, $\mathrm{PPT}$, $\mathrm{GF}$ |
| El adversario | $A$ | $\mathcal{A}$ | $A$ itálica pelada: es lo que usan las filminas y la enorme mayoría de las notas. $\mathcal{A}$ es de Katz y del enunciado de la [[guia-02-criptografia-simetrica\|Guía 2]], y la [[clase-02-cifrado#Notación y terminología\|Clase 02]] lo reproduce donde cita al libro. **No unificar ahí**: la gracia de esa nota es mostrar las dos escrituras juntas |
| El bit oculto del juego | $b$, $b'$ | $\beta$, $\beta'$ | $b$ siempre, **salvo colisión**. Si el enunciado ya usa $b$ como nombre de un mensaje, se renombra a $\beta$ y **se declara en el lugar donde se renombra**, que es exactamente lo que hace la [[guia-02-resolucion#Ejercicio 1\|Guía 2 — Resolución]] |
| Función despreciable | $\mathsf{negl}$ | $\mathrm{negl}$ | Sans-serif, para que viaje con la misma familia que $\mathsf{PrivK}$, $\mathsf{Gen}$ y $\mathsf{Enc}$, con los que comparte fórmula. Unificado en todo el vault; $\mathrm{negl}$ ya no aparece. **$\varepsilon(n)$ no entra en esta cuenta**: no es otra escritura de lo mismo, es la letra de las filminas, y las dos conviven a propósito |

*(Las cuatro primeras filas venían fijadas de la ingesta original; las tres últimas son **observación nuestra**, sacadas de barrer los archivos.)*

**Otras tres que conviene tener en el radar** *(también observación nuestra, y todavía sin unificar):*

- **Los espacios contra las variables aleatorias.** Algunas notas escriben los tres conjuntos como $K$, $M$, $C$ en itálica pelada, y otras como $\mathcal{K}$, $\mathcal{M}$, $\mathcal{C}$. El problema es que $M$, $K$ y $C$ **ya significan las variables aleatorias** (sección 2). **Canónico: caligráfica para el conjunto, itálica para la variable aleatoria.**
- **La marca de fin de demostración.** Casi todas las notas cierran con $\blacksquare$, pero quedan tres demostraciones sueltas rematadas con el carácter ∎ escrito directamente en el texto ([[cifrado-por-rotacion|cifrado por rotación]], [[pruebas-de-indistinguibilidad|pruebas de indistinguibilidad]] y la [[guia-01-resolucion|resolución de la Guía 1]]). **Canónico: $\blacksquare$**, que va dentro de math y no depende de qué fuente tenga instalada el sistema.
- **La información mutua y sus variables.** El apunte de [[teoria-de-la-informacion|Teoría de la información]] la escribe $I(x,y)$ con **coma** y minúsculas mientras habla de canales, y $I(M;C)$ con **punto y coma** y mayúsculas cuando hace el puente con criptografía, porque sigue a cada una de sus dos fuentes. **Canónico para el vault: $I(X;Y)$**, punto y coma y mayúscula — punto y coma porque la coma ya separa argumentos en $H(X,Y)$ (entropía **conjunta**, que es otra cosa), y mayúscula porque son variables aleatorias, igual que en la sección 2.

---

## Sobre la numeración de esta nota

> **Por qué esta nota es `02.17`** *(decisión del vault, no de la cátedra).* No es un concepto que la materia enseñe: es una nota **sobre la wiki misma**, y por eso no hay ninguna clase que la introduzca. Se la ubica al final del bloque de la Clase 2 simplemente porque es donde el contador estaba. La justificación general de por qué los conceptos sin clase asignada continúan el contador `02.x` está en la sección final de [[aritmetica-modular-y-divisibilidad|Aritmética modular y divisibilidad]], y le vale entera a ésta.
>
> **Y por qué el número tiene dos partes y no tres.** El identificador de una nota de concepto es `<clase>.<orden>`: acá, la **clase 02** que introduce el bloque y el **orden 17** dentro de esa clase. La *unidad* iba adelante en la numeración vieja, como un tercer número, y se sacó del nombre de archivo: con sólo dos unidades en todo el programa, ese primer dígito era el mismo en las treinta notas de concepto y no ordenaba nada. **No se perdió el dato:** `unidad` sigue en el frontmatter, al lado de `clase` y `orden`, así que se puede seguir filtrando y ordenando por unidad desde Obsidian. Lo que cambió es el nombre del archivo, no la información.

## Ver también

- [[clase-02-cifrado|Clase 02 — Cifrado simétrico]] — la versión corta de esta nota, en su sección de notación
- [[criptosistema|Criptosistema]] — de dónde salen `Gen`, `Enc`, `Dec` y las notaciones equivalentes
- [[modelo-probabilistico-de-un-criptosistema|Modelo probabilístico de un criptosistema]] — las variables aleatorias y las tres fórmulas
- [[secreto-perfecto|Secreto perfecto]] — la definición donde toda la notación de probabilidad se pone en juego
- [[seguridad-computacional|Seguridad computacional]] — $\mathrm{PPT}$, $\varepsilon(n)$ y el nivel de seguridad
- [[pruebas-de-indistinguibilidad|Pruebas de indistinguibilidad]] — `Eav`, `Mul`, `CPA` y los experimentos desarmados
- [[aritmetica-modular-y-divisibilidad|Aritmética modular y divisibilidad]] — $\mid$, $\perp$, $\bmod$, $\equiv$, $\operatorname{mcd}$
- [[cuerpos-finitos-y-campos-de-galois|Cuerpos finitos y campos de Galois]] — $\oplus$, $\odot$, $\langle x\rangle$, $\operatorname{ord}$, $\varphi$
- [[practica-01-esquemas-y-taxonomias|Práctica 01 — Esquemas y taxonomías]] — la fuente de la distinción $\leftarrow$ / $:=$
- [[practica-03-seudoaleatoriedad-y-modos|Práctica 03 — Seudoaleatoriedad y modos]] — la que metió $1^{n}$, $\mathsf{negl}(n)$ y el par ordenado $\langle r, s\rangle$ en el vault
- [[teoria-de-la-informacion|Teoría de la información]] — $H$, $I$, $\eta$ y la traducción del secreto perfecto a bits
- [[guia-02-resolucion|Guía 2 — Resolución]] — el renombre $b \to \beta$ y los cálculos de $\Pr[\mathsf{PrivK}^{\mathsf{eav}}_{A,\Pi} = 1]$
- [[teoria-de-numeros|Teoría de números]] — la notación propia del manuscrito, con su diccionario
- [[indice#Convenciones|Convenciones del vault]] — nombres de archivo, frontmatter y links
- [[bibliografia|Bibliografía]] — Katz & Lindell, que es de donde salen $\mathsf{PrivK}$, $\mathsf{negl}$ y $1^{n}$
