import { BrowserRouter } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import { AppRoutes } from "./routes/AppRoutes";

/**
 * Raiz de la aplicacion.
 *
 * AuthProvider envuelve a las rutas para que cualquier componente pueda
 * consumir la sesion mediante useAuth, y BrowserRouter habilita la navegacion.
 */
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
