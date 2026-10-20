"""Tests unitarios del modelo de usuario personalizado y su manager."""

from django.contrib.auth import get_user_model
from django.db import IntegrityError, transaction
from django.test import TestCase

User = get_user_model()

PASSWORD = "ClaveSegura123"


class UserModelTests(TestCase):
    """Integridad del modelo User y del UserManager personalizado."""

    def test_create_user_with_email_and_password(self):
        """Un usuario se crea con email como identificador principal."""
        user = User.objects.create_user(
            email="ana@example.com", username="ana", password=PASSWORD
        )

        self.assertEqual(user.email, "ana@example.com")
        self.assertEqual(user.USERNAME_FIELD, "email")
        self.assertTrue(user.is_active)
        self.assertFalse(user.is_staff)
        self.assertFalse(user.is_superuser)
        self.assertEqual(str(user), "ana@example.com")

    def test_create_user_requires_email(self):
        """El manager rechaza la creación sin email."""
        with self.assertRaises(ValueError):
            User.objects.create_user(email="", username="sinemail", password=PASSWORD)

    def test_email_must_be_unique(self):
        """Un email duplicado dispara IntegrityError en la base de datos."""
        User.objects.create_user(
            email="ana@example.com", username="ana", password=PASSWORD
        )

        with self.assertRaises(IntegrityError):
            with transaction.atomic():
                User.objects.create_user(
                    email="ana@example.com", username="otra", password=PASSWORD
                )

    def test_password_is_hashed_in_database(self):
        """La contraseña nunca se almacena en texto plano."""
        user = User.objects.create_user(
            email="ana@example.com", username="ana", password=PASSWORD
        )

        self.assertNotEqual(user.password, PASSWORD)
        self.assertNotIn(PASSWORD, user.password)
        self.assertTrue(user.password.startswith("pbkdf2_"))
        self.assertTrue(user.check_password(PASSWORD))

    def test_create_superuser_sets_flags(self):
        """El superusuario se crea con permisos de staff y superuser."""
        admin = User.objects.create_superuser(
            email="admin@example.com", username="admin", password=PASSWORD
        )

        self.assertTrue(admin.is_staff)
        self.assertTrue(admin.is_superuser)
        self.assertTrue(admin.is_active)

    def test_create_superuser_rejects_is_staff_false(self):
        """El manager impide crear un superusuario sin permisos de staff."""
        with self.assertRaises(ValueError):
            User.objects.create_superuser(
                email="admin@example.com",
                username="admin",
                password=PASSWORD,
                is_staff=False,
            )

    def test_preferred_currency_defaults_to_usd(self):
        """La moneda preferida toma USD como valor por defecto."""
        user = User.objects.create_user(
            email="ana@example.com", username="ana", password=PASSWORD
        )

        self.assertEqual(user.preferred_currency, "USD")

    def test_preferred_currency_accepts_custom_value(self):
        """La moneda preferida admite códigos ISO 4217 personalizados."""
        user = User.objects.create_user(
            email="ana@example.com",
            username="ana",
            password=PASSWORD,
            preferred_currency="ARS",
        )

        self.assertEqual(user.preferred_currency, "ARS")
        self.assertEqual(user._meta.get_field("preferred_currency").max_length, 3)
