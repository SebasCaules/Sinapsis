---
title: Digital Signature Standard
resumen: 'Estándar del NIST para firma digital; la variante DSA que desarrolla la clase opera sobre el logaritmo discreto en un subgrupo de orden $q$ dentro de $\mathbb{Z}_p^{*}$, con generación de claves, firma y verificación. En el aula quedó de lectura: lo que se dijo es por qué se lo prefiere hoy.'
fuentes: ["[[clase-04-criptografia-asimetrica-y-firma-digital]]", "[[firma-digital]]", "[[grupos-anillos-y-cuerpos]]", "[[diffie-hellman]]"]
aliases: [Digital Signature Standard, DSS, DSA, Digital Signature Algorithm, ECDSA, Subgrupo de orden q]
type: concepto
unidad: 1
clase: 4
orden: 12
created: 2026-09-04
updated: 2026-09-14
tags: [criptografia, firma-digital, dss, dsa, logaritmo-discreto, nist, clase-04, transcripcion]
sources: ["Clase 04 - Criptografia - Cifrado asimetrico y firma digital.pdf", "raw/clases/Clase 04 - Transcripcion.VTT"]
---

# Digital Signature Standard

**El estándar del NIST para firma digital sobre el problema del logaritmo discreto: la variante `DSA` que desarrolla la filmina, con su generación de claves, su firma y su verificación completas.**

> **Fuentes de esta nota.** Filminas **39-40** de la Clase 04, dictada el **10/09** por Pablo Abad, con transcripción: [`Clase 04 - Transcripcion.VTT`](../../raw/clases/Clase%2004%20-%20Transcripcion.VTT), cues **1157-1167** — los últimos dos minutos de la clase. **Las fórmulas quedaron de lectura**: *"en aras de tiempo, se los dejo ahí para que lo vean y después lo lean; si expanden esta verificación van a ver que llegan al resultado, no es complicado llegar"* (cues 1161-1163). Lo que la voz sí dio es el encuadre —qué es, por qué se puede llevar a curvas elípticas y por qué se lo prefiere para proyectos nuevos—; el desarrollo de las fórmulas de esta nota sigue siendo contra el PDF y Katz & Lindell, con lo propio rotulado.

## Qué es DSS y qué parte cubre esta nota

`DSS` (*Digital Signature Standard*) es el estándar del NIST para firma digital. Admite varias familias de esquemas subyacentes —sobre el logaritmo discreto clásico (`DSA`), sobre curvas elípticas (`ECDSA`) y sobre `RSA`— y la filmina desarrolla en detalle **solo la primera**, `DSA` (*Digital Signature Algorithm*). Es, en el fondo, un pariente cercano de El Gamal y de Diffie-Hellman: las tres construcciones corren sobre el mismo problema —el logaritmo discreto— con la misma clase de parámetros $(p,q,g)$.

