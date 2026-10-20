"""Entorno de desarrollo local: carga de .env, DEBUG activo y SQLite por defecto."""

import os

from dotenv import load_dotenv

from .base import *  # noqa: F401,F403
from .base import (
    BASE_DIR,
    database_config_from_url,
    env_bool,
    env_list,
    env_required,
)

load_dotenv(BASE_DIR / ".env")

DEBUG = env_bool("DEBUG", True)

SECRET_KEY = env_required(
    "SECRET_KEY", "Copia backend/.env.example a backend/.env y ajusta los valores."
)

ALLOWED_HOSTS = env_list("ALLOWED_HOSTS", "localhost,127.0.0.1")

CORS_ALLOWED_ORIGINS = env_list("CORS_ALLOWED_ORIGINS", "http://localhost:5173")

# SQLite para desarrollo local; PostgreSQL si DATABASE_URL apunta a una instancia.
DATABASE_URL = os.getenv("DATABASE_URL", "")
if DATABASE_URL.startswith(("postgres://", "postgresql://")):
    DATABASES = {"default": database_config_from_url(DATABASE_URL)}
else:
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": BASE_DIR / "db.sqlite3",
        }
    }
