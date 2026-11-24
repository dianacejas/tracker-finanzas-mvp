from decimal import Decimal

from django.conf import settings
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models


class Budget(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="budgets",
        verbose_name="usuario",
    )
    category = models.ForeignKey(
        "categories.Category",
        on_delete=models.CASCADE,
        related_name="budgets",
        verbose_name="categoría",
    )
    amount = models.DecimalField(
        "monto",
        max_digits=12,
        decimal_places=2,
    )
    month = models.PositiveSmallIntegerField(
        "mes",
        validators=[MinValueValidator(1), MaxValueValidator(12)],
    )
    year = models.PositiveSmallIntegerField(
        "año",
        validators=[MinValueValidator(2000)],
    )
    created_at = models.DateTimeField("creado el", auto_now_add=True)
    updated_at = models.DateTimeField("actualizado el", auto_now=True)

    class Meta:
        verbose_name = "presupuesto"
        verbose_name_plural = "presupuestos"
        ordering = ["-year", "-month", "category__name"]
        constraints = [
            models.UniqueConstraint(
                fields=["user", "category", "month", "year"],
                name="unique_user_category_budget_period",
            ),
            models.CheckConstraint(
                check=models.Q(amount__gt=0),
                name="budget_amount_positive",
            ),
        ]

    def __str__(self):
        category_name = getattr(self.category, "name", self.category_id)
        user_label = getattr(self.user, "email", self.user_id)
        return f"{user_label} - {category_name} ({self.year}-{self.month:02d}): ${self.amount}"
