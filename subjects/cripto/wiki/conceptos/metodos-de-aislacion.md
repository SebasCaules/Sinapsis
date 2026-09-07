---
title: Métodos de aislación
resumen: 'Las dos respuestas prácticas al problema del confinamiento: máquinas virtuales, que presentan un ambiente simulado sin modificar el sistema, y sandboxes, que sí lo modifican para limitar las acciones de un proceso según una política.'
fuentes: ["[[clase-09-flujo-de-informacion]]", "[[video-11-flujo-de-informacion]]", "[[problema-del-confinamiento]]"]
aliases: [Métodos de aislación, Máquinas virtuales y sandboxes, Aislación de procesos, Hypervisor, Chroot, Sandbox de procesos]
type: concepto
unidad: 2
clase: 9
orden: 9
created: 2026-09-04
updated: 2026-09-06
tags: [seguridad, flujo-de-informacion, aislacion, maquinas-virtuales, sandbox, confinamiento, bloque-2, clase-09, sin-dictar]
sources: ["Clase 10 - Aplicaciones - Flujo de informacion.pdf"]
---

# Métodos de aislación

**Las dos respuestas prácticas de la cátedra a un problema —el [[problema-del-confinamiento|confinamiento]]— que en su forma total no tiene solución: máquinas virtuales y sandboxes, que no eliminan los canales ocultos pero reducen drásticamente la superficie que un proceso puede tocar.** El criterio que las separa no es cuál es "mejor", sino cuál de las dos exige tocar el sistema para funcionar.

Cubre las filminas **24 a 27** del deck `Clase 10 - Aplicaciones - Flujo de informacion.pdf` —las tres de aislación más la de cierre del deck—. La clase todavía no se dictó —hoy es 04/09/2026—, así que esta nota está escrita sólo contra el PDF; lo que no sale literal de la filmina va marcado como *(lectura nuestra)*.

## Dos caminos para el mismo problema

**Filmina 24.** La bifurcación es sobre **quién** cambia para lograr la aislación: el ambiente que rodea al proceso, o el proceso mismo.

| | Máquina virtual | Sandbox |
|---|---|---|
| Idea | **Presentar un ambiente** que se comporte como una computadora que sólo corre los procesos aislados | **Correr los procesos en un ambiente** que analiza las acciones y detecta fugas de información |
| ¿Modifica el sistema? | **No** | **Sí** |

