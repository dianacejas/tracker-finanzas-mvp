"""Enrutador central de la aplicación. Prefijo común: /api/v1/."""

from django.contrib import admin
from django.urls import include, path

# Endpoints de la API: cada módulo registra aquí sus rutas.
#   apps.users        -> /api/v1/auth/...
#   apps.categories   -> /api/v1/categories/...
#   apps.transactions -> /api/v1/transactions/...
#   apps.budgets      -> /api/v1/budgets/...
api_v1_urlpatterns = [
    path("auth/", include("apps.users.urls")),
    path("categories/", include("apps.categories.urls")),
    path("transactions/", include("apps.transactions.urls")),
]

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/v1/", include((api_v1_urlpatterns, "api"), namespace="api")),
]
