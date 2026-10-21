"""Verificación de la integración entre categorías y transacciones.

Comprueba que la relación `on_delete=PROTECT` hace que el borrado de una
categoría con movimientos responda 400 Bad Request, tal como se fijó en FIN-8,
y que la cuenta del usuario siempre pueda eliminarse.
"""

from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase

from apps.categories.models import Category
from apps.transactions.models import Transaction

User = get_user_model()
PASSWORD = "ClaveSegura123"


class CategoryProtectionIntegrationTests(APITestCase):
    """El borrado de una categoría con movimientos se bloquea."""

    def setUp(self):
        self.user = User.objects.create_user(
            email="ana@example.com", username="ana", password=PASSWORD
        )
        self.client.force_authenticate(self.user)

    def make_private_category(self, name="Gimnasio"):
        """Crea una categoría privada del usuario autenticado."""
        return Category.objects.create(
            name=name, type=Category.Type.EXPENSE, user=self.user
        )

    def make_transaction(self, category):
        """Crea un movimiento sobre la categoría indicada."""
        return Transaction.objects.create(
            user=self.user,
            category=category,
            amount="25.50",
            type=Transaction.Type.EXPENSE,
            date="2026-10-15",
        )

    def test_delete_private_category_with_transactions_returns_400(self):
        """Una categoría privada con movimientos no se puede eliminar: 400."""
        category = self.make_private_category()
        self.make_transaction(category)

        response = self.client.delete(f"/api/v1/categories/{category.pk}/")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertTrue(Category.objects.filter(pk=category.pk).exists())

    def test_delete_private_category_without_transactions_succeeds(self):
        """Una categoría privada sin movimientos sí se puede eliminar: 204."""
        category = self.make_private_category()

        response = self.client.delete(f"/api/v1/categories/{category.pk}/")

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Category.objects.filter(pk=category.pk).exists())

    def test_delete_global_category_returns_403(self):
        """Una categoría global es de solo lectura: 403, no 400."""
        category = Category.objects.create(
            name="Alimentación", type=Category.Type.EXPENSE, user=None
        )

        response = self.client.delete(f"/api/v1/categories/{category.pk}/")

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_deleting_transaction_frees_the_category(self):
        """Tras borrar el movimiento, la categoría vuelve a ser eliminable."""
        category = self.make_private_category()
        transaction = self.make_transaction(category)

        blocked = self.client.delete(f"/api/v1/categories/{category.pk}/")
        self.assertEqual(blocked.status_code, status.HTTP_400_BAD_REQUEST)

        self.client.delete(f"/api/v1/transactions/{transaction.pk}/")

        allowed = self.client.delete(f"/api/v1/categories/{category.pk}/")
        self.assertEqual(allowed.status_code, status.HTTP_204_NO_CONTENT)
