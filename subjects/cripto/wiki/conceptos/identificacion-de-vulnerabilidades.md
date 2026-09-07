---
title: Identificación de vulnerabilidades
resumen: 'Paso 5 del ciclo de modelado de amenazas: revisar las zonas ya delimitadas para señalar el agujero concreto que habilita cada amenaza, al nivel de detalle que permita la información disponible.'
fuentes: ["[[clase-08-principios-de-diseno-y-vulnerabilidades]]", "[[modelado-de-amenazas]]", "[[descomposicion-de-la-aplicacion]]", "[[stride-y-arboles-de-ataque]]"]
aliases: [Identificación de vulnerabilidades, Ejemplo del historial médico, Arquitectura de referencia del historial médico, Modelar amenazas al nivel de detalle que corresponda]
type: concepto
unidad: 2
clase: 8
orden: 7
created: 2026-09-04
updated: 2026-09-06
tags: [seguridad, vulnerabilidades, modelado-de-amenazas, stride, arquitectura, clase-08, sin-dictar]
sources: ["Clase 12 - Analisis de vulnerabilidades.pdf"]
---

# Identificación de vulnerabilidades

**El quinto y último paso del ciclo de modelado de amenazas: no preguntar ya qué podría salir mal (eso lo resuelve `STRIDE`), sino señalar, dentro de las zonas ya delimitadas, el agujero concreto que hace posible cada amenaza.** Es el paso más corto de exponer en la filmina y, a la vez, el que menos se puede resolver en abstracto: la propia cátedra lo cierra admitiendo que el trabajo real es específico de cada sistema.

Cubre las filminas **20 y 21** del deck de Análisis de vulnerabilidades — la filmina 22, de lectura recomendada, se referencia más abajo pero no es objeto propio de esta nota. **Esta clase todavía no se dictó** (hoy es 04/09/2026); lo que sigue está escrito contra el PDF, más lecturas propias rotuladas como tales.

## Dónde encaja en el ciclo

