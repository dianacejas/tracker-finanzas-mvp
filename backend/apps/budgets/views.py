from drf_spectacular.utils import OpenApiParameter, extend_schema, extend_schema_view
from rest_framework import permissions, viewsets

from .models import Budget
from .serializers import BudgetSerializer


@extend_schema_view(
    list=extend_schema(
        tags=["Budgets"],
        summary="Listar presupuestos mensuales del usuario",
        parameters=[
            OpenApiParameter("month", int, description="Mes (1-12)"),
            OpenApiParameter("year", int, description="Año (ej. 2026)"),
        ],
    ),
    create=extend_schema(tags=["Budgets"], summary="Crear presupuesto mensual"),
    retrieve=extend_schema(tags=["Budgets"], summary="Detalle de presupuesto"),
    update=extend_schema(tags=["Budgets"], summary="Actualizar presupuesto"),
    partial_update=extend_schema(tags=["Budgets"], summary="Actualizar parcialmente presupuesto"),
    destroy=extend_schema(tags=["Budgets"], summary="Eliminar presupuesto"),
)
class BudgetViewSet(viewsets.ModelViewSet):
    """CRUD de presupuestos mensuales por categoría del usuario autenticado."""

    serializer_class = BudgetSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False):
            return Budget.objects.none()
        queryset = (
            Budget.objects.filter(user=self.request.user)
            .select_related("category")
        )
        month = self.request.query_params.get("month")
        year = self.request.query_params.get("year")
        if month:
            try:
                queryset = queryset.filter(month=int(month))
            except (TypeError, ValueError):
                pass
        if year:
            try:
                queryset = queryset.filter(year=int(year))
            except (TypeError, ValueError):
                pass
        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
