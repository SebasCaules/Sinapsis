---
title: Costo del cifrado asimétrico
resumen: 'En criptografía asimétrica el nivel de seguridad es relativo al tamaño del conjunto donde vive el problema difícil: hacen falta 2048 bits en RSA o El Gamal frente a unos 320 sobre curvas elípticas.'
fuentes: ["[[clase-04-criptografia-asimetrica-y-firma-digital]]", "[[rsa]]", "[[el-gamal]]", "[[eleccion-de-primitivas]]"]
aliases: [Costo del cifrado asimétrico, Tamaño de n en criptografía asimétrica, Nivel de seguridad relativo al tamaño del grupo, Criptografía de curva elíptica (motivación)]
type: concepto
unidad: 1
clase: 4
orden: 9
created: 2026-09-04
updated: 2026-09-04
tags: [criptografia, criptografia-asimetrica, tamano-de-claves, curvas-elipticas, rsa, el-gamal, clase-04, sin-dictar]
sources: ["Clase 04 - Criptografia - Cifrado asimetrico y firma digital.pdf"]
---

# Costo del cifrado asimétrico

**Por qué "128 bits de clave" no significa lo mismo en cifrado simétrico que en asimétrico, y qué tamaño de módulo hace falta hoy según el tipo de grupo que se use.**

> Filmina **32** del PDF de teoría de la Clase 04 — la más corta de las seis que cubre esta tanda de notas. La clase todavía no se dictó (hoy es 04/09/2026): nota escrita contra el PDF de filminas, Katz & Lindell y lecturas propias rotuladas.

## El punto central: el tamaño es relativo al conjunto, no un número absoluto

En cifrado simétrico, "128 bits de clave" mide directamente el tamaño del espacio de búsqueda de una fuerza bruta: $2^{128}$ claves a probar. En cifrado asimétrico esa lectura directa **no vale**, porque la seguridad no depende de una búsqueda sobre las claves sino de un problema matemático específico —factorización para `RSA`, logaritmo discreto para El Gamal— y el tamaño que hace falta para que ese problema sea difícil depende de **qué tan rápido se sabe atacar cada estructura algebraica particular**. La filmina lo dice así: *"el nivel de seguridad es relativo a los tamaños de los conjuntos involucrados"*, y da el $n$ de referencia para cada esquema de esta clase:

$$n_{\mathrm{RSA}} = p\cdot q \qquad\qquad n_{\text{El Gamal}} = q$$

En [[rsa|RSA]], $n$ es el módulo que hay que factorizar. En [[el-gamal|El Gamal]], $n$ es el tamaño del grupo donde vive el logaritmo discreto — la misma variable que la clase venía llamando $q$ desde [[diffie-hellman|Diffie-Hellman]].

## Los números concretos

| Tipo de campo | Tamaño mínimo de $n$ | Uso |
|---|---|---|
| Campo numérico (`RSA`, El Gamal sobre $\mathbb{Z}_q^{*}$) | $\geq 1024$ bits (piso histórico) | 1536 o 2048 bits, recomendación actual |
| Curvas elípticas | $\geq 320$ bits | nivel de seguridad comparable al de arriba |

La brecha entre **2048** y **320** bits para un nivel de seguridad equivalente no es un detalle de la tabla: es, en esencia, la razón de ser de la criptografía de curva elíptica. Que se conozcan ataques sub-exponenciales contra el logaritmo discreto clásico, mientras que contra el logaritmo discreto sobre curvas elípticas no se conozca nada mejor que el ataque genérico exponencial, es lo que separa las dos filas — la filmina no lo desarrolla, lo deja como un hecho de la tabla. [[el-gamal|El Gamal § Diferencias con RSA]] ya adelanta que sobre curvas *"el problema de decisión DH es más complejo"*.

## Qué significa "1024 bits es piso histórico"

La filmina marca 1024 bits como umbral **histórico**, no como recomendación vigente: es el número que en algún momento se consideró suficiente y que hoy ya no lo es, el mismo patrón que [[eleccion-de-primitivas|Elección de primitivas]] describe para el crecimiento del poder de cómputo del atacante a lo largo de las décadas, aplicado ahora a claves asimétricas en vez de simétricas. La recomendación **actual** —1536 o 2048 bits— es la que corresponde usar en cualquier ejercicio o implementación nueva; 1024 bits queda como referencia de qué tan rápido corrió el umbral, no como un número vigente.

## Los bits asimétricos y los simétricos no se comparan uno a uno

*(Precisión nuestra, fuera de la filmina.)* Esta relatividad —bits de clave asimétrica no comparables directamente con bits de clave simétrica— es la razón por la que un esquema híbrido (`RSA` o El Gamal para intercambiar una clave, un cifrado simétrico de bloque para el volumen de datos) no puede tratar "128 bits simétricos" y "128 bits de `RSA`" como si fueran equivalentes: el tamaño de $n$ que hace falta para igualar la fuerza de una clave simétrica de 128 bits ronda los 3072 bits en `RSA`, por encima del 2048 que la filmina da como recomendación actual. Este último dato es de la literatura general de criptografía (por ejemplo, NIST SP 800-57), no del PDF de esta clase.

## Ver también

- [[clase-04-criptografia-asimetrica-y-firma-digital#10. Costo del cifrado asimétrico|Clase 04 — Criptografía asimétrica y firma digital § 10. Costo del cifrado asimétrico]]
- [[rsa|RSA]] · [[el-gamal|El Gamal]] — los dos esquemas cuyo $n$ mide esta nota
- [[pkcs1-y-tamano-de-claves|PKCS#1 y tamaño de claves]] — el módulo `RSA-2048` exhibido como ilustración de escala
- [[diffie-hellman|Diffie-Hellman]] — de dónde sale el $q$ que El Gamal reutiliza como tamaño del grupo
- [[eleccion-de-primitivas|Elección de primitivas]] — el mismo criterio de "el umbral corre con el tiempo", aplicado a cifrado simétrico
- [[cuerpos-finitos-y-campos-de-galois|Cuerpos finitos y campos de Galois]] — la estructura algebraica sobre la que se mide este tamaño
