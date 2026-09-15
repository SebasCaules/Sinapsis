---
titulo: Lock-out / Tag-out (bloqueo y etiquetado)
tipo: concepto
modulo: [1]
clase: [3, 4, 5]
division: "1"
tags: [lockout-tagout, barrera, jerarquia-de-controles, energia, mantenimiento, consignacion, cinco-reglas-de-oro]
fuentes: [aspt-trabajo-relevamientos, aspt-teoria, clase-05]
actualizado: 2026-09-15
estado: consolidado
aliases: [loto, lock-out-tag-out, bloqueo-y-etiquetado, consignacion]
resumen: 'Antes de meter la mano en un equipo hay que cortar sus fuentes de energía, trabar el corte con un candado (lock-out) y colgar una tarjeta que diga quién lo trabó y por qué (tag-out) — y la llave la tiene el que está adentro.'
---

## En una línea

Antes de meter la mano en un equipo hay que **cortar sus fuentes de energía, trabar el corte con un
candado (lock-out) y colgar una tarjeta que diga quién lo trabó y por qué (tag-out)** — y la llave
la tiene el que está adentro.

## Desarrollo

### Qué muestra la cátedra

El bloque son tres láminas casi sin texto (Trabajo ASPT, slides 31-33), y lo que enseñan está en
las imágenes:

| Slide | Qué se ve | Qué está diciendo |
|---|---|---|
| 31 | Una planta de proceso: tanques verticales, bombas, cañerías, válvulas, instrumentos | **El universo de energías a bloquear.** No es sólo el interruptor eléctrico: hay presión, fluido, temperatura, energía potencial en un tanque en altura |
| 32 | El hardware: una **pinza multi-candado** (*hasp*) con candados rojos y azules, una tarjeta **"DANGER — LOCKED OUT, DO NOT REMOVE"**, y un **bloqueo mecánico de válvula esférica** | El lock-out y el tag-out, y la evidencia de que también se bloquean **válvulas**, no sólo tableros |
| 33 | Un tanque de gran porte, con el detalle ampliado de la **boca de hombre** | El caso límite: entrar adentro. Acá el LOTO se cruza con el [[03-07-permiso-de-trabajo\|permiso de espacio confinado]] |

### Lock-out y tag-out no son lo mismo

Son dos barreras de naturaleza distinta que se aplican juntas, y distinguirlas es el punto
conceptual del tema:

| | **Lock-out** (bloqueo) | **Tag-out** (etiquetado) |
|---|---|---|
| Qué es | Un candado físico que **impide** reenergizar | Una tarjeta que **informa** quién bloqueó, cuándo y por qué |
| Cómo actúa | Físicamente: no se puede accionar aunque se quiera | Simbólicamente: hay que leerla y decidir respetarla |
| Familia de [[02-03-barrera\|barrera]] | **Física** | **Simbólica** |
| Si falla | Hay que romper el candado — deja rastro | Alguien la ignora y no queda rastro |

> [!important] El candado es la barrera; la tarjeta es la información
> Un tag sin lock es sólo un cartel: depende de que el otro lo lea y obedezca. Un lock sin tag traba
> el equipo pero nadie sabe de quién es la llave ni cuándo va a volver. Por eso van juntos: el
> candado hace el trabajo, la tarjeta lo vuelve gestionable.

### La pinza multi-candado es el corazón del método

El detalle más importante del slide 32 es el *hasp*: la pinza con varios agujeros, con **un candado
de cada color**. Significa que hay **varias personas** trabajando en el mismo equipo, y que
**cada una puso el suyo**. El equipo no se puede reenergizar hasta que el último candado salga — es
decir, hasta que la última persona haya salido y sacado el suyo.

> [!important] "Un candado, una llave, un dueño" — ya no es inferencia
> El Trabajo ASPT mostraba la pinza sin explicarla; la wiki había inferido la regla. La
> [[clase-05|Clase 5]] la enuncia: *"a todos los responsables de hacer alguna actividad de
> mantenimiento se les da un candado con un **color específico**, o a veces un número, y hay un
> **listado** donde está a quién se le asigna cada color… Ese candado tiene **solamente una llave**,
> que es la que utiliza el responsable o el dueño de ese candado. Nadie tiene la posibilidad de
> retirar ese candado si no es el dueño"* (Video Riesgo eléctrico, 20:01–20:57). Es lo que impide
> el modo de falla clásico: que un tercero, viendo el equipo aparentemente libre, lo reenergice
> con alguien adentro. "Obviamente esto se puede cortar con un alicate, pero no es la idea"
> (21:04).

### La definición de la cátedra, y su lugar dentro de la consignación

La [[clase-05|Clase 5]] es la única fuente que **define** LOTO con palabras:

> "LockOut TagOut = Bloqueo y Etiquetado. Es un procedimiento de seguridad para impedir que un
> equipo sea accionado mientras hay personas interviniendo en él." (Clase 5, slide 18)

Y la mecánica mínima (Video Riesgo eléctrico, 18:43–21:20): se hace el **corte visible** en un
**seccionador** —"una llave de luz como la de nuestra casa no indica un corte visible"— y se
coloca el **candado de bloqueo** que impide volver la palanca a "ON"; el cartel, el color y la
tarjeta son el **etiquetado**: avisan que se están haciendo trabajos y quién los hace.

