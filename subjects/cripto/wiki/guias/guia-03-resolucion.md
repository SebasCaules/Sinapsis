---
title: Guía 3 — Resolución
resumen: 'Los seis ejercicios de la Guía 3 resueltos con el razonamiento completo y no sólo el resultado, con la salida real pegada en los tres que se corren en la terminal.'
fuentes: ["[[guia-03-mac-y-funciones-de-hash]]", "[[clase-03-macs-y-cifrado-autenticado]]"]
aliases: [Resolución Guía 3, Guia 3 resolucion, Soluciones Guía 3]
type: resolucion
clase: 3
orden: 22
guia: 3
created: 2026-08-31
updated: 2026-09-04
tags: [guia, resolucion, mac, hash, cbc-mac, merkle-damgard, sha-1, md5, openssl, colisiones, diccionario]
sources: ["raw/guias/guia3/Guia 3 - MAC y Funciones de Hash.pdf", "raw/guias/guia3/G3-Ej2-xor-mac.py", "Clase 03 - Criptografia - MACs y Cifrado Autenticado.pdf", "Clase 03pt1-Transcripcion.VTT"]
---

# Guía 3 — Resolución

> [[guia-03-mac-y-funciones-de-hash|Enunciados]] · [PDF de la cátedra](../../raw/guias/guia3/Guia%203%20-%20MAC%20y%20Funciones%20de%20Hash.pdf) · [Script del Ej. 2](../../raw/guias/guia3/G3-Ej2-xor-mac.py) · Teoría que la cubre: [[clase-03-macs-y-cifrado-autenticado|Clase 03 — MACs y cifrado autenticado]]

Esta nota reúne **las cuentas hechas de la Guía 3**, con el razonamiento completo y no sólo el resultado. Los seis ejercicios están resueltos de punta a punta, y los tres que se corren en la terminal —el MAC sobre el XOR, los digests de OpenSSL y las notas hasheadas— están **corridos de verdad, con la salida pegada**.

La guía tiene una forma clara: **los Ej. 1 y 2 son MACs, los Ej. 3, 5 y 6 son hash, y el Ej. 4 es la lectura de teoría que une las dos mitades**. Los seis se contestan con material que la [[clase-03-macs-y-cifrado-autenticado|Clase 03]] ya dejó escrito — el Ej. 1 está literalmente resuelto en clase — salvo dos cosas que la guía agrega y ninguna filmina toca: **cómo se rompe un preprocesamiento débil** (Ej. 2) y **por qué hashear un dato de baja entropía no protege nada** (Ej. 6).

