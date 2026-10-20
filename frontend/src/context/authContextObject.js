import { createContext } from "react";

/**
 * Contexto de autenticacion.
 *
 * Vive en su propio modulo para que AuthContext.jsx solo exporte componentes:
 * asi el hot reload de Vite funciona correctamente.
 */
export const AuthContext = createContext(null);
