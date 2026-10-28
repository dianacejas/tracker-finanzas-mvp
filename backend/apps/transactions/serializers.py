"""Serializadores del módulo de transacciones."""

from decimal import Decimal

from django.db.models import Q
from rest_framework import serializers

from apps.categories.models import Category

from .models import Transaction


class TransactionCategorySerializer(serializers.ModelSerializer):
    """Representación abreviada de la categoría para el listado del frontend."""

    class Meta:
        model = Category
        fields = ("id", "name", "icon", "color", "type")


class TransactionSerializer(serializers.ModelSerializer):
    """Lectura y escritura de movimientos del usuario autenticado.

    Toda validación de pertenencia se resuelve contra `request.user`: el cliente
    nunca decide a quién pertenece el movimiento.
    """

    category_detail = TransactionCategorySerializer(
        source="category", read_only=True
    )

    class Meta:
        model = Transaction
        fields = (
            "id",
            "category",
            "category_detail",
            "amount",
            "type",
            "date",
            "description",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "category_detail", "created_at", "updated_at")

    def get_fields(self):
        """Limita el campo `category` a las categorías que el usuario puede usar.

        Restringir el queryset hace que una categoría ajena falle como
        "no existe" en la propia validación del campo, en lugar de depender solo
        de la comprobación manual de `validate()`.
        """
        fields = super().get_fields()
        request = self.context.get("request")
        if request is not None and request.user.is_authenticated:
            fields["category"].queryset = Category.objects.filter(
                Q(user__isnull=True) | Q(user=request.user)
            )
        else:
            fields["category"].queryset = Category.objects.none()

        # Mensaje propio para un id que no existe o no es utilizable.
        fields["category"].error_messages["does_not_exist"] = (
            "Categoría no válida o no encontrada."
        )
        return fields

    def validate_amount(self, value):
        """El monto debe ser estrictamente positivo."""
        if value is None or value <= Decimal("0.00"):
            raise serializers.ValidationError("El monto debe ser mayor que cero.")
        return value

    def validate(self, attrs):
        """Comprueba pertenencia de la categoría y coherencia de tipos."""
        # En una edición parcial puede faltar el tipo o la categoría: se toman
        # los valores actuales para validar siempre el estado resultante.
        category = attrs.get("category", getattr(self.instance, "category", None))
        movement_type = attrs.get("type", getattr(self.instance, "type", None))

        if category is None:
            return attrs

        request = self.context.get("request")
        user = getattr(request, "user", None)

        # Pertenencia: global del sistema o privada del propio usuario.
        if category.user_id is not None and category.user_id != getattr(user, "id", None):
            raise serializers.ValidationError(
                {"category": "Categoría no válida o no encontrada."}
            )

        # Coherencia: una categoría de gasto no admite un ingreso, y viceversa.
        if movement_type and category.type != Category.Type.BOTH:
            if category.type != movement_type:
                raise serializers.ValidationError(
                    {
                        "category": (
                            f"No puedes registrar un movimiento de tipo "
                            f"'{movement_type}' con una categoría de tipo "
                            f"'{category.type}'."
                        )
                    }
                )

        return attrs

    def create(self, validated_data):
        """Persiste el movimiento ejecutando las validaciones del modelo."""
        transaction = Transaction(**validated_data)
        transaction.full_clean(exclude=["user"], validate_unique=False)
        transaction.save()
        return transaction

    def update(self, instance, validated_data):
        """Actualiza el movimiento revalidando el estado resultante."""
        for field, value in validated_data.items():
            setattr(instance, field, value)
        instance.full_clean(exclude=["user"], validate_unique=False)
        instance.save()
        return instance
