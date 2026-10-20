# 💰 Tracker de Finanzas Personales

![Django](https://img.shields.io/badge/Django-5.0-092E20?style=flat&logo=django&logoColor=white)
![DRF](https://img.shields.io/badge/Django%20REST-Framework-ff1717?style=flat)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat&logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind%20CSS-3-38B2AC?style=flat&logo=tailwindcss&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-green)

Aplicación web para registrar ingresos y gastos, controlar presupuestos mensuales por categoría y visualizar el balance financiero personal con gráficos en tiempo real.

---

## 📖 Descripción del Producto

**Tracker de Finanzas Personales** resuelve un problema cotidiano: la dificultad de saber cuánto se gana, cuánto se gasta y en qué se consume el dinero mes a mes, sin depender de hojas de cálculo manuales y propensas al error.

**Problemas que resuelve:**
- Registro rápido de movimientos con categorización clara (ingresos/gastos).
- Control preventivo del gasto mediante presupuestos mensuales con semáforo de alerta.
- Visibilidad inmediata del balance: totales, distribución por categoría y evolución mensual.

## 📸 Capturas

> *Capturas de pantalla pendientes al cierre del Sprint 4 (dashboard, movimientos y presupuestos).*

| Login | Dashboard |
| :---: | :---: |
| 🖼️ *placeholder* | 🖼️ *placeholder* |

## 🛠️ Stack Tecnológico

| Capa | Tecnologías |
|---|---|
| **Backend** | Django 5, Django REST Framework, djangorestframework-simplejwt, django-filter, django-environ, drf-spectacular, django-cors-headers |
| **Frontend** | React 19 + Vite, Tailwind CSS v3, React Router, Axios, Lucide React, clsx + tailwind-merge |
| **Base de datos** | SQLite (desarrollo) · PostgreSQL (producción, vía Docker Compose) |
| **Calidad y entrega** | Django TestCase + APITestCase, GitHub Actions CI, Docker |

## 🏗️ Arquitectura

Monorepo con dos aplicaciones independientes que se comunican mediante una API REST versionada (`/api/v1/`).

```
tracker-finanzas-mvp/
├── backend/                      # API Django
│   ├── config/                   # Proyecto: urls, asgi/wsgi
│   │   └── settings/             # base.py · local.py · production.py
│   ├── apps/
│   │   ├── users/                # Custom User (email como identificador)
│   │   ├── categories/           # Categorías globales + privadas
│   │   ├── transactions/         # Ingresos/gastos + agregaciones
│   │   └── budgets/              # Presupuestos mensuales y semáforos
│   ├── requirements.txt
│   └── .env.example
├── frontend/                     # SPA React (Vite + Tailwind)
│   └── src/
│       ├── api/                  # Cliente Axios + interceptor JWT
│       ├── components/           # UI reutilizable (ui/layout/shared)
│       ├── context/              # AuthContext (access token en memoria)
│       ├── pages/                # Login · Register · Dashboard · ...
│       └── routes/               # React Router + ProtectedRoute
├── .gitignore                    # Zero-leak: .env, BD, node_modules
├── .editorconfig
└── README.md
```

**Decisiones clave de diseño:**
- **Autenticación JWT segura:** *Access token* en memoria (estado de React) y *refresh token* en cookie `HttpOnly`, con rotación y lista negra al cerrar sesión. Interceptor de Axios que renueva el token ante un 401 y reintenta la petición sin interrumpir al usuario.
- **Aislamiento multi-tenant:** toda consulta se restringe al usuario autenticado; el `user_id` nunca se acepta desde el payload.
- **Categorías híbridas:** globales del sistema (solo lectura, compartidas) + categorías privadas por usuario. Borrado protegido cuando existen transacciones asociadas.
- **Precisión contable:** montos en `DecimalField`, sin punto flotante.

## 🚀 Inicio Rápido

**Prerrequisitos:** Python 3.11+, Node.js 20+, Git.

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

> 🔒 **Política de seguridad:** los archivos `.env` nunca se commitean. Solo se publican plantillas `.env.example` con valores ficticios.

## 🗺️ Roadmap

| Sprint | Objetivo | Estado |
|---|---|---|
| **Sprint 1** | Fundaciones, arquitectura y autenticación JWT segura | 🔄 En curso |
| **Sprint 2** | Núcleo financiero: categorías y CRUD de transacciones | ⬜ Pendiente |
| **Sprint 3** | Métricas, presupuestos con semáforos y dashboard | ⬜ Pendiente |
| **Sprint 4** | Tests de calidad, documentación OpenAPI, Docker y deploy | ⬜ Pendiente |

## 📄 Licencia

Distribuido bajo la licencia [MIT](LICENSE).
