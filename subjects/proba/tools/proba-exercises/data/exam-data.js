/* ============================================================
   data/exam-data.js — GENERADO por `scripts/extract-exam-data.mjs`.
   No editar a mano: se regenera desde `estudio/study-data.js` del
   baseline de Proba.

   Publica `window.EXAMEN = { QUIZ, DISTS }`, el banco de opción múltiple
   del simulador de parcial. Son datos puros: las funciones vivas de las
   distribuciones (`f`, `domain`, `mean`, `varc`) no entran porque el
   generador de preguntas solo lee `id`, `name`, `slug` y `tex`.

   Este archivo es el PRIMER script del manifiesto, antes que
   `parcial.js`.
   ============================================================ */
window.EXAMEN = {
 "QUIZ": [
  {
   "q": "De una caja con 7 bolas (3 rojas) se extraen 4 sin reposición. ¿Qué distribución tiene la cantidad de rojas?",
   "options": [
    "Binomial",
    "Hipergeométrica",
    "Poisson",
    "Geométrica"
   ],
   "correct": 1,
   "explain": "Muestreo sin reposición de una población finita ⇒ hipergeométrica.",
   "slug": "distribucion-hipergeometrica"
  },
  {
   "q": "Llamadas a una central: en promedio 5 por minuto, ¿cuántas en 3 minutos?",
   "options": [
    "Binomial(15,·)",
    "Poisson(15)",
    "Exponencial(5)",
    "Geométrica(5)"
   ],
   "correct": 1,
   "explain": "Conteo de eventos en un intervalo con tasa media ⇒ Poisson con λt = 5·3 = 15.",
   "slug": "distribucion-poisson"
  },
  {
   "q": "Tiempo hasta la primera falla de un componente sin envejecimiento (tasa constante).",
   "options": [
    "Normal",
    "Exponencial",
    "Uniforme",
    "Weibull con b≠1"
   ],
   "correct": 1,
   "explain": "Falta de memoria / tasa de fallas constante ⇒ exponencial.",
   "slug": "distribucion-exponencial"
  },
  {
   "q": "¿Cuál distribución tiene media = varianza?",
   "options": [
    "Binomial",
    "Normal",
    "Poisson",
    "Exponencial"
   ],
   "correct": 2,
   "explain": "Poisson: $E[X]=V(X)=\\lambda$.",
   "slug": "distribucion-poisson"
  },
  {
   "q": "Para σ desconocido y n chico, el estadístico de la media sigue una…",
   "options": [
    "Normal estándar",
    "t de Student con n−1 g.l.",
    "Ji-cuadrado",
    "F"
   ],
   "correct": 1,
   "explain": "$T=(\\bar X-\\mu_0)/(S/\\sqrt n)\\sim t_{n-1}$.",
   "slug": "distribucion-t-de-student"
  },
  {
   "q": "¿Qué mide la potencia de una prueba?",
   "options": [
    "$\\alpha$",
    "$1-\\alpha$",
    "$\\beta$",
    "$1-\\beta$"
   ],
   "correct": 3,
   "explain": "Potencia $=1-\\beta=$ probabilidad de rechazar $H_0$ cuando es falsa.",
   "slug": "error-tipo-i-y-tipo-ii"
  },
  {
   "q": "Se rechaza $H_0$ cuando el valor p…",
   "options": [
    "$> \\alpha$",
    "$< \\alpha$",
    "$=0.5$",
    "$>0.5$"
   ],
   "correct": 1,
   "explain": "Regla: rechazar $H_0\\iff p<\\alpha$.",
   "slug": "valor-p"
  },
  {
   "q": "$(n-1)S^2/\\sigma^2$ se distribuye como…",
   "options": [
    "Normal",
    "t de Student",
    "Ji-cuadrado con n−1 g.l.",
    "Exponencial"
   ],
   "correct": 2,
   "explain": "Resultado base para inferir sobre la varianza.",
   "slug": "distribucion-ji-cuadrado"
  },
  {
   "q": "La suma de n exponenciales i.i.d. de tasa λ es…",
   "options": [
    "Exponencial(nλ)",
    "Gamma/Erlang(n,λ)",
    "Normal",
    "Poisson"
   ],
   "correct": 1,
   "explain": "Suma de exponenciales ⇒ Gamma de forma entera = Erlang(n,λ).",
   "slug": "distribucion-erlang"
  },
  {
   "q": "Incorrelación (Cov=0) implica independencia…",
   "options": [
    "Siempre",
    "Nunca",
    "Solo en la normal bivariada",
    "Solo si E[X]=0"
   ],
   "correct": 2,
   "explain": "En general no; sí vale el recíproco para la normal bivariada.",
   "slug": "independencia-de-variables-aleatorias"
  },
  {
   "q": "¿Cuándo conviene aproximar la binomial por la Poisson?",
   "options": [
    "n chico, p grande",
    "n grande, p chico (np moderado)",
    "n grande, p≈0.5",
    "siempre"
   ],
   "correct": 1,
   "explain": "Eventos raros: $n\\to\\infty$, $p\\to0$ con $\\lambda=np$ fijo.",
   "slug": "distribucion-poisson"
  },
  {
   "q": "El segundo parámetro de $N(\\mu,\\cdot)$ en la cátedra es…",
   "options": [
    "la varianza σ²",
    "el desvío σ",
    "el rango",
    "la mediana"
   ],
   "correct": 1,
   "explain": "La cátedra usa el DESVÍO σ como segundo parámetro.",
   "slug": "distribucion-normal"
  },
  {
   "q": "Número de fracasos antes del primer éxito (convención de la cátedra):",
   "options": [
    "Binomial",
    "Geométrica (soporte ℕ₀)",
    "Binomial negativa",
    "Poisson"
   ],
   "correct": 1,
   "explain": "Geométrica que cuenta fracasos: $E=q/p$, soporte $\\mathbb N_0$.",
   "slug": "distribucion-geometrica"
  },
  {
   "q": "$\\bar X_n$ converge a $\\mu$ cuando $n\\to\\infty$. Esto es la…",
   "options": [
    "TCL",
    "Ley de grandes números",
    "Desigualdad de Markov",
    "Regla de Laplace"
   ],
   "correct": 1,
   "explain": "LGN: el promedio muestral converge a la media poblacional.",
   "slug": "ley-de-grandes-numeros"
  },
  {
   "q": "Corrección por continuidad se usa al aproximar una v.a. … por una continua.",
   "options": [
    "continua",
    "discreta",
    "normal",
    "uniforme"
   ],
   "correct": 1,
   "explain": "Al pasar de discreta (p.ej. binomial) a normal se ajusta $\\pm0.5$.",
   "slug": "aproximacion-normal-de-la-binomial"
  }
 ],
 "DISTS": [
  {
   "id": "bernoulli",
   "name": "Bernoulli",
   "slug": "distribucion-bernoulli",
   "tex": {
    "mean": "E[X]=p",
    "var": "V(X)=p\\,q"
   }
  },
  {
   "id": "binomial",
   "name": "Binomial",
   "slug": "distribucion-binomial",
   "tex": {
    "mean": "E[X]=n\\,p",
    "var": "V(X)=n\\,p\\,q"
   }
  },
  {
   "id": "geometrica",
   "name": "Geométrica",
   "slug": "distribucion-geometrica",
   "tex": {
    "mean": "E[X]=\\dfrac{q}{p}",
    "var": "V(X)=\\dfrac{q}{p^{2}}"
   }
  },
  {
   "id": "binomial-negativa",
   "name": "Binomial negativa",
   "slug": "distribucion-binomial-negativa",
   "tex": {
    "mean": "E[X]=\\dfrac{r\\,q}{p}",
    "var": "V(X)=\\dfrac{r\\,q}{p^{2}}"
   }
  },
  {
   "id": "hipergeometrica",
   "name": "Hipergeométrica",
   "slug": "distribucion-hipergeometrica",
   "tex": {
    "mean": "E[X]=n\\dfrac{M}{N}",
    "var": "V(X)=n\\,p\\,q\\,\\dfrac{N-n}{N-1}"
   }
  },
  {
   "id": "poisson",
   "name": "Poisson",
   "slug": "distribucion-poisson",
   "tex": {
    "mean": "E[X]=\\lambda",
    "var": "V(X)=\\lambda"
   }
  },
  {
   "id": "uniforme",
   "name": "Uniforme continua",
   "slug": "distribucion-uniforme-continua",
   "tex": {
    "mean": "E[X]=\\dfrac{a+b}{2}",
    "var": "V(X)=\\dfrac{(b-a)^2}{12}"
   }
  },
  {
   "id": "exponencial",
   "name": "Exponencial",
   "slug": "distribucion-exponencial",
   "tex": {
    "mean": "E[X]=\\dfrac{1}{\\lambda}",
    "var": "V(X)=\\dfrac{1}{\\lambda^{2}}"
   }
  },
  {
   "id": "normal",
   "name": "Normal",
   "slug": "distribucion-normal",
   "tex": {
    "mean": "E[X]=\\mu",
    "var": "V(X)=\\sigma^{2}"
   }
  },
  {
   "id": "gamma",
   "name": "Gamma",
   "slug": "distribucion-gamma",
   "tex": {
    "mean": "E[X]=\\dfrac{\\alpha}{\\lambda}",
    "var": "V(X)=\\dfrac{\\alpha}{\\lambda^{2}}"
   }
  },
  {
   "id": "erlang",
   "name": "Erlang",
   "slug": "distribucion-erlang",
   "tex": {
    "mean": "E[T_k]=\\dfrac{k}{\\lambda}",
    "var": "V(T_k)=\\dfrac{k}{\\lambda^{2}}"
   }
  },
  {
   "id": "weibull",
   "name": "Weibull",
   "slug": "distribucion-weibull",
   "tex": {
    "mean": "E[X]=\\tfrac{1}{\\lambda}\\Gamma(1+\\tfrac1b)",
    "var": "V(X)=\\tfrac{1}{\\lambda^2}\\big[\\Gamma(1+\\tfrac2b)-\\Gamma(1+\\tfrac1b)^2\\big]"
   }
  },
  {
   "id": "t",
   "name": "t de Student",
   "slug": "distribucion-t-de-student",
   "tex": {
    "mean": "E[T]=0\\ (m>1)",
    "var": "V(T)=\\dfrac{m}{m-2}\\ (m>2)"
   }
  },
  {
   "id": "chi2",
   "name": "Ji-cuadrado χ²",
   "slug": "distribucion-ji-cuadrado",
   "tex": {
    "mean": "E[X]=k",
    "var": "V(X)=2k"
   }
  }
 ]
};
