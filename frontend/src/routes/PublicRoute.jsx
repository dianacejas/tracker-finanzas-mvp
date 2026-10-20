import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../context/useAuth";

/**
 * Guardia de rutas publicas (login y registro).
 *
 * Si ya hay sesion activa, redirige al dashboard en lugar de mostrar los
 * formularios de acceso.
 */
export function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-950">
        <span
          role="status"
          aria-label="Cargando"
          className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-700 border-t-income"
        />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children ?? <Outlet />;
}
