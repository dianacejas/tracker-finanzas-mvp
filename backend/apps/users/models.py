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

    def delete(self, *args, **kwargs):
        """Elimina la cuenta junto con sus movimientos y categorías privadas.

        Las transacciones protegen a su categoría con `on_delete=PROTECT`, para
        que nadie borre por accidente una categoría que tiene movimientos
        asociados. Ese mismo mecanismo impediría borrar la cuenta: Django
        aborta la operación al encontrar la categoría privada protegida.

        Por eso los movimientos del usuario se retiran antes de delegar en
        Django. Así al eliminar la cuenta desaparecen sus transacciones y sus
        categorías privadas, y las categorías globales del sistema quedan
        intactas.
        """
        from apps.transactions.models import Transaction

        Transaction.objects.filter(user=self).delete()
        return super().delete(*args, **kwargs)
