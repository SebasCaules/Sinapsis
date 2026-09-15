---
title: 'Cuentas de asimétrica: RSA, Diffie-Hellman, El Gamal y firma'
resumen: 'Cómo hacer a mano las cuentas de la Clase 4 para el primer parcial: inverso modular, exponenciación rápida, claves y operaciones de RSA, Diffie-Hellman y El Gamal, firma con hash, con un ejemplo numérico verificado por bloque y la receta para escribirlo en el examen.'
fuentes: ["[[parciales-viejos]]", "[[rsa]]", "[[diffie-hellman]]", "[[el-gamal]]", "[[rsa-signature-y-hashed-rsa]]", "[[inverso-modular]]", "[[algoritmo-de-euclides-extendido]]", "[[criptosistema-asimetrico]]", "[[firma-digital]]"]
aliases: [Cuentas de asimétrica (parcial), RSA y Diffie-Hellman a mano para el parcial, Aritmética asimétrica del primer parcial]
type: parcial
clase: 1p
orden: 22
created: 2026-09-14
updated: 2026-09-14
tags: [parcial, primer-parcial, cuentas-de-asimetrica, rsa, diffie-hellman, el-gamal, firma-digital]
sources: ["raw/parciales/Cripto - Primeros Parciales.pdf"]
---

# Cuentas de asimétrica: RSA, Diffie-Hellman, El Gamal y firma

> [!ejemplo] Lo más parecido · Guía 4, Ejercicio 6 — ningún parcial viejo tomó cuentas de asimétrica
> Considera el protocolo de intercambio de claves Diffie Hellman y escribe la secuencia de pasos para que en lugar de ser 2 los participantes que generan una clave compartida sean 3.

## Lo mínimo que hay que saber

### Aritmética modular: las tres cuentas que se hacen a mano

- **Reducir.** $a \bmod n$ es el resto de dividir $a$ por $n$, siempre en $\{0, \dots, n-1\}$. Se puede reducir después de cada producto sin cambiar el resultado: $(a \cdot b) \bmod n = \bigl((a \bmod n)(b \bmod n)\bigr) \bmod n$. Un resultado negativo se corrige sumando $n$.
- **Inverso modular.** $a^{-1} \bmod n$ es el número $x$ con $a \cdot x \equiv 1 \pmod n$; existe si y solo si $\gcd(a, n) = 1$, y es único en $\{0, \dots, n-1\}$. Se calcula con [[algoritmo-de-euclides-extendido|Euclides extendido]]: dividir con resto hasta llegar a resto $0$ (el último resto no nulo es el mcd) y sustituir hacia atrás para escribir $1 = s \cdot n + t \cdot a$; el inverso es $t \bmod n$. Ejemplo, $7^{-1} \bmod 40$:
$$40 = 5 \cdot 7 + 5, \qquad 7 = 1 \cdot 5 + 2, \qquad 5 = 2 \cdot 2 + 1 \quad (\text{mcd} = 1)$$
$$1 = 5 - 2 \cdot 2 = 5 - 2\,(7 - 1 \cdot 5) = 3 \cdot 5 - 2 \cdot 7 = 3\,(40 - 5 \cdot 7) - 2 \cdot 7 = 3 \cdot 40 - 17 \cdot 7$$
  El coeficiente de $7$ es $-17 \equiv 23 \pmod{40}$, y la comprobación es $7 \cdot 23 = 161 = 4 \cdot 40 + 1$. En la sustitución no se evalúan los productos: los números $5$, $7$, $40$ tienen que quedar escritos, porque son los que terminan como coeficientes.
