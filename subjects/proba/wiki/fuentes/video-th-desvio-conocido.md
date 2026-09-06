---
titulo: "Video — TH (Desvío conocido)"
resumen: "Clase en video de Lucio Pantazis (unidad 9) que desarrolla la prueba de hipótesis para la media con desvío conocido en sus tres colas: planteo de las hipótesis, valor crítico, error de tipo II, curva característica de operación y valor p."
tipo: fuente
formato: video
unidad: 9
url: "https://youtu.be/Pcg9s8_qAMQ"
duracion: "76:41"
docente: Lucio Pantazis
ingerido: 2026-09-03
---

# Video — TH (Desvío conocido)

**Qué es:** clase en video (YouTube, "Tests de hipótesis (Desvío conocido)") del Dr. Lucio José Pantazis, primera clase de la unidad, con las slides "PresentacionTH.pdf" y un ejemplo único desarrollado de punta a punta.
**Cubre:** motivación con un clip de cine, planteo de $H_0$/$H_1$, valor crítico, error tipo II y curva OC, decisión post-muestra y valor p, todo para la [[prueba-de-hipotesis-para-la-media|media con $\sigma$ conocido]] en sus tres colas.
**Guía asociada:** Guía 9.

## Recorrido de la clase

| Timestamp | Tema |
|---|---|
| [00:02] | Apertura: último tema de la materia; similitudes con la guía anterior de [[intervalos-de-confianza\|intervalos de confianza]] (guía 8). |
| [00:41] | Clip de la película argentina "Un cuento chino" (2005): un cliente reclama porque la caja de tornillos le llegó incompleta. |
| [02:19] | Planteo del ejemplo: la caja dice "350 tornillos Philips"; ¿cuánto es "demasiado poco"? |
| [08:28] | Analogía con el sistema judicial: $H_0$ = statu quo / presunción de inocencia (mismo marco que [[prueba-de-hipotesis]]). |
| [14:02] | Formalización: variable normal, media $\mu$ desconocida, desvío $\sigma=10$ **conocido**; $H_0:\mu\ge 350$ vs $H_1:\mu<350$. |
| [16:29] | De la caja individual al promedio de $n=50$ cajas ([[teorema-central-del-limite\|TCL]] y ley de grandes números, guía 7). |
| [26:21] | Fijar $\alpha=0{,}05$ y despejar $\bar x_c$ acotando el error tipo I en el peor caso $\mu=\mu_0$. |
| [31:37] | Error tipo II como **función** de $\mu$; calcula puntos concretos: $\beta(\bar x_c)=0{,}5$, $\beta(345)\approx 2{,}9\%$, $\beta(350)=0{,}95$. |
| [38:36] | Curva característica de operación (curva OC) y su contraparte, la curva de potencia. |
| [40:33] | Decisión post-muestra: Ricardo observa $\bar x_{obs}=323$; como $323<347{,}6738$, rechaza $H_0$. |
| [43:32] | Valor p: cuán extremo es el $323$ observado (orden $10^{-80}$) y por qué se define con "$\le$" y no con "$=$". |
| [57:01] | Generalización a cola derecha y a la prueba bilateral, sobre el mismo ejemplo de los tornillos. |
| [67:22] | Advertencia fuerte: $H_0$/$H_1$ van siempre sobre el **parámetro poblacional**, nunca sobre el estadístico muestral. |
| [72:04] | Resumen "Pre y Post muestra" (slide de cierre): qué se fija antes de la muestra y qué se calcula después. |
| [74:23] | Cierre: por qué el valor p es tan importante — funciona igual para *cualquier* test de hipótesis, no solo para este. |

## Qué aporta sobre el apunte

La teoría de fondo (deducción del valor crítico, fórmulas de $\beta(\mu)$, curva
OC) es la misma que ya está desarrollada en
[[apunte-media-nula-mayor-igual]], [[apunte-media-nula-igual]] y
[[apunte-media-estadistico-z]] — mismo docente. Lo que este video aporta
**encima** de esos apuntes:

- **(a) Un ejemplo único, numérico, resuelto de punta a punta.** A diferencia
  de los apuntes manuscritos (que dejan las cuentas en símbolos) y de los
  ejercicios ya archivados en el wiki (tubos de hormigón, cemento, alambre —
  con otros valores), este video corre **un solo caso concreto**
  ($n=50$, $\sigma=10$, $\mu_0=350$, $\alpha=0{,}05$) a través de **todo** el
  proceso: valor crítico premuestra ($\bar x_c=347{,}6738$), decisión
  postmuestra ($\bar x_{obs}=323$) y valor p (orden $10^{-80}$) — ver
  "Ejercicio resuelto" abajo. También calcula puntos concretos de la curva OC
  ($\beta(345)\approx 2{,}9\%$) que en [[error-tipo-i-y-tipo-ii]] solo están
  como fórmula general.
