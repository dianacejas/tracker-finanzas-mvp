"""Serializadores del módulo de usuarios: registro y perfil."""

from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()


class UserRegistrationSerializer(serializers.ModelSerializer):
    """Alta de nuevos usuarios con validación de contraseña de Django."""

    password = serializers.CharField(
        write_only=True,
        required=True,
        style={"input_type": "password"},
        validators=[validate_password],
    )

    class Meta:
        model = User
        fields = ("id", "email", "username", "password", "preferred_currency")
        read_only_fields = ("id",)
        extra_kwargs = {
            "preferred_currency": {"required": False},
        }

    def validate_email(self, value):
        """Rechaza emails ya registrados sin distinguir mayúsculas."""
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError(
                "Ya existe una cuenta registrada con este correo electrónico."
            )
        return value

    def create(self, validated_data):
        """Crea el usuario con contraseña hasheada; el hash nunca se retorna."""
        return User.objects.create_user(**validated_data)


class UserProfileSerializer(serializers.ModelSerializer):
    """Lectura y edición del perfil del usuario autenticado."""

    class Meta:
        model = User
        fields = ("id", "email", "username", "preferred_currency", "date_joined")
        read_only_fields = ("id", "email", "date_joined")


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Añade datos del usuario a los claims del token de acceso."""

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["email"] = user.email
        token["preferred_currency"] = user.preferred_currency
        return token

    def validate(self, attrs):
        """Extiende la respuesta estándar con los datos públicos del usuario."""
        data = super().validate(attrs)
        data["user"] = UserProfileSerializer(self.user).data
        return data
