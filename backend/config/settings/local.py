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

SECRET_KEY = os.getenv(
    "SECRET_KEY",
    "django-insecure-peshito-local-dev-key-change-in-production-2026",
)

ALLOWED_HOSTS = env_list("ALLOWED_HOSTS", "localhost,127.0.0.1,0.0.0.0,backend")

CORS_ALLOWED_ORIGINS = env_list(
    "CORS_ALLOWED_ORIGINS",
    "http://localhost:5173,http://127.0.0.1:5173",
)

# Prioridad: 1) DATABASE_URL postgres://, 2) POSTGRES_* de Docker, 3) fallback SQLite local.
DATABASE_URL = os.getenv("DATABASE_URL", "")
POSTGRES_DB = os.getenv("POSTGRES_DB", "")
POSTGRES_HOST = os.getenv("POSTGRES_HOST", "")

if DATABASE_URL.startswith(("postgres://", "postgresql://")):
    DATABASES = {"default": database_config_from_url(DATABASE_URL)}
elif POSTGRES_DB and POSTGRES_HOST:
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.postgresql",
            "NAME": POSTGRES_DB,
            "USER": os.getenv("POSTGRES_USER", "postgres"),
            "PASSWORD": os.getenv("POSTGRES_PASSWORD", "postgres"),
            "HOST": POSTGRES_HOST,
            "PORT": os.getenv("POSTGRES_PORT", "5432"),
            "CONN_MAX_AGE": 600,
        }
    }
else:
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": BASE_DIR / "db.sqlite3",
        }
    }