**Así lo ubica la voz**: es *"el estándar actual"*, y la relación con `RSA-Signature` *"sigue la idea de RSA versus El Gamal"* — la gran diferencia es que `DSS` **está definido sobre grupos algebraicos**, y por eso *"muy en particular, se puede trabajar sobre curvas elípticas"*. La firma y la verificación son más complejas, pero *"el punto más importante es esta capacidad de trabajar con firmas más compactas usando curvas elípticas"* (cues 1157-1164). Es el mismo argumento de [[el-gamal#Cualquier grupo: polinomios y curvas elípticas|El Gamal]] trasladado a la firma: un esquema escrito sobre un grupo abstracto se muda de grupo, y en curvas elípticas el mismo nivel de seguridad cuesta muchos menos bits.

> [!quote]- De la transcripción — el estándar actual, y por qué se lo favorece (cues 1157-1167)
> *"La siguiente firma más utilizada es un poco más compleja. Se llama DSS, Digital Signature Standard: es el estándar actual. Si quieren, sigue esta idea de RSA versus El Gamal: la gran diferencia entre RSA y DSS es que DSS está definido sobre grupos algebraicos. Entonces, muy en particular, DSS se puede trabajar sobre curvas elípticas. La firma es más compleja, la verificación es más compleja. En aras de tiempo, se los dejo ahí para que lo vean y después lo lean; si expanden esta verificación van a ver que llegan al resultado, no es complicado llegar. Pero el punto más importante es esta capacidad de trabajar con firmas más compactas usando curvas elípticas. Desde un punto de vista práctico, ambas funciones se usan bastante en el campo de firmas digitales; para proyectos nuevos se tiende a favorecer DSS, porque es una función que está estandarizada por los IRAM de muchos países: está más visible, más estudiada y más homologada en distintos ámbitos."*

> **Precisión sobre "los IRAM de muchos países"** *(nuestra)*. `DSS` es el **FIPS 186** del NIST estadounidense; su variante sobre curvas, `ECDSA`, está además en normas ANSI (X9.62) e ISO/IEC (14888-3), que son las que los organismos nacionales de normalización —el IRAM en Argentina— adoptan. Ése es el sentido de la frase: no que cada país tenga su propio estándar, sino que el mismo esquema está homologado en varias jurisdicciones, cosa que para una firma con validez legal —ver [[firma-digital#El marco legal: firma registrada, presunción de validez y la ley argentina|Firma digital]]— importa tanto como la criptografía. Y un dato de contexto que la voz no tiene: FIPS 186-5 (2023) **retiró `DSA` clásico** para generar firmas nuevas; lo que queda vigente del estándar son `ECDSA`, `EdDSA` y `RSA`. Que la filmina desarrolle justo la variante retirada no la vuelve inútil: `ECDSA` es la misma construcción sobre otro grupo, y entenderla sobre $\mathbb{Z}_p^{*}$ es el camino corto.

## Generación de claves

Se elige primero una función de hash ($\mathrm{SHA1}$ o $\mathrm{SHA2}$) y un par de tamaños $(L,N)$ entre cuatro combinaciones estandarizadas: $(1024,160)$, $(2048,224)$, $(2048,256)$ o $(3072,256)$. Con eso:

$$\begin{aligned}
&q \leftarrow \text{primo de tamaño } N \text{ bits}\\
&p \leftarrow \text{primo de tamaño } L \text{ bits} \mid (p-1) \equiv 0 \pmod q\\
&g \leftarrow \text{generador de orden } q \text{ módulo } p \quad \bigl(g^{(p-1)/q} \neq 1\bigr)\\
&x \leftarrow \mathbb{Z}_q,\quad y = g^{x}\bmod p\\
&pk = (p,q,g,y),\quad sk = (p,q,g,x)
\end{aligned}$$

> **Errata de la filmina (39).** El segundo paso dice *"$p \leftarrow$ primo de tamaño $\mathbf{P}$ / $(p-1) = 0 \bmod q$"* — con una $P$ mayúscula que la lámina no define en ningún lado: dos líneas antes fija el único par de tamaños del esquema como $(L,N)$, y $q$ ya se llevó la $N$. Verificado con un recorte de la página renderizada a 150 dpi: el glifo es una $P$ mayúscula, no una $L$ ni un aplanado de `pdftotext`. La variable correcta es $L$, reservada para el tamaño del módulo $p$. Arriba va escrito ya así. En el aula la lámina no se leyó.

**Por qué $g$ no genera todo $\mathbb{Z}_p^{*}$.** $G = \mathbb{Z}_p^{*}$ tiene orden $p-1$, pero $g$ se elige de **orden $q$** — un subgrupo, no el grupo completo. Por eso hace falta que $q$ divida a $p-1$: es la condición que garantiza que exista un subgrupo de ese tamaño exacto dentro de $\mathbb{Z}_p^{*}$. La condición $g^{(p-1)/q} \neq 1$ es el chequeo de que $g$ efectivamente tiene orden $q$ y no un divisor menor — la misma terna generador/orden/elemento primitivo que [[grupos-anillos-y-cuerpos|Grupos, anillos y cuerpos]] trae de esta misma clase, y que [[cuerpos-finitos-y-campos-de-galois|Cuerpos finitos y campos de Galois]] desarrolla con demostración. Es también la respuesta a la pregunta que el docente dejó abierta en el repaso —*"ahora vamos a ver para qué son interesantes los subgrupos"*, cue 372—: para esto.

**Por qué dos primos y no uno** *(lectura nuestra: la filmina no explicita la motivación de usar dos tamaños distintos)*. Trabajar en un subgrupo de orden $q$ —chico, de $N$ bits— en vez de en $\mathbb{Z}_p^{*}$ completo —de $L$ bits, mucho más grande— es lo que permite que la firma $(r,s)$ mida solo del orden de $2N$ bits en vez de depender del tamaño completo de $p$: los cálculos de $\mathsf{Sign}$ y $\mathsf{Vrfy}$ trabajan módulo $q$, y $p$ solo entra como el módulo de la exponenciación de fondo. Es la versión sobre enteros de la *"firma más compacta"* que la voz atribuye a las curvas: en `ECDSA` el papel de $q$ lo cumple el orden del punto base, y la firma mide igual, $2N$ bits.

## Firma y verificación

$$\begin{aligned}
\mathsf{Sign}_{sk}(m):\quad &k \leftarrow \mathbb{Z}_q,\quad r = (g^{k}\bmod p)\bmod q\\
&s = \bigl[H(m) + x\cdot r\bigr]\cdot k^{-1} \bmod q\\
&\mathsf{Sign}_{sk}(m) = (r,s)\\[6pt]
\mathsf{Vrfy}_{pk}(m,(r,s)):\quad &v_1 = \bigl[H(m)\cdot s^{-1}\bigr]\bmod q,\qquad v_2 = r\cdot s^{-1}\bmod q\\
&\text{aceptar} \iff r \overset{?}{=} \bigl(g^{v_1}\cdot y^{v_2}\bmod p\bigr)\bmod q
\end{aligned}$$

**Por qué la verificación funciona** *(la expansión que el docente dejó como tarea, cue 1163)*. Sustituyendo $v_1$ y $v_2$ en $g^{v_1}\cdot y^{v_2}$:

$$g^{v_1}\cdot y^{v_2} = g^{H(m)\cdot s^{-1}} \cdot g^{x\cdot r\cdot s^{-1}} = g^{\,s^{-1}\left[H(m) + x\cdot r\right]}$$

Y por la definición de $s$: como $s = \bigl[H(m)+x\cdot r\bigr]\cdot k^{-1}$, se tiene $s\cdot k \equiv H(m)+x\cdot r \pmod q$, y despejando queda $s^{-1}\bigl[H(m)+x\cdot r\bigr] \equiv k \pmod q$. Entonces $g^{v_1}y^{v_2} = g^{k} \bmod p$, y tomando ese resultado módulo $q$ se recupera $r$: la verificación cierra porque **reconstruye el mismo $k$** que se usó para firmar, sin que $k$ viaje nunca en claro. *(El paso "los exponentes se reducen módulo $q$" es legítimo precisamente porque $g$ tiene orden $q$: $g^{a} = g^{a \bmod q}$. Sin la elección de $g$ de la sección anterior, la cuenta no cierra.)*

**El $k$ efímero es tan sensible como una clave privada** *(precisión nuestra, no está en la filmina ni en la voz; es un resultado estándar de la literatura sobre `DSA`)*. Cada firma sortea un $k$ nuevo, y $k$ tiene que mantenerse tan secreto e impredecible como $x$: si $k$ se reutiliza entre dos firmas —o es predecible—, un atacante que observe dos pares $(r,s_1)$ y $(r,s_2)$ con el mismo $r$ (mismo $k$) puede despejar $k$ de las dos ecuaciones de $s$ y, de ahí, la clave privada $x$. Es el mismo tipo de fragilidad que ya apareció con el `IV` fijo obligatorio de [[cbc-mac|CBC-MAC]] o con la reutilización de la clave del [[one-time-pad|One Time Pad]], aunque acá el mecanismo algebraico que lo explota es distinto —una falla de este tipo fue la que rompió las claves de firma de la PlayStation 3—.

## Qué no cubre esta filmina

El deck desarrolla solo `DSA` — la variante sobre $\mathbb{Z}_p^{*}$. El estándar `DSS` completo del NIST admite además variantes sobre `RSA` y `ECDSA` (sobre curvas elípticas), ninguna de las dos desarrollada en este material, aunque la voz nombra la segunda como el motivo de peso para preferir el estándar. `ECDSA` es, en espíritu, la misma construcción de $\mathsf{Sign}$/$\mathsf{Vrfy}$ trasladada a un grupo de curva elíptica en vez de $\mathbb{Z}_p^{*}$ — coherente con el tamaño de clave mucho menor que [[costo-del-cifrado-asimetrico|Costo del cifrado asimétrico]] da para ese tipo de campo. Y vale la misma advertencia que en las otras dos notas: sobre curvas o sobre enteros, `DSS` cae ante el algoritmo de Shor igual que `RSA` — ver [[diffie-hellman#La pregunta sobre computación cuántica|Diffie-Hellman]].
