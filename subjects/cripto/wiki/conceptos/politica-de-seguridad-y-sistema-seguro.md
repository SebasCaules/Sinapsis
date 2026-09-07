---
title: Política de seguridad y sistema seguro
resumen: 'Una política de seguridad parte los estados de un sistema en autorizados y no autorizados. Un sistema es seguro si comienza en un estado autorizado y nunca entra en uno no autorizado, transición que constituye una violación de seguridad.'
fuentes: ["[[clase-06-politicas-de-seguridad-y-control-de-acceso]]"]
aliases: [Política de seguridad, Sistema seguro, Violación de seguridad, Estado autorizado, Partición del espacio de estados]
type: concepto
unidad: 2
clase: 6
orden: 1
created: 2026-09-04
updated: 2026-09-04
tags: [politicas-de-seguridad, seguridad-de-la-informacion, modelos-de-seguridad, clase-06, sin-dictar]
sources: ["Clase 06 - Politicas.pdf"]
---

# Política de seguridad y sistema seguro

**Las dos definiciones con las que arranca todo el bloque de Políticas, y la distinción entre ellas de la que sale, tres secciones después, el propio criterio con el que se demuestra que un modelo de seguridad funciona.** Una política traza una línea; un sistema seguro es la garantía de que nunca se la cruza.

Cubre las filminas **2-3** del deck de Políticas (`Clase 06 - Politicas.pdf`). La clase todavía no se dictó —hoy es **04/09/2026**, la clase es el **01/10/2026**— así que esta nota está escrita contra el PDF, sin transcripción: nada de lo que sigue tiene callout *De la transcripción*, y todo lo que no está literalmente en la filmina va rotulado como lectura o inferencia propia.

## Las dos definiciones

$$\textbf{Política de seguridad: } \text{enunciado que parte los estados de un sistema en \emph{autorizados} (seguros) y \emph{no autorizados}}$$

$$\textbf{Sistema seguro: } \text{sistema que \emph{comienza} en un estado autorizado y \emph{nunca} puede entrar en un estado no autorizado}$$

$$\textbf{Violación de seguridad: } \text{transición del sistema hacia un estado no autorizado}$$

La política es una **partición estática** del espacio de estados: dado un estado cualquiera, dice de qué lado de la línea cae, y no dice nada más. No prescribe mecanismos, no dice cómo se hace cumplir, no habla de transiciones. Un sistema seguro, en cambio, es una **propiedad dinámica**: una afirmación sobre *todas* las trayectorias posibles del sistema —arranca autorizado, y ninguna transición lo saca de ahí—. Puede existir una política sin que exista (todavía) ningún sistema que la implemente de forma segura; y un mismo sistema puede ser seguro respecto de una política y no serlo respecto de otra más estricta.

## Por qué la distinción hace todo el trabajo del resto de la clase

*(Lectura nuestra, siguiendo la estructura del propio deck.)* Ninguna de las dos definiciones dice **cómo** particionar los estados ni **cómo** garantizar que las transiciones respeten la partición. Todo lo que viene después en la clase es una respuesta concreta a esas dos preguntas:

- **[[confidencialidad-integridad-y-disponibilidad|Confidencialidad, integridad y disponibilidad]]** da tres formas distintas de trazar la partición —tres condiciones que un estado puede cumplir o no—, sin todavía decir con qué mecanismo se sostienen.
- **[[bell-lapadula|Bell-LaPadula]]**, **[[modelos-de-integridad-de-biba|Biba]]** y la **[[muralla-china|muralla china]]** son tres particiones concretas —expresadas como reglas sobre etiquetas, niveles o clases de conflicto de interés— acompañadas cada una de una regla de transición (qué lecturas y escrituras están permitidas).
- El **[[bell-lapadula#Bell-LaPadula|Teorema básico de la seguridad]]** de Bell-LaPadula es, literalmente, la demostración de que un sistema es seguro para esa partición: *si el sistema arranca en un estado seguro y cada transición satisface la condición simple y la condición de cierre, entonces todos los estados son seguros*. Es la definición de "sistema seguro" de esta nota, instanciada con una partición y una regla de transición concretas, y con la prueba hecha.

Esa es la lógica del bloque entero: **política = partición**, **modelo = partición concreta + reglas de transición**, **teorema de seguridad = prueba de que las reglas nunca cruzan la partición**. Sin esta nota como punto de partida, Bell-LaPadula parece un conjunto de fórmulas sueltas; con ella, es la respuesta a una pregunta que ya estaba planteada en la filmina 2.

## Qué NO dice la definición de violación de seguridad

*(Lectura nuestra.)* La definición no exige intención ni un adversario activo: "el sistema entra en un estado no autorizado" ocurre igual si lo provoca un atacante, un error de configuración o un bug. Esto la separa de las definiciones de seguridad de la Unidad 1 —por ejemplo la de un MAC, formulada como un juego contra un adversario `PPT` en [[seguridad-de-un-mac|Seguridad de un MAC]]—, que sí están escritas en términos de un adversario que intenta ganar una prueba. Acá el marco es más general: cualquier transición hacia un estado prohibido cuenta, venga de donde venga. Esto es consistente con que las políticas de este bloque (Bell-LaPadula, Biba) modelen jerarquías organizacionales y no primero un adversario formal — el "atacante" implícito es cualquier combinación de sujetos del propio sistema actuando dentro de las reglas que tiene permitidas, no alguien que rompe criptografía.