> **Ojo con una diferencia respecto de las guías anteriores.** La Guía 3 **no tiene PDF de soluciones de la cátedra** —la Guía 1 sí lo tiene— ni transcripción propia: la clase práctica del **07/09 todavía no ocurrió**. Todo lo que sigue es resolución nuestra, contrastada contra las notas de concepto y contra Katz & Lindell. Las únicas partes que llevan respaldo de la cátedra son las del **Ej. 1**, que se resolvió en voz el 27/08 y está transcripto en [[seguridad-de-un-mac#El ejercicio de los tres MACs|03.04]].

Los enunciados literales viven en la [[guia-03-mac-y-funciones-de-hash|nota hermana]]; acá arriba de cada ejercicio va sólo el resumen en cursiva.

## Tablero: qué destraba cada ejercicio

| Ej. | Lo que se pregunta | El concepto que lo destraba |
|---|---|---|
| 1 | Por qué **no son seguros** tres MACs candidatos | [[seguridad-de-un-mac\|Seguridad de un MAC]] · [[message-authentication-code\|MAC]] |
| 2 | Colisionar un MAC que **comprime con XOR** antes de etiquetar | [[resistencias-de-una-funcion-de-hash\|Resistencias de una función de hash]] · [[hmac\|HMAC]] · [[construccion-de-merkle-damgard\|Merkle-Damgård]] |
| 3 | Las **tres resistencias** sobre una función de hash de juguete, y la probabilidad de colisión | [[resistencias-de-una-funcion-de-hash\|Resistencias]] · [[seguridad-de-las-funciones-de-hash\|Seguridad de las funciones de hash]] |
| 4 | Lectura de teoría: `CBC-MAC`, `CBC`, Katz, Merkle-Damgård | [[cbc-mac\|CBC-MAC]] · [[modos-de-encadenamiento\|Modos de encadenamiento]] · [[construccion-de-merkle-damgard\|Merkle-Damgård]] |
| 5 | `MD5` y `SHA-1` de una frase con OpenSSL, y qué los diferencia | [[primitivas-de-hash-estandar\|Primitivas de hash estándar]] · [[seguridad-de-las-funciones-de-hash\|Seguridad de las funciones de hash]] |
| 6 | Recuperar 8 notas a partir de sus hashes `SHA-1` | [[ataque-de-diccionario-sobre-hashes\|Ataque de diccionario sobre hashes]] · [[resistencias-de-una-funcion-de-hash\|Resistencias]] |

---

## Ejercicio 1

*Analizar por qué no poseen seguridad los MACs $\mathsf{Mac}_k(m) = G(k)\oplus m$, $\mathsf{Mac}_k(m) = k \oplus \mathsf{first\_k\_bits}(m)$ y $\mathsf{Mac}_k(m) = \mathsf{Enc}_k(\lvert m\rvert)$.*

> **Este ejercicio ya está resuelto de punta a punta en el vault, y no acá.** Son **exactamente** los tres MACs de la **filmina 17 de la Clase 03**, que la cátedra derribó uno por uno en la clase del **27/08**. El desarrollo completo —cada adversario escrito, la reconstrucción de `Vrfy` en el tercero, los diálogos de clase con los alumnos que los resolvieron, y la **corrección al docente** sobre determinismo— está en [[seguridad-de-un-mac#El ejercicio de los tres MACs|Seguridad de un MAC § El ejercicio de los tres MACs]]. **Ir ahí para resolverlo.** Lo de acá abajo es el resumen y lo que la guía agrega respecto de la filmina.

### Los tres, en una línea cada uno

Marco: el experimento [[seguridad-de-un-mac#El experimento Mac-Forge|Mac-Forge]]. El adversario consulta el oráculo de etiquetado tantas veces como quiera —$Q$ es el conjunto de mensajes consultados— y gana si emite $(m^{*}, t)$ con $m^{*}\notin Q$ y $\mathsf{Vrfy}_k(m^{*},t)=1$. Los tres caen con **una sola consulta y probabilidad 1**, así que ninguno cumple $\Pr[\mathsf{Mac\text{-}Forge}=1] \le \mathsf{negl}(n)$.

*(La filmina y la guía escriben $\mathsf{first\_k\_bits}(m)$; de acá en adelante se usa $\mathsf{first}_n(m)$, por la razón que explica [[seguridad-de-un-mac#Segundo MAC: la clave xor los primeros bits del mensaje|03.04 § Segundo MAC]] — la `k` de ese nombre es la **longitud de la clave**, no la clave, así que son los primeros $n = \lvert k\rvert$ bits de $m$.)*

| MAC | El adversario, en una línea | Por qué cae | Detalle |
|---|---|---|---|
| $G(k)\oplus m$ | consultar $m^{(0)} = 0\cdots0$, quedarse con $t^{(0)} = G(k)$, emitir $(m^{*},\, G(k)\oplus m^{*})$ | $\oplus$ es invertible: la etiqueta **no oculta el keystream, lo expone**. Es **falsificación universal**, el grado más grave | [[seguridad-de-un-mac#Primer MAC: la clave expandida xor el mensaje\|ver]] |
| $k \oplus \mathsf{first}_n(m)$ | consultar cualquier $m$ con $\lvert m\rvert > n$, cambiar un bit **después** del $n$-ésimo, **reusar la misma etiqueta** | la etiqueta **ignora parte del mensaje**. (Y de yapa: consultar $0\cdots0$ devuelve $k$ en claro) | [[seguridad-de-un-mac#Segundo MAC: la clave xor los primeros bits del mensaje\|ver]] |
| $\mathsf{Enc}_k(\lvert m\rvert)$ | consultar $m$ de tres símbolos, emitir $(m^{*}, t)$ con $m^{*}$ **otro** mensaje de tres símbolos | la etiqueta **no depende de ningún bit del contenido**, sólo de la longitud | [[seguridad-de-un-mac#Tercer MAC: el cifrado de la longitud del mensaje\|ver]] |

La lección que atraviesa los tres, y que el docente enuncia al cerrar el segundo: **para ser infalsificable, la etiqueta tiene que tomar en cuenta todos los bits del contenido del mensaje**. El primero los toma todos pero de manera invertible; el segundo ignora la cola; el tercero ignora el mensaje entero. Ese enunciado es un **teorema combinatorio**, no una recomendación: si $\mathsf{Mac}_k$ ignora algún bit, existen $m\ne m^{*}$ con la misma etiqueta **para toda clave**, y ninguna hipótesis criptográfica lo puede salvar.

### Lo que la guía agrega: da menos contexto que la filmina

**El enunciado de la guía es más pobre que el de la filmina, y en un punto que importa.**

| | Filmina 17 | Guía 3, Ej. 1 |
|---|---|---|
| Primer MAC | dice que $G$ es un generador pseudoaleatorio | **lo dice también** |
| Tercer MAC | dice explícitamente que $\mathsf{Enc}$ es **CPA-Secure** | **no lo dice**: sólo escribe $\mathsf{Mac}_k(m) = \mathsf{Enc}_k(\lvert m\rvert)$ |
| `Gen` y `Vrfy` | no los da | **tampoco los da** |

Que no dé `Gen` ni `Vrfy` **no es un descuido: es la mitad del ejercicio**. Lo dice el propio docente (cues 817-819): *"nos está dando una definición incompleta de MAC […] tenemos que pensar cómo sería la verificación, porque si no, no vamos a saber si falsificamos o no algo"*. La reconstrucción canónica está en [[seguridad-de-un-mac#Lo que falta antes de poder resolverlo|03.04 § Lo que falta antes de poder resolverlo]]: `Gen` sortea $k$ **uniforme**, y `Vrfy` es **recalcular y comparar** —pero **sólo si `Mac` es determinística**.

**Y ahí muerde la omisión del tercero** *(lectura nuestra).* En la filmina, la hipótesis "`Enc` es CPA-Secure" es la que fuerza que `Enc` sea **probabilística** (un criptosistema determinístico no puede ser CPA-Secure, [[pruebas-de-indistinguibilidad#Propiedades de CPA|demostrado en la Clase 02]]), y de ahí que la verificación canónica sea **incorrecta** y haya que construir $\mathsf{Vrfy}_k(m,t)=1 \iff \mathsf{Dec}_k(t)=\lvert m\rvert$. Sin esa hipótesis el enunciado de la guía **no fija si `Mac` es determinística o no**, así que hay que abrir los dos casos:

- **Si `Enc` es probabilística** (el caso de la filmina): `Vrfy` canónica no sirve, hay que ir al invariante $\mathsf{Dec}_k(\mathsf{Enc}_k(x)) = x$, y recién ahí el ataque es evidente.
- **Si `Enc` es determinística**: `Vrfy` canónica sí sirve, y el ataque es **el mismo** — dos mensajes de la misma longitud producen la misma etiqueta, punto.

**El veredicto no cambia en ningún caso, pero el camino sí.** Conviene escribirlo así en el parcial: declarar el supuesto sobre `Enc`, y mostrar que el ataque sobrevive a los dos. Es exactamente el tipo de razonamiento que la filmina 17 entrena.

> **La corrección al docente que hay que conocer y no repetir mal.** Al cerrar el primer MAC, el docente saca la lección de que *"si los MACs son deterministas, tienen un problema latente de que va a ser muy difícil que sean infalsificables"* (cues 540-542). **Eso no es correcto**, y la propia clase lo desmiente una filmina después: [[cbc-mac|CBC-MAC]] y [[hmac|HMAC]] son determinísticos y son seguros. La intuición *"determinístico ⟹ inseguro"* viene del **cifrado** y no se transfiere a los MACs. Katz & Lindell va en la dirección contraria (Proposición 4.4): un MAC seguro con verificación canónica es automáticamente **fuertemente** seguro. El desarrollo está en [[seguridad-de-un-mac#Primer MAC: la clave expandida xor el mensaje|03.04]] y en [[message-authentication-code#Un MAC determinístico no es un problema|03.03 § Un MAC determinístico no es un problema]].

---

## Ejercicio 2

*Un MAC que primero parte $m$ en bloques de 128 bits (completando con ceros), después xorea todos los bloques en un único $R$, y recién ahí aplica la función MAC — a $R$, no a $m$. a) Describir al menos una manera de encontrar $m \ne m'$, aún con diferentes significados, con el mismo valor de MAC. b) Implementarlo y probarlo.*

Es el ejercicio más rico de la guía, y —junto con el Ej. 6— uno de los dos que no tienen ninguna filmina detrás.

### La construcción, escrita

$$m = m_1 \Vert m_2 \Vert \cdots \Vert m_n, \qquad \lvert m_i\rvert = 128 \ \text{bits (el último, rellenado con ceros)}$$

$$R \;=\; m_1 \oplus m_2 \oplus \cdots \oplus m_n \;\in\; \{0,1\}^{128}$$

$$\mathsf{Mac}_k(m) \;:=\; \mathsf{MAC}_k(R)$$

**Leída así, la construcción es un paradigma conocido: *comprimir y después etiquetar*.** Es exactamente la forma de [[hmac#HMAC es el paradigma hash-and-MAC|HMAC]] —*hash-and-MAC*, $\mathsf{Mac}'(m) = \mathsf{Mac}(H(m))$— sólo que con el XOR-fold haciendo de $H$. Y ahí está todo el ejercicio: el teorema que hace funcionar ese paradigma **exige una hipótesis que el XOR-fold no cumple**.

### a) El argumento que hace innecesario mirar la etiqueta

La observación que resuelve el ejercicio entero cabe en un renglón:

> $\mathsf{MAC}_k$ es **una función**. Entonces $R(m) = R(m') \implies \mathsf{MAC}_k(R(m)) = \mathsf{MAC}_k(R(m'))$, **sea cual sea la función MAC y sin conocer la clave**.

O sea: **colisionar el MAC se reduce a colisionar $R$**, que es una operación pública, sin clave y trivial de invertir. No hace falta saber nada de $\mathsf{MAC}_k$ —puede ser `HMAC-SHA256`, `CBC-MAC` con `AES`, lo que sea— ni tocar la clave. El atacante trabaja **antes** de la primitiva segura, no contra ella.

Y colisionar $R$ es gratis, porque el XOR-fold no tiene **ninguna** de las [[resistencias-de-una-funcion-de-hash#Las tres resistencias|tres resistencias]]. Van las familias.

#### Familia 1 — permutar los bloques

El XOR es **conmutativo y asociativo**, así que $R$ no depende del orden:

$$m_{\sigma(1)} \oplus m_{\sigma(2)} \oplus \cdots \oplus m_{\sigma(n)} \;=\; m_1 \oplus m_2 \oplus \cdots \oplus m_n \qquad \forall \sigma \in S_n$$

**Cualquier permutación de los bloques colisiona.** Con $n$ bloques distintos hay $n!$ mensajes con la misma etiqueta, y basta $n = 2$ para tener uno.

Y el enunciado pide que tengan **significados distintos**, cosa que acá sale sola si se alinean los campos del mensaje con los bloques. Con bloques de 16 caracteres:

$$
\begin{aligned}
m \;&=\; \texttt{"TRANSFERIR 5000 "}\;\Vert\;\texttt{"DESDE CUENTA 07 "}\;\Vert\;\texttt{"HACIA CUENTA 42 "}\\
m' \;&=\; \texttt{"TRANSFERIR 5000 "}\;\Vert\;\texttt{"HACIA CUENTA 42 "}\;\Vert\;\texttt{"DESDE CUENTA 07 "}
\end{aligned}
$$

Los dos son castellano perfectamente legible, los dos ordenan una transferencia de 5000, y **la plata va en sentido contrario**. Misma etiqueta.

#### Familia 2 — anexar bloques que se cancelan

$X \oplus X = 0$ para cualquier bloque $X$, y $0$ es el neutro del XOR. Entonces, **con $\lvert m\rvert$ múltiplo de 128 bits y $X$ un bloque completo** (o un número entero de bloques), para cualquier $X$:

$$R\bigl(m \,\Vert\, X \,\Vert\, X\bigr) \;=\; R(m) \oplus X \oplus X \;=\; R(m)$$

Se le puede **agregar al mensaje cualquier texto que ocupe un número entero de bloques de 128 bits, repetido una cantidad par de veces** (o, más en general, cualquier multiconjunto de bloques donde cada uno aparezca con multiplicidad par). Otra vez: infinitas colisiones, todas con significado a elección del atacante.

> **La hipótesis de alineación no es un tecnicismo** *(precisión nuestra).* La identidad se escribe sobre la **secuencia de bloques ya paddeada**, no sobre la concatenación de cadenas. Si $X$ no ocupa bloques enteros, $m \Vert X \Vert X$ **no** se vuelve a partir en los bloques de $m$ seguidos de $[X, X]$, y el XOR no se cancela: con $m$ de 48 bytes y $X = \texttt{"ANULAR"}$ (6 bytes), la cola de 12 bytes cae entera en un mismo bloque y $R$ cambia. Por eso el script usa $X = \texttt{"ANULAR LA ORDEN "}$, que mide **exactamente 16 bytes**.

La versión más quirúrgica de la misma idea es **por complemento**: elegir un $\Delta \ne 0$ y aplicarlo a **dos** bloques,

$$m' \;=\; m_1 \Vert \cdots \Vert (m_i \oplus \Delta) \Vert \cdots \Vert (m_j \oplus \Delta) \Vert \cdots \Vert m_n, \qquad R(m') = R(m) \oplus \Delta \oplus \Delta = R(m)$$

Con esto el atacante **modifica el contenido de un bloque a gusto** —subir el monto, cambiar un número de cuenta— y **paga el cambio en otro bloque** con el mismo $\Delta$, sin agregar ni quitar nada. Es la misma aritmética del XOR que la [[maleabilidad]] usa en el ataque a la base de sueldos, sólo que acá ni siquiera hay que romper un cifrado.

#### Familia 3 — el relleno con ceros, de yapa

El paso 1 del enunciado dice *"completando con bits en cero si es necesario"*. Eso agrega una debilidad **independiente de las dos anteriores**: $m$ y $m$ **con ceros al final** se rellenan a la misma cadena de bloques, y encima un bloque entero de ceros es el neutro del XOR. Así que

$$R(m) \;=\; R\bigl(m \Vert 0^{128}\bigr) \;=\; R\bigl(m \Vert 0^{256}\bigr) \;=\; \cdots$$

Es **exactamente el mismo defecto** que Katz & Lindell señala para Merkle-Damgård sin bloque de longitud: sin un campo que distinga la longitud, *"$x$ y $x\Vert0$ se paddean a la misma cadena"* → [[construccion-de-merkle-damgard#Y ahí está la razón de ser del bloque de longitud|03.08 § Y ahí está la razón de ser del bloque de longitud]]. La construcción de la guía **no** tiene bloque de longitud, y paga el precio.

#### El adversario contra Mac-Forge, formal

$$\begin{aligned}
&1)\ \ A \text{ consulta el oráculo con } m = \texttt{"TRANSFERIR 5000 DESDE CUENTA 07 HACIA CUENTA 42 "}\\
&\ \ \ \ \ \text{y recibe } t = \mathsf{MAC}_k\bigl(R(m)\bigr); \quad Q = \{m\}\\
&2)\ \ A \text{ emite } (m',\, t) \ \text{ con } \ m' = \texttt{"TRANSFERIR 5000 HACIA CUENTA 42 DESDE CUENTA 07 "}
\end{aligned}$$

$m' \ne m$, luego $m'\notin Q$. Y $R(m')=R(m)$, luego $\mathsf{Mac}_k(m') = \mathsf{MAC}_k(R(m')) = \mathsf{MAC}_k(R(m)) = t$, o sea que $\mathsf{Vrfy}_k(m',t)=1$ con verificación canónica.

$$\Pr[\mathsf{Mac\text{-}Forge}_{A,\Pi} = 1] \;=\; \boxed{1} \qquad \text{con } \lvert Q\rvert = 1 \text{ consulta}$$

**El esquema no es infalsificable.** Ni con una función MAC perfecta.

### La lección general: es hash-and-MAC con un hash que no resiste colisiones

Acá está el jugo del ejercicio, y es lo que conviene llevarse al parcial.

El [[hmac#HMAC es el paradigma hash-and-MAC|Teorema 5.6 de Katz & Lindell]] dice que $\mathsf{Mac}'(m) := \mathsf{Mac}_k(H^{s}(m))$ es un MAC seguro para longitud arbitraria **si** $\mathsf{Mac}$ es seguro a longitud fija **y $H$ es resistente a colisiones**. La demostración parte en dos casos: o el mensaje falsificado colisiona con alguno consultado —y eso rompe $H$—, o su digest es nuevo —y eso rompe el MAC. **La resistencia a colisiones de $H$ no está de adorno: es exactamente lo que descarta el primer caso.**

El esquema de la guía instancia ese teorema con $H = $ XOR-fold. Y el XOR-fold **falla las tres resistencias**, no sólo la de colisión:

| Resistencia | ¿La tiene el XOR-fold? | Ataque |
|---|---|---|
| Preimagen | **No** | dado $R$, devolver el mensaje de **un solo bloque** $m := R$ |
| Segunda preimagen | **No** | dado $m$, permutar dos bloques, o anexar $X\Vert X$ |
| Colisión | **No** | cualquiera de las familias de arriba |

Sin la hipótesis, no hay teorema; y sin teorema, hay ataque. **La primitiva fuerte no salva a la construcción débil que la envuelve.** Es la misma moraleja que el tercer MAC del Ej. 1 —*"una primitiva excelente aplicada al argumento equivocado no compra nada"*— y la misma que separa a `AES` de `ECB`.

> **La precisión que hace interesante a este ejercicio** *(lectura nuestra).* El XOR-fold **sí** mira **todos** los bits del mensaje, así que **pasa** el criterio que derriba al segundo MAC del Ej. 1 (*"la etiqueta tiene que depender de todos los bits"*) y cae igual. Lo que le falta no es cobertura, es **inyectividad computacional**: el XOR-fold es una aplicación **lineal** de $\bigl((\mathbb{F}_2)^{128}\bigr)^{n}$ en $(\mathbb{F}_2)^{128}$, y toda lineal sobreyectiva de un espacio de dimensión $128n$ sobre uno de dimensión $128$ tiene un **núcleo de dimensión $128(n-1)$** — enorme y explícito, y de ahí salen las familias de arriba. La palabra que hace el trabajo no es *lineal* a secas —la identidad sobre $(\mathbb{F}_2)^{128}$ también es lineal y su núcleo es $\{0\}$— sino la **caída de dimensión**. Depender de todos los bits es **necesario y no suficiente**; la condición suficiente es la resistencia a colisiones. Buena línea de cierre para el parcial.

### b) La implementación, corrida

El script está en [`raw/guias/guia3/G3-Ej2-xor-mac.py`](../../raw/guias/guia3/G3-Ej2-xor-mac.py) —junto a los dos de la Guía 1, [`G1-Ej3.py`](../../raw/guias/guia1/G1-Ej3.py) y [`G1-Ej6-kasiski.py`](../../raw/guias/guia1/G1-Ej6-kasiski.py)—. El núcleo son **tres** funciones —van abajo—, más dos de impresión (`mostrar` y `par`):

```python
BLOQUE = 16  # 128 bits

def bloques(m):
    """Paso 1 del enunciado: parte m en bloques de 128 bits, con relleno de ceros."""
    m = m + b"\x00" * ((-len(m)) % BLOQUE)
    return [m[i:i + BLOQUE] for i in range(0, len(m), BLOQUE)]

def xor_fold(m):
    """Paso 2 del enunciado: R = b1 xor b2 xor ... xor bn."""
    r = bytearray(BLOQUE)
    for b in bloques(m):
        for i in range(BLOQUE):
            r[i] ^= b[i]
    return bytes(r)

def mac(k, m):
    """El MAC de la guia: la funcion MAC se aplica a R, no a m."""
    return hmac.new(k, xor_fold(m), hashlib.sha256).hexdigest()
```

Como *"la función MAC"* se usa **`HMAC-SHA256`**, que es el MAC que se usa de verdad ([[hmac|03.10]]). La elección es deliberada: si el esquema cayera con un MAC berreta no se probaría nada. Cae con el bueno.

**Salida real** (`python3 G3-Ej2-xor-mac.py`):

```
clave HMAC (secreta, sorteada al azar): 7cd73f794ed4bed65b0ed7ccfa15ab4beb01e1eba9a955296966b720ebe09727

FAMILIA 1 - permutacion de bloques (se invierte el sentido del giro)
  m : 'TRANSFERIR 5000 DESDE CUENTA 07 HACIA CUENTA 42 '
     bloques = 3
     R       = 58565143574645524952203530343520
     tag     = b00c2c5ce5cc48255574ea43731e165f22c17974e570ebcd4fc954386383eedb
  m': 'TRANSFERIR 5000 HACIA CUENTA 42 DESDE CUENTA 07 '
     bloques = 3
     R       = 58565143574645524952203530343520
     tag     = b00c2c5ce5cc48255574ea43731e165f22c17974e570ebcd4fc954386383eedb
     m != m'      : True
     R(m) == R(m'): True
     tag colision : True

FAMILIA 2 - anexado de bloques que se cancelan de a pares
  m : 'TRANSFERIR 5000 DESDE CUENTA 07 HACIA CUENTA 42 '
     bloques = 3
     R       = 58565143574645524952203530343520
     tag     = b00c2c5ce5cc48255574ea43731e165f22c17974e570ebcd4fc954386383eedb
  m': 'TRANSFERIR 5000 DESDE CUENTA 07 HACIA CUENTA 42 ANULAR LA ORDEN ANULAR LA ORDEN '
     bloques = 5
     R       = 58565143574645524952203530343520
     tag     = b00c2c5ce5cc48255574ea43731e165f22c17974e570ebcd4fc954386383eedb
     m != m'      : True
     R(m) == R(m'): True
     tag colision : True

FAMILIA 3 - relleno con ceros (m y m||0...0 son indistinguibles)
  m : 'TRANSFERIR 5000 DESDE CUENTA 07 HACIA CUENTA 42 '
     bloques = 3
     R       = 58565143574645524952203530343520
     tag     = b00c2c5ce5cc48255574ea43731e165f22c17974e570ebcd4fc954386383eedb
  m': 'TRANSFERIR 5000 DESDE CUENTA 07 HACIA CUENTA 42 \x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00'
     bloques = 4
     R       = 58565143574645524952203530343520
     tag     = b00c2c5ce5cc48255574ea43731e165f22c17974e570ebcd4fc954386383eedb
     m != m'      : True
     R(m) == R(m'): True
     tag colision : True

La colision no depende de la clave ni de que funcion MAC se use:
  clave #1: tag(m) == tag(m') -> True   (74e60c0605458802...)
  clave #2: tag(m) == tag(m') -> True   (b68742dfca381f70...)
  clave #3: tag(m) == tag(m') -> True   (c39987899e019903...)

Mac-Forge con una sola consulta:
  Q = {m},  m  = 'TRANSFERIR 5000 DESDE CUENTA 07 HACIA CUENTA 42 '
  emite (m', t) con m' = 'TRANSFERIR 5000 HACIA CUENTA 42 DESDE CUENTA 07 '
  m' no pertenece a Q : True
  Vrfy(m', t) = 1     : True
```

**Qué mirar en esa salida, más allá de los `True`.**

- **La fila `R` es la misma en las ocho impresiones.** El ataque termina ahí: todo lo que viene después es una función aplicada al mismo argumento.
- **Los pares 2 y 3 tienen distinta cantidad de bloques** —3 contra 5 y 3 contra 4— **y la misma etiqueta**: el esquema ni siquiera distingue mensajes de longitudes distintas.
- **El par 1 tiene la misma cantidad de bloques** (3 contra 3) y tampoco distingue **el orden** en que vienen. Son dos defectos separados, no uno.
- **El bloque final** de la corrida repite el experimento con **tres claves nuevas sorteadas al azar**: las etiquetas cambian todas —son otras claves— y **siguen coincidiendo entre sí**. Eso es la verificación empírica del argumento *"$\mathsf{MAC}_k$ es una función"*: la colisión no le pregunta nada a $k$.
- La clave se **sortea en cada corrida**, así que al ejecutarlo de nuevo las etiquetas van a dar otro valor. Lo que no cambia es que coincidan entre sí.

---

## Ejercicio 3

*Una función $h()$ que acepta mensajes de cualquier longitud y devuelve **32 ceros** si la entrada tiene un número **par** de caracteres, y **32 unos** si lo tiene **impar**. a) ¿Es una función de hash válida para criptografía? Analizar los tres niveles de seguridad. b) ¿Cuál es la probabilidad de que dos entradas $x_1$ y $x_2$ elegidas aleatoriamente colisionen?*

### Lo primero: la imagen tiene dos elementos

Antes de analizar nada, hay que ver el tamaño real del objeto. La función es

$$h(x) \;=\; \begin{cases} 0^{32} & \text{si } \lvert x\rvert \text{ es par}\\[2pt] 1^{32} & \text{si } \lvert x\rvert \text{ es impar}\end{cases}$$

$$\mathcal{B} = \operatorname{Im}(h) = \bigl\{\,0^{32},\ 1^{32}\,\bigr\}, \qquad \lvert \mathcal{B}\rvert = 2$$

**Los 32 bits de salida son una fachada.** La salida ocupa 32 bits pero sólo puede tomar **dos** valores, así que la entropía real del digest es de **1 bit** — y ese bit es la **paridad de la longitud** de la entrada. Todo lo demás del mensaje —su contenido, su longitud exacta, su orden— se pierde por completo.

Esa cuenta ya contesta el ejercicio, pero conviene hacer el recorrido que el enunciado pide.

### a) Las tres resistencias, una por una

Los *"tres niveles de seguridad"* son las [[resistencias-de-una-funcion-de-hash#Las tres resistencias|tres resistencias]]. Falla las tres, y en las tres el ataque es de **tiempo constante**: no hay ni siquiera que evaluar $h$ dos veces.

**Resistencia a preimágenes** — *para todo $y$, es inviable hallar $x$ con $h(x) = y$.*

**Falla.** El adversario sólo puede recibir uno de dos $y$ posibles, y para cada uno tiene la respuesta escrita:

$$y = 0^{32} \;\longrightarrow\; x := \texttt{"ab"} \qquad\qquad y = 1^{32} \;\longrightarrow\; x := \texttt{"a"}$$

Costo: **una** evaluación, y ni eso hace falta. No es que $h$ sea *"de una vía"* con una constante mala: **no es de una vía en absoluto**. Y si $y$ fuera cualquier otra cadena de 32 bits, no hay preimagen — pero eso es peor, no mejor: significa que $h$ ni siquiera es sobreyectiva sobre su codominio declarado.

**Resistencia a segundas preimágenes** — *para todo $x$, es inviable hallar $x'\ne x$ con $h(x')=h(x)$.*

**Falla.** Dado cualquier $x$, se le agregan **dos** caracteres cualesquiera:

$$x' := x \Vert \texttt{"zz"} \;\ne\; x, \qquad \lvert x'\rvert = \lvert x\rvert + 2 \implies \text{misma paridad} \implies h(x') = h(x)$$

Y hay infinitas: cualquier $x'$ con la misma paridad de longitud sirve, tenga o no algo que ver con $x$.

**Resistencia a colisiones** — *es inviable hallar $x \ne x'$ con $h(x) = h(x')$.*

**Falla.** $h(\texttt{"a"}) = h(\texttt{"b"}) = 1^{32}$. Dos caracteres de trabajo.

> **El atajo por la jerarquía, y su letra chica.** [[resistencias-de-una-funcion-de-hash#La jerarquía|La jerarquía]] es
> $$\text{res. a colisiones} \implies \text{res. a 2ª preimágenes} \implies \text{res. a preimágenes}$$
> así que, por contrarrecíproco, **romper la más débil rompe las tres**: exhibida la preimagen, las otras dos caen solas. La letra chica es que la segunda implicación **necesita que $h$ comprima** —si fuera inyectiva el argumento se cae— y acá comprime de infinito a 2, así que la hipótesis se cumple con holgura. Vale igual escribir los tres ataques explícitos, que es lo que el enunciado pide y lo que da puntos. *(Y ojo: K&L deja estas implicaciones enunciadas informalmente, ver [[resistencias-de-una-funcion-de-hash#La jerarquía|03.07]].)*

### La respuesta: no, y no hace falta la jerarquía para descartarla

**No es una función de hash criptográfica.** Y el veredicto no depende de ningún análisis fino: **una función con imagen de 2 elementos no puede servir para nada criptográfico**, porque el digest no puede transportar más de 1 bit de información sobre un mensaje de longitud arbitraria. Es más barato refutarla contando la imagen que corriendo las tres pruebas.

Lo que **sí** cumple son los requisitos **no criptográficos** de la [[funciones-de-hash-criptograficas#Definición|definición de función de hash]]: acepta dominio ilimitado, devuelve salida de tamaño fijo, y es baratísima de evaluar. Eso es todo lo que tiene. Sirve como bit de paridad y no como hash — y de hecho **es** un bit de paridad, escrito 32 veces.

> **La trampa del efecto avalancha** *(lectura nuestra).* Un test superficial de avalancha la aprobaría con honores: agregar **un solo carácter** da vuelta **los 32 bits de salida**, que es el 100 % de cambio, mejor que el 50 % que se espera de una función buena. La moraleja es que el efecto avalancha es un **síntoma**, no una definición: se mide sobre lo que la función hace, y esta función no hace nada. Las propiedades que definen un hash criptográfico son las tres resistencias, no las estadísticas de la salida.

### b) La probabilidad de colisión

**Acá hay que ser preciso, porque la respuesta depende de un supuesto que el enunciado no fija.** El enunciado dice *"elegidas aleatoriamente"* y **no dice de qué distribución**. Como el objeto que decide todo es la **paridad de la longitud**, el resultado es sensible a esa distribución y no a otra cosa.

**Bajo el supuesto natural** —que las paridades de $\lvert x_1\rvert$ y $\lvert x_2\rvert$ sean **uniformes** ($1/2$ cada una) e **independientes** entre sí— hay colisión exactamente cuando las dos longitudes tienen la misma paridad:

$$\Pr[h(x_1) = h(x_2)] \;=\; \underbrace{\Pr[\text{ambas pares}]}_{\frac12\cdot\frac12} \;+\; \underbrace{\Pr[\text{ambas impares}]}_{\frac12\cdot\frac12} \;=\; \tfrac14 + \tfrac14 \;=\; \boxed{\tfrac12}$$

> **La precisión formal que conviene decir en voz alta.** Una colisión pide además $x_1 \ne x_2$. Sobre un dominio de longitud ilimitada y con cualquier distribución razonable, $\Pr[x_1 = x_2]$ es despreciable, así que el $1/2$ queda intacto. Si el dominio fuera chico habría que restarlo. *(Precisión nuestra; el enunciado no lo menciona.)*

**Y por qué el supuesto no es gratis.** Si los mensajes se sortearan de un espacio de **longitud fija** —por ejemplo, todos los bloques de 128 bits, o todas las contraseñas de 8 caracteres— las dos entradas tendrían **siempre** la misma paridad y

$$\Pr[h(x_1) = h(x_2)] \;=\; 1$$

O sea que **con $x_1$ y $x_2$ sorteados de la misma distribución e independientes** la respuesta va de $1/2$ a $1$ y nunca baja de $1/2$: si $p$ es la probabilidad de que la longitud salga par, $\Pr[\text{colisión}] = p^{2} + (1-p)^{2} \ge 1/2$ para todo $p$. Si las dos entradas salieran de **distribuciones distintas** la cota se cae, y hasta el fondo: con $x_1$ de un espacio de longitud siempre par y $x_2$ de uno de longitud siempre impar, $\Pr[\text{colisión}] = 0$. Lo correcto es contestar **$1/2$ declarando el supuesto**, y agregar que el enunciado no lo fija.

#### El contraste que es la moraleja del ejercicio

Un hash decente de 32 bits de salida, modelado como función aleatoria, da

$$\Pr[H(x_1) = H(x_2)] \;=\; \frac{1}{2^{32}} \;\approx\; 2{,}3\times10^{-10}$$

| | $h()$ del ejercicio | Un hash decente de 32 bits |
|---|---|---|
| Bits de salida **nominales** | 32 | 32 |
| Tamaño real de la imagen $\lvert\mathcal{B}\rvert$ | $2$ | $2^{32}$ |
| $\Pr[\text{colisión}]$ con **dos** entradas | $1/2$ | $2^{-32}$ |
| Mensajes para colisionar con probabilidad $\approx 1/2$ | **2** | $\approx 2^{16} = 65\,536$ |

**Los dos escriben 32 bits y difieren en diez órdenes de magnitud.** La última fila es la [[seguridad-de-las-funciones-de-hash#Por qué la raíz cuadrada: la paradoja del cumpleaños|paradoja del cumpleaños]]: el costo genérico de una colisión es $\lvert\mathcal{B}\rvert^{1/2}$, o sea $2^{L/2}$ para $L$ bits de salida — la regla *"$L$ bits de salida dan $L/2$ bits de seguridad"* de [[seguridad-de-las-funciones-de-hash#La consecuencia operativa: L bits de salida dan L/2 bits de seguridad|03.11]]. Aplicada acá: el $L$ que vale es el **efectivo**, $L = 1$, y $2^{1/2} \approx 1{,}4$ intentos. La cuenta de la seguridad se hace sobre el **tamaño de la imagen**, no sobre la cantidad de bits que la función se digna escribir.

*(Y el $2^{-32}$ del contraste tampoco sería aceptable en producción: 32 bits de salida dan 16 bits de seguridad a colisión, cuando el mínimo hoy es 256 bits de salida → [[primitivas-de-hash-estandar#Qué usar, en la práctica|03.09 § Qué usar, en la práctica]]. El punto del contraste es el salto de $1/2$ a $2^{-32}$, no que $2^{-32}$ alcance.)*

---

## Ejercicio 4

*a) Describir la construcción `CBC-MAC` e indicar para qué sirve. b) Compararla con `CBC-mode` para encripción. c) ¿Cuáles son, según Katz, las opciones seguras de uso de `CBC-MAC`? d) ¿Para qué sirve la Transformación de Merkle-Damgård?*

Es el ejercicio de lectura de la guía: los cuatro ítems se contestan con notas de concepto que ya existen. Acá va cada respuesta **autosuficiente** —lo que habría que escribir en un parcial— con el link al desarrollo largo.

### a) La construcción CBC-MAC y para qué sirve

**Qué es.** Es una de las **dos formas de construir un MAC** que la clase presenta (la otra es [[hmac|HMAC]], sobre funciones de hash). Ésta se construye a partir de una **función pseudoaleatoria** $F$ —el corazón de cualquier [[primitiva-de-cifrado-en-bloque|cifrado de bloque]]— encadenando los bloques del mensaje igual que el modo `CBC`, pero quedándose **sólo con el último valor**.

$$\mathsf{Gen}:\ k \leftarrow \{0,1\}^{n}$$
$$\mathsf{Mac}_k(m):\quad m = m_1\Vert m_2\Vert\cdots\Vert m_j, \qquad t_0 = 0^{n}, \qquad t_i = F_k\bigl(t_{i-1}\oplus m_i\bigr), \qquad \mathsf{Mac}_k(m) = t_j$$
$$\mathsf{Vrfy}_k(m,t) = 1 \iff t = \mathsf{Mac}_k(m) \quad \text{(verificación canónica: recalcular y comparar)}$$

**Para qué sirve.** Para **integridad y autenticación de origen**, que es un servicio **distinto** de la confidencialidad: un criptosistema `CPA`-Secure protege el contenido y **no lo protege de ser modificado** ([[maleabilidad]]). El MAC permite al receptor decidir si el mensaje llegó tal cual lo mandó quien comparte la clave. **No da confidencialidad** (el mensaje viaja en claro junto a la etiqueta) y **no da no repudio** (la clave es compartida, así que cualquiera de los dos pudo haberlo fabricado) → [[message-authentication-code|03.03]].

**Con qué garantía.** El **Teorema 4.12** de Katz & Lindell: si $F$ es pseudoaleatoria, `CBC-MAC` es un MAC seguro **para mensajes de una longitud fija $\ell(n)\cdot n$**, elegida de antemano y **verificada por `Vrfy`**. Fuera de esa hipótesis no hay teorema — y no hay teorema porque **hay un ataque**, el de longitud variable, que con **dos consultas** —y un mensaje forjado de **tres bloques**— falsifica con probabilidad 1.

→ Desarrollo completo, diagrama y ataque: [[cbc-mac#La construcción|CBC-MAC § La construcción]] y [[cbc-mac#El ataque de longitud variable, paso a paso|§ El ataque de longitud variable, paso a paso]].

### b) CBC-MAC contra CBC-mode: la recurrencia es la misma, todo lo demás no

La recurrencia es **literalmente idéntica** —el estado anterior se xorea con el bloque nuevo y el resultado entra a la primitiva—, y ahí termina el parecido. **Las diferencias no son detalles de implementación: cada una es una condición de seguridad, y aflojar cualquiera rompe el esquema.**

| | Modo `CBC` de cifrado | `CBC-MAC` |
|---|---|---|
| **Recurrencia** | $c_i = F_k(c_{i-1}\oplus m_i)$ | $t_i = F_k(t_{i-1}\oplus m_i)$ — **la misma** |
| **Valor inicial** | IV **aleatorio** e impredecible, obligatorio | **sin IV**: $t_0 = 0^{n}$ fijo, y tiene que ser fijo |
| **Estados intermedios** | **se publican**: los $c_i$ *son* el criptograma | **se descartan**, no salen nunca |
| **Qué se emite** | todos los bloques más el IV | **sólo el último bloque**, $t_j$ |
| **Descifrado** | existe: `Dec` recorre la cadena al revés | **no existe**: no es un cifrado, no hay nada que recuperar |
| **Qué le pide a la primitiva** | una **permutación** invertible (`PRP`) | basta una **función pseudoaleatoria** (`PRF`): nunca se invierte |
| **Qué persigue** | confidencialidad — ser `CPA`-Secure | integridad — ser infalsificable |

**Los cuatro puntos que no se pueden omitir**, con el motivo de cada uno:

1. **Sin IV, o IV fijo en cero.** La respuesta corta es que nunca se descifra, así que el azar no compra nada. La respuesta fuerte es que **un IV aleatorio no sería neutro, sería un agujero**: como habría que publicarlo para que el verificador recompute, el adversario lo ve, y consultando $m$ puede emitir $m'$ con el primer bloque xoreado contra $\Delta$ y la etiqueta $(IV\oplus\Delta,\ t)$ — los $\Delta$ se cancelan y la etiqueta sigue valiendo. Una consulta, probabilidad 1. → [[cbc-mac#El IV: no es que no haga falta, es que no tiene que estar|03.05 § El IV]]
2. **No se publican los estados intermedios.** Si se publicaran, el esquema deja de ser seguro: la demostración de eso **es** el ataque de longitud variable, donde lo único que el adversario hace es **comprar un estado intermedio con una consulta extra**.
3. **Sólo se emite el último bloque.** Es la consecuencia visible de (2), y lo que le da el nombre a la construcción: *"conceptualmente esto sería como el cifrado modo `CBC` bloque a bloque, salvo que tiramos todos los bloques y nos quedamos con el último"*.
4. **No hay descifrado, porque no es un cifrado.** Un MAC no es invertible ni pretende serlo: `Vrfy` **recalcula** la etiqueta y compara, no desarma nada. De ahí que a la primitiva le alcance con ser `PRF` y no haga falta que sea `PRP`.

> **La trampa de implementación más común del tema.** Muchas bibliotecas exponen *"una función CBC"* y **no distinguen** si se la va a usar para cifrar o para autenticar. Usar la de cifrado como MAC —con su IV aleatorio y sus bloques intermedios a la vista— reúne las roturas (1) y (2) a la vez. (K&L, pág. 124.)

→ [[cbc-mac#En qué se parece al modo CBC, y en qué no|CBC-MAC § En qué se parece al modo CBC, y en qué no]] · [[modos-de-encadenamiento#Los cinco modos|Modos de encadenamiento]]

### c) Las tres opciones seguras según Katz

**Quién es "Katz".** El enunciado nombra a Katz a secas; el libro es **Katz, J. & Lindell, Y., *Introduction to Modern Cryptography*** (3ª ed., CRC Press, 2020), que es la **bibliografía obligatoria** de la materia. El tema vive en el **capítulo 4, *Message Authentication Codes*** — que además es la **lectura designada** de la Clase 03 por la filmina 41. → [[bibliografia|Bibliografía]]

**Qué se pregunta en realidad.** `CBC-MAC` sólo es seguro a **longitud fija**. Las *"opciones seguras de uso"* son los tres arreglos que lo llevan a longitud arbitraria sin perder la demostración. **Las tres apuntan al mismo agujero** —impedir que el adversario reconstruya estados intermedios reutilizables entre mensajes de distinta longitud— y se diferencian en **dónde meten la longitud**.

**Opción 1 — derivar la clave de la longitud.**
$$k' := F_k(\lvert m\rvert), \qquad t_i := F_{k'}(t_{i-1}\oplus m_i), \qquad \mathsf{Mac}_k(m) := t_j$$
Mensajes de longitudes distintas se procesan con **claves distintas e independientes**, así que un estado robado de un mensaje de $\ell$ bloques no vale nada dentro de uno de $\ell'$ bloques.

**Opción 2 — la longitud como prefijo.**
$$m' := \lvert m\rvert \,\Vert\, m, \qquad \mathsf{Mac}_k(m) := \mathsf{CBC\text{-}MAC}_k(m')$$
Dos mensajes de longitud distinta difieren **en el primer bloque**, así que sus cadenas divergen desde la primerísima aplicación de $F_k$ y no comparten ningún estado. Es la que tiene mejor demostración: $\lvert m\rvert\Vert m$ es una codificación *prefix-free*, y por el **Teorema 4.13** eso alcanza.

**Opción 3 — dos claves, cifrar la etiqueta final.**
$$t' := \mathsf{CBC\text{-}MAC}_{k_1}(m), \qquad t := F_{k_2}(t')$$
**El valor que el adversario ve ($t$) no es el que la cadena usa ($t'$)**, y entre uno y otro hay una aplicación de $F$ con clave independiente que no puede ni invertir ni recomputar. En la literatura se la conoce como **EMAC**; el nombre no está en la filmina.

**Y la que el enunciado no lista, que es la que hay que saber descartar:** poner la longitud **como sufijo**, $m\Vert\lvert m\rvert$, **no** sirve. La simetría con la Opción 2 es engañosa, y la filmina 21 lo demuestra con un ataque explícito → [[cbc-mac#Por qué la longitud como sufijo no sirve|03.05 § Por qué la longitud como sufijo no sirve]].

**Cuál se usa en la práctica.**

| Opción | Dónde entra la longitud | Claves | ¿Hay que saber $\lvert m\rvert$ al empezar? |
|---|---|---|---|
| 1. Clave derivada | en la **clave** | 1 (deriva 1) | Sí |
| 2. Prefijo | en el **primer bloque** | 1 | Sí |
| 3. Dos claves (EMAC) | en ningún lado | **2 independientes** | **No** |

La respuesta honesta es la del docente: **ninguna de las tres está impuesta universalmente**, y se encuentran bibliotecas que implementan cada una. **La tercera es la que menos se usa**, aunque sea la única que permite etiquetar en *streaming*, porque **paga esa comodidad con el doble de material de clave**: dos claves independientes es, desde afuera, una clave del doble de tamaño. → [[cbc-mac#Cuál se usa, y por qué la tercera casi no|03.05 § Cuál se usa, y por qué la tercera casi no]]

*(Y una lectura que la pregunta no pide: si hoy hay que elegir un MAC para un proyecto, la respuesta no es ninguna de las tres sino [[hmac#HMAC en la práctica|HMAC]] — la otra familia de construcción, la que se apoya en funciones de hash.)*

### d) La transformación de Merkle-Damgård

**Para qué sirve.** Resuelve un problema de **dominio**: se sabe diseñar y criptoanalizar una **función de compresión** $f$ que toma una entrada de tamaño **fijo** y devuelve una salida más chica; no se sabe hacer criptoanálisis directo sobre una función cuyo dominio es infinito. Merkle-Damgård es la receta que **construye una función de hash de dominio ilimitado iterando una función de compresión de dominio fijo**.

$$B := \lceil L/n\rceil, \quad x \text{ paddeado} \to x_1,\dots,x_B, \quad x_{B+1} := L \text{ codificado en } n \text{ bits}$$
$$z_0 := 0^{n}, \qquad z_i := f\bigl(z_{i-1} \Vert x_i\bigr) \ \ (i = 1,\dots,B{+}1), \qquad H(x) := z_{B+1}$$

**Por qué vale la pena, que es la parte que hay que saber.** Por el **Teorema 5.4** de Katz & Lindell:

> Si la función de compresión $f$ es **resistente a colisiones**, entonces la función de hash $H$ que Merkle-Damgård construye a partir de ella **también lo es**.

Eso es lo que la filmina resume como *"la seguridad está dada por la función de compresión"*, y es un resultado grande: **reduce el análisis de un objeto infinito a una pieza finita**. La demostración va por el contrarrecíproco —toda colisión en $H$ produce una colisión en $f$— y parte en dos casos: mensajes de **longitudes distintas** (colisionan en el último bloque, el de la longitud) y de **misma longitud** (se recorre la cadena hacia atrás hasta el primer punto donde las entradas difieren).

**El Caso 1 es la razón de ser del bloque de longitud**, que la filmina lista como si fuera un detalle de formato: sin él no hay primer caso, y encima aparecen colisiones triviales ($x$ y $x\Vert 0$ se paddean igual). Ese refuerzo tiene nombre propio: **Merkle-Damgård strengthening**.

**La contra, que hay que nombrar.** La misma estructura abre el ***length extension attack***: la salida **es** el estado interno al terminar, así que quien conoce $H(m)$ puede seguir iterando y calcular $H(m\Vert\mathrm{pad}(m)\Vert m')$ sin conocer $m$. De ahí sale el resultado operativo más citado del tema: **$H(k\Vert m)$ no sirve como MAC**, y por eso existe [[hmac|HMAC]]. `MD5`, `SHA-1` y `SHA-2` heredan el problema; **`SHA-3` no usa este modelo** (es una esponja) y no lo tiene.

→ [[construccion-de-merkle-damgard|Construcción de Merkle-Damgård]], con el diagrama pieza por pieza, el teorema y [[construccion-de-merkle-damgard#La contra: length extension|§ La contra: length extension]].

> **Errata del enunciado.** El PDF de la guía escribe **"Transformación de Merkle-Darmgard"**. El apellido es **Damgård**, no *Darmgard*: están permutadas las letras y falta la `å`. Son **Ralph Merkle** e **Ivan Damgård**, que publicaron la construcción de **forma independiente, los dos en CRYPTO '89**, y por eso lleva los dos nombres. *(La errata está verificada sobre la página renderizada del PDF, no sobre texto extraído.)* La filmina de la Clase 03 tiene **otra** errata sobre lo mismo —dice *"Propuesto por Merkle en 1989"*, omitiendo a Damgård—, marcada en [[construccion-de-merkle-damgard#Y ahí está la razón de ser del bloque de longitud|03.08]].

---

## Ejercicio 5

*Con `openssl dgst`: a) calcular el hash `MD5` de una frase (por ejemplo "hoy es el primer lunes de abril"); b) el `SHA-1` de la misma frase; c) ¿qué diferencias se observan?*

### Los comandos, y por qué hay dos variantes de cada uno

**Todo lo de abajo está corrido con `OpenSSL 3.6.2` y verificado.** Y va en **dos variantes**, porque la diferencia entre ellas es el punto pedagógico del ejercicio:

```
$ echo "hoy es el primer lunes de abril" | openssl dgst -md5
MD5(stdin)= 4893481cf3c2fe18773dabb1bd990050

$ echo "hoy es el primer lunes de abril" | openssl dgst -sha1
SHA1(stdin)= fcebd0e92f4e5330390ef34c3010ab4908ae81fe

$ printf '%s' "hoy es el primer lunes de abril" | openssl dgst -md5
MD5(stdin)= be58eb3e840f5ce520f284fa68237611

$ printf '%s' "hoy es el primer lunes de abril" | openssl dgst -sha1
SHA1(stdin)= ad6e9a273b95d147a098e053513e590644a2e53c
```

| Variante | `MD5` | `SHA-1` |
|---|---|---|
| `echo` — agrega un `\n` al final | `4893481cf3c2fe18773dabb1bd990050` | `fcebd0e92f4e5330390ef34c3010ab4908ae81fe` |
| `printf '%s'` — **sin** `\n` | `be58eb3e840f5ce520f284fa68237611` | `ad6e9a273b95d147a098e053513e590644a2e53c` |

**El `\n` es parte del mensaje.** `echo` agrega un salto de línea que entra a la función igual que cualquier otro byte, así que las dos variantes hashean **mensajes distintos** —31 bytes contra 32— y dan digests que no se parecen en nada. Es la trampa que el vault ya tiene documentada en [[primitivas-de-hash-estandar#Los digests de ejemplo, verificados|03.09 § Los digests de ejemplo, verificados]], donde se reproducen los ejemplos de la filmina con `printf '%s'` justamente por esto. Y es **la clave del [[#Ejercicio 6|Ejercicio 6]]**, que sin el `\n` no sale.

### c) Qué diferencias se observan

Son cuatro, y conviene darlas en este orden porque cada una implica la siguiente.

**1. La longitud de la salida.**

$$\lvert \mathsf{MD5}(x)\rvert = 128 \text{ bits} = 32 \text{ dígitos hexadecimales} \qquad \lvert \mathsf{SHA\text{-}1}(x)\rvert = 160 \text{ bits} = 40 \text{ dígitos}$$

Se ve directamente en la salida: basta con contar los caracteres. Es la **única** diferencia que se observa a simple vista; las otras tres se deducen de ella o hay que saberlas.

**2. La resistencia a colisión que esa longitud compra.** Por la [[seguridad-de-las-funciones-de-hash#Por qué la raíz cuadrada: la paradoja del cumpleaños|paradoja del cumpleaños]], una salida de $L$ bits da $2^{L}$ contra preimágenes pero sólo $2^{L/2}$ contra colisiones:

| | Salida $L$ | Preimagen | Colisión |
|---|---|---|---|
| `MD5` | 128 bits | $2^{128}$ | $2^{64}$ |
| `SHA-1` | 160 bits | $2^{160}$ | $2^{80}$ |

O sea que `SHA-1` es $2^{16} = 65\,536$ veces más caro de colisionar que `MD5`. **Y aun así no alcanza:** $2^{80}$ está apenas 17 órdenes binarios por encima de un ataque que ya se pagó → [[seguridad-de-las-funciones-de-hash#La escala física: dónde cae 2 elevado a la 80|03.11 § La escala física]].

**3. El estado: las dos están quebradas.** Ésta es la diferencia que el ejercicio no pregunta y que hay que decir igual, porque cambia la respuesta operativa.

| Primitiva | Año | Estado | Desde |
|---|---|---|---|
| `MD5` | 1992 | **quebrada** | colisiones prácticas desde 2004-2008 |
| `SHA-1` | 1995 | **quebrada** | **SHAttered**, febrero de 2017 ($\approx 2^{63}$ evaluaciones, ejecutado de verdad) |

**Ninguna de las dos se usa hoy**, ni siquiera *"para un checksum"*. Elegir entre `MD5` y `SHA-1` es elegir entre dos cosas rotas: la respuesta correcta es **`SHA-2` o `SHA-3`** → [[primitivas-de-hash-estandar#Qué usar, en la práctica|03.09 § Qué usar, en la práctica]]. Ojo con la filmina 35 de la clase, que **lista `SHA-1` entre las recomendadas sin marca**: quedó congelada en el estado previo a 2017.

**4. El efecto avalancha, que es lo que se ve en la propia salida.** El texto es **el mismo** en los cuatro digests y los cuatro son irreconocibles entre sí. Comparalo entre las dos filas de la tabla: cambiar **un solo byte** (el `\n`) cambia **toda** la salida, en `MD5` y en `SHA-1` por igual. Es la ilustración más barata de la propiedad, y no distingue una función de la otra: **las dos la tienen**. Lo que las separa es el punto 2, no éste.

> **Precisión sobre la sinopsis del PDF** *(precisión nuestra).* El enunciado copia la sinopsis de `openssl dgst` con sus flags, entre ellas **`-dss1`, `-md2` y `-mdc2`**. **Esas flags ya no existen en OpenSSL 3.x**: verificado en `3.6.2`, `-dss1` y `-md2` devuelven `Unknown option or message digest`, y `-mdc2` devuelve `Error setting digest` porque el algoritmo quedó en el proveedor *legacy* y no se carga por defecto. La sinopsis del PDF es **de la era 1.0.x**. No cambia nada del ejercicio —`-md5` y `-sha1` siguen ahí—, pero si copiás la sinopsis literal, no corre.

---

## Ejercicio 6

*Se tienen los nombres de 8 alumnos y el hash `SHA-1` de sus notas. Decir cuál es la nota de cada uno. La nota se colocó en números y en letras, en la forma `X nota_en_letras` (por ejemplo, `3 tres`); son enteros del 1 al 10.*

### Las 8 notas

**Todas encontradas y verificadas con `openssl 3.6.2`.** La preimagen es `"<n> <palabra>\n"` — **con el `\n` final**, que es exactamente lo que produce `echo "7 siete" | openssl dgst -sha1`.

| Alumno | Nota | Preimagen exacta | Hash `SHA-1` |
|---|---|---|---|
| garcía | **1** | `1 uno` + `\n` | `86a76e0399c99c1d5b8c8751b7d5240b24b271f3` |
| sanchez | **2** | `2 dos` + `\n` | `7c1dfd9e7a101bc419752f623aa2c09352cac070` |
| rossi | **5** | `5 cinco` + `\n` | `c2fa01c8fdf749547317e985625f2512b2c4e0a6` |
| centurion | **6** | `6 seis` + `\n` | `164c22fd426d4215fc47d38964de80100a24f5ff` |
| acuña | **7** | `7 siete` + `\n` | `1daae8480ce1df09603d3db5388b900e8ce4b880` |
| hernandez | **8** | `8 ocho` + `\n` | `135fc9d048e923597cc806a51ebdcb1ccac553bf` |
| palacios | **10** | `10 diez` + `\n` | `c736e54648efc18698499026ba1779e7785378a2` |
| zubeldia | **10** | `10 diez` + `\n` | `c736e54648efc18698499026ba1779e7785378a2` |

*(No aparecen las notas 3, 4 y 9: ningún alumno del listado se las sacó. No hay nada que inferir de eso.)*

> La misma tabla, leída **desde el lado del candidato** —los diez de la enumeración, con las tres casillas vacías—, está en [[ataque-de-diccionario-sobre-hashes#El Ejercicio 6, hecho|03.15 § El Ejercicio 6, hecho]]. Acá va ordenada por alumno porque es lo que el enunciado pide; allá va ordenada por candidato porque es lo que muestra el ataque.

### El script, y su salida real

El dominio tiene **diez** elementos, así que el "ataque" es escribirlos todos:

```bash
for nota in "1 uno" "2 dos" "3 tres" "4 cuatro" "5 cinco" \
            "6 seis" "7 siete" "8 ocho" "9 nueve" "10 diez"; do
  h=$(echo "$nota" | openssl dgst -sha1 | awk '{print $NF}')
  echo "$h  <-  \"$nota\""
done
```

*(La lista va literal a propósito: un array indexado desde 0 corre bien en `bash` pero **no** en `zsh`, que indexa desde 1 — y el corrimiento no tira ningún error, sólo digests que no coinciden con nada. Esta versión da lo mismo en los dos shells.)*

```
86a76e0399c99c1d5b8c8751b7d5240b24b271f3  <-  "1 uno"
7c1dfd9e7a101bc419752f623aa2c09352cac070  <-  "2 dos"
5be26a99a22052c8359de008244174f9ccd1c234  <-  "3 tres"
56ce34e0fb3b0a8f2432a510486af465ac915b3a  <-  "4 cuatro"
c2fa01c8fdf749547317e985625f2512b2c4e0a6  <-  "5 cinco"
164c22fd426d4215fc47d38964de80100a24f5ff  <-  "6 seis"
1daae8480ce1df09603d3db5388b900e8ce4b880  <-  "7 siete"
135fc9d048e923597cc806a51ebdcb1ccac553bf  <-  "8 ocho"
70785b313d28667133dcb6b387f1de716172b087  <-  "9 nueve"
c736e54648efc18698499026ba1779e7785378a2  <-  "10 diez"
```

**Diez comandos y la tabla está resuelta.** Ahora lo que hace valioso al ejercicio.

### 1. palacios y zubeldia comparten hash, y eso NO es una colisión

Es el punto que más se contesta mal, y es un reflejo que hay que desarmar.

$$\mathsf{SHA\text{-}1}\bigl(\mathsf{nota}(\texttt{palacios})\bigr) \;=\; \mathsf{SHA\text{-}1}\bigl(\mathsf{nota}(\texttt{zubeldia})\bigr) \;=\; \mathsf{SHA\text{-}1}\bigl(\texttt{10 diez}\,\Vert\,\texttt{LF}\bigr) \;=\; \texttt{c736e546}\ldots$$

**Ojo con qué es lo que se hashea: la nota, no el nombre.** El digest que la tabla asocia a `palacios` y el que asocia a `zubeldia` son el mismo, y eso **no es una colisión: es la misma preimagen.** Los dos se sacaron **10**, así que las dos entradas son literalmente la misma cadena `"10 diez\n"`. Una [[resistencias-de-una-funcion-de-hash#Colisión|colisión]] exige $x \ne x'$; acá $x = x'$.

El razonamiento correcto es al revés de como se lo suele enunciar: **hashes iguales sugieren entradas iguales**, y la excepción —la colisión— es tan cara que acá ni hace falta invocarla. ¿Cuánto costaría una colisión real de `SHA-1`? $2^{80}$ evaluaciones por el cumpleaños, y el ataque real más barato que existe, **SHAttered (2017)**, costó $\approx 2^{63}$ y fue noticia mundial → [[seguridad-de-las-funciones-de-hash#La escala física: dónde cae 2 elevado a la 80|03.11]]. Contra eso, la hipótesis *"los dos se sacaron diez"* cuesta cero. **Es el contraejemplo perfecto contra el reflejo de "dos hashes iguales = colisión".**

Y de paso deja ver lo que el esquema filtra aunque no se rompa nada: **el hash es determinístico**, así que dos alumnos con la misma nota tienen el mismo digest **a la vista de cualquiera**. Aunque nadie invirtiera nada —aunque el atacante no consiguiera ni una sola preimagen—, la tabla ya publica **quién sacó lo mismo que quién**. Es una fuga estructural, y es el mismo defecto que prohíbe [[modos-de-encadenamiento#Los cinco modos|ECB]]: toda función determinística aplicada elemento por elemento **preserva la relación de igualdad** → [[ataque-de-diccionario-sobre-hashes#Hashes iguales delatan entradas iguales|03.15 § Hashes iguales delatan entradas iguales]].

### 2. El salto de línea de echo es parte de la preimagen, y sin eso el ejercicio no sale

Si se prueba con `printf '%s' "10 diez"` —sin salto de línea— **no coincide ninguno de los ocho hashes**, y el ejercicio parece irresoluble o mal enunciado. No lo es: quien armó la tabla usó `echo`, y `echo` agrega un `\n` que entra a la función como un byte más.

Es exactamente la trampa que el vault documenta en [[primitivas-de-hash-estandar#Los digests de ejemplo, verificados|03.09 § Los digests de ejemplo, verificados]] —*"el `printf '%s'` en lugar de `echo` es esencial: `echo` agrega un `\n` y el digest cambia por completo"*— y la misma que separa las dos filas de la tabla del [[#Ejercicio 5|Ejercicio 5]].

**La moraleja operativa** *(lectura nuestra)*: cuando reproducís un digest ajeno, **la codificación exacta de la preimagen es parte del problema**, no un detalle. Salto de línea final, `UTF-8` contra `Latin-1`, mayúsculas, espacios: cualquiera de esas cosas cambia el digest entero por el efecto avalancha. Si no coincide, conviene sospechar de la preimagen antes que del algoritmo.

*(Notar que los nombres `acuña` y `garcía` llevan `ñ` y tilde, pero **el nombre no se hashea**: sólo la nota. Así que su codificación es irrelevante acá. Si el ejercicio hubiera hasheado el nombre, esto sería otra trampa.)*

### 3. No se rompió SHA-1: se enumeró un dominio de 10 elementos

**Esto es lo que hay que llevarse del ejercicio.**

`SHA-1` no fue invertida, ni debilitada, ni atacada. Se calcularon **diez** hashes y se compararon contra ocho. El ataque cuesta $10$ evaluaciones, cuando invertir `SHA-1` de verdad cuesta $2^{160}$:

| | Costo |
|---|---|
| Preimagen genérica sobre `SHA-1` | $2^{160}$ |
| Colisión genérica sobre `SHA-1` (cumpleaños) | $2^{80}$ |
| SHAttered, la colisión real de 2017 | $\approx 2^{63}$ |
| **Este ejercicio** | $\mathbf{10}$ |

La cuenta que falla no es la del hash sino la del **dominio**. El hash es **público** y **determinístico**, así que cualquiera puede evaluarlo; si el conjunto de mensajes posibles es chico, **el atacante los prueba todos y compara**. La [[resistencias-de-una-funcion-de-hash#Qué ataque real cubre cada resistencia|resistencia a preimágenes]] está definida sobre una entrada **uniforme** sobre todo el dominio; una nota del 1 al 10 no es uniforme sobre nada. **Un dato de baja entropía no queda protegido por hashearlo**, por buena que sea la función.

Es el mismo escenario que el almacenamiento de contraseñas, sólo que con un diccionario de 10 en vez de $10^{9}$ palabras. Y es el concepto nuevo que la guía introduce y ninguna filmina desarrolla → [[ataque-de-diccionario-sobre-hashes#El costo no es 2 elevado a la 160, es el tamaño del dominio|03.15 § El costo no es 2 elevado a la 160, es el tamaño del dominio]].

### 4. Las contramedidas: salt, pimienta y funciones deliberadamente lentas

Lo que arregla esto **no** es cambiar `SHA-1` por `SHA-256`: con `SHA-256` el ataque sigue costando diez evaluaciones. El costo del atacante es $\lvert D\rvert \cdot c_h$ —tamaño del dominio por costo de una evaluación— y hay que meter mano en alguno de los dos factores, **o sacarle al atacante la posibilidad misma de evaluar $h$**, que es una tercera vía y no está en la fórmula:

- **El salt** — un valor aleatorio y **público**, distinto por registro, que se guarda al lado del digest y se concatena a la entrada antes de hashear. Ataca el **determinismo y la amortización**: dos alumnos con un 10 dejan de tener el mismo digest, y el diccionario hay que rehacerlo **para cada víctima** en vez de una vez para todo el padrón.
- **Una función deliberadamente lenta** —`PBKDF2`, `bcrypt`, `scrypt`, `Argon2`—, que no es un hash sino una **KDF** construida sobre uno, con un factor de trabajo ajustable. Ataca $c_h$ directamente, y es **la única de las dos contramedidas sin clave que mueve la aguja cuando el dominio es chico** — aunque sólo sube el costo, no lo cierra.
- **Un secreto fuera de la base** —la *pimienta*, o directamente $\mathsf{HMAC}_k(\text{nota})$ con $k$ guardada en la configuración de la aplicación y no en la base—. Es la única que **sigue funcionando con $\lvert D\rvert = 10$**, porque sin $k$ el atacante no puede evaluar la función y no hace ni una de las diez cuentas. Lo que se paga: deja de ser hashear y pasa a ser [[message-authentication-code|autenticar con clave]], con el problema nuevo de custodiar y rotar esa clave — y si se filtra junto con la base, no aportó nada.

> **Y la conclusión incómoda, que es la que hay que decir en el parcial:** con $\lvert D\rvert = 10$ **ninguna de las dos contramedidas sin clave alcanza**. La sal es pública, así que el atacante la lee y rehace las diez cuentas; y una KDF cara al orden del medio segundo por evaluación compra **cinco segundos**. La KDF sube el piso, no cierra la puerta.
>
> **No hay defensa criptográfica *sin clave* para un dominio de diez elementos** — cualquier función pública y determinística se enumera. La que sí funciona es **meter un secreto** (`HMAC` con la clave fuera de la base), y la defensa **no criptográfica**, que para el Ej. 6 es la que corresponde, es **no publicar los hashes**.

El desarrollo, con la fórmula, la pimienta y las *rainbow tables*, está en [[ataque-de-diccionario-sobre-hashes#Contramedidas|03.15 § Contramedidas]].

### 5. Y son datos personales

La última observación no es técnica y es la que le da sentido al ejercicio. **La tabla del enunciado publica las calificaciones de ocho personas identificadas por apellido.** Alguien las hasheó pensando que eso las protegía; no las protege. Es una **fuga de privacidad real**, del mismo tipo que las que ocurren cuando se publican datasets *"anonimizados"* reemplazando el identificador por su hash — direcciones de correo, documentos, números de teléfono, todos dominios enumerables o comprables.

El ejercicio está planteado como un juego de descifrado, y conviene leerlo como lo que muestra: **hashear no es anonimizar**.

---

## Qué se lleva al parcial

Las cuatro ideas transferibles de la guía, que valen bastante más que los números puntuales:

**1. Una primitiva fuerte aplicada al argumento equivocado no compra nada.**
Es literalmente la mitad de la guía. En el **Ej. 1**, $\mathsf{Enc}_k(\lvert m\rvert)$ usa un cifrado `CPA`-Secure y no sirve, porque lo aplica a la **longitud** en vez de al contenido. En el **Ej. 2**, `HMAC-SHA256` —el MAC que se usa de verdad— no salva nada, porque lo que el atacante rompe es el **XOR-fold que va antes**. En el **Ej. 6**, `SHA-1` no se rompe: se enumera un **dominio de 10 elementos**. En los tres casos la primitiva está intacta y el sistema cae. La pregunta de parcial no es *"¿es segura la primitiva?"* sino ***"¿sobre qué la estás aplicando, y de qué tamaño es ese espacio?"***.

**2. Para que un MAC sea infalsificable, la etiqueta tiene que depender de todos los bits — y eso es necesario, no suficiente.**
La primera mitad la dicta el docente al derribar el segundo MAC del Ej. 1, y es un **teorema combinatorio**: si $\mathsf{Mac}_k$ ignora un bit, hay $m\ne m^{*}$ con la misma etiqueta **para toda clave**, y ninguna hipótesis criptográfica lo salva. La segunda mitad la aporta el Ej. 2: el XOR-fold **sí** mira todos los bits y cae igual, porque es **lineal** y su núcleo es enorme y explícito. La condición que realmente se necesita, cuando se comprime antes de etiquetar, es **resistencia a colisiones** — es la hipótesis exacta del Teorema 5.6 de K&L, y es lo que descarta el Caso 1 de su demostración. Conviene reconocer el patrón *hash-and-MAC* cuando aparezca disfrazado.

**3. La seguridad de un hash se cuenta sobre el tamaño de la imagen, no sobre la cantidad de bits que escribe.**
El Ej. 3 lo pone en caricatura: 32 bits de salida, imagen de **2** elementos, 1 bit de entropía real, y colisión con probabilidad $1/2$ usando **dos** mensajes en vez de $2^{16}$. La regla que unifica todo es la de [[seguridad-de-las-funciones-de-hash#La consecuencia operativa: L bits de salida dan L/2 bits de seguridad|03.11]]: $L$ bits **efectivos** de salida dan $L$ contra preimágenes y sólo **$L/2$** contra colisiones, por el cumpleaños. De ahí sale también el Ej. 5: `MD5` da $2^{64}$, `SHA-1` da $2^{80}$, y las dos están quebradas igual. Y ojo con el **efecto avalancha como criterio**: la función de juguete del Ej. 3 lo aprueba con 100 % de bits cambiados y no vale nada.

**4. La preimagen es parte del problema, y el dominio también.**
El `\n` de `echo` decide si el **Ej. 6** sale o no sale, y separa las dos filas de la tabla del **Ej. 5**. Cuando un digest no coincide, conviene sospechar de la codificación de la entrada —salto de línea, `UTF-8`, mayúsculas— antes que del algoritmo, porque el efecto avalancha hace que un byte de diferencia se vea igual que un algoritmo distinto. Y el corolario que ordena el Ej. 6 entero: **el hash es público y determinístico**, así que sobre un dato de baja entropía no protege nada y encima **filtra las repeticiones** (palacios y zubeldia comparten digest sin que nadie invierta nada). Las contramedidas **sin clave** son **salt** —contra la amortización entre víctimas— más una **función lenta** —contra el costo por intento—, nunca "usar un hash más largo"; y cuando el dominio es tan chico que ninguna de las dos alcanza, la única que queda del lado criptográfico es **meter un secreto**: `HMAC` con la clave fuera de la base.

---

## Ver también

- [[guia-03-mac-y-funciones-de-hash|Guía 3 — MAC y Funciones de Hash]] — los seis enunciados transcriptos, con el tablero de estado
- [[guia-02-resolucion|Guía 2 — Resolución]] — la guía anterior, sobre criptografía simétrica
- [[clase-03-macs-y-cifrado-autenticado|Clase 03 — MACs y cifrado autenticado]] — la teoría del 27/08 y del 03/09, que es la que esta guía practica
- [[seguridad-de-un-mac|Seguridad de un MAC]] — **el Ejercicio 1 entero**, resuelto en clase y transcripto, más el experimento `Mac-Forge` del Ejercicio 2
- [[message-authentication-code|Message Authentication Code]] — la terna $(\mathsf{Gen},\mathsf{Mac},\mathsf{Vrfy})$ y las tres diferencias con el criptosistema (Ejercicios 1, 2 y 4a)
- [[cbc-mac|CBC-MAC]] — la construcción, la comparación con el modo `CBC` y las tres extensiones seguras: el Ejercicio 4 a, b y c
- [[modos-de-encadenamiento|Modos de encadenamiento]] — el `CBC` de cifrado contra el que se compara el Ejercicio 4b
- [[resistencias-de-una-funcion-de-hash|Resistencias de una función de hash]] — los "tres niveles de seguridad" del Ejercicio 3a, y la jerarquía entre ellos
- [[seguridad-de-las-funciones-de-hash|Seguridad de las funciones de hash]] — la paradoja del cumpleaños y la regla $L/2$ de los Ejercicios 3b, 5c y 6
- [[construccion-de-merkle-damgard|Construcción de Merkle-Damgård]] — el Ejercicio 4d, con el teorema y el *length extension*
- [[hmac|HMAC]] — el paradigma *hash-and-MAC* que el Ejercicio 2 instancia mal a propósito
- [[primitivas-de-hash-estandar|Primitivas de hash estándar]] — `MD5` y `SHA-1`, su estado y cómo reproducir digests: Ejercicios 5 y 6
- [[ataque-de-diccionario-sobre-hashes|Ataque de diccionario sobre hashes]] — el concepto que sale del Ejercicio 6: baja entropía, salt y funciones lentas
- [[funciones-de-hash-criptograficas|Funciones de hash criptográficas]] — qué se le pide a un hash, más allá de aceptar dominio ilimitado (Ejercicio 3a)
- [[maleabilidad|Maleabilidad]] — la aritmética del XOR que el Ejercicio 2 reutiliza en la [[#Familia 2 — anexar bloques que se cancelan|Familia 2]]
- [`G3-Ej2-xor-mac.py`](../../raw/guias/guia3/G3-Ej2-xor-mac.py) — la implementación del Ejercicio 2b, con las tres familias de colisión
- [[bibliografia|Bibliografía]] — Katz & Lindell, **cap. 4** (MACs, lectura designada de la Clase 03) y **cap. 5** (funciones de hash), que son los dos capítulos de esta guía
- [[cronograma|Cronograma]] — la guía se da el 07/09
