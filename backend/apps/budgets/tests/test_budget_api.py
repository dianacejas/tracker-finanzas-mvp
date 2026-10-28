from decimal import Decimal
from datetime import date

from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase

from apps.categories.models import Category
from apps.transactions.models import Transaction
from apps.budgets.models import Budget

User = get_user_model()


class BudgetApiTests(APITestCase):
    def setUp(self):
        self.user_a = User.objects.create_user(username="user_a", email="a@example.com", password="pass12345")
        self.user_b = User.objects.create_user(username="user_b", email="b@example.com", password="pass12345")
        self.cat_a = Category.objects.create(name="Comida", type=Category.Type.EXPENSE, user=self.user_a)
        self.cat_b = Category.objects.create(name="Comida B", type=Category.Type.EXPENSE, user=self.user_b)
        self.cat_inc = Category.objects.create(name="Sueldo", type=Category.Type.INCOME, user=self.user_a)

    def test_cannot_budget_for_income_category(self):
        self.client.force_authenticate(user=self.user_a)
        resp = self.client.post("/api/v1/budgets/", {"category": self.cat_inc.id, "amount": "500.00", "month": 10, "year": 2026}, format="json")
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)

    def test_cannot_use_other_users_category(self):
        self.client.force_authenticate(user=self.user_a)
        resp = self.client.post("/api/v1/budgets/", {"category": self.cat_b.id, "amount": "500.00", "month": 10, "year": 2026}, format="json")
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)

    def test_dynamic_progress_spent_remaining_exceeded(self):
        self.client.force_authenticate(user=self.user_a)
        resp = self.client.post("/api/v1/budgets/", {"category": self.cat_a.id, "amount": "500.00", "month": 10, "year": 2026}, format="json")
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)
        budget_id = resp.data["id"]
        # Sin gastos
        self.assertEqual(resp.data["spent_amount"], "0.00")
        self.assertEqual(resp.data["remaining_amount"], "500.00")
        self.assertEqual(float(resp.data["progress_percentage"]), 0.0)
        self.assertFalse(resp.data["is_exceeded"])

        # Agregar gastos
        Transaction.objects.create(user=self.user_a, category=self.cat_a, amount=Decimal("200.00"), type=Transaction.Type.EXPENSE, date=date(2026, 10, 5))
        Transaction.objects.create(user=self.user_a, category=self.cat_a, amount=Decimal("400.00"), type=Transaction.Type.EXPENSE, date=date(2026, 10, 15))
        # Otro mes no debe contar
        Transaction.objects.create(user=self.user_a, category=self.cat_a, amount=Decimal("100.00"), type=Transaction.Type.EXPENSE, date=date(2026, 9, 15))

        resp2 = self.client.get(f"/api/v1/budgets/{budget_id}/")
        self.assertEqual(resp2.status_code, status.HTTP_200_OK)
        self.assertEqual(resp2.data["spent_amount"], "600.00")
        self.assertEqual(resp2.data["remaining_amount"], "-100.00")
        self.assertEqual(float(resp2.data["progress_percentage"]), 120.0)
        self.assertTrue(resp2.data["is_exceeded"])

    def test_multi_tenant_isolation_budgets(self):
        Budget.objects.create(user=self.user_a, category=self.cat_a, amount=Decimal("500.00"), month=10, year=2026)
        b_b = Budget.objects.create(user=self.user_b, category=self.cat_b, amount=Decimal("800.00"), month=10, year=2026)
        self.client.force_authenticate(user=self.user_a)
        resp = self.client.get("/api/v1/budgets/")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        results = resp.data.get("results", resp.data)
        self.assertEqual(len(results), 1)
        # No puede ver presupuesto ajeno
        resp2 = self.client.get(f"/api/v1/budgets/{b_b.id}/")
        self.assertEqual(resp2.status_code, status.HTTP_404_NOT_FOUND)
