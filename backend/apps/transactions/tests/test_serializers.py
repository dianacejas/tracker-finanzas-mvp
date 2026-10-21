"""Tests del serializador de transacciones: pertenencia y coherencia de tipos.

El serializador es la frontera de la API: decide qué categorías puede usar un
usuario y qué combinaciones de tipo y categoría son válidas. Los tests trabajan
sobre el serializador directamente, sin pasar por HTTP, para aislar las reglas
de validación de la capa de transporte.
"""

from datetime import date
from decimal import Decimal

from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework.test import APIRequestFactory

from apps.categories.models import Category
from apps.transactions.models import Transaction
from apps.transactions.serializers import TransactionSerializer

User = get_user_model()
PASSWORD = "ClaveSegura123"


class TransactionSerializerTestCase(TestCase):
    """Base con dos usuarios, sus categorías y un serializador con contexto."""

    def setUp(self):
        self.factory = APIRequestFactory()
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

    def request_for(self, user):
        """Construye una petición autenticada para el contexto del serializador."""
        request = self.factory.post("/api/v1/transactions/")
        request.user = user
        request.auth = None
        return request

    def serializer(self, data=None, instance=None, user=None, partial=False):
        """Devuelve un serializador con el contexto de la petición."""
        request = self.request_for(user or self.user)
        return TransactionSerializer(
            instance=instance,
            data=data,
            partial=partial,
            context={"request": request},
        )

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

    def make_transaction(self, **overrides):
        """Crea una transacción persistida directamente."""
        data = {
            "user": self.user,
            "category": self.expense_global,
            "amount": Decimal("10.00"),
            "type": Transaction.Type.EXPENSE,
            "date": date(2026, 10, 1),
        }
        data.update(overrides)
        return Transaction.objects.create(**data)


class TransactionCreationValidationTests(TransactionSerializerTestCase):
    """Validaciones aplicadas al crear un movimiento."""

    def test_valid_payload_is_accepted(self):
        """Un movimiento válido pasa la validación."""
        serializer = self.serializer(data=self.payload())

        self.assertTrue(serializer.is_valid(), serializer.errors)

    def test_save_uses_the_injected_user(self):
        """El movimiento se guarda con el usuario inyectado, no el del payload."""
        serializer = self.serializer(data=self.payload())
        self.assertTrue(serializer.is_valid(), serializer.errors)

        transaction = serializer.save(user=self.user)

        self.assertEqual(transaction.user, self.user)
        self.assertEqual(transaction.amount, Decimal("25.50"))

    def test_global_category_is_usable(self):
        """Una categoría global del sistema es utilizable por cualquier cuenta."""
        serializer = self.serializer(data=self.payload())

        self.assertTrue(serializer.is_valid(), serializer.errors)

    def test_own_private_category_is_usable(self):
        """Una categoría privada propia es utilizable."""
        serializer = self.serializer(data=self.payload(category=self.own_expense.id))

        self.assertTrue(serializer.is_valid(), serializer.errors)

    def test_another_users_private_category_is_rejected(self):
        """Usar la categoría privada de otra cuenta se rechaza."""
        serializer = self.serializer(data=self.payload(category=self.other_expense.id))

        self.assertFalse(serializer.is_valid())
        self.assertIn("category", serializer.errors)

    def test_error_does_not_reveal_if_the_category_exists(self):
        """El mensaje no revela si la categoría ajena existe."""
        serializer = self.serializer(data=self.payload(category=self.other_expense.id))
        serializer.is_valid()

        self.assertEqual(
            serializer.errors["category"][0], "Categoría no válida o no encontrada."
        )

    def test_income_with_expense_category_is_rejected(self):
        """Un ingreso no puede colgar de una categoría de gasto."""
        serializer = self.serializer(data=self.payload(type="INCOME"))

        self.assertFalse(serializer.is_valid())
        self.assertIn("category", serializer.errors)

    def test_expense_with_income_category_is_rejected(self):
        """Un gasto no puede colgar de una categoría de ingreso."""
        serializer = self.serializer(
            data=self.payload(category=self.income_global.id, type="EXPENSE")
        )

        self.assertFalse(serializer.is_valid())
        self.assertIn("category", serializer.errors)

    def test_both_category_accepts_income(self):
        """Una categoría BOTH admite un ingreso."""
        serializer = self.serializer(
            data=self.payload(category=self.both_global.id, type="INCOME")
        )

        self.assertTrue(serializer.is_valid(), serializer.errors)

    def test_both_category_accepts_expense(self):
        """Una categoría BOTH admite un gasto."""
        serializer = self.serializer(
            data=self.payload(category=self.both_global.id, type="EXPENSE")
        )

        self.assertTrue(serializer.is_valid(), serializer.errors)

    def test_zero_amount_is_rejected(self):
        """Un monto en cero se rechaza."""
        serializer = self.serializer(data=self.payload(amount="0.00"))

        self.assertFalse(serializer.is_valid())
        self.assertIn("amount", serializer.errors)

    def test_negative_amount_is_rejected(self):
        """Un monto negativo se rechaza."""
        serializer = self.serializer(data=self.payload(amount="-10.00"))

        self.assertFalse(serializer.is_valid())
        self.assertIn("amount", serializer.errors)

    def test_amount_with_more_than_two_decimals_is_rejected(self):
        """Un monto con más de dos decimales se rechaza."""
        serializer = self.serializer(data=self.payload(amount="10.999"))

        self.assertFalse(serializer.is_valid())
        self.assertIn("amount", serializer.errors)

    def test_amount_is_stored_as_exact_decimal(self):
        """El monto conserva exactamente los centavos enviados."""
        serializer = self.serializer(data=self.payload(amount="1234.56"))
        self.assertTrue(serializer.is_valid(), serializer.errors)

        transaction = serializer.save(user=self.user)

        self.assertEqual(transaction.amount, Decimal("1234.56"))
        self.assertIsInstance(transaction.amount, Decimal)

    def test_description_is_optional(self):
        """La descripción puede enviarse vacía."""
        serializer = self.serializer(data=self.payload(description=""))

        self.assertTrue(serializer.is_valid(), serializer.errors)

    def test_invalid_type_is_rejected(self):
        """Solo se admiten INCOME y EXPENSE."""
        serializer = self.serializer(data=self.payload(type="TRANSFER"))

        self.assertFalse(serializer.is_valid())
        self.assertIn("type", serializer.errors)

    def test_timestamps_are_read_only(self):
        """Las marcas de tiempo las define el servidor."""
        serializer = self.serializer(data=self.payload(created_at="2000-01-01T00:00:00Z"))

        self.assertTrue(serializer.is_valid(), serializer.errors)
        self.assertNotIn("created_at", serializer.validated_data)


