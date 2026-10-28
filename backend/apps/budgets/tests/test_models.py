from decimal import Decimal
from datetime import date

from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.db import IntegrityError
from django.test import TestCase

from apps.categories.models import Category
from apps.budgets.models import Budget

User = get_user_model()


class BudgetModelTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(email="t@example.com", password="pass12345")
        self.cat = Category.objects.create(name="Comida", type=Category.Type.EXPENSE, user=self.user)

    def test_amount_positive_constraint(self):
        budget = Budget(user=self.user, category=self.cat, amount=Decimal("0.00"), month=10, year=2026)
        with self.assertRaises((ValidationError, IntegrityError)):
            budget.full_clean()
            budget.save()
        budget_neg = Budget(user=self.user, category=self.cat, amount=Decimal("-10.00"), month=10, year=2026)
        with self.assertRaises((ValidationError, IntegrityError)):
            budget_neg.full_clean()
            budget_neg.save()

    def test_unique_constraint_user_category_month_year(self):
        Budget.objects.create(user=self.user, category=self.cat, amount=Decimal("500.00"), month=10, year=2026)
        with self.assertRaises(IntegrityError):
            Budget.objects.create(user=self.user, category=self.cat, amount=Decimal("600.00"), month=10, year=2026)
