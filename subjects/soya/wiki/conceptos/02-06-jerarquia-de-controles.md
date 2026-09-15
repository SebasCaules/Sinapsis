---
titulo: Jerarquía de controles
tipo: concepto
modulo: [1]
clase: [2]
division: "1"
tags: [jerarquia-de-controles, prevencion, proteccion, epp, iso-45001, aspt]
fuentes: [clase-02, aspt-teoria, aspt-formulario]
actualizado: 2026-08-25
estado: en-desarrollo
resumen: 'Eliminar → sustituir → controles de ingeniería → controles administrativos → EPP: la jerarquía clásica de eficacia decreciente (ISO 45001, cláusula 8.1.2), que la Clase 2 reparte en dos columnas según el eje prevención/protección — y que el material del ASPT vuelve a cortar, esta vez en tres niveles. Tres lecturas del mismo repertorio, y hay que saber cuál usa cada fuente.'
---

## En una línea

Eliminar → sustituir → controles de ingeniería → controles administrativos → EPP: la jerarquía
clásica de eficacia decreciente (ISO 45001, cláusula 8.1.2), que la Clase 2 reparte en **dos
columnas** según el eje prevención/protección — y que el material del ASPT vuelve a cortar, esta
vez en **tres niveles**. Tres lecturas del mismo repertorio, y hay que saber cuál usa cada fuente.

## Desarrollo

### Los mismos cinco elementos, leídos de dos formas distintas

**Lectura 1 — la escalera única (ISO 45001:2018, cláusula 8.1.2).** La norma de referencia de la
materia (ver [[iso-45001]]) presenta estas cinco medidas como **una sola jerarquía descendente de
eficacia**:

1. Eliminar el peligro.
2. Sustituir por procesos, operaciones, materiales o equipos menos peligrosos.
3. Utilizar controles de ingeniería y reorganización del trabajo.
4. Utilizar controles administrativos, incluida la formación.
5. Utilizar equipos de protección personal adecuados.

No hay en esta lectura ningún corte entre "primeras cuatro" y "última": es un único orden de
preferencia, de más a menos eficaz.

**Lectura 2 — las dos columnas de la cátedra (Clase 2, slides 12-13).** La clase reagrupa esas
mismas cinco medidas —con las mismas palabras, casi textuales— pero según el eje **qué reducen**,
no según su eficacia relativa:

| Prevenir — reduce la **probabilidad** (slide 12) | Proteger — reduce la **gravedad** (slide 13) |
|---|---|
| Eliminar | Señales, avisos, alarmas de estado de emergencia |
| Sustituir | **Uso de EPP** |
| Controles de ingeniería (barreras físicas, protecciones, controles de diseño) | Planes de contingencia (emergencias, derrames, primeros auxilios, incendio) |
| Señales, avisos, controles administrativos (procedimientos, normas, capacitación) | Simulacros |

Ver el desarrollo completo de cada columna, con las citas textuales, en
[[02-04-prevencion-y-proteccion]].

### El matiz — dónde va el EPP

> [!important] La diferencia entre la norma y la cátedra — material de parcial
> En la escalera de ISO 45001 el EPP es simplemente **el último escalón**, el menos eficaz de
> cinco, sin que la norma lo separe conceptualmente de los demás: es "una medida de control más",
> la de menor jerarquía.
>
> En la lectura de la cátedra, en cambio, el EPP **no compite en la misma escalera** que eliminar,
> sustituir, ingeniería y administrativos: esos cuatro están del lado de **prevención**
> (reducen la probabilidad), y el EPP está del lado de **protección** (reduce la gravedad), junto
> con alarmas, planes de contingencia y simulacros.
>
> Las dos lecturas **no se contradicen en el contenido** —los cinco elementos son los mismos— pero
> **ordenan distinto**, y eso cambia la respuesta a "¿qué va primero, controles administrativos o
> EPP?". Para ISO 45001 los controles administrativos siguen siendo más eficaces que el EPP dentro
> de una misma escalera. Para la cátedra la pregunta ni se plantea así, porque administrativos y
> EPP no están en la misma columna: uno previene, el otro protege. Ver también
> [[contradicciones]] (C-03) e [[iso-45001]] para la cita textual de la cláusula 8.1.2.