Ninguna de las dos cierra el [[problema-del-confinamiento#Aislación total: la solución que no se puede alcanzar|problema del confinamiento]] por completo —los [[canales-ocultos-y-side-channels|canales ocultos]] de CPU, memoria o disco compartido siguen ahí en cualquiera de las dos— pero ambas reducen drásticamente **cuántos** recursos quedan expuestos y **cuán directamente** un proceso los puede tocar.

## Máquinas virtuales

**Filmina 25.** Son programas que **simulan el hardware** de una máquina —real o abstracta— y permiten correr sistemas operativos **sin modificarlos**. El giro conceptual que hace la filmina es tratar el problema de aislación como un problema de control de acceso de otro nivel: **el núcleo de la máquina virtual se convierte en el agente que provee seguridad**, donde

- los **sujetos** pasan a ser las máquinas virtuales, y
- los **objetos** son los recursos físicos que el hipervisor reparte entre ellas.

Es la misma maquinaria conceptual de una matriz de control de acceso —sujetos, objetos, permisos—, sólo que aplicada un nivel más abajo: en vez de mediar el acceso de un usuario a un archivo, media el acceso de un sistema operativo entero a la CPU, la memoria y el disco físicos. *(Lectura nuestra: la filmina no usa el vocabulario "sujeto/objeto" de una matriz de control de acceso de manera explícita más que en esa única línea; la generalización es nuestra.)*

**Ejemplos de la filmina:** `KVM`, `VMware`, `qemu`, `CCS64`, `Mame`, y la *Java virtual machine*.

> **Errata de la filmina:** bajo "El núcleo de la máquina virtual se convierte en el agente que provee seguridad" la filmina 25 escribe *"Los objetos son son los recursos"*, con la palabra *son* duplicada. Es un error tipográfico trivial, verificado sobre la página renderizada a 150 dpi —no un artefacto de `pdftotext`— y no afecta el contenido: la lectura correcta es *"los objetos son los recursos"*. Es la única errata de contenido de todo el deck, y cae exactamente en el rango de filminas de esta nota.

## Sandboxes

**Filmina 26.** Forman un ambiente donde las acciones de un proceso están limitadas de acuerdo con una política. A diferencia de la máquina virtual, **sí** requiere modificar el sistema, y lo hace de dos formas posibles:

| Forma | Qué se modifica | Qué no se toca |
|---|---|---|
| **Se modifica el ambiente** | El kernel o el sistema operativo, para imponer las restricciones | Los programas, que corren sin cambios |
| **Se modifica el programa** | Se agregan llamadas a **puntos de control** dentro del propio código | El sistema operativo subyacente |

**Ejemplos de la filmina:** `chroot`, el *ebuild sandbox* de Gentoo, y —otra vez— la *Java virtual machine*, marcada con un signo de exclamación entre paréntesis porque es la **misma** JVM que apareció como ejemplo en la filmina anterior.

**Por qué la JVM aparece en las dos categorías, y no es un error.** *(Lectura nuestra: la filmina marca la repetición con el "(!)" pero no la explica.)* Son dos mecanismos distintos de la misma plataforma, mirados desde ángulos distintos: la JVM **como máquina virtual** —el bytecode que interpreta o compila, ejecutándose sobre un hardware simulado y abstracto— es el ejemplo de la filmina 25; la JVM **como sandbox**, vía su `SecurityManager`, es un mecanismo que corre *dentro* de esa máquina virtual y que intercepta llamadas puntuales —abrir un archivo, abrir un socket— para aplicar una política de permisos independiente del sistema operativo real. La primera aislación es de **plataforma completa**; la segunda es de **llamadas específicas**, agregada encima. Nada impide que un sandbox viva adentro de una máquina virtual —de hecho es exactamente lo que pasa acá—.

### La trampa de chroot

*(Lectura nuestra: no está en la filmina, pero es la trampa clásica del ejemplo de sandbox que sí trae.)* `chroot` cambia el directorio raíz que un proceso ve, y por eso se lo presenta como sandbox de "se modifica el ambiente" —el kernel intercepta las rutas del proceso y las reescribe respecto de una nueva raíz—. Pero **no es una frontera de seguridad completa**: un proceso que corre dentro de un `chroot` con privilegios de superusuario puede, en general, escapar de él —por ejemplo, creando un nodo de dispositivo que le da acceso directo al disco físico por fuera del árbol de archivos confinado, o abriendo un descriptor de archivo a un directorio *fuera* del `chroot` antes de encerrarse y usándolo después para moverse hacia arriba—. Por eso las herramientas modernas de aislación de procesos —contenedores como los que usan `namespaces` y `cgroups` de Linux— tratan a `chroot` como una pieza más de un mecanismo compuesto, nunca como la aislación completa por sí sola. Es el mismo problema, en miniatura, que el [[problema-del-confinamiento|problema del confinamiento]] plantea en general: un mecanismo que restringe **la mayoría** de los caminos de fuga no restringe, por eso mismo, **todos**.

## La lectura recomendada con la que cierra el deck

**Filmina 27.** El deck termina, como los otros seis de las Clases 4 a 10, con una filmina de *Lectura Recomendada*: capítulo **16-1** y capítulo **17** de *Computer Security: Art and Science*, de Matt Bishop.

*(Precisión nuestra.)* La [[bibliografia#El desfasaje de numeración de Bishop: qué edición, si es sistemático, y la lectura correcta|tabla de bibliografía del vault]], armada capítulo por capítulo contra el propio PDF de Bishop, mapea el **capítulo 17** (*Information Flow*) y el **capítulo 18** (*Confinement Problem*) a esta misma clase y a la Guía 8 — que es exactamente el contenido de este deck, mientras que el capítulo 16 de esa edición (*Access Control Mechanisms*) pertenece a la clase de control de acceso. Es una instancia más del **desfasaje de +1** que esa bibliografía documenta en cuatro decks distintos: las filminas retienen la numeración de una edición anterior de Bishop, así que la lectura hay que buscarla por **título de capítulo** y no por número.

Queda un cabo suelto que no se puede cerrar con las fuentes disponibles: si *"capítulo 16-1"* nombra una **sección** puntual (§16.1) o el capítulo entero. No hay forma de confirmarlo sin ver la edición que la filmina cita, así que se deja constancia de la lectura tal como aparece escrita y de la referencia cruzada del vault, sin resolver la ambigüedad.
