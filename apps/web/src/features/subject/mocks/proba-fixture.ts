/**
 * Materia de mentira para el smoke visual (`?mock=1` en desarrollo): la config
 * REAL de Proba (`examples/proba/sinapsis.config.json`, validada con zod) y doce
 * páginas sintéticas repartidas en tres divisiones y tres tipos, dos estudiadas.
 *
 * En producción no se importa nunca: `useSubject` solo lo carga (import dinámico)
 * cuando `isMockMode()` es verdadero, y ese guardia ya exige `import.meta.env.DEV`.
 */
import {
  SubjectConfig,
  type Page,
  type PageDetail,
  type PageMeta,
  type SearchHit,
  type SubjectDetail,
} from "@sinapsis/contract";
import rawProbaConfig from "../../../../../../examples/proba/sinapsis.config.json";

export const probaConfig: SubjectConfig = SubjectConfig.parse(rawProbaConfig);

function meta(
  slug: string,
  title: string,
  type: string,
  division: string,
  summary: string,
  extra: Partial<PageMeta> = {},
): PageMeta {
  return {
    slug,
    title,
    type,
    folder: type + "s",
    division,
    summary,
    tags: [],
    sources: [],
    words: 420,
    updatedAt: "2026-09-01",
    ...extra,
  };
}

export const mockPages: PageMeta[] = [
  // ── U1 · Estadística Descriptiva ───────────────────────────────────────────
  meta("estadistica-descriptiva", "Estadística Descriptiva", "concepto", "1",
    "Qué describe una muestra y con qué medidas: posición, dispersión y forma.", { order: 1 }),
  meta("medidas-de-tendencia-central", "Medidas de tendencia central", "concepto", "1",
    "Media $\\bar{x}$, mediana y moda: cuándo cada una representa mejor al conjunto.", { order: 2 }),
  meta("medidas-de-dispersion", "Medidas de dispersión", "concepto", "1",
    "Varianza $s^2$, desvío estándar y rango intercuartílico.", { order: 3 }),
  meta("histograma-y-frecuencias", "Histograma y frecuencias", "concepto", "1",
    "Datos agrupados, ancho de clase y lectura de la forma de la distribución.", { order: 4 }),
  meta("teorica-01-descriptiva", "Teórica 01 — Descriptiva", "fuente", "1",
    "Diapositivas de la cátedra, unidad 1.", { format: "slides" }),

  // ── U2 · Introducción a la Probabilidad ───────────────────────────────────
  meta("probabilidad-condicional", "Probabilidad condicional", "concepto", "2",
    "$P(A\\mid B)$: cómo cambia la incertidumbre cuando algo ya ocurrió.", { order: 1 }),
  meta("independencia-de-sucesos", "Independencia de sucesos", "concepto", "2",
    "Cuándo $P(A\\cap B)=P(A)P(B)$ y por qué casi nunca se cumple por casualidad.", { order: 2 }),
  meta("tp1-probabilidad", "TP1 (2026) — Probabilidad", "fuente", "2",
    "Trabajo práctico 1 con resoluciones comentadas.", { format: "pdf" }),

  // ── U4 · Variables Aleatorias Continuas ───────────────────────────────────
  meta("variable-aleatoria-continua", "Variable Aleatoria Continua", "concepto", "4",
    "Densidad, acumulada y por qué $P(X=x)=0$ en el caso continuo.", { order: 1 }),
  meta("distribucion-normal", "Distribución Normal", "distribucion", "4",
    'La "campana" $N(\\mu,\\sigma)$: simétrica alrededor de $\\mu$ y con dispersión fijada por $\\sigma$.',
    { order: 2, sources: ["teorica-04-continuas"], tags: ["continua", "normal"] }),
  meta("distribucion-exponencial", "Distribución Exponencial", "distribucion", "4",
    "Tiempo hasta el primer evento de un proceso de Poisson: sin memoria.", { order: 3 }),
  meta("teorica-04-continuas", "Teórica 04 — Continuas", "fuente", "4",
    "Diapositivas de la cátedra, unidad 4.", { format: "slides" }),
];

export const mockStudied: string[] = ["estadistica-descriptiva", "medidas-de-tendencia-central"];

export function mockSubjectDetail(slug: string): SubjectDetail {
  return {
    config: { ...probaConfig, slug },
    pages: mockPages,
    studied: mockStudied,
    placeholder: false,
    lastSyncAt: "2026-09-04T18:20:00.000Z",
  };
}

