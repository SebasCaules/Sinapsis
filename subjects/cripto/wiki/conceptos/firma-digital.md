---
title: Firma digital
resumen: 'Versión de clave pública de un MAC: se firma con la clave privada y se verifica con la pública, lo que aporta verificación pública, transferibilidad y no repudio — la propiedad que le da nombre y peso legal. Su seguridad se mide con el experimento Sig-forge.'
fuentes: ["[[clase-04-criptografia-asimetrica-y-firma-digital]]", "[[message-authentication-code]]", "[[seguridad-de-un-mac]]", "[[rsa-signature-y-hashed-rsa]]", "[[practica-05-de-la-clave-privada-a-la-clave-publica]]"]
aliases: [Firma digital, Digital signature, Sig-forge, Terna Gen Sign Vrfy, No repudio (firma digital), Firma electrónica, Ley 25.506]
type: concepto
unidad: 1
clase: 4
orden: 10
created: 2026-09-04
updated: 2026-09-15
tags: [criptografia, firma-digital, no-repudio, sig-forge, clave-publica, clase-04, transcripcion]
sources: ["Clase 04 - Criptografia - Cifrado asimetrico y firma digital.pdf", "raw/clases/Clase 04 - Transcripcion.VTT"]
---

# Firma digital

**La versión de clave pública de un MAC: la terna $(\mathsf{Gen}, \mathsf{Sign}, \mathsf{Vrfy})$ y el experimento `Sig-forge` con el que se mide si es falsificable.**

