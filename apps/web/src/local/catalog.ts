/**
 * Lectura de los archivos estáticos que `sinapsis site build` deja bajo
 * `<BASE_URL>subjects/` (contrato `@sinapsis/contract/site`).
 *
 * Todo lo que la web sabe de una materia sale de acá: `index.json` (catálogo),
 * `subject.json` (config, páginas sin cuerpo, enlaces, estudio), `pages.json`
 * (los cuerpos) y `tools.json` (los bundles). Cada archivo se pide UNA vez por
 * sesión y se guarda la promesa: abrir tres páginas seguidas de la misma
 * materia no vuelve a bajar `pages.json`. Un fallo no se memoriza, para que
 * reintentar pueda funcionar.
 *
 * Los errores viajan como `ApiError`, con la misma forma que traía el API, así
 * las vistas siguen distinguiendo el 404 sin cambiar una línea: una materia que
 * no está en el sitio lanza `status: 404`.
 */
import { SiteCatalog, SitePages, SiteSubject, SiteTools, sitePaths } from "@sinapsis/contract/site";
import { ApiError } from "@/lib/apiError";

/** Base del sitio (`/` en desarrollo, `/Sinapsis/` en Pages). Termina en barra. */
export function siteBase(): string {
  const base = import.meta.env.BASE_URL || "/";
  return base.endsWith("/") ? base : `${base}/`;
}

/** Lo que este módulo necesita de un esquema de zod. */
interface Parser<T> {
  safeParse(value: unknown): { success: true; data: T } | { success: false };
}

const cache = new Map<string, Promise<unknown>>();

/** Olvida lo leído (cambio de materia en pruebas, «Borrar todo lo local»). */
export function clearCatalogCache(): void {
  cache.clear();
}

async function readJson(url: string, missing: string): Promise<unknown> {
  let res: Response;
  try {
    /* `no-cache` = REVALIDAR siempre: GitHub Pages sirve con `max-age=600`, y
       sin esto la web recién desplegada leía un `tools.json` o `subject.json`
       de hace diez minutos (visto en producción). Con ETag, un archivo que no
       cambió cuesta un 304. */
    res = await fetch(url, { credentials: "same-origin", cache: "no-cache" });
  } catch (err) {
    throw new ApiError(0, `No se pudieron leer los datos del sitio (${String(err)})`);
  }
  if (res.status === 404) throw new ApiError(404, missing);
  if (!res.ok) throw new ApiError(res.status, `No se pudo leer ${url} (HTTP ${res.status})`);
  try {
    return (await res.json()) as unknown;
  } catch {
    /* GitHub Pages responde `404.html` con código 200 para lo que no existe: un
       cuerpo que no es JSON en esta ruta significa que el archivo no está. */
    throw new ApiError(404, missing);
  }
}

/**
 * Pide, valida y memoriza un archivo del sitio. Con `fallback`, un 404 no es un
 * error sino ese valor (el catálogo sin compilar, una materia sin bundles).
 */
function load<T>(key: string, url: string, schema: Parser<T>, missing: string, fallback?: () => T): Promise<T> {
  const hit = cache.get(key) as Promise<T> | undefined;
  if (hit) return hit;

  const promise = readJson(url, missing)
    .then((raw): T => {
      const parsed = schema.safeParse(raw);
      if (!parsed.success) throw new ApiError(500, `Los datos de ${url} no tienen el formato esperado.`);
      return parsed.data;
    })
    .catch((err: unknown): T => {
      if (fallback && err instanceof ApiError && err.status === 404) return fallback();
      throw err;
    });

  cache.set(key, promise);
  void promise.catch(() => cache.delete(key));
  return promise;
}

/**
 * Catálogo del sitio. Si `index.json` todavía no existe (repositorio recién
 * clonado, sin `pnpm build:subjects`) se devuelve vacío: la landing sigue
 * sirviendo para las materias que el usuario creó a mano.
 */
export function loadCatalog(): Promise<SiteCatalog> {
  return load<SiteCatalog>("catalog", sitePaths.catalog(siteBase()), SiteCatalog, "El sitio todavía no tiene materias compiladas.", () => ({
    format: 1,
    builtAt: new Date(0).toISOString(),
    subjects: [],
  }));
}

export function loadSubject(slug: string): Promise<SiteSubject> {
  return load<SiteSubject>(`subject:${slug}`, sitePaths.subject(siteBase(), slug), SiteSubject, "La materia no existe");
}

export function loadPages(slug: string): Promise<SitePages> {
  return load<SitePages>(`pages:${slug}`, sitePaths.pages(siteBase(), slug), SitePages, "La materia no existe");
}

/** Los bundles de una materia; sin `tools.json` no tiene ninguno. */
export function loadTools(slug: string): Promise<SiteTools> {
  return load<SiteTools>(`tools:${slug}`, sitePaths.tools(siteBase(), slug), SiteTools, "La materia no existe", () => ({
    format: 1,
    tools: [],
  }));
}
