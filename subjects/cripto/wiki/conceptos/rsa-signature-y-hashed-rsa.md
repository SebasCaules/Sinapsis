---
title: RSA-Signature y Hashed RSA
resumen: 'Firma que invierte los papeles de las claves de RSA, rota por dos falsificaciones de probabilidad 1 —elegir la firma al azar y multiplicar dos firmas— y además limitada al tamaño del módulo; su arreglo con un hash previo resuelve las dos cosas, sin prueba fuera de un modelo ideal.'
fuentes: ["[[clase-04-criptografia-asimetrica-y-firma-digital]]", "[[firma-digital]]", "[[rsa]]", "[[maleabilidad]]"]
aliases: [RSA-Signature, RSA Signature, Hashed RSA, Firma RSA sin hash, Ataque multiplicativo sobre RSA-Signature, Ataque de no mensaje]
type: concepto
unidad: 1
clase: 4
orden: 11
created: 2026-09-04
updated: 2026-09-14
tags: [criptografia, firma-digital, rsa, hashed-rsa, maleabilidad, sig-forge, clase-04, transcripcion]
sources: ["Clase 04 - Criptografia - Cifrado asimetrico y firma digital.pdf", "raw/clases/Clase 04 - Transcripcion.VTT"]
---

# RSA-Signature y Hashed RSA

**Por qué invertir los papeles de las claves de `RSA` para firmar es, tal cual, un esquema roto —dos ataques con probabilidad de éxito 1— y cómo agregar un hash lo arregla, aunque sin demostración fuera de un modelo ideal.**

