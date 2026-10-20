import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuth } from "../context/useAuth";

/** Indicador de carga centrado, mostrado mientras se restaura la sesion. */
function SessionLoader() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-screen items-center justify-center bg-neutral-950"
    >
      <div className="flex flex-col items-center gap-3">
        <span
          aria-hidden="true"
          className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-700 border-t-income"
        />
        <span className="text-sm text-neutral-400">Cargando sesion...</span>
      </div>
    </div>
  );
}

/**
 * Guardia de rutas privadas.
 *
 * Mientras la sesion se esta restaurando muestra un loader, evitando el
 * parpadeo hacia el login. Si no hay sesion redirige a `/login` conservando la
 * ruta de origen para volver a ella tras autenticarse.
 */
export function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <SessionLoader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children ?? <Outlet />;
}
