---
title: Ataque de diccionario sobre hashes
resumen: 'Hashear un dato no lo esconde: como la función es pública y determinística, un dominio de entradas chico se enumera y se compara digest a digest, sin violar la resistencia a preimágenes, solo esquivándola.'
fuentes: ["[[guia-03-mac-y-funciones-de-hash]]", "[[resistencias-de-una-funcion-de-hash]]"]
aliases: [Ataque de diccionario sobre hashes, Ataque de diccionario, Enumeración del dominio, Dominio de baja entropía, Hasheo de contraseñas, Salt, Sal criptográfica, Pepper, Rainbow tables, Funciones de hash lentas, PBKDF2, bcrypt, scrypt, Argon2]
type: concepto
unidad: 1
clase: 3
orden: 15
created: 2026-08-31
updated: 2026-09-06
tags: [criptografia, hash, diccionario, contrasenas, salt, kdf, privacidad, guia-03, clase-03]
sources: ["raw/guias/guia3/Guia 3 - MAC y Funciones de Hash.pdf", "raw/clases/Clase 03pt2 - Transcripcion.VTT"]
---

# Ataque de diccionario sobre hashes

**Esta nota trae por qué hashear un dato no lo esconde.** Una función de hash es **pública** y **determinística**: no es un cifrado, no tiene clave, y no oculta nada por sí sola. Si el conjunto de entradas posibles es chico o adivinable, el atacante **no invierte el hash** — hashea el dominio entero y compara. Y la parte que hay que tener clarísima: **la [[resistencias-de-una-funcion-de-hash|resistencia a preimágenes]] no se viola, se esquiva.** La función sigue siendo tan fuerte como siempre y el dato se filtra igual.

