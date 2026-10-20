# Frontend — Tracker de Finanzas Personales

Cliente SPA construido con **Vite + React** (JavaScript/JSX) y **Tailwind CSS v3**.

## Requisitos

- Node.js 20 o superior (desarrollado con Node 24).

## Puesta en marcha

```bash
cd frontend
npm install
cp .env.example .env   # en PowerShell: Copy-Item .env.example .env
npm run dev
```

La aplicación queda disponible en <http://localhost:5173>.

## Scripts

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Servidor de desarrollo con recarga en caliente. |
| `npm run build` | Build de producción en `dist/`. |
| `npm run preview` | Sirve localmente el build de producción. |
| `npm run lint` | Análisis estático con oxlint. |

## Variables de entorno

Definidas en `.env` (ver `.env.example`). Solo las variables con prefijo `VITE_`
se exponen al navegador.

| Variable | Descripción | Ejemplo |
| --- | --- | --- |
| `VITE_API_BASE_URL` | URL base de la API del backend, con prefijo de versionado. | `http://localhost:8000/api/v1` |

## Estructura

```
src/
├── api/                Cliente Axios, interceptores y llamadas de auth
├── components/common/  Componentes reutilizables (Button, Input)
├── context/            AuthContext, useAuth y el objeto de contexto
├── layouts/            AuthLayout y AppLayout
├── pages/              Login, Register, Dashboard, NotFound
├── routes/             AppRoutes, ProtectedRoute, PublicRoute
├── utils/              Helpers (formato, cn)
├── App.jsx             Router y AuthProvider
├── index.css           Directivas de Tailwind y estilos base
└── main.jsx            Punto de entrada
```

## Sistema de diseño

Los colores financieros se definen en `tailwind.config.js` como tokens semánticos:

| Token | Uso | Base |
| --- | --- | --- |
| `income` | Ingresos y balances positivos | `#10B981` |
| `expense` | Gastos y balances negativos | `#F43F5E` |
| `warning` | Alertas de presupuesto | `#F59E0B` |
| `neutral` | Fondos, bordes y textos | `#0F172A` |

Cada token incluye la escala 50–900 más los alias `light`, `DEFAULT` y `dark`.

La utilidad `cn()` en `src/utils/cn.js` combina clases condicionales con `clsx`
y resuelve conflictos de Tailwind con `tailwind-merge`.

## Autenticación y sesión

La sesión combina un **access token en memoria** con un **refresh token en cookie
HttpOnly** emitida por el backend. JavaScript nunca puede leer el refresh token,
lo que elimina el robo de sesión por XSS.

### Flujo

1. **Login** (`POST /auth/token/`): el backend devuelve el `access` en el cuerpo
   y el `refresh` en una cookie HttpOnly. El access se guarda en memoria.
2. **Peticiones**: el interceptor de petición adjunta `Authorization: Bearer`.
3. **401**: el interceptor de respuesta pide un access nuevo a
   `POST /auth/token/refresh/` y reintenta la petición original.
4. **Recarga**: `AuthProvider` intenta un refresco silencioso al montar; si la
   cookie sigue vigente, la sesión se restaura sin pedir credenciales.
5. **Logout** (`POST /auth/logout/`): el refresh entra en la lista negra y la
   cookie se elimina.

### Piezas clave

| Archivo | Responsabilidad |
| --- | --- |
| `src/api/axios.js` | Instancia central y ambos interceptores. |
| `src/api/tokenStore.js` | Access token en memoria y aviso de sesión expirada. |
| `src/api/authApi.js` | Llamadas a los endpoints y traducción de errores. |
| `src/context/AuthContext.jsx` | Estado de sesión y bootstrap. |
| `src/context/useAuth.js` | Hook de consumo del contexto. |
| `src/routes/ProtectedRoute.jsx` | Guardia de rutas privadas. |
| `src/routes/PublicRoute.jsx` | Expulsa a los usuarios ya autenticados. |

### Detalles de seguridad

- El interceptor usa una **bandera `_retry`** para que un 401 no se reintente en
  bucle.
- Los 401 simultáneos **comparten un único refresco** mediante una promesa en
  vuelo (`refreshPromise`). Sin esto, con rotación y lista negra activas, varios
  refrescos concurrentes se invalidarían entre sí y cerrarían la sesión.
- La instancia de refresco **no tiene interceptores**, de modo que un fallo de
  refresco nunca se reintenta recursivamente.
- El backend exige `withCredentials`, ya configurado en el cliente.

## Rutas

| Ruta | Acceso | Vista |
| --- | --- | --- |
| `/login` | Pública | Inicio de sesión |
| `/register` | Pública | Alta de cuenta |
| `/dashboard` | Privada | Resumen y perfil |
| `/` | Privada | Redirige a `/dashboard` |
| `*` | Pública | Página no encontrada |

