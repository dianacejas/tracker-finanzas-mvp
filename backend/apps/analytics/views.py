from datetime import datetime

from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from . import services


class FinancialSummaryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        start_date = request.query_params.get("start_date")
        end_date = request.query_params.get("end_date")

        # Validación básica de formato
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
    permission_classes = [IsAuthenticated]

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
    permission_classes = [IsAuthenticated]

    def get(self, request):
        months = request.query_params.get("months", 6)
        data = services.get_monthly_trend(request.user, months=months)
        return Response(data)
