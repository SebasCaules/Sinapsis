# Índice — Wiki 93.24 Probabilidad y Estadística

Catálogo de todas las páginas del wiki. Se actualiza en cada ingesta.
Para navegar rápido en Obsidian: abrí la vista de grafo.

> Estado: **Todas las unidades del programa ingeridas (1 a 9 + Complementos Matemáticos + Evaluaciones).**
> Material crudo de las 12 unidades descargado en `raw/` (96 documentos).
> **Las 37 clases grabadas de la cátedra (22.7 h, Dr. Lucio Pantazis) están ingeridas** — una
> página por clase, listadas bajo _Clases grabadas_ en cada unidad.
> **~92 figuras interactivas** (2026-09-04) ancladas con callouts `[!figura]` en las páginas de conceptos, distribuciones,
> teoremas y técnicas; se dibujan en la app de estudio (`estudio/`).

## Fuentes

**Unidad 1 — Estadística Descriptiva**
- [[estadistica-descriptiva-general]] — teórica de Estadística Descriptiva (44 diapos).
- [[estadistica-descriptiva-introduccion]] — pptx introductorio (26 slides): dataset de las 200 monedas de €1, tabla de frecuencias y gráficos exploratorios.
- [[tp1-estadistica-descriptiva]] — guía TP1 (repaso + ejercicios, 2 resueltos).

_Clases grabadas (Pantazis):_
- [[video-medidas-de-resumen]] — clase grabada (27 min): media, desvío, asimetría y curtosis sobre el ejemplo de los tiempos de viaje en subte; incluye el control de coherencia de la media.
- [[video-percentilos]] — clase grabada (21 min): cuartiles y percentiles con la fórmula general en sus dos casos (posición entera → promedio de dos órdenes; no entera → interpolación).
- [[video-datos-agrupados]] — clase grabada (19 min): media, desvío, mediana y percentiles con datos agrupados; ejercicio completo y una discrepancia de $n$ en la propia diapositiva.
- [[video-histogramas]] — clase grabada (12 min): del diagrama de barras discreto al histograma continuo; heurística de 15-20 intervalos y advertencia sobre el intervalo modal.
- [[video-boxplots]] — clase grabada (10 min): construcción del boxplot en vivo, límites de Tukey y lectura comparada de cuatro conjuntos (taxi/tren/subte/moto).

**Unidad 2 — Introducción a la Probabilidad**
- [[axiomas-probabilidad]] — teórica de fundamentos y axiomas (17 diapos).
- [[regla-de-laplace-slides]] — slides de Laplace y combinatoria (20 diapos).
- [[independencia-condicional-bayes]] — teórica de condicional, independencia y Bayes.
- [[tp2-calculo-de-probabilidades]] — guía TP2 2024 (repaso, 40 ejercicios, 8 resueltos).

_Clases grabadas (Pantazis):_
- [[video-axiomas]] — clase grabada (54 min): espacio muestral, sucesos y axiomas de Kolmogorov, con las propiedades derivadas paso a paso.
- [[video-total-y-bayes]] — clase grabada (35 min): probabilidad total y Bayes desarrollados sobre un único ejemplo extendido de extracción de cartas.
- [[video-laplace]] — clase grabada (31 min): regla de Laplace y conteo combinatorio; contraejemplo de espacios no equiprobables y experimento sin reposición.
- [[video-condicional]] — clase grabada (22 min): probabilidad condicional construida desde cero y regla del producto.
- [[video-independencia]] — clase grabada (19 min): independencia de eventos con dos ejemplos trabajados y el contraste con eventos mutuamente excluyentes.

**Unidad 3 — Variables Aleatorias Discretas**
- [[va-discretas-introduccion]] — slides teóricas (Pantazis) que motivan la v.a. discreta, PMF, FDA, E y V.
- [[bernoulli-apunte]] — apunte manuscrito de la distribución Bernoulli (urna 7 bolillas).
- [[binomial-apunte]] — apunte que deriva la binomial y demuestra E[X] y V[X].
- [[geometrica-apunte]] — apunte de la geométrica (conteo de fracasos) con falta de memoria.
- [[binomial-negativa-apunte]] — apunte de la binomial negativa (Pascal) y binomio negativo.
- [[hipergeometrica-apunte]] — apunte de la hipergeométrica con la aproximación binomial.
- [[poisson-apunte]] — apunte de la distribución Poisson (media = varianza = λ).
- [[poisson-aproximacion-binomial-apunte]] — apunte de la aproximación Poisson a la binomial.
- [[tp3-variables-aleatorias-discretas]] — guía TP3 2024 (repaso, 41 ejercicios, resueltos).

