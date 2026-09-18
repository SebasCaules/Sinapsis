---
title: Cifrado híbrido
resumen: 'Cifrar con la clave pública una clave simétrica fresca y con esa clave el mensaje: la construcción que vuelve utilizable en volumen al cifrado asimétrico, CPA-segura si el esquema de clave pública lo es y el simétrico resiste una sola escucha. Es lo que TLS y PGP hacen, y sólo la Práctica 05 la escribe.'
fuentes: ["[[practica-05-de-la-clave-privada-a-la-clave-publica]]", "[[criptosistema-asimetrico]]", "[[costo-del-cifrado-asimetrico]]", "[[tls-arquitectura-y-record]]"]
aliases: [Cifrado híbrido, Hybrid encryption, Esquema híbrido, KEM/DEM, Encapsulamiento de clave, Key encapsulation mechanism, KEM]
type: concepto
unidad: 1
clase: 4
orden: 13
created: 2026-09-15
updated: 2026-09-15
tags: [criptografia, cifrado-hibrido, clave-publica, cpa-secure, kem, tls, clase-04, practica-05]
sources: ["raw/practicas/Clase 5.pdf (Práctica 5, 14/09/2026)", "Katz y Lindell - Introduction to Modern Cryptography.pdf"]
---

# Cifrado híbrido

**La construcción que convierte un esquema de clave pública en algo con lo que se puede cifrar un archivo, y no sólo un número menor que $N$.** Es lo que hay debajo de la frase *"combina cifrado simétrico y asimétrico"* con la que la cátedra describe la confidencialidad de `TLS`, y es el destino práctico de casi todo lo que la [[clase-04-criptografia-asimetrica-y-firma-digital|Clase 04]] construye: `RSA` y El Gamal casi nunca cifran mensajes; cifran **claves**.

> **Fuentes de esta nota.** La **filmina 15 de la [[practica-05-de-la-clave-privada-a-la-clave-publica|Práctica 05]]** (14/09), que trae la terna completa y las dos hipótesis del teorema, y **Katz & Lindell §11.3** —figura 11.1, Construcción 11.10 y Teorema 11.12, en la edición que está en `raw/`—. **Ninguna filmina de teoría de la Clase 04 la menciona, y la transcripción del 10/09 tampoco**: es la única construcción con teorema de toda la práctica que no tiene otra fuente en la cátedra. La Clase 05, que la usa dentro de `TLS`, no se dictó al 15/09.

## La construcción

Sean $\Pi = (\mathsf{Gen}, \mathsf{Enc}, \mathsf{Dec})$ un [[criptosistema-asimetrico|criptosistema asimétrico]] y $\Pi' = (\mathsf{Gen}', \mathsf{Enc}', \mathsf{Dec}')$ un [[criptosistema|criptosistema simétrico]] con claves de $n$ bits. El esquema híbrido $\Pi^{hy}$ es, tal como lo escribe la práctica:

$$\begin{aligned}
\mathsf{Gen}^{hy}(1^{n})&:\ (pk, sk) \leftarrow \mathsf{Gen}(1^{n}).\ \text{Las claves son las de } \Pi.\\[4pt]
\mathsf{Enc}^{hy}_{pk}(m)&:\ \text{elegir } k \leftarrow \{0,1\}^{n};\\
&\quad c_1 \leftarrow \mathsf{Enc}_{pk}(k) &&\text{cifrado asimétrico de la clave}\\
&\quad c_2 \leftarrow \mathsf{Enc}'_{k}(m) &&\text{cifrado simétrico del mensaje}\\
&\quad \text{emitir } (c_1, c_2)\\[4pt]
\mathsf{Dec}^{hy}_{sk}(c_1, c_2)&:\ k := \mathsf{Dec}_{sk}(c_1);\quad m := \mathsf{Dec}'_{k}(c_2)
\end{aligned}$$

**Tres observaciones sobre lo que es y lo que no es:**

- **Es un esquema de clave pública.** Emisor y receptor no comparten ningún secreto de antemano: la clave $k$ nace en el emisor, viaja dentro de $c_1$ y sólo el dueño de $sk$ la recupera. Que adentro haya cifrado simétrico no cambia la interfaz — quien cifra sólo necesita $pk$.
- **La clave $k$ es de un solo uso.** Se sortea en cada llamada a $\mathsf{Enc}^{hy}$. Dos mensajes al mismo destinatario viajan bajo dos claves simétricas distintas, y ése es el hecho del que depende la hipótesis del teorema.
- **El criptograma tiene dos partes de naturaleza distinta**: $c_1$ mide lo que mida un criptograma de $\Pi$ —el tamaño de $N$ en `RSA`—, y $c_2$ mide lo que mida el mensaje más lo que agregue el modo simétrico. Para un mensaje largo, casi todo el criptograma es $c_2$.

