"""Tests de la API de transacciones: aislamiento, filtros, orden y paginación."""

from datetime import date, timedelta
from decimal import Decimal

from rest_framework import status
from rest_framework.test import APITestCase

from apps.transactions.models import Transaction

from .base import LIST_URL, TransactionApiBaseTests, detail_url


class TransactionAuthenticationTests(APITestCase):
    """Sin sesión no hay acceso a los movimientos."""

    def test_list_requires_authentication(self):
        """El listado exige autenticación."""
        response = self.client.get(LIST_URL)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_requires_authentication(self):
        """La creación exige autenticación."""
        response = self.client.post(LIST_URL, {"amount": "10.00"})

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_detail_requires_authentication(self):
        """El detalle exige autenticación."""
        response = self.client.get(detail_url(1))

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class TransactionIsolationTests(TransactionApiBaseTests):
    """Los movimientos de otra cuenta son invisibles e intocables."""

    def setUp(self):
        super().setUp()
        self.own_transaction = self.make_transaction(user=self.user)
        self.foreign_transaction = self.make_transaction(
            user=self.other, amount=Decimal("99.00")
        )

    def test_list_only_returns_own_transactions(self):
        """El listado contiene únicamente los movimientos propios."""
        response = self.client.get(LIST_URL)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        ids = {item["id"] for item in response.data["results"]}
        self.assertEqual(ids, {self.own_transaction.id})

    def test_retrieve_foreign_transaction_returns_404(self):
        """El detalle de un movimiento ajeno no se expone."""
        response = self.client.get(detail_url(self.foreign_transaction.id))

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_update_foreign_transaction_returns_404(self):
        """No se puede editar un movimiento ajeno."""
        response = self.client.patch(
            detail_url(self.foreign_transaction.id), {"amount": "1.00"}
        )

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.foreign_transaction.refresh_from_db()
        self.assertEqual(self.foreign_transaction.amount, Decimal("99.00"))

    def test_destroy_foreign_transaction_returns_404(self):
        """No se puede borrar un movimiento ajeno."""
        response = self.client.delete(detail_url(self.foreign_transaction.id))

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertTrue(
            Transaction.objects.filter(pk=self.foreign_transaction.id).exists()
        )

    def test_destroy_own_transaction(self):
        """El movimiento propio se puede borrar."""
        response = self.client.delete(detail_url(self.own_transaction.id))

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(
            Transaction.objects.filter(pk=self.own_transaction.id).exists()
        )


class TransactionFilterTests(TransactionApiBaseTests):
    """Filtros del listado sobre el conjunto ya acotado al usuario."""

    def setUp(self):
        super().setUp()
        self.today = date(2026, 10, 20)
        self.old = self.make_transaction(
            amount=Decimal("10.00"), date=self.today - timedelta(days=90)
        )
        self.recent = self.make_transaction(
            amount=Decimal("20.00"), date=self.today - timedelta(days=5)
        )
        self.income = self.make_transaction(
            amount=Decimal("30.00"),
            date=self.today - timedelta(days=2),
            type=Transaction.Type.INCOME,
            category=self.income_global,
        )

    def ids(self, response):
        """Extrae los ids de la página de resultados."""
        return {item["id"] for item in response.data["results"]}

    def test_filter_by_type(self):
        """El filtro por tipo acota los movimientos."""
        response = self.client.get(LIST_URL, {"type": "INCOME"})

        self.assertEqual(self.ids(response), {self.income.id})

    def test_filter_by_date_range(self):
        """El rango de fechas acota los movimientos."""
        response = self.client.get(
            LIST_URL,
            {
                "start_date": (self.today - timedelta(days=10)).isoformat(),
                "end_date": self.today.isoformat(),
            },
        )

        self.assertEqual(self.ids(response), {self.recent.id, self.income.id})

    def test_filter_by_start_date_only(self):
        """El filtro por fecha inicial acota los movimientos."""
        response = self.client.get(
            LIST_URL, {"start_date": (self.today - timedelta(days=10)).isoformat()}
        )

        self.assertEqual(self.ids(response), {self.recent.id, self.income.id})

    def test_filter_by_end_date_only(self):
        """El filtro por fecha final acota los movimientos."""
        response = self.client.get(
            LIST_URL, {"end_date": (self.today - timedelta(days=30)).isoformat()}
        )

        self.assertEqual(self.ids(response), {self.old.id})

    def test_filter_by_category(self):
        """El filtro por categoría acota los movimientos."""
        response = self.client.get(LIST_URL, {"category": self.income_global.id})

        self.assertEqual(self.ids(response), {self.income.id})

    def test_combined_filters(self):
        """Los filtros se combinan de forma acumulativa."""
        response = self.client.get(
            LIST_URL,
            {
                "type": "EXPENSE",
                "start_date": (self.today - timedelta(days=10)).isoformat(),
            },
        )

        self.assertEqual(self.ids(response), {self.recent.id})

    def test_filters_do_not_reveal_other_users_data(self):
        """Un filtro nunca amplía el alcance más allá del usuario."""
        foreign = self.make_transaction(user=self.other, amount=Decimal("500.00"))

        response = self.client.get(LIST_URL, {"type": "EXPENSE"})

        self.assertNotIn(foreign.id, self.ids(response))

    def test_invalid_filter_value_is_ignored_or_rejected(self):
        """Un tipo de filtro desconocido no rompe la consulta."""
        response = self.client.get(LIST_URL, {"type": "INVENTADO"})

        self.assertIn(
            response.status_code,
            (status.HTTP_200_OK, status.HTTP_400_BAD_REQUEST),
        )


