/**
 * @sinapsis/markdown — compilador del wiki de una materia.
 *
 * Reimplementación en TypeScript del contrato de `build.py` (la app de Proba),
 * emitiendo `Page[]` y `SyncPayload` de `@sinapsis/contract` (decisión N0-13).
 */
export { parseFrontmatter, parseScalarOrList, splitTopCommas, cleanWikilink } from "./frontmatter.js";
export type { Frontmatter } from "./frontmatter.js";

export { extractLinks, extractHeadings, slugifyAnchor, countWords, firstH1, splitLines } from "./inline.js";

export {
  compilePage,
  compileWiki,
  formatIssues,
  normalizeSlug,
  normalizeDivisionKey,
} from "./compile.js";
export type {
  CompileIssue,
  IssueKind,
  CompilePageInput,
  CompileWikiOptions,
  CompileWikiResult,
} from "./compile.js";

export { scaffoldConfig, inspectWiki, pendingFields, singularizeEs, isDirectory, TODO } from "./scaffold.js";
export type { ScaffoldOptions, WikiSurvey, FolderSurvey } from "./scaffold.js";

export { PACKAGE_VERSION } from "./version.js";
