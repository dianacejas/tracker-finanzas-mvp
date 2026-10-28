"""Modelo de transacciones: ingresos y gastos con precisión decimal."""

from decimal import Decimal

from django.conf import settings
from django.core.exceptions import ValidationError
from django.core.validators import MinValueValidator
from django.db import models


class Transaction(models.Model):
    """Movimiento financiero de un usuario sobre una de sus categorías.

    El monto se almacena en `DecimalField` para evitar el error de redondeo del
    punto flotante: `0.1 + 0.2` en binario no es exactamente `0.3`, y un
    tracker de finanzas no puede arrastrar esa imprecisión.
    """

    class Type(models.TextChoices):
        INCOME = "INCOME", "Ingreso"
        EXPENSE = "EXPENSE", "Gasto"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="transactions",
        verbose_name="usuario",
    )
    category = models.ForeignKey(
        "categories.Category",
        on_delete=models.PROTECT,
        related_name="transactions",
        verbose_name="categoría",
        help_text="Se protege el borrado: una categoría con movimientos no se elimina.",
    )
    amount = models.DecimalField(
        "monto",
        max_digits=12,
        decimal_places=2,
        validators=[MinValueValidator(Decimal("0.01"))],
        help_text="Importe positivo con dos decimales.",
    )
    type = models.CharField(
        "tipo",
        max_length=10,
        choices=Type.choices,
        help_text="Naturaleza del movimiento.",
    )
    date = models.DateField("fecha", help_text="Fecha en que ocurrió el movimiento.")
    description = models.TextField(
        "descripción",
        blank=True,
        default="",
        help_text="Detalle opcional del movimiento.",
    )
    created_at = models.DateTimeField("creada el", auto_now_add=True)
    updated_at = models.DateTimeField("actualizada el", auto_now=True)

    class Meta:
        verbose_name = "transacción"
        verbose_name_plural = "transacciones"
        ordering = ("-date", "-created_at")
        indexes = [
            # El listado siempre filtra por usuario y ordena por fecha.
            models.Index(fields=["user", "-date"], name="tx_user_date_idx"),
            models.Index(fields=["user", "type"], name="tx_user_type_idx"),
        ]
        constraints = [
            # Garantía a nivel de base de datos: ni un acceso directo puede
            # guardar un monto nulo o negativo. `clean()` no protege aquí.
            models.CheckConstraint(
                condition=models.Q(amount__gt=0),
                name="transaction_amount_positive",
            ),
        ]

    def __str__(self):
        return f"{self.get_type_display()} {self.amount} ({self.date})"

    def clean(self):
        """Valida el monto y la coherencia entre el tipo y la categoría.

        Solo el monto puede reforzarse con un `CheckConstraint`, porque la
        coherencia de tipos consulta otra tabla y SQL no admite esa condición en
        un CHECK. Esta validación se ejecuta desde el serializador, que es el
        único camino de escritura de la API.
        """
        super().clean()

        if self.amount is not None and self.amount <= 0:
            raise ValidationError(
                {"amount": "El monto debe ser mayor que cero."}
            )

        if self.category_id is not None and self.type:
            category_type = self.category.type
            if category_type != "BOTH" and category_type != self.type:
                raise ValidationError(
                    {
                        "category": (
                            f"No puedes registrar un movimiento de tipo "
                            f"'{self.type}' con una categoría de tipo "
                            f"'{category_type}'."
                        )
                    }
                )
