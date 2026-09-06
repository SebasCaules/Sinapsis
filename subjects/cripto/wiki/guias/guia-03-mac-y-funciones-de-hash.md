---
title: Guía 3 — MAC y Funciones de Hash
resumen: 'Los seis enunciados de la Guía 3, sobre MACs inseguros, CBC-MAC, las tres resistencias y digests con OpenSSL, cada uno con el concepto que lo destraba y el enlace a su resolución.'
fuentes: ["[[clase-03-macs-y-cifrado-autenticado]]", "[[practica-04-macs-hash-y-cifrado-autenticado]]"]
aliases: [Guía 3, Guia 3, MAC y Funciones de Hash]
type: guia
clase: 3
orden: 21
guia: 3
fecha: 2026-09-07
created: 2026-08-31
updated: 2026-09-04
tags: [guia, mac, cbc-mac, funciones-de-hash, merkle-damgard, colisiones, md5, sha-1, openssl]
sources: ["raw/guias/guia3/Guia 3 - MAC y Funciones de Hash.pdf"]
---

# Guía 3 — MAC y Funciones de Hash

> **lun 07/09/2026** · [Enunciado](../../raw/guias/guia3/Guia%203%20-%20MAC%20y%20Funciones%20de%20Hash.pdf) · Teoría: [[clase-03-macs-y-cifrado-autenticado|Clase 03 — MACs y cifrado autenticado]]
> **Resolución:** [[guia-03-resolucion|Guía 3 — Resolución]] — los **6 ejercicios**.

Esta nota reúne **los enunciados de la Guía 3 transcriptos**, con el concepto que destraba cada uno y el link directo a dónde está la cuenta hecha. Lo que se pide, no cómo se resuelve: el desarrollo vive en la [[guia-03-resolucion|resolución]].

> **La guía es la del año pasado** *(lectura nuestra: el PDF sólo dice 2025).* El encabezado dice **2025** en las dos páginas, y es la **única de las tres guías que hay en `raw/`** con esa marca: la [Guía 1](../../raw/guias/guia1/Guia%201%20-%20Criptograf%C3%ADa%20Cl%C3%A1sica.pdf) —enunciado y [soluciones](../../raw/guias/guia1/Guia%201%20-%20Criptograf%C3%ADa%20Cl%C3%A1sica%20-%20Soluciones.pdf)— y la [Guía 2](../../raw/guias/guia2/Guia%202%20-%20Criptograf%C3%ADa%20Sim%C3%A9trica.pdf) dicen **2026**. *(Verificado sobre los encabezados de los cuatro PDFs.)* De ahí que el enunciado del Ej. 5 esté escrito contra una versión de OpenSSL que ya no es la que vas a tener instalada (ver más abajo).

---

## Cómo leer esta guía

### El Ejercicio 1 ya viene resuelto de la teoría

