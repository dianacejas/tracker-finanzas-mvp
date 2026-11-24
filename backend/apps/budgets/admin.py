"""Registro del modelo de presupuestos en el panel de administración de Django."""

from django.contrib import admin

from .models import Budget


@admin.register(Budget)
class BudgetAdmin(admin.ModelAdmin):
    """Administración de presupuestos por usuario y categoría."""

    list_display = ("user", "category", "amount", "month", "year", "created_at")
    list_filter = ("year", "month", "category")
    search_fields = ("user__email", "user__username", "category__name")
    readonly_fields = ("created_at", "updated_at")
    ordering = ("-year", "-month", "category__name")
