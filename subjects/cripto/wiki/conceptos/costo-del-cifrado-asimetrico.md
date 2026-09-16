---
title: Costo del cifrado asimétrico
resumen: 'En criptografía asimétrica el nivel de seguridad es relativo al tamaño del conjunto donde vive el problema difícil: hacen falta 2048 bits en RSA o El Gamal frente a unos 320 sobre curvas elípticas, porque lo que cambia entre grupos es el mejor ataque conocido.'
fuentes: ["[[clase-04-criptografia-asimetrica-y-firma-digital]]", "[[rsa]]", "[[el-gamal]]", "[[eleccion-de-primitivas]]", "[[practica-05-de-la-clave-privada-a-la-clave-publica]]"]
aliases: [Costo del cifrado asimétrico, Tamaño de n en criptografía asimétrica, Nivel de seguridad relativo al tamaño del grupo, Criptografía de curva elíptica (motivación)]
type: concepto
unidad: 1
clase: 4
orden: 9
created: 2026-09-04
updated: 2026-09-15
tags: [criptografia, criptografia-asimetrica, tamano-de-claves, curvas-elipticas, rsa, el-gamal, clase-04, transcripcion]
sources: ["Clase 04 - Criptografia - Cifrado asimetrico y firma digital.pdf", "raw/clases/Clase 04 - Transcripcion.VTT"]
---

# Costo del cifrado asimétrico

**Por qué "128 bits de clave" no significa lo mismo en cifrado simétrico que en asimétrico, y qué tamaño de módulo hace falta hoy según el tipo de grupo que se use.**

> **Fuentes de esta nota.** Filmina **32** de la Clase 04 —la más corta del bloque—, dictada el **10/09** por Pablo Abad, con transcripción: [`Clase 04 - Transcripcion.VTT`](../../raw/clases/Clase%2004%20-%20Transcripcion.VTT), cues **1049-1055**, más el argumento que la precede sobre curvas elípticas (cues 1033-1045) y el de la factorización subexponencial (cues 937-947). La nota se escribió el 04/09 sólo contra el PDF y se revisó contra la voz el 14/09.

> **La respuesta operativa a esta nota tiene ahora concepto propio.** La filmina 9 de la [[practica-05-de-la-clave-privada-a-la-clave-publica|Práctica 05]] (14/09) anota una sola desventaja del esquema asimétrico, *"más lento"*, y su filmina 15 da la solución con teorema: el [[cifrado-hibrido|cifrado híbrido]], que paga la parte asimétrica una vez por mensaje y cifra el volumen con clave simétrica. Es la construcción que esta nota mencionaba al pasar en su última sección.

## El punto central: el tamaño es relativo al conjunto, no un número absoluto

En cifrado simétrico, "128 bits de clave" mide directamente el tamaño del espacio de búsqueda de una fuerza bruta: $2^{128}$ claves a probar. En cifrado asimétrico esa lectura directa **no vale**, porque la seguridad no depende de una búsqueda sobre las claves sino de un problema matemático específico —factorización para `RSA`, logaritmo discreto para El Gamal— y el tamaño que hace falta para que ese problema sea difícil depende de **qué tan rápido se sabe atacar cada estructura algebraica particular**. La filmina lo dice así: *"el nivel de seguridad es relativo a los tamaños de los conjuntos involucrados"*, y da el $n$ de referencia para cada esquema de esta clase:

$$n_{\mathrm{RSA}} = p\cdot q \qquad\qquad n_{\text{El Gamal}} = q$$

En [[rsa|RSA]], $n$ es el módulo que hay que factorizar. En [[el-gamal|El Gamal]], $n$ es el tamaño del grupo donde vive el logaritmo discreto — la misma variable que la clase venía llamando $q$ desde [[diffie-hellman|Diffie-Hellman]].