_Clases grabadas (Pantazis):_
- [[video-geometrica-y-poisson]] — clase grabada (62 min): geométrica y Poisson con dos ejercicios resueltos completos.
- [[video-vad-generales]] — clase grabada (61 min): variable aleatoria discreta, PMF, FDA, esperanza y varianza, narrado sobre las slides.
- [[video-binomial-e-hipergeometrica]] — clase grabada (60 min): binomial e hipergeométrica, con y sin reposición, y la aproximación entre ambas.

**Unidad 4 — Variables Aleatorias Continuas**
- [[teorica-va-continuas]] — apunte que introduce v.a.c., FDA, densidad y E/V por integral.
- [[teorica-va-uniforme]] — apunte de la uniforme continua con deducción de E[X] y V(X).
- [[teorica-va-exponencial]] — apunte de la exponencial: momentos vía Gamma y falta de memoria.
- [[teorica-va-normal]] — apunte de la normal, normal estándar, estandarización y tabla.
- [[tp4-variables-aleatorias-continuas]] — guía TP4 2024 (36 ejercicios, tablas Φ y fractiles).

_Clases grabadas (Pantazis):_
- [[video-vac-generales]] — clase grabada (45 min): variables aleatorias continuas: densidad, FDA y momentos por integral.
- [[video-normales]] — clase grabada (40 min): distribución normal, estandarización y uso de la tabla, con dos ejercicios resueltos.
- [[video-uniformes-y-exponenciales]] — clase grabada (26 min): uniforme continua y exponencial derivadas desde dos ejemplos numéricos (amanecer, termómetro); adelanto de la Gamma.

**Unidad 5 — Función de V.A. y Variables Bidimensionales**
- [[teorica-bidimensionales-vad-intro]] — v.a.d. bidimensionales (urna): conjunta, marginales, E[g(X,Y)].
- [[teorica-funcion-de-variable-aleatoria]] — Y=g(X): método FDA, afines, normales, transformada inversa.
- [[teorica-covarianza-y-correlacion]] — define Cov y ρ con la fórmula práctica y el caso afín.
- [[teorica-independencia-vad]] — independencia discreta: factorización, E[producto], Cov=0.
- [[teorica-bidimensionales-vac-intro]] — v.a.c. bidimensionales (cilindro): densidad, marginales, condicionales.
- [[teorica-mezcla]] — mezcla (subte/colectivo): FDA, densidad, E, Var con cuidado, Bayes.
- [[teorica-correlacion-entre-menos-uno-y-uno]] — demostración de ρ∈[-1,1] (Cauchy-Schwarz).
- [[teorica-correlacion-uno-implica-relacion-lineal]] — ρ=±1 ⟺ relación lineal con prob. 1.
- [[tp5-2024]] — guía TP5 2024 (repaso, 36 ejercicios, 6 resueltos).

_Clases grabadas (Pantazis):_
- [[video-funciones-de-variables-aleatorias]] — clase grabada (59 min): $Y=g(X)$ por el método de la FDA, con dos ejercicios resueltos.
- [[video-vad-2d]] — clase grabada (50 min): bidimensionales discretas sobre un único ejemplo extendido: conjunta, marginales, condicionales, covarianza y correlación.
- [[video-vac-2d]] — clase grabada (31 min): bidimensionales continuas: densidad conjunta, marginales y condicionales.
- [[video-mezcla]] — clase grabada (22 min): variables de mezcla con partición de tres escenarios y la advertencia sobre la varianza.
- [[video-valor-esperado-condicional]] — clase grabada (22 min): esperanza condicional, con dos ejercicios resueltos.

**Unidad 6 — Procesos Estocásticos**
- [[teorica-procesos-estocasticos-introduccion]] — slides intro: proceso, caminata, Markov, estacionariedad.
- [[teorica-cadenas-de-markov]] — slides: matriz de transición, Chapman-Kolmogorov, estacionaria.
- [[teorica-proceso-de-bernoulli]] — apuntes 01-02-03: definición, incrementos y tiempos entre eventos.
- [[teorica-proceso-de-poisson]] — apuntes 04-05-06: definición con o(h), N(t)~Poisson(λt), tiempos exp.
- [[teorica-relacion-bernoulli-poisson]] — apunte 07: Poisson como límite continuo de Bernoulli.
- [[tp6-procesos-estocasticos]] — guía TP6 (repaso, 25 ejercicios, resueltos de Poisson y Markov).

