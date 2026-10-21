"""Tests de la API de categorías: aislamiento, permisos y reglas de borrado."""

from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from apps.categories.models import Category

User = get_user_model()
PASSWORD = "ClaveSegura123"

LIST_URL = "/api/v1/categories/"


def detail_url(pk):
    """URL del detalle de una categoría."""
    return f"/api/v1/categories/{pk}/"


class CategoryApiBaseTests(APITestCase):
    """Base compartida: crea dos usuarios y autentica al primero."""

    def setUp(self):
        self.user = User.objects.create_user(
            email="ana@example.com", username="ana", password=PASSWORD
        )
        self.other = User.objects.create_user(
            email="luis@example.com", username="luis", password=PASSWORD
        )
        self.client.force_authenticate(self.user)


class CategoryAuthenticationTests(APITestCase):
    """Sin sesión, la API no debe filtrar ninguna categoría."""

    def test_list_requires_authentication(self):
        """El listado exige autenticación."""
        response = self.client.get(LIST_URL)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_requires_authentication(self):
        """La creación exige autenticación."""
        response = self.client.post(LIST_URL, {"name": "Comida"})

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_global_categories_are_not_exposed_without_session(self):
        """Ni siquiera las globales se listan sin sesión."""
        Category.objects.create(name="Transporte", user=None)

        response = self.client.get(LIST_URL)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class CategoryIsolationTests(CategoryApiBaseTests):
    """Las categorías privadas de terceros nunca son visibles ni editables."""

    def setUp(self):
        super().setUp()
        self.global_category = Category.objects.create(
            name="Transporte", type=Category.Type.EXPENSE, user=None
        )
        self.own_category = Category.objects.create(name="Gimnasio", user=self.user)
        self.other_category = Category.objects.create(name="Mascotas", user=self.other)

    def test_list_returns_globals_and_own_only(self):
        """El listado es la unión de globales más las propias."""
        response = self.client.get(LIST_URL)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        names = {item["name"] for item in response.data["results"]}
        self.assertEqual(names, {"Transporte", "Gimnasio"})
        self.assertNotIn("Mascotas", names)

    def test_retrieve_foreign_category_returns_404(self):
        """Pedir el detalle de una categoría ajena devuelve 404, no 403."""
        response = self.client.get(detail_url(self.other_category.pk))

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_update_foreign_category_returns_404(self):
        """No se puede editar una categoría de otra cuenta."""
        response = self.client.patch(
            detail_url(self.other_category.pk), {"name": "Hackeada"}
        )

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.other_category.refresh_from_db()
        self.assertEqual(self.other_category.name, "Mascotas")

    def test_destroy_foreign_category_returns_404(self):
        """No se puede borrar una categoría de otra cuenta."""
        response = self.client.delete(detail_url(self.other_category.pk))

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertTrue(Category.objects.filter(pk=self.other_category.pk).exists())

    def test_is_global_is_reported_per_item(self):
        """Cada elemento informa si pertenece al sistema."""
        response = self.client.get(LIST_URL)
        by_name = {item["name"]: item for item in response.data["results"]}

        self.assertTrue(by_name["Transporte"]["is_global"])
        self.assertFalse(by_name["Gimnasio"]["is_global"])


