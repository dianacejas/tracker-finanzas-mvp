# Tracker de Finanzas Personales

![CI](https://github.com/dianacejas/tracker-finanzas-mvp/actions/workflows/ci.yml/badge.svg)
![Django](https://img.shields.io/badge/Django-5.0-092E20?style=flat&logo=django&logoColor=white)
![DRF](https://img.shields.io/badge/Django%20REST-Framework-ff1717?style=flat)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat&logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind%20CSS-3-38B2AC?style=flat&logo=tailwindcss&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-green)

Aplicación web para registrar ingresos y gastos, controlar presupuestos mensuales por categoría y visualizar el balance financiero personal con gráficos en tiempo real.

---

## Descripción del Producto

**Tracker de Finanzas Personales** resuelve un problema cotidiano: la dificultad de saber cuánto se gana, cuánto se gasta y en qué se consume el dinero mes a mes, sin depender de hojas de cálculo manuales y propensas al error.

**Problemas que resuelve:**
- Registro rápido de movimientos con categorización clara (ingresos/gastos).
- Control preventivo del gasto mediante presupuestos mensuales con semáforo de alerta.
- Visibilidad inmediata del balance: totales, distribución por categoría y evolución mensual.

## Capturas

> Las capturas del dashboard, los movimientos y los presupuestos se incorporan al cierre del Sprint 4.

## Stack Tecnológico

| Capa | Tecnologías |
|---|---|
| **Backend** | Django 5, Django REST Framework, djangorestframework-simplejwt, django-filter, python-dotenv, drf-spectacular, django-cors-headers |
| **Frontend** | React 19 + Vite 8, Tailwind CSS v3, React Router, Axios, Lucide React, clsx + tailwind-merge |
| **Base de datos** | SQLite (desarrollo) · PostgreSQL (producción, vía Docker Compose) |
| **Calidad y entrega** | Django TestCase + APITestCase, GitHub Actions CI, Docker |

## Arquitectura

Monorepo con dos aplicaciones independientes que se comunican mediante una API REST versionada (`/api/v1/`).

```
tracker-finanzas-mvp/
├── backend/                      # API Django
│   ├── config/                   # Proyecto: urls, asgi/wsgi
│   │   └── settings/             # base.py · local.py · production.py
│   ├── apps/
│   │   ├── users/                # Custom User (email como identificador)
│   │   ├── categories/           # Categorías globales + privadas
│   │   └── transactions/         # Movimientos de ingreso y gasto
│   ├── requirements.txt
│   └── .env.example
├── frontend/                     # SPA React (Vite + Tailwind)
│   └── src/
│       ├── api/                  # Cliente Axios + interceptor de refresco
│       ├── components/common/    # UI reutilizable (Button, Input)
│       ├── context/              # AuthContext + useAuth
│       ├── layouts/              # AuthLayout · AppLayout
│       ├── pages/                # Login · Register · Dashboard
│       ├── routes/               # AppRoutes + guardias de ruta
│       └── utils/                # Helpers (cn, formato)
├── .github/workflows/ci.yml      # Integración continua
├── .gitignore                    # Zero-leak: .env, BD, node_modules
├── .editorconfig
└── README.md
```

La app `budgets` se incorpora en el Sprint 3.

**Decisiones clave de diseño:**
- **Autenticación JWT segura:** *Access token* en memoria (estado de React) y *refresh token* en cookie `HttpOnly`, con rotación y lista negra al cerrar sesión. Interceptor de Axios que renueva el token ante un 401 y reintenta la petición sin interrumpir al usuario.
- **Aislamiento multi-tenant:** toda consulta se restringe al usuario autenticado; el `user_id` nunca se acepta desde el payload.
- **Categorías híbridas:** globales del sistema (solo lectura, compartidas) + categorías privadas por usuario. Borrado protegido cuando existen transacciones asociadas.
- **Precisión contable:** montos en `DecimalField`, sin punto flotante, con una restricción de base de datos que impide guardar importes no positivos.
- **Coherencia de tipos:** una categoría de gasto no admite ingresos y viceversa; las categorías de tipo `BOTH` aceptan ambos.

## Inicio Rápido

**Prerrequisitos:** Python 3.11+ (probado en 3.12 y 3.14), Node.js 20+ (probado en 24), Git.

```bash
# 1. Clonar
git clone https://github.com/dianacejas/tracker-finanzas-mvp.git
cd tracker-finanzas-mvp

# 2. Backend
cd backend
python -m venv .venv && source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env                                # editar valores si es necesario
python manage.py migrate
python manage.py runserver                          # http://localhost:8000

# 3. Frontend (nueva terminal)
cd frontend
npm install
cp .env.example .env
npm run dev                                         # http://localhost:5173
```

### Variables de entorno

**`backend/.env.example`**

```env
DEBUG=True
SECRET_KEY=clave_secreta_de_solo_desarrollo
ALLOWED_HOSTS=localhost,127.0.0.1
DATABASE_URL=sqlite:///db.sqlite3
CORS_ALLOWED_ORIGINS=http://localhost:5173
ACCESS_TOKEN_LIFETIME_MINUTES=15
REFRESH_TOKEN_LIFETIME_DAYS=7
```

**`frontend/.env.example`**

```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

> **Política de seguridad:** los archivos `.env` nunca se commitean. Solo se publican plantillas `.env.example` con valores ficticios. El *refresh token* viaja en una cookie `HttpOnly` que JavaScript no puede leer.

## Pruebas y CI

```bash
# Backend: suite completa (155 pruebas)
cd backend && python manage.py test

# Frontend: análisis estático y compilación de producción
cd frontend && npm run lint && npm run build
```

Cada push y cada pull request ejecuta ambos trabajos mediante GitHub Actions, definidos en `.github/workflows/ci.yml`:

| Trabajo | Entorno | Comandos |
|---|---|---|
| **Backend tests** | Python 3.12 | `python manage.py test` |
| **Frontend build** | Node 24 | `npm run lint` · `npm run build` |

## Roadmap

| Sprint | Objetivo | Estado |
|---|---|---|
| **Sprint 1** | Fundaciones, arquitectura y autenticación JWT segura | Completado |
| **Sprint 2** | Núcleo financiero: categorías y CRUD de transacciones | En curso |
| **Sprint 3** | Métricas, presupuestos con semáforos y dashboard | Pendiente |
| **Sprint 4** | Tests de calidad, documentación OpenAPI, Docker y deploy | Pendiente |

## Estado actual

El Sprint 1 dejó el ciclo de autenticación funcionando de punta a punta. El Sprint 2 avanza con el núcleo financiero: categorías y movimientos ya están operativos en la API.

**Backend**

- Modelo de usuario personalizado con email como identificador y moneda preferida ISO 4217.
- Endpoints de registro, login, refresco de token, cierre de sesión y perfil.
- *Access token* de vida corta, *refresh token* rotativo y revocable (lista negra).
- Modelo `Category` con alcance global (sistema) o privado (por cuenta).
- CRUD de categorías bajo `/api/v1/categories/` con aislamiento estricto entre cuentas.
- Comando `seed_categories` idempotente que carga las 11 categorías iniciales del sistema.
- Modelo `Transaction` con monto decimal, restricción de positividad en base de datos e índices para los listados por usuario, fecha y tipo.
- CRUD de movimientos bajo `/api/v1/transactions/` con validación de pertenencia de la categoría, coherencia de tipos, filtros por fecha, tipo y categoría, orden por fecha, monto o creación, y paginación con tamaño ajustable.
- 155 pruebas automatizadas: autenticación, modelos, API, aislamiento entre cuentas, filtros, paginación e integración entre módulos.

**Frontend**

- Cliente Axios con interceptor que renueva el token ante un 401 y reintenta la petición.
- Los 401 simultáneos comparten un único refresco, evitando invalidar la sesión por rotaciones concurrentes.
- Contexto de autenticación con restauración silenciosa de la sesión al recargar.
- Guardias de rutas públicas y privadas, y vistas de login, registro y dashboard.

**Pendiente para los próximos sprints:** la app de presupuestos (`budgets`) y el dashboard con métricas y semáforos de presupuesto.

## Licencia

Distribuido bajo la licencia [MIT](LICENSE).
