---
title: Lenguajes de descripción de políticas
resumen: 'Los lenguajes con los que se escribe una política antes de formalizarla: de alto nivel, declarativos, cerrados (denegar por defecto) o abiertos (permitir por defecto), y de bajo nivel, imperativos. Una política no es un mecanismo.'
fuentes: ["[[clase-06-politicas-de-seguridad-y-control-de-acceso]]", "[[paradigmas-de-control-de-acceso]]", "[[modelos-de-politica]]"]
aliases: [Lenguajes de alto nivel, Lenguajes de bajo nivel, Política cerrada, Política abierta, Deny by default, Allow by default]
type: concepto
unidad: 2
clase: 6
orden: 4
created: 2026-09-04
updated: 2026-09-04
tags: [politicas-de-seguridad, lenguajes-de-politica, deny-by-default, xhost, tripwire, clase-06, sin-dictar]
sources: ["Clase 06 - Politicas.pdf"]
---

# Lenguajes de descripción de políticas

**Cómo se escribe una política antes de convertirla en un modelo formal, y la advertencia con la que la clase cierra el tema: una política dice qué debe pasar, un mecanismo es cómo se lo hace cumplir — y confundir las dos cosas es el error más fácil de cometer en esta sección.**

Cubre las filminas **10-13** del deck de Políticas (`Clase 06 - Politicas.pdf`). La clase todavía no se dictó —hoy es **04/09/2026**, la clase es el **01/10/2026**— así que esta nota está escrita contra el PDF, sin transcripción.

## Alto nivel: preciso, declarativo, y con dos estilos de default

Un lenguaje de **alto nivel** es preciso, no ambiguo, con formulación matemática o programática, y de estilo **declarativo** — describe qué está permitido, no los pasos para verificarlo. Se divide en dos estilos que difieren en **qué asumen sobre lo que no está explícitamente escrito**:

### Cerrados — deny by default

Listan qué se **permite**; todo lo no mencionado **no** se permite. Es la política más restrictiva por default. Ejemplo de la filmina, con la notación clásica de conjuntos de sujetos $S$, objetos $O$ y acciones $R$:

$$S = \{\mathsf{admin}, \mathsf{user}, \mathsf{developer}\}, \quad O = \{\mathsf{sys}, \mathsf{bin}, \mathsf{build}\}, \quad R = \{\mathsf{read}, \mathsf{write}, \mathsf{execute}\}$$

$$A = \{(\mathsf{admin},\mathsf{sys},\mathsf{execute}),\ (\mathsf{user},\mathsf{bin},\mathsf{execute}),\ (\mathsf{developer},\mathsf{bin},\mathsf{execute}),\ (\mathsf{developer},\mathsf{bin},\mathsf{write}),\ (\mathsf{developer},\mathsf{build},\mathsf{read})\}$$

El conjunto $A$ es la política completa: si una terna $(s, o, r)$ no está en $A$, esa acción está prohibida. Por ejemplo, $\mathsf{admin}$ no tiene ninguna entrada sobre $\mathsf{build}$, así que $\mathsf{admin}$ no puede ni leer, ni escribir, ni ejecutar nada en $\mathsf{build}$ — aunque sea el rol de mayor privilegio nominal del sistema, el lenguaje cerrado no le concede nada que no esté explícitamente listado.

### Abiertos — allow by default

Listan qué **no** se permite; lo no mencionado **sí** está permitido. Ejemplo de la filmina, política de un navegador con reglas de la forma $\mathtt{deny\ (op\ X)\ when\ b}$:

$$\begin{aligned}
&\texttt{deny (read File) when file.name == "/etc/passwd"}\\
&\texttt{deny (open Socket) when net.connections > 100}\\
&\texttt{deny (fetch Image) when image.domain in untrustedDoms}
\end{aligned}$$

Cualquier operación que no calce con ninguna de las condiciones de `deny` está permitida por omisión — leer cualquier archivo que no sea `/etc/passwd`, abrir cualquier socket mientras haya menos de 100 conexiones, buscar cualquier imagen de un dominio que no esté en la lista negra.

### La pregunta que la filmina deja abierta

*¿Qué es mejor, un lenguaje abierto o cerrado?* La filmina no da una respuesta única — es la misma tensión que reaparece en el resto de la clase bajo distintos nombres:

- En **[[paradigmas-de-control-de-acceso|Paradigmas de control de acceso]]**, es la lógica implícita de MAC (reglas prefijadas, restrictivas) contra DAC (reglas puntuales, potencialmente permisivas).
- En **[[listas-de-control-de-acceso|Listas de control de acceso]]**, es literalmente el mismo "denegar por defecto" —si un sujeto no tiene entrada en el ACL, no tiene ningún derecho—, adoptado como convención estándar.
- En **[[composicion-de-politicas|Composición de políticas]]**, la misma disyuntiva reaparece al decidir qué hacer con los casos que ninguna de dos políticas compuestas menciona: permitirlos (modelo de Gong & Quian) o prohibirlos (denegación por defecto).

*(Lectura nuestra.)* El patrón general: **cerrado es más seguro por default pero más costoso de administrar** —cada acceso nuevo requiere una entrada explícita—, mientras que **abierto es más cómodo de mantener pero exige anticipar de antemano todo lo que hay que prohibir**, lo cual es notoriamente más difícil que anticipar todo lo que hay que permitir (la lista de cosas peligrosas crece sin límite claro; la lista de accesos legítimos de un sistema, en principio, es finita y conocida).

## Bajo nivel: imperativo, no declarativo

Un lenguaje de **bajo nivel** es un conjunto de argumentos para comandos que **definen o verifican** restricciones — naturaleza **imperativa**: describe una secuencia de acciones a ejecutar, no una condición a satisfacer. Ejemplos de la filmina 13:

```
;; permitir acceso a host1 y no a host2
xhost +host1 -host2
```

```
Tripwire:
;; grabar todos los atributos excepto inodo y tiempo de acceso
/sbin +gmnpsu012345678-ai
```

`xhost` es un comando real de X Window System que controla qué hosts pueden conectarse a un servidor X; la línea del ejemplo agrega `host1` a la lista de permitidos y quita `host2`. `Tripwire` es una herramienta de detección de integridad de archivos que registra el estado (atributos) de un sistema de archivos para detectar modificaciones posteriores; la sintaxis de la filmina especifica qué atributos monitorear, excluyendo el número de inodo y el tiempo de acceso —dos atributos que cambian con normalidad sin que eso implique una alteración maliciosa del archivo—.

## La advertencia que cierra la sección

*"No confundir políticas con mecanismos"* — es la conclusión con la que termina la filmina 13, y ordena toda la sección: una **política** dice *qué* debe cumplirse (deny by default, allow by default, o cualquier condición formal); `xhost` y `Tripwire` son *cómo* se lo hace cumplir sobre un sistema concreto. Los dos ejemplos de lenguaje de bajo nivel son mecanismos, no políticas: implementan una decisión que ya fue tomada en otro lado, en un lenguaje de alto nivel o directamente en la cabeza de un administrador.
