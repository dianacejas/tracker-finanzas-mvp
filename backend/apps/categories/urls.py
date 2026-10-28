"""Rutas del módulo de categorías, montadas bajo /api/v1/categories/."""

from rest_framework.routers import DefaultRouter

from .views import CategoryViewSet

app_name = "categories"

router = DefaultRouter()
router.register("", CategoryViewSet, basename="category")

urlpatterns = router.urls
