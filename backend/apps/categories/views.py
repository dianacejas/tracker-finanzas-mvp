"""Vistas del módulo de categorías."""

from django.db.models import ProtectedError, Q
from drf_spectacular.utils import extend_schema, extend_schema_view
from rest_framework import serializers, viewsets
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated

from .models import Category
from .serializers import CategorySerializer


@extend_schema_view(
    list=extend_schema(tags=["Categories"], summary="Listar categorías globales y propias"),
    create=extend_schema(tags=["Categories"], summary="Crear categoría personalizada"),
    retrieve=extend_schema(tags=["Categories"], summary="Detalle de categoría"),
    update=extend_schema(tags=["Categories"], summary="Actualizar categoría propia"),
    partial_update=extend_schema(tags=["Categories"], summary="Editar parcialmente categoría propia"),
    destroy=extend_schema(tags=["Categories"], summary="Eliminar categoría propia sin uso"),
)
class CategoryViewSet(viewsets.ModelViewSet):
    """CRUD de categorías visibles para el usuario autenticado.

    El conjunto de datos es la unión de las categorías globales del sistema
    (solo lectura) y las privadas del propio usuario. Ninguna consulta puede
    alcanzar las categorías privadas de otra cuenta.
    """

    serializer_class = CategorySerializer
    permission_classes = (IsAuthenticated,)
    queryset = Category.objects.none()  # Referencia para la generación del esquema.

    def get_queryset(self):
        """Globales del sistema más las privadas del usuario autenticado."""
        if getattr(self, "swagger_fake_view", False):
            return Category.objects.none()

        return Category.objects.filter(
            Q(user__isnull=True) | Q(user=self.request.user)
        ).select_related("user")

    def perform_create(self, serializer):
        """Fuerza la pertenencia al usuario: la API no crea categorías globales."""
        serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        """Impide modificar una categoría global del sistema."""
        if serializer.instance.is_global:
            raise PermissionDenied(
                "Las categorías globales del sistema no se pueden modificar."
            )
        serializer.save()

    def perform_destroy(self, instance):
        """Bloquea el borrado de globales y de categorías en uso."""
        if instance.is_global:
            raise PermissionDenied(
                "Las categorías globales del sistema no se pueden eliminar."
            )

        try:
            instance.delete()
        except ProtectedError:
            raise serializers.ValidationError(
                {
                    "detail": (
                        "No se puede eliminar la categoría porque tiene "
                        "movimientos asociados."
                    )
                }
            )