Los tres MACs del Ej. 1 son **exactamente** los tres de la **filmina 17** de la [[clase-03-macs-y-cifrado-autenticado#9. Ejercicio: tres MACs candidatos|Clase 03]] — misma notación, mismo orden, incluidas las barras de $\lvert m\rvert$ en el tercero. La cátedra los derribó **uno por uno en el aula el 27/08**, y el vault los tiene escritos de punta a punta en [[seguridad-de-un-mac#El ejercicio de los tres MACs|Seguridad de un MAC]], con la transcripción de la clase y todo. O sea que el ejercicio que abre la guía **ya está hecho antes de empezar**.

Es el mismo fenómeno que el [[guia-02-criptografia-simetrica#Ejercicio 5|Ej. 5 de la Guía 2]], que repetía textualmente el [[guia-01-criptografia-clasica#Ejercicio 8|Ej. 8 de la Guía 1]]. La diferencia es de dónde viene la repetición: allá la guía repetía a otra guía, acá **la guía repite a la teoría**. *(Que la cátedra lo haga a propósito es lectura nuestra: la guía no avisa que el ejercicio ya se resolvió en clase.)*

### El reparto contra las dos sesiones de la Clase 03

La Clase 03 se dicta en **dos jueves** —27/08 y 03/09— y la guía cruza el corte por el medio. Con el corte medido en el [[cronograma]] (27/08 = filminas 1-21, 03/09 = filminas 22-41), los seis ejercicios se reparten así:

| Ejercicios | De qué sesión sale | Estado al 31/08 |
|---|---|---|
| 1 · 4a, 4b, 4c | **27/08** — MACs, `Mac-Forge`, [[cbc-mac\|CBC-MAC]] (filminas 13-21) | **dictada**, con transcripción |
| 2 · 3 · 4d · 5 · 6 | **03/09** — funciones de hash, Merkle-Damgård, `MD5`/`SHA`, colisiones (filminas 22-41) | **todavía no dictada** |

> **Qué dice esa columna** *(precisión nuestra).* Indica de qué sesión sale **la teoría que hace falta para atacar cada ejercicio**, no que exista una filmina que plantee el ejercicio. Los **Ej. 2 y 6 no tienen filmina propia**: el 2 se apoya en las nociones de colisión y de *hash-and-MAC* del 03/09, y el 6 en un tema que **ninguna filmina desarrolla** — ver [[ataque-de-diccionario-sobre-hashes|Ataque de diccionario sobre hashes]].

> **Corolario: la guía es practicable entera recién después del 03/09** *(lectura nuestra)* — **y esa fecha ya pasó**. Cinco de los seis ejercicios, y hasta el punto (d) del que parece de MACs, dependen de las filminas 22 a 41, que se dictaron el **jueves 03/09**; la guía se practica el **lunes 07/09**, o sea que el orden alcanza justo. Las notas de concepto que cubren ese tramo ya no dependen sólo del PDF: están escritas contra la [transcripción de esa sesión](../../raw/clases/Clase%2003pt2%20-%20Transcripcion.VTT), volcada en las [[clase-03-macs-y-cifrado-autenticado#12. La segunda sesión: cómo retoma el 03/09|§12 a §25 de la Clase 03]]. Lo único que se podía hacer **antes** del 03/09 era el Ej. 1 —que ya venía resuelto de la filmina 17— y los tres primeros puntos del Ej. 4.
>
> Y hay una fuente más, que llegó **antes** que la teoría: la [[practica-04-macs-hash-y-cifrado-autenticado|Práctica 04]] del **lunes 31/08** cubrió hash, `NMAC`, `HMAC` y cifrado autenticado **tres días antes** de que la teoría los diera. Quien haya ido a esa práctica podía atacar la guía entera desde el 31/08.

### La primera guía que se hace con la computadora encendida

Las Guías 1 y 2 eran de lápiz y papel: descifrar a mano, contar frecuencias, calcular probabilidades, correr `CBC` sobre cinco bloques. Ésta cambia de registro. El **Ej. 2b pide implementar** el algoritmo, y los **Ej. 5 y 6 son directamente de consola** — uno calcula digests con `openssl dgst`, el otro es una búsqueda por enumeración sobre un espacio de preimágenes chico. Tres de seis ejercicios no se resuelven sin máquina.

> **Y eso llega antes de lo que el propio cronograma anuncia** *(precisión nuestra)*. El [[programa-y-objetivos|programa]] lista `OpenSSL` entre las herramientas de la materia y lo ubica en la **Guía 5**; el [[cronograma]] pone esa guía —*"OpenSSL y JCE"*— el **28/09**. Pero la Guía 3 ya lo exige el **07/09**, tres semanas antes y sin ninguna introducción previa. O lo das por sabido, o lo aprendés acá.

### Erratas del PDF

| Dónde | Dice | Debería decir |
|---|---|---|
| Ej. 4d | *"Transformación de **Merkle-Darmgard**"* | **Merkle-Damgård** — por Ralph **Merkle** e Ivan **Damgård**. Están permutadas las letras del apellido (*Darmgard* por *Damgard*) y falta la `å`. **Verificado sobre la página renderizada**: está así en el PDF, no es un artefacto de la extracción de texto. Ver [[construccion-de-merkle-damgard\|Construcción de Merkle-Damgård]] |

### Lo que la guía no trae

La [[clase-03-macs-y-cifrado-autenticado#Cabos sueltos|nota de la Clase 03]] dejó anotado, cuando la guía todavía no estaba en `raw/`, que el ejercicio de la filmina 38 —*"esquematizar un cifrado utilizando AES-CCM"*— *"probablemente caiga en la Guía 3"*. **Con el enunciado a la vista, esa conjetura queda refutada:** no está. Tampoco está el **ataque al sufijo del `CBC-MAC`** de la filmina 21, que es la única tarea que el docente dejó explícitamente el 27/08.

Los dos siguen siendo material a hacer —el de `AES-CCM` está resuelto en [[ccm-y-gcm|CCM y GCM]], el del sufijo en [[cbc-mac#Por qué la longitud como sufijo no sirve|CBC-MAC]]— pero **no los pide esta guía**. Lo más cerca que llega del tema es el Ej. 4c, que pregunta por las opciones seguras de uso de `CBC-MAC`. Tampoco aparecen `HMAC`, `GCM` ni el cifrado autenticado: **de las filminas 36 a 41 la guía no toma nada**.

---

## Tablero de estado

Los **seis** ejercicios están resueltos en la [[guia-03-resolucion|nota de resolución]]; la columna *Estado* linkea a cada uno.

| # | Tema | Concepto que aplica | Estado |
|---|---|---|---|
| 1 | Tres MACs candidatos, los tres inseguros | [[seguridad-de-un-mac\|Seguridad de un MAC]] · [[message-authentication-code\|Message Authentication Code]] · [[generador-pseudoaleatorio\|Generador pseudoaleatorio]] | [[guia-03-resolucion#Ejercicio 1\|resuelto]] |
| 2 | MAC sobre el XOR de los bloques: fabricar dos mensajes con la misma etiqueta | [[resistencias-de-una-funcion-de-hash\|Resistencias de una función de hash]] · [[hmac\|HMAC]] · [[seguridad-de-un-mac\|Seguridad de un MAC]] | [[guia-03-resolucion#Ejercicio 2\|resuelto con código]] |
| 3 | Un hash de juguete contra las tres resistencias, y su probabilidad de colisión | [[funciones-de-hash-criptograficas\|Funciones de hash criptográficas]] · [[resistencias-de-una-funcion-de-hash\|Resistencias]] | [[guia-03-resolucion#Ejercicio 3\|resuelto]] |
| 4 | CBC-MAC descripto, comparado con el modo CBC, y Merkle-Damgård | [[cbc-mac\|CBC-MAC]] · [[modos-de-encadenamiento\|Modos de encadenamiento]] · [[construccion-de-merkle-damgard\|Merkle-Damgård]] | [[guia-03-resolucion#Ejercicio 4\|lectura de teoría]] |
| 5 | MD5 y SHA-1 sobre la misma frase, con OpenSSL | [[primitivas-de-hash-estandar\|Primitivas de hash estándar]] · [[seguridad-de-las-funciones-de-hash\|Seguridad de las funciones de hash]] | [[guia-03-resolucion#Ejercicio 5\|resuelto]] |
| 6 | Recuperar 8 notas a partir de sus digests SHA-1 | [[ataque-de-diccionario-sobre-hashes\|Ataque de diccionario sobre hashes]] · [[resistencias-de-una-funcion-de-hash\|Resistencias]] · [[ataque-de-fuerza-bruta\|Fuerza bruta]] · [[primitivas-de-hash-estandar\|Primitivas de hash estándar]] | [[guia-03-resolucion#Ejercicio 6\|resuelto]] |

---

## Enunciados

### Ejercicio 1

Analizar **por qué no poseen seguridad** los siguientes MAC:

1. $\mathsf{Mac}_k(m) = G(k) \oplus m$, donde $G(x)$ es un generador seudoaleatorio.
2. $\mathsf{Mac}_k(m) = k \oplus \mathsf{first\_k\_bits}(m)$
3. $\mathsf{Mac}_k(m) = \mathsf{Enc}_k(\lvert m\rvert)$

> **Los tres están resueltos en el vault antes de que la guía los pida.** Son literalmente los de la filmina 17: [[seguridad-de-un-mac#El ejercicio de los tres MACs|Seguridad de un MAC § El ejercicio de los tres MACs]] los desarma uno por uno, con la transcripción del 27/08 y la tabla que los cierra. Antes de leerla, intentalos: el molde de la respuesta es siempre el mismo —**exhibir un adversario que gana [[seguridad-de-un-mac#El experimento Mac-Forge|Mac-Forge]]**, o sea que emite un par $(m,t)$ válido con $m$ fuera del conjunto $Q$ de consultas.
>
> **Reconstrucción de la extracción:** el $\oplus$ de (1) y (2) y las barras de $\lvert m\rvert$ en (3) se pierden en `pdftotext`; están **verificados sobre la página renderizada**. El $G$ de (1) es el [[generador-pseudoaleatorio|generador pseudoaleatorio]] de la Clase 02 y el `Enc` de (3) es un criptosistema cualquiera, no un MAC. El nombre `first_k_bits` está literal en el PDF, con guiones bajos.
>
> Ojo con el (3): la etiqueta **no depende del contenido del mensaje**, sólo de su longitud. Y ojo con el reflejo de *"es determinístico, entonces es inseguro"* — para un MAC eso **no** es un defecto, al revés de lo que pasa en cifrado; está explicado en [[message-authentication-code#Un MAC determinístico no es un problema|Message Authentication Code § Un MAC determinístico no es un problema]].

### Ejercicio 2

Considerar el siguiente algoritmo de código de autenticación de mensaje (MAC):

1. El mensaje $m$ es dividido en **bloques de 128 bits** cada uno (completando con bits en cero si es necesario).
2. Se efectúa un **XOR entre todos los bloques**, obteniendo un único bloque de resultado $R$ de 128 bits. La función MAC se aplica luego al bloque $R$, en lugar de aplicarse a $m$.

**a)** Describir por lo menos **una manera** de encontrar dos mensajes $m \ne m'$ tales que los mensajes, aún con diferentes significados, tienen el **mismo valor de MAC**.

**b)** **Implementar** el algoritmo y probarlo para la situación propuesta en (a).

> El enunciado nunca dice **qué** función MAC se aplica al final, y no hace falta: el ataque no la toca. Lo que hay que ver es que el paso 2 es una **función de compresión propia**, $m \mapsto R$, y que el esquema entero es el paradigma [[hmac#HMAC es el paradigma hash-and-MAC|hash-and-MAC]] —etiquetar el resumen en vez del mensaje—, sólo que con un resumen fabricado a mano. La consecuencia es la de siempre: si dos mensajes comprimen al mismo $R$, tienen la misma etiqueta **cualquiera sea el MAC**, y eso ya gana [[seguridad-de-un-mac#El experimento Mac-Forge|Mac-Forge]]. *(Que el esquema sea hash-and-MAC es lectura nuestra; la guía no lo nombra.)*
>
> La pregunta operativa, entonces, es **cuánto cuesta encontrar una colisión del XOR de bloques**, no del MAC. Ver [[resistencias-de-una-funcion-de-hash#Las colisiones existen siempre|Resistencias de una función de hash § Las colisiones existen siempre]] y el pedido del enunciado de que los dos mensajes tengan *"diferentes significados"*: no alcanza con una colisión cualquiera, tiene que ser **una que sirva para un ataque**.
>
> El (b) es el único punto de toda la guía que pide **escribir código**. El enunciado no fija lenguaje ni entrega.

### Ejercicio 3

Considerar la siguiente función de hash $h()$:

- La función acepta mensajes de **cualquier longitud**.
- La función retorna una cadena de bits de **32 ceros** si la entrada tiene un número **par** de caracteres, y retorna una cadena de bits de **32 unos** si la entrada tiene un número **impar** de caracteres.

**a)** ¿Es esta una **función de hash válida para criptografía**? Analizar los **tres niveles de seguridad**.

**b)** ¿Cuál es la **probabilidad** de que dos entradas $x_1$ y $x_2$ elegidas aleatoriamente **colisionen** en $h()$?

> **"Los tres niveles de seguridad" son las [[resistencias-de-una-funcion-de-hash#Las tres resistencias|tres resistencias]]** —preimagen, segunda preimagen y colisión—; la guía usa una expresión y las filminas otra. *(La equivalencia es precisión nuestra.)* El ejercicio se contesta recorriéndolas en orden y viendo qué pasa con cada una, no con una respuesta global.
>
> Es la contracara exacta del Ej. 6: allá el hash es real y hay que enumerar el dominio; acá el hash es de juguete y **la imagen tiene dos elementos**. Sirve para ver, en el caso más extremo posible, por qué [[resistencias-de-una-funcion-de-hash#Las colisiones existen siempre|las colisiones existen siempre]] y por qué eso solo no es el problema — lo que importa es **cuánto cuesta encontrarlas**. Ver también qué se le pide a una función de hash para serlo, en [[funciones-de-hash-criptograficas#Definición|Funciones de hash criptográficas § Definición]].
>
> En el (b), *"elegidas aleatoriamente"* no dice sobre qué distribución. Es un supuesto que hay que declarar antes de contestar. *(Precisión nuestra: el enunciado no lo fija.)*

### Ejercicio 4

*(lectura de teoría)*

**a)** Describir la construcción **CBC-MAC** e indicar **para qué sirve**.

**b)** Comparar **CBC-MAC** con **CBC-mode** para encripción.

**c)** ¿Cuáles son, **según Katz**, las **opciones seguras** de uso de CBC-MAC?

**d)** ¿Para qué sirve la *"Transformación de Merkle-Darmgard"*? — **`Merkle-Damgård`**, ver [[#Erratas del PDF|erratas]].

> Los cuatro puntos tienen su sección en el vault, y las tres primeras salen de la sesión **ya dictada**: [[cbc-mac#La construcción|La construcción]] para el (a), [[cbc-mac#En qué se parece al modo CBC, y en qué no|En qué se parece al modo CBC, y en qué no]] para el (b) —donde lo que más pesa es lo que `CBC-MAC` **no** tiene: ni IV, ni publicación de estados intermedios— y [[cbc-mac#Las tres extensiones seguras|Las tres extensiones seguras]] para el (c). El (d) cae del otro lado del corte, en la filmina 29: [[construccion-de-merkle-damgard#El problema que resuelve|El problema que resuelve]].
>
> **El "según Katz" del (c) es literal y hay que tomarlo en serio:** el enunciado remite a [[bibliografia|Katz & Lindell]], capítulo 4, que es la lectura designada de esta clase. Son tres opciones, no una recomendación suelta.
>
> Un ejercicio de redacción, no de cuenta — pero es el que más directamente se parece a una pregunta de parcial.

### Ejercicio 5

**Rutinas de Hashing en OpenSSL.** Con el comando `dgst` se puede obtener el **hash** (digesto o resumen) de un mensaje. Luego se puede usar, entre otras cosas, para **firma digital**.

```
openssl dgst [-sha|-sha1|-mdc2|-ripemd160|-sha224|-sha256|-sha384|-
sha512|-md2|-md4|-md5|-dss1] [-c] [-d] [-hex] [-binary] [-r] [-non-fips-
allow] [-out filename] [-sign filename] [-keyform arg] [-passin arg] [-
verify filename] [-prverify filename] [-signature filename] [-hmac key]
[-non-fips-allow] [-fips-fingerprint] [file...]
```

**a)** Calcular el hash **MD5** de una frase (por ejemplo *"hoy es el primer lunes de abril"*).

**b)** Calcular el hash **SHA-1** de la misma frase.

**c)** ¿Qué **diferencias** se observan?

> **La sinopsis está copiada literal del PDF, cortes de línea incluidos, y está vieja** *(precisión nuestra)*. Es la de **OpenSSL 1.0.x**: los flags `-dss1`, `-md2` y `-mdc2` no existen en OpenSSL 3.x, y `-non-fips-allow` y `-fips-fingerprint` tampoco. Si copiás la línea tal cual te va a fallar; `-md5` y `-sha1` sí siguen andando.
>
> **La trampa práctica es el salto de línea.** `echo "frase" | openssl dgst -md5` hashea la frase **más un `\n` final**, y `printf '%s' "frase"` no. Son digests distintos y el enunciado no dice cuál quiere. La distinción está documentada en [[primitivas-de-hash-estandar#Los digests de ejemplo, verificados|Primitivas de hash estándar § Los digests de ejemplo, verificados]], y es la misma que vuelve a morder en el Ej. 6.
>
> El (c) es la parte con contenido. Las diferencias no son sólo de longitud: [[primitivas-de-hash-estandar#MD5|MD5]] y [[primitivas-de-hash-estandar#SHA-1|SHA-1]] tienen salidas de 128 y 160 bits, y de ahí sale —vía la [[seguridad-de-las-funciones-de-hash#Por qué la raíz cuadrada: la paradoja del cumpleaños|paradoja del cumpleaños]]— una diferencia de **bits de seguridad**, no de bits de salida: ver [[seguridad-de-las-funciones-de-hash#La consecuencia operativa: L bits de salida dan L/2 bits de seguridad|L bits de salida dan L/2 bits de seguridad]]. Y hay una tercera diferencia que el enunciado de 2025 no contempla y conviene decir igual: **las dos están quebradas**.

### Ejercicio 6

Se tienen los **nombres de alumnos y el hash de sus notas**. Decir **cuál es la nota de cada alumno**. Tener en cuenta que la nota se colocó **en números y en letras**, en la forma `X nota_en_letras` (por ejemplo, `3 tres`). Las notas son **valores enteros, del 1 al 10**. Se usó el algoritmo **SHA1**:

| alumno | hash SHA-1 |
|---|---|
| acuña | `1daae8480ce1df09603d3db5388b900e8ce4b880` |
| centurion | `164c22fd426d4215fc47d38964de80100a24f5ff` |
| hernandez | `135fc9d048e923597cc806a51ebdcb1ccac553bf` |
| palacios | `c736e54648efc18698499026ba1779e7785378a2` |
| rossi | `c2fa01c8fdf749547317e985625f2512b2c4e0a6` |
| sanchez | `7c1dfd9e7a101bc419752f623aa2c09352cac070` |
| garcía | `86a76e0399c99c1d5b8c8751b7d5240b24b271f3` |
| zubeldia | `c736e54648efc18698499026ba1779e7785378a2` |

> **Los 8 digests están transcriptos literalmente del PDF** y verificados carácter por carácter contra la página renderizada. Los dos puntos y la tabulación del original se reemplazaron por la tabla; nada más se tocó.
>
> **El ejercicio no pide invertir `SHA-1`.** El enunciado te regala el formato exacto de la preimagen y el rango de las notas, así que **el dominio tiene diez elementos** y se recorre entero en un renglón de consola. Es un [[ataque-de-fuerza-bruta|ataque de fuerza bruta]] sobre un espacio ridículamente chico, no un ataque de [[resistencias-de-una-funcion-de-hash#Las tres resistencias|preimagen]] — que costaría $2^{160}$. Que el hash sea **público y determinístico** es exactamente lo que lo hace posible.
>
> **Antes de correr nada, conviene revisar bien la tabla:** hay **dos filas con el mismo digest**. Vale la pena decidir qué significa eso *antes* de resolver, porque el reflejo automático —*"dos hashes iguales, entonces es una colisión"*— es el error que este ejercicio está diseñado para provocar. Comparar con lo que cuesta de verdad una colisión de `SHA-1` en [[seguridad-de-las-funciones-de-hash|Seguridad de las funciones de hash]].
>
> Y vuelve la trampa del Ej. 5: **el `\n` es parte de la preimagen o no lo es**, y de eso depende que encuentres las notas o no encuentres ninguna. Ver [[primitivas-de-hash-estandar#Los digests de ejemplo, verificados|Los digests de ejemplo, verificados]].
>
> Nota al margen: `acuña` y `garcía` llevan `ñ` y tilde en el **nombre**, pero **el nombre no se hashea** — sólo la nota. La codificación del nombre no entra en la cuenta.

---

## Ver también

- [[guia-03-resolucion|Guía 3 — Resolución]] — los seis ejercicios desarrollados
- [[clase-03-macs-y-cifrado-autenticado|Clase 03 — MACs y cifrado autenticado]] — la teoría del 27/08 y del 03/09, que es la que esta guía practica
- [[seguridad-de-un-mac|Seguridad de un MAC]] — **el Ej. 1 resuelto**, tal como lo dio la cátedra en clase
- [[cbc-mac|CBC-MAC]] — los puntos (a), (b) y (c) del Ej. 4
- [[ataque-de-diccionario-sobre-hashes|Ataque de diccionario sobre hashes]] — el concepto que el Ej. 6 introduce y **ninguna filmina desarrolla**: por qué hashear un dato de baja entropía no lo protege
- [[resistencias-de-una-funcion-de-hash|Resistencias de una función de hash]] · [[construccion-de-merkle-damgard|Construcción de Merkle-Damgård]] · [[primitivas-de-hash-estandar|Primitivas de hash estándar]] · [[seguridad-de-las-funciones-de-hash|Seguridad de las funciones de hash]] — el bloque del 03/09, que es de donde sale el resto de la guía
- [[guia-02-criptografia-simetrica|Guía 2 — Criptografía Simétrica]] — la guía anterior, y el precedente del ejercicio repetido
- [[cronograma|Cronograma]] · [[programa-y-objetivos|Programa y objetivos]] — dónde cae esta guía y dónde estaba anunciado OpenSSL
- [[bibliografia|Bibliografía]] — Katz & Lindell, capítulo 4, que es lo que cita el Ej. 4c
