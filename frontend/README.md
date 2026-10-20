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
├── api/                Clientes HTTP e interceptores
├── components/common/  Componentes reutilizables (botones, inputs, badges)
├── context/            Contextos globales (AuthContext)
├── layouts/            Layouts generales de la aplicación
├── pages/              Vistas de páginas
├── routes/             Definición de rutas y protecciones
├── utils/              Helpers (formato, cn)
├── App.jsx             Componente raíz
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
