"""Serializadores del módulo de categorías."""

from rest_framework import serializers

from .models import Category


class CategorySerializer(serializers.ModelSerializer):
    """Lectura y escritura de categorías del usuario autenticado.

    `is_global` se expone como campo derivado de solo lectura: el cliente nunca
    decide el alcance de una categoría, lo determina la pertenencia.
    """

    is_global = serializers.BooleanField(read_only=True)

    class Meta:
        model = Category
        fields = ("id", "name", "type", "icon", "color", "is_global", "created_at")
        read_only_fields = ("id", "is_global", "created_at")

    def validate_name(self, value):
        """Rechaza nombres repetidos en las categorías privadas del usuario.

        La comparación ignora mayúsculas y minúsculas para que "Comida" y
        "comida" no coexistan como dos categorías distintas.
        """
        name = value.strip()
        if not name:
            raise serializers.ValidationError("El nombre no puede estar vacío.")

        user = self.context["request"].user
        queryset = Category.objects.filter(user=user, name__iexact=name)
        if self.instance is not None:
            queryset = queryset.exclude(pk=self.instance.pk)

        if queryset.exists():
            raise serializers.ValidationError(
                "Ya tenés una categoría con este nombre."
            )
        return name

    def validate_color(self, value):
        """Exige el formato hexadecimal #RRGGBB."""
        color = value.strip()
        if not (len(color) == 7 and color.startswith("#")):
            raise serializers.ValidationError(
                "El color debe tener el formato hexadecimal #RRGGBB."
            )
        try:
            int(color[1:], 16)
        except ValueError:
            raise serializers.ValidationError(
                "El color debe tener el formato hexadecimal #RRGGBB."
            )
        return color.upper()
