---
titulo: "Video — Geométrica y Poisson"
resumen: "Clase en video de Lucio Pantazis (unidad 3) sobre la geométrica en sus dos convenciones, con la deducción de $E(Z)=1/p$ y $V(Z)=q/p^2$, la binomial negativa y la Poisson como límite de la binomial, con reglas prácticas de aproximación."
tipo: fuente
formato: video
unidad: 3
url: "https://youtu.be/tn6gf-b0M7I"
duracion: "62:26"
docente: Lucio Pantazis
ingerido: 2026-09-03
---

# Video — Geométrica y Poisson

**Qué es:** clase grabada de Lucio Pantazis sobre las distribuciones Geométrica y
Poisson, con dos ejemplos motivadores trabajados en vivo (el juego de Agustina en
el casino, y su versión "ludópata") y una demo con la calculadora de distribuciones
de Matt Bognar.
**Cubre:** distribución geométrica (ambas convenciones), su vínculo con la binomial
negativa, la distribución de Poisson como límite de la binomial, y un ejercicio de
cierre sobre cuándo una variable *no* tiene ninguna estructura conocida.
**Guía asociada:** Guía 3.

## Recorrido de la clase

| Timestamp | Tema |
|---|---|
| [00:04] | Planteo del juego de Agustina (urna con 4 azules/6 verdes, con reposición, apuesta hasta ganar por primera vez) → $Z$ tiene recorrido infinito, no se le puede poner un tope |
| [03:04] | Ganancia del casino $G(Z)$; error de simplificación algebraica en la diapositiva, corregido en vivo |
| [05:05] | Definición de las probabilidades puntuales $P(Z=k)=(1-p)^{k-1}p$ |
| [06:39] | Intuición de series infinitas: sumar hasta un valor alto y correr ese horizonte — demo numérica de sumas parciales que se estabilizan |
| [10:39]–[12:27] | Cálculo de $E[Z]$, $V(Z)$ y de la ganancia esperada del casino $E[G]$ |
| [13:26] | Generalización formal de la variable geométrica; diferencia clave con la binomial (recorrido infinito vs. finito) |
| [17:00]–[24:44] | Deducción completa de $E[Z]=1/p$ y $V(Z)=q/p^2$ derivando término a término la serie geométrica |
| [24:56] | Comentarios de cierre + introducción de la otra convención $\widetilde Z$ (fracasos antes del éxito) |
| [27:20] | Demo en la app de Matt Bognar: geométrica 1 y 2, verificación numérica de cuentas |
| [31:06] | Extensión a la Binomial Negativa: lógica combinatoria y comparación con la geométrica |
| [36:07] | Motivación de la Poisson: la "ludopatía" de Agustina — $N$ grande y $p$ chico desconocidos, solo se sabe $N\cdot p=3$ |
| [40:59]–[55:25] | Derivación paso a paso del límite Binomial → Poisson y de $E[X]=\lambda$, $V(X)=\lambda$ vía la serie de Taylor de $e^x$ |
| [55:50] | Reglas prácticas de aproximación ($n>100$, $p<0{,}01$, y $\lambda=np$ chico) con contraejemplo numérico |
| [57:35] | Advertencia sobre factoriales grandes en el parcial |
| [59:46]–[62:26] | Ejercicio de cierre: una moneda decide entre hipergeométrica o binomial → la variable resultante no es ninguna estructura conocida |

## Qué aporta sobre el apunte

- **(a) Ejemplos resueltos que no están en el wiki:**
  - El juego completo de Agustina en el casino ($Z$ = cantidad de extracciones
    hasta la primera azul, $G$ = ganancia del casino), con la corrección en vivo
    de un error de signo en la diapositiva. Reproducido íntegro más abajo.
  - El ejemplo motivador de la Poisson ("ludopatía" de Agustina: juega una
    cantidad enorme de veces con probabilidad de éxito muy chica, sin conocer
    $N$ ni $p$ por separado, solo su producto $Np=3$) — complementa el ejemplo de
    los pasajeros en la parada de [[poisson-apunte]] mostrando *por qué* se puede
    prescindir de $n$ y $p$ individuales.
  - El ejercicio de cierre con la moneda que decide el método de extracción
    (hipergeométrica condicional a cara, binomial condicional a ceca): la
    variable resultante no es ninguna de las dos, aunque ambas ramas sí lo sean.