- **Exponenciación rápida.** Para $a^{k} \bmod n$ se elevan al cuadrado sucesivamente, reduciendo cada vez, y se multiplican las potencias que corresponden a los bits de $k$. Ejemplo, $9^{7} \bmod 55$: $9^{1} = 9$, $9^{2} = 81 \equiv 26$, $9^{4} \equiv 26^{2} = 676 \equiv 16$; como $7 = 4 + 2 + 1$, $9^{7} \equiv 16 \cdot 26 \cdot 9$: $16 \cdot 26 = 416 \equiv 31$ y $31 \cdot 9 = 279 \equiv 4$. Nunca se calcula $9^{7}$ entero.
- **Función de Euler.** $\varphi(n)$ cuenta los enteros de $1$ a $n$ coprimos con $n$: $\varphi(p) = p - 1$ si $p$ es primo, y $\varphi(p \cdot q) = (p-1)(q-1)$ si $p \ne q$ son primos. **Teorema de Euler:** $a^{\varphi(n)} \equiv 1 \pmod n$ cuando $\gcd(a, n) = 1$ (con $n = p$ primo es Fermat: $a^{p-1} \equiv 1$). Consecuencias para las cuentas: los exponentes se pueden reducir módulo $\varphi(n)$, y en $\mathbb{Z}_p$ vale $a^{-1} \equiv a^{p-2} \pmod p$ como segunda forma de obtener un inverso. Ejemplo: $\varphi(55) = 4 \cdot 10 = 40$, y en efecto $9^{40} \equiv 1 \pmod{55}$.

### RSA: claves, cifrado y descifrado

$$\begin{aligned}
\mathsf{Gen}&:\ p, q \text{ primos},\ n = p \cdot q,\ \varphi(n) = (p-1)(q-1),\ e \text{ con } \gcd(e, \varphi(n)) = 1,\ d = e^{-1} \bmod \varphi(n);\quad pk = (n, e),\ sk = (n, d)\\
\mathsf{Enc}_{pk}(m) &= m^{e} \bmod n \ \ (m < n), \qquad \mathsf{Dec}_{sk}(c) = c^{d} \bmod n
\end{aligned}$$

**Por qué funciona, en una línea.** $e \cdot d = 1 + k\,\varphi(n)$ para algún $k$, así que $c^{d} = m^{ed} = m \cdot \bigl(m^{\varphi(n)}\bigr)^{k} \equiv m \cdot 1^{k} = m \pmod n$ por Euler.

**Ejemplo.** $p = 5$, $q = 11$: $n = 55$, $\varphi(n) = 4 \cdot 10 = 40$. Con $e = 7$ ($\gcd(7, 40) = 1$), $d = 7^{-1} \bmod 40 = 23$ (la cuenta de arriba; $7 \cdot 23 = 161 = 1 + 4 \cdot 40$). Cifrar $m = 9$: $c = 9^{7} \bmod 55 = 4$ (la exponenciación de arriba). Descifrar $c = 4$: $4^{23} \bmod 55$ con $23 = 16 + 4 + 2 + 1$; cuadrados: $4^{1} = 4$, $4^{2} = 16$, $4^{4} = 256 \equiv 36$, $4^{8} \equiv 36^{2} = 1296 \equiv 31$, $4^{16} \equiv 31^{2} = 961 \equiv 26$; producto: $26 \cdot 36 = 936 \equiv 1$, luego $1 \cdot 16 \cdot 4 = 64 \equiv 9$. Se recupera $m = 9$.

