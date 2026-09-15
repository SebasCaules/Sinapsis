---
title: 'Asimétrica: lo más parecido a un parcial está en la Guía 4'
resumen: 'Ningún parcial viejo tomó cuentas de asimétrica, así que esta página reúne los cuatro ejercicios de la Guía 4 más parecidos a un parcial (Diffie-Hellman a tres, Diffie-Hellman firmado y su ataque, y los dos ataques a textbook RSA) con respuesta modelo y tips, y cierra con tres ejercicios con números inventados y verificados.'
fuentes: ["[[parciales-viejos]]", "[[guia-04-manejo-de-claves-cifrado-asimetrico-y-firma-digital]]", "[[diffie-hellman]]", "[[rsa]]", "[[rsa-signature-y-hashed-rsa]]", "[[firma-digital]]", "[[criptosistema-asimetrico]]", "[[el-gamal]]"]
aliases: [Asimétrica en la Guía 4 (parcial), Ejercicios de asimétrica parecidos a un parcial, Práctica con números de RSA y Diffie-Hellman para el parcial]
type: parcial
clase: 1p
orden: 23
created: 2026-09-14
updated: 2026-09-14
tags: [parcial, primer-parcial, cuentas-de-asimetrica, guia-04, diffie-hellman, rsa, firma-digital]
sources: ["raw/guias/guia4/Guia 4 - Manejo de claves - Cifrado Asimétrico - Firma Digital.pdf"]
---

# Asimétrica: lo más parecido a un parcial está en la Guía 4

