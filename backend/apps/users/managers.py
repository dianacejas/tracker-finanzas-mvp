"""Gestores de consulta para el modelo de usuario personalizado."""

from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import UserManager as DjangoUserManager
from django.db import models


class UserQuerySet(models.QuerySet):
    """Conjunto de usuarios con un borrado en bloque seguro.

    `QuerySet.delete()` no pasa por el método `delete()` del modelo, así que el
    borrado de una cuenta debe resolver aquí el mismo conflicto de relaciones
    protegidas que resuelve `User.delete()`.
    """

    def delete(self):
        """Retira los movimientos antes de borrar las cuentas.

        Los movimientos protegen a su categoría con `on_delete=PROTECT`. Si se
        borraran las cuentas antes que los movimientos, Django abortaría la
        operación al encontrar la categoría privada protegida. Retirando los
        movimientos primero, la cuenta, sus movimientos y sus categorías
        privadas desaparecen juntos.
        """
        from apps.transactions.models import Transaction

        Transaction.objects.filter(user__in=self).delete()
        return super().delete()


class UserManager(DjangoUserManager):
    """Manager que identifica a los usuarios por email en lugar de username."""

    use_in_migrations = True

    def get_queryset(self):
        """Devuelve el conjunto con el borrado en bloque seguro."""
        return UserQuerySet(
            model=self.model, using=self._db, hints=self._hints
        )

    def _create_user(self, email, password, **extra_fields):
        if not email:
            raise ValueError("El email es obligatorio para crear un usuario.")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.password = make_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", False)
        extra_fields.setdefault("is_superuser", False)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("El superusuario debe tener is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("El superusuario debe tener is_superuser=True.")

        return self._create_user(email, password, **extra_fields)
