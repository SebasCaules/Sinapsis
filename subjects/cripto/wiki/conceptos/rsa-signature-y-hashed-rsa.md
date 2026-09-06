---
title: RSA-Signature y Hashed RSA
resumen: 'Firma que invierte los papeles de las claves de RSA, rota por dos falsificaciones de probabilidad 1 —elegir la firma al azar y multiplicar dos firmas—, y su arreglo con un hash previo, sin prueba fuera de un modelo ideal.'
fuentes: ["[[clase-04-criptografia-asimetrica-y-firma-digital]]", "[[firma-digital]]", "[[rsa]]", "[[maleabilidad]]"]
aliases: [RSA-Signature, RSA Signature, Hashed RSA, Firma RSA sin hash, Ataque multiplicativo sobre RSA-Signature]
type: concepto
unidad: 1
clase: 4
orden: 11
created: 2026-09-04
updated: 2026-09-04
tags: [criptografia, firma-digital, rsa, hashed-rsa, maleabilidad, sig-forge, clase-04, sin-dictar]
sources: ["Clase 04 - Criptografia - Cifrado asimetrico y firma digital.pdf"]
---

# RSA-Signature y Hashed RSA

**Por qué invertir los papeles de las claves de `RSA` para firmar es, tal cual, un esquema roto —dos ataques con probabilidad de éxito 1— y cómo agregar un hash lo arregla, aunque sin demostración fuera de un modelo ideal.**

> Filminas **36-38** del PDF de teoría de la Clase 04. La clase todavía no se dictó (hoy es 04/09/2026): nota escrita contra el PDF de filminas, Katz & Lindell y lecturas propias rotuladas.

## RSA-Signature: la construcción

$$\begin{aligned}
\mathsf{Gen}&:\ \text{elegir } p,q \text{ primos},\ n=p\cdot q\\
&\quad e \leftarrow (0,\varphi(n)) \mid \gcd(e,\varphi(n))=1\\
&\quad \text{calcular } d \mid e\cdot d \equiv 1 \pmod{\varphi(n)}\\
&\quad pk=(n,e),\ sk=(n,d)\\[4pt]
\mathsf{Sign}_{sk}(m) &\equiv m^{d} \pmod n\\
\mathsf{Vrfy}_{pk}(m,s) &= \bigl(m \overset{?}{=} s^{e} \bmod n\bigr)
\end{aligned}$$

Es idéntico a `RSA-Encryption` (ver [[rsa|RSA]]), con los papeles de las claves **invertidos**: donde `RSA-Encryption` cifra con $pk$ y descifra con $sk$, acá se firma con $sk$ (el exponente $d$, privado) y se verifica con $pk$ (el exponente $e$, público). La operación en sí es exactamente la misma exponenciación modular.

> **Errata de la filmina (36).** El primer paso de $\mathsf{Gen}$ escribe *"$d \leftarrow (0,\varphi(n)) \mid \gcd(\mathbf{e},\varphi(n))=1$"* — sortea $d$ al azar, pero la condición de coprimalidad está escrita sobre $\mathbf{e}$ (en negrita en la lámina). El paso siguiente vuelve a decir *"calcular $d$"*, como si $d$ no se hubiera fijado todavía. Comparado con la filmina 24 de `RSA-Encryption` —de la que este bloque es copia—, ahí el primer paso dice correctamente *"$e \leftarrow (0,\varphi(n)) \mid \gcd(e,\varphi(n))=1$"*: la variable que se sortea al azar y que tiene que ser coprima con $\varphi(n)$ es $e$; $d$ se obtiene después, como su inverso módulo $\varphi(n)$ vía [[algoritmo-de-euclides-extendido|Euclides extendido]]. Arriba va corregido.

## Por qué está roto: la firma al azar

La propia filmina marca el esquema con un recuadro: *"este esquema, aunque común en la literatura, es inseguro"*. El primer ataque no necesita conocer $sk$ en absoluto:

$$s \leftarrow S \text{ (al azar)}, \qquad m := s^{e} \bmod n, \qquad \text{emitir } (m,s)$$

Por construcción, $s^{e} \bmod n = m$, así que $\mathsf{Vrfy}_{pk}(m,s) = 1$. Y el adversario **nunca llamó a** $\mathsf{Sign}$: no hay ninguna consulta de por medio, $Q = \varnothing$, y $m \notin Q$ trivialmente. Corrido contra el experimento [[firma-digital|Sig-forge]],

$$\Pr[\mathsf{Sig\text{-}forge}_{A,\Pi} = 1] = 1$$

sin gastar ninguna consulta y sin ninguna suposición computacional de por medio. La razón de fondo es que $\mathsf{Vrfy}$ recorre la exponenciación en el sentido contrario a $\mathsf{Sign}$ ($s^{e}$ en vez de $m^{d}$), así que **cualquier** $s$ define, por esa misma fórmula, un $m$ para el cual $s$ es una firma válida. El adversario no falsifica una firma para un mensaje elegido — elige la firma primero y deja que el mensaje salga de ahí.

## El segundo ataque: la maleabilidad multiplicativa

Con dos firmas ya consultadas, $s_1 = \mathsf{Sign}_{sk}(m_1)$ y $s_2 = \mathsf{Sign}_{sk}(m_2)$:

