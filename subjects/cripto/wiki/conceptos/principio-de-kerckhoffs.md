---
title: Principio de Kerckhoffs
resumen: 'Regla de 1883 según la cual un criptosistema debe ser seguro aun si todo salvo la clave es público; delimita qué se asume secreto en cualquier análisis y descarta la seguridad por oscuridad.'
fuentes: ["[[clase-01-introduccion-y-criptografia-clasica]]", "[[practica-01-esquemas-y-taxonomias]]"]
aliases: [Principio de Kerckhoffs, Kerckhoffs, Seguridad por oscuridad]
type: concepto
unidad: 1
clase: 1
orden: 2
created: 2026-08-10
updated: 2026-09-06
tags: [criptografia, principios, kerckhoffs, clase-01, practica-01, transcripcion]
sources: [Clase 01, Práctica 01, "raw/clases/Clase 02pt1-Transcripcion.VTT"]
---

# Principio de Kerckhoffs

> **Un criptosistema debe ser seguro incluso si todo sobre el sistema, excepto la clave, es de público conocimiento.**

Formulado por Auguste Kerckhoffs (1883). Es el principio que delimita **qué se asume secreto** en cualquier análisis de seguridad de la materia.

---

## Qué implica

| Público | Secreto |
|---|---|
| El algoritmo (`Gen`, `Enc`, `Dec`) | La clave $k$ |
| Los espacios $K$, $M$, $C$ | — |
| La implementación, el código fuente | — |
| Los parámetros del esquema | — |

Al probar la seguridad de un sistema **se presupone que la clave está protegida**; todo lo demás se le regala al adversario.

La [[practica-01-esquemas-y-taxonomias|Práctica 01]] lo pone en modo operativo: la filmina del esquema $\Pi(\mathsf{Gen}, \mathsf{Enc}, \mathsf{Dec})_{\text{priv}}$ cierra con el recuadro

> **"La seguridad debe recaer en que la clave se mantenga en secreto."**

Es el mismo principio dicho desde el lado de la práctica: dados los tres algoritmos y los tres espacios como públicos, lo único que queda sosteniendo la seguridad es $k$.

## Por qué

- **El algoritmo se filtra, la clave se cambia.** Un algoritmo se distribuye, se implementa en hardware, se puede desensamblar. Cambiarlo es carísimo; rotar una clave es barato.
- **Un análisis que depende del secreto del algoritmo no es un análisis.** Si la seguridad se apoya en que el atacante no sepa cómo funciona el sistema, no hay nada que demostrar — sólo se está apostando.
- **Habilita el escrutinio público.** Los algoritmos que sobreviven son los que fueron atacados abiertamente durante años.

Lo opuesto se llama **seguridad por oscuridad** (*security through obscurity*) y no cuenta como seguridad.

> [!quote]- De la transcripción de la Clase 02 — el principio, dicho con más énfasis, y un contraejemplo histórico (cues pt1 23-29)
> *"Este es un principio súper básico que tienen que tener y lo tienen que saber, **tienen que grabárselo a fuego**. Lo único que es secreto es la clave. Entonces nunca tienen que asumir que hay otra cosa más que es secreta, como el algoritmo."*
>
> Y el ejemplo que ninguna filmina da: *"durante muchos años Microsoft hacía seguridad informática por ofuscación o por ocultamiento (…) mucha gente creía que eso le daba seguridad"*, y de ahí buena parte de su historial de agujeros.

El mismo argumento, un nivel más abajo —cuando **no hay ningún secreto**, ni el algoritmo— es la diferencia entre [[codificar-ofuscar-y-cifrar|codificar, ofuscar y cifrar]].

El mismo principio reaparece en la Unidad 2 como el quinto de los ocho principios de diseño de Saltzer y Schroeder, [[principios-de-diseno#5. Diseño abierto|Diseño abierto]]: la seguridad no debe depender del secreto del diseño ni de la implementación, y su violación recibe ahí exactamente el mismo nombre, "seguridad por oscuridad". Que sea *textualmente* este principio, extendido de los algoritmos criptográficos a cualquier mecanismo de seguridad, es *(lectura nuestra)*; lo que sí queda registrado de la cátedra es que `video-07` marca ese punto como pregunta de examen en cursadas anteriores, con la formulación *"lo único que tiene que estar oculto es la clave"*. El cruce está listado como material del **segundo parcial** en [[principios-de-diseno#5. Diseño abierto|Principios de diseño § Diseño abierto]].

## Consecuencia directa: el César no es un criptosistema

El cifrado del César clásico fija $k = 3$ y elimina `Gen`. Sin clave aleatoria no hay espacio de claves: el esquema es una función **pública y determinística**, y todo adversario que conozca el algoritmo descifra. El [[cifrado-por-rotacion|cifrado por rotación]] es su versión con clave — y aun así es inseguro, pero por otro motivo ($\lvert K\rvert = 27$, ver [[ataque-de-fuerza-bruta|fuerza bruta]]).
