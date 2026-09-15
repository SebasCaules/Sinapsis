---
titulo: DQO, DBO₅ y biodegradabilidad
tipo: concepto
modulo: [2]
clase: []
division: "2"
tags: [efluentes, agua, dqo, dbo, biodegradabilidad, recalcitrantes, cofactores]
fuentes: [guia-parcial-2-ambiental, preguntas-ambiental-2017, finales-soa-compilado]
actualizado: 2026-08-25
estado: en-desarrollo
aliases: [dqo, dbo5, biodegradabilidad, demanda-quimica-de-oxigeno, demanda-bioquimica-de-oxigeno, cofactor, contaminantes-recalcitrantes]
resumen: 'Dos maneras de medir cuánta suciedad tiene un agua —una química (DQO, la mide toda) y otra biológica (DBO₅, mide sólo la parte que los microorganismos pueden comer)— y el cociente entre las dos, que es la biodegradabilidad: el número que dice si el efluente se puede tratar con bichos o hace falta química.'
---

> [!warning] Contenido de fuente de alumno, no de cátedra
> Las **preguntas** de este bloque son de cátedra ([[guia-parcial-2-ambiental]], guía oficial del
> parcial 2). Las **respuestas** son de [[preguntas-ambiental-2017]], un resumen de alumno de 2017.
> La cátedra **todavía no dictó el módulo 2 en la cursada 2026**: nada de acá está confirmado
> contra un soporte de clase. Cuando el módulo arranque, hay que cotejar y anotar las diferencias
> en [[contradicciones]].

## En una línea

Dos maneras de medir cuánta suciedad tiene un agua —una **química** (DQO, la mide toda) y otra
**biológica** (DBO₅, mide sólo la parte que los microorganismos pueden comer)— y el **cociente entre
las dos**, que es la biodegradabilidad: el número que dice si el efluente se puede tratar con
bichos o hace falta química.

## Por qué esta página es la bisagra del bloque de efluentes

> [!important] El valor de DQO **es** lo que decide qué tratamiento secundario va
> No es un dato de laboratorio suelto: es **el criterio de selección de tecnología** de todo
> [[tratamiento-de-efluentes-liquidos]]. Las dos mediciones responden dos preguntas distintas y
> encadenadas:
>
> 1. **¿Es biodegradable?** → lo contesta la **relación DBO₅/DQO**. Si sí, el secundario es
>    **biológico**; si no, el secundario es **químico**.
> 2. **Si es biodegradable, ¿cuán sucio está?** → lo contesta el **valor absoluto de DQO**, contra
>    el umbral de **5000 mg/l**. Por debajo, **aeróbico**; por encima, **anaeróbico**.
>
> Por eso la guía de cátedra pregunta lo mismo desde cuatro números distintos (**15, 16, 22 y 23**):
> son cuatro entradas a la misma decisión.

---

## DQO — Demanda Química de Oxígeno

> "Mide **cuánta suciedad hay en el agua**. La ataca con **oxidantes fuertes**, y ve cuánto oxígeno
> se consumió en esa oxidación." (Preguntas Ambiental 2017, p. 5)

Tres cosas que hay que poder decir de la DQO:

| Rasgo | Qué implica |
|---|---|
| Ataca con **oxidantes fuertes** | Es un ensayo **químico**, de laboratorio, con reactivos — no depende de que haya vida |
| Mide **toda** la suciedad oxidable | Biodegradable y no biodegradable, todo junto. Es el techo |
| Se expresa en **mg/l de oxígeno** | Lo que se mide no es la suciedad sino el **oxígeno consumido en oxidarla**. Es una medida indirecta |

> [!note] La DQO no mide "suciedad": mide **cuánto oxígeno cuesta quemarla**
> Es la sutileza que hace que las dos mediciones sean comparables entre sí, y por eso el cociente
> DBO₅/DQO tiene sentido: son la misma unidad, medida por dos caminos distintos.

## DBO₅ — Demanda Bioquímica de Oxígeno a 5 días

> "Mide cuánta **suciedad BIODEGRADABLE** tiene el agua. Revisa el consumo de oxígeno **de los
> microorganismos**." (Preguntas Ambiental 2017, p. 5)

