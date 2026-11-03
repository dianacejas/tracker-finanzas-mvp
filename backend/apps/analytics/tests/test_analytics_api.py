from decimal import Decimal
from datetime import date

from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase

from apps.categories.models import Category
from apps.transactions.models import Transaction

User = get_user_model()


class AnalyticsApiTests(APITestCase):
    def setUp(self):
        self.user_a = User.objects.create_user(
            username="user_a",
            email="a@example.com",
            password="pass12345",
            first_name="A",
            last_name="Test",
        )
        self.user_b = User.objects.create_user(
            username="user_b",
            email="b@example.com",
            password="pass12345",
            first_name="B",
            last_name="Test",
        )
        self.cat_exp_a = Category.objects.create(name="Comida A", type=Category.Type.EXPENSE, user=self.user_a)
        self.cat_inc_a = Category.objects.create(name="Sueldo A", type=Category.Type.INCOME, user=self.user_a)
        self.cat_exp_b = Category.objects.create(name="Comida B", type=Category.Type.EXPENSE, user=self.user_b)
        self.cat_inc_b = Category.objects.create(name="Sueldo B", type=Category.Type.INCOME, user=self.user_b)

    def test_summary_calculation_and_date_filter(self):
        self.client.force_authenticate(user=self.user_a)
        Transaction.objects.create(user=self.user_a, category=self.cat_inc_a, amount=Decimal("1000.00"), type=Transaction.Type.INCOME, date=date(2026, 10, 5))
        Transaction.objects.create(user=self.user_a, category=self.cat_exp_a, amount=Decimal("400.00"), type=Transaction.Type.EXPENSE, date=date(2026, 10, 10))
        Transaction.objects.create(user=self.user_a, category=self.cat_exp_a, amount=Decimal("200.00"), type=Transaction.Type.EXPENSE, date=date(2026, 9, 15))

        # All
        resp = self.client.get("/api/v1/analytics/summary/")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data["total_income"], "1000.00")
        self.assertEqual(resp.data["total_expense"], "600.00")
        self.assertEqual(resp.data["net_savings"], "400.00")
        # savings_rate 40%
        self.assertAlmostEqual(float(resp.data["savings_rate"]), 40.0, places=2)

        # Filter by date range (only october)
        resp2 = self.client.get("/api/v1/analytics/summary/?start_date=2026-10-01&end_date=2026-10-31")
        self.assertEqual(resp2.status_code, status.HTTP_200_OK)
        self.assertEqual(resp2.data["total_income"], "1000.00")
        self.assertEqual(resp2.data["total_expense"], "400.00")
        self.assertEqual(resp2.data["net_savings"], "600.00")

    def test_summary_empty_user_no_division_by_zero(self):
        self.client.force_authenticate(user=self.user_a)
        resp = self.client.get("/api/v1/analytics/summary/")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data["total_income"], "0.00")
        self.assertEqual(resp.data["total_expense"], "0.00")
        self.assertEqual(resp.data["net_savings"], "0.00")
        self.assertEqual(float(resp.data["savings_rate"]), 0.00)

    def test_summary_deficit_savings_rate_zero(self):
        self.client.force_authenticate(user=self.user_a)
        Transaction.objects.create(user=self.user_a, category=self.cat_inc_a, amount=Decimal("100.00"), type=Transaction.Type.INCOME, date=date(2026, 10, 1))
        Transaction.objects.create(user=self.user_a, category=self.cat_exp_a, amount=Decimal("200.00"), type=Transaction.Type.EXPENSE, date=date(2026, 10, 5))
        resp = self.client.get("/api/v1/analytics/summary/")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data["net_savings"], "-100.00")
        self.assertEqual(float(resp.data["savings_rate"]), 0.00)

    def test_category_breakdown_expense_only_and_percentage(self):
        self.client.force_authenticate(user=self.user_a)
        cat_exp_a2 = Category.objects.create(name="Transporte A", type=Category.Type.EXPENSE, user=self.user_a)
        Transaction.objects.create(user=self.user_a, category=self.cat_exp_a, amount=Decimal("300.00"), type=Transaction.Type.EXPENSE, date=date(2026, 10, 1))
        Transaction.objects.create(user=self.user_a, category=cat_exp_a2, amount=Decimal("100.00"), type=Transaction.Type.EXPENSE, date=date(2026, 10, 2))
        Transaction.objects.create(user=self.user_a, category=self.cat_inc_a, amount=Decimal("500.00"), type=Transaction.Type.INCOME, date=date(2026, 10, 3))
        resp = self.client.get("/api/v1/analytics/category-breakdown/")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(len(resp.data), 2)
        # Descending by amount
        self.assertEqual(resp.data[0]["category_id"], self.cat_exp_a.id)
        self.assertEqual(float(resp.data[0]["percentage"]), 75.0)
        self.assertEqual(float(resp.data[1]["percentage"]), 25.0)

    def test_monthly_trend_truncmonth(self):
        self.client.force_authenticate(user=self.user_a)
        Transaction.objects.create(user=self.user_a, category=self.cat_inc_a, amount=Decimal("1000.00"), type=Transaction.Type.INCOME, date=date(2026, 9, 10))
        Transaction.objects.create(user=self.user_a, category=self.cat_exp_a, amount=Decimal("300.00"), type=Transaction.Type.EXPENSE, date=date(2026, 9, 15))
        Transaction.objects.create(user=self.user_a, category=self.cat_inc_a, amount=Decimal("1200.00"), type=Transaction.Type.INCOME, date=date(2026, 10, 5))
        Transaction.objects.create(user=self.user_a, category=self.cat_exp_a, amount=Decimal("400.00"), type=Transaction.Type.EXPENSE, date=date(2026, 10, 12))
        resp = self.client.get("/api/v1/analytics/monthly-trend/?months=6")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertIsInstance(resp.data, list)
        self.assertTrue(len(resp.data) >= 1)

    def test_multi_tenant_isolation_analytics(self):
        Transaction.objects.create(user=self.user_a, category=self.cat_inc_a, amount=Decimal("1000.00"), type=Transaction.Type.INCOME, date=date(2026, 10, 1))
        Transaction.objects.create(user=self.user_b, category=self.cat_inc_b, amount=Decimal("9999.00"), type=Transaction.Type.INCOME, date=date(2026, 10, 1))
        self.client.force_authenticate(user=self.user_a)
        resp = self.client.get("/api/v1/analytics/summary/")
        self.assertEqual(resp.data["total_income"], "1000.00")
        resp2 = self.client.get("/api/v1/analytics/category-breakdown/")
        # user_a has no expenses
        self.assertEqual(resp2.data, [])
