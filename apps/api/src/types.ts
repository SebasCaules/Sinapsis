import type { Db } from "./db/client.js";
import type { AppEnv } from "./env.js";
import type { GoogleVerifier } from "./auth/google.js";
import type { UserRow } from "./db/schema.js";

/** Dependencias que recibe `createApp` (inyectadas para poder testear). */
export interface AppDeps {
  db: Db;
  env: AppEnv;
  /** Verificador de ID tokens de Google; por defecto se arma con GOOGLE_CLIENT_ID. */
  googleVerifier?: GoogleVerifier;
  /** Log por request. Por defecto activo salvo en NODE_ENV=test. */
  log?: boolean;
}

/** Tipado del contexto de Hono. */
export interface AppBindings {
  Variables: {
    db: Db;
    env: AppEnv;
    user: UserRow;
    sessionId: string;
  };
}