- **(b) Intuiciones y motivación no escritas en el apunte:**
  - Demostración numérica en vivo de que una serie infinita converge (sumas
    parciales que se estabilizan a medida que se corre el "horizonte") antes de
    presentar la fórmula cerrada — pensada explícitamente para dar el concepto
    de serie a quienes no lo tienen fresco de Análisis.
  - La deducción de $E[Z]=1/p$ y $V(Z)=q/p^2$ ([[distribucion-geometrica]]) y de
    $E[X]=\lambda$, $V(X)=\lambda$ ([[distribucion-poisson]]) se hace derivando
    término a término la serie geométrica y la serie de Taylor de $e^x$
    respectivamente, en vez de solo citar el resultado — el apunte da las
    fórmulas ya demostradas por reindexación, sin este camino alternativo vía
    derivadas.
  - Uso en vivo de la [calculadora de Matt Bognar](https://homepage.divms.uiowa.edu/~mbognar/)
    para verificar cuentas y contrastar visualmente las dos convenciones de la
    geométrica ("Geometric Distribution (I)" cuenta fracasos, "(II)" cuenta
    intentos hasta el éxito).
- **(c) Advertencias del docente:** ver sección siguiente.
- **(d) Énfasis del docente:**
  - Insiste en que "no tener el concepto de que es una serie [infinita] me
    parece grave" para un ingeniero, aunque en el parcial no se pida calcular la
    serie en sí, solo usarla.
  - Remarca que la geométrica y la binomial negativa "cuentan otra cosa" que la
    binomial: no cantidad de éxitos, sino cantidad de intentos/fracasos *hasta*
    un éxito — la diferencia clave es que su recorrido es infinito porque no hay
    forma de ponerle un tope al número de repeticiones.
  - Insiste en verificar siempre si una variable tiene o no una estructura
    conocida ("a veces tiene la estructura y a veces no") antes de aplicar
    fórmulas de memoria — ver el ejercicio de cierre.

## Ejercicio resuelto en clase

**[00:04]–[12:27]** *Una urna tiene 4 bolitas azules y 6 verdes. Agustina extrae
con reposición y apuesta \$3 en cada extracción a que sale azul; juega hasta ganar
por primera vez y ahí se retira. Si pierde una apuesta, el casino se queda con los
\$3; si gana, el casino le devuelve la apuesta y le paga \$1 extra de premio. Sea
$Z$ = cantidad de extracciones hasta la primera bolita azul y $G$ = ganancia del
casino al final del juego. Calcular $E[Z]$, $V(Z)$ y $E[G]$.*

**Planteo.** "Éxito" = sale azul, con $p = P(\text{azul}) = \tfrac{4}{10} =
\tfrac25$ y $q = 1-p = \tfrac35$. Como $Z$ cuenta la cantidad de **intentos**
(incluido el que gana) hasta el primer éxito, $Z$ sigue la convención "número de
ensayos" de la [[distribucion-geometrica|geométrica]]:
$$ Z \sim \text{Geométrica}(p), \qquad P(Z=k) = q^{\,k-1}p, \quad k \in \{1,2,3,\dots\} $$

**Cálculo de $E[Z]$ y $V(Z)$.** Con las fórmulas ya conocidas de esta convención
([[distribucion-geometrica|ver la sección "número de ensayos"]]):
$$ E[Z] = \frac1p = \frac{1}{2/5} = \frac52, \qquad V(Z) = \frac{q}{p^2} = \frac{3/5}{4/25} = \frac{15}{4}, \qquad \sigma_Z = \frac{\sqrt{15}}{2}. $$

**Planteo de la ganancia del casino.** Si $Z=k$, hubo $k-1$ apuestas perdidas (el
casino gana \$3 en cada una) y una apuesta ganada al final, en la que el casino
debe devolver los \$3 apostados más \$1 de premio, es decir pierde neto \$1 en esa
última ronda. Entonces:
$$ G = 3\,(Z-1) - 1 $$
(en la diapositiva original esta expresión se había simplificado mal como
$G=3Z-1$ — el docente corrige en vivo que la distributiva da $3Z-3-1$, es decir
que la constante debe ser $4$, no $1$; ver [[#Advertencias del docente]]). La
forma correcta, ya simplificada, es:
$$ G = 3Z - 4 $$

**Cálculo de $E[G]$.** Por [[esperanza|linealidad de la esperanza]]:
$$ E[G] = 3\,E[Z] - 4 = 3\cdot\frac52 - 4 = \frac{15}{2} - \frac{8}{2} = \frac{7}{2} = 3{,}5. $$

**Resultado.** $E[Z] = 5/2$ extracciones, $V(Z) = 15/4$, y el casino gana en
promedio **\$3,5 por partida**, aun cuando Agustina se retira apenas gana su
primera apuesta: como dice el docente, "el casino gana siempre".

## Advertencias del docente

- **[03:52]–[04:20]** Corrección en vivo de un error algebraico en la
  diapositiva: la ganancia del casino se había simplificado mal como $G=3Z-1$;
  la forma correcta es $G=3Z-4$ (ver el ejercicio resuelto arriba).
- **[06:49]–[07:10]** "No tener el concepto de que es una serie [infinita], eso
  me parece como para un ingeniero me parece grave" — no va a pedir calcular una
  serie compleja en el parcial, pero sí espera que se entienda el concepto de
  suma parcial y convergencia (la cátedra da la fórmula de la serie cuando hace
  falta).
- **[55:56]–[56:26]** Regla práctica de aproximación Poisson a la binomial: como
  referencia, $n>100$ y $p<0{,}01$. Pero **no alcanza con eso**: también hace
  falta que $\lambda=n\,p$ quede chico. Ejemplo: con $n=1000$, $p=0{,}003$
  ($\lambda=3$) las probabilidades binomial y Poisson son casi idénticas; pero
  con $n=1000$, $p=0{,}3$ ($\lambda=300$) ya no se parecen, aunque $n$ siga
  siendo grande.
- **[57:35]–[59:02]** "Muchas veces en los exámenes me dicen: 'Ay, bueno, no pude
  calcular este factorial'" — si $n$ es muy grande (p. ej. $1000!$, que la
  mayoría de las calculadoras no computan) pero $k$ es chico, conviene usar la
  aproximación Poisson: no requiere conocer $n$ ni $p$ por separado, solo
  $\lambda=np$, y evita el factorial gigante.
- **[61:34]–[62:13]** Advertencia conceptual (ejercicio de cierre): que cada
  rama condicional de un experimento tenga una estructura conocida (aquí,
  hipergeométrica si sale cara y binomial si sale ceca) **no** implica que la
  variable total la tenga. Antes de aplicar fórmulas hay que fijarse qué valores
  toma la variable y calcular sus probabilidades puntuales desde cero (con
  probabilidad total, en este caso).

## Páginas del wiki que toca

- [[distribucion-geometrica]]
- [[distribucion-binomial-negativa]]
- [[distribucion-poisson]]
- [[distribucion-binomial]]
- [[distribucion-hipergeometrica]]
- [[esperanza]]
- [[varianza]]
- [[variable-aleatoria]]
- [[reconocer-distribucion-discreta]]
