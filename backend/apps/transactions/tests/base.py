"""Utilidades compartidas por los tests del módulo de transacciones."""

from datetime import date
from decimal import Decimal

from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase

from apps.categories.models import Category
from apps.transactions.models import Transaction

User = get_user_model()
PASSWORD = "ClaveSegura123"
LIST_URL = "/api/v1/transactions/"


def detail_url(pk):
    """URL del detalle de una transacción."""
    return f"/api/v1/transactions/{pk}/"


class TransactionApiBaseTests(APITestCase):
    """Base compartida con dos usuarios y sus categorías."""

    def setUp(self):
        self.user = User.objects.create_user(
            email="ana@example.com", username="ana", password=PASSWORD
        )
        self.other = User.objects.create_user(
            email="luis@example.com", username="luis", password=PASSWORD
        )

        # Categorías globales del sistema.
        self.expense_global = Category.objects.create(
            name="Alimentación", type=Category.Type.EXPENSE, user=None
        )
        self.income_global = Category.objects.create(
            name="Sueldo", type=Category.Type.INCOME, user=None
        )
        self.both_global = Category.objects.create(
            name="Varios", type=Category.Type.BOTH, user=None
        )

        # Categorías privadas.
        self.own_expense = Category.objects.create(
            name="Gimnasio", type=Category.Type.EXPENSE, user=self.user
        )
        self.other_expense = Category.objects.create(
            name="Mascotas", type=Category.Type.EXPENSE, user=self.other
        )

        self.client.force_authenticate(self.user)

    def payload(self, **overrides):
        """Cuerpo válido para crear una transacción."""
        data = {
            "category": self.expense_global.id,
            "amount": "25.50",
            "type": "EXPENSE",
            "date": "2026-10-15",
            "description": "Compra semanal",
        }
        data.update(overrides)
        return data

    def make_transaction(self, user=None, **overrides):
        """Crea una transacción persistida directamente."""
        data = {
            "user": user or self.user,
            "category": self.expense_global,
            "amount": Decimal("10.00"),
            "type": Transaction.Type.EXPENSE,
            "date": date(2026, 10, 1),
        }
        data.update(overrides)
        return Transaction.objects.create(**data)
