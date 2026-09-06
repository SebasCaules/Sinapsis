---
title: Digital Signature Standard
resumen: 'Estándar del NIST para firma digital; la variante DSA que desarrolla la clase opera sobre el logaritmo discreto en un subgrupo de orden $q$ dentro de $\mathbb{Z}_p^{*}$, con generación de claves, firma y verificación.'
fuentes: ["[[clase-04-criptografia-asimetrica-y-firma-digital]]", "[[firma-digital]]", "[[grupos-anillos-y-cuerpos]]", "[[diffie-hellman]]"]
aliases: [Digital Signature Standard, DSS, DSA, Digital Signature Algorithm, ECDSA, Subgrupo de orden q]
type: concepto
unidad: 1
clase: 4
orden: 12
created: 2026-09-04
updated: 2026-09-04
tags: [criptografia, firma-digital, dss, dsa, logaritmo-discreto, nist, clase-04, sin-dictar]
sources: ["Clase 04 - Criptografia - Cifrado asimetrico y firma digital.pdf"]
---

# Digital Signature Standard

**El estándar del NIST para firma digital sobre el problema del logaritmo discreto: la variante `DSA` que desarrolla la filmina, con su generación de claves, su firma y su verificación completas.**

> Filminas **39-40** del PDF de teoría de la Clase 04. La clase todavía no se dictó (hoy es 04/09/2026): nota escrita contra el PDF de filminas, Katz & Lindell y lecturas propias rotuladas.

## Qué es DSS y qué parte cubre esta nota

`DSS` (*Digital Signature Standard*) es el estándar del NIST para firma digital. Admite varias familias de esquemas subyacentes —sobre el logaritmo discreto clásico (`DSA`), sobre curvas elípticas (`ECDSA`) y sobre `RSA`— y la filmina desarrolla en detalle **solo la primera**, `DSA` (*Digital Signature Algorithm*). Es, en el fondo, un pariente cercano de El Gamal y de Diffie-Hellman: las tres construcciones corren sobre el mismo problema —el logaritmo discreto— con la misma clase de parámetros $(p,q,g)$.

## Generación de claves

Se elige primero una función de hash ($\mathrm{SHA1}$ o $\mathrm{SHA2}$) y un par de tamaños $(L,N)$ entre cuatro combinaciones estandarizadas: $(1024,160)$, $(2048,224)$, $(2048,256)$ o $(3072,256)$. Con eso:

$$\begin{aligned}
&q \leftarrow \text{primo de tamaño } N \text{ bits}\\
&p \leftarrow \text{primo de tamaño } L \text{ bits} \mid (p-1) \equiv 0 \pmod q\\
&g \leftarrow \text{generador de orden } q \text{ módulo } p \quad \bigl(g^{(p-1)/q} \neq 1\bigr)\\
&x \leftarrow \mathbb{Z}_q,\quad y = g^{x}\bmod p\\
&pk = (p,q,g,y),\quad sk = (p,q,g,x)
\end{aligned}$$

> **Errata de la filmina (39).** El segundo paso dice *"$p \leftarrow$ primo de tamaño $\mathbf{P}$ / $(p-1) = 0 \bmod q$"* — con una $P$ mayúscula que la lámina no define en ningún lado: dos líneas antes fija el único par de tamaños del esquema como $(L,N)$, y $q$ ya se llevó la $N$. Verificado con un recorte de la página renderizada a 150 dpi: el glifo es una $P$ mayúscula, no una $L$ ni un aplanado de `pdftotext`. La variable correcta es $L$, reservada para el tamaño del módulo $p$. Arriba va escrito ya así.

**Por qué $g$ no genera todo $\mathbb{Z}_p^{*}$.** $G = \mathbb{Z}_p^{*}$ tiene orden $p-1$, pero $g$ se elige de **orden $q$** — un subgrupo, no el grupo completo. Por eso hace falta que $q$ divida a $p-1$: es la condición que garantiza que exista un subgrupo de ese tamaño exacto dentro de $\mathbb{Z}_p^{*}$. La condición $g^{(p-1)/q} \neq 1$ es el chequeo de que $g$ efectivamente tiene orden $q$ y no un divisor menor — la misma terna generador/orden/elemento primitivo que [[grupos-anillos-y-cuerpos|Grupos, anillos y cuerpos]] trae de esta misma clase, y que [[cuerpos-finitos-y-campos-de-galois|Cuerpos finitos y campos de Galois]] desarrolla con demostración.

**Por qué dos primos y no uno** *(lectura nuestra: la filmina no explicita la motivación de usar dos tamaños distintos)*. Trabajar en un subgrupo de orden $q$ —chico, de $N$ bits— en vez de en $\mathbb{Z}_p^{*}$ completo —de $L$ bits, mucho más grande— es lo que permite que la firma $(r,s)$ mida solo del orden de $2N$ bits en vez de depender del tamaño completo de $p$: los cálculos de $\mathsf{Sign}$ y $\mathsf{Vrfy}$ trabajan módulo $q$, y $p$ solo entra como el módulo de la exponenciación de fondo.