> **Fuentes de esta nota.** Filminas **33-35** de la Clase 04, dictada el **10/09** por Pablo Abad, con transcripción: [`Clase 04 - Transcripcion.VTT`](../../raw/clases/Clase%2004%20-%20Transcripcion.VTT), cues **1058-1132**, la última media hora de la clase, después de la segunda pausa. La nota se escribió el 04/09 sólo contra el PDF y se revisó contra la voz el 14/09. Lo que la voz agregó: por qué se llama *firma* y no *MAC asimétrico*, el argumento del no repudio hecho desde la clave compartida, y el marco **legal** —firma registrada, presunción de validez, la ley argentina y la diferencia con la firma electrónica—, que es lo que la [[guia-04-manejo-de-claves-cifrado-asimetrico-y-firma-digital#Ejercicio 14|Guía 4]] pide investigar en su Ej. 14.

> **La [[practica-05-de-la-clave-privada-a-la-clave-publica|Práctica 05]] (14/09) pone las dos ternas lado a lado y las compara en una tabla** (filmina 16): fácil distribución de clave, una sola firma verificable por cualquier receptor, verificación pública y no repudio del lado de la firma; una clave y una etiqueta **por cada receptor**, sin verificación pública ni no repudio, pero **más eficiente**, del lado del MAC. Es el argumento de esta nota más el costo que la voz dijo y la filmina 33 no escribe. Ver [[practica-05-de-la-clave-privada-a-la-clave-publica#11. Firma digital contra MAC, en una tabla|Práctica 05 §11]].

## El mismo objetivo que un MAC, con otra clave

Una firma digital persigue integridad, igual que un [[message-authentication-code|MAC]]. La diferencia decisiva es **qué clave usa cada operación**: firmar usa una clave **privada** ($sk$) y verificar usa la clave **pública** correspondiente ($pk$), mientras que en un MAC las dos partes comparten la misma clave simétrica. De esa asimetría de claves salen, sin ningún mecanismo extra, tres propiedades que un MAC no puede dar:

- **Verificación pública.** Cualquiera con $pk$ puede verificar, sin que quien firmó le confíe ningún secreto.
- **Transferible.** La misma firma sirve para varios destinatarios a la vez, o se reenvía y sigue siendo verificable — un MAC atado a una clave compartida entre dos partes específicas no tiene ese sentido para un tercero.
- **No repudio.** Quien firmó no puede negar haberlo hecho, porque solo esa persona conoce $sk$. Un MAC no puede darlo: **ambas** partes conocen la clave, así que cualquiera de las dos pudo haber generado la etiqueta — no hay forma de decidir cuál.

**La voz llega a la construcción por eliminación**: de las dos funciones de integridad de la Clase 03, el hash no tiene clave —*"no tiene sentido hablar de simetría o asimetría de clave, porque no hay"*— y el MAC sí, así que es el MAC el que se traslada al mundo asimétrico. Y la asignación de claves es **la opuesta a la del criptosistema**: como el fin es la integridad, lo que se quiere controlar es **quién puede generar** etiquetas válidas, así que la clave secreta va en la función de etiquetado —la firma— y la pública en la verificación (cues 1058-1073).

> [!quote]- De la transcripción — el MAC trasladado, con las claves al revés (cues 1060-1073)
> *"El hash criptográfico no tiene claves, así que no tiene sentido hablar de simetría o asimetría de clave, porque no hay. Pero en el MAC sí: si trasladamos la idea del MAC al mundo asimétrico, vamos a tener una construcción parecida, una terna de algoritmos donde la generación va a generar 2 claves; una función de etiquetado —que ahora vamos a ver por qué, pero que se llama firma en este caso— donde se usa una de las claves y se emite una etiqueta; y una función de verificación donde se utilizará la otra clave, y el mensaje y la etiqueta pasan o no pasan la verificación. (…) Como hicimos con los criptosistemas, estas claves pública y secreta no son intercambiables, pero acá tienen un rol casi opuesto a los criptosistemas. Como el fin de los MACs asimétricos es la integridad, nosotros queremos controlar **quién puede generar las etiquetas válidas**. Entonces **la clave secreta se utiliza en la función de etiquetado, la firma, y la de verificación utiliza la clave pública.**"*

### Por qué se llama firma y no MAC asimétrico

Es la pregunta que el docente dice venir *"esquivando desde hace unos minutos"*, y la respuesta es la raíz de las tres propiedades: separar las claves permite un uso que el MAC no tiene, y ese uso la vuelve **el análogo digital de la firma de puño y letra**. Una firma manuscrita es algo que sólo su dueño puede producir pero que cualquiera puede cotejar; una firma digital es exactamente eso — *"un artefacto que sólo yo, el dueño de la clave secreta, pude generar, pero que cualquiera, porque cualquiera tiene la clave pública, puede verificar"*. **Etiquetas universalmente verificables**: eso es lo que un MAC no podía dar y lo que *"le vale el nombre propio de firma digital"* (cues 1074-1085).

## La terna de algoritmos

$$\begin{aligned}
\mathsf{Gen}&:\ (n) \to k = (sk, pk)\\
\mathsf{Sign}&:\ s \leftarrow \mathsf{Sign}_{sk}(m)\\
\mathsf{Vrfy}&:\ b = \mathsf{Vrfy}_{pk}(m,s)\\[4pt]
&\text{Propiedad de correctud: para todo } m,\ \mathsf{Vrfy}_{pk}\bigl(m,\mathsf{Sign}_{sk}(m)\bigr) = 1
\end{aligned}$$

La forma es literalmente la de un [[message-authentication-code|MAC]] —$(\mathsf{Gen},\mathsf{Mac},\mathsf{Vrfy})$ ahí, $(\mathsf{Gen},\mathsf{Sign},\mathsf{Vrfy})$ acá— con $\mathsf{Sign}$ en el rol de $\mathsf{Mac}$ y una clave de cada tipo en vez de una sola compartida. La propiedad de correctud es la misma también: *"todo mensaje que esté etiquetado y verificado con el par de claves equivalentes va a pasar la verificación"* (cue 1066).

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

para todo adversario `PPT` — el mismo umbral de despreciabilidad que gobierna toda la materia desde [[seguridad-computacional|Seguridad computacional]]. La voz lo presenta como *"análogo al del MAC: existe el mismo concepto de falsificación"*, y señala **la única diferencia** respecto de `Mac-Forge`: el adversario, además de poder firmar lo que quiera sin conocer la clave secreta, *"obtiene la clave pública"* (cues 1086-1095).

> [!quote]- De la transcripción — Sig-forge, en las palabras del aula (cues 1086-1095)
> *"La seguridad de una firma digital es análoga a la del MAC: existe el mismo concepto de falsificación. Acá la prueba se llama Signature-forge, sólo por el nombre, y es muy parecida conceptualmente. Se genera un par de claves; el algoritmo adversario obtiene la capacidad de firmar lo que quiera sin saber la clave secreta, pero también obtiene la clave pública —es la diferencia respecto al Mac-Forge—. Obtiene la firma de la cantidad de mensajes que quiera, y lo que se le pide al adversario es que emita un mensaje nuevo —un mensaje para el cual no pidió la firma— y una firma; y el adversario gana la prueba si ese par de mensaje y firma pasan la verificación. Muy parecido a los MACs, porque, de vuelta, es la contraparte asimétrica de los MACs."*

## Qué exige Sig-forge que la propiedad de correctud no exige

La propiedad de correctud de la terna dice que firmar y verificar el **mismo** mensaje siempre da $1$ — eso lo cumple cualquier esquema, incluso uno completamente roto. `Sig-forge` es la condición que separa "funciona" de "es seguro": exige que el adversario, con acceso al oráculo de firma y a $pk$, **no pueda producir** un par $(m,s)$ válido para un $m$ que nunca firmó. La distinción importa especialmente para los dos esquemas que siguen en la clase: [[rsa-signature-y-hashed-rsa|RSA-Signature y Hashed RSA]] muestra un esquema que cumple la correctud perfectamente y aun así pierde contra `Sig-forge` con probabilidad $1$.

## Transferibilidad y no repudio, argumentados desde la clave compartida

**El argumento de la voz para las dos propiedades es el mismo, y vale la pena tenerlo en esa forma para el parcial** (cues 1096-1112). Con un MAC, para verificar hace falta **la clave**, y la clave no se le pasa a un tercero — habría que compartir otra clave con él y calcular otro MAC—; con una firma, la capacidad de verificar **se transfiere** con el documento, porque verificar no requiere ningún secreto. Y de ahí el no repudio: quien puede verificar un MAC **también puede generarlo**, así que si dos personas comparten la clave *"yo no puedo garantizar cuál de las dos generó un MAC"*; con una firma, la clave secreta queda siempre en manos de **una sola** entidad, y entonces, asumiendo que se conservó bien, *"el único que pudo haber generado dicha firma es el dueño de la clave secreta"*. Es exactamente el argumento de [[message-authentication-code#Por qué un MAC no da no repudio|Por qué un MAC no da no repudio]], visto desde el lado que sí lo da.

> [!quote]- De la transcripción — de la clave compartida al no repudio (cues 1099-1112)
> *"Las firmas se vuelven públicamente verificables y, por ende, transferibles. Entonces yo ahora puedo mandarle un documento firmado a alguien, y ese alguien puede pasárselo a un tercero, y el tercero puede verificarlo. Con un MAC eso no se podía hacer: para verificar la integridad yo tenía que tener la clave, y no le iba a pasar la clave a un tercero; probablemente tendría una clave compartida con el tercero y calcularía otro MAC nuevo. Acá se puede transferir esa capacidad de verificar. Eso es muy poderoso, y provee la capacidad, que los MACs no tienen, de una idea que se vuelve jurídica y que es súper importante en las firmas de puño y letra: el **no repudio**. En un MAC, para verificar la etiqueta necesito la clave; entonces aquel que puede verificar un MAC también puede generar un MAC nuevo. Si 2 personas comparten la clave, yo no puedo garantizar cuál de las 2 generó un MAC, porque las 2 tienen la capacidad de generarlo y de verificarlo. Con las firmas digitales, la clave secreta queda en manos de una sola entidad, siempre. Entonces, cuando yo recibo una firma digital, asumiendo que la clave fue bien conservada —que se respetó que la clave secreta sea secreta, que no caiga en manos de un adversario—, yo tengo una garantía extra: **el único que pudo haber generado dicha firma es el dueño de la clave secreta**."*

## El marco legal: firma registrada, presunción de validez y la ley argentina

**Esta sección es enteramente de la voz** (cues 1113-1132) y contesta lo que la [[clase-01-introduccion-y-criptografia-clasica#El recorrido, tramo por tramo|Clase 01]] sólo había mencionado al pasar. El no repudio es la razón por la que se **registra** la firma manuscrita al sacar un documento de identidad o abrir una cuenta bancaria: ante una disputa, un documento firmado **se presume válido**, y quien dice "yo no lo firmé" carga con demostrarlo. Las firmas digitales permiten equiparar esa propiedad — pero como se está en terreno legal, no alcanza con que la criptografía exista: hace falta **una ley** en el ámbito donde se ejecutan. Argentina, dice el docente, fue pionera: tiene una ley de firma digital que, para firmas avaladas por ciertos organismos, les otorga **el mismo peso que una firma de puño y letra** — se puede firmar cualquier contrato, hasta la compraventa de una casa, con validez legal, y eso habilita celebrar contratos a distancia sin juntarse en una escribanía.

**Y la distinción que la ley introduce y que conviene saber**: **firma digital** contra **firma electrónica**. Técnicamente pueden ser la misma solución criptográfica; la diferencia es **procesal**, y está en la carga de la prueba: una firma **digital** —la amparada por la ley y emitida bajo un certificador reconocido— se presume válida hasta que se demuestre lo contrario; una firma **electrónica** se presume **no** válida hasta que se demuestre lo contrario. *"Es, más que nada, en quién cae, ante una demanda o una discrepancia, el demostrar una cosa u otra."*

> [!quote]- De la transcripción — la ley, y firma digital contra firma electrónica (cues 1113-1129)
> *"Ésa es la razón por la cual, cuando sacamos un documento de identidad, se registra la firma; o en un banco, cuando se abre una cuenta, se registra la firma. Ante una disputa legal, si aparece un documento firmado, se asume que la firma es válida; si yo digo 'ese documento yo no lo firmé', yo tengo que demostrar que no se firmó, porque jurídicamente la aparición de la firma presume que es válida, presume no repudio. Las firmas digitales nos permiten equiparar esa propiedad. ¿Qué pasa? Estamos metiéndonos ya en temas legales, con lo cual no alcanza con que existan las firmas digitales: se necesita una ley de aplicación en el país o en el ámbito donde se ejecutan. **Argentina fue país pionero en eso: tenemos una ley de firmas digitales** que, para ciertas firmas digitales avaladas por ciertos organismos, le otorga a la firma digital el mismo peso que una firma de puño y letra. En Argentina se puede firmar cualquier tipo de contrato, la compraventa de una casa se puede firmar digitalmente y tiene validez legal. En oposición, si quieren, a lo que van a escuchar hablar como **firma electrónica**: una firma electrónica puede usar la misma solución, una firma digital criptográfica, pero no amparada por la ley. La única diferencia entre esas 2 cosas es más que nada procesal: cuando ocurre un hecho legal, una firma electrónica se presume que no es válida hasta que se demuestre lo contrario; una firma digital se presume que es válida hasta que se demuestre lo contrario. (…) Y eso permite a veces celebrar un contrato de forma remota: yo puedo firmar un contrato comercial con alguien que tal vez está en otro lugar sin necesidad de juntarnos físicamente en una escribanía."*

> **Los datos que la voz no da** *(precisión nuestra, es lo que pide el Ej. 14 de la Guía 4)*. La ley es la **25.506**, de **2001**, y la distinción firma digital / firma electrónica es la de sus artículos 2 y 5: digital es la que se verifica con un certificado emitido por un **certificador licenciado** dentro de la Infraestructura de Firma Digital de la República Argentina; electrónica, cualquier otro dato electrónico usado como firma, con la carga de la prueba invertida. Cuáles son hoy esos certificadores, quién los licencia y desde cuándo existe la autoridad raíz está resuelto en [[guia-04-manejo-de-claves-cifrado-asimetrico-y-firma-digital#Ejercicio 14|Guía 4, Ej. 14]]. Y sobre la firma manuscrita: la presunción de autenticidad de un documento privado firmado es lo que en derecho argentino obliga a quien lo niega a impugnarlo — el paralelo del docente es exacto.

**Lo que la firma no garantiza por sí sola.** Toda la cadena —transferibilidad, no repudio, validez legal— descansa en dos supuestos que la primitiva no cubre: que la clave secreta **se conservó secreta** (el docente lo dice: *"asumiendo que la clave fue bien conservada"*), y que **la clave pública es de quien dice ser**. Lo primero es gestión de claves; lo segundo es el problema entero de la [[clase-05-protocolos-criptograficos|Clase 05]]: sin un [[certificados-digitales|certificado]] que ate $pk$ a una identidad, una firma verificable no dice quién firmó. Los *"ciertos organismos"* de la ley son exactamente eso — las autoridades certificantes.
