"""Tests unitarios del modelo de categorías y sus restricciones de integridad."""

from django.contrib.auth import get_user_model
from django.db import IntegrityError, transaction
from django.test import TestCase

from apps.categories.models import Category

User = get_user_model()
PASSWORD = "ClaveSegura123"


def make_user(email="ana@example.com", username="ana"):
    """Crea un usuario de prueba reutilizable."""
    return User.objects.create_user(email=email, username=username, password=PASSWORD)


class CategoryModelTests(TestCase):
    """Comportamiento del modelo y de las restricciones de unicidad."""

    def setUp(self):
        self.user = make_user()

    def test_create_private_category(self):
        """Una categoría con usuario asignado es privada."""
        category = Category.objects.create(
            name="Gimnasio", type=Category.Type.EXPENSE, user=self.user
        )

        self.assertFalse(category.is_global)
        self.assertEqual(category.user, self.user)
        self.assertEqual(str(category), f"Gimnasio ({self.user.pk})")

    def test_create_global_category(self):
        """Una categoría sin usuario es global del sistema."""
        category = Category.objects.create(name="Alimentación", user=None)

        self.assertTrue(category.is_global)
        self.assertIn("global", str(category))

    def test_is_global_is_read_only_property(self):
        """`is_global` es una propiedad derivada, no una columna de la tabla."""
        self.assertIsInstance(Category.is_global, property)
        self.assertNotIn("is_global", [f.name for f in Category._meta.get_fields()])

    def test_defaults_for_icon_and_color(self):
        """Los valores por defecto de presentación se aplican solos."""
        category = Category.objects.create(name="Otros", user=self.user)

        self.assertEqual(category.icon, "tag")
        self.assertEqual(category.color, "#64748B")
        self.assertEqual(category.type, Category.Type.EXPENSE)

    def test_color_is_normalized_to_uppercase(self):
        """El color se guarda siempre en mayúsculas."""
        category = Category.objects.create(
            name="Mascotas", user=self.user, color="#abcdef"
        )

        self.assertEqual(category.color, "#ABCDEF")

    def test_name_is_trimmed_on_save(self):
        """Los espacios sobrantes se eliminan al guardar."""
        category = Category.objects.create(name="  Viajes  ", user=self.user)

        self.assertEqual(category.name, "Viajes")

    def test_unique_private_name_per_user(self):
        """Un usuario no puede repetir el nombre de una categoría privada."""
        Category.objects.create(name="Comida", user=self.user)

        with self.assertRaises(IntegrityError):
            with transaction.atomic():
                Category.objects.create(name="Comida", user=self.user)

    def test_two_users_may_share_private_name(self):
        """Dos cuentas distintas pueden tener una categoría con igual nombre."""
        other = make_user(email="luis@example.com", username="luis")
        Category.objects.create(name="Comida", user=self.user)

        category = Category.objects.create(name="Comida", user=other)

        self.assertEqual(category.user, other)

    def test_unique_global_name(self):
        """El sistema no puede registrar dos categorías globales homónimas.

        Sin la restricción condicional, los NULL de SQL no colisionarían y el
        seed podría duplicar categorías del sistema.
        """
        Category.objects.create(name="Transporte", user=None)

        with self.assertRaises(IntegrityError):
            with transaction.atomic():
                Category.objects.create(name="Transporte", user=None)

    def test_global_and_private_may_share_name(self):
        """Una categoría privada puede llamarse igual que una global.

        Es intencional: la categoría del sistema sigue visible y el usuario
        puede crear su propia versión sin que la restricción la bloquee.
        """
        Category.objects.create(name="Transporte", user=None)

        category = Category.objects.create(name="Transporte", user=self.user)

        self.assertFalse(category.is_global)

    def test_deleting_user_cascades_categories(self):
        """Al eliminar la cuenta desaparecen sus categorías privadas."""
        Category.objects.create(name="Comida", user=self.user)
        Category.objects.create(name="Transporte", user=None)

        self.user.delete()

        self.assertEqual(Category.objects.filter(user__isnull=True).count(), 1)
        self.assertEqual(Category.objects.count(), 1)

    def test_categories_are_ordered_by_name(self):
        """El orden por defecto es alfabético por nombre."""
        Category.objects.create(name="Zapatos", user=self.user)
        Category.objects.create(name="Alimentos", user=self.user)
        Category.objects.create(name="Mascotas", user=self.user)

        names = list(Category.objects.values_list("name", flat=True))

        self.assertEqual(names, ["Alimentos", "Mascotas", "Zapatos"])