La diferencia con la DQO es **quién oxida**: en la DQO oxida un reactivo químico; en la DBO₅ oxidan
**bacterias vivas**. Y las bacterias no comen todo: sólo lo que pueden metabolizar.

> [!note] El subíndice 5 es parte del nombre
> "DBO₅" se escribe con el 5, que son los días del ensayo. La fuente lo usa siempre así, y la guía
> de cátedra también: *"¿Qué es la DQO y cómo está relacionada con la **DBO₅** y la
> biodegradabilidad?"* (Guía Parcial 2, preg. 15). Escribir "DBO" a secas pierde información.

## La biodegradabilidad — el cociente

> "**BD**: Medida de relación entre la suciedad y la suciedad biodegradable." (Preguntas Ambiental
> 2017, p. 5)

Y la fórmula, que aparece en la fuente como una ecuación que la extracción a `.cache/txt/` perdió y
que se leyó rasterizando el PDF:

```
        DBO
BD  =  —————
        DQO
```

Así, tal cual, con `DBO` arriba y `DQO` abajo: **`BD = DBO / DQO`**.

> [!important] El sentido del cociente: **biodegradable sobre total**
> Arriba va la parte (lo que los microorganismos sí comen), abajo el total (todo lo oxidable). Por
> construcción es un número **entre 0 y 1**:
>
> - **BD alta** (cerca de 1) → casi toda la suciedad es biodegradable → **secundario biológico**.
> - **BD baja** (cerca de 0) → la suciedad está pero los bichos no la tocan → **secundario químico**,
>   o [[tratamiento-de-efluentes-liquidos|oxidación química avanzada]].
>
> La fuente escribe la fórmula como `BD = DBO/DQO` **y no da ningún valor de corte**. Qué BD separa
> "biodegradable" de "no biodegradable" no está en ninguna fuente del vault, y esta wiki no lo
> inventa. Ver [[huecos]].

> **Inferencia:** que el cociente esté acotado entre 0 y 1 sale de que la DBO₅ mide un subconjunto
> de lo que mide la DQO: la suciedad biodegradable no puede ser más que la suciedad total. La
> fuente no lo dice; se sigue de sus propias definiciones.

### El resumen de las tres, para el parcial

| | **Qué mide** | **Quién oxida** | **Qué queda afuera** |
|---|---|---|---|
| **DQO** | Toda la suciedad oxidable | Oxidantes fuertes (reactivo químico) | Nada relevante — es el total |
| **DBO₅** | Sólo la suciedad **biodegradable** | Microorganismos, en 5 días | Todo lo **recalcitrante** |
| **BD = DBO/DQO** | La **fracción** biodegradable del total | — | — |

---

## Contaminantes recalcitrantes

Son los que hacen que la DBO₅ sea mucho menor que la DQO:

> "Los contaminantes recalcitrantes son aquellos que, por tener una **estructura muy estable
> químicamente**, se resisten al ataque de los microorganismos o de cualquier mecanismo de
> degradación sea biológico o químico. Dentro de este tipo de contaminantes podemos mencionar a
> **hidrocarburos, compuestos fenólicos, disolventes halogenados, colorantes y compuestos
> aromáticos**." (Preguntas Ambiental 2017, pp. 6–7)

Los cinco ejemplos conviene tenerlos de memoria: son exactamente el tipo de efluente que sale de una
industria química, una petroquímica o una textil.

> [!note] "Recalcitrante" es la palabra que conecta esta página con tres respuestas distintas
> Aparece en la definición de los **terciarios** ("eliminando… orgánicos recalcitrantes", preg. 17),
> en la de la **oxidación química avanzada** ("aguas residuales con recalcitrantes, tóxicos o
> materiales no biodegradables", preg. 25) y acá, en la de los **cofactores** (preg. 20). Es un
> término que la fuente usa con consistencia en las tres.

---

## Cofactores (preg. 20)

La guía pregunta dos cosas: **qué función tiene** y **qué ocurre si falta**.

**Qué es:** "un componente de **tipo no proteico** que **complementa a una enzima** (que es una
sustancia proteica). El cofactor tiene que estar presente **en cantidades adecuadas** para que la
enzima pueda actuar, catalizando una reacción bioquímica. Son cofactores las **coenzimas** y los
**iones metálicos**." (Preguntas Ambiental 2017, pp. 6–7)

