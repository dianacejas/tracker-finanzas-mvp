from rest_framework import permissions, viewsets

from .models import Budget
from .serializers import BudgetSerializer


class BudgetViewSet(viewsets.ModelViewSet):
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