- **(b) Intuiciones y analogías nuevas:**
  - Motivación con el clip de cine "Un cuento chino" en vez de (o sumada a) la
    analogía del jurado que ya está en [[prueba-de-hipotesis]].
  - Mnemotecnia para la forma de la curva OC: es "sigmoidea" porque $\sigma$
    es la letra griega que se parece a una S (38:36).
  - Por qué el valor p se define con la cola completa ("$\le$" o "$\ge$") y no
    con el suceso puntual "$=$": en una distribución continua ese suceso
    puntual tiene probabilidad $0$ y no serviría para **graduar** cuán
    razonable es un valor observado (47:49–50:07).
  - Por qué la fórmula de la prueba bilateral lleva módulo y el factor $2$:
    argumento de simetría ("busco el espejo del otro lado de la distribución")
    en vez de una fórmula para memorizar (65:26–67:00).
- **(c) Advertencias explícitas del docente** — ver sección dedicada abajo.
- **(d) Énfasis:** insiste, más que el apunte, en separar explícitamente qué
  se decide **antes** de tomar la muestra (tamaño muestral, $\mu_0$, $\alpha$,
  $H_0$/$H_1$, estadístico, valores críticos, regla de decisión, $\beta(\mu)$)
  de lo que solo se puede calcular **después** (decisión tomada, valor p) —
  resumido en la slide "Pre y Post muestra" (72:04), que funciona como
  checklist para los ejercicios de examen. También remarca que, para el caso
  concreto del ejemplo (un cliente al que **le importa tanto que le den de
  menos como de más**), lo más sensato sería en realidad una prueba
  **bilateral**, aunque se use la unilateral para simplificar la primera
  explicación (57:01).

## Ejercicio resuelto en clase

*Arranca en [14:02] (planteo), se completa en [43:32] (valor p). Único
ejercicio de la clase, desarrollado sobre el ejemplo motivador de "Un cuento
chino".*

**Enunciado.** Un proveedor de tornillos afirma que sus cajas contienen en
promedio $\mu_0=350$ tornillos Philips. El desvío estándar de la cantidad de
tornillos por caja es $\sigma=10$ (conocido), y la cantidad de tornillos por
caja se asume normal. Un cliente sospecha que, en realidad, el proveedor le
está dando **sistemáticamente menos** de $350$ tornillos, y decide contrastar
esta sospecha tomando una muestra de $n=50$ cajas, con un nivel de
significación $\alpha=0{,}05$.

**Planteo [14:02].** "Sistemáticamente menos" → prueba de **cola izquierda**:
$$ H_0:\mu\ge 350 \qquad H_1:\mu<350, \qquad \alpha=0{,}05. $$
Como $\sigma=10$ es conocido, estadístico $\bar X\sim N\!\left(\mu,\ \sigma/\sqrt n\right)$
bajo $H_0$ centrada en $350$ (o, equivalentemente, $Z=\dfrac{\bar X-350}{\sigma/\sqrt{50}}\sim N(0,1)$).

**Valor crítico premuestra [26:21].** Acotando el error tipo I en el peor caso
$\mu=\mu_0=350$:
$$ \bar x_c = \mu_0 - z_{0{,}95}\,\frac{\sigma}{\sqrt n} = 350 - 1{,}6449\cdot\frac{10}{\sqrt{50}} \approx 350 - 2{,}3261 = 347{,}6738. $$
Regla de decisión (fijada **antes** de ver los datos): se rechaza $H_0$ si
$\bar X < 347{,}6738$.

**Error tipo II — algunos puntos de la curva OC [31:37].** Con $\mu_1<350$,
tal como aparece en la slide de esta sección (≈37:22):
$$ \beta(\mu_1)=1-\Phi\!\left(\frac{\bar x_c-\mu_1}{\sigma/\sqrt n}\right). $$
- $\beta(350)=1-\alpha=0{,}95$: límite de $\beta(\mu)$ cuando $\mu_1\to 350^-$
  (borde de $H_0$), calculado asumiendo que $H_0$ es correcta.
