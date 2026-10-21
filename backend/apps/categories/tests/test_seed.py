"""Tests del comando seed_categories: contenido, idempotencia y alcance."""

from io import StringIO

from django.contrib.auth import get_user_model
from django.core.management import call_command
from django.test import TestCase

from apps.categories.models import Category
from apps.categories.management.commands.seed_categories import SYSTEM_CATEGORIES

User = get_user_model()
PASSWORD = "ClaveSegura123"


def run_seed():
    """Ejecuta el comando capturando su salida estándar."""
    out = StringIO()
    call_command("seed_categories", stdout=out)
    return out.getvalue()


class SeedCategoriesCommandTests(TestCase):
    """El seed crea las categorías del sistema de forma idempotente."""

    def test_creates_all_system_categories(self):
        """Se cargan todas las categorías declaradas."""
        run_seed()

        self.assertEqual(
            Category.objects.filter(user__isnull=True).count(),
            len(SYSTEM_CATEGORIES),
        )

    def test_every_seeded_category_is_global(self):
        """Ninguna categoría del seed queda asignada a un usuario."""
        run_seed()

        self.assertFalse(Category.objects.filter(user__isnull=False).exists())
        for category in Category.objects.all():
            self.assertTrue(category.is_global)

    def test_seed_is_idempotent(self):
        """Ejecutarlo varias veces no duplica registros."""
        run_seed()
        first_count = Category.objects.count()

        run_seed()
        run_seed()

        self.assertEqual(Category.objects.count(), first_count)

    def test_seed_reports_created_then_updated(self):
        """La primera corrida crea; las siguientes no reportan creación."""
        first_output = run_seed()
        second_output = run_seed()

        self.assertIn("creadas", first_output)
        self.assertIn("0 creadas", second_output)

    def test_seed_repairs_presentation_changes(self):
        """Si cambia el ícono o el color definidos, el seed los corrige."""
        run_seed()
        category = Category.objects.get(name="Transporte", user=None)
        category.icon = "icono-viejo"
        category.color = "#000000"
        category.save(update_fields=["icon", "color"])

        run_seed()

        category.refresh_from_db()
        self.assertNotEqual(category.icon, "icono-viejo")
        self.assertNotEqual(category.color, "#000000")

    def test_seed_does_not_touch_user_categories(self):
        """Una categoría privada con el mismo nombre que una global sobrevive."""
        user = User.objects.create_user(
            email="ana@example.com", username="ana", password=PASSWORD
        )
        own = Category.objects.create(name="Transporte", user=user)

        run_seed()

        own.refresh_from_db()
        self.assertEqual(own.user, user)
        self.assertEqual(Category.objects.filter(name="Transporte").count(), 2)

    def test_seed_includes_income_and_expense(self):
        """El conjunto inicial cubre ingresos y gastos."""
        run_seed()

        types = set(
            Category.objects.filter(user__isnull=True).values_list("type", flat=True)
        )
        self.assertIn(Category.Type.INCOME, types)
        self.assertIn(Category.Type.EXPENSE, types)

    def test_seeded_categories_have_lucide_icons_and_colors(self):
        """Cada categoría del sistema trae ícono y color válidos."""
        run_seed()

        for category in Category.objects.filter(user__isnull=True):
            with self.subTest(category=category.name):
                self.assertTrue(category.icon)
                self.assertTrue(category.color.startswith("#"))
                self.assertEqual(len(category.color), 7)
