---
tipo: flashcards
titulo: Clave pública y firma digital
id: asimetrica-y-firma
division: "4"
descripcion: Diffie-Hellman, RSA, ElGamal y los esquemas de firma, con su costo y sus tamaños de clave.
---

## ¿Cuántas claves hay en un sistema de $n$ participantes con una clave por par, y cuántas con un KDC? {#asimetrica-y-firma:kdc-claves-por-par}
> pagina: distribucion-de-claves-y-kdc

Con una clave por combinación, el total es la cantidad de pares no ordenados:

$$
\binom{n}{2} = \frac{n(n-1)}{2}
$$

Es cuadrático en $n$ y cada participante administra $n-1$ claves (con $n=10$ ya son $45$ claves en el sistema). Con un *Trusted Third Party* el total pasa a ser lineal, $n$ claves, y cada participante administra una sola: la que comparte con el KDC.

## Describa cómo un KDC hace que $A$ y $C$ compartan una clave de sesión, y cuál es su precio {#asimetrica-y-firma:kdc-clave-de-sesion}
> pagina: distribucion-de-claves-y-kdc

El KDC comparte una clave fija con cada participante ($k_a$ con $A$, $k_c$ con $C$). Cuando $A$ pide hablar con $C$, el KDC genera una clave de sesión nueva $k_s$ y la envía cifrada a cada parte con la clave fija de esa parte:

$$
\text{KDC} \to A:\ \mathsf{Enc}_{k_a}(k_s) \qquad \text{KDC} \to C:\ \mathsf{Enc}_{k_c}(k_s)
$$

El precio es que el KDC queda como **único punto de falla**: si se compromete o queda inaccesible, toda la red pierde la capacidad de negociar claves, y quien lo compromete obtiene la clave fija de cada participante.

## Defina generador, orden de un elemento y elemento primitivo {#asimetrica-y-firma:generador-orden-primitivo}
> pagina: grupos-anillos-y-cuerpos

- **Generador** de un grupo de tamaño $n$: un elemento $g$ tal que $\gcd(g,n)=1$. Hay exactamente $\varphi(n)$ generadores.
- **Orden** de un elemento, $\operatorname{ord}(g)$: el tamaño del subgrupo cíclico que $g$ genera, es decir el menor $n$ tal que $g^{n}$ vuelve al neutro.
- **Elemento primitivo**: $g$ con $\operatorname{ord}(g)=n$, o sea que genera **todo** el grupo y no un subgrupo propio.

## Enuncie el experimento KE y la condición de seguridad de un intercambio de claves {#asimetrica-y-firma:experimento-ke}
> pagina: intercambio-de-claves

