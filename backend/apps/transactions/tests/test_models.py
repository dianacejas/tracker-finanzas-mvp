"""Tests del modelo de transacciones: precisión decimal y restricciones."""

from datetime import date
from decimal import Decimal

from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.db import IntegrityError, transaction
from django.test import TestCase

from apps.categories.models import Category
from apps.transactions.models import Transaction

User = get_user_model()
PASSWORD = "ClaveSegura123"


class TransactionModelTests(TestCase):
    """Reglas del modelo y de la base de datos."""

    def setUp(self):
        self.user = User.objects.create_user(
            email="ana@example.com", username="ana", password=PASSWORD
        )
        self.expense_category = Category.objects.create(
            name="Alimentación", type=Category.Type.EXPENSE, user=None
        )
        self.income_category = Category.objects.create(
            name="Sueldo", type=Category.Type.INCOME, user=None
        )
        self.both_category = Category.objects.create(
            name="Varios", type=Category.Type.BOTH, user=None
        )

    def make_transaction(self, **overrides):
        """Crea una transacción válida con los campos indicados."""
        data = {
            "user": self.user,
            "category": self.expense_category,
            "amount": Decimal("25.50"),
            "type": Transaction.Type.EXPENSE,
            "date": date(2026, 10, 15),
        }
        data.update(overrides)
        return Transaction.objects.create(**data)

    def test_amount_uses_decimal_not_float(self):
        """El monto se almacena con precisión decimal exacta."""
        transaction_obj = self.make_transaction(amount=Decimal("0.10"))

        transaction_obj.refresh_from_db()
        self.assertIsInstance(transaction_obj.amount, Decimal)
        self.assertEqual(transaction_obj.amount, Decimal("0.10"))

    def test_amount_preserves_two_decimal_places(self):
        """Los centavos no se pierden al guardar."""
        transaction_obj = self.make_transaction(amount=Decimal("1234.56"))

        transaction_obj.refresh_from_db()
        self.assertEqual(str(transaction_obj.amount), "1234.56")

    def test_amount_sum_has_no_float_drift(self):
        """La suma de decimales no acumula error de punto flotante.

        En punto flotante, 0.1 + 0.2 != 0.3. Con Decimal la suma es exacta.
        """
        self.make_transaction(amount=Decimal("0.10"))
        self.make_transaction(amount=Decimal("0.20"))

        from django.db.models import Sum

        result = Transaction.objects.aggregate(total=Sum("amount"))
        self.assertEqual(result["total"], Decimal("0.30"))

    def test_zero_amount_is_rejected_by_database(self):
        """El CHECK de la base de datos impide guardar un monto en cero."""
        with self.assertRaises(IntegrityError):
            with transaction.atomic():
                self.make_transaction(amount=Decimal("0.00"))

    def test_negative_amount_is_rejected_by_database(self):
        """El CHECK de la base de datos impide guardar un monto negativo."""
        with self.assertRaises(IntegrityError):
            with transaction.atomic():
                self.make_transaction(amount=Decimal("-10.00"))

    def test_clean_rejects_non_positive_amount(self):
        """`clean()` rechaza el monto no positivo antes de tocar la base."""
        transaction_obj = Transaction(
            user=self.user,
            category=self.expense_category,
            amount=Decimal("-5.00"),
            type=Transaction.Type.EXPENSE,
            date=date(2026, 10, 15),
        )

        with self.assertRaises(ValidationError) as context:
            transaction_obj.clean()

        self.assertIn("amount", context.exception.message_dict)

    def test_clean_rejects_type_mismatch(self):
        """Un ingreso no puede colgar de una categoría de gasto."""
        transaction_obj = Transaction(
            user=self.user,
            category=self.expense_category,
            amount=Decimal("10.00"),
            type=Transaction.Type.INCOME,
            date=date(2026, 10, 15),
        )

        with self.assertRaises(ValidationError) as context:
            transaction_obj.clean()

        self.assertIn("category", context.exception.message_dict)

    def test_clean_allows_matching_type(self):
        """Un gasto con categoría de gasto es válido."""
        transaction_obj = Transaction(
            user=self.user,
            category=self.expense_category,
            amount=Decimal("10.00"),
            type=Transaction.Type.EXPENSE,
            date=date(2026, 10, 15),
        )

        transaction_obj.clean()  # no debe lanzar

    def test_clean_allows_both_category_with_either_type(self):
        """Una categoría BOTH admite ingresos y gastos."""
        for movement_type in (Transaction.Type.INCOME, Transaction.Type.EXPENSE):
            with self.subTest(type=movement_type):
                transaction_obj = Transaction(
                    user=self.user,
                    category=self.both_category,
                    amount=Decimal("10.00"),
                    type=movement_type,
                    date=date(2026, 10, 15),
                )
                transaction_obj.clean()  # no debe lanzar

    def test_category_is_protected_from_deletion(self):
        """Una categoría con movimientos no se puede eliminar."""
        self.make_transaction()

        with self.assertRaises(Exception) as context:
            self.expense_category.delete()

        from django.db.models import ProtectedError

        self.assertIsInstance(context.exception, ProtectedError)

    def test_deleting_user_cascades_transactions(self):
        """Al eliminar la cuenta se eliminan sus movimientos."""
        self.make_transaction()

        self.user.delete()

        self.assertEqual(Transaction.objects.count(), 0)

    def test_default_ordering_is_by_date_desc(self):
        """El orden por defecto es fecha descendente."""
        self.make_transaction(date=date(2026, 1, 10))
        self.make_transaction(date=date(2026, 6, 10))
        self.make_transaction(date=date(2026, 3, 10))

        dates = list(Transaction.objects.values_list("date", flat=True))

        self.assertEqual(
            dates, [date(2026, 6, 10), date(2026, 3, 10), date(2026, 1, 10)]
        )

    def test_updated_at_changes_on_edit(self):
        """`updated_at` se refresca al editar el movimiento."""
        transaction_obj = self.make_transaction()
        first_updated = transaction_obj.updated_at

        transaction_obj.amount = Decimal("30.00")
        transaction_obj.save()

        transaction_obj.refresh_from_db()
        self.assertGreaterEqual(transaction_obj.updated_at, first_updated)

    def test_str_represents_the_movement(self):
        """La representación textual identifica tipo, monto y fecha."""
        transaction_obj = self.make_transaction()

        self.assertIn("Gasto", str(transaction_obj))
        self.assertIn("25.50", str(transaction_obj))