class TransactionUpdateValidationTests(TransactionSerializerTestCase):
    """Validaciones aplicadas al editar un movimiento."""

    def setUp(self):
        super().setUp()
        self.transaction = self.make_transaction()

    def test_amount_can_be_changed(self):
        """El monto propio se puede editar."""
        serializer = self.serializer(
            data={"amount": "77.00"}, instance=self.transaction, partial=True
        )

        self.assertTrue(serializer.is_valid(), serializer.errors)
        serializer.save()
        self.transaction.refresh_from_db()
        self.assertEqual(self.transaction.amount, Decimal("77.00"))

    def test_cannot_switch_to_foreign_category(self):
        """Al editar no se puede pasar a la categoría privada de otro."""
        serializer = self.serializer(
            data={"category": self.other_expense.id},
            instance=self.transaction,
            partial=True,
        )

        self.assertFalse(serializer.is_valid())
        self.assertIn("category", serializer.errors)

    def test_cannot_break_type_coherence(self):
        """Al editar no se puede dejar un movimiento incoherente."""
        serializer = self.serializer(
            data={"type": "INCOME"}, instance=self.transaction, partial=True
        )

        self.assertFalse(serializer.is_valid())
        self.assertIn("category", serializer.errors)

    def test_can_switch_to_a_compatible_type(self):
        """Cambiar a un tipo compatible con la categoría sí se permite."""
        both_transaction = self.make_transaction(category=self.both_global)

        serializer = self.serializer(
            data={"type": "INCOME"}, instance=both_transaction, partial=True
        )

        self.assertTrue(serializer.is_valid(), serializer.errors)
        serializer.save()
        both_transaction.refresh_from_db()
        self.assertEqual(both_transaction.type, Transaction.Type.INCOME)

    def test_update_keeps_the_existing_category(self):
        """Una edición parcial sin categoría conserva la actual."""
        serializer = self.serializer(
            data={"amount": "12.00"}, instance=self.transaction, partial=True
        )

        self.assertTrue(serializer.is_valid(), serializer.errors)
        serializer.save()
        self.transaction.refresh_from_db()
        self.assertEqual(self.transaction.category, self.expense_global)