Esta página no es «los que ya se tomaron»: **ningún parcial viejo tomó cuentas de asimétrica**. En los cuatro parciales de [[parciales-viejos|Parciales viejos]] no hay un solo `RSA`, El Gamal ni firma con números. Diffie-Hellman apareció una vez, en el [[parciales-viejos#1C-2025|1C-2025]] Ej. 1, y se tomó como protocolo —qué es, por qué el módulo tiene que ser primo, dónde reside la seguridad y qué problemas tiene—, sin cuentas; está resuelto en [[1p-protocolos-en-parciales-viejos|Protocolos en los parciales viejos]]. Por eso lo que sigue son los cuatro ejercicios de la [[guia-04-manejo-de-claves-cifrado-asimetrico-y-firma-digital|Guía 4]] que más se parecen a lo que puede tomarse de la Clase 4 —dos de Diffie-Hellman y dos ataques a *textbook* `RSA`—, cada uno con enunciado completo, respuesta modelo y tips, y al final tres ejercicios con números inventados para practicar la aritmética que la guía no trae. Todas las cuentas están verificadas con Python.

La receta y las trampas de este tipo están en [[1p-cuentas-de-asimetrica|Cuentas de asimétrica: RSA, Diffie-Hellman, El Gamal y firma]]; la sección entera empieza en [[primer-parcial|Primer parcial]].

## Guía 4 · Ej. 6 — Diffie-Hellman entre tres

### Enunciado

Considera el protocolo de intercambio de claves Diffie Hellman y escribe la secuencia de pasos para que en lugar de ser 2 los participantes que generan una clave compartida sean 3.

### Respuesta modelo

Los tres comparten los parámetros públicos $(G, q, g)$: un grupo, su tamaño y un generador. Cada parte sortea su exponente secreto, $A$ elige $a$, $B$ elige $b$, $C$ elige $c$, todos en $\mathbb{Z}_q$. La clave buscada es $K = g^{abc}$, y se obtiene en dos rondas sobre el anillo $A \to B \to C \to A$, donde cada uno **toma lo que recibió, lo eleva a su propio exponente y lo pasa al siguiente**:

$$\begin{aligned}
\textbf{Ronda 1}\quad &A \to B:\ g^{a} \qquad B \to C:\ g^{b} \qquad C \to A:\ g^{c}\\[4pt]
\textbf{Ronda 2}\quad &B \to C:\ (g^{a})^{b} = g^{ab} \qquad C \to A:\ (g^{b})^{c} = g^{bc} \qquad A \to B:\ (g^{c})^{a} = g^{ca}\\[4pt]
\textbf{Cálculo}\quad &A:\ (g^{bc})^{a} = g^{abc} \qquad B:\ (g^{ca})^{b} = g^{abc} \qquad C:\ (g^{ab})^{c} = g^{abc}
\end{aligned}$$

**Correctitud.** Las tres cuentas dan lo mismo por la conmutatividad del exponente, $g^{bca} = g^{cab} = g^{abc}$, la misma propiedad $(g^{a})^{b} = (g^{b})^{a}$ que hace funcionar el protocolo a dos. En la primera ronda circulan los valores de un exponente; en la segunda, los de dos; al final cada uno agrega el tercero.

**Qué viaja y qué no.** Por el canal pasan seis mensajes, $g^{a}, g^{b}, g^{c}, g^{ab}, g^{bc}, g^{ca}$, dos por participante. Los exponentes $a, b, c$ nunca se transmiten, y $g^{abc}$ tampoco: cada uno lo calcula localmente. Un adversario pasivo ve los seis valores y tiene que producir $g^{abc}$, una generalización directa del problema Diffie-Hellman, que se cree tan difícil como el caso de dos bajo la misma hipótesis `DDH`.

**Costo.** Cada parte hace tres exponenciaciones (una por ronda más la final) contra dos en el protocolo original, y hay una ronda más de latencia. Con $n$ participantes este esquema de anillo necesita $n-1$ rondas y $n(n-1)$ exponenciaciones en total: escala mal.

**Lo que no cambia.** Sigue sin haber autenticación: Mallory puede interponerse en cualquiera de los seis mensajes y terminar con claves distintas con cada participante, exactamente como en el ataque de intermediario a dos. Tres partes no arreglan lo que dos no arreglaban.

### Tips

- Toda la respuesta cabe en una regla: cada uno eleva lo que recibió a su exponente y lo pasa al siguiente. Escribir las dos rondas como bloque alineado o tabla, y el cálculo final aparte.
- Decir explícitamente qué viaja y qué no: seis mensajes, ningún exponente, nunca $g^{abc}$. Es lo que muestra que se entendió qué protege el protocolo.
- Cerrar con el costo y con el atacante activo; son los dos puntos que separan una respuesta completa de una que solo escribe las flechas.
- Reciclable: la conmutatividad del exponente es la misma justificación de la clave compartida que pide el Diffie-Hellman a dos del 1C-2025 Ej. 1.

## Guía 4 · Ej. 7 — Diffie-Hellman firmado y el ataque que sobrevive a las firmas

### Enunciado

Considera un protocolo normal de intercambio de claves Diffie–Hellman con autenticación. El objetivo es proveer autenticación mutua con intercambio de claves. Asumimos que cada parte tiene una clave privada para firmar en algún esquema de firma y un certificado con la correspondiente clave pública. El protocolo procede de la siguiente manera:

$$\begin{aligned}
&1)\ A \to B:\ g^{x}\\
&2)\ B \to A:\ \{B,\ \mathrm{cert}_B,\ S_B(g^{x}, g^{y}),\ g^{y}\}\\
&3)\ A \to B:\ \{A,\ \mathrm{cert}_A,\ S_A(g^{x}, g^{y})\}
\end{aligned}$$

Finalmente, Alice y Bob pueden calcular la clave compartida y secreta $K = g^{xy}$.

**a)** Explicar el por qué de las firmas en el protocolo anterior.

**b)** Mostrar que un atacante activo, Mallory, puede interferir con el protocolo mediante un ataque *man in the middle* tal que al final tendremos la siguiente situación:

- Alice cree que se está comunicando de forma segura con Bob
- Pero Bob cree que se está comunicando de forma segura con Mallory

### Respuesta modelo

