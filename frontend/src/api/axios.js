import axios from "axios";

import { AUTH_ENDPOINTS } from "./endpoints";
import {
  clearAccessToken,
  getAccessToken,
  notifySessionExpired,
  setAccessToken,
} from "./tokenStore";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000/api/v1";

/**
 * Instancia centralizada de Axios.
 *
 * `withCredentials` es imprescindible: el refresh token viaja en una cookie
 * HttpOnly, y sin esta bandera el navegador no la enviaria ni la recibiria.
 */
export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

/** Cliente sin interceptores, para llamadas de sesion que no deben reintentarse. */
const authApi = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

// --- Interceptor de peticion -------------------------------------------------

api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --- Interceptor de respuesta ------------------------------------------------

/**
 * Cola de peticiones que esperan un refresco en curso.
 *
 * Si varias llamadas reciben 401 a la vez, solo la primera dispara el refresco;
 * las demas se suscriben y se reintentan cuando este termina. Evita una
 * tormenta de peticiones de refresco y la consiguiente rotacion multiple.
 */
let refreshPromise = null;

function resolveRefresh() {
  if (!refreshPromise) {
    refreshPromise = authApi
      .post(AUTH_ENDPOINTS.refresh)
      .then((response) => {
        const { access } = response.data;
        setAccessToken(access);
        return access;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error;

    // Sin respuesta (red caida) o sin configuracion: no hay nada que reintentar.
    if (!response || !config) {
      return Promise.reject(error);
    }

    const isUnauthorized = response.status === 401;
    const isRefreshCall = config.url?.includes(AUTH_ENDPOINTS.refresh);
    const alreadyRetried = config._retry === true;

    // Anti-bucle: no reintentar un 401 ya reintentado, ni el propio refresco.
    if (!isUnauthorized || isRefreshCall || alreadyRetried) {
      return Promise.reject(error);
    }

    config._retry = true;

    try {
      const access = await resolveRefresh();
      config.headers.Authorization = `Bearer ${access}`;
      return api(config);
    } catch (refreshError) {
      // El refresh expiro, fue revocado o esta en la lista negra.
      clearAccessToken();
      notifySessionExpired();
      return Promise.reject(refreshError);
    }
  }
);

export default api;