## El teorema, y por qué la hipótesis débil alcanza

La burbuja de la filmina 15 dice: **`CPA` seguro siempre que $\Pi$ sea `CPA` seguro y $\Pi'$ sea seguro ante eavesdropping.** Es el Teorema 11.12 de Katz & Lindell, y la parte que vale la pena entender es **por qué a $\Pi'$ se le pide tan poco**.

Ser `CPA`-seguro, en el mundo simétrico, es resistir a un adversario que consigue cifrados de mensajes que él elige **bajo la misma clave**, tantos como quiera → [[pruebas-de-indistinguibilidad|Pruebas de indistinguibilidad]]. Acá eso nunca ocurre: cada clave $k$ cifra **exactamente un** mensaje y se descarta. El adversario que ataca a $\Pi^{hy}$ puede pedir todos los cifrados que quiera, pero cada uno le llega bajo una $k$ nueva, y sobre una $k$ dada sólo ve un criptograma. Lo único que hace falta de $\Pi'$ es, entonces, que **un solo** criptograma bajo una clave uniforme no revele nada del mensaje: la prueba `Eav` de la [[clase-02-cifrado|Clase 02]], la más débil de todas. Un [[criptosistema-de-flujo|cifrado de flujo]] construido sobre un [[generador-pseudoaleatorio|generador seudoaleatorio]] —$c_2 = G(k) \oplus m$— cumple, y no es `CPA`-seguro por sí solo; ni siquiera hace falta un `IV`.