**Qué función cumple en la biodegradación:** "En el proceso de biodegradación o biotransformación de
estos compuestos actúan bacterias, pero al ser tan altamente resistentes estos compuestos se
utilizan **catalizadores para acelerar el proceso**. Estos catalizadores se llaman cofactores."
(p. 7)

**Qué pasa si falta:**

> "En su ausencia, **no se lleva a cabo la biomineralización**." (Preguntas Ambiental 2017, p. 7)

> [!important] La respuesta a la segunda mitad de la 20 es una sola frase y hay que decirla entera
> **Sin cofactor no hay biomineralización.** No es que el proceso vaya más lento: la enzima no
> cataliza, y la degradación **no ocurre**. Es un caso de todo o nada, no de rendimiento.
>
> Y es el enganche con la página hermana: un efluente puede dar **BD alta en el papel** —o sea,
> teóricamente biodegradable— y aun así **no degradarse en la planta**, porque falta un ion metálico
> traza que ninguna medición de DQO ni de DBO₅ ve. Es la razón por la que un tratamiento biológico
> bien dimensionado puede fallar igual.

> [!warning] "Biomineralización" es la única aparición del término en todo el corpus del vault
> La fuente lo usa una vez, en esa frase, y **no lo define**. Por el contexto es la degradación
> completa del contaminante orgánico hasta compuestos minerales, pero **la fuente no lo dice** y
> esta wiki no lo afirma. Anotado en [[huecos]] y en [[glosario-es-en]].

> **Inferencia:** la cadena lógica que la fuente arma sin escribirla del todo es:
> `enzima (proteica) + cofactor (no proteico) → catálisis → biodegradación → biomineralización`.
> El cofactor no degrada nada por sí mismo; **habilita** a la enzima que sí lo hace. Por eso la
> pregunta usa la palabra "función" y no "acción".

---

## Cuándo se cruza a la química (preg. 25 y 16)

Cuando la biodegradabilidad no alcanza, el tratamiento deja de ser biológico:

| Situación | Qué va |
|---|---|
| Biodegradable, **DQO < 5000 mg/l** | Secundario **biológico aeróbico** |
| Biodegradable, **DQO > 5000 mg/l** | Secundario **biológico anaeróbico** (y aeróbico después, para llegar a vuelco) |
| **No** biodegradable | Secundario **químico** (Preguntas Ambiental 2017, p. 6, preg. 16) |
| Recalcitrantes, persistentes, refractarios | **Oxidación química avanzada**: "contaminantes persistentes, refractarios que no son tratables mediante procesos físico químicos y biológicos convencionales (pesticidas, fármacos, surfactantes)" (p. 7, preg. 25) |

El desarrollo completo del criterio de DQO 5000 mg/l y de cada tecnología está en
[[tratamiento-de-efluentes-liquidos]]. Acá está el **por qué**: son los dos números de esta página
—la BD y la DQO— los que mandan a la corriente por una rama o por la otra.

---

## En la materia

**Módulo 2 — Medio Ambiente** ([[modulo-2-ambiente]]), bloque de **tratamiento de efluentes**
(preg. 11–30 de la guía de cátedra).

**Preguntas de la guía que esta página cubre:**

| Preg. | Qué pide | Dónde está |
|---|---|---|
| **15** | Qué es la DQO y cómo se relaciona con la DBO₅ y la biodegradabilidad | *DQO*, *DBO₅*, *La biodegradabilidad* |
| **20** | Qué función tiene un "cofactor" y qué ocurre ante su carencia | *Cofactores* |
| **25** | Cuándo se requieren tratamientos de oxidación química avanzada | *Cuándo se cruza a la química* — compartida con [[tratamiento-de-efluentes-liquidos]] |

**Compartidas con [[tratamiento-de-efluentes-liquidos]]:** la **16** (caso de DQO muy elevada) se
apoya en el criterio de esta página pero se resuelve allá, donde están las tecnologías; y las **22**
y **23** (cuándo anaeróbico / cuándo aeróbico) usan el umbral de DQO que acá se justifica. La tabla
de mapeo de [[guia-parcial-2-ambiental]] asigna la 16 a esta página; el desarrollo del caso está en
la otra, y las dos se enlazan mutuamente.