_Clases grabadas (Pantazis):_
- [[video-procesos-de-poisson]] — clase grabada (47 min): proceso de Poisson completo: definición, $N(t)$, tiempos entre eventos, con dos ejercicios.
- [[video-tiempos-de-espera]] — clase grabada (45 min): tiempos de espera y absorción con $(I-Q)^{-1}$, sobre una cadena con estados absorbentes.
- [[video-cadenas-de-markov]] — clase grabada (32 min): cadenas de Markov desde un ejemplo concreto: matriz de transición y Chapman-Kolmogorov.
- [[video-procesos-estocasticos]] — clase grabada (31 min): introducción a los procesos estocásticos: definición, caminata aleatoria y estacionariedad.
- [[video-distribucion-estacionaria-regulares]] — clase grabada (18 min): distribución estacionaria en el caso regular, concentrada en un solo ejemplo.
- [[video-distribucion-estacionaria-no-regulares]] — clase grabada (15 min): caso no regular: clases, absorción y estacionarias múltiples; cuatro ejercicios.

**Unidad 7 — Suma de Variables Aleatorias**
- [[teorica-suma-va-general]] — E y V de S=X+Y caso general (con covarianza).
- [[teorica-suma-va-independientes]] — convolución y tabla de casos especiales.
- [[teorica-suma-iid-bernoulli]] — Bernoulli→Binomial, E/V de S_n y promedio.
- [[teorica-suma-promedio-iid]] — E/V de suma y promedio i.i.d., V(promedio)→0.
- [[teorica-suma-binomiales]] — demo Bin+Bin=Bin vía identidad de Vandermonde.
- [[teorica-suma-poisson]] — demo Poisson+Poisson=Poisson vía binomio de Newton.
- [[teorica-suma-normales]] — demo Normal+Normal=Normal vía convolución.
- [[teorica-suma-uniformes]] — Unif+Unif da densidad triangular (no uniforme).
- [[teorica-suma-exponenciales]] — suma de n Exp i.i.d. = Erlang/Gamma.
- [[teorica-markov-chebyshev]] — enunciados y demos de Markov y Chebyshev.
- [[teorica-ley-grandes-numeros]] — ley débil (vía Chebyshev) y ley fuerte.
- [[teorica-tcl-introduccion]] — enunciado del TCL y aproximaciones prácticas.
- [[teorica-aproximacion-binomial-normal]] — derivación vía Stirling+Taylor y corrección por continuidad.
- [[tp7-suma-de-va]] — guía TP7 (repaso, tabla de sumas, divisibilidad/estabilidad, 6 resueltos).

_Clases grabadas (Pantazis):_
- [[video-tcl]] — clase grabada (41 min): Teorema Central del Límite con cuatro ejemplos y la corrección por continuidad.
- [[video-suma-variables]] — clase grabada (39 min): distribución de la suma de independientes por convolución; cuatro ejercicios resueltos.
- [[video-desigualdades-y-lgn]] — clase grabada (36 min): desigualdades de Markov y Chebyshev y la ley de los grandes números.

**Unidad 8 — Inferencia Estadística**
- [[teorica-estimacion-puntual-intro]] — estadístico, estimador, ECM, sesgo, insesgado, consistente.
- [[teorica-estimacion-puntual-conocidos]] — estimadores de media, proporción y varianza; ji-cuadrado.
- [[teorica-maxima-verosimilitud]] — verosimilitud, log-verosimilitud, ejemplo normal.
- [[teorica-maximo-a-posteriori]] — método MAP bayesiano: prior, posterior, Bayes.
- [[teorica-metodo-de-los-momentos]] — igualar momento poblacional al muestral; ejemplo exponencial.
- [[teorica-ic-media-desvio-conocido]] — IC para la media con σ conocido (Z), bilateral/unilaterales.
- [[teorica-ic-proporcion]] — IC para una proporción con TCL.
- [[teorica-ic-media-desvio-desconocido-intro]] — los tres escenarios e introducción del estadístico T.
- [[teorica-t-de-student]] — densidad, momentos, simetría, convergencia a la normal, fractiles.
- [[teorica-ic-media-desvio-desconocido-intervalos]] — IC con t de Student y ejemplo del azúcar.
- [[tp8-estimacion-de-parametros]] — guía TP8 2024 (repaso, tablas, resueltos de estimación e IC).

