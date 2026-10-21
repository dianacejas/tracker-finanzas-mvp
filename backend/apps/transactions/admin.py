"""Registro del modelo de transacciones en el panel de administración."""

from django.contrib import admin

from .models import Transaction


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    """Administración de movimientos financieros."""

    list_display = ("date", "type", "amount", "category", "user", "created_at")
    list_filter = ("type", "date", "category")
    search_fields = ("description", "user__email", "category__name")
    readonly_fields = ("created_at", "updated_at")
    ordering = ("-date", "-created_at")
    date_hierarchy = "date"
