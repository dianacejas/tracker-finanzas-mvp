"""Formularios del panel de administración para el usuario personalizado."""

from django import forms
from django.contrib.auth.forms import (
    AdminUserCreationForm as DjangoAdminUserCreationForm,
)
from django.contrib.auth.forms import UserChangeForm as DjangoUserChangeForm

from .models import User


class UserCreationForm(DjangoAdminUserCreationForm):
    """Formulario de alta de usuarios desde el admin, con email como identificador."""

    class Meta(DjangoAdminUserCreationForm.Meta):
        model = User
        fields = ("email", "username", "preferred_currency")


class UserChangeForm(DjangoUserChangeForm):
    """Formulario de edición de usuarios desde el admin."""

    class Meta(DjangoUserChangeForm.Meta):
        model = User
        fields = "__all__"