_Clases grabadas (Pantazis):_
- [[video-metodos-de-estimacion]] — clase grabada (52 min): máxima verosimilitud y método de los momentos, desarrollados en pizarra.
- [[video-ic-desvio-conocido]] — clase grabada (47 min): intervalos de confianza con $\sigma$ conocido, hilando un ejemplo numérico de punta a punta.
- [[video-ic-desvio-desconocido]] — clase grabada (41 min): intervalos de confianza con $\sigma$ desconocido ($t$ de Student); cinco ejercicios resueltos.
- [[video-poblacion-y-muestra]] — clase grabada (39 min): población, muestra, estadístico y estimador; sesgo y consistencia.

**Unidad 9 — Pruebas de Hipótesis**
- [[intro-prueba-de-hipotesis-slides]] — pptx introductorio: ejemplos, errores, regla de decisión, valor p.
- [[apunte-media-nula-igual]] — apunte: región de rechazo bilateral y β(μ).
- [[apunte-media-nula-mayor-igual]] — apunte: región de cola izquierda y β(μ).
- [[apunte-media-estadistico-z]] — apunte: equivalencia estimador puntual ↔ estadístico Z.
- [[apunte-prueba-proporcion]] — apunte: región de rechazo, β(p) y valor p para la proporción.
- [[apunte-media-desvio-desconocido]] — apunte: estadístico T con t de Student, ejemplo de las lámparas.
- [[tp9-pruebas-de-hipotesis]] — guía TP9 2024 (repaso, tablas, ejercicios resueltos).

**Complementos Matemáticos**
- [[complemento-integrales-impropias]] — integrales impropias Tipo I y Tipo II con dos ejemplos.
- [[complemento-integrales-dobles]] — integral doble vía masa de una placa, Fubini y baricentro.
- [[complemento-derivadas-parciales]] — derivada parcial cruzada como densidad a partir de la masa.

**Evaluaciones**
- [[evaluaciones]] — catálogo de `raw/12-evaluaciones` (parciales/finales; + recuperatorios resueltos, parcialitos TP3y4 y TP8y9 y ~16 parciales 2023-2025 bajados del Drive 2026-06-28).

**Propuestos por Lutzio (todas las unidades)**
- [[propuestos-lutzio]] — ~86 ejercicios propuestos por Lutzio (Lucio J. Pantazis), resueltos y typeset por unidad (PDFs imprimibles en `Parcial-Para-Imprimir/resoluciones/reso-lutzio-*`), reconciliados con la clave de Juani GG. Material crudo + clave en `raw/13-propuestos-lutzio/`.

_Clases grabadas (Pantazis):_
- [[video-th-desvio-conocido]] — clase grabada (76 min): primera clase de la unidad: el ejemplo de los tornillos de punta a punta — valor crítico, $\beta(\mu)$, curva OC y valor p.
- [[video-th-proporciones]] — clase grabada (34 min): pruebas para una proporción: aproximación normal y prueba exacta binomial para $n$ chico.
- [[video-th-desvio-desconocido]] — clase grabada (26 min): pruebas de hipótesis con $\sigma$ desconocido.
- [[parcialito-tp3y4]] — parcialito TP3–TP4 en sus 4 versiones (Com. A, C, E y F), resoluciones oficiales de Pantazis: 8 ejercicios, una v.a.d. + una v.a.c. por comisión, enunciados simbólicos; pares con/sin reposición (Binomial vs. Hipergeométrica, Laplace condicional vs. independencia) y densidad lineal a normalizar vs. Normal/Exponencial.
- [[parcialito-tp8y9-acf]] — resoluciones oficiales del parcialito de TP8-TP9 en las tres comisiones (A: IC de proporción 94 % + valor crítico con $\sigma$ conocido; B: IC de media 88 % + t-Student cola izquierda; F: IC de media 92 % + t-Student cola derecha), con las erratas de copiado del PDF de Com. F anotadas.

## Conceptos

