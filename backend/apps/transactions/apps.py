"""Configuración de la aplicación de transacciones."""

from django.apps import AppConfig


class TransactionsConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.transactions"
    verbose_name = "Transacciones"
