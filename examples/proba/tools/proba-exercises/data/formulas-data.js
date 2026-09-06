/* formulas-data.js — GENERADO por build-formulas.py. NO editar a mano.
   Fuente: wiki/formularios/*.md + curaduria en formulas-notas.json
   Regenerar:  python3 estudio/build-formulas.py            */
window.FORMULAS = {
 "generated": "2026-09-05",
 "items": [
  {
   "id": "1-probabilidad-axiomas-condicional--axiomas-de-kolmogorov",
   "unidad": "2",
   "seccion": "1 · Probabilidad — axiomas, condicional, Bayes, combinatoria",
   "subseccion": "Axiomas de Kolmogorov",
   "nombre": "Axiomas de Kolmogorov",
   "tex": "P(A)\\ge 0 \\qquad P(S)=1 \\qquad P\\!\\left(\\bigcup_{i=1}^{\\infty}E_i\\right)=\\sum_{i=1}^{\\infty}P(E_i)\\ \\ (E_i\\ \\text{m.e.})",
   "cuando": "Punto de partida para justificar cualquier propiedad de probabilidades; en el parcial aparece cuando piden demostrar una identidad de conjuntos.",
   "condiciones": [
    "eventos m.e."
   ],
   "slug": "axiomas-de-probabilidad",
   "ancla": "",
   "tags": [
    "probabilidad",
    "axiomas"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 49,
    "tipo": "bloque"
   }
  },
  {
   "id": "1-probabilidad-axiomas-condicional--complemento",
   "unidad": "2",
   "seccion": "1 · Probabilidad — axiomas, condicional, Bayes, combinatoria",
   "subseccion": "Consecuencias",
   "nombre": "Complemento",
   "tex": "P(A^c)=1-P(A)",
   "cuando": "Enunciados con «al menos uno» o «ninguno»: conviene pasar al complemento y restar de 1.",
   "condiciones": [],
   "slug": "axiomas-de-probabilidad",
   "ancla": "",
   "tags": [
    "probabilidad",
    "complemento"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 55,
    "tipo": "tabla"
   }
  },
  {
   "id": "1-probabilidad-axiomas-condicional--suceso-imposible",
   "unidad": "2",
   "seccion": "1 · Probabilidad — axiomas, condicional, Bayes, combinatoria",
   "subseccion": "Consecuencias",
   "nombre": "Suceso imposible",
   "tex": "P(\\emptyset)=0",
   "cuando": "Para descartar casos vacíos al armar una partición del espacio muestral.",
   "condiciones": [],
   "slug": "axiomas-de-probabilidad",
   "ancla": "",
   "tags": [
    "probabilidad"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 56,
    "tipo": "tabla"
   }
  },
  {
   "id": "1-probabilidad-axiomas-condicional--monotonia",
   "unidad": "2",
   "seccion": "1 · Probabilidad — axiomas, condicional, Bayes, combinatoria",
   "subseccion": "Consecuencias",
   "nombre": "Monotonía",
   "tex": "A\\subseteq B\\Rightarrow P(A)\\le P(B)",
   "cuando": "Cuando un evento está contenido en otro y hay que comparar o acotar probabilidades sin calcularlas.",
   "condiciones": [
    "A ⊆ B"
   ],
   "slug": "axiomas-de-probabilidad",
   "ancla": "",
   "tags": [
    "probabilidad",
    "cotas"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 57,
    "tipo": "tabla"
   }
  },
  {
   "id": "1-probabilidad-axiomas-condicional--union-incl-excl-2",
   "unidad": "2",
   "seccion": "1 · Probabilidad — axiomas, condicional, Bayes, combinatoria",
   "subseccion": "Consecuencias",
   "nombre": "Unión (incl.–excl. 2)",
   "tex": "P(A\\cup B)=P(A)+P(B)-P(A\\cap B)",
   "cuando": "Piden P(A o B) con eventos que pueden ocurrir a la vez; hay que restar la intersección para no contarla dos veces.",
   "condiciones": [
    "no m.e."
   ],
   "slug": "axiomas-de-probabilidad",
   "ancla": "",
   "tags": [
    "probabilidad",
    "union"
   ],
   "esencial": true,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 58,
    "tipo": "tabla"
   }
  },
  {
   "id": "1-probabilidad-axiomas-condicional--union-m-e",
   "unidad": "2",
   "seccion": "1 · Probabilidad — axiomas, condicional, Bayes, combinatoria",
   "subseccion": "Consecuencias",
   "nombre": "Unión m.e.",
   "tex": "P(A\\cup B)=P(A)+P(B)",
   "cuando": "Union de eventos que no pueden ocurrir juntos (mutuamente excluyentes): las probabilidades se suman directo.",
   "condiciones": [
    "m.e."
   ],
   "slug": "axiomas-de-probabilidad",
   "ancla": "",
   "tags": [
    "probabilidad",
    "union"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 59,
    "tipo": "tabla"
   }
  },
  {
   "id": "1-probabilidad-axiomas-condicional--inclusion-exclusion-3-eventos",
   "unidad": "2",
   "seccion": "1 · Probabilidad — axiomas, condicional, Bayes, combinatoria",
   "subseccion": "Consecuencias",
   "nombre": "Inclusión-exclusión (3 eventos)",
   "tex": "P(A\\cup B\\cup C)=P(A)+P(B)+P(C)-P(A\\cap B)-P(A\\cap C)-P(B\\cap C)+P(A\\cap B\\cap C).",
   "cuando": "Tres eventos superpuestos (diagramas de Venn con tres círculos): sumar simples, restar pares, sumar la triple.",
   "condiciones": [
    "no m.e."
   ],
   "slug": "axiomas-de-probabilidad",
   "ancla": "",
   "tags": [
    "probabilidad",
    "union"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 62,
    "tipo": "bloque"
   }
  },
  {
   "id": "1-probabilidad-axiomas-condicional--leyes-de-de-morgan",
   "unidad": "2",
   "seccion": "1 · Probabilidad — axiomas, condicional, Bayes, combinatoria",
   "subseccion": "Leyes de De Morgan",
   "nombre": "Leyes de De Morgan",
   "tex": "\\overline{C\\cup D}=\\overline{C}\\cap\\overline{D} \\qquad \\overline{C\\cap D}=\\overline{C}\\cup\\overline{D} \\qquad \\overline{\\bigcup_i A_i}=\\bigcap_i\\overline{A_i} \\qquad \\overline{\\bigcap_i A_i}=\\bigcup_i\\overline{A_i}",
   "variante": "conjuntos",
   "cuando": "Para reescribir «ninguno de» como complemento de una unión, o «no todos» como complemento de una intersección.",
   "condiciones": [],
   "slug": "leyes-de-de-morgan",
   "ancla": "",
   "tags": [
    "probabilidad",
    "conjuntos"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 66,
    "tipo": "bloque"
   }
  },
  {
   "id": "1-probabilidad-axiomas-condicional--leyes-de-de-morgan-2",
   "unidad": "2",
   "seccion": "1 · Probabilidad — axiomas, condicional, Bayes, combinatoria",
   "subseccion": "Leyes de De Morgan",
   "nombre": "Leyes de De Morgan",
   "tex": "P(\\overline{C}\\cap\\overline{D})=1-P(C\\cup D) \\qquad P(\\overline{C}\\cup\\overline{D})=1-P(C\\cap D)",
   "variante": "probabilidades",
   "cuando": "Versión en probabilidades: convierte P(ninguno) y P(no ambos) en algo que se calcula con la unión o la intersección ya conocidas.",
   "condiciones": [],
   "slug": "leyes-de-de-morgan",
   "ancla": "",
   "tags": [
    "probabilidad",
    "conjuntos"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 68,
    "tipo": "bloque"
   }
  },
  {
   "id": "1-probabilidad-axiomas-condicional--regla-de-laplace",
   "unidad": "2",
   "seccion": "1 · Probabilidad — axiomas, condicional, Bayes, combinatoria",
   "subseccion": "Regla de Laplace",
   "nombre": "Regla de Laplace",
   "tex": "P(A)=\\frac{\\text{casos favorables}}{\\text{casos posibles}}=\\frac{|A|}{|S|}.",
   "cuando": "Enunciados de dados, cartas, bolillas o sorteos donde todos los resultados son igualmente probables: contar favorables sobre posibles.",
   "condiciones": [
    "S finito",
    "equiprobables"
   ],
   "slug": "regla-de-laplace",
   "ancla": "",
   "tags": [
    "probabilidad",
    "conteo"
   ],
   "esencial": true,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 75,
    "tipo": "bloque"
   }
  },
  {
   "id": "1-probabilidad-axiomas-condicional--suma",
   "unidad": "2",
   "seccion": "1 · Probabilidad — axiomas, condicional, Bayes, combinatoria",
   "subseccion": "Combinatoria",
   "nombre": "Suma",
   "tex": "\\left|\\bigcup_i A_i\\right|=\\sum_i|A_i|",
   "cuando": "Conteo de casos favorables cuando las opciones se excluyen entre sí: «o» excluyente suma los tamaños.",
   "condiciones": [
    "conjuntos disjuntos"
   ],
   "slug": "tecnica-conteo-combinatoria",
   "ancla": "",
   "tags": [
    "combinatoria",
    "conteo"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 79,
    "tipo": "parrafo"
   }
  },
  {
   "id": "1-probabilidad-axiomas-condicional--producto",
   "unidad": "2",
   "seccion": "1 · Probabilidad — axiomas, condicional, Bayes, combinatoria",
   "subseccion": "Combinatoria",
   "nombre": "Producto",
   "tex": "\\left|A_1\\times\\cdots\\times A_n\\right|=\\prod_i|A_i|",
   "cuando": "Conteo por etapas: «primero esto y luego aquello» multiplica las cantidades de cada etapa.",
   "condiciones": [
    "etapas independientes"
   ],
   "slug": "tecnica-conteo-combinatoria",
   "ancla": "",
   "tags": [
    "combinatoria",
    "conteo"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 79,
    "tipo": "parrafo"
   }
  },
  {
   "id": "1-probabilidad-axiomas-condicional--sin-repeticion-importa-el-orden",
   "unidad": "2",
   "seccion": "1 · Probabilidad — axiomas, condicional, Bayes, combinatoria",
   "subseccion": "Combinatoria",
   "nombre": "Sin repetición",
   "tex": "\\dfrac{n!}{(n-r)!}\\text{ (variaciones)}",
   "variante": "Importa el orden",
   "cuando": "Se eligen r de n sin reponer y el orden importa (podios, contraseñas sin repetir, ordenamientos parciales).",
   "condiciones": [
    "sin reposición",
    "importa el orden"
   ],
   "slug": "tecnica-conteo-combinatoria",
   "ancla": "",
   "tags": [
    "conteo",
    "combinatoria"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 85,
    "tipo": "tabla"
   }
  },
  {
   "id": "1-probabilidad-axiomas-condicional--sin-repeticion-no-importa-el",
   "unidad": "2",
   "seccion": "1 · Probabilidad — axiomas, condicional, Bayes, combinatoria",
   "subseccion": "Combinatoria",
   "nombre": "Sin repetición",
   "tex": "\\dbinom{n}{r}=\\dfrac{n!}{r!\\,(n-r)!}\\text{ (combinaciones)}",
   "variante": "No importa el orden",
   "cuando": "Se eligen r de n sin reponer y el orden no importa (comités, manos de cartas, muestras): el número combinatorio.",
   "condiciones": [
    "sin reposición",
    "no importa el orden"
   ],
   "slug": "tecnica-conteo-combinatoria",
   "ancla": "",
   "tags": [
    "conteo",
    "combinatoria"
   ],
   "esencial": true,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 85,
    "tipo": "tabla"
   }
  },
  {
   "id": "1-probabilidad-axiomas-condicional--con-repeticion-importa-el-orden",
   "unidad": "2",
   "seccion": "1 · Probabilidad — axiomas, condicional, Bayes, combinatoria",
   "subseccion": "Combinatoria",
   "nombre": "Con repetición",
   "tex": "n^{r}",
   "variante": "Importa el orden",
   "cuando": "Cada una de las r posiciones se elige libremente entre n opciones y se puede repetir (patentes, claves, lanzamientos).",
   "condiciones": [
    "con reposición",
    "importa el orden"
   ],
   "slug": "tecnica-conteo-combinatoria",
   "ancla": "",
   "tags": [
    "conteo",
    "combinatoria"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 86,
    "tipo": "tabla"
   }
  },
  {
   "id": "1-probabilidad-axiomas-condicional--con-repeticion-no-importa-el",
   "unidad": "2",
   "seccion": "1 · Probabilidad — axiomas, condicional, Bayes, combinatoria",
   "subseccion": "Combinatoria",
   "nombre": "Con repetición",
   "tex": "\\dbinom{n+r-1}{r}",
   "variante": "No importa el orden",
   "cuando": "Repartos de r objetos idénticos en n categorías («cuantas formas de repartir») donde solo importa cuántos hay de cada tipo.",
   "condiciones": [
    "con reposición",
    "no importa el orden"
   ],
   "slug": "tecnica-conteo-combinatoria",
   "ancla": "",
   "tags": [
    "conteo",
    "combinatoria"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 86,
    "tipo": "tabla"
   }
  },
  {
   "id": "1-probabilidad-axiomas-condicional--identidades",
   "unidad": "2",
   "seccion": "1 · Probabilidad — axiomas, condicional, Bayes, combinatoria",
   "subseccion": "Combinatoria",
   "nombre": "Identidades",
   "tex": "\\dbinom{n}{r}=\\dbinom{n}{n-r}\\text{; }\\dbinom{n+1}{r}=\\dbinom{n}{r}+\\dbinom{n}{r-1}\\text{ (Pascal); }\\displaystyle\\sum_{k=0}^{n}\\binom{n}{k}=2^{n}\\text{; }\\displaystyle(x+y)^n=\\sum_{k=0}^{n}\\binom{n}{k}x^k y^{n-k}",
   "cuando": "Simplificar sumas de números combinatorios: simetría, regla de Pascal, suma total 2^n y binomio de Newton.",
   "condiciones": [],
   "slug": "tecnica-conteo-combinatoria",
   "ancla": "",
   "tags": [
    "combinatoria",
    "identidades"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 88,
    "tipo": "parrafo"
   }
  },
  {
   "id": "1-probabilidad-axiomas-condicional--probabilidad-condicional",
   "unidad": "2",
   "seccion": "1 · Probabilidad — axiomas, condicional, Bayes, combinatoria",
   "subseccion": "Probabilidad condicional",
   "nombre": "Probabilidad condicional",
   "tex": "P(D\\mid C)=\\frac{P(D\\cap C)}{P(C)}\\quad (P(C)\\neq 0)",
   "cuando": "El enunciado da información parcial: «sabiendo que», «dado que», «entre los que». Se reduce el espacio muestral al evento condicionante.",
   "condiciones": [
    "P(C) > 0"
   ],
   "slug": "probabilidad-condicional",
   "ancla": "",
   "tags": [
    "probabilidad",
    "condicional"
   ],
   "esencial": true,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 94,
    "tipo": "bloque"
   }
  },
  {
   "id": "1-probabilidad-axiomas-condicional--regla-del-producto",
   "unidad": "2",
   "seccion": "1 · Probabilidad — axiomas, condicional, Bayes, combinatoria",
   "subseccion": "Probabilidad condicional",
   "nombre": "Regla del producto",
   "tex": "P(D\\cap C)=P(D\\mid C)\\,P(C)",
   "cuando": "Experimentos en etapas (extracciones sucesivas sin reposición): la probabilidad conjunta se arma multiplicando por etapas.",
   "condiciones": [
    "etapas"
   ],
   "slug": "probabilidad-condicional",
   "ancla": "",
   "tags": [
    "probabilidad",
    "condicional"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 97,
    "tipo": "bloque"
   }
  },
  {
   "id": "1-probabilidad-axiomas-condicional--independencia",
   "unidad": "2",
   "seccion": "1 · Probabilidad — axiomas, condicional, Bayes, combinatoria",
   "subseccion": "Independencia",
   "nombre": "Independencia",
   "tex": "A,B\\ \\text{indep.}\\iff P(A\\cap B)=P(A)\\,P(B) \\qquad (P(C)\\neq 0)\\!:\\ C,D\\ \\text{indep.}\\iff P(D\\mid C)=P(D)",
   "cuando": "Para verificar si dos eventos son independientes, o para multiplicar probabilidades cuando el enunciado dice que lo son.",
   "condiciones": [
    "independientes"
   ],
   "slug": "independencia",
   "ancla": "",
   "tags": [
    "probabilidad",
    "independencia"
   ],
   "esencial": true,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 101,
    "tipo": "bloque"
   }
  },
  {
   "id": "1-probabilidad-axiomas-condicional--coleccion",
   "unidad": "2",
   "seccion": "1 · Probabilidad — axiomas, condicional, Bayes, combinatoria",
   "subseccion": "Independencia",
   "nombre": "Colección",
   "tex": "P\\!\\left(\\bigcap_k A_k\\right)=\\prod_k P(A_k)",
   "cuando": "Independencia de más de dos eventos: la probabilidad de que ocurran todos es el producto de las individuales.",
   "condiciones": [
    "independientes"
   ],
   "slug": "independencia",
   "ancla": "",
   "tags": [
    "probabilidad",
    "independencia"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 102,
    "tipo": "parrafo"
   }
  },
  {
   "id": "1-probabilidad-axiomas-condicional--particion-de",
   "unidad": "2",
   "seccion": "1 · Probabilidad — axiomas, condicional, Bayes, combinatoria",
   "subseccion": "Probabilidad total y Bayes",
   "nombre": "$\\{A_k\\}$ partición de $S$",
   "tex": "\\text{m.e. (}A_k\\cap A_j=\\emptyset\\text{) y cubren (}S=\\bigcup_k A_k\\text{). Caso simple: }\\{A,A^c\\}",
   "cuando": "Verificar que los eventos elegidos forman una partición antes de aplicar probabilidad total o Bayes.",
   "condiciones": [
    "eventos m.e.",
    "cubren S"
   ],
   "slug": "probabilidad-total-y-bayes",
   "ancla": "partición",
   "tags": [
    "probabilidad",
    "particion",
    "bayes"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 108,
    "tipo": "parrafo"
   }
  },
  {
   "id": "1-probabilidad-axiomas-condicional--probabilidad-total",
   "unidad": "2",
   "seccion": "1 · Probabilidad — axiomas, condicional, Bayes, combinatoria",
   "subseccion": "Probabilidad total y Bayes",
   "nombre": "Probabilidad total",
   "tex": "P(B)=\\sum_k P(B\\cap A_k)=\\sum_k P(B\\mid A_k)\\,P(A_k).",
   "cuando": "El experimento se parte en casos excluyentes (máquinas, urnas, turnos) y se conoce la probabilidad dentro de cada caso: se promedia ponderando por el peso de cada caso.",
   "condiciones": [
    "partición de S"
   ],
   "slug": "probabilidad-total-y-bayes",
   "ancla": "fórmula-de-la-probabilidad-total",
   "tags": [
    "probabilidad",
    "bayes"
   ],
   "esencial": true,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 111,
    "tipo": "bloque"
   }
  },
  {
   "id": "1-probabilidad-axiomas-condicional--teorema-de-bayes",
   "unidad": "2",
   "seccion": "1 · Probabilidad — axiomas, condicional, Bayes, combinatoria",
   "subseccion": "Probabilidad total y Bayes",
   "nombre": "Teorema de Bayes",
   "tex": "P(A_i\\mid B)=\\frac{P(B\\mid A_i)\\,P(A_i)}{\\sum_k P(B\\mid A_k)\\,P(A_k)}.",
   "cuando": "Se observa el efecto y preguntan por la causa («salió defectuoso, cuál es la probabilidad de que venga de la máquina 1»): invertir el condicionamiento.",
   "condiciones": [
    "partición de S",
    "a priori conocidas"
   ],
   "slug": "probabilidad-total-y-bayes",
   "ancla": "teorema-de-bayes",
   "tags": [
    "probabilidad",
    "bayes"
   ],
   "esencial": true,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 114,
    "tipo": "bloque"
   }
  },
  {
   "id": "2-variable-aleatoria-discreta--pmf-definicion",
   "unidad": "3",
   "seccion": "2 · Variable aleatoria discreta (V.A.D.)",
   "subseccion": "Objetos que describen la V.A.D.",
   "nombre": "PMF $p_X(k)$",
   "tex": "p_X(k)=P(X=k)",
   "variante": "Definición",
   "cuando": "Definición de la función de masa: da la probabilidad de cada valor aislado del recorrido.",
   "condiciones": [
    "X discreta"
   ],
   "slug": "funcion-de-distribucion-acumulada",
   "ancla": "",
   "tags": [
    "vad",
    "pmf"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 124,
    "tipo": "tabla"
   }
  },
  {
   "id": "2-variable-aleatoria-discreta--pmf-propiedad-clave",
   "unidad": "3",
   "seccion": "2 · Variable aleatoria discreta (V.A.D.)",
   "subseccion": "Objetos que describen la V.A.D.",
   "nombre": "PMF $p_X(k)$",
   "tex": "\\displaystyle\\sum_{k\\in\\mathcal{R}_X}p_X(k)=1\\text{; vale }0\\text{ fuera de }\\mathcal{R}_X",
   "variante": "Propiedad clave",
   "cuando": "Condición de normalización: se usa para despejar la constante de una PMF con parámetro desconocido.",
   "condiciones": [
    "X discreta"
   ],
   "slug": "funcion-de-distribucion-acumulada",
   "ancla": "",
   "tags": [
    "vad",
    "pmf"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 124,
    "tipo": "tabla"
   }
  },
  {
   "id": "2-variable-aleatoria-discreta--fda-definicion",
   "unidad": "3",
   "seccion": "2 · Variable aleatoria discreta (V.A.D.)",
   "subseccion": "Objetos que describen la V.A.D.",
   "nombre": "FDA $F_X(k)$",
   "tex": "F_X(k)=P(X\\le k)=\\displaystyle\\sum_{y\\le k}p_X(y)",
   "variante": "Definición",
   "cuando": "Acumula la masa hasta k; útil cuando piden P(X ≤ k) o cuando dan la FDA en forma escalonada.",
   "condiciones": [
    "X discreta"
   ],
   "slug": "funcion-de-distribucion-acumulada",
   "ancla": "",
   "tags": [
    "vad",
    "fda"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 125,
    "tipo": "tabla"
   }
  },
  {
   "id": "2-variable-aleatoria-discreta--fda-propiedad-clave",
   "unidad": "3",
   "seccion": "2 · Variable aleatoria discreta (V.A.D.)",
   "subseccion": "Objetos que describen la V.A.D.",
   "nombre": "FDA $F_X(k)$",
   "tex": "F_X(k)-\\lim_{x\\to k^-}F_X(x)=p_X(k)",
   "variante": "Propiedad clave",
   "cuando": "Forma de la FDA discreta: escalonada, con un salto en cada valor del recorrido igual a su probabilidad puntual.",
   "condiciones": [
    "X discreta"
   ],
   "slug": "funcion-de-distribucion-acumulada",
   "ancla": "",
   "tags": [
    "vad",
    "fda"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 125,
    "tipo": "tabla"
   }
  },
  {
   "id": "2-variable-aleatoria-discreta--esperanza-definicion",
   "unidad": "3",
   "seccion": "2 · Variable aleatoria discreta (V.A.D.)",
   "subseccion": "Objetos que describen la V.A.D.",
   "nombre": "Esperanza $E[X]$",
   "tex": "E[X]=\\mu_X=\\displaystyle\\sum_{k}k\\,p_X(k)",
   "variante": "Definición",
   "cuando": "Valor medio de una variable discreta: se pondera cada valor por su probabilidad.",
   "condiciones": [
    "X discreta"
   ],
   "slug": "esperanza",
   "ancla": "",
   "tags": [
    "vad",
    "esperanza"
   ],
   "esencial": true,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 126,
    "tipo": "tabla"
   }
  },
  {
   "id": "2-variable-aleatoria-discreta--varianza-definicion",
   "unidad": "3",
   "seccion": "2 · Variable aleatoria discreta (V.A.D.)",
   "subseccion": "Objetos que describen la V.A.D.",
   "nombre": "Varianza $V(X)$",
   "tex": "V(X)=\\sigma_X^2=E[X^2]-\\big(E[X]\\big)^2",
   "variante": "Definición",
   "cuando": "Forma práctica de calcular la varianza en el parcial: primero E[X²], después restar el cuadrado de la media.",
   "condiciones": [],
   "slug": "varianza",
   "ancla": "",
   "tags": [
    "vad",
    "varianza"
   ],
   "esencial": true,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 127,
    "tipo": "tabla"
   }
  },
  {
   "id": "2-variable-aleatoria-discreta--varianza-propiedad-clave",
   "unidad": "3",
   "seccion": "2 · Variable aleatoria discreta (V.A.D.)",
   "subseccion": "Objetos que describen la V.A.D.",
   "nombre": "Varianza $V(X)$",
   "tex": "\\text{dispersión; }\\sigma_X=\\sqrt{V(X)}",
   "variante": "Propiedad clave",
   "cuando": "Relación entre varianza y desvío; recordar que el desvío tiene las unidades de los datos.",
   "condiciones": [],
   "slug": "varianza",
   "ancla": "",
   "tags": [
    "vad",
    "varianza"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 127,
    "tipo": "tabla"
   }
  },
  {
   "id": "2-variable-aleatoria-discreta--fgm-definicion",
   "unidad": "3",
   "seccion": "2 · Variable aleatoria discreta (V.A.D.)",
   "subseccion": "Objetos que describen la V.A.D.",
   "nombre": "FGM $M_X(t)$",
   "tex": "M_X(t)=E[e^{tX}]=\\displaystyle\\sum_k e^{tk}p_X(k)",
   "variante": "Definición",
   "cuando": "Definición de la FGM; sirve para identificar la distribución o para sacar momentos derivando en t = 0.",
   "condiciones": [
    "existe en un entorno de 0"
   ],
   "slug": "funcion-generadora-de-momentos",
   "ancla": "",
   "tags": [
    "vad",
    "fgm"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 128,
    "tipo": "tabla"
   }
  },
  {
   "id": "2-variable-aleatoria-discreta--pmf-y-fda",
   "unidad": "3",
   "seccion": "2 · Variable aleatoria discreta (V.A.D.)",
   "subseccion": "PMF y FDA",
   "nombre": "PMF y FDA",
   "tex": "p_X(k)=P(X=k),\\qquad \\sum_{k\\in\\mathcal{R}_X}p_X(k)=1,\\qquad F_X(k)=P(X\\le k)=\\!\\!\\sum_{y\\in\\mathcal{R}_X,\\,y\\le k}\\!\\!p_X(y)",
   "cuando": "Resumen de la relación PMF ↔ FDA en el caso discreto; útil como chequeo rápido de que una PMF es válida.",
   "condiciones": [
    "X discreta"
   ],
   "slug": "funcion-de-distribucion-acumulada",
   "ancla": "",
   "tags": [
    "vad",
    "pmf",
    "fda"
   ],
   "esencial": true,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 132,
    "tipo": "bloque"
   }
  },
  {
   "id": "2-variable-aleatoria-discreta--fda-propiedades",
   "unidad": "3",
   "seccion": "2 · Variable aleatoria discreta (V.A.D.)",
   "subseccion": "PMF y FDA",
   "nombre": "FDA — propiedades",
   "tex": "F_X\\ \\text{no decreciente y continua a derecha},\\qquad \\lim_{k\\to-\\infty}F_X(k)=0,\\qquad \\lim_{k\\to+\\infty}F_X(k)=1",
   "cuando": "Chequear que una función propuesta sea una FDA válida, o describir la forma escalonada de la FDA discreta.",
   "condiciones": [
    "X discreta"
   ],
   "slug": "funcion-de-distribucion-acumulada",
   "ancla": "",
   "tags": [
    "vad",
    "fda"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 134,
    "tipo": "parrafo"
   }
  },
  {
   "id": "2-variable-aleatoria-discreta--recuperar-la-pmf-y-probabilidades-de",
   "unidad": "3",
   "seccion": "2 · Variable aleatoria discreta (V.A.D.)",
   "subseccion": "PMF y FDA",
   "nombre": "Recuperar la PMF y probabilidades de intervalos",
   "tex": "p_X(k)=F_X(k)-\\lim_{x\\to k^-}F_X(x),\\qquad P(X<k)=F_X(k)-p_X(k)",
   "variante": "probabilidades de intervalos",
   "cuando": "Dan la FDA (escalonada o por tramos) y piden la probabilidad de un valor puntual o de un estricto <: el salto de la FDA es la masa.",
   "condiciones": [
    "X discreta"
   ],
   "slug": "funcion-de-distribucion-acumulada",
   "ancla": "",
   "tags": [
    "vad",
    "fda"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 138,
    "tipo": "bloque"
   }
  },
  {
   "id": "2-variable-aleatoria-discreta--recuperar-la-pmf-y-probabilidades-de-2",
   "unidad": "3",
   "seccion": "2 · Variable aleatoria discreta (V.A.D.)",
   "subseccion": "PMF y FDA",
   "nombre": "Recuperar la PMF y probabilidades de intervalos",
   "tex": "P(a<X\\le b)=F_X(b)-F_X(a),\\qquad P(X>k)=1-F_X(k)",
   "variante": "PMF desde la FDA",
   "cuando": "Dan la FDA y piden la probabilidad de un intervalo o de una cola: se restan valores de F.",
   "condiciones": [
    "X discreta"
   ],
   "slug": "funcion-de-distribucion-acumulada",
   "ancla": "",
   "tags": [
    "vad",
    "fda"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 139,
    "tipo": "bloque"
   }
  },
  {
   "id": "2-variable-aleatoria-discreta--esperanza",
   "unidad": "3",
   "seccion": "2 · Variable aleatoria discreta (V.A.D.)",
   "subseccion": "Esperanza",
   "nombre": "Esperanza",
   "tex": "E[X]=\\mu_X=\\sum_{k\\in\\mathcal{R}_X}k\\,p_X(k)",
   "cuando": "Cálculo directo de la media a partir de la tabla de la PMF.",
   "condiciones": [
    "X discreta"
   ],
   "slug": "esperanza",
   "ancla": "",
   "tags": [
    "vad",
    "esperanza"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 145,
    "tipo": "bloque"
   }
  },
  {
   "id": "2-variable-aleatoria-discreta--ley-del-estadistico-inconsciente",
   "unidad": "3",
   "seccion": "2 · Variable aleatoria discreta (V.A.D.)",
   "subseccion": "Esperanza",
   "nombre": "Ley del estadístico inconsciente",
   "tex": "E[g(X)]=\\sum_{k\\in\\mathcal{R}_X}g(k)\\,p_X(k)",
   "cuando": "Piden E de una función de X (ganancia, costo, X²) y no hace falta hallar la distribución de g(X): se pondera g(k) con la PMF de X.",
   "condiciones": [
    "X discreta"
   ],
   "slug": "esperanza",
   "ancla": "",
   "tags": [
    "vad",
    "esperanza"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 149,
    "tipo": "bloque"
   }
  },
  {
   "id": "2-variable-aleatoria-discreta--linealidad",
   "unidad": "3",
   "seccion": "2 · Variable aleatoria discreta (V.A.D.)",
   "subseccion": "Esperanza",
   "nombre": "Linealidad",
   "tex": "E[c]=c,\\qquad E[aX+b]=a\\,E[X]+b,\\qquad E[aX+bY+c]=a\\,E[X]+b\\,E[Y]+c",
   "cuando": "Cambios de escala y unidades (precios, temperaturas) o suma de varias variables: la esperanza es lineal aunque haya dependencia.",
   "condiciones": [
    "vale sin independencia"
   ],
   "slug": "independencia",
   "ancla": "",
   "tags": [
    "vad",
    "esperanza"
   ],
   "esencial": true,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 153,
    "tipo": "bloque"
   }
  },
  {
   "id": "2-variable-aleatoria-discreta--varianza-y-momentos",
   "unidad": "3",
   "seccion": "2 · Variable aleatoria discreta (V.A.D.)",
   "subseccion": "Varianza y momentos",
   "nombre": "Varianza y momentos",
   "tex": "V(X)=\\sigma_X^2=E\\!\\big[(X-\\mu_X)^2\\big]=E[X^2]-\\big(E[X]\\big)^2,\\qquad E[X^2]=\\sum_{k}k^2\\,p_X(k)",
   "cuando": "Definición y fórmula de cálculo de la varianza junto con el segundo momento.",
   "condiciones": [],
   "slug": "independencia",
   "ancla": "",
   "tags": [
    "vad",
    "varianza"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 159,
    "tipo": "bloque"
   }
  },
  {
   "id": "2-variable-aleatoria-discreta--propiedades",
   "unidad": "3",
   "seccion": "2 · Variable aleatoria discreta (V.A.D.)",
   "subseccion": "Varianza y momentos",
   "nombre": "Propiedades",
   "tex": "V(c)=0,\\qquad V(aX+c)=a^2\\,V(X)\\;\\Rightarrow\\;\\sigma(aX+c)=|a|\\,\\sigma(X)",
   "cuando": "Cambio de escala y de origen: sumar una constante no cambia la dispersión, multiplicar la escala al cuadrado.",
   "condiciones": [],
   "slug": "independencia",
   "ancla": "",
   "tags": [
    "vad",
    "varianza"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 163,
    "tipo": "bloque"
   }
  },
  {
   "id": "2-variable-aleatoria-discreta--momentos",
   "unidad": "3",
   "seccion": "2 · Variable aleatoria discreta (V.A.D.)",
   "subseccion": "Varianza y momentos",
   "nombre": "Momentos",
   "tex": "E[X^k]=\\displaystyle\\sum_x x^k p_X(x)",
   "cuando": "Piden el momento de orden k (por ejemplo E[X^2] para calcular la varianza).",
   "condiciones": [
    "X discreta"
   ],
   "slug": "independencia",
   "ancla": "",
   "tags": [
    "vad",
    "momentos"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 167,
    "tipo": "parrafo"
   }
  },
  {
   "id": "2-variable-aleatoria-discreta--centrados",
   "unidad": "3",
   "seccion": "2 · Variable aleatoria discreta (V.A.D.)",
   "subseccion": "Varianza y momentos",
   "nombre": "Centrados",
   "tex": "\\mu_k=E\\!\\big[(X-\\mu_X)^k\\big]",
   "cuando": "Momentos respecto de la media: k = 2 da la varianza, k = 3 el sesgo y k = 4 la curtosis.",
   "condiciones": [],
   "slug": "independencia",
   "ancla": "",
   "tags": [
    "vad",
    "momentos"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 167,
    "tipo": "parrafo"
   }
  },
  {
   "id": "2-variable-aleatoria-discreta--asimetria-y-curtosis",
   "unidad": "3",
   "seccion": "2 · Variable aleatoria discreta (V.A.D.)",
   "subseccion": "Asimetría y curtosis",
   "nombre": "Asimetría y curtosis",
   "tex": "\\gamma(X)=\\frac{E\\!\\big[(X-\\mu_X)^3\\big]}{\\sigma_X^3},\\qquad \\kappa(X)=\\frac{E\\!\\big[(X-\\mu_X)^4\\big]}{\\sigma_X^4}-3",
   "cuando": "Piden describir la forma de la distribución: signo del sesgo y peso de las colas comparado con la normal.",
   "condiciones": [],
   "slug": "asimetria-y-curtosis",
   "ancla": "",
   "tags": [
    "forma",
    "momentos"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 173,
    "tipo": "bloque"
   }
  },
  {
   "id": "2-variable-aleatoria-discreta--funcion-generadora-de-momentos-fgm",
   "unidad": "3",
   "seccion": "2 · Variable aleatoria discreta (V.A.D.)",
   "subseccion": "Función generadora de momentos (FGM)",
   "nombre": "Función generadora de momentos (FGM)",
   "tex": "M_X(t)=E\\!\\big[e^{tX}\\big]=\\sum_{k\\in\\mathcal{R}_X}e^{tk}\\,p_X(k)",
   "cuando": "Definición de la FGM en el caso discreto, como suma ponderada de exponenciales.",
   "condiciones": [
    "X discreta"
   ],
   "slug": "funcion-generadora-de-momentos",
   "ancla": "",
   "tags": [
    "vad",
    "fgm"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 179,
    "tipo": "bloque"
   }
  },
  {
   "id": "2-variable-aleatoria-discreta--genera-momentos",
   "unidad": "3",
   "seccion": "2 · Variable aleatoria discreta (V.A.D.)",
   "subseccion": "Función generadora de momentos (FGM)",
   "nombre": "Genera momentos",
   "tex": "E[X^k]=M_X^{(k)}(0)\\text{; }\\;E[X]=M_X'(0)\\text{, }\\;E[X^2]=M_X''(0)",
   "cuando": "Dan la FGM y piden la media o el segundo momento: se deriva y se evalúa en t = 0.",
   "condiciones": [
    "FGM conocida"
   ],
   "slug": "funcion-generadora-de-momentos",
   "ancla": "propiedad-de-generación-de-momentos",
   "tags": [
    "fgm",
    "momentos"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 183,
    "tipo": "tabla"
   }
  },
  {
   "id": "2-variable-aleatoria-discreta--varianza-via-fgm",
   "unidad": "3",
   "seccion": "2 · Variable aleatoria discreta (V.A.D.)",
   "subseccion": "Función generadora de momentos (FGM)",
   "nombre": "Varianza vía FGM",
   "tex": "V(X)=M_X''(0)-\\big(M_X'(0)\\big)^2",
   "cuando": "Dan la FGM y piden la varianza: segunda derivada menos el cuadrado de la primera, ambas en 0.",
   "condiciones": [
    "FGM conocida"
   ],
   "slug": "funcion-generadora-de-momentos",
   "ancla": "",
   "tags": [
    "fgm",
    "varianza"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 184,
    "tipo": "tabla"
   }
  },
  {
   "id": "2-variable-aleatoria-discreta--caracteriza",
   "unidad": "3",
   "seccion": "2 · Variable aleatoria discreta (V.A.D.)",
   "subseccion": "Función generadora de momentos (FGM)",
   "nombre": "Caracteriza",
   "tex": "M_X\\equiv M_Y\\ \\text{en un entorno de }0\\ \\Longrightarrow\\ X\\overset{d}{=}Y",
   "cuando": "Argumento típico de parcial: si la FGM coincide con la de una familia conocida, la variable es de esa familia.",
   "condiciones": [],
   "slug": "funcion-generadora-de-momentos",
   "ancla": "",
   "tags": [
    "fgm"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 185,
    "tipo": "tabla"
   }
  },
  {
   "id": "2-variable-aleatoria-discreta--transformacion-afin",
   "unidad": "3",
   "seccion": "2 · Variable aleatoria discreta (V.A.D.)",
   "subseccion": "Función generadora de momentos (FGM)",
   "nombre": "Transformación afín",
   "tex": "M_{aX+b}(t)=e^{bt}\\,M_X(at)",
   "cuando": "Se reescala la variable (Y = aX + b) y hay que obtener la FGM de la nueva.",
   "condiciones": [],
   "slug": "funcion-generadora-de-momentos",
   "ancla": "",
   "tags": [
    "fgm",
    "transformacion"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 186,
    "tipo": "tabla"
   }
  },
  {
   "id": "2-variable-aleatoria-discreta--suma-de-independientes",
   "unidad": "3",
   "seccion": "2 · Variable aleatoria discreta (V.A.D.)",
   "subseccion": "Función generadora de momentos (FGM)",
   "nombre": "Suma de independientes",
   "tex": "X\\perp Y\\Rightarrow M_{X+Y}(t)=M_X(t)\\cdot M_Y(t)",
   "cuando": "Suma de variables independientes: multiplicar FGM suele identificar la familia sin hacer la convolución.",
   "condiciones": [
    "independientes"
   ],
   "slug": "funcion-generadora-de-momentos",
   "ancla": "",
   "tags": [
    "fgm",
    "suma"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 187,
    "tipo": "tabla"
   }
  },
  {
   "id": "3-distribuciones-discretas-tabla--bernoullip-soporte",
   "unidad": "3",
   "seccion": "3 · Distribuciones discretas (tabla)",
   "subseccion": "",
   "nombre": "$\\text{Bernoulli}(p)$",
   "tex": "\\{0,1\\}",
   "variante": "Soporte $\\mathcal{R}_X$",
   "cuando": "Un único ensayo con dos resultados y probabilidad p de éxito; es el ladrillo de todas las de conteo. Esta celda da el recorrido, que fija los límites de la suma.",
   "condiciones": [
    "1 ensayo",
    "dos resultados"
   ],
   "slug": "distribucion-bernoulli",
   "ancla": "",
   "tags": [
    "distribucion",
    "discreta",
    "bernoulli",
    "tabla"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 197,
    "tipo": "tabla"
   }
  },
  {
   "id": "3-distribuciones-discretas-tabla--bernoullip-pmf",
   "unidad": "3",
   "seccion": "3 · Distribuciones discretas (tabla)",
   "subseccion": "",
   "nombre": "$\\text{Bernoulli}(p)$",
   "tex": "p_X(1)=p,\\ p_X(0)=q",
   "variante": "PMF $p_X(k)$",
   "cuando": "Un único ensayo con dos resultados y probabilidad p de éxito; es el ladrillo de todas las de conteo. Esta celda da la PMF, para calcular P(X = k).",
   "condiciones": [
    "1 ensayo",
    "dos resultados"
   ],
   "slug": "distribucion-bernoulli",
   "ancla": "",
   "tags": [
    "distribucion",
    "discreta",
    "bernoulli",
    "tabla"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 197,
    "tipo": "tabla"
   }
  },
  {
   "id": "3-distribuciones-discretas-tabla--bernoullip-ex",
   "unidad": "3",
   "seccion": "3 · Distribuciones discretas (tabla)",
   "subseccion": "",
   "nombre": "$\\text{Bernoulli}(p)$",
   "tex": "p",
   "variante": "$E[X]$",
   "cuando": "Un único ensayo con dos resultados y probabilidad p de éxito; es el ladrillo de todas las de conteo. Esta celda da la media.",
   "condiciones": [
    "1 ensayo",
    "dos resultados"
   ],
   "slug": "distribucion-bernoulli",
   "ancla": "",
   "tags": [
    "distribucion",
    "discreta",
    "bernoulli",
    "tabla"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 197,
    "tipo": "tabla"
   }
  },
  {
   "id": "3-distribuciones-discretas-tabla--bernoullip-vx",
   "unidad": "3",
   "seccion": "3 · Distribuciones discretas (tabla)",
   "subseccion": "",
   "nombre": "$\\text{Bernoulli}(p)$",
   "tex": "pq",
   "variante": "$V(X)$",
   "cuando": "Un único ensayo con dos resultados y probabilidad p de éxito; es el ladrillo de todas las de conteo. Esta celda da la varianza.",
   "condiciones": [
    "1 ensayo",
    "dos resultados"
   ],
   "slug": "distribucion-bernoulli",
   "ancla": "",
   "tags": [
    "distribucion",
    "discreta",
    "bernoulli",
    "tabla"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 197,
    "tipo": "tabla"
   }
  },
  {
   "id": "3-distribuciones-discretas-tabla--bernoullip-fgm",
   "unidad": "3",
   "seccion": "3 · Distribuciones discretas (tabla)",
   "subseccion": "",
   "nombre": "$\\text{Bernoulli}(p)$",
   "tex": "q+p\\,e^t",
   "variante": "FGM $M_X(t)$",
   "cuando": "Un único ensayo con dos resultados y probabilidad p de éxito; es el ladrillo de todas las de conteo. Esta celda da la FGM.",
   "condiciones": [
    "1 ensayo",
    "dos resultados"
   ],
   "slug": "distribucion-bernoulli",
   "ancla": "",
   "tags": [
    "distribucion",
    "discreta",
    "bernoulli",
    "tabla"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 197,
    "tipo": "tabla"
   }
  },
  {
   "id": "3-distribuciones-discretas-tabla--binomialnp-soporte",
   "unidad": "3",
   "seccion": "3 · Distribuciones discretas (tabla)",
   "subseccion": "",
   "nombre": "$\\text{Binomial}(n,p)$",
   "tex": "\\{0,\\dots,n\\}",
   "variante": "Soporte $\\mathcal{R}_X$",
   "cuando": "Se repite n veces el mismo ensayo independiente y preguntan cuántos éxitos hay (con reposición o población grande). Esta celda da el recorrido, que fija los límites de la suma.",
   "condiciones": [
    "n fijo",
    "independientes",
    "p constante"
   ],
   "slug": "distribucion-binomial",
   "ancla": "",
   "tags": [
    "distribucion",
    "discreta",
    "binomial",
    "tabla"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 198,
    "tipo": "tabla"
   }
  },
  {
   "id": "3-distribuciones-discretas-tabla--binomialnp-pmf",
   "unidad": "3",
   "seccion": "3 · Distribuciones discretas (tabla)",
   "subseccion": "",
   "nombre": "$\\text{Binomial}(n,p)$",
   "tex": "\\dbinom{n}{k}p^k q^{\\,n-k}",
   "variante": "PMF $p_X(k)$",
   "cuando": "Se repite n veces el mismo ensayo independiente y preguntan cuántos éxitos hay (con reposición o población grande). Esta celda da la PMF, para calcular P(X = k).",
   "condiciones": [
    "n fijo",
    "independientes",
    "p constante"
   ],
   "slug": "distribucion-binomial",
   "ancla": "",
   "tags": [
    "distribucion",
    "discreta",
    "binomial",
    "tabla"
   ],
   "esencial": true,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 198,
    "tipo": "tabla"
   }
  },
  {
   "id": "3-distribuciones-discretas-tabla--binomialnp-ex",
   "unidad": "3",
   "seccion": "3 · Distribuciones discretas (tabla)",
   "subseccion": "",
   "nombre": "$\\text{Binomial}(n,p)$",
   "tex": "np",
   "variante": "$E[X]$",
   "cuando": "Se repite n veces el mismo ensayo independiente y preguntan cuántos éxitos hay (con reposición o población grande). Esta celda da la media.",
   "condiciones": [
    "n fijo",
    "independientes",
    "p constante"
   ],
   "slug": "distribucion-binomial",
   "ancla": "",
   "tags": [
    "distribucion",
    "discreta",
    "binomial",
    "tabla"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 198,
    "tipo": "tabla"
   }
  },
  {
   "id": "3-distribuciones-discretas-tabla--binomialnp-vx",
   "unidad": "3",
   "seccion": "3 · Distribuciones discretas (tabla)",
   "subseccion": "",
   "nombre": "$\\text{Binomial}(n,p)$",
   "tex": "npq",
   "variante": "$V(X)$",
   "cuando": "Se repite n veces el mismo ensayo independiente y preguntan cuántos éxitos hay (con reposición o población grande). Esta celda da la varianza.",
   "condiciones": [
    "n fijo",
    "independientes",
    "p constante"
   ],
   "slug": "distribucion-binomial",
   "ancla": "",
   "tags": [
    "distribucion",
    "discreta",
    "binomial",
    "tabla"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 198,
    "tipo": "tabla"
   }
  },
  {
   "id": "3-distribuciones-discretas-tabla--binomialnp-fgm",
   "unidad": "3",
   "seccion": "3 · Distribuciones discretas (tabla)",
   "subseccion": "",
   "nombre": "$\\text{Binomial}(n,p)$",
   "tex": "(q+p\\,e^t)^n",
   "variante": "FGM $M_X(t)$",
   "cuando": "Se repite n veces el mismo ensayo independiente y preguntan cuántos éxitos hay (con reposición o población grande). Esta celda da la FGM.",
   "condiciones": [
    "n fijo",
    "independientes",
    "p constante"
   ],
   "slug": "distribucion-binomial",
   "ancla": "",
   "tags": [
    "distribucion",
    "discreta",
    "binomial",
    "tabla"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 198,
    "tipo": "tabla"
   }
  },
  {
   "id": "3-distribuciones-discretas-tabla--geomp-soporte",
   "unidad": "3",
   "seccion": "3 · Distribuciones discretas (tabla)",
   "subseccion": "",
   "nombre": "$\\text{Geom}(p)$",
   "tex": "\\mathbb{N}_0",
   "variante": "Soporte $\\mathcal{R}_X$",
   "cuando": "Se repite el ensayo hasta el primer éxito y preguntan cuántos fracasos hubo antes; única discreta sin memoria. Esta celda da el recorrido, que fija los límites de la suma.",
   "condiciones": [
    "hasta el 1er éxito",
    "cuenta fracasos"
   ],
   "slug": "distribucion-geometrica",
   "ancla": "",
   "tags": [
    "distribucion",
    "discreta",
    "geometrica",
    "tabla"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 199,
    "tipo": "tabla"
   }
  },
  {
   "id": "3-distribuciones-discretas-tabla--geomp-pmf",
   "unidad": "3",
   "seccion": "3 · Distribuciones discretas (tabla)",
   "subseccion": "",
   "nombre": "$\\text{Geom}(p)$",
   "tex": "q^{\\,k}\\,p",
   "variante": "PMF $p_X(k)$",
   "cuando": "Se repite el ensayo hasta el primer éxito y preguntan cuántos fracasos hubo antes; única discreta sin memoria. Esta celda da la PMF, para calcular P(X = k).",
   "condiciones": [
    "hasta el 1er éxito",
    "cuenta fracasos"
   ],
   "slug": "distribucion-geometrica",
   "ancla": "",
   "tags": [
    "distribucion",
    "discreta",
    "geometrica",
    "tabla"
   ],
   "esencial": true,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 199,
    "tipo": "tabla"
   }
  },
  {
   "id": "3-distribuciones-discretas-tabla--geomp-ex",
   "unidad": "3",
   "seccion": "3 · Distribuciones discretas (tabla)",
   "subseccion": "",
   "nombre": "$\\text{Geom}(p)$",
   "tex": "\\dfrac{q}{p}",
   "variante": "$E[X]$",
   "cuando": "Se repite el ensayo hasta el primer éxito y preguntan cuántos fracasos hubo antes; única discreta sin memoria. Esta celda da la media.",
   "condiciones": [
    "hasta el 1er éxito",
    "cuenta fracasos"
   ],
   "slug": "distribucion-geometrica",
   "ancla": "",
   "tags": [
    "distribucion",
    "discreta",
    "geometrica",
    "tabla"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 199,
    "tipo": "tabla"
   }
  },
  {
   "id": "3-distribuciones-discretas-tabla--geomp-vx",
   "unidad": "3",
   "seccion": "3 · Distribuciones discretas (tabla)",
   "subseccion": "",
   "nombre": "$\\text{Geom}(p)$",
   "tex": "\\dfrac{q}{p^2}",
   "variante": "$V(X)$",
   "cuando": "Se repite el ensayo hasta el primer éxito y preguntan cuántos fracasos hubo antes; única discreta sin memoria. Esta celda da la varianza.",
   "condiciones": [
    "hasta el 1er éxito",
    "cuenta fracasos"
   ],
   "slug": "distribucion-geometrica",
   "ancla": "",
   "tags": [
    "distribucion",
    "discreta",
    "geometrica",
    "tabla"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 199,
    "tipo": "tabla"
   }
  },
  {
   "id": "3-distribuciones-discretas-tabla--geomp-fgm",
   "unidad": "3",
   "seccion": "3 · Distribuciones discretas (tabla)",
   "subseccion": "",
   "nombre": "$\\text{Geom}(p)$",
   "tex": "\\dfrac{p}{1-q\\,e^t},\\ t<-\\ln q",
   "variante": "FGM $M_X(t)$",
   "cuando": "Se repite el ensayo hasta el primer éxito y preguntan cuántos fracasos hubo antes; única discreta sin memoria. Esta celda da la FGM.",
   "condiciones": [
    "hasta el 1er éxito",
    "cuenta fracasos"
   ],
   "slug": "distribucion-geometrica",
   "ancla": "",
   "tags": [
    "distribucion",
    "discreta",
    "geometrica",
    "tabla"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 199,
    "tipo": "tabla"
   }
  },
  {
   "id": "3-distribuciones-discretas-tabla--binnegrp-soporte",
   "unidad": "3",
   "seccion": "3 · Distribuciones discretas (tabla)",
   "subseccion": "",
   "nombre": "$\\text{BinNeg}(r,p)$",
   "tex": "\\mathbb{N}_0",
   "variante": "Soporte $\\mathcal{R}_X$",
   "cuando": "Se repite el ensayo hasta juntar r éxitos y preguntan cuántos fracasos hubo; es la suma de r geométricas. Esta celda da el recorrido, que fija los límites de la suma.",
   "condiciones": [
    "hasta el r-ésimo éxito",
    "cuenta fracasos"
   ],
   "slug": "distribucion-binomial-negativa",
   "ancla": "",
   "tags": [
    "distribucion",
    "discreta",
    "binomial-negativa",
    "tabla"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 200,
    "tipo": "tabla"
   }
  },
  {
   "id": "3-distribuciones-discretas-tabla--binnegrp-pmf",
   "unidad": "3",
   "seccion": "3 · Distribuciones discretas (tabla)",
   "subseccion": "",
   "nombre": "$\\text{BinNeg}(r,p)$",
   "tex": "\\dbinom{k+r-1}{k}q^{\\,k}p^{\\,r}",
   "variante": "PMF $p_X(k)$",
   "cuando": "Se repite el ensayo hasta juntar r éxitos y preguntan cuántos fracasos hubo; es la suma de r geométricas. Esta celda da la PMF, para calcular P(X = k).",
   "condiciones": [
    "hasta el r-ésimo éxito",
    "cuenta fracasos"
   ],
   "slug": "distribucion-binomial-negativa",
   "ancla": "",
   "tags": [
    "distribucion",
    "discreta",
    "binomial-negativa",
    "tabla"
   ],
   "esencial": true,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 200,
    "tipo": "tabla"
   }
  },
  {
   "id": "3-distribuciones-discretas-tabla--binnegrp-ex",
   "unidad": "3",
   "seccion": "3 · Distribuciones discretas (tabla)",
   "subseccion": "",
   "nombre": "$\\text{BinNeg}(r,p)$",
   "tex": "\\dfrac{rq}{p}",
   "variante": "$E[X]$",
   "cuando": "Se repite el ensayo hasta juntar r éxitos y preguntan cuántos fracasos hubo; es la suma de r geométricas. Esta celda da la media.",
   "condiciones": [
    "hasta el r-ésimo éxito",
    "cuenta fracasos"
   ],
   "slug": "distribucion-binomial-negativa",
   "ancla": "",
   "tags": [
    "distribucion",
    "discreta",
    "binomial-negativa",
    "tabla"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 200,
    "tipo": "tabla"
   }
  },
  {
   "id": "3-distribuciones-discretas-tabla--binnegrp-vx",
   "unidad": "3",
   "seccion": "3 · Distribuciones discretas (tabla)",
   "subseccion": "",
   "nombre": "$\\text{BinNeg}(r,p)$",
   "tex": "\\dfrac{rq}{p^2}",
   "variante": "$V(X)$",
   "cuando": "Se repite el ensayo hasta juntar r éxitos y preguntan cuántos fracasos hubo; es la suma de r geométricas. Esta celda da la varianza.",
   "condiciones": [
    "hasta el r-ésimo éxito",
    "cuenta fracasos"
   ],
   "slug": "distribucion-binomial-negativa",
   "ancla": "",
   "tags": [
    "distribucion",
    "discreta",
    "binomial-negativa",
    "tabla"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 200,
    "tipo": "tabla"
   }
  },
  {
   "id": "3-distribuciones-discretas-tabla--binnegrp-fgm",
   "unidad": "3",
   "seccion": "3 · Distribuciones discretas (tabla)",
   "subseccion": "",
   "nombre": "$\\text{BinNeg}(r,p)$",
   "tex": "\\left(\\dfrac{p}{1-q\\,e^t}\\right)^{r},\\ t<-\\ln q",
   "variante": "FGM $M_X(t)$",
   "cuando": "Se repite el ensayo hasta juntar r éxitos y preguntan cuántos fracasos hubo; es la suma de r geométricas. Esta celda da la FGM.",
   "condiciones": [
    "hasta el r-ésimo éxito",
    "cuenta fracasos"
   ],
   "slug": "distribucion-binomial-negativa",
   "ancla": "",
   "tags": [
    "distribucion",
    "discreta",
    "binomial-negativa",
    "tabla"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 200,
    "tipo": "tabla"
   }
  },
  {
   "id": "3-distribuciones-discretas-tabla--hipergnmn-soporte",
   "unidad": "3",
   "seccion": "3 · Distribuciones discretas (tabla)",
   "subseccion": "",
   "nombre": "$\\text{Hiperg}(N,M,n)$",
   "tex": "\\{\\max\\{0,n-(N-M)\\},\\dots,\\min\\{n,M\\}\\}",
   "variante": "Soporte $\\mathcal{R}_X$",
   "cuando": "Se extraen n piezas sin reposición de una población finita con M especiales y preguntan cuántas especiales salieron. Esta celda da el recorrido, que fija los límites de la suma.",
   "condiciones": [
    "sin reposición",
    "población finita"
   ],
   "slug": "distribucion-hipergeometrica",
   "ancla": "",
   "tags": [
    "distribucion",
    "discreta",
    "hipergeometrica",
    "tabla"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 201,
    "tipo": "tabla"
   }
  },
  {
   "id": "3-distribuciones-discretas-tabla--hipergnmn-pmf",
   "unidad": "3",
   "seccion": "3 · Distribuciones discretas (tabla)",
   "subseccion": "",
   "nombre": "$\\text{Hiperg}(N,M,n)$",
   "tex": "\\dfrac{\\binom{M}{k}\\binom{N-M}{\\,n-k\\,}}{\\binom{N}{n}}",
   "variante": "PMF $p_X(k)$",
   "cuando": "Se extraen n piezas sin reposición de una población finita con M especiales y preguntan cuántas especiales salieron. Esta celda da la PMF, para calcular P(X = k).",
   "condiciones": [
    "sin reposición",
    "población finita"
   ],
   "slug": "distribucion-hipergeometrica",
   "ancla": "",
   "tags": [
    "distribucion",
    "discreta",
    "hipergeometrica",
    "tabla"
   ],
   "esencial": true,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 201,
    "tipo": "tabla"
   }
  },
  {
   "id": "3-distribuciones-discretas-tabla--hipergnmn-ex",
   "unidad": "3",
   "seccion": "3 · Distribuciones discretas (tabla)",
   "subseccion": "",
   "nombre": "$\\text{Hiperg}(N,M,n)$",
   "tex": "n\\dfrac{M}{N}=np",
   "variante": "$E[X]$",
   "cuando": "Se extraen n piezas sin reposición de una población finita con M especiales y preguntan cuántas especiales salieron. Esta celda da la media.",
   "condiciones": [
    "sin reposición",
    "población finita"
   ],
   "slug": "distribucion-hipergeometrica",
   "ancla": "",
   "tags": [
    "distribucion",
    "discreta",
    "hipergeometrica",
    "tabla"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 201,
    "tipo": "tabla"
   }
  },
  {
   "id": "3-distribuciones-discretas-tabla--hipergnmn-vx",
   "unidad": "3",
   "seccion": "3 · Distribuciones discretas (tabla)",
   "subseccion": "",
   "nombre": "$\\text{Hiperg}(N,M,n)$",
   "tex": "np\\,q\\,\\dfrac{N-n}{N-1}",
   "variante": "$V(X)$",
   "cuando": "Se extraen n piezas sin reposición de una población finita con M especiales y preguntan cuántas especiales salieron. Esta celda da la varianza.",
   "condiciones": [
    "sin reposición",
    "población finita"
   ],
   "slug": "distribucion-hipergeometrica",
   "ancla": "",
   "tags": [
    "distribucion",
    "discreta",
    "hipergeometrica",
    "tabla"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 201,
    "tipo": "tabla"
   }
  },
  {
   "id": "3-distribuciones-discretas-tabla--poisson-soporte",
   "unidad": "3",
   "seccion": "3 · Distribuciones discretas (tabla)",
   "subseccion": "",
   "nombre": "$\\text{Poisson}(\\lambda)$",
   "tex": "\\mathbb{N}_0",
   "variante": "Soporte $\\mathcal{R}_X$",
   "cuando": "Se cuentan eventos raros en un intervalo fijo de tiempo, espacio o superficie, con tasa media conocida. Esta celda da el recorrido, que fija los límites de la suma.",
   "condiciones": [
    "tasa constante",
    "intervalo fijo"
   ],
   "slug": "distribucion-poisson",
   "ancla": "",
   "tags": [
    "distribucion",
    "discreta",
    "poisson",
    "tabla"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 202,
    "tipo": "tabla"
   }
  },
  {
   "id": "3-distribuciones-discretas-tabla--poisson-pmf",
   "unidad": "3",
   "seccion": "3 · Distribuciones discretas (tabla)",
   "subseccion": "",
   "nombre": "$\\text{Poisson}(\\lambda)$",
   "tex": "\\dfrac{\\lambda^{k}}{k!}\\,e^{-\\lambda}",
   "variante": "PMF $p_X(k)$",
   "cuando": "Se cuentan eventos raros en un intervalo fijo de tiempo, espacio o superficie, con tasa media conocida. Esta celda da la PMF, para calcular P(X = k).",
   "condiciones": [
    "tasa constante",
    "intervalo fijo"
   ],
   "slug": "distribucion-poisson",
   "ancla": "",
   "tags": [
    "distribucion",
    "discreta",
    "poisson",
    "tabla"
   ],
   "esencial": true,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 202,
    "tipo": "tabla"
   }
  },
  {
   "id": "3-distribuciones-discretas-tabla--poisson-ex",
   "unidad": "3",
   "seccion": "3 · Distribuciones discretas (tabla)",
   "subseccion": "",
   "nombre": "$\\text{Poisson}(\\lambda)$",
   "tex": "\\lambda",
   "variante": "$E[X]$",
   "cuando": "Se cuentan eventos raros en un intervalo fijo de tiempo, espacio o superficie, con tasa media conocida. Esta celda da la media.",
   "condiciones": [
    "tasa constante",
    "intervalo fijo"
   ],
   "slug": "distribucion-poisson",
   "ancla": "",
   "tags": [
    "distribucion",
    "discreta",
    "poisson",
    "tabla"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 202,
    "tipo": "tabla"
   }
  },
  {
   "id": "3-distribuciones-discretas-tabla--poisson-vx",
   "unidad": "3",
   "seccion": "3 · Distribuciones discretas (tabla)",
   "subseccion": "",
   "nombre": "$\\text{Poisson}(\\lambda)$",
   "tex": "\\lambda",
   "variante": "$V(X)$",
   "cuando": "Se cuentan eventos raros en un intervalo fijo de tiempo, espacio o superficie, con tasa media conocida. Esta celda da la varianza.",
   "condiciones": [
    "tasa constante",
    "intervalo fijo"
   ],
   "slug": "distribucion-poisson",
   "ancla": "",
   "tags": [
    "distribucion",
    "discreta",
    "poisson",
    "tabla"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 202,
    "tipo": "tabla"
   }
  },
  {
   "id": "3-distribuciones-discretas-tabla--poisson-fgm",
   "unidad": "3",
   "seccion": "3 · Distribuciones discretas (tabla)",
   "subseccion": "",
   "nombre": "$\\text{Poisson}(\\lambda)$",
   "tex": "e^{\\lambda(e^t-1)}",
   "variante": "FGM $M_X(t)$",
   "cuando": "Se cuentan eventos raros en un intervalo fijo de tiempo, espacio o superficie, con tasa media conocida. Esta celda da la FGM.",
   "condiciones": [
    "tasa constante",
    "intervalo fijo"
   ],
   "slug": "distribucion-poisson",
   "ancla": "",
   "tags": [
    "distribucion",
    "discreta",
    "poisson",
    "tabla"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 202,
    "tipo": "tabla"
   }
  },
  {
   "id": "3-distribuciones-discretas-tabla--geometrica",
   "unidad": "3",
   "seccion": "3 · Distribuciones discretas (tabla)",
   "subseccion": "",
   "nombre": "Geométrica",
   "tex": "\\text{única discreta }\\textbf{sin memoria}\\text{, }P(X\\ge L+\\Delta\\mid X\\ge L)=P(X\\ge\\Delta)\\text{; es el caso }r=1\\text{ de la BinNeg.}",
   "cuando": "Justifica el uso de la geométrica cuando el enunciado dice que «no importa lo que ya pasó»: falta de memoria.",
   "condiciones": [
    "sin memoria"
   ],
   "slug": "distribucion-geometrica",
   "ancla": "",
   "tags": [
    "discreta",
    "geometrica",
    "sin-memoria"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 209,
    "tipo": "vineta"
   }
  },
  {
   "id": "3-distribuciones-discretas-tabla--poisson",
   "unidad": "3",
   "seccion": "3 · Distribuciones discretas (tabla)",
   "subseccion": "",
   "nombre": "Poisson",
   "tex": "\\text{Binomial}(n,p)\\ \\approx\\ \\text{Poisson}(\\lambda),\\qquad \\lambda=np",
   "cuando": "Regla práctica para reemplazar una binomial incómoda (n grande, p chico) por una Poisson con λ = np.",
   "condiciones": [
    "n grande",
    "p chico"
   ],
   "slug": "distribucion-poisson",
   "ancla": "",
   "tags": [
    "discreta",
    "poisson",
    "aproximacion"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 212,
    "tipo": "vineta"
   }
  },
  {
   "id": "4-variable-aleatoria-continua--densidad",
   "unidad": "4",
   "seccion": "4 · Variable aleatoria continua (V.A.C.)",
   "subseccion": "Densidad y FDA",
   "nombre": "Densidad $\\ge 0$",
   "tex": "f_X(x)\\ge 0,\\quad \\displaystyle\\int_{-\\infty}^{+\\infty} f_X(x)\\,dx = 1",
   "cuando": "Dan una densidad con una constante a determinar: se impone que integre 1 sobre el soporte.",
   "condiciones": [
    "X continua",
    "f ≥ 0"
   ],
   "slug": "funcion-de-densidad",
   "ancla": "",
   "tags": [
    "vac",
    "densidad"
   ],
   "esencial": true,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 222,
    "tipo": "tabla"
   }
  },
  {
   "id": "4-variable-aleatoria-continua--fda-desde-la-densidad",
   "unidad": "4",
   "seccion": "4 · Variable aleatoria continua (V.A.C.)",
   "subseccion": "Densidad y FDA",
   "nombre": "FDA desde la densidad",
   "tex": "\\displaystyle F_X(x)=P(X\\le x)=\\int_{-\\infty}^{x} f_X(y)\\,dy",
   "cuando": "Piden la FDA por tramos a partir de la densidad: se integra desde el extremo izquierdo del soporte.",
   "condiciones": [
    "X continua"
   ],
   "slug": "funcion-de-densidad",
   "ancla": "",
   "tags": [
    "vac",
    "fda"
   ],
   "esencial": true,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 223,
    "tipo": "tabla"
   }
  },
  {
   "id": "4-variable-aleatoria-continua--densidad-desde-la-fda",
   "unidad": "4",
   "seccion": "4 · Variable aleatoria continua (V.A.C.)",
   "subseccion": "Densidad y FDA",
   "nombre": "Densidad desde la FDA",
   "tex": "\\displaystyle f_X(x)=\\frac{dF_X(x)}{dx}\\text{ (donde }F_X\\text{ derivable)}",
   "cuando": "Dan la FDA y piden la densidad: se deriva en los tramos donde F es derivable.",
   "condiciones": [
    "F derivable"
   ],
   "slug": "funcion-de-densidad",
   "ancla": "",
   "tags": [
    "vac",
    "densidad",
    "fda"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 224,
    "tipo": "tabla"
   }
  },
  {
   "id": "4-variable-aleatoria-continua--probabilidad-de-un-intervalo",
   "unidad": "4",
   "seccion": "4 · Variable aleatoria continua (V.A.C.)",
   "subseccion": "Densidad y FDA",
   "nombre": "Probabilidad de un intervalo",
   "tex": "P(a<X\\le b)=P(a\\le X\\le b)=F_X(b)-F_X(a)=\\int_a^b f_X(x)\\,dx.",
   "cuando": "Piden la probabilidad de un intervalo: en el caso continuo da igual usar < o ≤ porque los puntos no tienen masa.",
   "condiciones": [
    "X continua"
   ],
   "slug": "funcion-de-densidad",
   "ancla": "",
   "tags": [
    "vac",
    "fda"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 227,
    "tipo": "bloque"
   }
  },
  {
   "id": "4-variable-aleatoria-continua--esperanza-y-varianza",
   "unidad": "4",
   "seccion": "4 · Variable aleatoria continua (V.A.C.)",
   "subseccion": "Esperanza y varianza",
   "nombre": "Esperanza y varianza",
   "tex": "E[X]=\\mu_X=\\int_{-\\infty}^{+\\infty} x\\,f_X(x)\\,dx,\\qquad E[g(X)]=\\int_{-\\infty}^{+\\infty} g(x)\\,f_X(x)\\,dx,\\qquad E[X^k]=\\int_{-\\infty}^{+\\infty} x^k\\,f_X(x)\\,dx.",
   "variante": "esperanza",
   "cuando": "Media y esperanza de una función en el caso continuo: la suma discreta se reemplaza por una integral.",
   "condiciones": [
    "X continua"
   ],
   "slug": "funcion-de-densidad",
   "ancla": "",
   "tags": [
    "vac",
    "esperanza"
   ],
   "esencial": true,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 233,
    "tipo": "bloque"
   }
  },
  {
   "id": "4-variable-aleatoria-continua--esperanza-y-varianza-2",
   "unidad": "4",
   "seccion": "4 · Variable aleatoria continua (V.A.C.)",
   "subseccion": "Esperanza y varianza",
   "nombre": "Esperanza y varianza",
   "tex": "V(X)=\\sigma_X^2=E[(X-\\mu_X)^2]=\\int_{-\\infty}^{+\\infty}(x-\\mu_X)^2 f_X(x)\\,dx=E[X^2]-(E[X])^2\\ \\ge 0.",
   "variante": "varianza",
   "cuando": "Varianza en el caso continuo; en la práctica conviene calcular E[X²] y restar la media al cuadrado.",
   "condiciones": [
    "X continua"
   ],
   "slug": "funcion-de-densidad",
   "ancla": "",
   "tags": [
    "vac",
    "varianza"
   ],
   "esencial": true,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 235,
    "tipo": "bloque"
   }
  },
  {
   "id": "4-variable-aleatoria-continua--esperanza-por-la-cola-supervivencia",
   "unidad": "4",
   "seccion": "4 · Variable aleatoria continua (V.A.C.)",
   "subseccion": "Esperanza por la cola (supervivencia), $X\\ge 0$",
   "nombre": "Esperanza por la cola (supervivencia), $X\\ge 0$",
   "tex": "E[X]=\\int_0^{+\\infty}\\big(1-F_X(x)\\big)\\,dx=\\int_0^{+\\infty}P(X>x)\\,dx.",
   "cuando": "Se conoce P(X > x) pero la densidad es incómoda de integrar (duraciones, tiempos de vida): se integra la supervivencia.",
   "condiciones": [
    "X ≥ 0"
   ],
   "slug": "funcion-de-densidad",
   "ancla": "",
   "tags": [
    "vac",
    "esperanza",
    "confiabilidad"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 239,
    "tipo": "bloque"
   }
  },
  {
   "id": "4-variable-aleatoria-continua--tasa-de-fallas-hazard-y-confiabilidad",
   "unidad": "4",
   "seccion": "4 · Variable aleatoria continua (V.A.C.)",
   "subseccion": "Tasa de fallas (hazard) y confiabilidad",
   "nombre": "Tasa de fallas (hazard) y confiabilidad",
   "tex": "R(t)=\\frac{f_T(t)}{1-F_T(t)}=-\\frac{d}{dt}\\ln S(t),\\qquad S(t)=1-F_T(t)=\\exp\\!\\left(-\\int_0^t R(u)\\,du\\right).",
   "variante": "definición",
   "cuando": "Enunciados de confiabilidad que dan o piden la tasa de fallas instantánea de un componente.",
   "condiciones": [
    "T ≥ 0"
   ],
   "slug": "tasa-de-fallas",
   "ancla": "",
   "tags": [
    "confiabilidad",
    "tasa-de-fallas"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 247,
    "tipo": "bloque"
   }
  },
  {
   "id": "4-variable-aleatoria-continua--tasa-de-fallas-hazard-y-confiabilidad-2",
   "unidad": "4",
   "seccion": "4 · Variable aleatoria continua (V.A.C.)",
   "subseccion": "Tasa de fallas (hazard) y confiabilidad",
   "nombre": "Tasa de fallas (hazard) y confiabilidad",
   "tex": "T\\sim\\text{Expo}(\\lambda)\\iff R(t)\\equiv\\lambda\\ \\text{(constante)}.",
   "variante": "caso exponencial",
   "cuando": "Criterio para reconocer una exponencial: tasa de fallas constante equivale a falta de memoria.",
   "condiciones": [
    "tasa constante"
   ],
   "slug": "tasa-de-fallas",
   "ancla": "",
   "tags": [
    "confiabilidad",
    "exponencial"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 249,
    "tipo": "bloque"
   }
  },
  {
   "id": "4-variable-aleatoria-continua--constante",
   "unidad": "4",
   "seccion": "4 · Variable aleatoria continua (V.A.C.)",
   "subseccion": "Tasa de fallas (hazard) y confiabilidad",
   "nombre": "constante",
   "tex": "\\text{al azar (sin memoria) }\\to\\text{ exponencial}",
   "cuando": "Lectura de la forma de la tasa de fallas: constante significa fallas al azar, sin envejecimiento.",
   "condiciones": [
    "tasa constante"
   ],
   "slug": "tasa-de-fallas",
   "ancla": "",
   "tags": [
    "confiabilidad"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 255,
    "tipo": "tabla"
   }
  },
  {
   "id": "4-variable-aleatoria-continua--minimo-de-exponenciales-sistema-en-serie",
   "unidad": "4",
   "seccion": "4 · Variable aleatoria continua (V.A.C.)",
   "subseccion": "Mínimo de exponenciales (sistema en serie)",
   "nombre": "Mínimo de exponenciales (sistema en serie)",
   "tex": "T=\\min(X_1,\\dots,X_n)\\sim\\text{Expo}\\!\\left(\\sum_{i=1}^n \\lambda_i\\right),\\qquad P(T>t)=\\prod_{i=1}^n e^{-\\lambda_i t},\\qquad E[T]=\\frac{1}{\\sum_i \\lambda_i}.",
   "cuando": "Sistema en serie: falla cuando falla el primer componente, con vidas exponenciales independientes. Las tasas se suman.",
   "condiciones": [
    "independientes",
    "exponenciales"
   ],
   "slug": "minimo-de-exponenciales",
   "ancla": "",
   "tags": [
    "exponencial",
    "confiabilidad",
    "minimo"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 261,
    "tipo": "bloque"
   }
  },
  {
   "id": "4-variable-aleatoria-continua--caso-identico",
   "unidad": "4",
   "seccion": "4 · Variable aleatoria continua (V.A.C.)",
   "subseccion": "Mínimo de exponenciales (sistema en serie)",
   "nombre": "Caso idéntico ($\\lambda_i=\\lambda$)",
   "tex": "T\\sim\\text{Expo}(n\\lambda)\\text{, }E[T]=\\dfrac{1}{n\\lambda}=\\dfrac{E[X_1]}{n}",
   "cuando": "Sistema en serie con n componentes exponenciales de la misma tasa: el mínimo vuelve a ser exponencial y la vida media se divide por n.",
   "condiciones": [
    "independientes",
    "misma tasa"
   ],
   "slug": "minimo-de-exponenciales",
   "ancla": "caso-idéntico",
   "tags": [
    "continua",
    "exponencial",
    "minimo"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 263,
    "tipo": "parrafo"
   }
  },
  {
   "id": "4-variable-aleatoria-continua--soporte-no-acotado-integrales-impropias",
   "unidad": "4",
   "seccion": "4 · Variable aleatoria continua (V.A.C.)",
   "subseccion": "Notas de cálculo",
   "nombre": "Soporte no acotado $\\Rightarrow$ integrales impropias",
   "tex": "\\displaystyle\\int_a^{+\\infty} w(x)\\,dx=\\lim_{t\\to+\\infty}\\int_a^{t} w(x)\\,dx\\text{. Ver integrales impropias.}",
   "cuando": "Recordatorio de cálculo: con soporte infinito la integral se resuelve como límite.",
   "condiciones": [
    "soporte no acotado"
   ],
   "slug": "tecnica-integrales-impropias",
   "ancla": "",
   "tags": [
    "vac",
    "calculo"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 269,
    "tipo": "vineta"
   }
  },
  {
   "id": "5-distribuciones-continuas-tabla--unifab-soporte",
   "unidad": "4",
   "seccion": "5 · Distribuciones continuas (tabla)",
   "subseccion": "",
   "nombre": "$\\text{Unif}(a,b)$",
   "tex": "(a,b),\\ a<b",
   "variante": "Soporte $\\mathcal{R}_X$",
   "cuando": "Todo punto de un intervalo es igualmente probable: esperas al azar, redondeos, puntos elegidos sin preferencia. Esta celda da el soporte, que fija los límites de la integral.",
   "condiciones": [
    "soporte acotado"
   ],
   "slug": "distribucion-uniforme-continua",
   "ancla": "",
   "tags": [
    "distribucion",
    "continua",
    "uniforme",
    "tabla"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 278,
    "tipo": "tabla"
   }
  },
  {
   "id": "5-distribuciones-continuas-tabla--unifab-densidad",
   "unidad": "4",
   "seccion": "5 · Distribuciones continuas (tabla)",
   "subseccion": "",
   "nombre": "$\\text{Unif}(a,b)$",
   "tex": "\\dfrac{1}{b-a}",
   "variante": "Densidad $f_X(x)$",
   "cuando": "Todo punto de un intervalo es igualmente probable: esperas al azar, redondeos, puntos elegidos sin preferencia. Esta celda da la densidad.",
   "condiciones": [
    "soporte acotado"
   ],
   "slug": "distribucion-uniforme-continua",
   "ancla": "",
   "tags": [
    "distribucion",
    "continua",
    "uniforme",
    "tabla"
   ],
   "esencial": true,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 278,
    "tipo": "tabla"
   }
  },
  {
   "id": "5-distribuciones-continuas-tabla--unifab-fda",
   "unidad": "4",
   "seccion": "5 · Distribuciones continuas (tabla)",
   "subseccion": "",
   "nombre": "$\\text{Unif}(a,b)$",
   "tex": "\\dfrac{x-a}{b-a}\\text{ (lineal en }(a,b)\\text{)}",
   "variante": "FDA $F_X(x)$",
   "cuando": "Todo punto de un intervalo es igualmente probable: esperas al azar, redondeos, puntos elegidos sin preferencia. Esta celda da la FDA, para probabilidades de intervalos y colas.",
   "condiciones": [
    "soporte acotado"
   ],
   "slug": "distribucion-uniforme-continua",
   "ancla": "",
   "tags": [
    "distribucion",
    "continua",
    "uniforme",
    "tabla"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 278,
    "tipo": "tabla"
   }
  },
  {
   "id": "5-distribuciones-continuas-tabla--unifab-ex",
   "unidad": "4",
   "seccion": "5 · Distribuciones continuas (tabla)",
   "subseccion": "",
   "nombre": "$\\text{Unif}(a,b)$",
   "tex": "\\dfrac{a+b}{2}",
   "variante": "$E[X]$",
   "cuando": "Todo punto de un intervalo es igualmente probable: esperas al azar, redondeos, puntos elegidos sin preferencia. Esta celda da la media.",
   "condiciones": [
    "soporte acotado"
   ],
   "slug": "distribucion-uniforme-continua",
   "ancla": "",
   "tags": [
    "distribucion",
    "continua",
    "uniforme",
    "tabla"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 278,
    "tipo": "tabla"
   }
  },
  {
   "id": "5-distribuciones-continuas-tabla--unifab-vx",
   "unidad": "4",
   "seccion": "5 · Distribuciones continuas (tabla)",
   "subseccion": "",
   "nombre": "$\\text{Unif}(a,b)$",
   "tex": "\\dfrac{(b-a)^2}{12}",
   "variante": "$V(X)$",
   "cuando": "Todo punto de un intervalo es igualmente probable: esperas al azar, redondeos, puntos elegidos sin preferencia. Esta celda da la varianza.",
   "condiciones": [
    "soporte acotado"
   ],
   "slug": "distribucion-uniforme-continua",
   "ancla": "",
   "tags": [
    "distribucion",
    "continua",
    "uniforme",
    "tabla"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 278,
    "tipo": "tabla"
   }
  },
  {
   "id": "5-distribuciones-continuas-tabla--expo-soporte",
   "unidad": "4",
   "seccion": "5 · Distribuciones continuas (tabla)",
   "subseccion": "",
   "nombre": "$\\text{Expo}(\\lambda)$",
   "tex": "x>0",
   "variante": "Soporte $\\mathcal{R}_X$",
   "cuando": "Tiempo de espera hasta un evento que ocurre al azar con tasa constante λ; única continua sin memoria. Esta celda da el soporte, que fija los límites de la integral.",
   "condiciones": [
    "tasa constante",
    "sin memoria"
   ],
   "slug": "distribucion-exponencial",
   "ancla": "",
   "tags": [
    "distribucion",
    "continua",
    "exponencial",
    "tabla"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 279,
    "tipo": "tabla"
   }
  },
  {
   "id": "5-distribuciones-continuas-tabla--expo-densidad",
   "unidad": "4",
   "seccion": "5 · Distribuciones continuas (tabla)",
   "subseccion": "",
   "nombre": "$\\text{Expo}(\\lambda)$",
   "tex": "\\lambda e^{-\\lambda x}",
   "variante": "Densidad $f_X(x)$",
   "cuando": "Tiempo de espera hasta un evento que ocurre al azar con tasa constante λ; única continua sin memoria. Esta celda da la densidad.",
   "condiciones": [
    "tasa constante",
    "sin memoria"
   ],
   "slug": "distribucion-exponencial",
   "ancla": "",
   "tags": [
    "distribucion",
    "continua",
    "exponencial",
    "tabla"
   ],
   "esencial": true,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 279,
    "tipo": "tabla"
   }
  },
  {
   "id": "5-distribuciones-continuas-tabla--expo-fda",
   "unidad": "4",
   "seccion": "5 · Distribuciones continuas (tabla)",
   "subseccion": "",
   "nombre": "$\\text{Expo}(\\lambda)$",
   "tex": "1-e^{-\\lambda x}",
   "variante": "FDA $F_X(x)$",
   "cuando": "Tiempo de espera hasta un evento que ocurre al azar con tasa constante λ; única continua sin memoria. Esta celda da la FDA, para probabilidades de intervalos y colas.",
   "condiciones": [
    "tasa constante",
    "sin memoria"
   ],
   "slug": "distribucion-exponencial",
   "ancla": "",
   "tags": [
    "distribucion",
    "continua",
    "exponencial",
    "tabla"
   ],
   "esencial": true,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 279,
    "tipo": "tabla"
   }
  },
  {
   "id": "5-distribuciones-continuas-tabla--expo-ex",
   "unidad": "4",
   "seccion": "5 · Distribuciones continuas (tabla)",
   "subseccion": "",
   "nombre": "$\\text{Expo}(\\lambda)$",
   "tex": "\\dfrac{1}{\\lambda}",
   "variante": "$E[X]$",
   "cuando": "Tiempo de espera hasta un evento que ocurre al azar con tasa constante λ; única continua sin memoria. Esta celda da la media.",
   "condiciones": [
    "tasa constante",
    "sin memoria"
   ],
   "slug": "distribucion-exponencial",
   "ancla": "",
   "tags": [
    "distribucion",
    "continua",
    "exponencial",
    "tabla"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 279,
    "tipo": "tabla"
   }
  },
  {
   "id": "5-distribuciones-continuas-tabla--expo-vx",
   "unidad": "4",
   "seccion": "5 · Distribuciones continuas (tabla)",
   "subseccion": "",
   "nombre": "$\\text{Expo}(\\lambda)$",
   "tex": "\\dfrac{1}{\\lambda^2}",
   "variante": "$V(X)$",
   "cuando": "Tiempo de espera hasta un evento que ocurre al azar con tasa constante λ; única continua sin memoria. Esta celda da la varianza.",
   "condiciones": [
    "tasa constante",
    "sin memoria"
   ],
   "slug": "distribucion-exponencial",
   "ancla": "",
   "tags": [
    "distribucion",
    "continua",
    "exponencial",
    "tabla"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 279,
    "tipo": "tabla"
   }
  },
  {
   "id": "5-distribuciones-continuas-tabla--n-soporte",
   "unidad": "4",
   "seccion": "5 · Distribuciones continuas (tabla)",
   "subseccion": "",
   "nombre": "$N(\\mu,\\sigma)$",
   "tex": "\\mathbb{R}",
   "variante": "Soporte $\\mathcal{R}_X$",
   "cuando": "Magnitud que se acumula por muchas causas pequeñas (medidas, errores, pesos) o resultado de aplicar el TCL. Esta celda da el soporte, que fija los límites de la integral.",
   "condiciones": [
    "parametrizada por el desvío"
   ],
   "slug": "distribucion-normal",
   "ancla": "",
   "tags": [
    "distribucion",
    "continua",
    "normal",
    "tabla"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 280,
    "tipo": "tabla"
   }
  },
  {
   "id": "5-distribuciones-continuas-tabla--n-densidad",
   "unidad": "4",
   "seccion": "5 · Distribuciones continuas (tabla)",
   "subseccion": "",
   "nombre": "$N(\\mu,\\sigma)$",
   "tex": "\\dfrac{1}{\\sqrt{2\\pi}\\,\\sigma}\\exp\\!\\left\\{-\\dfrac{(x-\\mu)^2}{2\\sigma^2}\\right\\}",
   "variante": "Densidad $f_X(x)$",
   "cuando": "Magnitud que se acumula por muchas causas pequeñas (medidas, errores, pesos) o resultado de aplicar el TCL. Esta celda da la densidad.",
   "condiciones": [
    "parametrizada por el desvío"
   ],
   "slug": "distribucion-normal",
   "ancla": "",
   "tags": [
    "distribucion",
    "continua",
    "normal",
    "tabla"
   ],
   "esencial": true,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 280,
    "tipo": "tabla"
   }
  },
  {
   "id": "5-distribuciones-continuas-tabla--n-fda",
   "unidad": "4",
   "seccion": "5 · Distribuciones continuas (tabla)",
   "subseccion": "",
   "nombre": "$N(\\mu,\\sigma)$",
   "tex": "\\Phi\\!\\left(\\dfrac{x-\\mu}{\\sigma}\\right)\\text{ — sin forma cerrada (tabla de }\\Phi\\text{)}",
   "variante": "FDA $F_X(x)$",
   "cuando": "Magnitud que se acumula por muchas causas pequeñas (medidas, errores, pesos) o resultado de aplicar el TCL. Esta celda da la FDA, para probabilidades de intervalos y colas.",
   "condiciones": [
    "parametrizada por el desvío"
   ],
   "slug": "distribucion-normal",
   "ancla": "",
   "tags": [
    "distribucion",
    "continua",
    "normal",
    "tabla"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 280,
    "tipo": "tabla"
   }
  },
  {
   "id": "5-distribuciones-continuas-tabla--n-ex",
   "unidad": "4",
   "seccion": "5 · Distribuciones continuas (tabla)",
   "subseccion": "",
   "nombre": "$N(\\mu,\\sigma)$",
   "tex": "\\mu",
   "variante": "$E[X]$",
   "cuando": "Magnitud que se acumula por muchas causas pequeñas (medidas, errores, pesos) o resultado de aplicar el TCL. Esta celda da la media.",
   "condiciones": [
    "parametrizada por el desvío"
   ],
   "slug": "distribucion-normal",
   "ancla": "",
   "tags": [
    "distribucion",
    "continua",
    "normal",
    "tabla"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 280,
    "tipo": "tabla"
   }
  },
  {
   "id": "5-distribuciones-continuas-tabla--n-vx",
   "unidad": "4",
   "seccion": "5 · Distribuciones continuas (tabla)",
   "subseccion": "",
   "nombre": "$N(\\mu,\\sigma)$",
   "tex": "\\sigma^2",
   "variante": "$V(X)$",
   "cuando": "Magnitud que se acumula por muchas causas pequeñas (medidas, errores, pesos) o resultado de aplicar el TCL. Esta celda da la varianza.",
   "condiciones": [
    "parametrizada por el desvío"
   ],
   "slug": "distribucion-normal",
   "ancla": "",
   "tags": [
    "distribucion",
    "continua",
    "normal",
    "tabla"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 280,
    "tipo": "tabla"
   }
  },
  {
   "id": "5-distribuciones-continuas-tabla--gamma-soporte",
   "unidad": "4",
   "seccion": "5 · Distribuciones continuas (tabla)",
   "subseccion": "",
   "nombre": "$\\text{Gamma}(\\alpha,\\lambda)$",
   "tex": "x>0",
   "variante": "Soporte $\\mathcal{R}_X$",
   "cuando": "Tiempo hasta acumular varios eventos exponenciales, con forma α no necesariamente entera. Esta celda da el soporte, que fija los límites de la integral.",
   "condiciones": [
    "α > 0"
   ],
   "slug": "distribucion-gamma",
   "ancla": "",
   "tags": [
    "distribucion",
    "continua",
    "gamma",
    "tabla"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 281,
    "tipo": "tabla"
   }
  },
  {
   "id": "5-distribuciones-continuas-tabla--gamma-densidad",
   "unidad": "4",
   "seccion": "5 · Distribuciones continuas (tabla)",
   "subseccion": "",
   "nombre": "$\\text{Gamma}(\\alpha,\\lambda)$",
   "tex": "\\dfrac{\\lambda^{\\alpha}x^{\\alpha-1}e^{-\\lambda x}}{\\Gamma(\\alpha)}",
   "variante": "Densidad $f_X(x)$",
   "cuando": "Tiempo hasta acumular varios eventos exponenciales, con forma α no necesariamente entera. Esta celda da la densidad.",
   "condiciones": [
    "α > 0"
   ],
   "slug": "distribucion-gamma",
   "ancla": "",
   "tags": [
    "distribucion",
    "continua",
    "gamma",
    "tabla"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 281,
    "tipo": "tabla"
   }
  },
  {
   "id": "5-distribuciones-continuas-tabla--gamma-ex",
   "unidad": "4",
   "seccion": "5 · Distribuciones continuas (tabla)",
   "subseccion": "",
   "nombre": "$\\text{Gamma}(\\alpha,\\lambda)$",
   "tex": "\\dfrac{\\alpha}{\\lambda}",
   "variante": "$E[X]$",
   "cuando": "Tiempo hasta acumular varios eventos exponenciales, con forma α no necesariamente entera. Esta celda da la media.",
   "condiciones": [
    "α > 0"
   ],
   "slug": "distribucion-gamma",
   "ancla": "",
   "tags": [
    "distribucion",
    "continua",
    "gamma",
    "tabla"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 281,
    "tipo": "tabla"
   }
  },
  {
   "id": "5-distribuciones-continuas-tabla--gamma-vx",
   "unidad": "4",
   "seccion": "5 · Distribuciones continuas (tabla)",
   "subseccion": "",
   "nombre": "$\\text{Gamma}(\\alpha,\\lambda)$",
   "tex": "\\dfrac{\\alpha}{\\lambda^2}",
   "variante": "$V(X)$",
   "cuando": "Tiempo hasta acumular varios eventos exponenciales, con forma α no necesariamente entera. Esta celda da la varianza.",
   "condiciones": [
    "α > 0"
   ],
   "slug": "distribucion-gamma",
   "ancla": "",
   "tags": [
    "distribucion",
    "continua",
    "gamma",
    "tabla"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 281,
    "tipo": "tabla"
   }
  },
  {
   "id": "5-distribuciones-continuas-tabla--erlangk-soporte",
   "unidad": "4",
   "seccion": "5 · Distribuciones continuas (tabla)",
   "subseccion": "",
   "nombre": "$\\text{Erlang}_k(\\lambda)$",
   "tex": "t>0",
   "variante": "Soporte $\\mathcal{R}_X$",
   "cuando": "Tiempo hasta la k-ésima ocurrencia de un proceso de Poisson (sistema en standby con k etapas). Esta celda da el soporte, que fija los límites de la integral.",
   "condiciones": [
    "k entero",
    "eventos Poisson"
   ],
   "slug": "distribucion-erlang",
   "ancla": "",
   "tags": [
    "distribucion",
    "continua",
    "erlang",
    "tabla"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 282,
    "tipo": "tabla"
   }
  },
  {
   "id": "5-distribuciones-continuas-tabla--erlangk-densidad",
   "unidad": "4",
   "seccion": "5 · Distribuciones continuas (tabla)",
   "subseccion": "",
   "nombre": "$\\text{Erlang}_k(\\lambda)$",
   "tex": "\\dfrac{\\lambda^{k}t^{k-1}e^{-\\lambda t}}{(k-1)!}",
   "variante": "Densidad $f_X(x)$",
   "cuando": "Tiempo hasta la k-ésima ocurrencia de un proceso de Poisson (sistema en standby con k etapas). Esta celda da la densidad.",
   "condiciones": [
    "k entero",
    "eventos Poisson"
   ],
   "slug": "distribucion-erlang",
   "ancla": "",
   "tags": [
    "distribucion",
    "continua",
    "erlang",
    "tabla"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 282,
    "tipo": "tabla"
   }
  },
  {
   "id": "5-distribuciones-continuas-tabla--erlangk-fda",
   "unidad": "4",
   "seccion": "5 · Distribuciones continuas (tabla)",
   "subseccion": "",
   "nombre": "$\\text{Erlang}_k(\\lambda)$",
   "tex": "1-\\displaystyle\\sum_{j=0}^{k-1}\\dfrac{(\\lambda t)^{j}}{j!}e^{-\\lambda t}",
   "variante": "FDA $F_X(x)$",
   "cuando": "Tiempo hasta la k-ésima ocurrencia de un proceso de Poisson (sistema en standby con k etapas). Esta celda da la FDA, para probabilidades de intervalos y colas.",
   "condiciones": [
    "k entero",
    "eventos Poisson"
   ],
   "slug": "distribucion-erlang",
   "ancla": "",
   "tags": [
    "distribucion",
    "continua",
    "erlang",
    "tabla"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 282,
    "tipo": "tabla"
   }
  },
  {
   "id": "5-distribuciones-continuas-tabla--erlangk-ex",
   "unidad": "4",
   "seccion": "5 · Distribuciones continuas (tabla)",
   "subseccion": "",
   "nombre": "$\\text{Erlang}_k(\\lambda)$",
   "tex": "\\dfrac{k}{\\lambda}",
   "variante": "$E[X]$",
   "cuando": "Tiempo hasta la k-ésima ocurrencia de un proceso de Poisson (sistema en standby con k etapas). Esta celda da la media.",
   "condiciones": [
    "k entero",
    "eventos Poisson"
   ],
   "slug": "distribucion-erlang",
   "ancla": "",
   "tags": [
    "distribucion",
    "continua",
    "erlang",
    "tabla"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 282,
    "tipo": "tabla"
   }
  },
  {
   "id": "5-distribuciones-continuas-tabla--erlangk-vx",
   "unidad": "4",
   "seccion": "5 · Distribuciones continuas (tabla)",
   "subseccion": "",
   "nombre": "$\\text{Erlang}_k(\\lambda)$",
   "tex": "\\dfrac{k}{\\lambda^2}",
   "variante": "$V(X)$",
   "cuando": "Tiempo hasta la k-ésima ocurrencia de un proceso de Poisson (sistema en standby con k etapas). Esta celda da la varianza.",
   "condiciones": [
    "k entero",
    "eventos Poisson"
   ],
   "slug": "distribucion-erlang",
   "ancla": "",
   "tags": [
    "distribucion",
    "continua",
    "erlang",
    "tabla"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 282,
    "tipo": "tabla"
   }
  },
  {
   "id": "5-distribuciones-continuas-tabla--weibullb-soporte",
   "unidad": "4",
   "seccion": "5 · Distribuciones continuas (tabla)",
   "subseccion": "",
   "nombre": "$\\text{Weibull}(\\lambda,b)$",
   "tex": "x>0",
   "variante": "Soporte $\\mathcal{R}_X$",
   "cuando": "Duraciones con tasa de fallas que cambia con el tiempo: desgaste (b > 1) o mortalidad infantil (b < 1). Esta celda da el soporte, que fija los límites de la integral.",
   "condiciones": [
    "b > 0"
   ],
   "slug": "distribucion-weibull",
   "ancla": "",
   "tags": [
    "distribucion",
    "continua",
    "weibull",
    "confiabilidad",
    "tabla"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 283,
    "tipo": "tabla"
   }
  },
  {
   "id": "5-distribuciones-continuas-tabla--weibullb-densidad",
   "unidad": "4",
   "seccion": "5 · Distribuciones continuas (tabla)",
   "subseccion": "",
   "nombre": "$\\text{Weibull}(\\lambda,b)$",
   "tex": "\\lambda\\,b\\,(\\lambda x)^{b-1}\\exp\\!\\big(-(\\lambda x)^b\\big)",
   "variante": "Densidad $f_X(x)$",
   "cuando": "Duraciones con tasa de fallas que cambia con el tiempo: desgaste (b > 1) o mortalidad infantil (b < 1). Esta celda da la densidad.",
   "condiciones": [
    "b > 0"
   ],
   "slug": "distribucion-weibull",
   "ancla": "",
   "tags": [
    "distribucion",
    "continua",
    "weibull",
    "confiabilidad",
    "tabla"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 283,
    "tipo": "tabla"
   }
  },
  {
   "id": "5-distribuciones-continuas-tabla--weibullb-fda",
   "unidad": "4",
   "seccion": "5 · Distribuciones continuas (tabla)",
   "subseccion": "",
   "nombre": "$\\text{Weibull}(\\lambda,b)$",
   "tex": "1-\\exp\\!\\big(-(\\lambda x)^b\\big)",
   "variante": "FDA $F_X(x)$",
   "cuando": "Duraciones con tasa de fallas que cambia con el tiempo: desgaste (b > 1) o mortalidad infantil (b < 1). Esta celda da la FDA, para probabilidades de intervalos y colas.",
   "condiciones": [
    "b > 0"
   ],
   "slug": "distribucion-weibull",
   "ancla": "",
   "tags": [
    "distribucion",
    "continua",
    "weibull",
    "confiabilidad",
    "tabla"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 283,
    "tipo": "tabla"
   }
  },
  {
   "id": "5-distribuciones-continuas-tabla--weibullb-ex",
   "unidad": "4",
   "seccion": "5 · Distribuciones continuas (tabla)",
   "subseccion": "",
   "nombre": "$\\text{Weibull}(\\lambda,b)$",
   "tex": "\\dfrac{1}{\\lambda}\\Gamma\\!\\left(1+\\tfrac1b\\right)",
   "variante": "$E[X]$",
   "cuando": "Duraciones con tasa de fallas que cambia con el tiempo: desgaste (b > 1) o mortalidad infantil (b < 1). Esta celda da la media.",
   "condiciones": [
    "b > 0"
   ],
   "slug": "distribucion-weibull",
   "ancla": "",
   "tags": [
    "distribucion",
    "continua",
    "weibull",
    "confiabilidad",
    "tabla"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 283,
    "tipo": "tabla"
   }
  },
  {
   "id": "5-distribuciones-continuas-tabla--weibullb-vx",
   "unidad": "4",
   "seccion": "5 · Distribuciones continuas (tabla)",
   "subseccion": "",
   "nombre": "$\\text{Weibull}(\\lambda,b)$",
   "tex": "\\dfrac{1}{\\lambda^2}\\!\\left[\\Gamma\\!\\left(1+\\tfrac2b\\right)-\\Gamma\\!\\left(1+\\tfrac1b\\right)^2\\right]",
   "variante": "$V(X)$",
   "cuando": "Duraciones con tasa de fallas que cambia con el tiempo: desgaste (b > 1) o mortalidad infantil (b < 1). Esta celda da la varianza.",
   "condiciones": [
    "b > 0"
   ],
   "slug": "distribucion-weibull",
   "ancla": "",
   "tags": [
    "distribucion",
    "continua",
    "weibull",
    "confiabilidad",
    "tabla"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 283,
    "tipo": "tabla"
   }
  },
  {
   "id": "5-distribuciones-continuas-tabla--2k-soporte",
   "unidad": "4",
   "seccion": "5 · Distribuciones continuas (tabla)",
   "subseccion": "",
   "nombre": "$\\chi^2_k$",
   "tex": "(0,\\infty)",
   "variante": "Soporte $\\mathcal{R}_X$",
   "cuando": "Suma de cuadrados de normales estándar; aparece en inferencia para la varianza muestral. Esta celda da el soporte, que fija los límites de la integral.",
   "condiciones": [
    "k grados de libertad"
   ],
   "slug": "distribucion-ji-cuadrado",
   "ancla": "",
   "tags": [
    "distribucion",
    "continua",
    "ji-cuadrado",
    "inferencia",
    "tabla"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 284,
    "tipo": "tabla"
   }
  },
  {
   "id": "5-distribuciones-continuas-tabla--2k-densidad",
   "unidad": "4",
   "seccion": "5 · Distribuciones continuas (tabla)",
   "subseccion": "",
   "nombre": "$\\chi^2_k$",
   "tex": "\\dfrac{x^{k/2-1}e^{-x/2}}{2^{k/2}\\,\\Gamma\\!\\left(\\tfrac{k}{2}\\right)}",
   "variante": "Densidad $f_X(x)$",
   "cuando": "Suma de cuadrados de normales estándar; aparece en inferencia para la varianza muestral. Esta celda da la densidad.",
   "condiciones": [
    "k grados de libertad"
   ],
   "slug": "distribucion-ji-cuadrado",
   "ancla": "",
   "tags": [
    "distribucion",
    "continua",
    "ji-cuadrado",
    "inferencia",
    "tabla"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 284,
    "tipo": "tabla"
   }
  },
  {
   "id": "5-distribuciones-continuas-tabla--2k-ex",
   "unidad": "4",
   "seccion": "5 · Distribuciones continuas (tabla)",
   "subseccion": "",
   "nombre": "$\\chi^2_k$",
   "tex": "k",
   "variante": "$E[X]$",
   "cuando": "Suma de cuadrados de normales estándar; aparece en inferencia para la varianza muestral. Esta celda da la media.",
   "condiciones": [
    "k grados de libertad"
   ],
   "slug": "distribucion-ji-cuadrado",
   "ancla": "",
   "tags": [
    "distribucion",
    "continua",
    "ji-cuadrado",
    "inferencia",
    "tabla"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 284,
    "tipo": "tabla"
   }
  },
  {
   "id": "5-distribuciones-continuas-tabla--2k-vx",
   "unidad": "4",
   "seccion": "5 · Distribuciones continuas (tabla)",
   "subseccion": "",
   "nombre": "$\\chi^2_k$",
   "tex": "2k",
   "variante": "$V(X)$",
   "cuando": "Suma de cuadrados de normales estándar; aparece en inferencia para la varianza muestral. Esta celda da la varianza.",
   "condiciones": [
    "k grados de libertad"
   ],
   "slug": "distribucion-ji-cuadrado",
   "ancla": "",
   "tags": [
    "distribucion",
    "continua",
    "ji-cuadrado",
    "inferencia",
    "tabla"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 284,
    "tipo": "tabla"
   }
  },
  {
   "id": "5-distribuciones-continuas-tabla--tm-soporte",
   "unidad": "4",
   "seccion": "5 · Distribuciones continuas (tabla)",
   "subseccion": "",
   "nombre": "$t_m$",
   "tex": "\\mathbb{R}",
   "variante": "Soporte $\\mathcal{R}_X$",
   "cuando": "Estandarización de la media con el desvío muestral y n chico: colas más pesadas que la normal. Esta celda da el soporte, que fija los límites de la integral.",
   "condiciones": [
    "σ desconocido",
    "n chico"
   ],
   "slug": "distribucion-t-de-student",
   "ancla": "",
   "tags": [
    "distribucion",
    "continua",
    "t-student",
    "inferencia",
    "tabla"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 285,
    "tipo": "tabla"
   }
  },
  {
   "id": "5-distribuciones-continuas-tabla--tm-densidad",
   "unidad": "4",
   "seccion": "5 · Distribuciones continuas (tabla)",
   "subseccion": "",
   "nombre": "$t_m$",
   "tex": "\\dfrac{1}{\\sqrt{m\\pi}}\\dfrac{\\Gamma\\!\\left(\\tfrac{m+1}{2}\\right)}{\\Gamma\\!\\left(\\tfrac{m}{2}\\right)}\\!\\left(1+\\tfrac{t^2}{m}\\right)^{-\\frac{m+1}{2}}",
   "variante": "Densidad $f_X(x)$",
   "cuando": "Estandarización de la media con el desvío muestral y n chico: colas más pesadas que la normal. Esta celda da la densidad.",
   "condiciones": [
    "σ desconocido",
    "n chico"
   ],
   "slug": "distribucion-t-de-student",
   "ancla": "",
   "tags": [
    "distribucion",
    "continua",
    "t-student",
    "inferencia",
    "tabla"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 285,
    "tipo": "tabla"
   }
  },
  {
   "id": "5-distribuciones-continuas-tabla--tm-ex",
   "unidad": "4",
   "seccion": "5 · Distribuciones continuas (tabla)",
   "subseccion": "",
   "nombre": "$t_m$",
   "tex": "0\\text{ (}m>1\\text{)}",
   "variante": "$E[X]$",
   "cuando": "Estandarización de la media con el desvío muestral y n chico: colas más pesadas que la normal. Esta celda da la media.",
   "condiciones": [
    "σ desconocido",
    "n chico"
   ],
   "slug": "distribucion-t-de-student",
   "ancla": "",
   "tags": [
    "distribucion",
    "continua",
    "t-student",
    "inferencia",
    "tabla"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 285,
    "tipo": "tabla"
   }
  },
  {
   "id": "5-distribuciones-continuas-tabla--tm-vx",
   "unidad": "4",
   "seccion": "5 · Distribuciones continuas (tabla)",
   "subseccion": "",
   "nombre": "$t_m$",
   "tex": "\\dfrac{m}{m-2}\\text{ (}m>2\\text{)}",
   "variante": "$V(X)$",
   "cuando": "Estandarización de la media con el desvío muestral y n chico: colas más pesadas que la normal. Esta celda da la varianza.",
   "condiciones": [
    "σ desconocido",
    "n chico"
   ],
   "slug": "distribucion-t-de-student",
   "ancla": "",
   "tags": [
    "distribucion",
    "continua",
    "t-student",
    "inferencia",
    "tabla"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 285,
    "tipo": "tabla"
   }
  },
  {
   "id": "5-distribuciones-continuas-tabla--exponencial",
   "unidad": "4",
   "seccion": "5 · Distribuciones continuas (tabla)",
   "subseccion": "Notas (una línea)",
   "nombre": "Exponencial",
   "tex": "\\text{única continua }\\textbf{sin memoria}\\text{ — }P(X>x+\\Delta\\mid X>x)=P(X>\\Delta)\\text{; tasa de fallas constante }\\lambda\\text{; }P(X>x)=e^{-\\lambda x}\\text{.}",
   "cuando": "Enunciados con «ya funcionó x horas, cuál es la probabilidad de que dure Δ más»: la exponencial olvida lo transcurrido.",
   "condiciones": [
    "sin memoria"
   ],
   "slug": "distribucion-exponencial",
   "ancla": "",
   "tags": [
    "continua",
    "exponencial",
    "sin-memoria"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 290,
    "tipo": "vineta"
   }
  },
  {
   "id": "5-distribuciones-continuas-tabla--gamma",
   "unidad": "4",
   "seccion": "5 · Distribuciones continuas (tabla)",
   "subseccion": "Notas (una línea)",
   "nombre": "Gamma",
   "tex": "\\text{suma de }\\alpha\\text{ exponenciales i.i.d. de tasa }\\lambda\\text{ (}\\text{Gamma}(1,\\lambda)=\\text{Expo}(\\lambda)\\text{).}",
   "cuando": "Justifica reconocer una Gamma cuando el enunciado suma tiempos exponenciales independientes de la misma tasa.",
   "condiciones": [
    "i.i.d.",
    "misma tasa"
   ],
   "slug": "distribucion-gamma",
   "ancla": "",
   "tags": [
    "continua",
    "gamma",
    "suma"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 291,
    "tipo": "vineta"
   }
  },
  {
   "id": "5-distribuciones-continuas-tabla--erlang",
   "unidad": "4",
   "seccion": "5 · Distribuciones continuas (tabla)",
   "subseccion": "Notas (una línea)",
   "nombre": "Erlang",
   "tex": "\\text{Gamma de forma }\\textbf{entera}\\text{ }k\\ =\\text{ tiempo hasta la }k\\text{-ésima ocurrencia de un Poisson; dualidad }\\{T_k>t\\}\\Leftrightarrow\\{N(t)\\le k-1\\}\\text{, }N(t)\\sim\\text{Poisson}(\\lambda t)\\text{.}",
   "cuando": "Dualidad clave: preguntar por el tiempo hasta el k-ésimo evento equivale a preguntar por el conteo de eventos hasta t.",
   "condiciones": [
    "proceso de Poisson"
   ],
   "slug": "distribucion-erlang",
   "ancla": "",
   "tags": [
    "continua",
    "erlang",
    "poisson",
    "dualidad"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 292,
    "tipo": "vineta"
   }
  },
  {
   "id": "5-distribuciones-continuas-tabla--weibull",
   "unidad": "4",
   "seccion": "5 · Distribuciones continuas (tabla)",
   "subseccion": "Notas (una línea)",
   "nombre": "Weibull",
   "tex": "b=1\\ \\Rightarrow\\text{ exponencial; tasa de fallas }R(x)=\\lambda b(\\lambda x)^{b-1}\\text{ (}b>1\\text{ desgaste, }b<1\\text{ mortalidad infantil).}",
   "cuando": "Identifica el tipo de envejecimiento a partir del parámetro de forma b.",
   "condiciones": [
    "b > 0"
   ],
   "slug": "distribucion-weibull",
   "ancla": "",
   "tags": [
    "continua",
    "weibull",
    "confiabilidad"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 293,
    "tipo": "vineta"
   }
  },
  {
   "id": "5-distribuciones-continuas-tabla--ji-cuadrado",
   "unidad": "4",
   "seccion": "5 · Distribuciones continuas (tabla)",
   "subseccion": "Notas (una línea)",
   "nombre": "Ji-cuadrado",
   "tex": "\\chi^2_k=\\sum_{i=1}^k Z_i^2\\text{ con }Z_i\\sim N(0,1)\\text{ i.i.d.; en inferencia }\\dfrac{(n-1)S_n^2}{\\sigma^2}\\sim\\chi^2_{n-1}\\text{; es }\\text{Gamma}\\!\\left(\\tfrac{k}{2},\\tfrac12\\right)\\text{.}",
   "cuando": "Aparece al estudiar la varianza muestral de una población normal, base del IC para σ².",
   "condiciones": [
    "población normal"
   ],
   "slug": "distribucion-ji-cuadrado",
   "ancla": "",
   "tags": [
    "continua",
    "ji-cuadrado",
    "inferencia"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 294,
    "tipo": "vineta"
   }
  },
  {
   "id": "5-distribuciones-continuas-tabla--t-student",
   "unidad": "4",
   "seccion": "5 · Distribuciones continuas (tabla)",
   "subseccion": "Notas (una línea)",
   "nombre": "t-Student",
   "tex": "T=\\dfrac{\\overline X_n-\\mu}{S_n/\\sqrt n}\\sim t_{n-1}\\text{; colas más pesadas que la normal, converge a }N(0,1)\\text{ cuando }m=n-1\\to\\infty\\text{.}",
   "cuando": "Justifica usar t en vez de Z cuando se estima el desvío con la muestra.",
   "condiciones": [
    "σ desconocido",
    "población normal"
   ],
   "slug": "distribucion-t-de-student",
   "ancla": "",
   "tags": [
    "continua",
    "t-student",
    "inferencia"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 295,
    "tipo": "vineta"
   }
  },
  {
   "id": "6-normal-estandar-y--normal-estandar",
   "unidad": "4",
   "seccion": "6 · Normal estándar y estandarización",
   "subseccion": "Normal estándar $Z\\sim N(0,1)$",
   "nombre": "Normal estándar $Z\\sim N(0,1)$",
   "tex": "f_Z(z)=\\frac{1}{\\sqrt{2\\pi}}\\,e^{-z^2/2},\\qquad \\Phi(z)\\overset{\\text{def}}{=}F_Z(z)=P(Z\\le z)=\\int_{-\\infty}^{z}\\frac{1}{\\sqrt{2\\pi}}e^{-y^2/2}\\,dy.",
   "cuando": "Densidad y FDA de la normal estándar; la FDA no tiene forma cerrada y se lee de la tabla de Φ.",
   "condiciones": [
    "Z ~ N(0,1)"
   ],
   "slug": "distribucion-normal",
   "ancla": "",
   "tags": [
    "normal",
    "tabla"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 303,
    "tipo": "bloque"
   }
  },
  {
   "id": "6-normal-estandar-y--guia",
   "unidad": "4",
   "seccion": "6 · Normal estándar y estandarización",
   "subseccion": "Normal estándar $Z\\sim N(0,1)$",
   "nombre": "Guía",
   "tex": "\\Phi(0)=0.5\\text{, }\\Phi(+\\infty)=1\\text{, }\\Phi(-\\infty)=0",
   "cuando": "Valores de referencia de Φ para controlar que la lectura de la tabla tenga sentido.",
   "condiciones": [
    "Z ~ N(0,1)"
   ],
   "slug": "distribucion-normal",
   "ancla": "",
   "tags": [
    "normal",
    "tabla"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 305,
    "tipo": "parrafo"
   }
  },
  {
   "id": "6-normal-estandar-y--estandarizacion",
   "unidad": "4",
   "seccion": "6 · Normal estándar y estandarización",
   "subseccion": "Estandarización",
   "nombre": "Estandarización",
   "tex": "Z=\\frac{X-\\mu}{\\sigma}\\sim N(0,1),\\qquad F_X(x)=P(X\\le x)=\\Phi\\!\\left(\\frac{x-\\mu}{\\sigma}\\right).",
   "cuando": "Cualquier probabilidad de una normal se pasa a la tabla estándar restando la media y dividiendo por el desvío.",
   "condiciones": [
    "X normal"
   ],
   "slug": "distribucion-normal",
   "ancla": "",
   "tags": [
    "normal",
    "estandarizacion"
   ],
   "esencial": true,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 309,
    "tipo": "bloque"
   }
  },
  {
   "id": "6-normal-estandar-y--simetria",
   "unidad": "4",
   "seccion": "6 · Normal estándar y estandarización",
   "subseccion": "Estandarización",
   "nombre": "Simetría",
   "tex": "\\boxed{\\ \\Phi(-z)=1-\\Phi(z)\\ }\\text{ (permite usar tabla solo con }z\\ge0\\text{).}",
   "cuando": "Permite usar la tabla, que solo trae z ≥ 0, cuando el valor estandarizado da negativo.",
   "condiciones": [
    "Z ~ N(0,1)"
   ],
   "slug": "distribucion-normal",
   "ancla": "",
   "tags": [
    "normal",
    "tabla"
   ],
   "esencial": true,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 312,
    "tipo": "vineta"
   }
  },
  {
   "id": "6-normal-estandar-y--pxx",
   "unidad": "4",
   "seccion": "6 · Normal estándar y estandarización",
   "subseccion": "Estandarización",
   "nombre": "$P(X>x)$",
   "tex": "1-\\Phi\\!\\left(\\frac{x-\\mu}{\\sigma}\\right)",
   "cuando": "Piden la probabilidad de superar un valor: se estandariza y se resta de 1.",
   "condiciones": [
    "X normal"
   ],
   "slug": "distribucion-normal",
   "ancla": "",
   "tags": [
    "normal",
    "estandarizacion"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 316,
    "tipo": "tabla"
   }
  },
  {
   "id": "6-normal-estandar-y--paxb",
   "unidad": "4",
   "seccion": "6 · Normal estándar y estandarización",
   "subseccion": "Estandarización",
   "nombre": "$P(a<X\\le b)$",
   "tex": "\\Phi\\!\\left(\\frac{b-\\mu}{\\sigma}\\right)-\\Phi\\!\\left(\\frac{a-\\mu}{\\sigma}\\right)",
   "cuando": "Piden la probabilidad de caer entre dos valores: se estandarizan ambos extremos y se restan los Φ.",
   "condiciones": [
    "X normal"
   ],
   "slug": "distribucion-normal",
   "ancla": "",
   "tags": [
    "normal",
    "estandarizacion"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 317,
    "tipo": "tabla"
   }
  },
  {
   "id": "6-normal-estandar-y--pkxk",
   "unidad": "4",
   "seccion": "6 · Normal estándar y estandarización",
   "subseccion": "Estandarización",
   "nombre": "$P(\\mu-k\\sigma<X<\\mu+k\\sigma)$",
   "tex": "2\\Phi(k)-1",
   "cuando": "Intervalo simétrico alrededor de la media medido en desvíos: sale con un solo valor de la tabla.",
   "condiciones": [
    "X normal",
    "intervalo simétrico"
   ],
   "slug": "distribucion-normal",
   "ancla": "",
   "tags": [
    "normal",
    "estandarizacion"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 318,
    "tipo": "tabla"
   }
  },
  {
   "id": "6-normal-estandar-y--fractiles-cuantiles-problema-inverso",
   "unidad": "4",
   "seccion": "6 · Normal estándar y estandarización",
   "subseccion": "Fractiles / cuantiles (problema inverso)",
   "nombre": "Fractiles / cuantiles (problema inverso)",
   "tex": "z_\\alpha=\\Phi^{-1}(\\alpha),\\qquad x_\\alpha=\\mu+\\sigma\\,z_\\alpha,\\qquad \\boxed{\\ z_{1-\\alpha}=-z_\\alpha\\ }.",
   "cuando": "Problema inverso: dan la probabilidad y piden el valor de x (percentil, garantía, umbral). Se entra a la tabla al revés.",
   "condiciones": [
    "X normal"
   ],
   "slug": "distribucion-normal",
   "ancla": "",
   "tags": [
    "normal",
    "fractiles"
   ],
   "esencial": true,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 322,
    "tipo": "bloque"
   }
  },
  {
   "id": "6-normal-estandar-y--z-090",
   "unidad": "4",
   "seccion": "6 · Normal estándar y estandarización",
   "subseccion": "Fractiles / cuantiles (problema inverso)",
   "nombre": "$z_\\alpha$",
   "tex": "z_\\alpha=1.2816",
   "variante": "$\\alpha=0.90$",
   "cuando": "Fractil de uso frecuente: cuantil 0.90 de la normal estándar.",
   "condiciones": [],
   "slug": "distribucion-normal",
   "ancla": "",
   "tags": [
    "normal",
    "fractiles",
    "tabla"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 326,
    "tipo": "tabla"
   }
  },
  {
   "id": "6-normal-estandar-y--z-095",
   "unidad": "4",
   "seccion": "6 · Normal estándar y estandarización",
   "subseccion": "Fractiles / cuantiles (problema inverso)",
   "nombre": "$z_\\alpha$",
   "tex": "z_\\alpha=1.6449",
   "variante": "$\\alpha=0.95$",
   "cuando": "Fractil de uso frecuente: cuantil 0.95, el de los intervalos unilaterales al 95 %.",
   "condiciones": [],
   "slug": "distribucion-normal",
   "ancla": "",
   "tags": [
    "normal",
    "fractiles",
    "tabla"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 326,
    "tipo": "tabla"
   }
  },
  {
   "id": "6-normal-estandar-y--z-0975",
   "unidad": "4",
   "seccion": "6 · Normal estándar y estandarización",
   "subseccion": "Fractiles / cuantiles (problema inverso)",
   "nombre": "$z_\\alpha$",
   "tex": "z_\\alpha=1.96",
   "variante": "$\\alpha=0.975$",
   "cuando": "Fractil de uso frecuente: cuantil 0.975, el 1.96 del intervalo bilateral al 95 %.",
   "condiciones": [],
   "slug": "distribucion-normal",
   "ancla": "",
   "tags": [
    "normal",
    "fractiles",
    "tabla"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 326,
    "tipo": "tabla"
   }
  },
  {
   "id": "6-normal-estandar-y--z-099",
   "unidad": "4",
   "seccion": "6 · Normal estándar y estandarización",
   "subseccion": "Fractiles / cuantiles (problema inverso)",
   "nombre": "$z_\\alpha$",
   "tex": "z_\\alpha=2.3263",
   "variante": "$\\alpha=0.99$",
   "cuando": "Fractil de uso frecuente: cuantil 0.99.",
   "condiciones": [],
   "slug": "distribucion-normal",
   "ancla": "",
   "tags": [
    "normal",
    "fractiles",
    "tabla"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 326,
    "tipo": "tabla"
   }
  },
  {
   "id": "6-normal-estandar-y--z-0995",
   "unidad": "4",
   "seccion": "6 · Normal estándar y estandarización",
   "subseccion": "Fractiles / cuantiles (problema inverso)",
   "nombre": "$z_\\alpha$",
   "tex": "z_\\alpha=2.5758",
   "variante": "$\\alpha=0.995$",
   "cuando": "Fractil de uso frecuente: cuantil 0.995, el del intervalo bilateral al 99 %.",
   "condiciones": [],
   "slug": "distribucion-normal",
   "ancla": "",
   "tags": [
    "normal",
    "fractiles",
    "tabla"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 326,
    "tipo": "tabla"
   }
  },
  {
   "id": "6-normal-estandar-y--regla-empirica-68-95-99-7",
   "unidad": "4",
   "seccion": "6 · Normal estándar y estandarización",
   "subseccion": "Regla empírica (68–95–99.7)",
   "nombre": "Regla empírica (68–95–99.7)",
   "tex": "P(|X-\\mu|<\\sigma)\\approx0.6827,\\quad P(|X-\\mu|<2\\sigma)\\approx0.9545,\\quad P(|X-\\mu|<3\\sigma)\\approx0.9973.",
   "cuando": "Chequeo rápido de razonabilidad: qué fracción de los datos cae a uno, dos y tres desvíos de la media.",
   "condiciones": [
    "X normal"
   ],
   "slug": "distribucion-normal",
   "ancla": "regla-empírica-6895997",
   "tags": [
    "normal",
    "regla-empirica"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 330,
    "tipo": "bloque"
   }
  },
  {
   "id": "6-normal-estandar-y--cuartiles",
   "unidad": "4",
   "seccion": "6 · Normal estándar y estandarización",
   "subseccion": "Valores notables de $Z$",
   "nombre": "Cuartiles",
   "tex": "Q_{1,3}=\\mp0.6745\\text{, rango intercuartílico }I_Q=1.349\\,\\sigma\\text{ (en }X\\text{: }Q_{1,3}=\\mu\\mp0.6745\\sigma\\text{).}",
   "cuando": "Cuartiles y rango intercuartílico de una normal; sirve para armar el boxplot teórico.",
   "condiciones": [
    "X normal"
   ],
   "slug": "distribucion-normal",
   "ancla": "",
   "tags": [
    "normal",
    "cuartiles"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 334,
    "tipo": "vineta"
   }
  },
  {
   "id": "6-normal-estandar-y--valores-notables-de",
   "unidad": "4",
   "seccion": "6 · Normal estándar y estandarización",
   "subseccion": "Valores notables de $Z$",
   "nombre": "Valores notables de $Z$",
   "tex": "E[|Z|]=\\sqrt{2/\\pi}\\approx0.798",
   "cuando": "Desvío absoluto medio de la normal estándar (distribución semi-normal).",
   "condiciones": [
    "Z ~ N(0,1)"
   ],
   "slug": "distribucion-normal",
   "ancla": "",
   "tags": [
    "normal",
    "momentos"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 335,
    "tipo": "vineta"
   }
  },
  {
   "id": "6-normal-estandar-y--outliers-de-tukey-en-una-normal",
   "unidad": "4",
   "seccion": "6 · Normal estándar y estandarización",
   "subseccion": "Valores notables de $Z$",
   "nombre": "Outliers de Tukey en una normal",
   "tex": "P(\\text{outlier})=2\\Phi(-2.698)\\approx0.7\\%\\text{.}",
   "cuando": "Cuánto vale la probabilidad de ser outlier de Tukey si los datos son normales.",
   "condiciones": [
    "X normal"
   ],
   "slug": "distribucion-normal",
   "ancla": "",
   "tags": [
    "normal",
    "boxplot"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 336,
    "tipo": "vineta"
   }
  },
  {
   "id": "6-normal-estandar-y--interpolacion-lineal-en-la-tabla",
   "unidad": "4",
   "seccion": "6 · Normal estándar y estandarización",
   "subseccion": "Interpolación lineal en la tabla",
   "nombre": "Interpolación lineal en la tabla",
   "tex": "\\Phi(z)\\approx \\Phi(z_1)+\\frac{\\Phi(z_2)-\\Phi(z_1)}{z_2-z_1}\\,(z-z_1).",
   "cuando": "El valor estandarizado cae entre dos filas de la tabla: se interpola linealmente.",
   "condiciones": [
    "tabla de Φ"
   ],
   "slug": "distribucion-normal",
   "ancla": "",
   "tags": [
    "normal",
    "tabla"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 341,
    "tipo": "bloque"
   }
  },
  {
   "id": "6-normal-estandar-y--aproximacion-normal-de-la-binomial-de",
   "unidad": "4",
   "seccion": "6 · Normal estándar y estandarización",
   "subseccion": "Aproximación normal de la binomial (De Moivre–Laplace)",
   "nombre": "Aproximación normal de la binomial (De Moivre–Laplace)",
   "tex": "\\mathrm{Bin}(n,p)\\;\\approx\\;N\\big(np,\\;\\sqrt{npq}\\big).",
   "cuando": "Binomial con n grande donde calcular la suma de PMF sería interminable: se aproxima con una normal de la misma media y desvío.",
   "condiciones": [
    "np ≥ 5",
    "nq ≥ 5"
   ],
   "slug": "aproximacion-normal-de-la-binomial",
   "ancla": "",
   "tags": [
    "normal",
    "binomial",
    "aproximacion"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 347,
    "tipo": "bloque"
   }
  },
  {
   "id": "6-normal-estandar-y--condicion",
   "unidad": "4",
   "seccion": "6 · Normal estándar y estandarización",
   "subseccion": "Aproximación normal de la binomial (De Moivre–Laplace)",
   "nombre": "Condición",
   "tex": "np\\ge5\\text{ y }nq\\ge5\\text{. Si }p\\approx0\\text{ con }np\\text{ moderado, usar Poisson}",
   "cuando": "Antes de aproximar una binomial por la normal: si no se cumple np ≥ 5 y nq ≥ 5, conviene Poisson.",
   "condiciones": [
    "np ≥ 5",
    "nq ≥ 5"
   ],
   "slug": "aproximacion-normal-de-la-binomial",
   "ancla": "",
   "tags": [
    "normal",
    "binomial",
    "aproximacion"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 348,
    "tipo": "parrafo"
   }
  },
  {
   "id": "6-normal-estandar-y--correccion-por-continuidad",
   "unidad": "4",
   "seccion": "6 · Normal estándar y estandarización",
   "subseccion": "Aproximación normal de la binomial (De Moivre–Laplace)",
   "nombre": "Corrección por continuidad",
   "tex": "\\begin{aligned} P(S_n=s)&\\approx\\Phi\\!\\left(\\tfrac{s+\\frac12-np}{\\sqrt{npq}}\\right)-\\Phi\\!\\left(\\tfrac{s-\\frac12-np}{\\sqrt{npq}}\\right),\\\\ P(a\\le S_n\\le b)&\\approx\\Phi\\!\\left(\\tfrac{b+\\frac12-np}{\\sqrt{npq}}\\right)-\\Phi\\!\\left(\\tfrac{a-\\frac12-np}{\\sqrt{npq}}\\right). \\end{aligned}",
   "cuando": "Al aproximar una discreta por una continua hay que correr los extremos medio punto para no perder ni agregar masa.",
   "condiciones": [
    "variable discreta"
   ],
   "slug": "distribucion-poisson",
   "ancla": "",
   "tags": [
    "normal",
    "binomial",
    "aproximacion"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 351,
    "tipo": "bloque"
   }
  },
  {
   "id": "7-funcion-de-variable--metodo-general-via-la-fda-sirve",
   "unidad": "5",
   "seccion": "7 · Función de variable aleatoria Y=g(X)",
   "subseccion": "Método general (vía la FDA) — sirve siempre",
   "nombre": "Método general (vía la FDA) — sirve siempre",
   "tex": "F_Y(y)=P(Y\\le y)=P\\big(g(X)\\le y\\big)",
   "cuando": "Método que siempre funciona: escribir el evento {g(X) ≤ y} en términos de X y evaluarlo en la FDA de X.",
   "condiciones": [],
   "slug": "funcion-de-variable-aleatoria",
   "ancla": "",
   "tags": [
    "transformacion",
    "fda"
   ],
   "esencial": true,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 364,
    "tipo": "bloque"
   }
  },
  {
   "id": "7-funcion-de-variable--continua",
   "unidad": "5",
   "seccion": "7 · Función de variable aleatoria Y=g(X)",
   "subseccion": "Método general (vía la FDA) — sirve siempre",
   "nombre": "$Y$ continua",
   "tex": "f_Y(y)=\\dfrac{d}{dy}F_Y(y)",
   "cuando": "Último paso del método de la FDA cuando Y resulta continua: derivar F_Y para obtener la densidad.",
   "condiciones": [
    "Y continua"
   ],
   "slug": "funcion-de-variable-aleatoria",
   "ancla": "",
   "tags": [
    "transformacion",
    "densidad"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 366,
    "tipo": "vineta"
   }
  },
  {
   "id": "7-funcion-de-variable--discreta",
   "unidad": "5",
   "seccion": "7 · Función de variable aleatoria Y=g(X)",
   "subseccion": "Método general (vía la FDA) — sirve siempre",
   "nombre": "$Y$ discreta",
   "tex": "p_Y(k)=\\displaystyle\\sum_{x:\\,g(x)=k} p_X(x)\\text{.}",
   "cuando": "Último paso cuando Y es discreta: sumar las masas de todos los x que van a parar al mismo valor.",
   "condiciones": [
    "Y discreta"
   ],
   "slug": "funcion-de-variable-aleatoria",
   "ancla": "",
   "tags": [
    "transformacion",
    "pmf"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 367,
    "tipo": "vineta"
   }
  },
  {
   "id": "7-funcion-de-variable--creciente-evento-sobre",
   "unidad": "5",
   "seccion": "7 · Función de variable aleatoria Y=g(X)",
   "subseccion": "Método general (vía la FDA) — sirve siempre",
   "nombre": "creciente",
   "tex": "\\{X\\le g^{-1}(y)\\}",
   "variante": "evento sobre $X$",
   "cuando": "Traducción del evento cuando g es creciente: la desigualdad se conserva.",
   "condiciones": [
    "g creciente"
   ],
   "slug": "funcion-de-variable-aleatoria",
   "ancla": "",
   "tags": [
    "transformacion"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 373,
    "tipo": "tabla"
   }
  },
  {
   "id": "7-funcion-de-variable--creciente-fda-de",
   "unidad": "5",
   "seccion": "7 · Función de variable aleatoria Y=g(X)",
   "subseccion": "Método general (vía la FDA) — sirve siempre",
   "nombre": "creciente",
   "tex": "F_Y(y)=F_X\\!\\big(g^{-1}(y)\\big)",
   "variante": "FDA de $Y$",
   "cuando": "FDA de Y cuando g es creciente: se compone directamente con la inversa.",
   "condiciones": [
    "g creciente"
   ],
   "slug": "funcion-de-variable-aleatoria",
   "ancla": "",
   "tags": [
    "transformacion",
    "fda"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 373,
    "tipo": "tabla"
   }
  },
  {
   "id": "7-funcion-de-variable--decreciente-evento-sobre",
   "unidad": "5",
   "seccion": "7 · Función de variable aleatoria Y=g(X)",
   "subseccion": "Método general (vía la FDA) — sirve siempre",
   "nombre": "decreciente",
   "tex": "\\{X\\ge g^{-1}(y)\\}",
   "variante": "evento sobre $X$",
   "cuando": "Traducción del evento cuando g es decreciente: la desigualdad se invierte.",
   "condiciones": [
    "g decreciente"
   ],
   "slug": "funcion-de-variable-aleatoria",
   "ancla": "",
   "tags": [
    "transformacion"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 374,
    "tipo": "tabla"
   }
  },
  {
   "id": "7-funcion-de-variable--decreciente-fda-de",
   "unidad": "5",
   "seccion": "7 · Función de variable aleatoria Y=g(X)",
   "subseccion": "Método general (vía la FDA) — sirve siempre",
   "nombre": "decreciente",
   "tex": "F_Y(y)=1-F_X\\!\\big(g^{-1}(y)\\big)",
   "variante": "FDA de $Y$",
   "cuando": "FDA de Y cuando g es decreciente: aparece el complemento a 1.",
   "condiciones": [
    "g decreciente"
   ],
   "slug": "funcion-de-variable-aleatoria",
   "ancla": "",
   "tags": [
    "transformacion",
    "fda"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 374,
    "tipo": "tabla"
   }
  },
  {
   "id": "7-funcion-de-variable--no-inyectiva-evento-sobre",
   "unidad": "5",
   "seccion": "7 · Función de variable aleatoria Y=g(X)",
   "subseccion": "Método general (vía la FDA) — sirve siempre",
   "nombre": "no inyectiva $Y=X^2$",
   "tex": "\\{-\\sqrt{y}\\le X\\le\\sqrt{y}\\}",
   "variante": "evento sobre $X$",
   "cuando": "Caso Y = X² (o |X|): el evento se traduce en un intervalo simétrico, hay dos ramas.",
   "condiciones": [
    "g no inyectiva"
   ],
   "slug": "funcion-de-variable-aleatoria",
   "ancla": "",
   "tags": [
    "transformacion"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 375,
    "tipo": "tabla"
   }
  },
  {
   "id": "7-funcion-de-variable--no-inyectiva-fda-de",
   "unidad": "5",
   "seccion": "7 · Función de variable aleatoria Y=g(X)",
   "subseccion": "Método general (vía la FDA) — sirve siempre",
   "nombre": "no inyectiva $Y=X^2$",
   "tex": "F_Y(y)=F_X(\\sqrt{y})-F_X(-\\sqrt{y})",
   "variante": "FDA de $Y$",
   "cuando": "FDA de Y = X²: se restan los valores de F_X en las dos ramas; error típico es olvidar la rama negativa.",
   "condiciones": [
    "g no inyectiva"
   ],
   "slug": "funcion-de-variable-aleatoria",
   "ancla": "",
   "tags": [
    "transformacion",
    "fda"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 375,
    "tipo": "tabla"
   }
  },
  {
   "id": "7-funcion-de-variable--caso-monotona-estricta-cambio-de-variable",
   "unidad": "5",
   "seccion": "7 · Función de variable aleatoria Y=g(X)",
   "subseccion": "Caso $g$ monótona estricta (cambio de variable / jacobiano)",
   "nombre": "Caso $g$ monótona estricta (cambio de variable / jacobiano)",
   "tex": "f_Y(y)=f_X\\!\\big(g^{-1}(y)\\big)\\,\\left|\\dfrac{d}{dy}\\,g^{-1}(y)\\right|",
   "cuando": "Atajo cuando g es monótona estricta y solo se quiere la densidad: cambio de variable con el módulo del jacobiano.",
   "condiciones": [
    "g monótona estricta",
    "derivable"
   ],
   "slug": "funcion-de-variable-aleatoria",
   "ancla": "",
   "tags": [
    "transformacion",
    "jacobiano"
   ],
   "esencial": true,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 378,
    "tipo": "bloque"
   }
  },
  {
   "id": "7-funcion-de-variable--transformacion-afin-no-requiere-fda-para",
   "unidad": "5",
   "seccion": "7 · Función de variable aleatoria Y=g(X)",
   "subseccion": "Transformación afín $Y=aX+b$ (no requiere FDA para momentos)",
   "nombre": "Transformación afín $Y=aX+b$ (no requiere FDA para momentos)",
   "tex": "E[Y]=a\\,E[X]+b",
   "variante": "covarianza",
   "cuando": "Cambio de unidades o de escala y solo piden la media de Y.",
   "condiciones": [],
   "slug": "funcion-de-variable-aleatoria",
   "ancla": "",
   "tags": [
    "transformacion",
    "esperanza"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 382,
    "tipo": "vineta"
   }
  },
  {
   "id": "7-funcion-de-variable--transformacion-afin-no-requiere-fda-para-2",
   "unidad": "5",
   "seccion": "7 · Función de variable aleatoria Y=g(X)",
   "subseccion": "Transformación afín $Y=aX+b$ (no requiere FDA para momentos)",
   "nombre": "Transformación afín $Y=aX+b$ (no requiere FDA para momentos)",
   "tex": "V(Y)=a^2\\,V(X)\\;\\Rightarrow\\;\\sigma_Y=|a|\\,\\sigma_X",
   "variante": "esperanza",
   "cuando": "Cambio de unidades y piden la varianza o el desvío: la constante aditiva no afecta, la multiplicativa va al cuadrado.",
   "condiciones": [],
   "slug": "funcion-de-variable-aleatoria",
   "ancla": "",
   "tags": [
    "transformacion",
    "varianza"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 383,
    "tipo": "vineta"
   }
  },
  {
   "id": "7-funcion-de-variable--transformacion-afin-no-requiere-fda-para-3",
   "unidad": "5",
   "seccion": "7 · Función de variable aleatoria Y=g(X)",
   "subseccion": "Transformación afín $Y=aX+b$ (no requiere FDA para momentos)",
   "nombre": "Transformación afín $Y=aX+b$ (no requiere FDA para momentos)",
   "tex": "\\text{Cov}(X,Y)=a\\,\\sigma_X^2=\\text{sign}(a)\\,\\sigma_X\\sigma_Y",
   "variante": "varianza",
   "cuando": "Covarianza entre una variable y su transformada afín; la correlación resulta ±1.",
   "condiciones": [],
   "slug": "funcion-de-variable-aleatoria",
   "ancla": "",
   "tags": [
    "transformacion",
    "covarianza"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 384,
    "tipo": "vineta"
   }
  },
  {
   "id": "7-funcion-de-variable--constante",
   "unidad": "5",
   "seccion": "7 · Función de variable aleatoria Y=g(X)",
   "subseccion": "Transformación afín $Y=aX+b$ (no requiere FDA para momentos)",
   "nombre": "$a=0\\Rightarrow Y=b$ constante",
   "tex": "V(Y)=0\\text{, }P(Y=b)=1\\text{.}",
   "cuando": "Caso degenerado a = 0: la transformada es una constante, con varianza nula.",
   "condiciones": [
    "a = 0"
   ],
   "slug": "funcion-de-variable-aleatoria",
   "ancla": "",
   "tags": [
    "transformacion"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 385,
    "tipo": "vineta"
   }
  },
  {
   "id": "7-funcion-de-variable--normal-cerrada-por-afines",
   "unidad": "5",
   "seccion": "7 · Función de variable aleatoria Y=g(X)",
   "subseccion": "Transformación afín $Y=aX+b$ (no requiere FDA para momentos)",
   "nombre": "Normal (cerrada por afines)",
   "tex": "Y=aX+b\\sim N\\big(a\\mu_X+b,\\;|a|\\sigma_X\\big),\\qquad Z=\\frac{Y-\\mu_Y}{\\sigma_Y}\\sim N(0,1).",
   "cuando": "Una transformación afín de una normal sigue siendo normal: se usa para sumar constantes o cambiar unidades sin recalcular nada.",
   "condiciones": [
    "X normal",
    "a ≠ 0"
   ],
   "slug": "distribucion-normal",
   "ancla": "",
   "tags": [
    "transformacion",
    "normal"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 388,
    "tipo": "bloque"
   }
  },
  {
   "id": "7-funcion-de-variable--metodo-de-la-transformada-inversa-simulacion",
   "unidad": "5",
   "seccion": "7 · Función de variable aleatoria Y=g(X)",
   "subseccion": "Método de la transformada inversa (simulación)",
   "nombre": "Método de la transformada inversa (simulación)",
   "tex": "Y=F_X^{-1}(U)\\ \\Rightarrow\\ F_Y(y)=P\\big(U\\le F_X(y)\\big)=F_X(y),",
   "cuando": "Simulación: se quiere generar una variable con FDA dada a partir de un número aleatorio uniforme en (0,1).",
   "condiciones": [
    "F estrictamente creciente"
   ],
   "slug": "funcion-de-variable-aleatoria",
   "ancla": "",
   "tags": [
    "transformacion",
    "simulacion"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 392,
    "tipo": "bloque"
   }
  },
  {
   "id": "7-funcion-de-variable--ej",
   "unidad": "5",
   "seccion": "7 · Función de variable aleatoria Y=g(X)",
   "subseccion": "Método de la transformada inversa (simulación)",
   "nombre": "Ej. $\\text{Expo}(\\lambda)$",
   "tex": "Y=-\\dfrac{1}{\\lambda}\\ln(1-U)\\text{.}",
   "cuando": "Caso concreto de la transformada inversa: cómo generar una exponencial a partir de una uniforme.",
   "condiciones": [
    "U ~ Unif(0,1)"
   ],
   "slug": "funcion-de-variable-aleatoria",
   "ancla": "",
   "tags": [
    "transformacion",
    "simulacion",
    "exponencial"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 394,
    "tipo": "vineta"
   }
  },
  {
   "id": "7-funcion-de-variable--confundir-el-soporte",
   "unidad": "5",
   "seccion": "7 · Función de variable aleatoria Y=g(X)",
   "subseccion": "Errores típicos",
   "nombre": "Confundir el soporte",
   "tex": "\\text{si }0<x<1\\text{ y }Y=X^3\\text{, entonces }0<y<1\\text{, no todo }\\mathbb{R}\\text{.}",
   "cuando": "Error típico: después de transformar hay que recalcular el soporte de Y, no dejar el de X.",
   "condiciones": [],
   "slug": "funcion-de-variable-aleatoria",
   "ancla": "",
   "tags": [
    "transformacion",
    "errores"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 399,
    "tipo": "vineta"
   }
  },
  {
   "id": "7-funcion-de-variable--afin-con",
   "unidad": "5",
   "seccion": "7 · Función de variable aleatoria Y=g(X)",
   "subseccion": "Errores típicos",
   "nombre": "Afín con $a<0$",
   "tex": "\\sigma_Y=|a|\\sigma_X\\text{ (nunca }a\\,\\sigma_X\\text{).}",
   "cuando": "Error típico: el desvío se multiplica por el módulo de a, nunca por a con signo.",
   "condiciones": [
    "a < 0"
   ],
   "slug": "funcion-de-variable-aleatoria",
   "ancla": "",
   "tags": [
    "transformacion",
    "errores"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 400,
    "tipo": "vineta"
   }
  },
  {
   "id": "8-variables-bidimensionales-conjuntas--conjunta-v-a-d",
   "unidad": "5",
   "seccion": "8 · Variables bidimensionales (conjuntas)",
   "subseccion": "Conjunta, marginales, esperanza — V.A.D. vs V.A.C.",
   "nombre": "conjunta",
   "tex": "p_{X,Y}(x,y)=P(X=x,Y=y)",
   "variante": "V.A.D. (masa)",
   "cuando": "Tabla de doble entrada con las probabilidades de cada par: es el punto de partida del caso discreto.",
   "condiciones": [
    "X,Y discretas"
   ],
   "slug": "independencia-de-variables-aleatorias",
   "ancla": "",
   "tags": [
    "bidimensional",
    "conjunta"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 410,
    "tipo": "tabla"
   }
  },
  {
   "id": "8-variables-bidimensionales-conjuntas--conjunta-v-a-c",
   "unidad": "5",
   "seccion": "8 · Variables bidimensionales (conjuntas)",
   "subseccion": "Conjunta, marginales, esperanza — V.A.D. vs V.A.C.",
   "nombre": "conjunta",
   "tex": "f_{X,Y}(x,y)\\ge0",
   "variante": "V.A.C. (densidad)",
   "cuando": "Densidad conjunta sobre una región del plano: el punto de partida del caso continuo.",
   "condiciones": [
    "X,Y continuas"
   ],
   "slug": "independencia-de-variables-aleatorias",
   "ancla": "",
   "tags": [
    "bidimensional",
    "conjunta"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 410,
    "tipo": "tabla"
   }
  },
  {
   "id": "8-variables-bidimensionales-conjuntas--normalizacion-v-a-d",
   "unidad": "5",
   "seccion": "8 · Variables bidimensionales (conjuntas)",
   "subseccion": "Conjunta, marginales, esperanza — V.A.D. vs V.A.C.",
   "nombre": "normalización",
   "tex": "\\displaystyle\\sum_{x}\\sum_{y}p_{X,Y}=1",
   "variante": "V.A.D. (masa)",
   "cuando": "Condición para que una tabla conjunta sea válida; se usa para despejar una celda incógnita.",
   "condiciones": [
    "X,Y discretas"
   ],
   "slug": "independencia-de-variables-aleatorias",
   "ancla": "",
   "tags": [
    "bidimensional",
    "conjunta"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 411,
    "tipo": "tabla"
   }
  },
  {
   "id": "8-variables-bidimensionales-conjuntas--normalizacion-v-a-c",
   "unidad": "5",
   "seccion": "8 · Variables bidimensionales (conjuntas)",
   "subseccion": "Conjunta, marginales, esperanza — V.A.D. vs V.A.C.",
   "nombre": "normalización",
   "tex": "\\displaystyle\\iint_{\\mathbb{R}^2}f_{X,Y}\\,dx\\,dy=1",
   "variante": "V.A.C. (densidad)",
   "cuando": "Condición para que una densidad conjunta sea válida; se usa para despejar la constante con una integral doble.",
   "condiciones": [
    "X,Y continuas"
   ],
   "slug": "independencia-de-variables-aleatorias",
   "ancla": "",
   "tags": [
    "bidimensional",
    "conjunta"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 411,
    "tipo": "tabla"
   }
  },
  {
   "id": "8-variables-bidimensionales-conjuntas--marginal-de-v-a-d",
   "unidad": "5",
   "seccion": "8 · Variables bidimensionales (conjuntas)",
   "subseccion": "Conjunta, marginales, esperanza — V.A.D. vs V.A.C.",
   "nombre": "marginal de $X$",
   "tex": "p_X(x)=\\sum_{y}p_{X,Y}(x,y)",
   "variante": "V.A.D. (masa)",
   "cuando": "Piden la distribución de X sola a partir de la tabla conjunta: se suma por filas (o columnas).",
   "condiciones": [
    "X,Y discretas"
   ],
   "slug": "independencia-de-variables-aleatorias",
   "ancla": "",
   "tags": [
    "bidimensional",
    "marginal"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 412,
    "tipo": "tabla"
   }
  },
  {
   "id": "8-variables-bidimensionales-conjuntas--marginal-de-v-a-c",
   "unidad": "5",
   "seccion": "8 · Variables bidimensionales (conjuntas)",
   "subseccion": "Conjunta, marginales, esperanza — V.A.D. vs V.A.C.",
   "nombre": "marginal de $X$",
   "tex": "f_X(x)=\\int_{-\\infty}^{\\infty}f_{X,Y}(x,y)\\,dy",
   "variante": "V.A.C. (densidad)",
   "cuando": "Piden la densidad de X sola: se integra la conjunta respecto de y, con cuidado en los límites del soporte.",
   "condiciones": [
    "X,Y continuas"
   ],
   "slug": "independencia-de-variables-aleatorias",
   "ancla": "",
   "tags": [
    "bidimensional",
    "marginal"
   ],
   "esencial": true,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 412,
    "tipo": "tabla"
   }
  },
  {
   "id": "8-variables-bidimensionales-conjuntas--marginal-de-v-a-d-2",
   "unidad": "5",
   "seccion": "8 · Variables bidimensionales (conjuntas)",
   "subseccion": "Conjunta, marginales, esperanza — V.A.D. vs V.A.C.",
   "nombre": "marginal de $Y$",
   "tex": "p_Y(y)=\\sum_{x}p_{X,Y}(x,y)",
   "variante": "V.A.D. (masa)",
   "cuando": "Marginal de Y en el caso discreto: se suma la otra variable.",
   "condiciones": [
    "X,Y discretas"
   ],
   "slug": "independencia-de-variables-aleatorias",
   "ancla": "",
   "tags": [
    "bidimensional",
    "marginal"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 413,
    "tipo": "tabla"
   }
  },
  {
   "id": "8-variables-bidimensionales-conjuntas--marginal-de-v-a-c-2",
   "unidad": "5",
   "seccion": "8 · Variables bidimensionales (conjuntas)",
   "subseccion": "Conjunta, marginales, esperanza — V.A.D. vs V.A.C.",
   "nombre": "marginal de $Y$",
   "tex": "f_Y(y)=\\int_{-\\infty}^{\\infty}f_{X,Y}(x,y)\\,dx",
   "variante": "V.A.C. (densidad)",
   "cuando": "Marginal de Y en el caso continuo: se integra respecto de x.",
   "condiciones": [
    "X,Y continuas"
   ],
   "slug": "independencia-de-variables-aleatorias",
   "ancla": "",
   "tags": [
    "bidimensional",
    "marginal"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 413,
    "tipo": "tabla"
   }
  },
  {
   "id": "8-variables-bidimensionales-conjuntas--ehxy-v-a-d",
   "unidad": "5",
   "seccion": "8 · Variables bidimensionales (conjuntas)",
   "subseccion": "Conjunta, marginales, esperanza — V.A.D. vs V.A.C.",
   "nombre": "$E[h(X,Y)]$",
   "tex": "\\sum_{x}\\sum_{y}h(x,y)\\,p_{X,Y}",
   "variante": "V.A.D. (masa)",
   "cuando": "Piden la esperanza de una función de las dos variables (suma, producto, costo): se pondera con la conjunta.",
   "condiciones": [
    "X,Y discretas"
   ],
   "slug": "independencia-de-variables-aleatorias",
   "ancla": "",
   "tags": [
    "bidimensional",
    "esperanza"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 414,
    "tipo": "tabla"
   }
  },
  {
   "id": "8-variables-bidimensionales-conjuntas--ehxy-v-a-c",
   "unidad": "5",
   "seccion": "8 · Variables bidimensionales (conjuntas)",
   "subseccion": "Conjunta, marginales, esperanza — V.A.D. vs V.A.C.",
   "nombre": "$E[h(X,Y)]$",
   "tex": "\\iint_{\\mathbb{R}^2}h(x,y)\\,f_{X,Y}\\,dx\\,dy",
   "variante": "V.A.C. (densidad)",
   "cuando": "Esperanza de una función de las dos variables en el caso continuo: integral doble con la densidad conjunta.",
   "condiciones": [
    "X,Y continuas"
   ],
   "slug": "independencia-de-variables-aleatorias",
   "ancla": "",
   "tags": [
    "bidimensional",
    "esperanza"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 414,
    "tipo": "tabla"
   }
  },
  {
   "id": "8-variables-bidimensionales-conjuntas--conjunta-marginales-esperanza-v-a-d",
   "unidad": "5",
   "seccion": "8 · Variables bidimensionales (conjuntas)",
   "subseccion": "Conjunta, marginales, esperanza — V.A.D. vs V.A.C.",
   "nombre": "Conjunta, marginales, esperanza — V.A.D. vs V.A.C.",
   "tex": "P\\big((X,Y)\\in B\\big)=\\iint_B f_{X,Y}\\,dx\\,dy,\\qquad f_{X,Y}(x,y)=\\frac{\\partial^2}{\\partial x\\,\\partial y}P(X\\le x,Y\\le y).",
   "cuando": "Probabilidad de que el par caiga en una región del plano: integral doble sobre esa región.",
   "condiciones": [
    "X,Y continuas"
   ],
   "slug": "independencia-de-variables-aleatorias",
   "ancla": "",
   "tags": [
    "bidimensional",
    "conjunta"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 416,
    "tipo": "bloque"
   }
  },
  {
   "id": "8-variables-bidimensionales-conjuntas--condicional-y-esperanza-condicional",
   "unidad": "5",
   "seccion": "8 · Variables bidimensionales (conjuntas)",
   "subseccion": "Condicional y esperanza condicional",
   "nombre": "Condicional y esperanza condicional",
   "tex": "f_{X\\mid Y}(x\\mid y)=\\frac{f_{X,Y}(x,y)}{f_Y(y)},\\qquad p_{X\\mid Y}(x\\mid y)=\\frac{p_{X,Y}(x,y)}{p_Y(y)}.",
   "variante": "densidad y masa condicionales",
   "cuando": "Piden la distribución de X sabiendo el valor de Y: conjunta dividida por la marginal del condicionante.",
   "condiciones": [
    "f_Y(y) > 0"
   ],
   "slug": "variables-aleatorias-bidimensionales",
   "ancla": "condicionales-y-esperanza-condicional",
   "tags": [
    "bidimensional",
    "condicional"
   ],
   "esencial": true,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 422,
    "tipo": "bloque"
   }
  },
  {
   "id": "8-variables-bidimensionales-conjuntas--condicional-y-esperanza-condicional-2",
   "unidad": "5",
   "seccion": "8 · Variables bidimensionales (conjuntas)",
   "subseccion": "Condicional y esperanza condicional",
   "nombre": "Condicional y esperanza condicional",
   "tex": "E[g(X)\\mid Y=y]=\\begin{cases}\\displaystyle\\sum_{x}g(x)\\,p_{X\\mid Y}(x\\mid y) & (\\text{V.A.D.}),\\\\[2mm]\\displaystyle\\int_{-\\infty}^{\\infty}g(x)\\,f_{X\\mid Y}(x\\mid y)\\,dx & (\\text{V.A.C.}).\\end{cases}",
   "variante": "esperanza condicional",
   "cuando": "Piden el valor medio de X dentro de un subgrupo fijado por Y.",
   "condiciones": [],
   "slug": "variables-aleatorias-bidimensionales",
   "ancla": "condicionales-y-esperanza-condicional",
   "tags": [
    "bidimensional",
    "condicional",
    "esperanza"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 424,
    "tipo": "bloque"
   }
  },
  {
   "id": "8-variables-bidimensionales-conjuntas--condicional-y-esperanza-condicional-3",
   "unidad": "5",
   "seccion": "8 · Variables bidimensionales (conjuntas)",
   "subseccion": "Condicional y esperanza condicional",
   "nombre": "Condicional y esperanza condicional",
   "tex": "\\operatorname{Var}(X\\mid Y)=E[X^2\\mid Y]-\\big(E[X\\mid Y]\\big)^2.",
   "variante": "varianza condicional",
   "cuando": "Varianza dentro de un subgrupo, con la misma fórmula de cálculo que en el caso incondicional.",
   "condiciones": [],
   "slug": "variables-aleatorias-bidimensionales",
   "ancla": "condicionales-y-esperanza-condicional",
   "tags": [
    "bidimensional",
    "condicional",
    "varianza"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 426,
    "tipo": "bloque"
   }
  },
  {
   "id": "8-variables-bidimensionales-conjuntas--leyes-total-promediar-por-etapas",
   "unidad": "5",
   "seccion": "8 · Variables bidimensionales (conjuntas)",
   "subseccion": "Leyes total (promediar por etapas)",
   "nombre": "Leyes total (promediar por etapas)",
   "tex": "\\boxed{\\;E[X]=E\\big[E[X\\mid Y]\\big]\\;}\\qquad \\boxed{\\;V(X)=E\\big[V(X\\mid Y)\\big]+V\\big(E[X\\mid Y]\\big)\\;}",
   "variante": "forma compacta",
   "cuando": "El experimento tiene dos etapas (primero se sortea la máquina, después el tiempo): la media total es el promedio de las medias condicionales, y la varianza suma el término entre grupos.",
   "condiciones": [],
   "slug": "variables-aleatorias-bidimensionales",
   "ancla": "",
   "tags": [
    "bidimensional",
    "esperanza-condicional"
   ],
   "esencial": true,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 432,
    "tipo": "bloque"
   }
  },
  {
   "id": "8-variables-bidimensionales-conjuntas--leyes-total-promediar-por-etapas-2",
   "unidad": "5",
   "seccion": "8 · Variables bidimensionales (conjuntas)",
   "subseccion": "Leyes total (promediar por etapas)",
   "nombre": "Leyes total (promediar por etapas)",
   "tex": "E[X]=\\begin{cases}\\displaystyle\\sum_{y}E[X\\mid Y=y]\\,p_Y(y) & (Y\\text{ discreta}),\\\\[2mm]\\displaystyle\\int_{-\\infty}^{\\infty}E[X\\mid Y=y]\\,f_Y(y)\\,dy & (Y\\text{ continua}).\\end{cases}",
   "variante": "desarrollo por etapas",
   "cuando": "Forma explícita de la ley de esperanza total según Y sea discreta o continua.",
   "condiciones": [],
   "slug": "variables-aleatorias-bidimensionales",
   "ancla": "",
   "tags": [
    "bidimensional",
    "esperanza-condicional"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 434,
    "tipo": "bloque"
   }
  },
  {
   "id": "8-variables-bidimensionales-conjuntas--la-varianza-no-se-promedia-sola",
   "unidad": "5",
   "seccion": "8 · Variables bidimensionales (conjuntas)",
   "subseccion": "Leyes total (promediar por etapas)",
   "nombre": "⚠️ La varianza no se promedia sola",
   "tex": "V(X)\\neq\\sum_y V(X\\mid Y=y)\\,p_Y(y)",
   "cuando": "Error típico: promediar varianzas condicionales subestima la dispersión, falta el término entre grupos.",
   "condiciones": [],
   "slug": "variables-aleatorias-bidimensionales",
   "ancla": "",
   "tags": [
    "errores",
    "varianza"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 437,
    "tipo": "vineta"
   }
  },
  {
   "id": "8-variables-bidimensionales-conjuntas--directa",
   "unidad": "5",
   "seccion": "8 · Variables bidimensionales (conjuntas)",
   "subseccion": "Mezcla (caso mixto: una discreta condiciona a una continua)",
   "nombre": "Directa",
   "tex": "\\begin{aligned} F_X(x)&=\\sum_{k}F_{X\\mid M}(x\\mid k)\\,P(M{=}k),\\\\ f_X(x)&=\\sum_{k}f_{X\\mid M}(x\\mid k)\\,P(M{=}k),\\\\ E[g(X)]&=\\sum_{k}E[g(X)\\mid M{=}k]\\,P(M{=}k). \\end{aligned}",
   "cuando": "Mezcla: una discreta elige el régimen (tipo de pieza, turno) y dentro de cada régimen la continua tiene una distribución conocida.",
   "condiciones": [
    "mezcla",
    "M discreta"
   ],
   "slug": "mezcla-de-distribuciones",
   "ancla": "",
   "tags": [
    "mezcla",
    "condicional"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 442,
    "tipo": "bloque"
   }
  },
  {
   "id": "8-variables-bidimensionales-conjuntas--inversa",
   "unidad": "5",
   "seccion": "8 · Variables bidimensionales (conjuntas)",
   "subseccion": "Mezcla (caso mixto: una discreta condiciona a una continua)",
   "nombre": "Inversa",
   "tex": "p_X(x)=\\int_{\\mathbb{R}}p_{X\\mid Y}(x\\mid y)\\,f_Y(y)\\,dy,\\qquad E[h(X)]=\\int_{\\mathbb{R}}E[h(X)\\mid Y{=}y]\\,f_Y(y)\\,dy.",
   "cuando": "Mezcla inversa: el parámetro de una discreta es a su vez aleatorio y continuo, así que se integra en vez de sumar.",
   "condiciones": [
    "parámetro aleatorio"
   ],
   "slug": "mezcla-de-distribuciones",
   "ancla": "",
   "tags": [
    "mezcla",
    "condicional"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 445,
    "tipo": "bloque"
   }
  },
  {
   "id": "8-variables-bidimensionales-conjuntas--bayes-sobre-la-mezcla",
   "unidad": "5",
   "seccion": "8 · Variables bidimensionales (conjuntas)",
   "subseccion": "Mezcla (caso mixto: una discreta condiciona a una continua)",
   "nombre": "Bayes sobre la mezcla",
   "tex": "P(M{=}k\\mid X\\in A)=\\frac{P(X\\in A\\mid M{=}k)\\,P(M{=}k)}{\\sum_{j}P(X\\in A\\mid M{=}j)\\,P(M{=}j)}.",
   "cuando": "Se observa un resultado de la mezcla y preguntan de qué grupo proviene: Bayes con las probabilidades condicionales del evento.",
   "condiciones": [
    "mezcla"
   ],
   "slug": "mezcla-de-distribuciones",
   "ancla": "bayes-sobre-la-mezcla",
   "tags": [
    "mezcla",
    "bayes"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 450,
    "tipo": "bloque"
   }
  },
  {
   "id": "9-covarianza-correlacion-e--covarianza",
   "unidad": "5",
   "seccion": "9 · Covarianza, correlación e independencia",
   "subseccion": "Covarianza",
   "nombre": "Covarianza",
   "tex": "\\text{Cov}(X,Y)=E\\big[(X-\\mu_X)(Y-\\mu_Y)\\big]=E[XY]-\\mu_X\\,\\mu_Y.",
   "cuando": "Piden la covarianza: en la práctica se calcula E[XY] con la conjunta y se resta el producto de las medias.",
   "condiciones": [],
   "slug": "covarianza-y-correlacion",
   "ancla": "covarianza",
   "tags": [
    "covarianza"
   ],
   "esencial": true,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 458,
    "tipo": "bloque"
   }
  },
  {
   "id": "9-covarianza-correlacion-e--con-si-misma",
   "unidad": "5",
   "seccion": "9 · Covarianza, correlación e independencia",
   "subseccion": "Covarianza",
   "nombre": "Con sí misma",
   "tex": "\\text{Cov}(X,X)=V(X)",
   "cuando": "Caso particular útil en cuentas con bilinealidad: la covarianza de una variable consigo misma es su varianza.",
   "condiciones": [],
   "slug": "covarianza-y-correlacion",
   "ancla": "covarianza",
   "tags": [
    "covarianza"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 462,
    "tipo": "tabla"
   }
  },
  {
   "id": "9-covarianza-correlacion-e--simetria",
   "unidad": "5",
   "seccion": "9 · Covarianza, correlación e independencia",
   "subseccion": "Covarianza",
   "nombre": "Simetría",
   "tex": "\\text{Cov}(X,Y)=\\text{Cov}(Y,X)",
   "cuando": "Propiedad de simetría; permite ordenar los argumentos como convenga.",
   "condiciones": [],
   "slug": "covarianza-y-correlacion",
   "ancla": "covarianza",
   "tags": [
    "covarianza"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 463,
    "tipo": "tabla"
   }
  },
  {
   "id": "9-covarianza-correlacion-e--bilineal",
   "unidad": "5",
   "seccion": "9 · Covarianza, correlación e independencia",
   "subseccion": "Covarianza",
   "nombre": "Bilineal",
   "tex": "\\text{Cov}(aX+b,\\,cY+d)=ac\\,\\text{Cov}(X,Y)",
   "cuando": "Hay cambios de escala o de unidades y piden la covarianza de las variables transformadas: las constantes aditivas no afectan.",
   "condiciones": [],
   "slug": "covarianza-y-correlacion",
   "ancla": "covarianza",
   "tags": [
    "covarianza",
    "transformacion"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 464,
    "tipo": "tabla"
   }
  },
  {
   "id": "9-covarianza-correlacion-e--caso-afin",
   "unidad": "5",
   "seccion": "9 · Covarianza, correlación e independencia",
   "subseccion": "Covarianza",
   "nombre": "Caso afín $Y=aX+b$",
   "tex": "\\text{Cov}(X,Y)=a\\,\\sigma_X^2=\\text{sign}(a)\\,\\sigma_X\\sigma_Y",
   "cuando": "Si una variable es función afín de la otra, la covarianza queda determinada y la correlación vale ±1.",
   "condiciones": [
    "Y = aX + b"
   ],
   "slug": "covarianza-y-correlacion",
   "ancla": "covarianza",
   "tags": [
    "covarianza",
    "correlacion"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 465,
    "tipo": "tabla"
   }
  },
  {
   "id": "9-covarianza-correlacion-e--varianza-de-una-combinacion-lineal",
   "unidad": "5",
   "seccion": "9 · Covarianza, correlación e independencia",
   "subseccion": "Covarianza",
   "nombre": "Varianza de una combinación lineal",
   "tex": "V(aX+bY)=a^2V(X)+2ab\\,\\text{Cov}(X,Y)+b^2V(Y).",
   "variante": "$X\\pm Y$",
   "cuando": "Piden la varianza de una combinación lineal de dos variables que pueden estar correlacionadas: aparece el término cruzado.",
   "condiciones": [
    "no independientes"
   ],
   "slug": "covarianza-y-correlacion",
   "ancla": "covarianza",
   "tags": [
    "covarianza",
    "varianza"
   ],
   "esencial": true,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 468,
    "tipo": "bloque"
   }
  },
  {
   "id": "9-covarianza-correlacion-e--varianza-de-una-combinacion-lineal-2",
   "unidad": "5",
   "seccion": "9 · Covarianza, correlación e independencia",
   "subseccion": "Covarianza",
   "nombre": "Varianza de una combinación lineal",
   "tex": "V(X\\pm Y)=V(X)\\pm 2\\,\\text{Cov}(X,Y)+V(Y).",
   "variante": "$aX+bY$",
   "cuando": "Varianza de la suma o de la resta: en la resta la covarianza cambia de signo, pero las varianzas siempre suman.",
   "condiciones": [],
   "slug": "covarianza-y-correlacion",
   "ancla": "covarianza",
   "tags": [
    "covarianza",
    "varianza"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 469,
    "tipo": "bloque"
   }
  },
  {
   "id": "9-covarianza-correlacion-e--coeficiente-de-correlacion",
   "unidad": "5",
   "seccion": "9 · Covarianza, correlación e independencia",
   "subseccion": "Coeficiente de correlación",
   "nombre": "Coeficiente de correlación",
   "tex": "\\rho_{X,Y}=\\frac{\\text{Cov}(X,Y)}{\\sigma_X\\,\\sigma_Y}\\in[-1,+1].",
   "variante": "definición",
   "cuando": "Piden el grado de asociación lineal en una escala comparable: covarianza dividida por el producto de los desvíos.",
   "condiciones": [],
   "slug": "covarianza-y-correlacion",
   "ancla": "coeficiente-de-correlación",
   "tags": [
    "correlacion"
   ],
   "esencial": true,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 473,
    "tipo": "bloque"
   }
  },
  {
   "id": "9-covarianza-correlacion-e--coeficiente-de-correlacion-2",
   "unidad": "5",
   "seccion": "9 · Covarianza, correlación e independencia",
   "subseccion": "Coeficiente de correlación",
   "nombre": "Coeficiente de correlación",
   "tex": "|\\text{Cov}(X,Y)|\\le\\sigma_X\\sigma_Y\\text{ (Cauchy–Schwarz), }\\;(\\text{Cov}(X,Y))^2\\le V(X)V(Y)\\text{.}",
   "variante": "caso $\\rho=\\pm1$",
   "cuando": "Cota de Cauchy–Schwarz: sirve para verificar que un valor de covarianza es admisible.",
   "condiciones": [],
   "slug": "covarianza-y-correlacion",
   "ancla": "coeficiente-de-correlación",
   "tags": [
    "correlacion",
    "cotas"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 475,
    "tipo": "vineta"
   }
  },
  {
   "id": "9-covarianza-correlacion-e--coeficiente-de-correlacion-3",
   "unidad": "5",
   "seccion": "9 · Covarianza, correlación e independencia",
   "subseccion": "Coeficiente de correlación",
   "nombre": "Coeficiente de correlación",
   "tex": "\\rho_{X,Y}=\\pm1 \\iff Y=aX+b\\text{ con prob. }1\\text{ (}a\\neq0\\text{, }\\text{sign}(a)=\\text{sign}(\\rho_{X,Y})\\text{): relación lineal exacta.}",
   "variante": "cota de Cauchy–Schwarz",
   "cuando": "Interpretación de los extremos: correlación ±1 solo si hay relación lineal exacta.",
   "condiciones": [],
   "slug": "covarianza-y-correlacion",
   "ancla": "coeficiente-de-correlación",
   "tags": [
    "correlacion"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 476,
    "tipo": "vineta"
   }
  },
  {
   "id": "9-covarianza-correlacion-e--independencia",
   "unidad": "5",
   "seccion": "9 · Covarianza, correlación e independencia",
   "subseccion": "Independencia",
   "nombre": "Independencia",
   "tex": "X,Y\\text{ indep.} \\iff p_{X,Y}(x,y)=p_X(x)\\,p_Y(y)\\ \\ \\text{(V.A.D.)} \\iff f_{X,Y}(x,y)=f_X(x)\\,f_Y(y)\\ \\ \\text{(V.A.C.)}",
   "cuando": "Criterio para decidir independencia de dos variables: la conjunta debe factorizar como producto de las marginales en todo el soporte.",
   "condiciones": [],
   "slug": "independencia-de-variables-aleatorias",
   "ancla": "",
   "tags": [
    "independencia",
    "bidimensional"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 482,
    "tipo": "bloque"
   }
  },
  {
   "id": "9-covarianza-correlacion-e--equivalente-via-condicional",
   "unidad": "5",
   "seccion": "9 · Covarianza, correlación e independencia",
   "subseccion": "Independencia",
   "nombre": "Equivalente vía condicional",
   "tex": "f_{X\\mid Y}(x\\mid y)=f_X(x)\\text{ (o }p_{X\\mid Y}=p_X\\text{)}",
   "cuando": "Probar independencia mostrando que la condicional no depende del valor condicionante.",
   "condiciones": [
    "independientes"
   ],
   "slug": "independencia",
   "ancla": "",
   "tags": [
    "independencia",
    "condicional"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 484,
    "tipo": "parrafo"
   }
  },
  {
   "id": "9-covarianza-correlacion-e--factoriza-esperanza",
   "unidad": "5",
   "seccion": "9 · Covarianza, correlación e independencia",
   "subseccion": "Independencia",
   "nombre": "Factoriza esperanza",
   "tex": "E[g_1(X)\\,g_2(Y)]=E[g_1(X)]\\,E[g_2(Y)]\\text{; en particular }E[XY]=E[X]E[Y]",
   "cuando": "Con independencia, la esperanza de un producto se parte en el producto de las esperanzas.",
   "condiciones": [
    "independientes"
   ],
   "slug": "independencia",
   "ancla": "",
   "tags": [
    "independencia",
    "esperanza"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 490,
    "tipo": "tabla"
   }
  },
  {
   "id": "9-covarianza-correlacion-e--incorrelacion",
   "unidad": "5",
   "seccion": "9 · Covarianza, correlación e independencia",
   "subseccion": "Independencia",
   "nombre": "Incorrelación",
   "tex": "\\text{Cov}(X,Y)=0\\text{ y }\\rho_{X,Y}=0",
   "cuando": "La independencia implica covarianza nula (la recíproca no vale, salvo en el caso normal conjunto).",
   "condiciones": [
    "independientes"
   ],
   "slug": "independencia",
   "ancla": "",
   "tags": [
    "independencia",
    "covarianza"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 491,
    "tipo": "tabla"
   }
  },
  {
   "id": "9-covarianza-correlacion-e--varianza-de-la-suma",
   "unidad": "5",
   "seccion": "9 · Covarianza, correlación e independencia",
   "subseccion": "Independencia",
   "nombre": "Varianza de la suma",
   "tex": "V(X+Y)=V(X)+V(Y)",
   "cuando": "Con independencia desaparece el término cruzado y las varianzas simplemente se suman.",
   "condiciones": [
    "independientes"
   ],
   "slug": "independencia",
   "ancla": "",
   "tags": [
    "independencia",
    "varianza"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 492,
    "tipo": "tabla"
   }
  },
  {
   "id": "9-covarianza-correlacion-e--probabilidad-conjunta",
   "unidad": "5",
   "seccion": "9 · Covarianza, correlación e independencia",
   "subseccion": "Independencia",
   "nombre": "Probabilidad conjunta",
   "tex": "P(X\\in A,\\,Y\\in B)=P(X\\in A)\\,P(Y\\in B)",
   "cuando": "Con independencia, la probabilidad de que ambas caigan en sus respectivos conjuntos es el producto.",
   "condiciones": [
    "independientes"
   ],
   "slug": "independencia",
   "ancla": "",
   "tags": [
    "independencia"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 493,
    "tipo": "tabla"
   }
  },
  {
   "id": "10-suma-de-v--esperanza-siempre-sin-hipotesis",
   "unidad": "7",
   "seccion": "10 · Suma de v.a., desigualdades, LGN y TCL",
   "subseccion": "Esperanza y varianza de una suma",
   "nombre": "Esperanza (siempre, sin hipótesis)",
   "tex": "\\;E[X+Y]=E[X]+E[Y]\\text{, y en general }\\;E\\!\\left[\\sum_{k=1}^n X_k\\right]=\\sum_{k=1}^n E[X_k]\\text{.}",
   "cuando": "Piden la media de una suma o de un total: la esperanza siempre se reparte, con o sin independencia.",
   "condiciones": [
    "sin hipótesis"
   ],
   "slug": "esperanza",
   "ancla": "",
   "tags": [
    "suma",
    "esperanza"
   ],
   "esencial": true,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 506,
    "tipo": "vineta"
   }
  },
  {
   "id": "10-suma-de-v--varianza-caso-general",
   "unidad": "7",
   "seccion": "10 · Suma de v.a., desigualdades, LGN y TCL",
   "subseccion": "Esperanza y varianza de una suma",
   "nombre": "Varianza (caso general)",
   "tex": "V(X+Y)=V(X)+2\\,\\mathrm{Cov}(X,Y)+V(Y),\\qquad V\\!\\left(\\sum_{k=1}^n X_k\\right)=\\sum_{k=1}^n V(X_k)+2\\!\\!\\sum_{i<j}\\mathrm{Cov}(X_i,X_j).",
   "cuando": "Varianza de una suma cuando las variables pueden estar correlacionadas: hay que sumar todas las covarianzas cruzadas.",
   "condiciones": [
    "no independientes"
   ],
   "slug": "covarianza-y-correlacion",
   "ancla": "",
   "tags": [
    "suma",
    "varianza",
    "covarianza"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 508,
    "tipo": "bloque"
   }
  },
  {
   "id": "10-suma-de-v--independientes-no-correlacionadas",
   "unidad": "7",
   "seccion": "10 · Suma de v.a., desigualdades, LGN y TCL",
   "subseccion": "Esperanza y varianza de una suma",
   "nombre": "Independientes / no correlacionadas",
   "tex": "\\text{(}\\mathrm{Cov}=0\\text{): }\\;V(X\\pm Y)=V(X)+V(Y)\\;\\text{ (la resta }\\textbf{también suma}\\text{); para }n\\text{ indep. }\\;V\\!\\left(\\sum X_k\\right)=\\sum V(X_k)\\text{.}",
   "cuando": "Con independencia la varianza de la suma (y también la de la resta) es la suma de las varianzas.",
   "condiciones": [
    "independientes"
   ],
   "slug": "covarianza-y-correlacion",
   "ancla": "",
   "tags": [
    "suma",
    "varianza"
   ],
   "esencial": true,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 509,
    "tipo": "vineta"
   }
  },
  {
   "id": "10-suma-de-v--media-snxi",
   "unidad": "7",
   "seccion": "10 · Suma de v.a., desigualdades, LGN y TCL",
   "subseccion": "Caso i.i.d.: suma $S_n$ y promedio $\\bar X_n$",
   "nombre": "Media",
   "tex": "n\\mu",
   "variante": "$S_n=\\sum X_i$",
   "cuando": "Media del total de n observaciones i.i.d.",
   "condiciones": [
    "i.i.d."
   ],
   "slug": "promedio-muestral",
   "ancla": "",
   "tags": [
    "suma",
    "esperanza"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 516,
    "tipo": "tabla"
   }
  },
  {
   "id": "10-suma-de-v--media-xn1nsn",
   "unidad": "7",
   "seccion": "10 · Suma de v.a., desigualdades, LGN y TCL",
   "subseccion": "Caso i.i.d.: suma $S_n$ y promedio $\\bar X_n$",
   "nombre": "Media",
   "tex": "\\mu\\text{ (insesgado)}",
   "variante": "$\\bar X_n=\\tfrac1n S_n$",
   "cuando": "Media del promedio muestral: es insesgado, no depende de n.",
   "condiciones": [
    "i.i.d."
   ],
   "slug": "promedio-muestral",
   "ancla": "",
   "tags": [
    "suma",
    "promedio-muestral"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 516,
    "tipo": "tabla"
   }
  },
  {
   "id": "10-suma-de-v--varianza-snxi",
   "unidad": "7",
   "seccion": "10 · Suma de v.a., desigualdades, LGN y TCL",
   "subseccion": "Caso i.i.d.: suma $S_n$ y promedio $\\bar X_n$",
   "nombre": "Varianza",
   "tex": "n\\sigma^2",
   "variante": "$S_n=\\sum X_i$",
   "cuando": "Varianza del total de n observaciones i.i.d.: crece con n.",
   "condiciones": [
    "i.i.d."
   ],
   "slug": "promedio-muestral",
   "ancla": "",
   "tags": [
    "suma",
    "varianza"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 517,
    "tipo": "tabla"
   }
  },
  {
   "id": "10-suma-de-v--varianza-xn1nsn",
   "unidad": "7",
   "seccion": "10 · Suma de v.a., desigualdades, LGN y TCL",
   "subseccion": "Caso i.i.d.: suma $S_n$ y promedio $\\bar X_n$",
   "nombre": "Varianza",
   "tex": "\\dfrac{\\sigma^2}{n}\\xrightarrow{n\\to\\infty}0",
   "variante": "$\\bar X_n=\\tfrac1n S_n$",
   "cuando": "Varianza del promedio: baja como 1/n, que es la razón por la que promediar reduce el error.",
   "condiciones": [
    "i.i.d."
   ],
   "slug": "promedio-muestral",
   "ancla": "",
   "tags": [
    "suma",
    "promedio-muestral"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 517,
    "tipo": "tabla"
   }
  },
  {
   "id": "10-suma-de-v--desvio-snxi",
   "unidad": "7",
   "seccion": "10 · Suma de v.a., desigualdades, LGN y TCL",
   "subseccion": "Caso i.i.d.: suma $S_n$ y promedio $\\bar X_n$",
   "nombre": "Desvío",
   "tex": "\\sqrt n\\,\\sigma",
   "variante": "$S_n=\\sum X_i$",
   "cuando": "Desvío del total: crece como raíz de n, no como n.",
   "condiciones": [
    "i.i.d."
   ],
   "slug": "promedio-muestral",
   "ancla": "",
   "tags": [
    "suma",
    "varianza"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 518,
    "tipo": "tabla"
   }
  },
  {
   "id": "10-suma-de-v--desvio-xn1nsn",
   "unidad": "7",
   "seccion": "10 · Suma de v.a., desigualdades, LGN y TCL",
   "subseccion": "Caso i.i.d.: suma $S_n$ y promedio $\\bar X_n$",
   "nombre": "Desvío",
   "tex": "\\dfrac{\\sigma}{\\sqrt n}\\text{ (}\\textbf{error estándar}\\text{)}",
   "variante": "$\\bar X_n=\\tfrac1n S_n$",
   "cuando": "Error estándar del promedio: es el desvío que se usa al estandarizar en el TCL y en los intervalos de confianza.",
   "condiciones": [
    "i.i.d."
   ],
   "slug": "promedio-muestral",
   "ancla": "",
   "tags": [
    "suma",
    "promedio-muestral",
    "error-estandar"
   ],
   "esencial": true,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 518,
    "tipo": "tabla"
   }
  },
  {
   "id": "10-suma-de-v--distribucion-de-la-suma-convolucion-independientes",
   "unidad": "7",
   "seccion": "10 · Suma de v.a., desigualdades, LGN y TCL",
   "subseccion": "Distribución de la suma: convolución ($X,Y$ independientes)",
   "nombre": "Distribución de la suma: convolución ($X,Y$ independientes)",
   "tex": "\\text{discreta: } p_S(s)=\\sum_{y\\in \\mathcal R_Y} p_X(s-y)\\,p_Y(y),\\qquad \\text{continua: } f_S(s)=\\int_{-\\infty}^{+\\infty} f_X(s-y)\\,f_Y(y)\\,dy.",
   "cuando": "Piden la distribución exacta de una suma de independientes y no hay resultado con nombre: convolución.",
   "condiciones": [
    "independientes"
   ],
   "slug": "funcion-generadora-de-momentos",
   "ancla": "",
   "tags": [
    "suma",
    "convolucion"
   ],
   "esencial": true,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 521,
    "tipo": "bloque"
   }
  },
  {
   "id": "10-suma-de-v--atajo",
   "unidad": "7",
   "seccion": "10 · Suma de v.a., desigualdades, LGN y TCL",
   "subseccion": "Distribución de la suma: convolución ($X,Y$ independientes)",
   "nombre": "Atajo",
   "tex": "\\;M_S(t)=M_X(t)\\,M_Y(t)\\;",
   "cuando": "Identificar la distribución de una suma sin convolucionar: se multiplican las funciones generadoras y se reconoce la familia.",
   "condiciones": [
    "independientes"
   ],
   "slug": "funcion-generadora-de-momentos",
   "ancla": "",
   "tags": [
    "suma",
    "fgm"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 522,
    "tipo": "parrafo"
   }
  },
  {
   "id": "10-suma-de-v--i-i-d",
   "unidad": "7",
   "seccion": "10 · Suma de v.a., desigualdades, LGN y TCL",
   "subseccion": "Sumas de independientes con nombre propio (reproductividad)",
   "nombre": "$n\\times\\mathrm{Bernoulli}(p)$ i.i.d.",
   "tex": "\\mathrm{Bin}(n,p)",
   "cuando": "Contar éxitos en n ensayos equivale a sumar n Bernoulli independientes.",
   "condiciones": [
    "independientes"
   ],
   "slug": "suma-de-va-independientes",
   "ancla": "",
   "tags": [
    "suma",
    "reproductividad",
    "binomial"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 527,
    "tipo": "tabla"
   }
  },
  {
   "id": "10-suma-de-v--misma",
   "unidad": "7",
   "seccion": "10 · Suma de v.a., desigualdades, LGN y TCL",
   "subseccion": "Sumas de independientes con nombre propio (reproductividad)",
   "nombre": "$\\mathrm{Bin}(n_1,p)+\\mathrm{Bin}(n_2,p)$ (misma $p$)",
   "tex": "\\mathrm{Bin}(n_1+n_2,p)",
   "cuando": "Dos binomiales con la misma p que se suman (dos lotes, dos días) siguen siendo binomial.",
   "condiciones": [
    "misma p",
    "independientes"
   ],
   "slug": "suma-de-va-independientes",
   "ancla": "",
   "tags": [
    "suma",
    "reproductividad",
    "binomial"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 528,
    "tipo": "tabla"
   }
  },
  {
   "id": "10-suma-de-v--poisson1poisson2",
   "unidad": "7",
   "seccion": "10 · Suma de v.a., desigualdades, LGN y TCL",
   "subseccion": "Sumas de independientes con nombre propio (reproductividad)",
   "nombre": "$\\mathrm{Poisson}(\\lambda_1)+\\mathrm{Poisson}(\\lambda_2)$",
   "tex": "\\mathrm{Poisson}(\\lambda_1+\\lambda_2)",
   "cuando": "Se juntan dos flujos Poisson independientes (dos cajas, dos tipos de llamada): las tasas se suman.",
   "condiciones": [
    "independientes"
   ],
   "slug": "suma-de-va-independientes",
   "ancla": "",
   "tags": [
    "suma",
    "reproductividad",
    "poisson"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 529,
    "tipo": "tabla"
   }
  },
  {
   "id": "10-suma-de-v--n11n22",
   "unidad": "7",
   "seccion": "10 · Suma de v.a., desigualdades, LGN y TCL",
   "subseccion": "Sumas de independientes con nombre propio (reproductividad)",
   "nombre": "$\\mathcal N(\\mu_1,\\sigma_1)+\\mathcal N(\\mu_2,\\sigma_2)$",
   "tex": "\\mathcal N\\!\\big(\\mu_1+\\mu_2,\\sqrt{\\sigma_1^2+\\sigma_2^2}\\big)",
   "cuando": "Suma de normales independientes: se suman las medias y las varianzas, nunca los desvíos.",
   "condiciones": [
    "independientes",
    "normales"
   ],
   "slug": "suma-de-va-independientes",
   "ancla": "",
   "tags": [
    "suma",
    "reproductividad",
    "normal"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 530,
    "tipo": "tabla"
   }
  },
  {
   "id": "10-suma-de-v--i-i-d-2",
   "unidad": "7",
   "seccion": "10 · Suma de v.a., desigualdades, LGN y TCL",
   "subseccion": "Sumas de independientes con nombre propio (reproductividad)",
   "nombre": "$n\\times\\text{Expo}(\\lambda)$ i.i.d.",
   "tex": "\\mathrm{Gamma}(n,\\lambda)=\\mathrm{Erlang}_n(\\lambda)",
   "cuando": "Suma de tiempos exponenciales i.i.d. (sistema en standby, k etapas): da Gamma/Erlang.",
   "condiciones": [
    "i.i.d.",
    "misma tasa"
   ],
   "slug": "suma-de-va-independientes",
   "ancla": "",
   "tags": [
    "suma",
    "reproductividad",
    "erlang"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 531,
    "tipo": "tabla"
   }
  },
  {
   "id": "10-suma-de-v--unif01unif01",
   "unidad": "7",
   "seccion": "10 · Suma de v.a., desigualdades, LGN y TCL",
   "subseccion": "Sumas de independientes con nombre propio (reproductividad)",
   "nombre": "$\\mathrm{Unif}(0,1)+\\mathrm{Unif}(0,1)$",
   "tex": "\\textbf{triangular}\\text{ en }(0,2)\\text{ (}\\textbf{NO}\\text{ uniforme)}",
   "cuando": "Advertencia clásica: la suma de dos uniformes no es uniforme, es triangular.",
   "condiciones": [
    "independientes"
   ],
   "slug": "suma-de-va-independientes",
   "ancla": "",
   "tags": [
    "suma",
    "errores"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 532,
    "tipo": "tabla"
   }
  },
  {
   "id": "10-suma-de-v--geopgeop",
   "unidad": "7",
   "seccion": "10 · Suma de v.a., desigualdades, LGN y TCL",
   "subseccion": "Sumas de independientes con nombre propio (reproductividad)",
   "nombre": "$\\mathrm{Geo}(p)+\\mathrm{Geo}(p)$",
   "tex": "\\mathrm{BinNeg}(2,p)",
   "cuando": "Suma de geométricas con la misma p: da binomial negativa.",
   "condiciones": [
    "misma p",
    "independientes"
   ],
   "slug": "suma-de-va-independientes",
   "ancla": "",
   "tags": [
    "suma",
    "reproductividad"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 533,
    "tipo": "tabla"
   }
  },
  {
   "id": "10-suma-de-v--i1nn012",
   "unidad": "7",
   "seccion": "10 · Suma de v.a., desigualdades, LGN y TCL",
   "subseccion": "Sumas de independientes con nombre propio (reproductividad)",
   "nombre": "$\\sum_{i=1}^n \\mathcal N(0,1)^2$",
   "tex": "\\chi^2_n",
   "cuando": "Suma de cuadrados de normales estándar: da ji-cuadrado, base de la inferencia sobre la varianza.",
   "condiciones": [
    "i.i.d.",
    "normales estándar"
   ],
   "slug": "suma-de-va-independientes",
   "ancla": "",
   "tags": [
    "suma",
    "reproductividad",
    "ji-cuadrado"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 534,
    "tipo": "tabla"
   }
  },
  {
   "id": "10-suma-de-v--normal-normal",
   "unidad": "7",
   "seccion": "10 · Suma de v.a., desigualdades, LGN y TCL",
   "subseccion": "Sumas de independientes con nombre propio (reproductividad)",
   "nombre": "Normal + Normal",
   "tex": "\\textbf{suman medias y varianzas}\\text{ (los desvíos NO suman). Gamma/Erlang: }\\;f_{\\Gamma(n,\\lambda)}(x)=\\dfrac{\\lambda^n x^{n-1}e^{-\\lambda x}}{(n-1)!}\\ (x>0)\\text{, }E=\\tfrac n\\lambda\\text{, }V=\\tfrac n{\\lambda^2}",
   "cuando": "Suma de normales independientes (se suman medias y varianzas, nunca los desvíos) y suma de exponenciales de igual tasa, que da Gamma/Erlang.",
   "condiciones": [
    "independientes"
   ],
   "slug": "suma-de-va-independientes",
   "ancla": "4-normal-normal-normal",
   "tags": [
    "suma",
    "normal",
    "gamma"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 536,
    "tipo": "parrafo"
   }
  },
  {
   "id": "10-suma-de-v--markov",
   "unidad": "7",
   "seccion": "10 · Suma de v.a., desigualdades, LGN y TCL",
   "subseccion": "Desigualdades (cotas universales)",
   "nombre": "Markov",
   "tex": "\\text{(}X\\ge 0\\text{), }\\forall\\,\\alpha>0\\text{: }\\quad P(X\\ge\\alpha)\\le\\dfrac{E[X]}{\\alpha}\\text{.}",
   "cuando": "Solo se conoce la media de una variable no negativa y piden acotar la probabilidad de un valor grande.",
   "condiciones": [
    "X ≥ 0",
    "solo se conoce E[X]"
   ],
   "slug": "desigualdad-de-chebyshev",
   "ancla": "",
   "tags": [
    "cotas",
    "markov"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 539,
    "tipo": "vineta"
   }
  },
  {
   "id": "10-suma-de-v--chebyshev",
   "unidad": "7",
   "seccion": "10 · Suma de v.a., desigualdades, LGN y TCL",
   "subseccion": "Desigualdades (cotas universales)",
   "nombre": "Chebyshev",
   "tex": "\\text{(media }\\mu\\text{, varianza }\\sigma^2\\text{), }\\forall\\,\\varepsilon>0\\text{: }\\quad P(|X-\\mu|\\ge\\varepsilon)\\le\\dfrac{\\sigma^2}{\\varepsilon^2}\\text{.}",
   "cuando": "Piden acotar la probabilidad de alejarse de la media sin conocer la distribución: alcanza con la media y la varianza.",
   "condiciones": [
    "media y varianza conocidas"
   ],
   "slug": "desigualdad-de-chebyshev",
   "ancla": "",
   "tags": [
    "cotas",
    "chebyshev"
   ],
   "esencial": true,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 540,
    "tipo": "vineta"
   }
  },
  {
   "id": "10-suma-de-v--en-terminos-de-desvios",
   "unidad": "7",
   "seccion": "10 · Suma de v.a., desigualdades, LGN y TCL",
   "subseccion": "Desigualdades (cotas universales)",
   "nombre": "En términos de $k$ desvíos ($\\varepsilon=k\\sigma$)",
   "tex": "\\quad P(|X-\\mu|\\ge k\\sigma)\\le\\dfrac1{k^2}\\text{.}",
   "cuando": "Versión de Chebyshev cuando el alejamiento se expresa en cantidad de desvíos.",
   "condiciones": [
    "ε = kσ"
   ],
   "slug": "desigualdad-de-chebyshev",
   "ancla": "",
   "tags": [
    "cotas",
    "chebyshev"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 541,
    "tipo": "vineta"
   }
  },
  {
   "id": "10-suma-de-v--promedio-i-i-d",
   "unidad": "7",
   "seccion": "10 · Suma de v.a., desigualdades, LGN y TCL",
   "subseccion": "Desigualdades (cotas universales)",
   "nombre": "Promedio i.i.d.",
   "tex": "\\quad P(|\\bar X_n-\\mu|\\ge\\varepsilon)\\le\\dfrac{\\sigma^2}{n\\,\\varepsilon^2}\\xrightarrow{n\\to\\infty}0",
   "cuando": "Chebyshev aplicado al promedio muestral: la cota baja con n y es el puente hacia la ley de los grandes números.",
   "condiciones": [
    "i.i.d."
   ],
   "slug": "desigualdad-de-chebyshev",
   "ancla": "forma-para-promedios-iid",
   "tags": [
    "cotas",
    "chebyshev",
    "lgn"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 542,
    "tipo": "vineta"
   }
  },
  {
   "id": "10-suma-de-v--debil-en-probabilidad",
   "unidad": "7",
   "seccion": "10 · Suma de v.a., desigualdades, LGN y TCL",
   "subseccion": "Ley de los Grandes Números",
   "nombre": "Débil (en probabilidad)",
   "tex": "\\;\\displaystyle\\lim_{n\\to\\infty} P(|\\bar X_n-\\mu|\\ge\\varepsilon)=0\\quad\\forall\\,\\varepsilon>0",
   "cuando": "Justificación teórica de que el promedio se acerca a la media poblacional al crecer n.",
   "condiciones": [
    "i.i.d.",
    "varianza finita"
   ],
   "slug": "ley-de-grandes-numeros",
   "ancla": "",
   "tags": [
    "lgn"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 545,
    "tipo": "vineta"
   }
  },
  {
   "id": "10-suma-de-v--fuerte-casi-segura",
   "unidad": "7",
   "seccion": "10 · Suma de v.a., desigualdades, LGN y TCL",
   "subseccion": "Ley de los Grandes Números",
   "nombre": "Fuerte (casi segura)",
   "tex": "\\;P\\!\\left(\\displaystyle\\lim_{n\\to\\infty}\\bar X_n=\\mu\\right)=1\\text{.}",
   "cuando": "Versión fuerte de la ley de los grandes números: convergencia casi segura del promedio.",
   "condiciones": [
    "i.i.d."
   ],
   "slug": "ley-de-grandes-numeros",
   "ancla": "",
   "tags": [
    "lgn"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 546,
    "tipo": "vineta"
   }
  },
  {
   "id": "10-suma-de-v--teorema-central-del-limite",
   "unidad": "7",
   "seccion": "10 · Suma de v.a., desigualdades, LGN y TCL",
   "subseccion": "Teorema Central del Límite",
   "nombre": "Teorema Central del Límite",
   "tex": "\\lim_{n\\to\\infty}P(Z_n\\le z)=\\Phi(z).",
   "variante": "enunciado",
   "cuando": "Enunciado del TCL: el promedio estandarizado tiende a la normal estándar, sea cual sea la distribución de origen.",
   "condiciones": [
    "i.i.d.",
    "n grande"
   ],
   "slug": "teorema-central-del-limite",
   "ancla": "",
   "tags": [
    "tcl"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 550,
    "tipo": "bloque"
   }
  },
  {
   "id": "10-suma-de-v--teorema-central-del-limite-2",
   "unidad": "7",
   "seccion": "10 · Suma de v.a., desigualdades, LGN y TCL",
   "subseccion": "Teorema Central del Límite",
   "nombre": "Teorema Central del Límite",
   "tex": "\\bar X_n\\overset{\\text{aprox}}{\\sim}\\mathcal N\\!\\Big(\\mu,\\tfrac{\\sigma}{\\sqrt n}\\Big),\\qquad S_n\\overset{\\text{aprox}}{\\sim}\\mathcal N\\!\\big(n\\mu,\\sqrt n\\,\\sigma\\big),\\qquad P(S_n\\le s)\\approx\\Phi\\!\\Big(\\tfrac{s-n\\mu}{\\sqrt n\\,\\sigma}\\Big).",
   "variante": "forma de trabajo",
   "cuando": "Uso práctico del TCL: aproximar la distribución del promedio o del total por una normal para calcular probabilidades.",
   "condiciones": [
    "i.i.d.",
    "n grande"
   ],
   "slug": "teorema-central-del-limite",
   "ancla": "",
   "tags": [
    "tcl",
    "aproximacion"
   ],
   "esencial": true,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 552,
    "tipo": "bloque"
   }
  },
  {
   "id": "10-suma-de-v--frecuencia-relativa",
   "unidad": "7",
   "seccion": "10 · Suma de v.a., desigualdades, LGN y TCL",
   "subseccion": "Teorema Central del Límite",
   "nombre": "Frecuencia relativa ($\\hat P_n=\\tfrac1n\\sum\\mathbb 1_k(A)$, $p=P(A)$)",
   "tex": "\\;P(\\hat P_n\\le q)\\approx\\Phi\\!\\Big(\\dfrac{q-p}{\\sqrt{p(1-p)/n}}\\Big)",
   "cuando": "Aproximar la probabilidad de que la proporción muestral no supere un valor, con n grande.",
   "condiciones": [
    "n grande",
    "TCL"
   ],
   "slug": "teorema-central-del-limite",
   "ancla": "",
   "tags": [
    "tcl",
    "proporcion"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 553,
    "tipo": "parrafo"
   }
  },
  {
   "id": "10-suma-de-v--aproximacion-normal-de-la-binomial",
   "unidad": "7",
   "seccion": "10 · Suma de v.a., desigualdades, LGN y TCL",
   "subseccion": "Aproximación normal de la binomial",
   "nombre": "Aproximación normal de la binomial",
   "tex": "\\mathrm{Bin}(n,p)\\approx\\mathcal N\\big(np,\\sqrt{npq}\\big),\\qquad q=1-p.",
   "cuando": "Binomial con n grande: se reemplaza por una normal con la misma media y desvío.",
   "condiciones": [
    "np ≥ 5",
    "nq ≥ 5"
   ],
   "slug": "aproximacion-normal-de-la-binomial",
   "ancla": "",
   "tags": [
    "tcl",
    "binomial",
    "aproximacion"
   ],
   "esencial": true,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 556,
    "tipo": "bloque"
   }
  },
  {
   "id": "10-suma-de-v--correccion-por-continuidad",
   "unidad": "7",
   "seccion": "10 · Suma de v.a., desigualdades, LGN y TCL",
   "subseccion": "Aproximación normal de la binomial",
   "nombre": "Corrección por continuidad",
   "tex": "P(a\\le S_n\\le b)\\approx\\Phi\\!\\Big(\\tfrac{b+\\frac12-np}{\\sqrt{npq}}\\Big)-\\Phi\\!\\Big(\\tfrac{a-\\frac12-np}{\\sqrt{npq}}\\Big),\\qquad P(S_n=s)\\approx\\Phi\\!\\Big(\\tfrac{s+\\frac12-n\\mu}{\\sqrt n\\,\\sigma}\\Big)-\\Phi\\!\\Big(\\tfrac{s-\\frac12-n\\mu}{\\sqrt n\\,\\sigma}\\Big).",
   "cuando": "Al pasar de la binomial a la normal se corren los extremos medio punto hacia afuera.",
   "condiciones": [
    "variable discreta"
   ],
   "slug": "aproximacion-normal-de-la-binomial",
   "ancla": "corrección-por-continuidad-clave-en-discretas",
   "tags": [
    "tcl",
    "binomial",
    "aproximacion"
   ],
   "esencial": true,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 558,
    "tipo": "bloque"
   }
  },
  {
   "id": "11-procesos-estocasticos-bernoulli--conteo-en-pasos-v-a",
   "unidad": "6",
   "seccion": "11 · Procesos estocásticos (Bernoulli, Poisson, Markov)",
   "subseccion": "Proceso de Bernoulli (tiempo discreto)",
   "nombre": "Conteo en $k$ pasos",
   "tex": "N(k)",
   "variante": "V.A.",
   "cuando": "Variable que cuenta éxitos en los primeros k pasos de un proceso de Bernoulli.",
   "condiciones": [
    "tiempo discreto"
   ],
   "slug": "distribucion-binomial",
   "ancla": "",
   "tags": [
    "proceso-bernoulli",
    "conteo"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 572,
    "tipo": "tabla"
   }
  },
  {
   "id": "11-procesos-estocasticos-bernoulli--conteo-en-pasos-distribucion",
   "unidad": "6",
   "seccion": "11 · Procesos estocásticos (Bernoulli, Poisson, Markov)",
   "subseccion": "Proceso de Bernoulli (tiempo discreto)",
   "nombre": "Conteo en $k$ pasos",
   "tex": "\\text{Binomial}(k,p)",
   "variante": "Distribución",
   "cuando": "Preguntan cuántos éxitos hay en k pasos de un proceso de Bernoulli: es binomial.",
   "condiciones": [
    "tiempo discreto",
    "independientes"
   ],
   "slug": "distribucion-binomial",
   "ancla": "",
   "tags": [
    "proceso-bernoulli",
    "binomial"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 572,
    "tipo": "tabla"
   }
  },
  {
   "id": "11-procesos-estocasticos-bernoulli--incremento-v-a",
   "unidad": "6",
   "seccion": "11 · Procesos estocásticos (Bernoulli, Poisson, Markov)",
   "subseccion": "Proceso de Bernoulli (tiempo discreto)",
   "nombre": "Incremento ($k\\le m$)",
   "tex": "N(m)-N(k)",
   "variante": "V.A.",
   "cuando": "Variable que cuenta los éxitos ocurridos entre dos instantes de un proceso de Bernoulli.",
   "condiciones": [
    "tiempo discreto"
   ],
   "slug": "proceso-de-bernoulli",
   "ancla": "",
   "tags": [
    "proceso-bernoulli",
    "incrementos"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 573,
    "tipo": "tabla"
   }
  },
  {
   "id": "11-procesos-estocasticos-bernoulli--incremento-distribucion",
   "unidad": "6",
   "seccion": "11 · Procesos estocásticos (Bernoulli, Poisson, Markov)",
   "subseccion": "Proceso de Bernoulli (tiempo discreto)",
   "nombre": "Incremento ($k\\le m$)",
   "tex": "\\text{Binomial}(m{-}k,p)",
   "variante": "Distribución",
   "cuando": "Conteo entre dos instantes: por incrementos estacionarios solo importa la longitud del tramo.",
   "condiciones": [
    "incrementos estacionarios"
   ],
   "slug": "proceso-de-bernoulli",
   "ancla": "",
   "tags": [
    "proceso-bernoulli",
    "binomial"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 573,
    "tipo": "tabla"
   }
  },
  {
   "id": "11-procesos-estocasticos-bernoulli--tiempo-entre-eventos-al-proximo-v-a",
   "unidad": "6",
   "seccion": "11 · Procesos estocásticos (Bernoulli, Poisson, Markov)",
   "subseccion": "Proceso de Bernoulli (tiempo discreto)",
   "nombre": "Tiempo entre eventos / al próximo",
   "tex": "\\tau_i",
   "variante": "V.A.",
   "cuando": "Variable que mide el tiempo entre dos eventos consecutivos del proceso.",
   "condiciones": [],
   "slug": "distribucion-geometrica",
   "ancla": "",
   "tags": [
    "proceso-bernoulli",
    "tiempos"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 574,
    "tipo": "tabla"
   }
  },
  {
   "id": "11-procesos-estocasticos-bernoulli--tiempo-entre-eventos-al-proximo-distribucion",
   "unidad": "6",
   "seccion": "11 · Procesos estocásticos (Bernoulli, Poisson, Markov)",
   "subseccion": "Proceso de Bernoulli (tiempo discreto)",
   "nombre": "Tiempo entre eventos / al próximo",
   "tex": "\\text{Geométrica}(p)\\text{ i.i.d.}",
   "variante": "Distribución",
   "cuando": "Preguntan cuántos pasos faltan hasta el próximo éxito: geométrica (cuenta fracasos).",
   "condiciones": [
    "tiempo discreto"
   ],
   "slug": "distribucion-geometrica",
   "ancla": "",
   "tags": [
    "proceso-bernoulli",
    "geometrica"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 574,
    "tipo": "tabla"
   }
  },
  {
   "id": "11-procesos-estocasticos-bernoulli--tiempo-hasta-el-esimo-v-a",
   "unidad": "6",
   "seccion": "11 · Procesos estocásticos (Bernoulli, Poisson, Markov)",
   "subseccion": "Proceso de Bernoulli (tiempo discreto)",
   "nombre": "Tiempo hasta el $k$-ésimo",
   "tex": "T_k=\\tau_1+\\dots+\\tau_k",
   "variante": "V.A.",
   "cuando": "Variable que acumula los tiempos entre eventos hasta el k-ésimo éxito.",
   "condiciones": [],
   "slug": "distribucion-binomial-negativa",
   "ancla": "",
   "tags": [
    "proceso-bernoulli",
    "tiempos"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 575,
    "tipo": "tabla"
   }
  },
  {
   "id": "11-procesos-estocasticos-bernoulli--tiempo-hasta-el-esimo-distribucion",
   "unidad": "6",
   "seccion": "11 · Procesos estocásticos (Bernoulli, Poisson, Markov)",
   "subseccion": "Proceso de Bernoulli (tiempo discreto)",
   "nombre": "Tiempo hasta el $k$-ésimo",
   "tex": "\\text{Binomial negativa}(k,p)",
   "variante": "Distribución",
   "cuando": "Preguntan cuándo ocurre el k-ésimo éxito en tiempo discreto: binomial negativa.",
   "condiciones": [
    "tiempo discreto"
   ],
   "slug": "distribucion-binomial-negativa",
   "ancla": "",
   "tags": [
    "proceso-bernoulli",
    "binomial-negativa"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 575,
    "tipo": "tabla"
   }
  },
  {
   "id": "11-procesos-estocasticos-bernoulli--proceso-de-bernoulli-tiempo-discreto",
   "unidad": "6",
   "seccion": "11 · Procesos estocásticos (Bernoulli, Poisson, Markov)",
   "subseccion": "Proceso de Bernoulli (tiempo discreto)",
   "nombre": "Proceso de Bernoulli (tiempo discreto)",
   "tex": "P(N(k)=n)=\\binom{k}{n}p^n(1-p)^{k-n},\\qquad q=1-p.",
   "cuando": "PMF del conteo en k pasos de un proceso de Bernoulli.",
   "condiciones": [
    "independientes",
    "p constante"
   ],
   "slug": "proceso-de-bernoulli",
   "ancla": "",
   "tags": [
    "proceso-bernoulli",
    "binomial"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 577,
    "tipo": "bloque"
   }
  },
  {
   "id": "11-procesos-estocasticos-bernoulli--limite-continuo-del-bernoulli",
   "unidad": "6",
   "seccion": "11 · Procesos estocásticos (Bernoulli, Poisson, Markov)",
   "subseccion": "Proceso de Poisson (tiempo continuo)",
   "nombre": "Límite continuo del Bernoulli",
   "tex": "P\\big(N(t{+}h)-N(t)=1\\big)=\\lambda h+o(h),\\qquad P\\big(N(t{+}h)-N(t)>1\\big)=o(h)",
   "cuando": "Justificar que un fenómeno es un proceso de Poisson: incrementos independientes y estacionarios, con a lo sumo un evento por intervalo infinitesimal.",
   "condiciones": [
    "tasa constante"
   ],
   "slug": "proceso-de-poisson",
   "ancla": "",
   "tags": [
    "proceso-poisson",
    "definicion"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 583,
    "tipo": "parrafo"
   }
  },
  {
   "id": "11-procesos-estocasticos-bernoulli--conteo-en-o-intervalo-de-long-v-a",
   "unidad": "6",
   "seccion": "11 · Procesos estocásticos (Bernoulli, Poisson, Markov)",
   "subseccion": "Proceso de Poisson (tiempo continuo)",
   "nombre": "Conteo en $[0,t]$ (o intervalo de long. $\\tau$)",
   "tex": "N(t)",
   "variante": "V.A.",
   "cuando": "Variable que cuenta eventos de un proceso de Poisson en un intervalo.",
   "condiciones": [
    "tiempo continuo"
   ],
   "slug": "distribucion-poisson",
   "ancla": "",
   "tags": [
    "proceso-poisson",
    "conteo"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 587,
    "tipo": "tabla"
   }
  },
  {
   "id": "11-procesos-estocasticos-bernoulli--conteo-en-o-intervalo-de-long-distribucion",
   "unidad": "6",
   "seccion": "11 · Procesos estocásticos (Bernoulli, Poisson, Markov)",
   "subseccion": "Proceso de Poisson (tiempo continuo)",
   "nombre": "Conteo en $[0,t]$ (o intervalo de long. $\\tau$)",
   "tex": "\\text{Poisson}(\\lambda t)",
   "variante": "Distribución",
   "cuando": "Preguntan cuántos eventos ocurren en un intervalo de longitud t: Poisson con parámetro λt (ajustar las unidades).",
   "condiciones": [
    "tasa constante"
   ],
   "slug": "distribucion-poisson",
   "ancla": "",
   "tags": [
    "proceso-poisson",
    "poisson"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 587,
    "tipo": "tabla"
   }
  },
  {
   "id": "11-procesos-estocasticos-bernoulli--tiempo-entre-eventos-al-proximo-distribucion-2",
   "unidad": "6",
   "seccion": "11 · Procesos estocásticos (Bernoulli, Poisson, Markov)",
   "subseccion": "Proceso de Poisson (tiempo continuo)",
   "nombre": "Tiempo entre eventos / al próximo",
   "tex": "\\text{Expo}(\\lambda)\\text{ i.i.d.}",
   "variante": "Distribución",
   "cuando": "Preguntan cuánto se espera hasta el próximo evento de un proceso de Poisson: exponencial de la misma tasa.",
   "condiciones": [
    "tiempo continuo"
   ],
   "slug": "distribucion-exponencial",
   "ancla": "",
   "tags": [
    "proceso-poisson",
    "exponencial"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 588,
    "tipo": "tabla"
   }
  },
  {
   "id": "11-procesos-estocasticos-bernoulli--tiempo-hasta-el-esimo-distribucion-2",
   "unidad": "6",
   "seccion": "11 · Procesos estocásticos (Bernoulli, Poisson, Markov)",
   "subseccion": "Proceso de Poisson (tiempo continuo)",
   "nombre": "Tiempo hasta el $k$-ésimo",
   "tex": "\\text{Erlang}(k,\\lambda)",
   "variante": "Distribución",
   "cuando": "Preguntan cuándo ocurre el k-ésimo evento en tiempo continuo: Erlang.",
   "condiciones": [
    "tiempo continuo"
   ],
   "slug": "distribucion-erlang",
   "ancla": "",
   "tags": [
    "proceso-poisson",
    "erlang"
   ],
   "esencial": true,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 589,
    "tipo": "tabla"
   }
  },
  {
   "id": "11-procesos-estocasticos-bernoulli--proceso-de-poisson-tiempo-continuo",
   "unidad": "6",
   "seccion": "11 · Procesos estocásticos (Bernoulli, Poisson, Markov)",
   "subseccion": "Proceso de Poisson (tiempo continuo)",
   "nombre": "Proceso de Poisson (tiempo continuo)",
   "tex": "P(N(t)=n)=\\frac{(\\lambda t)^n}{n!}\\,e^{-\\lambda t}\\quad(n\\ge0),\\qquad E[N(t)]=V(N(t))=\\lambda t.",
   "variante": "conteo $N(t)$",
   "cuando": "PMF del conteo en [0,t] y su media: en la Poisson media y varianza coinciden.",
   "condiciones": [
    "tasa constante"
   ],
   "slug": "proceso-de-poisson",
   "ancla": "",
   "tags": [
    "proceso-poisson",
    "poisson"
   ],
   "esencial": true,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 591,
    "tipo": "bloque"
   }
  },
  {
   "id": "11-procesos-estocasticos-bernoulli--proceso-de-poisson-tiempo-continuo-2",
   "unidad": "6",
   "seccion": "11 · Procesos estocásticos (Bernoulli, Poisson, Markov)",
   "subseccion": "Proceso de Poisson (tiempo continuo)",
   "nombre": "Proceso de Poisson (tiempo continuo)",
   "tex": "\\tau_i\\sim\\text{Expo}(\\lambda):\\quad F_{\\tau}(t)=1-e^{-\\lambda t}\\ (t>0),\\qquad E[\\tau]=1/\\lambda.",
   "variante": "tiempos entre eventos",
   "cuando": "FDA y media del tiempo entre eventos de un proceso de Poisson.",
   "condiciones": [
    "tiempo continuo"
   ],
   "slug": "proceso-de-poisson",
   "ancla": "",
   "tags": [
    "proceso-poisson",
    "exponencial"
   ],
   "esencial": true,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 593,
    "tipo": "bloque"
   }
  },
  {
   "id": "11-procesos-estocasticos-bernoulli--dualidad-conteo-tiempo",
   "unidad": "6",
   "seccion": "11 · Procesos estocásticos (Bernoulli, Poisson, Markov)",
   "subseccion": "Proceso de Poisson (tiempo continuo)",
   "nombre": "Dualidad conteo ↔ tiempo",
   "tex": "\\ T_k< t \\iff N(t)\\ge k",
   "cuando": "Pasar una pregunta de tiempos (exponencial o Erlang) a una de conteos (Poisson) y al revés: el k-ésimo evento ocurre antes de t si y solo si en [0,t] hubo al menos k eventos.",
   "condiciones": [
    "tiempo continuo"
   ],
   "slug": "proceso-de-poisson",
   "ancla": "dualidad-conteo-tiempo-clave-para-ejercicios",
   "tags": [
    "proceso-poisson",
    "tiempos",
    "conteo"
   ],
   "esencial": true,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 595,
    "tipo": "parrafo"
   }
  },
  {
   "id": "11-procesos-estocasticos-bernoulli--caracterizacion",
   "unidad": "6",
   "seccion": "11 · Procesos estocásticos (Bernoulli, Poisson, Markov)",
   "subseccion": "Proceso de Poisson (tiempo continuo)",
   "nombre": "Caracterización",
   "tex": "N(t)\\text{ es Poisson(}\\lambda\\text{) }\\iff\\text{ los }\\tau_n\\sim\\text{Expo}(\\lambda)\\text{ i.i.d.}",
   "cuando": "Pasar de conteos a tiempos: si los tiempos entre eventos son exponenciales i.i.d., el conteo es Poisson (y al revés).",
   "condiciones": [
    "independientes"
   ],
   "slug": "proceso-de-poisson",
   "ancla": "",
   "tags": [
    "proceso-poisson",
    "exponencial"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 597,
    "tipo": "parrafo"
   }
  },
  {
   "id": "11-procesos-estocasticos-bernoulli--relacion-bernoulli-poisson",
   "unidad": "6",
   "seccion": "11 · Procesos estocásticos (Bernoulli, Poisson, Markov)",
   "subseccion": "Relación Bernoulli → Poisson",
   "nombre": "Relación Bernoulli → Poisson",
   "tex": "N(t)\\ \\underset{\\text{aprox}}{\\sim}\\ \\text{Binomial}\\!\\left(\\tfrac{t}{\\Delta t},\\,\\lambda\\,\\Delta t\\right)\\ \\xrightarrow[\\Delta t\\to0]{}\\ \\text{Poisson}(\\lambda t).",
   "cuando": "Justifica el paso al límite: discretizando el tiempo, el proceso de Bernoulli tiende al de Poisson.",
   "condiciones": [
    "Δt → 0"
   ],
   "slug": "relacion-bernoulli-poisson",
   "ancla": "",
   "tags": [
    "proceso-poisson",
    "proceso-bernoulli"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 602,
    "tipo": "bloque"
   }
  },
  {
   "id": "11-procesos-estocasticos-bernoulli--marginal-bernoulli",
   "unidad": "6",
   "seccion": "11 · Procesos estocásticos (Bernoulli, Poisson, Markov)",
   "subseccion": "Relación Bernoulli → Poisson",
   "nombre": "Marginal $N(t)$",
   "tex": "\\text{Binomial}(k,p)",
   "variante": "Bernoulli",
   "cuando": "Comparación de los dos procesos: cómo se distribuye el conteo en el caso discreto.",
   "condiciones": [
    "tiempo discreto"
   ],
   "slug": "distribucion-binomial",
   "ancla": "",
   "tags": [
    "comparacion",
    "proceso-bernoulli"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 610,
    "tipo": "tabla"
   }
  },
  {
   "id": "11-procesos-estocasticos-bernoulli--marginal-poisson",
   "unidad": "6",
   "seccion": "11 · Procesos estocásticos (Bernoulli, Poisson, Markov)",
   "subseccion": "Relación Bernoulli → Poisson",
   "nombre": "Marginal $N(t)$",
   "tex": "\\text{Poisson}(\\lambda t)",
   "variante": "Poisson",
   "cuando": "Comparación de los dos procesos: cómo se distribuye el conteo en el caso continuo.",
   "condiciones": [
    "tiempo continuo"
   ],
   "slug": "distribucion-binomial",
   "ancla": "",
   "tags": [
    "comparacion",
    "proceso-poisson"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 610,
    "tipo": "tabla"
   }
  },
  {
   "id": "11-procesos-estocasticos-bernoulli--parametro-bernoulli",
   "unidad": "6",
   "seccion": "11 · Procesos estocásticos (Bernoulli, Poisson, Markov)",
   "subseccion": "Relación Bernoulli → Poisson",
   "nombre": "Parámetro",
   "tex": "p",
   "variante": "Bernoulli",
   "cuando": "Parámetro que describe el proceso de Bernoulli: la probabilidad de éxito por paso.",
   "condiciones": [
    "tiempo discreto"
   ],
   "slug": "relacion-bernoulli-poisson",
   "ancla": "",
   "tags": [
    "comparacion",
    "proceso-bernoulli"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 613,
    "tipo": "tabla"
   }
  },
  {
   "id": "11-procesos-estocasticos-bernoulli--parametro-poisson",
   "unidad": "6",
   "seccion": "11 · Procesos estocásticos (Bernoulli, Poisson, Markov)",
   "subseccion": "Relación Bernoulli → Poisson",
   "nombre": "Parámetro",
   "tex": "\\lambda",
   "variante": "Poisson",
   "cuando": "Parámetro que describe el proceso de Poisson: la tasa de eventos por unidad de tiempo.",
   "condiciones": [
    "tiempo continuo"
   ],
   "slug": "relacion-bernoulli-poisson",
   "ancla": "",
   "tags": [
    "comparacion",
    "proceso-poisson"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 613,
    "tipo": "tabla"
   }
  },
  {
   "id": "11-procesos-estocasticos-bernoulli--proceso-de-markov-con-estados-discretos",
   "unidad": "6",
   "seccion": "11 · Procesos estocásticos (Bernoulli, Poisson, Markov)",
   "subseccion": "Cadenas de Markov",
   "nombre": "Proceso de Markov con estados discretos $\\mathbb{E}=\\{s_1,s_2,\\dots\\}$",
   "tex": "p_j(0)=P\\big(X(0)=s_j\\big),\\ \\ \\textstyle\\sum_j p_j(0)=1;\\qquad p_{ij}=P\\big(X(n{+}1)=s_j\\mid X(n)=s_i\\big),\\ \\ \\textstyle\\sum_j p_{ij}=1",
   "cuando": "Plantear una cadena de Markov: hace falta la distribución inicial y la matriz de transición, ambas con filas que suman 1.",
   "condiciones": [
    "estados discretos"
   ],
   "slug": "cadenas-de-markov",
   "ancla": "",
   "tags": [
    "markov",
    "definicion"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 619,
    "tipo": "parrafo"
   }
  },
  {
   "id": "11-procesos-estocasticos-bernoulli--propiedad-markoviana",
   "unidad": "6",
   "seccion": "11 · Procesos estocásticos (Bernoulli, Poisson, Markov)",
   "subseccion": "Cadenas de Markov",
   "nombre": "Propiedad markoviana",
   "tex": "P\\big(X(n{+}1)=s_j\\mid X(n)=s_i,\\dots,X(0)\\big)=P\\big(X(n{+}1)=s_j\\mid X(n)=s_i\\big).",
   "cuando": "Define una cadena de Markov: el próximo estado depende solo del actual, no de la historia.",
   "condiciones": [
    "estados discretos"
   ],
   "slug": "cadenas-de-markov",
   "ancla": "",
   "tags": [
    "markov"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 622,
    "tipo": "bloque"
   }
  },
  {
   "id": "11-procesos-estocasticos-bernoulli--matriz-de-transicion",
   "unidad": "6",
   "seccion": "11 · Procesos estocásticos (Bernoulli, Poisson, Markov)",
   "subseccion": "Cadenas de Markov",
   "nombre": "Matriz de transición",
   "tex": "\\mathbb{P}=(p_{ij}),\\qquad \\textstyle\\sum_j p_{ij}=1\\ \\ \\forall\\,i",
   "variante": "definición",
   "cuando": "Armar la matriz de transición de una cadena: cada fila reúne las probabilidades de salir de un estado, así que suma 1.",
   "condiciones": [
    "estados discretos"
   ],
   "slug": "cadenas-de-markov",
   "ancla": "matriz-de-transición",
   "tags": [
    "markov",
    "matriz-de-transicion"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 624,
    "tipo": "parrafo"
   }
  },
  {
   "id": "11-procesos-estocasticos-bernoulli--matriz-de-transicion-2",
   "unidad": "6",
   "seccion": "11 · Procesos estocásticos (Bernoulli, Poisson, Markov)",
   "subseccion": "Cadenas de Markov",
   "nombre": "Matriz de transición",
   "tex": "\\vec p(n+1)=\\vec p(n)\\,\\mathbb{P}\\qquad\\text{(Chapman–Kolmogorov).}",
   "variante": "paso siguiente",
   "cuando": "Se conoce el vector de estado en un paso y piden el del paso siguiente: se multiplica por la matriz de transición.",
   "condiciones": [
    "cadena homogénea"
   ],
   "slug": "cadenas-de-markov",
   "ancla": "matriz-de-transición",
   "tags": [
    "markov"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 626,
    "tipo": "bloque"
   }
  },
  {
   "id": "11-procesos-estocasticos-bernoulli--cadena-homogenea",
   "unidad": "6",
   "seccion": "11 · Procesos estocásticos (Bernoulli, Poisson, Markov)",
   "subseccion": "Cadenas de Markov",
   "nombre": "Cadena homogénea",
   "tex": "\\text{matriz de }n\\text{ pasos }\\mathbb{P}^{(n)}=\\mathbb{P}^n\\text{, con }(\\mathbb{P}^n)_{ij}=P(\\text{ir de }i\\text{ a }j\\text{ en }n\\text{ pasos})",
   "variante": "matriz de $n$ pasos",
   "cuando": "Piden la probabilidad de ir de un estado a otro en n pasos: es la entrada (i,j) de la matriz de transición elevada a n.",
   "condiciones": [
    "cadena homogénea"
   ],
   "slug": "cadenas-de-markov",
   "ancla": "cadena-homogénea",
   "tags": [
    "markov",
    "n-pasos"
   ],
   "esencial": true,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 628,
    "tipo": "parrafo"
   }
  },
  {
   "id": "11-procesos-estocasticos-bernoulli--cadena-homogenea-2",
   "unidad": "6",
   "seccion": "11 · Procesos estocásticos (Bernoulli, Poisson, Markov)",
   "subseccion": "Cadenas de Markov",
   "nombre": "Cadena homogénea",
   "tex": "\\vec p(n)=\\vec p(0)\\,\\mathbb{P}^{n}.",
   "variante": "vector de estado",
   "cuando": "Piden el estado después de n pasos: se multiplica el vector inicial por la matriz elevada a n.",
   "condiciones": [
    "cadena homogénea"
   ],
   "slug": "cadenas-de-markov",
   "ancla": "cadena-homogénea",
   "tags": [
    "markov"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 629,
    "tipo": "bloque"
   }
  },
  {
   "id": "11-procesos-estocasticos-bernoulli--distribucion-estacionaria",
   "unidad": "6",
   "seccion": "11 · Procesos estocásticos (Bernoulli, Poisson, Markov)",
   "subseccion": "Cadenas de Markov",
   "nombre": "Distribución estacionaria",
   "tex": "\\boxed{\\ \\vec\\pi=\\vec\\pi\\,\\mathbb{P},\\qquad \\sum_j \\pi_j=1.\\ }",
   "cuando": "Preguntan por el comportamiento a largo plazo o el equilibrio: se resuelve el sistema con la condición de que las componentes sumen 1.",
   "condiciones": [
    "cadena regular"
   ],
   "slug": "cadenas-de-markov",
   "ancla": "distribución-estacionaria",
   "tags": [
    "markov",
    "estacionaria"
   ],
   "esencial": true,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 632,
    "tipo": "bloque"
   }
  },
  {
   "id": "11-procesos-estocasticos-bernoulli--cadena-regular",
   "unidad": "6",
   "seccion": "11 · Procesos estocásticos (Bernoulli, Poisson, Markov)",
   "subseccion": "Cadenas de Markov",
   "nombre": "Cadena regular",
   "tex": "\\exists\\,n:\\ \\mathbb{P}^n>0\\ \\Longrightarrow\\ \\vec\\pi=\\lim_{n\\to\\infty}\\vec p(n)\\ \\text{ existe y no depende de }\\vec p(0)",
   "cuando": "Justificar que existe distribución estacionaria única y que el límite no depende del estado inicial.",
   "condiciones": [
    "cadena regular"
   ],
   "slug": "cadenas-de-markov",
   "ancla": "largo-plazo-de-una-cadena-regular",
   "tags": [
    "markov",
    "estacionaria"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 634,
    "tipo": "parrafo"
   }
  },
  {
   "id": "11-procesos-estocasticos-bernoulli--tiempo-hasta-absorcion",
   "unidad": "6",
   "seccion": "11 · Procesos estocásticos (Bernoulli, Poisson, Markov)",
   "subseccion": "Cadenas de Markov",
   "nombre": "Tiempo hasta absorción",
   "tex": "\\mathbb{P}=\\begin{pmatrix}\\mathbb{I} & \\mathbf{0}\\\\ \\mathbb{F} & \\mathbb{Q}\\end{pmatrix}\\text{, }\\ \\mathbb{M}=(\\mathbb{I}-\\mathbb{Q})^{-1}\\text{ (tiempos esperados por estado), }\\ \\mathbb{G}=\\mathbb{M}\\,\\mathbb{F}\\text{ (prob. de absorción por cada }s_j\\text{)}",
   "cuando": "Cadena con estados absorbentes: la forma canónica da la matriz fundamental M (tiempos esperados) y G (probabilidades de absorción).",
   "condiciones": [
    "hay estados absorbentes"
   ],
   "slug": "cadenas-de-markov",
   "ancla": "tiempo-hasta-absorción",
   "tags": [
    "markov",
    "absorcion"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 638,
    "tipo": "parrafo"
   }
  },
  {
   "id": "12-estadistica-descriptiva--media-sin-agrupar",
   "unidad": "1",
   "seccion": "12 · Estadística descriptiva",
   "subseccion": "Tendencia central",
   "nombre": "Media",
   "tex": "\\bar x = \\dfrac{1}{n}\\sum_{i=1}^n x_i",
   "variante": "sin agrupar",
   "cuando": "Piden el promedio de una lista de datos sin agrupar; es sensible a valores extremos.",
   "condiciones": [
    "datos sin agrupar"
   ],
   "slug": "medidas-de-tendencia-central",
   "ancla": "",
   "tags": [
    "descriptiva",
    "tendencia-central"
   ],
   "esencial": true,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 648,
    "tipo": "tabla"
   }
  },
  {
   "id": "12-estadistica-descriptiva--mediana-sin-agrupar",
   "unidad": "1",
   "seccion": "12 · Estadística descriptiva",
   "subseccion": "Tendencia central",
   "nombre": "Mediana $q_2$",
   "tex": "n\\text{ impar: obs. central pos. }\\frac{n+1}{2}\\text{; }n\\text{ par: promedio de pos. }\\frac{n}{2}\\text{ y }\\frac{n}{2}+1\\text{ (muestra ordenada)}",
   "variante": "sin agrupar",
   "cuando": "Piden el valor central de la muestra ordenada; es la medida robusta frente a outliers.",
   "condiciones": [
    "muestra ordenada"
   ],
   "slug": "medidas-de-tendencia-central",
   "ancla": "mediana",
   "tags": [
    "descriptiva",
    "tendencia-central",
    "robusta"
   ],
   "esencial": true,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 649,
    "tipo": "tabla"
   }
  },
  {
   "id": "12-estadistica-descriptiva--rango",
   "unidad": "1",
   "seccion": "12 · Estadística descriptiva",
   "subseccion": "Dispersión",
   "nombre": "Rango",
   "tex": "R = \\lvert\\max_i x_i - \\min_i x_i\\rvert",
   "cuando": "Medida de dispersión más simple: distancia entre el máximo y el mínimo.",
   "condiciones": [],
   "slug": "medidas-de-dispersion",
   "ancla": "rango",
   "tags": [
    "descriptiva",
    "dispersion"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 658,
    "tipo": "tabla"
   }
  },
  {
   "id": "12-estadistica-descriptiva--varianza-muestral",
   "unidad": "1",
   "seccion": "12 · Estadística descriptiva",
   "subseccion": "Dispersión",
   "nombre": "Varianza muestral",
   "tex": "\\;s^2 = \\dfrac{1}{n-1}\\displaystyle\\sum_{i=1}^n (x_i-\\bar x)^2\\;",
   "cuando": "Piden la dispersión de una muestra: se divide por n−1 para que el estimador sea insesgado.",
   "condiciones": [
    "denominador n−1"
   ],
   "slug": "varianza-muestral",
   "ancla": "",
   "tags": [
    "descriptiva",
    "dispersion"
   ],
   "esencial": true,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 659,
    "tipo": "tabla"
   }
  },
  {
   "id": "12-estadistica-descriptiva--desvio",
   "unidad": "1",
   "seccion": "12 · Estadística descriptiva",
   "subseccion": "Dispersión",
   "nombre": "Desvío",
   "tex": "s = \\sqrt{s^2}",
   "cuando": "Desvío muestral: raíz de la varianza, en las mismas unidades que los datos.",
   "condiciones": [],
   "slug": "medidas-de-dispersion",
   "ancla": "",
   "tags": [
    "descriptiva",
    "dispersion"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 660,
    "tipo": "tabla"
   }
  },
  {
   "id": "12-estadistica-descriptiva--desvio-abs-medio",
   "unidad": "1",
   "seccion": "12 · Estadística descriptiva",
   "subseccion": "Dispersión",
   "nombre": "Desvío abs. medio",
   "tex": "w = \\dfrac{1}{n}\\sum_{i=1}^n \\lvert x_i-\\bar x\\rvert",
   "cuando": "Dispersión medida con valores absolutos en lugar de cuadrados.",
   "condiciones": [],
   "slug": "medidas-de-dispersion",
   "ancla": "",
   "tags": [
    "descriptiva",
    "dispersion"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 661,
    "tipo": "tabla"
   }
  },
  {
   "id": "12-estadistica-descriptiva--mad",
   "unidad": "1",
   "seccion": "12 · Estadística descriptiva",
   "subseccion": "Dispersión",
   "nombre": "MAD",
   "tex": "\\text{MAD} = \\operatorname{mediana}\\{\\lvert x_i-\\bar x\\rvert\\}",
   "cuando": "Medida de dispersión robusta, basada en la mediana de los desvíos.",
   "condiciones": [],
   "slug": "medidas-de-dispersion",
   "ancla": "",
   "tags": [
    "descriptiva",
    "dispersion",
    "robusta"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 662,
    "tipo": "tabla"
   }
  },
  {
   "id": "12-estadistica-descriptiva--iqr",
   "unidad": "1",
   "seccion": "12 · Estadística descriptiva",
   "subseccion": "Dispersión",
   "nombre": "IQR",
   "tex": "\\text{IQR} = q_3 - q_1",
   "cuando": "Dispersión del 50 % central de los datos; es la base de la caja del boxplot.",
   "condiciones": [],
   "slug": "medidas-de-dispersion",
   "ancla": "",
   "tags": [
    "descriptiva",
    "dispersion",
    "boxplot"
   ],
   "esencial": true,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 663,
    "tipo": "tabla"
   }
  },
  {
   "id": "12-estadistica-descriptiva--dispersion",
   "unidad": "1",
   "seccion": "12 · Estadística descriptiva",
   "subseccion": "Dispersión",
   "nombre": "Dispersión",
   "tex": "s^2 = \\frac{1}{n-1}\\sum_{i=1}^n (x_i-\\bar x)^2 \\qquad s=\\sqrt{s^2}",
   "cuando": "Fórmula de trabajo de la varianza y el desvío muestrales.",
   "condiciones": [
    "denominador n−1"
   ],
   "slug": "medidas-de-dispersion",
   "ancla": "",
   "tags": [
    "descriptiva",
    "dispersion"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 665,
    "tipo": "bloque"
   }
  },
  {
   "id": "12-estadistica-descriptiva--cuartiles-y-percentiles",
   "unidad": "1",
   "seccion": "12 · Estadística descriptiva",
   "subseccion": "Cuartiles y percentiles",
   "nombre": "Cuartiles y percentiles",
   "tex": "\\frac{k}{n} \\le j\\cdot 0{,}25 < \\frac{k+1}{n}.",
   "cuando": "Regla de posición para ubicar el cuartil dentro de la muestra ordenada.",
   "condiciones": [
    "muestra ordenada"
   ],
   "slug": "cuartiles-y-percentiles",
   "ancla": "",
   "tags": [
    "descriptiva",
    "cuartiles"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 671,
    "tipo": "bloque"
   }
  },
  {
   "id": "12-estadistica-descriptiva--forma-asimetria-y-curtosis-muestral",
   "unidad": "1",
   "seccion": "12 · Estadística descriptiva",
   "subseccion": "Forma (asimetría y curtosis muestral)",
   "nombre": "Forma (asimetría y curtosis muestral)",
   "tex": "\\gamma = \\frac{1}{n s^3}\\sum_{i=1}^n (x_i-\\bar x)^3 \\qquad \\kappa = \\frac{1}{n s^4}\\sum_{i=1}^n (x_i-\\bar x)^4 - 3",
   "cuando": "Piden describir la forma de la muestra: el signo del sesgo y el exceso de curtosis respecto de la normal.",
   "condiciones": [],
   "slug": "asimetria-y-curtosis",
   "ancla": "",
   "tags": [
    "descriptiva",
    "forma"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 676,
    "tipo": "bloque"
   }
  },
  {
   "id": "12-estadistica-descriptiva--media",
   "unidad": "1",
   "seccion": "12 · Estadística descriptiva",
   "subseccion": "Datos agrupados",
   "nombre": "Media",
   "tex": "\\bar x_{Ag} = \\dfrac{1}{n}\\sum_{i=1}^L x_i\\, f_i",
   "cuando": "Datos presentados en tabla de frecuencias por intervalos: se usa la marca de clase como representante.",
   "condiciones": [
    "datos agrupados"
   ],
   "slug": "datos-agrupados",
   "ancla": "medidas-con-datos-agrupados",
   "tags": [
    "descriptiva",
    "datos-agrupados"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 685,
    "tipo": "tabla"
   }
  },
  {
   "id": "12-estadistica-descriptiva--desvio-2",
   "unidad": "1",
   "seccion": "12 · Estadística descriptiva",
   "subseccion": "Datos agrupados",
   "nombre": "Desvío",
   "tex": "s_{Ag} = \\sqrt{\\dfrac{1}{n-1}\\sum_{i=1}^L (x_i-\\bar x_{Ag})^2\\, f_i}",
   "cuando": "Desvío de datos agrupados, ponderando cada marca de clase por su frecuencia.",
   "condiciones": [
    "datos agrupados"
   ],
   "slug": "datos-agrupados",
   "ancla": "medidas-con-datos-agrupados",
   "tags": [
    "descriptiva",
    "datos-agrupados"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 686,
    "tipo": "tabla"
   }
  },
  {
   "id": "12-estadistica-descriptiva--asimetria",
   "unidad": "1",
   "seccion": "12 · Estadística descriptiva",
   "subseccion": "Datos agrupados",
   "nombre": "Asimetría",
   "tex": "\\gamma_{Ag} = \\dfrac{1}{n\\,s_{Ag}^3}\\sum (x_i-\\bar x_{Ag})^3 f_i",
   "cuando": "Asimetría de datos agrupados.",
   "condiciones": [
    "datos agrupados"
   ],
   "slug": "datos-agrupados",
   "ancla": "medidas-con-datos-agrupados",
   "tags": [
    "descriptiva",
    "datos-agrupados",
    "forma"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 687,
    "tipo": "tabla"
   }
  },
  {
   "id": "12-estadistica-descriptiva--curtosis",
   "unidad": "1",
   "seccion": "12 · Estadística descriptiva",
   "subseccion": "Datos agrupados",
   "nombre": "Curtosis",
   "tex": "\\kappa_{Ag} = \\dfrac{1}{n\\,s_{Ag}^4}\\sum (x_i-\\bar x_{Ag})^4 f_i - 3",
   "cuando": "Curtosis de datos agrupados; la normal es la referencia en cero.",
   "condiciones": [
    "datos agrupados"
   ],
   "slug": "datos-agrupados",
   "ancla": "medidas-con-datos-agrupados",
   "tags": [
    "descriptiva",
    "datos-agrupados",
    "forma"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 688,
    "tipo": "tabla"
   }
  },
  {
   "id": "12-estadistica-descriptiva--mediana-cuartiles-por-interpolacion-lineal",
   "unidad": "1",
   "seccion": "12 · Estadística descriptiva",
   "subseccion": "Datos agrupados",
   "nombre": "Mediana / cuartiles por interpolación lineal",
   "tex": "q = L_I + \\frac{\\alpha n - F_{\\text{ant}}}{F - F_{\\text{ant}}}\\,(L_{s}-L_I), \\qquad \\text{mediana: }\\alpha=0{,}5.",
   "cuando": "Datos agrupados y piden mediana o cuartiles: se ubica el intervalo por la frecuencia acumulada y se interpola dentro.",
   "condiciones": [
    "datos agrupados"
   ],
   "slug": "datos-agrupados",
   "ancla": "mediana-y-cuartiles-interpolación",
   "tags": [
    "descriptiva",
    "datos-agrupados",
    "cuartiles"
   ],
   "esencial": true,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 691,
    "tipo": "bloque"
   }
  },
  {
   "id": "12-estadistica-descriptiva--moda-agrupada",
   "unidad": "1",
   "seccion": "12 · Estadística descriptiva",
   "subseccion": "Datos agrupados",
   "nombre": "Moda agrupada",
   "tex": "M=\\frac{L_I+L_D}{2}",
   "variante": "punto medio",
   "cuando": "Aproximación rápida a la moda de datos agrupados: el punto medio del intervalo modal.",
   "condiciones": [
    "datos agrupados"
   ],
   "slug": "datos-agrupados",
   "ancla": "medidas-con-datos-agrupados",
   "tags": [
    "descriptiva",
    "datos-agrupados"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 693,
    "tipo": "parrafo"
   }
  },
  {
   "id": "12-estadistica-descriptiva--moda-agrupada-2",
   "unidad": "1",
   "seccion": "12 · Estadística descriptiva",
   "subseccion": "Datos agrupados",
   "nombre": "Moda agrupada",
   "tex": "M = \\frac{L_D(f_M-f_I) + L_I(f_M-f_D)}{(f_M-f_I)+(f_M-f_D)}.",
   "variante": "interpolación",
   "cuando": "Moda de datos agrupados con más precisión: se interpola dentro del intervalo modal usando las frecuencias vecinas.",
   "condiciones": [
    "datos agrupados"
   ],
   "slug": "datos-agrupados",
   "ancla": "medidas-con-datos-agrupados",
   "tags": [
    "descriptiva",
    "datos-agrupados"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 694,
    "tipo": "bloque"
   }
  },
  {
   "id": "12-estadistica-descriptiva--boxplot-y-outliers-de-tukey",
   "unidad": "1",
   "seccion": "12 · Estadística descriptiva",
   "subseccion": "Boxplot y outliers de Tukey",
   "nombre": "Boxplot y outliers de Tukey",
   "tex": "[\\,q_1 - 1{,}5\\,\\text{IQR}\\;,\\;\\; q_3 + 1{,}5\\,\\text{IQR}\\,].",
   "cuando": "Piden detectar valores atípicos o dibujar el boxplot: todo dato fuera de las cercas es outlier.",
   "condiciones": [
    "cuartiles conocidos"
   ],
   "slug": "boxplot",
   "ancla": "",
   "tags": [
    "descriptiva",
    "boxplot",
    "outliers"
   ],
   "esencial": true,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 700,
    "tipo": "bloque"
   }
  },
  {
   "id": "13-inferencia-y-pruebas--sesgo",
   "unidad": "8",
   "seccion": "13 · Inferencia y pruebas de hipótesis (resumen)",
   "subseccion": "Estimación puntual",
   "nombre": "Sesgo",
   "tex": "\\mathrm{sesgo}(\\hat\\theta)=E[\\hat\\theta]-\\theta",
   "cuando": "Piden decidir si un estimador es insesgado: se calcula su esperanza y se compara con el parámetro.",
   "condiciones": [],
   "slug": "estimacion-puntual",
   "ancla": "calidad-de-un-estimador",
   "tags": [
    "estimacion",
    "sesgo"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 713,
    "tipo": "tabla"
   }
  },
  {
   "id": "13-inferencia-y-pruebas--insesgado",
   "unidad": "8",
   "seccion": "13 · Inferencia y pruebas de hipótesis (resumen)",
   "subseccion": "Estimación puntual",
   "nombre": "Insesgado",
   "tex": "E[\\hat\\theta]=\\theta",
   "cuando": "Definición de estimador insesgado.",
   "condiciones": [],
   "slug": "estimacion-puntual",
   "ancla": "calidad-de-un-estimador",
   "tags": [
    "estimacion",
    "sesgo"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 714,
    "tipo": "tabla"
   }
  },
  {
   "id": "13-inferencia-y-pruebas--ecm",
   "unidad": "8",
   "seccion": "13 · Inferencia y pruebas de hipótesis (resumen)",
   "subseccion": "Estimación puntual",
   "nombre": "ECM",
   "tex": "\\mathrm{mse}(\\hat\\theta)=E[(\\hat\\theta-\\theta)^2]=V(\\hat\\theta)+\\mathrm{sesgo}^2(\\hat\\theta)",
   "cuando": "Piden comparar dos estimadores: el error cuadrático medio junta varianza y sesgo en un solo número.",
   "condiciones": [],
   "slug": "estimacion-puntual",
   "ancla": "calidad-de-un-estimador",
   "tags": [
    "estimacion",
    "ecm"
   ],
   "esencial": true,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 715,
    "tipo": "tabla"
   }
  },
  {
   "id": "13-inferencia-y-pruebas--consistente",
   "unidad": "8",
   "seccion": "13 · Inferencia y pruebas de hipótesis (resumen)",
   "subseccion": "Estimación puntual",
   "nombre": "Consistente",
   "tex": "\\lim_{n\\to\\infty}\\mathrm{mse}(\\hat\\theta)=0",
   "cuando": "Piden justificar que un estimador mejora al crecer la muestra.",
   "condiciones": [
    "n → ∞"
   ],
   "slug": "estimacion-puntual",
   "ancla": "calidad-de-un-estimador",
   "tags": [
    "estimacion",
    "consistencia"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 716,
    "tipo": "tabla"
   }
  },
  {
   "id": "13-inferencia-y-pruebas--media-estimador",
   "unidad": "8",
   "seccion": "13 · Inferencia y pruebas de hipótesis (resumen)",
   "subseccion": "Estimación puntual",
   "nombre": "Media $\\mu$",
   "tex": "\\overline X_n=\\frac1n\\sum X_i",
   "variante": "Estimador",
   "cuando": "Estimador natural de la media poblacional: el promedio muestral.",
   "condiciones": [
    "i.i.d."
   ],
   "slug": "estimacion-puntual",
   "ancla": "",
   "tags": [
    "estimacion",
    "media"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 722,
    "tipo": "tabla"
   }
  },
  {
   "id": "13-inferencia-y-pruebas--media-ecm",
   "unidad": "8",
   "seccion": "13 · Inferencia y pruebas de hipótesis (resumen)",
   "subseccion": "Estimación puntual",
   "nombre": "Media $\\mu$",
   "tex": "\\sigma^2/n",
   "variante": "ECM",
   "cuando": "Error cuadrático medio del promedio muestral: es insesgado, así que coincide con su varianza.",
   "condiciones": [
    "i.i.d."
   ],
   "slug": "estimacion-puntual",
   "ancla": "",
   "tags": [
    "estimacion",
    "media",
    "ecm"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 722,
    "tipo": "tabla"
   }
  },
  {
   "id": "13-inferencia-y-pruebas--proporcion-estimador",
   "unidad": "8",
   "seccion": "13 · Inferencia y pruebas de hipótesis (resumen)",
   "subseccion": "Estimación puntual",
   "nombre": "Proporción $p$",
   "tex": "\\hat p=\\frac{X}{n}=\\frac1n\\sum X_i",
   "variante": "Estimador",
   "cuando": "Estimador de una proporción poblacional: la frecuencia relativa observada.",
   "condiciones": [
    "ensayos Bernoulli"
   ],
   "slug": "estimacion-puntual",
   "ancla": "",
   "tags": [
    "estimacion",
    "proporcion"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 723,
    "tipo": "tabla"
   }
  },
  {
   "id": "13-inferencia-y-pruebas--proporcion-ecm",
   "unidad": "8",
   "seccion": "13 · Inferencia y pruebas de hipótesis (resumen)",
   "subseccion": "Estimación puntual",
   "nombre": "Proporción $p$",
   "tex": "p(1-p)/n",
   "variante": "ECM",
   "cuando": "Error cuadrático medio de la proporción muestral.",
   "condiciones": [],
   "slug": "estimacion-puntual",
   "ancla": "",
   "tags": [
    "estimacion",
    "proporcion",
    "ecm"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 723,
    "tipo": "tabla"
   }
  },
  {
   "id": "13-inferencia-y-pruebas--varianza-estimador",
   "unidad": "8",
   "seccion": "13 · Inferencia y pruebas de hipótesis (resumen)",
   "subseccion": "Estimación puntual",
   "nombre": "Varianza $\\sigma^2$",
   "tex": "S_n^2=\\frac{1}{n-1}\\sum(X_i-\\overline X_n)^2",
   "variante": "Estimador",
   "cuando": "Estimador insesgado de la varianza poblacional, con denominador n−1.",
   "condiciones": [
    "denominador n−1"
   ],
   "slug": "varianza-muestral",
   "ancla": "",
   "tags": [
    "estimacion",
    "varianza"
   ],
   "esencial": true,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 724,
    "tipo": "tabla"
   }
  },
  {
   "id": "13-inferencia-y-pruebas--identidad-de-calculo",
   "unidad": "8",
   "seccion": "13 · Inferencia y pruebas de hipótesis (resumen)",
   "subseccion": "Estimación puntual",
   "nombre": "Identidad de cálculo",
   "tex": "(n-1)S_n^2=\\sum X_i^2-n\\overline X_n^2\\text{. Si normal, }\\dfrac{(n-1)S_n^2}{\\sigma^2}\\sim\\chi^2_{n-1}",
   "cuando": "Calcular la varianza muestral a mano con la suma de cuadrados, y reconocer el pivote ji-cuadrado del IC de varianza.",
   "condiciones": [
    "X normal"
   ],
   "slug": "estimacion-puntual",
   "ancla": "",
   "tags": [
    "varianza-muestral",
    "ji-cuadrado"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 726,
    "tipo": "parrafo"
   }
  },
  {
   "id": "13-inferencia-y-pruebas--maxima-verosimilitud-mv",
   "unidad": "8",
   "seccion": "13 · Inferencia y pruebas de hipótesis (resumen)",
   "subseccion": "Estimación puntual",
   "nombre": "Máxima verosimilitud (MV)",
   "tex": "\\hat\\theta=\\arg\\max_\\theta\\prod_i f(x_i;\\theta)=\\arg\\max_\\theta\\sum_i\\ln f(x_i;\\theta)",
   "cuando": "Dan una densidad con parámetro desconocido y una muestra: se maximiza el logaritmo de la verosimilitud. Si el parámetro está en el borde del soporte, se maximiza analizando el soporte y no derivando.",
   "condiciones": [
    "muestra i.i.d."
   ],
   "slug": "estimacion-puntual",
   "ancla": "",
   "tags": [
    "estimacion",
    "maxima-verosimilitud"
   ],
   "esencial": true,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 730,
    "tipo": "vineta"
   }
  },
  {
   "id": "13-inferencia-y-pruebas--map-bayesiano",
   "unidad": "8",
   "seccion": "13 · Inferencia y pruebas de hipótesis (resumen)",
   "subseccion": "Estimación puntual",
   "nombre": "MAP (bayesiano)",
   "tex": "\\hat\\theta=\\arg\\max_\\theta g(\\theta\\mid x)\\text{ con }g(\\theta\\mid x)\\propto f(x\\mid\\theta)\\,g(\\theta)\\text{.}",
   "cuando": "Hay información a priori sobre el parámetro: se maximiza la densidad a posteriori.",
   "condiciones": [
    "a priori conocida"
   ],
   "slug": "estimacion-puntual",
   "ancla": "",
   "tags": [
    "estimacion",
    "bayesiano"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 731,
    "tipo": "vineta"
   }
  },
  {
   "id": "13-inferencia-y-pruebas--momentos",
   "unidad": "8",
   "seccion": "13 · Inferencia y pruebas de hipótesis (resumen)",
   "subseccion": "Estimación puntual",
   "nombre": "Momentos",
   "tex": "\\mu_k=E[X^k]=H(\\theta)\\ \\Longrightarrow\\ \\hat\\theta=H^{-1}(\\hat\\mu_k)",
   "cuando": "Método alternativo cuando la verosimilitud es incómoda: igualar momentos teóricos y muestrales.",
   "condiciones": [],
   "slug": "estimacion-puntual",
   "ancla": "",
   "tags": [
    "estimacion",
    "momentos"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 732,
    "tipo": "vineta"
   }
  },
  {
   "id": "13-inferencia-y-pruebas--semiamplitud-bilateral",
   "unidad": "8",
   "seccion": "13 · Inferencia y pruebas de hipótesis (resumen)",
   "subseccion": "Intervalos de confianza",
   "nombre": "Semiamplitud bilateral",
   "tex": "\\Delta_B\\text{ (IC bilateral }=\\hat\\theta\\pm\\Delta_B\\text{); en unilaterales usar }\\gamma\\text{ en vez de }\\frac{1+\\gamma}{2}\\text{. }z_p=\\Phi^{-1}(p)\\text{, }t_{m,p}=F_{T_m}^{-1}(p)",
   "cuando": "Armar cualquier IC de la tabla: el intervalo es el estimador más o menos la semiamplitud, y el fractil cambia entre bilateral y unilateral.",
   "condiciones": [
    "confianza γ"
   ],
   "slug": "intervalos-de-confianza",
   "ancla": "",
   "tags": [
    "intervalo-confianza",
    "ic"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 736,
    "tipo": "parrafo"
   }
  },
  {
   "id": "13-inferencia-y-pruebas--media-conocido-condicion",
   "unidad": "8",
   "seccion": "13 · Inferencia y pruebas de hipótesis (resumen)",
   "subseccion": "Intervalos de confianza",
   "nombre": "Media, $\\sigma$ conocido",
   "tex": "\\text{normal (o }n\\text{ grande, TCL)}",
   "variante": "Condición",
   "cuando": "Condición de validez del intervalo con Z para la media.",
   "condiciones": [
    "σ conocido"
   ],
   "slug": "intervalos-de-confianza",
   "ancla": "",
   "tags": [
    "intervalo-confianza",
    "media",
    "ic"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 740,
    "tipo": "tabla"
   }
  },
  {
   "id": "13-inferencia-y-pruebas--media-conocido-b",
   "unidad": "8",
   "seccion": "13 · Inferencia y pruebas de hipótesis (resumen)",
   "subseccion": "Intervalos de confianza",
   "nombre": "Media, $\\sigma$ conocido",
   "tex": "z_{\\frac{1+\\gamma}{2}}\\dfrac{\\sigma}{\\sqrt n}",
   "variante": "$\\Delta_B$",
   "cuando": "IC para la media con desvío poblacional conocido: semiamplitud con el fractil normal.",
   "condiciones": [
    "σ conocido",
    "X normal o n grande"
   ],
   "slug": "intervalos-de-confianza",
   "ancla": "",
   "tags": [
    "intervalo-confianza",
    "media",
    "ic"
   ],
   "esencial": true,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 740,
    "tipo": "tabla"
   }
  },
  {
   "id": "13-inferencia-y-pruebas--proporcion-condicion",
   "unidad": "8",
   "seccion": "13 · Inferencia y pruebas de hipótesis (resumen)",
   "subseccion": "Intervalos de confianza",
   "nombre": "Proporción",
   "tex": "n\\text{ grande}",
   "variante": "Condición",
   "cuando": "Condición de validez del intervalo para la proporción: muestra grande.",
   "condiciones": [
    "n grande"
   ],
   "slug": "intervalos-de-confianza",
   "ancla": "",
   "tags": [
    "intervalo-confianza",
    "proporcion",
    "ic"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 741,
    "tipo": "tabla"
   }
  },
  {
   "id": "13-inferencia-y-pruebas--proporcion-b",
   "unidad": "8",
   "seccion": "13 · Inferencia y pruebas de hipótesis (resumen)",
   "subseccion": "Intervalos de confianza",
   "nombre": "Proporción",
   "tex": "z_{\\frac{1+\\gamma}{2}}\\sqrt{\\dfrac{\\hat p(1-\\hat p)}{n}}",
   "variante": "$\\Delta_B$",
   "cuando": "IC para una proporción (porcentaje de aprobación, de piezas defectuosas): semiamplitud con el desvío estimado.",
   "condiciones": [
    "n grande"
   ],
   "slug": "intervalos-de-confianza",
   "ancla": "",
   "tags": [
    "intervalo-confianza",
    "proporcion",
    "ic"
   ],
   "esencial": true,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 741,
    "tipo": "tabla"
   }
  },
  {
   "id": "13-inferencia-y-pruebas--media-desconocido-b",
   "unidad": "8",
   "seccion": "13 · Inferencia y pruebas de hipótesis (resumen)",
   "subseccion": "Intervalos de confianza",
   "nombre": "Media, $\\sigma$ desconocido",
   "tex": "t_{n-1,\\frac{1+\\gamma}{2}}\\dfrac{S_n}{\\sqrt n}",
   "variante": "$\\Delta_B$",
   "cuando": "IC para la media cuando el desvío se estima con la muestra y n es chico: fractil t con n−1 grados de libertad.",
   "condiciones": [
    "σ desconocido",
    "población normal"
   ],
   "slug": "intervalos-de-confianza",
   "ancla": "",
   "tags": [
    "intervalo-confianza",
    "media",
    "t-student",
    "ic"
   ],
   "esencial": true,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 742,
    "tipo": "tabla"
   }
  },
  {
   "id": "13-inferencia-y-pruebas--intervalos-de-confianza",
   "unidad": "8",
   "seccion": "13 · Inferencia y pruebas de hipótesis (resumen)",
   "subseccion": "Intervalos de confianza",
   "nombre": "Intervalos de confianza",
   "tex": "IC_\\gamma(\\mu)=\\overline X_n\\pm z_{\\frac{1+\\gamma}{2}}\\frac{\\sigma}{\\sqrt n},\\qquad IC_\\gamma(p)=\\hat p\\pm z_{\\frac{1+\\gamma}{2}}\\sqrt{\\frac{\\hat p(1-\\hat p)}{n}},\\qquad IC_\\gamma(\\mu)=\\overline X_n\\pm t_{n-1,\\frac{1+\\gamma}{2}}\\frac{S_n}{\\sqrt n}.",
   "cuando": "Resumen de los tres intervalos bilaterales más usados, en formato estimador ± semiamplitud.",
   "condiciones": [],
   "slug": "intervalos-de-confianza",
   "ancla": "",
   "tags": [
    "intervalo-confianza",
    "ic"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 744,
    "tipo": "bloque"
   }
  },
  {
   "id": "13-inferencia-y-pruebas--media",
   "unidad": "8",
   "seccion": "13 · Inferencia y pruebas de hipótesis (resumen)",
   "subseccion": "Intervalos de confianza",
   "nombre": "Media",
   "tex": "n\\ge z_{\\frac{1+\\gamma}{2}}^2\\,\\dfrac{\\sigma^2}{E^2}",
   "cuando": "Preguntan qué tamaño de muestra hace falta para no superar cierto error al estimar una media.",
   "condiciones": [
    "σ conocido o piloto"
   ],
   "slug": "intervalos-de-confianza",
   "ancla": "",
   "tags": [
    "tamano-muestral",
    "media",
    "ic"
   ],
   "esencial": true,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 752,
    "tipo": "tabla"
   }
  },
  {
   "id": "13-inferencia-y-pruebas--proporcion-cota-conservadora",
   "unidad": "8",
   "seccion": "13 · Inferencia y pruebas de hipótesis (resumen)",
   "subseccion": "Intervalos de confianza",
   "nombre": "Proporción (cota conservadora)",
   "tex": "n\\ge z_{\\frac{1+\\gamma}{2}}^2\\,\\dfrac{1/4}{E^2}",
   "cuando": "Tamaño de muestra para una proporción sin ninguna estimación previa: se usa la cota 1/4, que es el peor caso.",
   "condiciones": [
    "sin estimación previa"
   ],
   "slug": "intervalos-de-confianza",
   "ancla": "",
   "tags": [
    "tamano-muestral",
    "proporcion",
    "ic"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 753,
    "tipo": "tabla"
   }
  },
  {
   "id": "13-inferencia-y-pruebas--proporcion-con-previo",
   "unidad": "8",
   "seccion": "13 · Inferencia y pruebas de hipótesis (resumen)",
   "subseccion": "Intervalos de confianza",
   "nombre": "Proporción (con $\\hat p$ previo)",
   "tex": "n\\ge z_{\\frac{1+\\gamma}{2}}^2\\,\\dfrac{\\hat p(1-\\hat p)}{E^2}",
   "cuando": "Tamaño de muestra para una proporción cuando hay una estimación previa o una muestra piloto.",
   "condiciones": [
    "p̂ previo"
   ],
   "slug": "intervalos-de-confianza",
   "ancla": "",
   "tags": [
    "tamano-muestral",
    "proporcion",
    "ic"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 754,
    "tipo": "tabla"
   }
  },
  {
   "id": "13-inferencia-y-pruebas--estadisticos",
   "unidad": "9",
   "seccion": "13 · Inferencia y pruebas de hipótesis (resumen)",
   "subseccion": "Pruebas de hipótesis",
   "nombre": "Estadísticos",
   "tex": "Z_{\\text{media}}=\\frac{\\bar X-\\mu_0}{\\sigma/\\sqrt n}\\;(\\sigma\\text{ conocida o }n\\text{ grande}),\\qquad T=\\frac{\\bar X-\\mu_0}{S/\\sqrt n}\\sim t_{n-1}\\;(\\sigma\\text{ desc., }n\\text{ chico, normal}),",
   "variante": "media",
   "cuando": "Estadísticos de prueba para la media: Z si el desvío es conocido o n es grande, T si se estima con la muestra.",
   "condiciones": [
    "σ conocido o n grande"
   ],
   "slug": "estadistico-de-prueba",
   "ancla": "",
   "tags": [
    "prueba-hipotesis",
    "estadistico"
   ],
   "esencial": true,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 762,
    "tipo": "bloque"
   }
  },
  {
   "id": "13-inferencia-y-pruebas--estadisticos-2",
   "unidad": "9",
   "seccion": "13 · Inferencia y pruebas de hipótesis (resumen)",
   "subseccion": "Pruebas de hipótesis",
   "nombre": "Estadísticos",
   "tex": "Z_{\\text{prop}}=\\frac{\\hat q-q_0}{\\sqrt{q_0(1-q_0)/n}}\\;(n>100),\\qquad \\hat q=X/n.",
   "variante": "proporción",
   "cuando": "Estadístico de prueba para una proporción, con el desvío evaluado bajo la hipótesis nula.",
   "condiciones": [
    "n > 100"
   ],
   "slug": "estadistico-de-prueba",
   "ancla": "",
   "tags": [
    "prueba-hipotesis",
    "proporcion"
   ],
   "esencial": true,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 764,
    "tipo": "bloque"
   }
  },
  {
   "id": "13-inferencia-y-pruebas--dos-colas-h0h1",
   "unidad": "9",
   "seccion": "13 · Inferencia y pruebas de hipótesis (resumen)",
   "subseccion": "Pruebas de hipótesis",
   "nombre": "Dos colas",
   "tex": "=\\ /\\ \\ne",
   "variante": "$H_0\\ /\\ H_1$",
   "cuando": "Forma de las hipótesis cuando la pregunta es si el parámetro cambió (en cualquier dirección).",
   "condiciones": [],
   "slug": "estadistico-de-prueba",
   "ancla": "",
   "tags": [
    "prueba-hipotesis",
    "colas"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 770,
    "tipo": "tabla"
   }
  },
  {
   "id": "13-inferencia-y-pruebas--dos-colas-rechaza-si",
   "unidad": "9",
   "seccion": "13 · Inferencia y pruebas de hipótesis (resumen)",
   "subseccion": "Pruebas de hipótesis",
   "nombre": "Dos colas",
   "tex": "\\lvert Z\\rvert>z_{1-\\alpha/2}",
   "variante": "Rechaza si ($Z$)",
   "cuando": "Región de rechazo bilateral con el estadístico Z.",
   "condiciones": [
    "σ conocido o n grande"
   ],
   "slug": "estadistico-de-prueba",
   "ancla": "",
   "tags": [
    "prueba-hipotesis",
    "region-rechazo"
   ],
   "esencial": true,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 770,
    "tipo": "tabla"
   }
  },
  {
   "id": "13-inferencia-y-pruebas--dos-colas-rechaza-si-2",
   "unidad": "9",
   "seccion": "13 · Inferencia y pruebas de hipótesis (resumen)",
   "subseccion": "Pruebas de hipótesis",
   "nombre": "Dos colas",
   "tex": "\\lvert T\\rvert>t_{n-1,1-\\alpha/2}",
   "variante": "Rechaza si ($T$)",
   "cuando": "Región de rechazo bilateral con el estadístico T.",
   "condiciones": [
    "σ desconocido",
    "n chico"
   ],
   "slug": "estadistico-de-prueba",
   "ancla": "",
   "tags": [
    "prueba-hipotesis",
    "region-rechazo"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 770,
    "tipo": "tabla"
   }
  },
  {
   "id": "13-inferencia-y-pruebas--cola-derecha-h0h1",
   "unidad": "9",
   "seccion": "13 · Inferencia y pruebas de hipótesis (resumen)",
   "subseccion": "Pruebas de hipótesis",
   "nombre": "Cola derecha",
   "tex": "\\le\\ /\\ >",
   "variante": "$H_0\\ /\\ H_1$",
   "cuando": "Forma de las hipótesis cuando se sospecha que el parámetro aumentó.",
   "condiciones": [],
   "slug": "estadistico-de-prueba",
   "ancla": "",
   "tags": [
    "prueba-hipotesis",
    "colas"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 771,
    "tipo": "tabla"
   }
  },
  {
   "id": "13-inferencia-y-pruebas--cola-derecha-rechaza-si",
   "unidad": "9",
   "seccion": "13 · Inferencia y pruebas de hipótesis (resumen)",
   "subseccion": "Pruebas de hipótesis",
   "nombre": "Cola derecha",
   "tex": "Z>z_{1-\\alpha}",
   "variante": "Rechaza si ($Z$)",
   "cuando": "Región de rechazo a derecha con Z: se rechaza si el estadístico es demasiado grande.",
   "condiciones": [
    "σ conocido o n grande"
   ],
   "slug": "estadistico-de-prueba",
   "ancla": "",
   "tags": [
    "prueba-hipotesis",
    "region-rechazo"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 771,
    "tipo": "tabla"
   }
  },
  {
   "id": "13-inferencia-y-pruebas--cola-derecha-rechaza-si-2",
   "unidad": "9",
   "seccion": "13 · Inferencia y pruebas de hipótesis (resumen)",
   "subseccion": "Pruebas de hipótesis",
   "nombre": "Cola derecha",
   "tex": "T>t_{n-1,1-\\alpha}",
   "variante": "Rechaza si ($T$)",
   "cuando": "Región de rechazo a derecha con T.",
   "condiciones": [
    "σ desconocido",
    "n chico"
   ],
   "slug": "estadistico-de-prueba",
   "ancla": "",
   "tags": [
    "prueba-hipotesis",
    "region-rechazo"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 771,
    "tipo": "tabla"
   }
  },
  {
   "id": "13-inferencia-y-pruebas--cola-izquierda-h0h1",
   "unidad": "9",
   "seccion": "13 · Inferencia y pruebas de hipótesis (resumen)",
   "subseccion": "Pruebas de hipótesis",
   "nombre": "Cola izquierda",
   "tex": "\\ge\\ /\\ <",
   "variante": "$H_0\\ /\\ H_1$",
   "cuando": "Forma de las hipótesis cuando se sospecha que el parámetro disminuyó.",
   "condiciones": [],
   "slug": "estadistico-de-prueba",
   "ancla": "",
   "tags": [
    "prueba-hipotesis",
    "colas"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 772,
    "tipo": "tabla"
   }
  },
  {
   "id": "13-inferencia-y-pruebas--cola-izquierda-rechaza-si",
   "unidad": "9",
   "seccion": "13 · Inferencia y pruebas de hipótesis (resumen)",
   "subseccion": "Pruebas de hipótesis",
   "nombre": "Cola izquierda",
   "tex": "Z<-z_{1-\\alpha}",
   "variante": "Rechaza si ($Z$)",
   "cuando": "Región de rechazo a izquierda con Z.",
   "condiciones": [
    "σ conocido o n grande"
   ],
   "slug": "estadistico-de-prueba",
   "ancla": "",
   "tags": [
    "prueba-hipotesis",
    "region-rechazo"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 772,
    "tipo": "tabla"
   }
  },
  {
   "id": "13-inferencia-y-pruebas--cola-izquierda-rechaza-si-2",
   "unidad": "9",
   "seccion": "13 · Inferencia y pruebas de hipótesis (resumen)",
   "subseccion": "Pruebas de hipótesis",
   "nombre": "Cola izquierda",
   "tex": "T<-t_{n-1,1-\\alpha}",
   "variante": "Rechaza si ($T$)",
   "cuando": "Región de rechazo a izquierda con T.",
   "condiciones": [
    "σ desconocido",
    "n chico"
   ],
   "slug": "estadistico-de-prueba",
   "ancla": "",
   "tags": [
    "prueba-hipotesis",
    "region-rechazo"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 772,
    "tipo": "tabla"
   }
  },
  {
   "id": "13-inferencia-y-pruebas--valor-critico-del-estimador-media-conocida",
   "unidad": "9",
   "seccion": "13 · Inferencia y pruebas de hipótesis (resumen)",
   "subseccion": "Pruebas de hipótesis",
   "nombre": "Valor crítico del estimador (media, $\\sigma$ conocida)",
   "tex": "\\text{dos colas }\\bar x_c=\\mu_0\\pm z_{1-\\alpha/2}\\frac{\\sigma}{\\sqrt n}\\text{; cola derecha }\\bar x_c=\\mu_0+z_{1-\\alpha}\\frac{\\sigma}{\\sqrt n}",
   "cuando": "Expresar la región de rechazo en las unidades del problema en vez de en Z.",
   "condiciones": [
    "σ conocida"
   ],
   "slug": "estadistico-de-prueba",
   "ancla": "",
   "tags": [
    "prueba-hipotesis",
    "valor-critico"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 774,
    "tipo": "parrafo"
   }
  },
  {
   "id": "13-inferencia-y-pruebas--valor-p",
   "unidad": "9",
   "seccion": "13 · Inferencia y pruebas de hipótesis (resumen)",
   "subseccion": "Pruebas de hipótesis",
   "nombre": "Valor p",
   "tex": "p=\\begin{cases}1-\\Phi(z_{\\text{obs}}) & \\text{cola derecha}\\\\\\Phi(z_{\\text{obs}}) & \\text{cola izquierda}\\\\2\\big(1-\\Phi(\\lvert z_{\\text{obs}}\\rvert)\\big) & \\text{dos colas}\\end{cases}\\qquad \\text{rechazar }H_0\\iff p<\\alpha",
   "cuando": "Calcular el valor p a partir del estadístico observado y decidir sin buscar el valor crítico.",
   "condiciones": [
    "$z_{\\text{obs}}$ si $\\sigma$ es conocida",
    "$t_{\\text{obs}}$ con $\\Xi_{n-1}$ si $\\sigma$ es desconocida"
   ],
   "slug": "valor-p",
   "ancla": "regla-de-decisión-con-el-valor-p",
   "tags": [
    "prueba-hipotesis",
    "valor-p"
   ],
   "esencial": true,
   "origen": {
    "archivo": "wiki/formularios/formulario-maestro.md",
    "linea": 776,
    "tipo": "parrafo"
   }
  },
  {
   "id": "general-v-a-c--fda",
   "unidad": "4",
   "seccion": "General (v.a.c.)",
   "subseccion": "",
   "nombre": "FDA",
   "tex": "F_X(x)=P(X\\le x)=\\int_{-\\infty}^{x} f_X(y)\\,dy",
   "cuando": "Obtener la FDA de una variable continua integrando la densidad desde menos infinito.",
   "condiciones": [
    "X continua"
   ],
   "slug": "formulario-va-continuas",
   "ancla": "general-vac",
   "tags": [
    "continua",
    "fda"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-va-continuas.md",
    "linea": 27,
    "tipo": "tabla"
   }
  },
  {
   "id": "general-v-a-c--densidad",
   "unidad": "4",
   "seccion": "General (v.a.c.)",
   "subseccion": "",
   "nombre": "Densidad",
   "tex": "f_X(x)=\\dfrac{dF_X(x)}{dx}\\text{, con }f_X\\ge0\\text{, }\\int_{\\mathbb{R}}f_X=1",
   "cuando": "Chequeo de que una función es densidad válida y relación con la FDA por derivación.",
   "condiciones": [
    "f ≥ 0",
    "integral 1"
   ],
   "slug": "formulario-va-continuas",
   "ancla": "general-vac",
   "tags": [
    "vac",
    "densidad"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-va-continuas.md",
    "linea": 28,
    "tipo": "tabla"
   }
  },
  {
   "id": "general-v-a-c--probabilidad",
   "unidad": "4",
   "seccion": "General (v.a.c.)",
   "subseccion": "",
   "nombre": "Probabilidad",
   "tex": "P(a<X\\le b)=F_X(b)-F_X(a)=\\int_a^b f_X",
   "cuando": "Probabilidad de un intervalo en el caso continuo, por diferencia de FDA o por integral.",
   "condiciones": [
    "X continua"
   ],
   "slug": "probabilidad",
   "ancla": "",
   "tags": [
    "vac",
    "fda"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-va-continuas.md",
    "linea": 29,
    "tipo": "tabla"
   }
  },
  {
   "id": "general-v-a-c--esperanza",
   "unidad": "4",
   "seccion": "General (v.a.c.)",
   "subseccion": "",
   "nombre": "Esperanza",
   "tex": "E[X]=\\int_{-\\infty}^{+\\infty} x\\,f_X(x)\\,dx",
   "cuando": "Media de una variable continua.",
   "condiciones": [
    "X continua"
   ],
   "slug": "esperanza",
   "ancla": "",
   "tags": [
    "vac",
    "esperanza"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-va-continuas.md",
    "linea": 30,
    "tipo": "tabla"
   }
  },
  {
   "id": "general-v-a-c--esperanza-por-la-cola-si",
   "unidad": "4",
   "seccion": "General (v.a.c.)",
   "subseccion": "",
   "nombre": "Esperanza por la cola (si $X\\ge0$)",
   "tex": "E[X]=\\int_0^{+\\infty}\\big(1-F_X(x)\\big)\\,dx=\\int_0^{+\\infty}P(X>x)\\,dx",
   "cuando": "Variable no negativa de la que se conoce la supervivencia: se integra P(X > x) en vez de la densidad.",
   "condiciones": [
    "X ≥ 0"
   ],
   "slug": "formulario-va-continuas",
   "ancla": "general-vac",
   "tags": [
    "vac",
    "esperanza"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-va-continuas.md",
    "linea": 31,
    "tipo": "tabla"
   }
  },
  {
   "id": "general-v-a-c--momento",
   "unidad": "4",
   "seccion": "General (v.a.c.)",
   "subseccion": "",
   "nombre": "Momento $k$",
   "tex": "E[X^k]=\\int_{-\\infty}^{+\\infty} x^k\\,f_X(x)\\,dx",
   "cuando": "Momento de orden k de una variable continua; se usa para varianza, asimetría y curtosis.",
   "condiciones": [
    "X continua"
   ],
   "slug": "formulario-va-continuas",
   "ancla": "general-vac",
   "tags": [
    "vac",
    "momentos"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-va-continuas.md",
    "linea": 32,
    "tipo": "tabla"
   }
  },
  {
   "id": "general-v-a-c--varianza",
   "unidad": "4",
   "seccion": "General (v.a.c.)",
   "subseccion": "",
   "nombre": "Varianza",
   "tex": "\\operatorname{Var}(X)=E[X^2]-(E[X])^2=\\int (x-\\mu)^2 f_X",
   "cuando": "Varianza continua por la fórmula de cálculo.",
   "condiciones": [
    "X continua"
   ],
   "slug": "varianza",
   "ancla": "",
   "tags": [
    "vac",
    "varianza"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-va-continuas.md",
    "linea": 33,
    "tipo": "tabla"
   }
  },
  {
   "id": "general-v-a-c--v-a-c",
   "unidad": "4",
   "seccion": "General (v.a.c.)",
   "subseccion": "",
   "nombre": "v.a.c.",
   "tex": "X\\text{ v.a.c. }\\iff F_X\\text{ continua }\\iff P(X=\\alpha)=0\\ \\forall\\alpha",
   "cuando": "Criterio para decidir si una variable es continua: FDA continua, sin masa puntual.",
   "condiciones": [],
   "slug": "formulario-va-continuas",
   "ancla": "general-vac",
   "tags": [
    "vac",
    "definicion"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-va-continuas.md",
    "linea": 34,
    "tipo": "tabla"
   }
  },
  {
   "id": "tabla-de-distribuciones-continuas--uniforme",
   "unidad": "4",
   "seccion": "5 · Distribuciones continuas (tabla)",
   "subseccion": "FDA específicas",
   "nombre": "Uniforme",
   "tex": "F_X(x)=\\dfrac{x-a}{b-a}\\text{ en }(a,b)\\text{.}",
   "cuando": "FDA de la uniforme: crece linealmente dentro del intervalo.",
   "condiciones": [
    "a < x < b"
   ],
   "slug": "distribucion-uniforme-continua",
   "ancla": "",
   "tags": [
    "distribucion",
    "uniforme",
    "fda"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-va-continuas.md",
    "linea": 45,
    "tipo": "vineta"
   }
  },
  {
   "id": "tabla-de-distribuciones-continuas--exponencial",
   "unidad": "4",
   "seccion": "5 · Distribuciones continuas (tabla)",
   "subseccion": "FDA específicas",
   "nombre": "Exponencial",
   "tex": "F_X(x)=1-e^{-\\lambda x}\\text{ (}x\\ge0\\text{); }P(X>x)=e^{-\\lambda x}\\text{.}",
   "cuando": "FDA y cola de la exponencial: la forma más práctica de calcular P(X > x) en ejercicios de duraciones.",
   "condiciones": [
    "x ≥ 0"
   ],
   "slug": "distribucion-exponencial",
   "ancla": "",
   "tags": [
    "distribucion",
    "exponencial",
    "fda"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-va-continuas.md",
    "linea": 46,
    "tipo": "vineta"
   }
  },
  {
   "id": "tabla-de-distribuciones-continuas--normal",
   "unidad": "4",
   "seccion": "5 · Distribuciones continuas (tabla)",
   "subseccion": "FDA específicas",
   "nombre": "Normal",
   "tex": "F_X(x)=\\Phi\\!\\left(\\dfrac{x-\\mu}{\\sigma}\\right)",
   "cuando": "FDA de la normal: no tiene forma cerrada, se evalúa estandarizando y leyendo la tabla.",
   "condiciones": [
    "X normal"
   ],
   "slug": "distribucion-normal",
   "ancla": "",
   "tags": [
    "distribucion",
    "normal",
    "fda"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-va-continuas.md",
    "linea": 47,
    "tipo": "vineta"
   }
  },
  {
   "id": "falta-de-memoria-exponencial--falta-de-memoria-exponencial",
   "unidad": "4",
   "seccion": "Falta de memoria (exponencial)",
   "subseccion": "",
   "nombre": "Falta de memoria (exponencial)",
   "tex": "P(X>x+\\Delta\\mid X>x)=P(X>\\Delta)=e^{-\\lambda\\Delta}.",
   "cuando": "Enunciado que aclara que el componente ya funcionó cierto tiempo: en la exponencial eso no cambia nada.",
   "condiciones": [
    "X exponencial"
   ],
   "slug": "formulario-va-continuas",
   "ancla": "falta-de-memoria-exponencial",
   "tags": [
    "exponencial",
    "sin-memoria"
   ],
   "esencial": true,
   "origen": {
    "archivo": "wiki/formularios/formulario-va-continuas.md",
    "linea": 51,
    "tipo": "bloque"
   }
  },
  {
   "id": "normal-estandar-y-estandarizacion--normal-estandar-y-estandarizacion",
   "unidad": "4",
   "seccion": "6 · Normal estándar y estandarización",
   "subseccion": "",
   "nombre": "Normal estándar y estandarización",
   "tex": "Z=\\frac{X-\\mu}{\\sigma}\\sim N(0,1),\\quad \\Phi(z)=P(Z\\le z),\\quad \\Phi(-z)=1-\\Phi(z),\\quad z_{1-\\alpha}=-z_\\alpha.",
   "cuando": "Resumen de la estandarización y de las dos identidades de simetría que permiten usar la tabla.",
   "condiciones": [
    "X normal"
   ],
   "slug": "estandarizacion-y-tabla-normal",
   "ancla": "normal-estándar",
   "tags": [
    "normal",
    "estandarizacion",
    "tabla"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-va-continuas.md",
    "linea": 56,
    "tipo": "bloque"
   }
  },
  {
   "id": "normal-estandar-y-estandarizacion--regla-empirica",
   "unidad": "4",
   "seccion": "6 · Normal estándar y estandarización",
   "subseccion": "",
   "nombre": "Regla empírica",
   "tex": "1\\sigma\\approx0.6827\\text{, }2\\sigma\\approx0.9545\\text{, }3\\sigma\\approx0.9973\\text{. Fractiles: }z_{0.90}\\approx1.2816\\text{, }z_{0.95}\\approx1.6449\\text{, }z_{0.975}\\approx1.96\\text{, }z_{0.99}\\approx2.3263",
   "cuando": "Verificación rápida: qué proporción de los datos cae a uno, dos y tres desvíos, y los fractiles normales más usados.",
   "condiciones": [
    "X normal"
   ],
   "slug": "estandarizacion-y-tabla-normal",
   "ancla": "normal-estándar",
   "tags": [
    "normal",
    "fractiles"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-va-continuas.md",
    "linea": 57,
    "tipo": "parrafo"
   }
  },
  {
   "id": "normal-estandar-y-estandarizacion--desvio-absoluto-medio-semi-normal",
   "unidad": "4",
   "seccion": "6 · Normal estándar y estandarización",
   "subseccion": "",
   "nombre": "Desvío absoluto medio (semi-normal)",
   "tex": "E[|Z|]=\\sqrt{2/\\pi}\\approx0.798\\text{.}",
   "cuando": "Piden el desvío absoluto medio de una normal (distribución semi-normal).",
   "condiciones": [
    "Z ~ N(0,1)"
   ],
   "slug": "estandarizacion-y-tabla-normal",
   "ancla": "normal-estándar",
   "tags": [
    "normal",
    "momentos"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-va-continuas.md",
    "linea": 61,
    "tipo": "vineta"
   }
  },
  {
   "id": "normal-estandar-y-estandarizacion--cuartiles",
   "unidad": "4",
   "seccion": "6 · Normal estándar y estandarización",
   "subseccion": "",
   "nombre": "Cuartiles",
   "tex": "Q_1=-0.6745\\text{, }Q_3=0.6745\\text{, rango intercuartílico }I_Q=1.349\\text{.}",
   "cuando": "Cuartiles y rango intercuartílico de la normal estándar.",
   "condiciones": [
    "Z ~ N(0,1)"
   ],
   "slug": "estandarizacion-y-tabla-normal",
   "ancla": "normal-estándar",
   "tags": [
    "normal",
    "cuartiles"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-va-continuas.md",
    "linea": 62,
    "tipo": "vineta"
   }
  },
  {
   "id": "normal-estandar-y-estandarizacion--outliers-de-tukey",
   "unidad": "4",
   "seccion": "6 · Normal estándar y estandarización",
   "subseccion": "",
   "nombre": "Outliers de Tukey ($|Z|>2.698$)",
   "tex": "P\\approx0.007",
   "cuando": "Probabilidad de que una observación normal caiga fuera de las cercas de Tukey.",
   "condiciones": [
    "Z ~ N(0,1)"
   ],
   "slug": "estandarizacion-y-tabla-normal",
   "ancla": "normal-estándar",
   "tags": [
    "normal",
    "boxplot",
    "outliers"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-va-continuas.md",
    "linea": 63,
    "tipo": "vineta"
   }
  },
  {
   "id": "asimetria-y-curtosis-referencia--normal-curtosis",
   "unidad": "4",
   "seccion": "Asimetría y curtosis (referencia)",
   "subseccion": "",
   "nombre": "Normal",
   "tex": "0",
   "variante": "Curtosis $\\kappa$",
   "cuando": "Referencia de curtosis: la normal es la mesocúrtica de comparación.",
   "condiciones": [],
   "slug": "distribucion-normal",
   "ancla": "",
   "tags": [
    "forma",
    "normal"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-va-continuas.md",
    "linea": 69,
    "tipo": "tabla"
   }
  },
  {
   "id": "asimetria-y-curtosis-referencia--uniforme-curtosis",
   "unidad": "4",
   "seccion": "Asimetría y curtosis (referencia)",
   "subseccion": "",
   "nombre": "Uniforme",
   "tex": "-6/5",
   "variante": "Curtosis $\\kappa$",
   "cuando": "Referencia de curtosis: la uniforme es platicúrtica (colas livianas).",
   "condiciones": [],
   "slug": "distribucion-uniforme-continua",
   "ancla": "",
   "tags": [
    "forma",
    "uniforme"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-va-continuas.md",
    "linea": 70,
    "tipo": "tabla"
   }
  },
  {
   "id": "asimetria-y-curtosis-referencia--exponencial-curtosis",
   "unidad": "4",
   "seccion": "Asimetría y curtosis (referencia)",
   "subseccion": "",
   "nombre": "Exponencial",
   "tex": "+6",
   "variante": "Curtosis $\\kappa$",
   "cuando": "Referencia de curtosis: la exponencial es leptocúrtica (cola pesada a derecha).",
   "condiciones": [],
   "slug": "distribucion-exponencial",
   "ancla": "",
   "tags": [
    "forma",
    "exponencial"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-va-continuas.md",
    "linea": 71,
    "tipo": "tabla"
   }
  },
  {
   "id": "esperanza-y-varianza-de--esperanza-y-varianza-de-una-suma",
   "unidad": "7",
   "seccion": "Esperanza y varianza de una suma",
   "subseccion": "",
   "nombre": "Esperanza y varianza de una suma",
   "tex": "E[X+Y]=E[X]+E[Y]",
   "variante": "varianza",
   "cuando": "La esperanza de una suma siempre se reparte, sin hipótesis sobre las variables.",
   "condiciones": [],
   "slug": "formulario-suma-de-va",
   "ancla": "esperanza-y-varianza-de-una-suma",
   "tags": [
    "suma",
    "esperanza"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-suma-de-va.md",
    "linea": 17,
    "tipo": "vineta"
   }
  },
  {
   "id": "esperanza-y-varianza-de--esperanza-y-varianza-de-una-suma-2",
   "unidad": "7",
   "seccion": "Esperanza y varianza de una suma",
   "subseccion": "",
   "nombre": "Esperanza y varianza de una suma",
   "tex": "V(X+Y)=V(X)+2\\,\\mathrm{Cov}(X,Y)+V(Y)",
   "variante": "esperanza",
   "cuando": "Varianza de una suma en el caso general, con el término de covarianza.",
   "condiciones": [
    "no independientes"
   ],
   "slug": "formulario-suma-de-va",
   "ancla": "esperanza-y-varianza-de-una-suma",
   "tags": [
    "suma",
    "varianza"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-suma-de-va.md",
    "linea": 18,
    "tipo": "vineta"
   }
  },
  {
   "id": "esperanza-y-varianza-de--indep-no-correlacionadas",
   "unidad": "7",
   "seccion": "Esperanza y varianza de una suma",
   "subseccion": "",
   "nombre": "Indep. / no correlacionadas",
   "tex": "V(X\\pm Y)=V(X)+V(Y)\\text{.}",
   "cuando": "Con covarianza nula las varianzas se suman, también en la resta.",
   "condiciones": [
    "independientes"
   ],
   "slug": "formulario-suma-de-va",
   "ancla": "esperanza-y-varianza-de-una-suma",
   "tags": [
    "suma",
    "varianza"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-suma-de-va.md",
    "linea": 19,
    "tipo": "vineta"
   }
  },
  {
   "id": "esperanza-y-varianza-de--i-i-d",
   "unidad": "7",
   "seccion": "Esperanza y varianza de una suma",
   "subseccion": "",
   "nombre": "$n$ i.i.d.",
   "tex": "E[S_n]=n\\mu\\text{, }V(S_n)=n\\sigma^2\\text{; }\\;E[\\bar X_n]=\\mu\\text{, }V(\\bar X_n)=\\dfrac{\\sigma^2}{n}\\text{.}",
   "cuando": "Media y varianza del total y del promedio de n observaciones i.i.d., todo en una línea.",
   "condiciones": [
    "i.i.d."
   ],
   "slug": "formulario-suma-de-va",
   "ancla": "esperanza-y-varianza-de-una-suma",
   "tags": [
    "suma",
    "promedio-muestral"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-suma-de-va.md",
    "linea": 20,
    "tipo": "vineta"
   }
  },
  {
   "id": "convolucion-suma-de-independientes--discreta",
   "unidad": "7",
   "seccion": "Convolución (suma de independientes)",
   "subseccion": "",
   "nombre": "Discreta",
   "tex": "p_S(s)=\\sum_{y\\in R_Y}p_X(s-y)p_Y(y)\\text{.}",
   "cuando": "Suma de dos discretas independientes sin resultado con nombre: convolución sumando sobre el recorrido.",
   "condiciones": [
    "independientes"
   ],
   "slug": "formulario-suma-de-va",
   "ancla": "convolución-suma-de-independientes",
   "tags": [
    "suma",
    "convolucion"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-suma-de-va.md",
    "linea": 23,
    "tipo": "vineta"
   }
  },
  {
   "id": "convolucion-suma-de-independientes--continua",
   "unidad": "7",
   "seccion": "Convolución (suma de independientes)",
   "subseccion": "",
   "nombre": "Continua",
   "tex": "f_S(s)=\\int_{-\\infty}^{+\\infty}f_X(s-y)f_Y(y)\\,dy\\text{.}",
   "cuando": "Suma de dos continuas independientes: convolución por integral.",
   "condiciones": [
    "independientes"
   ],
   "slug": "formulario-suma-de-va",
   "ancla": "convolución-suma-de-independientes",
   "tags": [
    "suma",
    "convolucion"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-suma-de-va.md",
    "linea": 24,
    "tipo": "vineta"
   }
  },
  {
   "id": "sumas-con-nombre-propio--nbernoullip",
   "unidad": "7",
   "seccion": "Sumas con nombre propio (independientes)",
   "subseccion": "",
   "nombre": "$n\\times\\mathrm{Bernoulli}(p)$",
   "tex": "\\mathrm{Bin}(n,p)",
   "cuando": "Suma de n ensayos Bernoulli con la misma p: da binomial.",
   "condiciones": [
    "independientes",
    "misma p"
   ],
   "slug": "suma-de-va-independientes",
   "ancla": "",
   "tags": [
    "suma",
    "binomial"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-suma-de-va.md",
    "linea": 29,
    "tipo": "tabla"
   }
  },
  {
   "id": "sumas-con-nombre-propio--binn1pbinn2p",
   "unidad": "7",
   "seccion": "Sumas con nombre propio (independientes)",
   "subseccion": "",
   "nombre": "$\\mathrm{Bin}(n_1,p)+\\mathrm{Bin}(n_2,p)$",
   "tex": "\\mathrm{Bin}(n_1+n_2,p)",
   "cuando": "Suma de binomiales con la misma probabilidad de éxito: se suman los tamaños.",
   "condiciones": [
    "independientes",
    "misma p"
   ],
   "slug": "suma-de-va-independientes",
   "ancla": "",
   "tags": [
    "suma",
    "binomial"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-suma-de-va.md",
    "linea": 30,
    "tipo": "tabla"
   }
  },
  {
   "id": "sumas-con-nombre-propio--n11n22",
   "unidad": "7",
   "seccion": "Sumas con nombre propio (independientes)",
   "subseccion": "",
   "nombre": "$\\mathcal N(\\mu_1,\\sigma_1)+\\mathcal N(\\mu_2,\\sigma_2)$",
   "tex": "\\mathcal N(\\mu_1+\\mu_2,\\sqrt{\\sigma_1^2+\\sigma_2^2})",
   "cuando": "Suma de normales independientes: suman medias y varianzas (los desvíos no se suman).",
   "condiciones": [
    "independientes"
   ],
   "slug": "suma-de-va-independientes",
   "ancla": "",
   "tags": [
    "suma",
    "reproductividad",
    "normal"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-suma-de-va.md",
    "linea": 32,
    "tipo": "tabla"
   }
  },
  {
   "id": "sumas-con-nombre-propio--unif01unif01",
   "unidad": "7",
   "seccion": "Sumas con nombre propio (independientes)",
   "subseccion": "",
   "nombre": "$\\mathrm{Unif}(0,1)+\\mathrm{Unif}(0,1)$",
   "tex": "\\text{triangular en }(0,2)",
   "cuando": "La suma de dos uniformes da una triangular, no una uniforme.",
   "condiciones": [
    "independientes"
   ],
   "slug": "suma-de-va-independientes",
   "ancla": "",
   "tags": [
    "suma",
    "errores"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-suma-de-va.md",
    "linea": 33,
    "tipo": "tabla"
   }
  },
  {
   "id": "sumas-con-nombre-propio--nexp",
   "unidad": "7",
   "seccion": "Sumas con nombre propio (independientes)",
   "subseccion": "",
   "nombre": "$n\\times\\mathrm{Exp}(\\lambda)$",
   "tex": "\\mathrm{Gamma}(n,\\lambda)=\\mathrm{Erlang}_n(\\lambda)",
   "cuando": "Suma de n exponenciales de igual tasa: Gamma con parámetro entero, es decir Erlang.",
   "condiciones": [
    "independientes",
    "misma tasa"
   ],
   "slug": "suma-de-va-independientes",
   "ancla": "",
   "tags": [
    "suma",
    "gamma",
    "erlang"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-suma-de-va.md",
    "linea": 34,
    "tipo": "tabla"
   }
  },
  {
   "id": "sumas-con-nombre-propio--misma",
   "unidad": "7",
   "seccion": "Sumas con nombre propio (independientes)",
   "subseccion": "",
   "nombre": "$\\mathrm{BinNeg}(n,p)+\\mathrm{BinNeg}(m,p)$ (misma $p$)",
   "tex": "\\mathrm{BinNeg}(n+m,p)",
   "cuando": "Suma de binomiales negativas con la misma p: sigue siendo binomial negativa, siempre que se use la misma versión (fracasos).",
   "condiciones": [
    "misma p",
    "misma versión"
   ],
   "slug": "suma-de-va-independientes",
   "ancla": "",
   "tags": [
    "suma",
    "reproductividad"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-suma-de-va.md",
    "linea": 36,
    "tipo": "tabla"
   }
  },
  {
   "id": "sumas-con-nombre-propio--gamma-erlang",
   "unidad": "7",
   "seccion": "Sumas con nombre propio (independientes)",
   "subseccion": "",
   "nombre": "Gamma / Erlang",
   "tex": "\\;f_{\\Gamma(n,\\lambda)}(x)=\\dfrac{\\lambda^n x^{n-1}e^{-\\lambda x}}{(n-1)!}\\text{, }\\;E=\\dfrac n\\lambda\\text{, }\\;V=\\dfrac n{\\lambda^2}\\text{. Para }P(T_n>t)\\text{ usar }\\{T_n>t\\}\\Leftrightarrow\\{N(t)\\le n-1\\}\\text{ con }N(t)\\sim\\mathrm{Poisson}(\\lambda t)",
   "cuando": "Densidad, esperanza y varianza de la Erlang, y el truco de pasar P(T_n > t) a un conteo de Poisson.",
   "condiciones": [
    "independientes",
    "misma tasa"
   ],
   "slug": "suma-de-va-independientes",
   "ancla": "6-exponenciales-gamma-erlang",
   "tags": [
    "gamma",
    "erlang",
    "proceso-poisson"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-suma-de-va.md",
    "linea": 43,
    "tipo": "parrafo"
   }
  },
  {
   "id": "cotas--markov",
   "unidad": "7",
   "seccion": "Cotas",
   "subseccion": "",
   "nombre": "Markov ($X\\ge0$)",
   "tex": "\\;P(X\\ge\\alpha)\\le\\dfrac{E[X]}{\\alpha}\\text{.}",
   "cuando": "Cota con la sola media de una variable no negativa.",
   "condiciones": [
    "X ≥ 0"
   ],
   "slug": "desigualdad-de-chebyshev",
   "ancla": "",
   "tags": [
    "cotas",
    "markov"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-suma-de-va.md",
    "linea": 49,
    "tipo": "vineta"
   }
  },
  {
   "id": "cotas--chebyshev",
   "unidad": "7",
   "seccion": "Cotas",
   "subseccion": "",
   "nombre": "Chebyshev",
   "tex": "\\;P(|X-\\mu|\\ge\\varepsilon)\\le\\dfrac{\\sigma^2}{\\varepsilon^2}\\text{.}",
   "cuando": "Cota de alejamiento de la media conociendo solo media y varianza, sin saber la distribución.",
   "condiciones": [
    "varianza finita"
   ],
   "slug": "desigualdad-de-chebyshev",
   "ancla": "",
   "tags": [
    "cotas",
    "chebyshev"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-suma-de-va.md",
    "linea": 50,
    "tipo": "vineta"
   }
  },
  {
   "id": "cotas--promedio",
   "unidad": "7",
   "seccion": "Cotas",
   "subseccion": "",
   "nombre": "Promedio",
   "tex": "\\;P(|\\bar X_n-\\mu|\\ge\\varepsilon)\\le\\dfrac{\\sigma^2}{n\\varepsilon^2}\\text{.}",
   "cuando": "Chebyshev aplicado al promedio muestral: la cota se achica con n.",
   "condiciones": [
    "i.i.d."
   ],
   "slug": "desigualdad-de-chebyshev",
   "ancla": "",
   "tags": [
    "cotas",
    "chebyshev"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-suma-de-va.md",
    "linea": 51,
    "tipo": "vineta"
   }
  },
  {
   "id": "convergencias--lgn-debil",
   "unidad": "7",
   "seccion": "Convergencias",
   "subseccion": "",
   "nombre": "LGN débil",
   "tex": "\\lim_n P(|\\bar X_n-\\mu|\\ge\\varepsilon)=0\\text{.}",
   "cuando": "Ley débil: la probabilidad de que el promedio se aleje de la media tiende a cero.",
   "condiciones": [
    "i.i.d."
   ],
   "slug": "ley-de-grandes-numeros",
   "ancla": "",
   "tags": [
    "lgn"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-suma-de-va.md",
    "linea": 54,
    "tipo": "vineta"
   }
  },
  {
   "id": "convergencias--lgn-fuerte",
   "unidad": "7",
   "seccion": "Convergencias",
   "subseccion": "",
   "nombre": "LGN fuerte",
   "tex": "P(\\lim_n\\bar X_n=\\mu)=1\\text{.}",
   "cuando": "Ley fuerte: el promedio converge a la media con probabilidad 1.",
   "condiciones": [
    "i.i.d."
   ],
   "slug": "ley-de-grandes-numeros",
   "ancla": "",
   "tags": [
    "lgn"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-suma-de-va.md",
    "linea": 55,
    "tipo": "vineta"
   }
  },
  {
   "id": "tcl--tcl",
   "unidad": "7",
   "seccion": "TCL",
   "subseccion": "",
   "nombre": "TCL",
   "tex": "P(Z_n\\le z)\\approx\\Phi(z)\\text{.}",
   "variante": "forma de trabajo",
   "cuando": "Enunciado operativo del TCL para el promedio estandarizado.",
   "condiciones": [
    "i.i.d.",
    "n grande"
   ],
   "slug": "teorema-central-del-limite",
   "ancla": "",
   "tags": [
    "tcl"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-suma-de-va.md",
    "linea": 59,
    "tipo": "vineta"
   }
  },
  {
   "id": "tcl--tcl-2",
   "unidad": "7",
   "seccion": "TCL",
   "subseccion": "",
   "nombre": "TCL",
   "tex": "\\bar X_n\\overset{\\text{aprox}}{\\sim}\\mathcal N(\\mu,\\sigma/\\sqrt n)",
   "variante": "enunciado",
   "cuando": "Aproximaciones normales del promedio y del total que se usan en los ejercicios.",
   "condiciones": [
    "i.i.d.",
    "n grande"
   ],
   "slug": "teorema-central-del-limite",
   "ancla": "",
   "tags": [
    "tcl",
    "aproximacion"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-suma-de-va.md",
    "linea": 60,
    "tipo": "vineta"
   }
  },
  {
   "id": "tcl--frecuencia-relativa",
   "unidad": "7",
   "seccion": "TCL",
   "subseccion": "",
   "nombre": "Frecuencia relativa",
   "tex": "P(\\hat P_n\\le q)\\approx\\Phi\\!\\big(\\tfrac{q-p}{\\sqrt{p(1-p)/n}}\\big)\\text{.}",
   "cuando": "Se cuenta la proporción de veces que ocurre un evento en n repeticiones y se pide una probabilidad: TCL sobre la frecuencia relativa.",
   "condiciones": [
    "n grande"
   ],
   "slug": "teorema-central-del-limite",
   "ancla": "",
   "tags": [
    "tcl",
    "proporcion"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-suma-de-va.md",
    "linea": 62,
    "tipo": "vineta"
   }
  },
  {
   "id": "aproximacion-normal-de-la--aproximacion-normal-de-la-binomial",
   "unidad": "7",
   "seccion": "Aproximación normal de la binomial",
   "subseccion": "",
   "nombre": "Aproximación normal de la binomial",
   "tex": "P(a\\le S_n\\le b)\\approx\\Phi\\!\\big(\\tfrac{b+\\frac12-np}{\\sqrt{npq}}\\big)-\\Phi\\!\\big(\\tfrac{a-\\frac12-np}{\\sqrt{npq}}\\big).",
   "cuando": "Probabilidad de un rango de éxitos en una binomial con n grande, ya con la corrección por continuidad aplicada.",
   "condiciones": [
    "np ≥ 5",
    "nq ≥ 5"
   ],
   "slug": "aproximacion-normal-de-la-binomial",
   "ancla": "",
   "tags": [
    "tcl",
    "binomial",
    "aproximacion"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-suma-de-va.md",
    "linea": 66,
    "tipo": "bloque"
   }
  },
  {
   "id": "fractiles-usuales-de-la--fractiles-usuales-de-la-tabla-del",
   "unidad": "7",
   "seccion": "Fractiles usuales (de la tabla del tp7-suma-de-va)",
   "subseccion": "",
   "nombre": "Fractiles usuales (de la tabla del tp7-suma-de-va)",
   "tex": "z_{0.975}=1.96\\text{, }\\;z_{0.99}=2.3263\\text{, }\\;z_{0.95}=1.6449\\text{, }\\;z_{0.985}\\approx2.17\\text{.}",
   "cuando": "Fractiles de la normal que aparecen una y otra vez en los ejercicios de la unidad 7.",
   "condiciones": [],
   "slug": "formulario-suma-de-va",
   "ancla": "",
   "tags": [
    "normal",
    "fractiles",
    "tabla"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-suma-de-va.md",
    "linea": 69,
    "tipo": "vineta"
   }
  },
  {
   "id": "estimacion-puntual--error-cuadratico-medio",
   "unidad": "8",
   "seccion": "Estimación puntual",
   "subseccion": "",
   "nombre": "Error cuadrático medio",
   "tex": "\\mathrm{mse}(\\hat\\theta)=E[(\\hat\\theta-\\theta)^2]",
   "cuando": "Definición del error cuadrático medio de un estimador.",
   "condiciones": [],
   "slug": "estimacion-puntual",
   "ancla": "",
   "tags": [
    "estimacion",
    "ecm"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-inferencia.md",
    "linea": 22,
    "tipo": "tabla"
   }
  },
  {
   "id": "estimacion-puntual--descomposicion",
   "unidad": "8",
   "seccion": "Estimación puntual",
   "subseccion": "",
   "nombre": "Descomposición",
   "tex": "\\mathrm{mse}(\\hat\\theta)=V(\\hat\\theta)+\\mathrm{sesgo}^2(\\hat\\theta)",
   "cuando": "Descomposición del ECM en varianza más sesgo al cuadrado: es la que se usa para comparar estimadores.",
   "condiciones": [],
   "slug": "estimacion-puntual",
   "ancla": "",
   "tags": [
    "estimacion",
    "ecm"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-inferencia.md",
    "linea": 23,
    "tipo": "tabla"
   }
  },
  {
   "id": "estimacion-puntual--proporcion-estimador",
   "unidad": "8",
   "seccion": "Estimación puntual",
   "subseccion": "",
   "nombre": "Proporción $p$",
   "tex": "\\hat p=\\frac1n\\sum X_i",
   "variante": "Estimador",
   "cuando": "Estimador de la proporción como promedio de indicadores.",
   "condiciones": [
    "ensayos Bernoulli"
   ],
   "slug": "estimacion-puntual",
   "ancla": "",
   "tags": [
    "estimacion",
    "proporcion"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-inferencia.md",
    "linea": 33,
    "tipo": "tabla"
   }
  },
  {
   "id": "estimacion-puntual--varianza-ecm",
   "unidad": "8",
   "seccion": "Estimación puntual",
   "subseccion": "",
   "nombre": "Varianza $\\sigma^2$",
   "tex": "\\frac{\\sigma^4}{n}\\!\\left(\\kappa+2+\\frac{2}{n-1}\\right)",
   "variante": "ECM",
   "cuando": "ECM del estimador de la varianza, que depende de la curtosis de la población.",
   "condiciones": [
    "población con curtosis κ"
   ],
   "slug": "varianza-muestral",
   "ancla": "",
   "tags": [
    "estimacion",
    "varianza",
    "ecm"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-inferencia.md",
    "linea": 34,
    "tipo": "tabla"
   }
  },
  {
   "id": "estimacion-puntual--identidad",
   "unidad": "8",
   "seccion": "Estimación puntual",
   "subseccion": "",
   "nombre": "Identidad",
   "tex": "(n-1)S_n^2=\\sum X_i^2 - n\\overline X_n^2\\text{. Si normal: }(n-1)S_n^2/\\sigma^2\\sim\\chi^2_{n-1}",
   "cuando": "Calcular la varianza muestral con la suma de cuadrados y reconocer el pivote ji-cuadrado.",
   "condiciones": [
    "X normal"
   ],
   "slug": "estimacion-puntual",
   "ancla": "",
   "tags": [
    "estimacion",
    "varianza-muestral"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-inferencia.md",
    "linea": 36,
    "tipo": "parrafo"
   }
  },
  {
   "id": "estimacion-puntual--maxima-verosimilitud",
   "unidad": "8",
   "seccion": "Estimación puntual",
   "subseccion": "",
   "nombre": "Máxima verosimilitud",
   "tex": "\\hat\\theta=\\arg\\max_\\theta \\prod_i f(x_i;\\theta)",
   "cuando": "Se maximiza la verosimilitud (o su logaritmo) para estimar el parámetro.",
   "condiciones": [
    "muestra i.i.d."
   ],
   "slug": "estimacion-puntual",
   "ancla": "",
   "tags": [
    "estimacion",
    "maxima-verosimilitud"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-inferencia.md",
    "linea": 41,
    "tipo": "vineta"
   }
  },
  {
   "id": "estimacion-puntual--map-bayesiano",
   "unidad": "8",
   "seccion": "Estimación puntual",
   "subseccion": "",
   "nombre": "MAP (bayesiano)",
   "tex": "\\hat\\theta=\\arg\\max_\\theta g(\\theta\\mid x)\\text{ con}",
   "cuando": "Estimación con información a priori: se maximiza la densidad a posteriori.",
   "condiciones": [
    "a priori conocida"
   ],
   "slug": "estimacion-puntual",
   "ancla": "",
   "tags": [
    "estimacion",
    "bayesiano"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-inferencia.md",
    "linea": 43,
    "tipo": "vineta"
   }
  },
  {
   "id": "estimacion-puntual--momentos",
   "unidad": "8",
   "seccion": "Estimación puntual",
   "subseccion": "",
   "nombre": "Momentos",
   "tex": "\\mu_k=E[X^k]=H(\\theta)\\ \\Longrightarrow\\ \\hat\\theta=H^{-1}(\\hat\\mu_k)",
   "cuando": "Método de los momentos: igualar el momento teórico al muestral y despejar.",
   "condiciones": [],
   "slug": "estimacion-puntual",
   "ancla": "",
   "tags": [
    "estimacion",
    "momentos"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-inferencia.md",
    "linea": 45,
    "tipo": "vineta"
   }
  },
  {
   "id": "intervalos-de-confianza-para--semiamplitud-bilateral",
   "unidad": "8",
   "seccion": "Intervalos de confianza para la media",
   "subseccion": "",
   "nombre": "Semiamplitud bilateral",
   "tex": "\\Delta_B\\text{ (el IC es }\\overline X_n\\pm\\Delta_B\\text{); unilateral }\\Delta_U\\text{ usa }\\gamma\\text{ en vez de }\\frac{1+\\gamma}{2}",
   "cuando": "Recordar que el IC se escribe como media muestral más o menos la semiamplitud, y que el unilateral usa el fractil de γ.",
   "condiciones": [
    "confianza γ"
   ],
   "slug": "distribucion-t-de-student",
   "ancla": "",
   "tags": [
    "intervalo-confianza",
    "media",
    "ic"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-inferencia.md",
    "linea": 49,
    "tipo": "parrafo"
   }
  },
  {
   "id": "intervalos-de-confianza-para--intervalos-de-confianza-para-la-media-caso-1-condicion",
   "unidad": "8",
   "seccion": "Intervalos de confianza para la media",
   "subseccion": "",
   "nombre": "Intervalos de confianza para la media",
   "tex": "\\text{Normal, }\\sigma\\text{ conocido (o }n\\text{ grande, no normal)}",
   "variante": "Caso 1 · Condición",
   "cuando": "Caso 1 del árbol de decisión: cuándo corresponde el intervalo con Z.",
   "condiciones": [
    "σ conocido"
   ],
   "slug": "distribucion-t-de-student",
   "ancla": "",
   "tags": [
    "intervalo-confianza",
    "media",
    "ic"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-inferencia.md",
    "linea": 54,
    "tipo": "tabla"
   }
  },
  {
   "id": "intervalos-de-confianza-para--intervalos-de-confianza-para-la-media-caso-1",
   "unidad": "8",
   "seccion": "Intervalos de confianza para la media",
   "subseccion": "",
   "nombre": "Intervalos de confianza para la media",
   "tex": "z_{\\frac{1+\\gamma}{2}}\\dfrac{\\sigma}{\\sqrt n}",
   "variante": "Caso 1 · $\\Delta_B$",
   "cuando": "Semiamplitud del caso 1: fractil normal con el desvío poblacional conocido.",
   "condiciones": [
    "σ conocido",
    "normal o n grande"
   ],
   "slug": "distribucion-t-de-student",
   "ancla": "",
   "tags": [
    "intervalo-confianza",
    "media",
    "ic"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-inferencia.md",
    "linea": 54,
    "tipo": "tabla"
   }
  },
  {
   "id": "intervalos-de-confianza-para--intervalos-de-confianza-para-la-media-caso-3-condicion",
   "unidad": "8",
   "seccion": "Intervalos de confianza para la media",
   "subseccion": "",
   "nombre": "Intervalos de confianza para la media",
   "tex": "\\text{Normal, }\\sigma\\text{ desconocido}",
   "variante": "Caso 3 · Condición",
   "cuando": "Caso 3: población normal con desvío desconocido, corresponde t.",
   "condiciones": [
    "σ desconocido",
    "población normal"
   ],
   "slug": "distribucion-t-de-student",
   "ancla": "",
   "tags": [
    "intervalo-confianza",
    "media",
    "ic"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-inferencia.md",
    "linea": 55,
    "tipo": "tabla"
   }
  },
  {
   "id": "intervalos-de-confianza-para--intervalos-de-confianza-para-la-media-caso-3",
   "unidad": "8",
   "seccion": "Intervalos de confianza para la media",
   "subseccion": "",
   "nombre": "Intervalos de confianza para la media",
   "tex": "t_{n-1,\\frac{1+\\gamma}{2}}\\dfrac{S_n}{\\sqrt n}",
   "variante": "Caso 3 · $\\Delta_B$",
   "cuando": "Semiamplitud del caso 3: fractil t con n-1 grados de libertad y el desvío muestral.",
   "condiciones": [
    "σ desconocido",
    "X normal"
   ],
   "slug": "distribucion-t-de-student",
   "ancla": "",
   "tags": [
    "intervalo-confianza",
    "media",
    "t-student",
    "ic"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-inferencia.md",
    "linea": 55,
    "tipo": "tabla"
   }
  },
  {
   "id": "intervalos-de-confianza-para--intervalos-de-confianza-para-la-media-caso-3-condicion-2",
   "unidad": "8",
   "seccion": "Intervalos de confianza para la media",
   "subseccion": "",
   "nombre": "Intervalos de confianza para la media",
   "tex": "\\sigma\\text{ desconocido, }n\\text{ muy grande}",
   "variante": "Caso 3' · Condición",
   "cuando": "Caso 3': con muestras muy grandes se puede volver a Z aunque el desvío sea desconocido.",
   "condiciones": [
    "σ desconocido",
    "n muy grande"
   ],
   "slug": "distribucion-t-de-student",
   "ancla": "",
   "tags": [
    "intervalo-confianza",
    "media",
    "ic"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-inferencia.md",
    "linea": 56,
    "tipo": "tabla"
   }
  },
  {
   "id": "intervalos-de-confianza-para--intervalos-de-confianza-para-la-media-caso-3-2",
   "unidad": "8",
   "seccion": "Intervalos de confianza para la media",
   "subseccion": "",
   "nombre": "Intervalos de confianza para la media",
   "tex": "z_{\\frac{1+\\gamma}{2}}\\dfrac{S_n}{\\sqrt n}",
   "variante": "Caso 3' · $\\Delta_B$",
   "cuando": "Semiamplitud del caso 3': fractil normal con el desvío muestral.",
   "condiciones": [
    "σ desconocido",
    "n > 200"
   ],
   "slug": "distribucion-t-de-student",
   "ancla": "",
   "tags": [
    "intervalo-confianza",
    "media",
    "ic"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-inferencia.md",
    "linea": 56,
    "tipo": "tabla"
   }
  },
  {
   "id": "intervalos-de-confianza-para--ic-bilateral-caso-1",
   "unidad": "8",
   "seccion": "Intervalos de confianza para la media",
   "subseccion": "",
   "nombre": "IC bilateral (caso 1)",
   "tex": "IC_\\gamma(\\mu)=\\left(\\overline X_n - z_{\\frac{1+\\gamma}{2}}\\frac{\\sigma}{\\sqrt n},\\; \\overline X_n + z_{\\frac{1+\\gamma}{2}}\\frac{\\sigma}{\\sqrt n}\\right).",
   "cuando": "Intervalo bilateral completo para la media con desvío conocido, escrito con los dos extremos.",
   "condiciones": [
    "σ conocido",
    "confianza γ"
   ],
   "slug": "distribucion-t-de-student",
   "ancla": "",
   "tags": [
    "intervalo-confianza",
    "media",
    "ic"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-inferencia.md",
    "linea": 61,
    "tipo": "bloque"
   }
  },
  {
   "id": "intervalos-de-confianza-para--unilaterales-caso-1",
   "unidad": "8",
   "seccion": "Intervalos de confianza para la media",
   "subseccion": "",
   "nombre": "Unilaterales (caso 1)",
   "tex": "\\left(\\overline X_n - z_\\gamma\\frac{\\sigma}{\\sqrt n},\\infty\\right)\\text{, }\\left(-\\infty,\\overline X_n + z_\\gamma\\frac{\\sigma}{\\sqrt n}\\right)",
   "cuando": "Piden una cota inferior o superior para la media (por ejemplo «con 95 % de confianza, al menos cuánto vale μ»): se usa el fractil de γ, no el de (1+γ)/2.",
   "condiciones": [
    "σ conocido",
    "confianza γ"
   ],
   "slug": "distribucion-t-de-student",
   "ancla": "",
   "tags": [
    "intervalo-confianza",
    "media",
    "unilateral",
    "ic"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-inferencia.md",
    "linea": 62,
    "tipo": "parrafo"
   }
  },
  {
   "id": "intervalo-de-confianza-para--intervalo-de-confianza-para-la-proporcion",
   "unidad": "8",
   "seccion": "Intervalo de confianza para la proporción",
   "subseccion": "",
   "nombre": "Intervalo de confianza para la proporción",
   "tex": "IC_\\gamma(p)=\\left(\\hat p \\pm z_{\\frac{1+\\gamma}{2}}\\sqrt{\\frac{\\hat p(1-\\hat p)}{n}}\\right),\\qquad \\text{(}n\\text{ grande)}.",
   "cuando": "Intervalo para una proporción a partir de una muestra grande.",
   "condiciones": [
    "n grande"
   ],
   "slug": "formulario-inferencia",
   "ancla": "intervalo-de-confianza-para-la-proporción",
   "tags": [
    "intervalo-confianza",
    "proporcion",
    "ic"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-inferencia.md",
    "linea": 66,
    "tipo": "bloque"
   }
  },
  {
   "id": "intervalo-de-confianza-para--unilaterales-acotados-a",
   "unidad": "8",
   "seccion": "Intervalo de confianza para la proporción",
   "subseccion": "",
   "nombre": "Unilaterales acotados a $[0,1]$",
   "tex": "\\left(\\hat p - z_\\gamma\\sqrt{\\tfrac{\\hat p(1-\\hat p)}{n}},\\,1\\right)\\text{ y }\\left(0,\\,\\hat p + z_\\gamma\\sqrt{\\tfrac{\\hat p(1-\\hat p)}{n}}\\right)",
   "cuando": "Cota inferior o superior para una proporción, recortada al intervalo [0,1].",
   "condiciones": [
    "n grande",
    "confianza γ"
   ],
   "slug": "formulario-inferencia",
   "ancla": "intervalo-de-confianza-para-la-proporción",
   "tags": [
    "intervalo-confianza",
    "proporcion",
    "unilateral",
    "ic"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-inferencia.md",
    "linea": 67,
    "tipo": "parrafo"
   }
  },
  {
   "id": "tamano-muestral-error-de--media-desconocido-muestra-piloto",
   "unidad": "8",
   "seccion": "Tamaño muestral (error de muestreo $E$ = semiamplitud)",
   "subseccion": "",
   "nombre": "Media, $\\sigma$ desconocido (muestra piloto)",
   "tex": "n\\ge z_{\\frac{1+\\gamma}{2}}^2\\,\\dfrac{s_{\\text{piloto}}^2}{E^2}",
   "cuando": "Tamaño de muestra para la media cuando el desvío se toma de una muestra piloto.",
   "condiciones": [
    "muestra piloto"
   ],
   "slug": "formulario-inferencia",
   "ancla": "",
   "tags": [
    "tamano-muestral",
    "media"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-inferencia.md",
    "linea": 76,
    "tipo": "tabla"
   }
  },
  {
   "id": "tamano-muestral-error-de--proporcion-con-estimacion-previa",
   "unidad": "8",
   "seccion": "Tamaño muestral (error de muestreo $E$ = semiamplitud)",
   "subseccion": "",
   "nombre": "Proporción (con estimación previa $\\hat p$)",
   "tex": "n\\ge z_{\\frac{1+\\gamma}{2}}^2\\,\\dfrac{\\hat p(1-\\hat p)}{E^2}",
   "cuando": "Tamaño muestral para una proporción cuando ya hay una estimación previa (muestra piloto): sale más chico que la cota conservadora de 1/4.",
   "condiciones": [
    "hay estimación previa"
   ],
   "slug": "formulario-inferencia",
   "ancla": "",
   "tags": [
    "tamano-muestral",
    "proporcion"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-inferencia.md",
    "linea": 78,
    "tipo": "tabla"
   }
  },
  {
   "id": "intervalo-de-confianza-para--intervalo-de-confianza-para-la-varianza",
   "unidad": "8",
   "seccion": "Intervalo de confianza para la varianza (normal, ji-cuadrado)",
   "subseccion": "",
   "nombre": "Intervalo de confianza para la varianza (normal, ji-cuadrado)",
   "tex": "IC_\\gamma(\\sigma^2)=\\left[\\frac{(n-1)S_n^2}{\\chi^2_{n-1,\\frac{1+\\gamma}{2}}}\\;,\\;\\frac{(n-1)S_n^2}{\\chi^2_{n-1,\\frac{1-\\gamma}{2}}}\\right],\\qquad \\text{(variables normales)}.",
   "cuando": "Piden un intervalo para la varianza o el desvío de una población normal: se usan dos cuantiles de ji-cuadrado, nunca los de t.",
   "condiciones": [
    "población normal"
   ],
   "slug": "formulario-inferencia",
   "ancla": "",
   "tags": [
    "intervalo-confianza",
    "varianza",
    "ji-cuadrado",
    "ic"
   ],
   "esencial": true,
   "origen": {
    "archivo": "wiki/formularios/formulario-inferencia.md",
    "linea": 85,
    "tipo": "bloque"
   }
  },
  {
   "id": "errores--acepta-falsa",
   "unidad": "9",
   "seccion": "Errores",
   "subseccion": "",
   "nombre": "Acepta $H_0$",
   "tex": "\\text{Error II (}\\beta\\text{)}",
   "variante": "$H_0$ falsa",
   "cuando": "Error de tipo II: aceptar la hipótesis nula siendo falsa; su probabilidad es β y define la potencia.",
   "condiciones": [],
   "slug": "formulario-pruebas-de-hipotesis",
   "ancla": "errores",
   "tags": [
    "prueba-hipotesis",
    "errores"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-pruebas-de-hipotesis.md",
    "linea": 22,
    "tipo": "tabla"
   }
  },
  {
   "id": "errores--rechaza-verdadera",
   "unidad": "9",
   "seccion": "Errores",
   "subseccion": "",
   "nombre": "Rechaza $H_0$",
   "tex": "\\text{Error I (}\\alpha\\text{)}",
   "variante": "$H_0$ verdadera",
   "cuando": "Error de tipo I: rechazar la hipótesis nula siendo verdadera; su probabilidad es el nivel de significación.",
   "condiciones": [],
   "slug": "formulario-pruebas-de-hipotesis",
   "ancla": "errores",
   "tags": [
    "prueba-hipotesis",
    "errores"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-pruebas-de-hipotesis.md",
    "linea": 23,
    "tipo": "tabla"
   }
  },
  {
   "id": "errores--potencia",
   "unidad": "9",
   "seccion": "Errores",
   "subseccion": "",
   "nombre": "Potencia",
   "tex": "\\text{Potencia}=1-\\beta\\text{. }\\;P_{H_0}(\\text{rechazar})\\le\\alpha",
   "cuando": "Relacionar potencia y error de tipo II, y recordar que el nivel acota la probabilidad de rechazar con H0 verdadera.",
   "condiciones": [],
   "slug": "formulario-pruebas-de-hipotesis",
   "ancla": "errores",
   "tags": [
    "prueba-hipotesis",
    "potencia"
   ],
   "esencial": true,
   "origen": {
    "archivo": "wiki/formularios/formulario-pruebas-de-hipotesis.md",
    "linea": 25,
    "tipo": "parrafo"
   }
  },
  {
   "id": "estadisticos--estadisticos",
   "unidad": "9",
   "seccion": "Estadísticos",
   "subseccion": "",
   "nombre": "Estadísticos",
   "tex": "Z_{\\text{media}}=\\frac{\\bar X-\\mu_0}{\\sigma/\\sqrt n}\\quad(\\sigma\\text{ conocida o }n\\text{ grande}) \\qquad T=\\frac{\\bar X-\\mu_0}{S/\\sqrt n}\\sim t_{n-1}\\quad(\\sigma\\text{ desc., }n\\text{ chico, normal})",
   "variante": "proporción",
   "cuando": "Estadísticos de prueba para la media, con el criterio para elegir entre Z y T.",
   "condiciones": [
    "σ conocido o n grande"
   ],
   "slug": "formulario-pruebas-de-hipotesis",
   "ancla": "estadísticos",
   "tags": [
    "prueba-hipotesis",
    "estadistico"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-pruebas-de-hipotesis.md",
    "linea": 29,
    "tipo": "bloque"
   }
  },
  {
   "id": "estadisticos--estadisticos-2",
   "unidad": "9",
   "seccion": "Estadísticos",
   "subseccion": "",
   "nombre": "Estadísticos",
   "tex": "Z_{\\text{prop}}=\\frac{\\hat q-q_0}{\\sqrt{q_0(1-q_0)/n}}\\quad(n>100)",
   "variante": "media",
   "cuando": "Estadístico de prueba para una proporción, con el desvío calculado bajo la nula.",
   "condiciones": [
    "n > 100"
   ],
   "slug": "formulario-pruebas-de-hipotesis",
   "ancla": "estadísticos",
   "tags": [
    "prueba-hipotesis",
    "proporcion"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-pruebas-de-hipotesis.md",
    "linea": 30,
    "tipo": "bloque"
   }
  },
  {
   "id": "valor-critico-del-estimador--dos-colas",
   "unidad": "9",
   "seccion": "Valor crítico del estimador (media, $\\sigma$ conocida)",
   "subseccion": "",
   "nombre": "Dos colas",
   "tex": "\\bar x_{c}=\\mu_0\\pm z_{1-\\alpha/2}\\,\\dfrac{\\sigma}{\\sqrt n}\\text{.}",
   "cuando": "Piden el valor crítico en las unidades del problema (no en Z) para una prueba bilateral.",
   "condiciones": [
    "σ conocida"
   ],
   "slug": "formulario-pruebas-de-hipotesis",
   "ancla": "valor-crítico-del-estimador-media-conocida",
   "tags": [
    "prueba-hipotesis",
    "valor-critico"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-pruebas-de-hipotesis.md",
    "linea": 42,
    "tipo": "vineta"
   }
  },
  {
   "id": "valor-critico-del-estimador--cola-derecha",
   "unidad": "9",
   "seccion": "Valor crítico del estimador (media, $\\sigma$ conocida)",
   "subseccion": "",
   "nombre": "Cola derecha",
   "tex": "\\bar x_c=\\mu_0+z_{1-\\alpha}\\,\\dfrac{\\sigma}{\\sqrt n}\\text{.}",
   "cuando": "Valor crítico del promedio en una prueba a cola derecha.",
   "condiciones": [
    "σ conocida"
   ],
   "slug": "formulario-pruebas-de-hipotesis",
   "ancla": "valor-crítico-del-estimador-media-conocida",
   "tags": [
    "prueba-hipotesis",
    "valor-critico"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-pruebas-de-hipotesis.md",
    "linea": 43,
    "tipo": "vineta"
   }
  },
  {
   "id": "valor-critico-del-estimador--cola-izquierda",
   "unidad": "9",
   "seccion": "Valor crítico del estimador (media, $\\sigma$ conocida)",
   "subseccion": "",
   "nombre": "Cola izquierda",
   "tex": "\\bar x_c=\\mu_0-z_{1-\\alpha}\\,\\dfrac{\\sigma}{\\sqrt n}\\text{.}",
   "cuando": "Valor crítico del promedio en una prueba a cola izquierda.",
   "condiciones": [
    "σ conocida"
   ],
   "slug": "formulario-pruebas-de-hipotesis",
   "ancla": "valor-crítico-del-estimador-media-conocida",
   "tags": [
    "prueba-hipotesis",
    "valor-critico"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-pruebas-de-hipotesis.md",
    "linea": 44,
    "tipo": "vineta"
   }
  },
  {
   "id": "valor-critico-del-estimador--proporcion-cola-derecha",
   "unidad": "9",
   "seccion": "Valor crítico del estimador (media, $\\sigma$ conocida)",
   "subseccion": "",
   "nombre": "Proporción (cola derecha)",
   "tex": "\\hat p_c=p_0+z_{1-\\alpha}\\sqrt{\\dfrac{p_0(1-p_0)}{n}}",
   "cuando": "Valor crítico en unidades de proporción para una prueba de cola derecha sobre p.",
   "condiciones": [
    "n grande"
   ],
   "slug": "formulario-pruebas-de-hipotesis",
   "ancla": "valor-crítico-del-estimador-media-conocida",
   "tags": [
    "prueba-hipotesis",
    "valor-critico",
    "proporcion"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-pruebas-de-hipotesis.md",
    "linea": 46,
    "tipo": "parrafo"
   }
  },
  {
   "id": "valor-p--derecha-con",
   "unidad": "9",
   "seccion": "Valor p",
   "subseccion": "",
   "nombre": "Derecha",
   "tex": "1-\\Phi(z_{\\text{obs}})",
   "variante": "Con $Z$",
   "cuando": "Valor p de una prueba a cola derecha con estadístico Z.",
   "condiciones": [
    "σ conocido o n grande"
   ],
   "slug": "valor-p",
   "ancla": "regla-de-decisión-con-el-valor-p",
   "tags": [
    "prueba-hipotesis",
    "valor-p"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-pruebas-de-hipotesis.md",
    "linea": 52,
    "tipo": "tabla"
   }
  },
  {
   "id": "valor-p--derecha-con-2",
   "unidad": "9",
   "seccion": "Valor p",
   "subseccion": "",
   "nombre": "Derecha",
   "tex": "1-\\Xi_{n-1}(t_{\\text{obs}})",
   "variante": "Con $T$",
   "cuando": "Valor p de una prueba a cola derecha con estadístico T.",
   "condiciones": [
    "σ desconocido",
    "n chico"
   ],
   "slug": "valor-p",
   "ancla": "regla-de-decisión-con-el-valor-p",
   "tags": [
    "prueba-hipotesis",
    "valor-p"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-pruebas-de-hipotesis.md",
    "linea": 52,
    "tipo": "tabla"
   }
  },
  {
   "id": "valor-p--izquierda-con",
   "unidad": "9",
   "seccion": "Valor p",
   "subseccion": "",
   "nombre": "Izquierda",
   "tex": "\\Phi(z_{\\text{obs}})",
   "variante": "Con $Z$",
   "cuando": "Valor p de una prueba a cola izquierda con estadístico Z.",
   "condiciones": [
    "σ conocido o n grande"
   ],
   "slug": "valor-p",
   "ancla": "regla-de-decisión-con-el-valor-p",
   "tags": [
    "prueba-hipotesis",
    "valor-p"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-pruebas-de-hipotesis.md",
    "linea": 53,
    "tipo": "tabla"
   }
  },
  {
   "id": "valor-p--izquierda-con-2",
   "unidad": "9",
   "seccion": "Valor p",
   "subseccion": "",
   "nombre": "Izquierda",
   "tex": "\\Xi_{n-1}(t_{\\text{obs}})",
   "variante": "Con $T$",
   "cuando": "Valor p de una prueba a cola izquierda con estadístico T.",
   "condiciones": [
    "σ desconocido",
    "n chico"
   ],
   "slug": "valor-p",
   "ancla": "regla-de-decisión-con-el-valor-p",
   "tags": [
    "prueba-hipotesis",
    "valor-p"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-pruebas-de-hipotesis.md",
    "linea": 53,
    "tipo": "tabla"
   }
  },
  {
   "id": "valor-p--dos-colas-con",
   "unidad": "9",
   "seccion": "Valor p",
   "subseccion": "",
   "nombre": "Dos colas",
   "tex": "2(1-\\Phi(\\lvert z_{\\text{obs}}\\rvert))",
   "variante": "Con $Z$",
   "cuando": "Valor p bilateral con Z: se duplica la cola porque el rechazo puede darse de los dos lados.",
   "condiciones": [
    "σ conocido o n grande"
   ],
   "slug": "valor-p",
   "ancla": "regla-de-decisión-con-el-valor-p",
   "tags": [
    "prueba-hipotesis",
    "valor-p"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-pruebas-de-hipotesis.md",
    "linea": 54,
    "tipo": "tabla"
   }
  },
  {
   "id": "valor-p--dos-colas-con-2",
   "unidad": "9",
   "seccion": "Valor p",
   "subseccion": "",
   "nombre": "Dos colas",
   "tex": "2(1-\\Xi_{n-1}(\\lvert t_{\\text{obs}}\\rvert))",
   "variante": "Con $T$",
   "cuando": "Valor p bilateral con T.",
   "condiciones": [
    "σ desconocido",
    "n chico"
   ],
   "slug": "valor-p",
   "ancla": "regla-de-decisión-con-el-valor-p",
   "tags": [
    "prueba-hipotesis",
    "valor-p"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-pruebas-de-hipotesis.md",
    "linea": 54,
    "tipo": "tabla"
   }
  },
  {
   "id": "valor-p--decision",
   "unidad": "9",
   "seccion": "Valor p",
   "subseccion": "",
   "nombre": "Decisión",
   "tex": "\\text{rechazar }H_0\\iff\\text{ valor p }<\\alpha",
   "cuando": "Regla de decisión con valor p: se rechaza H0 exactamente cuando el valor p queda por debajo del nivel.",
   "condiciones": [],
   "slug": "valor-p",
   "ancla": "regla-de-decisión-con-el-valor-p",
   "tags": [
    "prueba-hipotesis",
    "valor-p"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-pruebas-de-hipotesis.md",
    "linea": 56,
    "tipo": "parrafo"
   }
  },
  {
   "id": "error-tipo-ii-media--dos-colas",
   "unidad": "9",
   "seccion": "Error tipo II — media, $\\sigma$ conocida (TP9)",
   "subseccion": "",
   "nombre": "Dos colas",
   "tex": "\\beta(\\mu_1)=\\Phi\\!\\left(z_{1-\\alpha/2}+\\tfrac{\\mu_0-\\mu_1}{\\sigma/\\sqrt n}\\right)-\\Phi\\!\\left(-z_{1-\\alpha/2}+\\tfrac{\\mu_0-\\mu_1}{\\sigma/\\sqrt n}\\right)\\text{.}",
   "cuando": "Piden β o la potencia frente a un valor alternativo concreto de la media, en una prueba bilateral.",
   "condiciones": [
    "σ conocida",
    "μ₁ dado"
   ],
   "slug": "formulario-pruebas-de-hipotesis",
   "ancla": "error-tipo-ii-media-conocida-tp9",
   "tags": [
    "prueba-hipotesis",
    "error-tipo-ii"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-pruebas-de-hipotesis.md",
    "linea": 60,
    "tipo": "vineta"
   }
  },
  {
   "id": "error-tipo-ii-media--cola-derecha",
   "unidad": "9",
   "seccion": "Error tipo II — media, $\\sigma$ conocida (TP9)",
   "subseccion": "",
   "nombre": "Cola derecha",
   "tex": "\\beta(\\mu_1)=\\Phi\\!\\left(z_{1-\\alpha}+\\tfrac{\\mu_0-\\mu_1}{\\sigma/\\sqrt n}\\right)\\text{.}",
   "cuando": "β frente a una alternativa concreta en una prueba a cola derecha; la potencia es 1 − β.",
   "condiciones": [
    "σ conocida",
    "μ₁ dado"
   ],
   "slug": "formulario-pruebas-de-hipotesis",
   "ancla": "error-tipo-ii-media-conocida-tp9",
   "tags": [
    "prueba-hipotesis",
    "error-tipo-ii"
   ],
   "esencial": true,
   "origen": {
    "archivo": "wiki/formularios/formulario-pruebas-de-hipotesis.md",
    "linea": 61,
    "tipo": "vineta"
   }
  },
  {
   "id": "error-tipo-ii-media--cola-izquierda",
   "unidad": "9",
   "seccion": "Error tipo II — media, $\\sigma$ conocida (TP9)",
   "subseccion": "",
   "nombre": "Cola izquierda",
   "tex": "\\beta(\\mu_1)=1-\\Phi\\!\\left(-z_{1-\\alpha}+\\tfrac{\\mu_0-\\mu_1}{\\sigma/\\sqrt n}\\right)\\text{.}",
   "cuando": "β frente a una alternativa concreta en una prueba a cola izquierda.",
   "condiciones": [
    "σ conocida",
    "μ₁ dado"
   ],
   "slug": "formulario-pruebas-de-hipotesis",
   "ancla": "error-tipo-ii-media-conocida-tp9",
   "tags": [
    "prueba-hipotesis",
    "error-tipo-ii"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-pruebas-de-hipotesis.md",
    "linea": 62,
    "tipo": "vineta"
   }
  },
  {
   "id": "error-tipo-ii-media--valores-guia",
   "unidad": "9",
   "seccion": "Error tipo II — media, $\\sigma$ conocida (TP9)",
   "subseccion": "",
   "nombre": "Valores guía",
   "tex": "\\beta(\\mu_0)=1-\\alpha\\text{; }\\beta(\\text{valor crítico})\\approx 0.5\\text{ (si simétrica); }\\beta\\to 0\\text{ al alejarse hacia }H_1",
   "cuando": "Control de razonabilidad del cálculo de β: en μ0 vale 1-α, en el valor crítico ronda 0.5 y cae al alejarse hacia H1.",
   "condiciones": [
    "σ conocida"
   ],
   "slug": "formulario-pruebas-de-hipotesis",
   "ancla": "error-tipo-ii-media-conocida-tp9",
   "tags": [
    "prueba-hipotesis",
    "error-tipo-ii"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-pruebas-de-hipotesis.md",
    "linea": 64,
    "tipo": "parrafo"
   }
  },
  {
   "id": "error-tipo-ii-proporcion--error-tipo-ii-proporcion-cola-derecha",
   "unidad": "9",
   "seccion": "Error tipo II — proporción (cola derecha)",
   "subseccion": "",
   "nombre": "Error tipo II — proporción (cola derecha)",
   "tex": "\\beta(q_1)=\\Phi\\!\\left(z_{1-\\alpha}\\sqrt{\\tfrac{q_0(1-q_0)}{q_1(1-q_1)}}+\\frac{q_0-q_1}{\\sqrt{q_1(1-q_1)/n}}\\right).",
   "cuando": "β de una prueba de proporción a cola derecha frente a una alternativa concreta.",
   "condiciones": [
    "n grande",
    "q₁ dado"
   ],
   "slug": "formulario-pruebas-de-hipotesis",
   "ancla": "error-tipo-ii-proporción-cola-derecha",
   "tags": [
    "prueba-hipotesis",
    "error-tipo-ii",
    "proporcion"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-pruebas-de-hipotesis.md",
    "linea": 69,
    "tipo": "bloque"
   }
  },
  {
   "id": "diseno-de-la-prueba--media-conocida",
   "unidad": "9",
   "seccion": "Diseño de la prueba — tamaño muestral (fijar α y β)",
   "subseccion": "",
   "nombre": "Media, $\\sigma$ conocida",
   "tex": "\\;n=\\left(\\dfrac{(z_{1-\\alpha}+z_{1-\\beta^*})\\,\\sigma}{\\mu_1-\\mu_0}\\right)^2",
   "cuando": "Piden el tamaño de muestra que cumple a la vez un nivel α y un β máximo frente a una alternativa: se despeja n y se redondea hacia arriba.",
   "condiciones": [
    "σ conocida",
    "α y β fijados"
   ],
   "slug": "diseno-de-prueba-tamano-muestral",
   "ancla": "caso-media-conocida-estadístico",
   "tags": [
    "prueba-hipotesis",
    "tamano-muestral"
   ],
   "esencial": true,
   "origen": {
    "archivo": "wiki/formularios/formulario-pruebas-de-hipotesis.md",
    "linea": 76,
    "tipo": "vineta"
   }
  },
  {
   "id": "diseno-de-la-prueba--valor-critico",
   "unidad": "9",
   "seccion": "Diseño de la prueba — tamaño muestral (fijar α y β)",
   "subseccion": "",
   "nombre": "Valor crítico",
   "tex": "\\text{(cola derecha): }\\bar x_c=\\mu_0+z_{1-\\alpha}\\,\\sigma/\\sqrt n\\text{.}",
   "cuando": "Valor crítico asociado al diseño, una vez determinado n.",
   "condiciones": [
    "σ conocida"
   ],
   "slug": "diseno-de-prueba-tamano-muestral",
   "ancla": "",
   "tags": [
    "prueba-hipotesis",
    "valor-critico"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-pruebas-de-hipotesis.md",
    "linea": 77,
    "tipo": "vineta"
   }
  },
  {
   "id": "diseno-de-la-prueba--proporcion",
   "unidad": "9",
   "seccion": "Diseño de la prueba — tamaño muestral (fijar α y β)",
   "subseccion": "",
   "nombre": "Proporción",
   "tex": "\\text{despejar }\\sqrt n\\text{ de }z_{1-\\alpha}\\sqrt{\\tfrac{q_0(1-q_0)}{q_1(1-q_1)}}+\\tfrac{q_0-q_1}{\\sqrt{q_1(1-q_1)/n}}=-z_{1-\\beta^*}\\text{; luego }c=n\\,\\hat q_c\\text{ con }\\hat q_c=q_0+z_{1-\\alpha}\\sqrt{q_0(1-q_0)/n}\\text{.}",
   "cuando": "Diseño de una prueba de proporción: se despeja n y después el número crítico de éxitos.",
   "condiciones": [
    "n grande",
    "α y β fijados"
   ],
   "slug": "diseno-de-prueba-tamano-muestral",
   "ancla": "",
   "tags": [
    "prueba-hipotesis",
    "tamano-muestral",
    "proporcion"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-pruebas-de-hipotesis.md",
    "linea": 78,
    "tipo": "vineta"
   }
  },
  {
   "id": "fractiles-de-uso-frecuente--010-1-cola",
   "unidad": "9",
   "seccion": "Fractiles de uso frecuente",
   "subseccion": "",
   "nombre": "$\\alpha=0.10$",
   "tex": "z_{1-\\alpha}=1.2816",
   "variante": "$z_{1-\\alpha}$ (1 cola)",
   "cuando": "Fractil de una cola para α = 0.10.",
   "condiciones": [],
   "slug": "formulario-pruebas-de-hipotesis",
   "ancla": "fractiles-de-uso-frecuente",
   "tags": [
    "prueba-hipotesis",
    "fractiles",
    "tabla"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-pruebas-de-hipotesis.md",
    "linea": 84,
    "tipo": "tabla"
   }
  },
  {
   "id": "fractiles-de-uso-frecuente--010-2-colas",
   "unidad": "9",
   "seccion": "Fractiles de uso frecuente",
   "subseccion": "",
   "nombre": "$\\alpha=0.10$",
   "tex": "z_{1-\\alpha/2}=1.6449",
   "variante": "$z_{1-\\alpha/2}$ (2 colas)",
   "cuando": "Fractil bilateral para α = 0.10.",
   "condiciones": [],
   "slug": "formulario-pruebas-de-hipotesis",
   "ancla": "fractiles-de-uso-frecuente",
   "tags": [
    "prueba-hipotesis",
    "fractiles",
    "tabla"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-pruebas-de-hipotesis.md",
    "linea": 84,
    "tipo": "tabla"
   }
  },
  {
   "id": "fractiles-de-uso-frecuente--005-1-cola",
   "unidad": "9",
   "seccion": "Fractiles de uso frecuente",
   "subseccion": "",
   "nombre": "$\\alpha=0.05$",
   "tex": "z_{1-\\alpha}=1.6449",
   "variante": "$z_{1-\\alpha}$ (1 cola)",
   "cuando": "Fractil de una cola para α = 0.05: el 1.6449 de las pruebas unilaterales al 5 %.",
   "condiciones": [],
   "slug": "formulario-pruebas-de-hipotesis",
   "ancla": "fractiles-de-uso-frecuente",
   "tags": [
    "prueba-hipotesis",
    "fractiles",
    "tabla"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-pruebas-de-hipotesis.md",
    "linea": 85,
    "tipo": "tabla"
   }
  },
  {
   "id": "fractiles-de-uso-frecuente--005-2-colas",
   "unidad": "9",
   "seccion": "Fractiles de uso frecuente",
   "subseccion": "",
   "nombre": "$\\alpha=0.05$",
   "tex": "z_{1-\\alpha/2}=1.9600",
   "variante": "$z_{1-\\alpha/2}$ (2 colas)",
   "cuando": "Fractil bilateral para α = 0.05: el 1.96 de las pruebas a dos colas al 5 %.",
   "condiciones": [],
   "slug": "formulario-pruebas-de-hipotesis",
   "ancla": "fractiles-de-uso-frecuente",
   "tags": [
    "prueba-hipotesis",
    "fractiles",
    "tabla"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-pruebas-de-hipotesis.md",
    "linea": 85,
    "tipo": "tabla"
   }
  },
  {
   "id": "fractiles-de-uso-frecuente--0025-1-cola",
   "unidad": "9",
   "seccion": "Fractiles de uso frecuente",
   "subseccion": "",
   "nombre": "$\\alpha=0.025$",
   "tex": "z_{1-\\alpha}=1.9600",
   "variante": "$z_{1-\\alpha}$ (1 cola)",
   "cuando": "Fractil de una cola para α = 0.025.",
   "condiciones": [],
   "slug": "formulario-pruebas-de-hipotesis",
   "ancla": "fractiles-de-uso-frecuente",
   "tags": [
    "prueba-hipotesis",
    "fractiles",
    "tabla"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-pruebas-de-hipotesis.md",
    "linea": 86,
    "tipo": "tabla"
   }
  },
  {
   "id": "fractiles-de-uso-frecuente--0025-2-colas",
   "unidad": "9",
   "seccion": "Fractiles de uso frecuente",
   "subseccion": "",
   "nombre": "$\\alpha=0.025$",
   "tex": "z_{1-\\alpha/2}=2.2414",
   "variante": "$z_{1-\\alpha/2}$ (2 colas)",
   "cuando": "Fractil bilateral para α = 0.025.",
   "condiciones": [],
   "slug": "formulario-pruebas-de-hipotesis",
   "ancla": "fractiles-de-uso-frecuente",
   "tags": [
    "prueba-hipotesis",
    "fractiles",
    "tabla"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-pruebas-de-hipotesis.md",
    "linea": 86,
    "tipo": "tabla"
   }
  },
  {
   "id": "fractiles-de-uso-frecuente--001-1-cola",
   "unidad": "9",
   "seccion": "Fractiles de uso frecuente",
   "subseccion": "",
   "nombre": "$\\alpha=0.01$",
   "tex": "z_{1-\\alpha}=2.3263",
   "variante": "$z_{1-\\alpha}$ (1 cola)",
   "cuando": "Fractil de una cola para α = 0.01.",
   "condiciones": [],
   "slug": "formulario-pruebas-de-hipotesis",
   "ancla": "fractiles-de-uso-frecuente",
   "tags": [
    "prueba-hipotesis",
    "fractiles",
    "tabla"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-pruebas-de-hipotesis.md",
    "linea": 87,
    "tipo": "tabla"
   }
  },
  {
   "id": "fractiles-de-uso-frecuente--001-2-colas",
   "unidad": "9",
   "seccion": "Fractiles de uso frecuente",
   "subseccion": "",
   "nombre": "$\\alpha=0.01$",
   "tex": "z_{1-\\alpha/2}=2.5758",
   "variante": "$z_{1-\\alpha/2}$ (2 colas)",
   "cuando": "Fractil bilateral para α = 0.01: el 2.5758 de las pruebas a dos colas al 1 %.",
   "condiciones": [],
   "slug": "formulario-pruebas-de-hipotesis",
   "ancla": "fractiles-de-uso-frecuente",
   "tags": [
    "prueba-hipotesis",
    "fractiles",
    "tabla"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-pruebas-de-hipotesis.md",
    "linea": 87,
    "tipo": "tabla"
   }
  },
  {
   "id": "integrales-impropias--tipo-i-extremo-superior-infinito",
   "unidad": "0",
   "seccion": "Integrales impropias",
   "subseccion": "",
   "nombre": "Tipo I — extremo superior infinito",
   "tex": "\\int_a^{+\\infty} f(x)\\,dx=\\lim_{t\\to+\\infty}\\int_a^{t} f(x)\\,dx",
   "cuando": "Cuando hay que integrar una densidad hasta más infinito: normalizar una exponencial, calcular P(X>x) o una esperanza sobre soporte no acotado por derecha.",
   "condiciones": [
    "la integral ordinaria de a a t existe para todo t finito",
    "el límite debe ser finito para que converja"
   ],
   "slug": "tecnica-integrales-impropias",
   "ancla": "",
   "tags": [
    "integral-impropia",
    "tipo-i",
    "continua"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-complementos-matematicos.md",
    "linea": 30,
    "tipo": "tabla"
   }
  },
  {
   "id": "integrales-impropias--tipo-i-extremo-inferior-infinito",
   "unidad": "0",
   "seccion": "Integrales impropias",
   "subseccion": "",
   "nombre": "Tipo I — extremo inferior infinito",
   "tex": "\\int_{-\\infty}^{b} f(x)\\,dx=\\lim_{t\\to-\\infty}\\int_t^{b} f(x)\\,dx",
   "cuando": "Para evaluar la FDA de una variable con soporte no acotado por izquierda (típicamente la normal) desde menos infinito hasta b.",
   "condiciones": [
    "la integral ordinaria de t a b existe para todo t finito",
    "el límite debe ser finito"
   ],
   "slug": "tecnica-integrales-impropias",
   "ancla": "",
   "tags": [
    "integral-impropia",
    "tipo-i",
    "fda"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-complementos-matematicos.md",
    "linea": 31,
    "tipo": "tabla"
   }
  },
  {
   "id": "integrales-impropias--tipo-i-ambos-extremos-infinitos",
   "unidad": "0",
   "seccion": "Integrales impropias",
   "subseccion": "",
   "nombre": "Tipo I — ambos extremos infinitos",
   "tex": "\\int_{-\\infty}^{+\\infty} f(x)\\,dx=\\int_{-\\infty}^{c} f(x)\\,dx+\\int_{c}^{+\\infty} f(x)\\,dx",
   "cuando": "Al normalizar una densidad sobre toda la recta (normal) o al calcular su esperanza: se parte en un punto c y se tratan las dos colas por separado.",
   "condiciones": [
    "c es cualquier punto real",
    "las dos integrales deben converger por separado"
   ],
   "slug": "tecnica-integrales-impropias",
   "ancla": "",
   "tags": [
    "integral-impropia",
    "tipo-i",
    "normalizacion"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-complementos-matematicos.md",
    "linea": 32,
    "tipo": "tabla"
   }
  },
  {
   "id": "integrales-impropias--tipo-ii-singularidad-en",
   "unidad": "0",
   "seccion": "Integrales impropias",
   "subseccion": "",
   "nombre": "Tipo II — singularidad en $b$",
   "tex": "\\int_a^b f(x)\\,dx=\\lim_{t\\to b^-}\\int_a^{t} f(x)\\,dx",
   "cuando": "Cuando el integrando explota en el extremo derecho del intervalo (denominador que se anula, raíz o logaritmo de cero) sobre un dominio acotado.",
   "condiciones": [
    "f continua en [a,b) pero no en b",
    "el límite lateral por izquierda debe ser finito"
   ],
   "slug": "tecnica-integrales-impropias",
   "ancla": "",
   "tags": [
    "integral-impropia",
    "tipo-ii",
    "singularidad"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-complementos-matematicos.md",
    "linea": 33,
    "tipo": "tabla"
   }
  },
  {
   "id": "integrales-impropias--tipo-ii-singularidad-en-2",
   "unidad": "0",
   "seccion": "Integrales impropias",
   "subseccion": "",
   "nombre": "Tipo II — singularidad en $a$",
   "tex": "\\int_a^b f(x)\\,dx=\\lim_{t\\to a^+}\\int_t^{b} f(x)\\,dx",
   "cuando": "Mismo caso que el anterior pero con la asíntota en el extremo izquierdo del intervalo de integración.",
   "condiciones": [
    "f continua en (a,b] pero no en a",
    "el límite lateral por derecha debe ser finito"
   ],
   "slug": "tecnica-integrales-impropias",
   "ancla": "",
   "tags": [
    "integral-impropia",
    "tipo-ii",
    "singularidad"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-complementos-matematicos.md",
    "linea": 34,
    "tipo": "tabla"
   }
  },
  {
   "id": "integrales-impropias--tipo-ii-singularidad-en-los-dos",
   "unidad": "0",
   "seccion": "Integrales impropias",
   "subseccion": "",
   "nombre": "Tipo II — singularidad en los dos extremos",
   "tex": "\\int_a^b f(x)\\,dx=\\int_a^{c} f(x)\\,dx+\\int_{c}^{b} f(x)\\,dx\\text{, con }c\\in(a,b)",
   "cuando": "Cuando el integrando explota en a y en b a la vez: se parte en un punto interior y cada pedazo se resuelve como un Tipo II simple.",
   "condiciones": [
    "f continua en (a,b), no en a ni en b",
    "c interior al intervalo",
    "cada pedazo debe converger"
   ],
   "slug": "tecnica-integrales-impropias",
   "ancla": "",
   "tags": [
    "integral-impropia",
    "tipo-ii"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-complementos-matematicos.md",
    "linea": 35,
    "tipo": "tabla"
   }
  },
  {
   "id": "integrales-impropias--cola-convergente-referencia",
   "unidad": "0",
   "seccion": "Integrales impropias",
   "subseccion": "",
   "nombre": "Cola convergente (referencia)",
   "tex": "\\int_1^{+\\infty}\\frac{1}{x^2}\\,dx=1",
   "cuando": "Ejemplo de referencia para justificar que una región infinitamente larga puede tener área finita; sirve de test mental de convergencia de colas.",
   "condiciones": [
    "decaimiento del orden de x elevado a menos dos o más rápido"
   ],
   "slug": "tecnica-integrales-impropias",
   "ancla": "",
   "tags": [
    "integral-impropia",
    "convergencia",
    "ejemplo"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-complementos-matematicos.md",
    "linea": 41,
    "tipo": "vineta"
   }
  },
  {
   "id": "integrales-impropias--cola-divergente-referencia",
   "unidad": "0",
   "seccion": "Integrales impropias",
   "subseccion": "",
   "nombre": "Cola divergente (referencia)",
   "tex": "\\int_1^{+\\infty}\\frac{1}{x}\\,dx=\\lim_{t\\to+\\infty}\\ln t=+\\infty",
   "cuando": "Contraejemplo de referencia: marca la frontera de decaimiento a partir de la cual la integral impropia deja de converger.",
   "condiciones": [
    "decaimiento del orden de uno sobre x"
   ],
   "slug": "tecnica-integrales-impropias",
   "ancla": "",
   "tags": [
    "integral-impropia",
    "divergencia",
    "ejemplo"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-complementos-matematicos.md",
    "linea": 42,
    "tipo": "vineta"
   }
  },
  {
   "id": "integrales-impropias--singularidad-con-area-finita-referencia",
   "unidad": "0",
   "seccion": "Integrales impropias",
   "subseccion": "",
   "nombre": "Singularidad con área finita (referencia)",
   "tex": "\\int_2^{5}\\frac{1}{2\\sqrt{x-2}}\\,dx=\\sqrt{3}",
   "cuando": "Ejemplo resuelto de Tipo II: la altura del integrando crece sin límite y aun así el área acumulada converge.",
   "condiciones": [
    "singularidad en el extremo izquierdo",
    "primitiva igual a la raíz de x menos dos"
   ],
   "slug": "tecnica-integrales-impropias",
   "ancla": "",
   "tags": [
    "integral-impropia",
    "tipo-ii",
    "ejemplo"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-complementos-matematicos.md",
    "linea": 43,
    "tipo": "vineta"
   }
  },
  {
   "id": "integrales-impropias--normalizacion-de-una-densidad",
   "unidad": "0",
   "seccion": "Integrales impropias",
   "subseccion": "Dónde aparecen en probabilidad",
   "nombre": "Normalización de una densidad",
   "tex": "\\int_{-\\infty}^{+\\infty} f_X(x)\\,dx=1",
   "cuando": "Para hallar la constante k de una densidad dada a menos de un factor, o para verificar que una función propuesta es densidad válida.",
   "condiciones": [
    "f_X mayor o igual a cero en todo el soporte",
    "la integral debe converger a uno exactamente"
   ],
   "slug": "tecnica-integrales-impropias",
   "ancla": "",
   "tags": [
    "densidad",
    "normalizacion",
    "continua"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-complementos-matematicos.md",
    "linea": 47,
    "tipo": "vineta"
   }
  },
  {
   "id": "integrales-impropias--probabilidad-como-area",
   "unidad": "0",
   "seccion": "Integrales impropias",
   "subseccion": "Dónde aparecen en probabilidad",
   "nombre": "Probabilidad como área",
   "tex": "P(a\\le X\\le b)=\\int_a^b f_X(x)\\,dx",
   "cuando": "Cálculo directo de la probabilidad de un intervalo para una variable aleatoria continua a partir de su densidad.",
   "condiciones": [
    "X continua",
    "f_X densidad normalizada"
   ],
   "slug": "tecnica-integrales-impropias",
   "ancla": "",
   "tags": [
    "densidad",
    "probabilidad",
    "continua"
   ],
   "esencial": true,
   "origen": {
    "archivo": "wiki/formularios/formulario-complementos-matematicos.md",
    "linea": 48,
    "tipo": "vineta"
   }
  },
  {
   "id": "integrales-impropias--fda-como-integral-impropia",
   "unidad": "0",
   "seccion": "Integrales impropias",
   "subseccion": "Dónde aparecen en probabilidad",
   "nombre": "FDA como integral impropia",
   "tex": "F_X(x)=\\int_{-\\infty}^{x} f_X(y)\\,dy",
   "cuando": "Para construir la función de distribución acumulada a partir de la densidad cuando el soporte llega a menos infinito.",
   "condiciones": [
    "X continua",
    "el límite inferior es impropio si el soporte no está acotado"
   ],
   "slug": "tecnica-integrales-impropias",
   "ancla": "",
   "tags": [
    "fda",
    "densidad",
    "integral-impropia"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-complementos-matematicos.md",
    "linea": 49,
    "tipo": "vineta"
   }
  },
  {
   "id": "integrales-impropias--esperanza-como-integral-impropia",
   "unidad": "0",
   "seccion": "Integrales impropias",
   "subseccion": "Dónde aparecen en probabilidad",
   "nombre": "Esperanza como integral impropia",
   "tex": "E[X]=\\int_{-\\infty}^{+\\infty} x\\,f_X(x)\\,dx",
   "cuando": "Cálculo de la esperanza de una variable continua de soporte no acotado (exponencial, normal); recordar que puede divergir.",
   "condiciones": [
    "la integral debe converger absolutamente",
    "si diverge, la esperanza no existe"
   ],
   "slug": "tecnica-integrales-impropias",
   "ancla": "",
   "tags": [
    "esperanza",
    "integral-impropia",
    "continua"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-complementos-matematicos.md",
    "linea": 50,
    "tipo": "vineta"
   }
  },
  {
   "id": "integrales-dobles--masa-de-una-placa",
   "unidad": "0",
   "seccion": "Integrales dobles",
   "subseccion": "",
   "nombre": "Masa de una placa",
   "tex": "\\text{masa}=\\iint_R d(x,y)\\,dx\\,dy",
   "cuando": "Versión física de la integral doble; es el molde del que sale la probabilidad de una región para un par continuo.",
   "condiciones": [
    "d densidad superficial sobre la región R"
   ],
   "slug": "tecnica-integrales-dobles",
   "ancla": "",
   "tags": [
    "integral-doble",
    "masa",
    "bidimensional"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-complementos-matematicos.md",
    "linea": 63,
    "tipo": "tabla"
   }
  },
  {
   "id": "integrales-dobles--celda-elemental-riemann",
   "unidad": "0",
   "seccion": "Integrales dobles",
   "subseccion": "",
   "nombre": "Celda elemental (Riemann)",
   "tex": "\\Delta\\text{masa}(x_i,y_j)\\approx d(x_i,y_j)\\,\\Delta x\\,\\Delta y",
   "cuando": "Sirve para justificar de dónde sale la integral doble y para interpretar la densidad conjunta como probabilidad por unidad de área.",
   "condiciones": [
    "celda chica",
    "d aproximadamente constante dentro de la celda"
   ],
   "slug": "tecnica-integrales-dobles",
   "ancla": "",
   "tags": [
    "integral-doble",
    "riemann",
    "intuicion"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-complementos-matematicos.md",
    "linea": 64,
    "tipo": "tabla"
   }
  },
  {
   "id": "integrales-dobles--suma-de-riemann",
   "unidad": "0",
   "seccion": "Integrales dobles",
   "subseccion": "",
   "nombre": "Suma de Riemann",
   "tex": "\\text{masa}\\approx\\sum_i\\sum_j d(x_i,y_j)\\,\\Delta x\\,\\Delta y",
   "cuando": "Paso intermedio conceptual entre la discretización de la región y la integral doble exacta; aparece en preguntas de fundamento.",
   "condiciones": [
    "la malla debe refinarse para que la aproximación converja"
   ],
   "slug": "tecnica-integrales-dobles",
   "ancla": "",
   "tags": [
    "integral-doble",
    "riemann",
    "intuicion"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-complementos-matematicos.md",
    "linea": 65,
    "tipo": "tabla"
   }
  },
  {
   "id": "integrales-dobles--fubini-triangulo",
   "unidad": "0",
   "seccion": "Integrales dobles",
   "subseccion": "",
   "nombre": "Fubini (triángulo $0<x<1,\\;0<y<1-x$)",
   "tex": "\\iint_R d\\,dA=\\int_0^1\\left[\\int_0^{1-x} d(x,y)\\,dy\\right]dx=\\int_0^1\\left[\\int_0^{1-y} d(x,y)\\,dx\\right]dy",
   "cuando": "Es el patrón de todo ejercicio de bidimensionales continuas con soporte triangular: elegir el orden de integración y escribir los límites variables.",
   "condiciones": [
    "los límites externos son constantes",
    "los internos pueden depender de la variable externa"
   ],
   "slug": "tecnica-integrales-dobles",
   "ancla": "",
   "tags": [
    "integral-doble",
    "fubini",
    "bidimensional"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-complementos-matematicos.md",
    "linea": 66,
    "tipo": "tabla"
   }
  },
  {
   "id": "integrales-dobles--baricentro-en",
   "unidad": "0",
   "seccion": "Integrales dobles",
   "subseccion": "",
   "nombre": "Baricentro en $x$",
   "tex": "\\bar x=\\frac{\\iint_R x\\,d(x,y)\\,dA}{\\text{masa}}",
   "cuando": "Análogo físico de E[X]; con densidad conjunta ya normalizada el denominador vale uno y la fórmula es directamente la esperanza marginal.",
   "condiciones": [
    "masa distinta de cero",
    "si la densidad no está normalizada hay que dividir por la masa"
   ],
   "slug": "tecnica-integrales-dobles",
   "ancla": "",
   "tags": [
    "integral-doble",
    "baricentro",
    "esperanza"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-complementos-matematicos.md",
    "linea": 67,
    "tipo": "tabla"
   }
  },
  {
   "id": "integrales-dobles--baricentro-en-2",
   "unidad": "0",
   "seccion": "Integrales dobles",
   "subseccion": "",
   "nombre": "Baricentro en $y$",
   "tex": "\\bar y=\\frac{\\iint_R y\\,d(x,y)\\,dA}{\\text{masa}}",
   "cuando": "La componente en y del centro de masa; en clave probabilística es E[Y] para la densidad conjunta normalizada.",
   "condiciones": [
    "masa distinta de cero",
    "misma región R que para la componente en x"
   ],
   "slug": "tecnica-integrales-dobles",
   "ancla": "",
   "tags": [
    "integral-doble",
    "baricentro",
    "esperanza"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-complementos-matematicos.md",
    "linea": 68,
    "tipo": "tabla"
   }
  },
  {
   "id": "integrales-dobles--probabilidad-de-una-region-del-plano",
   "unidad": "0",
   "seccion": "Integrales dobles",
   "subseccion": "",
   "nombre": "Probabilidad de una región del plano",
   "tex": "P((X,Y)\\in R)=\\iint_R f_{XY}(x,y)\\,dA",
   "cuando": "Cuando el enunciado pide la probabilidad de un suceso descrito por una desigualdad entre X e Y (por ejemplo Y mayor que X).",
   "condiciones": [
    "par continuo con densidad conjunta",
    "R debe traducirse a límites de integración"
   ],
   "slug": "tecnica-integrales-dobles",
   "ancla": "",
   "tags": [
    "integral-doble",
    "densidad-conjunta",
    "bidimensional"
   ],
   "esencial": true,
   "origen": {
    "archivo": "wiki/formularios/formulario-complementos-matematicos.md",
    "linea": 69,
    "tipo": "tabla"
   }
  },
  {
   "id": "integrales-dobles--normalizacion-conjunta",
   "unidad": "0",
   "seccion": "Integrales dobles",
   "subseccion": "",
   "nombre": "Normalización conjunta",
   "tex": "\\iint_{\\mathbb{R}^2} f_{XY}(x,y)\\,dA=1",
   "cuando": "Para hallar la constante de normalización de una densidad conjunta dada a menos de un factor, primer paso de casi todo ejercicio de bidimensionales.",
   "condiciones": [
    "densidad conjunta no negativa",
    "integrar sobre todo el soporte, no solo sobre el rectángulo que lo contiene"
   ],
   "slug": "tecnica-integrales-dobles",
   "ancla": "",
   "tags": [
    "integral-doble",
    "normalizacion",
    "densidad-conjunta"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-complementos-matematicos.md",
    "linea": 70,
    "tipo": "tabla"
   }
  },
  {
   "id": "integrales-dobles--baricentro-como-vector-de-esperanzas",
   "unidad": "0",
   "seccion": "Integrales dobles",
   "subseccion": "",
   "nombre": "Baricentro como vector de esperanzas",
   "tex": "(\\bar x,\\bar y)=(E[X],E[Y])",
   "cuando": "Traducción del centro de masa al lenguaje probabilístico; sirve de control de razonabilidad del resultado (debe caer dentro del soporte).",
   "condiciones": [
    "la densidad debe estar normalizada, es decir masa igual a uno"
   ],
   "slug": "tecnica-integrales-dobles",
   "ancla": "",
   "tags": [
    "baricentro",
    "esperanza",
    "bidimensional"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-complementos-matematicos.md",
    "linea": 71,
    "tipo": "tabla"
   }
  },
  {
   "id": "derivadas-parciales--densidad-lineal-como-cociente-incremental",
   "unidad": "0",
   "seccion": "Derivadas parciales",
   "subseccion": "",
   "nombre": "Densidad lineal como cociente incremental",
   "tex": "\\frac{\\Delta m}{\\Delta x}\\xrightarrow[\\Delta x\\to 0]{}\\frac{dm}{dx}(\\alpha)",
   "cuando": "Justifica por qué la densidad es la derivada de la acumulada; aparece en preguntas conceptuales sobre el significado de la densidad.",
   "condiciones": [
    "m derivable en el punto alfa"
   ],
   "slug": "tecnica-derivadas-parciales",
   "ancla": "",
   "tags": [
    "derivada",
    "densidad",
    "intuicion"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-complementos-matematicos.md",
    "linea": 84,
    "tipo": "tabla"
   }
  },
  {
   "id": "derivadas-parciales--densidad-en-1d",
   "unidad": "0",
   "seccion": "Derivadas parciales",
   "subseccion": "",
   "nombre": "Densidad en 1D",
   "tex": "f_X(x)=F_X'(x)",
   "cuando": "Cuando el enunciado da la FDA de una variable continua y pide la densidad, la esperanza o la varianza.",
   "condiciones": [
    "X continua",
    "F_X derivable salvo en un número finito de puntos"
   ],
   "slug": "tecnica-derivadas-parciales",
   "ancla": "",
   "tags": [
    "derivada",
    "densidad",
    "fda"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-complementos-matematicos.md",
    "linea": 85,
    "tipo": "tabla"
   }
  },
  {
   "id": "derivadas-parciales--densidad-como-derivada-cruzada",
   "unidad": "0",
   "seccion": "Derivadas parciales",
   "subseccion": "",
   "nombre": "Densidad como derivada cruzada",
   "tex": "d(x,y)=\\frac{\\partial}{\\partial x}\\frac{\\partial}{\\partial y}m(x,y)=\\frac{\\partial^2 m}{\\partial x\\,\\partial y}",
   "cuando": "Versión física de la recuperación de la densidad a partir de la masa acumulada en el cuadrante inferior izquierdo.",
   "condiciones": [
    "m con parciales segundas continuas"
   ],
   "slug": "tecnica-derivadas-parciales",
   "ancla": "idea-en-1d-derivada-como-densidad-alambre",
   "tags": [
    "derivada-parcial",
    "densidad",
    "bidimensional"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-complementos-matematicos.md",
    "linea": 86,
    "tipo": "tabla"
   }
  },
  {
   "id": "derivadas-parciales--densidad-conjunta-desde-la-fda-conjunta",
   "unidad": "0",
   "seccion": "Derivadas parciales",
   "subseccion": "",
   "nombre": "Densidad conjunta desde la FDA conjunta",
   "tex": "f(x,y)=\\frac{\\partial^2 F}{\\partial x\\,\\partial y}",
   "cuando": "Cuando el ejercicio de bidimensionales entrega la FDA conjunta y pide la densidad conjunta, las marginales o una probabilidad.",
   "condiciones": [
    "par continuo",
    "F con parciales segundas continuas en el interior del soporte"
   ],
   "slug": "tecnica-derivadas-parciales",
   "ancla": "",
   "tags": [
    "derivada-parcial",
    "densidad-conjunta",
    "fda"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-complementos-matematicos.md",
    "linea": 87,
    "tipo": "tabla"
   }
  },
  {
   "id": "derivadas-parciales--clairaut-schwarz-cruzadas-iguales",
   "unidad": "0",
   "seccion": "Derivadas parciales",
   "subseccion": "",
   "nombre": "Clairaut / Schwarz (cruzadas iguales)",
   "tex": "\\frac{\\partial^2 m}{\\partial x\\,\\partial y}=\\frac{\\partial^2 m}{\\partial y\\,\\partial x}",
   "cuando": "Permite elegir libremente el orden de derivación al obtener la densidad conjunta, y sirve de verificación del cálculo.",
   "condiciones": [
    "las derivadas parciales segundas deben ser continuas"
   ],
   "slug": "tecnica-derivadas-parciales",
   "ancla": "",
   "tags": [
    "derivada-parcial",
    "clairaut",
    "teorema"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-complementos-matematicos.md",
    "linea": 88,
    "tipo": "tabla"
   }
  },
  {
   "id": "derivadas-parciales--independencia-al-derivar-la-fda-conjunta",
   "unidad": "0",
   "seccion": "Derivadas parciales",
   "subseccion": "",
   "nombre": "Independencia al derivar la FDA conjunta",
   "tex": "F(x,y)=F_X(x)F_Y(y)\\;\\Rightarrow\\;f(x,y)=f_X(x)f_Y(y)",
   "cuando": "Para pasar del criterio de independencia en términos de la FDA al criterio en términos de densidades, o para chequear independencia factorizando.",
   "condiciones": [
    "X e Y continuas",
    "la factorización debe valer en todo el soporte, incluido el chequeo de que el soporte sea rectangular"
   ],
   "slug": "tecnica-derivadas-parciales",
   "ancla": "",
   "tags": [
    "independencia",
    "derivada-parcial",
    "densidad-conjunta"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-complementos-matematicos.md",
    "linea": 89,
    "tipo": "tabla"
   }
  },
  {
   "id": "frecuencias-e-histograma--intervalos-bins",
   "unidad": "1",
   "seccion": "Frecuencias e histograma",
   "subseccion": "",
   "nombre": "Intervalos (*bins*)",
   "tex": "a_1 < a_2 < \\dots < a_{N+1}\\text{ sobre la muestra }\\{x_i\\}_{i=1}^n",
   "cuando": "Al armar el histograma: define la grilla de intervalos sobre la que se cuentan las frecuencias. Es la decision previa a cualquier tabla de frecuencias y la que fija cuantas barras tendra el grafico.",
   "condiciones": [
    "los extremos deben cubrir toda la muestra",
    "habitualmente de igual longitud",
    "cambiar la cantidad de intervalos cambia la forma del histograma, no los datos"
   ],
   "slug": "histograma-y-frecuencias",
   "ancla": "",
   "tags": [
    "estadistica-descriptiva",
    "histograma",
    "frecuencias"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-estadistica-descriptiva.md",
    "linea": 27,
    "tipo": "parrafo"
   }
  },
  {
   "id": "frecuencias-e-histograma--frecuencia-absoluta",
   "unidad": "1",
   "seccion": "Frecuencias e histograma",
   "subseccion": "",
   "nombre": "Frecuencia absoluta",
   "tex": "n_k = |\\{x_i : x_i \\in (a_k, a_{k+1}]\\}|",
   "cuando": "Al armar la tabla de frecuencias o el histograma de una muestra: cuenta cuántos datos caen en el k-ésimo intervalo. Es el primer paso de cualquier ejercicio que empiece con datos crudos y pida agruparlos.",
   "condiciones": [
    "Intervalos (bins) que cubren toda la muestra",
    "Intervalos semiabiertos por izquierda: cada dato cae en exactamente uno",
    "Habitualmente de igual longitud"
   ],
   "slug": "histograma-y-frecuencias",
   "ancla": "",
   "tags": [
    "estadistica-descriptiva",
    "histograma",
    "frecuencias"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-estadistica-descriptiva.md",
    "linea": 30,
    "tipo": "vineta"
   }
  },
  {
   "id": "frecuencias-e-histograma--frecuencia-relativa",
   "unidad": "1",
   "seccion": "Frecuencias e histograma",
   "subseccion": "",
   "nombre": "Frecuencia relativa",
   "tex": "f_k = \\dfrac{n_k}{n}",
   "cuando": "Cuando el enunciado pide proporciones o porcentajes en lugar de conteos, o cuando hay que comparar dos muestras de tamaños distintos.",
   "condiciones": [
    "n = tamaño total de la muestra",
    "n_k = frecuencia absoluta del intervalo k"
   ],
   "slug": "histograma-y-frecuencias",
   "ancla": "función-de-frecuencia-relativa-acumulada",
   "tags": [
    "estadistica-descriptiva",
    "frecuencias"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-estadistica-descriptiva.md",
    "linea": 31,
    "tipo": "vineta"
   }
  },
  {
   "id": "frecuencias-e-histograma--normalizacion-de-las-frecuencias",
   "unidad": "1",
   "seccion": "Frecuencias e histograma",
   "subseccion": "",
   "nombre": "Normalización de las frecuencias",
   "tex": "\\sum_{k=1}^N n_k = n,\\qquad \\sum_{k=1}^N f_k = 1",
   "cuando": "Como chequeo de consistencia de la tabla de frecuencias antes de seguir: si las absolutas no suman n o las relativas no suman 1, hay un error de conteo o un intervalo mal definido.",
   "condiciones": [
    "Los N intervalos son disjuntos y cubren toda la muestra"
   ],
   "slug": "histograma-y-frecuencias",
   "ancla": "",
   "tags": [
    "estadistica-descriptiva",
    "frecuencias",
    "control"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-estadistica-descriptiva.md",
    "linea": 32,
    "tipo": "vineta"
   }
  },
  {
   "id": "frecuencias-e-histograma--frecuencia-relativa-acumulada",
   "unidad": "1",
   "seccion": "Frecuencias e histograma",
   "subseccion": "",
   "nombre": "Frecuencia relativa acumulada",
   "tex": "F(\\alpha) = \\dfrac{|\\{x_i : x_i \\le \\alpha\\}|}{n} \\in [0,1]",
   "cuando": "Cuando piden qué proporción de los datos es menor o igual que un valor, o como paso previo a leer cuartiles y percentiles sobre la ojiva. Es la contraparte muestral de la FDA.",
   "condiciones": [
    "Función creciente tipo escalera (salta en cada dato)",
    "No depende del ancho de los bins elegido"
   ],
   "slug": "histograma-y-frecuencias",
   "ancla": "función-de-frecuencia-relativa-acumulada",
   "tags": [
    "estadistica-descriptiva",
    "acumulada",
    "fda-muestral"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-estadistica-descriptiva.md",
    "linea": 33,
    "tipo": "vineta"
   }
  },
  {
   "id": "tendencia-central--media",
   "unidad": "1",
   "seccion": "Tendencia central",
   "subseccion": "",
   "nombre": "Media",
   "tex": "\\bar x = \\dfrac{1}{n}\\sum_{i=1}^n x_i",
   "cuando": "Medida de centro por defecto cuando se dispone de los datos individuales y no hay valores atípicos que la distorsionen.",
   "condiciones": [
    "Datos individuales (sin agrupar)",
    "Sensible a outliers: si el enunciado los señala, reportar también la mediana"
   ],
   "slug": "medidas-de-tendencia-central",
   "ancla": "",
   "tags": [
    "estadistica-descriptiva",
    "tendencia-central"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-estadistica-descriptiva.md",
    "linea": 42,
    "tipo": "tabla"
   }
  },
  {
   "id": "tendencia-central--mediana-impar",
   "unidad": "1",
   "seccion": "Tendencia central",
   "subseccion": "",
   "nombre": "Mediana ($n$ impar)",
   "tex": "q_2 = \\tilde x_{(n+1)/2}",
   "cuando": "Centro robusto con cantidad impar de datos: es directamente la observación central de la muestra ordenada.",
   "condiciones": [
    "Muestra ordenada de menor a mayor",
    "n impar"
   ],
   "slug": "medidas-de-tendencia-central",
   "ancla": "",
   "tags": [
    "estadistica-descriptiva",
    "tendencia-central",
    "robusta"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-estadistica-descriptiva.md",
    "linea": 43,
    "tipo": "tabla"
   }
  },
  {
   "id": "tendencia-central--mediana-par",
   "unidad": "1",
   "seccion": "Tendencia central",
   "subseccion": "",
   "nombre": "Mediana ($n$ par)",
   "tex": "q_2 = \\dfrac{\\tilde x_{n/2} + \\tilde x_{n/2+1}}{2}",
   "cuando": "Centro robusto con cantidad par de datos: se promedian las dos observaciones centrales. Es también el caso h entero del criterio de percentiles.",
   "condiciones": [
    "Muestra ordenada de menor a mayor",
    "n par"
   ],
   "slug": "medidas-de-tendencia-central",
   "ancla": "",
   "tags": [
    "estadistica-descriptiva",
    "tendencia-central",
    "robusta"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-estadistica-descriptiva.md",
    "linea": 44,
    "tipo": "tabla"
   }
  },
  {
   "id": "dispersion--varianza-muestral",
   "unidad": "1",
   "seccion": "Dispersión",
   "subseccion": "",
   "nombre": "Varianza muestral",
   "tex": "s^2 = \\dfrac{1}{n-1}\\sum_{i=1}^n (x_i - \\bar{x})^2",
   "cuando": "Dispersión estándar de una muestra con datos individuales. Es la que pide el parcial cuando dice desvío muestral; el resultado se reporta luego como s.",
   "condiciones": [
    "Denominador n-1 (versión muestral, no n)",
    "Datos individuales",
    "Requiere haber calculado antes la media"
   ],
   "slug": "medidas-de-dispersion",
   "ancla": "varianza-muestral",
   "tags": [
    "estadistica-descriptiva",
    "dispersion",
    "varianza"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-estadistica-descriptiva.md",
    "linea": 54,
    "tipo": "tabla"
   }
  },
  {
   "id": "dispersion--desvio-estandar-muestral",
   "unidad": "1",
   "seccion": "Dispersión",
   "subseccion": "",
   "nombre": "Desvío estándar muestral",
   "tex": "s = \\sqrt{s^2}",
   "cuando": "Para reportar la dispersión en las mismas unidades que los datos, y como insumo de la asimetría, la curtosis y los intervalos de la forma media más o menos k por s.",
   "condiciones": [
    "s^2 calculado con denominador n-1"
   ],
   "slug": "medidas-de-dispersion",
   "ancla": "",
   "tags": [
    "estadistica-descriptiva",
    "dispersion"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-estadistica-descriptiva.md",
    "linea": 55,
    "tipo": "tabla"
   }
  },
  {
   "id": "dispersion--desvio-absoluto-medio",
   "unidad": "1",
   "seccion": "Dispersión",
   "subseccion": "",
   "nombre": "Desvío absoluto medio",
   "tex": "w = \\dfrac{1}{n}\\sum_{i=1}^n \\lvert x_i - \\bar{x}\\rvert",
   "cuando": "Alternativa a s que promedia distancias en valor absoluto en vez de cuadrados; aparece cuando el enunciado la pide explícitamente o para comparar con el MAD.",
   "condiciones": [
    "Denominador n (no n-1)",
    "Centrado en la media, no en la mediana"
   ],
   "slug": "medidas-de-dispersion",
   "ancla": "",
   "tags": [
    "estadistica-descriptiva",
    "dispersion"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-estadistica-descriptiva.md",
    "linea": 56,
    "tipo": "tabla"
   }
  },
  {
   "id": "dispersion--desviacion-absoluta-mediana-mad",
   "unidad": "1",
   "seccion": "Dispersión",
   "subseccion": "",
   "nombre": "Desviación absoluta mediana (MAD)",
   "tex": "\\text{MAD} = \\text{mediana}\\{\\lvert x_i - \\bar{x}\\rvert\\}",
   "cuando": "Dispersión robusta cuando la muestra tiene valores atípicos que inflan s y w.",
   "condiciones": [
    "Se toma la mediana de las desviaciones, no su promedio",
    "Robusta frente a outliers"
   ],
   "slug": "medidas-de-dispersion",
   "ancla": "",
   "tags": [
    "estadistica-descriptiva",
    "dispersion",
    "robusta"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-estadistica-descriptiva.md",
    "linea": 57,
    "tipo": "tabla"
   }
  },
  {
   "id": "dispersion--rango-intercuartilico",
   "unidad": "1",
   "seccion": "Dispersión",
   "subseccion": "",
   "nombre": "Rango intercuartílico",
   "tex": "\\text{IQR} = q_3 - q_1",
   "cuando": "Dispersión robusta del 50% central de los datos; es además el insumo obligatorio de las cercas de Tukey del boxplot.",
   "condiciones": [
    "Requiere q_1 y q_3 previamente calculados",
    "Robusto frente a outliers"
   ],
   "slug": "medidas-de-dispersion",
   "ancla": "rango-intercuartil-iqr",
   "tags": [
    "estadistica-descriptiva",
    "dispersion",
    "robusta",
    "boxplot"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-estadistica-descriptiva.md",
    "linea": 58,
    "tipo": "tabla"
   }
  },
  {
   "id": "cuartiles-y-percentiles--cuartil-definicion-por-posicion",
   "unidad": "1",
   "seccion": "Cuartiles y percentiles",
   "subseccion": "",
   "nombre": "Cuartil (definición por posición)",
   "tex": "\\text{el }j\\text{-ésimo cuartil es un }q_j \\in [\\tilde x_k, \\tilde x_{k+1}]\\text{ tal que }\\dfrac{k}{n} \\le j\\cdot 0.25 < \\dfrac{k+1}{n}",
   "cuando": "Para ubicar entre qué dos observaciones ordenadas cae el j-ésimo cuartil antes de aplicar cualquier criterio de compromiso o interpolación.",
   "condiciones": [
    "Muestra ordenada",
    "j = 1, 2, 3",
    "Cuando no se acumula la cantidad exacta hay ambigüedad: distintos softwares dan valores levemente distintos"
   ],
   "slug": "cuartiles-y-percentiles",
   "ancla": "",
   "tags": [
    "estadistica-descriptiva",
    "cuartiles",
    "posicion"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-estadistica-descriptiva.md",
    "linea": 68,
    "tipo": "vineta"
   }
  },
  {
   "id": "cuartiles-y-percentiles--posicion-del-percentil",
   "unidad": "1",
   "seccion": "Cuartiles y percentiles",
   "subseccion": "",
   "nombre": "Posición del percentil",
   "tex": "h = p \\cdot n",
   "cuando": "Primer paso del cálculo de cualquier percentil con datos individuales: h decide cuál de las dos ramas (entera o interpolada) se aplica.",
   "condiciones": [
    "p en (0,1)",
    "n = tamaño de la muestra",
    "Muestra ordenada"
   ],
   "slug": "cuartiles-y-percentiles",
   "ancla": "",
   "tags": [
    "estadistica-descriptiva",
    "percentiles",
    "interpolacion"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-estadistica-descriptiva.md",
    "linea": 69,
    "tipo": "vineta"
   }
  },
  {
   "id": "cuartiles-y-percentiles--percentil-entero-promedio-de-dos-ordenes",
   "unidad": "1",
   "seccion": "Cuartiles y percentiles",
   "subseccion": "",
   "nombre": "Percentil — $h$ entero (promedio de dos órdenes)",
   "tex": "\\text{percentil}_p = \\dfrac{\\tilde x_h + \\tilde x_{h+1}}{2}",
   "cuando": "Cuando p por n da un entero: se acumula una cantidad exacta de datos, hay dos posiciones en disputa y se promedian. Ejemplo típico: q_1 con n=60 (h=15).",
   "condiciones": [
    "h = p·n entero",
    "Muestra ordenada",
    "No es el límite de la otra rama: se trata aparte"
   ],
   "slug": "cuartiles-y-percentiles",
   "ancla": "",
   "tags": [
    "estadistica-descriptiva",
    "percentiles",
    "interpolacion"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-estadistica-descriptiva.md",
    "linea": 70,
    "tipo": "vineta"
   }
  },
  {
   "id": "cuartiles-y-percentiles--percentil-no-entero-interpolacion-con-y",
   "unidad": "1",
   "seccion": "Cuartiles y percentiles",
   "subseccion": "",
   "nombre": "Percentil — $h$ no entero (interpolación), con $k=\\lfloor h\\rfloor$ y $f=h-k$",
   "tex": "\\text{percentil}_p = \\tilde x_k + f\\,(\\tilde x_{k+1} - \\tilde x_k)",
   "cuando": "Caso general del percentil con datos individuales: se interpola linealmente entre las dos observaciones vecinas en proporción a la parte fraccionaria. Ejemplo del video: p_97 con n=60 da h=58.2, k=58, f=0.2.",
   "condiciones": [
    "h = p·n no entero",
    "Muestra ordenada",
    "No aplicarla a la mediana (p=0.5) con n impar: ahí prevalece la definición de mediana"
   ],
   "slug": "cuartiles-y-percentiles",
   "ancla": "",
   "tags": [
    "estadistica-descriptiva",
    "percentiles",
    "interpolacion",
    "parcial"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-estadistica-descriptiva.md",
    "linea": 71,
    "tipo": "vineta"
   }
  },
  {
   "id": "forma--coeficiente-de-asimetria",
   "unidad": "1",
   "seccion": "Forma",
   "subseccion": "",
   "nombre": "Coeficiente de asimetría",
   "tex": "\\gamma = \\dfrac{\\sum_{i=1}^n (x_i - \\bar{x})^3}{n\\, s^3}",
   "cuando": "Cuando piden describir la forma de la distribución: el signo indica hacia qué lado se estira la cola (positivo = sesgo a derecha).",
   "condiciones": [
    "Requiere media y desvío ya calculados",
    "Datos individuales (versión sin agrupar)",
    "Adimensional"
   ],
   "slug": "asimetria-y-curtosis",
   "ancla": "coeficiente-de-asimetría-simetría",
   "tags": [
    "estadistica-descriptiva",
    "forma",
    "asimetria"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-estadistica-descriptiva.md",
    "linea": 83,
    "tipo": "vineta"
   }
  },
  {
   "id": "forma--exceso-de-curtosis",
   "unidad": "1",
   "seccion": "Forma",
   "subseccion": "",
   "nombre": "Exceso de curtosis",
   "tex": "\\kappa = \\dfrac{\\sum_{i=1}^n (x_i - \\bar{x})^4}{n\\, s^4} - 3",
   "cuando": "Cuando piden comparar el peso de las colas contra la normal: el menos tres centra la referencia en la normal (mesocúrtica).",
   "condiciones": [
    "Requiere media y desvío ya calculados",
    "Normal implica kappa = 0; kappa > 0 leptocúrtica, kappa < 0 platicúrtica",
    "Datos individuales"
   ],
   "slug": "asimetria-y-curtosis",
   "ancla": "",
   "tags": [
    "estadistica-descriptiva",
    "forma",
    "curtosis"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-estadistica-descriptiva.md",
    "linea": 84,
    "tipo": "vineta"
   }
  },
  {
   "id": "datos-agrupados-formulas-ponderadas--marca-de-clase",
   "unidad": "1",
   "seccion": "Datos agrupados — fórmulas ponderadas",
   "subseccion": "",
   "nombre": "Marca de clase",
   "tex": "x_i = \\dfrac{L_i + L_{s,i}}{2}",
   "cuando": "Punto de partida de todo ejercicio de datos agrupados: es el valor que representa a todos los datos del intervalo cuando se perdieron las observaciones individuales.",
   "condiciones": [
    "Intervalo entre el límite inferior y el superior",
    "Supone reparto uniforme dentro del intervalo",
    "Vuelve aproximados todos los resultados que la usan"
   ],
   "slug": "datos-agrupados",
   "ancla": "",
   "tags": [
    "estadistica-descriptiva",
    "datos-agrupados"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-estadistica-descriptiva.md",
    "linea": 97,
    "tipo": "tabla"
   }
  },
  {
   "id": "datos-agrupados-formulas-ponderadas--media-agrupada",
   "unidad": "1",
   "seccion": "Datos agrupados — fórmulas ponderadas",
   "subseccion": "",
   "nombre": "Media agrupada",
   "tex": "\\bar x_{Ag} = \\dfrac{\\sum_{i=1}^L x_i f_i}{n}",
   "cuando": "Media cuando el enunciado da solo la tabla de frecuencias: se pondera cada marca de clase por su frecuencia.",
   "condiciones": [
    "n = suma de las f_i",
    "x_i = marca de clase del intervalo i",
    "Resultado aproximado"
   ],
   "slug": "datos-agrupados",
   "ancla": "",
   "tags": [
    "estadistica-descriptiva",
    "datos-agrupados",
    "tendencia-central"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-estadistica-descriptiva.md",
    "linea": 98,
    "tipo": "tabla"
   }
  },
  {
   "id": "datos-agrupados-formulas-ponderadas--desvio-agrupado",
   "unidad": "1",
   "seccion": "Datos agrupados — fórmulas ponderadas",
   "subseccion": "",
   "nombre": "Desvío agrupado",
   "tex": "s_{Ag} = \\sqrt{\\dfrac{\\sum_{i=1}^L (x_i - \\bar x_{Ag})^2 f_i}{n-1}}",
   "cuando": "Desvío muestral a partir de la tabla de frecuencias; es la versión ponderada de s y aparece en todo ejercicio de datos agrupados que pida dispersión.",
   "condiciones": [
    "Denominador n-1",
    "Requiere la media agrupada previamente calculada",
    "Resultado aproximado"
   ],
   "slug": "datos-agrupados",
   "ancla": "",
   "tags": [
    "estadistica-descriptiva",
    "datos-agrupados",
    "dispersion"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-estadistica-descriptiva.md",
    "linea": 99,
    "tipo": "tabla"
   }
  },
  {
   "id": "datos-agrupados-formulas-ponderadas--asimetria-agrupada",
   "unidad": "1",
   "seccion": "Datos agrupados — fórmulas ponderadas",
   "subseccion": "",
   "nombre": "Asimetría agrupada",
   "tex": "\\gamma_{Ag} = \\dfrac{\\sum (x_i - \\bar x_{Ag})^3 f_i}{n\\, s_{Ag}^3}",
   "cuando": "Forma de la distribución cuando solo se tiene la tabla de frecuencias. La única diferencia con la versión sin agrupar es el factor f_i dentro de la suma.",
   "condiciones": [
    "Requiere media y desvío agrupados",
    "Resultado aproximado"
   ],
   "slug": "datos-agrupados",
   "ancla": "",
   "tags": [
    "estadistica-descriptiva",
    "datos-agrupados",
    "asimetria"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-estadistica-descriptiva.md",
    "linea": 100,
    "tipo": "tabla"
   }
  },
  {
   "id": "datos-agrupados-formulas-ponderadas--curtosis-agrupada",
   "unidad": "1",
   "seccion": "Datos agrupados — fórmulas ponderadas",
   "subseccion": "",
   "nombre": "Curtosis agrupada",
   "tex": "\\kappa_{Ag} = \\dfrac{\\sum (x_i - \\bar x_{Ag})^4 f_i}{n\\, s_{Ag}^4} - 3",
   "cuando": "Peso de las colas a partir de la tabla de frecuencias; misma lectura que la curtosis sin agrupar (0 = como la normal).",
   "condiciones": [
    "Requiere media y desvío agrupados",
    "Resultado aproximado"
   ],
   "slug": "datos-agrupados",
   "ancla": "",
   "tags": [
    "estadistica-descriptiva",
    "datos-agrupados",
    "curtosis"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-estadistica-descriptiva.md",
    "linea": 101,
    "tipo": "tabla"
   }
  },
  {
   "id": "interpolacion-sobre-la-acumulada--cuartil-agrupado-por-interpolacion",
   "unidad": "1",
   "seccion": "Interpolación sobre la acumulada (datos agrupados)",
   "subseccion": "",
   "nombre": "Cuartil agrupado por interpolación",
   "tex": "q_{j,Ag} = L_i + \\dfrac{j\\cdot 0.25\\cdot n - F_{i-1}}{f_i}\\,(L_{s,i} - L_i)",
   "cuando": "Es el ejercicio típico de la unidad 1: dan una tabla de frecuencias y piden la mediana (j=2) o un cuartil. Se localiza el intervalo donde la acumulada cruza j por 0,25 por n y se interpola dentro de él.",
   "condiciones": [
    "F_{i-1} es la acumulada hasta el límite INFERIOR del intervalo elegido, no la absoluta",
    "f_i es la frecuencia del intervalo, no la acumulada",
    "Supone reparto uniforme dentro del intervalo"
   ],
   "slug": "tecnica-datos-agrupados-interpolacion",
   "ancla": "",
   "tags": [
    "estadistica-descriptiva",
    "datos-agrupados",
    "interpolacion",
    "parcial"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-estadistica-descriptiva.md",
    "linea": 109,
    "tipo": "vineta"
   }
  },
  {
   "id": "interpolacion-sobre-la-acumulada--acumulada-interpolada",
   "unidad": "1",
   "seccion": "Interpolación sobre la acumulada (datos agrupados)",
   "subseccion": "",
   "nombre": "Acumulada interpolada",
   "tex": "P(x) = F_{i-1} + (F_i - F_{i-1})\\,\\dfrac{x - L_i}{L_{s,i}-L_i}",
   "cuando": "Cuando hay que evaluar la frecuencia acumulada en un punto x que cae dentro de un intervalo: es la operación inversa del cuartil interpolado y el insumo de cualquier cálculo de proporciones.",
   "condiciones": [
    "x dentro del intervalo",
    "F_{i-1} y F_i son las acumuladas en los extremos del intervalo",
    "Interpolación lineal sobre el polígono de frecuencias acumuladas"
   ],
   "slug": "tecnica-datos-agrupados-interpolacion",
   "ancla": "",
   "tags": [
    "estadistica-descriptiva",
    "datos-agrupados",
    "interpolacion",
    "acumulada"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-estadistica-descriptiva.md",
    "linea": 110,
    "tipo": "vineta"
   }
  },
  {
   "id": "interpolacion-sobre-la-acumulada--moda-agrupada-forma-implicita",
   "unidad": "1",
   "seccion": "Interpolación sobre la acumulada (datos agrupados)",
   "subseccion": "",
   "nombre": "Moda agrupada — forma implícita",
   "tex": "(M - L_I)\\,(f_M - f_D) = (L_D - M)\\,(f_M - f_I)",
   "cuando": "Planteo de la moda por interpolación: iguala el exceso de frecuencia del intervalo modal repartido hacia cada vecino. Útil para plantear en el parcial antes de despejar M.",
   "condiciones": [
    "El intervalo modal es el de frecuencia máxima f_M",
    "f_I y f_D son las frecuencias de los intervalos vecinos izquierdo y derecho",
    "Corre la moda hacia el vecino más frecuente"
   ],
   "slug": "tecnica-datos-agrupados-interpolacion",
   "ancla": "",
   "tags": [
    "estadistica-descriptiva",
    "datos-agrupados",
    "moda"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-estadistica-descriptiva.md",
    "linea": 112,
    "tipo": "vineta"
   }
  },
  {
   "id": "interpolacion-sobre-la-acumulada--moda-agrupada-despejada",
   "unidad": "1",
   "seccion": "Interpolación sobre la acumulada (datos agrupados)",
   "subseccion": "",
   "nombre": "Moda agrupada — despejada",
   "tex": "M = \\dfrac{L_D\\,(f_M - f_I) + L_I\\,(f_M - f_D)}{(f_M - f_I) + (f_M - f_D)}",
   "cuando": "Valor numérico de la moda por interpolación en un ejercicio de datos agrupados. Es la fórmula que se aplica directamente una vez identificado el intervalo modal y sus vecinos.",
   "condiciones": [
    "Intervalo modal con frecuencia f_M",
    "Vecinos de frecuencias f_I (izquierda) y f_D (derecha)",
    "Si f_I = f_D la moda cae en el punto medio"
   ],
   "slug": "tecnica-datos-agrupados-interpolacion",
   "ancla": "",
   "tags": [
    "estadistica-descriptiva",
    "datos-agrupados",
    "moda",
    "parcial"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-estadistica-descriptiva.md",
    "linea": 113,
    "tipo": "vineta"
   }
  },
  {
   "id": "interpolacion-sobre-la-acumulada--moda-agrupada-convencion-del-punto-medio",
   "unidad": "1",
   "seccion": "Interpolación sobre la acumulada (datos agrupados)",
   "subseccion": "",
   "nombre": "Moda agrupada — convención del punto medio",
   "tex": "M = \\dfrac{L_I + L_D}{2}",
   "cuando": "Convención simple: la moda es la marca de clase del intervalo modal, sin mirar las frecuencias vecinas. Sirve como respuesta rápida o como control del resultado interpolado.",
   "condiciones": [
    "Intervalo modal entre L_I y L_D",
    "Ignora las frecuencias vecinas",
    "Convención alternativa a la interpolación: aclarar cuál se usó"
   ],
   "slug": "tecnica-datos-agrupados-interpolacion",
   "ancla": "",
   "tags": [
    "estadistica-descriptiva",
    "datos-agrupados",
    "moda"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-estadistica-descriptiva.md",
    "linea": 114,
    "tipo": "vineta"
   }
  },
  {
   "id": "boxplot-y-outliers--bigotes-cercas-de-tukey",
   "unidad": "1",
   "seccion": "Boxplot y outliers",
   "subseccion": "",
   "nombre": "Bigotes (cercas de Tukey)",
   "tex": "L_W = q_1 - 1.5\\cdot\\text{IQR}, \\qquad U_W = q_3 + 1.5\\cdot\\text{IQR}",
   "cuando": "Para detectar outliers y dibujar el boxplot: todo dato fuera del intervalo entre L_W y U_W se marca como atípico. Es la definición operativa de outlier que usa la materia.",
   "condiciones": [
    "Requiere q_1, q_3 e IQR",
    "El factor 1,5 es una convención",
    "Los bigotes dibujados no llegan hasta L_W y U_W: se detienen en el último dato real dentro del rango"
   ],
   "slug": "boxplot",
   "ancla": "",
   "tags": [
    "estadistica-descriptiva",
    "boxplot",
    "outliers",
    "parcial"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-estadistica-descriptiva.md",
    "linea": 123,
    "tipo": "vineta"
   }
  },
  {
   "id": "axiomas-y-consecuencias--cota-del-solape",
   "unidad": "2",
   "seccion": "Axiomas y consecuencias",
   "subseccion": "",
   "nombre": "Cota del solape",
   "tex": "\\max\\big(0,\\,P(A)+P(B)-1\\big)\\le P(A\\cap B)\\le\\min\\big(P(A),P(B)\\big)",
   "cuando": "En ejercicios que dan P(A) y P(B) y preguntan qué valores puede tomar la probabilidad de la intersección, o si cierta combinación de datos es posible.",
   "condiciones": [
    "A y B eventos del mismo espacio"
   ],
   "slug": "formulario-probabilidad",
   "ancla": "axiomas-y-consecuencias",
   "tags": [
    "probabilidad",
    "cotas",
    "interseccion"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-probabilidad.md",
    "linea": 35,
    "tipo": "tabla"
   }
  },
  {
   "id": "axiomas-y-consecuencias--de-morgan-probabilidades",
   "unidad": "2",
   "seccion": "Axiomas y consecuencias",
   "subseccion": "",
   "nombre": "De Morgan (probabilidades)",
   "tex": "P(\\overline{C}\\cap\\overline{D})=1-P(C\\cup D)\\text{ y }P(\\overline{C}\\cup\\overline{D})=1-P(C\\cap D)",
   "cuando": "Para traducir ninguno de los dos ocurre a un complemento de unión, que suele ser el dato que sí se tiene.",
   "condiciones": [
    "C y D eventos del mismo espacio"
   ],
   "slug": "formulario-probabilidad",
   "ancla": "axiomas-y-consecuencias",
   "tags": [
    "probabilidad",
    "de-morgan",
    "complemento"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-probabilidad.md",
    "linea": 37,
    "tipo": "parrafo"
   }
  },
  {
   "id": "conteo-lo-que-no--permutaciones-de-desarrollado",
   "unidad": "2",
   "seccion": "Conteo — lo que no está en la tabla básica",
   "subseccion": "",
   "nombre": "Permutaciones de $n$ (desarrollado)",
   "tex": "n!=n(n-1)(n-2)\\cdots 2\\cdot 1",
   "cuando": "Cuando hay que ordenar los n objetos completos; típicamente es el denominador (casos posibles) de los problemas de filas y ordenamientos.",
   "condiciones": [
    "los n objetos son distinguibles",
    "se usan todos"
   ],
   "slug": "distribucion-binomial",
   "ancla": "",
   "tags": [
    "conteo",
    "combinatoria",
    "permutaciones"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-probabilidad.md",
    "linea": 47,
    "tipo": "tabla"
   }
  },
  {
   "id": "conteo-lo-que-no--variaciones-desarrollado",
   "unidad": "2",
   "seccion": "Conteo — lo que no está en la tabla básica",
   "subseccion": "",
   "nombre": "Variaciones (desarrollado)",
   "tex": "\\dfrac{n!}{(n-r)!}=n(n-1)\\cdots(n-r+1)",
   "cuando": "Al elegir r de n cuando importa el orden y no hay repetición; la forma desarrollada es la que conviene para cancelar factoriales a mano.",
   "condiciones": [
    "importa el orden",
    "sin repetición",
    "r menor o igual que n"
   ],
   "slug": "distribucion-binomial",
   "ancla": "",
   "tags": [
    "conteo",
    "combinatoria",
    "variaciones"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-probabilidad.md",
    "linea": 48,
    "tipo": "tabla"
   }
  },
  {
   "id": "conteo-lo-que-no--combinaciones",
   "unidad": "2",
   "seccion": "Conteo — lo que no está en la tabla básica",
   "subseccion": "",
   "nombre": "Combinaciones",
   "tex": "\\dbinom{n}{r}=\\dfrac{n!}{r!\\,(n-r)!}",
   "cuando": "Al elegir r de n sin que importe el orden: manos de cartas, comités, muestras sin reposición.",
   "condiciones": [
    "no importa el orden",
    "sin repetición",
    "r entre 0 y n"
   ],
   "slug": "distribucion-binomial",
   "ancla": "",
   "tags": [
    "conteo",
    "combinatoria",
    "combinaciones"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-probabilidad.md",
    "linea": 49,
    "tipo": "tabla"
   }
  },
  {
   "id": "conteo-lo-que-no--con-repeticion-importa-el-orden",
   "unidad": "2",
   "seccion": "Conteo — lo que no está en la tabla básica",
   "subseccion": "",
   "nombre": "Con repetición, importa el orden",
   "tex": "n^{r}",
   "cuando": "Muestreo con reposición donde se registra el orden: contraseñas, tiradas sucesivas de un dado, cumpleaños asignados a personas.",
   "condiciones": [
    "importa el orden",
    "con repetición"
   ],
   "slug": "distribucion-binomial",
   "ancla": "",
   "tags": [
    "conteo",
    "combinatoria",
    "reposicion"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-probabilidad.md",
    "linea": 50,
    "tipo": "tabla"
   }
  },
  {
   "id": "conteo-lo-que-no--con-repeticion-no-importa-el-orden",
   "unidad": "2",
   "seccion": "Conteo — lo que no está en la tabla básica",
   "subseccion": "",
   "nombre": "Con repetición, no importa el orden",
   "tex": "\\dbinom{n+r-1}{r}",
   "cuando": "Reparto de r objetos idénticos en n categorías (esquema de barras y estrellas).",
   "condiciones": [
    "no importa el orden",
    "con repetición"
   ],
   "slug": "distribucion-binomial",
   "ancla": "",
   "tags": [
    "conteo",
    "combinatoria",
    "reposicion"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-probabilidad.md",
    "linea": 51,
    "tipo": "tabla"
   }
  },
  {
   "id": "conteo-lo-que-no--inclusion-exclusion-general",
   "unidad": "2",
   "seccion": "Conteo — lo que no está en la tabla básica",
   "subseccion": "",
   "nombre": "Inclusión–exclusión general",
   "tex": "\\left|\\bigcup_{i=1}^{n} A_i\\right| = \\sum_i |A_i| - \\sum_{i<j}|A_i\\cap A_j| + \\sum_{i<j<k}|A_i\\cap A_j\\cap A_k| - \\cdots + (-1)^{n+1}\\left|A_1\\cap\\cdots\\cap A_n\\right|.",
   "cuando": "Cuando hay que contar la unión de tres o más conjuntos que se solapan y el complemento no simplifica. El mismo esquema vale cambiando el cardinal por la probabilidad.",
   "condiciones": [
    "subconjuntos de un mismo universo finito",
    "para probabilidades, eventos del mismo espacio"
   ],
   "slug": "distribucion-binomial",
   "ancla": "",
   "tags": [
    "conteo",
    "inclusion-exclusion",
    "union"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-probabilidad.md",
    "linea": 54,
    "tipo": "bloque"
   }
  },
  {
   "id": "conteo-lo-que-no--identidad-alternante",
   "unidad": "2",
   "seccion": "Conteo — lo que no está en la tabla básica",
   "subseccion": "",
   "nombre": "Identidad alternante",
   "tex": "\\displaystyle\\sum_{k=0}^{n}(-1)^k\\binom{n}{k}=0",
   "cuando": "Para cerrar sumas alternadas de números combinatorios que aparecen al aplicar inclusión-exclusión sobre n conjuntos simétricos.",
   "condiciones": [
    "n mayor o igual que 1"
   ],
   "slug": "distribucion-binomial",
   "ancla": "",
   "tags": [
    "combinatoria",
    "identidades"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-probabilidad.md",
    "linea": 57,
    "tipo": "vineta"
   }
  },
  {
   "id": "conteo-lo-que-no--binomio-de-newton",
   "unidad": "2",
   "seccion": "Conteo — lo que no está en la tabla básica",
   "subseccion": "",
   "nombre": "Binomio de Newton",
   "tex": "\\displaystyle(x+y)^n=\\sum_{k=0}^{n}\\binom{n}{k}x^k y^{n-k}",
   "cuando": "Para verificar que las probabilidades de una binomial suman 1 y para simplificar sumas de términos binomiales.",
   "condiciones": [
    "n entero no negativo"
   ],
   "slug": "distribucion-binomial",
   "ancla": "",
   "tags": [
    "combinatoria",
    "identidades",
    "binomial"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-probabilidad.md",
    "linea": 58,
    "tipo": "vineta"
   }
  },
  {
   "id": "conteo-lo-que-no--regla-del-palomar-forma-general",
   "unidad": "2",
   "seccion": "Conteo — lo que no está en la tabla básica",
   "subseccion": "",
   "nombre": "Regla del palomar (forma general)",
   "tex": "n=km+1 \\Rightarrow \\exists\\, j:\\ |A_j|\\ge k+1\\text{, con }n\\text{ objetos repartidos en }m\\text{ conjuntos }A_1,\\dots,A_m",
   "cuando": "En ejercicios de existencia (demuestre que al menos dos comparten...) donde no hay que calcular una probabilidad sino garantizar una coincidencia.",
   "condiciones": [
    "n objetos repartidos en m conjuntos",
    "k mayor o igual que 1"
   ],
   "slug": "distribucion-binomial",
   "ancla": "",
   "tags": [
    "conteo",
    "palomar",
    "existencia"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-probabilidad.md",
    "linea": 59,
    "tipo": "vineta"
   }
  },
  {
   "id": "conteo-lo-que-no--muestreo-con-reposicion-vs-sin-reposicion",
   "unidad": "2",
   "seccion": "Conteo — lo que no está en la tabla básica",
   "subseccion": "",
   "nombre": "Muestreo con reposición vs. sin reposición",
   "tex": "\\text{si }N,\\,R,\\,N-R\\gg n\\text{, entonces }\\dfrac{\\binom{R}{k}\\binom{N-R}{n-k}}{\\binom{N}{n}}\\approx\\binom{n}{k}p^k(1-p)^{n-k}\\text{ con }p=R/N",
   "cuando": "Cuando el enunciado extrae sin reposición de una población grande y conviene aproximar por binomial para no arrastrar factoriales enormes.",
   "condiciones": [
    "población mucho mayor que la muestra",
    "p igual a R sobre N"
   ],
   "slug": "distribucion-binomial",
   "ancla": "",
   "tags": [
    "conteo",
    "muestreo",
    "aproximacion",
    "binomial"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-probabilidad.md",
    "linea": 60,
    "tipo": "vineta"
   }
  },
  {
   "id": "condicional-arbol-y-regla--regla-del-producto-camino-del-arbol",
   "unidad": "2",
   "seccion": "Condicional, árbol y regla del producto",
   "subseccion": "",
   "nombre": "Regla del producto (camino del árbol)",
   "tex": "P(A\\cap B)=P(A)\\,P(B\\mid A)",
   "cuando": "Al recorrer un árbol de etapas: la probabilidad de una hoja es el producto de las etiquetas del camino desde la raíz.",
   "condiciones": [
    "P(A) distinta de cero",
    "etapas ordenadas: A ocurre antes que B en el árbol"
   ],
   "slug": "formulario-probabilidad",
   "ancla": "condicional-árbol-y-regla-del-producto",
   "tags": [
    "probabilidad",
    "arbol",
    "producto",
    "etapas"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-probabilidad.md",
    "linea": 68,
    "tipo": "tabla"
   }
  },
  {
   "id": "condicional-arbol-y-regla--aristas-de-un-nodo-regla-3",
   "unidad": "2",
   "seccion": "Condicional, árbol y regla del producto",
   "subseccion": "",
   "nombre": "Aristas de un nodo (regla 3 del árbol)",
   "tex": "\\sum_k P(H_k\\mid A)=1\\text{, con }\\{H_k\\}\\text{ los hijos de }A",
   "cuando": "Control de consistencia al construir un árbol: si las aristas que salen de un nodo no suman 1, falta una rama o hay un dato mal leído.",
   "condiciones": [
    "los hijos del nodo forman una partición",
    "P(A) distinta de cero"
   ],
   "slug": "formulario-probabilidad",
   "ancla": "condicional-árbol-y-regla-del-producto",
   "tags": [
    "probabilidad",
    "arbol",
    "particion"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-probabilidad.md",
    "linea": 69,
    "tipo": "tabla"
   }
  },
  {
   "id": "probabilidad-total-y-bayes--particion",
   "unidad": "2",
   "seccion": "Probabilidad total y Bayes",
   "subseccion": "",
   "nombre": "Partición",
   "tex": "A_k\\cap A_j=\\emptyset\\text{ (}k\\neq j\\text{) y }S=\\bigcup_k A_k\\text{; el caso simple es }\\{A,A^c\\}",
   "cuando": "Es la hipótesis que hay que verificar antes de aplicar probabilidad total o Bayes; el caso más usado en parciales es la pareja de un evento y su complemento.",
   "condiciones": [
    "los conjuntos son mutuamente excluyentes",
    "cubren todo el espacio muestral"
   ],
   "slug": "probabilidad-total-y-bayes",
   "ancla": "partición",
   "tags": [
    "probabilidad",
    "particion",
    "bayes"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-probabilidad.md",
    "linea": 73,
    "tipo": "parrafo"
   }
  },
  {
   "id": "probabilidad-total-y-bayes--bayes-particion-binaria",
   "unidad": "2",
   "seccion": "Probabilidad total y Bayes",
   "subseccion": "",
   "nombre": "Bayes — partición binaria",
   "tex": "P(A\\mid B)=\\frac{P(B\\mid A)\\,P(A)}{P(B\\mid A)\\,P(A)+P(B\\mid A^c)\\,P(A^c)}.",
   "cuando": "Forma que sale en los problemas de test diagnóstico: prevalencia, sensibilidad y especificidad dadas, y piden el valor predictivo positivo.",
   "condiciones": [
    "partición formada por el evento y su complemento",
    "P(A) estrictamente entre 0 y 1",
    "P(B) distinta de cero"
   ],
   "slug": "probabilidad-total-y-bayes",
   "ancla": "",
   "tags": [
    "probabilidad",
    "bayes",
    "diagnostico"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-probabilidad.md",
    "linea": 82,
    "tipo": "bloque"
   }
  },
  {
   "id": "independencia-consecuencias--definicion",
   "unidad": "2",
   "seccion": "Independencia — consecuencias",
   "subseccion": "",
   "nombre": "Definición",
   "tex": "A,B\\ \\text{indep.}\\iff P(A\\cap B)=P(A)\\,P(B)",
   "cuando": "Cuando el enunciado declara independencia, o cuando hay que verificarla con los tres números dados.",
   "condiciones": [
    "A y B eventos del mismo espacio"
   ],
   "slug": "formulario-probabilidad",
   "ancla": "independencia-consecuencias",
   "tags": [
    "probabilidad",
    "independencia"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-probabilidad.md",
    "linea": 88,
    "tipo": "tabla"
   }
  },
  {
   "id": "independencia-consecuencias--caracterizacion-por-la-condicional",
   "unidad": "2",
   "seccion": "Independencia — consecuencias",
   "subseccion": "",
   "nombre": "Caracterización por la condicional",
   "tex": "P(D\\mid C)=P(D)\\quad (P(C)\\neq 0)",
   "cuando": "Para decidir si dos eventos son independientes cuando el dato disponible es una condicional y no una intersección.",
   "condiciones": [
    "la probabilidad del condicionante debe ser distinta de cero"
   ],
   "slug": "formulario-probabilidad",
   "ancla": "independencia-consecuencias",
   "tags": [
    "probabilidad",
    "independencia",
    "condicional"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-probabilidad.md",
    "linea": 89,
    "tipo": "tabla"
   }
  },
  {
   "id": "independencia-consecuencias--coleccion-de-eventos",
   "unidad": "2",
   "seccion": "Independencia — consecuencias",
   "subseccion": "",
   "nombre": "Colección de eventos",
   "tex": "P\\!\\left(\\bigcap_k A_k\\right)=\\prod_k P(A_k)",
   "cuando": "Con varios ensayos o componentes independientes: la intersección de todos es el producto.",
   "condiciones": [
    "independencia de toda la colección; no basta la independencia de a pares"
   ],
   "slug": "formulario-probabilidad",
   "ancla": "independencia-consecuencias",
   "tags": [
    "probabilidad",
    "independencia",
    "producto"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-probabilidad.md",
    "linea": 90,
    "tipo": "tabla"
   }
  },
  {
   "id": "independencia-consecuencias--complemento-a-la-derecha",
   "unidad": "2",
   "seccion": "Independencia — consecuencias",
   "subseccion": "",
   "nombre": "Complemento a la derecha",
   "tex": "P(A\\cap\\bar B)=P(A)\\,P(\\bar B)",
   "cuando": "En exactamente uno acierta y en general al mezclar aciertos y fallas de eventos independientes: los complementos siguen siendo independientes.",
   "condiciones": [
    "A y B independientes"
   ],
   "slug": "formulario-probabilidad",
   "ancla": "independencia-consecuencias",
   "tags": [
    "probabilidad",
    "independencia",
    "complemento"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-probabilidad.md",
    "linea": 91,
    "tipo": "tabla"
   }
  },
  {
   "id": "independencia-consecuencias--complemento-a-la-izquierda",
   "unidad": "2",
   "seccion": "Independencia — consecuencias",
   "subseccion": "",
   "nombre": "Complemento a la izquierda",
   "tex": "P(\\bar A\\cap B)=P(\\bar A)\\,P(B)",
   "cuando": "Segunda pareja del mismo patrón: se usa junto con la anterior para armar exactamente uno de los dos.",
   "condiciones": [
    "A y B independientes"
   ],
   "slug": "formulario-probabilidad",
   "ancla": "independencia-consecuencias",
   "tags": [
    "probabilidad",
    "independencia",
    "complemento"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-probabilidad.md",
    "linea": 92,
    "tipo": "tabla"
   }
  },
  {
   "id": "independencia-consecuencias--ambos-complementos",
   "unidad": "2",
   "seccion": "Independencia — consecuencias",
   "subseccion": "",
   "nombre": "Ambos complementos",
   "tex": "P(\\bar A\\cap\\bar B)=P(\\bar A)\\,P(\\bar B)",
   "cuando": "Para ninguno de los dos ocurre con eventos independientes; es la base del cálculo de sistemas en paralelo.",
   "condiciones": [
    "A y B independientes"
   ],
   "slug": "formulario-probabilidad",
   "ancla": "independencia-consecuencias",
   "tags": [
    "probabilidad",
    "independencia",
    "complemento"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-probabilidad.md",
    "linea": 93,
    "tipo": "tabla"
   }
  },
  {
   "id": "independencia-consecuencias--deduccion-del-complemento",
   "unidad": "2",
   "seccion": "Independencia — consecuencias",
   "subseccion": "",
   "nombre": "Deducción del complemento",
   "tex": "P(A\\cap\\bar B)=P(A)-P(A)P(B)=P(A)\\big(1-P(B)\\big)",
   "cuando": "Cuando en un parcial teórico piden demostrar que la independencia se hereda a los complementos.",
   "condiciones": [
    "A y B independientes"
   ],
   "slug": "formulario-probabilidad",
   "ancla": "independencia-consecuencias",
   "tags": [
    "probabilidad",
    "independencia",
    "demostracion"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-probabilidad.md",
    "linea": 94,
    "tipo": "tabla"
   }
  },
  {
   "id": "independencia-consecuencias--union-de-independientes",
   "unidad": "2",
   "seccion": "Independencia — consecuencias",
   "subseccion": "",
   "nombre": "Unión de independientes",
   "tex": "P(A\\cup B)=P(A)+P(B)-P(A)\\,P(B)",
   "cuando": "Ejercicio clásico: dan P(A) y la probabilidad de la unión y piden P(B) bajo el supuesto de independencia; da distinto que bajo el supuesto de mutuamente excluyentes.",
   "condiciones": [
    "A y B independientes"
   ],
   "slug": "formulario-probabilidad",
   "ancla": "independencia-consecuencias",
   "tags": [
    "probabilidad",
    "independencia",
    "union"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-probabilidad.md",
    "linea": 95,
    "tipo": "tabla"
   }
  },
  {
   "id": "independencia-consecuencias--independiente-de-todo",
   "unidad": "2",
   "seccion": "Independencia — consecuencias",
   "subseccion": "",
   "nombre": "$\\emptyset$ independiente de todo",
   "tex": "P(A\\cap\\emptyset)=0=P(A)\\cdot 0",
   "cuando": "Caso límite que se cita al discutir si mutuamente excluyente implica dependiente: el vacío es la excepción.",
   "condiciones": [
    "vale para cualquier evento A"
   ],
   "slug": "formulario-probabilidad",
   "ancla": "independencia-consecuencias",
   "tags": [
    "probabilidad",
    "independencia",
    "casos-limite"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-probabilidad.md",
    "linea": 96,
    "tipo": "tabla"
   }
  },
  {
   "id": "independencia-consecuencias--independiente-de-todo-2",
   "unidad": "2",
   "seccion": "Independencia — consecuencias",
   "subseccion": "",
   "nombre": "$S$ independiente de todo",
   "tex": "P(A\\cap S)=P(A)=P(A)\\cdot 1",
   "cuando": "El otro caso límite: el suceso seguro es independiente de cualquier evento.",
   "condiciones": [
    "vale para cualquier evento A"
   ],
   "slug": "formulario-probabilidad",
   "ancla": "independencia-consecuencias",
   "tags": [
    "probabilidad",
    "independencia",
    "casos-limite"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-probabilidad.md",
    "linea": 97,
    "tipo": "tabla"
   }
  },
  {
   "id": "fiabilidad-de-sistemas--serie-componentes",
   "unidad": "2",
   "seccion": "Fiabilidad de sistemas",
   "subseccion": "",
   "nombre": "Serie ($n$ componentes)",
   "tex": "P_{\\text{serie}}=\\displaystyle\\prod_{i=1}^{n} p_i",
   "cuando": "Circuito o cadena donde todos los componentes deben funcionar para que el sistema funcione.",
   "condiciones": [
    "componentes independientes",
    "p_i es la probabilidad de que el componente i funcione"
   ],
   "slug": "independencia",
   "ancla": "",
   "tags": [
    "fiabilidad",
    "independencia",
    "serie"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-probabilidad.md",
    "linea": 108,
    "tipo": "vineta"
   }
  },
  {
   "id": "fiabilidad-de-sistemas--paralelo-componentes",
   "unidad": "2",
   "seccion": "Fiabilidad de sistemas",
   "subseccion": "",
   "nombre": "Paralelo ($n$ componentes)",
   "tex": "P_{\\text{par}}=1-\\displaystyle\\prod_{i=1}^{n}(1-p_i)",
   "cuando": "Redundancia: basta con que uno de los n componentes funcione. Se calcula por complemento de que fallen todos.",
   "condiciones": [
    "componentes independientes",
    "p_i es la probabilidad de que el componente i funcione"
   ],
   "slug": "independencia",
   "ancla": "",
   "tags": [
    "fiabilidad",
    "independencia",
    "paralelo",
    "complemento"
   ],
   "esencial": true,
   "origen": {
    "archivo": "wiki/formularios/formulario-probabilidad.md",
    "linea": 109,
    "tipo": "vineta"
   }
  },
  {
   "id": "fiabilidad-de-sistemas--dos-ramas-de-a-dos-en",
   "unidad": "2",
   "seccion": "Fiabilidad de sistemas",
   "subseccion": "",
   "nombre": "Dos ramas de a dos, en paralelo (caso del TP2)",
   "tex": "P=1-\\left(1-p^2\\right)^2",
   "cuando": "Configuración del TP2 ejercicio 20: dos ramas de dos contactos en serie, conectadas en paralelo entre sí. Sirve para cuantificar cuánto baja la falla al duplicar la rama.",
   "condiciones": [
    "cuatro componentes independientes",
    "todos con la misma probabilidad p de funcionar"
   ],
   "slug": "independencia",
   "ancla": "",
   "tags": [
    "fiabilidad",
    "serie",
    "paralelo",
    "tp2"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-probabilidad.md",
    "linea": 110,
    "tipo": "vineta"
   }
  },
  {
   "id": "patrones-clasicos--problema-del-cumpleanos",
   "unidad": "2",
   "seccion": "Patrones clásicos",
   "subseccion": "",
   "nombre": "Problema del cumpleaños",
   "tex": "P(\\text{al menos 2 iguales})=1-\\dfrac{365\\cdot 364\\cdots (365-n+1)}{365^{\\,n}}",
   "cuando": "Patrón de coincidencias: se resuelve por complemento (todos distintos), variaciones sin repetición sobre muestreo con repetición.",
   "condiciones": [
    "365 días equiprobables",
    "sin años bisiestos",
    "cumpleaños independientes entre personas",
    "n menor o igual que 365"
   ],
   "slug": "formulario-probabilidad",
   "ancla": "patrones-clásicos",
   "tags": [
    "conteo",
    "complemento",
    "coincidencias"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-probabilidad.md",
    "linea": 114,
    "tipo": "vineta"
   }
  },
  {
   "id": "patrones-clasicos--al-menos-uno-en-ensayos-independientes",
   "unidad": "2",
   "seccion": "Patrones clásicos",
   "subseccion": "",
   "nombre": "\"Al menos uno\" en $n$ ensayos independientes de probabilidad $p$",
   "tex": "P=1-(1-p)^{n}",
   "cuando": "Cuando piden la probabilidad de al menos un éxito en n repeticiones idénticas e independientes, o el n mínimo para superar cierta confianza.",
   "condiciones": [
    "ensayos independientes",
    "misma probabilidad p en cada ensayo"
   ],
   "slug": "formulario-probabilidad",
   "ancla": "patrones-clásicos",
   "tags": [
    "probabilidad",
    "independencia",
    "complemento"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-probabilidad.md",
    "linea": 115,
    "tipo": "vineta"
   }
  },
  {
   "id": "general-v-a-d--pmf",
   "unidad": "3",
   "seccion": "General (v.a.d.)",
   "subseccion": "",
   "nombre": "PMF",
   "tex": "p_X(k)=P(X=k)\\text{, con }p_X\\ge 0\\text{ y }\\sum_{k\\in\\mathcal{R}_X}p_X(k)=1",
   "cuando": "Punto de partida de todo ejercicio de v.a. discreta: define la distribución y da la condición de normalización con la que se despeja una constante desconocida.",
   "condiciones": [
    "X discreta con recorrido contable",
    "la masa vale cero fuera del recorrido"
   ],
   "slug": "formulario-va-discretas",
   "ancla": "general-vad",
   "tags": [
    "discreta",
    "pmf",
    "normalizacion"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-va-discretas.md",
    "linea": 28,
    "tipo": "tabla"
   }
  },
  {
   "id": "general-v-a-d--fda",
   "unidad": "3",
   "seccion": "General (v.a.d.)",
   "subseccion": "",
   "nombre": "FDA",
   "tex": "F_X(k)=P(X\\le k)=\\sum_{y\\in\\mathcal{R}_X,\\,y\\le k}p_X(y)",
   "cuando": "Cuando el enunciado pide una probabilidad acumulada o da la FDA escalonada en vez de la PMF.",
   "condiciones": [
    "X discreta",
    "la FDA es escalonada y continua a derecha"
   ],
   "slug": "formulario-va-discretas",
   "ancla": "general-vad",
   "tags": [
    "discreta",
    "fda"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-va-discretas.md",
    "linea": 29,
    "tipo": "tabla"
   }
  },
  {
   "id": "general-v-a-d--pmf-desde-la-fda",
   "unidad": "3",
   "seccion": "General (v.a.d.)",
   "subseccion": "",
   "nombre": "PMF desde la FDA",
   "tex": "p_X(k)=F_X(k)-\\lim_{x\\to k^-}F_X(x)",
   "cuando": "Para recuperar la masa puntual cuando el dato del parcial es la FDA escalonada: cada salto es una probabilidad puntual.",
   "condiciones": [
    "X discreta",
    "el límite se toma por izquierda"
   ],
   "slug": "formulario-va-discretas",
   "ancla": "general-vad",
   "tags": [
    "discreta",
    "fda",
    "pmf"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-va-discretas.md",
    "linea": 30,
    "tipo": "tabla"
   }
  },
  {
   "id": "general-v-a-d--probabilidades-de-intervalo",
   "unidad": "3",
   "seccion": "General (v.a.d.)",
   "subseccion": "",
   "nombre": "Probabilidades de intervalo",
   "tex": "P(a<X\\le b)=F_X(b)-F_X(a)\\text{, }P(X>k)=1-F_X(k)\\text{, }P(X<k)=F_X(k)-p_X(k)",
   "cuando": "Cada vez que hay que traducir un enunciado (más de, a lo sumo, entre) a la FDA; en discretas el estricto y el no estricto difieren en la masa puntual.",
   "condiciones": [
    "X discreta",
    "atención al menor estricto frente al menor o igual: se separan por la masa puntual"
   ],
   "slug": "formulario-va-discretas",
   "ancla": "general-vad",
   "tags": [
    "discreta",
    "fda",
    "intervalos"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-va-discretas.md",
    "linea": 31,
    "tipo": "tabla"
   }
  },
  {
   "id": "general-v-a-d--linealidad-de-la-esperanza",
   "unidad": "3",
   "seccion": "General (v.a.d.)",
   "subseccion": "",
   "nombre": "Linealidad de la esperanza",
   "tex": "E[aX+bY+c]=a\\,E[X]+b\\,E[Y]+c",
   "cuando": "Para partir una ganancia o un total en sumandos simples; vale aunque las variables no sean independientes, lo que la hace la herramienta más barata de la unidad.",
   "condiciones": [
    "a, b y c constantes",
    "no requiere independencia",
    "en general la esperanza del producto no es el producto de las esperanzas"
   ],
   "slug": "formulario-va-discretas",
   "ancla": "general-vad",
   "tags": [
    "esperanza",
    "linealidad"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-va-discretas.md",
    "linea": 34,
    "tipo": "tabla"
   }
  },
  {
   "id": "general-v-a-d--varianza",
   "unidad": "3",
   "seccion": "General (v.a.d.)",
   "subseccion": "",
   "nombre": "Varianza",
   "tex": "V(X)=\\sigma_X^2=E[X^2]-\\big(E[X]\\big)^2",
   "cuando": "Forma de cálculo habitual de la varianza: casi siempre sale más rápido que la definición con el momento centrado.",
   "condiciones": [
    "el momento de segundo orden debe existir"
   ],
   "slug": "varianza",
   "ancla": "",
   "tags": [
    "discreta",
    "varianza",
    "momentos"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-va-discretas.md",
    "linea": 35,
    "tipo": "tabla"
   }
  },
  {
   "id": "general-v-a-d--varianza-de-una-transformacion-afin",
   "unidad": "3",
   "seccion": "General (v.a.d.)",
   "subseccion": "",
   "nombre": "Varianza de una transformación afín",
   "tex": "V(aX+c)=a^2\\,V(X)\\text{, }\\;\\sigma(aX+c)=\\lvert a\\rvert\\,\\sigma(X)",
   "cuando": "Cuando el enunciado cambia de unidades o desplaza el origen: el desplazamiento no afecta la dispersión y la escala entra al cuadrado.",
   "condiciones": [
    "a y c constantes",
    "sin independencia, la varianza de la suma no es la suma de varianzas"
   ],
   "slug": "formulario-va-discretas",
   "ancla": "general-vad",
   "tags": [
    "varianza",
    "transformacion-afin"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-va-discretas.md",
    "linea": 36,
    "tipo": "tabla"
   }
  },
  {
   "id": "general-v-a-d--momento-de-orden",
   "unidad": "3",
   "seccion": "General (v.a.d.)",
   "subseccion": "",
   "nombre": "Momento de orden $k$",
   "tex": "E[X^k]=\\sum_{x}x^k\\,p_X(x)",
   "cuando": "Insumo de la varianza (orden 2) y de los coeficientes de asimetría y curtosis (órdenes 3 y 4).",
   "condiciones": [
    "la serie debe converger absolutamente"
   ],
   "slug": "formulario-va-discretas",
   "ancla": "general-vad",
   "tags": [
    "momentos",
    "discreta"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-va-discretas.md",
    "linea": 37,
    "tipo": "tabla"
   }
  },
  {
   "id": "general-v-a-d--fgm",
   "unidad": "3",
   "seccion": "General (v.a.d.)",
   "subseccion": "",
   "nombre": "FGM",
   "tex": "M_X(t)=E\\big[e^{tX}\\big]=\\sum_{k\\in\\mathcal{R}_X}e^{tk}\\,p_X(k)",
   "cuando": "Para identificar una distribución por su función generadora o para obtener momentos derivando en cero.",
   "condiciones": [
    "debe existir en un entorno de cero",
    "caracteriza la distribución de forma unívoca"
   ],
   "slug": "formulario-va-discretas",
   "ancla": "general-vad",
   "tags": [
    "fgm",
    "momentos"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-va-discretas.md",
    "linea": 38,
    "tipo": "tabla"
   }
  },
  {
   "id": "general-v-a-d--momentos-via-fgm",
   "unidad": "3",
   "seccion": "General (v.a.d.)",
   "subseccion": "",
   "nombre": "Momentos vía FGM",
   "tex": "E[X^k]=M_X^{(k)}(0)\\text{, }\\;V(X)=M_X''(0)-\\big(M_X'(0)\\big)^2",
   "cuando": "Cuando el ejercicio da la FGM en vez de la PMF: derivar dos veces y evaluar en cero es más rápido que sumar la serie.",
   "condiciones": [
    "la FGM debe existir en un entorno de cero"
   ],
   "slug": "formulario-va-discretas",
   "ancla": "general-vad",
   "tags": [
    "fgm",
    "momentos",
    "varianza"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-va-discretas.md",
    "linea": 39,
    "tipo": "tabla"
   }
  },
  {
   "id": "geometrica-y-binomial-negativa--geometrica-fracasos-pmf",
   "unidad": "3",
   "seccion": "Geométrica y binomial negativa — las dos convenciones",
   "subseccion": "",
   "nombre": "Geométrica — fracasos: PMF",
   "tex": "p_X(k)=q^{\\,k}\\,p,\\qquad k\\in\\mathbb{N}_0",
   "cuando": "Convención por defecto de la cátedra: la variable cuenta los fracasos previos al primer éxito. Se usa cuando el enunciado pregunta cuántas fallas antes de.",
   "condiciones": [
    "ensayos Bernoulli independientes con p constante",
    "q es el complemento de p",
    "soporte que incluye el cero"
   ],
   "slug": "formulario-va-discretas",
   "ancla": "geométrica-y-binomial-negativa-las-dos-convenciones",
   "tags": [
    "geometrica",
    "discreta",
    "pmf",
    "convencion"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-va-discretas.md",
    "linea": 51,
    "tipo": "tabla"
   }
  },
  {
   "id": "geometrica-y-binomial-negativa--geometrica-fracasos-esperanza",
   "unidad": "3",
   "seccion": "Geométrica y binomial negativa — las dos convenciones",
   "subseccion": "",
   "nombre": "Geométrica — fracasos: esperanza",
   "tex": "E[X]=\\dfrac{q}{p}",
   "cuando": "Número medio de fracasos antes del primer éxito, en la convención de la cátedra.",
   "condiciones": [
    "la variable cuenta fracasos, soporte con el cero",
    "q es el complemento de p"
   ],
   "slug": "formulario-va-discretas",
   "ancla": "geométrica-y-binomial-negativa-las-dos-convenciones",
   "tags": [
    "geometrica",
    "esperanza",
    "convencion"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-va-discretas.md",
    "linea": 52,
    "tipo": "tabla"
   }
  },
  {
   "id": "geometrica-y-binomial-negativa--geometrica-fracasos-varianza",
   "unidad": "3",
   "seccion": "Geométrica y binomial negativa — las dos convenciones",
   "subseccion": "",
   "nombre": "Geométrica — fracasos: varianza",
   "tex": "V(X)=\\dfrac{q}{p^2}",
   "cuando": "Dispersión de la espera hasta el primer éxito; coincide en las dos convenciones, porque difieren en un corrimiento constante.",
   "condiciones": [
    "la variable cuenta fracasos",
    "q es el complemento de p"
   ],
   "slug": "formulario-va-discretas",
   "ancla": "geométrica-y-binomial-negativa-las-dos-convenciones",
   "tags": [
    "geometrica",
    "varianza",
    "convencion"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-va-discretas.md",
    "linea": 53,
    "tipo": "tabla"
   }
  },
  {
   "id": "geometrica-y-binomial-negativa--geometrica-fracasos-cola",
   "unidad": "3",
   "seccion": "Geométrica y binomial negativa — las dos convenciones",
   "subseccion": "",
   "nombre": "Geométrica — fracasos: cola",
   "tex": "P(X\\ge m)=q^{\\,m}",
   "cuando": "Traduce directamente que los primeros m ensayos fallaron sin sumar la serie; es el paso previo a la falta de memoria.",
   "condiciones": [
    "geométrica sobre fracasos",
    "m entero no negativo"
   ],
   "slug": "formulario-va-discretas",
   "ancla": "geométrica-y-binomial-negativa-las-dos-convenciones",
   "tags": [
    "geometrica",
    "cola",
    "discreta"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-va-discretas.md",
    "linea": 54,
    "tipo": "tabla"
   }
  },
  {
   "id": "geometrica-y-binomial-negativa--geometrica-ensayos-pmf",
   "unidad": "3",
   "seccion": "Geométrica y binomial negativa — las dos convenciones",
   "subseccion": "",
   "nombre": "Geométrica — ensayos: PMF",
   "tex": "p_Y(k)=q^{\\,k-1}\\,p,\\qquad k\\in\\mathbb{N}=\\{1,2,\\dots\\}",
   "cuando": "Convención de las slides de la cátedra (ejemplo del casino): la variable cuenta los ensayos hasta el primer éxito, incluido el del éxito. Se usa cuando el enunciado pide cuántos intentos, apuestas o personas.",
   "condiciones": [
    "ensayos Bernoulli independientes con p constante",
    "q es el complemento de p",
    "soporte que arranca en uno, no incluye el cero"
   ],
   "slug": "formulario-va-discretas",
   "ancla": "geométrica-y-binomial-negativa-las-dos-convenciones",
   "tags": [
    "geometrica",
    "pmf",
    "convencion",
    "pantazis"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-va-discretas.md",
    "linea": 55,
    "tipo": "tabla"
   }
  },
  {
   "id": "geometrica-y-binomial-negativa--geometrica-ensayos-esperanza",
   "unidad": "3",
   "seccion": "Geométrica y binomial negativa — las dos convenciones",
   "subseccion": "",
   "nombre": "Geométrica — ensayos: esperanza",
   "tex": "E[Y]=\\dfrac{1}{p}",
   "cuando": "Número medio de intentos hasta el primer éxito. Es la respuesta correcta cuando el enunciado cuenta ensayos y no fracasos: confundirla con la otra convención es el error clásico del parcial.",
   "condiciones": [
    "la variable cuenta ensayos, soporte que arranca en uno",
    "es la de fracasos más uno"
   ],
   "slug": "formulario-va-discretas",
   "ancla": "geométrica-y-binomial-negativa-las-dos-convenciones",
   "tags": [
    "geometrica",
    "esperanza",
    "convencion"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-va-discretas.md",
    "linea": 56,
    "tipo": "tabla"
   }
  },
  {
   "id": "geometrica-y-binomial-negativa--geometrica-ensayos-momento-de-orden-2",
   "unidad": "3",
   "seccion": "Geométrica y binomial negativa — las dos convenciones",
   "subseccion": "",
   "nombre": "Geométrica — ensayos: momento de orden 2",
   "tex": "E[Y^2]=\\dfrac{1+q}{p^2}",
   "cuando": "Paso intermedio para llegar a la varianza cuando el enunciado pide la dispersión en la convención de ensayos.",
   "condiciones": [
    "la variable cuenta ensayos",
    "sale de la serie de k al cuadrado por q a la k menos uno"
   ],
   "slug": "formulario-va-discretas",
   "ancla": "geométrica-y-binomial-negativa-las-dos-convenciones",
   "tags": [
    "geometrica",
    "momentos",
    "convencion"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-va-discretas.md",
    "linea": 57,
    "tipo": "tabla"
   }
  },
  {
   "id": "geometrica-y-binomial-negativa--geometrica-ensayos-varianza",
   "unidad": "3",
   "seccion": "Geométrica y binomial negativa — las dos convenciones",
   "subseccion": "",
   "nombre": "Geométrica — ensayos: varianza",
   "tex": "V(Y)=\\dfrac{q}{p^2}",
   "cuando": "Dispersión del número de ensayos hasta el primer éxito; es idéntica a la de la versión de fracasos.",
   "condiciones": [
    "la variable cuenta ensayos",
    "la varianza no cambia porque las dos convenciones difieren en una constante"
   ],
   "slug": "formulario-va-discretas",
   "ancla": "geométrica-y-binomial-negativa-las-dos-convenciones",
   "tags": [
    "geometrica",
    "varianza",
    "convencion"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-va-discretas.md",
    "linea": 58,
    "tipo": "tabla"
   }
  },
  {
   "id": "geometrica-y-binomial-negativa--geometrica-relacion-entre-convenciones",
   "unidad": "3",
   "seccion": "Geométrica y binomial negativa — las dos convenciones",
   "subseccion": "",
   "nombre": "Geométrica — relación entre convenciones",
   "tex": "Y=X+1\\;\\Rightarrow\\;E[Y]=E[X]+1,\\;V(Y)=V(X)",
   "cuando": "Puente entre las dos convenciones: permite resolver con la que uno recuerda y convertir al final. La esperanza difiere en 1 y la varianza no cambia.",
   "condiciones": [
    "una variable cuenta fracasos y la otra ensayos",
    "mismo p en las dos"
   ],
   "slug": "formulario-va-discretas",
   "ancla": "geométrica-y-binomial-negativa-las-dos-convenciones",
   "tags": [
    "geometrica",
    "convencion",
    "esperanza",
    "varianza"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-va-discretas.md",
    "linea": 59,
    "tipo": "tabla"
   }
  },
  {
   "id": "geometrica-y-binomial-negativa--binneg-fracasos-pmf",
   "unidad": "3",
   "seccion": "Geométrica y binomial negativa — las dos convenciones",
   "subseccion": "",
   "nombre": "BinNeg — fracasos: PMF",
   "tex": "p_X(k)=\\dbinom{k+r-1}{k}q^{\\,k}p^{\\,r},\\qquad k\\in\\mathbb{N}_0",
   "cuando": "Cuando se repiten ensayos Bernoulli hasta acumular r éxitos y se pregunta por los fracasos previos.",
   "condiciones": [
    "ensayos independientes con p constante",
    "r entero positivo",
    "el combinatorio es el que es porque el último ensayo está fijado como el r-ésimo éxito"
   ],
   "slug": "formulario-va-discretas",
   "ancla": "geométrica-y-binomial-negativa-las-dos-convenciones",
   "tags": [
    "binomial-negativa",
    "pmf",
    "discreta"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-va-discretas.md",
    "linea": 60,
    "tipo": "tabla"
   }
  },
  {
   "id": "geometrica-y-binomial-negativa--binneg-fracasos-esperanza",
   "unidad": "3",
   "seccion": "Geométrica y binomial negativa — las dos convenciones",
   "subseccion": "",
   "nombre": "BinNeg — fracasos: esperanza",
   "tex": "E[X]=\\dfrac{r\\,q}{p}",
   "cuando": "Número medio de fracasos antes del r-ésimo éxito; es r veces la de la geométrica, por ser suma de r geométricas independientes.",
   "condiciones": [
    "la variable cuenta fracasos",
    "q es el complemento de p"
   ],
   "slug": "formulario-va-discretas",
   "ancla": "geométrica-y-binomial-negativa-las-dos-convenciones",
   "tags": [
    "binomial-negativa",
    "esperanza"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-va-discretas.md",
    "linea": 61,
    "tipo": "tabla"
   }
  },
  {
   "id": "geometrica-y-binomial-negativa--binneg-fracasos-varianza",
   "unidad": "3",
   "seccion": "Geométrica y binomial negativa — las dos convenciones",
   "subseccion": "",
   "nombre": "BinNeg — fracasos: varianza",
   "tex": "V(X)=\\dfrac{r\\,q}{p^2}",
   "cuando": "Dispersión de la espera hasta el r-ésimo éxito; también es r veces la de la geométrica.",
   "condiciones": [
    "la variable cuenta fracasos",
    "suma de r geométricas independientes"
   ],
   "slug": "formulario-va-discretas",
   "ancla": "geométrica-y-binomial-negativa-las-dos-convenciones",
   "tags": [
    "binomial-negativa",
    "varianza"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-va-discretas.md",
    "linea": 62,
    "tipo": "tabla"
   }
  },
  {
   "id": "geometrica-y-binomial-negativa--binneg-caso",
   "unidad": "3",
   "seccion": "Geométrica y binomial negativa — las dos convenciones",
   "subseccion": "",
   "nombre": "BinNeg — caso $r=1$",
   "tex": "\\text{BinNeg}(1,p)=\\text{Geom}(p)",
   "cuando": "Chequeo de consistencia en el parcial: con un único éxito toda fórmula de binomial negativa debe colapsar a la geométrica.",
   "condiciones": [
    "misma convención de conteo (fracasos) en ambas"
   ],
   "slug": "formulario-va-discretas",
   "ancla": "geométrica-y-binomial-negativa-las-dos-convenciones",
   "tags": [
    "binomial-negativa",
    "geometrica",
    "relaciones"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-va-discretas.md",
    "linea": 63,
    "tipo": "tabla"
   }
  },
  {
   "id": "falta-de-memoria-discreta--falta-de-memoria-discreta",
   "unidad": "3",
   "seccion": "Falta de memoria (discreta)",
   "subseccion": "",
   "nombre": "Falta de memoria (discreta)",
   "tex": "P(X\\ge L+\\Delta\\mid X\\ge L)=P(X\\ge\\Delta)",
   "cuando": "Cuando el enunciado condiciona sobre una espera ya transcurrida (ya lleva un mes, cuál es la probabilidad de que siga una semana más): la geométrica es la única discreta donde lo ya esperado no cambia lo que falta.",
   "condiciones": [
    "X geométrica",
    "los dos argumentos son enteros no negativos",
    "propiedad exclusiva de la geométrica entre las discretas"
   ],
   "slug": "distribucion-geometrica",
   "ancla": "",
   "tags": [
    "geometrica",
    "falta-de-memoria",
    "condicional"
   ],
   "esencial": true,
   "origen": {
    "archivo": "wiki/formularios/formulario-va-discretas.md",
    "linea": 83,
    "tipo": "vineta"
   }
  },
  {
   "id": "falta-de-memoria-discreta--falta-de-memoria-verificacion-por-la",
   "unidad": "3",
   "seccion": "Falta de memoria (discreta)",
   "subseccion": "",
   "nombre": "Falta de memoria — verificación por la cola",
   "tex": "\\dfrac{P(X\\ge L+\\Delta)}{P(X\\ge L)}=\\dfrac{q^{\\,L+\\Delta}}{q^{\\,L}}=q^{\\,\\Delta}",
   "cuando": "Demostración en dos líneas de la falta de memoria, útil cuando el parcial pide justificar y no solo aplicar.",
   "condiciones": [
    "geométrica sobre fracasos",
    "el cociente no depende del tiempo ya transcurrido"
   ],
   "slug": "distribucion-geometrica",
   "ancla": "",
   "tags": [
    "geometrica",
    "falta-de-memoria",
    "demostracion"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-va-discretas.md",
    "linea": 84,
    "tipo": "vineta"
   }
  },
  {
   "id": "aproximaciones-entre-distribuciones--poisson-aproxima-a-la-binomial",
   "unidad": "3",
   "seccion": "Aproximaciones entre distribuciones",
   "subseccion": "",
   "nombre": "Poisson aproxima a la binomial",
   "tex": "\\dbinom{n}{k}p^k(1-p)^{\\,n-k}\\;\\approx\\;\\dfrac{(np)^k}{k!}\\,e^{-np}",
   "cuando": "Cuando n es grande y p chico y el combinatorio se vuelve impráctico de calcular a mano: se reemplaza la binomial por una Poisson de parámetro n por p.",
   "condiciones": [
    "n grande, p chico",
    "el producto n por p moderado",
    "eventos raros e independientes"
   ],
   "slug": "formulario-va-discretas",
   "ancla": "aproximaciones-entre-distribuciones",
   "tags": [
    "poisson",
    "binomial",
    "aproximacion"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-va-discretas.md",
    "linea": 91,
    "tipo": "vineta"
   }
  },
  {
   "id": "aproximaciones-entre-distribuciones--limite-de-poisson",
   "unidad": "3",
   "seccion": "Aproximaciones entre distribuciones",
   "subseccion": "",
   "nombre": "Límite de Poisson",
   "tex": "\\lim_{n\\to\\infty}\\dbinom{n}{k}p_n^{\\,k}(1-p_n)^{\\,n-k}=\\dfrac{\\lambda^k}{k!}\\,e^{-\\lambda}",
   "cuando": "Enunciado formal de la aproximación anterior; se pide cuando el ejercicio exige justificar por qué la Poisson reemplaza a la binomial.",
   "condiciones": [
    "el producto n por p tiende a un valor finito",
    "p tiende a cero"
   ],
   "slug": "formulario-va-discretas",
   "ancla": "aproximaciones-entre-distribuciones",
   "tags": [
    "poisson",
    "binomial",
    "limite",
    "teorico"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-va-discretas.md",
    "linea": 92,
    "tipo": "vineta"
   }
  },
  {
   "id": "aproximaciones-entre-distribuciones--hipergeometrica-tiende-a-la-binomial",
   "unidad": "3",
   "seccion": "Aproximaciones entre distribuciones",
   "subseccion": "",
   "nombre": "Hipergeométrica tiende a la binomial",
   "tex": "\\lim_{N\\to\\infty}P(X_N=k)=P(Y=k)\\text{, con }Y\\sim\\text{Bin}(n,\\,M/N)",
   "cuando": "Justifica tratar un muestreo sin reposición como si fuera con reposición cuando la población es enorme frente a la muestra.",
   "condiciones": [
    "población y ambas clases mucho mayores que la muestra",
    "la proporción de la clase tiende a p"
   ],
   "slug": "formulario-va-discretas",
   "ancla": "aproximaciones-entre-distribuciones",
   "tags": [
    "hipergeometrica",
    "binomial",
    "aproximacion"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-va-discretas.md",
    "linea": 93,
    "tipo": "vineta"
   }
  },
  {
   "id": "aproximaciones-entre-distribuciones--hipergeometrica-varianza-en-forma-factorizada",
   "unidad": "3",
   "seccion": "Aproximaciones entre distribuciones",
   "subseccion": "",
   "nombre": "Hipergeométrica — varianza en forma factorizada",
   "tex": "V(X)=n\\,\\dfrac{M}{N}\\,\\dfrac{N-M}{N}\\,\\dfrac{N-n}{N-1}",
   "cuando": "Cálculo directo de la varianza a partir de los totales de la población, la clase y la muestra, sin pasar por p y q; deja a la vista el factor de corrección.",
   "condiciones": [
    "muestreo sin reposición de población finita",
    "p es la proporción de la clase en la población"
   ],
   "slug": "formulario-va-discretas",
   "ancla": "aproximaciones-entre-distribuciones",
   "tags": [
    "hipergeometrica",
    "varianza"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-va-discretas.md",
    "linea": 94,
    "tipo": "vineta"
   }
  },
  {
   "id": "tamano-de-muestra-minimo--condicion-de-partida",
   "unidad": "3",
   "seccion": "Tamaño de muestra mínimo",
   "subseccion": "",
   "nombre": "Condición de partida",
   "tex": "P(X_n\\ge 1)=1-P(X_n=0)\\ge 0{,}9\\iff P(X_n=0)\\le 0{,}1",
   "cuando": "Primer paso de todo ejercicio de cuántos ensayos hacen falta para ver al menos un éxito con probabilidad dada: se pasa al complemento.",
   "condiciones": [
    "nivel fijado en 0,9 (se adapta cambiando el 0,1)"
   ],
   "slug": "distribucion-poisson",
   "ancla": "",
   "tags": [
    "tamano-de-muestra",
    "complemento",
    "poisson"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-va-discretas.md",
    "linea": 106,
    "tipo": "vineta"
   }
  },
  {
   "id": "tamano-de-muestra-minimo--cota-exacta-binomial",
   "unidad": "3",
   "seccion": "Tamaño de muestra mínimo",
   "subseccion": "",
   "nombre": "Cota exacta (binomial)",
   "tex": "n\\ge\\dfrac{-1}{\\log_{10}(1-p)}",
   "cuando": "Da el n mínimo exacto para observar al menos un éxito con probabilidad no menor que 0,9.",
   "condiciones": [
    "ensayos Bernoulli independientes con p constante",
    "redondear hacia arriba"
   ],
   "slug": "distribucion-poisson",
   "ancla": "",
   "tags": [
    "tamano-de-muestra",
    "binomial",
    "cota"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-va-discretas.md",
    "linea": 107,
    "tipo": "vineta"
   }
  },
  {
   "id": "tamano-de-muestra-minimo--cota-via-poisson",
   "unidad": "3",
   "seccion": "Tamaño de muestra mínimo",
   "subseccion": "",
   "nombre": "Cota vía Poisson",
   "tex": "n\\ge\\dfrac{-\\ln(0{,}1)}{p}",
   "cuando": "Versión aproximada de la cota anterior usando la probabilidad de cero eventos de una Poisson; es levemente conservadora.",
   "condiciones": [
    "p chico",
    "aproximación de Poisson con parámetro n por p"
   ],
   "slug": "distribucion-poisson",
   "ancla": "",
   "tags": [
    "tamano-de-muestra",
    "poisson",
    "cota"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-va-discretas.md",
    "linea": 108,
    "tipo": "vineta"
   }
  },
  {
   "id": "teoria-de-la-decision--ganancia-esperada-de-la-decision",
   "unidad": "3",
   "seccion": "Teoría de la decisión (valor esperado)",
   "subseccion": "",
   "nombre": "Ganancia esperada de la decisión $k$",
   "tex": "E[G_k]=\\sum_{x}G_k(x)\\,p_X(x)",
   "cuando": "Núcleo del patrón de teoría de la decisión: se tabula la ganancia esperada para cada valor candidato de la variable de decisión.",
   "condiciones": [
    "la variable aleatoria que no se controla (la demanda) tiene PMF conocida",
    "la ganancia es función de la demanda para cada decisión fija"
   ],
   "slug": "teoria-de-la-decision-valor-esperado",
   "ancla": "",
   "tags": [
    "teoria-de-la-decision",
    "esperanza",
    "discreta"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-va-discretas.md",
    "linea": 118,
    "tipo": "vineta"
   }
  },
  {
   "id": "teoria-de-la-decision--criterio-de-decision",
   "unidad": "3",
   "seccion": "Teoría de la decisión (valor esperado)",
   "subseccion": "",
   "nombre": "Criterio de decisión",
   "tex": "k^{*}=\\arg\\max_{k}E[G_k]",
   "cuando": "Cierra el ejercicio de decisión: se elige el valor que maximiza la ganancia esperada (o minimiza el costo esperado). El óptimo siempre cae dentro del recorrido de la demanda.",
   "condiciones": [
    "basta explorar el recorrido de la demanda: fuera de él la ganancia esperada es monótona",
    "para costos, minimizar en vez de maximizar"
   ],
   "slug": "teoria-de-la-decision-valor-esperado",
   "ancla": "",
   "tags": [
    "teoria-de-la-decision",
    "optimizacion"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-va-discretas.md",
    "linea": 119,
    "tipo": "vineta"
   }
  },
  {
   "id": "teoria-de-la-decision--ganancia-por-casos-modelo-del-vendedor",
   "unidad": "3",
   "seccion": "Teoría de la decisión (valor esperado)",
   "subseccion": "",
   "nombre": "Ganancia por casos (modelo del vendedor de diarios)",
   "tex": "G_k(X)=\\begin{cases}v\\,X-c\\,k, & X<k\\\\ (v-c)\\,k, & X\\ge k\\end{cases}",
   "cuando": "Plantilla del clásico newsvendor: se compran k unidades a costo c y se venden a precio v; si la demanda no alcanza sobran unidades ya pagadas, y si sobra demanda se vende todo el stock.",
   "condiciones": [
    "v es el precio de venta y c el costo unitario (en TP3 ej. 11, v=1 y c=0,40)",
    "las unidades sobrantes no se recuperan",
    "generalización de notación del caso numérico de la fuente"
   ],
   "slug": "teoria-de-la-decision-valor-esperado",
   "ancla": "",
   "tags": [
    "teoria-de-la-decision",
    "funcion-de-va",
    "newsvendor"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-va-discretas.md",
    "linea": 120,
    "tipo": "vineta"
   }
  },
  {
   "id": "funcion-de-una-variable--fda-de-metodo-general",
   "unidad": "5",
   "seccion": "Función de una variable aleatoria $Y=g(X)$",
   "subseccion": "",
   "nombre": "FDA de $Y$ (método general)",
   "tex": "F_Y(y)=P(Y\\le y)=P\\big(g(X)\\le y\\big)",
   "cuando": "Punto de partida de todo ejercicio de transformación: dan la distribución de X y piden la de Y. Se traduce el evento a un evento sobre X y se evalúa en su FDA.",
   "condiciones": [
    "g medible cualquiera",
    "sirve para X discreta o continua",
    "hay que identificar antes el soporte de Y"
   ],
   "slug": "formulario-funcion-de-va-y-bidimensionales",
   "ancla": "",
   "tags": [
    "funcion-de-variable-aleatoria",
    "fda",
    "transformacion"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-funcion-de-va-y-bidimensionales.md",
    "linea": 31,
    "tipo": "tabla"
   }
  },
  {
   "id": "funcion-de-una-variable--densidad-de-caso-continuo",
   "unidad": "5",
   "seccion": "Función de una variable aleatoria $Y=g(X)$",
   "subseccion": "",
   "nombre": "Densidad de $Y$ (caso continuo)",
   "tex": "f_Y(y)=\\dfrac{d}{dy}F_Y(y)",
   "cuando": "Segundo paso del método de la FDA cuando Y resulta continua: se deriva la acumulada ya obtenida, con regla de la cadena.",
   "condiciones": [
    "Y continua",
    "la acumulada derivable en el interior del soporte"
   ],
   "slug": "formulario-funcion-de-va-y-bidimensionales",
   "ancla": "",
   "tags": [
    "funcion-de-variable-aleatoria",
    "densidad"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-funcion-de-va-y-bidimensionales.md",
    "linea": 32,
    "tipo": "tabla"
   }
  },
  {
   "id": "funcion-de-una-variable--masa-de-caso-discreto",
   "unidad": "5",
   "seccion": "Función de una variable aleatoria $Y=g(X)$",
   "subseccion": "",
   "nombre": "Masa de $Y$ (caso discreto)",
   "tex": "p_Y(k)=\\displaystyle\\sum_{x:\\,g(x)=k} p_X(x)",
   "cuando": "Cuando X es discreta, o cuando g es escalonada y clasifica una X continua en categorías: se agrupan las probabilidades de la preimagen sin pasar por la FDA.",
   "condiciones": [
    "Y discreta",
    "sumar sobre toda la preimagen"
   ],
   "slug": "formulario-funcion-de-va-y-bidimensionales",
   "ancla": "",
   "tags": [
    "funcion-de-variable-aleatoria",
    "discreta",
    "pmf"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-funcion-de-va-y-bidimensionales.md",
    "linea": 33,
    "tipo": "tabla"
   }
  },
  {
   "id": "funcion-de-una-variable--creciente",
   "unidad": "5",
   "seccion": "Función de una variable aleatoria $Y=g(X)$",
   "subseccion": "",
   "nombre": "$g$ creciente",
   "tex": "F_Y(y)=F_X\\big(g^{-1}(y)\\big)",
   "cuando": "Atajo del método de la FDA cuando g es estrictamente creciente: el evento se traduce directo sin invertir la desigualdad.",
   "condiciones": [
    "g estrictamente creciente",
    "existe la inversa en el soporte"
   ],
   "slug": "formulario-funcion-de-va-y-bidimensionales",
   "ancla": "",
   "tags": [
    "funcion-de-variable-aleatoria",
    "fda",
    "monotona"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-funcion-de-va-y-bidimensionales.md",
    "linea": 34,
    "tipo": "tabla"
   }
  },
  {
   "id": "funcion-de-una-variable--decreciente",
   "unidad": "5",
   "seccion": "Función de una variable aleatoria $Y=g(X)$",
   "subseccion": "",
   "nombre": "$g$ decreciente",
   "tex": "F_Y(y)=1-F_X\\big(g^{-1}(y)\\big)",
   "cuando": "Mismo atajo con g estrictamente decreciente: al despejar se invierte la desigualdad y aparece el complemento.",
   "condiciones": [
    "g estrictamente decreciente",
    "existe la inversa en el soporte",
    "si X es continua no importa el borde"
   ],
   "slug": "formulario-funcion-de-va-y-bidimensionales",
   "ancla": "",
   "tags": [
    "funcion-de-variable-aleatoria",
    "fda",
    "monotona"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-funcion-de-va-y-bidimensionales.md",
    "linea": 35,
    "tipo": "tabla"
   }
  },
  {
   "id": "funcion-de-una-variable--monotona-estricta-cambio-de-variable",
   "unidad": "5",
   "seccion": "Función de una variable aleatoria $Y=g(X)$",
   "subseccion": "",
   "nombre": "$g$ monótona estricta (cambio de variable)",
   "tex": "f_Y(y)=f_X\\big(g^{-1}(y)\\big)\\left\\lvert\\dfrac{d}{dy}g^{-1}(y)\\right\\rvert",
   "cuando": "Atajo directo a la densidad cuando g es monótona estricta y derivable; evita escribir la FDA. Error típico de parcial: olvidar el valor absoluto del jacobiano.",
   "condiciones": [
    "X continua",
    "g monótona estricta y derivable",
    "jacobiano en valor absoluto"
   ],
   "slug": "formulario-funcion-de-va-y-bidimensionales",
   "ancla": "",
   "tags": [
    "funcion-de-variable-aleatoria",
    "densidad",
    "jacobiano"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-funcion-de-va-y-bidimensionales.md",
    "linea": 36,
    "tipo": "tabla"
   }
  },
  {
   "id": "funcion-de-una-variable--no-inyectiva",
   "unidad": "5",
   "seccion": "Función de una variable aleatoria $Y=g(X)$",
   "subseccion": "",
   "nombre": "$g$ no inyectiva ($Y=X^2$)",
   "tex": "F_Y(y)=F_X(\\sqrt{y})-F_X(-\\sqrt{y})",
   "cuando": "Patrón clásico del cuadrado o el valor absoluto: la preimagen tiene dos ramas y hay que sumarlas. Con normal estándar da la ji-cuadrado con un grado de libertad.",
   "condiciones": [
    "argumento positivo (para valores negativos la acumulada vale cero)",
    "g no inyectiva: preimagen unión de intervalos"
   ],
   "slug": "formulario-funcion-de-va-y-bidimensionales",
   "ancla": "",
   "tags": [
    "funcion-de-variable-aleatoria",
    "no-inyectiva",
    "fda"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-funcion-de-va-y-bidimensionales.md",
    "linea": 37,
    "tipo": "tabla"
   }
  },
  {
   "id": "transformacion-afin--media",
   "unidad": "5",
   "seccion": "Transformación afín $Y=aX+b$",
   "subseccion": "",
   "nombre": "Media",
   "tex": "\\mu_Y=a\\,\\mu_X+b",
   "cuando": "Transformación afín: la media se transforma igual que la variable, sin necesidad de hallar la distribución de Y.",
   "condiciones": [
    "existe la esperanza de X",
    "vale para cualquier distribución de X"
   ],
   "slug": "formulario-funcion-de-va-y-bidimensionales",
   "ancla": "",
   "tags": [
    "transformacion-afin",
    "esperanza"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-funcion-de-va-y-bidimensionales.md",
    "linea": 43,
    "tipo": "tabla"
   }
  },
  {
   "id": "transformacion-afin--varianza-y-desvio",
   "unidad": "5",
   "seccion": "Transformación afín $Y=aX+b$",
   "subseccion": "",
   "nombre": "Varianza y desvío",
   "tex": "\\sigma_Y^2=a^2\\sigma_X^2,\\qquad \\sigma_Y=\\lvert a\\rvert\\,\\sigma_X",
   "cuando": "Transformación afín: la varianza escala con el cuadrado y el corrimiento no la afecta. Error típico: escribir el desvío sin valor absoluto cuando la escala es negativa.",
   "condiciones": [
    "existe la varianza de X",
    "el desvío lleva valor absoluto de la escala",
    "con escala nula, Y es constante"
   ],
   "slug": "varianza",
   "ancla": "",
   "tags": [
    "transformacion-afin",
    "varianza"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-funcion-de-va-y-bidimensionales.md",
    "linea": 44,
    "tipo": "tabla"
   }
  },
  {
   "id": "transformacion-afin--asimetria-y-curtosis",
   "unidad": "5",
   "seccion": "Transformación afín $Y=aX+b$",
   "subseccion": "",
   "nombre": "Asimetría y curtosis",
   "tex": "\\gamma_Y=\\text{sign}(a)\\,\\gamma_X,\\qquad \\kappa_Y=\\kappa_X",
   "cuando": "Cuando el ejercicio pide la forma de la distribución transformada: la curtosis es invariante por afines y la asimetría solo cambia de signo si la escala es negativa.",
   "condiciones": [
    "escala distinta de cero",
    "existen los momentos de tercer y cuarto orden"
   ],
   "slug": "asimetria-y-curtosis",
   "ancla": "",
   "tags": [
    "transformacion-afin",
    "asimetria",
    "curtosis"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-funcion-de-va-y-bidimensionales.md",
    "linea": 45,
    "tipo": "tabla"
   }
  },
  {
   "id": "transformacion-afin--covarianza-con-el-original",
   "unidad": "5",
   "seccion": "Transformación afín $Y=aX+b$",
   "subseccion": "",
   "nombre": "Covarianza con el original",
   "tex": "\\text{Cov}(X,Y)=a\\,\\sigma_X^2=\\text{sign}(a)\\,\\sigma_X\\sigma_Y",
   "cuando": "Cuando Y es función afín de X y piden la covarianza o la correlación: se deduce que la correlación es exactamente más uno o menos uno según el signo de la escala.",
   "condiciones": [
    "Y es afín en X",
    "escala distinta de cero",
    "existe la varianza de X"
   ],
   "slug": "formulario-funcion-de-va-y-bidimensionales",
   "ancla": "",
   "tags": [
    "transformacion-afin",
    "covarianza"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-funcion-de-va-y-bidimensionales.md",
    "linea": 46,
    "tipo": "tabla"
   }
  },
  {
   "id": "transformacion-afin--familia-normal-cerrada-por-afines",
   "unidad": "5",
   "seccion": "Transformación afín $Y=aX+b$",
   "subseccion": "",
   "nombre": "Familia normal (cerrada por afines)",
   "tex": "X\\sim N(\\mu_X,\\sigma_X)\\;\\Rightarrow\\;Y=aX+b\\sim N(a\\mu_X+b,\\,\\lvert a\\rvert\\sigma_X)",
   "cuando": "Cuando la variable de partida es normal y se la escala o desplaza: la respuesta es otra normal, sin integrar. Es la base de la estandarización.",
   "condiciones": [
    "X normal",
    "escala distinta de cero",
    "normal parametrizada por el desvío"
   ],
   "slug": "formulario-funcion-de-va-y-bidimensionales",
   "ancla": "",
   "tags": [
    "transformacion-afin",
    "normal",
    "estandarizacion"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-funcion-de-va-y-bidimensionales.md",
    "linea": 47,
    "tipo": "tabla"
   }
  },
  {
   "id": "simulacion-por-transformada-inversa--transformada-inversa",
   "unidad": "5",
   "seccion": "Simulación por transformada inversa",
   "subseccion": "",
   "nombre": "Transformada inversa",
   "tex": "Y=F_X^{-1}(U)\\text{ con }U\\sim\\text{Unif}(0,1)\\;\\Rightarrow\\;F_Y=F_X\\text{.}",
   "cuando": "Ejercicio de simulación: piden generar una variable con distribución dada a partir de una uniforme en el intervalo unitario.",
   "condiciones": [
    "la FDA continua y estrictamente creciente",
    "U uniforme en (0,1)"
   ],
   "slug": "formulario-funcion-de-va-y-bidimensionales",
   "ancla": "simulación-por-transformada-inversa",
   "tags": [
    "simulacion",
    "transformada-inversa",
    "uniforme"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-funcion-de-va-y-bidimensionales.md",
    "linea": 51,
    "tipo": "vineta"
   }
  },
  {
   "id": "simulacion-por-transformada-inversa--inversa-generalizada",
   "unidad": "5",
   "seccion": "Simulación por transformada inversa",
   "subseccion": "",
   "nombre": "Inversa generalizada",
   "tex": "F_X^{\\leftarrow}(u)=\\min\\{x:\\,u\\le F_X(x)\\}",
   "cuando": "Variante de la transformada inversa cuando la FDA tiene saltos o tramos planos (típicamente X discreta): cada salto absorbe todo un tramo de valores de u.",
   "condiciones": [
    "la FDA no es estrictamente creciente",
    "sirve para X discreta o mixta"
   ],
   "slug": "formulario-funcion-de-va-y-bidimensionales",
   "ancla": "simulación-por-transformada-inversa",
   "tags": [
    "simulacion",
    "transformada-inversa",
    "discreta"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-funcion-de-va-y-bidimensionales.md",
    "linea": 52,
    "tipo": "vineta"
   }
  },
  {
   "id": "vector-aleatorio-conjunta-y--masa-conjunta-v-a-d",
   "unidad": "5",
   "seccion": "Vector aleatorio $(X,Y)$: conjunta y marginales",
   "subseccion": "",
   "nombre": "Masa conjunta (V.A.D.)",
   "tex": "p_{X,Y}(x,y)=P(X=x,\\,Y=y),\\qquad \\displaystyle\\sum_{x}\\sum_{y}p_{X,Y}(x,y)=1",
   "cuando": "Punto de partida del caso discreto bidimensional: definición de la tabla conjunta y condición de normalización, que suele usarse para despejar una constante.",
   "condiciones": [
    "masa conjunta no negativa",
    "la suma sobre todo el soporte vale uno"
   ],
   "slug": "formulario-funcion-de-va-y-bidimensionales",
   "ancla": "",
   "tags": [
    "bidimensionales",
    "conjunta",
    "discreta"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-funcion-de-va-y-bidimensionales.md",
    "linea": 58,
    "tipo": "tabla"
   }
  },
  {
   "id": "vector-aleatorio-conjunta-y--marginales-v-a-d",
   "unidad": "5",
   "seccion": "Vector aleatorio $(X,Y)$: conjunta y marginales",
   "subseccion": "",
   "nombre": "Marginales (V.A.D.)",
   "tex": "p_X(x)=\\displaystyle\\sum_{y\\in R_Y}p_{X,Y}(x,y),\\qquad p_Y(y)=\\sum_{x\\in R_X}p_{X,Y}(x,y)",
   "cuando": "Primer paso de casi todo ejercicio con tabla conjunta: sumar filas y columnas para obtener las marginales antes de calcular momentos o testear independencia.",
   "condiciones": [
    "sumar sobre todo el recorrido de la otra variable"
   ],
   "slug": "formulario-funcion-de-va-y-bidimensionales",
   "ancla": "",
   "tags": [
    "bidimensionales",
    "marginal",
    "discreta"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-funcion-de-va-y-bidimensionales.md",
    "linea": 59,
    "tipo": "tabla"
   }
  },
  {
   "id": "vector-aleatorio-conjunta-y--esperanza-de-v-a-d",
   "unidad": "5",
   "seccion": "Vector aleatorio $(X,Y)$: conjunta y marginales",
   "subseccion": "",
   "nombre": "Esperanza de $h(X,Y)$ (V.A.D.)",
   "tex": "E[h(X,Y)]=\\displaystyle\\sum_{x\\in R_X}\\sum_{y\\in R_Y}h(x,y)\\,p_{X,Y}(x,y)",
   "cuando": "Para calcular la esperanza del producto (y de ahí la covarianza) o la esperanza de cualquier función del vector, sin hallar su distribución.",
   "condiciones": [
    "la suma debe converger absolutamente",
    "no hace falta la distribución de la función"
   ],
   "slug": "formulario-funcion-de-va-y-bidimensionales",
   "ancla": "",
   "tags": [
    "bidimensionales",
    "esperanza",
    "discreta"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-funcion-de-va-y-bidimensionales.md",
    "linea": 60,
    "tipo": "tabla"
   }
  },
  {
   "id": "vector-aleatorio-conjunta-y--densidad-conjunta-v-a-c",
   "unidad": "5",
   "seccion": "Vector aleatorio $(X,Y)$: conjunta y marginales",
   "subseccion": "",
   "nombre": "Densidad conjunta (V.A.C.)",
   "tex": "P\\big((X,Y)\\in B\\big)=\\displaystyle\\iint_B f_{X,Y}(x,y)\\,dx\\,dy,\\qquad \\iint_{\\mathbb{R}^2}f_{X,Y}=1",
   "cuando": "Caso continuo bidimensional: cualquier probabilidad es una integral doble sobre la región, y la normalización es lo que permite despejar la constante del enunciado.",
   "condiciones": [
    "densidad conjunta no negativa",
    "los límites de la integral salen del dibujo del soporte"
   ],
   "slug": "formulario-funcion-de-va-y-bidimensionales",
   "ancla": "",
   "tags": [
    "bidimensionales",
    "conjunta",
    "integral-doble"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-funcion-de-va-y-bidimensionales.md",
    "linea": 61,
    "tipo": "tabla"
   }
  },
  {
   "id": "vector-aleatorio-conjunta-y--marginales-v-a-c",
   "unidad": "5",
   "seccion": "Vector aleatorio $(X,Y)$: conjunta y marginales",
   "subseccion": "",
   "nombre": "Marginales (V.A.C.)",
   "tex": "f_X(t)=\\displaystyle\\int_{-\\infty}^{\\infty}f_{X,Y}(t,y)\\,dy,\\qquad f_Y(u)=\\int_{-\\infty}^{\\infty}f_{X,Y}(x,u)\\,dx",
   "cuando": "Para obtener la distribución de una sola de las dos variables, y como paso previo a la condicional y al test de independencia. Con soporte no rectangular los límites dependen de la otra variable.",
   "condiciones": [
    "integrar la variable que se descarta",
    "límites variables si el soporte no es rectangular"
   ],
   "slug": "formulario-funcion-de-va-y-bidimensionales",
   "ancla": "",
   "tags": [
    "bidimensionales",
    "marginal",
    "continua"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-funcion-de-va-y-bidimensionales.md",
    "linea": 62,
    "tipo": "tabla"
   }
  },
  {
   "id": "vector-aleatorio-conjunta-y--esperanza-de-v-a-c",
   "unidad": "5",
   "seccion": "Vector aleatorio $(X,Y)$: conjunta y marginales",
   "subseccion": "",
   "nombre": "Esperanza de $h(X,Y)$ (V.A.C.)",
   "tex": "E[h(X,Y)]=\\displaystyle\\iint_{\\mathbb{R}^2}h(x,y)\\,f_{X,Y}(x,y)\\,dx\\,dy",
   "cuando": "Análogo continuo: la esperanza del producto, de una marginal o de cualquier función del vector se calcula integrando contra la conjunta.",
   "condiciones": [
    "la integral debe converger absolutamente",
    "integrar solo sobre el soporte"
   ],
   "slug": "formulario-funcion-de-va-y-bidimensionales",
   "ancla": "",
   "tags": [
    "bidimensionales",
    "esperanza",
    "integral-doble"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-funcion-de-va-y-bidimensionales.md",
    "linea": 63,
    "tipo": "tabla"
   }
  },
  {
   "id": "condicionales-y-esperanza-condicional--densidad-condicional",
   "unidad": "5",
   "seccion": "Condicionales y esperanza condicional",
   "subseccion": "",
   "nombre": "Densidad condicional",
   "tex": "f_{X\\mid Y}(x\\mid y)=\\dfrac{f_{X,Y}(x,y)}{f_Y(y)}",
   "cuando": "Cuando el enunciado fija el valor de una variable (sabiendo que la altura es h) y pide la distribución de la otra; también es el test de independencia vía condicional igual a marginal.",
   "condiciones": [
    "la marginal del condicionante debe ser positiva",
    "para cada valor fijo es una densidad válida"
   ],
   "slug": "formulario-funcion-de-va-y-bidimensionales",
   "ancla": "condicionales-y-esperanza-condicional",
   "tags": [
    "bidimensionales",
    "condicional",
    "densidad"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-funcion-de-va-y-bidimensionales.md",
    "linea": 69,
    "tipo": "tabla"
   }
  },
  {
   "id": "condicionales-y-esperanza-condicional--esperanza-condicional-v-a-c",
   "unidad": "5",
   "seccion": "Condicionales y esperanza condicional",
   "subseccion": "",
   "nombre": "Esperanza condicional (V.A.C.)",
   "tex": "E[h(X)\\mid Y=y]=\\displaystyle\\int_{-\\infty}^{\\infty}h(x)\\,f_{X\\mid Y}(x\\mid y)\\,dx",
   "cuando": "Para calcular el promedio de X dentro de cada valor de Y; el resultado es una función del condicionante que después se promedia con la ley de esperanza total.",
   "condiciones": [
    "la marginal del condicionante debe ser positiva",
    "el soporte condicional puede depender del valor fijado"
   ],
   "slug": "esperanza-condicional",
   "ancla": "",
   "tags": [
    "condicional",
    "esperanza",
    "continua"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-funcion-de-va-y-bidimensionales.md",
    "linea": 70,
    "tipo": "tabla"
   }
  },
  {
   "id": "condicionales-y-esperanza-condicional--varianza-condicional",
   "unidad": "5",
   "seccion": "Condicionales y esperanza condicional",
   "subseccion": "",
   "nombre": "Varianza condicional",
   "tex": "\\text{Var}(X\\mid Y)=E[X^2\\mid Y]-\\big(E[X\\mid Y]\\big)^2",
   "cuando": "Insumo de la ley de varianza total: mide la dispersión dentro de cada grupo. Es una variable aleatoria, función del condicionante.",
   "condiciones": [
    "existen los momentos condicionales de segundo orden"
   ],
   "slug": "formulario-funcion-de-va-y-bidimensionales",
   "ancla": "condicionales-y-esperanza-condicional",
   "tags": [
    "condicional",
    "varianza"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-funcion-de-va-y-bidimensionales.md",
    "linea": 71,
    "tipo": "tabla"
   }
  },
  {
   "id": "condicionales-y-esperanza-condicional--ley-de-esperanza-total",
   "unidad": "5",
   "seccion": "Condicionales y esperanza condicional",
   "subseccion": "",
   "nombre": "Ley de esperanza total",
   "tex": "E[X]=E\\big[E[X\\mid Y]\\big]",
   "cuando": "Cuando conviene calcular por etapas: primero se promedia dentro de cada valor del condicionante y después se promedia sobre él. Es la versión esperada de la probabilidad total.",
   "condiciones": [
    "existe la esperanza de X",
    "vale con condicionante discreto o continuo"
   ],
   "slug": "formulario-funcion-de-va-y-bidimensionales",
   "ancla": "condicionales-y-esperanza-condicional",
   "tags": [
    "condicional",
    "esperanza-total"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-funcion-de-va-y-bidimensionales.md",
    "linea": 72,
    "tipo": "tabla"
   }
  },
  {
   "id": "condicionales-y-esperanza-condicional--ley-de-varianza-total",
   "unidad": "5",
   "seccion": "Condicionales y esperanza condicional",
   "subseccion": "",
   "nombre": "Ley de varianza total",
   "tex": "\\text{Var}(X)=E\\big[\\text{Var}(X\\mid Y)\\big]+\\text{Var}\\big(E[X\\mid Y]\\big)",
   "cuando": "Cuando piden la varianza de una variable definida por etapas o por grupos: varianza intra más varianza entre. Olvidar el segundo término es el error de parcial más castigado de la unidad.",
   "condiciones": [
    "existe la varianza de X",
    "el término entre grupos nunca es negativo",
    "se anula solo si todas las medias condicionales coinciden"
   ],
   "slug": "formulario-funcion-de-va-y-bidimensionales",
   "ancla": "condicionales-y-esperanza-condicional",
   "tags": [
    "condicional",
    "varianza-total",
    "mezcla"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-funcion-de-va-y-bidimensionales.md",
    "linea": 73,
    "tipo": "tabla"
   }
  },
  {
   "id": "independencia-de-e--definicion-v-a-d",
   "unidad": "5",
   "seccion": "Independencia de $X$ e $Y$",
   "subseccion": "",
   "nombre": "Definición (V.A.D.)",
   "tex": "p_{X,Y}(x,y)=p_X(x)\\,p_Y(y)\\quad\\forall x\\in R_X,\\,y\\in R_Y",
   "cuando": "Test formal de independencia en una tabla conjunta: hay que verificarlo en todas las celdas; alcanza una que falle para concluir dependencia.",
   "condiciones": [
    "debe valer para todo el soporte, no para algunas celdas"
   ],
   "slug": "formulario-funcion-de-va-y-bidimensionales",
   "ancla": "",
   "tags": [
    "independencia",
    "discreta"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-funcion-de-va-y-bidimensionales.md",
    "linea": 79,
    "tipo": "tabla"
   }
  },
  {
   "id": "independencia-de-e--definicion-v-a-c",
   "unidad": "5",
   "seccion": "Independencia de $X$ e $Y$",
   "subseccion": "",
   "nombre": "Definición (V.A.C.)",
   "tex": "f_{X,Y}(x,y)=f_X(x)\\,f_Y(y)\\quad\\forall (x,y)\\in\\mathbb{R}^2",
   "cuando": "Test formal de independencia en el caso continuo: se calculan las dos marginales y se compara su producto con la conjunta en todo el plano.",
   "condiciones": [
    "debe valer en todo el plano, incluido fuera del soporte"
   ],
   "slug": "formulario-funcion-de-va-y-bidimensionales",
   "ancla": "",
   "tags": [
    "independencia",
    "continua"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-funcion-de-va-y-bidimensionales.md",
    "linea": 80,
    "tipo": "tabla"
   }
  },
  {
   "id": "independencia-de-e--esperanza-del-producto",
   "unidad": "5",
   "seccion": "Independencia de $X$ e $Y$",
   "subseccion": "",
   "nombre": "Esperanza del producto",
   "tex": "E[g_1(X)\\,g_2(Y)]=E[g_1(X)]\\,E[g_2(Y)]",
   "cuando": "Consecuencia de la independencia que evita la integral doble; en particular da la factorización de la esperanza del producto y por lo tanto covarianza nula.",
   "condiciones": [
    "X e Y independientes",
    "existen ambas esperanzas"
   ],
   "slug": "formulario-funcion-de-va-y-bidimensionales",
   "ancla": "",
   "tags": [
    "independencia",
    "esperanza"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-funcion-de-va-y-bidimensionales.md",
    "linea": 81,
    "tipo": "tabla"
   }
  },
  {
   "id": "independencia-de-e--varianza-de-la-suma",
   "unidad": "5",
   "seccion": "Independencia de $X$ e $Y$",
   "subseccion": "",
   "nombre": "Varianza de la suma",
   "tex": "\\text{Var}(X+Y)=\\text{Var}(X)+\\text{Var}(Y)",
   "cuando": "Cuando las variables son independientes (o al menos incorrelacionadas) y piden la varianza de la suma: desaparece el término de covarianza.",
   "condiciones": [
    "basta con covarianza nula",
    "existen ambas varianzas"
   ],
   "slug": "formulario-funcion-de-va-y-bidimensionales",
   "ancla": "",
   "tags": [
    "independencia",
    "varianza",
    "suma"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-funcion-de-va-y-bidimensionales.md",
    "linea": 82,
    "tipo": "tabla"
   }
  },
  {
   "id": "independencia-de-e--test-del-cero-descarta-independencia",
   "unidad": "5",
   "seccion": "Independencia de $X$ e $Y$",
   "subseccion": "",
   "nombre": "Test del cero (descarta independencia)",
   "tex": "\\exists\\,(x,y):\\ p_{X,Y}(x,y)=0,\\ p_X(x)>0,\\ p_Y(y)>0\\ \\Rightarrow\\ X,Y\\ \\text{dependientes}",
   "cuando": "Atajo de detección rápida en tablas y en soportes no rectangulares: si hay un cero donde ambas marginales son positivas, ya se concluye dependencia sin más cuentas.",
   "condiciones": [
    "es condición suficiente de dependencia, no de independencia",
    "versión continua: soporte que no es un rectángulo"
   ],
   "slug": "formulario-funcion-de-va-y-bidimensionales",
   "ancla": "",
   "tags": [
    "independencia",
    "soporte",
    "atajo"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-funcion-de-va-y-bidimensionales.md",
    "linea": 83,
    "tipo": "tabla"
   }
  },
  {
   "id": "covarianza-y-correlacion--definicion",
   "unidad": "5",
   "seccion": "Covarianza y correlación",
   "subseccion": "",
   "nombre": "Definición",
   "tex": "\\text{Cov}(X,Y)=E\\big[(X-\\mu_X)(Y-\\mu_Y)\\big]",
   "cuando": "Definición conceptual de la covarianza: promedio de los productos de los desvíos respecto de las medias. Se usa para justificar el signo, no para calcular.",
   "condiciones": [
    "existen ambas medias",
    "existe el momento cruzado"
   ],
   "slug": "covarianza-y-correlacion",
   "ancla": "",
   "tags": [
    "covarianza",
    "bidimensionales"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-funcion-de-va-y-bidimensionales.md",
    "linea": 89,
    "tipo": "tabla"
   }
  },
  {
   "id": "covarianza-y-correlacion--formula-practica",
   "unidad": "5",
   "seccion": "Covarianza y correlación",
   "subseccion": "",
   "nombre": "Fórmula práctica",
   "tex": "\\text{Cov}(X,Y)=E[XY]-\\mu_X\\,\\mu_Y",
   "cuando": "La que se usa en el parcial: se calcula la esperanza del producto con la conjunta y se restan los productos de las medias marginales.",
   "condiciones": [
    "existen la esperanza del producto y las dos marginales"
   ],
   "slug": "covarianza-y-correlacion",
   "ancla": "",
   "tags": [
    "covarianza",
    "calculo"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-funcion-de-va-y-bidimensionales.md",
    "linea": 90,
    "tipo": "tabla"
   }
  },
  {
   "id": "covarianza-y-correlacion--bilinealidad",
   "unidad": "5",
   "seccion": "Covarianza y correlación",
   "subseccion": "",
   "nombre": "Bilinealidad",
   "tex": "\\text{Cov}(aX+b,\\,cY+d)=ac\\,\\text{Cov}(X,Y)",
   "cuando": "Cuando el enunciado cambia de unidades o reescala las variables: los corrimientos no afectan la covarianza y las escalas salen como factor.",
   "condiciones": [
    "existe la covarianza",
    "la correlación es invariante salvo el signo del producto de escalas"
   ],
   "slug": "covarianza-y-correlacion",
   "ancla": "",
   "tags": [
    "covarianza",
    "transformacion-afin"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-funcion-de-va-y-bidimensionales.md",
    "linea": 91,
    "tipo": "tabla"
   }
  },
  {
   "id": "covarianza-y-correlacion--varianza-de-una-combinacion-lineal",
   "unidad": "5",
   "seccion": "Covarianza y correlación",
   "subseccion": "",
   "nombre": "Varianza de una combinación lineal",
   "tex": "\\text{Var}(aX+bY)=a^2\\text{Var}(X)+2ab\\,\\text{Cov}(X,Y)+b^2\\text{Var}(Y)",
   "cuando": "Para la varianza de sumas, diferencias o carteras de dos variables dependientes; con escalas unitarias da la varianza de la suma y de la diferencia.",
   "condiciones": [
    "existen ambas varianzas y la covarianza",
    "el término cruzado se anula solo con covarianza nula"
   ],
   "slug": "covarianza-y-correlacion",
   "ancla": "",
   "tags": [
    "covarianza",
    "varianza",
    "combinacion-lineal"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-funcion-de-va-y-bidimensionales.md",
    "linea": 92,
    "tipo": "tabla"
   }
  },
  {
   "id": "covarianza-y-correlacion--coeficiente-de-correlacion",
   "unidad": "5",
   "seccion": "Covarianza y correlación",
   "subseccion": "",
   "nombre": "Coeficiente de correlación",
   "tex": "\\rho_{X,Y}=\\dfrac{\\text{Cov}(X,Y)}{\\sigma_X\\,\\sigma_Y}",
   "cuando": "Cuando piden medir la asociación lineal en forma adimensional y comparable: es la covarianza dividida por el producto de los desvíos.",
   "condiciones": [
    "ambos desvíos positivos",
    "el resultado cae entre menos uno y uno"
   ],
   "slug": "covarianza-y-correlacion",
   "ancla": "coeficiente-de-correlación",
   "tags": [
    "correlacion",
    "bidimensionales"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-funcion-de-va-y-bidimensionales.md",
    "linea": 93,
    "tipo": "tabla"
   }
  },
  {
   "id": "covarianza-y-correlacion--cauchy-schwarz-discriminante",
   "unidad": "5",
   "seccion": "Covarianza y correlación",
   "subseccion": "",
   "nombre": "Cauchy-Schwarz (discriminante $\\le0$)",
   "tex": "\\big(\\text{Cov}(X,Y)\\big)^2\\le\\text{Var}(X)\\,\\text{Var}(Y)",
   "cuando": "Cota que justifica que la correlación viva entre menos uno y uno; sirve además para detectar datos inconsistentes en un enunciado o en una resolución.",
   "condiciones": [
    "existen ambas varianzas",
    "sale del discriminante de la varianza de una combinación lineal"
   ],
   "slug": "covarianza-y-correlacion",
   "ancla": "",
   "tags": [
    "correlacion",
    "cota",
    "cauchy-schwarz"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-funcion-de-va-y-bidimensionales.md",
    "linea": 94,
    "tipo": "tabla"
   }
  },
  {
   "id": "covarianza-y-correlacion--variables-normalizadas",
   "unidad": "5",
   "seccion": "Covarianza y correlación",
   "subseccion": "",
   "nombre": "Variables normalizadas",
   "tex": "\\text{Var}\\!\\left(\\dfrac{X}{\\sigma_X}\\pm\\dfrac{Y}{\\sigma_Y}\\right)=2\\pm2\\rho_{X,Y}",
   "cuando": "Paso clave de la demostración de que correlación extrema implica relación lineal: con correlación uno la varianza de la diferencia normalizada se anula, así que la diferencia es constante con probabilidad uno.",
   "condiciones": [
    "ambos desvíos positivos",
    "una varianza nula implica variable constante con probabilidad uno"
   ],
   "slug": "covarianza-y-correlacion",
   "ancla": "",
   "tags": [
    "correlacion",
    "varianza",
    "demostracion"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-funcion-de-va-y-bidimensionales.md",
    "linea": 95,
    "tipo": "tabla"
   }
  },
  {
   "id": "covarianza-y-correlacion--correlacion-extrema",
   "unidad": "5",
   "seccion": "Covarianza y correlación",
   "subseccion": "",
   "nombre": "Correlación extrema",
   "tex": "\\rho_{X,Y}=\\pm1\\iff Y=aX+b\\ \\text{con prob. }1,\\ \\text{sign}(a)=\\text{sign}(\\rho_{X,Y})",
   "cuando": "Cuando el ejercicio da correlación extrema o pide interpretarla: equivale a que los puntos caigan exactamente sobre una recta, con pendiente del signo de la correlación.",
   "condiciones": [
    "ambos desvíos positivos",
    "pendiente distinta de cero",
    "la igualdad vale con probabilidad uno"
   ],
   "slug": "covarianza-y-correlacion",
   "ancla": "",
   "tags": [
    "correlacion",
    "relacion-lineal"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-funcion-de-va-y-bidimensionales.md",
    "linea": 96,
    "tipo": "tabla"
   }
  },
  {
   "id": "mezcla-de-distribuciones--fda-de-la-mezcla-discreta",
   "unidad": "5",
   "seccion": "Mezcla de distribuciones",
   "subseccion": "",
   "nombre": "FDA de la mezcla ($M$ discreta)",
   "tex": "F_X(x)=\\displaystyle\\sum_{k\\in R_M}F_{X\\mid M}(x\\mid k)\\,P(M=k)",
   "cuando": "Cuando la población está partida en subpoblaciones (proveedores, máquinas, turnos) y piden una probabilidad acumulada de la variable observada.",
   "condiciones": [
    "la variable auxiliar es discreta y sus pesos suman uno",
    "se conoce la condicional para cada categoría"
   ],
   "slug": "mezcla-de-distribuciones",
   "ancla": "",
   "tags": [
    "mezcla",
    "fda",
    "probabilidad-total"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-funcion-de-va-y-bidimensionales.md",
    "linea": 102,
    "tipo": "tabla"
   }
  },
  {
   "id": "mezcla-de-distribuciones--densidad-de-la-mezcla",
   "unidad": "5",
   "seccion": "Mezcla de distribuciones",
   "subseccion": "",
   "nombre": "Densidad de la mezcla",
   "tex": "f_X(x)=\\displaystyle\\sum_{k\\in R_M}f_{X\\mid M}(x\\mid k)\\,P(M=k)",
   "cuando": "Fórmula central de las mezclas: la densidad observada es la combinación convexa de las condicionales con los pesos de la variable auxiliar.",
   "condiciones": [
    "los pesos suman uno",
    "es combinación convexa, no una densidad promedio de la misma familia"
   ],
   "slug": "mezcla-de-distribuciones",
   "ancla": "",
   "tags": [
    "mezcla",
    "densidad",
    "combinacion-convexa"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-funcion-de-va-y-bidimensionales.md",
    "linea": 103,
    "tipo": "tabla"
   }
  },
  {
   "id": "mezcla-de-distribuciones--esperanza-de-la-mezcla",
   "unidad": "5",
   "seccion": "Mezcla de distribuciones",
   "subseccion": "",
   "nombre": "Esperanza de la mezcla",
   "tex": "E[g(X)]=\\displaystyle\\sum_{k\\in R_M}E[g(X)\\mid M=k]\\,P(M=k)",
   "cuando": "Para la media (o cualquier momento) de una mezcla: promedio ponderado de las esperanzas condicionales. Es la ley de esperanza total escrita para variable auxiliar discreta.",
   "condiciones": [
    "existen las esperanzas condicionales",
    "los pesos suman uno"
   ],
   "slug": "mezcla-de-distribuciones",
   "ancla": "",
   "tags": [
    "mezcla",
    "esperanza",
    "esperanza-total"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-funcion-de-va-y-bidimensionales.md",
    "linea": 104,
    "tipo": "tabla"
   }
  },
  {
   "id": "mezcla-de-distribuciones--momento-de-segundo-orden-para-la",
   "unidad": "5",
   "seccion": "Mezcla de distribuciones",
   "subseccion": "",
   "nombre": "Momento de segundo orden (para la varianza)",
   "tex": "E[X^2]=\\displaystyle\\sum_{k}E[X^2\\mid M=k]\\,P(M=k)",
   "cuando": "Camino correcto para la varianza de una mezcla: se mezcla el momento de segundo orden y recién después se resta el cuadrado de la media global.",
   "condiciones": [
    "existen los momentos condicionales de segundo orden",
    "luego restar el cuadrado de la media de la mezcla"
   ],
   "slug": "mezcla-de-distribuciones",
   "ancla": "",
   "tags": [
    "mezcla",
    "varianza",
    "momentos"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-funcion-de-va-y-bidimensionales.md",
    "linea": 105,
    "tipo": "tabla"
   }
  },
  {
   "id": "mezcla-de-distribuciones--mezcla-de-exponenciales",
   "unidad": "5",
   "seccion": "Mezcla de distribuciones",
   "subseccion": "",
   "nombre": "Mezcla de exponenciales",
   "tex": "f_T(t)=\\displaystyle\\sum_{k}\\lambda_k\\,e^{-\\lambda_k t}\\,P(M=k)",
   "cuando": "Caso concreto más frecuente en el parcial: tiempos de vida provenientes de varios lotes o proveedores, cada uno exponencial con su propia tasa.",
   "condiciones": [
    "cada condicional es exponencial con su tasa",
    "tiempo positivo",
    "el resultado NO es exponencial"
   ],
   "slug": "mezcla-de-distribuciones",
   "ancla": "",
   "tags": [
    "mezcla",
    "exponencial",
    "densidad"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-funcion-de-va-y-bidimensionales.md",
    "linea": 106,
    "tipo": "tabla"
   }
  },
  {
   "id": "mezcla-de-distribuciones--mezcla-inversa-discreta-continua",
   "unidad": "5",
   "seccion": "Mezcla de distribuciones",
   "subseccion": "",
   "nombre": "Mezcla inversa ($X$ discreta, $Y$ continua)",
   "tex": "p_X(x)=\\displaystyle\\int_{\\mathbb{R}}p_{X\\mid Y}(x\\mid y)\\,f_Y(y)\\,dy",
   "cuando": "Cuando el parámetro de una variable discreta es a su vez aleatorio y continuo (por ejemplo una Poisson con tasa uniforme): se integra la masa condicional contra la densidad del parámetro.",
   "condiciones": [
    "el parámetro es continuo con densidad",
    "integrar sobre su soporte",
    "el resultado no coincide con evaluar en la media del parámetro"
   ],
   "slug": "mezcla-de-distribuciones",
   "ancla": "mezcla-inversa-discreta-condicionada-a-continua",
   "tags": [
    "mezcla",
    "probabilidad-total",
    "discreta"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-funcion-de-va-y-bidimensionales.md",
    "linea": 107,
    "tipo": "tabla"
   }
  },
  {
   "id": "mezcla-de-distribuciones--la-varianza-no-se-mezcla-linealmente",
   "unidad": "5",
   "seccion": "Mezcla de distribuciones",
   "subseccion": "",
   "nombre": "La varianza no se mezcla linealmente",
   "tex": "\\text{Var}(X)\\neq\\displaystyle\\sum_{k}\\text{Var}(X\\mid M=k)\\,P(M=k)\\text{.}",
   "cuando": "Advertencia que la cátedra usa deliberadamente como distractor en los parciales: promediar varianzas condicionales subestima la varianza porque falta el término entre grupos.",
   "condiciones": [
    "la igualdad solo valdría si todas las medias condicionales coincidieran",
    "usar el momento de segundo orden o la ley de varianza total"
   ],
   "slug": "mezcla-de-distribuciones",
   "ancla": "",
   "tags": [
    "mezcla",
    "varianza",
    "error-tipico"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-funcion-de-va-y-bidimensionales.md",
    "linea": 109,
    "tipo": "vineta"
   }
  },
  {
   "id": "definiciones-generales--chapman-kolmogorov-marginalizacion",
   "unidad": "6",
   "seccion": "Definiciones generales",
   "subseccion": "",
   "nombre": "Chapman-Kolmogorov (marginalización)",
   "tex": "p(x_1,t_1,\\dots,x_{k-1},t_{k-1},x_{k+1},t_{k+1},\\dots)=\\sum_{x_k\\in\\mathbb{E}}p(x_1,t_1,\\dots,x_k,t_k,\\dots)",
   "cuando": "Cuando hay que obtener la conjunta de un subconjunto de instantes a partir de la conjunta completa, eliminando el estado intermedio. Es el punto de partida para llegar a la forma matricial de una cadena de Markov.",
   "condiciones": [
    "vale en todo proceso estocástico",
    "espacio de estados discreto (si es continuo, la suma es integral)"
   ],
   "slug": "formulario-procesos-estocasticos",
   "ancla": "definiciones-generales",
   "tags": [
    "procesos-estocasticos",
    "chapman-kolmogorov",
    "marginalizacion"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-procesos-estocasticos.md",
    "linea": 31,
    "tipo": "tabla"
   }
  },
  {
   "id": "definiciones-generales--proceso-estacionario",
   "unidad": "6",
   "seccion": "Definiciones generales",
   "subseccion": "",
   "nombre": "Proceso estacionario",
   "tex": "p(x_1,t_1{+}\\Delta t,\\dots,x_n,t_n{+}\\Delta t)=p(x_1,t_1,\\dots,x_n,t_n)",
   "cuando": "Para justificar o refutar que un proceso es estacionario: se compara la conjunta desplazada con la original. En el parcial suele pedirse mostrar que la caminata NO es estacionaria porque su varianza crece con el paso.",
   "condiciones": [
    "vale para toda tupla de índices y todo desplazamiento"
   ],
   "slug": "formulario-procesos-estocasticos",
   "ancla": "definiciones-generales",
   "tags": [
    "procesos-estocasticos",
    "estacionariedad"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-procesos-estocasticos.md",
    "linea": 32,
    "tipo": "tabla"
   }
  },
  {
   "id": "definiciones-generales--incrementos-independientes",
   "unidad": "6",
   "seccion": "Definiciones generales",
   "subseccion": "",
   "nombre": "Incrementos independientes",
   "tex": "[t_1,t_2]\\cap[t_3,t_4]=\\emptyset\\ \\Rightarrow\\ X(t_2)-X(t_1)\\ \\perp\\ X(t_4)-X(t_3)",
   "cuando": "Para separar la varianza de una suma acumulada en suma de varianzas, o para multiplicar probabilidades de eventos en tramos disjuntos de tiempo.",
   "condiciones": [
    "intervalos disjuntos"
   ],
   "slug": "formulario-procesos-estocasticos",
   "ancla": "definiciones-generales",
   "tags": [
    "procesos-estocasticos",
    "incrementos",
    "independencia"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-procesos-estocasticos.md",
    "linea": 33,
    "tipo": "tabla"
   }
  },
  {
   "id": "definiciones-generales--incrementos-estacionarios",
   "unidad": "6",
   "seccion": "Definiciones generales",
   "subseccion": "",
   "nombre": "Incrementos estacionarios",
   "tex": "X(t_2)-X(t_1)\\ \\overset{d}{=}\\ X(t_2{+}\\Delta t)-X(t_1{+}\\Delta t)",
   "cuando": "Para reducir el incremento de un intervalo cualquiera al de un intervalo que arranca en cero: el incremento depende solo de la longitud del tramo, no de dónde está.",
   "condiciones": [
    "misma longitud de intervalo",
    "no implica que el proceso sea estacionario"
   ],
   "slug": "formulario-procesos-estocasticos",
   "ancla": "definiciones-generales",
   "tags": [
    "procesos-estocasticos",
    "incrementos",
    "estacionariedad"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-procesos-estocasticos.md",
    "linea": 34,
    "tipo": "tabla"
   }
  },
  {
   "id": "definiciones-generales--propiedad-de-markov",
   "unidad": "6",
   "seccion": "Definiciones generales",
   "subseccion": "",
   "nombre": "Propiedad de Markov",
   "tex": "p(x_n,t_n\\mid x_{n-1},t_{n-1},\\dots,x_1,t_1)=p(x_n,t_n\\mid x_{n-1},t_{n-1})",
   "cuando": "Para recortar el condicionante a su último instante: en un ejercicio de cadenas, la historia anterior al último estado observado no aporta información.",
   "condiciones": [
    "instantes ordenados",
    "el proceso debe ser de Markov"
   ],
   "slug": "formulario-procesos-estocasticos",
   "ancla": "definiciones-generales",
   "tags": [
    "procesos-estocasticos",
    "markov",
    "condicional"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-procesos-estocasticos.md",
    "linea": 35,
    "tipo": "tabla"
   }
  },
  {
   "id": "definiciones-generales--chapman-kolmogorov-caso-markov",
   "unidad": "6",
   "seccion": "Definiciones generales",
   "subseccion": "",
   "nombre": "Chapman-Kolmogorov (caso Markov)",
   "tex": "p(x_3,t_3\\mid x_1,t_1)=\\sum_{x_2}p(x_3,t_3\\mid x_2,t_2)\\,p(x_2,t_2\\mid x_1,t_1)",
   "cuando": "Para calcular una transición en dos pasos sumando sobre el estado intermedio; es la versión escalar del producto de matrices que da la potencia de la matriz de transición.",
   "condiciones": [
    "proceso de Markov",
    "instantes ordenados"
   ],
   "slug": "formulario-procesos-estocasticos",
   "ancla": "definiciones-generales",
   "tags": [
    "markov",
    "chapman-kolmogorov",
    "transicion"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-procesos-estocasticos.md",
    "linea": 36,
    "tipo": "tabla"
   }
  },
  {
   "id": "definiciones-generales--proceso-de-conteo",
   "unidad": "6",
   "seccion": "Definiciones generales",
   "subseccion": "",
   "nombre": "Proceso de conteo",
   "tex": "N(t)=\\max\\{k:T_k\\le t\\}\\text{, con }N(0)=0\\text{ y }T_0=0\\text{.}",
   "cuando": "Cuando el enunciado da instantes de ocurrencia y pregunta por la cantidad de eventos hasta un tiempo (o al revés). Es la definición que sostiene la dualidad conteo-tiempo.",
   "condiciones": [
    "el instante inicial es cero",
    "los instantes de ocurrencia son no decrecientes",
    "el conteo arranca en cero y toma valores enteros"
   ],
   "slug": "formulario-procesos-estocasticos",
   "ancla": "definiciones-generales",
   "tags": [
    "proceso-de-conteo",
    "procesos-estocasticos"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-procesos-estocasticos.md",
    "linea": 38,
    "tipo": "vineta"
   }
  },
  {
   "id": "caminata-aleatoria--definicion",
   "unidad": "6",
   "seccion": "Caminata aleatoria",
   "subseccion": "",
   "nombre": "Definición",
   "tex": "X_n=\\sum_{k=1}^{n}Y_k\\text{, con }X_0=0\\text{, }P(Y_k=+1)=p\\text{, }P(Y_k=-1)=1-p\\text{ i.i.d.}",
   "cuando": "Punto de partida de todo ejercicio de caminata: se escribe la posición como suma acumulada de pasos independientes e idénticamente distribuidos y de ahí salen esperanza (linealidad) y varianza (independencia).",
   "condiciones": [
    "la posición inicial es cero",
    "los pasos son i.i.d. de valor más uno o menos uno"
   ],
   "slug": "caminata-aleatoria",
   "ancla": "definición",
   "tags": [
    "caminata-aleatoria",
    "suma-de-va"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-procesos-estocasticos.md",
    "linea": 42,
    "tipo": "vineta"
   }
  },
  {
   "id": "caminata-aleatoria--caminata-simetrica-distribucion",
   "unidad": "6",
   "seccion": "Caminata aleatoria",
   "subseccion": "",
   "nombre": "Caminata simétrica — distribución",
   "tex": "P(X_n=x)=\\binom{n}{\\frac{n+x}{2}}\\left(\\tfrac12\\right)^{n}\\text{.}",
   "cuando": "Cuando piden la probabilidad de estar en una posición tras n pasos con moneda equilibrada. Sale de contar los éxitos con una binomial y traducir a la posición.",
   "condiciones": [
    "probabilidad de paso igual a un medio",
    "la posición y el número de pasos deben tener la misma paridad"
   ],
   "slug": "caminata-aleatoria",
   "ancla": "",
   "tags": [
    "caminata-aleatoria",
    "binomial",
    "pmf"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-procesos-estocasticos.md",
    "linea": 43,
    "tipo": "vineta"
   }
  },
  {
   "id": "caminata-aleatoria--caminata-simetrica-momentos",
   "unidad": "6",
   "seccion": "Caminata aleatoria",
   "subseccion": "",
   "nombre": "Caminata simétrica — momentos",
   "tex": "E[X_n]=0\\text{, }\\operatorname{Var}[X_n]=n\\text{.}",
   "cuando": "Respuesta directa de los ejercicios 1 y 3 del TP6: la media se queda en cero pero la varianza crece con el número de pasos, lo que prueba que el proceso no es estacionario.",
   "condiciones": [
    "probabilidad de paso igual a un medio",
    "pasos i.i.d."
   ],
   "slug": "caminata-aleatoria",
   "ancla": "",
   "tags": [
    "caminata-aleatoria",
    "esperanza",
    "varianza"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-procesos-estocasticos.md",
    "linea": 44,
    "tipo": "vineta"
   }
  },
  {
   "id": "caminata-aleatoria--moneda-cargada-distribucion",
   "unidad": "6",
   "seccion": "Caminata aleatoria",
   "subseccion": "",
   "nombre": "Moneda cargada — distribución",
   "tex": "P(X_n=k)=\\binom{n}{(n+k)/2}\\,p^{(n+k)/2}(1-p)^{(n-k)/2}\\text{.}",
   "cuando": "Variante del TP6 ejercicio 2: misma caminata pero con moneda cargada; se usa cuando la probabilidad de paso no es un medio.",
   "condiciones": [
    "probabilidad de paso estrictamente entre cero y uno",
    "la posición y el número de pasos deben tener la misma paridad"
   ],
   "slug": "caminata-aleatoria",
   "ancla": "",
   "tags": [
    "caminata-aleatoria",
    "binomial",
    "pmf"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-procesos-estocasticos.md",
    "linea": 45,
    "tipo": "vineta"
   }
  },
  {
   "id": "caminata-aleatoria--moneda-cargada-momentos",
   "unidad": "6",
   "seccion": "Caminata aleatoria",
   "subseccion": "",
   "nombre": "Moneda cargada — momentos",
   "tex": "E[X_n]=n(2p-1)\\text{, }\\operatorname{Var}[X_n]=4np(1-p)\\text{.}",
   "cuando": "Para la caminata con deriva: la media ya no es cero y crece linealmente con el número de pasos; sirve para dibujar la recta media y la banda de dispersión.",
   "condiciones": [
    "probabilidad de paso estrictamente entre cero y uno",
    "pasos i.i.d. de valor más uno o menos uno"
   ],
   "slug": "caminata-aleatoria",
   "ancla": "",
   "tags": [
    "caminata-aleatoria",
    "esperanza",
    "varianza"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-procesos-estocasticos.md",
    "linea": 46,
    "tipo": "vineta"
   }
  },
  {
   "id": "caminata-aleatoria--vinculo-con-la-binomial",
   "unidad": "6",
   "seccion": "Caminata aleatoria",
   "subseccion": "",
   "nombre": "Vínculo con la binomial",
   "tex": "X_n=2H_n-n\\text{, con }H_n\\sim\\operatorname{Bin}(n,p)\\text{.}",
   "cuando": "Truco para deducir la distribución de la caminata sin combinatoria nueva: se cuentan los pasos ganadores con una binomial y se traduce a la posición.",
   "condiciones": [
    "pasos de valor más uno o menos uno",
    "la binomial cuenta los pasos positivos"
   ],
   "slug": "caminata-aleatoria",
   "ancla": "",
   "tags": [
    "caminata-aleatoria",
    "binomial",
    "cambio-de-variable"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-procesos-estocasticos.md",
    "linea": 47,
    "tipo": "vineta"
   }
  },
  {
   "id": "caminata-aleatoria--paso-i-i-d-general",
   "unidad": "6",
   "seccion": "Caminata aleatoria",
   "subseccion": "",
   "nombre": "Paso i.i.d. general",
   "tex": "X_n=\\sum_{i=0}^{n-1}Z_i\\ \\Rightarrow\\ E[X_n]=n\\,E[Z_0]\\text{, }\\operatorname{Var}[X_n]=n\\operatorname{Var}[Z_0]\\text{.}",
   "cuando": "Cuando el paso no es más o menos uno sino una v.a. discreta cualquiera (TP6 ejercicio 3): se calculan esperanza y varianza del paso y se multiplican por el número de pasos.",
   "condiciones": [
    "pasos i.i.d.",
    "posición inicial cero",
    "la varianza requiere independencia"
   ],
   "slug": "caminata-aleatoria",
   "ancla": "",
   "tags": [
    "caminata-aleatoria",
    "suma-de-va",
    "varianza"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-procesos-estocasticos.md",
    "linea": 48,
    "tipo": "vineta"
   }
  },
  {
   "id": "caminata-aleatoria--caminata-gaussiana",
   "unidad": "6",
   "seccion": "Caminata aleatoria",
   "subseccion": "",
   "nombre": "Caminata gaussiana",
   "tex": "X_n=\\sum_{k=1}^{n}G_k\\sim N(0,\\sqrt{n})\\text{, con }G_k\\sim N(0,1)\\text{ i.i.d.}",
   "cuando": "TP6 ejercicio 4 (movimiento browniano discretizado): pasos continuos normales estándar; como la suma de normales independientes es normal, la posición es normal de varianza igual al número de pasos.",
   "condiciones": [
    "pasos normales estándar i.i.d.",
    "posición inicial cero",
    "parametrización por el desvío: el desvío es la raíz del número de pasos"
   ],
   "slug": "caminata-aleatoria",
   "ancla": "",
   "tags": [
    "caminata-aleatoria",
    "normal",
    "movimiento-browniano"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-procesos-estocasticos.md",
    "linea": 49,
    "tipo": "vineta"
   }
  },
  {
   "id": "proceso-de-bernoulli--axioma-de-un-evento-por-paso",
   "unidad": "6",
   "seccion": "Proceso de Bernoulli",
   "subseccion": "",
   "nombre": "Axioma de un evento por paso",
   "tex": "P\\big(N(k{+}1)-N(k)=1\\big)=p\\text{.}",
   "cuando": "Para verificar que un enunciado en tiempo discreto es efectivamente un proceso de Bernoulli antes de usar binomial o geométrica.",
   "condiciones": [
    "probabilidad constante en todos los pasos"
   ],
   "slug": "proceso-de-bernoulli",
   "ancla": "",
   "tags": [
    "proceso-de-bernoulli",
    "axiomas"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-procesos-estocasticos.md",
    "linea": 60,
    "tipo": "vineta"
   }
  },
  {
   "id": "proceso-de-bernoulli--axioma-de-no-simultaneidad-discreto",
   "unidad": "6",
   "seccion": "Proceso de Bernoulli",
   "subseccion": "",
   "nombre": "Axioma de no simultaneidad (discreto)",
   "tex": "P\\big(N(k{+}1)-N(k)=m\\big)=0\\text{ si }m>1\\text{.}",
   "cuando": "Segundo axioma de la definición: prohíbe más de un evento por paso. Es lo que falla cuando al discretizar un Poisson la probabilidad por ranura pasa de uno.",
   "condiciones": [
    "tiempo discreto",
    "a lo sumo un éxito por intervalo"
   ],
   "slug": "proceso-de-bernoulli",
   "ancla": "",
   "tags": [
    "proceso-de-bernoulli",
    "axiomas"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-procesos-estocasticos.md",
    "linea": 61,
    "tipo": "vineta"
   }
  },
  {
   "id": "proceso-de-bernoulli--conteo-de-exitos",
   "unidad": "6",
   "seccion": "Proceso de Bernoulli",
   "subseccion": "",
   "nombre": "Conteo de éxitos",
   "tex": "P(N(k)=n)=\\binom{k}{n}p^n(1-p)^{k-n}\\text{, es decir }N(k)\\sim\\operatorname{Bin}(k,p)\\text{.}",
   "cuando": "Cuando preguntan cuántos eventos ocurrieron en un número dado de pasos de un proceso de Bernoulli.",
   "condiciones": [
    "ensayos i.i.d. con probabilidad constante",
    "el conteo no puede superar el número de pasos"
   ],
   "slug": "proceso-de-bernoulli",
   "ancla": "",
   "tags": [
    "proceso-de-bernoulli",
    "binomial",
    "conteo"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-procesos-estocasticos.md",
    "linea": 62,
    "tipo": "vineta"
   }
  },
  {
   "id": "proceso-de-bernoulli--incremento-por-estacionariedad",
   "unidad": "6",
   "seccion": "Proceso de Bernoulli",
   "subseccion": "",
   "nombre": "Incremento por estacionariedad",
   "tex": "P\\big(N(m)-N(k)=n\\big)=P\\big(N(m{-}k)=n\\big)\\text{, con }k\\le m\\text{.}",
   "cuando": "Para trasladar un tramo al origen y usar directamente la binomial sobre la longitud del tramo.",
   "condiciones": [
    "instantes ordenados",
    "incrementos estacionarios e independientes"
   ],
   "slug": "proceso-de-bernoulli",
   "ancla": "",
   "tags": [
    "proceso-de-bernoulli",
    "incrementos"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-procesos-estocasticos.md",
    "linea": 63,
    "tipo": "vineta"
   }
  },
  {
   "id": "proceso-de-bernoulli--markov-del-conteo",
   "unidad": "6",
   "seccion": "Proceso de Bernoulli",
   "subseccion": "",
   "nombre": "Markov del conteo",
   "tex": "P\\big(N(m)=n_m\\mid N(\\ell)=n_\\ell,N(k)=n_k\\big)=P\\big(N(m)=n_m\\mid N(\\ell)=n_\\ell\\big)\\text{.}",
   "cuando": "Para descartar la historia anterior al último instante observado al condicionar un conteo de Bernoulli hacia el futuro.",
   "condiciones": [
    "instantes ordenados",
    "incrementos independientes"
   ],
   "slug": "proceso-de-bernoulli",
   "ancla": "",
   "tags": [
    "proceso-de-bernoulli",
    "markov",
    "condicional"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-procesos-estocasticos.md",
    "linea": 64,
    "tipo": "vineta"
   }
  },
  {
   "id": "proceso-de-poisson--axioma-infinitesimal-de-un-evento",
   "unidad": "6",
   "seccion": "Proceso de Poisson",
   "subseccion": "",
   "nombre": "Axioma infinitesimal de un evento",
   "tex": "P\\big(N(t{+}h)-N(t)=1\\big)=\\lambda h+o(h)\\text{.}",
   "cuando": "Para verificar que un enunciado en tiempo continuo es Poisson y para armar el balance del intervalo infinitesimal que da las ecuaciones de Kolmogorov.",
   "condiciones": [
    "tasa positiva y constante",
    "incremento de tiempo pequeño"
   ],
   "slug": "proceso-de-poisson",
   "ancla": "",
   "tags": [
    "proceso-de-poisson",
    "axiomas",
    "infinitesimo"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-procesos-estocasticos.md",
    "linea": 68,
    "tipo": "vineta"
   }
  },
  {
   "id": "proceso-de-poisson--axioma-infinitesimal-de-no-simultaneidad",
   "unidad": "6",
   "seccion": "Proceso de Poisson",
   "subseccion": "",
   "nombre": "Axioma infinitesimal de no simultaneidad",
   "tex": "P\\big(N(t{+}h)-N(t)>1\\big)=o(h)\\text{.}",
   "cuando": "Es el axioma que elimina la tercera rama del balance infinitesimal al dividir por el incremento; sin él no se llega a la ecuación diferencial.",
   "condiciones": [
    "no hay eventos simultáneos"
   ],
   "slug": "proceso-de-poisson",
   "ancla": "",
   "tags": [
    "proceso-de-poisson",
    "axiomas",
    "infinitesimo"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-procesos-estocasticos.md",
    "linea": 69,
    "tipo": "vineta"
   }
  },
  {
   "id": "proceso-de-poisson--notacion-de-infinitesimo",
   "unidad": "6",
   "seccion": "Proceso de Poisson",
   "subseccion": "",
   "nombre": "Notación de infinitésimo",
   "tex": "f(h)=o(h)\\iff\\lim_{h\\to0}\\frac{f(h)}{h}=0\\text{.}",
   "cuando": "Para justificar por escrito que los términos de orden superior desaparecen al pasar al límite en la deducción de las ecuaciones de Kolmogorov.",
   "condiciones": [
    "el incremento tiende a cero"
   ],
   "slug": "proceso-de-poisson",
   "ancla": "",
   "tags": [
    "proceso-de-poisson",
    "infinitesimo",
    "limite"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-procesos-estocasticos.md",
    "linea": 70,
    "tipo": "vineta"
   }
  },
  {
   "id": "proceso-de-poisson--kolmogorov-estado-0",
   "unidad": "6",
   "seccion": "Proceso de Poisson",
   "subseccion": "",
   "nombre": "Kolmogorov — estado 0",
   "tex": "\\dot P_0(t)=-\\lambda P_0(t)\\text{, con }P_0(0)=1\\text{.}",
   "cuando": "Primer paso de la deducción de la distribución del conteo: se integra y da la exponencial decreciente, que es la cola del tiempo entre eventos.",
   "condiciones": [
    "proceso de Poisson de tasa constante",
    "el conteo arranca en cero"
   ],
   "slug": "proceso-de-poisson",
   "ancla": "",
   "tags": [
    "proceso-de-poisson",
    "kolmogorov",
    "ecuacion-diferencial"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-procesos-estocasticos.md",
    "linea": 71,
    "tipo": "vineta"
   }
  },
  {
   "id": "proceso-de-poisson--kolmogorov-estado",
   "unidad": "6",
   "seccion": "Proceso de Poisson",
   "subseccion": "",
   "nombre": "Kolmogorov — estado $n\\ge1$",
   "tex": "\\dot P_n(t)=-\\lambda P_n(t)+\\lambda P_{n-1}(t)\\text{, con }P_n(0)=0\\text{.}",
   "cuando": "Sistema recursivo que, resuelto por inducción, produce la masa de Poisson. Aparece cuando el enunciado pide deducir (no solo usar) la distribución del conteo.",
   "condiciones": [
    "índice mayor o igual que uno",
    "los dos términos salen de las ramas de ningún evento y de un evento en el intervalo infinitesimal"
   ],
   "slug": "proceso-de-poisson",
   "ancla": "",
   "tags": [
    "proceso-de-poisson",
    "kolmogorov",
    "ecuacion-diferencial"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-procesos-estocasticos.md",
    "linea": 72,
    "tipo": "vineta"
   }
  },
  {
   "id": "proceso-de-poisson--kolmogorov-primeras-soluciones",
   "unidad": "6",
   "seccion": "Proceso de Poisson",
   "subseccion": "",
   "nombre": "Kolmogorov — primeras soluciones",
   "tex": "P_0(t)=e^{-\\lambda t}\\text{, }P_1(t)=\\lambda t\\,e^{-\\lambda t}\\text{.}",
   "cuando": "Arranque de la inducción: sirve para verificar que la solución general de la masa de Poisson es correcta.",
   "condiciones": [
    "resuelve el sistema de Kolmogorov con las condiciones iniciales"
   ],
   "slug": "proceso-de-poisson",
   "ancla": "",
   "tags": [
    "proceso-de-poisson",
    "kolmogorov",
    "solucion"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-procesos-estocasticos.md",
    "linea": 73,
    "tipo": "vineta"
   }
  },
  {
   "id": "proceso-de-poisson--conteo-en",
   "unidad": "6",
   "seccion": "Proceso de Poisson",
   "subseccion": "",
   "nombre": "Conteo en $[0,t]$",
   "tex": "P(N(t)=n)=\\frac{(\\lambda t)^n}{n!}e^{-\\lambda t}\\text{, con }E[N(t)]=\\operatorname{Var}[N(t)]=\\lambda t\\text{.}",
   "cuando": "Fórmula central de la unidad: cuántos eventos en un tiempo dado. Antes de aplicarla hay que llevar la tasa y el tiempo a las mismas unidades.",
   "condiciones": [
    "proceso de Poisson de tasa constante",
    "conteo no negativo",
    "por incrementos estacionarios vale en cualquier intervalo de esa longitud"
   ],
   "slug": "proceso-de-poisson",
   "ancla": "",
   "tags": [
    "proceso-de-poisson",
    "poisson",
    "conteo"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-procesos-estocasticos.md",
    "linea": 74,
    "tipo": "vineta"
   }
  },
  {
   "id": "proceso-de-poisson--cola-del-tiempo-entre-eventos",
   "unidad": "6",
   "seccion": "Proceso de Poisson",
   "subseccion": "",
   "nombre": "Cola del tiempo entre eventos",
   "tex": "P(\\tau_{n+1}>t)=P(N(t)=0)=e^{-\\lambda t}\\text{, de donde }\\tau_{n+1}\\sim\\operatorname{Expo}(\\lambda)\\text{.}",
   "cuando": "Para deducir (no memorizar) que los tiempos entre eventos son exponenciales: la espera supera un tiempo si y solo si no hubo eventos en ese tramo.",
   "condiciones": [
    "tiempo positivo",
    "incrementos independientes y estacionarios"
   ],
   "slug": "proceso-de-poisson",
   "ancla": "",
   "tags": [
    "proceso-de-poisson",
    "exponencial",
    "tiempo-de-espera"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-procesos-estocasticos.md",
    "linea": 75,
    "tipo": "vineta"
   }
  },
  {
   "id": "proceso-de-poisson--dualidad-conteo-tiempo",
   "unidad": "6",
   "seccion": "Proceso de Poisson",
   "subseccion": "",
   "nombre": "Dualidad conteo-tiempo",
   "tex": "T_k<t\\iff N(t)\\ge k\\text{.}",
   "cuando": "Cuando piden una probabilidad sobre el tiempo hasta el k-ésimo evento (Erlang sin primitiva cerrada) y conviene convertirla en una suma finita de términos de Poisson, o al revés.",
   "condiciones": [
    "el instante del k-ésimo evento y el conteo se refieren al mismo proceso",
    "los dos sucesos son el mismo conjunto, no una aproximación"
   ],
   "slug": "proceso-de-poisson",
   "ancla": "dualidad-conteo-tiempo-clave-para-ejercicios",
   "tags": [
    "proceso-de-poisson",
    "dualidad",
    "erlang"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-procesos-estocasticos.md",
    "linea": 76,
    "tipo": "vineta"
   }
  },
  {
   "id": "proceso-de-poisson--condicionar-el-pasado-al-futuro",
   "unidad": "6",
   "seccion": "Proceso de Poisson",
   "subseccion": "",
   "nombre": "Condicionar el pasado al futuro",
   "tex": "\\big(N(t_1)\\mid N(t_2)=n_2\\big)\\sim\\operatorname{Bin}\\!\\left(n_2,\\tfrac{t_1}{t_2}\\right)\\text{, con }t_1<t_2\\text{.}",
   "cuando": "Cuando el condicionante está en el futuro (se sabe el total en el intervalo grande y preguntan por el chico): NO vale el atajo del incremento; cada evento cae uniforme e independiente en el intervalo grande.",
   "condiciones": [
    "el instante preguntado es anterior al condicionante",
    "proceso de Poisson homogéneo"
   ],
   "slug": "proceso-de-poisson",
   "ancla": "",
   "tags": [
    "proceso-de-poisson",
    "condicional",
    "binomial",
    "error-comun"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-procesos-estocasticos.md",
    "linea": 77,
    "tipo": "vineta"
   }
  },
  {
   "id": "relacion-bernoulli-poisson--correspondencia-de-parametros",
   "unidad": "6",
   "seccion": "Relación Bernoulli ↔ Poisson",
   "subseccion": "",
   "nombre": "Correspondencia de parámetros",
   "tex": "p=\\lambda\\,\\Delta t\\text{.}",
   "cuando": "Para traducir un proceso de Poisson a uno de Bernoulli al discretizar el tiempo (y para detectar que la ranura es demasiado grande si la probabilidad pasa de uno).",
   "condiciones": [
    "ranura suficientemente chica para que la probabilidad no pase de uno",
    "a lo sumo un evento por ranura"
   ],
   "slug": "relacion-bernoulli-poisson",
   "ancla": "correspondencia-de-parámetros",
   "tags": [
    "relacion-bernoulli-poisson",
    "discretizacion"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-procesos-estocasticos.md",
    "linea": 81,
    "tipo": "vineta"
   }
  },
  {
   "id": "relacion-bernoulli-poisson--aproximacion-binomial-del-conteo",
   "unidad": "6",
   "seccion": "Relación Bernoulli ↔ Poisson",
   "subseccion": "",
   "nombre": "Aproximación binomial del conteo",
   "tex": "N(t)\\ \\underset{\\text{aprox}}{\\sim}\\ \\operatorname{Bin}\\!\\left(\\frac{t}{\\Delta t},\\,\\lambda\\,\\Delta t\\right)\\text{.}",
   "cuando": "Cuando el ejercicio pide mostrar el vínculo entre los dos procesos: se parte el intervalo en ranuras y se aproxima el conteo con una binomial de la misma media.",
   "condiciones": [
    "la probabilidad por ranura no puede pasar de uno",
    "la aproximación mejora al achicar la ranura"
   ],
   "slug": "relacion-bernoulli-poisson",
   "ancla": "",
   "tags": [
    "relacion-bernoulli-poisson",
    "binomial",
    "aproximacion"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-procesos-estocasticos.md",
    "linea": 82,
    "tipo": "vineta"
   }
  },
  {
   "id": "relacion-bernoulli-poisson--paso-al-limite",
   "unidad": "6",
   "seccion": "Relación Bernoulli ↔ Poisson",
   "subseccion": "",
   "nombre": "Paso al límite",
   "tex": "\\binom{t/\\Delta t}{n}(\\lambda\\Delta t)^n(1-\\lambda\\Delta t)^{\\frac{t}{\\Delta t}-n}\\xrightarrow[\\Delta t\\to0]{}\\frac{(\\lambda t)^n}{n!}e^{-\\lambda t}\\text{.}",
   "cuando": "Para justificar formalmente que el proceso de Poisson es el límite continuo del de Bernoulli (mismo argumento que la aproximación de Poisson a la binomial, leído como procesos).",
   "condiciones": [
    "la ranura tiende a cero con la media fija",
    "el conteo queda fijo"
   ],
   "slug": "relacion-bernoulli-poisson",
   "ancla": "",
   "tags": [
    "relacion-bernoulli-poisson",
    "limite",
    "poisson"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-procesos-estocasticos.md",
    "linea": 83,
    "tipo": "vineta"
   }
  },
  {
   "id": "cadenas-de-markov--un-paso",
   "unidad": "6",
   "seccion": "Cadenas de Markov",
   "subseccion": "",
   "nombre": "Un paso",
   "tex": "\\vec p(n+1)=\\vec p(n)\\,\\mathbb{P}(n)",
   "cuando": "Para avanzar un paso la distribución de estados; es Chapman-Kolmogorov en forma matricial.",
   "condiciones": [
    "vector fila que suma uno",
    "matriz estocástica por filas"
   ],
   "slug": "cadenas-de-markov",
   "ancla": "",
   "tags": [
    "cadenas-de-markov",
    "matriz-de-transicion"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-procesos-estocasticos.md",
    "linea": 89,
    "tipo": "tabla"
   }
  },
  {
   "id": "cadenas-de-markov--cadena-homogenea",
   "unidad": "6",
   "seccion": "Cadenas de Markov",
   "subseccion": "",
   "nombre": "Cadena homogénea",
   "tex": "\\vec p(n)=\\vec p(0)\\,\\mathbb{P}^{n}\\text{, con }\\mathbb{P}^{(k)}=\\mathbb{P}^{k}",
   "cuando": "Cuando preguntan la probabilidad de estar en un estado tras n pasos partiendo de una distribución inicial dada.",
   "condiciones": [
    "las probabilidades de transición no dependen del paso",
    "solo condiciona hacia el futuro"
   ],
   "slug": "cadenas-de-markov",
   "ancla": "cadena-homogénea",
   "tags": [
    "cadenas-de-markov",
    "potencia-de-matriz"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-procesos-estocasticos.md",
    "linea": 90,
    "tipo": "tabla"
   }
  },
  {
   "id": "cadenas-de-markov--distribucion-estacionaria",
   "unidad": "6",
   "seccion": "Cadenas de Markov",
   "subseccion": "",
   "nombre": "Distribución estacionaria",
   "tex": "\\vec\\pi=\\vec\\pi\\,\\mathbb{P}\\text{, con }\\sum_j\\pi_j=1",
   "cuando": "Pregunta de largo plazo: fracción de tiempo en cada estado o límite de la distribución. Se resuelve como sistema lineal con la restricción de que las probabilidades sumen uno.",
   "condiciones": [
    "verificar ANTES la regularidad (alguna potencia con todas sus entradas positivas)",
    "no toda solución del sistema es distribución estacionaria si la cadena no es regular"
   ],
   "slug": "cadenas-de-markov",
   "ancla": "distribución-estacionaria",
   "tags": [
    "cadenas-de-markov",
    "estacionaria",
    "largo-plazo"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-procesos-estocasticos.md",
    "linea": 91,
    "tipo": "tabla"
   }
  },
  {
   "id": "cadenas-de-markov--condicionar-hacia-el-pasado-bayes",
   "unidad": "6",
   "seccion": "Cadenas de Markov",
   "subseccion": "",
   "nombre": "Condicionar hacia el pasado (Bayes)",
   "tex": "P\\big(X(n){=}s_i\\mid X(n{+}k){=}s_j\\big)=\\frac{P(X(n{+}k){=}s_j\\mid X(n){=}s_i)\\,P(X(n){=}s_i)}{P(X(n{+}k){=}s_j)}\\text{.}",
   "cuando": "Cuando el condicionante es un instante posterior a la pregunta: no hay atajo matricial, hay que aplicar Bayes con las entradas de la potencia de la matriz y la distribución marginal.",
   "condiciones": [
    "denominador no nulo",
    "la potencia de la matriz solo sirve para el sentido futuro"
   ],
   "slug": "cadenas-de-markov",
   "ancla": "",
   "tags": [
    "cadenas-de-markov",
    "bayes",
    "error-comun"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-procesos-estocasticos.md",
    "linea": 93,
    "tipo": "vineta"
   }
  },
  {
   "id": "cadenas-de-markov--forma-canonica-con-absorbentes",
   "unidad": "6",
   "seccion": "Cadenas de Markov",
   "subseccion": "",
   "nombre": "Forma canónica con absorbentes",
   "tex": "\\mathbb{P}=\\begin{pmatrix}\\mathbb{I} & \\mathbf{0}\\\\ \\mathbb{F} & \\mathbb{Q}\\end{pmatrix}\\text{.}",
   "cuando": "Primer paso de todo ejercicio de absorción: reordenar los estados poniendo los absorbentes primero para leer los bloques de transitorio a absorbente y de transitorio a transitorio.",
   "condiciones": [
    "los primeros estados son los absorbentes",
    "el bloque nulo lo es porque de un absorbente no se sale"
   ],
   "slug": "cadenas-de-markov",
   "ancla": "",
   "tags": [
    "cadenas-de-markov",
    "absorcion",
    "forma-canonica"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-procesos-estocasticos.md",
    "linea": 94,
    "tipo": "vineta"
   }
  },
  {
   "id": "cadenas-de-markov--matriz-fundamental-de-absorcion",
   "unidad": "6",
   "seccion": "Cadenas de Markov",
   "subseccion": "",
   "nombre": "Matriz fundamental de absorción",
   "tex": "\\mathbb{M}=(\\mathbb{I}-\\mathbb{Q})^{-1}\\text{.}",
   "cuando": "Cada entrada es el número esperado de visitas a un estado transitorio partiendo de otro antes de ser absorbido; sumando la fila se obtiene el tiempo total esperado hasta la absorción.",
   "condiciones": [
    "cadena absorbente en forma canónica",
    "la resta debe ser invertible (todo transitorio se abandona con probabilidad uno)"
   ],
   "slug": "cadenas-de-markov",
   "ancla": "",
   "tags": [
    "cadenas-de-markov",
    "absorcion",
    "matriz-fundamental"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-procesos-estocasticos.md",
    "linea": 95,
    "tipo": "vineta"
   }
  },
  {
   "id": "cadenas-de-markov--probabilidades-de-absorcion",
   "unidad": "6",
   "seccion": "Cadenas de Markov",
   "subseccion": "",
   "nombre": "Probabilidades de absorción",
   "tex": "\\mathbb{G}=\\mathbb{M}\\,\\mathbb{F}\\text{.}",
   "cuando": "Responde con qué probabilidad la cadena termina absorbida en cada estado absorbente si arrancó en un transitorio dado (por ejemplo: termina la novela o renuncia).",
   "condiciones": [
    "dos o más estados absorbentes",
    "la matriz fundamental ya calculada"
   ],
   "slug": "cadenas-de-markov",
   "ancla": "",
   "tags": [
    "cadenas-de-markov",
    "absorcion",
    "probabilidad"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-procesos-estocasticos.md",
    "linea": 96,
    "tipo": "vineta"
   }
  },
  {
   "id": "cadenas-de-markov--tiempo-total-hasta-la-absorcion",
   "unidad": "6",
   "seccion": "Cadenas de Markov",
   "subseccion": "",
   "nombre": "Tiempo total hasta la absorción",
   "tex": "\\mathbb{M}\\,(1,1,\\dots,1)^{\\top}\\text{.}",
   "cuando": "Cuando piden cuántos pasos en promedio tarda la cadena en ser absorbida partiendo de cada estado transitorio: es la suma por filas de la matriz fundamental.",
   "condiciones": [
    "cadena absorbente",
    "vector columna de unos de la dimensión del bloque transitorio"
   ],
   "slug": "cadenas-de-markov",
   "ancla": "tiempo-hasta-absorción",
   "tags": [
    "cadenas-de-markov",
    "absorcion",
    "tiempo-esperado"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-procesos-estocasticos.md",
    "linea": 97,
    "tipo": "vineta"
   }
  },
  {
   "id": "cadenas-de-markov--matriz-cadena-regular",
   "unidad": "6",
   "seccion": "Cadenas de Markov",
   "subseccion": "",
   "nombre": "Matriz $\\mathbb{Z}$ (cadena regular)",
   "tex": "\\mathbb{Z}=(\\mathbb{I}-\\mathbb{P}+\\mathbb{W})^{-1}\\text{, con }\\mathbb{W}\\text{ de filas iguales a }\\vec\\pi\\text{.}",
   "cuando": "En una cadena regular no hay absorbentes y la resta sola no es invertible; esta matriz es el reemplazo que permite calcular tiempos de primer paso y de recurrencia.",
   "condiciones": [
    "cadena regular",
    "distribución estacionaria ya calculada",
    "la matriz auxiliar tiene todas sus filas iguales a la estacionaria"
   ],
   "slug": "cadenas-de-markov",
   "ancla": "",
   "tags": [
    "cadenas-de-markov",
    "tiempos-de-espera",
    "matriz-fundamental"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-procesos-estocasticos.md",
    "linea": 98,
    "tipo": "vineta"
   }
  },
  {
   "id": "cadenas-de-markov--tiempo-esperado-de-primer-paso",
   "unidad": "6",
   "seccion": "Cadenas de Markov",
   "subseccion": "",
   "nombre": "Tiempo esperado de primer paso",
   "tex": "E(T_{i,j})=\\frac{\\mathbb{Z}(j,j)-\\mathbb{Z}(i,j)}{w_j}\\text{, para }i\\ne j\\text{.}",
   "cuando": "Cuántos pasos en promedio tarda la cadena en llegar por primera vez a un estado partiendo de otro distinto.",
   "condiciones": [
    "estados de partida y llegada distintos",
    "cadena regular",
    "el peso es la probabilidad estacionaria del estado de llegada"
   ],
   "slug": "cadenas-de-markov",
   "ancla": "tiempo-de-recurrencia-primer-paso-cadenas-regulares",
   "tags": [
    "cadenas-de-markov",
    "primer-paso",
    "tiempo-esperado"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-procesos-estocasticos.md",
    "linea": 99,
    "tipo": "vineta"
   }
  },
  {
   "id": "cadenas-de-markov--tiempo-medio-de-recurrencia",
   "unidad": "6",
   "seccion": "Cadenas de Markov",
   "subseccion": "",
   "nombre": "Tiempo medio de recurrencia",
   "tex": "E(T_{j,j})=\\frac{1}{w_j}\\text{.}",
   "cuando": "Cuántos pasos en promedio tarda la cadena en volver a un estado: es el recíproco de su probabilidad de largo plazo, sin necesidad de calcular la matriz auxiliar.",
   "condiciones": [
    "cadena regular",
    "probabilidad estacionaria del estado positiva"
   ],
   "slug": "cadenas-de-markov",
   "ancla": "",
   "tags": [
    "cadenas-de-markov",
    "recurrencia",
    "estacionaria"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-procesos-estocasticos.md",
    "linea": 100,
    "tipo": "vineta"
   }
  },
  {
   "id": "cadenas-de-markov--probabilidad-de-primera-visita",
   "unidad": "6",
   "seccion": "Cadenas de Markov",
   "subseccion": "",
   "nombre": "Probabilidad de primera visita",
   "tex": "q_{ij}(n)=P\\big(X_n=j,\\ X_m\\ne j\\ \\forall\\,1\\le m\\le n{-}1\\mid X_0=i\\big)\\text{, con }q_{ij}=\\sum_{n\\ge1}q_{ij}(n)\\text{.}",
   "cuando": "Cuando piden la probabilidad de alcanzar alguna vez un estado desde otro: se arman los caminos forzados para cada cantidad de pasos y se suma la serie (habitualmente geométrica).",
   "condiciones": [
    "los eventos para distinto número de pasos son disjuntos",
    "la serie converge; valor uno indica clase recurrente"
   ],
   "slug": "cadenas-de-markov",
   "ancla": "",
   "tags": [
    "cadenas-de-markov",
    "primera-visita",
    "serie-geometrica"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-procesos-estocasticos.md",
    "linea": 101,
    "tipo": "vineta"
   }
  },
  {
   "id": "cadenas-de-markov--tiempo-de-vida-geometrico-dos-estados",
   "unidad": "6",
   "seccion": "Cadenas de Markov",
   "subseccion": "",
   "nombre": "Tiempo de vida geométrico (dos estados)",
   "tex": "P(N=k)=(1-p)^{k}p\\text{, con }E[N]=\\frac{1-p}{p}\\text{.}",
   "cuando": "Patrón de cadena con un único estado de salida: el tiempo hasta la absorción es geométrico en la convención de fracasos antes del éxito (TP6 ejercicio 24, años de vida).",
   "condiciones": [
    "dos estados con uno absorbente",
    "probabilidad de salto constante",
    "convención: cuenta fracasos, soporte que incluye el cero"
   ],
   "slug": "cadenas-de-markov",
   "ancla": "",
   "tags": [
    "cadenas-de-markov",
    "geometrica",
    "absorcion"
   ],
   "esencial": false,
   "origen": {
    "archivo": "wiki/formularios/formulario-procesos-estocasticos.md",
    "linea": 102,
    "tipo": "vineta"
   }
  }
 ]
};