**a)** Diffie-Hellman sin nada es seguro solo contra un adversario pasivo: un atacante activo reemplaza $g^{x}$ y $g^{y}$ por valores propios y termina compartiendo una clave con cada víctima. El protocolo requiere un **canal autenticado**, y las firmas son ese canal. $S_B(g^{x}, g^{y})$ (firma con la clave privada de Bob, $K_{sB}$ en la notación de la guía) le prueba a Alice que quien conoce $K_{sB}$ vio exactamente estos dos valores, el $g^{x}$ que ella envió y el $g^{y}$ que recibe, y los avala. Si Mallory hubiera reemplazado $g^{x}$ por $g^{m}$ en el mensaje 1, Bob habría firmado $(g^{m}, g^{y})$, y Alice, al verificar la firma contra el $g^{x}$ que ella envió, la rechazaría. Simétricamente, $S_A(g^{x}, g^{y})$ le prueba a Bob que Alice avala el mismo par. Los certificados son lo que ata cada clave de verificación a un nombre: sin $\mathrm{cert}_B$, Alice tendría una firma válida bajo una clave pública cualquiera. En resumen, la firma **ata los valores efímeros a una identidad** e impide la sustitución de $g^{x}$ o $g^{y}$; con las firmas verificadas, $K = g^{xy}$ solo la pueden calcular quienes conocen $x$ e $y$.

**b)** La firma cubre los valores, pero no dice para quién son: $S_A(g^{x}, g^{y})$ certifica que Alice avala el par, no que Alice esté hablando con Bob. Y $g^{x}$, $g^{y}$ son públicos: cualquiera puede firmarlos con su propia clave. Mallory, que tiene un certificado propio $\mathrm{cert}_M$ legítimo, deja pasar los mensajes 1 y 2 sin tocarlos y **reemplaza el mensaje 3 entero**:

$$\begin{aligned}
&1)\ A \to M:\ g^{x} \qquad M \to B:\ g^{x} \quad\text{(lo reenvía tal cual)}\\
&2)\ B \to M:\ \{B, \mathrm{cert}_B, S_B(g^{x}, g^{y}), g^{y}\} \qquad M \to A:\ \{B, \mathrm{cert}_B, S_B(g^{x}, g^{y}), g^{y}\} \quad\text{(tal cual)}\\
&3)\ A \to M:\ \{A, \mathrm{cert}_A, S_A(g^{x}, g^{y})\} \qquad M \to B:\ \{M, \mathrm{cert}_M, S_M(g^{x}, g^{y})\}
\end{aligned}$$

Como $g^{x}$ y $g^{y}$ son los que Bob ya vio, $S_M(g^{x}, g^{y})$ es una firma válida de Mallory sobre el par correcto y $\mathrm{cert}_M$ es un certificado legítimo: Bob verifica todo y concluye que está hablando con Mallory y que comparten $g^{xy}$. Del lado de Alice, el mensaje 2 llegó intacto, con la firma y el certificado de Bob sobre el par correcto: concluye que está hablando con Bob y que comparten $g^{xy}$. **Resultado:** Alice y Bob comparten de verdad la clave $K = g^{xy}$ —Mallory no la conoce, porque no tiene $x$ ni $y$— pero Bob la atribuye a Mallory. Es la situación exacta del enunciado. Lo que Mallory gana no es leer el tráfico sino **la atribución**: todo lo que Alice envíe cifrado con $K$, Bob lo tomará como venido de Mallory; si el protocolo se usa para autenticar un pago, el pago de Alice queda registrado a nombre de Mallory. En la literatura es un ataque de mala atribución de identidad (*identity misbinding* o *unknown key-share*): las partes acuerdan una clave, pero no acuerdan con quién.