$$\text{emitir } (m_1\cdot m_2,\ s_1\cdot s_2)$$

$$(s_1 s_2)^{e} \bmod n = s_1^{e}\, s_2^{e} \bmod n \equiv m_1\cdot m_2 \pmod n$$

pasa la verificación, y $m_1\cdot m_2 \notin Q = \{m_1,m_2\}$ salvo el caso degenerado en que coincida con uno de los dos. La igualdad $(s_1 s_2)^{e} = s_1^{e}s_2^{e}$ **no es una casualidad del ejemplo**: es la propiedad homomórfica de la exponenciación modular —$f(a)\cdot f(b) = f(a\cdot b)$ para $f(x)=x^{e}\bmod n$— y es exactamente la misma estructura que en `RSA-Encryption` habilita la [[maleabilidad]]: ahí un atacante multiplica el criptograma por $\Delta^{e}$ para multiplicar el mensaje descifrado por $\Delta$; acá multiplica dos firmas para sumar sus mensajes en el exponente. El mecanismo que rompe confidencialidad en un lado rompe integridad en el otro, por la misma cuenta.

## Hashed RSA: romper la estructura multiplicativa

$$\mathsf{Sign}_{sk}(m) \equiv H(m)^{d} \pmod n, \qquad \mathsf{Vrfy}_{pk}(m,s) = \bigl(H(m) \overset{?}{=} s^{e}\bmod n\bigr)$$

con $H$ una función de [[funciones-de-hash-criptograficas|hash]] **libre de colisiones**. La diferencia frente a `RSA-Signature` es mínima en la fórmula y decisiva en el efecto: ahora lo que se eleva a $d$ no es $m$ sino $H(m)$.

**Contra la firma al azar**, Hashed RSA no cambia nada estructural: el adversario sigue pudiendo sortear $s$ y calcular $H(m) := s^{e} \bmod n$... salvo que ahora tiene que producir un **mensaje** $m$ cuyo hash sea ese valor, y eso es invertir $H$ — que $H$ sea resistente a preimagen es justamente lo que bloquea este camino.

**Contra el ataque multiplicativo** *(lectura nuestra, no desarrollada en la filmina)*: con $s_1 = H(m_1)^{d}$ y $s_2 = H(m_2)^{d}$ ya consultados, $(s_1 s_2)^{e} \bmod n = H(m_1)\cdot H(m_2) \bmod n$. Para que esto sirviera como firma de algún mensaje $m_3$, haría falta $H(m_3) = H(m_1)\cdot H(m_2) \bmod n$ — y $H$ libre de colisiones **no tiene por qué respetar ninguna estructura algebraica** de sus entradas: no hay ninguna razón para que $H(m_1\cdot m_2) = H(m_1)\cdot H(m_2)$, y encontrar **algún** $m_3$ cuyo hash coincida con ese producto es, de nuevo, invertir $H$ o encontrarle una colisión contra un valor que el adversario no puede fijar de antemano. El hash absorbe la estructura multiplicativa de $m$ antes de que la exponenciación tenga oportunidad de conservarla.

## El límite honesto: sin prueba fuera del modelo ideal

La filmina es explícita sobre lo que Hashed RSA **no** tiene: *"no posee una prueba de seguridad a menos que se asuma un modelo ideal de $H$"* — el modelo de oráculo aleatorio, donde $H$ se trata como una función verdaderamente aleatoria a la que solo se accede por consultas, no desarrollado en esta clase. Es una salvedad real, no una formalidad: significa que la seguridad de Hashed RSA no está reducida a una suposición estándar (como `RSA` de cifrado se reduce a la dificultad de factorizar) sino a una idealización de $H$ que ninguna función de hash real satisface exactamente. En la práctica el esquema se usa igual —es, con variantes de padding como `PSS`, la base de las firmas `RSA` reales— pero la garantía formal es más débil que la de otros esquemas de este bloque.

## Ver también

- [[clase-04-criptografia-asimetrica-y-firma-digital#12. RSA-Signature y Hashed RSA|Clase 04 — Criptografía asimétrica y firma digital § 12. RSA-Signature y Hashed RSA]]
- [[firma-digital|Firma digital]] — la terna y el experimento `Sig-forge` contra el que se miden los dos ataques de esta nota
- [[rsa|RSA]] — el esquema de cifrado del que éste invierte los papeles de las claves
- [[digital-signature-standard|Digital Signature Standard]] — el estándar que la cátedra da como alternativa con demostración de seguridad más sólida
- [[maleabilidad|Maleabilidad]] — la misma propiedad homomórfica de `RSA`, explotada del lado de la confidencialidad
- [[funciones-de-hash-criptograficas|Funciones de hash criptográficas]] — qué significa "libre de colisiones" y por qué alcanza para bloquear el ataque multiplicativo
- [[resistencias-de-una-funcion-de-hash|Resistencias de una función de hash]] — la distinción entre colisión, preimagen y segunda preimagen que decide contra qué protege $H$
- [[algoritmo-de-euclides-extendido|Algoritmo de Euclides extendido]] — cómo se calcula $d$ a partir de $e$ y $\varphi(n)$