- $\beta(\bar x_c)=\beta(347{,}6738)=1-\Phi(0)=0{,}5$ (justo en la frontera).
- $\beta(345)=1-\Phi\!\left(\dfrac{347{,}6738-345}{10/\sqrt{50}}\right)=1-\Phi(1{,}89068)\approx 0{,}0293335$
  — el docente lo cita directamente como "solo el $2{,}9\%$ de las veces" no
  me voy a dar cuenta de que la media real está por debajo de $350$ si en
  verdad es $345$: $\beta(345)$ es la probabilidad de **no detectar** esa
  caída, es decir de aceptar $H_0$ por error cuando en realidad $\mu=345$. La
  potencia correspondiente — probabilidad de **rechazar** correctamente
  cuando $\mu=345$ — es $1-\beta(345)=\Phi(1{,}89068)\approx 0{,}9707$.

**Decisión post-muestra [40:33].** Ricardo (el cliente) termina contando y
observa un promedio $\bar x_{obs}=323$ tornillos sobre las $50$ cajas. Como
$$ \bar x_{obs}=323 < \bar x_c = 347{,}6738, $$
se **rechaza $H_0$**: hay evidencia suficiente para concluir que el proveedor
da sistemáticamente menos de $350$ tornillos, y Ricardo decide cambiarlo.

**Valor p [43:32].**
$$ z_{obs}=\frac{323-350}{10/\sqrt{50}}=\frac{-27}{1{,}4142}\approx -19{,}09, \qquad \text{valor p}=\Phi(z_{obs})\approx 1{,}5\times 10^{-81}. $$
El docente no da el número exacto, pero remarca que la probabilidad de
observar algo así de extremo (aun dándole el beneficio de la duda al
proveedor) es "algo que tiene $80$ ceros antes del primer uno" (44:37) —
muchísimo más chico que $\alpha=0{,}05$: no solo se rechaza $H_0$, sino que se
rechaza con evidencia abrumadora.

**Resultado.** $\bar x_c=347{,}6738$; se rechaza $H_0$ porque
$\bar x_{obs}=323<\bar x_c$; valor p del orden de $10^{-81}$. El mismo caso se
retoma luego ([57:01] en adelante) planteándolo como cola derecha y como
prueba bilateral, para mostrar cómo cambian el valor crítico y la regla de
decisión sin cambiar la lógica de fondo.

## Advertencias del docente

- **[67:22]–[69:00] — la más enfática de la clase.** Plantear $H_0$/$H_1$
  sobre el **estadístico muestral** (p. ej. escribir "$H_0:\bar X=350$") en
  vez del **parámetro poblacional** ($H_0:\mu=350$) es un error conceptual
  grave, no un detalle de notación: "no es un error tan grave, total conseguí
  bien los críticos. No, no están entendiendo. [...] si ponen esto están
  demostrando que no entienden." El docente lo remarca porque, según dice,
  muchos estudiantes plantean las hipótesis así.
- **[47:49]–[50:07]** Por qué el valor p usa la desigualdad ($\le$/$\ge$) y no
  la igualdad: con la igualdad, la probabilidad da siempre $0$ en una
  distribución continua y no permite distinguir qué tan razonable es un valor
  observado frente a otro.
- **[65:26]–[67:00]** Sobre la fórmula bilateral (módulo y factor $2$): mejor
  entender el argumento de simetría que memorizar la fórmula — "si se
  equivocan porque usan la fórmula y no lo pensaron, es más difícil sostener"
  (relevante para pedir puntaje parcial en el examen).
- **[07:40]–[08:00]** Toda regla de decisión (valor crítico, tamaño muestral)
  tiene que fijarse **antes** de ver la muestra, para no sesgar el resultado
  — coincide con la advertencia ya registrada en
  [[apunte-media-desvio-desconocido]], pero aquí se repite y se enfatiza varias
  veces a lo largo de toda la clase.
- **[74:23]–[76:10]** El valor p es la herramienta más transversal de la
  estadística: "cualquier test que ustedes tengan, si el p valor es chico,
  rechazan la hipótesis nula, sea cual sea" (75:58) — vale igual para tests
  de normalidad, de asociación, de igualdad de distribuciones, etc., aunque
  la mayoría de esos no se vean en esta materia.

## Páginas del wiki que toca

- [[prueba-de-hipotesis]]
- [[prueba-de-hipotesis-para-la-media]]
- [[error-tipo-i-y-tipo-ii]]
- [[estadistico-de-prueba]]
- [[valor-p]]
- [[reconocer-prueba-de-hipotesis]]
- [[formulario-pruebas-de-hipotesis]]