class CategoryCreationTests(CategoryApiBaseTests):
    """Creación de categorías privadas y protección del alcance global."""

    def test_create_private_category(self):
        """El usuario autenticado crea una categoría propia."""
        response = self.client.post(
            LIST_URL,
            {
                "name": "Gimnasio",
                "type": "EXPENSE",
                "icon": "dumbbell",
                "color": "#22C55E",
            },
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertFalse(response.data["is_global"])
        category = Category.objects.get(pk=response.data["id"])
        self.assertEqual(category.user, self.user)

    def test_user_cannot_create_global_category(self):
        """`user` enviado por el cliente se ignora: nunca crea una global."""
        response = self.client.post(
            LIST_URL, {"name": "Trampa", "user": None}, format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        category = Category.objects.get(pk=response.data["id"])
        self.assertEqual(category.user, self.user)
        self.assertFalse(category.is_global)

    def test_user_field_cannot_be_hijacked(self):
        """Aunque se envíe el id de otra cuenta, la pertenencia es la propia."""
        response = self.client.post(
            LIST_URL, {"name": "Suplantada", "user": self.other.pk}
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        category = Category.objects.get(pk=response.data["id"])
        self.assertEqual(category.user, self.user)

    def test_duplicate_name_is_rejected_case_insensitively(self):
        """El nombre repetido en la cuenta se rechaza sin distinguir mayúsculas."""
        Category.objects.create(name="Comida", user=self.user)

        response = self.client.post(LIST_URL, {"name": "comida"})

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("name", response.data)

    def test_same_name_allowed_for_another_user(self):
        """Otro usuario sí puede usar un nombre ya tomado por una cuenta ajena."""
        Category.objects.create(name="Comida", user=self.other)

        response = self.client.post(LIST_URL, {"name": "Comida"})

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_private_category_may_repeat_a_global_name(self):
        """Una categoría propia puede llamarse igual que una global."""
        Category.objects.create(name="Transporte", user=None)

        response = self.client.post(LIST_URL, {"name": "Transporte"})

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertFalse(response.data["is_global"])

    def test_blank_name_is_rejected(self):
        """Un nombre vacío o de solo espacios se rechaza."""
        response = self.client.post(LIST_URL, {"name": "   "})

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_invalid_color_format_is_rejected(self):
        """El color debe ser hexadecimal #RRGGBB."""
        for invalid in ("rojo", "#12345", "64748B", "#GGGGGG"):
            with self.subTest(color=invalid):
                response = self.client.post(
                    LIST_URL, {"name": f"Color {invalid}", "color": invalid}
                )
                self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_valid_color_is_normalized_to_uppercase(self):
        """Un color válido en minúsculas se guarda en mayúsculas."""
        response = self.client.post(
            LIST_URL, {"name": "Mascotas", "color": "#abcdef"}
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["color"], "#ABCDEF")

    def test_invalid_type_is_rejected(self):
        """Solo se admiten los tipos declarados."""
        response = self.client.post(LIST_URL, {"name": "Rara", "type": "OTRO"})

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("type", response.data)

    def test_create_accepts_type_choices(self):
        """Los tres tipos declarados son aceptados."""
        for index, choice in enumerate(("INCOME", "EXPENSE", "BOTH")):
            with self.subTest(type=choice):
                response = self.client.post(
                    LIST_URL, {"name": f"Categoria {index}", "type": choice}
                )
                self.assertEqual(response.status_code, status.HTTP_201_CREATED)
                self.assertEqual(response.data["type"], choice)


class CategoryUpdateTests(CategoryApiBaseTests):
    """Edición de categorías propias y bloqueo de las globales."""

    def setUp(self):
        super().setUp()
        self.global_category = Category.objects.create(name="Transporte", user=None)
        self.own_category = Category.objects.create(name="Gimnasio", user=self.user)

    def test_update_own_category(self):
        """El usuario edita su propia categoría."""
        response = self.client.patch(
            detail_url(self.own_category.pk), {"name": "Pesas"}
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.own_category.refresh_from_db()
        self.assertEqual(self.own_category.name, "Pesas")

    def test_update_global_category_is_forbidden(self):
        """Las categorías del sistema no se editan: 403."""
        response = self.client.patch(
            detail_url(self.global_category.pk), {"name": "Modificada"}
        )

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.global_category.refresh_from_db()
        self.assertEqual(self.global_category.name, "Transporte")

    def test_update_keeps_own_name(self):
        """Renombrar con el mismo nombre no choca contra la propia categoría."""
        response = self.client.patch(
            detail_url(self.own_category.pk), {"name": "Gimnasio"}
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_rejects_another_of_own_names(self):
        """Renombrar hacia un nombre ya usado por la propia cuenta falla."""
        Category.objects.create(name="Comida", user=self.user)

        response = self.client.patch(detail_url(self.own_category.pk), {"name": "Comida"})

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class CategoryDeleteTests(CategoryApiBaseTests):
    """Reglas de borrado: globales protegidas y privadas eliminables."""

    def setUp(self):
        super().setUp()
        self.global_category = Category.objects.create(name="Transporte", user=None)
        self.own_category = Category.objects.create(name="Gimnasio", user=self.user)

    def test_delete_own_category(self):
        """Una categoría propia sin movimientos se elimina."""
        response = self.client.delete(detail_url(self.own_category.pk))

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Category.objects.filter(pk=self.own_category.pk).exists())

    def test_delete_global_category_is_forbidden(self):
        """Las categorías del sistema no se eliminan: 403."""
        response = self.client.delete(detail_url(self.global_category.pk))

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertTrue(Category.objects.filter(pk=self.global_category.pk).exists())

    def test_delete_category_with_transactions_returns_400(self):
        """Con movimientos asociados el borrado devuelve 400 y explica por qué.

        La relación protegida la introduce FIN-9. Hasta entonces se simula el
        ProtectedError sobre la instancia para verificar que la vista lo traduce
        a un 400 con mensaje, sin depender del modelo de transacciones.
        """
        from unittest.mock import patch

        from django.db.models import ProtectedError

        with patch.object(
            Category,
            "delete",
            side_effect=ProtectedError("movimientos asociados", [self.own_category]),
        ):
            response = self.client.delete(detail_url(self.own_category.pk))

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertTrue(Category.objects.filter(pk=self.own_category.pk).exists())

    def test_delete_blocked_by_protected_relation_keeps_the_category(self):
        """La categoría con movimientos sobrevive al intento de borrado."""
        from unittest.mock import patch

        from django.db.models import ProtectedError

        with patch.object(
            Category,
            "delete",
            side_effect=ProtectedError("movimientos asociados", [self.own_category]),
        ):
            self.client.delete(detail_url(self.own_category.pk))

        self.assertTrue(Category.objects.filter(pk=self.own_category.pk).exists())
