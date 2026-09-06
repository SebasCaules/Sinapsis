/**
 * Lectura y validación de las variables de entorno del API.
 *
 * `loadEnv()` se usa desde `index.ts` (arranque real). Los tests construyen el
 * objeto `AppEnv` a mano y se lo pasan a `createApp()`.
 */
import { z } from "zod";

/** Acepta 1/0, true/false, yes/no, on/off (y vacío = false). */
const booleanish = z
  .union([z.boolean(), z.string()])
  .default(false)
  .transform((v) => {
    if (typeof v === "boolean") return v;
    const s = v.trim().toLowerCase();
    return s === "1" || s === "true" || s === "yes" || s === "on";
  });

const optionalText = z
  .string()
  .optional()
  .transform((v) => {
    const s = (v ?? "").trim();
    return s.length > 0 ? s : null;
  });

export const EnvSchema = z.object({
  NODE_ENV: z.string().default("development"),
  PORT: z.coerce.number().int().positive().max(65535).default(3000),
  DATABASE_URL: z.string().min(1).default("file:./data/sinapsis.db"),
  DATABASE_AUTH_TOKEN: optionalText,
  SESSION_SECRET: z
    .string({ required_error: "SESSION_SECRET es obligatorio" })
    .min(16, "SESSION_SECRET: al menos 16 caracteres"),
  GOOGLE_CLIENT_ID: optionalText,
  SYNC_TOKEN: z
    .string({ required_error: "SYNC_TOKEN es obligatorio" })
    .min(8, "SYNC_TOKEN: al menos 8 caracteres"),
  AUTH_DEV_BYPASS: booleanish,
  WEB_DIST: optionalText,
  /** Fuerza el atributo Secure de la cookie de sesión (por defecto: solo en producción). */
  COOKIE_SECURE: booleanish,
  /** Orígenes adicionales admitidos por el guard CSRF, separados por coma. */
  ALLOWED_ORIGINS: z
    .string()
    .optional()
    .transform((v) => (v ?? "").split(",").map((o) => o.trim()).filter((o) => o.length > 0)),
});

export type AppEnv = z.infer<typeof EnvSchema>;

/** Lee y valida el entorno. Lanza un error legible si falta algo. */
export function loadEnv(source: Record<string, string | undefined> = process.env): AppEnv {
  const parsed = EnvSchema.safeParse({
    NODE_ENV: source.NODE_ENV,
    PORT: source.PORT,
    DATABASE_URL: source.DATABASE_URL,
    DATABASE_AUTH_TOKEN: source.DATABASE_AUTH_TOKEN ?? source.TURSO_AUTH_TOKEN,
    SESSION_SECRET: source.SESSION_SECRET,
    GOOGLE_CLIENT_ID: source.GOOGLE_CLIENT_ID,
    SYNC_TOKEN: source.SYNC_TOKEN,
    AUTH_DEV_BYPASS: source.AUTH_DEV_BYPASS,
    WEB_DIST: source.WEB_DIST,
    COOKIE_SECURE: source.COOKIE_SECURE,
    ALLOWED_ORIGINS: source.ALLOWED_ORIGINS,
  });
  if (!parsed.success) {
    const detalle = parsed.error.issues
      .map((i) => `${i.path.join(".") || "(raíz)"}: ${i.message}`)
      .join("; ");
    throw new Error(`Configuración inválida en el entorno — ${detalle}`);
  }
  // Fallar temprano, no ignorar en silencio: el bypass de desarrollo jamás debe
  // convivir con un despliegue de producción (auditoría de seguridad, Sprint 1).
  if (parsed.data.NODE_ENV === "production" && parsed.data.AUTH_DEV_BYPASS) {
    throw new Error("Configuración inválida: AUTH_DEV_BYPASS no puede estar activo con NODE_ENV=production");
  }
  return parsed.data;
}

/** true si el bypass de desarrollo está habilitado y permitido. */
export function devBypassEnabled(env: AppEnv): boolean {
  return env.AUTH_DEV_BYPASS && env.NODE_ENV !== "production";
}

export function isProduction(env: AppEnv): boolean {
  return env.NODE_ENV === "production";
}

/** true si la cookie de sesión debe llevar Secure: en producción o si se fuerza por env. */
export function cookieSecure(env: AppEnv): boolean {
  return isProduction(env) || env.COOKIE_SECURE;
}

/**
 * Orígenes admitidos por el guard CSRF además del propio host: exactamente los
 * de ALLOWED_ORIGINS, en todos los entornos.
 *
 * En desarrollo y en E2E no hace falta agregar los puertos de Vite: el proxy
 * (`changeOrigin: false`) reenvía el `Host` del navegador, así que el `Origin`
 * de la web coincide con el `Host` del request y el guard lo acepta por esa
 * vía. Abrir puertos fijos "por las dudas" solo ensanchaba la superficie.
 */
export function allowedOrigins(env: AppEnv): Set<string> {
  return new Set<string>(env.ALLOWED_ORIGINS);
}