### Lectura 3 — los tres niveles del ASPT

El documento de [[aspt-teoria]] —y, lo que es más importante, la **letra impresa dentro del
[[aspt-formulario|formulario]] que hay que entregar**— dan una tercera versión:

> "Una estrategia habitual para priorizar el control de riesgos es implementar la **'Jerarquía de
> Control de Riesgos.'** Esta estrategia consta de **tres métodos de control básico**: los controles
> de ingeniería en primer lugar, los controles administrativos en segundo lugar y, por último,
> implementar el uso de Elementos de Protección Personal (EPP)." (ASPT, p. 5)

Y en la cabecera de la tercera columna del formulario, para que se lea mientras se completa:

> "Considere la 'Jerarquía de Control de Riesgos' (**1° controles de ingeniería, 2° controles
> administrativos, 3° Elementos de Protección Personal - EPP**)." (Formulario ASPT, p. 1)

| Nivel | Definición del documento | Ejemplos que da |
|---|---|---|
| **1.º Ingeniería** | "Cambios funcionales en el espacio de trabajo que hacen que las tareas sean más fáciles y seguras. Son el **método de control preferido** ya que suelen **encerrar, aislar o eliminar** un peligro" | Interruptores, sistemas de ventilación, placas de protección en partes móviles |
| **2.º Administrativos** | "Cambian el proceso de trabajo o las condiciones físicas que crean un riesgo" | Maneras menos riesgosas de hacer la tarea, políticas de seguridad, **permisos de espacio confinado**, **lock-out / tag-out** |
| **3.º EPP** | "Debe considerarse […] como un **último recurso** […]. Los EPP se utilizan cuando los controles de ingeniería o administrativos no pueden ser implementados o no reducen adecuadamente los riesgos" | — |

**¿Y dónde quedaron eliminar y sustituir?** No desaparecen: el documento los pone **antes** de la
escalera, como principio general y no como escalón:

> "Los riesgos deben ser controlados de la manera más segura posible. Tenga siempre en cuenta, **en
> primera instancia, los controles que eliminan los peligros**. Luego estudie los controles que
> sólo **reducen** los riesgos a niveles aceptables. Este principio no solo es aplicable durante el
> ASPT sino también a todas las áreas del lugar de trabajo." (ASPT, p. 5)

> [!important] Las tres lecturas, en una tabla — material de parcial
>
> | | [[iso-45001]] 8.1.2 | Clase 2 (slides 12-13) | ASPT (p. 5) |
> |---|---|---|---|
> | **Forma** | Una escalera de 5 | Dos columnas | Un principio + una escalera de 3 |
> | **Criterio de orden** | Eficacia decreciente | Qué reduce: `P` o `G` | Eficacia decreciente |
> | **Eliminar / sustituir** | Escalones 1 y 2 | Columna "prevenir" | **Principio previo**, fuera de la escalera |
> | **Ingeniería** | Escalón 3 | Columna "prevenir" | Nivel 1 |
> | **Administrativos** | Escalón 4 | Columna "prevenir" | Nivel 2 |
> | **EPP** | Escalón 5 | Columna "**proteger**" | Nivel 3 |
>
> **Lo que las tres comparten:** el EPP va último. **En lo que difieren:** dónde queda eliminar, y
> si administrativos y EPP compiten en la misma escalera (ISO y ASPT: sí; cátedra: no, están en
> columnas distintas).
>
> **Cuál usar y cuándo.** Para llenar el [[aspt-formulario]] de [[aspt-andamio]], la de tres
> niveles, porque está impresa en la planilla. Para responder "¿esta barrera baja la probabilidad o
> la gravedad?" —la pregunta del [[ejercicio-barreras]]—, la de dos columnas. Para una pregunta
> conceptual sobre eficacia, la de cinco escalones de la norma. Registrado en [[contradicciones]]
> (C-03 y C-09).

### La cosa física no es el criterio

