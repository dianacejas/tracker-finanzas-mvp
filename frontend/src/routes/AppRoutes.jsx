import { Navigate, Route, Routes } from "react-router-dom";

import { AppLayout } from "../layouts/AppLayout";
import Dashboard from "../pages/Dashboard";
import Login from "../pages/Login";
import NotFound from "../pages/NotFound";
import Register from "../pages/Register";
import { ProtectedRoute } from "./ProtectedRoute";
import { PublicRoute } from "./PublicRoute";

/**
 * Mapa de rutas de la aplicacion.
 *
 * Las rutas publicas viven bajo PublicRoute (que expulsa a los usuarios ya
 * autenticados) y las privadas bajo ProtectedRoute, todas dentro de AppLayout.
 */
export function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
