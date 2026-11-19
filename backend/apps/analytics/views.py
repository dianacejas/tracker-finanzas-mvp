from datetime import datetime

from drf_spectacular.types import OpenApiTypes
from drf_spectacular.utils import OpenApiParameter, extend_schema
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from . import services


class FinancialSummaryView(APIView):
    """Resumen consolidado de ingresos, gastos, ahorro neto y tasa de ahorro."""

    permission_classes = [IsAuthenticated]

    @extend_schema(
        tags=["Analytics"],
        summary="Obtener resumen financiero del período",
        parameters=[
            OpenApiParameter("start_date", str, description="Fecha inicio (YYYY-MM-DD)"),
            OpenApiParameter("end_date", str, description="Fecha fin (YYYY-MM-DD)"),
        ],
        responses={200: OpenApiTypes.OBJECT},
    )
    def get(self, request):
        start_date = request.query_params.get("start_date")
        end_date = request.query_params.get("end_date")

        if start_date:
            try:
                datetime.strptime(start_date, "%Y-%m-%d")
            except ValueError:
                start_date = None
        if end_date:
            try:
                datetime.strptime(end_date, "%Y-%m-%d")
            except ValueError:
                end_date = None

        data = services.get_financial_summary(request.user, start_date=start_date, end_date=end_date)
        return Response(data)


class CategoryBreakdownView(APIView):
    """Desglose porcentual y monetario de gastos por categoría."""

    permission_classes = [IsAuthenticated]

    @extend_schema(
        tags=["Analytics"],
        summary="Obtener distribución de gastos por categoría",
        parameters=[
            OpenApiParameter("start_date", str, description="Fecha inicio (YYYY-MM-DD)"),
            OpenApiParameter("end_date", str, description="Fecha fin (YYYY-MM-DD)"),
        ],
        responses={200: OpenApiTypes.OBJECT},
    )
    def get(self, request):
        start_date = request.query_params.get("start_date")
        end_date = request.query_params.get("end_date")

        if start_date:
            try:
                datetime.strptime(start_date, "%Y-%m-%d")
            except ValueError:
                start_date = None
        if end_date:
            try:
                datetime.strptime(end_date, "%Y-%m-%d")
            except ValueError:
                end_date = None

        data = services.get_category_breakdown(request.user, start_date=start_date, end_date=end_date)
        return Response(data)


class MonthlyTrendView(APIView):
    """Serie histórica mensual de ingresos vs. gastos."""

    permission_classes = [IsAuthenticated]

    @extend_schema(
        tags=["Analytics"],
        summary="Obtener evolución mensual de ingresos y gastos",
        parameters=[
            OpenApiParameter("months", int, description="Cantidad de meses hacia atrás (por defecto 6)"),
        ],
        responses={200: OpenApiTypes.OBJECT},
    )
    def get(self, request):
        months = request.query_params.get("months", 6)
        data = services.get_monthly_trend(request.user, months=months)
        return Response(data)
