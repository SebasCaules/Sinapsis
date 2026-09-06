import { readFileSync, readdirSync } from "node:fs";
import { join, sep } from "node:path";
import { describe, expect, it } from "vitest";
import { api, installMockApi, type ApiClient } from "./api";

/* vitest corre con el directorio del paquete como raíz. */
const SRC = join(process.cwd(), "src");

function sources(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const full = join(dir, e.name);
    if (e.isDirectory()) return sources(full);
    return /\.tsx?$/.test(e.name) && !/\.test\.tsx?$/.test(e.name) ? [full] : [];
  });
}

/** Un cliente de mentira mínimo: alcanza para ver a dónde va cada sección. */
function fakeClient(tag: string): ApiClient {
  const stub = (name: string) => async () => `${tag}:${name}` as never;
  return {
    auth: { me: stub("me"), setTheme: stub("setTheme"), setName: stub("setName") },
    landing: {
      list: stub("list"),
      available: stub("available"),
      saveLayout: stub("saveLayout"),
      createSubject: stub("createSubject"),
      removeFromLanding: stub("removeFromLanding"),
      semesters: stub("semesters"),
    },
    subject: {
      detail: stub("detail"),
      page: stub("page"),
      search: stub("search"),
      markStudied: stub("markStudied"),
      unmarkStudied: stub("unmarkStudied"),
      graph: stub("graph"),
      tools: stub("tools"),
    },
    study: {
      content: stub("content"),
      state: stub("state"),
      grade: stub("grade"),
      resetCard: stub("resetCard"),
      addBookmark: stub("addBookmark"),
      removeBookmark: stub("removeBookmark"),
      saveNote: stub("saveNote"),
      deleteNote: stub("deleteNote"),
      setTask: stub("setTask"),
      resetTasks: stub("resetTasks"),
      setPlanDate: stub("setPlanDate"),
      clearPlanDate: stub("clearPlanDate"),
      resetPlanDates: stub("resetPlanDates"),
      recordAttempt: stub("recordAttempt"),
    },
  };
}

describe("costura del modo mock", () => {
  it("installMockApi reemplaza cada sección conservando la identidad del objeto", async () => {
    const { auth, landing, subject } = api;
    const before = api.landing.list;

    installMockApi(fakeClient("mock"));

    /* Quien haya capturado `api.landing` sigue viendo la implementación vigente. */
    expect(api.auth).toBe(auth);
    expect(api.landing).toBe(landing);
    expect(api.subject).toBe(subject);
    expect(api.landing.list).not.toBe(before);

    await expect(api.landing.list()).resolves.toBe("mock:list");
    await expect(api.subject.detail("proba")).resolves.toBe("mock:detail");
    await expect(api.study.state("proba")).resolves.toBe("mock:state");

    /* La costura es simétrica: se puede volver a la implementación real. */
    installMockApi(fakeClient("real"));
    await expect(api.landing.list()).resolves.toBe("real:list");
  });

  it("ningún módulo de producción importa las fixtures de forma estática", () => {
    const offenders = sources(SRC)
      .filter((file) => !file.includes(`${sep}mocks${sep}`))
      .filter((file) => /^\s*import\s[^;]*["'](@\/mocks\/api|\.{1,2}\/mocks\/api)["']/m.test(readFileSync(file, "utf8")))
      .map((file) => file.slice(SRC.length + 1));

    /* El cliente de mentira solo puede entrar por el `import()` dinámico de
       main.tsx: cualquier import estático lo mete en el bundle de producción. */
    expect(offenders).toEqual([]);
  });

  it("main.tsx carga el cliente de mentira con un import dinámico bajo DEV", () => {
    const main = readFileSync(join(SRC, "main.tsx"), "utf8");
    expect(main).toMatch(/import\.meta\.env\.DEV\s*&&\s*enableMockFromQuery\(\)/);
    expect(main).toMatch(/await import\(["']@\/mocks\/api["']\)/);
  });
});
