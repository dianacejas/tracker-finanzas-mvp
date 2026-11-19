"""Comando idempotente para poblar un entorno demo realista de PESHITO."""

from datetime import date, timedelta
from decimal import Decimal

from django.contrib.auth import get_user_model
from django.core.management import call_command
from django.core.management.base import BaseCommand
from django.db import transaction

from apps.budgets.models import Budget
from apps.categories.models import Category
from apps.transactions.models import Transaction

User = get_user_model()

DEMO_EMAIL = "demo@peshito.app"
DEMO_USERNAME = "demo_peshito"
DEMO_PASSWORD = "PeshitoDemo2026!"


class Command(BaseCommand):
    help = "Genera usuario demo (demo@peshito.app), categorías, movimientos y presupuestos (idempotente)."

    @transaction.atomic
    def handle(self, *args, **options):
        call_command("seed_default_categories", verbosity=0)

        user, user_created = User.objects.get_or_create(
            email=DEMO_EMAIL,
            defaults={
                "username": DEMO_USERNAME,
                "first_name": "Usuario",
                "last_name": "Demo",
                "preferred_currency": "ARS",
            },
        )
        if user_created or not user.check_password(DEMO_PASSWORD):
            user.set_password(DEMO_PASSWORD)
            user.save()

        categories = {
            c.name: c for c in Category.objects.filter(user__isnull=True)
        }

        today = date.today()
        first_of_this_month = today.replace(day=1)
        last_month_end = first_of_this_month - timedelta(days=1)
        first_of_last_month = last_month_end.replace(day=1)

        def clamp_day(base_first, day_num):
            max_day = (
                today.day
                if base_first == first_of_this_month
                else last_month_end.day
            )
            return base_first.replace(day=max(1, min(day_num, max_day)))

        demo_movements = [
            # Mes anterior
            ("Salario", Transaction.Type.INCOME, "850000.00", clamp_day(first_of_last_month, 1), "Sueldo mensual acreditado"),
            ("Freelance", Transaction.Type.INCOME, "140000.00", clamp_day(first_of_last_month, 14), "Consultoría diseño UI"),
            ("Hogar", Transaction.Type.EXPENSE, "260000.00", clamp_day(first_of_last_month, 3), "Alquiler y expensas"),
            ("Alimentación", Transaction.Type.EXPENSE, "68500.00", clamp_day(first_of_last_month, 7), "Compra mayorista supermercado"),
            ("Servicios", Transaction.Type.EXPENSE, "34200.00", clamp_day(first_of_last_month, 10), "Fibra óptica y electricidad"),
            ("Transporte", Transaction.Type.EXPENSE, "22000.00", clamp_day(first_of_last_month, 15), "Carga SUBE y combustible"),
            ("Entretenimiento", Transaction.Type.EXPENSE, "28500.00", clamp_day(first_of_last_month, 21), "Cena con amigos y cine"),
            ("Salud", Transaction.Type.EXPENSE, "19800.00", clamp_day(first_of_last_month, 25), "Farmacia y control médico"),
            # Mes actual
            ("Salario", Transaction.Type.INCOME, "920000.00", clamp_day(first_of_this_month, 1), "Sueldo mensual acreditado"),
            ("Freelance", Transaction.Type.INCOME, "185000.00", clamp_day(first_of_this_month, 11), "Proyecto landing page React"),
            ("Inversiones", Transaction.Type.INCOME, "42500.00", clamp_day(first_of_this_month, 15), "Rendimiento fondo común"),
            ("Hogar", Transaction.Type.EXPENSE, "275000.00", clamp_day(first_of_this_month, 2), "Alquiler mensual departamento"),
            ("Alimentación", Transaction.Type.EXPENSE, "54200.00", clamp_day(first_of_this_month, 4), "Supermercado semanal"),
            ("Alimentación", Transaction.Type.EXPENSE, "31800.00", clamp_day(first_of_this_month, 12), "Verdulería y carnicería"),
            ("Servicios", Transaction.Type.EXPENSE, "38900.00", clamp_day(first_of_this_month, 8), "Internet, luz y streaming"),
            ("Transporte", Transaction.Type.EXPENSE, "26400.00", clamp_day(first_of_this_month, 9), "Combustible y peajes"),
            ("Entretenimiento", Transaction.Type.EXPENSE, "35000.00", clamp_day(first_of_this_month, 14), "Salida fin de semana"),
            ("Educación", Transaction.Type.EXPENSE, "24000.00", clamp_day(first_of_this_month, 16), "Curso arquitectura de software"),
        ]

        tx_created = 0
        for cat_name, tx_type, amount_str, tx_date, desc in demo_movements:
            cat = categories.get(cat_name)
            if not cat:
                continue
            _, created = Transaction.objects.get_or_create(
                user=user,
                category=cat,
                type=tx_type,
                date=tx_date,
                description=desc,
                defaults={"amount": Decimal(amount_str)},
            )
            if created:
                tx_created += 1

        demo_budgets = [
            ("Alimentación", "140000.00"),
            ("Transporte", "45000.00"),
            ("Servicios", "55000.00"),
            ("Entretenimiento", "50000.00"),
        ]

        budgets_synced = 0
        for cat_name, limit_str in demo_budgets:
            cat = categories.get(cat_name)
            if not cat:
                continue
            Budget.objects.update_or_create(
                user=user,
                category=cat,
                month=today.month,
                year=today.year,
                defaults={"amount": Decimal(limit_str)},
            )
            budgets_synced += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"Seed PESHITO completado: usuario={DEMO_EMAIL} | "
                f"nuevos movimientos={tx_created} | presupuestos activos={budgets_synced}"
            )
        )
