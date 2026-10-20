/**
 * Almacen de tokens en memoria.
 *
 * El access token vive unicamente en memoria (nunca en localStorage): un XSS no
 * puede leerlo de forma persistente. El refresh token jamas pasa por aqui, ya
 * que el backend lo entrega en una cookie HttpOnly inaccesible desde JavaScript.
 *
 * Este modulo existe para que el cliente HTTP y el contexto de autenticacion
 * puedan compartir el token sin importarse mutuamente.
 */

let accessToken = null;

/** Registra el access token vigente. */
export function setAccessToken(token) {
  accessToken = token ?? null;
}

/** Devuelve el access token vigente, o null si no hay sesion. */
export function getAccessToken() {
  return accessToken;
}

/** Limpia el access token en memoria. */
export function clearAccessToken() {
  accessToken = null;
}

/**
 * Manejador invocado cuando el refresco falla de forma definitiva.
 * El contexto de autenticacion lo registra para cerrar la sesion y redirigir.
 * Se usa un callback para evitar que este modulo dependa del contexto o del router.
 */
let onSessionExpired = null;

/** Suscribe un manejador al evento de sesion expirada. */
export function setSessionExpiredHandler(handler) {
  onSessionExpired = handler;
}

/** Notifica que la sesion ya no puede renovarse. */
export function notifySessionExpired() {
  if (typeof onSessionExpired === "function") {
    onSessionExpired();
  }
}