**Qué le falta al protocolo.** Que la firma incluya la identidad del interlocutor, $S_A(g^{x}, g^{y}, B)$ y $S_B(g^{x}, g^{y}, A)$: entonces Mallory no puede reemplazar el mensaje 3 sin firmar $(g^{x}, g^{y}, B)$ como si fuera Alice. Alternativamente, se agrega a cada mensaje un MAC bajo la clave derivada de $g^{xy}$ sobre la identidad del emisor, como hace el protocolo STS: Mallory no conoce $g^{xy}$ y no puede fabricarlo. Las dos soluciones dicen lo mismo: lo que se firma o cifra tiene que decir de quién a quién.

### Tips

- La frase que vale el ejercicio: **firmar los mensajes no es autenticar el protocolo**. Decir con precisión qué cubre cada firma (el par de valores) y qué no (con quién se habla).
- Escribir el ataque en tres líneas, marcando que los mensajes 1 y 2 pasan intactos y solo el 3 se reemplaza. El corrector tiene que ver que Mallory no rompe ninguna firma ni ningún certificado.
- Aclarar que Mallory no obtiene $K$ y que el daño es la atribución, no la confidencialidad: es exactamente la situación que pide el enunciado, y confundirla con el ataque clásico (dos claves distintas) es responder otro ejercicio.
- Dar el arreglo, identidades dentro de la firma o MAC bajo la clave derivada: son los últimos puntos, y son los que muestran que se entendió la causa.
- Reciclable: el inciso a) es la respuesta estándar a «por qué Diffie-Hellman necesita un canal autenticado», que aparece en el 1C-2025 Ej. 1.

## Guía 4 · Ej. 16 — Textbook RSA para firma: el ataque de no mensaje

### Enunciado

1. Mostrar que Textbook `RSA` para firma es inseguro (**ataque de no mensaje**) usando $m = \sigma^{e} \bmod N$.
2. ¿Por qué se reduce el riesgo de este ataque si se usa Hash `RSA`?

### Respuesta modelo

**1.** En *textbook* `RSA` para firma, $\mathsf{Sign}_{sk}(m) = m^{d} \bmod N$ y $\mathsf{Vrfy}_{pk}(m, \sigma) = 1 \iff \sigma^{e} \equiv m \pmod N$. El adversario conoce $pk = (N, e)$ y, **sin consultar el oráculo de firma ni una vez**, hace:

$$\sigma \leftarrow \mathbb{Z}_N^{*} \text{ (al azar)}, \qquad m := \sigma^{e} \bmod N, \qquad \text{emitir } (m, \sigma)$$

La verificación calcula $\sigma^{e} \bmod N$ y lo compara con $m$: son iguales por construcción, así que $\mathsf{Vrfy}_{pk}(m, \sigma) = 1$. Como no pidió ninguna firma, $Q = \varnothing$ y $m \notin Q$ trivialmente:

$$\Pr[\mathsf{Sig\text{-}forge}_{A,\Pi} = 1] = 1$$

El esquema no es infalsificable, y se rompe con cero consultas; de ahí el nombre: el adversario no eligió qué mensaje firmar, eligió la firma y dejó que el mensaje saliera de ella. Lo que lo hace posible es que **la verificación es una función pública que va de firmas a mensajes**: para cualquier $\sigma$, $\sigma^{e} \bmod N$ es el mensaje del que $\sigma$ es firma válida. No se rompe `RSA`, no se factoriza $N$ ni se calcula $d$: se usa la fórmula de verificación al revés. Que el $m$ obtenido sea un número sin sentido no salva al esquema: `Sig-forge` cuenta como falsificación cualquier par válido con $m$ nuevo, y la estructura multiplicativa de `RSA` muestra que la falsificación no se queda en mensajes al azar, porque con dos firmas legítimas se fabrica una tercera sobre $m_1 \cdot m_2$. Con números: $N = 55$, $e = 7$ y $\sigma = 2$ dan $m = 2^{7} \bmod 55 = 18$, y $(18, 2)$ verifica sin que nadie lo haya firmado.

