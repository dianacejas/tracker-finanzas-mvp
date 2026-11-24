"""Vistas del módulo de transacciones."""

from django.db.models import Q
from django.http import HttpResponse
from django_filters.rest_framework import DjangoFilterBackend
from drf_spectacular.types import OpenApiTypes
from drf_spectacular.utils import OpenApiParameter, extend_schema, extend_schema_view
from rest_framework import filters, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated

from .filters import TransactionFilterSet
from .models import Transaction
from .serializers import TransactionSerializer
from .xlsx_export import build_transactions_xlsx


@extend_schema_view(
    list=extend_schema(tags=["Transactions"], summary="Listar movimientos paginados y filtrados"),
    create=extend_schema(tags=["Transactions"], summary="Registrar un nuevo movimiento"),
    retrieve=extend_schema(tags=["Transactions"], summary="Obtener detalle de un movimiento"),
    update=extend_schema(tags=["Transactions"], summary="Actualizar un movimiento"),
    partial_update=extend_schema(tags=["Transactions"], summary="Editar parcialmente un movimiento"),
    destroy=extend_schema(tags=["Transactions"], summary="Eliminar un movimiento"),
)
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
        if getattr(self, "swagger_fake_view", False):
            return Transaction.objects.none()

        return Transaction.objects.filter(user=self.request.user).select_related(
            "category"
        )

    def perform_create(self, serializer):
        """Inyecta la pertenencia del movimiento: el cliente no la decide."""
        serializer.save(user=self.request.user)

    @extend_schema(
        tags=["Transactions"],
        summary="Exportar movimientos filtrados a Excel (.xlsx)",
        parameters=[
            OpenApiParameter("search", str, description="Búsqueda por descripción o nombre de categoría"),
        ],
        responses={
            (200, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"): OpenApiTypes.BINARY
        },
    )
    @action(detail=False, methods=["get"], url_path="export")
    def export_xlsx(self, request):
        """Exporta los movimientos filtrados del usuario a una planilla Excel (.xlsx)."""
        queryset = self.filter_queryset(self.get_queryset())
        search = (request.query_params.get("search") or "").strip()
        if search:
            queryset = queryset.filter(
                Q(description__icontains=search) | Q(category__name__icontains=search)
            )

        content = build_transactions_xlsx(queryset)
        response = HttpResponse(
            content,
            content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        )
        response["Content-Disposition"] = 'attachment; filename="peshito_transacciones.xlsx"'
        return response
