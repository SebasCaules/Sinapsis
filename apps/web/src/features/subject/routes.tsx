/**
 * Rutas de una materia. El shell es el layout; las vistas son sus hijas.
 * Las pesadas (lector, catálogo, división) llegan en diferido: la primera
 * pantalla de una materia no paga el pipeline de markdown ni KaTeX.
 */
import { Suspense, lazy } from "react";
import { useParams, type RouteObject } from "react-router-dom";
import { SubjectShell } from "./SubjectShell";
import { ComingSoon, NotFoundInSubject, SheetSkeleton, WideSkeleton } from "./components/States";
import { useSubjectCtx } from "./context";
import { HomeView } from "./views/HomeView";

const ReaderView = lazy(() => import("./views/ReaderView"));
const CatalogView = lazy(() => import("./views/CatalogView"));
const DivisionView = lazy(() => import("./views/DivisionView"));

/** «Próximamente» con el nombre real que la materia le dio a la herramienta. */
function ToolView() {
  const { model } = useSubjectCtx();
  const { tool = "" } = useParams();
  /* El mismo buscador que usa el shell para la pestaña: una sola definición de
     «qué ítem del rail corresponde a /t/:tool». */
  const view = model.railItem(tool);
  if (!view) return <ComingSoon title="Herramienta de la materia" sprint="Sprint 3" />;
  return <ComingSoon title={view.item.label} sprint={view.item.kind === "builtin" ? "Sprint 2" : "Sprint 3"} />;
}

function SubjectNotFound() {
  const { subject = "" } = useParams();
  return <NotFoundInSubject subject={subject} />;
}

export const subjectRoutes: RouteObject[] = [
  {
    path: "/m/:subject",
    element: <SubjectShell />,
    children: [
      { index: true, element: <HomeView /> },
      {
        path: "wiki",
        element: (
          <Suspense fallback={<WideSkeleton />}>
            <CatalogView />
          </Suspense>
        ),
      },
      { path: "graph", element: <ComingSoon title="Grafo de conexiones" sprint="Sprint 2" /> },
      {
        path: "d/:division",
        element: (
          <Suspense fallback={<WideSkeleton />}>
            <DivisionView />
          </Suspense>
        ),
      },
      {
        path: "p/:page",
        element: (
          <Suspense fallback={<SheetSkeleton />}>
            <ReaderView />
          </Suspense>
        ),
      },
      { path: "t/:tool", element: <ToolView /> },
      { path: "*", element: <SubjectNotFound /> },
    ],
  },
];