**2.** En Hashed `RSA`, $\mathsf{Sign}_{sk}(m) = H(m)^{d} \bmod N$ y $\mathsf{Vrfy}_{pk}(m, \sigma) = 1 \iff \sigma^{e} \equiv H(m) \pmod N$. El adversario puede repetir el paso, elegir $\sigma$ y calcular $y := \sigma^{e} \bmod N$, pero ahora $y$ no es un mensaje: es **el hash que el mensaje tendría que tener**. Para emitir un par válido necesita un $m$ tal que $H(m) = y$, es decir una **preimagen** de un valor que no eligió, sobre una función resistente a preimágenes; con un hash de 256 bits eso cuesta del orden de $2^{256}$ evaluaciones. El riesgo se **reduce** y no se elimina, que es la palabra que el enunciado elige: el ataque sigue siendo posible en principio, la seguridad pasa a descansar también en $H$ (un ataque de preimagen contra el hash lo revive), y Hashed `RSA` no tiene prueba de seguridad salvo en un modelo ideal de $H$. De paso, el hash destruye la estructura multiplicativa ($H(m_1) H(m_2)$ no es el hash de nada conocido) y fija el tamaño de la firma independientemente del tamaño del mensaje.

### Tips

- La cuenta es una línea, $\sigma$ al azar y $m := \sigma^{e}$; lo que vale puntos es correrla contra `Sig-forge` (cero consultas, $m \notin Q$, probabilidad $1$) y decir por qué funciona: la verificación es pública y va de firmas a mensajes.
- No confundirlo con romper `RSA`: no se factoriza ni se obtiene $d$. Decirlo explícitamente.
- En el punto 2 la palabra clave es **preimagen**, y la palabra del enunciado es «reduce»: explicar por qué no «elimina».
- Reciclable: es el argumento de por qué siempre se firma $H(m)$ y no $m$, que sirve en cualquier pregunta sobre firma `RSA`.

## Guía 4 · Ej. 17 — Textbook RSA para cifrado no es CCA-seguro

### Enunciado

Mostrar que Textbook `RSA` para cifrado no es seguro ante `CCA` (ataque de cifrado elegido) debido a la propiedad:

$$\forall\, m, m':\ (m \cdot m')^{e} = m^{e} \cdot m'^{e} \bmod N$$

### Respuesta modelo

*Textbook* `RSA` ni siquiera es `CPA`-seguro —es determinístico, y en el juego `Eav` asimétrico el adversario puede cifrar $m_0$ y $m_1$ por su cuenta y comparar—, así que a fortiori no es `CCA`-seguro. Pero el ejercicio pide un ataque que use el **oráculo de descifrado**, y que por lo tanto funcionaría incluso contra una versión que hubiera arreglado el determinismo pero no la maleabilidad. En el juego `CCA` asimétrico el adversario tiene $pk = (N, e)$, con lo que cifra solo, y un oráculo de descifrado que acepta cualquier $c \ne c^{*}$:

$$\begin{aligned}
&1)\ A \text{ emite } m_0 \ne m_1 \text{ cualesquiera, y recibe } c^{*} = m_b^{\,e} \bmod N.\\
&2)\ A \text{ elige } s \in \mathbb{Z}_N^{*} \text{ con } s \ne 1 \text{ y calcula } c' := c^{*} \cdot s^{e} \bmod N = (m_b \cdot s)^{e} \bmod N, \text{ con } c' \ne c^{*}.\\
&3)\ A \text{ le da } c' \text{ al oráculo de descifrado, que devuelve } m' = (c')^{d} = m_b \cdot s \bmod N.\\
&4)\ A \text{ calcula } m_b = m' \cdot s^{-1} \bmod N, \text{ lo compara con } m_0 \text{ y } m_1, \text{ y emite } b' \text{ en consecuencia.}
\end{aligned}$$

$$\Pr[\mathsf{CCA}_{A,\Pi} = 1] = 1$$

