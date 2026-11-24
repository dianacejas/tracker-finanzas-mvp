"""Comando de gestión: carga las categorías base del sistema.

Es idempotente: crea solo las categorías ausentes para user=None.
"""

from django.core.management.base import BaseCommand
from django.db import transaction

from apps.categories.models import Category


SYSTEM_CATEGORIES = [
    # Gastos
    ("Alimentación", Category.Type.EXPENSE, "utensils", "#F59E0B"),
    ("Transporte", Category.Type.EXPENSE, "car", "#06B6D4"),
    ("Servicios", Category.Type.EXPENSE, "plug", "#8B5CF6"),
    ("Entretenimiento", Category.Type.EXPENSE, "gamepad-2", "#EC4899"),
    ("Salud", Category.Type.EXPENSE, "heart-pulse", "#10B981"),
    ("Educación", Category.Type.EXPENSE, "graduation-cap", "#3B82F6"),
    ("Hogar", Category.Type.EXPENSE, "home", "#6366F1"),
    # Ingresos
    ("Salario", Category.Type.INCOME, "briefcase", "#10B981"),
    ("Inversiones", Category.Type.INCOME, "trending-up", "#059669"),
    ("Freelance", Category.Type.INCOME, "laptop", "#14B8A6"),
    ("Otros", Category.Type.INCOME, "gift", "#64748B"),
]


class Command(BaseCommand):
    help = "Carga las categorías base del sistema (idempotente)."

    @transaction.atomic
    def handle(self, *args, **options):
        created_count = 0
        for name, category_type, icon, color in SYSTEM_CATEGORIES:
            category, created = Category.objects.get_or_create(
                user=None,
                name=name,
                defaults={"type": category_type, "icon": icon, "color": color},
            )
            if created:
                created_count += 1
                self.stdout.write(self.style.SUCCESS(f"Creada: {name}"))
        total = Category.objects.filter(user__isnull=True).count()
        self.stdout.write(self.style.SUCCESS(f"\nCategorías globales: {total} en total ({created_count} creadas)."))