## Firma y verificación

$$\begin{aligned}
\mathsf{Sign}_{sk}(m):\quad &k \leftarrow \mathbb{Z}_q,\quad r = (g^{k}\bmod p)\bmod q\\
&s = \bigl[H(m) + x\cdot r\bigr]\cdot k^{-1} \bmod q\\
&\mathsf{Sign}_{sk}(m) = (r,s)\\[6pt]
\mathsf{Vrfy}_{pk}(m,(r,s)):\quad &v_1 = \bigl[H(m)\cdot s^{-1}\bigr]\bmod q,\qquad v_2 = r\cdot s^{-1}\bmod q\\
&\text{aceptar} \iff r \overset{?}{=} \bigl(g^{v_1}\cdot y^{v_2}\bmod p\bigr)\bmod q
\end{aligned}$$

**Por qué la verificación funciona** *(lectura nuestra, no desarrollada en la filmina)*. Sustituyendo $v_1$ y $v_2$ en $g^{v_1}\cdot y^{v_2}$:

$$g^{v_1}\cdot y^{v_2} = g^{H(m)\cdot s^{-1}} \cdot g^{x\cdot r\cdot s^{-1}} = g^{\,s^{-1}\left[H(m) + x\cdot r\right]}$$

Y por la definición de $s$: como $s = \bigl[H(m)+x\cdot r\bigr]\cdot k^{-1}$, se tiene $s\cdot k \equiv H(m)+x\cdot r \pmod q$, y despejando queda $s^{-1}\bigl[H(m)+x\cdot r\bigr] \equiv k \pmod q$. Entonces $g^{v_1}y^{v_2} = g^{k} \bmod p$, y tomando ese resultado módulo $q$ se recupera $r$: la verificación cierra porque **reconstruye el mismo $k$** que se usó para firmar, sin que $k$ viaje nunca en claro.

**El $k$ efímero es tan sensible como una clave privada** *(precisión nuestra, no está en la filmina; es un resultado estándar de la literatura sobre `DSA`)*. Cada firma sortea un $k$ nuevo, y $k$ tiene que mantenerse tan secreto e impredecible como $x$: si $k$ se reutiliza entre dos firmas —o es predecible—, un atacante que observe dos pares $(r,s_1)$ y $(r,s_2)$ con el mismo $r$ (mismo $k$) puede despejar $k$ de las dos ecuaciones de $s$ y, de ahí, la clave privada $x$. Es el mismo tipo de fragilidad que ya apareció con el `IV` fijo obligatorio de [[cbc-mac|CBC-MAC]] o con la reutilización de la clave del [[one-time-pad|One Time Pad]], aunque acá el mecanismo algebraico que lo explota es distinto —una falla de este tipo fue la que rompió las claves de firma de la PlayStation 3—.

## Qué no cubre esta filmina

El deck desarrolla solo `DSA` — la variante sobre $\mathbb{Z}_p^{*}$. El estándar `DSS` completo del NIST admite además variantes sobre `RSA` y `ECDSA` (sobre curvas elípticas), ninguna de las dos desarrollada en este material. `ECDSA` es, en espíritu, la misma construcción de $\mathsf{Sign}$/$\mathsf{Vrfy}$ trasladada a un grupo de curva elíptica en vez de $\mathbb{Z}_p^{*}$ — coherente con el tamaño de clave mucho menor que [[costo-del-cifrado-asimetrico|Costo del cifrado asimétrico]] da para ese tipo de campo.

## Ver también

- [[clase-04-criptografia-asimetrica-y-firma-digital#13. Digital Signature Standard|Clase 04 — Criptografía asimétrica y firma digital § 13. Digital Signature Standard]]
- [[firma-digital|Firma digital]] — la terna genérica y `Sig-forge`, que este esquema instancia
- [[rsa-signature-y-hashed-rsa|RSA-Signature y Hashed RSA]] — la otra instancia de firma digital de la clase, con hash de por medio también
- [[diffie-hellman|Diffie-Hellman]] — el mismo problema del logaritmo discreto, y la misma terna $(p,q,g)$ vista como protocolo de intercambio
- [[grupos-anillos-y-cuerpos|Grupos, anillos y cuerpos]] — generador, orden y elemento primitivo, la terna que decide por qué $g$ tiene orden $q$ y no $p-1$
- [[cuerpos-finitos-y-campos-de-galois|Cuerpos finitos y campos de Galois]] — desarrollo completo de subgrupos, orden y generadores
- [[funciones-de-hash-criptograficas|Funciones de hash criptográficas]] · [[primitivas-de-hash-estandar|Primitivas de hash estándar]] — $\mathrm{SHA1}$/$\mathrm{SHA2}$, las dos opciones que ofrece la generación de claves
- [[costo-del-cifrado-asimetrico|Costo del cifrado asimétrico]] — por qué `ECDSA` puede usar módulos mucho más chicos
- [[cbc-mac|CBC-MAC]] · [[one-time-pad|One Time Pad]] — otros dos casos de la materia donde un valor "efímero" mal manejado (IV, clave) rompe todo el esquema
