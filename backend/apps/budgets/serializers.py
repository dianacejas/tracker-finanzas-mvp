from decimal import Decimal

from django.db.models import Sum
from rest_framework import serializers

from apps.categories.models import Category
from apps.categories.serializers import CategorySerializer
from apps.transactions.models import Transaction

from .models import Budget


class BudgetSerializer(serializers.ModelSerializer):
    category_detail = CategorySerializer(source="category", read_only=True)
    spent_amount = serializers.SerializerMethodField()
    remaining_amount = serializers.SerializerMethodField()
    progress_percentage = serializers.SerializerMethodField()
    is_exceeded = serializers.SerializerMethodField()

    class Meta:
        model = Budget
        fields = [
            "id",
            "category",
            "category_detail",
            "amount",
            "month",
            "year",
            "spent_amount",
            "remaining_amount",
            "progress_percentage",
            "is_exceeded",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "category_detail",
            "spent_amount",
            "remaining_amount",
            "progress_percentage",
            "is_exceeded",
            "created_at",
            "updated_at",
        ]

    def get_spent_amount(self, obj):
        request = self.context.get("request")
        user = getattr(request, "user", None) or getattr(obj, "user", None)
        if not user:
            return "0.00"
        total = (
            Transaction.objects.filter(
                user=user,
                category=obj.category,
                type=Transaction.Type.EXPENSE,
                date__year=obj.year,
                date__month=obj.month,
            ).aggregate(total=Sum("amount"))["total"]
        )
        if total is None:
            total = Decimal("0.00")
        return f"{total:.2f}"

    def get_remaining_amount(self, obj):
        spent = Decimal(self.get_spent_amount(obj))
        amount = obj.amount if isinstance(obj.amount, Decimal) else Decimal(str(obj.amount))
        remaining = amount - spent
        return f"{remaining:.2f}"

    def get_progress_percentage(self, obj):
        spent = Decimal(self.get_spent_amount(obj))
        amount = obj.amount if isinstance(obj.amount, Decimal) else Decimal(str(obj.amount))
        if amount <= 0:
            return 0.0
        percentage = (spent / amount) * Decimal("100")
        # Permitir más de 100% para reflejar exceso
        rounded = percentage.quantize(Decimal("0.01"))
        return float(rounded)

    def get_is_exceeded(self, obj):
        spent = Decimal(self.get_spent_amount(obj))
        amount = obj.amount if isinstance(obj.amount, Decimal) else Decimal(str(obj.amount))
        return spent > amount

    def validate(self, attrs):
        request = self.context.get("request")
        user = getattr(request, "user", None)
        category = attrs.get("category") or getattr(self.instance, "category", None)

        if category is not None:
            # Verificar pertenencia
            if category.user is not None and user is not None and category.user_id != user.id:
                raise serializers.ValidationError(
                    {"category": "Categoría no válida o no encontrada."}
                )
            # Verificar que permita gastos
            if category.type == Category.Type.INCOME:
                raise serializers.ValidationError(
                    {"category": "No puedes crear un presupuesto para una categoría de solo ingresos."}
                )

        return attrs
