/**
 * Error con estado de la capa de datos. Vive en su propio módulo —y no en
 * `lib/api.ts`— porque desde el Sprint 4 el cliente por defecto es el LOCAL:
 * `lib/api.ts` importa `local/client.ts`, que a su vez necesita este error. Con
 * la clase acá no hay ciclo, y `lib/api.ts` la reexporta, así que para el resto
 * de la aplicación nada cambió: `import { ApiError } from "@/lib/api"`.
 *
 * La forma `{ status, message }` es la de siempre: las vistas distinguen el 404
 * («esta materia no existe») del resto mirando `error.status`.
 */
export class ApiError extends Error {
  constructor(public status: number, message: string, public body?: unknown) {
    super(message);
    this.name = "ApiError";
  }
}