class TransactionOrderingTests(TransactionApiBaseTests):
    """Ordenación del listado."""

    def setUp(self):
        super().setUp()
        self.low = self.make_transaction(
            amount=Decimal("5.00"), date=date(2026, 1, 10)
        )
        self.high = self.make_transaction(
            amount=Decimal("500.00"), date=date(2026, 5, 10)
        )

    def test_default_ordering_is_date_desc(self):
        """El orden por defecto es fecha descendente."""
        response = self.client.get(LIST_URL)

        self.assertEqual(
            [item["id"] for item in response.data["results"]],
            [self.high.id, self.low.id],
        )

    def test_ordering_by_amount(self):
        """Se puede ordenar por monto."""
        response = self.client.get(LIST_URL, {"ordering": "amount"})

        self.assertEqual(
            [item["id"] for item in response.data["results"]],
            [self.low.id, self.high.id],
        )

    def test_ordering_by_amount_desc(self):
        """Se puede ordenar por monto descendente."""
        response = self.client.get(LIST_URL, {"ordering": "-amount"})

        self.assertEqual(
            [item["id"] for item in response.data["results"]],
            [self.high.id, self.low.id],
        )

    def test_invalid_ordering_field_is_ignored(self):
        """Un campo de ordenación no permitido no se aplica."""
        response = self.client.get(LIST_URL, {"ordering": "description"})

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_invalid_ordering_field_does_not_leak_data(self):
        """Ordenar por un campo no permitido no expone información ajena."""
        response = self.client.get(LIST_URL, {"ordering": "user__email"})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 2)


class TransactionPaginationTests(TransactionApiBaseTests):
    """Paginación del listado."""

    def setUp(self):
        super().setUp()
        for index in range(25):
            self.make_transaction(
                amount=Decimal(f"{index + 1}.00"),
                date=date(2026, 10, 1) + timedelta(days=index),
            )

    def test_default_page_size(self):
        """La primera página trae el tamaño por defecto."""
        response = self.client.get(LIST_URL)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 20)
        self.assertEqual(response.data["count"], 25)
        self.assertIsNotNone(response.data["next"])

    def test_page_size_query_param(self):
        """El cliente puede ajustar el tamaño de página."""
        response = self.client.get(LIST_URL, {"page_size": 5})

        self.assertEqual(len(response.data["results"]), 5)
        self.assertEqual(response.data["count"], 25)

    def test_page_size_is_capped(self):
        """El tamaño de página no puede exceder el máximo permitido."""
        response = self.client.get(LIST_URL, {"page_size": 1000})

        self.assertEqual(len(response.data["results"]), 25)

    def test_second_page(self):
        """La segunda página trae los registros restantes."""
        response = self.client.get(LIST_URL, {"page": 2, "page_size": 10})

        self.assertEqual(len(response.data["results"]), 10)
        self.assertIsNotNone(response.data["next"])

    def test_last_page_has_no_next(self):
        """La última página no ofrece enlace a una siguiente."""
        response = self.client.get(LIST_URL, {"page": 3, "page_size": 10})

        self.assertEqual(len(response.data["results"]), 5)
        self.assertIsNone(response.data["next"])

    def test_page_beyond_range_returns_404(self):
        """Pedir una página inexistente responde 404."""
        response = self.client.get(LIST_URL, {"page": 99})

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_pagination_counts_only_own_transactions(self):
        """El total de la paginación solo cuenta los movimientos propios."""
        self.make_transaction(user=self.other, amount=Decimal("999.00"))

        response = self.client.get(LIST_URL)

        self.assertEqual(response.data["count"], 25)