> **Esto no sale de ninguna filmina, y ahora está verificado que tampoco salió de la voz.** Las notas de la [[funciones-de-hash-criptograficas|03.06]] a la [[ccm-y-gcm|03.14]] cubren filminas de la sesión del **03/09**; **ésta ni siquiera tiene filmina**. Sale del **Ejercicio 6 de la Guía 3** —la primera vez que el material de la cátedra pone el ataque en manos del alumno— y de lecturas propias, rotuladas una por una.
>
> Hasta el 04/09 quedaba abierta la conjetura de que la sesión del 03/09 desarrollara el tema, porque el docente había anunciado *Rainbow Tables* el 20/08. **La conjetura queda cerrada por verificación negativa:** sobre los **910 cues** de [esa transcripción](../../raw/clases/Clase%2003pt2%20-%20Transcripcion.VTT) hay **cero apariciones** de *rainbow*, *diccionario*, *precomputar*, *sal*, *contraseña* y *password* — el único acierto de `salt` es la palabra *"resaltarlo"* del cue pt2 799. El tema **no se dictó**, y este concepto sigue siendo aporte de la guía, no de la teoría.
>
> El único antecedente escrito es el párrafo de contraseñas de [[resistencias-de-una-funcion-de-hash#Qué ataque real cubre cada resistencia|03.07]], que esta nota desarrolla.

---

## La idea central

El hash es de una vía, pero **de una vía no quiere decir de una vía en las dos direcciones útiles**:

- **Invertir** $h$ —dado $y$, hallar cualquier $x$ con $h(x) = y$— es lo que las resistencias declaran inviable.
- **Reconocer** $x$ —dado $y$, decidir si un candidato $x_i$ que ya tengo es la preimagen— cuesta **una evaluación de $h$ y una comparación**.

Nadie prohíbe lo segundo, y no se puede prohibir: es la operación que hace falta para *usar* un hash. Verificar una contraseña es exactamente eso.

Entonces, si el atacante puede escribir el conjunto $D$ de todas las entradas plausibles, no necesita invertir nada:

$$\text{para cada } x_i \in D:\quad \text{si } h(x_i) = y \ \Longrightarrow\ x = x_i$$

**Eso es todo el ataque.** No usa ninguna debilidad de $h$; usa que $h$ es pública (nadie le impide evaluarla) y determinística (la misma entrada da siempre el mismo digest, que es justamente lo que la vuelve útil).

> **La ironía que ordena el tema** *(lectura nuestra).* En cifrado, ser determinístico es un defecto que se paga con la seguridad: *determinístico $\Rightarrow$ no `CPA`-Secure* → [[pruebas-de-indistinguibilidad#Propiedades de CPA|Propiedades de CPA]]. En un [[message-authentication-code|MAC]] es indiferente. En un hash es **obligatorio** — un hash que no fuera determinístico no serviría para nada. Y esa obligación es la que abre esta puerta: **la propiedad que vuelve útil a la función es la misma que la vuelve enumerable.**

## Por qué esto no viola la resistencia a preimágenes

Vale la pena escribirlo con los cuantificadores, porque acá es donde se confunde. La [[resistencias-de-una-funcion-de-hash#Las tres resistencias|resistencia a preimágenes]] dice, en la versión de Katz & Lindell:

> Dado $s$ y un $y$ **uniforme**, es inviable hallar $x$ con $H_s(x) = y$.

La palabra que hace todo el trabajo es **uniforme**. La garantía es sobre un digest de una entrada tomada al azar del espacio entero. En el Ejercicio 6 el $y$ que se ataca **no es uniforme ni de casualidad**: es el hash de una de diez cadenas conocidas. La hipótesis del teorema no se cumple, así que el teorema no dice nada del caso. No hay contradicción, hay **inaplicabilidad**.

| | Lo que garantiza el hash | Lo que hace el ataque |
|---|---|---|
| Entrada | uniforme sobre todo el dominio | una de $\lvert D\rvert$ cadenas conocidas |
| Operación | invertir $h$ | evaluar $h$ hacia adelante |
| Costo | $2^{L}$ | $\lvert D\rvert$ |
| Estado de la primitiva | intacta | **intacta** |

**La primitiva sale ilesa del ataque.** Ése es el punto entero de la nota: se puede filtrar el dato sin tocarle un pelo a la función de hash.

> **El respaldo de la cátedra, que llegó después de escrita esta nota.** Todo lo anterior estaba rotulado como lectura propia sobre los cuantificadores del libro. El **03/09** el docente dice lo mismo desde el otro lado, interrumpiendo la exposición de la jerarquía de resistencias para agregar una salvedad que no está en ninguna filmina: la resistencia a colisiones implica preimagen y segunda preimagen **asintóticamente**, no matemáticamente, y **falla en los casos borde** — *"si la entrada es muy chica, o si la cantidad de mensajes (…) [es] muy chica"* (cues pt2 471-478, desarrollado en [[seguridad-de-las-funciones-de-hash#La salvedad que rompe la jerarquía en dominios chicos|Seguridad de las funciones de hash]]).
>
> **Un dominio de diez cadenas es exactamente ese caso borde.** O sea que la lectura de esta nota deja de ser propia: la propia cátedra reconoce que la jerarquía de [[resistencias-de-una-funcion-de-hash|03.07]] vale donde el dominio es grande, y este ejercicio vive del otro lado de esa frontera. Lo que el docente deja *"fuera del conocimiento de la materia"* es justamente donde el Ej. 6 de la Guía 3 pone al alumno.

> **Y la conexión con la fuerza bruta clásica, que invierte un supuesto** *(lectura nuestra).* [[ataque-de-fuerza-bruta|Fuerza bruta]] enumera el **espacio de claves**; esto enumera el **espacio de mensajes plausibles**. Y hay una diferencia que juega a favor del atacante: en [[ataque-de-fuerza-bruta#La hipótesis oculta del ataque|la hipótesis oculta de la fuerza bruta]] hay que poder distinguir un descifrado válido de uno inválido, y eso exige redundancia y un test de plausibilidad que puede fallar. Acá **ese test es gratis y es exacto**: dos digests coinciden o no coinciden. El hash le regala al atacante el oráculo de verificación que en criptoanálisis clásico había que construir.

## El costo no es 2 elevado a la 160, es el tamaño del dominio

$$\text{costo del ataque} \;=\; \lvert D\rvert \cdot c_h$$

con $\lvert D\rvert$ la cantidad de entradas plausibles y $c_h$ el costo de una evaluación de $h$. **El largo de salida $L$ no aparece en la fórmula.** Puesto contra los números de [[seguridad-de-las-funciones-de-hash#Los tres objetivos del atacante|Seguridad de las funciones de hash]]:

| Qué se ataca | Costo |
|---|---|
| Preimagen genérica de `SHA-1` | $2^{160}$ |
| Colisión de `SHA-1`, por el cumpleaños | $2^{80}$ |
| SHAttered, la colisión real publicada en 2017 | $\approx 2^{63}$ |
| Un diccionario de contraseñas humanas | $\approx 10^{9} = 2^{30}$ |
| Un diccionario grande con reglas de mutación | $\approx 10^{12} = 2^{40}$ |
| **El Ejercicio 6: recuperar la nota de un alumno** | $\mathbf{10 \approx 2^{3{,}32}}$ |

Las últimas tres filas están **decenas de órdenes binarios por debajo** de las primeras. El dominio del Ejercicio 6 tiene $\log_2 10 \approx 3{,}3$ bits de entropía; la función que lo protege ofrece 160. **No importa: la protección que se ejerce es la del dato, no la de la función.**

> Es exactamente el patrón del [[ataque-de-fuerza-bruta#Principio de espacio de claves suficiente|principio de espacio de claves suficiente]], pero corrido de lugar: allá el problema era un $\lvert\mathcal{K}\rvert$ chico, acá es un $\lvert D\rvert$ chico. La moraleja se traduce sola — **un espacio de entradas grande es necesario y no suficiente**, y uno chico alcanza para hundirlo todo.

## El Ejercicio 6, hecho

El enunciado da ocho nombres con el hash `SHA-1` de la nota de cada uno, avisa que la nota se escribió como `X nota_en_letras` y que es un entero del 1 al 10. Con eso el dominio queda **completamente determinado: diez cadenas**. El ataque son diez llamadas a `openssl` y una comparación:

```
echo "7 siete" | openssl dgst -sha1
```

| Candidato | Preimagen | Digest, primeros 8 hex | Quién |
|---|---|---|---|
| 1 | `1 uno` | `86a76e03` | garcía |
| 2 | `2 dos` | `7c1dfd9e` | sanchez |
| 3 | `3 tres` | — | nadie |
| 4 | `4 cuatro` | — | nadie |
| 5 | `5 cinco` | `c2fa01c8` | rossi |
| 6 | `6 seis` | `164c22fd` | centurion |
| 7 | `7 siete` | `1daae848` | acuña |
| 8 | `8 ocho` | `135fc9d0` | hernandez |
| 9 | `9 nueve` | — | nadie |
| 10 | `10 diez` | `c736e546` | **palacios y zubeldia** |

**Cada preimagen lleva un salto de línea al final**, que es lo que `echo` agrega. Sin ese byte no coincide ninguna de las ocho y el ejercicio parece irresoluble — la trampa está desarmada en [[primitivas-de-hash-estandar#Los digests de ejemplo, verificados|Primitivas de hash estándar]] y las cuentas completas, alumno por alumno, en [[guia-03-mac-y-funciones-de-hash#Ejercicio 6|Guía 3, Ejercicio 6]].

**Y lo que hay que ver en la última fila.** `palacios` y `zubeldia` tienen **el mismo digest**, y eso **no es una colisión**: es la misma preimagen. Los dos se sacaron 10. Invocar una colisión de `SHA-1` acá sería absurdo — [[seguridad-de-las-funciones-de-hash#La consecuencia operativa: L bits de salida dan L/2 bits de seguridad|cuesta 2⁸⁰ por el cumpleaños]], y lo que tenemos delante costó diez evaluaciones.

## Hashes iguales delatan entradas iguales

Ésa es la **fuga estructural**, y es independiente de todo lo anterior: sobrevive aunque el atacante no consiga ni una sola preimagen.

Como $h$ es una función, $x = x' \Rightarrow h(x) = h(x')$. Publicar una tabla de digests es publicar la **partición del padrón en clases de equivalencia**: quién comparte valor con quién. En el Ejercicio 6 eso se lee sin descifrar nada —*"palacios y zubeldia se sacaron lo mismo"* es visible de un vistazo, antes de saber qué nota es—. En un padrón de contraseñas hasheadas sin sal, lo que se lee es **quiénes usan la misma contraseña**: un dato que no hace falta romper nada para obtener, y que a un atacante le sirve para priorizar a quién ataca primero.

> **El paralelo con ECB, y por qué es el mismo defecto** *(lectura nuestra; ninguna filmina los pone juntos).* [[modos-de-encadenamiento#Los cinco modos|ECB]] está prohibido porque bloques iguales dan criptogramas iguales y **el patrón de repeticiones del texto plano sobrevive intacto**. Un hash sin sal hace exactamente lo mismo con las filas de una tabla. Es el tercer eslabón de una cadena que el vault ya venía armando: la [[cifrado-de-sustitucion-monoalfabetica|sustitución monoalfabética]] cae porque preserva la igualdad entre letras, `ECB` porque la preserva entre bloques, y el hash pelado porque la preserva entre registros. **Cambia la escala del objeto, no el defecto: toda función determinística aplicada elemento por elemento filtra la relación de igualdad.**
>
> Y la solución tiene la misma forma en los tres casos: romper el determinismo metiendo un valor distinto por elemento. Lo que el [[cifrado-probabilistico-nonce-e-iv|IV]] es para `CBC`, **la sal es para el hash**.

## Contramedidas

La fórmula $\lvert D\rvert \cdot c_h$ tiene **dos factores**, y las contramedidas o atacan uno de ellos o le cambian la forma a la fórmula entera. Van las tres, con qué toca cada una: la **sal** no toca ninguno de los dos —le saca al atacante la **amortización** entre víctimas, que es lo que convierte $\lvert D\rvert$ en $n\cdot\lvert D\rvert$—; la **pimienta** le saca la capacidad misma de **evaluar** $h$, y por eso es la única que no vive dentro de la fórmula; la **función lenta** ataca $c_h$.

### Sal

Un valor **aleatorio y público**, distinto por registro, que se guarda al lado del digest: se almacena $h(\text{sal} \Vert x)$ junto con la sal. No es secreto y no pretende serlo.

*Qué ataca: la amortización entre víctimas.*

- **Qué compra:** rompe el ataque **en lote**. Sin sal, un atacante hashea el diccionario **una vez** y compara contra el padrón entero; con sal, el diccionario hay que rehacerlo **para cada víctima**. Contra $n$ registros el costo pasa de $\lvert D\rvert$ a $n \cdot \lvert D\rvert$. También tapa la fuga de la sección anterior: dos personas con la misma contraseña tienen digests distintos porque tienen sales distintas.
- **Qué NO compra:** **nada contra un objetivo individual con dominio chico.** La sal es pública, el atacante la lee y rehace las diez cuentas. Para el Ejercicio 6, salar no cambia absolutamente nada.

> **Sobre la palabra.** Es la única de esta nota que la cátedra pronunció: el 20/08 el docente enumera los nombres de la mitad pública de la semilla —*"se llama vector de inicialización, o se llama nonce. Se llama SALT, etcétera"*— ver [[cifrado-probabilistico-nonce-e-iv#Los tres nombres de la semilla pública|Cifrado probabilístico § Los tres nombres]]. Es el mismo término, y el propósito de fondo también es el mismo —que la misma entrada no dé siempre la misma salida—, pero **el rol es distinto**: la sal de contraseñas no siembra ningún generador, está para que el trabajo no se amortice entre víctimas. *(Precisión nuestra.)*

### Pimienta

Un valor **secreto**, igual para todo el sistema, guardado **fuera de la base** —en la configuración de la aplicación o en un módulo de hardware—. Se hashea $h(\text{pimienta} \Vert \text{sal} \Vert x)$.

*Qué ataca: la capacidad de evaluar $h$ — o sea la fórmula entera, no uno de sus factores.*

Qué compra: si se filtra la base pero **no** el secreto, el atacante no puede evaluar la función y el ataque de diccionario muere en la puerta. **Es la única contramedida cuyo efecto no depende de $\lvert D\rvert$**: sin el secreto, diez candidatos son tan inatacables como diez mil millones. Qué se paga: es una clave más para custodiar y rotar, y si se filtra junto con la base no aportó nada.

> Visto de cerca, **la pimienta convierte al hash en algo con clave, o sea en un [[message-authentication-code|MAC]]** — y por eso la construcción correcta no es concatenar a mano sino usar [[hmac|HMAC]], que es lo que existe para eso. Concatenar el secreto adelante es exactamente el $H(k \Vert m)$ que el *length extension attack* rompe → [[construccion-de-merkle-damgard|Merkle-Damgård]]. *(Lectura nuestra.)*

### Funciones deliberadamente lentas

`PBKDF2`, `bcrypt`, `scrypt` y `Argon2` no son funciones de hash: son **funciones de derivación de clave** construidas sobre ellas, con un parámetro de costo que se sube a mano. `PBKDF2` itera [[hmac#HMAC en la práctica|HMAC]] decenas o cientos de miles de veces; `scrypt` y `Argon2` agregan **costo de memoria**, que es lo que le saca la ventaja a las GPU y a los ASIC.

*Qué ataca: el factor $c_h$.*

La sal multiplica el trabajo por la cantidad de víctimas; ésta multiplica el costo por intento. Es por lo tanto **la única de las dos contramedidas sin clave que mueve la aguja cuando el dominio es chico** — y aun así sólo **sube el costo, no cierra la puerta**.

### Y para el Ejercicio 6, la conclusión incómoda

Con $\lvert D\rvert = 10$, **ninguna de las dos contramedidas sin clave —sal y KDF— alcanza**. Hagamos la cuenta *(lectura nuestra)*: `Argon2` configurado con los parámetros que se recomiendan para un servidor tarda del orden de **medio segundo** por evaluación. Diez candidatos por medio segundo son **cinco segundos**. La KDF más cara que existe, bien configurada, compra **cinco segundos** contra un dominio de diez elementos.

> **No hay defensa criptográfica sin clave para un dominio de diez.** Cualquier función **pública y determinística** se enumera: se puede subir el costo por intento arbitrariamente y el atacante lo paga, porque **paga diez veces**. La defensa criptográfica que **sí** funciona es meter un secreto —la [[#Pimienta|pimienta]] de dos secciones más arriba, o directamente $\mathsf{HMAC}_k(\text{nota})$ con $k$ custodiada fuera de la base—, y eso ya no es hashear sino [[message-authentication-code|autenticar con clave]]: sin $k$ el atacante no puede hacer ni una de las diez cuentas, así que el ataque deja de depender de $\lvert D\rvert$. Lo que se paga es el problema nuevo de custodiar y rotar esa clave, y que si se filtra junto con la base no aportó nada. Y la defensa **no criptográfica**, que para el Ejercicio 6 es la que corresponde, es **no publicar los hashes**: las notas son un dato personal, y lo que el ejercicio muestra no es una falla de `SHA-1` sino que publicar el digest de un dato de baja entropía **es publicar el dato**. Con un rodeo de diez cuentas.
>
> La regla que queda, y sirve para leer cualquier sistema *(síntesis nuestra)*: **la KDF sube el piso, no cierra la puerta.** Sirve contra contraseñas —donde el dominio es enorme aunque esté sesgado— y no sirve contra un DNI, una fecha de nacimiento, un número de teléfono, una nota del 1 al 10 ni ningún otro dato enumerable. Para esos, hashear **sin clave** es teatro.

## Rainbow tables, en una línea

Son **tablas precomputadas** que, en vez de guardar pares $(x, h(x))$ sueltos, guardan sólo los **extremos** de cadenas de hash-y-reducción de largo $t$. Así el almacenamiento baja por un factor $t$, y se paga con una consulta que ya no es una búsqueda directa sino del orden de $t^{2}$ evaluaciones: es un **trade-off tiempo-memoria**, y lo que la rainbow table sacrifica es justamente la consulta barata de la tabla plana. Lo que sí se conserva es lo que las vuelve peligrosas: **el barrido del diccionario se paga una sola vez y la misma tabla se reutiliza contra todas las víctimas**.

**Y ahí está por qué la sal las mata:** una tabla precomputada sólo sirve para la función que se precomputó, y con sal hay una función distinta por registro. Precomputar todas las tablas cuesta $\lvert D\rvert$ multiplicado por la cantidad de sales posibles — con una sal de 128 bits eso no existe. *(La única mención de estas tablas en todo el vault sigue siendo la del docente el 20/08, anunciándolas para la Clase 3 → [[des-y-3des#3-DES|DES y 3-DES]]. **La Clase 3 se dictó entera y nunca llegaron**: cero apariciones en los 873 cues del 27/08 y en los 910 del 03/09. Queda como tema anunciado y no dado.)*

## SHA-1 acá no está roto: lo que falla es el diseño del sistema

Es la lección que hay que llevarse del ejercicio, y va contra el reflejo. `SHA-1` **está quebrada** —para colisiones, desde SHAttered en 2017, ver [[primitivas-de-hash-estandar#SHA-1|03.09]]— pero **eso no tiene nada que ver con lo que pasa acá**. En el Ejercicio 6 no hay ninguna colisión, ninguna preimagen invertida, ningún atajo. `SHA-1` hizo su trabajo perfectamente.

**Y la prueba es que reemplazarla no arregla nada.** Con `SHA3-512` en lugar de `SHA-1`, el ataque son las mismas diez evaluaciones y el mismo resultado. Cambiar la primitiva por una más fuerte **no mueve la aguja**, porque la primitiva nunca fue el problema.

> Es la misma lección que [[eleccion-de-primitivas#El escrutinio ayuda, pero no es una garantía|Elección de primitivas]] saca del bug de `OpenSSL` en Debian: ahí el algoritmo y el modo estaban bien, y el sistema falló en **cómo se sembraba la clave** —menos entropía en la semilla, menos claves alcanzables—. Acá el algoritmo está bien y el sistema falla en **cuánta entropía tiene el dato que se hashea**. *(Lectura nuestra: el paralelo es del vault, no de la cátedra.)* En los dos casos la vulnerabilidad vive en el espacio de entradas, que es justamente donde nadie mira cuando la pregunta es *"¿qué algoritmo usas?"*.
>
> Con el vocabulario de [[estado-de-un-criptosistema#Los tres estados|Estado de un criptosistema]]: **el sistema del Ejercicio 6 está quebrado con `SHA-1` sana.** Las dos afirmaciones son compatibles y hay que poder sostener las dos a la vez.

## Dónde reaparece en el curso

El [[programa-y-objetivos#Herramientas que se usan|programa]] lista **John The Ripper** *(cracking de passwords)* entre las herramientas de la materia, junto a `OpenSSL`, `JCE` y el compilador. Es, literalmente, una herramienta de ataque de diccionario: toma un archivo de hashes, un diccionario y un conjunto de reglas de mutación, y hace a escala industrial las diez cuentas del Ejercicio 6.

**Lo que el programa no dice es cuándo.** A `OpenSSL` y a `JCE` los ubica en la **Guía 5**; a John The Ripper lo nombra **sin asignarle unidad, clase ni guía**. No hay ninguna otra mención en todo el material de la cátedra que hay en el vault, así que **no se sabe** en qué momento del curso aparece — el Bloque 2 (Seguridad, clases 6 a 11) es lo razonable, pero eso ya sería inventar. Cuando salga el material que lo ubique, se completa acá.