const NORMAL_BODY = `**En breve.** La "campana" $N(\\mu,\\sigma)$: simétrica alrededor de $\\mu$, con dispersión
fijada por $\\sigma$. Su FDA no tiene forma cerrada, así que casi todo se resuelve
[[distribucion-exponencial|estandarizando]] y leyendo la tabla de $\\Phi$. Es la distribución
límite del [[teorema-central-del-limite|TCL]] y la columna vertebral de la inferencia.

> [!info] Por qué aparece en todos lados
> Cualquier suma de muchos efectos pequeños e independientes tiende a esta forma.
> Ese es el contenido del teorema central del límite.

## Función de densidad

La densidad de $X \\sim N(\\mu, \\sigma)$ es

$$
f_X(x) = \\frac{1}{\\sqrt{2\\pi}\\,\\sigma} \\exp\\left\\{-\\frac{(x-\\mu)^2}{2\\sigma^2}\\right\\}, \\qquad x \\in \\mathbb{R}.
$$

- Es **simétrica** respecto de $x=\\mu$: mediana $=\\mu=$ moda $=$ media.
- Cambia la concavidad en $\\mu \\pm \\sigma$ (puntos de inflexión).
- El área total vale 1, como toda densidad.

### Regla empírica

| Intervalo | Probabilidad | Uso típico |
|---|---|---|
| $\\mu \\pm \\sigma$ | 68,3 % | control de procesos |
| $\\mu \\pm 2\\sigma$ | 95,4 % | intervalos de confianza |
| $\\mu \\pm 3\\sigma$ | 99,7 % | detección de atípicos |

## Estandarización

Se define $Z = \\dfrac{X-\\mu}{\\sigma} \\sim N(0,1)$ y se lee la tabla de $\\Phi$.

> [!warn] Cuidado con el segundo parámetro
> La cátedra escribe $N(\\mu,\\sigma)$ con el **desvío**, no con la varianza.
> Muchos libros y calculadoras usan $N(\\mu,\\sigma^2)$.

1. Escribir el suceso en términos de $X$.
2. Restar $\\mu$ y dividir por $\\sigma$ en ambos lados.
3. Leer $\\Phi(z)$ en la tabla y usar $\\Phi(-z) = 1-\\Phi(z)$.

> [!figura] normal-densidad
> Densidad de la normal con las áreas de la regla empírica sombreadas.
`;

const GENERIC_BODY = (title: string) => `Página de ejemplo para el smoke visual.

**${title}** existe para que el índice, la barra de segmentos y las migas tengan
material real que mostrar mientras el API no está levantado.

## Idea principal

Un párrafo de relleno con una fórmula en línea, $E[X] = \\int x\\,f_X(x)\\,dx$, y un
enlace interno a [[distribucion-normal|la Normal]].

- Primer elemento de la lista.
- Segundo elemento, algo más largo para ver cómo envuelve dentro de la medida.

## Detalle

$$ \\operatorname{Var}(X) = E[X^2] - E[X]^2 $$
`;

function headingsOf(body: string): Page["headings"] {
  const out: Page["headings"] = [];
  for (const line of body.split("\n")) {
    const m = /^(#{2,3})\s+(.+)$/.exec(line);
    if (!m || !m[1] || !m[2]) continue;
    const text = m[2].trim();
    out.push({
      level: m[1].length,
      text,
      id: text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, ""),
    });
  }
  return out;
}

export function mockPageDetail(_slug: string, pageSlug: string): PageDetail {
  const found = mockPages.find((p) => p.slug === pageSlug);
  if (!found) throw Object.assign(new Error("Esta página no existe en la materia"), { status: 404 });
  const body = pageSlug === "distribucion-normal" ? NORMAL_BODY : GENERIC_BODY(found.title);
  const page: Page = {
    ...found,
    body,
    links: [],
    headings: headingsOf(body),
  };
  const backlinks =
    pageSlug === "distribucion-normal"
      ? mockPages.filter((p) => p.slug === "variable-aleatoria-continua" || p.slug === "distribucion-exponencial")
      : [];
  return { page, backlinks, studied: mockStudied.includes(pageSlug) };
}

export function mockSearch(_slug: string, q: string): SearchHit[] {
  const needle = q.trim().toLowerCase();
  if (!needle) return [];
  return mockPages
    .filter((p) => `${p.title} ${p.summary}`.toLowerCase().includes(needle))
    .slice(0, 8)
    .map((p) => ({ slug: p.slug, title: p.title, type: p.type, division: p.division, snippet: p.summary }));
}