Una consulta, y el adversario recupera el mensaje entero, no solo el bit $b$. La consulta es legal porque $c' \ne c^{*}$ (basta $s \ne 1$), y el oráculo no tiene forma de saber que $c'$ deriva de $c^{*}$: es un criptograma válido de $m_b \cdot s$. El inverso $s^{-1}$ existe porque $s$ es coprimo con $N$. La propiedad del enunciado es exactamente la culpable: dice que **cifrar respeta el producto**, así que quien tiene un criptograma de un mensaje desconocido puede fabricar, sin conocer el mensaje, el criptograma de cualquier múltiplo suyo multiplicando por $s^{e}$. Es maleabilidad en su forma más limpia, y `CCA` es la prueba diseñada para castigarla: un oráculo de descifrado más un criptograma maleable es un oráculo de descifrado del desafío. Con números: $N = 55$, $e = 7$, $c^{*} = 9^{7} \bmod 55 = 4$; con $s = 2$, $c' = 4 \cdot 2^{7} = 512 \equiv 17$; el oráculo devuelve $17^{23} \bmod 55 = 18 = 9 \cdot 2$, y $m_b = 18 \cdot 2^{-1} \bmod 55 = 18 \cdot 28 = 504 \equiv 9$. El relleno aleatorio de `PKCS#1 v1.5` rompe la homomorfía a nivel de mensajes ($m_b \cdot s$ ya no tiene relleno válido y el oráculo devuelve error), pero no alcanza: el error mismo es una señal, y con miles de consultas que solo responden «relleno válido o inválido» se reconstruye $m_b$ usando esta misma propiedad (ataque de Bleichenbacher). Lo arregla `RSA-OAEP`, donde cualquier modificación del criptograma descifra a basura sin estructura.

### Tips

- El molde del ataque `CCA` contra un esquema maleable es siempre el mismo: transformar $c^{*}$ en un $c' \ne c^{*}$ relacionado, pedir su descifrado y deshacer la transformación. Aquí la transformación es multiplicar por $s^{e}$; en un cifrado de flujo sería un XOR.
- Decir por qué la consulta es legal ($c' \ne c^{*}$) y por qué el inverso existe ($\gcd(s, N) = 1$): son los dos detalles que el corrector busca.
- Mencionar que ya no era `CPA`-seguro por determinismo, pero que el ataque que vale es el del oráculo, porque sobrevive a arreglar el determinismo.
- Reciclable: la misma propiedad es la del ataque multiplicativo a la firma (Ej. 16), y es la razón por la que `PKCS#1 v1.5` no es `CCA`-seguro.

## Lo que se repite

- Los cuatro ejercicios explotan la misma cosa: la aritmética de clave pública **tiene estructura**, y la estructura es a la vez lo que hace funcionar el esquema y lo que lo ataca. Los exponentes conmutan (Ej. 6, correctitud), los valores públicos los puede firmar cualquiera (Ej. 7), la verificación es una función pública (Ej. 16), cifrar respeta el producto (Ej. 17).
- Una respuesta de ataque tiene siempre el mismo esqueleto: escribir el esquema, dar el adversario en pasos numerados, mostrar que gana el experimento (`Sig-forge` o `CCA`) y con qué probabilidad, decir por qué cada paso es legal, decir qué **no** se rompió (`RSA`, el logaritmo discreto, ninguna firma) y dar el arreglo (hash, relleno con integridad, identidad dentro de la firma).
- Diffie-Hellman se defiende con la conmutatividad y se ataca con la falta de autenticación; y la autenticación no es «firmar algo» sino firmar los valores **y** las identidades.
- Conviene llevar memorizado: los pasos de Diffie-Hellman con la línea de conmutatividad; los tres problemas de *textbook* `RSA` (determinístico, mensajes pequeños, módulos repetidos); la línea del ataque de no mensaje; la propiedad multiplicativa y el molde `CCA`; y el ataque de intermediario con y sin firmas.
- Si el parcial pide cuentas en vez de ataques, la receta está en la página de resumen de este tipo, y los tres ejercicios que siguen son para practicarla.

## Ejercicios de práctica con números

### Práctica 1 — Un par RSA pequeño, cifrar y descifrar

**Enunciado.** Con $p = 3$, $q = 11$ y $e = 3$: a) generar el par de claves mostrando Euclides extendido; b) cifrar $m = 4$ y descifrar el resultado; c) ¿podría usarse $e = 5$?; d) cifrar $m = 2$: ¿qué observa un atacante que conoce la clave pública?

