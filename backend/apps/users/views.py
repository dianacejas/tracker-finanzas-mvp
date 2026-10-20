"""Vistas del módulo de usuarios: registro, sesión JWT y perfil."""

from django.conf import settings
from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import (
    TokenBlacklistView as SimpleJWTTokenBlacklistView,
)
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .serializers import (
    CustomTokenObtainPairSerializer,
    UserProfileSerializer,
    UserRegistrationSerializer,
)

REFRESH_COOKIE_NAME = "refresh_token"


def _set_refresh_cookie(response, refresh_token, max_age):
    """Adjunta el refresh token como cookie HttpOnly inaccesible desde JavaScript."""
    response.set_cookie(
        REFRESH_COOKIE_NAME,
        str(refresh_token),
        max_age=int(max_age),
        httponly=True,
        secure=not settings.DEBUG,
        samesite="Lax",
        path="/api/v1/auth/",
    )
    return response


class RegisterView(generics.CreateAPIView):
    """Registro de nuevas cuentas. Acceso público."""

    serializer_class = UserRegistrationSerializer
    permission_classes = (AllowAny,)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(
            UserProfileSerializer(user).data,
            status=status.HTTP_201_CREATED,
        )


class LoginView(TokenObtainPairView):
    """Autenticación por email. El refresh viaja en cookie HttpOnly."""

    serializer_class = CustomTokenObtainPairSerializer
    permission_classes = (AllowAny,)

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        refresh_token = response.data.pop("refresh", None)
        if refresh_token is not None:
            _set_refresh_cookie(
                response,
                refresh_token,
                settings.SIMPLE_JWT["REFRESH_TOKEN_LIFETIME"].total_seconds(),
            )
        return response


class RefreshView(TokenRefreshView):
    """Rota el par de tokens aceptando el refresh por cookie o por cuerpo."""

    permission_classes = (AllowAny,)

    def post(self, request, *args, **kwargs):
        data = request.data.copy()
        if not data.get("refresh"):
            cookie_token = request.COOKIES.get(REFRESH_COOKIE_NAME)
            if not cookie_token:
                raise InvalidToken("No se proporcionó un refresh token válido.")
            data["refresh"] = cookie_token

        serializer = self.get_serializer(data=data)
        try:
            serializer.is_valid(raise_exception=True)
        except TokenError as exc:
            raise InvalidToken(exc.args[0]) from exc

        response = Response(serializer.validated_data, status=status.HTTP_200_OK)
        new_refresh = serializer.validated_data.get("refresh")
        if new_refresh is not None:
            _set_refresh_cookie(
                response,
                new_refresh,
                settings.SIMPLE_JWT["REFRESH_TOKEN_LIFETIME"].total_seconds(),
            )
        return response


class LogoutView(SimpleJWTTokenBlacklistView):
    """Invalida el refresh token y elimina la cookie de sesión."""

    permission_classes = (AllowAny,)

    def post(self, request, *args, **kwargs):
        data = request.data.copy()
        if not data.get("refresh"):
            cookie_token = request.COOKIES.get(REFRESH_COOKIE_NAME)
            if not cookie_token:
                raise InvalidToken("No se proporcionó un refresh token válido.")
            data["refresh"] = cookie_token

        serializer = self.get_serializer(data=data)
        try:
            serializer.is_valid(raise_exception=True)
        except TokenError as exc:
            raise InvalidToken(exc.args[0]) from exc

        response = Response(status=status.HTTP_204_NO_CONTENT)
        response.delete_cookie(REFRESH_COOKIE_NAME, path="/api/v1/auth/")
        return response


class UserProfileView(generics.RetrieveUpdateAPIView):
    """Consulta y edición del perfil del usuario autenticado."""

    serializer_class = UserProfileSerializer
    permission_classes = (IsAuthenticated,)

    def get_object(self):
        return self.request.user


def issue_tokens_for_user(user):
    """Genera un par de tokens para el usuario indicado (uso interno/servicios)."""
    refresh = RefreshToken.for_user(user)
    return {"refresh": str(refresh), "access": str(refresh.access_token)}
