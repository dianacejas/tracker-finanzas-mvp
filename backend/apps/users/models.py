"""Modelo de usuario personalizado: el email es el identificador principal."""

from django.contrib.auth.models import AbstractUser
from django.db import models

from .managers import UserManager


class User(AbstractUser):
    """Usuario de la aplicación autenticado por email."""

    email = models.EmailField(
        "correo electrónico",
        unique=True,
        help_text="Identificador principal de la cuenta.",
    )
    preferred_currency = models.CharField(
        "moneda preferida",
        max_length=3,
        default="USD",
        help_text="Código ISO 4217 de tres letras (USD, EUR, ARS, ...).",
    )

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    objects = UserManager()

    class Meta:
        verbose_name = "usuario"
        verbose_name_plural = "usuarios"
        ordering = ("email",)

    def __str__(self):
        return self.email
