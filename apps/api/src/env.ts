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
  });
  if (!parsed.success) {
    const detalle = parsed.error.issues
      .map((i) => `${i.path.join(".") || "(raíz)"}: ${i.message}`)
      .join("; ");
    throw new Error(`Configuración inválida en el entorno — ${detalle}`);
  }
  return parsed.data;
}

/** true si el bypass de desarrollo está habilitado y permitido. */
export function devBypassEnabled(env: AppEnv): boolean {
  return env.AUTH_DEV_BYPASS && env.NODE_ENV !== "production";
}

/** true si las cookies deben marcarse Secure. */
export function isProduction(env: AppEnv): boolean {
  return env.NODE_ENV === "production";
}
