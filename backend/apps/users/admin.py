"""Registro del modelo de usuario en el panel de administración de Django."""

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as DjangoUserAdmin
from django.utils.translation import gettext_lazy as _

from .forms import UserChangeForm, UserCreationForm
from .models import User


@admin.register(User)
class UserAdmin(DjangoUserAdmin):
    """Administración del usuario personalizado (email como identificador)."""

    form = UserChangeForm
    add_form = UserCreationForm

    list_display = (
        "email",
        "username",
        "preferred_currency",
        "is_staff",
        "is_active",
    )
    list_filter = ("is_staff", "is_superuser", "is_active", "groups")
    search_fields = ("email", "username", "first_name", "last_name")
    ordering = ("email",)

    fieldsets = (
        (None, {"fields": ("email", "username", "password")}),
        (
            _("Información personal"),
            {"fields": ("first_name", "last_name", "preferred_currency")},
        ),
        (
            _("Permisos"),
            {
                "fields": (
                    "is_active",
                    "is_staff",
                    "is_superuser",
                    "groups",
                    "user_permissions",
                ),
            },
        ),
        (_("Fechas importantes"), {"fields": ("last_login", "date_joined")}),
    )

    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": (
                    "email",
                    "username",
                    "preferred_currency",
                    "usable_password",
                    "password1",
                    "password2",
                ),
            },
        ),
    )
