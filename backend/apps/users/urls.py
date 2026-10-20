"""Rutas del módulo de usuarios, montadas bajo /api/v1/auth/."""

from django.urls import path

from .views import (
    LoginView,
    LogoutView,
    RefreshView,
    RegisterView,
    UserProfileView,
)

app_name = "auth"

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("token/", LoginView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", RefreshView.as_view(), name="token_refresh"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("me/", UserProfileView.as_view(), name="me"),
]