$$
\begin{aligned}
\textbf{Experimento } \mathsf{KE}_{A,\Pi}:\\
&\text{1. Se ejecuta } \Pi,\ \text{sea } k = k_a = k_b\\
&\text{2. Se genera } b \leftarrow \{0,1\}\\
&\text{3. Si } b=0:\ k' \leftarrow \{0,1\}^{n};\quad \text{si } b=1:\ k' = k\\
&\text{4. } A \text{ obtiene } (\mathrm{Trans}, k') \text{ y emite } b'\\
&\mathsf{KE}_{A,\Pi} = 1 \iff b = b'
\end{aligned}
$$

$$
\Pr[\mathsf{KE}_{A,\Pi}=1] < 0{,}5 + \varepsilon(n) \;\Longrightarrow\; \Pi \text{ es seguro}
$$

Modela un adversario **pasivo**: ve la transcripción pero no modifica mensajes. Se pide indistinguibilidad —y no solo "no puede calcular $k$"— para cerrar también las fugas parciales de bits de $k$.

## Escriba los pasos de Diffie-Hellman y justifique que $k_a = k_b$ {#asimetrica-y-firma:dh-protocolo}
> pagina: diffie-hellman

$$
\begin{aligned}
&\text{1. } A \text{ define } (G,q,g)\\
&\text{2. } A \text{ elige } x \leftarrow \mathbb{Z}_q,\ h_1 = g^{x};\quad A \to B: (G,q,g,h_1)\\
&\text{3. } B \text{ elige } y \leftarrow \mathbb{Z}_q,\ h_2 = g^{y};\quad B \to A: (h_2)\\
&\text{4. } k_a = h_2^{\,x} = g^{xy},\qquad k_b = h_1^{\,y} = g^{xy}
\end{aligned}
$$

Cierra porque la exponenciación es conmutativa en el exponente: $(g^{y})^{x}=g^{xy}=(g^{x})^{y}$. Viajan en claro $(G,q,g,h_1,h_2)$; $x$, $y$ y $g^{xy}$ nunca se transmiten.

## ¿Por qué la dureza del logaritmo discreto no alcanza para Diffie-Hellman y qué agrega DDH? {#asimetrica-y-firma:ddh-vs-logaritmo-discreto}
> pagina: diffie-hellman

Que no se pueda recuperar $x$ de $g^{x}$ no dice nada sobre si $g^{xy}$ *parece* aleatorio: podría existir un algoritmo que calcule alguna propiedad parcial de $g^{xy}$ (por ejemplo su bit menos significativo) sin resolver el logaritmo discreto. Hace falta la hipótesis más fuerte:

$$
\textbf{DDH: } \text{dados } g,\ g^{x},\ g^{y},\ \text{no se puede distinguir } g^{xy} \text{ de un elemento aleatorio de } G
$$

`DDH` pide indistinguibilidad computacional, no solo imposibilidad de recuperar el exponente, y es exactamente la hipótesis que hace falta para que Diffie-Hellman sea seguro en el sentido del experimento `KE`. La formulación de `DDH` es varios años posterior al protocolo (1976).

## Describa el ataque man-in-the-middle contra Diffie-Hellman y su defensa {#asimetrica-y-firma:dh-man-in-the-middle}
> pagina: diffie-hellman

$M$ intercepta los mensajes que llevan $h_1$ y $h_2$ y los sustituye por los suyos, $h_1^{M}=g^{x_M}$ y $h_2^{M}=g^{y_M}$. Entonces $A$ calcula $k_a = g^{x\cdot y_M}$ y $B$ calcula $k_b = g^{x_M\cdot y}$, y $M$ puede reconstruir **las dos** porque conoce $x_M$ e $y_M$. $A$ y $B$ nunca comparten clave entre sí: todo el tráfico pasa por $M$, que descifra, lee o modifica y vuelve a cifrar con la otra clave. No hace falta resolver el logaritmo discreto ni `DDH`. La defensa es autenticar quién envió cada $h_i$, con **firmas digitales**.

## ¿Por qué en un criptosistema asimétrico ser indistinguible ante escucha ya implica CPA-Secure? {#asimetrica-y-firma:eav-asimetrico-implica-cpa}
> pagina: criptosistema-asimetrico

Porque en el experimento `Eav` asimétrico el adversario recibe $pk$ antes de elegir $m_0,m_1$, y con $pk$ **ya tiene de fábrica la función de cifrado**: puede calcular $\mathsf{Enc}_{pk}(m)$ para cualquier $m$ sin preguntarle a nadie. Eso es exactamente lo que en el mundo simétrico había que ganar con un oráculo de consultas, que es lo único que separaba `Eav` de `CPA`.

$$
\text{Indistinguible ante adversario pasivo} \;\Longrightarrow\; \texttt{CPA-Secure}
$$

sin necesidad de un experimento `CPA` separado.

## Demuestre que un criptosistema asimétrico CPA-Secure no puede tener Enc determinística {#asimetrica-y-firma:cifrado-asimetrico-probabilistico}
> pagina: criptosistema-asimetrico

Si $\mathsf{Enc}_{pk}$ fuera determinística, el adversario de `Eav`, que conoce $pk$, calcula por su cuenta $\mathsf{Enc}_{pk}(m_0)$ y $\mathsf{Enc}_{pk}(m_1)$ y compara bit a bit contra el $c$ recibido. Esa comparación identifica $b$ con probabilidad $1$:

$$
\Pr[\mathsf{Eav}=1]=1 \gg 0{,}5+\varepsilon(n)
$$

Por eso todo criptosistema asimétrico seguro debe ser **probabilístico**: necesita aleatoriedad interna en cada ejecución de $\mathsf{Enc}$. Consecuencia directa: textbook RSA no puede ser `CPA-Secure`.

## Escriba Gen, Enc y Dec de RSA y justifique el descifrado {#asimetrica-y-firma:rsa-construccion}
> pagina: rsa

$$
\begin{aligned}
\mathsf{Gen}&:\ p,q \text{ primos},\ n=pq,\ e \leftarrow (0,\varphi(n)) \mid \gcd(e,\varphi(n))=1,\ d \mid e d \equiv 1 \!\!\pmod{\varphi(n)}\\
&\quad pk=(n,e),\quad sk=(n,d)\\
\mathsf{Enc}_{pk}(m) &\equiv m^{e} \pmod n, \qquad \mathsf{Dec}_{sk}(c) \equiv c^{d} \pmod n
\end{aligned}
$$

Con $\varphi(n)=(p-1)(q-1)$ y $d$ obtenido por Euclides extendido. Cierra por Euler-Fermat: $ed = 1+k\varphi(n)$, luego

$$
m^{ed} = m\cdot\bigl(m^{\varphi(n)}\bigr)^{k} \equiv m \pmod n
$$

## En textbook RSA, ¿qué falla cuando $m^{e} < n$? {#asimetrica-y-firma:rsa-mensajes-pequenos}
> pagina: rsa

La exponenciación **no da vuelta** módulo $n$: el resultado ya es menor que el módulo, así que $c = m^{e}$ sin reducción. Recuperar $m$ no exige invertir nada módulo $n$, alcanza con la **raíz $e$-ésima entera ordinaria** de $c$ (no es un logaritmo: el logaritmo discreto es el problema de Diffie-Hellman). Por eso es peligroso $e=3$: con $m < n^{1/3}$ —para $n$ de $2048$ bits, $m$ de menos de unos $683$ bits— el ataque funciona sin factorizar $n$ ni conocer $d$.

## Escriba el mensaje paddeado de PKCS#1 v1.5 y sus restricciones de tamaño {#asimetrica-y-firma:pkcs1-formato-padding}
> pagina: pkcs1-y-tamano-de-claves

Con $k$ la longitud de $n$ en bytes y $D$ la longitud de $m$ en bytes:

$$
m' = \texttt{00000000} \Vert \texttt{00000010} \Vert r \Vert \texttt{00000000} \Vert m
$$

con $r$ de $k-D-3$ bytes aleatorios y **distintos de cero**, y $m$ de a lo sumo $k-11$ bytes. Después se cifra $\mathsf{Enc}_{pk}(m)=(m')^{e}\bmod n$. $r$ no puede tener bytes en cero porque el despaddeo separa $r$ de $m$ buscando el primer $\texttt{00}$: un cero dentro de $r$ haría el formato ambiguo.

## ¿Hasta qué nivel de seguridad llega PKCS#1 v1.5? {#asimetrica-y-firma:pkcs1-cpa-no-cca}
> pagina: pkcs1-y-tamano-de-claves

Se cree que es `CPA-Secure`, pero se encontraron ataques que muestran que **no es `CCA-Secure`**. Es decir: el padding aleatorio de RSA está para volverlo `CPA-Secure`, no para resistir texto cifrado elegido — la sentencia de examen que dice lo contrario es **falsa**. El motivo es que la validación del padding puede usarse como *padding oracle*: el ataque de Bleichenbacher (1998) explota la maleabilidad multiplicativa de RSA —cifrar $c\cdot s^{e}\bmod n$ es cifrar $m\cdot s$— y va acotando $m$ con la sola respuesta "padding válido / inválido".

## Escriba Gen, Enc y Dec de El Gamal y justifique el descifrado {#asimetrica-y-firma:elgamal-construccion}
> pagina: el-gamal

$$
\begin{aligned}
\mathsf{Gen}&:\ (G,q,g),\ x \leftarrow \mathbb{Z}_q,\ h=g^{x};\quad pk=(G,q,g,h),\ sk=(G,q,g,x)\\
\mathsf{Enc}_{pk}(m)&:\ y \leftarrow \mathbb{Z}_q,\ c=(c_1,c_2)=\bigl(g^{y},\ h^{y}m\bigr)\\
\mathsf{Dec}_{sk}(c) &= c_2/c_1^{\,x}
\end{aligned}
$$

$$
\frac{c_2}{c_1^{x}}=\frac{(g^{x})^{y}m}{g^{xy}}=m
$$

Es Diffie-Hellman con un paso más: $g^{xy}$ se usa como **máscara multiplicativa**. Si `DDH` es difícil en $G$, El Gamal es `CPA-Secure`; el $y$ se sortea en cada cifrado, así que es probabilístico sin padding, a costa de que $c$ mide el doble que $m$.

## ¿Qué tamaño de $n$ hace falta en criptografía asimétrica y por qué depende del tipo de campo? {#asimetrica-y-firma:tamanos-de-clave-asimetrica}
> pagina: costo-del-cifrado-asimetrico

El nivel de seguridad es **relativo al tamaño de los conjuntos involucrados**, no un espacio de búsqueda de fuerza bruta como en simétrico: depende de qué tan rápido se sabe atacar cada estructura. Con $n_{\mathrm{RSA}}=p\cdot q$ y $n_{\text{El Gamal}}=q$:

- Campo numérico: $\geq 1024$ bits como piso **histórico**; recomendación actual **1536 o 2048** bits.
- Curvas elípticas: $\geq 320$ bits para un nivel comparable.

Esa brecha entre 2048 y 320 es la razón de ser de la criptografía de curva elíptica.

## ¿Qué tres propiedades da una firma digital que un MAC no puede dar, y por qué? {#asimetrica-y-firma:firma-digital-no-repudio}
> pagina: firma-digital

Salen de que firmar usa $sk$ y verificar usa $pk$, mientras que un MAC usa una única clave compartida:

- **Verificación pública**: cualquiera con $pk$ verifica, sin recibir ningún secreto.
- **Transferible**: la misma firma sirve para varios destinatarios y se puede reenviar.
- **No repudio**: quien firmó no puede negarlo, porque solo esa persona conoce $sk$. Un MAC no lo da: **ambas** partes conocen la clave, así que cualquiera de las dos pudo generar la etiqueta.

La terna es $(\mathsf{Gen},\mathsf{Sign},\mathsf{Vrfy})$ con $\mathsf{Vrfy}_{pk}(m,\mathsf{Sign}_{sk}(m))=1$.

## Enuncie el experimento Sig-forge y su condición de seguridad {#asimetrica-y-firma:sig-forge}
> pagina: firma-digital

$$
\begin{aligned}
\textbf{Experimento } \mathsf{Sig\text{-}forge}_{A,\Pi}:\\
&\text{1. } k=(sk,pk) \leftarrow \mathcal{K}\\
&\text{2. } A \text{ obtiene } pk \text{ y el oráculo } f(x)=\mathsf{Sign}_{sk}(x)\\
&\text{3. } A \text{ hace las evaluaciones que quiera}\ (Q := \text{consultas})\\
&\text{4. } A \text{ emite } (m,s)\\
&\mathsf{Sig\text{-}forge}_{A,\Pi} = 1 \iff \mathsf{Vrfy}_{pk}(m,s)=1 \ \wedge\ m \notin Q
\end{aligned}
$$

$$
\Pr[\mathsf{Sig\text{-}forge}_{A,\Pi}=1] \leq \mathsf{negl}(n) \quad \text{para todo adversario PPT}
$$

La correctud solo pide que verificar lo firmado dé $1$ —la cumple hasta un esquema roto—; `Sig-forge` es lo que separa "funciona" de "es seguro".

## Describa los dos ataques que rompen RSA-Signature sin hash {#asimetrica-y-firma:rsa-signature-ataques}
> pagina: rsa-signature-y-hashed-rsa

Con $\mathsf{Sign}_{sk}(m)=m^{d}$ y $\mathsf{Vrfy}_{pk}(m,s)=(m \overset{?}{=} s^{e})$:

**1. Firma al azar.** Se elige $s$ al azar y se define $m := s^{e}\bmod n$; el par $(m,s)$ verifica por construcción y $Q=\varnothing$, así que $\Pr[\mathsf{Sig\text{-}forge}=1]=1$ sin ninguna consulta ni suposición computacional.

**2. Maleabilidad multiplicativa.** Con $s_1,s_2$ ya consultadas, se emite $(m_1m_2,\ s_1s_2)$, y $(s_1s_2)^{e} \equiv m_1m_2 \pmod n$ por la propiedad homomórfica de $x^{e}\bmod n$.

## ¿Cómo arregla Hashed RSA esos ataques y qué garantía formal le falta? {#asimetrica-y-firma:hashed-rsa-modelo-ideal}
> pagina: rsa-signature-y-hashed-rsa

$$
\mathsf{Sign}_{sk}(m) \equiv H(m)^{d} \pmod n, \qquad \mathsf{Vrfy}_{pk}(m,s)=\bigl(H(m) \overset{?}{=} s^{e}\bmod n\bigr)
$$

con $H$ libre de colisiones. Contra la firma al azar, el adversario todavía puede fijar $H(m):=s^{e}$, pero ahora necesita un $m$ con ese hash, o sea **invertir $H$**. Contra el ataque multiplicativo, haría falta $H(m_3)=H(m_1)H(m_2)$, y $H$ no respeta ninguna estructura algebraica de sus entradas. El límite: no posee prueba de seguridad **a menos que se asuma un modelo ideal de $H$** (oráculo aleatorio), idealización que ninguna función real satisface.

## Escriba Sign y Vrfy de DSA y explique por qué la verificación cierra {#asimetrica-y-firma:dsa-firma-y-verificacion}
> pagina: digital-signature-standard

$$
\begin{aligned}
\mathsf{Sign}_{sk}(m):\ &k \leftarrow \mathbb{Z}_q,\quad r=(g^{k}\bmod p)\bmod q,\quad s=\bigl[H(m)+x r\bigr]k^{-1}\bmod q\\
\mathsf{Vrfy}_{pk}(m,(r,s)):\ &v_1=H(m)s^{-1}\bmod q,\quad v_2=r s^{-1}\bmod q\\
&\text{aceptar} \iff r \overset{?}{=} (g^{v_1}y^{v_2}\bmod p)\bmod q
\end{aligned}
$$

Cierra porque $g^{v_1}y^{v_2}=g^{s^{-1}[H(m)+xr]}=g^{k}$: la verificación **reconstruye el mismo $k$** sin que $k$ viaje nunca. El $k$ efímero es tan sensible como $x$: reutilizarlo entre dos firmas permite despejar $k$ y de ahí la clave privada.
