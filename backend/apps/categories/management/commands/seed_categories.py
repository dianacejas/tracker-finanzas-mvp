"""Comando de gestión: carga las categorías globales del sistema.

Es idempotente: cada ejecución crea solo las categorías ausentes y actualiza
los atributos de presentación de las existentes, de modo que se puede correr
tras cada despliegue sin duplicar datos ni pisar categorías del usuario.
"""

from django.core.management.base import BaseCommand
from django.db import transaction

from apps.categories.models import Category

# Categorías globales iniciales: (nombre, tipo, ícono de Lucide, color).
SYSTEM_CATEGORIES = [
    # Gastos
    ("Alimentación", Category.Type.EXPENSE, "utensils", "#F97316"),
    ("Transporte", Category.Type.EXPENSE, "car", "#0EA5E9"),
    ("Vivienda", Category.Type.EXPENSE, "home", "#8B5CF6"),
    ("Servicios", Category.Type.EXPENSE, "plug", "#64748B"),
    ("Salud", Category.Type.EXPENSE, "heart-pulse", "#EF4444"),
    ("Entretenimiento", Category.Type.EXPENSE, "gamepad-2", "#EC4899"),
    ("Educación", Category.Type.EXPENSE, "graduation-cap", "#14B8A6"),
    # Ingresos
    ("Sueldo", Category.Type.INCOME, "briefcase", "#22C55E"),
    ("Inversiones", Category.Type.INCOME, "trending-up", "#10B981"),
    ("Freelance", Category.Type.INCOME, "laptop", "#84CC16"),
    ("Regalos", Category.Type.INCOME, "gift", "#F59E0B"),
]


class Command(BaseCommand):
    """Crea o actualiza las categorías globales del sistema."""

    help = "Carga las categorías globales del sistema (idempotente)."

    @transaction.atomic
    def handle(self, *args, **options):
        created_count = 0
        updated_count = 0

        for name, category_type, icon, color in SYSTEM_CATEGORIES:
            category, created = Category.objects.get_or_create(
                user=None,
                name=name,
                defaults={"type": category_type, "icon": icon, "color": color},
            )

            if created:
                created_count += 1
                self.stdout.write(self.style.SUCCESS(f"Creada: {name}"))
                continue

            # Corrige cambios de presentación sin intervención manual.
            changed_fields = []
            if category.type != category_type:
                category.type = category_type
                changed_fields.append("type")
            if category.icon != icon:
                category.icon = icon
                changed_fields.append("icon")
            if category.color != color.upper():
                category.color = color.upper()
                changed_fields.append("color")

            if changed_fields:
                category.save(update_fields=changed_fields + ["name"])
                updated_count += 1
                self.stdout.write(
                    self.style.WARNING(
                        f"Actualizada: {name} ({', '.join(changed_fields)})"
                    )
                )

        total = Category.objects.filter(user__isnull=True).count()
        self.stdout.write(
            self.style.SUCCESS(
                f"\nCategorías globales: {total} en total "
                f"({created_count} creadas, {updated_count} actualizadas)."
            )
        )