Los tres cortes se entienden mejor con un caso que aparece en dos páginas de esta wiki: en
[[aspt-andamio]], **la baranda de un andamio es ingeniería y el arnés es EPP**, aunque los dos sean
objetos físicos que evitan una caída. La diferencia no es la materialidad:

- La **baranda** protege a todos los que están arriba, todo el tiempo, sin que nadie decida nada.
- El **arnés** protege sólo al que se lo puso, sólo si lo amarró, sólo si el anclaje resiste, y
  sólo en esta repetición de la tarea.

> **Inferencia.** Ninguna de las tres fuentes enuncia el criterio en estos términos; es la lectura
> que hace esta wiki para volver operativa la clasificación.

**El criterio real de la jerarquía es cuánto depende el control de una decisión humana repetida.**
Ingeniería: no depende. Administrativo: depende de que alguien cumpla un procedimiento. EPP:
depende de que alguien se lo ponga y lo use bien, cada vez. Por eso el
[[03-06-lockout-tagout|LOTO]], que tiene candados de acero, es **administrativo**: es un
procedimiento con hardware, no un dispositivo que actúa solo. Un enclavamiento que corta la energía
al abrir la guarda, en cambio, es ingeniería.

Es también la lectura conductual de [[03-05-seguridad-basada-en-comportamiento]]: todo lo que
dependa de una decisión repetida está peleando contra una consecuencia inmediata que premia el
atajo.

### Por qué separa las lecturas y no sólo cita una

Ambas lecturas son válidas y responden preguntas distintas. "¿Cuál es más eficaz?" lo responde la
escalera de ISO 45001. "¿Esta barrera actúa sobre la probabilidad o sobre la gravedad?" —la
pregunta del [[ejercicio-barreras]]— la responde la partición de la cátedra. Confundir los dos ejes
lleva a errores típicos: por ejemplo, pensar que el EPP es "poco eficaz" en el sentido de
[[02-03-barrera|barrera protectiva]] débil, cuando en realidad simplemente **no está diseñado
para prevenir** — su función planificada es proteger, y evaluarlo como si tuviera que reducir la
probabilidad de ocurrencia es aplicarle el criterio equivocado.

## En la materia

Slides 12 y 13 de la Clase 2, la página 5 de [[aspt-teoria]] y la cabecera del
[[aspt-formulario]], en diálogo con la cláusula 8.1.2 de [[iso-45001]]
(estructura de referencia). Es el mismo material que
[[02-04-prevencion-y-proteccion|prevención y protección]], leído desde el eje de la eficacia y el
orden en vez del eje de qué se reduce — evitar releer esa página primero deja huecos en el
argumento de acá.

## Relación con otros temas

- [[02-04-prevencion-y-proteccion]] — página que trae el contenido íntegro de "prevenir es" /
  "proteger es"; ésta se apoya en ella.
- [[02-03-barrera]] — el EPP como barrera es un caso particular del criterio
  preventiva/protectiva desarrollado ahí.
- [[02-07-epp]] — desarrollo puntual del EPP como último ítem de "proteger es".
- [[iso-45001]] — cláusula 8.1.2, fuente de la escalera única.
- [[contradicciones]] — registro completo de esta tensión (C-03 y C-09).
- [[03-01-aspt]] — la fase 4, donde se aplica la escalera de tres niveles.
- [[aspt-andamio]] — el caso resuelto: 30 controles de ingeniería, 24 administrativos y 7 de EPP.
- [[03-06-lockout-tagout]] y [[03-07-permiso-de-trabajo]] — los dos ejemplos de control
  administrativo que da el material.
- [[03-04-ergonomia]] — "¿por qué estaría mal enseñar a levantar cargas?" se responde acá.

## Fuentes

- (Clase 2, slide 12) — [[clase-02]]
- (Clase 2, slide 13) — [[clase-02]]
- ISO 45001:2018, cláusula 8.1.2 — [[iso-45001]]
- (ASPT, p. 5) — [[aspt-teoria]]
- (Formulario ASPT, p. 1) — [[aspt-formulario]]