Lo que sí tiene que ser `CPA`-seguro es $\Pi$, porque $pk$ es pública y el adversario puede cifrar claves por su cuenta — y en el mundo asimétrico eso ya lo exige la propia prueba `Eav`, como muestra [[criptosistema-asimetrico#Por qué el pk público lo cambia todo|Criptosistema asimétrico]]: `Textbook RSA`, determinístico, **no sirve** como $\Pi$; `RSA` con el relleno de [[pkcs1-y-tamano-de-claves|PKCS#1]] o [[el-gamal|El Gamal]] sí.

> **Qué pasa con `CCA`** *(precisión nuestra, del mismo capítulo)*. El teorema que enuncia la práctica es de `CPA`. Para que $\Pi^{hy}$ sea `CCA`-seguro hacen falta las dos hipótesis fuertes: $\Pi$ `CCA`-seguro **y** $\Pi'$ `CCA`-seguro —o sea, con [[cifrado-autenticado|cifrado autenticado]] del lado simétrico—. Ahí la clave de un solo uso ya no ahorra nada, porque el adversario de `CCA` manipula criptogramas, no pide cifrados. Es exactamente la combinación de `TLS` 1.3: un intercambio de claves más un `AEAD`.

## Por qué existe: la cuenta de la eficiencia

La motivación es la única desventaja que la práctica le anota a los esquemas asimétricos en su filmina 9: **"más lento"**. Cifrar un mensaje largo directamente con $\Pi$ obliga a partirlo en bloques menores que $N$ y a hacer una exponenciación modular por bloque; el costo y el tamaño del criptograma crecen con un factor $\lceil \lvert m\rvert / \ell \rceil$.

Con el híbrido, si $\alpha$ es el costo de cifrar una clave con $\Pi$ y $\beta$ el costo **por bit** de cifrar con $\Pi'$, cifrar $m$ cuesta

$$\frac{\alpha + \beta\,\lvert m\rvert}{\lvert m\rvert} = \frac{\alpha}{\lvert m\rvert} + \beta \quad\text{por bit},$$

que tiende a $\beta$ a medida que $m$ crece: **el precio de la parte asimétrica se paga una vez por mensaje, no por bloque**, y para mensajes largos el esquema cuesta lo mismo que el cifrado simétrico. Katz & Lindell ponen el ejemplo de un mensaje de 1 MB, donde el híbrido mejora el costo de cómputo por un factor cercano a 700 —y el tamaño del criptograma a la mitad— respecto de cifrar bloque por bloque con el esquema de clave pública. Es la respuesta operativa a lo que [[costo-del-cifrado-asimetrico|Costo del cifrado asimétrico]] deja planteado: los bits asimétricos y los simétricos no se comparan, así que **se usa cada uno para lo que sirve** — el asimétrico para mover una clave corta, el simétrico para mover los datos.

## KEM/DEM: la misma idea con nombre propio

El libro reescribe la construcción con una primitiva hecha a medida: un **mecanismo de encapsulamiento de clave** (`KEM`), $(\mathsf{Gen}, \mathsf{Encaps}, \mathsf{Decaps})$, donde $\mathsf{Encaps}_{pk}(1^{n})$ **no recibe ningún mensaje**: devuelve un criptograma $c$ y una clave $k$ de una sola vez, y $\mathsf{Decaps}_{sk}(c)$ recupera $k$. El cifrado simétrico que después usa $k$ se llama, por simetría, `DEM` (*data encapsulation mechanism*). El híbrido de la práctica es el caso particular más simple —*"cualquier esquema de clave pública da trivialmente un `KEM`, eligiendo una clave al azar y cifrándola"*— y los `KEM` dedicados son más eficientes: en `RSA`, por ejemplo, se puede tomar $r$ al azar, mandar $c = r^{e} \bmod N$ y derivar $k = H(r)$ sin cifrar ninguna clave. La palabra reaparece en la criptografía poscuántica, donde los estándares nuevos de intercambio de claves **son** `KEM` y no esquemas de cifrado.

## Dónde se lo ve, y dónde ya estaba en el vault

- **`TLS`.** La filmina 20 de la Práctica 05 resume la confidencialidad de `TLS` como *"combina cifrado simétrico y asimétrico"*: es esta construcción, con el intercambio de claves del *handshake* —`RSA` o Diffie-Hellman— en el lugar de $c_1$ y el cifrado del récord en el lugar de $c_2$ → [[tls-handshake|TLS handshake]] y [[tls-arquitectura-y-record|TLS: arquitectura y record]]. Con Diffie-Hellman el "`KEM`" ni siquiera cifra una clave: las dos partes la derivan.
- **`PGP` y el correo cifrado.** El destinatario tiene un par de claves de largo plazo; cada mensaje lleva una clave de sesión cifrada con su $pk$ y el cuerpo cifrado con esa clave. Es el esquema de la filmina 15 tal cual.
- **El Gamal como híbrido en miniatura.** [[el-gamal|El Gamal]] deriva una máscara $h^{y}$ de un secreto Diffie-Hellman y la aplica al mensaje: es un `KEM` (la parte $g^{y}$) más un `DEM` de un solo bloque (la multiplicación por la máscara), y su variante sobre curvas, `ECIES`, es literalmente `KEM` + cifrado simétrico.
- **Lo que el vault decía antes de esta nota** era una frase en [[costo-del-cifrado-asimetrico#Los bits asimétricos y los simétricos no se comparan uno a uno|Costo del cifrado asimétrico]] y otra en El Gamal, las dos de pasada. La práctica es la que puso la terna sobre la mesa.

## Para el parcial

Es material de la práctica y no de la teoría, así que no tiene todavía el respaldo de una voz que diga "esto se toma". Lo que sí se puede anticipar, con la forma de los [[parciales-viejos|parciales viejos]]:

- **Verdadero o falso: "en un esquema híbrido el cifrado simétrico tiene que ser `CPA`-seguro".** Falso: basta con que resista una sola escucha, porque la clave se usa una vez. Es la trampa natural de este tema, y la práctica la escribe bien.
- **Verdadero o falso: "un esquema híbrido es un esquema simétrico, porque el mensaje viaja cifrado con una clave simétrica".** Falso: quien cifra sólo necesita $pk$; no hay secreto compartido de antemano.
- **"¿Por qué `TLS` no cifra el tráfico con `RSA`?"** Por la cuenta de la sección anterior: el asimétrico se paga una vez por sesión, para acordar la clave; el volumen va por simétrico, mil veces más barato por bit. Y por seguridad: `Textbook RSA` no es `CPA`-seguro, y con relleno no es `CCA`-seguro — el híbrido con un `AEAD` sí puede serlo.
- **La analogía con la firma.** La [[firma-digital|firma digital]] hace lo mismo del lado de la integridad: se firma **una vez** para acordar una clave, y el tráfico se autentica con un `MAC`, *"más eficiente"* en la propia tabla de la filmina 16 de la práctica. Reconocer el patrón —asimétrico para establecer, simétrico para operar— vale para los dos.
