import { useContext } from "react";

import { AuthContext } from "./authContextObject";

/**
 * Consume el contexto de autenticacion.
 *
 * Vive en un modulo aparte para que AuthContext.jsx solo exporte componentes
 * y el hot reload de Vite siga funcionando bien.
 *
 * @returns {{ user: object|null, loading: boolean, isAuthenticated: boolean,
 *   login: Function, register: Function, logout: Function, updateProfile: Function }}
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider.");
  }
  return context;
}
