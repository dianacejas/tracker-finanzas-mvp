import { Route, Routes } from "react-router-dom";

import { AppLayout } from "../layouts/AppLayout";
import Dashboard from "../pages/Dashboard";
import HomePage from "../pages/HomePage";
import Login from "../pages/Login";
import NotFound from "../pages/NotFound";
import Register from "../pages/Register";
import TransactionsPage from "../pages/TransactionsPage";
import BudgetsPage from "../pages/BudgetsPage";
import { ProtectedRoute } from "./ProtectedRoute";
import { PublicRoute } from "./PublicRoute";

/**
 * Mapa de rutas de la aplicacion.
 *
 * La landing page vive en la raiz `/` como ruta publica accesible para todos.
 * Las rutas de autenticacion viven bajo PublicRoute (que expulsa a usuarios ya autenticados)
 * y las privadas viven bajo ProtectedRoute dentro de AppLayout.
 */
export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />

      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/budgets" element={<BudgetsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
