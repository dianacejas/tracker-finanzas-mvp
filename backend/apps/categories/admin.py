"""Registro del modelo de categorías en el panel de administración."""

from django.contrib import admin

from .models import Category


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    """Administración de categorías globales y privadas."""

    list_display = ("name", "type", "user", "icon", "color", "created_at")
    list_filter = ("type", "user")
    search_fields = ("name",)
    readonly_fields = ("created_at",)
    ordering = ("name",)
