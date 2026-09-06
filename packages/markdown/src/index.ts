/**
 * @sinapsis/markdown — compilador del wiki de una materia.
 *
 * Reimplementación en TypeScript del contrato de `build.py` (la app de Proba),
 * emitiendo `Page[]` y `SyncPayload` de `@sinapsis/contract` (decisión N0-13).
 */
export { parseFrontmatter, parseScalarOrList, splitTopCommas, cleanWikilink } from "./frontmatter.js";
export type { Frontmatter } from "./frontmatter.js";

export { extractLinks, extractHeadings, slugifyAnchor, countWords, firstH1, firstH1Line, splitLines, normalizeDisplayMath } from "./inline.js";

/**
 * Normalizadores de texto: viven en `@sinapsis/contract` (una sola
 * implementación para api, web, cli y compilador). Se reexportan acá para no
 * romper a quien los importaba de este paquete.
 */
export { normalizeSlug, normalizeDivisionKey, fold } from "@sinapsis/contract";

export { compilePage, compileWiki, formatIssues, isInside, listWikiFiles } from "./compile.js";
export type {
  CompileIssue,
  IssueKind,
  CompilePageInput,
  CompileWikiOptions,
  CompileWikiResult,
} from "./compile.js";

export { compileStudy, studyCounts, planPhases, isEmptyStudy, emptyStudy, splitSections } from "./study.js";
export type { CompileStudyOptions, CompileStudyResult, StudyCounts, StudySection } from "./study.js";

export { scaffoldConfig, inspectWiki, pendingFields, singularizeEs, isDirectory, TODO } from "./scaffold.js";
export type { ScaffoldOptions, WikiSurvey, FolderSurvey } from "./scaffold.js";

export { PACKAGE_VERSION } from "./version.js";
