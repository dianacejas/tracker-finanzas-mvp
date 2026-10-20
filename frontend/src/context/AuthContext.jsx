import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import {
  fetchProfileRequest,
  loginRequest,
  logoutRequest,
  refreshRequest,
  registerRequest,
  updateProfileRequest,
} from "../api/authApi";
import { clearAccessToken, setAccessToken, setSessionExpiredHandler } from "../api/tokenStore";

const AuthContext = createContext(null);

/**
 * Proveedor global de autenticacion.
 *
 * El access token se conserva en memoria, nunca en almacenamiento persistente.
 * El refresh token vive en una cookie HttpOnly que JavaScript no puede leer.
 *
 * Al montar la aplicacion se intenta un refresco silencioso: si la cookie sigue
 * vigente, la sesion se restaura sin pedir credenciales de nuevo. Mientras esa
 * comprobacion esta en curso, `loading` es true para evitar parpadeos.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const clearSession = useCallback(() => {
    clearAccessToken();
    setUser(null);
  }, []);

  // El interceptor notifica aqui cuando el refresco falla de forma definitiva.
  useEffect(() => {
    setSessionExpiredHandler(clearSession);
    return () => setSessionExpiredHandler(null);
  }, [clearSession]);

  // Bootstrap: intenta recuperar la sesion desde la cookie de refresco.
  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      try {
        const access = await refreshRequest();
        if (cancelled) return;
        setAccessToken(access);

        const profile = await fetchProfileRequest();
        if (!cancelled) setUser(profile);
      } catch {
        // Sin sesion previa valida: el usuario vera las rutas publicas.
        if (!cancelled) clearSession();
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    bootstrap();
    return () => {
      cancelled = true;
    };
  }, [clearSession]);

  const login = useCallback(async (email, password) => {
    const data = await loginRequest(email, password);
    setAccessToken(data.access);

    try {
      const profile = await fetchProfileRequest();
      setUser(profile);
      return profile;
    } catch (error) {
      // El login funciono pero el perfil no llego: no dejamos una sesion a medias.
      clearSession();
      throw error;
    }
  }, [clearSession]);

  const register = useCallback(async (userData) => {
    return registerRequest(userData);
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutRequest();
    } catch {
      // Aunque el backend falle, la sesion local debe cerrarse igual.
    } finally {
      clearSession();
    }
  }, [clearSession]);

  const updateProfile = useCallback(async (payload) => {
    const profile = await updateProfileRequest(payload);
    setUser(profile);
    return profile;
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      login,
      register,
      logout,
      updateProfile,
    }),
    [user, loading, login, register, logout, updateProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/** Consume el contexto de autenticacion. */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider.");
  }
  return context;
}