> [!nota]- Solución
> **a)** $n = 3 \cdot 11 = 33$, $\varphi(n) = 2 \cdot 10 = 20$. Euclides sobre $(20, 3)$: $20 = 6 \cdot 3 + 2$, $3 = 1 \cdot 2 + 1$, mcd $= 1$, así que $e = 3$ sirve. Hacia atrás: $1 = 3 - 1 \cdot 2 = 3 - (20 - 6 \cdot 3) = 7 \cdot 3 - 1 \cdot 20$, luego $d = 7$. Comprobación: $3 \cdot 7 = 21 = 1 + 1 \cdot 20$. $pk = (33, 3)$, $sk = (33, 7)$.
> **b)** $c = 4^{3} = 64 \bmod 33 = 31$. Descifrado: $31^{7} \bmod 33$; como $31 \equiv -2$, $(-2)^{7} = -128 \equiv -128 + 4 \cdot 33 = 4$. Por cuadrados da lo mismo: $31^{2} = 961 \equiv 4$, $31^{4} \equiv 16$, $31^{7} = 16 \cdot 4 \cdot 31 = 1984 \equiv 4$. Se recupera $m = 4$.
> **c)** No: $\gcd(5, 20) = 5 \ne 1$, así que $5$ no tiene inverso módulo $20$ y no existe $d$. Tampoco sirven $e = 2$ ni $e = 4$; $e = 7$ sí.
> **d)** $c = 2^{3} = 8 < 33$: no hubo reducción. Un atacante que ve $c = 8$ y conoce $e = 3$ toma la raíz cúbica entera y recupera $m = 2$ sin conocer $d$; es el problema de los mensajes pequeños de *textbook* `RSA`. Además, como el cifrado es determinístico, cada vez que se cifre $2$ verá el mismo $8$.

### Práctica 2 — Diffie-Hellman con p igual a 17 y g igual a 3

**Enunciado.** Parámetros públicos $p = 17$ y $g = 3$. Alice elige $x = 4$ y Bob elige $y = 7$. a) Calcular lo que envía cada uno y la clave en los dos extremos. b) ¿Qué ve Eve y qué tendría que resolver para obtener la clave? Resolverlo para este $p$. c) Mallory se interpone y usa $m = 5$ frente a los dos: ¿qué claves resultan y quién conoce cuáles?

