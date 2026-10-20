import { Wallet } from "lucide-react";
import { Outlet, useNavigate } from "react-router-dom";

import { Button } from "../components/common/Button";
import { useAuth } from "../context/useAuth";

/** Layout de la zona privada: cabecera con sesion y contenido de la ruta. */
export function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/login", { replace: true });
  }

  return (
    <div className="min-h-screen bg-neutral-950">
      <header className="border-b border-neutral-800">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-income" aria-hidden="true" />
            <span className="text-sm font-semibold text-neutral-100">
              Tracker de Finanzas
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-neutral-400 sm:inline">
              {user?.email}
            </span>
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="w-auto px-3 py-1.5"
            >
              Cerrar sesion
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-10">
        <Outlet />
      </main>
    </div>
  );
}