class UserDeletionTests(TestCase):
    """La cuenta se puede eliminar siempre, con sus movimientos y categorías.

    Las transacciones protegen a su categoría con `on_delete=PROTECT`. Ese mismo
    mecanismo bloquearía el borrado de la cuenta, así que los movimientos se
    retiran antes de eliminar al usuario, tanto en el borrado individual como
    en el borrado en bloque.
    """

    def setUp(self):
        self.user = User.objects.create_user(
            email="ana@example.com", username="ana", password=PASSWORD
        )
        self.private_category = Category.objects.create(
            name="Gimnasio", type=Category.Type.EXPENSE, user=self.user
        )
        self.transaction = Transaction.objects.create(
            user=self.user,
            category=self.private_category,
            amount=Decimal("10.00"),
            type=Transaction.Type.EXPENSE,
            date=date(2026, 10, 15),
        )

    def test_deleting_user_removes_transactions_and_private_categories(self):
        """Al eliminar la cuenta, sus movimientos y categorías privadas se van."""
        self.user.delete()

        self.assertFalse(
            Category.objects.filter(pk=self.private_category.pk).exists()
        )
        self.assertEqual(Transaction.objects.count(), 0)

    def test_deleting_user_keeps_global_categories(self):
        """Las categorías globales del sistema no se tocan."""
        global_category = Category.objects.create(
            name="Alimentación", type=Category.Type.EXPENSE, user=None
        )

        self.user.delete()

        self.assertTrue(Category.objects.filter(pk=global_category.pk).exists())

    def test_bulk_delete_removes_transactions_and_private_categories(self):
        """El borrado en bloque también respeta la protección.

        `QuerySet.delete()` no pasa por el método `delete()` del modelo, así que
        el borrado masivo necesita resolver el conflicto por su cuenta.
        """
        User.objects.filter(pk=self.user.pk).delete()

        self.assertFalse(
            Category.objects.filter(pk=self.private_category.pk).exists()
        )
        self.assertEqual(Transaction.objects.count(), 0)

    def test_bulk_delete_keeps_other_users_data(self):
        """El borrado en bloque de una cuenta no toca los datos ajenos."""
        other = User.objects.create_user(
            email="luis@example.com", username="luis", password=PASSWORD
        )
        other_category = Category.objects.create(
            name="Mascotas", type=Category.Type.EXPENSE, user=other
        )
        other_transaction = Transaction.objects.create(
            user=other,
            category=other_category,
            amount=Decimal("5.00"),
            type=Transaction.Type.EXPENSE,
            date=date(2026, 10, 15),
        )

        User.objects.filter(pk=self.user.pk).delete()

        self.assertTrue(User.objects.filter(pk=other.pk).exists())
        self.assertTrue(Category.objects.filter(pk=other_category.pk).exists())
        self.assertTrue(Transaction.objects.filter(pk=other_transaction.pk).exists())

