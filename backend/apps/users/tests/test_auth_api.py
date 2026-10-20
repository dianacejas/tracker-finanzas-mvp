"""Tests de integración del flujo de autenticación JWT."""

from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import AccessToken, RefreshToken

User = get_user_model()

PASSWORD = "ClaveSegura123"
REFRESH_COOKIE = "refresh_token"


class RegistrationAPITests(APITestCase):
    """Alta de cuentas contra POST /api/v1/auth/register/."""

    def setUp(self):
        self.url = reverse("api:auth:register")
        self.payload = {
            "email": "nueva@example.com",
            "username": "nueva",
            "password": PASSWORD,
            "preferred_currency": "EUR",
        }

    def test_register_success_returns_201_without_password(self):
        """Un registro válido responde 201 y no expone el hash de contraseña."""
        response = self.client.post(self.url, self.payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertNotIn("password", response.data)
        self.assertEqual(response.data["email"], "nueva@example.com")
        self.assertEqual(response.data["preferred_currency"], "EUR")

        user = User.objects.get(email="nueva@example.com")
        self.assertTrue(user.check_password(PASSWORD))

    def test_register_hashes_password_in_database(self):
        """La contraseña se persiste hasheada tras el registro."""
        self.client.post(self.url, self.payload, format="json")

        user = User.objects.get(email="nueva@example.com")
        self.assertNotEqual(user.password, PASSWORD)
        self.assertTrue(user.password.startswith("pbkdf2_"))

    def test_register_duplicate_email_returns_400(self):
        """Un email ya registrado responde 400 con error de validación."""
        User.objects.create_user(
            email="nueva@example.com", username="existente", password=PASSWORD
        )

        response = self.client.post(self.url, self.payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("email", response.data)

    def test_register_duplicate_email_is_case_insensitive(self):
        """La unicidad de email no distingue mayúsculas."""
        User.objects.create_user(
            email="nueva@example.com", username="existente", password=PASSWORD
        )
        payload = {**self.payload, "email": "NUEVA@example.com"}

        response = self.client.post(self.url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("email", response.data)

    def test_register_weak_password_returns_400(self):
        """Una contraseña débil responde 400 con error en el campo password."""
        payload = {**self.payload, "password": "12345678"}

        response = self.client.post(self.url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("password", response.data)

    def test_register_requires_email(self):
        """El registro sin email responde 400."""
        payload = {**self.payload}
        payload.pop("email")

        response = self.client.post(self.url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("email", response.data)

    def test_register_is_idempotent_in_user_count(self):
        """Un registro fallido no crea usuarios adicionales."""
        self.client.post(self.url, self.payload, format="json")
        self.client.post(self.url, self.payload, format="json")

        self.assertEqual(User.objects.count(), 1)


class LoginAPITests(APITestCase):
    """Obtención del par de tokens contra POST /api/v1/auth/token/."""

    def setUp(self):
        self.url = reverse("api:auth:token_obtain_pair")
        self.user = User.objects.create_user(
            email="ana@example.com", username="ana", password=PASSWORD
        )

    def test_login_returns_access_and_sets_refresh_cookie(self):
        """El login responde 200 con access y entrega el refresh en cookie HttpOnly."""
        response = self.client.post(
            self.url, {"email": "ana@example.com", "password": PASSWORD}, format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)

        cookie = response.cookies.get(REFRESH_COOKIE)
        self.assertIsNotNone(cookie)
        self.assertTrue(cookie["httponly"])

    def test_login_does_not_expose_refresh_in_body(self):
        """El refresh token nunca viaja en el cuerpo de la respuesta."""
        response = self.client.post(
            self.url, {"email": "ana@example.com", "password": PASSWORD}, format="json"
        )

        self.assertNotIn("refresh", response.data)

    def test_login_returns_user_profile_payload(self):
        """La respuesta incluye los datos públicos del usuario."""
        response = self.client.post(
            self.url, {"email": "ana@example.com", "password": PASSWORD}, format="json"
        )

        self.assertIn("user", response.data)
        self.assertEqual(response.data["user"]["email"], "ana@example.com")
        self.assertNotIn("password", response.data["user"])

    def test_login_with_wrong_password_returns_401(self):
        """Una contraseña incorrecta responde 401."""
        response = self.client.post(
            self.url, {"email": "ana@example.com", "password": "Incorrecta999"}, format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_login_with_unknown_email_returns_401(self):
        """Un email inexistente responde 401."""
        response = self.client.post(
            self.url, {"email": "nadie@example.com", "password": PASSWORD}, format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_login_updates_last_login(self):
        """El login registra la fecha del último acceso."""
        self.assertIsNone(self.user.last_login)

        self.client.post(
            self.url, {"email": "ana@example.com", "password": PASSWORD}, format="json"
        )

        self.user.refresh_from_db()
        self.assertIsNotNone(self.user.last_login)

    def test_login_requires_exact_email_case(self):
        """El login exige coincidencia exacta del email almacenado."""
        response = self.client.post(
            self.url, {"email": "ana@EXAMPLE.com", "password": PASSWORD}, format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class RefreshTokenAPITests(APITestCase):
    """Rotación de tokens contra POST /api/v1/auth/token/refresh/."""

    def setUp(self):
        self.url = reverse("api:auth:token_refresh")
        self.user = User.objects.create_user(
            email="ana@example.com", username="ana", password=PASSWORD
        )
        self.refresh = RefreshToken.for_user(self.user)

    def test_refresh_returns_new_access_token(self):
        """Un refresh válido emite un nuevo access token."""
        response = self.client.post(
            self.url, {"refresh": str(self.refresh)}, format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)

        token = AccessToken(response.data["access"])
        self.assertEqual(int(token["user_id"]), self.user.id)

    def test_refresh_rotates_token_and_blacklists_previous(self):
        """La rotación invalida el refresh anterior."""
        first = self.client.post(self.url, {"refresh": str(self.refresh)}, format="json")
        self.assertEqual(first.status_code, status.HTTP_200_OK)
        rotated = first.data["refresh"]
        self.assertNotEqual(rotated, str(self.refresh))

        second = self.client.post(self.url, {"refresh": str(self.refresh)}, format="json")

        self.assertEqual(second.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_refresh_with_invalid_token_returns_401(self):
        """Un refresh alterado responde 401."""
        response = self.client.post(
            self.url, {"refresh": "token.alterado.invalido"}, format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_refresh_without_token_returns_401(self):
        """La petición sin refresh responde 401 en lugar de fallar con 400."""
        response = self.client.post(self.url, {}, format="json")

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_refresh_with_blacklisted_token_returns_401(self):
        """Un refresh revocado no puede reutilizarse."""
        self.refresh.blacklist()

        response = self.client.post(
            self.url, {"refresh": str(self.refresh)}, format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class ProfileAPITests(APITestCase):
    """Acceso al perfil contra GET /api/v1/auth/me/."""

    def setUp(self):
        self.url = reverse("api:auth:me")
        self.user = User.objects.create_user(
            email="ana@example.com", username="ana", password=PASSWORD
        )
        self.access = str(AccessToken.for_user(self.user))

    def test_profile_with_valid_token_returns_200(self):
        """El token válido permite consultar el perfil."""
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.access}")

        response = self.client.get(self.url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["email"], "ana@example.com")
        self.assertEqual(response.data["preferred_currency"], "USD")
        self.assertNotIn("password", response.data)

    def test_profile_without_token_returns_401(self):
        """La petición sin cabecera Authorization responde 401."""
        response = self.client.get(self.url)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_profile_with_malformed_token_returns_401(self):
        """Un token alterado responde 401."""
        self.client.credentials(HTTP_AUTHORIZATION="Bearer token.invalido.alterado")

        response = self.client.get(self.url)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_profile_with_expired_token_returns_401(self):
        """Un token expirado responde 401."""
        expired = AccessToken.for_user(self.user)
        expired.set_exp(lifetime=-AccessToken.lifetime)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {expired}")

        response = self.client.get(self.url)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_profile_update_currency(self):
        """El perfil admite actualizar la moneda preferida."""
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.access}")

        response = self.client.patch(self.url, {"preferred_currency": "ARS"}, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertEqual(self.user.preferred_currency, "ARS")

    def test_profile_is_scoped_to_authenticated_user(self):
        """El perfil devuelve siempre el usuario del token, sin exponer a otros."""
        otro = User.objects.create_user(
            email="otro@example.com", username="otro", password=PASSWORD
        )
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.access}")

        response = self.client.get(self.url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertNotEqual(response.data["email"], otro.email)


class LogoutAPITests(APITestCase):
    """Cierre de sesión contra POST /api/v1/auth/logout/."""

    def setUp(self):
        self.url = reverse("api:auth:logout")
        self.refresh_url = reverse("api:auth:token_refresh")
        self.user = User.objects.create_user(
            email="ana@example.com", username="ana", password=PASSWORD
        )
        self.refresh = RefreshToken.for_user(self.user)

    def test_logout_blacklists_refresh_token(self):
        """El logout responde 204 y revoca el refresh token."""
        response = self.client.post(
            self.url, {"refresh": str(self.refresh)}, format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

        reuse = self.client.post(
            self.refresh_url, {"refresh": str(self.refresh)}, format="json"
        )
        self.assertEqual(reuse.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_logout_without_token_returns_401(self):
        """El logout sin refresh responde 401."""
        response = self.client.post(self.url, {}, format="json")

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class ProtectedEndpointGuardTests(APITestCase):
    """Guardia global de rutas protegidas."""

    def test_protected_endpoint_requires_authentication(self):
        """Sin token, un endpoint protegido responde 401 y no filtra datos."""
        response = self.client.get(reverse("api:auth:me"))

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertNotIn("email", response.data)
