"""Vistas del módulo de categorías."""

from django.db.models import ProtectedError, Q
from rest_framework import serializers, viewsets
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated

from .models import Category
from .serializers import CategorySerializer


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
        # drf-spectacular resuelve el queryset sin usuario autenticado.
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
        """Bloquea el borrado de globales y de categorías en uso.

        Las reglas son deliberadamente distintas en su código HTTP: intentar
        borrar una categoría del sistema es un problema de permisos (403),
        mientras que una categoría propia con movimientos asociados es un
        conflicto de integridad (400) que el usuario puede resolver.
        """
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