> [!important] La 15 es la pregunta con más rendimiento del bloque
> Contestarla bien exige **tres definiciones y una fórmula** —DQO, DBO₅, biodegradabilidad y
> `BD = DBO/DQO`—, y con esas tres definiciones quedan encaminadas la 16, la 22, la 23 y la 25. Es
> una pregunta que paga cuatro veces.

**¿Aparece en algún final del compilado?** **No como pregunta propia**, pero **sí aparece el
vocabulario**, y como distractor de una pregunta de otro tema:

- **Final, pregunta 13**: *"¿Qué cuerpo de agua es más posible que se eutrofique?"*, con las opciones
  *"c. Cuerpo lótico en presencia de **DQO**"* y *"d. Estuario en presencia de **DBO**"* (Finales
  SOA, pp. 8–9). La correcta es la b, *cuerpo léntico en presencia de fósforo*; las siglas de esta
  página están puestas ahí para que alguien que sepa qué miden **descarte** las opciones. Es
  exactamente el uso que se le da a un concepto bien entendido en un *multiple choice*. Ver
  [[cuerpos-de-agua-lenticos-y-loticos]].

Ni "biodegradabilidad", ni "cofactor", ni "recalcitrante" aparecen en el compilado de finales.

---

## Relación con otros temas

- [[tratamiento-de-efluentes-liquidos]] — **la página que esta bisagra decide**: qué secundario va,
  con qué tecnología y hasta dónde baja la carga.
- [[efluentes-gaseosos-y-toxicidad]] — el otro descendiente del bloque de efluentes; los volátiles
  biodegradables que van a biofiltro son la versión gaseosa del mismo criterio.
- [[cuerpos-de-agua-lenticos-y-loticos]] — qué le pasa al cuerpo receptor cuando llega carga
  orgánica sin tratar: consumo de oxígeno, anaerobiosis, muerte de organismos.
- [[contaminacion-y-polucion]] — la capacidad de autodepuración de un cuerpo de agua es, en el fondo,
  su capacidad de bajar DBO por sí solo.
- [[guia-parcial-2-ambiental]] — las consignas 15, 16, 20, 22, 23 y 25.
- [[preguntas-ambiental-2017]] — las respuestas, y sus límites.
- [[banco-parcial-2-ambiental]] — el cruce pregunta ↔ respuesta ↔ concepto.
- [[modulo-2-ambiente]] — el hub del módulo.
- [[01-05-riesgo]] — el paralelo del módulo 1: ahí una magnitud (`R = P × G`) decide qué barrera se
  pone; acá una magnitud (DQO, BD) decide qué tratamiento va. En los dos casos **se mide primero y
  se interviene después**.
- [[02-06-jerarquia-de-controles]] — y en los dos casos la escala de arriba es la misma: **que el
  efluente no se genere** gana sobre cualquier tratamiento, igual que eliminar el peligro gana sobre
  cualquier EPP.
- [[iso-14001]] — un sistema de gestión ambiental mide para poder controlar; DQO y DBO₅ son
  indicadores operacionales típicos.
- [[glosario-es-en]] — DQO (*COD*, chemical oxygen demand), DBO₅ (*BOD₅*, biochemical oxygen demand),
  recalcitrante (*recalcitrant*, *refractory*), biomineralización (*biomineralization*).
- [[huecos]] — no hay valor de corte de BD en ninguna fuente, y "biomineralización" queda sin definir.

## Fuentes

- (Guía Parcial 2, preg. 15, 16, 20, 22, 23 y 25) — [[guia-parcial-2-ambiental]], documento de
  cátedra. **Las consignas.**
- (Preguntas Ambiental 2017, pp. 5–7) — [[preguntas-ambiental-2017]], resumen de alumno.
  **Las respuestas.** La fórmula `BD = DBO/DQO` de la p. 5 está en una ecuación embebida que la
  extracción a `.cache/txt/` perdió; se leyó rasterizando el PDF.
- (Finales SOA, pp. 8–9) — [[finales-soa-compilado]], resumen de alumno. Sólo como verificación de
  que DQO y DBO aparecen en finales únicamente como distractores.
