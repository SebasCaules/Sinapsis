---
title: Estado de un criptosistema
resumen: 'Vocabulario para clasificar un criptosistema como seguro, debilitado o quebrado: seguro significa que lo mejor disponible es la fuerza bruta, y los tres estados no son excluyentes porque cada prueba cubre un escenario distinto.'
fuentes: ["[[clase-02-cifrado]]", "[[seguridad-computacional]]", "[[pruebas-de-indistinguibilidad]]"]
aliases: [Estado de un criptosistema, Criptosistema seguro, Criptosistema debilitado, Criptosistema quebrado, Escenarios de seguridad]
type: concepto
unidad: 1
clase: 2
orden: 11
created: 2026-08-21
updated: 2026-08-28
tags: [criptografia, seguridad, estado, quebrado, debilitado, clase-02, parcial, transcripcion]
sources: ["Clase 02 - Criptografia - Cifrado.pdf", "raw/clases/Clase 02pt2-Transcripcion.VTT"]
---

# Estado de un criptosistema

El vocabulario con el que se lee una noticia del tipo *"rompieron X"*. Tres estados, y la aclaración de que **no son excluyentes**.

---

## Los tres estados

| Estado | Definición de la filmina |
|---|---|
| **Seguro** | Cumple con las expectativas de **su modelo de seguridad** |
| **Debilitado** | Existen adversarios con probabilidades **no despreciables** de éxito, **pero** el esfuerzo es muy alto (ej. décadas) o las condiciones muy difíciles (ej. disponer de $2^{80}$ mensajes) |
| **Quebrado** | Existen adversarios con probabilidades **no despreciables** de éxito **en tiempos practicables** |

Las tres definiciones descansan sobre la [[seguridad-computacional|seguridad computacional]]: *"no despreciable"*, *"tiempos practicables"* y *"su modelo de seguridad"* son términos técnicos, no adjetivos.

### Qué significa seguro, en términos operativos

La definición de la filmina —*cumple con las expectativas de su modelo de seguridad*— es circular y no sirve para contestar en un parcial. **El docente la traduce a un criterio verificable: un criptosistema está seguro cuando lo mejor que puede hacer un atacante es probar todas las claves.** O sea, cuando **no existe nada mejor que la fuerza bruta**. Y da la forma de medir cuánto se apartó de ahí: **cuántos bits se le restaron a la longitud de clave**, o —lo mismo— cuántas claves hay que probar de verdad.

> [!quote]- De la transcripción — la definición operativa, y la regla que sale de ella (cues pt2 476-480, 487-491)
> *"El criptosistema se considera **seguro** [cuando] cumple con las expectativas de su modelo de seguridad. ¿Qué significa esto? Que **lo que un atacante necesita para romper el sistema es usar fuerza bruta y probar todas las claves**. Ésa es la situación de un criptosistema que está seguro (…) Lo podés mirar en relación a **cuántos bits de la longitud de la clave se reducen**, en cuántas claves hay que probar. Entonces se considera seguro cuando **lo mejor que se puede hacer es probar todas las claves posibles**."*
>
> Y la regla práctica, más dura que la filmina: *"tanto si está **debilitado** como **quebrado**, **no se tienen que usar para proyectos nuevos nunca**. Si está debilitado, lo importante es saber con qué condiciones y cuál es el riesgo."*
>
> El objetivo del curso, dicho a propósito de esto: *"mucho de lo que vamos a hacer en esta materia es **que ustedes sean conscientes de los riesgos**, del impacto, y después decidan en base a eso. **No se puede hacer que todo sea súper seguro todo el tiempo: es costo infinito.**"*

**La regla operativa resuelve la ambigüedad de los tres estados.** Que un sistema pueda ser *seguro* y *quebrado* a la vez (sección siguiente) suena a que la clasificación no decide nada. Decide esto: **ni debilitado ni quebrado entran a un proyecto nuevo**. La distinción entre los dos sólo importa para lo que **ya está desplegado** — ahí sí hay que saber bajo qué condiciones falla y cuánto cuesta el ataque, porque migrar también cuesta.

