import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";

import { AppLayout } from "../layouts/AppLayout";
import HomePage from "../pages/HomePage";
import { ProtectedRoute } from "./ProtectedRoute";
import { PublicRoute } from "./PublicRoute";

const Login = lazy(() => import("../pages/Login"));
const Register = lazy(() => import("../pages/Register"));
const Dashboard = lazy(() => import("../pages/Dashboard"));
const TransactionsPage = lazy(() => import("../pages/TransactionsPage"));
const BudgetsPage = lazy(() => import("../pages/BudgetsPage"));
const NotFound = lazy(() => import("../pages/NotFound"));

function RouteFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#faf8f6] dark:bg-[#242038]">
      <div className="w-8 h-8 rounded-full border-3 border-[#9067c6]/30 border-t-[#9067c6] animate-spin" />
    </div>
  );
}

/**
 * Mapa de rutas de la aplicacion.
 *
 * La landing page vive en la raiz `/` como ruta publica accesible para todos.
 * Las rutas de autenticacion viven bajo PublicRoute (que expulsa a usuarios ya autenticados)
 * y las privadas viven bajo ProtectedRoute dentro de AppLayout.
 */
export function AppRoutes() {
  return (
    <Suspense fallback={<RouteFallback />}>
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
    </Suspense>
  );
}