**Unidad 1 — Estadística Descriptiva**
- [[estadistica-descriptiva]] — **hub**; mapa de la unidad.
- [[poblacion-y-muestra]] · [[medidas-de-tendencia-central]] · [[medidas-de-dispersion]] · [[cuartiles-y-percentiles]] · [[asimetria-y-curtosis]] · [[histograma-y-frecuencias]] · [[boxplot]] · [[datos-agrupados]]

**Unidad 2 — Introducción a la Probabilidad**
- [[probabilidad]] — **hub**; mapa de la unidad.
- [[espacio-muestral-y-eventos]] · [[axiomas-de-probabilidad]] · [[regla-de-laplace]] · [[probabilidad-condicional]] · [[independencia]] · [[probabilidad-total-y-bayes]] · [[arbol-de-probabilidades]] · [[leyes-de-de-morgan]]

**Unidad 3 — Variables Aleatorias Discretas**
- [[variable-aleatoria]] — v.a. discreta: recorrido, PMF, FDA, esperanza, varianza, momentos, FGM.
- [[esperanza]] — valor esperado: definición, E[g(X)], linealidad, advertencia E[XY].
- [[varianza]] — V(X)=E[X²]−E[X]², propiedades, advertencia V(X+Y).
- [[funcion-de-distribucion-acumulada]] — F_X(k)=P(X≤k), propiedades, forma escalonada.
- [[funcion-generadora-de-momentos]] — M_X(t)=E[e^{tX}], generación de momentos, caracterización.

**Unidad 4 — Variables Aleatorias Continuas**
- [[variable-aleatoria-continua]] — definición de v.a.c., FDA, densidad, E y V por integral.
- [[funcion-de-densidad]] — pdf como derivada de la FDA, propiedades, comparación con la PMF.
- [[tasa-de-fallas]] — tasa de riesgo $R(t)=f_T/(1-F_T)$; caracterización exponencial ⟺ $R$ constante.
- [[minimo-de-exponenciales]] — mínimo de $n$ exponenciales (sistemas en serie) ~ Expo($\sum\lambda_i$).

**Unidad 5 — Función de V.A. y Variables Bidimensionales**
- [[funcion-de-variable-aleatoria]] — distribución de Y=g(X): método FDA, afines, normales, transformada inversa.
- [[variables-aleatorias-bidimensionales]] — conjunta y marginales (discreto/continuo), condicionales, esperanza total.
- [[covarianza-y-correlacion]] — Cov, fórmula práctica, Var de combinación lineal, ρ∈[-1,1], ρ=±1⟺lineal.
- [[independencia-de-variables-aleatorias]] — definición discreta/continua, Cov=0, incorrelación≠independencia.
- [[mezcla-de-distribuciones]] — mezcla continua condicionada a discreta: FDA, densidad, E, varianza no lineal, Bayes.
- [[esperanza-condicional]] — $E[X\mid Y]$, varianza condicional, leyes de esperanza total y de varianza total.

**Unidad 6 — Procesos Estocásticos**
- [[procesos-estocasticos]] — **hub**; definición, Chapman-Kolmogorov, estacionariedad, Markov, conteo.
- [[proceso-de-bernoulli]] — proceso de conteo discreto: N(k)~Binomial(k,p), incrementos, tiempos geométricos.
- [[proceso-de-poisson]] — proceso de conteo continuo: N(t)~Poisson(λt), tiempos exponenciales, Erlang.
- [[relacion-bernoulli-poisson]] — Poisson como límite continuo de Bernoulli (p=λΔt) y tabla comparativa.
- [[cadenas-de-markov]] — matriz de transición, diagrama, tipos de estados, distribución estacionaria.
- [[caminata-aleatoria]] — random walk simétrica/general/gaussiana, propiedades y momentos.

**Unidad 7 — Suma de Variables Aleatorias**
- [[suma-de-variables-aleatorias]] — **hub**; E y V de una suma (con covarianza), convolución, suma/promedio i.i.d.
- [[suma-de-va-independientes]] — Bernoulli→Binomial, Bin+Bin, Poisson+Poisson, Normal+Normal, Unif+Unif, Exp→Gamma.
- [[aproximacion-normal-de-la-binomial]] — De Moivre-Laplace, corrección por continuidad.
- [[promedio-muestral]] — media μ, varianza σ²/n, error estándar; enlace a LGN y TCL.