**Lo que hay que decir si preguntan por seguridad.** Este es *textbook* `RSA`: es determinístico (el mismo $m$ da siempre el mismo $c$, y $1^{e} = 1$ para cualquier clave), así que no es `CPA`-seguro; si $m^{e} < n$ no hay reducción y $m$ se recupera con una raíz $e$-ésima entera; y el mismo $n$ no puede compartirse entre usuarios. En la práctica se usa con el relleno de [[pkcs1-y-tamano-de-claves|PKCS#1]] y módulos de 2048 bits o más. Lo que sostiene la seguridad es que sin $p$ y $q$ no se puede calcular $\varphi(n)$, y sin $\varphi(n)$ no se puede obtener $d$: hay que **factorizar $n$**.

### RSA: firma y verificación, y por qué se firma el hash

$$\mathsf{Sign}_{sk}(m) = m^{d} \bmod n, \qquad \mathsf{Vrfy}_{pk}(m, s) = 1 \iff s^{e} \bmod n = m$$

Es la misma exponenciación con los papeles invertidos: firma quien tiene $d$, verifica cualquiera con $e$. Ejemplo con las claves de arriba: $s = 9^{23} \bmod 55 = 14$ (cuadrados $9, 26, 16, 36, 31$ y $31 \cdot 16 \cdot 26 \cdot 9 \equiv 14$), y la verificación $14^{7} \bmod 55 = 9$ da el mensaje. Así, sin hash, el esquema está roto con probabilidad $1$:

- **Ataque de no mensaje.** El adversario elige la firma primero, $s$ cualquiera, y define $m := s^{e} \bmod n$; el par $(m, s)$ verifica por construcción y nunca pidió una firma. Con $s = 2$: $m = 2^{7} \bmod 55 = 18$, y $(18, 2)$ es una firma válida que nadie emitió.
- **Multiplicatividad.** $(s_1 \cdot s_2)^{e} = s_1^{e} \cdot s_2^{e} = m_1 \cdot m_2$: dos firmas legítimas dan una tercera sobre el producto. Con $\mathsf{Sign}(9) = 14$ y $\mathsf{Sign}(3) = 27$, el par $(9 \cdot 3, 14 \cdot 27 \bmod 55) = (27, 48)$ verifica: $48^{7} \bmod 55 = 27$.
- **Tamaño.** Sin hash solo se firman mensajes menores que $n$, o la firma mide lo mismo que el documento.

**Hashed RSA** arregla las tres cosas: $\mathsf{Sign}_{sk}(m) = H(m)^{d} \bmod n$ y $\mathsf{Vrfy}$ comprueba $s^{e} \bmod n = H(m)$. Ahora $s^{e}$ es *el hash que el mensaje debería tener*, y para emitir un par válido el adversario necesita una **preimagen** de $H$; el hash destruye la estructura multiplicativa ($H(m_1) H(m_2)$ no es el hash de nada conocido) y fija el tamaño de la firma. La garantía formal existe solo si $H$ se supone ideal.

### Diffie-Hellman: acordar una clave sin transmitirla

Parámetros públicos: un primo $p$ y un generador $g$ de $\mathbb{Z}_p^{*}$ (sus potencias recorren todo $\{1, \dots, p-1\}$; la Clase 4 escribe $(G, q, g)$ con $q$ el tamaño del grupo, que aquí es $p - 1$). Los exponentes secretos se eligen en $\{1, \dots, p-2\}$.

$$A \text{ elige } x,\ \text{envía } h_1 = g^{x} \bmod p; \qquad B \text{ elige } y,\ \text{envía } h_2 = g^{y} \bmod p; \qquad K = h_2^{\,x} = h_1^{\,y} = g^{xy} \bmod p$$

Cierra porque el exponente conmuta: $(g^{y})^{x} = (g^{x})^{y}$. Por el canal viajan $p, g, g^{x}, g^{y}$; los exponentes $x$, $y$ y la clave $K$ nunca se transmiten.

**Ejemplo.** $p = 23$, $g = 5$. $A$ elige $x = 6$: $h_1 = 5^{6} \bmod 23 = 8$ ($5^{2} = 25 \equiv 2$, $5^{4} \equiv 4$, $5^{6} = 4 \cdot 2 = 8$). $B$ elige $y = 15$: $h_2 = 5^{15} \bmod 23$ con cuadrados $5, 2, 4, 16$ y $15 = 8 + 4 + 2 + 1$: $16 \cdot 4 \cdot 2 \cdot 5 = 640 \equiv 19$. Clave: $A$ calcula $19^{6} \bmod 23 = 2$ y $B$ calcula $8^{15} \bmod 23 = 2$. $K = 2$.

**Por qué lo protege el logaritmo discreto.** Un adversario pasivo ve $p, g, g^{x}, g^{y}$ y para obtener $K$ necesita $x$ o $y$: resolver $g^{x} \equiv h_1$ es el **problema del logaritmo discreto**, para el que no se conoce ningún algoritmo eficiente en grupos grandes (es una conjetura de dureza, no un teorema; la hipótesis que se usa en las pruebas es la más fuerte `DDH`: nadie distingue $g^{xy}$ de un valor al azar viendo $g^{x}$ y $g^{y}$). Con $p$ de 5 bits, en cambio, se prueba a mano: por eso los ejemplos son de juguete.

**Por qué cae ante un atacante activo.** Nada autentica quién envió $h_1$ y $h_2$. Mallory intercepta y reemplaza los dos por $g^{m}$: Alice calcula $K_A = g^{xm}$ creyendo que la comparte con Bob, Bob calcula $K_B = g^{ym}$, y Mallory conoce las dos porque tiene $m$. Descifra, lee, vuelve a cifrar, y ninguno nota nada. El protocolo es seguro solo frente a adversarios **pasivos**; en la práctica se complementa con firmas y certificados (o un MAC), y la firma tiene que cubrir también la identidad del interlocutor (Guía 4, Ej. 7).

### El Gamal: Diffie-Hellman convertido en cifrado

$$\begin{aligned}
\mathsf{Gen}&:\ (p, g),\ x \text{ secreto},\ h = g^{x} \bmod p;\quad pk = (p, g, h),\ sk = x\\
\mathsf{Enc}_{pk}(m)&:\ k \text{ aleatorio, nuevo en cada cifrado};\quad c = (c_1, c_2) = \bigl(g^{k} \bmod p,\ m \cdot h^{k} \bmod p\bigr)\\
\mathsf{Dec}_{sk}(c)&:\ s = c_1^{\,x} \bmod p,\quad m = c_2 \cdot s^{-1} \bmod p
\end{aligned}$$

Funciona porque $s = (g^{k})^{x} = (g^{x})^{k} = h^{k}$: quien cifra calcula la máscara desde $h$ y su $k$, quien descifra la recalcula desde $c_1$ y su $x$, y dividir por ella devuelve $m$. La Clase 4 llama $y$ al aleatorio, porque es el mismo papel que el $y$ de Diffie-Hellman; como cambia en cada cifrado, el esquema es probabilístico y por eso puede ser `CPA`-seguro bajo `DDH`.

**Ejemplo.** $p = 23$, $g = 5$, $x = 6$, $h = 5^{6} \bmod 23 = 8$. Cifrar $m = 7$ con $k = 3$: $c_1 = 5^{3} = 125 \equiv 10$; $h^{k} = 8^{3} = 512 \equiv 6$; $c_2 = 7 \cdot 6 = 42 \equiv 19$. Criptograma $(10, 19)$. Descifrar: $s = 10^{6} \bmod 23$ ($10^{2} = 100 \equiv 8$, $10^{4} \equiv 64 \equiv 18$, $10^{6} = 18 \cdot 8 = 144 \equiv 6$); $s^{-1} = 6^{-1} \bmod 23 = 4$ porque $6 \cdot 4 = 24 \equiv 1$; $m = 19 \cdot 4 = 76 \equiv 7$.

### Qué es público, qué es privado, qué lo sostiene

| Sistema | Público | Privado | Problema difícil |
|---|---|---|---|
| `RSA` cifrado | $(n, e)$; cifra cualquiera | $d$, y con él $p$, $q$, $\varphi(n)$; descifra el dueño | factorizar $n$: sin $p$ y $q$ no hay $\varphi(n)$, sin $\varphi(n)$ no hay $d$ |
| `RSA` firma | $(n, e)$; verifica cualquiera | $d$; firma solo el dueño | el mismo, más un hash resistente a preimagen |
| Diffie-Hellman | $p$, $g$, $g^{x}$, $g^{y}$ | $x$, $y$ y la clave $g^{xy}$ | logaritmo discreto (y `DDH`) |
| El Gamal | $(p, g, h = g^{x})$ y cada $c_1 = g^{k}$ | $x$; el $k$ de cada cifrado | logaritmo discreto (y `DDH`) |

## Receta

1. **Copiar los datos y separar roles.** Escribir qué es público y qué es privado antes de calcular nada; si el enunciado da $p$ y $q$, anotar $n = p \cdot q$ y $\varphi(n) = (p-1)(q-1)$ en la primera línea.
2. **Comprobar las condiciones.** $\gcd(e, \varphi(n)) = 1$ en `RSA`; $m < n$; en Diffie-Hellman y El Gamal, que $g$ sea generador si el enunciado lo pide (para $p$ pequeño, $g^{(p-1)/r} \not\equiv 1$ para cada primo $r$ que divide a $p - 1$). Si una condición falla, decirlo: es la respuesta.
3. **Generar la clave con Euclides extendido a la vista.** La cadena de divisiones, la sustitución hacia atrás, el coeficiente reducido a positivo y la comprobación $e \cdot d \bmod \varphi(n) = 1$. En Diffie-Hellman y El Gamal, la potencia $g^{x}$ con sus cuadrados.
4. **Hacer la operación pedida por cuadrados sucesivos.** Escribir el exponente como suma de potencias de $2$, la lista de cuadrados reducidos y el producto final, reduciendo después de cada multiplicación.
5. **Verificar del otro lado.** Descifrar lo cifrado, verificar la firma, o calcular la clave en los dos extremos y ver que coinciden. Escribir la verificación: es lo que distingue una cuenta bien hecha de una que salió por casualidad.
6. **Justificar en una línea.** Euler ($e \cdot d = 1 + k\,\varphi(n)$) en `RSA`; conmutatividad del exponente en Diffie-Hellman; $h^{k} = c_1^{\,x}$ en El Gamal.
7. **Si preguntan por seguridad, nombrar el problema difícil y la trampa** de la tabla: factorización o logaritmo discreto; determinismo, firma sin hash, $k$ repetido o canal sin autenticar, según el sistema.

## Plantilla de respuesta

**Datos.** $p =$ \<p\>, $q =$ \<q\>, $e =$ \<e\>, $m =$ \<m\>. $n = p \cdot q =$ \<n\>; $\varphi(n) = (p-1)(q-1) =$ \<valor\>. Público: $(n, e)$. Privado: $d$.
**Condición.** $\gcd(e, \varphi(n)) = 1$: \<cadena de divisiones de Euclides, con último resto no nulo igual a 1\>.
**Clave privada.** Sustitución hacia atrás: $1 =$ \<s\> $\cdot\, \varphi(n) +$ \<t\> $\cdot\, e$, luego $d =$ \<t reducido módulo φ(n)\>. Comprobación: $e \cdot d =$ \<producto\> $= 1 +$ \<k\> $\cdot\, \varphi(n)$.
**Cifrado.** $c = m^{e} \bmod n$: cuadrados \<m, m al cuadrado, a la cuarta, ... reducidos\>; $e =$ \<suma de potencias de 2\>; producto $=$ \<c\>.
**Descifrado (verificación).** $c^{d} \bmod n$: cuadrados \<...\>; $d =$ \<suma de potencias de 2\>; producto $=$ \<m\>, que es el mensaje original.
**Por qué.** $m^{ed} = m^{1 + k\varphi(n)} = m \cdot (m^{\varphi(n)})^{k} \equiv m \pmod n$ por el teorema de Euler.
**Seguridad (si se pide).** Recuperar $d$ desde $(n, e)$ exige $\varphi(n)$, o sea factorizar $n$; el esquema tal cual es determinístico y para firmar hay que aplicarlo a $H(m)$.

Para Diffie-Hellman la misma plantilla se reduce a: datos públicos $(p, g)$; secreto y valor enviado de cada parte; la clave calculada en los dos extremos con sus cuadrados; una línea de conmutatividad; y, si se pide, logaritmo discreto y ataque de intermediario. Para El Gamal: $h$, el $k$ elegido, $(c_1, c_2)$, y el descifrado con $s$, su inverso y el producto.

## Trampas

- **Confundir $\varphi(n)$ con $n$.** $d$ es el inverso de $e$ módulo $\varphi(n) = (p-1)(q-1)$, nunca módulo $n$; y los exponentes se reducen módulo $\varphi(n)$, no módulo $n$. Un $d$ calculado módulo $n$ descifra basura.
- **Olvidar el inverso.** $d$ no es $1/e$ ni $\varphi(n) - e$: es la solución de $e \cdot d \equiv 1$, y sale de Euclides extendido. En El Gamal, descifrar es multiplicar por $s^{-1}$ (Euclides o $s^{p-2}$), no «dividir por $s$» como en los reales.
- **Dar el coeficiente de Bézout sin reducir.** $-17$ no es una clave; $23$ sí. Reducir a $\{0, \dots, \varphi(n)-1\}$ y comprobar $e \cdot d \bmod \varphi(n) = 1$ antes de seguir.
- **Un $e$ que no es coprimo con $\varphi(n)$** no tiene inverso: no hay $d$ y el par no existe. Si el enunciado lo da así, la respuesta es señalarlo.
- **Firmar sin hash.** *Textbook* `RSA` como firma se rompe con probabilidad $1$ sin conocer $d$ (ataque de no mensaje y multiplicatividad). Se firma $H(m)$, siempre.
- **Reutilizar el $k$ de El Gamal.** El mismo $k$ produce el mismo $c_1$, que viaja en claro y delata la repetición, y la misma máscara $h^{k}$: entonces $c_2' \cdot c_2^{-1} = m' \cdot m^{-1}$, y conocer un mensaje revela el otro. $k$ nuevo en cada cifrado; es lo mismo que exigir cifrado no determinístico.
- **Diffie-Hellman sin autenticar.** La clave acordada no vale nada si Mallory eligió los dos valores: el protocolo solo resiste adversarios pasivos. Hay que decirlo cada vez que se lo nombra, y la solución son firmas con certificados que cubran los valores **y** las identidades.
- **Intercambiar los roles de las claves.** Confidencialidad: se cifra con la pública y se descifra con la privada. Firma: se firma con la privada y se verifica con la pública. Los exponentes son intercambiables en la fórmula; los roles, no.
- **Mensaje fuera de rango.** `RSA` exige $m < n$; y si además $m^{e} < n$, no hubo reducción y $m$ sale con una raíz entera.

## Para profundizar

- [[1p-asimetrica-en-las-guias|Asimétrica: lo más parecido a un parcial está en la Guía 4]] — los ejercicios de la Guía 4 más parecidos a un parcial, con respuesta modelo, y tres prácticas con números.
- [[primer-parcial|Primer parcial]] — el hub de la sección, con la tabla de los siete tipos y el orden sugerido.
- [[rsa|RSA]]: la construcción, la demostración por Euler tal como se hizo en clase y los tres problemas de *textbook* `RSA`, con un ejemplo numérico grande verificado.
- [[rsa-signature-y-hashed-rsa|RSA-Signature y Hashed RSA]]: los dos ataques a la firma sin hash, el problema del tamaño y el límite de la prueba de Hashed `RSA`.
- [[diffie-hellman|Diffie-Hellman]]: el protocolo paso a paso, logaritmo discreto contra `DDH`, la digresión sobre P y NP y el ataque de intermediario desarrollado.
- [[el-gamal|El Gamal]]: la construcción leída sobre Diffie-Hellman, por qué es probabilístico y la tabla de diferencias con `RSA`.
- [[firma-digital|Firma digital]]: la terna, el experimento `Sig-forge` y por qué la firma da no repudio y un MAC no.
- [[criptosistema-asimetrico|Criptosistema asimétrico]]: por qué en clave pública ser indistinguible ante escucha ya implica `CPA`-seguro, y por eso el cifrado tiene que ser no determinístico.
- [[inverso-modular|Inverso modular]] y [[algoritmo-de-euclides-extendido|Algoritmo de Euclides extendido]]: existencia, unicidad y las corridas completas en tabla y por sustitución hacia atrás.
- [[grupos-anillos-y-cuerpos|Grupos, anillos y cuerpos]]: de dónde salen $\varphi(p \cdot q)$, el teorema de Euler y la idea de generador.
- [[aritmetica-modular-y-divisibilidad|Aritmética modular y divisibilidad]] y [[teoria-de-numeros|Teoría de números]]: por qué en $\mathbb{Z}_n$ se suma y multiplica pero no se divide, y el apunte de base.
- [[digital-signature-standard|Digital Signature Standard]]: la otra firma digital que presenta la Clase 4.
- [[pkcs1-y-tamano-de-claves|PKCS#1 y tamaño de claves]]: el relleno que corrige los problemas de *textbook* `RSA` y los tamaños de clave reales.
- [[clase-04-criptografia-asimetrica-y-firma-digital|Clase 4]] y [[guia-04-manejo-de-claves-cifrado-asimetrico-y-firma-digital|Guía 4]]: la clase completa y la guía de la que salen los ejercicios más parecidos a un parcial.