> **Fuentes de esta nota.** Filminas **36-38** de la Clase 04, dictada el **10/09** por Pablo Abad, con transcripción: [`Clase 04 - Transcripcion.VTT`](../../raw/clases/Clase%2004%20-%20Transcripcion.VTT), cues **1133-1156**. La nota se escribió el 04/09 sólo contra el PDF y se revisó contra la voz el 14/09. La voz dio el ataque multiplicativo y **agregó una razón que la filmina no trae** —la firma sin hash mide lo mismo que el mensaje—; el ataque de la firma al azar no se mencionó en el aula, aunque es el que la [[guia-04-manejo-de-claves-cifrado-asimetrico-y-firma-digital#Ejercicio 16|Guía 4]] pide en su Ej. 16.

**Cómo lo ubica la clase.** *"Hay 2 firmas digitales muy utilizadas"*: ésta, que es *"una variante de RSA que usa la idea de RSA pero pensada al revés"*, y [[digital-signature-standard|DSS]] (cues 1133-1134).

## RSA-Signature: la construcción

$$\begin{aligned}
\mathsf{Gen}&:\ \text{elegir } p,q \text{ primos},\ n=p\cdot q\\
&\quad e \leftarrow (0,\varphi(n)) \mid \gcd(e,\varphi(n))=1\\
&\quad \text{calcular } d \mid e\cdot d \equiv 1 \pmod{\varphi(n)}\\
&\quad pk=(n,e),\ sk=(n,d)\\[4pt]
\mathsf{Sign}_{sk}(m) &\equiv m^{d} \pmod n\\
\mathsf{Vrfy}_{pk}(m,s) &= \bigl(m \overset{?}{=} s^{e} \bmod n\bigr)
\end{aligned}$$

Es idéntico a `RSA-Encryption` (ver [[rsa|RSA]]), con los papeles de las claves **invertidos**: donde `RSA-Encryption` cifra con $pk$ y descifra con $sk$, acá se firma con $sk$ (el exponente $d$, privado) y se verifica con $pk$ (el exponente $e$, público). La operación en sí es exactamente la misma exponenciación modular. La voz lo describe así: *"la misma generación de claves de RSA, pero pensando en la firma como tomar el mensaje a firmar y elevarlo con la clave privada; y para verificar, tomaríamos la firma, la elevaríamos a la clave pública y veríamos si coincide con el mensaje"* (cues 1135-1138).

> **Errata de la filmina (36).** El primer paso de $\mathsf{Gen}$ escribe *"$d \leftarrow (0,\varphi(n)) \mid \gcd(\mathbf{e},\varphi(n))=1$"* — sortea $d$ al azar, pero la condición de coprimalidad está escrita sobre $\mathbf{e}$ (en negrita en la lámina). El paso siguiente vuelve a decir *"calcular $d$"*, como si $d$ no se hubiera fijado todavía. Comparado con la filmina 24 de `RSA-Encryption` —de la que este bloque es copia—, ahí el primer paso dice correctamente *"$e \leftarrow (0,\varphi(n)) \mid \gcd(e,\varphi(n))=1$"*: la variable que se sortea al azar y que tiene que ser coprima con $\varphi(n)$ es $e$; $d$ se obtiene después, como su inverso módulo $\varphi(n)$ vía [[algoritmo-de-euclides-extendido|Euclides extendido]]. Arriba va corregido. En el aula la línea no se leyó: la voz remite a *"la misma generación de claves de RSA"*.

## Por qué está roto: la firma al azar

La propia filmina marca el esquema con un recuadro: *"este esquema, aunque común en la literatura, es inseguro"* — y la voz repite las dos cosas: *"es muy común en la literatura, pero es inseguro"* (cue 1139). El primer ataque no necesita conocer $sk$ en absoluto:

$$s \leftarrow S \text{ (al azar)}, \qquad m := s^{e} \bmod n, \qquad \text{emitir } (m,s)$$

Por construcción, $s^{e} \bmod n = m$, así que $\mathsf{Vrfy}_{pk}(m,s) = 1$. Y el adversario **nunca llamó a** $\mathsf{Sign}$: no hay ninguna consulta de por medio, $Q = \varnothing$, y $m \notin Q$ trivialmente. Corrido contra el experimento [[firma-digital|Sig-forge]],

$$\Pr[\mathsf{Sig\text{-}forge}_{A,\Pi} = 1] = 1$$

sin gastar ninguna consulta y sin ninguna suposición computacional de por medio. La razón de fondo es que $\mathsf{Vrfy}$ recorre la exponenciación en el sentido contrario a $\mathsf{Sign}$ ($s^{e}$ en vez de $m^{d}$), así que **cualquier** $s$ define, por esa misma fórmula, un $m$ para el cual $s$ es una firma válida. El adversario no falsifica una firma para un mensaje elegido — elige la firma primero y deja que el mensaje salga de ahí. En la literatura se lo llama **ataque de no mensaje** (*no-message attack*), y es exactamente lo que el Ej. 16 de la Guía 4 pide mostrar, con la fórmula $m = \sigma^{e} \bmod N$ ya escrita en el enunciado.

## El segundo ataque: la maleabilidad multiplicativa

Con dos firmas ya consultadas, $s_1 = \mathsf{Sign}_{sk}(m_1)$ y $s_2 = \mathsf{Sign}_{sk}(m_2)$:

$$\text{emitir } (m_1\cdot m_2,\ s_1\cdot s_2)$$

$$(s_1 s_2)^{e} \bmod n = s_1^{e}\, s_2^{e} \bmod n \equiv m_1\cdot m_2 \pmod n$$

pasa la verificación, y $m_1\cdot m_2 \notin Q = \{m_1,m_2\}$ salvo el caso degenerado en que coincida con uno de los dos. La igualdad $(s_1 s_2)^{e} = s_1^{e}s_2^{e}$ **no es una casualidad del ejemplo**: es la propiedad homomórfica de la exponenciación modular —$f(a)\cdot f(b) = f(a\cdot b)$ para $f(x)=x^{e}\bmod n$— y es exactamente la misma estructura que en `RSA-Encryption` habilita la [[maleabilidad]]: ahí un atacante multiplica el criptograma por $\Delta^{e}$ para multiplicar el mensaje descifrado por $\Delta$; acá multiplica dos firmas para sumar sus mensajes en el exponente. El mecanismo que rompe confidencialidad en un lado rompe integridad en el otro, por la misma cuenta — y es también el que la Guía 4 explota en su Ej. 17 contra el **cifrado** textbook.

**Éste es el ataque que la voz eligió**, presentado como *"uno de muchos"* ataques algebraicos: *"partir de 2 mensajes firmados con RSA Signature y generar una falsificación, un tercer mensaje válido, de forma muy simple: simplemente tomando 2 mensajes con su firma y emitiendo el producto de los mensajes y el producto de las firmas. Eso vale."* (cues 1143-1146).

## El tercer problema, que sólo está en la voz: el tamaño

**Aun si no existieran los ataques, el esquema tal cual es impracticable por tamaño**, y es una observación que la filmina no hace (cues 1147-1149). La exponenciación modular sólo acepta mensajes menores que $n$, así que o se firman únicamente mensajes de ese tamaño, o hay que inventar una forma de partir el mensaje — y entonces **la firma resulta tan grande como el mensaje**: *"para firmar un documento de 10 páginas necesitamos una firma de 10 páginas; sería como una cosa rara"*. Una firma manuscrita ocupa un renglón sea cual sea la longitud del contrato; la firma digital tiene que poder hacer lo mismo, y `RSA-Signature` no puede.

> [!quote]- De la transcripción — inseguro, y además del tamaño del mensaje (cues 1139-1149)
> *"Si hacen esto, tienen un problema. Es muy común en la literatura, pero es inseguro. Hay una forma fácil de arreglarlo, que es la que se utiliza: en lugar de firmar con RSA al mensaje, calcular el hash del mensaje, usar una etiqueta, y firmar eso. Con eso resolvemos varios temas. Ataques algebraicos que existen, donde yo puedo partir de 2 mensajes firmados con RSA Signature y generar una falsificación, un tercer mensaje válido, de forma muy simple: simplemente tomando 2 mensajes con su firma y emitiendo el producto de los mensajes y el producto de las firmas. Eso vale. Éste es uno de muchos. Pero además hay un hecho sutil: si usamos esto, primero estamos limitados al tamaño de los mensajes, porque tienen que ser mensajes de tamaño $n$; o, si nos inventamos una forma de eliminar esa limitación, **la firma es tan grande como el mensaje**. Entonces imagínense: para firmar un documento de 10 páginas necesitamos una firma de 10 páginas. Sería como una cosa rara."*

## Hashed RSA: romper la estructura multiplicativa

$$\mathsf{Sign}_{sk}(m) \equiv H(m)^{d} \pmod n, \qquad \mathsf{Vrfy}_{pk}(m,s) = \bigl(H(m) \overset{?}{=} s^{e}\bmod n\bigr)$$

con $H$ una función de [[funciones-de-hash-criptograficas|hash]] **libre de colisiones**. La diferencia frente a `RSA-Signature` es mínima en la fórmula y decisiva en el efecto: ahora lo que se eleva a $d$ no es $m$ sino $H(m)$. **Y resuelve los dos problemas de una vez**, que es como la voz lo presenta: lo que se firma *"no es literalmente el mensaje, no se puede hacer este tipo de transformaciones algebraicas para atacarlo"*, y **la firma tiene tamaño fijo**, porque el hash *"toma mensajes de tamaño arbitrario pero emite una etiqueta de tamaño fijo"* (cues 1150-1154).

**Contra la firma al azar**, Hashed RSA no cambia nada estructural: el adversario sigue pudiendo sortear $s$ y calcular $H(m) := s^{e} \bmod n$... salvo que ahora tiene que producir un **mensaje** $m$ cuyo hash sea ese valor, y eso es invertir $H$ — que $H$ sea resistente a preimagen es justamente lo que bloquea este camino. Es la segunda mitad del Ej. 16 de la Guía 4: *"¿por qué se reduce el riesgo de este ataque si se usa Hash RSA?"*.

**Contra el ataque multiplicativo** *(lectura nuestra, no desarrollada en la filmina ni en la voz)*: con $s_1 = H(m_1)^{d}$ y $s_2 = H(m_2)^{d}$ ya consultados, $(s_1 s_2)^{e} \bmod n = H(m_1)\cdot H(m_2) \bmod n$. Para que esto sirviera como firma de algún mensaje $m_3$, haría falta $H(m_3) = H(m_1)\cdot H(m_2) \bmod n$ — y $H$ libre de colisiones **no tiene por qué respetar ninguna estructura algebraica** de sus entradas: no hay ninguna razón para que $H(m_1\cdot m_2) = H(m_1)\cdot H(m_2)$, y encontrar **algún** $m_3$ cuyo hash coincida con ese producto es, de nuevo, invertir $H$ o encontrarle una colisión contra un valor que el adversario no puede fijar de antemano. El hash absorbe la estructura multiplicativa de $m$ antes de que la exponenciación tenga oportunidad de conservarla.

## El límite honesto: sin prueba fuera del modelo ideal

La filmina es explícita sobre lo que Hashed RSA **no** tiene: *"no posee una prueba de seguridad a menos que se asuma un modelo ideal de $H$"* — el modelo de oráculo aleatorio, donde $H$ se trata como una función verdaderamente aleatoria a la que solo se accede por consultas, no desarrollado en esta clase. La voz lo dice desde el lado positivo, con la hipótesis en la condición: *"si la función de hash es ideal, o sea, es libre de colisiones, se puede demostrar que esta función es infalsificable"* (cues 1155-1156). Es una salvedad real, no una formalidad: significa que la seguridad de Hashed RSA no está reducida a una suposición estándar (como `RSA` de cifrado se reduce a la dificultad de factorizar) sino a una idealización de $H$ que ninguna función de hash real satisface exactamente. En la práctica el esquema se usa igual —es, con variantes de padding como `PSS`, la base de las firmas `RSA` reales— pero la garantía formal es más débil que la de otros esquemas de este bloque.

> **Sobre "ideal, o sea, libre de colisiones"** *(precisión nuestra)*. Las dos cosas no son sinónimos, y la filmina las separa bien. *Libre de colisiones* es una propiedad concreta, la [[resistencias-de-una-funcion-de-hash|tercera resistencia]]; el *modelo ideal* pide mucho más — que $H$ se comporte como una función aleatoria—. Con sólo resistencia a colisiones se puede probar que Hashed RSA no es **peor** que firmar un mensaje corto con `RSA-Signature` (la reducción de *hash-and-sign*), pero como `RSA-Signature` ya está roto, eso no alcanza; la prueba de que la firma es infalsificable necesita el modelo ideal. El vocabulario *"libre de colisiones"* es el de la cátedra en toda la Clase 03, ver [[hmac#HMAC es el paradigma hash-and-MAC|HMAC]], donde el mismo teorema sí cierra con esa sola hipótesis porque la primitiva de abajo es un MAC seguro.