**La voz da la razón que la filmina no escribe**, y está repartida en dos lugares de la clase. Primero, por qué las claves asimétricas son tan largas: no es la fuerza bruta —probar todos los $d$ sería proporcional a $n$, y 128 bits alcanzarían— sino que **existen ataques algebraicos subexponenciales** contra la factorización, más eficientes que exponenciales sin ser polinómicos, con los que ya se factorizaron módulos de 512 bits y más (cues 937-947, desarrollados en [[pkcs1-y-tamano-de-claves#Tamaño de claves|PKCS#1]]). Segundo, por qué las curvas elípticas necesitan menos: son un grupo donde el problema de decisión Diffie-Hellman *"es mucho más complejo"*, y eso *"nos permite relajar el tamaño de las claves"* (cues 1033-1037). **El tamaño no mide el problema; mide el mejor ataque que se le conoce.**

## Los números concretos

| Tipo de campo | Tamaño mínimo de $n$ | Uso |
|---|---|---|
| Campo numérico (`RSA`, El Gamal sobre $\mathbb{Z}_q^{*}$) | $\geq 1024$ bits (piso histórico) | 1536 o 2048 bits, recomendación actual |
| Curvas elípticas | $\geq 320$ bits | nivel de seguridad comparable al de arriba |

La brecha entre **2048** y **320** bits para un nivel de seguridad equivalente no es un detalle de la tabla: es, en esencia, la razón de ser de la criptografía de curva elíptica. Que se conozcan ataques sub-exponenciales contra el logaritmo discreto clásico, mientras que contra el logaritmo discreto sobre curvas elípticas no se conozca nada mejor que el ataque genérico exponencial, es lo que separa las dos filas. [[el-gamal#Cualquier grupo: polinomios y curvas elípticas|El Gamal]] trae el desarrollo de la voz sobre por qué el esquema se puede mover de grupo.

> [!quote]- De la transcripción — la filmina 32 leída en voz (cues 1049-1055)
> *"En cuanto a nivel de seguridad, el nivel de seguridad se mide en función del tamaño en bits de $n$ —en RSA, que sería el producto de los 2 números primos— o de $q$, el tamaño del campo numérico que se usa en El Gamal. Con campos numéricos se espera que el nivel de seguridad teórico sea mayor a 1024 bits; hoy en día ya se está recomendando alejarse de esto y pasar a 1536 o 2048, por avances en poder de cómputo distribuido. Para otros tipos de campos, en El Gamal, que lo acepta, puede variar: por ejemplo, en curvas elípticas hoy día se está recomendando 320 bits. Ahí ya hay que ir caso por caso cuando se implementa en otros grupos algebraicos."*

> **Dónde la voz exagera** *(precisión nuestra)*. Sobre curvas elípticas el docente dice que *"está demostrado que el problema de decisión Diffie-Hellman es mucho más complejo; de hecho, es exponencial"* (cues 1033-1035). No hay tal demostración: hay **ausencia de ataques mejores**. Para curvas bien elegidas, los únicos algoritmos conocidos para el logaritmo discreto son los genéricos —rho de Pollard, del orden de $\sqrt{q}$ operaciones—, y es esa ausencia, no un teorema, lo que sostiene la fila de 320 bits. Si mañana apareciera un *index calculus* para curvas, la tabla cambiaría; para los campos numéricos ese ataque ya existe, y por eso la fila de arriba es la que es.

## Qué significa "1024 bits es piso histórico"

La filmina marca 1024 bits como umbral **histórico**, no como recomendación vigente: es el número que en algún momento se consideró suficiente y que hoy ya no lo es, el mismo patrón que [[eleccion-de-primitivas|Elección de primitivas]] describe para el crecimiento del poder de cómputo del atacante a lo largo de las décadas, aplicado ahora a claves asimétricas en vez de simétricas. La voz atribuye el corrimiento a *"avances en poder de cómputo distribuido"*, y da el dato que lo sostiene: se llegó a factorizar módulos de 512 bits y de más de 700 —el récord real es 829 bits, ver [[pkcs1-y-tamano-de-claves#Tamaño de claves|PKCS#1]]—, demasiado cerca de 1024 para dejar ese umbral en pie. La recomendación **actual** —1536 o 2048 bits— es la que corresponde usar en cualquier ejercicio o implementación nueva; 1024 bits queda como referencia de qué tan rápido corrió el umbral, no como un número vigente.

## El argumento práctico de las claves cortas

*(De la voz, cues 1037-1045; no está en la filmina.)* La ventaja de una clave de 256 o 320 bits sobre una de 2048 o 4096 no es sólo de cómputo: es de **manejo**. Hay usos donde las claves *"requieren esfuerzo extra para almacenarlas de forma segura: a veces hay que sacarlas y tenerlas en papel, a veces hay que tipearlas a mano"*, y ahí la diferencia entre 40 y 600 dígitos decide si el procedimiento es viable. Es el mismo problema de [[distribucion-de-claves-y-kdc|distribución de claves]] con el que abrió la clase —cómo llega una clave a donde tiene que estar—, visto desde el tamaño del objeto que hay que mover. La contraparte, que el docente también dice, es que *"las operaciones son un chino"*: sumar o multiplicar puntos de una curva no es trivial, aunque existe y se implementa.

## Los bits asimétricos y los simétricos no se comparan uno a uno

*(Precisión nuestra, fuera de la filmina.)* Esta relatividad —bits de clave asimétrica no comparables directamente con bits de clave simétrica— es la razón por la que un esquema híbrido (`RSA` o El Gamal para intercambiar una clave, un cifrado simétrico de bloque para el volumen de datos) no puede tratar "128 bits simétricos" y "128 bits de `RSA`" como si fueran equivalentes: el tamaño de $n$ que hace falta para igualar la fuerza de una clave simétrica de 128 bits ronda los 3072 bits en `RSA`, por encima del 2048 que la filmina da como recomendación actual. Este último dato es de la literatura general de criptografía (por ejemplo, NIST SP 800-57), no del PDF de esta clase ni de la voz.
