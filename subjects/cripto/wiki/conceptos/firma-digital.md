---
title: Firma digital
resumen: 'Versión de clave pública de un MAC: se firma con la clave privada y se verifica con la pública, lo que aporta verificación pública, transferibilidad y no repudio. Su seguridad se mide con el experimento Sig-forge.'
fuentes: ["[[clase-04-criptografia-asimetrica-y-firma-digital]]", "[[message-authentication-code]]", "[[seguridad-de-un-mac]]", "[[rsa-signature-y-hashed-rsa]]"]
aliases: [Firma digital, Digital signature, Sig-forge, Terna Gen Sign Vrfy, No repudio (firma digital)]
type: concepto
unidad: 1
clase: 4
orden: 10
created: 2026-09-04
updated: 2026-09-04
tags: [criptografia, firma-digital, no-repudio, sig-forge, clave-publica, clase-04, sin-dictar]
sources: ["Clase 04 - Criptografia - Cifrado asimetrico y firma digital.pdf"]
---

# Firma digital

**La versión de clave pública de un MAC: la terna $(\mathsf{Gen}, \mathsf{Sign}, \mathsf{Vrfy})$ y el experimento `Sig-forge` con el que se mide si es falsificable.**

> Filminas **33-35** del PDF de teoría de la Clase 04. La clase todavía no se dictó (hoy es 04/09/2026): nota escrita contra el PDF de filminas, Katz & Lindell y lecturas propias rotuladas.

## El mismo objetivo que un MAC, con otra clave

Una firma digital persigue integridad, igual que un [[message-authentication-code|MAC]]. La diferencia decisiva es **qué clave usa cada operación**: firmar usa una clave **privada** ($sk$) y verificar usa la clave **pública** correspondiente ($pk$), mientras que en un MAC las dos partes comparten la misma clave simétrica. De esa asimetría de claves salen, sin ningún mecanismo extra, tres propiedades que un MAC no puede dar:

- **Verificación pública.** Cualquiera con $pk$ puede verificar, sin que quien firmó le confíe ningún secreto.
- **Transferible.** La misma firma sirve para varios destinatarios a la vez, o se reenvía y sigue siendo verificable — un MAC atado a una clave compartida entre dos partes específicas no tiene ese sentido para un tercero.
- **No repudio.** Quien firmó no puede negar haberlo hecho, porque solo esa persona conoce $sk$. Un MAC no puede darlo: **ambas** partes conocen la clave, así que cualquiera de las dos pudo haber generado la etiqueta — no hay forma de decidir cuál.

El no repudio es la propiedad con peso legal — es la que la [[clase-01-introduccion-y-criptografia-clasica#1. Criptografía|Clase 01]] ya mencionaba con el dato de la ley argentina de firma digital, que la equipara a la firma de puño y letra.

## La terna de algoritmos

$$\begin{aligned}
\mathsf{Gen}&:\ (n) \to k = (sk, pk)\\
\mathsf{Sign}&:\ s \leftarrow \mathsf{Sign}_{sk}(m)\\
\mathsf{Vrfy}&:\ b = \mathsf{Vrfy}_{pk}(m,s)\\[4pt]
&\text{Propiedad de correctud: para todo } m,\ \mathsf{Vrfy}_{pk}\bigl(m,\mathsf{Sign}_{sk}(m)\bigr) = 1
\end{aligned}$$

La forma es literalmente la de un [[message-authentication-code|MAC]] —$(\mathsf{Gen},\mathsf{Mac},\mathsf{Vrfy})$ ahí, $(\mathsf{Gen},\mathsf{Sign},\mathsf{Vrfy})$ acá— con $\mathsf{Sign}$ en el rol de $\mathsf{Mac}$ y una clave de cada tipo en vez de una sola compartida.

## El experimento Sig-forge

$$\begin{aligned}
\textbf{Experimento } \mathsf{Sig\text{-}forge}_{A,\Pi}:\\
&\text{1. Se genera } k=(sk,pk) \leftarrow \mathcal{K}\\
&\text{2. } A \text{ obtiene } f(x) = \mathsf{Sign}_{sk}(x) \text{ y } pk\\
&\text{3. } A \text{ hace las evaluaciones que quiera de } f(x)\quad (Q := \text{conjunto de evaluaciones})\\
&\text{4. } A \text{ emite } (m,s)\\
&\mathsf{Sig\text{-}forge}_{A,\Pi} = 1 \iff \mathsf{Vrfy}_{pk}(m,s)=1 \text{ y } m \notin Q
\end{aligned}$$

Comparado con [[seguridad-de-un-mac|Mac-Forge]], el cambio es el mismo que en la terna: el adversario ya no necesita un oráculo compartido con quien firma — **recibe $pk$ directamente**, en el paso 2, junto con acceso de oráculo a $\mathsf{Sign}_{sk}$ para las consultas que quiera hacer antes de emitir su falsificación. Un esquema es seguro (infalsificable) cuando

$$\Pr[\mathsf{Sig\text{-}forge}_{A,\Pi} = 1] \leq \mathsf{negl}(n)$$

para todo adversario `PPT` — el mismo umbral de despreciabilidad que gobierna toda la materia desde [[seguridad-computacional|Seguridad computacional]].

## Qué exige Sig-forge que la propiedad de correctud no exige

La propiedad de correctud de la terna dice que firmar y verificar el **mismo** mensaje siempre da $1$ — eso lo cumple cualquier esquema, incluso uno completamente roto. `Sig-forge` es la condición que separa "funciona" de "es seguro": exige que el adversario, con acceso al oráculo de firma y a $pk$, **no pueda producir** un par $(m,s)$ válido para un $m$ que nunca firmó. La distinción importa especialmente para los dos esquemas que siguen en la clase: [[rsa-signature-y-hashed-rsa|RSA-Signature y Hashed RSA]] muestra un esquema que cumple la correctud perfectamente y aun así pierde contra `Sig-forge` con probabilidad $1$.

## Ver también

- [[clase-04-criptografia-asimetrica-y-firma-digital#11. Firma digital: la terna y Sig-forge|Clase 04 — Criptografía asimétrica y firma digital § 11. Firma digital: la terna y Sig-forge]]
- [[rsa-signature-y-hashed-rsa|RSA-Signature y Hashed RSA]] — la primera instancia concreta, y por qué la versión sin hash pierde `Sig-forge` con probabilidad 1
- [[digital-signature-standard|Digital Signature Standard]] — el estándar del NIST que instancia esta terna sobre el logaritmo discreto
- [[criptosistema-asimetrico|Criptosistema asimétrico]] — la otra terna de clave pública de esta clase, con su propia prueba de seguridad
- [[message-authentication-code|Message Authentication Code]] — la terna simétrica de la que ésta es la versión de clave pública
- [[seguridad-de-un-mac|Seguridad de un MAC]] — `Mac-Forge`, el experimento del que `Sig-forge` es la variante asimétrica
- [[modelos-de-ataque|Modelos de ataque]] — el vocabulario de oráculo y adversario `PPT` que sostiene la lectura de `Sig-forge`
- [[clase-01-introduccion-y-criptografia-clasica|Clase 01 — Introducción y criptografía clásica]] — el dato de la ley argentina de firma digital