**Unidad 8 — Inferencia Estadística**
- [[inferencia-estadistica]] — **hub**; cierra el lazo con descriptiva y ramifica en estimación puntual e IC.
- [[estimacion-puntual]] — estimador, sesgo, ECM, consistencia y los métodos MV, MAP y momentos.
- [[intervalos-de-confianza]] — media σ conocido (Z), proporción, media σ desconocido (t), tamaño muestral.
- [[varianza-muestral]] — estimador S_n² con denominador n−1; demostración de insesgadez.

**Unidad 9 — Pruebas de Hipótesis**
- [[prueba-de-hipotesis]] — **hub**; H0/H1, errores I y II, α, estadístico, región de rechazo, valor p.
- [[error-tipo-i-y-tipo-ii]] — tabla de errores, nivel de significación, potencia, curva OC, fórmulas de β.
- [[valor-p]] — definición, regla rechazar si p<α, cálculo por tipo de cola.
- [[estadistico-de-prueba]] — estadísticos Z/T/proporción, regiones de rechazo por cola.
- [[prueba-de-hipotesis-para-la-media]] — estadístico Z (σ conocida) y T (σ desconocida).
- [[prueba-de-hipotesis-para-la-proporcion]] — estadístico Z con q̂=X/n, valor crítico y β(q).

## Distribuciones

**Discretas (Unidad 3)**
- [[distribucion-bernoulli]] — un ensayo éxito/fracaso; E=p, V=pq, FGM.
- [[distribucion-binomial]] — n éxitos en ensayos independientes; E=np, V=npq.
- [[distribucion-geometrica]] — fracasos hasta el 1er éxito (R=N₀, E=q/p); falta de memoria.
- [[distribucion-binomial-negativa]] — fracasos hasta el r-ésimo éxito (R=N₀, E=rq/p).
- [[distribucion-hipergeometrica]] — muestreo sin reposición; E=nM/N, factor de corrección.
- [[distribucion-poisson]] — conteos en un intervalo; E=V=λ, aproximación a la Binomial.

**Continuas (Unidades 4, 7 y 8)**
- [[distribucion-uniforme-continua]] — Unif(a,b); E=(a+b)/2, V=(b−a)²/12.
- [[distribucion-exponencial]] — Expo(λ); densidad, FDA, momentos, falta de memoria.
- [[distribucion-normal]] — N(μ,σ); densidad, regla empírica, estandarización.
- [[distribucion-weibull]] — Weibull(λ,b); FDA 1−exp(−(λx)^b), tasa de fallas, caso b=1=exponencial (U4).
- [[distribucion-gamma]] — Gamma(α,λ); suma de exponenciales, E=α/λ, V=α/λ², relación con Erlang/ji-cuadrado (U7).
- [[distribucion-erlang]] — Erlang(k,λ); tiempo de la k-ésima ocurrencia de Poisson, Gamma de forma entera (U7).
- [[distribucion-t-de-student]] — densidad, momentos, fractiles, relación con normal y ji-cuadrado (U8).
- [[distribucion-ji-cuadrado]] — χ²ₖ; densidad, E=k, V=2k, (n−1)S²/σ²~χ², relación con normal y Gamma (U8).

## Teoremas
- [[teorema-central-del-limite]] — enunciado, 3 aproximaciones (Z_n, promedio, S_n), corrección por continuidad (U7).
- [[ley-de-grandes-numeros]] — ley débil (demo vía Chebyshev) y ley fuerte, interpretación frecuentista (U7).
- [[desigualdad-de-chebyshev]] — desigualdades de Markov (X≥0) y de Chebyshev, con demos (U7).

## Técnicas
- [[tecnica-datos-agrupados-interpolacion]] — mediana/cuartiles/proporciones por interpolación (U1).
- [[tecnica-conteo-combinatoria]] — principios de conteo, complemento, combinatoria (U2).
- [[reconocer-distribucion-discreta]] — árbol de decisión, pistas del enunciado, aproximaciones, tabla comparativa (U3).
- [[teoria-de-la-decision-valor-esperado]] — maximizar el valor esperado para decidir entre alternativas inciertas; vendedor de diarios resuelto (U3).
- [[estandarizacion-y-tabla-normal]] — estandarizar, simetría de Φ, fractiles e interpolación lineal (U4).
- [[tecnica-distribucion-de-una-funcion-de-va]] — método FDA para Y=g(X), atajos y errores típicos (U5).
- [[reconocer-prueba-de-hipotesis]] — patrón paso a paso: media vs proporción, elegir cola, Z/T, errores frecuentes (U9).
- [[diseno-de-prueba-tamano-muestral]] — fijar α y β a la vez para despejar n y el valor crítico c; curva OC (U9).
- [[tecnica-integrales-impropias]] — integrales impropias Tipo I y Tipo II, dos ejercicios resueltos (Compl.).
- [[tecnica-integrales-dobles]] — integral doble, Fubini y baricentro como analogía de densidad conjunta (Compl.).
- [[tecnica-derivadas-parciales]] — derivada parcial cruzada como densidad (inversa de acumular) (Compl.).
- [[ejercicios-de-parcial-resueltos]] — 8 ejercicios de parcial de probabilidad y procesos paso a paso (Eval.).
- [[ejercicios-de-parcial-resueltos-estadistica]] — 7 ejercicios de parcial de estadística e inferencia paso a paso (Eval.).

