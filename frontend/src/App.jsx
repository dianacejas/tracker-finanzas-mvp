import { BrowserRouter, useHref, useNavigate } from "react-router-dom";
import { HeroUIProvider } from "@heroui/react";

import { AuthProvider } from "./context/AuthContext";
import { AppRoutes } from "./routes/AppRoutes";

function AppWithProviders() {
  const navigate = useNavigate();

  return (
    <HeroUIProvider navigate={navigate} useHref={useHref}>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </HeroUIProvider>
  );
}

/**
 * Raiz de la aplicacion.
 */
export default function App() {
  return (
    <BrowserRouter>
      <AppWithProviders />
    </BrowserRouter>
  );
}
