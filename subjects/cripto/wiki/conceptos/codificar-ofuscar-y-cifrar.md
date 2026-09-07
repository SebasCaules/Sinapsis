---
title: Codificar, ofuscar y cifrar
resumen: 'Las tres cosas que el lenguaje corriente confunde y que sólo separa la presencia de una clave: sin clave, el observador del juego Eav gana con probabilidad 1, así que ni la codificación ni la ofuscación son criptosistemas.'
fuentes: ["[[clase-02-cifrado]]", "[[criptosistema]]", "[[principio-de-kerckhoffs]]", "[[pruebas-de-indistinguibilidad]]"]
aliases: [Codificar ofuscar y cifrar, Codificación, Ofuscación, Base64, Base64 no cifra]
type: concepto
unidad: 1
clase: 2
orden: 18
created: 2026-09-06
updated: 2026-09-06
tags: [criptografia, definiciones, codificacion, ofuscacion, base64, kerckhoffs, clase-02, parcial, transcripcion]
sources: ["raw/clases/Clase 02pt2-Transcripcion.VTT"]
---

# Codificar, ofuscar y cifrar

No está en ninguna filmina: es un paréntesis que el docente abre el 20/08, en medio de [[des-y-3des|DES]], y que marca explícitamente como **pregunta de examen**. Es la definición de [[criptosistema|criptosistema]] leída al revés — lo único que separa las tres cosas es **si hay una clave**.

---

## La tabla

| | Usa clave | Qué le pasa en `Eav` | Ejemplo |
|---|---|---|---|
| **Codificación** | No | $\Pr[\mathsf{Eav} = 1] = 1$: el adversario descodifica y listo | Base64 |
| **Ofuscación** | No | idem: el programa corre igual, o sea que la información está toda ahí | renombrar variables, romper el formato |
| **Cifrado** | **Sí** | es la única de las tres que puede pasar la prueba | [[des-y-3des\|DES]], [[aes\|AES]] |

Es el mismo argumento que el [[principio-de-kerckhoffs|principio de Kerckhoffs]] —seguridad por oscuridad— aplicado un nivel más abajo: allá el secreto era el algoritmo, acá directamente **no hay secreto ninguno**.

## El argumento formal

Sin clave, el observador del juego `Eav` —ver [[pruebas-de-indistinguibilidad#1. Eav_A,Π — indistinguibilidad ante observador|Pruebas de indistinguibilidad]]— gana con probabilidad $1$: elige $m_0 \ne m_1$, recibe $c$, descodifica y responde. La pregunta *"¿cuánta seguridad da?"* ya está contestada **antes de mirar el algoritmo**.

Ofuscar puede seguir sirviendo para encarecerle el trabajo a alguien; lo que no puede es sustituir a un criptosistema.

> [!quote]- De la transcripción — Base64 no cifra, y la pregunta cae en el examen (cues pt2 135-162)
> *"¿Ustedes creen que [Base64] es un protocolo, es un algoritmo de un criptosistema, o no? — **No cifra.** ¿Por qué no cifra? Vos ponés un texto, sale el texto en base 64 (…) **no hace uso de la clave**. Entonces, si no es un algoritmo de cifrado y no es un criptosistema, ¿qué es Base64? ¿Qué tipo de algoritmo es? — **Codificación**. Perfecto. Eso es. **Aparece siempre en examen, porque es una pregunta [caza-bobos]** (…) van a ver cómo se dan cuenta si alguien estudió o no criptografía si cae en este error."*
>
> El error en la vida real: *"es fácil caer en ese error, porque el lenguaje es confuso. Esto se implementó en bancos, que decían: «quedate tranquilo que mi sistema está todo **cifrado en base 64**»."*

> [!quote]- De la transcripción — ofuscación, y por qué tampoco es un mecanismo de seguridad (cues pt2 150-162)
> *"¿Qué significa ofuscar el código? — Que sea difícil de leer. / Se busca que sea difícil hacer ingeniería inversa. — Es que vos encontrás una manera en que el código puede correr igual, pero es más complejo de leer, y tenés rotos los nombres y las variables (…) **Ahí no hay ningún cifrado. No hay clave, nada.** (…) No son mecanismos de seguridad basados en una clave; por lo tanto, **es un error confiar en esos mecanismos solos** (…) piénsenlo desde la perspectiva del experimento de eavesdropping: **pasa directo, entonces no tiene ningún sentido. La probabilidad es 1 para el atacante**, porque simplemente es descodificarlo. Pero sí es cierto que a veces ayudan a complicar las cosas."*

---

## Para el parcial

El docente lo marcó como pregunta que *"aparece siempre en examen"* (cue pt2 143). La respuesta corta: **Base64 no es un criptosistema porque no usa clave, así que es una codificación**; ofuscar código tampoco cifra. El argumento que hay que dar es el de `Eav`, no la descripción del algoritmo.

Aparece además en los [[parciales-viejos|parciales viejos]], donde se pregunta qué ofrece un esquema de cifrado en bloque que un dato codificado en Base64 no ofrece: la respuesta pasa por **confusión, difusión y no linealidad** — ver [[primitiva-de-cifrado-en-bloque#Difusión y confusión: los dos objetivos|Primitiva de cifrado en bloque]].