> [!nota]- Solución
> **a)** Alice envía $h_1 = 3^{4} \bmod 17 = 81 \bmod 17 = 13$. Bob envía $h_2 = 3^{7} \bmod 17$: cuadrados $3$, $3^{2} = 9$, $3^{4} = 81 \equiv 13$; con $7 = 4 + 2 + 1$, $13 \cdot 9 \cdot 3 = 351 \equiv 11$. Alice calcula $K = h_2^{\,x} = 11^{4} \bmod 17$: $11^{2} = 121 \equiv 2$ y $2^{2} = 4$. Bob calcula $K = h_1^{\,y} = 13^{7} \bmod 17$: $13^{2} = 169 \equiv 16$, $13^{4} \equiv 16^{2} = 256 \equiv 1$, $13^{7} = 1 \cdot 16 \cdot 13 = 208 \equiv 4$. $K = 4$ en los dos extremos: $(3^{7})^{4} = (3^{4})^{7} = 3^{28}$.
> **b)** Eve ve $p = 17$, $g = 3$, $h_1 = 13$ y $h_2 = 11$. Para obtener $K$ necesita $x$ o $y$, es decir resolver $3^{x} \equiv 13 \pmod{17}$: el logaritmo discreto. Con $p = 17$ se prueba a mano: $3^{1} = 3$, $3^{2} = 9$, $3^{3} = 27 \equiv 10$, $3^{4} \equiv 13$; entonces $x = 4$ y $K = 11^{4} \bmod 17 = 4$. Con $p$ de 2048 bits no hay tabla que hacer ni algoritmo eficiente conocido; el protocolo es seguro solo con parámetros grandes, y solo frente a adversarios pasivos.
> **c)** Mallory calcula $3^{5} \bmod 17 = 13 \cdot 3 = 39 \equiv 5$ y lo envía a los dos en lugar de $h_1$ y $h_2$. Alice calcula $K_A = 5^{4} \bmod 17$: $5^{2} = 25 \equiv 8$, $8^{2} = 64 \equiv 13$. Bob calcula $K_B = 5^{7} \bmod 17 = 13 \cdot 8 \cdot 5 = 520 \equiv 10$. Mallory reconstruye las dos con lo que interceptó: $h_1^{5} = 13^{5} = 13^{4} \cdot 13 \equiv 1 \cdot 13 = 13 = K_A$ y $h_2^{5} = 11^{5} = 11^{4} \cdot 11 \equiv 4 \cdot 11 = 44 \equiv 10 = K_B$. Alice y Bob no comparten ninguna clave, cada uno cree compartirla con el otro, y Mallory tiene las dos: descifra con una, lee o modifica, y vuelve a cifrar con la otra. No se resolvió ningún logaritmo discreto; se explotó que nadie autentica $h_1$ ni $h_2$.

### Práctica 3 — Firma RSA con hash sobre el par de la Práctica 1

**Enunciado.** Con $pk = (33, 3)$, $sk = (33, 7)$ y el hash de juguete $H(m) =$ suma de los dígitos decimales de $m$: a) firmar $m = 1492$ con Hashed `RSA`; b) verificar la firma; c) un adversario que no conoce $d$ elige $\sigma = 2$: ¿qué par $(m, \sigma)$ pasa la verificación con *textbook* `RSA`, y qué le hace falta para que pase con Hashed `RSA`?

> [!nota]- Solución
> **a)** $H(1492) = 1 + 4 + 9 + 2 = 16$. $\sigma = H(m)^{d} = 16^{7} \bmod 33$: cuadrados $16$, $16^{2} = 256 \equiv 25$, $25^{2} = 625 \equiv 31$; con $7 = 4 + 2 + 1$, $31 \cdot 25 = 775 \equiv 16$ y $16 \cdot 16 = 256 \equiv 25$. La firma es $\sigma = 25$, y se envía $(1492, 25)$.
> **b)** El verificador recalcula $H(1492) = 16$ y comprueba $\sigma^{e} = 25^{3} \bmod 33$: $25^{2} = 625 \equiv 31$ y $31 \cdot 25 = 775 \equiv 16$. Coincide con el hash: acepta.
> **c)** Con *textbook* `RSA` el adversario define $m := \sigma^{e} \bmod 33 = 2^{3} = 8$: el par $(8, 2)$ verifica, porque $2^{3} = 8$, y nadie lo firmó (ataque de no mensaje, Ej. 16). Con Hashed `RSA` tiene $y = 8$ y necesita un mensaje con $H(m) = 8$; con este hash de juguete lo encuentra al instante ($m = 8$, $m = 17$ o $m = 2024$ sirven), lo que muestra que el arreglo depende de que $H$ sea resistente a preimagen: con `SHA-256` esa búsqueda cuesta del orden de $2^{256}$ evaluaciones y el ataque queda fuera de alcance. El mismo ejemplo muestra por qué un hash con colisiones fáciles (todos los mensajes con la misma suma de dígitos) no sirve para firmar: la firma de $1492$ es también firma válida de $4921$ y de $79$.