> [!important] LOTO es la regla 2 de las 5 reglas de oro
> Las **5 reglas de oro** —la **consignación** del [[dec-351-79]]: abrir, bloquear, verificar,
> aterrar, delimitar— son la secuencia formal que esta página tenía anotada como faltante (H-13).
> El docente ubica al LOTO adentro: *"segundo, bloquear en posición de apertura: acá es donde entra
> el bloqueo y etiquetado, el procedimiento de LOTO"* (Video Riesgo eléctrico, 23:28–23:48). Y
> explica por qué el slide 17 lo lista aparte de las reglas: *"en muchos lugares no se utilizan las
> 5 reglas, pero sí se pueden implementar procedimientos de bloqueo y etiquetado"* (14:13–14:44).
>
> Dos cosas más que fija: la consignación **aplica a cualquier energía**, no sólo la eléctrica
> —"se realiza no solamente cuando hay energía eléctrica, sino cuando hay cualquier tipo de energía
> involucrada en una actividad de mantenimiento" (21:45–22:04)—, lo que reconecta con el universo
> de energías del slide 31 del Trabajo ASPT; y los cinco pasos **van en ese orden** (22:11). La
> secuencia completa y su explicación están en [[05-02-riesgo-electrico]].

### En qué escalón de la jerarquía está

[[aspt-teoria]] lo ubica sin ambigüedad, junto con los permisos de espacio confinado:

> "La implementación de maneras más eficientes o menos riesgosas de realizar una tarea, políticas
> de seguridad de la compañía, sistemas de permiso de ingreso a espacios confinados, procedimientos
> de bloqueo / etiquetado de seguridad ('lock-out' / 'tag-out'), son ejemplos de **controles
> administrativos**." (ASPT, p. 5)

> [!important] Es un control **administrativo**, aunque tenga candados
> Es la clasificación contraintuitiva del tema y por eso preguntable. Un candado es un objeto
> físico, pero el LOTO es un **procedimiento**: su eficacia depende de que alguien identifique todas
> las fuentes de energía, las corte, verifique energía cero, ponga el candado y después lo saque en
> el orden correcto. Cualquiera de esos pasos puede omitirse. Un enclavamiento
> (*interlock*) que corta solo al abrir la guarda **sí** es control de ingeniería: no depende de
> que nadie haga nada. Ver [[02-06-jerarquia-de-controles]].

### Y en la secuencia del accidente

En términos de [[02-05-secuencia-del-accidente]] y de la definición de
[[william-johnson|Johnson]] —accidente como transferencia indeseada de energía por falta de
barreras—, el LOTO es la barrera más limpia del repertorio: **no intenta contener la energía en el
momento del contacto, la elimina antes**. Por eso es **preventivo**, no protectivo: baja la `P` a
(idealmente) cero en vez de bajar la `G`. Ver [[02-04-prevencion-y-proteccion]].

### Cuándo se usa

El disparador típico es cualquier intervención sobre un equipo que podría arrancar o liberar
energía mientras alguien está expuesto: **mantenimiento, limpieza, desatasque, reparación, cambio
de herramental, inspección interna**. Es decir, todo lo que en [[03-01-aspt|ASPT]] cae bajo el
cuarto criterio de priorización —trabajos no rutinarios— y bajo el ejemplo textual del documento:
"quitar el tablero eléctrico" (ASPT, p. 3).

## En la materia

Bloque 5 de [[aspt-trabajo-relevamientos]] (slides 31-33), respaldado por la mención explícita de
[[aspt-teoria]] (p. 5), y **definido y explicado en la [[clase-05|Clase 5]]** (slide 18 y Video
Riesgo eléctrico, 18:43–21:29) como parte de la consignación eléctrica. No es un ítem propio del temario de la Clase 1, pero es la ilustración
canónica de "controles administrativos" del tema 4 ("Controles, barreras y defensas") y del tema 9
("Prevención de riesgos").

> [!note] Lo que faltaba y lo que sigue faltando (H-13, actualizado el 2026-09-15)
> Con la [[clase-05|Clase 5]] entró **la secuencia formal para la energía eléctrica** —las 5 reglas
> de oro, que son la consignación del [[dec-351-79]]— y la mecánica del candado. **Sigue
> faltando**: el tratamiento de energías residuales (presión, temperatura, energía potencial) y una
> secuencia formal para energías no eléctricas, que la cátedra sólo cubre diciendo que la
> consignación "aplica a cualquier energía". Ver [[huecos]].

## Relación con otros temas

- [[05-02-riesgo-electrico]] — las 5 reglas de oro, de las que el LOTO es la regla 2; la
  definición de la cátedra y la mecánica del candado.
- [[dec-351-79]] — la norma que llama "consignación" a la secuencia.
- [[03-07-permiso-de-trabajo]] — el compañero natural: el LOTO asegura el equipo, el permiso
  autoriza y controla la tarea.
- [[02-06-jerarquia-de-controles]] — es administrativo, no de ingeniería.
- [[02-03-barrera]] — el candado es barrera física; la tarjeta, simbólica.
- [[02-04-prevencion-y-proteccion]] — actúa sobre la probabilidad.
- [[william-johnson]] — elimina la energía antes de que pueda transferirse.
- [[03-01-aspt]] — un LOTO es una medida típica de la cuarta columna del [[aspt-formulario]].
- [[03-03-colores-y-senales-de-seguridad]] — la tarjeta roja y blanca del slide 32 y el rojo de
  "parada / prohibición" de la [[iram-10005]].

## Fuentes

- (Trabajo ASPT, slides 31-33) — [[aspt-trabajo-relevamientos]]
- (ASPT, p. 5) — [[aspt-teoria]]
- (Clase 5, slides 17–20; Video Riesgo eléctrico, 14:13–14:44, 18:43–25:29) — [[clase-05]]