> **La frontera debilitado/quebrado es de ingeniería, no de matemática.** *(lectura nuestra.)* En los dos casos existe un ataque mejor que la fuerza bruta; lo que cambia es si alguien puede **pagarlo**. Un ataque de $2^{80}$ operaciones o que exige $2^{80}$ mensajes cifrados con la misma clave está fuera del alcance de cualquiera hoy, pero es un ataque real —y la frontera se mueve sola con el tiempo, porque el hardware mejora y los ataques se refinan. **Un sistema debilitado es un sistema con fecha de vencimiento.**
>
> **La clase llega a lo mismo desde el precio, y con DES de ejemplo trabajado.** El docente lo pone en la frontera y después lo empuja al lado de *quebrado* por razones que no son matemáticas: *"para poder romperlo en un día hace falta 1,2 millones. ¿Qué significa? Si ustedes lo hacen en su compu, **no van a poder romperlo**. Es justo esa situación de un algoritmo que está debilitado (…) **está como entre el medio de los dos. Pero como es la cuestión pragmática, entonces en realidad está quebrado** (…) ¿Por qué está quebrado? Porque es posible hacerlo. **Es un tema de guita**"* (cues pt2 482-486). Eso explica la decisión menos obvia de la tabla de abajo: por qué DES figura como quebrado y no como debilitado. El número sale de su propio paper — ver [[des-y-3des#Evolución: cómo se erosionó|DES y 3-DES]].

## Un criptosistema puede ser seguro y estar quebrado al mismo tiempo

> Hay **múltiples pruebas de seguridad**. **Cada una prueba un escenario diferente.**

Es la conclusión más útil de toda la clase y la que evita la mitad de los malentendidos:

- Un [[criptosistema-de-flujo|cifrado de flujo]] sin IV **pasa `Eav`** y **falla `Mul`**. Es seguro contra un observador de un solo mensaje y está quebrado contra uno que ve dos.
- Una [[primitiva-de-cifrado-en-bloque|primitiva de bloque]] es una excelente función pseudoaleatoria **y** un pésimo criptosistema.
- [[modos-de-encadenamiento|ECB]] usa AES, que está intacto, y aun así **no es CPA-Secure**.

> **Consecuencia práctica:** *"¿es seguro?"* es una pregunta mal formada. La forma correcta es **"¿es seguro contra qué prueba, con qué nivel $n$, bajo qué condiciones de uso?"**. Casi todos los desastres criptográficos reales no son primitivas rotas sino **primitivas sanas usadas fuera de su modelo**: un IV repetido, un nonce reutilizado, un modo mal elegido.

## Ejemplos del propio curso

| Sistema | Estado | Por qué |
|---|---|---|
| [[des-y-3des\|DES]] | quebrado | $2^{56}$ **claves** es un espacio recorrible hoy con hardware dedicado: así cayó, en 1998. El criptoanálisis lineal es más barato *en cómputo* pero su $2^{43}$ cuenta **textos planos conocidos**, no claves, y ese volumen bajo una misma clave nunca se consiguió → [[des-y-3des#Evolución: cómo se erosionó\|Evolución]] |
| [[des-y-3des\|3-DES]] | debilitado — **quebrado según el docente** | $\approx 2^{112}$ por *meet-in-the-middle*, y bloque de 64 bits. La filmina lo sigue listando con sus dos modos; en voz lo declara roto y fuera de los proyectos nuevos (cues pt2 382, 504) |
| RC4, CSS, A5/1, A5/2, E0 | quebrados | **tachados** en la filmina de [[eleccion-de-primitivas\|recomendados]] |
| [[aes\|AES]] | seguro | recomendado para proyectos nuevos |
| [[modos-de-encadenamiento\|ECB]] | quebrado *como modo* | no es CPA-Secure, **aunque la primitiva esté sana** |

## Ver también

- [[seguridad-computacional|Seguridad computacional]] — de dónde salen "despreciable" y "practicable"
- [[pruebas-de-indistinguibilidad|Pruebas de indistinguibilidad]] — los escenarios concretos
- [[eleccion-de-primitivas|Elección de primitivas en un proyecto]] — qué hacer con esta clasificación
- [[modelos-de-ataque|Modelos de ataque]] — la misma idea desde la taxonomía de la [[practica-01-esquemas-y-taxonomias|Práctica 01]]
- [[clase-02-cifrado|Clase 02 — Cifrado simétrico]]
