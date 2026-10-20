import { AUTH_ENDPOINTS } from "./endpoints";
import api from "./axios";

/**
 * Funciones de acceso a los endpoints de autenticacion.
 *
 * El refresh token no se manipula en ningun caso: el backend lo gestiona
 * mediante una cookie HttpOnly.
 */

/** Autentica al usuario y devuelve `{ access, user }`. */
export async function loginRequest(email, password) {
  const { data } = await api.post(AUTH_ENDPOINTS.login, { email, password });
  return data;
}

/** Registra una cuenta nueva y devuelve el perfil creado. */
export async function registerRequest(userData) {
  const { data } = await api.post(AUTH_ENDPOINTS.register, userData);
  return data;
}

/** Recupera el perfil del usuario autenticado. */
export async function fetchProfileRequest() {
  const { data } = await api.get(AUTH_ENDPOINTS.me);
  return data;
}

/** Actualiza parcialmente el perfil del usuario autenticado. */
export async function updateProfileRequest(payload) {
  const { data } = await api.patch(AUTH_ENDPOINTS.me, payload);
  return data;
}

/**
 * Renueva el access token usando la cookie HttpOnly.
 * Devuelve el nuevo access token.
 */
export async function refreshRequest() {
  const { data } = await api.post(AUTH_ENDPOINTS.refresh);
  return data.access;
}

/** Revoca el refresh token (lista negra) y limpia la cookie de sesion. */
export async function logoutRequest() {
  await api.post(AUTH_ENDPOINTS.logout);
}

/** Extiende el mensaje de error segun el payload del backend. */
export function extractApiError(error, fallback = "Ocurrio un error inesperado.") {
  const data = error?.response?.data;

  if (!data) {
    return error?.code === "ECONNABORTED"
      ? "La solicitud tardo demasiado. Verifica tu conexion."
      : "No se pudo contactar con el servidor.";
  }

  if (typeof data === "string") {
    return data;
  }

  if (typeof data.detail === "string") {
    return data.detail;
  }

  const firstField = Object.values(data).find(Boolean);
  if (Array.isArray(firstField) && firstField.length > 0) {
    return String(firstField[0]);
  }
  if (typeof firstField === "string") {
    return firstField;
  }

  return fallback;
}
