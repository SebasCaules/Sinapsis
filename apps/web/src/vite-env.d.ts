/// <reference types="vite/client" />
declare module "*.module.css" { const classes: { readonly [key: string]: string }; export default classes; }

interface ImportMetaEnv {
  /** "1" en el servidor de pruebas end-to-end: habilita el gancho `window.__sinapsis`. */
  readonly VITE_E2E?: string;
}

interface Window {
  /**
   * Gancho de pruebas del estado personal. Solo existe en desarrollo o con
   * `VITE_E2E=1`; en la compilación de Pages no se instala (ver `local/testHook.ts`).
   */
  __sinapsis?: import("./local/testHook").SinapsisTestHook;
}