Es el **paso 5** del ciclo de cinco pasos de Microsoft que arma [[modelado-de-amenazas#El ciclo de cinco pasos de Microsoft|Modelado de amenazas]]: identificar objetivos → conceptualizar la aplicación → descomponer la aplicación → identificar amenazas → **identificar vulnerabilidades**. Como los pasos 2 a 5 son iterativos, este paso no cierra el proceso, lo retroalimenta — una vulnerabilidad encontrada puede obligar a revisar de nuevo la descomposición o el modelo de amenazas.

Sus dos insumos son la salida de los dos pasos anteriores, y sin ellos el paso no tiene sobre qué trabajar:

- Las **zonas** que separó [[descomposicion-de-la-aplicacion|Descomposición de la aplicación]] — externas y privilegiadas — y el **flujo de datos** entre ellas.
- Las **amenazas** que produjo aplicar `STRIDE` (ver [[stride-y-arboles-de-ataque|STRIDE y árboles de ataque]]) sobre cada frontera de confianza de esas zonas.

La filmina 20 lo resume en una sola instrucción: **revisar las zonas que se derivan del análisis anterior**, con el objetivo puesto en encontrar las vulnerabilidades concretas que permiten que las amenazas ya identificadas efectivamente ocurran. No hay una técnica nueva que aprender acá — es el mismo trabajo de las filminas 14 a 19 aplicado con una pregunta distinta: ya no *"¿qué podría pasar?"* sino *"¿qué del sistema real permite que pase?"*.

Encaja también en la cadena que arma [[aseguramiento-en-el-ciclo-de-vida|Aseguramiento en el ciclo de vida]]: $\text{Bug} \to \text{Vulnerabilidad} \to \text{Amenaza} \to \text{Efecto no deseado}$. Los pasos 3 y 4 del ciclo de Microsoft producen la lista de amenazas; este paso 5 retrocede un eslabón en esa cadena y busca la vulnerabilidad — el bug explotable — que las sostiene. Es el punto exacto donde el modelado de amenazas, que hasta acá era enteramente conceptual, empieza a señalar código, configuración o procedimientos concretos.

## El único ejemplo desarrollado: el historial médico

La filmina 21 trae el único caso completo de todo el deck, con arquitectura incluida:

> Sistema que registra el historial médico de un paciente. Permite a médicos consultar el historial durante la consulta y agregar nuevas entradas; permite a un paciente acceder a su propio historial.

![Arquitectura de ejemplo: historial médico](../../assets/clase08-arquitectura-historial-medico.png)

La arquitectura conecta un **browser** contra un **firewall**, que da a un **web server** con su propio **filesystem**, y éste contra una **base de datos**. Es deliberadamente esquelética — cinco cajas, sin componentes internos — y esa pobreza es el punto: la filmina no está resolviendo el ejemplo, está mostrando **hasta dónde alcanza a modelarse con la información que se tiene**.

### Cómo se aplicaría el paso, siguiendo el método de las filminas anteriores

*(Desarrollo nuestro, no está resuelto en la filmina — es la aplicación del método de [[descomposicion-de-la-aplicacion|Descomposición de la aplicación]] y [[stride-y-arboles-de-ataque|STRIDE y árboles de ataque]] sobre esta arquitectura puntual.)* La descomposición de esta arquitectura da al menos tres fronteras de confianza: **browser↔firewall** (zona externa, internet contra la red de la clínica), **firewall↔web server** (externo contra el componente que procesa la lógica) y **web server↔filesystem/DB** (el componente de aplicación contra sus datos persistentes, que incluyen historiales de *otros* pacientes — la zona privilegiada del ejemplo). Aplicando `STRIDE` sobre la primera frontera, por ejemplo, la letra **S** (spoofing) pregunta si un paciente puede autenticarse como otro paciente o como un médico; sobre la tercera, la letra **I** (information disclosure) pregunta si un médico autenticado puede leer el historial de un paciente que no está atendiendo. **La identificación de vulnerabilidades** es el paso que, para cada una de esas preguntas afirmativas, señala el mecanismo concreto que la habilita — un control de acceso ausente en el filesystem, una sesión que no valida el rol antes de servir un registro, y así con cada frontera. Es exactamente el trabajo que la filmina reconoce como específico de cada sistema y que no puede resolverse en general.

### La instrucción metodológica que cierra la filmina

*"Modelar amenazas al nivel de detalle que corresponda según la información disponible."* No es una frase de relleno: es la respuesta a una tensión real. No tiene sentido, ni es posible, exigirle el mismo nivel de detalle a un análisis hecho sobre un diagrama de alto nivel —como el de arriba, sin componentes internos— que a uno hecho con el código fuente completo disponible. Pedir de más cuando no hay información sólo produce hipótesis sin sustento; pedir de menos cuando sí la hay deja vulnerabilidades reales sin nombrar.

La misma tensión aparece, con otro nombre, en [[confianza-y-aseguramiento|Confianza y aseguramiento]]: la evidencia formal —la más rigurosa de los tres niveles— sólo se justifica en criticidad extrema porque su costo escala mucho más rápido que el del resto del desarrollo. Acá el argumento es el mismo aplicado al modelado: el nivel de detalle no es una virtud en sí mismo, es un costo que hay que poder pagar con la información —o el tiempo— disponible.

## La lectura recomendada de la filmina 22, y el desfasaje de numeración de Bishop

La filmina 22 cierra el deck con una lectura recomendada. Renderizada a 150 dpi, dice literalmente:

> Capítulo 18
> Capitulo 19
>
> Computer Security Art and Science
> Matt Bishop

*(cita textual — nótese que la propia filmina no tilda "Capitulo" la segunda vez; no es una errata de esta nota)*, además de un enlace a *Threat modeling*, de Microsoft patterns & practices Developer Center, que no forma parte de la bibliografía del vault.

En el mapeo de capítulos de la [[bibliografia#2. Matt Bishop — Computer Security: Art and Science|bibliografía]] del vault, el capítulo 18 de esa edición es *Confinement Problem* y el 19 es *Introduction to Assurance* — ninguno de los dos cierra temáticamente este bloque de aseguramiento del modo que sugiere el deck. Es el mismo desfasaje de numeración (de +1 capítulo) que declara [[validez-de-las-pruebas-de-penetracion#Lectura recomendada, y el mismo desfasaje de numeración que ya aparece en el bloque de vulnerabilidades|Validez de las pruebas de penetración]] sobre la filmina 32 del deck de Pentesting, que dice "capítulo 23" cuando la bibliografía del vault mapea ese tema al 24. *(Inferencia nuestra, con la misma incertidumbre que declara esa nota: si el patrón se sostiene, la filmina 22 estaría remitiendo a los capítulos* **19** *(Introduction to Assurance) y* **20** *(Building Systems with Assurance) de la edición del vault, no a los que trae escritos — probablemente ambas filminas siguen la numeración de una edición anterior del libro, pero eso no está confirmado contra ningún original de esa edición.)*

## Video-08 no llega a esta filmina

**Vale dejarlo anotado porque cambia qué fuente hay para este tramo.** Según el recorrido de [[video-08-vulnerabilidades#Recorrido|video-08]], la proyección del deck de Análisis de vulnerabilidades corta a los 37:55 en la filmina de `STRIDE` —página 18 de 23 en el visor del docente— y de ahí en adelante el video cambia a un Keynote personal distinto (*Developer's Hardening*), que no vuelve a las filminas 19 a 23. **Las filminas 20 y 21 —identificación de vulnerabilidades y el ejemplo del historial médico— no tienen ninguna fuente hablada en el corpus de video de la cátedra.** Todo lo que agrega esta nota por fuera de la filmina está, por eso, marcado como desarrollo propio y no como lectura de un video.
