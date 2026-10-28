"""Modelo de categorías: globales del sistema y privadas de cada usuario."""

from django.conf import settings
from django.db import models


class Category(models.Model):
    """Categoría de ingresos o gastos.

    Una categoría global (`user is None`) la define el sistema y es compartida
    por todos los usuarios: nadie puede editarla ni eliminarla desde la API.
    Una categoría privada (`user` definido) pertenece a una única cuenta.
    """

    class Type(models.TextChoices):
        INCOME = "INCOME", "Ingreso"
        EXPENSE = "EXPENSE", "Gasto"
        BOTH = "BOTH", "Ambos"

    name = models.CharField(
        "nombre",
        max_length=100,
        help_text="Nombre visible de la categoría.",
    )
    type = models.CharField(
        "tipo",
        max_length=10,
        choices=Type.choices,
        default=Type.EXPENSE,
        help_text="Naturaleza de los movimientos que admite.",
    )
    icon = models.CharField(
        "ícono",
        max_length=50,
        default="tag",
        help_text="Identificador del ícono de Lucide React (por ejemplo 'utensils').",
    )
    color = models.CharField(
        "color",
        max_length=7,
        default="#64748B",
        help_text="Código hexadecimal en formato #RRGGBB.",
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="categories",
        verbose_name="usuario",
        help_text="Vacío en las categorías globales del sistema.",
    )
    created_at = models.DateTimeField("creada el", auto_now_add=True)

    class Meta:
        verbose_name = "categoría"
        verbose_name_plural = "categorías"
        ordering = ("name",)
        constraints = [
            # Un usuario no puede repetir el nombre de una categoría privada.
            models.UniqueConstraint(
                fields=["user", "name"],
                name="unique_user_category_name",
            ),
            # Las globales no entran en la restricción anterior porque en SQL
            # los NULL no colisionan entre sí: sin esta, el seed podría crear
            # duplicados del sistema. El centinela 0 sustituye al user nulo.
            models.UniqueConstraint(
                fields=["name"],
                condition=models.Q(user__isnull=True),
                name="unique_global_category_name",
            ),
        ]

    def __str__(self):
        scope = "global" if self.is_global else self.user_id
        return f"{self.name} ({scope})"

    @property
    def is_global(self):
        """Indica si la categoría pertenece al sistema y no a un usuario."""
        return self.user_id is None

    def save(self, *args, **kwargs):
        """Normaliza los campos de presentación para evitar valores sucios."""
        self.name = self.name.strip()
        self.color = self.color.upper()
        super().save(*args, **kwargs)