## Formularios
- [[formulario-maestro]] — **hoja integral de toda la materia** (13 secciones): probabilidad · V.A.D. y discretas (tabla) · V.A.C. y continuas (tabla) · Normal y estandarización · función de v.a. $Y=g(X)$ · bidimensionales · covarianza/correlación · suma/desigualdades/LGN/TCL · procesos · descriptiva · inferencia y pruebas. Núcleo de variables aleatorias a full; el resto, resumen que enlaza a los formularios por unidad.
- [[formulario-va-continuas]] — fórmulas generales, tabla de distribuciones continuas, estandarización, curtosis (U4).
- [[formulario-suma-de-va]] — E/V de sumas, convoluciones, cotas, LGN, TCL, aprox. binomial, fractiles (U7).
- [[formulario-inferencia]] — estimadores, ECM, IC para media y proporción, tamaño muestral, árbol de decisión (U8).
- [[formulario-pruebas-de-hipotesis]] — estadísticos, regiones de rechazo, valores críticos, valor p, β, fractiles (U9).

---
### Páginas referenciadas aún no creadas (pendientes)

_Resueltos previamente:_ Los forward-links que estaban en esta lista
—`[[distribucion-pareto]]`, `[[distribucion-erlang]]`, `[[distribucion-gamma]]`, `[[distribucion-ji-cuadrado]]`,
`[[distribucion-weibull]]` y `[[De Morgan]]` (resuelto por
`[[leyes-de-de-morgan]]`)— ya tienen su página propia (ver `log.md`).
- [[formulario-complementos-matematicos|Formulario — Complementos Matemáticos]] — hoja de la unidad 0: integrales impropias (Tipo I y II), integrales dobles con Fubini y baricentro, derivadas parciales y Clairaut, más el diccionario masa ↔ probabilidad.
- [[formulario-estadistica-descriptiva|Formulario — Estadística Descriptiva]] — hoja de la unidad 1: frecuencias e histograma, centro, dispersión, cuartiles y percentiles (con las dos ramas de la interpolación), forma, datos agrupados ponderados, interpolación sobre la acumulada y cercas de Tukey.
- [[formulario-probabilidad|Formulario — Probabilidad]] — hoja de la unidad 2: axiomas y consecuencias, conteo (permutaciones, variaciones, inclusión-exclusión, palomar), condicional y árbol, probabilidad total y Bayes (incluido el caso binario), independencia y sus complementos, fiabilidad serie/paralelo y patrones clásicos (cumpleaños, «al menos uno»).
- [[formulario-va-discretas|Formulario — Variables Aleatorias Discretas]] — hoja de la unidad 3: general de v.a.d., las dos convenciones de la geométrica y la binomial negativa (fracasos vs. ensayos), falta de memoria discreta, aproximaciones Poisson/hipergeométrica, tamaño de muestra mínimo y teoría de la decisión.
- [[formulario-funcion-de-va-y-bidimensionales|Formulario — Función de V.A. y Bidimensionales]] — hoja de la unidad 5: transformaciones $Y=g(X)$, transformada inversa, conjunta/marginales/condicionales, independencia, covarianza y correlación, y mezclas.
- [[formulario-procesos-estocasticos|Formulario — Procesos Estocásticos]] — hoja de la unidad 6: definiciones generales (Chapman-Kolmogorov, estacionariedad, Markov, proceso de conteo), caminata aleatoria, Bernoulli, Poisson con las ecuaciones de Kolmogorov, relación B↔P y cadenas de Markov (absorción, matriz Z y tiempos de primer paso).

