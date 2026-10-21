"""Vistas del módulo de transacciones."""

from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, viewsets
from rest_framework.permissions import IsAuthenticated

from .filters import TransactionFilterSet
from .models import Transaction
from .serializers import TransactionSerializer


class TransactionViewSet(viewsets.ModelViewSet):
    """CRUD de movimientos del usuario autenticado.

    El queryset se acota estrictamente al usuario en cada petición, por lo que
    ningún otro puede leer, modificar o borrar un movimiento ajeno. Los filtros
    y el orden operan sobre ese conjunto ya recortado.
    """

    serializer_class = TransactionSerializer
    permission_classes = (IsAuthenticated,)
    queryset = Transaction.objects.none()  # Referencia para la generación del esquema.

    filter_backends = (DjangoFilterBackend, filters.OrderingFilter)
    filterset_class = TransactionFilterSet
    ordering_fields = ("date", "amount", "created_at")
    ordering = ("-date", "-created_at")

    def get_queryset(self):
        """Solo los movimientos del usuario autenticado, con la categoría en línea."""
        # drf-spectacular resuelve el queryset sin usuario autenticado.
        if getattr(self, "swagger_fake_view", False):
            return Transaction.objects.none()

        # El orden lo aplica `OrderingFilter`, que solo admite los campos
        # declarados en `ordering_fields` y usa `ordering` como valor por defecto.
        return Transaction.objects.filter(user=self.request.user).select_related(
            "category"
        )

    def perform_create(self, serializer):
        """Inyecta la pertenencia del movimiento: el cliente no la decide."""
        serializer.save(user=self.request.user)
